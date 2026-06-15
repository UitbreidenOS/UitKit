# Optimización SQL

## Cuándo activar

El usuario informa sobre consultas lentas o solicita orientación sobre ajuste de consultas.

## Cuándo NO usar

No optimices prematuramente sin perfilar el rendimiento de base.

## Instrucciones

1. Analizar plan de ejecución de consulta
2. Identificar índices faltantes o análisis
3. Revisar orden de unión y estimaciones de cardinalidad
4. Recomendar patrones de reescritura

## Ejemplo

Una consulta de reporte de marketing que une `orders` (100M filas) con `customers` (5M filas) y `campaigns` (50K) tarda 120 segundos. El plan de ejecución revela:
- Sin índice en `orders.campaign_id`: table scan completo
- Unión innecesaria con `campaigns` antes de filtrar por fecha

Se crea índice en `(campaign_id, created_date)` y se reordena las uniones (filtrar por fecha primero). La consulta se reduce a 8 segundos.
