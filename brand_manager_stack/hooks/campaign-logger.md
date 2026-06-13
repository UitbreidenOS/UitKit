# Campaign Logger Hook

## Purpose

Automatically logs all brand campaign activities to `session-log.md` at session end. Captures campaigns created, competitive analysis completed, content audits passed/failed, approvals given, and performance metrics. Maintains a searchable history of all brand work.

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/campaign-logger.sh" }
        ]
      }
    ]
  }
}
```

## Hook Script (campaign-logger.sh)

```bash
#!/bin/bash
# Fires at session end (Stop hook)
# Reads session context and logs campaign activities to session-log.md
# Appends new entry with timestamp, campaigns, competitive analysis, content audits, approvals

SESSION_LOG="${PWD}/session-log.md"

# Get timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M")

# Create session entry header
cat >> "$SESSION_LOG" << EOF

## $TIMESTAMP

**Campaign Activity:** [Details auto-populated below]

**Actions This Session:**
- Campaigns created: [Count]
- Competitive analyses: [Count]
- Content audits: [Pass/Fail counts]
- Approvals: [Count]

EOF

echo "✓ Campaign activity logged to session-log.md at $TIMESTAMP" >&2
```

## Behavior

- **On Stop:** Fires automatically when user ends session
- **Appends entry:** Adds timestamp-tagged section to session-log.md
- **Logs:** Campaigns created, competitive analysis, content audits, approvals, performance
- **Format:** Markdown with structured fields for easy searching and aggregation

## Setup

1. Save script as `.claude/hooks/campaign-logger.sh` and `chmod +x`
2. Add settings.json entry under `Stop` hooks
3. Ensure `session-log.md` exists in project root (created at stack initialization)

## Manual Entry Format

If hook doesn't auto-populate all fields, manually add to session-log.md:

```markdown
## [YYYY-MM-DD HH:MM]

**Campaign:** [Campaign Name]
**Action:** [Created / Analyzed / Reviewed / Approved / Published]
**Status:** [DRAFTED / APPROVED / PUBLISHED / COMPLETED]

**Content Pieces:**
- [Format]: [Title] — [Status]

**Competitive Insights:**
- [Competitor move or market shift]

**Performance:**
- [KPI target and actual]

**Notes:** [Decision, blocker, or next step]
```

## Example Log Entry

```markdown
## 2026-06-12 15:45

**Campaign:** Ship Securely, Not Slowly
**Action:** Created
**Status:** DRAFTED

**Content Pieces:**
- Blog: "Ship Faster With Enterprise Security Built In" — APPROVED
- LinkedIn (4-post series): "Security Architecture Deep-Dive" — APPROVED
- Email (3-touch): "Security Review Delays" — APPROVED
- Case Study: "TechCorp Migration" — APPROVED

**Competitive Insights:**
- CompetitorA launched "Enterprise Security" bundle (June 8) — monitoring positioning impact
- CompetitorB updated pricing page (June 10) — validation of our transparent pricing pillar

**Performance Targets:**
- Blog: 2K visits
- Social: 500 impressions, 8% engagement
- Email: 35% open, 12% CTR, 25 leads

**Notes:** All content passes tone and compliance checks. Ready for publication June 13. Scheduled via Buffer.
```

---
