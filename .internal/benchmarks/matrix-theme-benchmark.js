#!/usr/bin/env node

/**
 * Matrix Theme Benchmark Suite
 * Tests: file size, parsing time, CSS generation, color computation, memory usage
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { performance } = require('perf_hooks');

// Constants
const MATRIX_THEME_PATH = path.resolve(__dirname, '../themes/matrix.json');
const BENCHMARK_ITERATIONS = 1000;
const MEMORY_SAMPLES = 10;

// Utility: Format bytes to human-readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility: Format time in milliseconds
function formatTime(ms) {
  if (ms < 1) return (ms * 1000).toFixed(2) + ' μs';
  if (ms < 1000) return ms.toFixed(2) + ' ms';
  return (ms / 1000).toFixed(2) + ' s';
}

// Utility: Calculate statistics
function calculateStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const median = values.length % 2 === 0
    ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
    : sorted[Math.floor(values.length / 2)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { mean, median, min, max, stdDev };
}

// Utility: Get memory info
function getMemoryInfo() {
  const mem = process.memoryUsage();
  return {
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    external: mem.external,
    rss: mem.rss
  };
}

// Benchmark 1: File Size Analysis
function benchmarkFileSize() {
  console.log('\n▶ File Size Analysis');
  console.log('─'.repeat(50));

  const stats = fs.statSync(MATRIX_THEME_PATH);
  const fileSize = stats.size;
  const gzipSize = require('zlib').gzipSync(
    fs.readFileSync(MATRIX_THEME_PATH)
  ).length;

  const data = JSON.parse(fs.readFileSync(MATRIX_THEME_PATH, 'utf-8'));
  const colorCount = Object.keys(data.colors || {}).length;
  const componentCount = Object.keys(data.components || {}).length;
  const animationCount = Object.keys(data.animations || {}).length;

  console.log(`File Size (uncompressed): ${formatBytes(fileSize)}`);
  console.log(`File Size (gzip):         ${formatBytes(gzipSize)}`);
  console.log(`Compression Ratio:        ${((1 - gzipSize / fileSize) * 100).toFixed(1)}%`);
  console.log(`Colors:                   ${colorCount}`);
  console.log(`Components:               ${componentCount}`);
  console.log(`Animations:               ${animationCount}`);

  return {
    uncompressed: fileSize,
    gzip: gzipSize,
    colors: colorCount,
    components: componentCount,
    animations: animationCount
  };
}

// Benchmark 2: JSON Parsing Time
function benchmarkParsing() {
  console.log('\n▶ JSON Parsing Performance');
  console.log('─'.repeat(50));

  const fileContent = fs.readFileSync(MATRIX_THEME_PATH, 'utf-8');
  const times = [];

  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const start = performance.now();
    JSON.parse(fileContent);
    const end = performance.now();
    times.push(end - start);
  }

  const stats = calculateStats(times);

  console.log(`Iterations:    ${BENCHMARK_ITERATIONS}`);
  console.log(`Mean Time:     ${formatTime(stats.mean)}`);
  console.log(`Median Time:   ${formatTime(stats.median)}`);
  console.log(`Min Time:      ${formatTime(stats.min)}`);
  console.log(`Max Time:      ${formatTime(stats.max)}`);
  console.log(`Std Deviation: ${formatTime(stats.stdDev)}`);

  return { times, stats };
}

// Benchmark 3: Color Computation (hex to RGB conversion)
function benchmarkColorComputation() {
  console.log('\n▶ Color Computation (Hex to RGB)');
  console.log('─'.repeat(50));

  const data = JSON.parse(fs.readFileSync(MATRIX_THEME_PATH, 'utf-8'));
  const colors = data.colors || {};
  const colorValues = Object.values(colors).filter(v => typeof v === 'string' && v.startsWith('#'));

  const times = [];

  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const start = performance.now();
    colorValues.forEach(hex => {
      hexToRgb(hex);
    });
    const end = performance.now();
    times.push(end - start);
  }

  const stats = calculateStats(times);
  const timePerColor = stats.mean / colorValues.length;

  console.log(`Colors:        ${colorValues.length}`);
  console.log(`Iterations:    ${BENCHMARK_ITERATIONS}`);
  console.log(`Total Time:    ${formatTime(stats.mean)}`);
  console.log(`Per Color:     ${formatTime(timePerColor)}`);
  console.log(`Std Deviation: ${formatTime(stats.stdDev)}`);

  return { colorCount: colorValues.length, times, stats, perColor: timePerColor };
}

// Benchmark 4: CSS Generation
function benchmarkCssGeneration() {
  console.log('\n▶ CSS Generation');
  console.log('─'.repeat(50));

  const data = JSON.parse(fs.readFileSync(MATRIX_THEME_PATH, 'utf-8'));
  const times = [];
  let cssOutputSize = 0;

  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const start = performance.now();
    const css = generateCss(data);
    const end = performance.now();
    times.push(end - start);
    if (i === 0) cssOutputSize = css.length;
  }

  const stats = calculateStats(times);

  console.log(`Iterations:    ${BENCHMARK_ITERATIONS}`);
  console.log(`Mean Time:     ${formatTime(stats.mean)}`);
  console.log(`Median Time:   ${formatTime(stats.median)}`);
  console.log(`Min Time:      ${formatTime(stats.min)}`);
  console.log(`Max Time:      ${formatTime(stats.max)}`);
  console.log(`Std Deviation: ${formatTime(stats.stdDev)}`);
  console.log(`CSS Output:    ${formatBytes(cssOutputSize)}`);

  return { times, stats, cssSize: cssOutputSize };
}

// Benchmark 5: Memory Usage
function benchmarkMemory() {
  console.log('\n▶ Memory Usage Analysis');
  console.log('─'.repeat(50));

  const initialMem = getMemoryInfo();
  const samples = [];

  // Load theme multiple times
  for (let i = 0; i < MEMORY_SAMPLES; i++) {
    const data = JSON.parse(fs.readFileSync(MATRIX_THEME_PATH, 'utf-8'));
    const css = generateCss(data);

    const mem = getMemoryInfo();
    samples.push({
      heapUsed: mem.heapUsed - initialMem.heapUsed,
      heapTotal: mem.heapTotal - initialMem.heapTotal,
      rss: mem.rss - initialMem.rss
    });
  }

  const heapUsedStats = calculateStats(samples.map(s => s.heapUsed));
  const rssStats = calculateStats(samples.map(s => s.rss));

  console.log(`Heap Used (mean):  ${formatBytes(heapUsedStats.mean)}`);
  console.log(`Heap Used (max):   ${formatBytes(heapUsedStats.max)}`);
  console.log(`RSS (mean):        ${formatBytes(rssStats.mean)}`);
  console.log(`RSS (max):         ${formatBytes(rssStats.max)}`);
  console.log(`Total (samples):   ${MEMORY_SAMPLES}`);

  return { samples, heapUsedStats, rssStats };
}

// Helper: Convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

// Helper: Generate CSS from theme
function generateCss(theme) {
  let css = ':root {\n';

  if (theme.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => {
      css += `  --color-${key}: ${value};\n`;
    });
  }

  if (theme.typography?.fontSize) {
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`;
    });
  }

  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`;
    });
  }

  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      css += `  --radius-${key}: ${value};\n`;
    });
  }

  css += '}\n';

  // Add component styles
  if (theme.components?.button?.base) {
    css += '\n.btn {\n';
    Object.entries(theme.components.button.base).forEach(([key, value]) => {
      css += `  ${camelToKebab(key)}: ${value};\n`;
    });
    css += '}\n';
  }

  return css;
}

// Helper: Convert camelCase to kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// Benchmark 6: Compatibility Score
function benchmarkCompatibility() {
  console.log('\n▶ Compatibility Assessment');
  console.log('─'.repeat(50));

  const data = JSON.parse(fs.readFileSync(MATRIX_THEME_PATH, 'utf-8'));
  let score = 100;
  const issues = [];

  // Check required fields
  if (!data.name) { score -= 10; issues.push('Missing name'); }
  if (!data.version) { score -= 5; issues.push('Missing version'); }
  if (!data.colors) { score -= 15; issues.push('Missing colors'); }

  // Check color completeness
  const requiredColors = ['primary', 'background', 'text'];
  requiredColors.forEach(color => {
    if (!data.colors?.[color]) { score -= 5; issues.push(`Missing color: ${color}`); }
  });

  // Check typography
  if (!data.typography?.fontFamily) { score -= 10; issues.push('Missing typography'); }

  // Check components
  if (!data.components) { score -= 10; issues.push('Missing components'); }

  // Check metadata
  if (!data.metadata) { score -= 5; issues.push('Missing metadata'); }

  // Check accessibility
  if (data.metadata?.compatibility?.claudeCode) { score += 5; }
  if (data.states?.focus) { score += 5; }
  if (data.states?.disabled) { score += 5; }

  // Check effects (optional but beneficial)
  if (data.effects) { score += 5; }
  if (data.animations) { score += 5; }

  score = Math.max(0, Math.min(100, score));

  console.log(`Compatibility Score: ${score}/100`);
  if (issues.length > 0) {
    console.log(`Issues: ${issues.length}`);
    issues.forEach(issue => console.log(`  • ${issue}`));
  } else {
    console.log('✓ No issues detected');
  }

  return { score, issues };
}

// Generate Report
function generateReport(results) {
  const timestamp = new Date().toISOString();
  const nodeVersion = process.version;
  const platform = os.platform();

  const report = {
    timestamp,
    environment: {
      nodeVersion,
      platform,
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: formatBytes(os.totalmem()),
      freeMemory: formatBytes(os.freemem())
    },
    benchmarks: results
  };

  return report;
}

// Format results for display
function formatResults(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      fileSize: formatBytes(results.fileSize.uncompressed),
      gzipSize: formatBytes(results.fileSize.gzip),
      compressionRatio: ((1 - results.fileSize.gzip / results.fileSize.uncompressed) * 100).toFixed(1) + '%',
      parsingTime: formatTime(results.parsing.stats.mean),
      cssGenerationTime: formatTime(results.cssGen.stats.mean),
      compatibilityScore: results.compatibility.score + '/100'
    },
    detailed: {
      fileSize: results.fileSize,
      parsing: results.parsing.stats,
      colorComputation: results.colorComp.stats,
      cssGeneration: results.cssGen.stats,
      memory: {
        heapUsedMean: formatBytes(results.memory.heapUsedStats.mean),
        heapUsedMax: formatBytes(results.memory.heapUsedStats.max),
        rssMean: formatBytes(results.memory.rssStats.mean),
        rssMax: formatBytes(results.memory.rssStats.max)
      },
      compatibility: results.compatibility
    }
  };

  return report;
}

// Main
function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         Matrix Theme Benchmark Suite                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  const results = {
    fileSize: benchmarkFileSize(),
    parsing: benchmarkParsing(),
    colorComp: benchmarkColorComputation(),
    cssGen: benchmarkCssGeneration(),
    memory: benchmarkMemory(),
    compatibility: benchmarkCompatibility()
  };

  console.log('\n▶ Summary Report');
  console.log('─'.repeat(50));
  const formatted = formatResults(results);
  console.log(JSON.stringify(formatted.summary, null, 2));

  // Save detailed report
  const reportPath = path.join(__dirname, 'matrix-benchmark-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(formatted, null, 2));
  console.log(`\n✓ Detailed report saved: ${reportPath}`);

  // Return formatted results
  return formatted;
}

// Execute
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Benchmark failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  benchmarkFileSize,
  benchmarkParsing,
  benchmarkColorComputation,
  benchmarkCssGeneration,
  benchmarkMemory,
  benchmarkCompatibility,
  formatBytes,
  formatTime,
  calculateStats
};
