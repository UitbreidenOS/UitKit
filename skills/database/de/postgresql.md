---
name: postgresql
description: "PostgreSQL backend patterns: full-text search, JSONB, arrays, pg_notify, PL/pgSQL functions, connection pooling with asyncpg and node-postgres"
---

> 🇩🇪 Deutsche Version. [Englische Version](../postgresql.md).

# PostgreSQL Skill

## Wann aktivieren
- Verwenden von PostgreSQL-spezifischen Funktionen jenseits von Standard-SQL (Volltextsuche, JSONB, Arrays, pg_notify)
- Einrichten von Connection Pooling mit asyncpg (Python) oder node-postgres (Node.js)
- Schreiben von PL/pgSQL-Funktionen oder Triggern
- Verwenden von PostgreSQL's Pub/Sub über `LISTEN`/`NOTIFY`
- Abfragen und Indizieren von JSONB-Spalten
- Aufbau eines Echtzeit-Features auf Basis von PostgreSQL statt Redis Pub/Sub

## Wann NICHT verwenden
- Standard-CRUD mit einem ORM — stattdessen den Prisma- oder SQLAlchemy-Skill verwenden
- Generische SQL-Abfragen — den SQL-Skill verwenden
- Wenn Sie Neon oder Supabase nutzen — auch die dedizierten Skills für plattformspezifische Muster prüfen

## Anweisungen

### Verbindungseinrichtung

**Python (asyncpg — schnellster asynchroner PostgreSQL-Treiber):**
```python
import asyncpg
import os

# Connection Pool (einmal beim Start erstellen)
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
            "jit": "off",  # JIT für OLTP-Workloads deaktivieren
        },
    )

async def get_user(user_id: str) -> dict | None:
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, email, name FROM users WHERE id = $1", user_id
        )
        return dict(row) if row else None

# Transaktionen
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

// Immer parametrisierte Abfragen verwenden
async function getUser(id: string) {
  const { rows } = await pool.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [id]
  )
  return rows[0] ?? null
}

// Transaktions-Hilfsfunktion
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

### Volltextsuche

```sql
-- Eine generierte tsvector-Spalte hinzufügen (automatisch aktualisiert)
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

-- GIN-Index für schnelle Volltextsuche
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Suchabfrage mit Ranking
SELECT
  id, title,
  ts_rank(search_vector, query) AS rank,
  ts_headline('english', content, query, 'MaxFragments=2') AS excerpt
FROM posts, to_tsquery('english', 'typescript & patterns') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

**Aus dem Anwendungscode:**
```python
# asyncpg
async def search_posts(query: str) -> list[dict]:
    # Benutzereingabe sicher in tsquery umwandeln
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

### JSONB — flexibles Schema innerhalb von PostgreSQL

```sql
-- JSONB-Spalte
ALTER TABLE products ADD COLUMN attributes JSONB DEFAULT '{}';

-- Einfügen mit JSONB
INSERT INTO products (name, attributes)
VALUES ('Laptop', '{"brand": "Dell", "ram_gb": 16, "tags": ["laptop", "portable"]}');

-- Innerhalb von JSONB abfragen
SELECT name, attributes->>'brand' AS brand
FROM products
WHERE attributes->>'brand' = 'Dell';

-- Verschachtelte Werte abfragen
SELECT name FROM products
WHERE (attributes->>'ram_gb')::int >= 16;

-- Array-Enthaltensein
SELECT name FROM products
WHERE attributes->'tags' ? 'laptop';

-- Einen Schlüssel innerhalb von JSONB aktualisieren (nicht destruktiv)
UPDATE products
SET attributes = attributes || '{"ram_gb": 32}'::jsonb
WHERE id = 1;

-- Einen Schlüssel entfernen
UPDATE products
SET attributes = attributes - 'legacy_field'
WHERE id = 1;
```

**JSONB-Indizes:**
```sql
-- GIN-Index für @> (Enthaltensein) und ? (Schlüsselexistenz)
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- btree-Index auf einem spezifischen Pfad (für Gleichheit/Bereich)
CREATE INDEX idx_products_brand ON products ((attributes->>'brand'));
```

### Arrays

```sql
-- Array-Spalte
ALTER TABLE users ADD COLUMN tags TEXT[];

-- Einfügen mit Array
INSERT INTO users (email, tags) VALUES ('alice@example.com', ARRAY['admin', 'beta']);

-- An Array anhängen
UPDATE users SET tags = array_append(tags, 'vip') WHERE id = 1;

-- Aus Array entfernen
UPDATE users SET tags = array_remove(tags, 'beta') WHERE id = 1;

-- Prüfen ob Array einen Wert enthält
SELECT * FROM users WHERE 'admin' = ANY(tags);

-- Überschneidung (ein gemeinsames Element)
SELECT * FROM users WHERE tags && ARRAY['admin', 'moderator'];

-- Enthaltensein (alle Elemente vorhanden)
SELECT * FROM users WHERE tags @> ARRAY['admin', 'vip'];
```

### pg_notify — Echtzeit mit LISTEN/NOTIFY

```sql
-- Eine Benachrichtigung senden (aus SQL oder einem Trigger)
NOTIFY user_created, '{"userId": "123", "email": "alice@example.com"}';

-- Trigger-basierte Benachrichtigung
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

**Lauschen in Python (asyncpg):**
```python
async def listen_for_events():
    conn = await asyncpg.connect(os.environ["DATABASE_URL"])

    async def handle_notification(conn, pid, channel, payload):
        data = json.loads(payload)
        print(f"New user: {data['userId']} ({data['email']})")
        # WebSocket-Ereignis senden, Nebeneffekte auslösen, usw.

    await conn.add_listener('user_created', handle_notification)
    await asyncio.sleep(float('inf'))  # weiter lauschen
```

**Lauschen in Node.js:**
```typescript
import { Client } from 'pg'

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

client.on('notification', (msg) => {
  if (msg.channel === 'user_created') {
    const data = JSON.parse(msg.payload ?? '{}')
    console.log('New user:', data)
    io.emit('user:created', data)  // an WebSocket-Clients weiterleiten
  }
})

await client.query('LISTEN user_created')
```

### PL/pgSQL-Funktionen

```sql
-- Funktion zur sicheren Dekrementierung von Credits (atomar, ohne Race Condition)
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id  UUID,
  p_amount   INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  -- Die Zeile für diese Operation sperren
  SELECT credits INTO v_current
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current < p_amount THEN
    RETURN FALSE;  -- unzureichende Credits
  END IF;

  UPDATE users
  SET credits = credits - p_amount
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type)
  VALUES (p_user_id, p_amount, 'debit');

  RETURN TRUE;
END;
$$;

-- Aus der Anwendung aufrufen
SELECT spend_credits('user-uuid', 50);
```

```sql
-- Trigger-Funktion für updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auf eine Tabelle anwenden
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Connection Pooling mit PgBouncer / Supavisor

Für Serverless-Umgebungen immer einen Pooler verwenden:

```bash
# .env
# Direkte Verbindung (nur für Migrationen)
DATABASE_URL_DIRECT="postgresql://user:pass@db.host:5432/mydb"

# Gepoolte Verbindung (für Anwendungsabfragen)
DATABASE_URL="postgresql://user:pass@db.host:6543/mydb?pgbouncer=true"
```

```python
# asyncpg mit Supabase/Neon-Pooler — Prepared Statements deaktivieren
pool = await asyncpg.create_pool(
    dsn=os.environ["DATABASE_URL"],
    statement_cache_size=0,  # erforderlich für den PgBouncer-Transaktionsmodus
)
```

## Beispiel

**Benutzer:** Volltextsuche zu einer Blog-App (Python/asyncpg) hinzufügen mit gewichtetem Titel-/Inhalts-Ranking, markierten Auszügen und einem pg_notify-Trigger, der Benachrichtigungen über neue Beiträge an verbundene WebSocket-Clients überträgt.

**Erwartete Ausgabe:**
- SQL-Migration: generierte `search_vector`-Spalte, GIN-Index, `notify_post_published`-Trigger
- Asynchrone `search_posts(query)`-Funktion mit `to_tsquery` + `ts_headline`
- `listen_for_post_events()`-Coroutine mit asyncpg LISTEN
- FastAPI-WebSocket-Endpunkt, der Benachrichtigungen empfängt und an Clients überträgt

---
