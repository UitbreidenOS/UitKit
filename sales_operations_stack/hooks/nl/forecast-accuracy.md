# Forecast Accuracy Hook

## Doel

Bewaakt wekelijkse prognoses. Markeert deals die langer dan 30 dagen in dezelfde fase staan of met een prognoseafwijking >10% voor escalatie naar verkoopsleiding.

## Settings.json-invoer

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "WebFetch.*forecast|Write.*forecast",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/forecast-accuracy.sh" }
        ]
      }
    ]
  }
}