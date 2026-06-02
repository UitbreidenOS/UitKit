# Finance Analyst / CFO Workspace — Project Structure

> For a finance analyst or CFO managing financial modeling, monthly close, board pack creation, scenario planning, and investor reporting — all driven from a single Claude Code workspace.

## Stack

- Excel / Google Sheets — 3-statement models, DCF, budget vs actual, scenario models
- QuickBooks, Xero, or NetSuite — general ledger, AP/AR, journal entries, trial balance
- Notion or Confluence — accounting policies, close checklists, team documentation
- Carta — cap table, option pool, dilution modeling, 409A data
- Slack — close process coordination, board prep communication, investor Q&A
- PowerPoint or Google Slides — board decks, investor updates, management reporting

## Directory tree

```
finance-analyst-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions for Claude Code
│   ├── settings.json                          # Permissions, hooks, MCP config
│   └── commands/
│       ├── variance-analysis.md               # Period variance report — budget vs actual with commentary
│       ├── model-update.md                    # Update 3-statement model with latest actuals
│       ├── board-pack.md                      # Compile board deck — financials, KPIs, narrative
│       ├── close-checklist.md                 # Month-end close task list with status tracking
│       ├── scenario-model.md                  # Scenario planning — base / bull / bear cases
│       ├── investor-update.md                 # Investor update letter — metrics, narrative, asks
│       └── budget-reforecast.md               # Quarterly reforecast — rolling 4Q with assumptions
├── models/
│   ├── 3-statement/
│   │   ├── 3-statement-model-2025.xlsx        # Integrated P&L, balance sheet, cash flow model
│   │   ├── 3-statement-model-2024.xlsx        # Prior year model — archived reference
│   │   ├── assumptions-log.md                 # Key driver assumptions and change history
│   │   └── monthly-actuals-feed.csv           # Export from QuickBooks/Xero for model updates
│   ├── dcf/
│   │   ├── dcf-model-current.xlsx             # Discounted cash flow — WACC, terminal value, IRR
│   │   ├── wacc-calculation.xlsx              # WACC build — cost of equity, cost of debt, beta
│   │   ├── sensitivity-table.xlsx             # Revenue growth vs EBITDA margin sensitivity output
│   │   └── dcf-assumptions.md                 # Narrative behind DCF inputs — growth, margins, WACC
│   ├── budget-vs-actual/
│   │   ├── bva-2025-ytd.xlsx                  # YTD budget vs actual by cost center and line item
│   │   ├── bva-template.xlsx                  # Blank BvA template for new periods
│   │   ├── variance-commentary-jan-2025.md    # Variance narrative — Jan 2025 management package
│   │   ├── variance-commentary-feb-2025.md    # Variance narrative — Feb 2025 management package
│   │   ├── variance-commentary-mar-2025.md    # Variance narrative — Mar 2025 management package
│   │   └── variance-threshold-policy.md       # Policy: what variance % triggers mandatory commentary
│   └── scenario/
│       ├── scenario-model-q2-2025.xlsx        # Base / bull / bear scenario model — Q2 2025
│       ├── scenario-model-q3-2025.xlsx        # Q3 2025 scenario model — updated post-close
│       ├── macro-assumptions.md               # External assumptions: rate, FX, market conditions
│       └── scenario-summary-template.xlsx     # One-page scenario summary for board and investors
├── reports/
│   ├── board-packs/
│   │   ├── board-pack-q1-2025.pptx            # Q1 2025 board pack — financials + KPIs + narrative
│   │   ├── board-pack-q2-2025.pptx            # Q2 2025 board pack
│   │   ├── board-pack-template.pptx           # Master template — approved layout and brand
│   │   └── board-pack-data-q2-2025.xlsx       # Supporting data file for Q2 board pack charts
│   ├── investor-updates/
│   │   ├── investor-update-may-2025.md        # Monthly investor update letter — May 2025
│   │   ├── investor-update-jun-2025.md        # Monthly investor update letter — June 2025
│   │   ├── investor-update-template.md        # Standard investor update letter template
│   │   └── investor-list.md                   # Current investor registry — names, ownership %, contact
│   └── management-reporting/
│       ├── management-package-jan-2025.xlsx   # Jan 2025 monthly management package
│       ├── management-package-feb-2025.xlsx   # Feb 2025 monthly management package
│       ├── management-package-mar-2025.xlsx   # Mar 2025 monthly management package
│       └── management-package-template.xlsx   # Standard management package template
├── close/
│   ├── month-end-close-checklist.md           # Master month-end close task list with owners
│   ├── close-calendar-2025.md                 # Hard close dates, soft close dates, board dates
│   ├── journal-entries/
│   │   ├── je-template.csv                    # Standard JE upload format for QuickBooks/Xero
│   │   ├── accruals-jan-2025.csv              # Accrual JEs for January 2025
│   │   ├── accruals-feb-2025.csv              # Accrual JEs for February 2025
│   │   ├── accruals-mar-2025.csv              # Accrual JEs for March 2025
│   │   └── prepaid-amortization-schedule.xlsx # Prepaid expense schedule with monthly amortization
│   ├── reconciliations/
│   │   ├── bank-recon-jan-2025.xlsx           # Bank reconciliation — January 2025
│   │   ├── bank-recon-feb-2025.xlsx           # Bank reconciliation — February 2025
│   │   ├── ar-aging-jan-2025.xlsx             # AR aging report — January 2025
│   │   ├── ar-aging-feb-2025.xlsx             # AR aging report — February 2025
│   │   ├── intercompany-recon.xlsx            # Intercompany eliminations — if applicable
│   │   └── gl-recon-checklist.md              # GL account reconciliation checklist and sign-offs
│   └── trial-balance/
│       ├── tb-jan-2025.csv                    # Exported trial balance — January 2025
│       ├── tb-feb-2025.csv                    # Exported trial balance — February 2025
│       └── tb-mapping.xlsx                    # Chart of accounts to financial statement mapping
├── budgets/
│   ├── annual/
│   │   ├── budget-2025.xlsx                   # Board-approved annual operating budget — FY2025
│   │   ├── budget-2025-assumptions.md         # Narrative behind FY2025 budget line items
│   │   ├── budget-2026-draft.xlsx             # FY2026 draft budget — in progress
│   │   └── budget-approval-log.md             # Board approval dates, revision history, signatories
│   └── reforecasts/
│       ├── reforecast-q1-2025.xlsx            # Q1 2025 reforecast — 4-quarter rolling view
│       ├── reforecast-q2-2025.xlsx            # Q2 2025 reforecast
│       ├── reforecast-q3-2025.xlsx            # Q3 2025 reforecast
│       └── reforecast-assumptions.md          # Running log of reforecast assumption changes
├── compliance/
│   ├── audit/
│   │   ├── audit-prep-checklist.md            # Year-end audit prep — PBC list and status
│   │   ├── pbc-2024.xlsx                      # Prepared by client schedule — FY2024 audit
│   │   ├── audit-adjustments-2024.xlsx        # Auditor proposed adjustments and management responses
│   │   └── auditor-contact.md                 # Auditor name, engagement team, contact details
│   ├── tax/
│   │   ├── tax-calendar-2025.md               # Federal and state filing deadlines — FY2025
│   │   ├── r-and-d-credit-analysis.xlsx       # R&D tax credit qualification analysis
│   │   ├── state-nexus-tracker.md             # States with nexus — registration and filing status
│   │   └── 83b-elections-log.md               # Log of 83(b) elections filed by founders/employees
│   └── regulatory/
│       ├── 409a-valuation-current.pdf         # Current 409A valuation report
│       ├── 409a-history.md                    # 409A valuation history — dates, providers, FMVs
│       └── irs-correspondence/                # IRS notices and responses — one file per notice
├── docs/
│   ├── accounting-policies.md                 # Formal accounting policies — revenue recognition, capex, etc.
│   ├── chart-of-accounts.xlsx                 # Full COA with account codes, types, descriptions
│   ├── revenue-recognition-policy.md          # ASC 606 revenue recognition policy document
│   ├── expense-policy.md                      # Employee expense and reimbursement policy
│   ├── equity-compensation-summary.md         # Option pool, grants, vesting schedules, Carta summary
│   └── glossary.md                            # Finance team glossary — abbreviations and definitions
└── cap-table/
    ├── cap-table-current.xlsx                 # Current fully-diluted cap table — synced from Carta
    ├── option-pool-analysis.xlsx              # Option pool sufficiency and refresh analysis
    ├── dilution-scenarios.xlsx                # Dilution modeling — Series A, B, SAFE conversions
    └── 409a-strike-price-log.md              # Strike price history by grant date
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/variance-analysis.md` | Slash command that takes a period argument (e.g., `may-2025`), reads the corresponding BvA file from `models/budget-vs-actual/`, and generates executive variance commentary with line-item explanations |
| `.claude/commands/board-pack.md` | Slash command that compiles the current quarter's financials, KPI trends, and scenario summary into board-ready slide narrative and speaker notes |
| `.claude/commands/close-checklist.md` | Slash command that generates a month-end close task list pre-populated with owners, due dates, and carry-forward items from the prior close |
| `models/3-statement/3-statement-model-2025.xlsx` | Master integrated financial model — updates to actuals flow through P&L to balance sheet to cash flow; source of truth for all reporting |
| `close/month-end-close-checklist.md` | Living close checklist with task owner, status (open/complete/blocked), and due date per step; updated each close cycle |
| `budgets/annual/budget-2025.xlsx` | Board-approved operating budget; never modified post-approval — variances are explained against this baseline |
| `compliance/audit/audit-prep-checklist.md` | PBC (prepared by client) checklist for year-end audit; tracks document status and auditor receipt confirmation |
| `reports/investor-updates/investor-update-template.md` | Standard investor letter format: headline metrics, narrative, key milestones, asks — used every monthly update |
| `docs/chart-of-accounts.xlsx` | Canonical COA — any new account added to QuickBooks/Xero/NetSuite must be reflected here with correct financial statement mapping |
| `cap-table/cap-table-current.xlsx` | Fully-diluted cap table exported from Carta; underpins dilution modeling, 409A inputs, and board reporting |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p finance-analyst-workspace
cd finance-analyst-workspace

# Create .claude structure
mkdir -p .claude/commands

# Create workspace directories
mkdir -p models/3-statement
mkdir -p models/dcf
mkdir -p models/budget-vs-actual
mkdir -p models/scenario
mkdir -p reports/board-packs
mkdir -p reports/investor-updates
mkdir -p reports/management-reporting
mkdir -p close/journal-entries
mkdir -p close/reconciliations
mkdir -p close/trial-balance
mkdir -p budgets/annual
mkdir -p budgets/reforecasts
mkdir -p compliance/audit
mkdir -p compliance/tax
mkdir -p compliance/regulatory/irs-correspondence
mkdir -p docs
mkdir -p cap-table

# Seed key files
touch models/3-statement/assumptions-log.md
touch models/budget-vs-actual/variance-threshold-policy.md
touch close/month-end-close-checklist.md
touch close/close-calendar-2025.md
touch close/gl-recon-checklist.md
touch close/reconciliations/gl-recon-checklist.md
touch budgets/annual/budget-2025-assumptions.md
touch budgets/annual/budget-approval-log.md
touch budgets/reforecasts/reforecast-assumptions.md
touch compliance/audit/audit-prep-checklist.md
touch compliance/tax/tax-calendar-2025.md
touch compliance/tax/state-nexus-tracker.md
touch docs/accounting-policies.md
touch docs/revenue-recognition-policy.md
touch docs/expense-policy.md
touch docs/equity-compensation-summary.md
touch docs/glossary.md
touch cap-table/409a-strike-price-log.md
touch reports/investor-updates/investor-update-template.md

# Seed .claude/commands
touch .claude/commands/variance-analysis.md
touch .claude/commands/model-update.md
touch .claude/commands/board-pack.md
touch .claude/commands/close-checklist.md
touch .claude/commands/scenario-model.md
touch .claude/commands/investor-update.md
touch .claude/commands/budget-reforecast.md

# Install Claude Code skills
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/dcf-model
npx claudient add skill finance/budget-vs-actual
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/financial-plan
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/comps-analysis
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
```

## CLAUDE.md template

```markdown
# Finance Analyst / CFO Workspace

This workspace supports financial operations: model updates, monthly close, board pack creation,
scenario planning, investor reporting, and audit prep — all driven by structured files and slash commands.

---

## What this is

A structured Claude Code workspace for a finance analyst or CFO. Every directory maps to a
distinct finance function. Claude Code reads actuals, budgets, and policy files to produce
accurate, org-specific outputs — not generic financial advice.

---

## Stack

- Excel / Google Sheets — financial models, BvA, scenarios (files live in models/)
- QuickBooks / Xero / NetSuite — GL, AP/AR, trial balance (exports live in close/trial-balance/)
- Notion / Confluence — accounting policies, close docs (docs/)
- Carta — cap table and equity data (cap-table/)
- Slack — close coordination, investor Q&A (MCP: slack)
- PowerPoint / Google Slides — board decks, investor updates (reports/)

---

## Directory conventions

- `models/` — All financial models. Do not store actuals-only exports here; those go in close/.
- `close/` — Month-end close artifacts. One subdirectory per process area: journal-entries/, reconciliations/, trial-balance/.
- `budgets/` — Board-approved budget in budgets/annual/. Reforecasts in budgets/reforecasts/. Never overwrite the approved budget file.
- `reports/` — Outputs. Board packs in board-packs/, investor letters in investor-updates/, management packages in management-reporting/.
- `compliance/` — Audit PBC, tax filings, regulatory documents. Do not store here unless final or near-final.
- `docs/` — Policy documents and reference material. Keep accounting-policies.md and chart-of-accounts.xlsx current.
- `cap-table/` — Carta exports and equity modeling. Refresh cap-table-current.xlsx after every grant or financing event.

---

## Common tasks — exact commands

### Variance and close reporting
```
/variance-analysis may-2025   — Reads models/budget-vs-actual/bva-2025-ytd.xlsx, generates
                                line-item variance commentary for the given period
/close-checklist              — Generates month-end close task list with owners and due dates
/model-update                 — Updates 3-statement model with latest trial balance export
```

### Board and investor reporting
```
/board-pack                   — Compiles current quarter financials, KPIs, scenario summary
                                into board deck narrative and speaker notes
/investor-update              — Drafts monthly investor update letter from current metrics
                                and milestone progress
```

### Budgeting and scenario planning
```
/budget-reforecast            — Builds rolling 4-quarter reforecast with assumption changelog
/scenario-model               — Generates base/bull/bear scenario outputs from driver inputs
```

---

## Conventions Claude must follow

- The board-approved budget file (budgets/annual/budget-2025.xlsx) is read-only. Never propose edits to it.
- Variance commentary must cite the specific line item, the dollar amount, and the percentage. Never write vague commentary like "higher than expected."
- When drafting investor updates, pull metrics from management-reporting/ first. Do not estimate numbers.
- Journal entries must follow the format in close/journal-entries/je-template.csv before suggesting uploads.
- Chart of accounts is the authority on account codes. If a new account is needed, note it explicitly and flag it for the controller to add.
- 409A strike prices in cap-table/409a-strike-price-log.md are confidential — do not include in board packs unless specifically instructed.
- Audit PBC documents in compliance/audit/ are confidential. Do not reference file contents in investor-facing outputs.
- When updating models, always log assumption changes in models/3-statement/assumptions-log.md with date and reason.
- Reforecast files must include a changelog section. Never overwrite a prior reforecast file — create a new versioned file.
- All variance thresholds that trigger mandatory commentary are defined in models/budget-vs-actual/variance-threshold-policy.md.
```

## MCP servers

```json
{
  "mcpServers": {
    "quickbooks": {
      "command": "npx",
      "args": ["-y", "@intuit/mcp-server-quickbooks"],
      "env": {
        "QB_CLIENT_ID": "${QB_CLIENT_ID}",
        "QB_CLIENT_SECRET": "${QB_CLIENT_SECRET}",
        "QB_REALM_ID": "${QB_REALM_ID}",
        "QB_ACCESS_TOKEN": "${QB_ACCESS_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/you/finance-analyst-workspace"
      ]
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"models/budget-vs-actual/\"; then echo \"[BvA hook] Variance file updated — confirm variance-threshold-policy.md has been checked for mandatory commentary requirements.\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"budgets/annual/budget-2025\"; then echo \"[Budget guard] STOP — the approved annual budget file is read-only. Write to budgets/reforecasts/ instead.\"; exit 1; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] If you updated a model, confirm assumption changes are logged in models/3-statement/assumptions-log.md. If you drafted a close document, confirm it is linked in close/month-end-close-checklist.md.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/dcf-model
npx claudient add skill finance/budget-vs-actual
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/financial-plan
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/comps-analysis
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
```

## Related

- [Guide: Claude for Finance Analysts and CFOs](../guides/for-finance-analyst.md)
- [Workflow: Month-End Close](../workflows/month-end-close.md)
- [Workflow: Board Pack Preparation](../workflows/board-pack-prep.md)
- [Workflow: Annual Budgeting](../workflows/annual-budgeting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
