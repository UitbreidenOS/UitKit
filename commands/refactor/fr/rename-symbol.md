---
description: Renommer un symbole de manière cohérente dans tous les fichiers du domaine
argument-hint: "[ancien-nom] [nouveau-nom] [fichier ou répertoire]"
---
Renommez le symbole spécifié dans $ARGUMENTS — format : `<ancien-nom> <nouveau-nom> <chemin>`.

1. Analysez les arguments : ancien nom, nouveau nom et le fichier ou répertoire à traiter.

2. Avant de renommer, validez :
   - Le nouveau nom suit la convention de nommage utilisée pour ce type de symbole dans cette base de code (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, etc.)
   - Le nouveau nom n'existe pas déjà dans le même domaine
   - Le nouveau nom n'est pas un mot clé réservé ni un nom utilisé par une dépendance importée

3. Trouvez chaque référence à l'ancien nom dans le domaine spécifié :
   - Déclaration (définition de fonction, classe, variable, alias de type, constante, membre d'enum)
   - Tous les sites d'appel et points d'utilisation
   - Déclarations d'import/export (importations nommées, réexportations)
   - Chaînes de caractères littérales connues pour faire référence au symbole (par exemple, noms d'événements, `require()` dynamique, accès via chaîne `keyof`) — signalez mais ne renommez pas automatiquement, car elles peuvent être des contrats API
   - Références dans JSDoc / docstrings
   - Commentaires qui nomment le symbole — mettez à jour s'il le renommage rend le commentaire incorrect

4. Appliquez le renommage à chaque emplacement identifié. Ne renommez pas :
   - Les correspondances partielles (par exemple, renommer `user` ne doit pas affecter `username` ou `currentUser`)
   - Les symboles non liés qui partagent le nom dans un domaine différent
   - Les fichiers externes en dehors du chemin spécifié à moins que le symbole soit exporté et que ces fichiers se trouvent dans le dépôt

5. Après le renommage, vérifiez que tous les chemins d'import et réexportations de modules sont cohérents.

6. Sortie : nombre total de références mises à jour, liste des fichiers modifiés et les emplacements signalés pour examen manuel (chaînes littérales, accès dynamique).
