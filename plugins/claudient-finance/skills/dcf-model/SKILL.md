---
name: "dcf-model"
description: "DCF valuation: gather inputs from filings, build WACC, project FCF, terminal value, sensitivity table — patterns from Anthropic financial-services"
---

# DCF Model Skill

## When to activate
- Building a Discounted Cash Flow (DCF) valuation for a company
- Calculating WACC from cost of equity and cost of debt
- Projecting free cash flow from income statement and balance sheet inputs
- Running sensitivity analysis on key assumptions
- Reviewing or auditing an existing DCF model

## When NOT to use
- Quick back-of-envelope valuations (use EV/EBITDA comps instead)
- Micro-cap or pre-revenue companies (DCF unreliable without stable cash flows)
- Formal lender or court submissions — these require a licensed valuation professional

## ⚠️ Important

All model outputs must carry a `[VERIFY]` marker before use. DCF outputs are highly sensitive to assumptions — a 0.5% change in WACC can change valuation by 20-30%. Always state your assumptions explicitly and have a senior analyst review.

## Instructions

### Step 1 — Gather inputs

```
Before building the DCF, gather these inputs:

INCOME STATEMENT (last 3-5 years + analyst estimates):
- Revenue
- EBITDA margin
- D&A
- Capital expenditures
- Changes in working capital
- Tax rate

BALANCE SHEET:
- Total debt
- Cash and equivalents
- Shares outstanding

MARKET DATA:
- Current stock price
- Equity market cap
- Beta (5-year monthly, vs S&P 500)
- Risk-free rate (10-year Treasury yield)
- Equity risk premium (use Damodaran's current estimate: ~5.5%)
- Cost of debt (weighted avg interest rate on existing debt)

Source these from: 10-K/10-Q filings, Bloomberg, FactSet, or company investor relations.
```

### Step 2 — Calculate WACC

```
WACC formula:
WACC = (E/V × Ke) + (D/V × Kd × (1 - Tax Rate))

Where:
- E = market value of equity
- D = market value of debt  
- V = E + D (total capital)
- Ke = cost of equity (CAPM: Rf + β × ERP)
- Kd = pre-tax cost of debt
- Tax Rate = marginal tax rate

Example calculation:
- Rf (risk-free): 4.3% (current 10Y Treasury)
- β (beta): 1.2
- ERP (equity risk premium): 5.5%
- Ke = 4.3% + (1.2 × 5.5%) = 10.9%
- Kd (pre-tax): 5.2%, Tax rate: 25%
- Kd after-tax = 5.2% × (1 - 0.25) = 3.9%
- Capital structure: 80% equity, 20% debt
- WACC = (0.80 × 10.9%) + (0.20 × 3.9%) = 9.5%

[VERIFY] WACC before using in projections.
```

### Step 3 — Project Free Cash Flow (5-year)

```
FCF = EBIT × (1 - Tax Rate) + D&A - CapEx - ΔWorking Capital

Year 1-3: Base case (analyst consensus or management guidance)
Year 4-5: Conservative fade toward long-run growth rate

Example FCF bridge:
Revenue: $1,000M → $1,080M → $1,160M → $1,230M → $1,290M
EBIT margin: 18% → 18.5% → 19% → 19% → 19%
EBIT: $180M → $200M → $220M → $234M → $245M
Tax (25%): $45M → $50M → $55M → $58.5M → $61M
NOPAT: $135M → $150M → $165M → $175M → $184M
+ D&A: $40M → $42M → $44M → $45M → $46M
- CapEx: $60M → $65M → $70M → $72M → $74M
- ΔWC: $8M → $9M → $10M → $10M → $10M
= FCF: $107M → $118M → $129M → $138M → $146M

[VERIFY] each year's FCF before proceeding.
```

### Step 4 — Terminal value

```
Terminal Value (Gordon Growth Model):
TV = FCF_year5 × (1 + g) / (WACC - g)

Where g = long-run growth rate (use GDP growth: 2-3% for mature companies)

Example:
TV = $146M × (1 + 2.5%) / (9.5% - 2.5%)
TV = $149.65M / 7%
TV = $2,138M

[VERIFY] terminal value represents a reasonable multiple of year-5 FCF 
(typically 15-25x for mature businesses).
```

### Step 5 — Discount to present value

```
PV of each FCF year:
Year 1: $107M / (1.095)^1 = $97.7M
Year 2: $118M / (1.095)^2 = $98.4M
Year 3: $129M / (1.095)^3 = $98.1M
Year 4: $138M / (1.095)^4 = $95.6M
Year 5: $146M / (1.095)^5 = $92.2M
PV of FCFs: $482M

PV of Terminal Value: $2,138M / (1.095)^5 = $1,352M

Enterprise Value (EV): $482M + $1,352M = $1,834M

Equity Value = EV - Net Debt (Debt - Cash)
Net Debt = $300M - $150M = $150M
Equity Value = $1,834M - $150M = $1,684M

Per share = $1,684M / 85M shares = $19.81

[VERIFY] implied EV/EBITDA multiple (should be in range of comparable companies).
```

### Step 6 — Sensitivity table

```
Run WACC × terminal growth rate sensitivity:

          g=1.5%  g=2.0%  g=2.5%  g=3.0%  g=3.5%
WACC=8.5% $22.4   $24.1   $26.2   $28.9   $32.6
WACC=9.0% $20.8   $22.3   $24.0   $26.2   $29.2
WACC=9.5% $19.4   $20.7   $21.8*  $23.4   $25.8  ← base case
WACC=10.0% $18.1  $19.2   $20.4   $21.7   $23.5
WACC=10.5% $17.0  $18.0   $19.0   $20.1   $21.6

[VERIFY] current stock price vs. implied valuation range.
```

## Example

**User:** Build a DCF for a SaaS company: $200M ARR, 75% gross margin, growing 25% YoY, cash flow positive.

**Expected output:**
- Gathered inputs: ARR, churn, expansion MRR, gross margin, S&M as % of revenue
- WACC calc: adjusted beta for SaaS (typically 1.1-1.4), higher ERP for growth stage
- FCF projection: ARR × net revenue retention, Rule of 40 check, FCF margin expansion path
- Terminal value: lower terminal growth (2%) due to market maturation
- Sensitivity: WACC 9-13% × growth 1.5-3.5%
- Output clearly marked `[VERIFY]` with key assumption disclosures

---
