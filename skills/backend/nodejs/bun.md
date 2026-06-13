---
name: bun
description: "Bun runtime: build fast Node.js-compatible APIs with Bun's built-in server, bundler, test runner, and package manager — Elysia framework, SQLite, and edge-optimised patterns"
updated: 2026-06-13
---

# Bun Skill

## When to activate
- Building a new API or service with Bun as the runtime
- Using Elysia framework (the Hono/Express equivalent for Bun)
- Migrating a Node.js application to Bun for performance gains
- Using Bun's built-in SQLite for edge or embedded databases
- Setting up Bun's built-in test runner (no Jest needed)

## When NOT to use
- Cloudflare Workers — use the hono skill (Bun runs on servers, not Cloudflare edge)
- Next.js projects — Next.js uses Node.js; Bun compatibility is improving but not complete
- Projects with native Node.js addons that don't support Bun yet

## Instructions

### Project setup

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Create a new project
mkdir my-api && cd my-api
bun init               # creates package.json, index.ts, tsconfig.json

# Or scaffold with Elysia
bun create elysia my-api
cd my-api && bun install

# Run
bun run index.ts       # or: bun index.ts
bun --watch index.ts   # hot reload

# Package management (drop-in npm replacement, 10-100x faster)
bun install            # install from package.json
bun add express        # add a package
bun remove express     # remove a package
bun update             # update all
```

### Bun native HTTP server

```typescript
Build a Bun HTTP server for [use case].

// index.ts — Bun's built-in server (no framework needed for simple APIs)
const server = Bun.serve({
  port: 3000,
  hostname: '0.0.0.0',

  async fetch(req) {
    const url = new URL(req.url)

    // Route handling
    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', uptime: process.uptime() })
    }

    if (url.pathname === '/api/users' && req.method === 'GET') {
      const users = await getUsers()
      return Response.json(users)
    }

    if (url.pathname === '/api/users' && req.method === 'POST') {
      const body = await req.json()
      const user = await createUser(body)
      return Response.json(user, { status: 201 })
    }

    return new Response('Not Found', { status: 404 })
  },

  error(error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  },
})

console.log(`Listening on http://localhost:${server.port}`)
```

### Elysia framework

```typescript
Build an Elysia API for [service].

Elysia is the idiomatic Bun web framework — type-safe, fast, minimal.

npm install elysia @elysiajs/swagger

// app.ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(swagger())           // auto-generates Swagger UI at /swagger
  
  // Define routes with full type safety
  .get('/health', () => ({ status: 'ok' }))
  
  // Route with path parameter
  .get('/users/:id', ({ params: { id } }) => {
    return getUserById(id)
  }, {
    params: t.Object({ id: t.String() }),
    response: t.Object({
      id: t.String(),
      name: t.String(),
      email: t.String(),
    })
  })
  
  // Route with body validation
  .post('/users', async ({ body }) => {
    return createUser(body)
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
    })
  })
  
  // Middleware (apply to all routes)
  .onBeforeHandle(({ request, set }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      return { error: 'Unauthorized' }
    }
  })
  
  .listen(3000)

console.log(`Running at ${app.server?.hostname}:${app.server?.port}`)

Generate the Elysia app for my service.
```

### Built-in SQLite

```typescript
Use Bun's built-in SQLite for [use case].

// No installation needed — SQLite is built into Bun
import { Database } from 'bun:sqlite'

const db = new Database('myapp.db', { create: true })

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Prepared statements (fastest, prevents SQL injection)
const insertUser = db.prepare(
  'INSERT INTO users (email, name) VALUES (?, ?) RETURNING *'
)

const getUser = db.prepare(
  'SELECT * FROM users WHERE id = ?'
)

const listUsers = db.prepare(
  'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
)

// Execute
const newUser = insertUser.get('alice@example.com', 'Alice')
const user = getUser.get(1)
const users = listUsers.all(20, 0)

// Transactions (atomic operations)
const transferPoints = db.transaction((fromId: number, toId: number, points: number) => {
  db.run('UPDATE users SET points = points - ? WHERE id = ?', [points, fromId])
  db.run('UPDATE users SET points = points + ? WHERE id = ?', [points, toId])
})

transferPoints(1, 2, 100)  // atomic — both or neither

// Close when done
db.close()
```

### Bun test runner

```typescript
Write tests for [module] using Bun's built-in test runner.

// No Jest, Vitest, or Mocha needed — Bun has a built-in runner
// Run: bun test

import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test'
import { createUser, getUser } from './users'

describe('User service', () => {
  describe('createUser', () => {
    it('creates a user and returns an ID', async () => {
      const user = await createUser({ name: 'Alice', email: 'alice@example.com' })
      expect(user.id).toBeString()
      expect(user.name).toBe('Alice')
    })

    it('throws on duplicate email', async () => {
      await createUser({ name: 'Bob', email: 'bob@example.com' })
      expect(
        createUser({ name: 'Bob 2', email: 'bob@example.com' })
      ).rejects.toThrow()
    })
  })
})

// Mock modules
const mockEmailService = mock(() => Promise.resolve({ id: 'email-123' }))

// Watch mode
// bun test --watch

// Coverage
// bun test --coverage

// Filter tests
// bun test --testNamePattern "createUser"
```

### Performance benchmarks

```bash
# Bun vs Node.js comparison for common tasks:
# Package install: bun install is ~10-30x faster than npm install
# TypeScript execution: bun runs .ts directly, no compilation step
# Startup time: ~3-5ms vs ~30-50ms for Node.js
# HTTP throughput: typically 2-3x more req/s than Express on Node.js

# Benchmark your Bun server:
bun run bench.ts

// bench.ts
const results = await fetch('http://localhost:3000/api/users')
console.time('100 requests')
for (let i = 0; i < 100; i++) {
  await fetch('http://localhost:3000/api/users')
}
console.timeEnd('100 requests')
```

## Example

**User:** I want to build a fast REST API for a weekend project. Should I use Bun + Elysia or Node.js + Hono?

**Claude's comparison:**

For a weekend project where you want speed of development AND runtime performance:

**Use Bun + Elysia if:**
- You want one runtime for everything (package manager, bundler, test runner, TypeScript — no config)
- You're on a Mac or Linux (Bun is fully supported; Windows support is improving)
- You want the fastest possible cold-start and throughput
- You like end-to-end type safety (Elysia's type inference is excellent)

**Use Hono + Cloudflare Workers if:**
- You want global edge deployment (Bun runs on VPS, not Cloudflare)
- You need Cloudflare's KV, D1, or R2
- You're already familiar with Hono's API

**For a weekend project: Bun + Elysia wins** — `bun create elysia my-api` has you running in 30 seconds with hot reload, built-in Swagger, and type-safe routes. No tsconfig tweaking, no jest config, no nodemon.

```bash
bun create elysia my-api && cd my-api && bun dev
# Running at http://localhost:3000 — that's it
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
