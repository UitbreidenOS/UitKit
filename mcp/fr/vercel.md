# MCP : Vercel

Gérez les déploiements, les projets, les domaines et les variables d'environnement Vercel depuis l'intérieur de Claude Code — sans ouvrir le tableau de bord ni copier-coller les journaux de déploiement.

## Pourquoi vous avez besoin de ceci

Le débogage de déploiement signifie normalement : ouvrez le tableau de bord Vercel, trouvez le déploiement échoué, déroulez les journaux de construction, copiez l'erreur, collez dans votre éditeur. Le MCP Vercel réduit cela à une seule requête. Claude tire les journaux, lit l'erreur, la trace jusqu'au fichier source et suggère le correctif — tout en contexte.

## Installation

```bash
npm install -g @vercel/mcp-server
```

## Configuration

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_TOKEN": "YOUR_VERCEL_TOKEN",
        "VERCEL_TEAM_ID": "YOUR_TEAM_ID"
      }
    }
  }
}
```

`VERCEL_TEAM_ID` n'est requis que pour les déploiements d'équipe ou d'organisation. Les projets personnels fonctionnent avec le token seul.

## Outils clés

| Outil | Ce qu'il fait |
|---|---|
| `list_deployments` | Lister les déploiements récents pour un projet avec statut |
| `get_deployment` | Détail complet du déploiement incluant les métadonnées de construction |
| `create_deployment` | Déclencher un nouveau déploiement à partir d'une branche ou d'une validation |
| `list_projects` | Lister tous les projets du compte ou de l'équipe |
| `get_project` | Configuration du projet et paramètres d'infrastructure |
| `list_domains` | Tous les domaines personnalisés attachés à un projet |
| `add_domain` | Attacher un nouveau domaine personnalisé |
| `list_env_vars` | Lister les variables d'environnement (valeurs masquées par défaut) |
| `upsert_env_var` | Ajouter ou mettre à jour une variable d'environnement (insérer ou remplacer) |
| `delete_env_var` | Supprimer une variable d'environnement |
| `get_deployment_logs` | Diffuser les journaux de construction et d'exécution pour un déploiement |
| `rollback_deployment` | Revenir instantanément au déploiement en production précédent |

## Exemples d'utilisation

```
Montrez-moi les 5 derniers déploiements pour my-app et leur statut

Quelles erreurs apparues dans le dernier déploiement échoué du service de paiement ?

Ajouter la variable d'environnement STRIPE_SECRET_KEY à la production — la valeur est sk_live_xxx

Revenir à la production au déploiement précédent immédiatement

Lister tous les domaines personnalisés attachés au projet de façade

Pourquoi la construction a-t-elle échoué il y a 20 minutes ? Montrez-moi les journaux complets.
```

## Authentification

1. Allez sur [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Cliquez sur **Créer un token** — nommez-le quelque chose d'identifiable (par exemple, `claude-mcp`)
3. Définissez la portée sur **Full Account** pour les projets personnels, ou sélectionnez une équipe spécifique
4. Copiez le token — il n'est affiché qu'une seule fois
5. Pour les déploiements en équipe : trouvez votre Team ID sous **Team Settings → General**

## Conseils

- `get_deployment_logs` est la raison principale d'installer ce MCP — canaliser les journaux actifs dans le contexte de Claude est plus rapide que tout flux de travail de débogage manuel.
- `rollback_deployment` ne relance pas la construction — il promeut le déploiement immédiatement précédent et immuable en production instantanément. Zéro temps d'arrêt.
- Combinez avec le MCP GitHub pour construire une boucle complète : les PR fusionnent → les déploiements se déclenchent → les journaux confirment le succès → fait.
- Les variables d'environnement ajoutées via `upsert_env_var` prennent effet lors du prochain déploiement — elles ne sont pas rechargées à chaud.
- Utilisez `list_env_vars` pour auditer les variables d'environnement avant d'utiliser upsert ; `upsert_env_var` remplace silencieusement les valeurs existantes.
- Les déploiements d'aperçu (à partir de PRs) et les déploiements en production sont séparés — spécifiez l'environnement cible lors de l'exécution des opérations de variables d'environnement.

---
