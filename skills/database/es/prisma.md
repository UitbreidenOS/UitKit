---
name: prisma
description: "Prisma ORM: schema design, relations, migrations, nested writes, middleware, raw queries, type-safe database access"
---

> 🇪🇸 Versión en español. [Versión en inglés](../prisma.md).

# Skill de Prisma

## Cuándo activar
- Diseñar un esquema de Prisma con modelos y relaciones
- Escribir consultas de Prisma Client (find, create, update, upsert, delete)
- Crear o aplicar migraciones (`prisma migrate`)
- Escribir creaciones/actualizaciones anidadas entre relaciones
- Agregar middleware de Prisma para logging o eliminaciones lógicas
- Usar SQL en bruto mediante `$queryRaw` o `$executeRaw`
- Configurar Prisma con un pooler de conexiones (PgBouncer, Neon, Supabase)

## Cuándo NO usar
- SQL analítico muy complejo (funciones de ventana, CTEs) — usar `$queryRaw` o el skill de SQL
- Cuando se han superado las abstracciones de Prisma y se necesita control total del ORM — considerar Drizzle o Kysley
- Scripts de PostgreSQL en bruto — usar el skill de SQL

## Instrucciones

### Diseño del esquema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_DIRECT") // para Neon/Supabase: con pool para la app, directo para migraciones
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  posts     Post[]
  profile   Profile?

  @@index([email])
  @@map("users")  // mapear a un nombre de tabla diferente
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

### Configuración del cliente

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Patrón Singleton — previene el agotamiento de conexiones en desarrollo
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Consultas CRUD

```typescript
// Buscar
const user = await prisma.user.findUnique({ where: { id } })
const user = await prisma.user.findUniqueOrThrow({ where: { id } })  // lanza error si no se encuentra
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
    createdAt: { gte: new Date('2026-01-01') },
    OR: [{ name: { contains: 'alice' } }, { email: { endsWith: '@example.com' } }],
  },
  select: { id: true, email: true, name: true },  // obtener solo los campos necesarios
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize,
})

// Contar junto con los datos
const [users, total] = await prisma.$transaction([
  prisma.user.findMany({ where, skip, take }),
  prisma.user.count({ where }),
])

// Crear
const user = await prisma.user.create({
  data: { email, name, role: 'USER' },
})

// Actualizar
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

// Eliminar
await prisma.user.delete({ where: { id } })

// Eliminación lógica (establecer deletedAt en lugar de eliminar)
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

### Escrituras anidadas (la función más potente de Prisma)

```typescript
// Crear usuario con perfil en una sola transacción
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

// Actualizar con connect/disconnect anidado (muchos-a-muchos)
await prisma.post.update({
  where: { id: postId },
  data: {
    tags: {
      connect: [{ id: tag1Id }, { id: tag2Id }],    // agregar tags
      disconnect: [{ id: oldTagId }],                 // eliminar un tag
      // connectOrCreate para agregar tags al estilo upsert
      connectOrCreate: {
        where: { name: 'typescript' },
        create: { name: 'typescript' },
      },
    },
  },
})
```

### Relaciones — include vs select

```typescript
// include — obtener la relación (puede estar profundamente anidada)
const postWithAuthor = await prisma.post.findUnique({
  where: { id },
  include: {
    author: { select: { id: true, name: true } },  // select dentro de include
    tags: true,
  },
})

// select — elegir campos específicos (más eficiente)
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    _count: { select: { posts: true } },  // contar la relación
  },
})
```

### Migraciones

```bash
# Crear un archivo de migración (solo desarrollo — se ejecuta inmediatamente)
npx prisma migrate dev --name add_published_at_to_posts

# Aplicar migraciones pendientes (producción)
npx prisma migrate deploy

# Verificar el estado de las migraciones
npx prisma migrate status

# Resetear la base de datos (solo desarrollo — elimina y vuelve a crear)
npx prisma migrate reset

# Generar el cliente tras un cambio de esquema
npx prisma generate

# Abrir Prisma Studio (navegador visual de base de datos)
npx prisma studio
```

### Transacciones

```typescript
// Operaciones secuenciales (todo o nada)
const [post, _] = await prisma.$transaction([
  prisma.post.create({ data: { title, authorId } }),
  prisma.user.update({ where: { id: authorId }, data: { postCount: { increment: 1 } } }),
])

// Transacción interactiva (usar cuando se necesitan resultados entre operaciones)
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
// Middleware de eliminación lógica
prisma.$use(async (params, next) => {
  // Interceptar operaciones de eliminación
  if (params.action === 'delete') {
    params.action = 'update'
    params.args.data = { deletedAt: new Date() }
  }
  if (params.action === 'deleteMany') {
    params.action = 'updateMany'
    params.args.data = { deletedAt: new Date() }
  }

  // Excluir registros eliminados lógicamente de las consultas
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = { ...params.args.where, deletedAt: null }
  }

  return next(params)
})

// Middleware de logging de consultas
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

### Consultas en bruto

```typescript
// Cuando el generador de consultas de Prisma no es suficiente
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name
  FROM users
  WHERE created_at > ${new Date('2026-01-01')}
  ORDER BY created_at DESC
`

// Execute (sin valor de retorno)
await prisma.$executeRaw`
  UPDATE users SET last_seen = NOW() WHERE id = ${userId}
`

// Raw no seguro (para consultas dinámicas — tener cuidado con la inyección SQL)
const table = 'users'
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${table}" WHERE id = $1`, userId
)
```

## Ejemplo

**Usuario:** Diseñe un esquema de Prisma para una plataforma de blog con usuarios, publicaciones, comentarios y tags (muchos-a-muchos). Incluya consultas para una lista de publicaciones paginada con autor y recuento de tags, y una creación anidada para una nueva publicación con tags.

**Resultado esperado:**
- Esquema: modelos `User`, `Post`, `Comment`, `Tag` con relaciones adecuadas, índices y `@@map` a tablas en snake_case
- Consulta: `findMany` con `select`, `_count`, `orderBy`, paginación `skip/take`
- Mutación: `post.create` con `tags: { connectOrCreate: [...] }`
- Comando de migración para aplicar

---
