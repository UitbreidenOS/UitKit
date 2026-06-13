---
name: metrics-analyzer
description: Analyzes product health metrics (retention, activation, feature adoption, churn signals). Identifies trends, anomalies, and business-critical changes. Returns dashboard summary with actionable insights and risk flags.
allowed-tools: Read, Write, WebSearch
effort: high
---

# Metrics Analyzer

## When to activate

Reviewing product health weekly or monthly. You have access to dashboards, analytics exports, or CSV data tracking retention, activation, churn, feature adoption, engagement, and cohort trends. Activation requires recent metric snapshots (last 7–90 days) and baseline comparison data.

## When NOT to use

Not for real-time alerting or incident response—this is for retrospective analysis. Not for UI/UX metrics unrelated to business health. Not without access to actual data (do not invent metrics). Not for forecasting beyond trend extrapolation. Not for building dashboards—use this to interpret existing ones.

## Metrics Framework

**Core Health Metrics:**
- **Retention (Month-over-month):** % of active users from month N who return in month N+1
- **Activation (30-day):** % of new users who reach core activation event (first valuable interaction)
- **Churn:** Monthly % of active accounts ceasing usage
- **Feature Adoption:** % of eligible users adopting key features
- **NRR (Net Revenue Retention):** Revenue expansion vs. contraction in cohort
- **CAC Payback:** Months for revenue to exceed acquisition cost

**Red Flags:**
- Retention declining 5%+ month-over-month
- Activation stuck below 25%
- Churn increasing above baseline by 2%+
- Feature adoption 3+ weeks below previous releases
- NRR declining; negative expansion signals

## Analysis Checklist

1. **Trend identification:** Is the metric improving, flat, or declining over last 3 months?
2. **Cohort breakdown:** Which customer segments show strongest/weakest performance?
3. **Feature correlation:** Did metric changes coincide with feature releases, pricing changes, or team changes?
4. **Anomaly detection:** Unexpected spikes or drops—root cause hypothesis?
5. **Benchmark comparison:** How does current performance vs. industry benchmarks and your prior year?
6. **Risk scoring:** Is this metric trending toward a risk threshold (e.g., churn >10%)?

## Output Format

```markdown
## Product Health Dashboard

**Analysis Period:** [Date Range]
**Data Freshness:** [Last Updated]

---

### Retention

**Current:** [X%] | **Baseline (3mo avg):** [X%] | **Trend:** [↑ improving / → flat / ↓ declining]
**YoY:** [Change %]

**Cohort Breakdown:**
| Cohort | Retention | Trend |
|---|---|---|
| [Customer Segment] | [X%] | [↑/→/↓] |

**Insight:** [1–2 sentence summary of what's driving trend]
**Risk Level:** [HEALTHY / CAUTION / CRITICAL]

---

### Activation (30-day)

**Current:** [X%] | **Baseline:** [X%] | **Trend:** [↑/→/↓]

**Bottleneck Analysis:**
- [User journey step 1]: [X%] → [X%] (drop: [X%])
- [User journey step 2]: [X%] → [X%] (drop: [X%])

**Insight:** [What's blocking activation?]
**Recommendation:** [1–2 focus areas to improve]

---

### Churn

**Monthly Churn:** [X%] | **Baseline:** [X%] | **Trend:** [↑/→/↓]

**Top Churn Reasons (if available):**
1. [Reason] — [Count] accounts
2. [Reason] — [Count] accounts

**Insight:** [Churn direction and key drivers]
**Risk Level:** [HEALTHY / CAUTION / CRITICAL]

---

### Feature Adoption (Key Features)

| Feature | Adoption | Launched | Trend | Notes |
|---|---|---|---|---|
| [Feature Name] | [X%] | [Date] | [↑/→/↓] | [Adoption vs. expected] |

**Lagging Adoption:** [List features 3+ weeks below targets]
**Insight:** [Why adoption is slower than expected]

---

### NRR & Expansion

**NRR:** [X%] | **Baseline:** [X%] | **Trend:** [↑/→/↓]
**Expansion Bookings:** $[X] | **Contraction:** $[X]

**Insight:** [Health of growth loop]

---

### Business Risk Assessment

| Risk | Severity | Trend | Action |
|---|---|---|---|
| [Metric Name] trending below threshold | [HIGH / MEDIUM / LOW] | [↑/→/↓] | [Immediate focus area or watch] |

---

## Key Findings

1. **Strength:** [What's performing well]
2. **Concern:** [What requires attention]
3. **Opportunity:** [Where to focus this period]

**Next Steps:** [1–3 prioritized actions based on metrics]

---
```

## Example

### Product Health Dashboard

**Analysis Period:** May 1–31, 2026
**Data Freshness:** June 1, 2026

---

### Retention

**Current:** 88% | **Baseline (3mo avg):** 90% | **Trend:** ↓ declining
**YoY:** -2%

**Cohort Breakdown:**
| Cohort | Retention | Trend |
|---|---|---|
| Enterprise (>500 emp) | 94% | → flat |
| Mid-market (50–500 emp) | 89% | ↓ declining |
| SMB (<50 emp) | 78% | ↓ declining |

**Insight:** Retention is slipping in SMB segment, likely due to lack of SMB-specific features introduced in Q2. Enterprise stable; mid-market showing stress.
**Risk Level:** CAUTION

---

### Activation (30-day)

**Current:** 28% | **Baseline:** 32% | **Trend:** ↓ declining

**Bottleneck Analysis:**
- First login → first action: 94% → 92% (drop: 2%)
- First action → core activation (create [X]): 92% → 31% (drop: 61%)
- Core activation → ongoing use: 31% → 28% (drop: 3%)

**Insight:** Biggest drop is at "core activation" step—users are logging in but not creating their first [X]. Likely caused by onboarding flow friction introduced in v2.1 last week.
**Recommendation:** Review onboarding UX; test single-click creation vs. multi-step form.

---

**Next Steps:**
1. Prioritize SMB retention feature (targeting Q3)
2. Fix onboarding friction—revert to v2.0 form or A/B test single-click
3. Schedule deep-dive on mid-market churn reasons

---
