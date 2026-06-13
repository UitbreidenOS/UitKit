---
name: "deno"
description: "Deno 2 runtime: built-in TypeScript, permission model, deno.json config, npm compatibility, standard library, Deno KV, Deno Deploy edge runtime, Fresh framework islands architecture, and testing with Deno.test"
---

# Deno 2 Skill

## When to activate
- Starting a new TypeScript project and evaluating runtimes
- Building a security-sensitive service where granular permissions matter
- Deploying to Deno Deploy (edge, global distribution)
- Using the Fresh framework (Deno's web framework)
- Working with Deno KV (built-in key-value store, no external dependency)
- Migrating a small Node.js script to Deno
- The project uses `deno.json` or `import_map.json` instead of `package.json`
- User mentions `deno run`, `deno task`, `deno deploy`, or `@std/` imports

## When NOT to use
- Projects already built on Node.js with deep native addon dependencies — migration cost is high
- Bun projects — different runtime, use the `bun` skill
- Cloudflare Workers — use the `hono` skill (Workers has its own runtime)
- Projects requiring npm packages with native bindings not yet ported to Deno
- When the team has no Deno familiarity and a deadline is tight — Node.js ecosystem is larger

## Instructions

### Project setup

```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh    # macOS/Linux
# or: brew install deno

# Verify
deno --version

# Create a project
mkdir my-api && cd my-api

# deno.json replaces package.json
# Create manually or let the first deno task create it
```

```jsonc
// deno.json — central config, replaces package.json + tsconfig.json
{
  "tasks": {
    "dev": "deno run --watch --allow-net --allow-env --allow-read src/main.ts",
    "start": "deno run --allow-net --allow-env --allow-read src/main.ts",
    "test": "deno test --allow-net --allow-env",
    "check": "deno check src/main.ts"
  },
  "imports": {
    // Import map — aliases for cleaner imports
    "@std/http": "jsr:@std/http@^1.0.0",
    "@std/path": "jsr:@std/path@^1.0.0",
    "@std/testing": "jsr:@std/testing@^1.0.0",
    "hono": "jsr:@hono/hono@^4.0.0",
    "zod": "npm:zod@^3.22.0"
  },
  "compilerOptions": {
    // TypeScript is built-in — no separate tsconfig.json needed
    "strict": true,
    "lib": ["deno.window"]
  }
}
```

No `node_modules`. No `tsconfig.json`. No `babel.config.js`. TypeScript runs directly.

### Permission model

Deno is deny-by-default. Every capability must be explicitly granted at startup.

```bash
# Common permission flags
deno run --allow-net src/main.ts          # all network access
deno run --allow-net=api.example.com src/main.ts  # specific host only
deno run --allow-read src/main.ts         # all file reads
deno run --allow-read=/tmp src/main.ts    # specific path only
deno run --allow-write=/tmp src/main.ts
deno run --allow-env src/main.ts          # all env vars
deno run --allow-env=PORT,DATABASE_URL src/main.ts  # specific vars only
deno run --allow-run=git src/main.ts      # spawn subprocesses
deno run -A src/main.ts                   # all permissions (dev only)

# Permissions in deno.json tasks are declared explicitly
# Never use -A in production — be specific about what the program needs
```

You can also declare permissions in the script itself (Deno 2):

```typescript
// src/main.ts — declarative permissions (Deno 2.x)
// Deno prompts the user once if permissions not already granted
const { granted } = await Deno.permissions.request({ name: 'env', variable: 'DATABASE_URL' })
if (!granted) throw new Error('DATABASE_URL env permission denied')
```

### npm compatibility

Deno 2 supports npm packages directly — no installation step.

```typescript
// Use npm: prefix — Deno downloads and caches automatically
import { z } from 'npm:zod'
import express from 'npm:express@4'
import { PrismaClient } from 'npm:@prisma/client'

// Or declare in deno.json imports map (preferred):
// "zod": "npm:zod@^3.22.0"
import { z } from 'zod'  // resolved via import map

// JSR (JavaScript Registry) — the modern, Deno-native registry
import { Hono } from 'jsr:@hono/hono'
import { assertEquals } from 'jsr:@std/assert'
```

```bash
# Cache dependencies without running (like npm install for CI)
deno cache src/main.ts

# Check for outdated dependencies
deno outdated
```

### Standard library (@std/)

```typescript
// HTTP server — @std/http
import { serve } from '@std/http'

await serve((req) => {
  const url = new URL(req.url)
  if (url.pathname === '/health') {
    return Response.json({ status: 'ok' })
  }
  return new Response('Not found', { status: 404 })
}, { port: 8000 })

// Path utilities — @std/path
import { join, dirname, basename, extname } from '@std/path'
const configPath = join(Deno.cwd(), 'config', 'settings.json')

// File I/O (requires --allow-read / --allow-write)
const text = await Deno.readTextFile(configPath)
const config = JSON.parse(text)
await Deno.writeTextFile('/tmp/output.json', JSON.stringify(config, null, 2))

// Environment variables
const port = parseInt(Deno.env.get('PORT') ?? '8000')
const dbUrl = Deno.env.get('DATABASE_URL')
if (!dbUrl) throw new Error('DATABASE_URL is required')
```

### Deno KV

Built-in key-value store. Zero config. Works locally and on Deno Deploy.

```typescript
// No install, no connection string needed — built into the runtime
const kv = await Deno.openKv()   // local SQLite on dev, managed on Deno Deploy

// Keys are arrays of parts — allows hierarchical namespacing
await kv.set(['users', 'alice@example.com'], {
  id: 'u_01',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date().toISOString(),
})

// Get
const result = await kv.get<{ name: string }>(['users', 'alice@example.com'])
console.log(result.value?.name)     // 'Alice'
console.log(result.versionstamp)    // for optimistic concurrency

// List with prefix — efficient range scan
const iter = kv.list<User>({ prefix: ['users'] })
const users: User[] = []
for await (const entry of iter) {
  users.push(entry.value)
}

// Atomic transactions
const res = await kv.atomic()
  .check({ key: ['sessions', token], versionstamp: null })  // must not exist
  .set(['sessions', token], { userId: 'u_01', expiresAt: Date.now() + 86400_000 })
  .commit()

if (!res.ok) throw new Error('Session token collision — try again')

// Delete
await kv.delete(['sessions', token])

// Watch for changes (real-time, works on Deno Deploy)
const watcher = kv.watch([['users', 'alice@example.com']])
for await (const [entry] of watcher) {
  console.log('User updated:', entry.value)
}
```

### Testing

```typescript
// No test framework install needed — Deno.test is built in
// Run: deno test

import { assertEquals, assertRejects, assertExists } from '@std/assert'

// Basic test
Deno.test('adds two numbers', () => {
  assertEquals(1 + 2, 3)
})

// Async test
Deno.test('fetches user from KV', async () => {
  const kv = await Deno.openKv(':memory:')   // in-memory for tests
  await kv.set(['users', '1'], { name: 'Alice' })

  const result = await kv.get(['users', '1'])
  assertExists(result.value)
  assertEquals((result.value as { name: string }).name, 'Alice')

  kv.close()
})

// BDD style with @std/testing
import { describe, it, beforeAll, afterAll } from '@std/testing/bdd'
import { assertThrows } from '@std/assert'

describe('UserService', () => {
  let kv: Deno.Kv

  beforeAll(async () => { kv = await Deno.openKv(':memory:') })
  afterAll(() => kv.close())

  it('throws when user not found', async () => {
    await assertRejects(
      () => getUser(kv, 'nonexistent'),
      Error,
      'User not found',
    )
  })
})

// Test subsets and permissions
Deno.test({
  name: 'calls external API',
  permissions: { net: ['api.example.com'] },   // test-scoped permissions
  async fn() {
    const res = await fetch('https://api.example.com/ping')
    assertEquals(res.status, 200)
  },
})
```

```bash
deno test                          # run all tests
deno test --watch                  # watch mode
deno test --filter "UserService"   # run matching tests
deno test --coverage=./cov         # generate coverage data
deno coverage ./cov                # display coverage report
deno test --allow-net src/user.test.ts  # specific file
```

### Fresh framework (islands architecture)

```bash
deno run -A -r jsr:@fresh/init my-app
cd my-app && deno task start
```

```
my-app/
├── routes/
│   ├── index.tsx          # server-rendered page at /
│   ├── blog/
│   │   └── [slug].tsx     # dynamic route
│   └── api/
│       └── users.ts       # API handler (no JSX)
├── islands/
│   └── Counter.tsx        # client-side interactive component
├── components/
│   └── Button.tsx         # server-only component (no JS sent)
├── deno.json
└── main.ts                # entry point
```

```tsx
// routes/index.tsx — server-rendered by default (zero client JS)
import type { PageProps } from '$fresh/server.ts'
import Counter from '../islands/Counter.tsx'   // only this becomes a JS bundle

export default function Home({ data }: PageProps) {
  return (
    <main>
      <h1>Hello from Fresh</h1>
      {/* Counter is an "island" — only this component ships JS to the browser */}
      <Counter initialCount={0} />
    </main>
  )
}
```

```tsx
// islands/Counter.tsx — interactive island (ships JS to browser)
import { useSignal } from '@preact/signals'

export default function Counter({ initialCount }: { initialCount: number }) {
  const count = useSignal(initialCount)
  return (
    <button onClick={() => count.value++}>
      Count: {count}
    </button>
  )
}
```

```typescript
// routes/api/users.ts — API route (no JSX)
import { Handlers } from '$fresh/server.ts'

export const handler: Handlers = {
  async GET(req, ctx) {
    const users = await getUsersFromKv()
    return Response.json({ users })
  },
  async POST(req, ctx) {
    const body = await req.json()
    const user = await createUserInKv(body)
    return Response.json(user, { status: 201 })
  },
}
```

### Deno Deploy

```bash
# Install deployctl
deno install -A jsr:@deno/deployctl

# Deploy from local
deployctl deploy --project=my-api src/main.ts

# Or link to GitHub — Deno Deploy auto-deploys on push
# No Docker, no containers — just push your TypeScript
```

```typescript
// main.ts — works identically locally and on Deno Deploy
// Deno KV, fetch, and Deno.env all work on Deploy with zero changes
const kv = await Deno.openKv()    // managed KV on Deploy, SQLite locally

Deno.serve({ port: 8000 }, async (req) => {
  const url = new URL(req.url)

  if (url.pathname === '/') {
    const visits = await kv.get<number>(['visits'])
    const count = (visits.value ?? 0) + 1
    await kv.set(['visits'], count)
    return Response.json({ visits: count })
  }

  return new Response('Not found', { status: 404 })
})
```

### Deno vs Node.js — when to choose Deno

Choose Deno when:
- **Greenfield TypeScript project** — no tsconfig, no build step, TypeScript works out of the box
- **Security matters** — explicit permissions make the attack surface auditable; `--allow-net=payments.stripe.com` is self-documenting
- **Edge deployment** — Deno Deploy is purpose-built for it; ~300 PoPs, cold-start in microseconds
- **Simple scripts** — `deno run https://example.com/script.ts` works without installing anything
- **Deno KV** — need a persistent store without setting up Redis or Postgres for a small service

Stick with Node.js when:
- Existing large codebase with native addons
- Team is deep in Node.js ecosystem tooling (Jest, Webpack, etc.)
- Packages used have no Deno/npm-compatible builds
- Monorepo tooling (Turborepo, Nx) that assumes Node.js

## Example

**User:** Build a REST API with Hono on Deno that stores items in Deno KV. Needs CRUD endpoints and a test.

**Expected output:**

```typescript
// deno.json
{
  "tasks": {
    "dev": "deno run --watch --allow-net --allow-env src/main.ts",
    "test": "deno test --allow-env"
  },
  "imports": {
    "hono": "jsr:@hono/hono@^4.0.0",
    "zod": "npm:zod@^3.22.0",
    "@std/assert": "jsr:@std/assert@^1.0.0"
  }
}
```

```typescript
// src/main.ts
import { Hono } from 'hono'
import { z } from 'zod'

const kv = await Deno.openKv()

const app = new Hono()

const ItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
})

// List all items
app.get('/items', async (c) => {
  const items: unknown[] = []
  const iter = kv.list({ prefix: ['items'] })
  for await (const entry of iter) {
    items.push(entry.value)
  }
  return c.json({ items })
})

// Get one item
app.get('/items/:id', async (c) => {
  const result = await kv.get(['items', c.req.param('id')])
  if (!result.value) return c.json({ error: 'Not found' }, 404)
  return c.json(result.value)
})

// Create item
app.post('/items', async (c) => {
  const body = await c.req.json()
  const parsed = ItemSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ errors: parsed.error.flatten().fieldErrors }, 422)
  }
  const id = crypto.randomUUID()
  const item = { id, ...parsed.data }
  await kv.set(['items', id], item)
  return c.json(item, 201)
})

// Delete item
app.delete('/items/:id', async (c) => {
  await kv.delete(['items', c.req.param('id')])
  return new Response(null, { status: 204 })
})

Deno.serve({ port: 8000 }, app.fetch)
```

```typescript
// src/main.test.ts
import { assertEquals } from '@std/assert'
import app from './main.ts'

Deno.test('POST /items creates and GET retrieves', async () => {
  const createRes = await app.fetch(
    new Request('http://localhost/items', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Apples', quantity: 10 }),
    })
  )
  assertEquals(createRes.status, 201)
  const item = await createRes.json()
  assertEquals(item.name, 'Apples')

  const getRes = await app.fetch(new Request(`http://localhost/items/${item.id}`))
  assertEquals(getRes.status, 200)
  const fetched = await getRes.json()
  assertEquals(fetched.quantity, 10)
})
```

Deploy: `deployctl deploy --project=my-inventory src/main.ts` — globally distributed in seconds, KV replicated automatically.

---
