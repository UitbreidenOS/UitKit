---
name: grant-proposal-drafter
description: Drafts NIH/NSF-style grant proposals with structured Specific Aims, Research Strategy, and budget justification. Follows agency-specific formatting requirements and review criteria alignment.
allowed-tools: Read, Write, WebSearch
effort: high
---

# Grant Proposal Drafter

## When to activate
When writing a new grant proposal (R01, R21, NSF CAREER, etc.), revising a resubmission based on reviewer feedback, or preparing internal grant applications. Use for any funding application requiring structured research narrative.

## When NOT to use
Skip for informal project descriptions, blog posts about research, or progress reports on existing grants (use lab-notebook-writer for those).

## Instructions

1. **Identify the mechanism:** R01, R21, R03, NSF CAREER, foundation grant — each has different page limits, sections, and review criteria.
2. **Specific Aims page (1 page):**
   - Opening paragraph: Problem significance + knowledge gap (2-3 sentences)
   - Central hypothesis with preliminary support
   - 2-3 specific aims (each 2-3 sentences with rationale)
   - Payoff paragraph: What changes if we succeed
3. **Research Strategy:**
   - **Significance:** Why this matters, what gap it fills (1-2 pages)
   - **Innovation:** What is new conceptually, methodologically (0.5-1 page)
   - **Approach:** For each aim — rationale, design, methods, analysis, pitfalls & alternatives (2-3 pages each)
4. **Budget justification:** Personnel effort %, equipment necessity, supplies by aim
5. **Review criteria alignment:** Explicitly address significance, investigator, innovation, approach, environment

## Output Format

```
GRANT PROPOSAL: [Title]
MECHANISM: [R01/R21/NSF/etc.] | AGENCY: [NIH/NSF/Foundation]

SPECIFIC AIMS:
  [Problem + gap paragraph]
  CENTRAL HYPOTHESIS: [...]
  PRELIMINARY SUPPORT: [Key pilot data]

  AIM 1: [Title] — [2-3 sentence description]
  AIM 2: [Title] — [2-3 sentence description]
  AIM 3: [Title] — [2-3 sentence description]

  PAYOFF: [Impact if successful]

RESEARCH STRATEGY:
  SIGNIFICANCE: [Why this matters]
  INNOVATION: [What is new]
  APPROACH:
    AIM 1: [Design → Methods → Analysis → Pitfalls & Alternatives]
    AIM 2: [...]
    AIM 3: [...]

BUDGET HIGHLIGHTS:
  Personnel: [PI X%, co-investigators, students]
  Equipment: [Justification per item]
  Supplies: [By aim]

TIMELINE:
  Year 1: [Aim 1 + pilot for Aim 2]
  Year 2: [Aim 2]
  Year 3: [Aim 3 + integration]
```

## Example

```
GRANT PROPOSAL: Targeting Metabolic Reprogramming in Treatment-Resistant Pancreatic Cancer
MECHANISM: R01 | AGENCY: NIH/NCI

SPECIFIC AIMS:
  Pancreatic ductal adenocarcinoma (PDAC) has a 5-year survival of 12%. Gemcitabine
  resistance develops in >80% of patients. Our pilot data shows resistant cells rewire
  lipid metabolism — upregulating fatty acid oxidation (FAO) 4-fold.
  CENTRAL HYPOTHESIS: FAO dependency is a targetable vulnerability in gemcitabine-resistant PDAC.
  PRELIMINARY SUPPORT: 4× FAO flux in resistant vs. sensitive lines (p<0.001, n=6)

  AIM 1: Define the FAO dependency landscape in resistant PDAC using metabolomics and CRISPR screens
  AIM 2: Evaluate CPT1a inhibitor + gemcitabine synergy in PDX models
  AIM 3: Identify biomarkers for patient stratification using circulating tumor DNA

  PAYOFF: A combination therapy strategy for the 80% of PDAC patients who develop resistance.
```
