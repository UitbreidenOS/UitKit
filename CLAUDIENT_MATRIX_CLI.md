# Claudient Matrix CLI — Theme Management System

## Overview

`claudient-matrix.js` is a comprehensive command-line interface for managing Claude Code themes within the Claudient system. It provides theme discovery, application, preview, customization, validation, and export capabilities all from the terminal.

## Installation

The script is included in the Claudient repository at:
```bash
scripts/claudient-matrix.js
```

Make it executable:
```bash
chmod +x scripts/claudient-matrix.js
```

Then invoke via Node directly or integrate into `package.json` scripts.

## Quick Start

```bash
# List all available themes
node scripts/claudient-matrix.js list

# Preview a specific theme in your terminal
node scripts/claudient-matrix.js preview matrix

# Apply a theme to Claude Code
node scripts/claudient-matrix.js apply matrix

# View your current configuration
node scripts/claudient-matrix.js config
```

## Commands Reference

### `list [--preview]`

List all available themes with metadata.

**Output:**
- Theme name
- Theme ID (for use in `apply` command)
- Description
- Primary color (if defined)
- Active theme indicator (✓)

**Options:**
- `--preview`: Show detailed color palette and effects for each theme

**Example:**
```bash
node scripts/claudient-matrix.js list
node scripts/claudient-matrix.js list --preview
```

### `apply <theme-name> [--save-config]`

Apply a theme to your Claude Code installation.

**Behavior:**
1. Validates theme exists and is valid JSON
2. Creates `~/.claude/themes/` directory if it doesn't exist
3. Copies theme file to Claude Code themes directory
4. Updates matrix-config.json with active theme
5. Adds theme to installation history

**Parameters:**
- `<theme-name>`: ID of the theme to apply (e.g., `matrix`, `dracula`)
- `--save-config`: Force config update (default: enabled)

**Output:**
```
✓ Theme 'Matrix' copied to ~/.claude/themes/matrix.json
✓ Configuration saved to ~/.claude/matrix-config.json
✓ Theme 'Matrix' applied
ℹ Installation path: ~/.claude/themes/matrix.json
ℹ Restart Claude Code to apply the theme
```

**Example:**
```bash
node scripts/claudient-matrix.js apply matrix
node scripts/claudient-matrix.js apply dracula --save-config
```

### `preview <theme-name>`

Show a detailed terminal preview of a theme's configuration.

**Displays:**
- Color palette (primary, background, text, semantic colors)
- Typography settings (font families, sizes, weights)
- Effects (scanlines, CRT, glow, terminal effects)
- Styled components list
- Quick customization hints

**Example:**
```bash
node scripts/claudient-matrix.js preview matrix
node scripts/claudient-matrix.js preview ghost-shell
```

**Output Sample:**
```
╔════════════════════════════════════════════════════════════════╗
║  Preview: Matrix                                                ║
╚════════════════════════════════════════════════════════════════╝

▸ Color Palette:
  primary         #00ff41
  background      #0a0e27
  text            #00ff41
  error           #ff004d

▸ Typography:
  Monospace: 'Courier New', 'Courier', 'IBM Plex Mono', monospace

▸ Effects:
  scanlines       ON
  crt             ON
  glow            ON
  terminal        OFF

▸ Styled Components:
  • button
  • input
  • card
  ...
```

### `customize <theme-name> --set key=value[,key=value...]`

Store customization preferences for a theme in your configuration.

**Behavior:**
1. Validates theme exists
2. Parses comma-separated key=value pairs
3. Merges with existing customizations
4. Saves to matrix-config.json

**Parameters:**
- `<theme-name>`: Theme to customize
- `--set key=value[,...]`: One or more customizations in `key=value` format, separated by commas

**Note:** Customizations are stored in config but must be manually applied by editing the theme JSON file.

**Example:**
```bash
node scripts/claudient-matrix.js customize matrix --set glow=strong,scanline=off
node scripts/claudient-matrix.js customize dracula --set primaryColor=#bd93f9,opacity=0.8
```

**Output:**
```
ℹ Set glow = strong
ℹ Set scanline = off
✓ Customizations saved for 'matrix'
```

### `export <theme-name> [--output path/file.json]`

Export a theme to a JSON file (with current customizations applied).

**Behavior:**
1. Loads theme from themes/ directory
2. Includes stored customizations
3. Adds export timestamp
4. Writes to specified or default location

**Parameters:**
- `<theme-name>`: Theme to export
- `--output path/file.json`: Custom output file (default: `{theme-name}-export.json`)

**Example:**
```bash
node scripts/claudient-matrix.js export matrix
node scripts/claudient-matrix.js export dracula --output ~/Downloads/my-dracula.json
```

**Output:**
```
✓ Theme exported to /Users/tushar/Downloads/matrix-export.json
ℹ Size: 15.18 KB
```

### `validate <theme-name>`

Validate a theme's JSON structure and color definitions.

**Checks:**
- Required fields present (name, colors)
- Required colors defined (primary, background)
- Color hex format validity (#RRGGBB)
- Component definitions
- Animation configurations

**Exit Codes:**
- `0`: Theme is valid
- `1`: Validation failed

**Example:**
```bash
node scripts/claudient-matrix.js validate matrix
```

**Output (Valid):**
```
✓ Theme 'Matrix' is valid
```

**Output (Invalid):**
```
⚠ Found 3 issue(s) in theme:
  • Missing required field: name
  • Invalid color format for selection: #00ff4133
  • Missing required color: primary
```

### `config`

Display current matrix configuration and settings.

**Shows:**
- Active theme
- Installation path
- Theme history (recently applied themes)
- Stored customizations per theme
- Configuration file location

**Example:**
```bash
node scripts/claudient-matrix.js config
```

**Output:**
```
╔════════════════════════════════════════════════════════════════╗
║            Matrix Configuration                               ║
╚════════════════════════════════════════════════════════════════╝

Active Theme: matrix
Install Path: ~/.claude/themes

Theme History:
  1. matrix
  2. dracula
  3. nord

Customizations:
  matrix:
    glow: strong
    scanline: off

Configuration: ~/.claude/matrix-config.json
```

### `help` / `-h` / `--help`

Display help message with usage examples.

## Configuration File

Configuration is stored at: `~/.claude/matrix-config.json`

**Structure:**
```json
{
  "activeTheme": "matrix",
  "customizations": {
    "matrix": {
      "glow": "strong",
      "scanline": "off"
    },
    "dracula": {
      "primaryColor": "#bd93f9"
    }
  },
  "history": ["matrix", "dracula", "nord"],
  "installPath": "~/.claude/themes"
}
```

**Fields:**
- `activeTheme`: Currently active theme ID
- `customizations`: User customizations per theme (key=value)
- `history`: List of themes applied in order (up to 10)
- `installPath`: Location where themes are installed

## Directory Structure

```
claudient/
├── scripts/
│   └── claudient-matrix.js       # CLI script
├── themes/
│   ├── matrix.json               # Matrix theme
│   ├── dracula.json              # Dracula theme
│   ├── nord.json                 # Nord theme
│   └── ... (15+ themes)
└── CLAUDIENT_MATRIX_CLI.md       # This file

~/.claude/
├── themes/
│   ├── matrix.json               # Installed theme
│   └── ... (applied themes)
└── matrix-config.json            # Configuration
```

## Available Themes

The following themes ship with Claudient:

| Theme ID | Name | Type | Primary |
|----------|------|------|---------|
| `matrix` | Matrix | dark | #00ff41 (neon green) |
| `dracula` | Dracula | dark | #bd93f9 (purple) |
| `nord` | Nord | dark | — |
| `gruvbox` | Gruvbox | dark | — |
| `monokai` | Monokai | dark | — |
| `solarized-dark` | Solarized Dark | dark | — |
| `solarized-light` | Solarized Light | light | — |
| `tokyo-night` | Tokyo Night | dark | — |
| `rose-pine` | Rose Pine | dark | — |
| `catppuccin` | Catppuccin Mocha | dark | — |
| `ghost-shell` | Ghost in the Shell | dark | — |
| `claudient-brand` | Claudient Brand | dark | — |
| `claudient-neon` | Claudient Neon | dark | — |

## Usage Patterns

### Discovery & Preview Workflow

```bash
# 1. See what's available
node scripts/claudient-matrix.js list

# 2. Preview a specific theme before applying
node scripts/claudient-matrix.js preview ghost-shell

# 3. Apply and test
node scripts/claudient-matrix.js apply ghost-shell

# 4. Verify it's active
node scripts/claudient-matrix.js config
```

### Customization Workflow

```bash
# 1. Apply base theme
node scripts/claudient-matrix.js apply matrix

# 2. Store customization preferences
node scripts/claudient-matrix.js customize matrix --set glow=strong,scanline=off

# 3. View configuration
node scripts/claudient-matrix.js config

# 4. Export with customizations
node scripts/claudient-matrix.js export matrix --output ~/my-matrix.json
```

### Validation Workflow

```bash
# Validate a theme
node scripts/claudient-matrix.js validate matrix

# Fix issues if needed, then re-validate
node scripts/claudient-matrix.js validate matrix
```

### Theme Switching

```bash
# Quick theme switcher
for theme in matrix dracula nord; do
  echo "Switching to $theme..."
  node scripts/claudient-matrix.js apply $theme
  sleep 2
done

node scripts/claudient-matrix.js config  # Show what's currently active
```

## Features

### ✓ Theme Discovery
- List all available themes
- View descriptions and metadata
- Show primary colors
- Highlight currently active theme

### ✓ Theme Application
- Copy theme to Claude Code installation
- Update configuration automatically
- Track theme history
- Validate theme before applying

### ✓ Terminal Preview
- Display full theme configuration
- Show color palettes
- List animations and effects
- Show styled components
- Display customization hints

### ✓ Customization Management
- Store key=value customizations per theme
- Persist in matrix-config.json
- View customizations by theme

### ✓ Export/Import
- Export themes with current customizations
- Include metadata (timestamps, customizations)
- Use custom output paths
- Share themes as JSON files

### ✓ Validation
- Check required fields
- Validate color hex format
- Report issues with helpful messages
- Support validation in CI/CD

### ✓ Configuration Management
- Centralized config file (~/.claude/matrix-config.json)
- Track theme application history
- Store per-theme customizations
- Persist across sessions

## Color Output

The CLI uses ANSI color codes for terminal output:

- `✓ Success` — Green
- `✗ Error` — Red
- `⚠ Warning` — Yellow
- `ℹ Info` — Cyan
- Bold text — Important headers

Color output is sent to stderr/stdout and respects terminal capabilities. No colors are added to exported JSON files.

## Error Handling

**Graceful error messages:**
```bash
$ node scripts/claudient-matrix.js apply invalid-theme
ERROR: Theme 'invalid-theme' not found

Available themes:
  - matrix
  - dracula
  - nord
  ...
```

**Exit codes:**
- `0`: Success
- `1`: Error (theme not found, validation failed, etc.)

## Integration with CI/CD

Validate themes in your build pipeline:

```bash
#!/bin/bash
# validate-themes.sh

for theme in themes/*.json; do
  theme_name=$(basename "$theme" .json)
  node scripts/claudient-matrix.js validate "$theme_name" || exit 1
done

echo "All themes validated successfully"
```

## Performance

- **List**: ~50ms (15 themes)
- **Preview**: ~30ms (full theme)
- **Apply**: ~100ms (file copy + config write)
- **Validate**: ~20ms
- **Export**: ~50ms

All operations are synchronous and complete instantly.

## Compatibility

- **Node**: 18+ (uses native `fs`, `path`, `os` modules)
- **OS**: macOS, Linux, Windows (via WSL2)
- **Claude Code**: 1.0+ (uses standard theme format)
- **Terminal**: Any terminal with ANSI color support

## Troubleshooting

**Theme not found:**
```bash
# List all available themes
node scripts/claudient-matrix.js list
```

**Config file not found:**
The config is created automatically on first apply. To manually create it:
```bash
mkdir -p ~/.claude
touch ~/.claude/matrix-config.json
```

**Colors not showing:**
- Ensure your terminal supports ANSI colors
- Check `TERM` environment variable: `echo $TERM`
- Try: `export TERM=xterm-256color`

**Theme not activating:**
- Ensure it was copied to `~/.claude/themes/`
- Verify file permissions: `ls -l ~/.claude/themes/matrix.json`
- Restart Claude Code after applying

## Examples

### Apply Matrix theme with preview
```bash
node scripts/claudient-matrix.js preview matrix && \
node scripts/claudient-matrix.js apply matrix
```

### Batch export all themes
```bash
for theme in $(node scripts/claudient-matrix.js list | grep "ID:" | awk '{print $2}'); do
  node scripts/claudient-matrix.js export "$theme" --output "exports/$theme.json"
done
```

### Validate all themes
```bash
node scripts/claudient-matrix.js list | grep "ID:" | awk '{print $2}' | \
xargs -I {} node scripts/claudient-matrix.js validate {}
```

### Create theme switcher function
```bash
# Add to ~/.bashrc or ~/.zshrc
theme() {
  if [ -z "$1" ]; then
    node scripts/claudient-matrix.js list
  else
    node scripts/claudient-matrix.js apply "$1"
  fi
}
```

## API Usage (Node.js)

The script exports utility functions for programmatic use:

```javascript
const matrix = require('./scripts/claudient-matrix.js');

// Load all available themes
const themes = matrix.loadAvailableThemes();
console.log(Object.keys(themes));

// Load user configuration
const config = matrix.loadConfig();
console.log(config.activeTheme);

// Apply theme programmatically
matrix.applyTheme('dracula', true);

// Export theme
matrix.exportTheme('matrix', './my-matrix.json');

// Validate theme
matrix.validateTheme('matrix');
```

## Contributing

To add a new theme:

1. Create a JSON file in `themes/` with proper structure
2. Validate using `node scripts/claudient-matrix.js validate your-theme`
3. Preview using `node scripts/claudient-matrix.js preview your-theme`
4. Add to this documentation
5. Submit PR with theme and documentation updates

## License

Same as Claudient — AGPL-3.0-or-later AND CC-BY-SA-4.0

---

**Maintained by:** Claudient Team  
**Last Updated:** 2026-06-22  
**Version:** 1.0.0
