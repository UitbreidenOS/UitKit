# MCP : Sentry Remote

Connectez Claude Code directement à Sentry pour le suivi des erreurs, le triage des problèmes et la surveillance de la santé des versions — aucune installation npm requise, s'exécute en tant que MCP distant sur HTTP.

## Pourquoi vous avez besoin de ceci

Le débogage des erreurs en production signifie basculer vers le tableau de bord Sentry, copier les traces de pile, coller dans Claude et perdre le contexte. Le MCP Sentry Remote élimine ce aller-retour — Claude lit vos vrais problèmes, les traces de pile complètes et les données de version en contexte et vous aide à agir immédiatement.

## Installation

Aucune installation requise. Sentry Remote MCP se connecte via le transport SSE. Il n'y a pas de package npm à installer ou maintenir.

## Configuration

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_AUTH_TOKEN"
      }
    }
  }
}
```

Remplacez `YOUR_SENTRY_AUTH_TOKEN` par votre token (voir Authentification ci-dessous).

## Outils clés

| Outil | Ce qu'il fait |
|---|---|
| `list_issues` | Interroger les problèmes ouverts avec les filtres (projet, priorité, env, plage de dates) |
| `get_issue` | Récupérer le détail complet du problème, y compris la trace de pile et les métadonnées |
| `resolve_issue` | Marquer un problème comme résolu |
| `list_events` | Lister tous les événements associés à un problème |
| `get_event` | Récupérer une charge utile d'événement spécifique |
| `list_releases` | Lister les versions pour un projet |
| `get_release` | Détail de la version incluant le taux d'erreur, l'adoption et les régressions |
| `list_projects` | Lister tous les projets de votre organisation |
| `create_comment` | Ajouter un commentaire à un problème |
| `assign_issue` | Assigner un problème à un membre de l'équipe |

## Exemples d'utilisation

```
Listez tous les problèmes non résolus P0 des 24 dernières heures

Afficher la trace de pile complète pour le problème PROJ-1234

Résoudre tous les problèmes marqués comme doublon dans le projet auth

Quel est la tendance du taux d'erreur pour la version v2.1.0 ?

Trouvez toutes les erreurs de type dans la production cette semaine et regroupez par fichier

Quels problèmes ont le plus grand impact utilisateur en production en ce moment ?
```

## Authentification

1. Connectez-vous à Sentry et allez sur **Paramètres utilisateur → Tokens API**
2. Créez un nouveau token avec les portées suivantes :
   - `project:read`
   - `issue:read`
   - `issue:write` (requis pour les actions de résolution et de commentaire)
3. Copiez la valeur du token — elle n'est affichée qu'une seule fois
4. Collez-la dans l'en-tête `Authorization` dans le bloc de configuration ci-dessus

Les tokens au niveau de l'organisation (pour les organisations multi-projets) fonctionnent de la même manière — créez-les sous **Paramètres de l'organisation → Tokens API**.

## Conseils

- Les MCPs distants utilisent `transport: "sse"` et une URL — aucun champ `command` ou `args`. Si vous voyez des erreurs de démarrage, vérifiez que la configuration n'utilise pas le format npx.
- Sentry Remote MCP a été lancé en février 2026 dans le cadre du programme MCP officiel de Sentry.
- Filtrez toujours par `environment` (production vs staging) lors de l'interrogation des problèmes — mélanger les environnements dans le triage gaspille du temps.
- `search_errors` supporte la syntaxe de requête Sentry : `is:unresolved level:error user.email:*` — la même syntaxe utilisée dans l'interface utilisateur Sentry.
- `get_release` est le moyen le plus rapide de vérifier si un nouveau déploiement a introduit une régression avant que votre alerte de surveillance ne se déclenche.
- Pipe la sortie `get_issue` dans une requête de correction de code — Claude a le contexte complet nécessaire pour écrire un correctif ciblé.

---
