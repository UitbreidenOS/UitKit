# MCP: Atlassian

Verbinde Claude Code mit Jira und Confluence. Lese Tickets, aktualisiere Issue-Status, schreibe Dokumentation, führe JQL-Abfragen aus und verknüpfe Commits mit Issues — ohne deinen Browser zu öffnen oder deinen Entwicklungs-Workflow zu verlassen.

## Warum du das brauchst

Projektmanagement und Dokumentation befinden sich in Atlassian, aber der Kontextwechsel zwischen Jira, Confluence und deinem Editor unterbricht den Workflow. Mit Atlassian MCP:
- Sprint-Planung, Ticket-Triage und Status-Updates finden in derselben Session wie deine Code-Änderungen statt
- Claude kann das, was es gerade gebaut hat, direkt mit dem Jira-Ticket verknüpfen, das es angefordert hat
- Confluence-Dokumentation bleibt mit der Implementierung synchron, weil Claude beide gleichzeitig schreiben kann
- JQL-Abfragen lassen dich Sprint-Daten filtern, Blocker finden oder Workload prüfen, ohne das Board-UI zu laden
- Release Notes, Retro-Zusammenfassungen und Architektur-Docs werden aus echten Ticket-Daten generiert, nicht aus Erinnerungen

## Installation

Installiere über das offizielle MCP-Paket von Atlassian aus dem Atlassian Developer Portal oder via npm:

```bash
npm install -g @atlassian/mcp
```

Wenn das Paket über direkten Download vom Atlassian Developer Portal verfügbar ist, folge dem plattformspezifischen Installer und notiere den Binär-Pfad für den Konfig-Block unten.

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp"],
      "env": {
        "ATLASSIAN_API_TOKEN": "your-atlassian-api-token",
        "ATLASSIAN_EMAIL": "you@yourcompany.com",
        "ATLASSIAN_BASE_URL": "https://your-org.atlassian.net"
      }
    }
  }
}
```

Ersetze `your-org` durch deine tatsächliche Atlassian-Subdomain.

## Schlüssel-Tools

**Jira**

- `get_issue` — hole ein Jira-Issue mit vollständigen Details: Beschreibung, Kommentare, Status, Zugeordneter, verknüpfte Issues
- `create_issue` — erstelle ein neues Ticket mit Typ, Zusammenfassung, Beschreibung, Zugeordnetem, Labels und Priorität
- `update_issue` — aktualisiere jedes Feld in einem bestehenden Issue
- `search_issues` — führe eine JQL-Abfrage aus und gebe gefundene Issues zurück
- `get_project` — hole Projekt-Metadaten und Board-Konfiguration
- `add_comment` — füge einen Kommentar zu jedem Issue hinzu
- `transition_issue` — bewege ein Issue durch den Workflow (z.B. To Do → In Progress → Done)
- `get_sprint` — hole alle Issues im aktuellen oder einem bestimmten Sprint

**Confluence**

- `get_page` — hole eine Confluence-Seite nach ID oder Titel mit vollständigem Body-Inhalt
- `create_page` — erstelle eine neue Seite in einem bestimmten Space
- `update_page` — aktualisiere den Inhalt einer bestehenden Seite
- `search_content` — Volltext-Suche über alle Confluence-Spaces

## Verwendungsbeispiele

```
Finde alle Tickets im aktuellen Sprint, die mir zugeordnet sind, und fasse zusammen
was noch zu tun ist, gruppiert nach Status.
```

```
Ich habe gerade PROJ-123 behoben — bewege es zu Done und füge einen Kommentar
mit einem Link zu PR #456 und einer Zusammenfassung des Fixes hinzu.
```

```
Suche Confluence nach unserer Authentifizierungs-Architektur-Dokumentation
und fasse die wichtigsten Design-Entscheidungen und offenen Fragen zusammen.
```

```
Durchsuche die Codebase nach allen TODO-Kommentaren, erstelle dann ein Jira-Ticket
für jeden im TECH-Projekt, mir zugeordnet, mit Datei-Pfad und Zeilennummer in der Beschreibung.
```

```
Generiere Release Notes aus allen Tickets, die im letzten Sprint zu Done bewegt wurden,
und erstelle eine neue Confluence-Seite im Engineering-Space mit dem Titel "Release Notes — Sprint 42".
```

## Authentifizierung

1. Melde dich in deinem Atlassian-Konto an und gehe zu **Account settings → Security → API tokens**
2. Klicke auf **Create API token**, gib ein Label ein und kopiere den Wert sofort (er wird nicht erneut angezeigt)
3. Setze die drei erforderlichen Env-Variablen:
   - `ATLASSIAN_API_TOKEN` — das Token, das du gerade kopiert hast
   - `ATLASSIAN_EMAIL` — die E-Mail-Adresse deines Atlassian-Kontos
   - `ATLASSIAN_BASE_URL` — deine Instance-URL, z.B. `https://acme.atlassian.net`
4. Das Token verwendet HTTP Basic Auth: E-Mail als Benutzername, Token als Passwort

**OAuth vs API Token:** API Tokens sind einfacher und reichen für persönliche oder kleine Team-Nutzung. Verwende Atlassian OAuth 2.0 (3-legged), wenn du eine Server-seitige Integration aufbaust, die im Namen mehrerer Nutzer handelt.

## Tipps

**JQL-Syntax:** `search_issues` akzeptiert alle gültigen JQL. Nützliche Patterns:
- Aktueller Sprint: `sprint in openSprints() AND assignee = currentUser()`
- Blocker: `issueType = Bug AND priority = Highest AND status != Done`
- Kürzliche Änderungen: `updated >= -7d AND project = PROJ ORDER BY updated DESC`

**Paginierung:** Große JQL-Ergebnissätze sind paginiert. Wenn du alle Ergebnisse brauchst, sage Claude, dass es nachfolgende Seiten mit `startAt`-Offset abrufen soll, bis das Total ausgeschöpft ist.

**Confluence-Seiten-IDs:** Die Seiten-ID erscheint in der Confluence-URL als `/pages/123456789/`. Verwende diese beim Aufrufen von `get_page` oder `update_page` für Präzision — titelbasisierte Lookups können in großen Spaces mehrdeutig sein.

**Kombiniere Jira und Confluence:** Die mächtigsten Workflows nutzen beide. Hole Sprint-Tickets mit `search_issues`, fasse die Arbeit zusammen und schreibe das Ergebnis mit `create_page` in eine Confluence-Seite — alles in einer Frage.

**Keine Credentials committen:** Behalte `ATLASSIAN_API_TOKEN` in deiner globalen `~/.claude.json`, nicht in einer Projekt-Level `.claude/mcp.json`, die in Version Control committet werden könnte.

---
