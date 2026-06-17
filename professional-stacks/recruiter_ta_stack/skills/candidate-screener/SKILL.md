---
name: candidate-screener
description: Screen candidate resumes against job requirements with structured scoring and bias mitigation
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Screening inbound applications against job descriptions
- Ranking candidates by qualification match
- Generating structured interview shortlists
- Reducing unconscious bias in resume review
- High-volume hiring with 50+ applicants per role

## When NOT to use

- For final hiring decisions (human judgment required)
- For executive search (relationship-driven process)
- For internal mobility assessments

## Instructions

1. **Parse job requirements.** Extract must-have vs. nice-to-have skills, experience years, education, and certifications.
2. **Score each resume.** 1-5 scale per requirement: 1=no match, 3=partial, 5=strong match. Weight must-haves 2x.
3. **Flag red flags.** Employment gaps >6 months, job hopping (<1 year tenures), overqualification signals.
4. **Blind review mode.** Strip names, photos, and demographic data to reduce unconscious bias.
5. **Rank and tier.** Tier 1 (score >80%): interview immediately. Tier 2 (60-80%): review manually. Tier 3 (<60%): pass.
6. **Generate shortlist report.** Candidate ID, composite score, strengths, gaps, recommended interview type.
7. **Document decisions.** Every pass/fail logged with specific reason tied to job requirements.

## Example

```
Candidate: ID-0042
Role: Senior Backend Engineer
Must-Haves: Go (4/5), PostgreSQL (5/5), Kubernetes (3/5), 5+ years exp (4/5)
Nice-to-Haves: Terraform (3/5), gRPC (2/5)
Composite Score: 84% → Tier 1 (Interview)
Strengths: Strong DB skills, 7 years backend experience
Gaps: Limited Kubernetes production experience
```
