---
description: Générer ou mettre à jour une spécification OpenAPI 3.1 à partir de routes existantes ou d'une description
argument-hint: "[source-file-or-description]"
---
Générer ou mettre à jour une spécification OpenAPI 3.1 basée sur : $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, lisez les définitions de routes à partir de ce fichier. S'il s'agit d'une description, créez une spécification à partir de zéro. Si vide, analysez la base de code pour toutes les définitions de routes et générez une spécification complète.

Exigences :
- Utiliser OpenAPI 3.1.0 (pas 3.0.x — utiliser `type: "null"` au lieu de `nullable: true`)
- Chaque chemin doit avoir : summary, operationId (camelCase, unique), tags, parameters, requestBody (si applicable) et responses
- Définir tous les schémas sous `components/schemas` — les schémas en ligne dans les éléments de chemin sont interdits
- Utiliser `$ref` pour tout schéma référencé plus d'une fois
- Documenter tous les codes d'état de réponse que le code renvoie réellement — ne pas en inventer d'autres
- Les champs requis doivent être dans des tableaux `required` — pas d'optionnels silencieux
- Les valeurs d'énumération doivent correspondre à ce que le code impose
- Inclure les définitions de schéma de sécurité si l'API utilise l'authentification (Bearer JWT, clé API, OAuth2, etc.)
- Ajouter des champs `description` sur toutes les propriétés non évidentes
- Marquer les points de terminaison obsolètes avec `deprecated: true` si trouvés

Règles de formatage :
- Sortie YAML, indentation de 2 espaces
- Garder `paths` trié alphabétiquement par route
- Garder `components/schemas` trié alphabétiquement

Générer le fichier `openapi.yaml` complet. Si mise à jour d'une spécification existante, afficher uniquement les sections modifiées avec suffisamment de contexte pour les placer, puis écrire le fichier mis à jour complet.

Si la source de route est ambiguë ou si les décorateurs spécifiques au cadre ne sont pas reconnus, lister quelles routes ont été ignorées et pourquoi.
