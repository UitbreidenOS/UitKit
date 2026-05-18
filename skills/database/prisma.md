---
name: prisma
description: "Prisma ORM: schema design, relations, migrations, nested writes, middleware, raw queries, type-safe database access"
---

# Prisma Skill

## When to activate
- Designing a Prisma schema with models and relations
- Writing Prisma Client queries (find, create, update, upsert, delete)
- Creating or applying migrations (`prisma migrate`)
- Writing nested creates/updates across relations
- Adding Prisma middleware for logging or soft deletes
- Using raw SQL via `$queryRaw` or `$executeRaw`
- Setting up Prisma with a connection pooler (PgBouncer, Neon, Supabase)

## When NOT to use
- Very complex analytical SQL (window functions, CTEs) — use `$queryRaw` or the SQL skill
- When you've outgrown Prisma's abstractions and need full ORM control — consider Drizzle or Kysley
- Raw PostgreSQL scripts — use the SQL skill

## Instructions

### Schema design

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_DIRECT") // for Neon/Supabase: pooled for app, direct for migrations
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
  profile   Profile?

  @@index([email])
  @@map("users")  // map to a different table name
}

model Profile {
  id     String @id @default(cuid())
  bio    String?
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Post {
  id          String   @id @default(cuid())
  title       String
  content     String?
  published   Boolean  @default(false)
  publishedAt DateTime?
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  tags        Tag[]    @relation("PostTags")

  @@index([authorId])
  @@index([published, publishedAt(sort: Desc)])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[] @relation("PostTags")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### Client setup

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Singleton pattern — prevents connection exhaustion in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### CRUD queries

```typescript
// Find
const user = await prisma.user.findUnique({ where: { id } })
const user = await prisma.user.findUniqueOrThrow({ where: { id } })  // throws if not found
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
    createdAt: { gte: new Date('2026-01-01') },
    OR: [{ name: { contains: 'alice' } }, { email: { endsWith: '@example.com' } }],
  },
  select: { id: true, email: true, name: true },  // only fetch needed fields
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize,
})

// Count alongside data
const [users, total] = await prisma.$transaction([
  prisma.user.findMany({ where, skip, take }),
  prisma.user.count({ where }),
])

// Create
const user = await prisma.user.create({
  data: { email, name, role: 'USER' },
})

// Update
const user = await prisma.user.update({
  where: { id },
  data: { name, updatedAt: new Date() },
})

// Upsert
const user = await prisma.user.upsert({
  where: { email },
  create: { email, name },
  update: { name },
})

// Delete
await prisma.user.delete({ where: { id } })

// Soft delete (set deletedAt instead of deleting)
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

### Nested writes (the most powerful Prisma feature)

```typescript
// Create user with profile in one transaction
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    name: 'Alice',
    profile: {
      create: { bio: 'Software engineer' },
    },
    posts: {
      create: [
        { title: 'Hello World', published: true },
        { title: 'Draft Post' },
      ],
    },
  },
  include: {
    profile: true,
    posts: true,
  },
})

// Update with nested connect/disconnect (many-to-many)
await prisma.post.update({
  where: { id: postId },
  data: {
    tags: {
      connect: [{ id: tag1Id }, { id: tag2Id }],    // add tags
      disconnect: [{ id: oldTagId }],                 // remove a tag
      // connectOrCreate for upsert-style tag addition
      connectOrCreate: {
        where: { name: 'typescript' },
        create: { name: 'typescript' },
      },
    },
  },
})
```

### Relations — include vs select

```typescript
// include — fetch the relation (can be deeply nested)
const postWithAuthor = await prisma.post.findUnique({
  where: { id },
  include: {
    author: { select: { id: true, name: true } },  // select within include
    tags: true,
  },
})

// select — pick specific fields (more efficient)
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    _count: { select: { posts: true } },  // count relation
  },
})
```

### Migrations

```bash
# Create a migration file (dev only — runs it immediately)
npx prisma migrate dev --name add_published_at_to_posts

# Apply pending migrations (production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset DB (dev only — drops and recreates)
npx prisma migrate reset

# Generate client after schema change
npx prisma generate

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

### Transactions

```typescript
// Sequential operations (all or nothing)
const [post, _] = await prisma.$transaction([
  prisma.post.create({ data: { title, authorId } }),
  prisma.user.update({ where: { id: authorId }, data: { postCount: { increment: 1 } } }),
])

// Interactive transaction (use when you need results between operations)
await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUniqueOrThrow({ where: { id } })
  if (user.credits < amount) throw new Error('Insufficient credits')

  await tx.user.update({
    where: { id },
    data: { credits: { decrement: amount } },
  })
  await tx.transaction.create({
    data: { userId: id, amount, type: 'debit' },
  })
})
```

### Middleware

```typescript
// Soft delete middleware
prisma.$use(async (params, next) => {
  // Intercept delete operations
  if (params.action === 'delete') {
    params.action = 'update'
    params.args.data = { deletedAt: new Date() }
  }
  if (params.action === 'deleteMany') {
    params.action = 'updateMany'
    params.args.data = { deletedAt: new Date() }
  }

  // Exclude soft-deleted records from queries
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = { ...params.args.where, deletedAt: null }
  }

  return next(params)
})

// Query logging middleware
prisma.$use(async (params, next) => {
  const start = Date.now()
  const result = await next(params)
  const duration = Date.now() - start
  if (duration > 500) {
    console.warn(`Slow query: ${params.model}.${params.action} took ${duration}ms`)
  }
  return result
})
```

### Raw queries

```typescript
// When Prisma's query builder isn't enough
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name
  FROM users
  WHERE created_at > ${new Date('2026-01-01')}
  ORDER BY created_at DESC
`

// Execute (no return value)
await prisma.$executeRaw`
  UPDATE users SET last_seen = NOW() WHERE id = ${userId}
`

// Unsafe raw (for dynamic queries — be careful with SQL injection)
const table = 'users'
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${table}" WHERE id = $1`, userId
)
```

## Example

**User:** Design a Prisma schema for a blog platform with users, posts, comments, and tags (many-to-many). Include queries for a paginated post list with author and tag count, and a nested create for a new post with tags.

**Expected output:**
- Schema: `User`, `Post`, `Comment`, `Tag` models with proper relations, indexes, and `@@map` to snake_case tables
- Query: `findMany` with `select`, `_count`, `orderBy`, `skip/take` pagination
- Mutation: `post.create` with `tags: { connectOrCreate: [...] }`
- Migration command to apply

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
