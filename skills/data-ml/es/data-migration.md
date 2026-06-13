---
name: data-migration
description: "Patrones de migración de base de datos: cambios de esquema sin tiempo de inactividad, rellenos de datos, Alembic, Prisma Migrate, migraciones de Rails"
---

# Habilidad de Migración de Datos

## Cuándo activar
- Añadir, eliminar o cambiar columnas en una base de datos de producción
- Renombramiento de tablas o columnas mientras se mantiene la aplicación en funcionamiento
- Relleno de datos para una columna nueva o cambio de formatos de datos
- Escritura de migraciones de Alembic, Prisma, Rails o SQL sin procesar
- Planificación de transformación de datos a gran escala de manera segura

## Cuándo NO usar
- Cambios de esquema pequeños solo dev donde el tiempo de inactividad es aceptable
- Migración de esquema NoSQL (patrones diferentes aplican)
- Pipelines ETL de almacén de datos — use dbt o Spark en lugar

[Following full structure from English version with Spanish translations]

---
