# Dataset Analyzer

## When to activate

When profiling, understanding, or diagnosing a dataset before model training. Use this to identify distribution skews, missing values, class imbalance, outliers, duplicates, potential PII, and data quality issues that will inform experiment design and model evaluation strategy.

## When NOT to use

- Data is already profiled and issues documented
- Working with streaming data where full-dataset statistics are unavailable
- Privacy constraints prevent statistical analysis or distribution inspection
- The dataset is too large to profile locally (use distributed sampling instead)

## Instructions

Dataset analysis follows a structured profiling approach:

1. **Load and overview** — row count, column names, data types, memory footprint
2. **Missing value assessment** — count nulls per column, patterns (MCAR, MAR, MNAR)
3. **Distribution analysis** — univariate statistics (mean, median, std, skewness) for numeric features
4. **Categorical inspection** — unique value counts, class balance, rare categories
5. **Outlier detection** — statistical outliers (IQR, z-score), domain-specific anomalies
6. **Duplicate identification** — exact duplicates, near-duplicates on key columns
7. **PII and sensitive data scan** — potential email, phone, SSN, credit card patterns
8. **Data quality scoring** — overall completeness and consistency metrics
9. **Correlation and relationships** — multivariate patterns, feature dependencies, leakage risk

Output should include:
- Comprehensive profiling report with tables and visualizations
- Identified issues ranked by severity (missing, duplicates, class imbalance, outliers)
- Recommendations for preprocessing and train/val/test splits
- Data quality score and caveats for downstream use

## Example

Analyzing a customer churn dataset:

- **Overview**: 50k rows, 25 columns (numerical, categorical, temporal)
- **Missing values**: 3% in tenure, 0.1% in last_payment_date (suggest forward-fill)
- **Class balance**: 80/20 (churn imbalance; note for stratified split)
- **Numeric distributions**: Account_age right-skewed, Monthly_charges normal
- **Outliers**: 12 customers with >$10k monthly charge (verify valid, not data entry error)
- **Duplicates**: 47 exact duplicates on customer_id (recommend dedup before split)
- **PII scan**: No SSN/credit card patterns detected; email and phone present (anonymize before sharing)
- **Correlations**: Total_charges and account_age highly correlated (0.92); consider feature selection
- **Recommendation**: Stratified train/val/test (80/10/10) on customer_id after deduplication; forward-fill tenure
