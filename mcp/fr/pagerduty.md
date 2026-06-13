# MCP : PagerDuty

Connectez Claude Code à PagerDuty pour la gestion des incidents — listez les incidents actifs, vérifiez les horaires on-call, accusez réception et résolvez les alertes, et créez les nouveaux incidents sans quitter votre terminal.

## Pourquoi vous avez besoin de ceci

Pendant un incident, passer à l'interface PagerDuty casse la concentration. Le MCP PagerDuty laisse Claude interroger l'état live des incidents, identifier qui est en call, et prendre les actions d'accusé de réception/résolution directement — vous gardant dans votre éditeur tandis que vous travaillez le problème.

## Prérequis

- Compte PagerDuty (n'importe quel plan avec accès API REST)
- Une **REST API Key** — trouvée sous **User Settings → API Access Keys** (user token) ou **Integrations → API Access Keys** (token au niveau compte; requiert Admin)
- Votre adresse email associée au compte PagerDuty (requis pour les opérations d'écriture)

## Installation

Le serveur MCP PagerDuty est disponible comme paquet npx. Pas d'install global requis.

```bash
npx @pagerduty/mcp --version
```

Alternativement, PagerDuty supporte un endpoint SSE distant pour les teams qui préfèrent ne pas exécuter un processus local. Voir Configuration ci-dessous pour les deux options.

## Configuration

**Option A — npx (recommandé pour l'utilisation locale) :**

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp"],
      "env": {
        "PD_API_TOKEN": "YOUR_PAGERDUTY_REST_API_KEY",
        "PD_USER_EMAIL": "you@yourcompany.com"
      }
    }
  }
}
```

**Option B — endpoint SSE distant :**

```json
{
  "mcpServers": {
    "pagerduty": {
      "transport": "sse",
      "url": "https://mcp.pagerduty.com/sse",
      "headers": {
        "Authorization": "Token token=YOUR_PAGERDUTY_REST_API_KEY"
      }
    }
  }
}
```

Utilisez l'option B si votre team veut une connexion centralisée gérée sans distribuer les tokens d'API aux machines de développeur individuelles.

## Outils clés

| Outil | Description | Paramètres clés |
|---|---|---|
| `list_incidents` | Listez les incidents avec filtres de statut et urgence | `status` (`triggered`, `acknowledged`, `resolved`), `urgency` (`high`, `low`), `service_ids`, `limit` |
| `get_incident` | Récupérez le détail complet pour un single incident | `incident_id` |
| `acknowledge_incident` | Accusez réception d'un incident (arrête l'escalade) | `incident_id` |
| `resolve_incident` | Résolvez un incident | `incident_id`, `resolution_note` |
| `list_services` | Listez tous les services PagerDuty du compte | `query` (filtre de nom) |
| `get_on_call` | Obtenez l'utilisateur on-call courant(s) pour un horaire ou une politique d'escalade | `schedule_ids`, `escalation_policy_ids`, `since`, `until` |
| `create_incident` | Ouvrez un nouvel incident sur un service | `title`, `service_id`, `urgency`, `body` |

## Exemples d'usage

```
Qui est en call maintenant pour le service payments ?

Listez tous les incidents P1 ouverts à travers l'organisation

Accusez réception de l'incident INC-123456 et laissez une note que j'enquête

Résolvez INC-789012 avec la note de résolution "Rolled back deploy v2.4.1"

Créez un incident haute-urgence sur le service checkout intitulé "Connection pool de base de données épuisée"
```

## Authentification

**User API token (lire + écrire pour votre utilisateur) :**
1. Connectez-vous à PagerDuty et allez à **User Icon → My Profile → User Settings → Create API User Token**
2. Copiez la valeur du token — elle n'est montrée qu'une seule fois
3. Collez dans `PD_API_TOKEN` dans votre settings.json

**Token API au niveau compte (accès complet du compte, requiert Admin role) :**
1. Allez à **Integrations → API Access Keys → Create New API Key**
2. Labelez-le clairement (par ex., `claude-code-mcp`) et copiez la valeur

Les opérations d'accusé de réception et de résolution requièrent que `PD_USER_EMAIL` soit défini à l'email de l'utilisateur associé au token. Les opérations d'écriture effectuées via un token au niveau compte requièrent aussi le champ email pour l'attribution du journal d'audit.

## Conseils

- `list_incidents` avec `status:triggered` vous donne tous les incidents de tir non-reconnus — la manière la plus rapide d'évaluer le rayon de blast pendant une panne.
- `get_on_call` accepte une fenêtre de temps (`since`, `until`) pour que vous puissiez vérifier les rotations on-call futures, pas juste le moment courant.
- Les IDs d'incident PagerDuty dans l'API sont numériques (par ex., `P1234AB`) — vous pouvez les trouver dans l'URL de n'importe quelle page détail d'incident.
- `create_incident` requiert un `service_id` valide. Utilisez `list_services` d'abord si vous ne l'avez pas mémorisé.
- Résoudre les incidents via MCP déclenche toujours le flux de notification post-incident normal de PagerDuty — les stakeholders seront notifiés comme configuré.
- Pour les comptes sur le plan AIOps ou Event Intelligence de PagerDuty, la fusion d'incident et les données de corrélation d'alerte sont disponible via les outils supplémentaires non listés ici — vérifiez le changelog du paquet pour les outils nouvellement ajoutés.

## Notes de coût

Le MCP PagerDuty utilise l'API REST v2 de PagerDuty, qui est inclus dans tous les plans payants. Il n'y a pas de frais par-appel. Les limites de taux sont imposées à 960 requêtes/minute par token d'API pour la plupart des endpoints — bien au-dessus de l'utilisation interactive, mais pertinent pour les workflows automatisés.

---
