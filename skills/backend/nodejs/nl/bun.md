---
name: bun
description: "Bun runtime: build fast Node.js-compatible APIs with Bun's built-in server, bundler, test runner, and package manager — Elysia framework, SQLite, and edge-optimised patterns"
---

# Bun Skill

## Wanneer activeren
- Een nieuwe API of service met Bun als runtime bouwen
- Elysia framework gebruiken (het Hono/Express equivalent voor Bun)
- Een Node.js applicatie naar Bun migreren voor prestatiewinsten
- Bun's ingebouwde SQLite gebruiken voor edge of embedded databases
- Bun's ingebouwde test runner instellen (geen Jest nodig)

## Wanneer NIET gebruiken
- Cloudflare Workers — gebruik de hono skill (Bun werkt op servers, niet Cloudflare edge)
- Next.js projecten — Next.js gebruikt Node.js; Bun compatibiliteit verbetert maar is niet volledig
- Projecten met native Node.js addons die Bun nog niet ondersteunen

## Instructies

### Projectconfiguratie

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

### Ingebouwde SQLite

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

### Prestatiebenchmarks

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

## Voorbeeld

**Gebruiker:** Ik wil een snelle REST API voor een weekend project bouwen. Moet ik Bun + Elysia of Node.js + Hono gebruiken?

**Claude's vergelijking:**

Voor een weekend project waar je snelheid van development EN runtime performance wilt:

**Gebruik Bun + Elysia als:**
- U één runtime wilt voor alles (package manager, bundler, test runner, TypeScript — geen config)
- U bent op een Mac of Linux (Bun wordt volledig ondersteund; Windows-ondersteuning verbetert)
- U de snelste mogelijke koudstart en doorvoer wilt
- U end-to-end type safety leuk vindt (Elysia's type inference is uitstekend)

**Gebruik Hono + Cloudflare Workers als:**
- U global edge deployment wilt (Bun werkt op VPS, niet Cloudflare)
- U Cloudflare's KV, D1 of R2 nodig hebt
- U al vertrouwd bent met Hono's API

**Voor een weekend project: Bun + Elysia wint** — `bun create elysia my-api` heeft u in 30 seconden draaiend met hot reload, ingebouwde Swagger en type-safe routes. Geen tsconfig tweaken, geen jest config, geen nodemon.

```bash
bun create elysia my-api && cd my-api && bun dev
# Running at http://localhost:3000 — that's it
```

---
