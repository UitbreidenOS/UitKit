# Hook: File Changed Reload

Wird bei `FileChanged` aktiviert, wenn eine Datei extern geändert wird — außerhalb von Claudes eigenen Bearbeitungen. Führt eine angemessene Prüfung durch (Lint, Schema-Validierung oder Konfigurationsneuladen), damit Claude sofort sieht, ob die externe Änderung Probleme eingeführt hat, ohne auf den nächsten expliziten Werkzeugaufruf zu warten.

## Was es tut

Liest die `FileChanged`-Event-Nutzlast von stdin. Die Nutzlast enthält den Pfad der geänderten Datei. Das Skript:

1. Extrahiert den geänderten Dateipfad aus `CLAUDE_HOOK_FILE` (wird vom Harness für `FileChanged`-Events gefüllt).
2. Wählt eine Prüfung basierend auf der Dateiendung:
   - `.py` — führt `ruff check` aus (oder fällt auf `flake8` zurück)
   - `.ts` / `.tsx` / `.js` / `.jsx` — führt `eslint` aus
   - `.json` — validiert mit `jq empty`
   - `.yaml` / `.yml` — validiert mit `python3 -c 'import yaml, sys; yaml.safe_load(sys.stdin)'`
   - `.sh` — führt `shellcheck` aus
   - Alle anderen Dateien — keine Operation, beendet mit 0
3. Sendet das Prüfergebnis an stdout, damit Claude es im Kontext sieht.
4. Beendet mit nicht-null, wenn die Prüfung fehlschlägt, was den Fehler in Claudes Werkzeugausgabe anzeiget.

Beispielausgabe, die Claude erhält:

```
[file-changed-reload] /path/to/config.json changed — running jq validation
[file-changed-reload] PASS: config.json is valid JSON
```

Oder bei Fehler:

```
[file-changed-reload] /path/to/app.py changed — running ruff
[file-changed-reload] FAIL: app.py line 42: F401 'os' imported but unused
```

## Wann es aktiviert wird

`FileChanged` — wird aktiviert, wenn der Harness erkennt, dass eine Datei im Projekt von einem externen Prozess geändert wurde (z. B. ein Hintergrund-Build-Tool, ein Git-Pull, ein Dateisystem-Watcher oder manuelles Speichern mit einem Editor). Wird nicht für Bearbeitungen aktiviert, die Claude über seine eigenen Write/Edit-Werkzeuge macht.

## settings.json-Eintrag

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

Setzen Sie `matcher` auf ein Glob-Muster (z. B. `"*.py"`), um den Hook auf spezifische Dateitypen zu begrenzen und die Ausführung von Prüfungen auf Assets oder generierten Dateien zu vermeiden.

## Skript

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

Installieren Sie den relevanten Linter für Ihr Projekt (z. B. `pip install ruff`, `npm install -g eslint`, `brew install shellcheck`). Das Skript wird elegant abgebaut, wenn ein Linter fehlt — es wird übersprungen und beendet mit 0, anstatt zu fehlen.

## Hinweise

- `CLAUDE_HOOK_FILE` wird vom Harness bei der Hook-Invokation für `FileChanged`-Events gesetzt. Verlassen Sie sich nicht auf das Parsen von stdin für den Pfad — verwenden Sie die Umgebungsvariable.
- Das 20-Sekunden-Timeout deckt die langsame eslint-Initialisierung bei großen Projekten ab. Erhöhen Sie es auf 30, wenn Ihr Projekt viele Plugins hat.
- Begrenzen Sie `matcher` in settings.json (z. B. `"src/**/*.py"`), um zu vermeiden, dass auf generierten Build-Artefakten oder node_modules ausgelöst wird, wenn diese Verzeichnisse nicht von der Dateiüberwachung ausgeschlossen sind.
- Der Hook beendet mit nicht-null bei Linter-Fehler, was den Fehler als Werkzeugfehler in Claudes Kontext anzeiget. Claude wird dann normalerweise eine Reparatur vorschlagen, ohne dass Sie die Lint-Ausgabe kopieren und einfügen müssen.
- Für Monorepos mit Pro-Paket-Konfigurationen setzen Sie den Prüfbefehl mit dem Paketverzeichnis ein oder übergeben Sie `--config` explizit.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
