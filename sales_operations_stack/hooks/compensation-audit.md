# Compensation Audit Hook

## Purpose

Logs all commission changes with timestamp, author, justification, and old/new values. Maintains full audit trail for dispute resolution and compliance.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*commission|Write.*compensation|Write.*accrual",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/compensation-audit.sh" }
        ]
      }
    ]
  }
}
```

## Hook Script (compensation-audit.sh)

```bash
#!/bin/bash
# Logs all compensation changes to audit trail with full context

AUDIT_LOG=".claude/compensation-audit-log.txt"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
AUTHOR="${USER:-claude-code}"

# Extract comp change details from input
COMP_INPUT="$CLAUDE_TOOL_INPUT"
REP_NAME=$(echo "$COMP_INPUT" | jq -r '.rep_name // empty' 2>/dev/null)
OLD_VALUE=$(echo "$COMP_INPUT" | jq -r '.old_commission // empty' 2>/dev/null)
NEW_VALUE=$(echo "$COMP_INPUT" | jq -r '.new_commission // empty' 2>/dev/null)
REASON=$(echo "$COMP_INPUT" | jq -r '.reason // empty' 2>/dev/null)
DEAL_ID=$(echo "$COMP_INPUT" | jq -r '.deal_id // empty' 2>/dev/null)

if [ ! -z "$OLD_VALUE" ] && [ ! -z "$NEW_VALUE" ] && [ "$OLD_VALUE" != "$NEW_VALUE" ]; then
  # Log the change
  LOG_ENTRY="[$TIMESTAMP] Rep: $REP_NAME | Deal: $DEAL_ID | Change: \$$OLD_VALUE → \$$NEW_VALUE | Reason: $REASON | Author: $AUTHOR"
  echo "$LOG_ENTRY" >> "$AUDIT_LOG"
  
  # Require approval for adjustments >$1000
  VARIANCE=$(echo "$NEW_VALUE - $OLD_VALUE" | bc)
  if (( $(echo "$VARIANCE > 1000" | bc -l) )); then
    echo "COMP-AUDIT-REQUIRE-APPROVAL: Adjustment >$1000 requires finance/comp lead approval. Update REASON field with approval ID." >&2
  fi
  
  echo "COMP-AUDIT: Change logged to audit trail. Entry: $LOG_ENTRY" >&2
fi

exit 0
```

## Behavior

- **All commission changes:** Logged with timestamp, rep, deal, old/new values, reason, author
- **Adjustments >$1000:** Requires documented approval before payment
- **Monthly reconciliation:** All changes printed in compliance-auditor report

## Setup

1. Save script to `.claude/hooks/compensation-audit.sh` and `chmod +x`
2. Add settings.json entry
3. Create `.claude/compensation-audit-log.txt` for log storage
4. Integrate into monthly compliance audit process

## Dispute Resolution

When a commission dispute arises:
1. Pull audit log entry for the deal/rep
2. Verify old/new values match CRM and payroll records
3. Confirm reason and approver documented in log
4. If discrepancy, escalate to finance for investigation
