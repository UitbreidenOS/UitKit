# SQL Rules

Apply these rules when writing queries, schemas, or stored procedures.

## Query hygiene

- Always use parameterised queries — never string-interpolate user input into SQL
- Qualify column names when joining multiple tables: `u.id` not `id`
- Avoid `SELECT *` in production queries; name every column you need
- Use `EXPLAIN ANALYZE` before merging any query that touches large tables
- Keep queries readable: one clause per line for anything beyond a trivial SELECT

## Indexing

- Every foreign key must have an index — the database does not add this automatically
- Index columns that appear in `WHERE`, `JOIN ON`, or `ORDER BY` on hot paths
- Composite indexes: column order matters — put the highest-cardinality or equality filter first
- Don't over-index write-heavy tables; each index slows `INSERT`/`UPDATE`/`DELETE`
- Use partial indexes for filtered queries: `CREATE INDEX … WHERE deleted_at IS NULL`

## Schema design

- Use `NOT NULL` by default; nullable only when absence has distinct meaning from zero/empty
- Store timestamps as `TIMESTAMPTZ` (UTC) — never `TIMESTAMP WITHOUT TIME ZONE`
- Use `BIGINT` or `UUID` for primary keys; `SERIAL`/`INT` runs out on high-volume tables
- Soft-delete with `deleted_at TIMESTAMPTZ` when row history matters; hard-delete otherwise
- Money: store as integer cents (`BIGINT`) or `NUMERIC(19,4)` — never `FLOAT`/`DOUBLE`

## Transactions

- Wrap multi-statement mutations in a transaction; never leave partial writes possible
- Keep transactions short — lock held = latency for every competing writer
- Use `SELECT … FOR UPDATE` to lock rows you're about to modify, not after the fact
- Avoid transactions that span an HTTP request-response cycle

## Migrations

- Migrations are append-only; never edit a migration that has run in any environment
- Prefer additive changes (add column, add table) before removing old columns
- Add new non-nullable columns with a `DEFAULT` or in two steps: add nullable → backfill → add constraint
- Test rollback: every migration should have a reversible `down` step

## Anti-patterns

- No logic in application queries that belongs in constraints: use `CHECK`, `UNIQUE`, `FK`
- No `NOT IN (subquery)` with nullable columns — it silently returns zero rows on NULL
- No correlated subqueries inside loops — batch or use a `JOIN`/`CTE` instead
- No `OFFSET` pagination on large tables — use cursor-based (`WHERE id > :cursor`)
