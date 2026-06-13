# Hooks Cookbook

Real, einsatzbereit Hook-Muster zum Automatisieren von Qualität, Sicherheit und Observability in Claude Code.

---

## Hook-Grundlagen

Hooks sind Shell-Skripte oder Befehle, die Claude Code automatisch als Reaktion auf Events ausführt. Sie laufen außerhalb des Claude-Kontexts — sie sind echte Shell-Prozesse, keine Claude-Anweisungen.

**Hook-Events:**
| Event | Wann es ausgelöst wird |
|---|---|
| `SessionStart` | Wenn eine Claude Code Session beginnt |
| `PreToolUse` | Bevor ein Tool-Aufruf ausgeführt wird |
| `PostToolUse` | Nachdem ein Tool-Aufruf abgeschlossen ist |
| `PreCompact` | Bevor Context Compaction ausgelöst wird |
| `PostCompact` | Nachdem Context Compaction abgeschlossen ist |
| `Stop` | Wenn Claude die Antwort beendet |
| `Notification` | Wenn Claude eine Desktop-Benachrichtigung sendet |

**Hook-Konfigurationsort:** `.claude/settings.json` (Projekt) oder `~/.claude/settings.json` (Benutzer-Level)

**Basis-Hook-Struktur:**
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/your-script.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Matcher:** Filtert, welche Tool-Aufrufe den Hook auslösen. Leerer String `""` passt auf alle. `"Bash"` passt nur auf Bash-Tool-Aufrufe. `"Write|Edit"` passt auf Write oder Edit.

---

## Rezept 1 — Prettier Auto-Format bei Datei-Schreiben

Formatiert Dateien automatisch nach dem Claude sie schreibt oder bearbeitet. Keine nervigen „please run prettier" Eingaben mehr.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write ${tool_input.file_path}",
            "async": true
          }
        ]
      }
    ]
  }
}
```

**Hinweise:**
- `async: true` führt Formatierung im Hintergrund aus — Claude wartet nicht darauf
- Nur auf Write und Edit Tool-Aufrufen ausgelöst
- `${tool_input.file_path}` ist der Pfad der Datei, die geschrieben wurde

---

## Rezept 2 — Gefährliche Shell-Befehle blockieren

Verhindere, dass Claude destruktive Befehle ausführt, auch wenn er versucht.

**.claude/hooks/block-dangerous.sh:**
```bash
#!/usr/bin/env bash
# Liest Tool-Input von stdin als JSON
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))")

# Blockierte Muster
BLOCKED_PATTERNS=("rm -rf" "sudo " "| bash" "| sh" "curl.*| " "wget.*| " "git push --force" "git reset --hard" "DROP TABLE" "truncate ")

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOCKED: command matches dangerous pattern '$pattern'" >&2
    exit 2  # Exit-Code 2 = Tool-Aufruf blockieren
  fi
done

exit 0  # Erlauben
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-dangerous.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Exit-Codes:** `0` = erlauben, `1` = warnen (Claude sieht die Ausgabe aber fährt fort), `2` = blockieren (Tool-Aufruf wird abgebrochen).

---

## Rezept 3 — Audit Log für jeden Tool-Aufruf

Logge jeden Tool-Aufruf mit Zeitstempel, Tool-Name und Input-Zusammenfassung. Essentiell zum Debuggen und für Sicherheits-Auditing.

**.claude/hooks/audit-log.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name','unknown'))" 2>/dev/null)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/audit.log"

mkdir -p "$(dirname "$LOG_FILE")"
echo "${TIMESTAMP} | ${TOOL_NAME} | $(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); inp=d.get('tool_input',{}); print(str(inp)[:200])" 2>/dev/null)" >> "$LOG_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Füge `.claude/logs/` zu `.gitignore` hinzu.

---

## Rezept 4 — Pre-Compact Session Saver

Bevor Compaction ausgelöst wird, speichere den aktuellen Session-Status, damit der Kontext erhalten bleibt.

**.claude/hooks/pre-compact-save.sh:**
```bash
#!/usr/bin/env bash
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$MEMORY_FILE")"

cat >> "$MEMORY_FILE" << EOF

---
## Session snapshot: ${TIMESTAMP}
[Claude will append a summary here during PreCompact]
EOF
```

**settings.json:**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

Paare das mit einer CLAUDE.md-Anweisung: „When PreCompact fires, summarize: current task, files changed, open decisions, next steps — append to `.claude/memory/session-state.md`."

---

## Rezept 5 — Cost Tracker

Schätze Token-Kosten pro Session und logge sie.

**.claude/hooks/cost-tracker.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COST_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/costs.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$COST_FILE")"

# Extrahiere Usage-Daten, wenn verfügbar
USAGE=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
usage = d.get('usage', {})
inp = usage.get('input_tokens', 0)
out = usage.get('output_tokens', 0)
print(f'input={inp} output={out}')
" 2>/dev/null || echo "usage=unavailable")

echo "${TIMESTAMP} | ${USAGE}" >> "$COST_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

---

## Rezept 6 — TypeScript-Typ-Check bei Edit

Führe `tsc --noEmit` nach dem Claude TypeScript-Dateien bearbeitet aus. Fange Typ-Fehler ab, bevor sie sich ausbreiten.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"${tool_input.file_path}\" | grep -q \"\\.tsx\\?$\" && npx tsc --noEmit 2>&1 | head -20 || true'",
            "async": false,
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Setze `async: false`, damit Claude die Typ-Fehler sieht und sie sofort beheben kann.

---

## Rezept 7 — Git Push Erinnerung

Erinnere Claude, zu bestätigen bevor eine git push Operation.

**.claude/hooks/git-push-confirm.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)

if echo "$COMMAND" | grep -q "git push"; then
  echo "⚠️  About to push to remote. Confirm this is intentional." >&2
  exit 1  # Warnung — Claude sollte den Benutzer fragen, bevor fortgefahren wird
fi

exit 0
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/git-push-confirm.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Rezept 8 — Session Start Context Loader

Bei Session-Start, erinnere Claude automatisch daran, wichtige Kontext-Dateien zu lesen.

**.claude/hooks/session-start.sh:**
```bash
#!/usr/bin/env bash
# Gebe Text aus, der Claude's Kontext zu Session-Start vorangestellt wird
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"

if [ -f "$MEMORY_FILE" ]; then
  echo "Previous session state found at .claude/memory/session-state.md — read it before starting work."
fi

if [ -f "${CLAUDE_PROJECT_DIR}/CONTEXT.md" ]; then
  echo "Domain glossary available at CONTEXT.md — read it for project terminology."
fi
```

**settings.json:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Hooks kombinieren

Hooks komponieren — du kannst mehrere Hooks auf dem gleichen Event haben, jeweils mit verschiedenen Matchern.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "npx prettier --write ${tool_input.file_path}", "async": true }
        ]
      },
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/tsc-check.sh", "async": false }
        ]
      },
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh", "async": true }
        ]
      }
    ]
  }
}
```

Dies führt aus: prettier (async) + TypeScript-Check (sync, Claude wartet) + audit log (async) bei jedem Datei-Schreiben.

---

## Hooks Troubleshooting

**Hook wird nicht ausgelöst:**
- Überprüfe, dass der Event-Name exakt ist: `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`
- Überprüfe, dass das Skript ausführbar ist: `chmod +x .claude/hooks/your-script.sh`
- Überprüfe, dass der Pfad `${CLAUDE_PROJECT_DIR}` korrekt nutzt

**Hook blockiert alles:**
- Wenn dein Hook mit `2` bei jedem Aufruf beendet, werden alle Tool-Aufrufe blockiert
- Füge Logging zum Hook hinzu, um zu sehen, welchen Input er empfängt
- Teste den Hook manuell: `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | bash .claude/hooks/your-script.sh`

**Hook läuft aber Ausgabe nicht sichtbar:**
- Stdout von async Hooks wird verworfen. Verwende stderr (`>&2`) für Nachrichten, die du sehen möchtest.
- Für sync Hooks wird stdout Claude gezeigt; stderr wird dem Benutzer gezeigt.

---

## Erweiterte Hook-Fähigkeiten

### continueOnBlock

Standardmäßig, wenn ein PostToolUse Hook mit Code `2` beendet wird, um einen Tool-Aufruf zu blockieren, endet Claude's Turn. Mit `continueOnBlock: true`, wird der Block-Grund als Nachricht an Claude zurückgegeben und der Turn setzt sich fort — Claude kann den Grund lesen und einen anderen Ansatz versuchen ohne Benutzer-Eingriff zu benötigen.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{"type": "command", "command": "bash /hooks/validate-command.sh"}],
      "continueOnBlock": true
    }]
  }
}
```

Primärer Anwendungsfall: Lint und Format Hooks, die auf Verletzungen blockieren und Claude erlauben, die Datei automatisch zu beheben und zu wiederholen, statt zu stoppen und auf eine menschliche Eingabe zu warten.

---

### terminalSequence output

Hooks können OSC Escape-Sequenzen in ihrem JSON stdout ausgeben, um Desktop-Benachrichtigungen auszulösen, den Fenster-Titel zu setzen, oder die Terminal-Glocke zu läuten — ohne ein kontrollierendes Terminal zu benötigen.

```python
import json, sys

result = {
    "terminalSequence": "\033]0;Claude — Task Complete\007",  # setzt Fenster-Titel
}
print(json.dumps(result))
```

Hilfreich, um Completion-Status oder Fehler in der Fenster-Titelleiste zu anzuzeigen, wenn lange Background-Aufgaben laufen.

---

### exec form (args array)

Statt eines Shell-String `command`, gib ein `args` Array weiter, um den Hook-Prozess direkt ohne Shell-Aufruf zu spawnen. Dies eliminiert Quote- und Escaping-Probleme, wenn interpolierte Werte wie `${tool_name}` oder `${tool_input}` Leerzeichen, Anführungszeichen oder Sonderzeichen enthalten.

```json
{
  "type": "command",
  "command": {
    "args": ["/usr/local/bin/my-hook", "--tool", "${tool_name}", "--input", "${tool_input}"]
  }
}
```

Verwende die args Form für jeden Hook, der strukturierte Daten von Tool-Inputs empfängt. Verwende die String Form nur, wenn du echte Shell-Funktionen (Pipes, Bedingungen, Globs) benötigst.

---

### type: "mcp_tool"

Hooks können ein Tool auf einem bereits-verbundenen MCP-Server direkt aufrufen, ohne einen Subprocess zu spawnen. Dies ist geringerer Overhead als ein Shell-Skript und hält den Hook in der Auth-Kontext des MCP-Verbindung.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "mcp_tool",
        "server": "my-mcp-server",
        "tool": "log_file_write",
        "input": {"path": "${tool_input.file_path}"}
      }]
    }]
  }
}
```

Der MCP-Server, der in `server` genannt wird, muss bereits in der Session verbunden sein. Das `tool` Feld ist die exakte Tool-Name, die dieser Server exponiert. Verwende dieses Muster für Audit-Logging, Benachrichtigungen oder State-Synchronisierung über MCP ohne einer Subprocess-Schicht hinzuzufügen.

---

### PreCompact — blockierende Compaction

PreCompact Hooks können Compaction aktiv blockieren, indem sie mit Code `2` beenden oder `{"decision": "block"}` in stdout zurückgeben. Verwende dies, um eine Save oder Backup Operation auszuführen und Compaction nur zu erlauben, sobald der Status sicher persistiert ist.

**.claude/hooks/pre-compact-backup.sh:**
```bash
#!/bin/bash
# Speichere Transcript zuerst, dann erlaube Compaction
cp .claude/session.jsonl .claude/backups/session-$(date +%s).jsonl
# Exit 0, um Compaction zu erlauben, exit 2, um zu blockieren
exit 0
```

Wenn das Backup fehlschlägt und du Compaction verhindern möchtest, beende mit `2`. Claude wird den Block-Grund anzeigen und die Session setzt sich fort ohne zu compactieren.

---

### Agent-scoped hooks

Hooks können auf einen spezifischen Agenten begrenzt sein, indem ein `hooks:` Feld zum Frontmatter des Agenten hinzufügt wird. Diese Hooks werden nur ausgelöst, wenn der Agent der aktive Agent ist — sie beeinflussen nicht die Root-Session oder andere Agenten.

```yaml
---
name: my-agent
description: "..."
hooks:
  Stop:
    - type: command
      command: echo "Agent finished" >> .claude/agent.log
---
```

Verwende Agent-scoped Hooks für Agent-spezifische Observability (Logging, wenn ein Agent beendet), Resource Cleanup (Löschen von Temp-Dateien, die der Agent erstellt hat), oder Cost Tracking, das auf eine einzige Agent-Aktivität begrenzt ist.

---

### effort.level in hook environment

Der aktive Effort-Level ist als `$CLAUDE_EFFORT` Umgebungsvariable in Hook-Skripten verfügbar. Werte: `low`, `normal`, `high`, `xhigh`.

```bash
#!/bin/bash
if [ "$CLAUDE_EFFORT" = "xhigh" ]; then
  echo "Running extended validation..."
  run-full-test-suite
fi
```

Verwende dies, um teure Validierung nur auszuführen, wenn Claude in extended-effort-Modus operiert, oder um optionale Checks bei niedriger Effort zu überspringen, um Latenz zu reduzieren.

---

### Konditionelle `if:` Hooks

Führe einen Hook nur aus, wenn eine Bedingung wahr ist. Das `if:` Feld benötigt einen Shell-Ausdruck, der evaluiert wird, bevor der Hook ausgeführt wird. Wenn er non-zero beendet, wird der Hook vollständig übersprungen.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "if": "echo \"$TOOL_INPUT\" | grep -q '\\.(ts|tsx)$'",
      "hooks": [{"type": "command", "command": "npx tsc --noEmit"}]
    }]
  }
}
```

Der `if:` Ausdruck hat Zugriff auf die gleichen Umgebungsvariablen wie der Hook selbst — `$TOOL_INPUT`, `$TOOL_NAME`, `$CLAUDE_PROJECT_DIR`, `$CLAUDE_EFFORT`, usw.

**Allgemeine `if:` Muster:**

Laufe nur auf TypeScript-Dateien:
```bash
"if": "echo \"$TOOL_INPUT\" | grep -q '\\.tsx\\?$'"
```

Laufe nur, wenn auf dem main branch:
```bash
"if": "[ \"$(git branch --show-current)\" = \"main\" ]"
```

Laufe nur, wenn eine spezifische Config-Datei existiert:
```bash
"if": "[ -f .env.production ]"
```

Laufe nur bei xhigh effort:
```bash
"if": "[ \"$CLAUDE_EFFORT\" = \"xhigh\" ]"
```

Konditionelle Hooks komponieren sauber mit dem bestehenden Matcher-System — der Matcher filtert nach Tool-Name, der `if:` filtert nach Runtime-Bedingungen. Verwende beide zusammen, um genaue, Low-Overhead-Hook-Trigger zu erstellen.

---

### `background_tasks` und `session_crons` in Stop/SubagentStop Hooks

Die `Stop` und `SubagentStop` Hook-Payloads enthalten jetzt zwei zusätzliche Felder, die berichten, was noch läuft, wenn die Session beendet:

```json
{
  "event": "Stop",
  "background_tasks": [
    {"id": "task-123", "status": "running", "started_at": "2026-05-23T10:00:00Z"}
  ],
  "session_crons": [
    {"id": "cron-456", "schedule": "0 * * * *", "last_run": "2026-05-23T09:00:00Z"}
  ]
}
```

**`background_tasks`** — Tasks, die über `claude --bg` gestartet oder vom Agent während der Session gespawned wurden, die noch bei Stop-Zeit laufen.

**`session_crons`** — Wiederholte Jobs, die mit `/loop` oder der Cron API registriert sind und noch aktiv sind.

**Anwendungsfälle:**

Warte auf Background-Tasks vor dem Archivieren:
```bash
#!/bin/bash
INPUT=$(cat)
RUNNING=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
tasks = d.get('background_tasks', [])
print(len([t for t in tasks if t['status'] == 'running']))
" 2>/dev/null || echo "0")

if [ "$RUNNING" -gt 0 ]; then
  echo "Session stopped with $RUNNING background task(s) still running." >&2
fi
```

Benachrichtige, wenn ein Cron durch Session-End verwaist wird:
```bash
#!/bin/bash
INPUT=$(cat)
CRON_COUNT=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(len(d.get('session_crons', [])))
" 2>/dev/null || echo "0")

if [ "$CRON_COUNT" -gt 0 ]; then
  echo "Warning: $CRON_COUNT session cron(s) will stop when this session ends." >&2
fi
```

Registriere dieses Skript als `Stop` Hook mit `matcher: ""`, um es bei jedem Session-Ende auszuführen.

---

## PostToolUse Output Replacement

PostToolUse Hooks können ersetzen, was Claude von ANY Tool-Output sieht — nicht nur MCP-Tools. Dies ist eines der wirkungsvollsten Hook-Funktionen zum Verwalten von Kontext-Budget, da Tool-Ergebnisse ~60% von Kontext-Tokens in typischen Agentic Sessions verbrauchen.

**Wie es funktioniert:**
Der Hook empfängt die Tool-Ausgabe in stdin. Er kann eine modifizierte Version über `hookSpecificOutput.updatedToolOutput` zurückgeben. Claude sieht die ersetzte Ausgabe statt der Original. Das Tool wurde bereits ausgeführt — Dateien geschrieben, Befehle laufen, Netzwerk-Anfragen gesendet — dies ändert nur, was Claude's Kontext betritt, nicht was passiert ist.

**Konfiguration:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/compress-output.py"
      }]
    }]
  }
}
```

**Skript-Beispiel — komprimiere ausführliche bash-Ausgabe:**
```python
#!/usr/bin/env python3
"""Komprimiere Bash Tool-Ausgabe, die eine Schwelle überschreitet."""
import json, sys

THRESHOLD = 10_000  # Zeichen

data = json.load(sys.stdin)
output = data.get("tool_output", "")

if len(output) > THRESHOLD:
    # Behalte erste 2000 und letzte 2000 Zeichen, zusammengefasst Mitte
    compressed = (
        output[:2000]
        + f"\n\n... [{len(output) - 4000} characters truncated] ...\n\n"
        + output[-2000:]
    )
    result = {
        "hookSpecificOutput": {
            "updatedToolOutput": compressed
        }
    }
    print(json.dumps(result))
else:
    # Ausgabe nicht geändert — gib nichts aus (keine Ersetzung)
    pass
```

**Anwendungsfälle:**
- **Redact secrets:** Scan-Ausgabe für API Keys/Tokens und ersetze mit `[REDACTED]` bevor Claude sieht
- **Normalize diffs:** entferne Lärm aus git diff Ausgabe (Zeitstempel, Index-Zeilen)
- **Compress verbose output:** Truncate npm install logs, große Query-Ergebnisse, Build-Ausgabe
- **Context budget recovery:** Tool-Ergebnisse verbrauchen ~60% von Tokens; Ersetzung von 50K Zeichen mit 500 Zeichen gewinnt massive Kontext

**Wichtig:** die Original-Ausgabe wird in Telemetrie/Analytics erfasst, bevor der Hook läuft. Die Ersetzung betrifft nur, was Claude in seinem Kontext-Fenster sieht.

**Verfügbar seit:** v2.1.121+

---

## Agent Team Hook Events

Drei Hook-Events speziell für Agent Teams. Diese werden während Team-Koordination ausgelöst und erlauben dir, Qualitätsgates auf Task-Management durchzusetzen.

### TeammateIdle

Wird ausgelöst, wenn ein Teammate gerade idle gehen wird (Arbeit einstellen). Verwende, um Teammates produktiv zu halten.

- **Exit 0:** erlaube dem Teammate, idle zu gehen
- **Exit 2:** sende Feedback an den Teammate und halte ihn am Arbeiten

```json
{
  "hooks": {
    "TeammateIdle": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/check-remaining-tasks.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# check-remaining-tasks.sh — halte Teammate am Arbeiten, wenn Tasks verbleiben
PENDING=$(cat ~/.claude/tasks/*/tasks.json 2>/dev/null | python3 -c "
import json,sys
tasks = json.load(sys.stdin)
pending = [t for t in tasks if t.get('status') == 'pending']
print(len(pending))
" 2>/dev/null || echo "0")

if [ "$PENDING" -gt 0 ]; then
  echo "There are $PENDING pending tasks. Pick up the next one."
  exit 2  # weiterarbeiten
fi
exit 0  # Idle erlauben
```

### TaskCreated

Wird ausgelöst, wenn eine Task zur gemeinsamen Aufgabenliste hinzugefügt wird. Verwende, um Task-Qualitäts-Standards durchzusetzen.

- **Exit 0:** erlaube Task-Erstellung
- **Exit 2:** verhindern Erstellung und sende Feedback

```json
{
  "hooks": {
    "TaskCreated": [{
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/validate-task.py"
      }]
    }]
  }
}
```

Anwendungsfall: lehne Tasks ab, die zu vage sind (keine Akzeptanzkriterien), zu groß (benötigt Aufteilung), oder duplicate bestehende Tasks.

### TaskCompleted

Wird ausgelöst, wenn eine Task als abgeschlossen markiert wird. Verwende als Qualitäts-Gate.

- **Exit 0:** erlaube Completion
- **Exit 2:** verhindern Completion und sende Feedback (Teammate muss das Problem adressieren)

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-tests-pass.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# verify-tests-pass.sh — blockiere Task-Completion, wenn Tests fehlschlagen
if ! npm test --silent 2>/dev/null; then
  echo "Tests are failing. Fix test failures before marking this task complete."
  exit 2  # blockiere Completion
fi
exit 0  # erlaube Completion
```

**Hinweis:** Diese Hooks werden nur ausgelöst, wenn Agent Teams aktiviert ist (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). Sie haben keine Auswirkung im normalen Single-Session-Modus.

---

## Mit uns arbeiten
