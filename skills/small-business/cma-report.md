---
name: cma-report
description: "Comparative Market Analysis report: comps selection, value range, pricing strategy, seller presentation narrative — turn raw sold data into a persuasive CMA package"
updated: 2026-06-13
---

# CMA Report Skill

## When to activate
- Preparing a listing presentation and need a polished CMA narrative to accompany your comp data
- A seller is challenging your pricing and you need a data-backed rebuttal
- You have raw sold/active/expired comp data and need it structured into a professional report
- Running an annual market review for past clients to generate referrals
- Comparing a buyer's offer price against recent comparable sales

## When NOT to use
- Formal property appraisals — only licensed appraisers produce legally defensible valuations
- Commercial or multi-family analysis — different valuation methodology (income approach)
- Properties with no comparable sales within 12 months (rural, ultra-luxury, unique) — disclose limitation
- Automated Valuation Models (AVMs) — if you need an AVM, use your MLS or Zillow's tool directly

## Instructions

### Core CMA prompt

```
Generate a Comparative Market Analysis report for a seller listing presentation.

SUBJECT PROPERTY:
- Address: [city/neighborhood, no street number required]
- Property type: [SFR / condo / townhome]
- Beds/Baths: [X] bed / [X.X] bath
- Square footage: [X] sq ft (heated/cooled)
- Lot size: [X] sq ft or acres
- Year built: [YYYY]
- Condition/updates: [describe recent updates — kitchen remodel 2022, new HVAC 2023, etc.]
- Special features: [pool, view, ADU, solar, premium lot, etc.]
- Seller's timeline: [X weeks/months to close]

COMPARABLE SALES (provide 3-6 recent sales):
For each comp:
- Comp [N]: [beds/baths], [sq ft], [address or cross-streets], sold $[X], list $[X], [X] days on market, sold [date], [notable features or differences]

ACTIVE LISTINGS (current competition — 2-3):
- Active [N]: [beds/baths], [sq ft], listed at $[X], [X] days on market, [notes]

EXPIRED/WITHDRAWN (if any — shows pricing ceiling):
- Expired [N]: [sq ft], listed at $[X], [X] days on market, expired [date]

LOCAL MARKET CONTEXT:
- Current absorption rate: [X] months of inventory
- Average days on market: [X] days
- List-to-sale price ratio: [X]%
- Recent market trend: [appreciating / stable / correcting]

ADJUSTMENTS YOU'VE MADE:
[Describe any adjustments: Comp 2 lacks pool (-$15K), Comp 3 has older kitchen (+$8K adjustment to bring in line, etc.]

My recommended price range: $[X] - $[X]

Generate:
1. Market conditions summary (2-3 sentences, present-tense)
2. Comparable sales analysis with adjustment rationale
3. Active competition analysis (what the seller is competing against)
4. Pricing strategy recommendation with tiered approach
5. Seller presentation narrative (3-4 paragraphs, professional tone, designed to be read aloud or left as takeaway)
6. Price reduction triggers (if the property doesn't sell — when and by how much)
```

---

### Comps selection framework

Use this to guide Claude in choosing the right comps:

```
Help me select the best comparable sales from this list for a CMA.

Subject property: [X] bed / [X] bath, [X] sq ft, [neighborhood], sold price target ~$[X]

Candidate comps (paste your list):
[comp 1 details]
[comp 2 details]
...

Rank these comps by their suitability as comparables. Score each on:
1. Location proximity (same subdivision / neighborhood: 10pts, within 1 mile: 7pts, 1-3 miles: 3pts)
2. Size similarity (within 10% of subject sq ft: 10pts, 11-20%: 5pts, >20%: 1pt)
3. Recency (sold within 90 days: 10pts, 91-180 days: 6pts, 181-365 days: 3pts)
4. Similarity of features (same bed/bath count: 5pts each, garage match: 5pts)
5. Market conditions (same market cycle / no distressed sale: 10pts)

Select the 3 best comps and explain why each was chosen.
Flag any adjustments needed before using these in the CMA.
```

---

### Adjustment analysis prompt

```
Help me calculate and document adjustments for these comparable sales.

Subject property: [facts]
Comp [N]: [facts]

For each difference between the comp and subject, estimate an adjustment:

Common adjustment categories:
- Location premium/discount: [$/sq ft or lump sum]
- Size adjustment: [$/sq ft for sq footage difference]
- Condition/update adjustment: [lump sum — new kitchen = $X, new HVAC = $X]
- Garage: [$/space]
- Pool: [$X in this market]
- Lot premium (view, corner, cul-de-sac): [$X]
- Age adjustment: [$/year if significant age gap]

For each comp:
1. Raw sale price: $[X]
2. List all adjustments with dollar amounts and rationale
3. Adjusted value: $[X]
4. Implied subject property value: $[X]

Final value range from adjusted comps: $[low] - $[high]
Recommended list price: $[X] (rationale: [which comp is most similar, market direction])
```

---

### Pricing strategy tiers

```
Generate a tiered pricing strategy for a seller who wants to maximise price but also needs to sell within [X] weeks.

Adjusted value range from CMA: $[X] - $[X]
Seller's minimum acceptable price: $[X]
Current absorption rate: [X] months
Average DOM in this price range: [X] days

Generate three pricing scenarios:

TIER 1 — AGGRESSIVE (top of range):
Price: $[X]
Risk: [% chance of sitting; estimated DOM]
Strategy: [what needs to go right for this to work]
Price reduction trigger: [if X DOM without offer, reduce to $Y]

TIER 2 — MARKET (middle of range):
Price: $[X]
Risk: [estimated DOM at this price]
Strategy: [how to position at this price vs. competition]
Price reduction trigger: [if needed]

TIER 3 — MOVE-IT (below market):
Price: $[X]
Expected outcome: [multiple offers / fast close probability]
When to use this tier: [seller timeline, financial pressure, property condition]

Recommendation: [which tier and why, given seller's situation]
```

---

### Seller presentation narrative template

```
Write a seller presentation CMA narrative. Professional tone, designed to be read aloud or left with the seller. No jargon.

Market context: [paste your market summary]
Comp analysis results: [paste adjusted values]
Recommended price: $[X] - $[X]
Seller's situation: [timeline, motivation — brief]

Structure:
Paragraph 1: What the market is doing right now (buyer demand, inventory, price trends)
Paragraph 2: What comparable sales tell us — walk through 2-3 most relevant comps with adjustments
Paragraph 3: What you are competing against (active listings)
Paragraph 4: My recommendation — the price, the strategy, and what happens if it doesn't sell in [X] days

Keep it under 400 words. End with a question that invites the seller to discuss: "Does this pricing align with your timeline?"
```

---

### Objection response prompts

```
Draft a response to a seller who says: "Zillow says my house is worth $[X more than your CMA]."

My CMA recommended price: $[X]
Zillow estimate: $[X]
Difference: $[X] ([X]%)

Key facts on my side:
- [Which comps support my price]
- [Any condition factors Zillow doesn't see]
- [Recent neighborhood sales Zillow may have missed]

Write a response that:
1. Acknowledges the seller's concern without dismissing it
2. Explains how AVMs work and their known limitations
3. Points to the specific comparable sales that support your price
4. Proposes a path forward (e.g., "Let's price at $[X] for 2 weeks — if we get strong traffic, we hold; if not, we have data to act on")
Keep it under 200 words. Professional, not defensive.
```

---

### Output format — full CMA report

```markdown
# Comparative Market Analysis
**[Property Address or "Seller Presentation"]**
**Prepared by:** [Agent Name] | **Date:** [Date]

---

## Market Conditions Summary
[2-3 sentences on current buyer demand, inventory, and price trend in this submarket]

---

## Comparable Sales Analysis

| Comp | Address | Sold Price | Adj. Price | Sq Ft | $/sq ft | Sold Date | Key Differences |
|---|---|---|---|---|---|---|---|
| Comp 1 | [area] | $[X] | $[X] | [X] | $[X] | [date] | [notes] |
| Comp 2 | [area] | $[X] | $[X] | [X] | $[X] | [date] | [notes] |
| Comp 3 | [area] | $[X] | $[X] | [X] | $[X] | [date] | [notes] |

**Adjusted value range from sales:** $[X] – $[X]

---

## Active Competition

| Listing | List Price | Sq Ft | DOM | Notable |
|---|---|---|---|---|
| Active 1 | $[X] | [X] | [X] | [notes] |
| Active 2 | $[X] | [X] | [X] | [notes] |

**Takeaway:** [Are actives overpriced? Will they reduce? Are they direct competition?]

---

## Pricing Recommendation

**Recommended list price:** $[X] – $[X]
**Rationale:** [Which comp drove this and why]

**Price reduction trigger:** If no offer in [X] days, reduce to $[X].

---

## Seller Presentation Narrative

[3-4 paragraph narrative ready to read aloud or leave with seller]

---

## Price Reduction Schedule (if needed)

- **Day 1–14:** Hold at $[X] — gather showing feedback
- **Day 15:** If fewer than [X] showings and no offer, reduce to $[X]
- **Day 30:** If no offer, reassess market conditions and discuss $[X]
```

## Example

**User:** I have a 4-bed/2-bath, 1,950 sq ft ranch in suburban Denver, updated kitchen 2024, no pool. Seller wants $625K. Three comps: 4/2 1,900 sq ft sold $598K (90 days ago), 4/2.5 2,100 sq ft sold $641K (45 days ago, has extra bath), 3/2 1,800 sq ft sold $572K (60 days ago). Market absorption is 2.1 months, avg DOM 22 days, list-to-sale 99.2%.

**Expected output:** A full CMA report with the comp table showing adjustments (+$8K for the larger bath on Comp 2, -$10K for smaller size on Comp 3), adjusted value range of $608K–$628K, recommended list price of $618K, a 3-paragraph seller narrative explaining the balanced market and how the updated kitchen justifies the upper end of range, and a price reduction trigger at Day 14 / $599K if no offers.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
