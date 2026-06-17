# Forecast Accuracy Hook

## Zweck

Überwacht wöchentliche Prognosen. Flaggt Deals mit Aging >30 Tagen in gleicher Phase oder Prognosevarianz >10% zur Eskalation an die Vertriebsleitung.

## Settings.json Eintrag

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