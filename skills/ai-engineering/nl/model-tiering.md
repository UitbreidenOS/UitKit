---
name: model-tiering
description: "Automatische routering en tiering van ontwikkelaarsprompts over Opus, Sonnet en Haiku op basis van taakkenmerken"
updated: 2026-06-23
---

# Automatische Model-Tiering Competentie

## Wanneer activeren

- Optimaliseren van tokenkosten tijdens de uitvoering van een multi-stap coding agent.
- Dynamische toewijzing van modelgewichten tijdens grote refactoringruns.
- Complexe planningstaken oplossen voordat implementatiecode wordt gegenereerd.
- Fallback-configuraties activeren wanneer complexe redeneertaken mislukken op kleinere modellen.

## Wanneer NIET gebruiken

- Snelle interactieve chats waarbij het wisselen van model merkbare latentie toevoegt.
- Expliciete model-overschrijvingen door de ontwikkelaar (bijv. `--model sonnet`).

## Instructies

Om taken dynamisch te routeren, classificeert u vragen van ontwikkelaars in een van de volgende drie niveaus:

### 1. Het Redeneerniveau (Opus / Denkmodel)
- **Bereik**: Grote architecturale wijzigingen, beveiligingsaudits, complexe algoritme-ontwerpen, transversale zorgen.
- **Criteria**: Hoog structureel risico, vereist redeneren over grote contextvensters.

### 2. Het Planningsniveau (Sonnet)
- **Bereik**: API's op middelhoog niveau, refactoring van lokale functies, lay-outontwerpen en het maken van stapsgewijze implementatietaken.
- **Criteria**: Gemiddelde complexiteit, volgt bestaande architectuurpatronen.

### 3. Het Coderingsniveau (Haiku)
- **Bereik**: Schrijven van boilerplate-code, documentatie, eenvoudige unit-tests, scriptwijzigingen.
- **Criteria**: Wijzigingen in één bestand, lage architecturale complexiteit, herhaalbare codepatronen.
