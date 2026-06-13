---
description: Ajouter une pagination basée sur curseur ou offset à un endpoint de liste avec une forme de réponse cohérente
argument-hint: "[endpoint-ou-modele]"
---
Ajouter la pagination à l'endpoint ou la ressource : $ARGUMENTS

Si $ARGUMENTS est vide, trouver tous les endpoints de liste (ceux qui retournent des tableaux) et appliquer la pagination à chacun.

Choisir la stratégie de pagination en fonction du cas d'usage :
- Basée sur curseur (par défaut pour la plupart des flux et grands ensembles de données) : stable sous écritures concurrentes, supporte le défilement infini, ne peut pas sauter à une page arbitraire
- Basée sur offset/page (uniquement si l'interface utilisateur nécessite « aller à la page N ») : plus simple mais incohérente sous écritures

Implémentation basée sur curseur :
- Le curseur encode la valeur de la colonne de tri + la clé primaire de la dernière ligne vue — la coder en base64, ne jamais exposer les valeurs brutes de la base de données
- Tri par défaut : décroissant par `created_at`, tri secondaire par `id` pour lever les égalités
- Accepter `cursor` (chaîne opaque) et `limit` (entier, 1–100, par défaut 20) comme paramètres de requête
- Valider `limit` — rejeter < 1 ou > 100 avec 400
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
- `next_cursor` est null s'il n'y a plus de pages
- Ne jamais divulguer le nombre total sauf s'il est explicitement requis — c'est coûteux à grande échelle

Implémentation basée sur offset (uniquement si demandé) :
- Accepter `page` (indexée à partir de 1) et `per_page` (1–100, par défaut 20)
- Inclure `total`, `page`, `per_page`, `total_pages` dans l'enveloppe de réponse

Les deux stratégies :
- Ajouter un index de base de données sur la colonne de tri s'il n'existe pas
- La requête doit être un seul appel à la base de données — pas de N+1 en récupérant le nombre séparément sauf si la pagination par offset l'exige
- Mettre à jour la spécification OpenAPI pour l'endpoint s'il en existe une

Écrire des tests : première page, deuxième page via curseur, résultat vide, validation des limites.
