---
name: growth-dashboard
description: "Weekly growth dashboard: acquisition, activation, retention, revenue, referral metrics with trend analysis and commentary for growth teams"
updated: 2026-06-13
---

# Growth Dashboard Skill

## When to activate
- Building the weekly growth report for leadership or the team
- Pulling together AARRR metrics across acquisition, activation, retention, revenue, and referral
- Diagnosing which growth lever is broken this week vs. last week
- Writing the narrative commentary around your metrics — not just the numbers
- Designing a new growth dashboard in Looker Studio, Metabase, or Notion
- Tracking experiment portfolio health alongside business metrics

## When NOT to use
- Deep-dive analysis on a single metric — this is a synthesis skill, not a debugging skill
- Setting up analytics infrastructure — use `/analytics-tracking`
- Designing individual experiments — use `/experiment-tracker`
- Financial modelling for investors — use the financial-model workflow

## Instructions

### Weekly growth dashboard prompt

```
Build my weekly growth dashboard for the week of [DATE].

Product: [describe — SaaS / marketplace / mobile app / ecommerce]
Stage: [pre-PMF / post-PMF / scaling]
North Star Metric: [the one number that captures business health]

This week's data:

ACQUISITION
- New visitors: [N] (vs. [N] last week, [N] this time last month)
- New signups / leads: [N] (vs. [N] LW)
- Signup rate (visitors → signups): [X%]
- CAC by channel this week: [Google: $X | Meta: $X | Organic: $X | Referral: $X]
- Paid spend: $[X] (vs. $[X] LW)

ACTIVATION
- New users who completed activation event: [N] / [N] new signups = [X%] activation rate
- Activation definition: [what counts as activated — e.g., "created first project"]
- Time to activation (median): [X hours/days]

RETENTION
- DAU / WAU / MAU: [N] / [N] / [N]
- DAU/MAU ratio (stickiness): [X%]
- 7-day retention (of cohorts from 7 days ago): [X%]
- 30-day retention: [X%]
- Churn this week: [N] customers / $[X] MRR

REVENUE
- MRR: $[X] (vs. $[X] last week)
- New MRR: $[X]
- Expansion MRR: $[X]
- Churned MRR: $[X]
- Net new MRR: $[X]
- LTV:CAC ratio: [X:1]
- Payback period: [X months]

REFERRAL
- Referral signups this week: [N]
- Referral rate: [referral signups / total signups]: [X%]
- NPS (if measured this week): [X]

EXPERIMENTS RUNNING
[List active A/B tests, days running, current lift vs. control]

---

Produce the weekly growth dashboard with:
1. Headline numbers (this week vs. last week vs. 4-week average)
2. Traffic light status for each metric (green / yellow / red vs. targets)
3. Top 3 observations — what changed materially and why
4. One hypothesis for each negative trend
5. Recommended actions for next week
6. Experiment portfolio: which tests to conclude, which to extend
```

### AARRR framework builder

```
Design a complete AARRR metrics framework for [product].

Product stage: [pre-launch / early / growth / scale]
Business model: [subscription / transactional / usage-based / freemium]
Primary channel: [content / paid / PLG / sales]

Build metrics for each stage:

ACQUISITION — How are people finding us?
Primary metrics:
- Total new visitors / leads / signups by channel
- CAC by channel (spend / new customers from that channel)
- Organic vs. paid split
- Channel efficiency score: [conversion rate × avg LTV / CAC]

Benchmarks:
- Good CAC payback: < 12 months for SMB, < 18 months for mid-market
- Organic should be growing as % of total over time (not flat or shrinking)

ACTIVATION — Are new users getting value?
Primary metrics:
- Activation rate: % of signups who complete [aha moment event]
- Time to activation (median days)
- Aha moment completion by acquisition channel (organic users activate differently than paid)

Benchmarks:
- < 20% activation rate: major onboarding problem
- 20-40%: improvement opportunity
- 40-60%: healthy for complex products
- > 60%: strong for simple tools

RETENTION — Are users coming back?
Primary metrics:
- D1 / D7 / D30 retention (% of users who return on that day)
- Weekly / monthly cohort retention curves
- DAU/MAU stickiness ratio
- Feature adoption depth (users using 1 feature vs. 3+ features)

Benchmarks:
- D7 retention > 25%: viable (B2C), > 40%: viable (B2B SaaS)
- D30 > 15% (B2C), > 35% (B2B)
- DAU/MAU > 20%: engaged product

REVENUE — Are we monetising effectively?
Primary metrics:
- MRR / ARR and growth rate (WoW, MoM)
- ARPU / ARPA (per user / per account)
- LTV (average contract × gross margin / churn rate)
- LTV:CAC ratio
- Payback period
- Net Revenue Retention (NRR): [expansion - churn] / beginning MRR

Benchmarks:
- LTV:CAC > 3:1: healthy
- Payback period < 12 months: good, < 18 months: acceptable
- NRR > 100%: expansion offsets churn (best-in-class > 120%)

REFERRAL — Are users telling others?
Primary metrics:
- Viral coefficient: new users per existing user per period
- Referral rate: % of signups from referral
- NPS and promoter percentage
- Reviews / case studies generated

Benchmarks:
- Viral coefficient > 0.5: meaningful word-of-mouth
- > 1.0: virality (rare, often short-lived)
- NPS > 40: promoter-dominated base

Produce a dashboard template for [product] with all 15 core metrics, targets, and data sources.
```

### Growth narrative generator

```
Write the growth commentary for my weekly/monthly report.

Audience: [CEO / board / growth team / whole company]
Tone: [analytical / executive summary / conversational]

This period's performance:
- [Key metric]: [result vs. target — was it above/below/on target?]
- [Key metric]: [result]
- [Key metric]: [result]

Context to weave in:
- What external factors affected results? [seasonality / competitor action / macro]
- What internal changes happened? [campaigns launched / product changes / pricing changes]
- What experiments concluded? [results]
- What's going right? [1-2 things working well]
- What's the risk? [1 thing that concerns you]
- Next week's focus: [the one lever you're pulling]

Write a 200-300 word narrative that:
1. Leads with the North Star Metric movement — positive or negative, name it
2. Attributes the movement to 1-2 specific causes (not vague — "paid CAC rose 18% because iOS 18 changes reduced Meta signal quality")
3. Identifies the one metric that matters most this week and why
4. Gives a concrete action — not "we will monitor" but "we will do X by Friday"
5. Ends with the outlook: are we on track for the month?

Do not write: "We saw mixed results." Name the results and own them.
```

### Cohort revenue analysis

```
Analyse my revenue cohorts to understand LTV and payback.

Product: [subscription SaaS / transactional]
Cohort definition: [month of first payment]
Data available: [months of history]

Cohort table format:
Month | Starting MRR | Month 1 MRR | Month 3 | Month 6 | Month 12 | LTV estimate

Provide data for each cohort: [paste CSV or table]

Analyse:
1. Retention by cohort — which cohorts are retaining best and why?
   (Ask: what changed in acquisition, activation, or product around that cohort's start date?)

2. Expansion revenue — are surviving customers expanding?
   NRR = (beginning MRR + expansion - churn - contraction) / beginning MRR
   NRR > 100%: each cohort is worth more over time (best-in-class: 120-140%)

3. LTV calculation:
   Average monthly revenue per customer: $[X]
   Average customer lifespan: 1 / monthly churn rate = [X months]
   LTV = avg monthly revenue × avg lifespan × gross margin %
   LTV = $[X] × [X] × [X%] = $[X]

4. Payback period:
   CAC / (ARPU × gross margin %) = [X months]
   Compare to your average customer lifespan — if payback > lifespan, you're underwater

5. Which channel produces the highest LTV customers?
   Break LTV by acquisition channel: [paid / organic / referral / sales]
   This tells you where to double down on CAC investment

Produce: LTV by cohort chart, payback analysis, and channel LTV comparison table.
```

### Channel mix optimisation

```
Optimise my marketing channel mix for growth.

Current channel performance:
| Channel | Spend | New Customers | CAC | Avg LTV | LTV:CAC | Payback |
|---|---|---|---|---|---|---|
| Google Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X mo] |
| Meta Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X mo] |
| Content/SEO | $[X] | [N] | $[X] | $[X] | [X:1] | [X mo] |
| Referral | $[X] | [N] | $[X] | $[X] | [X:1] | [X mo] |
| Outbound sales | $[X] | [N] | $[X] | $[X] | [X:1] | [X mo] |

Total budget: $[X]/month
Growth target: [X new customers/month or $X new MRR]

Analysis:
1. Rank channels by LTV:CAC — allocate more to channels with ratio > 3:1
2. Identify saturated channels — if CAC is rising MoM on a channel, you're hitting scale ceiling
3. Identify underinvested channels — organic/referral often has best LTV but lowest investment
4. Marginal economics: at 2x spend on [channel], what happens to CAC? (typically rises)
5. Minimum viable spend — some channels (e.g., SEO, community) require threshold investment to produce results

Budget reallocation recommendation:
- Increase: [channel] — highest LTV:CAC, not yet saturated
- Maintain: [channel] — performing at target, stable CAC
- Reduce: [channel] — CAC rising, LTV:CAC below 2:1
- Experiment: [channel] — untested, low cost to validate

New budget allocation: [table showing before vs. after]
Projected impact: [X more customers/month at current conversion rates]
```

## Example

**User:** Here's our weekly numbers. Tell me what's happening and what to do. Signups: 342 (down from 410 last week). Activation: 31% (down from 35%). MRR: $48,200 (up $1,100 from last week). Churn: 2 customers ($400 MRR). Paid spend: $12,000.

**Claude's dashboard output:**

**Week of [DATE] — Growth Dashboard**

**North Star: MRR $48,200 (+$1,100 WoW) — on track**

| Metric | This Week | Last Week | Trend |
|---|---|---|---|
| Signups | 342 | 410 | -17% |
| Activation rate | 31% | 35% | -4pp |
| New MRR | $1,500 | $1,800 | -17% |
| Churned MRR | $400 | $300 | +33% |
| Net new MRR | $1,100 | $1,500 | -27% |
| CAC (blended) | $35 | $29 | +21% |

**Top 3 observations:**

1. Signup volume dropped 17% — with spend flat at $12K, CAC rose from $29 to $35. This is a paid acquisition signal quality problem, not a budget problem. Check your Google Ads search term reports and Meta ad frequency — likely hitting audience fatigue.

2. Activation dropped 4 points — 342 signups × 4pp drop = ~14 fewer activations than expected. At our typical conversion from activation to paid, that's ~$700 at risk in next 30 days. Something in the onboarding flow changed or broke this week — check if any UI/product changes deployed.

3. MRR is still positive because expansion held — customers upgrading offset new customer slowdown. This is fragile; expansion can't carry the business if new user flow keeps declining.

**Actions for next week:**
- Paid: pull Meta frequency report; if frequency > 4 per person, launch new creative set
- Activation: run session recordings on sign-up → aha moment path (Hotjar/FullStory) — find the drop
- Churn: call the 2 churned customers this week; understand if product, price, or competitor

---
