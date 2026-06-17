# on-analytics-sync Hook

Triggered on scheduled analytics sync to update performance dashboards.

## Event

`analytics.synced`

## settings.json Entry

```json
{
  "hooks": {
    "on-analytics-sync": {
      "trigger": "analytics.synced",
      "script": "hooks/on-analytics-sync.sh",
      "frequency": "daily",
      "time": "08:00"
    }
  }
}
```

## Behavior

- Pulls latest metrics from analytics sources
- Calculates KPI trends
- Updates reporting dashboards
- Alerts on significant changes

## Setup

Configure analytics sources, KPI definitions, and alert thresholds.
