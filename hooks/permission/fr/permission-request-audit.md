# Hook: Audit des demandes de permission

S'exécute sur `PermissionRequest` pour écrire chaque demande de permission — nom de l'outil, arguments et contexte de décision — dans un journal d'audit structuré. Utile pour examen de conformité, débogage de sessions trop permissives et compréhension de ce que Claude a tenté pendant une longue exécution.

## Ce qu'il fait

Lit la charge utile `PermissionRequest` depuis stdin et ajoute un enregistrement au format JSON-lines dans `.claude/logs/permission-audit.jsonl`. Chaque enregistrement contient :

- `timestamp` — ISO-8601 UTC
- `session` — ID de session
- `tool` — l'outil pour lequel Claude demande la permission
- `input_summary` — premiers 200 caractères de l'entrée de l'outil (assainie — les secrets détectés par motif sont supprimés)
- `event` — toujours `"permission_request"` pour un filtrage facile

Exemple de ligne JSONL :
```json
{"timestamp":"2026-06-03T10:22:01Z","session":"abc123","event":"permission_request","tool":"Bash","input_summary":"git push origin main --force"}
```

Le script émet également la charge utile complète sur stderr (visible dans la sortie de débogage de Claude) sans affecter la décision de permission — sortie toujours 0, donc ce hook est purement observationnel.

## Quand il s'exécute

`PermissionRequest` — s'exécute avant que Claude Code affiche à l'utilisateur une invite de permission pour tout appel d'outil qui nécessite une approbation explicite.

## Entrée settings.json

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/permission-request-audit.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Définissez `matcher` sur un nom d'outil spécifique (par exemple, `"Bash"`) pour auditer uniquement les appels shell.

## Script

`permission-request-audit.sh`

```bash
#!/usr/bin/env bash
# permission-request-audit.sh
# Fires on PermissionRequest — writes a JSONL audit record for every permission ask

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/permission-audit.jsonl"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  TOOL=$(echo "$PAYLOAD"  | jq -r '.tool_name // .tool // "unknown"')
  RAW_INPUT=$(echo "$PAYLOAD" | jq -r '.tool_input | tostring' | head -c 200)
else
  TOOL=$(echo "$PAYLOAD"  | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  RAW_INPUT=$(echo "$PAYLOAD" | head -c 200)
fi

# Redact common secret patterns before writing
INPUT_SUMMARY=$(echo "$RAW_INPUT" \
  | sed 's/[A-Za-z0-9_\-]\{20,\}/[REDACTED]/g' \
  | sed 's/sk-[A-Za-z0-9]\+/[REDACTED]/g' \
  | sed 's/ghp_[A-Za-z0-9]\+/[REDACTED]/g')

# Write JSONL record
printf '{"timestamp":"%s","session":"%s","event":"permission_request","tool":"%s","input_summary":"%s"}\n' \
  "$TIMESTAMP" "$SESSION" "$TOOL" \
  "$(echo "$INPUT_SUMMARY" | sed 's/"/\\"/g')" \
  >> "$LOG_FILE"

# Always allow — this hook is audit-only
exit 0
```

## Configuration

```bash
cp hooks/permission/permission-request-audit.sh .claude/hooks/
chmod +x .claude/hooks/permission-request-audit.sh
mkdir -p .claude/logs
```

Pour exécuter l'audit comme une **barrière bloquante** (exiger une approbation manuelle pour chaque outil sensible), remplacez `exit 0` par `exit 1` pour les outils que vous souhaitez forcer à inviter. Pour un blocage matériel, utilisez `exit 2`.

## Notes

- Le format `.jsonl` facilite l'ingestion dans l'analyse : `jq -s '.' .claude/logs/permission-audit.jsonl` ou importez dans tout agrégateur de journaux.
- La regex de suppression est intentionnellement large. Réglez les motifs `sed` pour correspondre aux formats secrets de votre projet.
- Associez à `permission-denied-alert` pour être averti quand la permission est finalement refusée après le déclenchement de l'audit.
- Alternez le fichier journal régulièrement ; une session active peut générer des centaines d'enregistrements.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
