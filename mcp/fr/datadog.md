# MCP : Datadog

Connectez Claude Code à Datadog pour l'observabilité en temps réel — interrogez les métriques, recherchez les logs, inspectez les traces APM, et gérez les moniteurs sans quitter votre terminal.

## Pourquoi vous avez besoin de ceci

Déboguer une spike de latence ou un incident de production signifie de sauter entre les dashboards Datadog, de copier les requêtes de métrique, de coller les résultats dans Claude, et de perdre de l'élan. Le MCP Datadog élimine ce context switch — Claude interroge vos métriques live, logs, et traces in-context et vous aide à diagnostiquer et agir immédiatement.

## Prérequis

- Compte Datadog avec accès API (n'importe quel plan payant)
- Une **API Key** — trouvée sous **Organization Settings → API Keys**
- Une **Application Key** — trouvée sous **Organization Settings → Application Keys** (les application keys sont user-scoped; utilisez un service account pour l'utilisation partagée)
- Pour les déploiements EU ou GovCloud, votre valeur `DD_SITE` (voir Configuration ci-dessous)

## Installation

Installez le serveur MCP officiel Datadog via npx — pas d'install global requis.

```bash
npx @datadog/mcp-datadog --version
```

Si le paquet se résout sans erreur, vous êtes prêt à configurer.

## Configuration

Ajoutez ce qui suit à votre `~/.claude/settings.json` (au niveau utilisateur) ou `.claude/settings.json` (au niveau projet) :

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["-y", "@datadog/mcp-datadog"],
      "env": {
        "DD_API_KEY": "YOUR_DD_API_KEY",
        "DD_APP_KEY": "YOUR_DD_APP_KEY",
        "DD_SITE": "datadoghq.com"
      }
    }
  }
}
```

**Valeurs `DD_SITE` par région :**

| Région | Valeur |
|---|---|
| US1 (défaut) | `datadoghq.com` |
| US3 | `us3.datadoghq.com` |
| US5 | `us5.datadoghq.com` |
| EU1 | `datadoghq.eu` |
| GovCloud | `ddog-gov.com` |

Laissez `DD_SITE` non défini si vous êtes sur la région US1 par défaut.

## Outils clés

| Outil | Description | Paramètres clés |
|---|---|---|
| `query_metrics` | Exécutez une requête de métriques Datadog sur une fenêtre de temps | `query` (chaîne de requête DDog), `from`, `to` |
| `search_logs` | Recherchez les événements de log avec la syntaxe de filtre | `query`, `from`, `to`, `limit` |
| `list_dashboards` | Listez tous les dashboards dans l'org | `filter_name` |
| `get_monitors` | Récupérez les moniteurs avec le filtre de statut optionnel | `status` (`Alert`, `Warn`, `OK`, `No Data`), `tags` |
| `create_incident` | Ouvrez un nouvel incident dans la gestion des incidents Datadog | `title`, `severity`, `customer_impacted` |
| `query_apm_traces` | Recherchez les traces APM par service, opération, ou ressource | `service`, `operation`, `resource`, `from`, `to`, `limit` |

## Exemples d'usage

```
Montrez la latence p99 pour /api/checkout sur la dernière 1 heure

Trouvez toutes les entrées de log au niveau ERROR dans payment-service des 30 dernières minutes

Listez tous les moniteurs actuellement dans l'état ALERT

Quelles traces APM sont les plus lentes pour le service orders dans les 15 dernières minutes ?

Créez un incident Sev-2 intitulé "Taux d'erreur élevé sur le service checkout"
```

## Authentification

1. Connectez-vous à Datadog et allez à **Organization Settings → API Keys**
2. Créez une nouvelle clé API — notez la valeur clé (montrée une seule fois)
3. Allez à **Organization Settings → Application Keys**
4. Créez une clé d'application scoped à votre utilisateur ou un service account
5. Ajoutez les deux valeurs au bloc `env` dans votre settings.json comme montré ci-dessus

Permissions minimales pour la clé d'application : `metrics_read`, `logs_read`, `monitors_read`, `apm_read`. Ajoutez `incidents_write` si vous voulez que `create_incident` fonctionne.

## Conseils

- Les requêtes de métrique Datadog utilisent la même syntaxe que Metrics Explorer : `avg:system.cpu.user{service:checkout}`. Copiez directement depuis l'UI.
- Les paramètres `from` et `to` acceptent les timestamps Unix ou les chaînes relatives comme `now-1h`.
- `search_logs` utilise la syntaxe de requête de log Datadog — les filtres de facette comme `service:payment-service @http.status_code:500` fonctionnent comme attendu.
- `get_monitors` avec `status:Alert` est la manière la plus rapide d'obtenir un snapshot des conditions de tir actif pendant un incident.
- Pour les requêtes APM haute-cardinality, définissez un `limit` (par défaut habituellement 100) pour éviter les réponses lentes.
- Les clés d'application sont par défaut user-scoped — si plusieurs membres de team utilisent ce MCP, créez une clé d'application de service account partagée pour éviter la dérive de permission quand quelqu'un s'en va.
- Lancé en mars 2026 comme partie du programme MCP officiel de Datadog.

## Notes de coût

Tous les appels MCP consomment le quota d'API Datadog. Les requêtes de métrique et les recherches de log comptent contre les limites de tarif d'API de votre plan. Évitez les requêtes automatisées haute-fréquence (par ex., via des hooks) sans examiner les limites de votre plan — Datadog impose les plafonds par-seconde et par-heure d'API au niveau de l'organisation.

---
