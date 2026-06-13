---
name: quota-tracker
description: Tracks rep-by-rep quota progress toward target. Decomposes shortfalls into root causes (activity gap, win rate, deal size, new vs. expansion). Projects quarter-end attainment with recovery actions.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Monthly after month-close or weekly during critical periods. Use to identify reps trending toward miss and surface early coaching opportunities. Requires sales rep activity and pipeline data.

## When NOT to use

Not for individual deal assessment — use deal-risk-analyzer. Not for territory design — use territory-optimizer. Not for comp plan auditing — use sales-compensation-auditor.

## Quota Decomposition Framework

When a rep is trending toward miss, isolate root cause:

### Activity Gap Analysis

**Formula:**
- Target activities per rep per month (based on sales cycle / deal size)
- Actual activities (calls, emails, meetings)
- Variance: Actual / Target

**Scoring:**
- >100% activities: On track for activity volume
- 80–100% activities: Slightly behind; needs pickup
- <80% activities: Significant activity deficit

**Recovery:** Increase daily activity KPIs. Set weekly call / meeting targets. Implement activity-based coaching.

### Win Rate Decomposition

**Formula:**
- Closed-Won / (Closed-Won + Closed-Lost)
- Compare to rep benchmark vs. team benchmark

**Scoring:**
- Rep win rate >= team win rate: Performing at standard
- Rep win rate 5–10% below team: Needs qualification coaching
- Rep win rate >10% below team: Deal selection or execution issue

**Recovery:** If deal selection issue, tighten qualification gates. If execution issue, role-play close techniques or review recent losses.

### Deal Size Trending

**Formula:**
- Average deal size (current period) vs. quota assumption
- New business vs. expansion deal mix

**Scoring:**
- Deal size = quota assumption: On track
- Deal size 10–20% below assumption: Likely due to market or territory design
- Deal size >20% below assumption: Rep may be chasing small deals to hit activity targets

**Recovery:** Reposition focus on larger opportunities. Adjust territory accounts upmarket.

### New vs. Expansion Mix

**Formula:**
- Revenue from new business / Total revenue
- Revenue from account expansion / Total revenue

**Scoring by Industry:**
- Enterprise SaaS: 50/50 new vs. expansion is healthy
- SMB SaaS: 70/30 new-heavy is common
- Maturity of territory determines healthy split

**Recovery:** If overweight in new business, focus customer success on expansion pipeline. If expansion-heavy, backfill with new logos.

---

## Quota Tracker Report Template

```markdown
# Quota Tracking Report — [Month] [Year]

**Reporting Date:** [Date]  
**Period:** [Month/Quarter]  

---

## Summary Table

| Rep | Closed YTD | Target YTD | % Target | Forecast Remaining | Q-End Projection | Status |
|-----|-----------|-----------|----------|------------------|-----------------|--------|
| [Rep 1] | [Val] | [Val] | [%] | [Val] | [%] | [Color] |
| [Rep 2] | [Val] | [Val] | [%] | [Val] | [%] | [Color] |
| Team | [Val] | [Val] | [%] | [Val] | [%] | [Color] |

---

## Red Flag Reps (>20% Below Pro-Rata Target)

### [Rep Name] — [% Below Quota]

**Current Status:** [Closed to date] / [Quarterly quota] = [%]

**Root Cause Analysis:**
- Activity Level: [Analysis]. Target: [X] calls/meetings. Actual: [X]. Gap: [%].
- Win Rate: [Analysis]. Rep rate: [%]. Team rate: [%]. Variance: [%].
- Deal Size: [Analysis]. Rep avg: [Value]. Team avg: [Value]. Variance: [%].
- Business Mix: New business [%] / Expansion [%] vs. target [%] / [%].

**Recovery Plan:**
1. [Action] — Owner: [Manager]. Deadline: [Date]. Expected impact: $[Value].
2. [Action] — Owner: [Manager]. Deadline: [Date]. Expected impact: $[Value].

---

## Yellow Flag Reps (10–20% Below Pro-Rata Target)

| Rep | Status | Root Cause | Recovery Action |
|-----|--------|-----------|-----------------|
| [Rep] | [%] | [Primary cause] | [Action + Owner + Deadline] |

---

## On-Track Reps (>90% Pro-Rata Target)

[List reps on track; identify any standout practices worth scaling]

---

## Team-Level Insights

- **Overall Team Attainment:** [%] of target
- **Team Win Rate:** [%] (target: [%])
- **Avg Deal Size:** $[Value] (target: $[Value])
- **Pipeline Coverage:** [X]x quota remaining in opportunities
- **Forecast Confidence:** [%] (based on forecast accuracy analysis)

---

## Next Steps

- [Action item 1] — Owner — Deadline
- [Action item 2] — Owner — Deadline
```

---

## Example

# Quota Tracking Report — June 2026

**Reporting Date:** 2026-06-12  
**Period:** Q2 2026 (through June)  

---

## Summary Table

| Rep | Closed YTD | Target YTD | % Target | Forecast Remaining | Q-End Projection | Status |
|-----|-----------|-----------|----------|------------------|-----------------|--------|
| Sarah K | 210K | 225K | 93% | 95K | 101% | Green |
| Mike T | 145K | 225K | 64% | 55K | 71% | Red |
| David M | 180K | 225K | 80% | 75K | 91% | Yellow |
| Team | 535K | 675K | 79% | 225K | 88% | Yellow |

---

## Red Flag Reps (>20% Below Pro-Rata Target)

### Mike T — 36% Below Quota

**Current Status:** $145K closed / $225K quarterly quota = 64%

**Root Cause Analysis:**

**Activity Level:** Significant deficit. Target: 8 discovery calls + 4 demos per week. Actual: 4 calls + 1 demo per week. **Gap: −50%.** Issue: Rep working only 3 days/week due to personal project. Not communicated to manager until now.

**Win Rate:** 40% (Mike) vs. 58% (team average). **Variance: −18%.** Indicates deal selection or qualification issue. Losses are clustering around pricing/budget objections (60% of losses), suggesting Mike is advancing deals too early before budget confirmed.

**Deal Size:** $18K average (Mike) vs. $21K average (team). **Variance: −14%.** Consistent with activity deficit — chasing volume over value.

**Business Mix:** 75% new business / 25% expansion (Mike) vs. 55% / 45% team average. Over-indexed on new logos; missing expansion upsell opportunities in existing accounts.

**Recovery Plan:**
1. **Immediate:** 1:1 with manager to understand personal project impact. Clarify expectation: full-time sales commitment or transition out. Owner: Sales Manager. Deadline: Monday.
2. **If staying:** Activity Intensive (2-week sprint). Daily standup. Target: 10 discovery calls + 5 demos per week to close gap. Owner: Manager. Deadline: June 26.
3. **Qualification Coaching:** Role-play budget discovery call. Focus on "when do you have budget?" as gate before advancing to demo. Owner: Sales Manager. Deadline: June 13 (1-on-1).
4. **Expansion Mining:** Identify 5 existing accounts in Mike's territory with upsell potential. Schedule account expansion calls. Owner: Mike + CS. Deadline: June 19.

**At-Risk:** If Mike doesn't demonstrate activity pickup by June 26, escalate to VP for decision: performance plan vs. transition.

---

## Yellow Flag Reps (10–20% Below Pro-Rata Target)

| Rep | Status | Root Cause | Recovery Action |
|-----|--------|-----------|-----------------|
| David M | 80% | Cycle time elongation (avg 185d, up from 155d). Deals stalling in Proposal stage. | 1) Identify 3 stalled proposals; schedule buyer check-in calls. 2) Tighten proposal turnaround to <5 days. Owner: David M + Manager. Deadline: June 19. Expected impact: +$45K. |

---

## On-Track Reps (>90% Pro-Rata Target)

**Sarah K — 93% YTD, projected 101% by quarter-end**

Standout practices:
- Highest win rate on team: 62% (vs. 58% team avg). Excellent deal qualification.
- Deal size: $23K average (highest on team). Focused on larger opportunities.
- Activity: 12 discovery calls/week (above target). Consistent pipeline generation.

**Recommendation:** Mentor other reps on qualification technique. Ask Sarah to lead monthly deal review coaching session.

---

## Team-Level Insights

- **Overall Team Attainment:** 79% of pro-rata target (on track for 88% quarter-end, vs. 95% target)
- **Team Win Rate:** 58% (healthy; on par with industry baseline)
- **Avg Deal Size:** $21K (in-line with $22K quota assumption)
- **Pipeline Coverage:** 3.2x remaining quota in open opportunities (healthy; target 3.5x)
- **Forecast Confidence:** 72% (reps underforecasting — conservative estimates, which is positive for miss risk)

---

## Next Steps

- **June 13:** 1:1 with Mike T — determine commitment level and activation plan.
- **June 19:** Weekly team standup — review deal stalls and activity levels.
- **June 26:** Reassess Mike T progress. VP decision point if no improvement.
- **June 30:** Final quarter-end push. Deploy retention incentive or emergency pricing for at-risk deals.

---
