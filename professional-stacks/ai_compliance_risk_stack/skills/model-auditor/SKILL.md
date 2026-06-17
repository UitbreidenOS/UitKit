# Model Auditor

## When to activate

When conducting comprehensive audits of AI models before production deployment, during periodic compliance reviews, after regulatory inquiries, or when fairness or performance issues are suspected. Use this skill to assess bias, fairness, explainability, and performance across demographic groups.

## When NOT to use

For quick diagnostic checks or routine monitoring. This skill is for formal audits that produce documented evidence for regulatory inspection. Use monitoring dashboards for continuous day-to-day tracking.

## Instructions

### Model Audit Framework

1. **Define Audit Scope**
   - Model name and version
   - Business purpose and use case
   - Stakeholders affected
   - Previous audit findings (if any)
   - Regulatory drivers (what triggered this audit?)

2. **Evaluate Model Architecture & Training**
   
   **Questions to answer:**
   - What type of model? (Linear, tree-based, neural network, large language model)
   - What is the training approach? (Supervised learning, transfer learning, fine-tuning, reinforcement learning)
   - What features are used? Are they interpretable?
   - What was the training data source? (Size, demographics, completeness, bias)
   - How is the model maintained? (Retraining frequency, version control)
   
   **Audit checklist:**
   - [ ] Model architecture documented
   - [ ] Training data lineage clear
   - [ ] Training hyperparameters logged and reproducible
   - [ ] Feature engineering approach documented
   - [ ] Version control in place

3. **Assess Fairness & Bias**
   
   **Step 1: Identify Protected Classes**
   Define demographic groups to audit:
   - Age groups (e.g., < 30, 30-50, > 50)
   - Gender (M/F/non-binary if data available)
   - Race/ethnicity (if US model); nationality (if international)
   - Other protected classes relevant to context (disability, veteran status, etc.)
   
   **Step 2: Measure Performance Disparities**
   For each demographic group, calculate:
   - Accuracy (% correct predictions)
   - Precision (% of positive predictions that were correct)
   - Recall (% of actual positives that were found)
   - F1 score (harmonic mean of precision and recall)
   - Any domain-specific metrics
   
   Example output:
   ```
   | Group | Size | Accuracy | Recall | Precision | F1 | Gap vs. Overall |
   |-------|------|----------|--------|-----------|-----|---|
   | Overall | 5000 | 94% | 88% | 92% | 0.90 | — |
   | Male | 2600 | 95% | 91% | 93% | 0.92 | +2% (acc) |
   | Female | 2400 | 93% | 85% | 91% | 0.88 | -2% (acc) |
   | Gap | — | 2% | 6% | 2% | 0.04 | — |
   ```
   
   **Step 3: Analyze Disparities**
   - Calculate fairness metrics: demographic parity, equalized odds, calibration
   - Compare groups; identify disparities > 5%
   - Quantify: "Female applicants have 6% lower recall than males" (actionable, specific)
   - Document: Is disparity due to data imbalance, feature bias, or model behavior?
   
   **Step 4: Root Cause Analysis**
   For each disparity, investigate:
   - Data issue: Is training data imbalanced? Underrepresented? Biased?
   - Feature issue: Do features correlate with protected class? Are they proxy variables?
   - Model issue: Does model architecture amplify bias? (e.g., certain activation functions)
   - Threshold issue: If using probability threshold, does threshold differ optimal for each group?

4. **Evaluate Explainability**
   
   **Interpretability Measures:**
   - **Feature Importance:** Which features drive predictions? (SHAP, permutation importance, coefficients)
   - **Decision Rules:** Can you articulate the decision logic? (for rule-based or tree models)
   - **Example Explanations:** For a few instances, why did the model predict that outcome?
   - **Transparency:** Can a regulator / end user understand the decision?
   
   **Audit steps:**
   - [ ] Feature importance computed and documented
   - [ ] Feature importances make business sense (correlated with domain knowledge)
   - [ ] Decision rules documented or example explanations prepared
   - [ ] Unexplained predictions identified and investigated
   - [ ] User-facing transparency disclosures drafted
   
   **Example audit output:**
   ```
   # Explainability Audit: Credit Risk Model
   
   ## Feature Importance (SHAP)
   | Feature | SHAP Impact | Interpretation |
   |---------|------------|---|
   | Debt-to-Income Ratio | 0.32 | Strongest predictor; aligns with lending theory |
   | Credit History (years) | 0.28 | Established history reduces default risk |
   | Recent Defaults | 0.18 | Recency bias; recent failure is strong signal |
   | Income Stability | 0.12 | Job tenure and income history |
   | Loan Amount | 0.10 | Larger loans slightly riskier |
   
   ## Decision Rules
   - If debt-to-income > 0.5 and recent defaults, likely decline
   - If credit history > 15 years and debt-to-income < 0.3, likely approve
   - Model uses ensemble: human review for borderline cases
   
   ## Transparency Assessment
   ✓ Model output is probabilistic (0-1 risk score), interpretable
   ✓ Top 3 features explaining each decision can be shown to applicants
   ✓ Model relies on public financial data; no unexplainable proprietary signal
   ? Model does not use protected classes explicitly but debt-to-income may proxy race/SES
   ```

5. **Assess Performance Across Conditions**
   
   **Test performance stability:**
   - Baseline performance (main test set)
   - Temporal drift (performance on recent data vs. historical)
   - Geographic or demographic subpopulation performance
   - Adversarial robustness (can small perturbations fool model?)
   - Uncertainty quantification (does model know when uncertain?)
   
   **Example audit output:**
   ```
   | Condition | Accuracy | Notes |
   |-----------|----------|-------|
   | Main test set | 94% | Baseline |
   | Data from last 30 days | 91% | 3% degradation; monitor for drift |
   | Urban vs. Rural | 95% vs. 88% | 7% gap; investigate features |
   | High confidence predictions | 97% | Model is well-calibrated |
   | Low confidence predictions | 78% | Should trigger human review |
   ```

6. **Evaluate Governance & Controls**
   
   **Operational audit:**
   - [ ] Access controls: Who can deploy/modify model?
   - [ ] Change control: Are changes logged and tested?
   - [ ] Monitoring: Is performance tracked? Fairness monitored?
   - [ ] Incident procedures: What happens if model fails?
   - [ ] Documentation: Model card, decision log, audit trail?
   - [ ] Testing: Were adversarial and edge cases tested?

7. **Prepare Audit Report**
   
   Structure audit report as:
   - **Executive Summary** (1 page): Overall assessment, key findings, recommendations
   - **Scope & Methodology** (1 page): What was audited? How?
   - **Findings** (3-5 pages): Detailed assessment of fairness, explainability, performance, governance
   - **Risk Assessment** (1 page): What risks does audit uncover? Are mitigations in place?
   - **Recommendations** (1 page): What should be improved? Priority? Timeline?
   - **Sign-Off** (signatures): Audit Reviewer, Model Owner, Compliance Officer

## Example

**Scenario:** Pre-deployment audit of loan approval model for a regional bank. Model predicts loan default risk.

```
# Model Audit Report: Loan Default Risk Predictor

## Executive Summary

Model audit conducted on [Date] for loan default risk model deployed to [Bank] for pre-approval scoring on auto loans.

**Overall Assessment:** CONDITIONAL APPROVAL WITH MITIGATIONS

Key findings:
- Model performance is strong overall (94% accuracy) but exhibits 6% fairness gap between genders
- Fairness gap driven by data imbalance in training set, not model bias
- Explainability is good; model relies on 5 core features aligned with lending best practices
- Governance controls are adequate but monitoring should be enhanced

Recommendations:
1. Rebalance training data to address fairness gap
2. Implement daily monitoring dashboard for demographic parity
3. Establish incident response procedures for fairness drift
4. Conduct follow-up fairness audit after model retraining

---

## 1. Model Architecture & Training

**Model Type:** Gradient Boosted Trees (XGBoost)
**Training Data:** 50,000 auto loans from 2018-2022 (40% default, 60% non-default)
**Features:** Debt-to-income ratio, credit score, employment history, loan-to-value, payment history
**Performance Metric:** AUC = 0.93 (excellent discrimination)
**Training Approach:** 80/20 train/test split; 5-fold cross-validation

**Audit Finding:** ✓ Architecture and training approach sound. Gradient boosted trees appropriate for this domain.

---

## 2. Fairness & Bias Assessment

**Protected Classes Audited:** Gender (M/F), Age Group (< 30, 30-50, > 50)

### Gender (Male vs. Female)

| Group | Sample Size | Default Rate | Model Accuracy | Model Recall | Model Precision | Performance Gap |
|-------|------------|------------|----------|---------|----------|---|
| Male | 26,000 | 42% | 95% | 91% | 94% | — |
| Female | 24,000 | 38% | 89% | 85% | 91% | -6% acc, -6% recall |
| Overall | 50,000 | 40% | 92% | 88% | 93% | — |

**Finding:** Female applicants have 6% lower accuracy and 6% lower recall. Model is less likely to correctly identify defaults among female applicants.

**Root Cause Analysis:**
- Training data: Only 32% female applicants (underrepresented)
- Feature analysis: No protected class feature used; no explicit gender bias
- Proxy analysis: Debt-to-income ratio correlates with family structure; may proxy gender
- Hypothesis: Model has learned a gender-correlated pattern in the data (e.g., patterns in income stability or debt levels that differ by gender)

**Audit Assessment:** ⚠ Fairness gap is concerning but explainable. Driven by data imbalance, not model design. Mitigation: Rebalance training data.

---

### Age Groups (< 30, 30-50, > 50)

| Group | Sample Size | Accuracy | Recall | Precision |
|-------|------------|----------|--------|-----------|
| < 30 | 8,000 | 91% | 86% | 92% |
| 30-50 | 32,000 | 93% | 89% | 94% |
| > 50 | 10,000 | 94% | 90% | 93% |
| Gap (Max-Min) | — | 3% | 4% | 2% |

**Finding:** Model performs slightly better on older applicants (94% acc) vs. younger (91% acc). Gap of 3% is within acceptable range (< 5% threshold).

**Audit Assessment:** ✓ Age-related performance variation is within acceptable range. No action required.

---

### Fairness Metrics Summary

| Metric | Female vs. Male | Threshold | Assessment |
|--------|--------|-----------|-----------|
| Demographic Parity (FPR) | 8% gap | < 5% acceptable | ⚠ CONCERNING |
| Equalized Odds (TPR) | 6% gap | < 5% acceptable | ⚠ CONCERNING |
| Calibration | Female: 87%, Male: 89% | < 3% gap acceptable | ⚠ CONCERNING |
| Predictive Parity | Female: 94%, Male: 96% | < 5% gap acceptable | ⚠ CONCERNING |

**Overall Fairness Assessment:** Significant disparities identified between genders. Disparities likely driven by training data imbalance (only 32% female representation) rather than model architecture.

---

## 3. Explainability Assessment

**Model Type Assessment:** Gradient Boosted Trees are reasonably interpretable (vs. neural networks)

**Feature Importance (SHAP values):**
| Feature | SHAP Impact | Interpretation | Bias Risk |
|---------|---------|--------|---|
| Debt-to-Income Ratio | 0.35 | Primary driver; aligns with lending theory | Low: objective financial metric |
| Credit Score | 0.28 | Strong predictor of default history | Low: objective measure |
| Payment History | 0.18 | Past behavior predicts future defaults | Low: objective record |
| Employment Stability | 0.12 | Stable employment = lower default risk | Medium: may correlate with age/gender |
| Loan-to-Value | 0.07 | Larger loans have slightly higher risk | Low: objective financial metric |

**Explainability Audit Results:**
- ✓ Top features align with lending best practices and domain knowledge
- ✓ For any loan decision, top 3 contributing features can be explained to applicant
- ✓ Model does not use protected classes explicitly
- ⚠ Employment stability may proxy age (older workers more stable); feature contributes to age performance gap
- ⚠ Debt-to-income may proxy gender/family structure; may contribute to gender fairness gap

**Transparency Findings:**
- ✓ Model output is interpretable: 0-100 default risk score
- ✓ Decision rules clear: score > 70 = likely decline; 40-70 = review; < 40 = likely approve
- ✓ Applicant can be shown top 3 factors driving their risk score
- ✗ Link between feature (employment stability) and protected class (age) not explicitly disclosed

**Audit Assessment:** ⚠ Model is reasonably interpretable but proxy variable risk should be documented. Recommend transparency disclosure noting feature correlations.

---

## 4. Performance Across Conditions

| Condition | Accuracy | Notes |
|-----------|----------|-------|
| Main test set (2020-2022) | 93% | Baseline |
| Temporal: 2022 Q1-Q2 only | 91% | 2% degradation; slight drift |
| Temporal: 2022 Q3-Q4 only | 89% | 4% degradation; more significant drift |
| Geographic: Urban | 94% | Strong performance |
| Geographic: Rural | 90% | 4% gap; may need geographic model |
| Recent originations (last 30 days) | 88% | 5% degradation; concerning drift |
| High confidence predictions (prob > 0.9) | 96% | Well-calibrated |
| Low confidence predictions (prob 0.4-0.6) | 82% | Should trigger human review |

**Finding:** Model shows performance degradation on recent data (2022 Q3-Q4 and last 30 days). Likely due to economic changes (inflation, rising rates, job market changes post-pandemic).

**Audit Assessment:** ⚠ Performance drift is significant. Recommend retraining quarterly or implementing continuous retraining pipeline.

---

## 5. Governance & Controls Assessment

| Control | Status | Evidence |
|---------|--------|----------|
| Access Control | ✓ Complete | Only 3 people can deploy; role-based access |
| Change Control | ✓ Complete | All model changes logged in Git; code review required |
| Monitoring Dashboard | ⚠ Partial | Performance metrics tracked; fairness metrics NOT currently tracked |
| Incident Procedures | ✗ Missing | No documented incident response procedures |
| Documentation | ✓ Good | Model card completed; decision log started |
| Testing | ⚠ Partial | Unit tests in place; no adversarial testing documented |
| Audit Trail | ⚠ Partial | Predictions logged; explanations not logged |

**Audit Assessment:** Operational controls are mostly in place but monitoring and incident response need enhancement.

---

## 6. Risk Assessment

Based on audit findings:

| Risk | Severity | Mitigation Status |
|------|----------|---|
| **Fairness Gap (Gender)** | Medium | Identified; mitigation plan: rebalance training data and retrain |
| **Performance Drift** | Medium | Identified; mitigation plan: implement quarterly retraining + continuous monitoring |
| **Proxy Variable Risk** | Medium | Partially mitigated; recommend transparency disclosure and feature monitoring |
| **Missing Incident Response** | Low | Not yet mitigated; recommend developing procedures |

---

## 7. Recommendations

**Priority 1 (Implement before deployment):**
1. Rebalance training data to achieve 50/50 gender distribution
2. Retrain model and re-audit for fairness
3. Implement daily monitoring dashboard for demographic parity and performance metrics
4. Document incident response procedures (what to do if fairness/performance drifts)
5. Prepare transparency disclosure: explain top 3 factors and note feature limitations

**Priority 2 (Implement within 90 days):**
6. Implement quarterly retraining pipeline to address performance drift
7. Conduct adversarial robustness testing
8. Add prediction explanations to decision log (audit trail)
9. Conduct follow-up fairness audit after retraining

**Priority 3 (Ongoing):**
10. Monitor feature correlations with protected classes quarterly
11. Track incident reports and update risk register
12. Annual fairness audit

---

## Audit Sign-Off

Conditional approval for deployment contingent on Priority 1 recommendations implemented.

**Audit Reviewer:** _____________________ Date: _____ (Compliance Officer)
**Model Owner:** _____________________ Date: _____ (ML Team)
**Risk Acceptance:** _____________________ Date: _____ (CRO or Executive Sponsor)

Approved: [Date]
Contingencies: [Date implemented]
Next audit scheduled: [Date + 90 days]
```

---

## Audit Checklist

Use this checklist to ensure comprehensive model audit:

**Architecture & Training:**
- [ ] Model type and architecture documented
- [ ] Training data source, size, and composition known
- [ ] Training hyperparameters logged and reproducible
- [ ] Cross-validation or train/test methodology clear
- [ ] Baselines compared (does model beat simple baseline?)

**Fairness & Bias:**
- [ ] Protected classes identified
- [ ] Performance measured by demographic group
- [ ] Disparities quantified and compared to threshold (typically 5%)
- [ ] Root cause analysis conducted (data vs. features vs. model)
- [ ] Fairness metrics chosen: demographic parity, equalized odds, calibration
- [ ] Mitigations designed and timeline established

**Explainability:**
- [ ] Feature importance computed (SHAP, permutation, coefficients)
- [ ] Feature importances make business sense
- [ ] Decision logic documented or examples explained
- [ ] Proxy variables identified (features correlating with protected classes)
- [ ] Transparency disclosures prepared for users

**Performance:**
- [ ] Baseline performance on main test set
- [ ] Performance tested on subpopulations (temporal, geographic, demographic)
- [ ] Performance drift detected if present
- [ ] Uncertainty quantification (does model know when uncertain?)
- [ ] Adversarial robustness tested (if high-stakes)

**Governance:**
- [ ] Access controls documented
- [ ] Change control procedures in place
- [ ] Monitoring dashboard configured
- [ ] Incident response procedures documented
- [ ] Model card complete
- [ ] Decision log and audit trail in place

**Documentation & Sign-Off:**
- [ ] Audit report prepared
- [ ] Findings documented with evidence
- [ ] Recommendations prioritized with timelines
- [ ] Risk acceptance obtained from stakeholders
- [ ] Sign-off by Compliance Officer, Model Owner, Executive Sponsor
