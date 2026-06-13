---
description: Extraheer een gemarkeerd blok of beschreven logica naar een benoemde functie met juiste handtekening en aanroepsite-updates
argument-hint: "[bestand] [regelrange of beschrijving]"
---
Je voert een chirurgische extract-function refactor uit op $ARGUMENTS.

Stappen:
1. Lees het doelbestand. Identificeer het code-blok om te extraheren — ofwel het gegeven regelbereik of de logica die overeenkomt met de beschrijving.
2. Bepaal de minimale set invoer die de geëxtraheerde functie nodig heeft (parameters) en wat deze moet retourneren (retourwaarden of mutaties).
3. Kies een naam die nauwkeurig is en werkwoord-eerst (bijv. `computeRetryDelay`, `parseHeaderToken`, `buildQueryString`). Gebruik geen vage namen zoals `helper` of `util`.
4. Schrijf de geëxtraheerde functie met:
   - De juiste handtekening die voldoet aan de conventies van de hostprogrammeertaal (typeannotaties als de taal deze ondersteunt)
   - Een zin lange docstring/opmerking alleen als het doel niet voor de hand liggend is
   - Geen bijeffecten buiten wat de originele code had
5. Vervang het originele blok door een aanroep naar de nieuwe functie, die de geïdentificeerde argumenten doorgeeft en retourwaarden vastlegt.
6. Verifieer:
   - De aanroepsite compileert/parseert schoon (controleer op ongebruikte achtergebleven variabelen, ontbrekende returns, verbroken controleflow)
   - Geen variabele uit het buitenste bereik wordt nu gereferentieerd binnen de functie die niet expliciet werd doorgegeven
   - Als de taal getypeerd is, zijn de typen consistent van begin tot eind
7. Als de geëxtraheerde logica meer dan eens elders in het bestand verschijnt, vervang die exemplaren ook en noteer hoeveel aanroepsites werden bijgewerkt.
8. Geef de diff. Herschrijf geen onverwante code.

Beperkingen:
- Behoud het bestaande gedrag precies — dit is een refactor, geen herschrijving.
- Verander niet de logica van het geëxtraheerde blok, alleen de locatie en aanroeping.
- Als extractie niet veilig is (bijv. het blok verandert meerdere buitenste variabelen op verstrengelde wijzen), leg uit waarom en stel een veiliger grens voor in plaats daarvan.
