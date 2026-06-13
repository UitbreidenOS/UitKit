---
name: postgresql
description: "PostgreSQL backend patterns: full-text search, JSONB, arrays, pg_notify, PL/pgSQL functions, connection pooling with asyncpg and node-postgres"
updated: 2026-06-13
---

# PostgreSQL Skill

## When to activate
- Using PostgreSQL-specific features beyond standard SQL (full-text search, JSONB, arrays, pg_notify)
- Setting up connection pooling with asyncpg (Python) or node-postgres (Node.js)
- Writing PL/pgSQL functions or triggers
- Using PostgreSQL's pub/sub via `LISTEN`/`NOTIFY`
- Querying and indexing JSONB columns
- Building a real-time feature backed by PostgreSQL instead of Redis pub/sub

## When NOT to use
- Standard CRUD with an ORM — use the Prisma or SQLAlchemy skill instead
- Generic SQL queries — use the SQL skill
- When you're on Neon or Supabase — also check those dedicated skills for platform-specific patterns

## Instructions

### Connection setup

**Python (asyncpg — fastest async PostgreSQL driver):**
```python
import asyncpg
import os

# Connection pool (create once at startup)
pool: asyncpg.Pool

async def create_pool():
    global pool
    pool = await asyncpg.create_pool(
        dsn=os.environ["DATABASE_URL"],
        min_size=2,
        max_size=10,
        command_timeout=30,
        server_settings={
            "application_name": "myapp",
            "jit": "off",  # disable JIT for OLTP workloads
        },
    )

async def get_user(user_id: str) -> dict | None:
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, email, name FROM users WHERE id = $1", user_id
        )
        return dict(row) if row else None

# Transactions
async def transfer(from_id: str, to_id: str, amount: int):
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute(
                "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
                amount, from_id
            )
            await conn.execute(
                "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
                amount, to_id
            )
```

**Node.js (node-postgres):**
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Always use parameterised queries
async function getUser(id: string) {
  const { rows } = await pool.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [id]
  )
  return rows[0] ?? null
}

// Transaction helper
async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
```

### Full-text search

```sql
-- Add a generated tsvector column (auto-updated)
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

-- GIN index for fast full-text search
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Search query with ranking
SELECT
  id, title,
  ts_rank(search_vector, query) AS rank,
  ts_headline('english', content, query, 'MaxFragments=2') AS excerpt
FROM posts, to_tsquery('english', 'typescript & patterns') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

**From application code:**
```python
# asyncpg
async def search_posts(query: str) -> list[dict]:
    # Convert user input to tsquery safely
    tsquery = " & ".join(query.split())
    rows = await pool.fetch("""
        SELECT id, title,
               ts_rank(search_vector, to_tsquery('english', $1)) AS rank
        FROM posts
        WHERE search_vector @@ to_tsquery('english', $1)
        ORDER BY rank DESC
        LIMIT 20
    """, tsquery)
    return [dict(r) for r in rows]
```

### JSONB — flexible schema within PostgreSQL

```sql
-- JSONB column
ALTER TABLE products ADD COLUMN attributes JSONB DEFAULT '{}';

-- Insert with JSONB
INSERT INTO products (name, attributes)
VALUES ('Laptop', '{"brand": "Dell", "ram_gb": 16, "tags": ["laptop", "portable"]}');

-- Query inside JSONB
SELECT name, attributes->>'brand' AS brand
FROM products
WHERE attributes->>'brand' = 'Dell';

-- Query nested values
SELECT name FROM products
WHERE (attributes->>'ram_gb')::int >= 16;

-- Array containment
SELECT name FROM products
WHERE attributes->'tags' ? 'laptop';

-- Update a key inside JSONB (non-destructive)
UPDATE products
SET attributes = attributes || '{"ram_gb": 32}'::jsonb
WHERE id = 1;

-- Remove a key
UPDATE products
SET attributes = attributes - 'legacy_field'
WHERE id = 1;
```

**JSONB indexes:**
```sql
-- GIN index for @> (containment) and ? (key existence)
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- btree index on a specific path (for equality/range)
CREATE INDEX idx_products_brand ON products ((attributes->>'brand'));
```

### Arrays

```sql
-- Array column
ALTER TABLE users ADD COLUMN tags TEXT[];

-- Insert with array
INSERT INTO users (email, tags) VALUES ('alice@example.com', ARRAY['admin', 'beta']);

-- Append to array
UPDATE users SET tags = array_append(tags, 'vip') WHERE id = 1;

-- Remove from array
UPDATE users SET tags = array_remove(tags, 'beta') WHERE id = 1;

-- Check if array contains value
SELECT * FROM users WHERE 'admin' = ANY(tags);

-- Overlap (any element in common)
SELECT * FROM users WHERE tags && ARRAY['admin', 'moderator'];

-- Containment (all elements present)
SELECT * FROM users WHERE tags @> ARRAY['admin', 'vip'];
```

### pg_notify — real-time with LISTEN/NOTIFY

```sql
-- Send a notification (from SQL or a trigger)
NOTIFY user_created, '{"userId": "123", "email": "alice@example.com"}';

-- Trigger-based notification
CREATE OR REPLACE FUNCTION notify_user_created()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'user_created',
    json_build_object('userId', NEW.id, 'email', NEW.email)::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION notify_user_created();
```

**Listen in Python (asyncpg):**
```python
async def listen_for_events():
    conn = await asyncpg.connect(os.environ["DATABASE_URL"])

    async def handle_notification(conn, pid, channel, payload):
        data = json.loads(payload)
        print(f"New user: {data['userId']} ({data['email']})")
        # send websocket event, trigger side effects, etc.

    await conn.add_listener('user_created', handle_notification)
    await asyncio.sleep(float('inf'))  # keep listening
```

**Listen in Node.js:**
```typescript
import { Client } from 'pg'

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

client.on('notification', (msg) => {
  if (msg.channel === 'user_created') {
    const data = JSON.parse(msg.payload ?? '{}')
    console.log('New user:', data)
    io.emit('user:created', data)  // forward to WebSocket clients
  }
})

await client.query('LISTEN user_created')
```

### PL/pgSQL functions

```sql
-- Function to safely decrement credits (atomic, no race condition)
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id  UUID,
  p_amount   INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  -- Lock the row for this operation
  SELECT credits INTO v_current
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current < p_amount THEN
    RETURN FALSE;  -- insufficient credits
  END IF;

  UPDATE users
  SET credits = credits - p_amount
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type)
  VALUES (p_user_id, p_amount, 'debit');

  RETURN TRUE;
END;
$$;

-- Call from application
SELECT spend_credits('user-uuid', 50);
```

```sql
-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to a table
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Connection pooling with PgBouncer / Supavisor

For serverless environments, always use a pooler:

```bash
# .env
# Direct connection (for migrations only)
DATABASE_URL_DIRECT="postgresql://user:pass@db.host:5432/mydb"

# Pooled connection (for application queries)
DATABASE_URL="postgresql://user:pass@db.host:6543/mydb?pgbouncer=true"
```

```python
# asyncpg with Supabase/Neon pooler — disable prepared statements
pool = await asyncpg.create_pool(
    dsn=os.environ["DATABASE_URL"],
    statement_cache_size=0,  # required for PgBouncer transaction mode
)
```

## Example

**User:** Add full-text search to a blog app (Python/asyncpg) with weighted title/content ranking, highlight excerpts, and a pg_notify trigger that pushes new post notifications to connected WebSocket clients.

**Expected output:**
- SQL migration: `search_vector` generated column, GIN index, `notify_post_published` trigger
- `search_posts(query)` async function using `to_tsquery` + `ts_headline`
- `listen_for_post_events()` coroutine using asyncpg LISTEN
- FastAPI WebSocket endpoint that receives notifications and broadcasts to clients

---
