# Operaties Nonprofit-organisatie — Projectstructuur

> Voor een nonprofit-organisatie die programma's, fondsenwerving, doneurrelaties, subsidieaanvragen en compliance beheert — optimalisering van de volledige cyclus van prospectonderzoek en subsidieaanvragen tot programmalevering, doneurstewardship en IRS 990-rapportage.

## Stack

- **Salesforce Nonprofit Success Pack (NPSP)** — donor CRM, gifttracking, relatiebeheer, campagnerapportage
- **Bloomerang** — alternatieve donor CRM; retentiescore, lapsed donoursegmentatie, betrokkenheidstijdlijn
- **Mailchimp** of **Constant Contact** — e-mailnieuwsbrieven, donorsegmenteringscampagnes, uitnodigingen voor evenementen, automatische stewardship-reeksen
- **QuickBooks Nonprofit** — fondsboekhouding, tracking van beperkte/onbeperkte inkomsten, rapportage van subsidieuitgaven, 990 prep-exports
- **Google Workspace** (Gmail, Docs, Drive, Sheets, Calendar) — interne communicatie, bestuursdocumenten, gedeelde bestandsopslag
- **Canva** — impactrapporten, social media-afbeeldingen, subsidieomslag-pagina's, evenementenmaterialen, jaarlijkse rapportontwerp
- **Zoom** — bestuursvergaderingen, donorcultiveringsevenementen, programmalevering (virtueel), personeelsoverleg
- **DonorSearch** of **iWave** — prospectonderzoek, vermogensscreening, filantropische capaciteitsscore, affiniteitbeoordelingen
- **Submittable** of **Fluxx** — indienpagina subsidieaanvragen en beheersportaal
- **Claude Code** — concepten subsidienarratief, donorbevestigingsbrieven, bestuursbereiderrapportage, impactverhaalgeneneratie, 990 prep-assistentie

## Mappenstructuur

```
nonprofit-operations/
├── .claude/
│   ├── CLAUDE.md                                    # Werkruimteinstructies — donorvertrouwelijkheid, subsidietermine, 990-schema
│   ├── settings.json                                # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── grant-narrative.md                       # /grant-narrative — subsidievoorstelsectie uit funderbrief en programmagevens opstellen
│       ├── donor-acknowledgment.md                  # /donor-acknowledgment — IRS-compliant geschenkbevestigingsbrief genereren
│       ├── impact-story.md                          # /impact-story — deelnemeimpactverhaal uit personeelsinterviewaantekeningen schrijven
│       ├── board-report.md                          # /board-report — maandelijks/driemaandelijks bestuursbericht uit programma- en financiëngegevens samenstellen
│       ├── prospect-profile.md                      # /prospect-profile — synthesiseer een prospectprofiel grote geschenken uit onderzoeksinvoer
│       ├── grant-report.md                          # /grant-report — concept fundervoortgangs- of slotrapport uit programmaresultaatgegevens
│       └── donor-segment.md                         # /donor-segment — gesegmenteerde appèl of stewardship-bericht voor donerlaag genereren
├── programs/
│   ├── README.md                                    # Programma-overzicht — lijst actieve programma's, directeuren, boekjaren
│   ├── youth-workforce-development/                 # Voorbeeld programmamap — één map per actief programma
│   │   ├── logic-model.md                           # Veranderingsteorie: inputs, activiteiten, outputs, outcomes, impact
│   │   ├── activities.md                            # Activiteitenkalender, sessieplannen, curriculumoverzicht, facilitatortoewijzingen
│   │   ├── outcomes-tracking.md                     # Uitkomstindicators, meetmethoden, gegevensverzamelingschema, doelen vs. werkelijk
│   │   ├── participant-data-sop.md                  # SOP voor het verzamelen, opslaan en beveiligen van deelnemer PII — toestemmingsformulieren, Salesforce-invoer, bewaarcyclus
│   │   └── program-budget.md                        # Begroting op programmaniveau per uitgavencategorie — links naar subsidiebeperkingen
│   ├── senior-food-assistance/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   ├── financial-literacy-education/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   └── evaluation/
│       ├── evaluation-framework.md                  # Evaluatiebenadering organisatiebred — algemene indicators, gegevensstandaarden
│       ├── data-collection-tools.md                 # Enquêtesjablonen, innamegereedschappen, pre/post-assessments — geen echte deelnemegegevens
│       └── annual-outcomes-report-template.md       # Sjabloon voor het samenvoegen van programmagegevensresultaten in financierder-gerichte jaarlijkse rapportage
├── fundraising/
│   ├── donor-segments.md                            # Segmentdefinities — grote donateurs ($10K+), middelgrote ($1K–$9,999), jaarlijks fonds (<$1K), lapsed, nieuw
│   ├── major-gift-prospects.md                      # Top 25 prospectgroepen grote geschenken — capaciteitsrating, affiniteit, relatiehouder, volgende stap, vraagbedrag
│   ├── event-calendar.md                            # Fondsenwervingevenementenkalender — gala, golftoernooi, Giving Tuesday, peer-to-peer campagnes
│   ├── annual-fund-plan.md                          # Jaarlijkse fondsstrategie — appèlschema, kanaalsamenstelling, matchende geschenkdoelen, bewaardoelen
│   ├── planned-giving.md                            # Legacy-gesellig programma — erfenisstaal, erfplanningsmiddelen, ledencustodiaplan
│   ├── major-gifts/
│   │   ├── cultivation-moves-template.md            # Verplaatsingsbeheersingssjabloon — discovery, cultivering, sollicitatie, stewardship-stappen
│   │   ├── gift-agreement-template.md               # Sjabloon grote giftovereenkomst — giftbedrag, doel, erkenning, rapportplichten
│   │   ├── solicitation-letter-template.md          # Sjabloon grote geschenkbriefaanvraag — verpersoonlijkingsvelden, ondersteunend narratief
│   │   └── stewardship-calendar.md                  # Jaarlijkse contactkalender voor grote donateurs — oproepen, bezoeken, rapporten, erkenning
│   ├── annual-fund/
│   │   ├── direct-mail-appeal-template.md           # Sjabloon directe-mailappèl — herfst-, jaareinde-, voorjaarsversies
│   │   ├── email-appeal-template.md                 # Sjabloon e-mailappèl — onderwerpregel varianten, A/B-teststructuur
│   │   ├── matching-gift-tracker.md                 # Mogelijkheden voor giften van ondernemingen ter vergelijking — werkgever, matchingsverhouding, deadline, status
│   │   └── retention-report-template.md             # Sjabloon donorbewaaranalyserapport — nieuwe, bewaarde, lapsed, heraktiveerde aantallen per jaar
│   └── prospect-research/
│       ├── prospect-research-sop.md                 # SOP voor DonorSearch/iWave-screening — wanneer u actief bent, hoe u resultaten in Salesforce/Bloomerang registreert
│       ├── wealth-screen-criteria.md                # Criteria capaciteits- en affiniteitscoring — onroerend goed, SEC-filings, eerdere donaties, filantropische geschiedenis
│       └── prospect-briefing-template.md            # Sjabloon uittreksselprospect één pagina — biografie, donatieverleden, verbindingen, voorgestelde vraag
├── grants/
│   ├── grant-calendar.md                            # Kalender voor subsidietermine — funder, bedrag, deadline, toegewezen schrijver, status, rapportage verschuldigd
│   ├── funder-research/
│   │   ├── funder-research-sop.md                   # SOP voor het onderzoeken van nieuwe fundadores — 990 analyse, prioriteiten, eerdere grantees, geschiktheidsbeoordelinge
│   │   ├── funder-profiles/
│   │   │   ├── smith-family-foundation.md           # Fundadorprofiel: prioriteiten, geschiktheid, gemiddelde subsidiegrootte, eerdere subsidies aan organisatie, contact
│   │   │   ├── city-arts-council.md
│   │   │   └── federal-cdbg-program.md
│   │   └── prospect-funders.md                      # Fundadores onder onderzoek — naam, geschiktheidsrating, volgende actie, toegewezen personeel
│   ├── active-grants/
│   │   ├── README.md                                # Actieve subsidievoorraden — funder, toekenningsbedrag, periode, beperkt doel, rapportagedatums
│   │   ├── smith-family-foundation-fy2025/
│   │   │   ├── grant-agreement.md                   # Toekenningsbedrag, beperkingen, rapportplichten, contactgegevens
│   │   │   ├── budget-narrative.md                  # Goedgekeurde begroting met regelnarratief — komt overeen met QuickBooks-subsidiecode
│   │   │   ├── progress-report-q1.md                # Q1 narratieve voortgangsrapportage — activiteiten, resultaten, uitgaven
│   │   │   └── final-report-draft.md                # Concept slotrapport — narratief, financiële zaken, geleerde lessen
│   │   └── federal-workforce-grant-fy2025/
│   │       ├── grant-agreement.md
│   │       ├── budget-narrative.md
│   │       ├── subrecipient-monitoring-log.md       # Controlelogboek subontvangers — plaatsbezoeken, bureaurecensies, bevindingen (vereist voor federale prijzen)
│   │       └── sam-registration-renewal.md          # Checklist SAM.gov-registratievernieuwing en vervaldatum
│   ├── reporting-templates/
│   │   ├── progress-report-template.md              # Standaard tussentijdse voortgangsrapport — activiteiten, outputs, outcomes, financiële samenvatting
│   │   ├── final-report-template.md                 # Slotgranthrapport — narratief, resultaten vs. doelen, financiële boekhouding, lessen
│   │   └── budget-variance-report-template.md       # Sjabloon rapportage budgetafwijking vs. werkelijk voor fundadores
│   └── past-applications/
│       ├── README.md                                 # Index van eerdere toepassingen — funder, jaar, resultaat, herbruikbare narratiefsecties
│       ├── youth-workforce-development-narrative.md  # Herbruikbaar programmanarratief voor jeugdarbeidskrachtsubsidieverzoeken
│       └── organizational-capacity-narrative.md     # Herbruikbare sectie organisatiescapaciteit en track record
├── communications/
│   ├── social-calendar.md                           # Kalender social media-inhoud — platform, berichtdatum, inhoudstema, campagne, grafische asset
│   ├── annual-report.md                             # Jaarlijkse rapportoverzicht en productiechecklist — inhoudssecties, Canva-sjabloon, distributieplan
│   ├── newsletter-templates/
│   │   ├── monthly-newsletter-template.md           # Maandelijkse nieuwsbrief voor donoren — secties: impactverhaal, programma-update, aankomende evenementen, vraag
│   │   ├── event-invitation-template.md             # E-mailuitnodiging voor events — onderwerpregel, RSVP-linkplaatshouder, logistiek
│   │   └── year-end-appeal-email-series.md          # Jaareinde-mailserie — 4-mailsequentie met onderwerpen, timing, call-to-action
│   └── impact-stories/
│       ├── impact-story-sop.md                      # SOP voor het verzamelen, beoordelen en publiceren van deelneemverhalen — toestemming vereist, privacyrichtlijnen
│       ├── story-interview-guide.md                 # Personeelsgids voor het uitvoeren van deelneemverhaalinterviews — open vragen, releaseformulier
│       └── published-stories/
│           ├── 2025-maria-workforce-story.md        # Gepubliceerd impactverhaal — geanonimiseerd of goedgekeurd, programmaresultaat geïllustreerd
│           └── 2025-james-food-assistance-story.md
├── finance/
│   ├── budget-template.md                           # Jaarlijkse bedrijfsbegrotingssjabloon — per programma, beperkt vs. onbeperkt, eerdere jaaractuals
│   ├── 990-prep-checklist.md                        # IRS Form 990-voorbereiding checklist — vervaldatums, vereiste schema's, gegevens voor ophalen uit QuickBooks
│   ├── audit-prep.md                                # Voorbereiding jaarlijkse controle checklist — documentaanvragen, bankafstemmingen, subsidieaftrekbevestigingen
│   ├── grant-expense-tracking.md                    # SOP uitgavens volgen subsidie — QuickBooks-subsidiecodes, toewijzingen, regels voor beperkte middelen
│   ├── fund-accounting-sop.md                       # SOP fondsboekhoudinge — beperkt vs. onbeperkt, tijdelijk beperkte vrijstelling, FASB ASC 958
│   └── financial-reports/
│       ├── monthly-financial-report-template.md     # Bestuurdsgereed maandelijks financieel rapport — begroting vs. werkelijk, JTD, samenvatting narratief
│       └── grant-financial-report-template.md       # Sjabloon financierder financieel rapport — uitgaven per begrotingsregel, resterend saldo
├── board/
│   ├── board-roster.md                              # Bestuursroster — naam, termijn, commissie, contact, werkgever, donaatgegevensstatus
│   ├── meeting-agendas/
│   │   ├── agenda-template.md                       # Sjabloon standaardbestuursagenda — agendaakkoord, commissierapporten, actiepunten
│   │   ├── 2025-01-board-agenda.md
│   │   ├── 2025-03-board-agenda.md
│   │   └── 2025-06-board-agenda.md
│   ├── resolutions/
│   │   ├── resolution-template.md                   # Sjabloon bestuursbesluit — TERWIJL/OPGELOST indeling, stemopname
│   │   ├── 2025-01-banking-resolution.md
│   │   └── 2025-03-executive-compensation-resolution.md
│   └── committee-charters/
│       ├── finance-committee-charter.md             # Financiecommissie bereik, lidmaatschap, bijeenkomstritme, verantwoordelijkheden
│       ├── executive-committee-charter.md
│       ├── fundraising-committee-charter.md
│       └── program-committee-charter.md
└── compliance/
    ├── state-registration-tracker.md               # Registratietracking charitate belasting per staat — vervaldatums, inschrijvingskosten, geregistreerde vertegenwoordiger
    ├── conflict-of-interest-log.md                 # Jaarlijkse belangenconflictdagboek — bestuur en sleutelstaf, per IRS 990 Rooster L
    ├── document-retention-policy.md                # IRS-compatibel bewaarbeleidsschema voor documenten — categorieën, bewaartermijnen, vernietigingslogboek
    ├── whistleblower-policy.md                     # Klokkenluider en tegelverbod-beleid — vereist voor 990 Deel VI-openbaarmaking
    └── 990-schedule-checklist/
        ├── schedule-a-checklist.md                 # Openbare ondersteuningstests — 509(a)(1) of (a)(2) berekeningschecklist
        ├── schedule-b-checklist.md                 # Rooster B-bijdragers — drempel, anonimiseringsregels, staatsopenbaarstellingsvereisten
        ├── schedule-d-checklist.md                 # Schema D aanvullende financiële overzichten — dotatie, beperkte middelen
        └── schedule-o-checklist.md                 # Rooster O aanvullende informatie — governance-beleidsregels, compensatieuitleg
```

## Verklaarde sleutelbestanden

| Pad | Doel |
|---|---|
| `grants/grant-calendar.md` | Kalender voor de belangrijkste subsidiedatum die alle actieve en pipelinefunders bestrijkt — het allerbelangrijkste bestand voor subsidieoperaties; omvat fundadorsnaam, toekenningsbedrag, aanvraaadagboek, toegewezen schrijver, indienstelling status en rapportage vervaldatums |
| `.claude/commands/grant-narrative.md` | Schuine opdracht die een subsidievoorstelsectie (behoeftestelling, programmaomschrijving, evaluatieplan of duurzaamheid) uit een fundorbrief en programmaresultaatgegevens opstelt — verlaagt de eerste-scherstijd van 4+ uur tot onder de 30 minuten |
| `fundraising/major-gift-prospects.md` | Top 25 lijstje grote giftprospectgroepen met DonorSearch/iWave-capaciteitsclassificaties, relatiehouder, laatste contactdatum, volgende cultivatiesstap en doelvraagebedrag — behandeld als vertrouwelijk; nooit buiten de organisatie gedeeld |
| `finance/990-prep-checklist.md` | IRS Form 990-voorbereiding checklist met indienprestatie (4,5 maanden na afsluiting boekjaar, of 11/15 voor kalenderjaarfilers), vereiste schema's per organisatieprofiel, QuickBooks-rapporten uitvoeren, en CPA-handoff-checklist |
| `grants/active-grants/README.md` | Voorraden alle actieve subsidies met fundor, toekenningsbedrag, subsidieperiode, beperkt doel, QuickBooks-subsidiecode, en aankomende rapportdatums — gebruikt in maandelijkse financiële en bestuurrapporten |
| `programs/[program]/participant-data-sop.md` | Per-programma SOP voor het verzamelen en beveiligen van deelneempersoonlijk identificeerbare gegevens (PII) — definieert toestemmingsvereisten, Salesforce-invoerprocedures, toegangscontroles en bewaarstelsel |
| `board/board-roster.md` | Hudig bestuur rooster met termijnverloop, commissietoewijzingen, jaarlijkse donaatgegevensstatus en werkgever voor matchende geschenkscreening — bijgewerkt na elke bestuursvergadering |
| `fundraising/prospect-research/prospect-briefing-template.md` | Sjabloon uittreksselvoorspoeling grote giftprospect één pagina ingevuld uit DonorSearch/iWave — biografie, filantropische geschiedenis, verbinding met organisatie, voorgestelde vraagreeks, en cultivatiestrategie |
| `communications/impact-stories/impact-story-sop.md` | Bepaalt het verzamelen en publiceren van deelneemverhalen — toestemmingsformuliersvereisten, anonimiseringsregels, goedkeuringswerkstroom, en Canva asset-productiestappen |
| `compliance/state-registration-tracker.md` | Registratie tracker voor charitate belasting voor alle staten waar organisatie besteedt — vervaldatums, vernieuwingskosten, geregistreerde agentcontacten, en jaarlijkse aanvraagvervaldatums |

## Snelle ondersteuning

```bash
# Werkruimtebasis maken
mkdir -p nonprofit-operations

# .claude-structuur maken
mkdir -p nonprofit-operations/.claude/commands

# Programmamappen maken
mkdir -p nonprofit-operations/programs/youth-workforce-development
mkdir -p nonprofit-operations/programs/senior-food-assistance
mkdir -p nonprofit-operations/programs/financial-literacy-education
mkdir -p nonprofit-operations/programs/evaluation

# Fondsenwerving mappen maken
mkdir -p nonprofit-operations/fundraising/major-gifts
mkdir -p nonprofit-operations/fundraising/annual-fund
mkdir -p nonprofit-operations/fundraising/prospect-research

# Subsidiemappen maken
mkdir -p nonprofit-operations/grants/funder-research/funder-profiles
mkdir -p nonprofit-operations/grants/active-grants
mkdir -p nonprofit-operations/grants/reporting-templates
mkdir -p nonprofit-operations/grants/past-applications

# Communicatie mappen maken
mkdir -p nonprofit-operations/communications/newsletter-templates
mkdir -p nonprofit-operations/communications/impact-stories/published-stories

# Financiële mappen maken
mkdir -p nonprofit-operations/finance/financial-reports

# Bestuursmappen maken
mkdir -p nonprofit-operations/board/meeting-agendas
mkdir -p nonprofit-operations/board/resolutions
mkdir -p nonprofit-operations/board/committee-charters

# Compliance mappen maken
mkdir -p nonprofit-operations/compliance/990-schedule-checklist

# Zaai de subsidiekalender met kolomkoppen
cat > nonprofit-operations/grants/grant-calendar.md << 'EOF'
# Grant Deadline Calendar

**Updated:** [date]
**Owner:** [Grants Manager name]

| Funder | Program | Amount | Application Deadline | Assigned Writer | Status | Report Due |
|---|---|---|---|---|---|---|
| Smith Family Foundation | Youth Workforce | $50,000 | 2025-09-15 | [name] | Drafting | 2026-06-30 |
| City Arts Council | Financial Literacy | $15,000 | 2025-10-01 | [name] | Research | 2026-03-31 |

## Upcoming (next 90 days)
- [auto-populate from table above filtered by deadline]

## Report Due (next 90 days)
- [auto-populate from table above filtered by report due date]
EOF

# Zaai actieve subsidies README
cat > nonprofit-operations/grants/active-grants/README.md << 'EOF'
# Active Grants Inventory

| Funder | Award Amount | Grant Period | Restricted Purpose | QuickBooks Grant Code | Next Report Due |
|---|---|---|---|---|---|
| Smith Family Foundation | $50,000 | 7/1/2025–6/30/2026 | Youth workforce stipends and staffing | GR-2025-001 | 2026-01-15 |

**Rule:** Each active grant must have its own subfolder named [funder-kebab-case]-[fiscal-year].
Subfolder must contain: grant-agreement.md, budget-narrative.md, and one file per progress/final report.
EOF

# Zaai het donorvertrouwelijkheidsbeleidsleesme
cat > nonprofit-operations/fundraising/prospect-research/prospect-research-sop.md << 'EOF'
# Prospect Research SOP

## Confidentiality policy
Prospect research data (DonorSearch ratings, iWave scores, wealth estimates) is strictly confidential.
- Do NOT share prospect profiles outside the development department without VP approval
- Do NOT store prospect data in shared Google Drive folders accessible to program staff or volunteers
- Salesforce/Bloomerang prospect records are accessible to development staff only — check role permissions quarterly
- Printed prospect briefings must be collected and shredded after board or committee meetings

## When to run a screen
- New board member prospects before nomination committee vote
- Major gift prospects with cumulative giving $5,000+
- Event attendees before personal outreach at $10,000+ capacity events
- Planned giving society inquiries

## Process
1. Export name and address list from Salesforce/Bloomerang in CSV format
2. Upload to DonorSearch batch screening portal (Settings > Batch Upload)
3. Allow 24–48 hours for results
4. Download results and import ratings back into Salesforce using the DonorSearch integration or manual field update
5. Log screening date in the prospect record
6. Flag top-rated prospects (DS Rating 5+) to Major Gifts Officer for briefing preparation
EOF

# Installeer nonprofit-vaardigheden
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report
```

## CLAUDE.md-sjabloon

```markdown
# Operaties Nonprofit-organisatie — Claude Code Instructies

## Wat dit is

Dit is de werkdirectory voor een nonprofit-organisatie die programma's, fondsenwerving, doneurrelaties, subsidieaanvragen en rapportage, bestuurszaken en IRS-naleving beheert.

DONORVERTROUWELIJKHEIDSR REGEL: Donoorrapporten, donatiebedragen, prospectonderzoeksgegevens (DonorSearch/iWave-beoordelingen, vermogensschattingen, capaciteitscores) en beleggingsintentties zijn strikt vertrouwelijk.
Voeg geen specifieke donoornamen, geschenkbedragen of vooruitzichtbeoordelingen op in bestanden die toegankelijk kunnen zijn voor vrijwilligers, stagiairs of programmawerk. Ontwikkelingsgevoelige bestanden leven onder
fundraising/major-gift-prospects.md en fundraising/prospect-research/ — behandel deze als beperkt.

DEELNEEMPRIVACY REGEL: Programmaegdeelneemnamen, contactgegevens, demografische gegevens en uitkomstslagen zijn persoonlijk identificeerbare informatie (PII). Deze gegevens bevinden zich in Salesforce NPSP
of de programmmadatabank — niet in deze werkruimte. Sjablonen gebruiken alleen haakjes plaatshouders.

## Stack

- Salesforce Nonprofit Success Pack (NPSP) — donor CRM; alle donoorrapporten en donatieverleden leven hier
- Bloomerang — alternatieve CRM indien gebruikt; retentiescore, betrokkenheidstijdlijn, lapsed donoorrapporten
- Mailchimp / Constant Contact — e-mailcampagnes, nieuwsbriefopmerkingen, evenementuitnodigingen, appèlreeksen
- QuickBooks Nonprofit — boekhoudkunde; subsidieuitgavencodes, beperkte fondsopvolging, 990 prep-exports
- Google Workspace — Docs, Drive, Sheets, Calendar voor interne samenwerking en documentopslag
- Canva — jaarlijkse rapportontwerp, impactverhaalgrafiek, social media-assets, subsidieomslagpagina's
- Zoom — bestuursvergaderingen, donorcultiveringsevenementen, virtuele programmalevering
- DonorSearch / iWave — prospectvermogens scherm en filantropische capaciteitsclassificaties (alleen ontwikkelingsteam)
- Submittable / Fluxx — indienpagina subsidieaanvragen voor stichting en overheidsfundadores

## Subsidiedeadlinekalender

Zie grants/grant-calendar.md — dit is de enige bron van waarheid voor alle subsidietermine.
Controleer en werk dit bestand elke maandagochtend bij. Wanneer een nieuwe subsidiekans wordt bevestigd:
1. Voeg een rij toe aan grant-calendar.md met funder, bedrag, deadline, toegewezen schrijver en rapportage vervaldatum
2. Maak een submappen onder grants/active-grants/ met behulp van de naamgeving [funder-kebab-case]-[fiscal-year]
3. Voeg de subsidie toe aan grants/active-grants/README.md met de QuickBooks-subsidiecode
4. Blokkeer de indiendatum in Google Calendar 30 dagen en 7 dagen uit

Sleuteltermine:
- IRS Form 990: verschuldigd 4,5 maanden na afsluiting boekjaar (kalenderaar = 15 mei; met verlenging = 15 november)
- Staatsregistraties voor charitate donaties: zie compliance/state-registration-tracker.md
- Jaarlijkse controle: doorgaans 3–4 maanden na afsluiting boekjaar — zie finance/audit-prep.md

## IRS 990 prep-schema

- Maand 1 na boekjaarafsluiting: Voer QuickBooks-rapporten uit; verzoek alle subsidiecode; bevestig beperkte fondssaldi
- Maand 2: Vul finance/990-prep-checklist.md in; verzamelvleer Schedule A openbare steungegevens; registreer belangenconflicten
- Maand 3: Verstrek QuickBooks-gegevenspakket en ondersteunende documenten aan auditoren/CPA
- Maand 4 (of maand 10 met verlenging): Dien Form 990 in; plaats naar GuideStar/Candid binnen 30 dagen na indiening

## Veelvoorkomende taken en exacte commando's

### Ontwerp een subsidievoorstelsectie
```
/grant-narrative

Funder: [foundation name]
Section: [need statement / program description / evaluation plan / sustainability / organization capacity]
Program: [program name]
Funder priorities: [paste from funder guidelines or profile in grants/funder-research/funder-profiles/]
Outcomes data: [paste relevant outcome metrics from programs/[program]/outcomes-tracking.md]
Word limit: [number]
```

### Genereer een donorbevestigingsbrief
```
/donor-acknowledgment

Gift type: [cash / stock / in-kind / matching gift / planned gift notification]
Gift amount: $[amount] (leave blank for non-cash gifts without appraisal)
Fund/purpose: [unrestricted / [program name] restricted]
Donor type: [individual / couple / foundation / corporate]
IRS language required: [yes — no goods or services provided / yes — event ticket value was $X]
Personalization notes: [any special context — e.g., memorial gift, first-time donor, board member]
```

### Schrijf een fundovoortgangs- of slotrapport
```
/grant-report

Funder: [foundation name]
Report type: [interim / final]
Grant period: [dates]
Approved purpose: [paste from grants/active-grants/[folder]/grant-agreement.md]
Activities completed: [paste from programs/[program]/activities.md]
Outcomes achieved vs. targets: [paste from programs/[program]/outcomes-tracking.md]
Budget summary: [expenditures vs. approved budget — from QuickBooks grant expense report]
Word limit: [number]
```

### Maak een profiel grote giftprospectgroep
```
/prospect-profile

Prospect name: [name]
DonorSearch rating: [1–10] / iWave score: [RFM or capacity estimate]
Prior giving to org: [amounts and years — from Salesforce/Bloomerang]
Employment: [employer, title]
Board or community connections: [known relationships to board members or staff]
Philanthropic interests: [known giving to other organizations — from 990 data or DonorSearch]
Suggested ask range: [$X–$Y]
```

### Ontwerp een impactverhaal uit personeelsinterviewaantekeningen
```
/impact-story

Program: [program name]
Story source: [paste staff interview notes or key quotes — use participant first name or pseudonym only]
Consent status: [signed release on file / anonymized — no identifying details]
Outcomes to highlight: [which program outcomes does this story illustrate]
Intended use: [annual report / newsletter / grant application / social media]
Target word count: [150–300 / 300–500 / 500–800]
```

### Stel een bestuursbericht samen
```
/board-report

Report period: [month or quarter]
Program updates: [paste highlights from program directors — activities, outcomes, enrollment]
Financial summary: [paste budget vs. actual from QuickBooks monthly report]
Fundraising update: [YTD raised vs. goal, major gifts closed, upcoming events]
Grant pipeline: [paste from grants/grant-calendar.md]
Action items needed: [decisions or votes required at this meeting]
```

### Genereer een donerssegmentatieberichtboek
```
/donor-segment

Segment: [major donors $10K+ / mid-level $1K–$9,999 / annual fund / lapsed 13–24 months / new donors]
Message type: [year-end appeal / spring campaign / event invitation / impact update / stewardship]
Campaign theme: [brief description of the campaign narrative]
Specific ask: [gift amount suggestion, upgrade amount, or event RSVP]
```

## Conventies te volgen

- Subsidiekalender (grants/grant-calendar.md) wordt elke maandag bijgewerkt; laat nooit een deadline voorbijgaan zonder een alert van 30 dagen
- Elk actieve subsidie heeft een submappen onder grants/active-grants/ met naam [funder-kebab-case]-[fiscal-year]
- QuickBooks-subsidiecodes volgen het formaat GR-[YYYY]-[###] — wijs elk fiscaal jaar opeenvolgend toe
- Donorbevestigingsbrieven moeten IRS 501(c)(3)-taal bevatten: geen goederen of diensten werden in ruiling verstrekt (of vermeld de marktwaarde van ontvangen voordelen)
- Impactverhalen vereisen een ondertekend deelhemvrij formulier vóór publicatie — verwijzing naar het bestand in communications/impact-stories/impact-story-sop.md
- Bestuursvergaderingmaterialen worden ten minste 5 dagen voor elke bijeenkomst naar de bestuurGoogle Drive-map geüpload
- Prospectonderzoeksbriefings zijn gemarkeerd VERTROUWELIJK en niet opgeslagen op gedeelde stations toegankelijk voor niet-ontwikkelingspersoneel
- Nieuwe fundadorprofielen gaan naar grants/funder-research/funder-profiles/ met behulp van de naamgeving [funder-kebab-case].md
- 990 prep begint in Maand 1 na boekjaarafsluiting — zie finance/990-prep-checklist.md voor het volledige schema
```

## MCP-servers

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp-server"],
      "env": {
        "SF_LOGIN_URL": "https://login.salesforce.com",
        "SF_USERNAME": "your-salesforce-username",
        "SF_PASSWORD": "your-salesforce-password",
        "SF_SECURITY_TOKEN": "your-salesforce-security-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/nonprofit-operations"
      ]
    },
    "mailchimp": {
      "command": "npx",
      "args": ["-y", "@mailchimp/mcp-server"],
      "env": {
        "MAILCHIMP_API_KEY": "your-mailchimp-api-key",
        "MAILCHIMP_SERVER_PREFIX": "us1"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/grant-calendar\"; then echo \"[grants] grant-calendar.md updated — verify all deadlines have Google Calendar events 30 days and 7 days out\"; fi'"
          },
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/active-grants\"; then echo \"[grants] Active grant file updated — confirm the QuickBooks grant code in grants/active-grants/README.md matches finance/grant-expense-tracking.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'python3 -c \"\nimport datetime, re\ntry:\n    with open(\\\"grants/grant-calendar.md\\\") as f:\n        content = f.read()\n    today = datetime.date.today()\n    lines = content.split(\\\"\\\\n\\\")\n    warnings = []\n    for line in lines:\n        dates = re.findall(r\\\"(\\\\d{4}-\\\\d{2}-\\\\d{2})\\\", line)\n        for d in dates:\n            delta = (datetime.date.fromisoformat(d) - today).days\n            if 0 < delta <= 30:\n                warnings.append(f\\\"DEADLINE IN {delta} DAYS: {line.strip()}\\\")\n    if warnings:\n        print(\\\"[grant-deadline-alert] \\\" + \\\"\\\\n\\\".join(warnings))\nexcept:\n    pass\n\" 2>/dev/null'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"fundraising/major-gift-prospects|prospect-research\"; then echo \"[confidentiality] Writing to a donor-confidential file. Confirm this file is not in a Google Drive folder shared with volunteers or program staff before proceeding.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden installeren

```bash
# Grant writing and reporting
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report

# Donor communications and fundraising
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/lesson-planner

# Board and governance
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/doc-site-builder

# Program management and outcomes
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/interview-scorecard
```

## Gerelateerde

- [Nonprofit Operations guide](../guides/for-nonprofit-operations.md)
- [Grant writing workflow](../workflows/grant-writing-workflow.md)
- [Donor stewardship workflow](../workflows/donor-stewardship-workflow.md)
- [IRS 990 preparation workflow](../workflows/990-prep-workflow.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
