# Founder / CEO Werkruimte — Projectstructuur

> Voor een oprichter van een startup die strategie, fondsenwerving, werving en dagelijkse activiteiten beheert — investeerdersupdates, board-voorbereiding, wervingsbeslissingen, OKRs, fondsenwerving pijplijn en financiële gezondheid, aangestuurd vanuit één Claude Code werkruimte.

## Stack

- Notion — strategiedocumenten, teamwiki's, OKRs, boardmateriaal
- Linear — productroadsmap, sprint tracking, engineeringsmijlpalen
- HubSpot of Attio — investeerder CRM, pijplijnfasen, relatietracking
- Gusto of Rippling — HR, salarissen, aanbiedingsbrieven, headcount records
- Mercury — bedrijfsbankieren, cashflowbeheer, uitgavenbeheer
- Carta — kapitaaltabel, equity grants, 409A waarderingen, SAFE/note tracking
- Slack — teamcommunicatie, investeerder asynchrone updates, wervingskanalen
- Google Workspace — e-mail, gedeelde documenten, dataruimte (Google Drive)

## Directorystructuur

```
founder-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Werkruimteinstructies voor Claude Code
│   ├── settings.json                          # Permissies, hooks, MCP server config
│   └── commands/
│       ├── investor-update.md                 # Concept wekelijkse of maandelijkse investeerdersupdateemail
│       ├── board-prep.md                      # Compileer board deck narratief, agenda, pre-reads
│       ├── hiring-decision.md                 # Beoordeel kandidaat, scorecard samenvatting, hire/no-hire aanbeveling
│       ├── okr-review.md                      # Geef huidige OKRs, breng blockers aan het licht, concept volgende kwartaal
│       ├── weekly-brief.md                    # CEO wekelijks briefing — wins, misses, prioriteiten, vragen
│       ├── fundraising-status.md              # Snapshot fondsenwerving pijplijn, volgende stappen, rondstatuscontrole
│       └── competitive-pulse.md               # Competitief landschapsupdate — signaalsortering, responsnotitie
├── strategy/
│   ├── north-star-metric.md                   # Primaire succesmaatstaf, definitie, huidige waarde, doel
│   ├── company-okrs-2025.md                   # Jaarlijkse OKRs — doelstellingen, sleutelresultaten, eigenaren, graderingen
│   ├── company-okrs-q3-2025.md                # Kwartaalset OKRs met halfjaarlijkse controlenotities
│   ├── annual-plan-2025.md                    # Jaarlijks operationeel plan — headcount, budget, mijlpalen per afdeling
│   ├── strategic-bets.md                      # 3–5 strategische inzetten met rationale en succescriteria
│   ├── competitive-landscape.md               # Concurrentenmatrix — positionering, prijzen, sterke punten, risico's
│   ├── market-map.md                          # TAM/SAM/SOM analyse, segmentafbreking, marktgrootte
│   └── positioning-doc.md                     # ICP, waardepropositie's, differentiatie, messagingpijlers
├── fundraising/
│   ├── round-tracker.md                       # Huidige rundestatuscontrole — doel, ingezameld, sluitingsdatum, lead
│   ├── investor-pipeline.md                   # Volledige investeerderlijst — fase, laatste contact, volgende stap, notities
│   ├── term-sheet-tracker.md                  # Ontvangen termsheets — sleutelvoorwaarden, vergelijking, beslissingslogboek
│   ├── pitch-deck-v7.md                       # Huidge pitch deck narratief (Notion export of outline)
│   ├── data-room/
│   │   ├── data-room-index.md                 # Index van alle dataruimtedocumenten met toegangslogboek
│   │   ├── cap-table-summary.md               # Carta kapitaaltabel snapshot — eigendomspercentages, verdunningsmodel
│   │   ├── financial-model-q2-2025.xlsx       # Financieel model — P&L, runway, unit economics
│   │   ├── corporate-docs-checklist.md        # Incorporatie, IP-toewijzing, 409A, audits — statuslijst
│   │   └── customer-references.md             # Referentie klanten — contact, tier, NPS, beschikbaarheid
│   └── investor-crm/
│       ├── crm-export-2025-06.csv             # HubSpot/Attio pijplijn export — meest recente snapshot
│       ├── warm-intros-needed.md              # Investeerders die warme introductie nodig hebben — wie kan dit doen
│       └── post-meeting-notes/
│           ├── a16z-partner-2025-05-14.md     # Notities na meeting — gevoel, vragen, volgende stap
│           ├── sequoia-scout-2025-05-21.md    # Notities na meeting
│           └── notable-capital-2025-06-01.md  # Notities na meeting
├── hiring/
│   ├── headcount-plan-2025.md                 # Door board goedgekeurd headcount — rol, team, kwartaal, budget
│   ├── open-roles.md                          # Actieve vacatures — JD status, recruiter, pipeline count
│   ├── job-descriptions/
│   │   ├── head-of-growth.md                  # JD — Head of Growth / VP Marketing
│   │   ├── senior-engineer-fullstack.md       # JD — Senior Full-Stack Engineer
│   │   ├── chief-of-staff.md                  # JD — Chief of Staff / Operations Lead
│   │   └── account-executive.md               # JD — Account Executive (SMB)
│   ├── scorecards/
│   │   ├── scorecard-template.md              # Canonieke interview scorecard sjabloon
│   │   ├── eng-scorecard.md                   # Scorecard — engineering rollen
│   │   ├── gtm-scorecard.md                   # Scorecard — sales en marketing rollen
│   │   └── leadership-scorecard.md            # Scorecard — directeur en VP-niveau
│   ├── offer-templates/
│   │   ├── offer-letter-template.md           # Standaard aanbiedingsbrief sjabloon
│   │   ├── equity-grant-explainer.md          # Begrijpelijke equity-uitleg voor kandidaten
│   │   └── comp-bands-2025.md                 # Compensatiebanden per functie en niveau
│   └── pipeline-notes/
│       ├── active-candidates.md               # Huige kandidaten — rol, fase, volgende stap, beslissingsdatum
│       └── offers-log.md                      # Aanbiedingsgeschiedenis — rol, compensatie, equity, accepted/declined
├── board/
│   ├── board-composition.md                   # Huige boardleden — firm, seat type, termijn, commissies
│   ├── board-calendar-2025.md                 # Vergaderschema, verwachte deelnemers, terugkerende agenda
│   ├── materials/
│   │   ├── 2025-q1-board-deck.md              # Q1 board deck narratief en sleutelmetrieken
│   │   ├── 2025-q2-board-deck.md              # Q2 board deck narratief (actueel)
│   │   └── ceo-letter-q2-2025.md              # CEO-brief aan de board — eerlijke context en vragen
│   ├── minutes/
│   │   ├── minutes-2025-03-15.md              # Board vergaderverslagen — Q1 review
│   │   └── minutes-2025-06-10.md              # Board vergaderverslagen — Q2 review
│   └── resolutions/
│       ├── resolution-option-grant-2025-05.md # Board resolution — option pool grant
│       └── resolution-financing-2025-06.md    # Board resolution — financieringsauthorisatie
├── finance/
│   ├── runway-model.md                        # Runway analyse — burn rate, maanden runway, scenario's
│   ├── cash-flow-forecast-q3-2025.md          # 13-wekelijks cashflowprognose
│   ├── unit-economics.md                      # CAC, LTV, payback periode, bruto marge per segment
│   ├── monthly-financials/
│   │   ├── p-and-l-2025-05.md                 # May P&L — actueel vs begroting
│   │   ├── p-and-l-2025-04.md                 # April P&L
│   │   └── balance-sheet-2025-05.md           # May balansoverzicht
│   ├── budget-2025.md                         # Volledige jaarlijkse begroting — opex, headcount, capex per afdeling
│   └── mercury-transactions-2025-06.csv       # Mercury bank export — huige maandtransacties
├── product/
│   ├── product-roadmap-q3-2025.md             # Kwartaalroadsmap — initiatieven, eigenaren, mijlpalen
│   ├── product-vision.md                      # 2-jaarvisioen product — waar we heen gaan en waarom
│   ├── prds/
│   │   ├── prd-template.md                    # Canonieke PRD sjabloon
│   │   ├── prd-onboarding-revamp.md           # PRD — onboarding flow redesign
│   │   └── prd-api-v2.md                      # PRD — openbare API v2
│   ├── launch-plans/
│   │   ├── launch-api-v2.md                   # Launchplan — API v2 go-to-market
│   │   └── launch-mobile-app.md               # Launchplan — mobile app beta
│   └── metrics/
│       ├── product-kpis.md                    # Kernproduct KPI's — DAU, activering, behoud, NPS
│       └── feature-adoption.md                # Feature-level adoptiegegevens en inzichten
└── comms/
    ├── investor-updates/
    │   ├── update-template.md                 # Investeerdersupdatesjabloon — wins, metrieken, vragen
    │   ├── update-2025-05.md                  # Mei investeerderupdate (verzonden)
    │   └── update-2025-06-draft.md            # Juni investeerderupdate (concept)
    ├── all-hands/
    │   ├── all-hands-template.md              # All-hands agenda en narratiefsjabloon
    │   ├── all-hands-2025-06-notes.md         # Juni all-hands notities en Q&A
    │   └── all-hands-2025-03-notes.md         # Maart all-hands notities
    └── external/
        ├── press-release-template.md          # PR sjabloon voor financieringsaankondigingen en launches
        └── founder-bio.md                     # Huige oprichtersbiografie — lange en korte versies
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/investor-update.md` | Schuine opdracht die `finance/runway-model.md`, `strategy/company-okrs-q3-2025.md` en `comms/investor-updates/update-template.md` leest voor een volledige investeerderupdate met metrieken, wins, misses en vragen |
| `.claude/commands/board-prep.md` | Schuine opdracht die `finance/monthly-financials/`, `strategy/company-okrs-*.md` en `product/product-roadmap-*.md` compileert in een board narratief en agenda |
| `.claude/commands/fundraising-status.md` | Schuine opdracht die `fundraising/investor-pipeline.md` en `fundraising/round-tracker.md` leest voor een pijplijnstatussnapshot en voorgestelde volgende acties |
| `fundraising/data-room/financial-model-q2-2025.xlsx` | Gezaghebbend financieel model — P&L, runway, unit economics en headcount plan; verwezen in board decks en due diligence |
| `strategy/company-okrs-2025.md` | Jaarlijks OKR-document met kwartaalafbreking, sleutelresultaateigenaren en graderingscriteria — bijgewerkt elk kwartaal |
| `finance/runway-model.md` | Live runway analyse met huige burn rate, kassaldo, wervingsscenario's en maanden-tot-nul bij elke burn-mate |
| `hiring/comp-bands-2025.md` | Interne compensatiebanden per functie en niveau — gebruikt voor aanbiedingssaneering en headcount budgettierung |
| `board/materials/ceo-letter-q2-2025.md` | Eerlijke CEO-brief aan de board — context achter metrieken, risico's en expliciete vragen niet in de deck |
| `fundraising/investor-pipeline.md` | Volledige investeerdertrackinglijst met fase, laatste contactdatum, relatie-eigenaar, warme intro-status en volgende actie |
| `comms/investor-updates/update-template.md` | Canonieke investeerderupdate-indeling — metriekentabel, bedrijfshoogtepunten, teamupdates, financiële gegevens en vraagensectie |

## Snelle scaffolding

```bash
# Maak de werkruimteroot
mkdir -p founder-workspace
cd founder-workspace

# Maak .claude-structuur
mkdir -p .claude/commands

# Maak alle werkruimtemappen
mkdir -p strategy
mkdir -p fundraising/data-room
mkdir -p fundraising/investor-crm/post-meeting-notes
mkdir -p hiring/job-descriptions
mkdir -p hiring/scorecards
mkdir -p hiring/offer-templates
mkdir -p hiring/pipeline-notes
mkdir -p board/materials
mkdir -p board/minutes
mkdir -p board/resolutions
mkdir -p finance/monthly-financials
mkdir -p product/prds
mkdir -p product/launch-plans
mkdir -p product/metrics
mkdir -p comms/investor-updates
mkdir -p comms/all-hands
mkdir -p comms/external

# Seed sleutelbestanden
touch strategy/north-star-metric.md
touch strategy/company-okrs-2025.md
touch strategy/competitive-landscape.md
touch fundraising/round-tracker.md
touch fundraising/investor-pipeline.md
touch fundraising/term-sheet-tracker.md
touch fundraising/data-room/data-room-index.md
touch hiring/headcount-plan-2025.md
touch hiring/open-roles.md
touch hiring/scorecards/scorecard-template.md
touch hiring/offer-templates/comp-bands-2025.md
touch hiring/pipeline-notes/active-candidates.md
touch board/board-composition.md
touch board/board-calendar-2025.md
touch finance/runway-model.md
touch finance/cash-flow-forecast-q3-2025.md
touch finance/unit-economics.md
touch finance/budget-2025.md
touch product/product-roadmap-q3-2025.md
touch product/product-vision.md
touch product/prds/prd-template.md
touch product/metrics/product-kpis.md
touch comms/investor-updates/update-template.md
touch comms/all-hands/all-hands-template.md

# Installeer Claude Code skills
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/engineering-strategy
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/hiring-pipeline

# Installeer schuine opdrachten
npx claudient add command investor-update
npx claudient add command board-prep
npx claudient add command hiring-decision
npx claudient add command okr-review
npx claudient add command weekly-brief
npx claudient add command fundraising-status
npx claudient add command competitive-pulse
```

## CLAUDE.md sjabloon

```markdown
# Founder / CEO Werkruimte

Deze werkruimte ondersteunt een oprichter van een startup die strategie, fondsenwerving, werving en dagelijkse activiteiten beheert. Claude Code leest context van gestructureerde bestanden in deze repo voor nauwkeurige, bedrijfsspecifieke outputs — geen generiek startup-advies.

---

## Wat dit is

Een Claude Code werkruimte voor een oprichter of CEO. Elke directory correspondeert met een kernverantwoordelijkheid: fondsenwerving pijplijn, boardbeheer, werving, financiële gezondheid, productroadsmap en externe communicatie. Claude leest vanuit deze bestanden en schrijft concepten, analyses en beslissingen terug in dezelfde structuur.

---

## Stack

- Notion — strategiedocumenten, teamwiki's, OKRs (MCP: notion)
- Linear — productroadsmap en sprint tracking (MCP: linear)
- HubSpot of Attio — investeerder CRM en fondsenwerving pijplijn
- Gusto of Rippling — HR, salarissen en aanbiedingsbeheer
- Mercury — bedrijfsbankieren en cashflowbeheer
- Carta — kapitaaltabel, equity grants en SAFE tracking
- Slack — teamcommunicatie en investeerder asynchrone updates (MCP: slack)
- Google Workspace — dataruimte (Drive), e-mail, gedeelde documenten

---

## Directoryvakken

- `strategy/` — Bedrijf OKRs, north star, jaarlijks plan, competitief landschap. OKR-bestanden zijn genoemd naar jaar en kwartaal. Verwijder nooit oude OKR-bestanden — ze zijn het graderingrecord.
- `fundraising/` — Rund tracker, investeerder pijplijn en dataruimte. `investor-pipeline.md` is de gezaghebbende bron voor alle investeerderrelaties. Notities na vergadering gaan naar `investor-crm/post-meeting-notes/` genaamd `firm-YYYY-MM-DD.md`.
- `hiring/` — Alle wervingsactiva. Compensatiebanden in `offer-templates/comp-bands-2025.md` zijn vertrouwelijk — nooit in board decks of investeerdersupdates.
- `board/` — Board materiaal, verslagen en resoluties. Verslagen worden na elke vergadering ingediend. Resoluties vereisen een handtekening van een boardlid voordat ze worden ingediend.
- `finance/` — Runway-model, cashflow, P&L en begroting. `runway-model.md` wordt bijgewerkt wanneer de burn rate of headcount verandert. Maandelijkse P&L-bestanden heten `p-and-l-YYYY-MM.md`.
- `product/` — Roadsmap, PRD's en launchplannen. Een PRD per feature. Roadsmap-bestanden zijn genoemd naar kwartaal. `product-vision.md` is een stabiel 2-jaardocument, geen sprintplan.
- `comms/` — Investeerdersupdates en all-hands notities. Verzonden investeerdersupdates worden nooit bewerkt. Concepten krijgen `-draft.md` achtervoegsel tot verzonden.

---

## Algemene taken — exacte opdrachten

### Fondsenwerving
```
/investor-update       — Concept investeerderupdate van metrieken, OKRs en hoogtepunten vorige maand
/fundraising-status    — Pijplijn snapshot: fasen, vastgelopen deals, volgende acties, rundestatuscontrole
```

### Board-beheer
```
/board-prep            — Compileer board deck narratief, agenda, CEO-brief en pre-read lijst
```

### Werving
```
/hiring-decision       — Beoordeel kandidaat: scorecard samenvatting, hire/no-hire aanbeveling
```

### Strategie en OKRs
```
/okr-review            — Geef huidge OKRs, breng blockers aan het licht, concept volgende kwartaaldoelstellingen
/competitive-pulse     — Sorteer concurrentsignalen, update landscape doc, concept responsnotitie
```

### Wekelijks ritme
```
/weekly-brief          — CEO wekelijks briefing: wins, misses, topprioriteiten, blockers, vragen
```

---

## Conventies die Claude moet volgen

- Financiële getallen uit `finance/runway-model.md` en `finance/monthly-financials/` halen. Geen getallen verzonnen of geschat.
- Investeerder pijplijn fasen in `fundraising/investor-pipeline.md` zijn gezaghebbend. Tegenspreken ze niet in fondsenwerving statusrapportages.
- Compensatiebanden in `hiring/offer-templates/comp-bands-2025.md` zijn vertrouwelijk. Nooit in investeerdersupdates, board decks of documenten die de werkruimte verlaten opnemen.
- OKR-graden gebruiken 0.0–1.0 schaal. 0.7 is een sterk resultaat. 1.0 betekent doel te laag was.
- Board materiaal is 5 werkdagen voor elke vergaderingsdatum in `board/board-calendar-2025.md` opgesteld.
- Notities na investeerdearvergadering moeten bevatten: gevoel (positief/neutraal/voorzichtig), gestelde sleutelvragen, aangehaalde bezwaren en expliciete volgende stap met eigenaar en datum.
- Alle investeerdersupdates volgen de sjabloon op `comms/investor-updates/update-template.md`. Verander de sectieorde niet en laat de vragesectie niet weg.
```

## MCP-servers

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
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
        "/Users/you/founder-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"comms/investor-updates/\" && ! echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"draft\"; then echo \"[Investeerderupdate hook] Investeerderupdate ingediend — bevestig dat het naar uw investeerderlijst is verstuurd en gearchiveerd.\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"hiring/offer-templates/comp-bands\"; then echo \"[Vertrouwelijk hook] WAARSCHUWING: comp-bands-2025.md is vertrouwelijk. Bevestig dat deze output niet voor een investeerder of board document bestemd is.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Sessie einde] Als u fundraising/investor-pipeline.md of finance/runway-model.md hebt bijgewerkt, bevestig dat de wijzigingen zijn opgeslagen en de huinde datum weergeven.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/hiring-pipeline
```

## Gerelateerd

- [Gids: Claude voor Oprichters en CEO's](../guides/for-founder.md)
- [Workflow: Fondsenwerving Pijplijn](../workflows/fundraising-pipeline.md)
- [Workflow: Board Vergadering Voorbereiding](../workflows/board-meeting-prep.md)
- [Workflow: Wekelijks CEO Review](../workflows/founder-weekly-review.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
