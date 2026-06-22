#!/usr/bin/env bash
# Setup hook: auto-apply Matrix theme if enabled in settings
set -euo pipefail

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')

# Check project settings first
PROJECT_SETTINGS="$CWD/.claude/settings.json"
GLOBAL_SETTINGS="$HOME/.claude/settings.json"

THEME=""

# Read from project settings if present
if [[ -f "$PROJECT_SETTINGS" ]]; then
  THEME=$(jq -r '.theme // empty' "$PROJECT_SETTINGS" 2>/dev/null || echo "")
fi

# Fall back to global settings if not found in project
if [[ -z "$THEME" && -f "$GLOBAL_SETTINGS" ]]; then
  THEME=$(jq -r '.theme // empty' "$GLOBAL_SETTINGS" 2>/dev/null || echo "")
fi

# Apply Matrix theme if enabled
if [[ "$THEME" == "matrix" ]]; then
  # Terminal color codes for Matrix effect
  export CLICOLOR_FORCE=1

  # Green text styling (Matrix green: #00FF00)
  export LS_COLORS="di=1;32:fi=0;32:ln=1;32:ex=1;32:*.js=32:*.ts=32:*.json=32"

  # Apply theme marker for CLI tooling
  echo "🟢 Matrix theme activated" >&2

  # Signal successful theme application
  exit 0
fi

# No theme configured — proceed with default
exit 0
