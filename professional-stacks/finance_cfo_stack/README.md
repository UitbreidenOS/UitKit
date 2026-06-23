# Finance/CFO Stack

> The complete Claude Code workspace for enterprise financial planning — budget analysis, forecasting, cost optimization, and CFO-level reporting.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Prepare data sources** — Connect spreadsheets, accounting systems, or data exports (CSV/Excel).
3. **Set your baseline** — Open `CLAUDE.md`, configure your target company size and financial reporting cadence.
4. **Run `/analyze-budget`** — Parse historical actual vs. budget; identify variances and trends.
5. **Run `/forecast-cash`** — Build 12–24 month cash flow projection with scenario modeling.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, personas, skills, hooks, and data governance. Start here. |
| `README.md` | Guide | This file — quick reference, setup, and skills overview. |
| `session-log.md` | Log | Auto-updated with every analysis: period, type, status, key findings, assumptions. |
| `skills/` | Directory | 8 reusable skills for analysis, forecasting, modeling, and reporting. |
| `commands/` | Directory | Slash command definitions for key workflows. |
| `hooks/` | Directory | Automated validation, assumption flagging, and governance logging. |
| `mcp/` | Directory | Data source configuration and external connection guidance. |

---

## Skills (8)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `budget-analyzer` | `/analyze-budget` | Spreadsheet, WebFetch | Audit historical actual vs. budget; variance analysis, trend identification |
| `cash-flow-forecaster` | `/forecast-cash` | Financial modeling, Scenario build | 12–24 month projection; base/upside/downside scenarios with sensitivity |
| `financial-modeler` | `/build-model` | Spreadsheet, Model build | Multi-scenario financial models with waterfall breakdowns and sensitivity |
| `variance-reporter` | `/report-variance` | Data analysis, Presentation | Variance analysis deck: actuals vs. budget, explanations, forward outlook |
| `investor-deck-builder` | `/build-deck` | Financial aggregation, Presentation | Investor-ready financial summary: KPIs, trends, forward guidance, risk |
| `cost-optimizer` | `/optimize-costs` | Cost analysis, Benchmarking | Cost structure audit, reduction opportunities, peer comparison |
| `headcount-planner` | `/plan-headcount` | HR data, Payroll modeling | Headcount forecast and payroll impact; hiring and attrition scenarios |
| `balance-sheet-analyst` | `/analyze-balance` | Balance sheet data, Ratio analysis | Health check: working capital, liquidity ratios, solvency, covenant compliance |

---

## Commands (4)

| Command | What It Does |
|---|---|
| `/analyze-budget` | Parse historical budget vs. actual data; identify variances >5%, trends, and revised forecast. |
| `/forecast-cash` | Build 12–24 month cash flow projection; model base, upside, downside scenarios with sensitivity analysis. |
| `/report-variance` | Generate variance analysis deck for board/investor review; include explanations and forward outlook. |
| `/optimize-costs` | Audit cost structure, identify reduction opportunities, benchmark vs. industry peers. |

---

## Hooks (4)

| Hook | Event | What It Protects Against |
|---|---|---|
| `data-validation` | PreToolUse | Flags incomplete periods, missing categories, outliers, formula integrity issues |
| `assumption-flagging` | PostToolUse | Surfaces all model assumptions; highlights sensitivity to key driver changes |
| `governance-logging` | Stop | Auto-logs all analysis to `session-log.md`: date, preparer, sources, review status |
| `scenario-review` | PreOutput | Validates scenario logic; ensures base/upside/downside ranges are plausible |

---

## Tone & Output Rules

- **Voice:** Precise, analytical, confidence backed by data. No speculation without caveats.
- **Format:** Executive summaries with supporting detail; always include assumptions and sensitivity ranges.
- **Lead with impact:** Business implications first, then supporting numbers.
- **Data integrity:** Flag quality issues, incomplete periods, or methodological shifts upfront.
- **Governance:** All analysis logged with source, date, preparer, and review status.

---

## Data Sources & Integration

### Spreadsheet Data
Upload budget, actuals, headcount, or financial statements. Supported formats: CSV, Excel, Parquet.

### Accounting Systems
Connect to accounting software (QuickBooks, Netsuite, Xero) for real-time GL pulls and financial statements.

### HR Systems
Integrate headcount data from ATS/HRIS for payroll forecasting and FTE modeling.

---

## Human Review & Approval

All financial analyses follow a governance workflow:

1. **Draft** — Claude builds model, analysis, or report.
2. **Review** — Human reviews assumptions, methodology, and output quality.
3. **Approve** — Human approves and confirms data sources are accurate.
4. **Finalize** — Analysis is logged and ready for distribution (board, investors, leadership).

---

## Success Metrics

Track and report on:
- **Forecast accuracy:** Actual vs. forecast variance (target <5% for 3-month rolling forecast).
- **Variance identification:** Trend detection speed and accuracy.
- **Decision velocity:** Time from analysis to recommendation.
- **Data quality:** Percentage of complete, validated data periods.
- **Governance compliance:** All analyses logged and reviewed on schedule.

---

## Key Constraints

- **Data quality:** Flag incomplete periods, missing categories, or methodological changes before proceeding.
- **Confidentiality:** All financial data is sensitive; treat outputs as restricted and confidential.
- **Audit trail:** Every model, assumption, and data source must be documented for audit compliance.
- **Board/investor communication:** All investor-facing reports must be reviewed by CFO/CEO before distribution.

---

## Stats

**8 skills** · **4 commands** · **4 hooks** · **Multi-scenario modeling** · **Full governance audit trail** via session logging

---

Built by [tushar2704](https://github.com/tushar2704) · [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
