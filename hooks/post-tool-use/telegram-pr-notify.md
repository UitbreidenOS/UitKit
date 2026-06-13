# Telegram PR Notification Hook

Sends a Telegram message whenever Claude creates a GitHub pull request via `gh pr create`. The message includes the PR URL and a computed Vercel preview URL derived from the branch name.

---

## What it does

After every Bash tool call, the hook inspects the command string. If it contained `gh pr create`, it extracts the PR URL from the tool output and constructs a Vercel preview URL by slugifying the branch name. A Telegram message is dispatched via Bot API. No message is sent for any other Bash commands.

**Fires on:** `PostToolUse` — `Bash`

---

## settings.json

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{"type": "command", "command": "python3 ~/.claude/hooks/telegram-pr-notify.py"}]
    }]
  }
}
```

---

## Script: `~/.claude/hooks/telegram-pr-notify.py`

```python
#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
import urllib.request
import urllib.parse

def slugify_branch(branch: str) -> str:
    """Convert branch name to Vercel-style slug: lowercase, / and _ become -."""
    slug = branch.lower()
    slug = re.sub(r"[/_]", "-", slug)
    slug = re.sub(r"[^a-z0-9-]", "", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug

def get_repo_name() -> str:
    try:
        remote = subprocess.check_output(
            ["git", "remote", "get-url", "origin"],
            stderr=subprocess.DEVNULL, text=True
        ).strip()
        # Handle both HTTPS and SSH remotes
        name = remote.rstrip("/").split("/")[-1]
        if name.endswith(".git"):
            name = name[:-4]
        return name
    except Exception:
        return "repo"

def get_current_branch() -> str:
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            stderr=subprocess.DEVNULL, text=True
        ).strip()
    except Exception:
        return "main"

def extract_pr_url(text: str) -> str | None:
    match = re.search(r"https://github\.com/[^\s]+/pull/\d+", text)
    return match.group(0) if match else None

def send_telegram(token: str, chat_id: str, text: str) -> None:
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False,
    }).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req, timeout=10)

def main():
    raw = sys.stdin.read()
    if not raw.strip():
        sys.exit(0)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_input = data.get("tool_input", {})
    tool_output = data.get("tool_response", {})

    command = tool_input.get("command", "")
    if "gh pr create" not in command:
        sys.exit(0)

    output_text = ""
    if isinstance(tool_output, dict):
        output_text = tool_output.get("output", "") or tool_output.get("stdout", "")
    elif isinstance(tool_output, str):
        output_text = tool_output

    pr_url = extract_pr_url(output_text)
    if not pr_url:
        sys.exit(0)

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")
    if not token or not chat_id:
        sys.exit(0)

    repo = get_repo_name()
    branch = get_current_branch()
    branch_slug = slugify_branch(branch)
    vercel_url = f"https://{repo}-git-{branch_slug}.vercel.app"

    message = (
        f"*PR Created*\n"
        f"{pr_url}\n\n"
        f"Preview: {vercel_url}"
    )

    try:
        send_telegram(token, chat_id, message)
    except Exception as e:
        # Do not block Claude — log and exit cleanly
        print(f"telegram-pr-notify: failed to send message: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()
```

---

## Setup

**1. Create a Telegram bot**

Open [@BotFather](https://t.me/BotFather), run `/newbot`, follow the prompts, and copy the bot token.

**2. Get your chat ID**

Send any message to your new bot, then visit:
```
https://api.telegram.org/bot<TOKEN>/getUpdates
```
The `chat.id` field in the response is your chat ID.

**3. Set environment variables in Claude settings**

Add to `~/.claude/settings.json`:

```json
{
  "env": {
    "TELEGRAM_BOT_TOKEN": "your-bot-token-here",
    "TELEGRAM_CHAT_ID": "your-chat-id-here"
  }
}
```

**4. Install the script**

```bash
cp telegram-pr-notify.py ~/.claude/hooks/telegram-pr-notify.py
chmod +x ~/.claude/hooks/telegram-pr-notify.py
```

**5. Add the hook**

Add the `settings.json` snippet to your global `~/.claude/settings.json` or a project-level `.claude/settings.json`.

---

## Notes

- The Vercel URL is computed heuristically from the repo name and branch slug. If your Vercel project name differs from the repo name, edit `get_repo_name()` to return a hardcoded value.
- The hook never blocks Claude — failures are written to stderr and the process exits 0.
- For group chats, the chat ID is negative (e.g., `-1001234567890`).

---
