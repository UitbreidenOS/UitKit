# Hook: File Changed Reload

Wordt geactiveerd bij `FileChanged` wanneer een bestand extern is gewijzigd — buiten Claude's eigen bewerkingen. Voert een passende controle uit (lint, schemavalidatie of config herladend) zodat Claude onmiddellijk ziet of de externe wijziging problemen heeft veroorzaakt, zonder te wachten op de volgende expliciete tool call.

## Wat het doet

Leest de `FileChanged` event payload vanuit stdin. De payload bevat het pad van het gewijzigde bestand. Het script:

1. Extraheert het gewijzigde bestandspad uit `CLAUDE_HOOK_FILE` (ingevuld door de harness voor `FileChanged` events).
2. Selecteert een controle op basis van de bestandsextensie:
   - `.py` — voert `ruff check` uit (of valt terug op `flake8`)
   - `.ts` / `.tsx` / `.js` / `.jsx` — voert `eslint` uit
   - `.json` — valideert met `jq empty`
   - `.yaml` / `.yml` — valideert met `python3 -c 'import yaml, sys; yaml.safe_load(sys.stdin)'`
   - `.sh` — voert `shellcheck` uit
   - Alle andere bestanden — geen-op, sluit af met 0
3. Verzendt het controleresultaat naar stdout zodat Claude het in context ziet.
4. Sluit af met een non-zero-code als de controle mislukt, wat de fout oppervlakt in Claude's tool output.

Voorbeeld output die Claude ontvangt:

```
[file-changed-reload] /path/to/config.json changed — running jq validation
[file-changed-reload] PASS: config.json is valid JSON
```

Of bij faling:

```
[file-changed-reload] /path/to/app.py changed — running ruff
[file-changed-reload] FAIL: app.py line 42: F401 'os' imported but unused
```

## Wanneer het wordt geactiveerd

`FileChanged` — wordt geactiveerd wanneer de harness detecteert dat een bestand in het project is gewijzigd door een extern proces (bijv. een achtergrondcompileertool, een git pull, een filesystem watcher of een handmatige editor save). Wordt niet geactiveerd voor bewerkingen die Claude via zijn eigen Write/Edit tools uitvoert.

## settings.json invoer

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

Stel `matcher` in op een glob patroon (bijv. `"*.py"`) om de hook tot specifieke bestandstypes te beperken en controles op assets of gegenereerde bestanden te vermijden.

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

Installeer de relevante linter voor uw project (bijv. `pip install ruff`, `npm install -g eslint`, `brew install shellcheck`). Het script degradeert elegant als een linter ontbreekt — het slaat over en sluit af met 0 in plaats van te mislukken.

## Opmerkingen

- `CLAUDE_HOOK_FILE` wordt ingesteld door de harness op hook invocation time voor `FileChanged` events. Vertrouw niet op het parseren van stdin voor het pad — gebruik de env var.
- De timeout van 20 seconden omvat trage eslint initialisatie op grote projecten. Verhoog het naar 30 als uw project veel plugins heeft.
- Beperk `matcher` in settings.json (bijv. `"src/**/*.py"`) om triggering op gegenereerde build artefacten of node_modules te vermijden als die directories niet zijn uitgesloten van file watching.
- De hook sluit af met non-zero op linter failure, wat de faling oppervlakt als een tool error in Claude's context. Claude zal dan meestal een fix voorstellen zonder dat u de lint output hoeft te kopiëren-plakken.
- Voor monorepo's met per-package configs, plaats de check command voorafgegaan door de package directory of geef `--config` expliciet door.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
