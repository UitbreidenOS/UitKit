---
name: postgresql
description: "PostgreSQL backend patterns: full-text search, JSONB, arrays, pg_notify, PL/pgSQL functions, connection pooling with asyncpg and node-postgres"
---

> 🇫🇷 Version française. [English version](../postgresql.md).

# Compétence PostgreSQL

## Quand activer
- Utiliser des fonctionnalités spécifiques à PostgreSQL au-delà du SQL standard (recherche en texte intégral, JSONB, tableaux, pg_notify)
- Configurer le pooling de connexions avec asyncpg (Python) ou node-postgres (Node.js)
- Écrire des fonctions ou des déclencheurs PL/pgSQL
- Utiliser le pub/sub de PostgreSQL via `LISTEN`/`NOTIFY`
- Interroger et indexer des colonnes JSONB
- Construire une fonctionnalité en temps réel alimentée par PostgreSQL plutôt que par Redis pub/sub

## Quand NE PAS utiliser
- CRUD standard avec un ORM — utiliser la compétence Prisma ou SQLAlchemy à la place
- Requêtes SQL génériques — utiliser la compétence SQL
- Lorsque vous êtes sur Neon ou Supabase — vérifier également ces compétences dédiées pour les modèles spécifiques à la plateforme

## Instructions

### Configuration de la connexion

**Python (asyncpg — pilote PostgreSQL asynchrone le plus rapide) :**
```python
import asyncpg
import os

# Pool de connexions (créer une seule fois au démarrage)
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
            "jit": "off",  # désactiver JIT pour les charges OLTP
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

**Node.js (node-postgres) :**
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Toujours utiliser des requêtes paramétrées
async function getUser(id: string) {
  const { rows } = await pool.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [id]
  )
  return rows[0] ?? null
}

// Utilitaire de transaction
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

### Recherche en texte intégral

```sql
-- Ajouter une colonne tsvector générée (mise à jour automatique)
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

-- Index GIN pour une recherche en texte intégral rapide
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Requête de recherche avec classement
SELECT
  id, title,
  ts_rank(search_vector, query) AS rank,
  ts_headline('english', content, query, 'MaxFragments=2') AS excerpt
FROM posts, to_tsquery('english', 'typescript & patterns') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

**Depuis le code de l'application :**
```python
# asyncpg
async def search_posts(query: str) -> list[dict]:
    # Convertir la saisie utilisateur en tsquery de manière sécurisée
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

### JSONB — schéma flexible dans PostgreSQL

```sql
-- Colonne JSONB
ALTER TABLE products ADD COLUMN attributes JSONB DEFAULT '{}';

-- Insertion avec JSONB
INSERT INTO products (name, attributes)
VALUES ('Laptop', '{"brand": "Dell", "ram_gb": 16, "tags": ["laptop", "portable"]}');

-- Interroger à l'intérieur de JSONB
SELECT name, attributes->>'brand' AS brand
FROM products
WHERE attributes->>'brand' = 'Dell';

-- Interroger des valeurs imbriquées
SELECT name FROM products
WHERE (attributes->>'ram_gb')::int >= 16;

-- Containment de tableau
SELECT name FROM products
WHERE attributes->'tags' ? 'laptop';

-- Mettre à jour une clé dans JSONB (non destructif)
UPDATE products
SET attributes = attributes || '{"ram_gb": 32}'::jsonb
WHERE id = 1;

-- Supprimer une clé
UPDATE products
SET attributes = attributes - 'legacy_field'
WHERE id = 1;
```

**Index JSONB :**
```sql
-- Index GIN pour @> (containment) et ? (existence de clé)
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- Index btree sur un chemin spécifique (pour l'égalité/plage)
CREATE INDEX idx_products_brand ON products ((attributes->>'brand'));
```

### Tableaux

```sql
-- Colonne de tableau
ALTER TABLE users ADD COLUMN tags TEXT[];

-- Insertion avec un tableau
INSERT INTO users (email, tags) VALUES ('alice@example.com', ARRAY['admin', 'beta']);

-- Ajouter au tableau
UPDATE users SET tags = array_append(tags, 'vip') WHERE id = 1;

-- Supprimer du tableau
UPDATE users SET tags = array_remove(tags, 'beta') WHERE id = 1;

-- Vérifier si le tableau contient une valeur
SELECT * FROM users WHERE 'admin' = ANY(tags);

-- Chevauchement (un élément en commun)
SELECT * FROM users WHERE tags && ARRAY['admin', 'moderator'];

-- Containment (tous les éléments présents)
SELECT * FROM users WHERE tags @> ARRAY['admin', 'vip'];
```

### pg_notify — temps réel avec LISTEN/NOTIFY

```sql
-- Envoyer une notification (depuis SQL ou un déclencheur)
NOTIFY user_created, '{"userId": "123", "email": "alice@example.com"}';

-- Notification basée sur un déclencheur
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

**Écoute en Python (asyncpg) :**
```python
async def listen_for_events():
    conn = await asyncpg.connect(os.environ["DATABASE_URL"])

    async def handle_notification(conn, pid, channel, payload):
        data = json.loads(payload)
        print(f"New user: {data['userId']} ({data['email']})")
        # envoyer un événement WebSocket, déclencher des effets secondaires, etc.

    await conn.add_listener('user_created', handle_notification)
    await asyncio.sleep(float('inf'))  # continuer à écouter
```

**Écoute en Node.js :**
```typescript
import { Client } from 'pg'

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

client.on('notification', (msg) => {
  if (msg.channel === 'user_created') {
    const data = JSON.parse(msg.payload ?? '{}')
    console.log('New user:', data)
    io.emit('user:created', data)  // transmettre aux clients WebSocket
  }
})

await client.query('LISTEN user_created')
```

### Fonctions PL/pgSQL

```sql
-- Fonction pour décrémenter les crédits de manière sécurisée (atomique, sans condition de course)
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id  UUID,
  p_amount   INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  -- Verrouiller la ligne pour cette opération
  SELECT credits INTO v_current
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current < p_amount THEN
    RETURN FALSE;  -- crédits insuffisants
  END IF;

  UPDATE users
  SET credits = credits - p_amount
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type)
  VALUES (p_user_id, p_amount, 'debit');

  RETURN TRUE;
END;
$$;

-- Appel depuis l'application
SELECT spend_credits('user-uuid', 50);
```

```sql
-- Fonction déclencheur pour updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer à une table
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Pooling de connexions avec PgBouncer / Supavisor

Pour les environnements serverless, utiliser toujours un pooler :

```bash
# .env
# Connexion directe (uniquement pour les migrations)
DATABASE_URL_DIRECT="postgresql://user:pass@db.host:5432/mydb"

# Connexion avec pool (pour les requêtes de l'application)
DATABASE_URL="postgresql://user:pass@db.host:6543/mydb?pgbouncer=true"
```

```python
# asyncpg avec le pooler Supabase/Neon — désactiver les instructions préparées
pool = await asyncpg.create_pool(
    dsn=os.environ["DATABASE_URL"],
    statement_cache_size=0,  # requis pour le mode transaction de PgBouncer
)
```

## Exemple

**Utilisateur :** Ajouter la recherche en texte intégral à une application de blog (Python/asyncpg) avec classement pondéré titre/contenu, extraits en surbrillance, et un déclencheur pg_notify qui envoie les notifications de nouveaux articles aux clients WebSocket connectés.

**Résultat attendu :**
- Migration SQL : colonne générée `search_vector`, index GIN, déclencheur `notify_post_published`
- Fonction asynchrone `search_posts(query)` utilisant `to_tsquery` + `ts_headline`
- Coroutine `listen_for_post_events()` utilisant asyncpg LISTEN
- Endpoint WebSocket FastAPI qui reçoit les notifications et les diffuse aux clients

---
