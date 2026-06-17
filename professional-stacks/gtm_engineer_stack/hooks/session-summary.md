# Session Summary Hook

## Purpose
Automatically appends a dated session summary to `session-log.md` when Claude stops.

## Settings.json Entry
```json
{
  "hooks": {
    "Stop": [
      { "type": "command", "command": "bash .claude/hooks/session-summary.sh" }
    ]
  }
}
```

## Hook Script (`session-summary.sh`)
```bash
#!/bin/bash
# Appends session summary to session-log.md
LOG="session-log.md"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)

# Get list of recently modified files as proxy for what was done
MODIFIED=$(find . -name "*.md" -newer "$LOG" -not -path "./.git/*" 2>/dev/null | head -10)

{
  echo ""
  echo "### [$DATE $TIME] Session"
  echo "**Files modified:**"
  if [ -n "$MODIFIED" ]; then
    echo "$MODIFIED" | while read -r f; do echo "- $f"; done
  else
    echo "- (none detected)"
  fi
  echo ""
  echo "**Next Steps:**"
  echo "- [ ] (fill in manually)"
  echo ""
} >> "$LOG"

echo "Session logged to $LOG"
```

## Setup
1. Save as `.claude/hooks/session-summary.sh`
2. Run `chmod +x .claude/hooks/session-summary.sh`
3. Add the `settings.json` entry above under `hooks.Stop`

## Behavior
- **Trigger:** Fires when Claude stops (session end or `/stop` command)
- **Action:** Appends a dated block to `session-log.md`
- **Details:** Lists files modified during the session (proxy for work completed)
- **Output:** Prints confirmation message to console

## Notes
- Requires `session-log.md` to exist in the project root
- Uses file modification time relative to the log file to detect changes
- Manual entry of "Next Steps" is expected after each session
