#!/usr/bin/env bash
# prettier.sh — auto-formats files after Claude writes or edits them
#
# Install: add to settings.json hooks.PostToolUse
# {
#   "matcher": "Write|Edit",
#   "hooks": [{
#     "type": "command",
#     "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/prettier.sh",
#     "async": true
#   }]
# }
#
# Requires: prettier installed (npx prettier or local node_modules)

set -euo pipefail

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format files prettier supports
SUPPORTED_EXTENSIONS=("js" "jsx" "ts" "tsx" "json" "css" "scss" "html" "md" "yaml" "yml")
EXTENSION="${FILE_PATH##*.}"

for ext in "${SUPPORTED_EXTENSIONS[@]}"; do
  if [ "$EXTENSION" = "$ext" ]; then
    # Use local prettier if available, fall back to npx
    if [ -f "${CLAUDE_PROJECT_DIR:-$(pwd)}/node_modules/.bin/prettier" ]; then
      "${CLAUDE_PROJECT_DIR:-$(pwd)}/node_modules/.bin/prettier" --write "$FILE_PATH" 2>/dev/null || true
    else
      npx prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    exit 0
  fi
done

exit 0
