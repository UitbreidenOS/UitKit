---
description: Analyseer een stack trace om de root cause, call chain en uitvoerbare fix te identificeren
argument-hint: "[paste stack trace]"
---
Analyseer de volgende stack trace en produceer een nauwkeurige, uitvoerbare diagnose.

Stack trace:
$ARGUMENTS

Werk dit systematisch door:

1. **Parse the trace** — identificeer de taal en runtime (Python, JVM, Go, Node, Rust, .NET, enzovoort). Noteer het exception/error type en bericht bovenaan de trace.

2. **Walk the call chain** — beginnend vanaf het originele throw point (diepste relevante frame), trace omhoog door elk frame:
   - Identificeer welke frames application code zijn versus framework/library versus runtime internals
   - Focus analyse op de application frames — dit is waar de bug leeft
   - Voor elk application frame, geef aan wat die functie verantwoordelijk voor is en waarom het in deze call chain is

3. **Pinpoint the origin** — identificeer het enkele frame waar controle af had moeten wijken van het juiste pad. Dit is niet altijd het diepste frame; het is het frame waar een foute aanname, ontbrekende controle of ongeldige status werd geïntroduceerd.

4. **Read the source** — als de bestandspaden in de trace in deze repository bestaan, lees dan de relevante regels. Kruisreferentie de regelnummers in de trace met de werkelijke code. Vertrouw niet alleen op de trace.

5. **Diagnose the root cause** — zeg exact welke voorwaarde deze trace heeft veroorzaakt. Wees specifiek over variabelewaarden, objectstaten of timing die hier toe hebben geleid, als deze afleidbaar zijn.

6. **Rule out red herrings** — als frames ruis zijn (async wrappers, middleware, retry loops), zeg dit expliciet zodat de lezer ze niet na gaat.

7. **Fix** — geef de concrete codewijziging die dit foutpad elimineert. Toon de exacte locatie (bestand, functie, regelbereik) en de before/after wijziging. Als de fix inzicht in externe status vereist, zeg wat u moet controleren en hoe.

8. **Regression guard** — suggereer de minimale test die dit zou hebben gevangen voordat het productie bereikt.
