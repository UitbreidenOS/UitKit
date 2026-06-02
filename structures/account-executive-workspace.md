# Account Executive Workspace — Project Structure

> For a quota-bearing AE managing enterprise or mid-market pipeline end-to-end — from discovery to close — with Salesforce, Gong, DocuSign, Clari, and Seismic as the operating stack.

## Stack

- **Salesforce** — CRM, opportunity management, activity logging, forecast category tracking
- **Gong** — Call recording, deal risk scoring, call transcript export, rep analytics
- **DocuSign** — Contract routing, envelope tracking, eSignature audit trail
- **Clari** or **Bowtie** — AI-powered forecasting, pipeline rollup, revenue intelligence
- **Seismic** or **Highspot** — Content management, pitch decks, ROI calculators, battlecards
- **LinkedIn Sales Navigator** — Executive mapping, account expansion, signal tracking
- **Slack** — Deal rooms, manager threads, CS handoff channels
- **Claude Code** — MEDDPICC scoring, RFP drafting, MSP generation, QBR builds, forecast prep

## Directory tree

```
ae-workspace/
├── .claude/
│   ├── CLAUDE.md                        # Workspace instructions (paste the template below)
│   ├── settings.json                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── deal-review.md               # /deal-review — MEDDPICC scoring + risk flags per deal
│       ├── exec-alignment.md            # /exec-alignment — multi-thread map, exec outreach drafts
│       ├── proposal-draft.md            # /proposal-draft — full proposal or RFP section response
│       ├── qbr-prep.md                  # /qbr-prep — QBR deck outline, metrics, narrative arc
│       ├── negotiation-prep.md          # /negotiation-prep — BATNA analysis, concession matrix
│       ├── forecast-update.md           # /forecast-update — weekly Commit/Best Case roll-up
│       └── close-plan.md               # /close-plan — mutual action plan, milestone table
├── deals/
│   ├── _template/                       # Blank deal folder — copy this when opening a new opp
│   │   ├── discovery-notes.md           # Raw call notes, qualification criteria, MEDDPICC draft
│   │   ├── exec-map.md                  # Stakeholder map — name, title, role, sentiment, last touch
│   │   ├── close-plan.md               # Mutual action plan with dates and owners on both sides
│   │   ├── gong-transcripts/            # Exported Gong call transcripts (plain text)
│   │   │   └── .gitkeep
│   │   └── rfp-responses/               # RFP section drafts and final responses
│   │       └── .gitkeep
│   ├── acme-corp/
│   │   ├── discovery-notes.md
│   │   ├── exec-map.md
│   │   ├── close-plan.md
│   │   ├── meddpicc-scores.md           # Running MEDDPICC score history (updated each review)
│   │   ├── negotiation-log.md           # Concession history, redlines, deal desk notes
│   │   ├── gong-transcripts/
│   │   │   ├── 2026-05-14-discovery.txt
│   │   │   ├── 2026-05-28-demo.txt
│   │   │   └── 2026-06-01-negotiation.txt
│   │   └── rfp-responses/
│   │       ├── section-3-security.md
│   │       ├── section-5-integrations.md
│   │       └── executive-summary.md
│   ├── beta-industries/
│   │   ├── discovery-notes.md
│   │   ├── exec-map.md
│   │   └── close-plan.md
│   └── gamma-systems/
│       ├── discovery-notes.md
│       ├── exec-map.md
│       ├── close-plan.md
│       └── gong-transcripts/
│           └── 2026-06-02-eval-review.txt
├── templates/
│   ├── proposal-template.md             # Reusable proposal structure — executive summary, ROI, terms
│   ├── rfp-response-template.md         # RFP answer scaffolding — requirement, response, evidence
│   ├── close-plan-template.md           # Mutual action plan with standard milestone stages
│   ├── mutual-action-plan.md            # MAP for late-stage deals — milestones, owners, dates
│   ├── executive-outreach-template.md   # Cold/warm outreach to economic buyer or C-suite
│   ├── qbr-deck-outline.md              # QBR slide structure — business review, goals, next quarter
│   └── champion-enablement-package.md   # Internal selling kit for champion to share internally
├── competitive/
│   ├── battlecard-competitor-a.md       # Competitor A positioning, objections, win themes
│   ├── battlecard-competitor-b.md       # Competitor B positioning, objections, win themes
│   ├── competitive-positioning.md       # Master differentiation narrative — updated quarterly
│   └── win-loss-notes.md               # Running log of won/lost deal context per competitor
├── metrics/
│   ├── quota-tracker.md                 # Weekly quota attainment: closed, pipeline, gap to goal
│   ├── pipeline-health.md              # Coverage ratio, stage distribution, aged deals list
│   ├── forecast-log.md                 # Weekly Commit vs. actual — forecast accuracy history
│   └── deal-cycle-benchmarks.md        # Average days per stage, close rates by segment/size
└── scratch/
    ├── weekly-prep.md                   # Draft space for forecast call and deal review prep
    └── call-notes-staging.md            # Rough post-call notes before they move to deal folder
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/deal-review.md` | Slash command that takes a deal name + context and returns a scored MEDDPICC assessment, risk flags, and recommended forecast category |
| `.claude/commands/exec-alignment.md` | Slash command to map buying committee, score each stakeholder's sentiment, and draft executive multi-threading outreach |
| `.claude/commands/proposal-draft.md` | Slash command that produces a full proposal or specific RFP section — takes buyer criteria and product differentiators as input |
| `.claude/commands/negotiation-prep.md` | Slash command for BATNA analysis, concession matrix, and walk-away conditions before a commercial negotiation call |
| `deals/_template/` | Blank folder structure to copy when a new opportunity is qualified into the pipeline — ensures consistent documentation across all deals |
| `deals/acme-corp/meddpicc-scores.md` | Running history of MEDDPICC scores updated after each deal review — tracks score drift and risk patterns over the deal cycle |
| `templates/mutual-action-plan.md` | Buyer-facing joint plan shared at Evaluation stage — milestones, mutual commitments, and agreed close date |
| `metrics/forecast-log.md` | Weekly Commit vs. actual closed — used to track forecast accuracy over time and identify sandbagging or overcommit patterns |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p ae-workspace

# Create .claude structure
mkdir -p ae-workspace/.claude/commands

# Create deal directories
mkdir -p ae-workspace/deals/_template/gong-transcripts
mkdir -p ae-workspace/deals/_template/rfp-responses
mkdir -p ae-workspace/deals/acme-corp/gong-transcripts
mkdir -p ae-workspace/deals/acme-corp/rfp-responses
mkdir -p ae-workspace/deals/beta-industries
mkdir -p ae-workspace/deals/gamma-systems/gong-transcripts

# Create template, competitive, metrics, and scratch dirs
mkdir -p ae-workspace/templates
mkdir -p ae-workspace/competitive
mkdir -p ae-workspace/metrics
mkdir -p ae-workspace/scratch

# Seed .gitkeep placeholders
touch ae-workspace/deals/_template/gong-transcripts/.gitkeep
touch ae-workspace/deals/_template/rfp-responses/.gitkeep

# Install GTM skills
npx claudient add skill gtm/deal-desk
npx claudient add skill gtm/deal-review
npx claudient add skill gtm/rfp-responder
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/channel-economics
npx claudient add skill gtm/champion-builder
npx claudient add skill gtm/mutual-success-plan

# Copy command stubs into .claude/commands/
npx claudient add skill gtm/deal-review --output ae-workspace/.claude/commands/deal-review.md
npx claudient add skill gtm/rfp-responder --output ae-workspace/.claude/commands/proposal-draft.md
npx claudient add skill gtm/qbr-builder --output ae-workspace/.claude/commands/qbr-prep.md
npx claudient add skill gtm/commercial-forecaster --output ae-workspace/.claude/commands/forecast-update.md
npx claudient add skill gtm/mutual-success-plan --output ae-workspace/.claude/commands/close-plan.md
```

## CLAUDE.md template

```markdown
# AE Workspace — Claude Code Instructions

## What this is

This is the working directory for an Account Executive managing a quota-bearing pipeline.
Deals are tracked in deals/, templates live in templates/, and competitive intelligence in competitive/.
All MEDDPICC scoring, forecasting, RFP drafting, and QBR prep happens through Claude Code skills.

## Stack

- Salesforce — CRM of record (opportunity, contact, activity)
- Gong — Call intelligence; transcripts exported to deals/<account>/gong-transcripts/
- DocuSign — Contract routing; track envelope IDs in deals/<account>/negotiation-log.md
- Clari — Forecast rollup; weekly snapshots logged to metrics/forecast-log.md
- Seismic — Content repository; reference deck names and versions in proposals
- LinkedIn Sales Navigator — Executive mapping; document contacts in exec-map.md
- Slack — Deal room updates; paste relevant threads into deal folder context

## Common tasks and exact commands

### Score a deal with MEDDPICC
```
/deal-review

Deal: [deal name]
Stage: [stage]
ACV: $[amount]
Close date: [date]
Context: [paste discovery notes or Gong transcript]
```

### Draft a proposal or RFP section
```
/proposal-draft

RFP question: [paste verbatim]
Buyer priority: [specific pain point this question targets]
Our differentiator: [what we have that competitors don't]
Word limit: [if specified]
```

### Build a mutual action plan
```
/close-plan

Deal: [name], ACV: $[amount], Target close: [date]
Champion: [name, title], Economic buyer: [name, title]
Remaining steps: [what both sides still need to do before signature]
```

### Prepare for forecast call
```
/forecast-update

My pipeline: [paste deal list with stage, ACV, close date, forecast category]
Weekly quota: $[X] new ARR
Flag: deals at risk in Commit, Best Case deals ready to promote, deals to defer
```

### Prep for a QBR
```
/qbr-prep

Quarter: Q[X] [YEAR]
Closed won: $[X] ARR, [N] deals
Pipeline entering Q[X+1]: $[Y] ARR across [N] deals
Top 3 wins: [deal names and why they closed]
Top risk: [what is the biggest gap to next quarter quota?]
```

### Map executives before multi-threading
```
/exec-alignment

Account: [company]
Known contacts: [list with titles and last interactions]
Target: [title of exec I need to reach — CEO, CFO, CTO, etc.]
Ask: [what I need from them — executive sponsor, paper signer, technical sign-off]
```

### Prepare for a negotiation call
```
/negotiation-prep

Deal: [name], ACV: $[list price], Offered: $[current offer]
Concessions already made: [list]
Buyer's stated blockers: [price / terms / timeline / procurement process]
Walk-away condition: [the line I will not cross]
```

## Conventions to follow

- Every deal folder must have discovery-notes.md, exec-map.md, and close-plan.md before the deal is marked Evaluation
- MEDDPICC scores live in deals/<account>/meddpicc-scores.md — append after every deal review, never overwrite
- Gong transcripts go into deals/<account>/gong-transcripts/ as plain .txt files, named YYYY-MM-DD-[topic].txt
- Forecast log is updated every Friday in metrics/forecast-log.md — Commit total, Best Case total, actual closed
- Negotiation concessions are logged chronologically in deals/<account>/negotiation-log.md
- All proposals and RFP responses are saved to deals/<account>/rfp-responses/ before sending
- Competitive battlecards in competitive/ are reviewed and updated at the start of each quarter
```

## MCP servers

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp-server"],
      "env": {
        "SF_LOGIN_URL": "https://login.salesforce.com",
        "SF_USERNAME": "your-sf-username@company.com",
        "SF_PASSWORD": "your-sf-password",
        "SF_TOKEN": "your-security-token"
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
        "/Users/your-username/ae-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"meddpicc-scores.md\"; then echo \"[hook] MEDDPICC score updated at $(date +%Y-%m-%dT%H:%M) — check forecast-log.md for weekly roll-up\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"close-plan.md\"; then echo \"[hook] Writing close plan — confirm exec-map.md and discovery-notes.md are current before sharing with buyer\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Friday\" ]; then echo \"[reminder] Friday — update metrics/forecast-log.md with this week Commit vs. actual before EOD\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core AE deal management skills
npx claudient add skill gtm/deal-desk
npx claudient add skill gtm/deal-review
npx claudient add skill gtm/rfp-responder
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/channel-economics
npx claudient add skill gtm/champion-builder
npx claudient add skill gtm/mutual-success-plan

# Supporting GTM skills
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/revenue-operations
npx claudient add skill gtm/expansion-playbook
npx claudient add skill gtm/email-automation

# Install all GTM skills at once
npx claudient add skills gtm
```

## Related

- [Account Executive guide](../guides/for-account-executive.md)
- [AE deal cycle workflow](../workflows/ae-deal-cycle.md)
- [Deal screening workflow](../workflows/deal-screening.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
