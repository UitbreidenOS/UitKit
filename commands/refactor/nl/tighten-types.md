---
description: Versterk zwakke of ontbrekende typeannotaties in een bestand
argument-hint: "[file]"
---
Zet de types in $ARGUMENTS strakker.

1. Lees het bestand. Identificeer elke locatie waar types zwakker zijn dan zou moeten:
   - `any` in TypeScript — vervang met het nauwste correcte type, union, of generiek
   - Ongetypeerde functieparameters of retourwaarden
   - Veel te brede types (`object`, `Record<string, any>`, `dict`, `interface{}`) waar een concrete vorm bekend is
   - Optioneel (`T | undefined`, `T | None`) gebruikt waar de waarde altijd aanwezig is
   - Niet-optioneel gebruikt waar de waarde legitiem afwezig kan zijn — voeg het optioneel toe en verwerk het op call sites
   - Enums of union types die bare `string` of `number` literals kunnen vervangen
   - `as` casts / type assertions die kunnen worden vervangen met juiste type narrowing of guards

2. Voor elk zwak type dat is gevonden:
   - Beredeneer het correcte type vanuit gebruik, omringende context, en bestaande documentatie
   - Pas het strakker type toe op de declaratieplaats
   - Repareer downstream type-fouten die het strakker trekken blootlegt — laat geen verbroken call sites achter
   - Als strakker trekken een nieuw type alias of interface vereist, definieer het dicht bij de bovenkant van het bestand (of in een bestaand types-bestand als het project er een heeft)

3. Verander niet het runtime gedrag. Alleen type-wijzigingen.

4. Voeg types niet zomaar toe — als het type van een lokale variabele duidelijk is van een letterlijke toewijzing en de taal zet het correct af, laat inferentie met rust.

5. Als het retourtype van een functie momenteel is afgeleid en de inferentie is correct en stabiel, laat het staan. Annoteer alleen waar het afgeleide type veel te breed is of waarschijnlijk afwijkt.

6. Na alle wijzigingen, controleer of het bestand conceptueel de type checker van het project zou passeren (`tsc --noEmit`, `mypy`, `cargo check`, enz.). Als u niet kunt verifiëren, vlag wijzigingen die een type-fout kunnen introduceren.

7. Output: lijst van elk type dat is strakgetrokken, origineel type, nieuw type, en locatie.
