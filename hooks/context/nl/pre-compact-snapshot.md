# Hook: Pre-Compact Snapshot

Activateert bij `PreCompact` om een back-up te maken van het volledige gespreksverloop voordat Claude Code het samenvatten en inkorten. Dit geeft je een herstelpunt van alles wat in de sessie is gezegd, zelfs nadat compactie de oorspronkelijke berichten heeft verwijderd.

## Wat het doet

Leest de `PreCompact` payload (die het gespreksverloop bevat dat moet worden gecomprimeerd) van stdin en schrijft het als een JSON-bestand met tijdstempel in `.claude/snapshots/`. Het bestand krijgt een naam op basis van session-ID en tijdstempel, zodat meerdere compressiegebeurtenissen binnen een sessie elk een uniek bestand opleveren.

Voorbeeld snapshotpad:
```
.claude/snapshots/session-abc123-2026-06-03T10-30-00Z.json
```

Na het schrijven voegt het script ook een eenregelige index-ingang toe aan `.claude/snapshots/index.log`, zodat je eerdere snapshots kunt vinden zonder de directory op te sommen:
```
2026-06-03T10:30:00Z  session=abc123  file=session-abc123-2026-06-03T10-30-00Z.json  turns=87
```

## Wanneer het activateert

`PreCompact` — activeert onmiddellijk voordat Claude Code zijn compactie-/samenvattingsstap uitvoert, terwijl het volledige gespreksverloop nog beschikbaar is in de payload.

## settings.json ingang

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

Verhoog `timeout` als je zeer lange gespreksverslagen hebt (>500 beurten) en het schrijven langer dan 15 seconden duurt.

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

## Installatie

```bash
cp hooks/context/pre-compact-snapshot.sh .claude/hooks/
chmod +x .claude/hooks/pre-compact-snapshot.sh
mkdir -p .claude/snapshots
```

Voeg `.claude/snapshots/` toe aan `.gitignore` — snapshots kunnen groot zijn en bevatten gespreksinhoud die je niet wilt committen.

## Opmerkingen

- Snapshots zijn JSON; open elk bestand in een teksteditor of gebruik `jq` om specifieke beurten uit te pakken: `jq '.messages[] | select(.role=="user")' snapshot.json`.
- Het retentielimiete van 20 snapshots per sessie voorkomt onbeperkt schijfgebruik bij zeer lange sessies met frequent compactie. Pas het limiete in het script naar behoefte aan.
- Timeout is ingesteld op 15 seconden; gespreksverslagen worden synchroon geschreven, dus de compactie wacht totdat de back-up is voltooid — dit is opzettelijk.
- Als schijfruimte een probleem is, pipe via `gzip`: vervang `echo "$PAYLOAD" > "$SNAP_PATH"` door `echo "$PAYLOAD" | gzip > "${SNAP_PATH}.gz"`.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
