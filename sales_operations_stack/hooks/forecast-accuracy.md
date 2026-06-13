# Forecast Accuracy Hook

## Purpose

Monitors weekly forecasts. Flags deals with aging >30 days in same stage or forecast variance >10% for escalation to sales leadership.

## Settings.json Entry

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
```

## Hook Script (forecast-accuracy.sh)

```bash
#!/bin/bash
# Reads forecast report output and validates forecast accuracy thresholds

FORECAST_FILE="${1:-.claude/forecast-latest.md}"

if [ ! -f "$FORECAST_FILE" ]; then
  echo "FORECAST-ACCURACY: No forecast file found. Skipping validation." >&2
  exit 0
fi

# Check variance threshold (>10% variance = alert)
VARIANCE=$(grep -i "variance" "$FORECAST_FILE" | grep "%" | head -1 | grep -o "[+-][0-9]*%" | head -1)
if [[ ! -z "$VARIANCE" ]]; then
  VARIANCE_NUM=$(echo "$VARIANCE" | sed 's/[%+-]//g')
  if [ "$VARIANCE_NUM" -gt 10 ]; then
    echo "FORECAST-ALERT: Variance ${VARIANCE} exceeds 10% threshold. Escalate to VP Sales." >&2
  fi
fi

# Check for aged deals (>30 days in stage)
AGED_DEALS=$(grep -i "aged\|stalled" "$FORECAST_FILE" | wc -l)
if [ "$AGED_DEALS" -gt 0 ]; then
  echo "FORECAST-ALERT: Found ${AGED_DEALS} aged or stalled deals. Requires re-engagement plan." >&2
fi

echo "FORECAST-ACCURACY: Validation complete. Status: $([ \"$VARIANCE_NUM\" -le 10 ] && echo 'PASS' || echo 'ALERT')" >&2
exit 0
```

## Behavior

- **Variance >10%:** Prints alert to escalate variance to VP Sales
- **Aged deals >30 days:** Prints alert with count of stalled deals
- **Pass:** Logs validation success; no action required

## Setup

1. Save script to `.claude/hooks/forecast-accuracy.sh` and `chmod +x`
2. Add settings.json entry
3. Script auto-runs on forecast report generation
