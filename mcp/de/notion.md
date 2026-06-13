# MCP: Notion

Lese und schreibe Notion-Seiten, Datenbanken und Blöcke von Claude Code aus — durchsuche deinen Workspace, erstelle und aktualisiere Inhalte und frage strukturierte Datenbanken ab, ohne Terminal zu verlassen.

## Warum du das brauchst

Notion ist, wo viel Produkt-Kontext lebt: Specs, Meetingnotes, Decision Logs, Projekt-Datenbanken. Ohne MCP hat Claude keinen Zugang zu irgendetwas davon. Mit Notion MCP:
- Claude kann deinen ganzen Workspace durchsuchen und relevanten Kontext in jede Code-Session ziehen
- Datenbank-Abfragen bringen strukturierte Projekt-Daten (Tasks, Sprints, Entscheidungen) direkt in den Workflow
- Seiten von Claude zu erstellen und zu aktualisieren bedeutet, dass Dokumentation in der Session passiert, nicht danach
- Cross-Referenzing von Code-Änderungen gegen Notion-Specs oder ADRs wird zu einem einzelnen Prompt

## Installation

```bash
npm install -g @notionhq/notion-mcp-server
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer your-notion-integration-token\", \"Notion-Version\": \"2022-06-28\"}"
      }
    }
  }
}
```

## Schlüssel-Tools / Was es tut

- `search` — Volltext-Suche über alle Seiten und Datenbanken, auf die die Integration Zugriff hat
- `get_page` — hole eine Seite und ihre Eigenschaften nach Seiten-ID ab
- `create_page` — erstelle eine neue Seite in einer Parent-Seite oder Datenbank
- `update_page` — aktualisiere Seiten-Eigenschaften (Titel, Status, Daten, Selects, Relations)
- `get_database` — hole ein Datenbank-Schema und Metadaten
- `query_database` — frage eine Datenbank mit Filtern, Sorts und Pagination ab
- `create_database_item` — füge eine neue Reihe/Item zu einer Datenbank hinzu
- `update_database_item` — aktualisiere Eigenschaften auf einem bestehenden Datenbank-Item
- `append_block_children` — hänge Content-Blöcke (Paragraphen, Code, Listen, Callouts) an jede Seite an

## Verwendungsbeispiele

```
Frage meine Projekt-Datenbank ab und liste alle Tasks mit Status "In Progress" auf,
sortiert nach Fälligkeitsdatum. Zeige die Zuordnung und Priorität für jede.
```

```
Erstelle eine neue Seite in meiner Meetingnotes-Datenbank mit heutigem Datum als Titel,
und füge einen Agenda-Abschnitt mit diesen drei Topics hinzu: [liste Topics].
```

```
Durchsuche Notion nach unseren API-Design-Entscheidungen aus Q1 und fasse
die wichtigsten Entscheidungen zusammen, die wir um Authentifizierung und Versionierung getroffen haben.
```

```
Aktualisiere den Status von Task "ENG-Implement OAuth flow" zu Done
und setze das Completions-Datum auf heute.
```

```
Hänge eine Zusammenfassung dieser Coding-Session an meine Dev-Log-Seite an —
schließe ein, was wir änderten, was wir aufgeschoben haben und offene Fragen.
```

## Authentifizierung

1. Gehe zu **notion.so/my-integrations** und klicke auf **New integration**
2. Gib ihm einen Namen, wähle deinen Workspace und setze die Fähigkeiten: **Read content**, **Update content**, **Insert content**
3. Kopiere das **Internal Integration Token** — es beginnt mit `secret_`
4. Setze es als `Authorization`-Bearer-Wert im Konfig-Block oben
5. **Für jede Seite oder Datenbank, auf die die Integration Zugriff braucht:** öffne sie in Notion, klicke auf das Drei-Punkte-Menü, gehe zu **Connections** und füge deine Integration nach Namen hinzu

Die Integration sieht nur Seiten, die explizit mit ihr geteilt sind. Eine Parent-Seite zu teilen, teilt automatisch Child-Seiten nicht — du musst jede einzeln teilen, oder eine Top-Level-Seite teilen und **Include subpages** aktivieren.

## Tipps

**Finde Seiten-IDs aus URLs:** Notion-Seiten-IDs sind der 32-Zeichen-Hex-String am Ende der URL. Verwende `search`, um Seiten nach Name zu entdecken, statt manuell nach IDs zu suchen.

**Datenbank-Abfragen unterstützen Filter und Sorts:** Verwende den `filter`-Parameter mit zusammengesetzten Bedingungen (and/or), um dieselben Views nachzuvollziehen, die du in der Notion-UI hast. Das Filter-Schema spiegelt Notions Filter-API exakt.

**Rate Limit ist 3 Requests pro Sekunde:** Für Bulk-Operationen (viele Items erstellen, große Datenbanken abfragen), füge Verzögerungen zwischen Aufrufen hinzu oder batch Writes mit `append_block_children` mit mehreren Blöcken in einem Anruf.

**Rich Text vs Plain Text:** Die meisten `create_page`- und `update_page`-Felder erwarten Notions Rich-Text-Array-Format, nicht Plain Strings. Im Zweifelsfall wickle Text als `[{"type": "text", "text": {"content": "your text"}}]`.

**Verwende Search zum Bootstrapping:** Wenn du keine IDs hast, starte immer mit `search` mit einem beschreibenden Titel. Es gibt Seiten-IDs und Datenbank-IDs zurück, die du in nachfolgenden Aufrufen verwenden kannst.

---
