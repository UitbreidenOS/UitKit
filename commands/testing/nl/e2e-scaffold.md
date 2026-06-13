---
description: Scaffold end-to-end tests voor een pagina, route of gebruikersstroom
argument-hint: "[pagina- of stroombeschrijving]"
---
U maakt een scaffold voor end-to-end tests voor: $ARGUMENTS

Volg deze stappen:

1. Detecteer het gebruikte E2E-framework door te controleren op configuratiebestanden en afhankelijkheden:
   - Playwright: `playwright.config.ts`, `@playwright/test`
   - Cypress: `cypress.config.ts`, `cypress/`
   - Puppeteer: `puppeteer` in package.json
   - Indien geen gevonden, standaard naar Playwright en noteer deze aanname.

2. Identificeer het doel — een pagina, route of benoemde gebruikersstroom — uit het argument. Indien onduidelijk, leid af uit mapstructuur en bestaande testbestanden.

3. Lees bestaande E2E-tests in het project om overeen te stemmen met:
   - Bestandslocatieconventies (bijv. `e2e/`, `tests/`, `cypress/e2e/`)
   - Helper/fixture-patronen die al in gebruik zijn
   - Basis-URL-configuratie en verificatie-instellingen indien aanwezig

4. Maak een testbestand aan met:
   - Ten minste één `describe`-blok genoemd naar het doel
   - Een happy-path test die de primaire actie dekt (laden, verzenden, navigeren)
   - Een test voor fouten/edge-cases (ongeldige invoer, 404, lege status)
   - Een test voor elk kritiek interactief element zichtbaar in het doel
   - Passende `beforeEach`-instellingen (navigeren naar pagina, mock-verificatie indien nodig)

5. Gebruik de idiomatische selectors van het framework:
   - Playwright/Cypress: verkies `getByRole`, `getByLabel`, `getByTestId` boven CSS-selectors
   - Puppeteer: gebruik `waitForSelector` met semantische attributen

6. Mock geen netwerkaanvragen tenzij het argument expliciet "mock" bevat of het project al massaal interceptors gebruikt.

7. Voeg een `// TODO:`-opmerking toe voor elke stelling die een waarde vereist die alleen bij runtime bekend is (bijv. dynamische ID's, timestamps).

8. Plaats het bestand in de juiste map. Maak geen nieuwe mappen aan tenzij er geen E2E-map bestaat.

9. Uitvoer:
   - Het gemaakte bestandspad
   - Een korte lijst van wat elke test dekt
   - Eventuele gemaakte aannames (frameworkkeuze, basis-URL, verificatie)
