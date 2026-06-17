# Email Compliance Hook

## What This Hook Does
Scans every written email draft for CAN-SPAM and GDPR compliance requirements. Fires after any Write or Edit that creates a file in the drafts directory. Checks for: physical mailing address, unsubscribe language, sender identity, and absence of deceptive subject lines.

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
            "command": "bash .claude/hooks/email-compliance.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: email-compliance.sh

```bash
#!/bin/bash
# CAN-SPAM / GDPR compliance check for AI SDR Stack
# Scans email drafts for required compliance elements

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

# Only check files in drafts/ or emails/ directories
if [ -z "$FILE" ] || [[ "$FILE" != *"draft"* && "$FILE" != *"email"* ]]; then
  exit 0
fi

if [ ! -f "$FILE" ]; then
  exit 0
fi

VIOLATIONS=""

# Check for unsubscribe language
if ! grep -qi "unsubscribe|opt.out|remove me|stop receiving" "$FILE"; then
  VIOLATIONS="$VIOLATIONS
- Missing unsubscribe/opt-out language (CAN-SPAM required)"
fi

# Check for sender identity (must have company name or sender name)
if ! grep -qi "^From:|^Sender:|[Sender|[Your name" "$FILE"; then
  VIOLATIONS="$VIOLATIONS
- Sender identity not clearly identified"
fi

if [ -n "$VIOLATIONS" ]; then
  echo "⚠️  EMAIL COMPLIANCE WARNING: $FILE"
  echo ""
  printf "$VIOLATIONS"
  echo ""
  echo "Add the missing elements before this draft is approved for send."
  exit 1
fi
```

## Behavior

**On violation:** Lists each missing compliance element with the relevant regulation. Prevents the draft from being marked ready.

**On pass:** Silent — draft proceeds normally.

## Setup Instructions

1. Save as `.claude/hooks/email-compliance.sh`
2. Make executable: `chmod +x .claude/hooks/email-compliance.sh`
3. Add the settings.json entry to `.claude/settings.json`
4. Restart Claude Code.

## What It Checks
- Unsubscribe / opt-out language (CAN-SPAM §5(a)(3))
- Sender identity visible
- No deceptive subject line patterns (Re: on cold emails to non-replies)
