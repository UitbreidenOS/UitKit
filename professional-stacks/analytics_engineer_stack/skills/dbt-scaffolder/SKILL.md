---
name: dbt-scaffolder
description: Generates dbt project structure, model scaffolds, and DAG-ready yaml files. Creates staging, mart, and fact/dimension models with proper documentation and testing hooks. Saves as dbt-compliant yaml and SQL files.
allowed-tools: Read, Write, WebFetch
effort: medium
---

## When to activate

When starting a new dbt project, refactoring existing models, or adding new transformation layers (staging, marts, facts). Run before building actual SQL transformations to establish proper structure and naming conventions.

## When NOT to use

Not for writing actual SQL logic — this skill creates structure and stubs. Not without a data model (use data-modeling skill first). Not for incremental model optimization — use sql-optimizer skill instead.

## dbt Structure Checklist

1. **Define project hierarchy** — Staging (1:1 raw), intermediate (business logic), marts (BI-ready)
2. **Establish naming conventions** — stg_*, int_*, fct_*, dim_*, rpt_*
3. **Plan materialization** — table, view, incremental, or ephemeral for each layer
4. **Design tests** — not null, unique, referential integrity, custom data tests
5. **Document columns** — Add descriptions to columns that stakeholders use
6. **Set up lineage** — Use ref() and source() to build DAG; avoid direct raw table refs
7. **Configure dependencies** — Tag models by domain (marketing, finance, product)
8. **Plan deployment** — Establish run order; identify critical path models

## Model Types

**Staging models** — 1:1 transformations on raw tables. No business logic. Rename columns, fix data types, basic cleaning. Materialized as views or ephemeral.

**Intermediate models** — Business logic shared across multiple marts. Union, join, flag logic, aggregations. Materialized as tables or ephemeral. Prefix: `int_`.

**Fact models** — Measurable events at a specific grain. Denormalized with foreign keys to dimensions. Materialized as table or incremental. Prefix: `fct_`.

**Dimension models** — Slowly changing entities (customers, products, dates). Highly denormalized; includes all attributes. Prefix: `dim_`.

**Report models** — Final layer for BI tools or end-user consumption. Minimal transformation; mostly pivots and formatting. Prefix: `rpt_` or `report_`.

## dbt Project Scaffold Template

```markdown
# dbt Project Scaffold

**Project Name:** [Project name]  
**Data Warehouse:** [Snowflake / BigQuery / PostgreSQL / Redshift]  
**Environments:** [dev, staging, prod]  
**Owner:** [Name]  

---

## Directory Structure

\`\`\`
dbt_project/
├── dbt_project.yml
├── profiles.yml
├── models/
│   ├── staging/
│   │   ├── _stg_sources.yml
│   │   ├── stg_raw_users.sql
│   │   ├── stg_raw_orders.sql
│   │   └── stg_raw_payments.sql
│   ├── intermediate/
│   │   ├── int_revenue_base.sql
│   │   ├── int_customer_lifetime_value.sql
│   │   └── _intermediate.yml
│   ├── marts/
│   │   ├── fct_orders.sql
│   │   ├── dim_customers.sql
│   │   ├── dim_products.sql
│   │   ├── dim_date.sql
│   │   └── _marts.yml
│   └── reports/
│       ├── rpt_daily_metrics.sql
│       └── _reports.yml
├── macros/
│   ├── generate_schema_name.sql
│   └── custom_tests.sql
├── tests/
│   ├── generic/
│   └── singular/
└── README.md
```

---

## Model Specifications

### Staging Layer

**Purpose:** 1:1 transformation on raw tables; no business logic

**Materialization:** view (or ephemeral if used by single downstream model)

**Naming:** stg_{source}_{entity}

| Model | Source | Purpose | Row Count |
|-------|--------|---------|-----------|
| stg_raw_users | raw.users | Rename columns, fix types | 50K |
| stg_raw_orders | raw.orders | Standardize dates, null handling | 10M |
| stg_raw_payments | raw.payments | Deduplicate, clean | 15M |

### Intermediate Layer

**Purpose:** Shared business logic; transformation before marts

**Materialization:** table or ephemeral

**Naming:** int_{verb}_{noun}

| Model | Logic | Dependencies | Row Count |
|-------|-------|--------------|-----------|
| int_revenue_base | Join orders + payments; add revenue | stg_raw_orders, stg_raw_payments | 10M |
| int_customer_status | Join customers + orders; flag churn | stg_raw_users, int_revenue_base | 50K |

### Fact Layer

**Purpose:** Core measurable events

**Materialization:** table or incremental

**Naming:** fct_{business_process}

**Grain:** [grain description]

| Model | Grain | Dependencies | Row Count |
|-------|-------|--------------|-----------|
| fct_orders | One row per order | int_revenue_base, stg_raw_orders | 10M |
| fct_transactions | One row per payment | int_revenue_base, stg_raw_payments | 15M |

### Dimension Layer

**Purpose:** Entity attributes; highly denormalized

**Materialization:** table or view

**Naming:** dim_{entity}

**SCD Type:** [0, 1, 2, or hybrid]

| Model | Cardinality | SCD Type | Dependencies |
|-------|-------------|----------|--------------|
| dim_customers | 50K | 2 (historical) | stg_raw_users, int_customer_status |
| dim_products | 5K | 1 (overwrite) | stg_raw_products |
| dim_date | 3.6K | 0 (static) | None |

---

## dbt_project.yml Configuration

\`\`\`yaml
name: 'analytics'
version: '1.0.0'
config-version: 2

profile: 'default'

model-paths: ["models"]
analysis-paths: ["analysis"]
test-paths: ["tests"]
data-paths: ["data"]
macro-paths: ["macros"]
snapshot-paths: ["snapshots"]
target-path: "target"
clean-targets:
  - "target"
  - "dbt_packages"

vars:
  run_date: '{{ run_started_at.strftime("%Y-%m-%d") }}'
  lookback_days: 90

models:
  analytics:
    staging:
      +materialized: view
      +tags: ["staging"]
    intermediate:
      +materialized: table
      +tags: ["intermediate"]
    marts:
      +materialized: table
      +tags: ["marts"]
      +schema: analytics
    reports:
      +materialized: view
      +tags: ["reports"]
      +schema: reporting

seeds:
  analytics:
    +tags: ["seeds"]

require-dbt-version: [">=1.5.0", "<2.0.0"]
\`\`\`

---

## Testing Strategy

### Generic Tests (dbt built-in)

Applied via yaml to all models:

```yaml
models:
  - name: fct_orders
    columns:
      - name: order_id
        tests:
          - not_null
          - unique
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id
      - name: order_amount
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 1000000
```

### Singular Tests

Custom SQL tests for domain logic:

```sql
-- tests/singular/test_no_future_orders.sql
SELECT *
FROM {{ ref('fct_orders') }}
WHERE order_date > CURRENT_DATE
LIMIT 0
```

### dbt test Coverage

- 100% of fact/dimension primary keys: unique + not_null
- 100% of foreign keys: referential integrity
- Row counts: snapshots of expected volume ranges
- Freshness: source data arrival times

---

## Documentation

Every model must include:

```yaml
models:
  - name: fct_orders
    description: "One row per order placed. Core fact table for revenue and order analysis."
    columns:
      - name: order_id
        description: "Primary key"
        tests: [unique, not_null]
      - name: customer_id
        description: "Foreign key to dim_customers"
        tests: [not_null, relationships]
      - name: order_amount
        description: "Total order amount in USD, net of discounts"
```

---

## Deployment & CI/CD

**Development:** Run on personal dev schema  
**Staging:** Run on staging schema; run dbt test  
**Production:** Run on prod schema; tag critical models  

**dbt Cloud jobs:**
1. Schedule: Daily at 6 AM UTC
2. Commands: dbt deps && dbt seed && dbt run && dbt test
3. On-failure: Slack notification to #data

---


```

## Example

See Project Scaffold Template above.

---
