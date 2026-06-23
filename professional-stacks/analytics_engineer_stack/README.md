# Analytics Engineer Stack

> The complete Claude Code workspace for modern data analytics — from SQL optimization to metrics definition, dbt project scaffolding, dashboard QA, and production troubleshooting. Build and maintain high-quality analytics infrastructure with built-in data quality checks, metric alignment, and session logging.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Configure MCPs** — Set up dbt Cloud, Data Warehouse, and BI tool connectors in `settings.json`.
3. **Define your metrics** — Open `CLAUDE.md`, customize metrics registry, and set data quality baselines.
4. **Run `/optimize-query [your-slow-query]`** — Get performance tuning recommendations with before/after metrics.
5. **Run `/audit-dashboard [dashboard-name]`** — Comprehensive QA audit: metric accuracy, freshness, UX, mobile responsiveness.
6. **Run `/diagnose-issue [problem-description]`** — Trace data lineage and identify root cause (data source issue, SQL bug, performance regression, etc.).

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, analytics standards, metrics registry template, quality baselines. Start here. |
| `session-log.md` | Log | Auto-updated with every session: queries optimized, models built, dashboards audited, issues diagnosed. |
| `skills/` | Directory | 8 reusable skills for SQL, data modeling, metrics, dbt, dashboards, QA, and troubleshooting. |
| `commands/` | Directory | 3 slash commands: /optimize-query, /audit-dashboard, /diagnose-issue. |
| `hooks/` | Directory | 4 automation hooks: SQL validation, dbt schema check, metric alignment, session summary. |
| `mcp/` | Directory | MCP configs for dbt Cloud, data warehouse, and BI tools. |

---

## Skills (8)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `sql-optimizer` | `/optimize-query` | Read, Write, WebFetch | Analyzes inefficient queries; recommends indexes; returns optimized SQL with before/after metrics |
| `data-modeling` | Before building dbt models | Read, Write | Designs normalized or dimensional data models; validates grain, cardinality, conformed dimensions |
| `metrics-definition` | Building metrics layer | Read, Write | Defines business metrics with precision; creates metrics registry; prevents calculation drift |
| `dbt-scaffolder` | Starting new dbt project | Read, Write, WebFetch | Generates dbt structure, model stubs, YAML schemas, testing strategy, CI/CD plan |
| `dashboard-qa` | Before publishing dashboards | Read, Write, WebFetch | Audits dashboards: metric accuracy, data freshness, color consistency, drill-down logic |
| `data-quality-auditor` | Building/validating pipelines | Read, Write, WebFetch | Audits data completeness, uniqueness, validity, consistency, accuracy, timeliness, conformity |
| `analytics-troubleshooter` | Production issues | Read, Write, WebFetch | Diagnoses metric mismatches, missing data, slow queries; traces lineage; prescribes fixes |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/optimize-query` | Analyze a slow SQL query; identify bottlenecks; return optimized query with performance delta. |
| `/audit-dashboard` | QA check: metric accuracy, data freshness, UX, mobile. Returns pass/fail with remediation steps. |
| `/diagnose-issue` | Root-cause analysis of analytics problems: data delays, metric mismatches, failed dbt jobs, performance regressions. |

---

## Hooks (4+)

| Hook | Event | What It Protects Against |
|---|---|---|
| `sql-validation` | PostToolUse (Write *.sql) | Flags hardcoded dates, SELECT *, unclear CTEs, single-letter aliases, missing semicolons |
| `dbt-schema-check` | PostToolUse (Write *.yml) | Ensures model descriptions, column documentation, primary key tests, relationships defined |
| `metric-alignment` | PostToolUse (Write metrics/CLAUDE.md) | Prevents duplicate metric definitions; validates completeness (Business Definition, Formula, Grain) |
| `session-summary` | Stop | Auto-logs to `session-log.md`: queries optimized, models built, dashboards audited, issues fixed |

---

## MCP Setup

### dbt Cloud

Monitor and trigger dbt Cloud jobs directly from Claude Code. Get job status, view logs, trigger production runs.

Get your API token from [cloud.getdbt.com](https://cloud.getdbt.com) → Account settings → API tokens. Add to `settings.json`:

```json
{
  "mcpServers": {
    "dbt_cloud": {
      "command": "npx",
      "args": ["@dbt-labs/mcp"],
      "env": {
        "DBT_CLOUD_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

### Data Warehouse Connector

Run ad-hoc queries, fetch schema metadata, profile data, validate freshness. Supports Snowflake, BigQuery, PostgreSQL, Redshift.

**Snowflake example:**
```json
{
  "mcpServers": {
    "warehouse_snowflake": {
      "command": "npx",
      "args": ["@anthropic-ai/warehouse-mcp", "--warehouse", "snowflake"],
      "env": {
        "SF_ACCOUNT": "ab12345.us-east-1",
        "SF_USER": "analytics_user",
        "SF_PASSWORD": "your-password",
        "SF_DATABASE": "analytics_db"
      }
    }
  }
}
```

### BI Tool Connector

Fetch dashboard definitions, validate metrics, check data freshness, audit lineage. Supports Looker, Tableau, Superset, Metabase.

**Looker example:**
```json
{
  "mcpServers": {
    "looker": {
      "command": "npx",
      "args": ["@anthropic-ai/looker-mcp"],
      "env": {
        "LOOKER_API_HOST": "https://your-instance.looker.com:19999",
        "LOOKER_CLIENT_ID": "your-client-id",
        "LOOKER_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

---

## How It Works

### 1. SQL Optimization

Slow dashboard query? Run `/optimize-query` to identify bottlenecks, missing indexes, and execution plan issues. Get before/after metrics.

**Example:** Query time 45s → 2.1s (-95%); rows scanned 2.3B → 45M (-98%).

### 2. Metrics Definition

Define canonical business metrics once. Prevent calculation drift across dashboards. Metrics Registry becomes source of truth.

**Example:** MRR = SUM(monthly_subscription_amount) WHERE status='active' AND type NOT IN ('trial', 'free') at month-end.

### 3. dbt Scaffolding

Building new analytics layer? Get a complete dbt project structure: staging, intermediate, fact/dimension models, YAML schemas, tests, CI/CD plan.

### 4. Dashboard QA

Before publishing, run `/audit-dashboard` to validate metric accuracy (dashboard value vs. source query), data freshness, color scheme, drill-down logic, mobile responsiveness.

**Status:** PASS / PASS WITH WARNINGS / FAIL → remediation checklist.

### 5. Data Quality Audits

Build confidence in your data. Scorecard audits: completeness (NULLs), uniqueness (duplicates), validity (ranges), consistency (referential integrity), accuracy (sample validation), timeliness (freshness), conformity (naming).

### 6. Production Troubleshooting

Dashboard shows wrong numbers? `/diagnose-issue` traces data lineage, checks freshness, inspects logs, identifies root cause (data source delay, SQL bug, missing index, schema mismatch), prescribes fix.

**Example:** MRR dashboard down 25% → stale data (dbt job failed) → query timeout (missing index) → added index → re-run → issue resolved.

### 7. Session Logging

Every activity logged: queries optimized, models built, dashboards audited, issues diagnosed. Build audit trail of analytics work. Session log auto-generated on session stop.

---

## Tone & Standards

- **Voice:** Precise, technical, data-driven. No hedging on metrics.
- **Metric rigor:** Every metric must have Business Definition, Formula, Grain, Owner, SLA. No ambiguity.
- **Data quality:** All dashboards backed by data quality checks. Missing data is flagged, not hidden.
- **Testing:** Fact/dimension primary keys have NOT NULL + UNIQUE tests. Foreign keys have referential integrity tests.
- **Documentation:** Every dbt model has column-level descriptions. Every metric has calculation formula. Every dashboard has data source lineage.
- **Change management:** SQL changes tested in dev; dbt changes validated with test suite; dashboard changes QA-audited before publication.

---

## Data Quality Baselines

Every data warehouse should maintain baseline expectations:

- **Completeness:** <1% NULL values in critical columns (customer_id, transaction_id, dates)
- **Uniqueness:** 0 duplicate primary keys; <0.1% duplicate email/phone
- **Validity:** 100% data types match schema; 100% dates in valid range
- **Consistency:** 0 orphaned foreign keys; 0 referential integrity violations
- **Accuracy:** Sample validation matches source system within 0.5%
- **Timeliness:** Fact tables refresh within SLA (<1h for transaction data, <24h for dimension data)
- **Conformity:** 100% naming conventions (snake_case); 100% allowed enum values

---

## Human Approval Gate

**Nothing goes to production without quality verification.** This is non-negotiable.

- Claude drafts SQL queries, dbt models, and dashboards.
- Human reviews for correctness and compliance with standards.
- QA automation (hooks, tests) catches syntax/logic errors.
- Only after human approval does the change deploy to production.
- All deployments logged to `session-log.md` with timestamp and approver.

---

## Success Metrics

Track and report on:

- **Query performance:** Optimization impact (execution time, cost reduction)
- **Dbt reliability:** 100% test pass rate; zero production incidents caused by SQL bugs
- **Dashboard accuracy:** 100% metrics match source queries; zero metric calculation drift incidents
- **Data quality:** 0 orphaned foreign keys; 0 stale data in production (SLA compliance)
- **Incident response:** Average MTTR (mean time to resolution) for analytics issues
- **Documentation:** 100% of models and metrics documented; 0 ambiguous metric definitions

---

## Key Constraints

- **Schema governance:** Star schema or dimensional modeling only (no snowflake normalization without business case)
- **Metric definitions:** Every metric registered in metrics-definition.md before dashboard publication
- **Testing coverage:** All fact/dimension primary keys tested for uniqueness and NOT NULL
- **Documentation:** All dbt models have descriptions; all metrics have formulas and owners
- **Freshness SLA:** Transaction fact tables <1h; dimension tables <24h; all dashboards display refresh time
- **Audit trail:** All changes logged with timestamp, owner, and approval status

---

## Stats

**8 skills** · **3 commands** · **4 hooks** · **3 MCP integrations** (dbt Cloud + Warehouse + BI Tools) · **Full audit trail** via session logging

---

## Directory Structure

```
analytics_engineer_stack/
├── README.md                      (this file)
├── CLAUDE.md                      (workspace rules, metrics registry, data quality baselines)
├── session-log.md                 (auto-updated with session activity)
├── skills/
│   ├── sql-optimizer.md
│   ├── data-modeling.md
│   ├── metrics-definition.md
│   ├── dbt-scaffolder.md
│   ├── dashboard-qa.md
│   ├── data-quality-auditor.md
│   └── analytics-troubleshooter.md
├── commands/
│   ├── optimize-query.md
│   ├── audit-dashboard.md
│   └── diagnose-issue.md
├── hooks/
│   ├── sql-validation.md
│   ├── dbt-schema-check.md
│   ├── metric-alignment.md
│   └── session-summary.md
└── mcp/
    ├── dbt-cloud.md
    ├── warehouse-connector.md
    └── bi-tool-connector.md
```

---

Built by [tushar2704](https://github.com/tushar2704/) · [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
