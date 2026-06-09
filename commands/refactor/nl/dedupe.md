---
description: Vind en elimineer gedupliceerde logica, gegevens of structuur
argument-hint: "[file or directory]"
---
Verwijder duplicaten in code in $ARGUMENTS.

1. Scan het bereik op duplicatie:
   - Identieke of bijna identieke functielichamen (>5 regels met triviale variatie)
   - Gekopieerde gegevensstructuren of configuratieblokken met kleine verschillen
   - Herhaalde inline logica die eenmaal kan worden geëxtraheerd (bijv. dezelfde validatie, dezelfde sorteercomparator, dezelfde transformatie)
   - Gedupliceerde typedefinities of interface-declaraties
   - Meerdere functies die alleen verschillen in een enkele parameterwaarde — kandidaten voor parameterisering

2. Voor elke gevonden duplicaatcluster:
   - Identificeer de canonieke versie om te behouden (verkies de meest complete, best benoemde of meest recent aangepaste)
   - Bepaal of de kopieën verschillen in gegevens (→ parameteriseer) of in gedrag (→ behoud apart, dit zijn geen duplicaten)
   - Produceer een enkele gedeelde implementatie: extraheer een functie, constante of type naar behoefte

3. Vervang alle duplicaatlocaties met aanroepen naar de gedeelde implementatie. Laat de oude kopieën niet achter.

4. Na vervanging, verwijder alle imports of helpers die alleen bestonden ter ondersteuning van de verwijderde kopieën.

5. Output: voor elke deduplicatie, vermeld het gemaakte gedeelde symbool, hoeveel locaties werden vervangen, en waar elk zich bevond.

Beperkingen:
- "Vergelijkbaar" is niet "duplicaat." Voeg alleen code samen die dezelfde bedoeling en semantiek heeft — dwing onverwante code niet in een gedeelde abstractie omdat het er hetzelfde uitziet.
- Introduceer geen nieuwe abstractielaag (klasse, module, mixin) alleen om een enkel paar van twee functies te dedupliceren. Een gewone functie-extractie is voldoende.
- Behoud al het bestaande gedrag. Als het samenvouwen van duplicaten subtiele veranderingen aan een callsite vereist, markeer deze expliciet.
- Dedupliceer geen tests — test-redundantie is vaak opzettelijk.
