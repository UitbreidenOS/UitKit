#!/usr/bin/env bash
# PostToolUse hook: auto-stage files after Claude edits them
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then exit 0; fi
if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then exit 0; fi
if [[ "${CLAUDE_SKIP_AUTOSTAGE:-false}" == "1" ]]; then exit 0; fi

if ! git -C "$(dirname "$FILE_PATH")" rev-parse --git-dir &>/dev/null; then exit 0; fi
if git -C "$(dirname "$FILE_PATH")" check-ignore -q "$FILE_PATH" 2>/dev/null; then exit 0; fi

git add "$FILE_PATH"
echo "✅ Staged: $FILE_PATH" >&2
exit 0
