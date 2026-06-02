# SDR / BDR Workspace — Project Structure

> Daily operating system for Sales Development Representatives: territory management, account research, personalized outreach, inbox triage, call prep, and pipeline reporting — all driven by Claude Code slash commands wired to HubSpot, Apollo.io, Gong, and Slack.

## Stack

- **HubSpot** — CRM, contact/company records, sequence enrollment, deal creation
- **Apollo.io** — Prospecting database, email enrichment, intent signals
- **Outreach / Salesloft** — Sequence execution, cadence management, step tracking
- **Gong** — Call recording, transcript access, talk-time analytics
- **Clay** — Enrichment workflows, waterfall data pulling, list building
- **Slack** — Team standup, deal alerts, AE handoff notifications
- **Claude Code** — Slash commands for every repeatable SDR workflow

## Directory tree

```
sdr-workspace/
├── .claude/
│   ├── CLAUDE.md                        # Workspace instructions for Claude
│   ├── settings.json                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── morning-brief.md             # Pull territory alerts + prioritize accounts
│       ├── research.md                  # Deep account brief (takes $COMPANY arg)
│       ├── draft-email.md               # Personalized cold/follow-up email writer
│       ├── triage-inbox.md              # Classify replies + draft responses + log CRM
│       ├── call-prep.md                 # Talk track + discovery Qs + objection scripts
│       ├── log-call.md                  # Structured post-call note → HubSpot activity
│       └── weekly-review.md             # Pipeline metrics + activity summary + next focus
├── icp/
│   ├── icp-definition.md                # Firmographic + technographic fit criteria
│   ├── persona-vp-sales.md              # VP Sales / CRO buyer persona
│   ├── persona-head-of-revops.md        # RevOps buyer persona
│   ├── persona-sales-enablement.md      # Enablement buyer persona
│   ├── negative-icp.md                  # Explicit disqualifiers (size, vertical, stage)
│   └── scoring-rubric.md                # 0-100 lead score weights by signal type
├── sequences/
│   ├── cold/
│   │   ├── saas-outbound-7step.md       # 7-touch cold sequence for SaaS targets
│   │   ├── enterprise-12step.md         # 12-touch enterprise sequence (60-day)
│   │   └── smb-3step.md                 # Fast 3-touch for SMB accounts
│   ├── inbound/
│   │   ├── demo-request-followup.md     # Inbound demo request response sequence
│   │   └── content-download-nurture.md  # Nurture for gated content downloaders
│   └── reactivation/
│       ├── cold-lead-reactivation.md    # Stale opportunities (90+ days silent)
│       └── former-customer-winback.md   # Churned customers re-approach
├── territory/
│   ├── account-list.csv                 # Full territory — all assigned accounts
│   ├── tier-1-priority.csv              # Top 25 accounts to work this quarter
│   ├── whitespace-analysis.md           # Uncovered segments + expansion opportunities
│   ├── territory-map.md                 # Geographic / vertical breakdown
│   └── account-notes/
│       ├── acme-corp.md                 # Per-account research notes + history
│       ├── initech-llc.md
│       └── globodyne-inc.md
├── intel/
│   ├── battlecards/
│   │   ├── vs-competitor-a.md           # Head-to-head comparison + talk tracks
│   │   ├── vs-competitor-b.md
│   │   └── vs-competitor-c.md
│   ├── value-props/
│   │   ├── roi-calculator.md            # ROI talking points by use case
│   │   ├── feature-differentiators.md   # Top 5 differentiators with proof points
│   │   └── customer-stories.md          # Reference customers by vertical
│   └── objection-library.md             # Indexed objection → response map
├── logs/
│   └── weekly/
│       ├── 2026-W22.md                  # Weekly review: activities, pipeline, learnings
│       ├── 2026-W21.md
│       └── 2026-W20.md
└── README.md                            # Quick-start for this workspace
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/morning-brief.md` | Fetches open tasks from HubSpot, surfaces accounts with recent intent signals from Apollo.io, and outputs a prioritized call list for the day |
| `.claude/commands/research.md` | Takes a company name, pulls firmographic data, recent news, tech stack from Apollo.io and Clay, scores against ICP rubric, outputs a structured account brief |
| `.claude/commands/triage-inbox.md` | Reads email/Outreach reply queue, classifies each as Interested/Not Now/Objection/Bounce/Auto-reply, drafts responses, flags hot replies for immediate action |
| `.claude/commands/call-prep.md` | Takes a contact + company, generates a 3-part prep doc: discovery question bank, objection scripts keyed to their role, and a soft close script |
| `.claude/commands/log-call.md` | Takes raw call notes or Gong transcript, extracts next steps, updates HubSpot activity log, and sets follow-up task with due date |
| `icp/scoring-rubric.md` | Defines the 0-100 scoring weights used by `/sdr-lead-scorer` — edit when ICP changes to keep scoring calibrated |
| `intel/objection-library.md` | Master objection index used by `/sdr-objection-handler` — add new objections after calls to keep it fresh |
| `logs/weekly/` | Persistent weekly review logs used by `/weekly-review` to trend metrics over time and surface coaching opportunities |

## Quick scaffold

```bash
# Create the workspace directory and all subdirectories
mkdir -p sdr-workspace/.claude/commands
mkdir -p sdr-workspace/icp
mkdir -p sdr-workspace/sequences/cold
mkdir -p sdr-workspace/sequences/inbound
mkdir -p sdr-workspace/sequences/reactivation
mkdir -p sdr-workspace/territory/account-notes
mkdir -p sdr-workspace/intel/battlecards
mkdir -p sdr-workspace/intel/value-props
mkdir -p sdr-workspace/logs/weekly

# Stub out command files
touch sdr-workspace/.claude/commands/morning-brief.md
touch sdr-workspace/.claude/commands/research.md
touch sdr-workspace/.claude/commands/draft-email.md
touch sdr-workspace/.claude/commands/triage-inbox.md
touch sdr-workspace/.claude/commands/call-prep.md
touch sdr-workspace/.claude/commands/log-call.md
touch sdr-workspace/.claude/commands/weekly-review.md

# Stub out ICP files
touch sdr-workspace/icp/icp-definition.md
touch sdr-workspace/icp/negative-icp.md
touch sdr-workspace/icp/scoring-rubric.md

# Stub out intel files
touch sdr-workspace/intel/objection-library.md
touch sdr-workspace/intel/value-props/roi-calculator.md
touch sdr-workspace/intel/value-props/feature-differentiators.md
touch sdr-workspace/intel/value-props/customer-stories.md

# Create this week's log file
echo "# Weekly Review — $(date +%Y-W%V)" > sdr-workspace/logs/weekly/$(date +%Y-W%V).md

# Install all SDR skills
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot

echo "SDR workspace scaffold complete."
```

## CLAUDE.md template

```markdown
# SDR Workspace — Claude Instructions

## What this is

This is an SDR/BDR daily operating workspace. Every directory and command here is
optimized for one outcome: booked meetings. Claude Code runs research, drafting,
triage, call prep, and logging — you handle relationships and judgment calls.

Do not add application code here. This is a content and workflow workspace.

## Stack

- HubSpot: CRM of record — contacts, companies, activities, sequences, deals
- Apollo.io: prospecting database, enrichment, intent signals
- Outreach: sequence cadence execution (or Salesloft — check which is active)
- Gong: call transcripts, talk-time data, moment detection
- Clay: enrichment waterfall workflows, list building
- Slack: team comms, deal alerts (#sdr-wins, #ae-handoffs channels)

## Territory

- ICP definition lives in icp/icp-definition.md — read it before scoring any account
- Scoring rubric lives in icp/scoring-rubric.md — use these weights when running /sdr-lead-scorer
- Tier-1 accounts live in territory/tier-1-priority.csv — these get worked first, every day
- Per-account notes in territory/account-notes/ — one file per account, update after every touch

## Common tasks — exact commands

### Start the day
/morning-brief
→ Outputs prioritized call list, flags hot inbound replies, surfaces intent signals

### Research an account before outreach
/research [company name]
→ Full account brief: firmographics, tech stack, ICP score, trigger events, stakeholder map

### Write a personalized cold email
/draft-email
→ Prompts for account brief + persona, outputs subject + body with personalization tokens

### Triage your inbox
/triage-inbox
→ Reads reply queue, classifies each reply, drafts responses, flags hot leads

### Prep for a call
/call-prep
→ Takes contact name + company, outputs discovery questions, objection scripts, soft close

### Log a call to HubSpot
/log-call
→ Paste raw notes or Gong transcript link — Claude extracts next steps and updates CRM

### End-of-week review
/weekly-review
→ Pulls activity metrics, pipeline progression, books vs. target, and next-week focus areas

## Conventions

- Account notes: always include Last Touched date, Last Outcome, and Next Step at the top
- Subject lines: max 6 words, no ALL CAPS, no exclamation marks
- Call logs: always include a Next Step with a specific date — no open-ended follow-ups
- Weekly logs: saved to logs/weekly/YYYY-WNN.md — never delete historical logs
- Sequence selection: cold/ for net-new, inbound/ for demo requests, reactivation/ for 90+ days dark
- Battlecards: update vs-competitor-*.md any time a prospect surfaces a new objection or the competitor ships a new feature

## What Claude should not do

- Do not send emails or enroll sequences without explicit confirmation
- Do not create HubSpot deals without confirming ICP score is above 60
- Do not log calls with empty Next Step fields
- Do not draft outreach without first reading the account note if one exists
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
        "/Users/$USER/sdr-workspace"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */logs/weekly/* ]]; then echo \"[hook] Weekly log updated: $CLAUDE_TOOL_RESULT_PATH\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[$(date +%H:%M)] Session ended. Run /morning-brief tomorrow to reprioritize.\" >> /tmp/sdr-session.log'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__hubspot__create_deal",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[hook] Deal creation triggered — confirm ICP score >= 60 before proceeding.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

## Related

- [SDR guide — full workflow documentation](../guides/for-sdr.md)
- [SDR daily workflow — end-to-end process](../workflows/sdr-daily.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
