# Build Risk Framework

## When to activate

When proposing a new AI system or preparing an existing system for production deployment. Use before any governance approval, compliance check, or fairness audit. Required for all systems in YELLOW or RED risk categories.

## When NOT to use

When auditing existing systems (use /audit-governance). When assessing fairness of specific models (use /assess-bias). When conducting general code reviews.

## Instructions

The build-risk-framework command conducts comprehensive multi-domain risk assessment. Use these required parameters:

```
/build-risk-framework 
  --system "System Name" 
  --domain "credit|hiring|moderation|diagnosis|recommendation|allocation"
  --decision-scope "users_affected"
  --stakeholders "primary,secondary,tertiary"
```

### Required Workflow

1. **Scope the System** (30 min)
   - What does it do? Who does it affect?
   - Decision domain and geography
   - Scale (transactions/day, users affected)

2. **Assess Fairness Risk** (1-2 hours)
   - Identify protected attributes
   - Analyze historical data for disparities
   - Quantify fairness gaps
   - Document mitigations

3. **Assess Safety Risk** (1-2 hours)
   - Identify potential harms
   - Estimate likelihood and severity
   - Evaluate safeguards
   - Document residual risk

4. **Assess Transparency Risk** (30 min)
   - Evaluate explainability
   - Assess user notification
   - Review appeal mechanisms
   - Identify gaps

5. **Assess Legal/Compliance Risk** (1-2 hours)
   - Map applicable regulations
   - Verify compliance status
   - Identify remediation needs
   - Document timeline

6. **Assess Reputational Risk** (30 min)
   - Evaluate stakeholder concerns
   - Assess media sensitivity
   - Identify communication strategy

7. **Aggregate & Document** (1 hour)
   - Synthesize findings
   - Determine overall risk level
   - Recommend mitigations
   - Create governance decision log entry

### Output Format

The command generates a Risk Assessment document with:

```
# Risk Assessment: [System Name]

[Risk Summary Table]
[Fairness Risk Analysis]
[Safety Risk Analysis]
[Transparency Risk Analysis]
[Legal/Compliance Risk Analysis]
[Reputational Risk Analysis]
[Overall Risk Level: Green/Yellow/Red]
[Approval Authority & Timeline]
[Conditions for Deployment]
[Continuous Monitoring Requirements]
[Governance Decision Log Entry]
```

### Approval Timeline

- **GREEN (Low Risk):** Governance lead approval, <1 week
- **YELLOW (Medium Risk):** Director approval + ethics board review, 2-3 weeks
- **RED (High Risk):** C-suite + ethics board approval, 4+ weeks

### Success Criteria

- [ ] Risk assessment completed for all 5 domains
- [ ] Fairness metrics quantified with supporting data
- [ ] Mitigations documented and achievable
- [ ] Approval authority and timeline clear
- [ ] Monitoring plan defined with specific metrics
- [ ] Governance decision log updated
