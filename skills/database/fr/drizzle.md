---
name: drizzle
description: "Drizzle ORM: schéma TypeScript-first, relations, migrations, query builder, intégration Neon/Supabase/PlanetScale — l'ORM lisible par l'IA"
---

> 🇫🇷 Version française. [English version](../drizzle.md).

# Compétence Drizzle ORM

## Quand l'activer
- Définir un schéma de base de données avec l'API TypeScript-first de Drizzle
- Écrire des requêtes type-safe sans abstraction ORM lourde
- Exécuter des migrations Drizzle Kit (push, generate, migrate)
- Configurer Drizzle avec Neon, Supabase, PlanetScale, Turso, ou Postgres local
- Effectuer des requêtes relationnelles (with, findFirst, findMany)
- Utiliser Drizzle dans l'Edge Runtime (Cloudflare Workers, Vercel Edge)

## Quand NE PAS utiliser
- Si votre projet utilise déjà Prisma — changer en cours de projet est coûteux
- Les configurations multi-bases de données complexes — Prisma gère cela mieux
- Quand vous avez besoin d'un cache de résultats intégré — utilisez une couche de cache séparée

## Pourquoi Drizzle plutôt que Prisma pour la génération par IA

Drizzle maintient une **corrélation directe 1:1 avec la syntaxe SQL**. Un LLM peut lire un schéma Drizzle et comprendre immédiatement la structure exacte de la table SQL sans aucune traduction. Prisma utilise un langage SDL abstrait (fichiers `.prisma`) qui oblige le modèle à maintenir une correspondance mentale séparée. Schéma Drizzle = SQL. C'est pourquoi Drizzle est l'ORM dominant dans l'écosystème vibe coding.

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

### Définition du schéma

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

### Configuration du client de base de données

```typescript
// db/index.ts — Neon (serverless/Edge Runtime)
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// db/index.ts — Neon avec WebSocket (Node.js, connexion complète)
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

// db/index.ts — node-postgres (Postgres local/auto-hébergé)
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

### Migrations avec Drizzle Kit

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT!, // utiliser l'URL directe (non poolée) pour les migrations
  },
} satisfies Config
```

```bash
# Pousser le schéma directement (développement uniquement — pas de fichiers de migration)
npx drizzle-kit push

# Générer les fichiers de migration (recommandé pour la production)
npx drizzle-kit generate

# Appliquer les migrations en attente
npx drizzle-kit migrate

# Ouvrir Drizzle Studio (navigateur visuel de DB)
npx drizzle-kit studio

# Vérifier quelles migrations seraient exécutées
npx drizzle-kit check
```

### Requêtes

```typescript
import { db } from '@/db'
import { users, posts } from '@/db/schema'
import { eq, and, or, like, gte, lte, desc, asc, count, sql } from 'drizzle-orm'

// Select
const allUsers = await db.select().from(users)

// Select avec projection (uniquement des colonnes spécifiques)
const emails = await db.select({ id: users.id, email: users.email }).from(users)

// Clauses Where
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

// Insert multiple
await db.insert(posts).values([
  { title: 'Post 1', authorId: user.id },
  { title: 'Post 2', authorId: user.id },
])

// Update
const [updated] = await db.update(users)
  .set({ name: 'Alice Updated', updatedAt: new Date() })
  .where(eq(users.id, userId))
  .returning()

// Upsert (en cas de conflit)
await db.insert(users)
  .values({ email, name })
  .onConflictDoUpdate({
    target: users.email,
    set: { name, updatedAt: new Date() },
  })

// Delete
await db.delete(users).where(eq(users.id, userId))
```

### Requêtes relationnelles (avec relations définies)

```typescript
// findMany avec relations — plus propre que la syntaxe de jointure
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

// findFirst (retourne undefined si non trouvé)
const user = await db.query.users.findFirst({
  where: eq(users.email, email),
  with: { posts: true },
})

// Relations imbriquées
const postWithAuthor = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    author: {
      columns: { id: true, name: true, email: true },  // uniquement ces colonnes
    },
  },
})
```

### Transactions

```typescript
// Transaction séquentielle
const result = await db.transaction(async (tx) => {
  const [user] = await tx.insert(users)
    .values({ email, name })
    .returning()

  await tx.insert(posts)
    .values({ title: 'Welcome post', authorId: user.id, published: true })

  return user
})

// Avec rollback en cas d'échec de logique métier
await db.transaction(async (tx) => {
  const [account] = await tx.select().from(accounts).where(eq(accounts.id, fromId)).for('update')

  if (account.balance < amount) {
    tx.rollback()  // rollback explicite
    return
  }

  await tx.update(accounts).set({ balance: sql`${accounts.balance} - ${amount}` }).where(eq(accounts.id, fromId))
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + ${amount}` }).where(eq(accounts.id, toId))
})
```

### SQL brut pour les requêtes complexes

```typescript
import { sql } from 'drizzle-orm'

// Quand le query builder ne suffit pas
const results = await db.execute(sql`
  SELECT u.id, u.email, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id AND p.published = true
  WHERE u.created_at > ${new Date('2026-01-01')}
  GROUP BY u.id, u.email
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
`)

// SQL brut typé
const rows = await db.execute<{ id: string; email: string; postCount: number }>(sql`...`)
```

## Exemple

**Utilisateur :** Configurer Drizzle avec Neon dans un projet Next.js App Router. Définir une table `users` et `subscriptions` (un-à-un), avec un workflow de migration et une Server Action qui crée un utilisateur avec un abonnement au niveau gratuit.

**Résultat attendu :**
- `db/schema.ts` — tables `users` + `subscriptions`, `usersRelations` + `subscriptionsRelations`
- `drizzle.config.ts` — pointe vers `DATABASE_URL_DIRECT` pour les migrations
- `db/index.ts` — driver Neon HTTP (compatible Edge)
- `lib/actions/auth.ts` — Server Action utilisant `db.transaction()` pour insérer les deux tables de façon atomique
- Scripts `package.json` : `"db:push"`, `"db:generate"`, `"db:migrate"`, `"db:studio"`

---
