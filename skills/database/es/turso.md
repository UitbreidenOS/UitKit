---
name: turso
description: "Turso: SQLite integrado para el edge — configuración de base de datos, cliente LibSQL, diseño de esquema, patrones multi-tenancy y despliegue con Cloudflare Workers y Bun"
---

# Skill Turso

## Cuándo activar
- Construir una aplicación edge o sin servidor que necesite una base de datos
- Configurar SQLite para un proyecto basado en Cloudflare Workers o Bun
- Implementar bases de datos por inquilino (una SQLite por cliente)
- Migrar desde Planetscale o similar y necesitar SQL compatible con edge
- Construir con la pila T3 o similar y querer una base de datos gratuita y rápida

## Cuándo NO usar
- Datos relacionales complejos que requieren joins en muchas tablas — considerar PostgreSQL
- Aplicaciones de alto rendimiento de escritura (SQLite tiene serialización de escritura)
- Aplicaciones que necesitan extensiones completas de PostgreSQL (pgvector, etc.) — usar Neon

## Instrucciones

### Configuración

```bash
# Instalar CLI de Turso
curl -sSfL https://get.tur.so/install.sh | bash

# Iniciar sesión
turso auth login

# Crear una base de datos
turso db create myapp-db
turso db create myapp-db --location fra  # región específica

# Obtener URL de conexión y token
turso db show myapp-db
turso db tokens create myapp-db

# Instalar cliente LibSQL
npm install @libsql/client

# O con Drizzle ORM (recomendado)
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

### Configuración del cliente

```typescript
Configurar el cliente LibSQL para [tipo de proyecto].

Proyecto: [Cloudflare Workers / Bun / Node.js / Next.js]

// lib/db.ts — cliente LibSQL básico
import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

// Ejecutar consultas
const result = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
const users = result.rows  // typed as Record<string, Value>[]

// Transacciones
await db.batch([
  { sql: 'INSERT INTO orders (user_id, total) VALUES (?, ?)', args: [userId, total] },
  { sql: 'UPDATE users SET order_count = order_count + 1 WHERE id = ?', args: [userId] },
])

// Con Drizzle ORM (mejor seguridad de tipo):
import { drizzle } from 'drizzle-orm/libsql'

export const db = drizzle(
  createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })
)
```

### Esquema con Drizzle

```typescript
Definir un esquema de Drizzle para Turso (dialecto LibSQL/SQLite).

// db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  plan: text('plan', { enum: ['free', 'pro', 'enterprise'] }).default('free'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'),
  publishedAt: text('published_at'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config

// Generar y aplicar migraciones:
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Patrón multi-tenancy

```typescript
Implementar aislamiento de base de datos por inquilino con Turso.

Caso de uso: SaaS con una base de datos SQLite por cliente (aislamiento completo de datos)

// lib/tenant-db.ts
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

// Crear una nueva base de datos para cada inquilino nuevo
export async function createTenantDb(tenantId: string) {
  const response = await fetch('https://api.turso.tech/v1/databases', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `tenant-${tenantId}`,
      group: 'production',
    }),
  })
  const { database } = await response.json()
  return database.Hostname
}

// Obtener un cliente de BD para un inquilino específico
export function getTenantDb(tenantId: string) {
  return drizzle(
    createClient({
      url: `libsql://tenant-${tenantId}-your-org.turso.io`,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  )
}

// Uso en un manejador de ruta:
export async function handler(req: Request) {
  const tenantId = req.headers.get('X-Tenant-ID')!
  const db = getTenantDb(tenantId)
  
  const users = await db.select().from(usersTable)
  return Response.json(users)
}

Ventajas de bases de datos por inquilino:
- Aislamiento completo de datos (GDPR, cumplimiento, requisito del cliente)
- Copia de seguridad y restauración independiente por inquilino
- Sin complejidad de seguridad a nivel de fila
- Los datos de cada inquilino viven en su propio archivo SQLite
```

### Integración de Cloudflare Workers

```typescript
Usar Turso con Cloudflare Workers.

// wrangler.toml
[vars]
TURSO_DATABASE_URL = "libsql://your-db-your-org.turso.io"

# Nota: el token de autenticación debe ser un secreto, no una variable
# wrangler secret put TURSO_AUTH_TOKEN

// worker.ts
import { createClient } from '@libsql/client/web'  // usar /web para runtime edge
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './db/schema'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    })
    
    const db = drizzle(client, { schema })
    
    const users = await db.select().from(schema.users).limit(10)
    return Response.json(users)
  }
}

interface Env {
  TURSO_DATABASE_URL: string
  TURSO_AUTH_TOKEN: string
}
```

## Ejemplo

**Usuario:** Quiero construir un proyecto personal con una base de datos. No quiero pagar por hosting. ¿Cuál es el camino más simple?

**Recomendación de Claude:**

**El nivel gratuito de Turso es inmejorable para proyectos personales:**
- 9GB de almacenamiento gratuito
- 500 bases de datos gratuitas (una por proyecto o por inquilino)
- Ubicaciones edge globales (datos cerca de tus usuarios)
- Sin tarjeta de crédito requerida

**Configuración más rápida:**
```bash
# 1. Crear base de datos (2 min)
turso db create my-project
TURSO_DATABASE_URL=$(turso db show my-project --url)
TURSO_AUTH_TOKEN=$(turso db tokens create my-project)

# 2. Agregar a .env
echo "TURSO_DATABASE_URL=$TURSO_DATABASE_URL" >> .env
echo "TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN" >> .env

# 3. Instalar y comenzar a usar
npm install @libsql/client drizzle-orm
```

**Recomendación de pila para un proyecto personal:**
- Bun + Elysia (backend) o Next.js (full-stack)
- Turso + Drizzle ORM (base de datos)
- Desplegado en Railway o Fly.io

Costo total: $0/mes para la mayoría de proyectos personales.

---
