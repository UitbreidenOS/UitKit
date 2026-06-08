---
description: Recommend indexes for a table or query workload based on schema and access patterns
argument-hint: "[table name, query, or schema file]"
---
Analyze the database schema and access patterns for: $ARGUMENTS

If $ARGUMENTS is a table name, locate its schema in migrations, ORM models, or schema files. If it is a query, analyze that query's access patterns. If it is a file path, read it.

Perform this analysis:

1. Map the current indexes:
   - List all existing indexes (primary key, unique, composite, partial, expression-based).
   - Identify which indexes are redundant (prefix-covered by another index).
   - Identify unused or low-selectivity indexes (e.g., boolean columns, low-cardinality enums).

2. Analyze the query workload:
   - If queries are provided or discoverable in the codebase (ORM query calls, raw SQL), extract their WHERE, JOIN, ORDER BY, and GROUP BY patterns.
   - Identify columns that appear repeatedly in filter predicates.
   - Note any range queries that benefit from B-tree indexes vs. equality-only queries.

3. Recommend new indexes:
   - For each recommendation, state:
     a. The exact CREATE INDEX statement (use CONCURRENTLY for PostgreSQL if appropriate).
     b. Which queries or access patterns it covers.
     c. Estimated selectivity impact (high/medium/low cardinality).
     d. Write overhead cost — indexes that hurt INSERT/UPDATE throughput must be flagged.
   - Prefer composite indexes over multiple single-column indexes when the query pattern justifies it.
   - Consider partial indexes (WHERE clause) for sparse conditions (e.g., soft-delete patterns, status filters with dominant null/inactive values).
   - Consider covering indexes (INCLUDE columns) to eliminate table heap fetches for hot read paths.

4. Flag indexes to drop:
   - Duplicate indexes.
   - Indexes on columns never used in filters or joins.
   - Indexes that are superseded by a composite index.

5. Output a prioritized action plan: HIGH (immediate win, low risk) / MEDIUM (useful, minor write overhead) / LOW (marginal, evaluate under load).

State the assumed database engine from syntax or config context.
