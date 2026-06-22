# THEME_CUSTOMIZATION.md — Advanced Theme Customization Guide

This guide covers advanced customization techniques for Claude Code themes. It assumes familiarity with the basic [Themes README](./themes/README.md). For creating your first theme, start there.

---

## Table of Contents

1. [Extending the Color Palette](#extending-the-color-palette)
2. [Adding Custom Animations](#adding-custom-animations)
3. [Creating Theme Variants](#creating-theme-variants)
4. [Sharing Themes](#sharing-themes)
5. [Theme Distribution & Registry](#theme-distribution--registry)

---

## Extending the Color Palette

### Understanding Color Roles

The base theme system supports 20 core color tokens:

```json
{
  "colors": {
    "background": "#...",    // Primary background
    "foreground": "#...",    // Primary text
    "cursor": "#...",        // Cursor/caret color
    "selection": "#...",     // Text selection background
    "black": "#...",         // ANSI black
    "red": "#...",           // ANSI red (errors, destructive)
    "green": "#...",         // ANSI green (success, additions)
    "yellow": "#...",        // ANSI yellow (warnings)
    "blue": "#...",          // ANSI blue (info, links)
    "magenta": "#...",       // ANSI magenta (secondaryAccent)
    "cyan": "#...",          // ANSI cyan (tertiary)
    "white": "#...",         // ANSI white
    "brightBlack": "#...",   // Dimmed text/backgrounds
    "brightRed": "#...",     // Highlight red
    "brightGreen": "#...",   // Highlight green
    "brightYellow": "#...",  // Highlight yellow
    "brightBlue": "#...",    // Highlight blue
    "brightMagenta": "#...", // Highlight magenta
    "brightCyan": "#...",    // Highlight cyan
    "brightWhite": "#..."    // Bright white
  }
}
```

### Semantic Color Pairs

For visual consistency, define semantic pairs:

```json
{
  "colors": {
    "background": "#1a1a2e",
    "foreground": "#e0e0e0",
    
    // Success states
    "green": "#2ecc71",           // Action: confirm, add, enable
    "brightGreen": "#27ae60",      // Hover/active state
    
    // Error states
    "red": "#e74c3c",              // Action: delete, error, break
    "brightRed": "#c0392b",        // Hover/active state
    
    // Warning states
    "yellow": "#f39c12",           // Action: caution, incomplete
    "brightYellow": "#e67e22",     // Hover/active state
    
    // Info states
    "blue": "#3498db",             // Action: info, link, navigate
    "brightBlue": "#2980b9",       // Hover/active state
    
    // Secondary/tertiary
    "magenta": "#9b59b6",          // Secondary accent
    "cyan": "#1abc9c",             // Tertiary accent
    "brightBlack": "#34495e"       // Dimmed/inactive elements
  }
}
```

### Adding Custom Color Metadata

Extend theme files with a `_metadata` section to document custom colors:

```json
{
  "name": "Custom Theme",
  "colors": { /* ... */ },
  "ui": { /* ... */ },
  "_metadata": {
    "colorPalette": {
      "primary": {
        "base": "#3498db",
        "light": "#5dade2",
        "dark": "#2874a6",
        "description": "Primary action and focus states"
      },
      "secondary": {
        "base": "#9b59b6",
        "light": "#bb8fce",
        "dark": "#6c3483",
        "description": "Secondary accent and alternate states"
      },
      "semantic": {
        "success": "#2ecc71",
        "warning": "#f39c12",
        "error": "#e74c3c",
        "info": "#3498db"
      }
    },
    "contrastRatios": {
      "foregroundOnBackground": 7.5,
      "accentOnBackground": 6.2,
      "description": "WCAG AA compliance levels"
    },
    "accessibility": {
      "daltonized": false,
      "highContrast": false,
      "supportedModes": ["dark"]
    }
  }
}
```

### Creating Color Harmonies

Use color harmony rules to ensure theme coherence:

```json
{
  "_metadata": {
    "harmony": {
      "type": "complementary",
      "description": "Complementary color scheme with primary and secondary",
      "baseHue": 210,
      "harmonicAngles": [0, 180],
      "saturation": 65,
      "brightness": 50
    },
    "pallette": {
      "primary": "hsl(210, 65%, 50%)",    // #3498db
      "secondary": "hsl(30, 65%, 50%)",  // #ff9f43 (complementary)
      "accent1": "hsl(150, 65%, 50%)",   // #1abc9c (analogous)
      "accent2": "hsl(270, 65%, 50%)"    // #af7ac5 (split-complementary)
    }
  }
}
```

---

## Adding Custom Animations

### Animation Structure

Extend themes with a custom `animations` object:

```json
{
  "animations": {
    "cursor": {
      "type": "blink",
      "duration": "800ms",
      "easing": "step(2, start)",
      "iterationCount": "infinite"
    },
    "selection": {
      "type": "pulse",
      "duration": "1200ms",
      "easing": "ease-in-out",
      "iterationCount": "infinite"
    },
    "focus": {
      "type": "glow",
      "duration": "300ms",
      "easing": "ease-out",
      "intensity": 0.8
    }
  }
}
```

### Pre-defined Animation Types

| Type | Use Case | Easing Defaults |
|---|---|---|
| `blink` | Cursor, loading indicators | `step-end` |
| `pulse` | Subtle emphasis, breathing effect | `ease-in-out` |
| `glow` | Focus states, highlights | `ease-out` |
| `slide` | Transitions, drawer animations | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `fade` | Opacity transitions | `ease-in-out` |
| `bounce` | Interactive feedback | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` |
| `shake` | Error states, warnings | `cubic-bezier(0.36, 0, 0.66, -0.56)` |
| `glitch` | Neon/cyberpunk themes | `steps(4, end)` |
| `scanline` | Terminal/retro themes | `linear` |

### CSS Keyframe Definitions

For advanced animations, include raw keyframes:

```json
{
  "animations": {
    "terminalGlitch": {
      "type": "custom",
      "duration": "150ms",
      "iterationCount": "3",
      "keyframes": [
        { "offset": 0, "transform": "translateX(0px)", "color": "#00ff41" },
        { "offset": 33, "transform": "translateX(2px)", "color": "#00ffff" },
        { "offset": 66, "transform": "translateX(-2px)", "color": "#ff0055" },
        { "offset": 100, "transform": "translateX(0px)", "color": "#00ff41" }
      ]
    },
    "codeBlockEnter": {
      "type": "custom",
      "duration": "400ms",
      "easing": "ease-out",
      "keyframes": [
        { "offset": 0, "opacity": 0, "transform": "scale(0.95)" },
        { "offset": 100, "opacity": 1, "transform": "scale(1)" }
      ]
    }
  }
}
```

### Performance Considerations

Use `will-change` and `contain` in animation metadata:

```json
{
  "animations": {
    "performantCursor": {
      "type": "blink",
      "duration": "800ms",
      "gpu": true,
      "cssHints": {
        "willChange": "opacity",
        "contain": "layout style paint"
      },
      "preferReducedMotion": "hide"
    }
  }
}
```

---

## Creating Theme Variants

### Monochromatic Variants

Create a base theme and derive light/dark variants from a single hue:

**Base theme structure** (`themes/arctic-base.json`):

```json
{
  "name": "Arctic Base",
  "author": "your-name",
  "_isBase": true,
  "hue": 200,
  "saturation": 60,
  "brightness": 45,
  "colors": {
    "background": "hsl(200, 60%, 10%)",
    "foreground": "hsl(200, 60%, 90%)",
    "blue": "hsl(200, 60%, 50%)",
    "brightBlue": "hsl(200, 60%, 70%)"
  }
}
```

**Light variant** (`themes/arctic-light.json`):

```json
{
  "name": "Arctic Light",
  "author": "your-name",
  "base": "arctic-base",
  "brightness": 85,
  "colors": {
    "background": "hsl(200, 60%, 95%)",
    "foreground": "hsl(200, 60%, 20%)",
    "cursor": "hsl(200, 60%, 30%)",
    "selection": "hsl(200, 60%, 80%)"
  }
}
```

**Dark variant** (`themes/arctic-dark.json`):

```json
{
  "name": "Arctic Dark",
  "author": "your-name",
  "base": "arctic-base",
  "brightness": 15,
  "colors": {
    "background": "hsl(200, 60%, 8%)",
    "foreground": "hsl(200, 60%, 92%)",
    "cursor": "hsl(200, 60%, 70%)",
    "selection": "hsl(200, 60%, 25%)"
  }
}
```

### Accessibility Variants

Daltonized themes for color-blind users:

```json
{
  "name": "Gruvbox Tritanopia",
  "baseTheme": "gruvbox",
  "accessibility": {
    "type": "tritanopia",
    "description": "For blue-yellow color blindness"
  },
  "colors": {
    "red": "#fe6e00",      // Orange (more visible to tritanopes)
    "green": "#2fb3a8",    // Teal (more visible to tritanopes)
    "blue": "#0087be",     // Darker blue
    "yellow": "#f9b233"    // Amber
  }
}
```

**Deuteranopia variant** (red-green blindness):

```json
{
  "accessibility": {
    "type": "deuteranopia"
  },
  "colors": {
    "red": "#ff5e00",
    "green": "#00a8e1",
    "yellow": "#ffd600"
  }
}
```

**Protanopia variant** (red-green blindness, shifted):

```json
{
  "accessibility": {
    "type": "protanopia"
  },
  "colors": {
    "red": "#ee6100",
    "green": "#0099ff",
    "yellow": "#ffbe00"
  }
}
```

### Time-of-Day Variants

Create contextual themes:

```json
{
  "name": "Arctic Morning",
  "scheduleContext": "morning",
  "description": "Softer blues, warmer tones for early hours",
  "colors": {
    "background": "hsl(240, 30%, 12%)",
    "foreground": "hsl(60, 20%, 88%)",
    "blue": "hsl(210, 40%, 55%)",
    "yellow": "hsl(45, 80%, 60%)"
  }
}
```

```json
{
  "name": "Arctic Evening",
  "scheduleContext": "evening",
  "description": "Deeper blues, amber accents for evening viewing",
  "colors": {
    "background": "hsl(200, 50%, 8%)",
    "foreground": "hsl(40, 30%, 92%)",
    "blue": "hsl(200, 60%, 45%)",
    "yellow": "hsl(40, 90%, 55%)"
  }
}
```

### Seasonal Variants

Theme families tied to seasons:

```json
{
  "name": "Sakura Spring",
  "season": "spring",
  "colors": {
    "background": "#f5e6e8",
    "foreground": "#3d2d35",
    "magenta": "#ff69b4",
    "brightMagenta": "#ffb6d9"
  }
}
```

---

## Sharing Themes

### Theme Metadata Standards

Include comprehensive metadata for discoverability:

```json
{
  "name": "Custom Theme Name",
  "version": "1.0.0",
  "author": "Your Name",
  "maintainer": "your.email@example.com",
  "repository": "https://github.com/username/theme-repo",
  "license": "MIT",
  "description": "A brief description of the theme's visual style and philosophy",
  "keywords": ["dark", "neon", "terminal", "cyberpunk"],
  "tags": {
    "mood": "cyberpunk",
    "contrast": "high",
    "baseMode": "dark",
    "accessibility": ["daltonized", "highContrast"]
  },
  "readme": "https://github.com/username/theme-repo/blob/main/README.md",
  "demo": {
    "image": "https://example.com/theme-demo.png",
    "video": "https://youtube.com/watch?v=...",
    "livePreview": "https://theme-preview.example.com"
  },
  "compatibility": {
    "claudeCode": ">=1.0.0",
    "platforms": ["macos", "linux", "windows"]
  }
}
```

### Publishing to Community Registry

Theme structure for community submission:

```
my-theme/
├── theme.json          # Main theme file
├── README.md           # Usage instructions
├── CUSTOMIZATION.md    # Advanced customization guide (optional)
├── LICENSE             # License file (MIT, Apache-2.0, etc.)
├── assets/
│   ├── preview.png     # 1200x800px preview image
│   ├── demo.mp4        # ~30s demo video (optional)
│   └── palette.json    # Color reference for documentation
└── .claude-theme       # Metadata marker
```

### README Template for Shared Themes

```markdown
# Theme Name

Brief 1-2 sentence description.

## Installation

\`\`\`bash
cp theme.json ~/.claude/themes/
\`\`\`

Then run `/theme` in Claude Code and select this theme.

## Features

- Feature 1
- Feature 2
- Feature 3

## Customization

Edit these colors in `~/.claude/themes/theme.json`:

| Token | Default | Purpose |
|---|---|---|
| `background` | `#...` | Primary background |
| `foreground` | `#...` | Primary text |

## Inspiration

Credit any color schemes, projects, or artists that inspired this theme.

## Author & License

- **Author**: Your Name
- **License**: MIT (or other)
```

### Theme Discoverability

Include a `.claude-theme` metadata file for auto-discovery:

```json
{
  "theme": {
    "name": "Custom Theme",
    "id": "custom-theme",
    "version": "1.0.0",
    "type": "community",
    "registryUrl": "https://registry.example.com/themes/custom-theme"
  }
}
```

---

## Theme Distribution & Registry

### Setting Up a Theme Repository

Initialize a GitHub repository for a theme family:

```bash
git init my-themes
cd my-themes

# Create directory structure
mkdir -p themes/{dark,light,accessible}
mkdir -p assets/{previews,demos}

# Initialize package metadata
cat > package.json << 'EOF'
{
  "name": "my-themes",
  "version": "1.0.0",
  "description": "Collection of custom themes for Claude Code",
  "author": "Your Name",
  "license": "MIT",
  "keywords": ["theme", "claude-code", "color-scheme"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-themes.git"
  }
}
EOF

# Create an index
cat > themes/index.json << 'EOF'
{
  "version": "1.0",
  "themes": [
    {
      "id": "theme-1",
      "name": "Theme Name",
      "file": "dark/theme-1.json"
    }
  ]
}
EOF
```

### Hosting on npm

Distribute themes as an npm package:

```json
{
  "name": "@username/claude-themes",
  "version": "1.0.0",
  "description": "Collection of Claude Code themes",
  "main": "index.js",
  "files": ["themes/", "index.js"],
  "scripts": {
    "postinstall": "node scripts/install-themes.js"
  }
}
```

**Installation script** (`scripts/install-themes.js`):

```javascript
const fs = require('fs');
const path = require('path');
const os = require('os');

const themesDir = path.join(os.homedir(), '.claude', 'themes');
const sourceDir = path.join(__dirname, '..', 'themes');

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach(file => {
  if (file.endsWith('.json')) {
    const src = path.join(sourceDir, file);
    const dst = path.join(themesDir, file);
    fs.copyFileSync(src, dst);
    console.log(`Installed theme: ${file}`);
  }
});
```

### Hosting on a Custom Registry

For a centralized theme marketplace:

```json
{
  "registry": {
    "url": "https://themes.example.com",
    "apiVersion": "1.0",
    "endpoints": {
      "list": "/api/themes",
      "get": "/api/themes/{id}",
      "submit": "/api/themes/submit"
    }
  },
  "submission": {
    "guidelines": "https://themes.example.com/contribute",
    "reviewProcess": "automated + manual",
    "approval": "48-hour SLA"
  }
}
```

### Creating a Theme Manager CLI

Build a CLI tool for theme management:

```bash
#!/bin/bash
# claude-theme-manager

case "$1" in
  list)
    curl -s https://registry.example.com/api/themes | jq '.themes[]'
    ;;
  install)
    THEME_URL="https://registry.example.com/themes/$2.json"
    curl -o ~/.claude/themes/$2.json "$THEME_URL"
    echo "Theme '$2' installed"
    ;;
  remove)
    rm ~/.claude/themes/$2.json
    echo "Theme '$2' removed"
    ;;
  preview)
    open "https://registry.example.com/preview/$2"
    ;;
  *)
    echo "Usage: $0 {list|install|remove|preview} [theme-name]"
    ;;
esac
```

### Distribution Checklist

When publishing a theme:

- [ ] Theme validates against JSON schema
- [ ] All color tokens have sufficient contrast (WCAG AA minimum 4.5:1 for text)
- [ ] Color palette is described in metadata
- [ ] README includes installation and customization
- [ ] Preview image shows the theme in action (1200x800px PNG)
- [ ] License is clearly stated (MIT recommended)
- [ ] Author attribution included
- [ ] Repository (if public) has descriptive README
- [ ] Theme tested in Claude Code with actual content
- [ ] Version number follows semver (MAJOR.MINOR.PATCH)
- [ ] Changelog documents any breaking changes

### Promoting Your Theme

After publishing:

1. **Community Channels**
   - Share in Claude Code forums/Discord
   - Post in design communities (Design Systems, ColorLovers, Dribbble)
   - Create a Twitter/X thread with preview image

2. **Documentation**
   - Add to community theme registry (if one exists)
   - Include in marketplace README with link
   - Create a blog post or tutorial

3. **Engagement**
   - Respond to issues and feature requests
   - Maintain compatibility with Claude Code updates
   - Iterate based on user feedback

---

## Best Practices

### Color Harmony Checklist

- [ ] Background and foreground contrast ratio ≥ 7:1 (WCAG AAA)
- [ ] All accent colors contrast ≥ 4.5:1 against their backgrounds
- [ ] Red and green are never the only differentiators
- [ ] Color palette is consistent across light and dark variants
- [ ] 20+ distinct colors for good visual hierarchy

### Animation Best Practices

- [ ] Respect `prefers-reduced-motion` system preference
- [ ] Keep animations under 400ms for UI feedback
- [ ] Use `will-change` sparingly (max 2-3 properties)
- [ ] Test animations on low-end hardware

### Documentation Best Practices

- [ ] Include installation instructions
- [ ] Document all non-standard color tokens
- [ ] Provide side-by-side comparisons with related themes
- [ ] Include troubleshooting section
- [ ] Show real code examples in the theme's colors

### Versioning Best Practices

- [ ] Use semver (1.0.0 format)
- [ ] Increment MAJOR for breaking changes (incompatible JSON schema)
- [ ] Increment MINOR for new features (new color tokens)
- [ ] Increment PATCH for fixes (color value adjustments)
- [ ] Maintain changelog

---

## Related Documentation

- **[Themes README](./themes/README.md)** — Official theme system overview
- **[Theme JSON Schema](#)** — Complete specification (if published)
- **[Community Themes Registry](#)** — Submit and browse themes
- **[Accessibility Guidelines](#)** — WCAG compliance for themes

---

## Example: Complete Advanced Theme

```json
{
  "name": "Nebula Pro",
  "version": "2.1.0",
  "author": "Jane Developer",
  "maintainer": "jane@example.com",
  "license": "MIT",
  "repository": "https://github.com/example/nebula-pro",
  "description": "A vibrant, high-contrast theme inspired by deep space",
  
  "keywords": ["dark", "neon", "space", "high-contrast"],
  "tags": {
    "mood": "futuristic",
    "contrast": "high",
    "baseMode": "dark",
    "accessibility": ["wcag-aaa", "daltonized-tritanopia"]
  },
  
  "colors": {
    "background": "#0a0e27",
    "foreground": "#e0e6ff",
    "cursor": "#00d9ff",
    "selection": "#00d9ff44",
    "black": "#0a0e27",
    "red": "#ff006e",
    "green": "#00d084",
    "yellow": "#ffbe0b",
    "blue": "#0099ff",
    "magenta": "#c77dff",
    "cyan": "#00d9ff",
    "white": "#e0e6ff",
    "brightBlack": "#4a5280",
    "brightRed": "#ff4a9e",
    "brightGreen": "#33ffaa",
    "brightYellow": "#ffdd33",
    "brightBlue": "#33ccff",
    "brightMagenta": "#ee9eff",
    "brightCyan": "#33ffff",
    "brightWhite": "#ffffff"
  },
  
  "ui": {
    "statusline": {
      "background": "#0d1137",
      "foreground": "#8891d3",
      "accent": "#00d9ff"
    }
  },
  
  "animations": {
    "cursor": {
      "type": "blink",
      "duration": "800ms",
      "easing": "step(2, start)",
      "iterationCount": "infinite",
      "gpu": true,
      "preferReducedMotion": "hide"
    },
    "selection": {
      "type": "pulse",
      "duration": "1000ms",
      "easing": "ease-in-out",
      "keyframes": [
        { "offset": 0, "opacity": 0.5 },
        { "offset": 50, "opacity": 0.8 },
        { "offset": 100, "opacity": 0.5 }
      ]
    }
  },
  
  "_metadata": {
    "colorPalette": {
      "primary": {
        "base": "#0099ff",
        "light": "#33ccff",
        "dark": "#0066cc",
        "description": "Primary action and focus states"
      },
      "accent": {
        "base": "#00d9ff",
        "light": "#33ffff",
        "dark": "#0099cc",
        "description": "Primary accent for highlights"
      },
      "semantic": {
        "success": "#00d084",
        "warning": "#ffbe0b",
        "error": "#ff006e",
        "info": "#0099ff"
      }
    },
    "contrast": {
      "foregroundOnBackground": 12.5,
      "accentOnBackground": 9.2,
      "wcagLevel": "AAA"
    },
    "inspiration": "Inspired by galactic nebulae and deep space phenomena",
    "credits": "Color science consultation with @colorologist"
  }
}
```

---

**Last Updated**: June 2026
**Status**: Production-ready
**Maintained by**: Claudient Theme Team
