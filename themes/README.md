# Claude Code Themes

A collection of 11 hand-crafted Claude Code themes with authentic color palettes from the most popular developer color schemes.

## Themes Included

| File | Name | Base | Accent |
|---|---|---|---|
| `matrix.json` | The Matrix | dark | `#00ff41` matrix green |
| `dracula.json` | Dracula | dark | `#bd93f9` purple |
| `nord.json` | Nord | dark | `#88c0d0` frost blue |
| `tokyo-night.json` | Tokyo Night | dark | `#7aa2f7` blue |
| `catppuccin.json` | Catppuccin Mocha | dark | `#cba6f7` lavender |
| `gruvbox.json` | Gruvbox | dark | `#d3869b` pink |
| `solarized-dark.json` | Solarized Dark | dark | `#268bd2` blue |
| `solarized-light.json` | Solarized Light | light | `#268bd2` blue |
| `monokai.json` | Monokai | dark | `#ae81ff` purple |
| `rose-pine.json` | Rose Pine | dark | `#c4a7e7` iris |
| `claudient-brand.json` | Claudient Brand | dark | `#ff8c00` orange |

## Featured: The Matrix Theme

The Matrix theme brings terminal-inspired aesthetics to Claude Code with:

- **Authentic Matrix Green Palette**: Primary color `#00ff41` with complementary dark (`#00cc33`) and light (`#00ff99`) variants
- **Terminal Typography**: Monospace fonts (JetBrains Mono, Fira Code, Courier New) with authentic terminal rendering
- **Visual Effects**: Glow auras, scanline animations, and terminal-style text shadows on all interactive elements
- **Component Styling**: Full customization of buttons, inputs, cards, code blocks, and tabs with Matrix aesthetics
- **Advanced Animations**: Glitch effect, scanline flicker, terminal cursor blink, and pulse glow
- **Production-Ready**: Comprehensive configuration with 500+ style properties and detailed installation guide
- **Cross-Platform**: Compatible with Claude Code, VS Code, and any ANSI-compliant terminal

See `matrix.json` for complete configuration or jump to [Matrix Installation Guide](#matrix-installation) below.

---

## How to Install

### Step 1 — Copy the theme file(s) to your Claude themes directory

```bash
# Copy a single theme
cp dracula.json ~/.claude/themes/

# Or copy all themes at once
cp *.json ~/.claude/themes/
```

If `~/.claude/themes/` does not exist yet, create it first:

```bash
mkdir -p ~/.claude/themes
```

### Step 2 — Apply the theme inside Claude Code

Run the theme command inside any Claude Code session:

```
/theme
```

This opens the theme picker. Select your installed theme from the list. The change takes effect immediately — no restart needed.

### Step 3 — Verify

Your prompt border, diff colors, plan mode highlights, and error/success indicators will all reflect the theme palette.

## Color Tokens Reference

Each theme overrides the following Claude Code color tokens:

| Token | Purpose |
|---|---|
| `claude` | Claude's response text and primary accent |
| `text` | General foreground text |
| `inactive` | Dimmed / secondary UI elements |
| `error` | Error messages and destructive diff lines |
| `success` | Success messages and added diff lines |
| `warning` | Warnings and caution highlights |
| `diffAdded` | Added lines in diffs |
| `diffRemoved` | Removed lines in diffs |
| `promptBorder` | Border around the input prompt |
| `planMode` | Highlight color when plan mode is active |

## Creating Your Own Theme

Copy any `.json` file as a starting point and change the hex values. The `base` field must be one of:

- `dark`
- `light`
- `dark-daltonized`
- `light-daltonized`

The `overrides` object accepts any subset of available color tokens — only the tokens you include are overridden; the rest inherit from the base theme.

---

## Matrix Installation Guide

### Claude Code Setup

```bash
mkdir -p ~/.claude/themes
cp matrix.json ~/.claude/themes/
```

Then run `/theme` inside Claude Code and select "The Matrix".

### VS Code Integration

Add to `~/.config/Code/User/settings.json`:

```json
{
  "workbench.colorCustomizations": {
    "[The Matrix]": {
      "editor.background": "#000000",
      "editor.foreground": "#00ff41",
      "editor.lineHighlightBackground": "#0a0a0a",
      "editor.selectionBackground": "#00ff4133",
      "terminal.ansiGreen": "#00ff41",
      "terminal.ansiBlack": "#000000",
      "editorBracketMatch.background": "#00ff4133"
    }
  }
}
```

### Keybindings Integration

Add to `~/.claude/keybindings.json`:

```json
{
  "key": "ctrl+shift+m",
  "command": "theme",
  "args": "matrix"
}
```

### Font Recommendations

For best results, install one or more monospace fonts:

- **JetBrains Mono** — https://www.jetbrains.com/lp/mono/
- **Fira Code** — https://github.com/tonsky/FiraCode
- **Roboto Mono** — https://fonts.google.com/specimen/Roboto+Mono

### Customization

Edit `~/.claude/themes/matrix.json` to tweak:

- **Colors**: Change `#00ff41` to any green variant (e.g., `#00dd33`, `#00ff00`, `#00ee44`)
- **Glow Intensity**: Adjust `effects.glow.blur` and `effects.glow.opacity`
- **Scanlines**: Set `effects.scanlines.enabled` to `false` to disable
- **Animation Speed**: Modify `duration` values in the `animations` object
- **Font Stack**: Edit `typography.mono.fontFamily` to prioritize your preferred font

### Palette Reference

| Color | Hex | Use |
|---|---|---|
| Matrix Green | `#00ff41` | Primary text, highlights, glow |
| Matrix Green Dark | `#00cc33` | Borders, inactive state |
| Matrix Green Light | `#00ff99` | Hover states, success |
| Matrix Green Muted | `#008811` | Disabled, secondary text |
| Terminal Black | `#000000` | Background |
| Terminal Black Light | `#0a0a0a` | Component backgrounds |
| Accent Red | `#ff0055` | Errors, destructive actions |
| Accent Cyan | `#00ffff` | Glitch effect secondary |
| Accent Yellow | `#ffff00` | Warnings, alternate highlight |

### Troubleshooting

**Glow effects not visible?**
- Ensure GPU acceleration is enabled in your terminal/editor
- Check that your display supports shadow rendering

**Fonts not loading?**
- Verify fonts are installed on your system
- Fall back to system monospace if preferred fonts unavailable

**Colors appear washed out?**
- Check terminal color depth is 24-bit true color
- Disable color reduction/palette limiting in terminal settings

**Animations too fast/slow?**
- Edit `duration` values in `effects` and `animations` sections
- Adjust `iterationCount` for repeating effects

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
