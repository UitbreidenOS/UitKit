---
description: Een minimale reproduceerbare zaak genereren op basis van een bugbeschrijving of falende test
argument-hint: "[bugbeschrijving of testnaam]"
---
Gegeven: $ARGUMENTS

Je taak is om een minimale, zelfstandige reproduceerbare zaak voor deze bug te produceren.

Stappen:

1. Identificeer het faaloppervlak — is dit een unit-, integratie- of runtime-fout? Welke laag is eigenaar ervan?

2. Strip de reproductie tot zijn kleinste vorm:
   - Verwijder alle niet-gerelateerde setup, fixtures en gegevens
   - Elimineer netwerk-/filesystemaanroepen waar mogelijk — mock of stub deze
   - De repro moet deterministisch falen, niet willekeurig

3. Vermeld de exacte vereiste omgevingsvoorwaarden:
   - Runtimeversie, OS-beperkingen indien relevant
   - Vereiste omgevingsvariabelen of configuratiewaarden
   - Eventuele zaadgegevens of voorwaarden

4. Schrijf de repro als uitvoerbare code (test of script). Voeg toe:
   - Imports en setup
   - De minimale oproepvolgorde die de bug triggert
   - Een assertion of foutafdruk die duidelijk aangeeft dat het mislukt

5. Voeg een commentaarblok toe aan de bovenkant:
   ```
   // BUG: <eenregelbeschrijving>
   // EXPECTED: <wat zou moeten gebeuren>
   // ACTUAL: <wat gebeurt er eigenlijk>
   // SCOPE: <kleinste bekende eenheid die het reproduceert>
   ```

6. Als de bug niet-deterministisch is, documenteer de waargenomen frequentie en eventuele voorwaarden
   die reproduceerbaarheid vergroten (bijv. gelijktijdigheid, gegevensgrootte, timing).

7. Verifieer dat de repro werkelijk mislukt voordat je deze presenteert. Als je het kunt uitvoeren, doe dit dan.

Output: de inhoud van het reproductiebestand klaar om in een nieuw bestand in te plakken, gevolgd door een eenregelige
samenvatting van het onderliggende faalmechanisme als je dit alleen uit de repro kunt identificeren.
