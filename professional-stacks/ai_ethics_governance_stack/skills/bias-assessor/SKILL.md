# Bias Assessor

## When to activate

When quantifying fairness metrics and demographic disparities in AI systems, especially those making decisions about humans (hiring, credit, parole, diagnosis, content moderation). Required before any fairness audit or production deployment decision.

## When NOT to use

When designing governance frameworks (use ethical-framework-designer). When assessing non-fairness risks like safety or transparency (use risk-framework-builder). When analyzing general model performance (use standard ML evaluation tools).

## Instructions

The Bias Assessor quantifies fairness metrics and detects disparities across protected attributes. Follow this rigorous approach:

### 1. Protected Attribute Identification

Identify all attributes relevant to fairness assessment:

```python
# Protected attributes to consider:
protected_attributes = {
    'race_ethnicity': ['White', 'Black', 'Hispanic', 'Asian', 'Native American', 'Pacific Islander', 'Multi-racial'],
    'gender': ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    'age': ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
    'disability': ['None', 'Physical', 'Cognitive', 'Mental health', 'Sensory'],
    'national_origin': ['Country of origin or ancestry'],
    'religion': ['Religious affiliation or belief'],
    'veteran_status': ['Military service history'],
    'sexual_orientation': ['LGBTQ+ status']
}

# Determine which are relevant to your domain:
relevant_attributes = select_attributes_for_domain(decision_domain)
# Example: Hiring system should assess race, gender, age, disability
# Credit scoring might assess race, gender, age
# Content moderation might assess all attributes if available
```

### 2. Fairness Metric Selection

Define which fairness metrics to measure. Different metrics emphasize different notions of fairness:

```python
# Core fairness metrics:

metrics = {
    'Demographic Parity (Selection Rate Equality)': {
        'definition': 'Positive rate should be equal across groups',
        'formula': 'P(Y=1|Group A) ≈ P(Y=1|Group B)',
        'interpretation': 'System approves similar % of each group',
        'use_case': 'When equal representation in outcomes is important (hiring, loans)',
        'threshold': '<5% disparity acceptable; >10% is concerning'
    },
    
    'Equalized Odds (TPR/FPR Parity)': {
        'definition': 'True positive rate and false positive rate equal across groups',
        'formula': 'P(Y_pred=1|Y_true=1, Group A) ≈ P(Y_pred=1|Y_true=1, Group B)',
        'interpretation': 'System catches same % of true positives for each group',
        'use_case': 'When both false positives and false negatives have similar harm across groups',
        'threshold': '<5% TPR/FPR gap acceptable; >10% is concerning'
    },
    
    'Calibration (Predictive Parity)': {
        'definition': 'Precision should be equal across groups',
        'formula': 'P(Y_true=1|Y_pred=1, Group A) ≈ P(Y_true=1|Y_pred=1, Group B)',
        'interpretation': 'When system says "approved," same confidence level applies to each group',
        'use_case': 'When positive prediction should have same reliability across groups',
        'threshold': '<5% precision gap acceptable; >10% is concerning'
    },
    
    'Adverse Impact Ratio (4/5 Rule)': {
        'definition': 'Selection rate of disadvantaged group should be ≥80% of advantaged group',
        'formula': 'Selection_rate_group_B / Selection_rate_group_A ≥ 0.80',
        'interpretation': 'Fair Lending legal standard for employment/credit discrimination',
        'use_case': 'Credit, hiring, lending decisions (regulatory requirement)',
        'threshold': '≥0.80 is legally safe; <0.80 may trigger disparate impact liability'
    },
    
    'Group Calibration Difference': {
        'definition': 'Difference in precision between groups',
        'formula': '|Precision_A - Precision_B|',
        'interpretation': 'Measures if prediction confidence differs by group',
        'use_case': 'Assessing if model reliability differs across groups',
        'threshold': '<5% difference acceptable'
    }
}

# Select relevant metrics for your domain:
selected_metrics = choose_metrics_by_domain(decision_domain)
```

### 3. Data Preparation & Stratification

Prepare data for fairness analysis:

```python
# Load decision outcomes and protected attributes
import pandas as pd
import numpy as np

def prepare_fairness_data(predictions, actual_labels, protected_attributes):
    """
    Args:
        predictions: Model predictions (0/1 for binary classification)
        actual_labels: Ground truth labels
        protected_attributes: DataFrame with demographic columns
    
    Returns:
        Stratified data ready for fairness analysis
    """
    df = pd.DataFrame({
        'predicted': predictions,
        'actual': actual_labels
    })
    
    # Add protected attributes
    for attr in protected_attributes.columns:
        df[attr] = protected_attributes[attr]
    
    # Verify data quality
    assert df['predicted'].isin([0, 1]).all(), "Predictions must be 0/1"
    assert df['actual'].isin([0, 1]).all(), "Labels must be 0/1"
    
    # Check for group size imbalance
    for attr in protected_attributes.columns:
        group_sizes = df[attr].value_counts()
        for group, size in group_sizes.items():
            if size < 30:  # Groups smaller than 30 are unreliable
                print(f"WARNING: Group {group} (attribute {attr}) has only {size} samples. Results may be unreliable.")
    
    return df

# Example usage:
fairness_df = prepare_fairness_data(
    predictions=model.predict(X_test),
    actual_labels=y_test,
    protected_attributes=X_test[['race', 'gender', 'age']]
)
```

### 4. Fairness Metric Calculation

Calculate each metric for all groups:

```python
def calculate_fairness_metrics(df, protected_attr, metrics_to_calculate):
    """Calculate fairness metrics stratified by protected attribute."""
    
    results = {}
    groups = df[protected_attr].unique()
    
    for metric_name in metrics_to_calculate:
        if metric_name == 'demographic_parity':
            # Selection rate: % positive predictions
            results[metric_name] = {
                group: (df[df[protected_attr] == group]['predicted'] == 1).mean()
                for group in groups
            }
        
        elif metric_name == 'equalized_odds_tpr':
            # TPR: % of true positives correctly predicted (recall for positive class)
            results[metric_name] = {
                group: (
                    df[(df[protected_attr] == group) & (df['actual'] == 1)]['predicted'].sum()
                    / (df[(df[protected_attr] == group) & (df['actual'] == 1)].shape[0] + 1e-8)
                )
                for group in groups
            }
        
        elif metric_name == 'equalized_odds_fpr':
            # FPR: % of true negatives incorrectly predicted (false positive rate)
            results[metric_name] = {
                group: (
                    (df[(df[protected_attr] == group) & (df['actual'] == 0)]['predicted'] == 1).sum()
                    / (df[(df[protected_attr] == group) & (df['actual'] == 0)].shape[0] + 1e-8)
                )
                for group in groups
            }
        
        elif metric_name == 'calibration_ppv':
            # Precision: % of positive predictions that are actually positive
            results[metric_name] = {
                group: (
                    df[(df[protected_attr] == group) & (df['predicted'] == 1)]['actual'].sum()
                    / ((df[df[protected_attr] == group]['predicted'] == 1).sum() + 1e-8)
                )
                for group in groups
            }
        
        elif metric_name == 'adverse_impact_ratio':
            # Selection rate of disadvantaged group / selection rate of advantaged group
            selection_rates = {
                group: (df[df[protected_attr] == group]['predicted'] == 1).mean()
                for group in groups
            }
            # Assume first group is advantaged; others are disadvantaged
            results[metric_name] = {
                group: selection_rates[group] / selection_rates[groups[0]]
                for group in groups[1:]
            }
    
    return results

# Example: Calculate metrics for 'race' attribute
metrics = calculate_fairness_metrics(
    fairness_df,
    protected_attr='race',
    metrics_to_calculate=[
        'demographic_parity',
        'equalized_odds_tpr',
        'equalized_odds_fpr',
        'calibration_ppv',
        'adverse_impact_ratio'
    ]
)

# Print results in audit-ready format
print_fairness_audit_table(metrics)
```

### 5. Disparity Analysis

Quantify disparity between groups:

```python
def calculate_disparities(metrics, metric_name):
    """Calculate disparities and flag concerning gaps."""
    
    values = metrics[metric_name]
    groups = list(values.keys())
    
    # Find max and min values
    max_value = max(values.values())
    min_value = min(values.values())
    
    # Calculate disparity
    disparity = max_value - min_value
    disparity_pct = (disparity / min_value) * 100 if min_value > 0 else float('inf')
    
    # Threshold-based flagging
    thresholds = {
        'demographic_parity': 0.05,  # 5% max acceptable disparity
        'equalized_odds_tpr': 0.05,
        'equalized_odds_fpr': 0.05,
        'calibration_ppv': 0.05,
        'adverse_impact_ratio': 0.80  # 4/5 rule; ratio must be ≥0.80
    }
    
    threshold = thresholds.get(metric_name)
    
    if metric_name == 'adverse_impact_ratio':
        # For adverse impact, check if ALL groups meet 4/5 rule
        flag = 'PASS' if all(v >= threshold for v in values.values() if v is not None) else 'FAIL'
    else:
        # For others, check if disparity is below threshold
        flag = 'PASS' if disparity < threshold else 'FAIL'
    
    return {
        'metric': metric_name,
        'groups': values,
        'max': max_value,
        'min': min_value,
        'disparity': disparity,
        'disparity_pct': disparity_pct,
        'threshold': threshold,
        'status': flag
    }

# Generate disparity summary table
disparities = []
for metric_name in metrics.keys():
    disparities.append(calculate_disparities(metrics, metric_name))

print_disparity_summary_table(disparities)
```

### 6. Root Cause Analysis

For each disparity, identify why it exists:

```
For finding: "Male applicants have 8% higher approval rate than female applicants"

Root Cause Analysis:

1. Data-driven causes:
   - Does training data itself have gender imbalance in outcomes? (Check historical data)
   - Are there gender-correlated features (job title, salary level, industry) driving decisions?
   - Is there measurement error or missing data that differs by gender?

2. Model-driven causes:
   - Did model learn spurious correlation with gender?
   - Are feature importances different for each gender?
   - Did hyperparameter tuning optimize differently for each gender?

3. Threshold-driven causes:
   - Is decision threshold applied uniformly across genders?
   - Would adjusting threshold change disparity?

Investigation:
- Feature importance analysis by gender
- Threshold sensitivity analysis
- Data distribution analysis
- Model behavior on identical profiles (one male, one female)
```

### 7. Mitigation Recommendation

For each disparity, recommend mitigation:

```
Mitigation Options:

1. Threshold Adjustment
   - Adjust decision boundary to achieve demographic parity
   - Trade-off: May reduce accuracy for disadvantaged group
   - Implementation: Adjust cutoff threshold; may require retraining

2. Retraining with Fairness Constraint
   - Retrain model with fairness objective
   - Trade-off: Reduces accuracy slightly; may reduce overall metrics
   - Implementation: Use fairness-aware ML libraries (e.g., Fairlearn, AIF360)

3. Feature Engineering
   - Remove or transform features correlated with protected attribute
   - Trade-off: May reduce model accuracy
   - Implementation: Careful analysis to avoid removing predictive information

4. Stratified Model
   - Train separate model for each demographic group
   - Trade-off: More complex; requires sufficient data per group
   - Implementation: Separate models or group-specific parameters

5. Human Review Layer
   - Add human review for borderline decisions or protected groups
   - Trade-off: Increases cost and latency
   - Implementation: Clear review guidelines and training

6. Monitoring & Escalation
   - Accept disparity if within threshold; monitor post-deployment
   - Trade-off: Risk of disparity increasing over time
   - Implementation: Daily monitoring; escalate if threshold exceeded

Example mitigation for credit approval:
- Issue: 8% approval rate gap (White: 65%, Black: 57%)
- Root cause: Model learned from historical data with racial bias
- Mitigation: Threshold adjustment (lower for Black applicants by 0.1 points)
- Expected outcome: <3% disparity; monitor daily for drift
- Residual risk: If monitored and escalated, low
```

## Example

### Bias Audit: Hiring Recommendation System

**System:** Resume screening AI for entry-level software engineering positions  
**Audit Date:** 2024-01-20  
**Sample Size:** 10,000 resumes from past 12 months  

#### 1. Protected Attributes

Analyzed attributes:
- Gender: Male, Female, Non-binary
- Race/Ethnicity: White, Black, Hispanic, Asian, Other
- Age: 18-25, 26-35, 36-45, 46+
- Disability Status: Disclosed, Not disclosed

#### 2. Fairness Metrics Selected

- Demographic Parity (screening pass rate should equal across groups)
- Equalized Odds TPR (same hiring rate for qualified candidates across groups)
- Calibration PPV (recommendation confidence should be similar across groups)
- Adverse Impact Ratio (screening rate for protected groups ≥80% of majority group)

#### 3. Results

| Metric | Female | Male | Non-binary | Disparity | Status |
|---|---|---|---|---|---|
| Screening Pass Rate | 22% | 26% | 19% | -7% (M vs F) | FAIL |
| TPR (hired/qualified) | 68% | 71% | 65% | +6% (M vs NB) | FAIL |
| Recommendation Confidence | 0.81 | 0.82 | 0.77 | -5% | FAIL |
| Adverse Impact Ratio | 0.85 | 1.00 | 0.73 | 0.73 legal risk | FAIL |

#### 4. Root Cause Analysis

**For gender gap (females 4% less likely to pass):**
- Features over-indexed on tenure and years of experience (underrepresented in female candidates due to time out of workforce)
- Keywords like "aggressive," "competitive" appeared more in male-selected resumes
- Objective metric: GPA, certification, code samples — showed no gender gap
- Conclusion: Training data reflected hiring bias; model learned and amplified it

#### 5. Mitigation Recommendation

**Recommended Approach:** Threshold adjustment + continuous monitoring

```
Specific Actions:
1. Adjust screening threshold by -0.05 points for female candidates
   → Expected: 24% pass rate (match male rate within 2%)
   → Trade-off: TPR for female candidates improves from 68% to 71%

2. Monitor daily:
   - Pass rates by gender, race, age
   - Alert if disparity exceeds 3% for any attribute
   - Review alert within 4 hours; escalate if pattern confirmed

3. Q2 2024: Retrain model without years-of-experience as feature
   - Expected: Reduce root cause (tenure bias)
   - Validation: Run new model on historical data; verify lower disparity

4. Establish appeals process:
   - Rejected candidates can request human review
   - Provide explanation of key rejection factors
```

#### 6. Approval & Conditions

**Bias Audit Result: PASS WITH CONDITIONS**

- **Fairness Risk Level:** MEDIUM (disparities detected; mitigations in place)
- **Approval:** Conditional on implementing threshold adjustment and monitoring

**Conditions for Deployment:**
- [ ] Threshold adjustment implemented (adjustment: -0.05 for female candidates)
- [ ] Monitoring dashboard active; daily checks configured
- [ ] Alert rules set: escalate if disparity >3%
- [ ] Appeals process live: rejected candidates can request review
- [ ] Governance log tracks all screening decisions by demographic group
- [ ] Retrain model by Q2 2024 without tenure feature

**Continuous Monitoring:**
- Daily: Pass rate by gender, race, age, disability; alert if disparity >3%
- Weekly: TPR/FPR analysis; candidate profile review
- Monthly: Full fairness audit; trend analysis
- Quarterly: Retraining with fairness constraints if drift observed

---

Built with [Claudient](https://github.com/Claudients/Claudient)
