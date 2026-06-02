# Executive Assistant Workspace — Projectstructuur

> Voor een EA die een C-suite executive ondersteunt: agendabeheer, voorbereiding van vergaderingen, vervolgacties bijhouden, boardvoorbereiding, reislogistiek, stakeholdercommunicatie en onkostenbeheer — aangestuurd vanuit een enkele Claude Code workspace.

## Stack

- Google Workspace — Gmail (email), Google Calendar (planning), Google Drive (documentopslag)
- Notion — briefing documents, SOPs, stakeholder relationship notes
- Slack — interne asynchroon communicatie, exec channel monitoring
- Zoom — meeting logistics, recording links, host key management
- Concur of Expensify — boekingen en indiening onkostenrapporten
- DocuSign — document routing voor ondertekening, statustracking
- MCP: google-drive, gmail, slack

## Directorystructuur

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

## Belangrijkste bestanden verklaard

| Pad | Doel |
|---|---|
| `.claude/commands/meeting-brief.md` | Schuifcommando dat attendeenamen en agenda neemt, haalt van `stakeholders/` en `briefings/briefing-template.md`, en produceert een gestructureerde voorbereide briefing klaar om te verzenden of op te slaan |
| `.claude/commands/board-prep.md` | Schuifcommando dat `board/` materialen voor het komende kwartaal leest, het pre-read packet outline samenstelt, het agenda draft en vlaggen open action items van de vorige vergadering |
| `.claude/commands/follow-up-tracker.md` | Schuifcommando dat ruwe vergaderaantekeningen of transcripten inneemt, action items met eigenaren en vervaldatums extraheert, en formatteert als een trackbare vervolglijst |
| `.claude/commands/weekly-brief.md` | Schuifcommando dat de huidige week agenda, open vervolgacties en prioriteitscontext haalt om de maandagochtend briefing van de executive te produceren |
| `briefings/briefing-template.md` | Kanonieke briefing format: attendees met titels, agenda met time blocks, executive context, waarschijnlijke vragen, voorgestelde vragen — gebruikt als basis voor elke meeting brief |
| `stakeholders/board-members/` | Per-boardlid profielen met bio, communicatievoorkeuren en interactiegeschiedenis — opgehaald bij het opstellen van board communicatie of meeting briefs |
| `travel/exec-travel-preferences.md` | Enige waarheid voor reisvoorkeuren executive: voorkeur airlines, zitplaats (aisle/window), hotel tier, loyalty programmanummers, dieetwensen, grondvervoersvoorkeuren |
| `templates/email/` | Scenario-specifieke email templates — gebruikt door het `stakeholder-email.md` commando om contextueel passende outreach te ontwerpen zonder van nul te beginnen |
| `board/standing-materials/board-sop.md` | SOP voor de volledige board meeting lifecycle: concept agenda, materiaalverdelingdeadlines, goedkeuringsketen voor notulen, DocuSign routing voor consent items |
| `reports/weekly/weekly-brief-template.md` | Template voor de maandagochtend brief van de executive: deze weekagenda, prioriteiten gerangschikt op impact, open beslissingen nodig, vervolgacties vervallen deze week |

## Snelle scaffold

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

Dit workspace ondersteunt een EA die het volledige operationele ritme van een C-suite executive beheerd:
agenda, voorbereiding vergaderingen, board governance, reizen, stakeholder communicatie en onkosten.

---

## Wat dit is

Een gestructureerde Claude Code workspace voor een executive assistant. Directories mappen direct naar
functiegebieden. Claude Code leest van deze bestanden om organisatiespecifieke outputs te produceren — briefings,
emails en vervolglijsten die echte relaties en werkelijke context weerspiegelen, geen generieke formats.

---

## Stack

- Google Workspace — Gmail en Google Calendar als primaire comms en planning layer (MCP: gmail, google-drive)
- Notion — briefing documents en SOPs (geraadpleegd via Google Drive MCP of Notion API)
- Slack — interne async en exec channel monitoring (MCP: slack)
- Zoom — meeting logistics en recording links
- Concur of Expensify — reisboeking en onkostennumitatie
- DocuSign — document routing en ondertekeningsstatus tracking

---

## Directory conventies

- `briefings/` — Één bestand per vergadering, benoemd `YYYY-MM-DD-short-description.md`. Gearchiveerd per maand.
- `board/` — Één subdirectory per kwartaal (bijv. `2026-q2/`). Standaard materialen in `standing-materials/`.
- `travel/` — Actieve itineraria in `travel/active/`, voltooide trips in `travel/archive/`. Voorkeuren in `exec-travel-preferences.md`.
- `stakeholders/` — Één bestand per high-priority contact. Georganiseerd per niveau: `board-members/`, `investors/`, `partners/`, `media/`.
- `templates/` — Email templates in `templates/email/`, meeting agenda's in `templates/agendas/`. Bewerk een template nooit inline — kopieer naar de werkende context eerst.
- `reports/` — Wekelijkse briefs in `reports/weekly/`, maandelijkse samenvattingen in `reports/monthly/`. Naamformat: `YYYY-WNN-weekly-brief.md` of `YYYY-MM-monthly-summary.md`.
- `expenses/` — Één subdirectory per maand. Log onkosten in `june-expenses-log.md` voor indiening aan Concur/Expensify.

---

## Veelvoorkomende taken — exacte commando's

### Voorbereiding vergadering
```
/meeting-brief    — Zorg attendees en agenda. Claude haalt stakeholder profielen van stakeholders/
                    en produceert een volledige voorbereide briefing met briefings/briefing-template.md.
```

### Board governance
```
/board-prep       — Produceert het board pre-read packet outline, agenda concept en vlaggen open
                    action items van het vorige kwartaal's board/YYYY-QN/action-items-*.md.
```

### Vervolgtracking
```
/follow-up-tracker — Plak vergaderaantekeningen of transcript. Claude extraheert action items met eigenaren,
                     vervaldatums, en formatteert ze als trackbare lijst klaar om te verzenden of aan te loggen.
```

### Wekelijkse briefing
```
/weekly-brief     — Compileert deze weekagenda, open vervolgacties en prioriteitscontext in
                    de maandagochtend brief van de executive met reports/weekly/weekly-brief-template.md.
```

### Stakeholder communicatie
```
/stakeholder-email — Geef ontvanger en doel op. Claude laadt hun profiel van stakeholders/
                     en concept van de geschikte template in templates/email/.
```

### Reislogistiek
```
/travel-plan      — Zorg bestemming en datums. Claude past executive voorkeuren van
                    travel/exec-travel-preferences.md toe en genereert volledige itineraire checklist.
```

### Onkostenbeheer
```
/expense-report   — Zorg onkostendetails of een bon lijst. Claude formatteert de indiening
                    per het beleid in expenses/README.md, klaar voor Concur of Expensify invoer.
```

---

## Conventies Claude moet volgen

- Fabriceer nooit stakeholder names, titels of relationship context. Lees eerst van `stakeholders/`.
- Alle meeting briefings moeten `briefings/briefing-template.md` als basisstructuur gebruiken — verzin geen nieuw format.
- Bij het opstellen van emails, laad altijd het ontvanger profiel van `stakeholders/` voor het kiezen van een template.
- Reisitineraria moeten `travel/exec-travel-preferences.md` weerspiegelen — zitvoorkeur, loyalty nummers, hotel tier.
- Board minutes en materialen in `board/` zijn vertrouwelijk. Voeg geen letterlijke inhoud toe aan outputs die gemaild worden.
- Onkostenvermeldingen moeten naar het beleid in `expenses/README.md` verwijzen. Vlag alles dat de per diem overschrijdt of een bon nodig heeft die ontbreekt.
- Wanneer een vervolgactie uit een vergadering wordt geëxtraheerd, controleer `board/standing-materials/board-sop.md` als de vergadering board members betrokken had.
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

## Aanbevolen hooks

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

## Skills te installeren

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

## Gerelateerd

- [Guide: Claude for Executive Assistants](../guides/for-executive-assistant.md)
- [Workflow: Board Meeting Cycle](../workflows/board-meeting-cycle.md)
- [Workflow: Executive Weekly](../workflows/executive-weekly.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
