# Marketing Agency Operations — Projectstructuur

> Voor marketingbureaus die meerdere klantcampagnes beheren — van onboarding en intakeformulieren tot contentproductie, betaalde media, maandelijkse rapportage en retainerfacturering — allemaal in een enkele Claude Code werkruimte.

## Stack

- **Projectmanagement:** Asana (Projects, Timelines, Portfolios) of Monday.com (Boards, Automations, Dashboards)
- **CRM + campagne tracking:** HubSpot CRM (contacten, deals, campagneprestaties, e-mailsequenties)
- **Documenten + samenwerking:** Google Workspace (Docs, Sheets, Slides, Drive)
- **Creatief:** Figma (merkontwerp, advertentiecreatives, mockups landingspagina's, presentatiedelen)
- **SEO:** Semrush (Keyword Magic, Position Tracking, Site Audit, Backlink Analytics)
- **Betaalde zoekopdrachten:** Google Ads (Search, Display, Performance Max, Demand Gen campagnes)
- **Betaalde social:** Meta Business Suite (Facebook + Instagram Ads Manager, Audience Insights)
- **Communicatie:** Slack (klantkanalen, interne kanalen, campagnewaarschuwingen)
- **Tijdregistratie:** Harvest (projectniveau-tijdregistratie, budgetverbruik, teamcapaciteit)
- **Facturering:** FreshBooks (retainerfacturen, projectfacturering, onkostenregistratie, rapporten)
- **Analytische gegevens:** Google Analytics 4, Looker Studio (cross-channel dashboards)

## Mappenstructuur

```
marketing-agency/
├── .claude/
│   ├── CLAUDE.md                                     # Werkruimteinstructies voor Claude Code
│   ├── settings.json                                 # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── new-client.md                             # /new-client — volledige clientmap van sjabloon maken
│       ├── campaign-brief.md                         # /campaign-brief — campagnebrief van intakenotities genereren
│       ├── monthly-report.md                         # /monthly-report — metrieken verzamelen en clientrapport schrijven
│       ├── retainer-check.md                         # /retainer-check — geregistreerde uren versus retaineromvang vergelijken
│       ├── proposal.md                               # /proposal — voorstel voor nieuw zakelijk werk van brief opstellen
│       ├── ad-copy.md                                # /ad-copy — Google Ads en Meta advertentiekopie varianten genereren
│       ├── seo-audit.md                              # /seo-audit — Semrush site audit samenvatting voor klant uitvoeren
│       └── scope-change.md                           # /scope-change — wijzigingsopdracht omvang met factureringsgevolgen opstellen
├── clients/
│   ├── _template/                                    # Basissjabloon — kopieer naar clients/<client-name>/ bij onboarding
│   │   ├── brief/
│   │   │   ├── client-intake.md                     # Intakevraaglijs antwoorden
│   │   │   └── discovery-notes.md                   # Notities van kickoff gesprek
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md                # Algehele kanaalstrategie en 90-daags schema
│   │   │   ├── target-audience.md                   # ICP, persona's, pijnpunten
│   │   │   └── competitor-analysis.md               # Competitief landschap, gaten, kansen
│   │   ├── campaigns/
│   │   │   └── _campaign-template/
│   │   │       ├── campaign-brief.md                # Doelstellingen, publiek, messaging, budget, tijdlijn
│   │   │       ├── ad-copy.md                       # Alle advertentiekopie varianten per kanaal
│   │   │       ├── creative-brief.md                # Figma brief voor designteam
│   │   │       └── results/
│   │   │           └── campaign-report.md           # Schriftelijke resultaten na campagne
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md                  # Merkkleurenpalette, lettertypen, toon van spraak
│   │   │   ├── logo/                                # Goedgekeurde logobestanden (SVG, PNG)
│   │   │   └── approved-copy/                       # Goedgekeurde koppen, slogans, standaardtekst
│   │   ├── reports/
│   │   │   ├── onboarding-report.md                 # Basisline audit afgeleverd bij kickoff
│   │   │   └── _monthly-template.md                 # Kopieer dit voor elk maandelijks rapport
│   │   └── contracts/
│   │       ├── sow.md                               # Statement of Work met leverables en omvang
│   │       ├── retainer-agreement.md                # Maandelijkse retainervoorwaarden en uren
│   │       └── amendments/                          # Ondertekende wijzigingsopdrachten omvang
│   ├── acme-corp/
│   │   ├── brief/
│   │   │   ├── client-intake.md
│   │   │   └── discovery-notes.md
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md
│   │   │   ├── target-audience.md
│   │   │   └── competitor-analysis.md
│   │   ├── campaigns/
│   │   │   ├── 2026-q2-brand-awareness/
│   │   │   │   ├── campaign-brief.md
│   │   │   │   ├── ad-copy.md
│   │   │   │   ├── creative-brief.md
│   │   │   │   └── results/
│   │   │   │       └── campaign-report.md
│   │   │   └── 2026-q3-lead-gen/
│   │   │       ├── campaign-brief.md
│   │   │       ├── ad-copy.md
│   │   │       └── creative-brief.md
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md
│   │   │   ├── logo/
│   │   │   └── approved-copy/
│   │   ├── reports/
│   │   │   ├── onboarding-report.md
│   │   │   ├── 2026-04-monthly-report.md
│   │   │   ├── 2026-05-monthly-report.md
│   │   │   └── _monthly-template.md
│   │   └── contracts/
│   │       ├── sow.md
│   │       ├── retainer-agreement.md
│   │       └── amendments/
│   │           └── 2026-05-scope-change-01.md
│   └── blueprint-health/
│       ├── brief/
│       ├── strategy/
│       ├── campaigns/
│       ├── assets/
│       ├── reports/
│       └── contracts/
├── templates/
│   ├── campaign-brief.md                            # Blanco campagnebrief — doelstellingen, publiek, budget, kanalen
│   ├── monthly-report.md                            # Structuur maandelijks rapport — samenvatting, KPI's, kanaalanalyse
│   ├── proposal.md                                  # Voorstel nieuw zakelijk werk — situatie, benadering, team, investering
│   ├── sow.md                                       # Statement of Work — deliverables, tijdlijnen, omvang, exclusies
│   ├── creative-brief.md                            # Creative brief voor Figma — context, deliverables, spec's, verboden
│   └── scope-change-order.md                        # Wijzigingsopdracht omvang — beschrijving, uren, herziene facturering
├── campaigns/
│   └── active/
│       ├── acme-corp--q3-lead-gen/                  # Symlink of kopie van actieve campagnemap voor snelle toegang
│       └── blueprint-health--seo-sprint/
├── new-business/
│   ├── prospect-list.md                             # CRM-stijl prospecttracking met fase, contactpersoon, notities
│   ├── proposals/
│   │   ├── greenfield-retail-2026-05.md             # Verzonden voorstellen gearchiveerd hier
│   │   └── northstar-saas-2026-06.md
│   └── pitch-decks/
│       ├── agency-capabilities-2026.md              # Masterdocument capaciteiten (uit dit document putten voor presentaties)
│       └── greenfield-retail-deck-outline.md        # Presentatieoverzicht alvorens naar Slides/Figma te gaan
├── operations/
│   ├── sops/
│   │   ├── client-onboarding.md                    # Stap-voor-stap checklist voor onboarding van nieuwe klanten
│   │   ├── campaign-launch.md                      # Checklist vóór lancering voor betaalde campagnes
│   │   ├── monthly-reporting.md                    # Rapportingworkflow — gegevens verzamelen, concept, review, verzenden
│   │   ├── offboarding.md                          # Offboarding klanten — asset overdracht, toegangsintrekking
│   │   └── retainer-renewal.md                     # Vernieuwingsproces — review, upsell, herzien SOW
│   ├── onboarding/
│   │   ├── new-hire-checklist.md                   # Toegang tot hulpprogramma's, Slack-kanalen, Harvest-setup
│   │   └── client-onboarding-checklist.md          # Parallelle checklist voor stappen aan kant van klant
│   ├── offboarding/
│   │   └── client-offboarding-checklist.md
│   └── rate-card.md                                 # Huidige uurtarieven en retainer-tier-prijzen
└── resources/
    ├── brand-guidelines/
    │   └── agency-brand.md                          # Merkgids bureau zelf voor pitches en voorstellen
    ├── media-kits/
    │   └── agency-media-kit-2026.md                 # Bureauoverzicht, klantenpalet, resultaathighlights
    └── case-studies/
        ├── acme-corp-brand-awareness.md             # Gestructureerde case study — uitdaging, benadering, resultaten
        └── blueprint-health-seo.md
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/new-client.md` | Slash-commando dat de volledige `clients/<slug>/` mappenstructuur uit `clients/_template/` creëert, het intakeformulier vooraf invult, en een conceptversie van SOW en retainerovereenkomst maakt |
| `.claude/commands/campaign-brief.md` | Neemt een client slug, campagnedoel, budget en kanalen als invoer; produceert een volledig gestructureerde campagnebrief in lijn met de bestaande merkrichtlijnen en strategie van de klant |
| `.claude/commands/monthly-report.md` | Leest kanaalmetrieken (GA4, Google Ads, Meta, Semrush) uit een gestructureerd gegevensbestand en schrijft het maandelijks clientrapport met `templates/monthly-report.md` |
| `.claude/commands/retainer-check.md` | Vergelijkt Harvest geregistreerde uren tegen de retaineromvang van de klant in `contracts/retainer-agreement.md` en markeert overschrijdingen of beschikbaar budget |
| `.claude/commands/scope-change.md` | Stelt een wijzigingsopdracht omvang op met uren, rationale en herziene facturering met `templates/scope-change-order.md`; slaat op naar `clients/<slug>/contracts/amendments/` |
| `clients/_template/` | Basisscaffoldingmap — kopieert deze volledige map bij onboarding van een nieuwe klant om ervoor te zorgen dat elke map en elk bestand bestaat vóór kickoff |
| `operations/sops/monthly-reporting.md` | Canonieke SOP voor het maandelijkse rapportageproces — bepaalt wie gegevens verzamelt, wat de beoordelingscyclus is, en wanneer rapporten naar klanten gaan |
| `templates/campaign-brief.md` | Standaard campagnebrief bureau met secties voor bedrijfsdoelstelling, succesmetrieken, publiek, messagingpijlers, kanaalplan, budget en tijdlijn |

## Snelle opbouw

```bash
# Werkruimte root maken
mkdir -p marketing-agency && cd marketing-agency

# Claude Code config
mkdir -p .claude/commands

# Client _template directory (volledige diepte)
mkdir -p clients/_template/brief
mkdir -p clients/_template/strategy
mkdir -p clients/_template/campaigns/_campaign-template/results
mkdir -p clients/_template/assets/logo
mkdir -p clients/_template/assets/approved-copy
mkdir -p clients/_template/reports
mkdir -p clients/_template/contracts/amendments

# Voorbeeld clientmappen
mkdir -p clients/acme-corp/brief
mkdir -p clients/acme-corp/strategy
mkdir -p clients/acme-corp/campaigns/2026-q2-brand-awareness/results
mkdir -p clients/acme-corp/campaigns/2026-q3-lead-gen
mkdir -p clients/acme-corp/assets/logo
mkdir -p clients/acme-corp/assets/approved-copy
mkdir -p clients/acme-corp/reports
mkdir -p clients/acme-corp/contracts/amendments

mkdir -p clients/blueprint-health/brief
mkdir -p clients/blueprint-health/strategy
mkdir -p clients/blueprint-health/campaigns
mkdir -p clients/blueprint-health/assets
mkdir -p clients/blueprint-health/reports
mkdir -p clients/blueprint-health/contracts/amendments

# Sjablonen
mkdir -p templates

# Actieve campagnes snelkoppeling
mkdir -p campaigns/active

# Nieuw zakelijk werk
mkdir -p new-business/proposals
mkdir -p new-business/pitch-decks

# Operations
mkdir -p operations/sops
mkdir -p operations/onboarding
mkdir -p operations/offboarding

# Resources
mkdir -p resources/brand-guidelines
mkdir -p resources/media-kits
mkdir -p resources/case-studies

# Configuratiebestanden initialiseren
touch .claude/CLAUDE.md
touch .claude/settings.json

# Sjabloonbestanden aanmaken
touch clients/_template/brief/client-intake.md
touch clients/_template/brief/discovery-notes.md
touch clients/_template/strategy/marketing-strategy.md
touch clients/_template/strategy/target-audience.md
touch clients/_template/strategy/competitor-analysis.md
touch clients/_template/campaigns/_campaign-template/campaign-brief.md
touch clients/_template/campaigns/_campaign-template/ad-copy.md
touch clients/_template/campaigns/_campaign-template/creative-brief.md
touch clients/_template/reports/_monthly-template.md
touch clients/_template/contracts/sow.md
touch clients/_template/contracts/retainer-agreement.md
touch templates/campaign-brief.md
touch templates/monthly-report.md
touch templates/proposal.md
touch templates/sow.md
touch templates/creative-brief.md
touch templates/scope-change-order.md
touch new-business/prospect-list.md
touch operations/sops/client-onboarding.md
touch operations/sops/campaign-launch.md
touch operations/sops/monthly-reporting.md
touch operations/sops/offboarding.md
touch operations/sops/retainer-renewal.md
touch operations/rate-card.md

# Alle relevante vaardigheden installeren
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/stakeholder-report

# Slash-commando's installeren
npx claudient add command new-client
npx claudient add command campaign-brief
npx claudient add command monthly-report
npx claudient add command retainer-check
npx claudient add command proposal
npx claudient add command ad-copy
npx claudient add command seo-audit
npx claudient add command scope-change

echo "Marketingbureauwerkruimte klaar."
```

## CLAUDE.md sjabloon

```markdown
# Marketing Agency Operations — Claude Instructies

## Wat dit is

Deze werkruimte beheert multi-klant marketingbureau-operaties: klientonboarding,
campagnebriefbriefing, betaalde media (Google Ads + Meta), SEO (Semrush), maandelijks
rapporteren, retaineromvangtracking en voorstelontwikkeling nieuw zakelijk werk. Elke klant
heeft een afzonderlijke map onder clients/. Alle sjablonen bevinden zich in templates/.

## Stack

- Projectmanagement: Asana (één project per klant, campagnetaken, tijdlijnen)
- CRM: HubSpot (contact- en dealrecords, campagnetracking, e-mailsequenties)
- Documenten: Google Workspace (Docs voor deliverables, Sheets voor mediaplannen, Slides voor presentaties)
- Creatief: Figma (advertentiecreatives, landingspagina's, presentatiedelen)
- SEO: Semrush (trefwoordonderzoek, positionering volgen, site audit, backlink analyse)
- Betaalde zoekopdrachten: Google Ads (Search, Display, Performance Max)
- Betaalde social: Meta Business Suite (Facebook + Instagram Ads Manager)
- Tijdregistratie: Harvest (projectniveau, factureerbaar versus niet-factureerbaar per klant)
- Facturering: FreshBooks (retainerfacturen, projectfacturering, onkostenverzoeking)
- Communicatie: Slack (#client-<name> per klant, #campaigns, #new-business, #ops)
- Analytische gegevens: Google Analytics 4, Looker Studio dashboards

## Mapconventies

- clients/<client-slug>/ — alle clientleverables; mengeel nooit clientassets in mappen
- clients/<client-slug>/campaigns/<YYYY-qN-campaign-name>/ — één map per campagne
- clients/<client-slug>/reports/<YYYY-MM>-monthly-report.md — maandelijkse rapporten genoemd naar periode
- clients/<client-slug>/contracts/amendments/ — elke omvangwijziging krijgt een genummerd bestand
- templates/ — bron van waarheid voor alle documentstructuren; maak nooit concept zonder sjabloon te kopiëren
- new-business/ — alleen prospecttracking, voorstellen en presentatiedekoverzichten
- operations/sops/ — canonieke procesdocumentatie; werk deze bij wanneer proces verandert

## Onboarding van een nieuwe klant

1. Kopieer clients/_template/ naar clients/<new-client-slug>/:
   cp -r clients/_template clients/<new-client-slug>
2. Voer /new-client client="<Name>" slug="<slug>" retainer="<monthly-hours>" uit
3. Vul clients/<slug>/brief/client-intake.md in vóór het kickoff-gesprek
4. Na kickoff, vul clients/<slug>/strategy/marketing-strategy.md in
5. Concept SOW met templates/sow.md; opslaan naar clients/<slug>/contracts/sow.md
6. Maak Asana-project aan en link project-ID in clients/<slug>/brief/discovery-notes.md
7. Open HubSpot deal record en link deal-ID in discovery-notes.md
8. Open Harvest-project voor de klant met behulp van het tariefkaart in operations/rate-card.md

## Campagnebriefworkflow

1. Voer /campaign-brief client="<slug>" goal="<objective>" budget="<amount>" channels="<list>" uit
2. Controleer en verfijn clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md
3. Voer /ad-copy brief=clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md uit
4. Stuur creative-brief.md naar Figma — verwijs naar brand-guidelines.md voor specconstrainten
5. Bij lancering voert u /seo-audit client="<slug>" uit voor organische campagnes; controleer Semrush-basisposition
6. Log campagne startdatum in Harvest als aantekening mijlpaal

## Maandelijks rapportageproces

1. Exporteer kanaalgegevens (GA4, Google Ads, Meta, Semrush positionering volgen) naar een CSV of gestructureerde .md
2. Plaats geëxporteerde gegevens in clients/<slug>/reports/raw-data-<YYYY-MM>.md
3. Voer /monthly-report client="<slug>" period="<YYYY-MM>" data=clients/<slug>/reports/raw-data-<YYYY-MM>.md uit
4. Controleer concept op clients/<slug>/reports/<YYYY-MM>-monthly-report.md
5. Interne review via Slack #campaigns voordat naar klant wordt verzonden
6. Na klantgoedkeuring, archiveer in Google Drive en markeer als verzonden in Asana

## Retaineromvangbeheer

- Voer /retainer-check client="<slug>" month="<YYYY-MM>" uit na elke Harvest-export
- Uren over omvang: concept wijzigingsopdracht vóór aanvullende tijd registreren
  /scope-change client="<slug>" hours="<overage>" reason="<description>"
- Output opslaan naar clients/<slug>/contracts/amendments/YYYY-MM-scope-change-NN.md
- Retainervernieuwingen: volg operations/sops/retainer-renewal.md 30 dagen vóór einddatum

## Advertentiekopieconventies

- Google Ads koppen: maximaal 30 tekens; schrijf 10+ varianten per campagne
- Google Ads beschrijvingen: maximaal 90 tekens; begin met voordeel, eindig met CTA
- Meta primaire tekst: 125 tekens zichtbaar vóór afkapping; hook in eerste 80 tekens
- Meta kop: maximaal 40 tekens; voordeel-gericht, geen clickbait
- Alle kopie moet tegen merkrichtlijnen van klant worden goedgekeurd voordat upload

## Factureringsconventies

- Log tijd in Harvest onmiddellijk na elke taak — batch niet aan het einde van de week
- Factureerbare codes: strategie, inhoud, betaalde media, rapportage, accountbeheer, ontwerp
- Niet-factureerbaar: interne training, tooling setup, administratie
- Factureer op de 1e van elke maand via FreshBooks; verwijs naar Harvest rapport voor uurverdeling
```

## MCP-servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/marketing-agency"
      ]
    },
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
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google-labs/google-drive-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
      }
    },
    "asana": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "${ASANA_ACCESS_TOKEN}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */campaigns/*/campaign-brief.md ]]; then echo \"[hook] Campaign brief saved: $FILE — run /ad-copy and /creative-brief next\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */contracts/amendments/*.md ]]; then echo \"[hook] Scope change order saved: $FILE — update Harvest budget and send to client for signature\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find clients/ -mindepth 1 -maxdepth 1 -type d ! -name _template | while read CLIENT; do [ ! -f \"$CLIENT/contracts/retainer-agreement.md\" ] && echo \"$CLIENT\"; done | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[reminder] $MISSING client(s) missing retainer-agreement.md — check contracts/ directories\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

```bash
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/social-media-manager
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/investor-update
```

## Gerelateerd

- [Gids: Claude voor Marketingteams](../guides/for-content-marketer.md)
- [Workflow: Campagnelancering end-to-end](../workflows/campaign-launch.md)
- [Workflow: Maandelijks clientrapportage](../workflows/monthly-reporting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
