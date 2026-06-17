# Hook: daily-health-check

## Trigger

Fires daily at 06:00 UTC to validate cluster and service health.

## Config Entry

```json
{
  "hooks": {
    "daily-health-check": {
      "script": "hooks/daily-health-check.sh",
      "schedule": "0 6 * * *"
    }
  }
}
```

## Checks

- Pod restart counts
- Node capacity and disk usage
- Certificate expiration
- Failed deployments

## Output

Health report emailed to ops; alerts fired if thresholds exceeded.
