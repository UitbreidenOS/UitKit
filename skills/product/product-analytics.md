---
name: product-analytics
description: "Product analytics: define metrics frameworks, build dashboards, analyse feature adoption, measure activation and retention, interpret data to make product decisions"
updated: 2026-06-13
---

# Product Analytics Skill

## When to activate
- Deciding which metrics to track for a product or feature
- Analysing why a feature has low adoption after launch
- Building a product metrics dashboard from scratch
- Interpreting retention or activation data to find problems
- Preparing a data-informed product review or roadmap decision
- Designing a metrics framework (North Star, L1/L2 hierarchy)

## When NOT to use
- Setting up the analytics infrastructure — use the analytics-tracking skill
- A/B test design and statistics — use the experiment-designer skill
- Marketing attribution analysis — that's paid-ads or analytics-tracking

## Instructions

### Metrics framework design

```
Design a metrics framework for [product].

Product: [describe]
Stage: [pre-PMF / growing / scaling]
Business model: [subscription / usage-based / freemium / marketplace]
Team size: [1-5 / 6-20 / 20+]

Metrics hierarchy:

Level 0 — North Star Metric (1 metric):
[The single metric that best represents value delivered to users]
Must be: leading indicator of revenue, measurable, actionable by the team
Examples: DAU, weekly active projects, messages sent, reports generated

Level 1 — Pillar metrics (3-5 metrics):
[The components that explain the North Star]
Framework: Acquisition, Activation, Retention, Referral, Revenue (AARRR)

Level 2 — Diagnostic metrics (for each pillar):
[Metrics that help diagnose why a L1 metric is moving]

Example framework for a B2B SaaS tool:
NSM: Weekly Active Teams (teams with ≥ 3 members who used core feature this week)
L1: 
  - New teams signed up (Acquisition)
  - % who invited 3+ members in week 1 (Activation)
  - % retained at week 4 (Retention)
  - Net Revenue Retention (Revenue)
L2 (for Activation):
  - Time to first core action
  - % who completed onboarding checklist
  - Invite sent rate in session 1

Design the framework for my product. Include: what to NOT track (vanity metrics).
```

### Feature adoption analysis

```
Analyse adoption for [feature].

Feature: [describe what it does]
Launch date: [X weeks/months ago]
Current adoption rate: [X% of eligible users have used it]
Target adoption rate: [X%]
Analytics tool: [Mixpanel / Amplitude / PostHog / GA4]

Adoption analysis framework:

1. Define "adopted":
   □ First use? (awareness) — too loose
   □ Used X times? (engagement) — better
   □ Used in X% of sessions? (habit) — best
   [Set clear adoption threshold before analysing]

2. Funnel from feature discovery to adoption:
   - Saw feature entry point: [X%]
   - Clicked / initiated: [X%]
   - Completed first use: [X%]
   - Returned and used again: [X%]
   - "Adopted" (by your definition): [X%]

3. Segmentation (which users adopt vs. don't):
   - By user role / plan / company size
   - By activation cohort (newer vs. older users)
   - By primary use case or workflow

4. Barriers to adoption (qualitative):
   - Is the feature discoverable? (check: do users even know it exists?)
   - Is the value immediately clear? (first use experience)
   - Does it require setup or prerequisite state?
   - Is there a competing workflow already in use?

5. Recommendations by drop-off point:
   - Low awareness → in-app announcement, tooltip, email
   - Low first-use completion → simplify the UI or add guided setup
   - Low repeat use → check if core value was delivered in first use

Query to run in [analytics tool] + interpretation of results.
```

### Retention analysis

```
Analyse retention data and identify improvement opportunities.

Product: [describe]
Retention definition: [user did X within Y days]
Current D1/D7/D14/D30 retention: [X% / X% / X% / X%]
Benchmark for your category: [look up your vertical — varies widely]
Analytics tool: [tool]

Retention analysis steps:

1. Shape analysis:
   - Flattening curve: retention reaches a floor → product has core retention (good)
   - Continuously declining: no retention floor → PMF problem, not an optimization problem
   - Step-function drop at specific day: something happens at that moment (trial expires? email stops? feature limit hit?)

2. Cohort comparison:
   - Compare weekly cohorts — are recent cohorts retaining better than older ones?
   - Improving: your changes are working
   - Declining: something regressed (feature degraded, competition improved)
   - Flat: no improvement, no regression

3. Segment retention:
   Which users retain best?
   - Channel (organic vs paid — organic typically retains 2-3x better)
   - Feature usage (users who used feature X retain at Y% vs Z% for non-users)
   - Onboarding path (completed checklist vs didn't)
   - Company size or plan

4. Identify the "activation feature":
   Find the event/feature that correlates highest with day-30 retention.
   Run: event correlation → retention analysis in Amplitude or Mixpanel
   Make this feature part of the onboarding flow.

5. Intervention design:
   D1 drop (< 40% return day 1): onboarding problem
   D7 drop: habit formation problem (push notifications, email, in-app nudge)
   D30 drop: value deepening problem (new features, integrations, team expansion)

Analyse my retention data and recommend the highest-leverage intervention.
```

### Product review dashboard

```
Design a weekly product review dashboard for [product/team].

Team: [product / engineering / full company]
Frequency: [weekly / bi-weekly]
Goals: [make roadmap decisions / identify regressions / track OKR progress]

Dashboard sections:

1. North Star Metric (week over week):
   [Metric name]: [current value] vs [last week] vs [same week last month]
   Trend: ↑/↓ [X%] — [is this within expected range?]

2. Acquisition:
   New signups: [X] (week) / [X] (month) / [X target]
   CAC by channel: [organic / paid / referral]

3. Activation:
   Activation rate (defined as [X]): [X%] vs target [X%]
   Time to activation: p50 [Xh] / p90 [Xh]

4. Retention:
   D7 retention: [X%] / D30 retention: [X%]
   Weekly active users trend: [sparkline data]

5. Revenue:
   MRR: $[X] — [+/-X% WoW]
   New MRR: $[X] / Expansion: $[X] / Churn: $[X]
   Net MRR change: $[X]

6. Product health:
   Top feature by usage this week: [X]
   Feature adoption on recent launches: [names + %)
   Support volume: [X tickets] — [trend]

7. Experiments:
   Running: [test name] — [days remaining] — [current result]
   Concluded this week: [test name] — [result] — [decision]

8. Key questions for this week:
   - [What changed and why?]
   - [What needs a decision?]
   - [What do we not know yet?]

Build this dashboard in [Mixpanel / Amplitude / PostHog / Metabase / Notion].
```

## Example

**User:** Our SaaS (B2B, team collaboration tool) has 35% D30 retention. We think it's an activation problem. Analytics in Mixpanel. What should we investigate?

**Claude's analysis plan:**

35% D30 for a B2B collaboration tool is below typical (45-60% for the category). But "activation problem" is a hypothesis — let's validate it before fixing.

**Step 1 — Confirm the drop-off location in Mixpanel:**
Build this funnel: Signup → First login → Team invite sent → Core feature used × 3 → D30 retained.

If retention rate for users who complete all funnel steps is > 60%, the problem IS activation (not product value). You have a good product that most users never experience.

**Step 2 — Find the activation predictor:**
In Mixpanel: Retention → Compare by "Did event X in first 7 days." Test these events:
- Invited a team member → retained at D30?
- Used [core feature] 3+ times → retained at D30?
- Connected an integration → retained at D30?

The event with the highest D30 retention correlation = your aha moment. Make this the activation goal.

**Step 3 — Find the barrier:**
If the activation event is "team invite sent" and only 22% of signups send one in week 1, the question is: why don't they invite their team?

Segment by: solo signups vs. team signups. If solo signups retain at 15% and team signups at 58%, the problem is you're acquiring too many solo users, not that your activation flow is broken.

**Decision tree output:**
- Low activation rate + high post-activation retention → fix the activation flow
- High activation rate + low retention → fix the product value or target segment
- Low activation + low post-activation retention → deeper discovery needed

---
