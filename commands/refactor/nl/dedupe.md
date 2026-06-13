---
description: Vind en elimineer gedupliceerde logica, gegevens of structuur
argument-hint: "[bestand of map]"
---
Dedupliceer code in $ARGUMENTS.

1. Scan het bereik voor duplicatie:
   - Identieke of bijna identieke functiebodies (>5 regels met triviale variatie)
   - Gekopieerde gegevensstructuren of configuratieblokken met kleine verschillen
   - Herhaalde inline logica die eenmaal kan worden geëxtraheerd (bijv. dezelfde validatie, dezelfde sorteercomparator, dezelfde transformatie)
   - Gededupliceerde typedefinities of interfaceverklaringen
   - Meerdere functies die slechts verschillen door een enkele parameterwaarde — kandidaten voor parameterisering

2. Voor elk gededupliceerd cluster gevonden:
   - Identificeer de canonieke versie die u wilt behouden (geef de voorkeur aan de meest volledige, best benoemde of onlangs gewijzigde)
   - Bepaal of de kopieën verschillen naar gegevens (→ parameterisering) of naar gedrag (→ afzonderlijk behouden, dit zijn geen duplicaten)
   - Produceer een enkele gedeelde implementatie: extraheer een functie, constante of type naar behoefte

3. Vervang alle gededupliceerde locaties met aanroepen naar de gedeelde implementatie. Laat de oude kopieën niet op hun plaats.

4. Verwijder na vervanging alle imports of helpers die uitsluitend ter ondersteuning van de verwijderde kopieën bestonden.

5. Uitvoer: voor elke deduplicatie, list het gemaakte gedeelde symbool, hoeveel sites werden vervangen, en waar elk zich bevond.

Beperkingen:
- "Vergelijkbaar" is niet "duplicaat." Voeg code alleen samen die dezelfde intentie en semantiek heeft — dwing onverwante code niet in een gedeelde abstractie omdat het er hetzelfde uitziet.
- Introduceer geen nieuwe abstractielaag (klasse, module, mixin) alleen om een enkel paar van twee functies te dedupliceren. Een eenvoudige functieextractie is voldoende.
- Behoud al het bestaande gedrag. Als het samenvouwen van duplicaten subtiele wijzigingen in een callsite vereist, markeer die dan expliciet.
- Deduplicate testen niet — testredundantie is vaak opzettelijk.
