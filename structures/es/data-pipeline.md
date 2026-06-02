# Data Pipeline (dbt + Airflow) — Estructura del Proyecto

> Para ingenieros de datos que mantienen un pipeline ELT en producción — optimizando el ciclo completo desde la ingesta sin procesar hasta las transformaciones con dbt hasta las tablas de marts validadas y listas para BI.

## Stack

- **Transformaciones:** dbt Core 1.8+ (Python 3.11+, adaptador dbt-postgres o dbt-bigquery)
- **Orquestación:** Apache Airflow 2.9+ (LocalExecutor para desarrollo, CeleryExecutor para producción)
- **Almacén de datos:** PostgreSQL 16 o BigQuery (adaptador intercambiable vía profiles.yml)
- **Ingesta:** Airbyte 0.50+ (configuraciones de conexión versionadas en airbyte/)
- **Calidad de datos:** Great Expectations 0.18+ (suites por mart, checkpoints en Airflow)
- **Operadores personalizados:** Python 3.11+ (plugins de Airflow con subclases BaseOperator)
- **Containerización:** Docker 25 + docker-compose v2 (webserver de Airflow, scheduler, worker, triggerer)
- **CI/CD:** GitHub Actions (compilación de dbt + tests en PR, despliegue en merge a main)
- **BI:** Metabase 0.49+ (lee del esquema mart; capa semántica vía exposiciones de dbt)
- **Gestión de secretos:** Conexiones y Variables de Airflow (producción); archivos .env (desarrollo local)

## Árbol de directorios

```
data-pipeline/
├── .github/
│   └── workflows/
│       ├── dbt-ci.yml                           # PR: dbt compile, dbt test --select state:modified+
│       └── deploy.yml                           # Merge a main: dbt run --target prod, checkpoints GE
├── dbt/
│   ├── dbt_project.yml                          # Nombre del proyecto, versión, rutas de modelos/tests/seeds, vars
│   ├── profiles.yml                             # Targets de dev/prod — NO COMMIT (en .gitignore)
│   ├── packages.yml                             # dbt-utils, dbt-expectations, elementary-data
│   ├── sources.yml                              # Declaraciones de fuentes de nivel superior (deprecado — mover a models/)
│   ├── analyses/
│   │   ├── cohort_retention.sql                 # Análisis ad-hoc compilado pero no materializado
│   │   └── revenue_reconciliation.sql           # Consulta de firma de finanzas ejecutada mensualmente
│   ├── macros/
│   │   ├── generate_schema_name.sql             # Anular nombres de esquema: prefijo env + esquema personalizado
│   │   ├── cents_to_dollars.sql                 # Macro de conversión de unidades monetarias
│   │   ├── safe_divide.sql                      # División con protección contra denominador cero
│   │   ├── surrogate_key_from_columns.sql       # Envuelve dbt_utils.generate_surrogate_key
│   │   └── current_timestamp_utc.sql            # Macro de marca de tiempo UTC agnóstica al adaptador
│   ├── models/
│   │   ├── staging/
│   │   │   ├── _sources/
│   │   │   │   ├── src_stripe.yml               # Fuente Stripe: tablas, columnas, verificaciones de frescura
│   │   │   │   ├── src_salesforce.yml           # Fuente Salesforce: cuentas, oportunidades, contactos
│   │   │   │   └── src_postgres_app.yml         # Fuente de BD de aplicación: usuarios, órdenes, eventos
│   │   │   ├── stripe/
│   │   │   │   ├── stg_stripe__charges.sql      # Renombrar, castear, deduplicar stripe.charges sin procesar
│   │   │   │   ├── stg_stripe__customers.sql    # Renombrar, castear stripe.customers sin procesar
│   │   │   │   └── stg_stripe__invoices.sql     # Renombrar, castear, agregar campo de estado derivado
│   │   │   ├── salesforce/
│   │   │   │   ├── stg_salesforce__accounts.sql      # Cuentas CRM normalizadas
│   │   │   │   ├── stg_salesforce__opportunities.sql  # Etapa de oportunidad + cantidad normalizada
│   │   │   │   └── stg_salesforce__contacts.sql       # Contactos con FK a cuentas
│   │   │   └── app/
│   │   │       ├── stg_app__users.sql           # Usuarios con dominio de correo analizado, origen de registro
│   │   │       ├── stg_app__orders.sql          # Órdenes con anidación de elementos de línea
│   │   │       └── stg_app__events.sql          # Stream de eventos: vistas de página, uso de características
│   │   ├── intermediate/
│   │   │   ├── int_customer_orders.sql          # Unir stg_app__orders + stg_stripe__charges
│   │   │   ├── int_user_activity_sessions.sql   # Sesionizar stream de eventos (regla de brecha de 30 min)
│   │   │   ├── int_opportunity_stages.sql       # Historial de etapas de Salesforce con columnas de lag
│   │   │   └── int_revenue_by_customer.sql      # Agregar cargos + facturas por customer_id
│   │   └── marts/
│   │       ├── core/
│   │       │   ├── schema.yml                   # Descripciones + tests para todos los modelos de mart core
│   │       │   ├── dim_customers.sql            # Dimensión de cliente SCD Tipo 1
│   │       │   ├── dim_products.sql             # Dimensión de catálogo de productos
│   │       │   ├── fct_orders.sql               # Tabla de hechos de orden (una fila por orden)
│   │       │   └── fct_revenue.sql              # Grano de ingresos (una fila por línea de cargo/factura)
│   │       ├── finance/
│   │       │   ├── schema.yml                   # Descripciones y tests de mart de finanzas
│   │       │   ├── fct_mrr.sql                  # Ingresos recurrentes mensuales: expansión/contracción/churn
│   │       │   └── fct_invoices_reconciled.sql  # Facturas Stripe emparejadas con oportunidades Salesforce
│   │       └── product/
│   │           ├── schema.yml                   # Descripciones y tests de mart de producto
│   │           ├── fct_feature_adoption.sql     # Eventos de uso de características pivotados a grano usuario-característica
│   │           └── fct_retention_cohorts.sql    # Matriz de retención de cohortes semanales
│   ├── seeds/
│   │   ├── exchange_rates.csv                   # Tasas de cambio FX estáticas mensuales para conversión de moneda
│   │   └── country_codes.csv                    # Mapeo ISO 3166-1 alfa-2 a región
│   └── tests/
│       ├── assert_fct_orders_no_negative_revenue.sql   # Test singular personalizado: ingresos >= 0
│       ├── assert_mrr_reconciles_to_stripe.sql         # Total MRR coincide con suma de cargos Stripe
│       └── assert_no_orphaned_order_customers.sql      # Cada customer_id en fct_orders está en dim_customers
├── airflow/
│   ├── dags/
│   │   ├── ingest__stripe_daily.py              # Disparar sincronización Airbyte Stripe (diariamente 02:00 UTC)
│   │   ├── ingest__salesforce_daily.py          # Disparar sincronización Airbyte Salesforce (diariamente 03:00 UTC)
│   │   ├── transform__dbt_daily.py              # dbt run + dbt test actualización completa (diariamente 05:00 UTC)
│   │   ├── transform__dbt_hourly_staging.py     # dbt run --select staging (por hora, incremental)
│   │   ├── quality__ge_mart_checks.py           # Checkpoints de Great Expectations después de dbt run
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── dag_factory.py                   # Helper build_dbt_dag(): lógica compartida de reintentos + alertas
│   │       └── slack_alerts.py                  # on_failure_callback: publica en canal #data-alerts
│   ├── plugins/
│   │   ├── __init__.py
│   │   ├── dbt_operator.py                      # DbtRunOperator, DbtTestOperator, DbtSourceFreshnessOperator
│   │   ├── airbyte_operator.py                  # AirbyteTriggerSyncOperator con polling + timeout
│   │   └── ge_operator.py                       # GreatExpectationsOperator envolviendo ejecución de checkpoint GE
│   └── config/
│       ├── airflow.cfg                          # Configuración Airflow core (anulada por vars de entorno en prod)
│       └── webserver_config.py                  # Configuración de backend de autenticación (Google OAuth o LDAP)
├── great_expectations/
│   ├── great_expectations.yml                   # Configuración de proyecto GE: datasource, almacenes de respaldo
│   ├── expectations/
│   │   ├── dim_customers.json                   # Suite de expectativas para mart dim_customers
│   │   ├── fct_orders.json                      # Suite de expectativas para mart fct_orders
│   │   └── fct_mrr.json                         # Suite de expectativas para mart fct_mrr
│   └── checkpoints/
│       ├── dim_customers_checkpoint.yml         # Checkpoint: ejecutar suite dim_customers, almacenar resultados
│       ├── fct_orders_checkpoint.yml            # Checkpoint: ejecutar suite fct_orders, almacenar resultados
│       └── fct_mrr_checkpoint.yml               # Checkpoint: ejecutar suite fct_mrr, almacenar resultados
├── airbyte/
│   ├── connections/
│   │   ├── stripe_to_postgres.json              # Configuración de conexión Airbyte: fuente, destino, streams, programación
│   │   ├── salesforce_to_postgres.json          # Configuración de conexión Airbyte: sincronización CRM Salesforce
│   │   └── app_postgres_to_warehouse.json       # CDC desde BD de aplicación a almacén de datos
│   └── README.md                                # Cómo aplicar configuraciones de conexión vía API de Airbyte
├── scripts/
│   ├── seed_dev_data.sh                         # Cargar snapshots anonimizadas en almacén de datos de desarrollo
│   ├── backfill_date_range.py                   # Disparar dbt run en un rango de fechas histórico
│   └── reconcile_stripe_mrr.sql                 # Reconciliación MRR ad-hoc contra panel de Stripe
├── docker/
│   ├── Dockerfile.airflow                       # Extiende apache/airflow:2.9, instala dbt + GE
│   └── docker-compose.yml                       # Webserver Airflow, scheduler, worker, triggerer, postgres, redis
├── .github/
│   └── workflows/                               # (ver arriba en el árbol)
├── .env.example                                 # Todas las vars de entorno con descripciones (sin valores reales)
├── .gitignore                                   # Excluye profiles.yml, .env, target/, logs/, __pycache__
├── Makefile                                     # Targets: dev, dbt-run, dbt-test, ge-check, lint, compile
└── requirements.txt                             # Deps Python de nivel superior: apache-airflow, dbt-core, great_expectations
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `dbt/dbt_project.yml` | Define nombre del proyecto, pin de versión dbt, rutas de modelos, materializaciones predeterminadas por capa (staging=view, intermediate=ephemeral, marts=table), y anulaciones `+schema` por carpeta |
| `dbt/models/staging/_sources/src_stripe.yml` | Declara la fuente Stripe sin procesar con umbrales de frescura a nivel de tabla (`warn_after: 24h`, `error_after: 48h`); referenciada como `{{ source('stripe', 'charges') }}` en modelos de staging |
| `dbt/models/marts/core/schema.yml` | Descripciones a nivel de columna y tests genéricos (`unique`, `not_null`, `relationships`, `accepted_values`) para todos los modelos core mart; impulsa documentos dbt y catálogo de datos |
| `airflow/dags/transform__dbt_daily.py` | DAG diario maestro: espera DAGs de ingesta vía ExternalTaskSensor, ejecuta DbtRunOperator (actualización de mart completa), luego DbtTestOperator, luego dispara DAG quality__ge_mart_checks |
| `airflow/plugins/dbt_operator.py` | `DbtRunOperator` y `DbtTestOperator` personalizados; lee `DBT_PROJECT_DIR`, `DBT_PROFILES_DIR`, `DBT_TARGET` desde Variables de Airflow; expone códigos de salida dbt como fallos de tarea |
| `great_expectations/expectations/fct_orders.json` | Suite de expectativas GE para fct_orders: límites de conteo de filas, unicidad de `order_id`, no negatividad de `revenue_cents`, completitud referencial de `customer_id`, frescura de `order_date` |
| `.github/workflows/dbt-ci.yml` | En PR: revisa artefacto de estado dbt desde S3/GCS, ejecuta `dbt compile`, ejecuta `dbt test --select state:modified+ --defer --state ./state` para testear solo modelos cambiados y downstream |
| `docker/docker-compose.yml` | Stack Airflow local: webserver en :8080, scheduler, worker (CeleryExecutor), triggerer, PostgreSQL 16 (BD de metadatos + almacén de desarrollo), Redis 7 (broker Celery) |

## Andamiaje rápido

```bash
# Requisitos previos: Python 3.11+, Docker, uv (pip install uv)
PROJECT=data-pipeline
mkdir -p $PROJECT && cd $PROJECT

# Entorno Python
uv init --python 3.11
uv add apache-airflow==2.9.* dbt-core==1.8.* dbt-postgres great_expectations==0.18.*

# Estructura de directorios dbt
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

# Estructura de directorios Airflow
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

# Inicialización de proyecto dbt
uv run dbt init dbt --skip-profile-setup 2>/dev/null || true

# Escribir dbt_project.yml
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

# Escribir packages.yml
cat > dbt/packages.yml << 'EOF'
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.2.0", "<2.0.0"]
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<1.0.0"]
  - package: elementary-data/elementary
    version: [">=0.14.0", "<1.0.0"]
EOF

# Tocar archivos de modelos clave
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

# Tocar archivos de Airflow
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

# Tocar archivos GE
touch great_expectations/great_expectations.yml
touch great_expectations/expectations/dim_customers.json
touch great_expectations/expectations/fct_orders.json
touch great_expectations/expectations/fct_mrr.json
touch great_expectations/checkpoints/dim_customers_checkpoint.yml
touch great_expectations/checkpoints/fct_orders_checkpoint.yml
touch great_expectations/checkpoints/fct_mrr_checkpoint.yml

# Tocar configuraciones de conexión Airbyte
touch airbyte/connections/stripe_to_postgres.json
touch airbyte/connections/salesforce_to_postgres.json
touch airbyte/connections/app_postgres_to_warehouse.json

# Tocar scripts
touch scripts/seed_dev_data.sh
touch scripts/backfill_date_range.py
touch scripts/reconcile_stripe_mrr.sql

# docker-compose para Airflow local
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

# Instalar skills de Claudient
npx claudient add skill data-ml/de/stakeholder-report
npx claudient add skill data-ml/dbt-model-builder
npx claudient add skill data-ml/ge-suite-authoring
npx claudient add skill data-ml/airflow-dag-builder
npx claudient add skill data-ml/sql-query-optimizer
npx claudient add skill git/pr-description
npx claudient add skill productivity/test-generator

echo "Andamiaje de data pipeline completado. Próximos pasos:"
echo "  1. cp .env.example .env && rellena AIRFLOW_FERNET_KEY, WAREHOUSE_URL, etc."
echo "  2. Agregar credenciales de almacén a dbt/profiles.yml (gitignored)"
echo "  3. make install-deps && make dev"
echo "  4. Abrir Airflow en http://localhost:8080"
```

## Plantilla CLAUDE.md

```markdown
# Data Pipeline — dbt + Airflow

Pipeline ELT en producción: Airbyte ingesta datos sin procesar, dbt los transforma a través de capas
staging → intermediate → mart, Great Expectations valida la calidad de mart, y Airflow
orquesta la programación diaria y por hora completa.

## Stack

- dbt Core 1.8+ (adaptador dbt-postgres para local/staging, dbt-bigquery para prod)
- Apache Airflow 2.9+ (CeleryExecutor en prod, LocalExecutor en dev)
- PostgreSQL 16 (almacén de datos de desarrollo + staging) / BigQuery (almacén de datos de producción)
- Great Expectations 0.18+ — suites de expectativas por mart, ejecutadas como tareas de Airflow
- Airbyte 0.50+ — configuraciones de conexión versionadas en airbyte/connections/
- sqlfluff (SQL linting), ruff (Python linting para DAGs y plugins)

## Convenciones de Capa de Modelo

Siempre sigue el patrón source → staging → intermediate → mart. Nunca saltees capas.

| Capa | Ubicación | Materialización | Regla |
|---|---|---|---|
| Staging | models/staging/<source>/ | view | Un modelo por tabla de fuente. Solo renombrar + castear + deduplicar. Sin uniones. |
| Intermediate | models/intermediate/ | ephemeral | Uniones de lógica de negocio. Sin referencias directas a fuentes — solo referencias a staging. |
| Marts | models/marts/<domain>/ | table | Consultable por BI. Prefijo dim_ para dimensiones, fct_ para hechos. |

Patrón de nombres: `stg_<source>__<table>.sql` (doble guion bajo separa fuente de tabla).
Ejemplos: `stg_stripe__charges.sql`, `stg_salesforce__opportunities.sql`.

## Agregar un Nuevo Modelo dbt (pasos exactos)

### 1. Declarar la fuente (si tabla de fuente nueva)

Agregar a `dbt/models/staging/_sources/src_<source>.yml`:

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

### 2. Escribir el modelo de staging

Archivo: `dbt/models/staging/stripe/stg_stripe__charges.sql`

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

### 3. Escribir el modelo intermedio (si es necesario)

Archivo: `dbt/models/intermediate/int_customer_orders.sql`
- Referenciar solo modelos de staging: `{{ ref('stg_stripe__charges') }}`
- Sin llamadas a `{{ source() }}` en la capa intermedia

### 4. Escribir el modelo de mart

Archivo: `dbt/models/marts/core/fct_orders.sql`
- Referenciar intermedio o staging: `{{ ref('int_customer_orders') }}`
- Agregar una clave sustituta: `{{ dbt_utils.generate_surrogate_key(['order_id', 'created_at']) }}`
- Documentar todas las columnas en `dbt/models/marts/core/schema.yml`

### 5. Agregar tests a schema.yml

```yaml
models:
  - name: fct_orders
    description: "Una fila por orden. Grano: order_id."
    columns:
      - name: order_id
        description: "Clave natural desde BD de aplicación."
        tests:
          - unique
          - not_null
      - name: revenue_cents
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
```

### 6. Ejecutar y testear localmente

```bash
# Compilar para verificar sintaxis
make dbt-compile

# Ejecutar solo tu nuevo modelo y sus dependencias ascendentes
cd dbt && dbt run --select +fct_orders --target dev

# Ejecutar tests para tu modelo
cd dbt && dbt test --select fct_orders --target dev

# Verificar frescura de fuente
make dbt-source-freshness
```

## Ejecutar Tests de dbt

```bash
# Ejecutar todos los tests
make dbt-test

# Ejecutar tests para un modelo específico
cd dbt && dbt test --select stg_stripe__charges --target dev

# Ejecutar tests para un modelo y todos los downstream
cd dbt && dbt test --select stg_stripe__charges+ --target dev

# Ejecutar solo tests singulares personalizados
cd dbt && dbt test --select test_type:singular --target dev

# Ejecutar solo tests genéricos (schema)
cd dbt && dbt test --select test_type:generic --target dev

# Modo CI: testear solo modelos cambiados y downstream
cd dbt && dbt test --select state:modified+ --defer --state ./state --target dev
```

## Autorizar una Suite de Great Expectations

Crear una nueva suite para un mart que no tenga una aún:

```bash
# Inicializar una nueva suite interactivamente
uv run great_expectations suite new

# O crear programáticamente:
uv run great_expectations suite edit fct_orders
```

Expectativas clave a incluir siempre por modelo de mart:
- `expect_table_row_count_to_be_between` — establecer mínimo basado en volumen diario conocido
- `expect_column_values_to_not_be_null` — todas las columnas NOT NULL
- `expect_column_values_to_be_unique` — columna de clave principal
- `expect_column_values_to_be_between` — montos monetarios (mín=0)
- `expect_column_values_to_be_of_type` — aserciones de tipo críticas

Después de escribir la suite, crear un checkpoint:

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

Ejecutarlo:
```bash
uv run great_expectations checkpoint run fct_orders_checkpoint
```

## Convenciones de Nombres de DAG

Formato de ID de DAG: `<domain>__<description>_<cadence>`
Ejemplos:
- `ingest__stripe_daily` — Sincronización Airbyte Stripe, se ejecuta diariamente
- `transform__dbt_daily` — Actualización de mart dbt completa, se ejecuta diariamente
- `transform__dbt_hourly_staging` — Solo modelos de staging, se ejecuta por hora
- `quality__ge_mart_checks` — Checkpoints GE después de dbt run

Reglas:
- Prefijo de dominio: `ingest`, `transform`, `quality`, `export`, `alert`
- Doble guion bajo separa dominio de descripción
- Sufijo `_daily`, `_hourly`, `_weekly` para DAGs programados
- Reintentos predeterminados: 2 reintentos, 5 minutos de retraso, email_on_failure=False (usar callback Slack)
- Todos los DAGs deben establecer `owner`, `start_date`, `tags` en `default_args`

Patrón de reintentos y alertas en cada DAG:

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

## Flujo de Trabajo de Despliegue

En PR (dbt-ci.yml):
1. Revisar artefacto de estado dbt desde GCS/S3 (última ejecución en prod)
2. `dbt compile` — fallar rápido en errores de sintaxis
3. `dbt test --select state:modified+ --defer --state ./state` — testear solo cambiados + downstream

En merge a main (deploy.yml):
1. `dbt run --target prod` — actualización de mart completa
2. `dbt test --target prod` — todos los tests en datos frescos
3. `great_expectations checkpoint run` — todos los checkpoints de mart
4. Subir nuevo artefacto de estado dbt a GCS/S3 (usado por siguiente ejecución CI de PR)
5. Disparar DAG de Airflow vía API REST para marcar siguiente ejecución programada como desbloqueada

## Variables de Entorno

- `WAREHOUSE_URL` — `postgresql+psycopg2://user:pass@host/db` (dev/staging)
- `WAREHOUSE_DB` — nombre de base de datos (usado en declaraciones de fuentes vía env_var)
- `DBT_PROJECT_DIR` — ruta absoluta al directorio dbt/
- `DBT_PROFILES_DIR` — directorio conteniendo profiles.yml (gitignored)
- `DBT_TARGET` — `dev`, `staging`, o `prod`
- `AIRFLOW_FERNET_KEY` — clave base64 segura para URL de 32 bytes (generar: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`)
- `AIRBYTE_API_URL` — `http://localhost:8000` (dev) o host de Airbyte de producción
- `AIRBYTE_API_KEY` — token de API de espacio de trabajo de Airbyte
- `SLACK_WEBHOOK_URL` — Webhook entrante para canal #data-alerts
- `GE_DATA_DOCS_SITE` — URL de S3/GCS donde se publican documentos de datos GE

## Qué No Hacer

- No usar `{{ source() }}` en modelos intermedios o de mart — solo en staging
- No escribir uniones en modelos de staging — una tabla de fuente adentro, un modelo de staging afuera
- No saltear escribir entradas schema.yml para columnas de mart — documentos y tests requieren ambos
- No agregar `LIMIT` a modelos de mart — usar variables dbt para muestreo de dev si es necesario
- No nombrar DAGs con espacios o CamelCase — siempre snake_case con prefijo domain__
- No codificar credenciales de almacén en profiles.yml — usar llamadas env_var()
- No ejecutar `dbt run --full-refresh` en prod sin un mensaje de canal de incidente primero
```

## Servidores MCP

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

## Hooks recomendados

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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"dbt run.*--full-refresh\"; then echo \"[HOOK] ADVERTENCIA: --full-refresh eliminará y recreará todas las tablas. Confirma que esto es intencional para target: $(echo $CMD | grep -oP -- \"--target \\S+\" || echo dev).\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}/dbt\" 2>/dev/null || exit 0; SCHEMA_MISSING=$(find models/marts -name \"schema.yml\" | wc -l); MART_DIRS=$(find models/marts -mindepth 1 -maxdepth 1 -type d | wc -l); if [ \"$SCHEMA_MISSING\" -lt \"$MART_DIRS\" ]; then echo \"[Recordatorio] Algunos subdirectorios de mart carecen de schema.yml — agrega descripciones de columnas y tests antes de abrir un PR.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills a instalar

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

## Relacionados

- [Data Engineering Guide](../guides/for-data-engineers.md)
- [dbt Model Development Workflow](../workflows/dbt-model-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
