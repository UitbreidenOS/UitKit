> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../dbt-data-pipelines.md).

# dbt Data Pipelines Skill

## Wann aktivieren
- dbt-Modelle schreiben (Staging-, Intermediate-, Mart-Layer)
- dbt Sources, Refs und Abhängigkeiten konfigurieren
- dbt-Tests schreiben (Schema-Tests, singuläre Tests, benutzerdefinierte generische Tests)
- dbt-Projektstruktur für ein neues Data Warehouse einrichten
- dbt-Makros für wiederverwendbare SQL-Logik schreiben
- dbt-Dokumentation und Frische-Prüfungen konfigurieren
- dbt-Kompilierungsfehler oder fehlgeschlagene Modell-Ausführungen debuggen
- dbt mit BigQuery, Snowflake, Redshift oder DuckDB einrichten

## Wann NICHT verwenden
- Rohe ETL-Pipelines ohne Warehouse (stattdessen Airflow, Prefect oder Dagster verwenden)
- Echtzeit-Streaming-Daten (dbt ist nur für Batch-Verarbeitung)
- Pandas/Polars-In-Memory-Transformationen (Pandas-Polars Skill verwenden)
- Datenaufnahme (dbt transformiert, nimmt keine Daten auf)

## Anweisungen

### Projektschicht-Architektur
Modelle immer in drei Layer aufteilen:
```
models/
├── staging/          ← 1:1 mit Quelltabellen. Nur leichte Bereinigung. Keine Joins.
│   ├── stg_orders.sql
│   └── stg_customers.sql
├── intermediate/     ← Geschäftslogik. Joins erlaubt. Nicht BI-Tools ausgesetzt.
│   └── int_orders_with_customers.sql
└── marts/            ← Finale Business-Entitäten. BI ausgesetzt. Aggregationen hier.
    ├── finance/
    │   └── fct_revenue.sql
    └── marketing/
        └── dim_customers.sql
```

**Staging-Regeln:**
- Spalten nach Projektkonventionen umbenennen (snake_case)
- Typen explizit casten
- Keine Geschäftslogik — keine Joins, keine Aggregationen
- Präfix `stg_`

**Mart-Regeln:**
- `fct_`-Präfix für Faktentabellen (Ereignisse, Transaktionen)
- `dim_`-Präfix für Dimensionstabellen (Kunden, Produkte)
- Immer in schema.yml dokumentieren

### Modellkonfiguration
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

**Materialisierungsauswahl:**
- `view`: Standard — gut für Staging- und Intermediate-Modelle
- `table`: für teure Abfragen, die häufig abgefragt werden
- `incremental`: für große Faktentabellen, die im Laufe der Zeit wachsen
- `ephemeral`: CTEs, nicht materialisiert — für einfache Transformationen verwenden, die einmal aufgerufen werden

### Tests — erforderlich für jedes Mart-Modell
```yaml
# models/marts/finance/schema.yml
version: 2

models:
  - name: fct_revenue
    description: "Eine Zeile pro abgeschlossener Bestellung"
    columns:
      - name: order_id
        description: "Primärschlüssel"
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

Minimale Tests bei jedem Mart-Modell: `unique` + `not_null` auf dem Primärschlüssel, `not_null` auf kritischen Fremdschlüsseln.

### Sources-Konfiguration
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
        description: "Rohe Stripe-Charges von Fivetran"
```

Immer `freshness` auf Sources setzen — veraltete Quelldaten sind ein stiller Fehler.

### Makros für wiederverwendbare Logik
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name) %}
    ({{ column_name }} / 100.0)::numeric(10, 2)
{% endmacro %}

-- Verwendung im Modell
select
    {{ cents_to_dollars('amount_cents') }} as amount_dollars
from orders
```

## Beispiel

**Benutzer:** Staging- und Mart-Modelle für Stripe-Zahlungsdaten (Charges, Refunds) mit Tests und Frische-Prüfungen erstellen.

**Erwartete Ausgabe:**
- `models/staging/stripe/sources.yml` — Source mit Frische-Prüfung auf `_ingested_at`
- `models/staging/stripe/stg_stripe_charges.sql` — umbenennen, casten, keine Joins
- `models/staging/stripe/stg_stripe_refunds.sql` — gleiches Muster
- `models/marts/finance/fct_payments.sql` — Charges + Refunds zusammenführen, Nettobetrag, inkrementelle Materialisierung
- `models/marts/finance/schema.yml` — `unique` + `not_null` auf `charge_id`, Beziehungstest auf `customer_id`

---
