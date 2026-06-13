---
description: Deep-dive analysis of 3–5 competitors in your market. Maps positioning, messaging, recent launches, customer reviews, and brand perception. Returns competitive landscape matrix with white-space opportunities for positioning.
---

# /analyze-competitors

## What This Does

Executes a complete competitive intelligence pipeline. Takes your company name and a list of 3–5 key competitors. Researches each competitor's positioning, messaging pillars, recent product launches, customer reviews, and brand perception. Returns a competitive landscape matrix showing positioning gaps, customer sentiment, and messaging opportunities. Output informs your campaign strategy and messaging pillars.

## Steps Claude Follows

1. **Collect inputs**: Ask for your company name, 3–5 competitors to analyze, and any specific focus areas (pricing, messaging, product, brand perception).
2. **Run competitor-analyst skill**: Deep-dive on each competitor across positioning, messaging, recent moves, customer sentiment, GTM strategy.
3. **Create positioning matrix**: Map competitors on 2–3 key dimensions (e.g., developer-first vs. enterprise-first, cost vs. features).
4. **Identify white-space**: What positioning gaps exist? What customer segments are underserved? What messaging angles are unclaimed?
5. **Assess customer sentiment**: Aggregate G2, Capterra, Reddit, Twitter sentiment for each competitor. What do customers praise? What do they complain about?
6. **Present findings**: Display competitive landscape, positioning matrix, white-space analysis, and recommended messaging angles.
7. **Log to session**: Auto-log competitive analysis to session-log.md with findings and recommended next steps.

## Output Format

```
# Competitive Landscape Analysis

**Analysis Date:** [ISO date]
**Your Company:** [Your company name]
**Competitive Set:** [Competitor 1, 2, 3]

---

## Positioning Matrix

[2x2 or 3x3 matrix showing where each competitor sits]

---

## Competitor Profiles

### [Competitor 1]
- Positioning: [One sentence]
- Messaging pillars: [List 3–4]
- Recent moves: [Product launches, funding, hires, messaging shifts]
- Customer sentiment: [Score, praise, complaints]
- GTM strategy: [Sales-led, community-first, etc.]
- Strengths: [What they do well]
- Weaknesses: [Gaps or complaints]

### [Competitor 2]
[Same structure]

---

## White-Space Analysis

**Positioning gaps:** [What no competitor owns]
**Customer segment gaps:** [Underserved ICP]
**Messaging gaps:** [Customer problems competitors don't address]

---

## Recommended Messaging Angles

1. [Angle 1: what we can own]
2. [Angle 2: different framing]
3. [Angle 3: new segment/use case]

---

**Next Step:** Present findings above. Human reviews and selects positioning to pursue in next campaign.
```

## Example Run

```
You: /analyze-competitors

Claude: I'll run a deep competitive analysis. Please provide:
- Your company name?
- 3–5 key competitors to analyze?
- Any focus areas (pricing, product, messaging)?

You: Acme, CompetitorA, CompetitorB, CompetitorC, focus on developer-first positioning and pricing transparency

Claude: Researching Acme's competitive landscape...

---

# Competitive Landscape Analysis

**Analysis Date:** 2026-06-12
**Your Company:** Acme
**Competitive Set:** CompetitorA, CompetitorB, CompetitorC

---

## Positioning Matrix

| | Developer-First | Enterprise-First |
|---|---|---|
| **Price-Transparent** | [Acme] | [CompetitorB] |
| **Price-Premium** | [CompetitorC] | [CompetitorA] |

---

## Competitor Profiles

### CompetitorA
- Positioning: "The enterprise platform"
- Messaging: Compliance, custom support, no-code integration
- Recent: Series D ($50M), APAC expansion, Goldman Sachs case study
- Sentiment: 4.1/5 on G2 — praised for security, complained about slow onboarding and rigid pricing
- GTM: Sales-led, enterprise conferences
- Strengths: Enterprise credibility, compliance posture
- Weaknesses: Developer-hostile, inflexible, expensive

### CompetitorB
- Positioning: "The transparent alternative"
- Messaging: Simple pricing, API-first, community
- Recent: Series B ($20M), new pricing page (just launched)
- Sentiment: 4.4/5 on G2 — loved by developers, but lacks enterprise features
- GTM: Community-first, freemium model
- Strengths: Developer love, transparent pricing
- Weaknesses: Limited security, no enterprise support, small company

### CompetitorC
- Positioning: "The all-in-one solution"
- Messaging: All features in one platform, no integrations needed
- Recent: Series C ($75M), product expansion
- Sentiment: 4.3/5 on G2 — praised for completeness, criticized for complexity and learning curve
- GTM: Partner-led, resellers
- Strengths: Feature-rich, well-funded
- Weaknesses: Bloated, hard to use, expensive

---

## White-Space Analysis

**Positioning gaps:**
- "Enterprise-grade without the enterprise overhead" — all competitors either feel startup-ish or enterprise-bloated
- "Security + developer experience" — CompetitorA has security but developers hate it; CompetitorC and CompetitorB lack security

**Customer segment gaps:**
- Mid-market tech (50–500 engineers) feels caught between developer tools and enterprise platforms

**Messaging gaps:**
- "Transparent security" — no competitor emphasizes both security AND pricing clarity
- "Grow without rip-and-replace" — companies want to scale without replacing infrastructure

---

## Recommended Messaging Angles

1. **"Enterprise-grade security at startup velocity"** — Own the middle market CompetitorA underserves with overhead and CompetitorB underserves with missing compliance.

2. **"Transparent pricing that scales with you"** — Lean into CompetitorB's strength (pricing clarity) and CompetitorA's weakness (surprise enterprise taxes).

3. **"Developer experience that scales to enterprise"** — No competitor owns the narrative of scaling from startup developer joy to enterprise security without friction.

---

**Next Step:** Review competitive landscape above. Approve messaging angles or request adjustments. Selected angles will inform next campaign planning.

Session logged to session-log.md.
```
