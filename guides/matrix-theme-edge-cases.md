# Matrix Theme Edge Cases

## Dark Mode Fallback

### System-Level Dark Mode Detection
When the OS switches to dark mode, Matrix theme must gracefully degrade if explicit dark palette is unavailable. Detect via:
- macOS: `defaults read -g AppleInterfaceStyle` returns "Dark"
- Linux: `gtk-application-prefer-dark-theme` GSettings key
- Windows: UWM theme registry (`HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize`)

**Fallback strategy**: If dark mode is active but only a light palette is defined, reduce brightness of text/backgrounds by ~30% rather than inverting colors (inversion creates unreadable combinations with saturated Matrix green).

### Degraded Fallback Chain
```
1. Native dark theme (if available)
2. Dimmed light theme (80% brightness reduction)
3. Monochrome fallback (green text on black)
4. System default terminal colors
```

## High Contrast Mode

### Windows High Contrast
When High Contrast mode is enabled (`HKEY_CURRENT_USER\Control Panel\Accessibility\HighContrast`), override Matrix saturation:
- Reduce green saturation from 100% to 60%
- Increase text/background luminosity delta to ≥7:1 ratio (WCAG AAA)
- Replace shadow effects (transparent backgrounds) with solid 1px borders

### macOS Increase Contrast
Detect via `defaults read -g AppleEnhancedContrast` (returns 1 if enabled):
- Boost green channel by 15% to maintain visibility
- Add subtle stroke to glyphs (weight +0.5)
- Disable transparency effects; use solid colors only

### Detection Code Pattern
```json
{
  "contrastMode": {
    "windows": "Registry: HKEY_CURRENT_USER\\Control Panel\\Accessibility\\HighContrast\\HighContrastOn",
    "macos": "defaults read -g AppleEnhancedContrast",
    "linux": "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled"
  }
}
```

## Terminal Color Limitations

### 8-Color Terminals
Matrix theme requires 256-color support. On 8-color terminals (TERM=xterm-color):
- Map primary green (#00FF00) to ANSI bright green (90-97 code, SGR 1;32)
- Map secondary green (#00AA00) to ANSI normal green (32-37 code, SGR 32)
- Disable color blending/gradients; use discrete color boundaries
- Test via `echo $COLORTERM` (should be "truecolor" or "256color")

### 16-Color Limitation (TERM=xterm-256color limited)
If terminal only renders 16 colors despite 256-color TERM:
- Quantize Matrix green to nearest ANSI bright green
- Reduce palette to: black, green (bright/normal), white
- Background stays pure black (ANSI 40)
- Foreground stays green or white (ANSI 92 or 97)

### Verification
```bash
# Check color support
tput colors  # Output: 8, 16, 256, or 16777216

# Check true color support
echo -e "\x1b[38;2;0;255;0mGreen\x1b[0m"  # Should render RGB green
```

## Windows Terminal Compatibility

### Legacy CMD.exe
Windows Terminal with legacy console mode doesn't support:
- ANSI escape sequences (SGR codes)
- RGB color mode
- Transparency/alpha blending

**Fallback**: Use Windows Console API directly (SetConsoleTextAttribute, SetConsoleCursorPosition) or detect `WT_SESSION` environment variable. If absent, disable Matrix effects.

### Windows Terminal v1.0+
Full ANSI support but watch for:
- Background image bleeding through text (disable in settings.json: `"backgroundImage": null`)
- CJK character width miscalculation (green characters may misalign)
- Opacity effects (`transparency: 0.8`) interfering with green-on-black contrast

### Profile Detection
```json
{
  "profiles": [
    {
      "name": "Matrix",
      "guid": "{..}",
      "colorScheme": "Matrix",
      "useAcrylic": false,
      "opacity": 1.0
    }
  ]
}
```

## iTerm2 Variations

### Color Palette Import
iTerm2 uses `.itermcolors` XML format (not standard ANSI). Matrix theme requires:
- Red: 0,255,0 → iTerm channel values 0%, 100%, 0%
- Bright Black (shadows): 0,85,0 → iTerm 0%, 33%, 0%
- Cursor color: 0,255,0 (matches text for seamless blend)

### Profile Configuration
In iTerm2 > Preferences > Profiles > Colors:
```
Basic Colors:
  Foreground: 0, 255, 0
  Background: 0, 0, 0
  Cursor: 0, 255, 0
  
ANSI Colors:
  Normal Green: 0, 170, 0 (RGB)
  Bright Green: 0, 255, 0
```

### Potential Issues
- **Font rendering**: Ligatures may not align with green glyphs. Disable in Preferences > Profiles > Text > "Use ligatures" if text jumps.
- **Scrollbar color**: iTerm draws scrollbar in green, creating visual clutter. Hide via "Hide Scrollbars" preference.
- **Blinking cursor**: Blinking at 60Hz can cause green-on-black flicker. Set cursor mode to "Underline, blinking" (lower frequency) or "Vertical bar, steady."

### Minimal iTerm Config
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>AnsiGreenColor</key>
  <dict>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Red Component</key>
    <real>0</real>
    <key>Green Component</key>
    <real>1</real>
    <key>Blue Component</key>
    <real>0</real>
  </dict>
  <key>BackgroundColor</key>
  <dict>
    <key>Red Component</key>
    <real>0</real>
    <key>Green Component</key>
    <real>0</real>
    <key>Blue Component</key>
    <real>0</real>
  </dict>
</dict>
</plist>
```

## Color Blind Friendly Alternatives

### Deuteranopia (Green-Red Blindness)
Users cannot distinguish green from red. Matrix theme (pure green) fails entirely. Provide alternative:
- **Hacker Blue**: `#0000FF` (blue text on black)
- **Hacker Amber**: `#FFAA00` (amber/gold text on black)
- **Hacker Cyan**: `#00FFFF` (cyan text on black)

Detection: Query OS accessibility settings or ask user preference.

### Protanopia (Red Blindness)
Red channel is absent. Green appears yellowish. Shift Matrix palette:
- Primary text: `#00FF00` → `#00FF88` (add slight yellow shift)
- Dimmed green: `#00AA00` → `#00AA44`
- Test with tools like `daltonize` or Sim Daltonism app (macOS)

### Achromatopsia (Complete Color Blindness)
Only grayscale visible. Provide monochrome matrix:
- Text: `#FFFFFF` (white, 255 brightness)
- Dimmed: `#808080` (gray, 128 brightness)
- Background: `#000000` (black, 0 brightness)
- Maintain ≥4.5:1 contrast ratio (WCAG AA minimum)

### Detection & Fallback
```bash
# macOS: Check accessibility color filters
defaults read com.apple.universalaccess grayscaleEnabled
defaults read com.apple.universalaccess colorFilterEnabled
defaults read com.apple.universalaccess colorFilterType  # 0=Grayscale, 1=Red/Green

# Linux: GNOME Accessibility
gsettings get org.gnome.desktop.a11y color-inversion-enabled
gsettings get org.gnome.desktop.a11y desaturate-enabled
```

### Alternative Palette Selector
```json
{
  "themes": {
    "matrix-green": { "primary": "#00FF00", "secondary": "#00AA00" },
    "matrix-blue": { "primary": "#0088FF", "secondary": "#0055AA" },
    "matrix-amber": { "primary": "#FFAA00", "secondary": "#885500" },
    "matrix-cyan": { "primary": "#00FFFF", "secondary": "#00AAAA" },
    "matrix-monochrome": { "primary": "#FFFFFF", "secondary": "#808080" }
  }
}
```

## Light Theme Rendering

### Unexpected Light Mode Activation
If user forces light mode (macOS: System Preferences > General > Appearance: Light), Matrix green on white background is illegible (5:1 contrast fails). 

**Solution**: Invert palette automatically:
- Text: `#001100` (very dark green, nearly black)
- Background: `#EEEEEE` (off-white, not pure white to reduce eye strain)
- Secondary green: `#005500` (darker shade for depth)

### Override via Terminal Escape Sequences
Terminal can send `OSC 10 ; rgb:RRRR/GGGG/BBBB ST` to set foreground dynamically. Detect light background via:
```bash
# Query terminal background color
printf '\033]11;?\007'  # Terminal returns bg color, parse to HSL
# If lightness > 50%, auto-switch palette
```

## Summary of Detection Pattern

Implement this detection order in initialization:

1. **OS Accessibility Preferences** (highest priority)
   - High contrast mode enabled?
   - Dark mode active?
   - Color blindness filters?
   - Grayscale enabled?

2. **Terminal Capabilities**
   - Color support (8, 16, 256, 16M)?
   - True color (RGB) support?
   - ANSI escape sequence support?

3. **Environment Variables**
   - `COLORTERM=truecolor` or `256color`?
   - `WT_SESSION` (Windows Terminal)?
   - `TERM_PROGRAM` (iTerm2, Kitty, etc.)?

4. **User Preference Override** (lowest priority)
   - Explicit theme selection in config?

5. **Fallback Chain**
   - Dimmed version of current palette → Monochrome → System default
