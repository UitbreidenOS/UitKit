#!/bin/bash

# recursive-reflection.sh
# Intercepts edits, runs test suites, and forces a structured reflection/self-heal on failure.

TOOL_NAME="$1"
TOOL_ARGS="$2"

# Only care about file modification tools
if [[ "$TOOL_NAME" != "Replace" && "$TOOL_NAME" != "WriteFile" ]]; then
  exit 0
fi

# Extract the file path
FILE_PATH=$(echo "$TOOL_ARGS" | grep -o '"file_path": *"[^"]*"' | cut -d'"' -f4)

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

TEST_CMD=""
SUITE_NAME=""

# Detect test configuration based on codebase
if [[ "$FILE_PATH" == *.ts || "$FILE_PATH" == *.tsx || "$FILE_PATH" == *.js || "$FILE_PATH" == *.jsx ]]; then
  if [ -f "package.json" ]; then
    if grep -q '"test"' package.json; then
      TEST_CMD="npm test"
      SUITE_NAME="NodeJS/Jest"
    fi
  fi
elif [[ "$FILE_PATH" == *.py ]]; then
  if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    if command -v pytest &> /dev/null; then
      TEST_CMD="pytest"
      SUITE_NAME="Python/Pytest"
    elif python -m pytest --version &> /dev/null; then
      TEST_CMD="python -m pytest"
      SUITE_NAME="Python/Pytest"
    fi
  fi
elif [[ "$FILE_PATH" == *.rs ]]; then
  if [ -f "Cargo.toml" ]; then
    TEST_CMD="cargo test"
    SUITE_NAME="Rust/Cargo"
  fi
elif [[ "$FILE_PATH" == *.go ]]; then
  if [ -f "go.mod" ]; then
    TEST_CMD="go test ./..."
    SUITE_NAME="Go/Testing"
  fi
fi

if [[ -n "$TEST_CMD" ]]; then
  echo "🧪 Running tests under $SUITE_NAME for edited file: $FILE_PATH..."
  
  # Run test suite and capture output
  OUTPUT=$($TEST_CMD 2>&1)
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -ne 0 ]; then
    echo "⚖️ JUDGE AUDIT FAILURE DETECTED ⚖️"
    echo "=================================================="
    echo "$OUTPUT" | tail -n 40
    echo "=================================================="
    echo "Claude Reflection Prompt:"
    echo "The code you just wrote caused test suite failures. Perform the following steps:"
    echo "1. REFLECT: Analyze the exact test output and stack trace above."
    echo "2. DIAGNOSE: State the logic error, typo, or regression you introduced."
    echo "3. HEAL: Modify the implementation to resolve the failing assertions."
    echo "Do not complete the task until all tests pass."
    
    # Exiting with 0 so the hook prints the diagnosis instruction into Claude's prompt context
    exit 0
  else
    echo "✅ All tests passed successfully."
  fi
fi

exit 0
