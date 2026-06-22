# Matrix Theme Showcase

A complete visual reference for The Matrix theme — terminal-inspired neon green aesthetic with scanlines, glow effects, and digital glitch animations.

---

## Color Palette

### Primary Colors

```
Primary Green       #00ff41  ████████████████████████████████████████ (Bright neon green)
Primary Light       #39ff14  ████████████████████████████████████████ (Lighter neon)
Primary Dark        #00cc33  ████████████████████████████████████████ (Deeper green)
```

### Background & Surface

```
Deep Background     #0a0e27  ████ (Primary interface background)
Surface Default     #0f1419  ██████ (Cards, panels, containers)
Surface Light       #1a1f2e  ████████████ (Hover states, elevated elements)
Surface Dark        #050812  ██ (Minimal darkness for code blocks)
Text Inverse        #000000  (Black text on bright backgrounds)
```

### Text Colors

```
Primary Text        #00ff41  Matrix green (default text)
Secondary Text      #00cc33  Slightly darker green (secondary labels)
Tertiary Text       #008000  Muted dark green (disabled, hint text)
Placeholder         #004d00  Very dark green (input placeholders)
```

### Status Colors

```
Success             #00ff41  ████████████████████████████████████████ (Green - matches primary)
Error               #ff004d  ██████████████ (Hot pink/red)
Warning             #ffb700  ████████████████████████ (Amber)
Info                #00d4ff  ████████████████████████ (Cyan)
```

### Terminal Colors (ANSI)

```
Black               #000000  ██ (Pure black)
Red                 #ff0055  ██████████████████ (Bright red)
Green               #00ff41  ████████████████████████████████████████ (Primary green)
Yellow              #ffff00  ████████████████████████████ (Bright yellow)
Blue                #0099ff  ████████████████████ (Bright blue)
Magenta             #ff00ff  ████████████████████████ (Bright magenta)
Cyan                #00ffff  ████████████████████████████████ (Bright cyan)
White               #ffffff  ████████████████████████████████████████ (Pure white)
```

---

## Typography

### Monospace Font Stack
```
Primary: JetBrains Mono
Fallback: Fira Code
Fallback: Roboto Mono
Fallback: Courier New
```

### Text Styles

#### Default
- Font Family: Courier New, JetBrains Mono, Fira Code, Roboto Mono, monospace
- Font Size: 13px
- Line Height: 1.6
- Letter Spacing: 0.02em
- Font Weight: 400 (Regular)

**Example:**
```
This is default text in the Matrix theme. It uses a monospace font 
with comfortable line spacing and light letter spacing.
```

#### Mono (Code-like)
- Font Family: JetBrains Mono, Fira Code, Roboto Mono, Courier New, monospace
- Font Size: 13px
- Line Height: 1.5
- Letter Spacing: 0.03em
- Font Weight: 500 (Medium)

**Example:**
```
const matrix = new Theme({ neon: true, glow: true });
matrix.activate().then(() => console.log('Welcome to the Matrix'));
```

#### Code Block
- Font Family: Fira Code, JetBrains Mono, Roboto Mono, Courier New, monospace
- Font Size: 12px
- Line Height: 1.4
- Letter Spacing: 0.01em
- Font Weight: 400 (Regular)

**Example:**
```python
def initialize_matrix_protocol():
    """
    Initialize Matrix theme protocol with enhanced glow effects.
    """
    config = {
        'glow': True,
        'scanlines': True,
        'glitch': True
    }
    return apply_theme(config)
```

#### Terminal
- Font Family: Courier New, JetBrains Mono, monospace
- Font Size: 13px
- Line Height: 1.6
- Letter Spacing: 0.02em
- Font Weight: 400 (Regular)
- Text Rendering: optimizeSpeed

**Example:**
```
$ echo "Welcome to The Matrix"
$ cursor_position=ready
$ glow_effects=enabled
```

---

## Component Examples

### Buttons

#### Default Button
```
┌─────────────────────────┐
│  EXECUTE COMMAND        │
└─────────────────────────┘
```
- Background: #0a0a0a
- Text Color: #00ff41
- Border: 1px solid #00cc33
- Border Radius: 2px (sharp corners)
- Padding: 8px 16px
- Text Shadow: 0 0 4px rgba(0, 255, 65, 0.4)
- Box Shadow: 0 0 8px rgba(0, 255, 65, 0.2)

#### Hover State
```
┌─────────────────────────┐
│  EXECUTE COMMAND        │ ✨
└─────────────────────────┘
```
- Background: #001a00 (darker green)
- Text Color: #00ff99 (lighter)
- Border Color: #00ff41 (brighter)
- Box Shadow: 0 0 16px rgba(0, 255, 65, 0.4), inset 0 0 6px rgba(0, 255, 65, 0.1)

#### Active State
```
┌─────────────────────────┐
│ ❯ EXECUTE COMMAND ❮     │
└─────────────────────────┘
```
- Background: #002200
- Box Shadow: inset 0 0 10px rgba(0, 255, 65, 0.3), 0 0 20px rgba(0, 255, 65, 0.5)
- Strong glow effect, pressed appearance

#### Disabled Button
```
┌─────────────────────────┐
│  EXECUTE COMMAND        │
└─────────────────────────┘
```
- Background: #050505
- Text Color: #008811 (muted)
- Border Color: #003300
- Opacity: 0.6
- Cursor: not-allowed

#### Danger Button
```
┌─────────────────────────┐
│  DELETE FOREVER         │ ⚠
└─────────────────────────┘
```
- Background: #330011 (dark red)
- Text Color: #ff0055 (hot pink)
- Border: 1px solid #cc0044
- Box Shadow: 0 0 8px rgba(255, 0, 85, 0.2)

#### Success Button
```
┌─────────────────────────┐
│  CONFIRM ACTION         │ ✓
└─────────────────────────┘
```
- Background: #001a00 (dark green)
- Text Color: #00ff41
- Border: 1px solid #00cc33
- Box Shadow: 0 0 8px rgba(0, 255, 65, 0.3)

---

### Input Fields

#### Default Input
```
┌──────────────────────────────────────┐
│ [Enter command...]                   │
└──────────────────────────────────────┘
```
- Background: #050505
- Text Color: #00ff41
- Border: 1px solid #00cc33
- Padding: 8px 12px
- Border Radius: 2px
- Text Shadow: 0 0 4px rgba(0, 255, 65, 0.3)
- Box Shadow: inset 0 0 6px rgba(0, 255, 65, 0.1)

#### Focus State
```
┌──────────────────────────────────────┐
│ [Enter command...]              ✦    │
└──────────────────────────────────────┘
```
- Background: #0a0a0a (slightly brighter)
- Border Color: #00ff41 (bright green)
- Box Shadow: inset 0 0 10px rgba(0, 255, 65, 0.15), 0 0 12px rgba(0, 255, 65, 0.4)
- Cursor visible with glow

#### Placeholder Text
```
┌──────────────────────────────────────┐
│ [~enter_username_here]               │
└──────────────────────────────────────┘
```
- Color: #008811 (muted green)
- Opacity: 0.7
- Italicized appearance

#### Text Selection
```
┌──────────────────────────────────────┐
│ Enter █████████████ here             │
└──────────────────────────────────────┘
```
- Background: #00ff4144 (transparent bright green)
- Text Color: #000000 (black on highlight)

---

### Cards & Containers

#### Default Card
```
╔════════════════════════════════════╗
║  CARD TITLE                   [X]  ║
╠════════════════════════════════════╣
║  Card content goes here            ║
║  Multiple lines supported          ║
║                                    ║
╠════════════════════════════════════╣
║  Footer text · Additional info     ║
╚════════════════════════════════════╝
```
- Background: #0a0a0a
- Border: 1px solid #00cc33
- Border Radius: 2px
- Padding: 16px
- Box Shadow: 0 0 20px rgba(0, 255, 65, 0.15), inset 0 0 10px rgba(0, 255, 65, 0.1)

#### Card Header
- Color: #00ff41 (bright green)
- Font Weight: Bold
- Font Family: JetBrains Mono
- Text Shadow: 0 0 6px rgba(0, 255, 65, 0.4)
- Border Bottom: 1px solid #008811
- Padding Bottom: 12px
- Font Size: 13px

#### Card Footer
- Color: #00cc33 (darker green)
- Border Top: 1px solid #008811
- Padding Top: 12px
- Font Size: 11px

#### Card Hover State
```
╔════════════════════════════════════╗
║  CARD TITLE              ✦    [X]  ║  Enhanced glow
╠════════════════════════════════════╣
║  Card content goes here            ║
║                                    ║
╚════════════════════════════════════╝
```
- Border Color: #00ff41 (brighter)
- Box Shadow: 0 0 30px rgba(0, 255, 65, 0.25), inset 0 0 10px rgba(0, 255, 65, 0.15)

---

### Code Blocks

#### Code Block Structure
```
┌──────────────────────────────────────┐
│ filename.js  [Copy] [►]              │  Header
├──────────────────────────────────────┤
│ 1 │ function initializeMatrix() {    │
│ 2 │   const theme = new Matrix();    │
│ 3 │   return theme.apply();          │
│ 4 │ }                                │
└──────────────────────────────────────┘
```
- Background: #000000 (pure black)
- Border: 1px solid #008811
- Border Radius: 2px
- Padding: 12px
- Font Family: Fira Code, JetBrains Mono, monospace
- Font Size: 12px
- Line Height: 1.5
- Color: #00ff41
- Text Shadow: 0 0 6px rgba(0, 255, 65, 0.4), 0 0 12px rgba(0, 255, 65, 0.2)
- Box Shadow: inset 0 0 10px rgba(0, 255, 65, 0.1), 0 0 20px rgba(0, 255, 65, 0.1)
- Max Height: 400px with scrollbar

#### Code Block Header
- Background: #050505
- Color: #00cc33
- Padding: 8px
- Border Bottom: 1px solid #008811
- Font Size: 11px
- Font Weight: Bold

#### Code Block Line Highlight
```
│ 3 │ >>> return theme.apply();       │
```
- Background: rgba(0, 255, 65, 0.1) (transparent green highlight)
- Border Left: 2px solid #00ff41 (bright green accent)

---

### Tabs

#### Inactive Tab
```
[ Code ]  [ Preview ]  [ Terminal ]
```
- Background: #050505
- Color: #008811 (muted)
- Border: 1px solid #003300
- Padding: 8px 12px
- Font Size: 11px
- Cursor: pointer

#### Active Tab
```
[ Code ]▓▓[ Preview ]  [ Terminal ]
       ▔▔▔
```
- Background: #0a0a0a
- Color: #00ff41 (bright)
- Border Color: #00cc33
- Border Bottom: 2px solid #00ff41
- Text Shadow: 0 0 4px rgba(0, 255, 65, 0.4)

#### Tab Hover
```
[ Code ]  [ Preview ]  [ Terminal ]
            ^^^^^^^^
```
- Background: #0a0a0a
- Color: #00cc33
- Border Color: #00cc33

---

### Badges

#### Default Badge
```
[✦ Status]  [✓ Success]  [⚠ Alert]
```
- Background: #001a00 (dark green)
- Color: #00ff41 (bright green)
- Border: 1px solid #00cc33
- Border Radius: 2px
- Padding: 2px 8px
- Font Size: 10px
- Font Weight: Bold

#### Error Badge
```
[✗ Failed]
```
- Background: #330011
- Color: #ff0055 (hot pink)
- Border Color: #cc0044

#### Warning Badge
```
[⚠ Caution]
```
- Background: #333300
- Color: #ffff00 (bright yellow)
- Border Color: #cccc00

---

### Links

#### Default Link
```
Click here for more information
     ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```
- Color: #00ff41
- Text Decoration: None
- Border Bottom: 1px dotted #00cc33

#### Link Hover
```
Click here for more information  ✨
     ━━━━━━━━━━━━━━━━━━━━━━
```
- Color: #00ff99 (lighter green)
- Border Bottom Style: Solid
- Text Shadow: 0 0 4px rgba(0, 255, 65, 0.4)

#### Visited Link
```
Click here for more information
     ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```
- Color: #00cc33 (darker green)
- Border Bottom Color: #008811

---

### Scrollbar

```
               ║
    Content    ║▓ Thumb
               ║▓ (draggable)
               ║▓
               ║
```
- Track Background: #050505
- Thumb (Scrollbar Handle): #00cc33
- Thumb Hover: #00ff41 (brighter on interaction)
- Width: 8px
- Border Radius: 4px (rounded corners)

---

## Visual Effects

### Glow Effect
Applied to primary elements, buttons, and text. Creates a neon appearance.
- Color: #00ff41
- Blur: 4px
- Spread: 0px
- Opacity: 0.5

**Visual:** `✦ Bright neon glow around edges`

### Scanlines
Subtle horizontal lines creating a CRT monitor aesthetic.
- Opacity: 0.15
- Height: 2px repeating
- Pattern: Transparent → Neon Green → Transparent
- Movement: Subtle animation

**Visual:**
```
████████████████████████
░░░░░░░░░░░░░░░░░░░░░░░░  Scanline row
████████████████████████
░░░░░░░░░░░░░░░░░░░░░░░░  Scanline row
```

### Text Shadow
Layered glow effect on text for depth.
- Primary: `0 0 8px rgba(0, 255, 65, 0.6), 0 0 16px rgba(0, 255, 65, 0.3)`
- Secondary: `0 0 4px rgba(0, 255, 65, 0.4)`
- Code: `0 0 6px rgba(0, 255, 65, 0.4), 0 0 12px rgba(0, 255, 65, 0.2)`

**Visual:** Text appears to glow outward

### Box Shadow
3D depth and focus indication.
- Inset: `inset 0 0 10px rgba(0, 255, 65, 0.2)` (interior glow)
- Focus: `0 0 12px rgba(0, 255, 65, 0.6)` (outer aura)
- Card: `0 0 20px rgba(0, 255, 65, 0.15), inset 0 0 10px rgba(0, 255, 65, 0.1)` (combined)

---

## Animations

### Glitch Effect
Digital distortion animation — emulates old CRT interference.
- Duration: 0.3s
- Keyframes: 5 positions with red/cyan color shifts
- Effect: Rapid text displacement + chromatic aberration

```
Keyframe    Text Position       Color Shadows
0%          [origin]            Red 0 0 → Cyan 2 2
20%         -2px, 2px          Red 2 2 → Cyan -2 -2
40%         2px, -2px          Red -2 -2 → Cyan 2 0
60%         -2px, 0px          Red 2 0 → Cyan -2 2
80%         2px, 2px           Red -2 2 → Cyan 2 -2
100%        [return origin]     Red 0 0 → Cyan 0 0
```

### Scanline Flicker
Subtle opacity flicker mimicking screen refresh.
- Duration: 0.15s
- Iteration: Infinite
- Effect: Text shadow pulses with opacity

```
Keyframe    Opacity    Text Shadow Intensity
0%          1.0        0 0 8px(0.8)
50%         0.97       0 0 8px(0.6)
100%        1.0        0 0 8px(0.8)
```

### Terminal Cursor
Blinking cursor with glow pulse.
- Duration: 1s
- Iteration: Infinite
- Effect: Cursor block alternates opacity + shadow intensity

```
Keyframe    Opacity    Box Shadow
0%          1.0        0 0 8px(0.8)
50%         0.3        0 0 4px(0.4)
100%        1.0        0 0 8px(0.8)
```

### Pulse Glow
Breathing glow on card/focus elements.
- Duration: 2s
- Iteration: Infinite
- Effect: Smooth brightness expansion and contraction

```
Keyframe    Box Shadow
0%          0 0 8px(0.4)
50%         0 0 20px(0.6)
100%        0 0 8px(0.4)
```

### Fade In
Smooth entrance with glow build-up.
- Duration: 0.3s
- Effect: Opacity and text shadow both fade in

```
Keyframe    Opacity    Text Shadow
from        0          0 0 4px(0.2)
to          1          0 0 8px(0.6)
```

---

## Theme File Location

### Installation Path
```
~/.claude/themes/matrix.json
```

### Directory Structure
```
~
└── .claude/
    └── themes/
        ├── matrix.json          (Main theme file)
        ├── other-theme.json     (Other themes)
        └── [additional themes]
```

### Verify Installation
```bash
# Check if directory exists
ls -la ~/.claude/themes/

# Check if matrix.json is present
cat ~/.claude/themes/matrix.json | head -20

# Count total themes
ls ~/.claude/themes/ | wc -l
```

---

## Claude Code Integration

### Activate Theme (Inside Claude Code)
```
/theme
```
Opens theme picker → Select "The Matrix" → Applied instantly

### Alternative: Direct Configuration
Edit `~/.claude/settings.json`:
```json
{
  "theme": "matrix",
  "theme.location": "~/.claude/themes/matrix.json",
  "effects.glow": true,
  "effects.scanlines": true,
  "effects.glitch": false
}
```

### Keybinding Shortcut
Edit `~/.claude/keybindings.json`:
```json
[
  {
    "key": "ctrl+shift+m",
    "command": "theme",
    "args": { "name": "matrix" },
    "description": "Quick toggle to Matrix theme"
  }
]
```

---

## VS Code Integration

### Step 1: Install VS Code Theme
1. Place `matrix.json` in: `~/.config/Code/User/themes/`
2. Restart VS Code
3. Open Command Palette: `Cmd+Shift+P`
4. Search: "Color Theme"
5. Select: "The Matrix"

### Step 2: Custom Token Colors
Add to `~/.config/Code/User/settings.json`:
```json
{
  "editor.tokenColorCustomizations": {
    "[The Matrix]": {
      "textmateRules": [
        {
          "scope": "string",
          "settings": {
            "foreground": "#00ff41"
          }
        },
        {
          "scope": "comment",
          "settings": {
            "foreground": "#008811",
            "fontStyle": "italic"
          }
        },
        {
          "scope": "keyword",
          "settings": {
            "foreground": "#00ff41",
            "fontStyle": "bold"
          }
        }
      ]
    }
  }
}
```

### Step 3: Editor Color Customization
Add to `~/.config/Code/User/settings.json`:
```json
{
  "workbench.colorCustomizations": {
    "[The Matrix]": {
      "editor.background": "#000000",
      "editor.foreground": "#00ff41",
      "editor.lineHighlightBackground": "#0a0a0a",
      "editor.selectionBackground": "#00ff4133",
      "editor.lineNumberActiveForeground": "#00ff41",
      "editor.lineNumberForeground": "#008811",
      "editorCursor.foreground": "#00ff41",
      "editorWhitespace.foreground": "#004d00",
      "editorBracketMatch.background": "#00ff4133",
      "editorBracketMatch.border": "#00ff41",
      "terminal.ansiGreen": "#00ff41",
      "terminal.ansiBlack": "#000000",
      "terminal.ansiBrightGreen": "#39ff14",
      "diffEditor.insertedTextBackground": "#00ff4122",
      "diffEditor.removedTextBackground": "#ff004d22"
    }
  }
}
```

### Step 4: Terminal Integration
Add to `~/.config/Code/User/settings.json`:
```json
{
  "terminal.integrated.fontFamily": "'JetBrains Mono', 'Fira Code', monospace",
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.lineHeight": 1.6,
  "terminal.integrated.env.osx": {
    "LS_COLORS": "di=32:ln=36:ex=31:*.js=32:*.json=32:*.md=36"
  }
}
```

---

## Complete Setup Instructions

### For Claude Code

**Step 1: Copy Theme File**
```bash
mkdir -p ~/.claude/themes
cp matrix.json ~/.claude/themes/
```

**Step 2: Activate in Claude Code**
- Run: `/theme`
- Select: "The Matrix"
- Changes apply immediately

**Step 3: Optional - Add Keyboard Shortcut**
```bash
# Add to ~/.claude/keybindings.json
{
  "key": "ctrl+shift+m",
  "command": "theme",
  "args": { "name": "matrix" }
}
```

### For VS Code (Optional Sync)

**Step 1: Install Theme**
```bash
mkdir -p ~/.config/Code/User/themes
cp matrix.json ~/.config/Code/User/themes/Matrix.json
```

**Step 2: Apply Theme**
- Command Palette: `Cmd+Shift+P`
- Search: "Color Theme"
- Select: "The Matrix"

**Step 3: Add Customizations**
- Open: `~/.config/Code/User/settings.json`
- Add token color rules (see VS Code Integration section above)

**Step 4: Verify**
- Open a code file
- Check syntax highlighting matches Matrix green palette
- Check terminal colors are correct

---

## Customization Guide

### Adjust Glow Intensity
Modify `effects.glow` in `matrix.json`:
```json
"glow": {
  "blur": "6px",      // Increase for softer glow
  "opacity": 0.7      // Increase for brighter glow
}
```

### Change Primary Green Color
Replace all instances of `#00ff41`:
```
#00ff41 → #00dd33 (slightly darker, more lime)
#00ff41 → #00ff00 (pure green)
#00ff41 → #39ff14 (brighter yellow-green)
```

### Disable Scanlines
In `matrix.json`, set:
```json
"scanlines": {
  "enabled": false
}
```

### Switch Monospace Font
Update `typography.mono.fontFamily`:
```json
"fontFamily": "'Roboto Mono', 'Courier New', monospace"
```

### Speed Up Animations
Reduce animation durations:
```json
"glitch": {
  "duration": "0.2s"    // Faster (from 0.3s)
}
```

### Reduce Glitch Effect
In `animations.glitch.keyframes`, modify offsets:
```json
"0%": { "transform": "translate(-1px, 1px)" }  // Smaller displacement
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Glow effects not visible | GPU acceleration disabled | Enable in terminal/editor settings |
| Fonts look wrong | Font not installed | Install JetBrains Mono or Fira Code |
| Colors appear washed out | 256-color mode instead of true color | Set `TERM=xterm-256color` or update to true color terminal |
| Animations are choppy | Frame rendering issues | Reduce animation duration or disable effects |
| Theme doesn't load | File not in correct directory | Verify path: `~/.claude/themes/matrix.json` |
| Terminal colors don't match | ANSI color override | Check terminal color scheme settings |
| Text too small/large | Font size mismatch | Adjust `typography.*.fontSize` values |
| Scanlines too bright | Opacity too high | Reduce `effects.scanlines.opacity` to 0.08-0.12 |

---

## Compatibility

| Component | Requirement | Status |
|-----------|-------------|--------|
| Claude Code | 1.0+ | Full support |
| VS Code | 1.60+ | Full support |
| Terminal | ANSI colors support | Full support |
| macOS | 10.15+ | Full support |
| Linux | Any distribution | Full support |
| Windows | WSL2 or native terminal | Full support (WSL2 recommended) |
| GPU | Recommended (not required) | Improves glow/shadow rendering |
| Font rendering | Subpixel antialiasing | Recommended for text clarity |

---

## Real-World Examples

### Code Editing
```javascript
// matrix-app.js
const MatrixTheme = {
  colors: {
    primary: '#00ff41',    // Bright neon green
    dark: '#000000',       // Deep black background
    accent: '#00ffff'      // Cyan accents
  },
  
  init() {
    console.log('█ Matrix protocol initialized');
    this.applyGlowEffects();
    return this.enableScanlines();
  }
};

MatrixTheme.init();  // ✓ Theme active
```

### Terminal Output
```
$ npm run dev
[✓] Matrix theme loaded
[✓] Glow effects: enabled
[✓] Scanlines: active at 2px
[✓] Text shadow: 0 0 8px
[✓] Cursor blinking: 1s cycle

$ curl api.example.com
████████████████████ 100% ✓
Response: { status: 'connected', mode: 'matrix' }
```

### Form Layout
```
┌───────────────────────────────────┐
│  MATRIX AUTHENTICATION            │
├───────────────────────────────────┤
│                                   │
│  Username: [_________________]    │
│  Password: [*_________________]   │
│                                   │
│  ┌──────────────┐ ┌──────────┐   │
│  │  [ Login ]   │ │ [ Help ] │   │
│  └──────────────┘ └──────────┘   │
│                                   │
│  [✓] Remember this device        │
│                                   │
├───────────────────────────────────┤
│  Enter The Matrix → Connected     │
└───────────────────────────────────┘
```

---

## Performance Notes

- **Glow effects:** Minimal CPU impact; GPU-accelerated when available
- **Scanlines:** Lightweight CSS animation, ~1% CPU overhead
- **Glitch animation:** Only triggers on interaction, not continuous
- **Text shadows:** Rendered at native resolution, crisp appearance
- **Scrollbar:** Efficient thumb rendering, no lag on large content

---

## About The Matrix Theme

Created for developers who embrace the terminal aesthetic and want a cohesive neon-green experience across Claude Code and VS Code. Inspired by classic hacker interfaces and CRT monitors, combining modern UI with retro-digital nostalgia.

**Design Principles:**
- High contrast for accessibility
- Consistent neon palette across all components
- Performance-optimized effects
- Fully customizable via JSON configuration
- Cross-platform compatibility

---

**Version:** 1.0.0  
**License:** MIT  
**Author:** tushar2704  
**Last Updated:** June 2026
