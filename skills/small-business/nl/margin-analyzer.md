---
name: margin-analyzer
description: "Bereken brutowinst per productlijn, klantsegment en kanaal; markeer dunne marges; vind waar u werkelijk geld verdient"
---

# Margin Analyzer

## When to activate
- U overweegt een prijsverandering en wilt de impact kennen voordat u zich vastlegt
- U beslist welke producten u in een campagne wilt promoten en wilt de meest winstgevende pushen
- Kwartaallijkse bedrijfsreview en u vermoedt dat sommige producten of klanttypen u geld kosten
- Uw inkomsten groeien maar uw winst niet — u moet het lek vinden

## When NOT to use
- Volledige resultatenrekening inclusief overheadtoewijzing — gebruik uw boekhouder daarvoor
- Meerjaarlijkse financiële prognoses voor investeerders of kredietverstrekkers
- Automatische tracering van marges in de loop van de tijd — dit is een momentopname-analyse, geen live dashboard

## Instructions

### What to give Claude

Voor elk product of service geeft u drie getallen:
1. Verkoopprijs (wat u aan de klant rekent)
2. Afleveringskosten (alles wat nodig is om deze ene eenheid te produceren of af te handelen)
3. Volume (hoeveel u per maand verkoopt)

De afleveringskosten moeten specifiek zijn om nuttig te zijn. Inclusief: materialen, verpakking, leverancierprijs, loonkosten per eenheid (uren × uw uurtarief), platform- of marktplaatskosten, betalingsverwerking, verzending als u die betaalt. Als u een service verkoopt, schat u de uren per engagement × uw gemengde uurtarief.

Als u via meerdere kanalen verkoopt — uw eigen website, Amazon, een groothandelaccount — geef Claude de prijs en kosten per kanaal apart. Platform- en verzendkosten variëren voldoende zodat de kanaalwinst vaak zeer verschillend is van uw headline-winst.

### What Claude computes

Brutowinst per product: (verkoopprijs minus afleveringskosten) gedeeld door verkoopprijs, uitgedrukt als percentage.

Claude rangschikt elk product van hoogste naar laagste winst en markeert alles onder de drempel die u hebt ingesteld. Als u geen drempel instelt, gebruikt Claude 20% als standaard minimum — daaronder dekken de meeste bedrijven niet de overheadbijdrage.

Claude produceert ook:
- Uw inkomensgewogen gemiddelde winst (niet alleen eenvoudig gemiddelde — gewogen naar hoeveel u werkelijk van elk artikel verkoopt)
- Welke producten het meeste brutowinst in dollarbedragen genereren, niet alleen in percentages (een 70%-winst product dat u 5 keer verkoopt is minder waard dan een 35%-winst product dat u 200 keer verkoopt)
- Waar prijsstelling niet is meegekomen met kostenstijgingen (als u Claude vertelt wat uw kosten een jaar geleden waren versus nu)

### Customer segment analysis

Als u verschillende klanttypen hebt — individueel vs. bedrijf, klein vs. bedrijf, eenmalig vs. herhalend — vertel Claude de inkomsten en servicekosten per segment. Servicekosten omvatten: tijd besteed aan support, onboarding, accountbeheer, retouren of herzieningen.

Kleine klanten kosten vaak meer per dollar inkomsten dan grote. Claude laat u zien waar dit gebeurt en kwantificeert het verschil.

### Channel analysis

Plak uw per-kanaal nummers. Claude laat u zien wat u netto verdient na platformkosten op elk kanaal:

- Directe verkoop (uw website): geen marktplaatsbijdrage, maar u betaalt voor traffic
- Marktplaats (Amazon, Etsy, eBay): 8-15% bijdrage plus afhandeling
- Groothandel: 40-50% korting van retailprijs, maar geen klantenservicekosten
- App stores: 15-30% platformbijdrage

Het kanaal dat de meeste inkomsten genereert, is vaak niet het meest winstgevende kanaal. Claude maakt dit zichtbaar.

### Pricing gap check

Vertel Claude uw huidige kosten en huidige prijs. Vertel Claude vervolgens wat die kosten 12 maanden geleden waren. Claude berekent hoeveel winst u bent kwijtgeraakt door kostenstijging en welke prijsverhoging deze zou herstellen — uitgedrukt als dollarbedrag, niet alleen percentage, zodat u kunt zien of het een verdedigbare prijsverandering is.

---

### Prompt template

```
Analyse alstublieft mijn marges. Hier zijn mijn producten/services:

Product 1: [naam]
- Verkoopprijs: $[X]
- Afleveringskosten: $[Y] (uitsplitsing: materialen $X, arbeid $X, platformbijdrage $X)
- Maandelijks volume: [eenheden]

Product 2: [naam]
- Verkoopprijs: $[X]
- Afleveringskosten: $[Y]
- Maandelijks volume: [eenheden]

[herhaal voor elk product]

Mijn winstdrempel is [X]% — markeer alles eronder.

Ook: Ik verkoop via [kanalen]. Hier zijn de kanaalspecifieke nummers: [details]

Vragen:
1. Welk product moet ik prioriteren in mijn volgende marketingcampagne?
2. Welke producten komen in aanmerking voor een prijsverhoging?
3. Wat is mijn inkomensgewogen gemiddelde winst?
```

## Example

U exploiteert een Shopify-winkel met drie productlijnen. U geeft Claude prijzen, kosten (inclusief Shopify-betalingsbijdrage van 2,9% + $0,30 per transactie) en maandelijks verkoopsvolume.

Claude voert uit:

| Product | Verkoopprijs | COGS | Brutowinst | Maandelijke eenheden | Maandelijke brutowinst |
|---|---|---|---|---|---|
| Handgemaakte kaarsen | $42 | $13,50 | 68% | 90 eenheden | $2 565 |
| White-label diffusoren | $65 | $46,80 | 28% | 140 eenheden | $2 548 |
| Digitale geurideeën | $12 | $1,05 | 91% | 55 eenheden | $598 |

Inkomensgewogen gemiddelde winst: 51%

Claude markeert: White-label diffusoren liggen boven de 20%-drempel maar ver onder uw handgemaakte kaarswinst. Bij 140 eenheden per maand genereren zij bijna dezelfde brutowinst als uw 68%-winst product — maar zij binden voorraadbetaalmiddelen en vergen afhandelingarbeid. Als leverancierskosten met 5% stijgen, vallen diffusoren tot 22% winst en nog een kostenstijging brengt hen onder drempel.

Aanbeveling: Verschuif betaalde adspending naar handgemaakte kaarsen (hoogste winst %) en digitale geurideeën (hoogste winst %, geen afhandeling). Controleer diffusorenprijs — een prijsverhoging van $7 brengt winst naar 37% en zal het volume waarschijnlijk niet aanzienlijk verminderen gegeven uw huidige prijspositie.

---
