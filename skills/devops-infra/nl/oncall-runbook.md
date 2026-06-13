---
name: oncall-runbook
description: "Genereer on-call runbooks op basis van incidentgeschiedenis: veelvoorkomende meldingen, oplossingsstappen, escalatiepaden"
---

# On-Call Runbookgenerator Vaardigheid

## Wanneer activeren
- Het schrijven van een runbook voor een nieuwe dienst die productie ingaat
- Het formaliseren van impliciete kennis voordat een engineer uit de on-call-rotatie roteert
- Het genereren van runbooksjablonen op basis van eerdere incidentrapportages of PagerDuty-geschiedenis
- Het bouwen van escalatiebomen voor een nieuw team of nieuwe dienstgrens
- Het auditeren van bestaande runbooks op volledigheid en actualiteit
- Het inwerken van een nieuwe engineer in een on-call-rotatie

## Wanneer NIET gebruiken
- Realtime incidentrespons — gebruik daarvoor `/incident-response`
- Infrastructuurontwerp — gebruik `/aws-architect`, `/terraform` of `/kubernetes`
- Disaster recovery-planning (RPO/RTO, back-upstrategie) — die zijn afzonderlijk van runbooks
- Geautomatiseerde herstelscripts — runbooks documenteren wat te doen; automatisering is een afzonderlijk aandachtspunt

## Instructies

### Kernprompt voor runbookgeneratie op basis van incidentgeschiedenis

```
Genereer een on-call runbook voor de dienst [DIENSTNAAM].

Invoer (geef zoveel als u heeft):
- Eerdere incidentrapportages of post-mortems: [plak of beschrijf]
- Bestaande PagerDuty-meldingsnamen: [vermeld]
- Bekende storingmodi die het team heeft meegemaakt: [beschrijf]
- Huidige handmatige stappen die worden gebruikt om veelvoorkomende problemen op te lossen: [beschrijf]
- Dienstarchitectuur: [beknopte beschrijving — wat het doet, hoe het werkt, kernafhankelijkheden]
- SLO voor deze dienst: [beschikbaarheidsdoel, latencydoel]

Stel het runbook op met deze structuur:

# [DIENSTNAAM] On-Call Runbook

## Dienstoverzicht (60-seconden context)
- Wat deze dienst doet: [één zin]
- Wie er van afhankelijk is: [upstream- en downstreamdiensten, getroffen klanten]
- Technologiestack: [taal, framework, cloudprovider, database, berichtenwachtrij]
- SLO: [beschikbaarheid X%, p99-latency < Xms]
- Gegevensclassificatie: [verwerkt het PII / betalingen / gevoelige gegevens?]
- Eigenaarsteam: [teamnaam, Slack-kanaal, escalatiecontact]

## Architectuurdiagram (tekstrepresentatie)
[Teken een tekstgebaseerde stroom: extern verkeer → load balancer → dienst → afhankelijkheden]

## Meldingscatalogus
Per bekende melding:

### MELDING: [meldingsnaam van PagerDuty/Datadog/etc.]
**Ernst:** [P1 / P2 / P3]
**Betekenis:** Wat vertelt deze melding u? Welke drempel is overschreden?
**Veelvoorkomende oorzaken (op frequentie):**
1. [Meest voorkomende oorzaak — X% van de gevallen]
2. [Op één na meest voorkomend]
3. [Zeldzame maar ernstige oorzaak]
**Eerste 5 stappen:**
1. [Stap — inclusief exacte opdrachten, niet "controleer de logs"]
2. [Stap met opdracht: `kubectl logs -n [namespace] -l app=[service] --tail=100`]
3. [Stap]
4. [Stap]
5. [Stap]
**Oplossingspatronen:**
- Oorzaak A → doe [specifieke actie]
- Oorzaak B → doe [specifieke actie]
- Oorzaak C → escaleer naar [team/persoon] — probeer niet zelf te herstellen
**Escaleer als:** [voorwaarde die aangeeft dat u menselijke of teamhulp nodig heeft]
**Typische tijd om op te lossen:** [X-Y minuten]

## Escalatiepaden

| Ernst | Eerste responder | Indien onopgelost na X min | Volgende escalatie |
|---|---|---|---|
| P1 | On-call engineer | 15 min | Engineering lead → CTO |
| P2 | On-call engineer | 30 min | Engineering lead |
| P3 | On-call engineer | Volgende werkdag | — |

Contactlijst:
- On-call: [PagerDuty-rotatie]
- Engineering lead: [naam, telefoon, Slack]
- Database-eigenaar: [naam / team, voor DB-gerelateerde P1's]
- Infrastructuurteam: [Slack-kanaal]
- Beveiligingsteam: [indien datalek vermoed — direct contact opnemen]

## Veelgebruikte operaties (buiten incidenten)
[Taken die on-call engineers mogelijk worden gevraagd buiten incidenten:]

### Herstart een dienst-pod
```bash
kubectl rollout restart deployment/[service-name] -n [namespace]
# Verifieer: kubectl rollout status deployment/[service-name] -n [namespace]
```

### Controleer huidig foutpercentage
```bash
# Datadog-query of Grafana-dashboardlink
# Of: kubectl logs opdracht
```

### Activeer handmatig een herimplementatie
[Beschrijf het proces — is het een GitHub Action, ArgoCD-synchronisatie of handmatige stap?]

## Bekende valkuilen
Zaken die on-call engineers eerder hebben overrompeld:
- [Valkuil 1: bijv. "Start de wachtrijverbruiker niet opnieuw tijdens piekuren — lopende taken gaan verloren"]
- [Valkuil 2: bijv. "De stagingomgeving gebruikt een gedeelde database — wijzigingen daar beïnvloeden andere teams"]
- [Valkuil 3]

## Runbook-wijzigingenlog
| Datum | Wijziging | Auteur |
|---|---|---|
| [DATUM] | Initiële aanmaak | [Naam] |

Genereer dit runbook met de incidentgeschiedenis en dienstcontext die ik verstrek.
```

### Meldingsspecifiek runbooksjabloon

```
Genereer een gedetailleerd runbook voor deze specifieke melding: [MELDINGSNAAM]

Meldingsbron: [PagerDuty / Datadog / Prometheus / CloudWatch]
Meldingsdefinitie: [plak de meldingsquery of drempel — bijv. "error_rate > 5% gedurende 5 minuten"]
Getroffen dienst: [dienstnaam]
Typisch moment van optreden: [wanneer treedt deze melding doorgaans op — piekverkeer, na deploy, willekeurig?]

Eerdere incidenten die door deze melding zijn veroorzaakt: [plak incidentgeschiedenis of beschrijf patronen]

Genereer een beslissingsboom voor deze melding:

## [MELDINGSNAAM] Runbook

### Wat deze melding betekent
[Begrijpelijke taal — niet "de drempel is overschreden" maar wat dat voor gebruikers betekent]

### Onmiddellijke ernstbeoordeling (eerste 2 minuten)
Vraag uzelf:
- Staat deze melding alleen, of vuren er gerelateerde meldingen? (controleer: [vermeld gerelateerde meldingen])
- Groeit het foutpercentage, is het stabiel of herstelt het?
- Is dit een nieuwe implementatie in de afgelopen 30 minuten? (controleer: [locatie implementatielog])
- Heb ik dit eerder gezien? (controleer: [link naar incidentgeschiedenis])

### Beslissingsboom

```
MELDING VUURT
│
├── Is dit tijdens of na een deploy?
│   JA → Controleer deploy-logs → terugdraaien als nieuwe code de fout heeft geïntroduceerd
│   NEE ↓
│
├── Is het foutpercentage > 20%?
│   JA → Page engineering lead onmiddellijk (P1)
│   NEE ↓
│
├── Groeit het foutpercentage?
│   JA → Start P2-respons, escaleer in 15 min als het niet verbetert
│   STABIEL → P3-onderzoek, oplossen voor volgende werkdag
│
└── Is het een specifiek fouttype?
    TIMEOUT → [stappen voor timeout-onderzoek]
    5xx → [stappen voor server-foutonderzoek]
    DB → [stappen voor databaseprobleem]
```

### Stapsgewijze onderzoek
[Genummerde stappen met exacte opdrachten en wat bij elke stap te zoeken]

### Oplossingsplaybook
[Per veelvoorkomende oorzaak: exacte oplossingsstappen met opdrachten]

### Na oplossing
Na het oplossen: wat moet u doen?
- Incident bijwerken in PagerDuty / Slack
- Eventuele vervolgactie (ticket aanmaken, belanghebbenden inlichten, runbook bijwerken)
- Post-mortem vereist? [Ja voor P1 / Naar eigen inzicht van on-call engineer voor P2 / Nee voor P3]
```

### Runbookaudit

```
Audit de kwaliteit van dit runbook: [PLAK BESTAAND RUNBOOK]

Beoordeel elke sectie en identificeer hiaten:

VOLLEDIGHEDENCHECKLIST:
✅ Dienstoverzicht met voldoende context voor een nieuwe engineer
✅ Alle bekende meldingen gedocumenteerd (niet alleen de ernstige)
✅ Elke melding heeft: betekenis, veelvoorkomende oorzaken, stapsgewijze oplossing
✅ Opdrachten zijn exact (niet "controleer de logs" maar `kubectl logs -n X -l app=Y`)
✅ Escalatiepaden gedefinieerd met werkelijke namen en contacten (niet alleen rollen)
✅ Bekende valkuilen en antipatronen gedocumenteerd
✅ Veelgebruikte operaties gedocumenteerd (herstart, schaal, terugdraaien)
✅ Runbook is bijgewerkt in de laatste 90 dagen (verouderde runbooks zijn gevaarlijk)

KWALITEITSSIGNALEN:
❌ "Controleer het dashboard" zonder te specificeren welk dashboard of wat te zoeken
❌ Stappen die kennis vereisen die niet in het runbook staat
❌ Escalatiepad zegt "neem contact op met het team" zonder Slack-kanaal of contact
❌ Geen vermelding van wat NIET te doen (vaak het belangrijkste onderdeel)
❌ Meldingsdefinities die niet uitleggen waarom de drempel belangrijk is

ACTUALITEITSCONTROLE:
Wanneer is dit runbook voor het laatst bijgewerkt? Als > 90 dagen: markeer elke procedure voor nauwkeurigheid.
Verwijst het naar diensten, teams of tools die mogelijk zijn veranderd?

Uitvoer: runbookscore (1-10), top 5 hiaten om te verhelpen, en een herschrijving van de slechtste sectie.
```

### Runbook op basis van post-mortem

```
Genereer een runbooksectie op basis van dit post-mortem: [PLAK POST-MORTEM]

Extraheer:
1. De grondoorzaak van het incident
2. De detectiemethode (hoe werd het ontdekt? melding, klantmelding, engineer bemerkte het?)
3. De tijdlijn van de oplossing (welke stappen zijn ondernomen, in welke volgorde)
4. Wat werkte en wat niet
5. De vervolgactiepunten die zijn voltooid (om duplicatie te vermijden)

Converteer dit naar:
- Één nieuwe meldingsingang in het runbook (als de melding niet bestond of onduidelijk was)
- Of: één nieuwe sectie in "Bekende Valkuilen" als dit een verrassing is die terugkeert
- De exacte opdrachten die zijn gebruikt bij de oplossing, met commentaar dat uitlegt waarom

Als het post-mortem een monitoringhiaat heeft geïdentificeerd: stel ook de meldingsdefinitie op.
```

### On-call inwerkgids

```
Genereer een on-call inwerkgids voor een nieuwe engineer die de [DIENST]-rotatie bijvoegt.

Hun achtergrond: [senior engineer / mid-level / nieuw in deze codebase]
Ze voegen zich bij: [eerste solo on-call / eerst schaduw / eerste week]
Rotatieschema: [week aan / week af / volg-de-zon]

Genereer een gestructureerde inwerkgids:

## Voor uw eerste on-call week

Dag 1:
- Lees het volledige runbook — markeer alles wat niet duidelijk is
- Besteed 30 minuten aan het lezen van de laatste 5 incident-post-mortems
- Stel PagerDuty, Datadog/Grafana en Slack-meldingen in
- Bevestig dat u toegang heeft tot: [vermeld alle benodigde systemen — cloudconsole, Kubernetes, database lezen, etc.]

Dag 2-3:
- Schaduw een meer ervaren on-call engineer voor een volledige shift
- Reproduceer de top 2 meest voorkomende incidenten in staging (dit bouwt spiergeheugen op)
- Weet waar te vinden: [loglocaties, dashboards, implementatiegeschiedenis, terugdraaiproces]

Voordat u solo gaat:
- Loop met een senior engineer door elke melding in het runbook: "Wat zou u als eerste doen?"
- Ken de escalatiepaden uit uw hoofd: wie belt u om 3 uur 's nachts voor een P1?
- Test uw PagerDuty-meldingen — bel uzelf daadwerkelijk op

## Wat te doen tijdens uw eerste solo-shift
- Eerste 10 minuten: controleer het dashboard, bevestig dat alle diensten gezond zijn
- Als een melding afgaat: runbook eerst, paniek nooit
- Bij twijfel: escaleer. Het is altijd beter iemand wakker te maken en het fout te hebben dan hem niet wakker te maken en gelijk te hebben.
```

## Voorbeeld

**Gebruiker:** We hebben een Node.js API-dienst genaamd `billing-service`. Die heeft 3 incidenten gehad in de laatste 6 maanden: (1) Redis-verbindingspooluitputting veroorzaakte 503's, (2) een trage PostgreSQL-query blokkeerde alle schrijfbewerkingen, (3) een geheugenlek na een deploy veroorzaakte OOM-kills. Er bestaat geen formeel runbook. PagerDuty-meldingen zijn: `billing-service-503-rate-high`, `billing-service-latency-p99-high`, `billing-service-pod-oom`.

**Uitvoer (uittreksel):**

```markdown
# billing-service On-Call Runbook

## Dienstoverzicht
billing-service is de Node.js API die alle betalingsverwerking en factuurgeneratie afhandelt.
Downstream: klantdashboard, e-maildienst, webhookbezorging.
SLO: 99,9% beschikbaarheid, p99 < 500ms.
Eigenaar: #platform-eng | On-call: PagerDuty-rotatie "billing-oncall"

## Melding: billing-service-503-rate-high
**Ernst:** P1
**Betekenis:** Meer dan 1% van de aanvragen retourneert 503 — klanten kunnen geen betalingen verwerken.

**Veelvoorkomende oorzaken:**
1. Redis-verbindingspooluitputting (2x gezien — treedt op bij hoog verkeer of na verbindingslek)
2. Upstream afhankelijkheidstime-out (betalingsgateway of database)
3. Implementatiefout (nieuwe pods niet gezond)

**Eerste 5 stappen:**
1. `kubectl get pods -n billing -l app=billing-service` — draaien de pods?
2. `kubectl logs -n billing -l app=billing-service --tail=200 | grep -i "redis\|connection\|error"` — zoek naar Redis-fouten
3. Controleer Redis-verbindingsstelling: `redis-cli -h [host] info clients` — is `connected_clients` dicht bij `maxclients`?
4. Als Redis: `kubectl rollout restart deployment/billing-service -n billing` (wist verbindingspool)
5. Als pods niet draaien: controleer recente deploy — `kubectl rollout history deployment/billing-service -n billing`

**BEKENDE VALKUIL:** Start billing-service NIET opnieuw tijdens een betalingsverwerkingsvenster (vrijdag 17u - zaterdag 2u) — lopende transacties worden wees. Overleg met engineering lead voor herstart.

**Escaleer als:** 503-percentage > 5%, of niet opgelost binnen 10 minuten na Redis-herstart.
```

---
