---
name: "gl-reconciler"
description: "General ledger reconciliation: account reconciliation procedures, journal entry review, period-close checklist, variance analysis, and intercompany elimination — for finance teams and fund administrators"
---

# GL Reconciler Skill

## When to activate
- Running month-end or quarter-end close procedures
- Reconciling balance sheet accounts (cash, AR, AP, fixed assets, accruals)
- Reviewing journal entries for accuracy and completeness
- Investigating unexplained variances between sub-ledgers and the GL
- Building a period-close checklist for the finance team
- Intercompany eliminations for consolidated entity reporting

## When NOT to use
- Tax preparation or filing — specialist tax skill required
- Audit fieldwork — auditor independence rules apply; this is management's tool
- Real-time transaction processing — this is a reconciliation and review skill
- Replacing a qualified accountant for material restatements

## Instructions

### Month-end close checklist

```
Build a month-end close checklist for [company/entity].

Entity type: [startup / SMB / fund / corporate subsidiary]
Accounting system: [QuickBooks / Xero / NetSuite / Sage / Excel]
Close timeline target: [X business days after month-end]
Team: [solo bookkeeper / small team / finance team with controller]
Key accounts: [list material accounts — cash, AR, AP, payroll, deferred revenue, etc.]

Month-end close checklist:

DAY 1-2 (after month-end):
□ Confirm all transactions for the month are posted
□ Download and reconcile bank statements (all accounts)
□ Process credit card statements and coding
□ Confirm payroll entries posted correctly

DAY 2-3:
□ Reconcile accounts receivable sub-ledger to GL
   - Ageing report matches AR balance?
   - Unapplied cash cleared?
□ Reconcile accounts payable sub-ledger to GL
   - AP ageing matches AP balance?
   - Accrued but uninvoiced AP posted?
□ Fixed asset roll-forward — additions, disposals, depreciation posted?

DAY 3-4:
□ Review and post accruals:
   □ Payroll accrual (days worked, not yet paid)
   □ Prepaid expense amortisation
   □ Deferred revenue recognition (SaaS: ratable over contract period)
   □ Interest accrual (if debt outstanding)
   □ Unbilled AR (services rendered, invoice not yet sent)
□ Intercompany eliminations (if consolidated)

DAY 4-5:
□ Trial balance review — any unusual balances?
□ P&L flux analysis — material variances vs. prior month explained?
□ Balance sheet tie-out — all accounts reconciled?
□ Controller review and sign-off
□ Financial statements prepared and distributed

SIGN-OFF GATE:
Before finalising, confirm: [HUMAN SIGN-OFF REQUIRED]
Controller / CFO must approve before locking the period.

Generate close checklist for my entity type and accounting system.
```

### Account reconciliation template

```
Reconcile [account name] for [period].

Account: [e.g. Cash, Accounts Receivable, Accrued Expenses, Deferred Revenue]
GL balance per trial balance: $[X]
Sub-ledger or external balance: $[X]
Reconciling items (differences): [describe or unknown]

Reconciliation format:

ACCOUNT: [Name]
PERIOD: [Month/Year]
Preparer: [Name] | Date: [Date]
Reviewer: [Name — HUMAN REVIEW REQUIRED] | Date: ___

| | Amount |
|---|---|
| GL Balance per Trial Balance | $[X] |
| Less: Items in GL not in sub-ledger | ($[X]) |
| Add: Items in sub-ledger not in GL | $[X] |
| Adjusted GL Balance | $[X] |
| Sub-ledger / External Balance | $[X] |
| **Unexplained Variance** | **$[X]** |

RECONCILING ITEMS:
| Item | Description | Amount | Status |
|---|---|---|---|
| [1] | [e.g. Outstanding check #1234 — not yet cleared] | ($[X]) | Expected to clear [date] |
| [2] | [e.g. Deposit in transit — posted [date], not yet cleared] | $[X] | Expected to clear [date] |
| [3] | [e.g. Bank fee not yet recorded in GL] | ($[X]) | Post JE to record |

SIGN-OFF:
□ All reconciling items identified and explained
□ Journal entries prepared for items requiring posting
□ No unexplained variance remains
□ APPROVED BY: ______________ DATE: ______________

Common reconciling items by account type:
- Cash: outstanding checks, deposits in transit, bank fees, NSF items
- AR: unapplied cash, credit memos not yet applied, timing differences
- AP: accruals not yet invoiced, unmatched POs, timing differences
- Deferred Revenue: new contracts, recognised revenue, early terminations
- Accrued Expenses: payroll timing, unbilled services

Generate the reconciliation template for my specific account.
```

### Journal entry review

```
Review these journal entries for accuracy and completeness.

Period: [month/year]
Entries to review: [describe or list — can be text descriptions of JEs]
Accounting standard: [GAAP / IFRS / cash basis]

Journal entry review checklist:

For each entry:
□ Debits = Credits (basic balance check)
□ Account codes are correct for the nature of the transaction
□ Description is clear enough for an auditor to understand without asking
□ Supporting documentation attached or referenced
□ Proper period — posted to the correct month?
□ Approved by authorised person (per approval matrix)
□ For reversing entries — does the reversal exist in the following period?

High-risk entry types to scrutinise:
🔴 Entries posted by senior finance staff directly (bypassing normal workflow)
🔴 Round-number entries with no detailed support
🔴 Entries posted on the last day of the period (earnings management risk)
🔴 Entries between related parties or intercompany
🔴 Entries that offset a prior unusual entry
🔴 Large adjustments with description "per mgmt" or "per controller"

For each flagged entry:
Entry: [JE number / description]
Issue: [what's unusual or missing]
Required: [additional support / approval / explanation]
Status: [Cleared / Escalate to controller / Request from preparer]

Review my journal entries and flag any that require additional scrutiny.
[HUMAN REVIEW REQUIRED before period lock]
```

### Variance analysis

```
Explain the variance in [account / P&L line] for [period].

Account: [name]
Budget / Prior period: $[X]
Actual: $[X]
Variance: $[X] ([X]% unfavourable / favourable)

Variance analysis framework:

Step 1 — Quantify by driver:
Price/rate variance: [same volume, different price or cost per unit]
Volume variance: [same rate, different quantity]
Mix variance: [change in composition — e.g. more enterprise vs. SMB customers]
Timing variance: [one-time item or period shift]

Step 2 — Investigate each driver:
- Pull transaction detail for the account
- Identify the top 3-5 transactions driving the variance
- Classify each: recurring / one-time / error / timing

Step 3 — Draft variance explanation:
Format for board/management reporting:
"[Account] was $[X] vs. budget of $[X], a $[X] unfavourable variance. Primary drivers:
1. [Driver 1] — $[X] impact — [brief explanation]
2. [Driver 2] — $[X] impact — [brief explanation]
[X] of the variance is expected to [reverse/persist] in [next month/quarter]."

Red flags in variance analysis:
- Variance that "net to zero" across accounts (offsetting errors)
- Variance consistently in same direction for 3+ months (structural issue, not timing)
- Variance with no clear business explanation (investigate for errors or fraud)

[VERIFY all figures with source data before including in management reports]
Analyse my variance and draft the management explanation.
```

### Intercompany reconciliation

```
Reconcile intercompany accounts for [consolidated entity].

Parent entity: [name]
Subsidiaries: [list]
Accounting system: [same for all / separate systems]
Period: [month/year]
Intercompany transactions this period: [describe — loans, management fees, shared services, sales]

Intercompany reconciliation process:

Step 1 — Map intercompany balances:
For each entity pair, confirm:
Entity A → Entity B: $[X] (Entity A: payable or receivable?)
Entity B → Entity A: $[X] (should be the mirror of above)

Step 2 — Identify mismatches:
| Entity A | Entity B | A's Balance | B's Balance | Difference | Reason |
|---|---|---|---|---|---|
| Parent | Sub 1 | $[X] | $[X] | $[X] | [timing / error / FX] |

Common mismatch causes:
- Timing: one entity posted in the period, the other hasn't yet
- FX: entities in different currencies — note which rate was used
- Missing entry: one side of the transaction not yet recorded
- Disputed amount: entities disagree on the transaction amount

Step 3 — Elimination entries:
For consolidation, eliminate all intercompany balances:
Dr. Intercompany Payable $[X] (in Parent)
Cr. Intercompany Receivable $[X] (in Sub 1)
[HUMAN REVIEW REQUIRED before posting elimination entries]

Step 4 — Confirm elimination completeness:
After eliminations, intercompany receivable and payable should net to zero.
Residual = error or unreconciled item → investigate before close.

Generate the intercompany reconciliation template for my entity structure.
```

## Example

**User:** Our month-end close takes 12 business days, which is too slow. Finance team: 1 controller, 2 accountants. Accounting system: NetSuite. How do I get to 5 days?

**Claude's close acceleration plan:**

12 days → 5 days is achievable in NetSuite with process changes. The culprit is almost always sequential dependencies that could run in parallel, and manual tasks that can be automated.

**Diagnosis — where the days go:**
- Days 1-3: waiting for bank statements, credit card downloads, payroll reports (external dependencies)
- Days 4-6: reconciling AR and AP manually (no auto-match)
- Days 7-9: accruals and adjusting entries (sequential review bottleneck)
- Days 10-12: controller review and revision cycles

**5-day close plan:**

*Before month-end (last 2 days of month):*
- Pre-close: accrue payroll, post depreciation, reverse prior-month accruals — all automated in NetSuite via recurring JE templates
- Pre-reconcile AR: run AR ageing daily, flag open items, don't wait for day 1

*Day 1:*
- Bank feeds auto-imported in NetSuite → auto-match rules handle >80% of transactions
- Credit card transactions imported via CSV — 1 accountant owns this, 2-3 hours
- Payroll JE posted from payroll provider export

*Day 2:*
- AR sub-ledger reconciliation (auto-match in NetSuite)
- AP open items cleared
- Fixed asset depreciation confirmed (NetSuite auto-calculates)

*Day 3:*
- All accruals posted (use JE templates — same every month, just update amounts)
- Intercompany eliminations (if applicable)

*Day 4:*
- Trial balance flux review — controller reviews variances >5% and >$5K
- Adjustments posted

*Day 5:*
- Final controller sign-off
- Financial statements distributed

**Key enablers:**
1. NetSuite bank feed + auto-match rules (reduces Day 1 from 2 days to 2 hours)
2. Recurring JE templates for all standard accruals (no manual entry = no errors to fix)
3. Parallel tracks: AR accountant and AP accountant work simultaneously on Day 2
4. "Right first time" culture: controller reviews during the month, not only at close

---
