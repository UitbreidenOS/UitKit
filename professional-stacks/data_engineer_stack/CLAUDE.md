# Data Engineer Stack — CLAUDE.md

## Workspace Configuration

### Key Principles

1. **Pipeline as Code** — All data transformations must be declarative, version-controlled, and reproducible.
2. **Data Quality First** — Validation, testing, and monitoring are prerequisites, not afterthoughts.
3. **Orchestration Clarity** — Tool selection (Airflow, dbt, Spark) must be explicit in the workspace.

### Model Preference

- Default: Haiku (fast feedback loops for pipeline debugging)
- Upgrade to Sonnet for: schema design, optimization, cost analysis

### Tools Scope

- Bash, Python, SQL, Git
- No frontend or UI tools
