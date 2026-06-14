---
name: index-optimizer
description: Analyzes query patterns and table access to recommend index creation, removal of unused indexes, and index maintenance (REINDEX, ANALYZE).
allowed-tools: Read, Write, Bash
effort: medium
---

# Index Optimizer

## When to activate
When queries are slow due to sequential scans on large tables, when adding new features that change query patterns, during quarterly performance reviews, or when unused indexes are consuming disk/memory.

## When NOT to use
Skip for tables under 10,000 rows (sequential scans are faster). Skip if queries already use index-only scans.

## Instructions

1. Identify the slow queries from `pg_stat_statements` or slow query log.
2. Run `EXPLAIN ANALYZE` on each to find sequential scans on large tables.
3. Check existing indexes with `pg_indexes` and `pg_stat_user_indexes`.
4. For each sequential scan: analyze the WHERE/JOIN/ORDER BY columns and recommend a composite index.
5. Check for unused indexes (scans = 0 over 30+ days) and recommend removal.
6. Check for duplicate indexes (same columns, different names).
7. Recommend `REINDEX` if index bloat exceeds 30%.

## Example

**Scenario:** `orders` table, 12M rows, queries filtering by `customer_id` and `status`.

```
INDEX ANALYSIS: orders (12M rows)

Current indexes:
  orders_pkey (id)                    — 2.1M scans ✅
  orders_created_at_idx (created_at)  — 0 scans ❌ UNUSED (47 days)
  orders_email_idx (email)            — 180K scans ✅

Sequential scans detected:
  WHERE customer_id = $1 AND status = $2  → 450ms avg (seq scan)

Recommendations:
  CREATE INDEX orders_customer_status_idx ON orders (customer_id, status);
  -- Expected improvement: 450ms → 2ms

  DROP INDEX orders_created_at_idx;
  -- Saves 1.2GB disk, reduces write amplification

  REINDEX INDEX orders_pkey;
  -- 34% bloat detected, estimated 400MB savings
```
