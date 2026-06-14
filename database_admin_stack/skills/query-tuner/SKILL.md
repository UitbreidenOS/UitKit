---
name: query-tuner
description: Diagnoses slow database queries using EXPLAIN ANALYZE, identifies bottlenecks (seq scans, nested loops, hash joins), and rewrites queries for optimal execution plans.
allowed-tools: Read, Write, Bash
effort: medium
---

# Query Tuner

## When to activate
When a query exceeds its SLA latency, when `pg_stat_statements` shows a query dominating total execution time, or when application p95 latency correlates with database response time spikes.

## When NOT to use
Skip if the query is already using an index-only scan under 5ms. Skip for one-off analytical queries on read replicas.

## Instructions

1. Get the slow query and run `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` to see the actual execution plan.
2. Identify bottlenecks: sequential scans, nested loop joins on large sets, sort operations spilling to disk, high buffer shared hit ratio.
3. Check if statistics are current: `SELECT last_analyze FROM pg_stat_user_tables`.
4. Apply fixes in priority order:
   - Add/adjust indexes for sequential scans
   - Rewrite subqueries as JOINs where appropriate
   - Add LIMIT/OFFSET pagination for unbounded result sets
   - Use CTEs or materialized views for repeated complex aggregations
   - Partition large tables if scans touch >10M rows
5. Re-run EXPLAIN to confirm improvement. Target >10x speedup.

## Example

```
BEFORE:  SELECT o.*, c.name FROM orders o, customers c
         WHERE o.customer_id = c.id AND o.status = 'pending'
         ORDER BY o.created_at DESC;
EXPLAIN: Seq Scan on orders (12M rows) → 890ms

AFTER:   Same query with index:
         CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);
EXPLAIN: Index Scan → 3ms (297x improvement)
```
