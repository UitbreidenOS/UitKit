# Financials Analyzer Skill

## When to activate

During due diligence report generation. Called after opportunity scoring but before market analysis.

## When NOT to use

- Pre-revenue companies with no financial data
- Companies refusing to share financials (flag as risk)
- Acquired or non-operating companies

## Instructions

1. Collect financial data:
   - ARR/MRR (if available, or estimated from funding and burn)
   - Monthly burn rate (R&D, sales, operations)
   - Runway in months (cash / monthly burn)
   - Customer metrics: CAC, LTV, payback period, retention rate
2. Calculate or estimate unit economics:
   - Gross margin (revenue - COGS) / revenue
   - CAC payback in months
   - LTV:CAC ratio (target >3x)
3. Flag red flags:
   - Runway <6 months
   - Negative gross margin
   - CAC payback >24 months
   - Declining MoM growth
   - No clear path to profitability
4. Benchmark against stage:
   - Seed/Series A: MoM growth >10%, runway 18+ months
   - Series B: MoM growth >5%, unit economics clear, CAC payback <18 months
   - Series C: MoM growth >3%, path to profitability evident, LTV:CAC >3x
5. Output: Metrics table with benchmark comparison and red flag summary

## Example

**Input:** Series B SaaS, $2M ARR, $400K/mo burn, 8 months runway, CAC $8K, LTV $80K

**Output:**
- ARR: $2M (20% YoY growth trajectory)
- Burn: $400K/mo
- Runway: 8 months (FLAG: Below Series B benchmark of 18 months)
- Gross Margin: ~70% (healthy for B2B SaaS)
- CAC: $8K, LTV: $80K, LTV:CAC = 10x (excellent)
- CAC Payback: ~3 months (strong)

**Red Flags:**
- Runway below Series B benchmark — requires next funding round within 6 months or path to profitability
- Monthly burn increasing — need to understand driver (sales expansion, R&D investment, or churn)

**Recommendation:** Financials are strong on unit economics, but runway pressure is a risk factor. Partner review required.
