---
description: Maak een pull request-titel en -beschrijving op basis van branch-commits en diff
argument-hint: "[base-branch]"
---
Bepaal de basisbranch: gebruik $ARGUMENTS als deze is gegeven, anders standaard naar `main`.

Voer deze commando's uit om context te verzamelen:
1. `git log <base-branch>...HEAD --oneline` — lijst commits op deze branch
2. `git diff <base-branch>...HEAD --stat` — samenvattingstatus op bestandsniveau
3. `git diff <base-branch>...HEAD` — volledige diff voor semantische analyse

Produceer op basis van deze context een pull request-beschrijving in Markdown:

```
## Samenvatting
<2-4 opsommingspunten met wat is gewijzigd en waarom — geen lijst van bestanden>

## Wijzigingen
<Gegroepeerd per onderwerp, niet per bestand. Gebruik sub-opsommingspunten voor details.>

## Testen
<Specifieke teststappen die een reviewer moet uitvoeren om correctheid te valideren.
Als tests automatisch zijn, naam van de testbestanden of commando's.>

## Opmerkingen voor reviewers
<Markeer niet-voor-de-hand-liggende besluiten, compromissen, onzekerheidsbronnen of TODOs voor vervolgstappen.
Laat deze sectie weg als er niets opmerkelijks is.>
```

Aan het begin, voor de body, output een enkele regel:
`Title: <imperatief, ≤70 tekens, geen punt>`

Voeg geen standaardkoppen in die de repository niet nodig heeft. Vat niet elk gewijzigd bestand samen — syntheseer bedoeling.
