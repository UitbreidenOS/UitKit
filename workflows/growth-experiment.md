# Growth Experiment Workflow

End-to-end process for running a disciplined growth experiment — from idea to documented learning — using Claude Code at every step.

---

## Overview

This workflow covers the full lifecycle of a single growth experiment:

1. Idea capture and prioritisation
2. Hypothesis and success criteria
3. Sample size and duration planning
4. Pre-launch checklist
5. Monitoring during the test
6. Results analysis and decision
7. Documentation and learning

**Total time with Claude Code:** 45-90 minutes across the experiment lifecycle (vs. 4-6 hours done manually)

**Who runs this:** Growth marketer, product manager, or CRO specialist

---

## Phase 1 — Idea capture and prioritisation

**Trigger:** New experiment idea generated (from funnel analysis, user research, team brainstorm, competitive research)

**Step 1.1 — Write the idea card**

Every experiment idea gets a one-paragraph card before it's prioritised:

```
/experiment-tracker

New experiment idea:
- What: [describe the change in one sentence]
- Where: [page / flow / email / ad / feature]
- Why we think it'll work: [the mechanism — user behaviour or psychology reason]
- Metric it affects: [which KPI]
- Effort to run: [low / medium / high — dev days needed]
- Data needed to validate: [sample size estimate if known]
```

**Step 1.2 — Score and rank against backlog**

At the start of every sprint or monthly planning cycle, run ICE scoring across the full backlog:

```
/experiment-tracker

Score my experiment backlog with ICE (Impact, Confidence, Ease):

Backlog:
1. [Idea 1]
2. [Idea 2]
3. [Idea 3]
[list all]

Current traffic and conversion context: [paste relevant metrics so scoring is calibrated]

Produce: ranked ICE table, recommended next 4 experiments to run, and flag any ideas
that require more data or research before scoring.
```

**Output of Phase 1:**
- Prioritised backlog with ICE scores
- Next 2-4 experiments selected for planning

---

## Phase 2 — Hypothesis and success criteria

**Do this before any design, development, or test setup**

**Step 2.1 — Write the formal hypothesis**

```
/experiment-tracker

Write the formal experiment hypothesis for [experiment name].

The change: [specific description — what is changing, exactly?]
The audience: [who sees the variant — all users / new users / mobile / paid]
The metric: [primary conversion metric]
Baseline: [current rate — must be measured, not estimated]
Why we expect it to work: [the specific mechanism]
Minimum effect worth detecting: [X% relative improvement — what improvement justifies shipping?]

Produce: formal hypothesis statement, primary metric, secondary/guardrail metrics,
and MDE rationale.
```

**Step 2.2 — Define success and failure**

Before starting the test, document what each outcome means:

- **Win condition:** Primary metric improves by ≥ [MDE] at 95% confidence and no guardrail metrics regress
- **Loss condition:** No significant improvement after required sample size is reached
- **Inconclusive:** Reached sample size, result is between [MDE / 2] and [MDE] — discuss before deciding
- **Stop early condition:** A guardrail metric drops > 10% at any time — stop immediately

Write these down before the test launches. Do not define them after seeing results.

**Output of Phase 2:**
- Signed-off hypothesis document
- Defined win/loss/stop conditions
- Primary metric + guardrail metrics agreed with stakeholders

---

## Phase 3 — Sample size and duration planning

**Step 3.1 — Calculate required sample size**

```
/experiment-tracker

Calculate required sample size for [experiment name].

Primary metric: [conversion rate / revenue per visitor / activation rate]
Baseline value: [X%]
Minimum detectable effect (MDE): [X% relative lift]
Statistical significance level: [95%]
Statistical power: [80%]
Number of variants: [2 — A vs B] or [3 — A, B, C]
Current daily traffic to this page / flow: [N visitors/day]
Current daily conversions: [N]

Produce:
- Required conversions per variant
- Required visitors per variant
- Expected test duration in days
- Warning flags: if duration > 8 weeks, segment interaction risks, traffic seasonality
```

**Step 3.2 — Set the calendar**

- Set a hard start date and hard end date
- Do NOT set a "check and stop early if significant" review — this inflates false positive rate
- Schedule the final results review as a calendar event before the test starts
- If the test needs to run through a known low-traffic period (holiday, event), extend duration accordingly

**Output of Phase 3:**
- Required sample size per variant documented
- Fixed start date and end date agreed
- Results review meeting scheduled

---

## Phase 4 — Pre-launch checklist

**Step 4.1 — Technical and tracking verification**

```
/experiment-tracker

Run the pre-launch checklist for [experiment name].

Test details:
- What's changing: [describe]
- Test tool: [Optimizely / VWO / GrowthBook / LaunchDarkly / custom]
- Primary metric tracking: [where and how the conversion event fires]
- Guardrail metrics: [how they're tracked]
- Traffic split: [50/50 or specify]
- Audience targeting rules: [who is included, who is excluded]
- Other tests running simultaneously: [list any live tests that could interact]

Run through:
□ Tracking — conversion event fires correctly (QA in staging, verify in analytics DebugView)
□ QA — variant renders correctly across desktop, mobile, major browsers
□ Mutual exclusivity — no conflict with other running tests
□ Rollback — variant can be disabled instantly if a guardrail crashes
□ Documentation — test is logged in experiment tracker with hypothesis and dates

Flag any items that need resolution before launch.
```

**Do not launch with an open item on this checklist.**

**Output of Phase 4:**
- All checklist items passed
- Test logged in experiment tracker
- Rollback procedure documented

---

## Phase 5 — Monitoring during the test

**Weekly check — do not make decisions during this phase**

The purpose of monitoring is to catch problems (guardrail crashes, tracking breaks), not to evaluate results early.

```
/experiment-tracker

Weekly monitoring check for [experiment name].

Running for: [X days of N planned]
Current results:
Control: [N visitors], [N conversions], [X%] conversion rate
Variant: [N visitors], [N conversions], [X%] conversion rate
P-value so far: [X]

Guardrail metrics:
- Revenue per visitor: Control [X] vs Variant [X]
- Session length: Control [X] vs Variant [X]
- Error rate: Control [X%] vs Variant [X%]

Question: Is there any reason to stop this test early?
(Stop early only if: guardrail metric crashes, tracking is broken, or a major product incident occurred)
```

**If guardrail crashes:** Stop the test immediately, roll back the variant, investigate root cause before continuing.

**If someone asks "are we winning yet?":** The answer is always "we don't know yet — we need [N] more conversions and [X] more days." Do not share partial results.

---

## Phase 6 — Results analysis and decision

**Run this on the end date — not before**

**Step 6.1 — Pull final results**

Export from your testing tool:
- Visitors per variant
- Conversions per variant
- Revenue per visitor (if applicable)
- P-value and confidence interval

**Step 6.2 — Analyse results**

```
/experiment-tracker

Analyse the results of [experiment name].

Duration: [start date] → [end date] ([X days])

Final results:
Control (A): [N] visitors, [N] conversions, [X%] rate, revenue per visitor $[X]
Variant (B): [N] visitors, [N] conversions, [X%] rate, revenue per visitor $[X]
P-value: [X]
Confidence: [X%]

Guardrail metrics (Control vs Variant):
- Revenue per visitor: [X] vs [X]
- [Guardrail 2]: [X] vs [X]
- [Guardrail 3]: [X] vs [X]

Statistical significance reached: [yes / no — based on required sample size]

Produce:
1. Decision: SHIP / KILL / SEGMENT-SHIP / ITERATE (with rationale)
2. Annual revenue impact of this lift (if shipping)
3. Segment breakdown — does lift hold for mobile, new users, paid traffic?
4. What this tells us about user behaviour (not just "variant won")
5. What to test next based on this learning
```

**Step 6.3 — Make the decision**

| Result | Action |
|---|---|
| Significant win + guardrails stable | SHIP — move to permanent implementation |
| Significant win + guardrail regression | No ship — investigate guardrail issue first |
| No significance, sample size reached | KILL — effect is smaller than MDE or nonexistent |
| No significance, sample size not reached | EXTEND — only if you have a clear timeline to reach it |
| Inconclusive effect (between MDE/2 and MDE) | Team decision with documented rationale |

---

## Phase 7 — Documentation and learning

**Do this within 24 hours of the decision**

**Step 7.1 — Write experiment log entry**

```
/experiment-tracker

Generate the experiment log entry for [experiment name].

Include:
- Experiment name, dates, owner, team
- Hypothesis (copy from Phase 2 doc)
- Results table: metric, control, variant, lift, significance
- Decision: [SHIPPED / KILLED / ITERATED]
- Rationale for the decision
- What this tells us about user behaviour
- What to test next
- Annual impact (if shipped): $[X]

Format: ready to paste into [Notion / Confluence / experiment log sheet].
```

**Step 7.2 — Share the learning**

Every concluded experiment gets a 2-minute Slack or standup summary — even if the test lost:

"[Experiment name] concluded. We tested [change]. Result: [win / loss / inconclusive] with [X%] confidence. Key learning: [one specific thing we learned about user behaviour]. Next test from this: [what we're running next as a result]."

Losing experiments are not failures — they're information. A null result tells you the mechanism you hypothesised doesn't work, which narrows the search space for what does.

---

## Experiment velocity targets

| Team size | Target velocity | Min velocity |
|---|---|---|
| Solo growth marketer | 2 tests/month | 1 test/month |
| 2-3 person growth team | 4-6 tests/month | 3 tests/month |
| 5+ person growth team | 8-15 tests/month | 6 tests/month |

Velocity matters more than win rate. A team running 4 losing tests per month learns faster than a team running 1 winning test per month — because losing tests generate hypotheses.

---

## Common failure modes

**Running tests that are too small to measure:** Always check sample size first. An underpowered test is worse than no test — it produces false answers.

**Stopping at first significance:** The p-value fluctuates early in a test. Let the full sample size complete.

**Running overlapping tests without exclusion logic:** Two tests on the same page interact. Use your test tool's exclusivity rules or segment audiences explicitly.

**No guardrail metrics:** A lift in signups that causes a 15% drop in revenue per visitor is not a win. Define guardrails before launch.

**Not documenting learning from losses:** "We killed it" is not a learning. "Users don't respond to urgency messaging in this context" is.

---
