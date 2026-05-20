# Database Migration Rules

Apply these rules when writing or reviewing database migrations.

## Core principles

- Every migration must be reversible (has a `down` function or documented rollback)
- Migrations run once and in order — never edit a committed migration
- Test migrations on a copy of production data before applying to production
- Never assume a migration is instant — large tables can lock for minutes

## Safety rules

### Never drop without a plan

```sql
-- WRONG: irreversible, no warning
DROP TABLE users;
DROP COLUMN email FROM users;

-- RIGHT: deprecate first, drop in a later migration after confirming unused
-- Step 1 (now): rename or mark as deprecated
ALTER TABLE users RENAME COLUMN email TO email_deprecated;
-- Step 2 (next sprint, after confirming code no longer uses it): drop
ALTER TABLE users DROP COLUMN email_deprecated;
```

### Add NOT NULL with a default, then make it required

```sql
-- WRONG: locks the entire table while backfilling
ALTER TABLE orders ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending';

-- RIGHT for large tables (expand-contract pattern):
-- Step 1: add nullable
ALTER TABLE orders ADD COLUMN status VARCHAR(20);

-- Step 2: backfill in batches (no lock)
UPDATE orders SET status = 'pending' WHERE status IS NULL AND id BETWEEN 1 AND 10000;
-- (repeat in batches)

-- Step 3: add constraint
ALTER TABLE orders ALTER COLUMN status SET NOT NULL;
```

### Create indexes concurrently

```sql
-- WRONG: blocks all writes while building
CREATE INDEX idx_users_email ON users(email);

-- RIGHT: non-blocking
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- For unique indexes:
CREATE UNIQUE INDEX CONCURRENTLY idx_users_email ON users(email);
```

### Foreign keys with validation delay

```sql
-- WRONG: validates all existing data immediately (slow on large tables)
ALTER TABLE orders ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);

-- RIGHT: add invalid first, then validate separately
ALTER TABLE orders ADD CONSTRAINT fk_user 
  FOREIGN KEY (user_id) REFERENCES users(id) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT fk_user;  -- can run during low-traffic
```

## Naming conventions

```
migrations/
  0001_create_users_table.sql
  0002_add_email_to_users.sql
  0003_create_orders_table.sql
  0004_add_index_users_email.sql

Format: {sequential_number}_{description_snake_case}.sql
Never: dates in filenames (cause ordering issues across timezones)
```

## Required checklist before running in production

- [ ] Tested on a staging database with production-scale data
- [ ] Estimated run time confirmed (< 1 minute for non-concurrent, or uses CONCURRENTLY)
- [ ] Rollback procedure documented and tested
- [ ] No application code deployed that requires the new schema before migration runs
- [ ] No migration that the old application code will break (backward-compatible deploy first)

## ORM-specific rules

### Prisma

```typescript
// NEVER edit a migration file after it's been applied
// ALWAYS use: npx prisma migrate dev (development)
// ALWAYS use: npx prisma migrate deploy (production)

// For destructive changes: create a custom migration
npx prisma migrate dev --create-only  // creates file without running
// Edit the generated file to add safety steps
npx prisma migrate dev  // then run it
```

### Drizzle

```typescript
// Use drizzle-kit push for dev (schema sync)
// Use drizzle-kit generate + migrate for production
// Store generated migrations in version control
// Never rename/delete generated migration files
```
