---
description: Identificeer en verwijder onbereikbare, ongebruikte of verouderde code
argument-hint: "[file or directory]"
---
Voer een dead-code verwijderings-pass uit op $ARGUMENTS.

1. Lees elk bestand in bereik. Bouw een mentaal kaart van:
   - Geëxporteerde versus interne symbolen
   - Functies, variabelen, types, constanten, imports die gedeclareerd zijn maar nooit gerefereerd
   - Branches die nooit bereikt kunnen worden (bijv. code na onvoorwaardelijke return, condities die altijd waar/onwaar zijn vanwege constante waarden)
   - Feature flags of env-var guards die permanent aan of uit zijn gegeven de huidige codebasestatus
   - Uit commentaar gehaalde codeblokken — verwijder deze tenzij ze een gedateerde rationale-opmerking bevatten

2. Voor elk dood symbool of blok gevonden:
   - Bevestig dat het niet wordt gerefereerd via dynamische dispatch, reflectie, op string gebaseerde lookup, of een externe beller buiten het gescande bereik. Zeg het indien onzeker en sla over.
   - Verwijder de declaratie en al zijn lokale ondersteuning (bijbehorende type aliases, hulpvariabelen die alleen door deze worden gebruikt, re-exports die alleen deze blootstellen).

3. Na elke verwijdering, verwijder alle imports of requires die nu ongebruikt zijn.

4. Formateer, hernoem of herstructureer niets anders. Alleen dead-code verwijdering.

5. Geef een lijst met elk verwijderd item: symboolnaam, bestand, lijnbereik en reden (ongebruikt / onbereikbaar / vervangen).

6. Als een symbool dood lijkt te zijn maar een opmerking bevat die toekomstig gebruik suggereert of deel uitmaakt van een openbaar API-contract (bijv. geëxporteerd uit het indexbestand van een bibliotheek), markeer het in plaats van het te verwijderen.

Beperkingen:
- Verwijder code niet alleen omdat deze redundant lijkt — deze moet aantoonbaar ongerefereerd of onbereikbaar zijn.
- Raak testbestanden niet aan tenzij het argument deze expliciet insluit.
- Als verwijdering zou veranderen in waarneembaar gedrag (bijv. een bijwerking-import), markeer het en verwijder het niet.
