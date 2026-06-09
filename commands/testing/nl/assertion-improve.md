---
description: Versterk zwakke of oppervlakkige assertions in bestaande tests
argument-hint: "[testbestand of -directory]"
---
Review en verbeter assertions in: $ARGUMENTS

Stappen:

1. Lees het doelbestand of alle testbestanden onder de doeldirectory.

2. Identificeer zwakke assertion-patronen — noteer elk met bestandspad en regelnummer:

   **Te brede matchers**
   - `toBeTruthy` / `toBeFalsy` wanneer een specifieke waarde controleerbaar is
   - `toBeDefined` wanneer de vorm of type kan worden beoordeeld
   - `toContain` op volledige objecten wanneer een exacte overeenkomst passend is

   **Onvolledige dekking**
   - Tests die de retourwaarde controleren maar niet het bijeffect (of omgekeerd)
   - Foutpaden die alleen `throw` controleren zonder het foutbericht of -type te verifiëren
   - Asynchrone functies waarvan het afwijzingsgeval niet wordt getest

   **Overmatig snapshot-gebruik**
   - Snapshots die volledige grote component-bomen dekken waarbij gerichte property-assertions stabieler en leesbaarder zouden zijn
   - Snapshots die irrelevante implementatiedetails coderen (bijv. interne CSS-klassenamen)

   **Ontbrekende grenswaarden-controles**
   - Functies die arrays/strings accepteren maar geen test voor lege invoer
   - Numerieke functies zonder test bij nul, negatief of maximale grenswaarde
   - Nullable parameters zonder null/undefined test

   **Assertion-aantal**
   - Tests zonder assertions (vals positief)
   - Tests met een enkele `expect` die niet tussen twee soortgelijke foutmodi kan onderscheiden

3. Voor elke bevinding, toon:
   - De huidige assertion
   - Waarom het zwak is
   - Een vervanging die specifieker, betekenisvoller of completer is

4. Pas alle wijzigingen toe die onambigue verbeteringen zijn — verander geen doorgaande tests in falende.

5. Voeg geen nieuwe testgevallen toe; verbeter alleen assertions binnen bestaande tests.

6. Samenvatting: X assertions gereviewed, Y vervangen, Z gemarkeerd maar niet gewijzigd (met reden).
