# Hook: Sound Notification System

Plays platform-native sounds for Claude Code hook events. Covers all five hookable event types with configurable per-event sound mapping. Supports macOS (`afplay`), Linux (PulseAudio `paplay` / ALSA `aplay`), and Windows (`winsound`). Team defaults live in `sound-config.json`; personal overrides go in `sound-config.local.json` (gitignored).

## Events
`SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`, `Notification` — fires on each event, passing the event name as `argv[1]`

## settings.json entry

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/sound-system.py SessionStart"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/sound-system.py Stop"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/sound-system.py PreToolUse"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/sound-system.py PostToolUse"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/sound-system.py Notification"
          }
        ]
      }
    ]
  }
}
```

## What it does

Reads the event name from `argv[1]`, looks it up in the merged config (`sound-config.json` + `sound-config.local.json`), and plays the mapped sound asynchronously (subprocess, no wait). Writes an audit entry to `~/.claude/hooks/sound-log.jsonl`. Never crashes — if the sound file is missing or the player is not installed, the hook exits 0 silently.

**macOS sounds** (located at `/System/Library/Sounds/`): Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink

**Linux**: `paplay` uses `.ogg` or `.wav` from `/usr/share/sounds/`. Fall back to `aplay` for raw `.wav` files. Paths are set directly in the config.

**Windows**: `winsound.MessageBeep` constants: `MB_OK` (0), `MB_ICONINFORMATION` (64), `MB_ICONWARNING` (48), `MB_ICONERROR` (16), `MB_ICONQUESTION` (32).

## Script

Save to `~/.claude/hooks/sound-system.py`:

```python
#!/usr/bin/env python3
"""
Sound notification system — multi-event hook.
Plays platform-native audio for each Claude Code hook event.
"""

import json
import os
import sys
import subprocess
from datetime import datetime, timezone

HOOKS_DIR = os.path.expanduser("~/.claude/hooks")
CONFIG_PATH = os.path.join(HOOKS_DIR, "sound-config.json")
CONFIG_LOCAL_PATH = os.path.join(HOOKS_DIR, "sound-config.local.json")
LOG_PATH = os.path.join(HOOKS_DIR, "sound-log.jsonl")

MACOS_SOUNDS_DIR = "/System/Library/Sounds"

DEFAULT_CONFIG = {
    "SessionStart": "Glass",
    "Stop": "Hero",
    "PreToolUse": "Tink",
    "PostToolUse": "Pop",
    "Notification": "Purr",
}


def load_config():
    cfg = dict(DEFAULT_CONFIG)
    for path in (CONFIG_PATH, CONFIG_LOCAL_PATH):
        if os.path.exists(path):
            try:
                with open(path) as f:
                    overrides = json.load(f)
                cfg.update(overrides)
            except (json.JSONDecodeError, OSError):
                pass
    return cfg


def write_log(event, sound, played):
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": event,
        "sound": sound,
        "played": played,
    }
    os.makedirs(HOOKS_DIR, exist_ok=True)
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(entry) + "\n")


def play_macos(sound_name):
    path = os.path.join(MACOS_SOUNDS_DIR, f"{sound_name}.aiff")
    if not os.path.exists(path):
        return False
    subprocess.Popen(["afplay", path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return True


def play_linux(sound_name):
    # sound_name may be a bare name or a full path
    candidates = []
    if os.path.isabs(sound_name):
        candidates.append(sound_name)
    else:
        candidates += [
            f"/usr/share/sounds/freedesktop/stereo/{sound_name}.oga",
            f"/usr/share/sounds/freedesktop/stereo/{sound_name}.ogg",
            f"/usr/share/sounds/{sound_name}.wav",
            f"/usr/share/sounds/{sound_name}.ogg",
        ]
    for path in candidates:
        if os.path.exists(path):
            for player in (["paplay", path], ["aplay", path]):
                try:
                    subprocess.Popen(
                        player, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
                    )
                    return True
                except FileNotFoundError:
                    continue
    return False


def play_windows(sound_name):
    try:
        import winsound  # type: ignore

        mapping = {
            "MB_OK": 0,
            "MB_ICONINFORMATION": 64,
            "MB_ICONWARNING": 48,
            "MB_ICONERROR": 16,
            "MB_ICONQUESTION": 32,
        }
        beep_type = mapping.get(sound_name, 0)
        winsound.MessageBeep(beep_type)
        return True
    except Exception:
        return False


def play_sound(sound_name):
    platform = sys.platform
    try:
        if platform == "darwin":
            return play_macos(sound_name)
        elif platform.startswith("linux"):
            return play_linux(sound_name)
        elif platform == "win32":
            return play_windows(sound_name)
    except Exception:
        pass
    return False


def main():
    event = sys.argv[1] if len(sys.argv) > 1 else "Unknown"
    cfg = load_config()
    sound = cfg.get(event)

    if not sound:
        sys.exit(0)

    played = play_sound(sound)
    write_log(event, sound, played)
    sys.exit(0)


if __name__ == "__main__":
    main()
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp hooks/notification/sound-system.py ~/.claude/hooks/
chmod +x ~/.claude/hooks/sound-system.py
```

Create `~/.claude/hooks/sound-config.json` with your team defaults:

```json
{
  "SessionStart": "Glass",
  "Stop": "Hero",
  "PreToolUse": "Tink",
  "PostToolUse": "Pop",
  "Notification": "Purr"
}
```

Optionally create `~/.claude/hooks/sound-config.local.json` for personal overrides (add to `.gitignore`):

```json
{
  "Stop": "Sosumi"
}
```

Add the `settings.json` block to `~/.claude/settings.json`. The hook fires asynchronously — it does not block Claude's execution. Review the audit log with:

```bash
tail -f ~/.claude/hooks/sound-log.jsonl | python3 -m json.tool
```

---
