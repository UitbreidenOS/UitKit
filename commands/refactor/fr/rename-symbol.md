---
description: Renommer un symbole de manière cohérente dans tous les fichiers du périmètre
argument-hint: "[old-name] [new-name] [file or directory]"
---
Renommez le symbole spécifié dans $ARGUMENTS — format : `<old-name> <new-name> <path>`.

1. Analysez les arguments : ancien nom, nouveau nom et le fichier ou répertoire sur lequel opérer.

2. Avant de renommer, validez :
   - Le nouveau nom suit la convention de nommage utilisée pour ce type de symbole dans cette base de code (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, etc.)
   - Le nouveau nom n'existe pas déjà dans le même périmètre
   - Le nouveau nom n'est pas un mot clé réservé ou un nom utilisé par une dépendance importée

3. Trouvez chaque référence à l'ancien nom dans le périmètre spécifié :
   - Déclaration (définition de fonction, classe, variable, alias de type, constante, membre d'énumération)
   - Tous les sites d'appel et points d'utilisation
   - Instructions d'importation/exportation (imports nommés, réexportations)
   - Littéraux de chaîne de caractères dont on sait qu'ils font référence au symbole (par exemple, noms d'événements, `require()` dynamique, accès de chaîne `keyof`) — marquez-les mais ne les renommez pas automatiquement, car ils peuvent être des contrats d'API
   - Références JSDoc / docstring
   - Commentaires qui nomment le symbole — mettez à jour s'il le renommage rend le commentaire incorrect

4. Appliquez le renommage à chaque emplacement identifié. Ne renommez pas :
   - Les correspondances partielles (par exemple, renommer `user` ne doit pas toucher `username` ou `currentUser`)
   - Les symboles non liés qui partagent simplement le nom dans une portée différente
   - Les fichiers externes en dehors du chemin spécifié à moins que le symbole ne soit exporté et que ces fichiers se trouvent dans le dépôt

5. Après le renommage, vérifiez que tous les chemins d'importation et les réexportations de modules sont cohérents en interne.

6. Résultat : décompte total des références mises à jour, liste des fichiers modifiés et tous les emplacements marqués pour examen manuel (littéraux de chaîne, accès dynamique).
