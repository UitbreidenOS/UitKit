# Executive Assistant Workspace — Project Structure

> For an EA supporting a C-suite executive: calendar management, meeting prep, follow-up tracking, board prep, travel logistics, stakeholder communications, and expense management — driven from a single Claude Code workspace.

## Stack

- Google Workspace — Gmail (email), Google Calendar (scheduling), Google Drive (document storage)
- Notion — briefing documents, SOPs, stakeholder relationship notes
- Slack — internal async communication, exec channel monitoring
- Zoom — meeting logistics, recording links, host key management
- Concur or Expensify — travel bookings and expense report submission
- DocuSign — document routing for signature, status tracking
- MCP: google-drive, gmail, slack

## Directory tree

```
ea-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions for Claude Code
│   ├── settings.json                          # Permissions, hooks, MCP configs
│   └── commands/
│       ├── meeting-brief.md                   # Takes attendees + agenda → full pre-meeting briefing
│       ├── travel-plan.md                     # Takes destination + dates → itinerary + logistics checklist
│       ├── follow-up-tracker.md               # Extracts action items from meeting notes → follow-up list
│       ├── board-prep.md                      # Assembles board packet from board/ → exec summary + materials index
│       ├── weekly-brief.md                    # Compiles weekly priorities, schedule, and open items for exec
│       ├── stakeholder-email.md               # Drafts stakeholder-specific email from templates/ + relationship notes
│       └── expense-report.md                 # Structures expense details into Concur/Expensify submission format
├── briefings/                                 # Pre-meeting briefings, organised by date
│   ├── README.md                              # Briefing archive index — links by month
│   ├── briefing-template.md                   # Canonical briefing format (attendees, agenda, context, asks)
│   ├── 2026-06/
│   │   ├── 2026-06-03-board-strategy-sync.md  # Board strategy sync — attendees, agenda, exec context
│   │   ├── 2026-06-05-investor-q-a.md         # Investor Q&A prep — investor backgrounds, likely questions
│   │   ├── 2026-06-10-partnership-call.md     # Partnership call — company background, deal context
│   │   └── 2026-06-17-all-hands-prep.md       # All-hands prep — talking points, slide review notes
│   └── 2026-05/
│       ├── 2026-05-20-ceo-peer-roundtable.md  # Peer roundtable — attendee bios, topic areas
│       └── 2026-05-28-qbr-prep.md            # QBR prep — metrics, narrative, exec asks
├── board/                                     # Board meeting materials and governance docs
│   ├── README.md                              # Board calendar, member roster, material filing guide
│   ├── members/
│   │   ├── board-member-profiles.md           # Bio, role, tenure, areas of focus per board member
│   │   └── committee-assignments.md           # Audit, compensation, nominating committee rosters
│   ├── 2026-q2/
│   │   ├── agenda-2026-q2.md                  # Board agenda with time allocations and presenters
│   │   ├── board-deck-outline-2026-q2.md      # Slide outline before final deck is produced
│   │   ├── pre-read-packet-2026-q2.md         # Executive summary + links to all pre-read materials
│   │   ├── minutes-2026-q2-draft.md           # Draft minutes for exec review before distribution
│   │   └── action-items-2026-q2.md            # Open action items from board meeting with owners and due dates
│   ├── 2026-q1/
│   │   ├── minutes-2026-q1-final.md           # Approved and signed board minutes
│   │   └── action-items-2026-q1-closed.md     # Closed Q1 action items — archived for governance record
│   └── standing-materials/
│       ├── board-sop.md                       # SOP — logistics, distribution list, approval workflow for minutes
│       └── consent-calendar-template.md       # Template for consent calendar items
├── travel/                                    # Itineraries, booking SOPs, and travel preferences
│   ├── README.md                              # Travel filing guide and booking workflow
│   ├── exec-travel-preferences.md             # Exec preferences — airlines, seats, hotels, loyalty numbers
│   ├── booking-sop.md                         # Step-by-step booking SOP for flights, hotels, ground transport
│   ├── visa-passport-tracker.md               # Passport expiry, visa validity, ESTA/ETA status by country
│   ├── active/
│   │   ├── 2026-06-18-london-trip.md          # Active itinerary — flights, hotel, ground transport, contacts
│   │   └── 2026-07-08-davos-trip.md           # Upcoming itinerary — flights TBC, hotel confirmed
│   └── archive/
│       ├── 2026-05-nyc-roadshow.md            # Completed — filed for expense reconciliation reference
│       └── 2026-04-sf-summit.md               # Completed — all expenses submitted and approved
├── stakeholders/                              # Key contacts, relationship notes, communication history
│   ├── README.md                              # Stakeholder tier guide (Board / Investors / Partners / Media)
│   ├── board-members/
│   │   ├── jane-doe-profile.md                # Bio, communication style, hot-button topics, last interaction
│   │   └── john-smith-profile.md              # Bio, preferred contact method, relationship context
│   ├── investors/
│   │   ├── series-b-lead.md                   # Lead investor profile — firm, partner, cadence, last update sent
│   │   └── strategic-investors.md             # Strategic investor contacts and engagement log
│   ├── partners/
│   │   ├── key-partners.md                    # Top 5 strategic partners — contacts, relationship status, next step
│   │   └── partner-engagement-log.md          # Rolling log of touchpoints, commitments, follow-ups
│   └── media/
│       ├── press-contacts.md                  # Journalists, outlets, beat, relationship tier
│       └── spokesperson-sop.md               # SOP — approved spokesperson list, clearance process for quotes
├── templates/                                 # Email templates by scenario, meeting agendas, briefing formats
│   ├── email/
│   │   ├── meeting-request-external.md        # Template — requesting a meeting with an external stakeholder
│   │   ├── meeting-request-internal.md        # Template — scheduling internal leadership meetings
│   │   ├── follow-up-post-meeting.md          # Template — post-meeting recap and action item summary
│   │   ├── board-member-update.md             # Template — proactive board member outreach between meetings
│   │   ├── investor-check-in.md               # Template — quarterly or ad-hoc investor touch
│   │   ├── speaking-invitation-accept.md      # Template — accepting a conference or panel invitation
│   │   ├── speaking-invitation-decline.md     # Template — declining gracefully with a referral option
│   │   ├── intro-request.md                   # Template — requesting a warm introduction on exec's behalf
│   │   ├── intro-forwarder.md                 # Template — forwarding an introduction with double opt-in
│   │   └── thank-you-post-event.md            # Template — post-event or post-meeting thank you note
│   ├── agendas/
│   │   ├── 1-1-agenda.md                      # Standard 1:1 agenda — standing items, topics, decisions needed
│   │   ├── leadership-team-agenda.md          # Weekly leadership team meeting structure
│   │   ├── board-meeting-agenda.md            # Board meeting agenda format with time blocks
│   │   └── offsite-agenda.md                  # Full-day offsite agenda with facilitation notes
│   └── briefings/
│       ├── external-meeting-brief.md          # Briefing format for external meetings
│       └── internal-review-brief.md           # Briefing format for internal business reviews
├── reports/                                   # Executive weekly and monthly summaries
│   ├── README.md                              # Report cadence and distribution list
│   ├── weekly/
│   │   ├── 2026-W22-weekly-brief.md           # Week of 2026-05-25 — priorities, schedule, open items
│   │   ├── 2026-W23-weekly-brief.md           # Week of 2026-06-01 — current week
│   │   └── weekly-brief-template.md           # Template — schedule, priorities, decisions, follow-ups
│   └── monthly/
│       ├── 2026-05-monthly-summary.md         # May 2026 — key outcomes, travel summary, decisions made
│       └── monthly-summary-template.md        # Template — highlights, stakeholder touchpoints, open loops
└── expenses/                                  # Expense tracking and submission records
    ├── README.md                              # Expense policy summary, Concur/Expensify login, approver chain
    ├── 2026-06/
    │   ├── june-expenses-log.md               # Running log of expenses this month for pre-submission review
    │   └── receipts-checklist.md              # Missing receipts tracker before monthly close
    └── archive/
        ├── 2026-05-expense-report.md          # Submitted and approved May report
        └── 2026-04-expense-report.md          # Submitted and approved April report
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/meeting-brief.md` | Slash command that takes attendee names and an agenda, pulls from `stakeholders/` and `briefings/briefing-template.md`, and produces a structured pre-meeting briefing ready to send or save |
| `.claude/commands/board-prep.md` | Slash command that reads `board/` materials for the upcoming quarter, compiles the pre-read packet outline, drafts the agenda, and flags open action items from the previous meeting |
| `.claude/commands/follow-up-tracker.md` | Slash command that ingests raw meeting notes or a transcript, extracts action items with owners and due dates, and formats them as a trackable follow-up list |
| `.claude/commands/weekly-brief.md` | Slash command that pulls the current week's calendar, open follow-ups, and priority context to produce the exec's Monday morning briefing |
| `briefings/briefing-template.md` | Canonical briefing format: attendees with titles, agenda with time blocks, exec context, likely questions, suggested asks — used as the base for every meeting brief |
| `stakeholders/board-members/` | Per-board-member profiles with bio, communication preferences, and interaction history — sourced when drafting board comms or meeting briefs |
| `travel/exec-travel-preferences.md` | Single source of truth for exec travel preferences: preferred airlines, seat (aisle/window), hotel tier, loyalty program numbers, dietary restrictions, ground transport preferences |
| `templates/email/` | Scenario-specific email templates — used by the `stakeholder-email.md` command to draft contextually appropriate outreach without starting from blank |
| `board/standing-materials/board-sop.md` | SOP for the full board meeting lifecycle: draft agenda, material distribution deadlines, approval chain for minutes, DocuSign routing for consent items |
| `reports/weekly/weekly-brief-template.md` | Template for the exec's Monday brief: this week's schedule, priorities ranked by impact, open decisions needed, follow-ups due this week |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p ea-workspace
cd ea-workspace

# Create .claude structure
mkdir -p .claude/commands

# Create workspace directories
mkdir -p briefings/briefing-template
mkdir -p briefings/2026-06
mkdir -p briefings/2026-05
mkdir -p board/members
mkdir -p board/2026-q2
mkdir -p board/2026-q1
mkdir -p board/standing-materials
mkdir -p travel/active
mkdir -p travel/archive
mkdir -p stakeholders/board-members
mkdir -p stakeholders/investors
mkdir -p stakeholders/partners
mkdir -p stakeholders/media
mkdir -p templates/email
mkdir -p templates/agendas
mkdir -p templates/briefings
mkdir -p reports/weekly
mkdir -p reports/monthly
mkdir -p expenses/2026-06
mkdir -p expenses/archive

# Seed key files
touch briefings/README.md briefings/briefing-template.md
touch board/README.md board/standing-materials/board-sop.md board/standing-materials/consent-calendar-template.md
touch board/members/board-member-profiles.md board/members/committee-assignments.md
touch travel/exec-travel-preferences.md travel/booking-sop.md travel/visa-passport-tracker.md travel/README.md
touch stakeholders/README.md
touch stakeholders/board-members/.gitkeep
touch stakeholders/investors/strategic-investors.md
touch stakeholders/partners/key-partners.md stakeholders/partners/partner-engagement-log.md
touch stakeholders/media/press-contacts.md stakeholders/media/spokesperson-sop.md
touch templates/email/meeting-request-external.md templates/email/meeting-request-internal.md
touch templates/email/follow-up-post-meeting.md templates/email/board-member-update.md
touch templates/email/investor-check-in.md templates/email/intro-request.md templates/email/intro-forwarder.md
touch templates/email/speaking-invitation-accept.md templates/email/speaking-invitation-decline.md
touch templates/email/thank-you-post-event.md
touch templates/agendas/1-1-agenda.md templates/agendas/leadership-team-agenda.md
touch templates/agendas/board-meeting-agenda.md templates/agendas/offsite-agenda.md
touch templates/briefings/external-meeting-brief.md templates/briefings/internal-review-brief.md
touch reports/README.md reports/weekly/weekly-brief-template.md reports/monthly/monthly-summary-template.md
touch expenses/README.md expenses/2026-06/june-expenses-log.md expenses/2026-06/receipts-checklist.md

# Install Claude Code skills
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator

# Install slash commands
npx claudient add command meeting-brief
npx claudient add command travel-plan
npx claudient add command follow-up-tracker
npx claudient add command board-prep
npx claudient add command weekly-brief
npx claudient add command stakeholder-email
npx claudient add command expense-report
```

## CLAUDE.md template

```markdown
# Executive Assistant Workspace

This workspace supports an EA managing the full operational rhythm of a C-suite executive:
calendar, meeting prep, board governance, travel, stakeholder communications, and expenses.

---

## What this is

A structured Claude Code workspace for an executive assistant. Directories map directly to
job functions. Claude Code reads from these files to produce org-specific outputs — briefings,
emails, and follow-up lists that reflect real relationships and actual context, not generic formats.

---

## Stack

- Google Workspace — Gmail and Google Calendar as primary comms and scheduling layer (MCP: gmail, google-drive)
- Notion — briefing documents and SOPs (accessed via Google Drive MCP or Notion API)
- Slack — internal async and exec channel monitoring (MCP: slack)
- Zoom — meeting logistics and recording links
- Concur or Expensify — travel booking and expense submission
- DocuSign — document routing and signature status tracking

---

## Directory conventions

- `briefings/` — One file per meeting, named `YYYY-MM-DD-short-description.md`. Archived by month.
- `board/` — One subdirectory per quarter (e.g., `2026-q2/`). Standing materials stay in `standing-materials/`.
- `travel/` — Active itineraries in `travel/active/`, completed trips in `travel/archive/`. Preferences in `exec-travel-preferences.md`.
- `stakeholders/` — One file per high-priority contact. Organised by tier: `board-members/`, `investors/`, `partners/`, `media/`.
- `templates/` — Email templates in `templates/email/`, meeting agendas in `templates/agendas/`. Never edit a template inline — copy to the working context first.
- `reports/` — Weekly briefs in `reports/weekly/`, monthly summaries in `reports/monthly/`. Name format: `YYYY-WNN-weekly-brief.md` or `YYYY-MM-monthly-summary.md`.
- `expenses/` — One subdirectory per month. Log expenses in `june-expenses-log.md` before submitting to Concur/Expensify.

---

## Common tasks — exact commands

### Meeting preparation
```
/meeting-brief    — Provide attendees and agenda. Claude pulls stakeholder profiles from stakeholders/
                    and produces a full pre-meeting briefing using briefings/briefing-template.md.
```

### Board governance
```
/board-prep       — Produces the board pre-read packet outline, agenda draft, and flags open
                    action items from the previous quarter's board/YYYY-QN/action-items-*.md.
```

### Follow-up tracking
```
/follow-up-tracker — Paste meeting notes or transcript. Claude extracts action items with owners,
                     due dates, and formats them as a trackable list ready to send or log.
```

### Weekly briefing
```
/weekly-brief     — Compiles this week's schedule, open follow-ups, and priority context into
                    the exec's Monday morning brief using reports/weekly/weekly-brief-template.md.
```

### Stakeholder communications
```
/stakeholder-email — Specify the recipient and purpose. Claude loads their profile from stakeholders/
                     and drafts from the appropriate template in templates/email/.
```

### Travel logistics
```
/travel-plan      — Provide destination and dates. Claude applies exec preferences from
                    travel/exec-travel-preferences.md and generates a full itinerary checklist.
```

### Expense management
```
/expense-report   — Provide expense details or a receipt list. Claude formats the submission
                    per the policy in expenses/README.md, ready for Concur or Expensify entry.
```

---

## Conventions Claude must follow

- Never fabricate stakeholder names, titles, or relationship context. Read from `stakeholders/` first.
- All meeting briefings must use `briefings/briefing-template.md` as the base structure — do not invent a new format.
- When drafting emails, always load the recipient's profile from `stakeholders/` before choosing a template.
- Travel itineraries must reflect `travel/exec-travel-preferences.md` — seat preference, loyalty numbers, hotel tier.
- Board minutes and materials in `board/` are confidential. Do not include verbatim content in outputs that will be emailed.
- Expense entries must reference the policy in `expenses/README.md`. Flag anything that exceeds the per-diem or requires a receipt that is missing.
- When a follow-up is extracted from a meeting, check `board/standing-materials/board-sop.md` if the meeting involved board members.
```

## MCP servers

```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "@gptscript-ai/mcp-server-gmail"],
      "env": {
        "GMAIL_CLIENT_ID": "${GMAIL_CLIENT_ID}",
        "GMAIL_CLIENT_SECRET": "${GMAIL_CLIENT_SECRET}",
        "GMAIL_REFRESH_TOKEN": "${GMAIL_REFRESH_TOKEN}"
      }
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "${GDRIVE_CLIENT_ID}",
        "GDRIVE_CLIENT_SECRET": "${GDRIVE_CLIENT_SECRET}",
        "GDRIVE_REFRESH_TOKEN": "${GDRIVE_REFRESH_TOKEN}"
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
        "/Users/you/ea-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"briefings/\"; then echo \"[Briefing hook] Briefing saved — confirm it has been shared with the exec via Slack or email before the meeting.\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"board/\" && echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"action-items\"; then echo \"[Board hook] Action items filed — verify each item has an owner and due date before distributing.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] Check for any drafted emails or follow-ups that still need to be sent. Open items should be logged in the current week report under reports/weekly/.\"\n'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/doc-site-builder
```

## Related

- [Guide: Claude for Executive Assistants](../guides/for-executive-assistant.md)
- [Workflow: Board Meeting Cycle](../workflows/board-meeting-cycle.md)
- [Workflow: Executive Weekly](../workflows/executive-weekly.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
