# Matrix Theme FAQ

**Last updated: June 2026 | Audience: developers using Matrix theme across platforms**

---

## Quick Navigation

- [Colors & Display](#colors--display)
- [Customization](#customization)
- [Performance](#performance)
- [VS Code & IDE Integration](#vs-code--ide-integration)
- [Terminal Appearance](#terminal-appearance)
- [Multi-Monitor Setup](#multi-monitor-setup)
- [Fonts & Typography](#fonts--typography)
- [Dark Mode & Mobile](#dark-mode--mobile)
- [Troubleshooting](#troubleshooting)

---

## Colors & Display

### Q: My colors are showing as muted, washed out, or wrong—why?

**A:** Matrix theme requires True Color (24-bit RGB) support. Verify your terminal capability:

```bash
echo $COLORTERM  # Should return: truecolor or 256color
echo $TERM       # Should return: xterm-256color, alacritty, iterm2, etc.
```

If output is missing or shows `TERM=xterm` (8-color only):

```bash
export COLORTERM=truecolor
export TERM=xterm-256color
source ~/.zshrc
```

Test color rendering:
```bash
echo -e "\x1b[38;2;0;255;0mGreen\x1b[0m"  # Should render bright green
```

**Also check:**
- Claude Code: `/debug theme` → verify "matrix-dark" is active
- VS Code: Settings → Color Theme → confirm "Matrix Dark" selected
- Terminal: Preferences → Colors → verify foreground is green (#00ff41), background is black (#000000)

---

### Q: Colors look different on OLED vs LCD displays—is that normal?

**A:** Yes. Matrix theme uses saturated neon green (#00ff41) which renders differently across display technologies:

- **OLED**: Green appears brighter and more vivid due to per-pixel backlighting
- **LCD**: Green appears more muted with backlight bleed
- **CRT (vintage)**: Green appears softer with phosphor glow

**Solution:** Use theme variants optimized for your display:

```json
{
  "theme": {
    "variant": "neon"  // For OLED (saturated, bright)
  }
}
```

Or reduce glow intensity for LCD:

```json
{
  "effects": {
    "glow": {
      "intensity": "low",
      "blur": "4px"
    }
  }
}
```

---

### Q: How do I make colors brighter/darker or change the shade of green?

**A:** Edit `~/.claude/themes/matrix-dark/colors.json` or `~/.claude/settings.json`:

**Option 1: Quick override in settings.json**

```json
{
  "theme": {
    "colorOverrides": {
      "primary": "#00dd33",       // Slightly darker green
      "primaryLight": "#00ff00",  // Pure bright green
      "primaryDark": "#009933"    // Very dark green
    }
  }
}
```

**Option 2: Create a custom variant**

```bash
cp -r ~/.claude/themes/matrix-dark ~/.claude/themes/matrix-bright
```

Edit `~/.claude/themes/matrix-bright/colors.json`:

```json
{
  "colors": {
    "primary": "#39ff14",              // Brighter lime
    "primaryLight": "#66ff33",         // Even brighter
    "text": "#39ff14",
    "selection": "#39ff4433",
    "editor.foreground": "#39ff14"
  }
}
```

Apply:
```
/config theme
```

Select "matrix-bright" from dropdown.

---

## Customization

### Q: How do I customize colors without losing my settings on updates?

**A:** Create a project-specific override file. Add to `.claude/settings.json` (in your project directory):

```json
{
  "theme": {
    "name": "matrix-dark",
    "variant": "custom",
    "overrides": {
      "colorScheme": "matrix-custom-project"
    }
  }
}
```

Or use `settings.local.json` (gitignored, survives updates):

```bash
# Create local-only settings
cat > ~/.claude/settings.local.json << 'EOF'
{
  "theme": {
    "colorOverrides": {
      "primary": "#00ff00",
      "text": "#00ff00"
    }
  }
}
EOF
```

Verify local settings load:
```
/debug config
```

---

### Q: Can I use Matrix green for specific elements only (e.g., cursor but not text)?

**A:** Yes, customize by component. Edit settings:

```json
{
  "theme": {
    "componentOverrides": {
      "cursor": {
        "color": "#00ff41",
        "glow": "0 0 10px rgba(0, 255, 65, 0.5)"
      },
      "selection": {
        "background": "#00ff4133",
        "text": "#00ffffff"
      },
      "statusBar": {
        "background": "#000000",
        "foreground": "#008800"  // Dimmer green for secondary info
      }
    }
  }
}
```

---

### Q: How do I create a "Matrix but not too intense" variant?

**A:** Create a "soft" variant with reduced glow and adjusted colors:

```bash
cp -r ~/.claude/themes/matrix-dark ~/.claude/themes/matrix-soft
```

Edit `~/.claude/themes/matrix-soft/colors.json`:

```json
{
  "colors": {
    "primary": "#00cc33",           // Dimmer primary
    "primaryLight": "#00ff41",      // Keep bright for contrast
    "primaryDark": "#008800",       // Dimmer dark
    "text": "#00cc33",
    "selection": "#00cc3322",       // Reduced opacity
    "editor.lineNumberColor": "#004d00"  // Much dimmer
  }
}
```

Edit effects in settings:

```json
{
  "effects": {
    "textGlow": true,
    "glowIntensity": 0.3,           // Very subtle
    "glowSpread": 1,
    "cascade": false,
    "scanlines": {
      "enabled": true,
      "opacity": 0.01              // Barely visible
    }
  }
}
```

Apply with:
```
/config theme
```

---

## Performance

### Q: Matrix theme is making my editor slow—what can I do?

**A:** Performance issues typically stem from effects. Disable progressively:

```json
{
  "effects": {
    "cascade": false,               // Stop cascade first (most intensive)
    "textGlow": false,              // Then text glow
    "scanlines": {
      "enabled": false              // Then scanlines
    },
    "cursorBlink": true             // Keep cursor blink
  }
}
```

Check CPU usage:

```bash
# macOS
top -l 1 | grep -E 'claude|Code' | head -5

# Linux
ps aux | grep -E 'code|claude' | grep -v grep
```

If still slow, reduce animation speeds:

```json
{
  "effects": {
    "cascadeSpeed": "very-slow",
    "animations": {
      "terminalBlink": {
        "duration": "2s"  // Slower blink = less render work
      }
    }
  }
}
```

Or switch performance tier:

```json
{
  "performance": {
    "tier": "balanced"  // Not "high"
  }
}
```

---

### Q: Should I disable all effects on older hardware?

**A:** Yes. For systems with <4GB RAM or <2 CPU cores, use "low" tier:

```json
{
  "performance": {
    "tier": "low"
  },
  "effects": {
    "cascade": false,
    "textGlow": false,
    "scanlines": { "enabled": false },
    "crt": { "enabled": false }
  }
}
```

Test responsiveness:
```
/debug performance
```

---

### Q: Cascade effect looks cool but kills performance—can I optimize it?

**A:** Yes. Reduce cascade parameters:

```json
{
  "effects": {
    "cascade": true,
    "cascadeSpeed": "very-slow",      // Slowest = least CPU
    "cascadeSpacing": 150,             // Larger gaps = fewer chars
    "cascadeCharacters": "01",         // Fewer chars = faster
    "cascadeFPS": 12                   // Lower FPS if supported
  }
}
```

Or enable cascade only in specific contexts (chat input, not full editor):

```json
{
  "effects": {
    "cascade": {
      "enabled": true,
      "contexts": ["chat", "input"],   // Only where needed
      "speed": "slow"
    }
  }
}
```

---

## VS Code & IDE Integration

### Q: Matrix theme installed in VS Code but colors don't match Claude Code—why?

**A:** VS Code uses a separate color mapping system. Verify both are configured:

**Claude Code:**
```
/config theme
```

Select "matrix-dark".

**VS Code:**
1. `Cmd+Shift+P` → "Preferences: Color Theme" → "Matrix Dark"
2. `Cmd+Shift+P` → "Preferences: File Icon Theme" → "matrix-icons"

Check `.vscode/settings.json` for overrides:

```json
{
  "workbench.colorTheme": "Matrix Dark",
  "workbench.iconTheme": "matrix-icons",
  "workbench.productIconTheme": "matrix-icons",
  "editor.tokenColorCustomizations": {}  // Ensure empty (no overrides)
}
```

---

### Q: VS Code terminal colors don't match the editor theme—fix?

**A:** The integrated terminal uses a different color scheme. Force Matrix colors:

Add to `.vscode/settings.json`:

```json
{
  "terminal.integrated.env.osx": {
    "COLORTERM": "truecolor"
  },
  "terminal.integrated.env.linux": {
    "COLORTERM": "truecolor"
  },
  "terminal.integrated.env.windows": {
    "COLORTERM": "truecolor"
  },
  "terminal.integrated.fontFamily": "Monaco, 'Courier New'",
  "terminal.integrated.fontSize": 12,
  "workbench.colorCustomizations": {
    "terminal.ansi.black": "#000000",
    "terminal.ansi.green": "#00cc33",
    "terminal.ansi.brightGreen": "#00ff41",
    "terminal.background": "#0a0e27",
    "terminal.foreground": "#00ff41"
  }
}
```

---

### Q: Matrix icons not showing in VS Code file tree—how to fix?

**A:** Icons depend on the icon extension being installed and active.

**Check installation:**
```bash
code --list-extensions | grep matrix
```

Should output: `matrix-dark-icons.matrix-icons`

**If missing:**
```bash
code --install-extension matrix-dark-icons.matrix-icons
```

**If installed but not showing:**

1. Clear VS Code cache:
```bash
# macOS
rm -rf ~/Library/Application\ Support/Code/Cache/

# Linux
rm -rf ~/.config/Code/Cache/

# Windows (in PowerShell)
Remove-Item -Recurse "$env:APPDATA\Code\Cache"
```

2. Restart VS Code: `Cmd+R` (macOS) or `Ctrl+Shift+F5` (Linux/Windows)

3. Verify settings:
```json
{
  "workbench.iconTheme": "matrix-icons",
  "workbench.productIconTheme": "matrix-icons"
}
```

---

### Q: How do I apply Matrix theme to VS Code extensions?

**A:** Most extensions respect the global editor theme. For stubborn extensions:

Add to `.vscode/settings.json`:

```json
{
  "editor.tokenColorCustomizations": {
    "[Matrix Dark]": {
      "textMateRules": [
        {
          "scope": "meta.embedded",
          "settings": {
            "foreground": "#00ff41"
          }
        }
      ]
    }
  }
}
```

For specific problematic extensions, disable and reinstall:

```bash
code --disable-extension <extension-id>
code --install-extension <extension-id>
```

---

## Terminal Appearance

### Q: Terminal looks different in iTerm2 vs Terminal.app vs other emulators—which is "correct"?

**A:** All are correct, but they render the theme differently due to font rendering and color handling:

- **iTerm2**: Best support for Matrix theme; smooth antialiasing, glow effects visible
- **Terminal.app**: Acceptable but ligatures may cause text jumps; disable if problematic
- **Alacritty**: Native support, fast rendering, excellent for gaming-like feel
- **Windows Terminal**: Full ANSI support, clean rendering
- **Gnome Terminal**: Good support but may have slight color shifting

**To match across all terminals:**

Use monospace fonts (not ligatures) and disable transparency:

```bash
# iTerm2: Preferences → Profiles → Text
# Uncheck "Use ligatures"

# Terminal.app: Preferences → Profiles → Text
# Set Font: Monaco 12pt

# Alacritty: ~/.config/alacritty/alacritty.yml
font:
  normal:
    family: Monaco
    style: Regular
  size: 12.0
```

---

### Q: My terminal shows green text but the background isn't pure black—why?

**A:** Likely due to default terminal settings or transparency. Fix by:

**iTerm2:**
1. Preferences → Profiles → Colors → Background
2. Set RGB: 0, 0, 0 (pure black)
3. Profiles → Window → Transparency: slide to 0
4. Profiles → Window → Blur: slide to 0

**Terminal.app:**
1. Preferences → Profiles → Window
2. Opacity: drag to maximum (100%)

**Alacritty:**
```yaml
window:
  opacity: 1.0  # 1.0 = fully opaque
  padding:
    x: 10
    y: 10

colors:
  primary:
    background: '#0a0e27'
    foreground: '#00ff41'
```

**Windows Terminal:**
```json
{
  "profiles": {
    "defaults": {
      "useAcrylic": false,
      "opacity": 1.0
    }
  }
}
```

---

### Q: Cursor is hard to see even though it's green—how to make it pop?

**A:** Increase cursor contrast or add glow. Modify in terminal or settings:

**iTerm2:**
1. Preferences → Profiles → Colors → Cursor
2. Set RGB: 0, 255, 0 (bright green, may be lighter than text)
3. Cursor Type: "Underline" (more visible than block)

**Alacritty:**
```yaml
cursor:
  style:
    shape: Beam
    blinking: On
  thickness: 0.15
  
colors:
  cursor:
    text: '#000000'
    cursor: '#00ff41'
```

**Claude Code:**
```json
{
  "terminal": {
    "cursor": {
      "style": "block",
      "color": "#39ff14",  // Slightly brighter than text
      "glow": "0 0 15px rgba(0, 255, 65, 0.6)"
    }
  }
}
```

---

### Q: Terminal flicker or scanlines look wrong—adjustment?

**A:** Scanline effects depend on rendering speed and display refresh rate. Adjust:

```json
{
  "effects": {
    "scanlines": {
      "enabled": true,
      "opacity": 0.02,           // Reduce if too harsh (0.01-0.05)
      "pattern": "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)",
      "animation": "scanline-drift 8s linear infinite"
    }
  }
}
```

To disable scanlines:
```json
{
  "effects": {
    "scanlines": {
      "enabled": false
    }
  }
}
```

---

## Multi-Monitor Setup

### Q: Matrix theme colors look different on one monitor vs another—how to fix?

**A:** Monitors have different color spaces and calibration. This is normal but fixable:

**Calibration approach:**

1. Check monitor color profiles:
   - macOS: System Preferences → Displays → Color
   - Windows: Settings → Display → Advanced Display Settings
   - Linux: GNOME Settings → Display

2. Ensure both monitors use the same profile (e.g., "sRGB")

3. Adjust monitor brightness/contrast to match

**Software approach (if calibration doesn't work):**

Create display-specific color overrides. Add to Claude Code settings:

```json
{
  "theme": {
    "displayOverrides": {
      "primary": {
        "colorOverride": "#00dd33",     // Adjust for primary display
        "glowIntensity": 0.7
      },
      "secondary": {
        "colorOverride": "#00ff41",     // Adjust for secondary display
        "glowIntensity": 0.9
      }
    }
  }
}
```

---

### Q: One monitor is wide (ultrawide) and text appears at different sizes—is that a theme issue?

**A:** Not a theme issue but a DPI/scaling issue. Matrix theme scales with your system's DPI settings.

**Fix:**

1. Ensure all monitors have the same DPI scale:
   - macOS: System Preferences → Displays → set default resolution on all monitors
   - Windows: Settings → Display → Scale and layout (set same % on all monitors)

2. Or, use explicit font sizing in editor settings:

```json
{
  "editor": {
    "fontSize": 12,
    "lineHeight": 1.6,
    "fontFamily": "Monaco"
  }
}
```

---

### Q: Glow effect looks weird when spanning two monitors—why?

**A:** Text glow rendering can behave oddly across monitor boundaries due to different refresh rates or GPU handling. Reduce glow intensity:

```json
{
  "effects": {
    "glow": {
      "intensity": "low",  // Not "high" or "medium"
      "blur": "4px",
      "spread": "1px"
    }
  }
}
```

Or disable on secondary monitor and keep on primary (manual):

```json
{
  "effects": {
    "glow": false  // Disable for smooth multi-monitor experience
  }
}
```

---

## Fonts & Typography

### Q: Matrix theme requires specific fonts—which fonts work best?

**A:** Matrix theme works with any monospace font, but these are optimized:

**Recommended (in order):**

1. **Monaco** (macOS default, excellent hinting)
   ```bash
   # Check if installed
   fc-list | grep -i monaco
   ```

2. **Menlo** (macOS native, clean rendering)

3. **Ubuntu Mono** (Linux, good coverage)
   ```bash
   sudo apt-get install fonts-ubuntu-mono
   ```

4. **Courier New** (Universal fallback, acceptable)

5. **IBM Plex Mono** (Excellent on Windows)
   ```bash
   # Download from fonts.google.com
   ```

**Configure in Claude Code:**

```json
{
  "display": {
    "fontFamily": "Monaco, Menlo, 'Ubuntu Mono', 'Courier New', monospace"
  }
}
```

---

### Q: Font ligatures are breaking alignment—should I disable them?

**A:** Yes, Matrix theme looks better without ligatures (they're not traditional for retro terminal aesthetic). Disable:

**Claude Code:**
```json
{
  "editor": {
    "fontLigatures": false
  }
}
```

**VS Code:**
```json
{
  "editor.fontLigatures": false
}
```

**iTerm2:**
1. Preferences → Profiles → Text
2. Uncheck "Use ligatures"

**Terminal.app:**
1. Preferences → Profiles → Text
2. Font: Monaco (ligatures are off by default)

---

### Q: How do I install Matrix-compatible fonts if they're not on my system?

**A:** Installation varies by OS:

**macOS:**
```bash
# Via Homebrew
brew tap homebrew/cask-fonts
brew install font-monaco font-menlo font-ubuntu-mono

# Or download directly
# Monaco: comes with macOS
# Download fonts from fonts.google.com and drag to Font Book
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install fonts-ubuntu-mono fonts-liberation-mono
sudo apt-get install fonts-liberation
fc-cache -fv  # Refresh font cache
```

**Windows:**
1. Download font (e.g., from fonts.google.com or GitHub)
2. Right-click .ttf file → Install Font
3. Restart VS Code or Terminal to use

**Alacritty (all platforms):**
Alacritty will auto-select fallback if font missing. To verify:

```bash
fc-list | grep -i courier  # Or preferred font
```

---

### Q: Text looks blurry or rendering is poor—font setting?

**A:** Usually antialiasing or font hinting issue. Adjust:

**Claude Code:**
```json
{
  "display": {
    "fontSmoothing": "antialiased",  // or "subpixel-antialiased"
    "fontRenderingMode": "optimizeLegibility"
  }
}
```

**VS Code:**
```json
{
  "editor.fontFamily": "Monaco",
  "editor.fontSize": 12,
  "editor.fontLigatures": false,
  "editor.fontWeightStretch": false
}
```

**iTerm2:**
1. Preferences → Profiles → Text
2. Font: Monaco 12pt
3. Antialias text: ON
4. Use thin strokes: OFF (usually)

---

### Q: Can I use different font sizes for code vs UI?

**A:** Yes, in VS Code specifically:

```json
{
  "editor": {
    "fontSize": 12,
    "lineHeight": 1.6
  },
  "workbench": {
    "fontSize": 11
  },
  "terminal.integrated": {
    "fontSize": 12
  }
}
```

Claude Code doesn't support separate sizing but respects global `fontSize`.

---

## Dark Mode & Mobile

### Q: Does Matrix theme work in light mode or with light OS settings?

**A:** Matrix theme is dark-only. On light mode, it becomes illegible (green text on white background fails contrast).

**Solutions:**

1. **Keep OS in dark mode:**
   - macOS: System Preferences → General → Appearance: Dark
   - Linux: GNOME Settings → Appearance: Dark
   - Windows: Settings → Personalization: Dark

2. **Use light-mode-compatible alternative:**

   Create a "matrix-light" variant:

   ```json
   {
     "colors": {
       "primary": "#003d00",       // Dark green on light background
       "background": "#f5f5f5",    // Off-white
       "text": "#003d00"
     }
   }
   ```

   But this breaks the Matrix aesthetic. Better to stick with dark mode.

3. **Or disable dark mode per-app:**
   - Claude Code: `/config theme` → select "matrix-dark" (overrides OS)
   - VS Code: Settings → Color Theme → "Matrix Dark" (overrides OS)

---

### Q: Matrix theme on mobile (iPad, phone)—is it supported?

**A:** Matrix theme is designed for desktop/laptop terminals. Mobile support is limited:

- **iPad**: VS Code or Claude Code via web can use Matrix (limited touch optimization)
- **iPhone/Android**: Terminal apps like SSH clients can use Matrix if terminal supports ANSI 24-bit

**For mobile terminal:**

```bash
# On SSH server, verify color support
echo $COLORTERM
echo $TERM

# Force True Color on mobile terminal
export COLORTERM=truecolor
export TERM=xterm-256color
```

Example SSH setup for iPhone (using Prompt 3 or similar SSH client):

1. In SSH app settings, set:
   - TERM: xterm-256color
   - Colors: 256-color or True Color (if supported)

2. Add Matrix colors to server profile if available

**Recommended mobile alternatives:**

For true mobile hacker aesthetic, use:
- **Prompt 3** (iOS): supports Matrix-style themes
- **Termux** (Android): supports ANSI colors, can import Matrix palette

---

### Q: Can I sync Matrix theme across laptop and mobile devices?

**A:** Partial sync:

**Cloud Sync:**
- VS Code: Settings Sync (Settings → Profiles → Create Profile)
- Claude Code: Use `.claude/settings.json` + cloud sync tool (e.g., git, Dropbox)

**Manual Sync:**

```bash
# Export current theme
cp ~/.claude/themes/matrix-dark ~/Dropbox/claude-backups/

# Import on another device
cp ~/Dropbox/claude-backups/matrix-dark ~/.claude/themes/
```

**Note:** Terminal emulator themes don't sync automatically. Reconfigure per device:
- iTerm2: Preferences → Export, import on other Mac
- Terminal.app: Profiles → Gear icon → Export, import
- Alacritty: Copy `~/.config/alacritty/` to new device

---

## Troubleshooting

### Q: Theme was working, then colors broke after an update—what happened?

**A:** System, browser, or app updates may reset settings. Recover:

1. **Verify settings file still exists:**
   ```bash
   cat ~/.claude/settings.json
   ```

   If missing or corrupted, restore from backup:
   ```bash
   # Check for backup
   ls -la ~/.claude/*.json
   ```

2. **Re-apply theme:**
   - Claude Code: `/config theme` → select "matrix-dark"
   - VS Code: `Cmd+Shift+P` → Color Theme → "Matrix Dark"

3. **Check for conflicting settings:**
   ```bash
   # If using settings.local.json, verify it doesn't override
   cat ~/.claude/settings.local.json
   ```

4. **Clear cache (if colors still wrong):**
   ```bash
   # Claude Code cache
   rm -rf ~/.claude/cache/

   # VS Code cache
   rm -rf ~/Library/Application\ Support/Code/Cache/
   ```

5. **Reinstall theme:**
   ```bash
   rm -rf ~/.claude/themes/matrix-dark
   git clone <matrix-theme-repo> ~/.claude/themes/matrix-dark
   ```

---

### Q: I customized colors but they reverted—where did they go?

**A:** Customizations stored in the wrong place. Matrix settings have a priority order:

1. `~/.claude/settings.local.json` (highest priority, gitignored)
2. `./.claude/settings.json` (project-level)
3. `~/.claude/settings.json` (user-level)
4. `~/.claude/themes/matrix-dark/` (theme defaults)

**To preserve customizations:**

```bash
# Add to ~/.claude/settings.local.json (NOT git-tracked)
cat >> ~/.claude/settings.local.json << 'EOF'
{
  "theme": {
    "colorOverrides": {
      "primary": "#00ff41",
      "text": "#00ff41"
    }
  }
}
EOF
```

Verify they load:
```
/debug config
```

---

### Q: Theme looks different in Claude Code vs browser—expected?

**A:** Yes. Claude Code is a native desktop app; browser uses web rendering. Differences include:

- **Font rendering:** Desktop uses system font hinting; browser uses web defaults
- **Color accuracy:** Desktop has better color management
- **Glow effects:** Only visible in desktop app
- **Performance:** Desktop handles effects better

**To sync appearance:**

Set both to use the same base colors but adjust for platform:

**Claude Code:**
```json
{
  "theme": { "name": "matrix-dark" },
  "effects": { "glow": true, "intensity": "high" }
}
```

**Browser (if using web version):**
Use CSS overrides or browser extension (e.g., Stylus) to inject:

```css
body {
  background-color: #0a0e27;
  color: #00ff41;
  font-family: Monaco, monospace;
}
```

---

### Q: Some text remains colored differently despite theme settings—why?

**A:** Third-party themes or extensions may override global settings. Debug:

```
/debug theme
/debug extensions  # If in VS Code
```

**Solutions:**

1. **Disable conflicting extensions:**
   ```bash
   code --disable-extensions
   code  # Restart
   ```

2. **Check for theme conflicts in VS Code:**
   - Extensions → Themes → uninstall competing theme

3. **Override at component level:**
   ```json
   {
     "editor": {
       "tokenColorCustomizations": {
         "[Matrix Dark]": {
           "comments": {
             "foreground": "#00ff41"  // Force comment color
           }
         }
       }
     }
   }
   ```

---

### Q: Glow effect isn't showing—is my system incompatible?

**A:** Glow requires GPU acceleration. Check:

```
/debug performance
```

Output should show `gpu: enabled` and `tier: high`.

If GPU not available:

1. **Enable hardware acceleration:**
   - Claude Code: `/config` → search "acceleration" → enable
   - VS Code: Settings → Extensions → disable heavy extensions → restart

2. **Or reduce glow demands:**
   ```json
   {
     "effects": {
       "glow": {
         "intensity": "low",
         "blur": "2px"  // Smaller blur = less computation
       }
     }
   }
   ```

3. **Check system GPU:**
   ```bash
   # macOS
   system_profiler SPDisplaysDataType | grep Chipset

   # Linux
   lspci | grep -i vga

   # Windows (PowerShell)
   Get-WmiObject win32_videocontroller
   ```

If no GPU or integration mode only, disable effects entirely.

---

### Q: Cursor blink is too fast/slow—adjust?

**A:** Modify cursor animation:

```json
{
  "terminal": {
    "cursor": {
      "blinkRate": 500  // milliseconds (default 1000)
    }
  }
}
```

Or disable blinking:
```json
{
  "terminal": {
    "cursor": {
      "blinkRate": 0  // 0 = no blink
    }
  }
}
```

---

### Q: Text shadow makes text hard to read—remove it?

**A:** Reduce or disable text shadow:

```json
{
  "effects": {
    "terminal": {
      "textShadow": "none"  // Disable
    }
  }
}
```

Or soften:
```json
{
  "effects": {
    "terminal": {
      "textShadow": "0 0 2px rgba(0, 255, 65, 0.1)"  // Very subtle
    }
  }
}
```

---

## Advanced Configuration

### Q: How do I apply Matrix theme across ALL my tools (editor, terminal, IDE)?

**A:** Create a unified configuration script:

```bash
#!/bin/bash
# ~/.config/matrix-theme-setup.sh

# Claude Code
mkdir -p ~/.claude
cat > ~/.claude/settings.json << 'EOF'
{
  "theme": {
    "name": "matrix-dark",
    "variant": "strict"
  },
  "effects": {
    "cascade": true,
    "textGlow": true
  }
}
EOF

# VS Code
mkdir -p ~/.config/Code/User
cat > ~/.config/Code/User/settings.json << 'EOF'
{
  "workbench.colorTheme": "Matrix Dark",
  "workbench.iconTheme": "matrix-icons",
  "editor.fontFamily": "Monaco"
}
EOF

# Alacritty
mkdir -p ~/.config/alacritty
cp matrix-alacritty.yml ~/.config/alacritty/alacritty.yml

# iTerm2 (macOS)
cp matrix.itermcolors ~/.config/iterm2/colorschemes/

echo "Matrix theme applied to all tools."
```

Run:
```bash
chmod +x ~/.config/matrix-theme-setup.sh
~/.config/matrix-theme-setup.sh
```

---

### Q: Can I export my Matrix customizations as a shareable theme?

**A:** Yes, create a theme package:

```bash
# Create theme directory
mkdir -p my-matrix-custom/{colors,effects}

# Add custom JSON
cp ~/.claude/settings.json my-matrix-custom/
cp -r ~/.claude/themes/matrix-dark/colors.json my-matrix-custom/colors/

# Create README
cat > my-matrix-custom/README.md << 'EOF'
# My Custom Matrix Theme

Installation:
cp -r my-matrix-custom ~/.claude/themes/matrix-custom
/config theme → select "matrix-custom"
EOF

# Compress and share
tar -czf my-matrix-custom.tar.gz my-matrix-custom/
```

Share the `.tar.gz` file with others.

---

## Related Resources

- [Matrix Theme Guide](matrix-theme-guide.md)
- [Matrix Theme Installation](matrix-theme-installation.md)
- [Matrix Theme Edge Cases](matrix-theme-edge-cases.md)
- [Matrix Theme Setup Workflow](../workflows/matrix-theme-setup.md)

---

**Last updated: June 2026 | Questions? Open an issue in the Claudient repository.**
