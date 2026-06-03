# Hook : Enregistreur de démarrage de sous-agent

Se déclenche sur `SubagentStart` pour enregistrer quel sous-agent a été lancé, quelle tâche il a reçue et quand — créant une trace continue de toute l'activité des agents dans la session.

## Ce qu'il fait

Lit la charge utile `SubagentStart` depuis stdin (JSON contenant le nom de l'agent, le modèle et la description de la tâche) et ajoute une ligne horodatée unique au fichier `.claude/logs/subagent-activity.log`. L'entrée de journal comprend :

- Horodatage ISO-8601
- Nom de l'agent / nom de l'outil
- Les 120 premiers caractères de l'invite de tâche (suffisamment de contexte, sans être trop bavard)
- ID de session (de la variable d'environnement `CLAUDE_SESSION_ID` si disponible)

Exemple de ligne de journal :
```
2026-06-03T09:14:22Z [START] agent=security-reviewer session=abc123 task="Review the pending diff for injection vulnerabilities in src/api/..."
```

## Quand il se déclenche

`SubagentStart` — se déclenche chaque fois que Claude Code lance un sous-agent (appels d'outils parallèles, agents délégués, invocations de compétences qui s'exécutent comme un sous-processus).

## Entrée settings.json

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/subagent-start-logger.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Définissez `matcher` à `""` pour capturer tous les sous-agents, ou fournissez une sous-chaîne du nom de l'agent (par exemple `"security"`) pour filtrer.

## Script

`subagent-start-logger.sh`

```bash
#!/usr/bin/env bash
# subagent-start-logger.sh
# Fires on SubagentStart — logs agent name + task snippet to subagent-activity.log

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/subagent-activity.log"

mkdir -p "$LOG_DIR"

# Read the full JSON payload from stdin
PAYLOAD=$(cat)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

# Extract fields with jq; fall back to raw grep if jq is absent
if command -v jq &>/dev/null; then
  AGENT=$(echo "$PAYLOAD" | jq -r '.agent_name // .tool_name // "unknown"')
  TASK=$(echo "$PAYLOAD"  | jq -r '.task // .prompt // ""' | head -c 120)
else
  AGENT=$(echo "$PAYLOAD" | grep -o '"agent_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  TASK=$(echo "$PAYLOAD"  | grep -o '"task":"[^"]*"'       | cut -d'"' -f4 | head -c 120 || echo "")
fi

echo "${TIMESTAMP} [START] agent=${AGENT} session=${SESSION} task=\"${TASK}\"" >> "$LOG_FILE"
```

## Configuration

```bash
cp hooks/subagent/subagent-start-logger.sh .claude/hooks/
chmod +x .claude/hooks/subagent-start-logger.sh
mkdir -p .claude/logs
```

Ajoutez l'extrait `settings.json` à `.claude/settings.json` ou `~/.claude/settings.json`.

## Notes

- Le fichier journal croît indéfiniment ; effectuez une rotation avec `logrotate` ou une tâche cron hebdomadaire qui archive les fichiers plus anciens que 30 jours.
- `SubagentStart` se déclenche avant l'exécution du sous-agent, le champ de tâche reflète donc le travail prévu, pas le résultat final — associez-le à `subagent-stop-summary` pour capturer les résultats.
- Si `jq` n'est pas installé (`brew install jq` / `apt install jq`), l'analyse par grep de secours est moins robuste — installez jq pour une utilisation en production.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
