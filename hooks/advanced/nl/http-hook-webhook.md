# Hook: HTTP Webhook — Pipe Events to External Endpoints

Demonstreert de `"type": "http"` hook, die gestructureerde event-gegevens direct naar een HTTP-eindpunt POSTt zonder dat een shell-script nodig is. Gebruik dit om Claude Code-events naar een dashboard, Slack-kanaal, observability-platform of een webhook-capable service te streamen.

## What it does

Wanneer geconfigureerd, serialiseert de harness de volledige hook-payload als JSON en POSTt deze naar de geconfigureerde URL. Er is geen script nodig — de harness regelt de HTTP-oproep. Het eindpunt ontvangt een JSON-body die het event, de betrokken tool (voor tool-use events), de sessie-ID en de projectmap beschrijft.

Typische payload-vorm (varieert per event-type):

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

Voor lifecycle-events (`Stop`, `Start`, `PreCompact`) ontbreken de velden `tool_name` / `tool_input` / `tool_response`; in plaats daarvan bevat de payload event-specifieke metadata zoals `stop_reason` of `compact_summary`.

Het eindpunt moet binnen de geconfigureerde timeout met HTTP 2xx reageren; elke andere statuscode wordt behandeld als een hook-fout en weergegeven aan Claude als een tool-fout. De harness probeert mislukte HTTP-hooks niet opnieuw.

## When it fires

Configureerbaar per event. Veelvoorkomende combinaties:

| Event | Typisch gebruik |
|---|---|
| `PostToolUse` | Elk tool-oproep in een audit trail of observability backend loggen |
| `Stop` | Een Slack-kanaal notificeren dat een sessie is beëindigd en de laatste actie samenvatten |
| `PreToolUse` | Opdrachten naar een real-time activiteitsdashboard streamen |
| `SubagentStop` | Subagent-voltooiingen in een workflowtracker vastleggen |

## settings.json entry

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

Omgevingsvariabelen in `headers`-waarden worden door de harness tijdens het oproepen uitgebreid. Sla geheimen op in uw shell-omgeving of een `.env`-bestand dat door uw shell-profiel wordt sourced — codeer tokens niet hard in settings.json.

## Notes

- **Geen script nodig.** De harness stuurt de POST direct; er is geen shell-proces om te onderhouden of uit te voeren.
- **Payload is de volledige hook-context.** De harness serialiseert alles wat het zou doorgeven aan stdin van een command hook als POST-body. Vorm is stabiel binnen een grote Claude Code-versie; behandel velden buiten `event`, `session_id` en `tool_name` als informatief.
- **Slack binnenkomende webhooks** verwachten een specifieke `{"text": "..."}` vorm — ze retourneren 400 voor een raw Claude-payload. Gebruik een lichte adapter (bijvoorbeeld een Cloudflare Worker of AWS Lambda) om de payload te transformeren voordat je deze naar Slack doorstuuret.
- **Observability-platforms** (Datadog, Honeycomb, Grafana) accepteren doorgaans willekeurige JSON op een aangepast eindpunt; map `tool_name` naar een span-naam en `tool_response.exit_code` naar een statuscode.
- **Timeout** is standaard 10 seconden als deze niet wordt opgegeven. Voor dashboards op trage netwerken, verhoog naar 30. De sessie blokkeert niet op de HTTP-oproep buiten de geconfigureerde timeout — de harness time-out en loggt een waarschuwing in plaats van te hangen.
- **TLS-verificatie** wordt standaard uitgevoerd. Zelfondertekende certificaten vereisen een proxy of een `ca_bundle`-veld (zie de harness-documentatie voor de volledige veldlijst).

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
