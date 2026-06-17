---
name: slow-query-analyzer
description: Diagnose and remediate slow queries using EXPLAIN plans, pg_stat_statements, and query rewriting
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Investigating queries exceeding latency thresholds (>500ms p95)
- Analyzing pg_stat_statements or slow query logs
- Rewriting inefficient joins, subqueries, or N+1 patterns
- Identifying missing indexes causing sequential scans
- Profiling ORM-generated queries for optimization

## When NOT to use

- For index design at scale (use index-optimizer)
- For database-wide performance tuning (use query-tuner)
- For connection pooling issues

## Instructions

1. **Collect slow query log.** Enable `log_min_duration_statement` or query `pg_stat_statements` for top-N by total time.
2. **Rank by impact.** Sort queries by `total_time` (not just `mean_time`) to find the biggest cumulative offenders.
3. **Run EXPLAIN ANALYZE.** For each top query, capture the actual execution plan with buffer usage.
4. **Identify bottlenecks.** Look for sequential scans on large tables, nested loops with high row counts, hash joins spilling to disk.
5. **Propose rewrites.** Replace correlated subqueries with JOINs, add LIMIT/OFFSET pagination, eliminate SELECT *.
6. **Validate improvements.** Re-run EXPLAIN ANALYZE after changes; document before/after execution time.
7. **Report findings.** Output a table: query fingerprint, current latency, root cause, fix applied, new latency.

## Example

```sql
-- Top 10 slowest queries by total time
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- EXPLAIN ANALYZE with buffers
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ... ;
```
