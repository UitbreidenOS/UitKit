#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const CWD = process.cwd();
const CLAUDIENT_ROOT = path.resolve(__dirname, '..');
const THEMES_DIR = path.join(CLAUDIENT_ROOT, 'themes');
const CLAUDE_HOME = path.join(os.homedir(), '.claude');
const CLAUDE_THEMES_DIR = path.join(CLAUDE_HOME, 'themes');
const CONFIG_FILE = path.join(CLAUDE_HOME, 'matrix-config.json');

// Color utilities
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[92m',
  cyan: '\x1b[36m',
  yellow: '\x1b[93m',
  red: '\x1b[91m',
  magenta: '\x1b[95m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logError(msg) {
  log(`ERROR: ${msg}`, 'red');
}

function logSuccess(msg) {
  log(`✓ ${msg}`, 'green');
}

function logInfo(msg) {
  log(`ℹ ${msg}`, 'cyan');
}

function logWarn(msg) {
  log(`⚠ ${msg}`, 'yellow');
}

/**
 * Load all available themes from themes/ directory
 */
function loadAvailableThemes() {
  const themes = {};

  if (!fs.existsSync(THEMES_DIR)) {
    logError(`Themes directory not found at ${THEMES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(THEMES_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const themeName = path.basename(file, '.json');
    const themePath = path.join(THEMES_DIR, file);

    try {
      const content = fs.readFileSync(themePath, 'utf-8');
      const theme = JSON.parse(content);
      themes[themeName] = {
        path: themePath,
        data: theme,
        name: theme.name || themeName,
        description: theme.description || 'No description'
      };
    } catch (err) {
      logWarn(`Failed to parse ${file}: ${err.message}`);
    }
  }

  return themes;
}

/**
 * Load user configuration
 */
function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (err) {
      logWarn(`Failed to load config: ${err.message}`);
    }
  }

  return {
    activeTheme: null,
    customizations: {},
    history: [],
    installPath: CLAUDE_THEMES_DIR
  };
}

/**
 * Save user configuration
 */
function saveConfig(config) {
  try {
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    logSuccess(`Configuration saved to ${CONFIG_FILE}`);
  } catch (err) {
    logError(`Failed to save config: ${err.message}`);
  }
}

/**
 * List all available themes with metadata
 */
function listThemes() {
  const themes = loadAvailableThemes();
  const config = loadConfig();

  if (Object.keys(themes).length === 0) {
    logWarn('No themes found');
    return;
  }

  log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║             Available Themes — The Matrix System              ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝', 'cyan');

  Object.entries(themes).forEach(([id, theme]) => {
    const isActive = config.activeTheme === id ? ' ✓ ACTIVE' : '';
    const marker = isActive ? colors.green : '';
    const reset = isActive ? colors.reset : '';

    log(`\n${marker}${theme.name}${reset}${isActive}`, isActive ? 'green' : 'bright');
    log(`  ID: ${id}`, 'dim');
    log(`  ${theme.description}`);

    if (theme.data.colors) {
      const primary = theme.data.colors.primary || 'N/A';
      log(`  Primary: ${primary}`, 'dim');
    }
  });

  log('', 'reset');
}

/**
 * Apply a theme to Claude Code installation
 */
function applyTheme(themeName, saveToConfig = true) {
  const themes = loadAvailableThemes();

  if (!themes[themeName]) {
    logError(`Theme '${themeName}' not found`);
    log('\nAvailable themes:');
    Object.keys(themes).forEach(t => log(`  - ${t}`));
    process.exit(1);
  }

  const theme = themes[themeName];

  // Create destination directory
  try {
    fs.mkdirSync(CLAUDE_THEMES_DIR, { recursive: true });
  } catch (err) {
    logError(`Failed to create themes directory: ${err.message}`);
    process.exit(1);
  }

  // Copy theme file
  const destPath = path.join(CLAUDE_THEMES_DIR, `${themeName}.json`);

  try {
    fs.copyFileSync(theme.path, destPath);
    logSuccess(`Theme '${theme.name}' copied to ${destPath}`);
  } catch (err) {
    logError(`Failed to copy theme: ${err.message}`);
    process.exit(1);
  }

  // Update configuration
  if (saveToConfig) {
    const config = loadConfig();
    config.activeTheme = themeName;
    config.history = config.history || [];

    if (!config.history.includes(themeName)) {
      config.history.push(themeName);
    }

    saveConfig(config);
  }

  logSuccess(`Theme '${theme.name}' applied`);
  logInfo(`Installation path: ${destPath}`);
  logInfo('Restart Claude Code to apply the theme');
}

/**
 * Preview theme in terminal
 */
function previewTheme(themeName) {
  const themes = loadAvailableThemes();

  if (!themes[themeName]) {
    logError(`Theme '${themeName}' not found`);
    process.exit(1);
  }

  const theme = themes[themeName];
  const data = theme.data;

  log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log(`║  Preview: ${theme.name.padEnd(53)} ║`, 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝', 'cyan');

  // Show color palette
  if (data.colors) {
    log('\n▸ Color Palette:', 'bright');
    const colorKeys = [
      'primary', 'primaryLight', 'primaryDark',
      'background', 'surface', 'text',
      'error', 'success', 'warning', 'info'
    ];

    colorKeys.forEach(key => {
      if (data.colors[key]) {
        log(`  ${key.padEnd(15)} ${data.colors[key]}`, 'dim');
      }
    });
  }

  // Show typography
  if (data.typography) {
    log('\n▸ Typography:', 'bright');
    if (data.typography.fontFamily) {
      log(`  Monospace: ${data.typography.fontFamily.mono}`, 'dim');
    }
  }

  // Show effects
  if (data.effects) {
    log('\n▸ Effects:', 'bright');
    Object.keys(data.effects).forEach(effect => {
      const enabled = data.effects[effect].enabled ? 'ON' : 'OFF';
      log(`  ${effect.padEnd(15)} ${enabled}`, 'dim');
    });
  }

  // Show components
  if (data.components) {
    log('\n▸ Styled Components:', 'bright');
    Object.keys(data.components).forEach(comp => {
      log(`  • ${comp}`, 'dim');
    });
  }

  // Show customization hints
  if (data.customization) {
    log('\n▸ Quick Customizations:', 'bright');
    Object.entries(data.customization).forEach(([key, value]) => {
      log(`  ${key}: ${value}`, 'dim');
    });
  }

  log('', 'reset');
}

/**
 * Customize a theme
 */
function customizeTheme(themeName, customizations) {
  const themes = loadAvailableThemes();

  if (!themes[themeName]) {
    logError(`Theme '${themeName}' not found`);
    process.exit(1);
  }

  const config = loadConfig();

  if (!config.customizations) {
    config.customizations = {};
  }

  if (!config.customizations[themeName]) {
    config.customizations[themeName] = {};
  }

  // Parse customizations (format: key=value,key=value)
  if (customizations) {
    const pairs = customizations.split(',');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        config.customizations[themeName][key.trim()] = value.trim();
        logInfo(`Set ${key.trim()} = ${value.trim()}`);
      }
    });
  }

  saveConfig(config);
  logSuccess(`Customizations saved for '${themeName}'`);
}

/**
 * Export theme to JSON
 */
function exportTheme(themeName, outputPath) {
  const themes = loadAvailableThemes();

  if (!themes[themeName]) {
    logError(`Theme '${themeName}' not found`);
    process.exit(1);
  }

  const theme = themes[themeName];
  const config = loadConfig();
  const customizations = config.customizations?.[themeName] || {};

  // Merge theme with customizations
  const exportData = {
    ...theme.data,
    exported: new Date().toISOString(),
    customizations
  };

  const target = outputPath || `${themeName}-export.json`;

  try {
    fs.writeFileSync(target, JSON.stringify(exportData, null, 2));
    logSuccess(`Theme exported to ${path.resolve(target)}`);
    logInfo(`Size: ${(fs.statSync(target).size / 1024).toFixed(2)} KB`);
  } catch (err) {
    logError(`Failed to export theme: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Validate theme configuration
 */
function validateTheme(themeName) {
  const themes = loadAvailableThemes();

  if (!themes[themeName]) {
    logError(`Theme '${themeName}' not found`);
    process.exit(1);
  }

  const theme = themes[themeName];
  const data = theme.data;
  const issues = [];

  // Check required fields
  if (!data.name) issues.push('Missing required field: name');

  // Handle themes with 'colors' or 'overrides' structure
  const hasColors = !!(data.colors || data.overrides);
  if (!hasColors) {
    issues.push('Missing color definitions (colors or overrides)');
  }

  // Validate color format (6-digit hex or 8-digit RGBA)
  const colorRegex = /^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/;

  if (data.colors) {
    Object.entries(data.colors).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        if (!colorRegex.test(value)) {
          issues.push(`Invalid color format for ${key}: ${value}`);
        }
      }
    });
  }

  if (data.overrides) {
    Object.entries(data.overrides).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        if (!colorRegex.test(value)) {
          issues.push(`Invalid color format for ${key}: ${value}`);
        }
      }
    });
  }

  if (issues.length === 0) {
    logSuccess(`Theme '${theme.name}' is valid`);
  } else {
    logWarn(`Found ${issues.length} issue(s) in theme:`);
    issues.forEach(issue => log(`  • ${issue}`, 'dim'));
  }
}

/**
 * Show help message
 */
function showHelp() {
  log(`
${colors.bright}claudient matrix — Theme Management CLI${colors.reset}

Usage:
  claudient matrix list [--preview]
  claudient matrix apply <theme-name> [--save-config]
  claudient matrix preview <theme-name>
  claudient matrix customize <theme-name> --set key=value[,key=value...]
  claudient matrix export <theme-name> [--output path/file.json]
  claudient matrix validate <theme-name>
  claudient matrix config [--show]

Options:
  --preview              Show color preview for each theme
  --save-config          Save theme to matrix-config.json
  --set key=value        Set customization values (comma-separated)
  --output path          Export to custom path
  --show                 Display current configuration

Examples:
  claudient matrix list
  claudient matrix apply matrix
  claudient matrix preview dracula
  claudient matrix customize matrix --set glow=strong,scanline=off
  claudient matrix export matrix --output ~/Downloads/my-matrix.json
  claudient matrix validate matrix
  claudient matrix config --show

${colors.dim}Theme files: ${THEMES_DIR}${colors.reset}
${colors.dim}Config file: ${CONFIG_FILE}${colors.reset}
`);
}

/**
 * Show current configuration
 */
function showConfig() {
  const config = loadConfig();

  log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║            Matrix Configuration                               ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝', 'cyan');

  log(`\nActive Theme: ${config.activeTheme || '(none)', 'bright'}`);
  log(`Install Path: ${config.installPath}`, 'dim');

  if (config.history && config.history.length > 0) {
    log('\nTheme History:', 'bright');
    config.history.forEach((t, i) => {
      log(`  ${i + 1}. ${t}`, 'dim');
    });
  }

  if (config.customizations && Object.keys(config.customizations).length > 0) {
    log('\nCustomizations:', 'bright');
    Object.entries(config.customizations).forEach(([theme, customizations]) => {
      log(`  ${theme}:`, 'dim');
      Object.entries(customizations).forEach(([key, value]) => {
        log(`    ${key}: ${value}`, 'dim');
      });
    });
  }

  log(`\nConfiguration: ${CONFIG_FILE}`, 'dim');
  log('', 'reset');
}

/**
 * Main command router
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];
  const subcommand = args[1];

  try {
    switch (command) {
      case 'list':
        listThemes();
        if (args.includes('--preview')) {
          const themes = loadAvailableThemes();
          Object.keys(themes).forEach(theme => {
            log('', 'reset');
            previewTheme(theme);
          });
        }
        break;

      case 'apply':
        if (!subcommand) {
          logError('Theme name required');
          process.exit(1);
        }
        applyTheme(subcommand, !args.includes('--no-save'));
        break;

      case 'preview':
        if (!subcommand) {
          logError('Theme name required');
          process.exit(1);
        }
        previewTheme(subcommand);
        break;

      case 'customize':
        if (!subcommand) {
          logError('Theme name required');
          process.exit(1);
        }
        const setIndex = args.indexOf('--set');
        if (setIndex === -1) {
          logError('Use --set key=value to customize');
          process.exit(1);
        }
        customizeTheme(subcommand, args[setIndex + 1]);
        break;

      case 'export':
        if (!subcommand) {
          logError('Theme name required');
          process.exit(1);
        }
        const outputIndex = args.indexOf('--output');
        const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;
        exportTheme(subcommand, outputPath);
        break;

      case 'validate':
        if (!subcommand) {
          logError('Theme name required');
          process.exit(1);
        }
        validateTheme(subcommand);
        break;

      case 'config':
        showConfig();
        break;

      case 'help':
      case '-h':
      case '--help':
        showHelp();
        break;

      default:
        logError(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }
}

// Run CLI
if (require.main === module) {
  main();
}

module.exports = {
  loadAvailableThemes,
  loadConfig,
  saveConfig,
  applyTheme,
  previewTheme,
  customizeTheme,
  exportTheme,
  validateTheme
};
