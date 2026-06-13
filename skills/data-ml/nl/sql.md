---
name: sql
description: "SQL query writing and optimisation: complex joins, window functions, CTEs, indexes, query plans, migration patterns"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../sql.md).

# SQL Vaardigheid

## Wanneer activeren
- Schrijven van complexe queries (joins, aggregaties, subqueries, window functions)
- Optimaliseren van een trage query — EXPLAIN-plannen lezen en verbeteren
- Ontwerpen of beoordelen van een databaseschema
- Schrijven van databasemigraties (PostgreSQL, MySQL, SQLite)
- Genereren van rapporten of analysequeries uit ruwe data

## Wanneer NIET gebruiken
- Eenvoudige CRUD — uw ORM verwerkt dit beter
- Schema-ontwerp voor NoSQL (MongoDB, DynamoDB) — ander paradigma
- Data warehouse-specifieke syntaxis (Snowflake, BigQuery, Redshift) — gebruik de relevante vaardigheid

## Instructies

### Querypatronen

**CTEs voor leesbaarheid (prefereer boven geneste subqueries):**
```sql
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        SUM(amount) AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY 1
),
revenue_growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
        ROUND(
            (revenue - LAG(revenue) OVER (ORDER BY month))
            / NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100,
            2
        ) AS growth_pct
    FROM monthly_revenue
)
SELECT * FROM revenue_growth ORDER BY month DESC;
```

**Window functions voor rangschikkingen en lopende totalen:**
```sql
SELECT
    user_id,
    order_id,
    amount,
    -- Running total per user
    SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total,
    -- Rank within user (dense = no gaps in rank numbers)
    DENSE_RANK() OVER (PARTITION BY user_id ORDER BY amount DESC) AS order_rank,
    -- Percentile within all orders
    PERCENT_RANK() OVER (ORDER BY amount) AS percentile
FROM orders;
```

**Self-joins voor hiërarchische data:**
```sql
-- Manager → employee hierarchy
SELECT
    e.name AS employee,
    m.name AS manager,
    e.department
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY m.name, e.name;
```

**Lateral join voor top-N per groep:**
```sql
-- Top 3 orders per customer
SELECT c.name, o.amount, o.created_at
FROM customers c
CROSS JOIN LATERAL (
    SELECT amount, created_at
    FROM orders
    WHERE user_id = c.id
    ORDER BY amount DESC
    LIMIT 3
) o;
```

**Upsert (INSERT ... ON CONFLICT):**
```sql
-- PostgreSQL
INSERT INTO user_stats (user_id, login_count, last_login)
VALUES ($1, 1, NOW())
ON CONFLICT (user_id) DO UPDATE SET
    login_count = user_stats.login_count + 1,
    last_login = NOW();
```

### Query-optimalisatie

**1. Lees eerst het EXPLAIN PLAN:**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending' AND o.created_at > NOW() - INTERVAL '7 days';
```

**Tekenen van een trage query:**
- `Seq Scan` op een grote tabel — heeft een index nodig
- `Hash Join` met grote rijschattingen — overweeg de resultatenset eerder te verkleinen
- `Sort` op een niet-geïndexeerde kolom — voeg een index toe of gebruik een covering index
- Hoge `rows removed by filter` — de index is niet selectief genoeg

**2. Indexpatronen:**
```sql
-- Compound index for common filter + sort pattern
CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);

-- Partial index for a frequent subset
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- Covering index (includes all selected columns, avoids table lookup)
CREATE INDEX idx_orders_covering ON orders (user_id, status) INCLUDE (amount, created_at);

-- Expression index for computed values
CREATE INDEX idx_users_email_lower ON users (LOWER(email));
```

**3. N+1 vermijden in ruwe SQL:**
```sql
-- Bad: one query per user to get their orders
-- (this happens in application code)

-- Good: single query with JOIN
SELECT u.id, u.email, COUNT(o.id) AS order_count, SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
GROUP BY u.id, u.email;
```

### Schema-ontwerpregels

```sql
-- Always:
CREATE TABLE orders (
    id          BIGSERIAL PRIMARY KEY,           -- surrogate key
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'completed', 'cancelled')),
    amount      NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for foreign keys and common filter columns
CREATE INDEX ON orders (user_id);
CREATE INDEX ON orders (status) WHERE status != 'completed';  -- partial
CREATE INDEX ON orders (created_at DESC);
```

**Naamgevingsconventies:**
- Tabellen: `snake_case`, meervoud (`orders`, `user_sessions`)
- Kolommen: `snake_case` (`created_at`, `user_id`)
- Indexes: `idx_{tabel}_{kolommen}` (`idx_orders_user_id_status`)
- Vreemde sleutels: `fk_{tabel}_{gerefereerde_tabel}` (`fk_orders_users`)

### Migraties

```sql
-- Always wrap in a transaction
BEGIN;

-- Add nullable column first, then backfill, then add NOT NULL constraint
ALTER TABLE orders ADD COLUMN shipping_address TEXT;

UPDATE orders SET shipping_address = 'Unknown' WHERE shipping_address IS NULL;

ALTER TABLE orders ALTER COLUMN shipping_address SET NOT NULL;

-- Add index CONCURRENTLY to avoid locking (PostgreSQL)
CREATE INDEX CONCURRENTLY idx_orders_shipping ON orders (shipping_address);

COMMIT;
```

**Regels voor zero-downtime migraties:**
1. Verwijder nooit een kolom die code nog leest
2. Voeg kolommen eerst toe als nullable, vul ze in, voeg dan de NOT NULL-constraint toe
3. Gebruik `CREATE INDEX CONCURRENTLY` in PostgreSQL
4. Deploy code die zowel het oude als het nieuwe schema verwerkt vóór de migratie

### Analytische querypatronen

**Cohort-retentie:**
```sql
WITH cohorts AS (
    SELECT user_id, DATE_TRUNC('month', MIN(created_at)) AS cohort_month
    FROM orders GROUP BY user_id
),
activity AS (
    SELECT DISTINCT o.user_id,
        DATE_TRUNC('month', o.created_at) AS active_month
    FROM orders o
)
SELECT
    c.cohort_month,
    a.active_month,
    DATE_DIFF('month', c.cohort_month, a.active_month) AS month_number,
    COUNT(DISTINCT a.user_id) AS users
FROM cohorts c JOIN activity a USING (user_id)
GROUP BY 1, 2, 3 ORDER BY 1, 3;
```

**Trechteranalyse:**
```sql
WITH funnel AS (
    SELECT user_id,
        MAX(CASE WHEN event = 'signup'   THEN 1 END) AS did_signup,
        MAX(CASE WHEN event = 'onboard'  THEN 1 END) AS did_onboard,
        MAX(CASE WHEN event = 'purchase' THEN 1 END) AS did_purchase
    FROM events GROUP BY user_id
)
SELECT
    COUNT(*) FILTER (WHERE did_signup  = 1) AS signups,
    COUNT(*) FILTER (WHERE did_onboard = 1) AS onboarded,
    COUNT(*) FILTER (WHERE did_purchase= 1) AS purchased
FROM funnel;
```

## Voorbeeld

**Verzoek:** "Toon me de top 10 klanten op omzet in de afgelopen 90 dagen, met hun aantal bestellingen, gemiddelde bestelwaarde, en of ze in de afgelopen 7 dagen een bestelling hebben geplaatst."

**Verwachte query:**
```sql
SELECT
    u.id,
    u.email,
    COUNT(o.id)                         AS order_count,
    SUM(o.amount)                       AS total_revenue,
    ROUND(AVG(o.amount), 2)             AS avg_order_value,
    MAX(o.created_at)                   AS last_order_at,
    MAX(o.created_at) > NOW() - INTERVAL '7 days' AS active_recently
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.status = 'completed'
  AND o.created_at > NOW() - INTERVAL '90 days'
GROUP BY u.id, u.email
ORDER BY total_revenue DESC
LIMIT 10;
```

---
