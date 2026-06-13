# Compliance Gatekeeper Hook

## What This Hook Does
Blocks execution of high-risk people decisions (terminations, compensation changes, policy updates) if compliance audit score <6. Requires legal review and mitigation documentation before proceeding.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/compliance-gatekeeper.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: compliance-gatekeeper.sh

```bash
#!/bin/bash
# Compliance gatekeeper for HR Operations Stack
# Blocks terminations, compensation changes, policy updates if compliance score <6
# Exits 1 if violations found, otherwise passes silently

BLOCKED_PATTERNS="termination|severance|compensation change|policy update|restructuring"

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

MATCH=$(grep -inoE "$BLOCKED_PATTERNS" "$FILE" | head -1)

if [ -n "$MATCH" ]; then
  SCORE=$(grep -i "total.*score\|score.*/" "$FILE" | head -1)
  
  if [[ $SCORE =~ ([0-9]+)[^0-9]*12 ]]; then
    SCORE_NUM="${BASH_REMATCH[1]}"
    if (( SCORE_NUM < 6 )); then
      echo "❌ COMPLIANCE GATEKEEPER: High-risk decision blocked (score: $SCORE_NUM/12)"
      echo ""
      echo "Legal Review Required: Compliance score <6 indicates high risk."
      echo ""
      echo "Before proceeding:"
      echo "  1. Escalate to employment counsel"
      echo "  2. Complete risk mitigation plan"
      echo "  3. Obtain legal sign-off"
      echo "  4. Re-audit and confirm score ≥6 or document mitigation"
      echo ""
      exit 1
    fi
  fi
fi

exit 0
```

## Behavior

**On violation:** Prints compliance gatekeeper header, shows audit score, lists required legal review steps, and blocks the Write operation (exit code 1).

**On pass:** Silent — no output, Write completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/compliance-gatekeeper.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/compliance-gatekeeper.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` or `.claude/settings.local.json`

5. Restart Claude Code for the hook to take effect

---
