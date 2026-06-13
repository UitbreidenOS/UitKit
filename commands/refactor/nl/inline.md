---
description: Voeg een functie, variabele of constante inline die indirectie zonder waarde toevoegt
argument-hint: "[symbol-name] [file]"
---
Voeg het in $ARGUMENTS opgegeven symbool inline — format: `<symbol-name> <file>`.

1. Lees het bestand. Zoek de declaratie van het benoemde symbool en elke aanroepingsplek of gebruik.

2. Bepaal of inlinen passend is. Inlinen is passend wanneer:
   - Het symbool op slechts één of twee plaatsen wordt aangeroepen
   - De body van het symbool eenvoudiger of duidelijker is dan de naam suggereert (de naam voegt geen informatie toe)
   - Het symbool een wrapper van één expressie is zonder hergebruikswaarde
   - Een variabele of constante eenmaal wordt toegewezen en eenmaal wordt gebruikt, en de tussenliggende naam helpt niet met leesbaarheid

   Voeg NIET inline wanneer:
   - Het symbool op 3+ plaatsen wordt gebruikt (inlinen zou duplicatie herintroduceren)
   - De naam is werkelijk informatief en het verwijderen zou opzet obscuur maken
   - Het symbool neveneffecten heeft die tijdens declaratie worden uitgevoerd (inlinen kan uitvoervolgorde veranderen)
   - Het symbool is geëxporteerd of onderdeel van een openbare API

3. Voor elke aanroepingsplek:
   - Vervang de body van het symbool rechtstreeks, met eventuele parameterbindingen correct vervangen
   - Als de body verwijst naar variabelen uit het originele bereik die niet beschikbaar zijn op de aanroepingsplek, stop en rapporteer — de inline is niet veilig
   - Zorg ervoor dat de operatorrangorde na vervanging correct is (voeg haakjes toe indien nodig)

4. Nadat alle plaatsen zijn inlined, verwijder je de originele declaratie.

5. Verwijder alle imports die alleen ter ondersteuning van het nu-verwijderde symbool bestonden.

6. Verifieer dat het resultaat syntactisch en semantisch correct is:
   - Geen hanggende verwijzingen
   - Geen gewijzigde evaluatievolgorde voor expressies met neveneffecten
   - Typen kloppen nog steeds als de taal getypeerd is

7. Output: symboolnaam, aantal plaatsen inlined, originele declaratielocatie, en bevestiging dat het werd verwijderd.
