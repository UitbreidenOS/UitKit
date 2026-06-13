---
name: revenue-operations
description: "Revenue operations: pipeline analysis, forecast accuracy, GTM metrics (CAC, LTV, NRR), sales process design, territory planning, and RevOps dashboard design"
updated: 2026-06-13
---

# Revenue Operations Skill

## When to activate
- Building a RevOps metrics framework (CAC, LTV, NRR, pipeline coverage)
- Diagnosing why the sales forecast is inaccurate
- Designing the sales process and stage definitions
- Analysing pipeline health and identifying conversion bottlenecks
- Setting up or auditing a CRM data model
- Building a GTM metrics dashboard for leadership

## When NOT to use
- Individual deal strategy — that's sales, not RevOps
- Marketing campaign execution — use the email-automation or paid-ads skills
- Customer success playbooks — use the customer-success skill
- Product pricing decisions — use the pricing-strategy skill

## Instructions

### GTM metrics framework

```
Build a GTM metrics framework for [company].

Company type: [B2B SaaS / marketplace / services]
Sales motion: [PLG / inside sales / field sales / partner-led]
Stage: [pre-revenue / $0-1M ARR / $1-10M ARR / $10M+ ARR]
GTM team: [founders selling / SDR + AE / full GTM team]

Core GTM metrics by funnel stage:

ACQUISITION:
- MQLs generated: [marketing qualified leads per month]
- MQL→SQL conversion rate: [%] (benchmark: 10-25% depending on ICP tightness)
- CAC (Customer Acquisition Cost): [total sales + marketing spend / new customers]
- CAC by channel: [paid / organic / partner / outbound] — identify most efficient channel
- Time to first contact: [hours from MQL to SDR outreach]

CONVERSION:
- SQL→Opportunity conversion: [%]
- Opportunity→Close-Won rate: [%] (benchmark: 15-25% for inside sales, 10-20% enterprise)
- Average deal size: [ACV]
- Sales cycle length: [days from opportunity created to close]
- Win rate by segment: [SMB / mid-market / enterprise] — where do you win most?

RETENTION AND EXPANSION:
- NRR (Net Revenue Retention): [%] (benchmark: >100% is healthy, >120% is excellent)
- GRR (Gross Revenue Retention): [%] — pure retention without expansion
- Expansion ARR: [new ARR from existing customers per month]
- Churn rate: [%] monthly or annual
- Logo churn vs. revenue churn: [different stories]

EFFICIENCY:
- LTV:CAC ratio: [target >3x, >5x is strong]
- CAC payback period: [months to recover acquisition cost]
- Magic number: [ARR added / sales + marketing spend] (>0.75 is good)
- Sales efficiency: [new ARR / quota-carrying headcount]

Build the metrics framework with current benchmarks for my company type and stage.
```

### Forecast accuracy

```
Diagnose and fix sales forecast accuracy for [team].

Current forecast accuracy: [X% accurate within [Y]% variance]
Forecast method: [bottoms-up from reps / top-down from manager / AI-assisted]
CRM: [Salesforce / HubSpot / Pipedrive / other]
Sales cycle: [X days average]

Forecast accuracy root causes:

STAGE DEFINITION PROBLEMS (most common):
- Stages are not based on buyer actions, only seller actions
  Fix: redefine stages as buyer milestones (e.g., "prospect sent technical evaluation document" not "AE had discovery call")
- Missing exit criteria — reps can move deals forward without evidence
  Fix: add required fields per stage (e.g., decision maker identified Y/N, budget confirmed Y/N)

REP OPTIMISM BIAS:
- Reps inflate deal probability to avoid manager scrutiny
  Fix: use objective criteria to set probability, not rep gut feel
  Good signal: time in stage vs. average time in stage (stalled deal = lower probability)
  Better signal: buyer engagement score (email opens, meeting attendance, champion activity)

SINGLE-THREADED DEALS:
- Only one contact in the deal; they control all access to the buying committee
  Fix: flag single-threaded deals; require multi-threading as a stage exit criterion above SMB

PIPELINE INSPECTION HYGIENE:
□ CRM data completeness: close date, amount, stage, and decision maker required on every deal > $X
□ Weekly pipeline review: deals that haven't moved in >14 days reviewed in 1:1
□ Deal stage audit: deals in late stages with no activity in 7 days = concern
□ Oldest deals: anything > 2x the average sales cycle should be pushed or lost

FORECAST CATEGORIES (Salesforce model):
- Best Case: deals the rep is working hard but not fully committed
- Commit: rep believes will close this period, will stake their credibility on it
- Closed: already closed
- Pipeline: too early or uncertain for this period

Benchmark: Commit category should close at 80%+. If it's closing at <60%, the commit definition needs work.

Build the forecast accuracy improvement plan for my team and CRM.
```

### Pipeline analysis

```
Analyse pipeline health for [period].

Period: [current quarter / next quarter]
Total pipeline: $[X]
Quota: $[X]
Pipeline coverage ratio: [pipeline / quota]

Pipeline health framework:

COVERAGE RATIO BENCHMARKS:
- Inside sales (30-60 day cycle): 3-4x quota in pipeline
- Enterprise (90-180 day cycle): 4-6x quota in pipeline
- PLG (shorter cycle): 2-3x may be sufficient

Your pipeline coverage: $[X pipeline] / $[X quota] = [Xx]
Interpretation: [adequate / under-covered / over-covered]

PIPELINE QUALITY ANALYSIS:

Stage distribution (healthy pipeline has deals at every stage):
| Stage | Deal count | Total value | % of pipeline |
|---|---|---|---|
| Prospecting | X | $X | X% |
| Discovery | X | $X | X% |
| Evaluation | X | $X | X% |
| Proposal | X | $X | X% |
| Negotiation | X | $X | X% |

Red flags in distribution:
- Too much pipeline in early stages: current quarter forecast is at risk
- Too much pipeline in late stages: future quarters are thin ("pull-forward" risk)
- Single large deal representing >30% of pipeline: binary outcome risk

AGE ANALYSIS:
Deals older than 1.5x average sales cycle in their stage = stalled
Stalled deals by stage:
| Stage | Average time expected | Deals past threshold |
|---|---|---|

DEAL SIZE CONCENTRATION:
Top 3 deals as % of total pipeline: [X%]
If top 3 deals = >40% of pipeline: concentration risk

RECOMMENDED ACTIONS:
□ Stalled deals: rep to review and either push forward with a specific next step or move to Closed-Lost
□ Coverage gap: generate [X] new opportunities in next 30 days
□ Single-threaded deals: multi-thread or accept the risk explicitly
□ Large deal concentration: accelerate smaller deals to reduce dependency

Generate the pipeline health report for my team's pipeline data.
```

### RevOps dashboard

```
Design a RevOps dashboard for [audience].

Audience: [CEO / VP Sales / CRO / Board]
Refresh rate: [real-time / daily / weekly]
Data sources: [CRM / billing system / product analytics / marketing automation]

CEO / Board dashboard (quarterly view):

NORTH STAR:
- ARR: $[X] (+X% QoQ)
- NRR: [X%]
- Burn multiple: [net burn / net new ARR] — efficiency signal

GROWTH:
- New ARR this quarter: $[X] vs. plan $[X] ([X]% attainment)
- New logos: [X] vs. plan
- Expansion ARR: $[X]
- Churn ARR: ($[X])

EFFICIENCY:
- CAC payback: [X] months
- LTV:CAC: [Xx]
- Magic number: [X]

FORECAST:
- Current quarter commit: $[X] (closes [X]% confidence)
- Next quarter pipeline: $[X] coverage ratio: [Xx]

VP SALES / CRO dashboard (weekly view):

WEEK'S PERFORMANCE:
- Deals closed this week: [X deals, $X ARR]
- Deals expected to close by EOM: $[X]
- Pipeline created this week: $[X]

PIPELINE HEALTH:
- Total pipeline by stage (bar chart)
- Stalled deals (>1.5x avg time in stage): [X deals, $X]
- Win rate trend (rolling 8 weeks)

REP PERFORMANCE:
- Quota attainment by rep (current period)
- Pipeline coverage by rep (healthy: >3x)
- Deals in commit by rep

Design the dashboard for my specific audience with the right granularity and data sources.
```

## Example

**User:** We're $3M ARR, 12-person sales team, NRR is 94% and declining. CAC payback is 28 months. Leadership says "grow faster" but we're leaking customers. How do I frame the RevOps problem?

**Claude's diagnosis:**

The numbers tell a clear story that leadership may not be seeing: **you cannot grow faster without fixing retention first**.

**The math:**
- 94% NRR = 6% annual revenue erosion from the existing base
- At $3M ARR, that's ~$180K/year going out the door before you sell a single new dollar
- At 28-month CAC payback, every churned customer represents 28 months of acquisition cost wasted
- If NRR is declining (was it 97% six months ago?), the leak is growing

**Framing for leadership:**
"We're currently filling a bucket with a hole in it. Doubling our sales team accelerates the inflow but the hole stays the same size. Fixing retention from 94% → 104% NRR generates more ARR impact than a 30% increase in new sales — and costs 5-10x less."

**What 104% NRR means:**
Your existing base grows revenue without any new sales. At $3M ARR with 104% NRR, you add $120K ARR/year from expansion alone. At 94%, you lose $180K. That's a $300K annual swing.

**RevOps diagnosis to run:**
1. Churn cohort analysis: which customer segments churn most? (size? vertical? sales rep? channel?)
2. Time-to-churn: how long before they leave? (< 6 months = onboarding failure; 12-18 months = value delivery failure)
3. Exit interview data: do you have it? If not, start calling churned customers this week

**Recommendation:**
Before adding any sales headcount: hire 1 CS lead focused entirely on churn reduction. One CSM preventing 3 churns/quarter pays back in 2 months vs. 28 months for a new AE.

---
