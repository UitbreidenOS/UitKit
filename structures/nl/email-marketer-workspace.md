# Email Marketer Workspace — Projectstructuur

> Voor een emailmarketeer die lifecycleprogramma's, campagnes en afleveringsgebruik beheert — inclusief sequenceontwerp, A/B-testen, lijstonderhoud en prestatierapporten via Klaviyo, Mailchimp of ActiveCampaign.

## Stack

- **Klaviyo** of **Mailchimp** of **ActiveCampaign** — ESP van record: campagneverzendiging, flow-/automatiseringsbuilder, lijstsegmentatie, betrokkenheidstracking
- **Litmus** — E-mailrendering op 100+ clients, spamfilter testen, leveringsscores, preflight-checklist
- **Google Analytics 4** — UTM-attributie, conversietracking, inkomsten per e-mail, post-klik gedrag
- **Figma** — Ontwerpoverdrachten, geannoteerde sjabloonspecificaties, merkassetexports voor dev-ready HTML
- **Slack** — Campagnereviewthreads, lanceringsgodkeurings, afleveringsincidenten kanalen
- **Notion** — Campagnecalender, content briefs, stakeholder goedkeuringen, retrospectieve notities
- **Claude Code** — Sequenceconcepten, A/B-hypothese generatie, copyvarianten, prestatieverhaal, lijstonderhoudscripts

## Directoryboom

```
email-marketer-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Werkruimte-instructies (plak onderstaande sjabloon)
│   ├── settings.json                              # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── email-draft.md                         # /email-draft — neemt segment + doel, retourneert onderwerp + lichaamstext + CTA-kopie
│       ├── ab-test-setup.md                       # /ab-test-setup — hypothese, variantspecificaties, steekproefomvang, succesveld
│       ├── sequence-builder.md                    # /sequence-builder — volledige multi-e-mailflow met timing en taklogica
│       ├── deliverability-check.md                # /deliverability-check — pre-send checklist: SPF/DKIM, lijstgezondheid, contentvlaggen
│       ├── performance-report.md                  # /performance-report — verhaalsamenvattting van campagne of maandelijkse statistieken
│       ├── re-engagement.md                       # /re-engagement — win-back-sequence voor lapsed abonnees
│       └── list-clean.md                          # /list-clean — suppressiecriteria, segmentregels, zonsondergang beleid
├── campaigns/
│   ├── _template/                                 # Kopieer dit bij het briefen van enige eenmalige verzending
│   │   ├── brief.md                               # Campagnebrief: doel, publiek, aanbieding, tijdlijn, succesveld
│   │   ├── copy.md                                # Finaal goedgekeurd onderwerp, preheader, lichaamstext, CTA
│   │   └── results.md                             # Resultaten na verzending: opens, klikken, conversies, omzet
│   ├── 2026-06-product-launch/
│   │   ├── brief.md                               # Campagnebrief voor juni-productlancering
│   │   ├── copy.md                                # Definitieve kopie — onderwerp: "Introducing [Feature]"
│   │   ├── copy-variants.md                       # A/B onderwerpliivarianten getest vóór verzending
│   │   ├── litmus-report.md                       # Litmus preflight — renderingresultaten, spamscore
│   │   └── results.md                             # 34,2% openingspercentage, 4,1% CTR, $12.400 toegerekende omzet
│   ├── 2026-05-flash-sale/
│   │   ├── brief.md
│   │   ├── copy.md
│   │   ├── litmus-report.md
│   │   └── results.md
│   └── 2026-04-spring-promo/
│       ├── brief.md
│       ├── copy.md
│       └── results.md
├── sequences/
│   ├── welcome/
│   │   ├── sequence-map.md                        # Flowdiagram: triggers, timing, taklogica, uitgangsvoorwaarden
│   │   ├── email-1-welcome.md                     # Dag 0: welkom + waardepropositie, onmiddellijk na aanmelding verzonden
│   │   ├── email-2-quick-win.md                   # Dag 2: eerste actie-aandringer, benadrukt één sleutelfunctie
│   │   ├── email-3-social-proof.md                # Dag 5: getuigenissen, casestudy, vertrouwenssignalen
│   │   └── results-log.md                         # Lopende prestatie per e-mail: open/klik/uitschrijfpercentages
│   ├── onboarding/
│   │   ├── sequence-map.md                        # Trigger: account gecreëerd; sluit af bij eerste sleutelactie
│   │   ├── email-1-setup-guide.md                 # Dag 1: stapsgewijze setup, inline CTA voor profielafronding
│   │   ├── email-2-activation-nudge.md            # Dag 3: alleen verzonden als setup niet voltooid — dringendheidshoek
│   │   ├── email-3-feature-spotlight.md           # Dag 7: benadrukt topfunctie voor nieuwe gebruikers
│   │   ├── email-4-milestone.md                   # Dag 14: vier eerste actie, introduceer volgende mijlpaal
│   │   └── results-log.md
│   ├── nurture/
│   │   ├── sequence-map.md                        # Twee keer per week cadans voor betrokken niet-converters
│   │   ├── email-1-education.md                   # Branche-inzicht, geen productpush
│   │   ├── email-2-use-case.md                    # Klantenverhaal afgestemd op segment pijnpunt
│   │   ├── email-3-objection-handler.md           # Behandelt top 3 conversieobstakels
│   │   ├── email-4-soft-cta.md                    # Lage-wrijving aanbieding: gratis trial-extensie, webinar-uitnodiging
│   │   └── results-log.md
│   ├── win-back/
│   │   ├── sequence-map.md                        # Trigger: geen open/klik in 90 dagen
│   │   ├── email-1-we-miss-you.md                 # Toon: warm, lage druk, geen korting nog
│   │   ├── email-2-whats-new.md                   # Productupdates of content die ze hebben gemist
│   │   ├── email-3-incentive.md                   # Korting of exclusief aanbod om opnieuw in te schakelen
│   │   └── results-log.md
│   └── sunset/
│       ├── sequence-map.md                        # Trigger: geen betrokkenheid na win-back-sequence
│       ├── email-1-last-chance.md                 # Laatste houd/verwijder vraag — expliciete opt-in bevestiging
│       └── suppression-criteria.md                # Regels voor verplaatsing naar suppressielijst na geen reactie
├── a-b-tests/
│   ├── _template/
│   │   ├── hypothesis.md                          # Eénregelige hypothese, variabele die wordt getest, controle vs variant
│   │   └── results.md                             # Winnende variant, lift, betrouwbaarheidsniveau, beslissing
│   ├── 2026-q2-subject-line-length/
│   │   ├── hypothesis.md                          # H: kortere onderwerpen (<40 tekens) presteren beter op mobiel
│   │   └── results.md                             # Variant B won, +6,3% openingspercentage, 97% betrouwbaarheid — adopteren in welcome flow
│   ├── 2026-q2-cta-copy/
│   │   ├── hypothesis.md                          # H: handelingsgerichte CTA ("Start free") verslaat passief ("Learn more")
│   │   └── results.md                             # Geen statistisch significant verschil — hertest met grotere steekproef
│   └── 2026-q1-send-time/
│       ├── hypothesis.md
│       └── results.md
├── templates/
│   ├── headers/
│   │   ├── header-promo.html                      # Promotionele campagnekop — logo + aanbodsbanner
│   │   ├── header-transactional.html              # Schone kop voor bevestigingen, ontvangstbewijzen, waarschuwingen
│   │   └── header-newsletter.html                 # Nieuwsbrief-kop — logo + datum + onderwerpnummer
│   ├── ctas/
│   │   ├── cta-primary.html                       # Primaire knop — merkkleur, maximaal contrast, 44px aantikdoel
│   │   ├── cta-secondary.html                     # Ghost/outline knop voor secundaire acties
│   │   └── cta-text-link.html                     # Plain-text linkCTA voor plain-text fallback
│   ├── footers/
│   │   ├── footer-full.html                       # Volledige voettekst: afmelden, adres, social links, juridisch
│   │   ├── footer-minimal.html                    # Minimale voettekst voor transactionele/systeeme-mails
│   │   └── footer-gdpr.html                       # GDPR-conforme voettekst met preferentiecenterlink
│   └── layouts/
│       ├── single-column.html                     # Standaard enkele-kolom layout, mobiel-eerst
│       ├── two-column.html                        # Twee-kolom raster — afbeelding links, kopie rechts
│       └── plain-text.md                          # Plain-text sjabloon met variabeleplaceholders
├── compliance/
│   ├── unsubscribe-sop.md                         # Afmeldings-SOP: 10-dagenregel, suppressiesync, auditlogboek
│   ├── gdpr-checklist.md                          # GDPR-nalevingschecklist: toestemming, gegevensminimalisatie, recht op verwijdering
│   ├── can-spam-checklist.md                      # CAN-SPAM-vereisten: afzender-ID, onderwerpeerlijkheid, opt-out mechanisme
│   ├── casl-checklist.md                          # CASL-vereisten voor Canadese abonnees
│   └── consent-records/
│       └── consent-log-template.md                # Sjabloon voor documentatie van toestemmingsverkrijgingsmethode per lijstbron
├── reports/
│   ├── monthly/
│   │   ├── 2026-05-performance.md                 # Mei: 28,1% gemiddeld openingspercentage, 3,4% CTR, $48K toegerekende omzet
│   │   ├── 2026-04-performance.md
│   │   └── _template.md                           # Maandelijks dashboardsjabloon: KPI's, lijstgezondheid, topkampagnes
│   ├── quarterly/
│   │   ├── 2026-q1-review.md                      # Q1 samenvatting: lijstgroei, afleveringstrends, topsequences
│   │   └── _template.md                           # Driemaandelijks beoordelingsjabloon met benchmarks en YoY delta's
│   └── deliverability/
│       ├── bounce-log.md                          # Maandelijkse hard/soft bouncepercentages, ondernomen actie per piek
│       ├── spam-complaint-log.md                  # Klachtenpercentage per campagne — vlag alle boven 0,08%
│       └── domain-reputation-log.md               # Maandelijkse afzenderscore, Google Postmaster domein/IP reputatie
└── scratch/
    ├── copy-drafts.md                             # Onderhanden kopie voordat deze naar campaigns/ of sequences/ gaat
    └── ideas.md                                   # Ongecontroleerde campagneideeën, testhypothesen, publieksopstellingen
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/email-draft.md` | Schuine opdracht die een segmentbeschrijving en campagnedoel neemt, retourneert een volledige e-mail met onderwerpregel, preheader, lichaamstext en CTA — klaar voor Litmus preflight |
| `.claude/commands/ab-test-setup.md` | Schuine opdracht die een gestructureerde A/B-test genereert: eénregelige hypothese, controle vs variantspecificatie, minimale steekproefomvangberekening en primair succesveld |
| `.claude/commands/sequence-builder.md` | Schuine opdracht die een volledige multi-e-mail lifecycleflow produceert met e-mail per e-mail doelen, timinglogica, takvoorwaarden en uitgangsvoorwaarden |
| `.claude/commands/deliverability-check.md` | Schuine opdracht die een pre-send afleveringschecklist uitvoert: SPF/DKIM-status, lijstbetrokkenheidsgezondheid, content spamtriggers, afmeldings linkpresentie |
| `.claude/commands/performance-report.md` | Schuine opdracht die ruwe statistieken neemt en retourneert een verhaalmatige prestatiesamenvatting met trendaanduidingen en aanbevelingen voor volgende actie |
| `sequences/welcome/sequence-map.md` | Bron van waarheid voor de welcome flow — triggervoorwaarden, timing, taklogica en uitgangsvoorwaarden; bijgewerkt wanneer de flow in de ESP wordt gewijzigd |
| `compliance/unsubscribe-sop.md` | Stapsgewijze SOP voor verwerking van afmeldingen: 10 werkdagen vereiste, suppressielijstsync over ESP's, maandelijks auditlogboek |
| `reports/deliverability/spam-complaint-log.md` | Maandelijks logboek van klachtenpercentages per campagne — elk percentage boven 0,08% leidt tot herziening; voeding in domeinreputatiebewaking |

## Snelle steigers

```bash
# Maak de werkruimtewortel
mkdir -p email-marketer-workspace

# Maak .claude-structuur
mkdir -p email-marketer-workspace/.claude/commands

# Maak campagnedirectories
mkdir -p email-marketer-workspace/campaigns/_template
mkdir -p email-marketer-workspace/campaigns/2026-06-product-launch
mkdir -p email-marketer-workspace/campaigns/2026-05-flash-sale

# Maak sequencedirectories
mkdir -p email-marketer-workspace/sequences/welcome
mkdir -p email-marketer-workspace/sequences/onboarding
mkdir -p email-marketer-workspace/sequences/nurture
mkdir -p email-marketer-workspace/sequences/win-back
mkdir -p email-marketer-workspace/sequences/sunset

# Maak A/B-testdirectories
mkdir -p email-marketer-workspace/a-b-tests/_template
mkdir -p email-marketer-workspace/a-b-tests/2026-q2-subject-line-length
mkdir -p email-marketer-workspace/a-b-tests/2026-q2-cta-copy

# Maak sjabloonmodule-directories
mkdir -p email-marketer-workspace/templates/headers
mkdir -p email-marketer-workspace/templates/ctas
mkdir -p email-marketer-workspace/templates/footers
mkdir -p email-marketer-workspace/templates/layouts

# Maak compliancedirectory
mkdir -p email-marketer-workspace/compliance/consent-records

# Maak rapportdirectories
mkdir -p email-marketer-workspace/reports/monthly
mkdir -p email-marketer-workspace/reports/quarterly
mkdir -p email-marketer-workspace/reports/deliverability

# Maak scratchdirectory
mkdir -p email-marketer-workspace/scratch

# Zaadplaceholder-bestanden
touch email-marketer-workspace/campaigns/_template/brief.md
touch email-marketer-workspace/campaigns/_template/copy.md
touch email-marketer-workspace/campaigns/_template/results.md
touch email-marketer-workspace/a-b-tests/_template/hypothesis.md
touch email-marketer-workspace/a-b-tests/_template/results.md
touch email-marketer-workspace/reports/monthly/_template.md
touch email-marketer-workspace/reports/quarterly/_template.md

# Installeer emailmarketingvaardigheden
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/email-deliverability
npx claudient add skill marketing/email-ab-tester
npx claudient add skill small-business/email-campaign

# Kopieer opdrachtsoketstubs in .claude/commands/
npx claudient add skill marketing/email-sequence --output email-marketer-workspace/.claude/commands/email-draft.md
npx claudient add skill marketing/email-ab-tester --output email-marketer-workspace/.claude/commands/ab-test-setup.md
npx claudient add skill marketing/email-sequence --output email-marketer-workspace/.claude/commands/sequence-builder.md
npx claudient add skill marketing/email-deliverability --output email-marketer-workspace/.claude/commands/deliverability-check.md
npx claudient add skill small-business/email-campaign --output email-marketer-workspace/.claude/commands/performance-report.md
```

## CLAUDE.md-sjabloon

```markdown
# Email Marketer Workspace — Claude Code Instructies

## Wat dit is

Dit is de werkdirectory voor een emailmarketeer die lifecycleprogramma's, campagnes,
A/B-testen, lijstonderhoud en afleveringsmanagement beheert. Campagnes worden gedocumenteerd in campaigns/, lifecyclesequences leven in sequences/, testrecords in a-b-tests/, herbruikbare HTML-modules in templates/,
compliance SOP's in compliance/ en maandelijkse dashboards in reports/. Alle kopieconcepten, sequencebouw, A/B-test structurering en prestatieverhaal generatie loopt via Claude Code-vaardigheden.

## Stack

- Klaviyo / Mailchimp / ActiveCampaign — ESP van record; flows en campagneverzendiging
- Litmus — Pre-send rendering en afleveringspreflight
- Google Analytics 4 — UTM-attributie en post-klik conversietracking
- Figma — Ontwerpoverdrachten en geannoteerde sjabloonspecificaties
- Slack — Campagnegodkeuringen en afleveringsincidenten kanalen
- Notion — Campagnecalender, content briefs, stakeholder sign-offs

## Algemene taken en exacte opdrachten

### Bouwstenen van een campagne-e-mail
```
/email-draft

Segment: [beschrijf het publiek — bv. "trialgebruikers die niet actief zijn in 7 dagen"]
Goal: [conversiedoelstelling — bv. "zorg dat ze de profielinstellingen voltooien"]
Offer: [indien van toepassing — korting, gratis hulpmiddel, functie ontgrendelen]
Tone: [merkstembeschrijver — bv. "warm, direct, geen onzin"]
Max length: [woordaantal of scroll diepte target]
```

### Stel een A/B-test in
```
/ab-test-setup

Wat we testen: [onderwerpregel / CTA-kopie / verzendtijd / lay-out / aanbieding]
Hypothesis: [als we X veranderen, verwachten we Y omdat Z]
Control: [huidige versie woordelijk]
Variant: [voorgestelde wijziging woordelijk]
List size available: [aantal contacten in segment]
Primary metric: [openingspercentage / CTR / conversiepercentage / inkomsten per e-mail]
Confidence threshold: [95% standaard of specifiek]
```

### Bouw een lifecyclesequence
```
/sequence-builder

Sequence type: [welcome / onboarding / nurture / win-back / sunset]
Trigger: [welke gebeurtenis start de flow — bv. "signup", "90 dagen geen betrokkenheid"]
Audience: [beschrijf het segment]
Goal: [wat succes eruit ziet — activering, aankoop, opnieuw inschakelen]
Emails needed: [aantal]
Cadence: [timing tussen e-mails — bv. "dag 0, dag 3, dag 7, dag 14"]
Exit condition: [wat verwijdert iemand uit de flow vroeg]
```

### Voer een pre-send afleveringscontrole uit
```
/deliverability-check

Campaign name: [wat je gaat verzenden]
Segment: [wie ontvangt het — lijstnaam of segmentdefinitie]
List age: [wanneer is deze lijst voor het laatst schoongemaakt?]
Engagement window: [wat is het actieve betrokkenheidsvenster voor dit segment?]
From domain: [verzenddomein — bv. email.company.com]
Content concerns: [elementen die spamfilters kunnen triggeren — bv. zware afbeeldingen, dringendheidswoorden]
```

### Genereer een prestatieveld
```
/performance-report

Period: [maand, kwartaal of campagnenaam]
Sends: [aantal verzonden e-mails]
Open rate: [X%] — branchebenchmark: [Y%]
CTR: [X%] — branchebenchmark: [Y%]
Unsubscribe rate: [X%]
Bounce rate: [X%]
Revenue attributed: [$X] via [GA4 / ESP-attributie]
Top performer: [campagne of sequence met beste resultaten]
Concern: [metriek of trend dat aandacht nodig heeft]
```

### Schrijf een herinschakelings-sequence
```
/re-engagement

Lapsed definition: [bv. "geen open of klik in 90 dagen"]
Segment size: [in aanmerking komende contacten]
Last product update relevant to them: [functie, aanbieding of content die ze hebben gemist]
Incentive available: [korting / exclusieve inhoud / geen]
Emails in sequence: [2 of 3]
Sunset after: [hoeveel e-mails zonder reactie vóór suppressie]
```

### Voer een lijstschoonmaak uit
```
/list-clean

Total list size: [aantal]
Last cleaned: [datum]
Current bounce rate: [X%]
Engagement window for active definition: [bv. "geopend in laatste 180 dagen"]
Segments to suppress: [bounced, complained, ongeëngageerd voorbij X dagen]
Compliance requirement: [GDPR / CAN-SPAM / CASL — noteer welke van toepassing zijn]
```

## Conventies die je moet volgen

- Elke campagne moet brief.md voltooid en goedgekeurd hebben voordat copy.md wordt opgesteld
- Sla definitieve goedgekeurd kopie op naar campaigns/<name>/copy.md voordat je naar de ESP uploadt
- Litmus preflight-resultaten gaan in campaigns/<name>/litmus-report.md — verzend niet zonder een passend rapport
- A/B-testhypothesen worden geregistreerd in a-b-tests/<name>/hypothesis.md voordat de test in de ESP wordt gemaakt
- Resultaten worden gedocumenteerd in a-b-tests/<name>/results.md binnen 48 uur na statistisch significantie
- Sequenceveranderingen moeten worden weerspiegeld in sequences/<name>/sequence-map.md vóór het bewerken van de ESP-flow
- Nalevingschecklisten in compliance/ worden beoordeeld vóór enige lijstimport of nieuwe flowlancering
- Afmeldingsverzoeken worden verwerkt volgens de SOP in compliance/unsubscribe-sop.md — maximaal 10 werkdagen
- Maandelijkse prestatiedashboards worden ingediend in reports/monthly/YYYY-MM-performance.md voor de 5de van elke maand
- Elk spamklachtenpercentage boven 0,08% wordt geregistreerd in reports/deliverability/spam-complaint-log.md met basisoorzaak
```

## MCP-servers

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "pk_your-klaviyo-private-api-key"
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
        "/Users/your-username/email-marketer-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"campaigns/.*/copy\\.md\"; then echo \"[hook] Campaign copy saved — run /deliverability-check before uploading to ESP, then complete campaigns/$(basename $(dirname $CLAUDE_TOOL_INPUT_FILE_PATH))/litmus-report.md\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"a-b-tests/.*/results\\.md\"; then echo \"[hook] A/B results logged — if a winner emerged, update the relevant sequence or campaign template to adopt the winning variant\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DAY=$(date +%d); if [ \"$DAY\" = \"01\" ]; then echo \"[reminder] First of the month — file reports/monthly/$(date -v-1m +%Y-%m)-performance.md and update reports/deliverability/bounce-log.md and spam-complaint-log.md\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

```bash
# Kern emailmarketingvaardigheden
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/email-deliverability
npx claudient add skill marketing/email-ab-tester
npx claudient add skill small-business/email-campaign

# Installeer alle marketingvaardigheden tegelijk
npx claudient add skills marketing
```

## Gerelateerd

- [Email marketer gids](../guides/for-email-marketer.md)
- [Lifecycle sequence workflow](../workflows/lifecycle-sequence-build.md)
- [Deliverability incident workflow](../workflows/deliverability-incident-response.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
