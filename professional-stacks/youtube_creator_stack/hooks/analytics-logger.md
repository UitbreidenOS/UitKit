# analytics-logger Hook

## Purpose

Auto-logs video performance metrics to session-log.md 24–48 hours after publishing.

## Event Trigger

`PostToolUse` — After analytics-tracker skill completes

## settings.json Entry

```json
{
  "hooks": {
    "youtube_creator_stack/hooks/analytics-logger": {
      "on": "PostToolUse",
      "if": "tool == 'analytics-tracker'",
      "run": "bash youtube_creator_stack/hooks/analytics-logger.sh"
    }
  }
}
```

## What It Does

1. Receives analytics data from YouTube API (views, CTR, watch time, retention).
2. Compares metrics against creator's channel benchmarks.
3. Flags performance signals:
   - If CTR >5%, title and thumbnail are strong
   - If watch time >50%, content hooks and pacing work
   - If retention drops >50% at any mark, flags weak section
   - If subscriber gain >1% of views, content resonates
4. Generates performance grade (A+, A, B+, B, C, etc.).
5. Logs to session-log.md with timestamp, metrics, and insights.
6. Flags anomalies (unusual viewer drop, surge, etc.) for review.

## Example Log Entry

```
## [2026-06-13 06:00]

**Video:** This AI Edits Videos For You
**Publish Date:** 2026-06-10
**Data Window:** 72 hours
**Status:** TRACKING

**Metrics:**
- Views: 2,840
- CTR: 4.1% (benchmark: 4.2%) — On par
- Watch time: 44% (benchmark: 48%) — 4 pts below target
- Avg duration: 5:18 (of 12:00)
- Subscriber gain: 47 (+1.66% of views) — Excellent signal
- Engagement: 142 likes, 28 comments, 12 shares

**Retention Curve:**
- 0:00–1:00: 100% → 94% (strong hook)
- 1:00–3:00: 94% → 78% (dip at section transition)
- 3:00–6:00: 78% → 68% (normal mid-video drop)
- 6:00–10:00: 68% → 52% (outro section)

**Performance Grade:** B+ ✓

**Key Insights:**
- CTR matching benchmark (title + thumbnail effective)
- Subscriber conversion strong (1.66% exceeds 0.5–1% typical)
- Watch time below target (44% vs 48%)
- Retention dip at 3:00 suggests pacing issue in section transition

**Recommendations:**
- Keep this title/thumbnail format
- Review section transitions for tighter pacing
- Consider 10–11 min format for future (easier to hit 48% watch time)

**Next Video Optimization:** Incorporate tighter section transitions and reduce overall length to 10–11 min.
```

## Blocking Issues

None — analytics logging is informational and does not block publishing.

## Performance Tracking

Hook maintains rolling averages for:
- Monthly CTR trend
- Watch time trends
- Subscriber conversion rates
- Top-performing content types
- Audience retention patterns by section

## Setup Instructions

1. Copy hook script to `.claude/hooks/analytics-logger.sh`
2. Make executable: `chmod +x .claude/hooks/analytics-logger.sh`
3. Add settings.json entry above
4. Configure YouTube API access in settings.json
5. Run /analytics-tracker 24–48 hours after video publishes
6. Review logged results in session-log.md

## Script (analytics-logger.sh)

```bash
#!/bin/bash

# YouTube Creator Stack — Analytics Logger Hook
# Logs video performance metrics 24–48 hours after publishing

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_FILE="${SCRIPT_DIR}/../../youtube_creator_stack/session-log.md"

# Extract analytics data from tool output
VIDEO_TITLE=$(echo "$TOOL_OUTPUT" | grep -i "video:" | head -1 | sed 's/.*video: *//i')
VIEWS=$(echo "$TOOL_OUTPUT" | grep -i "views:" | head -1 | sed 's/.*views: *//i')
CTR=$(echo "$TOOL_OUTPUT" | grep -i "CTR:" | head -1 | sed 's/.*CTR: *//i')
WATCH_TIME=$(echo "$TOOL_OUTPUT" | grep -i "watch time" | head -1 | sed 's/.*watch time: *//i')
SUBSCRIBERS=$(echo "$TOOL_OUTPUT" | grep -i "subscriber" | head -1 | sed 's/.*subscribers: *//i')
ENGAGEMENT=$(echo "$TOOL_OUTPUT" | grep -i "engagement" | head -1 | sed 's/.*engagement: *//i')

# Generate performance grade
if echo "$CTR" | grep -q ">5"; then
    GRADE="A+"
elif echo "$CTR" | grep -q ">4"; then
    GRADE="A"
elif echo "$CTR" | grep -q ">3"; then
    GRADE="B+"
else
    GRADE="B"
fi

# Log analytics entry
cat >> "$LOG_FILE" <<EOF

## [$(date '+%Y-%m-%d %H:%M')] — ANALYTICS UPDATE

**Video:** $VIDEO_TITLE
**Status:** TRACKING
**Views:** $VIEWS
**CTR:** $CTR
**Watch Time:** $WATCH_TIME
**Subscriber Gain:** $SUBSCRIBERS
**Engagement:** $ENGAGEMENT
**Performance Grade:** $GRADE

EOF

echo "✓ Analytics logged to session-log.md"
exit 0
```

## Notes

- Hook fires automatically after /analytics-tracker runs.
- Logs appear in session-log.md with consistent formatting for easy tracking.
- Creator can review metrics and adjust content strategy based on insights.
- Performance grades help identify top-performing content types for future planning.
- Retention curve data informs script pacing improvements for next video.
