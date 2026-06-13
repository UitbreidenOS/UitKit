# Claude for Data Analysts and BI Analysts

Everything a data analyst or BI analyst needs to run AI-augmented SQL work, dashboard interpretation, stakeholder reporting, data quality audits, and ad-hoc analysis in Claude Code.

---

## Who this is for

You are a data analyst or BI analyst embedded in a business, product, or marketing team. You get 15 ad-hoc requests a week, maintain 8 dashboards, write a weekly report for leadership, and are always one schema change away from a broken pipeline. Claude Code becomes your pair programmer for queries, your editor for reports, and your quality checker for everything you ship.

**Before Claude Code:** 2 hours to write a complex SQL query from scratch. 1 hour to write the monthly stakeholder report from raw metrics. 3 hours to investigate a data quality issue across 10 tables.

**After:** Complex query in 15 minutes. Stakeholder report in 20 minutes. Data quality audit in 30 minutes with remediation SQL included.

---

## 30-second install

```bash
# Install data analyst skills
npx claudient add skill data-ml/sql
npx claudient add skill data-ml/pandas-polars
npx claudient add skill data-ml/dbt-data-pipelines
npx claudient add skill data-ml/dashboard-narrator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill data-ml/data-quality-checker
npx claudient add skill product/product-analytics
npx claudient add skill marketing/analytics-tracking

# Install relevant agents
npx claudient add agent roles/data-pipeline-architect
npx claudient add agent roles/quant-analyst
```

---

## Your Claude Code data stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/sql` | Write, optimise, and debug complex SQL — CTEs, window functions, query plans | Any SQL query work |
| `/pandas-polars` | Python data manipulation — cleaning, transformation, aggregation, exports | Ad-hoc analysis in Python |
| `/dbt-data-pipelines` | dbt model design, incremental models, tests, documentation | Pipeline and transformation work |
| `/dashboard-narrator` | Translate dashboard data into executive-ready narrative — insights, anomalies, recommendations | Weekly and ad-hoc reporting |
| `/stakeholder-report` | Weekly/monthly report: headline metrics, root cause, action items | Regular reporting cadences |
| `/data-quality-checker` | Data quality audit: nulls, dupes, outliers, schema drift, remediation SQL | Any new data source or anomaly investigation |
| `/product-analytics` | Funnel analysis, retention, cohorts, A/B testing — product growth metrics | Product team analysis |
| `/analytics-tracking` | Event tracking schema design, tracking plans, tag audits | Tracking implementation |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `data-pipeline-architect` | Opus | Complex pipeline design, architecture decisions |
| `quant-analyst` | Opus | Statistical analysis, A/B test methodology, forecasting |

---

## Daily workflow

### Morning (15-20 minutes)

**1. Data health check — verify production data before stakeholders ask**
```
/data-quality-checker

Quick health check on our production tables before the business day starts.

Run these checks on the following tables:
- [table_1]: check nulls on [key columns], duplicate [primary key]
- [table_2]: check for future dates in [date column], negative values in [amount column]

[Paste yesterday's row counts or anomaly if you have them]

Flag anything that looks off. Generate SQL queries I can run to confirm.
```

**2. Triage overnight ad-hoc requests**
Copy-paste the request into Claude → get a SQL draft or analysis plan before you start working.

---

### Ad-hoc analysis (on demand)

**3. Complex SQL query — any request**
```
/sql

Write a SQL query to answer this business question:
"[Stakeholder's request in their words]"

Our schema:
- [table_name]: columns [list], primary key [col], relationships to [other tables]
- [table_name]: [same]

Database: [PostgreSQL / BigQuery / Snowflake / Redshift]
I need: [describe the output — table shape, level of granularity, filters]
```

**4. Funnel or cohort analysis**
```
/product-analytics

Build a [funnel / cohort retention / A/B test] analysis.

Events table: [schema]
Question: [what are we trying to answer]
Time period: [date range]
Segment by: [user type / acquisition channel / plan tier]

Output: [SQL + interpretation of results]
```

---

### Reporting (weekly cadence)

**5. Weekly stakeholder report**
```
/stakeholder-report

Write the weekly data report for [leadership / product team / marketing].

Week of: [dates]
Metrics this week:
[Paste your metrics with WoW changes and vs-plan]

Key events: [product releases, campaigns, incidents]
```

**6. Dashboard narrative — when leadership asks "what does this mean?"**
```
/dashboard-narrator

Translate this dashboard data into a 5-minute read for our CEO.

Dashboard: [name]
Period: [this month]
Audience: CEO + exec team — not technical

[Paste your metric values, changes, and any context you know]
```

---

### Monthly deep work (first week of month)

**7. Monthly report**
```
/stakeholder-report

Monthly data report for [audience].
Month: [name]
[Full metric table — current month, last month, MoM%, last year, YoY%, vs plan]
Root cause of biggest changes: [your notes]
Actions and owners: [list]
```

**8. Data quality audit — monthly production audit**
```
/data-quality-checker

Monthly data quality audit across our [N] production tables.

For each table:
- [table_1]: [row count, primary key, key business columns]
- [table_2]: [same]

Generate the Python audit script I should run. After I paste the results, generate the health report and remediation SQL.
```

---

### Ongoing (pipeline work)

**9. dbt model design**
```
/dbt-data-pipelines

I need to build a dbt model for [business concept — e.g., weekly active users by cohort].

Source tables: [list with schemas]
Desired output: [grain, columns, what the model is used for]
Materialization: [table / incremental / view]

Generate: the model SQL, schema.yml with tests, and documentation.
```

---

## 30-day ramp plan (new data analyst or new stack)

### Week 1 — SQL mastery in your new schema
- Install all data skills: `npx claudient add skill data-ml/[name]`
- Document your key tables in a CLAUDE.md in your analytics repo — Claude reads this for context
- Use `/sql` to write 10 queries that answer common business questions — build your query library
- Run `/data-quality-checker` on your 3 most important production tables — understand your data health baseline

### Week 2 — Reporting workflows
- Use `/dashboard-narrator` to write the weekly business review — compare to what you'd have written manually
- Use `/stakeholder-report` to write the monthly report — share with your manager and get feedback
- Identify which stakeholders actually read reports and calibrate length/format accordingly

### Week 3 — Pipeline and tracking
- Use `/dbt-data-pipelines` to add tests to any untested models in your project
- Use `/analytics-tracking` to audit your event tracking — find gaps before they become data quality issues
- Set up the dbt tests Claude generates — get automated quality monitoring running

### Week 4 — Advanced analysis
- Use `/product-analytics` to run a full funnel analysis — identify the biggest drop-off in your product
- Use `/quant-analyst` agent for any A/B test analysis — get the methodology right before presenting results
- Benchmark your time: how many minutes does each common request take now vs. before Claude?

---

## Tool integrations

### dbt Core / dbt Cloud

```bash
# Claude reads your dbt project structure
# Point Claude to your models/ directory and it understands your schema
ls models/marts/ models/staging/  # show Claude your folder structure
cat dbt_project.yml               # paste this for project context
```

### BigQuery / Snowflake / Redshift

```json
// Connect your data warehouse via MCP
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/bigquery-mcp"],
      "env": {
        "GOOGLE_PROJECT_ID": "your-project",
        "GOOGLE_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}
```

With your warehouse connected: Claude can read table schemas directly, run queries, and validate SQL before you do.

### Looker / Tableau / Metabase
Export dashboard data as CSV or paste metric values → `/dashboard-narrator` converts to narrative. For LookML: paste your view file and Claude helps write or refactor dimension/measure definitions.

### Jupyter Notebooks
Claude writes Python analysis code → paste into notebook → run → paste output back for interpretation. Use `/pandas-polars` for the code and `/dashboard-narrator` for the interpretation.

### Slack (stakeholder delivery)
Paste Claude's weekly report into a Slack message. Set up a weekly reminder → open Claude → run `/stakeholder-report` → paste to Slack. Total time: 15 minutes from data to delivered.

---

## Metrics to track

| Activity | Manual time | With Claude |
|---|---|---|
| Complex SQL query (3+ tables) | 2 hours | 20 min |
| Weekly stakeholder report | 60 min | 15 min |
| Monthly stakeholder report | 3 hours | 30 min |
| Data quality audit (5 tables) | 3 hours | 30 min |
| dbt model + tests + docs | 2 hours | 25 min |
| Dashboard narrative | 45 min | 8 min |
| A/B test analysis | 3 hours | 45 min |

---

## Common mistakes (and how Claude Code prevents them)

**Mistake 1: Shipping a report with bad data**
Run `/data-quality-checker` before every monthly report. Know your data's health before stakeholders see it.

**Mistake 2: Writing SQL that's correct but unreadable**
`/sql` generates CTEs and documented queries by default. Future you will thank present you.

**Mistake 3: Stakeholder reports that are data dumps**
`/stakeholder-report` forces narrative: what happened, why, what to do. Not just a table of numbers.

**Mistake 4: Dashboard anomalies that go unexplained**
`/dashboard-narrator` structures anomaly investigation: what's the signal, what are the hypotheses, how to verify.

**Mistake 5: dbt models with no tests**
`/dbt-data-pipelines` generates schema.yml with tests as part of every model. Tests aren't an afterthought.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [SQL skill](../skills/data-ml/sql.md)
- [Dashboard narrator skill](../skills/data-ml/dashboard-narrator.md)
- [Stakeholder report skill](../skills/data-ml/stakeholder-report.md)
- [Data quality checker skill](../skills/data-ml/data-quality-checker.md)
- [Data reporting workflow](../workflows/data-reporting.md)

---
