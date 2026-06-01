# Claude for Growth Marketers

Everything a Growth Hacker or Performance Marketer needs to run AI-augmented experiments, optimise paid acquisition, analyse funnels, and report on growth — without waiting on data teams or engineering sprints.

---

## Who this is for

You are a growth marketer, performance marketer, or growth hacker responsible for moving metrics: signups, activation rates, paid CAC, conversion rates, MRR growth. You run experiments constantly, you live in spreadsheets and dashboards, and you're always time-constrained.

**Before Claude Code:** 3 hours to write an experiment brief and sample size calculation. 2 hours to build a weekly growth report. 45 minutes per A/B test documentation. Manual funnel analysis from raw data exports.

**After:** Experiment briefs in 5 minutes. Weekly growth narrative written and structured in 10 minutes. Sample size calculations instant. Funnel analysis structured and interpreted from your raw numbers. You focus on the decisions, Claude handles the synthesis.

---

## 30-second install

```bash
# Install the full growth marketer stack
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/analytics-tracking
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
npx claudient add skill product/experiment-designer
npx claudient add agent advisors/cmo-advisor
npx claudient add agent advisors/cro-advisor
```

---

## Your Claude Code growth stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/experiment-tracker` | Hypothesis writing, sample size calculator, results analysis, statistical significance | Every A/B test — before, during, and after |
| `/growth-dashboard` | Weekly AARRR dashboard with trend analysis and commentary | Monday morning metrics review |
| `/paid-ads` | Google, Meta, LinkedIn campaign structure, creative brief, ROAS optimisation | Any paid channel work |
| `/onboarding-cro` | Activation funnel analysis, onboarding sequence optimisation | When activation rate is the bottleneck |
| `/page-cro` | Landing page and conversion rate optimisation — copy, layout, CTA testing | Page-level conversion work |
| `/analytics-tracking` | GA4, Mixpanel, Amplitude, PostHog setup and funnel analysis | Analytics instrumentation |
| `/referral-program` | Referral mechanics, incentive structure, viral coefficient modelling | Building or improving referral |
| `/pricing-strategy` | Pricing page strategy, plan positioning, price testing | Pricing experiments |
| `/experiment-designer` | End-to-end experiment design: hypothesis, methodology, success metrics | Complex multi-variate experiments |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cmo-advisor` | Opus | Strategic channel mix, budget allocation, growth strategy decisions |
| `cro-advisor` | Sonnet | Specific conversion rate problems — what to test and why |

---

## Daily workflow

### Morning (30-45 minutes)

**1. Weekly growth dashboard — Monday only**
```
/growth-dashboard

Weekly growth metrics — week of [DATE]:

Acquisition:
- New signups: [N] (vs [N] last week)
- Paid spend: $[X]
- CAC by channel: Google $[X] | Meta $[X] | Organic $[X]

Activation:
- Activation rate: [X%] (vs [X%] last week)
- Time to aha moment (median): [X days]

Retention:
- 7-day retention: [X%]
- 30-day retention: [X%]
- DAU/MAU: [X%]

Revenue:
- MRR: $[X] (+$[X] WoW)
- Churned MRR: $[X]
- LTV:CAC: [X:1]

Experiments running:
- [Test name]: Day [X], lift [+/-X%], significance [X%]

Write me the dashboard with commentary, traffic light status, and recommended actions.
```

**2. Daily experiment check — takes 5 minutes**
```
/experiment-tracker

My live tests:
1. [Test name]: control [X%] vs variant [X%], [N] visitors each, running [X days]
2. [Test name]: control [X] vs variant [X], [N] visitors each, running [X days]

For each test:
- Have we reached statistical significance yet?
- Are we on track to conclude by [target date]?
- Any guardrail metrics showing concern?
- Should I extend, stop, or keep running?
```

---

### Midday — campaign and experiment work

**3. Paid acquisition optimisation**
```
/paid-ads

Channel: [Google / Meta / LinkedIn]
Current ROAS: [X] (target: [X])
Current CPA: $[X] (target: $[X])
Monthly spend: $[X]

This week's issues:
- [Describe what's underperforming and any changes made]

Diagnose the issue and give me 3 actions to improve ROAS this week.
```

**4. CRO — landing page or funnel**
```
/page-cro

Page: [URL or describe]
Current conversion rate: [X%]
Traffic source: [paid / organic / email]
Goal: [signup / purchase / demo request]
Top friction points I suspect: [describe]

Audit the page and give me the top 3 experiments to run ranked by expected impact.
```

---

### Experiment launch checklist

**Before launching any A/B test:**
```
/experiment-tracker

I'm about to launch this test. Run the pre-launch checklist.

Test: [describe the change]
Primary metric: [conversion rate / click rate / revenue per visitor]
Baseline: [X%]
MDE: [X% relative improvement I need to detect]
Traffic: [X visitors per day to this page/flow]
Tool: [Optimizely / VWO / GrowthBook / LaunchDarkly]

Confirm:
1. Sample size required (per variant)
2. Expected test duration
3. Pre-launch checklist (tracking, mutual exclusivity, rollback plan)
4. Any risks I should know about
```

---

### Friday — weekly experiment review

**5. Experiment portfolio review**
```
/experiment-tracker

Review my experiment portfolio this week.

Concluded tests:
[Test name]: control [X%] vs variant [X%], [N] per variant, p-value [X], ran [X days]
Decision I made: [shipped / killed]

Running tests:
[continue for each active test]

Backlog (unstarted):
1. [Idea 1] — estimated impact [high/med/low], effort [high/med/low]
2. [Idea 2]

Give me: ICE scores for the backlog, whether my concluded tests are documented correctly,
and what I should run next quarter.
```

---

## 30-day ramp plan (new growth marketers)

### Week 1 — Baseline measurement
- Install all skills via install commands above
- Connect your analytics tool (GA4, Mixpanel, Amplitude, or PostHog)
- Run `/analytics-tracking` to audit your current tracking — find what's broken or missing
- Run `/growth-dashboard` with historical data — establish your baseline numbers
- Map your full funnel: from traffic source to paying customer — every step

### Week 2 — Hypothesis backlog
- Run `/experiment-designer` and `/experiment-tracker` to score your hypothesis backlog
- Use ICE scoring to rank the top 5 experiments to run this quarter
- For each hypothesis: write a formal hypothesis, sample size calculation, and success criteria before touching any code
- Do not launch anything in week 2 — understand the baseline first

### Week 3 — First experiments
- Launch your top 2 experiments from the backlog
- Use `/paid-ads` to audit the current paid acquisition setup — find wasted spend
- Run a CRO audit with `/page-cro` on your highest-traffic conversion page
- Track: how long does it take to write an experiment brief? Track this weekly — it should drop to under 10 minutes by week 4

### Week 4 — Velocity and reporting
- Run your first full weekly growth dashboard from scratch
- Establish your experiment velocity: how many tests can your team run per month?
- Present to leadership: what are the top 3 growth levers and what are you running against each?
- Identify your analytics gaps — what can't you measure that you need to?

---

## Tool integrations

### Amplitude / Mixpanel / PostHog

These are your primary data sources for every Claude session. Connect them via MCP for live data access:

```json
// For PostHog — add to ~/.claude/settings.json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": ["-y", "@posthog/mcp-server"],
      "env": {
        "POSTHOG_API_KEY": "your-api-key",
        "POSTHOG_HOST": "https://app.posthog.com"
      }
    }
  }
}
```

With live analytics access, Claude can:
- Pull funnel conversion data by cohort, segment, or time window
- Query event counts and user properties without exporting to CSV
- Build retention tables on demand
- Identify segments with anomalous behaviour

### Google Ads and Meta Ads

Export performance data as CSV → paste into `/paid-ads` for analysis.
For automated reporting, connect via n8n or Make — pull weekly campaign data into a Notion page, then run `/growth-dashboard` against it.

### GrowthBook / LaunchDarkly (experiment platforms)

Export experiment results → paste into `/experiment-tracker` for statistical analysis and decision support.
Claude does not make ship/kill decisions — it surfaces the statistical picture and provides the framework. You make the call.

### Notion / Confluence (experiment log)

Use Claude to generate experiment documentation → paste into your team's experiment log after each concluded test. Consistent documentation is the single most important thing growth teams don't do.

---

## Metrics to track

| Metric | Definition | Green | Yellow | Red |
|---|---|---|---|---|
| Weekly experiment velocity | Tests launched per week | ≥ 2 | 1 | 0 |
| Win rate | % of experiments that show significant positive lift | 25-35% | 15-25% | < 15% or > 40% |
| Activation rate | % of new signups who complete aha moment | > 40% | 20-40% | < 20% |
| CAC payback period | Months to recover CAC from a cohort's gross margin | < 12 mo | 12-18 mo | > 18 mo |
| LTV:CAC ratio | Customer LTV divided by CAC | > 3:1 | 2-3:1 | < 2:1 |
| Net Revenue Retention | (MRR + expansion - churn) / beginning MRR | > 100% | 90-100% | < 90% |
| D30 retention | % of Day 0 users still active on Day 30 | > 30% | 15-30% | < 15% |

---

## Common growth mistakes (and how Claude Code helps avoid them)

**Mistake 1: Launching experiments without a proper hypothesis**
`/experiment-tracker` forces you to write the hypothesis, MDE, and success criteria before you touch the test tool. No hypothesis = no launch.

**Mistake 2: Stopping tests at first significance**
The pre-launch checklist locks in a test duration and stop date. Claude will flag if you're reading results before the required sample size is reached.

**Mistake 3: Optimising a broken funnel**
`/analytics-tracking` and `/page-cro` identify tracking gaps and UX friction before you run CRO experiments. Fixing a broken onboarding flow is not a test — it's a bug fix.

**Mistake 4: Reporting metrics without context**
`/growth-dashboard` generates narrative commentary with every report — not just numbers. "Signups dropped 18%" needs an explanation and an action, not just a red traffic light.

**Mistake 5: Spending on paid before the funnel converts**
`/onboarding-cro` and `/page-cro` identify the biggest conversion drops. Fix those before scaling paid acquisition — otherwise you're filling a leaky bucket.

---

## Resources

- [Getting started with Claude Code](./getting-started.md)
- [Experiment tracker skill](../skills/marketing/experiment-tracker.md)
- [Growth dashboard skill](../skills/marketing/growth-dashboard.md)
- [Growth experiment workflow](../workflows/growth-experiment.md)
- [Analytics tracking setup](../skills/marketing/analytics-tracking.md)
- [Paid ads optimisation](../skills/marketing/paid-ads.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
