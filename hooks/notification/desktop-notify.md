# Hook: Desktop Notification

Shows a native OS notification when Claude Code is waiting for your input. Works on macOS, Linux (libnotify), and Windows (PowerShell).

## What it does

- Fires on the `Notification` event (when Claude needs permission or has been idle 60+ seconds)
- Shows a native system notification with the message
- No third-party services — uses OS built-ins only

## settings.json entry

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/desktop-notify.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: desktop-notify.sh

```bash
#!/usr/bin/env bash
# Notification hook: native OS desktop notification
set -euo pipefail

INPUT=$(cat)
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // "Waiting for your input"')

if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" sound name \"Ping\""

elif command -v notify-send &>/dev/null; then
  # Linux (requires libnotify-bin)
  notify-send "$TITLE" "$MESSAGE" --icon=dialog-information --urgency=normal

elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]]; then
  # Windows (Git Bash or WSL)
  powershell.exe -Command "
    Add-Type -AssemblyName System.Windows.Forms
    \$notify = New-Object System.Windows.Forms.NotifyIcon
    \$notify.Icon = [System.Drawing.SystemIcons]::Information
    \$notify.BalloonTipTitle = '$TITLE'
    \$notify.BalloonTipText = '$MESSAGE'
    \$notify.Visible = \$true
    \$notify.ShowBalloonTip(5000)
  " 2>/dev/null
fi

exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp desktop-notify.sh ~/.claude/hooks/desktop-notify.sh
chmod +x ~/.claude/hooks/desktop-notify.sh

# macOS — no install needed

# Linux
sudo apt install libnotify-bin    # Ubuntu/Debian
sudo dnf install libnotify        # Fedora
```

## Combining hooks

Stack with ntfy-push for both desktop + mobile alerts:
```json
{
  "hooks": {
    "Notification": [
      { "hooks": [{ "type": "command", "command": "bash ~/.claude/hooks/desktop-notify.sh" }] },
      { "hooks": [{ "type": "command", "command": "bash ~/.claude/hooks/ntfy-push.sh" }] }
    ]
  }
}
```
