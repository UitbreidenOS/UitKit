# Hook: Subagent Stop Summary

Wird bei `SubagentStop` ausgelöst, um eine einzeilige Ergebniszusammenfassung zum Sitzungsprotokoll hinzuzufügen – und bietet Ihnen eine chronologische Aufzeichnung jeder Subagent-Invokation und ihres Ergebnisses in einer einzelnen Datei.

## Was es macht

Liest die `SubagentStop`-Nutzlast aus stdin und hängt eine Zusammenfassungszeile mit Zeitstempel an `.claude/logs/subagent-activity.log` an (die gleiche Datei, die von `subagent-start-logger` geschrieben wird). Die Zeile enthält:

- ISO-8601-Zeitstempel
- `[STOP]`-Marker für einfaches Filtern mit grep/awk
- Name des Agenten
- Exit-Status / Erfolgsindiktor
- Erste 120 Zeichen der Ergebnis- oder Fehlermeldung

Beispielprotokollzeile:
```
2026-06-03T09:14:35Z [STOP]  agent=security-reviewer session=abc123 status=success result="No critical vulnerabilities found. 2 low-severity warnings in src/api/routes.py."
```

Das Kombinieren von `[START]`- und `[STOP]`-Zeilen im Protokoll macht es einfach, die Verarbeitungszeit des Subagenten mit einem einfachen awk-Skript zu messen.

## Wann wird es ausgelöst

`SubagentStop` – wird jedes Mal ausgelöst, wenn ein Subagent beendet wird, ob erfolgreich, mit Fehler oder unterbrochen.

## settings.json-Eintrag

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/subagent-stop-summary.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## Skript

`subagent-stop-summary.sh`

```bash
#!/usr/bin/env bash
# subagent-stop-summary.sh
# Fires on SubagentStop — appends result summary to subagent-activity.log

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/subagent-activity.log"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  AGENT=$(echo "$PAYLOAD"  | jq -r '.agent_name // .tool_name // "unknown"')
  STATUS=$(echo "$PAYLOAD" | jq -r 'if .error then "error" else "success" end')
  RESULT=$(echo "$PAYLOAD" | jq -r '.result // .error // .output // ""' | head -c 120)
else
  AGENT=$(echo "$PAYLOAD"  | grep -o '"agent_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  STATUS="unknown"
  RESULT=$(echo "$PAYLOAD" | grep -o '"result":"[^"]*"' | cut -d'"' -f4 | head -c 120 || echo "")
fi

echo "${TIMESTAMP} [STOP]  agent=${AGENT} session=${SESSION} status=${STATUS} result=\"${RESULT}\"" >> "$LOG_FILE"
```

## Setup

```bash
cp hooks/subagent/subagent-stop-summary.sh .claude/hooks/
chmod +x .claude/hooks/subagent-stop-summary.sh
mkdir -p .claude/logs
```

Stellen Sie es zusammen mit `subagent-start-logger` bereit, um einen vollständigen Start/Stop-Trace zu erhalten. Beide Hooks schreiben in die gleiche Protokolldatei, daher zeigt ein einfaches `grep agent=security-reviewer .claude/logs/subagent-activity.log` den vollständigen Verlauf für jeden Agenten.

## Anmerkungen

- Um die Dauer des Subagenten zu messen: `awk '/\[START\].*agent=X/{s=$1} /\[STOP\].*agent=X/{print s, $1}' subagent-activity.log` (erfordert Zeitstamppmathematik – leiten Sie durch Python oder `dateutil` durch, um Genauigkeit zu erreichen).
- Wenn ein Subagent während der Ausführung beendet wird, kann es eine `[START]`-Zeile geben, der keine passende `[STOP]`-Zeile entspricht; behandeln Sie diese bei Ihrer Analyse als Timeout-/Interrupt-Ereignisse.
- Kombinieren Sie mit dem `cost-tracker`-Lebenszyklus-Hook, um die Ausgaben des Subagenten mit den Ergebnissen zu korrelieren.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
