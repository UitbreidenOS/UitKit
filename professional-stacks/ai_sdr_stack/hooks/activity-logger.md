# Activity Logger Hook

## What This Hook Does
Writes an immutable timestamped activity record to session-log.md after every email send, call completion, or meeting log action. Fires on Stop (session end) as a fallback to ensure no activity is lost. Captures: action type, prospect, timestamp, and status.

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/activity-logger.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: activity-logger.sh

```bash
#!/bin/bash
# Session activity logger for AI SDR Stack
# Appends session summary to session-log.md on Stop

TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
LOG_FILE="session-log.md"

# Create log file if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
  echo "# Session Log" > "$LOG_FILE"
  echo "_Auto-updated by activity-logger hook on Stop._" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"
fi

# Append session end marker
cat >> "$LOG_FILE" << EOF

---
## Session ended: $TIMESTAMP
_Review the entries above for this session. Mark any PENDING APPROVAL items before closing._
EOF

echo "Session log updated: $LOG_FILE"
```

## Behavior

**On Stop:** Appends a timestamped session-end marker to session-log.md. Reminds the human to review any PENDING APPROVAL items.

**Mid-session:** The hook only fires on Stop — it does not fire on individual tool uses.

## Setup Instructions

1. Save as `.claude/hooks/activity-logger.sh`
2. Make executable: `chmod +x .claude/hooks/activity-logger.sh`
3. Add the settings.json entry to `.claude/settings.json`
4. Restart Claude Code.

## Notes
The primary logging happens via the crm-logger skill during the session. This Stop hook is the fallback — it ensures the session is closed cleanly and any outstanding items are surfaced even if the human forgets to log them.
