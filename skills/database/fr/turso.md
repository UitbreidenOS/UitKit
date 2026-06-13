---
name: turso
description: "Turso : SQLite intégré pour l'edge — configuration de base de données, client LibSQL, conception de schéma, modèles multi-locataires et déploiement avec Cloudflare Workers et Bun"
---

# Turso Skill

## Quand activer
- Construire une application edge ou serverless qui a besoin d'une base de données
- Configurer SQLite pour un projet basé sur Cloudflare Workers ou Bun
- Implémenter des bases de données par locataire (une SQLite par client)
- Migrer depuis Planetscale ou similaire et avoir besoin de SQL compatible edge
- Construire avec la pile T3 ou similaire et vouloir une base de données gratuite et rapide

## Quand ne PAS utiliser
- Données relationnelles complexes nécessitant des jointures sur de nombreuses tables — considérer PostgreSQL
- Applications avec un débit d'écriture élevé (SQLite a une sérialisation d'écriture)
- Applications nécessitant des extensions PostgreSQL complètes (pgvector, etc.) — utiliser Neon

## Instructions

### Configuration

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create a database
turso db create myapp-db
turso db create myapp-db --location fra  # specific region

# Get connection URL and token
turso db show myapp-db
turso db tokens create myapp-db

# Install LibSQL client
npm install @libsql/client

# Or with Drizzle ORM (recommended)
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

### Configuration du client

```typescript
Configurer le client LibSQL pour [project type].

Project: [Cloudflare Workers / Bun / Node.js / Next.js]

// lib/db.ts — basic LibSQL client
import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

// Execute queries
const result = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
const users = result.rows  // typed as Record<string, Value>[]

// Transactions
await db.batch([
  { sql: 'INSERT INTO orders (user_id, total) VALUES (?, ?)', args: [userId, total] },
  { sql: 'UPDATE users SET order_count = order_count + 1 WHERE id = ?', args: [userId] },
])

// With Drizzle ORM (better type safety):
import { drizzle } from 'drizzle-orm/libsql'

export const db = drizzle(
  createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })
)
```

### Schéma avec Drizzle

```typescript
Définir un schéma Drizzle pour Turso (dialecte LibSQL/SQLite).

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

// Generate and apply migrations:
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Modèle multi-locataire

```typescript
Implémenter l'isolement des données par locataire avec Turso.

Use case: SaaS avec une base de données SQLite par client (isolement complet des données)

// lib/tenant-db.ts
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

// Create a new database for each new tenant
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

// Get a DB client for a specific tenant
export function getTenantDb(tenantId: string) {
  return drizzle(
    createClient({
      url: `libsql://tenant-${tenantId}-your-org.turso.io`,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  )
}

// Usage in a route handler:
export async function handler(req: Request) {
  const tenantId = req.headers.get('X-Tenant-ID')!
  const db = getTenantDb(tenantId)
  
  const users = await db.select().from(usersTable)
  return Response.json(users)
}

Avantages des bases de données par locataire:
- Isolement complet des données (RGPD, conformité, exigence client)
- Sauvegarde et restauration indépendantes par locataire
- Pas de complexité de sécurité au niveau des lignes
- Les données de chaque locataire se trouvent dans son propre fichier SQLite
```

### Intégration de Cloudflare Workers

```typescript
Utiliser Turso avec Cloudflare Workers.

// wrangler.toml
[vars]
TURSO_DATABASE_URL = "libsql://your-db-your-org.turso.io"

# Note: auth token should be a secret, not a var
# wrangler secret put TURSO_AUTH_TOKEN

// worker.ts
import { createClient } from '@libsql/client/web'  // use /web for edge runtime
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

## Exemple

**User:** Je veux construire un projet personnel avec une base de données. Je ne veux pas payer pour l'hébergement. Quel est le chemin le plus simple?

**Claude's recommendation:**

**Le niveau gratuit Turso est imbattable pour les projets personnels:**
- 9GB de stockage gratuit
- 500 bases de données gratuites (une par projet ou par locataire)
- Emplacements edge mondiaux (données proches de vos utilisateurs)
- Pas de carte de crédit requise

**Configuration la plus rapide:**
```bash
# 1. Créer une base de données (2 min)
turso db create my-project
TURSO_DATABASE_URL=$(turso db show my-project --url)
TURSO_AUTH_TOKEN=$(turso db tokens create my-project)

# 2. Ajouter à .env
echo "TURSO_DATABASE_URL=$TURSO_DATABASE_URL" >> .env
echo "TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN" >> .env

# 3. Installer et commencer à utiliser
npm install @libsql/client drizzle-orm
```

**Recommandation de pile pour un projet personnel:**
- Bun + Elysia (backend) ou Next.js (full-stack)
- Turso + Drizzle ORM (base de données)
- Déployer sur Railway ou Fly.io

Coût total: $0/mois pour la plupart des projets personnels.

---
