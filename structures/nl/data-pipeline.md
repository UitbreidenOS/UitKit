# Data Pipeline (dbt + Airflow) — Projectstructuur

> Voor data engineers die een productie ELT-pipeline onderhouden — optimalisatie van de volledige cyclus van ruwe opname via dbt-transformaties naar gevalideerde, BI-gereed marttabellen.

## Stack

- **Transformaties:** dbt Core 1.8+ (Python 3.11+, dbt-postgres of dbt-bigquery adapter)
- **Orchestratie:** Apache Airflow 2.9+ (LocalExecutor voor dev, CeleryExecutor voor prod)
- **Warehouse:** PostgreSQL 16 of BigQuery (adapter-verwisselbaar via profiles.yml)
- **Opname:** Airbyte 0.50+ (verbindingsconfiguraties versiebeheerd in airbyte/)
- **Datakwaliteit:** Great Expectations 0.18+ (suites per mart, Airflow-checkpoints)
- **Aangepaste operators:** Python 3.11+ (Airflow-plugins met BaseOperator-subklassen)
- **Containerisatie:** Docker 25 + docker-compose v2 (Airflow webserver, scheduler, worker, triggerer)
- **CI/CD:** GitHub Actions (dbt compile + test op PR, deploy op merge naar main)
- **BI:** Metabase 0.49+ (lezen vanaf martschema; semantische laag via dbt exposures)
- **Secretbeheer:** Airflow Connections + Variables (prod); .env-bestanden (lokale dev)

## Directoryboom

```
data-pipeline/
├── .github/
│   └── workflows/
│       ├── dbt-ci.yml                           # PR: dbt compile, dbt test --select state:modified+
│       └── deploy.yml                           # Merge naar main: dbt run --target prod, GE checkpoints
├── dbt/
│   ├── dbt_project.yml                          # Projectnaam, versie, model/test/seed paths, vars
│   ├── profiles.yml                             # dev/prod targets — NIET COMMITTEN (in .gitignore)
│   ├── packages.yml                             # dbt-utils, dbt-expectations, elementary-data
│   ├── sources.yml                              # Top-level sourceverklaringen (afgekeurd — naar models/ verplaatsen)
│   ├── analyses/
│   │   ├── cohort_retention.sql                 # Ad-hoc analyse gecompileerd maar niet gerealiseerd
│   │   └── revenue_reconciliation.sql           # Financieel goedkeuringszoekopdracht maandelijks
│   ├── macros/
│   │   ├── generate_schema_name.sql             # Schema-naamgeving overschrijven: env_prefix + custom_schema
│   │   ├── cents_to_dollars.sql                 # Conversie-macro voor geldeenheden
│   │   ├── safe_divide.sql                      # Deling met nul-noemer-beveiliging
│   │   ├── surrogate_key_from_columns.sql       # Omhulsel voor dbt_utils.generate_surrogate_key
│   │   └── current_timestamp_utc.sql            # Adapter-agnostieke UTC-timestamp-macro
│   ├── models/
│   │   ├── staging/
│   │   │   ├── _sources/
│   │   │   │   ├── src_stripe.yml               # Stripe-bron: tabellen, kolommen, versheidscontroles
│   │   │   │   ├── src_salesforce.yml           # Salesforce-bron: accounts, opportunities, contacts
│   │   │   │   └── src_postgres_app.yml         # Toepassingsdatabase-bron: users, orders, events
│   │   │   ├── stripe/
│   │   │   │   ├── stg_stripe__charges.sql      # Stripe.charges hernoemen, casten, dedupliceren
│   │   │   │   ├── stg_stripe__customers.sql    # Stripe.customers hernoemen, casten
│   │   │   │   └── stg_stripe__invoices.sql     # Hernoemen, casten, afgeleid statusveld toevoegen
│   │   │   ├── salesforce/
│   │   │   │   ├── stg_salesforce__accounts.sql      # CRM-accounts genormaliseerd
│   │   │   │   ├── stg_salesforce__opportunities.sql  # Opp stage + bedrag genormaliseerd
│   │   │   │   └── stg_salesforce__contacts.sql       # Contacten met FK naar accounts
│   │   │   └── app/
│   │   │       ├── stg_app__users.sql           # Gebruikers met geparst e-maildomein, aanmeldingsbron
│   │   │       ├── stg_app__orders.sql          # Bestellingen met regel-item uitpakken
│   │   │       └── stg_app__events.sql          # Eventstroom: paginaweergaven, functieverbruik
│   │   ├── intermediate/
│   │   │   ├── int_customer_orders.sql          # Deelnemen stg_app__orders + stg_stripe__charges
│   │   │   ├── int_user_activity_sessions.sql   # Sessiesering eventstroom (30-min gat-regel)
│   │   │   ├── int_opportunity_stages.sql       # Salesforce-stadium-geschiedenis met lag-kolommen
│   │   │   └── int_revenue_by_customer.sql      # Geaggregeerde kosten + facturen per customer_id
│   │   └── marts/
│   │       ├── core/
│   │       │   ├── schema.yml                   # Beschrijvingen + tests voor alle core mart-modellen
│   │       │   ├── dim_customers.sql            # SCD Type 1 klantendimensie
│   │       │   ├── dim_products.sql             # Productcatalogus-dimensie
│   │       │   ├── fct_orders.sql               # Bestelfeitentabel (een rij per bestelling)
│   │       │   └── fct_revenue.sql              # Revenue-korrelgrootte (een rij per ladings-/factuurregel)
│   │       ├── finance/
│   │       │   ├── schema.yml                   # Financiële mart-beschrijvingen + tests
│   │       │   ├── fct_mrr.sql                  # Maandelijks herhalende inkomsten: expansie/terugtrekking/churn
│   │       │   └── fct_invoices_reconciled.sql  # Stripe-facturen afgestemd op Salesforce-kansen
│   │       └── product/
│   │           ├── schema.yml                   # Product mart-beschrijvingen + tests
│   │           ├── fct_feature_adoption.sql     # Functiegebruiksgebeurtenissen gedraaid naar user-feature-korrelgrootte
│   │           └── fct_retention_cohorts.sql    # Wekelijkse cohort-retentiematrix
│   ├── seeds/
│   │   ├── exchange_rates.csv                   # Statische maandelijkse FX-koersen voor valutaomzetting
│   │   └── country_codes.csv                    # ISO 3166-1 alfa-2 naar regiomapping
│   └── tests/
│       ├── assert_fct_orders_no_negative_revenue.sql   # Aangepaste singuliere test: revenue >= 0
│       ├── assert_mrr_reconciles_to_stripe.sql         # MRR-totaal komt overeen met Stripe-kostenzom
│       └── assert_no_orphaned_order_customers.sql      # Elke fct_orders customer_id in dim_customers
├── airflow/
│   ├── dags/
│   │   ├── ingest__stripe_daily.py              # Activeert Airbyte Stripe-synchronisatie (dagelijks 02:00 UTC)
│   │   ├── ingest__salesforce_daily.py          # Activeert Airbyte Salesforce-synchronisatie (dagelijks 03:00 UTC)
│   │   ├── transform__dbt_daily.py              # dbt run + dbt test volledige vernieuwing (dagelijks 05:00 UTC)
│   │   ├── transform__dbt_hourly_staging.py     # dbt run --select staging (elk uur, incrementeel)
│   │   ├── quality__ge_mart_checks.py           # Great Expectations-checkpoints na dbt run
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── dag_factory.py                   # build_dbt_dag() helper: gedeelde retry + alert-logica
│   │       └── slack_alerts.py                  # on_failure_callback: post naar #data-alerts kanaal
│   ├── plugins/
│   │   ├── __init__.py
│   │   ├── dbt_operator.py                      # DbtRunOperator, DbtTestOperator, DbtSourceFreshnessOperator
│   │   ├── airbyte_operator.py                  # AirbyteTriggerSyncOperator met polling + timeout
│   │   └── ge_operator.py                       # GreatExpectationsOperator verpakt GE-checkpoint run
│   └── config/
│       ├── airflow.cfg                          # Core Airflow-config (overschreven door env vars in prod)
│       └── webserver_config.py                  # Auth backend-config (Google OAuth of LDAP)
├── great_expectations/
│   ├── great_expectations.yml                   # GE projectconfig: datasource, store backends
│   ├── expectations/
│   │   ├── dim_customers.json                   # Expectation suite voor dim_customers mart
│   │   ├── fct_orders.json                      # Expectation suite voor fct_orders mart
│   │   └── fct_mrr.json                         # Expectation suite voor fct_mrr mart
│   └── checkpoints/
│       ├── dim_customers_checkpoint.yml         # Checkpoint: voer dim_customers suite uit, sla resultaten op
│       ├── fct_orders_checkpoint.yml            # Checkpoint: voer fct_orders suite uit, sla resultaten op
│       └── fct_mrr_checkpoint.yml               # Checkpoint: voer fct_mrr suite uit, sla resultaten op
├── airbyte/
│   ├── connections/
│   │   ├── stripe_to_postgres.json              # Airbyte-verbindingsconfig: bron, bestemming, streams, planning
│   │   ├── salesforce_to_postgres.json          # Airbyte-verbindingsconfig: Salesforce CRM-synchronisatie
│   │   └── app_postgres_to_warehouse.json       # CDC van toepassingsdatabase naar warehouse
│   └── README.md                                # Hoe verbindingsconfigs toepassen via Airbyte API
├── scripts/
│   ├── seed_dev_data.sh                         # Geanonimiseerde snapshots in dev warehouse laden
│   ├── backfill_date_range.py                   # Activeert dbt run over historisch datumbereik
│   └── reconcile_stripe_mrr.sql                 # Ad-hoc MRR-afstemming tegen Stripe-dashboard
├── docker/
│   ├── Dockerfile.airflow                       # Breidt apache/airflow:2.9 uit, installeert dbt + GE
│   └── docker-compose.yml                       # Airflow webserver, scheduler, worker, triggerer, postgres, redis
├── .github/
│   └── workflows/                               # (zie bovenkant van boom)
├── .env.example                                 # Alle env vars met beschrijvingen (geen echte waarden)
├── .gitignore                                   # Sluit profiles.yml, .env, target/, logs/, __pycache__ uit
├── Makefile                                     # Targets: dev, dbt-run, dbt-test, ge-check, lint, compile
└── requirements.txt                             # Top-level Python-afhankelijkheden: apache-airflow, dbt-core, great_expectations
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `dbt/dbt_project.yml` | Definieert projectnaam, dbt versiepin, modelpaden, materializatiestandaarden per laag (staging=view, intermediate=ephemeral, marts=table), en `+schema` overschrijvingen per map |
| `dbt/models/staging/_sources/src_stripe.yml` | Verklaart de ruwe Stripe-bron met tabel-niveau versheidsdrempels (`warn_after: 24h`, `error_after: 48h`); waarnaar wordt verwezen als `{{ source('stripe', 'charges') }}` in staging-modellen |
| `dbt/models/marts/core/schema.yml` | Kolom-niveau beschrijvingen en generieke tests (`unique`, `not_null`, `relationships`, `accepted_values`) voor alle core mart-modellen; stuurt dbt docs en datacatalogus |
| `airflow/dags/transform__dbt_daily.py` | Master dagelijkse DAG: wacht op opname-DAG's via ExternalTaskSensor, voert DbtRunOperator uit (volledige mart-vernieuwing), daarna DbtTestOperator, activeert dan quality__ge_mart_checks DAG |
| `airflow/plugins/dbt_operator.py` | Aangepaste `DbtRunOperator` en `DbtTestOperator`; leest `DBT_PROJECT_DIR`, `DBT_PROFILES_DIR`, `DBT_TARGET` uit Airflow Variables; oppervlakkige dbt afsluitcodes als taakfouten |
| `great_expectations/expectations/fct_orders.json` | GE expectation suite voor fct_orders: rijtelcontour, `order_id` uniciteit, `revenue_cents` niet-negatief, `customer_id` referentiëlecompleteness, versheid van `order_date` |
| `.github/workflows/dbt-ci.yml` | Op PR: haalt dbt-state artefact uit S3/GCS, voert `dbt compile` uit, voert `dbt test --select state:modified+ --defer --state ./state` uit om alleen gewijzigde modellen en hun downstreamgegevens te testen |
| `docker/docker-compose.yml` | Lokale Airflow-stack: webserver op :8080, scheduler, worker (CeleryExecutor), triggerer, PostgreSQL 16 (metadata DB + dev warehouse), Redis 7 (Celery broker) |

## Snelle steiger

```bash
# Vereisten: Python 3.11+, Docker, uv (pip install uv)
PROJECT=data-pipeline
mkdir -p $PROJECT && cd $PROJECT

# Python-omgeving
uv init --python 3.11
uv add apache-airflow==2.9.* dbt-core==1.8.* dbt-postgres great_expectations==0.18.*

# dbt directorystructuur
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

# Airflow directorystructuur
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

# dbt project-initialisatie
uv run dbt init dbt --skip-profile-setup 2>/dev/null || true

# Schrijf dbt_project.yml
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

# Schrijf packages.yml
cat > dbt/packages.yml << 'EOF'
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.2.0", "<2.0.0"]
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<1.0.0"]
  - package: elementary-data/elementary
    version: [">=0.14.0", "<1.0.0"]
EOF

# Raak sleutelmodelbestanden aan
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

# Raak Airflow-bestanden aan
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

# Raak GE-bestanden aan
touch great_expectations/great_expectations.yml
touch great_expectations/expectations/dim_customers.json
touch great_expectations/expectations/fct_orders.json
touch great_expectations/expectations/fct_mrr.json
touch great_expectations/checkpoints/dim_customers_checkpoint.yml
touch great_expectations/checkpoints/fct_orders_checkpoint.yml
touch great_expectations/checkpoints/fct_mrr_checkpoint.yml

# Raak Airbyte-verbindingsconfigs aan
touch airbyte/connections/stripe_to_postgres.json
touch airbyte/connections/salesforce_to_postgres.json
touch airbyte/connections/app_postgres_to_warehouse.json

# Raak scripts aan
touch scripts/seed_dev_data.sh
touch scripts/backfill_date_range.py
touch scripts/reconcile_stripe_mrr.sql

# docker-compose voor lokale Airflow
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

# Installeer Claudient-vaardigheden
npx claudient add skill data-ml/de/stakeholder-report
npx claudient add skill data-ml/dbt-model-builder
npx claudient add skill data-ml/ge-suite-authoring
npx claudient add skill data-ml/airflow-dag-builder
npx claudient add skill data-ml/sql-query-optimizer
npx claudient add skill git/pr-description
npx claudient add skill productivity/test-generator

echo "Data pipeline steiger compleet. Volgende stappen:"
echo "  1. cp .env.example .env && vul AIRFLOW_FERNET_KEY, WAREHOUSE_URL, etc. in"
echo "  2. Voeg warehouse-geloofsbrieven toe aan dbt/profiles.yml (gitignored)"
echo "  3. make install-deps && make dev"
echo "  4. Open Airflow op http://localhost:8080"
```

## CLAUDE.md sjabloon

```markdown
# Data Pipeline — dbt + Airflow

Productie ELT-pipeline: Airbyte neemt ruwe gegevens op, dbt transformeert deze via staging →
intermediate → martlagen, Great Expectations valideert martkwaliteit, en Airflow
orchedestreert het volledige dagelijkse en uurlijkse schema.

## Stack

- dbt Core 1.8+ (dbt-postgres adapter voor lokale/staging, dbt-bigquery voor prod)
- Apache Airflow 2.9+ (CeleryExecutor in prod, LocalExecutor in dev)
- PostgreSQL 16 (dev + staging warehouse) / BigQuery (productie warehouse)
- Great Expectations 0.18+ — expectation suites per mart, uitgevoerd als Airflow-taken
- Airbyte 0.50+ — verbindingsconfigs versiebeheerd in airbyte/connections/
- sqlfluff (SQL-linting), ruff (Python-linting voor DAG's en plugins)

## Laagconventies voor modellen

Volg altijd het bron → staging → intermediate → mart patroon. Sla nooit lagen over.

| Laag | Locatie | Materialisatie | Regel |
|---|---|---|---|
| Staging | models/staging/<source>/ | view | Eén model per brontabel. Alleen hernoemen + casten + dedupliceren. Geen joins. |
| Intermediate | models/intermediate/ | ephemeral | Bedrijfslogica joins. Geen directe bronneverwijzingen — alleen staging refs. |
| Marts | models/marts/<domain>/ | table | Opvraagbaar door BI. dim_ voegvoegsel voor dimensies, fct_ voor feiten. |

Naampatroon: `stg_<source>__<table>.sql` (dubbel onderstrepingsteken scheidt bron van tabel).
Voorbeelden: `stg_stripe__charges.sql`, `stg_salesforce__opportunities.sql`.

## Een nieuw dbt-model toevoegen (exacte stappen)

### 1. Declareer de bron (als nieuwe brontabel)

Voeg toe aan `dbt/models/staging/_sources/src_<source>.yml`:

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

### 2. Schrijf het staging-model

Bestand: `dbt/models/staging/stripe/stg_stripe__charges.sql`

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

### 3. Schrijf het intermediate-model (indien nodig)

Bestand: `dbt/models/intermediate/int_customer_orders.sql`
- Verwijzing alleen naar staging-modellen: `{{ ref('stg_stripe__charges') }}`
- Geen directe `{{ source() }}` aanroepen in intermediate laag

### 4. Schrijf het mart-model

Bestand: `dbt/models/marts/core/fct_orders.sql`
- Verwijzing naar intermediate of staging: `{{ ref('int_customer_orders') }}`
- Voeg een surrogaatsleutel toe: `{{ dbt_utils.generate_surrogate_key(['order_id', 'created_at']) }}`
- Documenteer alle kolommen in `dbt/models/marts/core/schema.yml`

### 5. Voeg tests toe aan schema.yml

```yaml
models:
  - name: fct_orders
    description: "Één rij per bestelling. Korrelgrootte: order_id."
    columns:
      - name: order_id
        description: "Natuurlijke sleutel uit toepassingsdatabase."
        tests:
          - unique
          - not_null
      - name: revenue_cents
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
```

### 6. Voer uit en test lokaal

```bash
# Compileer om syntaxis te controleren
make dbt-compile

# Voer alleen uw nieuw model en de afhankelijkheden stroomopwaarts uit
cd dbt && dbt run --select +fct_orders --target dev

# Voer tests uit voor uw model
cd dbt && dbt test --select fct_orders --target dev

# Controleer bronversheid
make dbt-source-freshness
```

## dbt-tests uitvoeren

```bash
# Voer alle tests uit
make dbt-test

# Voer tests uit voor een specifiek model
cd dbt && dbt test --select stg_stripe__charges --target dev

# Voer tests uit voor een model en alle downstreamgegevens
cd dbt && dbt test --select stg_stripe__charges+ --target dev

# Voer alleen aangepaste singuliere tests uit
cd dbt && dbt test --select test_type:singular --target dev

# Voer alleen generieke (schema) tests uit
cd dbt && dbt test --select test_type:generic --target dev

# CI-modus: test alleen gewijzigde modellen en downstream
cd dbt && dbt test --select state:modified+ --defer --state ./state --target dev
```

## Een Great Expectations Suite schrijven

Maak een nieuwe suite voor een mart die er nog geen heeft:

```bash
# Initialiseer een nieuwe suite interactief
uv run great_expectations suite new

# Of maak programmatisch:
uv run great_expectations suite edit fct_orders
```

Sleutelexpectaties om altijd per mart-model op te nemen:
- `expect_table_row_count_to_be_between` — stel min in op basis van bekend dagelijks volume
- `expect_column_values_to_not_be_null` — alle NOT NULL kolommen
- `expect_column_values_to_be_unique` — primaire sleutelkolom
- `expect_column_values_to_be_between` — geldbedragen (min=0)
- `expect_column_values_to_be_of_type` — kritieke type-stellingen

Na het schrijven van de suite maakt u een checkpoint:

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

Voer het uit:
```bash
uv run great_expectations checkpoint run fct_orders_checkpoint
```

## DAG-naamgevingsconventies

DAG ID-indeling: `<domain>__<description>_<cadence>`
Voorbeelden:
- `ingest__stripe_daily` — Stripe Airbyte-synchronisatie, voert dagelijks uit
- `transform__dbt_daily` — Volledige dbt mart-vernieuwing, voert dagelijks uit
- `transform__dbt_hourly_staging` — Alleen staging-modellen, voert elk uur uit
- `quality__ge_mart_checks` — GE-checkpoints na dbt run

Regels:
- Domeinprefix: `ingest`, `transform`, `quality`, `export`, `alert`
- Dubbel onderstrepingsteken scheidt domein van beschrijving
- `_daily`, `_hourly`, `_weekly` achtervoegsel voor geplande DAG's
- Standaard retry: 2 pogingen, 5-minuten vertraging, email_on_failure=False (gebruik Slack callback)
- Alle DAG's moeten `owner`, `start_date`, `tags` instellen in `default_args`

Retry- en waarschuwingspatroon in elke DAG:

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

## Implementatiewerkstroom

Op PR (dbt-ci.yml):
1. Checkout dbt-state artefact uit GCS/S3 (laatste prod run)
2. `dbt compile` — mis snel op syntaxisfouten
3. `dbt test --select state:modified+ --defer --state ./state` — test alleen gewijzigde + downstream

Op merge naar main (deploy.yml):
1. `dbt run --target prod` — volledige mart-vernieuwing
2. `dbt test --target prod` — alle tests op verse gegevens
3. `great_expectations checkpoint run` — alle mart-checkpoints
4. Upload nieuwe dbt-state artefact naar GCS/S3 (gebruikt door volgende PR CI-run)
5. Activeert Airflow DAG via REST API om volgende geplande run als gedeblokkeerd te markeren

## Omgevingsvariabelen

- `WAREHOUSE_URL` — `postgresql+psycopg2://user:pass@host/db` (dev/staging)
- `WAREHOUSE_DB` — databasenaam (gebruikt in brondeclaraties via env_var)
- `DBT_PROJECT_DIR` — absoluut pad naar dbt/ directory
- `DBT_PROFILES_DIR` — directory met profiles.yml (gitignored)
- `DBT_TARGET` — `dev`, `staging`, of `prod`
- `AIRFLOW_FERNET_KEY` — 32-byte URL-veilige base64-sleutel (genereer: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`)
- `AIRBYTE_API_URL` — `http://localhost:8000` (dev) of productie Airbyte-host
- `AIRBYTE_API_KEY` — Airbyte workspace API-token
- `SLACK_WEBHOOK_URL` — Inkomende webhook voor #data-alerts kanaal
- `GE_DATA_DOCS_SITE` — S3/GCS URL waar GE data docs wordt gepubliceerd

## Wat u niet moet doen

- Gebruik niet `{{ source() }}` in intermediate of mart-modellen — alleen in staging
- Schrijf geen joins in staging-modellen — één brontabel in, één staging-model uit
- Sla schema.yml-items niet over voor mart-kolommen — docs en tests vereisen beide
- Voeg niet `LIMIT` toe aan mart-modellen — gebruik dbt-variabelen voor dev-sampling indien nodig
- Noem DAG's niet met spaties of CamelCase — altijd snake_case met domein__ voegvoegsel
- Codeer warehouse-geloofsbrieven niet hard in profiles.yml — gebruik env_var() aanroepen
- Voer `dbt run --full-refresh` niet uit in prod zonder eerst een incident kanaal bericht te sturen
```

## MCP-servers

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

## Aanbevolen hooks

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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"dbt run.*--full-refresh\"; then echo \"[HOOK] WAARSCHUWING: --full-refresh zal alle tabellen verwijderen en opnieuw maken. Bevestig dat dit opzettelijk is voor target: $(echo $CMD | grep -oP -- \"--target \\S+\" || echo dev).\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}/dbt\" 2>/dev/null || exit 0; SCHEMA_MISSING=$(find models/marts -name \"schema.yml\" | wc -l); MART_DIRS=$(find models/marts -mindepth 1 -maxdepth 1 -type d | wc -l); if [ \"$SCHEMA_MISSING\" -lt \"$MART_DIRS\" ]; then echo \"[Herinnering] Sommige mart-submappen missen schema.yml — voeg kolombeschrijvingen en tests toe voordat u een PR opent.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

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

## Gerelateerd

- [Data Engineering Guide](../guides/for-data-engineers.md)
- [dbt Model Development Workflow](../workflows/dbt-model-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
