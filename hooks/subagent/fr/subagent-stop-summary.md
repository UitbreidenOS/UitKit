# Hook: Subagent Stop Summary

Déclenché sur `SubagentStop` pour ajouter un résumé d'une ligne du résultat au journal de session — vous donnant un enregistrement chronologique de chaque invocation de sous-agent et de son résultat dans un seul fichier.

## Qu'il fait

Lit la charge utile `SubagentStop` depuis stdin et ajoute une ligne de résumé horodatée à `.claude/logs/subagent-activity.log` (le même fichier écrit par `subagent-start-logger`). La ligne inclut :

- Horodatage ISO-8601
- Marqueur `[STOP]` pour un filtrage facile avec grep/awk
- Nom de l'agent
- Statut de sortie / indicateur de succès
- Les 120 premiers caractères du message de résultat ou d'erreur

Exemple de ligne de journal :
```
2026-06-03T09:14:35Z [STOP]  agent=security-reviewer session=abc123 status=success result="No critical vulnerabilities found. 2 low-severity warnings in src/api/routes.py."
```

L'appairage des lignes `[START]` et `[STOP]` dans le journal permet de mesurer facilement le temps d'exécution du sous-agent en temps réel avec un simple script awk.

## Quand il se déclenche

`SubagentStop` — se déclenche chaque fois qu'un sous-agent se termine, qu'il réussisse, qu'il rencontre une erreur ou qu'il soit interrompu.

## Entrée settings.json

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/subagent-stop-summary.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## Script

`subagent-stop-summary.sh`

```bash
#!/usr/bin/env bash
# subagent-stop-summary.sh
# Fires on SubagentStop — appends result summary to subagent-activity.log

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/subagent-activity.log"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  AGENT=$(echo "$PAYLOAD"  | jq -r '.agent_name // .tool_name // "unknown"')
  STATUS=$(echo "$PAYLOAD" | jq -r 'if .error then "error" else "success" end')
  RESULT=$(echo "$PAYLOAD" | jq -r '.result // .error // .output // ""' | head -c 120)
else
  AGENT=$(echo "$PAYLOAD"  | grep -o '"agent_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  STATUS="unknown"
  RESULT=$(echo "$PAYLOAD" | grep -o '"result":"[^"]*"' | cut -d'"' -f4 | head -c 120 || echo "")
fi

echo "${TIMESTAMP} [STOP]  agent=${AGENT} session=${SESSION} status=${STATUS} result=\"${RESULT}\"" >> "$LOG_FILE"
```

## Configuration

```bash
cp hooks/subagent/subagent-stop-summary.sh .claude/hooks/
chmod +x .claude/hooks/subagent-stop-summary.sh
mkdir -p .claude/logs
```

Déployez-le aux côtés de `subagent-start-logger` pour une trace complète de démarrage/arrêt. Les deux hooks écrivent dans le même fichier journal, donc une simple commande `grep agent=security-reviewer .claude/logs/subagent-activity.log` affiche l'historique complet pour n'importe quel agent.

## Remarques

- Pour mesurer la durée du sous-agent : `awk '/\[START\].*agent=X/{s=$1} /\[STOP\].*agent=X/{print s, $1}' subagent-activity.log` (nécessite des calculs d'horodatage — canaliser via Python ou `dateutil` pour plus de précision).
- Si un sous-agent est tué en milieu d'exécution, il peut y avoir un `[START]` sans `[STOP]` correspondant ; traitez ceux-ci comme des événements de timeout/interruption dans votre analyse.
- Combinez avec le hook de cycle de vie `cost-tracker` pour corréler les dépenses du sous-agent avec les résultats.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
