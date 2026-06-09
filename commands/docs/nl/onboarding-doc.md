---
description: Genereer een developer onboarding document voor deze codebase
argument-hint: "[output-file]"
---
U schrijft een developer onboarding document voor deze codebase. Het doel is een nieuwe engineer zo snel mogelijk productief te maken — geen onnodige inhoud, geen bedrijfstoon.

Doeluitvoerbestand (indien opgegeven): $ARGUMENTS

Stappen om uit te voeren:

1. Scan de repository root naar: README, package.json, pyproject.toml, Makefile, Dockerfile, docker-compose.yml, .env.example, en alle CI config bestanden (.github/, .gitlab-ci.yml, etc.).

2. Identificeer:
   - Wat het project doet (één alinea, geen marketingtaal)
   - Primaire taal(en) en runtime versies
   - Hoe dependencies te installeren
   - Hoe het project lokaal uit te voeren (dev mode)
   - Hoe tests uit te voeren
   - Hoe linting / type checks uit te voeren
   - Alle vereiste omgevingsvariabelen (van .env.example of documentatie)
   - Alle vereiste externe services (databases, queues, APIs)

3. Zoek naar niet-voor-de-hand-liggende setup stappen: migrations, seed scripts, certificate installs, lokale tunnels, service mocks. Voeg ze expliciet toe.

4. Controleer op een CONTRIBUTING.md of soortgelijk bestand. Indien gevonden, extraheer de branching strategie, PR proces, en code review verwachtingen en vat ze samen.

5. Identificeer de primaire entry points: main bestanden, key modules, belangrijke directories. Geef een korte kaart (3–8 items) zodat de lezer weet waar te beginnen.

6. Noteer bekende problemen, eigenaardigheden, of dingen die nieuwe developers verrassen (broken tooling, flaky tests, ongewone conventies, vereiste handmatige stappen).

Schrijf het document in Markdown met de volgende secties — voeg alleen secties toe waar je echte inhoud voor hebt:

## Overview
## Prerequisites
## Installation
## Running Locally
## Running Tests
## Environment Variables
## External Dependencies
## Codebase Map
## Contributing
## Known Issues / Gotchas

Regels:
- Schrijf voor een senior developer die dit project nog nooit heeft gezien
- Elke command moet copy-pasteable en correct zijn
- Verzin geen informatie — als iets onduidelijk is, zeg dit expliciet met een TODO marker
- Geen motiverend taalgebruik, geen "happy path" framing — alleen feiten en commands
- Houd elke sectie compact; bullet points boven proza waar passend

Indien $ARGUMENTS een bestandspad is, schrijf de output naar dat bestand. Anders print het document in het gesprek.
