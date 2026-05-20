# Hook: ntfy Mobile Push Notifications

Send instant push notifications to your phone when Claude Code needs permission or has been idle. Never miss a prompt when running long background sessions.

## What it does

- Sends a push notification to your phone via [ntfy.sh](https://ntfy.sh) (free, open source)
- Fires on the `Notification` event — when Claude needs your permission or has been waiting
- Works on iOS, Android, and desktop via the ntfy app or browser
- No account required — just pick a topic name

## settings.json entry

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/ntfy-push.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: ntfy-push.sh

```bash
#!/usr/bin/env bash
# Notification hook: send mobile push via ntfy.sh when Claude needs attention
set -euo pipefail

INPUT=$(cat)
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // "Claude needs your attention"')

# Your ntfy topic — change this to something unique (e.g. your-name-claude-123)
NTFY_TOPIC="${NTFY_TOPIC:-your-claude-topic}"

# Send push notification
curl -s \
  -H "Title: $TITLE" \
  -H "Priority: high" \
  -H "Tags: robot" \
  -d "$MESSAGE" \
  "https://ntfy.sh/$NTFY_TOPIC" \
  > /dev/null

exit 0
```

## Setup (5 minutes)

```bash
# 1. Install the ntfy app on your phone
#    iOS: https://apps.apple.com/app/ntfy/id1625396347
#    Android: https://play.google.com/store/apps/details?id=io.heckel.ntfy

# 2. Subscribe to your topic in the app
#    Open ntfy → Add subscription → enter "your-claude-topic"

# 3. Install the hook
mkdir -p ~/.claude/hooks
cat > ~/.claude/hooks/ntfy-push.sh << 'EOF'
[paste the script above]
EOF
chmod +x ~/.claude/hooks/ntfy-push.sh

# 4. Set your topic (add to ~/.zshrc or ~/.bashrc)
export NTFY_TOPIC="your-name-claude-$(whoami)"
```

## Self-hosted ntfy (optional, for privacy)

```bash
# Run your own ntfy server with Docker
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy binwiederhier/ntfy serve

# Update the URL in the script:
# "https://your-server.com/$NTFY_TOPIC"
```

## Tips

- Set a unique topic name — anyone who knows your topic can send you messages
- Use `ntfy.sh` for personal use; self-host for team or sensitive sessions
- Add `"Tags: rotating_light"` for urgent alerts, `"Tags: white_check_mark"` for completions
- Combine with the `daily-summary` hook for a complete session awareness system
