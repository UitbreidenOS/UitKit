# Brand Voice Enforcement Hook

## What This Hook Does

Scans all Write and Edit outputs for tone drift, banned phrases, and off-voice responses. Fires after Claude writes member communications (welcome messages, responses, re-engagement sequences, etc.). Blocks output if violations are found.

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
            "command": "bash .claude/hooks/brand-voice-enforcement.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: brand-voice-enforcement.sh

```bash
#!/bin/bash
# Brand voice enforcement for Community Manager Stack
# Scans written files for banned phrases and tone violations
# Exit 1 if violations found, otherwise pass silently

BANNED="corporate-speak|we are thrilled|synergy|leverage|disruptive|move the needle|circle back|reach out|touch base|per my last email"

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

MATCH=$(grep -inoE "$BANNED" "$FILE" | head -5)

if [ -n "$MATCH" ]; then
  echo "❌ VOICE VIOLATION: Banned phrase(s) detected in $FILE"
  echo ""
  echo "$MATCH"
  echo ""
  echo "Rewrite the message to match community voice. Use: warm, inclusive, actionable. No corporate jargon."
  exit 1
fi

# Check for tone issues: hedging language
HEDGING="I think|maybe|I hope|if you have time|just wondering|not sure if"
HEDGE_MATCH=$(grep -inoE "$HEDGING" "$FILE" | head -3)

if [ -n "$HEDGE_MATCH" ]; then
  echo "⚠️  TONE WARNING: Hedging language detected in $FILE"
  echo ""
  echo "$HEDGE_MATCH"
  echo ""
  echo "Community voice is direct and high-agency. Remove hedging. Be confident and clear."
  exit 0  # Warning only, not a blocker
fi

exit 0
```

## Behavior

**On violation:** Prints violation header with filename, shows matching lines with line numbers, and prevents the output from being saved (exit code 1).

**On warning:** Prints tone warning but allows save to proceed (exit code 0) — CM can review.

**On pass:** Silent — no output, Write/Edit completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/brand-voice-enforcement.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/brand-voice-enforcement.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` (or `.claude/settings.local.json` for local-only enforcement)

5. Restart Claude Code for the hook to take effect

## When It Triggers

- When writing welcome messages to new members
- When drafting re-engagement sequences
- When composing moderation responses
- When writing event announcements
- Any response that goes out to the community

## Brand Voice Checklist

Enforce:
- ✓ Warm and inclusive tone
- ✓ Direct and high-agency language
- ✓ Specific, actionable recommendations
- ✓ Acknowledgment of member context/history
- ✓ Low-friction, empathetic approach

Block:
- ✗ Corporate jargon (synergy, leverage, etc.)
- ✗ Hedging language (I think, maybe, hope)
- ✗ One-size-fits-all templates
- ✗ Dismissive or gatekeeping tone
- ✗ Impersonal or generic greetings

---
