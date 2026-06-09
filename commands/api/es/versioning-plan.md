---
description: Auditar la API y producir una estrategia de versionado con rutas de migración para cambios incompatibles
argument-hint: "[current-version] [target-version]"
---
Produce an API versioning plan for: $ARGUMENTS

Interpreta como: versión actual (p.ej. v1) y versión objetivo (p.ej. v2). Si se omiten, analiza la API existente y recomienda si es necesario el versionado.

Fase de análisis — lee la base de código e identifica:
1. Todos los endpoints públicos (ruta, método, forma de solicitud, forma de respuesta)
2. Qué cambios son incompatibles vs. compatibles:
   - Incompatibles: eliminar un campo, cambiar un tipo de campo, renombrar un campo, cambiar la semántica del código de estado, eliminar un endpoint, cambiar los requisitos de autenticación
   - Compatibles: agregar un campo opcional, agregar un nuevo endpoint, agregar un nuevo valor de enum (con precaución), relajar la validación
3. Cualquier cliente existente o consumidor de SDK que se vería afectado

Selección de estrategia de versionado:
- Versionado en ruta de URL (`/v2/`) — recomendado por defecto; explícito, cacheable, fácil de enrutar
- Versionado en encabezado (`API-Version: 2`) — URLs más limpias pero más difíciles de probar en navegadores; usar solo si el proyecto ya lo hace
- Versionado en parámetro de consulta — evitar; no es RESTful y rompe el almacenamiento en caché

Plan de implementación:
- Define el prefijo de versión en un lugar (configuración del enrutador, constante de URL base) — no disperso en cada ruta
- Las rutas de la versión anterior deben seguir siendo funcionales durante una ventana de depreciación (recomendado: mínimo 6 meses para APIs externas, 1 versión principal para internas)
- Agrega encabezados `Deprecation` y `Sunset` a las respuestas v1 cuando se lance v2
- Versionado solo de las rutas que tienen cambios incompatibles — rutas idénticas pueden compartir controladores entre versiones
- Define un documento de guía de migración que enumera cada cambio incompatible con ejemplos antes/después

Salida:
1. Lista de cambios incompatibles encontrados (o "ninguno encontrado" si está limpio)
2. Estrategia de versionado recomendada con justificación
3. Estructura de enrutamiento mostrando cómo coexisten v1 y v2
4. Cambios de código necesarios para implementar la división de versión
5. Recomendación de cronograma de depreciación
6. Esqueleto de guía de migración para consumidores de API
