---
name: migration-planner
description: Plans and executes database schema migrations with zero-downtime strategies including expand/contract, dual-write, and backfill approaches.
allowed-tools: Read, Write, Bash
effort: high
---

# Migration Planner

## When to activate
Before any schema change on a production database with active traffic. When adding columns, changing types, renaming tables, or splitting/merging tables. Also for engine version upgrades.

## When NOT to use
Skip for development/staging databases with no live traffic. Skip for additive-only changes on tables under 1M rows during maintenance windows.

## Instructions

1. Classify the migration: additive (new column/table), destructive (drop/rename), or modification (type change).
2. For additive: safe to deploy directly with default values or NULL.
3. For destructive: use expand/contract pattern — add new, dual-write, backfill, switch reads, stop old writes, drop old.
4. For modifications: create new column with target type, backfill, then swap.
5. Estimate migration time based on table size and lock impact.
6. For large tables (>10M rows): use `pg_repack`, `pt-online-schema-change`, or `gh-ost` to avoid long locks.
7. Always create a rollback script before executing.

## Example

**Scenario:** Rename `users.email` to `users.primary_email` on a 5M row table.

```
MIGRATION PLAN: rename email → primary_email (5M rows)

Phase 1 — Expand (deploy 1):
  ALTER TABLE users ADD COLUMN primary_email TEXT;
  UPDATE users SET primary_email = email; -- backfill

Phase 2 — Dual-write (deploy 2):
  App writes to both email AND primary_email

Phase 3 — Switch reads (deploy 3):
  App reads from primary_email only

Phase 4 — Contract (deploy 4, after 1 week observation):
  ALTER TABLE users DROP COLUMN email;

Rollback: Each phase is independently reversible.
Estimated time: Phase 1 backfill ~45 min, Phase 4 drop ~2 min.
```
