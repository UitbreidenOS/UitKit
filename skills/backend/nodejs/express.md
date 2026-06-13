---
name: express
description: "Express.js REST API: routing, middleware chains, error handling, validation with Zod, authentication with JWT, and production patterns for Node.js services"
updated: 2026-06-13
---

# Express Skill

## When to activate
- Building a REST API with Express.js
- Adding middleware (auth, validation, CORS, rate limiting) to an Express app
- Setting up project structure and error handling for a production Express service
- Migrating from callbacks to async/await in Express handlers
- Adding request validation and typed routes to an Express app

## When NOT to use
- Edge deployments — use the hono skill (Cloudflare Workers)
- Full-stack framework — use the nextjs skill
- High-throughput microservices needing raw performance — consider Fastify

## Instructions

### Project setup and structure

```
Set up a production-ready Express.js project.

Language: [TypeScript (recommended) / JavaScript]
Database: [PostgreSQL / MongoDB / none]
Auth: [JWT / session / none]

Directory structure:
src/
  app.ts           ← Express app setup (no listen here)
  server.ts        ← entry point (listen + graceful shutdown)
  routes/
    index.ts       ← router aggregator
    users.ts       ← users routes
    auth.ts        ← auth routes
  middleware/
    auth.ts        ← JWT verification middleware
    validate.ts    ← Zod validation middleware
    errorHandler.ts← global error handler
  controllers/
    users.ts       ← business logic
  services/
    db.ts          ← database connection
  types/
    index.ts       ← shared types and error classes

// src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { router } from './routes'
import { errorHandler } from './middleware/errorHandler'

export const app = express()

// Security middleware
app.use(helmet())
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [] }))
app.use(express.json({ limit: '1mb' }))

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }))

// Routes
app.use('/api', router)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// Error handler (must be last)
app.use(errorHandler)

// src/server.ts
import { app } from './app'
const PORT = process.env.PORT ?? 3000
const server = app.listen(PORT, () => console.log(`Running on :${PORT}`))

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})

Generate the full setup for my configuration.
```

### Routing with validation

```
Build Express routes for [resource] with Zod validation.

Resource: [users / orders / products]
Methods: [GET list / GET by id / POST / PATCH / DELETE]

// src/middleware/validate.ts
import { RequestHandler } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(422).json({
        error: {
          code: 'validation_error',
          message: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
      })
    }
    req.body = result.data  // use parsed/typed data
    next()
  }

// src/routes/users.ts
import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { authMiddleware } from '../middleware/auth'
import * as controller from '../controllers/users'

const router = Router()

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

const updateUserSchema = createUserSchema.partial()

router.get('/', authMiddleware, controller.listUsers)
router.get('/:id', authMiddleware, controller.getUser)
router.post('/', validate(createUserSchema), controller.createUser)
router.patch('/:id', authMiddleware, validate(updateUserSchema), controller.updateUser)
router.delete('/:id', authMiddleware, controller.deleteUser)

export { router as usersRouter }

// src/controllers/users.ts
import { RequestHandler } from 'express'

export const listUsers: RequestHandler = async (req, res, next) => {
  try {
    const { page = '1', limit = '20' } = req.query
    // ... fetch from DB
    res.json({ users: [], page: Number(page), total: 0 })
  } catch (err) {
    next(err)  // always pass to error handler
  }
}

Generate routes and controllers for my resource.
```

### Authentication middleware

```
Implement JWT authentication for Express.

Token type: [Bearer (Authorization header) / Cookie (httpOnly)]
Payload: [userId, role, email]

// src/middleware/auth.ts
import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

type JwtPayload = { sub: string; role: string; email: string }

// Extend Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'unauthorized', message: 'Authentication required' } })
  }

  try {
    const token = auth.slice(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: { code: 'invalid_token', message: 'Token is invalid or expired' } })
  }
}

// Role-based guard
export const requireRole = (role: string): RequestHandler =>
  (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: { code: 'forbidden', message: 'Insufficient permissions' } })
    }
    next()
  }

// Usage:
router.get('/admin', authMiddleware, requireRole('admin'), controller.adminHandler)

Generate the auth middleware for my token type and payload.
```

### Global error handler

```
Set up global error handling for Express.

// src/types/index.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'not_found', 404)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'validation_error', 422)
  }
}

// src/middleware/errorHandler.ts
import { ErrorRequestHandler } from 'express'
import { AppError } from '../types'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Log every error with request context
  console.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userId: req.user?.sub,
  })

  // Known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    })
  }

  // Zod validation errors (if not caught by middleware)
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: { code: 'validation_error', message: 'Validation failed', details: err.flatten() },
    })
  }

  // Unknown errors — don't leak details in production
  res.status(500).json({
    error: {
      code: 'internal_error',
      message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
    },
  })
}
```

## Example

**User:** Express API in production. Users are getting random 500 errors. The error logs just say "TypeError: Cannot read property 'id' of null". How do I debug and fix this?

**Claude's diagnosis:**

`Cannot read property 'id' of null` in Express = you're trying to access `.id` on a DB result that returned `null` (record not found), without checking first.

**Step 1 — Find the source:**
```bash
# Search for patterns likely to cause this
grep -rn "\.id\b" src/controllers/ | grep -v "req.params\|req.user"
```

**Typical culprit:**
```typescript
// BROKEN — throws if user is null
const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
const { id, email } = user.rows[0]  // rows[0] is undefined if no result

// FIXED
const result = await db.query('SELECT * FROM users WHERE id = $1', [id])
if (!result.rows[0]) {
  throw new NotFoundError('User')  // throws structured error → caught by errorHandler
}
const { id, email } = result.rows[0]
```

**Step 2 — Add the missing null checks** across all controllers where you query by ID.

**Step 3 — Improve your error handler** to log the route path and user ID with every error (see global error handler above) — this makes the next 500 error take 30 seconds to diagnose instead of 30 minutes.

---
