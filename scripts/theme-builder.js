#!/usr/bin/env node

/**
 * Theme Builder - Interactive Matrix-inspired Theme Creation Tool
 * Guides users through a wizard workflow to create custom themes
 * Features: Color picker, typography editor, effects panel, live preview, JSON export
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Color utilities
const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  blink: '\x1b[5m',

  // Foreground
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Matrix theme colors
  matrixGreen: '\x1b[38;2;0;255;65m',
  matrixDarkGreen: '\x1b[38;2;0;204;51m',
  matrixBg: '\x1b[48;2;10;14;39m',
  matrixAccent: '\x1b[38;2;255;0;77m'
};

// ReadLine interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

// Theme builder state
let themeConfig = {
  name: '',
  description: '',
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

// Predefined Matrix color palettes
const colorPalettes = {
  matrixClassic: {
    primary: '#00ff41',
    primaryLight: '#39ff14',
    primaryDark: '#00cc33',
    secondary: '#00ff41',
    background: '#0a0e27',
    surface: '#0f1419',
    text: '#00ff41',
    textSecondary: '#00cc33',
    error: '#ff004d',
    success: '#00ff41',
    warning: '#ffb700',
    info: '#00d4ff'
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
  matrixCyber: {
    primary: '#ff00ff',
    primaryLight: '#ff33ff',
    primaryDark: '#cc00cc',
    secondary: '#00ffff',
    background: '#0a0015',
    surface: '#1a0033',
    text: '#ff00ff',
    textSecondary: '#00ffff',
    error: '#ff0055',
    success: '#00ff41',
    warning: '#ffff00',
    info: '#00ccff'
  },
  cyberpunk: {
    primary: '#ff00ff',
    primaryLight: '#ff66ff',
    primaryDark: '#cc00cc',
    secondary: '#00ffff',
    background: '#0d0221',
    surface: '#1a0a2e',
    text: '#ff00ff',
    textSecondary: '#00ffff',
    error: '#ff006e',
    success: '#00ff41',
    warning: '#ffd60a',
    info: '#00d9ff'
  }
};

// Typography presets
const typographyPresets = {
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
  },
  retro: {
    fontFamily: {
      mono: "'Courier New', 'Courier', 'MS Sans Serif', monospace",
      sans: "'Courier New', 'Courier', 'MS Sans Serif', monospace"
    }
  }
};

// Effects presets
const effectsPresets = {
  heavy: {
    scanlines: { enabled: true, opacity: 0.08 },
    glow: { enabled: true, intensity: 'strong', blur: '12px' },
    crt: { enabled: true, curvature: '2%' },
    terminal: { enabled: true }
  },
  moderate: {
    scanlines: { enabled: true, opacity: 0.03 },
    glow: { enabled: true, intensity: 'medium', blur: '8px' },
    crt: { enabled: false, curvature: '0%' },
    terminal: { enabled: true }
  },
  minimal: {
    scanlines: { enabled: false, opacity: 0 },
    glow: { enabled: true, intensity: 'light', blur: '4px' },
    crt: { enabled: false, curvature: '0%' },
    terminal: { enabled: false }
  }
};

// Utility functions
function clear() {
  console.clear();
}

function print(text, color = Colors.reset) {
  console.log(`${color}${text}${Colors.reset}`);
}

function header(text) {
  print('\n' + '='.repeat(60), Colors.matrixGreen);
  print(`  ${text}`, Colors.bright + Colors.matrixGreen);
  print('='.repeat(60) + '\n', Colors.matrixGreen);
}

function question(prompt, defaultValue = '') {
  return new Promise((resolve) => {
    const suffix = defaultValue ? ` [${defaultValue}]` : '';
    rl.question(
      `${Colors.matrixGreen}> ${Colors.reset}${prompt}${suffix}: `,
      (answer) => {
        resolve(answer || defaultValue);
      }
    );
  });
}

function menu(title, options) {
  return new Promise((resolve) => {
    print(`\n${Colors.bright}${title}${Colors.reset}\n`);
    options.forEach((opt, i) => {
      print(`  ${Colors.matrixGreen}${i + 1}${Colors.reset} - ${opt.label}`);
    });

    rl.question(`\n${Colors.matrixGreen}> ${Colors.reset}Select option: `, (answer) => {
      const idx = parseInt(answer) - 1;
      if (idx >= 0 && idx < options.length) {
        resolve(options[idx].value);
      } else {
        print('Invalid selection', Colors.red);
        resolve(menu(title, options));
      }
    });
  });
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function colorPreview(hexColor) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;
  return `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m  ${Colors.reset}`;
}

async function wizardStep1_Theme() {
  header('Step 1: Theme Basics');

  themeConfig.name = await question('Theme name', 'Custom Matrix Theme');
  themeConfig.description = await question('Description', 'Custom Matrix-inspired theme');
  themeConfig.author = await question('Author', 'theme-builder');
  themeConfig.type = await menu('Theme type', [
    { label: 'Dark', value: 'dark' },
    { label: 'Light', value: 'light' }
  ]);

  print(`\n${Colors.matrixGreen}Theme set: ${themeConfig.name}${Colors.reset}`);
}

async function wizardStep2_Colors() {
  header('Step 2: Color Scheme');

  const paletteChoice = await menu('Choose starting palette', [
    { label: 'Matrix Classic', value: 'matrixClassic' },
    { label: 'Matrix Neon', value: 'matrixNeon' },
    { label: 'Matrix Cyber', value: 'matrixCyber' },
    { label: 'Cyberpunk', value: 'cyberpunk' },
    { label: 'Custom', value: 'custom' }
  ]);

  if (paletteChoice === 'custom') {
    themeConfig.colors = {
      primary: await question('Primary color (hex)', '#00ff41'),
      primaryLight: await question('Primary light (hex)', '#39ff14'),
      primaryDark: await question('Primary dark (hex)', '#00cc33'),
      secondary: await question('Secondary color (hex)', '#00ffff'),
      background: await question('Background color (hex)', '#0a0e27'),
      surface: await question('Surface color (hex)', '#0f1419'),
      text: await question('Text color (hex)', '#00ff41'),
      textSecondary: await question('Text secondary (hex)', '#00cc33'),
      error: await question('Error color (hex)', '#ff004d'),
      success: await question('Success color (hex)', '#00ff41'),
      warning: await question('Warning color (hex)', '#ffb700'),
      info: await question('Info color (hex)', '#00d4ff')
    };
  } else {
    themeConfig.colors = { ...colorPalettes[paletteChoice] };
    print(`\n${Colors.matrixGreen}Palette applied: ${paletteChoice}${Colors.reset}`);
  }

  // Preview colors
  print('\n' + Colors.bright + 'Color Preview:' + Colors.reset);
  Object.entries(themeConfig.colors).slice(0, 4).forEach(([key, color]) => {
    print(`  ${key}: ${colorPreview(color)} ${color}`);
  });
}

async function wizardStep3_Typography() {
  header('Step 3: Typography');

  const typChoice = await menu('Choose typography preset', [
    { label: 'Monospace (Terminal)', value: 'monospace' },
    { label: 'Modern', value: 'modern' },
    { label: 'Retro', value: 'retro' },
    { label: 'Custom', value: 'custom' }
  ]);

  if (typChoice === 'custom') {
    themeConfig.typography = {
      fontFamily: {
        mono: await question('Monospace font', "'Courier New', monospace"),
        sans: await question('Sans-serif font', "'Segoe UI', sans-serif")
      },
      fontSize: {
        xs: await question('Size xs (px)', '11px'),
        sm: await question('Size sm (px)', '12px'),
        base: await question('Size base (px)', '13px'),
        lg: await question('Size lg (px)', '14px')
      },
      fontWeight: {
        normal: parseInt(await question('Weight normal', '400')),
        bold: parseInt(await question('Weight bold', '700'))
      },
      lineHeight: {
        tight: parseFloat(await question('Line height tight', '1.2')),
        normal: parseFloat(await question('Line height normal', '1.5'))
      }
    };
  } else {
    themeConfig.typography = {
      ...typographyPresets[typChoice],
      fontSize: {
        xs: '11px', sm: '12px', base: '13px', lg: '14px',
        xl: '16px', '2xl': '18px', '3xl': '24px', '4xl': '32px'
      },
      fontWeight: { light: 300, normal: 400, medium: 500, bold: 700, extrabold: 800 },
      lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75, loose: 2 }
    };
    print(`\n${Colors.matrixGreen}Typography preset applied: ${typChoice}${Colors.reset}`);
  }
}

async function wizardStep4_Effects() {
  header('Step 4: Visual Effects');

  const effectChoice = await menu('Choose effect intensity', [
    { label: 'Heavy (Scanlines, Heavy Glow, CRT)', value: 'heavy' },
    { label: 'Moderate (Scanlines, Medium Glow)', value: 'moderate' },
    { label: 'Minimal (Light Glow Only)', value: 'minimal' },
    { label: 'Custom', value: 'custom' }
  ]);

  if (effectChoice === 'custom') {
    const scanlineEnabled = await menu('Enable scanlines?', [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ]);

    const glowEnabled = await menu('Enable glow effect?', [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ]);

    themeConfig.effects = {
      scanlines: {
        enabled: scanlineEnabled,
        opacity: scanlineEnabled ? 0.05 : 0,
        pattern: "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)",
        animation: "scanline-drift 8s linear infinite"
      },
      glow: {
        enabled: glowEnabled,
        intensity: 'medium',
        blur: '8px',
        spread: '2px',
        color: themeConfig.colors.primary || '#00ff41'
      },
      crt: {
        enabled: false,
        curvature: '0%',
        vignette: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
        chromatic: "0px"
      },
      terminal: {
        cursor: {
          style: 'block',
          animation: 'terminal-blink 1s step-end infinite',
          color: themeConfig.colors.primary || '#00ff41'
        },
        textShadow: `0 0 4px rgba(0, 255, 65, 0.3)`
      }
    };
  } else {
    themeConfig.effects = {
      ...effectsPresets[effectChoice],
      glow: {
        ...effectsPresets[effectChoice].glow,
        color: themeConfig.colors.primary || '#00ff41'
      },
      terminal: {
        cursor: {
          style: 'block',
          animation: 'terminal-blink 1s step-end infinite',
          color: themeConfig.colors.primary || '#00ff41'
        },
        textShadow: '0 0 4px rgba(0, 255, 65, 0.3)'
      }
    };
    print(`\n${Colors.matrixGreen}Effects preset applied: ${effectChoice}${Colors.reset}`);
  }
}

async function wizardStep5_Spacing() {
  header('Step 5: Spacing & Sizing');

  const customizeSpacing = await menu('Use default spacing scale?', [
    { label: 'Yes (2px, 4px, 8px, 16px...)', value: true },
    { label: 'No, customize', value: false }
  ]);

  if (customizeSpacing) {
    themeConfig.spacing = {
      '0': '0px', '1': '2px', '2': '4px', '3': '6px', '4': '8px',
      '6': '12px', '8': '16px', '12': '24px', '16': '32px',
      '20': '40px', '24': '48px', '32': '64px'
    };

    themeConfig.borderRadius = {
      'none': '0px', 'sm': '2px', 'base': '4px', 'md': '6px',
      'lg': '8px', 'xl': '12px', '2xl': '16px', 'full': '9999px'
    };

    print(`\n${Colors.matrixGreen}Spacing scale applied${Colors.reset}`);
  } else {
    themeConfig.spacing = {};
    themeConfig.borderRadius = {};
    print(`\n${Colors.matrixGreen}Custom spacing - modify theme JSON after export${Colors.reset}`);
  }
}

async function wizardStep6_Components() {
  header('Step 6: Component Styles');

  const useDefaults = await menu('Apply default component styles?', [
    { label: 'Yes', value: true },
    { label: 'No, customize later', value: false }
  ]);

  if (useDefaults) {
    themeConfig.components = {
      button: {
        base: {
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 600,
          border: `1px solid ${themeConfig.colors.primary || '#00ff41'}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textTransform: 'uppercase'
        },
        variants: {
          primary: {
            background: `rgba(0, 255, 65, 0.1)`,
            color: themeConfig.colors.primary || '#00ff41'
          }
        }
      },
      input: {
        base: {
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          backgroundColor: themeConfig.colors.background || '#0a0e27',
          color: themeConfig.colors.text || '#00ff41',
          border: `1px solid ${themeConfig.colors.primaryDark || '#00cc33'}`
        }
      },
      card: {
        base: {
          backgroundColor: themeConfig.colors.surface || '#0f1419',
          borderRadius: '4px',
          border: `1px solid rgba(0, 255, 65, 0.2)`,
          padding: '16px'
        }
      }
    };
    print(`\n${Colors.matrixGreen}Default component styles applied${Colors.reset}`);
  }
}

async function wizardStep7_Preview() {
  header('Step 7: Preview & Export');

  print('\n' + Colors.bright + 'Theme Preview:' + Colors.reset);
  print(`\nName: ${themeConfig.name}`);
  print(`Type: ${themeConfig.type}`);
  print(`Author: ${themeConfig.author}`);
  print(`\nColors:`);
  print(`  Primary: ${colorPreview(themeConfig.colors.primary)} ${themeConfig.colors.primary}`);
  print(`  Secondary: ${colorPreview(themeConfig.colors.secondary)} ${themeConfig.colors.secondary}`);
  print(`  Background: ${colorPreview(themeConfig.colors.background)} ${themeConfig.colors.background}`);

  print(`\nEffects:`);
  print(`  Scanlines: ${themeConfig.effects.scanlines?.enabled ? 'Enabled' : 'Disabled'}`);
  print(`  Glow: ${themeConfig.effects.glow?.enabled ? 'Enabled' : 'Disabled'}`);
  print(`  Terminal: ${themeConfig.effects.terminal ? 'Enabled' : 'Disabled'}`);
}

async function exportTheme() {
  header('Export Theme');

  themeConfig.metadata = {
    lastUpdated: new Date().toISOString().split('T')[0],
    production: false,
    tags: ['custom', 'matrix-inspired'],
    compatibility: {
      claudeCode: '1.0+',
      terminal: 'ANSI 24-bit true color'
    }
  };

  // Add default animations if not present
  if (!themeConfig.animations || Object.keys(themeConfig.animations).length === 0) {
    themeConfig.animations = {
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
          '49%': { opacity: 1 },
          '50%': { opacity: 0 },
          '100%': { opacity: 0 }
        },
        duration: '1s',
        timingFunction: 'step-end',
        iterationCount: 'infinite'
      }
    };
  }

  // Add default states if not present
  if (!themeConfig.states || Object.keys(themeConfig.states).length === 0) {
    themeConfig.states = {
      hover: { filter: 'brightness(1.2)' },
      active: { filter: 'brightness(1.4)' },
      focus: { outline: `2px solid ${themeConfig.colors.primary}` },
      disabled: { opacity: 0.5, cursor: 'not-allowed' }
    };
  }

  const filename = await question('Export filename (without extension)',
    themeConfig.name.toLowerCase().replace(/\s+/g, '-'));

  const themePath = path.join(
    __dirname,
    '..',
    'themes',
    `${filename}.json`
  );

  fs.writeFileSync(themePath, JSON.stringify(themeConfig, null, 2));
  print(`\n${Colors.matrixGreen}✓ Theme exported to: ${themePath}${Colors.reset}`);

  return themePath;
}

async function main() {
  clear();
  header('Matrix Theme Builder');
  print('Interactive theme creation wizard with live preview and JSON export\n');

  try {
    // Run wizard steps
    await wizardStep1_Theme();
    await wizardStep2_Colors();
    await wizardStep3_Typography();
    await wizardStep4_Effects();
    await wizardStep5_Spacing();
    await wizardStep6_Components();
    await wizardStep7_Preview();

    const continueExport = await menu('Continue to export?', [
      { label: 'Yes, export theme', value: true },
      { label: 'No, exit', value: false }
    ]);

    if (continueExport) {
      const exportPath = await exportTheme();

      const installNow = await menu('Install theme now?', [
        { label: 'Yes, open installation guide', value: true },
        { label: 'No, I will install manually', value: false }
      ]);

      if (installNow) {
        print(`\n${Colors.matrixGreen}To install your theme:${Colors.reset}`);
        print(`\n1. Copy file: ${exportPath}`);
        print(`2. Paste to: ~/.claude/themes/`);
        print(`3. Run: /theme in Claude Code`);
        print(`4. Select your theme from the list\n`);
      }
    }

    print(`\n${Colors.matrixGreen}Thank you for using Theme Builder!${Colors.reset}\n`);
    rl.close();
  } catch (error) {
    print(`Error: ${error.message}`, Colors.red);
    rl.close();
    process.exit(1);
  }
}

// Run the wizard
main();
