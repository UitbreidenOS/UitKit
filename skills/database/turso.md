---
name: turso
description: "Turso: embedded SQLite for the edge — database setup, LibSQL client, schema design, multi-tenancy patterns, and deployment with Cloudflare Workers and Bun"
updated: 2026-06-13
---

# Turso Skill

## When to activate
- Building an edge or serverless application that needs a database
- Setting up SQLite for a Cloudflare Workers or Bun-based project
- Implementing per-tenant databases (one SQLite per customer)
- Migrating from Planetscale or similar and need edge-compatible SQL
- Building with the T3 stack or similar and want a free, fast database

## When NOT to use
- Complex relational data requiring joins across many tables — consider PostgreSQL
- High-write-throughput applications (SQLite has write serialization)
- Applications needing full PostgreSQL extensions (pgvector, etc.) — use Neon

## Instructions

### Setup

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create a database
turso db create myapp-db
turso db create myapp-db --location fra  # specific region

# Get connection URL and token
turso db show myapp-db
turso db tokens create myapp-db

# Install LibSQL client
npm install @libsql/client

# Or with Drizzle ORM (recommended)
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

### Client setup

```typescript
Set up the LibSQL client for [project type].

Project: [Cloudflare Workers / Bun / Node.js / Next.js]

// lib/db.ts — basic LibSQL client
import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

// Execute queries
const result = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
const users = result.rows  // typed as Record<string, Value>[]

// Transactions
await db.batch([
  { sql: 'INSERT INTO orders (user_id, total) VALUES (?, ?)', args: [userId, total] },
  { sql: 'UPDATE users SET order_count = order_count + 1 WHERE id = ?', args: [userId] },
])

// With Drizzle ORM (better type safety):
import { drizzle } from 'drizzle-orm/libsql'

export const db = drizzle(
  createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })
)
```

### Schema with Drizzle

```typescript
Define a Drizzle schema for Turso (LibSQL/SQLite dialect).

// db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  plan: text('plan', { enum: ['free', 'pro', 'enterprise'] }).default('free'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'),
  publishedAt: text('published_at'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config

// Generate and apply migrations:
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Multi-tenancy pattern

```typescript
Implement per-tenant database isolation with Turso.

Use case: SaaS with one SQLite database per customer (complete data isolation)

// lib/tenant-db.ts
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

// Create a new database for each new tenant
export async function createTenantDb(tenantId: string) {
  const response = await fetch('https://api.turso.tech/v1/databases', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `tenant-${tenantId}`,
      group: 'production',
    }),
  })
  const { database } = await response.json()
  return database.Hostname
}

// Get a DB client for a specific tenant
export function getTenantDb(tenantId: string) {
  return drizzle(
    createClient({
      url: `libsql://tenant-${tenantId}-your-org.turso.io`,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  )
}

// Usage in a route handler:
export async function handler(req: Request) {
  const tenantId = req.headers.get('X-Tenant-ID')!
  const db = getTenantDb(tenantId)
  
  const users = await db.select().from(usersTable)
  return Response.json(users)
}

Benefits of per-tenant databases:
- Complete data isolation (GDPR, compliance, customer requirement)
- Independent backup and restore per tenant
- No row-level security complexity
- Each tenant's data lives in its own SQLite file
```

### Cloudflare Workers integration

```typescript
Use Turso with Cloudflare Workers.

// wrangler.toml
[vars]
TURSO_DATABASE_URL = "libsql://your-db-your-org.turso.io"

# Note: auth token should be a secret, not a var
# wrangler secret put TURSO_AUTH_TOKEN

// worker.ts
import { createClient } from '@libsql/client/web'  // use /web for edge runtime
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './db/schema'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    })
    
    const db = drizzle(client, { schema })
    
    const users = await db.select().from(schema.users).limit(10)
    return Response.json(users)
  }
}

interface Env {
  TURSO_DATABASE_URL: string
  TURSO_AUTH_TOKEN: string
}
```

## Example

**User:** I want to build a personal project with a database. I don't want to pay for hosting. What's the simplest path?

**Claude's recommendation:**

**Turso free tier is unbeatable for personal projects:**
- 9GB storage free
- 500 databases free (one per project or per tenant)
- Edge locations globally (data close to your users)
- No credit card required

**Fastest setup:**
```bash
# 1. Create database (2 min)
turso db create my-project
TURSO_DATABASE_URL=$(turso db show my-project --url)
TURSO_AUTH_TOKEN=$(turso db tokens create my-project)

# 2. Add to .env
echo "TURSO_DATABASE_URL=$TURSO_DATABASE_URL" >> .env
echo "TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN" >> .env

# 3. Install and start using
npm install @libsql/client drizzle-orm
```

**Stack recommendation for a personal project:**
- Bun + Elysia (backend) or Next.js (full-stack)
- Turso + Drizzle ORM (database)
- Deployed on Railway or Fly.io

Total cost: $0/month for most personal projects.

---
