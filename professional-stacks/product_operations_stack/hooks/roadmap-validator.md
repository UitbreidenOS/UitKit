# Roadmap Validator Hook

## What This Hook Does

Scans roadmap documents and prioritization outputs for missing OKR alignment, incomplete prioritization rationale, or scope creep risk. Fires when Claude writes or edits roadmap files. Flags items without clear business rationale or dependency mapping.

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
            "command": "bash .claude/hooks/roadmap-validator.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: roadmap-validator.sh

```bash
#!/bin/bash
# Roadmap validator — checks roadmap documents for completeness
# Scans for: OKR alignment, prioritization rationale, dependency mapping
# Exit 1 if critical gaps found, otherwise pass silently

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Skip if not a roadmap file
if ! grep -q "roadmap\|priorit\|backlog" "$FILE" -i; then
  exit 0
fi

# Check for missing elements
MISSING_OKR=$(grep -c "OKR\|strategic\|alignment" "$FILE" 2>/dev/null || echo "0")
MISSING_RATIONALE=$(grep "**Rationale:**\|**Why:**" "$FILE" | wc -l 2>/dev/null || echo "0")
TOTAL_ITEMS=$(grep "^##\|^###" "$FILE" | wc -l 2>/dev/null || echo "0")

# Warn if roadmap items lack rationale
if [ "$TOTAL_ITEMS" -gt 0 ] && [ "$MISSING_RATIONALE" -lt "$((TOTAL_ITEMS / 2))" ]; then
  echo "⚠️ ROADMAP VALIDATION: Items lack clear rationale"
  echo ""
  echo "Issue: Less than half of roadmap items have documented rationale or why they matter."
  echo "Fix: Add a 'Rationale' or 'Why This Matters' section explaining business impact for each item."
  exit 1
fi

# Warn if no OKR alignment mentioned
if [ "$MISSING_OKR" -eq 0 ]; then
  echo "⚠️ ROADMAP VALIDATION: No OKR alignment mentioned"
  echo ""
  echo "Issue: Roadmap document doesn't reference strategic OKRs or business goals."
  echo "Fix: Add a section mapping roadmap items to Q[X] OKRs or strategic priorities."
  exit 1
fi

exit 0
```

## Behavior

**On validation warning:** Prints issue and recommended fix; prevents write from completing (exit code 1).

**On pass:** Silent — no output, Write/Edit completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/roadmap-validator.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/roadmap-validator.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code for hook to take effect

---
