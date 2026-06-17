# /slo-status

## Purpose
Check SLO and SLI status across critical services.

## Usage
```
/slo-status
/slo-status [service-name]
```

## What it does
- Fetches error budget for each service
- Calculates burn rate over last 24h and 30d
- Projects budget depletion date
- Shows contributors to SLI breaches
- Alerts if trajectory is unsustainable

## Example
```
/slo-status
```

Returns SLO table with services, current uptime %, error budget remaining, and burn rate.
