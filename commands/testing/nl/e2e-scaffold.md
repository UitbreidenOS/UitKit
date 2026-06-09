---
description: Basisstructuur voor end-to-end tests voor een pagina, route of gebruikersstroom
argument-hint: "[page or flow description]"
---
Je maakt basisstructuur voor end-to-end tests voor: $ARGUMENTS

Volg deze stappen:

1. Detecteer het gebruikte E2E-framework door configbestanden en afhankelijkheden te controleren:
   - Playwright: `playwright.config.ts`, `@playwright/test`
   - Cypress: `cypress.config.ts`, `cypress/`
   - Puppeteer: `puppeteer` in package.json
   - Indien geen gevonden, standaard naar Playwright en noteer deze aanname.

2. Identificeer het doel — een pagina, route of benoemde gebruikersstroom — uit het argument. Als onduidelijk, leid af van mappenstructuur en bestaande testbestanden.

3. Lees bestaande E2E tests in het project om te matchen:
   - Bestandslocatieconventies (bijv. `e2e/`, `tests/`, `cypress/e2e/`)
   - Helper/fixture-patronen die al in gebruik zijn
   - Base URL-configuratie en auth-setup indien aanwezig

4. Maak een testbestand met:
   - Minimaal één `describe`-blok genoemd naar het doel
   - Een happy-path test die de primaire actie dekt (laden, indienen, navigeren)
   - Een fout/edge-case test (ongeldige invoer, 404, lege staat)
   - Een test voor elk kritiek interactief element zichtbaar in het doel
   - Passende `beforeEach`-setup (naar pagina navigeren, auth mocken indien nodig)

5. Gebruik de idiomatische selectors van het framework:
   - Playwright/Cypress: geef voorkeur aan `getByRole`, `getByLabel`, `getByTestId` boven CSS-selectors
   - Puppeteer: gebruik `waitForSelector` met semantische attributen

6. Mock netwerkverzoeken niet, tenzij het argument expliciet "mock" bevat of het project al uitgebreid interceptors gebruikt.

7. Voeg een `// TODO:`-opmerking toe voor elke assertion die een waarde vereist die alleen tijdens runtime bekend is (bijv. dynamische ID's, timestamps).

8. Plaats het bestand in de juiste map. Maak geen nieuwe mappen aan, tenzij geen E2E-map bestaat.

9. Uitvoer:
   - Het gemaakte bestandspad
   - Een korte lijst met wat elke test dekt
   - Alle aannames die zijn gedaan (frameworkkeuze, base URL, auth)
