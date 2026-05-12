#!/usr/bin/env bash
# block-dangerous.sh — blocks destructive shell commands before they execute
#
# Install: add to settings.json hooks.PreToolUse
# {
#   "matcher": "Bash",
#   "hooks": [{
#     "type": "command",
#     "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-dangerous.sh",
#     "timeout": 5
#   }]
# }
#
# Exit codes: 0=allow, 1=warn, 2=block

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

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Patterns that are always blocked
BLOCKED_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \$HOME"
  "> /dev/sda"
  "mkfs"
  "dd if=/dev/zero"
  ":(){ :|:& };:"          # Fork bomb
  "chmod -R 777 /"
  "chown -R"
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qF "$pattern" 2>/dev/null; then
    echo "BLOCKED: '${pattern}' is not permitted." >&2
    exit 2
  fi
done

# Patterns that require warning (exit 1 — Claude sees warning, user decides)
WARN_PATTERNS=(
  "rm -rf"
  "| bash"
  "| sh"
  "| zsh"
  "curl.*| "
  "wget.*| "
  "sudo "
  "git push --force"
  "git reset --hard"
  "git clean -f"
  "DROP TABLE"
  "DROP DATABASE"
  "TRUNCATE"
)

for pattern in "${WARN_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern" 2>/dev/null; then
    echo "WARNING: command matches potentially dangerous pattern '${pattern}'. Proceed only if intentional." >&2
    exit 1
  fi
done

exit 0
