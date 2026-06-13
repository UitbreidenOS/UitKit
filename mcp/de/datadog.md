# MCP: Datadog

Verbinde Claude Code mit Datadog für Real-Time Observability — query Metrics, search Logs, inspiziere APM Traces und verwalte Monitors, ohne dein Terminal zu verlassen.

## Warum du das brauchst

Das Debuggen eines Latency-Spike oder Produktions-Incident bedeutet zwischen Datadog Dashboards zu springen, Metric-Queries zu kopieren, Ergebnisse in Claude zu pasten und Momentum zu verlieren. Datadog MCP eliminiert diesen Context-Switch — Claude queriet deine Live Metrics, Logs und Traces In-Context und hilft dir, sofort zu diagnostizieren und zu handeln.

## Voraussetzungen

- Datadog Account mit API-Zugriff (jeder Bezahlt-Plan)
- Ein **API-Key** — gefunden unter **Organization Settings → API Keys**
- Ein **Application-Key** — gefunden unter **Organization Settings → Application Keys** (Application-Keys sind Nutzer-scoped; nutze ein Service-Account für Shared-Use)
- Für EU oder GovCloud Deployments, dein `DD_SITE` Wert (siehe Konfiguration unten)

## Installation

Installiere offiziellen Datadog MCP Server via npx — keine Global-Installation erforderlich.

```bash
npx @datadog/mcp-datadog --version
```

Wenn das Package ohne Fehler resolves, bist du Ready zu konfigurieren.

## Konfiguration

Füge folgendes zu deinen `~/.claude/settings.json` (Nutzer-Level) oder `.claude/settings.json` (Projekt-Level) hinzu:

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["-y", "@datadog/mcp-datadog"],
      "env": {
        "DD_API_KEY": "YOUR_DD_API_KEY",
        "DD_APP_KEY": "YOUR_DD_APP_KEY",
        "DD_SITE": "datadoghq.com"
      }
    }
  }
}
```

**`DD_SITE` Werte nach Region:**

| Region | Wert |
|---|---|
| US1 (Standard) | `datadoghq.com` |
| US3 | `us3.datadoghq.com` |
| US5 | `us5.datadoghq.com` |
| EU1 | `datadoghq.eu` |
| GovCloud | `ddog-gov.com` |

Lass `DD_SITE` ungesetzt, wenn du auf der Standard-US1-Region bist.

## Schlüssel-Tools

| Tool | Beschreibung | Schlüssel-Parameter |
|---|---|---|
| `query_metrics` | Laufe eine Datadog Metrics-Query über ein Zeitfenster | `query` (DDog Query-String), `from`, `to` |
| `search_logs` | Suche Log-Events mit Filter-Syntax | `query`, `from`, `to`, `limit` |
| `list_dashboards` | Liste alle Dashboards in der Org | `filter_name` |
| `get_monitors` | Retrieve Monitors mit optionalem Status-Filter | `status` (`Alert`, `Warn`, `OK`, `No Data`), `tags` |
| `create_incident` | Öffne einen neuen Incident in Datadog Incident Management | `title`, `severity`, `customer_impacted` |
| `query_apm_traces` | Suche APM Traces nach Service, Operation oder Resource | `service`, `operation`, `resource`, `from`, `to`, `limit` |

## Verwendungsbeispiele

```
Zeige p99 Latenz für /api/checkout über die letzte 1 Stunde

Finde alle ERROR-Level Log-Einträge in Payment-Service von den letzten 30 Minuten

Liste alle Monitors derzeit in ALERT State

Welche APM Traces sind am langsamsten für den Orders Service in den letzten 15 Minuten?

Erstelle einen Sev-2 Incident "Erhöhte Fehlerrate auf Checkout-Service"
```

## Authentifizierung

1. Melde dich bei Datadog an und gehe zu **Organization Settings → API Keys**
2. Erstelle einen neuen API-Key — notiere den Schlüssel-Wert (gezeigt nur einmal)
3. Gehe zu **Organization Settings → Application Keys**
4. Erstelle einen Application-Key scoped zu deinem Nutzer oder einem Service-Account
5. Füge beide Werte zu den `env` Block in deinem settings.json hinzu, wie oben gezeigt

Mindest-Permissions für Application-Key: `metrics_read`, `logs_read`, `monitors_read`, `apm_read`. Füge `incidents_write` hinzu, wenn du möchtest, dass `create_incident` funktioniert.

## Tipps

- Datadog Metric-Queries nutzen die gleiche Syntax wie der Metrics Explorer: `avg:system.cpu.user{service:checkout}`. Copy direkt von der UI.
- `from` und `to` Parameter akzeptieren Unix Timestamps oder Relative Strings wie `now-1h`.
- `search_logs` nutzt Datadog Log-Query-Syntax — Facet-Filter wie `service:payment-service @http.status_code:500` funktionieren wie erwartet.
- `get_monitors` mit `status:Alert` ist der schnellste Weg, um während eines Incident ein Snapshot von aktiven Firing-Bedingungen zu bekommen.
- Für High-Cardinality APM-Queries, setze einen `limit` (Standard ist normalerweise 100), um langsame Responses zu vermeiden.
- Application-Keys sind standardmäßig Nutzer-scoped — wenn mehrere Team-Mitglieder diesen MCP nutzen, erstelle einen gemeinsamen Service-Account Application-Key, um Permission-Drift zu vermeiden, wenn jemand geht.
- Gestartet März 2026 als Teil von Datadog's offizieller MCP-Programm.

## Kosten-Notizen

Alle MCP-Calls konsumieren Datadog API-Quote. Metrics-Queries und Log-Searches zählen gegen deinen Plan's API-Rate-Limits. Vermeide High-Frequency-Automatisiert Queries (z.B. via Hooks), ohne dein Plan's Limits zu reviewed — Datadog erzwingt Per-Second und Per-Hour API-Caps auf Org-Level.

---
