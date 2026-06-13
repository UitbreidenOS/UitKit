---
description: Een gestructureerd testplan voor een functie, module of PR genereren
argument-hint: "[functie, bestand of PR beschrijving]"
---
Genereer een gestructureerd testplan voor: $ARGUMENTS

Stappen:

1. Parse het argument om het bereik te bepalen:
   - Indien een bestandspad: lees het bestand en extraheer openbare functies, klassen, routes of componenten
   - Indien een functiebeschrijving: identificeer het domein en bepaal beïnvloede oppervlakken
   - Indien een PR of diff in context aanwezig is: gebruik gewijzigde bestanden als bereik

2. Voor het geïdentificeerde bereik, lijst testcategorieën op in deze volgorde:
   a. Unittests — individuele functies, methoden of pure logica
   b. Integratietests — modulegebruiksgrenzen, serviceinteracties, databasequery's
   c. Component/UI-tests — indien het bereik frontend-code bevat
   d. E2E-tests — indien gebruikersgerichte workflows worden beïnvloed
   e. Contracttests — indien het bereik API-endpoints bevat die door externe clients worden gebruikt

3. Voor elke categorie, lijst specifieke testgevallen op. Elk testgeval moet het volgende omvatten:
   - Een eenregelige beschrijving in het formaat: `[onderwerp] [actie/status] → [verwacht resultaat]`
   - Prioriteit: P0 (moet verzonden), P1 (zou moeten verzonden), P2 (prettig om te hebben)
   - Type: gelukkig pad | randgeval | foutpad | regressie

4. Identificeer:
   - Eventuele bestaande tests die overlappend terrein dekken (controleer testmappen)
   - Gaten waar momenteel geen tests bestaan
   - Externe afhankelijkheden die moeten worden nagebootst (API's, databases, tijd, willekeur)

5. Markeer gevallen die veel moeite kosten of weinig waarde hebben — sluit deze niet zwijgend in; noteer de afweging.

6. Voer het plan uit als een Markdown-tabel of geneste lijst. Schrijf geen testcode.

7. Eindigen met een samenvattingsregel: totaal testgevallen per prioriteit (bijv. "P0: 4, P1: 7, P2: 3").
