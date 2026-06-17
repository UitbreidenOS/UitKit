# CRM Sync Validator Hook

## What This Hook Does
Prevents duplicate CRM log entries by checking the activity hash before any Write to session-log.md. Generates a hash from prospect email + action type + date. If the hash already exists in session-log.md, blocks the write and returns "DUPLICATE DETECTED."

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
            "command": "bash .claude/hooks/crm-sync-validator.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: crm-sync-validator.sh

```bash
#!/bin/bash
# CRM duplicate prevention for AI SDR Stack
# Checks activity hash before writing to session-log.md

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

# Only check writes to session-log.md
if [ -z "$FILE" ] || [[ "$FILE" != *"session-log"* ]]; then
  exit 0
fi

CONTENT=$(echo "$CLAUDE_TOOL_INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content',''))" 2>/dev/null)

# Extract activity key from content
ACTIVITY_KEY=$(echo "$CONTENT" | grep "Activity Key:" | sed 's/.*Activity Key: //')

if [ -z "$ACTIVITY_KEY" ]; then
  exit 0
fi

# Check if this key already exists in session-log.md
if grep -q "$ACTIVITY_KEY" session-log.md 2>/dev/null; then
  echo "DUPLICATE DETECTED: Activity key '$ACTIVITY_KEY' already exists in session-log.md"
  echo "This activity has already been logged. Skipping duplicate entry."
  exit 1
fi
```

## Behavior

**On duplicate:** Prints the duplicate activity key and blocks the write. Existing log entry is preserved.

**On unique:** Silent — the Write proceeds normally.

## Setup Instructions

1. Save as `.claude/hooks/crm-sync-validator.sh`
2. Make executable: `chmod +x .claude/hooks/crm-sync-validator.sh`
3. Add the settings.json entry to `.claude/settings.json`
4. Restart Claude Code.
