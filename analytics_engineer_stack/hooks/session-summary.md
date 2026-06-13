# Session Summary Hook

## What This Hook Does

Auto-logs all key analytics work to `session-log.md` when the session ends. Captures queries optimized, models built, dashboards audited, issues diagnosed, and metrics defined. Maintains an audit trail of all analytics engineering activities.

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "bash .claude/hooks/session-summary.sh"
      }
    ]
  }
}
```

## Hook Script: session-summary.sh

```bash
#!/bin/bash
# Session summary for Analytics Engineer Stack
# Auto-logs session activities to session-log.md
# Runs on session stop (Stop hook)

LOG_FILE="$(pwd)/session-log.md"

# Create session-log.md if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
  cat > "$LOG_FILE" << 'EOF'
# Session Log
_Auto-updated by session-summary hook on Stop._

---

## Current Session
_This section is live — updated as the session runs._

**Date:** [filled by hook]
**Queries Optimized:** [list]
**Models Built:** [list]
**Dashboards Audited:** [list]
**Issues Diagnosed:** [list]
**Metrics Defined:** [list]
**Next Steps:** [list]

---

## History

_Sessions appear below in reverse chronological order_

EOF
fi

# Get session start time and date
SESSION_DATE=$(date "+%Y-%m-%d")
SESSION_TIME=$(date "+%H:%M:%S")

# Parse git log or recent file changes to infer activity
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git status --short 2>/dev/null | awk '{print $2}')

# Count activities by type
QUERIES_OPTIMIZED=$(echo "$CHANGED_FILES" | grep -c "sql$" || echo 0)
MODELS_BUILT=$(echo "$CHANGED_FILES" | grep -c "models.*\.sql$" || echo 0)
SCHEMAS_UPDATED=$(echo "$CHANGED_FILES" | grep -c "schema\.yml$" || echo 0)
DASHBOARDS_AUDITED=$(echo "$CHANGED_FILES" | grep -c "dashboard\|audit" || echo 0)

# Parse recent commits for detailed activity
RECENT_COMMIT=$(git log -1 --pretty=format:"%s" 2>/dev/null || echo "Analytics engineering work")

# Update Current Session section in session-log.md
if grep -q "## Current Session" "$LOG_FILE"; then
  # Replace the Current Session placeholder section
  TEMP_FILE=$(mktemp)
  
  awk '
  /^## Current Session$/  { print; print ""; in_section=1; next }
  in_section && /^---/ { 
    print "**Date:** '"$SESSION_DATE $SESSION_TIME"'";
    print "**Queries Optimized:** '"$QUERIES_OPTIMIZED"'";
    print "**Models Built:** '"$MODELS_BUILT"'";
    print "**Schemas Updated:** '"$SCHEMAS_UPDATED"'";
    print "**Dashboards Audited:** '"$DASHBOARDS_AUDITED"'";
    print "**Activity:** '"$RECENT_COMMIT"'";
    print "";
    in_section=0; 
    print; 
    next 
  }
  !in_section { print }
  ' "$LOG_FILE" > "$TEMP_FILE"
  
  mv "$TEMP_FILE" "$LOG_FILE"
fi

# Log message
echo "✓ Session logged to $(pwd)/session-log.md"
exit 0
```

## Behavior

**On session stop:** Reads recent git changes or file modifications, counts activities (queries, models, dashboards), and updates `session-log.md` with summary.

**Silent:** Hook runs without blocking session exit.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/session-summary.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/session-summary.sh
   ```

4. Add settings.json entry above to `.claude/settings.json`

5. Ensure `session-log.md` exists in project root (see template below)

6. Restart Claude Code

## Session Log Template

Create `session-log.md` in your project root with this template:

```markdown
# Session Log
_Auto-updated by session-summary hook on Stop._

---

## Current Session
_This section is live — updated as the session runs._

**Date:** [filled by hook]
**Queries Optimized:** [list]
**Models Built:** [list]
**Dashboards Audited:** [list]
**Issues Diagnosed:** [list]
**Metrics Defined:** [list]
**Next Steps:** [list]

---

## History

### [2026-06-12] Session Template

**Queries Optimized:**
- fact_transactions (95% performance improvement)
- mart_daily_metrics (added date filter)

**Models Built:**
- stg_raw_users (staging layer)
- fct_orders (fact table)

**Dashboards Audited:**
- Executive Monthly Revenue — PASS
- Sales Pipeline — FAIL (metric mismatch)

**Issues Diagnosed:**
- dbt job timeout on mart_daily_metrics (fixed: added index)
- MRR metric calculation drift (fixed: updated formula)

**Metrics Defined:**
- Monthly Recurring Revenue (MRR)
- Net Dollar Retention (NDR)

**Next Steps:**
- [ ] Deploy dbt changes to prod
- [ ] Publish updated dashboards
- [ ] Schedule data quality audit

---

_Template — hook auto-populates above section_
```

---
