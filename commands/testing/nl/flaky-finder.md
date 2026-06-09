---
description: Identificeer en fix bronnen van flakiness in bestaande tests
argument-hint: "[test file or directory]"
---
Analyseer tests op flakiness in: $ARGUMENTS

Stappen:

1. Lees het doelbestand of alle testbestanden onder de doeldirectory.

2. Scan op elk van de volgende flakiness-patronen en noteer elke voorkomst met bestandspad en regelnummer:

   **Timingproblemen**
   - Vaste `sleep`/`wait` aanroepen in plaats van voorwaarde-gebaseerde wachten
   - Assertions onmiddellijk na asynchrone operaties zonder te wachten
   - Hard-coded timeouts die kunnen verschillen tussen CI en lokale omgevingen

   **Afhankelijkheid van volgorde**
   - Tests die gedeelde module-level of globale state muteren zonder opruiming
   - `beforeAll` setup waarvan latere tests afhankelijk zijn maar niet declareren
   - Testbestanden die uitgevoerde volgorde binnen een suite aannemen

   **Niet-determinisme**
   - Gebruik van `Math.random()`, `Date.now()` of `new Date()` in assertions zonder mocking
   - Netwerkoproepen naar echte endpoints (geen interceptors/mocks)
   - Bestandssysteem leest zonder fixtures — paden die per omgeving verschillen

   **Resource contention**
   - Parallelle tests die schrijven naar dezelfde databaserijen of bestanden
   - Poortkonflikten in server-start tests
   - Ontbrekende transactie rollbacks of teardown

   **Selector fragility (UI/E2E)**
   - CSS class selectors die visuele stijl coderen, niet semantiek
   - XPath-expressies afhankelijk van DOM-diepte
   - Tekstinhoudsvergelijkingen die mislukken bij i18n of kopiewijzigingen

3. Geef voor elke bevinding:
   - Patroncategorie (van hierboven)
   - Exacte locatie (file:line)
   - Grondoorzaak in één zin
   - Een concrete fix — toon de voor/na code snippet

4. Na catalogisering de fixes toepassen op eventuele problemen die ondubbelzinnig veilig kunnen worden gewijzigd (bijvoorbeeld `sleep(500)` vervangen door een juiste wait, ontbrekende `afterEach` opruiming toevoegen).

5. Voor fixes die ontwerpbeslissingen vereisen (bijvoorbeeld het introduceren van een testdatabase, het toevoegen van een mockserver), beschrijf de aanpak maar implementeer niet zonder bevestiging.

6. Eindigt met een telling: X bevindingen, Y automatisch gerepareerd, Z vereisen handmatige actie.
