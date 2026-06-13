---
name: redis
description: "Redis patterns: caching, sessions, rate limiting, pub/sub, queues, distributed locks — with Python and Node.js examples"
updated: 2026-06-13
---

# Redis Skill

## When to activate
- Caching expensive database queries or API responses
- Storing user sessions server-side
- Implementing rate limiting on API endpoints
- Building a job queue (BullMQ, Celery, RQ)
- Real-time features with pub/sub (notifications, chat)
- Distributed locks across multiple servers
- Leaderboards and sorted sets

## When NOT to use
- Permanent data storage — Redis is in-memory, data loss is possible
- Complex relational queries — use PostgreSQL
- Large binary files — use S3/object storage
- When you just need a simple in-memory cache within one process — use an LRU dict

## Instructions

### Connection setup

**Node.js (ioredis):**
```typescript
import Redis from 'ioredis'

// Single instance
const redis = new Redis(process.env.REDIS_URL!)

// With retry logic
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

# With connection pool
pool = redis.ConnectionPool.from_url(os.environ["REDIS_URL"], max_connections=20)
r = redis.Redis(connection_pool=pool, decode_responses=True)
```

### Caching patterns

**Simple cache-aside (most common):**
```typescript
async function getCachedUser(userId: string): Promise<User> {
  const key = `user:${userId}`
  const cached = await redis.get(key)

  if (cached) return JSON.parse(cached)

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new NotFoundError()

  // Cache for 5 minutes
  await redis.setex(key, 300, JSON.stringify(user))
  return user
}

// Invalidate on update
async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.user.update({ where: { id: userId }, data })
  await redis.del(`user:${userId}`)  // bust cache
  return user
}
```

**Cache with stale-while-revalidate:**
```typescript
async function getCached<T>(
  key: string,
  ttlSec: number,
  fetch: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) {
    // Refresh in background if TTL < 20% remaining
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

**Batch get (pipeline):**
```typescript
// Fetch multiple keys in one round trip
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
// Session storage (express-session + connect-redis)
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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}))

// Custom session (JWT + Redis blacklist)
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
// Sliding window rate limiter
async function rateLimit(
  identifier: string, // IP or user ID
  limit: number,       // max requests
  windowSec: number    // time window
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = windowSec * 1000

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, 0, now - windowMs)  // remove old entries
  pipeline.zadd(key, now, `${now}-${Math.random()}`)  // add current request
  pipeline.zcard(key)                                  // count requests in window
  pipeline.expire(key, windowSec)

  const results = await pipeline.exec()
  const count = results![2][1] as number

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: Math.ceil((now + windowMs) / 1000),
  }
}

// Usage in middleware
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

// Subscriber (separate connection — can't use same client for pub/sub)
const subscriber = new Redis(process.env.REDIS_URL!)

await subscriber.subscribe('order-updates')
subscriber.on('message', (channel, message) => {
  const event = JSON.parse(message)
  console.log(`Event on ${channel}:`, event)
  // handle the event...
})

// Pattern subscribe (wildcard)
await subscriber.psubscribe('user:*:notifications')
subscriber.on('pmessage', (pattern, channel, message) => {
  const userId = channel.split(':')[1]
  handleNotification(userId, JSON.parse(message))
})
```

### Job queues (BullMQ)

```typescript
import { Queue, Worker } from 'bullmq'

// Producer — add jobs
const emailQueue = new Queue('emails', {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
})

await emailQueue.add('welcome-email', {
  to: 'user@example.com',
  template: 'welcome',
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  delay: 5000, // delay 5s before first attempt
})

// Consumer — process jobs
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
// Prevent duplicate processing (e.g., payment webhooks)
async function withLock<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T | null> {
  const lockId = crypto.randomUUID()
  const acquired = await redis.set(
    `lock:${key}`, lockId,
    'PX', ttlMs,  // TTL in milliseconds
    'NX',         // only set if not exists
  )

  if (!acquired) return null  // another process holds the lock

  try {
    return await fn()
  } finally {
    // Only release if we still own the lock (Lua script = atomic)
    await redis.eval(
      `if redis.call("get",KEYS[1]) == ARGV[1] then
         return redis.call("del",KEYS[1])
       else return 0 end`,
      1, `lock:${key}`, lockId
    )
  }
}

// Usage
const result = await withLock(`payment:${webhookId}`, 30000, async () => {
  return processPaymentWebhook(webhookId)
})
if (result === null) console.log('Already being processed by another instance')
```

### Sorted sets (leaderboards)

```typescript
// Add/update score
await redis.zadd('leaderboard', { score: 1250, member: userId })

// Increment score
await redis.zincrby('leaderboard', 50, userId)

// Get top 10
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES')

// Get user's rank (0-indexed)
const rank = await redis.zrevrank('leaderboard', userId)

// Get user's score
const score = await redis.zscore('leaderboard', userId)
```

## Example

**User:** Add Redis caching to a FastAPI app with rate limiting (100 req/min per IP) and a BullMQ email queue.

**Expected output:**
- `redis.py` — `get_cached()`, `set_cached()`, `invalidate()` helpers
- `middleware/rate_limit.py` — sliding window rate limiter using ZADD
- `routes/users.py` — cache-aside on GET /users/{id}, invalidate on PUT
- `queues/email_queue.ts` (BullMQ) — producer + worker with retry/backoff

---
