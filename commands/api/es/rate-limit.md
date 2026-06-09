---
description: Añadir limitación de velocidad a endpoints de API con estrategias configurables y respuestas 429 apropiadas
argument-hint: "[endpoint-or-router] [limit] [window]"
---
Implementar limitación de velocidad para: $ARGUMENTS

Parsear como: endpoint de destino o ruta de router, límite de solicitudes (p. ej. 100), ventana de tiempo (p. ej. 1m, 1h). Si no se especifica, aplicar valores por defecto sensatos: 100 req/min para endpoints públicos, 1000 req/min para autenticados.

Requisitos de implementación:
- Identificar la infraestructura existente de limitación de velocidad (Redis, en memoria, librería middleware) — usarla en lugar de introducir un segundo sistema
- Si no existe un limitador de velocidad, elegir basado en el despliegue: respaldado por Redis para multi-instancia, en memoria con una advertencia para instancia única
- Clave por: IP para rutas no autenticadas, ID de usuario/inquilino para rutas autenticadas, clave API para rutas autenticadas con clave
- Aplicar límites a nivel de middleware/decorador — no dispersar verificaciones de límite en lógica de negocio
- Retornar `429 Too Many Requests` con estos encabezados:
  - `Retry-After: <seconds>`
  - `X-RateLimit-Limit: <limit>`
  - `X-RateLimit-Remaining: <remaining>`
  - `X-RateLimit-Reset: <unix-timestamp>`
- Cuerpo de respuesta: `{ "error": "rate_limit_exceeded", "retry_after": <seconds> }`
- Ventana deslizante preferida sobre ventana fija — evita ráfagas en el límite de ventana
- Soportar anulación por ruta de límites sin tocar la configuración global

Configuración:
- Los límites deben ser configurables mediante variables de entorno o archivo de configuración — sin números mágicos en middleware
- Documentar los nombres de variables de entorno en un comentario en el sitio de definición

Escribir pruebas para:
- Solicitud dentro del límite (pasa)
- Solicitud exactamente en el límite (pasa)
- Solicitud excediendo el límite (429 con encabezados correctos)
- Restablecimiento del límite después de que la ventana expire
