---
description: Ajouter ou améliorer les docstrings/JSDoc/annotations de type sur tous les symboles publics dans un fichier
argument-hint: "<fichier>"
---
Ajouter ou améliorer les commentaires de documentation pour chaque symbole public dans : $ARGUMENTS

Règles pour ce qui compte comme un symbole public :
- Python : toutes les fonctions/classes/méthodes non préfixées par `_`, ainsi que les constantes au niveau du module si définies dans `__all__`.
- TypeScript/JavaScript : toutes les fonctions exportées, classes, interfaces, alias de type et constantes.
- Go : tous les identifiants exportés (en majuscules).
- Rust : tous les éléments `pub`.
- Autres langages : appliquer la distinction conventionnelle public/privé du langage.

Pour chaque symbole public qui n'est pas documenté ou qui a une documentation faible/temporaire :

1. Lire l'implémentation complète — pas seulement la signature.
2. Écrire une docstring qui couvre :
   - **Ce que** fait la fonction (une phrase, impératif : « Analyse... », « Retourne... », « Valide... »).
   - **Paramètres** : nom, type (s'il n'est pas dans la signature), signification, contraintes, valeur par défaut si pertinente.
   - **Valeur de retour** : ce qu'elle est et dans quelles conditions (y compris les retours `null`/`None`/`undefined`/`error`).
   - **Lève/lance** : tous les types d'exceptions ou d'erreurs que l'appelant doit gérer.
   - **Effets secondaires** : E/S, mutations, appels réseau — s'il y en a.
   - **Exemple** : un exemple d'utilisation minimal si la fonction n'est pas triviale.
3. Utiliser le format idiomatique pour le langage du fichier :
   - Python : docstrings de style Google (sections Args / Returns / Raises).
   - TypeScript/JavaScript : JSDoc (`@param`, `@returns`, `@throws`).
   - Go : godoc (phrase commençant par le nom du symbole).
   - Rust : commentaires `///` doc avec section `# Examples` pour les éléments non triviaux.
4. NE PAS modifier aucune logique, signature ou formatage en dehors des commentaires de documentation.
5. NE PAS ajouter de documentation aux symboles privés/internes à moins qu'ils n'aient déjà un commentaire à améliorer.
6. Si une docstring existe déjà et est exacte, la laisser inchangée. Si elle est inexacte ou incomplète, remplacer seulement les parties déficientes.

Après édition, imprimer un résumé compact :
- Combien de symboles ont été documentés (nouveaux).
- Combien ont été améliorés.
- Lister tous les symboles que vous avez ignorés et pourquoi.
