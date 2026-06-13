---
name: quickbooks-workflow
description: "QuickBooks month-end close, bank reconciliation, expense categorisation, discrepancy detection, and financial report summaries for small business owners"
updated: 2026-06-13
---

# QuickBooks Workflow Skill

## When to activate
- Running your month-end close in QuickBooks
- Reconciling bank accounts and finding discrepancies
- Categorising expenses and reviewing transactions
- Understanding what your Profit & Loss report is telling you
- Preparing data for your accountant or tax preparer

## When NOT to use
- Filing actual tax returns — use a licensed accountant
- Legal disputes about financial records — consult a professional
- Payroll processing — use QuickBooks Payroll or Gusto directly

## Instructions

### Month-end close checklist

Ask Claude to walk you through it:

```
I need to do my month-end close in QuickBooks for [month].
Walk me through the checklist step by step.
My business is a [type of business].
```

Claude will guide you through:
1. Record all sales and income
2. Categorise all expenses
3. Reconcile bank accounts
4. Review accounts receivable (unpaid invoices)
5. Review accounts payable (unpaid bills)
6. Run Profit & Loss report
7. Check Balance Sheet for anomalies

### Bank reconciliation help

```
My QuickBooks balance shows $12,340 but my bank statement shows $11,890.
There's a $450 discrepancy. Here are my recent transactions: [paste list]
Help me find what's causing the difference.
```

Common causes Claude will help you find:
- Outstanding cheques not yet cleared
- Deposits in transit
- Bank fees not recorded in QuickBooks
- Duplicate transactions
- Transactions entered with wrong amounts

### Expense categorisation

```
I have these transactions from last month that aren't categorised yet:
- $89 - Adobe Creative Cloud
- $340 - Business dinner at The Restaurant
- $1,200 - Contractor payment to John Smith
- $45 - Parking at client office

How should I categorise each in QuickBooks?
```

Claude will map each to the correct QuickBooks account (Software/Subscriptions, Meals & Entertainment, Contract Labor, Travel).

### P&L interpretation

```
My QuickBooks P&L for Q1 shows:
Revenue: $84,000
Cost of Goods Sold: $31,000
Gross Profit: $53,000
Operating Expenses: $47,000
Net Profit: $6,000

Is this healthy for a [type of business]? What should I be watching?
```

### Pre-accountant cleanup

```
My accountant is asking for clean books for the year. 
Here's what I still need to sort out: [describe the mess]
Give me a prioritised cleanup checklist.
```

### Understanding your numbers

```
My QuickBooks shows I made $145,000 in revenue but I only have $12,000 in my 
bank account. Why? Walk me through where the money went.
```

## Example

**You say:**
```
I just ran my December P&L in QuickBooks. Here are the numbers:
Revenue: $28,500
Expenses: $26,200  
Net Profit: $2,300
This feels lower than usual. My biggest expense categories are:
- Salaries: $14,000
- Rent: $3,500
- Software: $2,100
- Marketing: $4,200
- Misc: $2,400

What should I look at first?
```

**Claude responds with:**
Analysis of your margin (8%), comparison to typical benchmarks for your business type, flags the "Misc" category as worth reviewing for misclassifications, notes the marketing spend is high relative to revenue and asks what ROI you're seeing, suggests running a year-over-year comparison.

---
