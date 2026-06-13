# Stakeholder Validation Hook

## What This Hook Does

Validates stakeholder maps for completeness: ensures all critical roles are represented (Product, Engineering, Customer Success, Legal/Security), conflicts are documented, and approval paths are clear. Flags missing stakeholders or undefined approval authorities.

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
            "command": "bash .claude/hooks/stakeholder-validation.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: stakeholder-validation.sh

```bash
#!/bin/bash
# Stakeholder validation — checks maps for complete role coverage and clear approval paths
# Flags: Missing critical roles, undefined approvers, missing conflict resolution

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Skip if not a stakeholder mapping document
if ! grep -q "stakeholder\|RACI\|approval" "$FILE" -i; then
  exit 0
fi

# Check for critical roles
PRODUCT=$(grep -i "product\|PM" "$FILE" | wc -l)
ENGINEERING=$(grep -i "engineering\|engineering lead" "$FILE" | wc -l)
CS=$(grep -i "customer success\|CS\|support" "$FILE" | wc -l)

if [ "$PRODUCT" -eq 0 ] || [ "$ENGINEERING" -eq 0 ] || [ "$CS" -eq 0 ]; then
  echo "⚠️ STAKEHOLDER VALIDATION: Missing critical roles"
  echo ""
  echo "Issue: Stakeholder map is missing Product, Engineering, or Customer Success representation."
  echo "Fix: Add all three roles to the RACI matrix, even if they're advisory."
  exit 1
fi

# Check for defined approval authority
ACCOUNTABLE=$(grep -c "Accountable\|approval\|authority\|sign-off" "$FILE")

if [ "$ACCOUNTABLE" -eq 0 ]; then
  echo "⚠️ STAKEHOLDER VALIDATION: No approval authority defined"
  echo ""
  echo "Issue: Stakeholder map doesn't specify who has final decision authority."
  echo "Fix: Add a row in RACI matrix showing who is 'Accountable' for this decision."
  exit 1
fi

# Check for conflict documentation if multiple "A" (Accountable) entries exist
MULTIPLE_ACCOUNTABLE=$(grep -E "\| .*\| .*X.*\| .*\|" "$FILE" | grep -c "X")

if [ "$MULTIPLE_ACCOUNTABLE" -gt 1 ]; then
  CONFLICT_DOC=$(grep -i "conflict\|competing\|priority" "$FILE" | wc -l)
  if [ "$CONFLICT_DOC" -eq 0 ]; then
    echo "⚠️ STAKEHOLDER VALIDATION: Multiple accountable roles without conflict resolution"
    echo ""
    echo "Issue: Multiple stakeholders marked as 'Accountable' but no conflict resolution strategy."
    echo "Fix: Add a 'Conflict Resolution' section documenting how to break ties."
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

2. Save the script as `.claude/hooks/stakeholder-validation.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/stakeholder-validation.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

---
