---
name: sales-metrics-reporter
description: Generates executive sales dashboards and monthly/quarterly reports. Tracks ACV, pipeline velocity, win rates, forecast accuracy, rep productivity, and trends. Provides actionable insights and variance analysis for leadership reviews.
allowed-tools: Read, Write
effort: high
---

## When to activate

Monthly for sales leadership review and quarterly for board/executive updates. Aggregates data from audit, forecast, and ramp trackers to create comprehensive reporting dashboard.

## When NOT to use

Not for tactical deal management — use deal-analyzer instead. Not for new rep ramp — use ramp-tracker. Focus is on high-level metrics and trends, not individual deals.

## Key Metrics Definitions

### Pipeline Metrics

- **Total Pipeline Value:** Sum of deals in Prospect through Negotiation stages (excludes closed)
- **Weighted Pipeline:** Sum of (deal value × stage probability)
- **Pipeline Velocity:** Average deals per week moving to next stage
- **Pipeline Freshness:** Avg days since last activity on pipeline deals

### Revenue Metrics

- **Closed Revenue:** Sum of Closed/Won deals in period
- **Average Contract Value (ACV):** Average deal size closed in period
- **Weighted Average Revenue:** ACV × close rate × rep count
- **Revenue Run Rate:** Current quarter revenue annualized

### Operational Metrics

- **Win Rate:** % of Negotiation stage deals closing to Closed/Won
- **Conversion Rates:** % advancing stage-to-stage (Prospect→Qual, Qual→Design, Design→Neg, Neg→Won)
- **Deal Velocity:** Days in each stage; total cycle time
- **Forecast Accuracy:** Actual vs. forecast variance (target <±10%)
- **Rep Quota Attainment:** % of reps at/above quota by segment

### Rep Productivity

- **Deals per Rep:** Deals closed per rep per month
- **Revenue per Rep:** Revenue closed per rep per month
- **Pipeline per Rep:** Total pipeline value per rep
- **Activity per Rep:** Total outreach activities per rep per week
- **Rep Ramp:** % of new hires at quota by month 6

---

## Monthly Report Template

Save as `reports/sales-metrics-[YYYY-MM].md`

```markdown
# Sales Metrics Report — [Month/Year]

**Report Generated:** [timestamp]  
**Reporting Period:** [Month]  
**Report Audience:** [Sales leadership, Board, Internal]

---

## Executive Summary

**Period Overview:**
- Closed Revenue: $[X]M ([vs. target: +/-X%, vs. prior month: +/-X%])
- New Pipeline Created: $[X]M
- Active Pipeline: $[X]M (weighted: $[X]M)
- Forecast Accuracy: [+/-X%] (variance from forecast)
- Rep Quota Attainment: [X]% (reps at/above quota)

**Key Highlights:**
1. [Major win: deal size, segment, significance]
2. [Trend improvement: metric, trend, impact]
3. [Alert/opportunity: bottleneck, risk, or opportunity]

---

## Revenue & Bookings Dashboard

| Metric | Prior Month | Current Month | Variance | Target | vs. Target |
|---|---|---|---|---|---|
| **Closed Revenue** | $[X]M | $[X]M | [+/-X%] | $[X]M | [+/-X%] |
| **New Deals Closed** | [X] deals | [X] deals | [+/-X%] | [X] deals | [+/-X%] |
| **Average Deal Value (ACV)** | $[X]K | $[X]K | [+/-X%] | $[X]K | [+/-X%] |
| **Bookings per Rep** | $[X]M avg | $[X]M avg | [+/-X%] | $[X]M | [+/-X%] |

**Revenue Trend (Last 6 Months):**
- [6 months ago]: $[X]M
- [5 months ago]: $[X]M
- [4 months ago]: $[X]M
- [3 months ago]: $[X]M
- [2 months ago]: $[X]M
- [Current month]: $[X]M
- **Trend:** [↑ Growing / → Stable / ↓ Declining] [rate]

**Segment Breakdown (by revenue):**
| Segment | Revenue | % of Total | vs. Prior Month | Trend |
|---|---|---|---|---|
| Enterprise | $[X]M | [X]% | [+/-X%] | [↑/→/↓] |
| Mid-Market | $[X]M | [X]% | [+/-X%] | [↑/→/↓] |
| SMB | $[X]M | [X]% | [+/-X%] | [↑/→/↓] |

---

## Pipeline Health Dashboard

| Metric | Current | Prior Month | Variance | Benchmark | Status |
|---|---|---|---|---|---|
| **Total Pipeline Value** | $[X]M | $[X]M | [+/-X%] | >2x quarterly target | [✓/✗] |
| **Weighted Pipeline** | $[X]M | $[X]M | [+/-X%] | >3x quarterly target | [✓/✗] |
| **Active Deals** | [X] deals | [X] deals | [+/-X] | [baseline] | [✓/✗] |
| **Average Deal Size** | $[X]K | $[X]K | [+/-X%] | $[X]K | [✓/✗] |
| **Pipeline Freshness** | [X] days | [X] days | [+/-X] days | <30 days | [✓/✗] |
| **Stuck Deals (>14d)** | [X] deals / $[X]M | [X] deals / $[X]M | [+/-X%] | <5% of pipeline | [✓/✗] |

**Stage Distribution:**

| Stage | Deal Count | % of Pipeline | Pipeline Value | vs. Baseline | Trend |
|---|---|---|---|---|---|
| Prospect | [X] | [X]% | $[X]M | [+/-X%] | [↑/→/↓] |
| Qualification | [X] | [X]% | $[X]M | [+/-X%] | [↑/→/↓] |
| Solution Design | [X] | [X]% | $[X]M | [+/-X%] | [↑/→/↓] |
| Negotiation | [X] | [X]% | $[X]M | [+/-X%] | [↑/→/↓] |

**Stage Velocity (Days in Stage):**

| Stage | Average Days | Baseline | vs. Baseline | Alert? |
|---|---|---|---|---|
| Prospect | [X] days | [X] days | [+/-X%] | [if >+20%, yes] |
| Qualification | [X] days | [X] days | [+/-X%] | [if >+20%, yes] |
| Solution Design | [X] days | [X] days | [+/-X%] | [if >+20%, yes] |
| Negotiation | [X] days | [X] days | [+/-X%] | [if >+20%, yes] |
| **Total Cycle Time** | [X] days | [X] days | [+/-X%] | — |

---

## Conversion & Win Rate Metrics

| Metric | Current | Baseline | Trend | Status |
|---|---|---|---|---|
| **Prospect → Qualification** | [X]% | [X]% | [+/-X%] | [✓ or Alert if <-10%] |
| **Qualification → Design** | [X]% | [X]% | [+/-X%] | [✓ or Alert if <-10%] |
| **Design → Negotiation** | [X]% | [X]% | [+/-X%] | [✓ or Alert if <-10%] |
| **Negotiation → Won** | [X]% | [X]% | [+/-X%] | [✓ or Alert if <-10%] |
| **End-to-End Win Rate** | [X]% | [X]% | [+/-X%] | — |

**Conversion Funnel Visualization:**

```
Prospect: 100 deals | $[X]M
  ↓ [X]% conversion
Qualification: [X] deals | $[X]M
  ↓ [X]% conversion
Solution Design: [X] deals | $[X]M
  ↓ [X]% conversion
Negotiation: [X] deals | $[X]M
  ↓ [X]% conversion
Closed/Won: [X] deals | $[X]M
```

**Benchmark vs. Historical:**
- Win rate this month: [X]%
- Win rate YTD avg: [X]%
- Historical target: [X]%
- Status: [Outperforming / On target / Underperforming]

---

## Forecast Accuracy & Variance

**Last Month Forecast:** $[X]M  
**Actual Closed Revenue:** $[X]M  
**Variance:** [+/-X%]  
**Variance Status:** [✓ Within tolerance <±10% / ✗ Exceeded tolerance]

**Root Cause Analysis:**
- Lost deals: [X] deals, $[X]M
- Acceleration/early closures: [X] deals, $[X]M
- New deals added: [X] deals, $[X]M
- Stage regression: [X] deals, $[X]M
- Other: [X] deals, $[X]M

**12-Month Forecast Accuracy Trend:**

| Month | Forecast | Actual | Variance | Confidence |
|---|---|---|---|---|
| [12 months ago] | $[X]M | $[X]M | [+/-X%] | [High/Med/Low] |
| [11 months ago] | $[X]M | $[X]M | [+/-X%] | [High/Med/Low] |
| [Current month] | $[X]M | $[X]M | [+/-X%] | [High/Med/Low] |

**Forecast Accuracy Trend:** [Average variance: +/-X%] [Improving / Stable / Declining]

---

## Rep Productivity & Quota Attainment

| Rep | Closed Revenue | Quota | % Attainment | Deals Closed | Pipeline Value | Status |
|---|---|---|---|---|---|---|
| [Name] | $[X]M | $[X]M | [X]% | [X] deals | $[X]M | [✓ At quota / ⚠ At risk / ✗ Off track] |
| [Name] | $[X]M | $[X]M | [X]% | [X] deals | $[X]M | — |
| [Name] | $[X]M | $[X]M | [X]% | [X] deals | $[X]M | — |

**Team Quota Attainment:** [X]% (reps at/above quota)

**Top Performer:**
- Rep: [Name]
- Revenue: $[X]M ([X]% of quota / [X] deals)
- Strength: [e.g., "Highest ACV, strong in Enterprise segment"]

**Support Needed:**
- Rep: [Name]
- Status: [X]% of quota ([X] deals)
- Gap: [X]M to reach quota in [X] weeks
- Action: [Coaching focus, pipeline review, territory adjustment, etc.]

**Rep Activity Metrics:**

| Rep | Activities/Week | Pipeline per Rep | Avg Deal Size | Close Rate | Cycle Time |
|---|---|---|---|---|---|
| [Name] | [X] activities | $[X]M | $[X]K | [X]% | [X] days |

---

## New Rep Ramp Status

| Rep | Start Date | Month on Ramp | Cumulative Quota % | Pipeline Value | Deals Closed | Status |
|---|---|---|---|---|---|---|
| [Name] | [Date] | [Month X] | [X]% | $[X]M | [X] deals | [✓ On track / ⚠ At risk / ✗ Off track] |
| [Name] | [Date] | [Month X] | [X]% | $[X]M | [X] deals | — |

**Ramp Success Rate:** [X]% of new reps reaching quota by month 6

---

## Data Quality Scorecard

| Data Element | Completeness | Accuracy | Timeliness | Overall Score |
|---|---|---|---|---|
| Account Name | [X]% | [X]% | Current | [X]% |
| Deal Value | [X]% | [X]% | Current | [X]% |
| Sales Stage | [X]% | [X]% | Current | [X]% |
| Close Date | [X]% | [X]% | Current | [X]% |
| Probability | [X]% | [X]% | Current | [X]% |
| Deal Owner | [X]% | [X]% | Current | [X]% |
| **Overall Score** | [X]% | [X]% | [X] days avg | **[X]%** |

**Target:** >98% across all metrics  
**Status:** [✓ Exceeds target / ✓ Meets target / ⚠ Below target]

---

## Key Risks & Opportunities

### Critical Risks (Address This Month)

1. **[Risk Name]** — [Description] — [Recommended action] — Owner: [VP Sales]
2. **[Risk Name]** — [Description] — [Recommended action] — Owner: [VP Sales]

### Opportunities

1. **[Opportunity Name]** — [Description] — [How to capitalize]
2. **[Opportunity Name]** — [Description] — [How to capitalize]

---

## Recommendations & Next Steps

### Immediate Actions (This Week)

1. [Action] — Owner: [Name] — Deadline: [Date]
2. [Action] — Owner: [Name] — Deadline: [Date]

### Strategic Focus (This Month)

1. [Initiative] — [Goal] — [Owner]
2. [Initiative] — [Goal] — [Owner]

### Forecast Next Month

- **Expected Closed Revenue:** $[X]M ([based on pipeline × conversion rates])
- **Confidence Level:** [High / Medium / Low]
- **Confidence Drivers:** [Pipeline strength, rep ramp progress, seasonal factors, etc.]

---

## Appendix: Detailed Rep Metrics

[Detailed table: one row per rep with all tracked metrics]

---
