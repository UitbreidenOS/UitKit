# Team-Wide Matrix Theme Setup

Comprehensive guide for administrators and team leads to configure, distribute, and maintain Matrix Theme standardization across Claude Code projects.

## Overview

Matrix Theme provides dark/light mode switching, custom color palettes, and accessibility features. This guide covers enterprise-grade theme distribution via `.claude/settings.json`, CI/CD enforcement, and per-project customization.

---

## 1. Admin Setup

### Prerequisites

- Claude Code v1.0+
- Write access to team `.claude/settings.json`
- Admin role in team repository

### Initial Theme Configuration

Create or update `.claude/settings.json` in the repository root:

```json
{
  "theme": {
    "mode": "auto",
    "palette": "matrix-dark",
    "autoSwitchTime": "sunset",
    "customPalettes": {
      "matrix-dark": {
        "primary": "#00ff41",
        "secondary": "#0d3d0d",
        "accent": "#00cc33",
        "background": "#0a0e0a",
        "surface": "#0f1a0f",
        "text": "#e0e0e0",
        "error": "#ff4444"
      },
      "matrix-light": {
        "primary": "#009900",
        "secondary": "#e8f5e9",
        "accent": "#00cc00",
        "background": "#ffffff",
        "surface": "#f5f5f5",
        "text": "#212121",
        "error": "#d32f2f"
      }
    },
    "fontFamily": "Monaco, 'Courier New', monospace",
    "fontSize": 13
  },
  "permissions": {
    "allow": []
  }
}
```

### Admin Checklist

- [ ] Validate JSON syntax: `npm run validate-settings`
- [ ] Test theme switching locally: `/theme matrix-dark` then `/theme matrix-light`
- [ ] Verify accessibility: run WCAG contrast checker on colors
- [ ] Document theme rationale in team wiki
- [ ] Set up monitoring for theme-related bugs

---

## 2. Distributing Theme Config via .claude/settings.json

### Distribution Strategy

#### Option A: Centralized Configuration

All team members inherit a single theme config from `.claude/settings.json`:

```json
{
  "theme": {
    "mode": "auto",
    "palette": "matrix-dark",
    "autoSwitchTime": "sunset",
    "customPalettes": {
      "matrix-dark": { }
    }
  }
}
```

**Advantages:**
- Single source of truth
- Consistent team branding
- Easier updates (one file change)

**Disadvantages:**
- No individual customization
- Overrides user preferences

#### Option B: Distributed with Overrides

Allow `.claude/settings.local.json` to override team settings:

```json
{
  "theme": {
    "mode": "light",
    "palette": "custom-light"
  }
}
```

Users can create `.claude/settings.local.json` locally (gitignored) to override team defaults.

**Advantages:**
- Flexibility for accessibility needs
- Respects individual preferences
- Non-disruptive

**Disadvantages:**
- Requires local setup documentation
- Harder to enforce consistency

#### Option C: Role-Based Themes

Use hooks to apply different themes by role/team:

```json
{
  "hooks": {
    "onSessionStart": {
      "script": "hooks/apply-team-theme.sh",
      "condition": "env.TEAM_THEME_ENFORCE"
    }
  }
}
```

Script example (`hooks/apply-team-theme.sh`):

```bash
#!/bin/bash
TEAM="${GIT_AUTHOR_NAME:?}"

case "$TEAM" in
  frontend)
    THEME="matrix-light"
    ;;
  backend)
    THEME="matrix-dark"
    ;;
  *)
    THEME="matrix-dark"
    ;;
esac

echo "Applying theme: $THEME"
# Apply theme via settings or API
```

### Enforcement Mechanism

Add to `.claude/settings.json`:

```json
{
  "env": {
    "TEAM_THEME_ENFORCE": "1"
  },
  "hooks": {
    "onSessionStart": {
      "script": "hooks/enforce-team-theme.sh"
    }
  }
}
```

Script: `hooks/enforce-team-theme.sh`

```bash
#!/bin/bash
# Enforce team theme on session start

THEME_FILE=".claude/settings.json"
REQUIRED_PALETTE="matrix-dark"

if ! grep -q "\"palette\": \"$REQUIRED_PALETTE\"" "$THEME_FILE"; then
  echo "ERROR: Team theme not correctly configured"
  exit 1
fi

echo "✓ Team theme enforced: $REQUIRED_PALETTE"
```

---

## 3. CI/CD Enforcement

### GitHub Actions Workflow

File: `.github/workflows/enforce-theme.yml`

```yaml
name: Enforce Team Theme

on:
  pull_request:
    paths:
      - '.claude/settings.json'
      - 'docs/TEAM_SETUP.md'
  push:
    branches:
      - main

jobs:
  validate-theme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate theme configuration
        run: |
          node -e "
            const fs = require('fs');
            const settings = JSON.parse(fs.readFileSync('.claude/settings.json'));
            
            const required = ['theme', 'theme.mode', 'theme.palette'];
            for (const key of required) {
              const val = key.split('.').reduce((o, k) => o?.[k], settings);
              if (!val) throw new Error(\`Missing: \${key}\`);
            }
            
            console.log('✓ Theme config valid');
          "

      - name: Check color contrast
        run: |
          node -e "
            const settings = JSON.parse(
              require('fs').readFileSync('.claude/settings.json')
            );
            const { customPalettes } = settings.theme;
            
            // Basic WCAG AA contrast check (simplified)
            Object.entries(customPalettes).forEach(([name, palette]) => {
              console.log(\`✓ Palette '\${name}' colors defined\`);
            });
          "

      - name: Lint theme documentation
        run: |
          if ! grep -q "## Admin Setup" docs/TEAM_SETUP.md; then
            echo "ERROR: Missing required docs sections"
            exit 1
          fi
          echo "✓ Documentation complete"

  consistency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Compare settings.json and settings.local.json
        run: |
          if [ -f .claude/settings.local.json ]; then
            # Warn if local overrides team palette
            if grep -q "\"palette\"" .claude/settings.local.json; then
              echo "ℹ Local theme override detected"
            fi
          fi
          echo "✓ Settings consistency check passed"
```

### Pre-commit Hook

File: `.git/hooks/pre-commit`

```bash
#!/bin/bash

if git diff --cached .claude/settings.json | grep -q "palette"; then
  echo "Validating theme changes..."
  
  # Validate JSON
  python3 -m json.tool .claude/settings.json > /dev/null || {
    echo "ERROR: Invalid JSON in .claude/settings.json"
    exit 1
  }
  
  # Check required fields
  node -e "
    const s = require('./.claude/settings.json');
    if (!s.theme || !s.theme.palette) {
      throw new Error('Missing theme.palette');
    }
  " || exit 1
  
  echo "✓ Theme config valid"
fi

exit 0
```

Install:
```bash
cp .git/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## 4. Team Customization Guidelines

### Brand Palette Definition

Define team colors in `docs/theme-brand-colors.md`:

```markdown
# Brand Color Palette

## Matrix Dark (Default)
- **Primary**: `#00ff41` (neon green)
- **Secondary**: `#0d3d0d` (dark forest)
- **Accent**: `#00cc33` (bright green)
- **Background**: `#0a0e0a` (near-black)
- **Surface**: `#0f1a0f` (dark grey-green)
- **Text**: `#e0e0e0` (light grey)
- **Error**: `#ff4444` (red)

## Matrix Light
- **Primary**: `#009900` (dark green)
- **Secondary**: `#e8f5e9` (light green tint)
- **Background**: `#ffffff` (white)
- **Text**: `#212121` (dark grey)

## Usage Guidelines
- Use Primary for CTAs and highlights
- Use Secondary for backgrounds and less critical elements
- Use Accent sparingly for notifications
- Ensure text passes WCAG AA contrast (4.5:1 minimum)
```

### Color Addition Process

1. **Propose** new colors via GitHub issue with rationale
2. **Validate** contrast ratios using WebAIM tool
3. **Test** in both dark and light modes
4. **Document** in `theme-brand-colors.md`
5. **Update** `.claude/settings.json`
6. **Communicate** to team via release notes

### Customization Workflow

```bash
# Step 1: Create feature branch
git checkout -b feature/theme-seasonal-variant

# Step 2: Update settings.json with new palette
# Add "matrix-holiday" palette with festive colors

# Step 3: Test locally
/theme matrix-holiday

# Step 4: Run CI validation
npm run validate-theme

# Step 5: Submit PR with documentation
git commit -m "theme: add seasonal holiday palette

Adds festive colors for Q4 branding alignment.
Includes WCAG AA validation."

git push origin feature/theme-seasonal-variant
```

---

## 5. Per-Project Theme Overrides

### Project-Level Settings

File: `project-name/.claude/settings.json`

Override inherited settings:

```json
{
  "theme": {
    "palette": "matrix-dark",
    "customPalettes": {
      "project-brand": {
        "primary": "#2196F3",
        "secondary": "#E3F2FD",
        "accent": "#1976D2",
        "background": "#0a0e0a",
        "surface": "#0f1a0f",
        "text": "#e0e0e0",
        "error": "#FF5252"
      }
    }
  }
}
```

### Override Precedence

1. User `.claude/settings.local.json` (highest)
2. Project `.claude/settings.json`
3. Team `.claude/settings.json` (lowest)

### Managing Multiple Projects

Use a monorepo-friendly approach:

```
team-monorepo/
├── .claude/settings.json          # Team defaults
├── .claude/hooks/theme-apply.sh   # Auto-apply logic
├── frontend/
│   └── .claude/settings.json      # Frontend override
├── backend/
│   └── .claude/settings.json      # Backend override
└── docs/TEAM_SETUP.md
```

Script: `.claude/hooks/theme-apply.sh`

```bash
#!/bin/bash

PROJECT_DIR="${PWD##*/}"

# Map projects to themes
case "$PROJECT_DIR" in
  frontend)
    THEME="matrix-light"
    ;;
  backend)
    THEME="matrix-dark"
    ;;
  *)
    THEME="matrix-dark"  # default
    ;;
esac

# Apply theme
jq --arg theme "$THEME" '.theme.palette = $theme' .claude/settings.json > temp.json
mv temp.json .claude/settings.json

echo "Applied theme: $THEME to $PROJECT_DIR"
```

### Documenting Overrides

Add to each project's README:

```markdown
## Theme Configuration

This project uses a custom Matrix Theme variant optimized for [reason].

To switch themes:
```bash
/theme project-brand
```

Default: `matrix-dark`
Team default: Defined in root `.claude/settings.json`
```

---

## 6. Accessibility Requirements

### WCAG 2.1 Compliance

All theme configurations must meet:
- **Level AA**: Minimum 4.5:1 contrast for body text
- **Level AAA**: Minimum 7:1 contrast (recommended)
- **Large text**: Minimum 3:1 contrast

### Color Contrast Tool

Validate at `.claude/scripts/validate-contrast.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');

function getLuminance(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => {
    const v = parseInt(x, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const settings = JSON.parse(fs.readFileSync('.claude/settings.json'));
const { customPalettes } = settings.theme;

let passed = 0;
let failed = 0;

Object.entries(customPalettes).forEach(([name, colors]) => {
  const contrast = getContrast(colors.text, colors.background);
  const level = contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : 'FAIL';
  
  if (level === 'FAIL') {
    console.error(`✗ ${name}: contrast ${contrast.toFixed(2)}:1 (WCAG ${level})`);
    failed++;
  } else {
    console.log(`✓ ${name}: contrast ${contrast.toFixed(2)}:1 (WCAG ${level})`);
    passed++;
  }
});

if (failed > 0) {
  console.error(`\n✗ ${failed} palette(s) failed accessibility check`);
  process.exit(1);
}
console.log(`\n✓ All ${passed} palette(s) pass WCAG standards`);
```

Run:
```bash
node .claude/scripts/validate-contrast.js
```

### Motion & Animation

Add motion preferences:

```json
{
  "theme": {
    "accessibility": {
      "reduceMotion": true,
      "highContrast": false,
      "fontSize": "default",
      "fontWeight": "normal"
    }
  }
}
```

Support OS preference:

```bash
# In hooks/apply-accessibility.sh
if [[ $(defaults read com.apple.universalaccess reduceMotionEnabled) == 1 ]]; then
  jq '.theme.accessibility.reduceMotion = true' .claude/settings.json
fi
```

### Dyslexia-Friendly Font

Option for teams requiring dyslexia support:

```json
{
  "theme": {
    "customPalettes": {},
    "accessibility": {
      "dyslexiaFont": "OpenDyslexic"
    }
  }
}
```

### Testing Accessibility

Checklist:

- [ ] Test contrast with WebAIM tool
- [ ] Verify at 200% zoom
- [ ] Test keyboard navigation
- [ ] Use screen reader (VoiceOver/NVDA)
- [ ] Test with color blindness simulator
- [ ] Validate without color alone

Tools:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)

---

## Implementation Checklist

- [ ] Admin creates initial `.claude/settings.json` with Matrix palettes
- [ ] CI/CD workflow added and passes
- [ ] Pre-commit hook installed on team machines
- [ ] `docs/theme-brand-colors.md` created and distributed
- [ ] Accessibility validation script added
- [ ] Team documentation in `docs/TEAM_SETUP.md` complete
- [ ] Per-project overrides documented
- [ ] `.claude/settings.local.json` added to `.gitignore`
- [ ] Release notes announce theme defaults
- [ ] Team trained on theme customization workflow

---

## Troubleshooting

### Theme Not Applying

```bash
# Verify settings.json syntax
python3 -m json.tool .claude/settings.json

# Check for local override
cat .claude/settings.local.json | grep palette

# Clear cache
rm -rf ~/.cache/claudecode/theme
```

### Contrast Issues

```bash
# Run accessibility validator
node .claude/scripts/validate-contrast.js

# Check computed colors
jq '.theme.customPalettes' .claude/settings.json
```

### CI Failures

View `.github/workflows/enforce-theme.yml` logs:
1. Check JSON parsing errors
2. Verify all required palette keys present
3. Confirm contrast ratios pass WCAG AA (4.5:1)

### Settings Precedence

1. Verify `.claude/settings.local.json` doesn't override
2. Check project `.claude/settings.json` exists
3. Validate team `.claude/settings.json` is reachable
4. Confirm Claude Code version supports theme feature

---

## References

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)
- [Claude Code Settings Documentation](https://github.com/anthropics/claude-code)
- [Color Accessibility Tools](https://www.w3.org/WAI/test-evaluate/contrast-checker/)

---

## Contact & Support

- **Theme Questions**: #theme-support Slack channel
- **Accessibility Issues**: accessibility@team.internal
- **CI/CD Issues**: devops@team.internal
- **Documentation Updates**: docs-team@team.internal
