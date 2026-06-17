---
description: Benchmarks salary, bonus, and equity against market data. Returns comp range, equity models, cost impact, and offer recommendations. Outputs comp-analysis-{role}.md.
---

# /analyze-comp

## What This Does

Benchmarks a role's compensation against real market data (Levels.fyi, Radford, PayScale, BLS). Returns competitive salary range, equity benchmarks, total comp models, and offer recommendations tied to market percentiles.

## Steps Claude Follows

1. **Ask for:** Role title, level, location, company size/stage, desired percentile (50th? 60th? 70th?)
2. **Run compensation-analyzer skill** — Pull market data, model scenarios
3. **Assess internal equity** — Check for compression vs. existing team; flag concerns
4. **Model total comp** — Salary + bonus + equity (annualized) + benefits; show 1-year, 4-year, 10-year scenarios
5. **Calculate cost impact** — Annual payroll, fully-loaded cost, headcount budget impact
6. **Build offer recommendation** — Specific salary, bonus %, equity grant with justification
7. **Output comp-analysis-{role}.md** with all benchmarks, assumptions, and scenarios
8. **Summary recommendation** — "Staff Engineer in SF at 50th percentile: $210K salary + 20% bonus + $100K/4yr equity = $340K total comp (Year 1)."

## Output Format

### Compensation Analysis Document
```
# Compensation Analysis: [Role] — [Level]

## Market Benchmarks
[Salary 25th/50th/75th percentile; bonus range; equity norm]

## Offer Recommendation
[Specific numbers: salary, bonus %, stock grant]

## Total Comp Scenarios
[1-year, 4-year, 10-year modeling; conservative/mid/optimistic]

## Internal Equity Check
[Compression analysis; comparison to peers]

## Cost Impact
[Annual payroll, fully-loaded cost, budget impact]
```

### Offer Summary
```
Recommended offer: $210K salary + 20% bonus + $100K stock

Justification:
- 50th percentile for SF SaaS market
- No compression vs. peers
- Candidate experience level justifies mid-market positioning

Scenarios:
- Conservative (75% vest): $340K Year 1 total comp
- Optimistic (100% vest): $354K Year 1 total comp
```

## Inputs You Provide

- Role title and level (e.g., "Senior Engineer," "Product Manager," "Engineering Manager")
- Location (SF Bay, NYC, Austin, Seattle, fully remote, etc.)
- Company stage/size (Series A, Series B/C, 100–300 employees, etc.)
- Candidate experience (junior vs. senior for level; any adjustments?)
- Target percentile (50th for market median, 60th for competitive, 70th for premium)

## Data Sources Queried

- **Levels.fyi** — Tech company salary data; crowdsourced; current
- **Radford (Aon)** — Enterprise benchmarking; peer groups
- **Salary.com / PayScale** — General market ranges
- **BLS** — Government wage data; defensible for legal review

## Output Includes

- Salary range (25th/50th/75th percentile)
- Bonus range (typical as % of salary)
- Equity benchmarks (grant size, vesting terms)
- Total comp models (multiple scenarios)
- Internal equity check (compression assessment)
- Cost impact analysis
- Offer recommendation with justification

## Example

```
Input: "Benchmark Staff Engineer, Level 3, San Francisco. Market stage: Series B/C SaaS.
         Current team: 2 Staff ICs at $190K and $205K. Want to pay competitively."

Output:
# Compensation Analysis: Staff Engineer — Level 3

## Market Benchmarks (SF Bay, Series B/C SaaS, n=120 data points)

Salary:
- 25th percentile: $190K
- 50th percentile: $215K
- 75th percentile: $240K

Bonus: 18–22% (typical 20%)
Equity: $90K–$150K (typical $120K over 4 years)

## Offer Recommendation

Salary: $210K (slightly below 50th; internal equity consideration)
Bonus: 20% = $42K
Equity: $120K over 4 years (1-year cliff)

**Total Comp (Year 1):** $340K (conservative scenario; 75% vest assumption)

## Justification

Candidate has 5 years distributed systems experience (meets seniority).
At $210K, positioned 45th percentile but avoids compression with current team ($190K–$205K).
If we want 50th percentile ($215K), recommend raising one existing IC to maintain hierarchy.

## Cost Impact

Annual fully-loaded: $360K (salary + bonus + equity + benefits + recruiting)
Headcount budget: 18% of allocated Staff IC budget

## Internal Equity Check

Current Staff ICs: $190K, $205K
New offer: $210K
Compression risk: Candidate earns more than lowest peer by $20K.
Mitigation: Candidate has stronger background (distributed systems at scale).
Recommendation: Document justification in offer file.
```

## Compensation Philosophy Options

**Quartile positioning:**
- **25th percentile:** Cost-leader; may attract only junior or less competitive candidates
- **50th percentile (market median):** Competitive; balanced cost and talent attraction
- **75th percentile:** Premium; attracts top talent; more expensive
- **90th percentile:** Rare; only for critical/scarce roles (Staff Engineer, VP)

**General guidance:**
- Most roles: 50th–60th percentile
- Hard-to-hire or critical roles: 60th–75th percentile
- Growth roles (where you can develop talent): 45th–50th percentile

## Next Steps

Typical after analysis:
1. Review offer recommendation with hiring manager
2. Check internal equity impact (promote or adjust existing salary if needed)
3. Finance approval (budget check)
4. Create offer; present to candidate
5. Reference check + background check (parallel)
6. Offer acceptance; start date planning
