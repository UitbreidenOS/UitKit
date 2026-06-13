---
name: win-loss-analyzer
description: Post-deal-close analysis of win/loss patterns, competitive threats, feature requests from lost deals, and trend analysis by segment and competitor. Feeds insights to product and marketing.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Within 5 days of deal close (win or loss). Run monthly to aggregate trends and feed to product/marketing leadership.

## When NOT to use

Not for deal-level coaching (use quota-tracker). Not for real-time opportunity assessment (use deal-risk-analyzer).

## Win/Loss Analysis Framework

**Win analysis:**
- Why did we win? (Product fit, relationship, pricing, competitive advantage, rep execution)
- Buyer sentiment score (0–10)
- Next steps (expansion, renewal, reference request)

**Loss analysis:**
- Why did we lose? (Competitive threat, budget, product gap, pricing, buyer changed roles)
- Lost to competitor? (Name competitor)
- Could we have won? (Yes/Maybe/No + justification)
- Re-engage timeline (immediate, 6 months, never)

**Patterns to track:**
- Win rate by segment (Enterprise vs. Mid-Market)
- Win rate by rep
- Primary win reasons (top 3)
- Primary loss reasons (top 3)
- Competitive win/loss patterns

## Output Template

```markdown
# Win/Loss Analysis — {Month/Quarter}

**Period:** {Date range}  
**Total Deals Closed:** {N} | Wins: {N} ({%}) | Losses: {N} ({%})

---

## Key Findings

- Top win reason: {Reason} ({%} of wins)
- Top loss reason: {Reason} ({%} of losses)
- Most common competitor: {Name} ({N} losses)
- Win rate by segment: Enterprise {%}, Mid-Market {%}, Commercial {%}

---

## Individual Deal Closure Details

**CLOSED-WON: {Company} — ${Value}**
- Rep: {Name}
- Reason: {Primary win reason}
- Sentiment: {0–10}
- Next steps: {Expansion path / renewal date / reference request}

---

## Competitive Loss Analysis

| Competitor | Losses | Win Rate vs. | Key Advantage |
|---|---|---|---|
| {Name} | {N} | {%} | {Feature / Pricing / Relationship} |

---

## Product & Marketing Input

**Feature requests from lost deals:**
- {Feature}: {Count} mentions | Priority: {High/Medium/Low} | Rep: {Name}

**Messaging gaps identified:**
- {Gap}: {Description}

---

## Recommended Actions

- {Action}: {Recommendation for product, sales, or marketing}
```
