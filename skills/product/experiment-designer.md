---
name: experiment-designer
description: "A/B test and experiment design: hypothesis writing, sample size calculation, statistical significance, experiment tracking, avoiding common pitfalls, and interpreting results"
updated: 2026-06-13
---

# Experiment Designer Skill

## When to activate
- Designing an A/B test or multivariate experiment
- Calculating required sample size before running a test
- Interpreting experiment results (is this significant? should we ship?)
- Setting up an experimentation framework for a team
- Avoiding common testing mistakes (peeking, novelty effect, multiple comparisons)
- Deciding whether to run an experiment vs. just ship

## When NOT to use
- When you have < 1,000 users/week — not enough traffic for meaningful tests; use qualitative instead
- When the change is a bug fix or clearly good — don't test the obvious, ship it
- When you need results in < 1 week — underpowered tests are worse than no tests
- Analytics tool setup — use the analytics-tracking skill

## Instructions

### Hypothesis and experiment design

```
Design an A/B test for [change].

What we want to test: [describe the change — copy, UI, flow, feature]
Why we think it'll work: [the insight or data behind this idea]
Primary metric: [the one metric we're optimising]
Secondary metrics: [metrics to watch for regressions]
Traffic available: [sessions/day or users/week on this page/flow]

Experiment design:

1. Hypothesis (write it before touching code):
   Format: "We believe that [change] will [improve metric] for [user segment] because [reason based on insight/data]."
   
   Bad: "We believe a bigger CTA button will increase conversions."
   Good: "We believe changing the CTA copy from 'Get Started' to 'Start Free Trial' will increase trial signups for first-time visitors because our interview data shows users don't realise the trial is free."

2. Variants:
   - Control (A): current state — unchanged
   - Variant B: the change
   - (Optional) Variant C: a bolder version of the change
   
   Rule: test one thing per experiment. Two changes = you don't know which drove the result.

3. Traffic split:
   - 2 variants: 50/50 (maximum statistical power)
   - 3 variants: 33/33/33 — requires more traffic or longer test
   - Ramp up: start at 5-10% → confirm no bugs → full exposure

4. Primary metric:
   [Name] — measured as: [definition]
   Minimum detectable effect: [X% relative improvement we consider meaningful]
   
5. Success criteria (decide before launching — no changing goalposts):
   Win: p-value < 0.05 AND MDE reached AND no significant regression in secondary metrics
   Call it early: only if clearly damaging — do NOT stop for a winning result early

Generate full experiment brief for my test.
```

### Sample size calculator

```
Calculate required sample size for [experiment].

Primary metric type: [conversion rate / mean value / proportion]
Current baseline: [X% conversion rate / $X average / X% of users]
Minimum detectable effect (MDE): [X% relative change — the smallest win worth shipping for]
Statistical power: [80% standard / 90% for critical experiments]
Significance level: [α = 0.05 standard / α = 0.01 for high-stakes]
Number of variants: [2 / 3 / 4]

Sample size formula (for proportions):
n = 2 × (z_α/2 + z_β)² × p(1-p) / δ²

where:
- z_α/2 = 1.96 (for α=0.05, two-tailed)
- z_β = 0.84 (for 80% power)
- p = baseline conversion rate
- δ = absolute difference (baseline × MDE)

For your inputs:
Baseline: [X%]
MDE: [X% relative] = [Y% absolute]
Required n per variant: [calculated]
Total sample: [n × number of variants]

At your traffic level ([X visitors/day]):
Test duration needed: [X days]

Warning flags:
- If duration > 4 weeks: redesign test (increase MDE, or wait for more traffic)
- If MDE is < 1%: probably not worth testing — hard to reach significance
- If MDE > 30%: very optimistic — verify the business case is real

Calculate for my specific inputs and confirm the duration is feasible.
```

### Common experiment mistakes

```
Review my experiment design and flag potential problems.

Experiment description: [describe the test you're planning]
Duration planned: [X days]
Traffic source: [all traffic / segment / specific page]

Common mistakes to check:

□ PEEKING: Stopping a test early because results look good
  Risk: false positive rate skyrockets — winning variant is often a fluke
  Fix: Decide run duration before launch and stick to it (or use sequential testing)

□ MULTIPLE COMPARISONS: Testing 5 variants = 5 chances to find a false positive
  Risk: at α=0.05, running 5 tests → expected 0.25 false positives per batch
  Fix: Use Bonferroni correction (α/n) or limit to 2-3 variants

□ NOVELTY EFFECT: First-time users respond to anything new
  Risk: initial lift disappears after first exposure
  Fix: Run test for full 2+ business cycles (typically 2 weeks minimum)

□ SAMPLE RATIO MISMATCH: Unequal traffic to variants
  Risk: randomisation is broken — results are invalid
  Fix: Plot cumulative assignment ratio daily; alert if > 5% off target

□ NETWORK EFFECTS: Users interact with each other
  Risk: control and variant groups are not independent
  Fix: Cluster randomise by team/account, not by individual user

□ SURVIVORSHIP BIAS: Only measuring engaged users
  Risk: uplift looks great but only for users who would have converted anyway
  Fix: Include all eligible users, not just those who "engaged" with the variant

□ INSTRUMENTATION LAG: Metric calculation lags behind the experiment
  Risk: early results show inflated or deflated numbers
  Fix: Add 24-48 hours before reading any results; verify event firing in debug mode

Flag which of these apply to my planned experiment + specific fixes.
```

### Results interpretation

```
Interpret my experiment results.

Experiment: [describe the test]
Duration: [X days]
Sample size per variant: [X control / X variant]
Primary metric:
  Control: [X%]
  Variant: [X%]
  Relative lift: [+X%]
  p-value: [X]
  Confidence interval: [X% to X%]
Secondary metrics: [list and whether they moved]

Interpretation framework:

Statistically significant + practically significant: SHIP
  Both p < 0.05 AND relative lift ≥ MDE → clear win, ship

Statistically significant + NOT practically significant: DON'T SHIP
  p < 0.05 but lift is 0.3% on a 2% baseline → real but not worth the maintenance cost

NOT significant + directionally positive: EXTEND OR REDESIGN
  p = 0.12 with positive trend → under-powered; extend if cost is low; redesign if expensive

NOT significant + flat: MOVE ON
  p > 0.5, effect near zero → the idea didn't work; fail fast and try next hypothesis

Significant regression in secondary metric: STOP, DO NOT SHIP
  Even if primary metric won, a regression in revenue or retention overrides

For my results:
1. Statistical conclusion: [significant / not significant / borderline]
2. Practical significance: [meaningful / not meaningful]
3. Secondary metric assessment: [any regressions?]
4. Decision: [ship / don't ship / extend / redesign]
5. What we learned (even if we don't ship): [the insight that makes the next test better]
```

## Example

**User:** We're testing a new checkout flow. Baseline conversion is 3.2%. We want to detect a 15% relative improvement (to 3.68%). We get 500 visitors/day to checkout. How long should we run?

**Claude's calculation:**

**Sample size calculation:**
- Baseline: 3.2%
- Target: 3.68% (15% relative lift = 0.48% absolute)
- α = 0.05 (two-tailed), Power = 80%
- Required n per variant ≈ **4,950 users**
- Total sample needed: **9,900 users** (both variants)

**At 500 visitors/day:**
- 9,900 ÷ 500 = **~20 days minimum**

**My recommendation: run for 28 days (4 full weeks)**

Why 4 weeks, not 20 days:
1. Captures full weekly seasonality (checkout behaviour differs weekday vs. weekend)
2. Buffer for novelty effect — new checkout UI may look artificially good in week 1
3. Allows for 4 complete business cycles (Monday-Sunday)

**Before you launch:**
- Confirm your analytics tool records the "checkout visited" event and "purchase completed" event separately and correctly
- Set your success criteria now: "We ship if p < 0.05 AND lift ≥ 15% AND no regression in average order value"
- Do not look at results until day 28

**One watch-out:** If your 500 visitors/day figure includes mobile and desktop users, segment the results by device. Checkout flows behave very differently on mobile vs. desktop — a winning result overall could be masking a regression on one platform.

---
