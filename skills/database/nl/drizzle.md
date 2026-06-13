---
name: drizzle
description: "Drizzle ORM: TypeScript-first schema, relaties, migraties, query builder, Neon/Supabase/PlanetScale-integratie — de AI-leesbare ORM"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../drizzle.md).

# Drizzle ORM Skill

## Wanneer activeren
- Een databaseschema definiëren met Drizzle's TypeScript-first API
- Typeveilige queries schrijven zonder zware ORM-abstractie
- Drizzle Kit migraties uitvoeren (push, generate, migrate)
- Drizzle instellen met Neon, Supabase, PlanetScale, Turso of lokale Postgres
- Relationele queries uitvoeren (with, findFirst, findMany)
- Drizzle gebruiken in Edge Runtime (Cloudflare Workers, Vercel Edge)

## Wanneer NIET gebruiken
- Als uw project al Prisma gebruikt — halverwege overstappen kost veel moeite
- Complexe multi-database setups — Prisma verwerkt dit beter
- Wanneer u een ingebouwde cache voor queryresultaten nodig heeft — gebruik een aparte cachinglaag

## Waarom Drizzle boven Prisma voor AI-generatie

Drizzle behoudt een **directe 1:1-correlatie met SQL-syntax**. Een LLM kan een Drizzle-schema lezen en de exacte SQL-tabelstructuur onmiddellijk begrijpen zonder vertaaloverhead. Prisma gebruikt een abstracte SDL-taal (`.prisma`-bestanden) waardoor het model een afzonderlijke mentale mapping moet bijhouden. Drizzle schema = SQL. Daarom is Drizzle de dominante ORM in het vibe coding ecosysteem.

## Instructies

### Installatie

```bash
# PostgreSQL (Neon, Supabase, lokaal)
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# SQLite (Turso, lokaal)
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit

# MySQL (PlanetScale)
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Schemadefinitie

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

// Relaties
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

### Database-clientinstelling

```typescript
// db/index.ts — Neon (serverless/Edge Runtime)
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// db/index.ts — Neon met WebSocket (Node.js, volledige verbinding)
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

// db/index.ts — node-postgres (lokale/zelfgehoste Postgres)
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

### Migraties met Drizzle Kit

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT!, // gebruik directe URL (niet gepooled) voor migraties
  },
} satisfies Config
```

```bash
# Schema direct pushen (alleen ontwikkeling — geen migratiebestanden)
npx drizzle-kit push

# Migratiebestanden genereren (aanbevolen voor productie)
npx drizzle-kit generate

# Openstaande migraties toepassen
npx drizzle-kit migrate

# Drizzle Studio openen (visuele DB-browser)
npx drizzle-kit studio

# Controleren welke migraties uitgevoerd zouden worden
npx drizzle-kit check
```

### Queries

```typescript
import { db } from '@/db'
import { users, posts } from '@/db/schema'
import { eq, and, or, like, gte, lte, desc, asc, count, sql } from 'drizzle-orm'

// Select
const allUsers = await db.select().from(users)

// Select met projectie (alleen specifieke kolommen)
const emails = await db.select({ id: users.id, email: users.email }).from(users)

// Where-clausules
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

// Tellen
const [{ total }] = await db.select({ total: count() }).from(users).where(eq(users.isActive, true))

// Insert
const [user] = await db.insert(users)
  .values({ email: 'alice@example.com', name: 'Alice' })
  .returning()

// Meerdere invoegen
await db.insert(posts).values([
  { title: 'Post 1', authorId: user.id },
  { title: 'Post 2', authorId: user.id },
])

// Update
const [updated] = await db.update(users)
  .set({ name: 'Alice Updated', updatedAt: new Date() })
  .where(eq(users.id, userId))
  .returning()

// Upsert (bij conflict)
await db.insert(users)
  .values({ email, name })
  .onConflictDoUpdate({
    target: users.email,
    set: { name, updatedAt: new Date() },
  })

// Delete
await db.delete(users).where(eq(users.id, userId))
```

### Relationele queries (met gedefinieerde relaties)

```typescript
// findMany met relaties — overzichtelijker dan join-syntax
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

// findFirst (geeft undefined terug als niet gevonden)
const user = await db.query.users.findFirst({
  where: eq(users.email, email),
  with: { posts: true },
})

// Geneste relaties
const postWithAuthor = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    author: {
      columns: { id: true, name: true, email: true },  // alleen deze kolommen
    },
  },
})
```

### Transacties

```typescript
// Sequentiële transactie
const result = await db.transaction(async (tx) => {
  const [user] = await tx.insert(users)
    .values({ email, name })
    .returning()

  await tx.insert(posts)
    .values({ title: 'Welcome post', authorId: user.id, published: true })

  return user
})

// Met rollback bij bedrijfslogicafout
await db.transaction(async (tx) => {
  const [account] = await tx.select().from(accounts).where(eq(accounts.id, fromId)).for('update')

  if (account.balance < amount) {
    tx.rollback()  // expliciete rollback
    return
  }

  await tx.update(accounts).set({ balance: sql`${accounts.balance} - ${amount}` }).where(eq(accounts.id, fromId))
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + ${amount}` }).where(eq(accounts.id, toId))
})
```

### Ruwe SQL voor complexe queries

```typescript
import { sql } from 'drizzle-orm'

// Wanneer de query builder niet genoeg is
const results = await db.execute(sql`
  SELECT u.id, u.email, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id AND p.published = true
  WHERE u.created_at > ${new Date('2026-01-01')}
  GROUP BY u.id, u.email
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
`)

// Getypeerde ruwe SQL
const rows = await db.execute<{ id: string; email: string; postCount: number }>(sql`...`)
```

## Voorbeeld

**Gebruiker:** Drizzle met Neon instellen in een Next.js App Router project. Een `users`- en `subscriptions`-tabel (één-op-één) definiëren, met een migratieworkflow en een Server Action die een gebruiker aanmaakt met een gratis abonnement.

**Verwachte uitvoer:**
- `db/schema.ts` — `users` + `subscriptions` tabellen, `usersRelations` + `subscriptionsRelations`
- `drizzle.config.ts` — verwijst naar `DATABASE_URL_DIRECT` voor migraties
- `db/index.ts` — Neon HTTP driver (Edge-compatibel)
- `lib/actions/auth.ts` — Server Action met `db.transaction()` om beide tabellen atomisch in te voegen
- `package.json`-scripts: `"db:push"`, `"db:generate"`, `"db:migrate"`, `"db:studio"`

---
