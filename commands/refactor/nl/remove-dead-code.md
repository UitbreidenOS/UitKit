---
description: Identificeer en verwijder onbereikbare, ongebruikte of verouderde code
argument-hint: "[bestand of map]"
---
Voer een verwijderingsprocedure voor dode code uit op $ARGUMENTS.

1. Lees alle bestanden in bereik. Bouw een mentaal kaart van:
   - Geëxporteerde vs. interne symbolen
   - Functies, variabelen, types, constanten, imports die zijn gedefinieerd maar nooit waarnaar wordt verwezen
   - Branches die nooit bereikt kunnen worden (bijv. code na onvoorwaardelijke return, voorwaarden die altijd waar/onwaar zijn vanwege constante waarden)
   - Feature flags of env-var guards die permanent aan of uit zijn gegeven de huidige codebasis status
   - Uitgecommentarieerde codeblokken — verwijder ze tenzij ze een gedateerde rationale opmerking bevatten

2. Voor elk dood symbool of blok dat is gevonden:
   - Bevestig dat het niet wordt verwezen via dynamische dispatch, reflectie, op string gebaseerde zoekopdrachten of externe aanroepers buiten het gescande bereik. Geef aan of je onzeker bent en sla over.
   - Verwijder de declaratie en alle bijbehorende ondersteuningsstructuur (gerelateerde type aliases, hulpvariabelen die alleen door het worden gebruikt, opnieuw geëxporteerde items die het alleen blootstellen).

3. Na elke verwijdering, verwijder alle imports of requires die nu ongebruikt zijn.

4. Hervormaat, hernoem of herstructureer niets anders. Alleen verwijdering van dode code.

5. Voer een lijst uit van elk verwijderd item: symboolnaam, bestand, lijnbereik en reden (ongebruikt / onbereikbaar / vervangen).

6. Als een symbool dood lijkt maar een opmerking bevat die toekomstig gebruik suggereert of onderdeel is van een publiek API-contract (bijv. geëxporteerd uit het indexbestand van een bibliotheek), markeer het in plaats van het te verwijderen.

Beperkingen:
- Verwijder geen code alleen omdat het redundant lijkt — het moet aantoonbaar onverwezen of onbereikbaar zijn.
- Raak testbestanden niet aan tenzij het argument ze expliciet omvat.
- Als verwijdering zou leiden tot veranderd waarneembaar gedrag (bijv. een import met bijwerkingen), markeer dit en verwijder niet.
