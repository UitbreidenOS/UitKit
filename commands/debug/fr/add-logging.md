---
description: Ajouter la journalisation structurée à un fichier ou une fonction avec les niveaux de journal et le contexte appropriés
argument-hint: "[file or function path]"
---
Ajouter une journalisation structurée de qualité production au code cible.

Target: $ARGUMENTS

Lisez le fichier ou la fonction cible. Ensuite :

1. **Audit de la journalisation existante** — identifiez ce qui est déjà journalisé, quelle bibliothèque ou framework de journalisation est utilisée (logging stdlib, structlog, Winston, pino, slog, zerolog, etc.), et les conventions de niveau de journal du projet. N'introduisez pas une deuxième dépendance de journalisation.

2. **Identifier les points de journalisation** — déterminez où la journalisation est manquante ou insuffisante :
   - Entrée et sortie de fonctions non triviales (avec les arguments pertinents et les valeurs de retour, masqués s'ils peuvent contenir des informations personnelles ou des secrets)
   - Décisions de branchement qui affectent le comportement (journaliser quelle branche a été prise et pourquoi)
   - Appels externes (HTTP, BD, file d'attente, cache) — journaliser l'intention avant l'appel et le résultat après, en incluant toujours la durée
   - Chemins d'erreur et d'exception — journaliser le contexte complet, pas seulement le message
   - Transitions d'état dans les objets de longue durée ou les machines d'état

3. **Choisir les niveaux de journal corrects** — appliquez ces règles strictement :
   - DEBUG : état interne, itérations de boucle, valeurs de configuration résolues
   - INFO : jalons significatifs qu'un opérateur humain souhaiterait voir en production
   - WARN : anomalies récupérables, chemins obsolètes, comportement dégradé
   - ERROR : défaillances qui nécessitent une attention ; incluez toujours l'objet d'exception/pile d'appels

4. **Ajouter des champs structurés** — journaliser des paires clé=valeur ou des champs JSON, pas des chaînes interpolées. Inclure : ID de requête/trace/corrélation s'ils sont disponibles dans la portée, ID d'entités pertinentes, timing, contexte environnemental.

5. **Appliquer les modifications** — écrire le fichier mis à jour. Ne modifiez pas la logique, le formatage en dehors des lignes ajoutées, ni les noms de variables. Ajoutez des imports uniquement s'ils sont requis et pas déjà présents.

6. **Afficher un résumé** — lister chaque instruction de journal ajoutée avec son niveau et une justification d'une ligne.

Ne journalisez pas les secrets, les jetons, les mots de passe, les corps de requête complets ou les informations personnelles. Si ces valeurs sont dans la portée, journalisez leur présence ou un hash, jamais leur contenu.
