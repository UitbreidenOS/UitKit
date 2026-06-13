---
name: neon
description: "Neon serverless PostgreSQL: connection pooling, database branching, pgvector for AI, autoscaling patterns, Vercel integration"
---

> 🇫🇷 Version française. [English version](../neon.md).

# Compétence Neon

## Quand activer
- Mise en place de Neon DB dans un environnement serverless (Vercel, Cloudflare Workers, AWS Lambda)
- Utilisation du branchement de base de données Neon pour les environnements de prévisualisation ou les workflows PR
- Construction d'une recherche vectorielle avec `pgvector` sur Neon
- Débogage de l'épuisement du pool de connexions ou des problèmes de démarrage à froid
- Migration depuis un hôte Postgres traditionnel vers Neon

## Quand ne pas utiliser
- Tâches de fond à longue durée (Neon passe à zéro — utilisez RDS ou une base de données persistante à la place)
- Charges de travail avec un très grand nombre de connexions sans pooling (utilisez PgBouncer ou le pooler intégré de Neon)
- Quand vous avez besoin d'extensions Postgres que Neon ne supporte pas encore

## Instructions

### Configuration de la connexion

Neon fournit deux chaînes de connexion — utilisez toujours celle avec **pooling** dans un environnement serverless :

```bash
# .env
# Avec pooling (à utiliser en serverless — gère les limites de connexions)
DATABASE_URL="postgresql://user:pass@ep-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Direct (à utiliser uniquement pour les migrations)
DATABASE_URL_DIRECT="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Drizzle ORM (recommandé avec Neon)

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// db/schema.ts
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Requête
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, 'alice@example.com'),
})
```

### Prisma avec Neon

```typescript
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // connexion avec pooling
  directUrl = env("DATABASE_URL_DIRECT") // directe pour les migrations
}
```

```bash
# Toujours utiliser directUrl pour les migrations
npx prisma migrate deploy
```

### @neondatabase/serverless brut (Edge Runtime / Cloudflare)

```typescript
// Fonctionne dans Edge Runtime où node-postgres ne fonctionne pas
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Template littéral balisé — automatiquement paramétré
const users = await sql`SELECT * FROM users WHERE email = ${email}`

// Dans un gestionnaire de route Next.js
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const [user] = await sql`SELECT id, email, name FROM users WHERE id = ${id}`
  return Response.json(user)
}

export const runtime = 'edge' // fonctionne avec le driver serverless neon
```

### Branchement de base de données — la fonctionnalité phare

Neon vous permet de brancher la base de données comme git. Chaque branche est un instantané copy-on-write — pas de duplication de données tant que vous n'écrivez pas.

```bash
# Installer le CLI Neon
npm install -g neonctl
neonctl auth

# Créer une branche pour une PR
neonctl branches create --name feature/add-payments --parent main

# Obtenir la chaîne de connexion pour cette branche
neonctl connection-string feature/add-payments

# Exécuter les migrations sur la branche
DATABASE_URL=$(neonctl connection-string feature/add-payments) npx prisma migrate dev

# Supprimer quand la PR est fusionnée
neonctl branches delete feature/add-payments
```

**Automatiser avec GitHub Actions :**
```yaml
# .github/workflows/preview.yml
name: Preview Environment
on: [pull_request]

jobs:
  create-preview-db:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/create-branch-action@v5
        id: create-branch
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: preview/pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Run migrations on preview branch
        env:
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url_with_pooler }}
        run: npx prisma migrate deploy

      - name: Deploy to Vercel with preview DB
        env:
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url_with_pooler }}
        run: vercel deploy --env DATABASE_URL=$DATABASE_URL
```

### pgvector pour les applications IA

```sql
-- Activer l'extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table avec colonne vectorielle
CREATE TABLE documents (
  id       SERIAL PRIMARY KEY,
  content  TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)  -- la dimension correspond à votre modèle d'embedding
);

-- Index pour une recherche de similarité rapide (créer après le chargement initial des données)
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);  -- lists ≈ sqrt(nombre_de_lignes)
```

```typescript
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'

const sql = neon(process.env.DATABASE_URL!)
const openai = new OpenAI()

// Stocker un document avec son embedding
async function indexDocument(content: string, metadata: object) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: content,
  })
  const embedding = data[0].embedding
  await sql`
    INSERT INTO documents (content, metadata, embedding)
    VALUES (${content}, ${JSON.stringify(metadata)}, ${JSON.stringify(embedding)}::vector)
  `
}

// Recherche sémantique
async function search(query: string, limit = 5) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  })
  const embedding = data[0].embedding
  return sql`
    SELECT id, content, metadata,
           1 - (embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
    LIMIT ${limit}
  `
}
```

### Passage à zéro automatique — gestion des connexions

Le calcul de Neon passe à zéro après inactivité. La première requête après la mise en veille prend environ 500ms de plus. Gérez cela dans votre application :

```typescript
// Ajouter une logique de réessai pour les démarrages à froid
async function queryWithRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 200 * (i + 1)))
    }
  }
  throw new Error('unreachable')
}

// Ou désactiver l'autoscale sur votre compute pour les charges de production sensibles à la latence
// (Console Neon → Compute → Autosuspend → Désactivé)
```

### Intégration Neon + Vercel

```bash
# Lier Neon à un projet Vercel (définit DATABASE_URL automatiquement par environnement)
neonctl integrations create vercel \
  --project-id your-neon-project \
  --vercel-project-id your-vercel-project
```

Cela définit automatiquement `DATABASE_URL` dans Vercel par environnement (production → branche main, prévisualisation → branches PR).

## Exemple

**Utilisateur :** Configurer Neon avec Drizzle ORM dans un projet Next.js App Router, avec pgvector pour la recherche sémantique et une GitHub Action qui crée une branche DB pour chaque PR.

**Résultat attendu :**
- `db/index.ts` — driver serverless Neon + Drizzle, connexion avec pooling
- `db/schema.ts` — table users + table documents avec colonne `vector(1536)`
- `lib/search.ts` — `indexDocument()` et `search()` utilisant les embeddings OpenAI
- `drizzle.config.ts` — utilise `DATABASE_URL_DIRECT` pour les migrations
- `.github/workflows/preview.yml` — create-branch-action + migration + déploiement Vercel

---
