---
name: "eu-ai-act"
description: "EU AI Act (Regulation 2024/1689) compliance: risk tier classification (prohibited/high-risk/limited/minimal), conformity assessment routes, Annex IV documentation, and obligations by organisational role"
---

# EU AI Act Skill

## When to activate
- Classifying an AI system's risk tier under Regulation (EU) 2024/1689
- Determining conformity assessment requirements for high-risk AI systems
- Identifying obligations per organisational role (provider, deployer, importer, distributor)
- Preparing Annex IV technical documentation for a high-risk AI system
- Assessing whether an AI system is prohibited under Article 5
- Planning EU AI Act compliance timelines and milestones

## When NOT to use
- GDPR compliance for AI training data or output processing — use the gdpr-expert skill (Acts interact but are separate)
- General AI strategy — this skill is for compliance work, not strategic AI decisions
- US AI governance (NIST AI RMF, state laws) — different frameworks
- Binding legal opinion on novel classifications — engage qualified EU law counsel

## Instructions

### Risk tier classification

```
Classify this AI system under the EU AI Act.

System description: [describe what the AI system does]
Input data: [what data it processes]
Output / decisions: [what it produces or decides]
Deployment context: [where and by whom it will be used]
Organisational role: [provider (placing on market) / deployer (using in own operations) / both]

Classification framework (hierarchical — check in order):

STEP 1 — ARTICLE 5: PROHIBITED PRACTICES (absolute ban):
Any of these = prohibited; cannot be placed on market or used in the EU:
□ Subliminal manipulation causing harm to a person
□ Exploitation of vulnerabilities of specific groups (age, disability) causing harm
□ Social scoring by public authorities leading to detrimental treatment
□ Real-time remote biometric identification in public spaces by law enforcement (with very narrow exceptions)
□ Biometric categorisation inferring race, political opinion, trade union membership, religious belief, sexual orientation
□ Emotion recognition in workplace or educational settings
□ Untargeted scraping of facial images to build databases

If any above = YES → PROHIBITED. Do not proceed.

STEP 2 — ARTICLE 6 + ANNEX III: HIGH-RISK:
System is high-risk if it falls under one of 8 Annex III categories AND is used as intended:

Annex III categories:
1. Biometric identification and categorisation (not prohibited ones)
2. Critical infrastructure (water, gas, electricity, transport)
3. Education and vocational training (student assessment, access decisions)
4. Employment and worker management (recruitment screening, performance monitoring, task allocation)
5. Essential private and public services (credit scoring, benefits eligibility, insurance, emergency services)
6. Law enforcement (risk assessment, polygraphs, evidence evaluation, crime prediction)
7. Migration, asylum, border control (risk assessment, document verification, applications processing)
8. Administration of justice and democratic processes

Article 6(3) CARVE-OUTS (system is Annex III but NOT high-risk if it ONLY):
a) Performs a narrow procedural task
b) Improves result of a previously completed human activity
c) Detects decision-making patterns without replacing human assessment
d) Performs a preparatory task to an assessment
⚠️ EXCEPTION: profiling of natural persons is ALWAYS high-risk regardless of carve-outs

If Annex III category applies AND no carve-out → HIGH-RISK (Article 8-17 obligations apply)

STEP 3 — ARTICLE 50: LIMITED-RISK (transparency only):
□ Chatbots / conversational AI interacting with humans → must disclose AI nature
□ Deepfakes / synthetic media → must label as AI-generated
□ Emotion recognition outside Article 5 contexts → transparency obligations
□ Biometric categorisation outside Article 5 contexts → transparency obligations

If any above = YES → LIMITED-RISK (disclosure obligations only)

STEP 4 — MINIMAL-RISK (default):
Everything else → no obligations under the Act (voluntary codes of conduct encouraged)

Output: risk tier + Article reference + obligations triggered
[LEGAL REVIEW REQUIRED for novel or borderline classifications]
```

### High-risk system obligations

```
Map obligations for a high-risk AI system.

System: [name and brief description]
Risk tier confirmed: HIGH-RISK (Annex III, category [X])
Organisational role: [provider / deployer / both]

PROVIDER OBLIGATIONS (Article 16) — placing the system on the EU market:

Article 9 — Risk Management System:
□ Establish, implement, document, and maintain risk management throughout lifecycle
□ Risk management is iterative — must be updated throughout the system's lifecycle
□ Identify and analyse known and foreseeable risks
□ Adopt risk mitigation measures; residual risk must be acceptable

Article 10 — Training Data Governance:
□ Training, validation, and testing data must meet quality criteria
□ Data must be relevant, representative, free of errors, complete
□ Bias examination and detection procedures in place
□ Special category data in training only where strictly necessary + safeguards

Article 11 — Technical Documentation (Annex IV):
Must be prepared BEFORE placing on market. Contains:
□ General description of the AI system and its intended purpose
□ Description of elements and development process
□ Monitoring, functioning, and control information
□ Description of changes made throughout the system's lifecycle
□ Risk management documentation
□ Post-market monitoring plan
□ All other documentation required by Annex IV

Article 12 — Record Keeping (logging):
□ Automatic logging of events throughout the system's operation
□ Logs retained for at least 6 months (or longer per sector rules)
□ Logs must allow traceability of operation and incident reconstruction

Article 13 — Transparency and Information:
□ Instructions for use provided to deployers (what the system does, limitations, accuracy levels)
□ Human oversight measures described
□ Level of accuracy, robustness, cybersecurity specified

Article 14 — Human Oversight:
□ Design must allow natural persons to effectively oversee and intervene
□ Deployers must be able to understand capabilities and limitations
□ Must be able to disregard, override, or reverse outputs
□ Must be able to interrupt the system via a stop button or similar

Article 15 — Accuracy, Robustness, Cybersecurity:
□ Documented accuracy metrics for intended purpose
□ Resilience to errors, faults, and inconsistencies
□ Resilience against adversarial attempts to alter performance

DEPLOYER OBLIGATIONS (Article 26) — using the system in operations:
□ Use system only in accordance with instructions for use
□ Assign human oversight to qualified persons
□ Monitor operation and report serious incidents to provider (and authority if direct harm)
□ Run Fundamental Rights Impact Assessment if required (public sector + essential services)
□ Inform employees when working alongside or under supervision of high-risk AI

Generate the full obligation checklist for my system and role.
```

### Conformity assessment

```
Plan the conformity assessment route for [high-risk AI system].

System: [name]
Annex III category: [specify]
Conformity route per Article 43:

MODULE A — Internal Control (most common route):
Available for: most Annex III categories EXCEPT biometric identification and GPAI with systemic risk
Process:
□ Prepare technical documentation per Annex IV
□ Implement quality management system per Article 17
□ Conduct internal conformity assessment
□ Draw up EU declaration of conformity
□ Affix CE marking before placing on market
□ Register in EU database (Article 49) — public sector deployers AND providers

MODULE H — Full Quality Management System + Notified Body:
Required for: real-time remote biometric identification systems
Also applicable: provider may choose this route for any high-risk system
Process:
□ All Module A steps PLUS:
□ QMS audited and approved by an accredited Notified Body
□ Technical documentation assessed by Notified Body
□ Notified Body issues EU type-examination certificate
□ Ongoing surveillance by Notified Body

TIMELINE (provider milestones):
- Preparation of technical documentation: [X months]
- Internal conformity assessment (Module A): [X weeks]
- CE marking and declaration of conformity: [upon completion]
- EU database registration: before placing on market
- Post-market monitoring: begins from first deployment

ANNEX IV TECHNICAL DOCUMENTATION CHECKLIST:
□ General description: intended purpose, interactions with hardware/software, versions
□ Detailed description: methods and steps for development, design specifications
□ Architecture: choice of architecture, algorithms, training methodologies
□ Training data: data sources, labels, criteria for selection, examination for bias
□ Validation and testing: test protocols, metrics, test logs and reports
□ Quality management system: description of system per Article 17
□ Monitoring: post-market monitoring plan per Article 72
□ Risk management: documentation of risk management measures

Output: recommended route + documentation checklist + milestone timeline.
[LEGAL REVIEW REQUIRED before affixing CE marking]
```

### Compliance timeline

```
Build an EU AI Act compliance timeline for [organisation].

Organisation: [describe — AI provider / deployer / importer]
AI systems in scope: [list or describe]
Current date: [2026-05-20]

EU AI Act implementation timeline:

PROHIBITIONS — Article 5:
February 2, 2025 — ALL prohibited AI practices banned immediately
✅ Status: Already in force — review your AI inventory NOW for any prohibited systems

GPAI MODEL OBLIGATIONS — Articles 51-55:
August 2, 2025 — General-purpose AI model providers must comply
If you train or fine-tune foundation models: obligations already apply

HIGH-RISK ANNEX III OBLIGATIONS — Articles 8-17:
August 2, 2026 — Most high-risk AI system rules apply
[12 months away as of May 2026]

ANNEX I HIGH-RISK (safety components in regulated products):
August 2, 2027 — Sector-specific timeline for AI in regulated products (medical devices, machinery, etc.)

NATIONAL COMPETENT AUTHORITIES:
Each EU member state must designate market surveillance authority by August 2, 2025

KEY PENALTIES:
- Prohibited practices violations: up to €35M or 7% of global annual turnover
- High-risk obligations violations: up to €15M or 3% of global annual turnover
- Incorrect information to authority: up to €7.5M or 1.5% of global annual turnover

YOUR COMPLIANCE ROADMAP:
Month 1-2: Inventory all AI systems used or provided → classify each by risk tier
Month 2-3: For prohibited systems → cease use immediately
Month 3-6: For high-risk systems → begin technical documentation and conformity assessment
Month 6-9: Implement human oversight, logging, and accuracy requirements
Month 9-12: Complete conformity assessment, register in EU database
Ongoing: Post-market monitoring, incident reporting, annual review

Generate the prioritised timeline for my specific AI system portfolio.
```

## Example

**User:** We have a B2B SaaS HR tool that uses AI to rank job applicants and flag "high potential" employees for promotion. EU customers. Are we high-risk under the AI Act?

**Claude's classification:**

**Yes — this is almost certainly HIGH-RISK under Annex III, Category 4 (Employment and Worker Management).**

Article 6 + Annex III, point 4 covers AI systems used for:
- Recruitment and selection of natural persons (your applicant ranking tool)
- Promotion and advancement decisions (your "high potential" flagging)

Both uses fall squarely within Annex III category 4.

**Can the Article 6(3) carve-outs save you?** Unlikely:
- "Narrow procedural task" — no, ranking and flagging candidates is consequential, not narrow
- "Improves previously completed human activity" — only if humans have already made the ranking; your AI does the ranking first
- "Detects patterns without replacing human assessment" — your "flag high potential" output directly influences HR decisions

**What this means:**
As the **provider** placing this on the EU market, you must (by August 2, 2026):
1. Prepare Annex IV technical documentation — how the model works, training data used, bias examination, accuracy metrics
2. Implement a risk management system across the lifecycle
3. Conduct a conformity assessment (Module A internal control likely sufficient)
4. Provide instructions for use to deployers (your HR customers) including limitations and oversight requirements
5. Register in the EU AI Act database before customer deployments

Your customers (HR teams using the tool) as **deployers** must:
- Assign qualified humans to oversee AI outputs before acting on them
- Not make final hiring/promotion decisions solely on AI output
- Conduct a Fundamental Rights Impact Assessment if they're public sector employers

**Immediate action:** Audit your training data for geographic and demographic bias — Annex III employment systems are scrutinised on this. An EU regulator's first question will be about bias in applicant ranking.

*This analysis is based on the current text of Regulation (EU) 2024/1689. Engage EU law counsel before making compliance decisions.*

---
