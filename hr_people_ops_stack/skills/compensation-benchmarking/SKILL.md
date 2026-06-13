---
name: compensation-benchmarking
description: Gathers market data and industry benchmarks for job titles, geographies, and experience levels. Compares internal roles against Levels.fyi, Blind, Salary.com, and industry surveys. Flags salary compression and equity gaps; recommends adjustment ranges.
allowed-tools: WebSearch, WebFetch, Read, Write
effort: medium
---

# Compensation Benchmarking Analyst

## When to activate
During annual comp review cycle, before offering external candidates, or when investigating pay equity complaints. Use to ensure internal salaries remain competitive and equitable across role level, geography, and underrepresented groups.

## When NOT to use
Skip if your organization has a fixed salary band policy and no flexibility. Skip if the role is highly specialized with no comparable market data. Skip if you lack approval from leadership to conduct pay analysis.

## Benchmarking Methodology

**Data Sources**
1. Levels.fyi (tech salaries by company and role, peer-verified)
2. Blind (anonymous employee salary data, US tech focus)
3. Salary.com (job title + ZIP code + experience level)
4. Glassdoor (company-specific median, dept breakdown)
5. Industry surveys (PayScale, Robert Half, Bureau of Labor Statistics)
6. LinkedIn Salary (role + location + years experience)

**Metrics to Collect**
- **Base salary range:** 25th, 50th (median), 75th percentiles
- **Bonus/incentive:** Typical % of base (e.g., 15–20% for sales, 0–10% for IC)
- **Equity/RSUs:** Annual grant value at 4-year vest
- **Benefits value:** Health insurance, 401k match, PTO (in $)
- **Total comp:** Base + bonus + equity + benefits

**Key Variables**
- Title and level (IC1–L6, engineer to staff engineer, etc.)
- Years of experience in role
- Geography (SF/NYC/Austin/fully remote vs. secondary markets)
- Company size and maturity (pre-seed, Series A, IPO, public)
- Industry vertical (SaaS, fintech, healthcare, etc.)

## Analysis Output

```
COMPENSATION BENCHMARK: [Job Title] · [Level/Seniority] · [Location]

MARKET DATA (US, Tech)
Base Salary
- 25th percentile: $[X]
- 50th percentile (median): $[X]
- 75th percentile: $[X]

Bonus (% of base)
- Typical range: X–X%
- Note: [bonus structure by company type]

Equity (Annual RSU Grant)
- Typical range: $[X]–$[X]
- 4-year vest with 1-year cliff
- Note: [varies by company stage]

Total Comp (Base + Bonus + Equity + Benefits)
- 50th percentile: $[X]
- 75th percentile: $[X]

INTERNAL COMPARISON
Your current salary: $[X]
Market median: $[X]
Gap: [+X% above market / -X% below market]

BENCHMARKED RANGE RECOMMENDATION
- Conservative (25th %ile): $[X]–$[X]
- Market (50th %ile): $[X]–$[X]
- Competitive (75th %ile): $[X]–$[X]

EQUITY ANALYSIS (if applicable)
Pay gap by gender: [+X% / -X% / parity] (based on internal review)
Pay gap by underrepresented groups: [analysis]
Title inflation risk: [yes/no] — [explanation]

ADJUSTMENT RECOMMENDATION
Current salary: $[X]
Recommended floor (market): $[X]
Suggested adjustment: +$[X] ([+X%] to move to X percentile)
Equity grant: [annual value] on [vesting schedule]

NOTES & CAVEATS
- Data sources and publication dates
- Known limitations (sample size, self-reported, etc.)
- Geographic cost-of-living adjustments applied
- External candidate vs. internal employee context
```

## Equity Review Checkpoints

1. **Compression:** Are senior ICs paid more than less-experienced peers in same role?
2. **Gender gap:** Do women in the same role earn the same base + equity?
3. **Experience reward:** Does salary increase with tenure, or are external hires higher-paid?
4. **Title inflation:** Is compensation consistent with level expectations?

## Example

**Role:** Senior Software Engineer · San Francisco, CA

```
COMPENSATION BENCHMARK: Senior Software Engineer · San Francisco, CA

MARKET DATA (US, Tech)
Base Salary
- 25th percentile: $165,000
- 50th percentile (median): $195,000
- 75th percentile: $225,000

Bonus (% of base)
- Typical: 10–15% for mature tech companies

Equity (Annual RSU Grant)
- Typical range: $100,000–$180,000 (4-year vest)
- Early-stage startups offer higher equity; public companies, lower

Total Comp (Base + Bonus + Equity)
- 50th percentile: $245,000
- 75th percentile: $310,000

INTERNAL COMPARISON
Your current Senior Engineer salaries: 
- Jane Doe (6 years tenure): $180,000
- Mike Johnson (2 years tenure): $185,000
- Gap: Jane is -$15,000 below market median; Mike is -$10,000

BENCHMARKED RANGE RECOMMENDATION
- Conservative (25th %ile): $165,000–$185,000
- Market (50th %ile): $190,000–$210,000
- Competitive (75th %ile): $215,000–$240,000

EQUITY ANALYSIS
Internal pay gap analysis (anonymized):
- Average Senior Engineer base: $182,000
- Underrepresented group average: $175,000
- Gap: -$7,000 (3.8% compression)

ADJUSTMENT RECOMMENDATION
Jane Doe: +$13,000 to $193,000 (align to market)
Mike Johnson: +$8,000 to $193,000 (align to market, level tenure)
Annual equity grant: $120,000–$140,000 per engineer

NEXT STEPS
- Approve raises for both engineers effective 2026-Q3
- Rebalance equity grants to market 75th percentile
- Conduct full engineering band audit (IC2–IC5)
```

---
