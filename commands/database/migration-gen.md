---
description: Generate a database migration file from a schema change description or diff
argument-hint: "[description of schema change]"
---
You are generating a database migration. The user has provided: $ARGUMENTS

Infer the target migration framework from the project (Alembic, Flyway, Liquibase, Django migrations, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize, or raw SQL). If ambiguous, check for config files or existing migration files in the repo before asking.

Steps:
1. Examine existing migrations to determine naming convention, timestamp format, and file structure.
2. Identify the current schema state from existing migrations or schema files.
3. Generate the migration with:
   - An `up` path (forward migration) that is idempotent where possible (use IF NOT EXISTS, IF EXISTS guards).
   - A `down` path (rollback) that fully reverses the `up` path.
   - Explicit transaction boundaries if the framework supports transactional DDL.
   - Column constraints (NOT NULL, DEFAULT, CHECK) that match what was requested.
   - Index creation alongside any new foreign keys.
4. If the change involves renaming a column or table, generate a two-phase migration: add new, backfill, drop old — unless the user explicitly requests a single-phase rename.
5. Flag any destructive operations (DROP COLUMN, DROP TABLE, type narrowing) with a comment block starting with `-- DESTRUCTIVE:` and recommend a corresponding deployment strategy (feature flag, dual-write, etc.).
6. Output the migration file content with the correct filename following existing conventions.
7. For large tables, flag operations that require ACCESS EXCLUSIVE locks (ALTER TABLE on PostgreSQL) and suggest CONCURRENTLY alternatives where available.

Do not generate ORM model changes unless asked. Focus solely on the migration artifact.
