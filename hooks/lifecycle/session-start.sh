#!/usr/bin/env bash
# session-start.sh — loads context reminders at the start of each session
#
# Install: add to settings.json hooks.SessionStart
# {
#   "matcher": "",
#   "hooks": [{
#     "type": "command",
#     "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh"
#   }]
# }

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

REMINDERS=()

# Check for previous session state
if [ -f "${PROJECT_DIR}/.claude/memory/session-state.md" ]; then
  REMINDERS+=("Previous session state found at .claude/memory/session-state.md — read it before starting work.")
fi

# Check for current task file
if [ -f "${PROJECT_DIR}/.claude/memory/current-task.md" ]; then
  REMINDERS+=("Active task context found at .claude/memory/current-task.md — read it to understand what's in progress.")
fi

# Check for CONTEXT.md
if [ -f "${PROJECT_DIR}/CONTEXT.md" ]; then
  REMINDERS+=("Domain glossary available at CONTEXT.md — use it for project terminology.")
fi

# Check for ADRs
if [ -d "${PROJECT_DIR}/docs/adr" ] && [ "$(ls -A "${PROJECT_DIR}/docs/adr" 2>/dev/null)" ]; then
  ADR_COUNT=$(find "${PROJECT_DIR}/docs/adr" -name "*.md" | wc -l | tr -d ' ')
  REMINDERS+=("${ADR_COUNT} architectural decisions recorded in docs/adr/ — check before making architectural choices.")
fi

# Output reminders
if [ ${#REMINDERS[@]} -gt 0 ]; then
  echo "=== Session context ==="
  for reminder in "${REMINDERS[@]}"; do
    echo "• $reminder"
  done
  echo "======================"
fi
