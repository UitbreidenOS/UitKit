---
description: Générer un plan de test structuré pour une fonctionnalité, un module ou une PR
argument-hint: "[feature, file, or PR description]"
---
Générer un plan de test structuré pour : $ARGUMENTS

Étapes :

1. Analyser l'argument pour déterminer la portée :
   - Si un chemin de fichier : lire le fichier et extraire les fonctions publiques, les classes, les routes ou les composants
   - Si une description de fonctionnalité : identifier le domaine et déduire les surfaces affectées
   - Si une PR ou un diff est en contexte : utiliser les fichiers modifiés comme portée

2. Pour la portée identifiée, énumérer les catégories de test dans cet ordre :
   a. Tests unitaires — fonctions individuelles, méthodes ou logique pure
   b. Tests d'intégration — limites de module, interactions de services, requêtes DB
   c. Tests de composant/UI — si la portée inclut du code frontend
   d. Tests E2E — si les flux visibles par l'utilisateur sont affectés
   e. Tests de contrat — si la portée inclut des points de terminaison d'API consommés par des clients externes

3. Pour chaque catégorie, lister les cas de test spécifiques. Chaque entrée de cas de test doit inclure :
   - Une description d'une ligne au format : `[subject] [action/state] → [expected outcome]`
   - Priorité : P0 (doit être livré), P1 (devrait être livré), P2 (agréable à avoir)
   - Type : happy path | edge case | error path | regression

4. Identifier :
   - Tous les tests existants qui couvrent un terrain chevauchant (vérifier les répertoires de tests)
   - Les lacunes où aucun test n'existe actuellement
   - Les dépendances externes qui nécessitent du mocking (APIs, bases de données, temps, aléatoire)

5. Signaler les cas qui sont coûteux ou de faible valeur — ne pas les inclure silencieusement ; noter le compromis.

6. Produire le plan sous forme de tableau Markdown ou de liste imbriquée. Ne pas écrire de code de test.

7. Terminer par une ligne de résumé : nombre total de cas de test par priorité (ex. « P0 : 4, P1 : 7, P2 : 3 »).
