#!/usr/bin/env bash
# Stop hook: queue a session retrospective for the next session
set -euo pipefail

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')
STOP_REASON=$(echo "$INPUT" | jq -r '.stop_reason // "normal"')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
TOTAL_COST=$(echo "$INPUT" | jq -r '.total_cost_usd // 0')

[[ "$STOP_REASON" == "interrupt" ]] && exit 0

RETRO_FILE="$CWD/.claude/retro-pending.md"
mkdir -p "$(dirname "$RETRO_FILE")"

cat > "$RETRO_FILE" << EOF
# Session Retrospective — ${TIMESTAMP}
Cost: \$${TOTAL_COST} | Reason: ${STOP_REASON}

Review recent session history and categorise learnings into:
1. CLAUDE.md updates (persistent context)
2. New rules (coding standards)
3. Skill ideas (repetitive workflows)
4. ADRs (architecture decisions)
5. Bugs discovered (unfixed issues)

Delete this file after processing.
EOF

echo "📝 Retro queued: $RETRO_FILE" >&2
exit 0
