---
name: prisma
description: "Prisma ORM: schema design, relations, migrations, nested writes, middleware, raw queries, type-safe database access"
---

> 🇩🇪 Deutsche Version. [Englische Version](../prisma.md).

# Prisma Skill

## Wann aktivieren
- Entwurf eines Prisma-Schemas mit Modellen und Relationen
- Schreiben von Prisma Client-Abfragen (find, create, update, upsert, delete)
- Erstellen oder Anwenden von Migrationen (`prisma migrate`)
- Schreiben von verschachtelten Erstellungen/Aktualisierungen über Relationen hinweg
- Hinzufügen von Prisma-Middleware für Logging oder Soft Deletes
- Verwenden von Raw-SQL über `$queryRaw` oder `$executeRaw`
- Einrichten von Prisma mit einem Connection-Pooler (PgBouncer, Neon, Supabase)

## Wann NICHT verwenden
- Sehr komplexes analytisches SQL (Fensterfunktionen, CTEs) — `$queryRaw` oder den SQL-Skill verwenden
- Wenn die Abstraktionen von Prisma nicht mehr ausreichen und vollständige ORM-Kontrolle benötigt wird — Drizzle oder Kysley erwägen
- Rohe PostgreSQL-Skripte — den SQL-Skill verwenden

## Anweisungen

### Schema-Design

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_DIRECT") // für Neon/Supabase: gepoolte Verbindung für die App, direkte Verbindung für Migrationen
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationen
  posts     Post[]
  profile   Profile?

  @@index([email])
  @@map("users")  // auf einen anderen Tabellennamen abbilden
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

### Client-Einrichtung

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Singleton-Muster — verhindert Verbindungserschöpfung in der Entwicklung
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### CRUD-Abfragen

```typescript
// Suchen
const user = await prisma.user.findUnique({ where: { id } })
const user = await prisma.user.findUniqueOrThrow({ where: { id } })  // wirft Fehler wenn nicht gefunden
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
    createdAt: { gte: new Date('2026-01-01') },
    OR: [{ name: { contains: 'alice' } }, { email: { endsWith: '@example.com' } }],
  },
  select: { id: true, email: true, name: true },  // nur benötigte Felder abrufen
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize,
})

// Zählen zusammen mit Daten
const [users, total] = await prisma.$transaction([
  prisma.user.findMany({ where, skip, take }),
  prisma.user.count({ where }),
])

// Erstellen
const user = await prisma.user.create({
  data: { email, name, role: 'USER' },
})

// Aktualisieren
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

// Löschen
await prisma.user.delete({ where: { id } })

// Soft Delete (deletedAt setzen statt löschen)
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

### Verschachtelte Schreibvorgänge (die mächtigste Prisma-Funktion)

```typescript
// Benutzer mit Profil in einer Transaktion erstellen
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

// Aktualisieren mit verschachteltem connect/disconnect (viele-zu-viele)
await prisma.post.update({
  where: { id: postId },
  data: {
    tags: {
      connect: [{ id: tag1Id }, { id: tag2Id }],    // Tags hinzufügen
      disconnect: [{ id: oldTagId }],                 // einen Tag entfernen
      // connectOrCreate für Upsert-artiges Tag-Hinzufügen
      connectOrCreate: {
        where: { name: 'typescript' },
        create: { name: 'typescript' },
      },
    },
  },
})
```

### Relationen — include vs select

```typescript
// include — Relation abrufen (kann tief verschachtelt sein)
const postWithAuthor = await prisma.post.findUnique({
  where: { id },
  include: {
    author: { select: { id: true, name: true } },  // select innerhalb von include
    tags: true,
  },
})

// select — spezifische Felder auswählen (effizienter)
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    _count: { select: { posts: true } },  // Relation zählen
  },
})
```

### Migrationen

```bash
# Eine Migrationsdatei erstellen (nur Entwicklung — wird sofort ausgeführt)
npx prisma migrate dev --name add_published_at_to_posts

# Ausstehende Migrationen anwenden (Produktion)
npx prisma migrate deploy

# Migrationsstatus prüfen
npx prisma migrate status

# Datenbank zurücksetzen (nur Entwicklung — löscht und erstellt neu)
npx prisma migrate reset

# Client nach Schemaänderung generieren
npx prisma generate

# Prisma Studio öffnen (visueller Datenbankbrowser)
npx prisma studio
```

### Transaktionen

```typescript
// Sequenzielle Operationen (alles oder nichts)
const [post, _] = await prisma.$transaction([
  prisma.post.create({ data: { title, authorId } }),
  prisma.user.update({ where: { id: authorId }, data: { postCount: { increment: 1 } } }),
])

// Interaktive Transaktion (verwenden, wenn Ergebnisse zwischen Operationen benötigt werden)
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
// Soft-Delete-Middleware
prisma.$use(async (params, next) => {
  // Löschoperationen abfangen
  if (params.action === 'delete') {
    params.action = 'update'
    params.args.data = { deletedAt: new Date() }
  }
  if (params.action === 'deleteMany') {
    params.action = 'updateMany'
    params.args.data = { deletedAt: new Date() }
  }

  // Soft-gelöschte Datensätze aus Abfragen ausschließen
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = { ...params.args.where, deletedAt: null }
  }

  return next(params)
})

// Abfrage-Logging-Middleware
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

### Raw-Abfragen

```typescript
// Wenn der Abfrage-Builder von Prisma nicht ausreicht
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name
  FROM users
  WHERE created_at > ${new Date('2026-01-01')}
  ORDER BY created_at DESC
`

// Execute (kein Rückgabewert)
await prisma.$executeRaw`
  UPDATE users SET last_seen = NOW() WHERE id = ${userId}
`

// Unsicheres Raw (für dynamische Abfragen — Vorsicht vor SQL-Injection)
const table = 'users'
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${table}" WHERE id = $1`, userId
)
```

## Beispiel

**Benutzer:** Entwerfen Sie ein Prisma-Schema für eine Blog-Plattform mit Benutzern, Beiträgen, Kommentaren und Tags (viele-zu-viele). Fügen Sie Abfragen für eine paginierte Beitrags-Liste mit Autor und Tag-Anzahl sowie eine verschachtelte Erstellung für einen neuen Beitrag mit Tags ein.

**Erwartete Ausgabe:**
- Schema: `User`-, `Post`-, `Comment`-, `Tag`-Modelle mit korrekten Relationen, Indizes und `@@map` zu snake_case-Tabellen
- Abfrage: `findMany` mit `select`, `_count`, `orderBy`, `skip/take`-Paginierung
- Mutation: `post.create` mit `tags: { connectOrCreate: [...] }`
- Migrationsbefehl zur Anwendung

---
