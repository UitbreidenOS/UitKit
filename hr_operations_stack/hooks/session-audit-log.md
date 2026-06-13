# Session Audit Log Hook

## What This Hook Does
Auto-logs all HR activities to `session-log.md` when a session ends. Captures hires made, offers extended, reviews completed, terminations processed, compliance audits performed, and all approval chains. Builds searchable audit trail of all people decisions.

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/session-audit-log.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: session-audit-log.sh

```bash
#!/bin/bash
# Session audit log for HR Operations Stack
# Auto-logs HR activities to session-log.md when session stops
# Captures: hires, offers, reviews, terminations, audits, approvals

SESSION_LOG="${PWD}/session-log.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
USER=$(whoami)

# Create session-log.md if it doesn't exist
if [ ! -f "$SESSION_LOG" ]; then
  cat > "$SESSION_LOG" << 'LOGEOF'
# Session Log
_Auto-updated by session-audit-log hook on Stop._

---

## Current Session
_This section is live — updated as the session runs._

**Date:** [filled by hook]  
**Hires Made:** [count]  
**Reviews Completed:** [count]  
**Compliance Audits:** [count]  
**High-Risk Decisions:** [count]  
**Legal Escalations:** [count]  
**Approvals:** [count]

---

## History

_Sessions logged below_

LOGEOF
fi

# Log session entry (simple format; Claude can manually update with details)
cat >> "$SESSION_LOG" << LOGEOF

### [$TIMESTAMP] Session Summary
**User:** $USER  
**Hires:** [Check hiring-plans/ for plans created]  
**Reviews:** [Check reviews/ for reviews completed]  
**Compliance Audits:** [Check compliance-audits/ for audits]  
**Terminations:** [If any, note business rationale and legal review status]  
**Policy Changes:** [If any, note approvals]  
**Next Actions:** [List follow-ups required]

---

LOGEOF

echo "✓ Session logged to $SESSION_LOG"
exit 0
```

## Behavior

**On Stop:** Appends session entry to `session-log.md` with timestamp, user, and prompt to fill in activity details (hires, reviews, audits, terminations).

**Result:** Creates searchable audit trail of all HR decisions and approvals.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/session-audit-log.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/session-audit-log.sh
   ```

4. Add settings.json entry to `.claude/settings.json` or `.claude/settings.local.json`

5. Ensure `session-log.md` exists in project root (template provided)

6. Restart Claude Code

---

## How to Use

1. At end of session, Claude or hook will append timestamp entry to `session-log.md`
2. Update with: hires made, reviews completed, audits run, approvals received
3. Reference session log for audit trail and activity tracking
4. Example entry:

```
### [2026-06-12 14:35] Session Summary
**User:** alice@company.com
**Hires:** 
- Senior Product Manager, Growth — Hiring plan created, posting approved by CFO
**Reviews:** 
- John Doe (Senior Engineer) — Annual review completed, 5% merit increase recommended
**Compliance Audits:** 
- Jane Smith termination audit — Score 11/12 (PROCEED), legal review waived
**Policy Changes:** 
- Remote work policy update — Draft prepared, legal review pending
**Next Actions:**
- [ ] Jane Smith termination meeting scheduled for 2026-06-14
- [ ] John Doe merit adjustment processing by payroll
- [ ] Post Senior PM job description on LinkedIn
```

---
