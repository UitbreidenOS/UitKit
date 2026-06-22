# Matrix Theme Pack Installation Guide

A complete guide to installing and configuring the Matrix Theme Pack across Claude Code, VS Code, and Terminal environments.

---

## Prerequisites

Before installation, verify your system meets these requirements:

- **Claude Code:** v0.2.0 or later (`claude --version` to check)
- **VS Code:** v1.80 or later (for syntax highlighting and icon themes)
- **Terminal:** bash 4.0+, zsh 5.0+, or equivalent (for Terminal theme)
- **System colors:** 256-color terminal support minimum (24-bit/True Color recommended)
- **Node.js:** v16 or later (for theme building and validation tools)

Verify terminal capability:
```bash
echo $TERM
# Output should be: xterm-256color, tmux-256color, or alacritty (etc.)
```

For True Color verification:
```bash
# Run the color test script
printf "\x1b[38;2;0;255;0mGreen\x1b[0m\n"
# If text appears green, True Color is supported
```

---

## Installation

### Claude Code

#### Step 1: Download the Theme Pack

```bash
# Clone or download the Matrix Theme Pack
cd ~/.claude/themes
git clone https://github.com/your-org/matrix-theme-pack.git
# or download and extract the ZIP archive
```

#### Step 2: Configure in settings.json

Edit `.claude/settings.json` (or `.claude/settings.local.json` for user-level configuration):

```json
{
  "theme": {
    "name": "matrix-dark",
    "variant": "strict",
    "colorScheme": "matrix-primary"
  },
  "display": {
    "fontFamily": "Monaco, Menlo, 'Ubuntu Mono'",
    "fontSize": 12,
    "lineHeight": 1.6,
    "highContrast": false
  }
}
```

Available variants:
- **strict** — Pure Matrix (green on black, monospace only)
- **soft** — Matrix with UI refinements (reduced glow, anti-aliasing)
- **neon** — High-saturation variant for OLED displays
- **amber** — Classic amber-on-black alternative

#### Step 3: Apply the Theme

Restart Claude Code or use the slash command:

```
/config theme
```

Select "matrix-dark" from the list. Configuration takes effect immediately.

---

### VS Code

#### Step 1: Install the Extension

**Via VS Code Marketplace:**
1. Open VS Code
2. Press `Cmd+Shift+X` (macOS) or `Ctrl+Shift+X` (Linux/Windows)
3. Search for "Matrix Dark Theme"
4. Click Install

**Via CLI:**
```bash
code --install-extension matrix-dark-theme.matrix-dark
```

**Manual installation:**
```bash
# Download the .vsix file and install
code --install-extension ./matrix-dark-theme-1.0.0.vsix
```

#### Step 2: Activate the Theme

1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Linux/Windows)
2. Type "theme" and select "Preferences: Color Theme"
3. Select "Matrix Dark"

Or edit `.vscode/settings.json`:
```json
{
  "workbench.colorTheme": "Matrix Dark",
  "workbench.iconTheme": "matrix-icons"
}
```

#### Step 3: (Optional) Install Icon Theme

The Matrix Theme Pack includes matching icon sets:

```json
{
  "workbench.colorTheme": "Matrix Dark",
  "workbench.iconTheme": "matrix-icons",
  "workbench.productIconTheme": "matrix-icons"
}
```

#### Step 4: Font Configuration

For optimal appearance, configure a monospace font:

```json
{
  "editor.fontFamily": "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
  "editor.fontSize": 12,
  "editor.lineHeight": 1.6,
  "editor.fontLigatures": true
}
```

Recommended fonts:
- **Monaco** — Classic, available on all systems
- **JetBrains Mono** — Modern ligatures and clarity
- **Fira Code** — Excellent ligature support
- **Courier Prime** — Typewriter-style clarity

---

### Terminal

#### macOS (zsh/bash)

**Step 1: Copy Theme Files**

```bash
# For iTerm2
mkdir -p ~/.config/iterm2/colorschemes
cp matrix-theme-pack/terminal/iterm2/matrix.itermcolors ~/.config/iterm2/colorschemes/

# For Terminal.app
mkdir -p ~/Library/Preferences
cp matrix-theme-pack/terminal/macos/matrix.terminal ~/Library/Preferences/
```

**Step 2: Apply in iTerm2**

1. Open iTerm2 → Preferences → Profiles → Colors
2. Click "Color Presets..." (dropdown at bottom right)
3. Click "Import..." and select `matrix.itermcolors`
4. Select "matrix" from the preset list

**Step 3: Apply in Terminal.app**

1. Open Terminal.app → Preferences → Profiles
2. Click "Gear icon" → Import...
3. Select the `matrix.terminal` file
4. Make it the default by clicking "Default"

**Step 4: Configure Shell Prompt**

Add to `~/.zshrc` or `~/.bashrc`:

```bash
# Matrix theme variables
export CLICOLOR=1
export CLICOLOR_FORCE=1
export COLORTERM=truecolor

# Customize prompt colors
export PS1="\[\033[38;2;0;255;0m\]\u@\h\[\033[0m\]:\[\033[38;2;0;200;0m\]\w\[\033[0m\]\$ "
```

Reload shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

#### Linux (bash/zsh)

**Step 1: Copy Theme Files**

```bash
# For Gnome Terminal
mkdir -p ~/.local/share/gnome-terminal/color-schemes
cp matrix-theme-pack/terminal/linux/gnome/matrix.xml ~/.local/share/gnome-terminal/color-schemes/

# For other terminal emulators (Alacritty, Kitty, etc.)
mkdir -p ~/.config/alacritty
cp matrix-theme-pack/terminal/linux/alacritty/matrix.yml ~/.config/alacritty/
```

**Step 2: Apply in Gnome Terminal**

1. Open Gnome Terminal → Preferences
2. Click the profile → Colors
3. Select "Matrix" from the color scheme dropdown
4. Close preferences (changes apply immediately)

**Step 3: Apply in Alacritty**

Add to `~/.config/alacritty/alacritty.yml`:

```yaml
# Import the Matrix theme
import:
  - ~/.config/alacritty/matrix.yml

window:
  padding:
    x: 10
    y: 10
  opacity: 0.95

font:
  normal:
    family: Monaco
    style: Regular
  size: 12.0
```

#### Windows (PowerShell)

**Step 1: Install Windows Terminal**

```powershell
# Via Windows Package Manager
winget install Microsoft.WindowsTerminal
```

**Step 2: Import Theme**

```powershell
# Copy theme file
Copy-Item -Path "matrix-theme-pack\terminal\windows\matrix.json" `
  -Destination "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\"
```

**Step 3: Apply Theme**

1. Open Windows Terminal → Settings
2. Navigate to "Schemes"
3. Select "Matrix" from the dropdown
4. Set as default scheme

---

## Configuration

### Color Palette Customization

All themes support palette customization via JSON. Edit `~/.claude/themes/matrix-dark/config.json`:

```json
{
  "palette": {
    "background": "#000000",
    "foreground": "#00ff00",
    "accent": "#00cc00",
    "secondary": "#008800",
    "error": "#ff0000",
    "warning": "#ffaa00",
    "info": "#0088ff"
  },
  "glow": {
    "enabled": true,
    "intensity": 0.8,
    "spread": 2
  }
}
```

Apply changes:
```bash
# Claude Code
/config reload

# VS Code: Reload window
Cmd+R (macOS) or Ctrl+Shift+F5 (Linux/Windows)

# Terminal: Restart shell session
exit && open -a Terminal
```

### Opacity Settings

**Claude Code:**
```json
{
  "display": {
    "opacity": 0.95,
    "blur": 0.5
  }
}
```

**Terminal (iTerm2):**
- Preferences → Profiles → Window → Transparency
- Adjust slider (0 = opaque, 1 = transparent)

**Terminal (VS Code Integrated):**
```json
{
  "terminal.integrated.windowsEnableConpty": true,
  "terminal.integrated.env.osx": {
    "COLORTERM": "truecolor"
  }
}
```

### Font Customization

**Size variations by environment:**

```json
{
  "claudeCode": {
    "fontSize": 12
  },
  "vsCode": {
    "fontSize": 11
  },
  "terminal": {
    "fontSize": 13
  }
}
```

---

## Customization Options

### Creating a Variant

**Step 1: Copy the Base Theme**

```bash
cp -r ~/.claude/themes/matrix-dark ~/.claude/themes/matrix-custom
cd ~/.claude/themes/matrix-custom
```

**Step 2: Edit Color Definitions**

Open `colors.json`:

```json
{
  "colors": {
    "terminal.ansi.green": "#00ff00",
    "editor.background": "#000000",
    "editor.foreground": "#00ff00"
  }
}
```

**Step 3: Register the Variant**

Add to `.claude/settings.json`:

```json
{
  "theme": {
    "name": "matrix-custom",
    "path": "~/.claude/themes/matrix-custom"
  }
}
```

### Glow and Animation Effects

**Enable Matrix cascade effect (Claude Code):**

```json
{
  "effects": {
    "cascade": true,
    "cascadeSpeed": "medium",
    "cascadeCharacters": "01",
    "cascadeColor": "#00ff00"
  }
}
```

**Disable animations (for performance):**

```json
{
  "effects": {
    "cascade": false,
    "textGlow": false,
    "cursorBlink": false
  }
}
```

### Dark Mode Variants

Matrix Theme Pack includes time-based switching:

```json
{
  "theme": {
    "dayVariant": "matrix-soft",
    "nightVariant": "matrix-dark",
    "autoSwitch": true,
    "switchTime": "18:00"
  }
}
```

---

## Keyboard Shortcuts Integration

### Claude Code

Add Matrix-specific keybindings to `.claude/keybindings.json`:

```json
{
  "keybindings": [
    {
      "key": "cmd+shift+m",
      "command": "theme.toggle",
      "args": ["matrix-dark", "matrix-soft"],
      "when": "editorFocus"
    },
    {
      "key": "cmd+shift+g",
      "command": "effects.toggleGlow",
      "when": "editorTextFocus"
    },
    {
      "key": "cmd+shift+c",
      "command": "effects.toggleCascade",
      "when": "editorTextFocus"
    }
  ]
}
```

### VS Code

Add to `.vscode/keybindings.json`:

```json
[
  {
    "key": "cmd+shift+m",
    "command": "workbench.action.selectTheme",
    "args": "Matrix Dark"
  },
  {
    "key": "cmd+shift+alt+m",
    "command": "workbench.action.selectIconTheme",
    "args": "matrix-icons"
  }
]
```

### Terminal

**Add shell aliases for quick theme switching:**

```bash
# ~/.zshrc or ~/.bashrc
alias matrix-on='export COLORTERM=truecolor; clear'
alias matrix-off='export COLORTERM=; clear'
alias matrix-toggle='if [ "$COLORTERM" = "truecolor" ]; then matrix-off; else matrix-on; fi'

# Bind to Ctrl+Alt+M
bind '"\C-\M-m": "matrix-toggle\n"'  # bash
bindkey '^[^M' matrix-toggle          # zsh
```

---

## Performance Notes

### Rendering Optimization

Matrix Theme Pack includes effects that may impact performance on resource-constrained systems. Configure performance tier:

```json
{
  "performance": {
    "tier": "high",
    "renderQuality": "high",
    "enableEffects": true,
    "cascadeEnabled": true
  }
}
```

Performance tiers:
- **high** — All effects enabled, smooth animations
- **balanced** — Effects with reduced frequency, lower CPU usage
- **low** — Minimal effects, optimal for remote sessions or older hardware

### Recommended Settings by Hardware

**MacBook Pro (2019+):**
```json
{
  "performance": {"tier": "high"},
  "display": {"opacity": 0.9, "blur": 0.5}
}
```

**Standard Desktop (4-core CPU):**
```json
{
  "performance": {"tier": "balanced"},
  "effects": {"cascade": true, "cascadeSpeed": "slow"}
}
```

**Remote Session / Older Hardware:**
```json
{
  "performance": {"tier": "low"},
  "effects": {"cascade": false, "textGlow": false}
}
```

### Monitoring Resource Usage

**Claude Code:**
```
/debug performance
```

**VS Code (Developer Tools):**
```
Cmd+Shift+P → Developer: Toggle Developer Tools
```

**Terminal:**
```bash
# Monitor CPU/Memory with theme active
top -l 1 | head -20
```

### Lazy-Load Effects

Defer effect initialization to reduce startup time:

```json
{
  "effects": {
    "lazyLoad": true,
    "loadDelay": 500
  }
}
```

---

## Troubleshooting

### Colors Not Appearing Correctly

**Issue:** Theme colors appear muted or different than expected.

**Solutions:**
1. Verify terminal color support:
   ```bash
   echo $TERM
   # Must output: xterm-256color or higher
   ```

2. Force True Color:
   ```bash
   export COLORTERM=truecolor
   source ~/.zshrc
   ```

3. Check color depth:
   ```bash
   tput colors
   # Output should be 256 or higher
   ```

### Glow Effect Not Rendering

**Issue:** Text glow disabled or invisible.

**Solutions:**
1. Verify effect is enabled:
   ```json
   {
     "effects": {
       "textGlow": true,
       "glowIntensity": 0.8
     }
   }
   ```

2. Check GPU acceleration (Claude Code):
   ```
   /config debug
   ```

3. For VS Code, ensure no conflicting extensions:
   ```bash
   code --disable-extensions
   # Then re-test theme
   ```

### Icons Not Displaying

**Issue:** File/folder icons missing in VS Code Explorer.

**Solutions:**
1. Reinstall icon theme:
   ```bash
   code --install-extension matrix-icons --force
   ```

2. Clear VS Code cache:
   ```bash
   rm -rf ~/Library/Application\ Support/Code/Cache/
   code
   ```

3. Verify settings:
   ```json
   {
     "workbench.iconTheme": "matrix-icons",
     "workbench.productIconTheme": "matrix-icons"
   }
   ```

### Theme Not Persisting After Restart

**Issue:** Theme reverts to default on restart.

**Solutions:**
1. Ensure settings file exists and is valid JSON:
   ```bash
   cat ~/.claude/settings.json | jq .
   ```

2. Check file permissions:
   ```bash
   ls -la ~/.claude/settings.json
   # Should be readable/writable by user
   ```

3. Re-apply theme via UI (this forces persistence):
   - Claude Code: `/config theme`
   - VS Code: `Cmd+Shift+P` → "Color Theme"

### Cascade Effect Causing Lag

**Issue:** Cascade animation makes terminal unresponsive.

**Solutions:**
1. Disable cascade:
   ```json
   {
     "effects": {
       "cascade": false
     }
   }
   ```

2. Slow down cascade:
   ```json
   {
     "effects": {
       "cascadeSpeed": "very-slow",
       "cascadeSpacing": 50
     }
   }
   ```

3. Switch to balanced performance tier:
   ```json
   {
     "performance": {
       "tier": "balanced"
     }
   }
   ```

---

## Advanced: Building Custom Variants

### Theme Package Structure

```
matrix-theme-pack/
├── core/
│   ├── base.json          # Base color definitions
│   ├── effects.json       # Animation and glow configs
│   └── palette.json       # Full color palette
├── variants/
│   ├── strict.json        # Pure green-on-black
│   ├── soft.json          # UI-refined variant
│   ├── neon.json          # High-saturation
│   └── amber.json         # Amber-on-black
├── terminal/
│   ├── iterm2/            # macOS iTerm2
│   ├── linux/             # Linux terminal emulators
│   ├── macos/             # macOS Terminal.app
│   └── windows/           # Windows Terminal
└── tools/
    └── build.js           # Theme compiler
```

### Compile Custom Variant

```bash
cd matrix-theme-pack/tools
node build.js --input ../variants/custom.json --output ~/.claude/themes/matrix-custom
```

### Validate Theme

```bash
# Check JSON syntax
node tools/validate.js ~/.claude/themes/matrix-custom

# Test colors in terminal
node tools/preview.js ~/.claude/themes/matrix-custom
```

---

## Related Resources

- **Guides:** [Claude Code Configuration](claude-code-configuration.md), [VS Code Setup Guide](vs-code-setup-guide.md)
- **Skills:** `theme-customization`, `keyboard-shortcut-binding`
- **Tools:** Matrix Theme Builder CLI, Color Palette Validator
- **Community:** Share variants in `themes/community/`

---
