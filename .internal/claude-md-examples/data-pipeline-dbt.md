# CLAUDE.md — dbt + Snowflake + Airflow Data Engineering (Annotated Example)
> Data engineering monorepo — shows how to constrain Claude in a domain where SQL correctness, idempotency, and cost (Snowflake compute) are the primary risks.

<!-- ANNOTATION: Snowflake costs money per query. Claude needs to know this so it doesn't casually suggest full-table scans or unfiltered joins on billion-row tables during development. This cost framing changes how it writes SQL. -->
This is a data engineering project. Compute runs on Snowflake — warehouse credits cost real money. Every model and query Claude writes should be reviewed for cost efficiency. Prefer incremental models over full refreshes.

## Stack

<!-- ANNOTATION: Versions matter more in dbt than most tools — adapter-specific functions, incremental strategies, and macros change across versions. -->
- dbt Core 1.8 with dbt-snowflake adapter
- Snowflake (warehouse: `TRANSFORM_WH`, database: `ANALYTICS`)
- Apache Airflow 2.9 for orchestration (DAGs trigger dbt runs)
- Python 3.11 for Airflow operators and dbt macros
- Pre-commit hooks for SQL linting (sqlfluff) and YAML validation

## Project Structure

```
dbt/
  models/
    staging/        # stg_* — raw source cleaning, 1:1 with source tables
    intermediate/   # int_* — business logic joins, not exposed to BI
    marts/          # dim_*, fct_* — final consumption layer
  macros/           # Reusable Jinja macros
  tests/            # Generic + singular data tests
  seeds/            # Static lookup tables
  snapshots/        # SCD Type 2 snapshots
  analyses/         # Ad-hoc SQL (not materialized)
airflow/
  dags/             # DAG definitions
  operators/        # Custom operators
  hooks/            # Custom hooks
```

## Naming Conventions

<!-- ANNOTATION: dbt naming conventions are load-bearing. The stg/int/mart prefixes determine materialization strategy and access permissions. Claude must follow them to keep the DAG graph meaningful. -->
- Staging: `stg_{source}_{entity}.sql` — views, no business logic
- Intermediate: `int_{description}.sql` — ephemeral or views, transformation only
- Facts: `fct_{process}.sql` — event-grain tables, incremental
- Dimensions: `dim_{entity}.sql` — slowly changing, usually snapshot-backed
- Never skip layers — do not join raw sources in a mart model

## Materialization Rules

<!-- ANNOTATION: Materialization is the most expensive decision in a dbt model. Claude defaults to `table` if not told otherwise, which creates full refreshes. This section makes the cost-aware defaults explicit. -->
- Staging: `view` (no storage cost, always fresh)
- Intermediate: `ephemeral` unless used by more than two downstream models
- Marts: `incremental` with `unique_key` and `merge` strategy — not `table` unless < 1M rows
- Snapshots: use dbt's built-in `snapshot` with `check_cols` or `timestamp` strategy

## Incremental Model Pattern

<!-- ANNOTATION: The incremental filter pattern is subtle — forgetting `is_incremental()` guard means the filter runs on full refresh too, breaking it. Spelling out the boilerplate prevents this. -->
All incremental models must use this filter pattern:

```sql
{% if is_incremental() %}
  where updated_at > (select max(updated_at) from {{ this }})
{% endif %}
```

Always define `unique_key` in the model config. Use `merge` strategy for fact tables.

## Testing Requirements

<!-- ANNOTATION: Data tests aren't optional in a professional dbt project — they're the contract. Naming which tests are required on which column types prevents Claude from writing untested models. -->
Every model must have a schema YAML file with:
- `unique` + `not_null` tests on the primary key
- `accepted_values` tests on enum/status columns
- `relationships` tests on foreign keys to dimension tables
- At least one singular test for complex business logic

Run tests: `dbt test --select staging` before promoting to marts.

## Snowflake Cost Rules

<!-- ANNOTATION: These rules exist because a careless Claude-generated query on a large fact table can burn hundreds of dollars. The warehouse size note is especially important — Claude must not suggest upsizing as a performance fix. -->
- Always filter on the partition/cluster key when querying large tables
- Do not use `SELECT *` in production models — select only needed columns
- Do not run `dbt run` (full project) during development — use `dbt run --select <model>`
- Do not suggest increasing warehouse size as a performance fix — optimize the SQL first
- Use `dbt compile` to inspect generated SQL before running it

## Airflow DAG Rules

<!-- ANNOTATION: Airflow DAG design has footguns — top-level DB connections, dynamic task generation in global scope, etc. These rules prevent the most common mistakes. -->
- DAGs must be idempotent — re-running a DAG for a historical date must produce the same result
- Do not open DB connections at DAG parse time (module-level scope) — only inside operators
- Use `DbtRunOperator` from `astronomer-cosmos` — do not shell out to `dbt run` with `BashOperator`
- Catchup is disabled by default (`catchup=False`) — enable it only when the DAG is explicitly backfillable
- All DAGs have a `max_active_runs=1` to prevent concurrent conflicting runs

## SQL Style

- SQL keywords in UPPERCASE
- CTEs over subqueries — one CTE per logical step
- Always alias table references: `orders as o`
- sqlfluff enforces formatting — run `sqlfluff lint dbt/models/` before committing

## What Not To Do

<!-- ANNOTATION: These are the data engineering sins that destroy pipeline reliability: non-idempotent models, untested primary keys, raw sources in marts, and SELECT * on large tables. -->
- Do not write non-idempotent models — every model must be safely re-runnable
- Do not join raw source tables directly in mart models — go through staging
- Do not use `{{ ref() }}` to bypass layer boundaries (no staging → mart direct ref)
- Do not add a model without a corresponding schema YAML file
- Do not run full `dbt run` on the production warehouse during development
- Do not use `VARIANT` columns in mart models — flatten before exposing to BI
