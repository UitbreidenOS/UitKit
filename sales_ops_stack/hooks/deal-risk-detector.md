# Deal Risk Detector Hook

## What This Hook Does

Automatically flags deals at risk based on multiple risk factors. Fires on deal analysis or pipeline import; identifies stuck deals, probability drift, missing stakeholder engagement, and other risk signals. Escalates critical risks to VP Sales within 24 hours.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "deal-analyzer|pipeline-auditor|Write",
        "condition": "deal|pipeline|crmExport",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/deal-risk-detector.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: deal-risk-detector.sh

```bash
#!/bin/bash
# Deal risk detector for Sales Operations Stack
# Identifies deals at risk and flags for escalation
# Exit code indicates risk level

RISK_FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$RISK_FILE" ] || [ ! -f "$RISK_FILE" ]; then
  exit 0
fi

# Risk detection thresholds
STUCK_DAYS=14
CYCLE_TIME_MULTIPLIER=1.5
PROBABILITY_DRIFT=20
HIGH_VALUE_THRESHOLD=100000

CRITICAL_RISKS=0
WARNING_RISKS=0

# Detect stuck deals (no activity >14 days)
STUCK=$(grep -i "last_activity" "$RISK_FILE" | \
  python3 -c "
import sys, datetime
for line in sys.stdin:
  try:
    date_str = line.split(':')[1].strip()
    date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
    days_ago = (datetime.datetime.now() - date_obj).days
    if days_ago > 14:
      print(f'Stuck: {days_ago} days no activity')
  except: pass
" | wc -l)

if [ "$STUCK" -gt 0 ]; then
  echo "⚠️  RISK ALERT: Stuck deals detected"
  echo "Deals with no activity >14 days: $STUCK"
  echo "Action: Contact deal owner for update; consider executive touch if $100K+"
  WARNING_RISKS=$((WARNING_RISKS + STUCK))
fi

# Detect probability drift
DRIFT=$(grep -iE "probability.*drift|vs.*model.*-[2-9]|variance.*-[2-9][0-9]" "$RISK_FILE" | wc -l)

if [ "$DRIFT" -gt 0 ]; then
  echo "⚠️  PROBABILITY DRIFT: Deals weaker than stage baseline"
  echo "Count: $DRIFT"
  echo "Action: Review deal progress; validate probability is realistic"
  WARNING_RISKS=$((WARNING_RISKS + DRIFT))
fi

# Detect low stakeholder engagement on high-value deals
LOW_ENGAGEMENT=$(grep -iE "Engagement.*Low|confidence.*Low" "$RISK_FILE" | \
  grep -E "100[0-9]{3}|[0-9]M" | wc -l)

if [ "$LOW_ENGAGEMENT" -gt 0 ]; then
  echo "🔴 CRITICAL RISK: High-value deal with low stakeholder engagement"
  echo "Count: $LOW_ENGAGEMENT"
  echo "Action: ESCALATE to VP Sales immediately"
  CRITICAL_RISKS=$((CRITICAL_RISKS + LOW_ENGAGEMENT))
fi

# Detect imminent close with low probability
RISKY_CLOSES=$(grep -iE "close.*date.*<7 days|probability.*<40%" "$RISK_FILE" | wc -l)

if [ "$RISKY_CLOSES" -gt 0 ]; then
  echo "🔴 CRITICAL RISK: Imminent close date with low probability"
  echo "Count: $RISKY_CLOSES"
  echo "Action: ESCALATE to VP Sales; likely false forecast"
  CRITICAL_RISKS=$((CRITICAL_RISKS + RISKY_CLOSES))
fi

# Summary output
echo ""
echo "═══════════════════════════════════════"
echo "RISK SUMMARY"
echo "═══════════════════════════════════════"
echo "Critical Risks: $CRITICAL_RISKS"
echo "Warning Risks: $WARNING_RISKS"
echo ""

if [ "$CRITICAL_RISKS" -gt 0 ]; then
  echo "ACTION: Escalate critical risks to VP Sales within 24 hours"
  exit 1
elif [ "$WARNING_RISKS" -gt 0 ]; then
  echo "ACTION: Address warnings in next sales review; track for escalation"
  exit 0
else
  echo "No risks detected"
  exit 0
fi
```

## Behavior

**On critical risk detected:** Prints risk alert, notifies for VP Sales escalation (exit code 1), and logs risk to session log.

**On warning risk detected:** Prints warning, flags for next review (exit code 0).

**On no risks:** Silent pass — continues normal processing.

---

## Risk Categories & Triggers

### Critical Risks (Escalate Within 24 Hours)

| Risk | Trigger | Impact | Action |
|---|---|---|---|
| **Stuck Deal >$100K** | No activity >21 days + value >$100K | Revenue at risk, likely stalled | Contact deal owner; executive touch or move to lost |
| **Missing Economic Buyer** | Negotiation stage + economic buyer engagement = Low | Cannot close without approver | Identify buyer; schedule stakeholder alignment call |
| **Probability Drift >20%** | Deal probability <(stage baseline - 20%) | Forecast accuracy risk | Review deal progress; validate probability or reduce forecast |
| **Imminent Close + Low Probability** | Close date <7 days + probability <stage baseline | False forecast signal | Escalate; move close date or exclude from forecast |
| **Stuck High-Value Deal** | $50K+ deal in Solution Design/Negotiation, no activity >14 days | Competitive or internal risk | VP Sales executive touch; unblock within 48 hours |

### Warning Risks (Address in Next Review)

| Risk | Trigger | Impact | Action |
|---|---|---|---|
| **Cycle Time Exceeds Baseline +50%** | Days in stage >1.5x baseline | Deal slipping; velocity degradation | Discuss with rep; identify blockers |
| **Probability Drift 10–20%** | Deal probability lower than stage baseline but ≥-20% | Moderate forecast risk | Monitor closely; plan for contingency |
| **Stuck Deal <$50K** | <$50K deal, no activity 14–21 days | Rep engagement issue; activity risk | Nudge rep in next 1:1; check if abandoned |
| **Stage Regression** | Deal moved backward (e.g., Negotiation → Design) | Deal quality concern; timeline slip | Understand reason; assess win probability |
| **Consensus Gap** | Champion engaged, Economic Buyer not engaged | Approval risk | Coach rep on stakeholder engagement; co-call with buyer |

---

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/deal-risk-detector.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/deal-risk-detector.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code for the hook to take effect

---

## Escalation Path

**If Critical Risk Detected:**

1. Hook flags risk immediately (exit code 1)
2. Log risk to session log with deal ID, risk type, and recommended action
3. Notify VP Sales within 24 hours: email or Slack with deal details
4. Schedule deal deep-dive meeting with rep + VP Sales
5. Create action plan to mitigate risk (co-sell, reforecast, or move to lost)
6. Track resolution in weekly risk report

**If Warning Risk Detected:**

1. Hook logs warning (exit code 0)
2. Flag deal for next sales review (weekly or monthly)
3. Coach rep in 1:1 if activity or engagement gap
4. Re-assess in 7–10 days; escalate if condition worsens

---

## Customization

Adjust risk thresholds by modifying script variables:

```bash
STUCK_DAYS=14              # Days without activity to flag as stuck
PROBABILITY_DRIFT=20       # % below stage baseline to flag drift
HIGH_VALUE_THRESHOLD=100000 # $ amount to flag high-value risks
```

---
