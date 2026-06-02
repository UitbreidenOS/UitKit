# UX Designer Workspace — Projectstructuur

> Voor UX-ontwerpers die end-to-end onderzoek, interactieontwerp, prototyping en developer handoff uitvoeren — optimalisering van de volledige workflow van gebruikersgesprek tot verzonden spec.

## Stack

- **Ontwerp + prototyping + handoff:** Figma (desktop-app + Dev Mode)
- **Onderzoeksrepository:** Dovetail — tagging, synthese, inzichttracering
- **Gebruiksvaardigheidstest:** Maze (ongeleid) of UserTesting (geleide)
- **Onderzoeksdocs + projectnotities:** Notion
- **Workshops + customer journey maps:** Miro
- **Design system-documentatie:** Zeroheight
- **Communicatie:** Slack
- **Versiebeheer:** Git + GitHub (voor deze workspace, gekoppelde specs en CLAUDE.md)

## Directoryboom

```
my-ux-workspace/
├── .claude/
│   ├── commands/                          # slash commands beschikbaar in dit project
│   │   ├── ux-audit.md                    # /ux-audit <product-area> — heuristieke + toegankelijkheidsteste
│   │   ├── research-plan.md               # /research-plan — ontwerp studieplan, screener, discussieguide
│   │   ├── persona-update.md              # /persona-update — update persona van nieuwe onderzoekssignalen
│   │   ├── usability-test.md              # /usability-test — ontwerp testscript, taken, succesmaatstaven
│   │   ├── design-critique.md             # /design-critique — gestructureerde kritiek tegen ontwerpprincipes
│   │   ├── accessibility-check.md         # /accessibility-check — WCAG 2.2 AA audit voor gegeven flow
│   │   └── handoff-checklist.md           # /handoff-checklist — genereer dev handoff checklist per feature
│   ├── settings.json                      # hooks, MCP server refs, permissions
│   └── mcp.json                           # MCP server configs (figma, notion, slack)
├── research/                              # alle primaire onderzoeken, ingedeeld per ronde
│   ├── round-01-onboarding/               # naamgeving: round-<NN>-<topic>
│   │   ├── screener.md                    # screener criteria en vragen deelnemers
│   │   ├── discussion-guide.md            # moderatorguide met probes en taken
│   │   ├── participants.md                # geanonimiseerde deelnemerslijst (P01–P08)
│   │   ├── sessions/
│   │   │   ├── P01-interview-notes.md     # ruwe notities per deelnemer
│   │   │   ├── P02-interview-notes.md
│   │   │   ├── P03-interview-notes.md
│   │   │   └── P04-interview-notes.md
│   │   ├── survey-results.csv             # Maze of UserTesting export (indien van toepassing)
│   │   └── synthesis/
│   │       ├── affinity-clusters.md       # getagde thema's van Dovetail export
│   │       ├── key-findings.md            # top 5–8 bevindingen met bewijscitaten
│   │       └── opportunity-areas.md       # HMW-statements afgeleid van bevindingen
│   ├── round-02-checkout-flow/
│   │   ├── screener.md
│   │   ├── discussion-guide.md
│   │   ├── participants.md
│   │   ├── sessions/
│   │   │   ├── P01-interview-notes.md
│   │   │   └── P02-interview-notes.md
│   │   └── synthesis/
│   │       ├── affinity-clusters.md
│   │       ├── key-findings.md
│   │       └── opportunity-areas.md
│   └── competitive/                       # competitor teardowns
│       ├── competitor-teardown-stripe.md  # gestructureerde teardown: flows, patterns, sterken, gaten
│       └── competitor-teardown-square.md
├── personas/                              # user personas en jobs-to-be-done
│   ├── persona-maya-growth-lead.md        # primaire persona — bijgewerkt naarmate onderzoek accumuleert
│   ├── persona-alex-ops-manager.md        # secundaire persona
│   ├── persona-riley-end-user.md          # tertiaire persona
│   ├── jobs-to-be-done.md                 # JTBD-statements gekoppeld aan elke persona
│   └── persona-changelog.md              # log van wanneer en waarom elke persona is herzien
├── journey-maps/                          # experience maps — huidige en toekomstige staat
│   ├── current-state/
│   │   ├── onboarding-journey-current.md  # huidige staat map met pijnpunten en momenten van vreugde
│   │   ├── checkout-journey-current.md
│   │   └── settings-journey-current.md
│   └── future-state/
│       ├── onboarding-journey-future.md   # aspirationele flow na herziening
│       └── checkout-journey-future.md
├── wireframes/                            # Figma-bestandskoppelingen en annotatiedocs
│   ├── onboarding-flow/
│   │   ├── figma-link.md                  # canonieke Figma URL + laatste wijzigingsdatum
│   │   ├── annotations.md                 # scherm-voor-scherm aantekeningen voor devs
│   │   └── design-decisions.md           # waarom belangrijke beslissingen zijn genomen (niet gewoon wat)
│   ├── checkout-flow/
│   │   ├── figma-link.md
│   │   ├── annotations.md
│   │   └── design-decisions.md
│   ├── settings-redesign/
│   │   ├── figma-link.md
│   │   ├── annotations.md
│   │   └── design-decisions.md
│   └── explorations/                      # early-stage, ongepolijste concepten
│       ├── nav-restructure-v1.md
│       └── dashboard-widget-concepts.md
├── usability-tests/                       # geleide en ongeleid test artefacten
│   ├── 2026-05-onboarding-maze/
│   │   ├── test-plan.md                   # doelstellingen, methodologie, deelnemercriteria
│   │   ├── task-scripts.md                # exacte taakprompts gegeven aan deelnemers
│   │   ├── session-notes/
│   │   │   ├── P01-session.md
│   │   │   └── P02-session.md
│   │   ├── maze-export.csv                # ruwe voltooiingspercentages, click maps, tijd-op-taak
│   │   └── findings-report.md            # bevindingen geclassificeerd op ernst, met ontwerpbevorderingen
│   ├── 2026-03-checkout-usertesting/
│   │   ├── test-plan.md
│   │   ├── task-scripts.md
│   │   ├── session-notes/
│   │   │   ├── P01-session.md
│   │   │   └── P02-session.md
│   │   └── findings-report.md
│   └── templates/
│       ├── test-plan-template.md          # herbruikbare testplan scaffold
│       ├── task-script-template.md        # standaard taakpromptformaat
│       └── findings-report-template.md    # ernst-geclassificeerd bevindingsformaat
├── design-system/                         # componentendocumentatie en besluithistorie
│   ├── components/
│   │   ├── button.md                      # gebruiksregels, varianten, do/don't voorbeelden, Figma-koppeling
│   │   ├── form-inputs.md
│   │   ├── modal.md
│   │   ├── navigation.md
│   │   ├── data-table.md
│   │   └── toast-notifications.md
│   ├── foundations/
│   │   ├── color.md                       # kleurentokens, contrastratio's, gebruiksregels
│   │   ├── typography.md                  # typeschaal, gebruiksgidans, toegankelijkheidsnoten
│   │   ├── spacing.md                     # afstandschaal en wanneer af te wijken
│   │   ├── icons.md                       # pictogrambibliotheekbron, naamconventies
│   │   └── motion.md                      # animatieprincipes, duurtoken, gereduceerde beweging
│   ├── patterns/
│   │   ├── empty-states.md               # wanneer, welke inhoud, CTA-gidans
│   │   ├── error-handling.md             # fouttypen, berichtschrijving, herstelpatronen
│   │   └── loading-states.md             # skeletschermen, spinners, progressieve openbaarmaking
│   ├── decision-log.md                    # ADR-stijl record van design system besluiten
│   └── zeroheight-link.md                # canonieke Zeroheight URL voor gepubliceerde systeemsdocs
├── handoff/                               # per-feature dev handoff pakketten
│   ├── feature-onboarding-v2/
│   │   ├── figma-link.md                  # Dev Mode koppeling naar het specifieke Figma-frame
│   │   ├── spec-annotations.md           # componentspecs, afstand, staten, interacties
│   │   ├── edge-cases.md                 # lege staten, fouten, laden, permissie edge cases
│   │   ├── acceptance-criteria.md        # testbare criteria voor QA en engineering sign-off
│   │   └── open-questions.md             # onopgeloste vragen die eng input nodig hebben
│   ├── feature-checkout-redesign/
│   │   ├── figma-link.md
│   │   ├── spec-annotations.md
│   │   ├── edge-cases.md
│   │   ├── acceptance-criteria.md
│   │   └── open-questions.md
│   └── templates/
│       ├── spec-annotations-template.md  # scaffold voor nieuwe handoff pakketten
│       └── acceptance-criteria-template.md
├── .env.example                           # Figma token, Notion token — commit .env nooit
└── CLAUDE.md                              # projectinstructies voor Claude Code
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/ux-audit.md` | Slash command die een productgebied aanneemt, een heuristieke evaluatie uitvoert tegen Nielsen's 10 en WCAG 2.2 AA, en voert een ernst-geclassificeerde bevindingslijst uit |
| `.claude/commands/handoff-checklist.md` | Genereert een per-feature checklist met specaantekeningen, edge cases, acceptatiecriteria, toegankelijkheidsnoten en open vragen |
| `research/round-<NN>-<topic>/synthesis/key-findings.md` | Primaire uitvoering van elke onderzoeksronde — 5–8 bevindingen met ondersteunende bewijscitaten en betrouwbaarheidsniveaus |
| `personas/persona-changelog.md` | Controleerbare log van elke personaherziening, welke onderzoeksronde het heeft geactiveerd, en wat is gewijzigd — voorkomt persona drift |
| `usability-tests/templates/findings-report-template.md` | Standaard ernst-geclassificeerd bevindingsformaat (Kritiek / Groot / Klein / Observatie) met ontwerpaanbevelingskolom |
| `design-system/decision-log.md` | ADR-stijl record van waarom design system besluiten zijn genomen — essentiële context voor toekomstige componentwijzigingen |
| `handoff/feature-<name>/acceptance-criteria.md` | Testbare, ondubbelzinnige criteria voor engineering en QA — elk criterium is gekoppeld aan een specifieke interactie of staat |
| `wireframes/<flow>/design-decisions.md` | Documenteert de redenering achter belangrijke ontwerpselecties — niet een beschrijving van het ontwerp, maar het waarom erachter |

## Snelle scaffold

```bash
# Create the workspace directory and enter it
mkdir my-ux-workspace && cd my-ux-workspace
git init

# Create Claude Code config directories and command files
mkdir -p .claude/commands

# Touch all slash command files
touch .claude/commands/ux-audit.md
touch .claude/commands/research-plan.md
touch .claude/commands/persona-update.md
touch .claude/commands/usability-test.md
touch .claude/commands/design-critique.md
touch .claude/commands/accessibility-check.md
touch .claude/commands/handoff-checklist.md

# Research directory — first two rounds as scaffold
mkdir -p research/round-01-onboarding/sessions
mkdir -p research/round-01-onboarding/synthesis
mkdir -p research/round-02-checkout-flow/sessions
mkdir -p research/round-02-checkout-flow/synthesis
mkdir -p research/competitive
touch research/round-01-onboarding/{screener.md,discussion-guide.md,participants.md}
touch research/round-01-onboarding/synthesis/{affinity-clusters.md,key-findings.md,opportunity-areas.md}

# Personas
mkdir -p personas
touch personas/{persona-maya-growth-lead.md,persona-alex-ops-manager.md,jobs-to-be-done.md,persona-changelog.md}

# Journey maps
mkdir -p journey-maps/current-state journey-maps/future-state
touch journey-maps/current-state/onboarding-journey-current.md
touch journey-maps/future-state/onboarding-journey-future.md

# Wireframes
mkdir -p wireframes/{onboarding-flow,checkout-flow,settings-redesign,explorations}
for dir in wireframes/onboarding-flow wireframes/checkout-flow wireframes/settings-redesign; do
  touch "$dir"/{figma-link.md,annotations.md,design-decisions.md}
done

# Usability tests
mkdir -p usability-tests/2026-05-onboarding-maze/session-notes
mkdir -p usability-tests/templates
touch usability-tests/2026-05-onboarding-maze/{test-plan.md,task-scripts.md,findings-report.md}
touch usability-tests/templates/{test-plan-template.md,task-script-template.md,findings-report-template.md}

# Design system
mkdir -p design-system/{components,foundations,patterns}
touch design-system/components/{button.md,form-inputs.md,modal.md,navigation.md,data-table.md,toast-notifications.md}
touch design-system/foundations/{color.md,typography.md,spacing.md,icons.md,motion.md}
touch design-system/patterns/{empty-states.md,error-handling.md,loading-states.md}
touch design-system/{decision-log.md,zeroheight-link.md}

# Handoff
mkdir -p handoff/{feature-onboarding-v2,feature-checkout-redesign,templates}
for dir in handoff/feature-onboarding-v2 handoff/feature-checkout-redesign; do
  touch "$dir"/{figma-link.md,spec-annotations.md,edge-cases.md,acceptance-criteria.md,open-questions.md}
done
touch handoff/templates/{spec-annotations-template.md,acceptance-criteria-template.md}

# Env template
cat > .env.example <<'EOF'
FIGMA_ACCESS_TOKEN=your-figma-personal-access-token
FIGMA_TEAM_ID=your-figma-team-id
NOTION_API_KEY=secret_your-notion-integration-token
NOTION_RESEARCH_DB_ID=your-notion-database-id
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_TEAM_ID=T0XXXXXXXXX
EOF

# .gitignore
cat > .gitignore <<'EOF'
.env
.DS_Store
*.csv
!usability-tests/**/*.csv
EOF

# Install Claude Code skills
npx claudient add skill product/ux-audit
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/competitive-teardown

git add .
git commit -m "chore: initial ux designer workspace scaffold"
```

## CLAUDE.md sjabloon

```markdown
# UX Designer Workspace

Dit is een UX-ontwerp workspace die de volledige onderzoeks-naar-handoff workflow dekt:
gebruikersgesprekken, personabeheer, customer journey mapping, draadmodel-annotatie,
gebruiksvaardigheidstest, design system documentatie, en developer handoff.

De canonieke bron van waarheid voor elk artefacttype:
- Research synthese: `research/<round>/synthesis/key-findings.md`
- Personas: `personas/persona-<name>.md` (zie changelog voor revisiegeschiedenis)
- Ontwerpselecties: `wireframes/<flow>/design-decisions.md`
- Dev specs: `handoff/<feature>/spec-annotations.md`
- Design system rationale: `design-system/decision-log.md`

---

## Stack

- Ontwerp + prototyping: Figma (Dev Mode voor handoff)
- Onderzoeksrepository: Dovetail (synthese, tagging, inzichtsopslag)
- Gebruiksvaardigheidstest: Maze (ongeleid), UserTesting (geleide)
- Docs + projectnotities: Notion
- Workshops + customer journey maps: Miro
- Design system docs: Zeroheight
- Communicatie: Slack

---

## Algemene taken en exacte commando's

| Taak | Commando |
|---|---|
| Controleer een productgebied op UX-problemen | `/ux-audit <product-area>` |
| Ontwerp een onderzoeksstudieplan | `/research-plan` |
| Update een persona van nieuwe bevindingen | `/persona-update <persona-filename> — <summary of new findings>` |
| Schrijf een gebruiksvaardigheidstest script | `/usability-test <flow-name>` |
| Voer een ontwerpcritique uit | `/design-critique <figma-link or flow-name>` |
| Controleer een flow op WCAG 2.2 AA naleving | `/accessibility-check <flow-name>` |
| Genereer een dev handoff checklist | `/handoff-checklist <feature-name>` |

---

## Onderzoeksconventies

- Ronde directories: `research/round-<NN>-<topic>/` — zero-padded, kebab-case onderwerp
- Deelnemers: altijd geanonimiseerd als P01, P02, enz. — gebruik nooit echte namen in bestanden
- Sessienotities: ruw en onbewerkt — synthese gebeurt in de `synthesis/` submap
- Bevindingen zijn geclassificeerd op ernst: Kritiek / Groot / Klein / Observatie
- Elke bevinding moet minstens één deelnemercitaat of gegevenspunt als bewijs citeren
- Dovetail is het systeem van record — notities hier zijn de werkende kopie voor Claude om te lezen

---

## Persona-conventies

- Persona-bestanden: `persona-<first-name>-<role-slug>.md` (bijv. `persona-maya-growth-lead.md`)
- Elke update moet geregistreerd worden in `persona-changelog.md` met de activerende onderzoeksronde
- Jobs-to-be-done statements live in `jobs-to-be-done.md`, niet in persona bestanden
- Verzin geen nieuwe personaattributen zonder ondersteunend onderzoeksbewijs

---

## Draadmodel en ontwerpselectie conventies

- `figma-link.md` moet bevatten: URL, Figma bestandsnaam, framenaam, laatst gewijzigde datum
- `annotations.md`: scherm-voor-scherm, met verwijzing naar componentnamen uit het design system
- `design-decisions.md`: geschreven als "We kozen X boven Y omdat Z" — niet een beschrijving van de UI
- Dupliceer nooit ontwerpselecties in bestanden — koppel terug naar `design-decisions.md`

---

## Handoff-conventies

- Één directory per feature: `handoff/feature-<slug>/`
- `spec-annotations.md` moet dekken: afstand, staten (standaard/hover/focus/disabled/error), responsief gedrag
- `edge-cases.md` moet dekken: lege staat, foutstaat, laadstaat, toestemmingsbeperkte staat
- `acceptance-criteria.md`: elk criterium begint met "Given / When / Then" of een testbare bewering
- `open-questions.md`: tag elk item met `[ENG]`, `[DESIGN]`, of `[PM]` om eigenaar aan te geven

---

## Toegankelijkheidsnormen

- Minimumnorm: WCAG 2.2 Niveau AA voor alle verzonden flows
- Kleurcontrast: 4.5:1 voor normale tekst, 3:1 voor grote tekst en UI-componenten
- Interactieve elementen: moeten focusindicatoren, toetsenbordoperabiliteit en ARIA-labels hebben
- Beweging: alle animaties moeten `prefers-reduced-motion` respecteren
- Voer `/accessibility-check` uit vóór elke handoff

---

## Design system-conventies

- Componentendocs live in `design-system/components/<component>.md`
- Besluitlog gebruikt ADR-formaat: Context / Decision / Consequences
- Wijzig nooit de gebruiksregels van een component zonder een ingang in `design-system/decision-log.md`
- Zeroheight is de gepubliceerde bron — `design-system/` is de werkende concept

---

## Doe niet

- Schrijf geen deelnemernamen in enig bestand — gebruik P01, P02, enz.
- Commit `.env` niet — Figma en Notion tokens zijn gevoelig
- Maak geen handoff pakketten zonder eerst `/accessibility-check` uit te voeren
- Wijzig `personas/` niet zonder de wijziging te registreren in `persona-changelog.md`
- Beschrijf geen UI in `design-decisions.md` — leg de redenering uit, niet de pixels
```

## MCP servers

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-personal-access-token",
        "FIGMA_TEAM_ID": "your-figma-team-id"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token",
        "NOTION_RESEARCH_DB_ID": "your-notion-research-database-id"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */personas/*.md && \"$CLAUDE_TOOL_INPUT_FILE_PATH\" != */persona-changelog.md ]]; then echo \"[hook] Persona bestand bijgewerkt — onthoud deze wijziging in persona-changelog.md te registreren\" >&2; fi'",
            "async": true
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */handoff/*/acceptance-criteria.md ]]; then echo \"[hook] Handoff criteria geschreven — voer /accessibility-check uit vóór u deze feature klaar markeert.\" >&2; fi'",
            "async": true
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */sessions/*-interview-notes.md ]]; then if grep -qiE \"\\b(full name|surname|[A-Z][a-z]+ [A-Z][a-z]+)\\b\" <<< \"$CLAUDE_TOOL_INPUT_NEW_STRING\" 2>/dev/null; then echo \"PII WAARSCHUWING: mogelijke echte naam gedetecteerd in sessienotities. Gebruik P01, P02, enz. in plaats daarvan.\" >&2; exit 1; fi; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills installeren

```bash
npx claudient add skill product/ux-audit
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/competitive-teardown
```

## Gerelateerd

- [Guide: Claude for UX Designers](../guides/for-ux-designer.md)
- [Workflow: Research to Handoff](../workflows/research-to-handoff.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
