# Data Pipeline (dbt + Airflow) — Project Structure

> For data engineers maintaining a production ELT pipeline — optimizing the full cycle from raw ingestion through dbt transformations to validated, BI-ready mart tables.

## Stack

- **Transformations:** dbt Core 1.8+ (Python 3.11+, dbt-postgres or dbt-bigquery adapter)
- **Orchestration:** Apache Airflow 2.9+ (LocalExecutor for dev, CeleryExecutor for prod)
- **Warehouse:** PostgreSQL 16 or BigQuery (adapter-swappable via profiles.yml)
- **Ingestion:** Airbyte 0.50+ (connection configs version-controlled in airbyte/)
- **Data quality:** Great Expectations 0.18+ (suites per mart, Airflow checkpoints)
- **Custom operators:** Python 3.11+ (Airflow plugins with BaseOperator subclasses)
- **Containerisation:** Docker 25 + docker-compose v2 (Airflow webserver, scheduler, worker, triggerer)
- **CI/CD:** GitHub Actions (dbt compile + test on PR, deploy on merge to main)
- **BI:** Metabase 0.49+ (reads from mart schema; semantic layer via dbt exposures)
- **Secret management:** Airflow Connections + Variables (prod); .env files (local dev)

## Directory tree

```
data-pipeline/
├── .github/
│   └── workflows/
│       ├── dbt-ci.yml                           # PR: dbt compile, dbt test --select state:modified+
│       └── deploy.yml                           # Merge to main: dbt run --target prod, GE checkpoints
├── dbt/
│   ├── dbt_project.yml                          # Project name, version, model/test/seed paths, vars
│   ├── profiles.yml                             # dev/prod targets — DO NOT COMMIT (in .gitignore)
│   ├── packages.yml                             # dbt-utils, dbt-expectations, elementary-data
│   ├── sources.yml                              # Top-level source declarations (deprecated — move to models/)
│   ├── analyses/
│   │   ├── cohort_retention.sql                 # Ad-hoc analysis compiled but not materialised
│   │   └── revenue_reconciliation.sql           # Finance sign-off query run monthly
│   ├── macros/
│   │   ├── generate_schema_name.sql             # Override schema naming: env_prefix + custom_schema
│   │   ├── cents_to_dollars.sql                 # Monetary unit conversion macro
│   │   ├── safe_divide.sql                      # Division with zero-denominator guard
│   │   ├── surrogate_key_from_columns.sql       # Wraps dbt_utils.generate_surrogate_key
│   │   └── current_timestamp_utc.sql            # Adapter-agnostic UTC timestamp macro
│   ├── models/
│   │   ├── staging/
│   │   │   ├── _sources/
│   │   │   │   ├── src_stripe.yml               # Stripe source: tables, columns, freshness checks
│   │   │   │   ├── src_salesforce.yml           # Salesforce source: accounts, opportunities, contacts
│   │   │   │   └── src_postgres_app.yml         # Application DB source: users, orders, events
│   │   │   ├── stripe/
│   │   │   │   ├── stg_stripe__charges.sql      # Rename, cast, dedup raw stripe.charges
│   │   │   │   ├── stg_stripe__customers.sql    # Rename, cast raw stripe.customers
│   │   │   │   └── stg_stripe__invoices.sql     # Rename, cast, add derived status field
│   │   │   ├── salesforce/
│   │   │   │   ├── stg_salesforce__accounts.sql      # CRM accounts normalised
│   │   │   │   ├── stg_salesforce__opportunities.sql  # Opp stage + amount normalised
│   │   │   │   └── stg_salesforce__contacts.sql       # Contacts with FK to accounts
│   │   │   └── app/
│   │   │       ├── stg_app__users.sql           # Users with parsed email domain, signup source
│   │   │       ├── stg_app__orders.sql          # Orders with line-item unnesting
│   │   │       └── stg_app__events.sql          # Event stream: page views, feature usage
│   │   ├── intermediate/
│   │   │   ├── int_customer_orders.sql          # Join stg_app__orders + stg_stripe__charges
│   │   │   ├── int_user_activity_sessions.sql   # Sessionise event stream (30-min gap rule)
│   │   │   ├── int_opportunity_stages.sql       # Salesforce stage history with lag columns
│   │   │   └── int_revenue_by_customer.sql      # Aggregate charges + invoices per customer_id
│   │   └── marts/
│   │       ├── core/
│   │       │   ├── schema.yml                   # Descriptions + tests for all core mart models
│   │       │   ├── dim_customers.sql            # SCD Type 1 customer dimension
│   │       │   ├── dim_products.sql             # Product catalogue dimension
│   │       │   ├── fct_orders.sql               # Order grain fact table (one row per order)
│   │       │   └── fct_revenue.sql              # Revenue grain (one row per charge/invoice line)
│   │       ├── finance/
│   │       │   ├── schema.yml                   # Finance mart descriptions + tests
│   │       │   ├── fct_mrr.sql                  # Monthly recurring revenue: expansion/contraction/churn
│   │       │   └── fct_invoices_reconciled.sql  # Stripe invoices matched to Salesforce opportunities
│   │       └── product/
│   │           ├── schema.yml                   # Product mart descriptions + tests
│   │           ├── fct_feature_adoption.sql     # Feature usage events pivoted to user-feature grain
│   │           └── fct_retention_cohorts.sql    # Weekly cohort retention matrix
│   ├── seeds/
│   │   ├── exchange_rates.csv                   # Static monthly FX rates for currency conversion
│   │   └── country_codes.csv                    # ISO 3166-1 alpha-2 to region mapping
│   └── tests/
│       ├── assert_fct_orders_no_negative_revenue.sql   # Custom singular test: revenue >= 0
│       ├── assert_mrr_reconciles_to_stripe.sql         # MRR total matches Stripe charges sum
│       └── assert_no_orphaned_order_customers.sql      # Every fct_orders customer_id in dim_customers
├── airflow/
│   ├── dags/
│   │   ├── ingest__stripe_daily.py              # Triggers Airbyte Stripe sync (daily 02:00 UTC)
│   │   ├── ingest__salesforce_daily.py          # Triggers Airbyte Salesforce sync (daily 03:00 UTC)
│   │   ├── transform__dbt_daily.py              # dbt run + dbt test full refresh (daily 05:00 UTC)
│   │   ├── transform__dbt_hourly_staging.py     # dbt run --select staging (hourly, incremental)
│   │   ├── quality__ge_mart_checks.py           # Great Expectations checkpoints after dbt run
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── dag_factory.py                   # build_dbt_dag() helper: shared retry + alert logic
│   │       └── slack_alerts.py                  # on_failure_callback: posts to #data-alerts channel
│   ├── plugins/
│   │   ├── __init__.py
│   │   ├── dbt_operator.py                      # DbtRunOperator, DbtTestOperator, DbtSourceFreshnessOperator
│   │   ├── airbyte_operator.py                  # AirbyteTriggerSyncOperator with polling + timeout
│   │   └── ge_operator.py                       # GreatExpectationsOperator wrapping GE checkpoint run
│   └── config/
│       ├── airflow.cfg                          # Core Airflow config (overridden by env vars in prod)
│       └── webserver_config.py                  # Auth backend config (Google OAuth or LDAP)
├── great_expectations/
│   ├── great_expectations.yml                   # GE project config: datasource, store backends
│   ├── expectations/
│   │   ├── dim_customers.json                   # Expectation suite for dim_customers mart
│   │   ├── fct_orders.json                      # Expectation suite for fct_orders mart
│   │   └── fct_mrr.json                         # Expectation suite for fct_mrr mart
│   └── checkpoints/
│       ├── dim_customers_checkpoint.yml         # Checkpoint: run dim_customers suite, store results
│       ├── fct_orders_checkpoint.yml            # Checkpoint: run fct_orders suite, store results
│       └── fct_mrr_checkpoint.yml               # Checkpoint: run fct_mrr suite, store results
├── airbyte/
│   ├── connections/
│   │   ├── stripe_to_postgres.json              # Airbyte connection config: source, dest, streams, schedule
│   │   ├── salesforce_to_postgres.json          # Airbyte connection config: Salesforce CRM sync
│   │   └── app_postgres_to_warehouse.json       # CDC from application DB to warehouse
│   └── README.md                                # How to apply connection configs via Airbyte API
├── scripts/
│   ├── seed_dev_data.sh                         # Load anonymised snapshots into dev warehouse
│   ├── backfill_date_range.py                   # Trigger dbt run over a historical date range
│   └── reconcile_stripe_mrr.sql                 # Ad-hoc MRR reconciliation against Stripe dashboard
├── docker/
│   ├── Dockerfile.airflow                       # Extends apache/airflow:2.9, installs dbt + GE
│   └── docker-compose.yml                       # Airflow webserver, scheduler, worker, triggerer, postgres, redis
├── .github/
│   └── workflows/                               # (see top of tree)
├── .env.example                                 # All env vars with descriptions (no real values)
├── .gitignore                                   # Excludes profiles.yml, .env, target/, logs/, __pycache__
├── Makefile                                     # Targets: dev, dbt-run, dbt-test, ge-check, lint, compile
└── requirements.txt                             # Top-level Python deps: apache-airflow, dbt-core, great_expectations
```

## Key files explained

| Path | Purpose |
|---|---|
| `dbt/dbt_project.yml` | Defines project name, dbt version pin, model paths, materialisation defaults per layer (staging=view, intermediate=ephemeral, marts=table), and `+schema` overrides per folder |
| `dbt/models/staging/_sources/src_stripe.yml` | Declares the raw Stripe source with table-level freshness thresholds (`warn_after: 24h`, `error_after: 48h`); referenced as `{{ source('stripe', 'charges') }}` in staging models |
| `dbt/models/marts/core/schema.yml` | Column-level descriptions and generic tests (`unique`, `not_null`, `relationships`, `accepted_values`) for all core mart models; drives dbt docs and data catalog |
| `airflow/dags/transform__dbt_daily.py` | Master daily DAG: waits for ingestion DAGs via ExternalTaskSensor, runs DbtRunOperator (full mart refresh), then DbtTestOperator, then triggers quality__ge_mart_checks DAG |
| `airflow/plugins/dbt_operator.py` | Custom `DbtRunOperator` and `DbtTestOperator`; reads `DBT_PROJECT_DIR`, `DBT_PROFILES_DIR`, `DBT_TARGET` from Airflow Variables; surfaces dbt exit codes as task failures |
| `great_expectations/expectations/fct_orders.json` | GE expectation suite for fct_orders: row count bounds, `order_id` uniqueness, `revenue_cents` non-negative, `customer_id` referential completeness, freshness of `order_date` |
| `.github/workflows/dbt-ci.yml` | On PR: checks out dbt state artifact from S3/GCS, runs `dbt compile`, runs `dbt test --select state:modified+ --defer --state ./state` to test only changed models and their downstream |
| `docker/docker-compose.yml` | Local Airflow stack: webserver on :8080, scheduler, worker (CeleryExecutor), triggerer, PostgreSQL 16 (metadata DB + dev warehouse), Redis 7 (Celery broker) |

## Quick scaffold

```bash
# Prerequisites: Python 3.11+, Docker, uv (pip install uv)
PROJECT=data-pipeline
mkdir -p $PROJECT && cd $PROJECT

# Python environment
uv init --python 3.11
uv add apache-airflow==2.9.* dbt-core==1.8.* dbt-postgres great_expectations==0.18.*

# dbt directory structure
mkdir -p dbt/models/staging/_sources
mkdir -p dbt/models/staging/stripe
mkdir -p dbt/models/staging/salesforce
mkdir -p dbt/models/staging/app
mkdir -p dbt/models/intermediate
mkdir -p dbt/models/marts/core
mkdir -p dbt/models/marts/finance
mkdir -p dbt/models/marts/product
mkdir -p dbt/macros
mkdir -p dbt/analyses
mkdir -p dbt/seeds
mkdir -p dbt/tests

# Airflow directory structure
mkdir -p airflow/dags/utils
mkdir -p airflow/plugins
mkdir -p airflow/config

# Great Expectations, Airbyte, scripts, docker, CI
mkdir -p great_expectations/expectations
mkdir -p great_expectations/checkpoints
mkdir -p airbyte/connections
mkdir -p scripts
mkdir -p docker
mkdir -p .github/workflows

# dbt project init
uv run dbt init dbt --skip-profile-setup 2>/dev/null || true

# Write dbt_project.yml
cat > dbt/dbt_project.yml << 'EOF'
name: 'data_pipeline'
version: '1.0.0'
config-version: 2
require-dbt-version: ">=1.8.0"

profile: 'data_pipeline'

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]

target-path: "target"
clean-targets: ["target", "dbt_packages"]

models:
  data_pipeline:
    staging:
      +materialized: view
      +schema: staging
    intermediate:
      +materialized: ephemeral
    marts:
      +materialized: table
      core:
        +schema: core
      finance:
        +schema: finance
      product:
        +schema: product
EOF

# Write packages.yml
cat > dbt/packages.yml << 'EOF'
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.2.0", "<2.0.0"]
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<1.0.0"]
  - package: elementary-data/elementary
    version: [">=0.14.0", "<1.0.0"]
EOF

# Touch key model files
touch dbt/models/staging/_sources/src_stripe.yml
touch dbt/models/staging/_sources/src_salesforce.yml
touch dbt/models/staging/_sources/src_postgres_app.yml
touch dbt/models/staging/stripe/stg_stripe__charges.sql
touch dbt/models/staging/stripe/stg_stripe__customers.sql
touch dbt/models/staging/stripe/stg_stripe__invoices.sql
touch dbt/models/staging/salesforce/stg_salesforce__accounts.sql
touch dbt/models/staging/salesforce/stg_salesforce__opportunities.sql
touch dbt/models/staging/app/stg_app__users.sql
touch dbt/models/staging/app/stg_app__orders.sql
touch dbt/models/intermediate/int_customer_orders.sql
touch dbt/models/intermediate/int_revenue_by_customer.sql
touch dbt/models/marts/core/schema.yml
touch dbt/models/marts/core/dim_customers.sql
touch dbt/models/marts/core/fct_orders.sql
touch dbt/models/marts/finance/fct_mrr.sql
touch dbt/models/marts/product/fct_feature_adoption.sql
touch dbt/macros/generate_schema_name.sql
touch dbt/macros/cents_to_dollars.sql
touch dbt/macros/safe_divide.sql
touch dbt/macros/surrogate_key_from_columns.sql
touch dbt/macros/current_timestamp_utc.sql
touch dbt/seeds/exchange_rates.csv
touch dbt/seeds/country_codes.csv

# Touch Airflow files
touch airflow/dags/ingest__stripe_daily.py
touch airflow/dags/ingest__salesforce_daily.py
touch airflow/dags/transform__dbt_daily.py
touch airflow/dags/transform__dbt_hourly_staging.py
touch airflow/dags/quality__ge_mart_checks.py
touch airflow/dags/utils/__init__.py
touch airflow/dags/utils/dag_factory.py
touch airflow/dags/utils/slack_alerts.py
touch airflow/plugins/__init__.py
touch airflow/plugins/dbt_operator.py
touch airflow/plugins/airbyte_operator.py
touch airflow/plugins/ge_operator.py

# Touch GE files
touch great_expectations/great_expectations.yml
touch great_expectations/expectations/dim_customers.json
touch great_expectations/expectations/fct_orders.json
touch great_expectations/expectations/fct_mrr.json
touch great_expectations/checkpoints/dim_customers_checkpoint.yml
touch great_expectations/checkpoints/fct_orders_checkpoint.yml
touch great_expectations/checkpoints/fct_mrr_checkpoint.yml

# Touch Airbyte connection configs
touch airbyte/connections/stripe_to_postgres.json
touch airbyte/connections/salesforce_to_postgres.json
touch airbyte/connections/app_postgres_to_warehouse.json

# Touch scripts
touch scripts/seed_dev_data.sh
touch scripts/backfill_date_range.py
touch scripts/reconcile_stripe_mrr.sql

# docker-compose for local Airflow
cat > docker/docker-compose.yml << 'EOF'
version: "3.9"
x-airflow-common: &airflow-common
  image: data-pipeline-airflow:local
  build:
    context: ..
    dockerfile: docker/Dockerfile.airflow
  environment:
    AIRFLOW__CORE__EXECUTOR: CeleryExecutor
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CELERY__BROKER_URL: redis://redis:6379/0
    AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    AIRFLOW__CORE__FERNET_KEY: "${AIRFLOW_FERNET_KEY}"
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: "true"
    AIRFLOW__CORE__LOAD_EXAMPLES: "false"
    DBT_PROJECT_DIR: /opt/airflow/dbt
    DBT_PROFILES_DIR: /opt/airflow/dbt
    DBT_TARGET: dev
  volumes:
    - ./airflow/dags:/opt/airflow/dags
    - ./airflow/plugins:/opt/airflow/plugins
    - ./airflow/logs:/opt/airflow/logs
    - ./dbt:/opt/airflow/dbt
    - ./great_expectations:/opt/airflow/great_expectations
  depends_on:
    postgres:
      condition: service_healthy
    redis:
      condition: service_healthy

services:
  webserver:
    <<: *airflow-common
    command: webserver
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 5

  scheduler:
    <<: *airflow-common
    command: scheduler

  worker:
    <<: *airflow-common
    command: celery worker

  triggerer:
    <<: *airflow-common
    command: triggerer

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U airflow"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
EOF

# Makefile
cat > Makefile << 'EOF'
.PHONY: dev dbt-run dbt-test dbt-compile dbt-docs ge-check lint seed airflow-init

dev:
	docker compose -f docker/docker-compose.yml up -d
	docker compose -f docker/docker-compose.yml exec webserver airflow db migrate
	docker compose -f docker/docker-compose.yml exec webserver airflow users create \
	  --username admin --password admin --firstname Admin --lastname User \
	  --role Admin --email admin@example.com

dbt-compile:
	cd dbt && dbt compile --target dev

dbt-run:
	cd dbt && dbt run --target dev

dbt-test:
	cd dbt && dbt test --target dev

dbt-run-select:
	cd dbt && dbt run --select $(MODEL) --target dev

dbt-source-freshness:
	cd dbt && dbt source freshness --target dev

dbt-docs:
	cd dbt && dbt docs generate --target dev && dbt docs serve

ge-check:
	uv run great_expectations checkpoint run dim_customers_checkpoint
	uv run great_expectations checkpoint run fct_orders_checkpoint
	uv run great_expectations checkpoint run fct_mrr_checkpoint

seed:
	cd dbt && dbt seed --target dev

install-deps:
	cd dbt && dbt deps

lint:
	uv run sqlfluff lint dbt/models/ --dialect postgres
	uv run ruff check airflow/

backfill:
	uv run python scripts/backfill_date_range.py --start $(START) --end $(END)
EOF

touch .env.example .gitignore requirements.txt

# .gitignore
cat > .gitignore << 'EOF'
# dbt
dbt/profiles.yml
dbt/target/
dbt/dbt_packages/
dbt/logs/

# Python
__pycache__/
*.pyc
.venv/
.env

# Airflow
airflow/logs/

# GE
great_expectations/uncommitted/

# Local
.DS_Store
EOF

# Install Claudient skills
npx claudient add skill data-ml/de/stakeholder-report
npx claudient add skill data-ml/dbt-model-builder
npx claudient add skill data-ml/ge-suite-authoring
npx claudient add skill data-ml/airflow-dag-builder
npx claudient add skill data-ml/sql-query-optimizer
npx claudient add skill git/pr-description
npx claudient add skill productivity/test-generator

echo "Data pipeline scaffold complete. Next steps:"
echo "  1. cp .env.example .env && fill in AIRFLOW_FERNET_KEY, WAREHOUSE_URL, etc."
echo "  2. Add warehouse credentials to dbt/profiles.yml (gitignored)"
echo "  3. make install-deps && make dev"
echo "  4. Open Airflow at http://localhost:8080"
```

## CLAUDE.md template

```markdown
# Data Pipeline — dbt + Airflow

Production ELT pipeline: Airbyte ingests raw data, dbt transforms it through staging →
intermediate → mart layers, Great Expectations validates mart quality, and Airflow
orchestrates the full daily and hourly schedule.

## Stack

- dbt Core 1.8+ (dbt-postgres adapter for local/staging, dbt-bigquery for prod)
- Apache Airflow 2.9+ (CeleryExecutor in prod, LocalExecutor in dev)
- PostgreSQL 16 (dev + staging warehouse) / BigQuery (production warehouse)
- Great Expectations 0.18+ — expectation suites per mart, run as Airflow tasks
- Airbyte 0.50+ — connection configs version-controlled in airbyte/connections/
- sqlfluff (SQL linting), ruff (Python linting for DAGs and plugins)

## Model Layer Conventions

Always follow the source → staging → intermediate → mart pattern. Never skip layers.

| Layer | Location | Materialisation | Rule |
|---|---|---|---|
| Staging | models/staging/<source>/ | view | One model per source table. Rename + cast + dedup only. No joins. |
| Intermediate | models/intermediate/ | ephemeral | Business logic joins. No direct source references — only staging refs. |
| Marts | models/marts/<domain>/ | table | Queryable by BI. dim_ prefix for dimensions, fct_ for facts. |

Naming pattern: `stg_<source>__<table>.sql` (double underscore separates source from table).
Examples: `stg_stripe__charges.sql`, `stg_salesforce__opportunities.sql`.

## Adding a New dbt Model (exact steps)

### 1. Declare the source (if new source table)

Add to `dbt/models/staging/_sources/src_<source>.yml`:

```yaml
sources:
  - name: stripe
    database: "{{ env_var('WAREHOUSE_DB') }}"
    schema: raw_stripe
    freshness:
      warn_after: {count: 24, period: hour}
      error_after: {count: 48, period: hour}
    tables:
      - name: charges
        loaded_at_field: created
```

### 2. Write the staging model

File: `dbt/models/staging/stripe/stg_stripe__charges.sql`

```sql
with source as (
    select * from {{ source('stripe', 'charges') }}
),
renamed as (
    select
        id                              as charge_id,
        customer                        as customer_id,
        amount                          as amount_cents,
        currency,
        status,
        cast(created as timestamp)      as created_at,
        _airbyte_extracted_at           as ingested_at
    from source
    where _airbyte_normalized_at is not null  -- exclude partial syncs
)
select * from renamed
```

### 3. Write the intermediate model (if needed)

File: `dbt/models/intermediate/int_customer_orders.sql`
- Reference only staging models: `{{ ref('stg_stripe__charges') }}`
- No direct `{{ source() }}` calls in intermediate layer

### 4. Write the mart model

File: `dbt/models/marts/core/fct_orders.sql`
- Reference intermediate or staging: `{{ ref('int_customer_orders') }}`
- Add a surrogate key: `{{ dbt_utils.generate_surrogate_key(['order_id', 'created_at']) }}`
- Document all columns in `dbt/models/marts/core/schema.yml`

### 5. Add tests to schema.yml

```yaml
models:
  - name: fct_orders
    description: "One row per order. Grain: order_id."
    columns:
      - name: order_id
        description: "Natural key from application DB."
        tests:
          - unique
          - not_null
      - name: revenue_cents
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
```

### 6. Run and test locally

```bash
# Compile to check syntax
make dbt-compile

# Run just your new model and its upstream dependencies
cd dbt && dbt run --select +fct_orders --target dev

# Run tests for your model
cd dbt && dbt test --select fct_orders --target dev

# Check source freshness
make dbt-source-freshness
```

## Running dbt Tests

```bash
# Run all tests
make dbt-test

# Run tests for a specific model
cd dbt && dbt test --select stg_stripe__charges --target dev

# Run tests for a model and all downstream
cd dbt && dbt test --select stg_stripe__charges+ --target dev

# Run only custom singular tests
cd dbt && dbt test --select test_type:singular --target dev

# Run only generic (schema) tests
cd dbt && dbt test --select test_type:generic --target dev

# CI mode: test only changed models and downstream
cd dbt && dbt test --select state:modified+ --defer --state ./state --target dev
```

## Authoring a Great Expectations Suite

Create a new suite for a mart that doesn't have one yet:

```bash
# Initialise a new suite interactively
uv run great_expectations suite new

# Or create programmatically:
uv run great_expectations suite edit fct_orders
```

Key expectations to always include per mart model:
- `expect_table_row_count_to_be_between` — set min based on known daily volume
- `expect_column_values_to_not_be_null` — all NOT NULL columns
- `expect_column_values_to_be_unique` — primary key column
- `expect_column_values_to_be_between` — monetary amounts (min=0)
- `expect_column_values_to_be_of_type` — critical type assertions

After writing the suite, create a checkpoint:

```yaml
# great_expectations/checkpoints/fct_orders_checkpoint.yml
name: fct_orders_checkpoint
config_version: 1
class_name: SimpleCheckpoint
validations:
  - batch_request:
      datasource_name: warehouse
      data_connector_name: default_inferred_data_connector_name
      data_asset_name: marts.core.fct_orders
    expectation_suite_name: fct_orders
```

Run it:
```bash
uv run great_expectations checkpoint run fct_orders_checkpoint
```

## DAG Naming Conventions

DAG ID format: `<domain>__<description>_<cadence>`
Examples:
- `ingest__stripe_daily` — Stripe Airbyte sync, runs daily
- `transform__dbt_daily` — Full dbt mart refresh, runs daily
- `transform__dbt_hourly_staging` — Staging models only, runs hourly
- `quality__ge_mart_checks` — GE checkpoints after dbt run

Rules:
- Domain prefix: `ingest`, `transform`, `quality`, `export`, `alert`
- Double underscore separates domain from description
- `_daily`, `_hourly`, `_weekly` suffix for scheduled DAGs
- Default retry: 2 retries, 5-minute delay, email_on_failure=False (use Slack callback)
- All DAGs must set `owner`, `start_date`, `tags` in `default_args`

Retry and alerting pattern in every DAG:

```python
from airflow.utils.dates import days_ago
from airflow.dags.utils.slack_alerts import task_fail_slack_alert

default_args = {
    "owner": "data-engineering",
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
    "on_failure_callback": task_fail_slack_alert,
    "email_on_failure": False,
}

with DAG(
    dag_id="transform__dbt_daily",
    default_args=default_args,
    schedule_interval="0 5 * * *",
    start_date=days_ago(1),
    catchup=False,
    tags=["dbt", "transform", "daily"],
) as dag:
    ...
```

## Deploy Workflow

On PR (dbt-ci.yml):
1. Checkout dbt state artifact from GCS/S3 (last prod run)
2. `dbt compile` — fail fast on syntax errors
3. `dbt test --select state:modified+ --defer --state ./state` — test changed + downstream only

On merge to main (deploy.yml):
1. `dbt run --target prod` — full mart refresh
2. `dbt test --target prod` — all tests on fresh data
3. `great_expectations checkpoint run` — all mart checkpoints
4. Upload new dbt state artifact to GCS/S3 (used by next PR CI run)
5. Trigger Airflow DAG via REST API to mark next scheduled run as unblocked

## Environment Variables

- `WAREHOUSE_URL` — `postgresql+psycopg2://user:pass@host/db` (dev/staging)
- `WAREHOUSE_DB` — database name (used in source declarations via env_var)
- `DBT_PROJECT_DIR` — absolute path to dbt/ directory
- `DBT_PROFILES_DIR` — directory containing profiles.yml (gitignored)
- `DBT_TARGET` — `dev`, `staging`, or `prod`
- `AIRFLOW_FERNET_KEY` — 32-byte URL-safe base64 key (generate: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`)
- `AIRBYTE_API_URL` — `http://localhost:8000` (dev) or production Airbyte host
- `AIRBYTE_API_KEY` — Airbyte workspace API token
- `SLACK_WEBHOOK_URL` — Incoming webhook for #data-alerts channel
- `GE_DATA_DOCS_SITE` — S3/GCS URL where GE data docs are published

## What Not To Do

- Do not use `{{ source() }}` in intermediate or mart models — only in staging
- Do not write joins in staging models — one source table in, one staging model out
- Do not skip writing schema.yml entries for mart columns — docs and tests both require them
- Do not add `LIMIT` to mart models — use dbt variables for dev sampling if needed
- Do not name DAGs with spaces or CamelCase — always snake_case with domain__ prefix
- Do not hardcode warehouse credentials in profiles.yml — use env_var() calls
- Do not run `dbt run --full-refresh` in prod without an incident channel message first
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/data-pipeline"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${WAREHOUSE_URL}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@motherduck/mcp-server-motherduck"],
      "env": {
        "motherduck_token": "${MOTHERDUCK_TOKEN}"
      }
    },
    "airflow": {
      "command": "npx",
      "args": ["-y", "@apache-airflow/mcp-server"],
      "env": {
        "AIRFLOW_BASE_URL": "${AIRFLOW_API_URL}",
        "AIRFLOW_USERNAME": "${AIRFLOW_USERNAME}",
        "AIRFLOW_PASSWORD": "${AIRFLOW_PASSWORD}"
      }
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == *.sql ]]; then uv run sqlfluff fix --dialect postgres \"$FILE\" 2>/dev/null || true; fi; if [[ \"$FILE\" == *.py ]] && echo \"$FILE\" | grep -q \"airflow/\"; then uv run ruff format \"$FILE\" 2>/dev/null || true; uv run ruff check --fix \"$FILE\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"dbt run.*--full-refresh\"; then echo \"[HOOK] WARNING: --full-refresh will drop and recreate all tables. Confirm this is intentional for target: $(echo $CMD | grep -oP -- \"--target \\S+\" || echo dev).\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}/dbt\" 2>/dev/null || exit 0; SCHEMA_MISSING=$(find models/marts -name \"schema.yml\" | wc -l); MART_DIRS=$(find models/marts -mindepth 1 -maxdepth 1 -type d | wc -l); if [ \"$SCHEMA_MISSING\" -lt \"$MART_DIRS\" ]; then echo \"[Reminder] Some mart subdirectories are missing schema.yml — add column descriptions and tests before opening a PR.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill data-ml/dbt-model-builder
npx claudient add skill data-ml/ge-suite-authoring
npx claudient add skill data-ml/airflow-dag-builder
npx claudient add skill data-ml/sql-query-optimizer
npx claudient add skill data-ml/de/stakeholder-report
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill devops-infra/de/oncall-runbook
```

## Related

- [Data Engineering Guide](../guides/for-data-engineers.md)
- [dbt Model Development Workflow](../workflows/dbt-model-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
