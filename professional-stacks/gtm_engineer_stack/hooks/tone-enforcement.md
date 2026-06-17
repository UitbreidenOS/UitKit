# Tone Enforcement Hook

## What This Hook Does
Scans every Write or Edit output for banned marketing jargon and corporate clichés. Fires after Claude writes any content file. Blocks the output if violations are found.

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
            "command": "bash .claude/hooks/tone-enforcement.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: tone-enforcement.sh

```bash
#!/bin/bash
# Tone enforcement for GTM Engineer Stack
# Scans written files for banned words and clichés
# Exit 1 if violations found, otherwise pass silently

BANNED="synergy|revolutionary|game-changer|delve|robust|leverage|holistic|reach out|touch base|circle back|paradigm|disruptive|innovative|seamlessly|checking in|just following up|per my last email"

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

MATCH=$(grep -inoE "$BANNED" "$FILE" | head -5)

if [ -n "$MATCH" ]; then
  echo "❌ TONE VIOLATION: Banned word(s) detected in $FILE"
  echo ""
  echo "$MATCH"
  echo ""
  echo "Remove the flagged terms before this output can be used."
  exit 1
fi
```

## Behavior

**On violation:** Prints violation header with filename, shows matching lines with line numbers, and prevents the output from being saved (exit code 1).

**On pass:** Silent — no output, Write/Edit completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/tone-enforcement.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/tone-enforcement.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` (or `.claude/settings.local.json` for local-only enforcement)

5. Restart Claude Code for the hook to take effect
