#!/usr/bin/env node

/**
 * Theme Builder Batch - Non-interactive theme generation
 * Accepts JSON config and generates themes programmatically
 * Useful for creating multiple themes, CI/CD, and testing
 */

const fs = require('fs');
const path = require('path');

// Default theme template
const THEME_TEMPLATE = {
  name: 'Untitled Theme',
  description: 'Custom Matrix-inspired theme',
  version: '1.0.0',
  type: 'dark',
  author: 'theme-builder',
  license: 'MIT',
  colors: {},
  typography: {},
  spacing: {},
  borderRadius: {},
  shadows: {},
  effects: {},
  components: {},
  animations: {},
  states: {},
  metadata: {}
};

// Color palettes
const PALETTES = {
  matrixClassic: {
    primary: '#00ff41',
    primaryLight: '#39ff14',
    primaryDark: '#00cc33',
    secondary: '#00ff41',
    background: '#0a0e27',
    surface: '#0f1419',
    surfaceLight: '#1a1f2e',
    surfaceDark: '#050812',
    text: '#00ff41',
    textSecondary: '#00cc33',
    textTertiary: '#008000',
    textInverse: '#000000',
    border: '#00ff41',
    borderLight: '#00cc33',
    borderDark: '#003d00',
    error: '#ff004d',
    errorLight: '#ff1744',
    errorDark: '#c40030',
    success: '#00ff41',
    successLight: '#39ff14',
    successDark: '#00cc33',
    warning: '#ffb700',
    warningLight: '#ffd60a',
    warningDark: '#cc9200',
    info: '#00d4ff',
    infoLight: '#00e5ff',
    infoDark: '#0099cc',
    disabled: '#1a3a1a',
    placeholder: '#004d00',
    overlay: 'rgba(0, 0, 0, 0.8)',
    shadow: 'rgba(0, 255, 65, 0.1)',
    cursor: '#00ff41',
    selection: '#00ff4133',
    black: '#000000',
    red: '#ff0055',
    green: '#00ff41',
    yellow: '#ffff00',
    blue: '#0099ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff'
  },
  matrixNeon: {
    primary: '#39ff14',
    primaryLight: '#66ff66',
    primaryDark: '#00cc33',
    secondary: '#00ffff',
    background: '#0a0a1a',
    surface: '#0f0f2e',
    text: '#39ff14',
    textSecondary: '#00ffff',
    error: '#ff1744',
    success: '#39ff14',
    warning: '#ffd60a',
    info: '#00e5ff'
  },
  cyberpunk: {
    primary: '#ff00ff',
    primaryLight: '#ff33ff',
    primaryDark: '#cc00cc',
    secondary: '#00ffff',
    background: '#0d0221',
    surface: '#1a0a2e',
    text: '#ff00ff',
    textSecondary: '#00ffff',
    error: '#ff006e',
    success: '#00ff41',
    warning: '#ffd60a',
    info: '#00d4ff'
  }
};

// Typography presets
const TYPOGRAPHY_PRESETS = {
  monospace: {
    fontFamily: {
      mono: "'Courier New', 'Courier', 'IBM Plex Mono', 'Roboto Mono', monospace",
      sans: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace"
    }
  },
  modern: {
    fontFamily: {
      mono: "'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }
  }
};

// Default spacing scale
const DEFAULT_SPACING = {
  '0': '0px', '1': '2px', '2': '4px', '3': '6px', '4': '8px',
  '6': '12px', '8': '16px', '12': '24px', '16': '32px',
  '20': '40px', '24': '48px', '32': '64px'
};

const DEFAULT_BORDER_RADIUS = {
  'none': '0px', 'sm': '2px', 'base': '4px', 'md': '6px',
  'lg': '8px', 'xl': '12px', '2xl': '16px', 'full': '9999px'
};

// Effects presets
const EFFECTS_PRESETS = {
  heavy: {
    scanlines: { enabled: true, opacity: 0.08 },
    glow: { enabled: true, intensity: 'strong', blur: '12px' },
    crt: { enabled: true, curvature: '2%' }
  },
  moderate: {
    scanlines: { enabled: true, opacity: 0.03 },
    glow: { enabled: true, intensity: 'medium', blur: '8px' },
    crt: { enabled: false }
  },
  minimal: {
    scanlines: { enabled: false },
    glow: { enabled: true, intensity: 'light', blur: '4px' },
    crt: { enabled: false }
  }
};

/**
 * Create a theme from config
 */
function createTheme(config) {
  const theme = { ...THEME_TEMPLATE };

  // Basic metadata
  if (config.name) theme.name = config.name;
  if (config.description) theme.description = config.description;
  if (config.type) theme.type = config.type;
  if (config.author) theme.author = config.author;
  if (config.license) theme.license = config.license;

  // Colors
  if (config.palette && PALETTES[config.palette]) {
    theme.colors = { ...PALETTES[config.palette] };
  } else if (config.colors) {
    theme.colors = config.colors;
  }

  // Typography
  if (config.typography) {
    if (typeof config.typography === 'string' && TYPOGRAPHY_PRESETS[config.typography]) {
      theme.typography = { ...TYPOGRAPHY_PRESETS[config.typography] };
    } else if (typeof config.typography === 'object') {
      theme.typography = config.typography;
    }
  }

  // Add font sizes if missing
  if (!theme.typography.fontSize) {
    theme.typography.fontSize = {
      xs: '11px', sm: '12px', base: '13px', lg: '14px',
      xl: '16px', '2xl': '18px', '3xl': '24px', '4xl': '32px'
    };
  }

  if (!theme.typography.fontWeight) {
    theme.typography.fontWeight = {
      light: 300, normal: 400, medium: 500, semibold: 600,
      bold: 700, extrabold: 800
    };
  }

  // Spacing
  if (config.spacing === 'default' || !config.spacing) {
    theme.spacing = { ...DEFAULT_SPACING };
    theme.borderRadius = { ...DEFAULT_BORDER_RADIUS };
  } else if (typeof config.spacing === 'object') {
    theme.spacing = config.spacing;
  }

  // Effects
  if (config.effects) {
    if (typeof config.effects === 'string' && EFFECTS_PRESETS[config.effects]) {
      theme.effects = { ...EFFECTS_PRESETS[config.effects] };
    } else if (typeof config.effects === 'object') {
      theme.effects = config.effects;
    }
  }

  // Add terminal effects
  if (!theme.effects.terminal) {
    theme.effects.terminal = {
      cursor: {
        style: 'block',
        animation: 'terminal-blink 1s step-end infinite',
        color: theme.colors.primary || '#00ff41'
      },
      textShadow: '0 0 4px rgba(0, 255, 65, 0.3)'
    };
  }

  // Components
  if (config.components === true || config.components === 'default') {
    theme.components = createDefaultComponents(theme.colors);
  } else if (typeof config.components === 'object') {
    theme.components = config.components;
  }

  // Animations
  if (config.animations === true || config.animations === 'default' || !config.animations) {
    theme.animations = createDefaultAnimations();
  } else if (typeof config.animations === 'object') {
    theme.animations = config.animations;
  }

  // States
  if (config.states === true || config.states === 'default' || !config.states) {
    theme.states = createDefaultStates(theme.colors);
  } else if (typeof config.states === 'object') {
    theme.states = config.states;
  }

  // Metadata
  theme.metadata = {
    lastUpdated: new Date().toISOString().split('T')[0],
    production: config.production || false,
    tags: config.tags || ['custom', 'matrix-inspired'],
    compatibility: config.compatibility || {
      claudeCode: '1.0+',
      terminal: 'ANSI 24-bit true color'
    }
  };

  return theme;
}

/**
 * Create default component styles
 */
function createDefaultComponents(colors) {
  const primary = colors.primary || '#00ff41';
  const primaryDark = colors.primaryDark || '#00cc33';

  return {
    button: {
      base: {
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 600,
        border: `1px solid ${primary}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase'
      },
      variants: {
        primary: {
          background: 'rgba(0, 255, 65, 0.1)',
          color: primary
        }
      }
    },
    input: {
      base: {
        padding: '8px 12px',
        fontSize: '13px',
        backgroundColor: colors.background || '#0a0e27',
        color: primary,
        border: `1px solid ${primaryDark}`
      }
    },
    card: {
      base: {
        backgroundColor: colors.surface || '#0f1419',
        border: '1px solid rgba(0, 255, 65, 0.2)',
        padding: '16px'
      }
    }
  };
}

/**
 * Create default animations
 */
function createDefaultAnimations() {
  return {
    scanlineDrift: {
      name: 'scanline-drift',
      keyframes: {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(10px)' }
      },
      duration: '8s',
      timingFunction: 'linear',
      iterationCount: 'infinite'
    },
    terminalBlink: {
      name: 'terminal-blink',
      keyframes: {
        '0%': { opacity: 1 },
        '50%': { opacity: 0 },
        '100%': { opacity: 0 }
      },
      duration: '1s',
      timingFunction: 'step-end',
      iterationCount: 'infinite'
    },
    pulse: {
      name: 'pulse-glow',
      keyframes: {
        '0%': { boxShadow: '0 0 10px rgba(0, 255, 65, 0.2)' },
        '50%': { boxShadow: '0 0 25px rgba(0, 255, 65, 0.4)' },
        '100%': { boxShadow: '0 0 10px rgba(0, 255, 65, 0.2)' }
      },
      duration: '2s',
      timingFunction: 'ease-in-out',
      iterationCount: 'infinite'
    }
  };
}

/**
 * Create default states
 */
function createDefaultStates(colors) {
  const primary = colors.primary || '#00ff41';

  return {
    hover: { filter: 'brightness(1.2)' },
    active: { filter: 'brightness(1.4)' },
    focus: {
      outline: `2px solid ${primary}`,
      outlineOffset: '2px'
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  };
}

/**
 * Save theme to file
 */
function saveTheme(theme, filename) {
  const themePath = path.join(__dirname, '..', 'themes', filename);
  const dir = path.dirname(themePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(themePath, JSON.stringify(theme, null, 2));
  return themePath;
}

/**
 * Load config from JSON file
 */
function loadConfig(configPath) {
  const content = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * CLI usage
 */
function showUsage() {
  console.log(`
Theme Builder Batch - Non-interactive theme generation

Usage:
  theme-builder-batch <command> [options]

Commands:
  create <config.json>              Create theme from JSON config
  list-palettes                     List available color palettes
  list-typography                   List available typography presets
  list-effects                       List available effects presets

Options:
  --output <filename>               Save as specific filename
  --multiple <dir>                  Generate multiple themes from config files in directory

Examples:
  # Create single theme
  node theme-builder-batch.js create config.json

  # List available palettes
  node theme-builder-batch.js list-palettes

  # Generate multiple themes
  node theme-builder-batch.js create --multiple ./configs/

Config JSON Format:
{
  "name": "My Theme",
  "description": "Theme description",
  "type": "dark",
  "author": "your-name",
  "palette": "matrixClassic",          // or custom colors object
  "typography": "monospace",           // or typography object
  "effects": "moderate",               // or effects object
  "spacing": "default",                // or spacing object
  "components": true,                  // true = defaults, false = none
  "animations": true,
  "states": true
}
`);
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showUsage();
    process.exit(0);
  }

  const command = args[0];

  try {
    switch (command) {
      case 'create': {
        if (args.length < 2) {
          console.error('Error: config file path required');
          showUsage();
          process.exit(1);
        }

        const configPath = args[1];
        if (!fs.existsSync(configPath)) {
          console.error(`Error: config file not found: ${configPath}`);
          process.exit(1);
        }

        const config = loadConfig(configPath);
        const theme = createTheme(config);
        const filename = config.filename || `${config.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        const outputPath = saveTheme(theme, filename);

        console.log(`✓ Theme created: ${outputPath}`);
        console.log(`  Name: ${theme.name}`);
        console.log(`  Type: ${theme.type}`);
        console.log(`  Colors: ${Object.keys(theme.colors).length} colors`);
        break;
      }

      case 'list-palettes': {
        console.log('\nAvailable Color Palettes:\n');
        Object.entries(PALETTES).forEach(([name, colors]) => {
          const primary = colors.primary;
          console.log(`  ${name}`);
          console.log(`    Primary: ${primary}`);
          console.log(`    Colors: ${Object.keys(colors).length}`);
        });
        break;
      }

      case 'list-typography': {
        console.log('\nAvailable Typography Presets:\n');
        Object.entries(TYPOGRAPHY_PRESETS).forEach(([name, preset]) => {
          console.log(`  ${name}`);
          if (preset.fontFamily) {
            console.log(`    Mono: ${preset.fontFamily.mono.substring(0, 40)}...`);
          }
        });
        break;
      }

      case 'list-effects': {
        console.log('\nAvailable Effects Presets:\n');
        Object.entries(EFFECTS_PRESETS).forEach(([name, effects]) => {
          console.log(`  ${name}`);
          console.log(`    Scanlines: ${effects.scanlines.enabled ? 'Enabled' : 'Disabled'}`);
          console.log(`    Glow: ${effects.glow.enabled ? 'Enabled' : 'Disabled'}`);
          console.log(`    CRT: ${effects.crt.enabled ? 'Enabled' : 'Disabled'}`);
        });
        break;
      }

      default: {
        console.error(`Unknown command: ${command}`);
        showUsage();
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Export for use as module
module.exports = {
  createTheme,
  saveTheme,
  loadConfig,
  PALETTES,
  TYPOGRAPHY_PRESETS,
  EFFECTS_PRESETS
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
