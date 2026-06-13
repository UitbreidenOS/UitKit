# MCP : Neon

Gérez les bases de données Neon Postgres directement depuis Claude Code — créez des projets, exécutez du SQL, branchez les bases de données pour les migrations sûres et récupérez les chaînes de connexion sans quitter votre éditeur.

## Pourquoi vous avez besoin de ceci

Le travail de base de données pendant le développement a deux modes de défaillance : exécuter les migrations directement en production (dangereux) et maintenir une instance Postgres locale séparée (friction). Neon résout les deux. Son modèle de branchement vous permet de créer une copie isolée de n'importe quelle base de données en ~2 secondes. Avec le MCP Neon, Claude peut brancher, migrer, valider et nettoyer — tout dans une conversation.

## Installation

Aucune installation requise. Neon MCP est un serveur distant accessible via le transport SSE.

## Configuration

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer YOUR_NEON_API_KEY"
      }
    }
  }
}
```

Remplacez `YOUR_NEON_API_KEY` par votre clé (voir Authentification ci-dessous).

## Outils clés

| Outil | Ce qu'il fait |
|---|---|
| `create_project` | Créer un nouveau projet Neon |
| `list_projects` | Lister tous les projets de votre compte |
| `get_project` | Récupérer le détail du projet incluant la région, la version Postgres et les paramètres |
| `execute_sql` | Exécuter du SQL arbitraire contre n'importe quelle base de données ou branche |
| `create_branch` | Brancher une base de données à partir de main, une branche nommée ou un timestamp |
| `list_branches` | Lister toutes les branches d'un projet |
| `delete_branch` | Supprimer une branche une fois terminée |
| `get_connection_string` | Retourner la chaîne de connexion pour un projet/branche, formatée pour un ORM donné |
| `run_migration` | Appliquer un fichier de migration par rapport à une branche spécifiée |
| `get_schema` | Introspérer le schéma complet pour une base de données ou une branche |

## Exemples d'utilisation

```
Créer un nouveau projet Neon appelé my-app avec une base de données nommée app_db

Brancher la base de données de production pour ce test de migration

Exécuter cette migration SQL sur la branche feature-auth et afficher le résultat

Comparer le schéma entre la branche main et la branche feature-auth

Donnez-moi la chaîne de connexion Prisma pour la base de données de staging

Supprimer la branche feature-auth — la migration est fusionnée
```

## Authentification

1. Connectez-vous sur [console.neon.tech](https://console.neon.tech)
2. Allez sur **Paramètres du compte → Clés API**
3. Générez une nouvelle clé API — donnez-lui un nom descriptif (par exemple, `claude-mcp`)
4. Copiez la valeur de la clé immédiatement — elle n'est pas affichée à nouveau
5. Ajoutez-la à l'en-tête `Authorization` dans le bloc de configuration ci-dessus

## Conseils

- La création de branche prend environ 2 secondes indépendamment de la taille de la base de données — utilisez une branche pour chaque test de migration, pas seulement les risqués.
- Neon Remote MCP a été lancé en février 2026 dans le cadre des outils développeur officiels de Neon.
- `get_connection_string` formate automatiquement pour Drizzle, Prisma et psycopg2 — spécifiez votre ORM dans la requête.
- Les branches sont copy-on-write au niveau du stockage, donc elles utilisent un espace disque minimal jusqu'à ce que les écritures divergent.
- Utilisez `create_branch` avec un argument timestamp pour reproduire un bug qui s'est produit à un moment spécifique.
- Après la validation d'une migration sur une branche, utilisez `execute_sql` sur main pour l'appliquer — ou connectez ceci à un flux de travail de déploiement avec le MCP GitHub.
- Le niveau gratuit inclut 10 branches par projet — plus que suffisant pour le développement actif.

---
