---
name: brief-section-drafter
description: "Litigation brief drafting: argument sections, statement of facts, standard of review, reply briefs — structured legal writing with citation placeholders and attorney review gates"
---

# Brief Section Drafter Skill

## When to activate
- Drafting a section of a litigation brief (argument, facts, procedural history)
- Structuring a legal argument with IRAC (Issue, Rule, Analysis, Conclusion)
- Writing a statement of facts from case materials
- Drafting a reply or opposition brief section
- Generating an outline before writing a full argument section

## When NOT to use
- Final filings — attorney must review and sign every document before filing
- Jurisdiction-specific procedural rules — verify local rules manually
- Advice on litigation strategy — that requires legal judgment, not drafting
- Settlement negotiations — different process entirely
- Non-litigation documents (contracts, policies) — use the contract-review skill

## Instructions

### Argument section (IRAC structure)

```
Draft an argument section for [brief type].

Issue: [the legal question the court must decide]
Standard of review: [de novo / abuse of discretion / clear error / rational basis]
Our position: [what we are arguing]
Applicable rule/statute/case: [the controlling law — cite by name, fill exact citation later]
Key facts supporting our position: [list from the record]
Opponent's likely counter-argument: [anticipated objection]
Our response to counter: [rebuttal]

IRAC structure for this section:

I. HEADING (argumentative, not neutral):
   Format: "[PARTY] IS ENTITLED TO [RELIEF] BECAUSE [REASON]."
   Example: "THE MOTION FOR SUMMARY JUDGMENT MUST BE DENIED BECAUSE GENUINE DISPUTES OF MATERIAL FACT EXIST."

R. RULE:
   [State the controlling legal standard clearly and completely]
   [Cite primary authority first — statute, then binding precedent]
   [Secondary authority only if primary is silent or ambiguous]
   [Citation format: [CITATION PLACEHOLDER — verify with Bluebook/local rules]]

A. ANALYSIS:
   [Apply the rule to our facts methodically]
   [Address every element of the legal test]
   [Use record citations: [Record at ___] for every factual assertion]
   [Distinguish adverse authority — don't ignore it]
   [For policy arguments: frame as supporting the court's rationale, not our preference]

C. CONCLUSION:
   [One sentence: state the relief requested]
   "Accordingly, this Court should [grant/deny] [relief]."

Draft: [complete argument section in this structure]
Attorney review required before filing. All citations marked [CITATION PLACEHOLDER] must be verified.
```

### Statement of facts

```
Draft a statement of facts for [brief/motion].

Case: [case name and type — e.g. breach of contract, employment discrimination]
Our client: [plaintiff / defendant]
Key facts we want the court to remember: [list — most important first]
Harmful facts we must address honestly: [list — facts we can't omit]
Tone: [neutral recitation / sympathetic to our client / focused on procedural history]
Record sources: [deposition transcripts, exhibits, declarations — list what's available]

Statement of facts structure:

1. Introduction paragraph:
   [1-2 sentences that frame the story from our client's perspective]
   [Introduce the parties without editorialising]

2. Chronological narrative:
   [Present facts in the order they occurred]
   [Every fact: cite the record — [Record at ___], [Decl. of ___ ¶ ___], [Ex. ___]]
   [Use plain English — courts want clarity, not legalese]
   [Active voice for facts that help us; passive voice acceptable for adverse facts]

3. Key disputed facts:
   [Identify factual disputes clearly if relevant to the motion]
   ["[Party] contends that ___. [Other Party] disputes this and maintains ___. [Record at ___]."]

4. Procedural history (if motion requires it):
   [Complaint filed [date] / Answer filed / Discovery closed / Motion filed]

Rules:
- Every factual statement must have a record citation — no citation = don't include
- Do not argue in the facts section — save argument for the argument section
- Unfavourable facts that are in the record must be included honestly
- All [Record at ___] citations are placeholders — attorney must verify page/line numbers

Draft the statement of facts with [RECORD CITATION] placeholders throughout.
```

### Opposition and reply brief section

```
Draft a reply/opposition section responding to [opposing argument].

Opposing argument summary: [paste or describe their argument]
Our counter-position: [what we argue in response]
Weaknesses in their argument: [legal errors, factual misstatements, missing authority]
Our strongest authority: [key cases or statutes supporting our reply]

Opposition structure:

Opening (reframe the issue):
[1-2 sentences that reframe the issue in our favour before engaging their argument]
"[Opposing party]'s argument rests on a misreading of [authority] and ignores [key fact/law]."

Attack the legal foundation:
[If they cited the wrong standard: "The [court/statute] does not support [their reading] because [reason]."
[If they ignored controlling authority: "Conspicuously absent from [opposing party]'s brief is [case], which directly controls here."]
[If they overstated the holding: "[Case] does not stand for the proposition that [their claim]. Rather, the court held [correct holding]."]

Attack the factual application:
[Where they misstated the record: "[Opposing party] claims [X]. The record shows otherwise. [Record at ___."]
[Where they omitted key facts: "[Opposing party] fails to mention [key fact], which [affects analysis in X way]."]

Distinguish their cases:
"[Their case] is distinguishable. There, [key difference]. Here, by contrast, [our facts]."

Conclusion:
"[Opposing party]'s argument fails. This Court should [relief requested]."

Draft the reply/opposition section. Mark all citations [CITATION PLACEHOLDER].
Attorney must review before filing.
```

### Brief outline generator

```
Generate a brief outline before drafting.

Brief type: [motion to dismiss / summary judgment / appeal / opposition / reply]
Our claims/issues: [list each legal issue to address]
Strongest arguments: [ranked 1-5]
Word/page limit: [X pages — check local rules]

Brief structure:

I. INTRODUCTION (1-2 pages):
   [Roadmap of all arguments; no citations needed here]

II. STATEMENT OF FACTS (X pages):
   A. [First period of facts]
   B. [Second period]

III. ARGUMENT
   A. [STRONGEST ARGUMENT — full IRAC]
      1. [Sub-issue 1]
      2. [Sub-issue 2]
   B. [SECOND ARGUMENT]
   C. [THIRD ARGUMENT — if space allows]
   
   Rule: strongest argument first, unless the court must address a threshold issue (jurisdiction, standing, waiver) before reaching the merits.

IV. CONCLUSION (half page):
   [Summary + relief requested]

Page allocation:
- Introduction: [X pages]
- Facts: [X pages]
- Argument A: [X pages]
- Argument B: [X pages]
- Conclusion: [0.5 pages]
- Total: [X] of [page limit]

Generate outline for my specific brief with section headings.
```

## Example

**User:** I'm writing an opposition to a motion for summary judgment in an employment discrimination case. The employer argues there's no direct evidence of discrimination. Help me draft the argument section.

**Claude's draft (with attorney review gate):**

---

**ARGUMENT**

**I. SUMMARY JUDGMENT MUST BE DENIED BECAUSE GENUINE DISPUTES OF MATERIAL FACT EXIST AS TO WHETHER DEFENDANT'S STATED REASON FOR TERMINATION WAS PRETEXTUAL.**

Under [CITATION PLACEHOLDER — McDonnell Douglas Corp. v. Green or applicable circuit standard], a plaintiff opposing summary judgment on a disparate treatment claim need not produce direct evidence of discriminatory intent. [CITATION PLACEHOLDER]. A plaintiff establishes pretext by showing that the employer's stated reason has no basis in fact, did not actually motivate the discharge, or was insufficient to motivate discharge. [CITATION PLACEHOLDER].

Here, [Plaintiff] has produced evidence sufficient to raise genuine disputes on all three grounds. First, [Defendant] claims it terminated [Plaintiff] for [stated reason], but [Plaintiff]'s performance reviews for the preceding [X] years rated her performance as [rating]. [Record at ___]. Second, [Defendant] retained [comparator employee of different protected class] who engaged in substantially similar conduct. [Record at ___; Decl. of ___ ¶ ___]. Third, the temporal proximity between [Plaintiff]'s [protected activity/complaint] on [date] and her termination [X days] later permits an inference of retaliatory motive. [CITATION PLACEHOLDER].

These disputes are not merely semantic — they go to the heart of whether [Defendant]'s stated reason was the real reason for termination. Accordingly, summary judgment must be denied.

---

*Attorney review required before filing. All [CITATION PLACEHOLDER] markers must be replaced with verified citations. All [Record at ___] markers require verified page/line numbers from the record.*

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
