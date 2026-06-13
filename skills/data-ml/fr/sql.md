---
name: sql
description: "SQL query writing and optimisation: complex joins, window functions, CTEs, indexes, query plans, migration patterns"
---

> 🇫🇷 Version française. [English version](../sql.md).

# Compétence SQL

## Quand activer
- Écriture de requêtes complexes (joins, agrégations, sous-requêtes, window functions)
- Optimisation d'une requête lente — lecture et amélioration des plans EXPLAIN
- Conception ou révision d'un schéma de base de données
- Écriture de migrations de base de données (PostgreSQL, MySQL, SQLite)
- Génération de rapports ou de requêtes d'analyse à partir de données brutes

## Quand NE PAS utiliser
- CRUD simple — votre ORM les gère mieux
- Conception de schéma pour NoSQL (MongoDB, DynamoDB) — paradigme différent
- Syntaxe spécifique aux entrepôts de données (Snowflake, BigQuery, Redshift) — utiliser la compétence appropriée

## Instructions

### Modèles de requêtes

**CTEs pour la lisibilité (préférer aux sous-requêtes imbriquées) :**
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

**Window functions pour les classements et les totaux cumulés :**
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

**Self-joins pour les données hiérarchiques :**
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

**Lateral join pour les N premiers par groupe :**
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

**Upsert (INSERT ... ON CONFLICT) :**
```sql
-- PostgreSQL
INSERT INTO user_stats (user_id, login_count, last_login)
VALUES ($1, 1, NOW())
ON CONFLICT (user_id) DO UPDATE SET
    login_count = user_stats.login_count + 1,
    last_login = NOW();
```

### Optimisation des requêtes

**1. Lire le plan EXPLAIN en premier :**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending' AND o.created_at > NOW() - INTERVAL '7 days';
```

**Signes d'une requête lente :**
- `Seq Scan` sur une grande table — nécessite un index
- `Hash Join` avec de grandes estimations de lignes — envisager de réduire l'ensemble de résultats plus tôt
- `Sort` sur une colonne non indexée — ajouter un index ou utiliser un index couvrant
- `rows removed by filter` élevé — l'index n'est pas assez sélectif

**2. Modèles d'index :**
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

**3. Éviter le N+1 en SQL brut :**
```sql
-- Bad: one query per user to get their orders
-- (this happens in application code)

-- Good: single query with JOIN
SELECT u.id, u.email, COUNT(o.id) AS order_count, SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
GROUP BY u.id, u.email;
```

### Règles de conception de schéma

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

**Conventions de nommage :**
- Tables : `snake_case`, pluriel (`orders`, `user_sessions`)
- Colonnes : `snake_case` (`created_at`, `user_id`)
- Index : `idx_{table}_{colonnes}` (`idx_orders_user_id_status`)
- Clés étrangères : `fk_{table}_{table_référencée}` (`fk_orders_users`)

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

**Règles pour les migrations sans interruption de service :**
1. Ne jamais supprimer une colonne que le code lit encore
2. Ajouter les colonnes comme nullable d'abord, remplir, puis ajouter la contrainte NOT NULL
3. Utiliser `CREATE INDEX CONCURRENTLY` dans PostgreSQL
4. Déployer le code qui gère l'ancien et le nouveau schéma avant de migrer

### Modèles de requêtes analytiques

**Rétention par cohorte :**
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

**Analyse d'entonnoir :**
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

## Exemple

**Demande :** "Montrez-moi les 10 meilleurs clients par chiffre d'affaires au cours des 90 derniers jours, avec leur nombre de commandes, leur valeur moyenne de commande, et s'ils ont passé une commande au cours des 7 derniers jours."

**Requête attendue :**
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
