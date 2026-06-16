#!/bin/bash

# spec-enforcer.sh
# Blocks tool executions that violate project constraints.

TOOL_NAME="$1"
TOOL_ARGS="$2"

# Determine which spec file exists
SPEC_FILE=""
if [ -f "SPEC.md" ]; then
  SPEC_FILE="SPEC.md"
elif [ -f "HANDOFF.md" ]; then
  SPEC_FILE="HANDOFF.md"
fi

# If no spec file, allow execution
if [[ -z "$SPEC_FILE" ]]; then
  exit 0
fi

# We only want to block modification actions
if [[ "$TOOL_NAME" != "Replace" && "$TOOL_NAME" != "WriteFile" && "$TOOL_NAME" != "Bash" ]]; then
  exit 0
fi

# Very crude constraint checking based on exact keyword matches in the spec
# For example, if SPEC.md contains "[CONSTRAINT: NO_LODASH]"
CONSTRAINTS=$(grep -o "\[CONSTRAINT: [^]]*\]" "$SPEC_FILE")

if [[ -z "$CONSTRAINTS" ]]; then
  exit 0
fi

VIOLATION=""

# Example hardcoded mappings based on what constraints might be found
if echo "$CONSTRAINTS" | grep -q "NO_LODASH"; then
  if echo "$TOOL_ARGS" | grep -q "lodash"; then
    VIOLATION="LODASH"
  fi
fi
if echo "$CONSTRAINTS" | grep -q "USE_FETCH"; then
  if echo "$TOOL_ARGS" | grep -q "axios"; then
    VIOLATION="AXIOS_INSTEAD_OF_FETCH"
  fi
fi

if [[ -n "$VIOLATION" ]]; then
  echo "🚨 ARCHITECTURE VIOLATION DETECTED 🚨"
  echo "The Spec-First Enforcer hook has blocked this action."
  echo "Reason: You attempted to use a pattern ($VIOLATION) that explicitly violates the constraints in $SPEC_FILE."
  echo "Claude: Abort this action immediately. Re-read $SPEC_FILE and propose an alternative solution that adheres to the constraints."
  exit 1
fi

exit 0