# Theme Builder Batch - Programmatic Theme Generation

Non-interactive theme builder for creating themes from JSON configs. Perfect for CI/CD, batch generation, testing, and automation.

## Quick Start

List available palettes:
```bash
npm run theme-builder-batch -- list-palettes
```

Create theme from config:
```bash
npm run theme-builder-batch -- create examples/theme-config.json
```

## Commands

### create

Generate a theme from JSON config file.

```bash
npm run theme-builder-batch -- create <config.json>
```

**Options:**
- `--output <filename>` — Save with specific filename (default: theme-name.json)

**Example:**
```bash
node scripts/theme-builder-batch.js create examples/theme-config.json
```

Output:
```
✓ Theme created: /themes/synthwave-neon-generated.json
  Name: Synthwave Neon
  Type: dark
  Colors: 12 colors
```

### list-palettes

Show all available color palettes.

```bash
npm run theme-builder-batch -- list-palettes
```

Output:
```
Available Color Palettes:

  matrixClassic
    Primary: #00ff41
    Colors: 41

  matrixNeon
    Primary: #39ff14
    Colors: 12

  cyberpunk
    Primary: #ff00ff
    Colors: 12
```

### list-typography

List available typography presets.

```bash
npm run theme-builder-batch -- list-typography
```

### list-effects

List available effects presets.

```bash
npm run theme-builder-batch -- list-effects
```

Output:
```
Available Effects Presets:

  heavy
    Scanlines: Enabled
    Glow: Enabled
    CRT: Enabled

  moderate
    Scanlines: Enabled
    Glow: Enabled
    CRT: Disabled

  minimal
    Scanlines: Disabled
    Glow: Enabled
    CRT: Disabled
```

## Config JSON Format

Minimal config:
```json
{
  "name": "My Theme",
  "palette": "matrixClassic"
}
```

Full config with all options:
```json
{
  "name": "My Custom Theme",
  "description": "Custom Matrix-inspired theme",
  "type": "dark",
  "author": "your-name",
  "license": "MIT",
  "palette": "matrixClassic",
  "typography": "monospace",
  "effects": "moderate",
  "spacing": "default",
  "components": true,
  "animations": true,
  "states": true,
  "production": false,
  "tags": ["custom", "matrix"],
  "filename": "my-theme.json"
}
```

## Config Options

### Basic Metadata

- **name** (string, required) — Theme display name
- **description** (string, optional) — Theme description
- **type** (string, optional) — "dark" or "light", default: "dark"
- **author** (string, optional) — Author name
- **license** (string, optional) — License type (MIT, CC-BY-SA-4.0, etc.)
- **filename** (string, optional) — Export filename (default: name.json)
- **production** (boolean, optional) — Mark theme as production-ready
- **tags** (array, optional) — Theme tags for categorization

### Styling

- **palette** (string, optional) — Predefined palette name or custom colors object
  - Options: "matrixClassic", "matrixNeon", "cyberpunk"
  - Or provide custom colors object:
    ```json
    "colors": {
      "primary": "#00ff41",
      "secondary": "#00ffff",
      "background": "#0a0e27",
      "text": "#00ff41"
    }
    ```

- **typography** (string or object, optional) — Font stack preset or custom
  - Presets: "monospace", "modern"
  - Or provide custom typography:
    ```json
    "typography": {
      "fontFamily": {
        "mono": "'Courier New', monospace",
        "sans": "'Arial', sans-serif"
      },
      "fontSize": { "xs": "11px", "base": "13px" }
    }
    ```

- **effects** (string or object, optional) — Effect intensity preset
  - Presets: "heavy", "moderate", "minimal"
  - Or provide custom effects:
    ```json
    "effects": {
      "scanlines": { "enabled": true, "opacity": 0.05 },
      "glow": { "enabled": true, "blur": "8px" },
      "crt": { "enabled": false }
    }
    ```

- **spacing** (string or object, optional) — Spacing scale
  - "default" — Tailwind-inspired scale
  - Or provide custom:
    ```json
    "spacing": { "0": "0px", "1": "2px", "2": "4px" }
    ```

### Components & Features

- **components** (boolean or object, optional) — Include component styles
  - true = defaults
  - false = none
  - object = custom component styles

- **animations** (boolean or object, optional) — Include animations
  - true = defaults (scanlineDrift, terminalBlink, pulse)
  - false = none
  - object = custom animations

- **states** (boolean or object, optional) — Include state styles
  - true = defaults (hover, active, focus, disabled)
  - false = none
  - object = custom states

## Color Palettes

### Matrix Classic
Balanced neon green on black. Most readable and accessible.
```json
"palette": "matrixClassic"
```
- Primary: `#00ff41` (Neon Green)
- Secondary: `#00ff41`
- Background: `#0a0e27` (Very Dark Blue)
- Text: `#00ff41`

### Matrix Neon
Bright lime green with cyan secondary. High energy.
```json
"palette": "matrixNeon"
```
- Primary: `#39ff14` (Bright Lime)
- Secondary: `#00ffff` (Cyan)
- Background: `#0a0a1a` (Black)
- Text: `#39ff14`

### Cyberpunk
Deep purple background with magenta and cyan. 80s aesthetic.
```json
"palette": "cyberpunk"
```
- Primary: `#ff00ff` (Magenta)
- Secondary: `#00ffff` (Cyan)
- Background: `#0d0221` (Deep Purple)
- Text: `#ff00ff`

## Typography Presets

### Monospace
Terminal-friendly fonts with code aesthetic.
```json
"typography": "monospace"
```
Fonts:
- Mono: Courier New, IBM Plex Mono, Roboto Mono
- Sans: Monaco, Menlo, Ubuntu Mono, Consolas

### Modern
System fonts with fallbacks for readability.
```json
"typography": "modern"
```
Fonts:
- Mono: SF Mono, Monaco, Menlo
- Sans: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

## Effects Presets

### Heavy
Full retro experience with all effects enabled.
```json
"effects": "heavy"
```
- Scanlines: 8% opacity
- Glow: Strong (12px blur)
- CRT: Enabled (2% curvature)
- Terminal: Enabled

**Best for:** Authentic retro/cyberpunk aesthetic, screenshots, branding

### Moderate
Balanced blend of retro and modern.
```json
"effects": "moderate"
```
- Scanlines: 3% opacity
- Glow: Medium (8px blur)
- CRT: Disabled
- Terminal: Enabled

**Best for:** Daily use, productivity, web apps

### Minimal
Performance-focused with subtle effects.
```json
"effects": "minimal"
```
- Scanlines: Disabled
- Glow: Light (4px blur)
- CRT: Disabled
- Terminal: Disabled

**Best for:** High performance, accessibility, minimal distraction

## Examples

### Example 1: Minimal Classic Green

```json
{
  "name": "Minimal Classic",
  "palette": "matrixClassic",
  "typography": "modern",
  "effects": "minimal",
  "spacing": "default",
  "components": true
}
```

Creates: Clean, readable Matrix theme for productive work

### Example 2: Heavy Synthwave

```json
{
  "name": "Synthwave Neon",
  "palette": "cyberpunk",
  "typography": "monospace",
  "effects": "heavy",
  "spacing": "default",
  "components": true,
  "tags": ["synthwave", "cyberpunk"]
}
```

Creates: Full 80s aesthetic with all retro effects

### Example 3: Custom Hybrid

```json
{
  "name": "Custom Hybrid",
  "palette": "cyberpunk",
  "colors": {
    "primary": "#ff00ff",
    "secondary": "#ffd60a",
    "background": "#0a0a1a",
    "text": "#ff00ff"
  },
  "typography": "monospace",
  "effects": {
    "scanlines": { "enabled": true, "opacity": 0.03 },
    "glow": { "enabled": true, "blur": "6px" },
    "crt": { "enabled": false }
  }
}
```

Creates: Unique hybrid theme with custom colors and selective effects

## Module Usage

Use as a Node.js module:

```javascript
const { createTheme, saveTheme, loadConfig, PALETTES } = 
  require('./scripts/theme-builder-batch.js');

// Load config from file
const config = loadConfig('./examples/theme-config.json');

// Create theme
const theme = createTheme(config);

// Save to file
const path = saveTheme(theme, 'my-theme.json');
console.log('Theme saved:', path);
```

### API

#### createTheme(config)

Creates a theme object from configuration.

**Parameters:**
- `config` (object) — Theme configuration

**Returns:** Theme object (JSON-serializable)

**Example:**
```javascript
const config = {
  name: 'My Theme',
  palette: 'matrixClassic',
  effects: 'moderate'
};

const theme = createTheme(config);
```

#### saveTheme(theme, filename)

Saves theme to JSON file.

**Parameters:**
- `theme` (object) — Theme object
- `filename` (string) — Output filename (e.g., 'my-theme.json')

**Returns:** Full file path

**Example:**
```javascript
const path = saveTheme(theme, 'my-theme.json');
// Saves to: /themes/my-theme.json
```

#### loadConfig(configPath)

Loads configuration from JSON file.

**Parameters:**
- `configPath` (string) — Path to config JSON file

**Returns:** Parsed configuration object

**Example:**
```javascript
const config = loadConfig('./examples/theme-config.json');
```

## Batch Generation

Create multiple themes from a directory of configs:

```bash
# Assuming configs in ./theme-configs/
for config in theme-configs/*.json; do
  npm run theme-builder-batch -- create "$config"
done
```

Or use the module:

```javascript
const fs = require('fs');
const path = require('path');
const { createTheme, saveTheme, loadConfig } = require('./scripts/theme-builder-batch.js');

const configDir = './theme-configs/';
const files = fs.readdirSync(configDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const config = loadConfig(path.join(configDir, file));
  const theme = createTheme(config);
  const outfile = config.filename || `${config.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  saveTheme(theme, outfile);
  console.log(`✓ Created ${outfile}`);
});
```

## Output

Generated theme JSON includes:

```json
{
  "name": "...",
  "description": "...",
  "version": "1.0.0",
  "type": "dark",
  "author": "...",
  "license": "MIT",
  "colors": { /* 12+ colors */ },
  "typography": { /* fonts, sizes, weights */ },
  "spacing": { /* spacing scale */ },
  "borderRadius": { /* radius scale */ },
  "shadows": { /* shadow definitions */ },
  "effects": { /* scanlines, glow, crt, terminal */ },
  "components": { /* button, input, card, badge, etc. */ },
  "animations": { /* scanlineDrift, terminalBlink, pulse, etc. */ },
  "states": { /* hover, active, focus, disabled */ },
  "metadata": { /* lastUpdated, production, tags, compatibility */ }
}
```

**File Location:** `/themes/{filename}.json`

## Tips

1. **Start simple** — Use palette + effects presets, customize later
2. **Test colors** — Verify contrast ratios for accessibility
3. **Iterate** — Generate multiple versions, compare side-by-side
4. **Keep metadata** — Use tags and description for organization
5. **Version control** — Commit config files, not generated themes

## Troubleshooting

**Theme not being created:**
- Verify config file is valid JSON
- Check required fields (at minimum: `name` and `palette`)
- Ensure `/themes/` directory exists (script creates it)

**Invalid config:**
```
Error: config file not found: examples/theme-config.json
```
- Verify file path is correct (relative to current directory)
- Use full paths if needed

**Module import fails:**
```
const { createTheme } = require('./scripts/theme-builder-batch.js');
```
- Ensure Node.js >= 18
- Check file permissions (chmod +x if needed)

## File Locations

- Config examples: `/examples/theme-config.json`
- Generated themes: `/themes/`
- Script: `/scripts/theme-builder-batch.js`
- Interactive tool: `/scripts/theme-builder.js`
- Guide: `/guides/theme-builder-guide.md`

## See Also

- Interactive theme builder: `/scripts/theme-builder.js`
- Theme builder guide: `/guides/theme-builder-guide.md`
- Built-in themes: `/themes/`
- Theme examples: `/examples/theme-builder-example.json`

---

**Theme Builder Batch** — Generate themes programmatically for Claude Code
