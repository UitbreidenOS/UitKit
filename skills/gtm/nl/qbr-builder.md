---
name: qbr-builder
description: "Kwartaalsbedrijfsreview-bouwer: samenvatting klantgezondheid, geleverde ROI, doelen voor volgend kwartaal, kader voor verlenging- en uitbreidingsgesprek"
---

# QBR Builder Vaardigheid

## Wanneer activeren
- Je hebt een QBR gepland in de komende 2 weken en moet het deck en de gespreksonderwerpen opbouwen
- Je moet geleverde ROI aan een klant kwantificeren voor een verlengingsgesprek
- Voorbereiding op een review op uitvoerend niveau met de C-suite van een klant
- Een QBR-sjabloon bouwen dat je hele CS-team consistent kan gebruiken
- Een relatie herstellen voor een QBR — je weet dat de klant ontevreden is en hebt een strategie nodig

## Wanneer NIET gebruiken
- Onboardinggesprekken of maandelijkse check-ins — die hebben andere structuren, gebruik `/customer-success`
- Verkooppresentaties aan prospects — ander instrument, ander doel
- Interne bedrijfsreviews (niet klantgericht) — gebruik een andere workflow
- QBR's waarbij je geen gebruiksdata of resultaten hebt om te presenteren — verzamel eerst data

## Instructies

### Volledige QBR-bouwer prompt

```
Bouw een complete QBR voor mijn klant.

Klant: [Bedrijfsnaam]
Tier: [Strategisch / Enterprise / Groei / Standaard]
ARR: $[X]
Verlengingsdatum: [datum — hoeveel maanden weg?]
CSM: [naam]
Aanwezige klantcontacten: [titel uitvoerend sponsor, titel kampioen, anderen]
Mijn aanwezige contacten: [CSM, AE, VP CS indien strategisch]
Duur: [30 / 45 / 60 / 90 minuten]
Primair doel voor deze QBR: [behouden / uitbreiden / case study / relatiereset]

Hun bedrijfscontext:
- In welke sector zitten ze? [X]
- Wat waren hun vermelde succescriteria bij aanvang van het contract? [X, Y, Z]
- Zijn er wijzigingen in hun bedrijf geweest? [leiderschapswijziging / fusie / personeelsbestand / budget]
- Wat is hun primaire gebruiksscenario voor ons product? [X]

Onze productcontext:
- Gebruiksdata: [logins, actieve gebruikers, kernfunctiegebruik — beschrijf wat je hebt]
- Productwijzigingen dit kwartaal die relevant zijn voor hen: [geleverde functies, opgeloste bugs]
- Openstaande supporttickets of onopgeloste problemen: [beschrijf]
- Hebben ze deelgenomen aan bèta-functies of verzoeken gedaan? [ja/nee]

Commerciële context:
- Huidig MRR/ARR: $[X]
- Uitbreidingskans: [extra seats / add-ons / hogere tier] — $[X] potentieel
- Concurrentiedreiging: [ben je op de hoogte van een competitieve evaluatie?]
- Verlengingsgezondheid: [groen / geel / rood — en waarom]

Produceer:

## QBR-AGENDA (voor 60-minuten sessie)

[5 min] Opening en relatie-check
[15 min] Hun bedrijf — wat er is veranderd sinds het laatste kwartaal
[20 min] Geleverde waarde — wat ze hebben bereikt met ons product
[10 min] Roadmap — wat er aankomt dat voor hen relevant is
[10 min] Doelen voor volgend kwartaal en succescriteria

## GESPREKSONDERWERPEN PER SECTIE

Voor elke agenda-sectie:
- 2-3 vragen om te stellen (luister voor je praat)
- Belangrijkste datapunten om te delen
- Waar op te letten (signalen: positief = uitbreiding; negatief = verlooprisico)
- Hoe te handelen als ze ontevreden zijn

## ROI-DIA (de belangrijkste dia in elke QBR)
- Resultaat 1: [specifiek resultaat gekoppeld aan hun vermelde succescriteria]
- Resultaat 2: [specifiek resultaat]
- Resultaat 3: [specifiek resultaat]
- Als harde ROI niet beschikbaar is: gebruik voorlopende indicatoren (bespaard tijd, verminderde fouten, adoptiepercentage)
- Zeg nooit "wij hebben je geholpen" — zeg "jij hebt X bereikt, en hier is hoe ons product dat mogelijk maakte"

## VERLENGING- EN UITBREIDINGSGESPREK
- Wanneer te spreken: niet voor je de waarde-sectie hebt geleverd
- Hoe te kadreren: "Op basis van wat je hebt bereikt, is hier wat we aanbevelen voor volgend kwartaal..."
- Uitbreidingsverhaal: [specifiek voor hun situatie en gebruikssignalen]
- Bezwaarafhandeling: [waarschijnlijke bezwaren gegeven hun huidige gezondheid]

## PRE-QBR CHECKLIST
□ Agenda 5 dagen van tevoren verzonden
□ Aanwezigheid uitvoerende sponsor bevestigd
□ Alle gebruiksdata getrokken uit productanalyse
□ Alle supporttickets van afgelopen 90 dagen beoordeeld
□ ROI-kwantificering voorbereid
□ AE of VP gebriefed over commerciële situatie
□ Weet het ene ding dat mis kan gaan en heb een plan
```

### ROI-kwantificeringskader

```
Kwantificeer de ROI die deze klant dit kwartaal van ons product heeft ontvangen.

Klant: [Bedrijf]
Product: [beschrijf wat het doet]
Hun gebruiksscenario: [specifieke workflow waarvoor ze het gebruiken]
Contractwaarde: $[X] ARR

ROI-kader — gebruik welke dimensies van toepassing zijn:

TIJDSBESPARING
- Proces voor ons product: [beschrijf handmatige stappen]
- Bespaard tijd per taak: [X uur]
- Frequentie: [X keer per week/maand]
- Teamgrootte die deze taak uitvoert: [N personen]
- Jaarlijks bespaard uren: [X uur/week × N personen × 52 weken]
- Waarde bij $[X]/uur volledig belaste kosten: $[X] jaarlijkse waarde
- ROI-meervoud: $[X waarde] / $[X ARR] = [X:1] ROI

FOUTREDUCTIE / KWALITEIT
- Foutpercentage voor: [X%] fouten per [taak]
- Foutpercentage nu: [X%]
- Kosten per fout (herbewerking, klantimpact, reputatie): $[X]
- Jaarlijkse besparingen door foutreductie: $[X]

OMZETIMPACT
- Heeft ons product hen geholpen meer deals te sluiten, klanten te behouden, of omzet te laten groeien?
- Beïnvloede of beschermde omzet: $[X]
- Attributie: [hoe weet je dat ons product dit heeft gedreven?]

VERMEDEN PERSONEELSBESTAND
- Zouden ze [N] extra personen hebben moeten aannemen zonder ons product?
- Salaris + voordelen per aanwerving: $[X]
- Vermeden personeelskosten: $[X]

SNELHEID NAAR MARKT
- Hoeveel sneller leveren / voltooien ze werk?
- Voor: [X dagen] → Na: [X dagen]
- Concurrentievoordeel van sneller bewegen: [kwalitatief of kwantitatief]

TOTALE GELEVERDE WAARDE DIT KWARTAAL: $[X]
CONTRACTKOSTEN DIT KWARTAAL: $[X ARR / 4] = $[X]
ROI-MEERVOUD: [X:1]

Als je geen harde data hebt: gebruik de eigen woorden van de klant uit supporttickets, NPS-enquêtes of eerdere gesprekken. "U vertelde ons in uw laatste check-in dat [X]" is beter dan geen bewijs.

Presenteer dit als HUN prestatie, niet die van jou.
```

### Gesprek over uitvoerende afstemming

```
Bereid me voor op het uitvoerende deel van een QBR.

Klant-exec: [titel, wat je weet over hun prioriteiten]
Risiconiveau: [strategisch account op risico / gezond en uitbreidend / onbekend]
Mijn verzoek uit dit gesprek: [handtekening verlenging / uitbreidingsgesprek / case study / referentie]

Kader voor uitvoerend gesprek:

BEGIN NIET met product. Begin met hun bedrijf.

Openingsvragen (kies 2):
- "Wat zijn jouw top 3 prioriteiten voor [bedrijf] in de komende 12 maanden?"
- "Hoe ziet succes eruit voor jouw team tegen einde van het jaar?"
- "Wat is het grootste obstakel tussen waar je nu bent en waar je wilt zijn?"
- "Wat zou je het vertrouwen geven dat je investeert in de juiste tools voor volgend jaar?"

Brug van hun prioriteiten naar jouw product:
"Op basis van wat je hebt beschreven — [hun prioriteit] — is hier hoe [jouw product] dat direct ondersteunt..."
Lever dan je ROI-verklaring in één zin.

Omgaan met niet-betrokken exec:
- Als ze hun telefoon controleren: stel direct een vraag — "Is er iets specifieks dat u wilt dat we vandaag aanpakken?"
- Als ze niet de echte beslisser zijn: "Wie moet er nog meer deel uitmaken van dit gesprek voor de planning voor volgend kwartaal?"

Omgaan met ontevreden exec:
- Verdedig je niet. Erken en vraag.
- "Bedankt voor uw directheid — dat is wat ik moet horen. Kunt u me helpen begrijpen wat het belangrijkste is dat we moeten oplossen?"
- Luister dan volledig voor je reageert.
- Volg dezelfde dag op met een schriftelijke samenvatting van wat je hebt gehoord en een concreet actieplan.

Uitbreidingsbrug (gebruik alleen als de relatie sterk is en waarde is vastgesteld):
"Gezien wat u dit kwartaal hebt bereikt en wat u mij hebt verteld over [hun prioriteit], zou ik u willen laten zien wat er mogelijk is als we ons werk uitbreiden naar [nieuw gebruiksscenario / extra seats / volgend tier]."

NOOIT: pitch uitbreiding voor je waarde hebt vastgesteld. Volgorde is belangrijk.

Produceer gespreksonderwerpen afgestemd op mijn specifieke exec en situatie.
```

### QBR-herstelplan (risicoklant)

```
Mijn QBR-klant is ontevreden. Help me een herstel-QBR voor te bereiden.

Klant: [Bedrijf]
Gezondheid: ROOD
Hoofdklacht: [wat ze hebben gezegd of gesignaleerd]
Oorzaak (jouw beoordeling): [producthiaat / onboardingsfout / ondersteuningsfout / verkeerde kampioen / verkeerd verkocht]
Verlenging: [X maanden weg]
Hun alternatief: [verlopen / overstappen naar concurrent / scope verminderen]

Herstel-QBR-kader:

VOOR HET GESPREK
- Wacht niet tot de QBR om het probleem te erkennen. Stuur 3 dagen van tevoren een e-mail:
  "Ik wil deze QBR het meest productieve gesprek maken dat we hebben gehad. Ik weet dat [specifiek probleem] niet is waar het moet zijn, en ik wil er echte tijd aan besteden om het direct aan te pakken."
- Breng je VP of CS of een leidinggevende mee — geeft aan dat je het serieus neemt
- Bereid een schriftelijk actieplan van tevoren voor — improviseer niet

OPENING (eerste 5 minuten)
- Open niet met jouw agenda. Open met erkenning:
  "Voor we de agenda doorlopen, wil ik [probleem] direct aanpakken. We hebben niet voldaan aan wat we hadden toegezegd op het gebied van [terrein], en ik wil tijd besteden aan hoe we dat oplossen."
- Pauzeer. Laat ze reageren. Luister volledig.

HET HERSTELVOORSTEL
- Wat verandert er specifiek? [noem 3 concrete acties met eigenaren en datums]
- Wat kun je aanbieden als gebaar? [toegewijde ondersteuning / ETA productoplossing / korting / servicetegoed]
- Hoe ziet succes eruit over 60 dagen? [definieer het samen]
- "Als we deze drie dingen voor [datum] leveren, bent u dan bereid zich vast te leggen op verlenging?"

WAT NIET TE DOEN
- Beschuldig je productteam, ondersteuningsteam of collega's niet tijdens het gesprek
- Beloof geen functies die je niet kunt leveren
- Maak het gesprek niet over het redden van het contract — maak het over hen succesvol maken
- Minimaliseer hun klacht niet met data die hun ervaring tegenspreekt

NA HET GESPREK BINNEN 24 UUR
- Schriftelijke samenvatting van gemaakte toezeggingen
- Benoemde eigenaar voor elke actie
- Volgende check-in datum binnen 2 weken (niet volgend kwartaal)

Produceer het specifieke herstel-QBR-plan voor mijn klant.
```

## Voorbeeld

**Gebruiker:** Ik heb aanstaande dinsdag een QBR met Acme Corp. Ze zijn $180K ARR, verlengen over 3 maanden. Hun CFO en Head of Ops zullen er zijn. Ze hadden klachten over trage ondersteuningsrespons in Q2, maar het gebruik is 40% gestegen jaar-op-jaar. Hoe structureer ik dit?

**Claude's QBR-plan:**

**Strategische prioriteit: Bescherm $180K verlenging, stel uitbreidingsgesprek in.**

**Agenda voor Acme Corp QBR — 60 minuten:**

- [0:00] Open: "Voor we onze agenda doorlopen — ik wil direct inchecken. We hadden wat moeilijkere momenten bij ondersteuningsrespons in Q2. Ik wil begrijpen of dat is opgelost of nog steeds een punt van zorg is." [Luister — dit brengt het risico naar boven voor het je verrast]

- [0:10] Hun bedrijf: "Richting Q4 en verlengingsplanning — wat zijn jouw topprioriteiten als operations-leider voor volgend jaar?" Vraag de CFO: "Waar ziet u momenteel de meeste druk op kosten of efficiëntie?" [Laat hen praten. Dit onthult uitbreidingssignalen.]

- [0:20] Geleverde waarde: "Dit is wat uw team dit kwartaal heeft bereikt..." Leid met 40% gebruiksgroei als signaal van adoptiestatus. Vertaal dat naar ROI: bij 40% meer gebruik, welk werk doen ze nu dat ze eerder niet deden? Kwantificeer in uren of verminderde fouten.

- [0:35] Ondersteuningserkenning: "Ik wil direct zijn over Q2-ondersteuning. Reactietijden gemiddeld 36 uur tegen onze 12-uur SLA. Dat is niet acceptabel. Dit is wat we hebben veranderd: [specifieke oplossing]. Dit is ons huidig gemiddelde: [actuele data]. Ik stuur u maandelijks een SLA-rapport."

- [0:45] Roadmap: Toon 2 functies specifiek relevant voor Ops — geen productdump.

- [0:55] Vervolgstappen: "Op basis van jouw prioriteiten voor volgend jaar — [wat ze zeiden] — zou ik willen voorstellen [uitbreidingsgebruiksscenario] te bespreken als onderdeel van jouw verlenging. Kunnen we 30 minuten plannen met [jouw AE] voor einde van de maand?"

**Kernrisico:** Als de CFO ondersteuningskwaliteit als verlengingsvoorwaarde stelt, heb een servicetegoed klaar om aan te bieden — niet vrijwillig, maar klaar als ze aandringen.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
