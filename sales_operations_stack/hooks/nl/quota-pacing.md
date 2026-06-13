# Quota Pacing Hook

## Doel

Real-time quotatracking. Geeft waarschuwingen wanneer een individu of team >15% achter op het dagelijkse/wekelijkse ritme ligt dat nodig is om de quota aan het einde van de maand te halen.

## Settings.json Entry

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