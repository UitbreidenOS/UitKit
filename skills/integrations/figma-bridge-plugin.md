---
name: figma-bridge-plugin
description: "Figma plugin integration: sync design tokens to Matrix theme system, export color palettes, update components from live design system, bi-directional design-code sync"
updated: 2026-06-22
---

# Figma Bridge Plugin Integration

## When to activate

- User wants to sync Figma design tokens to a live codebase (Matrix theme, Tailwind config, CSS variables)
- Exporting a complete color palette from Figma designs to theme system files
- Updating React/Web components from Figma component library changes
- Setting up bi-directional sync between Figma designs and application theme
- Automating design system updates without manual token extraction
- Validating that codebase component properties match live Figma component specs
- When the user says "sync Figma to theme", "export design palette", or "keep components in sync"

## When NOT to use

- Manual one-off color copying (use `/figma-to-code` for pixel-perfect UI builds instead)
- Creating a new design from scratch in Figma
- When the Figma API/plugin bridge is not set up or unavailable
- Simple screenshot-based color analysis without a live Figma source
- Standalone component creation without connecting to a design system

## Instructions

### 1. Figma Plugin Architecture

The bridge plugin runs inside Figma and communicates with your codebase via webhooks or a Node.js bridge server.

```
Figma (Plugin Runtime)
    │
    ├─ Listen for component/token changes
    ├─ Extract design tokens (colors, spacing, typography)
    ├─ Serialize component metadata
    │
    └─→ Post to Bridge Server (Node.js)
           │
           ├─ Parse Figma webhook payload
           ├─ Transform tokens to theme format
           ├─ Validate against existing tokens
           ├─ Generate/update code files
           │
           └─→ Commit to Git or trigger CI/CD
```

### 2. Plugin Setup: Figma Manifest & Client Script

**figma-plugin-manifest.json** (configure in Figma):
```json
{
  "name": "Matrix Design Bridge",
  "id": "matrix-design-sync",
  "api": "1.0.0",
  "editorType": ["figma"],
  "permissions": [
    "currentFile",
    "fileKey",
    "fileKeyMetadata"
  ],
  "documentAccess": "all",
  "webhookVersion": "1"
}
```

**figma-plugin.js** (runs in Figma):
```javascript
// Listen for file changes and extract tokens
figma.on('run', async () => {
  const file = figma.root;
  
  // Extract design tokens from specific page
  const tokensPage = file.findChild(n => n.name === 'Design Tokens');
  if (!tokensPage) {
    figma.notify('Design Tokens page not found');
    return;
  }

  // Scan for color components
  const colorTokens = extractColorTokens(tokensPage);
  const spacingTokens = extractSpacingTokens(tokensPage);
  const typographyTokens = extractTypographyTokens(tokensPage);

  // Prepare webhook payload
  const payload = {
    fileId: figma.fileKey,
    fileName: file.name,
    timestamp: new Date().toISOString(),
    tokens: {
      colors: colorTokens,
      spacing: spacingTokens,
      typography: typographyTokens
    },
    components: extractComponentMetadata(file)
  };

  // Send to bridge server
  await fetch('https://your-bridge-server.com/figma-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify(payload)
  });

  figma.notify('Design tokens synced!');
  figma.closePlugin();
});

function extractColorTokens(page) {
  const colors = {};
  page.children.forEach(node => {
    if (node.type === 'COMPONENT_SET' && node.name.startsWith('Color/')) {
      const name = node.name.replace('Color/', '').replace(/\//g, '-').toLowerCase();
      const fill = node.fills?.[0];
      if (fill && fill.type === 'SOLID') {
        colors[name] = rgbToHex(fill.color);
      }
    }
  });
  return colors;
}

function extractSpacingTokens(page) {
  const spacing = {};
  page.children.forEach(node => {
    if (node.type === 'FRAME' && node.name.startsWith('Spacing/')) {
      const name = node.name.replace('Spacing/', '').toLowerCase();
      spacing[name] = `${node.width}px`;
    }
  });
  return spacing;
}

function extractTypographyTokens(page) {
  const typography = {};
  page.children.forEach(node => {
    if (node.type === 'TEXT' && node.name.startsWith('Type/')) {
      const name = node.name.replace('Type/', '').toLowerCase();
      typography[name] = {
        fontSize: node.fontSize,
        fontFamily: node.fontName.family,
        fontWeight: node.fontName.style,
        lineHeight: node.lineHeight.value,
        letterSpacing: node.letterSpacing.value
      };
    }
  });
  return typography;
}

function extractComponentMetadata(file) {
  const components = {};
  const allComponents = file.components;
  
  allComponents.forEach(component => {
    if (component.name.includes('Component/')) {
      const key = component.key;
      components[key] = {
        name: component.name,
        description: component.description,
        width: component.width,
        height: component.height,
        fills: component.fills?.map(f => rgbToHex(f.color)) || [],
        strokes: component.strokes?.map(s => rgbToHex(s.color)) || []
      };
    }
  });
  
  return components;
}

function rgbToHex(color) {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}
```

### 3. Bridge Server: Node.js Webhook Handler

**bridge-server.js** (runs in your codebase CI/CD):
```javascript
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

app.post('/figma-sync', async (req, res) => {
  const { tokens, components, fileId } = req.body;

  try {
    // 1. Validate token payload
    validateTokens(tokens);

    // 2. Transform to Matrix theme format
    const themeConfig = transformToMatrixTheme(tokens);

    // 3. Write to theme files
    await writeThemeFiles(themeConfig);

    // 4. Validate component sync
    await validateComponentSync(components);

    // 5. Commit changes to Git
    await commitChanges(fileId, tokens);

    res.json({ success: true, message: 'Design tokens synced' });
  } catch (error) {
    console.error('Sync failed:', error);
    res.status(400).json({ error: error.message });
  }
});

function transformToMatrixTheme(tokens) {
  return {
    color: tokens.colors,
    spacing: tokens.spacing,
    typography: tokens.typography,
    // Add Matrix-specific theme extensions
    matrix: {
      semanticTokens: generateSemanticTokens(tokens.colors),
      darkMode: generateDarkModeTokens(tokens.colors)
    }
  };
}

function generateSemanticTokens(colors) {
  // Map raw colors to semantic roles
  return {
    primary: colors['brand-primary'] || colors['blue-600'],
    secondary: colors['brand-secondary'] || colors['gray-600'],
    success: colors['feedback-success'] || colors['green-600'],
    warning: colors['feedback-warning'] || colors['yellow-600'],
    error: colors['feedback-error'] || colors['red-600'],
    background: colors['surface-default'] || colors['white'],
    foreground: colors['text-default'] || colors['gray-900']
  };
}

function generateDarkModeTokens(colors) {
  // Invert luminance for dark mode
  const darkTokens = {};
  Object.entries(colors).forEach(([key, hex]) => {
    darkTokens[key] = invertColor(hex);
  });
  return darkTokens;
}

async function writeThemeFiles(themeConfig) {
  // Write to Matrix theme format
  const themeJson = JSON.stringify(themeConfig, null, 2);
  await fs.writeFile(
    path.join(process.cwd(), 'src/theme/design-tokens.json'),
    themeJson
  );

  // Generate CSS variables
  const cssVariables = generateCSSVariables(themeConfig);
  await fs.writeFile(
    path.join(process.cwd(), 'src/theme/tokens.css'),
    cssVariables
  );

  // Update Tailwind config
  const tailwindConfig = generateTailwindConfig(themeConfig);
  await fs.writeFile(
    path.join(process.cwd(), 'tailwind.config.js'),
    tailwindConfig
  );
}

function generateCSSVariables(config) {
  let css = ':root {\n';
  
  Object.entries(config.color).forEach(([key, value]) => {
    css += `  --color-${key}: ${value};\n`;
  });
  
  Object.entries(config.spacing).forEach(([key, value]) => {
    css += `  --space-${key}: ${value};\n`;
  });
  
  css += '}\n';
  return css;
}

function generateTailwindConfig(config) {
  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(config.color, null, 6)},
      spacing: ${JSON.stringify(config.spacing, null, 6)},
      fontFamily: ${JSON.stringify(extractFontFamilies(config.typography), null, 6)}
    }
  }
};`;
}

async function validateComponentSync(components) {
  // Verify that exported components exist in codebase
  const componentDir = path.join(process.cwd(), 'src/components');
  const errors = [];

  for (const [key, spec] of Object.entries(components)) {
    const expectedFile = path.join(componentDir, spec.name.replace(/\//g, '/') + '.tsx');
    try {
      await fs.access(expectedFile);
    } catch {
      errors.push(`Component missing: ${spec.name} (expected at ${expectedFile})`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Component validation failed:\n${errors.join('\n')}`);
  }
}

async function commitChanges(fileId, tokens) {
  const { execSync } = require('child_process');
  
  try {
    execSync('git add src/theme/ tailwind.config.js');
    execSync(`git commit -m "chore: sync design tokens from Figma (${fileId})"`);
    execSync('git push origin main');
  } catch (error) {
    console.warn('Git commit failed:', error.message);
    // Don't fail the sync if git push fails
  }
}

app.listen(3001, () => console.log('Bridge server listening on :3001'));
```

### 4. Matrix Theme Integration

**src/theme/matrix-bridge.ts** (type-safe token consumer):
```typescript
import tokens from './design-tokens.json';

export type ColorToken = keyof typeof tokens.color;
export type SpacingToken = keyof typeof tokens.spacing;

export const themeConfig = {
  colors: tokens.color,
  spacing: tokens.spacing,
  typography: tokens.typography,
  
  // Helper to use tokens in components
  getColor: (token: ColorToken) => tokens.color[token],
  getSpacing: (token: SpacingToken) => tokens.spacing[token],
  
  // Matrix-specific API
  resolveSemanticColor: (role: 'primary' | 'secondary' | 'error') => {
    const mapping = {
      primary: tokens.matrix.semanticTokens.primary,
      secondary: tokens.matrix.semanticTokens.secondary,
      error: tokens.matrix.semanticTokens.error
    };
    return mapping[role];
  }
};
```

### 5. Component Update Automation

**sync-components.js** (run on webhook trigger):
```javascript
const Figma = require('figma-api').default;
const fs = require('fs').promises;
const path = require('path');

async function syncComponents() {
  const figma = new Figma({ personalAccessToken: process.env.FIGMA_TOKEN });
  const file = await figma.getFile(process.env.FIGMA_FILE_KEY);

  // Iterate all components
  for (const [nodeId, component] of Object.entries(file.components)) {
    const { name, description } = component;
    
    // Extract component props from description (JSON format)
    let props = {};
    try {
      props = JSON.parse(description);
    } catch {
      continue; // Skip if not JSON
    }

    // Update corresponding React component
    const componentPath = path.join(
      process.cwd(),
      'src/components',
      name.replace(/\//g, '/') + '.tsx'
    );

    const componentCode = await updateComponentProps(componentPath, props);
    await fs.writeFile(componentPath, componentCode);
  }

  console.log('Components synced from Figma');
}

async function updateComponentProps(filePath, figmaProps) {
  let code = await fs.readFile(filePath, 'utf-8');
  
  // Update component interface based on Figma metadata
  const interfacePattern = /interface Props \{[\s\S]*?\}/;
  const newInterface = generatePropsInterface(figmaProps);
  
  code = code.replace(interfacePattern, newInterface);
  return code;
}

function generatePropsInterface(props) {
  let interface = 'interface Props {\n';
  Object.entries(props).forEach(([key, type]) => {
    interface += `  ${key}: ${mapFigmaTypeToTS(type)};\n`;
  });
  interface += '}';
  return interface;
}

syncComponents().catch(console.error);
```

### 6. CI/CD Integration: GitHub Actions

**.github/workflows/figma-sync.yml**:
```yaml
name: Sync Figma Design Tokens

on:
  webhook:
    events:
      - figma:file:update

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install figma-api express
      
      - name: Sync components from Figma
        run: node scripts/sync-components.js
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
      
      - name: Rebuild theme
        run: npm run build:theme
      
      - name: Run tests
        run: npm test
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "Figma Sync Bot"
          git add src/theme/ tailwind.config.js
          git commit -m "chore: sync design tokens from Figma" || true
          git push
```

### 7. Color Palette Export Format

**Design tokens exported structure**:
```json
{
  "color": {
    "brand-primary": "#2563EB",
    "brand-secondary": "#7C3AED",
    "text-default": "#1E293B",
    "text-secondary": "#64748B",
    "surface-default": "#FFFFFF",
    "surface-elevated": "#F8FAFC",
    "feedback-success": "#22C55E",
    "feedback-warning": "#F59E0B",
    "feedback-error": "#EF4444"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "typography": {
    "heading-1": {
      "fontSize": 32,
      "fontFamily": "Inter",
      "fontWeight": 700,
      "lineHeight": 1.25
    },
    "body-regular": {
      "fontSize": 16,
      "fontFamily": "Inter",
      "fontWeight": 400,
      "lineHeight": 1.5
    }
  },
  "matrix": {
    "semanticTokens": {
      "primary": "#2563EB",
      "secondary": "#7C3AED",
      "error": "#EF4444"
    },
    "darkMode": {
      "surface-default": "#0F172A",
      "text-default": "#F1F5F9"
    }
  }
}
```

### 8. Validation & Audit Checklist

Before syncing tokens to production:

```yaml
pre_sync_validation:
  token_structure:
    - check: "All colors in hex format (#RRGGBB)"
    - check: "Spacing values use consistent units (px or rem)"
    - check: "Typography includes required font properties"
    
  accessibility:
    - check: "Text colors meet WCAG AA contrast (4.5:1)"
    - check: "Large text meets WCAG AA (3:1)"
    - check: "No color-only dependency for meaning (icons have labels)"
    
  consistency:
    - check: "No duplicate token values with different names"
    - check: "Semantic tokens map to existing raw tokens"
    - check: "Dark mode tokens are distinct but related"
    
  codebase_readiness:
    - check: "Theme file path exists and is writable"
    - check: "Tailwind config file exists"
    - check: "No local uncommitted theme changes (prevent merge conflicts)"
    - check: "Target branch is up-to-date"
```

## Example

**Scenario: Sync Figma design tokens to a live React/Tailwind app**

User: "Our Figma file has updated colors and spacing. Sync the design tokens to our theme."

Process:
1. User opens Figma → runs "Matrix Design Bridge" plugin
2. Plugin extracts 32 color tokens, 6 spacing scales, 8 typography styles
3. Sends webhook to bridge server with token payload
4. Bridge server:
   - Validates all colors (WCAG contrast check passes)
   - Transforms to Matrix semantic tokens
   - Writes `design-tokens.json`, `tokens.css`, `tailwind.config.js`
   - Validates component signatures match
   - Creates Git commit: "chore: sync design tokens from Figma"
5. CI/CD pipeline runs tests (passes)
6. Changes deployed to staging
7. Codebase now uses live Figma tokens — any design change propagates instantly

**Result:** 0 manual color copying, 100% design-code fidelity, fast iteration cycles.

## Anti-Patterns

- **Manual token copying:** Extracting colors by hand defeats the purpose — always automate
- **Unvalidated sync:** Syncing without WCAG/accessibility checks — validation is non-negotiable
- **No version control:** Not committing token changes to Git — track every sync for audit and rollback
- **Missing component validation:** Syncing token changes without verifying components still render — always run tests
- **Figma-code drift:** Setting up sync and then ignoring updates — establish a workflow cadence (e.g., sync on commit to `design-tokens` branch)
- **Over-syncing:** Syncing on every Figma keystroke — batch updates, sync once per design review or sprint
- **No dark mode strategy:** Exporting colors without considering dark mode variants — plan theme variants upfront
