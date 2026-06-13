---
name: prisma
description: "Prisma ORM: schema design, relations, migrations, nested writes, middleware, raw queries, type-safe database access"
---

> 🇫🇷 Version française. [English version](../prisma.md).

# Compétence Prisma

## Quand activer
- Concevoir un schéma Prisma avec des modèles et des relations
- Écrire des requêtes Prisma Client (find, create, update, upsert, delete)
- Créer ou appliquer des migrations (`prisma migrate`)
- Écrire des créations/mises à jour imbriquées entre des relations
- Ajouter un middleware Prisma pour la journalisation ou les suppressions logiques
- Utiliser du SQL brut via `$queryRaw` ou `$executeRaw`
- Configurer Prisma avec un pooler de connexions (PgBouncer, Neon, Supabase)

## Quand NE PAS utiliser
- SQL analytique très complexe (fonctions fenêtre, CTE) — utiliser `$queryRaw` ou la compétence SQL
- Lorsque vous avez dépassé les abstractions de Prisma et avez besoin d'un contrôle ORM complet — envisager Drizzle ou Kysley
- Scripts PostgreSQL bruts — utiliser la compétence SQL

## Instructions

### Conception du schéma

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_DIRECT") // pour Neon/Supabase : poolé pour l'application, direct pour les migrations
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
  @@map("users")  // mapper vers un nom de table différent
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

### Configuration du client

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Modèle Singleton — évite l'épuisement des connexions en développement
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Requêtes CRUD

```typescript
// Recherche
const user = await prisma.user.findUnique({ where: { id } })
const user = await prisma.user.findUniqueOrThrow({ where: { id } })  // lève une exception si introuvable
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
    createdAt: { gte: new Date('2026-01-01') },
    OR: [{ name: { contains: 'alice' } }, { email: { endsWith: '@example.com' } }],
  },
  select: { id: true, email: true, name: true },  // ne récupérer que les champs nécessaires
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize,
})

// Compter avec les données
const [users, total] = await prisma.$transaction([
  prisma.user.findMany({ where, skip, take }),
  prisma.user.count({ where }),
])

// Créer
const user = await prisma.user.create({
  data: { email, name, role: 'USER' },
})

// Mettre à jour
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

// Supprimer
await prisma.user.delete({ where: { id } })

// Suppression logique (définir deletedAt au lieu de supprimer)
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

### Écritures imbriquées (la fonctionnalité la plus puissante de Prisma)

```typescript
// Créer un utilisateur avec un profil en une seule transaction
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

// Mettre à jour avec connect/disconnect imbriqué (plusieurs-à-plusieurs)
await prisma.post.update({
  where: { id: postId },
  data: {
    tags: {
      connect: [{ id: tag1Id }, { id: tag2Id }],    // ajouter des tags
      disconnect: [{ id: oldTagId }],                 // supprimer un tag
      // connectOrCreate pour un ajout de tag en mode upsert
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
// include — récupérer la relation (peut être profondément imbriquée)
const postWithAuthor = await prisma.post.findUnique({
  where: { id },
  include: {
    author: { select: { id: true, name: true } },  // select dans include
    tags: true,
  },
})

// select — choisir des champs spécifiques (plus efficace)
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    _count: { select: { posts: true } },  // compter la relation
  },
})
```

### Migrations

```bash
# Créer un fichier de migration (dev uniquement — s'exécute immédiatement)
npx prisma migrate dev --name add_published_at_to_posts

# Appliquer les migrations en attente (production)
npx prisma migrate deploy

# Vérifier le statut des migrations
npx prisma migrate status

# Réinitialiser la base de données (dev uniquement — supprime et recrée)
npx prisma migrate reset

# Générer le client après un changement de schéma
npx prisma generate

# Ouvrir Prisma Studio (navigateur visuel de base de données)
npx prisma studio
```

### Transactions

```typescript
// Opérations séquentielles (tout ou rien)
const [post, _] = await prisma.$transaction([
  prisma.post.create({ data: { title, authorId } }),
  prisma.user.update({ where: { id: authorId }, data: { postCount: { increment: 1 } } }),
])

// Transaction interactive (à utiliser lorsque vous avez besoin de résultats entre les opérations)
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
// Middleware de suppression logique
prisma.$use(async (params, next) => {
  // Intercepter les opérations de suppression
  if (params.action === 'delete') {
    params.action = 'update'
    params.args.data = { deletedAt: new Date() }
  }
  if (params.action === 'deleteMany') {
    params.action = 'updateMany'
    params.args.data = { deletedAt: new Date() }
  }

  // Exclure les enregistrements supprimés logiquement des requêtes
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = { ...params.args.where, deletedAt: null }
  }

  return next(params)
})

// Middleware de journalisation des requêtes
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

### Requêtes brutes

```typescript
// Lorsque le générateur de requêtes de Prisma n'est pas suffisant
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name
  FROM users
  WHERE created_at > ${new Date('2026-01-01')}
  ORDER BY created_at DESC
`

// Execute (sans valeur de retour)
await prisma.$executeRaw`
  UPDATE users SET last_seen = NOW() WHERE id = ${userId}
`

// Raw non sécurisé (pour les requêtes dynamiques — attention à l'injection SQL)
const table = 'users'
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${table}" WHERE id = $1`, userId
)
```

## Exemple

**Utilisateur :** Concevez un schéma Prisma pour une plateforme de blog avec des utilisateurs, des articles, des commentaires et des tags (plusieurs-à-plusieurs). Incluez des requêtes pour une liste d'articles paginée avec l'auteur et le nombre de tags, ainsi qu'une création imbriquée pour un nouvel article avec des tags.

**Résultat attendu :**
- Schéma : modèles `User`, `Post`, `Comment`, `Tag` avec des relations appropriées, des index et `@@map` vers des tables en snake_case
- Requête : `findMany` avec `select`, `_count`, `orderBy`, pagination `skip/take`
- Mutation : `post.create` avec `tags: { connectOrCreate: [...] }`
- Commande de migration à appliquer

---
