---
description: Splits een te groot of gemengd-concern bestand in gerichte modules
argument-hint: "[file]"
---
Split $ARGUMENTS in kleinere bestanden met één verantwoordelijkheid.

1. Lees het gehele bestand. Identificeer logische clusters van symbolen:
   - Groepeer op domeinverantwoordelijkheid (bijv. auth-logica, DB-query's, HTTP-handlers, utility-helpers)
   - Groepeer op type (bijv. alle types/interfaces samen, alle constanten samen) als dat de conventie van het project is
   - Bekijk bestaande zusterbestanden in dezelfde directory om het gevestigde split-patroon na te volgen

2. Stel een splitplan voor voordat je wijzigingen aanbrengt:
   - Vermeld elke nieuwe bestandsnaam en welke symbolen deze zal bevatten
   - Identificeer alle cross-file-afhankelijkheden die de split zal creëren (imports die voorheen niet bestonden)
   - Bepaal welk bestand, indien aanwezig, het re-export-barrel wordt (index.ts, __init__.py, mod.rs, enzovoort)

3. Voer de split uit:
   - Maak elk nieuw bestand aan met alleen de symbolen die eraan zijn toegewezen
   - Voeg alle noodzakelijke import-statements toe — zowel binnen de nieuwe bestanden als vanuit bestanden die eerder het origineel importeerden
   - Update het originele bestand om opnieuw uit te voeren vanuit de nieuwe modules als achterwaartse compatibiliteit vereist is; anders verwijder het origineel
   - Verwijder alle nu-redundante imports binnen de nieuwe bestanden

4. Controleer dat elk symbool dat van buiten het originele bestand bereikbaar was, nog steeds bereikbaar is op hetzelfde import-pad, of documenteer de padwijziging expliciet.

5. Hernoem geen symbolen, wijzig geen logica, en herformateer geen code tijdens de split.

6. Output: lijst met gemaakte nieuwe bestanden, symbolen die naar elk zijn verplaatst, en alle import-paden die externe aanroepers moeten bijwerken.

Beperkingen:
- Split nooit in meer dan 5 bestanden in één keer — als het bestand meer rechtvaardigt, leg dit uit en stop na 5.
- Maak geen bestanden kleiner dan ongeveer 20 betekenisvolle regels, tenzij de domeingrens uitzonderlijk duidelijk is.
- Zorg ervoor dat de nieuwe bestandsnamen overeenkomen met de naamgevingsconventie van het project.
