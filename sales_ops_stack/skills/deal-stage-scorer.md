---
name: deal-stage-scorer
description: Validates deal stage progression against qualification gates and criteria. Scores deal advancement readiness, flags missing requirements, and provides specific unblock actions. Quick-fire assessment for pre-stage-move validation.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Before every deal stage movement. Also on-demand when rep reports "ready to advance" but criteria are unclear. Provides quick yes/no with specific missing items if not ready.

## When NOT to use

Not for deep deal analysis — use deal-analyzer instead. Not for forecast impact — use forecast-builder. Use this for gate enforcement only.

## Stage Gate Definitions

### Gate 1: Prospect → Qualification

**Criteria (all required):**
- [ ] Initial discovery meeting completed (scheduled or held)
- [ ] Company/decision-maker identified
- [ ] Initial pain/need identified in conversation
- [ ] Contact info captured and verified
- [ ] Next meeting scheduled or email follow-up pending

**Time Target:** 0–1 week  
**Quick Check:** Has the prospect confirmed they have a problem we can solve?

---

### Gate 2: Qualification → Solution Design

**Criteria (all required):**
- [ ] Pain point confirmed by 2+ stakeholders
- [ ] Budget or budget source confirmed ("We have budget" / "We'll allocate budget")
- [ ] Timeline confirmed ("Want to implement by [date]")
- [ ] Authority/decision-maker identified (not just influencer)
- [ ] Initial product fit validation (product matches stated need)
- [ ] RFP or requirements document (if applicable) initiated

**Time Target:** 1–2 weeks  
**Quick Check:** Do we have confirmed pain, budget, and timeline?

---

### Gate 3: Solution Design → Negotiation

**Criteria (all required):**
- [ ] Proposal or detailed solution document delivered
- [ ] Technical/functional fit confirmed by customer team
- [ ] Economic buyer (budget owner) has reviewed proposal
- [ ] Preliminary pricing accepted ("In the ballpark" minimum)
- [ ] Competitive position assessed (no blockers or requires strategic response)
- [ ] Legal/procurement requirements identified

**Time Target:** 2–4 weeks  
**Quick Check:** Have we proven we can solve their problem at a price they accept?

---

### Gate 4: Negotiation → Closed/Won

**Criteria (all required):**
- [ ] Final pricing agreed and signed off by economic buyer
- [ ] Legal/contract review initiated or completed
- [ ] All stakeholder sign-offs obtained (champion, economic buyer, technical)
- [ ] Deal size, terms, and close date finalized in CRM
- [ ] Execution plan established (implementation timeline, key contacts)
- [ ] Executive sponsorship confirmed (if deal >$100K)

**Time Target:** 1–2 weeks  
**Quick Check:** Do we have signed contract or verbal commitment + date?

---

## Gate Scorecard Template

Save as `deals/[deal-id]-stage-check.md`

```markdown
# Stage Gate Scorecard — [Deal ID]

**Assessment Date:** [timestamp]
**Deal:** [Account Name] | [Deal Value]
**Current Stage:** [Stage]
**Proposed Move:** [To Stage]
**Assessed By:** [Rep or Sales Manager]

---

## Gate Criteria Checklist

### [Proposed Stage] Entry Requirements

| # | Criterion | Required | Status | Evidence | Notes |
|---|---|---|---|---|---|
| 1 | [Criterion 1] | Yes/No | [✓ Met / ✗ Missing] | [Evidence or "Not captured"] | [Gap action if missing] |
| 2 | [Criterion 2] | Yes/No | [✓ Met / ✗ Missing] | [Evidence or "Not captured"] | [Gap action if missing] |
| 3 | [Criterion 3] | Yes/No | [✓ Met / ✗ Missing] | [Evidence or "Not captured"] | [Gap action if missing] |
| 4 | [Criterion 4] | Yes/No | [✓ Met / ✗ Missing] | [Evidence or "Not captured"] | [Gap action if missing] |
| 5 | [Criterion 5] | Yes/No | [✓ Met / ✗ Missing] | [Evidence or "Not captured"] | [Gap action if missing] |
| 6 | [Criterion 6] | Yes/No | [✓ Met / ✗ Missing] | [Evidence or "Not captured"] | [Gap action if missing] |

---

## Advancement Readiness

**Criteria Met:** [X/6]

**Decision:** [✓ APPROVED / ✗ NOT READY]

---

## If Approved

**Stage Move Authorized:** [Yes]  
**Effective Date:** [Date]  
**Updated CRM:** [Yes / No]  
**Log Transition:** Log to session-log.md

---

## If Not Approved

**Missing Criteria Count:** [X]

**Missing Items (Unblock Plan):**
1. [Criterion X] — [Specific action to satisfy, owner, timeline]
2. [Criterion Y] — [Specific action to satisfy, owner, timeline]

**Re-Assessment Date:** [Date when unblock actions due]

**Alternative Path (if any):**
- [If criterion waivable with business case: who to ask, what case needed]

---

## Assessment Notes

[Any additional context: urgency signals, competitive pressure, customer sentiment, etc.]

---
