# MCP : Slack

Lisez les canaux Slack, recherchez les messages, publiez les mises à jour et gérez les notifications — apportez le contexte de votre équipe dans Claude Code sans basculer les onglets ni perdre le flot.

## Pourquoi vous avez besoin de ceci

La connaissance d'équipe vit dans Slack : décisions de conception, chronologies d'incident, commentaires produit et discussions asynchrones qui ne finissent jamais dans la documentation. Sans MCP, Claude ne peut rien voir. Avec Slack MCP :
- L'historique des canaux et la recherche donnent à Claude le contexte complet de l'équipe derrière n'importe quelle fonctionnalité ou bug
- L'affichage des avis de déploiement, des résumés de PR ou des mises à jour de statut se fait à l'intérieur de la session de codage
- Se mettre à jour sur les discussions manquées (standups, fils de commentaires, canaux d'incident) est une seule invite
- Les publications de statut automatisées de Claude peuvent remplacer les mises à jour Slack manuelles pendant les tâches longues

## Installation

```bash
npm install -g @modelcontextprotocol/server-slack
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    }
  }
}
```

## Outils clés / Ce qu'ils font

- `list_channels` — lister les canaux publics de l'espace de travail (nom, ID, nombre de membres, sujet)
- `get_channel_history` — récupérer les messages récents d'un canal avec une limite de messages configurable
- `search_messages` — recherche texte intégral sur tous les canaux accessibles au bot, avec filtres de dates optionnels
- `post_message` — poster un message à un canal (supporte le formatage markdown Slack)
- `reply_to_thread` — répondre à un message existant en utilisant l'horodatage du message parent
- `get_thread_replies` — récupérer toutes les réponses dans un fil par canal et horodatage parent
- `list_users` — lister les membres de l'espace de travail avec les noms d'affichage et les IDs utilisateur
- `get_user_profile` — récupérer le profil complet d'un utilisateur (titre, fuseau horaire, email si autorisé)
- `upload_file` — télécharger un fichier ou un snippet vers un canal
- `add_reaction` — ajouter une réaction emoji à un message

## Exemples d'utilisation

```
Recherchez Slack pour toutes les mentions du bug d'authentification cette semaine sur
tous les canaux. Résumez ce que l'équipe a trouvé et s'il existe une correction convenue ou si c'est toujours ouvert.
```

```
Poster une notification de déploiement à #deployments :
La version 2.4.1 est active en production. Modifications : [lister les modifications].
Instructions de retrait : [lien].
```

```
Obtenez les 30 derniers messages de #product-feedback et identifiez
les 3 meilleures demandes de fonctionnalités par fréquence de mention. Listez les demandes
qui apparaissaient plus d'une fois.
```

```
Répondez au fil dans #engineering où Sarah a posé une question sur
la migration de base de données — dites-lui que la migration a réussi,
a pris 4 minutes et zéro lignes n'ont été affectées inopinément.
```

```
Résumez le canal #engineering d'aujourd'hui. J'ai été plongé pendant 6 heures
— quelles décisions ont été prises et que dois-je savoir ?
```

## Authentification

1. Allez sur **api.slack.com/apps** et cliquez sur **Créer une nouvelle application** → **À partir de zéro**
2. Nommez l'application et sélectionnez votre espace de travail
3. Sous **OAuth & Permissions → Bot Token Scopes**, ajoutez ces portées :
   - `channels:read` — lister les canaux publics
   - `channels:history` — lire les messages des canaux publics
   - `groups:read` / `groups:history` — même chose pour les canaux privés (si nécessaire)
   - `search:read` — rechercher les messages à l'échelle de l'espace de travail
   - `chat:write` — poster des messages
   - `users:read` — lister et rechercher les utilisateurs
   - `files:write` — télécharger les fichiers (si nécessaire)
   - `reactions:write` — ajouter des réactions (si nécessaire)
4. Cliquez sur **Installer dans l'espace de travail** et approuvez les permissions
5. Copiez le **Bot User OAuth Token** (commence par `xoxb-`) et définissez-le comme `SLACK_BOT_TOKEN`
6. Trouvez votre **Team ID** sous **Paramètres → Informations de base** et définissez-le comme `SLACK_TEAM_ID`
7. Invitez le bot à chaque canal auquel il doit accéder avec `/invite @your-bot-name`

## Conseils

**Le bot doit être invité aux canaux :** Le bot ne peut lire et poster que sur les canaux auxquels il a été ajouté. Pour les canaux privés, cela nécessite une invitation explicite `/invite @botname` d'un membre du canal — l'accès administrateur ne l'octroie pas automatiquement.

**`search:read` est une portée séparée :** L'historique des canaux et la recherche sont des permissions différentes. `channels:history` lit uniquement un canal spécifique que vous spécifiez. `search:read` active la recherche de messages à l'échelle de l'espace de travail. Vous avez besoin des deux pour la fonctionnalité complète.

**Les limites de débit varient selon le point de terminaison :** La plupart des points de terminaison relèvent du niveau 3 de Slack (50 + requêtes/minute). La recherche est le niveau 2 (20 requêtes/minute). Pour les opérations à fort volume, ajoutez de brefs retards entre les appels pour éviter les erreurs 429.

**Le message direct requiert une portée supplémentaire :** La publication à une DM utilisateur nécessite la portée `im:write` en plus de `chat:write`. Ajoutez-la aux portées du bot et réinstallez si vous avez besoin de cette capacité.

**Markdown Slack dans les messages :** `post_message` supporte le format mrkdwn de Slack : `*bold*`, `_italic_`, `` `code` ``, `>blockquote` et `<URL|link text>`. Utilisez ceci lors du formatage des avis de déploiement ou des résumés structurés.

**Les horodatages des fils sont précis :** `reply_to_thread` nécessite la valeur exacte de `ts` (horodatage) du message parent, qui ressemble à `1716300000.000100`. Obtenez-la à partir de la sortie `get_channel_history` avant de répondre.

---
