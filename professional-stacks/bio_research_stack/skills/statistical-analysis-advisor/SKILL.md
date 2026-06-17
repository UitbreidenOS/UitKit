---
name: statistical-analysis-advisor
description: Advises on appropriate statistical tests, validates assumptions, performs analysis with effect sizes and confidence intervals. Outputs a statistical analysis plan or results interpretation with test justification and assumption checks.
allowed-tools: Read, Write, Bash
effort: medium
---

# Statistical Analysis Advisor

## When to activate
When choosing statistical tests, interpreting results, checking assumptions, or when a reviewer questions your analysis. Use before running any analysis to ensure correct test selection.

## When NOT to use
Skip for simple descriptive statistics (mean, SD), data visualization without inference, or when the statistical approach is already validated and approved.

## Instructions

1. **Characterize the data:**
   - Outcome type: Continuous, categorical, ordinal, time-to-event, count
   - Groups: Number of groups, paired vs. independent
   - Distribution: Normal (Shapiro-Wilk), equal variance (Levene's)
   - Sample size per group

2. **Test selection decision tree:**
   - 2 independent groups, normal → Independent t-test
   - 2 independent groups, non-normal → Mann-Whitney U
   - 2 paired groups, normal → Paired t-test
   - 3+ groups → One-way ANOVA (Kruskal-Wallis if non-normal)
   - Repeated measures → RM-ANOVA or Friedman
   - Time-to-event → Log-rank test, Cox regression
   - Correlation → Pearson (normal) or Spearman (non-normal)

3. **Assumption checks:**
   - Normality: Shapiro-Wilk (n<50) or Kolmogorov-Smirnov (n≥50)
   - Homogeneity of variance: Levene's test
   - Sphericity: Mauchly's test (for RM-ANOVA)
   - If violated: Report the violation and use the non-parametric alternative

4. **Report results with:**
   - Test statistic and degrees of freedom
   - Exact p-value (not just <0.05)
   - Effect size (Cohen's d, η², r, OR as appropriate)
   - 95% confidence interval
   - Sample size

5. **Multiple comparisons:** If >2 comparisons, specify correction:
   - Bonferroni (conservative)
   - Holm-Bonferroni (step-down)
   - Benjamini-Hochberg FDR (exploratory)

## Output Format

```
STATISTICAL ANALYSIS: [Research question]

DATA CHARACTERISTICS:
  Outcome: [type] | Groups: [X] | Distribution: [normal/non-normal]
  Normality: Shapiro-Wilk W=[X], p=[X]
  Variance: Levene's F=[X], p=[X]

TEST SELECTED: [Test name] — [justification]

RESULTS:
  [Test]([df]) = [statistic], p = [exact p]
  Effect size: [Cohen's d / η² / r] = [value] ([small/medium/large])
  95% CI: [[lower], [upper]]
  n = [X] per group

INTERPRETATION: [Plain language conclusion]
LIMITATIONS: [Assumptions, power, generalizability]
```

## Example

```
STATISTICAL ANALYSIS: Does treatment X reduce blood glucose vs. vehicle?

DATA CHARACTERISTICS:
  Outcome: Continuous (mg/dL) | Groups: 2 (treatment vs. vehicle) | Distribution: Normal
  Normality: Shapiro-Wilk W=0.97, p=0.34
  Variance: Levene's F=0.12, p=0.73

TEST SELECTED: Independent t-test — normal distribution, equal variance, 2 independent groups

RESULTS:
  t(46) = 3.82, p = 0.0004
  Effect size: Cohen's d = 1.12 (large)
  95% CI: [18.4, 59.2] mg/dL difference
  n = 24 per group

INTERPRETATION: Treatment X significantly reduced fasting blood glucose by 38.8 mg/dL
(compared to vehicle), a large and clinically meaningful effect.
LIMITATIONS: Single timepoint, single strain, not adjusted for body weight.
```
