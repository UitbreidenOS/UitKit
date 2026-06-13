# MCP : Auth0

Connectez Claude Code à Auth0 pour la gestion d'identité et d'accès — interrogez les utilisateurs, gérez les rôles, inspectez les logs de connexion, et prenez les actions de correction sans quitter votre terminal.

## Pourquoi vous avez besoin de ceci

Les problèmes d'accès utilisateur — les comptes verrouillés, les motifs de connexion suspects, les disjonctions de rôle — requièrent le constant context switching entre votre code et le Auth0 Management Dashboard. Le MCP Auth0 apporte ces données dans Claude, pour que vous puissiez enquêter sur un incident, bloquer un compte compromis, ou auditer les attributions de rôle dans une conversation.

## Prérequis

- Compte Auth0 (n'importe quel plan; accès d'API Management est disponible sur tous les plans incluant gratuit)
- Une **application Machine-to-Machine (M2M)** enregistrée dans votre tenant Auth0, autorisée à appeler l'Auth0 Management API
- Le **Client ID** et **Client Secret** de l'application M2M
- Votre Auth0 **domain** (par ex., `your-tenant.us.auth0.com`)

## Installation

Installez le serveur MCP officiel Auth0 via npx — pas d'install global requis.

```bash
npx @auth0/auth0-mcp-server --version
```

## Configuration

Ajoutez ce qui suit à votre `~/.claude/settings.json` (au niveau utilisateur) ou `.claude/settings.json` (au niveau projet) :

```json
{
  "mcpServers": {
    "auth0": {
      "command": "npx",
      "args": ["-y", "@auth0/auth0-mcp-server"],
      "env": {
        "AUTH0_DOMAIN": "your-tenant.us.auth0.com",
        "AUTH0_CLIENT_ID": "YOUR_M2M_CLIENT_ID",
        "AUTH0_CLIENT_SECRET": "YOUR_M2M_CLIENT_SECRET"
      }
    }
  }
}
```

Remplacez `your-tenant.us.auth0.com` avec votre domain Auth0 réel — visible dans le Auth0 Dashboard sous **Applications → votre app M2M → Domain**.

## Outils clés

| Outil | Description | Paramètres clés |
|---|---|---|
| `list_users` | Cherchez et listez les utilisateurs dans le tenant | `q` (requête Lucene), `per_page`, `page`, `sort` |
| `get_user` | Récupérez le profil complet pour un single utilisateur | `id` (Auth0 user ID, par ex., `auth0|abc123`) |
| `create_user` | Créez un nouvel utilisateur dans une connexion de base de données | `email`, `password`, `connection`, `name` |
| `assign_roles` | Assignez un ou plus rôles à un utilisateur | `id`, `roles` (array d'IDs de rôle) |
| `list_applications` | Listez toutes les applications enregistrées dans le tenant | `per_page`, `page` |
| `get_logs` | Récupérez les événements du journal du tenant avec support de filtre | `q` (type d'événement, utilisateur, IP), `per_page`, `from`, `take` |
| `block_user` | Bloquez un compte utilisateur (prévient la connexion) | `id` |

## Exemples d'usage

```
Listez tous les utilisateurs qui se sont inscrits dans les 7 derniers jours

Bloquez immédiatement le compte pour user email@example.com

Montrez toutes les tentatives de connexion échouées des 24 dernières heures

Assignez le rôle "admin" à l'utilisateur auth0|64a1f2b3c4d5e6f7a8b9c0d1

Listez toutes les applications enregistrées dans ce tenant Auth0
```

## Authentification — Création de l'application M2M

1. Connectez-vous au Auth0 Dashboard et allez à **Applications → Create Application**
2. Choisissez **Machine to Machine Applications** et nommez-la (par ex., `claude-code-mcp`)
3. Sur l'écran suivant, sélectionnez **Auth0 Management API** comme l'API autorisée
4. Accordez les scopes que votre cas d'usage requiert (voir Scopes ci-dessous) et cliquez **Authorize**
5. Allez à l'onglet **Settings** de votre nouvelle app M2M et copiez le **Domain**, **Client ID**, et **Client Secret**
6. Collez les trois dans le bloc `env` dans settings.json

**Scopes minimum requis par opération :**

| Opération | Scope requis |
|---|---|
| Lisez utilisateurs | `read:users` |
| Créez utilisateurs | `create:users` |
| Bloquez/débloquez utilisateurs | `update:users` |
| Assignez rôles | `update:users`, `read:roles` |
| Lisez logs | `read:logs` |
| Listez applications | `read:clients` |

Accordez seulement les scopes que vous avez besoin. Évitez `read:client_keys` — elle expose les client secrets pour toutes les applications.

## Conseils

- Les IDs d'utilisateur Auth0 suivent le format `provider|id` — pour les connexions de base de données c'est `auth0|hex_id`. Utilisez `list_users` avec `q:email:user@example.com` pour trouver l'ID avant de lancer les opérations single-user.
- `get_logs` supporte les codes de type d'événement Auth0 dans la requête : `q=type:f` retourne toutes les connexions échouées; `q=type:s` retourne les succès. La référence de type d'événement complète est dans les docs Auth0 sous Log Event Type Codes.
- `block_user` est réversible — utilisez `update_user` avec `blocked: false` (ou l'outil MCP équivalent s'il est exposé) pour débloquer. Le blocage n'invalide pas les sessions existantes — pairez-le avec un appel pour révoquer les sessions actives si le lockout immédiat est requis.
- L'API Management a une limite de taux de 2 requêtes/seconde par tenant sur les plans gratuits, et des limites plus élevées sur les plans payants. Évitez les boucles serrées d'appels `get_user`.
- Les tokens M2M émis par Auth0 expirent après 24 heures par défaut. Le serveur MCP gère le rafraîchissement de token automatiquement — pas de rotation manuelle nécessaire.
- Pour les architectures multi-tenant (un tenant Auth0 par client), vous aurez besoin d'une configuration MCP séparée par tenant. Considérez l'utilisation des settings.json au niveau projet scoped à chaque projet.

## Notes de coût

Les appels d'API Management Auth0 sont inclus dans tous les plans Auth0 — il n'y a pas de frais par-appel. Cependant, les plans gratuits coiffent à 1,000 utilisateurs actifs et imposent les limites de taux d'API Management. Les tenants en production sur les plans payants ont des limites de taux plus élevées et la capacité d'utilisateurs. Vérifiez le quota d'API Management de votre plan sous **Settings → Tenant Settings** dans le Auth0 Dashboard.

---
