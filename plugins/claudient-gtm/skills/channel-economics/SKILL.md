---
name: "channel-economics"
description: "Channel economics: compute fully-loaded cost-to-serve per channel, channel ROI (cash, LTV-adjusted, marginal), optimal direct vs. partner channel mix, and diminishing-returns analysis"
---

# Channel Economics Skill

## When to activate
- Quarterly channel review: you have a mix of direct and partner-led pipeline but don't know which channel is actually profitable after all costs are loaded
- Evaluating whether to hire a channel manager (does the channel economics justify the headcount?)
- Board asking for partner program ROI ("we spent $X on MDF — what did we get?")
- Planning a new region and deciding direct-first vs. partner-first
- M&A due diligence on a target claiming high-margin partner channel

## When NOT to use
- Designing partner tiers, joint GTM, revshare structure — use the partnerships skill
- SDR-to-AE routing and pipeline process — use the revenue-operations skill
- Strategic CRO decisions (comp plans, hiring VP Sales) — use the cro-advisor
- Per-deal discount approval — use the deal-desk skill

## Instructions

### Cost-to-serve analysis

```
Calculate fully-loaded cost-to-serve for [channel].

Channel: [direct / reseller / referral partner / SI / marketplace]
Data period: [last 12 months]
Deal metrics: [deal count, total ARR, average ACV, sales cycle days]
Retention: [NRR%, GRR%]

Cost categories to load (most teams miss 3-4 of these):

DIRECT COSTS:
- Sales headcount (AE salary + OTE commission / deals closed = cost per deal)
- SDR attribution (cost per qualified opportunity × opportunities needed per close)
- Solutions engineer time (hours per deal × hourly loaded cost)
- Legal / procurement cycle cost (contract review hours × rate)

CHANNEL-SPECIFIC COSTS:
- Partner discount off list price (%) — this is a direct revenue reduction
- Market Development Funds (MDF) paid to partner
- Channel manager headcount (salary / number of partners managed)
- Partner enablement and certification cost (one-time + annual per partner)
- Channel conflict resolution time (estimated hours per quarter)

POST-SALE COSTS:
- Customer success load (is the partner channel higher or lower effort post-sale?)
- Support ticket volume differential (partner-sourced customers often need more support)
- Churn rate differential (partner vs. direct — key driver of LTV difference)

OVERHEAD ALLOCATION:
- Marketing allocation (what % of demand gen budget supports this channel?)
- Operations / RevOps time on channel reporting and management

Output: cost-to-serve per deal AND per dollar of ARR, for each channel.
```

### Channel ROI under three lenses

```
Compute channel ROI using three lenses.

Channel data: [paste cost-to-serve results + retention data]

LENS 1 — CASH ROI (Year 1):
Formula: (Year 1 gross margin from channel) / (Year 1 fully-loaded CAC)
Verdict threshold: < 1.0x = cash-negative in year 1 → question viability
Strong: > 2.5x cash ROI in year 1

LENS 2 — LTV-ADJUSTED ROI:
Formula: (LTV per customer from channel) / (Fully-loaded CAC)
LTV = ACV × Gross Margin % × (1 / Annual Churn Rate)
Note: if partner channel has higher churn, LTV is lower even at same ACV
Verdict threshold: < 3x LTV/CAC = the channel is underperforming
Strong: > 5x LTV/CAC

LENS 3 — MARGINAL ROI:
"What does the next $100K invested in this channel return?"
This accounts for diminishing returns — early partner deals are high-ROI,
later ones require more enablement, higher MDF, lower close rates.

Diminishing returns inflection: the point where marginal ROI drops below 1x
(adding more investment destroys value at the margin)

Per-channel verdict:
DOUBLE-DOWN: LTV/CAC > 5x AND marginal ROI still positive → scale aggressively
MAINTAIN: LTV/CAC 3-5x, marginal ROI positive → sustain current investment
DEFUND: LTV/CAC 1.5-3x, marginal ROI near 1x → hold flat, don't grow
EXIT: LTV/CAC < 1.5x, cash-negative → wind down (partners aren't profitable)

Produce the ROI verdict for each channel in my mix.
```

### Channel mix optimisation

```
Recommend optimal channel mix for [company].

Current mix: [X% direct, Y% partner-led, Z% marketplace]
Constraints:
  - Minimum direct floor: [X% — can't go below for enterprise relationships]
  - Maximum partner concentration: [X% — don't want over-reliance on any channel]
  - Total sales capacity: [X AEs + X channel managers]
  - Revenue target: $[X] ARR next year

Input: channel ROI data from above analysis

Optimisation approach:
1. Start with the highest LTV/CAC channel — allocate capacity here first
2. Respect the minimum direct floor (enterprise customers often require direct touch)
3. Don't exceed partner concentration ceiling (pipeline dependency risk)
4. Apply diminishing returns — don't over-allocate beyond the inflection point
5. Check: does the resulting mix hit the revenue target with the available capacity?

Output:
- Recommended mix: X% direct, Y% partner, Z% marketplace
- Expected ARR at this mix: $[X]
- Sensitivity: if partner close rate drops 10%, ARR impact: ($[X])
- One-year plan: what investments are needed to reach the optimal mix?

HUMAN DECISION REQUIRED: This is a recommendation. The CRO and commercial leadership make the final call on channel strategy.
```

## Example

**User:** We're $8M ARR, 60% direct / 40% partner-led. Direct ACV is $45K, partner ACV is $28K. Direct NRR 118%, partner NRR 97%. Are we over-indexed on partner?

**Claude's analysis:**

Yes — the NRR differential is the tell. Let me load the numbers:

**Direct channel:**
- ACV: $45K, NRR 118% → LTV = $45K × 0.75GM × (1/0.08 churn) ≈ $422K
- If CAC is ~$15K (typical for inside sales at this ACV): LTV/CAC = **28x** — excellent

**Partner channel:**
- ACV: $28K, NRR 97% → that 3% annual revenue erosion means you're losing money on existing customers before expansion
- GRR is probably 85-88% (customers leaving). LTV = $28K × 0.72GM × (1/0.14 churn) ≈ $144K
- After loading partner discount (typically 20-25% of ACV), MDF, and channel manager: effective CAC is ~$12K
- LTV/CAC = **12x** — looks OK on cash, but...

**The problem:** Partner NRR of 97% means your partner channel is a net revenue drain on the existing base. Every $1M of partner ARR is losing $30K/year from churn/downgrades before you add any new business. At $3.2M of partner ARR, that's ~$96K/year evaporating.

**Verdict:**
- Direct: DOUBLE-DOWN — 28x LTV/CAC with strong expansion. Your best channel.
- Partner: DEFUND current motion, investigate why NRR is so different from direct.

Before cutting partner, diagnose: is the NRR gap due to (a) wrong ICP from partners, (b) less CS coverage, or (c) partner customers using less of the product? Fix the root cause before exiting the channel.

---
