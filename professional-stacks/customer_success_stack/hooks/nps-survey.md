# Hook: NPS Survey

Triggers post-interaction or on quarterly schedule.

## Settings Entry

```json
{
  "hooks": {
    "nps-survey": {
      "enabled": true,
      "trigger": "post-interaction|quarterly",
      "delay_hours": 24,
      "action": "send-survey"
    }
  }
}
```

## Behavior

- Sends NPS survey link via email
- Captures response and sentiment
- Logs to satisfaction-tracking skill

## When

24 hours after interaction or first Monday of each quarter
