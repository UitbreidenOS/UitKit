#!/usr/bin/env bash
# Pre-tool-use hook: scan file writes for hardcoded secrets
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

if [[ -z "$CONTENT" ]]; then
  exit 0
fi

# Skip .env.example files (intentional placeholders)
if [[ "$FILE_PATH" == *".env.example"* ]]; then
  exit 0
fi

PATTERNS=(
  'sk-[a-zA-Z0-9]{20,}'
  'sk-ant-[a-zA-Z0-9\-]{20,}'
  'ghp_[a-zA-Z0-9]{36}'
  'npm_[a-zA-Z0-9]{36}'
  'AKIA[A-Z0-9]{16}'
  'xoxb-[0-9\-a-zA-Z]{50,}'
)

FOUND=false
for PATTERN in "${PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qE "$PATTERN" 2>/dev/null; then
    FOUND=true
    echo "⚠️  POTENTIAL SECRET DETECTED in $FILE_PATH — pattern: $PATTERN" >&2
  fi
done

if [[ "$FOUND" == "true" ]]; then
  exit 1
fi

exit 0
