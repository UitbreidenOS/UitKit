# Depuración ETL

## Cuándo activar

El pipeline falla, se produce pérdida de datos, o los registros están inesperadamente ausentes o duplicados.

## Cuándo NO usar

No es para revisión de diseño; solo para errores posteriores a la ejecución.

## Instrucciones

1. Aislar etapa de fallo
2. Verificar registros y métricas
3. Validar datos de entrada y esquema
4. Rastrear transformaciones de extremo a extremo

## Ejemplo

Un pipeline de carga diaria de clientes falla durante la etapa de transformación. Se investiga:
1. Los logs muestran error de desbordamiento de memoria en la unión con tabla de referencias
2. Se valida que la entrada tiene 50M filas (5x lo esperado)
3. Se rastrea: la extracción accidentalmente omitió el filtro `WHERE created_date >= today()-30`
4. Se corrige la consulta SQL y la carga se reanuda correctamente con 10M filas
