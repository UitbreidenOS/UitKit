# Audit Governance

## When to activate

When auditing an AI system against organizational governance policies, regulatory requirements, or to verify compliance status before production deployment or periodic review. Use for regular governance compliance audits.

## When NOT to use

When conducting fairness-specific audits (use /assess-bias). When designing governance frameworks (use /design-ethical-framework). When performing technical code reviews.

## Instructions

The audit-governance command systematically verifies system compliance. Use these required parameters:

```
/audit-governance
  --system "System Name"
  --version "version_number"
  --audit-scope "policies|regulations|all"
  --audit-type "pre-deployment|post-deployment|periodic"
```

### Required Workflow

1. **Establish Governance Baseline** (30 min)
   - Identify applicable policies and standards
   - Define audit scope
   - Gather documentation

2. **Verify Risk Assessment** (30 min)
   - Confirm risk assessment exists and is current
   - Review risk level classification
   - Verify appropriate approval authority was used

3. **Verify Fairness Audit** (1 hour)
   - Confirm bias audit was conducted
   - Review fairness metrics and thresholds
   - Verify disparities are documented

4. **Verify Compliance Status** (1-2 hours)
   - Check each applicable regulation
   - Document compliance gaps
   - Identify remediation requirements and timeline

5. **Verify Decision Authority** (30 min)
   - Confirm approval is from authorized person
   - Verify approvals are logged and auditable
   - Check conditions for deployment

6. **Verify Monitoring & Escalation** (30 min)
   - Confirm post-deployment monitoring is active
   - Verify alert rules are in place
   - Check escalation path is documented

7. **Generate Audit Report** (1 hour)
   - Synthesize findings
   - Document compliance status
   - Recommend remediation (if needed)
   - Create governance decision log entry

### Output Format

The command generates an Audit Report with:

```
# Governance Audit: [System Name]

[Governance Baseline]
[Compliance Status Table]
[Risk Assessment Verification]
[Fairness Audit Verification]
[Regulatory Compliance Review]
[Decision Authority Verification]
[Monitoring & Escalation Verification]
[Overall Compliance Status: Compliant/Non-compliant/Conditional]
[Remediation Plan (if needed)]
[Governance Decision Log Entry]
```

### Audit Checklist

- [ ] Risk assessment exists and is current (within 90 days)
- [ ] Risk level classification is appropriate
- [ ] Fairness audit completed (if YELLOW+)
- [ ] Fairness metrics <3-5% disparity threshold (if decision system)
- [ ] Compliance review conducted for all applicable regulations
- [ ] Approval authority documented and legitimate
- [ ] Conditions for deployment defined and tracked
- [ ] Monitoring plan documented with specific metrics
- [ ] Alert rules configured for escalation triggers
- [ ] Governance decision log complete and auditable

### Compliance Status Outcomes

- **Compliant:** System meets all governance requirements
- **Conditional:** System meets requirements with documented conditions
- **Non-compliant:** System has governance gaps; remediation required before deployment
- **Non-compliant with Waiver:** System has gaps; executive waiver approved with monitoring

### Success Criteria

- [ ] Audit completed for all governance domains
- [ ] Compliance status clear and documented
- [ ] Any gaps have remediation plan with timeline and owner
- [ ] Monitoring is active (if production system)
- [ ] Governance decision log updated
- [ ] Escalation path is functional
