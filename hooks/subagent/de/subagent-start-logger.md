# Hook: Subagent Start Logger

Wird bei `SubagentStart` ausgelöst, um zu protokollieren, welcher Subagent gestartet wurde, welche Aufgabe er erhalten hat und wann — und erstellt so eine laufende Spur aller Agent-Aktivitäten in der Sitzung.

## Was es macht

Liest die `SubagentStart`-Nutzlast von stdin (JSON mit Agent-Name, Modell und Aufgabenbeschreibung) und hängt einen Einzeiler mit Zeitstempel an `.claude/logs/subagent-activity.log` an. Der Log-Eintrag enthält:

- ISO-8601-Zeitstempel
- Agent-Name / Tool-Name
- Erste 120 Zeichen des Task-Prompts (genug Kontext, nicht zu ausführlich)
- Sitzungs-ID (aus `CLAUDE_SESSION_ID` Umgebungsvariable, wenn verfügbar)

Beispiel-Log-Zeile:
```
2026-06-03T09:14:22Z [START] agent=security-reviewer session=abc123 task="Review the pending diff for injection vulnerabilities in src/api/..."
```

## Wann es ausgelöst wird

`SubagentStart` — wird jedes Mal ausgelöst, wenn Claude Code einen Subagenten spawnt (parallele Tool-Aufrufe, delegierte Agenten, Skill-Aufrufe, die als Subprocess laufen).

## settings.json Eintrag

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/subagent-start-logger.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Setzen Sie `matcher` auf `""`, um alle Subagenten zu erfassen, oder geben Sie einen Substring des Agent-Namens ein (z.B. `"security"`), um zu filtern.

## Skript

`subagent-start-logger.sh`

```bash
#!/usr/bin/env bash
# subagent-start-logger.sh
# Fires on SubagentStart — logs agent name + task snippet to subagent-activity.log

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/subagent-activity.log"

mkdir -p "$LOG_DIR"

# Read the full JSON payload from stdin
PAYLOAD=$(cat)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

# Extract fields with jq; fall back to raw grep if jq is absent
if command -v jq &>/dev/null; then
  AGENT=$(echo "$PAYLOAD" | jq -r '.agent_name // .tool_name // "unknown"')
  TASK=$(echo "$PAYLOAD"  | jq -r '.task // .prompt // ""' | head -c 120)
else
  AGENT=$(echo "$PAYLOAD" | grep -o '"agent_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  TASK=$(echo "$PAYLOAD"  | grep -o '"task":"[^"]*"'       | cut -d'"' -f4 | head -c 120 || echo "")
fi

echo "${TIMESTAMP} [START] agent=${AGENT} session=${SESSION} task=\"${TASK}\"" >> "$LOG_FILE"
```

## Setup

```bash
cp hooks/subagent/subagent-start-logger.sh .claude/hooks/
chmod +x .claude/hooks/subagent-start-logger.sh
mkdir -p .claude/logs
```

Fügen Sie den `settings.json`-Snippet zu `.claude/settings.json` oder `~/.claude/settings.json` hinzu.

## Notizen

- Die Log-Datei wächst unbegrenzt; rotieren Sie sie mit `logrotate` oder einem wöchentlichen Cron-Job, der Dateien älter als 30 Tage archiviert.
- `SubagentStart` wird ausgelöst, bevor der Subagent läuft, daher spiegelt das Task-Feld die beabsichtigte Arbeit wider, nicht das Endergebnis — kombinieren Sie mit `subagent-stop-summary`, um Ergebnisse zu erfassen.
- Wenn `jq` nicht installiert ist (`brew install jq` / `apt install jq`), ist das Fallback-Grep-Parsing weniger robust — installieren Sie jq für den Produktivbetrieb.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
