# Finance Analyst / CFO Workspace — Projectstructuur

> Voor een financial analyst of CFO die financiële modellering, maandsluitingen, boardpack-creatie, scenario planning en investeerderrapportage beheert — allemaal aangestuurd vanuit een enkele Claude Code workspace.

## Stack

- Excel / Google Sheets — 3-statement modellen, DCF, budget versus werkelijk, scenario modellen
- QuickBooks, Xero, of NetSuite — grootboek, schulden/vorderingen, journaalposten, proefbalans
- Notion of Confluence — boekhoudkundige beleidslijnen, close checklists, teamdocumentatie
- Carta — kapitaaltabel, optiepools, verdunningsmodellering, 409A-gegevens
- Slack — close procescoördinatie, boardprep communicatie, investeerder Q&A
- PowerPoint of Google Slides — boarddecks, investeerderupdates, managementrapportages

## Mappen structuur

```
finance-analyst-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Werkspacehandleidingen voor Claude Code
│   ├── settings.json                          # Machtigingen, hooks, MCP-configuratie
│   └── commands/
│       ├── variance-analysis.md               # Periodieke variantierapporten — budget versus werkelijk met commentaar
│       ├── model-update.md                    # 3-statement model bijwerken met nieuwste werkelijke gegevens
│       ├── board-pack.md                      # Boarddeck samenstellen — financiën, KPI's, narratief
│       ├── close-checklist.md                 # Maandeindsluit takenlijst met statusvolging
│       ├── scenario-model.md                  # Scenarioplanning — basis- / bull- / bear-cases
│       ├── investor-update.md                 # Investeerderupdatebericht — metrieken, narratief, vragen
│       └── budget-reforecast.md               # Driemaandelijkse herprognose — rollende 4Q met aannames
├── models/
│   ├── 3-statement/
│   │   ├── 3-statement-model-2025.xlsx        # Geïntegreerd winst- en verliesrekening, balans, cashflow model
│   │   ├── 3-statement-model-2024.xlsx        # Vorig jaar model — gearchiveerde referentie
│   │   ├── assumptions-log.md                 # Belangrijkste aanstuurvariabelen en veranderingsgeschiedenis
│   │   └── monthly-actuals-feed.csv           # Export van QuickBooks/Xero voor modelupdates
│   ├── dcf/
│   │   ├── dcf-model-current.xlsx             # Discounted cashflow — WACC, eindwaarde, IRR
│   │   ├── wacc-calculation.xlsx              # WACC berekening — kostprijs eigen vermogen, kostprijs vreemd vermogen, beta
│   │   ├── sensitivity-table.xlsx             # Omzetgroei versus EBITDA marge gevoeligheidsoutput
│   │   └── dcf-assumptions.md                 # Narratief achter DCF-inputs — groei, marges, WACC
│   ├── budget-vs-actual/
│   │   ├── bva-2025-ytd.xlsx                  # JTD budget versus werkelijk per kostenplek en regelitem
│   │   ├── bva-template.xlsx                  # Lege BvA sjabloon voor nieuwe periodes
│   │   ├── variance-commentary-jan-2025.md    # Variantienarratief — Jan 2025 managementpakket
│   │   ├── variance-commentary-feb-2025.md    # Variantienarratief — Feb 2025 managementpakket
│   │   ├── variance-commentary-mar-2025.md    # Variantienarratief — Maart 2025 managementpakket
│   │   └── variance-threshold-policy.md       # Beleid: welk variantiepercentage leidt tot verplicht commentaar
│   └── scenario/
│       ├── scenario-model-q2-2025.xlsx        # Basis / bull / bear scenario model — Q2 2025
│       ├── scenario-model-q3-2025.xlsx        # Q3 2025 scenario model — bijgewerkt na sluiting
│       ├── macro-assumptions.md               # Externe aannames: rente, valutakoers, marktomstandigheden
│       └── scenario-summary-template.xlsx     # Eenpagina scenariosamenvatting voor board en investeerders
├── reports/
│   ├── board-packs/
│   │   ├── board-pack-q1-2025.pptx            # Q1 2025 boardpack — financiën + KPI's + narratief
│   │   ├── board-pack-q2-2025.pptx            # Q2 2025 boardpack
│   │   ├── board-pack-template.pptx           # Hoofdsjabloon — goedgekeurde indeling en branding
│   │   └── board-pack-data-q2-2025.xlsx       # Ondersteunend gegevensbestand voor Q2 boardpack grafieken
│   ├── investor-updates/
│   │   ├── investor-update-may-2025.md        # Maandelijkse investeerderupdatebericht — Mei 2025
│   │   ├── investor-update-jun-2025.md        # Maandelijkse investeerderupdatebericht — Juni 2025
│   │   ├── investor-update-template.md        # Standaard investeerderupdatebericht sjabloon
│   │   └── investor-list.md                   # Huidge investeerderregister — namen, eigendomspercentage, contact
│   └── management-reporting/
│       ├── management-package-jan-2025.xlsx   # Jan 2025 maandelijks managementpakket
│       ├── management-package-feb-2025.xlsx   # Feb 2025 maandelijks managementpakket
│       ├── management-package-mar-2025.xlsx   # Maart 2025 maandelijks managementpakket
│       └── management-package-template.xlsx   # Standaard managementpakket sjabloon
├── close/
│   ├── month-end-close-checklist.md           # Hoofdtakenlijst maandeindsluit met eigenaren
│   ├── close-calendar-2025.md                 # Harde sluitingsdatums, zachte sluitingsdatums, boarddatums
│   ├── journal-entries/
│   │   ├── je-template.csv                    # Standaardformaat voor journaalpostupload in QuickBooks/Xero
│   │   ├── accruals-jan-2025.csv              # Toerekeningsjournaals voor januari 2025
│   │   ├── accruals-feb-2025.csv              # Toerekeningsjournaals voor februari 2025
│   │   ├── accruals-mar-2025.csv              # Toerekeningsjournaals voor maart 2025
│   │   └── prepaid-amortization-schedule.xlsx # Planning vooruit betaalde uitgaven met maandelijkse afschrijving
│   ├── reconciliations/
│   │   ├── bank-recon-jan-2025.xlsx           # Bankrekonciliatie — januari 2025
│   │   ├── bank-recon-feb-2025.xlsx           # Bankrekonciliatie — februari 2025
│   │   ├── ar-aging-jan-2025.xlsx             # Ouderdomsanalyse vorderingen — januari 2025
│   │   ├── ar-aging-feb-2025.xlsx             # Ouderdomsanalyse vorderingen — februari 2025
│   │   ├── intercompany-recon.xlsx            # Intercompany-eliminaties — indien van toepassing
│   │   └── gl-recon-checklist.md              # Checklist voor reconciliatie van grootboekrekeningen en ondertekeningssverificatie
│   └── trial-balance/
│       ├── tb-jan-2025.csv                    # Geëxporteerde proefbalans — januari 2025
│       ├── tb-feb-2025.csv                    # Geëxporteerde proefbalans — februari 2025
│       └── tb-mapping.xlsx                    # Rekeningschema naar financiële-overzicht mapping
├── budgets/
│   ├── annual/
│   │   ├── budget-2025.xlsx                   # Door board goedgekeurd jaarlijks bedrijfsbudget — FY2025
│   │   ├── budget-2025-assumptions.md         # Narratief achter FY2025 budgetregelingen
│   │   ├── budget-2026-draft.xlsx             # FY2026 conceptbudget — in bewerking
│   │   └── budget-approval-log.md             # Goedkeuringsdatums door board, revisiegeschiedenis, ondertekenaren
│   └── reforecasts/
│       ├── reforecast-q1-2025.xlsx            # Q1 2025 herprognose — rollende 4-kwartaal weergave
│       ├── reforecast-q2-2025.xlsx            # Q2 2025 herprognose
│       ├── reforecast-q3-2025.xlsx            # Q3 2025 herprognose
│       └── reforecast-assumptions.md          # Doorlopend log van herprognose aannahmewijzigingen
├── compliance/
│   ├── audit/
│   │   ├── audit-prep-checklist.md            # Voorbereiding jaaraudit — PBC-lijst en status
│   │   ├── pbc-2024.xlsx                      # Door klant voorbereide schema — FY2024 audit
│   │   ├── audit-adjustments-2024.xlsx        # Voorgestelde auditcorrecties en managementrespons
│   │   └── auditor-contact.md                 # Auditornaam, engagement team, contactgegevens
│   ├── tax/
│   │   ├── tax-calendar-2025.md               # Federale en staatsindiening deadlines — FY2025
│   │   ├── r-and-d-credit-analysis.xlsx       # Analyse van O&O-belastingkrediet kwalificatie
│   │   ├── state-nexus-tracker.md             # Staten met nexus — registratie- en indiengingsstatus
│   │   └── 83b-elections-log.md               # Log van ingediende 83(b)-verkiezingen door oprichters/werknemers
│   └── regulatory/
│       ├── 409a-valuation-current.pdf         # Hudig 409A waarderingsrapport
│       ├── 409a-history.md                    # 409A waarderingsgeschiedenis — datums, providers, FMV's
│       └── irs-correspondence/                # IRS-berichten en reacties — één bestand per bericht
├── docs/
│   ├── accounting-policies.md                 # Formeel boekhoudkundige beleidslijnen — opbrengstherkenning, capex, etc.
│   ├── chart-of-accounts.xlsx                 # Volledig rekeningschema met rekeningcodes, types, beschrijvingen
│   ├── revenue-recognition-policy.md          # ASC 606 opbrengstherkenning beleidsdocument
│   ├── expense-policy.md                      # Werknemeruitgaven- en terugbetalingsbeleid
│   ├── equity-compensation-summary.md         # Optiepool, toekenningen, vestingsplanningen, Carta-samenvatting
│   └── glossary.md                            # Financeteam woordenlijst — afkortingen en definities
└── cap-table/
    ├── cap-table-current.xlsx                 # Huige volledig verwaterde kapitaaltabel — gesynchroniseerd van Carta
    ├── option-pool-analysis.xlsx              # Analyse van optiepool voldoendheid en verversing
    ├── dilution-scenarios.xlsx                # Verdunningsmodellering — Series A, B, SAFE conversies
    └── 409a-strike-price-log.md              # Uitoefeningsprijs geschiedenis per verleningsdatum
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/variance-analysis.md` | Slash command die een periodeparameter aanneemt (bv. `mei-2025`), leest het corresponderende BvA bestand uit `models/budget-vs-actual/`, en genereert executive variantiecommentaar met regelitem-verklaringen |
| `.claude/commands/board-pack.md` | Slash command die de financiën van het huige kwartaal, KPI trends, en scenariosamenvatting samenstelt in boardklaar diapresentatienarratief en sprekeraantekeningen |
| `.claude/commands/close-checklist.md` | Slash command die een maandeindsluit takenlijst genereert voorgevuld met eigenaren, vervaldatums, en voortgesleepte items van de vorige sluiting |
| `models/3-statement/3-statement-model-2025.xlsx` | Mastergeïntegreerd financieel model — updates naar werkelijke gegevens stromen via W&V naar balans naar cashflow; source of truth voor alle rapportage |
| `close/month-end-close-checklist.md` | Levende sluitingschecklist met taakeigenaar, status (open/voltooid/geblokkeerd), en vervaldatum per stap; bijgewerkt elk sluitingscyclus |
| `budgets/annual/budget-2025.xlsx` | Door board goedgekeurd bedrijfsbudget; nooit gewijzigd na goedkeuring — varianties worden uitgelegd tegen deze basislijn |
| `compliance/audit/audit-prep-checklist.md` | PBC (door klant voorbereide) checklist voor jaaraudit; volgt documentstatus en auditorreceptbevestiging |
| `reports/investor-updates/investor-update-template.md` | Standaard investeerderbrievenformat: koppelindicatoren, narratief, belangrijke mijlpalen, vragen — gebruikt bij elke maandelijkse update |
| `docs/chart-of-accounts.xlsx` | Canonieke rekeningschema — elk nieuw account toegevoegd aan QuickBooks/Xero/NetSuite moet hier worden weergegeven met correcte financiële-overzicht mapping |
| `cap-table/cap-table-current.xlsx` | Volledig verwaterde kapitaaltabel geëxporteerd van Carta; ondersteunt verdunningsmodellering, 409A inputs, en boardrapportage |

## Snel stijlgeraamwerk

```bash
# Workspace root aanmaken
mkdir -p finance-analyst-workspace
cd finance-analyst-workspace

# .claude structuur aanmaken
mkdir -p .claude/commands

# Workspace mappen aanmaken
mkdir -p models/3-statement
mkdir -p models/dcf
mkdir -p models/budget-vs-actual
mkdir -p models/scenario
mkdir -p reports/board-packs
mkdir -p reports/investor-updates
mkdir -p reports/management-reporting
mkdir -p close/journal-entries
mkdir -p close/reconciliations
mkdir -p close/trial-balance
mkdir -p budgets/annual
mkdir -p budgets/reforecasts
mkdir -p compliance/audit
mkdir -p compliance/tax
mkdir -p compliance/regulatory/irs-correspondence
mkdir -p docs
mkdir -p cap-table

# Zaadsleutelbestanden
touch models/3-statement/assumptions-log.md
touch models/budget-vs-actual/variance-threshold-policy.md
touch close/month-end-close-checklist.md
touch close/close-calendar-2025.md
touch close/gl-recon-checklist.md
touch close/reconciliations/gl-recon-checklist.md
touch budgets/annual/budget-2025-assumptions.md
touch budgets/annual/budget-approval-log.md
touch budgets/reforecasts/reforecast-assumptions.md
touch compliance/audit/audit-prep-checklist.md
touch compliance/tax/tax-calendar-2025.md
touch compliance/tax/state-nexus-tracker.md
touch docs/accounting-policies.md
touch docs/revenue-recognition-policy.md
touch docs/expense-policy.md
touch docs/equity-compensation-summary.md
touch docs/glossary.md
touch cap-table/409a-strike-price-log.md
touch reports/investor-updates/investor-update-template.md

# .claude/commands zaai
touch .claude/commands/variance-analysis.md
touch .claude/commands/model-update.md
touch .claude/commands/board-pack.md
touch .claude/commands/close-checklist.md
touch .claude/commands/scenario-model.md
touch .claude/commands/investor-update.md
touch .claude/commands/budget-reforecast.md

# Claude Code skills installeren
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/dcf-model
npx claudient add skill finance/budget-vs-actual
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/financial-plan
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/comps-analysis
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
```

## CLAUDE.md sjabloon

```markdown
# Finance Analyst / CFO Workspace

Deze workspace ondersteunt financiële bedrijfsvoering: modelupdates, maandsluitingen, boardpack-creatie,
scenarioplanning, investeerderrapportage, en auditvoorbereiding — allemaal aangestuurd door gestructureerde bestanden en slash commands.

---

## Wat dit is

Een gestructureerde Claude Code workspace voor een financial analyst of CFO. Elke map komt overeen met een
afzonderlijke financiële functie. Claude Code leest werkelijke gegevens, budgetten, en beleidsbestanden om nauwkeurige,
organisatiespecifieke outputs te produceren — geen generieke financieel advies.

---

## Stack

- Excel / Google Sheets — financiële modellen, BvA, scenario's (bestanden in models/)
- QuickBooks / Xero / NetSuite — GL, schulden/vorderingen, proefbalans (exports in close/trial-balance/)
- Notion / Confluence — boekhoudkundige beleidslijnen, close documenten (docs/)
- Carta — kapitaaltabel en aandelegegevens (cap-table/)
- Slack — close coördinatie, investeerder Q&A (MCP: slack)
- PowerPoint / Google Slides — boarddecks, investeerderupdates (reports/)

---

## Mapafspraken

- `models/` — Alle financiële modellen. Sla werkelijke-enige exports niet hier op; deze gaan naar close/.
- `close/` — Maandeindsluit artefacten. Eén submap per procesgebied: journal-entries/, reconciliations/, trial-balance/.
- `budgets/` — Door board goedgekeurd budget in budgets/annual/. Herprognoses in budgets/reforecasts/. Overschrijf nooit het goedgekeurd budgetbestand.
- `reports/` — Outputs. Boardpacks in board-packs/, investeerdersbrieven in investor-updates/, managementpakketten in management-reporting/.
- `compliance/` — Audit PBC, belastingaangiften, regelgeving documenten. Sla hier niet op tenzij definitief of bijna definitief.
- `docs/` — Beleidsdocumenten en referentiemateriaal. Houd accounting-policies.md en chart-of-accounts.xlsx actueel.
- `cap-table/` — Carta exports en aandelemodellering. Ververs cap-table-current.xlsx na elke toekenning of financieringsgebeurtenis.

---

## Algemene taken — exacte commando's

### Variantie- en close rapportage
```
/variance-analysis mei-2025   — Leest models/budget-vs-actual/bva-2025-ytd.xlsx, genereert
                               regelitem variantiecommentaar voor de gegeven periode
/close-checklist              — Genereert maandeindsluit takenlijst met eigenaren en vervaldatums
/model-update                 — 3-statement model bijwerken met nieuwste proefbalans export
```

### Board- en investeerderrapportage
```
/board-pack                   — Stelt huige kwartaalfinanciën, KPI's, scenariosamenvatting
                               samen in boarddeck narratief en sprekeraantekeningen
/investor-update              — Ontwerpt maandelijkse investeerderupdatebericht uit huige metrieken
                               en voortgang mijlpalen
```

### Budgettering en scenarioplanning
```
/budget-reforecast            — Bouwt rollende 4-kwartaal herprognose met aannamedagboek
/scenario-model               — Genereert basis/bull/bear scenario outputs van driver inputs
```

---

## Conventies die Claude moet volgen

- Het door board goedgekeurd budgetbestand (budgets/annual/budget-2025.xlsx) is alleen-lezen. Stel nooit bewerkingen ervan voor.
- Variantiecommentaar moet het specifieke regelitem, het dollarbedrag, en het percentage citeren. Schrijf nooit vaag commentaar zoals "hoger dan verwacht."
- Bij het opstellen van investeerderupdates eerst metrieken uit management-reporting/ halen. Schat geen nummers.
- Journaalposten moeten het format in close/journal-entries/je-template.csv volgen alvorens uploads voor te stellen.
- Rekeningschema is de autoriteit op rekeningcodes. Indien een nieuw account nodig is, noteer het uitdrukkelijk en markeer het voor de controller om toe te voegen.
- 409A uitoefensprijzen in cap-table/409a-strike-price-log.md zijn vertrouwelijk — include niet in boardpacks tenzij uitdrukkelijk verzocht.
- Audit PBC documenten in compliance/audit/ zijn vertrouwelijk. Verwijder niet naar bestandsinhoud in investeerder-gerichte outputs.
- Wanneer modellen bijwerken, log altijd aannahmewijzigingen in models/3-statement/assumptions-log.md met datum en reden.
- Herprognose bestanden moeten een wijzigingssecties bevatten. Overschrijf nooit een vorige herprognose bestand — maak een nieuw versioned bestand.
- Alle variantiedrempels die verplicht commentaar activeren worden gedefinieerd in models/budget-vs-actual/variance-threshold-policy.md.
```

## MCP servers

```json
{
  "mcpServers": {
    "quickbooks": {
      "command": "npx",
      "args": ["-y", "@intuit/mcp-server-quickbooks"],
      "env": {
        "QB_CLIENT_ID": "${QB_CLIENT_ID}",
        "QB_CLIENT_SECRET": "${QB_CLIENT_SECRET}",
        "QB_REALM_ID": "${QB_REALM_ID}",
        "QB_ACCESS_TOKEN": "${QB_ACCESS_TOKEN}"
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
        "/Users/you/finance-analyst-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"models/budget-vs-actual/\"; then echo \"[BvA hook] Variantiebestand bijgewerkt — bevestig dat variance-threshold-policy.md is gecontroleerd op verplichte commentaarvereisten.\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"budgets/annual/budget-2025\"; then echo \"[Budget guard] STOP — het goedgekeurd jaarlijks budgetbestand is alleen-lezen. Schrijf naar budgets/reforecasts/ in plaats daarvan.\"; exit 1; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Sessie-einde] Indien je een model bijwerkte, bevestig dat aannahmewijzigingen zijn vastgelegd in models/3-statement/assumptions-log.md. Indien je een close document opstelde, bevestig dat het is gekoppeld in close/month-end-close-checklist.md.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/dcf-model
npx claudient add skill finance/budget-vs-actual
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/financial-plan
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/comps-analysis
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
```

## Gerelateerd

- [Gids: Claude voor Financial Analysts en CFO's](../guides/for-finance-analyst.md)
- [Workflow: Maandsluitingses](../workflows/month-end-close.md)
- [Workflow: Boardpack Voorbereiding](../workflows/board-pack-prep.md)
- [Workflow: Jaarlijkse Budgettering](../workflows/annual-budgeting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
