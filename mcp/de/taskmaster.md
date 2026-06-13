# MCP: Task Master

AI-gesteuerte Aufgaben-Verwaltung mit Kontext-Isolation — zerlege große Features in verfolgte Subtasks, behalte Progress über Sessions bei und koordiniere Multi-Agent-Arbeit von einem strukturierten Task-Graph.

## Warum du das brauchst

Lange Features spannen mehrere Sessions und involvieren oft parallele Workstreams. Ohne persistentes Task-Tracking, startet Claude jede Session ohne zu wissen, was fertig ist, was als nächstes kommt oder was blockiert ist. Task Master löst das:
- Eine PRD oder Feature-Beschreibung wird in einer Frage zu einer strukturierten, Dependency-geordneten Task-Liste
- Progress persistiert in deinem Repository — jede Session nimmt genau dort auf, wo die letzte stoppte
- Dependency-Ordnung bedeutet `next_task` gibt dir immer das richtige Ding zu arbeiten, nicht eine Vermutung
- Komplexe Aufgaben können zu Subtasks expandiert und parallelen Agents, jede mit isoliertem Kontext, übergeben werden
- Komplexitäts-Analyse hebt High-Risk-Aufgaben bevor sie zu Schedule-Problemen werden

## Installation

```bash
npm install -g task-master-ai
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your-anthropic-api-key-here",
        "PERPLEXITY_API_KEY": "your-perplexity-api-key-here"
      }
    }
  }
}
```

`ANTHROPIC_API_KEY` ist erforderlich — Task Master ruft Claude intern auf, um PRDs zu parsen und Aufgaben zu analysieren. `PERPLEXITY_API_KEY` ist optional; es ermöglicht Research-erweiterte Task-Breakdowns, die aktuelle Best Practices ziehen.

## Schlüssel-Tools / Was es tut

- `initialize_project` — setze Task Master im aktuellen Projekt auf, erstelle das `.taskmaster/` Directory
- `parse_prd` — lese eine PRD oder Feature-Beschreibung und Auto-Generiere eine strukturierte Task-Liste mit Dependencies und Prioritäten
- `get_tasks` — liste alle Aufgaben mit Status, Priorität und Dependency-Zusammenfassung auf
- `get_task` — hole vollständige Details auf einer einzelnen Aufgabe inkl. Beschreibung, Subtasks und Notizen
- `create_task` — erstelle manuell eine Aufgabe mit Titel, Beschreibung, Priorität und Dependencies
- `update_task` — aktualisiere eine Aufgabes Titel, Beschreibung, Priorität oder Dependencies
- `set_task_status` — markiere eine Aufgabe als `pending`, `in-progress`, `done` oder `blocked`
- `next_task` — gib die höchst-Prioritäts-unblockierte Aufgabe zurück, bereit zu arbeiten, respektierend Dependency-Ordnung
- `expand_task` — zerlege eine Aufgabe zu Subtasks für parallele Ausführung oder feinere Verfolgung
- `add_subtask` — füge manuell eine Subtask zu einer bestehenden Aufgabe hinzu
- `analyze_project_complexity` — score alle Aufgaben nach Komplexität und flagge High-Risk-Items mit Begründung
- `generate_task_files` — schreibe einzelne Markdown-Dateien pro Aufgabe zu `.taskmaster/tasks/` für Agent-Kontext

## Verwendungsbeispiele

```
Initialisiere Task Master für dieses Projekt, dann parse die PRD bei docs/prd.md
und generiere die komplette Task-Liste. Zeige mir den Dependency-Graph.
```

```
Was ist die nächste Aufgabe, an der ich arbeiten sollte? Respektiere Dependency-Ordnung
und zeige mir die Aufgaben-Beschreibung und beliebige Subtasks.
```

```
Ich habe Aufgabe 5 fertiggestellt. Markiere sie fertig, dann zeige mir welche Aufgaben gerade
unblockiert wurden und welche hat die höchste Priorität.
```

```
Expandiere Aufgabe 8 zu Subtasks, detailliert genug für parallele Agent-Ausführung.
Jede Subtask sollte unabhängig in weniger als 2 Stunden abschlossen sein.
```

```
Analysiere die Komplexität aller verbleibenden Aufgaben. Flagge anything über
ein Komplexitäts-Score von 7, erkläre warum es komplex ist und schlage vor,
wie man es reduziert, bevor wir beginnen.
```

## Authentifizierung

**Erforderlich:** `ANTHROPIC_API_KEY` — besorge von console.anthropic.com. Task Master nutzt Claude intern, um PRDs zu parsen, Komplexität zu analysieren und Aufgaben zu expandieren. Der Key wird vom MCP-Server intern aufgerufen, nicht von Claudes Session direkt.

**Optional:** `PERPLEXITY_API_KEY` — besorge von perplexity.ai/api. Ermöglicht Task Master, Task-Breakdowns mit aktuellen Library-Versionen, bekannten Migration-Issues und relevanten Community-Patterns zu erweitern. Nützlich für Aufgaben involviert unfamiliar Technology Stacks.

## Tipps

**Committe `.taskmaster/` zu Git:** Task-Daten lebt in `.taskmaster/tasks.json`. Committen bedeutet dein ganzes Team sieht den gleichen Task-State, Progress ist im Verlauf prüfbar und Sessions neben jedem Gap mit vollem Kontext wieder aufnehmen.

**Verwende immer `next_task` statt manuell zu wählen:** Task Master baut einen Dependency-Graph beim Parsen der PRD. `next_task` durchtraversiert diesen Graph, um aufzudecken, was tatsächlich unblockiert und höchst-Priorität ist. Manuelle Auswahl umgeht diese Logik und riskiert, Aufgaben zu starten, deren Dependencies nicht fertig sind.

**`expand_task` vor paralleler Agent-Arbeit:** Wenn zu mehreren Agents via Worktrees, handing off, expandiere die relevante Aufgabe zuerst. Jede Subtask wird zur isolierten Arbeits-Einheit mit eigenem Kontext — Agents treten sich nicht auf die Zehen.

**`generate_task_files` für Agent-Kontext:** Schreiben einzelner Task-Dateien zu `.taskmaster/tasks/` gibt jedem Agent einen sauberen, fokussierten Kontextdatei mit nur was sie eine Aufgabe brauchen. Agents müssen die komplette Task-Liste nicht parsen.

**`analyze_project_complexity` früh:** Führe Komplexitäts-Analyse direkt nach `parse_prd` durch, bevor Arbeit startet. Aufgaben flagged als High-Complexity sind wo Schedule-Risk lebt. Adressiere Mehrdeutigkeit oder zerlege sie weiter, bevor Commitment zu einer Timeline.

**Blockierte Aufgaben brauchen explizites Unblocking:** Wenn eine Aufgabe markiert `blocked` ist, wird Task Master sie nicht via `next_task` aufdecken bis ihr Status aktualisiert ist. Wenn ein Blocker gelöst ist, setze die blockierte Aufgabe zurück auf `pending` und füge eine Note hinzu, erklärend was sich geändert hat.

---
