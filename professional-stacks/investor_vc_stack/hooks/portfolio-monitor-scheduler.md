# Portfolio Monitor Scheduler Hook

Auto-surfaces portfolio company signals and monitoring alerts.

## When It Fires

On session end (Stop event) or on-demand trigger.

## What It Does

1. Checks for unreviewed portfolio company signals from past 30 days
2. Flags companies with HIGH-impact signals (funding, exec departures, market disruption)
3. Surfaces risk alerts (declining metrics, exec departures, market headwinds)
4. Recommends follow-up conversations with portfolio companies
5. Auto-schedules next portfolio review (30 days out)

## Settings Entry

```json
{
  "hooks": {
    "portfolio-monitor-scheduler": {
      "event": "Stop",
      "script": ".claude/hooks/portfolio-monitor-scheduler.sh",
      "description": "Surface portfolio company signals and monitoring alerts"
    }
  }
}
```

## Script Template

```bash
#!/bin/bash

# portfolio-monitor-scheduler.sh — Auto-surface portfolio monitoring alerts

PORTFOLIO_FILE="investor_vc_stack/portfolio-companies.md"

echo "=== PORTFOLIO MONITORING ALERT ==="
echo ""
echo "Companies with signals in past 30 days:"

# Check for companies with recent updates
grep -B 2 "Positive\|Negative" "$PORTFOLIO_FILE" | grep -E "Company:|Signal:" | head -20

echo ""
echo "Next scheduled review: $(date -v+30d '+%Y-%m-%d')"
echo ""
echo "Run '/portfolio-check' to update monitoring signals"

exit 0
```

## Manual Trigger

```
/portfolio-check
```

## Monitored Signals

- **Funding:** New rounds, secondary sales, acquisitions
- **Team:** Key hires (CEO, CRO, CTO), board additions, departures
- **Product:** Major launches, API releases, new markets
- **Market:** Regulatory changes, competitor activity, sector trends
- **Metrics:** Revenue growth/decline, customer churn signals, burn rate changes
