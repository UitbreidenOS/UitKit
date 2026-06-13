# Quota-Pacing-Hook

## Zweck

Echtzeit-Quota-Tracking. Benachrichtigungen wenn ein Einzelner oder ein Team >15 % hinter dem täglichen/wöchentlichen Tempo zurückfällt, das erforderlich ist, um die Quota bis Monatsende zu erreichen.

## Settings.json Eintrag

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*quota",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/quota-pacing.sh" }
        ]
      }
    ]
  }
}