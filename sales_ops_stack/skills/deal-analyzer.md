---
name: deal-analyzer
description: Deep-analyzes a specific deal to assess risk, probability, advancement readiness, and next actions. Evaluates stage fit, stakeholder engagement, competitive position, and identifies missing criteria. Returns scoring recommendation and escalation path.
allowed-tools: Read, Write, WebFetch
effort: medium
---

## When to activate

Before advancing a deal to the next stage, when a deal is flagged by risk detector, or when assessing high-value opportunities (>$100K). Provides executive clarity on deal health and advancement probability.

## When NOT to use

Not for pipeline-wide analysis — use pipeline-auditor instead. Not for forecasting — use forecast-builder. Not for new rep coaching — use ramp-tracker.

## Deal Analysis Checklist

Execute these eight steps in order to score the deal.

1. **Deal Snapshot** — Account name, deal value, current stage, days in stage, deal owner, target close date
2. **Stage Fit Assessment** — Validate current stage against criteria; check if deal meets progression gates
3. **Probability Scoring** — Evaluate deal against probability model for current stage; calculate risk-adjusted revenue
4. **Stakeholder Engagement Map** — Identify champion, economic buyer, blocker; assess engagement level (Low/Medium/High)
5. **Competitive Position** — Identify competing solutions; assess win probability vs. competition; note any threats
6. **Cycle Time Analysis** — Days in current stage vs. baseline; flag if exceeds by >50%
7. **Next Action Identification** — Identify blocking issue and specific next action for advancement
8. **Risk Scoring** — Aggregate risk factors; calculate overall deal risk (Low/Medium/High); recommend escalation if needed

## Deal Score Card Template

Save as `deals/[deal-id]-analysis.md`

```markdown
# Deal Analysis — [Deal ID]

**Analysis Date:** [timestamp]
**Deal Owner:** [rep name]
**Last Updated:** [from CRM]
**Analysis Type:** [Pre-stage advancement / Risk escalation / Forecast review]

---

## Deal Snapshot

| Field | Value |
|---|---|
| **Account Name** | [Company] |
| **Deal Value** | $[X]K |
| **Current Stage** | [Stage] |
| **Days in Stage** | [X] days |
| **Target Close Date** | [Date] |
| **Probability (Current)** | [X]% |
| **Sales Rep** | [Name] |
| **Created Date** | [Date] |
| **Last Activity Date** | [Date] |
| **Days Since Activity** | [X] days [Alert if >14] |

---

## Stage Fit Assessment

**Current Stage:** [Stage]  
**Baseline Cycle Time:** [X] days  
**Days in Stage (Actual):** [X] days  
**Variance:** [+/-X days] [Alert if >+50%]

**Stage Progression Criteria:**

| Criterion | Required | Status | Evidence |
|---|---|---|---|
| [Criterion 1] | [Yes/No] | [Met / Not Met] | [e.g., Discovery meeting completed] |
| [Criterion 2] | [Yes/No] | [Met / Not Met] | [e.g., Budget confirmed] |
| [Criterion 3] | [Yes/No] | [Met / Not Met] | [e.g., Stakeholder aligned] |
| [Criterion 4] | [Yes/No] | [Met / Not Met] | [e.g., RFP issued] |

**Gate Assessment:** [✓ Ready to advance / ✗ Not ready — blockers identified]

---

## Probability Scoring

**Stage-Based Probability Model:**

| Stage | Model Probability | Current Deal Probability | vs. Model | Notes |
|---|---|---|---|---|
| Prospect | 15% | [X]% | [+/-X%] | [If variance >±20%, investigate reason] |
| Qualification | 35% | [X]% | [+/-X%] | [If variance >±20%, investigate reason] |
| Solution Design | 60% | [X]% | [+/-X%] | [If variance >±20%, investigate reason] |
| Negotiation | 80% | [X]% | [+/-X%] | [If variance >±20%, investigate reason] |

**Probability Justification:**
- If >model probability: [Why is deal stronger than average for this stage?]
- If <model probability: [What risks are reducing probability?]

**Risk-Adjusted Revenue:**
- Deal value: $[X]K
- Probability: [X]%
- Risk-adjusted revenue: $[X]K ([calculated as: value × probability])

---

## Stakeholder Engagement Map

| Role | Name | Title | Company | Engagement Level | Notes |
|---|---|---|---|---|---|
| **Champion** | [Name] | [Title] | [Company] | [Low / Medium / High] | [Reason: problem ownership, recent hire, urgency signal] |
| **Economic Buyer** | [Name] | [Title] | [Company] | [Low / Medium / High] | [Budget authority, approval power] |
| **Blocker** | [Name] | [Title] | [Company] | [Low / Medium / High] | [Potential objection, legacy system concern, process owner] |
| **Influencer** | [Name] | [Title] | [Company] | [Low / Medium / High] | [Technical validator, user advocate] |

**Engagement Assessment:**
- **Champion Engagement:** [Low / Medium / High] — [Action if Low]
- **Economic Buyer Engagement:** [Low / Medium / High] — [Action if Low]
- **Blocker Mitigation:** [Strategy to address blocker]
- **Consensus Level:** [Low / Medium / High] — [Alert if Low before Negotiation]

---

## Competitive Position

**Primary Competitor:** [Name]  
**Secondary Competitors:** [List]  
**Competitive Threat Level:** [Low / Medium / High]

| Competitor | Win Probability vs. Us | Key Differentiator | Our Advantage |
|---|---|---|---|
| [Name] | [X]% | [Their strength] | [Our strength] |
| [Name] | [X]% | [Their strength] | [Our strength] |

**Competitive Strategy:**
- [Gap to address]
- [Proof point to highlight]
- [Objection handler needed]

---

## Cycle Time Analysis

| Stage | Baseline Avg Days | Current Deal (Days in Stage) | Variance | Status |
|---|---|---|---|---|
| Prospect | [X] | [X] | [+/-X%] | [✓ or Alert if >+50%] |
| Qualification | [X] | [X] | [+/-X%] | [✓ or Alert if >+50%] |
| Solution Design | [X] | [X] | [+/-X%] | [✓ or Alert if >+50%] |
| Negotiation | [X] | [X] | [+/-X%] | [✓ or Alert if >+50%] |

**Total Deal Age:** [X] days from creation  
**Expected Close Date (based on baseline):** [Date]  
**Target Close Date (stated):** [Date]  
**Days Ahead/Behind Baseline:** [+/-X] days

---

## Risk Assessment

### Risk Factors

| Risk Factor | Present | Severity | Mitigation |
|---|---|---|---|
| Long cycle time (>baseline +50%) | [Yes/No] | [Low/Med/High] | [Action] |
| No activity >14 days | [Yes/No] | [Low/Med/High] | [Action] |
| Probability drift (vs. model) | [Yes/No] | [Low/Med/High] | [Action] |
| Low stakeholder engagement | [Yes/No] | [Low/Med/High] | [Action] |
| High competitive threat | [Yes/No] | [Low/Med/High] | [Action] |
| Missing stage criteria | [Yes/No] | [Low/Med/High] | [Action] |
| Deal size >rep historical avg | [Yes/No] | [Low/Med/High] | [Action] |
| Close date in past | [Yes/No] | [Low/Med/High] | [Action] |

### Overall Deal Risk Rating

**Risk Score:** [Low / Medium / High]

**Low Risk:** All criteria met, stakeholders engaged, probability aligned, cycle time normal, no competitive threats  
**Medium Risk:** 1–2 risk factors present, minor criteria gaps, timeline pressure, competitive threat  
**High Risk:** 3+ risk factors, missing champion/economic buyer engagement, probability drift >20%, or close date overdue

---

## Next Actions

**Immediate (Next 48 hours):**
1. [Specific action, owner, deadline]
2. [Specific action, owner, deadline]

**This Week:**
1. [Specific action, owner, deadline]
2. [Specific action, owner, deadline]

**Blocking Issue:** [Single most critical blocker to advancement]  
**Escalation Needed:** [Yes/No] — [If yes, who and why]

---

## Stage Advancement Recommendation

**Ready to Advance?** [Yes / No / Conditional]

- **Yes:** [Reason — all criteria met, stakeholders engaged, probability justified]
- **No:** [Reason — list missing criteria; recommend specific actions before re-assessment]
- **Conditional:** [Reason — meets criteria if X action is completed by X date]

**If advancing:** Log stage transition with reason to session log.  
**If not advancing:** Provide rep with specific unblock action; schedule re-assessment in [X] days.

---

## Approval Gate (for deals >$100K)

**VP Sales Approval Required?** [Yes / No]

If >$100K and advancing to Negotiation:
- Approver: [Name]
- Approval Date: [Filled by human]
- Approval Status: [Pending / Approved]

---

## Historical Deal Comparison

**Rep's Typical Deal Profile:**
- Avg deal size: $[X]K
- Avg cycle time: [X] days
- Avg close rate: [X]%

**This Deal vs. Rep Avg:**
- Deal size: [Aligned / Larger / Smaller]
- Cycle time: [Aligned / Longer / Faster]
- Complexity: [Aligned / Higher / Lower]

---
