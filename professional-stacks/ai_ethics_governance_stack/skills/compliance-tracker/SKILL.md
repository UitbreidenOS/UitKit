# Compliance Tracker

## When to activate

When tracking AI system compliance against regulatory requirements (GDPR, HIPAA, Fair Lending, local AI laws), industry standards (NIST AI RMF, ISO/IEC 42001), or internal policies. Use before deployment and for post-deployment continuous compliance monitoring.

## When NOT to use

When assessing fairness-specific issues (use bias-assessor). When designing compliance frameworks (use ethical-framework-designer). When conducting general code audits.

## Instructions

The Compliance Tracker systematically tracks regulatory and policy compliance. Follow this structured approach:

### 1. Identify Applicable Regulations

Map the system to applicable regulatory domains:

```
Regulatory Mapping:

System: [Name]
Domain: [Credit / Hiring / Healthcare / Content Moderation / Diagnosis / Recommendation]
Geographies: [EU / US / UK / Canada / APAC / etc.]
Data Types: [PII / Health / Biometric / Financial / Behavioral]

Applicable Regulations:

1. GDPR (if EU or EU residents affected)
   - Articles 13-14: Transparency (inform individuals)
   - Article 22: Automated decision-making rights
   - Article 35-36: DPIA (Data Protection Impact Assessment)
   - Article 77+: Individual rights (access, rectification, deletion, portability)

2. HIPAA (if health data in US)
   - Privacy Rule: Health data protection
   - Security Rule: Technical safeguards
   - Breach Notification Rule: Incident reporting

3. Fair Lending Act (if credit/lending decision)
   - Disparate treatment (intentional discrimination)
   - Disparate impact (neutral policy with discriminatory effect)
   - FCRA (Fair Credit Reporting Act): Credit scoring disclosure

4. EEOC Guidelines (if hiring decision)
   - Adverse impact: System cannot have 4/5 rule violation
   - Validation: System must be validated for fair use

5. State AI Laws (varies by state)
   - California AI Transparency Law
   - Colorado AI Bias Law
   - Other emerging state/local regulations

6. Industry Standards
   - NIST AI Risk Management Framework
   - ISO/IEC 42001: AI Management System
   - Partnership on AI guidelines

7. Internal Policies
   - Organization AI Ethics Policy
   - Data Governance Policy
   - Model Governance Policy
   - Approval Authority Matrix
```

### 2. Compliance Status Tracking

For each regulation, document compliance status:

```python
compliance_tracker = {
    'regulation': {
        'name': 'GDPR Article 22 (Automated Decision-Making)',
        'jurisdiction': 'EU',
        'requirement': 'Individuals have right to human review of significant automated decisions',
        'system_applicability': 'YES - System makes credit approval recommendations',
        'current_status': 'NON-COMPLIANT',
        'gap_analysis': [
            {
                'gap': 'No human review layer for automated decisions',
                'severity': 'CRITICAL',
                'evidence': 'System automatically approves <€1000 loans; no human involved'
            },
            {
                'gap': 'Individuals not informed of automated decision',
                'severity': 'CRITICAL',
                'evidence': 'Approval notification does not mention automated system'
            },
            {
                'gap': 'No appeal process',
                'severity': 'CRITICAL',
                'evidence': 'Approved applicants cannot request human review'
            }
        ],
        'remediation': [
            {
                'action': 'Implement human review layer for all decisions >€5000',
                'owner': 'Credit Operations',
                'deadline': '2024-02-15',
                'status': 'IN_PROGRESS'
            },
            {
                'action': 'Add disclosure to approval notification',
                'owner': 'Compliance',
                'deadline': '2024-01-31',
                'status': 'NOT_STARTED'
            },
            {
                'action': 'Build appeal request system',
                'owner': 'Engineering',
                'deadline': '2024-03-15',
                'status': 'NOT_STARTED'
            }
        ],
        'verification_method': 'System audit + user flow testing',
        'verified_compliant': False,
        'approved_by': None,
        'sign_off_date': None
    }
}
```

### 3. Gap Analysis Template

For each non-compliant regulation, document the gap:

```
Gap: [Specific requirement not met]

Requirement:
- Regulation: [Which law/standard?]
- Article/Section: [Specific reference]
- Requirement Text: [Exact wording]

Current State:
- What the system currently does
- Evidence (logs, code, configuration)
- Why it doesn't meet requirement

Impact if Unresolved:
- Legal risk: [Liability type, potential fines]
- Regulatory risk: [Enforcement likelihood, penalties]
- Reputational risk: [Stakeholder trust impact]
- Operational risk: [Service disruption, data loss]

Severity:
- CRITICAL: Legal liability, regulatory enforcement likely
- HIGH: Legal exposure, significant operational impact
- MEDIUM: Policy non-compliance, manageable remediation
- LOW: Best practice gap, minor remediation effort

Remediation:
- Action required: [Specific change needed]
- Owner: [Team/person responsible]
- Deadline: [Target completion date]
- Dependencies: [What must be done first?]
- Verification: [How will compliance be verified?]
```

### 4. Continuous Compliance Monitoring

Define monitoring for ongoing compliance:

```
For each regulation, define monitoring:

GDPR Article 22 (Right to Explanation):
- Monitoring Metric: % of decisions with documented explanation
- Monitoring Frequency: Daily
- Alert Threshold: <95% documented decisions
- Owner: Compliance Team
- Action if Alert: Review non-documented decisions; escalate if pattern

HIPAA Privacy Rule:
- Monitoring Metric: % of health data access authorized under HIPAA
- Monitoring Frequency: Daily
- Alert Threshold: Any unauthorized access
- Owner: Privacy Officer
- Action if Alert: Immediate incident report; investigation

Fair Lending Act - Disparate Impact:
- Monitoring Metric: Adverse Impact Ratio by protected group
- Monitoring Frequency: Daily
- Alert Threshold: <0.80 for any group
- Owner: Compliance + Analytics
- Action if Alert: Emergency governance review; potential model adjustment

Internal Policy - Model Approval:
- Monitoring Metric: % of production models with current approval
- Monitoring Frequency: Weekly
- Alert Threshold: <100% models approved
- Owner: Model Registry Owner
- Action if Alert: Review non-approved models; halt deployment until approved
```

### 5. Audit Trail & Evidence Maintenance

Document all compliance decisions and evidence:

```
Compliance Decision Log Entry:

Date: [YYYY-MM-DD]
Regulation: [Which regulation?]
System: [Which system?]
Decision: [Compliant / Non-compliant / Compliant with conditions]
Approver: [Name, title]
Evidence Reviewed:
  - [Document 1 reference]
  - [Document 2 reference]
  - [Code or configuration reference]
Reasoning: [Why is system compliant/non-compliant?]
Conditions: [If compliant with conditions, what must remain true?]
Next Review: [When will compliance be re-verified?]
Audit Trail: [Link to compliance monitoring data]

Example:
Date: 2024-01-20
Regulation: GDPR Article 22
System: Credit Approval AI
Decision: Non-compliant
Approver: Chief Privacy Officer
Evidence:
  - System audit (2024-01-15): No human review layer
  - User testing: No disclosure of automated decision
  - Code review: No appeal process implemented
Reasoning: System makes fully automated decisions without human review or user notification
Conditions: N/A — must remediate
Next Review: 2024-02-15 (after human review layer deployed)
```

### 6. Compliance Remediation Tracking

Track remediation actions through completion:

```
Remediation Tracking:

Action: Implement human review layer for credit decisions >€5000
Regulation: GDPR Article 22
Severity: CRITICAL
Owner: Credit Operations
Deadline: 2024-02-15
Status: IN_PROGRESS

Sub-tasks:
[ ] Define review criteria and decision authority (Owner: Compliance, Due: 2024-01-31)
[ ] Build review workflow (Owner: Engineering, Due: 2024-02-10)
[ ] Train reviewers (Owner: Operations, Due: 2024-02-12)
[ ] Deploy to production (Owner: Engineering, Due: 2024-02-15)
[ ] Verify compliance (Owner: Compliance, Due: 2024-02-20)
[ ] Update audit trail (Owner: Compliance, Due: 2024-02-20)

Verification Method:
- Manual review: Audit sample of 100 decisions >€5000; verify human review occurred
- Automated check: Dashboard shows review rate, reviewer comments
- User testing: Applicants confirm they received review option
- Regulatory feedback: External legal review to confirm GDPR compliance

Tracking:
- Status updated weekly in governance meeting
- Escalation if deadline at risk (Owner: Director)
- Post-deployment: Monitoring continues indefinitely
```

### 7. Compliance Certification & Sign-Off

Document formal compliance approval:

```
Compliance Certification:

System: [System name]
Version: [Model/system version]
Compliance Assessed: [Date]
Compliant With:
  - [ ] GDPR (Article references)
  - [ ] HIPAA (if applicable)
  - [ ] Fair Lending Act (if applicable)
  - [ ] EEOC Guidelines (if applicable)
  - [ ] State AI Laws (if applicable)
  - [ ] Internal Policies
  - [ ] Industry Standards

Non-Compliant With:
  - [ ] Regulation X (Gap list, remediation plan, deadline)
  - [ ] Regulation Y (Gap list, remediation plan, deadline)

Compliant With Conditions:
  - [ ] Condition 1: [Must continuously monitor X metric]
  - [ ] Condition 2: [Must escalate if Y occurs]
  - [ ] Condition 3: [Must remediate Z by date]

Compliance Officer: [Name, signature]
Date: [Date]
Valid Until: [Next review date]

This certification confirms the above system meets the stated compliance requirements as of the certification date. Conditions are enforceable; non-compliance must be remediated by deadline or system must be de-provisioned.
```

## Example

### Compliance Audit: Patient Recommendation Engine (Healthcare)

**System:** AI system recommending treatment options to doctors  
**Date:** 2024-01-18  
**Jurisdictions:** US, EU (EHR used across both regions)  

#### Applicable Regulations

| Regulation | Applicability | Status |
|---|---|---|
| HIPAA Privacy Rule | YES - Health data | Non-compliant |
| HIPAA Security Rule | YES - Digital safeguards | Compliant with conditions |
| GDPR Article 22 | YES - Automated healthcare decision | Non-compliant |
| FDA Guidance (if medical device) | MAYBE - Classification pending | Under review |
| State Laws (varies) | YES - Varies by state | Partial |

#### Gap Analysis Example

**Gap 1: HIPAA Privacy — Authorization**

Requirement: All uses of patient health data must be authorized (patient consent or treatment necessity)

Current State:
- System trains on historical EHR data
- No explicit patient authorization for "ML model training"
- Training data includes patients who did not consent to research

Finding: NON-COMPLIANT

Severity: CRITICAL (HIPAA enforcement priority; potential fines up to $1.5M)

Remediation:
- [ ] Implement data minimization: Use only authorized treatment data (Owner: Privacy Officer, Due: 2/15/24)
- [ ] Remove any research-only data (Owner: Data team, Due: 2/15/24)
- [ ] Add consent check: System alerts if patient data used without proper authorization (Owner: Engineering, Due: 3/1/24)
- [ ] Verify compliant training dataset (Owner: Privacy + Data, Due: 3/5/24)

---

**Gap 2: GDPR Article 22 — Right to Explanation**

Requirement: Individuals have right to human review and explanation of significant automated decisions

Current State:
- System recommends treatment options to doctors
- No explicit explanation of recommendation reasoning
- Doctor makes final decision (human review exists, but explanation lacking)

Finding: PARTIALLY COMPLIANT

Doctor Uses: Human makes final decision (Art. 22 exemption applies)
But: Recommendation lacks transparency (Art. 13/14 transparency requirement)

Severity: HIGH (GDPR enforcement trend; DPA focus on explainability)

Remediation:
- [ ] Add explainability dashboard: Show which factors contributed to recommendation (Owner: ML team, Due: 2/20/24)
- [ ] Add transparency statement: Inform patients that AI contributed to recommendation (Owner: Compliance, Due: 2/1/24)
- [ ] Build appeal process: Patients can request different treatment consideration (Owner: Operations, Due: 3/1/24)
- [ ] Verify with DPA: Get guidance from local Data Protection Authority (Owner: Legal, Due: 3/15/24)

---

**Gap 3: System Transparency & Interpretability**

Requirement: AI system must be interpretable; doctors must understand reasoning

Current State:
- System uses deep neural network (black-box)
- No feature importance or reasoning provided
- Doctors report low confidence in recommendations

Finding: QUALITY ISSUE + COMPLIANCE RISK

Severity: MEDIUM (Not strictly required, but best practice; needed for adoption)

Remediation:
- [ ] Switch to interpretable model or add explanation layer (Owner: ML team, Due: 3/30/24)
- [ ] Test with physicians: Verify explanations are understandable (Owner: Clinical team, Due: 4/15/24)

#### Remediation Timeline

| Gap | Deadline | Status | Owner |
|---|---|---|---|
| HIPAA data minimization | 2/15/24 | IN_PROGRESS | Privacy |
| GDPR explainability | 2/20/24 | NOT_STARTED | ML team |
| System interpretability | 3/30/24 | PLANNED | ML team |

#### Compliance Certification (Proposed)

**Current:** NON-COMPLIANT — Cannot deploy until remediation complete

**Post-Remediation (target 3/30/24):** COMPLIANT WITH CONDITIONS

Conditions for Ongoing Compliance:
- [ ] Monitor HIPAA authorization: 100% of training data from authorized sources (daily check)
- [ ] Monitor explainability: 100% of recommendations have documented explanation (daily)
- [ ] Monitor doctor acceptance: Feedback surveys show >80% confidence in recommendations (weekly)
- [ ] Annual HIPAA audit + GDPR compliance review

---

Built with [Claudient](https://github.com/Claudients/Claudient)
