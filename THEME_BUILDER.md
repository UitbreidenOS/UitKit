# Theme Builder - Interactive Matrix-Inspired Theme Creation

A comprehensive toolkit for designing custom themes without code. Includes interactive wizard and programmatic batch generator.

## Quick Start

### Interactive Wizard (Recommended for First Time)

```bash
npm run theme-builder
```

Follow the 7-step wizard:
1. Theme basics (name, author, type)
2. Color scheme (4 palettes or custom)
3. Typography (3 presets or custom)
4. Visual effects (3 levels or custom)
5. Spacing & sizing
6. Component styles
7. Preview & export

**Time:** ~5 minutes per theme  
**Output:** `/themes/{theme-name}.json`

### Batch Generator (For Automation)

```bash
npm run theme-builder-batch -- create theme-config.json
```

Create config file:
```json
{
  "name": "My Theme",
  "palette": "matrixClassic",
  "effects": "moderate"
}
```

**Time:** Seconds per theme  
**Output:** `/themes/my-theme.json`

## What You Can Create

### Color Palettes
- **Matrix Classic** — Neon green on black (recommended)
- **Matrix Neon** — Bright lime with cyan
- **Matrix Cyber** — Magenta with dark purple
- **Cyberpunk** — Deep purple base with magenta/cyan
- **Custom** — Any hex colors you choose

### Typography
- **Monospace** — Terminal aesthetic (Courier, Monaco)
- **Modern** — System fonts (SF Mono, -apple-system)
- **Retro** — Retro fonts (MS Sans Serif, Courier)
- **Custom** — Define your own font stack

### Visual Effects
- **Heavy** — Full retro (scanlines 8%, glow 12px, CRT enabled)
- **Moderate** — Balanced (scanlines 3%, glow 8px)
- **Minimal** — Clean (glow 4px only)
- **Custom** — Pick each effect individually

### Components Included
Button, Input, Card, Badge, Dropdown, Modal, Tooltip, Divider, Code Block

## Installation

After export:

```bash
# Copy theme file
cp themes/my-theme.json ~/.claude/themes/

# In Claude Code:
# Type: /theme
# Select: Your custom theme
```

## Files

### Scripts
- `scripts/theme-builder.js` — Interactive 7-step wizard
- `scripts/theme-builder-batch.js` — Programmatic batch generator

### Documentation
- `guides/theme-builder-complete.md` — Master guide (start here)
- `guides/theme-builder-guide.md` — Interactive tool deep dive
- `scripts/THEME_BUILDER_README.md` — Quick reference
- `scripts/THEME_BUILDER_BATCH_README.md` — Batch generator reference

### Examples
- `examples/theme-builder-example.json` — Full example theme (Synthwave Neon)
- `examples/theme-config.json` — Batch config example

## Commands

```bash
# Interactive wizard
npm run theme-builder

# Batch generator - create theme
npm run theme-builder-batch -- create config.json

# Batch generator - list options
npm run theme-builder-batch -- list-palettes
npm run theme-builder-batch -- list-typography
npm run theme-builder-batch -- list-effects
```

## Common Workflows

### Workflow 1: Quick Theme (5 minutes)
```bash
npm run theme-builder
# Select: Cyberpunk palette → Monospace → Heavy effects
# Name it → Export
```

### Workflow 2: Batch Generation (Seconds)
```bash
# Edit config.json
npm run theme-builder-batch -- create config.json
```

### Workflow 3: Custom Hybrid
```bash
npm run theme-builder
# Choose: Custom palette → Select colors → Save
```

## Key Features

✓ Interactive wizard with live color preview  
✓ 4 predefined color palettes  
✓ 3 typography presets  
✓ 3 effects intensity levels  
✓ 9 UI components with variants  
✓ Auto-generated animations and states  
✓ Production-ready JSON export  
✓ Programmatic batch generation  
✓ Comprehensive documentation  
✓ Module API for integration  

## Generated Themes Include

- 40+ color definitions
- Typography (fonts, sizes, weights)
- Spacing scale (Tailwind-inspired)
- Shadows and glows
- Effects (scanlines, glow, CRT, terminal)
- Component styles (buttons, inputs, cards, etc.)
- Animations (scanlineDrift, terminalBlink, pulse, glitch)
- States (hover, active, focus, disabled)
- Metadata (version, author, tags)

## Theme Output Example

```json
{
  "name": "My Theme",
  "type": "dark",
  "colors": {
    "primary": "#00ff41",
    "secondary": "#00ffff",
    "background": "#0a0e27",
    "text": "#00ff41"
  },
  "typography": { ... },
  "effects": { ... },
  "components": { ... },
  "animations": { ... }
}
```

Save location: `/themes/my-theme.json`

## Documentation Map

**Start Here:**
- `guides/theme-builder-complete.md` — Comprehensive master guide

**Tool-Specific:**
- `guides/theme-builder-guide.md` — Interactive wizard details
- `scripts/THEME_BUILDER_README.md` — Interactive quick ref
- `scripts/THEME_BUILDER_BATCH_README.md` — Batch generator ref

**Examples:**
- `examples/theme-builder-example.json` — Full example theme
- `examples/theme-config.json` — Batch config example

## Tips

1. **Start simple** — Use presets, customize in JSON later
2. **Test colors** — Verify contrast ratios for accessibility
3. **Heavy effects** — Best for screenshots and branding
4. **Moderate effects** — Good for daily use
5. **Minimal effects** — Best for performance and accessibility

## Troubleshooting

**Theme not appearing:**
- Confirm file in `~/.claude/themes/` (not project folder)
- Restart Claude Code
- Verify JSON is valid

**Colors look wrong:**
- Check hex format: `#RRGGBB` (6 digits)
- Test in browser dev tools
- Verify terminal supports 24-bit color

**Effects not showing:**
- Check `enabled: true` for each effect
- Verify opacity > 0 for scanlines
- Confirm CSS animation names

## Advanced Usage

### As Node.js Module

```javascript
const { createTheme, saveTheme, loadConfig } = 
  require('./scripts/theme-builder-batch.js');

const config = loadConfig('./config.json');
const theme = createTheme(config);
saveTheme(theme, 'my-theme.json');
```

### Batch Generation Script

```bash
for config in configs/*.json; do
  npm run theme-builder-batch -- create "$config"
done
```

## Customization After Export

Edit JSON directly:

```json
{
  "colors": {
    "primary": "#new-color"
  },
  "effects": {
    "glow": { "blur": "12px" }
  }
}
```

## Related Resources

- Color picker: [Coolors.co](https://coolors.co)
- Contrast checker: [WebAIM](https://webaim.org/resources/contrastchecker/)
- JSON validator: [JSONLint](https://jsonlint.com)
- Built-in themes: `/themes/`
- Claude Code theme selector: `/theme` (in Claude Code)

## Examples

### Example 1: Minimal Dark
```
Palette: Matrix Classic
Typography: Modern
Effects: Minimal
```
Result: Clean, readable theme for coding

### Example 2: Heavy Synthwave
```
Palette: Cyberpunk
Typography: Monospace
Effects: Heavy
```
Result: Full 80s aesthetic with all effects

### Example 3: Custom Hybrid
```
Palette: Custom (Amber + Rose)
Typography: Monospace
Effects: Moderate
```
Result: Unique two-color terminal theme

## FAQ

**Q: Can I mix colors from different palettes?**  
A: Yes, use custom colors in batch generator.

**Q: How do I share themes?**  
A: Send the JSON file; others copy to `~/.claude/themes/`

**Q: Can themes have custom animations?**  
A: Yes, all generated themes include animations.

**Q: Is there a theme registry?**  
A: Themes are local only. Share via GitHub gist or your repo.

**Q: What hex format is required?**  
A: Standard 6-digit hex: `#RRGGBB` (e.g., `#00ff41`)

## Support

- Check `/guides/theme-builder-complete.md` for detailed help
- Review examples in `/examples/`
- Test colors at [Coolors.co](https://coolors.co)
- Verify contrast at [WebAIM](https://webaim.org/resources/contrastchecker/)

---

**Theme Builder** — Create beautiful Matrix-inspired themes for Claude Code without writing code
