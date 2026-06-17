# Session Tracker Hook

## What This Hook Does

Auto-logs key architecture work to `session-log.md` when the session ends. Captures: systems designed, reviews completed, requirements matrices created, capacity plans generated, migrations planned. Builds a searchable history of all architecture decisions.

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "bash .claude/hooks/session-tracker.sh"
      }
    ]
  }
}
```

## Hook Script: session-tracker.sh

```bash
#!/bin/bash
# Session tracker for Solutions Architect Stack
# Logs architecture work to session-log.md on session Stop

LOG_FILE="./session-log.md"
DATE=$(date '+%Y-%m-%d %H:%M')
SESSION_DATE=$(date '+%Y-%m-%d')

# Initialize log if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
  cat > "$LOG_FILE" << 'EOF'
# Session Log
_Auto-updated by session-tracker hook on Stop._

---

## Current Session
_This section is live — updated as the session runs._

**Date:** [filled by hook]
**Systems Designed:** [list]
**Reviews Completed:** [list]
**Requirements Matrices:** [list]
**Capacity Plans:** [list]
**Migrations Planned:** [list]
**Key Decisions:** [list]
**Next Steps:** [list]

---

## History
_Previous sessions logged below._

EOF
fi

# Count what was created in this session
DESIGNS=$(find . -name "*-architecture.md" -newer /tmp/session_start 2>/dev/null | wc -l)
REVIEWS=$(find . -name "*-review.md" -newer /tmp/session_start 2>/dev/null | wc -l)
REQS=$(find . -name "*-matrix.md" -newer /tmp/session_start 2>/dev/null | wc -l)
CAPACITY=$(find . -name "*-capacity.md" -newer /tmp/session_start 2>/dev/null | wc -l)
MIGRATIONS=$(find . -name "*-migration.md" -newer /tmp/session_start 2>/dev/null | wc -l)

# Only log if something was created
if [ "$DESIGNS" -gt 0 ] || [ "$REVIEWS" -gt 0 ] || [ "$REQS" -gt 0 ] || [ "$CAPACITY" -gt 0 ] || [ "$MIGRATIONS" -gt 0 ]; then
  
  # Create entry
  ENTRY="
### [$SESSION_DATE] Session Summary
**Date:** $DATE  
**Systems Designed:** $DESIGNS  
**Reviews Completed:** $REVIEWS  
**Requirements Matrices:** $REQS  
**Capacity Plans:** $CAPACITY  
**Migrations Planned:** $MIGRATIONS  

**Artifacts Created:**
"
  
  # List created files
  find . -name "*-architecture.md" -newer /tmp/session_start 2>/dev/null | while read f; do
    ENTRY="$ENTRY
- $f (architecture design)
"
  done
  
  find . -name "*-review.md" -newer /tmp/session_start 2>/dev/null | while read f; do
    ENTRY="$ENTRY
- $f (design review)
"
  done
  
  find . -name "*-matrix.md" -newer /tmp/session_start 2>/dev/null | while read f; do
    ENTRY="$ENTRY
- $f (requirements)
"
  done
  
  find . -name "*-capacity.md" -newer /tmp/session_start 2>/dev/null | while read f; do
    ENTRY="$ENTRY
- $f (capacity plan)
"
  done
  
  find . -name "*-migration.md" -newer /tmp/session_start 2>/dev/null | while read f; do
    ENTRY="$ENTRY
- $f (migration plan)
"
  done
  
  # Append to log file (after History header)
  tail -n +1 "$LOG_FILE" | sed "/^## History$/a\\$ENTRY" > "$LOG_FILE.tmp"
  mv "$LOG_FILE.tmp" "$LOG_FILE"
  
  echo "✅ Session logged to session-log.md"
fi
```

## Behavior

**On session Stop:** If any architecture artifacts were created (design docs, reviews, requirements, capacity plans, migrations), appends an entry to `session-log.md` with timestamp, artifact count, and file list.

**If no artifacts:** Silent — nothing logged.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/session-tracker.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/session-tracker.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` (or `.claude/settings.local.json` for local-only enforcement)

5. Restart Claude Code for the hook to take effect

## Session Log Format

```markdown
### [2026-06-13] Session Summary
**Date:** 2026-06-13 14:35  
**Systems Designed:** 1  
**Reviews Completed:** 1  
**Requirements Matrices:** 1  
**Capacity Plans:** 1  
**Migrations Planned:** 0  

**Artifacts Created:**
- designs/acme-order-mgmt-architecture.md (architecture design)
- reviews/acme-order-mgmt-review.md (design review)
- requirements/acme-matrix.md (requirements)
- capacity/acme-capacity-roadmap.md (capacity plan)
```

## Notes

The hook logs **only the names and types** of artifacts created. To understand what was designed, read the actual documents. The session log serves as an index and audit trail of architectural work.
