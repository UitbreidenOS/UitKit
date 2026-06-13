# Database Migration Workflow

Safe, step-by-step process for planning and executing database schema changes with zero downtime.

## When to use

Use this workflow for any database change that:
- Modifies an existing table (add/rename/drop column, change type)
- Affects a table with > 100K rows
- Requires a new index on a large table
- Changes a constraint or foreign key
- Involves moving or splitting data between tables

Skip this workflow for: new tables on new features with no existing data.

## Phase 1: Planning (before writing any SQL)

**Answer these questions first:**

1. What exactly is changing?
   - Column add / rename / drop / type change / constraint change / index?

2. How much data is affected?
   ```sql
   SELECT COUNT(*) FROM affected_table;  -- row count
   SELECT pg_size_pretty(pg_total_relation_size('affected_table'));  -- table size
   ```

3. How busy is this table?
   ```sql
   -- Check access patterns (PostgreSQL)
   SELECT seq_scan, idx_scan, n_tup_upd, n_tup_del
   FROM pg_stat_user_tables WHERE relname = 'affected_table';
   ```

4. Can this be done with zero downtime?
   - ADDING a nullable column: yes
   - ADDING a NOT NULL column without default: requires expand-contract
   - DROPPING a column: yes (if code doesn't use it anymore)
   - RENAMING a column: requires expand-contract
   - CREATING an index: yes, with CONCURRENTLY
   - CHANGING a column type: risky — check if data conversion is needed

5. Is the application code compatible with both old and new schema?
   - Deploy code first, then migrate (new column can be null until backfilled)
   - Or migrate first, then deploy (only if migration is purely additive)

## Phase 2: Write the migration

**Use the expand-contract pattern for any breaking change:**

```sql
-- EXPAND PHASE (deploy this first, old code still works):
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- BACKFILL (run this offline, no lock):
-- In batches to avoid locking:
UPDATE users SET display_name = username 
WHERE display_name IS NULL AND id BETWEEN 1 AND 10000;
-- ... repeat for all ID ranges

-- CONTRACT PHASE (after code is updated and backfill complete):
-- Add constraints only after backfill:
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
-- Drop old column only after confirming nothing reads it:
ALTER TABLE users DROP COLUMN username;
```

**Write the rollback:**
```sql
-- Every migration must have a documented rollback
-- Rollback for above:
ALTER TABLE users ADD COLUMN username VARCHAR(255);
UPDATE users SET username = display_name WHERE username IS NULL;
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users DROP COLUMN display_name;
```

## Phase 3: Test

```bash
# 1. Test on a copy of production data (not just a dev DB)
pg_dump $PROD_DB | psql $STAGING_DB

# 2. Measure migration time on staging
time psql $STAGING_DB < migration.sql

# 3. Test rollback on staging
time psql $STAGING_DB < rollback.sql

# 4. Verify data integrity after migration
psql $STAGING_DB -c "SELECT COUNT(*) FROM affected_table WHERE new_column IS NULL;"
```

**Acceptance criteria before running in production:**
- [ ] Migration runs in < 30 seconds (or uses CONCURRENTLY and is non-blocking)
- [ ] Rollback tested and confirmed to work
- [ ] Data integrity validated (row counts, null checks, constraint checks)
- [ ] Application tested with both old and new schema (during transition)

## Phase 4: Production execution

**Pre-migration checklist:**
- [ ] Backup taken within the last 24 hours (or take one now)
- [ ] Off-peak time selected (avoid peak traffic hours)
- [ ] Engineering on standby for 30 minutes after migration
- [ ] Rollback script ready to paste immediately
- [ ] Monitoring dashboards open

**Execution:**
```bash
# 1. Run migration
psql $PROD_DB < migration.sql

# 2. Immediately verify
psql $PROD_DB -c "SELECT COUNT(*) FROM affected_table;"
psql $PROD_DB -c "\d affected_table"  # confirm schema

# 3. Monitor for 10 minutes
# Check: error rate, query latency, DB CPU
```

**If anything looks wrong:**
```bash
# Execute rollback immediately
psql $PROD_DB < rollback.sql
# Then investigate on staging before retrying
```

## Phase 5: Post-migration

- [ ] Clean up: remove any temporary columns or indexes used during migration
- [ ] Update documentation if schema docs exist
- [ ] Archive the migration files with version history
- [ ] If the migration was complex: write a post-mortem note for the team

## Related content

- `/rules/common/database-migrations` — rules that apply to all migrations
- `/skills/devops-infra/migration-architect` — complex multi-system migrations
- `/skills/database/postgresql` — PostgreSQL-specific patterns

---
