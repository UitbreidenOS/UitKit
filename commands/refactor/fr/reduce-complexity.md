---
description: Réduire la complexité cyclomatique et la profondeur d'imbrication dans une fonction ou un fichier
argument-hint: "[fichier] [nom de fonction ou numéro de ligne, optionnel]"
---
Réduisez la complexité du code dans $ARGUMENTS.

1. Lisez la cible. Si une fonction ou une ligne spécifique est donnée, concentrez-vous dessus. Sinon, identifiez les régions de plus haute complexité : conditionnelles profondément imbriquées, longues fonctions avec de nombreuses branches, chaînes de garde qui obscurcissent le chemin heureux.

2. Mesurez les signaux de complexité :
   - Profondeur d'imbrication > 3 niveaux
   - Longueur de fonction > 40 lignes avec plusieurs responsabilités
   - Complexité cyclomatique > 10 (comptez : `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` branches)
   - Expressions booléennes avec > 3 opérandes
   - Longues chaînes if-else qui pourraient être basées sur des tableaux ou polymorphes

3. Appliquez des réductions ciblées :

   Retours anticipés / clauses de garde :
   - Inversez les conditions pour échouer rapidement au début de la fonction, éliminant le besoin de branches else profondes

   Extrayez des sous-fonctions :
   - Tirez les conditions complexes dans des fonctions de prédicat nommées (`isEligible()`, `hasPermission()`)
   - Tirez les corps de boucle dans des fonctions nommées si le corps est > 5 lignes

   Remplacez les conditionnelles par des données :
   - Si une chaîne de `if/else` ou `switch` mappe des valeurs d'entrée à des valeurs de sortie, remplacez par une table de recherche / map

   Aplatissez les boucles imbriquées :
   - Utilisez `.flatMap()`, les générateurs, ou des fonctions d'aide pour éviter les boucles triples imbriquées
   - Si le langage le supporte, envisagez la concurrence structurée ou les modèles de pipeline

   Simplifiez la logique booléenne :
   - Appliquez les lois de De Morgan pour éliminer les expressions composées niées
   - Extrayez les booléens nommés pour les conditions complexes (`const isExpired = date < now && !renewed`)

4. Ne réduisez pas la complexité en la cachant (par exemple, en déplaçant une branche complexe dans une lambda qui est immédiatement invoquée). L'objectif est une véritable simplification, pas une relocalisation.

5. Préservez tous les comportements exactement. Effectuez une différence mentale : chaque entrée qui a produit la sortie X doit toujours produire la sortie X.

6. Résultat : estimation de complexité originale, nouvelle estimation, et un résumé de chaque transformation appliquée.
