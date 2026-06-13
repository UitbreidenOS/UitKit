---
name: cash-flow-forecast
description: "30-90 day cash flow forecasting for small businesses: model income and expenses, identify shortfalls, payroll runway, and early warning triggers"
updated: 2026-06-13
---

# Cash Flow Forecast Skill

## When to activate
- You're unsure if you have enough cash to cover next month's payroll
- Planning a major purchase and need to know if the timing works
- Slow season is coming and you want to plan ahead
- You want a simple 30/60/90-day cash projection
- Your accountant asked for a cash flow forecast

## When NOT to use
- Formal lender submissions — use your accountant for this
- Audited financial statements
- Multi-year projections for investor decks — needs professional modelling

## Instructions

### Quick 30-day forecast

Just describe your situation:

```
Help me build a 30-day cash flow forecast.

Current bank balance: $[X]
Expected income this month:
- [Invoice/client]: $[amount], expected [date]
- [Recurring revenue]: $[amount], arrives [date]
- Other: $[amount]

Fixed expenses this month:
- Rent: $[amount], due [date]
- Payroll: $[amount], due [date]
- Software subscriptions: ~$[amount]

Variable expenses I expect:
- [Supplier payment]: $[amount]
- [Other]: $[amount]

Will I have enough? When is my lowest point?
```

### Payroll runway check

```
I have $[X] in my business account.
My monthly payroll is $[Y] (paid on the [Nth] of each month).
My average monthly revenue is $[Z] but it's variable.
My fixed monthly costs excluding payroll are $[W].

How many months of runway do I have?
At what bank balance should I start worrying?
What's the minimum I should keep in the account as a buffer?
```

### Spotting cash flow gaps

```
Here's my forecast for the next 3 months:

Month 1: Revenue expected $[X], expenses $[Y]
Month 2: Revenue expected $[X], expenses $[Y] (includes annual insurance $Z)
Month 3: Revenue expected $[X], expenses $[Y]

Where are the gaps? What should I do before they hit?
```

### Scenario planning

```
My biggest client ($8,000/month) just told me they're pausing for 3 months.
My current bank balance is $14,000.
My monthly fixed costs are $6,200.

Walk me through:
1. How long can I operate without replacing that revenue?
2. What expenses can I delay or cut?
3. What revenue options should I pursue first?
```

### Seasonal business planning

```
My business is seasonal:
- Peak months (June–August): ~$25,000/month revenue
- Slow months (Nov–Feb): ~$6,000/month revenue
- Fixed monthly costs: $8,000

I'm currently in peak season with $22,000 in the bank.
How much should I be putting aside each peak month to survive the slow season?
```

### Early warning signals

Ask Claude to help you set up monitoring:

```
Based on my financials, what are the early warning signals I should watch for 
that indicate a cash flow problem is coming?
What weekly/monthly numbers should I check?
```

## Example

**You say:**
```
Bank balance: $18,000
Next 30 days:
- Client retainer: $5,000 arrives 5th
- Project invoice: $3,200, client usually pays in 21 days
- Uncertain: new quote worth $8,000 might close

Fixed costs: Rent $2,800, salaries $9,500, software/tools $400
Variable: supplier payment $1,200 due 15th
```

**Claude responds:**
- Confirmed cash: $23,000 (balance + retainer)
- Potential cash: $34,200 (if invoice pays on time + new deal closes)
- Worst case at month end: +$9,100 (if nothing extra comes in)
- Risk flag: payroll falls on the 15th — the day the supplier payment is also due. Confirm the $3,200 invoice will clear first.
- Recommendation: Chase the $3,200 invoice actively. Don't count the $8,000 quote in planning yet.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
