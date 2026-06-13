---
name: "pricing-strategy"
description: "Pricing strategy: model analysis (value-based, cost-plus, competitive), tier design, freemium vs trial, price increase approach, willingness-to-pay research"
---

# Pricing Strategy Skill

## When to activate
- Setting pricing for a new product or service
- Deciding between pricing models (subscription, usage-based, one-time, freemium)
- Designing pricing tiers (how many, what's included, how to differentiate)
- Raising prices on existing customers
- Running a willingness-to-pay analysis

## When NOT to use
- Pricing regulated products — requires compliance review
- Enterprise custom pricing negotiations — different process
- Financial modelling for investors — use the financial-plan skill

## Instructions

### Choose a pricing model

```
Help me choose the right pricing model for my product.

Product: [describe — software / service / physical product / marketplace]
Customers: [who buys, company size, budget range]
How they use it: [frequency, volume, intensity]
Our cost structure: [roughly — fixed costs high or low? Variable per customer?]
Competitors' models: [what do they charge and how]

Evaluate these models for my situation:
1. Flat fee (single price) — simple, predictable, good for simple products
2. Tiered subscription — good and better and best, most common SaaS model
3. Usage-based / metered — charge per API call, seat, transaction, GB
4. Freemium — free forever tier + paid for more features/limits
5. Free trial — full access for X days, then pay
6. Per seat — per user pricing, good for team tools
7. Value-based — price anchored to customer ROI (ideal but hard to enforce)
8. One-time payment — good for tools with no ongoing value, audiences who hate subscriptions

Recommend: which model(s) fit my product and why?
```

### Design pricing tiers

```
Design pricing tiers for [product].

Goal: [maximise conversion / maximise revenue / move upmarket]
Customer segments I want to serve: [describe each — e.g. solopreneur / small team / enterprise]
Key value drivers: [what features/limits customers care most about]
Competitor pricing: [what others charge, if known]

Design 3 tiers:
- Tier 1 (entry / self-serve): limits, features, price, target customer
- Tier 2 (mid / most popular): limits, features, price, target customer
- Tier 3 (pro / teams): limits, features, price, target customer

Optional: Tier 0 (free) and Tier 4 (enterprise / custom)

Rules for good tier design:
- Each tier should feel obviously "worth upgrading to"
- Put 1-2 features people actually want behind the paid gates
- The most popular tier should be in the middle (decoy pricing)
- Annual vs monthly: what % discount to offer for annual?
```

### Freemium vs free trial

```
Should I use freemium or a free trial?

My product: [describe]
Time to value: [how long until users get meaningful value?]
User acquisition: [inbound / paid / word of mouth]
Target market: [SMB self-serve / enterprise / consumer]
Conversion goal: [X% trial-to-paid target]

Freemium pros/cons for my situation:
- Pro: lower friction, viral/word-of-mouth, builds user base
- Con: high support cost for non-paying users, unclear upgrade motivation

Free trial pros/cons for my situation:
- Pro: clear urgency, captures committed users, simpler product
- Con: friction at sign-up, user must act before deadline

Recommendation + the key variable that drives the decision for my case.
```

### Price increase strategy

```
I want to raise prices. Help me do it without losing customers.

Current pricing: $[X]/month
Proposed pricing: $[X]/month (increase: [X]%)
Reason: [value delivered, inflation, market reposition]
Customer base: [X] customers, average tenure [X] months

Design the rollout:
1. Who to grandfather (existing customers keep old price for how long?)
2. Who to migrate first (new customers immediately, existing after X months?)
3. Communication sequence (when to notify, what to say, who signs the email)
4. Handling objections (what to say to "your competitor is cheaper")
5. Expected churn rate and revenue impact model
6. Draft the price increase email

Historical benchmark: well-executed SaaS price increases see 2-8% churn, net positive revenue.
```

### Willingness-to-pay research

```
Design a willingness-to-pay research process for [product].

Target segment: [who to interview/survey]
Pricing range I'm considering: $[X] to $[X]

Research methods (in order of effort):
1. Van Westendorp Price Sensitivity Meter (4-question survey):
   - At what price is this too cheap to trust?
   - At what price is this a bargain?
   - At what price is this expensive but you'd still buy?
   - At what price is this too expensive?

2. Customer interviews (5-10 existing or potential customers):
   - What do you currently pay for alternatives?
   - What ROI do you get from solving this problem?
   - Walk me through your buying process for tools like this

3. Pricing page A/B test:
   - Split traffic to different price points
   - Measure conversion and churn at each price

Design the Van Westendorp survey and interview script for my product.
```

## Example

**User:** I have a SaaS tool at $29/month flat. Revenue is fine but I suspect I'm leaving money on the table. What should I do?

**Claude's analysis:**

Flat pricing at $29 is classic early-stage simplicity — smart for validation, limiting for scale.

**The problem:** $29 captures the same price from a solopreneur using your tool 2 hours/week and a 10-person team using it all day every day. You're under-monetising the high-value segment.

**Recommended move: 3-tier restructure**

| Tier | Price | For | Key limits |
|---|---|---|---|
| Solo | $29/mo | Freelancers, solopreneurs | 1 user, 100 items |
| Team | $79/mo | Small teams | 5 users, 1,000 items |
| Business | $199/mo | Growing companies | 20 users, unlimited |

**Migration strategy for existing $29 customers:**
- Grandfather at $29 for 12 months (loyalty reward)
- After 12 months: invite to choose new tier based on usage
- Don't apologise — explain value increase

**Projected impact:** If 20% of existing customers upgrade to Team ($79) and 5% to Business ($199), monthly revenue increases ~35% with same customer count.

---
