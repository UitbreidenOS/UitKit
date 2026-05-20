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

cat > "$OUTPUT_FILE" << EOF
# Transcript: ${PROJECT}
Date: $(date '+%Y-%m-%d %H:%M:%S')
Directory: ${CWD}

---

EOF

CONVERSATION=$(echo "$INPUT" | jq -r '.conversation // empty' 2>/dev/null || true)
if [[ -n "$CONVERSATION" ]]; then
  echo "$CONVERSATION" >> "$OUTPUT_FILE"
else
  echo "$INPUT" | jq '.' >> "$OUTPUT_FILE"
fi

echo "📄 Transcript: $OUTPUT_FILE" >&2
exit 0
