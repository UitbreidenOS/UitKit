> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../dbt-data-pipelines.md).

# dbt Data Pipelines Skill

## Wanneer te activeren
- dbt-modellen schrijven (staging-, intermediate-, mart-lagen)
- dbt-sources, refs en afhankelijkheden configureren
- dbt-tests schrijven (schema-tests, enkelvoudige tests, aangepaste generieke tests)
- dbt-projectstructuur instellen voor een nieuw data warehouse
- dbt-macro's schrijven voor herbruikbare SQL-logica
- dbt-documentatie en versheidscontroles configureren
- dbt-compilatiefouten of mislukte modeldraaiingen debuggen
- dbt instellen met BigQuery, Snowflake, Redshift, of DuckDB

## Wanneer NIET te gebruiken
- Ruwe ETL-pipelines zonder een warehouse (gebruik in plaats daarvan Airflow, Prefect of Dagster)
- Real-time streamingdata (dbt is alleen batch)
- Pandas/Polars in-memory-transformaties (gebruik de pandas-polars skill)
- Data-ingestie (dbt transformeert, het ingesteert niet)

## Instructies

### Projectlaagarchitectuur
Scheid modellen altijd in drie lagen:
```
models/
├── staging/          ← 1:1 met brontabellen. Alleen lichte opschoning. Geen joins.
│   ├── stg_orders.sql
│   └── stg_customers.sql
├── intermediate/     ← Bedrijfslogica. Joins toegestaan. Niet blootgesteld aan BI-tools.
│   └── int_orders_with_customers.sql
└── marts/            ← Definitieve bedrijfsentiteiten. Blootgesteld aan BI. Aggregaties hier.
    ├── finance/
    │   └── fct_revenue.sql
    └── marketing/
        └── dim_customers.sql
```

**Staging-regels:**
- Kolommen hernoemen naar projectconventies (snake_case)
- Typen expliciet casten
- Geen bedrijfslogica — geen joins, geen aggregaties
- Prefix met `stg_`

**Mart-regels:**
- `fct_`-prefix voor facttabellen (gebeurtenissen, transacties)
- `dim_`-prefix voor dimensietabellen (klanten, producten)
- Altijd documenteren in schema.yml

### Modelconfiguratie
```sql
-- models/marts/finance/fct_revenue.sql
{{
  config(
    materialized='incremental',
    unique_key='order_id',
    on_schema_change='fail'
  )
}}

with orders as (
    select * from {{ ref('int_orders_with_customers') }}
    {% if is_incremental() %}
    where created_at > (select max(created_at) from {{ this }})
    {% endif %}
)

select
    order_id,
    customer_id,
    amount,
    created_at
from orders
```

**Materialisatiekeuzes:**
- `view`: standaard — goed voor staging- en intermediate-modellen
- `table`: voor dure queries die vaak worden bevraagd
- `incremental`: voor grote facttabellen die in de loop der tijd groeien
- `ephemeral`: CTE's, niet gematerialiseerd — gebruik voor eenvoudige transformaties die eenmaal worden aangeroepen

### Testen — vereist op elk mart-model
```yaml
# models/marts/finance/schema.yml
version: 2

models:
  - name: fct_revenue
    description: "Eén rij per voltooide bestelling"
    columns:
      - name: order_id
        description: "Primaire sleutel"
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id
      - name: amount
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
```

Minimale tests op elk mart-model: `unique` + `not_null` op primaire sleutel, `not_null` op kritieke externe sleutels.

### Bronconfiguratie
```yaml
# models/staging/sources.yml
version: 2

sources:
  - name: raw_stripe
    database: raw
    schema: stripe
    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _ingested_at
    tables:
      - name: charges
        description: "Ruwe Stripe-charges van Fivetran"
```

Stel altijd `freshness` in op bronnen — verouderde brondata is een stille fout.

### Macro's voor herbruikbare logica
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name) %}
    ({{ column_name }} / 100.0)::numeric(10, 2)
{% endmacro %}

-- Gebruik in model
select
    {{ cents_to_dollars('amount_cents') }} as amount_dollars
from orders
```

## Voorbeeld

**Gebruiker:** Maak staging- en mart-modellen voor Stripe-betalingsdata (charges, refunds) met tests en versheidscontroles.

**Verwachte output:**
- `models/staging/stripe/sources.yml` — bron met versheidscontrole op `_ingested_at`
- `models/staging/stripe/stg_stripe_charges.sql` — hernoemen, casten, geen joins
- `models/staging/stripe/stg_stripe_refunds.sql` — zelfde patroon
- `models/marts/finance/fct_payments.sql` — join charges + refunds, nettobedrag, incrementele materialisatie
- `models/marts/finance/schema.yml` — `unique` + `not_null` op `charge_id`, relatietest op `customer_id`

---
