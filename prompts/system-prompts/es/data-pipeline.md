> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../data-pipeline.md).

# CLAUDE.md Starter — Proyecto de Pipeline de Datos

Copia esto en el `CLAUDE.md` de tu proyecto y completa las secciones entre corchetes.

---

```markdown
# [Nombre del Proyecto] — Instrucciones para Claude Code

## Qué es esto
[Un párrafo: qué datos procesa este pipeline, sistemas fuente, destino, propósito de negocio]

## Stack
- Orquestador: [Airflow / Prefect / Dagster / dbt Cloud]
- Transformación: [dbt / PySpark / Pandas / Polars]
- Warehouse: [BigQuery / Snowflake / Redshift / DuckDB]
- Ingesta: [Fivetran / Airbyte / personalizado]
- Lenguaje: [Python / SQL]
- Infraestructura: [Terraform en AWS / GCP / Azure]

## Estructura del proyecto
dbt/ (si se usa dbt)
├── models/
│   ├── staging/      ← 1:1 con tablas fuente, solo limpieza ligera
│   ├── intermediate/ ← Lógica de negocio, joins
│   └── marts/        ← Entidades de negocio finales (prefijos fct_, dim_)
├── macros/           ← Macros SQL reutilizables
├── seeds/            ← Datos de referencia estáticos
└── tests/            ← Tests singulares personalizados

pipelines/ (si se usa Airflow/Prefect/Dagster)
├── dags/ / flows/    ← Definiciones de pipelines
├── operators/        ← Operadores/tareas personalizados
└── utils/            ← Utilidades compartidas

## Convenciones de datos
- Modelos de staging: renombrar a snake_case, castear tipos, sin joins, sin lógica de negocio
- Tablas de hechos: prefijo fct_, una fila por evento/transacción
- Tablas de dimensiones: prefijo dim_, una fila por entidad
- Nunca uses SELECT * en consultas de producción
- Todos los modelos mart deben tener tests unique + not_null en la clave primaria
- Se requieren verificaciones de frescura de fuente en todas las fuentes

## Decisiones (no re-discutir)
- [Estrategia incremental vs. full-refresh para tablas de hechos]
- [Zona horaria: todos los timestamps en UTC]
- [Granularidad: qué representa una fila en cada tabla mart]
- [Estrategia de manejo de datos tardíos]

## Requisitos de testing
- Cada modelo de staging: not_null en la clave primaria
- Cada modelo mart: unique + not_null en la clave primaria, relationships en claves foráneas
- Frescura de fuente: advertir a las [X] horas, error a las [Y] horas

## Reglas de rendimiento
- Particiona las tablas grandes por fecha — siempre filtra en la columna de partición
- Usa modelos incrementales para tablas > [X] filas
- Nunca ejecutes full refreshes en producción sin aprobación
- Claves de cluster/sort: [especificar si se usa Snowflake/Redshift]

## Comandos
- dbt run --select staging — ejecutar la capa de staging
- dbt test — ejecutar todas las pruebas
- dbt docs generate && dbt docs serve — previsualizar documentación
- dbt source freshness — verificar la frescura de los datos fuente

## Nunca hacer
- Nunca pongas lógica de negocio en los modelos de staging
- Nunca hardcodees fechas — usa variables dbt o macros
- Nunca hagas commit de credenciales reales — usa variables de entorno o gestor de secretos
- Nunca ejecutes dbt run en producción sin que dbt test pase primero
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
