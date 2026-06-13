---
description: Draft een pull request titel en beschrijving vanuit branch commits en diff
argument-hint: "[base-branch]"
---
Bepaal de base branch: gebruik $ARGUMENTS als deze is opgegeven, anders default naar `main`.

Voer deze commando's uit om context te verzamelen:
1. `git log <base-branch>...HEAD --oneline` — lijst commits op deze branch
2. `git diff <base-branch>...HEAD --stat` — samenvatting van veranderingen op bestandsniveau
3. `git diff <base-branch>...HEAD` — volledige diff voor semantische analyse

Uit deze context een pull request beschrijving in Markdown produceren:

```
## Samenvatting
<2-4 opsommingspunten die behandelen wat er veranderd is en waarom — geen bestandenlijst>

## Veranderingen
<Gegroepeerd per onderwerp, niet per bestand. Gebruik sub-opsommingspunten voor details.>

## Testen
<Specifieke teststappen die een reviewer moet uitvoeren om correctheid te valideren.
Indien testen geautomatiseerd zijn, de testnamen of commando's noemen.>

## Opmerkingen voor reviewers
<Markeer niet-voor-de-hand-liggende beslissingen, afwegingen, gebieden van onzekerheid, of TODOs voor vervolgstappen.
Deze sectie weglaten indien er niets opmerkelijk is.>
```

Aan het begin, voor de body, één regel uitvoeren:
`Title: <imperatief, ≤70 karakters, geen punt>`

Geen standaard koppelingen opnemen die de repository niet nodig heeft. Niet elke verandering samenvatten — bedoeling syntheseren.
