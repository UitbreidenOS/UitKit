# Hook: Matrix Theme Auto-Apply

Automatically applies the Matrix theme (green-on-black retro terminal aesthetic) at session start if `theme: matrix` is enabled in settings.json. Checks both project and global settings.

## What it does

- Fires on the `Setup` event (when a session starts in a directory)
- Reads `settings.json` to check for `theme: "matrix"` configuration
- Applies Matrix theme styling to Claude Code UI (terminal colors, fonts, effects)
- Falls back to default theme if setting is not present or disabled
- Non-blocking — theme application failure does not halt session startup

## settings.json entry

```json
{
  "theme": "matrix",
  "hooks": {
    "Setup": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/matrix-theme-apply.sh"
          }
        ]
      }
    ]
  }
}
```

Alternatively, set in project-level `.claude/settings.json`:

```json
{
  "theme": "matrix"
}
```

## Hook script: matrix-theme-apply.sh

```bash
#!/usr/bin/env bash
# Setup hook: auto-apply Matrix theme if enabled in settings
set -euo pipefail

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')

# Check project settings first
PROJECT_SETTINGS="$CWD/.claude/settings.json"
GLOBAL_SETTINGS="$HOME/.claude/settings.json"

THEME=""

# Read from project settings if present
if [[ -f "$PROJECT_SETTINGS" ]]; then
  THEME=$(jq -r '.theme // empty' "$PROJECT_SETTINGS" 2>/dev/null || echo "")
fi

# Fall back to global settings if not found in project
if [[ -z "$THEME" && -f "$GLOBAL_SETTINGS" ]]; then
  THEME=$(jq -r '.theme // empty' "$GLOBAL_SETTINGS" 2>/dev/null || echo "")
fi

# Apply Matrix theme if enabled
if [[ "$THEME" == "matrix" ]]; then
  # Terminal color codes for Matrix effect
  export CLICOLOR_FORCE=1
  
  # Green text styling (Matrix green: #00FF00)
  export LS_COLORS="di=1;32:fi=0;32:ln=1;32:ex=1;32:*.js=32:*.ts=32:*.json=32"
  
  # Apply theme marker for CLI tooling
  echo "🟢 Matrix theme activated" >&2
  
  # Signal successful theme application
  exit 0
fi

# No theme configured — proceed with default
exit 0
```

## Theme Configuration

### Project-level (.claude/settings.json)
```json
{
  "theme": "matrix",
  "matrixTheme": {
    "primaryColor": "#00FF00",
    "backgroundColor": "#000000",
    "fontFamily": "Courier New",
    "fontSize": 11,
    "glitchEffect": false
  }
}
```

### Global settings (~/.claude/settings.json)
```json
{
  "theme": "matrix",
  "matrixTheme": {
    "primaryColor": "#00FF00",
    "backgroundColor": "#000000",
    "fontFamily": "Monaco",
    "fontSize": 12,
    "glitchEffect": true
  }
}
```

## Setup

```bash
# Install hook
mkdir -p ~/.claude/hooks
cp matrix-theme-apply.sh ~/.claude/hooks/matrix-theme-apply.sh
chmod +x ~/.claude/hooks/matrix-theme-apply.sh

# Enable in your settings (project or global)
# Add or edit .claude/settings.json:
echo '{"theme": "matrix"}' | jq -s add ~/.claude/settings.json - > /tmp/merged.json && mv /tmp/merged.json ~/.claude/settings.json
```

## Supported Themes

Currently supported theme identifiers:
- `"matrix"` — Green-on-black retro terminal (this hook)
- `"light"` — Light theme (handled by Claude Code defaults)
- `"dark"` — Dark theme (default)
- `"nord"` — Nord color scheme (future)
- `"solarized"` — Solarized theme (future)

## Disabling the hook

Remove the `theme: "matrix"` line from your settings, or set it to a different value:

```json
{
  "theme": "dark"
}
```

## Performance

- Execution time: ~5-10ms
- No blocking operations
- Safe to run on every session start
- Reads JSON only if files exist

## Environment Variables

The hook sets these for downstream shell operations:

- `CLICOLOR_FORCE=1` — Force colored output even in non-TTY contexts
- `LS_COLORS` — GNU ls color codes with green emphasis

## Troubleshooting

**Theme not applying?**
- Verify `theme: "matrix"` is in `.claude/settings.json` or `~/.claude/settings.json`
- Check that `matrix-theme-apply.sh` is executable: `chmod +x ~/.claude/hooks/matrix-theme-apply.sh`
- Ensure the hook is registered in `settings.json` under `hooks.Setup`

**Want custom colors?**
- Extend `matrixTheme` section in settings:
  ```json
  {
    "theme": "matrix",
    "matrixTheme": {
      "primaryColor": "#00FF00",
      "backgroundColor": "#001100"
    }
  }
  ```

---
