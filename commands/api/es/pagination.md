---
description: Agregar paginación basada en cursor u offset a un endpoint de lista con forma de respuesta consistente
argument-hint: "[endpoint-o-modelo]"
---
Agregar paginación al endpoint o recurso: $ARGUMENTS

Si $ARGUMENTS está vacío, buscar todos los endpoints de lista (aquellos que devuelven arrays) y aplicar paginación a cada uno.

Elegir la estrategia de paginación según el caso de uso:
- Basada en cursor (predeterminada para la mayoría de feeds y conjuntos de datos grandes): estable bajo escrituras concurrentes, soporta infinite scroll, no puede saltar a una página arbitraria
- Basada en offset/página (solo si la UI requiere "ir a la página N"): más simple pero inconsistente bajo escrituras

Implementación basada en cursor:
- El cursor codifica el valor de la columna de ordenamiento + clave primaria de la última fila vista — codificarlo en base64, nunca exponer valores raw de DB
- Ordenamiento predeterminado: descendente por `created_at`, ordenamiento secundario por `id` para resolver empates
- Aceptar `cursor` (cadena opaca) y `limit` (entero, 1–100, predeterminado 20) como parámetros de query
- Validar `limit` — rechazar < 1 o > 100 con 400
- Forma de respuesta:
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "<opaco>",
      "has_more": true,
      "limit": 20
    }
  }
  ```
- `next_cursor` es null cuando no hay más páginas
- Nunca filtrar el conteo total a menos que sea explícitamente requerido — es costoso a escala

Implementación basada en offset (solo si se solicita):
- Aceptar `page` (indexado en 1) y `per_page` (1–100, predeterminado 20)
- Incluir `total`, `page`, `per_page`, `total_pages` en el envelope de respuesta

Ambas estrategias:
- Agregar un índice de base de datos en la columna de ordenamiento si uno no existe
- La query debe ser una sola llamada a DB — sin N+1 de obtener el conteo por separado a menos que la paginación por offset lo requiera
- Actualizar la especificación OpenAPI para el endpoint si existe una

Escribir tests: primera página, segunda página vía cursor, resultado vacío, validación de límite de boundary.
