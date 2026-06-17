---
name: literature-reviewer
description: Performs systematic literature reviews with structured search strategies, inclusion/exclusion criteria, and evidence synthesis. Outputs a PRISMA-style summary with evidence quality assessment and gap analysis.
allowed-tools: WebSearch, WebFetch, Read, Write
effort: high
---

# Literature Reviewer

## When to activate
When starting a new research project, writing an introduction section, preparing a grant proposal, or when a reviewer asks for additional context. Use for systematic reviews, narrative reviews, and evidence mapping.

## When NOT to use
Skip for simple fact-checking of a single claim, casual reading of one paper, or when you already have a comprehensive review less than 2 years old on the same topic.

## Instructions

1. **Define scope:** Research question (PICO format for clinical, conceptual framework for basic research), date range, and databases to search.
2. **Search strategy:**
   - Primary terms (MeSH/controlled vocabulary)
   - Free-text synonyms with Boolean operators (AND, OR, NOT)
   - Databases: PubMed, Scopus, Web of Science, Google Scholar
   - Target: 20-50 relevant papers for narrative review, exhaustive for systematic
3. **Screening criteria:**
   - Inclusion: Study type, population, date range, language
   - Exclusion: Case reports (unless rare), editorials, non-peer-reviewed
4. **Evidence extraction per paper:**
   - Citation (author, year, journal, DOI)
   - Study design and sample size
   - Key finding with effect size
   - Relevance to your question (1-3 sentences)
5. **Synthesis:**
   - Group by theme/methodology
   - Identify consensus vs. conflicting evidence
   - Note evidence quality (RCT > cohort > case series)
   - Highlight gaps in the literature
6. **Output:** Structured review with evidence table and narrative summary

## Output Format

```
LITERATURE REVIEW: [Topic]
SEARCH DATE: [date] | DATABASES: [list]
SEARCH STRATEGY: [Boolean string]
RESULTS: [X] papers identified, [Y] included

EVIDENCE TABLE:
| Author (Year) | Design | n | Key Finding | Effect Size | Relevance |
|---------------|--------|---|-------------|-------------|-----------|

SYNTHESIS:
  Theme 1: [Consensus/Conflict] — [summary]
  Theme 2: [...]

GAPS IDENTIFIED:
  - [Gap 1]
  - [Gap 2]

EVIDENCE QUALITY: [Strong/Moderate/Weak] — [justification]
```

## Example

**Request:** "Review the evidence for CRISPR-Cas9 off-target effects in therapeutic applications"

```
LITERATURE REVIEW: CRISPR-Cas9 Off-Target Effects in Therapeutics
SEARCH DATE: 2026-06-13 | DATABASES: PubMed, Scopus
SEARCH STRATEGY: ("CRISPR-Cas9" OR "gene editing") AND ("off-target" OR "specificity") AND ("therapeutic" OR "clinical")
RESULTS: 847 papers identified, 34 included (2020-2026)

EVIDENCE TABLE:
| Author (Year)    | Design      | n    | Key Finding                         | Effect Size     | Relevance |
|------------------|-------------|------|-------------------------------------|-----------------|-----------|
| Wienert 2023     | GUIDE-seq   | 12   | Modified Cas9 reduces OT by 90%     | 10-fold ↓       | High      |
| Kosicki 2022     | WGS         | 8    | Large deletions at OT sites         | 0.1-4.5% freq  | High      |

SYNTHESIS:
  Theme 1: Consensus — High-fidelity variants (eSpCas9, HF1) reduce OT 10-100×
  Theme 2: Conflict — Detection sensitivity varies 1000× between methods

GAPS IDENTIFIED:
  - Long-term OT effects in primary cells (>6 months)
  - OT in vivo vs. in vitro correlation

EVIDENCE QUALITY: Moderate — mostly in vitro, limited in vivo validation
```
