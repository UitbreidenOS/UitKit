# Notifications and Alerts for Long Claude Code Sessions

Complete setup guide for staying informed during long autonomous Claude Code runs — overnight builds, bulk migrations, multi-agent workflows, or any session where you step away from the keyboard. Choose one or combine several based on your environment.

---

## Why this matters

Claude Code can run for hours on autonomous tasks. Without notifications:
- You don't know when a session finishes or stalls
- Permission prompts block progress until you return
- Errors accumulate unnoticed

With notifications, you can leave Claude running and get pulled back only when something needs your attention.

---

## Method 1: ntfy mobile push

**Best for:** Being notified anywhere, including when your laptop is closed.

ntfy is a free, open-source push notification service. No account required for self-hosted. The hosted `ntfy.sh` is free for low volume.

**Setup (hosted ntfy.sh):**

1. Install the ntfy app on iOS or Android and subscribe to a topic (pick a unique name, e.g., `claudient-tushar-2026`).

2. Add a `stop` hook to `settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -d \"Claude session ended\" ntfy.sh/YOUR-TOPIC-NAME"
          }
        ]
      }
    ]
  }
}
```

3. For permission requests, add a `PreToolUse` hook on high-risk tools:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$CLAUDE_TOOL_INPUT\" | grep -qE \"(rm |drop |delete |truncate )\" && curl -s -H \"Priority: urgent\" -d \"Claude wants to run a destructive command\" ntfy.sh/YOUR-TOPIC-NAME || true'"
          }
        ]
      }
    ]
  }
}
```

**Self-hosted ntfy** (Docker):
```bash
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy binwiederhier/ntfy serve
```
Replace `ntfy.sh` with your server address in the curl commands.

**Testing:**
```bash
curl -d "test notification" ntfy.sh/YOUR-TOPIC-NAME
```

---

## Method 2: TTS voice announcer

**Best for:** Casual awareness when you're nearby but not watching the screen.

macOS has built-in TTS via the `say` command. Linux uses `pyttsx3` or `espeak`.

**macOS — Stop hook:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "say 'Claude session complete'"
          }
        ]
      }
    ]
  }
}
```

**macOS — Notification hook on errors:**

```bash
#!/bin/bash
# hooks/tts-error-alert.sh
# Reads CLAUDE_HOOK_EVENT from env and announces errors
if echo "$CLAUDE_HOOK_EVENT" | grep -qi "error\|failed\|permission"; then
  say "Claude needs attention: $(echo $CLAUDE_HOOK_EVENT | head -c 100)"
fi
```

**Linux (pyttsx3):**
```python
#!/usr/bin/env python3
# hooks/tts-announcer.py
import pyttsx3, os, sys

engine = pyttsx3.init()
engine.setProperty('rate', 160)
message = os.environ.get('CLAUDE_SESSION_SUMMARY', 'Claude session complete')
engine.say(message)
engine.runAndWait()
```

Install: `pip install pyttsx3`

**Linux (espeak, no dependencies):**
```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "espeak 'Claude session complete'" }]
  }
}
```

---

## Method 3: Slack webhook notifications

**Best for:** Team visibility — letting teammates know when shared Claude runs finish or need input.

**Setup:**

1. Create an incoming webhook in your Slack workspace (Slack → App Directory → Incoming Webhooks).
2. Copy the webhook URL.

**Stop hook:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST -H 'Content-type: application/json' --data '{\"text\":\"Claude Code session finished in ${PWD}\"}' YOUR-SLACK-WEBHOOK-URL"
          }
        ]
      }
    ]
  }
}
```

**Hook script with context (recommended over inline curl):**

```bash
#!/bin/bash
# hooks/slack-notify.sh
WEBHOOK_URL="${SLACK_CLAUDE_WEBHOOK}"
PROJECT=$(basename "$PWD")
TIMESTAMP=$(date '+%H:%M')

curl -s -X POST -H 'Content-type: application/json' \
  --data "{
    \"blocks\": [
      {
        \"type\": \"section\",
        \"text\": {
          \"type\": \"mrkdwn\",
          \"text\": \"*Claude session complete*\n*Project:* ${PROJECT}\n*Time:* ${TIMESTAMP}\"
        }
      }
    ]
  }" \
  "$WEBHOOK_URL"
```

Store the webhook URL in your shell environment (`~/.zshrc` or `.env`), not in `settings.json`.

**For permission-gate notifications:**

```bash
# hooks/slack-permission-request.sh
# Call this when Claude needs human approval before continuing
curl -s -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"@here Claude needs approval to proceed in *${PROJECT}* — check your terminal\"}" \
  "$WEBHOOK_URL"
```

---

## Method 4: WhatsApp gate for permission requests

**Best for:** Routing high-stakes permission requests to your phone when you're away from the computer.

WhatsApp notifications require the WhatsApp Business Cloud API or a third-party service like Twilio or CallMeBot. CallMeBot is the simplest for personal use.

**CallMeBot setup:**

1. Add the CallMeBot number to your WhatsApp contacts: +34 644 59 65 15
2. Send "I allow callmebot to send me messages" to that number
3. You'll receive your API key in reply

**Hook script:**

```bash
#!/bin/bash
# hooks/whatsapp-gate.sh
PHONE="YOUR_PHONE_NUMBER_WITH_COUNTRY_CODE"  # e.g., 14155551234
API_KEY="YOUR_CALLMEBOT_KEY"
MESSAGE=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))")

curl -s "https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${MESSAGE}&apikey=${API_KEY}"
```

**settings.json — fire on destructive Bash commands:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/hooks/whatsapp-gate.sh 'Claude wants to run: $CLAUDE_TOOL_COMMAND'"
          }
        ]
      }
    ]
  }
}
```

**Limitation:** WhatsApp notifications are one-way — Claude cannot wait for a WhatsApp reply. Use this as an alert only; respond in the terminal.

---

## Method 5: Desktop notifications

**Best for:** When you're at the computer but focused on another window.

**macOS — terminal-notifier:**

```bash
brew install terminal-notifier
```

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "terminal-notifier -title 'Claude Code' -message 'Session complete' -sound default"
          }
        ]
      }
    ]
  }
}
```

**macOS — osascript (no install):**

```bash
osascript -e 'display notification "Session complete" with title "Claude Code" sound name "Glass"'
```

**Linux — notify-send:**

```bash
notify-send "Claude Code" "Session complete" --icon=terminal --urgency=normal
```

For root/service sessions where `DISPLAY` is not set:
```bash
DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send "Claude Code" "Done"
```

---

## Combining methods: priority order

Running all methods at once creates noise. Use a priority stack:

| Scenario | Method |
|---|---|
| Session completes (normal) | TTS voice (casual awareness) |
| Session needs input | Desktop notification + Slack |
| Session hits a destructive command | ntfy mobile push (urgent) + WhatsApp gate |
| Unattended overnight run | ntfy mobile push only |
| Team shared Claude run | Slack webhook |

**Combined settings.json (macOS, personal use):**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "say 'Claude done'" },
          { "type": "command", "command": "terminal-notifier -title 'Claude Code' -message 'Session complete'" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$CLAUDE_TOOL_INPUT\" | grep -qE \"(sudo |rm -rf|drop table|truncate)\" && curl -s -H \"Priority: urgent\" -d \"Dangerous command requested\" ntfy.sh/YOUR-TOPIC || true'"
          }
        ]
      }
    ]
  }
}
```

---

## Testing before leaving Claude unattended

Before starting a long autonomous run:

```bash
# Test TTS
say "test notification"

# Test desktop notification
terminal-notifier -title "Test" -message "Notification works"

# Test ntfy
curl -d "test" ntfy.sh/YOUR-TOPIC

# Test Slack
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"test"}' YOUR-SLACK-WEBHOOK
```

Run a short 2-minute Claude session with your hooks active and confirm at least one notification fires before leaving a multi-hour session unattended.

---
