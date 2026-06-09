---
description: Inline een functie, variabele of constante die indirection zonder waarde toevoegt
argument-hint: "[symbol-name] [file]"
---
Inline het symbool opgegeven in $ARGUMENTS — formaat: `<symbol-name> <file>`.

1. Lees het bestand. Zoek de declaratie van het genoemde symbool en elke aanroepsite of gebruik.

2. Bepaal of inlining geschikt is. Inlining is geschikt wanneer:
   - Het symbool op slechts één of twee plaatsen wordt aanroepen
   - De body van het symbool is eenvoudiger of duidelijker dan de naam suggereert (de naam voegt geen informatie toe)
   - Het symbool is een single-expression wrapper zonder hergebruikswaarde
   - Een variabele of constante wordt eenmaal toegewezen en eenmaal gebruikt, en de tussenliggende naam helpt niet met leesbaarheid

   Inline NIET wanneer:
   - Het symbool wordt op 3+ plaatsen gebruikt (inlining zou duplicatie opnieuw introduceren)
   - De naam is werkelijk informatief en het verwijderen ervan zou de bedoeling obscuur maken
   - Het symbool heeft neveneffecten die bij declaratie worden uitgevoerd (inlining kan uitvoervolgorde veranderen)
   - Het symbool wordt geëxporteerd of maakt deel uit van een openbare API

3. Voor elke aanroepsite:
   - Vervang de body van het symbool direct, met alle parameterbindingen correct gesubstitueerd
   - Als de body variabelen uit het oorspronkelijke bereik referenceert die niet beschikbaar zijn op de aanroepsite, stop en rapporteer — de inline is niet veilig
   - Zorg ervoor dat operator prioriteit correct is na substitutie (voeg haakjes toe indien nodig)

4. Na inlining van alle sites, verwijder de originele declaratie.

5. Verwijder alle imports die alleen bestonden ter ondersteuning van het nu verwijderde symbool.

6. Verifieer dat het resultaat syntactisch en semantisch correct is:
   - Geen bungelverwisselingen
   - Geen veranderde evaluatievolgorde voor expressies met neveneffecten
   - Typen controleren nog steeds als de taal getypeerd is

7. Output: symboolnaam, aantal sites inline, locatie van originele declaratie, en bevestiging dat deze is verwijderd.
