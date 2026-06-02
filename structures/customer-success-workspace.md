# Customer Success Manager Workspace — Project Structure

> A Claude Code workspace for CSMs managing a book of business: onboarding, health monitoring, QBR delivery, expansion identification, churn response, and renewal tracking — all driven by slash commands and account-level context.

## Stack

- **Gainsight** (CS platform) or **ChurnZero** — health scores, success plans, automated playbooks
- **Salesforce** or **HubSpot** — CRM, opportunity and renewal pipeline, account hierarchy
- **Zendesk** or **Intercom** — support ticket volume and sentiment signals
- **Zoom** — customer calls; recordings and transcripts fed back into account notes
- **Slack** — internal CS team coordination and customer Slack Connect channels
- **Notion** — CS playbooks, mutual action plan templates, onboarding runbooks

## Directory tree

```
cs-workspace/
├── .claude/
│   ├── CLAUDE.md                          # workspace instructions for Claude Code
│   ├── settings.json                      # MCP servers, hooks, permissions
│   └── commands/
│       ├── onboarding-plan.md             # /onboarding-plan <customer-name> — 30/60/90 day plan
│       ├── qbr-prep.md                    # /qbr-prep — builds QBR deck outline and talking points
│       ├── health-check.md                # /health-check — reads health data, surfaces at-risk accounts
│       ├── expansion-brief.md             # /expansion-brief — identifies upsell signals per account
│       ├── churn-risk.md                  # /churn-risk — churn signal analysis with response playbook
│       ├── renewal-prep.md                # /renewal-prep — renewal readiness doc with commercial context
│       └── nps-follow-up.md              # /nps-follow-up — drafts follow-up emails by NPS score band
├── customers/
│   ├── _template/                         # copy this folder when onboarding a new account
│   │   ├── health-data.md                 # health score log: signals, scores, tier (Green/Yellow/Red)
│   │   ├── meeting-notes/
│   │   │   └── YYYY-MM-DD-kickoff.md      # one file per meeting, named by date and type
│   │   ├── success-plan.md                # mutual success plan: goals, milestones, owners, dates
│   │   └── renewal-tracker.md             # renewal date, ARR, expansion history, renewal readiness
│   ├── acme-corp/
│   │   ├── health-data.md                 # current health tier: Yellow; last updated: 2026-05-28
│   │   ├── meeting-notes/
│   │   │   ├── 2026-01-15-kickoff.md
│   │   │   ├── 2026-03-10-qbr-q1.md
│   │   │   └── 2026-05-20-expansion-call.md
│   │   ├── success-plan.md                # agreed goals: 80% seat activation by Q2, 3 integrations live
│   │   └── renewal-tracker.md             # renews 2026-09-01, $48K ARR, 1 expansion opportunity open
│   ├── brightpath-inc/
│   │   ├── health-data.md                 # current health tier: Red; churn risk: high
│   │   ├── meeting-notes/
│   │   │   ├── 2026-02-03-kickoff.md
│   │   │   └── 2026-04-18-save-call.md
│   │   ├── success-plan.md
│   │   └── renewal-tracker.md             # renews 2026-07-15, $12K ARR, at risk
│   └── novex-solutions/
│       ├── health-data.md                 # current health tier: Green; expansion candidate
│       ├── meeting-notes/
│       │   ├── 2026-01-22-kickoff.md
│       │   ├── 2026-04-05-qbr-q1.md
│       │   └── 2026-05-30-expansion-brief.md
│       ├── success-plan.md
│       └── renewal-tracker.md             # renews 2026-12-01, $72K ARR, expansion in progress
├── playbooks/
│   ├── onboarding.md                      # full 30/60/90 day onboarding runbook with escalation triggers
│   ├── expansion.md                       # upsell motion: signals, timing, talk tracks, objection handling
│   ├── churn-save.md                      # save playbook by churn signal tier and days-to-renewal
│   └── qbr-delivery.md                   # QBR facilitation guide: agenda, rules, follow-up cadence
├── templates/
│   ├── success-plan-template.md           # mutual success plan: goals, KPIs, milestones, owners
│   ├── mutual-action-plan.md              # MAP for onboarding: customer and CSM tasks side by side
│   ├── ebr-deck-outline.md               # Executive Business Review deck structure (6 slides)
│   └── renewal-proposal.md               # renewal proposal: value summary, pricing, next steps
└── metrics/
    ├── book-health-dashboard.md           # all accounts: name, ARR, tier, renewal date, last touch
    └── renewal-pipeline.md               # renewals in next 90/60/30 days with readiness score
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/onboarding-plan.md` | Slash command that takes `$ARGUMENTS` as customer name, reads that account's folder, and generates a tailored 30/60/90 day onboarding plan with specific milestones |
| `.claude/commands/health-check.md` | Reads all `customers/*/health-data.md` files and surfaces accounts by tier — outputs a prioritized action list with suggested next steps per at-risk account |
| `.claude/commands/churn-risk.md` | Cross-references health data, days since last touchpoint, renewal date, and support ticket signals to produce a churn risk brief with response playbook |
| `.claude/commands/renewal-prep.md` | Reads the target account's `renewal-tracker.md`, `success-plan.md`, and meeting notes to build a renewal readiness document with commercial context and open risks |
| `customers/_template/` | Canonical folder structure to copy when onboarding any new account — ensures consistency across the book of business |
| `metrics/book-health-dashboard.md` | Single-pane view of all accounts with ARR, health tier, renewal date, and last CSM touchpoint — the source of truth for weekly CS team review |
| `playbooks/churn-save.md` | Churn response playbook segmented by signal type (usage drop, exec sponsor change, invoice overdue) and days-to-renewal, with specific talk tracks and escalation paths |
| `templates/ebr-deck-outline.md` | Executive Business Review deck structure: business recap, value delivered, metrics vs. goals, roadmap, open items, next steps — ready to populate per account |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p cs-workspace/.claude/commands

# Create customer account template
mkdir -p cs-workspace/customers/_template/meeting-notes

# Create playbooks, templates, metrics directories
mkdir -p cs-workspace/playbooks
mkdir -p cs-workspace/templates
mkdir -p cs-workspace/metrics

# Stub out the slash command files
touch cs-workspace/.claude/commands/onboarding-plan.md
touch cs-workspace/.claude/commands/qbr-prep.md
touch cs-workspace/.claude/commands/health-check.md
touch cs-workspace/.claude/commands/expansion-brief.md
touch cs-workspace/.claude/commands/churn-risk.md
touch cs-workspace/.claude/commands/renewal-prep.md
touch cs-workspace/.claude/commands/nps-follow-up.md

# Stub out customer template files
touch cs-workspace/customers/_template/health-data.md
touch cs-workspace/customers/_template/success-plan.md
touch cs-workspace/customers/_template/renewal-tracker.md

# Stub out metrics files
touch cs-workspace/metrics/book-health-dashboard.md
touch cs-workspace/metrics/renewal-pipeline.md

# Stub out playbook files
touch cs-workspace/playbooks/onboarding.md
touch cs-workspace/playbooks/expansion.md
touch cs-workspace/playbooks/churn-save.md
touch cs-workspace/playbooks/qbr-delivery.md

# Stub out template files
touch cs-workspace/templates/success-plan-template.md
touch cs-workspace/templates/mutual-action-plan.md
touch cs-workspace/templates/ebr-deck-outline.md
touch cs-workspace/templates/renewal-proposal.md

# Install CS skills
npx claudient add skill gtm/customer-success
npx claudient add skill gtm/mutual-success-plan
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/health-score-analyzer
npx claudient add skill gtm/expansion-playbook
npx claudient add skill gtm/churn-prevention

# Create sample account from template
cp -r cs-workspace/customers/_template cs-workspace/customers/acme-corp
```

## CLAUDE.md template

```markdown
# CS Workspace — Claude Code Instructions

## What this is

This is a Customer Success Manager workspace. It contains account data, health signals,
playbooks, and templates for managing a book of business. Claude Code operates here as a
CS analyst and writer — reading account context to generate tailored deliverables.

All account data is local and private. Never include specific account data in outputs
sent outside this workspace.

## Stack

- CS platform: Gainsight (or ChurnZero) — health scores, success plans, automated motions
- CRM: HubSpot (or Salesforce) — renewal pipeline, account hierarchy, ARR
- Support: Zendesk — ticket volume and sentiment signals fed into health-data.md files
- Calls: Zoom — meeting transcripts stored in customers/<account>/meeting-notes/
- Collaboration: Slack, Notion

## Common tasks and exact commands

Onboard a new customer:
  /onboarding-plan <customer-name>
  → Reads customers/<customer-name>/ and generates a 30/60/90 day plan

Run health check across the book:
  /health-check
  → Reads all customers/*/health-data.md and outputs prioritized action list by tier

Prepare for a QBR:
  /qbr-prep
  → Prompts for customer name, reads their folder, builds QBR agenda and talking points

Identify expansion opportunities:
  /expansion-brief
  → Reads health data and meeting notes; surfaces expansion signals per account

Assess churn risk:
  /churn-risk
  → Cross-references health tier, renewal date, last touchpoint, and support signals

Prepare for a renewal:
  /renewal-prep
  → Reads renewal-tracker.md and success-plan.md; outputs renewal readiness document

Follow up on NPS responses:
  /nps-follow-up
  → Prompts for NPS score and verbatim; drafts follow-up email by score band

## Workspace conventions

- One folder per account under customers/ — always created from _template/
- Health data files use three tiers: Green / Yellow / Red — update after every call
- Meeting notes are named YYYY-MM-DD-<type>.md (kickoff, qbr, expansion-call, save-call)
- Renewal tracker is updated after every commercial conversation
- The book-health-dashboard.md in metrics/ is the source of truth for weekly team review

## Account health tiers

Green (score 7-10): quarterly touchpoint, look for expansion signals
Yellow (score 4-6): monthly check-in, identify and remove blockers
Red (score 1-3): weekly engagement, escalate to CS lead if no response in 5 days

## Do not

- Do not generate content that contradicts documented customer success criteria
- Do not propose expansion before a customer has reached Green health tier
- Do not use generic QBR templates — always read the account folder first
- Do not commit customers/ data to any remote git repository
```

## MCP servers

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
      }
    },
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp-server"],
      "env": {
        "SF_USERNAME": "${SF_USERNAME}",
        "SF_PASSWORD": "${SF_PASSWORD}",
        "SF_SECURITY_TOKEN": "${SF_SECURITY_TOKEN}",
        "SF_LOGIN_URL": "https://login.salesforce.com"
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
        "/Users/$USER/cs-workspace/customers",
        "/Users/$USER/cs-workspace/metrics"
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
            "command": "grep -q 'health tier:' \"$CLAUDE_TOOL_RESULT_FILE\" && echo '[health-check] Health tier updated — consider refreshing book-health-dashboard.md' || true"
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
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'customers/'; then echo '[cs-workspace] Writing to account folder — confirm account name matches directory'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[cs-workspace] Session ended. Reminder: update book-health-dashboard.md if any health tiers changed this session.'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill gtm/customer-success
npx claudient add skill gtm/mutual-success-plan
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/health-score-analyzer
npx claudient add skill gtm/expansion-playbook
npx claudient add skill gtm/churn-prevention
```

## Related

- [Customer Success Guide](../guides/for-customer-success.md)
- [QBR Delivery Workflow](../workflows/qbr-delivery.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
