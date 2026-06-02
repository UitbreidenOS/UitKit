---
name: email-deliverability
description: "Audit e-mailafleverbaarheid: SPF/DKIM/DMARC-controle, spamtriggeranalyse, lijsthygiëne, opwarmstrategie"
---

# Vaardigheid: E-mailafleverbaarheid

## Wanneer te activeren
- Open rates dalen onverwacht (> 20% daling week-over-week)
- Een campagne belandt in de spammap of promotiemap in plaats van de inbox
- Je stelt een nieuw verzenddomein in en moet authenticatie configureren
- Je hebt je verzendinfrastructuur nog nooit geaudit en weet niet zeker of het correct is geconfigureerd
- Je lanceert een nieuw e-mailplatform of IP-adres en hebt een opwarmplan nodig
- Je ziet hoge bouncepercentages (> 2%) of spamklachtenpercentages (> 0,1%)

## Wanneer NIET te gebruiken
- E-mailcopywriting — gebruik daarvoor de vaardigheden `/email-sequence` of `/email-campaign`
- Strategische campagnebeslissingen — deze vaardigheid gaat over infrastructuur en hygiëne, niet over berichtgeving
- CRM-gegevensbeheer — gebruik je CRM-tool; deze vaardigheid diagnosticeert de verzondingsgezondheid
- Eenmalige transactionele e-mails die je volledig zelf beheert (wachtwoordherstel, bonnen) — focus op marketingverzendingen

## Instructies

### Volledige audit van afleverbaarheid

```
Voer een leveringsaudit uit op mijn e-mailverzendopstelling.

Mijn opstelling:
- E-mailplatform: [Mailchimp / Klaviyo / HubSpot / SendGrid / Postmark / anders]
- Verzenddomein: [bijv. newsletter.mijnbedrijf.com of mijnbedrijf.com]
- Maandelijks verzendvolume: [X e-mails/maand]
- Lijstgrootte: [X abonnees]
- Leeftijd van de lijst: [hoe oud is het oudste segment?]
- Gemiddelde open rate (afgelopen 3 maanden): [X%]
- Gemiddelde klikfrequentie: [X%]
- Bouncepercentage: [X%]
- Spamklachtenpercentage: [X%] (te vinden in de analytics van je platform)
- Huidige inboxplaatsing: [inbox / promoties / spam — of onbekend]

Voer een diagnose uit op deze gebieden:

## 1. Authenticatie (SPF / DKIM / DMARC)
Controleer deze records voor [DOMEIN]:
SPF: verifieer of de TXT-record de servers van je verzendplatform bevat
DKIM: verifieer of de CNAME- of TXT-records van je platform actief zijn
DMARC: verifieer of er een DMARC-beleid bestaat en wat het doet (none / quarantine / reject)

Wat elk betekent:
- SPF ontbreekt → gemakkelijke spamclassificatie, sommige providers weigeren volledig
- DKIM ontbreekt → geen cryptografische handtekening → behandeld als niet-ondertekende/niet-geverifieerde e-mail
- DMARC ontbreekt → domeinvervalsing triviaal → providers straffen het domein

Aanbevolen DMARC-startbeleid:
v=DMARC1; p=none; rua=mailto:dmarc-reports@joudomein.com; pct=100

Ga na 30 dagen met schone rapporten naar p=quarantine, daarna na 60 dagen naar p=reject.

## 2. Configuratie van verzenddomein
- Verzend je vanaf een subdomein (newsletter.bedrijf.com) of rootdomein?
  Aanbeveling: subdomein voor marketing, rootdomein voor transactioneel — afzonderlijke reputatiepools
- Komt het Van-adres overeen met het geauthenticeerde domein?
- Is het Antwoorden-naar anders dan het Van-adres? (geen probleem, maar noteer het)
- Heeft het verzend-IP reverse DNS (PTR-record)?

## 3. Inhoudsanalyse
Plak hieronder een recente e-mail in HTML + tekstversie en ik scan op:
- Spamtriggerwoorden in onderwerpregel en inhoud
- Tekst-tot-afbeeldingsverhouding (< 20% tekst = waarschijnlijk promotiemap)
- Linkdomeinen — gebruik je een aangepast kliktrackingdomein?
- Alt-tekst op afbeeldingen (ontbreekt = spamsignaal)
- Aanwezigheid van uitschrijflink (wettelijk verplicht, verbetert afleverbaarheid)
- List-Unsubscribe-header (moet aanwezig zijn in headers)
- Fysiek adres in footer (CAN-SPAM-vereiste)

## 4. Lijsthygiëne
Geef je lijstverdeling:
- Totaal abonnees: [X]
- Nooit geopend in 90 dagen: [X] → kandidaat voor onderdrukking
- Nooit geopend in 180 dagen: [X] → sunset / herengagement nodig
- Harde bounces: [X] → moet onmiddellijk worden verwijderd
- Zachte bounces (3+ keer): [X] → verwijder
- Uitschrijvingen niet gehonoreerd binnen 10 dagen: [X] → juridisch risico, onmiddellijk oplossen

## 5. Betrokkenheidssegmentatie
De belangrijkste factor voor afleverbaarheid in 2024+ is betrokkenheid.
Gmail en Apple Mail filteren primair op basis van of ontvangers betrokken zijn.

Segmenteer je lijst:
- Zeer betrokken: geopend of geklikt in de afgelopen 30 dagen → Prioriteit 1 verzending
- Betrokken: geopend in de afgelopen 90 dagen → Standaard verzending
- Licht betrokken: laatste opening 90-180 dagen geleden → Herengagementcampagne voor opname
- Inactief: geen opening in 180+ dagen → Sunset-reeks, daarna verwijderen

Stuur nooit naar inactieve abonnees gemengd met betrokken abonnees.
Het klachten- en niet-betrokkenheidspercentage van inactieve segmenten schaadt de reputatie van je gehele domein.

## 6. Samenvatting van de afleveringsscore
| Gebied | Status | Vereiste actie |
|---|---|---|
| SPF | ✓ / ✗ | [repareer indien ontbreekt] |
| DKIM | ✓ / ✗ | [repareer indien ontbreekt] |
| DMARC | ✓ / none / reject | [stel beleid in] |
| Subdomein-isolatie | ✓ / ✗ | [splits indien nodig] |
| Lijsthygiëne | Schoon / Problemen | [beschrijf problemen] |
| Betrokkenheidssegmenten | Gesegmenteerd / Niet gesegmenteerd | [actie] |
| Inhoudsmarkeringen | [N gevonden problemen] | [lijst] |

Algehele gezondheid: Groen / Oranje / Rood
Prioriteitsacties gerangschikt naar impact: [genummerde lijst]
```

### Handleiding voor DNS-recordconfiguratie

```
Genereer de exacte DNS-records die ik moet configureren voor [VERZENDPLATFORM] op domein [DOMEIN].

Platform: [Mailchimp / Klaviyo / SendGrid / Postmark / HubSpot / anders]
Verzenddomein: [joudomein.com of subdomein]
Huidige DNS-provider: [Cloudflare / Route53 / GoDaddy / Namecheap / anders]

Genereer:

## SPF-record
Type: TXT
Host: @ (of subdomein)
Waarde: [platform-specifieke include-verklaring]
Voorbeeld: "v=spf1 include:sendgrid.net include:_spf.google.com ~all"
TTL: 3600

Opmerking: slechts ÉÉN SPF-record per domein/subdomein. Als je er al één hebt, voeg je de nieuwe include toe — maak geen tweede TXT-record aan.

## DKIM-records
[Platform levert deze aan — vermeld de CNAME- of TXT-records met host en waarde]
Type: CNAME of TXT (platform-afhankelijk)
TTL: 3600

## DMARC-record
Type: TXT
Host: _dmarc.[domein]
Waarde: v=DMARC1; p=none; rua=mailto:dmarc@[domein]; pct=100
Begin met p=none. Bekijk rapporten gedurende 30 dagen. Ga naar p=quarantine, daarna naar p=reject.

## BIMI-record (optioneel — merklogo in inbox)
Vereist DMARC met p=quarantine of p=reject eerst.
Type: TXT
Host: default._bimi.[domein]
Waarde: v=BIMI1; l=https://[domein]/logo.svg; a=;

## Verificatiestappen na DNS-propagatie (24-48 uur)
Test SPF: gebruik MXToolbox SPF-recordchecker
Test DKIM: stuur een teste-mail en controleer headers in Gmail (Broncode weergeven)
Test DMARC: controleer [domein] op dmarcanalyzer.com
Test afleverbaarheid: stuur naar mail-tester.com voor een score op 10
```

### Scanner voor spamtriggerwoorden

```
Scan deze e-mail op spamtriggers.

Onderwerpregel: [plak]
Previewtekst: [plak]
E-mailinhoud: [plak platte tekst of HTML]

Controleer op:
1. Klassieke spamwoorden in onderwerpregel (volledig vermijden):
   - Financieel: "gratis geld", "gegarandeerd inkomen", "geen risico", "verdien €", "cash"
   - Urgentiemisbruik: "doe nu", "beperkte tijd!!!", "haast je", "mis het niet"
   - Te promotioneel: "beste prijs", "koop nu", "korting", "laagste prijs"
   - Phishingpatronen: "klik hier", "verifieer je", "bevestig je account"
   - OVERDREVEN HOOFDLETTERS EN UITROEPTEKENS!!!

2. Problemen met de inhoud:
   - Afbeelding-tot-tekstverhouding: afbeeldingen zonder alt-tekst + minimale tekst = promotie/spam
   - Links naar verdachte domeinen of niet-gerelateerde trackingdomeinen
   - Ontbrekende of begraven uitschrijflink
   - Geen fysiek adres in footer

3. Lengte en interpunctie van de onderwerpregel:
   - Optimale lengte: 30-50 tekens
   - Vermijd: 3+ leestekens, 3+ emoji op een rij
   - Vermijd: geheel kleine letters of ALLE HOOFDLETTERS in de onderwerpregel

4. HTML-problemen:
   - Alleen inline stijlen (externe CSS kan worden verwijderd)
   - Schone HTML — niet gekopieerd vanuit Word (Word sluit verborgen tags in)
   - Tekstversie aanwezig (HTML zonder platte-tekst backup = spamsignaal)

Resultaat:
- Spamrisicoscore: Laag / Gemiddeld / Hoog
- Gevonden specifieke triggers en welke regel ze overtreden
- Herziene onderwerpregel (indien nodig)
- Top 3 inhoudsverbeteringen
```

### Opwarmschema voor nieuw domein

```
Bouw een opwarmschema voor een nieuw verzenddomein of IP.

Domein/IP: [nieuw verzenddomein of IP-adres]
Doelzendvolume: [X e-mails/maand op volledige schaal]
Kwaliteit van de startlijst: [geverifieerde opt-in, dubbele opt-in, of geïmporteerd/onbekend]
Platform: [naam ESP]

Opwarmprincipes:
1. Begin met je meest betrokken abonnees (recente opens en klikken) — zij signaleren positieve betrokkenheid
2. Verhoog langzaam — verdubbelen of verdrievoudigen te snel activeert spamfilters
3. Bewaak bouncepercentage en klachtenpercentage dagelijks tijdens het opwarmen
4. Stuur nooit naar een koude/inactieve lijst tijdens het opwarmen — dit schaadt de reputatie van het domein vanaf dag 1
5. Consistent dagelijks verzenden is beter dan onregelmatige grote verzendingen

Opwarmschema:

Week 1:
- Dagelijks volume: 50 e-mails
- Stuur naar: Meest betrokken abonnees (afgelopen 7 dagen)
- Bouncepercentage drempel: < 1%
- Klachtendrempel: < 0,05%

Week 2:
- Dagelijks volume: 200 e-mails
- Stuur naar: Betrokken (afgelopen 30 dagen)
- Drempels: hetzelfde

Week 3:
- Dagelijks volume: 500 e-mails
- Stuur naar: Betrokken (afgelopen 60 dagen)

Week 4:
- Dagelijks volume: 1.000-2.000 e-mails
- Stuur naar: Betrokken (afgelopen 90 dagen)

Maand 2:
- Ophogen naar 10% van het doelvolume
- Begin matig betrokken abonnees op te nemen (afgelopen 180 dagen)

Maand 3+:
- Vol volume, alle geverifieerde abonnees
- Inactief > 180 dagen: sunset-campagne vóór opname

Als het bouncepercentage 2% overschrijdt of het klachtenpercentage 0,1% in welke fase dan ook:
STOP de ophoging. Diagnosticeer. Reinig de lijst. Hervat vanaf het vorige volumeniveau.

Genereer mijn specifieke wekelijkse schema van [STARTDATUM] om [DOELVOLUME] te bereiken op [DOELDATUM].
```

### SOP voor lijsthygiëne

```
Genereer een standaard operationele procedure voor lijsthygiëne voor [PLATFORM].

Huidige lijst: [X abonnees]
Huidige problemen: [hoge bounces / lage open rate / spamklachten / al het bovenstaande]

Hygiëne-checklist (maandelijks uitvoeren):

1. Verwijder harde bounces onmiddellijk
   Definitie: e-mailadres bestaat niet of is permanent niet-bezorgbaar
   Actie: automatisch onderdrukt door de meeste platforms — verifieer of je platform dit doet

2. Verwijder geaccumuleerde zachte bounces
   Definitie: 3+ zachte bounces in 90 dagen (mailbox vol, tijdelijk serverprobleem)
   Actie: verplaats naar onderdruklijst, verifieer opnieuw via een e-mailverificatiedienst

3. Verwijder spamklagers
   Definitie: abonnee klikte op "markeer als spam" (aan jou gerapporteerd via feedbacklus)
   Actie: onmiddellijk onderdrukken, niet opnieuw inschrijven ook al vragen ze vriendelijk

4. Sunset inactieve abonnees (kwartaallijks)
   Definitie: geen e-mailopening in 180 dagen
   Procedure:
   a. Stuur 3-e-mail herengagementcampagne over 2 weken
   b. Bijhouden wie opent of klikt — herstel naar actieve lijst
   c. Na 3 e-mails zonder betrokkenheid: permanent verwijderen
   d. Verstuur niet opnieuw naar verwijderde contacten — respecteer hun impliciete opt-out

5. Verifieer nieuwe lijstimports
   Vóór het verzenden naar een geïmporteerde lijst (beurs, gekocht, oude CRM-gegevens):
   - Voer door een e-mailverificatiedienst (NeverBounce, ZeroBounce, BriteVerify)
   - Verwijder onbekende/risicovolle adressen (> 5% risicovolle adressen = stuur helemaal niet)
   - Dubbele opt-in-bevestiging vóór toevoeging aan marketingverzendingen

Resultaat: maandelijkse hygiënekalender en sjabloone-mail voor herengagementreeks.
```

### Referentie voor belangrijke afleverbarheidsmetrieken

```typescript
interface DeliverabilityHealth {
  // Inbox placement rate (use GlockApps, Litmus, or 250ok to measure)
  inboxPlacementRate: number  // target: > 90%

  // From your ESP dashboard
  openRate: number            // target: > 20% (Gmail/Apple Mail clip post-privacy)
  clickRate: number           // target: > 2%
  bounceRate: number          // alert at > 2%, danger at > 5%
  spamComplaintRate: number   // alert at > 0.08%, danger at > 0.1% (Google threshold)
  unsubscribeRate: number     // alert at > 0.5% per campaign

  // List health
  activeEngagedPercent: number    // subscribers who opened in last 90 days / total
  inactivePercent: number         // no open in 180 days / total
}

const DELIVERABILITY_THRESHOLDS = {
  inboxPlacementRate: { healthy: 0.90, concern: 0.80, critical: 0.70 },
  bounceRate: { healthy: 0.02, concern: 0.05, critical: 0.10 },
  spamComplaintRate: { healthy: 0.0005, concern: 0.001, critical: 0.003 },
  // Note: Google's postmaster tools flag domains at 0.1% complaint rate
  // Apple Mail Privacy Protection (iOS 15+) inflates open rates — do not use open rate alone
}
```

## Voorbeeld

**Gebruiker:** Mijn open rates zijn in 3 maanden gedaald van 32% naar 19%. Ik heb niets veranderd. Wat controleer ik eerst?

**Diagnostisch raamwerk:**

```
Een daling van 13 procentpunten in open rate in 3 maanden zonder inhoudswijzigingen wijst op een van deze oorzaken
in volgorde van waarschijnlijkheid:

1. Lijstverval — inactieve abonnees zijn opgestapeld en drukken de betrokkenheid
   Controleer: % van je lijst met geen opening in 90 dagen. Als > 30%, is dit je oorzaak.
   Oplossing: onderdruk inactief segment onmiddellijk, start herengagementcampagne

2. Verschuiving in afleverbaarheid — domein- of IP-reputatie veranderd (gebruikelijk na een hoge-bounce-verzending)
   Controleer: log in op Google Postmaster Tools voor je domein. Bekijk domeinreputatie en
   spampercentagediagrammen. Een daling in domeinreputatie correleert direct met verlies van inboxplaatsing.
   Oplossing: voer een volledige authenticatieaudit uit, reinig de lijst, verminder verzendfrequentie gedurende 30 dagen

3. Accumulatie van Apple Mail Privacy Protection — als je lijst sterk uit iOS-gebruikers bestaat,
   kunstmatig geïnfleerde opens uit 2021 lopen nu af naarmate die gebruikers inactief worden.
   Dit is geen echt afleverprobleem — het is een meetprobleem.
   Oplossing: schakel over naar klikfrequentie als primaire betrokkenheidsmetriek. Open rate is onbetrouwbaar voor iOS.

4. Verzenddomeinwijziging — ben je gemigreerd naar een nieuw subdomein, ESP of IP zonder opnieuw op te warmen?
   Controleer: e-mailheaders van een verzonden campagne. Wat is het werkelijke verzend-IP?
   Oplossing: opwarmschema voor nieuwe infrastructuur.

Begin met Google Postmaster Tools — het is gratis en vertelt je binnen 24 uur of Gmail
je domein als spammy classificeert. Dat vernauwt de diagnose onmiddellijk.
```

---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarscommunities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
