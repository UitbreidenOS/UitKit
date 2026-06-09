---
description: Versterk zwakke of ontbrekende type-annotaties in een bestand
argument-hint: "[file]"
---
Versterk de types in $ARGUMENTS.

1. Lees het bestand. Identificeer elke locatie waar types zwakker zijn dan ze zouden moeten zijn:
   - `any` in TypeScript — vervang met het nauwste correcte type, union, of generic
   - Niet-getypeerde functieparameters of retourwaarden
   - Overly broad types (`object`, `Record<string, any>`, `dict`, `interface{}`) waar een concrete shape bekend is
   - Optional (`T | undefined`, `T | None`) gebruikt waar de waarde altijd aanwezig is
   - Niet-optional gebruikt waar de waarde legaal afwezig kan zijn — voeg de optional toe en handle het op call sites
   - Enums of union types die bare `string` of `number` literals kunnen vervangen
   - `as` casts / type assertions die kunnen worden vervangen met proper type narrowing of guards

2. Voor elk zwak type gevonden:
   - Leid het correcte type af van gebruik, omringende context, en bestaande documentatie
   - Pas het nauwere type toe op de declaration site
   - Fix eventuele downstream type errors die de versteviging blootlegt — laat niet-gebroken call sites niet staan
   - Als versteviging een nieuwe type alias of interface vereist, definieer dit dicht bij de bovenkant van het bestand (of in een bestaand types-bestand als het project er een heeft)

3. Wijzig het runtime-gedrag niet. Alleen type-wijzigingen.

4. Voeg geen types toe alleen om types toe te voegen — als het type van een lokale variabele duidelijk is van een letterlijke toewijzing en de taal het correct afleidt, laat inference achterwege.

5. Als het retourtype van een functie momenteel wordt afgeleid en de afleideding is correct en stabiel, laat het achterwege. Annoteer alleen waar het afgeleide type overly broad is of waarschijnlijk zal drijven.

6. Na alle wijzigingen, verifieer conceptueel dat het bestand zou doorstaan de type checker van het project (`tsc --noEmit`, `mypy`, `cargo check`, etc.). Als je niet kunt verifiëren, markeer elke wijziging die een type error kan introduceren.

7. Output: lijst van elk type versterkt, origineel type, nieuw type, en locatie.
