---
name: ai-impact-assessment
description: "AI Impact Assessment (AIA): EU AI Act classification, risk track, use case triage, policy consistency, vendor AI review — for legal and compliance teams"
updated: 2026-06-13
---

# AI Impact Assessment Skill

## When to activate
- Your organisation is deploying a new AI system or use case
- You need to classify an AI system under the EU AI Act
- Conducting a vendor AI review before procuring an AI product
- Auditing existing AI deployments for compliance gaps
- Generating an AI Impact Assessment document for internal governance

## When NOT to use
- Replacing a formal Data Protection Impact Assessment (DPIA) — run both where required
- Legal advice on AI Act obligations — consult specialist counsel
- Real-time AI system monitoring — needs dedicated tooling

## ⚠️ Important

The EU AI Act entered full application in August 2026. High-risk AI systems require mandatory conformity assessments and registration. Claude helps structure the assessment — your DPO and legal counsel must review before formal submissions.

## Instructions

### Step 1 — Use case intake

```
New AI system/use case to assess:

Name: [system or use case name]
Description: [what it does, in plain language]
Deployer/developer: [are we building this, or procuring it?]
Users: [employees / customers / third parties / public]
Output type: [decision / recommendation / content / classification / prediction]
Consequential outcomes: [what happens based on the AI's output?]
Data inputs: [personal data / biometric / sensitive categories?]
Scale: [how many people are affected?]
```

### Step 2 — EU AI Act classification

```
Classify this AI system under the EU AI Act:

PROHIBITED (Article 5) — check first:
- Social scoring by public authorities
- Real-time remote biometric identification in public spaces
- Subliminal manipulation
- Exploitation of vulnerable groups
- Inferring political/religious/racial characteristics from biometric data

If none of the above apply, classify by risk tier:

HIGH-RISK (Annex III) — mandatory conformity assessment required:
- Biometric identification/categorisation
- Critical infrastructure management
- Education/vocational training outcomes
- Employment/HR decisions
- Access to essential services (credit, insurance, healthcare)
- Law enforcement
- Migration/border control
- Administration of justice

LIMITED RISK:
- Chatbots and conversational AI (transparency obligation)
- Emotion recognition (disclosure required)
- AI-generated content (watermarking)
- General purpose AI models

MINIMAL RISK:
- AI used in games
- Anti-spam filters
- AI-powered search

[VERIFY] classification with legal counsel before relying on it.
```

### Step 3 — Risk track (fast vs. full assessment)

```
Based on the classification:

FAST TRACK (minimal/limited risk):
- Document the system and its purpose
- Implement required transparency measures
- Log the assessment in the AI inventory

FULL TRACK (high-risk):
Required documentation:
1. Technical documentation (Art. 11)
2. Conformity assessment (Art. 43)
3. Registration in EU database (Art. 71)
4. Post-market monitoring plan (Art. 72)
5. Serious incident reporting procedure (Art. 73)

Also required where personal data involved:
- Data Protection Impact Assessment (DPIA) under GDPR
- Data minimisation review
- Purpose limitation check

Which track applies to this system?
```

### Step 4 — Policy consistency check

```
Check this AI use case against our internal policies:

Use case: [describe]
Our AI policy says: [paste relevant policy text, or describe]

Is this use case consistent with:
1. Our acceptable use policy for AI?
2. Our data handling standards?
3. Our vendor approval process?
4. Our risk appetite statement?

Identify any gaps between the use case and our stated policies.
Draft an exception request if a gap exists but the use case is still justified.
```

### Step 5 — Vendor AI review

```
We're procuring an AI product from [vendor name].
Product: [what it does]
Their AI claims: [what they say about their AI capabilities]

Review this vendor for AI governance:
1. Do they publish a model card or system card?
2. Do they disclose training data sources?
3. Do they have bias testing results?
4. Do they have a responsible AI policy?
5. What data do they use from our inputs to train future models?
6. EU AI Act compliance status?
7. Key contractual provisions we should require?

Flag any red flags that should block procurement without further review.
```

### Step 6 — Generate the AIA document

```
Generate a formal AI Impact Assessment document.

System: [name]
Classification: [high-risk / limited / minimal]
Summary of assessment: [paste findings from Steps 1-4]

Document sections:
1. System description and purpose
2. Risk classification and rationale
3. Data inputs and personal data assessment
4. Potential harms and affected groups
5. Bias and fairness considerations
6. Human oversight mechanisms
7. Governance and accountability
8. Residual risks and mitigation measures
9. Conditions for deployment
10. Review schedule

[VERIFY] with DPO and legal counsel before finalising.
```

## Example

**Use case:** An HR team wants to use an AI tool that screens CVs and scores candidates before human review.

**Claude's assessment:**

**Classification: HIGH-RISK** — Annex III, Section 4: AI systems used in employment and workers management, including for recruitment, selection, and evaluation of candidates.

**Required before deployment:**
- Full technical documentation (Art. 11)
- Conformity assessment or third-party audit
- Registration in EU AI Act database
- DPIA (processes biometric-adjacent data — photos, age inference)

**Key risks:**
- Proxy discrimination: model may proxy for protected characteristics via zip code, name, graduation year
- Training data bias: if trained on historical hires, replicates historical bias
- Lack of transparency: candidates have right to meaningful explanation of automated decisions (GDPR Art. 22)

**Required safeguards:**
- Human review mandatory before any rejection
- Candidate disclosure that AI is used in screening
- Bias testing on protected characteristics before deployment
- Right to human review upon request
- Regular bias audits post-deployment

**Recommended:** Procurement should be conditional on vendor providing conformity assessment documentation and agreeing to contractual audit rights.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
