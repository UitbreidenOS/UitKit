# Investment Fund / VC Operations — Project Structure

> For a venture capital fund or family office managing deal sourcing through LP reporting, with structured pipeline stages, per-company diligence rooms, portfolio KPI tracking, and fund administration.

## Stack

- **Notion** or **Airtable** — Deal CRM, pipeline kanban, portfolio company database, LP roster
- **Carta** — Cap table management, fund administration, equity issuance, pro-rata tracking
- **Visible** or **Synaptic** — LP reporting portal, fund performance dashboards, portfolio metrics aggregation
- **Pitchbook** or **Crunchbase** — Market data, comparable company sets, valuation benchmarks, sector mapping
- **QuickBooks** — Fund accounting, management fee invoicing, capital call accounting, waterfall modeling
- **DocuSign** — Term sheet execution, subscription agreements, LP side letters, board consents
- **Google Workspace** — Shared Drive for data rooms, Sheets for KPI trackers, Docs for collaborative memos
- **Claude Code** — Deal screening, IC memo drafting, diligence synthesis, LP report generation, thesis research

## Directory tree

```
investment-fund/
├── .claude/
│   ├── CLAUDE.md                                      # Fund-wide Claude Code instructions (paste template below)
│   ├── settings.json                                  # MCP servers, hooks, tool permissions
│   └── commands/
│       ├── deal-screen.md                             # /deal-screen — triage inbound deal from URL or deck summary
│       ├── first-look.md                              # /first-look — one-pager brief after first founder meeting
│       ├── diligence-brief.md                         # /diligence-brief — synthesize open diligence items into IC-ready summary
│       ├── ic-memo.md                                 # /ic-memo — full Investment Committee memo from diligence notes
│       ├── pass-memo.md                               # /pass-memo — documented pass rationale for pipeline/passed/
│       ├── portfolio-update.md                        # /portfolio-update — monthly KPI narrative from founder update
│       ├── board-prep.md                              # /board-prep — board deck outline, agenda questions, action items
│       ├── lp-report.md                               # /lp-report — quarterly LP letter with fund performance and portfolio highlights
│       ├── capital-call.md                            # /capital-call — capital call notice draft with wiring instructions
│       ├── market-thesis.md                           # /market-thesis — sector thesis doc from raw research inputs
│       └── exit-analysis.md                          # /exit-analysis — exit scenario modeling and exit thesis narrative
├── pipeline/
│   ├── sourcing/                                      # All inbound and outbound leads not yet screened
│   │   ├── deal-tracker.md                            # Master log: company, stage, source, date, thesis fit, status
│   │   ├── thesis-signals.md                         # Emerging patterns — themes, sectors, founder profiles worth tracking
│   │   └── _template/
│   │       └── initial-screen.md                     # Blank screening form: company, stage, ask, source, thesis fit, red flags
│   ├── first-look/                                    # Screened in — one-pager written, first meeting scheduled or done
│   │   ├── _template/
│   │   │   └── one-pager.md                          # One-pager template: business, team, market, traction, ask, fit
│   │   ├── acme-ai/
│   │   │   └── one-pager.md                          # First-look brief: problem, solution, team, traction, ask
│   │   ├── brightpath-health/
│   │   │   └── one-pager.md
│   │   └── circuitworks-infra/
│   │       └── one-pager.md
│   ├── diligence/                                     # Active deep diligence — IC memo in progress
│   │   ├── _template/
│   │   │   ├── market-research.md                    # Market sizing, competitive landscape, timing thesis
│   │   │   ├── team-check.md                         # Founder background, references, track record, red flags
│   │   │   ├── financial-model.md                    # Revenue model review, unit economics, burn, runway, sensitivity
│   │   │   ├── tech-diligence.md                     # Architecture, scalability, security, technical debt assessment
│   │   │   ├── legal-diligence.md                   # IP ownership, employment contracts, cap table clean-up, litigation
│   │   │   └── diligence-tracker.md                  # Open items by workstream — owner, deadline, status, blockers
│   │   ├── dawnrise-climate/
│   │   │   ├── market-research.md
│   │   │   ├── team-check.md
│   │   │   ├── financial-model.md
│   │   │   ├── tech-diligence.md
│   │   │   ├── legal-diligence.md
│   │   │   ├── diligence-tracker.md
│   │   │   └── reference-checks/
│   │   │       ├── ref-ceo-former-manager.md         # Structured reference: capabilities, weaknesses, working style
│   │   │       ├── ref-cto-cofounder.md
│   │   │       └── ref-customer-series-b-lead.md
│   │   └── edgewise-fintech/
│   │       ├── market-research.md
│   │       ├── team-check.md
│   │       ├── financial-model.md
│   │       ├── tech-diligence.md
│   │       ├── legal-diligence.md
│   │       ├── diligence-tracker.md
│   │       └── reference-checks/
│   │           └── ref-angel-lead.md
│   ├── ic/                                            # IC memo submitted — pending Investment Committee vote
│   │   └── foundry-robotics/
│   │       ├── ic-memo.md                            # Final IC memo: thesis, market, team, financials, risks, terms, rec
│   │       ├── comps-analysis.md                     # Public and private comps with entry multiples and implied valuation
│   │       ├── financial-model.md
│   │       └── diligence-tracker.md                  # Closed items with outcome notes
│   ├── closed/                                        # Signed term sheet or wire sent — promoted to portfolio/
│   │   └── greenmark-saas/
│   │       ├── ic-memo.md
│   │       ├── term-sheet.md                         # Executed term sheet: valuation, pro-rata, board seat, protective provisions
│   │       ├── closing-checklist.md                  # Wire confirmed, Carta updated, DocuSign complete, pro-rata logged
│   │       └── post-close-intro.md                  # Intro email to portfolio resources — legal, talent, GTM
│   └── passed/                                        # Declined deals — documented with pass rationale
│       ├── _template/
│       │   └── pass-rationale.md                    # Why we passed: category, core reason, signals that might change our mind
│       ├── halcyon-crypto/
│       │   ├── one-pager.md
│       │   └── pass-rationale.md
│       └── inkdrop-hr-tech/
│           ├── one-pager.md
│           └── pass-rationale.md
├── memos/                                             # All IC memos and pass memos in one searchable location
│   ├── investment-memos/
│   │   ├── 2026-05-greenmark-saas.md               # IC memo archived after close
│   │   ├── 2026-03-foundry-robotics.md
│   │   └── 2025-11-apex-data.md
│   └── pass-memos/
│       ├── 2026-04-halcyon-crypto.md
│       └── 2026-02-inkdrop-hr-tech.md
├── portfolio/                                         # One folder per active portfolio company
│   ├── _template/                                    # Copy when a new investment closes
│   │   ├── memo.md                                  # IC memo (copied from pipeline/closed/)
│   │   ├── cap-table.md                             # Ownership %, shares, option pool, round terms
│   │   ├── board-deck-notes/
│   │   │   └── .gitkeep                             # Board prep and post-meeting notes per quarter
│   │   ├── kpis/
│   │   │   └── kpi-log.md                          # Monthly KPI table: ARR, MoM growth, burn, runway, headcount, NRR
│   │   ├── capital-plan/
│   │   │   └── capital-plan.md                     # Next-round timeline, expected raise, pro-rata allocation, reserve model
│   │   └── exit-thesis/
│   │       └── exit-thesis.md                      # Exit paths: acquirers, IPO readiness, hold vs. sell framework
│   ├── greenmark-saas/
│   │   ├── memo.md
│   │   ├── cap-table.md
│   │   ├── board-deck-notes/
│   │   │   ├── 2026-q1-board-prep.md               # Q1 board prep: agenda, questions, action items to track
│   │   │   ├── 2026-q1-board-notes.md              # Post-board: decisions, action items, follow-ups
│   │   │   └── 2026-q2-board-prep.md
│   │   ├── kpis/
│   │   │   └── kpi-log.md                          # Running KPI table with monthly rows
│   │   ├── capital-plan/
│   │   │   └── capital-plan.md
│   │   └── exit-thesis/
│   │       └── exit-thesis.md
│   └── apex-data/
│       ├── memo.md
│       ├── cap-table.md
│       ├── board-deck-notes/
│       │   └── 2026-q1-board-notes.md
│       ├── kpis/
│       │   └── kpi-log.md
│       ├── capital-plan/
│       │   └── capital-plan.md
│       └── exit-thesis/
│           └── exit-thesis.md
├── lp-relations/                                      # All LP-facing materials, communications, and fund performance
│   ├── lp-roster.md                                  # LP list: name, entity, commitment, wire instructions, contact
│   ├── quarterly-updates/
│   │   ├── 2026-q1-lp-update.md                    # Q1 2026 LP letter: NAV, new investments, portfolio highlights
│   │   ├── 2025-q4-lp-update.md
│   │   └── 2025-q3-lp-update.md
│   ├── annual-reports/
│   │   └── 2025-annual-report.md                   # Annual summary: IRR, DPI, RVPI, top performers, thesis progress
│   └── capital-call-notices/
│       ├── _template/
│       │   └── capital-call-notice.md              # Standard notice with call amount, wiring instructions, deadline
│       ├── 2026-04-capital-call-2.md               # Capital Call #2 — Greenmark investment
│       └── 2025-10-capital-call-1.md               # Capital Call #1 — Apex Data investment
├── thesis/                                            # Sector research and investment theses
│   ├── sector-theses/
│   │   ├── ai-infrastructure.md                    # Full sector thesis: market map, timing, target profile, risks
│   │   ├── climate-tech.md
│   │   ├── fintech-infrastructure.md
│   │   └── vertical-saas.md
│   └── market-maps/
│       ├── ai-infra-market-map.md                  # Landscape by layer: compute, training, inference, tooling, apps
│       ├── climate-market-map.md
│       └── fintech-rails-market-map.md
├── fund-admin/                                        # Fund-level administration and legal compliance
│   ├── cap-table-summary.md                         # Fund-level cap table: all portfolio companies, ownership %, cost basis
│   ├── waterfall-model.md                           # Carried interest waterfall: hurdle rate, catch-up, carry split, LP/GP split
│   ├── compliance-calendar.md                       # Filing deadlines: K-1s, FBAR, state registrations, RIA filings
│   ├── management-fee-tracker.md                   # Management fee schedule, payments received, reconciliation with QuickBooks
│   └── reserve-model.md                            # Follow-on reserve model: pro-rata rights by company, allocation targets
└── scratch/
    ├── weekly-deal-notes.md                         # Staging area for raw sourcing notes before filing to pipeline
    └── research-clips.md                            # Raw market data and press clippings before formatting into thesis docs
```

## Key files explained

| Path | Purpose |
|---|---|
| `pipeline/sourcing/deal-tracker.md` | Master sourcing log with every inbound and outbound lead — company, stage, source, thesis fit score (1-5), owner, date first seen, current status; never delete entries, only update status |
| `pipeline/diligence/_template/diligence-tracker.md` | Per-company tracker for all open items across five workstreams (market, team, financial, tech, legal) — owner, deadline, status, IC-blocking flag; stays open until IC memo is submitted |
| `pipeline/diligence/_template/financial-model.md` | Standardized financial diligence file covering revenue model review, unit economics table, burn and runway calculation, sensitivity assumptions, and red flags; feeds directly into IC memo financials section |
| `memos/investment-memos/` | Canonical archive of all approved IC memos filed as `YYYY-MM-<company>.md` after IC vote — searchable for comp valuations, thesis evolution, and pattern matching |
| `portfolio/_template/kpis/kpi-log.md` | Monthly KPI table template with columns for ARR, MoM revenue growth, gross margin, burn rate, runway (months), headcount, NRR, and pipeline coverage ratio — appended monthly, never overwritten |
| `lp-relations/lp-roster.md` | LP master list with legal entity name, commitment amount, called capital to date, uncalled commitment, wire instructions, side letter flags, and primary contact — source of truth for capital call notices |
| `lp-relations/capital-call-notices/` | Executed capital call notices stored by date — `YYYY-MM-capital-call-N.md` — used for LP reconciliation and QuickBooks capital account entries |
| `fund-admin/waterfall-model.md` | Carried interest waterfall with hurdle rate, preferred return, catch-up provision, and GP/LP split — updated at each exit or realization event |
| `fund-admin/compliance-calendar.md` | Annual compliance calendar with K-1 delivery deadlines, state blue sky filings, RIA annual amendment dates, FBAR if applicable, and audit timeline |

## Quick scaffold

```bash
# Create workspace root
mkdir -p investment-fund

# Create .claude command stubs
mkdir -p investment-fund/.claude/commands

# Create pipeline stage directories
mkdir -p investment-fund/pipeline/sourcing/_template
mkdir -p investment-fund/pipeline/first-look/_template
mkdir -p investment-fund/pipeline/diligence/_template/reference-checks
mkdir -p investment-fund/pipeline/ic
mkdir -p investment-fund/pipeline/closed
mkdir -p investment-fund/pipeline/passed/_template

# Create memo archive
mkdir -p investment-fund/memos/investment-memos
mkdir -p investment-fund/memos/pass-memos

# Create portfolio template
mkdir -p investment-fund/portfolio/_template/board-deck-notes
mkdir -p investment-fund/portfolio/_template/kpis
mkdir -p investment-fund/portfolio/_template/capital-plan
mkdir -p investment-fund/portfolio/_template/exit-thesis

# Create LP relations directories
mkdir -p investment-fund/lp-relations/quarterly-updates
mkdir -p investment-fund/lp-relations/annual-reports
mkdir -p investment-fund/lp-relations/capital-call-notices/_template

# Create thesis directories
mkdir -p investment-fund/thesis/sector-theses
mkdir -p investment-fund/thesis/market-maps

# Create fund admin directory
mkdir -p investment-fund/fund-admin

# Create scratch
mkdir -p investment-fund/scratch

# Seed placeholder files
touch investment-fund/pipeline/sourcing/deal-tracker.md
touch investment-fund/pipeline/sourcing/thesis-signals.md
touch investment-fund/fund-admin/cap-table-summary.md
touch investment-fund/fund-admin/waterfall-model.md
touch investment-fund/fund-admin/compliance-calendar.md
touch investment-fund/fund-admin/management-fee-tracker.md
touch investment-fund/fund-admin/reserve-model.md
touch investment-fund/lp-relations/lp-roster.md
touch investment-fund/scratch/weekly-deal-notes.md
touch investment-fund/scratch/research-clips.md

# Seed .gitkeep placeholders in empty template dirs
touch investment-fund/portfolio/_template/board-deck-notes/.gitkeep
touch investment-fund/portfolio/_template/kpis/.gitkeep
touch investment-fund/portfolio/_template/capital-plan/.gitkeep
touch investment-fund/portfolio/_template/exit-thesis/.gitkeep

# Install fund operations skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/ic-memo
npx claudient add skill finance/diligence-synthesis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/market-sizing
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/exit-modeling
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
```

## CLAUDE.md template

```markdown
# Investment Fund — Claude Code Instructions

## What this is

This is the working directory for a venture capital fund managing end-to-end deal flow,
portfolio monitoring, LP reporting, and fund administration. Pipeline stages live in
pipeline/ (sourcing → first-look → diligence → ic → closed or passed), active investments
in portfolio/ (one folder per company), IC and pass memos in memos/, LP materials in
lp-relations/, sector research in thesis/, and fund operations in fund-admin/.

All deal screening, IC memo drafting, diligence synthesis, LP reporting, and board prep
runs through Claude Code slash commands in .claude/commands/.

## Stack

- Notion / Airtable — Deal CRM and portfolio database; pipeline kanban by stage; LP roster
- Carta — Cap table of record; export summaries to portfolio/<company>/cap-table.md
- Visible / Synaptic — LP reporting portal; quarterly updates drafted in lp-relations/quarterly-updates/
- Pitchbook / Crunchbase — Market data and comps; exports go to thesis/ and diligence files
- QuickBooks — Fund accounting; capital calls, management fees, distributions reconciled here
- DocuSign — Term sheets, subscription agreements, LP side letters; executed copies in fund-admin/
- Google Workspace — Shared Drive mirrors to pipeline/diligence/<company>/data-room/ for offline reference

## Common tasks and exact commands

### Screen an inbound deal
```
/deal-screen

Company: [name]
URL: [website or Crunchbase/Pitchbook profile]
Stage: [pre-seed / seed / Series A / Series B]
Sector: [category]
Ask: $[amount] at $[pre-money or post-money] valuation
Source: [inbound / warm intro from X / conference / cold outbound]
Deck or key metrics: [paste or describe — ARR, growth rate, team background]
Thesis fit check: [which sector thesis does this map to?]
```

### Write a first-look one-pager
```
/first-look

Company: [name], Stage: [round], Sector: [category]
Meeting notes: [paste raw first-meeting notes]
Deck highlights: [paste key slides or describe]
Team background: [CEO and CTO bios and prior experience]
Traction: [ARR, MoM growth, customer count, NRR if available]
Ask: $[amount] at $[valuation], closing: [date or open]
Initial thesis fit: [why this fits or stretches our thesis]
Open questions before diligence: [what needs to be true to proceed]
```

### Synthesize diligence into IC-ready brief
```
/diligence-brief

Company: [name], Stage: [round], IC target date: [date]
Market research findings: [paste from diligence/<company>/market-research.md]
Team check findings: [paste from diligence/<company>/team-check.md]
Financial model review: [paste from diligence/<company>/financial-model.md]
Tech diligence notes: [paste from diligence/<company>/tech-diligence.md]
Legal diligence notes: [paste from diligence/<company>/legal-diligence.md]
Open items remaining: [paste open rows from diligence-tracker.md]
Key risks to address in memo: [top 3 that IC will challenge]
```

### Draft a full IC memo
```
/ic-memo

Company: [name], Stage: [round], Sector: [category]
Investment amount: $[amount], Valuation: $[post-money], Ownership: [%]
Investment thesis: [1-2 sentences — why this company, why now, why us]
Market: [TAM, SAM, growth rate, structural tailwinds, timing thesis]
Team: [founder backgrounds, domain expertise, references summary]
Product: [core wedge, differentiation, moat, roadmap]
Traction: [ARR, MoM growth, NRR, gross margin, customer count, burn, runway]
Risks and mitigants: [top 3-4 risks with specific proposed mitigants]
Comparable deals: [3-5 comps with stage, valuation, multiple at exit if available]
Terms: [lead, pro-rata, board seat, protective provisions, side letter flags]
Recommendation: [Invest / Pass / More diligence needed]
```

### Draft a quarterly LP report
```
/lp-report

Quarter: Q[X] [YEAR]
Fund: [Fund name and vintage]
Total fund size: $[X]M, Deployed to date: $[Y]M, Uncalled: $[Z]M
NAV this quarter: $[X]M (prior quarter: $[Y]M)
Gross IRR: [%], Net IRR: [%], DPI: [X]x, RVPI: [Y]x, TVPI: [Z]x
New investments this quarter: [company, amount, stage, sector]
Portfolio highlights: [top 2-3 milestones — rounds closed, revenue growth, key hires, partnerships]
Concerns or write-downs: [any marks or portfolio challenges to address]
Upcoming: [expected closings, capital calls, portfolio events next quarter]
Market outlook: [macro context relevant to fund thesis — 2-3 sentences]
```

### Draft a capital call notice
```
/capital-call

Call number: [#N]
Investment triggering call: [company name], Amount invested: $[X]
Call amount per LP: [proportional to commitment or specify]
Wire deadline: [date]
Wire instructions: [from fund-admin/ or specify]
Purpose note: [standard language or specific investment note]
LP roster: [paste from lp-relations/lp-roster.md or specify LP count]
```

### Generate board prep for a portfolio company
```
/board-prep

Company: [name], Board date: [date]
Last board action items: [paste from prior board-notes file]
Current KPIs: [paste from portfolio/<company>/kpis/kpi-log.md]
Last founder update: [paste most recent monthly update]
Agenda items: [financials / product roadmap / hiring / fundraising / other]
Key questions to raise: [specific concerns or opportunities to probe]
Decisions to make: [option grants, budget approvals, strategic pivots]
```

### Write an exit thesis for a portfolio company
```
/exit-analysis

Company: [name], Investment date: [date], Cost basis: $[X]M, Current ownership: [%]
Current ARR: $[X]M, Growth rate: [%], Gross margin: [%]
Likely acquirers: [list strategic buyers with rationale for each]
IPO readiness: [revenue scale, growth profile, market conditions needed]
Hold vs. sell framework: [what metrics or events would trigger exit vs. hold]
Comparable exits: [recent M&A or IPOs in category with multiples]
Target return scenario: [1x / 3x / 5x / 10x scenarios and implied valuation]
```

## Conventions to follow

- Pipeline stages are strictly ordered: sourcing → first-look → diligence → ic → closed or passed
- Every company that reaches first-look gets a one-pager at pipeline/first-look/<company>/one-pager.md
- Diligence folders use five standard files: market-research.md, team-check.md, financial-model.md, tech-diligence.md, legal-diligence.md — do not rename them
- IC memos are filed to memos/investment-memos/YYYY-MM-<company>.md after IC vote regardless of outcome
- When a deal closes, copy the IC memo to portfolio/<company>/memo.md and create the full portfolio folder from _template/
- Pass rationale is always written — file to pipeline/passed/<company>/pass-rationale.md and memos/pass-memos/YYYY-MM-<company>.md
- KPI logs are append-only: add a new row each month, never overwrite prior entries
- Capital call notices are archived in lp-relations/capital-call-notices/YYYY-MM-capital-call-N.md
- LP roster in lp-relations/lp-roster.md is the source of truth for all capital call and distribution notices
- NAV tracker and waterfall model in fund-admin/ are updated within 5 business days of each exit or realization event
- Compliance calendar in fund-admin/compliance-calendar.md is reviewed at the start of each quarter
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/investment-fund"
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
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token"
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
    "airtable": {
      "command": "npx",
      "args": ["-y", "@airtable/mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "your-airtable-api-key",
        "AIRTABLE_BASE_ID": "appXXXXXXXXXXXXXX"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"ic-memo.md\" && echo \"$FILE\" | grep -q \"pipeline/ic/\"; then echo \"[hook] IC memo written in pipeline/ic/ — remember to file a copy to memos/investment-memos/YYYY-MM-<company>.md after the IC vote\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"pass-rationale.md\"; then echo \"[hook] Pass rationale written — also file to memos/pass-memos/YYYY-MM-<company>.md and confirm the company folder is moved to pipeline/passed/\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"capital-call-notices/\" && ! echo \"$FILE\" | grep -q \"_template\"; then echo \"[hook] Capital call notice written — verify LP roster counts match and wire instructions are current before distributing\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOM=$(date +%d); if [ \"$DOM\" -le \"05\" ]; then echo \"[reminder] Early month — check portfolio/<company>/kpis/kpi-log.md entries for last month and review compliance-calendar.md for upcoming deadlines\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core fund operations skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/ic-memo
npx claudient add skill finance/diligence-synthesis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/market-sizing
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/exit-modeling
npx claudient add skill finance/waterfall-model

# Supporting productivity and communication skills
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/investor-update
npx claudient add skill data-ml/stakeholder-report

# Install all finance skills at once
npx claudient add skills finance
```

## Related

- [Investor guide](../guides/for-investor.md)
- [Deal flow workflow](../workflows/deal-flow.md)
- [IC memo process workflow](../workflows/ic-memo-process.md)
- [LP reporting workflow](../workflows/lp-reporting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
