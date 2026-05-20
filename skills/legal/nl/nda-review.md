---
name: nda-review
description: "NDA-selectie en -beoordeling: type classificeren, playbook-afwijkingen vlaggen (GREEN/YELLOW/RED), bereichsproblemen identificeren, ontbrekende uitsluitingen, verborgen verplichtingen — juridische beoordeling nodig"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../nda-review.md).

# NDA-beoordelingsfähigkeit

## Wanneer activeren
- Beoordeling van een geheimhoudingsovereenkomst vóór ondertekening
- Selectie van een batch NDA's om te identificeren welke juridische aandacht nodig hebben
- Begrijpen wat een specifieke NDA-clausule in gewone taal betekent
- Controleren of een NDA standaard uitsluitingen en beschermingen bevat
- NDA-voorwaarden vergelijken met de standaard playbook-posities van uw bedrijf

## Wanneer NIET gebruiken
- Ondertekening namens uw organisatie — dat vereist een bevoegde ondertekenaar
- Interpretatie van NDA-voorwaarden in een actief geschil — raadpleeg uw advocaat
- Multilaterale NDA's met complexe grensoverschrijdende verplichtingen — vereist een specialist

## Belangrijke waarschuwing

Claude kan problemen identificeren en clausules uitleggen. Het kan geen juridisch advies geven, jurisdictiespecifiek recht interpreteren of garanderen dat het alle problemen heeft gevonden. **Laat een advocaat elke NDA vóór ondertekening beoordelen als de relatie wezenlijk is.**

## Instructies

### Eerst — de NDA classificeren

```
Beoordeel deze NDA en vertel mij:
1. Is het wederzijds (beide partijen beschermd) of eenzijdig (slechts één partij)?
2. Wie is de openbarende partij en wie is de ontvangende partij?
3. Wat is de looptijd (duur)?
4. Welk recht is van toepassing?

NDA-tekst: [plakken]
```

### Volledige playbook-beoordeling

```
Beoordeel deze NDA aan de hand van onze standaardposities:

Onze standaardposities:
- Voorkeur voor wederzijdse NDA's; eenzijdig acceptabel als wij de ontvangende partij zijn
- Maximale NDA-looptijd: 3 jaar
- Definitie van Vertrouwelijke Informatie: moet binnen 30 dagen worden gemarkeerd of schriftelijk bevestigd
- Vereiste standaarduitsluitingen: publiek domein, voorkennis, onafhankelijke ontwikkeling, gedwongen openbaarmaking
- Toepasselijk recht: [uw voorkeursjurisdictie]
- Geen verborgen niet-wervingsclausule of concurrentiebeding in de NDA

NDA-tekst: [plakken]

Markeer elk probleem als GROEN (acceptabel), GEEL (onderhandelen) of ROOD (blokkerend).
```

### Controle op standaarduitsluitingen

Elke NDA zou deze 4 uitsluitingen moeten bevatten. Claude controleert ze:

```
Controleer of deze NDA alle 4 standaarduitsluitingen bevat:
1. Informatie die al in het publieke domein is (niet door schending)
2. Informatie die de ontvangende partij al kende vóór de openbaarmaking
3. Informatie die onafhankelijk is ontwikkeld door de ontvangende partij
4. Informatie die wettelijk of door gerechtelijk bevel openbaar gemaakt moet worden (gedwongen openbaarmaking)

NDA-tekst: [plakken]

Als een van deze ontbreekt, markeer als GEEL en stel de ontbrekende tekst op.
```

### Scan op verborgen verplichtingen

```
Scan deze NDA op verplichtingen die verder gaan dan standaard vertrouwelijkheid:
- Niet-wervingsclausules (beperkingen op aanwerving)
- Concurrentiebedingen
- IP-cessietaal
- Exclusiviteitsverplichtingen
- Standstill-bepalingen (beperkingen op fusie- en overnameactiviteiten)

NDA-tekst: [plakken]

Markeer alles dat verder gaat dan standaard vertrouwelijkheid als ROOD — deze horen niet thuis in een NDA.
```

### Uitleg in gewone taal

```
Leg deze NDA-clausule uit in gewone taal:
"[clausule plakken]"

Vertel mij: wat betekent dit feitelijk voor mijn bedrijf? Wat is de praktische implicatie?
```

### Redline-suggesties

```
Deze NDA heeft de volgende problemen waarbij ik terug wil onderhandelen:
[problemen uit de bovenstaande beoordeling opsommen]

Stel redline-tekst voor elk probleem op — wat ik in plaats daarvan wil.
Formaat: Oorspronkelijke tekst → Voorgestelde herziening → Reden
```

## Voorbeeld

**Een eenzijdige NDA waarbij u de ontvangende partij bent:**

```
ROOD — Overmatig brede definitie van Vertrouwelijke Informatie
Artikel 1: "Alle informatie die door de Openbarende Partij in welke vorm dan ook wordt verstrekt"
Probleem: Geen markeringsvereiste en geen uitzondering voor mondelinge mededelingen. 
          U kunt onbedoeld gebonden zijn aan alles dat in een vergadering is gezegd.
Oplossing: Toevoegen "...op voorwaarde dat mondelinge mededelingen binnen 30 dagen na de 
     openbaarmaking schriftelijk als vertrouwelijk worden bevestigd."

GEEL — Looptijd van 5 jaar overschrijdt standaard
Artikel 8: "Deze overeenkomst blijft vijf (5) jaar van kracht"
Probleem: 5 jaar is langer dan de 3-jaar standaard. Beheersbaar maar het loont om terug te onderhandelen.
Oplossing: Stel 2-3 jaar voor bij de meeste commerciële NDA's.

ROOD — Uitsluiting van "onafhankelijke ontwikkeling" ontbreekt
Artikel 2 bevat slechts 3 van de 4 standaarduitsluitingen — onafhankelijke ontwikkeling ontbreekt.
Oplossing: Toevoegen: "(d) informatie die onafhankelijk is ontwikkeld door de Ontvangende Partij zonder 
     gebruik van of verwijzing naar de Vertrouwelijke Informatie van de Openbarende Partij."

GROEN — Toepasselijk recht (Californië): acceptabel als u daar opereert.
GROEN — Wederzijdse uitzonderingen voor gedwongen openbaarmaking: aanwezig en standaard.

AANBEVELING: Niet ondertekenen zoals het nu is. RODE punten moeten worden gecorrigeerd vóór uitvoering.
Juridische beoordeling: Aanbevolen als deze NDA een wezenlijke commerciële relatie begeleidt.
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
