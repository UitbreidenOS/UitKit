# Theme Builder Guide

Interactive tool for designing custom Matrix-inspired themes without writing code.

## Quick Start

```bash
npm run theme-builder
```

## Overview

Theme Builder is an interactive wizard that guides you through creating a complete, production-ready theme. It handles:

- **Color Selection** — Choose from 4 predefined palettes or define custom colors
- **Typography** — Pick monospace, modern, or retro font stacks
- **Visual Effects** — Configure scanlines, glow, CRT, and terminal effects
- **Spacing & Sizing** — Set padding, margin, and border-radius scales
- **Component Styles** — Apply default styles to buttons, inputs, cards, etc.
- **Export** — Generate JSON ready to use in Claude Code

## Workflow Steps

### Step 1: Theme Basics

Define your theme's identity:
- **Name** — Display name (e.g., "Neon Cyber")
- **Description** — Short summary
- **Author** — Your name
- **Type** — Dark or light theme

### Step 2: Color Scheme

Choose a starting palette or customize colors:

#### Predefined Palettes

- **Matrix Classic** — Original neon green on black, balanced and readable
- **Matrix Neon** — Bright lime green (#39ff14) with cyan secondary
- **Matrix Cyber** — Magenta primary with cyan secondary, darker background
- **Cyberpunk** — Deep purple background with magenta and cyan accents
- **Custom** — Define each color manually (hex format required)

#### Color Options

- `primary` — Main brand color
- `primaryLight` — Lighter variant for hover states
- `primaryDark` — Darker variant for pressed states
- `secondary` — Supporting accent color
- `background` — Main page/window background
- `surface` — Card, panel, and elevated surfaces
- `text` — Default text color
- `textSecondary` — Muted text (labels, hints)
- `error`, `success`, `warning`, `info` — Status colors

**Tip:** Use a color picker tool to find hex values. Test contrast ratios to ensure accessibility.

### Step 3: Typography

Select font stack and sizing:

#### Presets

- **Monospace** — Terminal-friendly monospace fonts (Courier, Monaco)
- **Modern** — System fonts with monospace fallback (SF Mono, -apple-system)
- **Retro** — Retro monospace fonts (MS Sans Serif, Courier New)
- **Custom** — Define font families and sizes manually

Default sizes are provided: `xs` (11px), `sm` (12px), `base` (13px), `lg` (14px), and larger.

**Tip:** Monospace fonts create authentic terminal aesthetics. Modern fonts improve readability on large screens.

### Step 4: Visual Effects

Configure visual enhancements:

#### Effect Presets

1. **Heavy**
   - Scanlines: 8% opacity
   - Glow: Strong blur (12px)
   - CRT curvature: 2%
   - Terminal effects: Enabled
   - Best for: Authentic retro/cyberpunk feel

2. **Moderate**
   - Scanlines: 3% opacity
   - Glow: Medium blur (8px)
   - CRT: Disabled
   - Terminal effects: Enabled
   - Best for: Balanced retro + modern usability

3. **Minimal**
   - Scanlines: Disabled
   - Glow: Light blur (4px)
   - CRT: Disabled
   - Terminal: Disabled
   - Best for: Clean, performance-focused themes

4. **Custom**
   - Toggle each effect individually
   - Adjust opacity and blur separately

**Effect Details:**

- **Scanlines** — Horizontal lines mimicking CRT monitors
- **Glow** — Soft shadow/glow around text and elements
- **CRT Curvature** — Curved screen effect like old monitors
- **Terminal Cursor** — Blinking block cursor with text shadow

### Step 5: Spacing & Sizing

Configure layout scale:

#### Default Scale

Uses Tailwind-inspired spacing: `0px, 2px, 4px, 6px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px`

Border radius: `0px, 2px, 4px, 6px, 8px, 12px, 16px, full (9999px)`

Select "Yes" for defaults or "No" to customize later in the JSON.

### Step 6: Component Styles

Apply base styles to UI components:

#### Components Included

- **Button** — Base styles + primary, secondary, ghost, danger variants
- **Input** — Text field styles with focus states
- **Card** — Surface styling for panels and containers
- **Badge** — Small label elements
- **Dropdown** — Menu styles
- **Modal** — Dialog and overlay
- **Tooltip** — Hover hints

Select "Yes" to apply defaults or "No" to customize in JSON afterward.

### Step 7: Preview & Export

Review your theme and export to JSON:

1. **Preview** — See theme name, colors, effects at a glance
2. **Export** — Save as `{name}.json` in `/themes/`
3. **Install** — Copy to `~/.claude/themes/` and activate in Claude Code

## Color Combinations (Examples)

### Matrix Classic Remix
```
Primary: #00ff41 (Neon Green)
Secondary: #00ffff (Cyan)
Background: #0a0e27 (Very Dark Blue)
Text: #00ff41
Status: Error #ff004d, Success #00ff41, Warning #ffb700
```

### Cyberpunk Magenta
```
Primary: #ff00ff (Magenta)
Secondary: #00ffff (Cyan)
Background: #0d0221 (Deep Purple)
Text: #ff00ff
Status: Error #ff006e, Success #00ff41, Warning #ffd60a
```

### Minimal Amber
```
Primary: #ffa500 (Amber)
Secondary: #ff6b9d (Rose)
Background: #1a1a2e (Dark Navy)
Text: #ffa500
Status: Error #ff0000, Success #00ff41, Warning #ffff00
```

## After Export

### File Location
Theme JSON is exported to: `/themes/{theme-name}.json`

### Installation

1. **Copy theme file:**
   ```bash
   cp themes/{theme-name}.json ~/.claude/themes/
   ```

2. **In Claude Code:**
   - Type `/theme`
   - Select your custom theme from the list
   - Theme activates immediately

3. **Make it default:**
   - Edit `~/.claude/settings.json`
   - Set: `"theme": "{theme-name}"`

### Customization After Export

Edit the JSON file directly to fine-tune:

```json
{
  "colors": {
    "primary": "#00ff41",
    "primaryLight": "#39ff14"
  },
  "effects": {
    "glow": {
      "blur": "8px",
      "intensity": "medium"
    }
  },
  "components": {
    "button": {
      "base": {
        "padding": "8px 12px"
      }
    }
  }
}
```

Common customizations:
- **Change primary color:** Update `colors.primary` and all color references
- **Adjust glow intensity:** Modify `effects.glow.blur` (higher = softer)
- **Enable scanlines:** Set `effects.scanlines.enabled: true`
- **Adjust spacing:** Edit `spacing` object values
- **Add component variants:** Extend `components[name].variants`

## Theme JSON Structure

```json
{
  "name": "Custom Theme",
  "description": "...",
  "version": "1.0.0",
  "type": "dark",
  "author": "your-name",
  "license": "MIT",
  "colors": { /* 12+ color definitions */ },
  "typography": { /* fonts, sizes, weights, line heights */ },
  "spacing": { /* 0, 1, 2, 4, 8, 12, 16... */ },
  "borderRadius": { /* none, sm, base, md, lg, xl, 2xl, full */ },
  "shadows": { /* sm, base, md, lg, xl, 2xl, glow, glowStrong */ },
  "effects": {
    "scanlines": { /* enabled, opacity, pattern, animation */ },
    "glow": { /* enabled, intensity, blur, spread */ },
    "crt": { /* enabled, curvature, vignette */ },
    "terminal": { /* cursor, text shadow */ }
  },
  "components": {
    "button": { /* base, variants, disabled */ },
    "input": { /* base, focus, placeholder, disabled */ },
    "card": { /* base, hover, elevated */ }
    /* ... more components ... */
  },
  "animations": { /* scanlineDrift, terminalBlink, glitch, pulse, etc. */ },
  "states": { /* hover, active, focus, disabled */ },
  "metadata": { /* lastUpdated, production, tags, compatibility */ }
}
```

## Tips & Best Practices

### Color Harmony

- **Complementary:** Green (#00ff41) + Red (#ff004d) — high contrast, dramatic
- **Analogous:** Green (#00ff41) + Cyan (#00ffff) + Blue (#0099ff) — cohesive, smooth
- **Triadic:** Green (#00ff41) + Magenta (#ff00ff) + Amber (#ffb700) — balanced, vibrant

### Typography

- Keep monospace as primary for authentic terminal feel
- Use sans-serif fallback for better readability on small screens
- Typical Matrix theme: 12-14px for body, 24-32px for headings

### Effects Balance

- **High contrast backgrounds** (black on blue) need less glow
- **Light surfaces** benefit from stronger scanlines for visual interest
- **Disable CRT curvature** unless specifically targeting retro aesthetics
- Use **terminal text shadow** sparingly to avoid blurring at small sizes

### Performance

- Fewer animations = better performance
- Heavy scanlines + CRT + glow can impact 60fps scrolling
- Test on lower-end hardware before shipping

### Accessibility

- Maintain 4.5:1 contrast ratio for text on backgrounds (WCAG AA)
- Avoid pure red (#ff0000) + pure green (#00ff00) for colorblind users
- Test with accessibility tools (WebAIM Contrast Checker)

## Troubleshooting

**Theme not appearing after export:**
- Confirm file is in `~/.claude/themes/` (not project themes/)
- Restart Claude Code
- Check filename matches `"name"` in JSON

**Colors look wrong:**
- Verify hex format (6 digits, e.g., `#00ff41` not `00ff41`)
- Test in browser dev tools to check rendered color
- Some terminal emulators don't support 24-bit true color

**Effects not showing:**
- Verify `enabled: true` for each effect section
- Check CSS animation names match effect definitions
- Scanlines require opacity > 0

**Performance issues:**
- Disable scanlines or reduce opacity
- Reduce glow blur value (e.g., 4px instead of 12px)
- Simplify animations or set iterationCount to 1

## Examples

### Minimal Dark
```bash
1. Theme: "Minimal Dark"
2. Palette: Matrix Classic
3. Typography: Modern
4. Effects: Minimal
5. Spacing: Default
6. Components: Yes
7. Export: minimal-dark.json
```

Result: Clean, fast, readable theme with subtle green glow.

### Heavy Cyberpunk
```bash
1. Theme: "Cyberpunk Neon"
2. Palette: Cyberpunk
3. Typography: Monospace
4. Effects: Heavy (enable CRT)
5. Spacing: Default
6. Components: Yes
7. Export: cyberpunk-neon.json
```

Result: Authentic retro-futuristic aesthetic with all visual effects.

### Custom Hybrid
```bash
1. Theme: "Custom Hybrid"
2. Palette: Custom (Purple #6A0DAD + Lime #00ff41 + Orange #FF6B35)
3. Typography: Custom (Monaco + SF Mono)
4. Effects: Custom (Scanlines only, no glow)
5. Spacing: Default
6. Components: Yes
7. Export: hybrid.json
```

Result: Unique three-color theme with retro scanlines only.

## See Also

- Matrix theme (built-in): `/themes/matrix.json`
- Color picker: [Coolors.co](https://coolors.co)
- Contrast checker: [WebAIM](https://webaim.org/resources/contrastchecker/)
- Theme documentation: `/guides/themes.md`
- Theme JSON spec: `/guides/theme-schema.md`
