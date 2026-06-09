# Reglas de Logging

Aplicar al agregar, revisar o configurar registros de aplicación.

## Estructura

- Emitir registros JSON estructurados — nunca cadenas de forma libre en producción
- Cada línea de registro debe incluir: `timestamp` (ISO 8601 UTC), `level`, `service`, `message`
- Agregar `trace_id` y `span_id` a cada línea de registro para correlación de rastreo distribuido
- Registrar `request_id` en cada línea emitida durante el ciclo de vida de una solicitud HTTP
- Usar nombres de campo consistentes en los servicios — acordar un esquema una sola vez y hacerlo cumplir

## Niveles

| Nivel | Usar para |
|---|---|
| `ERROR` | Una operación falló; puede ser necesaria atención humana |
| `WARN` | Estado inesperado pero la operación continuó; merece monitoreo |
| `INFO` | Eventos significativos normales: servicio iniciado, trabajo completado, usuario autenticado |
| `DEBUG` | Diagnósticos para desarrolladores — deshabilitados en producción por defecto |

- Nunca usar `ERROR` para fallos de negocios esperados (entrada inválida, no encontrado) — usar `WARN` o `INFO`
- Nunca usar `INFO` para ruido por solicitud en endpoints de alto rendimiento — usar `DEBUG`

## Contenido

- Registrar qué sucedió, por qué importa, e identificadores necesarios para investigar
- Incluir el mensaje de error completo y rastreo de pila en líneas `ERROR`
- Nunca registrar secretos, tokens, contraseñas, números de tarjeta de crédito o PII sin procesar
- Enmascarar u omitir encabezados `Authorization`, valores de cookies, y parámetros de consulta que contienen credenciales
- No registrar cuerpos de solicitud a menos que se esté depurando y aún así eliminar campos sensibles

## Volumen y costo

- Muestrear registros `DEBUG` e `INFO` de alta frecuencia en producción — registrar 1 de N, no cada evento
- Establecer retención de registros por nivel: errores 90 días, info 30 días, debug 7 días (ajustar según costo y necesidad de cumplimiento)
- Agregar marcadores `slow_query` y `high_latency` en lugar de registrar cada solicitud con verbosidad completa
- Centralizar registros en una plataforma — registros fragmentados entre servicios no funcionan durante incidentes

## Requisitos operacionales

- Los registros deben ser consultables dentro de segundos de su emisión — usar un agregador de registros estructurados (Loki, CloudWatch Logs Insights, Datadog)
- Alertar sobre picos en la tasa de `ERROR`, no solo en errores individuales
- Separar registros de aplicación de registros de acceso — los registros de acceso tienen diferentes reglas de retención y PII
- Nunca escribir registros solo en disco local en un entorno containerizado — se perderán al reiniciar
