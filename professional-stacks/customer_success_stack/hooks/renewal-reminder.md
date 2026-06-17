# Hook: Renewal Reminder

Fires 90 days, 30 days, and 7 days before renewal date.

## Settings Entry

```json
{
  "hooks": {
    "renewal-reminder": {
      "enabled": true,
      "windows": [90, 30, 7],
      "action": "alert-cs-team"
    }
  }
}
```

## Behavior

- Checks renewal date against today
- Sends summary email to account owner
- Flags accounts with health <50

## When

Daily, 6am UTC
