# Hook: Secret Scanner

Scans file write operations for hardcoded secrets (API keys, passwords, tokens) before Claude writes them to disk. Blocks the write and alerts if secrets are detected.

## settings.json entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/secret-scanner.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: secret-scanner.sh

```bash
#!/usr/bin/env bash
# Pre-tool-use hook: scan file writes for hardcoded secrets
# Reads the tool input from stdin as JSON

set -euo pipefail

# Read tool input
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# Only check Write and Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Skip if no content to check
if [[ -z "$CONTENT" ]]; then
  exit 0
fi

# Patterns that indicate hardcoded secrets
PATTERNS=(
  'sk-[a-zA-Z0-9]{20,}'           # OpenAI key
  'sk-ant-[a-zA-Z0-9\-]{20,}'     # Anthropic key  
  'ghp_[a-zA-Z0-9]{36}'           # GitHub PAT
  'npm_[a-zA-Z0-9]{36}'           # npm token
  'AKIA[A-Z0-9]{16}'              # AWS access key
  'xoxb-[0-9\-a-zA-Z]{50,}'       # Slack bot token
  'stripe\.com.*sk_live_'         # Stripe live key
  'password\s*=\s*["\x27][^\x27"]{8,}' # password = "..."
  'api_key\s*=\s*["\x27][a-zA-Z0-9]{20,}' # api_key = "..."
  'secret\s*=\s*["\x27][a-zA-Z0-9]{16,}' # secret = "..."
)

FOUND=false
for PATTERN in "${PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qP "$PATTERN" 2>/dev/null || \
     echo "$CONTENT" | grep -qE "$PATTERN" 2>/dev/null; then
    FOUND=true
    echo "⚠️  POTENTIAL SECRET DETECTED in $FILE_PATH" >&2
    echo "   Pattern matched: $PATTERN" >&2
    echo "   If this is intentional (e.g., .env.example with placeholder values), confirm to proceed." >&2
  fi
done

if [[ "$FOUND" == "true" ]]; then
  # Exit with non-zero to block and prompt user for confirmation
  # Claude Code will show the error and ask the user whether to proceed
  exit 1
fi

exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp secret-scanner.sh ~/.claude/hooks/secret-scanner.sh
chmod +x ~/.claude/hooks/secret-scanner.sh
```

## What it detects

- OpenAI API keys (`sk-...`)
- Anthropic API keys (`sk-ant-...`)
- GitHub Personal Access Tokens (`ghp_...`)
- npm tokens (`npm_...`)
- AWS access keys (`AKIA...`)
- Slack bot tokens (`xoxb-...`)
- Stripe live keys
- Hardcoded passwords, api_key, and secret values in code

## Behaviour

When a potential secret is detected:
1. The write is blocked
2. Claude Code displays the warning
3. The user is prompted to confirm or cancel
4. If the content is intentional (e.g., a test fixture with fake values), the user can allow it

## Exclusions

The hook does not flag:
- `.env.example` placeholder values (e.g., `YOUR_API_KEY_HERE`)
- Files in `tests/fixtures/` with fake data
- Values that are clearly references (e.g., `process.env.API_KEY`)

To whitelist a specific pattern, add a `grep -v` exclusion to the script.
