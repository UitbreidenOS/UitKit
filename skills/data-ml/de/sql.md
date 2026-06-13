---
name: sql
description: "SQL query writing and optimisation: complex joins, window functions, CTEs, indexes, query plans, migration patterns"
---

> 🇩🇪 Deutsche Version. [Englische Version](../sql.md).

# SQL-Kompetenz

## Wann aktivieren
- Schreiben komplexer Abfragen (Joins, Aggregationen, Unterabfragen, Window Functions)
- Optimierung einer langsamen Abfrage — EXPLAIN-Pläne lesen und verbessern
- Entwerfen oder Überprüfen eines Datenbankschemas
- Schreiben von Datenbank-Migrationen (PostgreSQL, MySQL, SQLite)
- Erstellen von Reports oder Analyseabfragen aus Rohdaten

## Wann NICHT verwenden
- Einfaches CRUD — das ORM erledigt das besser
- Schema-Design für NoSQL (MongoDB, DynamoDB) — anderes Paradigma
- Data-Warehouse-spezifische Syntax (Snowflake, BigQuery, Redshift) — die entsprechende Kompetenz verwenden

## Anweisungen

### Abfragemuster

**CTEs für Lesbarkeit (gegenüber verschachtelten Unterabfragen bevorzugen):**
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

**Window Functions für Rankings und laufende Summen:**
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

**Self-Joins für hierarchische Daten:**
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

**Lateral Join für Top-N pro Gruppe:**
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

### Abfrageoptimierung

**1. Zuerst den EXPLAIN PLAN lesen:**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending' AND o.created_at > NOW() - INTERVAL '7 days';
```

**Anzeichen einer langsamen Abfrage:**
- `Seq Scan` auf einer großen Tabelle — benötigt einen Index
- `Hash Join` mit großen Zeilenschätzungen — Ergebnismenge früher reduzieren
- `Sort` auf einer nicht indizierten Spalte — Index hinzufügen oder Covering Index verwenden
- Hohe `rows removed by filter` — der Index ist nicht selektiv genug

**2. Index-Muster:**
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

**3. N+1 in rohem SQL vermeiden:**
```sql
-- Bad: one query per user to get their orders
-- (this happens in application code)

-- Good: single query with JOIN
SELECT u.id, u.email, COUNT(o.id) AS order_count, SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
GROUP BY u.id, u.email;
```

### Schema-Design-Regeln

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

**Namenskonventionen:**
- Tabellen: `snake_case`, Plural (`orders`, `user_sessions`)
- Spalten: `snake_case` (`created_at`, `user_id`)
- Indexes: `idx_{tabelle}_{spalten}` (`idx_orders_user_id_status`)
- Fremdschlüssel: `fk_{tabelle}_{referenzierte_tabelle}` (`fk_orders_users`)

### Migrationen

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

**Regeln für Zero-Downtime-Migrationen:**
1. Niemals eine Spalte löschen, die Code noch liest
2. Spalten zuerst als nullable hinzufügen, befüllen, dann NOT NULL-Constraint hinzufügen
3. `CREATE INDEX CONCURRENTLY` in PostgreSQL verwenden
4. Code deployen, der sowohl altes als auch neues Schema verarbeitet, bevor migriert wird

### Analytische Abfragemuster

**Kohorten-Retention:**
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

**Trichteranalyse:**
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

## Beispiel

**Anfrage:** "Zeig mir die Top 10 Kunden nach Umsatz in den letzten 90 Tagen, mit ihrer Bestellanzahl, ihrem durchschnittlichen Bestellwert und ob sie in den letzten 7 Tagen eine Bestellung aufgegeben haben."

**Erwartete Abfrage:**
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
