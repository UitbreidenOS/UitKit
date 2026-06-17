# /analyze-topic

## Summary

Run content pillar matrix on a topic and return GO/CAUTION/NO-GO viability score before investing research and scripting time.

## Syntax

```
/analyze-topic [topic] [keywords] [niche]
```

## Parameters

- `topic` (required): Topic or video idea (e.g., "AI video editing automation")
- `keywords` (optional): Comma-separated keywords (e.g., "AI editing, automation, content creators")
- `niche` (optional): Creator niche (e.g., "productivity tools, AI education")

## What It Does

1. Runs Exa search for trending data (last 90 days).
2. Scores topic against Content Pillar Matrix:
   - Trend (trending up = 25 pts, stable = 15 pts, declining = 5 pts)
   - Audience demand (100K+ searches = 25 pts, 10K–100K = 15 pts, <10K = 5 pts)
   - Competitive gap (<10 competitors = 25 pts, 10–50 = 15 pts, >50 = 5 pts)
   - Creator expertise (expert authority = 25 pts, knowledgeable = 15 pts, learning = 5 pts)
3. Returns viability score (0–100) and decision: GO (≥60), CAUTION (40–59), NO-GO (<40).
4. Logs result to session-log.md.

## Output

- **Viability score** (0–100)
- **Decision** (GO / CAUTION / NO-GO)
- **Trend momentum** (% growth over last 30 days)
- **Search volume** (monthly searches)
- **Competitor count** (top 10 ranking competitors)
- **Creator expertise fit** (expert / knowledgeable / learning)
- **Recommendation** (next action: research, validate, skip)

## Example

```
/analyze-topic "AI video editing tools" "AI editing, automation, video" "AI tools & productivity"

TOPIC VIABILITY ANALYSIS

Topic: AI video editing tools
Viability Score: 85 — GO

Dimensional Breakdown:
- Trend: +65% (25 pts) ↗ Strong momentum
- Demand: 45K monthly searches (15 pts) — Solid audience
- Competition: 8 major players (25 pts) — Uncrowded
- Expertise: Advanced creator with 3-yr automation background (25 pts) — Clear authority

Recommendation: PROCEED to research and script generation.
Next action: Run /script-draft after competitor analysis.
```

## When to Use

- Before every video idea (gates investment)
- When validating trending topics
- When assessing niche pivot ideas

## When NOT to Use

- On proven pillar topics (use /trend-scout instead)
- Without keywords or research direction
