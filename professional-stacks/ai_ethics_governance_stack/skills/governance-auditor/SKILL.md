# Governance Auditor

## When to activate

When auditing AI systems against organizational governance policies, internal standards, or to prepare for external regulatory review. Use before systems deploy to production or when conducting compliance assessments.

## When NOT to use

When assessing raw fairness metrics (use bias-assessor instead). When designing governance frameworks (use ethical-framework-designer). When performing technical code reviews unrelated to governance.

## Instructions

The Governance Auditor systematically evaluates AI systems against governance standards. Follow this structured approach:

### 1. Establish Governance Baseline

Identify applicable policies and standards:

```
Governance Framework:
- Organization AI Ethics Policy (version, last updated)
- Regulatory requirements (GDPR, HIPAA, Fair Lending, local AI laws)
- Industry standards (NIST AI RMF, ISO/IEC 42001)
- Internal policies (approval authority, escalation paths)
- Data governance standards
- Model governance standards

Audit Scope:
- System name and version
- Stakeholders affected
- Decision domain (hiring, credit, moderation, diagnosis, recommendation)
- Data domains (PII, health, biometric, financial, behavioral)
```

### 2. Policy Compliance Checklist

Systematically verify each governance requirement:

```
Template for each policy/standard:

Policy: [Policy name]
Requirement: [Specific requirement]
Current Status: [Compliant / Non-compliant / Partially compliant]

Evidence:
- [Documentation reviewed]
- [Process observed]
- [System configuration verified]

Findings:
- Gap 1: [Specific gap in compliance]
- Gap 2: [Specific gap in compliance]

Remediation:
- Action 1: [What must be done?]
- Action 2: [What must be done?]
Timeline: [By when?]
Owner: [Who is responsible?]

Sign-off:
- Auditor: [Name, date]
- Policy owner: [Name, date]
```

### 3. Governance Decision Authority Verification

Verify approval authority is properly established:

```
Required Governance Decision Points:

1. Risk Assessment Approval
   - Who can approve Green (low risk) systems? [Governance lead]
   - Who can approve Yellow (medium risk) systems? [Director-level]
   - Who can approve Red (high risk) systems? [C-suite + ethics board]
   - Is decision authority documented? [Yes/No]
   - Is approval logged and auditable? [Yes/No]

2. Fairness Audit Approval
   - Who must approve fairness audit results?
   - What fairness metrics are required?
   - What disparity thresholds are acceptable?
   - Who decides on fairness waivers?

3. Compliance Verification
   - Who verifies legal compliance?
   - What compliance standards are mandatory?
   - Who decides on compliance exceptions?
   - How are exceptions escalated?

4. Ethics Board Escalation
   - When does a system get escalated to ethics board?
   - Who chairs the ethics board?
   - What documentation is required for escalation?
   - What is the decision timeline?
```

### 4. Audit Trail & Logging Verification

Ensure governance decisions are auditable:

```python
# Verify these logs exist for every governance decision:
governance_log_required_fields = {
    'timestamp': 'When was the decision made?',
    'decision_type': 'Risk approval / Fairness audit / Compliance check / Escalation',
    'system_name': 'Which system?',
    'decision_outcome': 'Approved / Rejected / Conditional',
    'decision_authority': 'Who made the decision?',
    'evidence_reviewed': '[References to risk assessment, bias audit, compliance checklist]',
    'conditions': 'What conditions must be met?',
    'escalation_triggers': 'What events trigger escalation?',
    'monitoring_requirements': 'What must be monitored?'
}

# Verification:
audit_trail_verification = {
    'logging_enabled': check_if_logs_exist(),
    'logs_immutable': check_if_tamper_proof(),
    'logs_accessible': check_if_auditors_can_access(),
    'logs_retained': check_if_retention_policy_met(),
    'logs_reviewed': check_review_frequency()
}
```

### 5. Stakeholder Accountability Verification

Verify roles and responsibilities are clear:

```
Accountability Map:

Role: Risk Assessment Owner
- Responsible for: Conducting risk assessments before deployment
- Authority: Can approve Green/Yellow systems [if documented]
- Training: [Required training on risk framework]
- Sign-off: [On each risk assessment]

Role: Bias Auditor
- Responsible for: Conducting fairness audits; quantifying disparities
- Authority: Can recommend fairness waivers; escalates if needed
- Training: [Required training on fairness metrics]
- Sign-off: [On each bias audit]

Role: Compliance Officer
- Responsible for: Verifying regulatory compliance
- Authority: Can block deployment if non-compliant
- Training: [Required training on applicable regulations]
- Sign-off: [On compliance verification]

Role: Ethics Board Chair
- Responsible for: Reviewing escalated systems; making Red-level approvals
- Authority: Can veto any deployment
- Training: [Advanced training on ethics and governance]
- Sign-off: [On high-risk system approvals]

Verification:
- Are roles documented? [Yes/No]
- Are responsibilities clear? [Yes/No]
- Is training logged? [Yes/No]
- Are sign-offs auditable? [Yes/No]
```

### 6. Continuous Monitoring Verification

Verify post-deployment monitoring is in place:

```
For each production system:

Monitoring Requirement: [Fairness metric, accuracy metric, or compliance check]
Monitoring Frequency: [Daily/Weekly/Monthly]
Responsible Team: [Data science / Analytics / Compliance]
Alert Threshold: [What triggers an alert?]
Escalation Path: [Who is notified if alert fires?]
Remediation Process: [What happens after escalation?]
Documentation: [Where is monitoring log maintained?]

Verification Questions:
- Is monitoring actually happening? [Check logs]
- Are alerts being generated and reviewed? [Check alert history]
- Are escalations being triggered when thresholds exceeded? [Check incident log]
- Are remediation actions being tracked? [Check resolution time]
- Is monitoring data retained for audit? [Check retention]
```

### 7. Governance Document Review

Verify all required governance documents exist and are current:

```
Required Documents:

Document: Risk Assessment
- Exists? [Yes/No]
- Current? [Yes/No — within [X] months]
- Approved? [Yes/No]
- Monitoring plan attached? [Yes/No]

Document: Bias Audit
- Exists? [Yes/No]
- Current? [Yes/No — within [X] months]
- Fairness metrics quantified? [Yes/No]
- Mitigation plan documented? [Yes/No]

Document: Compliance Checklist
- Exists? [Yes/No]
- All applicable regulations covered? [Yes/No]
- Compliance status clear? [Yes/No]
- Remediation timeline specified? [Yes/No]

Document: Stakeholder Impact Analysis
- Exists? [Yes/No]
- Benefits and harms documented? [Yes/No]
- Affected communities consulted? [Yes/No]

Document: Monitoring Dashboard
- Exists? [Yes/No]
- Metrics defined and tracked? [Yes/No]
- Alert rules configured? [Yes/No]
- Escalation workflow active? [Yes/No]

Document: Governance Decision Log
- Exists? [Yes/No]
- All approvals logged? [Yes/No]
- Conditions tracked? [Yes/No]
- Audit-ready? [Yes/No]
```

## Example

### Audit: Content Moderation System (Production)

**System:** Hate speech detection system deployed to social media platform  
**Audit Date:** 2024-01-15  
**Audit Scope:** Governance compliance, ongoing monitoring verification, audit trail review

#### 1. Policy Compliance Checklist

**Policy: Organization AI Ethics Policy v2.0**

| Requirement | Status | Evidence | Finding | Remediation |
|---|---|---|---|---|
| Risk assessment completed | Compliant | Risk assessment dated 2023-11-20, approved by Risk Officer | Risk assessment is current | None — compliant |
| Fairness audit completed | Compliant | Bias audit dated 2023-12-10 shows 2.1% disparate impact | Disparate impact within 3% threshold | None — compliant |
| Approval authority documented | Compliant | CLAUDE.md specifies Chief Product Officer approves Yellow-level risk | Authority is clear | None — compliant |
| Conditions for deployment documented | Non-compliant | Risk assessment mentions "monitor daily" but specific metrics not listed | Conditions are vague | Define specific fairness metrics and thresholds |
| Continuous monitoring active | Partial | Monitoring dashboard exists but not reviewed daily | Monitoring not actually happening | Establish daily review schedule; assign owner |

**Finding:** Risk assessment exists, but deployment conditions are under-specified. Monitoring dashboard not actively reviewed.

**Remediation:**
- [ ] Update risk assessment with specific monitoring metrics and alert thresholds (Owner: Risk Officer, due 1/30/24)
- [ ] Establish daily monitoring review process (Owner: Analytics lead, due 1/22/24)
- [ ] Verify monitoring alerts are being triggered and acted upon (Owner: Compliance, due 1/29/24)

#### 2. Governance Decision Authority Verification

**Finding:** Authority is documented, but escalation path is unclear.

```
Current Authority Structure:
- Green (Low Risk): Risk Officer approval ✓
- Yellow (Medium Risk): Chief Product Officer approval ✓
- Red (High Risk): CEO + Ethics Board approval ✓

Gap Found: Content moderation system was classified as "Yellow risk" (medium), approved by CPO. But monitoring shows high false negative rate (missing some hateful content). Should this escalate to ethics board?

Escalation Condition Missing: "If false negative rate exceeds 15%, escalate to ethics board for review"
```

**Remediation:**
- [ ] Define escalation trigger: "If false negative rate exceeds 15%, escalate to ethics board within 24 hours"
- [ ] Update governance decision log to reflect this trigger
- [ ] Establish ethics board escalation process with timeline

#### 3. Audit Trail Verification

**Verification Results:**

```
✓ Risk assessment logged: 2023-11-20, approved by Risk Officer
✓ Bias audit logged: 2023-12-10, passed fairness threshold
✓ Deployment approved: 2023-12-22, by Chief Product Officer
✗ Daily monitoring review: Not logged; no evidence of daily checks
✗ Alert incidents: 2 alerts triggered (false negative spike on 2024-01-10), not escalated
✗ Remediation: No action taken after alerts fired

Critical Finding: System is in production, monitoring alerts are firing, but no one is reviewing them. Escalation is not happening.
```

**Remediation:**
- [ ] Implement daily monitoring review log (Owner: Analytics, due 1/20/24)
- [ ] Link monitoring alerts to escalation process (Owner: Compliance, due 1/25/24)
- [ ] Review and document false negative spike from 1/10 (Owner: ML team, due 1/25/24)
- [ ] Retrain model if needed; escalate to ethics board if material fairness/safety issue found

#### 4. Continuous Monitoring Verification

**Current Monitoring Setup:**

| Metric | Frequency | Owner | Alert Threshold | Escalation |
|---|---|---|---|---|
| False negative rate (hateful content missed) | Daily | Analytics | >15% | ??? |
| False positive rate (incorrectly flagged content) | Daily | Analytics | >5% | ??? |
| Demographic bias (disparate impact by user group) | Weekly | Compliance | >3% | ??? |
| Model accuracy on test set | Weekly | ML team | <92% | ??? |
| User appeals volume | Daily | Support | >100/day | ??? |

**Finding:** Monitoring is defined, metrics are tracked, but escalation paths are not clear. When alerts fire, who gets notified? What happens next?

**Remediation:**
- [ ] Document escalation path for each metric (e.g., "If FNR > 15%, alert Compliance Officer within 1 hour")
- [ ] Establish escalation resolution timeline (e.g., "Escalation must be resolved within 48 hours")
- [ ] Log all monitoring alerts and escalations in governance decision log

#### 5. Governance Summary

**Audit Result: PARTIAL COMPLIANCE — YELLOW FLAG**

**Compliant Areas:**
- Risk assessment and fairness audit completed and approved
- Decision authority is documented
- Monitoring metrics are defined

**Non-Compliant Areas:**
- Deployment conditions are under-specified (no specific metrics/thresholds)
- Monitoring is not actively reviewed daily
- Escalation paths are not documented
- Recent monitoring alerts were not escalated or acted upon

**Required Remediation (within 2 weeks):**
1. Clarify deployment conditions with specific metrics and alert thresholds
2. Establish active daily monitoring review process
3. Document and activate escalation path for monitoring alerts
4. Review recent false negative spike and escalate to ethics board if needed

**Governance Risk:** MEDIUM — System is in production but escalation path is broken. Recent monitoring alerts were missed. Recommend halting new deployments in this domain until governance process is fixed.

---

Built with [Claudient](https://github.com/Claudients/Claudient)
