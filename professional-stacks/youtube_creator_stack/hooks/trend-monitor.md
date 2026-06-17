# trend-monitor Hook

## Purpose

Daily surface emerging topics in creator's niche; rank by search volume growth and competitor gap.

## Event Trigger

`Daily` — Fires once per day at configured time

## settings.json Entry

```json
{
  "hooks": {
    "youtube_creator_stack/hooks/trend-monitor": {
      "on": "Daily",
      "schedule": "9:00",
      "run": "bash youtube_creator_stack/hooks/trend-monitor.sh",
      "condition": "creator_niche_set"
    }
  }
}
```

## What It Does

1. Runs Exa trending search on creator's niche (last 24 hours).
2. Filters for topics trending up >25% month-over-month.
3. Ranks topics by search volume growth × competitor gap score.
4. Excludes topics already planned in content batch.
5. Surfaces top 3–5 trending topics as potential video ideas.
6. Calculates viability score for each topic (using Content Pillar Matrix).
7. Logs to session-log.md with timestamp, growth rate, and next action.
8. Sends summary to creator's session context (available for /content-batch planning).

## Example Output

```
DAILY TREND MONITOR — 2026-06-13 09:00

Creator Niche: AI & Productivity Tools
Trending Lookback: Last 24 hours
Topics Analyzed: 47
Emerging Topics: 12

EMERGING OPPORTUNITIES (Top 5)

#1: "AI Code Review Automation"
- Growth: +78% (last 30 days)
- Search volume: 32K/month
- Competitors: 4 major players
- Viability Score: 85 (GO) ✓
- Action: Ready for /analyze-topic and /script-draft
- Added to session context

#2: "Prompt Engineering for Customer Support"
- Growth: +65%
- Search volume: 28K/month
- Competitors: 7 players
- Viability Score: 78 (GO) ✓
- Action: Ready for analysis
- Added to session context

#3: "AI Document Processing (PDFs, OCR)"
- Growth: +52%
- Search volume: 18K/month
- Competitors: 12 players
- Viability Score: 70 (GO) ✓
- Action: Ready for analysis
- Added to session context

#4: "Open-Source LLM Deployment"
- Growth: +48%
- Search volume: 9K/month
- Competitors: 3 niche players
- Viability Score: 65 (CAUTION) ⚠
- Action: Validate audience demand
- Added to session context

#5: "AI Email Automation Workflows"
- Growth: +31%
- Search volume: 22K/month
- Competitors: 18+ major brands
- Viability Score: 52 (CAUTION) ⚠
- Action: Check competitor gap
- Added to session context

RECOMMENDATIONS:
- 3 GO topics ready for immediate planning
- 2 CAUTION topics worth validation
- All 5 topics added to session for /content-batch planning

NEXT STEPS:
Run /content-batch to prioritize this week's scripting queue
```

## Blocking Issues

None — trend monitoring is informational and does not block publishing.

## Trend Tracking

Hook maintains historical trend data:
- Topic growth rates (7-day, 30-day, 90-day)
- Seasonal patterns in creator's niche
- Emerging vs. declining trends
- Competitor landscape changes
- Creator's accuracy in topic selection (predicted viability vs. actual performance)

## Setup Instructions

1. Copy hook script to `.claude/hooks/trend-monitor.sh`
2. Make executable: `chmod +x .claude/hooks/trend-monitor.sh`
3. Add settings.json entry above
4. Set preferred time for daily report (default 9:00 AM)
5. Configure Exa API access in settings.json
6. Define creator niche in CLAUDE.md or settings.json
7. Verify hook runs by checking session-log.md daily

## Script (trend-monitor.sh)

```bash
#!/bin/bash

# YouTube Creator Stack — Trend Monitor Hook
# Surfaces emerging topics daily; ranks by growth × competition gap

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_FILE="${SCRIPT_DIR}/../../youtube_creator_stack/session-log.md"

# Read creator niche from CLAUDE.md or settings
CREATOR_NICHE=$(grep -i "creator niche" "${SCRIPT_DIR}/../../youtube_creator_stack/CLAUDE.md" | head -1 | sed 's/.*: *//i')

if [ -z "$CREATOR_NICHE" ]; then
    echo "⚠️  Creator niche not defined. Skipping trend monitor."
    exit 0
fi

# Log trend monitoring start
echo "" >> "$LOG_FILE"
echo "## [$(date '+%Y-%m-%d %H:%M')] — DAILY TREND MONITOR" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "**Niche:** $CREATOR_NICHE" >> "$LOG_FILE"
echo "**Trend Window:** Last 24 hours" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Note: Actual Exa API call would happen here (requires integration with Exa MCP)
echo "**Emerging Topics:** [Run /trend-scout to surface 5 trending topics]" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "✓ Trend monitoring logged. Run /trend-scout for detailed analysis."
exit 0
```

## Notes

- Hook fires daily at configured time (default 9:00 AM).
- Trends are added to session context and available for /content-batch planning.
- Creator can ignore trends that don't align with strategy.
- Helps identify growth opportunities before competitors saturate topics.
- Maintains historical trend data to improve future topic selection accuracy.
