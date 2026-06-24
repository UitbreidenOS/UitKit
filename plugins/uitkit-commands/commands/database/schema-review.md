---
description: Review a database schema for design flaws, normalization issues, and production readiness
argument-hint: "[schema file or table name(s)]"
---
You are conducting a production-readiness review of a database schema. Review target: $ARGUMENTS

If $ARGUMENTS is a file path, read the file. If it is a table name or list of names, look for schema definitions in the codebase (migrations, ORM models, schema.sql, schema.rb, prisma.schema, etc.).

Review the schema across these dimensions:

**Normalization and Data Integrity**
- Identify violations of 1NF, 2NF, 3NF. Note denormalizations that are intentional (for read performance) vs. accidental.
- Detect columns storing multiple values (comma-separated lists, JSON arrays used as relations).
- Check that every table has a clear primary key.
- Verify foreign keys are declared and not just implied by naming convention.
- Check for missing UNIQUE constraints on columns that should be unique.
- Detect nullable columns that should be NOT NULL given business semantics.

**Type Appropriateness**
- Flag string columns used to store emails, UUIDs, IP addresses, JSON, money amounts, or datetimes — suggest proper types.
- Flag INT used for boolean (use BOOLEAN), or FLOAT used for currency (use DECIMAL/NUMERIC).
- Check timezone handling: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Naming and Consistency**
- Check for consistent naming conventions (snake_case vs camelCase, plural vs singular table names).
- Identify inconsistent column naming patterns for common fields (created_at vs createdAt vs create_time).

**Scalability Concerns**
- Tables missing an index on foreign key columns.
- Tables with no obvious partition strategy that will likely exceed 10M rows.
- Missing soft-delete pattern where hard deletes would break audit requirements.
- VARCHAR without a reasonable length limit on columns likely to be indexed.

**Security**
- Columns that appear to store sensitive data (password, ssn, card_number, secret) without a naming convention indicating they are hashed/encrypted.

Output a structured report with severity ratings (CRITICAL / WARNING / SUGGESTION) for each finding, and a concrete fix for each.
