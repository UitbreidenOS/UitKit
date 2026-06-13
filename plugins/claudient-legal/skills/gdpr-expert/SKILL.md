---
name: "gdpr-expert"
description: "GDPR compliance: codebase privacy risk scanning, DPIA generation (Art. 35), data subject rights management (Art. 15-22), lawful basis assessment, and data processor agreements"
---

# GDPR Expert Skill

## When to activate
- Scanning a codebase or system for GDPR compliance risks
- Generating a Data Protection Impact Assessment (DPIA) under Article 35
- Managing data subject rights requests (access, erasure, portability, objection)
- Assessing the lawful basis for a data processing activity
- Reviewing a Data Processing Agreement (DPA) with a vendor
- Preparing for a GDPR audit or regulatory inquiry

## When NOT to use
- Cookie consent banners — implementation is a dev task, use the cookie library docs
- CCPA-only (US) compliance — this skill focuses on GDPR; many principles overlap but rules differ
- HIPAA compliance — different framework, use a specialist
- Replacing qualified Data Protection Officer (DPO) advice on novel or high-risk situations

## Instructions

### Privacy risk scan

```
Scan this system for GDPR compliance risks.

System description: [describe what the system does, what data it processes]
Tech stack: [languages, frameworks, databases]
Data categories processed: [list — email, name, IP, location, health, financial, biometric]
Users: [EU residents? B2B? B2C?]

GDPR risk checklist by category:

PERSONAL DATA IDENTIFICATION:
□ What personal data is collected? (name, email, IP, device ID, location, behavioural data)
□ What special category data is processed? (health, biometric, political, religious, sexual orientation)
□ Is all collected data actually necessary? (data minimisation — Article 5(1)(c))

LAWFUL BASIS (Article 6):
For each processing activity, identify the lawful basis:
- Consent (Art. 6(1)(a)): freely given, specific, informed, unambiguous — not bundled with ToS
- Contract (Art. 6(1)(b)): processing necessary to perform a contract with the data subject
- Legal obligation (Art. 6(1)(c)): required by EU/member state law
- Legitimate interests (Art. 6(1)(f)): must pass a 3-part LIA test — not a catch-all
🔴 Red flag: using "legitimate interests" without a documented Legitimate Interests Assessment

CONSENT MANAGEMENT:
□ Is consent obtained before data collection (not after)?
□ Is consent granular (separate for each purpose)?
□ Can users withdraw consent as easily as they gave it?
□ Is a consent record maintained with timestamp and version?

DATA RETENTION:
□ Is there a documented retention policy per data category?
□ Is data automatically deleted or anonymised after the retention period?
🔴 Red flag: "we keep data indefinitely" or "until the user deletes their account"

SECURITY (Article 32):
□ Personal data encrypted at rest and in transit?
□ Access controls: only authorised staff can access personal data?
□ Is personal data logged unnecessarily (debugging logs containing PII)?
□ Pseudonymisation in place where possible?

DATA PROCESSORS (Article 28):
□ Is there a signed DPA with every vendor that processes personal data?
□ Sub-processors listed and approved?
□ Vendor in a third country? Standard Contractual Clauses (SCCs) in place?

BREACH NOTIFICATION (Article 33-34):
□ Can you detect a data breach within 72 hours?
□ Is there a documented breach notification process?
□ Who is responsible for notifying the supervisory authority?

Output: risk register with Article reference, severity (🔴/🟡/🟢), and recommended fix.
```

### DPIA generation (Article 35)

```
Generate a Data Protection Impact Assessment for [processing activity].

Processing activity: [describe — e.g. "AI-driven employee monitoring system", "behavioural ad targeting"]
Controller: [organisation name]
DPO (if appointed): [name or "none appointed"]
Purpose: [why you process the data]
Data categories: [list]
Recipients: [who the data is shared with]
Third-country transfers: [yes/no — where]

DPIA is required (Art. 35(3)) when processing is likely to result in HIGH RISK:
□ Systematic and extensive profiling with significant effects on persons
□ Large-scale processing of special category data (Art. 9) or criminal data (Art. 10)
□ Systematic monitoring of publicly accessible areas

WP29 / EDPB adds 9 criteria — DPIA required if 2+ apply:
□ Evaluation or scoring (profiling, credit scoring)
□ Automated decision-making with legal or similarly significant effects
□ Systematic monitoring
□ Sensitive data or highly personal data
□ Data processed at large scale
□ Matched or combined datasets
□ Data about vulnerable subjects (children, employees, patients)
□ Innovative use or new technological or organisational solutions
□ Processing prevents data subjects from exercising a right or using a service

DPIA structure:

1. DESCRIPTION OF PROCESSING:
   - Purposes and lawful basis
   - Data categories and data subjects
   - Data flows (collection → processing → storage → deletion)
   - Processors and sub-processors involved
   - Retention periods

2. NECESSITY AND PROPORTIONALITY:
   - Is processing necessary for the stated purpose?
   - Could the same purpose be achieved with less data?
   - Is the chosen lawful basis appropriate?

3. RISK ASSESSMENT:
   | Risk | Likelihood | Severity | Residual risk after controls |
   |---|---|---|---|
   | Unauthorised access to personal data | Medium | High | Low (encryption + access controls) |
   | Data breach affecting large number of individuals | Low | Very high | Low (breach detection + 72h notification plan) |
   | Profiling leading to discrimination | Medium | High | Medium — needs monitoring |

4. MEASURES TO ADDRESS RISKS:
   - Technical measures: [encryption, pseudonymisation, access controls]
   - Organisational measures: [training, policies, DPA contracts]
   - Privacy by design: [data minimisation, purpose limitation built into architecture]

5. DPO CONSULTATION:
   [DPO review and sign-off, or rationale for why DPO not consulted]

6. SUPERVISORY AUTHORITY CONSULTATION:
   Required under Art. 36 if residual risk remains HIGH after all measures.
   [Decision: consult / not required — rationale]

Generate the DPIA for my processing activity.
[LEGAL REVIEW REQUIRED: DPO or qualified privacy counsel must review before finalising]
```

### Data subject rights handler

```
Handle a data subject rights request under GDPR Articles 15-22.

Request type:
- Article 15: Right of access (SAR — Subject Access Request)
- Article 16: Right to rectification
- Article 17: Right to erasure ("right to be forgotten")
- Article 18: Right to restriction of processing
- Article 19: Right to data portability
- Article 21: Right to object
- Article 22: Right not to be subject to automated decisions

Requestor: [name, email, or reference]
Date received: [date — response due within 30 days, extendable to 90 for complex]
Identity verified: [yes / no — do not process until identity confirmed]

Response workflow:

STEP 1 — Log and acknowledge (within 72 hours):
"We have received your request under [Article X] of the GDPR. We will respond within 30 days. Your reference number is DSR-[YYYY-MM-DD-NNN]."

STEP 2 — Verify identity:
Do not release personal data or confirm deletion without identity verification.
Acceptable: government ID, account verification, challenge questions.
If in doubt: request additional verification (Art. 12(6) permits this).

STEP 3 — Process the request:
For Article 15 (access): compile all personal data held, including:
  - Data categories held
  - Purposes of processing
  - Recipients and third-country transfers
  - Retention period
  - Source of data (if not from the subject directly)
  - Existence of automated decision-making

For Article 17 (erasure): erase from:
  - Primary database
  - Backups (within reasonable timeframe — note backup deletion schedule)
  - Third-party processors (notify them in writing)
  - Anonymise if erasure technically impossible
  
  Exceptions — erasure NOT required if processing is necessary for:
  - Legal obligation or legal claims
  - Freedom of expression and information
  - Public interest archiving

For Article 20 (portability): export data in machine-readable format (JSON, CSV).
  Applies only to: data provided by the subject + processed on consent or contract basis.

STEP 4 — Document the response:
Log: request date, type, identity verification, actions taken, response date, exemptions claimed.

STEP 5 — Respond within 30 days:
If unable to act: notify requestor with reason (can extend to 90 days with notification).
If manifestly unfounded or excessive: can charge reasonable fee or refuse (document reasoning).

Draft the response for my specific request type.
```

### Lawful basis assessment

```
Assess the lawful basis for [processing activity].

Processing activity: [describe precisely — what data, what purpose, what outcome]
Data subjects: [consumers / employees / B2B contacts / minors]
Relationship to data subjects: [customer / employee / prospect / public]

Lawful basis options under Article 6:

CONSENT (Art. 6(1)(a)):
Conditions: freely given, specific, informed, unambiguous, separate from other terms
Best for: newsletter subscriptions, non-essential cookies, marketing communications
Weakness: can be withdrawn at any time → processing must stop
🔴 Not valid if: bundled with contract, pre-ticked boxes, conditional on service access

CONTRACT (Art. 6(1)(b)):
Conditions: processing strictly necessary to perform a contract WITH the data subject
Best for: processing customer's order, delivering a paid service
🔴 Not valid for: marketing to existing customers, analytics, fraud prevention

LEGAL OBLIGATION (Art. 6(1)(c)):
Conditions: an EU or member state law requires the processing
Best for: tax records, employment law requirements, AML/KYC
🔴 Must cite the specific law — "we're legally required to" is insufficient

VITAL INTERESTS (Art. 6(1)(d)):
Conditions: protect life of the data subject or another person
Last resort only — almost never applicable to commercial processing

PUBLIC TASK (Art. 6(1)(e)):
For public authorities and those performing public functions. Rarely applicable to private companies.

LEGITIMATE INTERESTS (Art. 6(1)(f)):
Conditions: three-part LIA test must pass:
  1. Purpose test: is the interest legitimate?
  2. Necessity test: is processing necessary for that interest?
  3. Balancing test: do the interests override the data subject's rights?

Best for: fraud prevention, network security, B2B marketing, intra-group transfers
🔴 CANNOT be used: by public authorities; when fundamental rights override; for employee monitoring

For my activity, assess which basis applies and identify any weaknesses.
[LEGAL REVIEW REQUIRED before relying on the assessment]
```

## Example

**User:** We're building a SaaS product that uses AI to analyse user behaviour patterns and score customer health for our B2B customers. Their end-users' data flows through our system. What's our GDPR exposure?

**Claude's analysis:**

You are a **data processor** (Article 4(8)) — your B2B customers are the controllers. This has immediate implications:

**Your obligations as processor (Article 28):**
- Signed DPA with every B2B customer before processing their users' data
- Only process data on documented instructions from each controller
- Implement appropriate technical and organisational security measures
- Support controllers in fulfilling their own GDPR obligations (DSARs, DPIAs, breach notification)
- Delete or return all data at contract termination

**DPIA trigger check:**
Your AI behavioural scoring system likely triggers a DPIA requirement because it combines:
- Systematic evaluation/profiling of individuals (WP29 criterion 1)
- Innovative technology (new AI-based scoring) (WP29 criterion 9)
- Potentially large scale (if the B2B customers have many end-users)

The controllers (your B2B customers) are responsible for the DPIA — but they will need your technical documentation about how the AI works to complete it. Prepare a "processor's contribution to DPIA" document proactively.

**Highest-risk areas for you:**
1. 🔴 Sub-processor chain — every tool you use to run the AI (AWS, ML platform, monitoring) is a sub-processor. List them all. Your DPA must name them or describe the approval process.
2. 🔴 Third-country transfers — if your servers or ML infrastructure are in the US, you need SCCs or rely on the EU-US Data Privacy Framework.
3. 🟡 Transparency — end-users likely don't know their behaviour is being scored. Your customers (controllers) must tell them.

---
