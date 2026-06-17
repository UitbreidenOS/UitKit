# Track Compliance

## When to activate

When monitoring AI system compliance status against regulations, policies, or internal standards. Use for continuous compliance tracking, periodic audits, and generating compliance reports.

## When NOT to use

When conducting initial risk assessment (use /build-risk-framework). When assessing fairness (use /assess-bias). When auditing governance processes (use /audit-governance).

## Instructions

The track-compliance command monitors and reports compliance status. Use these required parameters:

```
/track-compliance
  --system "System Name"
  --regulations "GDPR|HIPAA|FairLending|StateAI|all"
  --reporting-period "weekly|monthly|quarterly|annual"
```

### Required Workflow

1. **Identify Applicable Regulations** (30 min)
   - Map system to regulatory domains
   - List all applicable regulations by jurisdiction
   - Define compliance requirements for each

2. **Track Compliance Status** (1 hour)
   - Check each regulation's compliance status
   - Document current state vs. requirement
   - Identify gaps and remediation needs

3. **Track Remediation Progress** (1 hour)
   - Review remediation action items
   - Check deadline status
   - Update progress on in-flight remediations
   - Flag items at risk of missing deadline

4. **Monitor Continuous Compliance** (1-2 hours)
   - Verify monitoring metrics are active
   - Check alert rules and escalation triggers
   - Review monitoring logs and alerts
   - Document any compliance drifts

5. **Generate Compliance Report** (1 hour)
   - Summarize compliance status by regulation
   - Track remediation progress
   - Document outstanding gaps
   - Recommend escalations if needed

6. **Update Governance Log** (30 min)
   - Log compliance tracking results
   - Document any escalations
   - Create audit trail entry

### Output Format

The command generates a Compliance Tracking Report with:

```
# Compliance Tracking Report: [System Name]

[Executive Summary: Overall Compliance Status]

[Regulation-by-Regulation Status]
  - [Regulation 1]: Compliant / Non-compliant / Remediation in progress
  - [Regulation 2]: Compliant / Non-compliant / Remediation in progress
  - [etc.]

[Compliance Gaps & Remediation Plan]
  - [Gap 1]: [Requirement], [Current State], [Remediation Action], [Deadline], [Owner], [Status]
  - [Gap 2]: [Requirement], [Current State], [Remediation Action], [Deadline], [Owner], [Status]

[Continuous Monitoring Status]
  - [Metric 1]: [Current Value], [Threshold], [Alert Status]
  - [Metric 2]: [Current Value], [Threshold], [Alert Status]

[Escalations & Actions Required]
  - [If any compliance gaps flagged as high-priority]

[Compliance Certification]
  - [Overall Status: Compliant / Conditional / Non-compliant]
  - [Approval Authority]
  - [Conditions for Continued Operation]
  - [Next Review Date]

[Governance Decision Log Entry]
```

### Compliance Status Definitions

**Compliant:**
- System meets all applicable regulatory requirements
- No gaps or all gaps resolved
- Monitoring is active and within thresholds
- Certification valid until next review

**Conditional/Compliant with Conditions:**
- System meets most requirements
- Outstanding gaps have documented remediation plan
- Deadlines are being met
- Monitoring is active
- Certification valid until remediation deadline

**Non-Compliant:**
- System has critical compliance gaps
- Cannot legally operate in current form
- Requires immediate remediation or de-provisioning
- Must be escalated to legal/executive

**Non-Compliant with Waiver:**
- System has compliance gaps
- Executive waiver approved
- Monitoring is active with strict escalation triggers
- Waiver must be re-approved annually

### Remediation Tracking Template

For each compliance gap:

```
Gap: [Specific requirement not met]
Regulation: [Which law/standard?]
Severity: CRITICAL / HIGH / MEDIUM / LOW
Current Status: [Compliant / Non-compliant / In remediation]

Remediation Action: [What must be done?]
Owner: [Team/person responsible]
Deadline: [Target completion date]
Status: NOT_STARTED / IN_PROGRESS / COMPLETE
Progress: [% complete or status update]
Risk of Missing Deadline: [Yes/No — explain if yes]

Verification Method: [How will compliance be verified?]
Verification Status: [Verified / Pending / Failed]
Verification Date: [When was it verified?]

Dependencies: [What must be done first?]
Blockers: [What's preventing progress?]
```

### Monitoring Metrics Template

For each regulation's continuous monitoring:

```
Regulation: [Which regulation?]
Monitoring Metric: [What are we tracking?]
Current Value: [What is it right now?]
Acceptable Threshold: [What's the limit?]
Alert Status: [OK / WARNING / ALERT]
Monitoring Frequency: [Daily/Weekly/Monthly]
Last Checked: [When?]

Alert History:
- [Alert 1]: [Date], [Trigger], [Action taken], [Resolution]
- [Alert 2]: [Date], [Trigger], [Action taken], [Resolution]

Escalation Path: [Who gets notified if alert?]
Escalation Timeline: [When must someone respond?]
```

### Success Criteria

- [ ] All applicable regulations identified
- [ ] Compliance status clear and documented
- [ ] All remediation actions tracked with deadlines
- [ ] Monitoring metrics defined and active
- [ ] Alert rules configured and tested
- [ ] Compliance reports generated on schedule
- [ ] Governance decision log updated
- [ ] All escalations actioned within SLA
- [ ] No overdue remediation items
