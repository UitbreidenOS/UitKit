---
name: redis
description: "Redis patterns: caching, sessions, rate limiting, pub/sub, queues, distributed locks — with Python and Node.js examples"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../redis.md).

# Redis Skill

## Wanneer activeren
- Dure databasequery's of API-antwoorden cachen
- Gebruikerssessies aan de serverzijde opslaan
- Rate limiting implementeren op API-endpoints
- Een taakwachtrij bouwen (BullMQ, Celery, RQ)
- Realtime-functies met pub/sub (meldingen, chat)
- Distributed locks over meerdere servers
- Ranglijsten en sorted sets

## Wanneer NIET gebruiken
- Permanente gegevensopslag — Redis is in-memory, gegevensverlies is mogelijk
- Complexe relationele query's — gebruik PostgreSQL
- Grote binaire bestanden — gebruik S3/object storage
- Wanneer een eenvoudige in-memory cache binnen één proces volstaat — gebruik een LRU-dict

## Instructies

### Verbinding instellen

**Node.js (ioredis):**
```typescript
import Redis from 'ioredis'

// Enkele instantie
const redis = new Redis(process.env.REDIS_URL!)

// Met retry-logica
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
})
```

**Python (redis-py):**
```python
import redis

r = redis.Redis.from_url(os.environ["REDIS_URL"], decode_responses=True)

# Met verbindingspool
pool = redis.ConnectionPool.from_url(os.environ["REDIS_URL"], max_connections=20)
r = redis.Redis(connection_pool=pool, decode_responses=True)
```

### Caching-patronen

**Eenvoudige cache-aside (meest voorkomend):**
```typescript
async function getCachedUser(userId: string): Promise<User> {
  const key = `user:${userId}`
  const cached = await redis.get(key)

  if (cached) return JSON.parse(cached)

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new NotFoundError()

  // 5 minuten cachen
  await redis.setex(key, 300, JSON.stringify(user))
  return user
}

// Invalideren bij update
async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.user.update({ where: { id: userId }, data })
  await redis.del(`user:${userId}`)  // cache leegmaken
  return user
}
```

**Cache met stale-while-revalidate:**
```typescript
async function getCached<T>(
  key: string,
  ttlSec: number,
  fetch: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) {
    // Op achtergrond vernieuwen als TTL < 20% resterend
    const ttl = await redis.ttl(key)
    if (ttl < ttlSec * 0.2) {
      fetch().then(data => redis.setex(key, ttlSec, JSON.stringify(data)))
    }
    return JSON.parse(cached)
  }

  const data = await fetch()
  await redis.setex(key, ttlSec, JSON.stringify(data))
  return data
}
```

**Batch ophalen (pipeline):**
```typescript
// Meerdere sleutels in één round-trip ophalen
const keys = userIds.map(id => `user:${id}`)
const pipeline = redis.pipeline()
keys.forEach(key => pipeline.get(key))
const results = await pipeline.exec()

const users = results.map((result, i) =>
  result[1] ? JSON.parse(result[1] as string) : null
)
```

### Sessies

```typescript
// Sessieopslag (express-session + connect-redis)
import session from 'express-session'
import { RedisStore } from 'connect-redis'

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dagen
  },
}))

// Aangepaste sessie (JWT + Redis-zwarte lijst)
async function invalidateToken(jti: string, expiresAt: number) {
  const ttl = expiresAt - Math.floor(Date.now() / 1000)
  if (ttl > 0) await redis.setex(`blacklist:${jti}`, ttl, '1')
}

async function isTokenBlacklisted(jti: string): Promise<boolean> {
  return (await redis.exists(`blacklist:${jti}`)) === 1
}
```

### Rate limiting

```typescript
// Glijdend venster rate limiter
async function rateLimit(
  identifier: string, // IP of gebruikers-ID
  limit: number,       // max verzoeken
  windowSec: number    // tijdvenster
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = windowSec * 1000

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, 0, now - windowMs)  // oude vermeldingen verwijderen
  pipeline.zadd(key, now, `${now}-${Math.random()}`)  // huidig verzoek toevoegen
  pipeline.zcard(key)                                  // verzoeken in venster tellen
  pipeline.expire(key, windowSec)

  const results = await pipeline.exec()
  const count = results![2][1] as number

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: Math.ceil((now + windowMs) / 1000),
  }
}

// Gebruik in middleware
app.use(async (req, res, next) => {
  const { allowed, remaining, reset } = await rateLimit(req.ip, 100, 60)
  res.setHeader('X-RateLimit-Remaining', remaining)
  res.setHeader('X-RateLimit-Reset', reset)
  if (!allowed) return res.status(429).json({ error: 'Rate limit exceeded' })
  next()
})
```

### Pub/Sub

```typescript
// Publisher
const publisher = new Redis(process.env.REDIS_URL!)

async function publishEvent(channel: string, data: object) {
  await publisher.publish(channel, JSON.stringify(data))
}

// Subscriber (aparte verbinding — dezelfde client kan niet voor pub/sub worden gebruikt)
const subscriber = new Redis(process.env.REDIS_URL!)

await subscriber.subscribe('order-updates')
subscriber.on('message', (channel, message) => {
  const event = JSON.parse(message)
  console.log(`Event on ${channel}:`, event)
  // het evenement verwerken...
})

// Patroonabonnement (wildcard)
await subscriber.psubscribe('user:*:notifications')
subscriber.on('pmessage', (pattern, channel, message) => {
  const userId = channel.split(':')[1]
  handleNotification(userId, JSON.parse(message))
})
```

### Taakwachtrijen (BullMQ)

```typescript
import { Queue, Worker } from 'bullmq'

// Producer — taken toevoegen
const emailQueue = new Queue('emails', {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
})

await emailQueue.add('welcome-email', {
  to: 'user@example.com',
  template: 'welcome',
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  delay: 5000, // 5s vertraging voor eerste poging
})

// Consumer — taken verwerken
const worker = new Worker('emails', async (job) => {
  await sendEmail(job.data.to, job.data.template)
}, {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
  concurrency: 5,
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})
```

### Distributed locks

```typescript
// Dubbele verwerking voorkomen (bijv. betalingswebhooks)
async function withLock<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T | null> {
  const lockId = crypto.randomUUID()
  const acquired = await redis.set(
    `lock:${key}`, lockId,
    'PX', ttlMs,  // TTL in milliseconden
    'NX',         // alleen instellen als niet bestaat
  )

  if (!acquired) return null  // een ander proces houdt de lock

  try {
    return await fn()
  } finally {
    // Alleen vrijgeven als wij nog de lock bezitten (Lua-script = atomair)
    await redis.eval(
      `if redis.call("get",KEYS[1]) == ARGV[1] then
         return redis.call("del",KEYS[1])
       else return 0 end`,
      1, `lock:${key}`, lockId
    )
  }
}

// Gebruik
const result = await withLock(`payment:${webhookId}`, 30000, async () => {
  return processPaymentWebhook(webhookId)
})
if (result === null) console.log('Already being processed by another instance')
```

### Sorted sets (ranglijsten)

```typescript
// Score toevoegen/bijwerken
await redis.zadd('leaderboard', { score: 1250, member: userId })

// Score verhogen
await redis.zincrby('leaderboard', 50, userId)

// Top 10 ophalen
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES')

// Rang van gebruiker ophalen (0-geïndexeerd)
const rank = await redis.zrevrank('leaderboard', userId)

// Score van gebruiker ophalen
const score = await redis.zscore('leaderboard', userId)
```

## Voorbeeld

**Gebruiker:** Redis-caching toevoegen aan een FastAPI-app met rate limiting (100 verzoeken/min per IP) en een BullMQ e-mailwachtrij.

**Verwachte uitvoer:**
- `redis.py` — helpers `get_cached()`, `set_cached()`, `invalidate()`
- `middleware/rate_limit.py` — glijdend venster rate limiter met ZADD
- `routes/users.py` — cache-aside op GET /users/{id}, invalidering op PUT
- `queues/email_queue.ts` (BullMQ) — producer + worker met retry/backoff

---
