---
name: experiment-tracker
description: "A/B test tracker: hypothesis writing, sample size calculator, results analysis, and statistical significance interpretation for growth experiments"
updated: 2026-06-13
---

# Experiment Tracker Skill

## When to activate
- Running an A/B test and need a structured hypothesis and success metrics before launch
- Calculating sample size and test duration before starting an experiment
- Analysing test results and determining if you've reached statistical significance
- Documenting experiment learnings for the team or experiment log
- Prioritising which experiments to run next based on ICE or RICE scoring
- A test has concluded and you need to decide: ship, kill, or iterate

## When NOT to use
- Full experiment design from scratch — use `/experiment-designer` for that
- Analytics setup and event tracking — use `/analytics-tracking`
- Interpreting qualitative research or user interviews — different methodology
- When your sample size is too small to run any valid test (< 100 conversions per variant expected)

## Instructions

### Hypothesis writing framework

```
Write a structured experiment hypothesis for my A/B test.

Test idea: [describe the change you want to make]
Page / feature: [where in the product or funnel]
Current state: [what exists today]
Proposed change: [what you want to test]

Produce a hypothesis in this format:

We believe that [CHANGE]
for [AUDIENCE SEGMENT]
will result in [EXPECTED OUTCOME]
because [MECHANISM / REASONING]
We'll know this is true when [MEASURABLE SUCCESS CRITERIA]
and the test has reached [MINIMUM SAMPLE SIZE] conversions per variant
with [95%] statistical confidence.

Also produce:
- Primary metric: [the one metric that determines win/loss]
- Secondary metrics: [guardrail metrics — must not regress]
- Minimum detectable effect (MDE): [smallest improvement worth shipping]
- Risk: [what could go wrong — novelty effect, segment interaction, etc.]
```

### Sample size calculator

```
Calculate the required sample size for my A/B test.

Test type: [conversion rate / revenue per user / retention / engagement]
Current baseline rate: [X%] (e.g., current conversion rate)
Minimum detectable effect (MDE): [X%] (relative improvement worth detecting)
  — Conservative: 5-10% relative lift (need large sample)
  — Moderate: 15-20% relative lift (typical)
  — Aggressive: 30%+ relative lift (small sample, only detect large changes)
Statistical significance: [95%] (standard) or [90%] (acceptable for low-stakes tests)
Statistical power: [80%] (standard) or [90%] (high-stakes tests)
Number of variants: [2] (A vs. B) or [3+] (multi-variant — divide by n-1)

Calculation:

For conversion rate tests, use the two-proportion z-test:

Required n per variant = (z_α/2 + z_β)² × [p1(1-p1) + p2(1-p2)] / (p1 - p2)²

Where:
- p1 = baseline rate
- p2 = baseline rate × (1 + MDE)
- z_α/2 = 1.96 (95% significance)
- z_β = 0.842 (80% power)

Provide:
- Required conversions per variant: [N]
- Required visitors per variant (at current conversion rate): [N]
- Expected test duration at [current traffic] per day: [X days / weeks]
- Warning if duration > 8 weeks (seasonal effects will contaminate results)
- Warning if conversions per variant < 100 (test is underpowered — increase MDE or wait)

Show me the numbers for my test.
```

### Pre-launch checklist

```
Run a pre-launch check on my A/B test before I start it.

Test name: [name]
Tool: [Optimizely / VWO / LaunchDarkly / GrowthBook / custom]
Hypothesis: [from hypothesis framework above]
Sample size needed: [N per variant]
Expected traffic per day: [N visitors]
Expected test duration: [X days]

Pre-launch checklist:

TRACKING
□ Primary metric is tracked correctly (event fires on conversion, not page load)
□ Secondary/guardrail metrics are tracked (revenue, session length, error rate)
□ Test assignment event is tracked (so you can segment by variant in analytics)
□ No existing funnel breaks or bugs on the control — test a broken baseline = invalid results
□ QA in staging: confirm variant displays correctly across browsers + mobile

SETUP
□ Traffic split confirmed: [50/50 or X/Y — document the split]
□ Targeting rules documented: [who is included / excluded]
□ Mutual exclusivity: does this test conflict with any other running test?
□ Holdback if needed: if test affects revenue significantly, keep 5-10% out of all tests

DURATION
□ Run for at least 2 full business cycles (minimum 2 weeks — never stop at first significance)
□ Do not peek at results daily and stop early — this inflates false positive rate
□ Set a hard stop date: [date] — do not extend without a documented reason

RISK
□ Can you roll back the variant instantly if a guardrail metric crashes?
□ Is there a novelty effect risk? (new UI = short-term lift that doesn't persist)
□ Will this test segment interact with another test? Map your test matrix.

Sign off when all boxes checked.
```

### Results analysis

```
Analyse my A/B test results and tell me what to do.

Test: [name]
Duration: [X days]
Tool: [analytics platform]

Results:
Control (A):
- Visitors: [N]
- Conversions: [N]
- Conversion rate: [X%]
- Revenue per visitor (if applicable): $[X]

Variant (B):
- Visitors: [N]
- Conversions: [N]
- Conversion rate: [X%]
- Revenue per visitor (if applicable): $[X]

Relative lift: [(B-A)/A × 100]%
P-value: [X] (from your test tool)
Confidence: [X%]
Statistical significance reached: [Yes / No]

Analysis:

DECISION FRAMEWORK:
1. Is the result statistically significant at 95%?
   YES → proceed to business impact analysis
   NO → check: did you reach your required sample size?
     - If yes + no significance: the effect is smaller than MDE → likely not worth shipping
     - If no: extend the test or accept you cannot detect an effect this small

2. Is the lift meaningful in dollar terms?
   Annual revenue impact of this lift = [calculation]:
   Lift × daily conversions × average order value × 365 = $[X]/year
   If annual impact < cost to implement permanently, reconsider.

3. Did any guardrail metrics regress?
   Revenue per visitor, session length, error rate, support contacts?
   If yes: do NOT ship even if primary metric is positive. A lift in signups that doubles support contacts is not a win.

4. Segment analysis — does the lift hold across:
   - Mobile vs. desktop?
   - New vs. returning users?
   - Traffic source (paid vs. organic)?
   - Geography?
   Significant interaction effects suggest the variant works for a segment, not universally.

DECISION: [SHIP / KILL / SEGMENT-SHIP / ITERATE]
Reasoning: [specific, based on the numbers]
Next experiment: [what to test next based on these results]
```

### Experiment log template

```
Document this experiment for the team experiment log.

Experiment: [name — searchable, descriptive]
Date: [start] → [end]
Owner: [name]
Team: [growth / product / marketing]
Status: [running / concluded]

## Hypothesis
[From hypothesis framework]

## Setup
- Tool: [Optimizely / VWO / custom]
- Traffic split: [50/50]
- Audience: [all users / new users / mobile / etc.]
- Targeting: [URL, segment, feature flag]

## Results
| Metric | Control | Variant | Lift | Significance |
|---|---|---|---|---|
| Primary: [metric] | [X%] | [X%] | [+X%] | [95%] |
| Guardrail: [metric] | [X] | [X] | [+/-X%] | [N/A] |
| Guardrail: [metric] | [X] | [X] | [+/-X%] | [N/A] |

Sample: [N] per variant | Duration: [X days] | P-value: [X]

## Decision
[SHIPPED / KILLED / ITERATED]
Rationale: [why]

## Learning
[What this tells us about user behaviour — not just "variant won"]
[What to test next]

## Annual impact (if shipped)
$[X] incremental revenue or [X%] metric improvement
```

### Experiment prioritisation

```
Prioritise my experiment backlog using ICE scoring.

My experiment ideas:
1. [Idea 1]
2. [Idea 2]
3. [Idea 3]
[add as many as needed]

Score each on ICE:

IMPACT (1-10): If this works at the expected lift, how big is the revenue/metric impact?
- 10: >$100K annual impact or >20% lift on a key metric
- 7: $20-100K or 10-20% lift
- 4: $5-20K or 5-10% lift
- 1: <$5K or <5% lift

CONFIDENCE (1-10): How sure are we this will work?
- 10: Prior data, user research, and proven elsewhere all point to this
- 7: Strong qualitative signal or similar test worked in adjacent area
- 4: Theory-based, no direct evidence
- 1: Pure gut feeling

EASE (1-10): How fast can we run this test?
- 10: Copywriting change only, no dev needed, live in 1 day
- 7: Minor frontend change, 1-2 days dev
- 4: Backend or logic change, 1 week dev
- 1: Architecture change, 4+ weeks dev

ICE Score = (Impact + Confidence + Ease) / 3

Rank all ideas by ICE score. Flag any that require >2 weeks of engineering as High Effort — evaluate if they should go in the product backlog instead.

Produce ranked experiment calendar for next 4 weeks.
```

## Example

**User:** I want to test changing our pricing page CTA from "Start Free Trial" to "See Pricing" because I think users want to see numbers before committing. Baseline conversion is 3.2%. What sample size do I need and how do I set this up?

**Claude's output:**

**Hypothesis:**
We believe that changing the primary CTA from "Start Free Trial" to "See Pricing"
for all visitors landing on /pricing
will result in a higher click-through rate to the checkout or plan selection page
because users in a price-comparison mindset want to see numbers before committing to a "trial" framing.
We'll know this is true when the CTA click rate increases by ≥ 15% (relative)
with 95% statistical confidence and 80% power.

**Sample size calculation:**
- Baseline: 3.2% CTA click rate
- MDE: 15% relative = 3.68% target rate
- Required: **2,843 visitors per variant** (5,686 total)
- At 500 visitors/day on the pricing page: **12-day test**
- At 200 visitors/day: **29-day test** — run it, worth the wait

**Pre-launch:**
- Confirm CTA click event fires in analytics (not page load)
- Track: plan selection page views (guardrail — should not drop)
- Track: trial signups (the real downstream metric — segment by variant in your analytics tool)
- Do not stop early — even if you hit significance in week 1, run the full 2 weeks

**What to watch:**
If "See Pricing" wins on clicks but trial signups don't increase, users are more curious but not more committed. That's a pricing clarity problem, not a CTA problem — next test is the pricing page itself.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
