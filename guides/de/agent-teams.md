# Agent Teams — Multi-Session-Koordination

Agent Teams ermöglichen es dir, mehrere Claude Code Instanzen als koordiniertes Team zusammenarbeiten zu lassen. Eine Session fungiert als Lead — koordiniert Arbeit, weist Aufgaben zu und führt Ergebnisse zusammen. Teammates arbeiten unabhängig, jeweils in ihrem eigenen Kontextfenster, und können direkt miteinander kommunizieren.

Im Gegensatz zu Subagenten (die in einer einzelnen Session laufen und nur an den Aufrufer berichten), sind Agent Team Teammates vollständig unabhängige Claude Code Sessions, die sich eine Aufgabenliste teilen und direkt miteinander Nachrichten austauschen.

**Diese Funktion ist experimentell** und standardmäßig deaktiviert.

---

## Wann Agent Teams verwendet werden

| Anwendungsfall | Warum Teams funktionieren |
|---|---|
| Recherche und Review | Mehrere Teammates untersuchen gleichzeitig verschiedene Aspekte, teilen dann Ergebnisse und hinterfragen diese |
| Neue Module/Features | Jeder Teammate besitzt ein separates Element ohne sich gegenseitig zu behindern |
| Debugging mit konkurrierenden Hypothesen | Teammates testen verschiedene Theorien parallel und konvergieren schneller |
| Cross-Layer-Koordination | Frontend, Backend und Test-Änderungen werden jeweils von einem anderen Teammate verwaltet |

Wann Teams NICHT verwendet werden (verwende stattdessen eine einzelne Session oder Subagenten):

- **Sequenzielle Aufgaben**, bei denen jeder Schritt vom vorherigen abhängt
- **Edits in der gleichen Datei** — Teammates überschreiben sich gegenseitig
- **Arbeit mit vielen Inter-Task-Abhängigkeiten** — Koordinations-Overhead dominiert
- **Einfache Aufgaben**, bei denen der Overhead des Team-Spawnings den Nutzen übersteigt

---

## Agent Teams vs Subagenten

| | Subagenten | Agent Teams |
|---|---|---|
| Kontext | Eigener Kontext; Ergebnisse zurück an Aufrufer | Eigener Kontext; vollständig unabhängig |
| Kommunikation | Bericht zurück an Main-Agent nur | Teammates senden sich Nachrichten direkt |
| Koordination | Main-Agent verwaltet die ganze Arbeit | Gemeinsame Aufgabenliste mit Selbst-Koordination |
| Beste Verwendung für | Fokussierte Aufgaben, bei denen nur das Ergebnis zählt | Komplexe Arbeit mit Diskussion und Zusammenarbeit |
| Token-Kosten | Niedriger (Ergebnisse werden zusammengefasst zurückgegeben) | Höher (jeder Teammate ist eine separate Claude Instanz) |

Faustregel: verwende Subagenten, wenn Worker nur Bericht erstatten müssen. Verwende Teams, wenn Worker Ergebnisse teilen, sich gegenseitig hinterfragen und selbst koordinieren müssen.

---

## Agent Teams aktivieren

Füge das experimentelle Flag zu deinen Einstellungen hinzu:

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Oder setze es in deiner Shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Requires Claude Code v2.1.32 oder später. Überprüfe mit `claude --version`.

---

## Ein Team starten

Nach der Aktivierung teile Claude mit, dass er ein Team erstellen soll, indem du es in natürlicher Sprache beschreibst:

```
I'm designing a CLI tool for tracking TODO comments. Create an agent team:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude erstellt das Team, spawnt Teammates, koordiniert Arbeit und fasst Ergebnisse zusammen. Du musst keine Konfigurationsdateien schreiben — beschreibe die Team-Struktur einfach in deiner Eingabe.

---

## Display-Modi

Zwei Display-Modi steuern, wie Teammates in deinem Terminal angezeigt werden.

### In-process (Standard)

Alle Teammates laufen in deinem Haupt-Terminal.

| Taste | Aktion |
|---|---|
| `Shift+Down` | Zwischen Teammates wechseln |
| Eingabe | Nachricht direkt an einen Teammate senden |
| `Enter` | Session eines Teammates anzeigen |
| `Escape` | Die aktuelle Aktion des Teammates unterbrechen |
| `Ctrl+T` | Gemeinsame Aufgabenliste umschalten |

Funktioniert in jedem Terminal. Kein zusätzliches Setup erforderlich.

### Split Panes

Jeder Teammate erhält seinen eigenen Terminal-Bereich. Du kannst alle Ausgaben gleichzeitig sehen und direkt in einen Bereich klicken, um zu interagieren.

Benötigt **tmux** oder **iTerm2**:
- tmux: Installiere über deinen Package Manager (`brew install tmux`, `apt install tmux`)
- iTerm2: Installiere die `it2` CLI und aktiviere Python API in iTerm2 Einstellungen

### Konfiguration

```json
{
  "teammateMode": "in-process"
}
```

Gültige Werte: `"in-process"`, `"tmux"`, `"auto"` (erkennt verfügbaren Terminal Multiplexer).

Pro-Session überschreiben:

```bash
claude --teammate-mode in-process
```

---

## Aufgabenliste und Zuweisung

Die gemeinsame Aufgabenliste koordiniert Arbeit über alle Teammates hinweg. Aufgaben haben drei Status:

| Status | Bedeutung |
|---|---|
| **pending** | Noch nicht von einem Teammate beansprucht |
| **in progress** | Beansprucht und wird aktiv bearbeitet |
| **completed** | Abgeschlossen |

Aufgaben können von anderen Aufgaben abhängen. Eine ausstehende Aufgabe mit nicht aufgelösten Abhängigkeiten kann nicht beansprucht werden, bis diese Abhängigkeiten erfüllt sind.

### Zuweisungsmodi

- **Lead weist zu** — teile dem Lead mit, welche Aufgabe welchem Teammate gegeben werden soll
- **Self-Claim** — nach Fertigstellung einer Aufgabe sucht sich ein Teammate automatisch die nächste nicht zugewiesene, nicht blockierte Aufgabe

Task-Claiming nutzt File-Locking, um Race Conditions zu vermeiden, wenn mehrere Teammates gleichzeitig zu beanspruchen versuchen.

---

## Teammates und Modelle spezifizieren

Claude bestimmt die Team-Größe aus der Aufgabe, oder du kannst explizit sein:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

Teammates erben die `/model` Auswahl des Lead nicht standardmäßig. Um dies zu ändern, setze **Default teammate model** in `/config` und wähle **Default (leader's model)**.

---

## Plan Approval Gates

Für riskante Aufgaben, erfordere von Teammates, dass sie vor der Implementierung einen Plan erstellen:

```
Spawn an architect teammate to refactor the auth module.
Require plan approval before they make any changes.
```

Wenn ein Teammate das Planen beendet, sendet er eine Plan-Genehmigungsanfrage an den Lead. Der Lead prüft und:

- **Genehmigt** — Teammate beginnt mit der Implementierung
- **Lehnt mit Feedback ab** — Teammate überarbeitet den Plan und reicht ihn erneut ein

Du kannst das Urteil des Lead beeinflussen:

```
Only approve plans that include test coverage.
Reject plans that modify the database schema.
```

---

## Direkt mit Teammates sprechen

Jeder Teammate ist eine vollständige, unabhängige Claude Code Session. Du kannst zu jeder Zeit mit jedem Teammate kommunizieren.

- **In-process-Modus:** `Shift+Down`, um zum Teammate zu wechseln, dann deine Nachricht eingeben
- **Split-Pane-Modus:** in den Bereich des Teammates klicken und direkt tippen

---

## Subagent-Definitionen als Teammates verwenden

Referenziere eine existierende Subagent-Typ beim Spawning eines Teammates:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

Der Teammate verwendet diese Definition's `tools` Allowlist und `model`. Der Text der Definition wird an das System-Prompt des Teammates als zusätzliche Anweisungen angehängt.

**Was übertragen wird:** `tools`, `model`, System-Prompt-Text.

**Was NICHT übertragen wird:** `skills` und `mcpServers`. Teammates laden Skills und MCP-Server aus Projekt/Benutzer-Einstellungen wie jede normale Session.

---

## Architektur und Speicherung

| Komponente | Rolle |
|---|---|
| Team Lead | Haupt-Session, die das Team erstellt, Teammates spawnt, koordiniert |
| Teammates | Separate Claude Code Instanzen, die zugewiesene Aufgaben bearbeiten |
| Aufgabenliste | Gemeinsame Work Items, die Teammates beanspruchen und abschließen |
| Mailbox | Messaging-System für Kommunikation zwischen Agenten |

### Speicherorte

| Pfad | Inhalt |
|---|---|
| `~/.claude/teams/{team-name}/config.json` | Team-Konfiguration (auto-generiert, nicht von Hand bearbeiten) |
| `~/.claude/tasks/{team-name}/` | Gemeinsame Aufgabenlisten-Daten |

Es gibt keine Project-Level-Team-Config. Eine Datei wie `.claude/teams/teams.json` in deinem Projektverzeichnis wird nicht erkannt.

---

## Genehmigungen

Alle Teammates starten mit den Genehmigungseinstellungen des Lead. Wenn der Lead mit `--dangerously-skip-permissions` läuft, tun alle Teammates das auch.

Du kannst die Modi einzelner Teammates nach dem Spawning ändern, aber nicht beim Spawning.

---

## Kontext und Kommunikation

### Was Teammates erhalten

Teammates laden denselben Projekt-Kontext wie eine normale Session: `CLAUDE.md`, MCP-Server, Skills. Sie erhalten auch den Spawn-Prompt vom Lead. Der Konversationsverlauf des Lead wird NICHT übertragen.

### Wie Kommunikation funktioniert

- Nachrichten werden automatisch zugestellt (kein Polling erforderlich)
- Idle-Benachrichtigungen werden an den Lead gesendet, wenn ein Teammate stoppt
- Gemeinsame Aufgabenliste ist für alle Agenten sichtbar
- Nachricht an jeden Teammate nach Name (Namen vom Lead bei Spawn zugewiesen)

---

## Hook-Events für Agent Teams

Drei Hook-Events bieten Qualitätsgates für Team-Koordination.

### TeammateIdle

Wird ausgelöst, wenn ein Teammate gerade Idle werden wird. Exit-Code `2` sendet Feedback und hält den Teammate am Arbeiten.

### TaskCreated

Wird ausgelöst, wenn eine Aufgabe gerade erstellt wird. Exit-Code `2` verhindert die Erstellung mit Feedback.

### TaskCompleted

Wird ausgelöst, wenn eine Aufgabe als abgeschlossen markiert wird. Exit-Code `2` verhindert die Vollendung mit Feedback.

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-task-tests.sh"
      }]
    }]
  }
}
```

Verwende `TaskCompleted` Hooks, um Standards durchzusetzen — zum Beispiel, um zu überprüfen, dass ein Teammate Tests geschrieben hat, bevor eine Aufgabe als erledigt markiert wird.

---

## Shutdown und Cleanup

### Einen Teammate herunterfahren

```
Ask the researcher teammate to shut down.
```

Der Teammate kann zustimmen (beendet sich elegant) oder ablehnen mit einer Erklärung, warum er weiterlaufen sollte.

### Das Team aufräumen

```
Clean up the team.
```

Verwende immer den Lead zum Aufräumen. Teammates sollten selbst nicht aufräumen. Fahre alle Teammates herunter, bevor du Cleanup leitest.

---

## Best Practices

1. **Team-Größe: 3-5 Teammates.** Mehr bedeutet mehr Koordinations-Overhead mit sinkenden Renditen.
2. **Aufgaben pro Teammate: 5-6.** Hält alle produktiv ohne übermäßigen Kontextwechsel.
3. **Gib Kontext.** Teammates erben die Konversation des Lead nicht. Füge aufgabenspezifische Details in Spawn-Prompts ein.
4. **Vermeide Datei-Konflikte.** Weise jedem Teammate verschiedene Dateien zu. Zwei Teammates editieren die gleiche Datei verursacht Überschreibungen.
5. **Starte mit Recherche.** Wenn neu bei Teams, starte mit nicht-Programmier-Aufgaben (Review, Recherche, Untersuchung) bevor parallele Implementierung.
6. **Überwache und steuere.** Überprüfe Fortschritt. Ein Team zu lange unbeaufsichtigt laufen zu lassen erhöht das Risiko verschwendeter Anstrengungen.
7. **Warte auf Teammates.** Sag dem Lead „wait for your teammates to complete their tasks before proceeding", wenn er anfängt zu implementieren statt zu delegieren.

---

## Anwendungsfall-Beispiele

### Paralleles Code Review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Konkurrierende Hypothesen

```
Users report the app exits after one message. Spawn 5 teammates to
investigate different hypotheses. Have them talk to each other to
disprove each other's theories. Update findings doc with consensus.
```

### Cross-Layer-Feature

```
Build the notifications feature. Spawn teammates:
- Backend: API endpoints and database schema
- Frontend: React components and state management
- Tests: integration and unit tests for both layers
Each teammate owns their layer. Coordinate via the shared task list.
```

---

## Beschränkungen

- Kein Session-Wiederaufnahme mit `/resume` oder `/rewind` für In-Process-Teammates
- Task-Status kann verzögert sein — Teammates markieren manchmal Tasks nicht als abgeschlossen
- Shutdown kann langsam sein (Teammates beenden ihre aktuelle Anfrage zuerst)
- Ein Team gleichzeitig pro Lead
- Keine verschachtelten Teams (Teammates können ihre eigenen Teams nicht spawnen)
- Lead ist für die Lebensdauer des Teams fest
- Genehmigungen werden beim Spawning gesetzt (ändern einzeln danach, nicht beim Spawning)
- Split Panes erfordern tmux oder iTerm2 (nicht VS Code Terminal, Windows Terminal oder Ghostty)

---

## Token-Kosten

Agent Teams verwenden signifikant mehr Tokens als eine einzelne Session. Jeder Teammate hat sein eigenes Kontextfenster, und Token-Nutzung skaliert linear mit aktiven Teammates.

Für Recherche, Review und neue Features sind die zusätzlichen Tokens normalerweise die Mühe wert. Für Routine-Aufgaben ist eine einzelne Session kostengünstiger.

---
