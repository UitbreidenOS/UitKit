---
name: email-ab-tester
description: "Email A/B test design and analysis: hypothesis, variants, sample size, results interpretation"
---

# Email A/B Tester Skill

## When to activate
- You want to improve open rate, click rate, or conversion on email campaigns
- You need to choose between two subject lines, CTAs, or email structures
- You have results from a split test and want to know if they're statistically meaningful
- Building a long-term optimisation backlog of email hypotheses to test
- You ran an A/B test and aren't sure how to interpret "winner" vs. "noise"

## When NOT to use
- Your list is under 1,000 subscribers — you won't have statistical significance without enough volume; optimise with qualitative methods instead
- Testing entirely different campaigns (different offers, different audiences) — that's a strategy change, not an A/B test
- Testing more than one variable at a time (unless you explicitly want multivariate) — isolate the variable or your results are uninterpretable
- You already know what works — don't test to confirm, test to learn

## Instructions

### A/B test design prompt

```
Design an A/B test for my email campaign.

Campaign type: [newsletter / promotional / automated sequence / transactional]
List size available for the test: [X subscribers]
Primary goal: [open rate / click rate / conversion / revenue per email]
What I want to test: [subject line / sender name / send time / CTA / email length / format / offer framing]

Current benchmark:
- Average open rate: [X%]
- Average click rate: [X%]
- Average conversion rate: [X%]

What I believe is true (hypothesis): [e.g., "A curiosity-based subject line will outperform a direct benefit subject line for this segment because our audience is research-oriented"]

Design the test:

## Hypothesis
If/Then/Because structure:
If [change], Then [metric] will [increase/decrease] by [X%], Because [reason based on what you know about the audience].

Why this format matters: "just trying different subject lines" isn't a hypothesis — it's random variation. A proper hypothesis forces you to understand why something might work, so you learn even when the test fails.

## Variable to test (isolate ONE)
What exactly changes between A and B:
Variant A (control): [current version / specific text]
Variant B (challenger): [new version / specific text]

What stays identical:
- Send time: same
- From name: same
- Email body: same
- Audience segment: same
- Everything else: same

## Sample size calculation
Using a 95% confidence level and 80% statistical power:

Baseline conversion rate (current metric): [X%]
Minimum detectable effect (MDE): [% improvement you need to see for it to be worth acting on — e.g., 10% relative improvement]
Required sample per variant: [calculate or Claude will calculate]
Total subscribers needed: [2 × per-variant sample]
Note: if your list is smaller than this, the test may be underpowered.

Quick reference (for open rate tests, baseline 25%):
To detect a 10% relative improvement (25% → 27.5%): ~3,800 per variant
To detect a 20% relative improvement (25% → 30%): ~950 per variant
To detect a 30% relative improvement (25% → 32.5%): ~430 per variant

## Test execution plan
1. Segment the test audience randomly (not by engagement — that biases results)
2. Send both variants simultaneously (same time, same day — or within 1 hour)
3. Wait for statistical significance before declaring a winner
4. Do not peek early and declare a winner based on 4 hours of data — that inflates false positives

## What to measure
Primary metric: [the one metric your hypothesis is about]
Secondary metrics: [watch these, but don't make decisions based on them alone]
Guardrail metrics: [metrics you don't want to hurt — e.g., unsubscribe rate]

## Decision rule
If Variant B outperforms Variant A by the MDE at 95% confidence → adopt B
If results are not significant → the test is inconclusive — do not call it a tie
If Variant A wins → understand why B failed before testing a different challenger
```

### Subject line A/B variants generator

```
Generate A/B test variants for subject lines.

Email content: [describe what the email is about]
Target audience: [who they are and what they care about]
Brand voice: [formal / conversational / playful / direct]
Current best-performing subject line: [paste it — or describe what you've tried]

Generate 5 pairs of subject line variants, each testing a different psychological lever:

Pair 1 — Direct benefit vs. Curiosity
A: [states the benefit plainly]
B: [creates a curiosity gap or open loop]

Pair 2 — Personalisation vs. Social proof
A: [uses recipient name or segment]
B: [references a crowd or authority]

Pair 3 — Specific number vs. Conceptual headline
A: [specific data point or number]
B: [benefit without the number]

Pair 4 — Question vs. Statement
A: [asks the reader something]
B: [makes a direct claim]

Pair 5 — Short (< 35 chars) vs. Descriptive (40-55 chars)
A: [punchy, under 35 characters]
B: [more descriptive, under 55 characters]

For each pair, identify:
- What hypothesis it tests
- What a win for A means vs. a win for B means for future strategy
- Preview text to pair with each subject line
```

### A/B test results interpreter

```
Interpret my A/B test results.

Test details:
- What was tested: [subject line / CTA / send time / etc.]
- Variant A (control): [description]
- Variant B (challenger): [description]
- Sample size: Variant A: [X emails], Variant B: [X emails]
- Result:
  - Variant A: [metric, e.g., 24.3% open rate]
  - Variant B: [metric, e.g., 27.1% open rate]
- Test duration: [X hours / X days]
- Confidence level reported by platform (if any): [X%]

Interpret:

## Is this result statistically significant?
Calculate (or verify platform's calculation):
- Relative improvement: ([B - A] / A) × 100 = X%
- Two-proportion z-test:
  p1 = Variant A rate, n1 = Variant A sends
  p2 = Variant B rate, n2 = Variant B sends
- p-value interpretation:
  p < 0.05: statistically significant at 95% confidence → safe to act
  p 0.05-0.10: marginally significant → proceed with caution, retest
  p > 0.10: not significant → do not act on this result

## Practical significance
Even if statistically significant, is the improvement meaningful?
- How many additional opens/clicks per 1,000 sends?
- What's the projected annual impact if you apply this to your full programme?

## Common interpretation mistakes to avoid
1. Declaring winner early: Many platforms show "winner" within hours. Ignore until the full send is complete.
2. Confounding by time: Did A go out Monday morning and B go out Friday afternoon? Time differences invalidate results.
3. Sample contamination: Did some subscribers receive both variants? This happens with re-engagement segments.
4. Multiple testing problem: If you tested 10 subject lines and "found" a winner, the probability of a false positive is high. Correct for this.

## What to do with this result
If B wins (significant): [specific action — update template, document the learnable principle, apply to next campaign]
If inconclusive: [what to test next — larger sample, bigger variant difference, different metric]
If A wins (B is worse): [record WHY — what does this tell you about the audience? What principle does this confirm or deny?]

## Learning to record
Every A/B test result — win, lose, or inconclusive — should add to your email knowledge base:
Hypothesis tested: [repeat the hypothesis]
Result: [what happened]
Principle extracted: [1 sentence generalisation, e.g., "Our audience responds to specificity — numbers outperform conceptual statements"]
Applies to: [subject lines / CTAs / body copy / all email]
```

### Email A/B testing backlog builder

```
Build a 90-day A/B testing backlog for my email programme.

My current email programme:
- List size: [X]
- Send frequency: [X emails/week or month]
- Average open rate: [X%]
- Average click rate: [X%]
- Average conversion rate: [X%]
- Biggest gap: [open rate / click rate / conversion — where do you lose the most?]

Generate a prioritised backlog of 10 tests, ordered by:
1. Potential impact on your biggest gap
2. Ease of execution
3. Learning value (even if the result is negative)

For each test:
- Test name and hypothesis
- What metric it targets
- Sample size required
- Time to run
- What you learn regardless of outcome

Prioritisation rule:
- Fix the top of the funnel first (open rate) before optimising mid-funnel (click rate)
  because a 10% lift in open rate improves every downstream metric automatically
- Test one variable per send — don't mix subject line + CTA changes in the same test
- Space tests at least 2 weeks apart to avoid learning contamination

Output as a calendar: 
Month 1 (foundation): test open rate variables
Month 2 (engagement): test click rate variables
Month 3 (conversion): test landing/conversion variables
```

### Multivariate test guide (advanced)

```
Design a multivariate email test.

IMPORTANT: multivariate testing requires minimum 10x the sample size of a simple A/B test.
Only use if you have a very large list (> 100k sends available) and can tolerate the complexity.

Variables to test:
Variable 1: [e.g., subject line — 2 variants]
Variable 2: [e.g., CTA text — 2 variants]
Variable 3: [e.g., hero image — 2 variants]

Number of combinations: 2³ = 8 test cells
Minimum sample per cell: [calculated based on baseline metric and MDE]
Total sample required: [8 × per-cell minimum]

Explain why most teams should NOT run multivariate tests:
1. Sample size requirement is prohibitive for most lists
2. Interaction effects between variables are hard to interpret
3. Winning cell may not generalise — you can't isolate what caused the win
4. Better to run 3 sequential A/B tests than 1 multivariate test
   (Sequential tests lose some speed but gain interpretability)

Recommended instead: Factorial A/B testing (sequence of 3 tests, apply winner each time).
```

### Statistical significance calculator reference

```typescript
// Two-proportion z-test for email A/B results
function calculateSignificance(
  variantARate: number,   // e.g., 0.243 for 24.3%
  variantASize: number,   // e.g., 5000
  variantBRate: number,   // e.g., 0.271
  variantBSize: number    // e.g., 5000
): { zScore: number; pValue: number; significant: boolean } {

  const pCombined = (variantARate * variantASize + variantBRate * variantBSize)
    / (variantASize + variantBSize)

  const standardError = Math.sqrt(
    pCombined * (1 - pCombined) * (1/variantASize + 1/variantBSize)
  )

  const zScore = (variantBRate - variantARate) / standardError
  // Convert zScore to p-value using normal distribution
  // |z| > 1.96 = p < 0.05 = 95% confidence
  // |z| > 2.576 = p < 0.01 = 99% confidence

  return {
    zScore,
    pValue: /* normal CDF calculation */ 0,
    significant: Math.abs(zScore) > 1.96
  }
}

// Minimum detectable effect (MDE) at 95% confidence, 80% power
function minimumSampleSize(
  baselineRate: number,
  mde: number  // relative improvement as decimal, e.g., 0.10 for 10%
): number {
  const p1 = baselineRate
  const p2 = baselineRate * (1 + mde)
  // Standard formula: n = 16 * p(1-p) / (p2-p1)^2 (approximate)
  return Math.ceil(16 * p1 * (1 - p1) / Math.pow(p2 - p1, 2))
}
```

## Example

**User:** My subject line test had 5,200 sends per variant. Variant A (direct): "Your Q4 results are ready" got 24.8% open rate. Variant B (curiosity): "We found something surprising in your data" got 28.2% open rate. Is this real?

**Interpretation:**

```
## Result Summary
Relative improvement: (28.2 - 24.8) / 24.8 = +13.7%
Absolute improvement: +3.4 percentage points

## Statistical Test
n = 5,200 per variant
Combined rate: (0.248 × 5200 + 0.282 × 5200) / 10400 = 0.265
Standard error = √(0.265 × 0.735 × (1/5200 + 1/5200)) = 0.00869
Z-score = (0.282 - 0.248) / 0.00869 = 3.91

p < 0.0001 — highly significant. This is not noise.

## Practical Significance
At 5,200 sends: +177 additional opens per campaign
Applied to your full list (assuming 20k sends/campaign): +680 opens
At 2% CTR on opens, that's +14 additional clicks per campaign.

## Decision
Adopt Variant B for this type of email: "something unexpected in your data" frame.
This is a curiosity gap pattern — you're not giving them the answer in the subject line.

## Principle to Record
"Curiosity gap subject lines outperform direct benefit subject lines by ~14% 
for data/results-type emails. Audience wants to know what was surprising —
the unanswered question drives the open."

## Caveat
This was one test. Validate with a second test on a different campaign before treating
this as a universal rule. Principles generalise; single test results might not.
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
