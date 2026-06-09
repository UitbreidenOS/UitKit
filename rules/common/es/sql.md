# Reglas SQL

Aplica estas reglas al escribir consultas, esquemas o procedimientos almacenados.

## Higiene de consultas

- Siempre usa consultas parametrizadas — nunca interpoles entrada de usuario en SQL
- Califica nombres de columnas al unir múltiples tablas: `u.id` no `id`
- Evita `SELECT *` en consultas de producción; especifica cada columna que necesites
- Usa `EXPLAIN ANALYZE` antes de fusionar cualquier consulta que acceda a tablas grandes
- Mantén las consultas legibles: una cláusula por línea para cualquier cosa más allá de un SELECT trivial

## Indexación

- Cada clave externa debe tener un índice — la base de datos no lo añade automáticamente
- Indexa columnas que aparecen en `WHERE`, `JOIN ON`, u `ORDER BY` en caminos críticos
- Índices compuestos: el orden de las columnas es importante — pon primero el filtro de igualdad o mayor cardinalidad
- No sobre-indexes tablas con muchas escrituras; cada índice ralentiza `INSERT`/`UPDATE`/`DELETE`
- Usa índices parciales para consultas filtradas: `CREATE INDEX … WHERE deleted_at IS NULL`

## Diseño de esquema

- Usa `NOT NULL` por defecto; nullable solo cuando la ausencia tiene significado distinto de cero/vacío
- Almacena timestamps como `TIMESTAMPTZ` (UTC) — nunca `TIMESTAMP WITHOUT TIME ZONE`
- Usa `BIGINT` o `UUID` para claves primarias; `SERIAL`/`INT` se agota en tablas de alto volumen
- Soft-delete con `deleted_at TIMESTAMPTZ` cuando el historial de filas importa; hard-delete en caso contrario
- Dinero: almacena como centavos enteros (`BIGINT`) o `NUMERIC(19,4)` — nunca `FLOAT`/`DOUBLE`

## Transacciones

- Envuelve mutaciones de múltiples sentencias en una transacción; nunca dejes posibles escrituras parciales
- Mantén las transacciones cortas — los bloqueos mantenidos = latencia para cada escritor competidor
- Usa `SELECT … FOR UPDATE` para bloquear filas que vas a modificar, no después del hecho
- Evita transacciones que abarquen un ciclo de solicitud-respuesta HTTP

## Migraciones

- Las migraciones son solo-anexo; nunca edites una migración que se haya ejecutado en cualquier entorno
- Prefiere cambios aditivos (añadir columna, añadir tabla) antes de eliminar columnas antiguas
- Añade nuevas columnas no-nullable con un `DEFAULT` o en dos pasos: añadir nullable → llenar → añadir restricción
- Prueba reversión: cada migración debe tener un paso `down` reversible

## Anti-patrones

- Sin lógica en consultas de aplicación que pertenezca a restricciones: usa `CHECK`, `UNIQUE`, `FK`
- Sin `NOT IN (subquery)` con columnas nullables — silenciosamente devuelve cero filas en NULL
- Sin subconsultas correlacionadas dentro de bucles — agrupa o usa un `JOIN`/`CTE` en su lugar
- Sin paginación `OFFSET` en tablas grandes — usa basado en cursor (`WHERE id > :cursor`)
