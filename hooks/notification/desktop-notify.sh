#!/usr/bin/env bash
# Notification hook: native desktop notification (macOS/Linux/Windows)
set -euo pipefail

INPUT=$(cat)
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // "Waiting for your input"')

if [[ "$OSTYPE" == "darwin"* ]]; then
  osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" sound name \"Ping\""
elif command -v notify-send &>/dev/null; then
  notify-send "$TITLE" "$MESSAGE" --icon=dialog-information --urgency=normal
elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]]; then
  powershell.exe -Command "
    Add-Type -AssemblyName System.Windows.Forms
    \$n = New-Object System.Windows.Forms.NotifyIcon
    \$n.Icon = [System.Drawing.SystemIcons]::Information
    \$n.BalloonTipTitle = '$TITLE'; \$n.BalloonTipText = '$MESSAGE'
    \$n.Visible = \$true; \$n.ShowBalloonTip(5000)
  " 2>/dev/null
fi

exit 0
