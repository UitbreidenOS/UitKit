# Hook: HTTP Webhook — Canalizar Eventos a Endpoints Externos

Demuestra el hook `"type": "http"`, que realiza POST de datos de eventos estructurados directamente a un endpoint HTTP sin requerir un script de shell. Úsalo para transmitir eventos de Claude Code a un panel, canal de Slack, plataforma de observabilidad o cualquier servicio compatible con webhooks.

## Qué hace

Cuando se configura, el harness serializa la carga útil completa del hook como JSON y realiza POST a la URL configurada. No se necesita script — el harness maneja la llamada HTTP. El endpoint recibe un cuerpo JSON que describe el evento, la herramienta involucrada (para eventos de uso de herramientas), el ID de sesión y el directorio del proyecto.

Forma típica de carga útil (varía según el tipo de evento):

```json
{
  "event": "PostToolUse",
  "session_id": "abc123",
  "project_dir": "/Users/you/myproject",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm run build"
  },
  "tool_response": {
    "output": "Build succeeded in 4.2s",
    "exit_code": 0
  },
  "timestamp": "2026-06-03T10:45:00Z"
}
```

Para eventos de ciclo de vida (`Stop`, `Start`, `PreCompact`) los campos `tool_name` / `tool_input` / `tool_response` están ausentes; en su lugar la carga útil contiene metadatos específicos del evento como `stop_reason` o `compact_summary`.

El endpoint debe responder con HTTP 2xx dentro del tiempo de espera configurado; cualquier otro código de estado se trata como un fallo de hook y se muestra a Claude como un error de herramienta. El harness no reintenta hooks HTTP fallidos.

## Cuándo se activa

Configurable por evento. Emparejamientos comunes:

| Evento | Uso típico |
|---|---|
| `PostToolUse` | Registrar cada llamada de herramienta en un registro de auditoría o backend de observabilidad |
| `Stop` | Notificar a un canal de Slack que una sesión terminó y resumir la última acción |
| `PreToolUse` | Transmitir comandos a un panel de actividad en tiempo real |
| `SubagentStop` | Registrar finalizaciones de subagentes en un rastreador de flujos de trabajo |

## Entrada settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/T00000/B00000/XXXXXXXXXXXX",
            "timeout": 10,
            "headers": {
              "Content-Type": "application/json",
              "X-Claude-Project": "${CLAUDE_PROJECT_DIR}"
            }
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "http",
            "url": "https://your-dashboard.example.com/api/claude-events",
            "timeout": 15,
            "headers": {
              "Authorization": "Bearer ${CLAUDE_DASHBOARD_TOKEN}",
              "Content-Type": "application/json"
            }
          }
        ]
      }
    ]
  }
}
```

Las variables de entorno en valores de `headers` se expanden por el harness en el momento de la llamada. Almacena secretos en tu entorno de shell o en un archivo `.env` provisto por tu perfil de shell — no codifiques tokens en settings.json.

## Notas

- **No se requiere script.** El harness envía el POST directamente; no hay un proceso de shell que mantener o hacer ejecutable.
- **La carga útil es el contexto de hook completo.** El harness serializa todo lo que pasaría a stdin de un hook de comando como el cuerpo POST. La forma es estable dentro de una versión mayor de Claude Code; trata los campos más allá de `event`, `session_id` y `tool_name` como informativos.
- **Los webhooks entrantes de Slack** esperan una forma específica de `{"text": "..."}` — devolverán 400 para una carga útil cruda de Claude. Usa un adaptador ligero (por ejemplo, un Cloudflare Worker o AWS Lambda) para transformar la carga útil antes de reenviarla a Slack.
- **Las plataformas de observabilidad** (Datadog, Honeycomb, Grafana) típicamente aceptan JSON arbitrario en un endpoint personalizado; mapea `tool_name` a un nombre de span y `tool_response.exit_code` a un código de estado.
- **Timeout** por defecto es 10 segundos si se omite. Para paneles en redes lentas, aumenta a 30. La sesión no se bloquea en la llamada HTTP más allá del tiempo de espera configurado — el harness agota el tiempo de espera y registra una advertencia en lugar de colgarse.
- **La verificación TLS** se realiza de forma predeterminada. Los certificados autofirmados requieren un proxy o un campo `ca_bundle` (consulta la documentación de harness para la lista completa de campos).

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
