# Hook: Subagent Start Logger

Fires on `SubagentStart` to record which subagent launched, what task it received, and when — building a running trace of all agent activity in the session.

## What it does

Reads the `SubagentStart` payload from stdin (JSON containing the agent name, model, and task description) and appends a timestamped one-liner to `.claude/logs/subagent-activity.log`. The log entry includes:

- ISO-8601 timestamp
- Agent name / tool name
- First 120 characters of the task prompt (enough context, not too verbose)
- Session ID (from `CLAUDE_SESSION_ID` env var when available)

Example log line:
```
2026-06-03T09:14:22Z [START] agent=security-reviewer session=abc123 task="Review the pending diff for injection vulnerabilities in src/api/..."
```

## When it fires

`SubagentStart` — fires each time Claude Code spawns a subagent (parallel tool calls, delegated agents, skill invocations that run as a subprocess).

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

Set `matcher` to `""` to catch all subagents, or supply a substring of the agent name (e.g. `"security"`) to filter.

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

Add the `settings.json` snippet to `.claude/settings.json` or `~/.claude/settings.json`.

## Notes

- The log file grows indefinitely; rotate with `logrotate` or a weekly cron that archives files older than 30 days.
- `SubagentStart` fires before the subagent runs, so the task field reflects the intended work, not the final result — pair with `subagent-stop-summary` to capture outcomes.
- If `jq` is not installed (`brew install jq` / `apt install jq`), the fallback grep parsing is less robust — install jq for production use.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
