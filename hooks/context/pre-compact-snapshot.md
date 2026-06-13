# Hook: Pre-Compact Snapshot

Fires on `PreCompact` to back up the full conversation transcript before Claude Code summarises and truncates it. Gives you a recoverable record of everything said in the session, even after compaction discards the original messages.

## What it does

Reads the `PreCompact` payload (which contains the transcript to be compacted) from stdin and writes it as a timestamped JSON file in `.claude/snapshots/`. The file is named by session ID and timestamp so multiple compaction events within a session each produce a unique file.

Example snapshot path:
```
.claude/snapshots/session-abc123-2026-06-03T10-30-00Z.json
```

After writing, the script also appends a one-line index entry to `.claude/snapshots/index.log` so you can find previous snapshots without listing the directory:
```
2026-06-03T10:30:00Z  session=abc123  file=session-abc123-2026-06-03T10-30-00Z.json  turns=87
```

## When it fires

`PreCompact` — fires immediately before Claude Code runs its compaction/summarisation step, while the full transcript is still available in the payload.

## settings.json entry

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

Raise `timeout` if you have very long transcripts (>500 turns) and the write takes longer than 15 seconds.

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

## Setup

```bash
cp hooks/context/pre-compact-snapshot.sh .claude/hooks/
chmod +x .claude/hooks/pre-compact-snapshot.sh
mkdir -p .claude/snapshots
```

Add `.claude/snapshots/` to `.gitignore` — snapshots can be large and contain conversational content you do not want committed.

## Notes

- Snapshots are JSON; open any file in a text editor or use `jq` to extract specific turns: `jq '.messages[] | select(.role=="user")' snapshot.json`.
- The 20-snapshot retention cap per session prevents unbounded disk use on very long sessions with frequent compactions. Adjust the cap in the script as needed.
- Timeout is set to 15 seconds; transcripts are written synchronously so the compaction waits until the backup completes — this is intentional.
- If disk space is a concern, pipe through `gzip`: replace `echo "$PAYLOAD" > "$SNAP_PATH"` with `echo "$PAYLOAD" | gzip > "${SNAP_PATH}.gz"`.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
