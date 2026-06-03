# Hook: Subagent Stop Summary

Wordt geactiveerd op `SubagentStop` om een eenregelige resultaatsamenvatting aan het sessielogboek toe te voegen — wat u een chronologische registratie geeft van elke subagent-aanroep en het resultaat daarvan in één bestand.

## Wat het doet

Leest de `SubagentStop` payload van stdin en voegt een voorzien van een tijdstempel samenvatting toe aan `.claude/logs/subagent-activity.log` (hetzelfde bestand dat door `subagent-start-logger` wordt geschreven). De regel bevat:

- ISO-8601 timestamp
- `[STOP]` marker voor eenvoudig grep/awk filteren
- Agentnaam
- Exit status / succesaanduiding
- Eerste 120 tekens van het resultaat of foutbericht

Voorbeeld logregel:
```
2026-06-03T09:14:35Z [STOP]  agent=security-reviewer session=abc123 status=success result="No critical vulnerabilities found. 2 low-severity warnings in src/api/routes.py."
```

Door `[START]` en `[STOP]` regels in het logboek te combineren, is het eenvoudig om de muurklok-tijd van een subagent te meten met een eenvoudig awk-script.

## Wanneer het wordt geactiveerd

`SubagentStop` — wordt geactiveerd telkens wanneer een subagent klaar is, ongeacht of deze slaagde, fouten gaf of werd onderbroken.

## settings.json entry

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

## Script

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

Implementeer naast `subagent-start-logger` voor een volledige start/stop-tracering. Beide hooks schrijven naar hetzelfde logbestand, dus een eenvoudige `grep agent=security-reviewer .claude/logs/subagent-activity.log` toont de volledige geschiedenis voor elke agent.

## Notities

- Om subagent-duur te meten: `awk '/\[START\].*agent=X/{s=$1} /\[STOP\].*agent=X/{print s, $1}' subagent-activity.log` (vereist timestamp-wiskunde — pipe via Python of `dateutil` voor nauwkeurigheid).
- Als een subagent halverwege de uitvoering wordt afgebroken, kan er een `[START]` zijn zonder overeenkomende `[STOP]`; behandel deze als timeout/interrupt-events in uw analyse.
- Combineer met de `cost-tracker` lifecycle hook om subagent-uitgaven met resultaten te correleren.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
