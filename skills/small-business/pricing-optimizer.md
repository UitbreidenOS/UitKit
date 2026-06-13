---
name: pricing-optimizer
updated: 2026-06-13
---

# Pricing Optimizer

## When to activate
- You're considering raising prices and want a structured framework instead of guessing
- You haven't reviewed pricing in 18+ months and inflation alone has eroded your real prices
- You're launching a new product or service and need a defensible price rather than "what feels right"
- Your services are priced differently for different clients without a clear logic — you suspect you're under-pricing your best clients
- A competitor raised or dropped their prices and you need to decide how to respond

## When NOT to use
- You're in a commodity market where price is set by the market, not by you — race-to-the-bottom dynamics override pricing strategy
- You have a CFO or pricing analyst who already runs structured pricing reviews
- You're pre-product-market-fit — get to PMF first, then optimize pricing

## Instructions

### Step 1: Set up your pricing context

Say:

"I run a [business type] selling [product/service]. My current pricing is [list each tier or product with its price]. My average customer LTV is [$X]. My gross margin is [Y%]. My typical customer is [persona]. My main competitors price at [list — name and rough price point]. I've changed prices [Z] times in the last 2 years."

### Step 2: Pricing audit

Ask Claude to audit your current pricing.

Say:

"Audit my current pricing structure. Flag: (1) any tier that's priced too close to another tier (low differentiation), (2) any tier that's priced too far from another tier (gap in the value ladder), (3) any tier that's priced under market based on the competitor pricing I provided, (4) any tier where the price is round (often a sign it was set by guess, not by analysis), (5) any service or product that doesn't fit the pricing ladder cleanly."

Read the audit carefully. Claude will sometimes flag a "round number" as a problem when the round number is the right call — round numbers reduce decision friction at the lower tiers. Use the audit as a starting point.

### Step 3: Price increase decision framework

When you're considering a price increase:

Say:

"I'm considering raising prices on [tier/product] from [$X] to [$Y] — a [Z%] increase. My current customers on this tier number [N]. Last raise was [date]. Build the case for and against: (1) what's the expected churn from existing customers, (2) what's the new-customer demand impact, (3) what's the brand-positioning impact, (4) what's the operational cost of running two price tiers during transition, (5) what's the timing risk (any event in the next 6 months that would make the increase look bad)?"

You'll get a structured pros/cons. The output is a decision support tool, not the decision itself.

### Step 4: Tier restructuring

If your pricing audit surfaced a need to restructure tiers:

Say:

"Propose 3 alternative pricing structures for my business: (1) a value-based 3-tier ladder, (2) a per-seat or per-unit structure if applicable, (3) an outcome-based or hybrid structure. For each, show: pricing per tier, the value delta between tiers, the target customer for each tier, the migration plan for existing customers, the projected revenue impact in year 1."

Look at all three. Often the "obvious" answer (more tiers) is wrong, and the right answer is fewer, more differentiated tiers.

### Step 5: Existing-customer migration plan

When you raise prices on existing customers:

Say:

"I'm raising prices on [tier] from [$X] to [$Y] effective [date]. I have [N] existing customers on this tier with average tenure of [Z months]. Draft: (1) the announcement email — clear, respectful, leads with the reason and value rather than the price, (2) a price-lock offer for long-tenure customers who lock in for 12 months at the current rate, (3) the response template for customers who push back, (4) the response template for customers who choose to cancel."

The retention impact of how you handle the price increase often matters more than the price increase itself. A clumsy email creates avoidable churn.

### Step 6: A/B price testing

If your business volume supports it:

Say:

"Design a price test for my [product/service]. Current price [$X]. Test variants: [$Y] and [$Z]. My monthly traffic/lead volume is [N]. Design: (1) the test structure (which customers see which price), (2) the sample size needed for statistical significance, (3) the decision criteria (conversion rate, total revenue, LTV implications), (4) the test duration, (5) the rollback plan if the test reveals an unexpected drop."

Most small businesses don't have the volume for clean A/B price tests. The structured analysis tells you whether you do.

### Step 7: Competitor response

When a competitor changes their pricing:

Say:

"Competitor [name] just changed their pricing from [$X] to [$Y]. My current price is [$Z]. Their positioning is [premium / mid-market / discount]. My positioning is [same / different]. Analyze: (1) the likely strategic intent of their move, (2) the impact on my pipeline if I don't respond, (3) three response options (match, hold and differentiate, raise to widen the gap), (4) the recommended response with rationale."

Don't reflexively match competitor moves. The structured analysis often reveals that holding is the right call.

## Example

You run a small B2B SaaS for sales teams at $99/month for the Pro tier. You have 340 Pro customers — $34K MRR on that tier. You haven't raised prices in 28 months. Inflation alone has reduced your real price by roughly 12% over that period.

You set up the pricing audit. Claude flags:
- The Pro tier ($99) is too close to the Team tier ($149) — only a 51% delta for a meaningful capability gap
- The Pro tier is well below market — competitor mid-tier offerings range from $129 to $199
- Your Enterprise tier ($499) has too wide a gap from Team ($149)

You decide to raise Pro from $99 to $129 — a 30% increase, but still below market.

You run the migration plan workflow. Claude drafts:

**Announcement email (340 customers):**
> Two years ago, when we launched the Pro tier at $99, our product had [list 3 specific features at launch]. Today, the same tier includes [list 6 features added since]. Starting [date 60 days out], the Pro tier will be $129. If you'd like to lock in the current $99 rate for the next 12 months by switching to annual billing, you can do that here: [link]. This is the first price change we've ever made on Pro. We expect it to be the last for at least 24 months.

**Lock-in offer:** Annual billing at $99/month equivalent, locked through [date 12 months out].

**Pushback response:** Acknowledges concern, references the lock-in offer, doesn't try to up-sell.

**Cancellation response:** Acknowledges, offers a 30-day grace period, asks for feedback.

You send. Over the next 30 days:
- 110 of 340 customers (32%) take the annual lock-in offer — locked at $99 for 12 months
- 12 customers (3.5%) cancel — within the model's expected churn range
- 218 customers stay on monthly at the new $129 price

Net MRR impact: $34K → $40.2K after migration completes. That's $74K annualized incremental revenue. The 12 canceled customers represent $14K in churned ARR, which you would have lost anyway over time.

You schedule a 24-month calendar reminder to revisit Pro pricing. The same workflow handles the next adjustment.
