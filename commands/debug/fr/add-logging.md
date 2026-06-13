---
description: Ajouter de la journalisation structurée à un fichier ou une fonction avec les niveaux de log et le contexte appropriés
argument-hint: "[chemin du fichier ou de la fonction]"
---
Ajouter de la journalisation structurée de qualité production au code cible.

Cible : $ARGUMENTS

Lire le fichier ou la fonction cible. Ensuite :

1. **Auditer la journalisation existante** — identifier ce qui est déjà journalisé, quelle bibliothèque ou framework de journalisation est utilisée (logging stdlib, structlog, Winston, pino, slog, zerolog, etc.), et les conventions de niveau de log du projet. Ne pas introduire une deuxième dépendance de journalisation.

2. **Identifier les points de journalisation** — déterminer où la journalisation est manquante ou insuffisante :
   - Entrée et sortie des fonctions non triviales (avec les arguments pertinents et les valeurs de retour, édités s'ils peuvent contenir des données personnelles ou des secrets)
   - Décisions de branchement qui affectent le comportement (journaliser quelle branche a été prise et pourquoi)
   - Appels externes (HTTP, BD, file d'attente, cache) — journaliser l'intention avant l'appel et le résultat après, en incluant toujours la durée
   - Chemins d'erreur et d'exception — journaliser le contexte complet, pas seulement le message
   - Transitions d'état dans les objets de longue durée ou les machines à états

3. **Choisir les bons niveaux de log** — appliquer ces règles strictement :
   - DEBUG : état interne, itérations de boucle, valeurs de config résolues
   - INFO : étapes importantes qu'un opérateur humain voudrait voir en production
   - WARN : anomalies récupérables, chemins dépréciés, comportement dégradé
   - ERROR : défaillances qui nécessitent une attention ; toujours inclure l'objet exception/pile

4. **Ajouter des champs structurés** — journaliser des paires clé=valeur ou des champs JSON, pas des chaînes interpolées. Inclure : les identifiants de requête/trace/corrélation s'ils sont disponibles dans la portée, les identifiants d'entité pertinents, la synchronisation, le contexte d'environnement.

5. **Appliquer les modifications** — écrire le fichier mis à jour. Ne pas modifier la logique, la mise en forme en dehors des lignes ajoutées, ou les noms de variables. Ajouter des imports uniquement s'ils sont nécessaires et pas déjà présents.

6. **Afficher un résumé** — lister chaque déclaration de journalisation ajoutée avec son niveau et une justification d'une ligne.

Ne pas journaliser les secrets, les tokens, les mots de passe, les corps de requête complets, ou les données personnelles. Si de telles valeurs sont dans la portée, journaliser leur présence ou un hash, jamais leur contenu.
