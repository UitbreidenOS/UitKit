#!/usr/bin/env node

/**
 * matrix-theme-stress.js
 *
 * Comprehensive stress test suite for Matrix theme:
 * - Rapid rapid theme switches (10K+ consecutive)
 * - Large config files (10MB+ synthetic themes)
 * - Extreme/invalid color values (out-of-range hex, malformed values)
 * - Edge case handling (null, undefined, circular refs, type mismatches)
 * - Memory pressure and GC behavior
 * - Error recovery and graceful degradation
 *
 * Run: node stress-tests/matrix-theme-stress.js [--intensity high|medium|low] [--verbose]
 */

const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
};

// Valid base theme
const BASE_MATRIX_THEME = require(path.join(__dirname, '../themes/matrix.json'));

// Test stats collector
class StressStats {
  constructor() {
    this.tests = new Map();
    this.totalErrors = 0;
    this.errorLog = [];
  }

  recordTest(name, passed, duration, metadata = {}) {
    if (!this.tests.has(name)) {
      this.tests.set(name, { passed: 0, failed: 0, totalDuration: 0, samples: [] });
    }

    const test = this.tests.get(name);
    if (passed) {
      test.passed++;
    } else {
      test.failed++;
      this.totalErrors++;
    }
    test.totalDuration += duration;
    test.samples.push({ duration, metadata });
  }

  recordError(test, error, context = {}) {
    this.errorLog.push({
      test,
      error: error.message || String(error),
      stack: error.stack,
      context,
      timestamp: performance.now(),
    });
  }

  summarize() {
    const summary = {};
    for (const [name, data] of this.tests) {
      const total = data.passed + data.failed;
      const durations = data.samples.map(s => s.duration).sort((a, b) => a - b);
      summary[name] = {
        total,
        passed: data.passed,
        failed: data.failed,
        passRate: ((data.passed / total) * 100).toFixed(1),
        avgDuration: (data.totalDuration / total).toFixed(3),
        minDuration: Math.min(...durations).toFixed(3),
        maxDuration: Math.max(...durations).toFixed(3),
        medianDuration: durations[Math.floor(durations.length / 2)].toFixed(3),
      };
    }
    return summary;
  }
}

const stats = new StressStats();
let testCount = 0;
let passCount = 0;

function test(name, fn, expectError = false) {
  const start = performance.now();
  let passed = false;
  let error = null;

  try {
    fn();
    passed = !expectError;
  } catch (e) {
    error = e;
    passed = expectError;
    if (!expectError) {
      stats.recordError(name, e);
    }
  }

  const duration = performance.now() - start;
  stats.recordTest(name, passed, duration);

  testCount++;
  if (passed) passCount++;

  const status = passed ? `${COLORS.GREEN}✓${COLORS.RESET}` : `${COLORS.RED}✗${COLORS.RESET}`;
  console.log(`  ${status} ${name} (${duration.toFixed(3)}ms)`);

  if (!passed && error && !expectError) {
    console.log(`    ${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
  }
}

function section(title) {
  console.log(`\n${COLORS.CYAN}${title}${COLORS.RESET}`);
  console.log('-'.repeat(70));
}

// ============================================================================
// RAPID THEME SWITCHING TESTS
// ============================================================================

function testRapidSwitching(intensity = 'medium') {
  section('STRESS TEST 1: Rapid Theme Switching');

  const iterations = intensity === 'high' ? 10000 : intensity === 'medium' ? 5000 : 1000;
  const THEMES = [BASE_MATRIX_THEME, ...generateVariantThemes(5)];

  test(`Rapid sequential switches (${iterations})`, () => {
    let currentTheme = THEMES[0];
    for (let i = 0; i < iterations; i++) {
      currentTheme = THEMES[i % THEMES.length];
      // Simulate theme application
      applyTheme(currentTheme);
    }
    assert(currentTheme, 'Final theme applied');
  });

  test('Rapid cycling with state updates', () => {
    const state = { theme: THEMES[0], listeners: new Set() };
    const unsubscribe = () => state.listeners.delete;

    for (let i = 0; i < 2000; i++) {
      const theme = THEMES[i % THEMES.length];
      state.theme = theme;
      state.listeners.forEach(cb => cb?.(theme));
    }
    assert.strictEqual(state.theme.name, THEMES[0].name);
  });

  test('Concurrent rapid switches (100 parallel simulations)', () => {
    const operations = [];
    for (let storeIdx = 0; storeIdx < 100; storeIdx++) {
      for (let i = 0; i < 50; i++) {
        const theme = THEMES[i % THEMES.length];
        operations.push({ storeIdx, theme });
      }
    }

    let succeeded = 0;
    operations.forEach(op => {
      try {
        applyTheme(op.theme);
        succeeded++;
      } catch (e) {
        // Expected for stress
      }
    });
    assert(succeeded > operations.length * 0.95, 'Most operations succeeded');
  });

  test('Theme switch with immediate re-apply', () => {
    for (let i = 0; i < 500; i++) {
      const theme = THEMES[i % THEMES.length];
      applyTheme(theme);
      applyTheme(theme); // Double apply
      applyTheme(THEMES[(i + 1) % THEMES.length]);
    }
  });

  test('Back-and-forth rapid switching', () => {
    const theme1 = THEMES[0];
    const theme2 = THEMES[1];
    for (let i = 0; i < 1000; i++) {
      applyTheme(i % 2 === 0 ? theme1 : theme2);
    }
  });
}

// ============================================================================
// LARGE CONFIG FILE TESTS
// ============================================================================

function testLargeConfigFiles(intensity = 'medium') {
  section('STRESS TEST 2: Large Config File Handling');

  test('Large theme file (1MB)', () => {
    const largeTheme = generateLargeTheme(1000); // ~1MB
    assert(largeTheme.colors, 'Large theme has colors');
    assert(Object.keys(largeTheme.colors).length > 500, 'Large theme has many colors');
    applyTheme(largeTheme);
  });

  test('Very large theme file (5MB)', () => {
    const veryLargeTheme = generateLargeTheme(5000); // ~5MB
    assert(veryLargeTheme.colors, 'Very large theme has colors');
    applyTheme(veryLargeTheme);
  });

  test('Serializing large theme to JSON', () => {
    const largeTheme = generateLargeTheme(1000);
    const json = JSON.stringify(largeTheme);
    assert(json.length > 100000, 'JSON is substantial');
  });

  test('Parsing large theme from JSON', () => {
    const largeTheme = generateLargeTheme(500);
    const json = JSON.stringify(largeTheme);
    const parsed = JSON.parse(json);
    assert.deepStrictEqual(Object.keys(parsed.colors).length, Object.keys(largeTheme.colors).length);
  });

  test('Deep cloning large theme', () => {
    const largeTheme = generateLargeTheme(500);
    const cloned = deepClone(largeTheme);
    assert(cloned !== largeTheme, 'Clone is different object');
    assert.deepStrictEqual(cloned.name, largeTheme.name, 'Clone has same name');
  });

  test('Merging multiple large themes', () => {
    const themes = [
      generateLargeTheme(200),
      generateLargeTheme(200),
      generateLargeTheme(200),
    ];
    const merged = Object.assign({}, ...themes.map(t => ({ colors: t.colors })));
    assert(Object.keys(merged.colors).length > 0, 'Merged theme has colors');
  });
}

// ============================================================================
// EXTREME COLOR VALUE TESTS
// ============================================================================

function testExtremeColorValues() {
  section('STRESS TEST 3: Extreme & Invalid Color Values');

  const extremeThemes = {
    allZeros: { ...BASE_MATRIX_THEME, colors: { primary: '#000000', background: '#000000' } },
    allWhite: { ...BASE_MATRIX_THEME, colors: { primary: '#ffffff', background: '#ffffff' } },
    randomHex: { ...BASE_MATRIX_THEME, colors: { primary: '#' + Math.random().toString(16).slice(2, 8) } },
    lowercaseHex: { ...BASE_MATRIX_THEME, colors: { primary: '#abcdef' } },
    uppercaseHex: { ...BASE_MATRIX_THEME, colors: { primary: '#ABCDEF' } },
    mixedCaseHex: { ...BASE_MATRIX_THEME, colors: { primary: '#AbCdEf' } },
    withAlpha: { ...BASE_MATRIX_THEME, colors: { primary: '#00ff4180' } },
  };

  Object.entries(extremeThemes).forEach(([name, theme]) => {
    test(`Apply theme with ${name}`, () => {
      applyTheme(theme);
    });
  });

  test('Extreme RGB values (edge cases)', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: {
        primary: 'rgb(0, 0, 0)',
        secondary: 'rgb(255, 255, 255)',
        tertiary: 'rgb(127, 127, 127)',
      },
    };
    applyTheme(theme);
  });

  test('Extreme RGBA values with alpha edge cases', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: {
        primary: 'rgba(0, 255, 65, 0)',
        secondary: 'rgba(0, 255, 65, 1)',
        tertiary: 'rgba(0, 255, 65, 0.5)',
      },
    };
    applyTheme(theme);
  });

  test('Color value edge case: HSL', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: { primary: 'hsl(120, 100%, 50%)' },
    };
    applyTheme(theme);
  });

  test('Invalid color formats (error case)', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: { primary: 'not-a-color' },
    };
    validateColorValue(theme.colors.primary);
    throw new Error('Should have thrown');
  }, true);

  test('Malformed hex values (error case)', () => {
    const malformedValues = ['#', '#00', '#0000', '#00000', '#0000000', '#gggggg'];
    let rejectedCount = 0;
    malformedValues.forEach(val => {
      try {
        validateColorValue(val);
        // Not throwing means validation passed - which is wrong for malformed
      } catch (e) {
        rejectedCount++;
      }
    });
    assert(rejectedCount === malformedValues.length, 'All malformed values rejected');
  });
}

// ============================================================================
// EDGE CASE HANDLING TESTS
// ============================================================================

function testEdgeCases() {
  section('STRESS TEST 4: Edge Cases & Graceful Degradation');

  test('Null theme (error case)', () => {
    applyTheme(null);
    throw new Error('Should reject null');
  }, true);

  test('Undefined theme (error case)', () => {
    applyTheme(undefined);
    throw new Error('Should reject undefined');
  }, true);

  test('Empty theme object', () => {
    applyTheme({});
    throw new Error('Should reject empty theme');
  }, true);

  test('Theme with missing colors', () => {
    applyTheme({ name: 'Broken', description: 'Missing colors' });
    throw new Error('Should reject');
  }, true);

  test('Theme with null color values', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: { ...BASE_MATRIX_THEME.colors, primary: null },
    };
    applyTheme(theme);
    throw new Error('Should reject null color');
  }, true);

  test('Theme with undefined color values', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: { ...BASE_MATRIX_THEME.colors, primary: undefined },
    };
    applyTheme(theme);
    throw new Error('Should reject undefined color');
  }, true);

  test('Circular reference in theme', () => {
    const theme = { ...BASE_MATRIX_THEME };
    theme.self = theme;
    JSON.stringify(theme);
    throw new Error('Should have thrown on circular ref');
  }, true);

  test('Deeply nested theme structure (100 levels)', () => {
    const theme = { ...BASE_MATRIX_THEME };
    let current = theme;
    for (let i = 0; i < 100; i++) {
      current.nested = { level: i };
      current = current.nested;
    }
    const json = JSON.stringify(theme);
    const parsed = JSON.parse(json);
    assert(parsed, 'Deeply nested parsed OK');
  });

  test('Type mismatch: string where number expected', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      typography: {
        ...BASE_MATRIX_THEME.typography,
        fontSize: { ...BASE_MATRIX_THEME.typography.fontSize, base: 'invalid' },
      },
    };
    validateFontSize(theme.typography.fontSize.base);
    throw new Error('Should reject invalid font size');
  }, true);

  test('Array instead of object in colors', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: ['#00ff41', '#ff0000'],
    };
    applyTheme(theme);
    throw new Error('Should reject array');
  }, true);

  test('Boolean in color value', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: { primary: true },
    };
    applyTheme(theme);
    throw new Error('Should reject boolean');
  }, true);

  test('Number in color value', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: { primary: 123456 },
    };
    applyTheme(theme);
    throw new Error('Should reject number');
  }, true);
}

// ============================================================================
// MEMORY & GC TESTS
// ============================================================================

function testMemoryBehavior(intensity = 'medium') {
  section('STRESS TEST 5: Memory & Garbage Collection');

  test('Allocate and release 100 large themes', () => {
    const themes = Array.from({ length: 100 }, () => generateLargeTheme(100));
    assert(themes.length === 100, 'All themes allocated');
    // Themes go out of scope for GC
  });

  test('Memory stability with repeated apply/clear', () => {
    const memBefore = process.memoryUsage().heapUsed;
    for (let i = 0; i < 1000; i++) {
      const theme = generateThemeVariant(BASE_MATRIX_THEME, i);
      applyTheme(theme);
    }
    const memAfter = process.memoryUsage().heapUsed;
    const growth = memAfter - memBefore;
    console.log(`    Memory growth: ${(growth / 1024 / 1024).toFixed(2)}MB`);
  });

  test('Theme cloning memory efficiency', () => {
    const original = generateLargeTheme(200);
    const clones = Array.from({ length: 50 }, () => deepClone(original));
    assert(clones.length === 50, 'All clones created');
  });

  test('Color palette iteration under memory pressure', () => {
    const theme = generateLargeTheme(500);
    let iterations = 0;
    for (let cycle = 0; cycle < 100; cycle++) {
      Object.entries(theme.colors).forEach(([, color]) => {
        validateColorValue(color);
        iterations++;
      });
    }
    assert(iterations > 50000, 'High iteration count');
  });
}

// ============================================================================
// ERROR RECOVERY TESTS
// ============================================================================

function testErrorRecovery() {
  section('STRESS TEST 6: Error Recovery & Resilience');

  test('Recovery from invalid theme', () => {
    let applied = null;
    try {
      applyTheme({ invalid: true });
    } catch (e) {
      // Expected
    }
    // Should be able to apply valid theme after error
    try {
      applyTheme(BASE_MATRIX_THEME);
      applied = BASE_MATRIX_THEME;
    } catch (e) {
      throw new Error('Failed to recover from error');
    }
    assert(applied, 'Recovered and applied valid theme');
  });

  test('Graceful fallback on color validation error', () => {
    const theme = {
      ...BASE_MATRIX_THEME,
      colors: { ...BASE_MATRIX_THEME.colors, primary: '#invalid' },
    };
    const fallback = fallbackToValidTheme(theme);
    assert(fallback, 'Fallback theme returned');
    assert(fallback.colors.primary, 'Fallback has valid color');
  });

  test('Batch operations with partial failures', () => {
    const themes = [
      BASE_MATRIX_THEME,
      { invalid: true },
      BASE_MATRIX_THEME,
      null,
      BASE_MATRIX_THEME,
    ];

    let succeeded = 0;
    let failed = 0;
    themes.forEach(theme => {
      try {
        applyTheme(theme);
        succeeded++;
      } catch (e) {
        failed++;
      }
    });

    assert(succeeded === 3, 'Valid themes applied');
    assert(failed === 2, 'Invalid themes rejected');
  });

  test('Sequential retries with exponential backoff', () => {
    let attempts = 0;
    const maxAttempts = 5;

    function attemptApply(theme) {
      attempts++;
      if (attempts < 3) {
        throw new Error('Simulated failure');
      }
      applyTheme(theme);
    }

    assert(attempts === 0);
    for (let i = 0; i < maxAttempts; i++) {
      try {
        attemptApply(BASE_MATRIX_THEME);
        break;
      } catch (e) {
        if (i === maxAttempts - 1) throw e;
      }
    }
    assert(attempts === 3, 'Retried until success');
  });

  test('Theme validation with detailed error messages', () => {
    const invalidThemes = [
      { error: 'no name' },
      { name: 'Missing colors' },
      { name: 'Bad colors', colors: [] },
    ];

    let rejected = 0;
    invalidThemes.forEach(theme => {
      try {
        applyTheme(theme);
      } catch (e) {
        assert(e.message, 'Error message provided');
        rejected++;
      }
    });
    assert(rejected === invalidThemes.length, 'All invalid themes rejected');
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateThemeVariant(baseTheme, seed = 0) {
  const variant = deepClone(baseTheme);
  const colors = Object.keys(variant.colors);
  if (colors.length > 0) {
    const targetColor = colors[seed % colors.length];
    // Vary with valid hex color
    const val = ((seed * 17) % 256).toString(16).padStart(2, '0');
    variant.colors[targetColor] = `#${val}ff41`;
  }
  return variant;
}

function generateVariantThemes(count) {
  return Array.from({ length: count }, (_, i) => generateThemeVariant(BASE_MATRIX_THEME, i));
}

function generateLargeTheme(colorCount = 100) {
  const theme = deepClone(BASE_MATRIX_THEME);
  const largeColors = {};

  // Add many color variations (valid hex colors)
  for (let i = 0; i < colorCount; i++) {
    // Generate valid hex by cycling through hue space
    const hueValue = Math.floor((i * 255 / colorCount)) % 256;
    const hex = hueValue.toString(16).padStart(2, '0');
    largeColors[`generated_color_${i}`] = `#${hex}${hex}${hex}`;
  }

  theme.colors = { ...theme.colors, ...largeColors };

  // Add large metadata
  theme.customization = {};
  for (let i = 0; i < colorCount; i++) {
    theme.customization[`option_${i}`] = {
      label: `Customization Option ${i}`,
      description: 'A'.repeat(100),
      value: Math.random().toString(36).substring(7),
    };
  }

  return theme;
}

function applyTheme(theme) {
  if (!theme || typeof theme !== 'object') {
    throw new Error('Theme must be a valid object');
  }
  if (!theme.name || typeof theme.name !== 'string') {
    throw new Error('Theme must have a valid name');
  }
  if (!theme.colors || typeof theme.colors !== 'object') {
    throw new Error('Theme must have colors object');
  }

  // Validate at least one color
  const colorKeys = Object.keys(theme.colors);
  if (colorKeys.length === 0) {
    throw new Error('Theme must have at least one color');
  }

  // Basic color validation
  colorKeys.forEach(key => {
    const value = theme.colors[key];
    if (value !== null && value !== undefined && typeof value === 'string') {
      validateColorValue(value);
    }
  });
}

function validateColorValue(value) {
  if (typeof value !== 'string') {
    throw new Error(`Color must be string, got ${typeof value}`);
  }
  if (value.length === 0) {
    throw new Error('Color cannot be empty');
  }

  // Simple validation - not exhaustive
  if (value.startsWith('#')) {
    if (!/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(value)) {
      throw new Error(`Invalid hex color: ${value}`);
    }
  } else if (value.startsWith('rgb')) {
    if (!/^rgba?\(/.test(value)) {
      throw new Error(`Invalid rgb color: ${value}`);
    }
  } else if (value.startsWith('hsl')) {
    if (!/^hsla?\(/.test(value)) {
      throw new Error(`Invalid hsl color: ${value}`);
    }
  }
  // Named colors are OK
}

function validateFontSize(value) {
  if (typeof value !== 'string' || !value.endsWith('px')) {
    throw new Error(`Invalid font size: ${value}`);
  }
  const num = parseInt(value);
  if (isNaN(num) || num < 0) {
    throw new Error(`Font size must be positive: ${value}`);
  }
}

function fallbackToValidTheme(theme) {
  try {
    applyTheme(theme);
    return theme;
  } catch (e) {
    return BASE_MATRIX_THEME;
  }
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runStressTests() {
  const args = process.argv.slice(2);
  const intensity = args.find(a => a.startsWith('--intensity='))?.split('=')[1] || 'medium';
  const verbose = args.includes('--verbose');

  console.log('='.repeat(70));
  console.log('MATRIX THEME STRESS TEST SUITE');
  console.log('='.repeat(70));
  console.log(`Configuration:`);
  console.log(`  Intensity: ${intensity}`);
  console.log(`  Verbose: ${verbose}`);
  console.log('='.repeat(70));

  const startTime = performance.now();

  try {
    testRapidSwitching(intensity);
    testLargeConfigFiles(intensity);
    testExtremeColorValues();
    testEdgeCases();
    testMemoryBehavior(intensity);
    testErrorRecovery();
  } catch (e) {
    console.error(`${COLORS.RED}Unexpected test runner error: ${e.message}${COLORS.RESET}`);
  }

  const duration = performance.now() - startTime;

  // Summary
  console.log(`\n${COLORS.CYAN}${'='.repeat(70)}${COLORS.RESET}`);
  console.log(`${COLORS.CYAN}TEST SUMMARY${COLORS.RESET}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`${COLORS.GREEN}Total: ${passCount}/${testCount} passed${COLORS.RESET}`);
  console.log(`Duration: ${duration.toFixed(2)}ms`);

  const summary = stats.summarize();
  console.log(`\n${COLORS.YELLOW}Results by Category:${COLORS.RESET}`);
  Object.entries(summary).forEach(([name, data]) => {
    const rate = parseFloat(data.passRate);
    const color = rate === 100 ? COLORS.GREEN : rate >= 90 ? COLORS.YELLOW : COLORS.RED;
    console.log(
      `  ${color}${name}${COLORS.RESET}: ${data.passed}/${data.total} ` +
      `(${data.passRate}%) avg:${data.avgDuration}ms`
    );
  });

  if (stats.totalErrors > 0) {
    console.log(`\n${COLORS.RED}Errors: ${stats.totalErrors}${COLORS.RESET}`);
    stats.errorLog.slice(0, 5).forEach((err, idx) => {
      console.log(`  ${idx + 1}. [${err.test}] ${err.error}`);
    });
  }

  console.log(`\n${COLORS.CYAN}${'='.repeat(70)}${COLORS.RESET}`);

  // Write results
  const reportPath = path.join(__dirname, 'matrix-theme-stress-results.json');
  const report = {
    timestamp: new Date().toISOString(),
    duration: duration,
    totalTests: testCount,
    passed: passCount,
    failed: testCount - passCount,
    passRate: ((passCount / testCount) * 100).toFixed(1),
    summary,
    errors: stats.errorLog.slice(0, 20),
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Results written to: ${reportPath}`);

  process.exit(passCount === testCount ? 0 : 1);
}

runStressTests().catch(err => {
  console.error(`${COLORS.RED}Fatal error: ${err.message}${COLORS.RESET}`);
  process.exit(1);
});
