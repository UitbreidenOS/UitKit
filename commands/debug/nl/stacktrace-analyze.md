---
description: Analyseer een stack trace om root cause, call chain, en actionabel fix te identificeren
argument-hint: "[plak stack trace]"
---
Analyseer de volgende stack trace en produceer een precieze, actionabele diagnose.

Stack trace:
$ARGUMENTS

Werk dit systematisch door:

1. **Parse de trace** — identificeer de taal en runtime (Python, JVM, Go, Node, Rust, .NET, enz.). Let op het exception/error type en bericht bovenaan de trace.

2. **Loop door de call chain** — beginnend bij het originele throw point (diepste relevante frame), trace naar boven door elk frame:
   - Identificeer welke frames application code zijn versus framework/library versus runtime internals
   - Focus analyse op de application frames — hier zit de bug
   - Staat voor elk application frame wat die functie verantwoordelijk is voor en waarom het in deze call chain zit

3. **Pinpoint de origin** — identificeer het enkele frame waar control van het juiste pad af had moeten gaan. Dit is niet altijd het diepste frame; het is het frame waar een foute aanname, ontbrekende check, of ongeldige state werd geïntroduceerd.

4. **Lees de source** — als de file paths in de trace bestaan in deze repository, lees de relevante regels. Cross-referentie de regel nummers in de trace met de werkelijke code. Vertrouw niet alleen op de trace.

5. **Diagnose de root cause** — zeg exact welke conditie deze trace triggerde. Wees specifiek over variable values, object states, of timing die hier toe leidden als ze afleidbaar zijn.

6. **Sluit red herrings uit** — als enige frames noise zijn (async wrappers, middleware, retry loops), zeg dit expliciet zodat de lezer ze niet achterna gaat.

7. **Fix** — geef de concrete code change die dit failure path elimineert. Toon de exacte locatie (file, function, line range) en de before/after change. Als de fix begrip van externe state vereist, zeg wat je moet checken en hoe.

8. **Regression guard** — suggereer de minimale test die dit had kunnen vangen voordat het production bereikte.
