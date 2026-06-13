# Engagement Logger Hook

## What This Hook Does

Auto-logs all community engagement actions to `session-log.md` at session end (Stop). Captures: members onboarded, content curated, engagement actions taken, moderation decisions, key metrics, and action items. Creates an audit trail of all session work.

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "bash .claude/hooks/engagement-logger.sh"
      }
    ]
  }
}
```

## Hook Script: engagement-logger.sh

```bash
#!/bin/bash
# Engagement logger for Community Manager Stack
# Logs all session actions to session-log.md on session end
# Appends new session entry with timestamp, actions, and next steps

SESSION_LOG="session-log.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
DATE=$(date '+%Y-%m-%d')

if [ ! -f "$SESSION_LOG" ]; then
  echo "Error: $SESSION_LOG not found. Create session-log.md in project root."
  exit 1
fi

# Create temporary session entry template
TEMP_SESSION=$(cat <<'EOF'

## [TIMESTAMP]

**Members Onboarded:**
[List: email, segment, interest]

**Content Curated:**
[List: post title, source, engagement prediction]

**Engagement Actions:**
[List: member email, action taken, status]

**Moderation Decisions:**
[List: post ID, decision, reason]

**Key Decisions:**
[List: what was decided and why]

**Metrics This Session:**
- Members engaged: [X]
- Content pieces curated: [X]
- Moderation reviews: [X]
- At-risk members contacted: [X]

**Next Steps:**
[Checkbox list of follow-up actions]

---
EOF
)

# Append to session log (insert before final divider)
TIMESTAMP_REPLACED="${TEMP_SESSION//\[TIMESTAMP\]/$TIMESTAMP}"

# Insert before the last line (divider)
sed -i '' -e '$s/^/'"$(printf '%s\n' "$TIMESTAMP_REPLACED" | sed -e 's/[\/&]/\\&/g')"'/' "$SESSION_LOG"

echo "✓ Session logged to $SESSION_LOG at $TIMESTAMP"
exit 0
```

## Behavior

**On Stop (session end):** Creates a new dated session entry in `session-log.md` with fields for all engagement actions taken during the session.

**On every action:** Includes summary metrics (members engaged, content curated, moderation decisions).

**On completion:** Prints confirmation message and exits cleanly.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/engagement-logger.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/engagement-logger.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Ensure `session-log.md` exists in your project root (it's provided in the stack)

6. Restart Claude Code for the hook to take effect

## Session Log Format

Each session entry includes:

```markdown
## [YYYY-MM-DD HH:MM]

**Members Onboarded:**
- email@company.com (Segment: Core, Interest: scaling teams)
- jane.doe@startup.io (Segment: Contributor, Interest: hiring)

**Content Curated:**
- "Scaling API docs at hypergrowth" — HN — Prediction: High
- "Remote hiring playbook" — Substack — Prediction: Medium

**Engagement Actions:**
- michael.torres@company.com — Re-engagement check-in — SENT
- alex.kumar@startup.io — Event invitation — APPROVED

**Moderation Decisions:**
- Post ID xyz123 — WARN — Off-topic language
- Thread 456 — ALLOW — Valid constructive criticism

**Key Decisions:**
- Launched monthly AMA series (high demand signal from community-health report)
- Created #product-feedback channel (requested by 5+ members)

**Metrics This Session:**
- Members engaged: 3
- Content pieces curated: 2
- Moderation reviews: 2
- At-risk members contacted: 1

**Next Steps:**
- [ ] Send welcome sequences to 2 new members (approved, pending send)
- [ ] Follow up with michael_torres on re-engagement message
- [ ] Schedule CTO AMA (confirmed speaker availability)
- [ ] Review sentiment on product feedback thread
```

## Session Log Uses

**Audit Trail:** Complete record of all engagement decisions and rationale.

**Continuity:** Reference prior sessions to maintain context and consistency.

**Reporting:** Extract metrics for monthly/quarterly community reports.

**Training:** Review logged entries to identify patterns and improvement areas.

**Accountability:** Transparent record of moderation decisions and escalations.

## Best Practices

1. **Log after each major action:** Don't wait until session end — make quick notes.
2. **Include rationale:** "Why" each decision, not just "what" was done.
3. **Link to follow-ups:** Mark which actions need continuation in next session.
4. **Tag sensitive items:** Moderation, escalations, privacy-related decisions.
5. **Keep metrics:** Trend session-to-session engagement and growth.

---
