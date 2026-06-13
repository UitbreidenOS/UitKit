---
description: Générer un point de terminaison REST entièrement typé avec validation, gestion des erreurs et tests
argument-hint: "[method] [path] [description]"
---
Générer un point de terminaison API REST prêt pour la production à partir de la spécification : $ARGUMENTS

Analysez l'entrée comme : méthode HTTP, chemin et une brève description de l'opération de ressource.

Règles :
- Déduire le framework du code existant (Express, FastAPI, Gin, Rails, etc.)
- Respecter la structure de fichiers existante du projet, les conventions de nommage et le style d'importation
- Définir les types de requête/réponse en utilisant le système de type du projet (interfaces TypeScript, modèles Pydantic, structs Go, etc.)
- Valider toutes les entrées à la limite — rejeter les requêtes mal formées avant que la logique métier s'exécute
- Retourner les codes de statut HTTP standard : 200/201 succès, 400 requête malformée, 401 non authentifié, 403 interdit, 404 non trouvé, 409 conflit, 422 non traitable, 500 erreur interne
- Ne jamais exposer les traces de pile ou les détails d'erreur internes dans les corps de réponse
- Extraire la logique métier dans une couche de service, garder le contrôleur mince
- Ajouter les vérifications d'authentification/autorisation si le projet utilise les gardes middleware
- Écrire au moins trois tests : cas de succès, échec de validation, cas non trouvé
- Suivre les conventions de ressources RESTful — utiliser des noms dans les chemins, pas des verbes

Résultat :
1. Fichier de routage/contrôleur (ou ajout au routeur existant)
2. Définitions de types de requête/réponse
3. Stub de fonction de service (ou implémentation si la logique est simple)
4. Fichier de test avec les trois cas requis
5. Toute migration ou modification de schéma si le point de terminaison touche la BD

Si $ARGUMENTS est vide, demander : la méthode, le chemin et ce que fait le point de terminaison.
