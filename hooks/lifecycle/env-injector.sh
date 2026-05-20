#!/usr/bin/env bash
# Setup hook: inject project env vars at session start
set -euo pipefail

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')

load_env_file() {
  local file="$1"
  local override="${2:-true}"
  [[ ! -f "$file" ]] && return
  while IFS='=' read -r key value; do
    [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
    if [[ "$override" == "false" ]] && [[ -v "$key" ]]; then continue; fi
    export "$key=$value"
  done < "$file"
  echo "📦 Loaded: $file" >&2
}

load_env_file "$CWD/.claude/env" true
load_env_file "$HOME/.claude/env" false

exit 0
