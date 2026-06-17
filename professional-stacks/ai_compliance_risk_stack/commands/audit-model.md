# Audit Model

## When to activate

When conducting comprehensive model audits before production; during periodic compliance reviews; after regulatory inquiries; when fairness or performance issues suspected; or for formal pre-deployment validation.

## Command Usage

```
/audit-model
```

## Inputs

- **Model Name & Version:** Model identifier and version number
- **Business Purpose:** What does the model do? Who does it affect?
- **Training Data:** Data sources, volume, characteristics
- **Performance Metrics:** Accuracy, precision, recall, F1, AUC, or domain-specific metrics
- **Stakeholder Concerns:** What regulatory or fairness concerns exist?

## Output

A comprehensive model audit report including:

1. **Model Architecture & Training Assessment** — Design evaluation, training approach, reproducibility
2. **Fairness & Bias Analysis** — Performance by demographic group, disparities, root cause analysis, fairness metrics
3. **Explainability Evaluation** — Feature importance, decision transparency, proxy variable risk
4. **Performance Stability Assessment** — Performance across conditions, temporal drift, geographic variation, uncertainty quantification
5. **Governance & Controls Audit** — Access controls, change control, monitoring, incident procedures, documentation
6. **Risk Assessment** — Risks identified, control gaps, mitigations required
7. **Recommendations** — Prioritized remediation with timelines

## Output Format

**Model Audit Report** (15-20 pages) including:
- Executive summary (overall assessment, key findings, recommendations)
- Scope and methodology
- Detailed findings by category (architecture, fairness, explainability, performance, governance)
- Risk assessment
- Recommendations (prioritized)
- Supporting evidence (tables, charts, audit logs)
- Sign-off from Audit Reviewer, Model Owner, Compliance Officer, Executive Sponsor

## Key Audit Elements

**Fairness & Bias Assessment:**
- Identify protected classes (age, gender, race/ethnicity, disability, etc.)
- Measure performance by group (accuracy, recall, precision, F1)
- Identify disparities > 5%
- Analyze root cause (data imbalance, feature bias, model bias)
- Document mitigations

**Explainability Evaluation:**
- Feature importance (SHAP, permutation, coefficients)
- Decision rules or example explanations
- Transparency assessment
- Proxy variable risk (features correlating with protected class)

**Governance Assessment:**
- Access controls and change management
- Monitoring and alerting procedures
- Incident response plans
- Documentation completeness (model card, decision log, audit trail)

See CLAUDE.md and skills/model-auditor/SKILL.md for detailed methodology and examples.
