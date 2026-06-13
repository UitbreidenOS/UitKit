---
description: Versterken van zwakke of oppervlakkige assertions in bestaande tests
argument-hint: "[testbestand of directory]"
---
Beoordeel en verbeter assertions in: $ARGUMENTS

Stappen:

1. Lees het doelbestand of alle testbestanden in de doeldirectory.

2. Identificeer zwakke assertion-patronen — noteer elk met bestandspad en regelnummer:

   **Te brede matchers**
   - `toBeTruthy` / `toBeFalsy` wanneer een specifieke waarde controleerbaar is
   - `toBeDefined` wanneer de structuur of type kan worden geverifieerd
   - `toContain` op volledige objecten wanneer een exacte match passend is

   **Onvolledige dekking**
   - Tests die de retourwaarde controleren maar niet het bijeffect (of omgekeerd)
   - Foutpaden die alleen `throw` controleren zonder het foutbericht of type te verifiëren
   - Asynchrone functies waarvan het afwijzingsgeval niet wordt getest

   **Overgebruik van snapshots**
   - Snapshots die volledige grote componentenbomen bedekken waarbij gerichte property-assertions stabieler en leesbaarder zouden zijn
   - Snapshots die irrelevante implementatiedetails coderen (bijv. interne CSS-klassenamen)

   **Ontbrekende grenscontroles**
   - Functies die arrays/strings accepteren maar geen test voor lege invoer
   - Numerieke functies zonder test bij nul, negatief of maximale grens
   - Nullable-parameters zonder nul/undefined-test

   **Aantal assertions**
   - Tests zonder assertions (vals positief resultaat)
   - Tests met één `expect` die niet kan onderscheiden tussen twee vergelijkbare foutmodi

3. Toon voor elke bevinding:
   - De huidige assertion
   - Waarom deze zwak is
   - Een vervanging die specifieker, betekenisvol of completer is

4. Pas alle wijzigingen toe die ondubbelzinnig verbeteringen zijn — wijzig geslaagde tests niet in mislukte tests.

5. Voeg geen nieuwe testgevallen toe; verbeter alleen assertions binnen bestaande tests.

6. Samenvatting: X assertions gecontroleerd, Y vervangen, Z gemarkeerd maar niet gewijzigd (met reden).
