> 🇪🇸 Versión en español. [Versión en inglés](../CLAUDE.md).

# CLAUDE.md — Pipeline de datos con dbt

Un proyecto dbt de producción para transformar datos crudos en tablas listas para análisis. Sigue la arquitectura medallón (raw → staging → marts) con cobertura completa de pruebas e integración de CI.

---

## Stack tecnológico

| Capa | Tecnología |
|-------|-----------|
| Transformación | dbt Core |
| Almacén de datos | Snowflake (o BigQuery / DuckDB para uso local) |
| Orquestación | Airflow / Dagster / dbt Cloud |
| Pruebas | dbt tests + Great Expectations |
| Documentación | dbt docs |
| CI | GitHub Actions + SQLFluff |

---

## Comandos principales

```bash
dbt debug                        # Probar conexión
dbt run                          # Ejecutar todos los modelos
dbt run --select staging.*       # Ejecutar una capa
dbt run --select +orders         # Ejecutar orders y todos los modelos upstream
dbt run --select orders+         # Ejecutar orders y todos los modelos downstream
dbt test                         # Ejecutar todas las pruebas
dbt test --select orders         # Probar un modelo
dbt build                        # run + test juntos (preferido en CI)
dbt docs generate && dbt docs serve   # Generar y visualizar documentación
dbt source freshness             # Verificar la frescura de los datos fuente
sqlfluff lint models/            # Lint de SQL
```

---

## Estructura del proyecto

```
dbt_project/
├── dbt_project.yml              # Configuración del proyecto, configuración de modelos por ruta
├── profiles.yml                 # Perfiles de conexión (en .gitignore — usar variables de entorno)
├── packages.yml                 # Paquetes de dbt Hub
├── models/
│   ├── staging/                 # 1:1 con tablas fuente, solo limpieza ligera
│   │   ├── _sources.yml         # Definiciones de fuentes + verificaciones de frescura
│   │   ├── _staging.yml         # Documentación de modelos staging + pruebas
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/            # Opcional: joins/pivots complejos antes de marts
│   │   └── int_order_items.sql
│   └── marts/
│       ├── _marts.yml           # Documentación de marts + pruebas
│       ├── core/
│       │   ├── dim_customers.sql
│       │   └── fct_orders.sql
│       └── finance/
│           └── fct_revenue.sql
├── tests/                       # Pruebas singulares personalizadas (archivos SQL)
├── macros/                      # Macros Jinja reutilizables
├── seeds/                       # Tablas de referencia CSV estáticas
├── snapshots/                   # Snapshots SCD tipo 2
└── analyses/                    # Consultas de análisis ad-hoc (no materializadas)
```

---

## Convenciones de modelos

### Modelos staging — solo limpieza ligera
```sql
-- models/staging/stg_orders.sql
-- Staging: renombrar columnas, convertir tipos, sin joins, sin lógica de negocio

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

        -- Metadatos
        _fivetran_synced        as _loaded_at

    from source
    where order_id is not null     -- Solo filtrar filas claramente incorrectas en staging
)

select * from renamed
```

### Tabla de hechos — la lógica de negocio va aquí
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

### Pruebas y documentación en YAML
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

### Frescura de fuentes
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

### Macros
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name, precision=2) %}
    round({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}

-- Uso en un modelo:
-- {{ cents_to_dollars('amount_cents') }} as amount_usd
```

---

## Configuración de dbt_project.yml

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
      +materialized: view          # Staging = vistas (económico, siempre fresco)
      +schema: staging
    intermediate:
      +materialized: ephemeral     # Intermedio = efímero (no se crea tabla)
    marts:
      +materialized: table         # Marts = tablas (rápidas de consultar)
      +schema: marts
      core:
        fct_orders:
          +materialized: incremental
```

---

## Antipatrones — NO hacer

- **Nunca poner lógica de negocio en modelos staging** — staging es solo renombrado y conversión de tipos
- **Nunca usar `SELECT *` en marts** — siempre listar las columnas explícitamente
- **Nunca hacer joins en staging** — staging es siempre 1:1 con una tabla fuente
- **Nunca omitir las pruebas `unique` + `not_null` en claves primarias** — todo modelo necesita estas dos como mínimo
- **Nunca codificar fechas de forma fija** — usar `current_date` o pasar mediante variables dbt: `{{ var('start_date') }}`
- **Nunca hacer commit de `profiles.yml`** — usar variables de entorno: `DBT_ENV_SECRET_SNOWFLAKE_PASSWORD`
- **Nunca usar `dbt run` en CI** — usar `dbt build` (ejecuta + prueba juntos, falla rápido)

---

## Pipeline de CI (GitHub Actions)

```yaml
# .github/workflows/dbt.yml
- name: Run dbt build
  run: |
    dbt deps
    dbt source freshness
    dbt build --target ci --select state:modified+  # Solo modelos modificados + downstream
  env:
    DBT_ENV_SECRET_SNOWFLAKE_PASSWORD: ${{ secrets.SNOWFLAKE_PASSWORD }}
```

---

## Agregar un nuevo modelo mart

1. Crear `models/marts/<domain>/fct_<name>.sql` o `dim_<name>.sql`
2. Agregar a `models/marts/_marts.yml` con descripción + pruebas de columnas
3. Agregar como mínimo `unique` + `not_null` en la clave primaria
4. Ejecutar `dbt build --select fct_<name>` para probar localmente
5. Ejecutar `dbt docs generate` para actualizar el sitio de documentación
