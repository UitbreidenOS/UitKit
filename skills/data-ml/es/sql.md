---
name: sql
description: "SQL query writing and optimisation: complex joins, window functions, CTEs, indexes, query plans, migration patterns"
---

> 🇪🇸 Versión en español. [Versión en inglés](../sql.md).

# Habilidad SQL

## Cuándo activar
- Escritura de consultas complejas (joins, agregaciones, subconsultas, window functions)
- Optimización de una consulta lenta — lectura y mejora de planes EXPLAIN
- Diseño o revisión de un esquema de base de datos
- Escritura de migraciones de base de datos (PostgreSQL, MySQL, SQLite)
- Generación de informes o consultas de análisis a partir de datos sin procesar

## Cuándo NO usar
- CRUD simple — su ORM los maneja mejor
- Diseño de esquema para NoSQL (MongoDB, DynamoDB) — paradigma diferente
- Sintaxis específica de almacén de datos (Snowflake, BigQuery, Redshift) — use la habilidad relevante

## Instrucciones

### Patrones de consulta

**CTEs para legibilidad (preferir sobre subconsultas anidadas):**
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

**Window functions para clasificaciones y totales acumulados:**
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

**Self-joins para datos jerárquicos:**
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

**Lateral join para los N primeros por grupo:**
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

### Optimización de consultas

**1. Leer el EXPLAIN PLAN primero:**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending' AND o.created_at > NOW() - INTERVAL '7 days';
```

**Señales de una consulta lenta:**
- `Seq Scan` en una tabla grande — necesita un index
- `Hash Join` con grandes estimaciones de filas — considerar reducir el conjunto de resultados antes
- `Sort` en una columna no indexada — agregar un index o usar un covering index
- Alto `rows removed by filter` — el index no es suficientemente selectivo

**2. Patrones de index:**
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

**3. Evitar N+1 en SQL puro:**
```sql
-- Bad: one query per user to get their orders
-- (this happens in application code)

-- Good: single query with JOIN
SELECT u.id, u.email, COUNT(o.id) AS order_count, SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
GROUP BY u.id, u.email;
```

### Reglas de diseño de esquema

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

**Convenciones de nomenclatura:**
- Tablas: `snake_case`, plural (`orders`, `user_sessions`)
- Columnas: `snake_case` (`created_at`, `user_id`)
- Indexes: `idx_{tabla}_{columnas}` (`idx_orders_user_id_status`)
- Claves foráneas: `fk_{tabla}_{tabla_referenciada}` (`fk_orders_users`)

### Migraciones

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

**Reglas para migraciones sin tiempo de inactividad:**
1. Nunca eliminar una columna que el código todavía lee
2. Agregar columnas como nullable primero, rellenar, luego agregar la restricción NOT NULL
3. Usar `CREATE INDEX CONCURRENTLY` en PostgreSQL
4. Desplegar código que maneje tanto el esquema antiguo como el nuevo antes de migrar

### Patrones de consulta analítica

**Retención de cohortes:**
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

**Análisis de embudo:**
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

## Ejemplo

**Solicitud:** "Muéstrame los 10 principales clientes por ingresos en los últimos 90 días, con su número de pedidos, valor promedio de pedido, y si han realizado un pedido en los últimos 7 días."

**Consulta esperada:**
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
