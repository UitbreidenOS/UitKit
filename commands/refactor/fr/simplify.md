---
description: Simplifier les expressions, conditions et flux de contrôle trop complexes sans modifier le comportement
argument-hint: "[file or file:line-range]"
---
Vous effectuez une passe de simplification sur $ARGUMENTS. L'objectif est de réduire la charge cognitive sans altérer le comportement.

Travaillez à travers les catégories suivantes dans l'ordre. Pour chaque modification, appliquez-la directement — ne listez pas les suggestions.

**Simplification des expressions**
- Réduire les doubles négations (`!!x` → `Boolean(x)` ou simplement `x` où une vérification de vérité suffit; `!(a !== b)` → `a === b`)
- Réduire les ternaires imbriquées de plus d'un niveau en retours anticipés ou variables nommées
- Remplacer la construction manuelle de tableaux/objets par des équivalents idiomatiques (spreads, compréhensions, destructuration)
- Réduire les `.filter().map()` chaînées où un `.reduce()` ou `.flatMap()` unique est plus net — seulement si cela réduit réellement les lignes et reste lisible

**Simplification des conditions**
- Convertir `if (x) return true; else return false;` → `return x;` (et variantes typées)
- Fusionner les clauses de garde : les multiples motifs `if (!a || !b || !c) throw` en une seule garde
- Remplacer les commutateurs/chaînes if-else sur une énumération/chaîne par une table de recherche où les branches retournent simplement une valeur
- Supprimer le `else` redondant après `return`, `throw`, `continue` ou `break`

**Simplification du flux de contrôle**
- Aplatir l'imbrication inutile : si le corps `if` extérieur ne contient qu'un seul `if`, inverser la condition et retour anticipé
- Supprimer les branches sans opération (`if (x) { /* nothing */ }`)
- Remplacer les boucles `for` comptées qui construisent un tableau par des map/fill/from idiomatiques où idiomatiques dans le langage

**Simplification des variables**
- Inliner les variables à usage unique qui n'ajoutent aucune clarté (`const x = a + b; return x;` → `return a + b;`)
- Supprimer les variables intermédiaires qui ne font qu'aliaser une autre variable sans transformation

Appliquer toutes les modifications sûres. Ne modifiez pas la logique. Ne renommez pas les symboles à moins qu'un nom soit activement trompeur. Ne reformatez pas le code sans rapport avec les simplifications.

Produire une diff unifiée de toutes les modifications apportées.
