# content-scheduler Hook

## Purpose

Immutable session-end record; surfaces pending video publishes and scheduled uploads in summary form.

## Event Trigger

`Stop` — Fires when Claude session ends or "/stop" is explicitly called

## settings.json Entry

```json
{
  "hooks": {
    "youtube_creator_stack/hooks/content-scheduler": {
      "on": "Stop",
      "run": "bash youtube_creator_stack/hooks/content-scheduler.sh"
    }
  }
}
```

## What It Does

1. Scans session-log.md for all videos in DRAFT, APPROVED, or PENDING states.
2. Extracts publishing dates, creator approval status, and required actions.
3. Generates immutable session-end summary with:
   - Pending videos (count, titles, approval status)
   - Scheduled publish dates
   - Videos awaiting creator feedback
   - Session production summary (scripts drafted, videos approved, etc.)
4. Appends to session-log.md with session end marker.
5. Displays summary to creator before session exits.
6. Prevents accidental abandonment of drafted scripts or approvals pending.

## Example Output

```
## [2026-06-13 18:45] — SESSION END SUMMARY

**Session Duration:** 8.5 hours
**Creator:** [Name]
**Niche:** AI & Productivity Tools

PRODUCTION SUMMARY:
- Topics analyzed: 8
- Scripts drafted: 3
- Scripts approved: 2
- Videos published: 0
- Videos tracking: 1 (from previous session)

PENDING ACTIONS (⏳ Awaiting Creator Approval):
1. "This AI Edits Videos For You"
   - Status: DRAFT
   - Drafted: 2026-06-13 10:30
   - Scheduled publish: 2026-06-17
   - Action required: Creator review + approval
   - Files: Script (12 min), 3 thumbnails, metadata

2. "Prompt Engineering for Customer Support"
   - Status: DRAFT
   - Drafted: 2026-06-13 14:15
   - Scheduled publish: 2026-06-19
   - Action required: Creator review + approval
   - Files: Script (11 min), 3 thumbnails, metadata

APPROVED PENDING PUBLISH (✓ Ready to upload):
1. "AI PDF Analyzers Compared (2026)"
   - Status: APPROVED
   - Approved by: Creator
   - Approval time: 2026-06-13 16:20
   - Scheduled publish: 2026-06-21
   - Action required: Creator uploads to YouTube when ready
   - Files: Final script, approved thumbnails, metadata

VIDEOS IN PRODUCTION:
- Currently tracking 1 video published in previous session
- Analytics logging active (data collection continues)

COMPLETED THIS SESSION:
✓ Analyzed 8 potential topics
✓ Ran competitor analysis for top 3
✓ Generated 3 SEO-optimized scripts
✓ Created 9 thumbnail concepts (3 per video)
✓ Generated metadata (titles, descriptions, tags)
✓ Conducted SEO validation (all passed)

NEXT SESSION TODO:
1. Creator reviews and approves draft scripts 1–2
2. Creator approves thumbnail concepts
3. Creator uploads approved video to YouTube
4. Check analytics on previously published video (2–3 days post-publish)
5. Run /content-batch to plan next week's content

STORED ARTIFACTS:
- Scripts and thumbnails saved in session context
- Approval checkpoints logged to session-log.md
- Metadata bundles ready for YouTube upload

---

Session ended: 2026-06-13 18:45
Next session recommended: 2026-06-14 (for creator approvals + publishing)
```

## Blocking Issues

None — scheduler is informational and does not block session exit.

## Important Notes

- Session-end summary prevents loss of drafted work.
- Pending actions are listed with approval status and next steps.
- Creator can reference this summary to resume work in next session.
- Immutable record provides audit trail of session productivity.
- Scheduled publish dates help creator plan upload calendar.

## Setup Instructions

1. Copy hook script to `.claude/hooks/content-scheduler.sh`
2. Make executable: `chmod +x .claude/hooks/content-scheduler.sh`
3. Add settings.json entry above
4. Hook fires automatically when session ends
5. Review session-end summary before exiting Claude Code

## Script (content-scheduler.sh)

```bash
#!/bin/bash

# YouTube Creator Stack — Content Scheduler Hook
# Surfaces pending videos and session summary on session exit

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_FILE="${SCRIPT_DIR}/../../youtube_creator_stack/session-log.md"

# Count videos in each status
DRAFT_COUNT=$(grep -c "^.*Status.*DRAFT" "$LOG_FILE" 2>/dev/null || echo "0")
APPROVED_COUNT=$(grep -c "^.*Status.*APPROVED" "$LOG_FILE" 2>/dev/null || echo "0")
PUBLISHED_COUNT=$(grep -c "^.*Status.*PUBLISHED" "$LOG_FILE" 2>/dev/null || echo "0")

# Append session end marker
echo "" >> "$LOG_FILE"
echo "## [$(date '+%Y-%m-%d %H:%M')] — SESSION END" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "**Session Summary:**" >> "$LOG_FILE"
echo "- Scripts drafted: $DRAFT_COUNT" >> "$LOG_FILE"
echo "- Scripts approved: $APPROVED_COUNT" >> "$LOG_FILE"
echo "- Videos published: $PUBLISHED_COUNT" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

if [ "$DRAFT_COUNT" -gt 0 ]; then
    echo "⏳ **ACTION REQUIRED:** $DRAFT_COUNT scripts awaiting creator approval" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
fi

if [ "$APPROVED_COUNT" -gt 0 ]; then
    echo "✓ **READY TO PUBLISH:** $APPROVED_COUNT approved scripts ready for upload" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
fi

echo "---" >> "$LOG_FILE"
echo "Session artifacts preserved. Run /content-batch in next session to continue planning." >> "$LOG_FILE"

echo "✓ Session summary logged to session-log.md"
exit 0
```

## Notes

- Hook fires automatically on session end (no manual trigger needed).
- Summary is immutable and part of permanent session audit trail.
- Helps creator track progress across multiple sessions.
- Prevents loss of in-progress work due to session exits.
- Scheduled publish dates help creator align with content calendar.
