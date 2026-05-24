# MCP : Supabase

Donnez à Claude Code un accès direct à votre projet Supabase — interrogez les tables Postgres, inspectez les politiques RLS, gérez les utilisateurs d'authentification, invoquez les Edge Functions et travaillez avec Storage — tout sans coller le schéma ou les URL API dans chaque session.

## Pourquoi vous en avez besoin

Sans MCP, travailler avec Supabase signifie copier les définitions de table, chercher les URL API et rétablir le contexte à chaque session. Avec le Supabase MCP :
- Claude interroge votre base de données Postgres directement — aucune copie-collage de schéma
- Les structures de table, les types de colonnes et les clés étrangères sont introspectés en temps réel
- Les politiques RLS sont lisibles et auditables dans la même session que votre code
- Les utilisateurs d'authentification et les journaux d'authentification sont interrogeables pour le débogage et la conformité
- Les Edge Functions peuvent être listées, inspectées et invoquées avec une charge utile
- Les compartiments de stockage sont accessibles pour les opérations de lecture et d'écriture
- La branchement de base de données permet une itération sûre du schéma sans toucher à la production

## Installation

Aucune installation npm requise pour la variante distante. La variante locale `npx` récupère le paquet à la première exécution.

## Configuration

**Local (npx — recommandé pour la plupart des configurations) :**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_PROJECT_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

Remplacez `YOUR_PROJECT_REF` par votre référence de projet (le sous-domaine dans votre URL Supabase) et `YOUR_SERVICE_ROLE_KEY` par la clé de rôle de service du tableau de bord.

**Remote (transport SSE — aucune dépendance locale) :**

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SUPABASE_ACCESS_TOKEN"
      }
    }
  }
}
```

La variante distante utilise un token d'accès personnel Supabase plutôt qu'une clé de rôle de service. Générez-en un sous **Account Settings → Access Tokens**.

Ajoutez soit le bloc à `~/.claude.json` (global) ou `.claude/mcp.json` (par-projet).

## Trouver vos credentials

- **URL du projet et clé de rôle de service :** Tableau de bord Supabase → votre projet → **Settings → API**
- La clé de rôle de service est étiquetée `service_role` sous **Project API keys**
- La clé `anon` n'est pas suffisante — elle respecte RLS et bloquera de nombreuses opérations d'outils
- Pour la variante SSE distante : **supabase.com → Account → Access Tokens → Generate new token**

## Outils clés

| Outil | Ce qu'il fait |
|---|---|
| `query_table` | Exécuter une SELECT SQL contre toute table dans tout schéma |
| `list_tables` | Énumérer les tables avec colonnes, types, nullabilité et clés étrangères |
| `get_rls_policies` | Afficher toutes les politiques Row-Level Security pour une table |
| `list_functions` | Lister toutes les Edge Functions avec statut de déploiement |
| `invoke_function` | Appeler une Edge Function avec une charge utile JSON |
| `list_buckets` | Afficher les compartiments de stockage et leurs paramètres d'accès |
| `upload_file` | Télécharger un fichier dans un compartiment de stockage |
| `list_auth_users` | Interroger auth.users — email, fournisseur, statut de confirmation, métadonnées |
| `get_auth_logs` | Récupérer les événements d'authentification pour l'audit ou le débogage |

## Exemples d'utilisation

```
Montrez-moi toutes les tables du schéma public avec leurs types de colonne et politiques RLS
```

```
Trouvez tous les utilisateurs qui se sont inscrits au cours des 7 derniers jours mais n'ont jamais confirmé leur email
```

```
Générez une définition de type TypeScript pour la table profiles basée sur le schéma réel
```

```
Écrivez une migration pour ajouter une colonne soft-delete (deleted_at timestamptz) à la table posts
```

```
Vérifiez chaque table du schéma public — signalez toute table qui n'a aucune politiques RLS activées
```

```
Montrez tous les Edge Functions, leur dernière version déployée et les compteurs d'invocation de cette semaine
```

```
Listez tous les auth.users où le fournisseur est 'email' et email_confirmed_at est null
```

```
Téléchargez le fichier à ./exports/report.pdf dans le compartiment de stockage reports
```

## Branchement de base de données

Le branchement Supabase crée une copie isolée de votre base de données pour le travail de développement et d'aperçu. Chaque branche obtient sa propre URL et clé de rôle de service, afin que les migrations puissent être testées sans risque de production.

Créez une branche via la CLI Supabase :

```bash
supabase branches create dev
```

Pointez MCP sur l'URL de la branche pour une itération sûre du schéma :

```json
{
  "mcpServers": {
    "supabase-dev": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_BRANCH_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_BRANCH_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

Exécutez plusieurs entrées MCP nommées — une pour la production, une pour la branche — et basculez en référençant le nom du serveur dans vos prompts. Claude peut appliquer une migration à la branche, valider le schéma et confirmer la correction avant que vous ne promuviez en production.

## Combiner avec GitHub MCP

Supabase MCP et GitHub MCP ensemble permettent à Claude de fermer la boucle sur les migrations de schéma :

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_PROJECT_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_SERVICE_ROLE_KEY"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT"
      }
    }
  }
}
```

Avec les deux serveurs actifs, Claude peut lire une PR, extraire la SQL de migration de la différence, la comparer contre le schéma en direct en utilisant `list_tables` et signaler tout conflit avant que la PR ne soit fusionnée.

Exemple de prompt :

```
Lisez la PR #47, extrayez tout SQL du répertoire migrations/, comparez-le contre
le schéma public actuel et signalez toute colonne renommée ou supprimée qui pourrait
casser les requêtes existantes.
```

## Sécurité

La clé de rôle de service contourne Row-Level Security complètement. Traitez-la comme une credential root.

- Pour le développement solo sur un projet local ou dev : la clé de rôle de service dans la configuration MCP est acceptable.
- Pour les environnements d'équipe partagés : créez un rôle Postgres en lecture seule avec une chaîne de connexion directe au lieu d'utiliser la clé de rôle de service. N'accordez que les schémas que Claude doit lire.
- Ne commitez jamais votre clé de rôle de service à git. Ajoutez-la à `.gitignore` si vous utilisez un fichier `.env`, et ne la mettez jamais en ligne dans un `.claude/mcp.json` de projet qui est checked in.
- Faites pivoter la clé de rôle de service immédiatement si elle est jamais exposée dans un référentiel public.

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec les communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
