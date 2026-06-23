# Theme Builder - Interactive Matrix-Inspired Theme Creation Tool

A wizard-driven CLI tool for designing custom themes without writing code. Export to JSON, install in Claude Code, and enjoy your custom aesthetic.

## Features

- **Interactive Wizard** — 7-step guided workflow from colors to export
- **4 Predefined Palettes** — Matrix Classic, Neon, Cyber, Cyberpunk
- **Full Customization** — Colors, typography, spacing, effects, components
- **Live Preview** — See colors and settings at each step
- **Auto-Generated JSON** — Production-ready theme export
- **Effects Presets** — Heavy (full retro), Moderate (balanced), Minimal (clean)
- **Component Templates** — Buttons, inputs, cards, badges, modals, tooltips
- **Accessibility Focus** — Contrast-friendly defaults, WCAG-ready

## Quick Start

```bash
npm run theme-builder
```

Follow the wizard:
1. Theme basics (name, author, type)
2. Color scheme (palette selection)
3. Typography (font stack)
4. Visual effects (scanlines, glow, CRT)
5. Spacing & sizing
6. Component styles
7. Preview & export

Theme saves to: `/themes/{theme-name}.json`

## Installation

After export:

```bash
cp themes/my-theme.json ~/.claude/themes/
```

In Claude Code:
- Type `/theme`
- Select your custom theme
- Activates immediately

## Workflow

### Step 1: Theme Basics

```
Theme name: My Custom Theme
Description: A dark theme inspired by 80s cyberpunk
Author: your-name
Type: Dark / Light
```

### Step 2: Color Scheme

Choose from:
- **Matrix Classic** — Green on black, balanced
- **Matrix Neon** — Bright lime with cyan
- **Matrix Cyber** — Magenta with dark purple
- **Cyberpunk** — Deep purple with magenta/cyan
- **Custom** — Define each color manually

Each palette includes:
- Primary (main brand color)
- Secondary (accent)
- Background & Surface (containers)
- Status colors (error, success, warning, info)

### Step 3: Typography

Choose font stack:
- **Monospace** — Terminal-friendly (Courier, Monaco)
- **Modern** — System fonts (SF Mono, -apple-system)
- **Retro** — Retro fonts (MS Sans Serif)
- **Custom** — Define manually

Includes preset sizes: xs (11px) → 4xl (32px)

### Step 4: Visual Effects

Select intensity:
- **Heavy** — Scanlines 8%, strong glow 12px blur, CRT enabled
- **Moderate** — Scanlines 3%, medium glow 8px, no CRT
- **Minimal** — No scanlines, light glow 4px
- **Custom** — Toggle each effect individually

Available effects:
- Scanlines (CRT monitor lines)
- Glow (soft shadow around text)
- CRT curvature (curved screen)
- Terminal cursor (blinking block)

### Step 5: Spacing & Sizing

Use defaults or customize:
- Spacing scale: 0-64px (Tailwind-inspired)
- Border radius: 0-9999px (from sharp to full circle)

### Step 6: Component Styles

Apply base styles to:
- Button (variants: primary, secondary, ghost, danger)
- Input (text fields with focus states)
- Card (panels and containers)
- Badge (small labels)
- Dropdown (menus)
- Modal (dialogs)
- Tooltip (hover hints)

### Step 7: Preview & Export

Review theme summary and export to JSON:
```
Name: My Custom Theme
Type: dark
Colors: Green primary, Cyan secondary, Dark blue background
Effects: Scanlines + Glow enabled
```

Export options:
- Filename: `my-theme.json`
- Location: `/themes/my-theme.json`
- Install: Copy to `~/.claude/themes/`

## JSON Output Structure

```json
{
  "name": "My Custom Theme",
  "description": "...",
  "version": "1.0.0",
  "type": "dark",
  "author": "your-name",
  "license": "MIT",
  "colors": {
    "primary": "#00ff41",
    "primaryLight": "#39ff14",
    "secondary": "#00ffff",
    "background": "#0a0e27",
    "text": "#00ff41",
    "error": "#ff004d",
    "success": "#00ff41",
    "warning": "#ffb700",
    "info": "#00d4ff"
  },
  "typography": {
    "fontFamily": { "mono": "...", "sans": "..." },
    "fontSize": { "xs": "11px", "sm": "12px", ... },
    "fontWeight": { "normal": 400, "bold": 700, ... },
    "lineHeight": { "tight": 1.2, "normal": 1.5, ... }
  },
  "spacing": { "0": "0px", "1": "2px", "2": "4px", ... },
  "borderRadius": { "none": "0px", "sm": "2px", "base": "4px", ... },
  "shadows": { "sm": "...", "base": "...", "glow": "..." },
  "effects": {
    "scanlines": { "enabled": true, "opacity": 0.05, ... },
    "glow": { "enabled": true, "blur": "8px", ... },
    "crt": { "enabled": false, "curvature": "0%", ... },
    "terminal": { "cursor": { ... }, "textShadow": "..." }
  },
  "components": {
    "button": { "base": {...}, "variants": {...} },
    "input": { "base": {...}, "focus": {...} },
    "card": { "base": {...}, "hover": {...} },
    ...
  },
  "animations": {
    "scanlineDrift": { ... },
    "terminalBlink": { ... },
    "pulse": { ... },
    ...
  },
  "states": {
    "hover": { ... },
    "active": { ... },
    "focus": { ... },
    "disabled": { ... }
  },
  "metadata": {
    "lastUpdated": "2026-06-22",
    "production": false,
    "tags": ["custom", "matrix-inspired"],
    "compatibility": { ... }
  }
}
```

## Examples

### Example 1: Minimal Dark Theme

```
Theme: Minimal Dark
Palette: Matrix Classic
Typography: Modern
Effects: Minimal (no scanlines)
Spacing: Default
Export: minimal-dark.json
```

Result: Clean, high-contrast green on black with subtle glow.

### Example 2: Heavy Synthwave

```
Theme: Synthwave Neon
Palette: Cyberpunk
Typography: Monospace
Effects: Heavy (all enabled)
Spacing: Default
Export: synthwave-neon.json
```

Result: 80s-inspired magenta/cyan with scanlines, glow, and CRT.

### Example 3: Hybrid Custom

```
Theme: Amber Terminal
Palette: Custom (Amber #ffa500 + Rose #ff6b9d)
Typography: Monospace
Effects: Moderate
Spacing: Default
Export: amber-terminal.json
```

Result: Unique two-color terminal theme.

## Color Palettes Reference

### Matrix Classic
- Primary: `#00ff41` (Neon green)
- Secondary: `#00ff41`
- Background: `#0a0e27` (Very dark blue)
- Text: `#00ff41`

### Matrix Neon
- Primary: `#39ff14` (Bright lime)
- Secondary: `#00ffff` (Cyan)
- Background: `#0a0a1a` (Black)
- Text: `#39ff14`

### Matrix Cyber
- Primary: `#ff00ff` (Magenta)
- Secondary: `#00ffff` (Cyan)
- Background: `#0a0015` (Dark magenta)
- Text: `#ff00ff`

### Cyberpunk
- Primary: `#ff00ff` (Magenta)
- Secondary: `#00ffff` (Cyan)
- Background: `#0d0221` (Deep purple)
- Text: `#ff00ff`

## Typography Presets

### Monospace
```
Mono: 'Courier New', 'Courier', 'IBM Plex Mono', 'Roboto Mono', monospace
Sans: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace
```

### Modern
```
Mono: 'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace
Sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Retro
```
Mono: 'Courier New', 'Courier', 'MS Sans Serif', monospace
Sans: 'Courier New', 'Courier', 'MS Sans Serif', monospace
```

## Effects Explained

### Scanlines
Horizontal lines simulating CRT monitor raster. Use for retro aesthetic.
- Light: 3% opacity
- Medium: 5% opacity
- Heavy: 8% opacity

### Glow
Soft shadow/glow around text. Use for neon effect.
- Light: 4px blur
- Medium: 8px blur
- Heavy: 12px blur

### CRT Curvature
Curved screen effect like old monitors. Subtle visual enhancement.
- Off: 0%
- Subtle: 1%
- Pronounced: 2%

### Terminal Effects
Blinking cursor and text shadow. Use for authentic terminal feel.
- Cursor: Block style with animation
- Text shadow: 0 0 4px glow

## Customization After Export

Edit JSON directly to fine-tune:

```json
{
  "colors": {
    "primary": "#00ff41",
    "primaryLight": "#39ff14"
  },
  "effects": {
    "glow": { "blur": "12px" },
    "scanlines": { "opacity": 0.08 }
  }
}
```

Common tweaks:
- **Change primary color:** Update `colors.primary` and variants
- **Strengthen glow:** Increase `effects.glow.blur`
- **Enable scanlines:** Set `effects.scanlines.enabled: true`
- **Adjust spacing:** Edit `spacing` object
- **Add component variant:** Extend `components[name].variants`

## Tips & Best Practices

### Color Combinations

- **High Contrast:** Green (#00ff41) + Red (#ff004d) — dramatic, accessible
- **Analogous:** Green (#00ff41) + Cyan (#00ffff) + Blue (#0099ff) — cohesive
- **Triadic:** Green + Magenta + Amber — balanced, vibrant

### Typography

- Keep monospace as primary for authentic terminal feel
- Use sans-serif fallback for small screens
- Typical: 12-14px body, 24-32px headings

### Performance

- Fewer animations = better scrolling performance
- Heavy scanlines + CRT + glow can impact 60fps
- Test on low-end hardware

### Accessibility

- Maintain 4.5:1 contrast ratio for text (WCAG AA)
- Avoid pure red + pure green for colorblind users
- Use WebAIM Contrast Checker for verification

## Troubleshooting

**Theme not appearing after export:**
- Confirm file in `~/.claude/themes/` (not project folder)
- Restart Claude Code
- Check filename matches theme name

**Colors look wrong:**
- Verify hex format (e.g., `#00ff41` not `00ff41`)
- Test in browser dev tools
- Some terminals don't support 24-bit color

**Effects not showing:**
- Check `enabled: true` for each effect
- Verify opacity > 0 for scanlines
- Confirm CSS animation names

**Performance issues:**
- Disable scanlines or reduce opacity
- Reduce glow blur (e.g., 4px instead of 12px)
- Simplify animations

## File Locations

- **Built-in themes:** `/themes/`
- **Exported themes:** `/themes/{name}.json`
- **Installed themes:** `~/.claude/themes/`
- **Theme configuration:** `~/.claude/settings.json` (`"theme": "{name}"`)

## Related Documentation

- Guide: `/guides/theme-builder-guide.md`
- Themes directory: `/themes/`
- Example theme: `/examples/theme-builder-example.json`
- Theme schema: `/guides/theme-schema.md` (if available)

## License

Themes created with Theme Builder follow the same license as the template:
- Recommended: MIT, CC-BY-SA-4.0, or AGPL-3.0

Modify `"license"` field in JSON as needed.

---

**Made with Theme Builder** — Interactive theme creation for Claude Code
