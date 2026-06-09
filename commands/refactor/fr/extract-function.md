---
description: Extraire un bloc surligné ou une logique décrite dans une fonction nommée avec une signature correcte et les mises à jour du site d'appel
argument-hint: "[file] [line-range or description]"
---
Vous effectuez une refactorisation chirurgicale d'extraction de fonction sur $ARGUMENTS.

Étapes :
1. Lisez le fichier cible. Identifiez le bloc de code à extraire — soit la plage de lignes donnée, soit la logique correspondant à la description.
2. Déterminez l'ensemble minimal des entrées dont la fonction extraite a besoin (paramètres) et ce qu'elle doit retourner (valeurs de retour ou mutations).
3. Choisissez un nom qui soit précis et commençant par un verbe (par exemple, `computeRetryDelay`, `parseHeaderToken`, `buildQueryString`). N'utilisez pas de noms vagues comme `helper` ou `util`.
4. Écrivez la fonction extraite avec :
   - La signature correcte correspondant aux conventions du langage hôte (annotations de type si le langage les supporte)
   - Une chaîne de documentation/commentaire d'une seule phrase uniquement si l'objectif n'est pas évident
   - Aucun effet secondaire au-delà de ce que le code original avait
5. Remplacez le bloc original par un appel à la nouvelle fonction, en passant les arguments identifiés et en capturant les valeurs de retour.
6. Vérifiez :
   - Le site d'appel se compile/analyse correctement (vérifiez les variables inutilisées laissées derrière, les retours manquants, le flux de contrôle cassé)
   - Aucune variable de la portée externe n'est maintenant référencée à l'intérieur de la fonction qui n'a pas été explicitement passée
   - Si le langage est typé, les types sont cohérents d'un bout à l'autre
7. Si la logique extraite apparaît plus d'une fois ailleurs dans le fichier, remplacez ces occurrences également et notez le nombre de sites d'appel mis à jour.
8. Affichez la diff. Ne réécrivez pas le code non lié.

Contraintes :
- Préservez exactement le comportement existant — c'est une refactorisation, pas une réécriture.
- Ne modifiez pas la logique du bloc extrait, seulement son emplacement et son invocation.
- Si l'extraction n'est pas sûre (par exemple, le bloc modifie plusieurs variables externes de manière enchevêtrée), expliquez pourquoi et suggérez une limite plus sûre à la place.
