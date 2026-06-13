> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../dbt-data-pipelines.md).

# Skill de dbt Data Pipelines

## Cuándo activar
- Escribir modelos dbt (capas staging, intermediate, mart)
- Configurar fuentes, refs y dependencias de dbt
- Escribir tests de dbt (tests de esquema, tests singulares, tests genéricos personalizados)
- Configurar la estructura del proyecto dbt para un nuevo data warehouse
- Escribir macros dbt para lógica SQL reutilizable
- Configurar documentación dbt y verificaciones de frescura
- Depurar errores de compilación de dbt o ejecuciones de modelos fallidas
- Configurar dbt con BigQuery, Snowflake, Redshift o DuckDB

## Cuándo NO usar
- Pipelines ETL sin un warehouse (usar Airflow, Prefect o Dagster en su lugar)
- Datos de streaming en tiempo real (dbt es solo batch)
- Transformaciones en memoria con Pandas/Polars (usar el skill de pandas-polars)
- Ingesta de datos (dbt transforma, no ingiere)

## Instrucciones

### Arquitectura de capas del proyecto
Siempre separa los modelos en tres capas:
```
models/
├── staging/          ← 1:1 con tablas fuente. Solo limpieza ligera. Sin joins.
│   ├── stg_orders.sql
│   └── stg_customers.sql
├── intermediate/     ← Lógica de negocio. Se permiten joins. No expuesto a herramientas de BI.
│   └── int_orders_with_customers.sql
└── marts/            ← Entidades de negocio finales. Expuesto a BI. Las agregaciones viven aquí.
    ├── finance/
    │   └── fct_revenue.sql
    └── marketing/
        └── dim_customers.sql
```

**Reglas de Staging:**
- Renombrar columnas a las convenciones del proyecto (snake_case)
- Castear tipos explícitamente
- Sin lógica de negocio — sin joins, sin agregaciones
- Prefijo `stg_`

**Reglas de Mart:**
- Prefijo `fct_` para tablas de hechos (eventos, transacciones)
- Prefijo `dim_` para tablas de dimensiones (clientes, productos)
- Siempre documentar en schema.yml

### Configuración de modelos
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

**Opciones de materialización:**
- `view`: por defecto — bueno para modelos de staging e intermediate
- `table`: para consultas costosas consultadas con frecuencia
- `incremental`: para tablas de hechos grandes que crecen con el tiempo
- `ephemeral`: CTEs, no materializadas — usar para transformaciones simples llamadas una vez

### Testing — requerido en cada modelo mart
```yaml
# models/marts/finance/schema.yml
version: 2

models:
  - name: fct_revenue
    description: "Una fila por pedido completado"
    columns:
      - name: order_id
        description: "Clave primaria"
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

Tests mínimos en cada modelo mart: `unique` + `not_null` en la clave primaria, `not_null` en las claves foráneas críticas.

### Configuración de fuentes
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
        description: "Cargos de Stripe sin procesar de Fivetran"
```

Siempre establece `freshness` en las fuentes — los datos de fuente obsoletos son un fallo silencioso.

### Macros para lógica reutilizable
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name) %}
    ({{ column_name }} / 100.0)::numeric(10, 2)
{% endmacro %}

-- Uso en el modelo
select
    {{ cents_to_dollars('amount_cents') }} as amount_dollars
from orders
```

## Ejemplo

**Usuario:** Crear modelos de staging y mart para datos de pagos de Stripe (cargos, reembolsos) con tests y verificaciones de frescura.

**Salida esperada:**
- `models/staging/stripe/sources.yml` — fuente con verificación de frescura en `_ingested_at`
- `models/staging/stripe/stg_stripe_charges.sql` — renombrar, castear, sin joins
- `models/staging/stripe/stg_stripe_refunds.sql` — mismo patrón
- `models/marts/finance/fct_payments.sql` — join de cargos + reembolsos, importe neto, materialización incremental
- `models/marts/finance/schema.yml` — `unique` + `not_null` en `charge_id`, test de relación en `customer_id`

---
