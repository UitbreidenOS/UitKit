---
description: Identifier et supprimer le code inaccessible, inutilisé ou obsolète
argument-hint: "[fichier ou répertoire]"
---
Effectuer un passage de suppression du code mort sur $ARGUMENTS.

1. Lire chaque fichier dans la portée. Créer une carte mentale de :
   - Symboles exportés vs. internes
   - Fonctions, variables, types, constantes, imports qui sont déclarés mais jamais référencés
   - Branches qui ne peuvent jamais être atteintes (par ex., code après un return inconditionnel, conditions qui sont toujours vraies/fausses en raison de valeurs constantes)
   - Drapeaux de fonctionnalité ou gardes de variables d'environnement qui sont permanemment activés ou désactivés étant donné l'état actuel de la base de code
   - Blocs de code commentés — les supprimer à moins qu'ils ne contiennent un commentaire de justification daté

2. Pour chaque symbole mort ou bloc trouvé :
   - Confirmer qu'il n'est pas référencé via dispatch dynamique, réflexion, recherche basée sur des chaînes ou un appelant externe en dehors de la portée scannée. En cas de doute, l'indiquer et ignorer.
   - Supprimer la déclaration et tous ses échafaudages locaux (alias de type associés, variables d'aide utilisées uniquement par celui-ci, réexports qui l'exposent uniquement).

3. Après chaque suppression, supprimer tout import ou require qui est maintenant inutilisé.

4. Ne pas reformater, renommer ou restructurer autre chose. Suppression du code mort uniquement.

5. Émettre une liste de chaque élément supprimé : nom du symbole, fichier, plage de lignes et raison (inutilisé / inaccessible / remplacé).

6. Si un symbole semble mort mais a un commentaire suggérant une utilisation future ou fait partie d'un contrat d'API public (par ex., exporté à partir du fichier d'index d'une bibliothèque), le signaler au lieu de le supprimer.

Contraintes :
- Ne pas supprimer le code simplement parce qu'il semble redondant — il doit être provablement non référencé ou inaccessible.
- Ne pas toucher aux fichiers de test à moins que l'argument les inclue explicitement.
- Si la suppression changerait le comportement observable (par ex., un import avec effets secondaires), le signaler et ne pas supprimer.
