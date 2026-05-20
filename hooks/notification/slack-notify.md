# Hook: Slack Notification

Posts a message to a Slack channel when Claude Code needs your input. Ideal for team environments or when you're working across multiple screens with Slack open.

## What it does

- Fires on the `Notification` event
- Posts to a Slack channel or DM via webhook
- Includes the message and a timestamp
- Silent failure if Slack is unreachable (won't break your workflow)

## settings.json entry

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/slack-notify.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: slack-notify.sh

```bash
#!/usr/bin/env bash
# Notification hook: post to Slack when Claude needs attention
set -euo pipefail

INPUT=$(cat)
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // "Waiting for your input"')
TIMESTAMP=$(date '+%H:%M:%S')

# Set SLACK_WEBHOOK_URL in your environment
WEBHOOK="${SLACK_WEBHOOK_URL:-}"
if [[ -z "$WEBHOOK" ]]; then
  exit 0  # Not configured — skip silently
fi

PAYLOAD=$(jq -n \
  --arg title "$TITLE" \
  --arg msg "$MESSAGE" \
  --arg ts "$TIMESTAMP" \
  '{
    "text": "*\($title)* — \($msg)",
    "attachments": [{
      "color": "#f97316",
      "footer": "Claude Code · \($ts)"
    }]
  }')

curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$WEBHOOK" \
  > /dev/null

exit 0
```

## Setup

```bash
# 1. Create a Slack webhook
#    Slack → Apps → Incoming Webhooks → Add to Slack → Copy webhook URL

# 2. Install the hook
mkdir -p ~/.claude/hooks
cp slack-notify.sh ~/.claude/hooks/slack-notify.sh
chmod +x ~/.claude/hooks/slack-notify.sh

# 3. Add webhook URL to your shell config
echo 'export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"' >> ~/.zshrc
```
