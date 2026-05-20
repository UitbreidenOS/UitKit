# Hook: Lint Check Before Write

Runs the project linter on files before Claude writes them. Surfaces lint errors immediately so Claude can fix them in the same operation rather than discovering them later.

## settings.json entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/lint-check.sh"
          }
        ]
      }
    ]
  }
}
```

Note: This runs POST tool use (after the write) to catch issues Claude introduced.

## Hook script: lint-check.sh

```bash
#!/usr/bin/env bash
# Post-tool-use hook: run linter on edited files
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check Edit and Write operations
if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

# Skip non-source files
if [[ "$FILE_PATH" == *".md" || "$FILE_PATH" == *".json" || "$FILE_PATH" == *".yaml" || "$FILE_PATH" == *".yml" ]]; then
  exit 0
fi

# Skip if no file path
if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Detect linter based on file type and project config
EXT="${FILE_PATH##*.}"

if [[ "$EXT" == "ts" || "$EXT" == "tsx" || "$EXT" == "js" || "$EXT" == "jsx" ]]; then
  if command -v npx &>/dev/null && [[ -f ".eslintrc*" || -f "eslint.config*" ]]; then
    echo "🔍 Linting $FILE_PATH..." >&2
    if ! npx eslint "$FILE_PATH" --max-warnings=0 2>&1; then
      echo "⚠️  Lint errors found in $FILE_PATH — Claude Code will see these" >&2
      exit 1
    fi
    echo "✅ Lint passed" >&2
  fi
elif [[ "$EXT" == "py" ]]; then
  if command -v ruff &>/dev/null; then
    echo "🔍 Linting $FILE_PATH..." >&2
    if ! ruff check "$FILE_PATH" 2>&1; then
      echo "⚠️  Lint errors found" >&2
      exit 1
    fi
    echo "✅ Lint passed" >&2
  fi
fi

exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp lint-check.sh ~/.claude/hooks/lint-check.sh
chmod +x ~/.claude/hooks/lint-check.sh
```

## Behaviour

- After Claude edits a TypeScript/JavaScript file → runs ESLint
- After Claude edits a Python file → runs Ruff
- Lint errors are returned to Claude Code → Claude sees them and can fix
- Skips markdown, JSON, YAML files (no lint needed)
- Skips if no linter config detected in the project

## Disable temporarily

```bash
# Set in your shell before starting Claude Code
CLAUDE_SKIP_LINT=1 claude "quick fix"
```

Add to the hook script:
```bash
if [[ "${CLAUDE_SKIP_LINT:-false}" == "1" ]]; then exit 0; fi
```
