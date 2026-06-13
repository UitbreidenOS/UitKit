---
name: "data-migration"
description: "Database migration patterns: zero-downtime schema changes, data backfills, Alembic, Prisma Migrate, Rails migrations"
---

# Data Migration Skill

## When to activate
- Adding, removing, or changing columns in a production database
- Renaming tables or columns while keeping the application running
- Backfilling data for a new column or changing data formats
- Writing Alembic, Prisma, Rails, or raw SQL migrations
- Planning a large-scale data transformation safely

## When NOT to use
- Small dev-only schema changes where downtime is acceptable
- NoSQL schema migrations (different patterns apply)
- Data warehouse ETL pipelines — use dbt or Spark instead

## Instructions

### The three rules of safe migrations

**1. Migrations must be reversible (or explicitly documented as irreversible)**
Every migration should have an `up` and a `down`. If a `down` is impossible (e.g. dropping a column with data), document it explicitly.

**2. Code and migration deploy must be decoupled**
Deploy the migration BEFORE deploying the code that uses it, or AFTER. Never at the same time. This ensures the database can serve both old and new code during a rolling deploy.

**3. Never lock a table in production**
Avoid `ALTER TABLE` with `LOCK`, large `UPDATE` statements on full tables, or dropping indexed columns — these lock the table and block all reads/writes.

### Zero-downtime migration patterns

**Adding a column (safe):**
```sql
-- Step 1: Add as nullable (no lock, no backfill needed)
ALTER TABLE users ADD COLUMN phone TEXT;

-- Step 2: Backfill (run in batches, not as one UPDATE)
UPDATE users SET phone = '' WHERE phone IS NULL AND id BETWEEN 1 AND 10000;
-- repeat in batches...

-- Step 3: Add NOT NULL constraint once backfilled
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

**Renaming a column (expand-contract pattern):**
```sql
-- Phase 1: Add the new column (both code paths write to both columns)
ALTER TABLE users ADD COLUMN full_name TEXT;
UPDATE users SET full_name = name;

-- Phase 2: Deploy code that reads new_name and writes to both
-- (dual-write period)

-- Phase 3: Remove the old column once code only uses new_name
ALTER TABLE users DROP COLUMN name;
```

**Removing a column (safe):**
```sql
-- Step 1: Deploy code that stops reading the column
-- Step 2: Only then drop it
ALTER TABLE users DROP COLUMN deprecated_field;
```

**Never:** drop a column while code still references it.

### Alembic (Python / SQLAlchemy)

```python
# migrations/versions/2026_05_15_add_phone_to_users.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    # 1. Add nullable first
    op.add_column('users', sa.Column('phone', sa.Text(), nullable=True))

def downgrade():
    op.drop_column('users', 'phone')
```

```python
# Batched backfill (separate script, not in the migration)
from sqlalchemy import text

BATCH_SIZE = 5000

with engine.connect() as conn:
    while True:
        result = conn.execute(text("""
            UPDATE users SET phone = ''
            WHERE phone IS NULL
            LIMIT :batch_size
        """), {"batch_size": BATCH_SIZE})
        conn.commit()
        if result.rowcount < BATCH_SIZE:
            break
```

```bash
# Apply
alembic upgrade head

# Rollback one step
alembic downgrade -1

# Check current revision
alembic current

# Generate from model changes
alembic revision --autogenerate -m "add phone to users"
```

### Prisma Migrate (TypeScript / Node.js)

```prisma
// schema.prisma — add the new field
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  phone String?  // nullable first
}
```

```bash
# Create and apply migration
npx prisma migrate dev --name add_phone_to_users

# Apply in production (no interactive prompts)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

**Prisma data migration (using a custom script):**
```typescript
// prisma/scripts/backfill-phone.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BATCH_SIZE = 1000

async function backfill() {
  let cursor: number | undefined
  while (true) {
    const users = await prisma.user.findMany({
      where: { phone: null },
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: 'asc' },
    })
    if (users.length === 0) break
    await prisma.user.updateMany({
      where: { id: { in: users.map(u => u.id) } },
      data: { phone: '' },
    })
    cursor = users[users.length - 1].id
    console.log(`Processed up to user ${cursor}`)
  }
}

backfill().finally(() => prisma.$disconnect())
```

### Rails Active Record migrations

```ruby
# db/migrate/20260515000000_add_phone_to_users.rb
class AddPhoneToUsers < ActiveRecord::Migration[7.1]
  # disable_ddl_transaction! for large tables on PostgreSQL
  disable_ddl_transaction!

  def change
    # Safe: nullable, no lock
    add_column :users, :phone, :string

    # Safe index creation (doesn't lock)
    add_index :users, :phone, algorithm: :concurrently
  end
end
```

```bash
rails db:migrate
rails db:rollback        # undo last migration
rails db:migrate:status  # check status
```

### Large table backfills (production-safe)

Never run `UPDATE users SET ... WHERE condition` on a large table — it locks the entire table and takes minutes or hours.

**PostgreSQL batched backfill:**
```sql
DO $$
DECLARE
    batch_size INT := 5000;
    min_id     BIGINT;
    max_id     BIGINT;
    current_id BIGINT;
BEGIN
    SELECT MIN(id), MAX(id) INTO min_id, max_id FROM users WHERE phone IS NULL;
    current_id := min_id;

    WHILE current_id <= max_id LOOP
        UPDATE users
        SET phone = ''
        WHERE id BETWEEN current_id AND current_id + batch_size - 1
          AND phone IS NULL;

        COMMIT;
        PERFORM pg_sleep(0.05); -- 50ms pause between batches
        current_id := current_id + batch_size;
    END LOOP;
END $$;
```

### Adding indexes safely

```sql
-- NEVER: locks the table
CREATE INDEX idx_users_phone ON users (phone);

-- ALWAYS in production: non-blocking
CREATE INDEX CONCURRENTLY idx_users_phone ON users (phone);

-- Check index build progress
SELECT phase, blocks_done, blocks_total
FROM pg_stat_progress_create_index
WHERE relid = 'users'::regclass;
```

### Migration checklist

Before applying to production:
- [ ] Tested in dev and staging
- [ ] Has a `downgrade` / `down` implementation
- [ ] No full-table `UPDATE` without batching
- [ ] No `CREATE INDEX` without `CONCURRENTLY`
- [ ] Code deployed handles both old and new schema (dual-read/write if renaming)
- [ ] Estimated runtime known (run `EXPLAIN` on the migration SQL)
- [ ] Backfill script separate from migration file
- [ ] Rollback plan documented

## Example

**Task:** Rename column `name` to `full_name` in the `users` table with zero downtime.

**Migration plan:**
1. `ALTER TABLE users ADD COLUMN full_name TEXT` — add nullable
2. `UPDATE users SET full_name = name` — backfill (in batches)
3. Deploy new code that reads `full_name`, writes to both `name` AND `full_name`
4. Verify all reads come from `full_name` — monitor logs
5. `ALTER TABLE users ALTER COLUMN full_name SET NOT NULL` — enforce NOT NULL
6. Deploy code that only writes to `full_name`
7. `ALTER TABLE users DROP COLUMN name` — remove old column

**Total downtime:** 0. Total deploys: 2.

---
