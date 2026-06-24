---
description: Generate realistic seed data scripts for development or test environments
argument-hint: "[table name(s), schema file, or description]"
---
Generate seed data for: $ARGUMENTS

If $ARGUMENTS is a table name or list of names, locate schema definitions in the codebase. If it is a schema file, read it. If it is a description, infer the schema from context.

Rules for seed data generation:

1. Detect the seeding mechanism used in this project:
   - SQL INSERT files, framework seeders (Rails db/seeds.rb, Django fixtures, Prisma seed.ts, Laravel seeders, Knex seeds), or factory libraries (FactoryBot, factory-boy, Faker.js).
   - Match the existing format exactly.

2. Generate data that is:
   - Realistic: use domain-appropriate values (real-looking names, valid emails, plausible dates, correct enum values).
   - Varied: at least 10-20 rows per table unless the table represents a small lookup set.
   - Consistent across related tables: foreign keys reference valid IDs in parent tables; seeding order respects FK constraints.
   - Safe: never use real PII patterns — use obviously fake data (e.g., `alice@example.com`, not `alice@gmail.com`).

3. Cover edge cases:
   - At least one row per distinct enum/status value.
   - Null values for nullable columns where the application must handle them.
   - Boundary values (zero amounts, max-length strings, far-future/past dates) where relevant to testing.

4. If the schema has soft-delete columns, include both active and deleted records.

5. Output the seed file(s) with correct filenames and paths following project conventions.

6. After the seed data, list any prerequisite seeds that must run first (dependency order) and any manual setup steps (e.g., creating a superuser before seeding user roles).

Do not output more than 50 rows per table unless explicitly requested.
