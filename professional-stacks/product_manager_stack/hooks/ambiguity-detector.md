# Ambiguity Detector Hook

## What This Hook Does
Scans PRD drafts for vague acceptance criteria and flags them for revision. Detects patterns like "should improve," "optimize," "user-friendly," "intuitive." Fires after any Write or Edit to a file named `*prd*` or `PRD`.

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
            "command": "bash .claude/hooks/ambiguity-detector.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: ambiguity-detector.sh

```bash
#!/bin/bash
# Ambiguity detector for PM Stack
# Scans PRDs for vague acceptance criteria

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

# Only check PRD files
if [ -z "$FILE" ] || [[ "$FILE" != *"prd"* && "$FILE" != *"PRD"* ]]; then
  exit 0
fi

if [ ! -f "$FILE" ]; then
  exit 0
fi

VAGUE_PATTERNS="should improve|optimize|enhance|make.*faster|user-friendly|intuitive|robust|seamlessly|flexible|scalable|efficient"

MATCHES=$(grep -in "$VAGUE_PATTERNS" "$FILE" | grep -i "criteria|acceptance|will|should" | head -5)

if [ -n "$MATCHES" ]; then
  echo "⚠️  AMBIGUOUS CRITERIA DETECTED in $FILE"
  echo ""
  echo "These acceptance criteria are too vague to test:"
  echo "$MATCHES"
  echo ""
  echo "Criteria must be testable — can you write an automated test for each one?"
  echo "Suggest: 'Can do X' or 'Will show Y' instead of 'Should improve Z'"
  exit 1
fi
```

## Behavior

**On violation:** Lists vague criteria with line numbers. Blocks the write.

**On pass:** Silent — PRD proceeds normally.

## Setup Instructions

1. Save as `.claude/hooks/ambiguity-detector.sh`
2. Make executable: `chmod +x .claude/hooks/ambiguity-detector.sh`
3. Add the settings.json entry to `.claude/settings.json`
4. Restart Claude Code.
