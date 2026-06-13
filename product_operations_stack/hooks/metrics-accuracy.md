# Metrics Accuracy Hook

## What This Hook Does

Validates metrics analysis documents for data freshness, baseline comparisons, and risk level assessments. Flags if metrics are stale (>7 days old), if risk assessments lack supporting data, or if trend claims lack context. Ensures metrics outputs are grounded in real data, not speculation.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/metrics-accuracy.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: metrics-accuracy.sh

```bash
#!/bin/bash
# Metrics accuracy validator — checks health dashboard for data freshness and rigor
# Flags: Stale data, unsubstantiated risk claims, missing baselines
# Exit 1 if quality issues found

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Skip if not a metrics document
if ! grep -q "metric\|retention\|churn\|adoption" "$FILE" -i; then
  exit 0
fi

# Check for data freshness date
FRESHNESS=$(grep -i "freshness\|last updated\|as of" "$FILE" | head -1)

if [ -z "$FRESHNESS" ]; then
  echo "⚠️ METRICS ACCURACY: Missing data freshness date"
  echo ""
  echo "Issue: Metrics document doesn't specify when data was last updated."
  echo "Fix: Add 'Data Freshness: [date]' or 'Last Updated: [date]' at the top."
  exit 1
fi

# Check for baseline comparisons
BASELINE=$(grep -i "baseline\|comparison\|vs\." "$FILE" | wc -l)

if [ "$BASELINE" -lt 2 ]; then
  echo "⚠️ METRICS ACCURACY: Missing baseline / comparison context"
  echo ""
  echo "Issue: Metrics document lacks baseline comparisons (month-over-month, year-over-year)."
  echo "Fix: Add baseline metrics so readers can see if trends are improving or declining."
  exit 1
fi

# Check for risk level justification
RISK=$(grep -c "CRITICAL\|CAUTION" "$FILE")
if [ "$RISK" -gt 0 ]; then
  JUSTIFICATION=$(grep -c "because\|due to\|cause\|reason" "$FILE")
  if [ "$JUSTIFICATION" -lt 2 ]; then
    echo "⚠️ METRICS ACCURACY: Risk assessments lack supporting explanation"
    echo ""
    echo "Issue: You flagged metrics as CRITICAL or CAUTION but didn't explain why."
    echo "Fix: For each risk flag, add context explaining the root cause."
    exit 1
  fi
fi

exit 0
```

## Behavior

**On validation warning:** Prints issue and fix recommendation; prevents write from completing (exit code 1).

**On pass:** Silent — no output, Write/Edit completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/metrics-accuracy.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/metrics-accuracy.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

---
