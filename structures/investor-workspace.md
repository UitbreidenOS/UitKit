# Investor / VC Workspace — Project Structure

> For a venture capital or angel investor managing deal flow, due diligence, portfolio monitoring, and LP relations through a structured pipeline of sourcing, IC memos, and quarterly reporting.

## Stack

- **Notion** or **Airtable** — Deal CRM, pipeline kanban, portfolio tracker, company database
- **Carta** — Cap table management, equity tracking, pro-rata rights, option pool modeling
- **AngelList** or **Visible** — LP reporting, fund performance dashboards, investor updates
- **QuickBooks** — Fund accounting, management fee tracking, carried interest calculations
- **Pitchbook** or **Crunchbase** — Market data, comp sets, valuation benchmarks, sector mapping
- **Slack** — Founder channels, co-investor threads, IC async discussion, deal room channels
- **Google Workspace** — Drive for diligence docs, Sheets for KPI tracking, Docs for memos
- **Claude Code** — Deal screening, IC memo drafting, portfolio monitoring, LP report generation

## Directory tree

```
investor-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions (paste the template below)
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── deal-screen.md                     # /deal-screen — takes company URL or deck, outputs structured triage
│       ├── ic-memo.md                         # /ic-memo — full Investment Committee memo from diligence notes
│       ├── portfolio-update.md                # /portfolio-update — monthly KPI narrative from raw metrics
│       ├── lp-report.md                       # /lp-report — quarterly LP letter with fund performance summary
│       ├── founder-update.md                  # /founder-update — structured response to founder monthly update
│       ├── market-thesis.md                   # /market-thesis — sector thesis doc from research inputs
│       └── due-diligence.md                   # /due-diligence — full diligence checklist + findings synthesis
├── pipeline/
│   ├── sourcing/                              # Inbound and outbound leads not yet met
│   │   ├── _template/
│   │   │   └── initial-screen.md              # Blank screening form — company, stage, thesis fit, source
│   │   ├── acme-ai/
│   │   │   └── initial-screen.md              # First-pass screen: traction, team, market, ask
│   │   ├── beta-biotech/
│   │   │   └── initial-screen.md
│   │   └── gamma-fintech/
│   │       └── initial-screen.md
│   ├── first-meeting/                         # Screened in — first founder call scheduled or completed
│   │   ├── delta-robotics/
│   │   │   ├── initial-screen.md              # Screen notes carried from sourcing
│   │   │   └── first-meeting-notes.md         # Raw call notes — founder background, product, ask, signals
│   │   └── epsilon-health/
│   │       ├── initial-screen.md
│   │       └── first-meeting-notes.md
│   ├── diligence/                             # Active diligence — deeper reference checks, financials, tech
│   │   ├── zeta-infra/
│   │   │   ├── initial-screen.md
│   │   │   ├── first-meeting-notes.md
│   │   │   ├── diligence-tracker.md           # Open items, owners, deadlines across all workstreams
│   │   │   ├── financial-review.md            # Revenue model, unit economics, burn, runway analysis
│   │   │   ├── tech-audit-notes.md            # Architecture review, scalability, security posture
│   │   │   ├── reference-checks/              # Structured reference check transcripts
│   │   │   │   ├── ref-cto-john-doe.md
│   │   │   │   └── ref-customer-acme.md
│   │   │   └── data-room/                     # Mirror of founder-shared documents
│   │   │       ├── .gitkeep
│   │   │       └── cap-table-summary.md       # Extracted cap table summary from Carta export
│   │   └── eta-saas/
│   │       ├── diligence-tracker.md
│   │       ├── financial-review.md
│   │       └── reference-checks/
│   │           └── .gitkeep
│   ├── ic/                                    # IC memo complete — pending Investment Committee vote
│   │   └── theta-marketplace/
│   │       ├── ic-memo.md                     # Final IC memo — investment thesis, risks, terms, recommendation
│   │       ├── diligence-tracker.md
│   │       ├── financial-review.md
│   │       └── comps-analysis.md              # Public and private comparable companies, valuation benchmarks
│   ├── closed/                                # Investments made — move to portfolio/ after close
│   │   └── iota-logistics/
│   │       ├── ic-memo.md
│   │       ├── closing-checklist.md           # Wire confirmation, Carta update, pro-rata tracking
│   │       └── post-close-intro.md            # Post-close intro email to portfolio resources
│   └── passed/                                # Declined deals with pass rationale for future reference
│       ├── kappa-crypto/
│       │   ├── initial-screen.md
│       │   └── pass-rationale.md              # Why we passed — thesis misfit, valuation, team, market timing
│       └── lambda-hr-tech/
│           ├── initial-screen.md
│           └── pass-rationale.md
├── portfolio/                                 # One folder per active portfolio company
│   ├── _template/                             # Copy this when closing a new investment
│   │   ├── memo.md                            # IC memo (copied from pipeline/closed/)
│   │   ├── cap-table.md                       # Ownership %, shares, option pool, last round terms
│   │   ├── kpis.md                            # Monthly KPI log — ARR, growth, burn, headcount, NRR
│   │   ├── updates/                           # Founder monthly updates, archived chronologically
│   │   │   └── .gitkeep
│   │   └── board-notes/                       # Board meeting prep and post-meeting notes
│   │       └── .gitkeep
│   ├── acme-series-a/                         # Real portfolio company (closed deal, now active)
│   │   ├── memo.md                            # Original IC memo
│   │   ├── cap-table.md                       # Current cap table summary from Carta
│   │   ├── kpis.md                            # Running KPI table updated monthly
│   │   ├── updates/
│   │   │   ├── 2026-05-update.md              # May 2026 founder update — annotated with highlights
│   │   │   └── 2026-04-update.md
│   │   └── board-notes/
│   │       ├── 2026-05-board-prep.md          # Board deck outline, agenda, questions to raise
│   │       └── 2026-05-board-notes.md         # Post-board action items and decisions
│   └── beta-seed/
│       ├── memo.md
│       ├── cap-table.md
│       ├── kpis.md
│       ├── updates/
│       │   └── 2026-05-update.md
│       └── board-notes/
│           └── .gitkeep
├── memos/                                     # All investment memos, pass memos, deal notes in one place
│   ├── ic-memos/                              # Investment Committee memos (approved deals)
│   │   ├── 2026-05-acme-series-a.md
│   │   └── 2026-03-beta-seed.md
│   ├── deal-memos/                            # Shorter deal briefs for first-meeting or early diligence
│   │   ├── 2026-06-zeta-infra-brief.md
│   │   └── 2026-05-eta-saas-brief.md
│   └── pass-memos/                            # Documented pass rationale — searchable for future pattern matching
│       ├── 2026-05-kappa-crypto-pass.md
│       └── 2026-04-lambda-hr-tech-pass.md
├── lp/                                        # LP-facing materials and fund performance tracking
│   ├── quarterly-reports/
│   │   ├── 2026-q1-lp-report.md              # Q1 2026 LP letter — fund performance, portfolio highlights
│   │   └── 2025-q4-lp-report.md
│   ├── annual-reports/
│   │   └── 2025-annual-report.md             # Annual fund summary — IRR, DPI, RVPI, top performers
│   ├── fund-performance/
│   │   ├── nav-tracker.md                     # Net Asset Value by quarter — marked portfolio values
│   │   └── cash-flow-log.md                  # Capital calls, distributions, management fee draws
│   └── lp-communications/
│       ├── capital-call-notice-template.md    # Standard capital call notice with wiring instructions
│       └── distribution-notice-template.md   # Distribution notice format for realized exits
├── thesis/                                    # Market theses and sector research
│   ├── ai-infrastructure-thesis.md           # Full sector thesis — market map, timing, target profile
│   ├── climate-tech-thesis.md
│   ├── fintech-thesis.md
│   └── sector-notes/                          # Raw research notes feeding into thesis docs
│       ├── ai-infra-market-data.md
│       └── climate-founding-team-patterns.md
├── diligence/                                 # Reusable diligence templates and checklists
│   ├── reference-check-template.md           # Structured reference interview guide — 12 standard questions
│   ├── financial-review-checklist.md         # Financials diligence checklist — model, assumptions, red flags
│   ├── tech-audit-template.md                # Technical diligence guide — architecture, security, scalability
│   ├── legal-review-checklist.md             # Legal diligence — IP, employment, contracts, litigation
│   └── founder-background-check.md           # Founder track record, references, LinkedIn verification
└── scratch/
    ├── weekly-deal-notes.md                  # Informal staging area for notes before filing to pipeline
    └── research-staging.md                   # Raw market research clips before formatting into thesis docs
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/deal-screen.md` | Slash command that accepts a company URL, deck PDF summary, or AngelList profile and returns a structured triage: thesis fit, team signal, market size, traction, red flags, and recommended next step |
| `.claude/commands/ic-memo.md` | Slash command that generates a full Investment Committee memo from diligence notes — investment thesis, market analysis, team assessment, risks and mitigants, proposed terms, and recommendation |
| `.claude/commands/lp-report.md` | Slash command that takes fund performance data and portfolio highlights and produces a quarterly LP letter in the fund's voice — performance summary, portfolio updates, new investments, outlook |
| `.claude/commands/due-diligence.md` | Slash command that synthesizes reference check transcripts, financial review notes, and tech audit notes into a structured findings document with open items and IC readiness assessment |
| `pipeline/diligence/_template/diligence-tracker.md` | Master tracker for all open diligence items across workstreams — owner, deadline, status — updated daily during active diligence |
| `portfolio/_template/kpis.md` | Monthly KPI log template covering ARR, MoM growth, burn rate, runway, headcount, NRR, and gross margin — used to generate portfolio-update narratives |
| `lp/fund-performance/nav-tracker.md` | Quarterly NAV by portfolio company — marked values, ownership %, implied returns — feeds directly into LP reports and annual fund summary |
| `diligence/reference-check-template.md` | Structured 12-question reference interview guide covering founder capabilities, working style, weaknesses, and company-specific concerns — used for every diligence process |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p investor-workspace

# Create .claude structure
mkdir -p investor-workspace/.claude/commands

# Create pipeline stage directories with templates
mkdir -p investor-workspace/pipeline/sourcing/_template
mkdir -p investor-workspace/pipeline/first-meeting
mkdir -p investor-workspace/pipeline/diligence/_template/reference-checks
mkdir -p investor-workspace/pipeline/diligence/_template/data-room
mkdir -p investor-workspace/pipeline/ic
mkdir -p investor-workspace/pipeline/closed
mkdir -p investor-workspace/pipeline/passed

# Create portfolio template
mkdir -p investor-workspace/portfolio/_template/updates
mkdir -p investor-workspace/portfolio/_template/board-notes

# Create memo categories
mkdir -p investor-workspace/memos/ic-memos
mkdir -p investor-workspace/memos/deal-memos
mkdir -p investor-workspace/memos/pass-memos

# Create LP directories
mkdir -p investor-workspace/lp/quarterly-reports
mkdir -p investor-workspace/lp/annual-reports
mkdir -p investor-workspace/lp/fund-performance
mkdir -p investor-workspace/lp/lp-communications

# Create thesis and diligence directories
mkdir -p investor-workspace/thesis/sector-notes
mkdir -p investor-workspace/diligence
mkdir -p investor-workspace/scratch

# Seed .gitkeep placeholders
touch investor-workspace/pipeline/diligence/_template/reference-checks/.gitkeep
touch investor-workspace/pipeline/diligence/_template/data-room/.gitkeep
touch investor-workspace/portfolio/_template/updates/.gitkeep
touch investor-workspace/portfolio/_template/board-notes/.gitkeep

# Install finance skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/dcf-model
npx claudient add skill finance/comps-analysis

# Copy command stubs into .claude/commands/
npx claudient add skill finance/deal-screening --output investor-workspace/.claude/commands/deal-screen.md
npx claudient add skill finance/ic-memo --output investor-workspace/.claude/commands/ic-memo.md
npx claudient add skill finance/portfolio-monitor --output investor-workspace/.claude/commands/portfolio-update.md
npx claudient add skill finance/deal-memo --output investor-workspace/.claude/commands/lp-report.md
```

## CLAUDE.md template

```markdown
# Investor Workspace — Claude Code Instructions

## What this is

This is the working directory for a venture capital or angel investor managing deal flow,
diligence, portfolio monitoring, and LP relations. Pipeline stages live in pipeline/,
active investments in portfolio/, IC memos in memos/, LP materials in lp/, and sector
research in thesis/. All deal screening, memo drafting, and reporting runs through Claude Code.

## Stack

- Notion / Airtable — Deal CRM and portfolio database; pipeline kanban by stage
- Carta — Cap table of record; export summaries to portfolio/<company>/cap-table.md
- AngelList / Visible — LP reporting portal; quarterly reports drafted in lp/quarterly-reports/
- QuickBooks — Fund accounting; management fees, capital calls, distributions
- Pitchbook / Crunchbase — Market data and comps; export data to thesis/sector-notes/ and memos
- Slack — Founder channels and co-investor deal rooms; relevant threads pasted into deal folders
- Google Workspace — Shared diligence data rooms; mirror key docs to pipeline/diligence/<co>/data-room/

## Common tasks and exact commands

### Screen an inbound deal
```
/deal-screen

Company: [name]
URL: [website or AngelList profile]
Stage: [seed / Series A / Series B]
Sector: [category]
Ask: $[amount] at $[valuation] cap
Source: [inbound / warm intro from X / outbound]
Deck summary or key metrics: [paste or describe]
```

### Draft an IC memo
```
/ic-memo

Company: [name], Stage: [round], Sector: [category]
Ask: $[amount], Valuation: $[post-money]
Investment thesis: [1-2 sentences on why now and why us]
Market: [TAM, growth rate, key dynamics]
Team: [founder backgrounds, relevant experience]
Traction: [ARR, growth rate, key customers, NRR]
Risks: [top 3 risks and proposed mitigants]
Comparable deals: [comps with entry multiples]
Diligence notes: [paste key findings from financial-review.md and reference-checks/]
```

### Synthesize a monthly portfolio update
```
/portfolio-update

Company: [name]
Month: [Month YYYY]
Raw update from founder: [paste founder monthly update email or notes]
Prior month KPIs: [paste from portfolio/<company>/kpis.md]
Board notes context: [any open action items or concerns]
```

### Draft a quarterly LP report
```
/lp-report

Quarter: Q[X] [YEAR]
Fund: [Fund name and vintage]
NAV this quarter: $[X]M (prior quarter: $[Y]M)
New investments: [company, amount, stage]
Portfolio highlights: [top 2-3 wins — revenue milestones, follow-on rounds, partnerships]
Write-downs or concerns: [any marks to flag]
Market outlook: [macro context relevant to fund thesis]
Fund performance: [IRR, DPI, RVPI if available]
```

### Screen a reference for a portfolio company or diligence
```
/due-diligence

Company: [name]
Diligence stage: [reference checks / financial review / tech audit / full synthesis]
Open items: [paste from pipeline/diligence/<co>/diligence-tracker.md]
Findings to date: [paste financial-review.md or reference-check transcripts]
IC date: [target date for memo completion]
```

### Build a market thesis
```
/market-thesis

Sector: [category]
Thesis question: [what specific bet are we making?]
Market data: [paste from Pitchbook/Crunchbase export or sector-notes/]
Comparable funds and investments: [who else is investing, what are the signals?]
Target company profile: [stage, geography, founder type, revenue range]
Thesis risks: [what would make this thesis wrong?]
```

### Respond to a founder monthly update
```
/founder-update

Company: [name]
Founder update: [paste full update]
Our ownership: [%], Investment date: [date], Last board: [date]
Open action items from last board: [list]
Key concerns to address: [board-level concerns, if any]
```

## Conventions to follow

- All pipeline deals move through stages: sourcing → first-meeting → diligence → ic → closed or passed
- When a deal is closed, copy the IC memo to portfolio/<company>/memo.md and create the full portfolio folder
- Pass rationale is always documented in pipeline/passed/<company>/pass-rationale.md — never delete screened deals
- Founder updates are stored in portfolio/<company>/updates/YYYY-MM-update.md — one file per month
- KPIs are appended (never overwritten) in portfolio/<company>/kpis.md — running table with dated rows
- Reference check transcripts go in pipeline/diligence/<company>/reference-checks/ref-<name>.md
- All IC memos are also filed in memos/ic-memos/YYYY-MM-<company>.md after IC vote
- NAV tracker in lp/fund-performance/nav-tracker.md is updated every quarter before LP report is sent
- Diligence trackers remain open until IC memo is submitted — close items with date and outcome, not deletion
```

## MCP servers

```json
{
  "mcpServers": {
    "crunchbase": {
      "command": "npx",
      "args": ["-y", "@crunchbase/mcp-server"],
      "env": {
        "CRUNCHBASE_API_KEY": "your-crunchbase-api-key"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@slack/mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-slack-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/investor-workspace"
      ]
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"ic-memo.md\"; then echo \"[hook] IC memo written — file a copy to memos/ic-memos/ with YYYY-MM-<company> naming before the IC call\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"pass-rationale.md\"; then echo \"[hook] Pass memo saved — confirm the deal is moved from pipeline/diligence/ or pipeline/first-meeting/ to pipeline/passed/\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOM=$(date +%d); if [ \"$DOM\" = \"01\" ]; then echo \"[reminder] First of month — update portfolio KPI logs (portfolio/<company>/kpis.md) and prepare portfolio-update narratives for board visibility\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core investor skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/dcf-model
npx claudient add skill finance/comps-analysis

# Supporting finance and research skills
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/reference-check-synthesizer
npx claudient add skill finance/market-sizing
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Install all finance skills at once
npx claudient add skills finance
```

## Related

- [Investor guide](../guides/for-investor.md)
- [Deal flow workflow](../workflows/deal-flow.md)
- [IC memo workflow](../workflows/ic-memo-process.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
