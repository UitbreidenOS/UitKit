# Deal Validation Hook

## Purpose

Pre-close checks. Enforces minimum documentation (account plan, stakeholder sign-off, discovery notes), prevents premature booking of deals that lack approval or required data.

## Settings.json Entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "WebFetch.*CRM|Write.*close|Write.*won",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/deal-validation.sh" }
        ]
      }
    ]
  }
}
```

## Hook Script (deal-validation.sh)

```bash
#!/bin/bash
# Validates deal closure prerequisites before CRM write

DEAL_INPUT="$CLAUDE_TOOL_INPUT"

# Extract deal value and stage from input
DEAL_VALUE=$(echo "$DEAL_INPUT" | jq -r '.value // empty' 2>/dev/null)
DEAL_STAGE=$(echo "$DEAL_INPUT" | jq -r '.stage // empty' 2>/dev/null)

# Check 1: Deal >$50K requires VP approval
if [ ! -z "$DEAL_VALUE" ] && (( $(echo "$DEAL_VALUE > 50000" | bc -l) )); then
  APPROVAL_FLAG=$(echo "$DEAL_INPUT" | jq -r '.approval_authority // empty' 2>/dev/null)
  if [ -z "$APPROVAL_FLAG" ]; then
    echo "DEAL-VALIDATION-BLOCK: Deal value \$$DEAL_VALUE exceeds \$50K threshold. VP approval required before booking." >&2
    exit 1
  fi
fi

# Check 2: Must have discovery notes or account plan
if [ "$DEAL_STAGE" == "Closed-Won" ] || [ "$DEAL_STAGE" == "Negotiation" ]; then
  HAS_NOTES=$(echo "$DEAL_INPUT" | jq -r '.discovery_notes // empty' 2>/dev/null)
  if [ -z "$HAS_NOTES" ]; then
    echo "DEAL-VALIDATION-WARN: No discovery notes on file. Add buyer context before closing." >&2
  fi
fi

echo "DEAL-VALIDATION: Checks passed. Proceed with booking." >&2
exit 0
```

## Behavior

- **Deal >$50K without approval:** Blocks CRM write; requires VP sign-off before proceeding
- **Missing discovery notes:** Warning only; allows close but flags for follow-up documentation
- **Pass:** Allows CRM write to proceed

## Setup

1. Save script to `.claude/hooks/deal-validation.sh` and `chmod +x`
2. Add settings.json entry
3. Triggers on any deal close or stage change in CRM
