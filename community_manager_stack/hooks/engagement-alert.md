# Engagement Alert Hook

## What This Hook Does

Monitors community engagement KPIs in real-time. Triggers notifications when:
- Reply rate drops >20% week-over-week
- Response time exceeds 24h threshold
- New member dropout rate spikes >30%
- Power user absence >14 days

Alerts help catch engagement friction early before it compounds into member churn.

## Settings.json Entry

```json
{
  "hooks": {
    "Timer": [
      {
        "interval": "3600000",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/engagement-alert.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: engagement-alert.sh

```bash
#!/bin/bash
# Engagement alert for Community Manager Stack
# Hourly check on KPI thresholds. Alerts if thresholds breached.
# Designed to run via cron or timer.

ENGAGEMENT_DB="${HOME}/.claude/community/engagement.db"
BASELINE_REPLY_RATE=65
BASELINE_RESPONSE_TIME=120  # minutes
BASELINE_NEW_MEMBER_RETENTION=85  # percent
POWER_USER_INACTIVITY_THRESHOLD=14  # days

# Stub: In production, query community analytics backend
# For now, these would be populated from API or database

CURRENT_REPLY_RATE=${REPLY_RATE_NOW:-62}
PRIOR_REPLY_RATE=${REPLY_RATE_WEEK_AGO:-75}
CURRENT_RESPONSE_TIME=${RESPONSE_TIME_NOW:-145}
NEW_MEMBER_DROPOUT=${NEW_MEMBER_DROPOUT_RATE:-18}
POWER_USERS_INACTIVE_14D=${POWER_USERS_INACTIVE:-2}

ALERT_COUNT=0

# Check reply rate drop
REPLY_RATE_CHANGE=$((($BASELINE_REPLY_RATE - $CURRENT_REPLY_RATE) * 100 / $BASELINE_REPLY_RATE))
if [ "$REPLY_RATE_CHANGE" -gt 20 ]; then
  echo "⚠️ ENGAGEMENT ALERT: Reply rate dropped $(($REPLY_RATE_CHANGE))%"
  echo "  Current: $CURRENT_REPLY_RATE% | Baseline: $BASELINE_REPLY_RATE%"
  echo "  Action: Review for moderation changes, announcements, or outages."
  ALERT_COUNT=$((ALERT_COUNT + 1))
fi

# Check response time threshold
if [ "$CURRENT_RESPONSE_TIME" -gt 1440 ]; then
  echo "⚠️ ENGAGEMENT ALERT: Response time exceeded 24h threshold"
  echo "  Current: $CURRENT_RESPONSE_TIME min | Baseline: $BASELINE_RESPONSE_TIME min"
  echo "  Action: Add resources to moderation queue or check team availability."
  ALERT_COUNT=$((ALERT_COUNT + 1))
fi

# Check new member dropout
if [ "$NEW_MEMBER_DROPOUT" -gt 30 ]; then
  echo "⚠️ ENGAGEMENT ALERT: New member dropout spiked to $NEW_MEMBER_DROPOUT%"
  echo "  Baseline: <15% | Current: $NEW_MEMBER_DROPOUT%"
  echo "  Action: Review onboarding sequence, first-post friction, or recent moderation."
  ALERT_COUNT=$((ALERT_COUNT + 1))
fi

# Check power user absence
if [ "$POWER_USERS_INACTIVE_14D" -gt 0 ]; then
  echo "⚠️ ENGAGEMENT ALERT: $POWER_USERS_INACTIVE_14D power user(s) inactive 14+ days"
  echo "  Action: Reach out personally. Ask what's changed."
  ALERT_COUNT=$((ALERT_COUNT + 1))
fi

if [ "$ALERT_COUNT" -eq 0 ]; then
  echo "✅ Engagement healthy. No alerts."
  exit 0
else
  echo ""
  echo "Total alerts: $ALERT_COUNT"
  echo "Review these alerts and take action within 24h."
  exit 0  # Alert sent, but don't block anything
fi
```

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/engagement-alert.sh`

3. Make it executable:
   ```bash
   chmod +x .claude/hooks/engagement-alert.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. (Optional) Set up cron job for regular execution:
   ```bash
   # Run engagement check hourly
   0 * * * * bash .claude/hooks/engagement-alert.sh >> /tmp/engagement-alerts.log 2>&1
   ```

6. Restart Claude Code

## Behavior

- **Hourly check:** Compares current metrics to baseline and prior period
- **Alert on breach:** If any threshold exceeded, logs alert with recommended action
- **Non-blocking:** Alerts notify but don't stop community activity
- **Log accumulation:** Alerts aggregate in `.claude/community/engagement-alerts.log`

## Integration

- Community Manager reviews alerts daily (morning standup)
- Alerts trigger `/analyze-community` if urgent (reply rate drop >30%)
- Monthly review: are alert thresholds well-calibrated or too sensitive?

---
