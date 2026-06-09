---
description: Een geheugenlek diagnosticeren en lokaliseren op basis van een symptoomsbeschrijving of codepad
argument-hint: "[symptoomsbeschrijving, bestand of functienaam]"
---
Onderzoek een geheugenlek op basis van: $ARGUMENTS

Werk hier systematisch doorheen. Gok niet — volg toewijzingspaden.

1. **Stel de leksignatuur vast**
   - Groeit het heapgebruik onbegrensd, of is het een eenmalige piek die nooit vrijkomt?
   - Is het lek procesbreed of geïsoleerd tot een subsysteem (bijv. een requesthandler, een workerthread)?
   - Let op de taal/runtime — GC-talen (JS, Python, Go, JVM) lekken anders dan talen met handmatig geheugen (C, C++, Rust unsafe).

2. **Identificeer kandidaatsites** — scan het codepad in $ARGUMENTS op:
   - Langlevende verzamelingen (caches, registers, event listener maps) die groeien zonder evacuatie
   - Closures of lambda's die grote objecten vastleggen die hun bruikbare bereik overleven
   - Circulaire verwijzingen die reference-counting GCs verslaan (Python, Swift, ObjC)
   - Finalizers of destructors die nooit aangeroepen worden (resourcehandles, bestandsdescriptors, sockets)
   - `static` of module-niveau status geaccumuleerd over requests/calls
   - Buffers of streams toegewezen maar nooit gesloten/afgetapt

3. **Instrument ter verificatie** — voordat u beweert dat het opgelost is:
   - Voeg een heapsnapshot of toewijzingsteller toe op de verdachte site
   - Schrijf een lus die het verdachte pad N keer uitoefent en controleer of heapgroei begrensd is
   - Zorg in GC-talen voor een collectie voordat u meet om fout-positieven te vermijden

4. **Leg de retaining reference vast** — volg de referentieketen van het gelekte object terug naar een GC-root:
   - Wat houdt een verwijzing naar het gelekte object?
   - Is het opzettelijk (cache) of onopzettelijk (vergeten listener, verouderde closure)?

5. **Stel de fix voor** — zodra u de retaining reference hebt:
   - Begrensde cache met LRU/TTL evacuatie
   - Expliciete deregister/cleanup-aanroep in een finally/defer/destructor
   - WeakRef of WeakMap waar sterke eigendom niet nodig is
   - Scopereductie zodat het object aan het einde van het blok vrijkomt

6. **Schrijf een regressietest** — een test die N keer toewijst/vrijmaakt en controleert dat piek-RSS of
   objecttelling vlak blijft. Wankele lektests zijn erger dan geen; maak het deterministisch.

Uitvoer: de verdachte leksites met file:line verwijzingen, de retaining reference chain,
en de voorgestelde fix. Als u het niet kunt bevestigen zonder de code uit te voeren, zeg dit dan expliciet.
