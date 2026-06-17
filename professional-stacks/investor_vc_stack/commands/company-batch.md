# /company-batch Command

Score and rank a batch of company targets for prioritized deal pipeline.

## Syntax

```
/company-batch [file path or inline list]
```

## Example

```
/company-batch company_list.csv
/company-batch
[Paste list of companies]
```

## What It Does

1. Accepts a batch of companies (CSV, paste, or file reference)
2. Scores each against investment thesis (0–100)
3. Ranks by opportunity score (highest to lowest)
4. Returns prioritized pipeline with recommended next action per company
5. Flags companies for deep DD, review, or pass with rationale

## Output Format

```
COMPANY BATCH SCORING RESULTS
[Date and batch ID]

| Rank | Company | Stage | Industry | Score | Decision | Rationale | Next Action |
|---|---|---|---|---|---|---|---|
| 1 | XYZ Fintech | Series B | Payments | 92 | GO | Strong founders, unit economics | Schedule DD |
| 2 | ABC SaaS | Series A | HR Tech | 68 | REVIEW | Strong market but CAC unclear | Clarify GTM metrics |
| 3 | DEF Climate | Seed | Climate Tech | 45 | PASS | Early stage, unproven market | Keep in network |

PRIORITY ACTIONS THIS WEEK:
1. [Company with highest GO score] — Schedule DD kickoff
2. [Company with REVIEW score] — Get clarifications on [specific questions]
3. [Company for watch list] — Monitor for Series A close

THESIS DISTRIBUTION:
- GO (≥70): [X] companies
- REVIEW (50–69): [X] companies
- PASS (<50): [X] companies
- % Thesis Fit: [X]%
```

## Constraints

- Batch size: 5–20 companies per run (larger batches split across sessions)
- Requires: Company name, stage, industry for each
- Does NOT commit to deep DD for all companies (only those scoring ≥70 or partner override)
- REVIEW-tier companies require clarification before full DD
