---
description: Deep dive analysis on a specific deal. Scores probability, risk factors, stage fit, and advancement readiness. Identifies missing criteria and next actions. Recommended before stage advancement or risk escalation.
---

# /analyze-deal [deal-id]

## What This Does

Runs the deal-analyzer skill to comprehensively assess a specific opportunity. Evaluates stage fit, probability scoring, stakeholder engagement, competitive position, cycle time, and risk factors. Provides advancement recommendation and escalation path.

## Steps Claude Follows

1. Ask for: Deal ID, account name, or deal owner (if ID not available)
2. Pull deal data from CRM: deal value, current stage, days in stage, probability, stakeholders, close date, last activity, competitive info
3. Run deal-analyzer skill — complete scorecard (snapshot, stage fit, probability scoring, stakeholder map, competitive position, cycle time, risk scoring)
4. Score deal advancement readiness: criteria checklist, risk rating, escalation recommendation
5. Save scorecard to `deals/[deal-id]-analysis.md`
6. Display summary with recommendation (Approve / Not Ready / Conditional)

## Summary Output Logic

**Advancement Recommendations:**

- **✓ APPROVED:** All criteria met, probability aligned with stage, stakeholders engaged (Medium+), no critical risks
- **⚠ CONDITIONAL:** Meets criteria if specific action completed by [date]; escalate if high-risk
- **✗ NOT READY:** 2+ missing criteria; provide unblock actions and re-assessment date

**Risk Ratings:**

- **Low Risk:** All green flags, stakeholders engaged, probability aligned, no competitive threats, cycle time normal
- **Medium Risk:** 1–2 risk factors, minor criteria gaps, timeline pressure, manageable competitive threat
- **High Risk:** 3+ risk factors, missing economic buyer, probability drift >20%, or close date overdue

## Output Format

### Deal Score Card
```
# Deal Analysis — [Deal ID]

## Deal Snapshot
- Account: [Company]
- Value: $[X]K
- Stage: [Current]
- Days in Stage: [X]
- Probability: [X]%
- Deal Owner: [Rep]

## Stage Fit Assessment
- Current Stage: [Stage]
- Days vs. Baseline: [+/-X%]
- Criteria Met: [X/6]
- Gate Status: [✓ Ready / ✗ Not Ready]

## Risk Score: [Low / Medium / High]
- Risks: [List 1–3 primary risks]
- Recommendation: [Approve / Not Ready / Conditional]

## Next Actions
1. [If not ready: specific unblock action, owner, deadline]
2. [If ready: next step after stage move]

## Stakeholder Engagement
- Champion: [Name/Status]
- Economic Buyer: [Name/Status]
- Blocker Mitigation: [Strategy]
```

### Executive Summary Line
```
Deal: [Company] | Value: $[X]K | Stage: [Current] | Risk: [Low/Med/High] | Recommendation: [Approve/Not Ready/Conditional]
```

---

## When to Run

**Required Scenarios:**
- Before any stage advancement (rep or manager initiated)
- When deal flagged by risk-detector hook (no activity >14 days, probability drift, etc.)
- When deal reaches high-risk amount threshold (>$100K)
- When deal misses original close date

**Optional Scenarios:**
- Weekly review of all Negotiation stage deals
- Monthly review of high-value deals (>$50K)
- Competitive threat or stakeholder change signal

---

## Required Data

- Deal ID and account name
- Current deal value, stage, probability
- Deal owner and close date (target and actual if missed)
- Last activity date
- Stakeholder names and titles (if known)
- Competitive intel (if available)
- Recent deal notes or call recordings (if available)

---

## Typical Time to Run

- **Data gathering:** 2–5 minutes (depends on CRM access)
- **Analysis:** 10–15 minutes (deal-analyzer skill)
- **Report generation:** 3–5 minutes (compile recommendation)
- **Total:** ~20 minutes

---

## Next Steps After Analysis

### If APPROVED (Ready to Advance)
- Log stage transition to session log
- Update CRM: move to next stage, update close date if applicable
- Notify rep and VP Sales of approval
- Document any special conditions or follow-ups
- Next action: Set timeline for next stage gate

### If CONDITIONAL (Ready if X action completed)
- Assign unblock action to deal owner
- Set deadline (typically 3–7 days for critical actions)
- Schedule re-assessment after action completed
- Add to risk tracker for follow-up
- Next action: Re-run analysis after unblock completion

### If NOT READY (Missing Criteria)
- Provide rep with specific unblock actions
- Schedule re-assessment (typically 7–10 days out)
- Add to deal review agenda for next 1:1
- Consider escalation if deal is high-value or repeatedly blocked
- Next action: Rep completes unblock actions; re-run analysis

---

## Risk Escalation Path

**If Risk = High:**
1. Notify VP Sales within 24 hours
2. Schedule deal deep-dive meeting (rep, manager, VP Sales)
3. Create mitigation plan: customer touchpoint, alternative approach, or decision to walk
4. Add to weekly risk report
5. Next action: Weekly check-in until risk resolved or deal closed/lost

**If Deal >$100K and advancing to Negotiation:**
1. Require VP Sales approval before moving to Negotiation
2. Document approval in deal scorecard
3. Next action: Track through contract negotiation closely

---

## Related Commands

- `/audit-pipeline` — For broader pipeline health context
- `/generate-forecast` — To understand deal's impact on forecast
- `/plan-territory` — If dealing with new rep struggles (coaching needed)

---
