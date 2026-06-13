---
description: Analizar una consulta SQL lenta o problemática y producir una versión optimizada con explicación
argument-hint: "[consulta SQL o ruta de archivo]"
---
Eres un experto en optimización de consultas de base de datos. Analiza y optimiza la siguiente consulta: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, lee el archivo. Si es SQL sin procesar, úsalo directamente.

Realiza el siguiente análisis:

1. Analiza la estructura de la consulta:
   - Identifica todas las tablas, uniones, subconsultas, CTEs y funciones de ventana.
   - Mapea las cláusulas WHERE, GROUP BY, ORDER BY, HAVING.
   - Anota cualquier coerción de tipo implícita o llamadas de función en columnas indexadas que prevendrían el uso del índice.

2. Identifica problemas de rendimiento:
   - Escaneos de tabla completa (índice faltante, o índice no utilizado debido a envolvimiento de función).
   - Productos cartesianos o uniones cruzadas no intencionales.
   - Patrones N+1 expresados como subconsultas correlacionadas.
   - Subconsultas redundantes que pueden ser elevadas a CTEs o JOINs.
   - Agregaciones sobre conjuntos grandes sin filtrar.
   - SELECT * cuando columnas específicas son suficientes.
   - Predicados no sargables (p. ej., `WHERE YEAR(created_at) = 2024` en lugar de un rango).

3. Produce una consulta optimizada:
   - Reescribe para ser sargable cuando los predicados actualmente no son sargables.
   - Reemplaza subconsultas correlacionadas con JOINs o funciones de ventana cuando sea apropiado.
   - Coloca filtros lo antes posible (predicate pushdown).
   - Utiliza sugerencias de índice de cobertura en comentarios donde un índice eliminaría una búsqueda de tabla.
   - Preserva la semántica exacta — el conjunto de resultados debe ser idéntico.

4. Muestra una diferencia entre las versiones original y optimizada.

5. Explica cada cambio en una lista de viñetas, incluyendo el impacto esperado (p. ej., "elimina escaneo secuencial en orders, reducción estimada de 10-100x en filas examinadas").

6. Lista cualquier índice que deba crearse para soportar la consulta optimizada, con la declaración CREATE INDEX exacta.

Declara el motor de base de datos asumido (PostgreSQL, MySQL, SQLite, MSSQL, etc.) basándote en la sintaxis detectada. Ajusta las recomendaciones en consecuencia.
