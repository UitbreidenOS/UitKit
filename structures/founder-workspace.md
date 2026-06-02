# Founder / CEO Workspace — Project Structure

> For a startup founder managing strategy, fundraising, hiring, and daily operations — investor updates, board prep, hiring decisions, OKRs, fundraising pipeline, and financial health driven from a single Claude Code workspace.

## Stack

- Notion — strategy docs, team wikis, OKRs, board materials
- Linear — product roadmap, sprint tracking, engineering milestones
- HubSpot or Attio — investor CRM, pipeline stages, relationship tracking
- Gusto or Rippling — HR, payroll, offer letters, headcount records
- Mercury — business banking, cash flow, expense tracking
- Carta — cap table, equity grants, 409A valuations, SAFE/note tracking
- Slack — team communication, investor async updates, hiring channels
- Google Workspace — email, shared docs, data room (Google Drive)

## Directory tree

```
founder-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions for Claude Code
│   ├── settings.json                          # Permissions, hooks, MCP server config
│   └── commands/
│       ├── investor-update.md                 # Draft weekly or monthly investor update email
│       ├── board-prep.md                      # Compile board deck narrative, agenda, pre-reads
│       ├── hiring-decision.md                 # Evaluate candidate, scorecard summary, hire/no-hire rec
│       ├── okr-review.md                      # Grade current OKRs, surface blockers, next quarter draft
│       ├── weekly-brief.md                    # CEO weekly brief — wins, misses, priorities, asks
│       ├── fundraising-status.md              # Snapshot fundraising pipeline, next steps, round health
│       └── competitive-pulse.md               # Competitive landscape update — signal triage, response memo
├── strategy/
│   ├── north-star-metric.md                   # Primary success metric, definition, current value, target
│   ├── company-okrs-2025.md                   # Annual OKRs — objectives, key results, owners, grades
│   ├── company-okrs-q3-2025.md                # Quarterly OKR set with mid-quarter check-in notes
│   ├── annual-plan-2025.md                    # Annual operating plan — headcount, budget, milestones
│   ├── strategic-bets.md                      # 3–5 strategic bets with rationale and success criteria
│   ├── competitive-landscape.md               # Competitor matrix — positioning, pricing, strengths, risks
│   ├── market-map.md                          # TAM/SAM/SOM analysis, segment breakdown, market sizing
│   └── positioning-doc.md                     # ICP, value props, differentiation, messaging pillars
├── fundraising/
│   ├── round-tracker.md                       # Current round status — target, raised, close date, lead
│   ├── investor-pipeline.md                   # Full investor list — stage, last contact, next step, notes
│   ├── term-sheet-tracker.md                  # Term sheets received — key terms, comparison, decision log
│   ├── pitch-deck-v7.md                       # Current pitch deck narrative (Notion export or outline)
│   ├── data-room/
│   │   ├── data-room-index.md                 # Index of all data room documents with access log
│   │   ├── cap-table-summary.md               # Carta cap table snapshot — ownership %, dilution model
│   │   ├── financial-model-q2-2025.xlsx       # Financial model — P&L, runway, unit economics
│   │   ├── corporate-docs-checklist.md        # Incorporation, IP assignment, 409A, audits — status list
│   │   └── customer-references.md             # Reference customers — contact, tier, NPS, availability
│   └── investor-crm/
│       ├── crm-export-2025-06.csv             # HubSpot/Attio pipeline export — latest snapshot
│       ├── warm-intros-needed.md              # Investors requiring warm intro — who can make it
│       └── post-meeting-notes/
│           ├── a16z-partner-2025-05-14.md     # Post-meeting notes — sentiment, questions, next step
│           ├── sequoia-scout-2025-05-21.md    # Post-meeting notes
│           └── notable-capital-2025-06-01.md  # Post-meeting notes
├── hiring/
│   ├── headcount-plan-2025.md                 # Board-approved headcount — role, team, quarter, budget
│   ├── open-roles.md                          # Active requisitions — JD status, recruiter, pipeline count
│   ├── job-descriptions/
│   │   ├── head-of-growth.md                  # JD — Head of Growth / VP Marketing
│   │   ├── senior-engineer-fullstack.md       # JD — Senior Full-Stack Engineer
│   │   ├── chief-of-staff.md                  # JD — Chief of Staff / Operations Lead
│   │   └── account-executive.md               # JD — Account Executive (SMB)
│   ├── scorecards/
│   │   ├── scorecard-template.md              # Canonical interview scorecard template
│   │   ├── eng-scorecard.md                   # Scorecard — engineering roles
│   │   ├── gtm-scorecard.md                   # Scorecard — sales and marketing roles
│   │   └── leadership-scorecard.md            # Scorecard — director and VP level
│   ├── offer-templates/
│   │   ├── offer-letter-template.md           # Standard offer letter template
│   │   ├── equity-grant-explainer.md          # Plain-language equity explanation for candidates
│   │   └── comp-bands-2025.md                 # Compensation bands by level and function
│   └── pipeline-notes/
│       ├── active-candidates.md               # Current candidates — role, stage, next step, decision date
│       └── offers-log.md                      # Offer history — role, comp, equity, accepted/declined
├── board/
│   ├── board-composition.md                   # Current board members — firm, seat type, term, committees
│   ├── board-calendar-2025.md                 # Meeting schedule, expected attendees, recurring agenda
│   ├── materials/
│   │   ├── 2025-q1-board-deck.md              # Q1 board deck narrative and key metrics
│   │   ├── 2025-q2-board-deck.md              # Q2 board deck narrative (current)
│   │   └── ceo-letter-q2-2025.md              # CEO letter to the board — candid context and asks
│   ├── minutes/
│   │   ├── minutes-2025-03-15.md              # Board meeting minutes — Q1 review
│   │   └── minutes-2025-06-10.md              # Board meeting minutes — Q2 review
│   └── resolutions/
│       ├── resolution-option-grant-2025-05.md # Board resolution — option pool grant
│       └── resolution-financing-2025-06.md    # Board resolution — financing authorization
├── finance/
│   ├── runway-model.md                        # Runway analysis — burn rate, months of runway, scenarios
│   ├── cash-flow-forecast-q3-2025.md          # 13-week cash flow forecast
│   ├── unit-economics.md                      # CAC, LTV, payback period, gross margin by segment
│   ├── monthly-financials/
│   │   ├── p-and-l-2025-05.md                 # May P&L — actuals vs budget
│   │   ├── p-and-l-2025-04.md                 # April P&L
│   │   └── balance-sheet-2025-05.md           # May balance sheet snapshot
│   ├── budget-2025.md                         # Full-year budget — opex, headcount, capex by department
│   └── mercury-transactions-2025-06.csv       # Mercury bank export — current month transactions
├── product/
│   ├── product-roadmap-q3-2025.md             # Quarterly roadmap — initiatives, owners, milestones
│   ├── product-vision.md                      # 2-year product vision — where we are going and why
│   ├── prds/
│   │   ├── prd-template.md                    # Canonical PRD template
│   │   ├── prd-onboarding-revamp.md           # PRD — onboarding flow redesign
│   │   └── prd-api-v2.md                      # PRD — public API v2
│   ├── launch-plans/
│   │   ├── launch-api-v2.md                   # Launch plan — API v2 go-to-market
│   │   └── launch-mobile-app.md               # Launch plan — mobile app beta
│   └── metrics/
│       ├── product-kpis.md                    # Core product KPIs — DAU, activation, retention, NPS
│       └── feature-adoption.md                # Feature-level adoption data and insights
└── comms/
    ├── investor-updates/
    │   ├── update-template.md                 # Investor update template — wins, metrics, asks
    │   ├── update-2025-05.md                  # May investor update (sent)
    │   └── update-2025-06-draft.md            # June investor update (draft)
    ├── all-hands/
    │   ├── all-hands-template.md              # All-hands agenda and narrative template
    │   ├── all-hands-2025-06-notes.md         # June all-hands notes and Q&A
    │   └── all-hands-2025-03-notes.md         # March all-hands notes
    └── external/
        ├── press-release-template.md          # PR template for funding announcements and launches
        └── founder-bio.md                     # Current founder bio — long and short versions
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/investor-update.md` | Slash command that reads `finance/runway-model.md`, `strategy/company-okrs-q3-2025.md`, and `comms/investor-updates/update-template.md` to draft a complete investor update with metrics, wins, misses, and asks |
| `.claude/commands/board-prep.md` | Slash command that compiles `finance/monthly-financials/`, `strategy/company-okrs-*.md`, and `product/product-roadmap-*.md` into a board narrative and agenda |
| `.claude/commands/fundraising-status.md` | Slash command that reads `fundraising/investor-pipeline.md` and `fundraising/round-tracker.md` to produce a pipeline health snapshot and suggested next actions |
| `fundraising/data-room/financial-model-q2-2025.xlsx` | Source-of-truth financial model — P&L, runway, unit economics, and headcount plan; referenced in board decks and due diligence |
| `strategy/company-okrs-2025.md` | Annual OKR document with quarterly breakdown, key result owners, and grading rubric — updated each quarter |
| `finance/runway-model.md` | Live runway analysis with current burn rate, cash balance, hiring scenarios, and months-to-zero at each burn level |
| `hiring/comp-bands-2025.md` | Internal compensation bands by function and level — used to sanity-check offers and inform headcount budget |
| `board/materials/ceo-letter-q2-2025.md` | Candid CEO letter to the board — context behind the metrics, risks, and explicit asks not in the deck |
| `fundraising/investor-pipeline.md` | Full investor tracking list with stage, last-contact date, relationship owner, warm intro status, and next action |
| `comms/investor-updates/update-template.md` | Canonical investor update format — metrics table, business highlights, team updates, financials, and asks section |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p founder-workspace
cd founder-workspace

# Create .claude structure
mkdir -p .claude/commands

# Create all workspace directories
mkdir -p strategy
mkdir -p fundraising/data-room
mkdir -p fundraising/investor-crm/post-meeting-notes
mkdir -p hiring/job-descriptions
mkdir -p hiring/scorecards
mkdir -p hiring/offer-templates
mkdir -p hiring/pipeline-notes
mkdir -p board/materials
mkdir -p board/minutes
mkdir -p board/resolutions
mkdir -p finance/monthly-financials
mkdir -p product/prds
mkdir -p product/launch-plans
mkdir -p product/metrics
mkdir -p comms/investor-updates
mkdir -p comms/all-hands
mkdir -p comms/external

# Seed key files
touch strategy/north-star-metric.md
touch strategy/company-okrs-2025.md
touch strategy/competitive-landscape.md
touch fundraising/round-tracker.md
touch fundraising/investor-pipeline.md
touch fundraising/term-sheet-tracker.md
touch fundraising/data-room/data-room-index.md
touch hiring/headcount-plan-2025.md
touch hiring/open-roles.md
touch hiring/scorecards/scorecard-template.md
touch hiring/offer-templates/comp-bands-2025.md
touch hiring/pipeline-notes/active-candidates.md
touch board/board-composition.md
touch board/board-calendar-2025.md
touch finance/runway-model.md
touch finance/cash-flow-forecast-q3-2025.md
touch finance/unit-economics.md
touch finance/budget-2025.md
touch product/product-roadmap-q3-2025.md
touch product/product-vision.md
touch product/prds/prd-template.md
touch product/metrics/product-kpis.md
touch comms/investor-updates/update-template.md
touch comms/all-hands/all-hands-template.md

# Install Claude Code skills
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/engineering-strategy
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/hiring-pipeline

# Install slash commands
npx claudient add command investor-update
npx claudient add command board-prep
npx claudient add command hiring-decision
npx claudient add command okr-review
npx claudient add command weekly-brief
npx claudient add command fundraising-status
npx claudient add command competitive-pulse
```

## CLAUDE.md template

```markdown
# Founder / CEO Workspace

This workspace supports a startup founder managing strategy, fundraising, hiring, and daily
operations. Claude Code reads context from structured files in this repo to produce accurate,
company-specific outputs — not generic startup advice.

---

## What this is

A Claude Code workspace for a founder or CEO. Every directory maps to a core responsibility:
fundraising pipeline, board management, hiring, financial health, product roadmap, and external
communications. Claude reads from these files and writes drafts, analyses, and decisions back
into the same structure.

---

## Stack

- Notion — strategy documents, team wikis, OKRs (MCP: notion)
- Linear — product roadmap and sprint tracking (MCP: linear)
- HubSpot or Attio — investor CRM and fundraising pipeline
- Gusto or Rippling — HR, payroll, and offer management
- Mercury — business banking and cash flow
- Carta — cap table, equity grants, and SAFE tracking
- Slack — team communication and investor async updates (MCP: slack)
- Google Workspace — data room (Drive), email, shared docs

---

## Directory conventions

- `strategy/` — Company OKRs, north star, annual plan, competitive landscape. OKR files are named
  by year and quarter. Never delete old OKR files — they are the grading record.
- `fundraising/` — Round tracker, investor pipeline, and data room. `investor-pipeline.md` is the
  source of truth for all investor relationships. Post-meeting notes go in
  `investor-crm/post-meeting-notes/` named `firm-YYYY-MM-DD.md`.
- `hiring/` — All hiring assets. Comp bands in `offer-templates/comp-bands-2025.md` are
  confidential — never include in board decks or investor updates.
- `board/` — Board materials, minutes, and resolutions. Minutes are filed after each meeting.
  Resolutions require a board member signature before filing.
- `finance/` — Runway model, cash flow, P&L, and budget. `runway-model.md` is updated whenever
  burn rate or headcount changes. Monthly P&L files are named `p-and-l-YYYY-MM.md`.
- `product/` — Roadmap, PRDs, and launch plans. One PRD per feature. Roadmap files are
  named by quarter. `product-vision.md` is a stable 2-year document, not a sprint plan.
- `comms/` — Investor updates and all-hands notes. Sent investor updates are never edited.
  Drafts are suffixed `-draft.md` until sent.

---

## Common tasks — exact commands

### Fundraising
```
/investor-update       — Draft investor update from metrics, OKRs, and last month's highlights
/fundraising-status    — Pipeline snapshot: stages, stalled deals, next actions, round health
```

### Board management
```
/board-prep            — Compile board deck narrative, agenda, CEO letter, and pre-read list
```

### Hiring
```
/hiring-decision       — Evaluate a candidate: scorecard summary, hire/no-hire recommendation
```

### Strategy and OKRs
```
/okr-review            — Grade current OKRs, surface blockers, draft next quarter's objectives
/competitive-pulse     — Triage competitor signals, update landscape doc, draft response memo
```

### Weekly rhythm
```
/weekly-brief          — CEO weekly brief: wins, misses, top priorities, blockers, asks
```

---

## Conventions Claude must follow

- Pull financial figures from `finance/runway-model.md` and `finance/monthly-financials/` only.
  Do not fabricate or estimate numbers.
- Investor pipeline stages in `fundraising/investor-pipeline.md` are the source of truth.
  Do not contradict them in fundraising status reports.
- Comp bands in `hiring/offer-templates/comp-bands-2025.md` are confidential. Never include
  them in investor updates, board decks, or any document that leaves the workspace.
- OKR grades use a 0.0–1.0 scale. 0.7 is a strong result. 1.0 means the target was too low.
- Board materials are drafted 5 business days before each meeting date in `board/board-calendar-2025.md`.
- Post-meeting investor notes must include: sentiment (positive/neutral/cautious), key questions
  asked, objections raised, and explicit next step with owner and date.
- All investor updates follow the template at `comms/investor-updates/update-template.md`.
  Do not change the section order or omit the asks section.
```

## MCP servers

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
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
        "/Users/you/founder-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"comms/investor-updates/\" && ! echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"draft\"; then echo \"[Investor update hook] Investor update filed — confirm it has been sent to your investor list and archived.\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"hiring/offer-templates/comp-bands\"; then echo \"[Confidential hook] WARNING: comp-bands-2025.md is confidential. Confirm this output is not destined for an investor or board document.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] If you updated fundraising/investor-pipeline.md or finance/runway-model.md, confirm the changes are saved and reflect the current date.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/hiring-pipeline
```

## Related

- [Guide: Claude for Founders and CEOs](../guides/for-founder.md)
- [Workflow: Fundraising Pipeline](../workflows/fundraising-pipeline.md)
- [Workflow: Board Meeting Prep](../workflows/board-meeting-prep.md)
- [Workflow: Weekly CEO Review](../workflows/founder-weekly-review.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
