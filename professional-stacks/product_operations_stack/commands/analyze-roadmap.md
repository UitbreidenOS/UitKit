---
description: Runs roadmap prioritizer to analyze a feature backlog. Takes customer data, metrics, and strategic goals as input. Returns prioritized ranked backlog with GO/MEDIUM/LOW recommendations and rationale.
---

# /analyze-roadmap

## What This Does

Applies the roadmap-prioritizer skill to your feature backlog. Analyzes each item against a weighted scoring matrix (customer impact, revenue potential, effort, strategic alignment, technical debt). Returns a ranked list with scores and clear recommendations for which items to schedule first.

## Steps Claude Follows

1. **Ask for:** Feature backlog (list or document), customer feedback data, revenue signals, team velocity, strategic OKRs/goals
2. **Run roadmap-prioritizer** — Score each feature against 5 dimensions; apply decision rules
3. **Rank by priority score** — TOP TIER (≥80) first, then HIGH, MEDIUM, LOW
4. **Build summary table** — Show all items ranked with score, tier, effort estimate, and blocking dependencies
5. **Highlight top 3-5** — Flag which items should be scheduled first and why
6. **Flag dependencies** — Show which features block others; identify critical path
7. **Return for review** — Display ranked backlog with recommendation to review and confirm before committing

## Output Format

### Roadmap Analysis Summary
```
# Backlog Prioritization Results

**Analysis Date:** [Today]
**Backlog Size:** [X items]
**Strategic Alignment:** [How well does backlog align with stated OKRs?]

## Top Tier (Must-Have, ≥80 pts)
[List features ranked by score]

## High Tier (Should-Have, 60–79 pts)
[List features ranked by score]

## Medium Tier (Nice-to-Have, 40–59 pts)
[List features ranked by score]

## Low Tier (<40 pts)
[List features ranked by score]

## Recommended Q[X] Roadmap
[Based on capacity and prioritization, what should go in next sprint/quarter?]

## Risks & Dependencies
- [Feature X blocks Feature Y — must sequence accordingly]
- [Technical debt reducing velocity — may impact capacity estimates]
```

## Next Actions

- **Confirm scores** — Review reasoning for top 5 items; adjust if criteria don't match your strategy
- **Validate capacity** — Check if recommended scope fits your team's bandwidth
- **Sequence features** — Group dependent features; plan rollout order
- **Communicate roadmap** — Share ranked list + rationale with stakeholders

## Tips

- Bring customer feedback data (counts, quotes, dollar impact) to make prioritization decisions stick
- Update scores quarterly as customer context and business priorities shift
- Use this as the *starting point* for roadmap discussions; stakeholder input may adjust final rankings

## Example Use Case

> "We have 25 feature requests and 3 engineering weeks of capacity for next quarter. Which should we prioritize?"

Claude runs `/analyze-roadmap` with your backlog, customer data, and OKRs. Returns a ranked list showing:
- Top 5 items that are worth doing first
- Why each is ranked where it is
- What depends on what
- Estimated effort and capacity planning implications

---
