# Hook : Pre-Compact Snapshot

S'exécute sur `PreCompact` pour sauvegarder la transcription complète de la conversation avant que Claude Code la résume et la tronque. Vous donne un enregistrement récupérable de tout ce qui a été dit au cours de la session, même après que la compaction supprime les messages originaux.

## Ce qu'il fait

Lit la charge utile `PreCompact` (qui contient la transcription à compacter) depuis stdin et l'écrit comme fichier JSON horodaté dans `.claude/snapshots/`. Le fichier est nommé par ID de session et horodatage afin que plusieurs événements de compaction au sein d'une session produisent chacun un fichier unique.

Exemple de chemin de snapshot :
```
.claude/snapshots/session-abc123-2026-06-03T10-30-00Z.json
```

Après l'écriture, le script ajoute également une entrée d'index sur une ligne à `.claude/snapshots/index.log` pour que vous puissiez trouver les snapshots précédents sans avoir à lister le répertoire :
```
2026-06-03T10:30:00Z  session=abc123  file=session-abc123-2026-06-03T10-30-00Z.json  turns=87
```

## Quand s'exécute-t-il

`PreCompact` — s'exécute immédiatement avant que Claude Code exécute son étape de compaction/résumé, tandis que la transcription complète est encore disponible dans la charge utile.

## Entrée settings.json

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-snapshot.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

Augmentez `timeout` si vous avez des transcriptions très longues (>500 tours) et que l'écriture prend plus de 15 secondes.

## Script

`pre-compact-snapshot.sh`

```bash
#!/usr/bin/env bash
# pre-compact-snapshot.sh
# Fires on PreCompact — backs up the transcript before compaction

set -euo pipefail

SNAP_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/snapshots"
INDEX_FILE="$SNAP_DIR/index.log"

mkdir -p "$SNAP_DIR"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"
FILENAME="session-${SESSION}-${TIMESTAMP}.json"
SNAP_PATH="$SNAP_DIR/$FILENAME"

# Write the raw transcript payload
echo "$PAYLOAD" > "$SNAP_PATH"

# Count turns if jq is available
TURNS="?"
if command -v jq &>/dev/null; then
  TURNS=$(echo "$PAYLOAD" | jq '.messages | length // 0' 2>/dev/null || echo "?")
fi

# Append to index
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ")  session=${SESSION}  file=${FILENAME}  turns=${TURNS}" >> "$INDEX_FILE"

# Keep at most 20 snapshots per session; prune oldest
SNAP_COUNT=$(ls -1 "$SNAP_DIR"/session-"${SESSION}"-*.json 2>/dev/null | wc -l | tr -d ' ')
if (( SNAP_COUNT > 20 )); then
  ls -1t "$SNAP_DIR"/session-"${SESSION}"-*.json | tail -n +21 | xargs rm -f
fi
```

## Configuration

```bash
cp hooks/context/pre-compact-snapshot.sh .claude/hooks/
chmod +x .claude/hooks/pre-compact-snapshot.sh
mkdir -p .claude/snapshots
```

Ajoutez `.claude/snapshots/` à `.gitignore` — les snapshots peuvent être volumineux et contenir du contenu conversationnel que vous ne souhaitez pas valider.

## Notes

- Les snapshots sont au format JSON ; ouvrez n'importe quel fichier dans un éditeur de texte ou utilisez `jq` pour extraire des tours spécifiques : `jq '.messages[] | select(.role=="user")' snapshot.json`.
- Le plafond de rétention de 20 snapshots par session empêche l'utilisation illimitée du disque lors de sessions très longues avec des compactions fréquentes. Ajustez le plafond dans le script selon vos besoins.
- Le délai d'expiration est défini à 15 secondes ; les transcriptions sont écrites de manière synchrone, donc la compaction attend que la sauvegarde se termine — c'est intentionnel.
- Si l'espace disque est une préoccupation, canalisez via `gzip` : remplacez `echo "$PAYLOAD" > "$SNAP_PATH"` par `echo "$PAYLOAD" | gzip > "${SNAP_PATH}.gz"`.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
