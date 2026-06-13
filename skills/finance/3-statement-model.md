---
name: 3-statement-model
description: "Three-statement financial model: income statement, balance sheet, cash flow statement — build integrated models, link statements, project financials, and stress-test assumptions"
updated: 2026-06-13
---

# 3-Statement Model Skill

## When to activate
- Building a financial model that integrates P&L, balance sheet, and cash flow
- Linking financial statements so changes flow through automatically
- Projecting 3-5 year financials for planning or fundraising
- Building a working capital and cash flow model
- Stress-testing financial assumptions (bull/bear/base scenarios)

## When NOT to use
- DCF valuation — use the dcf-model skill (which builds on this)
- Pitch deck financial summary — use the pitch-deck skill
- Monthly bookkeeping or reconciliation — use the quickbooks-workflow skill
- Simple revenue projections without full balance sheet — a simpler model suffices

## Instructions

### Model architecture

```
Build a 3-statement financial model for [company].

Company type: [SaaS / ecommerce / services / manufacturing]
Time period: [3-year / 5-year projection]
Historical data available: [X years of actuals or none]
Purpose: [fundraising / board reporting / internal planning / M&A]

Model structure:

TAB 1 — Assumptions (all inputs live here, nothing hardcoded in formulas):
  Revenue drivers: [growth rate / unit volume / price per unit / customer count]
  Cost drivers: [COGS%, headcount plan, marketing spend as % of revenue]
  Balance sheet assumptions: [DSO, DPO, inventory days, capex schedule]
  Tax rate: [X%]

TAB 2 — Income Statement (P&L):
  Revenue
    Less: Cost of Goods Sold (COGS)
  = Gross Profit
    Less: Operating Expenses
      Sales & Marketing
      Research & Development
      General & Administrative
  = EBITDA
    Less: Depreciation & Amortisation
  = EBIT (Operating Income)
    Less: Interest Expense
  = Pre-Tax Income (EBT)
    Less: Tax Provision
  = Net Income

TAB 3 — Balance Sheet:
  Assets:
    Current: Cash, Accounts Receivable, Inventory, Prepaid
    Non-current: PP&E (net of depreciation), Intangibles
  Liabilities:
    Current: Accounts Payable, Accrued Expenses, Deferred Revenue
    Non-current: Long-term Debt
  Equity: Retained Earnings, Paid-in Capital
  CHECK: Assets = Liabilities + Equity (must balance)

TAB 4 — Cash Flow Statement:
  Operating Activities (indirect method):
    Net Income
    + Depreciation & Amortisation
    ± Changes in Working Capital (AR, AP, Inventory)
  = Cash from Operations
  
  Investing Activities:
    - Capital Expenditures
    ± Acquisitions / Disposals
  = Cash from Investing
  
  Financing Activities:
    + Debt Issuance / Repayment
    + Equity Issuance
    - Dividends
  = Cash from Financing
  
  Net Change in Cash = Operating + Investing + Financing
  Ending Cash = Beginning Cash + Net Change (must match Balance Sheet cash)

Build this model structure with my specific inputs.
```

### Statement linkages

```
Explain and set up the critical linkages in the 3-statement model.

The 3 statements are integrated — a change in one propagates through all three.

Key linkages to implement:

P&L → Balance Sheet:
  Net Income → Retained Earnings (equity section)
  Formula: Retained Earnings (end) = Retained Earnings (begin) + Net Income - Dividends
  
  Depreciation (P&L expense) → PP&E reduction (Balance Sheet)
  Formula: PP&E (end) = PP&E (begin) + Capex - Depreciation

P&L → Cash Flow:
  Net Income is the starting point of Cash from Operations
  Depreciation added back (non-cash expense)
  
Balance Sheet → Cash Flow (working capital changes):
  If AR increases → uses cash (Operating CF decreases)
  If AP increases → provides cash (Operating CF increases)
  Formula: ΔAR = AR(end) - AR(begin) → subtract from Operating CF
  Formula: ΔAP = AP(end) - AP(begin) → add to Operating CF

Cash Flow → Balance Sheet:
  Ending Cash on Cash Flow = Cash on Balance Sheet
  This is the "circular check" — if they don't match, the model is broken

Capex linkage:
  Capex on Cash Flow → increases PP&E on Balance Sheet
  Depreciation on P&L → reduces PP&E on Balance Sheet

Balance check formula:
  =IF(Assets = Liabilities + Equity, "BALANCED", "CHECK ERROR")
  Add this to every year column — if it ever shows an error, find the break.

Implement these linkages for my model in [Excel / Google Sheets].
```

### Working capital model

```
Build the working capital section for [company].

Working capital = Current Assets - Current Liabilities
Key drivers: DSO (receivables), DIO (inventory), DPO (payables)

Working capital metrics:
DSO (Days Sales Outstanding):
  Formula: (Accounts Receivable / Revenue) × 365
  Benchmark: SaaS: 30-45 days / B2B services: 45-60 days / Enterprise: 60-90 days
  Model: AR = (DSO / 365) × Revenue

DIO (Days Inventory Outstanding) — manufacturing/ecommerce only:
  Formula: (Inventory / COGS) × 365
  Model: Inventory = (DIO / 365) × COGS

DPO (Days Payable Outstanding):
  Formula: (Accounts Payable / COGS) × 365
  Higher DPO = better cash conversion (pay suppliers later)
  Model: AP = (DPO / 365) × COGS

Cash Conversion Cycle = DSO + DIO - DPO
  Positive = cash tied up in operations (needs working capital funding)
  Negative = suppliers fund your operations (Amazon-style negative CCC)

Working capital change (for cash flow statement):
  ΔWorking Capital = WC(end) - WC(begin)
  Increase in WC = cash outflow (uses cash)
  Decrease in WC = cash inflow (provides cash)

Build the working capital schedule with my industry inputs.
```

### Scenario analysis

```
Build scenario analysis for [financial model].

Base assumptions: [current model]
Scenarios to model: [bull / base / bear] or [upside / downside / stress]

Scenario design principles:
- Change 1-3 key assumptions per scenario (not everything)
- Anchor to real events: "bear case = recession + 20% price pressure"
- Each scenario should be internally consistent (not just cutting revenue)

For a SaaS company:
Bull case: 40% YoY growth, 120% NRR, CAC stays flat
  → Revenue: $Xm (bull) vs $Xm (base)

Base case: 25% YoY growth, 110% NRR
  → Revenue: $Xm

Bear case: 15% YoY growth, 100% NRR, CAC increases 20%
  → Revenue: $Xm, cash breakeven delayed by X months

Stress test: 0% growth for 12 months (COVID-style shock)
  → How many months of runway at current burn?
  → What headcount reductions are required to survive 18 months?

Model structure using INDEX/MATCH scenario toggle:
  Cell A1: Scenario selector [Bull / Base / Bear]
  Revenue formula: =INDEX(scenario_table, MATCH(A1, scenario_names, 0), MATCH(year, year_row, 0))
  
Or use named ranges in separate scenario tabs and link to output tab.

Build the scenario analysis structure for my model.
```

## Example

**User:** I'm building a 3-year model for a B2B SaaS company. Year 1 ARR: $800K, growing at 80% YoY. Gross margin: 72%. Burn: $200K/month. How do I set up the P&L?

**Claude's P&L structure:**

```
                    Year 1      Year 2      Year 3
Revenue (ARR)       $800K      $1,440K     $2,592K     [+80% each year]
  MRR average       $667K      $1,200K     $2,160K     [ARR ÷ 12, simplified]

Revenue             $800K      $1,440K     $2,592K

COGS
  Infrastructure    $96K       $158K       $259K       [12% of rev]
  Customer Success  $128K      $202K       $311K       [16% of rev]
Total COGS          $224K      $360K       $570K       [28% of rev]

Gross Profit        $576K      $1,080K     $2,022K     [72% gross margin]

OpEx
  Sales & Mktg      $600K      $900K       $1,200K     [declining as % of rev]
  R&D               $480K      $600K       $720K       [headcount-based]
  G&A               $240K      $288K       $346K       [30% growth, slower]
Total OpEx          $1,320K    $1,788K     $2,266K

EBITDA              ($744K)    ($708K)     ($244K)     [approaching breakeven Y3]

Implied monthly burn: $62K/month (Y1), $59K/month (Y2), $20K/month (Y3)
Cash out at current runway: [calculate based on current cash balance]

Key observations:
- You reach EBITDA breakeven between Y3 and Y4 at these growth rates
- Sales & Marketing spend is your biggest lever — model both 50% and 75% of rev scenarios
- Build headcount tab → drives R&D and G&A more accurately than % of revenue
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
