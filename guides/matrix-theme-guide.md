# Matrix Theme Pack — Comprehensive Guide

**Last updated: June 2026 | Audience: developers and terminal enthusiasts**

---

## What This Guide Covers

The Matrix Theme Pack is a cohesive, green-on-black aesthetic that spans Claude Code, VS Code, and terminal emulators. This guide covers installation across all three platforms, customization patterns (color overrides, variant creation, effect tuning), combining Matrix themes with keybindings for an integrated cyberpunk workflow, troubleshooting every common failure mode, and design inspiration for embracing the Matrix aesthetic beyond configuration.

---

## Installation

### Claude Code

#### Step 1: Download and Register the Theme

```bash
# Option A: Clone from repository
cd ~/.claude/themes
git clone https://github.com/your-org/matrix-theme-pack.git

# Option B: Manual download
mkdir -p ~/.claude/themes/matrix-dark
cd ~/.claude/themes/matrix-dark
unzip /path/to/matrix-theme-pack.zip
```

Verify the theme directory structure:
```bash
ls -la ~/.claude/themes/matrix-dark/
# Should contain: colors.json, effects.json, config.json, variants/
```

#### Step 2: Configure settings.json

Edit `~/.claude/settings.json` (create if missing):

```json
{
  "theme": {
    "name": "matrix-dark",
    "variant": "strict",
    "colorScheme": "matrix-primary",
    "fallback": "matrix-soft"
  },
  "display": {
    "fontFamily": "Monaco, Menlo, 'Ubuntu Mono'",
    "fontSize": 12,
    "lineHeight": 1.6,
    "highContrast": false
  }
}
```

**Theme variants explained:**

| Variant | Appearance | Best for |
|---|---|---|
| `strict` | Pure green on black, no UI smoothing | Nostalgic, minimal CPU overhead |
| `soft` | Green with anti-aliased edges, subtle shadows | Modern comfort without losing aesthetic |
| `neon` | Saturated bright green, glow effects enabled | OLED displays, high-contrast environments |
| `amber` | Classic amber-on-black (#FFAA00) | Readability, color-blind friendly |

#### Step 3: Apply the Theme

Restart Claude Code or use:

```
/config theme
```

Select "matrix-dark" from the dropdown. The theme applies immediately without restart.

**Verify activation:**
```
/debug theme
```

Should output: `Active theme: matrix-dark | Variant: strict | Performance tier: high`

---

### VS Code

#### Step 1: Install via Marketplace

**Method A: UI**
1. Press `Cmd+Shift+X` (macOS) / `Ctrl+Shift+X` (Linux/Windows)
2. Search: "Matrix Dark Theme"
3. Click "Install"

**Method B: CLI**
```bash
code --install-extension matrix-dark-theme.matrix-dark
code --install-extension matrix-dark-icons.matrix-icons
```

**Method C: Manual**
```bash
# Download .vsix from GitHub releases
code --install-extension ./matrix-dark-theme-1.2.0.vsix
```

#### Step 2: Activate Theme and Icons

Edit `.vscode/settings.json`:

```json
{
  "workbench.colorTheme": "Matrix Dark",
  "workbench.iconTheme": "matrix-icons",
  "workbench.productIconTheme": "matrix-icons",
  "editor.fontFamily": "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
  "editor.fontSize": 12,
  "editor.lineHeight": 1.6,
  "editor.fontLigatures": false,
  "terminal.integrated.fontFamily": "Monaco"
}
```

Or use the command palette:
- `Cmd+Shift+P` → "Preferences: Color Theme" → "Matrix Dark"
- `Cmd+Shift+P` → "Preferences: File Icon Theme" → "matrix-icons"

#### Step 3: Terminal Integration (Optional)

To use Matrix colors in VS Code's integrated terminal:

```json
{
  "terminal.integrated.env.osx": {
    "COLORTERM": "truecolor"
  },
  "terminal.integrated.env.linux": {
    "COLORTERM": "truecolor"
  },
  "terminal.integrated.cwd": "${workspaceFolder}"
}
```

---

### Terminal Emulators

#### macOS: iTerm2

**Step 1: Import Color Scheme**

```bash
mkdir -p ~/.config/iterm2/colorschemes
cp matrix-theme-pack/terminal/iterm2/matrix.itermcolors ~/.config/iterm2/colorschemes/
```

**Step 2: Apply in Preferences**

1. Open iTerm2 → Preferences → Profiles → Colors
2. Click "Color Presets..." (dropdown, bottom-right)
3. Click "Import..."
4. Select `matrix.itermcolors`
5. Select "matrix" from the preset list

**Step 3: Configure Profile**

In the same Colors tab:
- **Foreground:** 0, 255, 0 (bright green)
- **Background:** 0, 0, 0 (black)
- **Cursor:** 0, 255, 0 (matches foreground for seamless blend)
- **Cursor Text:** 0, 0, 0 (black text on cursor)

**Step 4: Optimize Text Rendering**

1. Profiles → Text → Font
   - Select: Monaco, 12pt
   - Disable "Use ligatures" if text jumps
2. Profiles → Window
   - Transparency: 0 (solid black)
   - Blur: 0 (no blur, pure black background)

#### macOS: Terminal.app

**Step 1: Import Theme**

```bash
# Copy the .terminal file
cp matrix-theme-pack/terminal/macos/matrix.terminal ~/Downloads/
```

**Step 2: Import Profile**

1. Terminal.app → Preferences → Profiles
2. Click gear icon → "Import..."
3. Select `matrix.terminal`
4. Click "Default" to set as default profile

**Step 3: Font Configuration**

1. Profiles → Text
   - Font: Monaco, 12pt
   - Antialias text: ON

#### Linux: Gnome Terminal

**Step 1: Install Color Scheme**

```bash
mkdir -p ~/.local/share/gnome-terminal/color-schemes
cp matrix-theme-pack/terminal/linux/gnome/matrix.xml ~/.local/share/gnome-terminal/color-schemes/
```

**Step 2: Apply Theme**

1. Open Gnome Terminal → Preferences
2. Click profile → Colors
3. Select "Matrix" from the color scheme dropdown
4. Close preferences (changes apply immediately)

#### Linux: Alacritty

**Step 1: Copy Theme**

```bash
mkdir -p ~/.config/alacritty
cp matrix-theme-pack/terminal/linux/alacritty/matrix.yml ~/.config/alacritty/
```

**Step 2: Configure alacritty.yml**

```yaml
import:
  - ~/.config/alacritty/matrix.yml

window:
  opacity: 1.0
  padding:
    x: 10
    y: 10

font:
  normal:
    family: Monaco
    style: Regular
  size: 12.0

cursor:
  style: Beam
  vi_mode_style: Beam
```

Reload:
```bash
# Alacritty reloads automatically on config changes
# Or send SIGHUP: pkill -HUP alacritty
```

#### Windows: Windows Terminal

**Step 1: Export Theme**

```powershell
# Copy Matrix scheme definition
Copy-Item -Path "matrix-theme-pack\terminal\windows\matrix.json" `
  -Destination "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_*\LocalState\schemes"
```

**Step 2: Import Theme (Alternative)**

1. Open Windows Terminal → Settings
2. Click "Open JSON file"
3. Add to `schemes` array:

```json
{
  "name": "Matrix",
  "background": "#000000",
  "foreground": "#00FF00",
  "cursorColor": "#00FF00",
  "black": "#000000",
  "red": "#FF0000",
  "green": "#00FF00",
  "yellow": "#FFAA00",
  "blue": "#0088FF",
  "purple": "#FF00FF",
  "cyan": "#00FFFF",
  "white": "#FFFFFF",
  "brightBlack": "#008800",
  "brightRed": "#FF8800",
  "brightGreen": "#00FF00",
  "brightYellow": "#FFFF00",
  "brightBlue": "#00CCFF",
  "brightPurple": "#FF00FF",
  "brightCyan": "#00FFFF",
  "brightWhite": "#FFFFFF"
}
```

**Step 3: Apply Theme**

Add to profiles:
```json
{
  "profiles": {
    "defaults": {
      "colorScheme": "Matrix",
      "fontFace": "Monaco"
    }
  }
}
```

---

## Customization

### Color Overrides

#### Modify Core Colors

Edit `~/.claude/themes/matrix-dark/colors.json`:

```json
{
  "colors": {
    "editor.background": "#000000",
    "editor.foreground": "#00ff00",
    "editor.lineNumberColor": "#008800",
    "editor.cursorColor": "#00ff00",
    "selection.background": "#003300",
    "statusBar.background": "#001100",
    "statusBar.foreground": "#00ff00",
    "terminal.ansi.black": "#000000",
    "terminal.ansi.brightGreen": "#00ff00",
    "terminal.ansi.green": "#00aa00"
  }
}
```

Apply changes:
```
/config reload
```

#### Create a Variant

**Step 1: Copy Base Theme**

```bash
cp -r ~/.claude/themes/matrix-dark ~/.claude/themes/matrix-custom
```

**Step 2: Edit colors.json**

Modify specific colors in your variant:

```json
{
  "colors": {
    "editor.foreground": "#00dd00",
    "editor.lineNumberColor": "#006600",
    "selection.background": "#004400"
  }
}
```

**Step 3: Register Variant**

Add to `~/.claude/settings.json`:

```json
{
  "theme": {
    "name": "matrix-custom",
    "path": "~/.claude/themes/matrix-custom"
  }
}
```

**Step 4: Activate**

```
/config theme
```

### Glow and Animation Effects

#### Enable Cascade Effect

Add to `~/.claude/settings.json`:

```json
{
  "effects": {
    "cascade": true,
    "cascadeCharacters": "01アイウエオ",
    "cascadeSpeed": "medium",
    "cascadeColor": "#00ff00"
  }
}
```

**Cascade speeds:** `very-slow`, `slow`, `medium`, `fast`, `very-fast`

#### Configure Text Glow

```json
{
  "effects": {
    "textGlow": true,
    "glowIntensity": 0.8,
    "glowSpread": 2,
    "glowColor": "#00ff00"
  }
}
```

**Glow intensity:** 0.0–1.0 (0 = off, 1 = maximum)

#### Disable All Effects (Performance Mode)

```json
{
  "effects": {
    "cascade": false,
    "textGlow": false,
    "cursorBlink": false
  }
}
```

### Time-Based Theme Switching

Automatically switch between themes at specific times:

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

### Opacity and Transparency

**Claude Code:**
```json
{
  "display": {
    "opacity": 0.95,
    "blur": 0.3
  }
}
```

**Terminal (iTerm2):**
- Preferences → Profiles → Window → Transparency slider

**Terminal (Alacritty):**
```yaml
window:
  opacity: 0.95
```

---

## Combining with Keybindings

### Claude Code Matrix Keybindings

Create `~/.claude/keybindings.json` for a cyberpunk-focused workflow:

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "Global",
      "bindings": {
        "cmd+shift+m": "theme.toggle",
        "cmd+shift+g": "effects.toggleGlow",
        "cmd+shift+c": "effects.toggleCascade"
      }
    },
    {
      "context": "Chat",
      "bindings": {
        "enter": "chat:submit",
        "shift+enter": "chat:newline",
        "cmd+shift+e": "chat:externalEditor"
      }
    }
  ]
}
```

**Key bindings breakdown:**

| Shortcut | Action | Use case |
|---|---|---|
| `Cmd+Shift+M` | Toggle between Matrix variants | Quick theme switching |
| `Cmd+Shift+G` | Toggle glow effects | Performance optimization on demand |
| `Cmd+Shift+C` | Toggle cascade effect | Disable cascade during focus-intensive work |
| `Cmd+Shift+E` | Open external editor | Compose longer prompts in your editor |

### VS Code Matrix Keybindings

Add to `.vscode/keybindings.json`:

```json
[
  {
    "key": "cmd+shift+m",
    "command": "workbench.action.selectTheme",
    "args": "Matrix Dark"
  },
  {
    "key": "cmd+shift+i",
    "command": "workbench.action.selectIconTheme",
    "args": "matrix-icons"
  },
  {
    "key": "ctrl+`",
    "command": "workbench.action.terminal.toggleTerminal"
  }
]
```

### Terminal Shell Aliases

Add to `~/.zshrc` or `~/.bashrc`:

```bash
# Matrix theme quick-switch
alias matrix-on='export COLORTERM=truecolor; clear && echo "Matrix: ON"'
alias matrix-off='export COLORTERM=; clear && echo "Matrix: OFF"'
alias matrix-toggle='if [ "$COLORTERM" = "truecolor" ]; then matrix-off; else matrix-on; fi'

# Bind to keyboard shortcut (zsh)
bindkey -s '^[^M' 'matrix-toggle\n'  # Alt+M

# Or for bash
# bind '"\C-\M-m": "matrix-toggle\n"'
```

---

## Troubleshooting

### Colors Not Rendering Correctly

**Symptom:** Theme colors appear muted, washed out, or monochrome.

**Diagnosis:**

```bash
# Check terminal color support
echo $TERM
# Should output: xterm-256color, tmux-256color, alacritty, iterm2, etc.

# Verify True Color capability
echo -e "\x1b[38;2;0;255;0mGreen\x1b[0m"
# Should render green if True Color is supported

# Check color depth
tput colors
# Output should be 256 or 16777216 (not 8 or 16)
```

**Solutions:**

1. **Force True Color support:**
   ```bash
   export COLORTERM=truecolor
   source ~/.zshrc
   ```

2. **Check TERM variable:**
   ```bash
   # If TERM=xterm (8-color), upgrade to:
   export TERM=xterm-256color
   ```

3. **Verify theme is loaded:**
   ```
   /debug theme
   ```
   Should show active theme name and variant.

4. **Check for conflicting terminal settings:**
   - iTerm2: Preferences → Profiles → Text → Ensure font is set correctly
   - VS Code: Verify `terminal.integrated.fontFamily` is set to a monospace font

### Glow Effect Not Visible

**Symptom:** Text glow is disabled or invisible even when configured.

**Diagnosis:**

1. Check if effects are enabled:
   ```json
   {
     "effects": {
       "textGlow": true,
       "glowIntensity": 0.8
     }
   }
   ```

2. Verify performance tier:
   ```json
   {
     "performance": {
       "tier": "high"
     }
   }
   ```

3. Check GPU acceleration:
   ```
   /debug performance
   ```

**Solutions:**

- Increase glow intensity: `"glowIntensity": 1.0`
- Enable hardware acceleration in Claude Code settings
- Disable other effects that may conflict:
  ```json
  {
    "effects": {
      "cascade": false,
      "textGlow": true
    }
  }
  ```
- For VS Code, ensure no extension conflicts:
  ```bash
  code --disable-extensions
  ```

### Cascade Effect Causes Lag

**Symptom:** Cascade animation makes terminal unresponsive or sluggish.

**Solutions:**

1. **Disable cascade entirely:**
   ```json
   {
     "effects": {
       "cascade": false
     }
   }
   ```

2. **Reduce cascade speed:**
   ```json
   {
     "effects": {
       "cascadeSpeed": "very-slow",
       "cascadeSpacing": 100
     }
   }
   ```

3. **Switch to balanced performance tier:**
   ```json
   {
     "performance": {
       "tier": "balanced"
     }
   }
   ```

4. **Monitor CPU usage:**
   ```bash
   # macOS
   top -l 1 | grep -E 'claude|Terminal'
   
   # Linux
   ps aux | grep -E 'claude|terminal' | grep -v grep
   ```

### Icons Missing in VS Code

**Symptom:** File/folder icons don't appear in Explorer sidebar.

**Diagnosis:**

```bash
# Check if icon extension is installed
code --list-extensions | grep matrix
```

**Solutions:**

1. **Reinstall icon theme:**
   ```bash
   code --install-extension matrix-dark-icons.matrix-icons --force
   ```

2. **Clear VS Code cache:**
   ```bash
   # macOS
   rm -rf ~/Library/Application\ Support/Code/Cache/
   
   # Linux
   rm -rf ~/.config/Code/Cache/
   
   # Windows
   rmdir /s "%APPDATA%\Code\Cache"
   ```

3. **Verify settings:**
   ```json
   {
     "workbench.iconTheme": "matrix-icons",
     "workbench.productIconTheme": "matrix-icons"
   }
   ```

4. **Reload VS Code:**
   - `Cmd+R` (macOS) or `Ctrl+Shift+F5` (Linux/Windows)

### Theme Reverts After Restart

**Symptom:** Theme changes don't persist between sessions.

**Diagnosis:**

```bash
# Check settings file exists and is valid JSON
cat ~/.claude/settings.json | jq .

# Verify file permissions
ls -la ~/.claude/settings.json
# Should show: -rw-r--r-- (readable and writable)
```

**Solutions:**

1. **Re-apply theme via UI:**
   - Claude Code: `/config theme` → select "matrix-dark"
   - VS Code: `Cmd+Shift+P` → "Color Theme" → "Matrix Dark"

2. **Manually persist settings:**
   ```bash
   # Ensure settings.json exists
   touch ~/.claude/settings.json
   
   # Add theme configuration
   cat >> ~/.claude/settings.json << 'EOF'
   {
     "theme": {
       "name": "matrix-dark"
     }
   }
   EOF
   
   # Validate JSON
   jq . ~/.claude/settings.json
   ```

3. **Check for conflicting settings:**
   - If using `.claude/settings.local.json`, ensure it doesn't override the global setting
   - Verify project-level `.claude/settings.json` (if in a project directory)

### Terminal Transparency Issues (macOS)

**Symptom:** Background image shows through text, or transparency makes text hard to read.

**Solutions (iTerm2):**

1. Disable transparency:
   - Preferences → Profiles → Window → Transparency: slide to 0 (opaque)

2. Disable blur:
   - Preferences → Profiles → Window → Blur: slide to 0

3. Set solid black background:
   - Preferences → Profiles → Colors → Background color: RGB 0,0,0

**Solutions (Terminal.app):**

1. Preferences → Profiles → Window → Opacity: drag to maximum (100%)

---

## Inspiration: Cyberpunk Aesthetics

The Matrix Theme Pack draws from cyberpunk design philosophy. Here are patterns to enhance the aesthetic beyond configuration.

### Terminal Culture Integration

**Use authentic command-line tools:**

```bash
# Replace generic ls with colored output
alias ls='ls -G'

# Use lsd for Matrix-style file listing
brew install lsd
alias ls='lsd -la --group-dirs=first'

# Use exa (another ls alternative)
brew install exa
alias ll='exa -lh --group-directories-first'

# Matrix-style prompt in zsh
PROMPT='%F{green}$(whoami)@$(hostname)%f:%F{10}%~%f$ '
```

### Prompt Customization

Create a Matrix-inspired prompt in `~/.zshrc`:

```bash
# Bright green user/host, dim green path
PROMPT='%B%F{green}▸%f%b %F{green}${USER}@${HOSTNAME}%f:%F{22}%~%f %B%F{green}⟩%f%b '

# Add git branch (if in repo)
RPROMPT='%F{10}$(git branch --show-current)%f'
```

### ASCII Art Integration

Add a startup message to terminal profile:

```bash
# ~/.zshrc or ~/.bashrc
echo -e "\033[32m"
cat << "EOF"
 _   _   _   _   _   _   _   _
/ \ / \ / \ / \ / \ / \ / \ / \
( M | A | T | R | I | X | T | H )
\ / \ / \ / \ / \ / \ / \ / \ /
 -   -   -   -   -   -   -   -
EOF
echo -e "\033[0m"
```

### Status Line Styling

Customize your statusline in tmux with Matrix colors:

```tmux
# ~/.tmux.conf
set -g status-bg black
set -g status-fg green
set -g status-left "#[fg=green]#(whoami)@#(hostname)#[fg=default] "
set -g status-right "#[fg=green]%H:%M:%S#[fg=default]"

setw -g window-status-current-style "fg=black,bg=green"
```

Or in bash/zsh with a custom status function:

```bash
# Display real-time system info in Matrix style
function matrix_status() {
  local cpu=$(top -l 1 | grep "CPU usage" | awk '{print $3}')
  local mem=$(top -l 1 | grep "PhysMem" | awk '{print $2}')
  echo -e "\033[32m▸ CPU: $cpu | MEM: $mem\033[0m"
}

# Call before prompt
matrix_status
```

### Vim/Neovim Integration

Enable Matrix theme in Vim:

```vim
" ~/.vimrc or init.vim
set background=dark
colorscheme matrix-dark

" Force 256 colors
set t_Co=256
set termguicolors

" Cursor styling
set guicursor=n-v-c:block-green,i-ci-ve:ver25-green,r-cr:hor20-green
```

### Hacker-Style Command Aliases

```bash
# "Decrypt" file contents
alias decrypt='cat'

# "Access" a directory (cd alias)
alias access='cd'

# "Query" system info (system alias)
alias query='uname -a'

# "Scan" ports
alias scan='nmap -sV'

# "Trace" network path
alias trace='traceroute'
```

### Extended Thinking Prompt

Use Matrix colors in your Claude Code prompts:

```
/think

I'm about to dive into deep analysis mode. Let me activate the Matrix protocol 
and examine this problem from multiple angles...

[Extended thinking enabled]
```

---

## Performance Tuning

### Monitor Resource Usage

**Claude Code:**
```
/debug performance
```

Output shows:
- GPU acceleration status
- Effect rendering performance
- Memory usage
- FPS

**Terminal:**
```bash
# Real-time monitoring
top

# Filter by process
top -o cpu -p $(pgrep -f 'claude|terminal')
```

### Tier Configuration

Set performance tier based on hardware:

```json
{
  "performance": {
    "tier": "high"
  }
}
```

| Tier | CPU | Effects | GPU Required |
|---|---|---|---|
| `high` | Any | All enabled | Optional |
| `balanced` | 2+ cores | Selective | Optional |
| `low` | 1+ cores | Minimal | No |

**Recommended by system:**

MacBook Pro 2019+:
```json
{
  "performance": {"tier": "high"},
  "effects": {"cascade": true, "textGlow": true}
}
```

Standard desktop (4-core):
```json
{
  "performance": {"tier": "balanced"},
  "effects": {"cascade": false, "textGlow": true}
}
```

Remote session / VM:
```json
{
  "performance": {"tier": "low"},
  "effects": {"cascade": false, "textGlow": false}
}
```

### Lazy-Load Effects

Defer effect initialization to speed up startup:

```json
{
  "effects": {
    "lazyLoad": true,
    "loadDelay": 500
  }
}
```

---

## Related Resources

- **Guides:** [Matrix Theme Installation](matrix-theme-installation.md), [Matrix Theme Edge Cases](matrix-theme-edge-cases.md), [Keybindings Guide](keybindings-guide.md), [Hooks Cookbook](hooks-cookbook.md)
- **Skills:** `theme-customization`, `keybindings-help`, `update-config`
- **Tools:** Matrix Theme Builder (`npm run build-themes`), Color Validator
- **Community:** Share custom variants in the Claudient marketplace

---
