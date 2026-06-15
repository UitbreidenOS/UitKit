# Almacenamiento de Datos

## Cuándo activar

Diseñar esquemas en estrella, tablas OLAP, estrategias de particionamiento u optimización de costos.

## Cuándo NO usar

No es para diseño OLTP; enfocarse en cargas de trabajo analíticas.

## Instrucciones

1. Diseñar tablas de dimensiones y hechos
2. Planificar particionamiento (fecha, región, cliente)
3. Estimar almacenamiento y costo
4. Documentar cadencia de actualización

## Ejemplo

Se diseña un almacén de datos para un minorista con 5 años de datos de transacciones (50M registros/mes). La estructura incluye:
- Tabla de hechos `sales_fact` (particionada por mes, indexada por fecha y tienda)
- Dimensiones `dim_customer`, `dim_product`, `dim_date` (con atributos históricos)
- Estimación: 5TB almacenamiento comprimido a $200/mes en BigQuery
- Cadencia de actualización: carga diaria incremental a las 2am UTC
