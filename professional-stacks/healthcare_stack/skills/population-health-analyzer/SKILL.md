---
name: population-health-analyzer
description: Analyzes population health data to identify disparities, risk stratify patient cohorts, and design interventions. Outputs community health assessments with SDOH integration and outcome measurement frameworks.
allowed-tools: Read, Write, WebSearch, Bash
effort: high
---

# Population Health Analyzer

## When to activate
When analyzing health outcomes across a patient population, designing value-based care programs, identifying health disparities, or when preparing community health needs assessments (CHNA). Use for ACOs, health systems, public health departments, and managed care organizations.

## When NOT to use
Skip for individual patient clinical decisions, single-case reviews, or when the population analysis was completed within the last quarter with no significant demographic or program changes.

## Instructions

1. **Population definition:**
   - Denominator: Total attributed lives, active patients, geographic area
   - Stratification: Age, sex, race/ethnicity, payer, risk level
   - Time period: Quarterly, annual, rolling 12-month

2. **Outcome measures:**
   - Clinical: HEDIS measures (diabetes control, hypertension, cancer screening)
   - Utilization: ED visits/1000, admissions/1000, readmission rate
   - Cost: PMPM total cost, pharmacy cost, out-of-network spend
   - Patient experience: CAHPS composite scores

3. **Risk stratification:**
   - Hierarchical condition categories (HCC) for risk adjustment
   - Utilization-based: High utilizers (top 5%), rising risk, stable
   - Clinical complexity: Multimorbidity count, frailty index
   - Social risk: SDOH Z-codes, area deprivation index (ADI)

4. **Disparity analysis:**
   - Stratify all measures by race/ethnicity, language, geography
   - Calculate disparity ratios and absolute differences
   - Identify statistically significant differences (chi-square, t-test)
   - Map hotspots using geographic information

5. **Intervention design:**
   - Target population with inclusion/exclusion criteria
   - Intervention components and delivery method
   - Expected impact (effect size from literature)
   - ROI estimation: Cost of intervention vs. avoided utilization

## Output Format

```
POPULATION HEALTH ASSESSMENT: [Population name]
DENOMINATOR: [N] lives | PERIOD: [time range]
PAYER MIX: [Medicare X%, Medicaid Y%, Commercial Z%]

OUTCOME SCORECARD:
| Measure | Current | Target | Benchmark | Gap |
|---------|---------|--------|-----------|-----|

RISK STRATIFICATION:
  High utilizers (top 5%): [N] — [characteristics]
  Rising risk: [N] — [characteristics]
  Stable: [N]

DISPARITY ANALYSIS:
| Measure | White | Black | Hispanic | Asian | p-value |
|---------|-------|-------|----------|-------|---------|

HOTSPOTS:
  [Geographic area] — [measure] — [X]× benchmark

INTERVENTION RECOMMENDATIONS:
  1. [Intervention] — Target: [N] — Expected impact: [X]% — ROI: [X]:1
  2. [...]
```

## Example

```
POPULATION HEALTH ASSESSMENT: Metro Health ACO — Attributed Lives
DENOMINATOR: 42,000 lives | PERIOD: Q1 2026
PAYER MIX: Medicare 55%, Medicaid 25%, Commercial 20%

OUTCOME SCORECARD:
| Measure                  | Current | Target | Benchmark | Gap  |
|--------------------------|---------|--------|-----------|------|
| HbA1c <8% (diabetes)    | 72%     | 80%    | 78%       | -8%  |
| BP <140/90 (hypertension)| 68%     | 75%    | 73%       | -7%  |
| ED visits/1000           | 385     | <320   | 340       | +65  |
| 30-day readmission       | 14.2%   | <12%   | 13.1%     | +2.2%|

RISK STRATIFICATION:
  High utilizers (top 5%): 2,100 — avg 4.2 chronic conditions, 68% Medicaid
  Rising risk: 5,400 — new diabetes diagnosis or 2+ ED visits in 6 months
  Stable: 34,500

DISPARITY ANALYSIS:
| Measure           | White | Black | Hispanic | Asian | p-value |
|-------------------|-------|-------|----------|-------|---------|
| HbA1c <8%         | 78%   | 64%   | 69%      | 81%   | <0.001  |
| ED visits/1000    | 290   | 480   | 420      | 210   | <0.001  |

HOTSPOTS:
  Zip 10025 — ED utilization 2.1× benchmark, 34% uninsured
  Zip 10031 — Readmission 1.8× benchmark, limited PCP access

INTERVENTION RECOMMENDATIONS:
  1. Community health worker program in 10025/10031 — Target: 800 — Expected: -25% ED — ROI: 3.2:1
  2. Telehealth diabetes coaching for rising risk — Target: 1,200 — Expected: +8% HbA1c control — ROI: 2.1:1
  3. Post-discharge pharmacy delivery — Target: 500/month — Expected: -3% readmission — ROI: 1.8:1
```
