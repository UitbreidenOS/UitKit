---
name: competitive-mapper
description: Research top 3–5 competitors; produce a feature gap analysis matrix showing what they have, what you have, and where you differentiate. Includes: company snapshot (founding, funding, size), feature comparison (5–8 key features), positioning summary, and 2–3 differentiation angles.
allowed-tools: WebSearch, WebFetch, Read, Write
effort: medium
---

# Competitive Mapper

## When to activate
Before finalizing a major feature PRD, or quarterly when refreshing competitive intelligence. Use this to validate that your positioning is distinct and that your feature set is competitive.

## When NOT to use
Do not use for minor features or bug fixes. Do use for any feature where you're claiming to be "different" or "better."

## Instructions

1. Identify top 3–5 direct competitors (tools solving the same problem). For each:
2. Gather firmographics: founding year, funding stage, employee count, website, pricing model.
3. Research their product: what are their top 5–8 features? How do they position themselves?
4. Build a feature comparison matrix: your product vs. each competitor, 5–8 features per row.
5. Score each product on each feature: ✓ (native), ◐ (partial), ✗ (absent).
6. Identify gaps: features competitors have that you don't, and vice versa.
7. Summarize your differentiation in 2–3 sentences: what are you doing that competitors can't or don't?
8. Rank competitors by threat level: who is the strongest? Who is you most similar to?

## Output Format

```
# Competitive Analysis — [Feature/Product]

## Competitor Snapshot

| Company | Founded | Funding | Size | Positioning |
|---|---|---|---|---|
| [Comp 1] | [year] | [stage] | [employees] | [tagline] |
| [Comp 2] | [year] | [stage] | [employees] | [tagline] |

## Feature Comparison Matrix

| Feature | Your Product | Comp 1 | Comp 2 | Comp 3 |
|---|---|---|---|---|
| [Feature 1] | ✓ | ✓ | ◐ | ✗ |
| [Feature 2] | ✓ | ✗ | ✓ | ✓ |
| [Feature 3] | ◐ | ✓ | ✓ | ✗ |

## Your Differentiation
[2–3 sentences on what you're doing uniquely well and why it matters.]

## Threat Assessment
**Highest threat:** [Competitor] — most feature-complete, strongest sales/brand
**Most similar:** [Competitor] — closest positioning; key differentiator is [X]
**Weakest threat:** [Competitor] — reason

## Feature Gaps (Your Opportunities)
[List 1–2 features competitors have that you could add for 2x competitive advantage.]

## Feature Gaps (Competitor Opportunities)
[List 1–2 features you have that competitors could copy; mitigations noted in PRD risks.]
```

---
