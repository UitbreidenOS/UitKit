# Reglas de Observabilidad

## Aplicable a
Todos los servicios backend, workers e infraestructura — cualquier sistema que se ejecuta en producción.

## Reglas

1. **Logs, métricas y trazas son señales distintas — instrumenta los tres** — los logs explican qué sucedió, las métricas muestran tendencias y activan alertas, las trazas muestran dónde se invirtió tiempo en los límites de los servicios. Uno sin los otros deja puntos ciegos.

2. **Solo logs estructurados — nunca cadenas sin formato** — `{"level":"error","service":"payments","user_id":"u123","error":"card declined"}` es consultable. `ERROR: card declined for user u123` no lo es. Usa JSON o una librería de logging estructurado.

3. **Registra en los límites, no dentro de la lógica** — registra en la entrada y salida de manejadores HTTP, consumidores de colas y llamadas externas. No registres dentro de funciones puras o bucles ajustados.

4. **Incluye contexto de trazas en cada línea de log** — `trace_id`, `span_id` y `request_id` vinculan logs a trazas distribuidas. Sin ellos, correlacionar una línea de log a una solicitud específica entre servicios es adivinar.

5. **Usa las cuatro señales doradas como tu conjunto de métricas base** — latencia (p50, p95, p99), tráfico (solicitudes/seg), tasa de error (5xx%), y saturación (profundidad de cola, CPU, memoria). Alerta sobre estos antes de agregar métricas personalizadas.

6. **Histogramas en lugar de promedios para latencia** — los promedios ocultan distribuciones bimodales y colas largas. Rastrea p95 y p99. Un pico de latencia p99 con un promedio plano significa que tus usuarios más lentos están sufriendo en silencio.

7. **Nombra las métricas consistentemente** — `http_request_duration_seconds`, no `request_time` o `latency_ms`. Sigue las convenciones de nomenclatura de Prometheus: `<namespace>_<subsystem>_<name>_<unit>`. Unidades en el nombre, unidades base (segundos, bytes, no milisegundos).

8. **Instrumenta cada llamada externa** — consultas de base de datos, aciertos/fallos de caché, llamadas HTTP a terceros, publicación/consumo de colas de mensajes. Aquí es donde se acumula la latencia y se originan las fallas.

9. **Establece SLOs antes de configurar alertas** — define primero el presupuesto de error aceptable. Alerta sobre la tasa de quemado de SLO, no sobre umbrales de métricas sin procesar. Las alertas de umbral generan ruido; las alertas de tasa de quemado señalan impacto real en el usuario.

10. **Evita valores de etiqueta de alta cardinalidad en métricas** — `user_id` como etiqueta de Prometheus crea una serie temporal por usuario y falla tu backend de métricas. Las etiquetas deben tener cardinalidad acotada (código de estado, punto final, región — no IDs de usuario ni UUIDs).

11. **Muestrea trazas, no todas las trazas** — el muestreo de trazas al 100% es caro. Usa muestreo basado en cabeza o cola (siempre muestrea errores, muestrea una fracción de éxitos). OpenTelemetry soporta ambos.

12. **La política de retención es parte del diseño** — decide por adelantado: logs 30 días, trazas 7 días, métricas sin procesar 15 días, métricas agregadas 13 meses. La retención no planificada infla los costos de almacenamiento y ralentiza las consultas.

13. **Los puntos finales de salud no son observabilidad** — `/healthz` le dice al orquestador si el proceso está vivo. No te dice por qué las solicitudes son lentas. No sustituyas comprobaciones de salud por instrumentación real.

14. **Usa OpenTelemetry para instrumentación — evita SDKs específicos de proveedores** — OTLP es el formato de exportación estándar. Cambia de backends (Jaeger, Honeycomb, Datadog) cambiando el exportador, no la instrumentación.

15. **Alerta sobre síntomas, no causas** — alerta sobre "tasa de error > 1% durante 5 minutos", no "CPU > 80%". CPU alta es una posible causa; tasa de error elevada es un síntoma confirmado. Reduce la fatiga de alertas alertando sobre lo que experimentan los usuarios.


---
