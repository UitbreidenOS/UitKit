# Claudient Matrix CLI — Quick Reference Card

## One-Liners

```bash
# List all themes
node scripts/claudient-matrix.js list

# Preview theme
node scripts/claudient-matrix.js preview matrix

# Apply theme
node scripts/claudient-matrix.js apply matrix

# View config
node scripts/claudient-matrix.js config

# Customize theme
node scripts/claudient-matrix.js customize matrix --set glow=strong,scanline=off

# Export theme
node scripts/claudient-matrix.js export matrix --output ~/matrix.json

# Validate theme
node scripts/claudient-matrix.js validate matrix
```

## Command Cheat Sheet

| Command | Purpose | Example |
|---------|---------|---------|
| `list` | Show all available themes | `node scripts/claudient-matrix.js list` |
| `list --preview` | List themes + show previews | `node scripts/claudient-matrix.js list --preview` |
| `apply <name>` | Apply theme to Claude Code | `node scripts/claudient-matrix.js apply dracula` |
| `preview <name>` | Terminal preview of theme | `node scripts/claudient-matrix.js preview nord` |
| `customize <name>` | Store customizations | `node scripts/claudient-matrix.js customize matrix --set glow=strong` |
| `export <name>` | Export to JSON file | `node scripts/claudient-matrix.js export matrix --output ~/matrix.json` |
| `validate <name>` | Check theme validity | `node scripts/claudient-matrix.js validate matrix` |
| `config` | Show current configuration | `node scripts/claudient-matrix.js config` |
| `help` | Show help message | `node scripts/claudient-matrix.js help` |

## Theme IDs

```
matrix              Ghost in the Shell    claudient-brand
dracula             Gruvbox               claudient-neon
nord                monokai
rose-pine           solarized-dark
catppuccin          solarized-light
tokyo-night
```

## Common Workflows

### Discovery
```bash
# 1. See what's available
node scripts/claudient-matrix.js list

# 2. Preview before applying
node scripts/claudient-matrix.js preview ghost-shell

# 3. Apply it
node scripts/claudient-matrix.js apply ghost-shell
```

### Theme Customization
```bash
# 1. Apply base theme
node scripts/claudient-matrix.js apply matrix

# 2. Store preferences
node scripts/claudient-matrix.js customize matrix --set glow=strong,scanline=off

# 3. View configuration
node scripts/claudient-matrix.js config

# 4. Export with customizations
node scripts/claudient-matrix.js export matrix --output ~/my-matrix.json
```

### Batch Operations
```bash
# Validate all themes
for theme in matrix dracula nord gruvbox; do
  node scripts/claudient-matrix.js validate $theme
done

# Preview all themes
for theme in $(node scripts/claudient-matrix.js list | grep "ID:" | awk '{print $2}'); do
  node scripts/claudient-matrix.js preview $theme
done

# Export all themes
for theme in matrix dracula nord gruvbox; do
  node scripts/claudient-matrix.js export $theme --output ~/exports/$theme.json
done
```

## Configuration File

**Location:** `~/.claude/matrix-config.json`

**Structure:**
```json
{
  "activeTheme": "matrix",
  "customizations": {
    "matrix": { "glow": "strong", "scanline": "off" },
    "nord": { "intensity": "high" }
  },
  "history": ["matrix", "dracula", "nord"],
  "installPath": "~/.claude/themes"
}
```

## Output Indicators

| Symbol | Meaning |
|--------|---------|
| `✓` | Success |
| `✗` | Error |
| `⚠` | Warning |
| `ℹ` | Information |
| `✓ ACTIVE` | Currently applied theme |

## Exit Codes

- `0` — Success
- `1` — Error (theme not found, validation failed, etc.)

## Tips & Tricks

### Create shell alias
```bash
alias theme='node /path/to/scripts/claudient-matrix.js'

# Usage:
theme list
theme apply matrix
```

### Quick switcher
```bash
#!/bin/bash
# Quickly cycle through themes
for t in matrix dracula nord gruvbox; do
  echo "Loading $t..."
  node scripts/claudient-matrix.js apply $t
  sleep 2
done
```

### View theme as formatted JSON
```bash
# Export and format
node scripts/claudient-matrix.js export matrix --output - | jq .
```

### Find themes by keyword
```bash
node scripts/claudient-matrix.js list | grep -i "dark"
```

### Validate before PR
```bash
# In CI/CD: validate all themes
find themes -name "*.json" | sed 's/.*\///;s/\.json//' | \
  xargs -I {} node scripts/claudient-matrix.js validate {}
```

## Troubleshooting

**Theme not found?**
```bash
node scripts/claudient-matrix.js list
```

**Check what's installed:**
```bash
ls -lh ~/.claude/themes/
```

**View current config:**
```bash
cat ~/.claude/matrix-config.json | jq .
```

**Clear config and start fresh:**
```bash
rm ~/.claude/matrix-config.json
```

**See installation path:**
```bash
node scripts/claudient-matrix.js config
```

## Files & Paths

| Path | Purpose |
|------|---------|
| `scripts/claudient-matrix.js` | CLI script |
| `themes/*.json` | Available themes |
| `~/.claude/themes/` | Installed themes |
| `~/.claude/matrix-config.json` | User configuration |
| `CLAUDIENT_MATRIX_CLI.md` | Full documentation |

## API Functions (Node.js)

```javascript
const matrix = require('./scripts/claudient-matrix.js');

matrix.loadAvailableThemes()      // Get all themes
matrix.loadConfig()               // Get user config
matrix.applyTheme('dracula')      // Apply theme
matrix.previewTheme('matrix')     // Show preview
matrix.exportTheme('nord', 'out.json')  // Export
matrix.validateTheme('matrix')    // Validate
```

## Examples

### Multi-theme export
```bash
mkdir -p ~/theme-exports
for theme in $(node scripts/claudient-matrix.js list | grep "ID:" | awk '{print $2}'); do
  node scripts/claudient-matrix.js export "$theme" \
    --output "~/theme-exports/$theme.json"
done
```

### Apply + validate workflow
```bash
THEME=matrix
node scripts/claudient-matrix.js validate "$THEME" && \
node scripts/claudient-matrix.js apply "$THEME" && \
echo "✓ $THEME ready"
```

### Theme switcher with preview
```bash
THEME=dracula
echo "Previewing $THEME..."
node scripts/claudient-matrix.js preview "$THEME"
echo "Apply? (y/n)"
read -r confirm
[ "$confirm" = "y" ] && node scripts/claudient-matrix.js apply "$THEME"
```

---

**Full docs:** See `CLAUDIENT_MATRIX_CLI.md`  
**Version:** 1.0.0  
**Updated:** 2026-06-22
