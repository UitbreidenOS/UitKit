---
name: "voice-input"
description: "- User says they want to speak their prompt rather than type it"
---

# Voice Input

## When to activate
- User says they want to speak their prompt rather than type it
- User asks how to use voice or dictation in Claude Code
- User asks about `/voice`, push-to-talk, or voice mode
- User wants to go hands-free while reviewing code on a second monitor
- User asks how to rebind the push-to-talk key or change the recording language

## When NOT to use
- User is in an SSH session — microphone input is not forwarded over SSH; voice is unavailable
- User authenticated with a raw API key only (no claude.ai account) — voice requires a claude.ai account
- User is working in the Claude web interface — `/voice` is a CLI-only command
- User is on Linux and has not confirmed `arecord` or `sox` is installed
- User's question is about Claude API voice features — that is a separate system unrelated to this skill

## Instructions

### Enable voice

Run inside any Claude Code session:

```
/voice        # toggle on (defaults to hold mode)
/voice hold   # hold Space to record, release to send
/voice tap    # tap Space once to start, once to stop and send
/voice off    # disable
```

### Choose the right mode

**Hold mode** — press and hold Space while speaking, release to send. Best for short-to-medium prompts. Less friction for quick questions.

**Tap mode** — tap Space once to start recording, tap again to stop and send. Best for longer dictation where holding a key is awkward.

### Persist the setting

Add to `~/.claude/settings.json`:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

This survives session restarts. Switch between `"hold"` and `"tap"` as needed.

### Rebind the push-to-talk key

The default key is Space. To change it, edit `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

Use any key that does not conflict with your normal typing. `v`, `F9`, or backtick are common choices. The binding is scoped to the `Chat` context.

### Set the transcription language

Add a `language` key at the top level of `~/.claude/settings.json`:

```json
{
  "voice": { "enabled": true, "mode": "hold" },
  "language": "fr"
}
```

Supported languages: 20 total, including `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Use BCP 47 tags.

### Linux / WSL setup

**Linux (ALSA):**
```bash
sudo apt install alsa-utils
```

**Linux (sox alternative):**
```bash
sudo apt install sox
```

**WSL:**
```bash
sudo apt install sox libsox-fmt-pulse
# WSLg must be active — update WSL from PowerShell: wsl --update
```

macOS works without any setup.

## Example

**Scenario:** A developer is refactoring a large module and wants to dictate a detailed instruction without breaking their reading flow.

1. Switch to tap mode for longer dictation:
   ```
   /voice tap
   ```

2. Tap Space to start recording, then dictate:
   > "Split the `UserController` class into three focused modules: `user-auth.ts` for login and token handling, `user-profile.ts` for CRUD on profile data, and `user-preferences.ts` for settings. Move the existing tests to match the new structure. Keep the existing public interface intact — nothing in `routes/` should need to change."

3. Tap Space again to stop. Review the transcription in the input field, make any corrections, then press Enter.

**Result:** A precise, multi-sentence prompt delivered without typing — and without losing focus on the code being read.

---
