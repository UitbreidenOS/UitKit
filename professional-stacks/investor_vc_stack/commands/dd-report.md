# /dd-report Command

Generate a structured due diligence report for a company that passed initial opportunity scoring.

## Syntax

```
/dd-report [company_name] [stage]
```

## Example

```
/dd-report "XYZ Fintech" "Series B"
/dd-report "ABC SaaS" "Series A"
```

## What It Does

1. Retrieves prior opportunity score (or runs scoring if not done)
2. Conducts structured market analysis (TAM, growth, competitive positioning)
3. Analyzes financial health (ARR, burn, unit economics, benchmarks)
4. Assesses team strength and key risks
5. Generates comprehensive DD report (3–5 pages)
6. Provides investment recommendation (GO/REVIEW/PASS)
7. Stages for partner review and sign-off

## Output Format

```
DUE DILIGENCE REPORT

**[Company Name]** | [Stage] | [Industry] | [Date]

EXECUTIVE SUMMARY
[1 paragraph with thesis fit, key metrics, red flags, recommendation]

COMPANY OVERVIEW
[Founding story, team, traction]

MARKET OPPORTUNITY
[TAM/SAM, growth, competitive landscape, moat, expansion]

FINANCIAL ANALYSIS
[ARR, burn, runway, unit economics, benchmark vs. stage]

RISK ANALYSIS
[Execution, market, financial, operational risks with severity ratings]

INVESTMENT RECOMMENDATION
[GO / REVIEW / PASS with rationale, term recommendation, conditions]

NEXT STEPS
[If GO: Legal review, term sheet, CEO call]
[If REVIEW: Clarifications required, timeline for decision]
[If PASS: Keep in network, revisit if [condition]]
```

## Constraints

- Requires: Opportunity score ≥50 (PASS <50 requires partner override with written justification)
- Does NOT make investment decision (partner review required)
- Does NOT send term sheet (manual step after partner approval)
- Minimum DD depth: Market analysis + Financial metrics + Team assessment
