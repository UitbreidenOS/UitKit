#!/usr/bin/env bash
# PreToolUse hook: auto-approve read-only operations without user prompt
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
READONLY_TOOLS="Read|Glob|Grep|LS|TodoRead"

if echo "$TOOL_NAME" | grep -qE "^($READONLY_TOOLS)$"; then
  echo '{"decision":"approve","reason":"Read-only operation auto-approved"}'
  exit 0
fi

exit 0
