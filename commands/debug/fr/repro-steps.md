---
description: Générer un cas de reproduction minimale à partir d'une description de bug ou d'un test en défaut
argument-hint: "[bug description or test name]"
---
Étant donné : $ARGUMENTS

Votre tâche est de produire un cas de reproduction minimal et autonome pour ce bug.

Étapes :

1. Identifier la surface de défaillance — s'agit-il d'une défaillance unitaire, d'intégration ou d'exécution ? Quelle couche en est propriétaire ?

2. Réduire la reproduction à sa plus petite forme :
   - Supprimer toute configuration, fixtures et données non liées
   - Éliminer les appels réseau/système de fichiers si possible — les simuler ou les stubifier
   - La repro doit échouer de manière déterministe, et non aléatoire

3. Énumérer les conditions d'environnement exactes requises :
   - Version d'exécution, contraintes du système d'exploitation si pertinentes
   - Variables d'environnement requises ou valeurs de configuration
   - Toutes les données de départ ou conditions préalables

4. Écrire la repro sous forme de code exécutable (test ou script). Inclure :
   - Imports et configuration
   - La séquence minimale d'appels qui déclenche le bug
   - Une assertion ou un print d'erreur qui marque clairement l'échec

5. Ajouter un bloc de commentaires en haut :
   ```
   // BUG: <one-line description>
   // EXPECTED: <what should happen>
   // ACTUAL: <what actually happens>
   // SCOPE: <smallest known unit that reproduces it>
   ```

6. Si le bug est non déterministe, documenter la fréquence observée et toutes les conditions
   qui augmentent la reproductibilité (par exemple, le niveau de concurrence, la taille des données, le timing).

7. Vérifier que la repro échoue réellement avant de la présenter. Si vous pouvez l'exécuter, faites-le.

Résultat : le contenu du fichier de repro prêt à être collé dans un nouveau fichier, suivi d'un résumé d'une phrase du mécanisme de défaillance racine si vous pouvez l'identifier à partir de la repro seule.
