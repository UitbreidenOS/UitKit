---
name: month-end-close
description: - It is the last few days of the month and you need to close the books
updated: 2026-06-13
---

# Month-End Close

## When to activate
- It is the last few days of the month and you need to close the books
- You have a meeting with your accountant and want to walk in with the numbers already organized
- You need a P&L for a bank loan, investor update, or lease application
- Something does not add up between your QuickBooks total and your bank statement and you need to find the gap

## When NOT to use
- Mid-month — wait until the month is complete so the numbers are final
- Your accountant manages the close entirely and you are not involved in the process
- You are looking for tax advice — this skill organizes numbers, it does not replace a CPA

## Instructions

### What to export before starting

You need three things from your accounting tools. All three can be exported in under 5 minutes:

1. QuickBooks: Profit & Loss report for the month (Reports > Profit & Loss > set date range > Export to Excel or PDF)
2. QuickBooks: Transaction Detail report for the month — full list of every transaction
3. PayPal or Stripe: Settlement report for the month — downloadable from your dashboard under Activity or Reports

If you use both PayPal and Stripe, pull both. If you use only one, pull that one.

### Step 1: Cross-reference payment processors against QuickBooks

Paste your totals into Claude:

"QuickBooks shows $34,200 in revenue. PayPal gross sales were $31,800 before fees, net $29,400. Stripe gross was $4,800, net $4,600. Help me reconcile these."

Claude identifies where the numbers align and where they do not. Common gaps it catches:

- PayPal or Stripe fees that were not recorded as expenses in QuickBooks
- Refunds processed in one system but not reflected in the other
- Transactions that hit in one month but settled in another (timing differences)
- Split transactions that were recorded as a single lump in QuickBooks

For each discrepancy, Claude explains what it likely is and what to do — whether to correct it yourself or flag it for your accountant.

### Step 2: Generate the P&L summary

Once the numbers are reconciled, ask Claude:

"Summarize my P&L for the month. Revenue by category if I have categories, top 5 expense categories, net profit or loss, and compare to last month if I give you last month's numbers."

Paste your QuickBooks P&L export (as text or numbers) and Claude produces a clean summary:

- Total revenue: $38,600 (up $3,200 from last month, +9%)
- Top expense categories: Contractor pay $11,200 / Software $2,400 / Advertising $1,800 / Office $640 / Bank fees $280
- Net profit: $22,280 (58% margin)
- Notable change from last month: Advertising spend up $600 — check if that drove the revenue increase

### Step 3: Catch missing receipts

Tell Claude your threshold:

"List any transactions over $75 in my expense report that don't have a memo or receipt attached."

Paste your transaction list. Claude flags the ones with no description and groups them by category so you can chase receipts efficiently. It also notes which ones are likely deductible (business meals, software, travel) versus routine (payroll, rent) — so you know which missing receipts actually matter for taxes.

### Step 4: Draft the accountant email

Ask Claude:

"Write a 3-paragraph email to my accountant summarizing this month. Include the key numbers and flag the 2-3 questions I should ask them."

Claude drafts:

- Paragraph 1: Month summary — revenue, expenses, net profit, and one notable trend
- Paragraph 2: Reconciliation notes — what you found, what you corrected, what you are unsure about
- Paragraph 3: Your specific questions — framed as "I noticed X, should I do Y?" not vague requests

This saves your accountant time and gets you faster, more useful answers.

### Common things Claude catches

- PayPal settlement fees booked as income instead of expense
- Owner draws that reduced bank balance but are not showing as expenses
- Duplicate transactions from importing bank feeds
- Subscriptions that renewed but were not budgeted
- Payments received in the prior month that QuickBooks recorded this month (accrual vs. cash timing)

### Monthly cadence

Run this skill in the first 3 business days after month close. Set aside 60-90 minutes the first time, 30-45 minutes once you have a routine. Use the output directly for your accountant meeting — no additional prep needed.

## Example

You say: "QuickBooks shows $34,200 in revenue this month. PayPal shows $31,800 net after fees. I also have $2,100 in Stripe. My QuickBooks expenses show $18,400. I'm not sure why the numbers don't add up and I have an accountant call tomorrow morning."

Claude reconciles all three sources:

- QuickBooks revenue $34,200 + Stripe $2,100 should equal $36,300 total — but PayPal net $31,800 doesn't fit this picture cleanly.
- Gap analysis: Claude finds that the $2,400 in PayPal fees was not recorded as an expense in QuickBooks. Adding it closes the gap to $300.
- The remaining $300 is flagged as a likely uncategorized refund — Claude asks: "Did you issue any refunds in the last 30 days? Check your PayPal activity for refunds issued between the 18th and 25th."

Claude then produces:
- Clean P&L summary with correct numbers for your accountant call
- One-paragraph reconciliation note explaining the PayPal fee entry that is missing
- Three questions to raise with your accountant: how to categorize the refund, whether the owner draw from the 22nd needs an entry, and whether the $640 equipment purchase qualifies for Section 179

You walk into the accountant call with everything organized. The call takes 20 minutes instead of an hour.
