#!/usr/bin/env bash
# pre-compact-save.sh — saves session state before compaction fires
#
# Install: add to settings.json hooks.PreCompact
# {
#   "matcher": "",
#   "hooks": [{
#     "type": "command",
#     "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
#   }]
# }
#
# Also add to CLAUDE.md:
# "When PreCompact fires, summarize: current task state, files modified,
#  open decisions, next steps. Append to .claude/memory/session-state.md
#  with a timestamp header."

set -euo pipefail

MEMORY_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/memory"
STATE_FILE="${MEMORY_DIR}/session-state.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$MEMORY_DIR"

# Create or append a timestamped section for Claude to fill in
cat >> "$STATE_FILE" << EOF

---
## Session snapshot — ${TIMESTAMP}

*[Claude: append your summary here — current task, files modified, open decisions, next steps]*

EOF

# Output to stdout so Claude sees the instruction
echo "PreCompact triggered at ${TIMESTAMP}. Append your session summary to .claude/memory/session-state.md before compaction."
