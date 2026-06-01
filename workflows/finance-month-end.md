# Finance Month-End Workflow

A repeatable close workflow for FP&A teams and CFOs — from data reconciliation and variance analysis to board pack and investor reporting. Covers the full monthly close cycle, typically spanning days 1-15 of the following month.

---

## Overview

```
Day 1-3: Books close — data collection and reconciliation
Day 4-5: Management accounts produced — P&L, balance sheet, cash flow
Day 6-8: Variance analysis and management commentary
Day 9-10: Board pack assembled and reviewed
Day 11-12: Investor updates and stakeholder reporting
Day 13-15: Reforecast and next-month plan
```

---

## Day 1-3: Books Close

**Goal:** All transactions for the month are posted, reconciled, and the trial balance is clean.

### Step 1 — Accounts reconciliation

```
/gl-reconciler

Run the month-end reconciliation for [MONTH].

Trial balance as of [date]:
[Paste trial balance export from accounting system]

Check:
1. Cash: does bank balance match GL cash account? Identify any in-transit items.
2. Accounts receivable: any invoices over 60 days? Provision required?
3. Accounts payable: any accruals needed for services received but not invoiced?
4. Prepaid expenses: any monthly amortisation not yet posted?
5. Accrued liabilities: payroll, benefits, consultant fees — all accrued?
6. Intercompany: any balances that need to net to zero?
7. Any large or unusual transactions requiring explanation?

Output: reconciliation checklist with pass/fail status per account.
Flag any items that require a journal entry before close.
```

### Step 2 — Accruals and adjustments

```
/gl-reconciler

Post month-end accruals for [MONTH].

Standard recurring accruals:
- Payroll (X days in next payroll cycle at $[X]/day)
- Benefits ([X]% of gross payroll)
- SaaS subscriptions (vendor: [list] — monthly portion if annual prepay)
- Consultant fees (vendor: [list] — [days at $X/day])
- Rent (monthly portion if quarterly payment)
- Depreciation (fixed asset schedule: [total monthly D&A])

One-time accruals this month:
[List any additional accruals]

Calculate journal entries needed. Mark all entries [VERIFY] before posting.
```

### Step 3 — Revenue recognition

```
/gl-reconciler

Revenue recognition review for [MONTH].

Business model: [SaaS / services / product / mixed]

For SaaS:
- Deferred revenue balance: $[X]
- Monthly recognition from deferred: $[X] (= annual contract value / 12)
- New MRR added this month: $[X]
- Churned MRR: $[X]
- Any one-time professional services revenue to recognise?

Confirm: recognised revenue matches ARR waterfall.
Flag: any contracts where revenue recognition timing is unclear. [VERIFY] with CFO.
```

---

## Day 4-5: Management Accounts

**Goal:** A clean, accurate P&L, balance sheet, and cash flow statement for management use.

### Step 4 — Produce management P&L

```
/budget-vs-actual

Produce the management P&L for [MONTH].

Raw data (from accounting system export):
[Paste P&L data]

Format as management accounts:
- Revenue (with MoM comparison)
- Cost of Revenue → Gross Profit → Gross Margin %
- Operating expenses by major category (S&M, R&D, G&A, Other)
- EBITDA / Operating loss
- Net burn (for cash-consuming businesses)

Add comparison columns:
- vs. Budget ($ and %)
- vs. Prior Month ($ and %)
- vs. Prior Year ($ and %) [if available]

Mark all material variances (>10% or >$[threshold]) for commentary.
[VERIFY] all figures against source data before distributing.
```

### Step 5 — Cash flow statement

```
/3-statement-model

Produce the monthly cash flow statement.

Opening cash balance: $[X]
Closing cash balance per bank: $[X]

Operating activities:
- Collections from customers: $[X]
- Payments to vendors: $[X]
- Payroll: $[X]
- Other operating: $[X]

Investing activities:
- Equipment purchases: $[X]
- Software/IP: $[X]

Financing activities:
- Loan proceeds/repayments: $[X]
- Equity received: $[X]

Reconcile: Opening + net cash flows = Closing.
If reconciliation fails, identify the discrepancy.
[VERIFY] against bank statements.
```

### Step 6 — KPI dashboard update

```
/revenue-operations

Update the KPI dashboard for [MONTH].

SaaS metrics (paste actual data):
- Opening MRR: $[X]
- New MRR: $[X]
- Expansion MRR: $[X]
- Churned MRR: $[X]
- Closing MRR: $[X]
- ARR: $[closing MRR × 12]

Calculate:
- MoM MRR growth: [%]
- Gross Revenue Retention (GRR): [(Opening - Churned) / Opening]
- Net Revenue Retention (NRR): [(Opening + Expansion - Churned) / Opening]
- Churn rate (by count): [churned customers / opening customers]
- Burn multiple: [net burn / net new ARR]

Flag any KPI that is [AT RISK] vs. target.
[VERIFY] all calculations against CRM and billing system data.
```

---

## Day 6-8: Variance Analysis and Commentary

**Goal:** Every material variance has a specific, honest explanation. No generic commentary.

### Step 7 — Revenue variance deep-dive

```
/budget-vs-actual

Revenue variance analysis for [MONTH].

Budget: $[X] | Actual: $[X] | Variance: $[X] ([X]%)

Break down the variance:
1. Volume effect: more or fewer customers / contracts than budget
2. Price effect: average deal size higher or lower than assumed
3. Mix effect: different product/segment mix than budget assumed
4. Timing effect: any deals that were budgeted this month but closed earlier/later?

Quantify each driver:
- "The $[X]K revenue miss is comprised of: [X]K volume, [X]K timing, [X]K mix"

Forward implication:
- Is this variance structural (will repeat) or timing (will reverse next month)?
- Does this require a reforecast, or is it within acceptable range?
```

### Step 8 — Expense variance deep-dive

```
/budget-vs-actual

Expense variance analysis for [MONTH].

For each expense line with >10% or >$[X]K variance:

S&M: Budget $[X] | Actual $[X] | Variance $[X]
Context: [e.g. 2 open headcount, conference cancelled, ad spend pulled forward]

R&D: Budget $[X] | Actual $[X] | Variance $[X]
Context: [e.g. contractor delayed, AWS costs higher than modelled]

G&A: Budget $[X] | Actual $[X] | Variance $[X]
Context: [e.g. legal fees higher — due diligence for new vendor, not recurring]

For each variance:
- Root cause: [specific, not vague]
- One-time vs. recurring: [classify]
- Action: [if recurring and unfavorable — what is being done?]
- Forward implication: [does this persist into next month?]

[VERIFY] all variance explanations against actual invoices or payroll records where available.
```

### Step 9 — Write management commentary

```
/budget-vs-actual

Write the management commentary for [MONTH].

This accompanies the management accounts distributed to the CEO and board.

Structure:
1. Headline (1 sentence): on track / ahead / behind — and by how much overall
2. Revenue commentary (3-4 sentences): what happened and why
3. Gross margin commentary: trend, any COGS anomalies
4. Expense commentary: highlights — where we underspent/overspent and why
5. Cash and runway: current position and what's driving burn
6. Reforecast flag: does this month change the full-year view?

Tone: Direct. Factual. No spin. If there is bad news, lead with it.
Length: 200-350 words.

[VERIFY] all figures in commentary against the management accounts.
```

---

## Day 9-10: Board Pack

**Goal:** A complete, reviewed board pack ready to distribute 48-72 hours before the board meeting.

### Step 10 — Assemble the board pack

```
/board-pack-builder

Build the monthly board pack for [MONTH].

[Provide inputs for all 7 sections based on the close work done in Steps 1-9]

Company context: [stage, industry, board composition]
Management accounts: [paste P&L summary from Step 4]
KPI dashboard: [paste from Step 6]
Variance summary: [paste from Steps 7-8]
Management commentary: [paste from Step 9]
Strategic initiatives update: [describe progress on each board-approved initiative]
Risk register update: [any new or changed risks vs. last month]
Asks for the board: [specific decisions, introductions, approvals needed]
```

### Step 11 — Board pack review

```
/board-pack-builder

Review this board pack draft before distribution:
[Paste complete board pack]

Check:
1. Are all figures consistent across sections?
2. Is the narrative coherent — does the executive summary match the detailed sections?
3. Are the board asks specific and actionable?
4. Are there any variances that are explained in the financials but not flagged in the executive summary?
5. Is there anything a board member will ask that isn't addressed?
6. Tone: is it candid, or does it appear to spin negative results?

Output: list of edits to make before distributing.
```

### Step 12 — Distribute

- Export as PDF
- Distribute via secure board portal (Diligent, Boardvantage, or email with password) — minimum 48 hours before the meeting
- Confirm receipt from all board members
- Prepare a 15-minute verbal summary for the meeting opening

---

## Day 11-12: Investor and Stakeholder Reporting

**Goal:** Investors and key stakeholders receive accurate, timely information.

### Step 13 — Investor update

```
/cfo-advisor

Draft the monthly investor update for [MONTH].

Audience: [VC / angel / strategic — brief description of who they are]
Format: [email / PDF attachment / investor portal post]
Word count target: 300-500 words (investors read many of these)

Include:
- Headline metrics: [ARR, growth, burn, runway — 4 numbers max]
- 3 wins: [specific — not vague]
- 2-3 challenges: [honest, with what's being done]
- Pipeline/asks: [what introductions, advice, or approvals you need]
- One decision or milestone coming in next 30 days

Tone: Confident. Transparent. No spin. Investors who funded you are already on your side.
Bury no bad news.
```

### Step 14 — Internal stakeholder reports

```
For each functional head (Sales, Product, CS, Engineering):

/budget-vs-actual

Generate the [function] budget report for [MONTH].

[Relevant P&L section for that function]

Include:
- Budget vs. actual for their controllable costs
- KPIs relevant to their function
- What's on track / at risk
- Decisions they need to make based on this data

Keep to 1 page — function heads need the relevant data, not the full board pack.
```

---

## Day 13-15: Reforecast and Next Month

**Goal:** Update the full-year forecast based on actual results. Plan next month.

### Step 15 — Reforecast

```
/budget-vs-actual

Run the full-year reforecast following [MONTH] close.

Original full-year budget: [paste or describe]
YTD actuals ([X] months): [paste]

Key assumption changes:
- Revenue: [what changed vs. budget assumptions and why]
- Headcount: [actual vs. planned hires — timing changes]
- One-time items: [anything not in the original budget]
- Market conditions: [any change to growth assumptions]

Produce:
- Revised full-year P&L forecast by quarter
- Variance to original budget ($ and %)
- 3 scenarios: base / upside / downside
- Cash runway at each scenario
- Confidence level: what would have to be true for each scenario?

[VERIFY] all reforecast outputs against the financial model.
```

### Step 16 — Next month planning

```
/commercial-forecaster

Set the revenue target and pipeline requirement for [NEXT MONTH].

Reforecast full-year target (from Step 15): $[X] ARR
YTD actuals: $[X] ARR
Remaining months: [X]
Required average monthly new ARR to hit full-year: $[X]

Sales team capacity:
- Number of AEs: [X]
- Average quota per AE: $[X]/month
- Current pipeline: $[X] at [X]% win rate
- Pipeline coverage required (at [X]% win rate): $[X]

Questions:
1. Do we have enough pipeline to hit next month's number?
2. Which deals need to close for us to hit plan?
3. What is the risk-adjusted forecast (pipeline × win rate by stage)?
4. What should sales focus on: new logos / expansion / reactivation?
```

### Step 17 — Close calendar for next month

```
Set up next month's close calendar:

Close date target: [date]
Key milestones:
- Bank reconciliations complete: [date]
- Accounts payable cutoff: [date]
- Payroll accrual confirmed: [date]
- Revenue recognition reviewed: [date]
- Trial balance to CFO for review: [date]
- Management accounts distributed: [date]
- Board pack draft circulated internally: [date]
- Board pack distributed to board: [date — 48 hours before meeting]
- Board meeting: [date]
- Investor update sent: [date]

Assign owners for each milestone.
```

---

## Month-end master checklist

```markdown
# Month-End Close: [MONTH YEAR]
Target close date: [date]

## Reconciliation (Days 1-3)
- [ ] Trial balance exported from accounting system
- [ ] Cash reconciled to bank statement
- [ ] AR reconciled — provision for any balances >60 days
- [ ] AP reconciled — all vendor invoices posted
- [ ] All accruals posted (payroll, benefits, vendors, rent, D&A)
- [ ] Revenue recognition reviewed and confirmed
- [ ] Intercompany balances netted

## Management Accounts (Days 4-5)
- [ ] P&L produced with budget comparison
- [ ] Cash flow statement reconciled
- [ ] Balance sheet reviewed for unusual items
- [ ] KPI dashboard updated with actuals
- [ ] All figures marked [VERIFY] until CFO sign-off

## Variance Analysis (Days 6-8)
- [ ] Revenue variance decomposed (volume / price / mix / timing)
- [ ] All expense variances >10% explained with root cause
- [ ] One-time items identified and flagged
- [ ] Management commentary written (200-350 words)
- [ ] Forward implications noted for each material variance

## Board Pack (Days 9-10)
- [ ] All 7 sections drafted
- [ ] Figures consistent across all sections
- [ ] Board asks specific and ready for decision
- [ ] Internal review complete
- [ ] Distributed to board (48+ hours before meeting)

## Stakeholder Reporting (Days 11-12)
- [ ] Investor update sent
- [ ] Functional head reports distributed
- [ ] Any critical issues escalated to CEO immediately (not held for board pack)

## Reforecast (Days 13-15)
- [ ] Full-year forecast updated with [MONTH] actuals
- [ ] 3 scenarios (base / upside / downside) with cash runway
- [ ] Next month pipeline and revenue target set
- [ ] Close calendar for next month confirmed with owners
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
