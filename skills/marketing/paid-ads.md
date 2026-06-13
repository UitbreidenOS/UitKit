---
name: paid-ads
description: "Paid advertising strategy and execution: Google Ads, Meta Ads, LinkedIn Ads — campaign structure, targeting, bidding, creative testing, ROAS optimisation"
updated: 2026-06-13
---

# Paid Ads Skill

## When to activate
- Setting up a new Google Ads, Meta Ads, or LinkedIn Ads campaign from scratch
- Diagnosing poor ROAS or high CPA on existing campaigns
- Structuring ad groups and campaigns for better Quality Score
- Writing ad copy and creative briefs for paid campaigns
- Designing A/B tests for ads (creative, audience, landing page)
- Deciding budget allocation across channels

## When NOT to use
- Organic SEO — use the seo-audit skill
- Email marketing — use the email-sequence skill
- Content strategy — use the content-strategy skill
- Compliance-sensitive industries (healthcare, finance) — ad policies vary; verify manually

## Instructions

### Campaign structure audit

```
Audit my paid ad campaign structure and suggest improvements.

Channel: [Google Ads / Meta Ads / LinkedIn Ads / TikTok Ads]
Current structure: [describe — campaigns, ad groups, targeting]
Monthly budget: $[X]
Current ROAS / CPA: [X]
Goal: [awareness / leads / purchases / signups]
Average order value / lead value: $[X]

Audit:
1. Campaign structure — are campaigns organised by objective, not just product?
2. Ad group granularity — are targeting and creatives tightly matched?
3. Keyword match types (Google) — too broad? too narrow?
4. Audience layering — are you excluding existing customers from acquisition campaigns?
5. Bidding strategy — does it match your goal and data volume?
6. Budget allocation — are high-performing campaigns budget-capped?

Produce: list of issues ranked by revenue impact + specific fixes.
```

### Google Ads campaign setup

```
Set up a Google Ads campaign for [product/service].

Goal: [leads / ecommerce sales / app installs]
Target keywords: [list or describe intent]
Budget: $[X]/day
Geo: [countries / cities]
Competitor names to consider: [list]

Design:
1. Campaign type: [Search / Performance Max / Shopping / Display]
2. Campaign structure:
   - Campaign 1: [Brand] — exact match on own brand terms
   - Campaign 2: [Non-brand intent] — target keywords by theme
   - Campaign 3: [Competitor] — competitor terms (if budget allows)

3. Ad group structure per campaign:
   - Tight ad groups: 5-15 keywords per group, same intent
   - Separate ad groups for different buying stages (problem-aware vs. solution-aware)

4. Bidding strategy:
   - < 30 conversions/month: Maximise Conversions (learning phase)
   - 30-100 conversions/month: Target CPA
   - > 100 conversions/month: Target ROAS

5. Ad copy (3 headlines × 30 chars, 2 descriptions × 90 chars):
   - Headline 1: [match search intent]
   - Headline 2: [key differentiator]
   - Headline 3: [CTA or offer]

6. Extensions: Sitelinks, Callouts, Structured Snippets minimum

Write 3 ad variations for A/B testing.
```

### Meta Ads targeting strategy

```
Design targeting strategy for Meta Ads (Facebook/Instagram).

Product: [describe]
Target customer: [demographics, interests, behaviours]
Budget: $[X]/day
Objective: [awareness / traffic / leads / purchases]
Average customer LTV: $[X]

Build targeting layers:
1. Core audiences:
   - Interest targeting: [specific interests, not broad categories]
   - Behaviour targeting: [purchase behaviours, device use]
   - Demographics: [age, gender, location, job title if relevant]

2. Custom audiences (upload/build):
   - Website visitors (pixel — 30d, 60d, 180d windows)
   - Customer list upload (email match)
   - Video viewers (watched 50%+)

3. Lookalike audiences:
   - LAL 1%: based on [purchasers / high-LTV customers / email list]
   - LAL 2-3%: broader expansion

4. Exclusions:
   - Existing customers (exclude from acquisition)
   - Recent converters (exclude for 30 days post-purchase)

Campaign funnel:
- TOF: Broad/interest → video or image creative → drive awareness
- MOF: Website visitors + engagers → testimonial creative → drive consideration
- BOF: Cart abandoners + product viewers → offer/urgency → drive conversion

Budget split for $[X]/day: [allocate across funnel]
```

### Ad creative brief

```
Write a creative brief for [channel] ad campaign.

Product: [describe]
Target audience: [who they are, what they care about]
Key message: [the single thing the ad must communicate]
Offer: [discount, trial, guarantee, etc.]
CTA: [what you want them to do]
Format: [static image / video / carousel / story]
Tone: [professional / playful / urgent / aspirational]

Brief sections:
1. Hook (first 3 seconds / above the fold):
   - Pattern interrupt: [what stops the scroll?]
   - Immediate value signal: [why should they keep watching?]

2. Body (problem → solution → proof):
   - Problem statement (make them feel understood)
   - Solution positioning (how you solve it differently)
   - Social proof (number, testimonial, or result)

3. CTA (clear action):
   - Primary CTA: [button text + landing page]
   - Urgency element: [if applicable]

Write 3 creative concepts in this format. Rate each for estimated CTR potential.
```

### ROAS optimisation

```
Diagnose poor ROAS and create an optimisation plan.

Channel: [Google / Meta / LinkedIn]
Current ROAS: [X] (target: [X])
Monthly spend: $[X]
Conversion tracking: [working / broken / partial]
Funnel stage with biggest drop: [awareness → click / click → landing page / landing page → conversion]

Diagnose in order:
1. Tracking: is conversion data accurate? (pixel fires, view-through vs. click-through, attribution window)
2. Audience: is targeting too broad (low intent) or too narrow (limited reach)?
3. Creative: CTR vs. industry benchmark? Low CTR = creative problem
4. Landing page: conversion rate vs. benchmark? Low CVR = page problem
5. Offer: is there a compelling reason to act now?
6. Bidding: is the algorithm optimising toward the right signal?

Produce: ranked list of hypotheses + experiments to run, each with expected impact and effort.
```

## Example

**User:** My Google Ads campaigns for a SaaS tool ($99/mo) have a CPA of $480 — way too high. Spend: $8,000/month. What's wrong?

**Claude's diagnosis:**

At $99/month, you need CPA < $200 to have a viable payback period (assuming 6-month average subscription). At $480 CPA you're burning ~2.4x what you can afford.

**Most likely culprits in order:**

1. **Conversion tracking issue** (check first) — confirm your goal is "trial signup" not "page view." If you're counting any event, CPA looks inflated but isn't real.

2. **Budget allocated to broad match** — broad match on SaaS keywords attracts irrelevant searches. Run Search Term Report for last 30 days. If >30% of clicks are irrelevant, switch to phrase/exact and add negative keywords.

3. **No landing page specificity** — if you're sending all ad groups to your homepage, conversion rate will be 1-2% instead of 5-8%. Create dedicated landing pages per campaign.

4. **Missing brand campaign** — brand terms convert at 10-20x lower CPA than non-brand. If you're not bidding on your brand name, competitors are capturing your warmest traffic.

**Quick wins this week:**
- Pull Search Term Report, add 20+ negatives
- Create a dedicated trial signup landing page for your top 2 ad groups
- Add brand campaign with exact match — budget $500/month

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
