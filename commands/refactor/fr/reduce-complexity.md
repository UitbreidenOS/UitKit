---
description: Réduire la complexité cyclomatique et la profondeur d'imbrication dans une fonction ou un fichier
argument-hint: "[file] [function name or line number, optional]"
---
Réduire la complexité du code dans $ARGUMENTS.

1. Lire la cible. Si une fonction ou une ligne spécifique est donnée, concentrez-vous là-dessus. Sinon, identifiez les régions de plus haute complexité : conditionnelles profondément imbriquées, fonctions longues avec nombreuses branches, chaînes de garde qui obscurcissent le chemin heureux.

2. Mesurer les signaux de complexité :
   - Profondeur d'imbrication > 3 niveaux
   - Longueur de fonction > 40 lignes avec plusieurs responsabilités
   - Complexité cyclomatique > 10 (compte : `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` branches)
   - Expressions booléennes avec > 3 opérandes
   - Longues chaînes if-else qui pourraient être table-driven ou polymorphes

3. Appliquer les réductions ciblées :

   Retours précoces / clauses de garde :
   - Inverser les conditions pour échouer rapidement au début de la fonction, éliminant le besoin de branches else profondes

   Extraire des sous-fonctions :
   - Extraire les conditions complexes dans des fonctions de prédicat nommées (`isEligible()`, `hasPermission()`)
   - Extraire les corps de boucle dans des fonctions nommées si le corps a > 5 lignes

   Remplacer les conditionnelles par des données :
   - Si une chaîne de `if/else` ou `switch` mappe des valeurs d'entrée à des valeurs de sortie, remplacer par une table de recherche / map

   Aplatir les boucles imbriquées :
   - Utiliser `.flatMap()`, les générateurs, ou les fonctions d'aide pour éviter les boucles imbriquées triples
   - Si la langue le supporte, considérer la concurrence structurée ou les motifs de pipeline

   Simplifier la logique booléenne :
   - Appliquer les lois de De Morgan pour éliminer les expressions composées négées
   - Extraire les booléens nommés pour les conditions complexes (`const isExpired = date < now && !renewed`)

4. Ne pas réduire la complexité en la cachant (par exemple, en déplaçant une branche complexe dans une lambda qui est immédiatement invoquée). L'objectif est une simplification genuine, pas une relocation.

5. Préserver tous les comportements exactement. Exécuter un diff mental : chaque entrée qui produisait la sortie X doit toujours produire la sortie X.

6. Sortie : estimation de complexité originale, nouvelle estimation, et un résumé de chaque transformation appliquée.
