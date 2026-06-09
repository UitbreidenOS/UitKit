---
description: Genereer een gestructureerd architectuurdocument voor een codebase of module
argument-hint: "[path or module name]"
---
Produceer een uitgebreid architectuurdocument voor: $ARGUMENTS

Stappen:
1. Verken het doel — lees entry points, configuratiebestanden en mappenstructuur. Sla verborgen mappen niet over, zoals `.claude/` of `infra/`.
2. Identificeer en benoem de componenten op het hoogste niveau: services, lagen, stores, queues, externe integraties.
3. Voor elke component, vermeld:
   - Verantwoordelijkheid (één zin)
   - Technologie / taal / framework
   - Inkomende en uitgaande afhankelijkheden
   - Gegevens die het bezit of doorgeeft
4. Teken de runtime data-flow als een ASCII-diagram. Label de aanroeprichting met pijlen. Inclusief asynchrone grenzen.
5. Identificeer cross-cutting concerns: authenticatie, logging, foutafhandeling, feature flags, caching.
6. Vermeld bekende beperkingen of niet-voor-de-hand-liggende beslissingen (bijv. "gebruikt polling in plaats van webhooks omdat de vendor-API alleen-lezen is").
7. Identificeer hiaten: niet-gedocumenteerde delen, ontbrekende tests, onduidelijk eigenaarschap.

Uitvoerformat:
- H2-koppen voor elke sectie
- Tabellen voor componentlijsten (Component | Verantwoordelijkheid | Tech | Afhankelijk van)
- ASCII-diagram inline onder "Data Flow"
- Opsommingslijsten voor cross-cutting concerns en hiaten
- Geen introductietekst — begin met de componenttabel
