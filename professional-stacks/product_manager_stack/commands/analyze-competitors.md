---
description: Research 3–5 competitors solving the same problem. Produce a feature gap matrix, competitive positioning analysis, and differentiation summary.
---

# /analyze-competitors

## What This Does
Runs the competitive-mapper skill to research direct competitors and produce a feature comparison matrix plus positioning recommendations.

## Steps Claude Follows
1. Ask for the problem space or feature category to analyze.
2. Identify 3–5 direct competitors solving this problem.
3. For each competitor: research their product, features, pricing, and positioning.
4. Build a feature comparison matrix: your product vs. each competitor.
5. Identify gaps: features they have you don't, and vice versa.
6. Summarize your differentiation in 2–3 sentences.
7. Return the analysis with threat assessment and feature gap opportunities.

## Output Format

```
# Competitive Analysis — [Problem Space]

[Feature comparison matrix]
[Competitor snapshot]
[Your differentiation]
[Threat assessment]
[Feature gap opportunities]

---

## Recommendations
- [Competitive gap to fill]
- [Feature opportunity to build]
- [Positioning angle to emphasize]
```

## Notes
- Run this before finalizing a major feature PRD — competitive research informs your positioning and helps justify build vs. buy decisions.
