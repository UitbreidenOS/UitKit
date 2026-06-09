---
description: Een architectuur- of technische besluitvormingsdocument (ADR) opstellen op basis van een beschrijving
argument-hint: "[beslissingonderwerp en context]"
---
Stel een besluitvormingsdocument op voor het volgende: $ARGUMENTS

Gebruik deze structuur:

**Status:** Proposed | Accepted | Deprecated | Superseded  
(Standaard ingesteld op "Proposed" tenzij $ARGUMENTS anders aangeeft.)

**Context**  
Welke situatie dwingt nu tot een beslissing. Neem constraints, eerdere werkzaamheden en waarom de huidige situatie onvoldoende is op. 3–6 zinnen.

**Decision**  
Één alinea. Vermeld het besluit rechtstreeks in de eerste zin. Vergeet niet om direct ter zake te komen.

**Options Considered**

Voor elke optie (totaal 2–4, inclusief de gekozen optie):
- **Option N: [Name]** — omschrijving in één zin
  - Pro: ...
  - Pro: ...
  - Con: ...
  - Con: ...

**Consequences**

Positieve gevolgen (wat verbetert of mogelijk wordt).  
Negatieve gevolgen / trade-offs (wat wordt moeilijker, wat gaat verloren).  
Risico's (wat kan fout gaan, en mitigatie indien bekend).

**Revisit Conditions**  
Opsommingslijst: specifieke voorwaarden waaronder deze beslissing opnieuw moet worden bezien. Wees concreet — niet "als vereisten veranderen" maar "als verzoekvolume 10k/s overschrijdt" of "als leverancier X API Y afschaft."

Regels:
- Schrijf voor een lezer die dit document 18 maanden later tegenkomt zonder enige andere context.
- Beveel niet de "duidelijk juiste" optie aan zonder de echte nadelen op te sommen.
- Vul niet aan met achtergrondmateriaal dat voor een senior engineer algemeen bekend is.
- Als $ARGUMENTS niet genoeg context biedt om echte opties te benoemen, noem dan de twee meest voorkomende alternatieven in de branche en merk op dat de lezer ze moet valideren.
- Houd de totale lengte onder de 600 woorden tenzij de beslissing uitzonderlijk ingewikkeld is.

Voer het document alleen uit.
