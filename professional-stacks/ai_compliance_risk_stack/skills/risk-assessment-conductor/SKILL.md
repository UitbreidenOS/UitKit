# Risk Assessment Conductor

## When to activate

When conducting risk assessments for AI systems before production deployment, updating risk registers as systems evolve, analyzing failure modes and their impact, or quantifying residual risk after mitigation.

## When NOT to use

For casual risk discussions or "what-if" scenarios. This skill is for structured, documented risk assessment that produces a risk register and informs deployment decisions.

## Instructions

### Risk Assessment Methodology

1. **Define Scope & Context**
   - What AI system are we assessing? (Model name, use case, deployment environment)
   - Who are the stakeholders? (Users, regulators, business owners, affected populations)
   - What is the impact if the model fails? (Regulatory, financial, reputational, harm to users)
   - What is the risk tolerance? (What residual risk is acceptable?)

2. **Identify Failure Modes**
   Use these categories to generate failure modes:
   
   - **Accuracy Failures:** Model performance degrades below acceptable threshold
   - **Fairness Failures:** Model exhibits demographic disparities or discriminatory outcomes
   - **Security Failures:** Model or data is attacked, poisoned, inverted, or stolen
   - **Privacy Failures:** Training data is extracted or model membership inference succeeds
   - **Regulatory Failures:** Model violates GDPR, AI Act, HIPAA, CCPA, or sector-specific rules
   - **Data Failures:** Training data is inadequate, biased, contains errors, or is outdated
   - **Explainability Failures:** Model decisions cannot be explained or justified
   - **Distribution Shift:** Model performance degrades when applied to out-of-distribution data
   - **Adversarial Failures:** Inputs crafted to fool model or extract information succeed

3. **Assess Probability & Impact**
   
   For each failure mode:
   
   **Probability Assessment** (annual likelihood):
   - Low (< 5%): Extremely unlikely; controls in place to prevent
   - Medium (5-50%): Possible; some controls but gaps exist
   - High (> 50%): Likely; minimal controls or observed in similar systems
   
   **Impact Assessment** (if failure occurs):
   - Low: Minor performance degradation; no regulatory or user impact
   - Medium: Performance or fairness degradation; limited regulatory exposure; some affected users
   - High: Severe performance failure or fairness disparities; regulatory fines or litigation; significant user harm
   - Critical: System-wide failure; major regulatory enforcement; widespread harm; reputational destruction

4. **Quantify Risk**
   
   Risk Score = Probability × Impact
   
   - Low × Low = Low Risk (acceptable)
   - Low × High OR Medium × Low = Medium Risk (mitigate)
   - Medium × High OR High × Medium = High Risk (mitigate before production)
   - High × High = Critical Risk (stop deployment until mitigated)

5. **Identify Current Controls**
   
   For each failure mode, document existing controls:
   - What mitigations are already in place?
   - How effective are they? (estimated % reduction in probability)
   - What is the residual risk after controls?

6. **Design Mitigations**
   
   For each risk with unacceptable residual level:
   - **Prevention:** Stop the failure from occurring (e.g., data validation prevents garbage input)
   - **Detection:** Catch failures quickly (e.g., monitoring dashboard alerts on fairness drift)
   - **Recovery:** Recover gracefully (e.g., rollback procedure, human-in-the-loop override)
   - **Mitigation:** Reduce impact if failure occurs (e.g., SLA caps maximum harm, insurance covers fines)

7. **Document & Approve**
   
   Prepare risk register for sign-off by:
   - Chief Compliance Officer (risk tolerance acceptance)
   - Legal (regulatory exposure assessment)
   - ML Owner (feasibility of mitigations)
   - Executive Sponsor (business risk acceptance)

### Risk Assessment Template

See CLAUDE.md for complete Risk Register Template. Key elements:

```
# Risk Assessment: [Model Name]

## Risk 1: [Name — be specific]

**Category:** [Fairness/Security/Privacy/Regulatory/Data/Explainability/Distribution Shift]
**Baseline Probability:** [Low/Medium/High — without controls]
**Impact if Occurs:** [Low/Medium/High/Critical — specific harm]
**Risk Score:** [Probability × Impact]

**Current Controls:**
- [Control 1: What mitigates this risk?]
- [Control 2: How effective? 70% reduction?]
- [Control 3: What gaps remain?]

**Residual Risk:** [Low/Medium/High — after controls]

**Mitigation Strategy:**
- [Prevention measure: How to stop failure?]
- [Detection measure: How to catch it?]
- [Recovery measure: How to recover?]
- [Impact reduction: How to limit harm?]

**Owner:** [Who is responsible for mitigation?]
**Timeline:** [When will mitigation be implemented?]
**Success Metric:** [How do we know mitigation works?]
```

## Example

**Scenario:** Healthcare company deploying a clinical decision support model to predict patient deterioration in ICU. Model trained on 5 years of historical patient data.

```
# Risk Assessment: ICU Patient Deterioration Predictor

## Risk 1: Accuracy Failure — Model Performance Degrades Below Clinical Threshold

**Category:** Accuracy/Performance
**Baseline Probability:** Medium (30%) — models often degrade on new hospital populations
**Impact if Occurs:** High — missed early deterioration could delay treatment; patient harm
**Risk Score:** Medium (6/10)

**Current Controls:**
- Retrospective validation on held-out test set (95% AUC)
- Offline evaluation against new hospital populations (88% AUC) — 10 percentage point degradation observed
- Monitoring dashboard tracking model AUC daily
- Alert if AUC drops below 85%

**Residual Risk:** Medium — controls catch degradation but lag time of 1-2 weeks before alert

**Mitigation Strategy:**
- Prevention: Continuous retraining on new data weekly (improve model adaptation)
- Detection: Daily AUC monitoring; alert within 4 hours of crossing 85% threshold
- Recovery: Rollback plan: revert to previous model version or suspend predictions; manual assessment by clinicians
- Impact reduction: Model operates in advisory capacity only; final decision made by physician; do not allow autonomous recommendations

**Owner:** ML Team (model performance); Clinical Lead (integration with clinical workflow)
**Timeline:** Implement before production: retraining pipeline (4 weeks), monitoring dashboard (2 weeks), rollback procedure (1 week)
**Success Metric:** AUC maintained ≥ 90% over 90-day pilot; zero missed alerts; clinicians report confidence in alert reliability

---

## Risk 2: Fairness Failure — Model Exhibits Demographic Disparities

**Category:** Fairness/Regulatory/HIPAA Compliance
**Baseline Probability:** High (60%) — healthcare data often reflects systemic disparities
**Impact if Occurs:** High — discriminatory outcomes could trigger HIPAA enforcement, litigation, reputational damage
**Risk Score:** High (8/10)

**Current Controls:**
- Bias audit conducted on training data (identified 7-15% disparities by race/ethnicity)
- Fairness constraints applied in model training (reduce disparities to < 5%)
- Documentation of known disparities in model card
- Manual review required before model is used to make consequential decisions

**Residual Risk:** Medium — fairness constraints reduce disparities but do not eliminate; ongoing monitoring required

**Mitigation Strategy:**
- Prevention: Data rebalancing (stratified sampling); fairness constraints in loss function (equalized odds)
- Detection: Monthly fairness audit across race, ethnicity, gender, age groups; alert if disparity > 10%
- Recovery: Model refinement; additional training data collection for underrepresented groups; model suspension if disparities > 15%
- Impact reduction: Model decision is advisory only; clinician makes final decision; override mechanism always available

**Owner:** Data Science Lead (model fairness); Compliance Officer (regulatory implications)
**Timeline:** Fairness monitoring dashboard by end of Q2; quarterly fairness audits thereafter
**Success Metric:** Demographic parity within 5%; no equity complaints from patients; successful HIPAA audit

---

## Risk 3: Security Failure — Model Inversion / Training Data Extraction

**Category:** Security/Privacy
**Baseline Probability:** Low (10%) — specialist attack; requires adversary with technical skill
**Impact if Occurs:** High — patient health records exposed; HIPAA breach notification required; regulatory fine
**Risk Score:** Medium (3/10)

**Current Controls:**
- Model weights encrypted in storage
- API rate-limiting (100 requests/second per client)
- Differential privacy not currently applied
- Model predictions returned as point estimate only (not confidence intervals, which enable attacks)

**Residual Risk:** Low — rate-limiting and output constraints make extraction expensive, but not impossible

**Mitigation Strategy:**
- Prevention: Differential privacy applied to model training (epsilon = 2.0); membership inference testing conducted
- Detection: Anomaly detection on API query patterns (unusual query sequences, high volume); alert if detected
- Recovery: Immediate suspension of model API access; forensic audit of queries; breach notification if extraction confirmed
- Impact reduction: Insurance coverage for breach; HIPAA breach notification plan prepared

**Owner:** Security team (differential privacy implementation); ML team (membership inference testing)
**Timeline:** Differential privacy implementation by end of Q3; membership inference testing by end of Q2
**Success Metric:** Membership inference success rate < 5% above random baseline; no successful model extraction in penetration tests

---

## Risk 4: Regulatory Failure — Non-Compliance with HIPAA or AI Act

**Category:** Regulatory
**Baseline Probability:** Medium (40%) — regulations are new; compliance infrastructure immature
**Impact if Occurs:** Critical — regulatory enforcement, fines up to 4% revenue (AI Act), HIPAA penalties up to $1.5M per violation
**Risk Score:** High (8/10)

**Current Controls:**
- Model card prepared with model details and performance metrics
- Data governance policy drafted but not implemented
- No formal audit trail of deployment decisions
- Legal review conducted for HIPAA but not AI Act

**Residual Risk:** High — significant compliance gaps in documentation and audit trail

**Mitigation Strategy:**
- Prevention: Complete data governance policy implementation; GDPR DPA with data processors; AI Act compliance assessment
- Detection: Quarterly compliance audit; monitor regulatory changes; establish regulatory intelligence function
- Recovery: Remediation plan if audit findings; regulatory negotiations with legal support
- Impact reduction: Cyber liability insurance; D&O insurance; external counsel on retainer

**Owner:** Compliance Officer (policy/audit); Legal (regulatory strategy)
**Timeline:** Data governance policy implementation by end of Q2; AI Act compliance assessment by end of Q3
**Success Metric:** Successful HIPAA audit; AI Act compliance certification (if applicable); zero enforcement actions

---

## Overall Risk Summary

| Risk ID | Risk Name | Category | Probability | Impact | Initial Score | Mitigations | Residual Risk | Status |
|---------|-----------|----------|-------------|--------|----------------|-------------|---------------|--------|
| R-1 | Accuracy Failure | Performance | Medium | High | 6 | Retraining, monitoring, rollback | Medium | Open — Monitor |
| R-2 | Fairness Disparities | Fairness | High | High | 8 | Fairness constraints, audits, advisory model | Medium | Open — Mitigate |
| R-3 | Model Inversion | Security | Low | High | 3 | Differential privacy, rate-limiting, testing | Low | Open — Mitigate |
| R-4 | Regulatory Non-Compliance | Regulatory | Medium | Critical | 8 | Documentation, audit trail, policy, legal | High | Open — Critical |

**Deployment Recommendation:** CONDITIONAL APPROVAL
- Deploy to limited pilot (single hospital unit) with enhanced monitoring
- Implement Risk 2 (fairness) and Risk 4 (regulatory) mitigations before full deployment
- Establish incident response procedures for all identified risks
- Conduct compliance re-assessment after 90-day pilot

**Sign-Off:**
- Chief Compliance Officer: _____________________ Date: _____ [Risk tolerance acceptance]
- ML Owner: _____________________ Date: _____ [Mitigation feasibility]
- Legal: _____________________ Date: _____ [Regulatory exposure]
- CMO/Executive Sponsor: _____________________ Date: _____ [Clinical and business approval]
```

---

## Risk Categories Reference

| Category | Definition | Key Metrics |
|----------|-----------|-------------|
| **Accuracy/Performance** | Model performance degrades below threshold | AUC, precision, recall, F1, RMSE |
| **Fairness/Bias** | Demographic disparities in outcomes or performance | Demographic parity, equalized odds, fairness gap |
| **Security** | Model or data attacked: poisoning, evasion, inversion, theft | Robustness to adversarial inputs, extraction attack success rate |
| **Privacy** | Training data extracted or model membership inferred | Membership inference success rate, differential privacy epsilon |
| **Regulatory** | Non-compliance with GDPR, AI Act, HIPAA, CCPA, sector rules | Audit findings, enforcement risk |
| **Data** | Training data inadequate, biased, erroneous, or outdated | Data quality metrics, distribution shift, representativeness |
| **Explainability** | Model decisions cannot be explained or justified to users/regulators | Feature importance, decision transparency, user satisfaction |
| **Distribution Shift** | Model performance degrades when applied to new populations | Performance variance across populations, drift detection |
| **Adversarial** | Inputs crafted to fool model or manipulate decisions | Success rate of adversarial attacks, robustness metrics |

---

## Mitigation Effectiveness Estimation

When estimating mitigation impact, consider:

- **Strong mitigations** (70-90% effectiveness): Technical controls with proven track record
  - Example: Input validation prevents 85% of poisoning attacks
  
- **Moderate mitigations** (40-70% effectiveness): Process controls or partially effective technical measures
  - Example: Manual review catches 60% of biased decisions
  
- **Weak mitigations** (10-40% effectiveness): Awareness or advisory measures without enforcement
  - Example: Documentation and training reduce risk by 25%

Combine multiple mitigations to reduce cumulative risk.
