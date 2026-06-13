# MCP: Sentry Remote

Verbinde Claude Code direkt mit Sentry für Error-Tracking, Issue-Triage und Release-Health-Monitoring — kein npm-Install erforderlich, läuft als Remote MCP über HTTP.

## Warum du das brauchst

Production-Errors debuggen bedeutet, zum Sentry-Dashboard zu wechseln, Stack Traces zu kopieren, in Claude einzufügen und den Kontext zu verlieren. Das Sentry Remote MCP eliminiert diese Hin- und Herbewegung — Claude liest deine echten Issues, vollständige Stack Traces und Release-Daten im Kontext und hilft dir, sofort auf sie zu handeln.

## Installation

Keine Installation erforderlich. Sentry Remote MCP verbindet sich via SSE-Transport. Es gibt kein npm-Paket zum Installieren oder Pflegen.

## Konfiguration

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_AUTH_TOKEN"
      }
    }
  }
}
```

Ersetze `YOUR_SENTRY_AUTH_TOKEN` mit deinem Token (siehe Authentifizierung unten).

## Schlüssel-Tools

| Tool | Was es tut |
|---|---|
| `list_issues` | Frage offene Issues mit Filtern ab (Projekt, Priorität, Env, Date Range) |
| `get_issue` | Hole komplette Issue-Details inkl. Stack Trace und Metadaten |
| `resolve_issue` | Markiere ein Issue als gelöst |
| `list_events` | Liste alle Events, die mit einem Issue verbunden sind, auf |
| `get_event` | Rufe eine spezifische Event-Payload ab |
| `list_releases` | Liste Releases für ein Projekt auf |
| `get_release` | Release-Details inkl. Error-Rate, Adoption und Regressions |
| `list_projects` | Liste alle Projekte in deiner Organisation auf |
| `create_comment` | Füge einen Kommentar zu einem Issue hinzu |
| `assign_issue` | Weise ein Issue einem Team-Mitglied zu |

## Verwendungsbeispiele

```
Liste alle ungelösten P0-Issues aus den letzten 24 Stunden auf

Zeige den vollständigen Stack Trace für Issue PROJ-1234

Löse alle Issues, die als Duplicate getaggt sind, im Auth-Projekt

Wie sieht der Error-Rate-Trend für das v2.1.0-Release aus?

Finde alle TypeErrors in Production diese Woche und gruppiere sie nach Datei

Welche Issues haben den höchsten User-Impact in Production gerade?
```

## Authentifizierung

1. Melde dich in Sentry an und gehe zu **User Settings → API Tokens**
2. Erstelle einen neuen Token mit diesen Scopes:
   - `project:read`
   - `issue:read`
   - `issue:write` (erforderlich für Resolve- und Comment-Aktionen)
3. Kopiere den Token-Wert — er wird nur einmal angezeigt
4. Füge ihn in den `Authorization`-Header im Konfig-Block oben ein

Org-Level-Tokens (für Multi-Projekt-Orgs) funktionieren gleich — erstelle sie unter **Organization Settings → API Tokens**.

## Tipps

- Remote MCPs verwenden `transport: "sse"` und eine URL — keine `command` oder `args` Felder. Wenn du Start-up-Fehler siehst, verifiziere die Konfiguration nutzt nicht das npx-Style-Format.
- Sentry Remote MCP wurde im Februar 2026 als Teil von Sentrys offiziellem MCP-Programm gestartet.
- Filtere immer nach `environment` (Production vs Staging), wenn du Issues abfragst — Env-Mischung in Triage verschwendet Zeit.
- `search_errors` unterstützt Sentrys Abfrage-Syntax: `is:unresolved level:error user.email:*` — dieselbe Syntax, die in der Sentry-UI verwendet wird.
- `get_release` ist der schnellste Weg zu prüfen, ob ein neues Deployment eine Regression einführte, bevor dein Monitoring-Alert feuert.
- Pipe `get_issue`-Ausgabe in eine Code-Fix-Anfrage — Claude hat den vollen Kontext zum Schreiben eines gezielten Patches.

---
