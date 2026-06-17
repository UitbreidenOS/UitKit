# Hook: Churn Alert

Fires when engagement metrics drop below threshold.

## Settings Entry

```json
{
  "hooks": {
    "churn-alert": {
      "enabled": true,
      "threshold_pct": 30,
      "lookback_days": 7,
      "action": "notify-owner"
    }
  }
}
```

## Behavior

- Monitors login frequency, API usage, feature engagement
- Detects >30% drop vs. 7-day baseline
- Sends alert to account owner with suggested actions

## When

Hourly
