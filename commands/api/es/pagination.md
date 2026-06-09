---
description: Agrega paginación basada en cursor u offset a un endpoint de lista con forma de respuesta consistente
argument-hint: "[endpoint-or-model]"
---
Agrega paginación al endpoint o recurso: $ARGUMENTS

Si $ARGUMENTS está vacío, encuentra todos los endpoints de lista (aquellos que devuelven arrays) y aplica paginación a cada uno.

Elige la estrategia de paginación según el caso de uso:
- Basada en cursor (predeterminada para la mayoría de feeds y grandes conjuntos de datos): estable bajo escrituras concurrentes, soporta scroll infinito, no puede saltar a una página arbitraria
- Basada en offset/página (solo si la interfaz requiere "ir a la página N"): más simple pero inconsistente bajo escrituras

Implementación basada en cursor:
- El cursor codifica el valor de la columna de ordenamiento + clave primaria de la última fila vista — codifica en base64, nunca expongas valores brutos de DB
- Ordenamiento predeterminado: descendente por `created_at`, ordenamiento secundario por `id` para desempate
- Acepta `cursor` (string opaco) y `limit` (entero, 1–100, predeterminado 20) como parámetros de consulta
- Valida `limit` — rechaza < 1 o > 100 con 400
- Forma de respuesta:
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "<opaque>",
      "has_more": true,
      "limit": 20
    }
  }
  ```
- `next_cursor` es null cuando no hay más páginas
- Nunca expongas el conteo total a menos que sea explícitamente requerido — es costoso a escala

Implementación basada en offset (solo si se solicita):
- Acepta `page` (indexado en 1) y `per_page` (1–100, predeterminado 20)
- Incluye `total`, `page`, `per_page`, `total_pages` en la envoltura de respuesta

Ambas estrategias:
- Agrega un índice de base de datos en la columna de ordenamiento si no existe uno
- La consulta debe ser una llamada única a DB — sin N+1 obteniendo conteo por separado a menos que la paginación por offset lo requiera
- Actualiza la especificación OpenAPI para el endpoint si existe una

Escribe tests: primera página, segunda página via cursor, resultado vacío, validación de límite límite.
