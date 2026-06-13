---
name: deal-desk
description: "Deal desk: structure enterprise deals, review contract terms, set discount approval thresholds, analyse deal economics, and create commercial policy — for B2B sales operations"
updated: 2026-06-13
---

# Deal Desk Skill

## When to activate
- Structuring a complex enterprise deal (multi-year, custom terms, bundles)
- Reviewing a customer-proposed contract for commercial red flags
- Setting discount approval thresholds and escalation policies
- Analysing deal economics (margin, payback, LTV) before approving
- Creating or updating commercial policy (pricing guardrails, bundling rules)

## When NOT to use
- Legal contract review for compliance risk — use the vendor-contract-review or diligence-review skill
- Pricing strategy and tier design — use the pricing-strategy skill
- Revenue forecasting — use the revenue-operations skill
- Customer success and renewal playbooks — use the customer-success skill

## Instructions

### Deal structuring

```
Structure a deal for [customer].

Customer: [name, company size, industry]
Deal type: [new logo / expansion / renewal / multi-year]
ARR requested: $[X]
Products / tiers requested: [list]
Contract length: [12 / 24 / 36 months]
Requested start date: [date]
Special requirements: [custom SLA / dedicated support / custom integration / data residency]

Deal structure review:

1. PRICING INTEGRITY:
   What is the list price for this configuration?
   Customer is asking for: $[X] ([X]% off list)
   Is this within standard discount authority? [rep / manager / VP / CRO level]
   What is the justification? [volume / strategic / competitive / renewal retention]

2. DEAL ECONOMICS:
   ACV: $[X]
   Estimated CAC for this deal: $[X] (sales cycle + SE + legal time)
   Gross margin at this price: [X]%
   CAC payback at this price: [X] months
   Is this economically viable? [yes / borderline / no — escalate]

3. TERM STRUCTURE:
   Payment terms: [net 30 / annual upfront / quarterly]
   Multi-year lock-in: [year 2 and 3 pricing committed at list / CPI + X%]
   Renewal auto-renew: [yes / 90-day notice]
   Early termination clause: [yes — risk / no — standard]

4. NON-STANDARD TERMS TO FLAG:
   🔴 Uncapped liability — reject or escalate to legal
   🔴 Unlimited indemnification scope — escalate
   🔴 SLA penalties as sole remedy — accept if penalties are capped
   🟡 Most-favoured-nation pricing clause — flag; may constrain future pricing
   🟡 Data portability requirements at termination — flag; confirm engineering can fulfil
   🟡 Sub-processor restrictions — flag; confirm current sub-processor list is acceptable

5. DEAL APPROVAL:
   Approver at this discount level: [name/role]
   Required documents before approval: [SOW / security questionnaire / legal review]
   Expected close date: [date]

Output: deal approval recommendation with specific conditions.
HUMAN APPROVAL REQUIRED for all discounts > standard rep authority.
```

### Discount approval policy

```
Design a discount approval policy for [company].

Sales team size: [X reps]
Deal sizes: [$X typical ACV, $X max ACV]
Current discount problem: [too much / inconsistent / no policy / margin compression]

Standard discount authority matrix:

| Discount level | Approved by | Max ACV | Conditions |
|---|---|---|---|
| 0-10% off list | AE (no approval needed) | Any | Standard terms only |
| 11-20% off list | Sales Manager | Any | Written justification required |
| 21-30% off list | VP Sales | Any | Deal review meeting required |
| 31-40% off list | CRO | > $100K ACV only | CEO awareness + deal economics review |
| > 40% off list | CEO + Board | Strategic deals only | Full deal desk review |

Discount justification categories:
- Volume: > X seats / > X usage volume
- Strategic: reference customer / case study / partnership value
- Competitive: documented competitive displacement
- Retention: at-risk renewal, competitor evaluation in progress
- Speed: sign by [date] for current-quarter close

Discount guardrails (non-negotiable):
- No discount below minimum gross margin floor ([X]% — set by finance)
- Multi-year deals: year 2+ pricing must be at list or CPI-adjusted — never locked at discounted rate
- No retroactive discounts on already-closed deals
- Discount applies to ARR only — professional services at list always

Generate the approval policy for my company and sales team structure.
HUMAN APPROVAL REQUIRED for every deal above rep authority level.
```

### Contract terms review

```
Review these contract terms for commercial risks.

Contract type: [MSA / Order Form / SaaS subscription agreement]
Our role: [vendor / customer]
Contract value: $[X] / [term]

Commercial red flags to check (flag as RED/YELLOW/GREEN):

LIABILITY:
🔴 Uncapped liability — must negotiate a cap (standard: 12 months of fees)
🔴 Liability cap < 3 months of fees — too low; negotiate to 12 months minimum
🟡 No carve-out for gross negligence or willful misconduct — verify cap applies

PRICING AND PAYMENT:
🔴 Right to audit with unlimited scope — limit to relevant records, reasonable notice
🟡 Price increase cap not specified — add CPI or [X]% annual cap
🟡 Auto-renew notice period > 90 days — customer may request longer notice
🟢 Net 30 payment terms — standard

INTELLECTUAL PROPERTY:
🔴 Broad work-for-hire clause claiming all IP — limit to specific deliverables only
🔴 IP created during support or implementation claimed by customer — exclude
🟡 License scope is "worldwide, perpetual, irrevocable" — standard for SaaS

TERMINATION:
🔴 No termination for convenience — must have 30-90 day notice right
🟡 Termination triggers are overly broad ("any breach") — should require cure period
🟡 Effect of termination: customer data deletion timeline not specified — add 30-day grace

DATA:
🔴 No DPA attached (if processing personal data) — require DPA
🔴 Data ownership ambiguous — we own customer data; customer owns their content
🟡 Audit rights for data security — limit to third-party audit reports (SOC 2); not direct access

Produce: redline recommendations for each RED/YELLOW item.
LEGAL REVIEW REQUIRED before signing any agreement.
```

### Deal economics analysis

```
Analyse the economics of [deal].

ACV: $[X]
Term: [X months]
TCV (total contract value): $[X]
Gross margin at this price: [X]%
CAC invested: $[X] (sales salary + commission + SE time + legal)
Implementation cost (if any): $[X]

Deal economics:

CAC payback period:
= CAC / (ACV × gross margin %)
= $[X] / ($[X] × [X]%)
= [X] months

At gross margin [X]%, this deal pays back its acquisition cost in [X] months.
Benchmark: < 12 months = excellent; 12-18 months = acceptable; > 24 months = marginal

LTV calculation (assuming [X]% annual churn):
Average customer lifetime = 1 / churn rate = [X] years
LTV = ACV × gross margin % × lifetime
= $[X] × [X]% × [X] years = $[X]

LTV:CAC ratio = $[X] / $[X] = [X]x
Benchmark: > 3x = healthy; > 5x = excellent; < 2x = concern

Revenue recognition:
- Annual upfront: full TCV recognised over the term (ASC 606 ratable)
- Monthly: recognised monthly as delivered

Multi-year implications:
- Locking customer at [discounted] rate for 3 years: revenue predictability
- Risk: pricing power lost; if list price increases 20%, this customer stays at the old rate

Decision: [approve / approve with conditions / escalate]
Conditions: [if any — e.g. "approve at this price if term is 24 months upfront"]
HUMAN SIGN-OFF REQUIRED before deal closure.
```

## Example

**User:** A Fortune 500 customer wants our $85K/year enterprise plan for $55K/year (35% off list), 3-year deal, with a data export right on termination, net 90 payment terms, and an MFN clause. Deal or no deal?

**Claude's analysis:**

**Discount (35% off list):** Requires CRO-level approval under standard policy. Justification needed: strategic logo, competitive pressure, or volume commitment. At $55K × 3 = $165K TCV — worth the escalation if the customer is a genuine reference.

**Term-by-term:**

- Net 90 payment terms → 🔴 Push back. Net 30 is standard. Net 60 maximum for enterprise. Net 90 = 3-month working capital impact at this deal size. Counter: offer 2% early payment discount at net 10, or hold at net 30 with no discount.

- Data export right on termination → 🟢 Standard and reasonable. Confirm your engineering team can deliver a machine-readable export within 30 days — this is common and worth committing to.

- MFN clause → 🔴 Reject or strictly scope it. An unlimited MFN ("we get your best price to any customer") means if you ever sell a similar deal at a lower price, this customer automatically gets that lower price too. Counter: "MFN applies only to deals of equal or greater ACV, same term, signed within 12 months."

**Overall recommendation:**
Approve with two conditions: (1) payment terms negotiated to net 30 or 60 (not 90), and (2) MFN scoped to comparable deals only. CRO sign-off required before sending final terms.

HUMAN APPROVAL REQUIRED. Do not send revised terms without CRO signature on the deal summary.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
