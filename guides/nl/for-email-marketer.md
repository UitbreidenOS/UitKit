# Claude voor E-mailmarketeers

Alles wat een e-mailmarketeer nodig heeft om AI-ondersteunde campagnes te voeren — lijsthygiëne, afleverbaarheid, A/B-testen, automatiseringsflows, copywriting en prestatierapporten.

---

## Voor wie is dit bedoeld

Je bent een e-mailmarketeer, CRM-manager of lifecycle-marketeer wiens taak het is om klanten te werven, te betrekken en te behouden via e-mail. Je schrijft campagnes, beheert automatiseringsflows, onderhoudt de lijstgezondheid, voert split-tests uit en rapporteert over programmaprestaties.

**Voor Claude Code:** Van campagnebrief tot live: 2-3 dagen. A/B-testanalyse: 45 minuten spreadsheetwerk. Afleveringscontrole: een ticket bij het ondersteuningsteam van je ESP. Maandrapport: 3 uur.

**Erna:** Campagneconcept in 25 minuten. A/B-test geïnterpreteerd in 5 minuten. Afleveringscontrole door jezelf uitgevoerd (geen ticket nodig). Maandrapport in 30 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige e-mailmarketingstack
npx claudient add skills marketing/email-sequence
npx claudient add skills small-business/email-campaign
npx claudient add skills marketing/onboarding-cro
npx claudient add skills marketing/analytics-tracking
npx claudient add skills marketing/email-deliverability
npx claudient add skills marketing/email-ab-tester
npx claudient add agents advisors/cmo-advisor
```

---

## Jouw Claude Code e-mailmarketingstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/email-deliverability` | Afleveringscontrole: SPF/DKIM/DMARC, spam-triggers, lijsthygiëne, opwarmschema | Wanneer openingspercentages dalen, bij het instellen van een nieuw domein, kwartaalcontrole |
| `/email-ab-tester` | A/B-testontwerp, steekproefgroottecalculatie, resultaatinterpretatie | Elke campagne met split-testmogelijkheid |
| `/email-sequence` | Geautomatiseerde reeksen: welkom, nurture, heractivering, na aankoop | Geautomatiseerde flows bouwen of optimaliseren |
| `/email-campaign` | Eenmalige campagnecopy, onderwerpregels, voorbeeldtekst, CTA | Campagnecreatie |
| `/onboarding-cro` | Optimalisatie van onboarding-e-mails — activeringsgebeurtenissen, wrijvingspunten | Onboarding-flows voor nieuwe gebruikers/klanten |
| `/analytics-tracking` | E-mailprestatieanalyse, attributie, cohortanalyse | Wekelijkse en maandelijkse rapportage |

### Agents

| Agent | Model | Wanneer te starten |
|---|---|---|
| `cmo-advisor` | Sonnet | Programmastrategie — kanaalverdeling, segmentatiestrategie, budgetallocatie |

---

## Dagelijkse workflow

### Ochtendcheck campagneprestaties (15 minuten)

Begin elke dag te weten wat werkt:

```
/analytics-tracking

Ochtendcheck e-mailprogramma — [DATUM]:

Gisterse statistieken:
- Verstuurde campagnes: [lijst + verzendvolume per stuk]
- Openingspercentages: [X%] vs. [X% 30-daags gemiddelde]
- Doorklikpercentages: [X%] vs. [X% 30-daags gemiddelde]
- Toegeschreven omzet: [$X]
- Uitschrijvingen: [X] (markeer als > 0,5% per campagne)
- Spamklachten: [X] (markeer als > 0,1%)
- Harde bounces: [X] (markeer als > 0,5%)

Geautomatiseerde flows (24-uursvenster):
- Welkomstreeks: [verstuurde e-mails, gem. openingspercentage]
- Verlaten winkelwagen: [verstuurde e-mails, herstelpercentage]
- Na aankoop: [verstuurde e-mails, gem. doorklikpercentage]

Markeer alles dat vandaag aandacht vereist.
```

---

### Lijstbeheer (10-15 minuten per week)

**Wekelijkse hygiënecheck:**

```
/email-deliverability

Lijsthygiënecheck voor week van [datum]:

Huidige lijststatistieken:
- Totaal actieve abonnees: [X]
- Nieuwe abonnees deze week: [X]
- Uitschrijvingen deze week: [X]
- Harde bounces deze week: [X]
- Zachte bounces (3+): [X]
- Inactief > 90 dagen (geen opening): [X]
- Inactief > 180 dagen (geen opening): [X]

Import uit nieuwe bron deze week: [ja/nee — zo ja, beschrijf bron en volume]

Benodigde acties:
- Wat direct te onderdrukken
- Wat in heractivering te plaatsen
- Of een recente import verificatie nodig heeft
```

---

### E-mail opstellen

**Campagne-e-mail:**

```
/email-campaign

Campagne: [naam en doelstelling]
Doelgroepsegment: [wie, hoeveel]
Doel: [specifieke actie die je wilt dat ze ondernemen]
Aanbod of kernboodschap: [wat je verstuurt — promotie / content / aankondiging]
Merkstem: [formeel / informeel / direct]

Produceer:
- Onderwerpregel (+ A/B-variant)
- Voorbeeldtekst (50 tekens)
- E-mailconcept (met header, body, CTA)
- Aanbeveling verzendtijd voor dit segment en doel
- Notities voor mobiele preview (hoe dit eruit ziet op 375px breedte)
```

**Geautomatiseerde reeks-e-mail:**

```
/email-sequence

Reeks: [naam — bijv. Welkomstreeks, Na aankoop, Heractivering]
E-mailpositie: [Dag X, E-mail N van N]
Wat eraan voorafging: [samenvatting vorige e-mail]
Doel van deze e-mail: [welke fase van de klantreis dit dient]
Segment: [wie dit ontvangt]

Schrijf deze e-mail in de context van de volledige reeks — verwijs naar wat we hebben opgebouwd, bouw erop voort, breng ze naar de volgende fase.
```

---

### A/B-testwerk

**Een nieuwe test ontwerpen:**

```
/email-ab-tester

Campagne: [beschrijf]
Wat ik wil testen: [onderwerpregel / CTA / verzendtijd / e-maillengte / aanbodsformulering]
Beschikbare lijstgrootte: [X abonnees]
Basisstatistiek die ik wil verbeteren: [openingspercentage X% / doorklikpercentage X% / conversie X%]
Mijn hypothese: [Als/Dan/Omdat-formaat]

Ontwerp de test: isoleer de variabele, bereken de steekproefgrootte, definieer succescriteria, stel de beslissingsregel vast.
```

**Resultaten interpreteren:**

```
/email-ab-tester

Interpreteer deze resultaten:
Test: [wat getest werd]
Variant A: [beschrijving] — [X% statistiek] — [N verzendingen]
Variant B: [beschrijving] — [X% statistiek] — [N verzendingen]

Is dit significant? Wat moet ik met dit resultaat? Welk principe leert dit mij?
```

---

## Wekelijks ritme

### Maandag — Campagneplanning

```
/email-campaign

Plan de e-mails van deze week:

Zakelijke context: [promoties, productlanceringen, seizoensgebeurtenissen deze week?]
Te targeten segmenten: [lijst segmenten en hun laatste verzenddatum]
E-mailfrequentiedoel: [X e-mails deze week naar hoofdlijst, X naar segmenten]
Actieve A/B-tests deze week: [lijst — niet verzenden naar testdoelgroepen totdat test is afgerond]

Produceer: campagnekalender voor de week met verzenddatums, segmenten, doelstellingen en onderwerpregelmogelijkheden.
```

### Woensdag — Automatiseringscontrole

Controleer elke week één automatiseringsflow:

```
/email-sequence

Controlemodus — [FLOWNAAM]:

Huidige flowstatistieken:
- E-mail 1: [onderwerp, openingspercentage, doorklikpercentage, uitschrijfpercentage]
- E-mail 2: [onderwerp, openingspercentage, doorklikpercentage]
- [etc.]

Conversie van e-mail 1 naar doelbereiking: [X%]

Wat is de zwakste schakel in deze reeks? Waar haken mensen af? Wat moet ik testen of herschrijven?
```

### Vrijdag — Wekelijks prestatierapport

```
/analytics-tracking

Wekelijks e-mailprogrammarapport voor [week]:

Campagnestatistieken:
[Lijst elke campagne: naam, segment, opens, kliks, omzet, uitschrijvingen]

Prestaties automatiseringsflows:
[Lijst belangrijkste flows: verstuurde e-mails, openingspercentage, conversiepercentage vs. vorige week]

Lijstgezondheid:
- Netto nieuwe abonnees: [X] (bruto nieuw minus uitschrijvingen)
- Lijstgroeipercentage: [X%]
- Actieve betrokkenheidspercentage (geopend in afgelopen 90 dagen / totaal): [X%]

Afleverbaarheid:
- Bouncepercentage: [X%]
- Spamklachtenpercentage: [X%]
- Inboxplaatsing (indien bijgehouden): [X%]

Deze week afgeronde A/B-tests: [resultaten en lessen]

Produceer: wekelijkse samenvatting (3 punten voor leiderschap) + gedetailleerde sectie voor mijn archief.
Wat moet ik volgende week prioriteren?
```

---

## 30-dagenplan

### Week 1 — Afleveringsfundament

- Installeer alle e-mailmarketingvaardigheden
- Voer een volledige afleveringscontrole uit met `/email-deliverability` — authenticatie, lijsthygiëne, spamscores
- Controleer SPF/DKIM/DMARC-records en herstel eventuele hiaten onmiddellijk
- Stel je lijstsegmentatie vast: actief (< 90 dagen) / licht actief (90-180 dagen) / inactief (180+ dagen)
- Verstuur nooit naar inactieve gemengd met actieve abonnees voordat je een heractiverings­campagne hebt uitgevoerd

### Week 2 — Automatiseringscontrole

- Controleer je welkomstreeks met `/email-sequence` — dit is je hoogste-ROI-flow
- Identificeer de automatisering met het slechtste uitvalpercentage — herschrijf hem
- Bekijk je heractiveringsreeks (of maak er een als die niet bestaat)
- Stel je wekelijkse lijsthygiëneritueel in

### Week 3 — Testprogramma

- Bouw je eerste 90-daagse A/B-testachterstand met `/email-ab-tester`
- Lanceer je eerste goed ontworpen A/B-test (onderwerpregel — eenvoudigst om mee te beginnen)
- Stel je regel voor statistische significantie in vóórdat je naar resultaten kijkt
- Documenteer je eerste "e-mailervaringen"-notitie (principes die je gaat testen)

### Week 4 — Rapportage en optimalisatie

- Stel je wekelijkse prestatierapportagesjabloon in
- Bekijk de laatste 3 maanden campagnes: welke segmenten, onderwerpen en verzendtijden presteren het best?
- Presenteer je eerste programmastatusrapport aan je manager
- Identificeer de ene automatiseringsflow die, indien verbeterd met 20%, de grootste omzetimpact zou hebben

---

## Integraties met hulpmiddelen

### Klaviyo (lifecycle e-mail)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Met Klaviyo verbonden: segmentdata, flowanalytics en lijstgezondheid direct in Claude Code.

### HubSpot (B2B e-mail)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

### Mailchimp / Brevo / Postmark

Exporteer je campagnerapporten als CSV → plak in `/analytics-tracking` voor trendanalyse en benchmarking.

### Google Postmaster Tools

Gratis tool van Google — koppel je verzenddomein en monitor domeinreputatie, spampercentages en inboxplaatsing voor Gmail-ontvangers. Controleer wekelijks als onderdeel van je afleveringscontrole.

### Litmus / Email on Acid

Preview rendering over clients → plak problemen in `/email-campaign` voor snelle HTML-fixes.

---

## Bij te houden statistieken

| Statistiek | Doel | Rood signaal |
|---|---|---|
| Openingspercentage | > 25% (verschilt per branche) | < 15% |
| Doorklikpercentage | > 2% | < 1% |
| Klik-naar-openingspercentage (CTOR) | > 10% | < 6% |
| Uitschrijfpercentage (per campagne) | < 0,2% | > 0,5% |
| Spamklachtenpercentage | < 0,05% | > 0,1% (Google blokkeert bij 0,1%) |
| Hardbouncespercentage | < 0,5% | > 1% |
| Lijstgroeipercentage | Positief maand-over-maand | Twee of meer maanden dalend |
| Actief betrokkenheidspercentage | > 40% van lijst | < 25% |
| Openingspercentage welkomstmail | > 50% | < 35% |
| Conversie automatiseringsflow | Afhankelijk van flow — stel doel per flow in | Onder gesteld doel gedurende 60+ dagen |

Let op: Apple Mail Privacy Protection inflateerd openingspercentages voor iOS-gebruikers (gemarkeerd als "geopend" bij voorladen). Beschouw doorklikpercentage en CTOR als je primaire betrokkenheidsstatistieken voor iOS-zware lijsten.

---

## Veelgemaakte fouten en hoe Claude Code helpt ze te vermijden

**Fout 1: Verzenden naar inactieve abonnees zonder eerst een heractiverings­campagne**
Dit is de snelste manier om de afleverbaarheid te beschadigen. Inactieve abonnees die niet reageren signaleren aan providers dat je spam verstuurt — ze bestraffen je hele domein. Voer eerst een sunset-campagne uit.

**Fout 2: A/B-testwinnaar declareren op basis van 6 uur data**
`/email-ab-tester` berekent of je resultaat statistisch significant is. Als dat niet zo is, is het ruis — geen winnaar.

**Fout 3: Geen DMARC-record op je verzenddomein**
`/email-deliverability` pikt dit op bij de eerste controle. Zonder DMARC is je domein kwetsbaar voor spoofing en vertrouwen providers het minder.

**Fout 4: Welkomstmails schrijven als een eenmalige verzending**
`/email-sequence` ontwerpt welkomstreeksen van 3-5 e-mails. Eén welkomstmail is een gemiste activeringskans.

**Fout 5: Onderwerpregels testen zonder hypothese**
`/email-ab-tester` vereist een hypothese voordat het de test ontwerpt. "Verschillende onderwerpregels testen" is geen hypothese — het is willekeurige variatie die je niets leert, zelfs niet als je wint.

---

## Bronnen

- [Aan de slag met Claude Code](./getting-started.md)
- [E-mailafleverbaarheid-vaardigheid](../skills/marketing/email-deliverability.md)
- [E-mail A/B-tester-vaardigheid](../skills/marketing/email-ab-tester.md)
- [E-mailreeks-vaardigheid](../skills/marketing/email-sequence.md)
- [E-mailcampagne-workflow](../workflows/email-campaign.md)
- [CMO-advisor-agent](../agents/advisors/cmo-advisor.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
