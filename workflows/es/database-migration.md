# Flujo de trabajo de migración de base de datos

Proceso seguro y paso a paso para planificar y ejecutar cambios de esquema de base de datos sin tiempo de inactividad.

## Cuándo usar

Utilice este flujo de trabajo para cualquier cambio de base de datos que:
- Modifique una tabla existente (agregar/renombrar/soltar columna, cambiar tipo)
- Afecte una tabla con > 100K filas
- Requiera un nuevo índice en una tabla grande
- Cambie una restricción o clave externa
- Implique mover o dividir datos entre tablas

Omita este flujo de trabajo para: nuevas tablas en nuevas características sin datos existentes.

## Fase 1: Planificación (antes de escribir SQL)

**Responda primero estas preguntas:**

1. ¿Qué cambia exactamente?
   - ¿Agregar/renombrar/soltar columna/cambiar tipo/cambiar restricción/índice?

2. ¿Cuántos datos se ven afectados?
   ```sql
   SELECT COUNT(*) FROM affected_table;  -- número de filas
   SELECT pg_size_pretty(pg_total_relation_size('affected_table'));  -- tamaño de tabla
   ```

3. ¿Qué tan ocupada está esta tabla?
   ```sql
   -- Verificar patrones de acceso (PostgreSQL)
   SELECT seq_scan, idx_scan, n_tup_upd, n_tup_del
   FROM pg_stat_user_tables WHERE relname = 'affected_table';
   ```

4. ¿Puede hacerse sin tiempo de inactividad?
   - AGREGAR una columna nullable: sí
   - AGREGAR una columna NOT NULL sin default: requiere expand-contract
   - SOLTAR una columna: sí (si el código no la usa más)
   - RENOMBRAR una columna: requiere expand-contract
   - CREAR un índice: sí, con CONCURRENTLY
   - CAMBIAR un tipo de columna: riesgoso — verificar si se requiere conversión de datos

5. ¿Es el código de aplicación compatible con el esquema antiguo y nuevo?
   - Implementar código primero, luego migrar (nueva columna puede ser nula hasta rellenar)
   - O migrar primero, luego implementar (solo si la migración es puramente aditiva)

## Fase 2: Escriba la migración

**Utilice el patrón expand-contract para cualquier cambio relevante:**

```sql
-- FASE EXPAND (implementar esto primero, el código antiguo aún funciona):
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- BACKFILL (ejecutar sin conexión, sin bloqueo):
-- En lotes para evitar bloqueos:
UPDATE users SET display_name = username 
WHERE display_name IS NULL AND id BETWEEN 1 AND 10000;
-- ... repetir para todos los rangos de ID

-- FASE CONTRACT (después de que el código se actualice y se complete el backfill):
-- Agregar restricciones solo después del backfill:
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
-- Soltar columna antigua solo después de confirmar que nada la lee:
ALTER TABLE users DROP COLUMN username;
```

**Escriba el rollback:**
```sql
-- Cada migración debe tener un rollback documentado
-- Rollback para el anterior:
ALTER TABLE users ADD COLUMN username VARCHAR(255);
UPDATE users SET username = display_name WHERE username IS NULL;
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users DROP COLUMN display_name;
```

## Fase 3: Prueba

```bash
# 1. Pruebe en una copia de datos de producción (no solo una base de datos de desarrollo)
pg_dump $PROD_DB | psql $STAGING_DB

# 2. Mida el tiempo de migración en staging
time psql $STAGING_DB < migration.sql

# 3. Pruebe rollback en staging
time psql $STAGING_DB < rollback.sql

# 4. Verifique la integridad de los datos después de la migración
psql $STAGING_DB -c "SELECT COUNT(*) FROM affected_table WHERE new_column IS NULL;"
```

**Criterios de aceptación antes de ejecutar en producción:**
- [ ] La migración se ejecuta en < 30 segundos (o usa CONCURRENTLY y no bloquea)
- [ ] Rollback probado y confirmado que funciona
- [ ] Integridad de datos validada (recuentos de filas, verificaciones nulas, verificaciones de restricciones)
- [ ] Aplicación probada con esquema antiguo y nuevo (durante la transición)

## Fase 4: Ejecución en producción

**Lista de verificación previa a la migración:**
- [ ] Copia de seguridad tomada en las últimas 24 horas (o tome una ahora)
- [ ] Hora fuera de pico seleccionada (evite horas pico)
- [ ] Ingeniería en espera durante 30 minutos después de la migración
- [ ] Script de rollback listo para pegar inmediatamente
- [ ] Dashboards de monitoreo abiertos

**Ejecución:**
```bash
# 1. Ejecutar migración
psql $PROD_DB < migration.sql

# 2. Verificar inmediatamente
psql $PROD_DB -c "SELECT COUNT(*) FROM affected_table;"
psql $PROD_DB -c "\d affected_table"  # confirmar esquema

# 3. Monitorear durante 10 minutos
# Verificar: tasa de error, latencia de consulta, CPU de DB
```

**Si algo se ve mal:**
```bash
# Ejecutar rollback inmediatamente
psql $PROD_DB < rollback.sql
# Luego investigar en staging antes de reintentar
```

## Fase 5: Después de la migración

- [ ] Limpieza: elimine las columnas o índices temporales utilizados durante la migración
- [ ] Actualizar documentación si existe
- [ ] Archivar archivos de migración con historial de versiones
- [ ] Si la migración fue compleja: escriba una nota post-mortem para el equipo

## Contenido relacionado

- `/rules/common/database-migrations` — reglas que se aplican a todas las migraciones
- `/skills/devops-infra/migration-architect` — migraciones complejas de múltiples sistemas
- `/skills/database/postgresql` — patrones específicos de PostgreSQL

---
