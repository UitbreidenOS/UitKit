# Diseño de Pipelines

## Cuándo activar

Diseñando nuevos flujos de trabajo de datos o refactorizando DAGs existentes.

## Cuándo NO usar

No es un reemplazo para depuración en tiempo de ejecución; úsalo solo para la fase de arquitectura.

## Instrucciones

1. Mapea fuentes de datos y dependencias
2. Define etapas de transformación
3. Elige orquestador (Airflow, dbt, Spark)
4. Documenta linaje y SLAs

## Ejemplo

Se diseña un DAG de Airflow para un almacén de datos de marketing con tres etapas:
- **Ingestión** (7am): Extrae datos de APIs de Facebook, Google Ads usando operadores HTTP
- **Transformación** (8am): Ejecuta jobs dbt normalizando esquemas, calculando métricas de campaña
- **Carga** (9am): Inserta dimensiones y hechos en Snowflake

Dependencias documentadas: ingestión → transformación → carga. SLA: completar antes de 10am para reportes diarios.
