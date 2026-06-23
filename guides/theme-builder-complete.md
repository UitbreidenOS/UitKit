# Theme Builder Complete Guide

Master guide for creating custom Matrix-inspired themes with Theme Builder tools.

## Overview

Theme Builder provides two ways to create custom themes:

1. **Interactive Wizard** (`theme-builder.js`) — GUI-like step-by-step workflow
2. **Batch Generator** (`theme-builder-batch.js`) — Programmatic JSON-based generation

Both tools export production-ready JSON themes that install in Claude Code.

## When to Use Each Tool

### Interactive Wizard (`npm run theme-builder`)

Use when:
- Learning theme creation
- Designing themes interactively
- Testing ideas visually
- Building one-off custom themes
- Exploring color combinations

Flow:
```
Launch wizard → Answer questions → Preview → Export JSON → Install
```

Time: ~5 minutes per theme

### Batch Generator (`npm run theme-builder-batch`)

Use when:
- Automating theme generation
- Creating multiple themes
- Integrating into CI/CD
- Building theme libraries
- Programmatic customization

Flow:
```
Write config JSON → Run batch → Export JSON → Install
```

Time: Seconds per theme

## Quick Start

### Interactive (Recommended for First Time)

```bash
npm run theme-builder
```

Follow the wizard:
1. Enter theme basics (name, author, type)
2. Choose color palette (or customize)
3. Select typography preset
4. Pick effect intensity
5. Confirm spacing and components
6. Review and export

Theme saves to `/themes/{name}.json`

### Batch (For Automation)

Create config file (`theme-config.json`):
```json
{
  "name": "My Theme",
  "palette": "matrixClassic",
  "effects": "moderate"
}
```

Generate:
```bash
npm run theme-builder-batch -- create theme-config.json
```

Theme saves to `/themes/my-theme.json`

## Step-by-Step: Interactive Wizard

### Step 1: Theme Basics

Define your theme's identity:

**Name** — Display name in Claude Code theme menu
- Example: "Neon Cyber", "Minimal Dark", "Synthwave"

**Description** — Short summary for theme picker
- Example: "80s cyberpunk with magenta and cyan"

**Author** — Your name or team name

**Type** — Dark or light theme
- Dark: Best for terminal/code aesthetics
- Light: Better for readability, alternative workflows

### Step 2: Color Scheme

Choose starting palette or build custom:

#### Predefined Palettes

**Matrix Classic** ← Recommended for beginners
- Primary: Neon green `#00ff41`
- Balanced, readable, proven aesthetic

**Matrix Neon**
- Primary: Bright lime `#39ff14` 
- Higher energy, more vibrant

**Matrix Cyber**
- Primary: Magenta `#ff00ff`
- Alternative to green, cyberpunk vibe

**Cyberpunk**
- Primary: Magenta, Secondary: Cyan
- Deep purple background, authentic 80s feel

**Custom**
- Define each color manually (hex format)
- Full control over palette

#### Color Fields

- **Primary** — Main brand color (buttons, highlights)
- **Primary Light/Dark** — Variants for hover/pressed states
- **Secondary** — Supporting accent color
- **Background** — Main page/window background
- **Surface** — Cards, panels, elevated elements
- **Text** — Default body text
- **Text Secondary** — Muted text (labels, hints)
- **Error, Success, Warning, Info** — Status colors

**Tip:** Use [Coolors.co](https://coolors.co) to explore color combinations.

### Step 3: Typography

Choose font stack and sizing:

#### Typography Presets

**Monospace** ← Recommended for Matrix themes
- Courier New, Monaco, IBM Plex Mono
- Creates authentic terminal aesthetic

**Modern**
- System fonts (-apple-system, Segoe UI)
- Better readability on all screens

**Retro**
- Old monospace fonts
- Maximum authenticity

**Custom**
- Define fonts manually
- Full control

#### Font Sizes (Auto-Generated)

- xs: 11px (tiny text, badges)
- sm: 12px (captions, small UI)
- base: 13px (body text)
- lg: 14px (larger body)
- xl: 16px (subheading)
- 2xl: 18px
- 3xl: 24px (section header)
- 4xl: 32px (page title)

### Step 4: Visual Effects

Configure CRT monitor aesthetics:

#### Effect Presets

**Heavy** — Full retro experience
- Scanlines: 8% opacity (very visible)
- Glow: 12px blur (strong halo)
- CRT: 2% curvature (curved screen)
- Terminal: All effects enabled
- Use for: Authentic cyberpunk, screenshots, brand aesthetics

**Moderate** — Balanced retro + usability
- Scanlines: 3% opacity (subtle lines)
- Glow: 8px blur (medium halo)
- CRT: Disabled (flat screen)
- Terminal: Enabled
- Use for: Daily work, websites, general use

**Minimal** — Clean and fast
- Scanlines: Disabled
- Glow: 4px blur (light effect)
- CRT: Disabled
- Terminal: Disabled
- Use for: Performance, accessibility, minimal distraction

**Custom** — Pick each effect individually
- Toggle scanlines, glow, CRT independently
- Adjust opacity and blur amounts

#### Effect Details

**Scanlines**
- Horizontal lines mimicking CRT displays
- Adds visual interest but can reduce readability
- Opacity: 0-0.1 (0 = off, 0.08 = very visible)

**Glow**
- Soft halo around text and buttons
- Creates neon aesthetic
- Blur: 4-12px (larger = softer)

**CRT Curvature**
- Curved screen effect like old monitors
- Subtle cosmetic effect
- Curvature: 0-2% (0 = flat, 2% = noticeable curve)

**Terminal Effects**
- Blinking block cursor
- Text shadow glow
- Enhances terminal authenticity

### Step 5: Spacing & Sizing

Configure layout dimensions:

**Default Scale** ← Recommended
- Uses Tailwind CSS inspired scale
- 2px, 4px, 8px, 16px, 24px, 32px, 48px, 64px
- Border radius: 0px, 2px, 4px, 8px, 12px, 16px (full)
- Works well for most themes

**Custom**
- Define spacing values manually
- Useful for specific brand guidelines

### Step 6: Component Styles

Apply base styles to UI elements:

Components included:
- **Button** — Base + primary, secondary, ghost, danger variants
- **Input** — Text fields with focus states
- **Card** — Panels and containers
- **Badge** — Small labels and tags
- **Dropdown** — Menu styles
- **Modal** — Dialog and overlay
- **Tooltip** — Hover hints
- **Divider** — Separator lines

**Recommended:** Select "Yes" to apply defaults, then customize JSON later if needed.

### Step 7: Preview & Export

Review theme configuration:

**What You'll See:**
- Theme name and type
- Color samples with hex values
- Active effects
- Export filename

**Export:**
1. Enter filename (theme name suggested)
2. Theme saves to `/themes/{filename}.json`
3. Option to view installation instructions

**Install:**
```bash
# Copy theme to user themes directory
cp themes/{theme-name}.json ~/.claude/themes/

# In Claude Code: /theme → select your theme
```

## Step-by-Step: Batch Generator

### Creating Config Files

Minimal config:
```json
{
  "name": "My Theme",
  "palette": "matrixClassic"
}
```

Full config:
```json
{
  "name": "My Theme",
  "description": "Custom theme description",
  "type": "dark",
  "author": "Your Name",
  "palette": "cyberpunk",
  "typography": "monospace",
  "effects": "moderate",
  "spacing": "default",
  "components": true,
  "animations": true,
  "states": true,
  "production": false,
  "tags": ["custom", "cyberpunk"],
  "filename": "my-theme.json"
}
```

### Config Reference

**Metadata:**
- `name` (required) — Theme name
- `description` — Theme description
- `type` — "dark" (default) or "light"
- `author` — Author name
- `license` — License type (MIT, etc.)
- `production` — true/false for production readiness

**Styling:**
- `palette` — "matrixClassic", "matrixNeon", "cyberpunk", or custom colors object
- `typography` — "monospace", "modern", or custom typography object
- `effects` — "heavy", "moderate", "minimal", or custom effects object
- `spacing` — "default" or custom spacing object

**Features:**
- `components` — true (defaults), false (none), or object
- `animations` — true (defaults), false (none), or object
- `states` — true (defaults), false (none), or object

**Organization:**
- `tags` — Array of tags for categorization
- `filename` — Export filename (e.g., "my-theme.json")

### Generating Themes

Single theme:
```bash
npm run theme-builder-batch -- create theme-config.json
```

List available options:
```bash
npm run theme-builder-batch -- list-palettes
npm run theme-builder-batch -- list-typography
npm run theme-builder-batch -- list-effects
```

### Batch Generation Script

Generate multiple themes from configs directory:

```bash
#!/bin/bash
for config in theme-configs/*.json; do
  npm run theme-builder-batch -- create "$config"
done
```

Or use JavaScript:
```javascript
const fs = require('fs');
const path = require('path');
const { createTheme, saveTheme, loadConfig } = 
  require('./scripts/theme-builder-batch.js');

const configDir = './theme-configs/';
fs.readdirSync(configDir)
  .filter(f => f.endsWith('.json'))
  .forEach(file => {
    const config = loadConfig(path.join(configDir, file));
    const theme = createTheme(config);
    const fname = config.filename || 
      `${config.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    saveTheme(theme, fname);
    console.log(`✓ Created ${fname}`);
  });
```

## Common Themes

### Matrix Classic (Minimal)
```bash
npm run theme-builder
# Choose: Matrix Classic palette, Modern typography, Minimal effects
```

Result: Clean green on black, perfect for coding

### Synthwave 80s
```bash
npm run theme-builder
# Choose: Cyberpunk palette, Monospace typography, Heavy effects
```

Result: Full retro aesthetic with scanlines and glow

### Minimal Professional
```bash
npm run theme-builder
# Choose: Matrix Classic palette, Modern typography, Minimal effects
# Disable scanlines
```

Result: Clean, readable, subtle Matrix influence

### Custom Hybrid
Use batch generator with custom colors:

```json
{
  "name": "Amber Terminal",
  "palette": "matrixClassic",
  "colors": {
    "primary": "#ffa500",
    "secondary": "#ff6b9d",
    "background": "#0a0a0a",
    "text": "#ffa500"
  },
  "effects": "moderate"
}
```

## After Export

### Installation

```bash
# Step 1: Copy theme file
cp themes/my-theme.json ~/.claude/themes/

# Step 2: In Claude Code, run: /theme
# Step 3: Select your theme from the list

# Step 4 (Optional): Make default
# Edit ~/.claude/settings.json:
# "theme": "my-theme"
```

### Customization

Edit exported JSON directly:

**Change primary color globally:**
```json
{
  "colors": {
    "primary": "#new-color",
    "primaryLight": "#lighter-variant",
    "primaryDark": "#darker-variant"
  }
}
```

**Strengthen glow:**
```json
{
  "effects": {
    "glow": {
      "blur": "12px"  // was 8px
    }
  }
}
```

**Enable scanlines:**
```json
{
  "effects": {
    "scanlines": {
      "enabled": true
    }
  }
}
```

**Add component variant:**
```json
{
  "components": {
    "button": {
      "variants": {
        "custom": {
          "background": "rgba(255, 0, 255, 0.2)",
          "color": "#ff00ff"
        }
      }
    }
  }
}
```

### Sharing Themes

1. **Export JSON** — Already in `/themes/`
2. **Share file** — Send .json file to others
3. **Installation** — Recipient copies to `~/.claude/themes/`

Or share as GitHub Gist, npm package, or theme registry.

## Best Practices

### Color Design

1. **Start with primary color** — Everything else derives from it
2. **Create variants** — Light and dark shades for state changes
3. **Choose secondary** — Complementary or analogous to primary
4. **Status colors** — Error (red), Success (green), Warning (yellow), Info (blue)
5. **Test contrast** — Use WebAIM Contrast Checker for accessibility
6. **Avoid pure RGB** — Soften pure colors for readability

### Typography

1. **Monospace primary** — Authentic terminal feel
2. **Set font sizes** — Plan for headings, body, captions
3. **Use consistent weights** — Normal (400), Bold (700) minimum
4. **Line height matters** — 1.5 for body, 1.2 for headings
5. **Letter spacing** — Monospace: tight, Sans: normal

### Effects

1. **Heavy** — Screenshots, branding, marketing
2. **Moderate** — Daily use, websites, apps
3. **Minimal** — Performance, accessibility
4. **Test on hardware** — Confirm performance on real devices
5. **User preference** — Some users disable animations/effects

### Components

1. **Apply defaults** — Save time, ensure consistency
2. **Customize later** — Start simple, add complexity as needed
3. **Hover states** — Always define hover variants
4. **Focus states** — Critical for accessibility
5. **Disabled states** — Use opacity or grayscale

## Troubleshooting

### Theme Not Appearing

**Problem:** Theme not showing in Claude Code theme picker

**Solutions:**
1. Verify file in correct location: `~/.claude/themes/{name}.json`
2. Restart Claude Code completely
3. Check filename matches theme name in JSON
4. Ensure valid JSON (use JSON validator)

### Colors Look Wrong

**Problem:** Exported colors appear different

**Solutions:**
1. Verify hex format: `#RRGGBB` (6 digits)
2. Test in browser: Type `#hexcode` into browser dev tools
3. Check terminal supports 24-bit color: `echo $TERM`
4. Some terminals require TERM=xterm-256color

### Effects Not Showing

**Problem:** Scanlines, glow, CRT effects missing

**Solutions:**
1. Verify `"enabled": true` for each effect
2. Check opacity > 0 for scanlines
3. Confirm CSS animation names in keyframes
4. Effects may be disabled by user in settings

### Performance Issues

**Problem:** Slow scrolling, high CPU usage

**Solutions:**
1. Disable or reduce scanlines opacity
2. Reduce glow blur (8px instead of 12px)
3. Disable CRT curvature
4. Simplify animations (fewer iterations)
5. Profile with DevTools Performance tab

### Accessibility Issues

**Problem:** Low contrast, hard to read

**Solutions:**
1. Increase background darkness
2. Increase text brightness
3. Use WebAIM Contrast Checker
4. Test with accessibility tools
5. Follow WCAG AA guidelines (4.5:1 ratio)

## Related Documentation

- **Interactive Tool Guide** — `/guides/theme-builder-guide.md`
- **Batch Generator Guide** — `/scripts/THEME_BUILDER_BATCH_README.md`
- **Built-in Themes** — `/themes/`
- **Example Config** — `/examples/theme-config.json`
- **Example Theme** — `/examples/theme-builder-example.json`

## Tools & Resources

### External Tools

- **Color Picker** — [Coolors.co](https://coolors.co)
- **Contrast Checker** — [WebAIM Contrast](https://webaim.org/resources/contrastchecker/)
- **JSON Validator** — [JSONLint](https://jsonlint.com)
- **Color Names** — [Chir.ag Colors](http://chir.ag/projects/ntcolor/)

### Related Features

- `/theme` — Theme selector in Claude Code
- `/settings` — Edit theme settings and defaults
- Theme marketplace — Browse and install community themes

## FAQ

**Q: Can I mix palettes?**
A: Yes, use custom colors in batch generator to combine colors from multiple palettes.

**Q: How do I undo changes?**
A: Keep original theme file, create new themes from scratch, or use git history.

**Q: Can themes have animations?**
A: Yes, themes can include custom keyframe animations (scanlineDrift, glitch, pulse, etc.).

**Q: Is there a theme registry?**
A: Themes are local only. Share via GitHub gist or your own repo.

**Q: Can I use other color formats?**
A: Currently hex only (#RRGGBB). Convert RGB/HSL to hex with a tool.

**Q: How do I debug theme issues?**
A: Check browser console (Claude Code DevTools), verify JSON, test colors separately.

---

**Theme Builder** — Create beautiful Matrix-inspired themes for Claude Code without code
