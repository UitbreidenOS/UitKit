---
description: Analyzes and optimizes a SQL query for performance and cost efficiency. Identifies bottlenecks, recommends indexes, and returns an optimized query with metrics.
---

# /optimize-query

## What This Does

Runs the sql-optimizer skill to comprehensively audit a SQL query. Analyzes execution plan, identifies missing indexes, flags inefficient joins, and returns before/after metrics with expected performance improvement.

## Steps Claude Follows

1. Ask for: SQL query (or model name if in dbt), target database (Snowflake/BigQuery/PostgreSQL), and known table sizes
2. Run sql-optimizer skill — parse query, identify issues, recommend optimizations
3. Generate optimized query with inline comments explaining changes
4. Estimate performance delta: execution time, rows scanned, cost (cloud DW)
5. Provide index recommendations if applicable
6. Return QA checklist for verification in dev before production deployment

## Next Action Logic

- **No issues found:** "Query is efficient; ready for deployment"
- **Minor optimizations:** "Apply suggested indexes; run performance baseline test"
- **Major optimizations:** "Significant improvement possible; test optimized query in dev before deploying to prod"
- **Requires refactoring:** "Consider materialization, incremental load, or denormalization for this use case"

## Output Format

### Optimization Report

```
# SQL Optimization Report

## Original Query
[query provided]

## Issues Found
- Issue 1 (High severity)
- Issue 2 (Medium severity)

## Optimized Query
[optimized SQL with comments]

## Performance Metrics
- Execution time: Before 45s → After 2.1s (-95%)
- Rows scanned: Before 2.3B → After 45M (-98%)
- Cost: Before $1.42 → After $0.03 (-98%)

## Index Recommendations
1. Clustered index on events.event_timestamp
2. Non-clustered index on transactions.user_id

## Next Steps
[ ] Test in dev
[ ] Compare output to original query
[ ] Deploy to prod
```

## Examples

### Example 1: Cold Email Research Query

**Query:** Show all recent hires at Series B companies in software

**Original Query (inefficient):**
```sql
SELECT DISTINCT u.user_id, u.name, u.email, c.company_name
FROM users u
JOIN companies c ON u.company_id = c.company_id
JOIN events e ON u.user_id = e.user_id
WHERE c.funding_stage = 'Series B'
  AND c.industry = 'Software'
  AND e.event_type = 'job_update'
```

**After `/optimize-query`:**
- Issue: Cartesian product risk (no date filter; all events scanned)
- Fix: Add date filter; move WHERE before JOIN
- Result: Query time 12s → 0.3s (-97%)

### Example 2: dbt Model Performance

**Model:** `marts/revenue_attribution`  
**Issue:** dbt run timeout (>30 min)

**After `/optimize-query`:**
- Issue: 180M rows scanned; missing clustered index on date column
- Fix: Add date filter; remove unnecessary JOIN
- Result: Query time timeout → 6 min; SLA now met

---
