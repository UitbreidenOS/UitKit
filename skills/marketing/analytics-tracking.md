---
name: analytics-tracking
description: "Analytics implementation: GA4, Mixpanel, Amplitude, PostHog event tracking, funnel analysis, retention cohorts, and attribution modelling"
updated: 2026-06-13
---

# Analytics Tracking Skill

## When to activate
- Setting up event tracking for a web app or marketing site
- Designing a measurement plan before implementing analytics
- Debugging broken or missing analytics data
- Building funnels to find conversion drop-offs
- Analysing retention cohorts to understand churn
- Choosing between analytics tools (GA4, Mixpanel, Amplitude, PostHog)

## When NOT to use
- Business intelligence or SQL-level data warehouse queries — that's a data-ml task
- A/B testing framework setup — use the experiment-designer skill
- Privacy/GDPR compliance audits for tracking — use the privacy-pia skill

## Instructions

### Measurement plan

```
Build a measurement plan for [product/site].

Product type: [SaaS / ecommerce / content site / mobile app]
Business goals: [what outcomes matter — signups, purchases, retention, engagement]
Current analytics setup: [GA4 / Mixpanel / Amplitude / PostHog / none]
Team: [developer + analyst / solo / marketing team]

Measurement plan structure:

1. North Star Metric:
   [The one number that best captures product health]
   e.g. Weekly Active Users / MRR / Activation Rate

2. Supporting metrics (level 2):
   [3-5 metrics that explain the North Star]

3. Key user events to track:
   For each event:
   - Event name: [snake_case, consistent naming]
   - Trigger: [what user action fires this]
   - Properties: [key attributes to capture — plan: string, amount: number, etc.]
   - Why: [what business question does this answer?]

4. Funnels to measure:
   - [Acquisition funnel: source → signup → activation]
   - [Core product funnel: login → key action → value moment]
   - [Monetisation funnel: trial → upgrade → retention]

5. Dashboards needed:
   - [Executive: MRR, churn, NPS]
   - [Product: activation rate, feature adoption, retention]
   - [Marketing: traffic, conversion, CAC by channel]

Produce the event tracking plan as a table:
Event | Trigger | Properties | Priority | Dashboard
```

### GA4 implementation

```
Set up GA4 event tracking for [website/app].

Site type: [marketing site / web app / ecommerce]
Framework: [Next.js / React / vanilla JS / WordPress]
Goals: [track these conversions — list]

Implementation plan:

1. Base setup:
   - Install GA4 via gtag.js or GTM (use GTM if marketers need to add tags later)
   - Configure data stream and measurement ID
   - Enable Enhanced Measurement for: scrolls, outbound clicks, file downloads, site search

2. Custom events to implement:
   Event: [name]
   Code:
   gtag('event', '[event_name]', {
     event_category: '[category]',
     event_label: '[label]',
     value: [optional numeric value],
     [custom_parameter]: '[value]'
   });
   Where to fire: [component / page / action]

3. Conversion events:
   Mark these as conversions in GA4 admin:
   - [signup_complete]
   - [purchase]
   - [demo_requested]
   Mark in: Admin → Events → Mark as conversion

4. Audiences for remarketing:
   - Trial users who didn't convert (visited /pricing 2+ times)
   - High-intent visitors (3+ pages, 2+ minutes)

5. Debug and verify:
   - GA4 DebugView: enable debug mode in GTM or add ?debug_mode=1
   - Realtime report: confirm events firing live
   - Check for duplicate events (fire once, not on every re-render)

Generate the implementation code for my framework.
```

### Funnel analysis

```
Analyse my conversion funnel and identify drop-offs.

Funnel steps: [list each step in order]
Example: Homepage → Signup page → Email confirmed → Dashboard → Feature used → Upgrade

Current conversion rates per step (if known): [X%]
Analytics tool: [GA4 / Mixpanel / Amplitude / PostHog]
Timeframe: [last 30 / 60 / 90 days]
Segments to compare: [mobile vs desktop / channel / plan type]

Analysis structure:
1. Overall funnel conversion (first step → last step): [X%]
2. Step-by-step drop-off:
   Step 1 → 2: [X% drop — high/medium/low compared to benchmarks]
   Step 2 → 3: [X% drop]
   [continue for each step]

3. Worst drop-off step: [which step loses the most people]
   Hypotheses for why:
   - [friction in the UI?]
   - [missing information?]
   - [technical bug?]
   - [expectation mismatch?]

4. Experiments to run:
   - [one change per hypothesis, measurable in analytics]

5. Segmentation insight:
   - Do mobile users drop at a different step than desktop?
   - Do paid ad visitors convert differently than organic?

Query to run in [tool]: [write the funnel query or steps to set it up]
```

### Retention cohort analysis

```
Run a retention cohort analysis for [product].

Analytics tool: [Mixpanel / Amplitude / PostHog / GA4 / raw SQL]
Retention definition: [user returned and did X within Y days]
Time window: [weekly / monthly cohorts]
Product age: [X months of data available]

Cohort analysis setup:
1. Define retention event: [the action that counts as "retained"]
   - Not just "logged in" — define meaningful engagement
   - e.g. "Used core feature", "created item", "sent message"

2. Build cohort table:
   - Rows: signup cohorts (week or month of first use)
   - Columns: Day 1, Day 7, Day 14, Day 30, Day 60, Day 90
   - Cell: % of users who returned on that day

3. Interpret the shape:
   - Flat curve after Day 14: product has found its retention floor (good)
   - Continuous decline with no floor: product-market fit problem
   - Steep Day 1 drop: onboarding problem, not retention
   - Recent cohorts better than older: improvement trend (good)

4. Identify which cohorts retain best:
   - By acquisition channel (organic vs paid)
   - By signup feature used in first session
   - By plan or segment

5. Intervention experiment:
   Based on drop-off at Day [X], test: [email / in-app nudge / feature highlight]

Write the query for [tool] and interpret the results.
```

### Tool selection guide

```
Help me choose the right analytics tool.

Product stage: [pre-launch / early growth / scaling]
Team: [solo / 2-5 / 5+]
Technical resources: [developer available / no-code only]
Budget: $[X/month]
Primary need: [product analytics / marketing attribution / ecommerce / BI]
Data privacy requirements: [GDPR / HIPAA / no special requirements]

Compare:

GA4 — Best for: marketing sites, ecommerce, Google Ads integration. Free. Limited product analytics depth.

Mixpanel — Best for: SaaS product analytics, funnel and retention analysis. Starts free (limited events).

Amplitude — Best for: larger product teams, cohort analysis, predictive analytics. Free tier available.

PostHog — Best for: self-hosted option, feature flags + analytics in one, open source. Free up to 1M events/month.

Plausible / Fathom — Best for: privacy-first, no cookie consent needed, simple traffic metrics. $9-14/month.

Heap — Best for: retroactive event capture (no pre-planning needed), enterprise.

Recommendation for my situation: [tool + why + cost at my scale]
```

## Example

**User:** Our SaaS has a 23% trial-to-paid conversion, but we don't know where people drop. We use PostHog. Help me set up funnel tracking.

**Claude's plan:**

**Funnel to build in PostHog:**
1. Trial signup complete → 2. Dashboard first load → 3. Core feature used (define: "project created") → 4. Invited a team member → 5. Upgrade to paid

**PostHog funnel setup:**
In PostHog: Insights → Funnels → add these 5 steps in order. Set conversion window: 14 days (length of your trial).

**Prediction for where you'll see the drop:**
- Step 1→2 (signup → dashboard): usually 85-95%. If lower, email confirmation is broken or slow.
- Step 2→3 (dashboard → first action): this is typically the biggest drop (40-60%). Empty state friction.
- Step 3→4 (solo use → team invite): 15-30% invite rate is normal for team tools.
- Step 4→5 (active → paid): if activation (steps 1-4) is complete, 50-70% should convert.

**First experiment:** Add a "quick start" checklist in the empty dashboard state with 3 tasks. Each task completion event = tracked. Empty state is the #1 lever at step 2→3.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
