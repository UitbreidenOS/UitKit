# Hook: File Changed Reload

Fires on `FileChanged` when a file is modified externally — outside of Claude's own edits. Re-runs an appropriate check (lint, schema validation, or config reload) so Claude immediately sees whether the external change introduced problems, without waiting for the next explicit tool call.

## What it does

Reads the `FileChanged` event payload from stdin. The payload includes the path of the modified file. The script:

1. Extracts the changed file path from `CLAUDE_HOOK_FILE` (populated by the harness for `FileChanged` events).
2. Selects a check based on the file extension:
   - `.py` — runs `ruff check` (or falls back to `flake8`)
   - `.ts` / `.tsx` / `.js` / `.jsx` — runs `eslint`
   - `.json` — validates with `jq empty`
   - `.yaml` / `.yml` — validates with `python3 -c 'import yaml, sys; yaml.safe_load(sys.stdin)'`
   - `.sh` — runs `shellcheck`
   - All other files — no-op, exits 0
3. Emits the check result to stdout so Claude sees it in context.
4. Exits non-zero if the check fails, which surfaces the failure in Claude's tool output.

Example output Claude receives:

```
[file-changed-reload] /path/to/config.json changed — running jq validation
[file-changed-reload] PASS: config.json is valid JSON
```

Or on failure:

```
[file-changed-reload] /path/to/app.py changed — running ruff
[file-changed-reload] FAIL: app.py line 42: F401 'os' imported but unused
```

## When it fires

`FileChanged` — fires when the harness detects that a file in the project has been modified by an external process (e.g., a background build tool, a git pull, a filesystem watcher, or a manual editor save). Does not fire for edits Claude makes via its own Write/Edit tools.

## settings.json entry

```json
{
  "hooks": {
    "FileChanged": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/file-changed-reload.sh",
            "timeout": 20
          }
        ]
      }
    ]
  }
}
```

Set `matcher` to a glob pattern (e.g., `"*.py"`) to narrow the hook to specific file types and avoid running checks on assets or generated files.

## Script

`file-changed-reload.sh`

```bash
#!/usr/bin/env bash
# file-changed-reload.sh
# Fires on FileChanged — re-lints or validates the externally modified file

set -euo pipefail

FILE="${CLAUDE_HOOK_FILE:-}"

if [[ -z "$FILE" ]]; then
  echo "[file-changed-reload] No file path in CLAUDE_HOOK_FILE — skipping" >&2
  exit 0
fi

if [[ ! -f "$FILE" ]]; then
  echo "[file-changed-reload] File no longer exists: $FILE — skipping" >&2
  exit 0
fi

EXT="${FILE##*.}"

run_check() {
  local label="$1"
  shift
  echo "[file-changed-reload] $FILE changed — running $label"
  if "$@"; then
    echo "[file-changed-reload] PASS: $FILE passed $label"
  else
    echo "[file-changed-reload] FAIL: $FILE failed $label — see output above"
    exit 1
  fi
}

case "$EXT" in
  py)
    if command -v ruff &>/dev/null; then
      run_check "ruff" ruff check "$FILE"
    elif command -v flake8 &>/dev/null; then
      run_check "flake8" flake8 "$FILE"
    else
      echo "[file-changed-reload] No Python linter found (ruff or flake8) — skipping"
    fi
    ;;
  ts|tsx|js|jsx)
    if command -v eslint &>/dev/null; then
      run_check "eslint" eslint --no-eslintrc -c .eslintrc.json "$FILE" 2>/dev/null \
        || run_check "eslint (no config)" eslint "$FILE"
    else
      echo "[file-changed-reload] eslint not found — skipping"
    fi
    ;;
  json)
    run_check "jq validation" jq empty < "$FILE"
    ;;
  yaml|yml)
    run_check "YAML validation" python3 -c \
      'import yaml, sys; yaml.safe_load(open(sys.argv[1]))' "$FILE"
    ;;
  sh|bash)
    if command -v shellcheck &>/dev/null; then
      run_check "shellcheck" shellcheck "$FILE"
    else
      echo "[file-changed-reload] shellcheck not found — skipping"
    fi
    ;;
  *)
    echo "[file-changed-reload] No check configured for .$EXT files — skipping"
    ;;
esac
```

## Setup

```bash
cp hooks/context/file-changed-reload.sh .claude/hooks/
chmod +x .claude/hooks/file-changed-reload.sh
```

Install the relevant linter for your project (e.g., `pip install ruff`, `npm install -g eslint`, `brew install shellcheck`). The script degrades gracefully when a linter is missing — it skips and exits 0 rather than erroring.

## Notes

- `CLAUDE_HOOK_FILE` is set by the harness at hook invocation time for `FileChanged` events. Do not rely on parsing stdin for the path — use the env var.
- The 20-second timeout covers slow eslint initialisation on large projects. Raise it to 30 if your project has many plugins.
- Narrow `matcher` in settings.json (e.g., `"src/**/*.py"`) to avoid triggering on generated build artefacts or node_modules if those directories are not excluded from file watching.
- The hook exits non-zero on linter failure, which surfaces the failure as a tool error in Claude's context. Claude will then typically propose a fix without you needing to copy-paste the lint output.
- For monorepos with per-package configs, prefix the check command with the package directory or pass `--config` explicitly.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
