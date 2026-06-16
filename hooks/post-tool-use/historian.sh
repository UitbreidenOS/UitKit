#!/bin/bash

# historian.sh
# Logs significant file changes to be processed by the documentation updater.

TOOL_NAME="$1"
TOOL_ARGS="$2"

if [[ "$TOOL_NAME" != "Replace" && "$TOOL_NAME" != "WriteFile" ]]; then
  exit 0
fi

FILE_PATH=$(echo "$TOOL_ARGS" | grep -o '"file_path": *"[^"]*"' | cut -d'"' -f4)

# Define which directories trigger an architecture update
if [[ "$FILE_PATH" == *"src/db/"* ]] || \
   [[ "$FILE_PATH" == *"src/api/"* ]] || \
   [[ "$FILE_PATH" == *"src/core/"* ]] || \
   [[ "$FILE_PATH" == *"schema"* ]]; then
   
  echo "📚 The Historian noted an architectural change in $FILE_PATH."
  echo "- Modified $FILE_PATH at $(date)" >> .claude/DOCS_QUEUE.txt
  echo "Claude: A core file was modified. Please remind the user to run /historian before they finish their session to update the documentation."
fi

exit 0