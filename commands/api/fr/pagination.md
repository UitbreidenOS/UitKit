---
description: Ajouter une pagination basée sur le curseur ou le décalage à un endpoint de liste avec une forme de réponse cohérente
argument-hint: "[endpoint-or-model]"
---
Ajouter la pagination à l'endpoint ou la ressource : $ARGUMENTS

Si $ARGUMENTS est vide, trouvez tous les endpoints de liste (ceux qui retournent des tableaux) et appliquez la pagination à chacun.

Choisissez la stratégie de pagination en fonction du cas d'usage :
- Basée sur le curseur (par défaut pour la plupart des flux et grands ensembles de données) : stable lors des écritures concurrentes, supporte le défilement infini, ne peut pas sauter à une page arbitraire
- Basée sur le décalage/page (uniquement si l'interface utilisateur nécessite « aller à la page N ») : plus simple mais incohérente lors des écritures

Implémentation basée sur le curseur :
- Le curseur encode la valeur de la colonne de tri + la clé primaire de la dernière ligne vue — encodez-la en base64, ne divulguez jamais les valeurs brutes de la base de données
- Tri par défaut : décroissant par `created_at`, tri secondaire par `id` pour le bris d'égalité
- Acceptez `cursor` (chaîne opaque) et `limit` (entier, 1–100, par défaut 20) comme paramètres de requête
- Validez `limit` — rejetez < 1 ou > 100 avec 400
- Forme de réponse :
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "<opaque>",
      "has_more": true,
      "limit": 20
    }
  }
  ```
- `next_cursor` est null quand il n'y a plus de pages
- Ne divulguez jamais le nombre total à moins que cela ne soit explicitement requis — c'est coûteux à l'échelle

Implémentation basée sur le décalage (uniquement si demandé) :
- Acceptez `page` (indexé à 1) et `per_page` (1–100, par défaut 20)
- Incluez `total`, `page`, `per_page`, `total_pages` dans l'enveloppe de réponse

Les deux stratégies :
- Ajouter un index de base de données sur la colonne de tri s'il n'existe pas
- La requête doit être un seul appel DB — pas de N+1 en récupérant le nombre séparément sauf si la pagination par décalage l'exige
- Mettez à jour la spécification OpenAPI pour l'endpoint s'il en existe une

Écrivez des tests : première page, deuxième page via curseur, résultat vide, validation des limites.
