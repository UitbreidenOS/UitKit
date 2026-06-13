---
description: Verlaag cyclomatische complexiteit en nesthiërarchie in een functie of bestand
argument-hint: "[bestand] [functienaam of regelnummer, optioneel]"
---
Verminder de complexiteit van de code in $ARGUMENTS.

1. Lees het doel. Als een specifieke functie of regel is gegeven, richt je daar op. Anders identificeer je de regio's met de hoogste complexiteit: diep geneste voorwaarden, lange functies met veel vertakkingen, guard-ketens die het happy path verbergen.

2. Meet complexiteitssignalen:
   - Nesthiërarchie > 3 niveaus
   - Functielegte > 40 regels met meerdere verantwoordelijkheden
   - Cyclomatische complexiteit > 10 (tel: `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` vertakkingen)
   - Booleaanse expressies met > 3 operanden
   - Lange if-else-ketens die tabel-gestuurd of polymorf kunnen zijn

3. Pas gerichte reducties toe:

   Vroege returns / guard-clausules:
   - Inverteer voorwaarden om snel te falen bovenaan de functie, waardoor diepe else-vertakkingen niet nodig zijn

   Extraheer subfuncties:
   - Haal complexe voorwaarden in benoemde predikaat-functies (`isEligible()`, `hasPermission()`)
   - Haal lusbodies in benoemde functies als de body > 5 regels is

   Vervang voorwaarden met gegevens:
   - Als een keten van `if/else` of `switch` invoerwaarden aan uitvoerwaarden toewijst, vervang dan door een opzoektabel / map

   Vereenvoudig geneste lussen:
   - Gebruik `.flatMap()`, generators of hulpfuncties om driedubbel geneste lussen te vermijden
   - Overweeg indien ondersteund door de taal gestructureerde gelijktijdigheid of pijplijn-patronen

   Vereenvoudig booleaanse logica:
   - Pas De Morgan's wetten toe om ontkende samengestelde expressies te elimineren
   - Extraheer benoemde booleans voor complexe voorwaarden (`const isExpired = date < now && !renewed`)

4. Verlaag complexiteit niet door deze te verbergen (bijv. een complexe vertakking naar een lambda verplaatsen die onmiddellijk wordt aangeroepen). Het doel is echte vereenvoudiging, niet verplaatsing.

5. Behoud al het gedrag exact. Voer een mentale diff uit: elke invoer die uitvoer X produceerde moet nog steeds uitvoer X produceren.

6. Uitvoer: originele complexiteitsschatting, nieuwe schatting en een samenvatting van elke toegepaste transformatie.
