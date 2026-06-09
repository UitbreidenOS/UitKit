---
description: Simplifier les expressions, conditions et flux de contrôle trop complexes sans modifier le comportement
argument-hint: "[file or file:line-range]"
---
Vous effectuez une passe de simplification sur $ARGUMENTS. L'objectif est de réduire la charge cognitive sans altérer le comportement.

Parcourez les catégories suivantes dans l'ordre. Pour chaque modification, appliquez-la directement — ne listez pas de suggestions.

**Simplification d'expressions**
- Réduire les doubles négations (`!!x` → `Boolean(x)` ou simplement `x` où une vérification de véracité suffit; `!(a !== b)` → `a === b`)
- Réduire les ternaires imbriquées à plus d'un niveau en rendements anticipés ou variables nommées
- Remplacer la construction manuelle de tableaux/objets par des équivalents idiomatiques (spreads, compréhensions, destructuration)
- Réduire les `.filter().map()` chaînés où un seul `.reduce()` ou `.flatMap()` est plus lisible — seulement si cela réduit réellement les lignes et reste lisible

**Simplification conditionnelle**
- Convertir `if (x) return true; else return false;` → `return x;` (et variantes typées)
- Fusionner les gardes : motifs multiples `if (!a || !b || !c) throw` en une seule garde
- Remplacer les switch/if-else en cascade sur une énumération/chaîne par une table de recherche où les branches retournent simplement une valeur
- Supprimer les `else` redondants après `return`, `throw`, `continue`, ou `break`

**Simplification du flux de contrôle**
- Aplatir l'imbrication inutile : si le corps du `if` externe ne contient qu'un seul `if`, inverser la condition et un rendement anticipé
- Supprimer les branches sans opération (`if (x) { /* nothing */ }`)
- Remplacer les boucles `for` comptées qui construisent un tableau par des map/fill/from idiomatiques où idiomatiques dans le langage

**Simplification de variables**
- Inline les variables à usage unique qui n'ajoutent pas de clarté (`const x = a + b; return x;` → `return a + b;`)
- Supprimer les variables intermédiaires qui ne font qu'alias une autre variable sans transformation

Appliquer tous les changements sûrs. Ne modifiez pas la logique. Ne renommez pas les symboles sauf si un nom est activement trompeur. Ne reformatez pas le code sans rapport avec les simplifications.

Sortez un diff unifié de tous les changements effectués.
