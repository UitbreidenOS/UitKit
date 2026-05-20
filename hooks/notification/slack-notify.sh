#!/usr/bin/env bash
# Notification hook: post to Slack when Claude needs attention
set -euo pipefail

INPUT=$(cat)
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // "Waiting for your input"')
TIMESTAMP=$(date '+%H:%M:%S')
WEBHOOK="${SLACK_WEBHOOK_URL:-}"

[[ -z "$WEBHOOK" ]] && exit 0

PAYLOAD=$(jq -n \
  --arg title "$TITLE" \
  --arg msg "$MESSAGE" \
  --arg ts "$TIMESTAMP" \
  '{"text":"*\($title)* — \($msg)","attachments":[{"color":"#f97316","footer":"Claude Code · \($ts)"}]}')

curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$WEBHOOK" > /dev/null
exit 0
