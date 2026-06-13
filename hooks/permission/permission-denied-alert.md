# Hook: Permission Denied Alert

Fires on `PermissionDenied` to immediately notify you — via desktop notification or Slack — whenever Claude Code is blocked from performing an action. Keeps you informed without requiring you to watch the terminal.

## What it does

Reads the `PermissionDenied` payload from stdin, extracts the blocked tool and reason, and:

1. Sends a **macOS desktop notification** (via `osascript`) with the tool name and a truncated reason
2. Optionally POSTs a message to a **Slack webhook** if `SLACK_WEBHOOK_URL` is set in the environment
3. Appends a record to `.claude/logs/permission-denied.log` for later review

Example desktop notification:
```
Claude Code — Permission Denied
Bash: "git push --force origin main" was blocked. Reason: matched dangerous pattern.
```

Example log line:
```
2026-06-03T10:45:01Z [DENIED] tool=Bash session=abc123 reason="matched dangerous pattern" input="git push --force origin main"
```

## When it fires

`PermissionDenied` — fires after a permission decision results in a block (either from a hook exit 2, a user declining a prompt, or a policy rule).

## settings.json entry

```json
{
  "hooks": {
    "PermissionDenied": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/permission-denied-alert.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## Script

`permission-denied-alert.sh`

```bash
#!/usr/bin/env bash
# permission-denied-alert.sh
# Fires on PermissionDenied — desktop + Slack notification when an action is blocked

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/permission-denied.log"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  TOOL=$(echo "$PAYLOAD"   | jq -r '.tool_name // .tool // "unknown"')
  REASON=$(echo "$PAYLOAD" | jq -r '.reason // .message // "no reason given"' | head -c 120)
  INPUT=$(echo "$PAYLOAD"  | jq -r '.tool_input | tostring' | head -c 80)
else
  TOOL=$(echo "$PAYLOAD"   | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  REASON="see log"
  INPUT=""
fi

# Log entry
echo "${TIMESTAMP} [DENIED] tool=${TOOL} session=${SESSION} reason=\"${REASON}\" input=\"${INPUT}\"" >> "$LOG_FILE"

# macOS desktop notification
if command -v osascript &>/dev/null; then
  osascript -e "display notification \"${TOOL}: ${REASON}\" with title \"Claude Code — Permission Denied\" sound name \"Basso\"" 2>/dev/null || true
fi

# Linux desktop notification
if command -v notify-send &>/dev/null; then
  notify-send "Claude Code — Permission Denied" "${TOOL}: ${REASON}" --urgency=normal 2>/dev/null || true
fi

# Slack webhook (optional — set SLACK_WEBHOOK_URL in your environment)
if [[ -n "${SLACK_WEBHOOK_URL:-}" ]] && command -v curl &>/dev/null; then
  SLACK_BODY=$(printf '{"text":"*Claude Code — Permission Denied*\n*Tool:* %s\n*Reason:* %s\n*Session:* %s"}' \
    "$TOOL" "$REASON" "$SESSION")
  curl -s -X POST -H 'Content-type: application/json' \
    --data "$SLACK_BODY" "$SLACK_WEBHOOK_URL" &>/dev/null || true
fi

exit 0
```

## Setup

```bash
cp hooks/permission/permission-denied-alert.sh .claude/hooks/
chmod +x .claude/hooks/permission-denied-alert.sh
mkdir -p .claude/logs
```

For Slack notifications, export `SLACK_WEBHOOK_URL` in your shell profile or add it to `.claude/settings.json` under `env`:

```json
{
  "env": {
    "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/T.../B.../..."
  }
}
```

## Notes

- The `Basso` sound on macOS is the default "blocked" system sound. Change to `"Funk"`, `"Sosumi"`, or `""` (no sound) to taste.
- On Linux without `notify-send`, install `libnotify-bin` (`apt install libnotify-bin`) or replace the notification call with a `wall` broadcast.
- This hook always exits 0 — it is purely reactive and does not affect the deny decision that already occurred.
- Pair with `permission-request-audit` to log the full before/after picture: what was requested and what was ultimately blocked.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
