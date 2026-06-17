---
name: retention-analyst
description: Analyzes attrition trends, identifies flight risks, and recommends stay interventions. Outputs retention-analysis-{date}.md with cohort breakdowns and risk assessment.
allowed-tools: Read, Write, WebSearch
effort: medium
---

## When to activate

Quarterly or when attrition rate exceeds target. Analyzes employee data to uncover departure patterns and predict flight risk.

## When NOT to use

Not for termination decisions or performance management. Not for compensation analysis — use compensation-analyzer for that. Not as substitute for stay interviews with at-risk individuals.

## Retention Analysis Checklist

Execute in order:

1. **Gather headcount and attrition data** — Current headcount by team/level; separations (voluntary, involuntary, planned) for past 12–24 months
2. **Calculate key metrics** — Voluntary attrition rate %, regrettable vs. non-regrettable, tenure distribution
3. **Cohort analysis** — Break down by hire class (when hired), team, level, tenure, demographics (optional)
4. **Identify patterns** — Which cohorts have high exit rates? Any seasonal trends?
5. **Root cause analysis** — Why are people leaving? Conduct stay interviews with at-risk employees
6. **Segment at-risk population** — Who shows early warning signs? (low engagement, high external activity, recent conflicts)
7. **Model intervention impact** — What's the ROI of a $10K retention bonus vs. cost of replacing?
8. **Recommend actions** — Compensation, career path, role redesign, management change, etc.

---

## Key Metrics & Definitions

### Voluntary Attrition Rate

**Formula:** (# voluntary separations in period) / (average headcount) × 100

**Example:** 2 voluntary departures ÷ 50 avg headcount = 4% quarterly attrition = 16% annualized

**Benchmark:** 12–13% annual voluntary attrition (SaaS). Lower is better; >15% indicates problems.

### Regrettable vs. Non-Regrettable

**Regrettable:** High performer who leaves (cost of replacement: $100K+). Preventable.

**Non-regrettable:** Underperformer or misfit who leaves (cost of replacement: $40K, saves management effort).

**Example breakdown:**
- Total voluntary departures: 5
- Regrettable (want them to stay): 3 (high performers, key roles)
- Non-regrettable (OK they left): 2 (underperformers, role misfit)

**Target:** <30% of departures non-regrettable (meaning most exits are unwanted losses).

### Tenure Cohort Analysis

**Cohort:** Group hired in same period (e.g., "Q1 2024 hires").

**Track:** At 6 months, 12 months, 24 months: how many are still with company?

**Example:**
- Q1 2024: 10 hires → 6 months: 9 remaining (90% retention) → 12 months: 8 remaining (80% retention)
- Q3 2023: 8 hires → 12 months: 5 remaining (62% retention) ← cohort issue; onboarding problem?

**Benchmark:** Aim for >90% at 6 months, >80% at 12 months (SaaS).

---

## Attrition Root Cause Categories

When analyzing departures, categorize by stated reason:

| Root Cause | Signal | Prevention |
|---|---|---|
| **Compensation/equity** | "I got an offer for 20% more" | Benchmark regularly; stay competitive; refresh equity grants |
| **Growth ceiling** | "No clear path to next level" | Transparent career ladder; manager coaching on growth; succession planning |
| **Management** | "My manager and I didn't align" | Manager training; 360 feedback; skip-level check-ins |
| **Work-life balance** | "Too much on-call / burnout" | Workload assessment; role adjustment; team sizing |
| **Culture fit** | "Values misalignment" or "remote became in-office" | Hiring clarity on culture; flexibility options; team dynamics |
| **Career shift** | "Going back to school" or "industry change" | Natural; non-regrettable |
| **Personal/family** | "Relocation" or "spouse's job" | Understand context; may offer return option |
| **Opportunity elsewhere** | "Better project/role fit at competitor" | Understand what we're missing; competitive positioning |

**Track ratio:** If >40% compensation-driven, you have a pay problem. If >30% management-driven, you have a people manager problem.

---

## Flight Risk Assessment Framework

### Early Warning Signs

Employees showing multiple of these indicators warrant stay interview:

| Signal | Severity | How to Monitor |
|--------|----------|---|
| Reduced engagement (less speaking in meetings, low energy) | Medium | Manager observation; skip-level 1:1 |
| Active job search (LinkedIn activity, interview scheduling) | High | Recruiter intel, LinkedIn alerts, colleague mentions |
| Recent conflict or performance issue | Medium–High | Manager feedback; performance review notes |
| Started external projects (consulting, side gig) | Medium | Casual observation; work agreement review |
| Declined stretch assignment or promotion | Medium | Manager discussion; understand "why not" |
| Frequent "quiet quitting" signals (minimal contribution, boundary-setting) | Low–Medium | Manager feedback; productivity trends |
| Anniversary of major milestone (1-year, 2-year, 5-year) | Low | Data; some departures cluster post-milestone |
| Expressed frustration with process, pay, growth | Low–Medium | 1:1 feedback; manager notes |

### Retention Risk Score

Create a risk score (1–10) for each at-risk employee:

```
Risk Score = (Signal A × weight) + (Signal B × weight) + ...

Where:
- Active job search = 3 points
- Recent conflict = 2 points
- No promotion past due date = 2 points
- Engagement drop = 1 point
- Below-market compensation = 2 points
- Manager turnover (recent change) = 1 point
- <1 year tenure = 1 point

Score 6–7 = Monitor closely
Score 8–10 = Engage stay interview immediately
```

---

## Retention Analysis Output Template

```markdown
# Retention Analysis — [Period] [Year]

**Prepared:** [YYYY-MM-DD]
**Analysis Period:** [e.g., Jan–June 2026]
**Prepared for:** [CEO, Leadership Team, HR]

---

## Executive Summary

**Voluntary attrition rate:** [X]% for period (annualized: [Y]%)
**Benchmark:** 12–13% annual target
**Status:** [On target / Above target / Below target / URGENT]

**Key findings:**
- [Finding 1: e.g., "Cohort hired Q1 2025 has 35% attrition — onboarding issue"]
- [Finding 2: e.g., "Engineering team losing senior ICs to competitor offers"]
- [Finding 3: e.g., "Non-regrettable attrition is 60% — many underperformers left, which is good"]

---

## Headcount Summary

| Period | Headcount Start | Hires | Voluntary Departures | Involuntary | Headcount End | Voluntary Attrition % |
|--------|---|---|---|---|---|---|
| Q1 2026 | 120 | 8 | 2 | 1 | 125 | 1.6% |
| Q2 2026 | 125 | 6 | 3 | 0 | 128 | 2.3% |
| **YTD** | **120** | **14** | **5** | **1** | **128** | **2.0% (annualized: 8%)** |

---

## Attrition by Team

| Team | Headcount | Voluntary Departures | Attrition % | Benchmark | Status |
|------|-----------|---|---|---|---|
| Engineering | 60 | 2 | 3.3% | 10% | Good |
| Product | 12 | 1 | 8.3% | 12% | Good |
| Sales | 20 | 1 | 5% | 15% | Good |
| Marketing | 15 | 1 | 6.7% | 12% | Good |
| Operations | 8 | 0 | 0% | 12% | Excellent |
| Finance | 5 | 0 | 0% | 12% | Excellent |
| **TOTAL** | **120** | **5** | **4.2%** | **12%** | **On target** |

---

## Attrition by Level

| Level | Headcount | Departures | Attrition % | Concern Level |
|-------|-----------|---|---|---|
| L1 (Junior IC) | 25 | 2 | 8% | Monitor (typical for junior) |
| L2 (Senior IC) | 45 | 2 | 4.4% | Good |
| L3+ (Staff+) | 15 | 1 | 6.7% | Monitor (losing experience) |
| Manager | 20 | 0 | 0% | Excellent |
| Director+ | 5 | 0 | 0% | Excellent |

---

## Cohort Retention Analysis

| Hire Class | Hired | At 6 Mo | At 12 Mo | Current | Retention |
|---|---|---|---|---|---|
| **Q1 2025** | 12 | 11 (92%) | 9 (75%) | 8 (67%) | ⚠️ Low |
| **Q2 2025** | 14 | 13 (93%) | 12 (86%) | 11 (79%) | Medium |
| **Q3 2025** | 10 | 9 (90%) | 8 (80%) | 8 (80%) | Good |
| **Q4 2025** | 8 | 7 (88%) | 7 (88%) | 7 (88%) | Good |
| **Q1 2026** | 8 | 8 (100%) | N/A | 8 (100%) | Excellent |

**Insight:** Q1 2025 cohort has retention problem. Likely onboarding or role-fit issue. All left by month 15.

---

## Recent Departures & Exit Analysis

| Employee | Title | Tenure | Regrettable | Stated Reason | Actual Reason (inferred) |
|---|---|---|---|---|---|
| Jane Doe | Senior Engineer | 3.2 years | Yes | "Better opportunity" | Competitor offer + no clear path to Staff |
| John Smith | Product Analyst | 1.8 years | No | "Career change" | Underperformer; leaving for non-PM role |
| Sarah Chen | Marketing Manager | 2 years | Yes | "Relocation" | New job in LA; we didn't offer remote |
| Alex Rodriguez | Engineer | 0.9 years | No | "Personal" | Bad fit; silent quitting pattern |

**Regrettable departures:** 2/4 (50% regrettable rate — we're losing talent)

---

## Attrition Root Cause Summary

| Root Cause | Count | % | Action |
|---|---|---|---|
| Compensation/offer elsewhere | 1 | 20% | Benchmark salary; improve competitive positioning |
| Growth/career path | 1 | 20% | More clarity on promotion timeline |
| Relocation/personal | 1 | 20% | Offer flexibility; remote option |
| Culture/role fit | 1 | 20% | Improve hiring filtering; onboarding review |
| **Total** | **5** | **100%** | — |

---

## Flight Risk Assessment

**At-risk employees identified through signal analysis:**

### 🔴 High Risk (likely to leave in next 3 months)

**Employee:** [Name, Title]
**Signals:** Active job search (LinkedIn activity), recent conflict with manager, below-market compensation
**Risk Score:** 8/10
**Recommendation:** Stay interview this week. Understand concerns; offer: compensation review, role adjustment, or management change

### 🟡 Medium Risk (monitor closely)

**Employee:** [Name, Title]
**Signals:** Engagement drop (less speaking, boundary-setting), no promotion in 2+ years
**Risk Score:** 6/10
**Recommendation:** Manager check-in. Career path discussion. Growth opportunity or external coaching.

---

## Recommended Stay Interventions

### Immediate (Next 30 days)

1. **Conduct stay interviews with high-risk employees**
   - Ask: What's working? What would make you stay? What would make you leave?
   - Listen; don't negotiate yet
   - Document findings

2. **Compensation review for Q1 2025 cohort**
   - All left by month 15; likely underpaid relative to market
   - Benchmark salaries; identify compression vs. newer hires

3. **Manager 1:1s**
   - Discuss engagement signals
   - Train on retention conversations
   - Flag burnout/overload in specific teams

### Short-term (30–90 days)

4. **Strengthen career pathing**
   - Publish clear rubrics for promotion to L3, L4, etc.
   - Schedule growth conversations with high-performers
   - Offer stretch assignments

5. **Improve onboarding (Q1 2025 cohort learnings)**
   - Review and fix onboarding process
   - Extend ramp timeline if needed
   - Add mentor support for first 90 days

6. **Compensation adjustments**
   - For high-risk, regrettable departures: consider retention bonus or refresh
   - Budget: $100K for 1–2 critical retention packages (cheaper than recruiting)

### Ongoing (6+ months)

7. **Culture and flexibility initiatives**
   - Assess remote work policy
   - Review work-life balance (on-call rotation, workload)
   - Improve manager quality through training and feedback

---

## Retention ROI Analysis

**Cost of losing a senior engineer:**
- Recruiting: $6K
- Ramp for replacement: ~$50K (lost productivity, mentor time)
- Institutional knowledge loss: ~$20K (context, relationships)
- **Total: ~$76K**

**Cost of retention intervention (e.g., $10K bonus or 10% raise):**
- **$10K–15K**

**ROI:** Preventing one departure saves $60K+.

**Recommendation:** Invest in retention for high performers and critical roles. $100K retention budget (protecting 6–8 key people) likely prevents 2–3 departures, netting $120K+ in savings.

---

## Metrics Dashboard (Ongoing Tracking)

| Metric | Target | Current | Trend |
|--------|--------|---------|--------|
| Annual voluntary attrition | <13% | 8% | ✓ Green |
| Regrettable attrition (% of total) | <30% | 40% | ⚠️ Yellow (losing talent) |
| Retention at 6 months | >90% | 92% | ✓ Green |
| Retention at 12 months | >80% | 82% | ✓ Green |
| eNPS (employee engagement) | >40 | TBD | — |

---

## Next Steps

- [ ] Schedule stay interviews with 2 high-risk employees (by end of week)
- [ ] Conduct compensation benchmarking for Q1 2025 cohort (by EOG)
- [ ] Manager training on retention conversations (next 2 weeks)
- [ ] Publish career ladders and growth criteria (by end of quarter)
- [ ] Review onboarding process with team that had low retention (this sprint)
- [ ] Follow-up retention analysis (next quarter)

---
