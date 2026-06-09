# Reglas de API REST

Aplicar al construir o consumir servicios HTTP/REST.

## Diseño de solicitudes

- Aceptar `Content-Type: application/json` por defecto; soportar `application/x-www-form-urlencoded` solo cuando sea necesario (OAuth, formularios)
- Tratar los encabezados `Accept` correctamente — devolver `406` si no puedes satisfacer el tipo de medio solicitado
- Analizar y validar los parámetros de consulta estrictamente; rechazar parámetros desconocidos con `400` en lugar de ignorarlos
- Usar `If-Match` / `ETag` para concurrencia optimista en recursos mutables
- Soportar `Prefer: return=minimal` para permitir que los llamadores omitan el cuerpo de la respuesta en mutaciones

## Diseño de respuestas

- Envolvente consistente en todos los puntos finales — acordar una forma y nunca desviarse:
  ```json
  { "data": {}, "error": null, "meta": {} }
  ```
- Campos de fecha/hora: ISO 8601 con zona horaria (`2025-01-15T14:30:00Z`)
- Campos booleanos: usar `true`/`false` reales, nunca `"yes"`/`"no"` o `1`/`0`
- Null vs. ausente: elegir una convención y aplicarla en todas partes — preferir omitir campos opcionales ausentes

## Respuestas de error

- Cada respuesta de error incluye: `code` (cadena legible por máquina), `message` (legible por humanos), `details` opcional
- Los valores `code` son estables — los clientes se ramifican en ellos; `message` es para humanos y puede cambiar
- Nunca devolver `500` para errores del cliente; clasificar el error correctamente antes de responder
- Registrar el error completo del lado del servidor; devolver solo el resumen seguro al cliente

## Almacenamiento en caché

- Establecer `Cache-Control` en cada respuesta `GET` — por defecto a `no-store` solo si tienes una razón
- Usar `ETag` o `Last-Modified` para habilitar solicitudes condicionales
- El encabezado `Vary` debe enumerar cada encabezado que afecte la forma de la respuesta (por ejemplo, `Vary: Accept, Accept-Language`)
- Nunca almacenar en caché respuestas que contengan datos específicos del usuario sin la directiva `private`

## Limitación de velocidad

- Devolver `429 Too Many Requests` con encabezado `Retry-After`
- Exponer el estado del límite de velocidad en encabezados de respuesta: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Aplicar límites más estrictos a puntos finales de autenticación y operaciones en lote
- Limitar la velocidad por identidad autenticada cuando sea posible, solo por IP como alternativa

## Consumo del cliente

- Tratar todos los campos no documentados como inestables — no construir lógica sobre ellos
- Implementar retroceso exponencial con jitter para reintentos `429` y `5xx`
- Establecer tiempos de espera explícitos de lectura y conexión en cada cliente HTTP — nunca confiar en los valores predeterminados
- Verificar certificados TLS en todos los entornos; nunca deshabilitar la validación de certificados
