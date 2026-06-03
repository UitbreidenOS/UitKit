# Hook: Pre-Compact Snapshot

Se ejecuta en `PreCompact` para hacer una copia de seguridad de la transcripción completa de la conversación antes de que Claude Code la resuma y la trunce. Te proporciona un registro recuperable de todo lo que se dijo en la sesión, incluso después de que la compactación descarte los mensajes originales.

## Qué hace

Lee la carga útil de `PreCompact` (que contiene la transcripción a compactar) de stdin y la escribe como un archivo JSON con marca de tiempo en `.claude/snapshots/`. El archivo se nombra por ID de sesión y marca de tiempo, por lo que múltiples eventos de compactación dentro de una sesión producen cada uno un archivo único.

Ruta de ejemplo del snapshot:
```
.claude/snapshots/session-abc123-2026-06-03T10-30-00Z.json
```

Después de escribir, el script también añade una entrada de índice de una línea a `.claude/snapshots/index.log` para que puedas encontrar snapshots anteriores sin listar el directorio:
```
2026-06-03T10:30:00Z  session=abc123  file=session-abc123-2026-06-03T10-30-00Z.json  turns=87
```

## Cuándo se ejecuta

`PreCompact` — se ejecuta inmediatamente antes de que Claude Code ejecute su paso de compactación/resumen, mientras la transcripción completa sigue disponible en la carga útil.

## Entrada en settings.json

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

Aumenta `timeout` si tienes transcripciones muy largas (>500 turnos) y la escritura tarda más de 15 segundos.

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

## Configuración

```bash
cp hooks/context/pre-compact-snapshot.sh .claude/hooks/
chmod +x .claude/hooks/pre-compact-snapshot.sh
mkdir -p .claude/snapshots
```

Añade `.claude/snapshots/` a `.gitignore` — los snapshots pueden ser grandes y contener contenido conversacional que no quieres que se confirme.

## Notas

- Los snapshots son JSON; abre cualquier archivo en un editor de texto o usa `jq` para extraer turnos específicos: `jq '.messages[] | select(.role=="user")' snapshot.json`.
- El límite de retención de 20 snapshots por sesión evita el uso ilimitado de disco en sesiones muy largas con compactaciones frecuentes. Ajusta el límite en el script según sea necesario.
- El timeout se establece en 15 segundos; las transcripciones se escriben de forma síncrona, por lo que la compactación espera hasta que se complete la copia de seguridad — esto es intencional.
- Si el espacio en disco es una preocupación, canaliza a través de `gzip`: reemplaza `echo "$PAYLOAD" > "$SNAP_PATH"` con `echo "$PAYLOAD" | gzip > "${SNAP_PATH}.gz"`.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
