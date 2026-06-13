---
name: "drizzle"
description: "Drizzle ORM: TypeScript-first schema, relations, migrations, query builder, Neon/Supabase/PlanetScale integration — the AI-legible ORM"
---

# Drizzle ORM Skill

## When to activate
- Defining a database schema with Drizzle's TypeScript-first API
- Writing type-safe queries without heavy ORM abstraction
- Running Drizzle Kit migrations (push, generate, migrate)
- Setting up Drizzle with Neon, Supabase, PlanetScale, Turso, or local Postgres
- Performing relational queries (with, findFirst, findMany)
- Using Drizzle in Edge Runtime (Cloudflare Workers, Vercel Edge)

## When NOT to use
- If your project already uses Prisma — switching mid-project is high friction
- Complex multi-database setups — Prisma handles this better
- When you need built-in query result caching — use a separate caching layer

## Why Drizzle over Prisma for AI generation

Drizzle maintains a **direct 1:1 correlation to SQL syntax**. An LLM can read a Drizzle schema and immediately understand the exact SQL table structure with zero translation overhead. Prisma uses an abstract SDL language (`.prisma` files) that requires the model to maintain a separate mental mapping. Drizzle schema = SQL. This is why Drizzle is the dominant ORM in the vibe coding ecosystem.

## Instructions

### Installation

```bash
# PostgreSQL (Neon, Supabase, local)
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# SQLite (Turso, local)
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit

# MySQL (PlanetScale)
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Schema definition

```typescript
// db/schema.ts
import {
  pgTable, text, integer, boolean, timestamp,
  serial, uuid, varchar, decimal, json, index, uniqueIndex
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     varchar('email', { length: 320 }).notNull().unique(),
  name:      text('name'),
  role:      text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  isActive:  boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}))

export const posts = pgTable('posts', {
  id:          uuid('id').primaryKey().defaultRandom(),
  title:       text('title').notNull(),
  content:     text('content'),
  published:   boolean('published').notNull().default(false),
  authorId:    uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  authorIdx:   index('posts_author_idx').on(table.authorId),
  publishedIdx: index('posts_published_idx').on(table.published, table.publishedAt),
}))

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))
```

### Database client setup

```typescript
// db/index.ts — Neon (serverless/Edge Runtime)
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// db/index.ts — Neon with WebSocket (Node.js, full connection)
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

// db/index.ts — node-postgres (local/self-hosted Postgres)
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

// db/index.ts — Turso/libSQL (SQLite)
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

const client = createClient({ url: process.env.TURSO_URL!, authToken: process.env.TURSO_TOKEN })
export const db = drizzle(client, { schema })
```

### Migrations with Drizzle Kit

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT!, // use direct URL (not pooled) for migrations
  },
} satisfies Config
```

```bash
# Push schema directly (dev only — no migration files)
npx drizzle-kit push

# Generate migration files (recommended for production)
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit migrate

# Open Drizzle Studio (visual DB browser)
npx drizzle-kit studio

# Check what migrations would run
npx drizzle-kit check
```

### Queries

```typescript
import { db } from '@/db'
import { users, posts } from '@/db/schema'
import { eq, and, or, like, gte, lte, desc, asc, count, sql } from 'drizzle-orm'

// Select
const allUsers = await db.select().from(users)

// Select with projection (only specific columns)
const emails = await db.select({ id: users.id, email: users.email }).from(users)

// Where clauses
const admins = await db.select().from(users).where(eq(users.role, 'admin'))

const filtered = await db.select().from(users).where(
  and(
    eq(users.isActive, true),
    or(like(users.email, '%@company.com'), eq(users.role, 'admin'))
  )
)

// Order, limit, offset
const recent = await db.select().from(posts)
  .where(eq(posts.published, true))
  .orderBy(desc(posts.publishedAt))
  .limit(10)
  .offset(20)

// Count
const [{ total }] = await db.select({ total: count() }).from(users).where(eq(users.isActive, true))

// Insert
const [user] = await db.insert(users)
  .values({ email: 'alice@example.com', name: 'Alice' })
  .returning()

// Insert many
await db.insert(posts).values([
  { title: 'Post 1', authorId: user.id },
  { title: 'Post 2', authorId: user.id },
])

// Update
const [updated] = await db.update(users)
  .set({ name: 'Alice Updated', updatedAt: new Date() })
  .where(eq(users.id, userId))
  .returning()

// Upsert (on conflict)
await db.insert(users)
  .values({ email, name })
  .onConflictDoUpdate({
    target: users.email,
    set: { name, updatedAt: new Date() },
  })

// Delete
await db.delete(users).where(eq(users.id, userId))
```

### Relational queries (with relations defined)

```typescript
// findMany with relations — cleaner than join syntax
const usersWithPosts = await db.query.users.findMany({
  where: eq(users.isActive, true),
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: desc(posts.createdAt),
      limit: 5,
    },
  },
  orderBy: asc(users.name),
})

// findFirst (returns undefined if not found)
const user = await db.query.users.findFirst({
  where: eq(users.email, email),
  with: { posts: true },
})

// Nested relations
const postWithAuthor = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    author: {
      columns: { id: true, name: true, email: true },  // only these columns
    },
  },
})
```

### Transactions

```typescript
// Sequential transaction
const result = await db.transaction(async (tx) => {
  const [user] = await tx.insert(users)
    .values({ email, name })
    .returning()

  await tx.insert(posts)
    .values({ title: 'Welcome post', authorId: user.id, published: true })

  return user
})

// With rollback on business logic failure
await db.transaction(async (tx) => {
  const [account] = await tx.select().from(accounts).where(eq(accounts.id, fromId)).for('update')

  if (account.balance < amount) {
    tx.rollback()  // explicit rollback
    return
  }

  await tx.update(accounts).set({ balance: sql`${accounts.balance} - ${amount}` }).where(eq(accounts.id, fromId))
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + ${amount}` }).where(eq(accounts.id, toId))
})
```

### Raw SQL for complex queries

```typescript
import { sql } from 'drizzle-orm'

// When the query builder isn't enough
const results = await db.execute(sql`
  SELECT u.id, u.email, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id AND p.published = true
  WHERE u.created_at > ${new Date('2026-01-01')}
  GROUP BY u.id, u.email
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
`)

// Typed raw SQL
const rows = await db.execute<{ id: string; email: string; postCount: number }>(sql`...`)
```

## Example

**User:** Set up Drizzle with Neon in a Next.js App Router project. Define a `users` and `subscriptions` table (one-to-one), with a migration workflow and a server action that creates a user with a free tier subscription.

**Expected output:**
- `db/schema.ts` — `users` + `subscriptions` tables, `usersRelations` + `subscriptionsRelations`
- `drizzle.config.ts` — points to `DATABASE_URL_DIRECT` for migrations
- `db/index.ts` — Neon HTTP driver (Edge-compatible)
- `lib/actions/auth.ts` — Server Action using `db.transaction()` to insert both tables atomically
- `package.json` scripts: `"db:push"`, `"db:generate"`, `"db:migrate"`, `"db:studio"`

---
