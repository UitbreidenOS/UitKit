# Zelfstandige Consultantruimte — Projectstructuur

> Voor een solo zelfstandige of onafhankelijke consultant die clientverzending, voorstelenpijplijn en zakelijk beheer vanuit één werkruimte uitvoert — met Notion, FreshBooks, Cal.com, Loom, DocuSign en Stripe als de operationele stack.

## Stack

- **Notion** — Projectmanagement, kennisbank client, tracering deliverables, interne wiki
- **FreshBooks** of **Wave** — Facturering, uitgavenbijhouden, belastingschattingen, betalingsafstemming
- **Cal.com** of **Calendly** — Clientplanning, boeken van ontdekkingsgesprekken, bufferbeheering
- **Loom** — Asynchrone clientupdates, rondleiding opnamen, deliverable handoffs
- **DocuSign** — Contractuitvoering, SOW-goedkeuring, NDA-routering, envelop-tracking
- **Stripe** — Betalingsverwerking, terugkerende retainer-facturering, uitbetalingstracking
- **Gmail** — Clientcommunicatie, contractverzending, factuurbetaalherkenningstaken, nieuwe verkoop uitreiken
- **Claude Code** — Voorstelconcepten, SOW-generatie, factuurbetaal-e-mails, statusrapporten, bereiksequenties

## Mappenstructuur

```
freelancer-workspace/
├── .claude/
│   ├── CLAUDE.md                            # Werkruimteinstructies (plak de sjabloon hieronder)
│   ├── settings.json                        # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── proposal-draft.md                # /proposal-draft — volledig voorstel van clientbriefing
│       ├── scope-of-work.md                 # /scope-of-work — SOW met deliverables, tijdlijn, betaling
│       ├── invoice-chase.md                 # /invoice-chase — vervolgmail reeks voor vervallen facturen
│       ├── status-report.md                 # /status-report — wekelijks of mijlpaal client-update
│       ├── client-onboard.md                # /client-onboard — onboardingchecklist + welkomcomms
│       ├── new-business.md                  # /new-business — koude werving of warm vervolgsequence
│       └── weekly-wrap.md                   # /weekly-wrap — persoonlijk eindweekse review + volgende weekplan
├── clients/
│   ├── _template/                           # Kopieer deze map wanneer een nieuwe client wordt ondertekend
│   │   ├── brief.md                         # Initiële client briefing — doelen, tijdlijn, budget, contacten
│   │   ├── contract.md                      # Contractsamenvatting — sleutelvoorwaarden, betalingsschema, beëindiging
│   │   ├── sow.md                           # Werkingsgebied — deliverables, mijlpalen, acceptatiecriteria
│   │   ├── onboarding-checklist.md          # Toegang verleend, tools ingesteld, kickoff gedaan, activa ontvangen
│   │   ├── status-log.md                    # Lopend logboek van wekelijkse/mijlpaal statusrapporten verzonden
│   │   ├── comms-log.md                     # E-maildraden, gesprekken, beslissingen — alleen noemenswaardige uitwisselingen
│   │   ├── deliverables/                    # Alle werkproducten aan deze client
│   │   │   └── .gitkeep
│   │   └── invoices/                        # Factuurrecords voor deze client
│   │       └── .gitkeep
│   ├── acme-redesign/                       # Actieve client: Acme Corp website redesign
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
│   │       ├── inv-001-deposit.md           # Factuurrecord: nummer, bedrag, verzonden, betaald
│   │       ├── inv-002-milestone-1.md
│   │       └── inv-003-final.md
│   ├── beta-corp-strategy/                  # Actieve client: Beta Corp fractionele strategie-engagement
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
│   └── gamma-startup/                       # Gesloten client — archief ter referentie
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
│   ├── active/                              # Verzonden voorstelendenwacht op ondertekening of afwijzing
│   │   ├── 2026-05-28-delta-inc-brand-refresh.md
│   │   └── 2026-06-01-epsilon-co-growth-strategy.md
│   ├── won/                                 # Ondertekende voorstelendeverplaats hier wanneer contract is uitgevoerd
│   │   ├── 2026-04-01-acme-redesign.md
│   │   └── 2026-03-10-beta-corp-strategy.md
│   └── lost/                               # Afgewezen of geen-antwoord voorstelendenhoud voor patroonanalyse
│       ├── 2026-02-14-zeta-app-proposal.md
│       └── 2026-01-20-eta-audit-proposal.md
├── templates/
│   ├── proposal-template.md                 # Herbruikbaar voorstelendeproblemstelling, benadering, deliverables, prijzen
│   ├── sow-template.md                      # SOW: bereik, tijdlijn, mijlpalen, betalingsschema, uitzonderingen
│   ├── contract-template.md                 # Master Service Agreement: IP, vertrouwelijkheid, betaling, beëindiging
│   ├── invoice-template.md                  # Factuurindeling: regelitems, betalingsvoorwaarden, bank/Stripe details
│   ├── nda-template.md                      # Wederzijdse NDA voor voorbesprekingen
│   ├── onboarding-welcome-email.md          # Eerste e-mail aan nieuwe client na contractondertekening
│   └── status-report-template.md           # Wekelijks status: deze week gedaan, volgende week, blokkeerders, benodigde beslissingen
├── business-dev/
│   ├── prospect-list.md                     # Bedrijfsnaam, contact, bron, status, laatste aanraking, volgende actie
│   ├── outreach-log.md                      # Datum, prospect, berichttype, antwoord, vervolgdatum
│   ├── referral-partners.md                 # Mensen die werk doorverwijzen — relatienotities, laatste dank verzonden
│   └── positioning-notes.md                 # ICP-definitie, niche, belangrijkste differentiators, bewijs punten
├── finance/
│   ├── income-tracker.md                    # Maandelijks: gefactureerd, ingekopt, openstaand — per client
│   ├── expense-log.md                       # Datum, leverancier, categorie, bedrag — voor belastingaftrek volgen
│   ├── tax-estimate.md                      # Driemaandelijkse geschatte belastingberekening en betalingslogboek
│   ├── rate-card.md                         # Huidigetarieven: uurlijks, project, retainer — met laatst gewijzigde datum
│   └── cash-flow-forecast.md               # 90-daagse vooruitkijk: verwachte inflows, bekende uitgaven, buffer
└── ops/
    ├── onboarding-sop.md                    # Stap-voor-stap-proces om een nieuwe client in te voeren van ondertekend tot kickoff
    ├── tools-and-access.md                  # Alle gebruikte tools, login, plantarief, maandelijks kostenaantekeningvernieuwingsdatum
    ├── subcontractors.md                    # Vertrouwde subcon's: naam, specialiteit, tarief, beschikbaarheid, vroeger werk
    └── working-hours-policy.md             # Antwoorddatum SLA's, out-of-office beleid, noodgevallen contactregels
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/proposal-draft.md` | Slashcommando dat een clientbriefing inneemt en een volledige voorstel produceert — probleemstelling, voorgestelde benadering, deliverables lijst, tijdlijn en prijsopties |
| `.claude/commands/scope-of-work.md` | Slashcommando dat een akkoord voorstel converteert naar een juridisch gestructureerde SOW met mijlpalen, acceptatiecriteria, betalingstriggers en expliciete uitzonderingen |
| `.claude/commands/invoice-chase.md` | Slashcommando dat een gelaagde vervolgmail reeks genereert (vriendelijke herinnering, stevige aanvraag, escalatie) voor vervallen facturen — neemt factuurnummer, bedrag en dagen achterstallig |
| `.claude/commands/status-report.md` | Slashcommando dat een beknopt client statusrapport produceert uit een lijst van voltooide taken, blokkeerders en volgende stappen — format voor e-mail of Notion |
| `.claude/commands/client-onboard.md` | Slashcommando dat een onboardingchecklist genereert en de welkommail, kickoff agenda en toegangsaanvraaglijst voor een nieuw ondertekende client concepten |
| `clients/_template/` | Blanco mappenstructuur om te kopiëren wanneer een nieuwe client-engagement begint — dwingt consistente documentatie af voor al het clientwerk |
| `finance/income-tracker.md` | Maandelijks ledger van gefactureerde vs. ingekocht per client — de enige waarheid bron voor inkomsten en openstaande AR |
| `ops/onboarding-sop.md` | Stap-voor-stap herhaalbaar proces van ondertekend contract tot kickoff gesprek — zorgt ervoor dat geen toegang, referentie of communicatiestap wordt gemist |

## Snelle stelling

```bash
# Maak de werkruimtewortel aan
mkdir -p freelancer-workspace

# Maak .claude structuur aan
mkdir -p freelancer-workspace/.claude/commands

# Maak client sjabloon aan
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

# Maak actieve client-directories aan
mkdir -p freelancer-workspace/clients/acme-redesign/deliverables
mkdir -p freelancer-workspace/clients/acme-redesign/invoices
mkdir -p freelancer-workspace/clients/beta-corp-strategy/deliverables
mkdir -p freelancer-workspace/clients/beta-corp-strategy/invoices

# Maak voorstel directories aan
mkdir -p freelancer-workspace/proposals/active
mkdir -p freelancer-workspace/proposals/won
mkdir -p freelancer-workspace/proposals/lost

# Maak sjablonen directory aan
mkdir -p freelancer-workspace/templates

# Maak business-dev, finance en ops directories aan
mkdir -p freelancer-workspace/business-dev
mkdir -p freelancer-workspace/finance
mkdir -p freelancer-workspace/ops

# Zaai sleutelbestanden
touch freelancer-workspace/finance/income-tracker.md
touch freelancer-workspace/finance/expense-log.md
touch freelancer-workspace/finance/tax-estimate.md
touch freelancer-workspace/finance/rate-card.md
touch freelancer-workspace/finance/cash-flow-forecast.md
touch freelancer-workspace/business-dev/prospect-list.md
touch freelancer-workspace/business-dev/outreach-log.md
touch freelancer-workspace/ops/onboarding-sop.md
touch freelancer-workspace/ops/tools-and-access.md

# Installeer zelfstandige/klein bedrijf skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Kopieer commando stubs in .claude/commands/
npx claudient add skill small-business/freelancer-proposal --output freelancer-workspace/.claude/commands/proposal-draft.md
npx claudient add skill small-business/scope-of-work --output freelancer-workspace/.claude/commands/scope-of-work.md
npx claudient add skill small-business/invoice-chaser --output freelancer-workspace/.claude/commands/invoice-chase.md
npx claudient add skill small-business/client-status-report --output freelancer-workspace/.claude/commands/status-report.md
npx claudient add skill small-business/cold-outreach --output freelancer-workspace/.claude/commands/new-business.md
```

## CLAUDE.md sjabloon

```markdown
# Zelfstandige Consultantruimte — Claude Code Instructies

## Wat dit is

Dit is de werkdirectory voor een freelance consultant die clientengagements, voorstelenen,
facturering en zakelijke ontwikkeling beheert. Clientwerk leeft in clients/, openstaande voorstelenen in proposals/active/,
herbruikbare documenten in templates/, en financiële verslagen in finance/. Alle voorstelconcepten, SOW-
generatie, factuurbetaal vervolgingen, statusrapportage en bereik werken via Claude Code slashcommando's.

## Stack

- Notion — Projectvolgen per client; link Notion pagina URL in clients/<name>/brief.md
- FreshBooks / Wave — Facturering en boekhouding; log factuurnummers en betalingsdatums in clients/<name>/invoices/
- Cal.com / Calendly — Planning; plak boekingslink in onboarding-welcome-email.md en voorstelenen
- Loom — Async updates; sluit Loom URL's in statusrapporten verzonden naar clients
- DocuSign — Contract- en SOW-ondertekening; log enveloppe-ID's in clients/<name>/contract.md
- Stripe — Betalingsverwerking; log Stripe betalings-ID's in clients/<name>/invoices/ bestanden
- Gmail — Alle client comms; noemenswaardige beslissingen en overeenkomsten gelogd in clients/<name>/comms-log.md

## Gemeenschappelijke taken en exacte commando's

### Conceptualiseer een voorstel uit een client briefing
```
/proposal-draft

Client: [bedrijfsnaam]
Contact: [naam, titel, e-mail]
Brief: [plak de brief of beschrijf het verzoek in detail]
Budgetbereik: [$X–$Y of "TBD"]
Tijdlijn: [doelstartdatum en duur]
Mijn hoek: [wat ik meebren dat anders is dan een generalist]
```

### Genereer een werkingsgebied van een ondertekend voorstel
```
/scope-of-work

Client: [bedrijfsnaam]
Project: [projectnaam]
Overeengekomen deliverables: [list precies wat werd overeengekomen]
Tijdlijn: [startdatum, mijlpaal datums, einddatum]
Betalingsschema: [aanbetaling %, mijlpaal %, voltooiing %]
Uitzonderingen: [alles expliciet buiten bereik]
```

### Schrijf een factuurbetaal vervolgeing
```
/invoice-chase

Client: [bedrijfsnaam]
Factuurnummer: [INV-XXX]
Bedrag: [$X]
Vervaldatum: [datum]
Dagen achterstallig: [N]
Vorige contact: [heb ik eerder vervolgd? wanneer?]
Toon: [vriendelijk / stevig / definitief bericht]
```

### Verzend een client statusrapport
```
/status-report

Client: [bedrijfsnaam]
Periode: [week van / mijlpaal: X]
Dit periode voltooid: [bullet list]
In uitvoering: [wat is bezig]
Blokkeerders: [alles wat ik van hen nodig heb]
Volgende periode plan: [wat komt daarna]
Format: [e-mail / Notion update / Loom script]
```

### Borduurtussen een nieuwe client
```
/client-onboard

Client: [bedrijfsnaam]
Contact: [naam, titel]
Project: [projectnaam]
Startdatum: [datum]
Tools om toegang te verlenen: [Notion, Slack, Figma, Drive — list wat van toepassing]
Eerste deliverable vervaldatum: [datum en wat het is]
```

### Schrijf bereik voor een nieuwe prospect
```
/new-business

Prospect: [bedrijfsnaam en beschrijving]
Contact: [naam, titel]
Bron: [hoe ik ze ken of gevonden heb]
Hoek: [waarom ik nu bereik — trigger event, referral, inhoud]
Vraag: [ontdekkingsgesprek, antwoord, intro — houd het één ding]
Toon: [warm / koud / vervolgeing op vorige aanraking]
```

### Voer een wekelijkse wrap uit
```
/weekly-wrap

Week van: [datum]
Clientwerk gedaan: [list per client]
Voorstelenen verzonden: [list]
Facturen verzonden / ingekocht: [list]
Business dev acties: [bereik verzonden, bellen genoemen]
Volgende week prioriteiten: [top 3]
Blokkeerders of zorgen: [alles wat op je rust]
```

## Conventies om te volgen

- Elke nieuwe client moet een map onder clients/ hebben aangemaakt voor de kickoff call — kopieer _template/
- SOW-bestanden in clients/<name>/sow.md zijn de contract waarheid bron — beschrijf bereik nooit uit geheugen
- Factuurrecords in clients/<name>/invoices/ moeten bevatten: factuurnummer, bedrag, verzonden datum, betaald datum (of "openstaand")
- Voorstelenen gaan naar proposals/active/ wanneer verzonden — verplaats naar won/ of lost/ binnen 48 uur van uitkomst
- Alle bereik pogingen worden gelogd in business-dev/outreach-log.md op dezelfde dag dat ze worden verzonden
- finance/income-tracker.md wordt bijgewerkt op de laatste vrijdag van elke maand — geen uitzonderingen
- finance/expense-log.md wordt wekelijks bijgewerkt — alles over $20 loggen voor belastingdoeleinden
- Tarifkaart in finance/rate-card.md toont altijd de laatst gewijzigde datum — driemaandelijks beoordelen
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"proposals/active/\"; then echo \"[hook] Voorstel opgeslagen in active/ — log het in business-dev/outreach-log.md met de verzonden datum en prospect contact\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"clients/.*/sow.md\"; then echo \"[hook] SOW schrijven — bevestigen client map heeft brief.md en contract.md voor finaliseren bereik\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Friday\" ]; then echo \"[reminder] Vrijdag — voer /weekly-wrap uit en controleer finance/income-tracker.md op achterstallige facturen\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
# Kernzelfstandige skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Ondersteunende productiviteits skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator

# Installeer alle klein-bedrijf skills tegelijkertijd
npx claudient add skills small-business
```

## Gerelateerd

- [Zelfstandige gids](../guides/for-freelancer.md)
- [Client onboarding workflow](../workflows/client-onboarding.md)
- [Voorstel-naar-contract workflow](../workflows/proposal-to-contract.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
