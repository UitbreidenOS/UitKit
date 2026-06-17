# Bias Monitor Hook

## Purpose

Continuously monitors AI systems in production for demographic disparities and fairness drift. Automatically tracks fairness metrics daily, triggers alerts when thresholds exceeded, and escalates to governance teams for investigation.

## settings.json Configuration

```json
{
  "hooks": {
    "postMetricsCollection": {
      "bias-monitor": {
        "shell": "bash",
        "script": "ai_ethics_governance_stack/hooks/bias-monitor.sh",
        "schedule": "0 2 * * *",
        "filter": {
          "system_type": ["decision_system", "recommendation_engine"],
          "environment": ["production"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires daily (at 2 AM UTC by default) after model predictions are generated. It:

1. **Collects Fairness Metrics**
   - Demographic parity (selection rate by group)
   - Equalized odds (TPR/FPR by group)
   - Calibration (precision by group)
   - Disparate impact ratio

2. **Compares to Baseline**
   - Fairness baseline (from risk assessment)
   - Daily disparity vs. acceptable threshold
   - Trending analysis (is disparity getting worse?)

3. **Triggers Alerts**
   - Alert Level 1: Disparity >3% from baseline → notify data science team
   - Alert Level 2: Disparity >5% from baseline → notify director + governance lead
   - Alert Level 3: Disparity >10% from baseline → escalate to ethics board chair

4. **Logs Results**
   - Daily fairness metrics logged to monitoring dashboard
   - Alert incidents recorded with timestamp and severity
   - Investigation and remediation actions tracked

5. **Escalation Workflow**
   - On alert: Auto-notify designated team within 15 minutes
   - Investigation required: Complete within 24 hours
   - Remediation action: Document plan within 2 days
   - Resolution: Close incident when metrics return to acceptable range

## Implementation

Hook script: `ai_ethics_governance_stack/hooks/bias-monitor.sh`

```bash
#!/bin/bash

# Bias Monitor Hook
# Tracks fairness metrics and alerts on demographic disparities

set -e

SYSTEM_NAME="$1"
METRICS_DIR="monitoring/fairness-metrics"
CONFIG_DIR="ai_ethics_governance_stack/governance/monitoring"
ALERT_LOG="ai_ethics_governance_stack/governance/alert-log.md"

echo "[BIAS-MONITOR] Monitoring fairness for: $SYSTEM_NAME"

# Load system-specific configuration
CONFIG_FILE="$CONFIG_DIR/$SYSTEM_NAME.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "[BIAS-MONITOR] WARNING: Config not found for $SYSTEM_NAME; skipping"
  exit 0
fi

# Extract monitoring parameters
PROTECTED_ATTRIBUTES=$(jq -r '.protectedAttributes[]' "$CONFIG_FILE")
FAIRNESS_THRESHOLD=$(jq -r '.fairnessThreshold' "$CONFIG_FILE")
ALERT_CONTACTS=$(jq -r '.alertContacts.level1' "$CONFIG_FILE")

echo "[BIAS-MONITOR] Monitoring attributes: $PROTECTED_ATTRIBUTES"
echo "[BIAS-MONITOR] Threshold: $FAIRNESS_THRESHOLD"

# Collect today's fairness metrics
METRICS_FILE="$METRICS_DIR/${SYSTEM_NAME}-$(date +%Y-%m-%d).json"

if [ ! -f "$METRICS_FILE" ]; then
  echo "[BIAS-MONITOR] ERROR: Metrics file not found: $METRICS_FILE"
  exit 1
fi

# Extract fairness metrics by group
DEMOGRAPHIC_PARITY=$(jq -r '.demographicParity' "$METRICS_FILE")
EQUALIZED_ODDS_TPR=$(jq -r '.equalizedOdds.tpr' "$METRICS_FILE")
EQUALIZED_ODDS_FPR=$(jq -r '.equalizedOdds.fpr' "$METRICS_FILE")

echo "[BIAS-MONITOR] Demographic Parity disparity: $DEMOGRAPHIC_PARITY"
echo "[BIAS-MONITOR] Equalized Odds TPR disparity: $EQUALIZED_ODDS_TPR"
echo "[BIAS-MONITOR] Equalized Odds FPR disparity: $EQUALIZED_ODDS_FPR"

# Check against thresholds and trigger alerts
ALERT_LEVEL=0
ALERT_MESSAGE=""

if (( $(echo "$DEMOGRAPHIC_PARITY > 0.10" | bc -l) )); then
  ALERT_LEVEL=3
  ALERT_MESSAGE="CRITICAL: Demographic parity disparity $DEMOGRAPHIC_PARITY exceeds 10%"
elif (( $(echo "$DEMOGRAPHIC_PARITY > 0.05" | bc -l) )); then
  ALERT_LEVEL=2
  ALERT_MESSAGE="HIGH: Demographic parity disparity $DEMOGRAPHIC_PARITY exceeds 5%"
elif (( $(echo "$DEMOGRAPHIC_PARITY > 0.03" | bc -l) )); then
  ALERT_LEVEL=1
  ALERT_MESSAGE="MEDIUM: Demographic parity disparity $DEMOGRAPHIC_PARITY exceeds 3%"
fi

# Log alert if triggered
if [ "$ALERT_LEVEL" -gt 0 ]; then
  ALERT_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  
  # Append to alert log
  echo "" >> "$ALERT_LOG"
  echo "## Alert: $SYSTEM_NAME ($ALERT_TIMESTAMP)" >> "$ALERT_LOG"
  echo "**Severity:** Level $ALERT_LEVEL" >> "$ALERT_LOG"
  echo "**Message:** $ALERT_MESSAGE" >> "$ALERT_LOG"
  echo "**Metrics:**" >> "$ALERT_LOG"
  echo "- Demographic Parity: $DEMOGRAPHIC_PARITY" >> "$ALERT_LOG"
  echo "- Equalized Odds TPR: $EQUALIZED_ODDS_TPR" >> "$ALERT_LOG"
  echo "- Equalized Odds FPR: $EQUALIZED_ODDS_FPR" >> "$ALERT_LOG"
  echo "**Status:** Awaiting investigation" >> "$ALERT_LOG"
  echo "**Investigation Deadline:** $(date -d '+24 hours' -u +%Y-%m-%d)" >> "$ALERT_LOG"
  
  # Send notifications based on alert level
  case "$ALERT_LEVEL" in
    1)
      # Notify data science team
      CONTACT="$(jq -r '.alertContacts.level1' "$CONFIG_FILE")"
      echo "[BIAS-MONITOR] Notifying Level 1 contact: $CONTACT"
      # In production: send email/Slack to contact
      ;;
    2)
      # Notify director + governance lead
      CONTACTS="$(jq -r '.alertContacts.level2[]' "$CONFIG_FILE" | paste -sd ',' -)"
      echo "[BIAS-MONITOR] Notifying Level 2 contacts: $CONTACTS"
      # In production: escalate to director + governance lead
      ;;
    3)
      # Escalate to ethics board chair
      CONTACT="$(jq -r '.alertContacts.level3' "$CONFIG_FILE")"
      echo "[BIAS-MONITOR] ESCALATING to Level 3 contact (Ethics Board): $CONTACT"
      # In production: immediate escalation to ethics board chair + CEO
      ;;
  esac
  
  echo "[BIAS-MONITOR] Alert logged and notifications sent"
else
  echo "[BIAS-MONITOR] OK: Fairness metrics within acceptable range"
fi

# Log monitoring run
echo "[BIAS-MONITOR] Daily monitoring complete for $SYSTEM_NAME at $(date -u +%Y-%m-%d)"

exit 0
```

## Monitoring Metrics

For each decision system, the hook monitors:

| Metric | Acceptable | Alert L1 | Alert L2 | Alert L3 |
|---|---|---|---|---|
| Demographic Parity Disparity | <3% | 3-5% | 5-10% | >10% |
| Equalized Odds TPR Disparity | <3% | 3-5% | 5-10% | >10% |
| Equalized Odds FPR Disparity | <3% | 3-5% | 5-10% | >10% |
| Adverse Impact Ratio | ≥0.80 | 0.75-0.80 | 0.70-0.75 | <0.70 |
| Recommendation Coverage Gap | <3% | 3-5% | 5-10% | >10% |

## Monitoring Configuration

Each monitored system requires a configuration file:

```json
{
  "systemName": "credit-approval-ai",
  "riskLevel": "YELLOW",
  "protectedAttributes": ["race", "gender", "age"],
  "fairnessThreshold": 0.03,
  "fairnessMetrics": [
    "demographicParity",
    "equalizedOdds",
    "calibration",
    "adverseImpactRatio"
  ],
  "baseline": {
    "demographicParity": 0.015,
    "equalizedOdds": {
      "tpr": 0.020,
      "fpr": 0.018
    }
  },
  "alertRules": {
    "level1": {
      "threshold": 0.03,
      "action": "notify_data_science"
    },
    "level2": {
      "threshold": 0.05,
      "action": "notify_director"
    },
    "level3": {
      "threshold": 0.10,
      "action": "escalate_ethics_board"
    }
  },
  "alertContacts": {
    "level1": "data-science-lead@company.com",
    "level2": ["director@company.com", "governance-lead@company.com"],
    "level3": "ethics-board-chair@company.com"
  },
  "monitoringFrequency": "daily",
  "reportingFrequency": "weekly"
}
```

## Alert Workflow

### Level 1 Alert (Disparity 3-5%)
- Notification sent to data science lead
- Investigation deadline: 24 hours
- Expected action: Review model behavior; check if threshold was temporary
- Resolution: Close alert if metrics return to normal, or escalate if pattern continues

### Level 2 Alert (Disparity 5-10%)
- Notification sent to director + governance lead
- Investigation deadline: 24 hours
- Expected action: Root cause analysis; develop remediation plan
- Resolution: Implement fix (threshold adjustment, retraining, human review layer)
- Timeline: Remediation complete within 5 days

### Level 3 Alert (Disparity >10%)
- Immediate escalation to ethics board chair + CEO
- Investigation deadline: 4 hours
- Expected action: Emergency governance review; consider system moratorium
- Resolution: System may be paused pending remediation
- Timeline: Decision made within 24 hours

## Investigation & Remediation

Upon alert, investigation should answer:

1. **Is the disparity real or measurement error?**
   - Verify data quality and metric calculation
   - Confirm disparities are reproducible

2. **Is this disparity new (drift) or known baseline?**
   - Compare to historical metrics
   - Check if disparity has been growing gradually

3. **What changed?**
   - Data distribution change? (new user cohort, demographic shift)
   - Model behavior change? (model drift, feature importance shift)
   - Decision threshold change? (someone changed business logic)
   - System deployment change? (different version, configuration)

4. **What's the root cause?**
   - Training data bias? (historical data reflects old discrimination)
   - Feature bias? (features correlate with protected attribute)
   - Threshold bias? (different threshold for different groups)
   - Feedback loop? (previous decisions trained next model)

5. **What's the remediation?**
   - Threshold adjustment (quick fix; address symptoms)
   - Retraining (medium effort; address model)
   - Feature adjustment (harder; may hurt accuracy)
   - Human review layer (quick; adds cost)
   - De-provision system (last resort)

## Escalation Contacts

Organizations should define escalation contacts for each system:

```
System: Credit Approval AI

Level 1 (Data Science Team):
- Primary: ml-lead@company.com
- Backup: senior-ds@company.com
- Escalation Timeline: 15 minutes

Level 2 (Director + Governance):
- Director: lending-director@company.com
- Governance Lead: governance-lead@company.com
- Escalation Timeline: 1 hour

Level 3 (Ethics Board):
- Chair: ethics-board-chair@company.com
- CEO: ceo@company.com
- Escalation Timeline: 2 hours
```

## Post-Deployment Success Metrics

Track monitoring effectiveness:

- **Alert Accuracy:** % of alerts that lead to real fairness issues (target: >80%)
- **Investigation Timeliness:** % of investigations completed within deadline (target: 100%)
- **Remediation Rate:** % of fairness issues remediated vs. ignored (target: 90%+)
- **Time to Resolution:** Average days from alert to remediation (target: <3 days)
- **False Positive Rate:** Alerts that fire but metrics return to normal (target: <20%)

## Status

**Implementation:** Hook structure defined; shell script template provided  
**Testing:** Recommended to test on non-production systems first  
**Production Ready:** Yes; requires customization of monitoring config per system and alert contact setup
