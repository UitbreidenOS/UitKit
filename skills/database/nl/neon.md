---
name: neon
description: "Neon serverless PostgreSQL: connection pooling, database branching, pgvector for AI, autoscaling patterns, Vercel integration"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../neon.md).

# Neon-vaardigheid

## Wanneer activeren
- Neon DB instellen in een serverloze omgeving (Vercel, Cloudflare Workers, AWS Lambda)
- Neon database-branching gebruiken voor preview-omgevingen of PR-workflows
- Vectorzoekopdrachten bouwen met `pgvector` op Neon
- Debuggen van connection pool-uitputting of cold start-problemen
- Migreren van een traditionele Postgres-host naar Neon

## Wanneer niet gebruiken
- Langlopende achtergrondtaken (Neon schaalt naar nul — gebruik RDS of een persistente database)
- Workloads met een zeer hoog aantal verbindingen zonder pooling (gebruik PgBouncer of Neon's ingebouwde pooler)
- Wanneer u Postgres-extensies nodig heeft die Neon nog niet ondersteunt

## Instructies

### Verbindingsinstellingen

Neon biedt twee verbindingsstrings — gebruik altijd de **gepoolde** in serverloze omgevingen:

```bash
# .env
# Gepooled (gebruik dit in serverless — verwerkt verbindingslimieten)
DATABASE_URL="postgresql://user:pass@ep-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Direct (gebruik dit alleen voor migraties)
DATABASE_URL_DIRECT="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Drizzle ORM (aanbevolen met Neon)

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

// Query
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, 'alice@example.com'),
})
```

### Prisma met Neon

```typescript
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // gepoolde verbinding
  directUrl = env("DATABASE_URL_DIRECT") // direct voor migraties
}
```

```bash
# Gebruik altijd directUrl voor migraties
npx prisma migrate deploy
```

### Ruwe @neondatabase/serverless (Edge Runtime / Cloudflare)

```typescript
// Werkt in Edge Runtime waar node-postgres niet werkt
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Getagd template literal — automatisch geparametriseerd
const users = await sql`SELECT * FROM users WHERE email = ${email}`

// In een Next.js route-handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const [user] = await sql`SELECT id, email, name FROM users WHERE id = ${id}`
  return Response.json(user)
}

export const runtime = 'edge' // werkt met de neon serverless driver
```

### Database-branching — de killer-functie

Neon laat u de database branchen zoals git. Elke branch is een directe copy-on-write-snapshot — geen gegevensdupliciatie totdat u schrijft.

```bash
# Neon CLI installeren
npm install -g neonctl
neonctl auth

# Een branch aanmaken voor een PR
neonctl branches create --name feature/add-payments --parent main

# De verbindingsstring voor deze branch ophalen
neonctl connection-string feature/add-payments

# Migraties uitvoeren op de branch
DATABASE_URL=$(neonctl connection-string feature/add-payments) npx prisma migrate dev

# Verwijderen wanneer PR is gemerged
neonctl branches delete feature/add-payments
```

**Automatiseren met GitHub Actions:**
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

### pgvector voor AI-applicaties

```sql
-- De extensie inschakelen
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabel met vectorkolom
CREATE TABLE documents (
  id       SERIAL PRIMARY KEY,
  content  TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)  -- dimensie komt overeen met uw embedding-model
);

-- Index voor snelle gelijkenisopdrachten (aanmaken na initieel laden van gegevens)
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);  -- lists ≈ sqrt(aantal_rijen)
```

```typescript
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'

const sql = neon(process.env.DATABASE_URL!)
const openai = new OpenAI()

// Een document met zijn embedding opslaan
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

// Semantisch zoeken
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

### Automatisch schalen naar nul — verbindingsbeheer

Neon-compute schaalt naar nul na inactiviteit. De eerste query na slaapstand duurt ~500ms langer. Verwerk dit in uw applicatie:

```typescript
// Herhaalpogingslogica toevoegen voor cold starts
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

// Of autoscale uitschakelen op uw compute voor latentiegevoelige productie-workloads
// (Neon-console → Compute → Autosuspend → Uitgeschakeld)
```

### Neon + Vercel-integratie

```bash
# Neon koppelen aan een Vercel-project (stelt DATABASE_URL automatisch in per omgeving)
neonctl integrations create vercel \
  --project-id your-neon-project \
  --vercel-project-id your-vercel-project
```

Dit stelt `DATABASE_URL` automatisch in in Vercel per omgeving (productie → main-branch, preview → PR-branches).

## Voorbeeld

**Gebruiker:** Neon instellen met Drizzle ORM in een Next.js App Router-project, met pgvector voor semantisch zoeken en een GitHub Action die voor elke PR een DB-branch aanmaakt.

**Verwachte uitvoer:**
- `db/index.ts` — Neon serverless driver + Drizzle, gepoolde verbinding
- `db/schema.ts` — users-tabel + documents-tabel met `vector(1536)`-kolom
- `lib/search.ts` — `indexDocument()` en `search()` met OpenAI-embeddings
- `drizzle.config.ts` — gebruikt `DATABASE_URL_DIRECT` voor migraties
- `.github/workflows/preview.yml` — create-branch-action + migratie + Vercel-deploy

---
