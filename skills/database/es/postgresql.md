---
name: postgresql
description: "PostgreSQL backend patterns: full-text search, JSONB, arrays, pg_notify, PL/pgSQL functions, connection pooling with asyncpg and node-postgres"
---

> 🇪🇸 Versión en español. [Versión en inglés](../postgresql.md).

# Skill de PostgreSQL

## Cuándo activar
- Usar funciones específicas de PostgreSQL más allá del SQL estándar (búsqueda de texto completo, JSONB, arrays, pg_notify)
- Configurar connection pooling con asyncpg (Python) o node-postgres (Node.js)
- Escribir funciones o triggers de PL/pgSQL
- Usar el pub/sub de PostgreSQL mediante `LISTEN`/`NOTIFY`
- Consultar e indexar columnas JSONB
- Construir una funcionalidad en tiempo real respaldada por PostgreSQL en lugar de Redis pub/sub

## Cuándo NO usar
- CRUD estándar con un ORM — usar el skill de Prisma o SQLAlchemy en su lugar
- Consultas SQL genéricas — usar el skill de SQL
- Cuando se usa Neon o Supabase — consultar también esos skills dedicados para patrones específicos de la plataforma

## Instrucciones

### Configuración de la conexión

**Python (asyncpg — driver PostgreSQL asíncrono más rápido):**
```python
import asyncpg
import os

# Pool de conexiones (crear una vez al inicio)
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
            "jit": "off",  # deshabilitar JIT para cargas OLTP
        },
    )

async def get_user(user_id: str) -> dict | None:
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, email, name FROM users WHERE id = $1", user_id
        )
        return dict(row) if row else None

# Transacciones
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

// Usar siempre consultas parametrizadas
async function getUser(id: string) {
  const { rows } = await pool.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [id]
  )
  return rows[0] ?? null
}

// Función auxiliar de transacción
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

### Búsqueda de texto completo

```sql
-- Agregar una columna tsvector generada (actualización automática)
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

-- Índice GIN para búsqueda de texto completo rápida
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Consulta de búsqueda con clasificación
SELECT
  id, title,
  ts_rank(search_vector, query) AS rank,
  ts_headline('english', content, query, 'MaxFragments=2') AS excerpt
FROM posts, to_tsquery('english', 'typescript & patterns') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

**Desde el código de la aplicación:**
```python
# asyncpg
async def search_posts(query: str) -> list[dict]:
    # Convertir la entrada del usuario a tsquery de forma segura
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

### JSONB — esquema flexible dentro de PostgreSQL

```sql
-- Columna JSONB
ALTER TABLE products ADD COLUMN attributes JSONB DEFAULT '{}';

-- Insertar con JSONB
INSERT INTO products (name, attributes)
VALUES ('Laptop', '{"brand": "Dell", "ram_gb": 16, "tags": ["laptop", "portable"]}');

-- Consultar dentro de JSONB
SELECT name, attributes->>'brand' AS brand
FROM products
WHERE attributes->>'brand' = 'Dell';

-- Consultar valores anidados
SELECT name FROM products
WHERE (attributes->>'ram_gb')::int >= 16;

-- Contención de array
SELECT name FROM products
WHERE attributes->'tags' ? 'laptop';

-- Actualizar una clave dentro de JSONB (no destructivo)
UPDATE products
SET attributes = attributes || '{"ram_gb": 32}'::jsonb
WHERE id = 1;

-- Eliminar una clave
UPDATE products
SET attributes = attributes - 'legacy_field'
WHERE id = 1;
```

**Índices JSONB:**
```sql
-- Índice GIN para @> (contención) y ? (existencia de clave)
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- Índice btree en una ruta específica (para igualdad/rango)
CREATE INDEX idx_products_brand ON products ((attributes->>'brand'));
```

### Arrays

```sql
-- Columna de array
ALTER TABLE users ADD COLUMN tags TEXT[];

-- Insertar con array
INSERT INTO users (email, tags) VALUES ('alice@example.com', ARRAY['admin', 'beta']);

-- Agregar al array
UPDATE users SET tags = array_append(tags, 'vip') WHERE id = 1;

-- Eliminar del array
UPDATE users SET tags = array_remove(tags, 'beta') WHERE id = 1;

-- Verificar si el array contiene un valor
SELECT * FROM users WHERE 'admin' = ANY(tags);

-- Superposición (algún elemento en común)
SELECT * FROM users WHERE tags && ARRAY['admin', 'moderator'];

-- Contención (todos los elementos presentes)
SELECT * FROM users WHERE tags @> ARRAY['admin', 'vip'];
```

### pg_notify — tiempo real con LISTEN/NOTIFY

```sql
-- Enviar una notificación (desde SQL o un trigger)
NOTIFY user_created, '{"userId": "123", "email": "alice@example.com"}';

-- Notificación basada en trigger
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

**Escuchar en Python (asyncpg):**
```python
async def listen_for_events():
    conn = await asyncpg.connect(os.environ["DATABASE_URL"])

    async def handle_notification(conn, pid, channel, payload):
        data = json.loads(payload)
        print(f"New user: {data['userId']} ({data['email']})")
        # enviar evento WebSocket, disparar efectos secundarios, etc.

    await conn.add_listener('user_created', handle_notification)
    await asyncio.sleep(float('inf'))  # seguir escuchando
```

**Escuchar en Node.js:**
```typescript
import { Client } from 'pg'

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

client.on('notification', (msg) => {
  if (msg.channel === 'user_created') {
    const data = JSON.parse(msg.payload ?? '{}')
    console.log('New user:', data)
    io.emit('user:created', data)  // reenviar a clientes WebSocket
  }
})

await client.query('LISTEN user_created')
```

### Funciones PL/pgSQL

```sql
-- Función para decrementar créditos de forma segura (atómica, sin condición de carrera)
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id  UUID,
  p_amount   INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  -- Bloquear la fila para esta operación
  SELECT credits INTO v_current
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current < p_amount THEN
    RETURN FALSE;  -- créditos insuficientes
  END IF;

  UPDATE users
  SET credits = credits - p_amount
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type)
  VALUES (p_user_id, p_amount, 'debit');

  RETURN TRUE;
END;
$$;

-- Llamar desde la aplicación
SELECT spend_credits('user-uuid', 50);
```

```sql
-- Función trigger para updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a una tabla
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Connection pooling con PgBouncer / Supavisor

Para entornos serverless, usar siempre un pooler:

```bash
# .env
# Conexión directa (solo para migraciones)
DATABASE_URL_DIRECT="postgresql://user:pass@db.host:5432/mydb"

# Conexión con pool (para consultas de la aplicación)
DATABASE_URL="postgresql://user:pass@db.host:6543/mydb?pgbouncer=true"
```

```python
# asyncpg con pooler de Supabase/Neon — deshabilitar instrucciones preparadas
pool = await asyncpg.create_pool(
    dsn=os.environ["DATABASE_URL"],
    statement_cache_size=0,  # requerido para el modo de transacción de PgBouncer
)
```

## Ejemplo

**Usuario:** Agregar búsqueda de texto completo a una aplicación de blog (Python/asyncpg) con clasificación ponderada de título/contenido, fragmentos resaltados y un trigger pg_notify que envía notificaciones de nuevas publicaciones a clientes WebSocket conectados.

**Resultado esperado:**
- Migración SQL: columna generada `search_vector`, índice GIN, trigger `notify_post_published`
- Función asíncrona `search_posts(query)` usando `to_tsquery` + `ts_headline`
- Corrutina `listen_for_post_events()` usando asyncpg LISTEN
- Endpoint WebSocket de FastAPI que recibe notificaciones y las transmite a los clientes

---
