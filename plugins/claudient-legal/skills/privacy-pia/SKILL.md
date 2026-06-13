---
name: "privacy-pia"
description: "Privacy Impact Assessment (PIA/DPIA): processing activity intake, lawful basis check, DPIA necessity test, risk register, DPO handoff — GDPR Article 35 workflow"
---

# Privacy PIA Skill

## When to activate
- Launching a new product feature that processes personal data
- Onboarding a new vendor who will handle personal data
- Changing how you use existing personal data (new purpose, new sharing)
- Mandatory DPIA required under GDPR Article 35 (systematic profiling, large-scale processing, public monitoring)
- Preparing your privacy governance documentation for a compliance audit

## When NOT to use
- Responding to a live data breach — different process (GDPR Art. 33/34)
- Data subject access requests — use the DSAR skill
- Formal legal submissions to supervisory authorities — needs your DPO + lawyer

## ⚠️ Important

A DPIA is mandatory under GDPR Art. 35 before processing that is "likely to result in a high risk." Failing to conduct a required DPIA is itself a violation. Claude structures the assessment — your DPO must review and sign off before the processing activity begins.

## Instructions

### Step 1 — Processing activity intake

```
Document this processing activity:

Activity name: [what you're building or changing]
Purpose: [why you're processing this data — be specific]
Data subjects: [who — customers / employees / users / public]
Personal data categories:
- Standard: [name, email, address, phone, etc.]
- Special categories (GDPR Art. 9): [health / biometric / ethnic origin / political / religious / sexual orientation / criminal convictions]
Controller: [your organisation]
Joint controllers (if any): [other organisations with decision-making power]
Processors: [vendors / tools handling data on your behalf]
Countries involved: [where data is stored / transferred to]
Retention period: [how long you keep the data]
```

### Step 2 — Lawful basis

```
Identify the lawful basis for this processing activity.

GDPR Article 6 lawful bases (pick one):
1. Consent (Art. 6(1)(a)): freely given, specific, informed, unambiguous — can be withdrawn
2. Contract (Art. 6(1)(b)): necessary for a contract with the data subject
3. Legal obligation (Art. 6(1)(c)): required by EU/member state law
4. Vital interests (Art. 6(1)(d)): protect life
5. Public task (Art. 6(1)(e)): public interest or official authority
6. Legitimate interests (Art. 6(1)(f)): your interests vs. data subject rights (LIA required)

For special category data, ALSO need an Art. 9(2) condition:
- Explicit consent
- Employment law obligation
- Vital interests (incapacitated person)
- Legitimate activities of a not-for-profit body
- Manifestly made public
- Legal claims
- Substantial public interest
- Health/social care
- Public health
- Archiving/research

Document the lawful basis and why it applies.
[VERIFY] with DPO — selecting the wrong basis is a compliance issue.
```

### Step 3 — DPIA necessity test

```
Determine whether a full DPIA (Data Protection Impact Assessment) is mandatory.

DPIA is mandatory if processing is "likely to result in high risk." Check:

Mandatory triggers (Art. 35(3) and EDPB guidelines):
- Systematic and extensive automated profiling with legal/significant effects? [yes/no]
- Large-scale processing of special category data (health, biometric, etc.)? [yes/no]
- Systematic monitoring of a publicly accessible area? [yes/no]

EDPB criteria (2+ = DPIA likely required):
- Evaluation/scoring of individuals? [yes/no]
- Automated decision-making with legal/significant effects? [yes/no]
- Systematic monitoring? [yes/no]
- Sensitive data or data of highly personal nature? [yes/no]
- Large-scale processing? [yes/no]
- Matching or combining datasets? [yes/no]
- Data concerning vulnerable subjects? [yes/no]
- Innovative use or applying new technological/organisational solutions? [yes/no]
- Prevents data subjects from exercising their rights? [yes/no]

Recommendation: [DPIA mandatory / DPIA recommended / DPIA not required — document reasoning]
```

### Step 4 — Risk register

```
Identify and assess privacy risks for this processing activity.

For each risk: [Risk] | [Likelihood: High/Med/Low] | [Severity: High/Med/Low] | [Mitigation] | [Residual risk after mitigation]

Common risks to assess:
1. Unauthorised access / data breach
2. Data used beyond stated purpose (purpose creep)
3. Excessive collection (data minimisation failure)
4. Inaccurate data causing harm to data subject
5. Retention beyond necessary period
6. Transfer to third country without adequate safeguards
7. Denial of rights (access, erasure, portability)
8. Discriminatory outcomes from automated processing
9. Re-identification of pseudonymised data
10. Vendor/processor failure

After mitigation measures, is residual risk acceptable?
If HIGH residual risk remains — must consult ICO/DPA before proceeding (Art. 36).
```

### Step 5 — DPO handoff summary

```
Generate a DPO handoff summary for this PIA/DPIA.

Include:
- Activity description (one paragraph)
- Lawful basis and rationale
- DPIA required? Yes/No — reasoning
- Top 3 risks and mitigations
- Open questions requiring DPO guidance
- Recommended sign-off: [approve / approve with conditions / reject / consult DPA]

[VERIFY] with DPO before processing begins.
```

## Example

**New feature:** An app wants to use location data + purchase history to build user profiles for personalised advertising.

**Claude's assessment:**

**Processing activity:** Combining location data and purchase history for profiling-based personalised advertising.

**Lawful basis:** Consent (Art. 6(1)(a)) required — legitimate interests unlikely to override given intrusiveness of location tracking.

**DPIA mandatory:** YES — systematic profiling (trigger 1), matching of multiple datasets (EDPB criterion 6), and special character of location data (persistent tracking). 3+ criteria met.

**Top risks:**
- High: Profile data used beyond advertising purpose (purpose creep) — mitigation: contractual purpose limitation + technical enforcement
- High: Location data reveals sensitive information (health, religious practice, union activity) — mitigation: aggregation + minimum precision
- Medium: Consent not freely given if feature-gated — mitigation: genuine opt-in, no penalty for refusing

**DPO recommendation:** DPIA mandatory before launch. Consult ICO if residual risk remains high after mitigation.

---
