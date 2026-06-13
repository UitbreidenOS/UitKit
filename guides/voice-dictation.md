# Voice Dictation in Claude Code

Voice dictation lets you speak prompts instead of typing them. It is a first-class feature of the Claude Code CLI — not a plugin, not a third-party integration. The transcription runs through Anthropic's servers, which means it requires a claude.ai account and will not work with an API key alone.

---

## Prerequisites

**Account requirement:** Voice dictation requires a claude.ai account linked to your Claude Code session. If you authenticated with a raw API key only, voice is unavailable.

**Platform support:**

| Platform | Status | Setup |
|---|---|---|
| macOS | Works out of the box | Nothing needed |
| Linux | Requires audio tool | Install `arecord` (ALSA) or `sox` |
| WSL | Requires WSLg + audio | Install `sox libsox-fmt-pulse`; WSLg must be active |
| SSH session | Not supported | Use local terminal only |
| Web interface | Not supported | CLI only |

**Linux setup:**
```bash
# Debian/Ubuntu — ALSA
sudo apt install alsa-utils

# Debian/Ubuntu — sox (alternative, also required for WSL)
sudo apt install sox libsox-fmt-pulse

# Fedora
sudo dnf install sox
```

**WSL setup:**
```bash
sudo apt install sox libsox-fmt-pulse
# Confirm WSLg is active — run from PowerShell:
# wsl --update
```

---

## Enabling Voice Dictation

Toggle voice on from inside any Claude Code session:

```
/voice
```

This enables voice in the default mode (`hold`). To switch modes explicitly:

```
/voice hold   # hold Space to record, release to send
/voice tap    # tap Space once to start, tap once again to send
/voice off    # disable voice
```

**Hold mode** is the default and works well for dictating natural-length prompts — press and hold Space, speak, release when done. The prompt is sent immediately on release.

**Tap mode** is better for longer dictation where you do not want to hold a key. Tap Space once to start recording, tap again when finished.

---

## Persistent Configuration

Set voice preferences in `~/.claude/settings.json` so they persist across sessions:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Valid values for `mode`: `"hold"` or `"tap"`. Set `enabled: false` to disable voice by default without removing the config.

---

## Rebinding the Push-to-Talk Key

The default recording key is Space, controlled by `$VOICE_PUSH_TO_TALK_KEY`. To rebind, edit `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

The binding lives in the `Chat` context. Any single key or key combination supported by the keybindings system works here. Space is convenient but collides with normal text input — some developers prefer `v` or `F9` to avoid accidental activations.

---

## Language Support

Claude Code voice supports 20 languages. Switch the transcription language via the `language` key in user settings:

```json
{
  "voice": {
    "enabled": true,
    "mode": "hold"
  },
  "language": "fr"
}
```

The `language` setting is a BCP 47 language tag. Examples: `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Set this at the user level (`~/.claude/settings.json`), not per-project.

---

## How Transcription Works

When you release the push-to-talk key (hold mode) or tap to stop (tap mode), the recorded audio is streamed to Anthropic's transcription servers. The returned text is placed into the prompt input field exactly as if you had typed it. You can edit the transcription before Claude processes it — it does not auto-submit unless you configure it to.

This means voice does not bypass normal Claude Code session flow. Hooks, permissions, and tool approval prompts all behave identically to typed input.

---

## Practical Usage Patterns

**Dictating long refactor requests:** Switch to tap mode, tap Space, describe the full refactor in natural language ("Extract the database connection logic from `server.ts` into a dedicated `db/connection.ts` module, update all imports, add a connection pool with max 10 connections"), tap again. Review the transcription, hit Enter.

**Hands-free review while reading:** Open a file on a second monitor, read through the code, and dictate observations without switching keyboard focus. Voice works during active Claude sessions — Claude does not need to be idle.

**Iterating quickly on prompts:** Use hold mode for short follow-up questions. Hold Space, say "Why did you choose that approach?", release. Faster than typing for short questions.

**Pair with `/btw` for side questions:** Voice works with `/btw` as well. Hold Space after typing `/btw ` and dictate the question — transcription fills in after the command prefix.

---

## Limitations

- SSH sessions cannot use voice — microphone input is not forwarded over SSH. Use a local terminal.
- API-key-only authentication will not unlock voice. The feature is gated to claude.ai account sessions.
- The web interface at claude.ai has its own voice features, separate from the CLI — `/voice` is a CLI-only command.
- Transcription accuracy degrades in noisy environments. The audio is sent as-is; there is no noise cancellation in the client.
- Multi-speaker dictation is not supported — the model assumes a single speaker.

---
