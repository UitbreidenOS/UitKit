# MCP: Linear

Verwalte Linear-Issues, Projekte und Zyklen direkt von Claude Code aus — frage Tickets ab, aktualisiere Status, erstelle Issues und führe Triage-Workflows durch, ohne zum Browser zu wechseln.

## Warum du das brauchst

Linear ist, wo Engineering-Arbeit verfolgt wird. Ohne MCP kann Claude Code schreiben, aber hat keine Awareness, was das Team tatsächlich arbeitet, was blockiert ist oder was im aktuellen Sprint liegt. Mit Linear MCP:
- Issue-Kontext fließt direkt in Code-Sessions — kein Copy-Pasting von Ticket-Beschreibungen
- Issues aus Code zu erstellen (TODOs, Bug-Entdeckungen, Refactor-Kandidaten) braucht einen Prompt
- Sprint-Planung, Triage und Status-Updates finden im gleichen Workflow wie Entwicklung statt
- Cross-Projekt-Reporting (Velocity, Blocker, Cycle-Burndown) ist eine einzelne Abfrage entfernt

## Installation

```bash
npm install -g @linear/mcp-server
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-linear-api-key-here"
      }
    }
  }
}
```

## Schlüssel-Tools / Was es tut

- `get_issue` — rufe ein einzelnes Issue nach Bezeichner ab (z.B. ENG-123) oder UUID, inkl. Beschreibung, Status, Zugeordnetem und Kommentaren
- `create_issue` — erstelle ein neues Issue mit Titel, Beschreibung, Team, Zugeordnetem, Priorität, Labels und Zyklus
- `update_issue` — aktualisiere jedes Feld auf einem bestehenden Issue: Status, Zugeordneter, Priorität, Fälligkeitsdatum, Schätzung
- `search_issues` — Volltext- und gefilterte Suche über Issues nach Team, Status, Zugeordnetem, Label oder Zyklus
- `list_teams` — liste alle Teams in der Workspace mit ihren IDs und Keys auf
- `list_projects` — liste Projekte mit Milestone- und Progress-Daten auf
- `list_cycles` — liste Zyklen (Sprints) für ein Team mit Start/End-Daten und Progress auf
- `get_cycle` — hole einen bestimmten Zyklus mit allen seinen Issues
- `create_comment` — füge einen Kommentar zu jedem Issue hinzu
- `list_workflow_states` — liste alle States für ein Team auf (z.B. Todo, In Progress, In Review, Done)

## Verwendungsbeispiele

```
Zeige mir alle offenen Bugs, die mir im aktuellen Zyklus zugeordnet sind,
sortiert nach Priorität. Schließe die Issue-ID und aktuellen Status ein.
```

```
Scanne die Codebase nach TODO und FIXME Kommentaren, erstelle dann ein Linear-Issue
für jeden im ENG-Team mit Label "tech-debt" und Priorität Medium.
```

```
Bewege Issue ENG-123 in den "In Review"-State und füge einen Kommentar
mit diesem PR-Link und einer Zusammenfassung der Änderung hinzu.
```

```
Liste alle Issues in der Backlog sortiert nach Priorität und Schätzung auf,
dann schlage einen Sprint-Plan vor, der in 40 Story Points passt.
```

```
Zeige mir alles, das als blockiert im aktuellen Zyklus markiert ist
und liste die blockierende Abhängigkeit für jedes Issue auf.
```

## Authentifizierung

1. Gehe zu **linear.app → Settings → API** (oder direkter Link: `linear.app/settings/api`)
2. Klicke auf **Create new API key** unter Personal API keys
3. Nenne es (z.B. `claude-code`) und kopiere den Key — er wird nur einmal angezeigt
4. Setze es als `LINEAR_API_KEY` im Konfig-Block oben

Für Team-Deployments, wo mehrere Personen Zugang brauchen, erstelle stattdessen eine OAuth-App unter **Settings → API → OAuth applications**.

## Tipps

**Rufe immer zuerst `list_teams` auf:** Team-IDs (UUIDs, nicht nur der Key wie `ENG`) sind beim Erstellen von Issues erforderlich. Führe `list_teams` einmal aus und notiere die UUID für jedes Team, mit dem du arbeiteest.

**Issue-Bezeichner vs UUIDs:** Die meisten Tools akzeptieren sowohl `ENG-123` (menschenlesbarer Bezeichner) als auch die komplette UUID. Verwende den Bezeichner in Prompts — er ist leichter zu referenzieren und zu verfolgen.

**Workflow-States variieren nach Team:** States wie "In Review" oder "QA" existieren möglicherweise nicht auf jedem Team. Rufe `list_workflow_states` für das relevante Team auf, bevor du versuchst, den Status zu aktualisieren, damit du die exakten State-Namen und IDs kennst.

**Zyklus-Abfragen für Sprint-Arbeit:** Verwende `get_cycle` statt `search_issues`, wenn du alles im aktuellen Sprint möchtest — es gibt den kompletten Issue-Satz zurück ohne manuelle Filterung.

**Bulk-Erstellung mit Bedacht:** Das Erstellen vieler Issues in einer Session ist schnell, aber Linear sendet Benachrichtigungen für jedes. Warne das Team oder verwende einen Service-Account-API-Key für Bulk-Operationen.

---
