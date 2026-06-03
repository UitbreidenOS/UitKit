# Hook: File Changed Reload

Se activa en `FileChanged` cuando un archivo se modifica externamente — fuera de los propios cambios de Claude. Re-ejecuta una verificación apropiada (linting, validación de esquema o recarga de configuración) para que Claude vea inmediatamente si el cambio externo introdujo problemas, sin esperar a la siguiente llamada de herramienta explícita.

## Qué hace

Lee la carga útil del evento `FileChanged` desde stdin. La carga útil incluye la ruta del archivo modificado. El script:

1. Extrae la ruta del archivo modificado de `CLAUDE_HOOK_FILE` (poblada por el harness para eventos `FileChanged`).
2. Selecciona una verificación basada en la extensión del archivo:
   - `.py` — ejecuta `ruff check` (o retrocede a `flake8`)
   - `.ts` / `.tsx` / `.js` / `.jsx` — ejecuta `eslint`
   - `.json` — valida con `jq empty`
   - `.yaml` / `.yml` — valida con `python3 -c 'import yaml, sys; yaml.safe_load(sys.stdin)'`
   - `.sh` — ejecuta `shellcheck`
   - Todos los demás archivos — sin operación, sale 0
3. Emite el resultado de la verificación a stdout para que Claude lo vea en contexto.
4. Sale con código distinto a cero si la verificación falla, lo que expone el fallo en la salida de la herramienta de Claude.

Salida de ejemplo que Claude recibe:

```
[file-changed-reload] /path/to/config.json changed — running jq validation
[file-changed-reload] PASS: config.json is valid JSON
```

O en caso de fallo:

```
[file-changed-reload] /path/to/app.py changed — running ruff
[file-changed-reload] FAIL: app.py line 42: F401 'os' imported but unused
```

## Cuándo se activa

`FileChanged` — se activa cuando el harness detecta que un archivo en el proyecto ha sido modificado por un proceso externo (por ejemplo, una herramienta de compilación en segundo plano, un git pull, un observador del sistema de archivos o un guardado manual del editor). No se activa para ediciones que Claude realiza a través de sus propias herramientas Write/Edit.

## Entrada en settings.json

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

Establece `matcher` a un patrón glob (por ejemplo, `"*.py"`) para limitar el hook a tipos de archivo específicos y evitar ejecutar verificaciones en activos o archivos generados.

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

## Configuración

```bash
cp hooks/context/file-changed-reload.sh .claude/hooks/
chmod +x .claude/hooks/file-changed-reload.sh
```

Instala el linter relevante para tu proyecto (por ejemplo, `pip install ruff`, `npm install -g eslint`, `brew install shellcheck`). El script se degrada correctamente cuando falta un linter — salta y sale 0 en lugar de generar un error.

## Notas

- `CLAUDE_HOOK_FILE` es establecido por el harness en el momento de la invocación del hook para eventos `FileChanged`. No confíes en analizar stdin para la ruta — usa la variable de entorno.
- El timeout de 20 segundos cubre la inicialización lenta de eslint en proyectos grandes. Auméntalo a 30 si tu proyecto tiene muchos plugins.
- Limita `matcher` en settings.json (por ejemplo, `"src/**/*.py"`) para evitar activarse en artefactos de compilación generados o node_modules si esos directorios no están excluidos de la observación de archivos.
- El hook sale con código distinto a cero en caso de fallo del linter, lo que expone el fallo como un error de herramienta en el contexto de Claude. Claude propondrá entonces típicamente una corrección sin que necesites copiar y pegar la salida del linting.
- Para monorepos con configuraciones por paquete, prefija el comando de verificación con el directorio del paquete o pasa `--config` explícitamente.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
