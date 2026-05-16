> 🇩🇪 Deutsche Version. [Englische Version](../CLAUDE.md).

# CLAUDE.md — dbt Data-Pipeline

Ein produktionsreifes dbt-Projekt zur Transformation von Rohdaten in analysebereit Tabellen. Folgt der Medallion-Architektur (raw → staging → marts) mit vollständiger Testabdeckung und CI-Integration.

---

## Tech-Stack

| Schicht | Technologie |
|---------|------------|
| Transformation | dbt Core |
| Data Warehouse | Snowflake (oder BigQuery / DuckDB für lokal) |
| Orchestrierung | Airflow / Dagster / dbt Cloud |
| Testing | dbt-Tests + Great Expectations |
| Dokumentation | dbt docs |
| CI | GitHub Actions + SQLFluff |

---

## Wichtige Befehle

```bash
dbt debug                        # Verbindung testen
dbt run                          # Alle Modelle ausführen
dbt run --select staging.*       # Eine Schicht ausführen
dbt run --select +orders         # orders und alle vorgelagerten Modelle ausführen
dbt run --select orders+         # orders und alle nachgelagerten Modelle ausführen
dbt test                         # Alle Tests ausführen
dbt test --select orders         # Ein Modell testen
dbt build                        # run + test zusammen (bevorzugt in CI)
dbt docs generate && dbt docs serve   # Dokumentation generieren und anzeigen
dbt source freshness             # Aktualität der Quelldaten prüfen
sqlfluff lint models/            # SQL linten
```

---

## Projektstruktur

```
dbt_project/
├── dbt_project.yml              # Projektkonfiguration, Modellkonfigurationen nach Pfad
├── profiles.yml                 # Verbindungsprofile (gitignored — Umgebungsvariablen verwenden)
├── packages.yml                 # dbt Hub-Pakete
├── models/
│   ├── staging/                 # 1:1 mit Quelltabellen, nur leichte Bereinigung
│   │   ├── _sources.yml         # Quelldefinitionen + Aktualitätsprüfungen
│   │   ├── _staging.yml         # Staging-Modell-Dokumentation + Tests
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/            # Optional: komplexe Joins/Pivots vor den Marts
│   │   └── int_order_items.sql
│   └── marts/
│       ├── _marts.yml           # Mart-Dokumentation + Tests
│       ├── core/
│       │   ├── dim_customers.sql
│       │   └── fct_orders.sql
│       └── finance/
│           └── fct_revenue.sql
├── tests/                       # Benutzerdefinierte Einzeltests (SQL-Dateien)
├── macros/                      # Wiederverwendbare Jinja-Makros
├── seeds/                       # Statische CSV-Nachschlagetabellen
├── snapshots/                   # Typ-2-SCD-Snapshots
└── analyses/                    # Ad-hoc-Analyseabfragen (nicht materialisiert)
```

---

## Modellkonventionen

### Staging-Modelle — nur leichte Bereinigung
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

### Faktentabelle — Geschäftslogik hier
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

### YAML-Tests und Dokumentation
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

### Aktualität der Quelldaten
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

### Makros
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name, precision=2) %}
    round({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}

-- Usage in a model:
-- {{ cents_to_dollars('amount_cents') }} as amount_usd
```

---

## dbt_project.yml-Konfiguration

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
      +materialized: view          # Staging = Views (günstig, immer aktuell)
      +schema: staging
    intermediate:
      +materialized: ephemeral     # Intermediate = ephemeral (keine Tabelle erstellt)
    marts:
      +materialized: table         # Marts = Tabellen (schnell abfragbar)
      +schema: marts
      core:
        fct_orders:
          +materialized: incremental
```

---

## Anti-Muster — NICHT tun

- **Niemals Geschäftslogik in Staging-Modelle einbauen** — Staging dient nur zum Umbenennen und Casten
- **Niemals `SELECT *` in Marts verwenden** — Spalten immer explizit auflisten
- **Niemals in Staging joinen** — Staging ist immer 1:1 mit einer Quelltabelle
- **Niemals `unique`- + `not_null`-Tests auf Primärschlüsseln weglassen** — jedes Modell benötigt mindestens diese zwei
- **Niemals Datumsangaben hardcoden** — `current_date` verwenden oder via dbt-Variablen übergeben: `{{ var('start_date') }}`
- **Niemals `profiles.yml` committen** — Umgebungsvariablen verwenden: `DBT_ENV_SECRET_SNOWFLAKE_PASSWORD`
- **Niemals `dbt run` in CI verwenden** — `dbt build` verwenden (führt Tests zusammen aus, schlägt schnell fehl)

---

## CI-Pipeline (GitHub Actions)

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

## Ein neues Mart-Modell hinzufügen

1. `models/marts/<domain>/fct_<name>.sql` oder `dim_<name>.sql` erstellen
2. Zu `models/marts/_marts.yml` mit Beschreibung und Spaltentests hinzufügen
3. Mindestens `unique` + `not_null` auf dem Primärschlüssel hinzufügen
4. `dbt build --select fct_<name>` ausführen, um lokal zu testen
5. `dbt docs generate` ausführen, um die Dokumentationsseite zu aktualisieren
