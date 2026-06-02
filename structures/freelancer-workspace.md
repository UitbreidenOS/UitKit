# Freelancer / Independent Consultant Workspace — Project Structure

> For a solo freelancer or independent consultant running client delivery, proposal pipeline, and business admin from a single workspace — with Notion, FreshBooks, Cal.com, Loom, DocuSign, and Stripe as the operating stack.

## Stack

- **Notion** — Project management, client knowledge base, deliverable tracking, internal wiki
- **FreshBooks** or **Wave** — Invoicing, expense tracking, tax estimates, payment reconciliation
- **Cal.com** or **Calendly** — Client scheduling, discovery call booking, buffer management
- **Loom** — Async client updates, walkthrough recordings, deliverable handoffs
- **DocuSign** — Contract execution, SOW sign-off, NDA routing, envelope tracking
- **Stripe** — Payment processing, recurring retainer billing, payout tracking
- **Gmail** — Client communication, contract delivery, invoice follow-up, new business outreach
- **Claude Code** — Proposal drafting, SOW generation, invoice chase emails, status reports, outreach sequences

## Directory tree

```
freelancer-workspace/
├── .claude/
│   ├── CLAUDE.md                            # Workspace instructions (paste the template below)
│   ├── settings.json                        # MCP servers, hooks, permissions
│   └── commands/
│       ├── proposal-draft.md                # /proposal-draft — full proposal from client brief
│       ├── scope-of-work.md                 # /scope-of-work — SOW with deliverables, timeline, payment
│       ├── invoice-chase.md                 # /invoice-chase — follow-up email sequence for overdue invoices
│       ├── status-report.md                 # /status-report — weekly or milestone client update
│       ├── client-onboard.md                # /client-onboard — onboarding checklist + welcome comms
│       ├── new-business.md                  # /new-business — cold outreach or warm follow-up sequence
│       └── weekly-wrap.md                   # /weekly-wrap — personal end-of-week review + next week plan
├── clients/
│   ├── _template/                           # Copy this folder when a new client is signed
│   │   ├── brief.md                         # Initial client brief — goals, timeline, budget, contacts
│   │   ├── contract.md                      # Contract summary — key terms, payment schedule, termination
│   │   ├── sow.md                           # Scope of work — deliverables, milestones, acceptance criteria
│   │   ├── onboarding-checklist.md          # Access granted, tools set up, kickoff done, assets received
│   │   ├── status-log.md                    # Running log of weekly/milestone status reports sent
│   │   ├── comms-log.md                     # Email threads, calls, decisions — notable exchanges only
│   │   ├── deliverables/                    # All work product delivered to this client
│   │   │   └── .gitkeep
│   │   └── invoices/                        # Invoice records for this client
│   │       └── .gitkeep
│   ├── acme-redesign/                       # Active client: Acme Corp website redesign
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── onboarding-checklist.md
│   │   ├── status-log.md
│   │   ├── comms-log.md
│   │   ├── deliverables/
│   │   │   ├── 2026-04-15-wireframes-v1.pdf
│   │   │   ├── 2026-05-01-wireframes-v2-revised.pdf
│   │   │   └── 2026-06-01-final-handoff.zip
│   │   └── invoices/
│   │       ├── inv-001-deposit.md           # Invoice record: number, amount, date sent, date paid
│   │       ├── inv-002-milestone-1.md
│   │       └── inv-003-final.md
│   ├── beta-corp-strategy/                  # Active client: Beta Corp fractional strategy engagement
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── status-log.md
│   │   ├── comms-log.md
│   │   ├── deliverables/
│   │   │   ├── 2026-05-10-market-analysis.md
│   │   │   └── 2026-06-01-go-to-market-plan.md
│   │   └── invoices/
│   │       ├── inv-001-may-retainer.md
│   │       └── inv-002-jun-retainer.md
│   └── gamma-startup/                       # Closed client — archive for reference
│       ├── brief.md
│       ├── contract.md
│       ├── sow.md
│       ├── status-log.md
│       ├── comms-log.md
│       ├── deliverables/
│       │   └── 2026-03-20-final-report.md
│       └── invoices/
│           ├── inv-001-deposit.md
│           └── inv-002-completion.md
├── proposals/
│   ├── active/                              # Proposals sent but not yet signed or rejected
│   │   ├── 2026-05-28-delta-inc-brand-refresh.md
│   │   └── 2026-06-01-epsilon-co-growth-strategy.md
│   ├── won/                                 # Signed proposals — move here when contract is executed
│   │   ├── 2026-04-01-acme-redesign.md
│   │   └── 2026-03-10-beta-corp-strategy.md
│   └── lost/                               # Rejected or no-response proposals — keep for pattern analysis
│       ├── 2026-02-14-zeta-app-proposal.md
│       └── 2026-01-20-eta-audit-proposal.md
├── templates/
│   ├── proposal-template.md                 # Reusable proposal: problem statement, approach, deliverables, pricing
│   ├── sow-template.md                      # SOW: scope, timeline, milestones, payment schedule, exclusions
│   ├── contract-template.md                 # Master services agreement: IP, confidentiality, payment, termination
│   ├── invoice-template.md                  # Invoice format: line items, payment terms, bank/Stripe details
│   ├── nda-template.md                      # Mutual NDA for pre-proposal discussions
│   ├── onboarding-welcome-email.md          # First email to new client after contract signature
│   └── status-report-template.md           # Weekly status: done this week, next week, blockers, decisions needed
├── business-dev/
│   ├── prospect-list.md                     # Company name, contact, source, status, last touch, next action
│   ├── outreach-log.md                      # Date, prospect, message type, response, follow-up date
│   ├── referral-partners.md                 # People who refer work — relationship notes, last thank-you sent
│   └── positioning-notes.md                 # ICP definition, niche, key differentiators, proof points
├── finance/
│   ├── income-tracker.md                    # Monthly: invoiced, collected, outstanding — per client
│   ├── expense-log.md                       # Date, vendor, category, amount — for tax deduction tracking
│   ├── tax-estimate.md                      # Quarterly estimated tax calculation and payment log
│   ├── rate-card.md                         # Current rates: hourly, project, retainer — with last-updated date
│   └── cash-flow-forecast.md               # 90-day forward view: expected inflows, known expenses, buffer
└── ops/
    ├── onboarding-sop.md                    # Step-by-step process to onboard a new client from signed to kickoff
    ├── tools-and-access.md                  # Every tool used, login, plan tier, monthly cost, renewal date
    ├── subcontractors.md                    # Trusted subcons: name, specialty, rate, availability, past work
    └── working-hours-policy.md             # Response SLAs, out-of-office policy, emergency contact rules
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/proposal-draft.md` | Slash command that takes a client brief and produces a full proposal — problem statement, proposed approach, deliverables list, timeline, and pricing options |
| `.claude/commands/scope-of-work.md` | Slash command that converts an agreed proposal into a legally structured SOW with milestones, acceptance criteria, payment triggers, and explicit exclusions |
| `.claude/commands/invoice-chase.md` | Slash command that generates a tiered follow-up email sequence (friendly reminder, firm request, escalation) for overdue invoices — takes invoice number, amount, and days overdue |
| `.claude/commands/status-report.md` | Slash command that produces a concise client status report from a list of completed tasks, blockers, and next steps — formats for email or Notion |
| `.claude/commands/client-onboard.md` | Slash command that generates an onboarding checklist and drafts the welcome email, kickoff agenda, and access-request list for a newly signed client |
| `clients/_template/` | Blank folder structure to copy when any new client engagement begins — enforces consistent documentation across all client work |
| `finance/income-tracker.md` | Monthly ledger of invoiced vs. collected by client — the single source of truth for revenue and outstanding AR |
| `ops/onboarding-sop.md` | Step-by-step repeatable process from signed contract to kickoff call — ensures no access, credential, or communication step is missed |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p freelancer-workspace

# Create .claude structure
mkdir -p freelancer-workspace/.claude/commands

# Create client template
mkdir -p freelancer-workspace/clients/_template/deliverables
mkdir -p freelancer-workspace/clients/_template/invoices
touch freelancer-workspace/clients/_template/deliverables/.gitkeep
touch freelancer-workspace/clients/_template/invoices/.gitkeep
touch freelancer-workspace/clients/_template/brief.md
touch freelancer-workspace/clients/_template/contract.md
touch freelancer-workspace/clients/_template/sow.md
touch freelancer-workspace/clients/_template/onboarding-checklist.md
touch freelancer-workspace/clients/_template/status-log.md
touch freelancer-workspace/clients/_template/comms-log.md

# Create active client directories
mkdir -p freelancer-workspace/clients/acme-redesign/deliverables
mkdir -p freelancer-workspace/clients/acme-redesign/invoices
mkdir -p freelancer-workspace/clients/beta-corp-strategy/deliverables
mkdir -p freelancer-workspace/clients/beta-corp-strategy/invoices

# Create proposal directories
mkdir -p freelancer-workspace/proposals/active
mkdir -p freelancer-workspace/proposals/won
mkdir -p freelancer-workspace/proposals/lost

# Create templates directory
mkdir -p freelancer-workspace/templates

# Create business-dev, finance, and ops directories
mkdir -p freelancer-workspace/business-dev
mkdir -p freelancer-workspace/finance
mkdir -p freelancer-workspace/ops

# Seed key files
touch freelancer-workspace/finance/income-tracker.md
touch freelancer-workspace/finance/expense-log.md
touch freelancer-workspace/finance/tax-estimate.md
touch freelancer-workspace/finance/rate-card.md
touch freelancer-workspace/finance/cash-flow-forecast.md
touch freelancer-workspace/business-dev/prospect-list.md
touch freelancer-workspace/business-dev/outreach-log.md
touch freelancer-workspace/ops/onboarding-sop.md
touch freelancer-workspace/ops/tools-and-access.md

# Install freelancer/small-business skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Copy command stubs into .claude/commands/
npx claudient add skill small-business/freelancer-proposal --output freelancer-workspace/.claude/commands/proposal-draft.md
npx claudient add skill small-business/scope-of-work --output freelancer-workspace/.claude/commands/scope-of-work.md
npx claudient add skill small-business/invoice-chaser --output freelancer-workspace/.claude/commands/invoice-chase.md
npx claudient add skill small-business/client-status-report --output freelancer-workspace/.claude/commands/status-report.md
npx claudient add skill small-business/cold-outreach --output freelancer-workspace/.claude/commands/new-business.md
```

## CLAUDE.md template

```markdown
# Freelancer Workspace — Claude Code Instructions

## What this is

This is the working directory for a freelance consultant managing client engagements, proposals,
invoicing, and business development. Client work lives in clients/, open proposals in proposals/active/,
reusable documents in templates/, and financial records in finance/. All proposal drafting, SOW
generation, invoice follow-up, status reporting, and outreach runs through Claude Code slash commands.

## Stack

- Notion — Project tracking per client; link Notion page URL in clients/<name>/brief.md
- FreshBooks / Wave — Invoicing and accounting; log invoice numbers and payment dates in clients/<name>/invoices/
- Cal.com / Calendly — Scheduling; paste booking link in onboarding-welcome-email.md and proposals
- Loom — Async updates; embed Loom URLs in status reports sent to clients
- DocuSign — Contract and SOW sign-off; log envelope IDs in clients/<name>/contract.md
- Stripe — Payment processing; log Stripe payment IDs in clients/<name>/invoices/ files
- Gmail — All client comms; notable decisions and agreements logged in clients/<name>/comms-log.md

## Common tasks and exact commands

### Draft a proposal from a client brief
```
/proposal-draft

Client: [company name]
Contact: [name, title, email]
Brief: [paste the brief or describe the request in detail]
Budget range: [$X–$Y or "TBD"]
Timeline: [target start date and duration]
My angle: [what I bring that's different from a generalist]
```

### Generate a scope of work from a signed proposal
```
/scope-of-work

Client: [company name]
Project: [project name]
Agreed deliverables: [list exactly what was agreed]
Timeline: [start date, milestone dates, end date]
Payment schedule: [deposit %, milestone %, completion %]
Exclusions: [anything explicitly out of scope]
```

### Write an invoice follow-up
```
/invoice-chase

Client: [company name]
Invoice number: [INV-XXX]
Amount: [$X]
Due date: [date]
Days overdue: [N]
Prior contact: [have I followed up before? when?]
Tone: [friendly / firm / final notice]
```

### Send a client status report
```
/status-report

Client: [company name]
Period: [week of / milestone: X]
Completed this period: [bullet list]
In progress: [what is underway]
Blockers: [anything I need from them]
Next period plan: [what happens next]
Format: [email / Notion update / Loom script]
```

### Onboard a new client
```
/client-onboard

Client: [company name]
Contact: [name, title]
Project: [project name]
Start date: [date]
Tools to grant access: [Notion, Slack, Figma, Drive — list what applies]
First deliverable due: [date and what it is]
```

### Write outreach for a new prospect
```
/new-business

Prospect: [company name and description]
Contact: [name, title]
Source: [how I know them or found them]
Angle: [why I'm reaching out now — trigger event, referral, content]
Ask: [discovery call, reply, intro — keep it one thing]
Tone: [warm / cold / follow-up on prior touch]
```

### Run a weekly wrap
```
/weekly-wrap

Week of: [date]
Client work done: [list by client]
Proposals sent: [list]
Invoices sent / collected: [list]
Business dev actions: [outreach sent, calls taken]
Next week priorities: [top 3]
Blockers or concerns: [anything weighing on you]
```

## Conventions to follow

- Every new client must have a folder under clients/ created before the kickoff call — copy _template/
- SOW files in clients/<name>/sow.md are the contract source of truth — never describe scope from memory
- Invoice records in clients/<name>/invoices/ must include: invoice number, amount, date sent, date paid (or "outstanding")
- Proposals go to proposals/active/ when sent — move to won/ or lost/ within 48 hours of outcome
- All outreach attempts are logged in business-dev/outreach-log.md on the same day they are sent
- finance/income-tracker.md is updated the last Friday of every month — no exceptions
- finance/expense-log.md is updated weekly — log everything over $20 for tax purposes
- Rate card in finance/rate-card.md always shows the last-updated date — review quarterly
```

## MCP servers

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "gmail": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-gmail"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
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
        "/Users/your-username/freelancer-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"proposals/active/\"; then echo \"[hook] Proposal saved to active/ — log it in business-dev/outreach-log.md with the date sent and prospect contact\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"clients/.*/sow.md\"; then echo \"[hook] Writing SOW — confirm client folder has brief.md and contract.md before finalising scope\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Friday\" ]; then echo \"[reminder] Friday — run /weekly-wrap and check finance/income-tracker.md for any outstanding invoices\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core freelancer skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Supporting productivity skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator

# Install all small-business skills at once
npx claudient add skills small-business
```

## Related

- [Freelancer guide](../guides/for-freelancer.md)
- [Client onboarding workflow](../workflows/client-onboarding.md)
- [Proposal-to-contract workflow](../workflows/proposal-to-contract.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
