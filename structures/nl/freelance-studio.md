# Freelance Studio / Consultancy — Projectstructuur

> Voor een eenmanszaak of klein bureau dat clientprojecten, bedrijfsontwikkeling en operaties beheert via Notion, HoneyBook, Cal.com, Loom, Figma, Stripe, Gmail en Slack.

## Stack

- **Notion** — Projectmanagement, CRM, client kennisbank, deliverable tracking, interne wiki
- **FreshBooks** of **HoneyBook** — Facturering, contracten, betalingsverzameling, uitgavenbijhouden, retainer-facturering
- **Cal.com** — Client planning, discovery call boeken, intake formulier routing, bufferbeheer
- **Loom** — Asynchrone client update opnames, deliverable walkthroughs, feedback request video's
- **Figma** — UI/UX deliverables, wireframes, component libraries, design handoffs
- **Framer** — Interactieve prototypes, no-code site deliverables, klantgereed previews
- **Stripe** — Betalingsverwerking, terugkerende retainer-betalingen, eenmalige projectkosten, payout tracking
- **Gmail** — Clientcommunicatie, contractlevering, factuuraanmaningen, nieuwe zakelijke prospectie
- **Slack** — Actieve projectkanalen per client, asynchrone Q&A, bestandsdeling, Loom linkdropping
- **Claude Code** — Proposal drafting, SOW generatie, statusrapporten, factuuraanmaningen, outreach sequences

## Directoryboom

```
freelance-studio/
├── .claude/
│   ├── CLAUDE.md                                    # Workspace instructies (plak de sjabloon hieronder)
│   ├── settings.json                                # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-client-onboard.md                    # /new-client-onboard — complete onboarding checklist + welcome email + kickoff agenda
│       ├── proposal-draft.md                        # /proposal-draft — proposal van brief: probleem, aanpak, deliverables, prijsopties
│       ├── scope-of-work.md                         # /scope-of-work — gestructureerde SOW met milestones, acceptatiecriteria, betaaltriggers
│       ├── invoice-chase.md                         # /invoice-chase — getrapte vervolgmail (vriendelijk / beslist / finaal) voor achterstallige facturen
│       ├── client-status-update.md                  # /client-status-update — wekelijkse of milestone update voor email of Loom script
│       ├── feedback-request.md                      # /feedback-request — gestructureerde feedbackaanvraag na milestone delivery
│       ├── project-closeout.md                      # /project-closeout — offboarding checklist, final invoice prompt, testimonial ask
│       └── weekly-wrap.md                           # /weekly-wrap — persoonlijke eind-van-week review: inkomsten, pipeline, volgende week plan
├── clients/
│   ├── _template/                                   # Kopieer deze hele map wanneer een nieuwe client wordt getekend
│   │   ├── brief.md                                 # Initiële clientbrief: doelstellingen, timeline, budget, sleutelcontacten, succescriteria
│   │   ├── contract.md                              # Contractsamenvatting: sleutelbepalingen, betalingsschema, IP-eigendom, opzeggingsclausule
│   │   ├── sow.md                                   # Scope of work: deliverables, milestones, acceptatiecriteria, exclusies
│   │   ├── communication-log.md                     # Opmerkelijke e-mails, oproepen, beslissingen — log de inhoud, niet de beleefdheden
│   │   ├── invoices/
│   │   │   └── .gitkeep
│   │   └── deliverables/
│   │       └── .gitkeep
│   ├── acme-corp-brand-2026/                        # Actieve client: Acme Corp brand identity project
│   │   ├── brief.md
│   │   ├── contract.md                              # HoneyBook contract ID: HB-2026-0041
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-04-01.md        # Factuurrecord: nummer, bedrag, verzonden datum, betaald datum, Stripe charge ID
│   │   │   ├── inv-002-milestone-1-2026-05-01.md
│   │   │   └── inv-003-final-2026-06-15.md
│   │   └── deliverables/
│   │       ├── 2026-04-20-moodboard-v1.fig          # Figma bestandskoppeling of geëxporteerde PDF
│   │       ├── 2026-05-05-brand-guidelines-v1.pdf
│   │       ├── 2026-05-18-brand-guidelines-v2-revised.pdf
│   │       └── 2026-06-10-final-handoff-package.zip
│   ├── betaworks-site-redesign/                     # Actieve client: Betaworks Framer site rebuild
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
│   ├── gamma-dao-strategy/                          # Gesloten client — gearchiveerd ter referentie en als case study
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-01-15.md
│   │   │   └── inv-002-completion-2026-03-01.md
│   │   └── deliverables/
│   │       └── 2026-03-01-strategy-deck-final.pdf
│   └── delta-fintech-ux/                            # In wacht — wacht op clientbudgetgoedkeuring
│       ├── brief.md
│       └── communication-log.md
├── pipeline/
│   ├── prospects.md                                 # Bedrijf, contactpersoon, bron, ICP fit score, laatste contact, volgende actie, geschatte waarde
│   ├── proposals-sent.md                            # Proposaltracker: client, verzonden datum, waarde, status, vervolgdatum, uitkomst
│   └── follow-up-schedule.md                       # Wekelijks vervolgwachtrij: wie te contacteren, waarom, wat te zeggen, kanaal (e-mail / Slack / LinkedIn)
├── templates/
│   ├── proposal-template.md                         # Volledige proposal: executive summary, probleem, aanpak, deliverables, timeline, prijsstrategie, volgende stappen
│   ├── sow-template.md                              # SOW: scope, buiten scope, milestones met datums, acceptatiecriteria, betalingsschema, herzienigingsbeleid
│   ├── contract-template.md                         # MSA: IP-toewijzing, vertrouwelijkheid, betalingstermijnen, kill fee, opzegging, geldend recht
│   ├── invoice-template.md                          # Factuurindeling: regelposten, betalingstermijnen (Net 7/14/30), bankgegevens, Stripe betalingskoppeling
│   ├── nda-template.md                              # Wederzijdse NDA voor pre-proposal discovery discussies
│   ├── status-update-template.md                    # Wekelijkse update: gedaan deze periode, in uitvoering, blockers, behoeften van client, volgende periode plan
│   ├── project-brief-template.md                    # Discovery formulier om prospects voor scoping te sturen: doelstellingen, budget, timeline, belanghebbenden
│   └── feedback-request-template.md                 # Post-milestone feedback: specifieke vragen over deliverable kwaliteit, alignment, benodigde revisies
├── ops/
│   ├── rate-card.md                                 # Huistarieven: uurtarief, dagtarief, project minimums, retainer tiers — laatst beoordeeld: 2026-Q2
│   ├── service-packages.md                          # Gemonetiseerde pakketten: Brand Sprint, Site in a Week, UX Audit — scope, prijs, timeline, inclusies
│   ├── onboarding-checklist.md                      # Stappen van ondertekend contract tot kickoff: toegang, tools, Slack channel, kickoff call, ontvangen assets
│   ├── offboarding-checklist.md                     # Stappen bij projectafsluiting: finaallevering, factuur, testimonial ask, portfolio rechten, archive map
│   ├── tools-and-access.md                          # Elk SaaS tool: plantarief, maandelijkse kosten, verlengingsdatum, aanmeldingsmethode
│   └── subcontractors.md                            # Vertrouwde onderaannemers: naam, specialiteit, tarief, beschikbaarheid, NDA status, eerdere gezamenlijke projecten
├── finance/
│   ├── income-log.md                                # Maandelijks: client, factuurnummer, gefactureerd bedrag, ontvangen bedrag, uitstaand, methode
│   ├── expense-log.md                               # Datum, leverancier, categorie (software / reizen / apparatuur), bedrag — voor belastingaftrektracking
│   └── quarterly-tax-estimate.md                    # Q1–Q4 geschatte belastingberekening: bruto inkomsten, aftrekbare uitgaven, SE belasting, betaaldatums, betaalde bedragen
└── marketing/
    ├── case-studies/
    │   ├── acme-corp-brand-identity.md              # Probleem, aanpak, resultaat, metrics, client quote — bron voor website en proposals
    │   ├── betaworks-site-redesign.md
    │   └── _case-study-template.md                  # Herbruikbaar format: context, challenge, solution, outcome, testimonial
    ├── portfolio/
    │   ├── portfolio-index.md                        # Gekureerde projectlijst: client (geanonimiseerd indien NDA), deliverable type, Figma/Framer link, datum
    │   └── selected-works/
    │       ├── brand-acme-2026.pdf                  # Geëxporteerde deliverable voor portfolio PDF
    │       └── site-betaworks-2026.pdf
    └── testimonials/
        ├── testimonials-log.md                      # Clientnaam, citaat, datum, toestemming voor publicatie, gepubliceerd naar (website / LinkedIn / proposal)
        └── raw-feedback/
            ├── acme-corp-feedback-2026-06.md        # Raw feedback e-mail of formulierantwoord — bronmateriaal voor testimonials
            └── gamma-dao-feedback-2026-03.md
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/new-client-onboard.md` | Slash command die een volledige onboarding checklist genereert, de welcome e-mail ontwerpt en een kickoff call agenda bouwt van de ondertekende client brief — direct na HoneyBook contract uitvoering uitvoeren |
| `.claude/commands/invoice-chase.md` | Slash command die een getrapte vervolgsequentie produceert (vriendelijke herinnering op dag 3, beslist verzoek op dag 7, finaal bericht met late fee op dag 14) — neemt factuurnummer, bedrag en achterstallige dagen |
| `.claude/commands/project-closeout.md` | Slash command die de offboarding checklist produceert, de finale factuur ontwerpt en een testimonial request e-mail schrijft — voer uit wanneer de laatste deliverable is goedgekeurd |
| `clients/_template/` | Lege mapstructuur gekopieerd voor elk nieuw engagement — forceert consistente documentatie op al het client werk; kopieer met `cp -r clients/_template clients/<new-client-name>` |
| `templates/sow-template.md` | Master SOW format inclusief herzienigingsbeleid, kill fee clausule en expliciete buiten-scope lijst — de bron van waarheid voor alle projectscope gesprekken |
| `pipeline/prospects.md` | CRM vervanging voor early-stage leads: bedrijf, contactpersoon, ICP fit score (1–5), geschatte deal waarde, laatste contact datum, volgende actie — beoordeeld elke maandag |
| `ops/rate-card.md` | Huistarieven met een laatst beoordeelde datum — controleert welke nummers in alle Claude-ontworpen proposals verschijnen; moet worden bijgewerkt voordat `/proposal-draft` wordt uitgevoerd |
| `finance/quarterly-tax-estimate.md` | SE belastingberekening bijgewerkt aan einde van elk kwartaal: bruto inkomsten, aftrekbare SaaS en apparatuur uitgaven, geschatte federale + staats betaling verschuldigd, bevestiging van verzonden betaling |

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

## CLAUDE.md sjabloon

```markdown
# Freelance Studio — Claude Code Instructies

## Wat dit is

Werkruimte voor een eenmanszaak freelance studio die client design en strategy engagements, bedrijfsontwikkeling pipeline, facturering en operaties beheert. Client werk bevindt zich in clients/ (één map per engagement), open prospects en proposals in pipeline/, herbruikbare documenten in templates/, financiële records in finance/ en portfolio en case study assets in marketing/. Alle drafting, SOW generatie, factuur vervolgstappen, statusrapportage en outreach lopen via slash commands in .claude/commands/.

## Stack

- Notion — Project tracking per client; plak de Notion pagina URL in clients/<name>/brief.md
- HoneyBook — Contracten en facturering; log HoneyBook contract ID's in clients/<name>/contract.md
- FreshBooks — Uitgavenbijhouden en belastingverzoening; kruisverwijzing met finance/income-log.md
- Cal.com — Planning; voeg booking link in in templates/proposal-template.md en welcome e-mails
- Loom — Asynchrone deliverable walkthroughs; plak Loom URL's in client-status-update en SOW handoffs
- Figma — Design deliverables; deel view-only links in clients/<name>/deliverables/ bestanden
- Framer — Prototype en no-code site deliverables; log staging URL's in clients/<name>/deliverables/
- Stripe — Betalingsverwerking; log Stripe charge ID's in clients/<name>/invoices/ records
- Gmail — Primaire client comms; log beslissingen en overeenkomsten in clients/<name>/communication-log.md
- Slack — Actieve projectkanalen; elke ondertekende client krijgt een dedicated channel

## Nieuwe client onboarding flow

Voer onmiddellijk uit nadat HoneyBook contract is ondertekend en aanbetaling is ontvangen:

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

Dit produceert: welcome e-mail, kickoff call agenda, access-request checklist en de ops/onboarding-checklist.md items om af te vinken voor dag één.

## Project delivery workflow

1. Maak clients/<name>/ door clients/_template/ te kopiëren voor de kickoff call
2. Vul brief.md uit van de discovery call aantekeningen; plak de Notion project URL aan de bovenkant
3. Voer /scope-of-work uit om sow.md te genereren — controleer voor verzending naar client
4. Deliverables gaan in clients/<name>/deliverables/ met datum-prefix bestandsnamen (YYYY-MM-DD-name.ext)
5. Na elke milestone, voer /client-status-update uit en log de Loom URL in communication-log.md
6. Voer /feedback-request uit na elke milestone delivery — log antwoorden in communication-log.md

## Invoice en betalingsproces

- Alle factuurrecords gaan in clients/<name>/invoices/ als inv-NNN-description-YYYY-MM-DD.md
- Elk record moet bevatten: HoneyBook of FreshBooks factuurnummer, bedrag, verzonden datum, vervaldatum, Stripe charge ID (na betaling), en betaalde datum (of "outstanding")
- Voer /invoice-chase uit als betaling niet binnen 3 dagen na de vervaldatum wordt ontvangen
- Log alle verzamelde inkomsten in finance/income-log.md op dezelfde dag als betaling Stripe clears
- Update finance/quarterly-tax-estimate.md aan einde van elk kwartaal

## Tijdbijhouden en facturering

- Prijskaart bevindt zich in ops/rate-card.md — controleer driemaandelijks en werk de laatst beoordeelde datum bij
- Uurtarief werk: log tijd in clients/<name>/communication-log.md als een lopende tabel (datum, taak, uren)
- Project werk: factureer tegen milestones gedefinieerd in clients/<name>/sow.md — nooit factureer voorbij delivery
- Retainer clients: geef de retainer factuur uit op de 1e van elke maand via HoneyBook
- Kill fee: 25% van de resterende projectwaarde als client annuleert na kickoff — vermeld in contract-template.md

## Gemeenschappelijke taken en exacte commands

### Draft een proposal van een client brief
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

### Genereer een SOW van een ondertekende proposal
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

### Schrijf een factuuraanmaning
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

### Stuur een client statusupdate
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

### Sluit een project af
```
/project-closeout

Client: [company name]
Final deliverable: [name and delivery date]
Outstanding invoices: [invoice numbers and amounts]
Portfolio rights: [confirmed in contract? yes/no]
Testimonial: [has client agreed to provide one? yes/no/ask]
```

## Conventies

- Elke nieuwe client krijgt een map onder clients/ voor de kickoff call — altijd _template/ kopiëren
- Deliverable bestandsnamen: YYYY-MM-DD-description-vN.ext (bijv. 2026-06-01-wireframes-v2.fig)
- proposals-sent.md in pipeline/ wordt bijgewerkt dezelfde dag dat een proposal wordt e-maild
- Verplaats gewonnen proposals: maak clients/<name>/ aan en archiveer het proposal bestand daar
- finance/income-log.md wordt bijgewerkt de laatste werkdag van elke maand — geen uitzonderingen
- finance/expense-log.md wordt wekelijks bijgewerkt — log alles boven $15 voor belastingdoeleinden
- ops/rate-card.md toont altijd een laatst beoordeelde datum — werk het bij voor het gebruik van /proposal-draft
- marketing/testimonials/testimonials-log.md wordt bijgewerkt binnen één week na ontvangst van enige feedback
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

## Skills om te installeren

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

## Gerelateerd

- [Freelancer guide](../guides/for-freelancer.md)
- [Client onboarding workflow](../workflows/client-onboarding.md)
- [Proposal-to-contract workflow](../workflows/proposal-to-contract.md)
- [Invoice and billing workflow](../workflows/invoice-and-billing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
