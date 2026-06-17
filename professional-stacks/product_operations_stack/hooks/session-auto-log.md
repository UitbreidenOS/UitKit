# Session Auto-Log Hook

## What This Hook Does

Automatically logs key product operations work to `session-log.md` at the end of every session. Captures roadmap analyses run, feedback synthesized, stakeholder decisions, releases planned, and user research conducted. Creates an audit trail of all product operations work.

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "bash .claude/hooks/session-auto-log.sh"
      }
    ]
  }
}
```

## Hook Script: session-auto-log.sh

```bash
#!/bin/bash
# Session auto-logger — logs product ops work to session-log.md on session stop
# Captures: Roadmap analyses, feedback synthesis, stakeholder mappings, releases planned

WORKSPACE_DIR=$(pwd)
SESSION_LOG="${WORKSPACE_DIR}/session-log.md"

# Initialize session log if it doesn't exist
if [ ! -f "$SESSION_LOG" ]; then
  cat > "$SESSION_LOG" << 'EOF'
# Session Log
_Auto-updated by session-auto-log hook on Stop._

---

## Current Session
_This section is live — updated as the session runs._

**Date:** [filled by hook]
**Work Completed:** [list]
**Key Decisions:** [list]
**Next Steps:** [list]

---

## History

_Previous sessions appear below._

EOF
fi

# Get current date/time
NOW=$(date "+%Y-%m-%d %H:%M")

# Create session entry (placeholder for actual work — user fills in details)
cat >> "$SESSION_LOG" << EOF

---

## [$NOW] Session Entry

**Work Completed:**
- [Add roadmap analysis, feedback synthesis, stakeholder mapping, etc.]

**Key Decisions:**
- [What was decided and why?]

**Next Steps:**
- [ ] [Follow-up item]

EOF

echo "✓ Session logged to session-log.md"
```

## Behavior

**On session stop:** Appends a new dated entry to `session-log.md` with placeholders for work completed, decisions made, and next steps. User fills in details.

**Logging format:** Timestamp, work items, decisions, and follow-ups.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/session-auto-log.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/session-auto-log.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

## How to Use

When you run product operations workflows (roadmap analysis, feedback synthesis, stakeholder mapping, release planning), the hook will automatically create a log entry when your session ends. You can then fill in:

- What you analyzed or planned
- What was decided
- What stakeholders agreed to
- What to follow up on next

This creates a searchable history of all product operations work.

---
