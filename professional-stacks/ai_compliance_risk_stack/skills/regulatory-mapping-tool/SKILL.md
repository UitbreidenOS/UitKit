# Regulatory Mapping Tool

## When to activate

When identifying applicable regulations for AI systems, designing regulatory compliance controls, mapping specific regulatory requirements to operational procedures, assessing compliance gaps, or preparing for regulatory audits.

## When NOT to use

For legal advice or formal regulatory interpretation. This skill is for operational mapping: identifying which rules apply and designing compliance controls. For regulatory questions, consult qualified legal counsel.

## Instructions

### Regulatory Mapping Process

1. **Define System Scope**
   - Model name and business use case
   - Geographic scope: Where is model deployed? (US, EU, China, Canada, etc.)
   - Industry: What sector? (Finance, Healthcare, Employment, Consumer, etc.)
   - User/affected population: Employees, customers, vulnerable groups?
   - Decision type: Consequential (loan, hiring, medical) or advisory (recommendation)?

2. **Identify Applicable Regulations**
   
   Use this framework to identify relevant regulations:
   
   **Jurisdiction-Based:**
   - EU: GDPR, AI Act, sector-specific (ePrivacy, financial regulations, healthcare)
   - US: FTC Act, FCRA, HIPAA, EEOC employment rules, NIST AI RMF guidance, state laws (CCPA, etc.)
   - Global: Consider where data flows, where model is deployed
   
   **Industry-Specific:**
   - **Finance:** SEC disclosure rules, FINRA, banking regulations, Fair Lending laws (FCRA, ECOA)
   - **Healthcare:** HIPAA, FDA (if medical device), state licensing boards
   - **Employment:** Title VII, EEOC guidance, state hiring laws, anti-discrimination rules
   - **Consumer Protection:** FTC Act, CCPA, state consumer protection laws
   - **Automated Decision-Making:** AI Act (EU), state algorithmic transparency laws
   
   **Risk-Based:**
   - **High-stakes decisions:** Additional scrutiny (hiring, credit, criminal justice)
   - **Vulnerable populations:** Children, elderly, low-income require heightened protection
   - **PII/sensitive data:** GDPR, CCPA, HIPAA, state privacy laws
   
   **Decision type-based:**
   - **Consequential (deny/approve decisions):** Fair lending, employment discrimination, due process rules apply
   - **Ranking/scoring:** Transparency and explainability requirements
   - **Advisory:** Fewer compliance requirements but still governance needed

3. **Map Regulatory Requirements to Specific Controls**
   
   For each applicable regulation, identify specific requirements:
   
   **Example: GDPR Requirements**
   
   | Article | Requirement | Operational Control |
   |---------|-------------|---|
   | Article 5(1)(a) | Lawful processing | Document lawful basis (consent, legitimate interest, contract, etc.); evidence of compliance |
   | Article 5(1)(b) | Specified purpose | Define AI system purpose in documentation; do not use for unrelated purposes |
   | Article 5(1)(c) | Data minimization | Use only features necessary for model purpose; justify each feature |
   | Article 5(1)(f) | Security | Encrypt PII; access controls; breach notification plan |
   | Article 13/14 | Transparency | Privacy notice to users explaining model and data use |
   | Article 22 | Right to explanation | Provide explanation of model decisions when consequential |
   | Article 35 | DPIA | Conduct Data Protection Impact Assessment for high-risk processing |
   | Article 37 | DPO | Appoint Data Protection Officer if processing requires |
   
   **Example: AI Act Requirements (EU) - High-Risk Systems**
   
   | Requirement | Operational Control |
   |---|---|
   | Risk classification | Classify model as prohibited, high-risk, or low-risk; document assessment |
   | Technical documentation | Maintain complete documentation of training, testing, deployment |
   | Conformity assessment | Third-party assessment required for high-risk systems |
   | Quality management | Implement QMS for AI development and monitoring |
   | Bias and fairness monitoring | Establish metrics and monitoring for discrimination |
   | Transparency and user info | Disclose that AI is making decisions; explain how it works |
   | Human oversight | Establish mechanisms for human review of decisions |
   | Record-keeping | Maintain audit logs and decision records for 3 years |
   
   **Example: FCRA Requirements (US Fair Lending)**
   
   | Requirement | Operational Control |
   |---|---|
   | Permissible purpose | Ensure model used only for credit decisions (not other purposes) |
   | Adverse action notice | When credit is denied, provide notice explaining why; right to dispute |
   | Dispute procedures | Establish process for consumers to dispute model decisions and correct data |
   | Accuracy | Validate training data accuracy; monitor model for errors |
   | Non-discrimination | Ensure model does not discriminate based on protected class (race, gender, age, etc.) |
   
   **Example: EEOC Guidance on AI in Hiring (US)**
   
   | Requirement | Operational Control |
   |---|---|
   | Disparate impact analysis | Monitor hiring outcomes by protected class (race, gender, age) |
   | Transparency | Job applicants informed that AI is used in hiring; high-performing candidates subject to human review |
   | Validation | Ensure model predicts job performance; establish baseline (human hiring performance) and compare |
   | Record-keeping | Maintain records of hiring decisions, model inputs, outcomes by protected class for 1+ years |
   | Reasonable accommodation | Process for applicants to request accommodations if AI excludes them |

4. **Assess Compliance Gaps**
   
   For each requirement, evaluate:
   - Is control currently implemented? (Yes/No/Partial)
   - What evidence exists? (Policy, procedure, audit trail, logs)
   - What is the gap? (Missing, undocumented, untested)
   - What is the risk if not addressed? (Regulatory enforcement, litigation, reputational)
   
   **Gap Assessment Template:**
   
   | Regulation | Requirement | Current Status | Evidence | Gap | Risk Level | Remediation |
   |---|---|---|---|---|---|---|
   | GDPR | Lawful basis documented | Partial | Consent form signed; not documented in records | Consent not logged/tracked | Medium | Create consent tracking database |
   | GDPR | DPIA completed | No | N/A | No DPIA started | High | Conduct DPIA by [Date] |
   | AI Act | Risk classification | Yes | Risk assessment completed | N/A | Low | Update quarterly |
   | FCRA | Adverse action notice | Yes | Process documented | Unclear if all denials get notice | Medium | Audit process; test with sample |
   | EEOC | Disparate impact analysis | Partial | Quarterly monitoring report | Limited to hiring outcomes; not updated since Q1 | High | Establish monthly monitoring dashboard |

5. **Design Compliance Roadmap**
   
   Prioritize and sequence remediation:
   
   **Priority 1 (Critical - implement before deployment):**
   - High-risk gaps in critical regulations
   - Gaps affecting consequential decisions (loan, hiring, medical)
   - Gaps in fairness/anti-discrimination controls
   
   **Priority 2 (High - implement within 90 days):**
   - Medium-risk gaps in core regulations
   - Gaps in documentation/transparency
   - Gaps in monitoring procedures
   
   **Priority 3 (Medium - implement within 6 months):**
   - Low-risk gaps
   - Gaps in less-critical regulations
   - Enhancements beyond compliance baseline

6. **Document Regulatory Assessment**
   
   Prepare Regulatory Mapping document including:
   - Applicable regulations identified
   - Regulatory requirements mapped to controls
   - Compliance assessment (current state)
   - Gaps and risk assessment
   - Remediation plan with timeline
   - Sign-off by Legal and Compliance

## Example

**Scenario:** US fintech company deploying AI model to predict loan defaults. Model used for pre-approval screening. Model affects both consumer loan applicants and business loan decisions.

```
# Regulatory Mapping: Loan Default Prediction Model

## 1. System Scope

**Model:** Loan Default Risk Predictor (LDP)  
**Business Purpose:** Pre-approval scoring for consumer auto loans and small business lines of credit  
**Geographic Scope:** All 50 US states + DC; some international customers (secondary market)  
**Affected Parties:** Consumer loan applicants (primary; FCRA protected); business applicants (secondary; less regulated)  
**Decision Type:** Consequential (affects loan approval/denial/interest rate)  
**Data Scope:** Credit bureau data, bank account data, transaction data  

---

## 2. Applicable Regulations - Identified

### Primary (Direct Impact)

**Federal Fair Lending Laws:**
- Fair Credit Reporting Act (FCRA, 15 U.S.C. § 1681)
- Equal Credit Opportunity Act (ECOA, 15 U.S.C. § 1691)
- Fair Housing Act (FHA, 42 U.S.C. § 3601) - if used for mortgage or housing-related credit
- Community Reinvestment Act (CRA) - if depository institution

**Consumer Privacy Laws:**
- Gramm-Leach-Bliley Act (GLBA) - financial privacy rules
- California Consumer Privacy Act (CCPA) - if California customers
- State privacy laws (NY BitLicense, MA requirements, etc.)

**AI/Algorithmic Transparency Laws:**
- NY Local Law 144 (algorithmic accountability; requires notice that AI used in decisions)
- State consumer protection laws (FTC Act enforced by states)
- NIST AI Risk Management Framework (guidance, not binding but increasingly expected)

**Industry Guidance:**
- FDIC/Fed/OCC Fair Lending Guidance (2023)
- EEOC AI Guidance (emerging standards for employment; not directly applicable but principles informative)

### Secondary (Indirect)

**Data Security:**
- State data breach notification laws
- PCI DSS (if credit card data handled)
- FTC Safeguards Rule (for financial institutions)

**International (if applicable):**
- GDPR (if EU customers; less likely for consumer loans but assess)
- UK AI Bill (if UK expansion planned)

---

## 3. Regulatory Requirements Mapped to Controls

### FCRA Compliance (Fair Credit Reporting Act)

| FCRA Requirement | Application to LDP Model | Operational Control Required | Current Status | Gap |
|---|---|---|---|---|
| **Permissible Purpose** | Model must be used ONLY for credit decisions (loan/credit limit/interest rate). Cannot use for marketing, employment, insurance, etc. | Document model's permitted use case; restrict model API access to loan decisions only | Yes — documented in model card | None |
| **Accuracy** | Ensure model training data is accurate; monitor for systematic errors | Validate training data sources; quarterly accuracy audits; retraining pipeline | Partial — accuracy audit not currently scheduled | Medium: Implement quarterly audit schedule |
| **Adverse Action Notice** | When loan is DENIED (or credit terms unfavorable), provide consumer with notice explaining the reason and right to dispute | When model score triggers decline, system must provide adverse action notice (not just model score) | Partial — adverse action sent but insufficient explanation of model factors | Medium: Enhance notice to explain top factors influencing score |
| **Dispute Procedures** | Consumer can dispute accuracy of data/decision; company must reinvestigate | Establish process for loan applicants to dispute model decisions; escalate to human review | No — not currently implemented | High: Critical for compliance; implement dispute intake form and process |
| **Non-Discrimination** | Model cannot discriminate based on protected class (race, color, religion, national origin, sex, marital/family status, age, receipt of public assistance) | Monitor outcomes by protected class; conduct disparate impact analysis; identify proxy variables | Partial — demographic monitoring attempted but incomplete; no disparate impact analysis | High: Implement comprehensive disparate impact testing |
| **Fair Credit Reporting Practices** | Follow FTC guidelines for consumer information use | Privacy notice (privacy policy), consent practices, data security | Yes — privacy policy and consent in place | None |

**FCRA Assessment:** Partial compliance. Critical gaps in dispute procedures and disparate impact analysis.

---

### ECOA Compliance (Equal Credit Opportunity Act)

| ECOA Requirement | Application to LDP Model | Control | Status | Gap |
|---|---|---|---|---|
| **Non-discrimination** | Cannot discriminate based on sex, marital status, age, race, color, religion, national origin, receipt of public assistance, or exercise of consumer rights | Ensure model not trained on protected class features; monitor for proxy discrimination | Partial — no protected class features used explicitly, but proxy risk assessed | Medium: Document proxy variable risk; implement monitoring |
| **Adverse Action Notice** | Similar to FCRA; consumer right to know why credit was denied | See FCRA adverse action notice requirement | Partial | Medium: (same as FCRA) |
| **Appraisal Independence** (if mortgage-related) | Independent appraisals required; model cannot override | Not applicable to auto/business loans | N/A | None |

**ECOA Assessment:** Largely aligned with FCRA compliance. Focus on disparate impact and proxy discrimination.

---

### NY Local Law 144 (Algorithmic Accountability; if customers in NY)

| Requirement | Application to LDP | Control | Status | Gap |
|---|---|---|---|---|
| **Notice** | Notify consumers that automated decision system is used in hiring (not directly applicable to credit but principle is important) | For credit decisions, disclose that AI is used; explain how it works | Partial — privacy policy mentions model but not clear or prominent | Low: Add clear disclosure to loan application and adverse action notice |
| **Annual Bias Audit** | Audit for bias and disparate impact; document findings | Conduct and document annual fairness/bias audit | No — not currently audited | High: Critical for compliance; implement annual audit by [Date] |
| **Data Minimization** | Use only necessary data; justify use of each data source | Document why each data source is used; remove unnecessary features | Partial — features justified but not systematically reviewed | Medium: Conduct feature justification review |

**LL 144 Assessment:** Significant gaps. Not yet compliant; must implement before full deployment.

---

### State Consumer Protection / GLBA (Financial Privacy)

| Requirement | Control | Status | Gap |
|---|---|---|---|
| Privacy notice (what data you collect and how you use it) | Detailed privacy policy; model use disclosed | Yes | None |
| Consent (for some data sharing) | Opt-in consent for sharing with third parties | Yes — privacy policy includes consent mechanism | None |
| Data security (reasonable security measures) | Encryption, access controls, breach notification plan | Partial — encryption in place; access controls limited | Medium: Strengthen access controls |
| Breach notification | Notify affected users if breach occurs | Process documented | None |

---

## 4. Compliance Gaps & Risk Assessment

### High-Risk Gaps (Must remediate before deployment)

**Gap 1: Disparate Impact Analysis**
- **Regulation:** FCRA, ECOA
- **Requirement:** Monitor outcomes for discrimination; ensure model does not have disparate impact
- **Current State:** No systematic monitoring
- **Risk Level:** High — regulatory enforcement risk, litigation risk, reputational risk
- **Remediation:** 
  1. Conduct baseline disparate impact analysis (identify protected classes; compare outcomes)
  2. Establish quarterly monitoring
  3. Design mitigation if disparate impact detected (e.g., fairness constraints, manual review threshold)
  4. **Timeline:** By [Deployment Date - 4 weeks]; ongoing quarterly

**Gap 2: Dispute Procedures**
- **Regulation:** FCRA
- **Requirement:** Provide process for consumers to dispute decisions
- **Current State:** No documented process
- **Risk Level:** High — direct FCRA violation; regulatory enforcement likely
- **Remediation:**
  1. Design dispute intake process
  2. Document reinvestigation procedure
  3. Train staff on dispute handling
  4. Log all disputes and outcomes for audit trail
  5. **Timeline:** By [Deployment Date - 2 weeks]; before going live

**Gap 3: Bias Audit Procedures**
- **Regulation:** NY LL 144, FTC guidance
- **Requirement:** Conduct annual bias audit; document findings
- **Current State:** Audit not scheduled; no procedures defined
- **Risk Level:** Medium (regulatory expectation, not yet legal requirement nationally)
- **Remediation:**
  1. Define audit scope, methodology, protected classes
  2. Schedule annual audit before [Date]
  3. Document findings and remediation actions
  4. **Timeline:** First audit by [Date + 90 days]; then annually

### Medium-Risk Gaps (Remediate within 90 days of deployment)

**Gap 4: Enhanced Adverse Action Notices**
- **Regulation:** FCRA
- **Requirement:** Notice must explain decision; currently sent but lacks detail
- **Risk Level:** Medium — currently compliant but opportunity to enhance
- **Remediation:** Update notice template to include top 3 model factors; example: "Your application was not approved primarily due to: (1) High debt-to-income ratio, (2) Limited credit history, (3) Recent delinquency. You have the right to..."
- **Timeline:** Implement by [Deployment + 30 days]

**Gap 5: Access Control Enhancement**
- **Regulation:** GLBA, GDPR (if EU customers)
- **Requirement:** Restrict data access; log all access
- **Risk Level:** Medium — security and privacy risk
- **Remediation:** Implement field-level access control; log all credit bureau data access
- **Timeline:** Implement by [Deployment + 90 days]

---

## 5. Regulatory Compliance Status Summary

| Regulation | Critical Requirement | Status | Gap Level | Remediation Timeline |
|---|---|---|---|---|
| FCRA | Adverse action notice | Partial | Medium | Deployment + 30 days |
| FCRA | Dispute procedures | No | High | Before deployment |
| FCRA | Accuracy monitoring | Partial | Medium | Q1 Year 2 |
| FCRA | Permissible purpose | Yes | None | — |
| ECOA | Non-discrimination | Partial | High | Before deployment |
| ECOA | Disparate impact analysis | No | High | Before deployment |
| NY LL 144 | Notice of AI use | Partial | Low | Deployment + 30 days |
| NY LL 144 | Annual bias audit | No | Medium | Deployment + 90 days |
| NY LL 144 | Data minimization | Partial | Low | Deployment + 60 days |
| GLBA | Privacy & consent | Yes | None | — |
| GLBA | Data security | Partial | Medium | Deployment + 90 days |

**Overall Compliance Status:** CONDITIONAL APPROVAL

- **Before Deployment:** Remediate dispute procedures (Gap 2) and disparate impact analysis (Gap 1)
- **By Deployment + 30 days:** Remediate adverse action notices (Gap 4) and AI use disclosure (LL 144)
- **By Deployment + 90 days:** Remediate bias audit (Gap 3), data minimization (Gap 5), access controls (Gap 5)

---

## 6. Regulatory Compliance Roadmap

```
BEFORE DEPLOYMENT (Critical)
├─ Disparate impact analysis: complete baseline assessment
├─ Dispute procedures: design and document process
├─ Staff training: ensure staff understand FCRA/ECOA requirements
└─ Legal review: final sign-off on compliance posture

DEPLOYMENT + 30 DAYS (High Priority)
├─ Adverse action notice: implement enhanced template with model factors
├─ AI use disclosure: add clear disclosure to loan app and notices
└─ Monitoring dashboard: implement to track outcomes by protected class

DEPLOYMENT + 90 DAYS (Medium Priority)
├─ Bias audit procedures: define and document annual audit process
├─ Access control: implement field-level restrictions and logging
├─ Data minimization: review features; document justification for each
└─ Incident response: finalize procedures for regulatory inquiries

ONGOING (Continuous)
├─ Quarterly: disparate impact monitoring (protected class outcomes)
├─ Quarterly: adverse action audit (sample 10 denials; verify notice provided)
├─ Annually: bias and fairness audit (full assessment)
├─ Continuously: dispute intake and reinvestigation (log all)
└─ Continuously: incident response (escalate any signs of discrimination)
```

---

## 7. Approvals & Sign-Off

**Regulatory Compliance Assessment completed:** [Date]

- **Legal Counsel:** _____________________ Date: _____ [Confirms regulatory assessment and remediation plan]
- **Compliance Officer:** _____________________ Date: _____ [Confirms compliance roadmap feasible and resourced]
- **Model Owner:** _____________________ Date: _____ [Confirms ability to implement technical controls]
- **Executive Sponsor:** _____________________ Date: _____ [Approves deployment contingent on Gap 1 & 2 remediation]

**Deployment Authorized:** [Date] pending completion of Critical remediation items

**Follow-up Audit Scheduled:** [Date + 120 days]

---

## Regulatory Reference

**Federal:**
- FCRA: 15 U.S.C. § 1681
- ECOA: 15 U.S.C. § 1691
- GLBA: 15 U.S.C. § 6801
- FDIC/Fed/OCC Fair Lending Guidance (2023)

**State:**
- NY LL 144: Local Law 144 (2023)
- CA CCPA: California Consumer Privacy Act (2018)
- MA AI Transparency: "An Act Relative to the Oversight of Artificial Intelligence" (2023)

**International:**
- GDPR: Regulation (EU) 2016/679
- UK AI Bill (pending)

**Guidance:**
- NIST AI Risk Management Framework (2023)
- FTC "Endorsement Guides" for AI recommendations
```

---

## Regulatory Mapping Checklist

Ensure comprehensive assessment:

**Regulatory Identification:**
- [ ] Geographic scope identified (US/EU/other jurisdictions)
- [ ] Industry identified (finance, healthcare, employment, consumer)
- [ ] Decision type identified (consequential, ranking, advisory)
- [ ] All applicable regulations identified (federal, state, industry-specific)
- [ ] Regulatory landscape documented

**Requirements Mapping:**
- [ ] For each regulation, specific requirements identified
- [ ] Requirements mapped to operational controls
- [ ] Control implementation status assessed (yes/no/partial)
- [ ] Evidence of compliance documented

**Gap Assessment:**
- [ ] Current state vs. required state documented
- [ ] Risk level assigned to each gap (critical/high/medium/low)
- [ ] Remediation required or waived
- [ ] Resource requirements estimated

**Compliance Roadmap:**
- [ ] Remediation prioritized (before deployment vs. after)
- [ ] Timeline established with specific dates
- [ ] Owner assigned for each remediation
- [ ] Dependencies identified (order of implementation)

**Documentation & Approval:**
- [ ] Regulatory Mapping document prepared
- [ ] Gap assessment documented
- [ ] Compliance roadmap documented
- [ ] Sign-off from Legal, Compliance, and Executive Sponsor
- [ ] Follow-up audit scheduled
