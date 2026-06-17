# Metric Collector Hook

## Purpose
Periodically collect key metrics and alert if thresholds breached.

## settings.json Entry
```json
{
  "hooks": {
    "metric-collector": {
      "enabled": true,
      "schedule": "*/5 * * * *",
      "metrics": ["cpu", "memory", "disk", "latency", "error_rate"]
    }
  }
}
```

## What it does
- Queries Prometheus/Datadog every 5 minutes
- Checks against defined thresholds
- Escalates alerts if critical
- Logs metrics to session-log.md for trending

## Script Location
Place `metric-collector.sh` in `.claude/hooks/`

```bash
#!/bin/bash
# metric-collector.sh
# Runs on cron schedule (default 5m)
# Collects and compares metrics
```
