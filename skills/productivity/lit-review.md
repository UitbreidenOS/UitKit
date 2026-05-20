---
name: lit-review
description: "Academic literature review: systematic search strategy, paper screening, synthesis frameworks, citation management, and producing a structured review section or summary"
---

# Lit Review Skill

## When to activate
- Conducting a systematic or scoping review of academic literature
- Synthesising findings across multiple papers on a topic
- Writing a literature review section for a thesis, report, or paper
- Identifying gaps in existing research
- Evaluating the quality of academic evidence
- Finding the canonical citations for a technical concept

## When NOT to use
- Patent analysis — use the patent-analysis skill
- General internet research — this is academic-literature specific
- Primary data collection or study design — different research methods skill
- Writing the full paper — this skill covers review, not original research

## Instructions

### Search strategy

```
Design a literature search strategy for [topic].

Research topic: [describe — what question are you trying to answer?]
Review type: [systematic (exhaustive) / scoping (broad mapping) / narrative (selective)]
Databases to search: [PubMed / Scopus / Web of Science / ACM / IEEE / Google Scholar / arXiv]
Date range: [last 5 years / 2000-present / all time]
Languages: [English only / all languages]

Search strategy:

1. Decompose the topic into concepts:
   PICO (for medical/clinical) or SPIDER (qualitative):
   Population: [who/what is being studied]
   Intervention/exposure: [what is being done/studied]
   Comparison: [what is it compared to, if applicable]
   Outcome: [what is being measured]

2. Build keyword lists for each concept:
   Concept 1: [main term] AND [synonyms] AND [abbreviations]
   Example: "machine learning" OR "ML" OR "artificial intelligence" OR "deep learning"
   
   Concept 2: [main term] AND [synonyms]
   Example: "clinical prediction" OR "diagnostic accuracy" OR "clinical decision support"

3. Combine with Boolean operators:
   (Concept 1 keywords) AND (Concept 2 keywords) AND (Concept 3 keywords)

4. Apply filters:
   - Date range: published: [YYYY] to [YYYY]
   - Document type: journal articles / conference papers / exclude dissertations
   - Language: English
   - Study type (if applicable): randomised controlled trial / systematic review / cohort

5. Run in each database separately (don't assume they're the same):
   - Record: database, search string used, date run, number of results

6. Manage duplicates across databases:
   Use: Zotero / Mendeley / Rayyan for deduplication
   Export all results → combine → deduplicate on title/DOI

Generate the search strategy for my topic with database-specific search strings.
```

### Screening protocol

```
Screen papers for inclusion/exclusion for [review].

Total retrieved: [X papers]
Inclusion criteria: [what qualifies for inclusion]
Exclusion criteria: [what gets removed and why]

Screening protocol:

STAGE 1 — Title and abstract screening (fastest):
Include if: title or abstract suggests the paper addresses [your topic]
Exclude if: clearly off-topic, wrong population, wrong study type
Decision: include / exclude / unsure (unsure → include for full-text review)

STAGE 2 — Full-text screening:
Read the methods section: does it meet all inclusion criteria?
Apply exclusion criteria systematically

Inclusion criteria checklist (customise for your topic):
□ Population: [describe who/what qualifies]
□ Intervention: [describe what must be studied]
□ Outcome: [what must be measured/reported]
□ Study design: [acceptable designs — e.g., RCT, cohort, before-after]
□ Publication: [peer-reviewed only / grey literature OK / conference papers OK]
□ Language: [English only]
□ Date: [published after YYYY]

Exclusion criteria:
□ Duplicate publication of same study
□ Insufficient data to extract (only abstract available)
□ Protocol paper without results
□ Conference abstract without full paper
□ Not peer-reviewed (if applicable)

Record decisions:
| Paper | Title | Decision | Reason for exclusion |
|---|---|---|---|
| [1] | [title] | Include | — |
| [2] | [title] | Exclude | Wrong population |

Target: inclusion rate of 5-15% is typical for systematic reviews.
If > 30%: search is too narrow or criteria too broad — revisit.
If < 2%: search is too broad or criteria too narrow — adjust.

Generate screening criteria for my specific review topic.
```

### Data extraction template

```
Extract data from papers for [review].

Papers to extract: [X included papers]
Research question: [restate]
Data to extract: [what information do you need from each paper]

Data extraction table (customise columns for your topic):

For each paper, record:
| Field | Description |
|---|---|
| Citation | Author (Year). Title. Journal. DOI. |
| Study design | RCT / cohort / cross-sectional / case-control / qualitative |
| Population | N, demographics, setting, country |
| Intervention | What was done, duration, dose |
| Comparison | Control condition |
| Outcome measure | Primary outcome, how measured |
| Key result | Main finding (include effect size / p-value / CI) |
| Risk of bias | High / Medium / Low (based on study design) |
| Relevance to our question | Direct / Indirect / Peripheral |
| Notes | Limitations, unusual findings, author conflicts |

Quality appraisal tools by study type:
- RCTs: Cochrane Risk of Bias tool (RoB 2)
- Cohort studies: Newcastle-Ottawa Scale (NOS)
- Qualitative: CASP checklist
- Systematic reviews: AMSTAR-2
- All study types: GRADE for certainty of evidence

Extraction best practices:
- Extract by one person, verify by a second (dual extraction reduces errors)
- Extract to the unit of analysis — if paper reports 3 relevant outcomes, extract each
- Note if data is missing or unclear — don't impute
- Record the figure/table source for each extracted number

Generate the extraction template for my review question and paper types.
```

### Synthesis and writing

```
Synthesise findings and write a literature review section.

Papers included: [X]
Themes emerging: [describe 3-5 recurring themes across papers]
Consensus findings: [where papers agree]
Contradictions: [where papers disagree and why]
Gaps: [what hasn't been studied]
Audience: [thesis committee / journal reviewers / policymakers / non-specialist]

Synthesis approaches:

NARRATIVE SYNTHESIS (most common):
Group papers by theme or finding, not by individual paper.
Don't: "Smith (2020) found X. Jones (2021) found Y. Brown (2022) found Z."
Do: "Multiple studies demonstrate [X], particularly in [context] (Smith 2020; Jones 2021). However, evidence is mixed in [different context], with Brown (2022) finding [Y] but Chen (2023) reporting [Z], potentially due to [methodological difference]."

META-ANALYSIS (if quantitative data is homogeneous):
Pool effect sizes across studies → weighted average
Requires: same outcome measure, comparable populations, compatible study designs
Tools: RevMan, R metafor package

THEMATIC ANALYSIS (for qualitative):
Code themes across papers → synthesise patterns

Literature review section structure:

1. Opening paragraph:
   [Frame the review in context of your research question]
   "This section reviews [X] studies examining [topic]."

2. Body (organised by theme, not by paper):
   Theme 1: [Finding across multiple papers + citations]
   Theme 2: [Contradictory evidence + explanation]
   Theme 3: [Methodological advances]

3. Gaps paragraph:
   "Despite substantial evidence for [X], [gap] remains understudied. [Only N studies] have examined [specific population/context]. This review [identifies / addresses] this gap."

4. Closing paragraph:
   [What the review establishes / what it cannot establish / how this sets up your research]

Write the literature review section for my included papers and themes.
```

## Example

**User:** I'm reviewing literature on LLM hallucination in medical settings for a conference paper. I've found 32 papers. How do I synthesise them?

**Claude's synthesis plan:**

32 papers is manageable for a narrative synthesis in a conference paper (rather than a full systematic review). Organise by theme, not by paper.

**Likely themes across 32 papers on LLM hallucination in medicine:**

1. **Frequency and clinical domains** — What rate of hallucination? Which clinical domains (radiology, drug dosing, rare diseases) are worst? (Organise papers by domain and report rates)

2. **Detection methods** — How do researchers identify hallucination? (Expert review / automated factcheck / patient outcome correlation) — synthesise methodological approaches

3. **Risk factors** — What increases hallucination risk? (Long-form outputs? Rare conditions? Specific LLMs?) — this is where disagreement usually lives

4. **Mitigation strategies** — RAG, fine-tuning, human-in-the-loop, constitutional AI — what evidence exists for each?

5. **Methodological gaps** — Most studies: small N, single institution, English-only, general LLMs rather than clinical fine-tunes. This is your gap section.

**Synthesis paragraph example (theme 1):**

"Hallucination rates in clinical LLM applications vary substantially by domain and task complexity. In drug dosing and pharmacology tasks, [X] studies report [range]% error rates (Smith 2023; Lee 2024; Patel 2024), with higher rates observed for rare medications or complex polypharmacy scenarios (Smith 2023; Brown 2024). Radiology report generation shows comparatively lower hallucination rates ([Y]%) in tasks involving structured findings (Jones 2023), though narrative interpretation tasks show rates approaching [Z]% (Kim 2024; Thomas 2024). Across domains, hallucination rates are consistently higher in contexts where the model must generate specific numerical values (dosages, lab reference ranges) compared to general clinical guidance (Smith 2023; Lee 2024; Kim 2024)."

Note: I'm synthesising across papers by finding, not by paper — this is the key structural shift.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
