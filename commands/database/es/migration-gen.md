---
description: Generar un archivo de migración de base de datos a partir de una descripción de cambio de esquema o diff
argument-hint: "[description of schema change]"
---
Estás generando una migración de base de datos. El usuario ha proporcionado: $ARGUMENTS

Infiere el marco de migración de destino del proyecto (Alembic, Flyway, Liquibase, migraciones de Django, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize, o SQL sin procesar). Si es ambiguo, verifica archivos de configuración o archivos de migración existentes en el repositorio antes de preguntar.

Pasos:
1. Examina migraciones existentes para determinar la convención de nombres, el formato de marca de tiempo y la estructura del archivo.
2. Identifica el estado del esquema actual a partir de migraciones existentes o archivos de esquema.
3. Genera la migración con:
   - Una ruta `up` (migración hacia adelante) que sea idempotente cuando sea posible (utiliza guardias IF NOT EXISTS, IF EXISTS).
   - Una ruta `down` (reversión) que revierta completamente la ruta `up`.
   - Límites de transacción explícitos si el marco admite DDL transaccional.
   - Restricciones de columna (NOT NULL, DEFAULT, CHECK) que coincidan con lo solicitado.
   - Creación de índices junto con cualquier nueva clave externa.
4. Si el cambio implica renombrar una columna o tabla, genera una migración de dos fases: agregar nueva, rellenar, eliminar antigua — a menos que el usuario solicite explícitamente un renombramiento de una sola fase.
5. Marca cualquier operación destructiva (DROP COLUMN, DROP TABLE, reducción de tipo) con un bloque de comentario que comience con `-- DESTRUCTIVE:` y recomienda una estrategia de implementación correspondiente (bandera de función, escritura dual, etc.).
6. Genera el contenido del archivo de migración con el nombre de archivo correcto siguiendo las convenciones existentes.
7. Para tablas grandes, marca operaciones que requieren bloqueos ACCESS EXCLUSIVE (ALTER TABLE en PostgreSQL) y sugiere alternativas CONCURRENTLY cuando estén disponibles.

No generes cambios de modelo ORM a menos que se te pida. Enfócate únicamente en el artefacto de migración.
