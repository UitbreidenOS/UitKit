---
description: Générer un cas de reproduction minimal à partir d'une description de bug ou d'un test défaillant
argument-hint: "[description du bug ou nom du test]"
---
Étant donné : $ARGUMENTS

Votre tâche est de produire un cas de reproduction minimal et autonome pour ce bug.

Étapes :

1. Identifiez la surface de défaillance — s'agit-il d'une défaillance unitaire, d'intégration ou d'exécution ? Quelle couche en est responsable ?

2. Réduisez la reproduction à sa forme la plus simple :
   - Supprimez toute la configuration, les fixtures et les données non liées
   - Éliminez les appels réseau/système de fichiers si possible — simulez-les ou remplacez-les
   - La repro doit échouer de manière déterministe, pas de façon instable

3. Spécifiez les conditions d'environnement exactes requises :
   - Version d'exécution, contraintes du système d'exploitation si pertinent
   - Variables d'environnement requises ou valeurs de configuration
   - Toute donnée de base ou précondition

4. Écrivez la repro sous forme de code exécutable (test ou script). Incluez :
   - Les imports et la configuration
   - La séquence d'appel minimale qui déclenche le bug
   - Une assertion ou une impression d'erreur qui marque clairement l'échec

5. Ajoutez un bloc de commentaire au-dessus :
   ```
   // BUG: <description en une ligne>
   // EXPECTED: <ce qui devrait se produire>
   // ACTUAL: <ce qui se produit réellement>
   // SCOPE: <plus petite unité connue qui le reproduit>
   ```

6. Si le bug est non-déterministe, documentez la fréquence observée et les conditions qui augmentent la reproductibilité (par ex. niveau de concurrence, taille des données, synchronisation).

7. Vérifiez que la repro échoue réellement avant de la présenter. Si vous pouvez l'exécuter, faites-le.

Sortie : le contenu du fichier repro prêt à coller dans un nouveau fichier, suivi d'un résumé d'une phrase du mécanisme de défaillance racine si vous pouvez l'identifier à partir de la repro seule.
