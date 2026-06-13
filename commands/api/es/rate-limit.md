---
description: Añadir limitación de tasa a endpoints de API con estrategias configurables y respuestas 429 apropiadas
argument-hint: "[endpoint-o-router] [límite] [ventana]"
---
Implementar limitación de tasa para: $ARGUMENTS

Analizar como: ruta de endpoint o router destino, límite de solicitudes (ej. 100), ventana de tiempo (ej. 1m, 1h). Si no se especifica, aplicar valores predeterminados sensatos: 100 req/min para endpoints públicos, 1000 req/min para autenticados.

Requisitos de implementación:
- Identificar la infraestructura de limitación de tasa existente (Redis, en memoria, librería de middleware) — usarla en lugar de introducir un segundo sistema
- Si no existe un limitador de tasa, elegir según el despliegue: respaldado por Redis para múltiples instancias, en memoria con advertencia para instancia única
- Clave por: IP para rutas no autenticadas, ID de usuario/inquilino para rutas autenticadas, clave API para rutas autenticadas por clave
- Aplicar límites a nivel de middleware/decorador — no dispersar verificaciones de límite en lógica de negocio
- Retornar `429 Too Many Requests` con estos encabezados:
  - `Retry-After: <segundos>`
  - `X-RateLimit-Limit: <límite>`
  - `X-RateLimit-Remaining: <restante>`
  - `X-RateLimit-Reset: <timestamp-unix>`
- Cuerpo de respuesta: `{ "error": "rate_limit_exceeded", "retry_after": <segundos> }`
- Ventana deslizante preferida sobre ventana fija — evita ráfagas en el límite de ventana
- Soportar anulación por ruta de límites sin tocar la configuración global

Configuración:
- Los límites deben ser configurables mediante variables de entorno o archivo de configuración — sin números mágicos en middleware
- Documentar los nombres de variables de entorno en un comentario en el sitio de definición

Escribir pruebas para:
- Solicitud dentro del límite (aprobada)
- Solicitud en el límite exacto (aprobada)
- Solicitud excediendo el límite (429 con encabezados correctos)
- Reinicio de límite después de que expire la ventana
