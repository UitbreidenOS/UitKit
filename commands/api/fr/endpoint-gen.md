---
description: Générer un point de terminaison REST entièrement typé avec validation, gestion des erreurs et tests
argument-hint: "[method] [path] [description]"
---
Générer un point de terminaison API REST prêt pour la production à partir de la spécification : $ARGUMENTS

Analysez l'entrée comme : méthode HTTP, chemin, et une brève description de l'opération sur la ressource.

Règles :
- Déduisez le framework du code base existant (Express, FastAPI, Gin, Rails, etc.)
- Faites correspondre la structure de fichiers, les conventions de dénomination et le style d'importation du projet existant
- Définissez les types de requête/réponse en utilisant le système de type du projet (interfaces TypeScript, modèles Pydantic, structs Go, etc.)
- Validez toutes les entrées à la limite — rejetez les requêtes mal formées avant la logique métier
- Retournez les codes d'état HTTP standard : 200/201 succès, 400 mauvaise requête, 401 non authentifié, 403 interdit, 404 non trouvé, 409 conflit, 422 non traitable, 500 erreur interne
- N'exposez jamais les traces de pile ni les détails d'erreur interne dans les corps de réponse
- Extrayez la logique métier dans une couche de service, gardez le contrôleur mince
- Ajoutez des vérifications d'authentification/autorisation si le projet utilise des gardes middleware
- Écrivez au moins trois tests : cas de succès, échec de validation, cas non trouvé
- Suivez les conventions de ressources RESTful — utilisez des noms dans les chemins, pas des verbes

Résultat :
1. Fichier de route/contrôleur (ou ajout au routeur existant)
2. Définitions de type de requête/réponse
3. Stub de fonction de service (ou implémentation si la logique est simple)
4. Fichier de test avec les trois cas requis
5. Tout changement de migration ou de schéma si le point de terminaison touche la DB

Si $ARGUMENTS est vide, demandez : la méthode, le chemin, et ce que fait le point de terminaison.
