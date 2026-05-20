# Hook: Environment Injector (Setup)

Injects project-specific environment variables and additional context into every Claude Code session automatically. Define once, load everywhere — without polluting your shell profile.

## What it does

- Fires on the `Setup` event (when a session starts in a directory)
- Reads from `.claude/env` in the project root (gitignored)
- Exports variables into the session environment
- Optionally injects additional context text into Claude's initial context

## settings.json entry

```json
{
  "hooks": {
    "Setup": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/env-injector.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: env-injector.sh

```bash
#!/usr/bin/env bash
# Setup hook: inject project env vars and context at session start
set -euo pipefail

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')

# Load project-level env file (.claude/env — gitignored)
ENV_FILE="$CWD/.claude/env"
if [[ -f "$ENV_FILE" ]]; then
  while IFS='=' read -r key value; do
    # Skip comments and blank lines
    [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
    export "$key=$value"
    echo "  ✓ Loaded: $key" >&2
  done < "$ENV_FILE"
  echo "📦 Environment loaded from $ENV_FILE" >&2
fi

# Load global Claude env file (~/.claude/env — personal, non-project)
GLOBAL_ENV="$HOME/.claude/env"
if [[ -f "$GLOBAL_ENV" ]]; then
  while IFS='=' read -r key value; do
    [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
    # Don't override project-level vars
    [[ -v "$key" ]] && continue
    export "$key=$value"
  done < "$GLOBAL_ENV"
fi

exit 0
```

## Project .claude/env file format

```bash
# .claude/env — project-specific env vars (gitignore this file)
DATABASE_URL=postgresql://localhost/myapp_dev
STRIPE_SECRET_KEY=sk_test_...
API_BASE_URL=http://localhost:3000

# Override Claude model for this project
ANTHROPIC_MODEL=claude-opus-4-7
```

## Setup

```bash
# Install hook
mkdir -p ~/.claude/hooks
cp env-injector.sh ~/.claude/hooks/env-injector.sh
chmod +x ~/.claude/hooks/env-injector.sh

# Create project env file (gitignore it!)
mkdir -p .claude
touch .claude/env
echo ".claude/env" >> .gitignore
```

## Gitignore rule

Always gitignore `.claude/env` — it contains secrets:
```gitignore
.claude/env
.claude/*.env
```
