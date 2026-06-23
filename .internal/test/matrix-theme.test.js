#!/usr/bin/env node
/**
 * Matrix Theme Unit Tests
 * Validates color hex codes, typography sizes, animation durations,
 * component structure, and theme consistency
 */

const path = require('path');
const fs = require('fs');

const matrixTheme = require(path.join(__dirname, '../themes/matrix.json'));

let passed = 0;
let failed = 0;
const failures = [];

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
};

function assert(condition, message) {
  if (!condition) {
    failed++;
    failures.push(message);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    return false;
  }
  passed++;
  return true;
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    failed++;
    failures.push(`${message} (expected: ${expected}, got: ${actual})`);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Got: ${actual}`);
    return false;
  }
  passed++;
  return true;
}

function assertContains(value, substring, message) {
  if (typeof value !== 'string' || !value.includes(substring)) {
    failed++;
    failures.push(`${message} (value: ${value}, substring: ${substring})`);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    return false;
  }
  passed++;
  return true;
}

function assertMatches(value, regex, message) {
  if (!regex.test(value)) {
    failed++;
    failures.push(`${message} (value: ${value}, pattern: ${regex})`);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    return false;
  }
  passed++;
  return true;
}

function assertDefined(value, message) {
  if (value === undefined || value === null) {
    failed++;
    failures.push(`${message} (value is undefined or null)`);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    return false;
  }
  passed++;
  return true;
}

function assertRange(value, min, max, message) {
  if (value < min || value > max) {
    failed++;
    failures.push(`${message} (value: ${value}, range: [${min}, ${max}])`);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    return false;
  }
  passed++;
  return true;
}

function assertGreater(actual, expected, message) {
  if (actual <= expected) {
    failed++;
    failures.push(`${message} (${actual} not > ${expected})`);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    return false;
  }
  passed++;
  return true;
}

function assertGreaterOrEqual(actual, expected, message) {
  if (actual < expected) {
    failed++;
    failures.push(`${message} (${actual} not >= ${expected})`);
    console.error(`${COLORS.RED}✗ ${message}${COLORS.RESET}`);
    return false;
  }
  passed++;
  return true;
}

console.log(`${COLORS.CYAN}Matrix Theme Unit Tests${COLORS.RESET}\n`);

// Theme Metadata Tests
console.log(`${COLORS.CYAN}Theme Metadata${COLORS.RESET}`);
assertEquals(matrixTheme.name, 'Matrix', 'theme name is Matrix');
assertEquals(matrixTheme.version, '1.0.0', 'theme version is 1.0.0');
assertEquals(matrixTheme.type, 'dark', 'theme type is dark');
assertEquals(matrixTheme.author, 'tushar2704', 'theme author is tushar2704');
assertEquals(matrixTheme.license, 'MIT', 'theme license is MIT');
assert(matrixTheme.description && matrixTheme.description.length > 10, 'theme has description');
assertEquals(matrixTheme.metadata.production, true, 'metadata production flag is true');
assertDefined(matrixTheme.metadata.compatibility, 'metadata has compatibility info');
assertMatches(matrixTheme.metadata.lastUpdated, /^\d{4}-\d{2}-\d{2}$/, 'last updated date is valid');

// Colors - Hex Code Validation
console.log(`\n${COLORS.CYAN}Colors - Hex Code Validation${COLORS.RESET}`);
const validHexRegex = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;

Object.entries(matrixTheme.colors).forEach(([key, value]) => {
  if (typeof value === 'string' && !value.startsWith('rgba(')) {
    assertMatches(value, validHexRegex, `color ${key} is valid hex: ${value}`);
  }
});

assertEquals(matrixTheme.colors.primary, '#00ff41', 'primary color is neon green');
assertEquals(matrixTheme.colors.primaryLight, '#39ff14', 'primary light is brighter green');
assertEquals(matrixTheme.colors.primaryDark, '#00cc33', 'primary dark is darker green');
assertEquals(matrixTheme.colors.text, '#00ff41', 'text color is neon green');
assertEquals(matrixTheme.colors.background, '#0a0e27', 'background is dark blue-black');
assertEquals(matrixTheme.colors.error, '#ff004d', 'error color is neon pink');
assertEquals(matrixTheme.colors.success, '#00ff41', 'success color is neon green');
assertEquals(matrixTheme.colors.warning, '#ffb700', 'warning color is yellow');
assertEquals(matrixTheme.colors.info, '#00d4ff', 'info color is cyan');

// RGBA Colors
console.log(`\n${COLORS.CYAN}Colors - RGBA Validation${COLORS.RESET}`);
const rgbaRegex = /^rgba\(/;
assertMatches(matrixTheme.colors.overlay, rgbaRegex, 'overlay is rgba format');
assertMatches(matrixTheme.colors.shadow, rgbaRegex, 'shadow is rgba format');
// selection can be hex with alpha or rgba
assert(
  /^rgba\(|^#[0-9A-Fa-f]{8}$/.test(matrixTheme.colors.selection),
  'selection is rgba or hex8 format'
);

// Typography - Font Configuration
console.log(`\n${COLORS.CYAN}Typography - Font Configuration${COLORS.RESET}`);
assertDefined(matrixTheme.typography.fontFamily, 'typography has font families');
assertContains(matrixTheme.typography.fontFamily.mono, 'monospace', 'mono font is monospace');
assertContains(matrixTheme.typography.fontFamily.sans, 'monospace', 'sans font is monospace for Matrix');

// Font Sizes
console.log(`\n${COLORS.CYAN}Typography - Font Sizes${COLORS.RESET}`);
Object.entries(matrixTheme.typography.fontSize).forEach(([key, value]) => {
  assertMatches(value, /^\d+px$/, `fontSize ${key} is valid: ${value}`);
});

assertEquals(matrixTheme.typography.fontSize.xs, '11px', 'xs size is 11px');
assertEquals(matrixTheme.typography.fontSize.sm, '12px', 'sm size is 12px');
assertEquals(matrixTheme.typography.fontSize.base, '13px', 'base size is 13px');
assertEquals(matrixTheme.typography.fontSize['4xl'], '32px', '4xl size is 32px');

// Font Weights
console.log(`\n${COLORS.CYAN}Typography - Font Weights${COLORS.RESET}`);
const validWeights = [300, 400, 500, 600, 700, 800];
Object.entries(matrixTheme.typography.fontWeight).forEach(([key, weight]) => {
  assert(validWeights.includes(weight), `fontWeight ${key} is valid: ${weight}`);
});

// Line Heights
console.log(`\n${COLORS.CYAN}Typography - Line Heights${COLORS.RESET}`);
Object.entries(matrixTheme.typography.lineHeight).forEach(([key, value]) => {
  assert(typeof value === 'number' && value > 0, `lineHeight ${key} is valid number: ${value}`);
});

// Letter Spacing
console.log(`\n${COLORS.CYAN}Typography - Letter Spacing${COLORS.RESET}`);
Object.entries(matrixTheme.typography.letterSpacing).forEach(([key, value]) => {
  assertMatches(value, /^-?\d+(\.\d+)?px$/, `letterSpacing ${key} is valid: ${value}`);
});

// Spacing Scale
console.log(`\n${COLORS.CYAN}Spacing Scale${COLORS.RESET}`);
assertEquals(matrixTheme.spacing['0'], '0px', 'spacing 0 is 0px');
assertEquals(matrixTheme.spacing['1'], '2px', 'spacing 1 is 2px');
assertEquals(matrixTheme.spacing['2'], '4px', 'spacing 2 is 4px');

Object.values(matrixTheme.spacing).forEach((value, idx) => {
  assertMatches(value, /^\d+px$/, `spacing value is valid: ${value}`);
});

// Border Radius
console.log(`\n${COLORS.CYAN}Border Radius${COLORS.RESET}`);
assertEquals(matrixTheme.borderRadius.none, '0px', 'border radius none is 0px');
assertEquals(matrixTheme.borderRadius.base, '4px', 'border radius base is 4px');
assertEquals(matrixTheme.borderRadius.full, '9999px', 'border radius full is 9999px');

Object.values(matrixTheme.borderRadius).forEach(value => {
  assertMatches(value, /^\d+px$|^9999px$/, `border radius is valid: ${value}`);
});

// Shadows
console.log(`\n${COLORS.CYAN}Shadows Validation${COLORS.RESET}`);
assertEquals(matrixTheme.shadows.none, 'none', 'shadow none is "none"');
assertDefined(matrixTheme.shadows.sm, 'shadow sm exists');
assertDefined(matrixTheme.shadows.base, 'shadow base exists');
assertDefined(matrixTheme.shadows.glow, 'shadow glow exists');
assertDefined(matrixTheme.shadows.glowStrong, 'shadow glowStrong exists');

Object.entries(matrixTheme.shadows).forEach(([key, value]) => {
  if (key !== 'none') {
    assertContains(value, '0, 255, 65', `shadow ${key} contains matrix green`);
  }
});

// Effects Configuration
console.log(`\n${COLORS.CYAN}Effects Configuration${COLORS.RESET}`);
assertDefined(matrixTheme.effects.scanlines, 'scanlines effect exists');
assertEquals(matrixTheme.effects.scanlines.enabled, true, 'scanlines enabled');
assertEquals(matrixTheme.effects.scanlines.opacity, 0.03, 'scanlines opacity is 0.03');
assertContains(matrixTheme.effects.scanlines.pattern, 'repeating-linear-gradient', 'scanlines has pattern');

assertDefined(matrixTheme.effects.crt, 'crt effect exists');
assertEquals(matrixTheme.effects.crt.enabled, true, 'crt enabled');

assertDefined(matrixTheme.effects.glow, 'glow effect exists');
assertEquals(matrixTheme.effects.glow.enabled, true, 'glow enabled');
assertEquals(matrixTheme.effects.glow.intensity, 'medium', 'glow intensity is medium');
assertEquals(matrixTheme.effects.glow.color, '#00ff41', 'glow color is neon green');

assertDefined(matrixTheme.effects.terminal, 'terminal effect exists');
assertEquals(matrixTheme.effects.terminal.cursor.style, 'block', 'cursor style is block');
assertEquals(matrixTheme.effects.terminal.cursor.color, '#00ff41', 'cursor color is neon green');

// Animations - Duration Validation
console.log(`\n${COLORS.CYAN}Animations - Duration Validation${COLORS.RESET}`);
assertEquals(matrixTheme.animations.scanlineDrift.duration, '8s', 'scanline drift is 8s');
assertEquals(matrixTheme.animations.terminalBlink.duration, '1s', 'terminal blink is 1s');
assertEquals(matrixTheme.animations.glitch.duration, '0.4s', 'glitch is 0.4s');
assertEquals(matrixTheme.animations.glitchText.duration, '0.5s', 'glitch text is 0.5s');
assertEquals(matrixTheme.animations.pulse.duration, '2s', 'pulse is 2s');
assertEquals(matrixTheme.animations.fadeIn.duration, '0.5s', 'fade in is 0.5s');
assertEquals(matrixTheme.animations.typewriter.duration, '0.5s', 'typewriter is 0.5s');

Object.entries(matrixTheme.animations).forEach(([key, anim]) => {
  assertMatches(anim.duration, /^\d+\.?\d*[ms]$/, `animation ${key} has valid duration`);
  assertDefined(anim.timingFunction, `animation ${key} has timing function`);
  assertDefined(anim.iterationCount, `animation ${key} has iteration count`);
});

// Infinite vs One-shot Animations
console.log(`\n${COLORS.CYAN}Animations - Iteration Count Validation${COLORS.RESET}`);
const infiniteAnims = ['scanlineDrift', 'terminalBlink', 'glitchText', 'pulse'];
infiniteAnims.forEach(name => {
  assertEquals(matrixTheme.animations[name].iterationCount, 'infinite', `${name} is infinite`);
});

const oneShotAnims = ['glitch', 'fadeIn', 'typewriter'];
oneShotAnims.forEach(name => {
  assertEquals(matrixTheme.animations[name].iterationCount, '1', `${name} is one-shot`);
});

// Keyframes
console.log(`\n${COLORS.CYAN}Animations - Keyframe Validation${COLORS.RESET}`);
assertDefined(matrixTheme.animations.scanlineDrift.keyframes, 'scanline drift has keyframes');
assertDefined(matrixTheme.animations.terminalBlink.keyframes, 'terminal blink has keyframes');
assertDefined(matrixTheme.animations.glitch.keyframes, 'glitch has keyframes');
assertDefined(matrixTheme.animations.pulse.keyframes, 'pulse has keyframes');
assertDefined(matrixTheme.animations.typewriter.keyframes, 'typewriter has keyframes');

// Components - Button
console.log(`\n${COLORS.CYAN}Components - Button Styles${COLORS.RESET}`);
assertDefined(matrixTheme.components.button.base, 'button base exists');
assertEquals(matrixTheme.components.button.base.fontSize, '13px', 'button font size is 13px');
assertEquals(matrixTheme.components.button.base.fontWeight, 600, 'button font weight is 600');
assertEquals(matrixTheme.components.button.base.transition, 'all 0.2s ease', 'button has transition');

['primary', 'primaryHover', 'primaryActive', 'secondary', 'ghost', 'danger'].forEach(v => {
  assertDefined(matrixTheme.components.button.variants[v], `button variant ${v} exists`);
});

assertDefined(matrixTheme.components.button.disabled, 'button disabled state exists');
assertEquals(matrixTheme.components.button.disabled.opacity, 0.5, 'disabled button opacity is 0.5');
assertEquals(matrixTheme.components.button.disabled.cursor, 'not-allowed', 'disabled button cursor is not-allowed');

// Components - Input
console.log(`\n${COLORS.CYAN}Components - Input Styles${COLORS.RESET}`);
assertDefined(matrixTheme.components.input.base, 'input base exists');
assertEquals(matrixTheme.components.input.base.fontSize, '13px', 'input font size is 13px');
assertEquals(matrixTheme.components.input.base.fontFamily, 'mono', 'input font is mono');
assertDefined(matrixTheme.components.input.focus, 'input focus state exists');
assertDefined(matrixTheme.components.input.disabled, 'input disabled state exists');

// Components - Card
console.log(`\n${COLORS.CYAN}Components - Card Styles${COLORS.RESET}`);
assertDefined(matrixTheme.components.card.base, 'card base exists');
assertDefined(matrixTheme.components.card.hover, 'card hover state exists');
assertDefined(matrixTheme.components.card.elevated, 'card elevated state exists');

// Components - Code Block
console.log(`\n${COLORS.CYAN}Components - Code Block${COLORS.RESET}`);
assertDefined(matrixTheme.components.codeBlock, 'code block exists');
assertEquals(matrixTheme.components.codeBlock.fontFamily, 'mono', 'code block font is mono');
assertEquals(matrixTheme.components.codeBlock.fontSize, '12px', 'code block font size is 12px');
assertEquals(matrixTheme.components.codeBlock.lineHeight, 1.6, 'code block line height is 1.6');
assertEquals(matrixTheme.components.codeBlock.background, '#050812', 'code block has dark background');

// Components - Badge
console.log(`\n${COLORS.CYAN}Components - Badge${COLORS.RESET}`);
assertDefined(matrixTheme.components.badge.base, 'badge base exists');
assertEquals(matrixTheme.components.badge.base.fontSize, '11px', 'badge font size is 11px');
assertEquals(matrixTheme.components.badge.base.fontWeight, 600, 'badge font weight is 600');

['success', 'error', 'warning', 'info'].forEach(v => {
  assertDefined(matrixTheme.components.badge[v], `badge variant ${v} exists`);
});

assertEquals(matrixTheme.components.badge.success.color, '#00ff41', 'success badge is green');
assertEquals(matrixTheme.components.badge.error.color, '#ff004d', 'error badge is red');

// Components - Dropdown
console.log(`\n${COLORS.CYAN}Components - Dropdown${COLORS.RESET}`);
assertDefined(matrixTheme.components.dropdown, 'dropdown exists');
assertDefined(matrixTheme.components.dropdown.item, 'dropdown item exists');
assertDefined(matrixTheme.components.dropdown.item.hover, 'dropdown item hover exists');

// Components - Modal
console.log(`\n${COLORS.CYAN}Components - Modal${COLORS.RESET}`);
assertDefined(matrixTheme.components.modal, 'modal exists');
assertEquals(matrixTheme.components.modal.background, '#0f1419', 'modal background is dark');
assertContains(matrixTheme.components.modal.border, '#00ff41', 'modal border is green');

// Components - Tooltip
console.log(`\n${COLORS.CYAN}Components - Tooltip${COLORS.RESET}`);
assertDefined(matrixTheme.components.tooltip, 'tooltip exists');
assertEquals(matrixTheme.components.tooltip.fontSize, '12px', 'tooltip font size is 12px');
assertEquals(matrixTheme.components.tooltip.fontFamily, 'mono', 'tooltip font is mono');

// States
console.log(`\n${COLORS.CYAN}States Configuration${COLORS.RESET}`);
['hover', 'active', 'focus', 'disabled'].forEach(state => {
  assertDefined(matrixTheme.states[state], `state ${state} exists`);
});

assertContains(matrixTheme.states.hover.filter, 'brightness', 'hover has brightness filter');
assertContains(matrixTheme.states.active.filter, 'brightness', 'active has brightness filter');
assertContains(matrixTheme.states.focus.outline, '#00ff41', 'focus has green outline');
assertEquals(matrixTheme.states.disabled.opacity, 0.5, 'disabled has 0.5 opacity');

// Dark Mode
console.log(`\n${COLORS.CYAN}Dark Mode Configuration${COLORS.RESET}`);
assertEquals(matrixTheme.darkMode.enabled, true, 'dark mode enabled');
assertDefined(matrixTheme.darkMode.overrides, 'dark mode overrides exists');

// Breakpoints
console.log(`\n${COLORS.CYAN}Responsive Breakpoints${COLORS.RESET}`);
['xs', 'sm', 'md', 'lg', 'xl', '2xl'].forEach(bp => {
  assertDefined(matrixTheme.breakpoints[bp], `breakpoint ${bp} exists`);
  assertMatches(matrixTheme.breakpoints[bp], /^\d+px$/, `breakpoint ${bp} is valid`);
});

assertEquals(parseInt(matrixTheme.breakpoints.xs), 320, 'xs is mobile width');
assertEquals(parseInt(matrixTheme.breakpoints['2xl']), 1536, '2xl is large desktop width');

// Breakpoints are monotonic
const bpKeys = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const bpValues = bpKeys.map(k => parseInt(matrixTheme.breakpoints[k]));
for (let i = 1; i < bpValues.length; i++) {
  assertGreater(bpValues[i], bpValues[i - 1], `breakpoint ${bpKeys[i]} > ${bpKeys[i - 1]}`);
}

// Customization
console.log(`\n${COLORS.CYAN}Customization Guide${COLORS.RESET}`);
assertDefined(matrixTheme.customization, 'customization exists');
assert(Object.keys(matrixTheme.customization).length > 0, 'customization has entries');

// Palette
console.log(`\n${COLORS.CYAN}Color Palette Aliases${COLORS.RESET}`);
assertDefined(matrixTheme.palette, 'palette exists');
assertEquals(matrixTheme.palette.matrix_green_primary, '#00ff41', 'palette has primary green');
assertEquals(matrixTheme.palette.matrix_green_bright, '#39ff14', 'palette has bright green');
assertEquals(matrixTheme.palette.accent_red, '#ff004d', 'palette has red accent');
assertEquals(matrixTheme.palette.accent_cyan, '#00d4ff', 'palette has cyan accent');

// Installation
console.log(`\n${COLORS.CYAN}Installation Instructions${COLORS.RESET}`);
assertDefined(matrixTheme.installation, 'installation exists');
assertDefined(matrixTheme.installation.instructions, 'installation instructions exists');
assertContains(matrixTheme.installation.instructions.step1, '~/.claude/themes', 'step1 mentions themes directory');
assertContains(matrixTheme.installation.instructions.step2, '/theme', 'step2 mentions /theme command');

// Theme Consistency
console.log(`\n${COLORS.CYAN}Theme Consistency Checks${COLORS.RESET}`);
assertEquals(matrixTheme.colors.primary, '#00ff41', 'primary color consistent');
assertEquals(matrixTheme.colors.text, '#00ff41', 'text color consistent');
assertEquals(matrixTheme.colors.cursor, '#00ff41', 'cursor color consistent');
assertEquals(matrixTheme.palette.matrix_green_primary, '#00ff41', 'palette primary consistent');

assertEquals(matrixTheme.colors.success, '#00ff41', 'success color consistent');
assertEquals(matrixTheme.components.badge.success.color, '#00ff41', 'badge success consistent');

assertEquals(matrixTheme.colors.error, '#ff004d', 'error color consistent');
assertEquals(matrixTheme.components.button.variants.danger.color, '#ff004d', 'danger button consistent');

// Edge Cases
console.log(`\n${COLORS.CYAN}Edge Cases and Validation${COLORS.RESET}`);
assert(typeof matrixTheme === 'object' && matrixTheme !== null, 'theme is valid object');

Object.entries(matrixTheme.colors).forEach(([key, value]) => {
  assert(typeof value === 'string', `color ${key} is string`);
  assert(value.length > 0, `color ${key} is not empty`);
});

Object.entries(matrixTheme.animations).forEach(([key, anim]) => {
  const duration = parseFloat(anim.duration);
  assertGreater(duration, 0, `animation ${key} duration is positive`);
});

Object.values(matrixTheme.spacing).forEach(value => {
  const num = parseInt(value);
  assertGreaterOrEqual(num, 0, `spacing value is non-negative: ${value}`);
});

assertRange(matrixTheme.effects.scanlines.opacity, 0, 1, 'scanlines opacity is in [0, 1]');

// Summary
console.log(`\n${COLORS.CYAN}═══════════════════════════════════════${COLORS.RESET}`);
console.log(`${COLORS.GREEN}Passed: ${passed}${COLORS.RESET}`);
console.log(`${COLORS.RED}Failed: ${failed}${COLORS.RESET}`);
console.log(`${COLORS.CYAN}═══════════════════════════════════════${COLORS.RESET}`);

if (failures.length > 0) {
  console.log(`\n${COLORS.YELLOW}Failures:${COLORS.RESET}`);
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
}

process.exit(failed > 0 ? 1 : 0);
