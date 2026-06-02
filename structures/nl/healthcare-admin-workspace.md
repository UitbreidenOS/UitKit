# Healthcare Administrator Workspace — Projectstructuur

> Voor een healthcare administrator die klinische operaties, planning, prior authorization-aanvragen, verzekeringverificatie, compliance en patiëntencommunicatie beheert — zonder PHI opgeslagen buiten het EHR.

## Stack

- **Epic** of **Athenahealth** — EHR/PM-systeem van record; alle patiëntspecifieke gegevens bevinden zich hier uitsluitend
- **Google Workspace** (Gmail, Docs, Drive, Calendar) — externe communicatie, documentopslag, planningscoördinatie
- **Microsoft Teams** of **Slack** — interne personeelscommunicatie, afdelingsskanalen, verzoeken voor vervangingsbezetting
- **DocuSign** — routering van toestemmingsformulieren, ondertekening van leverancierscontracten, bijhouden van beleidsakkoorden
- **Zoom** — coördinatie van tele-geneeskundige bezoeken, personeelstrainingsessies, leveranciersvergaderingen
- **QuickBooks** — factureringsafstemming, boeking van schadeclaimbetaling, bijhouden van weigering, beheer van leveranciersfacturen
- **Claude Code** — opzet prior auth, compliance-controlelijsten, generatie van patiëntenbrieven, SOP-schrijving, onboarding van personeel

## Directorystructuur

```
healthcare-admin-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Werkruimte-instructies — PHI-regels, opdrachten, conventies
│   ├── settings.json                          # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── patient-intake.md                  # /patient-intake — genereer aanmeldingspakketcontrolelijst en welkombrief sjabloon
│       ├── prior-auth.md                      # /prior-auth — conceptprior authorisatieaanvraagbrief op basis van klinische criteria
│       ├── insurance-verify.md                # /insurance-verify — verzekeringverificatiecontrolelijst en vervolgingscript
│       ├── compliance-check.md                # /compliance-check — voer HIPAA/CMS-compliancecontrolelijst uit voor een proces
│       ├── staff-schedule.md                  # /staff-schedule — genereer vervangingsbezettingsplan of dienstplan sjabloon
│       ├── patient-letter.md                  # /patient-letter — concept afspraakremiinders, ontslagaanwijzingen of verwijzingsbrieven
│       └── incident-report.md                 # /incident-report — gestructureerd incidentrapportsjabloon met oorzaakanalysevelden
├── patients/
│   ├── README.md                              # KRITIEK: PHI-beleid — geen patiëntnamen, geboortedatum, MRN of diagnose opgeslagen hier
│   ├── templates/
│   │   ├── welcome-letter-template.md         # Welkombrief voor nieuwe patiënt — alleen [NAME] plaatsaanduiding, geen echte patiëntgegevens
│   │   ├── appointment-reminder-template.md   # Afspraakreminiscence — velden voor datum/tijd/locatie; samenvoegen vanuit Epic
│   │   ├── discharge-instructions-template.md # Ontslagaanwijzingen na bezoek — generiek per aandoeningscategorie
│   │   ├── referral-letter-template.md        # Verwijzingsbrief naar specialist — structuur van klinische samenvattingsplaatsaanduiding
│   │   ├── no-show-follow-up-template.md      # Vervolgbrief na gemist afspraak
│   │   ├── payment-plan-letter-template.md    # Brief met aanbod betaalplan voor financiële moeilijkheden
│   │   └── prior-auth-denial-appeal.md        # Beroepsbrief sjabloon voor verzekerde prior auth-afwijzingen
│   ├── intake/
│   │   ├── new-patient-checklist.md           # Admin-controlelijst: verzekeringkaart, fotolegitimatie, toestemmingsformulieren, demografische gegevens
│   │   ├── insurance-verification-sop.md      # Stap-voor-stap proces voor verificatie verzekeringsberechtingheid
│   │   ├── intake-packet-contents.md          # Lijst met formulieren in aanmeldingspakket — verwijzingen naar DocuSign-envelopnummers
│   │   └── intake-workflow-diagram.md         # Stroomdiagram van aanmeldingsstappen van incheck tot kamering
│   └── discharge/
│       ├── discharge-checklist.md             # Admin-stappen bij ontslag: samenvatting na bezoek, vervolgplanning, verwijzingen
│       ├── referral-tracking-log.md           # Log van lopende verwijzingen op datum verzonden — geen PHI; volgen op dossiernummer
│       └── telehealth-discharge-sop.md        # Controlelijst voor afsluiting tele-geneeskundige bezoek op Zoom en technische ondersteuningsscript
├── compliance/
│   ├── hipaa/
│   │   ├── hipaa-checklist-annual.md          # Jaarlijkse HIPAA-veiligheids- en privacyregel-auditcontrolelijst
│   │   ├── hipaa-checklist-new-hire.md        # Controlelijst voltooiing HIPAA-training voor nieuwe medewerkers
│   │   ├── phi-access-log-template.md         # Sjabloon voor registratie PHI-toegangsverzoeken en openbaarmaking (invullen in EHR)
│   │   ├── breach-notification-sop.md         # Stap-voor-stap breachmelding procedure — HHS-rapportage, patiëntenkennisgeving
│   │   ├── minimum-necessary-policy.md        # Beleidsdocument: minimaal noodzakelijke standaard voor PHI-gebruik en openbaarmaking
│   │   └── business-associate-agreement-log.md # Tracker actieve BAA's — leveranciersnaam, ondertekeningsdatum, vervaldatum
│   ├── cms/
│   │   ├── cms-conditions-of-participation.md # CMS CoP-controlelijst voor ambulante zorg compliance
│   │   ├── meaningful-use-checklist.md        # MIPS/APM-rapportage vereiste tracker per kwartaal
│   │   └── quality-measure-tracker.md         # Maandelijkse kwaliteitsmeting prestatielog (geanonimiseerde gegevens alleen)
│   ├── audits/
│   │   ├── audit-log.md                       # Lopend auditlog interne en externe audits — datum, bereik, bevindingen, status
│   │   ├── corrective-action-plan-template.md # CAP-sjabloon voor auditbevindingen — bevinding, eigenaar, vervaldatum, bewijs
│   │   └── mock-survey-checklist.md           # Voorbereiding interne mock survey — vragen, vereiste documentatie, eigenaar
│   └── policies/
│       ├── policy-index.md                    # Masterpindex actieve beleidsstukken — naam, ingangsdatum, controlesdatum, eigenaar
│       ├── privacy-policy-summary.md          # Samenvatting in begrijpbare taal van Privateverklaring
│       ├── security-incident-policy.md        # Beleid veiligheidskwestie respons en escalatiepad
│       └── telehealth-consent-policy.md       # Tele-geneeskundige geïnformeerde toestemmingsvereisten per staat
├── scheduling/
│   ├── shift-templates/
│   │   ├── weekday-shift-template.md          # Standaard M-V shiftblokken — MA, receptie, provider, facturering
│   │   ├── weekend-shift-template.md          # Weekend-/vakantiedekking rotatiesjabloon
│   │   ├── on-call-rotation-template.md       # On-call schema sjabloon — rollen, contacthiërarchie, escalatie
│   │   └── coverage-request-template.md       # Verzoekformulier voor vervangingsbezetting — reden, data, voorkeur vervangingspartner
│   ├── sops/
│   │   ├── scheduling-sop.md                  # SOP-afspraakplanning — boekingsregels, slottypen, inhoudbeleidsregels
│   │   ├── cancellation-sop.md                # Annulering en no-show afhandeling — wachtlijst, hertijd, facturingsvlaggen
│   │   ├── provider-template-sop.md           # Hoe provider-planningssjablonen in Epic/Athena construeren en aanpassen
│   │   └── telehealth-scheduling-sop.md       # Tele-geneeskundige bezoekplanning — Zoom-linkgenerering, voorbereiding patiënt
│   └── coverage-log.md                        # Lopend log openstaande shifts, vastgestelde dekking, en escalaties
├── billing/
│   ├── claim-templates/
│   │   ├── clean-claim-checklist.md           # Controlelijst schone claim voor indiening — verplichte velden per uitkering
│   │   ├── secondary-claim-template.md        # Coördinatieprocesstappen secundaire claimverzending
│   │   └── superbill-review-checklist.md      # Superbill-auditcontrolelijst — diagnose, wijzigingscode, plaats van dienst
│   ├── denials/
│   │   ├── denial-appeal-sop.md               # Stap-voor-stap weigering beroepsproces — tijdlijnen, vereiste documenten per afwijzingscode
│   │   ├── denial-code-reference.md           # Veel voorkomende afwijzingscodes (CO-4, CO-97, PR-96, enz.) met resolutiestappen
│   │   ├── appeal-letter-library/
│   │   │   ├── medical-necessity-appeal.md    # Beroepssjabloon voor medische noodzaakafwijzingen
│   │   │   ├── timely-filing-appeal.md        # Beroepssjabloon voor termijnafwijzingen met bewijs van rechtzeitige indiening
│   │   │   ├── authorization-retro-appeal.md  # Retroactief autorisatieberoepsjabloon
│   │   │   └── duplicate-claim-appeal.md      # Duplicaatclaimverzet met bewijs van afzonderlijke dienst
│   │   └── denial-tracker.md                  # Weigeringstrackerlog — uitkering, afwijzingscode, datum, status (geen PHI — dossiernummer alleen)
│   ├── reconciliation/
│   │   ├── daily-reconciliation-sop.md        # Afsluitings- en afstemming kasstelling, cheque en kaart met QuickBooks stappen
│   │   ├── era-posting-sop.md                 # Elektronische aflossingsvoorstel boeking werkstroom — ERA naar QuickBooks
│   │   ├── monthly-close-checklist.md         # Maandelijkse facturering sluitingcontrolelijst — uitstaande claims, afschrijvingen, rapporten
│   │   └── payer-contract-rate-sheet.md       # Gecontracteerde tarieven per uitkering en CPT-codebereik (niet-PHI referentiedoc)
│   └── payers/
│       ├── payer-contact-directory.md         # Contacten verzekeringuitbetalers — provideromgeving, claimstatus, auth-lijnen
│       └── payer-portal-login-sop.md          # Toegangsstappen betaalartal — geen referenties opslaan hier; wachtwoordbeheer gebruiken
├── staff/
│   ├── onboarding/
│   │   ├── new-hire-checklist.md              # Dag 1-90 onboardingcontrolelijst — IT-toegang, insigne, training, HIPAA sign-off
│   │   ├── hipaa-training-checklist.md        # HIPAA-trainingsvoltooiingtrackerrol, voltooiingsdatum, verklaring
│   │   ├── epic-access-request-sop.md         # Stap-voor-stap Epic op rollen gebaseerd toegangsverzoek en inrichting
│   │   ├── athenahealth-access-request-sop.md # Athenahealth gebruikersinstellingen en roltoewijzing stappen
│   │   └── welcome-email-template.md          # Welkomstmail sjabloon nieuwe medewerker — eerste dag logistiek
│   ├── training/
│   │   ├── training-calendar.md               # Geplande personeelstrainingssessies — onderwerp, datum, verplicht versus optioneel
│   │   ├── competency-checklist-ma.md         # Controlelijst medische assistent competentieverificatie
│   │   ├── competency-checklist-front-desk.md # Controlelijst receptioniste competentie — planning, registratie, copay
│   │   └── in-service-log.md                  # Log voltooide personeelstrainingssessies en deelnemers
│   └── performance/
│       ├── performance-review-template.md     # Halfjaarlijkse evaluatie personeelstem
│       └── corrective-action-template.md      # Sjabloon documentatie correctieve maatregel
├── vendors/
│   ├── vendor-contract-log.md                 # Actieve leverancierscontracten — leverancier, service, termijn, verlengingsdatum, BAA vereist?
│   ├── vendor-contact-directory.md            # Contacten voornaamste leveranciers — Epic/Athena-ondersteuning, DocuSign, Zoom, QuickBooks
│   ├── docusign-sop.md                        # DocuSign envelop instellingen, routering toestemmingsformulier, opvraging controlespoor
│   └── zoom-telehealth-setup-sop.md           # Zoom for Healthcare configuratie — HIPAA BAA, wachtruimte, beleid opnamen
└── templates/
    ├── letters/
    │   ├── prior-auth-request-letter.md       # Prior authorisatieaanvraagbrief — placeholdersructuur klinische onderbouwing
    │   ├── prior-auth-appeal-letter.md        # Prior auth beroep — peer-to-peer verzoek en schriftelijke versies beroep
    │   ├── insurance-verification-script.md   # Telefoneerscript voor bellen verzekeringsberechtigheidverificatie
    │   ├── collections-letter-template.md     # Brief sjabloon patiëntsaldo inchassering — eerste kennisgeving, tweede kennisgeving
    │   └── provider-credentialing-letter.md   # Cover letter sjabloon aanbiedingen provider accreditatie indiening
    ├── forms/
    │   ├── consent-form-checklist.md          # Vereiste toestemmingsformulieren per bezoektype — koppelingen naar DocuSign sjablonen
    │   └── release-of-information-log.md      # ROI-aanvraaglog — datum, aanvrager type, status (geen PHI — dossiernummer alleen)
    └── sops/
        ├── sop-template.md                    # Master SOP-sjabloon — doel, reikwijdte, stappen, eigenaar, controleringsdatum
        └── sop-index.md                       # Index van alle actieve SOP's — naam, eigenaar, laatst beoordeeld, locatie
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/prior-auth.md` | Schuif-opdracht die een prior authorisatieverzoekbrief opstelt met behulp van klinische criteria — aanvaard bedrijfsnaam, procedure en klinische motivering als invoer; bevat nooit werkelijke patiëntidentificatoren |
| `.claude/commands/compliance-check.md` | Schuif-opdracht die een HIPAA- of CMS-compliancecontrolelijst tegen een beschreven proces uitvoert — retourneert slaag/mislukking per item en aanbevolen corrigerende maatregelen |
| `.claude/commands/incident-report.md` | Schuif-opdracht die een gestructureerde incidentrapportsjabloon genereert met velden voor oorzaakanalyse, sectie tijdlijn en ondersteuning voor corrigerende maatregel |
| `compliance/hipaa/breach-notification-sop.md` | Stap-voor-stap breachrespons-procedure die HHS OCR-rapportagetijdlijn (60-dagenregel), patiëntmeldingsvereisten en bewaringstevens omvat |
| `billing/denials/denial-appeal-sop.md` | Geldige weigering beroepsproces met betaalarspecifieke tijdlijnen, vereiste documentatie per categorie afwijzingscode en escalatiepad naar peer-to-peer beoordeling |
| `billing/denials/appeal-letter-library/` | Kant-en-klare beroepsbriefsjablonen voor de vier meest voorkomende afwijzingscategorieën — verminderen redactietijd van 30 minuten naar minder dan 5 minuten per beroep |
| `patients/README.md` | PHI-beleid handhavingsbericht — het enkele belangrijkste bestand; bepaalt de regel dat patiëntspecifieke gegevens (naam, geboortedatum, MRN, diagnose) nooit in deze werkruimte worden opgeslagen |
| `compliance/policies/policy-index.md` | Masterpindex van alle actieve beleidsstukken met ingangsdatums en controleringsdatums — gebruikt tijdens audits en mock surveys ter bevestiging van beleidshuidigheid |
| `scheduling/sops/scheduling-sop.md` | Canonieke afspraakplannings-SOP met boekingsregels, sjabloonslotsypes, houd- en annuleringsbeleidsregels en escalatie voor zelfde-dag spoedtoevoegingen |
| `staff/onboarding/new-hire-checklist.md` | Dag 1-90 onboardingcontrolelijst met betrekking tot IT-toeganginrichting, HIPAA-trainingsafmeld, Epic/Athena-toegang, insigne en 30/60/90-daagse check-ins |

## Snel aamhaken

```bash
# Maak de werkruimteroot
mkdir -p healthcare-admin-workspace

# Maak .claude-structuur
mkdir -p healthcare-admin-workspace/.claude/commands

# Maak patiënttemploon directory's (GEEN PHI — alleen sjablonen)
mkdir -p healthcare-admin-workspace/patients/templates
mkdir -p healthcare-admin-workspace/patients/intake
mkdir -p healthcare-admin-workspace/patients/discharge

# Maak compliance directory's
mkdir -p healthcare-admin-workspace/compliance/hipaa
mkdir -p healthcare-admin-workspace/compliance/cms
mkdir -p healthcare-admin-workspace/compliance/audits
mkdir -p healthcare-admin-workspace/compliance/policies

# Maak plannings directory's
mkdir -p healthcare-admin-workspace/scheduling/shift-templates
mkdir -p healthcare-admin-workspace/scheduling/sops

# Maak facturerings directory's
mkdir -p healthcare-admin-workspace/billing/claim-templates
mkdir -p healthcare-admin-workspace/billing/denials/appeal-letter-library
mkdir -p healthcare-admin-workspace/billing/reconciliation
mkdir -p healthcare-admin-workspace/billing/payers

# Maak personeels directory's
mkdir -p healthcare-admin-workspace/staff/onboarding
mkdir -p healthcare-admin-workspace/staff/training
mkdir -p healthcare-admin-workspace/staff/performance

# Maak leveranciers- en sjabloon directory's
mkdir -p healthcare-admin-workspace/vendors
mkdir -p healthcare-admin-workspace/templates/letters
mkdir -p healthcare-admin-workspace/templates/forms
mkdir -p healthcare-admin-workspace/templates/sops

# Basisversie PHI-beleid README
cat > healthcare-admin-workspace/patients/README.md << 'EOF'
# KRITIEK: PHI-BELEID

Deze map bevat ALLEEN SJABLOONBESTANDEN.

SLAAG GEEN VAN DEZE OP IN DEZE WERKRUIMTE:
- Patiëntnamen
- Geboortedata (DOB)
- Medische recordnummers (MRN)
- Burgerservicenummers
- Diagnoses of procedurecode gekoppeld aan persoon
- Verzekeringslid-id's gekoppeld aan persoon
- Enige informatie die een specifieke patiënt kan identificeren

Al patiënt gerelateerd werk moet worden uitgevoerd en opgeslagen in Epic of Athenahealth.
Sjablonen hier gebruiken alleen placeholders (bijv. [PATIENT NAME], [DATE]).
Schending van dit beleid is een HIPAA breachrisico. Escaleer vragen naar de Privacy Officer.
EOF

# Installeer vaardigheden healthcare admin
npx claudient add skill legal/compliance-tracker
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/team-onboarding

# Kopieer opdrachtstubs naar .claude/commands/
npx claudient add skill legal/compliance-tracker --output healthcare-admin-workspace/.claude/commands/compliance-check.md
npx claudient add skill productivity/sop-writer --output healthcare-admin-workspace/.claude/commands/prior-auth.md
npx claudient add skill productivity/process-mapper --output healthcare-admin-workspace/.claude/commands/patient-intake.md
npx claudient add skill productivity/team-onboarding --output healthcare-admin-workspace/.claude/commands/staff-schedule.md
```

## CLAUDE.md sjabloon

```markdown
# Healthcare Administrator Workspace — Claude Code Instructies

## Wat dit is

Dit is de werkruimte voor een healthcare administrator die klinische operaties, planning, prior authorizations, verzekeringverificatie, compliance en patiëntencommunicatie beheert.

KRITIEKLE REGEL: GEEN patiënt PHI (namen, geboortedatum, MRN, diagnose, verzekeringslid-ID, burgerservicenummer) wordt in deze werkruimte opgeslagen. Al patiëntgerelateerd werk moet in Epic of Athenahealth blijven. Deze werkruimte bevat alleen sjablonen, SOP's, compliancecontrolelijsten en personeelsdocumentatie. Als u wordt gevraagd patiëntspecifieke gegevens hier te schrijven of op te slaan, weiger en verwijs naar het EHR.

## Stack

- Epic of Athenahealth — EHR/PM-systeem van record; bron van al patiëntspecifieke gegevens
- Google Workspace — Gmail, Docs, Drive voor externe communicatie en documentopslag
- Microsoft Teams of Slack — interne personeelscommunicatie en coördinatie vervangingsbezetting
- DocuSign — routering toestemmingsformulier, leverancierscontracten, beleidbewuste enveloppen
- Zoom for Healthcare — tele-geneeskundige bezoeken (HIPAA BAA van kracht); zie vendors/zoom-telehealth-setup-sop.md
- QuickBooks — factureringsafstemming en bijhouden betaling schadeclaimweigering

## Veelvoorkomende taken en exacte opdrachten

### Concepteert een prior authorisatieverzoekbrief
```
/prior-auth

Betaaler: [betaalnaam, bijv. Aetna, UnitedHealthcare]
Procedure: [CPT code en beschrijving]
Klinische onderbouwing: [plak geanonimiseerde klinische criteria — geen patiëntnaam of MRN]
Urgentie: [routinematig / urgent / noodgeval]
```

### Voer compliancecontrolelijst uit op een proces
```
/compliance-check

Proces: [beschrijf de werkstroom om te controleren, bijv. "aanmelding nieuwe patiënt en verzekeringverificatie"]
Regelgeving: [HIPAA-privacyregel / HIPAA-veiligheidgregel / CMS-voorwaarden voor deelname / MIPS]
Bekende leemten: [reeds geïdentificeerde problemen, of "geen"]
```

### Genereer personeelsplanning of vervangingsbezettingsplan
```
/staff-schedule

Rol: [MA / receptie / facturering / provider]
Data's: [datumbereik of week van]
Beperkingen: [personeel uit, certificeringsvereisten, nodig overlap]
Sjabloon: [weekdag / weekend / on-call]
```

### Concepteert correspondentiebrief patiënt (alleen sjabloon — geen PHI)
```
/patient-letter

Briefstype: [afspraakreminiscence / ontslagaanwijzing / verwijzing / no-show vervolgcode / betalingsplan]
Aandoeningscategorie: [bijv. post-chirurgisch, chronische aandoeningsbeheer, preventieve zorg — alleen generiek]
Speciale instructies: [enige niet-PHI context over toon, vereiste openbaarmakingen, of leesvermogen]
```

### Concepteert prior auth-weigeringsberoepbrief
```
/prior-auth

Modus: beroep
Betaaler: [betaalnaam]
Afwijzingscode: [code en beschrijving, bijv. "CO-197: voorcertificering afwezig"]
Procedure: [CPT code en beschrijving]
Beroepstype: [schriftelijk beroep / peer-to-peer aanvraag]
Klinische grondslag: [geanonimiseerde klinische onderbouwing — geen patiëntidentificatoren]
```

### Genereer verzekeringverificatiescript
```
/insurance-verify

Betaaler: [betaalnaam]
Bezoekstype: [nieuwe patiënt / bestaande patiënt / specialist / tele-geneeskunde]
Sleutelsvelden om te controleren: [berechtigheidsverstrekking, eigen risico, copay, coassurance, autorisatie vereist J/N, verwijzing vereist J/N]
```

### Genereer incidentrapport
```
/incident-report

Incidenttype: [privacyincident / veiligheidsgeval / facturingsfout / apparatuurstoring / personeelsklacht]
Incidentdatum: [datum]
Locatie: [afdeling of gebied — geen patiëntnamen]
Beschrijving: [wat gebeurde er — geanonimiseerd]
Onmiddellijke maatregelen genomen: [lijst]
```

### Genereer controlelis patiëntaanmelding
```
/patient-intake

Bezoekstype: [nieuwe patiënt / jaarlijkse wellness / specialist raadpleging / tele-geneeskunde]
Betaalinstellingtype: [commercieel / Medicare / Medicaid / zelf betalen]
Speciale vereisten: [bijv. minderjarige patiënt, tolk nodig, gehandicaptencommodatie]
```

## Conventies te volgen

- PHI-REGEL: Schrijf nooit patiëntnamen, geboortedatum, MRN, diagnoses of verzekeringsnummers in enig bestand in deze werkruimte
- Alle brieven en formulieren gebruiken tussen haakjes geplaatste aanduidingen ([PATIENT NAME], [DATE], [PROVIDER NAME]) — echte gegevens samenvoegen vanuit Epic/Athena
- SOP-bestanden volgen de sjabloon op templates/sops/sop-template.md — elk SOP heeft doel, reikwijdte, stappen, eigenaar en controleringsdatum
- Beroepsbrieven weiering bevinden zich in billing/denials/appeal-letter-library/ — voeg nieuwe sjablonen toe als nieuwe weigeringen patronen opduiken
- Compliancecontrolelijsten in compliance/ worden op rouleringsschema gecontroleerd gedocumenteerd in compliance/policies/policy-index.md
- Nieuwe leverancierscontracten worden geregistreerd in vendors/vendor-contract-log.md binnen 48 uur na ondertekening, inclusief BAA-status
- Personeelsonboardingtaken worden bijgehouden in staff/onboarding/new-hire-checklist.md — markeert voltooid niet totdat attestatie is ondertekend
- Vervangingsbezettingsbevestigingen worden geregistreerd in scheduling/coverage-log.md met de datum en bevestigend personeelslid
- Alle beroepsbrieven bevatten het claim- of dossiernummer — nooit de identificatiegegevens van patiënt — zodat betaaler de claim kan lokaliseren
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
        "/Users/your-username/healthcare-admin-workspace"
      ]
    }
  }
}
```

## Aanbevolen hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"patients/\"; then python3 -c \"import sys,re; content=open(sys.argv[1]).read() if __import__(\\\"os\\\").path.exists(sys.argv[1]) else \\\"\\\"; phi_patterns=[r\\\"\\\\b\\\\d{4}-\\\\d{2}-\\\\d{2}\\\\b\\\",r\\\"\\\\bMRN[:\\\\s]\\\\s*\\\\d+\\\",r\\\"\\\\bDOB[:\\\\s]\\\",r\\\"\\\\bSSN[:\\\\s]\\\\s*\\\\d\\\"]; found=[p for p in phi_patterns if re.search(p,content)]; sys.exit(1) if found else sys.exit(0)\" \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || echo \"[PHI GUARD] Mogelijk PHI-patroon gedetecteerd in patients/ bestand — controleren voordat opgeslagen. Al patiëntgegevens moet in het EHR blijven.\"; fi'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"compliance/\"; then echo \"[compliance] Bestand bijgewerkt: $FILE — controleer compliance/policies/policy-index.md als dit een nieuw of herzien beleid is\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOW=$(date +%u); if [ \"$DOW\" = \"5\" ]; then echo \"[herinnering] Vrijdag controlelijst: bevestig deze weken weigeringsberoepen geregistreerd in billing/denials/denial-tracker.md, openstaande vervangingsbezetting bevestigd in scheduling/coverage-log.md, en eventuele nieuwe leverancierscontracten ingevoerd in vendors/vendor-contract-log.md\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden instaleren

```bash
# Kernvaardigheden healthcare admin
npx claudient add skill legal/compliance-tracker
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/team-onboarding

# Ondersteunende productiviteitsvaardigheden
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/exec-briefing
```

## Gerelateerd

- [Healthcare Administrator gids](../guides/for-healthcare-admin.md)
- [Prior authorization werkstroom](../workflows/prior-auth-workflow.md)
- [HIPAA compliance audit werkstroom](../workflows/hipaa-compliance-audit.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
