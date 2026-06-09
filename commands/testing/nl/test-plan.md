---
description: Genereer een gestructureerd testplan voor een feature, module of PR
argument-hint: "[feature, file, or PR description]"
---
Genereer een gestructureerd testplan voor: $ARGUMENTS

Stappen:

1. Analyseer het argument om het bereik te bepalen:
   - Als een bestandspad: lees het bestand en extraheer openbare functies, klassen, routes of componenten
   - Als een featurebeschrijving: identificeer het domein en voorspel beïnvloede oppervlakken
   - Als een PR of diff in context staat: gebruik gewijzigde bestanden als bereik

2. Voor het geïdentificeerde bereik, noem testcategorieën in deze volgorde op:
   a. Unit tests — individuele functies, methoden of pure logica
   b. Integration tests — modulegrenzen, serviceinteracties, databasequery's
   c. Component/UI tests — als het bereik frontendcode omvat
   d. E2E tests — als gebruikersgerichte flows zijn beïnvloed
   e. Contract tests — als het bereik API-eindpunten omvat die door externe clients worden gebruikt

3. Noem voor elke categorie specifieke testgevallen op. Elk testgeval moet bevatten:
   - Een eenregelbeschrijving in het formaat: `[subject] [action/state] → [expected outcome]`
   - Prioriteit: P0 (moet verzonden), P1 (moet verzonden), P2 (nice to have)
   - Type: happy path | edge case | error path | regression

4. Identificeer:
   - Alle bestaande tests die overlappend terrein bestrijken (controleer testdirectories)
   - Hiaten waar momenteel geen tests bestaan
   - Externe afhankelijkheden die mocking vereisen (API's, databases, tijd, willekeurigheid)

5. Markeer gevallen die veel moeite kosten of weinig waarde hebben — voeg deze niet stilzwijgend in; noteer de afweging.

6. Voer het plan uit als een Markdown-tabel of geneste lijst. Schrijf geen testcode.

7. Eindigen met een samenvattingslijn: totaal aantal testgevallen op prioriteit (bijv. "P0: 4, P1: 7, P2: 3").
