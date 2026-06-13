# MCP: Neon

Verwalte Neon-Postgres-Datenbanken direkt von Claude Code aus — erstelle Projekte, führe SQL aus, verzweige Datenbanken für sichere Migrationen und rufe Connection Strings ab, ohne deinen Editor zu verlassen.

## Warum du das brauchst

Datenbank-Arbeit während der Entwicklung hat zwei Fehlermodi: Migrationen direkt auf Production ausführen (gefährlich) und eine separate lokale Postgres-Instanz pflegen (Reibung). Neon löst beide. Sein Branching-Modell lässt dich eine isolierte Kopie jeder Datenbank in etwa 2 Sekunden erstellen. Mit dem Neon MCP kann Claude verzweigen, migrieren, validieren und aufräumen — alles in einer Konversation.

## Installation

Keine Installation erforderlich. Neon MCP ist ein Remote-Server, auf den über SSE-Transport zugegriffen wird.

## Konfiguration

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer YOUR_NEON_API_KEY"
      }
    }
  }
}
```

Ersetze `YOUR_NEON_API_KEY` mit deinem Schlüssel (siehe Authentifizierung unten).

## Schlüssel-Tools

| Tool | Was es tut |
|---|---|
| `create_project` | Erstelle ein neues Neon-Projekt |
| `list_projects` | Liste alle Projekte in deinem Konto auf |
| `get_project` | Hole Projekt-Details inkl. Region, Postgres-Version und Settings |
| `execute_sql` | Führe beliebiges SQL gegen jede Datenbank oder jeden Branch aus |
| `create_branch` | Verzweige eine Datenbank von Main, einem benannten Branch oder einem Timestamp |
| `list_branches` | Liste alle Branches für ein Projekt auf |
| `delete_branch` | Lösche einen Branch, wenn fertig |
| `get_connection_string` | Gib die Connection String für ein Projekt/Branch zurück, formatiert für ein gegebenes ORM |
| `run_migration` | Wende eine Migrations-Datei gegen einen bestimmten Branch an |
| `get_schema` | Introspektion des kompletten Schemas für eine Datenbank oder einen Branch |

## Verwendungsbeispiele

```
Erstelle ein neues Neon-Projekt namens my-app mit einer Datenbank namens app_db

Verzweige die Production-Datenbank für diesen Migrations-Test

Führe diese Migrations-SQL auf dem feature-auth-Branch aus und zeige mir das Ergebnis

Vergleiche das Schema zwischen dem Main-Branch und dem feature-auth-Branch

Gib mir die Prisma-Connection-String für die Staging-Datenbank

Lösche den feature-auth-Branch — Migration ist gemergt
```

## Authentifizierung

1. Melde dich in [console.neon.tech](https://console.neon.tech) an
2. Gehe zu **Account Settings → API Keys**
3. Generiere einen neuen API-Schlüssel — gib ihm einen beschreibenden Namen (z.B. `claude-mcp`)
4. Kopiere den Schlüssel-Wert sofort — er wird nicht erneut angezeigt
5. Füge ihn zum `Authorization`-Header im Konfig-Block oben hinzu

## Tipps

- Branch-Erstellung braucht etwa 2 Sekunden, unabhängig von der Datenbank-Größe — verwende einen Branch für jeden Migrations-Test-Lauf, nicht nur für riskante.
- Neon Remote MCP wurde im Februar 2026 als Teil von Neons offiziellem Developer-Tooling gestartet.
- `get_connection_string` formatiert automatisch für Drizzle, Prisma und psycopg2 — spezifiziere dein ORM in der Anfrage.
- Branches sind Copy-on-Write auf der Storage-Schicht, sodass sie minimalen Disk-Space brauchen, bis Writes divergieren.
- Verwende `create_branch` mit einem Timestamp-Argument, um einen Bug nachzuvollziehen, der zu einem bestimmten Zeitpunkt auftrat.
- Nach dem Validieren einer Migration auf einem Branch, verwende `execute_sql` auf Main, um sie anzuwenden — oder verbinde das mit einem Deployment-Workflow mit dem GitHub MCP.
- Der Free-Tier enthält 10 Branches pro Projekt — mehr als genug für aktive Entwicklung.

---
