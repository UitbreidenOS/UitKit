---
name: "partnerships"
description: "Partnership strategy: partner tier classification (referral/reseller/OEM/strategic), 90-day joint GTM plans, revenue share modelling, and kill criteria for underperforming partnerships"
---

# Partnerships Skill

## When to activate
- Evaluating whether to sign a new partner and at what tier
- Designing a 90-day joint GTM plan with a partner
- Modelling revenue share economics against direct-sale margin
- Assessing if an existing partnership is worth continuing
- Building a partner programme tier structure from scratch

## When NOT to use
- Enterprise deal structuring — use the deal-desk skill
- Customer referral programmes (end-user referrals) — use the referral-program skill
- M&A or acquisition — different process entirely
- Technical integrations — that's a product/engineering decision

## Instructions

### Partner tier classification

```
Classify and evaluate [partner name] for a partnership.

Partner: [name, company type, size]
They've approached asking for: [referral agreement / reseller / OEM / strategic alliance / white-label]
What they claim to bring: [customer relationships / distribution / brand / technology / geography]

Evaluate on these dimensions:

INDEPENDENT DEMAND (most important signal):
Does this partner generate demand independently of us, or are they hunting for a preferential-terms discount?
- HIGH: They can name 5+ specific customer accounts in their pipeline right now who need our product
- MEDIUM: They have a customer base with plausible overlap but no specific accounts named
- LOW: They're asking for our pricing list before naming any customers

PARTNER TIERS (classify based on evidence):

REFERRAL (lowest commitment):
- They refer leads; we close and fulfil
- No exclusivity, no revenue guarantee
- Commission: 10-20% of first-year ARR on successful close
- Right for: any partner with occasional leads but no dedicated sales motion

RESELLER (they sell, we fulfil):
- They sell under their own paper or yours; they manage the customer relationship
- Requires: dedicated sales headcount, product training, certification
- Margin: 20-35% discount off list (they mark up and keep the difference)
- Right for: VAR/SI with existing customer base in your ICP

OEM (your product, their brand):
- Your product embedded in their product or sold under their brand
- Requires: licensing agreement, technical integration, SLA commitments
- Pricing: per-seat or revenue share; typically 40-60% of your direct price
- Right for: platform vendors who need your capability as a feature

STRATEGIC ALLIANCE (co-build, co-sell):
- Joint product, joint marketing, joint sales motion
- Requires: executive commitment from both sides, dedicated PM and SE
- Economics: negotiated case-by-case; typically co-investment, no fixed margin
- Right for: companies where the partnership creates net-new category value

KILL SIGNAL (do not partner):
- They want pricing before naming customers
- They want exclusivity with no revenue guarantee
- They're a direct competitor using the partnership to learn about you
- They have < 5 reachable sales people to carry the joint message

Classify my partner and recommend the tier and terms.
```

### 90-day joint GTM plan

```
Design a 90-day joint GTM plan with [partner].

Partner: [name, tier]
Our product: [describe]
Their strength: [what they bring — customer base, brand, geography, technical expertise]
Joint goal: $[X ARR] in [X] qualified opportunities in 90 days

90-day GTM plan:

MONTH 1 — ENABLE (days 1-30):
□ Partner kickoff: align on ICP, joint value proposition, qualification criteria
□ Product training: their sales team certified to demo our product (30-min demo minimum)
□ Sales collateral handed over: 1-pager, battle card, slide deck with partner branding
□ Joint target account list: 10-20 named accounts both sides agree to pursue
□ Communication cadence: weekly 30-min sync between partner success and their lead

MONTH 2 — ACTIVATE (days 31-60):
□ First joint customer meetings: 3-5 meetings with named accounts from the list
□ Co-selling motion: our AE + their SE on first calls (not their SE alone)
□ Feedback loop: what's resonating, what's not — adjust messaging together
□ Pipeline review: joint CRM update on all 10-20 target accounts
□ First win target: 1 qualified opportunity in late-stage evaluation

MONTH 3 — PROVE (days 61-90):
□ First revenue event: close 1 deal (or get to verbal agreement)
□ Case study: begin documenting the first joint customer story
□ Tier review: did they hit the activity commitments? Stay at tier / promote / demote
□ Renewal / expansion of agreement based on results

SUCCESS METRICS at day 90:
- [X] joint customer meetings conducted
- [X] qualified opportunities created
- [X ARR] in pipeline
- [1] deal closed (minimum bar for continuation)

KILL CRITERIA (if any of these, unwind the partnership):
- < 3 joint customer meetings in 90 days (they're not selling)
- No named accounts from their side (they had no real pipeline)
- Their team hasn't completed product training (no commitment)
- Revenue from partner channel < 25% of projection at day 60

Generate the GTM plan for my specific partner and goal.
```

### Revenue share modelling

```
Model the revenue share economics for [partnership].

Deal type: [referral / reseller / OEM]
Our direct-sale margin: [X%]
Proposed partner margin/commission: [X%]
Average deal size: $[X ARR]

Revenue share calculation:

REFERRAL COMMISSION MODEL:
Direct sale: $[X ARR] × [gross margin]% = $[X] contribution
Referral commission: $[X ARR] × [X]% = $[X] paid to partner
Net contribution: $[X - commission]
Net margin after referral: [X]%

Break-even question: at what commission rate does a referred deal become worse than a direct deal after accounting for reduced CAC?

Example: $50K ARR deal, 70% gross margin, 15% referral commission
Direct: $50K × 70% = $35K contribution, minus CAC ($15K) = $20K net
Referral: $50K × 70% = $35K, minus commission ($7.5K), minus reduced CAC ($5K for partner-sourced) = $22.5K net
→ Referral is better at 15% commission in this example (lower CAC offsets the commission)

RESELLER MARGIN MODEL:
Reseller discount: [X]% off list
Our effective price: $[X] × (1 - [X]%) = $[X]
Our gross margin at reseller price: [X]%
Question: is margin at reseller price still above our CAC payback threshold?

OEM PRICING MODEL:
OEM price: [X]% of direct list
Our COGS at OEM price: [X]%
Net OEM margin: [X]%
Volume required to equal direct revenue: direct_deal_size / OEM_price_per_unit

Minimum acceptable margin floor: [X]% — don't sign OEM deals below this

Break-even analysis: at what volume does an OEM deal out-perform a direct sale on contribution?

Model the economics for my specific partnership structure.
```

### Partner programme design

```
Design a partner programme for [company].

Company: [name, stage, product]
Goal: [% of ARR from partner channel in 12 months]
Current direct sales model: [inside sales / self-serve / enterprise]
Partner types we want: [VAR / SI / ISV / technology partner / referral agents]

Partner programme structure:

TIER 1 — REGISTERED (low bar, high volume):
Requirements: complete 1 online training module, sign programme agreement
Benefits: access to partner portal, marketing materials, 10% referral commission
Target: 50-100 registered partners in year 1
Goal: create a lead-generation motion with minimal management overhead

TIER 2 — AUTHORISED (active sellers):
Requirements: 2 certified sales reps, 3 customer references, $[X ARR] pipeline commitment per quarter
Benefits: 20% referral or 25% reseller discount, joint marketing budget, dedicated partner success manager
Target: 10-20 authorised partners
Goal: these partners are your real channel — invest heavily here

TIER 3 — ELITE (strategic partners):
Requirements: dedicated practice built around our product, $[X ARR] in closed deals, executive sponsorship
Benefits: 30% reseller discount, co-marketing budget, joint development roadmap access, preferred routing for new leads in their territory
Target: 3-5 elite partners
Goal: these partners should feel like an extension of your sales and CS team

Programme infrastructure:
- Partner portal: deal registration, marketing assets, training, commission tracking
- Partner success manager: 1 PSM per 10 authorised partners
- Partner newsletter: monthly product updates, win stories, pipeline tips
- Annual partner summit: relationship building, product roadmap preview

Generate the programme structure for my company and goals.
```

## Example

**User:** A big SaaS company (50K customers) approached us saying they want a "strategic partnership" where we're a featured integration in their marketplace. They want a 30% revenue share on all customers who come from them. Is this a good deal?

**Claude's analysis:**

This is a distribution deal dressed up as a "strategic partnership." Here's how to evaluate it:

**The real question: how much traffic does their marketplace actually convert?**
"Featured integration" in most SaaS marketplaces generates 5-15 new customers per month for a well-matched product. At your average deal size, model what that's worth, then ask: is 30% revenue share worth that distribution?

**30% share economics:**
If your direct gross margin is 70%: 70% - 30% = 40% net margin on marketplace-sourced deals.
At your CAC for direct deals, you likely need 50%+ margin to be viable long-term. This deal is below that.

**Counter-proposal:**
1. Start at 15-20% revenue share with a volume ramp: "15% on the first $100K ARR from your marketplace, 20% on the next $100K, 25% above $200K." This protects your margin at low volume and rewards them for high volume.
2. Define "marketplace-sourced" precisely: only deals where the customer explicitly came from their listing, confirmed by source tracking. Not deals where an existing customer mentioned seeing you in their app store.
3. Ask for 90-day pilot at 15% before committing to a long-term agreement with a higher rate.

**The real tell:** If they push back hard on starting low and insist on 30% upfront, they don't actually believe they'll send you meaningful volume — they're pre-negotiating for high volume they expect. If they're confident in their distribution, they should accept a ramp.

---
