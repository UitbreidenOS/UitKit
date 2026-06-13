---
name: cash-flow-forecast
description: "Kasstroomprognosticering 30-90 dagen voor kleine bedrijven: inkomsten en uitgaven modelleren, tekorten identificeren, loonutstekpiste en vroegtijdige waarschuwingtriggers"
---

# Cash Flow Forecast Skill

## Wanneer activeren
- U bent onzeker of u genoeg contant geld hebt om volgende maand loonlijst te dekken
- Grote aankoop plannen en controleren of timing werkt
- Stilteseizoen nadert en u wilt vooruit plannen
- U wilt een eenvoudige 30/60/90-daagse kasvoorspeiling
- Uw boekhouder heeft een kasstroomprognosticering gevraagd

## Wanneer NIET gebruiken
- Formele leninggever-indieningen — gebruik uw boekhouder daarvoor
- Gereviseerde financiële verklaringen
- Meerjaarprognosticering voor investeerdersdeken — vereist professionele modellering

## Instructies

### Snelle 30-daagse prognose

Beschrijf gewoon uw situatie:

```
Help me een 30-daagse kasstroomprognosticering op te stellen.

Huiedig banksaldo: $[X]
Verwachte inkomsten deze maand:
- [Factuur/klant]: $[bedrag], verwacht [datum]
- [Terugkerend inkomen]: $[bedrag], arriveert [datum]
- Overig: $[bedrag]

Vaste kosten deze maand:
- Huur: $[bedrag], verschuldigd [datum]
- Loonlijst: $[bedrag], verschuldigd [datum]
- Softwareabonnementen: ~$[bedrag]

Variabele uitgaven die ik verwacht:
- [Leveranciersbetaling]: $[bedrag]
- [Overig]: $[bedrag]

Zal ik genoeg hebben? Wat is mijn laagste punt?
```

### Controle loonutstekpiste

```
Ik heb $[X] op mijn zakelijke rekening.
Mijn maandelijkse loonlijst is $[Y] (betaald op [N.] van elke maand).
Mijn gemiddelde maandelijkse inkomsten zijn $[Z] maar het is variabel.
Mijn vaste maandelijkse kosten zonder loonlijst zijn $[W].

Hoeveel maanden uitstek heb ik?
Welk banksaldo zou me moeten laten bezorgen?
Wat is het minimum dat ik als buffer op het account moet houden?
```

### Kasstroom-gaten opsporen

```
Hier is mijn prognose voor de volgende 3 maanden:

Maand 1: Verwachte inkomsten $[X], uitgaven $[Y]
Maand 2: Verwachte inkomsten $[X], uitgaven $[Y] (inclusief jaarlijkse verzekering $Z)
Maand 3: Verwachte inkomsten $[X], uitgaven $[Y]

Waar zijn de gaten? Wat moet ik doen voordat ze voorkomen?
```

### Scenarioplanning

```
Mijn grootste klant ($8.000/maand) vertelde me net dat ze 3 maanden pauzeren.
Mijn huiedig banksaldo is $14.000.
Mijn vaste maandelijkse kosten zijn $6.200.

Begeleid me door:
1. Hoe lang kan ik zonder deze inkomsten vervangen bedrijven?
2. Welke uitgaven kan ik uitstellen of verminderen?
3. Welke inkomstenopties moet ik eerst volgen?
```

### Seizoenale bedrijfsplanning

```
Mijn bedrijf is seizoensgebonden:
- Piekmaanden (juni–augustus): ~$25.000/maand inkomsten
- Stille maanden (november–februari): ~$6.000/maand inkomsten
- Vaste maandelijkse kosten: $8.000

Ik ben momenteel in piekseizoen met $22.000 op het account.
Hoeveel moet ik elke piekmaand opzij zetten om het stille seizoen te overleven?
```

### Vroegtijdige waarschuwingtekens

Vraag Claude om u te helpen monitoring in te stellen:

```
Op basis van mijn financiën, welke vroegtijdige waarschuwingtekens moet ik volgen
die aangeven dat een kasstroomproblem aankomt?
Welke wekelijkse/maandelijkse nummers moet ik controleren?
```

## Voorbeeld

**U zegt:**
```
Banksaldo: $18.000
Volgende 30 dagen:
- Klant terugkerend: $5.000 arriveert op 5e
- Projectfactuur: $3.200, klant betaalt meestal in 21 dagen
- Onzeker: nieuwe offerte van $8.000 zou kunnen sluiten

Vaste kosten: Huur $2.800, loonlijst $9.500, software/hulpmiddelen $400
Variabel: leveranciersbetaling $1.200 verschuldigd 15e
```

**Claude antwoordt:**
- Bevestigd contant geld: $23.000 (saldo + terugkerend)
- Potentieel contant geld: $34.200 (als factuur op tijd betaald + nieuwe deal sluit)
- Slechtste geval aan maandeinde: +$9.100 (als niets extra binnenkomt)
- Risikovlag: loonlijst valt op 15e — dezelfde dag als leveranciersbetaling ook verschuldigd is. Bevestig dat de $3.200 factuur eerst wordt ingewisseld.
- Aanbeveling: Vervolg de $3.200 factuur actief. Tel de $8.000 offerte nog niet mee in de planning.

---
