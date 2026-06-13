# Hook: WhatsApp Permission Gate

Routes Claude's destructive Bash commands to your WhatsApp for remote approval. When Claude wants to run `rm`, `DROP`, `reset --hard`, or similar operations, you get a WhatsApp message. Reply `yes` to allow or `no` to block. Designed for long autonomous sessions where you step away but need veto rights over risky operations.

## Event
`PreToolUse` — fires before `Bash` tool calls, filtered to destructive command patterns

## settings.json entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/whatsapp-permission.py",
            "timeout": 360
          }
        ]
      }
    ]
  }
}
```

Set `timeout` to at least 360 (6 minutes) to allow for the 5-minute polling window plus message delivery latency.

## What it does

1. Reads `tool_input.command` from the PreToolUse payload
2. Checks if the command matches any destructive pattern (see list below)
3. If not destructive, exits 0 immediately (no WhatsApp message sent)
4. If destructive and `WHATSAPP_GATE_ENABLED` is not set, exits 0 silently (safe default)
5. Sends a WhatsApp message via Twilio WhatsApp API with the full command
6. Polls for a reply every 10 seconds for up to 5 minutes
7. Reply `yes` or `approve` → exits 0 (allow)
8. Reply `no` or `deny` → outputs block decision
9. No reply within 5 minutes → outputs block decision with timeout notice

**Destructive patterns checked:**
- `rm ` (any rm invocation)
- `rmdir`
- `drop ` (SQL DROP)
- `truncate`
- `delete from` (SQL)
- `git push.*--force`
- `git reset.*--hard`
- `git clean.*-f`
- `pkill`, `killall`
- `dd if=`
- `mkfs`
- `shred`
- `> /` (redirect to root paths)

## Script

Save to `~/.claude/hooks/whatsapp-permission.py`:

```python
#!/usr/bin/env python3
"""
WhatsApp permission gate — PreToolUse hook for Bash.
Sends destructive commands to WhatsApp for approval before execution.
"""

import json
import os
import re
import sys
import time
from datetime import datetime, timezone

# --- Configuration (set as env vars) ---
GATE_ENABLED = os.environ.get("WHATSAPP_GATE_ENABLED", "")
ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
FROM_NUMBER = os.environ.get("WHATSAPP_FROM", "")   # e.g. whatsapp:+14155238886
TO_NUMBER = os.environ.get("WHATSAPP_TO", "")       # e.g. whatsapp:+1234567890

POLL_INTERVAL = 10      # seconds between reply checks
POLL_TIMEOUT = 300      # 5 minutes total wait

DESTRUCTIVE_PATTERNS = [
    r"\brm\s+",
    r"\brmdir\b",
    r"\bdrop\s+",
    r"\btruncate\b",
    r"\bdelete\s+from\b",
    r"git\s+push.*--force",
    r"git\s+reset.*--hard",
    r"git\s+clean.*-f",
    r"\bpkill\b",
    r"\bkillall\b",
    r"\bdd\s+if=",
    r"\bmkfs\b",
    r"\bshred\b",
    r">\s*/[a-zA-Z]",
]


def is_destructive(command):
    for pattern in DESTRUCTIVE_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            return True
    return False


def send_whatsapp(message):
    """Send a WhatsApp message via Twilio. Returns message SID or None on failure."""
    try:
        import urllib.request
        import urllib.parse
        import base64

        url = f"https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json"
        data = urllib.parse.urlencode({
            "From": FROM_NUMBER,
            "To": TO_NUMBER,
            "Body": message,
        }).encode()
        credentials = base64.b64encode(f"{ACCOUNT_SID}:{AUTH_TOKEN}".encode()).decode()
        req = urllib.request.Request(
            url, data=data,
            headers={"Authorization": f"Basic {credentials}",
                     "Content-Type": "application/x-www-form-urlencoded"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = json.loads(resp.read())
            return body.get("sid")
    except Exception:
        return None


def get_latest_reply(after_timestamp):
    """Fetch the most recent inbound WhatsApp message after a given epoch time."""
    try:
        import urllib.request
        import urllib.parse
        import base64

        date_sent = datetime.utcfromtimestamp(after_timestamp).strftime("%Y-%m-%d %H:%M:%S")
        params = urllib.parse.urlencode({
            "From": TO_NUMBER,
            "To": FROM_NUMBER,
            "DateSent>": date_sent,
            "PageSize": "5",
        })
        url = (
            f"https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json?{params}"
        )
        credentials = base64.b64encode(f"{ACCOUNT_SID}:{AUTH_TOKEN}".encode()).decode()
        req = urllib.request.Request(
            url,
            headers={"Authorization": f"Basic {credentials}"},
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = json.loads(resp.read())
            messages = body.get("messages", [])
            if messages:
                return messages[0].get("body", "").strip().lower()
    except Exception:
        pass
    return None


def block(reason):
    print(json.dumps({"decision": "block", "reason": reason}))
    sys.exit(0)


def main():
    # If gate is not explicitly enabled, pass through silently
    if not GATE_ENABLED:
        sys.exit(0)

    # If Twilio is not configured, pass through silently
    if not all([ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER, TO_NUMBER]):
        sys.exit(0)

    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    command = payload.get("tool_input", {}).get("command", "")
    if not command or not is_destructive(command):
        sys.exit(0)

    # Send approval request
    send_ts = time.time()
    preview = command[:300] + ("..." if len(command) > 300 else "")
    message = (
        f"[Claude Code] Approval required\n\n"
        f"Command:\n{preview}\n\n"
        f"Reply YES to allow or NO to block.\n"
        f"Timeout: 5 minutes."
    )
    sid = send_whatsapp(message)
    if not sid:
        # Could not reach Twilio — block for safety
        block("WhatsApp gate: failed to send approval request. Command blocked for safety.")

    # Poll for reply
    deadline = send_ts + POLL_TIMEOUT
    while time.time() < deadline:
        time.sleep(POLL_INTERVAL)
        reply = get_latest_reply(send_ts)
        if reply:
            if any(word in reply for word in ("yes", "approve", "allow", "y")):
                sys.exit(0)
            if any(word in reply for word in ("no", "deny", "block", "n")):
                block("WhatsApp gate: command denied by user reply.")

    block(
        "WhatsApp gate: no reply received within 5 minutes. "
        "Command blocked. Re-run with explicit approval to proceed."
    )


if __name__ == "__main__":
    main()
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp hooks/pre-tool-use/whatsapp-permission.py ~/.claude/hooks/
chmod +x ~/.claude/hooks/whatsapp-permission.py
```

**Twilio WhatsApp sandbox setup:**

1. Create a Twilio account at [twilio.com](https://www.twilio.com/)
2. Activate the WhatsApp sandbox at **Messaging > Try it out > Send a WhatsApp message**
3. Send the join code from your phone to the sandbox number
4. Copy your Account SID and Auth Token from the Twilio console

Set environment variables (add to `~/.zshrc` or `~/.bashrc`):

```bash
export WHATSAPP_GATE_ENABLED=1
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=your_auth_token
export WHATSAPP_FROM="whatsapp:+14155238886"   # Twilio sandbox number
export WHATSAPP_TO="whatsapp:+1XXXXXXXXXX"     # your WhatsApp number
```

Add the `settings.json` entry to `~/.claude/settings.json`.

To disable the gate for a session without removing config, unset the env var:

```bash
unset WHATSAPP_GATE_ENABLED
```

The hook is entirely passive when `WHATSAPP_GATE_ENABLED` is not set, so it is safe to leave the `settings.json` entry in place permanently.

---
