---
name: postgresql
description: "PostgreSQL backend patterns: full-text search, JSONB, arrays, pg_notify, PL/pgSQL functions, connection pooling with asyncpg and node-postgres"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../postgresql.md).

# PostgreSQL Skill

## Wanneer activeren
- PostgreSQL-specifieke functies gebruiken buiten standaard SQL (volledige-tekstzoekopdracht, JSONB, arrays, pg_notify)
- Connection pooling instellen met asyncpg (Python) of node-postgres (Node.js)
- PL/pgSQL-functies of triggers schrijven
- PostgreSQL's pub/sub gebruiken via `LISTEN`/`NOTIFY`
- JSONB-kolommen opvragen en indexeren
- Een realtime-functie bouwen op basis van PostgreSQL in plaats van Redis pub/sub

## Wanneer NIET gebruiken
- Standaard CRUD met een ORM — gebruik in plaats daarvan de Prisma- of SQLAlchemy-skill
- Generieke SQL-queries — gebruik de SQL-skill
- Wanneer u Neon of Supabase gebruikt — controleer ook die specifieke skills voor platformspecifieke patronen

## Instructies

### Verbindingsinstelling

**Python (asyncpg — snelste asynchrone PostgreSQL-driver):**
```python
import asyncpg
import os

# Connection pool (eenmaal aanmaken bij opstarten)
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
            "jit": "off",  # JIT uitschakelen voor OLTP-workloads
        },
    )

async def get_user(user_id: str) -> dict | None:
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, email, name FROM users WHERE id = $1", user_id
        )
        return dict(row) if row else None

# Transacties
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

// Altijd geparametriseerde queries gebruiken
async function getUser(id: string) {
  const { rows } = await pool.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [id]
  )
  return rows[0] ?? null
}

// Transactiehulpfunctie
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

### Volledige-tekstzoekopdracht

```sql
-- Een gegenereerde tsvector-kolom toevoegen (automatisch bijgewerkt)
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

-- GIN-index voor snelle volledige-tekstzoekopdracht
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Zoekopdracht met rangschikking
SELECT
  id, title,
  ts_rank(search_vector, query) AS rank,
  ts_headline('english', content, query, 'MaxFragments=2') AS excerpt
FROM posts, to_tsquery('english', 'typescript & patterns') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

**Vanuit applicatiecode:**
```python
# asyncpg
async def search_posts(query: str) -> list[dict]:
    # Gebruikersinvoer veilig omzetten naar tsquery
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

### JSONB — flexibel schema binnen PostgreSQL

```sql
-- JSONB-kolom
ALTER TABLE products ADD COLUMN attributes JSONB DEFAULT '{}';

-- Invoegen met JSONB
INSERT INTO products (name, attributes)
VALUES ('Laptop', '{"brand": "Dell", "ram_gb": 16, "tags": ["laptop", "portable"]}');

-- Opvragen binnen JSONB
SELECT name, attributes->>'brand' AS brand
FROM products
WHERE attributes->>'brand' = 'Dell';

-- Geneste waarden opvragen
SELECT name FROM products
WHERE (attributes->>'ram_gb')::int >= 16;

-- Array-insluiting
SELECT name FROM products
WHERE attributes->'tags' ? 'laptop';

-- Een sleutel binnen JSONB bijwerken (niet-destructief)
UPDATE products
SET attributes = attributes || '{"ram_gb": 32}'::jsonb
WHERE id = 1;

-- Een sleutel verwijderen
UPDATE products
SET attributes = attributes - 'legacy_field'
WHERE id = 1;
```

**JSONB-indexen:**
```sql
-- GIN-index voor @> (insluiting) en ? (sleutelbestaan)
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- btree-index op een specifiek pad (voor gelijkheid/bereik)
CREATE INDEX idx_products_brand ON products ((attributes->>'brand'));
```

### Arrays

```sql
-- Array-kolom
ALTER TABLE users ADD COLUMN tags TEXT[];

-- Invoegen met array
INSERT INTO users (email, tags) VALUES ('alice@example.com', ARRAY['admin', 'beta']);

-- Toevoegen aan array
UPDATE users SET tags = array_append(tags, 'vip') WHERE id = 1;

-- Verwijderen uit array
UPDATE users SET tags = array_remove(tags, 'beta') WHERE id = 1;

-- Controleren of array een waarde bevat
SELECT * FROM users WHERE 'admin' = ANY(tags);

-- Overlapping (een gemeenschappelijk element)
SELECT * FROM users WHERE tags && ARRAY['admin', 'moderator'];

-- Insluiting (alle elementen aanwezig)
SELECT * FROM users WHERE tags @> ARRAY['admin', 'vip'];
```

### pg_notify — realtime met LISTEN/NOTIFY

```sql
-- Een melding sturen (vanuit SQL of een trigger)
NOTIFY user_created, '{"userId": "123", "email": "alice@example.com"}';

-- Op triggers gebaseerde melding
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

**Luisteren in Python (asyncpg):**
```python
async def listen_for_events():
    conn = await asyncpg.connect(os.environ["DATABASE_URL"])

    async def handle_notification(conn, pid, channel, payload):
        data = json.loads(payload)
        print(f"New user: {data['userId']} ({data['email']})")
        # WebSocket-gebeurtenis sturen, neveneffecten triggeren, enz.

    await conn.add_listener('user_created', handle_notification)
    await asyncio.sleep(float('inf'))  # blijven luisteren
```

**Luisteren in Node.js:**
```typescript
import { Client } from 'pg'

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

client.on('notification', (msg) => {
  if (msg.channel === 'user_created') {
    const data = JSON.parse(msg.payload ?? '{}')
    console.log('New user:', data)
    io.emit('user:created', data)  // doorsturen naar WebSocket-clients
  }
})

await client.query('LISTEN user_created')
```

### PL/pgSQL-functies

```sql
-- Functie om credits veilig te verlagen (atomair, zonder race condition)
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id  UUID,
  p_amount   INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  -- De rij vergrendelen voor deze bewerking
  SELECT credits INTO v_current
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current < p_amount THEN
    RETURN FALSE;  -- onvoldoende credits
  END IF;

  UPDATE users
  SET credits = credits - p_amount
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type)
  VALUES (p_user_id, p_amount, 'debit');

  RETURN TRUE;
END;
$$;

-- Aanroepen vanuit de applicatie
SELECT spend_credits('user-uuid', 50);
```

```sql
-- Triggerfunctie voor updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Toepassen op een tabel
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Connection pooling met PgBouncer / Supavisor

Voor serverless-omgevingen altijd een pooler gebruiken:

```bash
# .env
# Directe verbinding (alleen voor migraties)
DATABASE_URL_DIRECT="postgresql://user:pass@db.host:5432/mydb"

# Gepoold verbinding (voor applicatiequery's)
DATABASE_URL="postgresql://user:pass@db.host:6543/mydb?pgbouncer=true"
```

```python
# asyncpg met Supabase/Neon-pooler — voorbereide statements uitschakelen
pool = await asyncpg.create_pool(
    dsn=os.environ["DATABASE_URL"],
    statement_cache_size=0,  # vereist voor PgBouncer-transactiemodus
)
```

## Voorbeeld

**Gebruiker:** Voeg volledige-tekstzoekopdracht toe aan een blogapp (Python/asyncpg) met gewogen rangschikking van titel/inhoud, gemarkeerde fragmenten en een pg_notify-trigger die meldingen van nieuwe berichten doorstuurt naar verbonden WebSocket-clients.

**Verwachte uitvoer:**
- SQL-migratie: gegenereerde `search_vector`-kolom, GIN-index, `notify_post_published`-trigger
- Asynchrone functie `search_posts(query)` met `to_tsquery` + `ts_headline`
- Coroutine `listen_for_post_events()` met asyncpg LISTEN
- FastAPI WebSocket-eindpunt dat meldingen ontvangt en uitzendt naar clients

---
