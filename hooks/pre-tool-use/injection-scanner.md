# Hook: Prompt Injection Scanner

Scans every tool input for prompt injection attempts, secret exfiltration patterns, and data leakage before the tool executes. Fires on `PreToolUse` across all tools.

## Event
`PreToolUse` — fires before every tool call, no matcher (covers all tools)

## settings.json entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/injection-scanner.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## What it does

Reads the full `tool_input` JSON payload from stdin and runs three scan passes:

**Injection patterns** (strings that attempt to override Claude's instructions):
- `ignore previous instructions`
- `disregard your system prompt`
- `you are now`
- `act as`
- `jailbreak`
- `DAN mode`

**Secret exfiltration patterns** (attempts to send credentials out-of-band):
- External URLs combined with env var names or API key tokens
- Write operations targeting files with names like `.env`, `credentials`, `id_rsa`
- Curl/wget commands piping output to a remote host

**Data leakage patterns** (attempts to read privileged system files):
- `/etc/passwd`, `/etc/shadow`, `/etc/hosts`
- `~/.ssh/`, `~/.aws/credentials`, `~/.npmrc`, `~/.netrc`
- `$HOME/.gnupg`, `$HOME/.config/gh`

If any pattern matches, the hook outputs a block decision and writes a structured entry to `~/.claude/injection-log.jsonl`. If no pattern matches, it exits 0 silently.

## Script

Save to `~/.claude/hooks/injection-scanner.py`:

```python
#!/usr/bin/env python3
"""
Prompt injection scanner — PreToolUse hook.
Blocks tool calls that contain injection, exfiltration, or data-leakage patterns.
"""

import json
import sys
import re
import os
from datetime import datetime, timezone

LOG_PATH = os.path.expanduser("~/.claude/injection-log.jsonl")

INJECTION_PATTERNS = [
    r"ignore\s+previous\s+instructions",
    r"disregard\s+your\s+system\s+prompt",
    r"you\s+are\s+now\b",
    r"\bact\s+as\b",
    r"\bjailbreak\b",
    r"\bDAN\s+mode\b",
    r"forget\s+all\s+previous\s+instructions",
    r"new\s+persona",
    r"override\s+safety",
]

EXFIL_PATTERNS = [
    r"(curl|wget)\s+.*\b(API_KEY|SECRET|TOKEN|PASSWORD|PASS|CREDENTIAL)\b",
    r"(curl|wget)\s+.*https?://(?!localhost|127\.0\.0\.1)",
    r">\s*(\.env|credentials|id_rsa|id_ed25519|\.npmrc|\.netrc)",
    r"(requests|urllib|http\.client).*https?://(?!localhost|127\.0\.0\.1).*\$",
]

LEAKAGE_PATTERNS = [
    r"/etc/passwd",
    r"/etc/shadow",
    r"~/\.ssh/",
    r"\$HOME/\.ssh/",
    r"~/\.aws/credentials",
    r"\$HOME/\.aws/credentials",
    r"~/\.npmrc",
    r"~/\.netrc",
    r"\$HOME/\.gnupg",
    r"\$HOME/\.config/gh",
    r"~/\.config/gh",
]

CATEGORIES = [
    ("prompt_injection", INJECTION_PATTERNS),
    ("secret_exfiltration", EXFIL_PATTERNS),
    ("data_leakage", LEAKAGE_PATTERNS),
]


def flatten_input(obj, depth=0):
    """Recursively flatten any JSON structure into a single string for scanning."""
    if depth > 10:
        return ""
    if isinstance(obj, str):
        return obj
    if isinstance(obj, dict):
        return " ".join(flatten_input(v, depth + 1) for v in obj.values())
    if isinstance(obj, list):
        return " ".join(flatten_input(i, depth + 1) for i in obj)
    return str(obj)


def write_log(tool_name, category, pattern, snippet):
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "tool": tool_name,
        "category": category,
        "matched_pattern": pattern,
        "snippet": snippet[:200],
    }
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(entry) + "\n")


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = payload.get("tool_name", "unknown")
    tool_input = payload.get("tool_input", {})
    text = flatten_input(tool_input).lower()

    for category, patterns in CATEGORIES:
        for raw_pattern in patterns:
            if re.search(raw_pattern, text, re.IGNORECASE):
                # Find a short snippet around the match
                match = re.search(raw_pattern, text, re.IGNORECASE)
                start = max(0, match.start() - 40)
                snippet = text[start : match.end() + 40]
                write_log(tool_name, category, raw_pattern, snippet)
                result = {
                    "decision": "block",
                    "reason": (
                        f"Potential {category.replace('_', ' ')} detected in '{tool_name}' "
                        f"input: pattern '{raw_pattern}' matched. "
                        f"Logged to {LOG_PATH}."
                    ),
                }
                print(json.dumps(result))
                sys.exit(0)

    sys.exit(0)


if __name__ == "__main__":
    main()
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp hooks/pre-tool-use/injection-scanner.py ~/.claude/hooks/
chmod +x ~/.claude/hooks/injection-scanner.py
```

Add the `settings.json` entry to `~/.claude/settings.json` or `.claude/settings.json`.

The log file is created automatically at `~/.claude/injection-log.jsonl` on first detection. Review it with:

```bash
cat ~/.claude/injection-log.jsonl | python3 -m json.tool
```

To tune sensitivity, edit the pattern lists at the top of the script. All patterns are standard Python `re` syntax with `IGNORECASE`.

---
