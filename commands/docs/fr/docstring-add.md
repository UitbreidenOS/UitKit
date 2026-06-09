---
description: Ajouter ou améliorer les docstrings/JSDoc/annotations de type sur tous les symboles publics d'un fichier
argument-hint: "<file>"
---
Ajouter ou améliorer les commentaires de documentation pour chaque symbole public dans : $ARGUMENTS

Règles pour ce qui compte comme un symbole public :
- Python : toutes les fonctions/classes/méthodes non préfixées par `_`, plus les constantes au niveau du module dans `__all__` si défini.
- TypeScript/JavaScript : toutes les fonctions, classes, interfaces, alias de type et constantes exportés.
- Go : tous les identifiants exportés (en majuscules).
- Rust : tous les éléments `pub`.
- Autres langages : appliquer la distinction publique/privée conventionnelle du langage.

Pour chaque symbole public qui est non documenté ou a une documentation faible/temporaire :

1. Lire l'implémentation complète — pas seulement la signature.
2. Écrire une docstring qui couvre :
   - **Quoi** : la fonction fait (une phrase, impérative : "Analyse...", "Retourne...", "Valide...").
   - **Paramètres** : nom, type (s'il ne figure pas dans la signature), signification, contraintes, valeur par défaut si pertinent.
   - **Valeur de retour** : ce qu'elle est et dans quelles conditions (y compris les retours `null`/`None`/`undefined`/error).
   - **Lève/lance** : chaque type d'exception ou d'erreur que l'appelant doit gérer.
   - **Effets secondaires** : E/S, mutations, appels réseau — le cas échéant.
   - **Exemple** : un exemple d'utilisation minimal si la fonction est non triviale.
3. Utiliser le format idiomatique pour la langue du fichier :
   - Python : docstrings de style Google (sections Args / Returns / Raises).
   - TypeScript/JavaScript : JSDoc (`@param`, `@returns`, `@throws`).
   - Go : godoc (phrase commençant par le nom du symbole).
   - Rust : commentaires doc `///` avec section `# Examples` pour les éléments non triviaux.
4. NE PAS modifier la logique, les signatures ou le formatage en dehors des commentaires de documentation.
5. NE PAS ajouter de documentation aux symboles privés/internes sauf s'ils ont déjà un commentaire que vous devez améliorer.
6. Si une docstring existe déjà et est exacte, la laisser inchangée. Si elle est inexacte ou incomplète, remplacer uniquement les parties déficientes.

Après la modification, imprimer un résumé compact :
- Combien de symboles ont été documentés (nouveaux).
- Combien ont été améliorés.
- Lister tout symbole que vous avez ignoré et pourquoi.
