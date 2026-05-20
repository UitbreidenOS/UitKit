#!/usr/bin/env bash
# Post-tool-use hook: auto-run related tests after file edits
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then exit 0; fi
if [[ "$FILE_PATH" == *".test."* || "$FILE_PATH" == *".spec."* ]]; then exit 0; fi
if [[ "$FILE_PATH" == *"config"* || "$FILE_PATH" == *".json" ]]; then exit 0; fi
if [[ "${AUTO_TEST:-true}" == "false" ]]; then exit 0; fi

BASE=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//')

if [[ -f "package.json" ]]; then
  if grep -q '"vitest"' package.json 2>/dev/null; then
    TEST_FILE=$(find . -name "${BASE}.test.*" -o -name "${BASE}.spec.*" 2>/dev/null | head -1)
    if [[ -n "$TEST_FILE" ]]; then
      echo "🧪 Running: npx vitest run $TEST_FILE" >&2
      npx vitest run "$TEST_FILE" --reporter=verbose 2>&1 || exit 1
    fi
  elif grep -q '"jest"' package.json 2>/dev/null; then
    echo "🧪 Running: npx jest --testPathPattern=${BASE}" >&2
    npx jest --testPathPattern="${BASE}" --verbose 2>&1 || exit 1
  fi
elif command -v pytest &>/dev/null; then
  echo "🧪 Running: pytest -k ${BASE}" >&2
  python -m pytest -v -k "${BASE}" 2>&1 || true
fi

exit 0
