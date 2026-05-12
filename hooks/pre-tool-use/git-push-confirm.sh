#!/usr/bin/env bash
# git-push-confirm.sh — warns before any git push operation
#
# Install: add to settings.json hooks.PreToolUse
# {
#   "matcher": "Bash",
#   "hooks": [{
#     "type": "command",
#     "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/git-push-confirm.sh",
#     "timeout": 5
#   }]
# }

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except:
    print('')
" 2>/dev/null || echo "")

if echo "$COMMAND" | grep -q "git push"; then
  # Extract branch info if possible
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  REMOTE=$(echo "$COMMAND" | grep -oP '(?<=git push )\S+' 2>/dev/null || echo "origin")

  echo "⚠️  About to push branch '${BRANCH}' to '${REMOTE}'." >&2
  echo "Confirm this is intentional before proceeding." >&2
  exit 1
fi

exit 0
