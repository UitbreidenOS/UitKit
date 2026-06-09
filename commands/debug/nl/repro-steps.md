---
description: Genereer een minimale reproduceerbare testcase op basis van een bugbeschrijving of falende test
argument-hint: "[bug description or test name]"
---
Given: $ARGUMENTS

Je taak is het produceren van een minimale, zelfstandige reproduceerbare testcase voor deze bug.

Stappen:

1. Identificeer het foutoppervlak — is dit een unit-, integratie- of runtime-fout? Welke laag is hier eigenaar van?

2. Strip de reproduceerbare testcase tot zijn kleinste vorm:
   - Verwijder alle ongerelateerde setup, fixtures en gegevens
   - Elimineer netwerk-/bestandssysteemaanroepen waar mogelijk — mock of stub ze
   - De reproduceerbare testcase moet deterministisch falen, niet flaky

3. Vermeld de exacte vereiste omgevingsvoorwaarden:
   - Runtime-versie, OS-beperkingen indien relevant
   - Vereiste omgevingsvariabelen of configuratiewaarden
   - Eventuele seedgegevens of voorcondities

4. Schrijf de reproduceerbare testcase als uitvoerbare code (test of script). Inclusief:
   - Imports en setup
   - De minimale aanroepvolgorde die de bug triggert
   - Een assertion of foutuitdruk die duidelijk aangeeft dat er een fout is opgetreden

5. Voeg een commentaarblok toe aan de bovenkant:
   ```
   // BUG: <one-line description>
   // EXPECTED: <what should happen>
   // ACTUAL: <what actually happens>
   // SCOPE: <smallest known unit that reproduces it>
   ```

6. Als de bug niet-deterministisch is, documenteer dan de waargenomen frequentie en alle voorwaarden
   die de reproduceerbaarheid vergroten (bijv. gelijktijdigheid, gegevensgrootte, timing).

7. Verifieer dat de reproduceerbare testcase daadwerkelijk faalt voordat je deze presenteert. Als je deze kunt uitvoeren, doe dit dan.

Output: the repro file contents ready to paste into a new file, followed by a one-sentence
summary of the root failure mechanism if you can identify it from the repro alone.
