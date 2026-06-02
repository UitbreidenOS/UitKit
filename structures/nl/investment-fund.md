# Investeringsfonds / VC-operaties — Projectstructuur

> Voor een durfkapitaalfonds of family office dat zich bezighoudt met deal sourcing tot LP-rapportage, met gestructureerde pipelinestadia, diligence-kamers per bedrijf, portefeuille-KPI-tracking en fondsbeheer.

## Stack

- **Notion** of **Airtable** — Deal CRM, pipeline kanban, portefeuille-bedrijfsdatabase, LP-roster
- **Carta** — Cap table-beheer, fondsbeheer, equity-afgifte, pro-rata-tracking
- **Visible** of **Synaptic** — LP-rapportageportal, fondsprestatie-dashboards, portefeuille-metriek-aggregatie
- **Pitchbook** of **Crunchbase** — Marktgegevens, vergelijkbare bedrijfssets, waarderingsrichtlijnen, sectorkaartkaarten
- **QuickBooks** — Fondsboekhouding, management fee-facturering, capital call-boeking, waterfall-modellering
- **DocuSign** — Term sheet-uitvoering, abonnementsakkoorden, LP side letters, board consents
- **Google Workspace** — Gedeelde schijf voor datakamers, Sheets voor KPI-trackers, Docs voor gezamenlijke notities
- **Claude Code** — Deal screening, IC memo concepten, diligence synthese, LP-rapportgeneratie, thesisonderzoek

## Directory tree

```
investment-fund/
├── .claude/
│   ├── CLAUDE.md                                      # Fund-brede Claude Code-instructies (plaksjabloon hieronder)
│   ├── settings.json                                  # MCP servers, hooks, toolmachtigingen
│   └── commands/
│       ├── deal-screen.md                             # /deal-screen — binnenkomende deal screenen via URL of deck samenvatting
│       ├── first-look.md                              # /first-look — one-pager brief na eerste ontmoeting met oprichter
│       ├── diligence-brief.md                         # /diligence-brief — open diligence-items synthetiseren naar IC-ready samenvatting
│       ├── ic-memo.md                                 # /ic-memo — full Investment Committee memo van diligence-notities
│       ├── pass-memo.md                               # /pass-memo — gedocumenteerde pass rationale voor pipeline/passed/
│       ├── portfolio-update.md                        # /portfolio-update — maandelijkse KPI-narratief van founder update
│       ├── board-prep.md                              # /board-prep — board deck outline, agendavragen, actie-items
│       ├── lp-report.md                               # /lp-report — driemaandelijkse LP-letter met fondsprestatie en portefeuille-highlights
│       ├── capital-call.md                            # /capital-call — concept capital call notice met overboekingsinstructies
│       ├── market-thesis.md                           # /market-thesis — sector thesis doc van ruwe onderzoeksinvoer
│       └── exit-analysis.md                          # /exit-analysis — exit scenario modellering en exit thesis narratief
├── pipeline/
│   ├── sourcing/                                      # Alle binnenkomende en uitgaande leads nog niet gescreend
│   │   ├── deal-tracker.md                            # Master log: bedrijf, stadium, bron, datum, thesisfit, status
│   │   ├── thesis-signals.md                         # Opkomende patronen — thema's, sectoren, oprichter profielen waard volgen
│   │   └── _template/
│   │       └── initial-screen.md                     # Blanco screeningsformulier: bedrijf, stadium, vraag, bron, thesisfit, red flags
│   ├── first-look/                                    # Gescreend in — one-pager geschreven, eerste ontmoeting gepland of klaar
│   │   ├── _template/
│   │   │   └── one-pager.md                          # One-pager template: business, team, markt, traction, vraag, fit
│   │   ├── acme-ai/
│   │   │   └── one-pager.md                          # First-look brief: probleem, oplossing, team, traction, vraag
│   │   ├── brightpath-health/
│   │   │   └── one-pager.md
│   │   └── circuitworks-infra/
│   │       └── one-pager.md
│   ├── diligence/                                     # Actieve grondige diligence — IC memo in uitvoering
│   │   ├── _template/
│   │   │   ├── market-research.md                    # Marktgrootte, concurrentielandschap, timing thesis
│   │   │   ├── team-check.md                         # Oprichterachtergrond, referenties, track record, red flags
│   │   │   ├── financial-model.md                    # Inkomstenmodelreview, unit economics, burn, runway, gevoeligheid
│   │   │   ├── tech-diligence.md                     # Architectuur, schaalbaarheid, veiligheid, technische schuld beoordeling
│   │   │   ├── legal-diligence.md                   # IP-eigendom, arbeidscontracten, cap table opruiming, geschillen
│   │   │   └── diligence-tracker.md                  # Open items per workstream — eigenaar, deadline, status, blockers
│   │   ├── dawnrise-climate/
│   │   │   ├── market-research.md
│   │   │   ├── team-check.md
│   │   │   ├── financial-model.md
│   │   │   ├── tech-diligence.md
│   │   │   ├── legal-diligence.md
│   │   │   ├── diligence-tracker.md
│   │   │   └── reference-checks/
│   │   │       ├── ref-ceo-former-manager.md         # Gestructureerde referentie: capaciteiten, zwaktes, werkstijl
│   │   │       ├── ref-cto-cofounder.md
│   │   │       └── ref-customer-series-b-lead.md
│   │   └── edgewise-fintech/
│   │       ├── market-research.md
│   │       ├── team-check.md
│   │       ├── financial-model.md
│   │       ├── tech-diligence.md
│   │       ├── legal-diligence.md
│   │       ├── diligence-tracker.md
│   │       └── reference-checks/
│   │           └── ref-angel-lead.md
│   ├── ic/                                            # IC memo ingediend — wachten op Investment Committee stemming
│   │   └── foundry-robotics/
│   │       ├── ic-memo.md                            # Finale IC memo: thesis, markt, team, financials, risks, terms, rec
│   │       ├── comps-analysis.md                     # Openbare en privé comps met entry multiples en impliciete waardering
│   │       ├── financial-model.md
│   │       └── diligence-tracker.md                  # Gesloten items met uitkomstnota's
│   ├── closed/                                        # Ondertekend term sheet of bedrag overgemaakt — gepromoveerd naar portfolio/
│   │   └── greenmark-saas/
│   │       ├── ic-memo.md
│   │       ├── term-sheet.md                         # Uitgevoerd term sheet: waardering, pro-rata, boardzetel, beschermende bepalingen
│   │       ├── closing-checklist.md                  # Bedrag bevestigd, Carta bijgewerkt, DocuSign afgerond, pro-rata gelogd
│   │       └── post-close-intro.md                  # Introe-mail naar portefeuille resources — legal, talent, GTM
│   └── passed/                                        # Afgewezen deals — gedocumenteerd met pass rationale
│       ├── _template/
│       │   └── pass-rationale.md                    # Waarom we afwezen: categorie, kernreden, signalen die onze mening kunnen veranderen
│       ├── halcyon-crypto/
│       │   ├── one-pager.md
│       │   └── pass-rationale.md
│       └── inkdrop-hr-tech/
│           ├── one-pager.md
│           └── pass-rationale.md
├── memos/                                             # Alle IC memos en pass memos op één doorzoekbare locatie
│   ├── investment-memos/
│   │   ├── 2026-05-greenmark-saas.md               # IC memo gearchiveerd na sluiting
│   │   ├── 2026-03-foundry-robotics.md
│   │   └── 2025-11-apex-data.md
│   └── pass-memos/
│       ├── 2026-04-halcyon-crypto.md
│       └── 2026-02-inkdrop-hr-tech.md
├── portfolio/                                         # Één map per actief portefeuille-bedrijf
│   ├── _template/                                    # Kopiëren wanneer een nieuwe investering sluit
│   │   ├── memo.md                                  # IC memo (gekopieerd van pipeline/closed/)
│   │   ├── cap-table.md                             # Eigendomspercentage, aandelen, optiepool, rondetermijnen
│   │   ├── board-deck-notes/
│   │   │   └── .gitkeep                             # Board prep en post-meeting notities per kwartaal
│   │   ├── kpis/
│   │   │   └── kpi-log.md                          # Maandelijkse KPI-tabel: ARR, MoM-groei, burn, runway, personeelsbestand, NRR
│   │   ├── capital-plan/
│   │   │   └── capital-plan.md                     # Volgende-ronde tijdlijn, verwachte inzameling, pro-rata toewijzing, reserve-model
│   │   └── exit-thesis/
│   │       └── exit-thesis.md                      # Exit-paden: verwervers, IPO-paraatheid, hold vs. sell framework
│   ├── greenmark-saas/
│   │   ├── memo.md
│   │   ├── cap-table.md
│   │   ├── board-deck-notes/
│   │   │   ├── 2026-q1-board-prep.md               # Q1 board prep: agenda, vragen, actie-items om te volgen
│   │   │   ├── 2026-q1-board-notes.md              # Post-board: besluiten, actie-items, vervolgstappen
│   │   │   └── 2026-q2-board-prep.md
│   │   ├── kpis/
│   │   │   └── kpi-log.md                          # Doorlopende KPI-tabel met maandelijkse rijen
│   │   ├── capital-plan/
│   │   │   └── capital-plan.md
│   │   └── exit-thesis/
│   │       └── exit-thesis.md
│   └── apex-data/
│       ├── memo.md
│       ├── cap-table.md
│       ├── board-deck-notes/
│       │   └── 2026-q1-board-notes.md
│       ├── kpis/
│       │   └── kpi-log.md
│       ├── capital-plan/
│       │   └── capital-plan.md
│       └── exit-thesis/
│           └── exit-thesis.md
├── lp-relations/                                      # Alle LP-gerichte materialen, communicatie en fondsprestatie
│   ├── lp-roster.md                                  # LP-lijst: naam, entiteit, toezegging, overboekingsinstructies, contact
│   ├── quarterly-updates/
│   │   ├── 2026-q1-lp-update.md                    # Q1 2026 LP-letter: NAV, nieuwe investeringen, portefeuille-highlights
│   │   ├── 2025-q4-lp-update.md
│   │   └── 2025-q3-lp-update.md
│   ├── annual-reports/
│   │   └── 2025-annual-report.md                   # Jaarlijks samenvatting: IRR, DPI, RVPI, top performers, thesis voortgang
│   └── capital-call-notices/
│       ├── _template/
│       │   └── capital-call-notice.md              # Standaard notice met call bedrag, overboekingsinstructies, deadline
│       ├── 2026-04-capital-call-2.md               # Capital Call #2 — Greenmark investering
│       └── 2025-10-capital-call-1.md               # Capital Call #1 — Apex Data investering
├── thesis/                                            # Sectoronderzoek en investeringsthesen
│   ├── sector-theses/
│   │   ├── ai-infrastructure.md                    # Volledige sectorthesisses: marktkaart, timing, doelprofielen, risks
│   │   ├── climate-tech.md
│   │   ├── fintech-infrastructure.md
│   │   └── vertical-saas.md
│   └── market-maps/
│       ├── ai-infra-market-map.md                  # Landschap per laag: compute, training, inference, tooling, apps
│       ├── climate-market-map.md
│       └── fintech-rails-market-map.md
├── fund-admin/                                        # Fondsniveau administratie en wettelijke compliance
│   ├── cap-table-summary.md                         # Fondsniveau cap table: alle portefeuille-bedrijven, eigendomspercentage, kostprijs
│   ├── waterfall-model.md                           # Carried interest waterfall: hurdle rate, catch-up, carry split, LP/GP split
│   ├── compliance-calendar.md                       # Indieningsdeadlines: K-1s, FBAR, staatsregistraties, RIA filings
│   ├── management-fee-tracker.md                   # Management fee schema, ontvangen betalingen, verzoening met QuickBooks
│   └── reserve-model.md                            # Follow-on reserve model: pro-rata rechten per bedrijf, toewijzingsdoelen
└── scratch/
    ├── weekly-deal-notes.md                         # Staging area voor ruwe sourcing-notities vóór indeling in pipeline
    └── research-clips.md                            # Ruwe marktgegevens en pers clippings vóór formatteren in thesis docs
```

## Key files explained

| Path | Purpose |
|---|---|
| `pipeline/sourcing/deal-tracker.md` | Master sourcing log met elke binnenkomende en uitgaande lead — bedrijf, stadium, bron, thesisfit score (1-5), eigenaar, datum eerst gezien, huidige status; nooit items verwijderen, alleen status bijwerken |
| `pipeline/diligence/_template/diligence-tracker.md` | Per-bedrijf tracker voor alle open items in vijf workstreams (markt, team, financieel, tech, legal) — eigenaar, deadline, status, IC-blocking flag; blijft open totdat IC memo is ingediend |
| `pipeline/diligence/_template/financial-model.md` | Gestandaardiseerd financieel diligence-bestand dat inkomstenmodelreview, unit economics tabel, burn en runway berekening, gevoeligheidsaannames, en red flags omvat; voeding rechtstreeks naar IC memo financials sectie |
| `memos/investment-memos/` | Canoniek archief van alle goedgekeurde IC memos opgeslagen als `YYYY-MM-<company>.md` na IC stemming — doorzoekbaar voor comp waarderingen, thesis evolutie, en patroonmatching |
| `portfolio/_template/kpis/kpi-log.md` | Maandelijkse KPI-tabel template met kolommen voor ARR, MoM inkomstgroei, brutomarge, burn rate, runway (maanden), personeelsbestand, NRR, en pipeline coverage ratio — maandelijks aangevuld, nooit overschreven |
| `lp-relations/lp-roster.md` | LP master list met juridische entiteitnaam, toezeggingsbedrag, tot op heden geroepen kapitaal, onroepen toezegging, overboekingsinstructies, side letter vlaggen, en primaire contactpersoon — bron van waarheid voor capital call notices |
| `lp-relations/capital-call-notices/` | Uitgevoerde capital call notices opgeslagen op datum — `YYYY-MM-capital-call-N.md` — gebruikt voor LP verzoening en QuickBooks capital account vermeldingen |
| `fund-admin/waterfall-model.md` | Carried interest waterfall met hurdle rate, preferred return, catch-up bepaling, en GP/LP split — bijgewerkt bij elke exit of realizatiegebeurtenis |
| `fund-admin/compliance-calendar.md` | Jaarlijkse compliance kalender met K-1 afleveringsdeadlines, staatsblue sky filings, RIA jaarlijkse wijzigingsdatums, FBAR indien van toepassing, en audit tijdlijn |

## Quick scaffold

```bash
# Create workspace root
mkdir -p investment-fund

# Create .claude command stubs
mkdir -p investment-fund/.claude/commands

# Create pipeline stage directories
mkdir -p investment-fund/pipeline/sourcing/_template
mkdir -p investment-fund/pipeline/first-look/_template
mkdir -p investment-fund/pipeline/diligence/_template/reference-checks
mkdir -p investment-fund/pipeline/ic
mkdir -p investment-fund/pipeline/closed
mkdir -p investment-fund/pipeline/passed/_template

# Create memo archive
mkdir -p investment-fund/memos/investment-memos
mkdir -p investment-fund/memos/pass-memos

# Create portfolio template
mkdir -p investment-fund/portfolio/_template/board-deck-notes
mkdir -p investment-fund/portfolio/_template/kpis
mkdir -p investment-fund/portfolio/_template/capital-plan
mkdir -p investment-fund/portfolio/_template/exit-thesis

# Create LP relations directories
mkdir -p investment-fund/lp-relations/quarterly-updates
mkdir -p investment-fund/lp-relations/annual-reports
mkdir -p investment-fund/lp-relations/capital-call-notices/_template

# Create thesis directories
mkdir -p investment-fund/thesis/sector-theses
mkdir -p investment-fund/thesis/market-maps

# Create fund admin directory
mkdir -p investment-fund/fund-admin

# Create scratch
mkdir -p investment-fund/scratch

# Seed placeholder files
touch investment-fund/pipeline/sourcing/deal-tracker.md
touch investment-fund/pipeline/sourcing/thesis-signals.md
touch investment-fund/fund-admin/cap-table-summary.md
touch investment-fund/fund-admin/waterfall-model.md
touch investment-fund/fund-admin/compliance-calendar.md
touch investment-fund/fund-admin/management-fee-tracker.md
touch investment-fund/fund-admin/reserve-model.md
touch investment-fund/lp-relations/lp-roster.md
touch investment-fund/scratch/weekly-deal-notes.md
touch investment-fund/scratch/research-clips.md

# Seed .gitkeep placeholders in empty template dirs
touch investment-fund/portfolio/_template/board-deck-notes/.gitkeep
touch investment-fund/portfolio/_template/kpis/.gitkeep
touch investment-fund/portfolio/_template/capital-plan/.gitkeep
touch investment-fund/portfolio/_template/exit-thesis/.gitkeep

# Install fund operations skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/ic-memo
npx claudient add skill finance/diligence-synthesis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/market-sizing
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/exit-modeling
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
```

## CLAUDE.md template

```markdown
# Investeringsfonds — Claude Code Instructies

## Wat dit is

Dit is de werkdirectory voor een durfkapitaalfonds dat end-to-end deal flow, portefeuille monitoring, LP-rapportage en fondsbeheer beheert. Pipelinestadia bevinden zich in pipeline/ (sourcing → first-look → diligence → ic → closed of passed), actieve investeringen in portfolio/ (één map per bedrijf), IC en pass memos in memos/, LP-materialen in lp-relations/, sectoronderzoek in thesis/, en fondsbeheer in fund-admin/.

Alle deal screening, IC memo concepten, diligence synthese, LP-rapportage en board prep draaien via Claude Code slash commands in .claude/commands/.

## Stack

- Notion / Airtable — Deal CRM en portefeuille database; pipeline kanban per stadium; LP roster
- Carta — Cap table van record; export samenvattingen naar portfolio/<company>/cap-table.md
- Visible / Synaptic — LP rapportage portal; driemaandelijkse updates opgesteld in lp-relations/quarterly-updates/
- Pitchbook / Crunchbase — Marktgegevens en comps; exports gaan naar thesis/ en diligence bestanden
- QuickBooks — Fondsboekhouding; capital calls, management fees, distributies hier verzoend
- DocuSign — Term sheets, abonnementsakkoorden, LP side letters; uitgevoerde kopieën in fund-admin/
- Google Workspace — Shared Drive spiegels naar pipeline/diligence/<company>/data-room/ voor offline referentie

## Common tasks and exact commands

### Screen an inbound deal
```
/deal-screen

Company: [name]
URL: [website or Crunchbase/Pitchbook profile]
Stage: [pre-seed / seed / Series A / Series B]
Sector: [category]
Ask: $[amount] at $[pre-money or post-money] valuation
Source: [inbound / warm intro from X / conference / cold outbound]
Deck or key metrics: [paste or describe — ARR, growth rate, team background]
Thesis fit check: [which sector thesis does this map to?]
```

### Write a first-look one-pager
```
/first-look

Company: [name], Stage: [round], Sector: [category]
Meeting notes: [paste raw first-meeting notes]
Deck highlights: [paste key slides or describe]
Team background: [CEO and CTO bios and prior experience]
Traction: [ARR, MoM growth, customer count, NRR if available]
Ask: $[amount] at $[valuation], closing: [date or open]
Initial thesis fit: [why this fits or stretches our thesis]
Open questions before diligence: [what needs to be true to proceed]
```

### Synthesize diligence into IC-ready brief
```
/diligence-brief

Company: [name], Stage: [round], IC target date: [date]
Market research findings: [paste from diligence/<company>/market-research.md]
Team check findings: [paste from diligence/<company>/team-check.md]
Financial model review: [paste from diligence/<company>/financial-model.md]
Tech diligence notes: [paste from diligence/<company>/tech-diligence.md]
Legal diligence notes: [paste from diligence/<company>/legal-diligence.md]
Open items remaining: [paste open rows from diligence-tracker.md]
Key risks to address in memo: [top 3 that IC will challenge]
```

### Draft a full IC memo
```
/ic-memo

Company: [name], Stage: [round], Sector: [category]
Investment amount: $[amount], Valuation: $[post-money], Ownership: [%]
Investment thesis: [1-2 sentences — why this company, why now, why us]
Market: [TAM, SAM, growth rate, structural tailwinds, timing thesis]
Team: [founder backgrounds, domain expertise, references summary]
Product: [core wedge, differentiation, moat, roadmap]
Traction: [ARR, MoM growth, NRR, gross margin, customer count, burn, runway]
Risks and mitigants: [top 3-4 risks with specific proposed mitigants]
Comparable deals: [3-5 comps with stage, valuation, multiple at exit if available]
Terms: [lead, pro-rata, board seat, protective provisions, side letter flags]
Recommendation: [Invest / Pass / More diligence needed]
```

### Draft a quarterly LP report
```
/lp-report

Quarter: Q[X] [YEAR]
Fund: [Fund name and vintage]
Total fund size: $[X]M, Deployed to date: $[Y]M, Uncalled: $[Z]M
NAV this quarter: $[X]M (prior quarter: $[Y]M)
Gross IRR: [%], Net IRR: [%], DPI: [X]x, RVPI: [Y]x, TVPI: [Z]x
New investments this quarter: [company, amount, stage, sector]
Portfolio highlights: [top 2-3 milestones — rounds closed, revenue growth, key hires, partnerships]
Concerns or write-downs: [any marks or portfolio challenges to address]
Upcoming: [expected closings, capital calls, portfolio events next quarter]
Market outlook: [macro context relevant to fund thesis — 2-3 sentences]
```

### Draft a capital call notice
```
/capital-call

Call number: [#N]
Investment triggering call: [company name], Amount invested: $[X]
Call amount per LP: [proportional to commitment or specify]
Wire deadline: [date]
Wire instructions: [from fund-admin/ or specify]
Purpose note: [standard language or specific investment note]
LP roster: [paste from lp-relations/lp-roster.md or specify LP count]
```

### Generate board prep for a portfolio company
```
/board-prep

Company: [name], Board date: [date]
Last board action items: [paste from prior board-notes file]
Current KPIs: [paste from portfolio/<company>/kpis/kpi-log.md]
Last founder update: [paste most recent monthly update]
Agenda items: [financials / product roadmap / hiring / fundraising / other]
Key questions to raise: [specific concerns or opportunities to probe]
Decisions to make: [option grants, budget approvals, strategic pivots]
```

### Write an exit thesis for a portfolio company
```
/exit-analysis

Company: [name], Investment date: [date], Cost basis: $[X]M, Current ownership: [%]
Current ARR: $[X]M, Growth rate: [%], Gross margin: [%]
Likely acquirers: [list strategic buyers with rationale for each]
IPO readiness: [revenue scale, growth profile, market conditions needed]
Hold vs. sell framework: [what metrics or events would trigger exit vs. hold]
Comparable exits: [recent M&A or IPOs in category with multiples]
Target return scenario: [1x / 3x / 5x / 10x scenarios and implied valuation]
```

## Conventions to follow

- Pipeline stages are strictly ordered: sourcing → first-look → diligence → ic → closed or passed
- Every company that reaches first-look gets a one-pager at pipeline/first-look/<company>/one-pager.md
- Diligence folders use five standard files: market-research.md, team-check.md, financial-model.md, tech-diligence.md, legal-diligence.md — do not rename them
- IC memos are filed to memos/investment-memos/YYYY-MM-<company>.md after IC vote regardless of outcome
- When a deal closes, copy the IC memo to portfolio/<company>/memo.md and create the full portfolio folder from _template/
- Pass rationale is always written — file to pipeline/passed/<company>/pass-rationale.md and memos/pass-memos/YYYY-MM-<company>.md
- KPI logs are append-only: add a new row each month, never overwrite prior entries
- Capital call notices are archived in lp-relations/capital-call-notices/YYYY-MM-capital-call-N.md
- LP roster in lp-relations/lp-roster.md is the source of truth for all capital call and distribution notices
- NAV tracker and waterfall model in fund-admin/ are updated within 5 business days of each exit or realization event
- Compliance calendar in fund-admin/compliance-calendar.md is reviewed at the start of each quarter
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
        "/Users/your-username/investment-fund"
      ]
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token"
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
    "airtable": {
      "command": "npx",
      "args": ["-y", "@airtable/mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "your-airtable-api-key",
        "AIRTABLE_BASE_ID": "appXXXXXXXXXXXXXX"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"ic-memo.md\" && echo \"$FILE\" | grep -q \"pipeline/ic/\"; then echo \"[hook] IC memo written in pipeline/ic/ — remember to file a copy to memos/investment-memos/YYYY-MM-<company>.md after the IC vote\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"pass-rationale.md\"; then echo \"[hook] Pass rationale written — also file to memos/pass-memos/YYYY-MM-<company>.md and confirm the company folder is moved to pipeline/passed/\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"capital-call-notices/\" && ! echo \"$FILE\" | grep -q \"_template\"; then echo \"[hook] Capital call notice written — verify LP roster counts match and wire instructions are current before distributing\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOM=$(date +%d); if [ \"$DOM\" -le \"05\" ]; then echo \"[reminder] Early month — check portfolio/<company>/kpis/kpi-log.md entries for last month and review compliance-calendar.md for upcoming deadlines\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core fund operations skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/ic-memo
npx claudient add skill finance/diligence-synthesis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/market-sizing
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/exit-modeling
npx claudient add skill finance/waterfall-model

# Supporting productivity and communication skills
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/investor-update
npx claudient add skill data-ml/stakeholder-report

# Install all finance skills at once
npx claudient add skills finance
```

## Related

- [Investor guide](../guides/for-investor.md)
- [Deal flow workflow](../workflows/deal-flow.md)
- [IC memo process workflow](../workflows/ic-memo-process.md)
- [LP reporting workflow](../workflows/lp-reporting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
