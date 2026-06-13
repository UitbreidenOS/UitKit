---
description: Generar un archivo de migración de base de datos a partir de una descripción de cambio de esquema o diff
argument-hint: "[descripción del cambio de esquema]"
---
Estás generando una migración de base de datos. El usuario ha proporcionado: $ARGUMENTS

Deduce el framework de migración objetivo del proyecto (Alembic, Flyway, Liquibase, Django migrations, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize o SQL puro). Si es ambiguo, verifica archivos de configuración o migraciones existentes en el repositorio antes de preguntar.

Pasos:
1. Examina las migraciones existentes para determinar la convención de nomenclatura, el formato de timestamp y la estructura del archivo.
2. Identifica el estado actual del esquema a partir de migraciones existentes o archivos de esquema.
3. Genera la migración con:
   - Una ruta `up` (migración hacia adelante) que sea idempotente donde sea posible (usa guardias IF NOT EXISTS, IF EXISTS).
   - Una ruta `down` (reversión) que invierta completamente la ruta `up`.
   - Límites de transacción explícitos si el framework soporta DDL transaccional.
   - Restricciones de columna (NOT NULL, DEFAULT, CHECK) que coincidan con lo solicitado.
   - Creación de índices junto con cualquier nueva clave foránea.
4. Si el cambio implica renombrar una columna o tabla, genera una migración de dos fases: agregar nueva, rellenar datos, eliminar antigua — a menos que el usuario solicite explícitamente un renombramiento de una sola fase.
5. Marca cualquier operación destructiva (DROP COLUMN, DROP TABLE, estrechamiento de tipo) con un bloque de comentario que comience con `-- DESTRUCTIVE:` y recomienda una estrategia de despliegue correspondiente (feature flag, dual-write, etc.).
6. Envía el contenido del archivo de migración con el nombre de archivo correcto siguiendo las convenciones existentes.
7. Para tablas grandes, marca operaciones que requieran bloqueos ACCESS EXCLUSIVE (ALTER TABLE en PostgreSQL) y sugiere alternativas CONCURRENTLY donde estén disponibles.

No generes cambios de modelo ORM a menos que se te pida. Enfócate únicamente en el artefacto de migración.
