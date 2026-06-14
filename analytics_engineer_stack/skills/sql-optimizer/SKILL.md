---
name: sql-optimizer
description: Analyzes and optimizes SQL queries for performance, readability, and cost efficiency. Identifies missing indexes, execution plan bottlenecks, and refactoring opportunities. Returns optimized query with before/after metrics.
allowed-tools: Read, Write, WebFetch
effort: medium
---

## When to activate

When working with inefficient or complex SQL queries that need performance tuning, cost optimization (especially for cloud data warehouses), or readability improvement. Run before deploying production queries or when troubleshooting slow dashboards.

## When NOT to use

Not for schema design — use data-modeling skill instead. Not for initial query drafting — this assumes a working query exists. Not for vendor-specific SQL extensions without declaring the target database (Snowflake, BigQuery, PostgreSQL, etc.).

## Optimization Checklist

1. **Parse the query** — Identify SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, window functions, CTEs
2. **Check table sizes** — Ask for row counts of large tables to assess join order impact
3. **Identify join patterns** — Flag N-way joins, cartesian products, non-equijoin conditions
4. **Scan for aggregations** — Look for repeated calculations, missing indexes on GROUP BY columns, redundant DISTINCT
5. **Review filtering** — Check predicate pushdown, early WHERE clauses before expensive operations
6. **Examine indexing** — Recommend indexes on JOIN, WHERE, and GROUP BY columns if applicable
7. **Spot inefficiencies** — Flag subqueries that could be CTEs, window functions instead of self-joins, UNION instead of UNION ALL
8. **Cost estimation** — For cloud DW (Snowflake, BigQuery): estimate scanned bytes and cost delta

## Optimization Categories

**Index opportunities** — Add clustered or non-clustered indexes on high-cardinality columns used in WHERE, JOIN, or GROUP BY clauses.

**Join reordering** — Smaller tables first; broadcast joins for star schema patterns; denormalization for frequently joined dimensions.

**Predicate pushdown** — Move WHERE clauses as early as possible; filter before grouping when safe.

**Materialization** — Replace subqueries with CTEs; pre-aggregate intermediate results; consider materialized views for repeated queries.

**Cost reduction** — Partition large tables by date; use column pruning to avoid reading unnecessary columns; incremental loading patterns.

**Readability** — Name CTEs semantically; use consistent indentation; add inline comments for complex logic.

## Query Analysis Template

```markdown
# SQL Optimization Report

**Original Query:** [query name or purpose]
**Target Database:** [Snowflake / BigQuery / PostgreSQL / other]
**Submitted:** [date]

---

## Performance Baseline

| Metric | Value |
|--------|-------|
| Execution Time | [ms] |
| Rows Scanned | [approx] |
| Estimated Cost (cloud DW) | [$X] |
| Current Index Coverage | [Y%] |

---

## Issues Found

| Issue | Severity | Impact | Fix |
|-------|----------|--------|-----|
| [Issue 1] | High/Medium/Low | [Impact description] | [Recommended fix] |
| [Issue 2] | ... | ... | ... |

---

## Optimized Query

\`\`\`sql
[optimized query here]
\`\`\`

---

## Expected Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Execution Time | [Xms] | [Yms] | -[Z]% |
| Rows Scanned | [X] | [Y] | -[Z]% |
| Estimated Cost | [$X] | [$Y] | -[Z]% |

---

## Index Recommendations

1. **Index on `table.column`** — Columns: [list]; Type: [clustered/non-clustered]; Priority: [High/Medium]
2. **Index on `table.column2`** — ...

---

## Notes

[Any caveats, trade-offs, or further optimization opportunities]
```

## Example

# SQL Optimization Report

**Original Query:** Daily active users with revenue attribution  
**Target Database:** Snowflake  
**Submitted:** June 12, 2026

---

## Performance Baseline

| Metric | Value |
|--------|-------|
| Execution Time | 45 seconds |
| Rows Scanned | 2.3B |
| Estimated Cost | $1.42 |
| Current Index Coverage | 0% |

---

## Issues Found

| Issue | Severity | Impact | Fix |
|-------|----------|--------|-----|
| Cartesian join on events + transactions (missing join key) | High | 10x row inflation; massive scan | Add missing join condition |
| No predicate pushdown on date filter | High | Scanning 18 months instead of 7 days | Move WHERE before JOIN |
| Repeated aggregation in outer query | Medium | CPU overhead; suboptimal execution plan | Consolidate to single GROUP BY |
| Missing index on `users.id` and `transactions.user_id` | Medium | Full table scan on joins | Add clustered index on join keys |

---

## Optimized Query

```sql
-- CTE 1: Filter events to date range early (predicate pushdown)
WITH recent_events AS (
  SELECT 
    user_id,
    event_id,
    event_timestamp,
    session_id
  FROM events
  WHERE DATE(event_timestamp) >= CURRENT_DATE - INTERVAL '7 days'
    AND event_type IN ('purchase', 'add_to_cart')
),

-- CTE 2: Aggregate revenue by user (consolidate aggregation)
user_revenue AS (
  SELECT 
    user_id,
    SUM(transaction_amount) AS total_revenue,
    COUNT(DISTINCT transaction_id) AS transaction_count,
    MAX(transaction_date) AS last_purchase_date
  FROM transactions
  WHERE DATE(transaction_date) >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY user_id
)

-- Final select: join optimized subqueries
SELECT 
  re.user_id,
  COUNT(DISTINCT re.session_id) AS active_sessions,
  COUNT(DISTINCT re.event_id) AS event_count,
  COALESCE(ur.total_revenue, 0) AS attributed_revenue,
  ur.last_purchase_date
FROM recent_events re
LEFT JOIN user_revenue ur ON re.user_id = ur.user_id
GROUP BY re.user_id, ur.total_revenue, ur.last_purchase_date
ORDER BY attributed_revenue DESC;
```

---

## Expected Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Execution Time | 45s | 2.1s | -95% |
| Rows Scanned | 2.3B | 45M | -98% |
| Estimated Cost | $1.42 | $0.03 | -98% |

---

## Index Recommendations

1. **Index on `events.event_timestamp`** — Composite: [user_id, event_timestamp]; Type: clustered; Priority: High
2. **Index on `transactions.user_id`** — Type: non-clustered; Priority: High
3. **Index on `users.id`** — Type: clustered; Priority: Medium (if not already primary key)

---

## Notes

- Date filtering moved to CTEs for early predicate pushdown — reduces initial scan by 96%
- Consolidated two separate aggregations into single CTE to avoid redundant table scans
- LEFT JOIN on revenue ensures users with events but no transactions are captured as $0 revenue
- Monitor index usage; consider partitioning `events` by `event_timestamp` for further cost reduction in monthly increments

---
