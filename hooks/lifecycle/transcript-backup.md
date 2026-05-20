# Hook: Transcript Backup (PreCompact)

Saves the full conversation transcript to a local file before Claude Code compresses the context window. Never lose important decisions, code snippets, or reasoning from a long session.

## What it does

- Fires on the `PreCompact` event (just before context compression)
- Saves the complete conversation to `~/.claude/transcripts/YYYY-MM-DD-HH-MM.md`
- Creates a searchable archive of all your Claude Code sessions
- Runs silently — never blocks or delays the compaction

## settings.json entry

```json
{
  "hooks": {
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/transcript-backup.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: transcript-backup.sh

```bash
#!/usr/bin/env bash
# PreCompact hook: save conversation transcript before context compression
set -euo pipefail

INPUT=$(cat)
TIMESTAMP=$(date '+%Y-%m-%d-%H-%M-%S')
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PROJECT=$(basename "$CWD")

TRANSCRIPT_DIR="$HOME/.claude/transcripts"
mkdir -p "$TRANSCRIPT_DIR"

OUTPUT_FILE="$TRANSCRIPT_DIR/${TIMESTAMP}-${PROJECT}.md"

# Write transcript header
cat > "$OUTPUT_FILE" << EOF
# Transcript: ${PROJECT}
Date: $(date '+%Y-%m-%d %H:%M:%S')
Working directory: ${CWD}

---

EOF

# Append conversation if available
CONVERSATION=$(echo "$INPUT" | jq -r '.conversation // empty' 2>/dev/null)
if [[ -n "$CONVERSATION" ]]; then
  echo "$CONVERSATION" >> "$OUTPUT_FILE"
else
  # Fallback: save the raw input for inspection
  echo "$INPUT" | jq '.' >> "$OUTPUT_FILE"
fi

echo "📄 Transcript saved: $OUTPUT_FILE" >&2
exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks ~/.claude/transcripts
cp transcript-backup.sh ~/.claude/hooks/transcript-backup.sh
chmod +x ~/.claude/hooks/transcript-backup.sh
```

## Searching transcripts

```bash
# Find all transcripts for a project
ls ~/.claude/transcripts/ | grep "my-project"

# Search across all transcripts for a specific decision
grep -r "decision\|chose\|architecture" ~/.claude/transcripts/

# View the most recent transcript
ls -t ~/.claude/transcripts/ | head -1 | xargs -I{} cat ~/.claude/transcripts/{}
```

## Disk space

Each transcript is typically 20-200KB of text. At 10 sessions/day, expect ~500MB/year.
Add a cleanup cron to keep only the last 90 days:
```bash
# Add to crontab (crontab -e)
0 0 * * 0 find ~/.claude/transcripts -mtime +90 -delete
```
