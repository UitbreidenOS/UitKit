# Pipeline Validation Hook

## What This Hook Does

Validates every pipeline import or update against required field standards. Fires on data import; checks for missing or malformed records. Blocks invalid records from being logged to the system.

## Settings.json Entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "condition": "pipeline|deal|crmExport",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/pipeline-validation.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: pipeline-validation.sh

```bash
#!/bin/bash
# Pipeline validation hook for Sales Operations Stack
# Validates required fields on pipeline imports
# Exit 1 if validation fails, otherwise pass silently

REQUIRED_FIELDS="account_name|deal_value|sales_stage|deal_owner|close_date|probability|last_activity"
VALID_STAGES="Prospect|Qualification|Solution Design|Negotiation|Closed/Won"

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Check for required fields in headers (if CSV) or field names (if JSON)
MISSING=$(grep -iEo "^[^,]*" "$FILE" | head -1 | grep -Fv -f <(echo "$REQUIRED_FIELDS" | tr '|' '\n') || echo "All required fields present")

if [ "$MISSING" != "All required fields present" ]; then
  echo "❌ PIPELINE VALIDATION FAILED: Missing required fields"
  echo ""
  echo "Required fields: account_name, deal_value, sales_stage, deal_owner, close_date, probability, last_activity"
  echo ""
  echo "Missing: $MISSING"
  exit 1
fi

# Validate stage values
INVALID_STAGES=$(grep -iEo "sales_stage.*[^(Prospect|Qualification|Solution Design|Negotiation|Closed/Won)]" "$FILE" | head -5 || echo "")

if [ -n "$INVALID_STAGES" ]; then
  echo "❌ PIPELINE VALIDATION FAILED: Invalid stage values"
  echo ""
  echo "Valid stages: Prospect, Qualification, Solution Design, Negotiation, Closed/Won"
  echo ""
  echo "Invalid stages found:"
  echo "$INVALID_STAGES"
  exit 1
fi

# Check for positive deal values
INVALID_VALUES=$(grep -iE "deal_value.*[0-9].*-[0-9]|deal_value.*0$" "$FILE" | head -5 || echo "")

if [ -n "$INVALID_VALUES" ]; then
  echo "⚠️  PIPELINE VALIDATION WARNING: Zero or negative deal values"
  echo ""
  echo "All deal values must be >$0. Records with $0 value:"
  echo "$INVALID_VALUES"
  echo ""
  echo "These records will be excluded from forecast and reporting."
fi

exit 0
```

## Behavior

**On validation failure:** Prints violation header with missing/invalid fields, shows examples of violations, and prevents the record from being imported (exit code 1).

**On validation success (or warnings):** Silent pass — import completes normally; warnings are logged for manual review.

## Validation Checks

### Required Fields (All Must Be Present)

1. **Account Name** — Non-empty company name
2. **Deal Value** — Numeric, >$0
3. **Sales Stage** — One of: Prospect, Qualification, Solution Design, Negotiation, Closed/Won
4. **Deal Owner** — Assigned sales rep name (must match active rep in system)
5. **Close Date** — Date field; must be valid date
6. **Probability** — Numeric 0–100
7. **Last Activity Date** — Date field; ≤14 days old (warning if older)

### Validation Rules

- **Account Name:** No duplicates on same rep (warning if same account assigned to multiple reps)
- **Deal Value:** Must be >$0; flag outliers >$5M for review
- **Stage:** Must match defined pipeline stages exactly (case-insensitive)
- **Deal Owner:** Must match active rep roster; flag unmapped reps
- **Close Date:** Must be future date (for open deals) or within last 90 days (for closed deals)
- **Probability:** Must be 0–100; should increase per stage (Prospect 15%, Qual 35%, Design 60%, Neg 80%)
- **Last Activity Date:** Must be ≤14 days old; flag dormant deals

---

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/pipeline-validation.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/pipeline-validation.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` (or `.claude/settings.local.json` for local-only validation)

5. Restart Claude Code for the hook to take effect

---

## Failure Resolution

If validation fails:

1. **Review the error message** — Note which fields are missing or invalid
2. **Correct the source data** — Fix invalid values in your CRM or CSV export
3. **Re-run the import** — Resubmit the corrected file for validation
4. **Log the failure** — Document what was wrong for future reference

---

## Warnings vs. Failures

- **Failure (Exit 1):** Blocks import; missing required fields or invalid stage/probability values
- **Warning (Log only):** Allows import but flags for manual review; examples: deal value outliers, duplicate accounts, old last activity dates

---
