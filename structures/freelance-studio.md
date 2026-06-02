# Freelance Studio / Consultancy — Project Structure

> For a solo freelancer or small studio managing client projects, business development, and operations across Notion, HoneyBook, Cal.com, Loom, Figma, Stripe, Gmail, and Slack.

## Stack

- **Notion** — Project management, CRM, client knowledge base, deliverable tracking, internal wiki
- **FreshBooks** or **HoneyBook** — Invoicing, contracts, payment collection, expense tracking, retainer billing
- **Cal.com** — Client scheduling, discovery call booking, intake form routing, buffer management
- **Loom** — Async client update recordings, deliverable walkthroughs, feedback request videos
- **Figma** — UI/UX deliverables, wireframes, component libraries, design handoffs
- **Framer** — Interactive prototypes, no-code site deliverables, client-ready previews
- **Stripe** — Payment processing, recurring retainer charges, one-time project fees, payout tracking
- **Gmail** — Client communication, contract delivery, invoice follow-up, new business outreach
- **Slack** — Active project channels per client, async Q&A, file sharing, Loom link drops
- **Claude Code** — Proposal drafting, SOW generation, status reports, invoice chase emails, outreach sequences

## Directory tree

```
freelance-studio/
├── .claude/
│   ├── CLAUDE.md                                    # Workspace instructions (paste the template below)
│   ├── settings.json                                # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-client-onboard.md                    # /new-client-onboard — full onboarding checklist + welcome email + kickoff agenda
│       ├── proposal-draft.md                        # /proposal-draft — proposal from brief: problem, approach, deliverables, pricing options
│       ├── scope-of-work.md                         # /scope-of-work — structured SOW with milestones, acceptance criteria, payment triggers
│       ├── invoice-chase.md                         # /invoice-chase — tiered follow-up email (friendly / firm / final) for overdue invoices
│       ├── client-status-update.md                  # /client-status-update — weekly or milestone update for email or Loom script
│       ├── feedback-request.md                      # /feedback-request — structured feedback request after milestone delivery
│       ├── project-closeout.md                      # /project-closeout — offboarding checklist, final invoice prompt, testimonial ask
│       └── weekly-wrap.md                           # /weekly-wrap — personal end-of-week review: revenue, pipeline, next week plan
├── clients/
│   ├── _template/                                   # Copy this entire folder when a new client is signed
│   │   ├── brief.md                                 # Initial client brief: goals, timeline, budget, key contacts, success criteria
│   │   ├── contract.md                              # Contract summary: key terms, payment schedule, IP ownership, termination clause
│   │   ├── sow.md                                   # Scope of work: deliverables, milestones, acceptance criteria, exclusions
│   │   ├── communication-log.md                     # Notable emails, calls, decisions — log the substance, not the pleasantries
│   │   ├── invoices/
│   │   │   └── .gitkeep
│   │   └── deliverables/
│   │       └── .gitkeep
│   ├── acme-corp-brand-2026/                        # Active client: Acme Corp brand identity project
│   │   ├── brief.md
│   │   ├── contract.md                              # HoneyBook contract ID: HB-2026-0041
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-04-01.md        # Invoice record: number, amount, sent date, paid date, Stripe charge ID
│   │   │   ├── inv-002-milestone-1-2026-05-01.md
│   │   │   └── inv-003-final-2026-06-15.md
│   │   └── deliverables/
│   │       ├── 2026-04-20-moodboard-v1.fig          # Figma file link or exported PDF
│   │       ├── 2026-05-05-brand-guidelines-v1.pdf
│   │       ├── 2026-05-18-brand-guidelines-v2-revised.pdf
│   │       └── 2026-06-10-final-handoff-package.zip
│   ├── betaworks-site-redesign/                     # Active client: Betaworks Framer site rebuild
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-05-01.md
│   │   │   └── inv-002-milestone-1-2026-06-01.md
│   │   └── deliverables/
│   │       ├── 2026-05-15-wireframes-v1.fig
│   │       ├── 2026-05-28-wireframes-v2-approved.fig
│   │       └── 2026-06-05-framer-staging-link.md    # Framer preview URL + credentials
│   ├── gamma-dao-strategy/                          # Closed client — archived for reference and case study
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-01-15.md
│   │   │   └── inv-002-completion-2026-03-01.md
│   │   └── deliverables/
│   │       └── 2026-03-01-strategy-deck-final.pdf
│   └── delta-fintech-ux/                            # On hold — waiting on client budget approval
│       ├── brief.md
│       └── communication-log.md
├── pipeline/
│   ├── prospects.md                                 # Company, contact, source, ICP fit score, last touch, next action, estimated value
│   ├── proposals-sent.md                            # Proposal tracker: client, date sent, value, status, follow-up date, outcome
│   └── follow-up-schedule.md                       # Weekly follow-up queue: who to contact, why, what to say, channel (email / Slack / LinkedIn)
├── templates/
│   ├── proposal-template.md                         # Full proposal: executive summary, problem, approach, deliverables, timeline, pricing tiers, next steps
│   ├── sow-template.md                              # SOW: scope, out-of-scope, milestones with dates, acceptance criteria, payment schedule, revision policy
│   ├── contract-template.md                         # MSA: IP assignment, confidentiality, payment terms, kill fee, termination, governing law
│   ├── invoice-template.md                          # Invoice format: line items, payment terms (Net 7/14/30), bank details, Stripe payment link
│   ├── nda-template.md                              # Mutual NDA for pre-proposal discovery discussions
│   ├── status-update-template.md                    # Weekly update: done this period, in progress, blockers, needs from client, next period plan
│   ├── project-brief-template.md                    # Discovery form to send prospects before scoping: goals, budget, timeline, stakeholders
│   └── feedback-request-template.md                 # Post-milestone feedback: specific questions on deliverable quality, alignment, revisions needed
├── ops/
│   ├── rate-card.md                                 # Current rates: hourly, day rate, project minimums, retainer tiers — last reviewed: 2026-Q2
│   ├── service-packages.md                          # Productized packages: Brand Sprint, Site in a Week, UX Audit — scope, price, timeline, inclusions
│   ├── onboarding-checklist.md                      # Steps from signed contract to kickoff: access, tools, Slack channel, kickoff call, assets received
│   ├── offboarding-checklist.md                     # Steps at project close: final delivery, invoice, testimonial ask, portfolio rights, archive folder
│   ├── tools-and-access.md                          # Every SaaS tool: plan tier, monthly cost, renewal date, login method
│   └── subcontractors.md                            # Trusted subs: name, specialty, rate, availability, NDA status, past project worked together
├── finance/
│   ├── income-log.md                                # Monthly: client, invoice number, amount invoiced, amount collected, outstanding, method
│   ├── expense-log.md                               # Date, vendor, category (software / travel / equipment), amount — for tax deduction tracking
│   └── quarterly-tax-estimate.md                    # Q1–Q4 estimated tax calc: gross income, deductible expenses, SE tax, payment dates, amounts paid
└── marketing/
    ├── case-studies/
    │   ├── acme-corp-brand-identity.md              # Problem, approach, result, metrics, client quote — source for website and proposals
    │   ├── betaworks-site-redesign.md
    │   └── _case-study-template.md                  # Reusable format: context, challenge, solution, outcome, testimonial
    ├── portfolio/
    │   ├── portfolio-index.md                        # Curated project list: client (anonymized if NDA), deliverable type, Figma/Framer link, date
    │   └── selected-works/
    │       ├── brand-acme-2026.pdf                  # Exported deliverable for portfolio PDF
    │       └── site-betaworks-2026.pdf
    └── testimonials/
        ├── testimonials-log.md                      # Client name, quote, date, permission to publish, published to (website / LinkedIn / proposal)
        └── raw-feedback/
            ├── acme-corp-feedback-2026-06.md        # Raw feedback email or form response — source material for testimonials
            └── gamma-dao-feedback-2026-03.md
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/new-client-onboard.md` | Slash command that generates a complete onboarding checklist, drafts the welcome email, and builds a kickoff call agenda from the signed client brief — run immediately after HoneyBook contract is executed |
| `.claude/commands/invoice-chase.md` | Slash command producing a tiered follow-up sequence (friendly reminder at day 3, firm request at day 7, final notice with late fee at day 14) — takes invoice number, amount, and days overdue |
| `.claude/commands/project-closeout.md` | Slash command that produces the offboarding checklist, drafts the final invoice, and writes a testimonial request email — run when the last deliverable is approved |
| `clients/_template/` | Blank folder structure copied for every new engagement — enforces consistent documentation across all client work; copy with `cp -r clients/_template clients/<new-client-name>` |
| `templates/sow-template.md` | Master SOW format including revision policy, kill fee clause, and explicit out-of-scope list — the source of truth for all project scope conversations |
| `pipeline/prospects.md` | CRM replacement for early-stage leads: company, contact, ICP fit score (1–5), estimated deal value, last touch date, next action — reviewed every Monday |
| `ops/rate-card.md` | Current rates with a last-reviewed date — controls what numbers appear in all Claude-drafted proposals; must be updated before running `/proposal-draft` |
| `finance/quarterly-tax-estimate.md` | SE tax calc updated at end of each quarter: gross income, deductible SaaS and equipment expenses, estimated federal + state payment due, confirmation of payment sent |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p freelance-studio

# .claude structure
mkdir -p freelance-studio/.claude/commands

# Client template
mkdir -p freelance-studio/clients/_template/deliverables
mkdir -p freelance-studio/clients/_template/invoices
touch freelance-studio/clients/_template/deliverables/.gitkeep
touch freelance-studio/clients/_template/invoices/.gitkeep
touch freelance-studio/clients/_template/brief.md
touch freelance-studio/clients/_template/contract.md
touch freelance-studio/clients/_template/sow.md
touch freelance-studio/clients/_template/communication-log.md

# Pipeline
mkdir -p freelance-studio/pipeline
touch freelance-studio/pipeline/prospects.md
touch freelance-studio/pipeline/proposals-sent.md
touch freelance-studio/pipeline/follow-up-schedule.md

# Templates
mkdir -p freelance-studio/templates
touch freelance-studio/templates/proposal-template.md
touch freelance-studio/templates/sow-template.md
touch freelance-studio/templates/contract-template.md
touch freelance-studio/templates/invoice-template.md
touch freelance-studio/templates/nda-template.md
touch freelance-studio/templates/status-update-template.md
touch freelance-studio/templates/project-brief-template.md
touch freelance-studio/templates/feedback-request-template.md

# Ops
mkdir -p freelance-studio/ops
touch freelance-studio/ops/rate-card.md
touch freelance-studio/ops/service-packages.md
touch freelance-studio/ops/onboarding-checklist.md
touch freelance-studio/ops/offboarding-checklist.md
touch freelance-studio/ops/tools-and-access.md
touch freelance-studio/ops/subcontractors.md

# Finance
mkdir -p freelance-studio/finance
touch freelance-studio/finance/income-log.md
touch freelance-studio/finance/expense-log.md
touch freelance-studio/finance/quarterly-tax-estimate.md

# Marketing
mkdir -p freelance-studio/marketing/case-studies
mkdir -p freelance-studio/marketing/portfolio/selected-works
mkdir -p freelance-studio/marketing/testimonials/raw-feedback
touch freelance-studio/marketing/case-studies/_case-study-template.md
touch freelance-studio/marketing/portfolio/portfolio-index.md
touch freelance-studio/marketing/testimonials/testimonials-log.md

# Install skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator

# Scaffold command stubs in .claude/commands/
npx claudient add skill small-business/freelancer-proposal --output freelance-studio/.claude/commands/proposal-draft.md
npx claudient add skill small-business/scope-of-work --output freelance-studio/.claude/commands/scope-of-work.md
npx claudient add skill small-business/invoice-chaser --output freelance-studio/.claude/commands/invoice-chase.md
npx claudient add skill small-business/client-status-report --output freelance-studio/.claude/commands/client-status-update.md
npx claudient add skill small-business/client-onboarding --output freelance-studio/.claude/commands/new-client-onboard.md
```

## CLAUDE.md template

```markdown
# Freelance Studio — Claude Code Instructions

## What this is

Working directory for a solo freelance studio managing client design and strategy engagements,
business development pipeline, invoicing, and operations. Client work lives in clients/ (one folder
per engagement), open prospects and proposals in pipeline/, reusable documents in templates/,
financial records in finance/, and portfolio and case study assets in marketing/. All drafting,
SOW generation, invoice follow-up, status reporting, and outreach runs through slash commands in
.claude/commands/.

## Stack

- Notion — Project tracking per client; paste the Notion page URL in clients/<name>/brief.md
- HoneyBook — Contracts and invoicing; log HoneyBook contract IDs in clients/<name>/contract.md
- FreshBooks — Expense tracking and tax reconciliation; cross-reference with finance/income-log.md
- Cal.com — Scheduling; embed booking link in templates/proposal-template.md and welcome emails
- Loom — Async deliverable walkthroughs; paste Loom URLs in client-status-update and SOW handoffs
- Figma — Design deliverables; share view-only links in clients/<name>/deliverables/ files
- Framer — Prototype and no-code site deliverables; log staging URLs in clients/<name>/deliverables/
- Stripe — Payment processing; log Stripe charge IDs in clients/<name>/invoices/ records
- Gmail — Primary client comms; log decisions and agreements in clients/<name>/communication-log.md
- Slack — Active project channels; each signed client gets a dedicated channel

## New client onboarding flow

Run immediately after HoneyBook contract is executed and deposit is received:

```
/new-client-onboard

Client: [company name]
Contact: [name, title, email]
Project: [project name from SOW]
Start date: [date]
Slack channel: [#client-name-project]
Tools to grant access: [Notion, Figma, Framer staging — list what applies]
Cal.com link: [your booking URL]
First deliverable: [name and due date]
```

This produces: welcome email, kickoff call agenda, access-request checklist, and the
ops/onboarding-checklist.md items to tick off before day one.

## Project delivery workflow

1. Create clients/<name>/ by copying clients/_template/ before the kickoff call
2. Fill brief.md from the discovery call notes; paste the Notion project URL at the top
3. Run /scope-of-work to generate sow.md — review before sending to client
4. Deliverables go in clients/<name>/deliverables/ with date-prefixed filenames (YYYY-MM-DD-name.ext)
5. After each milestone, run /client-status-update and log the Loom URL in communication-log.md
6. Run /feedback-request after each milestone delivery — log responses in communication-log.md

## Invoice and payment process

- All invoice records go in clients/<name>/invoices/ as inv-NNN-description-YYYY-MM-DD.md
- Each record must include: HoneyBook or FreshBooks invoice number, amount, date sent, due date,
  Stripe charge ID (once paid), and date paid (or "outstanding")
- Run /invoice-chase if payment is not received within 3 days of the due date
- Log all collected revenue in finance/income-log.md on the same day payment clears Stripe
- Update finance/quarterly-tax-estimate.md at the end of each quarter

## Time tracking and billing

- Rate card is in ops/rate-card.md — review quarterly and update the last-reviewed date
- Hourly work: log time in clients/<name>/communication-log.md as a running table (date, task, hours)
- Project work: bill against milestones defined in clients/<name>/sow.md — never bill ahead of delivery
- Retainer clients: issue the retainer invoice on the 1st of each month via HoneyBook
- Kill fee: 25% of remaining project value if client cancels after kickoff — stated in contract-template.md

## Common tasks and exact commands

### Draft a proposal from a client brief
```
/proposal-draft

Client: [company name]
Contact: [name, title]
Brief: [paste discovery notes or brief in full]
Budget: [$X–$Y or "TBD"]
Timeline: [target start date and duration]
Deliverables requested: [list what they asked for]
My angle: [why I am the right fit — be specific]
Pricing preference: [fixed-fee / retainer / hybrid]
```

### Generate an SOW from a signed proposal
```
/scope-of-work

Client: [company name]
Project: [project name]
Agreed deliverables: [exact list — copy from approved proposal]
Timeline: [start, milestone dates, end date]
Payment schedule: [50% deposit / 25% milestone 1 / 25% completion]
Revision rounds: [how many rounds per deliverable]
Exclusions: [explicit out-of-scope items]
```

### Write an invoice follow-up
```
/invoice-chase

Client: [company name]
Invoice number: [INV-XXX]
Amount: [$X]
Due date: [YYYY-MM-DD]
Days overdue: [N]
Prior contact: [none / yes — date of last follow-up]
Tone: [friendly / firm / final notice]
```

### Send a client status update
```
/client-status-update

Client: [company name]
Period: [week of YYYY-MM-DD / milestone: X]
Completed: [bullet list of what shipped]
In progress: [what is underway]
Blockers: [what I need from the client]
Next period plan: [what happens next]
Format: [email / Loom script / Notion update]
```

### Close out a project
```
/project-closeout

Client: [company name]
Final deliverable: [name and delivery date]
Outstanding invoices: [invoice numbers and amounts]
Portfolio rights: [confirmed in contract? yes/no]
Testimonial: [has client agreed to provide one? yes/no/ask]
```

## Conventions

- Every new client gets a folder under clients/ before the kickoff call — always copy _template/
- Deliverable filenames: YYYY-MM-DD-description-vN.ext (e.g., 2026-06-01-wireframes-v2.fig)
- proposals-sent.md in pipeline/ is updated the same day a proposal is emailed
- Move won proposals: create clients/<name>/ and archive the proposal file there
- finance/income-log.md is updated the last working day of each month — no exceptions
- finance/expense-log.md is updated weekly — log everything over $15 for tax purposes
- ops/rate-card.md always shows a last-reviewed date — update it before using /proposal-draft
- marketing/testimonials/testimonials-log.md is updated within one week of receiving any feedback
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
        "/Users/your-username/freelance-studio"
      ]
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
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-google-drive"],
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
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_live_your-stripe-secret-key",
        "STRIPE_WEBHOOK_SECRET": "whsec_your-webhook-secret"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -qE \"clients/.+/deliverables/\"; then echo \"[hook] Deliverable saved — update clients/<name>/communication-log.md with the delivery date and share the Loom walkthrough link\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"pipeline/proposals-sent.md\"; then echo \"[hook] Proposal tracker updated — set a Cal.com follow-up reminder 5 business days out and log next action in follow-up-schedule.md\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -qE \"clients/.+/sow.md\"; then echo \"[hook] Writing SOW — confirm clients/<name>/brief.md and contract.md exist and ops/rate-card.md has a current last-reviewed date before finalising scope\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Friday\" ]; then echo \"[reminder] Friday — run /weekly-wrap, check finance/income-log.md for outstanding invoices, and review pipeline/follow-up-schedule.md for Monday outreach\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core studio skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Productivity and communication skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/exec-briefing

# Install all small-business skills at once
npx claudient add skills small-business
```

## Related

- [Freelancer guide](../guides/for-freelancer.md)
- [Client onboarding workflow](../workflows/client-onboarding.md)
- [Proposal-to-contract workflow](../workflows/proposal-to-contract.md)
- [Invoice and billing workflow](../workflows/invoice-and-billing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
