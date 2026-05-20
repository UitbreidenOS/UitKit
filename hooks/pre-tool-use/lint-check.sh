#!/usr/bin/env bash
# Post-tool-use hook: run linter on edited files
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then exit 0; fi
if [[ "${CLAUDE_SKIP_LINT:-false}" == "1" ]]; then exit 0; fi
if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then exit 0; fi

EXT="${FILE_PATH##*.}"

if [[ "$EXT" =~ ^(ts|tsx|js|jsx)$ ]]; then
  if command -v npx &>/dev/null && ls .eslintrc* eslint.config* 2>/dev/null | head -1 &>/dev/null; then
    echo "🔍 ESLint: $FILE_PATH" >&2
    npx eslint "$FILE_PATH" --max-warnings=0 2>&1 || exit 1
    echo "✅ Lint passed" >&2
  fi
elif [[ "$EXT" == "py" ]]; then
  if command -v ruff &>/dev/null; then
    echo "🔍 Ruff: $FILE_PATH" >&2
    ruff check "$FILE_PATH" 2>&1 || exit 1
    echo "✅ Lint passed" >&2
  fi
fi

exit 0
