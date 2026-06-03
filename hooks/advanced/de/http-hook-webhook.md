# Hook: HTTP Webhook — Events an externe Endpoints weiterleiten

Zeigt den `"type": "http"` Hook, der strukturierte Eventdaten direkt an einen HTTP-Endpoint sendet, ohne ein Shell-Skript zu benötigen. Nutzen Sie dies, um Claude Code Events in ein Dashboard, einen Slack-Channel, eine Observability-Plattform oder einen beliebigen Webhook-fähigen Service zu streamen.

## Was es macht

Wenn konfiguriert, serialisiert die Harness die vollständige Hook-Payload als JSON und POSTet sie an die konfigurierte URL. Kein Skript erforderlich — die Harness kümmert sich um den HTTP-Aufruf. Der Endpoint erhält einen JSON-Body mit einer Beschreibung des Events, des beteiligten Tools (für Tool-Use-Events), der Session-ID und des Projektverzeichnisses.

Typische Payload-Form (variiert je nach Eventtyp):

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

Bei Lifecycle-Events (`Stop`, `Start`, `PreCompact`) fehlen die Felder `tool_name` / `tool_input` / `tool_response`; stattdessen trägt die Payload ereignisspezifische Metadaten wie `stop_reason` oder `compact_summary`.

Der Endpoint muss mit HTTP 2xx innerhalb des konfigurierten Timeouts antworten; jeder andere Statuscode wird als Hook-Fehler behandelt und Claude als Toolfehler angezeigt. Die Harness wiederholt fehlgeschlagene HTTP-Hooks nicht.

## Wann es aktiviert wird

Konfigurierbar pro Event. Häufige Kombinationen:

| Event | Typische Anwendung |
|---|---|
| `PostToolUse` | Alle Toolaufrufe in einen Audit-Trail oder ein Observability-Backend protokollieren |
| `Stop` | Einen Slack-Channel benachrichtigen, dass eine Session beendet wurde, und die letzte Aktion zusammenfassen |
| `PreToolUse` | Befehle in ein Live-Activity-Dashboard streamen |
| `SubagentStop` | Subagent-Abschlüsse in einem Workflow-Tracker aufzeichnen |

## settings.json Eintrag

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

Umgebungsvariablen in `headers`-Werten werden von der Harness zur Aufrufzeit expandiert. Speichern Sie Geheimnisse in Ihrer Shell-Umgebung oder einer `.env`-Datei, die von Ihrem Shell-Profil sourced wird — codieren Sie Tokens nicht hardcodiert in settings.json ein.

## Hinweise

- **Kein Skript erforderlich.** Die Harness sendet das POST direkt; es gibt keinen Shell-Prozess zu verwalten oder ausführbar zu machen.
- **Payload ist der volle Hook-Kontext.** Die Harness serialisiert alles, was sie an die stdin eines Command-Hooks übergeben würde, als POST-Body. Die Form ist stabil innerhalb einer Major Claude Code-Version; behandeln Sie Felder jenseits von `event`, `session_id` und `tool_name` als informativ.
- **Slack Incoming Webhooks** erwarten eine spezifische `{"text": "..."}` Form — sie geben 400 für eine rohe Claude-Payload zurück. Nutzen Sie einen leichtgewichtigen Adapter (z.B. einen Cloudflare Worker oder AWS Lambda), um die Payload vor der Weiterleitung an Slack zu transformieren.
- **Observability-Plattformen** (Datadog, Honeycomb, Grafana) akzeptieren in der Regel beliebiges JSON auf einem benutzerdefinierten Endpoint; mappen Sie `tool_name` auf einen Span-Namen und `tool_response.exit_code` auf einen Statuscode.
- **Timeout** standardmäßig 10 Sekunden, wenn nicht angegeben. Für Dashboards in langsamen Netzwerken auf 30 erhöhen. Die Session blockiert nicht auf dem HTTP-Aufruf über den konfigurierten Timeout hinaus — die Harness läuft ab und protokolliert eine Warnung, anstatt zu hängen.
- **TLS-Verifikation** wird standardmäßig durchgeführt. Self-signed Certificates benötigen einen Proxy oder ein `ca_bundle`-Feld (siehe Harness-Dokumentation für die vollständige Feldliste).

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
