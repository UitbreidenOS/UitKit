---
name: opportunity-identifier
description: Identifies 5–7 high-impact opportunities for a B2B client using MECE (Mutually Exclusive, Collectively Exhaustive) analysis across business functions, customer segments, and revenue levers. Ranks each opportunity by impact vs. implementation effort with 2-3 sentence rationale. Output: 1–2 page opportunity list with ROI estimates and success metrics.
allowed-tools: Read, Write
effort: medium
---

# Opportunity Identifier

## When to activate
After completing the client analyzer diagnostic. Use this to bridge from problem identification to strategic roadmap design. Ensures opportunities are comprehensive, prioritized, and directly address client pain points.

## When NOT to use
Skip if client has explicitly requested a fixed scope (e.g., "we already know what we need; just help us implement it"). Skip if engagement is deal structuring only (not strategy design).

## Instructions

### Step 1: MECE Decomposition

Break opportunities into 3 independent lenses (mutually exclusive, collectively exhaustive):

**A. By Revenue Lever**
- New revenue: new products, new segments, new geographies
- Upsell/cross-sell: expand within existing customer base
- Cost reduction: operational efficiency, COGS reduction, SG&A reduction
- Margin expansion: pricing optimization, product mix shift, packaging changes

**B. By Business Function**
- Sales & Go-to-Market: sales process, channel strategy, pricing
- Product & Engineering: feature prioritization, technical debt, platform expansion
- Marketing & Demand: brand positioning, demand generation, market education
- Operations & Finance: finance, HR, systems, reporting
- Customer Success: retention, expansion, satisfaction

**C. By Customer Segment**
- Existing core: expand depth with best customers
- Adjacent segments: adjacent industries, adjacent roles within accounts
- New geographies: international expansion, new regions
- New customer types: new personas, verticals, company sizes

### Step 2: Prioritize Across Dimensions

For each MECE bucket identified, score on 2×2 matrix:

```
         HIGH IMPACT
             |
Easy   |     | Hard
(High  |     | (High
Effort)| [A] | Effort)
   |   |     |
LOW ----+--------- HIGH
  IMPACT      IMPACT
   |   |     |
Slow  |[B]  | Slow
(Low  |     |(Low
Effort|     | Effort)
```

**Quadrant A (High Impact, Easy):** Quick wins; execute first quarter
**Quadrant B (Low Impact, Easy):** Filler; include if resources available
**[Unlabeled] (High Impact, Hard):** Strategic bets; 2–3 major initiatives
**[Unlabeled] (Low Impact, Hard):** Avoid unless external pressure

### Step 3: Develop Opportunity Statement for Top 5–7

For each opportunity:
1. **Opportunity Name:** [Specific, action-oriented]
2. **Business Case:** [Quantified impact: revenue, cost, efficiency]
3. **Implementation:** [Effort level: 1–3 months, resources, key blockers]
4. **Success Metrics:** [How you'll know it worked]
5. **Risk/Mitigation:** [Key risks and how to mitigate]

### Step 4: Validate Against Client Pain Points

Each opportunity should directly address one or more identified pain points. Map explicitly.

## Output Format

```markdown
# [Company Name] — Opportunity Identification

**Date:** YYYY-MM-DD  
**Engagement:** Strategic Advisory  
**Based on:** [Client Profile dated YYYY-MM-DD]

---

## Opportunity Framework

Opportunities are organized by revenue lever and ranked by impact vs. implementation effort.

### Tier 1: Quick Wins (Implement Q1)

#### Opportunity 1: [Name]
- **Revenue Lever:** [New revenue / Upsell / Cost reduction / Margin expansion]
- **Business Case:** [Quantified impact, e.g., "+$2M ARR in 6 months" or "reduce CAC by 25%"]
- **Effort Level:** Low (1–2 months, X people)
- **Key Steps:** [3–4 actions]
- **Success Metrics:**
  - [Metric 1]: [Target]
  - [Metric 2]: [Target]
- **Risks:** [1–2 key risks and mitigation]
- **Owner:** [Function: Sales / Product / Marketing / Ops]
- **Pain Point Addressed:** [Which pain point from diagnostic]

#### Opportunity 2: [Name]
[Same structure]

#### Opportunity 3: [Name]
[Same structure]

---

### Tier 2: Strategic Bets (Implement Q2–Q3)

#### Opportunity 4: [Name]
- **Revenue Lever:** [...]
- **Business Case:** [Quantified impact]
- **Effort Level:** High (3–6 months, X people + external expertise)
- **Key Steps:** [4–5 major workstreams]
- **Success Metrics:** [3–4 metrics]
- **Risks:** [Major blockers and mitigation plan]
- **Owner:** [C-level sponsor required]
- **Pain Point Addressed:** [...]

#### Opportunity 5: [Name]
[Same structure]

---

### Tier 3: Future (Review Q4)

#### Opportunity 6: [Name]
[Brief: opportunity, effort, business case]

#### Opportunity 7: [Name]
[Brief: opportunity, effort, business case]

---

## Summary: Impact vs. Effort Matrix

| Opportunity | Impact | Effort | Timeline |
|---|---|---|---|
| [Opp 1] | $X revenue / [X% margin] | 1–2 mo | Q1 |
| [Opp 2] | $X revenue / [X% margin] | 1–2 mo | Q1 |
| [Opp 3] | $X revenue / [X% margin] | 2–3 mo | Q1–Q2 |
| [Opp 4] | $X revenue / [X% margin] | 3–6 mo | Q2–Q3 |
| [Opp 5] | $X revenue / [X% margin] | 6+ mo | Q3–Q4 |
| [Opp 6] | $X revenue / [X% margin] | [Effort] | [Timeline] |

**Total Year 1 Impact (Tier 1 + Tier 2):** [Aggregate revenue or cost savings]

---

## Next Steps

1. Client review and prioritization
2. Assign owners and sponsors for Tier 1 opportunities
3. Build detailed 90-day roadmap (phase 1 in design-strategy)
```

## Example

**Company:** SaaS GTM Platform, $20M ARR, 85 employees, 35% growth slowing to 28%

**Opportunities Identified:**

1. **Sales Efficiency Program** (Tier 1)
   - Reduce sales cycle by 25% through playbook standardization
   - Impact: +$3M ARR with existing team
   - Effort: 6 weeks, sales enablement + ops
   - Success metrics: Cycle time, quota attainment, rep productivity

2. **Expand into SMB Segment** (Tier 1)
   - Launch self-serve / freemium product line
   - Impact: +$2M ARR in year 1, new growth engine
   - Effort: 8 weeks, product + marketing
   - Success metrics: Freemium-to-paid conversion, CAC, LTV

3. **Margin Expansion: Packaging Shift** (Tier 1)
   - Shift from seats to usage-based pricing
   - Impact: +15% ACV, +5% gross margin
   - Effort: 4 weeks, pricing + product
   - Success metrics: ACV, gross margin, churn impact

4. **International Expansion (EU)** (Tier 2)
   - Hire local sales team, localize product
   - Impact: +$5M ARR in year 2
   - Effort: 16 weeks, hiring + localization + compliance
   - Success metrics: Regional revenue, CAC, brand awareness

5. **Product-Led Growth Transformation** (Tier 2)
   - Inbound + community strategy; organic growth engine
   - Impact: +40% organic pipeline by year 2
   - Effort: 20 weeks, product + marketing + community
   - Success metrics: Organic % of pipeline, CAC, brand awareness

