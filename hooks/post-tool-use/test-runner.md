# Hook: Auto Test Runner

Automatically runs the relevant test file after Claude edits a source file. Surfaces failures immediately without requiring a manual test run.

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
            "command": "bash ~/.claude/hooks/test-runner.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: test-runner.sh

```bash
#!/usr/bin/env bash
# Post-tool-use hook: run tests for the edited file
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only fire on file edits
if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

# Skip test files themselves (avoid infinite loop)
if [[ "$FILE_PATH" == *".test."* || "$FILE_PATH" == *".spec."* ]]; then
  exit 0
fi

# Skip config files
if [[ "$FILE_PATH" == *"config"* || "$FILE_PATH" == *".json" ]]; then
  exit 0
fi

# Detect test runner
if [[ -f "package.json" ]]; then
  if grep -q '"vitest"' package.json; then
    TEST_CMD="npx vitest run --reporter=verbose"
    # Try to find a related test file
    BASE=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//')
    TEST_FILE=$(find . -name "${BASE}.test.*" -o -name "${BASE}.spec.*" 2>/dev/null | head -1)
    if [[ -n "$TEST_FILE" ]]; then
      TEST_CMD="npx vitest run $TEST_FILE --reporter=verbose"
    fi
  elif grep -q '"jest"' package.json; then
    BASE=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//')
    TEST_CMD="npx jest --testPathPattern=${BASE} --verbose"
  else
    exit 0
  fi
elif [[ -f "pyproject.toml" ]] || [[ -f "requirements.txt" ]]; then
  BASE=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//')
  TEST_CMD="python -m pytest -v -k ${BASE} 2>/dev/null || python -m pytest -v"
else
  exit 0
fi

echo "🧪 Running tests for $FILE_PATH..." >&2
if $TEST_CMD 2>&1; then
  echo "✅ Tests passed" >&2
else
  echo "❌ Tests failed — Claude Code will see these results" >&2
  exit 1
fi
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp test-runner.sh ~/.claude/hooks/test-runner.sh
chmod +x ~/.claude/hooks/test-runner.sh
```

## Behaviour

- After Claude edits `src/users.ts` → automatically runs `users.test.ts`
- After Claude edits a Python file → runs related pytest tests
- If tests fail, Claude Code sees the failure and can fix the issue
- Skips test files themselves (no infinite loop)
- Skips config and JSON files

## Customisation

Set `AUTO_TEST=false` in your environment to disable temporarily:
```bash
AUTO_TEST=false claude "refactor the users module"
```

Add to the skip list in the script for files you don't want to auto-test:
```bash
if [[ "$FILE_PATH" == *"migrations"* ]]; then exit 0; fi
```
