---
description: Concept voor Architecture Decision Record voor een specifieke technische beslissing
argument-hint: "[decision topic]"
---
Concept voor Architecture Decision Record (ADR) voor: $ARGUMENTS

Vóór het schrijven:
1. Controleer op een bestaande `docs/decisions/`, `docs/adr/`, of `adr/` directory om
   de nummerings- en bestandsnaamconventie in gebruik te bepalen. Volg deze exact.
2. Als een ADR-template al in de repo bestaat, gebruik deze. Gebruik anders het onderstaande format.
3. Lees relevante bronbestanden om de "Context" en "Consequences" secties te baseren op
   werkelijke code, niet op hypothesen.

ADR format:

# ADR-NNN: [Titel — zelfstandig naamwoord frase die de beslissing beschrijft, niet het probleem]

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Date
YYYY-MM-DD

## Context
Welke situatie, beperking of vereiste dwong deze beslissing af?
Inclusief: schaal, teamgrootte, bestaande systeembeperkingen, externe vereisten.
Houd je aan feiten — geen advocacy hier.

## Decision
Formuleer de beslissing in één zin die begint met "We will…".
Vervolgens leg je het mechanisme uit: wat zal worden gebouwd, gewijzigd of overgenomen, en hoe.

## Considered Alternatives
Voor elk overwogen alternatief:
- **Optiesnaam**: wat het is, waarom het werd overwogen, waarom het werd verworpen.
Minimaal twee alternatieven. Vermeld geen opties die nooit serieus werden overwogen.

## Consequences
**Positief:**
- Concrete, verifieerbare voordelen (prestaties, eenvoud, kosten, teamsnelheid).

**Negatief:**
- Echte afwegingen die werden geaccepteerd. Minimaliseer deze niet.

**Risico's:**
- Wat kan er misgaan. Wat zou leiden tot heroverweging van deze beslissing.

## References
Links naar relevante PRs, issues, benchmarks of externe documentatie die de beslissing hebben beïnvloed.

Schrijfregels:
- Wees precies en neutraal. Een ADR is een historisch document, geen verkoopaanbieding.
- Schrijf in verleden tijd voor geaccepteerde beslissingen, toekomst tijd voor voorgesteld.
- Vermijd vage adjectieven: "eenvoudig", "flexibel", "schaalbaar" betekenen niets zonder bewijs.
- Als $ARGUMENTS vaag is, stel één verduidelijkingsvraag voordat je doorgaat: wat specifieke
  beslissing moet worden geregistreerd, en wat werd gekozen?
- Voer het bestand uit naar de juiste ADR directory met het volgende beschikbare nummer.
  Bevestig het volledige uitvoerpad na het schrijven.
