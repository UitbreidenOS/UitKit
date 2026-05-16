> 🇳🇱 Nederlandse versie. [Engelse versie](../CLAUDE.md).

# CLAUDE.md — dbt Data Pipeline

Een productie-dbt-project voor het transformeren van ruwe data naar analysegeschikte tabellen. Volgt de medallion-architectuur (raw → staging → marts) met volledige testdekking en CI-integratie.

---

## Tech Stack

| Laag | Technologie |
|-------|-----------|
| Transformatie | dbt Core |
| Datawarehouse | Snowflake (of BigQuery / DuckDB voor lokaal gebruik) |
| Orkestratie | Airflow / Dagster / dbt Cloud |
| Testen | dbt tests + Great Expectations |
| Documentatie | dbt docs |
| CI | GitHub Actions + SQLFluff |

---

## Belangrijkste commando's

```bash
dbt debug                        # Verbinding testen
dbt run                          # Alle modellen uitvoeren
dbt run --select staging.*       # Één laag uitvoeren
dbt run --select +orders         # orders en alle upstream-modellen uitvoeren
dbt run --select orders+         # orders en alle downstream-modellen uitvoeren
dbt test                         # Alle tests uitvoeren
dbt test --select orders         # Één model testen
dbt build                        # run + test samen (voorkeur in CI)
dbt docs generate && dbt docs serve   # Documentatie genereren en bekijken
dbt source freshness             # Versheid van brondata controleren
sqlfluff lint models/            # SQL linten
```

---

## Projectstructuur

```
dbt_project/
├── dbt_project.yml              # Projectconfiguratie, modelconfiguraties per pad
├── profiles.yml                 # Verbindingsprofielen (gitignored — gebruik omgevingsvariabelen)
├── packages.yml                 # dbt Hub-pakketten
├── models/
│   ├── staging/                 # 1:1 met brontabellen, alleen lichte opschoning
│   │   ├── _sources.yml         # Brondefinities + versheidschecks
│   │   ├── _staging.yml         # Documentatie + tests van staging-modellen
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/            # Optioneel: complexe joins/pivots vóór marts
│   │   └── int_order_items.sql
│   └── marts/
│       ├── _marts.yml           # Mart-documentatie + tests
│       ├── core/
│       │   ├── dim_customers.sql
│       │   └── fct_orders.sql
│       └── finance/
│           └── fct_revenue.sql
├── tests/                       # Aangepaste enkelvoudige tests (SQL-bestanden)
├── macros/                      # Herbruikbare Jinja-macro's
├── seeds/                       # Statische CSV-opzoektabellen
├── snapshots/                   # Type 2 SCD-snapshots
└── analyses/                    # Ad-hoc analysequery's (niet gematerialiseerd)
```

---

## Modelconventies

### Staging-modellen — alleen lichte opschoning
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

### Feitentabel — bedrijfslogica hier
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

### YAML-testen en documentatie
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

### Bronversheid
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

### Macro's
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name, precision=2) %}
    round({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}

-- Usage in a model:
-- {{ cents_to_dollars('amount_cents') }} as amount_usd
```

---

## dbt_project.yml-configuratie

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
      +materialized: view          # Staging = views (goedkoop, altijd actueel)
      +schema: staging
    intermediate:
      +materialized: ephemeral     # Intermediate = ephemeral (geen tabel aangemaakt)
    marts:
      +materialized: table         # Marts = tabellen (snel te bevragen)
      +schema: marts
      core:
        fct_orders:
          +materialized: incremental
```

---

## Anti-patronen — Doe dit NIET

- **Plaats nooit bedrijfslogica in staging-modellen** — staging is uitsluitend voor hernoemen en casten
- **Gebruik nooit `SELECT *` in marts** — lijst kolommen altijd expliciet op
- **Join nooit in staging** — staging staat altijd 1:1 tegenover een brontabel
- **Sla nooit `unique`- + `not_null`-tests over op primaire sleutels** — elk model heeft deze twee minimaal nodig
- **Codeer datums nooit hard** — gebruik `current_date` of geef ze mee via dbt vars: `{{ var('start_date') }}`
- **Commit `profiles.yml` nooit** — gebruik omgevingsvariabelen: `DBT_ENV_SECRET_SNOWFLAKE_PASSWORD`
- **Gebruik nooit `dbt run` in CI** — gebruik `dbt build` (voert run + tests samen uit en mislukt snel)

---

## CI-pipeline (GitHub Actions)

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

## Een nieuw mart-model toevoegen

1. Maak `models/marts/<domein>/fct_<naam>.sql` of `dim_<naam>.sql` aan
2. Voeg het toe aan `models/marts/_marts.yml` met beschrijving + kolomtests
3. Voeg minimaal `unique` + `not_null` toe op de primaire sleutel
4. Voer `dbt build --select fct_<naam>` uit om lokaal te testen
5. Voer `dbt docs generate` uit om de documentatiesite bij te werken
