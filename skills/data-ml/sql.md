---
name: sql
description: "SQL query writing and optimisation: complex joins, window functions, CTEs, indexes, query plans, migration patterns"
updated: 2026-06-13
---

# SQL Skill

## When to activate
- Writing complex queries (joins, aggregations, subqueries, window functions)
- Optimising a slow query — reading and improving EXPLAIN plans
- Designing or reviewing a database schema
- Writing database migrations (PostgreSQL, MySQL, SQLite)
- Generating reports or analytics queries from raw data

## When NOT to use
- Simple CRUD — your ORM handles these better
- Schema design for NoSQL (MongoDB, DynamoDB) — different paradigm
- Data warehouse–specific syntax (Snowflake, BigQuery, Redshift) — use the relevant skill

## Instructions

### Query patterns

**CTEs for readability (prefer over nested subqueries):**
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

**Window functions for rankings and running totals:**
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

**Self-joins for hierarchical data:**
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

**Lateral join for top-N per group:**
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

### Query optimisation

**1. Read the EXPLAIN PLAN first:**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending' AND o.created_at > NOW() - INTERVAL '7 days';
```

**Signs of a slow query:**
- `Seq Scan` on a large table — needs an index
- `Hash Join` with large row estimates — consider reducing the result set earlier
- `Sort` on a non-indexed column — add an index or use a covering index
- High `rows removed by filter` — the index isn't selective enough

**2. Index patterns:**
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

**3. Avoid N+1 in raw SQL:**
```sql
-- Bad: one query per user to get their orders
-- (this happens in application code)

-- Good: single query with JOIN
SELECT u.id, u.email, COUNT(o.id) AS order_count, SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
GROUP BY u.id, u.email;
```

### Schema design rules

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

**Naming conventions:**
- Tables: `snake_case`, plural (`orders`, `user_sessions`)
- Columns: `snake_case` (`created_at`, `user_id`)
- Indexes: `idx_{table}_{columns}` (`idx_orders_user_id_status`)
- Foreign keys: `fk_{table}_{referenced_table}` (`fk_orders_users`)

### Migrations

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

**Rules for zero-downtime migrations:**
1. Never drop a column that code still reads
2. Add columns as nullable first, backfill, then add NOT NULL
3. Use `CREATE INDEX CONCURRENTLY` in PostgreSQL
4. Deploy code that handles both old and new schema before migrating

### Analytics query patterns

**Cohort retention:**
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

**Funnel analysis:**
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

## Example

**Request:** "Show me the top 10 customers by revenue in the last 90 days, with their order count, average order value, and whether they've placed an order in the last 7 days."

**Expected query:**
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

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
