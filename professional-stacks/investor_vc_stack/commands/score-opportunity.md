# /score-opportunity Command

Score a company against investment thesis and determine if deep due diligence is warranted.

## Syntax

```
/score-opportunity [company_name] [stage] [industry]
```

## Example

```
/score-opportunity "XYZ Fintech" "Series B" "Payments"
/score-opportunity "ABC SaaS" "Series A" "HR Tech"
```

## What It Does

1. Collects company name, stage, and industry
2. Gathers founding team background via LinkedIn and Crunchbase
3. Identifies revenue status and key available metrics
4. Scores against four dimensions (Founder/Team, Market Opportunity, Financial Health, Product Clarity)
5. Returns investment thesis score (0–100)
6. Decision: **GO** (≥70), **REVIEW** (50–69), **PASS** (<50)
7. Includes dimension breakdown with scoring rationale

## Output Format

```
OPPORTUNITY SCORE: [XX]/100

[GO / REVIEW / PASS] — [one-sentence recommendation]

SCORING BREAKDOWN:
- Founder/Team: [XX]/25 — [brief rationale]
- Market Opportunity: [XX]/25 — [brief rationale]
- Financial Health: [XX]/25 — [brief rationale]
- Product Clarity: [XX]/25 — [brief rationale]

KEY INSIGHTS:
- [insight 1]
- [insight 2]
- [insight 3 if applicable]

NEXT STEPS:
[GO] → Schedule deep DD immediately
[REVIEW] → Clarify [specific questions] before committing to full DD
[PASS] → Keep in network for future; no immediate action
```

## Constraints

- Requires: Company name + stage + industry
- Does NOT trigger full due diligence (use `/dd-report` for that)
- Does NOT make investment decision (use `/dd-report` for partner approval)
- Thesis override requires written partner justification
