---
name: reproducibility-auditor
description: Audits research projects for reproducibility compliance — checking data availability, code documentation, protocol completeness, random seeds, and environment specifications. Outputs a reproducibility scorecard with PASS/FAIL items.
allowed-tools: Read, Bash
effort: medium
---

# Reproducibility Auditor

## When to activate
Before submitting a manuscript, when sharing data with collaborators, during lab meeting presentations, or when a reviewer asks about reproducibility. Use as a pre-submission checklist.

## When NOT to use
Skip for preliminary/unpublished data, internal lab discussions, or when the reproducibility audit was completed within the last 30 days on the same project.

## Instructions

1. **Data audit:**
   - Raw data archived (not just processed)?
   - File format: Open/standard (FASTQ, CSV, TIFF) vs. proprietary?
   - Metadata complete (sample IDs match, conditions documented)?
   - Data accessible (repository DOI, accession number, or clear path)?

2. **Code audit:**
   - Analysis scripts present and runnable?
   - Dependencies listed with versions (requirements.txt, conda env, Docker)?
   - Random seeds set for stochastic processes?
   - README with run instructions?
   - No hardcoded absolute paths?

3. **Protocol audit:**
   - All reagents with supplier + catalog number + lot?
   - Equipment settings documented?
   - Timing and temperature exact?
   - Deviations from standard protocols noted?

4. **Statistical audit:**
   - Test selection justified?
   - Assumptions checked and documented?
   - Effect sizes reported (not just p-values)?
   - Multiple comparison correction applied?
   - Power analysis performed?

5. **Figure audit:**
   - Error bars defined (SD, SEM, CI)?
   - Sample sizes stated?
   - Statistical annotations present?
   - Raw data points shown where n<20?

## Output Format

```
REPRODUCIBILITY SCORECARD: [Project name]
DATE: [date] | AUDITOR: [name]

CATEGORY          | STATUS | SCORE | NOTES
------------------|--------|-------|------------------
Data Archival     | [P/F]  | [X/5] | [notes]
Code Quality      | [P/F]  | [X/5] | [notes]
Protocol Detail   | [P/F]  | [X/5] | [notes]
Statistical Rigor | [P/F]  | [X/5] | [notes]
Figure Standards  | [P/F]  | [X/5] | [notes]

TOTAL: [X/25] — [Excellent/Good/Needs Work/Insufficient]

BLOCKING ISSUES:
  1. [Must fix before submission]

RECOMMENDATIONS:
  1. [Improvement suggestions]
```

## Example

```
REPRODUCIBILITY SCORECARD: Compound X Efficacy Study
DATE: 2026-06-13 | AUDITOR: Dr. Patel

CATEGORY          | STATUS | SCORE | NOTES
------------------|--------|-------|------------------
Data Archival     | PASS   | 4/5   | Raw CSV present, but no accession number yet
Code Quality      | FAIL   | 2/5   | No requirements.txt, hardcoded paths found
Protocol Detail   | PASS   | 5/5   | Full reagent lots, equipment settings documented
Statistical Rigor | PASS   | 4/5   | Power analysis done, but CIs missing from Table 2
Figure Standards  | PASS   | 4/5   | Error bars present, n stated, but Fig 3B missing raw points

TOTAL: 19/25 — Good

BLOCKING ISSUES:
  1. Code not runnable — missing dependencies file, hardcoded /data/lab/ paths

RECOMMENDATIONS:
  1. Upload raw data to GEO/ArrayExpress before submission
  2. Add Docker environment or conda env.yml for analysis code
  3. Add CIs to Table 2
  4. Show individual data points in Fig 3B (n=8 per group)
```
