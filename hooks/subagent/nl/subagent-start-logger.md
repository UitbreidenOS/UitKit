# Hook: Subagent Start Logger

Reageert op `SubagentStart` om vast te leggen welke subagent is gestart, welke taak deze heeft ontvangen, en wanneer — en bouwt daarmee een doorlopend logboek van alle agentactiviteiten in de sessie.

## Wat het doet

Leest de `SubagentStart`-payload uit stdin (JSON bevattende de agentnaam, model en taakbeschrijving) en voegt een voorzien van een timestamp één-lijnige entry toe aan `.claude/logs/subagent-activity.log`. De logentry bevat:

- ISO-8601-timestamp
- Agentnaam / toolnaam
- Eerste 120 tekens van de taakprompt (voldoende context, niet te uitgebreid)
- Sessie-ID (uit `CLAUDE_SESSION_ID` omgevingsvariabele indien beschikbaar)

Voorbeeld van logliijn:
```
2026-06-03T09:14:22Z [START] agent=security-reviewer session=abc123 task="Review the pending diff for injection vulnerabilities in src/api/..."
```

## Wanneer het reageert

`SubagentStart` — reageert elke keer dat Claude Code een subagent opwekt (parallelle tooloproepen, gedelegeerde agenten, vaardigheidsaanroepen die als subproces draaien).

## settings.json entry

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

Stel `matcher` in op `""` om alle subagenten op te vangen, of geef een gedeeltelijke overeenkomst van de agentnaam op (bijv. `"security"`) om te filteren.

## Script

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

Voeg het `settings.json`-fragment toe aan `.claude/settings.json` of `~/.claude/settings.json`.

## Opmerkingen

- Het logbestand groeit onbeperkt; roteer met `logrotate` of een wekelijkse cron die bestanden ouder dan 30 dagen archiveert.
- `SubagentStart` reageert voordat de subagent draait, dus het taakvel weerspiegelt het beoogde werk, niet het uiteindelijke resultaat — koppel met `subagent-stop-summary` om resultaten vast te leggen.
- Als `jq` niet is geïnstalleerd (`brew install jq` / `apt install jq`), is de fallback grep-parsing minder robuust — installeer jq voor productiegebruik.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
