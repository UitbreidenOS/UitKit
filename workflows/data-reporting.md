# Data Reporting Workflow

A repeatable process for data analysts to go from raw metrics to published stakeholder reports — weekly and monthly cadences — using Claude Code skills at each step.

---

## Overview

This workflow covers two reporting cadences:
- **Weekly report:** 45-minute process from data pull to distribution
- **Monthly report:** 2-hour process from data pull to executive-ready report

Both follow the same structure: data → quality check → analysis → narrative → review → publish.

---

## Weekly Reporting Workflow (every Monday morning)

**Target time:** 45 minutes total

---

### Step 1: Pull last week's data (10 minutes)

Run your standard data pull from your BI tool or data warehouse.

Required metrics for most business weekly reports:
```sql
-- Template: Weekly metrics pull
-- Run this each Monday for the prior week (Mon-Sun)

WITH week_current AS (
    SELECT
        DATE_TRUNC('week', created_at) AS week,
        COUNT(DISTINCT user_id) AS weekly_active_users,
        SUM(revenue) AS revenue,
        COUNT(DISTINCT order_id) AS transactions,
        SUM(revenue) / COUNT(DISTINCT order_id) AS avg_order_value
    FROM events
    WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '7 days')
      AND created_at <  DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY 1
),
week_prior AS (
    -- Same query for the week before
    SELECT ... FROM events WHERE ...
)
SELECT
    c.*,
    ROUND(100.0 * (c.revenue - p.revenue) / NULLIF(p.revenue, 0), 2) AS revenue_wow_pct,
    ROUND(100.0 * (c.weekly_active_users - p.weekly_active_users) / NULLIF(p.weekly_active_users, 0), 2) AS wau_wow_pct
FROM week_current c
CROSS JOIN week_prior p;
```

Save results to a spreadsheet row or your pipeline's metrics table.

---

### Step 2: Spot-check data quality (5 minutes)

Before writing a single word, verify the numbers are real:

```
/data-quality-checker

Quick sanity check on this week's metrics before I write the report.

This week vs. last week:
- WAU: [X] vs [X] ([+/-X%])
- Revenue: $[X] vs $[X] ([+/-X%])
- [Other metrics]

Red flags to check:
- Any metric moving more than 25% week over week unexpectedly
- Does revenue math check out? (transactions × avg order value ≈ total revenue)
- Anything that doesn't pass the "does this make sense" test?

Context: [any known events — outage, campaign, holiday, data pipeline change]
```

If the data checks out, proceed. If something looks wrong, investigate before writing.

---

### Step 3: Gather context (5 minutes)

The data tells you what happened. You need to know why. Before writing:

- Check Slack for any announcements from product, marketing, or engineering last week
- Note any product releases (check your release notes or Jira)
- Note any marketing campaigns or promotions that ran
- Note any incidents or outages
- Check if there was a known seasonal effect

This context is the difference between "revenue dropped 8%" (useless) and "revenue dropped 8% during the first week after the Q3 campaign ended — expected reversion, now back to baseline trend" (useful).

---

### Step 4: Write the weekly report (15 minutes)

```
/stakeholder-report

Write the weekly data report for [team name].

WEEK OF: [date range]
AUDIENCE: [leadership team / department heads]

METRICS (paste your data with WoW changes and vs-target if applicable):
- WAU: [X] ([+/-X%] WoW, target [X])
- Revenue: $[X] ([+/-X%] WoW, target $[X])
- Conversion rate: [X]% ([+/-X]pp WoW)
- [Other metrics]

EVENTS THIS WEEK:
- [Event 1 — e.g., new onboarding flow launched Tuesday]
- [Event 2]

WHAT I KNOW ABOUT THE MOVEMENTS:
- [Revenue drop likely due to campaign ending]
- [WAU up driven by new user cohort from [source]]
- [Conversion rate change unexplained — needs investigation]

Generate: headline summary, wins, concerns, anomalies, recommended actions, watch list for next week.
```

---

### Step 5: Review and fact-check (5 minutes)

Before publishing:

```
/stakeholder-report

Review this weekly report draft for quality.

[Paste your draft]

Check:
- Is every claim quantified? (no "significantly" without a number)
- Are wins and concerns balanced?
- Is the recommended action specific and owned by someone?
- Is anything phrased as causal that's only correlational?
- Would someone who didn't know our business understand this?
```

Fix any issues Claude flags.

---

### Step 6: Distribute (5 minutes)

- Email to your distribution list, OR
- Post to Slack (#data-updates or equivalent), OR
- Update the shared doc in Notion/Confluence

Include a "Questions?" line — you want stakeholders to engage, not just read and file.

---

## Monthly Reporting Workflow (first Monday of each month)

**Target time:** 2 hours total

---

### Step 1: Pull monthly data (20 minutes)

Monthly reports need more depth than weekly. Pull:
- Full month metrics with MoM and YoY comparisons
- vs-plan/budget comparison (if you have targets)
- Segment breakdowns (by product line, geography, channel)
- Cohort data (how did last month's new users retain this month?)
- Leading indicators for next month

```sql
-- Monthly metrics template
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        [your key metrics]
    FROM [your tables]
    GROUP BY 1
),
with_changes AS (
    SELECT
        month,
        [metric],
        LAG([metric]) OVER (ORDER BY month) AS prior_month,
        [metric] - LAG([metric]) OVER (ORDER BY month) AS mom_change,
        ROUND(100.0 * ([metric] - LAG([metric]) OVER (ORDER BY month))
              / NULLIF(LAG([metric]) OVER (ORDER BY month), 0), 2) AS mom_pct_change
    FROM monthly
)
SELECT * FROM with_changes ORDER BY month DESC LIMIT 3;
```

---

### Step 2: Full data quality audit (20 minutes)

Monthly cadence = monthly audit. Run the full audit script:

```
/data-quality-checker

Monthly data quality audit for [current month].

Run a full audit on these production tables:
- [table_1]: primary key [col], key metrics [cols]
- [table_2]: [same]
- [table_3]: [same]

Generate the Python audit script. I'll run it and paste results back.
```

Run the generated script. Paste results back to Claude. Get the data health report and remediation SQL.

**Rule:** Do not publish a monthly report if there are CRITICAL data quality issues. Fix them first.

---

### Step 3: Root cause analysis — wins (20 minutes)

For each metric that beat plan by >10%:

```
/stakeholder-report

Write a root cause analysis for [metric] overperforming by [X%] this month.

Performance: [metric] was [X] vs. plan [X] — [X]% above plan.
Segment breakdown: [how does this break down by key segments?]
Timeline: [when did outperformance start?]
Correlated events: [product launch, campaign, pricing change, etc.]

Hypotheses:
1. [most likely cause]
2. [second hypothesis]
3. [third hypothesis]

Which hypothesis is best supported by the data? What's the repeatability — is this a one-time event or a sustainable improvement?
```

---

### Step 4: Root cause analysis — misses (20 minutes)

For each metric that missed plan by >10%:

```
/stakeholder-report

Write a root cause analysis for [metric] underperforming by [X%] this month.

[Same format as above, but for the miss]

Additional: What is the plan to course-correct? Who owns it? What's the expected impact and timeline?
```

---

### Step 5: Write the full monthly report (30 minutes)

```
/stakeholder-report

Write the monthly data report for [audience].

MONTH: [Month Year]

EXECUTIVE SUMMARY: [One sentence on the month — honest]

FULL METRICS TABLE:
[Metric] | [This Month] | [Last Month] | [MoM%] | [Last Year] | [YoY%] | [vs. Plan]
[paste all rows]

ROOT CAUSE — WINS:
[Your analysis from Step 3]

ROOT CAUSE — MISSES:
[Your analysis from Step 4]

COHORT/SEGMENT INSIGHTS:
[Paste any cohort or segment analysis]

FORECAST UPDATE:
[Updated Q/annual forecast if you have one]

ACTIONS AND OWNERS:
[List actions, owners, due dates]

Generate the full monthly report in narrative format. Include a table of metrics. End with an action table. Total target: 1,000 words max.
```

---

### Step 6: Slide deck version (if needed — 20 minutes)

If the monthly report goes to a board or executive team meeting as slides:

```
/stakeholder-report

Convert this monthly report into a 5-slide executive presentation outline.

[Paste your monthly report]

Slide structure:
1. HEADLINE: [single metric or one-sentence verdict]
2. SCORECARD: [key metrics vs. plan table]
3. WHAT DROVE PERFORMANCE: [wins and misses, with root cause]
4. ACTIONS AND OWNERS: [table]
5. FORWARD LOOK: [next month's key watch items, any forecast change]

For each slide: title, 3-5 bullet points or data points, talking points for the presenter.
```

---

### Step 7: Review and publish (10 minutes)

```
/stakeholder-report

Final review of this monthly report before publication.

[Paste full report]

Check:
[ ] Every metric has a comparison (no orphan numbers without context)
[ ] Every miss has a cause and a plan
[ ] Actions have owners and due dates
[ ] No jargon that the CEO wouldn't understand
[ ] No spin — is this honest about what went wrong?
[ ] Consistent date references throughout
```

Distribute via email, Notion, Confluence, or all-hands doc.

---

## Report templates by audience

### For the CEO (one page max)
```
Month: [name]
Status: [Green / Yellow / Red]

Top 3 things you need to know:
1. [Most important finding]
2. [Second finding]
3. [Third finding]

What we're doing about the miss: [1-2 sentences]
Next month's primary watch item: [1 sentence]
```

### For the board (data section of board deck)
```
[Performance vs. plan table]
[3 bullets: what worked, what didn't, what we're doing]
[Revised forecast if changed]
```

### For the team (full report)
Full monthly narrative with all sections — no abbreviation.

---

## Automation ideas

### Week-over-week comparison automation

```python
# Run every Monday via cron or GitHub Actions
import pandas as pd
from datetime import datetime, timedelta

# Pull metrics (replace with your actual data source)
def pull_weekly_metrics(week_start: datetime) -> dict:
    """Pull metrics for the week starting on week_start."""
    # Your query here
    pass

current_week = pull_weekly_metrics(datetime.now() - timedelta(days=7))
prior_week = pull_weekly_metrics(datetime.now() - timedelta(days=14))

# Format for Claude prompt
metrics_text = "\n".join([
    f"- {k}: {current_week[k]} (WoW: {round(100*(current_week[k]-prior_week[k])/prior_week[k], 1)}%)"
    for k in current_week
])

# Pipe to Claude CLI
import subprocess
prompt = f"Write a weekly report for these metrics:\n{metrics_text}"
result = subprocess.run(['claude', '-p', prompt], capture_output=True, text=True)
print(result.stdout)
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
