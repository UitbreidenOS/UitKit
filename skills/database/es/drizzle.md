---
name: drizzle
description: "Drizzle ORM: schema TypeScript-first, relaciones, migraciones, query builder, integración Neon/Supabase/PlanetScale — el ORM legible por IA"
---

> 🇪🇸 Versión en español. [Versión en inglés](../drizzle.md).

# Skill Drizzle ORM

## Cuándo activar
- Definir un esquema de base de datos con la API TypeScript-first de Drizzle
- Escribir consultas con seguridad de tipos sin una abstracción ORM pesada
- Ejecutar migraciones de Drizzle Kit (push, generate, migrate)
- Configurar Drizzle con Neon, Supabase, PlanetScale, Turso o Postgres local
- Realizar consultas relacionales (with, findFirst, findMany)
- Usar Drizzle en Edge Runtime (Cloudflare Workers, Vercel Edge)

## Cuándo NO usar
- Si el proyecto ya usa Prisma — cambiar a mitad del proyecto tiene un alto costo
- Configuraciones complejas de múltiples bases de datos — Prisma lo maneja mejor
- Cuando se necesita caché de resultados de consultas integrado — usar una capa de caché separada

## Por qué Drizzle sobre Prisma para generación por IA

Drizzle mantiene una **correlación directa 1:1 con la sintaxis SQL**. Un LLM puede leer un esquema Drizzle y entender inmediatamente la estructura exacta de la tabla SQL sin ninguna sobrecarga de traducción. Prisma usa un lenguaje SDL abstracto (archivos `.prisma`) que obliga al modelo a mantener un mapeo mental separado. Esquema Drizzle = SQL. Por eso Drizzle es el ORM dominante en el ecosistema vibe coding.

## Instrucciones

### Instalación

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

### Definición del esquema

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

// Relaciones
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

### Configuración del cliente de base de datos

```typescript
// db/index.ts — Neon (serverless/Edge Runtime)
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// db/index.ts — Neon con WebSocket (Node.js, conexión completa)
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

// db/index.ts — node-postgres (Postgres local/autoalojado)
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

### Migraciones con Drizzle Kit

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT!, // usar URL directa (no pooled) para migraciones
  },
} satisfies Config
```

```bash
# Enviar esquema directamente (solo desarrollo — sin archivos de migración)
npx drizzle-kit push

# Generar archivos de migración (recomendado para producción)
npx drizzle-kit generate

# Aplicar migraciones pendientes
npx drizzle-kit migrate

# Abrir Drizzle Studio (navegador visual de DB)
npx drizzle-kit studio

# Verificar qué migraciones se ejecutarían
npx drizzle-kit check
```

### Consultas

```typescript
import { db } from '@/db'
import { users, posts } from '@/db/schema'
import { eq, and, or, like, gte, lte, desc, asc, count, sql } from 'drizzle-orm'

// Select
const allUsers = await db.select().from(users)

// Select con proyección (solo columnas específicas)
const emails = await db.select({ id: users.id, email: users.email }).from(users)

// Cláusulas Where
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

// Contar
const [{ total }] = await db.select({ total: count() }).from(users).where(eq(users.isActive, true))

// Insert
const [user] = await db.insert(users)
  .values({ email: 'alice@example.com', name: 'Alice' })
  .returning()

// Insertar múltiples
await db.insert(posts).values([
  { title: 'Post 1', authorId: user.id },
  { title: 'Post 2', authorId: user.id },
])

// Update
const [updated] = await db.update(users)
  .set({ name: 'Alice Updated', updatedAt: new Date() })
  .where(eq(users.id, userId))
  .returning()

// Upsert (en caso de conflicto)
await db.insert(users)
  .values({ email, name })
  .onConflictDoUpdate({
    target: users.email,
    set: { name, updatedAt: new Date() },
  })

// Delete
await db.delete(users).where(eq(users.id, userId))
```

### Consultas relacionales (con relaciones definidas)

```typescript
// findMany con relaciones — más limpio que la sintaxis de join
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

// findFirst (devuelve undefined si no se encuentra)
const user = await db.query.users.findFirst({
  where: eq(users.email, email),
  with: { posts: true },
})

// Relaciones anidadas
const postWithAuthor = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    author: {
      columns: { id: true, name: true, email: true },  // solo estas columnas
    },
  },
})
```

### Transacciones

```typescript
// Transacción secuencial
const result = await db.transaction(async (tx) => {
  const [user] = await tx.insert(users)
    .values({ email, name })
    .returning()

  await tx.insert(posts)
    .values({ title: 'Welcome post', authorId: user.id, published: true })

  return user
})

// Con rollback ante fallo de lógica de negocio
await db.transaction(async (tx) => {
  const [account] = await tx.select().from(accounts).where(eq(accounts.id, fromId)).for('update')

  if (account.balance < amount) {
    tx.rollback()  // rollback explícito
    return
  }

  await tx.update(accounts).set({ balance: sql`${accounts.balance} - ${amount}` }).where(eq(accounts.id, fromId))
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + ${amount}` }).where(eq(accounts.id, toId))
})
```

### SQL crudo para consultas complejas

```typescript
import { sql } from 'drizzle-orm'

// Cuando el query builder no es suficiente
const results = await db.execute(sql`
  SELECT u.id, u.email, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id AND p.published = true
  WHERE u.created_at > ${new Date('2026-01-01')}
  GROUP BY u.id, u.email
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
`)

// SQL crudo tipado
const rows = await db.execute<{ id: string; email: string; postCount: number }>(sql`...`)
```

## Ejemplo

**Usuario:** Configurar Drizzle con Neon en un proyecto Next.js App Router. Definir una tabla `users` y `subscriptions` (uno-a-uno), con un flujo de trabajo de migraciones y una Server Action que crea un usuario con una suscripción de nivel gratuito.

**Resultado esperado:**
- `db/schema.ts` — tablas `users` + `subscriptions`, `usersRelations` + `subscriptionsRelations`
- `drizzle.config.ts` — apunta a `DATABASE_URL_DIRECT` para migraciones
- `db/index.ts` — driver Neon HTTP (compatible con Edge)
- `lib/actions/auth.ts` — Server Action usando `db.transaction()` para insertar ambas tablas de forma atómica
- Scripts de `package.json`: `"db:push"`, `"db:generate"`, `"db:migrate"`, `"db:studio"`

---
