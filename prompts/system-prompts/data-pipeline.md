# CLAUDE.md Starter — Data Pipeline Project

Drop this into your project's `CLAUDE.md` and fill in the bracketed sections.

---

```markdown
# [Project Name] — Claude Code Instructions

## What this is
[One paragraph: what data this pipeline processes, source systems, destination, business purpose]

## Stack
- Orchestrator: [Airflow / Prefect / Dagster / dbt Cloud]
- Transformation: [dbt / PySpark / Pandas / Polars]
- Warehouse: [BigQuery / Snowflake / Redshift / DuckDB]
- Ingestion: [Fivetran / Airbyte / custom]
- Language: [Python / SQL]
- Infra: [Terraform on AWS / GCP / Azure]

## Project structure
dbt/ (if using dbt)
├── models/
│   ├── staging/      ← 1:1 with source tables, light cleaning only
│   ├── intermediate/ ← Business logic, joins
│   └── marts/        ← Final business entities (fct_, dim_ prefixes)
├── macros/           ← Reusable SQL macros
├── seeds/            ← Static reference data
└── tests/            ← Custom singular tests

pipelines/ (if using Airflow/Prefect/Dagster)
├── dags/ / flows/    ← Pipeline definitions
├── operators/        ← Custom operators/tasks
└── utils/            ← Shared utilities

## Data conventions
- Staging models: rename to snake_case, cast types, no joins, no business logic
- Fact tables: fct_ prefix, one row per event/transaction
- Dimension tables: dim_ prefix, one row per entity
- Never use SELECT * in production queries
- All mart models must have unique + not_null tests on primary key
- Source freshness checks required on all sources

## Decisions (do not re-discuss)
- [Incremental vs full-refresh strategy for fact tables]
- [Timezone: all timestamps in UTC]
- [Grain: what one row in each mart table represents]
- [Late-arriving data handling strategy]

## Testing requirements
- Every staging model: not_null on primary key
- Every mart model: unique + not_null on primary key, relationships on foreign keys
- Source freshness: warn at [X] hours, error at [Y] hours

## Performance rules
- Partition large tables by date — always filter on partition column
- Use incremental models for tables > [X] rows
- Never run full refreshes in production without approval
- Cluster/sort keys: [specify if using Snowflake/Redshift]

## Commands
- dbt run --select staging — run staging layer
- dbt test — run all tests
- dbt docs generate && dbt docs serve — preview documentation
- dbt source freshness — check source data freshness

## Never do
- Never put business logic in staging models
- Never hardcode dates — use dbt variables or macros
- Never commit real credentials — use environment variables or secrets manager
- Never run dbt run in production without dbt test passing first
```

---
