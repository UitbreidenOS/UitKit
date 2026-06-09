---
description: Examinier les snapshots obsolètes ou gonflés et décider de les mettre à jour ou de les réécrire
argument-hint: "[snapshot file, test file, or directory]"
---
Examiner les snapshots dans : $ARGUMENTS

Étapes :

1. Localisez les fichiers de snapshot. Emplacements courants :
   - Jest: `__snapshots__/*.snap` adjacent aux fichiers de test
   - Vitest: même modèle que Jest
   - Storybook: `*.stories.snap`
   - Si l'argument pointe vers un fichier de test, trouvez son fichier `.snap` associé.

2. Pour chaque snapshot en scope, évaluez :

   **Taille**
   - Comptez les lignes sérialisées. Marquez tout snapshot dépassant 50 lignes comme candidat au remplacement.
   - Les snapshots volumineux obscurent souvent l'assertion réelle — l'intention est enfouie.

   **Stabilité**
   - Identifiez le contenu qui changera à chaque exécution : timestamps, IDs générés, adresses mémoire, valeurs aléatoires, hashes de build.
   - Celles-ci rendent les snapshots peu fiables et doivent être masquées ou remplacées.

   **Spécificité**
   - Déterminez ce que le test essaie réellement de vérifier. Si un snapshot capture un composant rendu entier mais que le test s'appelle « affiche le bouton soumettre », le snapshot est sur-spécifié.

   **Duplication**
   - Marquez les snapshots dans plusieurs tests qui capturent le même sous-arbre avec variation mineure — ils peuvent être fusionnables.

3. Pour chaque snapshot marqué, recommandez l'une des options suivantes :
   - **Mettre à jour** — le snapshot est correct en structure mais obsolète ; exécutez `--updateSnapshot`
   - **Remplacer** — échangez le snapshot pour des assertions de propriété ciblées (montrez le remplacement)
   - **Masquer** — conservez le snapshot mais ajoutez des transformations de sérialiseur ou `expect.any()` pour neutraliser les valeurs volatiles
   - **Supprimer** — le snapshot est dupliqué par un autre test ou ne fournit aucun signal ; supprimez-le

4. Appliquez les remplacements et suppressions non ambigus. Ne mettez pas à jour automatiquement les snapshots obsolètes — marquez-les pour que l'utilisateur les confirme avec `--updateSnapshot`.

5. Pour chaque remplacement, montrez :
   - Le snapshot original (tronqué si > 10 lignes)
   - La ou les nouvelles assertion(s) qui le remplacent
   - Pourquoi c'est plus maintenable

6. Terminez par un résumé : X snapshots examinés, Y mis à jour, Z remplacés par des assertions, W supprimés, V marqués pour examen manuel.
