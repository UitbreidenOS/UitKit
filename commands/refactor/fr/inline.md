---
description: Inliner une fonction, une variable ou une constante qui ajoute de l'indirection sans valeur
argument-hint: "[symbol-name] [file]"
---
Inliner le symbole spécifié dans $ARGUMENTS — format : `<symbol-name> <file>`.

1. Lire le fichier. Localiser la déclaration du symbole nommé et chaque site d'appel ou utilisation.

2. Déterminer si l'inlining est approprié. L'inlining est approprié quand :
   - Le symbole n'est appelé que dans un ou deux endroits
   - Le corps du symbole est plus simple ou plus clair que ce que son nom l'implique (le nom n'ajoute aucune information)
   - Le symbole est un wrapper à expression unique sans valeur de réutilisation
   - Une variable ou une constante est assignée une fois et utilisée une fois, et le nom intermédiaire n'aide pas la lisibilité

   NE PAS inliner quand :
   - Le symbole est utilisé en 3+ endroits (l'inlining réintroduirait la duplication)
   - Le nom est véritablement informatif et sa suppression obscurcirait l'intention
   - Le symbole a des effets secondaires qui s'exécutent au moment de la déclaration (l'inlining pourrait modifier l'ordre d'exécution)
   - Le symbole est exporté ou fait partie d'une API publique

3. Pour chaque site d'appel :
   - Substituer le corps du symbole directement, avec toutes les liaisons de paramètres correctement substituées
   - Si le corps fait référence à des variables de sa portée originale qui ne sont pas disponibles au site d'appel, arrêter et signaler — l'inline n'est pas sûre
   - S'assurer que la précédence de l'opérateur est correcte après la substitution (ajouter des parenthèses si nécessaire)

4. Après que tous les sites soient inlinés, supprimer la déclaration originale.

5. Supprimer tous les imports qui existaient uniquement pour supporter le symbole maintenant supprimé.

6. Vérifier que le résultat est syntaxiquement et sémantiquement correct :
   - Pas de références flottantes
   - Pas d'ordre d'évaluation modifié pour les expressions avec effets secondaires
   - Les types se vérifient toujours si le langage est typé

7. Résultat : nom du symbole, nombre de sites inlinés, emplacement de la déclaration originale, et confirmation qu'il a été supprimé.
