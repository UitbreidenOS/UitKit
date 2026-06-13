---
name: prisma
description: "Prisma ORM: schema design, relations, migrations, nested writes, middleware, raw queries, type-safe database access"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../prisma.md).

# Prisma Skill

## Wanneer activeren
- Een Prisma-schema ontwerpen met modellen en relaties
- Prisma Client-queries schrijven (find, create, update, upsert, delete)
- Migraties aanmaken of toepassen (`prisma migrate`)
- Geneste aanmaak/bijwerking schrijven over relaties heen
- Prisma-middleware toevoegen voor logging of soft deletes
- Raw SQL gebruiken via `$queryRaw` of `$executeRaw`
- Prisma instellen met een connection pooler (PgBouncer, Neon, Supabase)

## Wanneer NIET gebruiken
- Zeer complexe analytische SQL (vensterfuncties, CTE's) — gebruik `$queryRaw` of de SQL-skill
- Wanneer de abstracties van Prisma niet meer volstaan en volledige ORM-controle nodig is — overweeg Drizzle of Kysley
- Ruwe PostgreSQL-scripts — gebruik de SQL-skill

## Instructies

### Schema-ontwerp

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_DIRECT") // voor Neon/Supabase: gepoold voor de app, direct voor migraties
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaties
  posts     Post[]
  profile   Profile?

  @@index([email])
  @@map("users")  // koppelen aan een andere tabelnaam
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

### Client-instelling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Singleton-patroon — voorkomt verbindingsuitputting tijdens ontwikkeling
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### CRUD-queries

```typescript
// Zoeken
const user = await prisma.user.findUnique({ where: { id } })
const user = await prisma.user.findUniqueOrThrow({ where: { id } })  // gooit een fout als niet gevonden
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
    createdAt: { gte: new Date('2026-01-01') },
    OR: [{ name: { contains: 'alice' } }, { email: { endsWith: '@example.com' } }],
  },
  select: { id: true, email: true, name: true },  // alleen benodigde velden ophalen
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize,
})

// Tellen naast data
const [users, total] = await prisma.$transaction([
  prisma.user.findMany({ where, skip, take }),
  prisma.user.count({ where }),
])

// Aanmaken
const user = await prisma.user.create({
  data: { email, name, role: 'USER' },
})

// Bijwerken
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

// Verwijderen
await prisma.user.delete({ where: { id } })

// Soft delete (deletedAt instellen in plaats van verwijderen)
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

### Geneste schrijfbewerkingen (de krachtigste Prisma-functie)

```typescript
// Gebruiker met profiel aanmaken in één transactie
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

// Bijwerken met geneste connect/disconnect (veel-op-veel)
await prisma.post.update({
  where: { id: postId },
  data: {
    tags: {
      connect: [{ id: tag1Id }, { id: tag2Id }],    // tags toevoegen
      disconnect: [{ id: oldTagId }],                 // een tag verwijderen
      // connectOrCreate voor upsert-achtige tagtoevoeging
      connectOrCreate: {
        where: { name: 'typescript' },
        create: { name: 'typescript' },
      },
    },
  },
})
```

### Relaties — include vs select

```typescript
// include — de relatie ophalen (kan diep genest zijn)
const postWithAuthor = await prisma.post.findUnique({
  where: { id },
  include: {
    author: { select: { id: true, name: true } },  // select binnen include
    tags: true,
  },
})

// select — specifieke velden kiezen (efficiënter)
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    _count: { select: { posts: true } },  // relatie tellen
  },
})
```

### Migraties

```bash
# Een migratiebestand aanmaken (alleen voor ontwikkeling — wordt onmiddellijk uitgevoerd)
npx prisma migrate dev --name add_published_at_to_posts

# Openstaande migraties toepassen (productie)
npx prisma migrate deploy

# Migratiestatus controleren
npx prisma migrate status

# Database resetten (alleen voor ontwikkeling — verwijdert en herstelt)
npx prisma migrate reset

# Client genereren na schemawijziging
npx prisma generate

# Prisma Studio openen (visuele databasebrowser)
npx prisma studio
```

### Transacties

```typescript
// Opeenvolgende bewerkingen (alles of niets)
const [post, _] = await prisma.$transaction([
  prisma.post.create({ data: { title, authorId } }),
  prisma.user.update({ where: { id: authorId }, data: { postCount: { increment: 1 } } }),
])

// Interactieve transactie (gebruiken wanneer resultaten tussen bewerkingen nodig zijn)
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
// Soft-delete-middleware
prisma.$use(async (params, next) => {
  // Verwijderbewerkingen onderscheppen
  if (params.action === 'delete') {
    params.action = 'update'
    params.args.data = { deletedAt: new Date() }
  }
  if (params.action === 'deleteMany') {
    params.action = 'updateMany'
    params.args.data = { deletedAt: new Date() }
  }

  // Soft-verwijderde records uitsluiten van queries
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = { ...params.args.where, deletedAt: null }
  }

  return next(params)
})

// Query-logging-middleware
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
// Wanneer de query-builder van Prisma niet volstaat
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name
  FROM users
  WHERE created_at > ${new Date('2026-01-01')}
  ORDER BY created_at DESC
`

// Execute (geen retourwaarde)
await prisma.$executeRaw`
  UPDATE users SET last_seen = NOW() WHERE id = ${userId}
`

// Onveilige raw (voor dynamische queries — let op SQL-injectie)
const table = 'users'
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${table}" WHERE id = $1`, userId
)
```

## Voorbeeld

**Gebruiker:** Ontwerp een Prisma-schema voor een blogplatform met gebruikers, berichten, reacties en tags (veel-op-veel). Voeg queries toe voor een gepagineerde berichtenlijst met auteur en tagaantal, en een geneste aanmaak voor een nieuw bericht met tags.

**Verwachte uitvoer:**
- Schema: `User`-, `Post`-, `Comment`-, `Tag`-modellen met de juiste relaties, indexen en `@@map` naar snake_case-tabellen
- Query: `findMany` met `select`, `_count`, `orderBy`, `skip/take`-paginering
- Mutatie: `post.create` met `tags: { connectOrCreate: [...] }`
- Migratieopdracht om toe te passen

---
