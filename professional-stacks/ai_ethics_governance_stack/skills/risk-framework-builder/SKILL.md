# Risk Framework Builder

## When to activate

When assessing risk for any AI system before deployment, including fairness risk, safety risk, transparency risk, legal/compliance risk, and reputational risk. Triggered when designing new systems or preparing for production deployment.

## When NOT to use

When conducting general code reviews or performance optimization. When risk assessment has already been completed and approved. When evaluating non-AI systems or systems with minimal human impact.

## Instructions

The Risk Framework Builder conducts comprehensive, multi-domain risk assessment of AI systems. Follow this structured approach:

### 1. System Scoping

First, understand what the system does and who it affects:

```
System Name: [Name]
Purpose: [What does it do?]
Decision Domain: [Credit scoring / Hiring / Moderation / Diagnosis / Recommendation / Allocation]
Stakeholders Affected: [Who is affected by this system's decisions?]
Scale: [How many people per day/month? What's the financial impact?]
Deployment Timeline: [When does it need to go live?]
```

### 2. Fairness Risk Assessment

Evaluate demographic fairness across protected attributes:

```python
# Pseudocode for fairness assessment
protected_attributes = ['race', 'gender', 'age', 'disability']
fairness_metrics = {
    'demographic_parity': calculate_selection_rate_gap(protected_attributes),
    'equalized_odds_tpr': calculate_tpr_gap(protected_attributes),
    'equalized_odds_fpr': calculate_fpr_gap(protected_attributes),
    'calibration': calculate_precision_gap(protected_attributes),
    'disparate_impact': calculate_adverse_impact_ratio(protected_attributes)
}

# Risk level: Low (<2% disparity), Medium (2-5%), High (>5%)
fairness_risk = risk_level(fairness_metrics)
```

**Key Questions:**
- What demographic groups does this system decide about?
- Are there documented disparities in historical data?
- Does the system use proxies for protected attributes?
- What's the documented fairness gap vs. accepted threshold?

### 3. Safety Risk Assessment

Evaluate potential harms from incorrect decisions:

```
Harm Types:
- Financial loss (customer, organization)
- Privacy breach
- Safety/physical harm
- Discrimination or denial of opportunity
- Misinformation or manipulation
- Service disruption

For each harm type:
- Likelihood: Low/Medium/High
- Severity if realized: [Quantified impact]
- Current safeguards: [What prevents this?]
- Residual risk after mitigation: [Acceptable?]
```

### 4. Transparency Risk Assessment

Evaluate whether decisions are explainable and justifiable:

```
Questions:
- Can a human explain why this decision was made?
- Can the decision be traced to specific input features?
- Are there interpretability tools or dashboards?
- Do affected users know they're subject to automated decision?
- Can users appeal or request human review?
- Is there a documented decision logic that users can understand?
```

**Transparency Levels:**
- **High:** Decisions fully explainable; users notified; appeals process exists
- **Medium:** Decisions mostly explainable; users may not be notified
- **Low:** Decisions are black-box; users unaware; no appeals

### 5. Legal & Compliance Risk Assessment

Evaluate regulatory alignment:

```
Applicable Regulations:
- GDPR: Right to explanation, data protection, consent
- HIPAA: Privacy, audit trails, patient rights (if healthcare)
- Fair Lending: Disparate impact analysis, adverse action notice
- Local AI laws: Country/state-specific AI governance rules
- Industry standards: Finance, healthcare, government requirements

For each regulation:
- Current compliance status: Compliant/Non-compliant/Requires changes
- Required changes: [What needs to be done?]
- Timeline to compliance: [By when?]
- Approval authority: [Who approves this system if non-compliant?]
```

### 6. Reputational Risk Assessment

Evaluate stakeholder and public perception risks:

```
Questions:
- Would a news headline about this system harm the organization?
- Do any communities perceive this system as unfair?
- Are there documented complaints or concerns?
- Would regulators or NGOs scrutinize this system?
- Is transparency feasible given stakeholder expectations?

Reputational Risk Factors:
- High-profile stakeholders affected
- Demographic sensitivity (protected groups)
- Public visibility or media likelihood
- Existing controversy around the domain
```

### 7. Risk Aggregation & Mitigation Strategy

Document overall risk and mitigation approach:

```
Risk Ratings (before mitigation):
- Fairness: Low/Medium/High
- Safety: Low/Medium/High
- Transparency: Low/Medium/High
- Legal: Low/Medium/High
- Reputational: Low/Medium/High
- OVERALL: Green/Yellow/Red

Mitigation Strategies:
1. [Mitigation 1] — How does it reduce [specific risk]?
2. [Mitigation 2] — How does it reduce [specific risk]?
3. [Mitigation 3] — How does it reduce [specific risk]?

Risk After Mitigation:
- Fairness: [Low/Medium/High]
- Safety: [Low/Medium/High]
- Transparency: [Low/Medium/High]
- Legal: [Low/Medium/High]
- Reputational: [Low/Medium/High]
- OVERALL: Green/Yellow/Red

Approval Authority:
- Green (Low Risk): Governance lead
- Yellow (Medium Risk): Director-level approval; ethics board review recommended
- Red (High Risk): C-suite and ethics board approval required

Conditions for Deployment:
- Must have [specific condition]
- Must monitor [specific metric] daily
- If [specific condition] occurs, must escalate to [approver]
```

### 8. Continuous Monitoring Plan

Define what gets monitored post-deployment:

```
Post-Deployment Monitoring:
- Metric 1: [Fairness metric] — Daily, alert if [threshold exceeded]
- Metric 2: [Accuracy metric] — Weekly, alert if [threshold exceeded]
- Metric 3: [User appeals rate] — Weekly, alert if [threshold exceeded]

Escalation Triggers:
- If [metric] exceeds [threshold], escalate to [authority]
- If [incident type] occurs, alert [stakeholder] within [timeframe]
- If [condition], trigger emergency governance review

Monitoring Review Cadence:
- Daily automated checks and alerts
- Weekly manual review of dashboards
- Monthly governance compliance review
- Quarterly ethics board review
```

## Example

### System: Credit Approval Recommendation Engine

**System Purpose:** Recommends credit approval decisions for loan applications; final approval by human loan officer.  
**Decision Domain:** Credit scoring / Financial services  
**Stakeholders:** Loan applicants, lending institution, regulators (Fair Lending Act compliance)

#### 1. Fairness Risk Assessment

Historical data analysis shows:
- White applicants approval rate: 65%
- Black applicants approval rate: 52%
- Disparate impact ratio: 0.80 (Fair Lending threshold is 0.80)

**Fairness Risk:** HIGH — System is at the edge of regulatory disparate impact threshold.

**Mitigation:**
- Retrain model with fairness constraints (demographic parity target: <3% disparity)
- Add human review layer for borderline decisions in protected groups
- Document reason codes for all denial decisions
- Implement quarterly fairness audits

#### 2. Safety Risk Assessment

**Harm:** Financial loss to applicants denied creditworthiness unjustly.
- Likelihood: Medium (if model is biased, ~5-10% of applicants could be incorrectly denied)
- Severity: High (average ~$50K in lost credit access per affected applicant)
- Mitigation: Human review, appeal process, fairness audit

**Harm:** Discrimination lawsuit against lending institution.
- Likelihood: High (if system demonstrates disparate impact)
- Severity: Very High (potential $10M+ liability, reputational damage)
- Mitigation: Fairness audit, compliance documentation, legal review

**Safety Risk:** MEDIUM to HIGH

#### 3. Transparency Risk Assessment

Current state:
- Model is logistic regression (interpretable) ✓
- Feature importance is documented ✓
- Applicants are not notified about automated decision ✗
- No explicit appeal process for recommendations ✗
- Decision logic not explained to applicants ✗

**Transparency Risk:** MEDIUM

**Mitigation:**
- Implement applicant notification: "Your application was reviewed by an automated system. You have the right to human review."
- Create reason codes: "Insufficient credit history," "Debt-to-income ratio too high," etc.
- Establish appeal process: applicants can request human review within 30 days
- Publish model card documenting decision logic

#### 4. Legal & Compliance Risk Assessment

**Regulations:**
- **Fair Lending Act (FCRA):** System must not show disparate impact. Must provide adverse action notice.
  - Current compliance: Non-compliant (disparate impact ratio 0.80)
  - Required: Retrain model; implement reason codes; deploy by [date]

- **ECOA (Equal Credit Opportunity Act):** Applicants have right to explanation and appeal.
  - Current compliance: Partial (system is interpretable, but no user-facing explanation)
  - Required: Applicant notification; appeal process; by [date]

- **GDPR (if EU applicants):** Right to explanation of automated decisions; consent required.
  - Current compliance: Non-compliant (no consent mechanism; no explanation)
  - Required: Implement consent flow; explainability dashboard; by [date]

**Legal Risk:** HIGH — Current system has documented Fair Lending Act compliance gaps.

**Mitigation:** Retrain model with fairness constraints; implement applicant notification and appeal process; obtain legal sign-off.

#### 5. Reputational Risk Assessment

- Domain: Credit lending (sensitive for discrimination concerns)
- Potential news angle: "Bank Uses AI to Deny Credit to Minorities" (if disparities exposed)
- Media likelihood: High (Fair Lending is a hot topic)
- Stakeholder sensitivity: Very High (borrowers, civil rights groups, regulators all care)

**Reputational Risk:** HIGH

**Mitigation:** Transparent fairness audit; public commitment to fair lending; media-ready explanation of safeguards.

#### 6. Risk Aggregation

**Before Mitigation:**
- Fairness: HIGH
- Safety: MEDIUM-HIGH
- Transparency: MEDIUM
- Legal: HIGH
- Reputational: HIGH
- **OVERALL: RED** — Requires C-suite and ethics board approval

**Mitigations:**
1. Retrain model with demographic parity constraint (<3% max disparity)
2. Implement human review layer for all borderline decisions
3. Deploy applicant notification system
4. Create reason codes and appeal process
5. Conduct Fair Lending Act audit with legal firm
6. Establish quarterly fairness monitoring and public reporting

**After Mitigation:**
- Fairness: LOW (model retraining shows <2% disparity)
- Safety: LOW-MEDIUM (human review layer reduces unjust denials)
- Transparency: HIGH (applicants notified, reason codes, appeal process)
- Legal: COMPLIANT (Fair Lending Act audit passed)
- Reputational: MEDIUM (transparent, but still sensitive domain)
- **OVERALL: YELLOW** — Requires director-level approval; ethics board review

**Approval Authority:** Chief Credit Officer (director-level), with ethics board recommendation.

**Conditions for Deployment:**
- Must have fairness audit showing <3% disparate impact
- Must have human review layer active (no fully automated denials)
- Must have applicant notification system deployed
- Must have appeal process documented and live
- Must monitor fairness metrics daily; alert if disparity exceeds 3%
- Must conduct Fair Lending Act audit quarterly
- If monthly disparate impact ratio exceeds 0.85, escalate to Chief Credit Officer

**Continuous Monitoring:**
- Daily: Disparate impact ratio by demographic group (alert if >3% disparity)
- Weekly: False positive rate by group; appeal rate; human reviewer decision override rate
- Monthly: Full fairness audit across all fairness metrics
- Quarterly: Legal compliance review; Fair Lending Act audit
- Annually: Retrain model if disparity increases

---

Built with [Claudient](https://github.com/Claudients/Claudient)
