# Acceptance Criteria Validator Hook

## What This Hook Does
Validates that every acceptance criterion is outcome-focused and testable. Flags criteria that are effort-focused ("should refactor," "improve architecture") or unmeasurable. Fires after any Write to a PRD file.

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
            "command": "bash .claude/hooks/acceptance-criteria-validator.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: acceptance-criteria-validator.sh

```bash
#!/bin/bash
# Validates acceptance criteria format
# Checks for effort-focused language and unmeasurable claims

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [[ "$FILE" != *"prd"* && "$FILE" != *"PRD"* ]]; then
  exit 0
fi

if [ ! -f "$FILE" ]; then
  exit 0
fi

# Extract criteria section
CRITERIA=$(sed -n '/Acceptance Criteria/,/^##/p' "$FILE" | grep "^-" | head -10)

# Check for effort-focused language
EFFORT_FOCUSED=$(echo "$CRITERIA" | grep -i "refactor|optimize|improve|clean up|reduce technical debt" || true)

if [ -n "$EFFORT_FOCUSED" ]; then
  echo "❌ EFFORT-FOCUSED CRITERIA DETECTED"
  echo ""
  echo "These criteria describe work, not outcomes:"
  echo "$EFFORT_FOCUSED"
  echo ""
  echo "Convert to outcome-focused: 'Can [do X]' instead of 'Refactor [code]'"
  exit 1
fi
```

## Behavior

**On violation:** Flags criteria that describe effort rather than outcome. Blocks the write.

**On pass:** Silent — PRD proceeds normally.

## Setup Instructions

1. Save as `.claude/hooks/acceptance-criteria-validator.sh`
2. Make executable: `chmod +x .claude/hooks/acceptance-criteria-validator.sh`
3. Add the settings.json entry to `.claude/settings.json`
4. Restart Claude Code.
