---
name: drizzle
description: "Drizzle ORM: TypeScript-first Schema, Relationen, Migrationen, Query Builder, Neon/Supabase/PlanetScale-Integration — das KI-lesbare ORM"
---

> 🇩🇪 Deutsche Version. [Englische Version](../drizzle.md).

# Drizzle ORM Skill

## Wann aktivieren
- Datenbankschema mit Drizzles TypeScript-first API definieren
- Typsichere Abfragen ohne schwere ORM-Abstraktion schreiben
- Drizzle Kit Migrationen ausführen (push, generate, migrate)
- Drizzle mit Neon, Supabase, PlanetScale, Turso oder lokalem Postgres einrichten
- Relationale Abfragen ausführen (with, findFirst, findMany)
- Drizzle in der Edge Runtime verwenden (Cloudflare Workers, Vercel Edge)

## Wann NICHT verwenden
- Wenn das Projekt bereits Prisma verwendet — ein Wechsel mitten im Projekt ist aufwändig
- Komplexe Multi-Datenbank-Setups — Prisma handhabt das besser
- Wenn ein integrierter Abfrage-Ergebnis-Cache benötigt wird — separate Caching-Schicht verwenden

## Warum Drizzle statt Prisma für KI-Generierung

Drizzle behält eine **direkte 1:1-Korrelation zur SQL-Syntax** bei. Ein LLM kann ein Drizzle-Schema lesen und die genaue SQL-Tabellenstruktur sofort verstehen — ohne Übersetzungsaufwand. Prisma verwendet eine abstrakte SDL-Sprache (`.prisma`-Dateien), die das Modell zwingt, eine separate mentale Abbildung zu pflegen. Drizzle-Schema = SQL. Deshalb ist Drizzle das dominierende ORM im Vibe-Coding-Ökosystem.

## Anweisungen

### Installation

```bash
# PostgreSQL (Neon, Supabase, lokal)
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# SQLite (Turso, lokal)
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit

# MySQL (PlanetScale)
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Schema-Definition

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

// Relationen
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

### Datenbank-Client-Einrichtung

```typescript
// db/index.ts — Neon (serverless/Edge Runtime)
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// db/index.ts — Neon mit WebSocket (Node.js, vollständige Verbindung)
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

// db/index.ts — node-postgres (lokal/selbst gehostetes Postgres)
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

### Migrationen mit Drizzle Kit

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT!, // direkte URL (nicht gepoolte) für Migrationen verwenden
  },
} satisfies Config
```

```bash
# Schema direkt übertragen (nur für Entwicklung — keine Migrationsdateien)
npx drizzle-kit push

# Migrationsdateien generieren (für Produktion empfohlen)
npx drizzle-kit generate

# Ausstehende Migrationen anwenden
npx drizzle-kit migrate

# Drizzle Studio öffnen (visueller DB-Browser)
npx drizzle-kit studio

# Prüfen, welche Migrationen ausgeführt würden
npx drizzle-kit check
```

### Abfragen

```typescript
import { db } from '@/db'
import { users, posts } from '@/db/schema'
import { eq, and, or, like, gte, lte, desc, asc, count, sql } from 'drizzle-orm'

// Select
const allUsers = await db.select().from(users)

// Select mit Projektion (nur bestimmte Spalten)
const emails = await db.select({ id: users.id, email: users.email }).from(users)

// Where-Klauseln
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

// Zählen
const [{ total }] = await db.select({ total: count() }).from(users).where(eq(users.isActive, true))

// Insert
const [user] = await db.insert(users)
  .values({ email: 'alice@example.com', name: 'Alice' })
  .returning()

// Mehrere einfügen
await db.insert(posts).values([
  { title: 'Post 1', authorId: user.id },
  { title: 'Post 2', authorId: user.id },
])

// Update
const [updated] = await db.update(users)
  .set({ name: 'Alice Updated', updatedAt: new Date() })
  .where(eq(users.id, userId))
  .returning()

// Upsert (bei Konflikt)
await db.insert(users)
  .values({ email, name })
  .onConflictDoUpdate({
    target: users.email,
    set: { name, updatedAt: new Date() },
  })

// Delete
await db.delete(users).where(eq(users.id, userId))
```

### Relationale Abfragen (mit definierten Relationen)

```typescript
// findMany mit Relationen — sauberer als Join-Syntax
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

// findFirst (gibt undefined zurück, wenn nicht gefunden)
const user = await db.query.users.findFirst({
  where: eq(users.email, email),
  with: { posts: true },
})

// Verschachtelte Relationen
const postWithAuthor = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    author: {
      columns: { id: true, name: true, email: true },  // nur diese Spalten
    },
  },
})
```

### Transaktionen

```typescript
// Sequentielle Transaktion
const result = await db.transaction(async (tx) => {
  const [user] = await tx.insert(users)
    .values({ email, name })
    .returning()

  await tx.insert(posts)
    .values({ title: 'Welcome post', authorId: user.id, published: true })

  return user
})

// Mit Rollback bei Geschäftslogik-Fehler
await db.transaction(async (tx) => {
  const [account] = await tx.select().from(accounts).where(eq(accounts.id, fromId)).for('update')

  if (account.balance < amount) {
    tx.rollback()  // expliziter Rollback
    return
  }

  await tx.update(accounts).set({ balance: sql`${accounts.balance} - ${amount}` }).where(eq(accounts.id, fromId))
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + ${amount}` }).where(eq(accounts.id, toId))
})
```

### Rohes SQL für komplexe Abfragen

```typescript
import { sql } from 'drizzle-orm'

// Wenn der Query Builder nicht ausreicht
const results = await db.execute(sql`
  SELECT u.id, u.email, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id AND p.published = true
  WHERE u.created_at > ${new Date('2026-01-01')}
  GROUP BY u.id, u.email
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
`)

// Typisiertes rohes SQL
const rows = await db.execute<{ id: string; email: string; postCount: number }>(sql`...`)
```

## Beispiel

**Benutzer:** Drizzle mit Neon in einem Next.js App Router Projekt einrichten. Eine `users`- und `subscriptions`-Tabelle (eins-zu-eins) definieren, mit einem Migrations-Workflow und einer Server Action, die einen Benutzer mit einem kostenlosen Abonnement erstellt.

**Erwartete Ausgabe:**
- `db/schema.ts` — `users` + `subscriptions` Tabellen, `usersRelations` + `subscriptionsRelations`
- `drizzle.config.ts` — zeigt auf `DATABASE_URL_DIRECT` für Migrationen
- `db/index.ts` — Neon HTTP Driver (Edge-kompatibel)
- `lib/actions/auth.ts` — Server Action mit `db.transaction()` zum atomaren Einfügen beider Tabellen
- `package.json`-Skripte: `"db:push"`, `"db:generate"`, `"db:migrate"`, `"db:studio"`

---
