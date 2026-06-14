---
name: experiment-analyzer
description: Design and analyze A/B tests and experiments — sample size, statistical significance, and result interpretation
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Designing A/B tests with proper sample size and duration
- Analyzing experiment results for statistical significance
- Interpreting metrics lift, confidence intervals, and guardrail metrics
- Setting up experimentation frameworks (Statsig, LaunchDarkly, custom)

## When NOT to use

- For qualitative user research
- For feature flagging without measurement
- For simple before/after comparisons

## Instructions

1. **Pre-experiment.** Define primary metric, guardrail metrics, minimum detectable effect (MDE), and required sample size.
2. **Power analysis.** Calculate sample size: n = (Z_α/2 + Z_β)² × σ² / δ². Typical: 80% power, 5% significance.
3. **Run experiment.** Randomize at user/session level. Check for sample ratio mismatch (SRM). Monitor guardrails daily.
4. **Analyze results.** Compute p-value, confidence interval, relative lift. Check for novelty/primacy effects.
5. **Interpret.** Statistical significance ≠ practical significance. Consider effect size and business impact.
6. **Report.** Executive summary: metric, lift %, CI, p-value, recommendation (ship/iterate/kill).

## Example

```
Experiment: New checkout flow
Primary metric: Conversion rate
MDE: 2% relative lift
Sample size: 50K users/group (14 days at current traffic)

Results:
  Control:    3.21% conversion
  Treatment:  3.34% conversion
  Lift:       +4.1% (95% CI: [+1.2%, +7.0%])
  p-value:    0.008 (< 0.05 threshold)
  Guardrails: Page load time unchanged, error rate unchanged

Recommendation: Ship. Statistically significant with positive lift.
```
