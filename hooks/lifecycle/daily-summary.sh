#!/usr/bin/env bash
# Lifecycle hook: log session summary on Stop
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

# Get git info if available
BRANCH=$(git -C "$WORKING_DIR" branch --show-current 2>/dev/null || echo "none")
CHANGED=$(git -C "$WORKING_DIR" diff --stat HEAD 2>/dev/null | tail -1 || echo "no changes")

cat >> "$LOG_FILE" << EOF

## Session — ${TIME}
- **Directory:** ${WORKING_DIR}
- **Branch:** ${BRANCH}
- **Session ID:** ${SESSION_ID}
- **End reason:** ${STOP_REASON}
- **Cost:** \$${TOTAL_COST}
- **Changes:** ${CHANGED}

EOF

echo "📝 Session logged to $LOG_FILE" >&2
