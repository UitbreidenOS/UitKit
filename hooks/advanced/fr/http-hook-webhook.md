# Hook : Webhook HTTP — Canaliser les événements vers des points de terminaison externes

Démontre le hook `"type": "http"`, qui envoie directement des données d'événements structurées à un point de terminaison HTTP sans nécessiter de script shell. Utilisez-le pour transférer les événements de Claude Code dans un tableau de bord, un canal Slack, une plateforme d'observabilité, ou tout service capable de recevoir des webhooks.

## Ce qu'il fait

Lorsqu'il est configuré, le harness sérialise la charge utile complète du hook au format JSON et l'envoie via POST à l'URL configurée. Aucun script n'est nécessaire — le harness gère l'appel HTTP. Le point de terminaison reçoit un corps JSON décrivant l'événement, l'outil impliqué (pour les événements d'utilisation d'outil), l'ID de session, et le répertoire du projet.

Forme de charge utile typique (varie selon le type d'événement) :

```json
{
  "event": "PostToolUse",
  "session_id": "abc123",
  "project_dir": "/Users/you/myproject",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm run build"
  },
  "tool_response": {
    "output": "Build succeeded in 4.2s",
    "exit_code": 0
  },
  "timestamp": "2026-06-03T10:45:00Z"
}
```

Pour les événements de cycle de vie (`Stop`, `Start`, `PreCompact`), les champs `tool_name` / `tool_input` / `tool_response` sont absents ; la charge utile contient plutôt des métadonnées spécifiques à l'événement telles que `stop_reason` ou `compact_summary`.

Le point de terminaison doit répondre avec HTTP 2xx dans le délai d'expiration configuré ; tout autre code de statut est traité comme un échec du hook et signalé à Claude comme une erreur d'outil. Le harness ne réessaie pas les hooks HTTP échoués.

## Quand il se déclenche

Configurable par événement. Appairages courants :

| Événement | Utilisation typique |
|---|---|
| `PostToolUse` | Enregistrer chaque appel d'outil dans un journal d'audit ou un backend d'observabilité |
| `Stop` | Notifier un canal Slack qu'une session s'est terminée et résumer la dernière action |
| `PreToolUse` | Transférer les commandes vers un tableau de bord d'activité en temps réel |
| `SubagentStop` | Enregistrer les complétions de sous-agents dans un suivi de flux de travail |

## Entrée settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/T00000/B00000/XXXXXXXXXXXX",
            "timeout": 10,
            "headers": {
              "Content-Type": "application/json",
              "X-Claude-Project": "${CLAUDE_PROJECT_DIR}"
            }
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "http",
            "url": "https://your-dashboard.example.com/api/claude-events",
            "timeout": 15,
            "headers": {
              "Authorization": "Bearer ${CLAUDE_DASHBOARD_TOKEN}",
              "Content-Type": "application/json"
            }
          }
        ]
      }
    ]
  }
}
```

Les variables d'environnement dans les valeurs `headers` sont développées par le harness au moment de l'appel. Stockez les secrets dans votre environnement shell ou dans un fichier `.env` sourcé par votre profil shell — ne codez pas en dur les jetons dans settings.json.

## Remarques

- **Aucun script requis.** Le harness envoie le POST directement ; il n'y a pas de processus shell à maintenir ou à rendre exécutable.
- **La charge utile est le contexte complet du hook.** Le harness sérialise tout ce qu'il transmettrait à stdin d'un hook de commande en tant que corps POST. La forme est stable dans une version majeure de Claude Code ; traitez les champs au-delà de `event`, `session_id`, et `tool_name` comme informatifs.
- **Les webhooks entrants Slack** s'attendent à une forme spécifique `{"text": "..."}` — ils retourneront 400 pour une charge utile Claude brute. Utilisez un adaptateur léger (par exemple, un Cloudflare Worker ou une fonction AWS Lambda) pour transformer la charge utile avant de la transférer à Slack.
- **Les plateformes d'observabilité** (Datadog, Honeycomb, Grafana) acceptent généralement du JSON arbitraire sur un point de terminaison personnalisé ; mappez `tool_name` à un nom de span et `tool_response.exit_code` à un code de statut.
- **Timeout** par défaut à 10 secondes s'il est omis. Pour les tableaux de bord sur des réseaux lents, augmentez à 30. La session ne bloque pas l'appel HTTP au-delà du délai d'expiration configuré — le harness expire et enregistre un avertissement plutôt que de se bloquer.
- **Vérification TLS** est effectuée par défaut. Les certificats auto-signés nécessitent un proxy ou un champ `ca_bundle` (consultez la documentation du harness pour la liste complète des champs).

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
