---
description: Vereenvoudig overmatig complexe expressies, voorwaarden en controleflow zonder gedrag te wijzigen
argument-hint: "[bestand of bestand:regel-bereik]"
---
Je voert een vereenvoudigingspass uit op $ARGUMENTS. Het doel is om cognitieve belasting te verminderen zonder het gedrag te wijzigen.

Werk door de volgende categorieën in volgorde. Pas elke wijziging direct toe — geef geen suggesties.

**Expressie-vereenvoudiging**
- Vouw dubbele negaties in (`!!x` → `Boolean(x)` of gewoon `x` waar een waarheidswaarde-controle volstaat; `!(a !== b)` → `a === b`)
- Reduceer ternaire operatoren die meer dan één niveau diep genest zijn naar early returns of benoemde variabelen
- Vervang handmatige array-/objectconstructie met idiomatische equivalenten (spreads, comprehensions, destructuring)
- Vouw gekettingde `.filter().map()` waarbij een enkele `.reduce()` of `.flatMap()` schoner is — alleen als het het aantal regels echt vermindert en nog steeds leesbaar is

**Voorwaarde-vereenvoudiging**
- Zet `if (x) return true; else return false;` om naar `return x;` (en getypeerde varianten)
- Voeg guard clauses samen: meerdere `if (!a || !b || !c) throw` patronen in één guard
- Vervang switch/if-else-ladders over een enum/string met een opzoektabel waar de branches eenvoudig waarderesultaten zijn
- Verwijder overbodig `else` na `return`, `throw`, `continue` of `break`

**Controlestroom-vereenvoudiging**
- Vlak onnodige nesting uit: als de buitenste `if`-body slechts één `if` bevat, inverteer de voorwaarde en gebruik early-return
- Verwijder no-op branches (`if (x) { /* niets */ }`)
- Vervang getelde `for`-lussen die een array bouwen met idiomatische map/fill/from waar idiomatisch in de taal

**Variabele-vereenvoudiging**
- Zet eenmalig gebruikte variabelen die geen duidelijkheid toevoegen inline (`const x = a + b; return x;` → `return a + b;`)
- Verwijder tussenliggende variabelen die slechts een alias zijn van een andere variabele zonder transformatie

Pas alle veilige wijzigingen toe. Wijzig geen logica. Hernoem symbolen niet tenzij een naam actief misleidend is. Herformat code niet die niet gerelateerd is aan de vereenvoudigingen.

Voer een unified diff uit van alle gemaakte wijzigingen.
