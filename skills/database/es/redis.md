---
name: redis
description: "Redis patterns: caching, sessions, rate limiting, pub/sub, queues, distributed locks — with Python and Node.js examples"
---

> 🇪🇸 Versión en español. [Versión en inglés](../redis.md).

# Habilidad Redis

## Cuándo activar
- Cachear consultas de base de datos costosas o respuestas de API
- Almacenar sesiones de usuario en el lado del servidor
- Implementar rate limiting en endpoints de API
- Construir una cola de tareas (BullMQ, Celery, RQ)
- Funcionalidades en tiempo real con pub/sub (notificaciones, chat)
- Distributed locks en múltiples servidores
- Clasificaciones y sorted sets

## Cuándo NO usar
- Almacenamiento permanente de datos — Redis es in-memory, la pérdida de datos es posible
- Consultas relacionales complejas — usar PostgreSQL
- Archivos binarios grandes — usar S3/object storage
- Cuando basta con un caché en memoria simple dentro de un solo proceso — usar un dict LRU

## Instrucciones

### Configuración de la conexión

**Node.js (ioredis):**
```typescript
import Redis from 'ioredis'

// Instancia única
const redis = new Redis(process.env.REDIS_URL!)

// Con lógica de retry
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

# Con pool de conexiones
pool = redis.ConnectionPool.from_url(os.environ["REDIS_URL"], max_connections=20)
r = redis.Redis(connection_pool=pool, decode_responses=True)
```

### Patrones de caché

**Cache-aside simple (el más común):**
```typescript
async function getCachedUser(userId: string): Promise<User> {
  const key = `user:${userId}`
  const cached = await redis.get(key)

  if (cached) return JSON.parse(cached)

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new NotFoundError()

  // Cachear por 5 minutos
  await redis.setex(key, 300, JSON.stringify(user))
  return user
}

// Invalidar al actualizar
async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.user.update({ where: { id: userId }, data })
  await redis.del(`user:${userId}`)  // vaciar caché
  return user
}
```

**Caché con stale-while-revalidate:**
```typescript
async function getCached<T>(
  key: string,
  ttlSec: number,
  fetch: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) {
    // Actualizar en segundo plano si TTL < 20% restante
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

**Obtención por lotes (pipeline):**
```typescript
// Obtener múltiples claves en un solo viaje de ida y vuelta
const keys = userIds.map(id => `user:${id}`)
const pipeline = redis.pipeline()
keys.forEach(key => pipeline.get(key))
const results = await pipeline.exec()

const users = results.map((result, i) =>
  result[1] ? JSON.parse(result[1] as string) : null
)
```

### Sesiones

```typescript
// Almacenamiento de sesiones (express-session + connect-redis)
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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  },
}))

// Sesión personalizada (JWT + lista negra Redis)
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
// Rate limiter de ventana deslizante
async function rateLimit(
  identifier: string, // IP o ID de usuario
  limit: number,       // máximo de solicitudes
  windowSec: number    // ventana de tiempo
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = windowSec * 1000

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, 0, now - windowMs)  // eliminar entradas antiguas
  pipeline.zadd(key, now, `${now}-${Math.random()}`)  // agregar solicitud actual
  pipeline.zcard(key)                                  // contar solicitudes en la ventana
  pipeline.expire(key, windowSec)

  const results = await pipeline.exec()
  const count = results![2][1] as number

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: Math.ceil((now + windowMs) / 1000),
  }
}

// Uso en middleware
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

// Subscriber (conexión separada — el mismo cliente no puede usarse para pub/sub)
const subscriber = new Redis(process.env.REDIS_URL!)

await subscriber.subscribe('order-updates')
subscriber.on('message', (channel, message) => {
  const event = JSON.parse(message)
  console.log(`Event on ${channel}:`, event)
  // manejar el evento...
})

// Suscripción por patrón (wildcard)
await subscriber.psubscribe('user:*:notifications')
subscriber.on('pmessage', (pattern, channel, message) => {
  const userId = channel.split(':')[1]
  handleNotification(userId, JSON.parse(message))
})
```

### Colas de tareas (BullMQ)

```typescript
import { Queue, Worker } from 'bullmq'

// Productor — agregar tareas
const emailQueue = new Queue('emails', {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
})

await emailQueue.add('welcome-email', {
  to: 'user@example.com',
  template: 'welcome',
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  delay: 5000, // retraso de 5s antes del primer intento
})

// Consumidor — procesar tareas
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
// Evitar procesamiento duplicado (p. ej. webhooks de pago)
async function withLock<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T | null> {
  const lockId = crypto.randomUUID()
  const acquired = await redis.set(
    `lock:${key}`, lockId,
    'PX', ttlMs,  // TTL en milisegundos
    'NX',         // solo establecer si no existe
  )

  if (!acquired) return null  // otro proceso tiene el lock

  try {
    return await fn()
  } finally {
    // Solo liberar si aún somos dueños del lock (script Lua = atómico)
    await redis.eval(
      `if redis.call("get",KEYS[1]) == ARGV[1] then
         return redis.call("del",KEYS[1])
       else return 0 end`,
      1, `lock:${key}`, lockId
    )
  }
}

// Uso
const result = await withLock(`payment:${webhookId}`, 30000, async () => {
  return processPaymentWebhook(webhookId)
})
if (result === null) console.log('Already being processed by another instance')
```

### Sorted sets (clasificaciones)

```typescript
// Agregar/actualizar puntuación
await redis.zadd('leaderboard', { score: 1250, member: userId })

// Incrementar puntuación
await redis.zincrby('leaderboard', 50, userId)

// Obtener el top 10
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES')

// Obtener el rango del usuario (indexado desde 0)
const rank = await redis.zrevrank('leaderboard', userId)

// Obtener la puntuación del usuario
const score = await redis.zscore('leaderboard', userId)
```

## Ejemplo

**Usuario:** Agregar caché Redis a una app FastAPI con rate limiting (100 solicitudes/min por IP) y una cola de correos BullMQ.

**Salida esperada:**
- `redis.py` — helpers `get_cached()`, `set_cached()`, `invalidate()`
- `middleware/rate_limit.py` — rate limiter de ventana deslizante usando ZADD
- `routes/users.py` — cache-aside en GET /users/{id}, invalidación en PUT
- `queues/email_queue.ts` (BullMQ) — productor + worker con retry/backoff

---
