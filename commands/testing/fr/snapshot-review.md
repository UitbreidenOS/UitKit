---
description: Examiner les snapshots obsolètes ou volumineux et décider entre mise à jour ou réécriture
argument-hint: "[fichier snapshot, fichier de test ou répertoire]"
---
Examiner les snapshots dans : $ARGUMENTS

Étapes :

1. Localiser les fichiers snapshot. Emplacements courants :
   - Jest : `__snapshots__/*.snap` adjacents aux fichiers de test
   - Vitest : même modèle que Jest
   - Storybook : `*.stories.snap`
   - Si l'argument pointe vers un fichier de test, trouver son fichier `.snap` associé.

2. Pour chaque snapshot dans le périmètre, évaluer :

   **Taille**
   - Compter les lignes sérialisées. Signaler tout snapshot dépassant 50 lignes comme candidat pour remplacement.
   - Les grands snapshots obscurcissent souvent l'assertion réelle — l'intention est cachée.

   **Stabilité**
   - Identifier le contenu qui changera à chaque exécution : horodatages, ID générés, adresses mémoire, valeurs aléatoires, hachages de build.
   - Ceux-ci rendent les snapshots peu fiables et doivent être masqués ou remplacés.

   **Spécificité**
   - Déterminer ce que le test essaie vraiment de vérifier. Si un snapshot capture un composant rendu entier mais le test s'appelle « renders the submit button », le snapshot est sur-spécifié.

   **Duplication**
   - Signaler les snapshots à travers plusieurs tests qui capturent le même sous-arbre avec variation mineure — ils peuvent être fusionnables.

3. Pour chaque snapshot signalé, recommander l'une des actions suivantes :
   - **Mise à jour** — le snapshot est correct en structure mais obsolète ; exécuter `--updateSnapshot`
   - **Remplacement** — remplacer le snapshot par des assertions de propriétés ciblées (afficher le remplacement)
   - **Masquage** — conserver le snapshot mais ajouter des transformations de sérialiseur ou `expect.any()` pour neutraliser les valeurs volatiles
   - **Suppression** — le snapshot duplique un autre test ou ne fournit pas de signal ; le supprimer

4. Appliquer les remplacements et suppressions qui sont sans ambiguïté. Ne pas mettre à jour automatiquement les snapshots obsolètes — les signaler à l'utilisateur pour confirmation avec `--updateSnapshot`.

5. Pour chaque remplacement, afficher :
   - Le snapshot original (tronqué si >10 lignes)
   - La ou les nouvelles assertions qui le remplacent
   - Pourquoi c'est plus maintenable

6. Terminer par un résumé : X snapshots examinés, Y mis à jour, Z remplacés par des assertions, W supprimés, V signalés pour examen manuel.
