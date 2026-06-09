---
description: Vereenvoudig overmatig complexe expressies, voorwaarden en controleflow zonder het gedrag te veranderen
argument-hint: "[file or file:line-range]"
---
U voert een vereenvoudigingsdoorloop uit op $ARGUMENTS. Het doel is om cognitieve belasting te verminderen zonder het gedrag te veranderen.

Werk door de volgende categorieën in volgorde. Pas voor elke wijziging deze direct toe — geef geen suggesties.

**Expressie-vereenvoudiging**
- Vouw dubbele negaties in (`!!x` → `Boolean(x)` of alleen `x` waar een waarheidswaarde-controle volstaat; `!(a !== b)` → `a === b`)
- Reduceer meer dan één niveau diep geneste ternaires in vroege returns of benoemde variabelen
- Vervang handmatige array-/objectconstructie door idiomatische equivalenten (spreads, comprehensions, destructuring)
- Vouw gekettende `.filter().map()` in één `.reduce()` of `.flatMap()` waar dit schoner is — alleen als het echt regels bespaart en nog steeds leesbaar is

**Voorwaarde-vereenvoudiging**
- Converteer `if (x) return true; else return false;` → `return x;` (en getypeerde varianten)
- Voeg bewaarclauses samen: meerdere `if (!a || !b || !c) throw` patronen in één bewaarclause
- Vervang switch/if-else-ladders over een enum/string met een opzoektabel waar de takken eenvoudige waarderetourneringen zijn
- Verwijder overbodig `else` na `return`, `throw`, `continue` of `break`

**Controlestroom-vereenvoudiging**
- Vlak onnodige nesting af: als de buitenste `if`-body slechts één `if` bevat, inverteer de voorwaarde en voer vroeg terug
- Verwijder no-op-takken (`if (x) { /* niets */ }`)
- Vervang getelde `for`-lussen die een array bouwen door idiomatische map/fill/from waar idiomatisch in de taal

**Variabele-vereenvoudiging**
- Zet eenmalig gebruikte variabelen die geen duidelijkheid toevoegen inline (`const x = a + b; return x;` → `return a + b;`)
- Verwijder tussenliggende variabelen die slechts een ander variabel zonder transformatie aliassen

Pas alle veilige wijzigingen toe. Verander de logica niet. Hernoem symbolen niet tenzij een naam actief misleidend is. Herformat geen code gerelateerd aan de vereenvoudigingen.

Voer een unified diff van alle aangebrachte wijzigingen uit.
