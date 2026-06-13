---
name: commercial-forecaster
description: "Commercial forecasting: build quarterly bookings forecasts with commit/best-case/pipe-only tiers, cohort ARR projections, per-stage funnel confidence scoring, and NRR/GRR analysis for board reporting"
updated: 2026-06-13
---

# Commercial Forecaster Skill

## When to activate
- Building the quarterly bookings forecast for a board meeting or QBR
- CFO asking for "commit, best-case, and pipe-only" numbers
- Projecting ARR for the next 4-8 quarters using cohort retention data
- Suspecting a consolidated NRR is hiding a leaky recent cohort
- Pipeline coverage is shrinking and you need to know which funnel stages are still reliable

## When NOT to use
- Historical financial reporting — use the financial-plan or earnings-analysis skills
- Strategic multi-year planning — use the cfo-advisor or pitch-deck skill
- Setting prices — use the pricing-strategy skill
- Per-deal discount approvals — use the deal-desk skill

## Instructions

### 3-tier bookings forecast

```
Build a quarterly bookings forecast.

Period: [Q3 2026]
Pipeline data:
  - Opportunity list with: stage, amount, close-date, days-in-stage, last-activity-date
  - Historical stage-to-stage conversion rates (last 4 quarters + last 12 quarters)
Team velocity: [average days per stage in current pipeline]

3-TIER FORECAST:

TIER 1 — COMMIT ($X):
Definition: deals the rep will stake their credibility on
Method: apply 90% probability weight to Commit-stage deals
Include: deals where activity < 7 days ago, close date < 30 days
Exclude: deals stalled > 2x average time in stage

TIER 2 — BEST CASE ($X):
Definition: Commit + realistic upside if the top 3 deals close
Method: Commit + 60% probability weight on "Best Case" stage deals
Include: deals with recent activity, qualified buying committee, clear next steps

TIER 3 — PIPE ONLY ($X):
Definition: everything in the pipeline at face value
Method: sum all open opportunities × historical win rate for their stage
Note: This is almost always wrong — use it as a ceiling, not a target

ASSUMPTION BLOCK (non-negotiable — present this to the board):
| Assumption | Value | Source |
|---|---|---|
| Win rate applied to Commit | 90% | Ops judgment |
| Win rate applied to Best Case | 60% | Last 4Q average |
| Average days to close from Proposal | X days | Last 12Q average |
| Stale deal threshold | 14 days no activity | Policy |
| Excluded: deals open > 2x avg cycle | $X | Risk filter |

RISK SIGNALS:
- Commit/Pipe coverage ratio: [X]% (healthy: > 35%)
- Stale deals as % of pipeline: [X]% (above 25% = forecast unreliable)
- Average days over expected close: [X] (above 30 days = slippage)

Generate the 3-tier forecast from my pipeline data.
HUMAN DECISION REQUIRED: The CRO presents the number with these assumptions visible.
```

### Cohort ARR projection

```
Project ARR by cohort over [X quarters].

Cohort data: [list cohorts with starting ARR and per-quarter retention]
Projection horizon: [Q4 2026 through Q4 2027]
New ARR assumption: [from 3-tier forecast above]

Cohort analysis approach:

For each cohort (by quarter of first purchase):
  Starting ARR: $[X]
  Q1 retention: [X]% GRR
  Q2 retention: [X]% GRR
  ...
  Expansion: [average NRR - GRR = expansion rate]

Projected ARR at each quarter:
  ARR(t) = Σ[cohort(i) × GRR(i,t) × expansion(i,t)] + new_ARR(t)

LEAKY COHORT DETECTION:
A cohort is "leaking" when its GRR is below the company average GRR by > 5pp.
Leaky cohorts hide inside a "healthy" consolidated NRR because expansion from
other cohorts masks the retention problem.

Flag: any cohort with GRR < [company average - 5pp]
Implication: if leaky cohorts are recent, the problem is getting worse, not better.

Output: per-cohort ARR projection table + flagged leaky cohorts + impact on consolidated NRR.
```

### Funnel stage confidence scoring

```
Score each funnel stage for forecast reliability.

Historical data: stage-to-close conversion by stage, last 4Q and last 12Q
Current pipeline by stage: [amounts and deal counts]

CONFIDENCE SCORING by stage:

High confidence (weight at face value):
- Coefficient of variation (CV) < 20% over 8+ quarters
- Stage conversion is predictable → deal count × avg conversion = reliable estimate

Medium confidence (apply 20% discount):
- CV 20-40% or < 6 quarters of data
- Stage conversion varies with rep performance or deal size

Low confidence (apply 40% discount or exclude):
- CV > 40%
- Stage depends heavily on a single large deal
- Stage was recently redefined or has < 4 quarters of history

FUNNEL MATH (transparent version for board):
| Stage | Open Deals | Total $ | Conversion Rate | Confidence | Weighted $ |
|---|---|---|---|---|---|
| Proposal Sent | 12 | $1.2M | 45% | High | $540K |
| Demo Completed | 28 | $2.8M | 22% | Medium | $493K |
| Qualified | 67 | $6.7M | 8% | Low | $322K |
| **Total** | | $10.7M | | | **$1.35M** |

Note: The "Total" weighted pipeline is your pipe-only forecast with honesty applied.

Generate the funnel confidence model from my historical conversion data.
```

### NRR decomposition

```
Decompose NRR to identify what's actually driving the number.

NRR data: [consolidated NRR + GRR by quarter, ideally by cohort]

NRR = GRR + Expansion Rate
Where: GRR = 1 - (churn rate + downgrade rate)
       Expansion = upsell + cross-sell rate from existing customers

DIAGNOSIS:

NRR > 110%: expansion is masking moderate churn. Ask: is churn trending up?
NRR 100-110%: healthy but watch expansion sustainability
NRR < 100%: churn + downgrades exceed expansion. Revenue-destroying base.

Per-cohort NRR vs. consolidated NRR:
If recent cohorts (< 12 months old) have lower NRR than cohorts aged 12-24 months,
the product or ICP has regressed. The consolidated NRR will worsen over time as
recent cohorts age and their full churn manifests.

Key question: "Is our NRR improving or worsening when you look at same-age cohorts?"

Cohort age-normalised NRR: what's the NRR at 6 months, 12 months, 24 months?
If this is declining across cohort vintages → retention is getting worse.

Output: NRR decomposition + cohort age-normalised comparison + verdict.
```

## Example

**User:** CRO is presenting to the board. ARR is $12M. NRR looks like 108%. Pipeline is $4.2M for Q3. What numbers do I need and how do I present them?

**Claude's forecast prep:**

Don't present one number. Present three with assumptions visible — boards trust that more than a single number backed by nothing.

**The three numbers you need:**

Commit: $800K — deals in your commit stage with < 7 days since last activity
Best case: $1.1M — commit + your top 5 upside deals at 60% probability
Pipe only: $1.6M — full pipeline × historical win rates by stage

**The NRR question to prepare for:**

108% consolidated NRR sounds healthy. But: pull your last 3 cohort vintages (customers who joined 0-6 months ago, 7-12 months ago, 13-18 months ago). If the newest cohort's 6-month NRR is lower than the 7-12 month cohort's 6-month NRR — your NRR is about to go down even if the consolidated number looks fine today.

**Board deck slide structure:**
1. Commit: $800K (90% confidence) — here's what we're staking
2. Best case: $1.1M (if top 5 deals close) — here's what goes right
3. Pipe only: $1.6M (full pipeline) — here's the ceiling
4. Assumptions: [one table showing conversion rates used, activity thresholds, exclusions]
5. NRR: 108% consolidated; [note if cohort analysis shows any deterioration]

---
