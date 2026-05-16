# CLAUDE.md — dbt Data Pipeline

A production dbt project for transforming raw data into analytics-ready tables. Follows the medallion architecture (raw → staging → marts) with full test coverage and CI integration.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Transformation | dbt Core |
| Warehouse | Snowflake (or BigQuery / DuckDB for local) |
| Orchestration | Airflow / Dagster / dbt Cloud |
| Testing | dbt tests + Great Expectations |
| Documentation | dbt docs |
| CI | GitHub Actions + SQLFluff |

---

## Key Commands

```bash
dbt debug                        # Test connection
dbt run                          # Run all models
dbt run --select staging.*       # Run one layer
dbt run --select +orders         # Run orders and all upstream models
dbt run --select orders+         # Run orders and all downstream models
dbt test                         # Run all tests
dbt test --select orders         # Test one model
dbt build                        # run + test together (preferred in CI)
dbt docs generate && dbt docs serve   # Generate and view docs
dbt source freshness             # Check source data freshness
sqlfluff lint models/            # Lint SQL
```

---

## Project Structure

```
dbt_project/
├── dbt_project.yml              # Project config, model configs by path
├── profiles.yml                 # Connection profiles (gitignored — use env vars)
├── packages.yml                 # dbt Hub packages
├── models/
│   ├── staging/                 # 1:1 with source tables, light cleaning only
│   │   ├── _sources.yml         # Source definitions + freshness checks
│   │   ├── _staging.yml         # Staging model documentation + tests
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/            # Optional: complex joins/pivots before marts
│   │   └── int_order_items.sql
│   └── marts/
│       ├── _marts.yml           # Mart docs + tests
│       ├── core/
│       │   ├── dim_customers.sql
│       │   └── fct_orders.sql
│       └── finance/
│           └── fct_revenue.sql
├── tests/                       # Custom singular tests (SQL files)
├── macros/                      # Reusable Jinja macros
├── seeds/                       # Static CSV lookup tables
├── snapshots/                   # Type 2 SCD snapshots
└── analyses/                    # Ad-hoc analysis queries (not materialized)
```

---

## Model Conventions

### Staging models — light cleaning only
```sql
-- models/staging/stg_orders.sql
-- Staging: rename columns, cast types, no joins, no business logic

with source as (
    select * from {{ source('raw', 'orders') }}
),

renamed as (
    select
        order_id::varchar       as order_id,
        customer_id::varchar    as customer_id,
        created_at::timestamp   as created_at,
        status::varchar         as status,
        amount_cents::integer   as amount_cents,
        amount_cents / 100.0    as amount_usd,

        -- Metadata
        _fivetran_synced        as _loaded_at

    from source
    where order_id is not null     -- Only filter obviously bad rows in staging
)

select * from renamed
```

### Fact table — business logic here
```sql
-- models/marts/core/fct_orders.sql
{{
    config(
        materialized='incremental',
        unique_key='order_id',
        on_schema_change='sync_all_columns'
    )
}}

with orders as (
    select * from {{ ref('stg_orders') }}
),

customers as (
    select * from {{ ref('dim_customers') }}
),

final as (
    select
        orders.order_id,
        orders.customer_id,
        customers.customer_segment,
        orders.created_at,
        orders.status,
        orders.amount_usd,
        case
            when orders.status = 'complete' then orders.amount_usd
            else 0
        end as completed_revenue_usd
    from orders
    left join customers using (customer_id)

    {% if is_incremental() %}
        where orders.created_at > (select max(created_at) from {{ this }})
    {% endif %}
)

select * from final
```

### YAML testing and documentation
```yaml
# models/marts/_marts.yml
version: 2

models:
  - name: fct_orders
    description: One row per order. Source of truth for order metrics.
    columns:
      - name: order_id
        description: Unique order identifier
        data_tests:
          - unique
          - not_null
      - name: customer_id
        data_tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id
      - name: amount_usd
        data_tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 100000
      - name: status
        data_tests:
          - accepted_values:
              values: ['pending', 'complete', 'cancelled', 'refunded']
```

### Source freshness
```yaml
# models/staging/_sources.yml
version: 2

sources:
  - name: raw
    database: raw_db
    schema: public
    freshness:
      warn_after: {count: 6, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _fivetran_synced

    tables:
      - name: orders
        description: Raw orders from the transactional database
      - name: customers
```

### Macros
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name, precision=2) %}
    round({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}

-- Usage in a model:
-- {{ cents_to_dollars('amount_cents') }} as amount_usd
```

---

## dbt_project.yml config

```yaml
name: 'dbt_project'
version: '1.0.0'
profile: 'default'

model-paths: ["models"]
test-paths: ["tests"]
macro-paths: ["macros"]
seed-paths: ["seeds"]
snapshot-paths: ["snapshots"]

models:
  dbt_project:
    staging:
      +materialized: view          # Staging = views (cheap, always fresh)
      +schema: staging
    intermediate:
      +materialized: ephemeral     # Intermediate = ephemeral (no table created)
    marts:
      +materialized: table         # Marts = tables (fast to query)
      +schema: marts
      core:
        fct_orders:
          +materialized: incremental
```

---

## Anti-Patterns — Do NOT

- **Never put business logic in staging models** — staging is renaming + casting only
- **Never use `SELECT *` in marts** — always list columns explicitly
- **Never join in staging** — staging is always 1:1 with a source table
- **Never skip `unique` + `not_null` tests on primary keys** — every model needs these two at minimum
- **Never hardcode dates** — use `current_date` or pass via dbt vars: `{{ var('start_date') }}`
- **Never commit `profiles.yml`** — use environment variables: `DBT_ENV_SECRET_SNOWFLAKE_PASSWORD`
- **Never use `dbt run` in CI** — use `dbt build` (runs + tests together, fails fast)

---

## CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/dbt.yml
- name: Run dbt build
  run: |
    dbt deps
    dbt source freshness
    dbt build --target ci --select state:modified+  # Only changed models + downstream
  env:
    DBT_ENV_SECRET_SNOWFLAKE_PASSWORD: ${{ secrets.SNOWFLAKE_PASSWORD }}
```

---

## Adding a New Mart Model

1. Create `models/marts/<domain>/fct_<name>.sql` or `dim_<name>.sql`
2. Add to `models/marts/_marts.yml` with description + column tests
3. Add `unique` + `not_null` on primary key at minimum
4. Run `dbt build --select fct_<name>` to test locally
5. Run `dbt docs generate` to update the documentation site
