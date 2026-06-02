# Designbureau / Designstudio — Projectstructuur

> Voor designbureaus die clientprojecten beheren voor branding, UX en digital design — van briefing en moodboarding tot designproductie, asynchrone reviews, clienthandoff en projectfacturering — allemaal in één Claude Code werkruimte.

## Stack

- **Design + prototyping + handoff:** Figma (componenten, auto-layout, dev mode, prototype flows, design tokens, Figma Sites)
- **Projectmanagement + briefs:** Notion (client databases, project wikis, creative briefs, meeting notes)
- **Taakbeheer:** Linear (issue-level taakbeheer, sprint cycles, priority triage) of Asana (projecttijdlijnen, taskafhankelijkheden, client-zichtbare borden)
- **Tijdregistratie:** Harvest (projectniveau tijdregistratie, budget burn, team capaciteitsrapporten)
- **Facturering:** FreshBooks (clientfacturen, retainer billing, expense tracking, betalingsherinneringen)
- **Asynchrone videoreviews:** Loom (concept walkthroughs, revision explanations, handoff walkthroughs voor developers)
- **Communicatie:** Slack (#client-<name> per client, #design-production, #new-business, #ops)
- **Docs + shared drives:** Google Workspace (Docs voor deliverables, Slides voor presentaties, Drive voor asset storage)

## Directory tree

```
design-agency/
├── .claude/
│   ├── CLAUDE.md                                        # Workspace instructions for Claude Code
│   ├── settings.json                                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-client.md                                # /new-client — scaffold full client directory from _template
│       ├── creative-brief.md                            # /creative-brief — generate structured creative brief from intake notes
│       ├── design-review.md                             # /design-review — produce agenda + feedback framework for design review session
│       ├── handoff.md                                   # /handoff — generate developer handoff checklist and Figma annotation guide
│       ├── revision-log.md                              # /revision-log — log a revision round with scope, rationale, and round count
│       ├── proposal.md                                  # /proposal — draft new-business project proposal from prospect notes
│       ├── ux-audit.md                                  # /ux-audit — run structured UX heuristic audit against a brief or Figma link
│       └── invoice-summary.md                          # /invoice-summary — summarize Harvest hours for FreshBooks invoice preparation
├── clients/
│   ├── _template/                                       # Master template — copy to clients/<client-slug>/ on intake
│   │   ├── brief.md                                     # Client creative brief — goals, audience, deliverables, constraints, timeline
│   │   ├── contract.md                                  # Project contract or retainer agreement with scope and payment terms
│   │   ├── brand-assets/
│   │   │   ├── brand-guidelines.md                      # Colors, typography, logo rules, tone of voice
│   │   │   ├── logo/                                    # Approved logo files: SVG, PNG, dark/light variants
│   │   │   ├── fonts/                                   # Licensed font files or Google Fonts spec
│   │   │   └── photography/                             # Approved photography style guide and approved hero images
│   │   ├── design-files-links.md                        # Links to all Figma files: main file, component library, prototype
│   │   ├── feedback-log.md                              # Timestamped log of all client feedback by round
│   │   ├── deliverables/
│   │   │   ├── _handoff-checklist.md                    # Completion checklist before handing off any deliverable
│   │   │   └── exports/                                 # Final exported assets: PNG, SVG, PDF, ZIP
│   │   └── invoice-log.md                               # Invoice history: date, amount, scope, status (paid/outstanding)
│   ├── nova-brand-co/
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── brand-assets/
│   │   │   ├── brand-guidelines.md
│   │   │   ├── logo/
│   │   │   │   ├── nova-logo-primary.svg
│   │   │   │   ├── nova-logo-dark.svg
│   │   │   │   └── nova-logo-mark.png
│   │   │   ├── fonts/
│   │   │   │   └── font-spec.md
│   │   │   └── photography/
│   │   │       └── style-guide.md
│   │   ├── design-files-links.md
│   │   ├── feedback-log.md
│   │   ├── deliverables/
│   │   │   ├── _handoff-checklist.md
│   │   │   └── exports/
│   │   │       ├── nova-brand-kit-v1.zip
│   │   │       └── nova-logo-package.zip
│   │   └── invoice-log.md
│   └── meridian-app/
│       ├── brief.md
│       ├── contract.md
│       ├── brand-assets/
│       │   ├── brand-guidelines.md
│       │   ├── logo/
│       │   └── fonts/
│       ├── design-files-links.md
│       ├── feedback-log.md
│       ├── deliverables/
│       │   ├── _handoff-checklist.md
│       │   └── exports/
│       └── invoice-log.md
├── projects/
│   ├── nova-brand-identity/                             # Active project — one directory per named project
│   │   ├── brief.md                                     # Project-specific brief (may differ from client-level brief)
│   │   ├── moodboard.md                                 # Visual references, inspiration links, style direction notes
│   │   ├── concepts/
│   │   │   ├── concept-a-modern-minimal/
│   │   │   │   ├── notes.md                             # Design rationale and presentation talking points
│   │   │   │   └── figma-link.md                        # Link to Figma frame or page for this concept
│   │   │   └── concept-b-bold-expressive/
│   │   │       ├── notes.md
│   │   │       └── figma-link.md
│   │   ├── revisions/
│   │   │   ├── round-1/
│   │   │   │   ├── client-feedback.md                   # Verbatim or summarized client feedback
│   │   │   │   ├── revision-notes.md                    # Designer notes on what changed and why
│   │   │   │   └── figma-link.md
│   │   │   └── round-2/
│   │   │       ├── client-feedback.md
│   │   │       ├── revision-notes.md
│   │   │       └── figma-link.md
│   │   └── final/
│   │       ├── approved-concept.md                      # Record of which concept was approved and approval date
│   │       ├── handoff-notes.md                         # Notes to developer or client for final delivery
│   │       └── figma-link.md
│   └── meridian-app-ux/
│       ├── brief.md
│       ├── moodboard.md
│       ├── concepts/
│       │   └── concept-a-card-based-nav/
│       │       ├── notes.md
│       │       └── figma-link.md
│       ├── revisions/
│       │   └── round-1/
│       │       ├── client-feedback.md
│       │       ├── revision-notes.md
│       │       └── figma-link.md
│       └── final/
│           ├── approved-concept.md
│           ├── handoff-notes.md
│           └── figma-link.md
├── templates/
│   ├── creative-brief.md                                # Standard creative brief: goals, audience, deliverables, timeline, constraints
│   ├── project-proposal.md                              # New-business proposal: situation, approach, team, investment, timeline
│   ├── design-review-agenda.md                          # Design review meeting agenda with structured feedback prompts
│   ├── handoff-checklist.md                             # Pre-handoff checklist: Figma cleanup, exports, annotations, dev-mode
│   └── revision-policy.md                               # Studio revision policy: what counts as a revision, round limits, out-of-scope
├── new-business/
│   ├── prospect-tracker.md                              # Pipeline of prospects: company, contact, stage, last-touch, next-action
│   ├── case-studies/
│   │   ├── nova-brand-identity.md                       # Structured case study: challenge, approach, outcome, testimonial
│   │   └── meridian-app-ux.md
│   ├── capabilities-deck.md                             # Agency capabilities overview: services, process, team, selected work
│   └── rate-card.md                                     # Hourly rates, project minimums, retainer tiers, rush premiums
└── ops/
    ├── onboarding-sop.md                                # New client onboarding: intake, kickoff, Figma setup, Slack channel, Harvest
    ├── revision-policy.md                               # Internal version of revision policy (includes escalation path)
    ├── brand-guidelines-for-agency.md                   # Agency's own brand: logo, colors, typography, voice for pitches and docs
    ├── new-hire-checklist.md                            # Designer onboarding: tool access, Figma org, Slack, Harvest, file naming
    └── offboarding-sop.md                               # Client offboarding: final asset delivery, access revocation, archive
```

## Sleutelbestanden uitgelegd

| Path | Doel |
|---|---|
| `.claude/commands/new-client.md` | Slash command die `clients/_template/` kopieert naar `clients/<slug>/`, `brief.md` invult vanuit intake-antwoorden, en concept `contract.md` en `invoice-log.md` aanmaakt |
| `.claude/commands/creative-brief.md` | Neemt client slug, projecttype en intake notes als input; produceert een volledig gestructureerde creative brief afgestemd op client merkrichtlijnen en bedrijfsdoelstelling |
| `.claude/commands/handoff.md` | Genereert een Figma dev-mode handoff checklist en annotatieguide vanuit `templates/handoff-checklist.md`; link naar client `design-files-links.md` |
| `.claude/commands/revision-log.md` | Logt een nieuwe revizionde in `projects/<project>/revisions/round-N/` met clientfeedback, designernotities, rondetelling en scope-change vlag indien buitenbeleid |
| `clients/_template/` | Master scaffolding directory — kopieer deze gehele map bij onboarding van een nieuwe client om ervoor te zorgen dat elk bestand en map aanwezig is voor kickoff |
| `clients/<slug>/feedback-log.md` | Chronologisch logboek van alle clientfeedback over alle rondes; gebruikt voor revisiegeschiedenis tracking en scope-change gesprekken |
| `projects/<project>/revisions/` | Één submap per revizionde, met clientfeedback en designernotities gekoppeld aan de Figma-link voor die ronde — maakt duidelijke versiebeheer mogelijk |
| `templates/revision-policy.md` | Bron van waarheid voor wat als revisie telt, hoeveel rondes inbegrepen zijn, en wat triggers out-of-scope fee; verwezen in alle proposals en contracten |
| `ops/onboarding-sop.md` | Stap-voor-stap checklist voor live opstart van een nieuwe client: intake tot kickoff tot toolsetup tot eerste deliverable |
| `new-business/rate-card.md` | Huidige prijzen voor alle servicetiers; verwezen door `/proposal` bij berekening van projectinvestering |

## Snel scaffold

```bash
# Create workspace root
mkdir -p design-agency && cd design-agency

# Claude Code config
mkdir -p .claude/commands

# Client _template (full depth)
mkdir -p clients/_template/brand-assets/logo
mkdir -p clients/_template/brand-assets/fonts
mkdir -p clients/_template/brand-assets/photography
mkdir -p clients/_template/deliverables/exports

# Example client: nova-brand-co
mkdir -p clients/nova-brand-co/brand-assets/logo
mkdir -p clients/nova-brand-co/brand-assets/fonts
mkdir -p clients/nova-brand-co/brand-assets/photography
mkdir -p clients/nova-brand-co/deliverables/exports

# Example client: meridian-app
mkdir -p clients/meridian-app/brand-assets/logo
mkdir -p clients/meridian-app/brand-assets/fonts
mkdir -p clients/meridian-app/deliverables/exports

# Active projects
mkdir -p projects/nova-brand-identity/concepts/concept-a-modern-minimal
mkdir -p projects/nova-brand-identity/concepts/concept-b-bold-expressive
mkdir -p projects/nova-brand-identity/revisions/round-1
mkdir -p projects/nova-brand-identity/revisions/round-2
mkdir -p projects/nova-brand-identity/final

mkdir -p projects/meridian-app-ux/concepts/concept-a-card-based-nav
mkdir -p projects/meridian-app-ux/revisions/round-1
mkdir -p projects/meridian-app-ux/final

# Templates
mkdir -p templates

# New business
mkdir -p new-business/case-studies

# Operations
mkdir -p ops

# Initialize Claude config files
touch .claude/CLAUDE.md
touch .claude/settings.json

# Create _template placeholder files
touch clients/_template/brief.md
touch clients/_template/contract.md
touch clients/_template/brand-assets/brand-guidelines.md
touch clients/_template/design-files-links.md
touch clients/_template/feedback-log.md
touch clients/_template/deliverables/_handoff-checklist.md
touch clients/_template/invoice-log.md

# Create template files
touch templates/creative-brief.md
touch templates/project-proposal.md
touch templates/design-review-agenda.md
touch templates/handoff-checklist.md
touch templates/revision-policy.md

# New business files
touch new-business/prospect-tracker.md
touch new-business/capabilities-deck.md
touch new-business/rate-card.md

# Ops files
touch ops/onboarding-sop.md
touch ops/revision-policy.md
touch ops/brand-guidelines-for-agency.md
touch ops/new-hire-checklist.md
touch ops/offboarding-sop.md

# Install relevant skills
npx claudient add skill product/ux-audit
npx claudient add skill product/persona-builder
npx claudient add skill marketing/brand-guidelines
npx claudient add skill productivity/creative-brief
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/stakeholder-report

# Install slash commands
npx claudient add command new-client
npx claudient add command creative-brief
npx claudient add command design-review
npx claudient add command handoff
npx claudient add command revision-log
npx claudient add command proposal
npx claudient add command ux-audit
npx claudient add command invoice-summary

echo "Design agency workspace ready."
```

## CLAUDE.md template

```markdown
# Designbureau — Claude Instructies

## Wat dit is

Deze werkruimte beheer de volledige clientlevenscyclus van een designstudio: intake, creative briefing,
concept development, revision tracking, asynchrone review (Loom), developer handoff (Figma dev
mode), en project billing (Harvest + FreshBooks). Elke client heeft een geïsoleerde directory
onder clients/. Actieve projecten bevinden zich onder projects/. Alle documentsjablonen staan in
templates/. Ops-documentatie staat in ops/.

## Stack

- Design: Figma (main design tool, component libraries, prototypes, dev-mode handoff)
- Projectmanagement: Notion (project wikis, creative briefs, client databases, meeting notes)
- Taakbeheer: Linear (sprint issues, bug triage, design QA tasks)
- Tijdregistratie: Harvest (per-project, billable vs non-billable, budget burn alerts)
- Facturering: FreshBooks (client invoices, retainer billing, expense tracking)
- Asynchrone review: Loom (concept walkthroughs, revision explanations, handoff walkthroughs)
- Communicatie: Slack (#client-<slug> per client, #design-production, #new-business, #ops)
- Docs + assets: Google Workspace (Slides for presentations, Drive for final asset delivery)

## Directory conventies

- clients/<client-slug>/ — alle client-niveau bestanden; mix assets nooit over clientmappen heen
- clients/<client-slug>/brand-assets/ — bron van waarheid voor goedgekeurde logo's, kleuren, fonts
- clients/<client-slug>/feedback-log.md — voeg elke feedbackronde hier toe met datum en rondenummer
- clients/<client-slug>/invoice-log.md — voeg elke factuur toe met datum, bedrag, scope, status
- projects/<project-name>/ — één directory per genoemde deliverable project (niet per client)
- projects/<project>/revisions/round-N/ — één submap per revizionde
- projects/<project>/final/ — alleen ingevuld na client goedkeuring; plaats geen concepten hier
- templates/ — canonieke documentstructuren; kopieer altijd een sjabloon voor het opstellen
- new-business/ — alleen prospecttracking, proposals en case studies; geen actieve clientwerk hier

## Onboarding van een nieuwe client

1. Kopieer clients/_template/ naar clients/<new-client-slug>/:
   cp -r clients/_template clients/<new-client-slug>
2. Voer /new-client client="<Name>" slug="<slug>" project-type="<branding|ux|digital>" uit
3. Vul clients/<slug>/brief.md in vanuit de intake call voor de kickoff meeting
4. Na kickoff, vul clients/<slug>/brand-assets/brand-guidelines.md in
5. Concept contract met templates/project-proposal.md scope section; sla op naar clients/<slug>/contract.md
6. Voeg client Figma file links toe aan clients/<slug>/design-files-links.md onmiddellijk bij projectaanmaak
7. Maak Harvest project aan en log project ID in clients/<slug>/brief.md
8. Open FreshBooks client record en link naar clients/<slug>/invoice-log.md

## Een nieuw project starten

1. Maak projects/<project-name>/ van nul of kopieer een bestaande projectstructuur
2. Voer /creative-brief client="<slug>" project="<project-name>" type="<branding|ux|digital>" uit
3. Vul projects/<project-name>/moodboard.md in met Figma frame links en reference URLs
4. Bouw concepts onder projects/<project-name>/concepts/concept-<letter>-<short-label>/
5. Elke concept directory heeft nodig: notes.md (rationale + talking points) en figma-link.md

## Design review workflow

1. Voer /design-review project="<project-name>" round="<N>" concepts="<list>" uit
2. Gebruik gegenereerde agenda van templates/design-review-agenda.md voor Loom walkthrough
3. Neem Loom video op en deel link in Slack #client-<slug>
4. Na oproep of asynchrone review, voeg feedback woordelijk toe aan clients/<slug>/feedback-log.md
5. Voer /revision-log project="<project-name>" round="<N>" uit om de revision directory te openen

## Reviziebeheer

- Elke ronde krijgt zijn eigen directory: projects/<project>/revisions/round-N/
- Log clientfeedback in round-N/client-feedback.md voordat je wijzigingen aanbrengt
- Na revisies, documenteer wat veranderd is in round-N/revision-notes.md
- Controleer templates/revision-policy.md (en ops/revision-policy.md) voor ronde 3+
- Out-of-policy verzoeken: bespreek scope voor loggen; concept amendment indien nodig

## Handoff workflow

1. Voer /handoff project="<project-name>" client="<slug>" uit om de handoff checklist te genereren
2. Vul elk item in deliverables/_handoff-checklist.md in voor het markeren van levering als voltooid
3. Figma handoff: activeer dev mode op alle finale frames, benoem alle layers, voeg redline annotaties toe
4. Exporteer finale assets naar clients/<slug>/deliverables/exports/ (PNG 1x/2x, SVG, PDF)
5. Neem een Loom walkthrough van het Figma bestand op voor de ontvangende developer of client
6. Deel Google Drive folderlink voor assets; bevestig toegang voor sluiting project

## Factureringsconventies

- Log tijd in Harvest onmiddellijk na elke werkzitting — batch nooit aan het einde van week
- Billable codes: discovery, strategy, design-production, revisions, handoff, account-management
- Non-billable: internal critique, tooling setup, admin, pitch work (tenzij proposal gewonnen)
- Voer /invoice-summary client="<slug>" month="<YYYY-MM>" uit voor generatie FreshBooks factuur
- Factureer op project milestone completion of op 1e van maand voor retainer clients
- Voeg elke verzonden factuur toe aan clients/<slug>/invoice-log.md met datum, bedrag en status

## Figma file naamconventies

- Main file: [Client Name] — [Project Name] — Design
- Component library: [Client Name] — Component Library
- Prototype: [Client Name] — [Project Name] — Prototype
- Archived file: [Client Name] — [Project Name] — ARCHIVED YYYY-MM
- Registreer altijd alle file links in clients/<slug>/design-files-links.md bij aanmaak
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/design-agency"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_TOKEN": "${NOTION_API_TOKEN}"
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
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google-labs/google-drive-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */projects/*/revisions/*/client-feedback.md ]]; then echo \"[hook] Revision feedback logged: $FILE — run /revision-log to open designer notes and update feedback-log.md\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */projects/*/final/approved-concept.md ]]; then echo \"[hook] Concept approved: $FILE — run /handoff to generate the developer handoff checklist\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find clients/ -mindepth 1 -maxdepth 1 -type d ! -name _template | while read C; do [ ! -f \"$C/design-files-links.md\" ] || grep -q \"figma.com\" \"$C/design-files-links.md\" 2>/dev/null || echo \"$C\"; done | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[reminder] $MISSING client(s) missing Figma links in design-files-links.md\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
npx claudient add skill product/ux-audit
npx claudient add skill product/persona-builder
npx claudient add skill marketing/brand-guidelines
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
```

## Gerelateerde

- [Guide: Claude for UX Designers](../guides/for-ux-designer.md)
- [Workflow: Client Project Kickoff to Handoff](../workflows/design-project-lifecycle.md)
- [Workflow: Design Review and Revision Cycle](../workflows/design-review-cycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
