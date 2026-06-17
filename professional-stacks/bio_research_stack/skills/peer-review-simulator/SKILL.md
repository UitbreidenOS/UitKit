---
name: peer-review-simulator
description: Simulates rigorous peer review of manuscripts, grant proposals, or experimental designs. Generates structured reviewer comments with severity ratings and actionable revision suggestions following standard journal review criteria.
allowed-tools: Read, WebSearch
effort: high
---

# Peer Review Simulator

## When to activate
Before submitting a manuscript or grant proposal, after receiving reviewer comments and needing a revision strategy, or when practicing critical evaluation of a draft. Use as a final quality gate before submission.

## When NOT to use
Skip for informal writing, blog posts, internal reports not intended for publication, or when you need a specific journal's formatting review (use that journal's checklist instead).

## Instructions

1. **Read the full document** — manuscript, proposal, or experimental design.
2. **Evaluate against standard criteria:**
   - **Novelty/Significance:** Does it address an important gap? Is the advance incremental or substantial?
   - **Methodology:** Are methods appropriate, well-controlled, and sufficiently detailed for replication?
   - **Statistics:** Correct test selection, appropriate sample size, proper reporting (effect sizes, CIs)?
   - **Data presentation:** Are figures clear, properly labeled, with appropriate error bars?
   - **Literature context:** Is the work placed appropriately relative to existing research?
   - **Conclusions:** Are claims supported by the data? Any over-interpretation?
   - **Writing quality:** Clear, logical flow? Grammar and terminology correct?

3. **Generate reviewer comments:**
   - **Major concerns:** Issues that must be addressed (missing controls, statistical errors, over-claims)
   - **Minor concerns:** Improvements that would strengthen the work (additional analysis, clearer figures)
   - **Strengths:** What the authors did well (important for balanced review)

4. **Rate severity:**
   - CRITICAL — Fundamental flaw, invalidates conclusions
   - MAJOR — Significant gap, must address before acceptance
   - MINOR — Improvement suggested, not blocking
   - NIT — Style preference, optional

## Output Format

```
PEER REVIEW: [Document type] — [Title]

OVERALL ASSESSMENT: [Accept / Minor Revision / Major Revision / Reject]
SCORE: [1-9 scale or journal-specific]

STRENGTHS:
  1. [Strength with specific reference]
  2. [...]

MAJOR CONCERNS:
  1. [CRITICAL/MAJOR] — [Issue + specific suggestion for resolution]
  2. [...]

MINOR CONCERNS:
  1. [MINOR] — [Issue + suggestion]
  2. [...]

SPECIFIC COMMENTS:
  - Line [X]: [Comment]
  - Figure [Y]: [Comment]
  - Table [Z]: [Comment]

CONFIDENTIAL (to editor): [Assessment of novelty, competitive landscape]
```

## Example

```
PEER REVIEW: Manuscript — "Compound X Inhibits Tumor Growth via Novel FAO Pathway"

OVERALL ASSESSMENT: Major Revision
SCORE: 5/9 (interesting but significant gaps)

STRENGTHS:
  1. Well-powered in vivo study (n=12/group, appropriate for effect size)
  2. Mechanistic depth — metabolomics + CRISPR validation is thorough
  3. Dose-response data is clean and convincing

MAJOR CONCERNS:
  1. [CRITICAL] — No selectivity data on normal cells. IC50 in HeLa alone doesn't
     establish therapeutic window. Must include primary fibroblast or hepatocyte toxicity.
  2. [MAJOR] — "Novel FAO pathway" is overstated. Wienert 2023 and Chen 2024 both
     described FAO dependency in resistant lines. Reframe as "validated and extended."
  3. [MAJOR] — Figure 3B lacks error bars and n is not stated in the legend.

MINOR CONCERNS:
  1. [MINOR] — Supplementary Table S2 should include raw data, not just processed means
  2. [MINOR] — Discussion paragraph 2 speculates about clinical dosing without PK data

SPECIFIC COMMENTS:
  - Line 47: "significant" used without statistical context — add p-value
  - Figure 2: Consider log scale for dose-response — improves visual clarity
  - Table 1: Add confidence intervals alongside p-values
```
