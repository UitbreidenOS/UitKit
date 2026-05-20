# Hook: TTS Voice Announcer

Speaks Claude's final message aloud when a session completes. Never have to watch the terminal — just listen for the audio cue.

## What it does

- Fires on the `Stop` event (when Claude finishes a task)
- Reads Claude's last message aloud using system text-to-speech
- Falls back gracefully: macOS `say` → Linux `espeak` → Python `pyttsx3`
- Privacy-first: off by default for the message text, always announces completion

## settings.json entry

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/tts-announcer.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: tts-announcer.sh

```bash
#!/usr/bin/env bash
# Stop hook: speak Claude's completion status aloud
set -euo pipefail

INPUT=$(cat)
STOP_REASON=$(echo "$INPUT" | jq -r '.stop_reason // "completed"')

# Build the announcement
case "$STOP_REASON" in
  "end_turn")    MSG="Claude has finished." ;;
  "tool_use")    MSG="Claude is waiting for your input." ;;
  "max_tokens")  MSG="Claude reached the token limit." ;;
  *)             MSG="Claude session ended." ;;
esac

# Optionally read the last message (set CLAUDE_TTS_FULL=true to enable)
if [[ "${CLAUDE_TTS_FULL:-false}" == "true" ]]; then
  LAST_MSG=$(echo "$INPUT" | jq -r '.last_message // ""' | head -c 200)
  [[ -n "$LAST_MSG" ]] && MSG="$LAST_MSG"
fi

# Speak using best available TTS
if command -v say &>/dev/null; then
  say "$MSG"                          # macOS
elif command -v espeak &>/dev/null; then
  espeak "$MSG" 2>/dev/null           # Linux
elif python3 -c "import pyttsx3" 2>/dev/null; then
  python3 -c "import pyttsx3; e=pyttsx3.init(); e.say('$MSG'); e.runAndWait()"
fi

exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp tts-announcer.sh ~/.claude/hooks/tts-announcer.sh
chmod +x ~/.claude/hooks/tts-announcer.sh

# macOS — no extra install needed (uses built-in `say`)

# Linux — install espeak
sudo apt install espeak    # Ubuntu/Debian
sudo dnf install espeak    # Fedora

# Python fallback (any platform)
pip install pyttsx3
```

## Configuration

```bash
# Speak the actual last message (not just status) — add to ~/.zshrc
export CLAUDE_TTS_FULL=true

# Disable temporarily for a session
CLAUDE_TTS_FULL=false claude "..."
```

## Combining with ntfy

Use TTS for nearby alerts and ntfy for phone alerts when you step away — they don't conflict.
