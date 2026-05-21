# Hook: Multi-Agent Communication Bus

Enables real-time @-mention messaging between concurrent subagents via a shared message bus file. Agents post messages to each other without returning to the parent, letting parallel subagents coordinate on findings mid-run.

## Event
`PostToolUse` — fires after every tool call, no matcher (covers all tools)

## settings.json entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/agent-comms.py",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## What it does

After each tool call, the hook does two things:

1. **Outbox scan** — reads `tool_output` from the PostToolUse payload and searches for `@agent-name: message` patterns. Any matches are appended to the shared message bus at `.claude/agent-messages.jsonl`.

2. **Inbox delivery** — reads all pending messages in the bus addressed to the current agent (matched via the `CLAUDE_AGENT_NAME` env var) that have not yet been marked `delivered`. Returns them as a context injection so Claude sees them before its next action.

**Message bus file:** `.claude/agent-messages.jsonl` (project-local, append-only)

**Agent identity:** set the `CLAUDE_AGENT_NAME` env var before launching a subagent session (e.g., `CLAUDE_AGENT_NAME=security-auditor`). Agents without this var set default to `default`.

**@-mention syntax** (inside any tool output or Claude response):

```
@code-reviewer: Found SQL injection in auth.ts line 45 — check before merging
@test-runner: Please re-run the auth suite, I patched token.ts
```

Messages are delivered once and marked `delivered: true` to avoid re-injection on subsequent tool calls.

## Script

Save to `~/.claude/hooks/agent-comms.py`:

```python
#!/usr/bin/env python3
"""
Multi-agent communication bus — PostToolUse hook.
Scans tool output for @-mentions and delivers pending inbox messages.
"""

import json
import sys
import os
import re
from datetime import datetime, timezone

BUS_PATH = os.path.join(
    os.environ.get("CLAUDE_PROJECT_DIR", "."), ".claude", "agent-messages.jsonl"
)

MENTION_RE = re.compile(r"@([\w-]+):\s*(.+?)(?=\n@|\Z)", re.DOTALL)

CURRENT_AGENT = os.environ.get("CLAUDE_AGENT_NAME", "default")


def read_bus():
    if not os.path.exists(BUS_PATH):
        return []
    entries = []
    with open(BUS_PATH) as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return entries


def write_bus(entries):
    os.makedirs(os.path.dirname(BUS_PATH), exist_ok=True)
    with open(BUS_PATH, "w") as f:
        for entry in entries:
            f.write(json.dumps(entry) + "\n")


def append_message(sender, recipient, message):
    entry = {
        "id": f"{int(datetime.now(timezone.utc).timestamp() * 1000)}",
        "from": sender,
        "to": recipient,
        "message": message.strip(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "delivered": False,
    }
    os.makedirs(os.path.dirname(BUS_PATH), exist_ok=True)
    with open(BUS_PATH, "a") as f:
        f.write(json.dumps(entry) + "\n")


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_output = payload.get("tool_output", "")
    if not isinstance(tool_output, str):
        tool_output = json.dumps(tool_output)

    # --- Outbox: scan output for @-mentions and post to bus ---
    for match in MENTION_RE.finditer(tool_output):
        recipient = match.group(1)
        message = match.group(2)
        append_message(CURRENT_AGENT, recipient, message)

    # --- Inbox: collect undelivered messages for this agent ---
    entries = read_bus()
    pending = [e for e in entries if e.get("to") == CURRENT_AGENT and not e.get("delivered")]

    if not pending:
        sys.exit(0)

    # Mark as delivered
    for entry in entries:
        if entry.get("to") == CURRENT_AGENT and not entry.get("delivered"):
            entry["delivered"] = True
    write_bus(entries)

    # Return pending messages as context injection
    lines = []
    for msg in pending:
        lines.append(f"[Agent message from @{msg['from']} at {msg['timestamp']}]: {msg['message']}")
    context_block = "\n".join(lines)

    result = {"context": context_block}
    print(json.dumps(result))
    sys.exit(0)


if __name__ == "__main__":
    main()
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp hooks/post-tool-use/agent-comms.py ~/.claude/hooks/
chmod +x ~/.claude/hooks/agent-comms.py
```

Add the `settings.json` entry to `~/.claude/settings.json` or `.claude/settings.json`.

When launching subagents, set the agent identity:

```bash
CLAUDE_AGENT_NAME=security-auditor claude ...
CLAUDE_AGENT_NAME=code-reviewer claude ...
```

The bus file (`.claude/agent-messages.jsonl`) is project-local. Add it to `.gitignore` for ephemeral sessions, or commit it for persistent cross-session relay.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
