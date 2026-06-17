# /content-batch

## Summary

Plan and rank video ideas for the month. Returns prioritized queue with viability scores, keywords, and next actions per video.

## Syntax

```
/content-batch [count] [pillar] [timeframe]
```

## Parameters

- `count` (optional, default 5): Number of video ideas to generate (range 3–10)
- `pillar` (optional): Content pillar to focus on (e.g., "AI tools", "automation", "tutorials")
- `timeframe` (optional, default "30 days"): Planning horizon ("7 days", "30 days", "90 days")

## What It Does

1. Runs /trend-scout to surface emerging topics in creator's niche.
2. Runs /analyze-topic on each trending topic (0–100 viability score).
3. Ranks videos by viability score (GO first, CAUTION second, NO-GO last).
4. For each GO-scored video, extracts keywords and recommends next action.
5. Returns batch plan with publishing timeline and resource estimates.
6. Logs to session-log.md.

## Output

- **Ranked queue** (1–10 video ideas by viability score)
- **Viability score per video** (0–100 + GO/CAUTION/NO-GO)
- **Primary keywords per video**
- **Competitor count per video**
- **Estimated production time** (script draft time)
- **Publishing timeline** (recommended upload dates)
- **Next action per video** (run /script-draft, validate demand, skip)

## Example

```
/content-batch 5 "AI tools" "30 days"

CONTENT BATCH PLAN — Next 30 Days

Video #1: "This AI Edits Videos For You"
- Viability: 85 (GO) ↗ Strong trend, solid demand, 8 competitors
- Keywords: AI editing, automation, video tools
- Time estimate: 2 hours (script + thumbnails)
- Action: Ready for /script-draft
- Publish date: 2026-06-17

Video #2: "Prompt Engineering for Customer Service"
- Viability: 78 (GO) ↗ Trending +65%, 28K searches, 7 competitors
- Keywords: prompt engineering, customer support, AI
- Time estimate: 2.5 hours
- Action: Ready for /script-draft
- Publish date: 2026-06-19

Video #3: "AI PDF Analyzers Compared (2026)"
- Viability: 70 (GO) ↗ Trending +52%, 18K searches, 12 competitors
- Keywords: AI tools, document analysis, automation
- Time estimate: 2 hours
- Action: Ready for /script-draft
- Publish date: 2026-06-21

Video #4: "Open-Source LLMs for Business"
- Viability: 65 (CAUTION) ⚠ Trending +48%, low demand (9K searches), emerging
- Keywords: LLM, open-source, AI deployment
- Time estimate: 2.5 hours
- Action: Validate audience demand before full research
- Publish date: 2026-06-26 (conditional)

Video #5: "AI Email Automation Workflow"
- Viability: 52 (CAUTION) ⚠ Trending +31%, 22K searches, 18 major competitors
- Keywords: email automation, AI, productivity
- Time estimate: 2 hours
- Action: Check competitor gap; consider alternative angle
- Publish date: 2026-07-03 (hold pending analysis)

SUMMARY:
- 3 GO videos (ready for scripting immediately)
- 2 CAUTION videos (validate demand before committing)
- 0 NO-GO videos
- Total production estimate: 10.5 hours
- Recommended publish frequency: 1 video every 2–3 days

NEXT STEPS:
1. Run /script-draft for videos #1–3
2. Validate audience demand for videos #4–5
3. Re-run /content-batch in 2 weeks for next planning cycle
```

## When to Use

- Monthly content planning
- Identifying growth opportunities
- Batch scripting sessions

## When NOT to Use

- For single video validation (use /analyze-topic instead)
- Without clear content pillars (clarify niche first)
