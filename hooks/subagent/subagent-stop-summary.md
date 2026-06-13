# Hook: Subagent Stop Summary

Fires on `SubagentStop` to append a one-line result summary to the session log — giving you a chronological record of every subagent invocation and its outcome in a single file.

## What it does

Reads the `SubagentStop` payload from stdin and appends a timestamped summary line to `.claude/logs/subagent-activity.log` (the same file written by `subagent-start-logger`). The line includes:

- ISO-8601 timestamp
- `[STOP]` marker for easy grep/awk filtering
- Agent name
- Exit status / success indicator
- First 120 characters of the result or error message

Example log line:
```
2026-06-03T09:14:35Z [STOP]  agent=security-reviewer session=abc123 status=success result="No critical vulnerabilities found. 2 low-severity warnings in src/api/routes.py."
```

Pairing `[START]` and `[STOP]` lines in the log makes it straightforward to measure subagent wall-clock time with a simple awk script.

## When it fires

`SubagentStop` — fires each time a subagent finishes, whether it succeeded, errored, or was interrupted.

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

Deploy alongside `subagent-start-logger` for a complete start/stop trace. Both hooks write to the same log file, so a single `grep agent=security-reviewer .claude/logs/subagent-activity.log` shows the full history for any agent.

## Notes

- To measure subagent duration: `awk '/\[START\].*agent=X/{s=$1} /\[STOP\].*agent=X/{print s, $1}' subagent-activity.log` (requires timestamp math — pipe through Python or `dateutil` for accuracy).
- If a subagent is killed mid-run there may be a `[START]` with no matching `[STOP]`; treat those as timeout/interrupt events in your analysis.
- Combine with the `cost-tracker` lifecycle hook to correlate subagent spend with outcomes.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
