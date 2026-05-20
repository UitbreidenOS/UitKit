# Hook: Daily Session Summary

Automatically writes a summary of what Claude accomplished in the session to a local log file when the session ends. Useful for tracking AI-assisted work without manual journaling.

## settings.json entry

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/daily-summary.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: daily-summary.sh

```bash
#!/usr/bin/env bash
# Lifecycle hook: append session summary to daily log on session end
set -euo pipefail

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
STOP_REASON=$(echo "$INPUT" | jq -r '.stop_reason // "normal"')
TOTAL_COST=$(echo "$INPUT" | jq -r '.total_cost_usd // 0')
WORKING_DIR=$(echo "$INPUT" | jq -r '.cwd // "unknown"')

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)
LOG_FILE="$HOME/.claude/sessions/${DATE}.md"

mkdir -p "$(dirname "$LOG_FILE")"

# Write session entry
cat >> "$LOG_FILE" << EOF

## Session — ${TIME}
- **Directory:** ${WORKING_DIR}
- **Session ID:** ${SESSION_ID}
- **End reason:** ${STOP_REASON}
- **Cost:** \$${TOTAL_COST}

EOF

echo "📝 Session logged to $LOG_FILE" >&2
```

## Setup

```bash
mkdir -p ~/.claude/hooks ~/.claude/sessions
cp daily-summary.sh ~/.claude/hooks/daily-summary.sh
chmod +x ~/.claude/hooks/daily-summary.sh
```

## Output

Creates `~/.claude/sessions/2026-05-20.md` with entries like:

```markdown
## Session — 14:32:10
- **Directory:** /Users/tushar/Desktop/my-project
- **Session ID:** abc123
- **End reason:** normal
- **Cost:** $0.42
```

## Extended version (with git diff summary)

```bash
# Add to the hook after the basic entry:
BRANCH=$(git -C "$WORKING_DIR" branch --show-current 2>/dev/null || echo "none")
CHANGED=$(git -C "$WORKING_DIR" diff --stat HEAD 2>/dev/null | tail -1 || echo "no changes")

cat >> "$LOG_FILE" << EOF
- **Branch:** ${BRANCH}
- **Changes:** ${CHANGED}
EOF
```
