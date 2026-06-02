# Product Manager Workspace — Projectstructuur

> Voor een productmanager die verantwoordelijk is voor onderzoek, routekaart, levering en launches — PRD-schrijven, belanghebber-afstemming, sprintplanning, onderzoekssynthese, experimentontwerp en concurrentiële analyse, allemaal aangestuurd vanuit één Claude Code-werkruimte.

## Stack

- Linear — routekaartbeheer, sprinttracking, backlogrooming, mijlpaalrapportage
- Figma — ontwerpreview, prototypekoppelingen, ontwerspecificatieverwijzingen (MCP: figma)
- Notion of Confluence — PRD's, productspecificaties, teamwiki's, beslissingenlogboeken
- Amplitude of Mixpanel — productanalytica, trechterfanalyse, functieopstelling, north star tracking
- Dovetail — onderzoeksopslagplaats voor gebruikers, interviewnotities, inzichttagging, gebruikbaarheidsrapporten
- Jira — enterprise-sprintborden, ticketbeheer, releasevolgorde (wanneer organisatie dit vereist)
- Slack — belanghebber async, lanceringcoördinatie, cross-functionele communicatie (MCP: slack)
- Loom — async-demoopnames, functiewalkthrough's, sprintreview-video's

## Mappenstructuur

```
product-manager-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Werkruimteinstructies voor Claude Code
│   ├── settings.json                              # Machtigingen, hooks, MCP-serverconfiguratie
│   └── commands/
│       ├── prd-draft.md                           # Concept-PRD van functieidee — leest sjablonen, voert volledige spec uit
│       ├── user-story.md                          # Genereer gebruikersverhalen uit PRD of functiebrief
│       ├── experiment-design.md                   # Ontwerp A/B of multivariate test — hypothese, metriek, steekproefgrootte
│       ├── launch-plan.md                         # Bouw lanceringchecklist en communicatieplan van PRD
│       ├── competitive-teardown.md                # Teardown van concurrentieel product — UX, prijsstelling, positioneringsgaten
│       ├── sprint-review.md                       # Compileer sprintreview-verslag van Linear-tickets en metriek
│       └── discovery-interview.md                 # Genereer interviewgids van onderzoeksdoelstelling
├── roadmap/
│   ├── quarterly-roadmap-q3-2025.md              # Q3-routekaart — initiatieven, eigenaren, mijlpalen, status
│   ├── quarterly-roadmap-q4-2025.md              # Q4-routekaart (concept — niet gepleegd)
│   ├── annual-themes-2025.md                     # Jaarlijkse productthema's — strategische inzetten en rationale
│   ├── feature-backlog.md                        # Geprioriteerde functielijst — alle in-scope ideeën met scores
│   ├── prioritization-framework.md               # RICE of ICE scoringsregels, wegingen, besluitvormingscriteria
│   ├── now-next-later.md                         # Nu / Volgende / Later weergave — huidige horizonmomentopname
│   └── deprioritized-log.md                      # Gedeprioreerde functies — reden, datum, wie besloten
├── prds/
│   ├── _prd-template.md                          # Canonieke PRD-sjabloon — secties, eigenaren, ondertekeningtabel
│   ├── active/
│   │   ├── prd-onboarding-revamp.md              # PRD — onboarding-flowherziening (in ontwikkeling)
│   │   ├── prd-bulk-export.md                    # PRD — bulkgegevensexportfunctie (in specreview)
│   │   ├── prd-notification-center.md            # PRD — meldingscentrum v2 (in ontwerp)
│   │   └── prd-api-rate-limiting.md              # PRD — API-snelheidsbeperkingen en quotabeheer
│   ├── shipped/
│   │   ├── prd-search-v2.md                      # PRD — zoekopdracht v2 (verzonden 2025-04)
│   │   ├── prd-team-permissions.md               # PRD — toestemmingen op teamniveau (verzonden 2025-02)
│   │   └── prd-csv-import.md                     # PRD — CSV-import (verzonden 2025-01)
│   └── archived/
│       ├── prd-mobile-app-v1.md                  # PRD — mobiele app v1 (geannuleerd — pivot naar webfirst)
│       └── prd-ai-assistant-spike.md             # PRD — AI-assistent spike (samengevoegd in onboarding PRD)
├── research/
│   ├── _interview-guide-template.md              # Canonieke sjabloon voor gebruikersinterviewgids
│   ├── interviews/
│   │   ├── 2025-05-onboarding-study/
│   │   │   ├── research-plan.md                  # Onderzoeksdoelstelling, deelnemercriteria, script
│   │   │   ├── participant-screener.md           # Screenervragen voor werving
│   │   │   ├── notes-p1-2025-05-12.md            # Interviewnotities — deelnemer 1
│   │   │   ├── notes-p2-2025-05-13.md            # Interviewnotities — deelnemer 2
│   │   │   ├── notes-p3-2025-05-14.md            # Interviewnotities — deelnemer 3
│   │   │   ├── notes-p4-2025-05-15.md            # Interviewnotities — deelnemer 4
│   │   │   ├── notes-p5-2025-05-16.md            # Interviewnotities — deelnemer 5
│   │   │   └── synthesis-report.md               # Synthetiseerde inzichten, thema's, citaten, aanbevelingen
│   │   └── 2025-03-churn-investigation/
│   │       ├── research-plan.md                  # Onderzoeksplan — churn drivers onderzoek
│   │       ├── notes-p1-2025-03-04.md            # Interviewnotities
│   │       └── synthesis-report.md               # Synthese — top 5 churn thema's, ernst matrix
│   ├── surveys/
│   │   ├── nps-q2-2025-results.md                # NPS-enquêteresultaten — score, verbatims, segmentafbraak
│   │   ├── onboarding-csat-2025-05.md            # Onboarding CSAT-enquêteresultaten en thema's
│   │   └── feature-prioritization-survey.md      # Door gebruiker gerangschikte functieprioriteitsenquête (n=240)
│   ├── usability/
│   │   ├── usability-bulk-export-2025-05.md      # Gebruikbaarheidstest — bulkexportflow (5 deelnemers)
│   │   └── usability-onboarding-2025-04.md       # Gebruikbaarheidstest — nieuwe onboarding (7 deelnemers)
│   └── personas/
│       ├── persona-power-user.md                 # Power-user persona — doelen, frustraties, context, citaten
│       ├── persona-occasional-user.md            # Occasionele gebruikerpersona
│       └── persona-admin.md                      # Admin/koperpersona — evaluatiecriteria, bezwaren
├── experiments/
│   ├── _experiment-template.md                   # Canonieke experimentdoc — hypothese, metriek, ontwerp, resultaten
│   ├── active/
│   │   ├── exp-042-onboarding-checklist.md       # Actief: onboarding-checklisttest vs. lege-toestandtest
│   │   └── exp-043-pricing-page-cta.md           # Actief: prijspagina CTA kopieertest
│   ├── completed/
│   │   ├── exp-039-search-ranking.md             # Voltooid: zoekrangschikkingsalgorithmetest — +12% P1 klik
│   │   ├── exp-040-email-nudge-timing.md         # Voltooid: e-mailprompttimingest — geen significant resultaat
│   │   └── exp-041-trial-length.md               # Voltooid: 14 vs 30-daagse proefversie — 30 dagen wint (p=0,03)
│   └── hypothesis-backlog.md                     # Ongeteste hypothesen — gerangschikt op verwacht effect
├── launches/
│   ├── _launch-checklist-template.md             # Canonieke lanceringchecklist — engineering, ontwerp, communicatie, ondersteuning
│   ├── active/
│   │   ├── launch-bulk-export/
│   │   │   ├── launch-plan.md                    # Volledig lanceringplan — tijdlijn, eigenaren, risico's, uitrol
│   │   │   ├── comms-plan.md                     # Communicatieplan — opmerkingen vrijgeven, blog, in-app, e-mail, Slack
│   │   │   ├── support-brief.md                  # Ondersteuningsbrief — veelgestelde vragen, grensgevallen, bekende beperkingen
│   │   │   └── go-nogo-checklist.md              # Go/no-go besluitvormingschecklist voor lanceringdag
│   │   └── launch-notification-center/
│   │       ├── launch-plan.md                    # Lanceringplan — meldingscentrum v2
│   │       └── comms-plan.md                     # Communicatieplan — meldingscentrum v2
│   └── shipped/
│       ├── launch-search-v2-2025-04.md           # Zoekopdracht v2 lanceringsretrospectief en metriek 30 dagen erna
│       └── launch-team-permissions-2025-02.md    # Lancering teampermissies retrospectief
├── competitive/
│   ├── landscape-overview.md                     # Concurrentiellandschap — positioneringmatrix, sleutelverschilpunten
│   ├── competitor-profiles/
│   │   ├── competitor-acme-corp.md               # Concurrentprofiel — Acme Corp (primaire concurrent)
│   │   ├── competitor-rival-io.md                # Concurrentprofiel — Rival.io (opkomend risico)
│   │   └── competitor-legacy-enterprise.md       # Concurrentprofiel — Legacy Enterprise (zittende partij)
│   ├── teardowns/
│   │   ├── teardown-acme-onboarding-2025-05.md   # UX-teardown — Acme Corp onboarding-flow
│   │   ├── teardown-rival-pricing-2025-04.md     # Prijzingteardown — Rival.io prijspagina en lagen
│   │   └── teardown-legacy-api-2025-03.md        # API-teardown — Legacy Enterprise-ontwikkelingservaring
│   └── battlecards/
│       ├── battlecard-acme-corp.md               # Verkoopbattlecard — bezwaren, verschilpunten, vallen
│       └── battlecard-rival-io.md                # Verkoopbattlecard — Rival.io
└── metrics/
    ├── north-star.md                             # North star metriek — definitie, huidige waarde, doel, eigenaar
    ├── product-health-dashboard.md               # Wekelijks productgezondheidsmomentopname — alle kernKPI's
    ├── feature-success-metrics/
    │   ├── metrics-onboarding-revamp.md          # Succesmetriek — onboarding herziening (activeringspercentage, TTV)
    │   ├── metrics-bulk-export.md                # Succesmetriek — bulkexport (opstellingsfrequentie)
    │   └── metrics-notification-center.md        # Succesmetriek — meldingscentrum (openingspercentage, CTR)
    ├── amplitude-queries/
    │   ├── query-activation-funnel.md            # Opgeslagen Amplitude-query — activeringstrechterstappen
    │   ├── query-feature-adoption.md             # Opgeslagen Amplitude-query — functieopstelling per cohort
    │   └── query-retention-by-segment.md         # Opgeslagen Amplitude-query — D1/D7/D30 retentie per segment
    └── retrospectives/
        ├── metrics-review-q2-2025.md             # Q2 metrieken retrospectief — overwinningen, misses, lessen
        └── metrics-review-q1-2025.md             # Q1 metrieken retrospectief
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/prd-draft.md` | Slash-commando dat een functieidee neemt, `prds/_prd-template.md`, `roadmap/prioritization-framework.md` en relevante persoonlijkheidsbestanden leest, en vervolgens een volledige PRD voert uit met probleemstelling, doelen, gebruikersverhalen, vereisten, succesmetriek en openstaande vragen |
| `.claude/commands/experiment-design.md` | Slash-commando dat `experiments/_experiment-template.md` en de relevante PRD leest, en vervolgens een volledig ontworpen experiment voert uit met hypothese, controle/variant definitie, primaire en waarborgunzekerheidsmetriek, minimum detecteerbaar effect en geschatte steekproefgrootte |
| `.claude/commands/launch-plan.md` | Slash-commando dat de actieve PRD en `launches/_launch-checklist-template.md` leest, en vervolgens een lanceringplan genereert met tijdlijn, cross-functionele eigenaren, communicatieplan, ondersteuningsbrief en go/no-go criteria |
| `roadmap/prioritization-framework.md` | Scoringsregels en wegingen voor RICE of ICE — gebruikt door Claude bij het rangschikken van backlog-items of het beantwoorden van "zouden we dit moeten bouwen?" vragen; handhaaft scoringsconsistentie over kwartalen |
| `prds/active/` | Één bestand per in-flight functie — PRD's hier zijn live-documenten gewijzigd wanneer besluiten veranderen; nooit verwijderen, `archived/` voor geannuleerde functies gebruiken |
| `research/personas/persona-power-user.md` | Bron-van-waarheid persoonlijkheid waarnaar in PRD's en experimenthypothesen wordt verwezen — bijgewerkt na elke grote onderzoeksronde |
| `experiments/hypothesis-backlog.md` | Ongeteste hypothesen gerangschikt op verwacht effect — Claude leest dit wanneer hem wordt gevraagd experimentroutekaarten te prioriteren |
| `metrics/north-star.md` | Enkele gezaghebbende definitie van north star metriek — Claude leest dit vóór elke metrieken analyse om consistente framing te garanderen |
| `competitive/landscape-overview.md` | Huidige positioneringmatrix — Claude leest dit bij het opstellen van concurrentiële teardowns of battlecards om bestaande positioneringverlenging te voorkomen |
| `launches/active/` | Eén submap per in-flight lancering, elk bevattende lanceringplan, communicatieplan, ondersteuningsbrief en go/no-go checklist als afzonderlijke bestanden |

## Snelle steiger

```bash
# Werkruimtebasis maken
mkdir -p product-manager-workspace
cd product-manager-workspace

# .claude-structuur maken
mkdir -p .claude/commands

# Alle werkruimtemappen maken
mkdir -p roadmap
mkdir -p prds/active
mkdir -p prds/shipped
mkdir -p prds/archived
mkdir -p research/interviews
mkdir -p research/surveys
mkdir -p research/usability
mkdir -p research/personas
mkdir -p experiments/active
mkdir -p experiments/completed
mkdir -p launches/active
mkdir -p launches/shipped
mkdir -p competitive/competitor-profiles
mkdir -p competitive/teardowns
mkdir -p competitive/battlecards
mkdir -p metrics/feature-success-metrics
mkdir -p metrics/amplitude-queries
mkdir -p metrics/retrospectives

# Zaadsleutel sjabloon en ankerbestanden
touch prds/_prd-template.md
touch research/_interview-guide-template.md
touch experiments/_experiment-template.md
touch launches/_launch-checklist-template.md
touch roadmap/prioritization-framework.md
touch roadmap/feature-backlog.md
touch roadmap/now-next-later.md
touch roadmap/deprioritized-log.md
touch metrics/north-star.md
touch metrics/product-health-dashboard.md
touch competitive/landscape-overview.md

# Zaad .claude commandobestanden
touch .claude/commands/prd-draft.md
touch .claude/commands/user-story.md
touch .claude/commands/experiment-design.md
touch .claude/commands/launch-plan.md
touch .claude/commands/competitive-teardown.md
touch .claude/commands/sprint-review.md
touch .claude/commands/discovery-interview.md

# Zaad de CLAUDE.md
touch .claude/CLAUDE.md
touch .claude/settings.json

# Installeer Claude Code-vaardigheden
npx claudient add skill product/product-roadmap
npx claudient add skill product/user-story-writer
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add skill product/competitive-teardown
npx claudient add skill product/persona-builder
npx claudient add skill product/product-analytics
npx claudient add skill product/product-strategist
```

## CLAUDE.md sjabloon

```markdown
# Product Manager Werkruimte

Deze werkruimte ondersteunt een productmanager die verantwoordelijk is voor onderzoek, routekaart, levering en launches.
Claude Code leest context uit gestructureerde bestanden hier om nauwkeurige, productspecifieke outputs
te produceren — niet algemene PM-adviezen. Lees altijd de geraadpleegde bronbestanden voordat u
een document genereert.

---

## Wat dit is

Een Claude Code-werkruimte voor een PM. Elke map komt overeen met een kernwerkstroom van PM: routekaartpriorisering, PRD-schrijven, onderzoekssynthese voor gebruikers, experimentontwerp, lanceringcoördinatie, concurrentieanalyse en metrieken bijhouden. Claude leest uit deze bestanden en schrijft concepten, analyses en gestructureerde outputs terug in dezelfde structuur.

---

## Stack

- Linear — routekaart en sprinttracking (MCP: linear)
- Figma — ontwerpreview en specverwijzingen (MCP: figma)
- Notion of Confluence — PRD's en teamdocumenten
- Amplitude of Mixpanel — productanalytica, trechters, retentie
- Dovetail — onderzoeksopslagplaats voor gebruikers en inzichttagging
- Jira — enterprise sprintborden (wanneer organisatie dit vereist)
- Slack — belanghebber comms en lanceringcoördinatie (MCP: slack)
- Loom — async-demoopnames en sprintreviews

---

## Mappenafspraken

- `roadmap/` — Routekaartbestanden zijn vernoemd per kwartaal: `quarterly-roadmap-Q3-2025.md`.
  `prioritization-framework.md` is de bron van waarheid voor scoringsbeslissingen. Nooit deprioriteerde items verwijderen —
  log ze in `deprioritized-log.md` met reden en datum.
- `prds/` — Één bestand per functie. Actieve PRD's leven in `active/`, verzonden in `shipped/`,
  geannuleerd in `archived/`. Gebruik `_prd-template.md` voor elke nieuwe PRD. Sla secties niet over.
- `research/` — Interviewnotities gaan in `interviews/<study-name>/notes-p<n>-YYYY-MM-DD.md`.
  Elke studie heeft `research-plan.md` en `synthesis-report.md` nodig voordat deze sluit.
- `experiments/` — Actieve experimenten in `active/`, voltooid in `completed/`. Elk
  experimentdoc moet hypothese, metriek, steekproefgrootteverantwoording en resultaten bevatten.
  Nulresultaten zijn geen mislukkingen — file ze correct in `completed/`.
- `launches/` — Elke lancering krijgt zijn eigen submap onder `active/`. Een lanceringmap
  moet bevatten: `launch-plan.md`, `comms-plan.md`, `support-brief.md`, `go-nogo-checklist.md`.
  Verplaats naar `shipped/` met een retrospectieveopmerking na lancering.
- `competitive/` — `landscape-overview.md` wordt driemaandelijks bijgewerkt. Teardowns zijn momentopnamen uit bepaalde momenten —
  noem ze `teardown-<competitor>-<area>-YYYY-MM.md`.
- `metrics/` — `north-star.md` definieert de enige north star metriek. Nooit dit
  definitie in experimentdocs of PRD succesmetrieken secties tegenspreken.

---

## Veelgestelde taken — exacte commando's

### PRD en specs
```
/prd-draft                — Concept-PRD van functieidee met canonieke sjabloon
/user-story               — Genereer gebruikersverhalen uit PRD of brief
```

### Onderzoek
```
/discovery-interview      — Genereer interviewgids van onderzoeksdoelstelling en persoonlijkheid
```

### Experimenten
```
/experiment-design        — Ontwerp A/B of multivariate test met hypothese en steekproefgrootte
```

### Launches
```
/launch-plan              — Bouw lanceringchecklist en communicatieplan van actieve PRD
```

### Competitief
```
/competitive-teardown     — Teardown van concurrentieel product — UX, prijsstelling, positioneringsgaten
```

### Sprintritme
```
/sprint-review            — Compileer sprintreview-verslag van Linear-tickets en metriek
```

---

## Afspraken Claude moet volgen

- Lees altijd `roadmap/prioritization-framework.md` voordat u functies score of rangschikt.
  Vind niet uit eigen beweging een scoringsmethodologie.
- Lees altijd `metrics/north-star.md` voordat u succesmetriek in enig PRD of experiment schrijft.
  Succesmetriek moet naar north star klimmen.
- PRD's moeten `prds/_prd-template.md` exact volgen — sla de openstaande vragen sectie niet over
  of de ondertekeningtabel.
- Experimenthypothesen moeten het volgende formaat volgen: "Wij geloven dat [change] zal [outcome] voor
  [user segment], gemeten door [metric], omdat [rationale]."
- Syntheserapporten voor onderzoek moeten directe citaten onderscheiden van ingestelde thema's.
  Citaten gebruiken aanhalingstekens en een deelnemer-ID (bijv. P3). Thema's gebruiken geen aanhalingstekens.
- Concurrentieteardowns moeten eerst `competitive/landscape-overview.md` lezen om te voorkomen dat
  bestaande positioneringverlenging tegen elkaar in werkt.
- Persoonlijkheidsbestanden in `research/personas/` zijn de canonieke gebruikersbeschrijvingen. Verwijzen ernaar
  op naam in PRD's en experimenthypothesen — vind niet uit eigen beweging nieuwe persoonlijkheden inline.
- Schrijf nooit een aanbeveling voor go-live zonder `go-nogo-checklist.md` voor die lancering te lezen.
```

## MCP-servers

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
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
        "/Users/you/product-manager-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prds/active/\" && echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prd-\"; then echo \"[PRD hook] PRD geschreven — bevestig dat ondertekeningtabel ingevuld is en succesmetriek naar metrics/north-star.md verwijst.\"; fi'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"experiments/completed/\"; then echo \"[Experiment hook] Experiment ingediend als voltooid — bevestig dat resultaten sectie p-waarde of betrouwbaarheidsinterval en schip/herhaal/kill aanbeveling bevat.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] Als u roadmap/feature-backlog.md of metrics/north-star.md bijgewerkt, bevestig dat wijzigingen overeenstemmen met de huidige kwartaalroutekaart en belanghebbenden zijn ingelicht.\"'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

```bash
npx claudient add skill product/product-roadmap
npx claudient add skill product/user-story-writer
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add skill product/competitive-teardown
npx claudient add skill product/persona-builder
npx claudient add skill product/product-analytics
npx claudient add skill product/product-strategist
```

## Gerelateerd

- [Gids: Claude voor productmanagers](../guides/for-product-manager.md)
- [Werkstroom: PRD-schrijven](../workflows/prd-writing.md)
- [Werkstroom: Lanceringcoördinatie](../workflows/launch-coordination.md)
- [Werkstroom: Onderzoekssynthese voor gebruikers](../workflows/user-research-synthesis.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
