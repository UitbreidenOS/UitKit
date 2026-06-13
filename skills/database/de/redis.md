---
name: redis
description: "Redis patterns: caching, sessions, rate limiting, pub/sub, queues, distributed locks — with Python and Node.js examples"
---

> 🇩🇪 Deutsche Version. [Englische Version](../redis.md).

# Redis Skill

## Wann aktivieren
- Caching teurer Datenbankabfragen oder API-Antworten
- Benutzersessions serverseitig speichern
- Rate Limiting auf API-Endpunkten implementieren
- Eine Job-Queue aufbauen (BullMQ, Celery, RQ)
- Echtzeit-Features mit pub/sub (Benachrichtigungen, Chat)
- Distributed Locks über mehrere Server
- Ranglisten und sorted sets

## Wann NICHT verwenden
- Dauerhafte Datenspeicherung — Redis ist in-memory, Datenverlust ist möglich
- Komplexe relationale Abfragen — PostgreSQL verwenden
- Große Binärdateien — S3/Object Storage verwenden
- Wenn ein einfacher In-Memory-Cache innerhalb eines einzelnen Prozesses ausreicht — ein LRU-Dict verwenden

## Anweisungen

### Verbindungsaufbau

**Node.js (ioredis):**
```typescript
import Redis from 'ioredis'

// Einzelne Instanz
const redis = new Redis(process.env.REDIS_URL!)

// Mit Retry-Logik
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

# Mit Connection Pool
pool = redis.ConnectionPool.from_url(os.environ["REDIS_URL"], max_connections=20)
r = redis.Redis(connection_pool=pool, decode_responses=True)
```

### Caching-Muster

**Einfaches Cache-Aside (am häufigsten):**
```typescript
async function getCachedUser(userId: string): Promise<User> {
  const key = `user:${userId}`
  const cached = await redis.get(key)

  if (cached) return JSON.parse(cached)

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new NotFoundError()

  // Für 5 Minuten cachen
  await redis.setex(key, 300, JSON.stringify(user))
  return user
}

// Bei Update invalidieren
async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.user.update({ where: { id: userId }, data })
  await redis.del(`user:${userId}`)  // Cache leeren
  return user
}
```

**Cache mit stale-while-revalidate:**
```typescript
async function getCached<T>(
  key: string,
  ttlSec: number,
  fetch: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) {
    // Im Hintergrund aktualisieren wenn TTL < 20% verbleibend
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

**Batch-Abruf (Pipeline):**
```typescript
// Mehrere Schlüssel in einem Round-Trip abrufen
const keys = userIds.map(id => `user:${id}`)
const pipeline = redis.pipeline()
keys.forEach(key => pipeline.get(key))
const results = await pipeline.exec()

const users = results.map((result, i) =>
  result[1] ? JSON.parse(result[1] as string) : null
)
```

### Sessions

```typescript
// Session-Speicherung (express-session + connect-redis)
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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
  },
}))

// Benutzerdefinierte Session (JWT + Redis-Blacklist)
async function invalidateToken(jti: string, expiresAt: number) {
  const ttl = expiresAt - Math.floor(Date.now() / 1000)
  if (ttl > 0) await redis.setex(`blacklist:${jti}`, ttl, '1')
}

async function isTokenBlacklisted(jti: string): Promise<boolean> {
  return (await redis.exists(`blacklist:${jti}`)) === 1
}
```

### Rate Limiting

```typescript
// Gleitendes Fenster Rate Limiter
async function rateLimit(
  identifier: string, // IP oder Benutzer-ID
  limit: number,       // max. Anfragen
  windowSec: number    // Zeitfenster
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = windowSec * 1000

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, 0, now - windowMs)  // alte Einträge entfernen
  pipeline.zadd(key, now, `${now}-${Math.random()}`)  // aktuelle Anfrage hinzufügen
  pipeline.zcard(key)                                  // Anfragen im Fenster zählen
  pipeline.expire(key, windowSec)

  const results = await pipeline.exec()
  const count = results![2][1] as number

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: Math.ceil((now + windowMs) / 1000),
  }
}

// Verwendung in Middleware
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

// Subscriber (separate Verbindung — gleicher Client kann nicht für pub/sub verwendet werden)
const subscriber = new Redis(process.env.REDIS_URL!)

await subscriber.subscribe('order-updates')
subscriber.on('message', (channel, message) => {
  const event = JSON.parse(message)
  console.log(`Event on ${channel}:`, event)
  // Ereignis verarbeiten...
})

// Muster-Abonnement (Wildcard)
await subscriber.psubscribe('user:*:notifications')
subscriber.on('pmessage', (pattern, channel, message) => {
  const userId = channel.split(':')[1]
  handleNotification(userId, JSON.parse(message))
})
```

### Job-Queues (BullMQ)

```typescript
import { Queue, Worker } from 'bullmq'

// Produzent — Jobs hinzufügen
const emailQueue = new Queue('emails', {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
})

await emailQueue.add('welcome-email', {
  to: 'user@example.com',
  template: 'welcome',
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  delay: 5000, // 5s Verzögerung vor dem ersten Versuch
})

// Konsument — Jobs verarbeiten
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

### Distributed Locks

```typescript
// Doppelte Verarbeitung verhindern (z.B. Zahlungs-Webhooks)
async function withLock<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T | null> {
  const lockId = crypto.randomUUID()
  const acquired = await redis.set(
    `lock:${key}`, lockId,
    'PX', ttlMs,  // TTL in Millisekunden
    'NX',         // nur setzen wenn nicht vorhanden
  )

  if (!acquired) return null  // ein anderer Prozess hält den Lock

  try {
    return await fn()
  } finally {
    // Nur freigeben wenn wir den Lock noch besitzen (Lua-Skript = atomar)
    await redis.eval(
      `if redis.call("get",KEYS[1]) == ARGV[1] then
         return redis.call("del",KEYS[1])
       else return 0 end`,
      1, `lock:${key}`, lockId
    )
  }
}

// Verwendung
const result = await withLock(`payment:${webhookId}`, 30000, async () => {
  return processPaymentWebhook(webhookId)
})
if (result === null) console.log('Already being processed by another instance')
```

### Sorted Sets (Ranglisten)

```typescript
// Score hinzufügen/aktualisieren
await redis.zadd('leaderboard', { score: 1250, member: userId })

// Score erhöhen
await redis.zincrby('leaderboard', 50, userId)

// Top 10 abrufen
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES')

// Benutzerrang abrufen (0-indiziert)
const rank = await redis.zrevrank('leaderboard', userId)

// Benutzerscore abrufen
const score = await redis.zscore('leaderboard', userId)
```

## Beispiel

**Benutzer:** Redis-Caching zu einer FastAPI-App hinzufügen mit Rate Limiting (100 Req/min pro IP) und einer BullMQ E-Mail-Queue.

**Erwartete Ausgabe:**
- `redis.py` — Helper `get_cached()`, `set_cached()`, `invalidate()`
- `middleware/rate_limit.py` — gleitendes Fenster Rate Limiter mit ZADD
- `routes/users.py` — Cache-Aside bei GET /users/{id}, Invalidierung bei PUT
- `queues/email_queue.ts` (BullMQ) — Produzent + Worker mit Retry/Backoff

---
