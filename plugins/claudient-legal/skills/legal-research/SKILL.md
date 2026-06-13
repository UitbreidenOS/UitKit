---
name: "legal-research"
description: "Legal research assistant: case law summaries, regulatory guidance, jurisdiction comparison"
---

# Legal Research Skill

## When to activate
- Summarising case law, regulations, or guidance documents before a meeting or memo
- Comparing how a legal question is treated across multiple jurisdictions
- Drafting a legal research memo with cited sources and analysis
- Understanding the practical implications of a new law or regulatory change
- Getting a first-pass reading of a statute or regulation before briefing counsel
- Preparing questions or a research agenda for external lawyers

## When NOT to use
- Giving legal advice to clients — Claude is a research assistant, not legal counsel
- Court filings, pleadings, or formal submissions — require a licensed attorney
- High-stakes irreversible decisions (signing a contract, regulatory response) — get actual counsel
- Jurisdictions where Claude may have limited training data — always validate with primary sources
- Real-time case law updates — check current databases (Westlaw, LexisNexis, Casetext, Free Law Project)

## IMPORTANT

Claude is a legal research assistant, not a lawyer. All outputs are for internal research purposes only and must be validated against authoritative primary sources before use. Legal analysis can change with new rulings, regulatory guidance, or statutory amendments. Always verify currency with a licensed practitioner in the relevant jurisdiction.

## Instructions

### Legal research memo prompt

```
Draft a legal research memo on: [LEGAL QUESTION]

Jurisdiction(s): [e.g. English and Welsh law / New York / EU / federal US / multi-jurisdiction]
Context: [why this question matters — business decision, contract issue, compliance concern]
Requester role: [in-house counsel / compliance officer / business stakeholder]
Depth: [quick brief (1-2 pages) / standard memo (4-6 pages) / deep research (10+ pages)]

Memo structure:
I. Question Presented
II. Short Answer (1-2 paragraphs — the answer, with key qualifications)
III. Facts Relevant to the Analysis
IV. Discussion
   - Legal framework / applicable statutes and regulations
   - Relevant case law (summarise key holdings)
   - Analysis of how law applies to our facts
   - Counterarguments or alternative interpretations
V. Conclusion and Recommendation
VI. Open Questions / Further Research Needed

Format citations as: [Case Name, [Year] Jurisdiction Citation] or [Statute/Regulation, Section]
Mark where primary source verification is needed: [VERIFY - source needed]
```

### Case law summary prompt

```
Summarise the following case for a non-lawyer audience.

Case: [Case name / citation / paste case text]
Context: We are researching this because [business/legal context].

Produce:
1. One-sentence holding (what the court decided)
2. Key facts (2-3 sentences — only facts relevant to the holding)
3. Legal principle established (the rule of law from this case)
4. Practical implication (how this affects our situation)
5. Precedential weight: [binding / persuasive / limited authority — and in which courts]
6. Any subsequent treatment (has it been followed, distinguished, or overruled? — flag if uncertain)

Keep language accessible to a business audience. Legal terms must be explained on first use.
```

### Jurisdiction comparison prompt

```
Compare how [LEGAL ISSUE] is treated across [JURISDICTIONS].

Issue: [plain language description of the legal question]
Jurisdictions to compare: [e.g. EU, UK, US-Federal, California, New York, Singapore]
Our business context: [why we need this comparison — contract choice of law, compliance in multiple markets, etc.]

For each jurisdiction, provide:
1. Applicable law/regulation (cite the statute or regulation name)
2. The rule in that jurisdiction (2-4 sentences)
3. Key requirements or thresholds
4. Enforcement body and enforcement history (brief)
5. Penalties for non-compliance
6. Key differences from the other jurisdictions listed

Output format: comparison table + one paragraph per jurisdiction for detail.
Flag: [VERIFY] on any specific penalty amounts, thresholds, or dates — these change.

End with: "Practical takeaway for a company operating in all of these jurisdictions" — what's the highest common denominator approach to compliance?
```

### Regulatory guidance summary prompt

```
Summarise this regulatory guidance document.

Source: [Regulator name, guidance title, date published]
[Paste text or provide URL/description]

Produce:
1. What the guidance covers (scope and purpose)
2. Who it applies to (regulated entities)
3. Key obligations or expectations (numbered list — what must or should regulated entities do?)
4. Deadlines or transition periods
5. What the regulator will look for in enforcement
6. How this differs from or clarifies previous guidance
7. Practical steps for compliance (what an in-house team should do following this guidance)

[VERIFY]: Note any provisions where the guidance is ambiguous or where I should consult primary regulation.
```

### Statute and regulation analysis prompt

```
Analyse [STATUTE/REGULATION] as it applies to [OUR SITUATION].

Statute: [cite fully — name, year, section]
Our situation: [describe the facts]
Jurisdiction: [where this applies]

Analysis structure:
1. Text of the relevant provision(s) — quote directly
2. Defined terms — how does the statute define key terms used?
3. Scope — who and what activities does this provision cover?
4. Application to our facts — does our situation fall within scope?
   - Elements of the provision: [list each element]
   - Our facts against each element: [analyse one by one]
   - Conclusion: [within scope / outside scope / uncertain]
4. Exceptions or safe harbours — are any available to us?
5. Enforcement mechanism — what can the regulator do?
6. Practical recommendation

[VERIFY] all statutory references against the current version of the legislation.
Note: statutes are frequently amended — confirm the version in force at the relevant date.
```

### Legal risk matrix prompt

```
Build a legal risk matrix for [PROJECT/TRANSACTION/ACTIVITY].

Context: [describe what we're doing — new product launch, entering a new market, M&A, etc.]
Jurisdictions involved: [list]
Stakeholders: [business teams involved]

For each identified legal risk:
| Risk | Legal basis | Likelihood | Impact | Owner | Mitigation |
|---|---|---|---|---|---|
| [Risk description] | [Law/reg/case] | H/M/L | H/M/L | [Role] | [Action] |

Risk categories to scan:
1. Regulatory: are we a regulated entity in this jurisdiction? Is this activity regulated?
2. Contract: what contractual obligations or gaps create exposure?
3. IP: does this activity infringe third-party rights, or fail to protect our own?
4. Data/Privacy: what personal data processing does this involve? What framework applies?
5. Employment: any new jurisdiction, new activity type, or new worker category?
6. Liability: where are the indemnification exposures? Is there any unlimited liability?
7. Compliance: export controls, sanctions, anti-bribery, competition law
8. Litigation: any ongoing disputes that this activity could trigger or worsen?

Flag any risk that requires external counsel before proceeding.
```

### Contract interpretation prompt

```
Interpret this contract clause in the context of the following dispute.

Clause: "[paste exact clause text]"
Contract type: [SaaS / services / employment / NDA / M&A]
Governing law: [jurisdiction]
Factual context: [what happened — the dispute facts in 3-5 sentences]
Our position: [what interpretation benefits us]
Counterparty's likely position: [what interpretation benefits them]

Analysis:
1. Plain reading — what does the clause say on its face?
2. Defined terms — are any words defined in the contract? How?
3. Contextual reading — how does the rest of the contract inform this clause?
4. How courts in [jurisdiction] interpret ambiguous contract language generally
   (e.g. contra proferentem, ejusdem generis, noscitur a sociis)
5. Which interpretation is stronger? Why?
6. What does the party that drafted this clause lose if our interpretation prevails?
7. Practical recommendation: negotiate / accept / litigate / seek specialist advice

[VERIFY]: For contested clause interpretation, instruct external counsel before taking a position.
```

### Research agenda builder prompt

```
Build a legal research agenda for [TOPIC].

I need to brief external counsel in [X days/weeks] on [topic].
Budget for external counsel research: [X hours]
Questions I already know to ask: [list any]

Produce:
1. Legal questions to answer (ranked by priority)
2. For each question:
   - The research path (statutes → case law → secondary sources)
   - Jurisdictions to cover
   - Likely complexity (high/medium/low)
   - Recommended research tool (Westlaw / LexisNexis / BAILII / EUR-Lex / Google Scholar / Free Law)
3. Questions I can answer internally (with Claude + open sources)
4. Questions that require external counsel
5. A brief for external counsel: what we need, what we already know, what the business decision depends on

Estimated research time for external counsel: [X hours — broken down by question]
```

## Example

**User:** We're a UK SaaS company and want to know whether we can use customer data to train our AI model. Summarise the legal position under GDPR.

**Expected output:**
```markdown
# Legal Research Memo

**Question Presented:**
Can a UK SaaS company use customer personal data to train an internal AI model under UK GDPR?

**Short Answer:**
Yes, but only if there is a valid lawful basis for the processing, the purpose is compatible with the original collection purpose, and customers are informed. In practice, this typically requires: (a) either explicit consent, a legitimate interests assessment (LIA), or a contractual basis; (b) a DPIA if the AI training constitutes high-risk processing; and (c) updated privacy notices. Using data for AI training that customers did not expect — and have not been told about — creates significant GDPR enforcement risk.
[VERIFY against current ICO guidance — AI and data protection guidance updated 2024]

**Discussion:**

**1. Lawful Basis (Art. 6 UK GDPR)**
Processing customer data for AI training requires a lawful basis. The most commonly applicable bases:

- **Legitimate Interests (Art. 6(1)(f)):** Available if processing is necessary for your legitimate interests and not overridden by the data subject's interests. Must be supported by a documented LIA. ICO expects the LIA to consider: (i) the nature of the legitimate interest; (ii) necessity; (iii) balancing test against individual impact. Risk: customers may reasonably not expect their data used for AI training.
[VERIFY - ICO's AI and data protection guidance, 2024]

- **Consent (Art. 6(1)(a)):** Valid if freely given, specific, informed, and unambiguous. Requires a fresh consent if original consent did not specify AI training. Right to withdraw consent must be preserved. High bar — rarely workable at scale.

- **Performance of Contract (Art. 6(1)(b)):** Only available if AI training is strictly necessary to perform the contract. Unlikely to apply unless the product *is* an AI model the customer contracted for.

**2. Purpose Limitation (Art. 5(1)(b))**
Personal data collected for one purpose (e.g., using your SaaS product) can only be used for a compatible purpose. AI model training is likely a new purpose. Compatibility test (Art. 6(4)): consider link between purposes, context, nature of data, consequences, safeguards applied. 
[VERIFY] No definitive ICO ruling on AI training compatibility — current position is evolving.

**3. DPIA Requirement (Art. 35 UK GDPR)**
Large-scale processing of personal data using novel technology (AI/ML) is listed by ICO as likely requiring a DPIA. Build the DPIA before training begins.

**4. Privacy Notice Update (Art. 13-14)**
You must inform data subjects of this new processing. Update your privacy notice to describe: the fact of AI training, the lawful basis relied upon, any third-party involvement, and data subject rights (including the right to object if relying on legitimate interests).

**Practical Recommendation:**
Before using customer data for AI training: (1) Document a Legitimate Interests Assessment; (2) Update privacy notices; (3) Complete a DPIA; (4) Implement data minimisation — use pseudonymised or anonymised data where possible (truly anonymised data falls outside GDPR). Consult external privacy counsel on the specific facts before proceeding.

**Open Questions:**
- Is any of the data special category data (Art. 9) — e.g. health, political opinions? If so, Art. 9(2) basis required, significantly higher bar.
- Does the model output ever expose individual-level data? If yes, additional safeguards needed.
- Are any non-EU/UK customers involved? Check equivalent rules (CCPA, Swiss nFADP, etc.)
```

---
