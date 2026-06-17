# Conduct Risk Assessment

## When to activate

When conducting formal risk assessments for AI systems before production; updating risk registers; analyzing failure modes and impact; quantifying residual risk; or preparing for regulatory audit.

## Command Usage

```
/conduct-risk-assessment
```

## Inputs

- **AI System:** Model name, version, business use case
- **Context:** Affected stakeholders, deployment environment, failure impact
- **Current Controls:** What mitigations are already in place?
- **Risk Tolerance:** What residual risk is acceptable?

## Output

A comprehensive risk assessment including:

1. **Failure Mode Identification** — Accuracy, fairness, security, privacy, regulatory, data, explainability, distribution shift, adversarial risks
2. **Probability & Impact Assessment** — Quantified risk scoring (probability × impact)
3. **Current Control Evaluation** — What mitigations exist? How effective?
4. **Residual Risk** — Risk after existing controls
5. **Mitigation Design** — Prevention, detection, recovery, impact reduction strategies
6. **Risk Register** — Documented, prioritized risks with owners and timelines
7. **Deployment Recommendation** — Conditional approval, blockers, remediation requirements

## Output Format

**Risk Assessment Report** (10-15 pages) including:
- Executive summary
- Risk summary table (ID, name, probability, impact, residual risk, owner)
- Detailed risk analysis for each identified risk
- Mitigation strategies and timelines
- Sign-off from Compliance Officer, ML Owner, Legal, Executive Sponsor

## Example Risk Categories

- **Accuracy/Performance:** Model degrades below acceptable threshold
- **Fairness/Bias:** Demographic disparities or discriminatory outcomes
- **Security:** Model attack, data poisoning, model inversion, theft
- **Privacy:** Training data extraction, membership inference
- **Regulatory:** Non-compliance with GDPR, AI Act, HIPAA, CCPA, FCRA, etc.
- **Data:** Training data inadequate, biased, erroneous, outdated
- **Explainability:** Decisions cannot be explained to users/regulators
- **Distribution Shift:** Performance degrades on new populations
- **Adversarial:** Inputs crafted to fool model or extract information

See CLAUDE.md and skills/risk-assessment-conductor/SKILL.md for detailed methodology and examples.
