# Hook: File Changed Reload

Se déclenche sur `FileChanged` lorsqu'un fichier est modifié de manière externe — en dehors des propres éditions de Claude. Réexécute une vérification appropriée (lint, validation de schéma ou rechargement de configuration) pour que Claude voie immédiatement si la modification externe a introduit des problèmes, sans attendre le prochain appel d'outil explicite.

## Ce qu'il fait

Lit la charge utile de l'événement `FileChanged` depuis stdin. La charge utile inclut le chemin du fichier modifié. Le script :

1. Extrait le chemin du fichier modifié depuis `CLAUDE_HOOK_FILE` (rempli par le harness pour les événements `FileChanged`).
2. Sélectionne une vérification basée sur l'extension du fichier :
   - `.py` — exécute `ruff check` (ou revient à `flake8`)
   - `.ts` / `.tsx` / `.js` / `.jsx` — exécute `eslint`
   - `.json` — valide avec `jq empty`
   - `.yaml` / `.yml` — valide avec `python3 -c 'import yaml, sys; yaml.safe_load(sys.stdin)'`
   - `.sh` — exécute `shellcheck`
   - Tous les autres fichiers — aucune action, quitte avec 0
3. Émet le résultat de la vérification vers stdout pour que Claude le voie dans le contexte.
4. Quitte avec un code non-zéro si la vérification échoue, ce qui surface l'échec dans la sortie d'outil de Claude.

Exemple de sortie reçue par Claude :

```
[file-changed-reload] /path/to/config.json changed — running jq validation
[file-changed-reload] PASS: config.json is valid JSON
```

Ou en cas d'échec :

```
[file-changed-reload] /path/to/app.py changed — running ruff
[file-changed-reload] FAIL: app.py line 42: F401 'os' imported but unused
```

## Quand il se déclenche

`FileChanged` — se déclenche lorsque le harness détecte qu'un fichier du projet a été modifié par un processus externe (par exemple, un outil de build en arrière-plan, un git pull, un observateur de système de fichiers, ou une sauvegarde manuelle d'éditeur). Ne se déclenche pas pour les éditions que Claude fait via ses propres outils Write/Edit.

## Entrée settings.json

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

Définissez `matcher` sur un modèle glob (par exemple, `"*.py"`) pour limiter le hook à des types de fichiers spécifiques et éviter d'exécuter des vérifications sur les ressources ou les fichiers générés.

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

## Configuration

```bash
cp hooks/context/file-changed-reload.sh .claude/hooks/
chmod +x .claude/hooks/file-changed-reload.sh
```

Installez le linter approprié pour votre projet (par exemple, `pip install ruff`, `npm install -g eslint`, `brew install shellcheck`). Le script se dégrade gracieusement quand un linter manque — il ignore et quitte avec 0 plutôt que d'émettre une erreur.

## Notes

- `CLAUDE_HOOK_FILE` est défini par le harness au moment de l'invocation du hook pour les événements `FileChanged`. Ne comptez pas sur l'analyse de stdin pour le chemin — utilisez la variable d'environnement.
- Le délai d'expiration de 20 secondes couvre l'initialisation lente d'eslint sur les grands projets. Augmentez-le à 30 si votre projet a de nombreux plugins.
- Limitez `matcher` dans settings.json (par exemple, `"src/**/*.py"`) pour éviter de se déclencher sur les artefacts de build générés ou node_modules si ces répertoires ne sont pas exclus de la surveillance de fichiers.
- Le hook quitte avec un code non-zéro en cas d'échec du linter, ce qui fait surface l'échec comme une erreur d'outil dans le contexte de Claude. Claude proposera alors généralement un correctif sans que vous ayez besoin de copier-coller la sortie du lint.
- Pour les monorepos avec des configurations par paquet, préfixez la commande de vérification avec le répertoire du paquet ou passez `--config` explicitement.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
