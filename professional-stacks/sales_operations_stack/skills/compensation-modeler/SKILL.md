---
name: compensation-modeler
description: Commission accrual simulation, payout forecasts, plan design validation, dispute audit trails, and what-if modeling for compensation changes. Tracks all changes for compliance.
allowed-tools: Read, Write
effort: high
---

## When to activate

Monthly commission accrual, quarterly plan design review, or on-demand for what-if modeling. Requires commission plan structure and deal close data.

## When NOT to use

Not for individual rep coaching (use quota-tracker). Not for general finance (use finance team). Non-negotiable: All commission changes require documented audit trail.

## Commission Accrual Framework

**Accrual calculation:**
- Deal close date = trigger for accrual (not payment date)
- Commission = Deal value × commission rate (varies by quota attainment or segment)
- Accrual timing: Monthly reconciliation; monthly payout if deal revenue recognized

**Dispute resolution:**
- Commission only paid if: deal recorded in CRM, customer signed contract, revenue recognized by finance
- Dispute = documented conversation between rep and manager, escalated to comp lead with evidence
- All disputes logged with: date, rep, deal, claimed vs. actual, resolution, approver

## Output Template

```markdown
# Commission Accrual Report — {Month}

**Pay Period:** {Date range}  
**Report Date:** {Date}

---

## Summary

| Metric | Value |
|---|---|
| Total Commissionable Deals Closed | {N} |
| Total Gross Commission | ${} |
| Top Earner | {Rep} — ${} |
| Avg Commission per Rep | ${} |

---

## Rep Accrual Breakdown

| Rep | Deals | GrossRevenue | CommRate | Commission | YTD Accrued | Status |
|---|---|---|---|---|---|---|
| {Name} | {N} | ${} | {%} | ${} | ${} | Paid |

---

## Disputed Commissions (Audit Trail)

| Rep | Deal | Claimed | Actual | Variance | Reason | Status | Approver |
|---|---|---|---|---|---|---|---|
| {Rep} | {Deal ID} | ${} | ${} | ${} | [Note] | Resolved | {Name} |

---

## What-If: Proposed Plan Change

**Current:** Base: 0, OTE: $100K, Commission: 5% quota achievement 80–120%, 7% >120%  
**Proposed:** Base: $20K, OTE: $100K, Commission: 6% quota 80–120%, 8% >120%

**Impact (12-month projection):**
- Rep at 100% quota: Current $100K, Proposed $104K (+$4K/year)
- Rep at 150% quota: Current $110K, Proposed $114K (+$4K/year)
- Rep at 70% quota: Current $85K, Proposed $88K (+$3K/year)
- **Total cost increase:** {$X} / year

---

## Recommended Actions

- {Action}: {Recommendation}
```
