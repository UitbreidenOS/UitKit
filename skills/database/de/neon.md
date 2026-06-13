---
name: neon
description: "Neon serverless PostgreSQL: connection pooling, database branching, pgvector for AI, autoscaling patterns, Vercel integration"
---

> 🇩🇪 Deutsche Version. [Englische Version](../neon.md).

# Neon-Skill

## Wann aktivieren
- Einrichtung von Neon DB in einer serverlosen Umgebung (Vercel, Cloudflare Workers, AWS Lambda)
- Verwendung von Neon-Datenbank-Branching für Vorschau-Umgebungen oder PR-Workflows
- Aufbau von Vektorsuche mit `pgvector` auf Neon
- Debugging von Connection-Pool-Erschöpfung oder Cold-Start-Problemen
- Migration von einem traditionellen Postgres-Host zu Neon

## Wann nicht verwenden
- Langlaufende Hintergrundprozesse (Neon skaliert auf null — verwenden Sie stattdessen RDS oder eine persistente Datenbank)
- Workloads mit sehr hoher Verbindungsanzahl ohne Pooling (verwenden Sie PgBouncer oder Neons integrierten Pooler)
- Wenn Sie Postgres-Erweiterungen benötigen, die Neon noch nicht unterstützt

## Anweisungen

### Verbindungseinrichtung

Neon stellt zwei Verbindungsstrings bereit — verwenden Sie in serverlosen Umgebungen immer den **gepoolten**:

```bash
# .env
# Gepooled (in serverlos verwenden — verwaltet Verbindungslimits)
DATABASE_URL="postgresql://user:pass@ep-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Direkt (nur für Migrationen verwenden)
DATABASE_URL_DIRECT="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Drizzle ORM (empfohlen mit Neon)

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

// Abfrage
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, 'alice@example.com'),
})
```

### Prisma mit Neon

```typescript
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // gepoolte Verbindung
  directUrl = env("DATABASE_URL_DIRECT") // direkt für Migrationen
}
```

```bash
# Immer directUrl für Migrationen verwenden
npx prisma migrate deploy
```

### Rohes @neondatabase/serverless (Edge Runtime / Cloudflare)

```typescript
// Funktioniert in Edge Runtime wo node-postgres nicht funktioniert
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Getaggtes Template-Literal — automatisch parametrisiert
const users = await sql`SELECT * FROM users WHERE email = ${email}`

// In einem Next.js Route-Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const [user] = await sql`SELECT id, email, name FROM users WHERE id = ${id}`
  return Response.json(user)
}

export const runtime = 'edge' // funktioniert mit dem neon serverless Treiber
```

### Datenbank-Branching — das Killer-Feature

Neon ermöglicht das Branching der Datenbank wie bei git. Jeder Branch ist ein sofortiger Copy-on-Write-Snapshot — keine Datenduplizierung bis zum Schreiben.

```bash
# Neon CLI installieren
npm install -g neonctl
neonctl auth

# Einen Branch für eine PR erstellen
neonctl branches create --name feature/add-payments --parent main

# Den Verbindungsstring für diesen Branch abrufen
neonctl connection-string feature/add-payments

# Migrationen auf dem Branch ausführen
DATABASE_URL=$(neonctl connection-string feature/add-payments) npx prisma migrate dev

# Löschen wenn PR gemergt ist
neonctl branches delete feature/add-payments
```

**Mit GitHub Actions automatisieren:**
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

### pgvector für KI-Anwendungen

```sql
-- Erweiterung aktivieren
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabelle mit Vektorspalte
CREATE TABLE documents (
  id       SERIAL PRIMARY KEY,
  content  TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)  -- Dimension entspricht Ihrem Embedding-Modell
);

-- Index für schnelle Ähnlichkeitssuche (nach dem initialen Datenladen erstellen)
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);  -- lists ≈ sqrt(Zeilenanzahl)
```

```typescript
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'

const sql = neon(process.env.DATABASE_URL!)
const openai = new OpenAI()

// Ein Dokument mit seinem Embedding speichern
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

// Semantische Suche
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

### Automatisches Skalieren auf null — Verbindungsbehandlung

Neon-Compute skaliert nach Inaktivität auf null. Die erste Abfrage nach dem Schlaf dauert ~500ms länger. Behandeln Sie dies in Ihrer Anwendung:

```typescript
// Wiederholungslogik für Cold Starts hinzufügen
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

// Oder Autoscale auf Ihrem Compute für latenzempfindliche Produktions-Workloads deaktivieren
// (Neon-Konsole → Compute → Autosuspend → Deaktiviert)
```

### Neon + Vercel-Integration

```bash
# Neon mit einem Vercel-Projekt verknüpfen (setzt DATABASE_URL automatisch pro Umgebung)
neonctl integrations create vercel \
  --project-id your-neon-project \
  --vercel-project-id your-vercel-project
```

Dies setzt `DATABASE_URL` in Vercel automatisch pro Umgebung (Produktion → main-Branch, Vorschau → PR-Branches).

## Beispiel

**Benutzer:** Neon mit Drizzle ORM in einem Next.js App Router-Projekt einrichten, mit pgvector für semantische Suche und einer GitHub Action, die für jede PR einen DB-Branch erstellt.

**Erwartete Ausgabe:**
- `db/index.ts` — Neon serverless Treiber + Drizzle, gepoolte Verbindung
- `db/schema.ts` — users-Tabelle + documents-Tabelle mit `vector(1536)`-Spalte
- `lib/search.ts` — `indexDocument()` und `search()` mit OpenAI-Embeddings
- `drizzle.config.ts` — verwendet `DATABASE_URL_DIRECT` für Migrationen
- `.github/workflows/preview.yml` — create-branch-action + Migration + Vercel-Deployment

---
