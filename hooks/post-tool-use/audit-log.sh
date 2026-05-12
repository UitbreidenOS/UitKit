#!/usr/bin/env bash
# audit-log.sh — logs every tool call with timestamp and tool name
#
# Install: add to settings.json hooks.PostToolUse
# {
#   "matcher": "",
#   "hooks": [{
#     "type": "command",
#     "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh",
#     "async": true
#   }]
# }
#
# Log location: .claude/logs/audit.log
# Add .claude/logs/ to .gitignore

set -euo pipefail

INPUT=$(cat)
LOG_FILE="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/logs/audit.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$LOG_FILE")"

TOOL_NAME=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_name', 'unknown'))
except:
    print('unknown')
" 2>/dev/null || echo "unknown")

TOOL_SUMMARY=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    inp = d.get('tool_input', {})
    # Summarize without exposing sensitive values
    if 'command' in inp:
        print(f\"cmd: {str(inp['command'])[:120]}\")
    elif 'file_path' in inp:
        print(f\"file: {inp['file_path']}\")
    elif 'url' in inp:
        print(f\"url: {inp['url']}\")
    else:
        keys = list(inp.keys())[:3]
        print(f\"keys: {keys}\")
except:
    print('(parse error)')
" 2>/dev/null || echo "(error)")

echo "${TIMESTAMP} | ${TOOL_NAME} | ${TOOL_SUMMARY}" >> "$LOG_FILE"
