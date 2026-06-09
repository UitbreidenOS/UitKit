---
description: Identifier et supprimer le code inaccessible, non utilisé ou obsolète
argument-hint: "[file or directory]"
---
Effectuer un passage de suppression de code mort sur $ARGUMENTS.

1. Lire chaque fichier dans la portée. Construire une carte mentale de :
   - Symboles exportés vs. internes
   - Fonctions, variables, types, constantes, importations qui sont déclarés mais jamais référencés
   - Branches qui ne peuvent jamais être atteintes (par ex., du code après un return inconditionnel, des conditions qui sont toujours vraies/fausses en raison de valeurs constantes)
   - Drapeaux de fonctionnalité ou protections de variables d'environnement qui sont définitivement activés ou désactivés étant donné l'état actuel de la base de code
   - Blocs de code commentés — les supprimer sauf s'ils contiennent un commentaire de justification datable

2. Pour chaque symbole ou bloc mort trouvé :
   - Confirmer qu'il n'est pas référencé via une dispatch dynamique, une réflexion, une recherche basée sur des chaînes de caractères ou un appel externe en dehors de la portée scannée. En cas d'incertitude, le signaler et ignorer.
   - Supprimer la déclaration et tous ses échafaudages locaux (alias de type associés, variables d'aide utilisées uniquement par celui-ci, réexportations qui ne l'exposent que).

3. Après chaque suppression, supprimer toutes les importations ou requires qui sont maintenant non utilisées.

4. Ne pas reformater, renommer ou restructurer quoi que ce soit d'autre. Suppression de code mort uniquement.

5. Produire une liste de chaque élément supprimé : nom du symbole, fichier, plage de lignes et raison (non utilisé / inaccessible / remplacé).

6. Si un symbole apparaît mort mais a un commentaire suggérant une utilisation future ou fait partie d'un contrat d'API public (par ex., exporté à partir du fichier d'index d'une bibliothèque), le signaler au lieu de le supprimer.

Contraintes :
- Ne pas supprimer le code simplement parce qu'il semble redondant — il doit être provablement non référencé ou inaccessible.
- Ne pas toucher les fichiers de test sauf si l'argument les inclut explicitement.
- Si la suppression changerait le comportement observable (par ex., une importation avec des effets secondaires), la signaler et ne pas supprimer.
