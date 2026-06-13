# Forecast Accuracy Tracker Hook

## What This Hook Does

Logs every forecast run and compares to actuals and prior forecasts. Fires after forecast generation; tracks variance trend and alerts if >±10% for second consecutive month. Maintains forecast audit trail for continuous improvement.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "forecast-builder|Write",
        "condition": "forecast|revenue",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/forecast-accuracy-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: forecast-accuracy-tracker.sh

```bash
#!/bin/bash
# Forecast accuracy tracker for Sales Operations Stack
# Logs forecasts and detects variance trends
# Alerts if variance exceeds ±10% for two consecutive months

FORECAST_FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FORECAST_FILE" ] || [ ! -f "$FORECAST_FILE" ]; then
  exit 0
fi

# Extract forecast details from file
FORECAST_DATE=$(grep -m1 "Forecast Generated" "$FORECAST_FILE" | sed 's/.*: //' | tr -d ' ')
FORECAST_AMOUNT=$(grep "13-Week Forecast" "$FORECAST_FILE" | grep -oE '\$[0-9]+M' | head -1)
VARIANCE=$(grep "Variance:" "$FORECAST_FILE" | grep -oE '[+-][0-9]+%' | head -1)
CONFIDENCE=$(grep "Confidence:" "$FORECAST_FILE" | grep -oE "High|Medium|Low" | head -1)

# Parse actual revenue from notes (if available)
ACTUAL=$(grep "Actual Revenue" "$FORECAST_FILE" | grep -oE '\$[0-9]+M' || echo "TBD")

# Log forecast to audit trail
AUDIT_LOG=".claude/forecast-audit.log"

if [ ! -f "$AUDIT_LOG" ]; then
  echo "Date,Forecast,Actual,Variance,Confidence,Notes" > "$AUDIT_LOG"
fi

echo "$FORECAST_DATE,$FORECAST_AMOUNT,$ACTUAL,$VARIANCE,$CONFIDENCE,logged" >> "$AUDIT_LOG"

# Check for consecutive variance >±10%
RECENT_VARIANCES=$(tail -3 "$AUDIT_LOG" | grep -oE '[+-][0-9]+%' | sed 's/%//')

CONSECUTIVE_HIGH=$(echo "$RECENT_VARIANCES" | python3 -c "
import sys
variances = [int(line) for line in sys.stdin.read().strip().split('\n')]
if len(variances) >= 2:
  for i in range(len(variances)-1):
    if abs(variances[i]) > 10 and abs(variances[i+1]) > 10:
      print('YES')
      exit()
print('NO')
")

# Alert if consecutive high variance
if [ "$CONSECUTIVE_HIGH" = "YES" ]; then
  echo "🔴 FORECAST ACCURACY ALERT: Variance >±10% for 2 consecutive months"
  echo ""
  echo "Recent forecasts:"
  tail -3 "$AUDIT_LOG"
  echo ""
  echo "ACTION: Review and adjust forecast methodology"
  echo "  - Check for systematic bias (consistently over/under forecasting)"
  echo "  - Validate conversion rate assumptions"
  echo "  - Assess pipeline data quality"
  echo "  - Update stage probability weights if needed"
fi

# Summary output
echo ""
echo "═══════════════════════════════════════"
echo "FORECAST LOGGED"
echo "═══════════════════════════════════════"
echo "Forecast: $FORECAST_AMOUNT"
echo "Variance: $VARIANCE"
echo "Confidence: $CONFIDENCE"
echo ""
echo "Audit trail: $AUDIT_LOG"

exit 0
```

## Behavior

**On each forecast run:** Logs forecast amount, variance, and confidence to audit trail.

**On consecutive variance >±10%:** Alerts VP Sales to review and adjust methodology.

**On variance within tolerance:** Silent — continues normal forecasting.

---

## Forecast Logging

### Audit Trail Format

```
Date,Forecast,Actual,Variance,Confidence,Notes
2026-06-01,$2.5M,$2.3M,-8%,High,Standard forecast
2026-07-01,$2.8M,$3.1M,+11%,Medium,New deals accelerated
2026-08-01,$2.6M,$2.4M,-8%,Medium,Lost deal impact
```

### Data Captured Per Forecast

- **Date:** When forecast was generated
- **Forecast Amount:** 13-week forecast total
- **Actual Revenue:** Previous period actual (filled retroactively)
- **Variance:** (Actual / Forecast) - 1, expressed as %
- **Confidence Level:** High / Medium / Low
- **Notes:** Any special circumstances (e.g., "New hire ramp", "Lost enterprise deal")

---

## Variance Analysis Triggers

### Trigger: Variance >±10%

**Investigation Required:**

1. **Check for systematic bias:**
   - Consistently over-forecasting (variance <-10% multiple times) = Convert rates too optimistic, need downward adjustment
   - Consistently under-forecasting (variance >+10% multiple times) = Convert rates too conservative, opportunity to capture upside
   
2. **Identify root cause:**
   - Lost deals (which accounts? which reps?)
   - Acceleration (early closes in which segment?)
   - New pipeline (unexpected additions or slower prospecting?)
   - Rep activity changes (hiring, turnover, ramp impacts)
   - Deal quality (probability assessment off?)

3. **Adjust forecast model:**
   - Update conversion rate assumptions
   - Revise stage probability weights
   - Add risk weighting factors (e.g., -20% for new rep deals)
   - Document assumptions for next forecast

---

## Consecutive Variance Alert

**Condition:** Variance >±10% in two consecutive months (i.e., Month 1: -12%, Month 2: +15%)

**Alert Level:** 🔴 Critical — Escalate to VP Sales

**Response Required:**

1. Schedule forecast methodology review (VP Sales + Sales Ops)
2. Analyze root causes for each month
3. Validate pipeline data quality
4. Identify systematic bias (if any)
5. Revise forecast assumptions for next month
6. Document changes in forecast methodology log

**Example:**
```
Month 1 Forecast: $2.5M → Actual: $2.3M (Variance: -8%)
  Reason: Lost 2 Enterprise deals; rep turnover impact
  
Month 2 Forecast: $2.8M → Actual: $3.1M (Variance: +11%)
  Reason: Unexpected acceleration in Mid-Market; new CRO hire pipeline
  
Action: Update conversion rates for Enterprise (-5%); add CRO hire ramp factor
```

---

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/forecast-accuracy-tracker.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/forecast-accuracy-tracker.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code for the hook to take effect

---

## Continuous Improvement

**Use forecast audit trail to:**

1. Identify seasonal patterns (e.g., Q4 typically +15%, summer -10%)
2. Measure forecast model improvement over time
3. Validate rep productivity assumptions
4. Track impact of process changes (new CRM, new sales process)
5. Benchmark against industry standards (target <±5% variance)

---

## Forecast Methodology Evolution

As data accumulates, refine the forecast model:

| Month | Avg Variance | Action |
|---|---|---|
| Months 1–3 | ±15% | Gather baseline; identify systematic bias |
| Months 4–6 | ±10% | Refine conversion rates; add segment weights |
| Months 7–12 | ±5% | Mature model; adjust only for major changes |

---
