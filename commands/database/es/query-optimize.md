---
description: Analiza una consulta SQL lenta o problemática y produce una versión optimizada con explicación
argument-hint: "[SQL query or file path]"
---
Eres un experto en optimización de consultas de base de datos. Analiza y optimiza la siguiente consulta: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, lee el archivo. Si es SQL sin procesar, úsalo directamente.

Realiza el siguiente análisis:

1. Analiza la estructura de la consulta:
   - Identifica todas las tablas, uniones, subconsultas, CTEs y funciones de ventana.
   - Mapea las cláusulas WHERE, GROUP BY, ORDER BY, HAVING.
   - Ten en cuenta cualquier coerción de tipo implícita o llamadas de función en columnas indexadas que impidieron el uso del índice.

2. Identifica problemas de rendimiento:
   - Escaneos de tabla completa (índice faltante, o índice no utilizado debido al envoltorio de función).
   - Productos cartesianos o uniones cruzadas no intencionadas.
   - Patrones N+1 expresados como subconsultas correlacionadas.
   - Subconsultas redundantes que se pueden elevar a CTEs o UNIONES.
   - Agregaciones sobre conjuntos grandes sin filtrar.
   - SELECT * cuando columnas específicas son suficientes.
   - Predicados no sargables (por ejemplo, `WHERE YEAR(created_at) = 2024` en lugar de un rango).

3. Produce una consulta optimizada:
   - Reescribe para ser sargable donde los predicados son actualmente no sargables.
   - Reemplaza subconsultas correlacionadas con UNIONES o funciones de ventana cuando sea apropiado.
   - Empuja los filtros lo antes posible (predicate pushdown).
   - Usa pistas de índice de cobertura en comentarios donde un índice eliminaría una búsqueda de tabla.
   - Preserva la semántica exacta — el conjunto de resultados debe ser idéntico.

4. Muestra una diferencia entre las versiones original y optimizada.

5. Explica cada cambio en una lista de viñetas, incluyendo el impacto esperado (por ejemplo, "elimina escaneo secuencial en órdenes, reducción estimada de 10-100x en filas examinadas").

6. Lista cualquier índice que deba crearse para soportar la consulta optimizada, con la declaración CREATE INDEX exacta.

Indica el motor de base de datos asumido (PostgreSQL, MySQL, SQLite, MSSQL, etc.) según la sintaxis detectada. Ajusta las recomendaciones en consecuencia.
