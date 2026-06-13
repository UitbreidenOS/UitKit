---
description: Audita la API y produce una estrategia de versionado con rutas de migración para cambios que rompen compatibilidad
argument-hint: "[current-version] [target-version]"
---
Produce un plan de versionado de API para: $ARGUMENTS

Analiza como: versión actual (ej. v1) y versión objetivo (ej. v2). Si se omite, analiza la API existente y recomienda si el versionado es necesario.

Fase de análisis — lee el código base e identifica:
1. Todos los endpoints públicos (ruta, método, forma de solicitud, forma de respuesta)
2. Qué cambios rompen compatibilidad vs. no rompen:
   - Rompe compatibilidad: remover un campo, cambiar el tipo de un campo, renombrar un campo, cambiar semántica de código de estado, remover un endpoint, cambiar requisitos de autenticación
   - No rompe compatibilidad: añadir un campo opcional, añadir un nuevo endpoint, añadir un nuevo valor enum (con cuidado), relajar validación
3. Cualquier cliente existente o consumidor de SDK que sería afectado

Selección de estrategia de versionado:
- Versionado en ruta URL (`/v2/`) — recomendado por defecto; explícito, cacheaable, fácil de enrutar
- Versionado en encabezado (`API-Version: 2`) — URLs más limpias pero más difícil de probar en navegadores; usa solo si el proyecto ya hace esto
- Versionado en parámetro de consulta — evita; no es RESTful y rompe caching

Plan de implementación:
- Define el prefijo de versión en un lugar (configuración de router, constante de URL base) — no disperso en cada ruta
- Las rutas de versión anterior deben permanecer funcionales durante una ventana de deprecación (recomendado: mínimo 6 meses para APIs externas, 1 versión mayor para internas)
- Añade encabezados `Deprecation` y `Sunset` a respuestas v1 cuando v2 se lance
- Versionea solo las rutas que tienen cambios que rompen compatibilidad — rutas idénticas pueden compartir manejadores entre versiones
- Define un documento de guía de migración listando cada cambio que rompe compatibilidad con ejemplos antes/después

Salida:
1. Lista de cambios que rompen compatibilidad encontrados (o "ninguno encontrado" si está limpio)
2. Estrategia de versionado recomendada con justificación
3. Estructura de enrutamiento mostrando cómo v1 y v2 coexisten
4. Cambios de código necesarios para implementar la división de versiones
5. Recomendación de cronograma de deprecación
6. Esqueleto de guía de migración para consumidores de API
