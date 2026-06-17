# Quota Pacing Hook

## Purpose

Real-time quota tracking. Alerts when an individual or team falls >15% behind daily/weekly pace required to hit quota by month-end.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*quota",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/quota-pacing.sh" }
        ]
      }
    ]
  }
}
```

## Hook Script (quota-pacing.sh)

```bash
#!/bin/bash
# Monitors quota attainment pacing; alerts if team is trending miss

QUOTA_FILE="${1:-.claude/quota-latest.md}"
CALENDAR_DAY=$(date +%d)
CALENDAR_DAYS_IN_MONTH=30  # Adjust per month as needed

if [ ! -f "$QUOTA_FILE" ]; then
  echo "QUOTA-PACING: No quota file found. Skipping validation." >&2
  exit 0
fi

# Calculate expected attainment at this point in month
EXPECTED_PCT=$((CALENDAR_DAY * 100 / CALENDAR_DAYS_IN_MONTH))

# Extract team attainment from report
TEAM_ATTAINMENT=$(grep -i "attainment\|%" "$QUOTA_FILE" | grep "Team" | grep -o "[0-9]*%" | head -1 | sed 's/%//')

if [ ! -z "$TEAM_ATTAINMENT" ]; then
  VARIANCE=$((TEAM_ATTAINMENT - EXPECTED_PCT))
  if [ "$VARIANCE" -lt -15 ]; then
    echo "QUOTA-PACING-ALERT: Team is ${VARIANCE}% below pace. Required to hit quota by month-end: {action plan}" >&2
  fi
fi

echo "QUOTA-PACING: Validation complete at day ${CALENDAR_DAY}/30." >&2
exit 0
```

## Behavior

- **Variance <-15%:** Prints alert; surfaces required daily close rate to recover
- **Variance >-15%:** Prints status; no action required
- **Run frequency:** Daily (integrated into daily standup or leadership dashboard)

## Setup

1. Save script to `.claude/hooks/quota-pacing.sh` and `chmod +x`
2. Add settings.json entry
3. Schedule to run daily (cron or bot)
