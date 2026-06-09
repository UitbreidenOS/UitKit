---
description: Verlaag de cyclomatische complexiteit en nestdiepte in een functie of bestand
argument-hint: "[file] [function name or line number, optional]"
---
Verminder de complexiteit van de code in $ARGUMENTS.

1. Lees het doel. Als een specifieke functie of regel is gegeven, focus daar. Anders identificeer de regio's met de hoogste complexiteit: diep geneste voorwaarden, lange functies met veel vertakkingen, guard-ketens die het happy path verdoezelen.

2. Meet complexiteitssignalen:
   - Nestdiepte > 3 niveaus
   - Functilengte > 40 regels met meerdere verantwoordelijkheden
   - Cyclomatische complexiteit > 10 (tel: `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` vertakkingen)
   - Booleaanse uitdrukkingen met > 3 operanden
   - Lange if-else-ketens die tafel-gedreven of polymorf kunnen zijn

3. Pas gerichte reducties toe:

   Vroege returns / guard-clausules:
   - Keer voorwaarden om om snel te falen aan het begin van de functie, waardoor diepe else-takken niet nodig zijn

   Extract subfuncties:
   - Trek complexe voorwaarden in benoemde predikaat-functies (`isEligible()`, `hasPermission()`)
   - Trek loop-lichamen in benoemde functies als het lichaam > 5 regels is

   Vervang voorwaarden met data:
   - Als een keten van `if/else` of `switch` invoerwaarden aan uitvoerwaarden toewijst, vervang deze door een opzoektabel / kaart

   Vereenvoudig geneste lussen:
   - Gebruik `.flatMap()`, generatoren, of hulpfuncties om drievoudig geneste lussen te vermijden
   - Overweeg gestructureerde gelijktijdigheid of pijplijn-patronen als de taal dit ondersteunt

   Vereenvoudig booleaanse logica:
   - Pas De Morgan's wetten toe om genegeerde samengestelde uitdrukkingen te elimineren
   - Extract benoemde booleans voor complexe voorwaarden (`const isExpired = date < now && !renewed`)

4. Verminder complexiteit niet door deze te verbergen (bijvoorbeeld door een complexe tak in een lambda te verplaatsen die onmiddellijk wordt aangeroepen). Het doel is echte vereenvoudiging, niet verplaatsing.

5. Behoud al het gedrag exact. Voer een mentale diff uit: elke invoer die uitvoer X produceerde moet nog steeds uitvoer X produceren.

6. Output: originele complexiteitsschatting, nieuwe schatting en een samenvatting van elke toegepaste transformatie.
