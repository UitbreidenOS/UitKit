#!/usr/bin/env bash
# cost-tracker.sh — estimates and logs token costs per session
#
# Install: add to settings.json hooks.PostToolUse
# {
#   "matcher": "",
#   "hooks": [{
#     "type": "command",
#     "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh",
#     "async": true
#   }]
# }
#
# Log location: .claude/logs/costs.log
# Add .claude/logs/ to .gitignore

set -euo pipefail

INPUT=$(cat)
LOG_FILE="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/logs/costs.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"

mkdir -p "$(dirname "$LOG_FILE")"

# Extract token usage if available in the event payload
USAGE=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    usage = d.get('usage', {})
    inp_tokens = usage.get('input_tokens', 0)
    out_tokens = usage.get('output_tokens', 0)
    cache_read = usage.get('cache_read_input_tokens', 0)
    cache_write = usage.get('cache_creation_input_tokens', 0)

    # Approximate costs (Sonnet 4.6 pricing as baseline — update as needed)
    # Input: \$3/MTok, Output: \$15/MTok, Cache read: \$0.30/MTok, Cache write: \$3.75/MTok
    cost = (
        (inp_tokens / 1_000_000) * 3.0 +
        (out_tokens / 1_000_000) * 15.0 +
        (cache_read / 1_000_000) * 0.30 +
        (cache_write / 1_000_000) * 3.75
    )
    print(f'input={inp_tokens} output={out_tokens} cache_read={cache_read} est_cost_usd={cost:.6f}')
except Exception as e:
    print(f'parse_error={e}')
" 2>/dev/null || echo "usage=unavailable")

TOOL_NAME=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_name', 'unknown'))
except:
    print('unknown')
" 2>/dev/null || echo "unknown")

echo "${TIMESTAMP} | session=${SESSION_ID} | tool=${TOOL_NAME} | ${USAGE}" >> "$LOG_FILE"
