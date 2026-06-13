---
name: neon
description: "Neon serverless PostgreSQL: connection pooling, database branching, pgvector for AI, autoscaling patterns, Vercel integration"
updated: 2026-06-13
---

# Neon Skill

## When to activate
- Setting up Neon DB in a serverless environment (Vercel, Cloudflare Workers, AWS Lambda)
- Using Neon database branching for preview environments or PR workflows
- Building vector search with `pgvector` on Neon
- Debugging connection pool exhaustion or cold start issues
- Migrating from a traditional Postgres host to Neon

## When NOT to use
- Long-running background jobs (Neon scales to zero — use RDS or a persistent DB instead)
- Very high connection count workloads without pooling (use PgBouncer or Neon's built-in pooler)
- When you need Postgres extensions Neon doesn't support yet

## Instructions

### Connection setup

Neon provides two connection strings — always use the **pooled** one in serverless:

```bash
# .env
# Pooled (use this in serverless — handles connection limits)
DATABASE_URL="postgresql://user:pass@ep-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Direct (use this for migrations only)
DATABASE_URL_DIRECT="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Drizzle ORM (recommended with Neon)

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

### Prisma with Neon

```typescript
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // pooled connection
  directUrl = env("DATABASE_URL_DIRECT") // direct for migrations
}
```

```bash
# Always use directUrl for migrations
npx prisma migrate deploy
```

### Raw @neondatabase/serverless (Edge Runtime / Cloudflare)

```typescript
// Works in Edge Runtime where node-postgres doesn't
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Tagged template literal — automatically parameterised
const users = await sql`SELECT * FROM users WHERE email = ${email}`

// In a Next.js route handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const [user] = await sql`SELECT id, email, name FROM users WHERE id = ${id}`
  return Response.json(user)
}

export const runtime = 'edge' // works with neon serverless driver
```

### Database branching — the killer feature

Neon lets you branch the database like git. Each branch is an instant copy-on-write snapshot — no data duplication until you write.

```bash
# Install Neon CLI
npm install -g neonctl
neonctl auth

# Create a branch for a PR
neonctl branches create --name feature/add-payments --parent main

# Get the connection string for this branch
neonctl connection-string feature/add-payments

# Run migrations on the branch
DATABASE_URL=$(neonctl connection-string feature/add-payments) npx prisma migrate dev

# Delete when PR is merged
neonctl branches delete feature/add-payments
```

**Automate with GitHub Actions:**
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

### pgvector for AI apps

```sql
-- Enable the extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table with vector column
CREATE TABLE documents (
  id       SERIAL PRIMARY KEY,
  content  TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)  -- dimension matches your embedding model
);

-- Index for fast similarity search (create after initial data load)
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);  -- lists ≈ sqrt(row_count)
```

```typescript
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'

const sql = neon(process.env.DATABASE_URL!)
const openai = new OpenAI()

// Store a document with its embedding
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

// Semantic search
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

### Autoscale to zero — connection handling

Neon computes scale to zero after inactivity. The first query after sleep takes ~500ms extra. Handle this in your app:

```typescript
// Add retry logic for cold starts
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

// Or disable autoscale on your compute for latency-sensitive prod workloads
// (Neon Console → Compute → Autosuspend → Disabled)
```

### Neon + Vercel integration

```bash
# Link Neon to a Vercel project (sets DATABASE_URL automatically per environment)
neonctl integrations create vercel \
  --project-id your-neon-project \
  --vercel-project-id your-vercel-project
```

This automatically sets `DATABASE_URL` in Vercel per environment (production → main branch, preview → PR branches).

## Example

**User:** Set up Neon with Drizzle ORM in a Next.js App Router project, with pgvector for semantic search and a GitHub Action that creates a DB branch for each PR.

**Expected output:**
- `db/index.ts` — Neon serverless driver + Drizzle, pooled connection
- `db/schema.ts` — users table + documents table with `vector(1536)` column
- `lib/search.ts` — `indexDocument()` and `search()` using OpenAI embeddings
- `drizzle.config.ts` — uses `DATABASE_URL_DIRECT` for migrations
- `.github/workflows/preview.yml` — create-branch-action + migrate + Vercel deploy

---
