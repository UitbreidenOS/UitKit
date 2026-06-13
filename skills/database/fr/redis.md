---
name: redis
description: "Redis patterns: caching, sessions, rate limiting, pub/sub, queues, distributed locks — with Python and Node.js examples"
---

> 🇫🇷 Version française. [English version](../redis.md).

# Compétence Redis

## Quand l'activer
- Mettre en cache des requêtes de base de données coûteuses ou des réponses d'API
- Stocker des sessions utilisateur côté serveur
- Implémenter un rate limiting sur des endpoints d'API
- Construire une file de jobs (BullMQ, Celery, RQ)
- Fonctionnalités temps réel avec pub/sub (notifications, chat)
- Verrous distribués sur plusieurs serveurs
- Classements et sorted sets

## Quand NE PAS utiliser
- Stockage de données permanent — Redis est en mémoire, la perte de données est possible
- Requêtes relationnelles complexes — utiliser PostgreSQL
- Gros fichiers binaires — utiliser S3/object storage
- Quand un simple cache en mémoire au sein d'un seul processus suffit — utiliser un dict LRU

## Instructions

### Configuration de la connexion

**Node.js (ioredis) :**
```typescript
import Redis from 'ioredis'

// Instance unique
const redis = new Redis(process.env.REDIS_URL!)

// Avec logique de retry
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
})
```

**Python (redis-py) :**
```python
import redis

r = redis.Redis.from_url(os.environ["REDIS_URL"], decode_responses=True)

# Avec pool de connexions
pool = redis.ConnectionPool.from_url(os.environ["REDIS_URL"], max_connections=20)
r = redis.Redis(connection_pool=pool, decode_responses=True)
```

### Patterns de mise en cache

**Cache-aside simple (le plus courant) :**
```typescript
async function getCachedUser(userId: string): Promise<User> {
  const key = `user:${userId}`
  const cached = await redis.get(key)

  if (cached) return JSON.parse(cached)

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new NotFoundError()

  // Mettre en cache pour 5 minutes
  await redis.setex(key, 300, JSON.stringify(user))
  return user
}

// Invalider à la mise à jour
async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.user.update({ where: { id: userId }, data })
  await redis.del(`user:${userId}`)  // vider le cache
  return user
}
```

**Cache avec stale-while-revalidate :**
```typescript
async function getCached<T>(
  key: string,
  ttlSec: number,
  fetch: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) {
    // Rafraîchir en arrière-plan si TTL < 20% restant
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

**Récupération par lot (pipeline) :**
```typescript
// Récupérer plusieurs clés en un seul aller-retour
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
// Stockage de sessions (express-session + connect-redis)
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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  },
}))

// Session personnalisée (JWT + liste noire Redis)
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
// Rate limiter à fenêtre glissante
async function rateLimit(
  identifier: string, // IP ou ID utilisateur
  limit: number,       // nombre max de requêtes
  windowSec: number    // fenêtre temporelle
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = windowSec * 1000

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, 0, now - windowMs)  // supprimer les entrées anciennes
  pipeline.zadd(key, now, `${now}-${Math.random()}`)  // ajouter la requête courante
  pipeline.zcard(key)                                  // compter les requêtes dans la fenêtre
  pipeline.expire(key, windowSec)

  const results = await pipeline.exec()
  const count = results![2][1] as number

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: Math.ceil((now + windowMs) / 1000),
  }
}

// Utilisation dans un middleware
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
// Éditeur
const publisher = new Redis(process.env.REDIS_URL!)

async function publishEvent(channel: string, data: object) {
  await publisher.publish(channel, JSON.stringify(data))
}

// Abonné (connexion séparée — le même client ne peut pas être utilisé pour pub/sub)
const subscriber = new Redis(process.env.REDIS_URL!)

await subscriber.subscribe('order-updates')
subscriber.on('message', (channel, message) => {
  const event = JSON.parse(message)
  console.log(`Event on ${channel}:`, event)
  // traiter l'événement...
})

// Abonnement par motif (wildcard)
await subscriber.psubscribe('user:*:notifications')
subscriber.on('pmessage', (pattern, channel, message) => {
  const userId = channel.split(':')[1]
  handleNotification(userId, JSON.parse(message))
})
```

### Files de jobs (BullMQ)

```typescript
import { Queue, Worker } from 'bullmq'

// Producteur — ajouter des jobs
const emailQueue = new Queue('emails', {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
})

await emailQueue.add('welcome-email', {
  to: 'user@example.com',
  template: 'welcome',
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  delay: 5000, // délai de 5s avant la première tentative
})

// Consommateur — traiter les jobs
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

### Verrous distribués

```typescript
// Éviter le traitement en double (ex. webhooks de paiement)
async function withLock<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T | null> {
  const lockId = crypto.randomUUID()
  const acquired = await redis.set(
    `lock:${key}`, lockId,
    'PX', ttlMs,  // TTL en millisecondes
    'NX',         // définir uniquement si inexistant
  )

  if (!acquired) return null  // un autre processus détient le verrou

  try {
    return await fn()
  } finally {
    // Libérer uniquement si on possède toujours le verrou (script Lua = atomique)
    await redis.eval(
      `if redis.call("get",KEYS[1]) == ARGV[1] then
         return redis.call("del",KEYS[1])
       else return 0 end`,
      1, `lock:${key}`, lockId
    )
  }
}

// Utilisation
const result = await withLock(`payment:${webhookId}`, 30000, async () => {
  return processPaymentWebhook(webhookId)
})
if (result === null) console.log('Already being processed by another instance')
```

### Sorted sets (classements)

```typescript
// Ajouter/mettre à jour un score
await redis.zadd('leaderboard', { score: 1250, member: userId })

// Incrémenter le score
await redis.zincrby('leaderboard', 50, userId)

// Obtenir le top 10
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES')

// Obtenir le rang d'un utilisateur (indexé à 0)
const rank = await redis.zrevrank('leaderboard', userId)

// Obtenir le score d'un utilisateur
const score = await redis.zscore('leaderboard', userId)
```

## Exemple

**Utilisateur :** Ajouter la mise en cache Redis à une application FastAPI avec rate limiting (100 req/min par IP) et une file d'e-mails BullMQ.

**Sortie attendue :**
- `redis.py` — helpers `get_cached()`, `set_cached()`, `invalidate()`
- `middleware/rate_limit.py` — rate limiter à fenêtre glissante utilisant ZADD
- `routes/users.py` — cache-aside sur GET /users/{id}, invalidation sur PUT
- `queues/email_queue.ts` (BullMQ) — producteur + worker avec retry/backoff

---
