---
description: Score a feature list using the RICE matrix. Return a ranked backlog with RICE scores, recommended quarters, dependencies, and business justification for each feature.
---

# /prioritize-roadmap

## What This Does
Runs the roadmap-prioritizer skill to score features and build a data-driven product roadmap.

## Steps Claude Follows
1. Ask for the feature list: feature names, descriptions, and any available estimates on reach, impact, effort.
2. For each feature, score using RICE:
   - Reach: how many users/month affected?
   - Impact: how much will behavior change?
   - Confidence: how sure are you in the estimate?
   - Effort: time to ship in weeks?
3. Calculate RICE Score = (Reach × Impact × Confidence) ÷ Effort.
4. Rank by RICE score, highest first.
5. Assign features to quarters based on capacity and dependencies.
6. Flag blockers and risks.
7. Return the prioritized roadmap with quarterly buckets.

## Output Format

```
# Product Roadmap — [Quarter/Year]

## This Quarter (Build)
[Features ranked by RICE with scores, effort, and start dates]

## Next Quarter (Planned)
[Higher-RICE features committed for next quarter]

## Backlog (Defer/Kill)
[Lower-RICE features not scheduled]

---

## Capacity Summary
Current quarter: [X weeks available] | Features scheduled: [Y weeks] | Utilization: [X%]

## Critical Path
[Feature A] (blocking) → [Feature B] → [Feature C]

## Key Risks
[Dependencies, resource constraints, market risks]
```

## Notes
- Run this quarterly to re-prioritize based on new data and changing business context.
- RICE is a tool, not a formula — if a feature is contractually obligated (customer, legal), it goes to the top regardless of score.
