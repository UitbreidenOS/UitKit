#!/bin/bash

# atomic-commit.sh
# Automatically commits files edited by Claude.

TOOL_NAME="$1"
TOOL_ARGS="$2"

# We want to commit after a WriteFile or Replace
if [[ "$TOOL_NAME" != "Replace" && "$TOOL_NAME" != "WriteFile" ]]; then
  exit 0
fi

# Extract the file path
FILE_PATH=$(echo "$TOOL_ARGS" | grep -o '"file_path": *"[^"]*"' | cut -d'"' -f4)

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Check if the file has unstaged changes
if git diff --name-only | grep -q "$FILE_PATH"; then
  echo "📦 Atomic Commit: Saving changes to $FILE_PATH..."
  
  # Stage the file
  git add "$FILE_PATH"
  
  # Commit the file
  git commit -m "Auto (Claude): updated $(basename "$FILE_PATH")" --quiet
  
  if [ $? -eq 0 ]; then
    echo "✅ Successfully committed $FILE_PATH."
    echo "Claude: The changes you just made have been automatically committed to version control. The user can revert them if needed."
  else
    echo "⚠️  Failed to create atomic commit."
  fi
fi

exit 0