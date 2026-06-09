---
description: Een oversized of mixed-concern bestand in gerichte modules splitsen
argument-hint: "[file]"
---
Splits $ARGUMENTS in kleinere, single-concern bestanden.

1. Lees het volledige bestand. Identificeer logische clusters van symbolen:
   - Groepeer op domein concern (bijv. auth logica, DB queries, HTTP handlers, utility helpers)
   - Groepeer op type (bijv. alle types/interfaces samen, alle constanten samen) als dat de conventie van het project is
   - Bekijk bestaande sibling bestanden in dezelfde directory om het gevestigde split patroon te matchen

2. Stel een split plan voor alvorens wijzigingen aan te brengen:
   - Zet iedere nieuwe bestandsnaam en welke symbolen deze zal bevatten op
   - Identificeer alle cross-file dependencies die de split zal creëren (imports die voorheen niet bestonden)
   - Zeg welk bestand, zo aanwezig, het re-export barrel wordt (index.ts, __init__.py, mod.rs, etc.)

3. Voer de split uit:
   - Creëer ieder nieuw bestand met alleen de symbolen die eraan toegewezen zijn
   - Voeg alle noodzakelijke import statements toe — zowel binnen de nieuwe bestanden als van alle bestanden die voorheen het originele bestand importeerden
   - Update het originele bestand om te re-exporten van de nieuwe modules als backward compatibility vereist is; anders verwijder het originele
   - Verwijder alle nu-redundante imports binnen de nieuwe bestanden

4. Verifieer dat ieder symbool dat van buiten het originele bestand bereikbaar was nog steeds bereikbaar is op hetzelfde import pad, of zet de padwijziging expliciet op papier.

5. Hernoem symbolen niet, wijzig logica niet, en format code niet opnieuw tijdens de split.

6. Output: lijst van gemaakte nieuwe bestanden, symbolen die naar ieder ervan verplaatst zijn, en alle import paden die externe oproepers moeten updaten.

Constraints:
- Splits nooit in meer dan 5 bestanden in één pass — als het bestand meer rechtvaardigt, leg uit en stop na 5.
- Creëer geen bestanden kleiner dan ~20 betekenisvolle regels tenzij de domein grens uitzonderlijk duidelijk is.
- Match de nieuwe bestandsnamen op de bestaande naamgevingsconventie van het project.
