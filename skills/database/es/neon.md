---
name: neon
description: "Neon serverless PostgreSQL: connection pooling, database branching, pgvector for AI, autoscaling patterns, Vercel integration"
---

> 🇪🇸 Versión en español. [Versión en inglés](../neon.md).

# Habilidad Neon

## Cuándo activar
- Configurar Neon DB en un entorno serverless (Vercel, Cloudflare Workers, AWS Lambda)
- Usar el branching de base de datos de Neon para entornos de vista previa o flujos de trabajo de PR
- Construir búsqueda vectorial con `pgvector` en Neon
- Depurar el agotamiento del pool de conexiones o problemas de arranque en frío
- Migrar desde un host Postgres tradicional a Neon

## Cuándo no usar
- Tareas de fondo de larga duración (Neon escala a cero — use RDS o una base de datos persistente)
- Cargas de trabajo con un número muy alto de conexiones sin pooling (use PgBouncer o el pooler integrado de Neon)
- Cuando necesita extensiones de Postgres que Neon aún no soporta

## Instrucciones

### Configuración de la conexión

Neon proporciona dos cadenas de conexión — use siempre la **con pooling** en entornos serverless:

```bash
# .env
# Con pooling (úsela en serverless — gestiona los límites de conexiones)
DATABASE_URL="postgresql://user:pass@ep-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Directa (úsela solo para migraciones)
DATABASE_URL_DIRECT="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Drizzle ORM (recomendado con Neon)

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

// Consulta
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, 'alice@example.com'),
})
```

### Prisma con Neon

```typescript
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // conexión con pooling
  directUrl = env("DATABASE_URL_DIRECT") // directa para migraciones
}
```

```bash
# Usar siempre directUrl para migraciones
npx prisma migrate deploy
```

### @neondatabase/serverless sin procesar (Edge Runtime / Cloudflare)

```typescript
// Funciona en Edge Runtime donde node-postgres no funciona
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Template literal etiquetado — parametrizado automáticamente
const users = await sql`SELECT * FROM users WHERE email = ${email}`

// En un manejador de ruta de Next.js
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const [user] = await sql`SELECT id, email, name FROM users WHERE id = ${id}`
  return Response.json(user)
}

export const runtime = 'edge' // funciona con el driver serverless de neon
```

### Branching de base de datos — la función estrella

Neon le permite hacer branching de la base de datos como en git. Cada rama es una instantánea copy-on-write instantánea — sin duplicación de datos hasta que escriba.

```bash
# Instalar el CLI de Neon
npm install -g neonctl
neonctl auth

# Crear una rama para una PR
neonctl branches create --name feature/add-payments --parent main

# Obtener la cadena de conexión para esta rama
neonctl connection-string feature/add-payments

# Ejecutar migraciones en la rama
DATABASE_URL=$(neonctl connection-string feature/add-payments) npx prisma migrate dev

# Eliminar cuando la PR sea fusionada
neonctl branches delete feature/add-payments
```

**Automatizar con GitHub Actions:**
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

### pgvector para aplicaciones de IA

```sql
-- Activar la extensión
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla con columna vectorial
CREATE TABLE documents (
  id       SERIAL PRIMARY KEY,
  content  TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)  -- la dimensión corresponde a su modelo de embedding
);

-- Índice para búsqueda de similitud rápida (crear después de la carga inicial de datos)
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);  -- lists ≈ sqrt(número_de_filas)
```

```typescript
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'

const sql = neon(process.env.DATABASE_URL!)
const openai = new OpenAI()

// Almacenar un documento con su embedding
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

// Búsqueda semántica
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

### Escalado automático a cero — gestión de conexiones

El cómputo de Neon escala a cero tras la inactividad. La primera consulta después del reposo tarda ~500ms adicionales. Gestione esto en su aplicación:

```typescript
// Agregar lógica de reintento para arranques en frío
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

// O deshabilitar el autoescalado en su cómputo para cargas de producción sensibles a la latencia
// (Consola de Neon → Compute → Autosuspend → Deshabilitado)
```

### Integración Neon + Vercel

```bash
# Vincular Neon a un proyecto de Vercel (configura DATABASE_URL automáticamente por entorno)
neonctl integrations create vercel \
  --project-id your-neon-project \
  --vercel-project-id your-vercel-project
```

Esto configura `DATABASE_URL` automáticamente en Vercel por entorno (producción → rama main, vista previa → ramas de PR).

## Ejemplo

**Usuario:** Configurar Neon con Drizzle ORM en un proyecto Next.js App Router, con pgvector para búsqueda semántica y una GitHub Action que crea una rama de base de datos para cada PR.

**Salida esperada:**
- `db/index.ts` — driver serverless de Neon + Drizzle, conexión con pooling
- `db/schema.ts` — tabla users + tabla documents con columna `vector(1536)`
- `lib/search.ts` — `indexDocument()` y `search()` usando embeddings de OpenAI
- `drizzle.config.ts` — usa `DATABASE_URL_DIRECT` para migraciones
- `.github/workflows/preview.yml` — create-branch-action + migración + despliegue en Vercel

---

> **Trabaje con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
