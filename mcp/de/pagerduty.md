# MCP: PagerDuty

Verbinde Claude Code mit PagerDuty für Incident-Management — liste aktive Incidents auf, überprüfe On-Call-Schedules, acknowledge und resolve Alerts, und erstelle neue Incidents ohne dein Terminal zu verlassen.

## Warum du das brauchst

Während eines Incident bedeutet Switching zu der PagerDuty UI, Focus zu brechen. PagerDuty MCP lässt Claude Live-Incident-State querieren, identifizieren, wer On-Call ist, und acknowledge/resolve Actions direkt nehmen — dich im Editor halten, während du das Problem arbeitest.

## Voraussetzungen

- PagerDuty Account (jeder Plan mit REST API Zugriff)
- Ein **REST API-Key** — gefunden unter **User Settings → API Access Keys** (Nutzer Token) oder **Integrations → API Access Keys** (Account-Level Token; erfordert Admin)
- Deine Emailadresse, die mit dem PagerDuty Account assoziiert ist (erforderlich für Write-Operationen)

## Installation

Der PagerDuty MCP-Server ist als npx-Package verfügbar. Keine Global-Installation erforderlich.

```bash
npx @pagerduty/mcp --version
```

Alternativ, PagerDuty unterstützt ein SSE Remote-Endpoint für Teams, die es bevorzugen, keinen Lokal-Prozess zu laufen. Siehe Konfiguration unten für beides.

## Konfiguration

**Option A — npx (empfohlen für Lokal-Nutzung):**

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp"],
      "env": {
        "PD_API_TOKEN": "YOUR_PAGERDUTY_REST_API_KEY",
        "PD_USER_EMAIL": "you@yourcompany.com"
      }
    }
  }
}
```

**Option B — SSE Remote-Endpoint:**

```json
{
  "mcpServers": {
    "pagerduty": {
      "transport": "sse",
      "url": "https://mcp.pagerduty.com/sse",
      "headers": {
        "Authorization": "Token token=YOUR_PAGERDUTY_REST_API_KEY"
      }
    }
  }
}
```

Nutze Option B, wenn dein Team eine gemeinsame, zentral verwaltete Verbindung ohne API-Tokens zu Individual-Developer-Maschinen verteilt haben möchte.

## Schlüssel-Tools

| Tool | Beschreibung | Schlüssel-Parameter |
|---|---|---|
| `list_incidents` | Liste Incidents mit Status- und Urgency-Filter | `status` (`triggered`, `acknowledged`, `resolved`), `urgency` (`high`, `low`), `service_ids`, `limit` |
| `get_incident` | Fetch Full-Detail für einen einzelnen Incident | `incident_id` |
| `acknowledge_incident` | Acknowledge einen Incident (stoppt Eskalation) | `incident_id` |
| `resolve_incident` | Resolve einen Incident | `incident_id`, `resolution_note` |
| `list_services` | Liste alle PagerDuty Services im Account | `query` (Name Filter) |
| `get_on_call` | Bekommen Current On-Call Nutzer für einen Schedule oder Eskalations-Policy | `schedule_ids`, `escalation_policy_ids`, `since`, `until` |
| `create_incident` | Öffne neuen Incident auf einem Service | `title`, `service_id`, `urgency`, `body` |

## Verwendungsbeispiele

```
Wer ist jetzt On-Call für den Payments-Service?

Liste alle offenen P1 Incidents über die Org auf

Acknowledge Incident INC-123456 und hinterlasse eine Notiz, dass ich untersuche

Resolve INC-789012 mit Resolution-Note "Rolled back Deploy v2.4.1"

Erstelle einen High-Urgency Incident auf dem Checkout-Service, titel "Database-Connection-Pool erschöpft"
```

## Authentifizierung

**Nutzer API-Token (Read + Write für dein eigenes User):**
1. Melde dich bei PagerDuty an und gehe zu **User Icon → My Profile → User Settings → Create API User Token**
2. Copy den Token-Wert — er ist gezeigt nur einmal
3. Paste in `PD_API_TOKEN` in deinem settings.json

**Account-Level API-Token (Full-Account-Zugriff, erfordert Admin-Role):**
1. Gehe zu **Integrations → API Access Keys → Create New API Key**
2. Label es klar (z.B. `claude-code-mcp`) und copy den Wert

Acknowledge und Resolve Operations erfordern, dass `PD_USER_EMAIL` zur Email des Nutzers, der dem Token assoziiert ist, gesetzt wird. Write-Operationen durch ein Account-Level Token erfordern auch das Email-Feld für Audit-Log Attribution.

## Tipps

- `list_incidents` mit `status:triggered` gibt dir alle Unacknowledged Firing Incidents — der schnellste Weg, um Blast-Radius während eines Outage zu bewerten.
- `get_on_call` akzeptiert Zeitfenster (`since`, `until`), so du kannst Future On-Call Rotations überprüfen, nicht nur den aktuellen Moment.
- PagerDuty Incident-IDs in der API sind Numerisch (z.B. `P1234AB`) — du kannst sie in der URL jeder Incident-Detail-Seite finden.
- `create_incident` erfordert einen gültigen `service_id`. Nutze `list_services` zuerst, wenn du die ID nicht auswendig kennst.
- Resolve Incidents via MCP triggert immer noch PagerDuty's Normal Post-Incident-Notification-Flow — Stakeholder werden wie konfiguriert benachrichtigt.
- Für Accounts auf PagerDuty's AIOps oder Event Intelligence Plan, Incident-Merging und Alert-Correlation-Daten ist via zusätzliche Tools verfügbar, die hier nicht aufgelistet sind — überprüfe den Package-Changelog für neu hinzugefügte Tools.

## Kosten-Notizen

Der PagerDuty MCP nutzt PagerDuty's REST API v2, das in allen Bezahl-Plänen enthalten ist. Es gibt keine Per-Call-Fees. Rate-Limits werden bei 960 Requests/Minute pro API-Token für die meisten Endpoints erzwungen — well über Interaktive Nutzung, aber relevant für Automatisiert-Workflows.

---
