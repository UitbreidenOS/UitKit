---
name: customer-feedback-synthesizer
description: "Zet 50-200+ reviews, enquêteresponsen of supporttickets om in gerangschikte pijnpunten, featureverzoeken, gevoelstrends en een concreet actieplan"
---

# Customer Feedback Synthesizer

## When to activate
- U heeft meer reviews dan u tijd heeft om te lezen en u hebt de thema's snel nodig
- Een kwartaallijkse bedrijfsreview staat voor de deur en u hebt een gegevensgefundeerde klantenoverzicht nodig
- U hebt zojuist een product of functie gelanceerd en wilt weten hoe het is ontvangen
- U bereidt een klantrapport voor uw team, investeerders of een raadgeversorgaan voor

## When NOT to use
- U hebt minder dan 10 reviews — lees ze zelf, patronen vereisen volume
- U hebt statistisch rigoureuze NPS- of CSAT-analyse nodig — gebruik hiervoor een dedicated surveyplatform
- U wilt een woordelijk verslag van elke klacht — deze vaardigheid synthetiseert, het archiveert niet

## Instructions

### What to give Claude

Plak uw reviews rechtstreeks. Kopieer van Google, Yelp, Trustpilot, App Store of G2. Plak samenvattingen van supporttickets. Plak open enquêteresponsen. Geen opmaak nodig — simpelweg onbewerkte tekst, een review na de andere. Claude kan 200+ in één keer verwerken.

Als u een CSV hebt geëxporteerd, plak dan alleen de kolom met reviewtekst. U hoeft deze niet op te schonen.

Vertel Claude:
- De periode die de reviews bestrijken (bijvoorbeeld „de afgelopen 3 maanden" of „sinds onze lancering in januari")
- Uw bedrijfstype (restaurant, SaaS, retail, service) zodat Claude context heeft
- Elke specifieke vraag die u beantwoord wilt hebben (bijvoorbeeld „waarom dalen onze ratings?" of „wat willen mensen dat we toevoegen?")

### What Claude produces

Claude produceert vijf dingen:

**1. Top 5 pijnpunten** — gerangschikt naar hoe veel reviews ze noemen, met een frequentieaantal en typische emotionele intensiteit (gefrustreerd vs. licht geïrriteerd vs. boos)

**2. Top 5 feature- of productverzoeken** — gerangschikt naar hoeveel mensen hebben gevraagd, met de exacte taal die klanten het meest gebruiken (handig voor uw eigen copy en roadmap-argumenten)

**3. Gevoelstrend** — verbeterend, stabiel of afnemend — gebaseerd op toon over de periode die u hebt opgegeven. Als u Claude reviews uit twee perioden geeft, vergelijkt hij ze rechtstreeks.

**4. Top 3 „wat werkt" hoogtepunten** — wat klanten het meest prijzen, wat even belangrijk is als wat ze kritiseren. Handig voor marketingcopy en om te weten wat niet te veranderen.

**5. Urgentiematrix** — elk pijnpunt geclassificeerd als:
- Kritiek: veel mensen noemen het, sterke negatieve emotie, beïnvloedt de kernervaring
- Belangrijk: frequent, gematigde frustratie, waard om dit kwartaal op te lossen
- Controleren: occasioneel, mild, nog niet actie waard maar de moeite waard om bij te houden

### Suggested fixes

Voor elk pijnpunt in de kritieke en belangrijke categorieën vraagt u Claude: „Stel voor elk probleem één concrete actie voor die ik zou kunnen ondernemen." Claude produceert één korte actie per item — geen strategiedocument, gewoon de volgende stap.

### Monthly cadence

Voer dit eenmaal per maand uit. Sla elk resultaat op (kopieer het in een document). Na drie maanden plakt u alle drie de resultaten en vraagt u Claude: „Verbeteren de kritieke problemen van maand één zich?" Dit volgt of uw fixes daadwerkelijk werken.

---

### Prompt template

```
Ik ga [aantal] reviews van [platform] uit [periode] plakken.
Mijn bedrijf is een [soort bedrijf].

Geef me alstublieft:
1. Top 5 pijnpunten met frequentieaantal en emotionele intensiteit
2. Top 5 feature- of productverzoeken gerangschikt naar hoeveel mensen hebben gevraagd
3. Gevoelstrend: verbeterend, stabiel of afnemend
4. Top 3 dingen die klanten het meest prijzen
5. Een urgentiematrix die elk pijnpunt als kritiek, belangrijk of controleren classificeert
6. Voor kritieke en belangrijke items: één concrete actie die ik voor elk zou kunnen ondernemen

Hier zijn de reviews:
[reviews plakken]
```

## Example

U bent eigenaar van een restaurant en plakt 80 Google-reviews van de afgelopen 3 maanden. U vertelt Claude dat uw bedrijf een laidback zit-down restaurant is.

Claude identificeert:

Pijnpunten:
1. Wachttijd (34 reviews, sterke frustratie) — Kritiek
2. Inconsistente portiegroottes (18 reviews, gematigde frustratie) — Belangrijk
3. Parkeren (11 reviews, lichte irritatie) — Controleren
4. Geluidsniveau in het weekend (9 reviews, gematigd) — Controleren
5. Beperkte vegetarische opties (7 reviews, mild) — Controleren

Featureverzoeken:
1. Online bestellen of reserveringen (22 reviews)
2. Grotere porties op het middagmenu (14 reviews)
3. Een loyaliteitsprogramma (8 reviews)

Gevoelstrend: Afnemend — reviews uit maanden 1-2 toonden warmere taal; maand 3 toont meer frustratie rond wachttijden specifiek, samenvallend met uw nieuwe weekenduren.

Wat werkt: Vriendelijkheid van het personeel (positief genoemd in 61 van 80 reviews), voedselkwaliteit op de kerngerechtingen en waarde voor geld.

Urgentiematrix-acties:
- Wachttijd (Kritiek): Claude stelt voor om een sms-meldingssysteem toe te voegen wanneer tafels klaar zijn en geschatte wachttijden bij de deur aan te geven
- Portiegroottes (Belangrijk): Claude stelt voor om de middagschotel te standaardiseren met een gedocumenteerde portieguide voor keukenpersoneel

Totale tijd: minder dan 2 minuten om van ruwe plak naar dit resultaat te gaan.

---
