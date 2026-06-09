---
description: Recomienda índices para una tabla o carga de trabajo de consultas en función del esquema y patrones de acceso
argument-hint: "[table name, query, or schema file]"
---
Analiza el esquema de base de datos y patrones de acceso para: $ARGUMENTS

Si $ARGUMENTS es el nombre de una tabla, localiza su esquema en migraciones, modelos ORM o archivos de esquema. Si es una consulta, analiza los patrones de acceso de esa consulta. Si es una ruta de archivo, léela.

Realiza este análisis:

1. Mapea los índices actuales:
   - Lista todos los índices existentes (clave primaria, único, compuesto, parcial, basado en expresión).
   - Identifica qué índices son redundantes (cubiertos por prefijo de otro índice).
   - Identifica índices no utilizados o de baja selectividad (p. ej., columnas booleanas, enumeraciones de baja cardinalidad).

2. Analiza la carga de trabajo de consultas:
   - Si hay consultas proporcionadas o detectables en el repositorio (llamadas de consulta ORM, SQL sin procesar), extrae sus patrones WHERE, JOIN, ORDER BY y GROUP BY.
   - Identifica columnas que aparecen repetidamente en predicados de filtro.
   - Nota cualquier consulta de rango que se beneficie de índices B-tree frente a consultas de igualdad únicamente.

3. Recomienda nuevos índices:
   - Para cada recomendación, establece:
     a. La declaración CREATE INDEX exacta (usa CONCURRENTLY para PostgreSQL si es apropiado).
     b. Qué consultas o patrones de acceso cubre.
     c. Impacto de selectividad estimado (cardinalidad alta/media/baja).
     d. Costo de sobrecarga de escritura — los índices que perjudican el rendimiento de INSERT/UPDATE deben ser marcados.
   - Prefiere índices compuestos sobre múltiples índices de una sola columna cuando el patrón de consulta lo justifique.
   - Considera índices parciales (cláusula WHERE) para condiciones dispersas (p. ej., patrones de eliminación suave, filtros de estado con valores null/inactivos dominantes).
   - Considera índices de cobertura (columnas INCLUDE) para eliminar búsquedas de montículo de tabla para rutas de lectura activas.

4. Marca índices para eliminar:
   - Índices duplicados.
   - Índices en columnas nunca utilizadas en filtros o uniones.
   - Índices que son reemplazados por un índice compuesto.

5. Genera un plan de acción priorizado: ALTO (ganancia inmediata, bajo riesgo) / MEDIO (útil, sobrecarga de escritura menor) / BAJO (marginal, evaluar bajo carga).

Especifica el motor de base de datos asumido a partir de contexto de sintaxis o configuración.
