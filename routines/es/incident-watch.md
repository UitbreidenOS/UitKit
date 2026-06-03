# Agente de Vigilancia de Incidentes

## Qué hace

Se activa cuando una alerta o webhook señala un posible incidente — un pico en errores, una verificación de salud fallida, una alerta de PagerDuty, o cualquier señal externa enrutada al endpoint de la API de la rutina. En segundos desde que se recibe la señal, el agente reúne contexto estructurado: registros de errores recientes, los últimos despliegues, PRs abiertas fusionadas en las últimas 24 horas, y cualquier problema de GitHub relacionado. Luego redacta un resumen conciso del incidente y lo publica en un canal de Slack configurado o herramienta de gestión de incidentes. El objetivo es reducir los primeros 5–10 minutos de recopilación frenética de contexto durante un incidente.

## Disparador (horario / evento de GitHub / API)

- Tipo: Llamada API (webhook)
- Endpoint: la rutina expone un endpoint POST; los sistemas externos lo llaman para activar el agente
- Fuentes de alerta compatibles (enviar a este endpoint):
  - Webhooks de PagerDuty (`event_type: incident.trigger`)
  - Alertas del monitor de Datadog (integración webhook)
  - Alarmas de AWS CloudWatch (SNS → endpoint HTTP)
  - Webhooks de aplicación personalizada (cualquier carga JSON con un campo `message` o `summary`)
- Esquema de carga (mínimo requerido):
  ```json
  {
    "source": "pagerduty | datadog | cloudwatch | custom",
    "severity": "critical | high | warning",
    "title": "Human-readable alert title",
    "message": "Alert body / description",
    "service": "Name of affected service (optional)",
    "timestamp": "ISO 8601"
  }
  ```
- También se puede activar manualmente a través de API para pruebas o análisis retrospectivo

## Configuración

1. Registra el endpoint de la API de la rutina en tu plataforma de alertas como destino webhook.
2. Permisos de token de GitHub:
   - Contenidos: lectura (para obtener mensajes de commit recientes y registros si se almacenan en el repositorio)
   - Solicitudes de extracción: lectura (para encontrar PRs fusionadas recientemente)
   - Problemas: lectura y escritura (para buscar problemas relacionados y opcionalmente abrir un problema de incidente)
3. Configura acceso a la fuente de registros — al menos uno de:
   - `DATADOG_API_KEY` + `DATADOG_APP_KEY` (para consultas de registros a través de la API de Datadog)
   - `CLOUDWATCH_LOG_GROUP` + credenciales de AWS (para CloudWatch Logs Insights)
   - `LOG_FETCH_URL` — un endpoint HTTP genérico que acepta `?service=X&minutes=N` y devuelve líneas de registro recientes como JSON
4. Establece variables de entorno:
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   INCIDENT_SLACK_WEBHOOK=https://hooks.slack.com/services/...
   INCIDENT_CHANNEL=#incidents
   INCIDENT_OPEN_ISSUE=true    # "true" o "false" — si se abre un problema de GitHub
   LOG_SOURCE=datadog           # "datadog", "cloudwatch", o "custom"
   DEPLOY_LOOKBACK_HOURS=24    # cuán atrás escanear para despliegues recientes
   ```

## El indicador de rutina (el indicador exacto que ejecuta el agente programado)

```
Eres un agente de contexto de respuesta a incidentes. Una alerta acaba de sonar. Tu trabajo es reunir contexto rápidamente y producir un resumen estructurado del incidente. No diagnosticas la causa raíz — expones las señales que ayudan al ingeniero de guardia a hacerlo.

Carga de alerta inyectada en tiempo de ejecución:
- Fuente: $ALERT_SOURCE
- Gravedad: $ALERT_SEVERITY
- Título: $ALERT_TITLE
- Mensaje: $ALERT_MESSAGE
- Servicio afectado: $ALERT_SERVICE (puede estar vacío — inferir del título de alerta si es posible)
- Marca de tiempo de alerta: $ALERT_TIMESTAMP

Pasos:

1. DESPLIEGUES RECIENTES — consulta la actividad de despliegue de las últimas $DEPLOY_LOOKBACK_HOURS horas:
   a. GitHub: obtén PRs fusionadas en la rama predeterminada en la ventana de búsqueda. Para cada una, registra: número de PR, título, autor, hora de fusión, archivos cambiados (resumen).
   b. Si se configura una API de registro de despliegue, consulta los eventos de despliegue en la misma ventana. Registra: ID de despliegue, servicio, versión, desplegador, marca de tiempo, estado.
   Marca cualquier despliegue que toque el servicio afectado como "potencialmente relacionado".

2. REGISTROS DE ERRORES — obtén los últimos 15 minutos de registros para el servicio afectado usando $LOG_SOURCE:
   - Datadog: consulta `service:$ALERT_SERVICE status:error` en los últimos 15 minutos, devuelve hasta 20 líneas de registro
   - CloudWatch: ejecuta una consulta de Logs Insights en $CLOUDWATCH_LOG_GROUP filtrando por ERROR/FATAL en los últimos 15 minutos
   - Personalizado: GET $LOG_FETCH_URL?service=$ALERT_SERVICE&minutes=15
   Extrae: los 5 mensajes de error más frecuentes (con recuento de ocurrencia), cualquier rastreo de pila presente, cualquier ID de correlación.

3. PROBLEMAS RELACIONADOS — busca problemas de GitHub en $GITHUB_REPO que mencionen el nombre del servicio o términos clave de error de los registros. Devuelve hasta 5 más relevantes (por recencia y superposición de palabras clave). También verifica si hay problemas etiquetados como "incident" abiertos en los últimos 7 días.

4. CONTEXTO DEL SISTEMA — si está disponible, ten en cuenta:
   - Versión de despliegue actual / SHA de git del servicio afectado
   - Tiempo transcurrido desde el último despliegue exitoso
   - Si la alerta ha sonado antes en los últimos 7 días (verifica el historial de alertas si es accesible)

5. RESUMEN DE INCIDENTE DE BORRADOR — compone el siguiente documento:

---
## Alerta de Incidente — {SEVERITY} — {TITLE}
**Hora:** {ALERT_TIMESTAMP} | **Fuente:** {ALERT_SOURCE} | **Servicio:** {SERVICE}

### Detalles de alerta
{ALERT_MESSAGE — verbatim, trimmed to 500 chars if longer}

### Despliegues recientes (últimos {DEPLOY_LOOKBACK_HOURS}h)
{tabla: hora | PR/despliegue | autor | servicio | ¿potencialmente relacionado?}
{Si ninguno: "No hay despliegues en la ventana de búsqueda."}

### Errores principales en registros (últimos 15 min)
{lista numerada: N ocurrencias — "fragmento de mensaje de error"}
{Si no hay registros disponibles: "La obtención de registro falló o no se encontraron errores. Verifica $LOG_SOURCE manualmente."}

### Fragmento de rastreo de pila
{primer rastreo de pila encontrado, reducido a 20 líneas, o "Ninguno encontrado."}

### Problemas abiertos relacionados
{lista con viñetas: #N — título (abierto FECHA), o "Ninguno encontrado."}

### Puntos de partida recomendados
{3–5 numerados, hipótesis concretas o pasos de investigación basados en la evidencia anterior — ordenados por probabilidad dada la información, no genéricamente}

---
*Contexto reunido automáticamente en {NOW}. Verifica antes de actuar — los registros y datos de despliegue pueden estar incompletos.*

6. PUBLICAR EN SLACK — envía el resumen del incidente a $INCIDENT_SLACK_WEBHOOK:
   {"text": "<the summary above>", "channel": "$INCIDENT_CHANNEL"}
   Usa Slack's block kit si la carga lo admite, para representar la tabla claramente.

7. ABRIR PROBLEMA DE GITHUB (si $INCIDENT_OPEN_ISSUE=true):
   Abre un problema titulado "Incident: {TITLE} — {DATE}" con el resumen completo como cuerpo. Aplica etiquetas: `incident`, `{severity}`. Devuelve la URL del problema.

8. Devuelve: "Contexto de incidente reunido para '{TITLE}'. Publicado en Slack. Problema: {URL o 'no abierto'}."
```

## Salidas y notificaciones

- Mensaje de Slack: resumen completo del incidente publicado en `#incidents` (o canal configurado) dentro de ~30 segundos de la recepción de alerta
- Problema de GitHub (opcional): problema estructurado abierto para seguimiento y vinculación de post-mortem
- Registro: carga de alerta recibida, fuentes de datos consultadas, estado HTTP para publicación de Slack, URL del problema
- En caso de fallo de obtención de registro: el resumen se sigue publicando con una nota de que los datos de registro no están disponibles — la rutina nunca se bloquea en una fuente de datos fallida
- En alerta duplicada (mismo título dentro de 10 minutos): la rutina detecta esto y responde en hilo en el mensaje de Slack existente en lugar de publicar uno nuevo

## Ejecución de ejemplo

**Disparador:** Webhook de PagerDuty, 2026-06-10 02:47 UTC

**Carga de alerta:**
```json
{
  "source": "pagerduty",
  "severity": "critical",
  "title": "payments-service: error rate > 5% (was 0.2%)",
  "message": "Error rate on /api/v2/charge spiked to 8.3% over the past 5 minutes. P99 latency 4200ms.",
  "service": "payments-service",
  "timestamp": "2026-06-10T02:47:00Z"
}
```

**Despliegues recientes encontrados:**
- 01:22 UTC — PR #318 "refactor: move Stripe client initialization" — @jsmith — payments-service — POTENCIALMENTE RELACIONADO

**Errores principales en registros:**
1. 47x — `StripeInvalidRequestError: No such customer: cus_undefined`
2. 12x — `TypeError: Cannot read properties of undefined (reading 'id')`
3. 3x — `Connection timeout: postgres payments-db:5432`

**Mensaje de Slack publicado en #incidents:**

```
## Alerta de Incidente — CRÍTICA — payments-service: error rate > 5%
Hora: 2026-06-10 02:47 UTC | Fuente: PagerDuty | Servicio: payments-service

### Detalles de alerta
La tasa de error en /api/v2/charge aumentó a 8.3% durante los últimos 5 minutos. Latencia P99 4200ms.

### Despliegues recientes (últimas 24h)
| Hora | PR/Despliegue | Autor | Servicio | ¿Relacionado? |
|------|-----------|--------|---------|----------|
| 01:22 UTC | #318 — refactor: move Stripe client init | @jsmith | payments-service | SÍ |

### Errores principales en registros (últimos 15 min)
1. 47x — StripeInvalidRequestError: No such customer: cus_undefined
2. 12x — TypeError: Cannot read properties of undefined (reading 'id')
3. 3x — Connection timeout: postgres payments-db:5432

### Puntos de partida recomendados
1. Revisa PR #318 — refactor del cliente Stripe desplegado 85 minutos antes del pico; el ID de cliente puede estar sin definir después del cambio
2. Verifica si cus_undefined es una regresión en cómo se pasa el objeto de cliente al controlador de carga
3. Verifica que el grupo de conexión de postgres esté saludable — 3 errores de tiempo de espera pueden estar no relacionados pero vale la pena descartar
4. Verifica el panel de Datadog para errores de API en la misma ventana
5. Considera revertir #318 si la investigación toma > 15 minutos
```

**Problema de GitHub abierto:** #402 "Incident: payments-service error spike — 2026-06-10"
