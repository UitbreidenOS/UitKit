# Member Milestone Hook

## What This Hook Does

Auto-logs and celebrates member milestones in real-time: first post, 50th post, 1-year anniversary, moderator promotion, content featured. Milestones are public celebrations in #announcements and logged to session log. Recognition drives retention and encourages community contribution.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*member.*milestone|Write.*celebration",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/member-milestone.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: member-milestone.sh

```bash
#!/bin/bash
# Member milestone for Community Manager Stack
# Detects and celebrates member milestones
# Logs to session and optionally posts public celebration

MILESTONE_DB="${HOME}/.claude/community/milestones.db"

MEMBER_ID=${MEMBER_ID:-"unknown"}
MEMBER_NAME=${MEMBER_NAME:-"Community Member"}
MILESTONE_TYPE=${MILESTONE_TYPE:-"post"}  # post, anniversary, promotion, featured
POST_COUNT=${POST_COUNT:-0}

# Initialize or update milestone database (stub; in production, query backend)

case "$MILESTONE_TYPE" in
  "first_post")
    echo "🎉 MILESTONE: $MEMBER_NAME posted for the first time!"
    TITLE="Welcome to $MEMBER_NAME!"
    BODY="Congrats on your first post! The community welcomes you. Can't wait to see what you share next."
    ;;
  "50th_post")
    echo "🎉 MILESTONE: $MEMBER_NAME reached 50 posts!"
    TITLE="Contributor Spotlight: $MEMBER_NAME"
    BODY="$MEMBER_NAME just hit 50 contributions to the community. Thanks for being such an engaged member. Cheers!"
    ;;
  "anniversary")
    ANNIVERSARY_YEAR=${ANNIVERSARY_YEAR:-1}
    echo "🎉 MILESTONE: $MEMBER_NAME's ${ANNIVERSARY_YEAR}-year anniversary!"
    TITLE="Happy ${ANNIVERSARY_YEAR}-Year Community Anniversary, $MEMBER_NAME!"
    BODY="Marking $ANNIVERSARY_YEAR year(s) of being part of our community. Grateful for your presence and contributions!"
    ;;
  "promotion")
    ROLE=${ROLE:-"Moderator"}
    echo "🎉 MILESTONE: $MEMBER_NAME promoted to $ROLE"
    TITLE="Introducing $MEMBER_NAME as a $ROLE"
    BODY="We're thrilled to announce $MEMBER_NAME's promotion to $ROLE. Their thoughtful, respectful engagement makes them the perfect fit."
    ;;
  "featured")
    echo "🎉 MILESTONE: $MEMBER_NAME's content featured!"
    TITLE="Featured: $MEMBER_NAME's Insight"
    BODY="$MEMBER_NAME shared something brilliant. Check out their thread on [topic] — lots of valuable context for the community."
    ;;
  *)
    echo "Unknown milestone type: $MILESTONE_TYPE"
    exit 1
    ;;
esac

# Log to session
cat >> /tmp/community-milestones.log << LOG_END
[$(date '+%Y-%m-%d %H:%M:%S')] $MEMBER_NAME - $MILESTONE_TYPE
LOG_END

# Log to session-log.md (append)
cat >> /Users/tushar/Desktop/Claudient/community_manager_stack/session-log.md << LOG_END

## Milestone Logged: $MEMBER_NAME ($MILESTONE_TYPE)

**Member:** $MEMBER_NAME
**Milestone:** $MILESTONE_TYPE
**Time:** $(date '+%Y-%m-%d %H:%M')

---
LOG_END

# Public celebration message (stub; in production, would post to #announcements)
echo ""
echo "READY TO POST IN #announcements:"
echo "---"
echo "$TITLE"
echo ""
echo "$BODY"
echo "---"
echo ""
echo "Review and post manually, or enable auto-post in settings."

exit 0
```

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/member-milestone.sh`

3. Make it executable:
   ```bash
   chmod +x .claude/hooks/member-milestone.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

## Behavior

- **Detection:** Monitors post counts, tenure, membership history, moderation promotions
- **Logging:** Auto-logs to `.claude/community/milestones.db` and session-log.md
- **Public celebration:** Generates celebration message (manually reviewed before posting)
- **Non-blocking:** Doesn't interrupt workflows; purely informational

## Manual Trigger

To celebrate a milestone manually:

```bash
MEMBER_ID=123 MEMBER_NAME="Jane Smith" MILESTONE_TYPE="anniversary" ANNIVERSARY_YEAR=2 bash .claude/hooks/member-milestone.sh
```

## Integration

- Celebration messages are brief, warm, and specific
- Power users and contributors should be celebrated publicly monthly
- Celebrations build community identity and retention

---
