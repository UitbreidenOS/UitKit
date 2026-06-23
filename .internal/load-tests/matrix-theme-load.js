#!/usr/bin/env node

/**
 * matrix-theme-load.js
 *
 * Load test: High-frequency theme switching
 * - 1K rapid sequential switches
 * - 100 concurrent theme applications
 * - Memory profile under load
 * - Performance metrics collection
 *
 * Run: node load-tests/matrix-theme-load.js [--concurrency N] [--iterations N] [--verbose]
 */

const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

// Theme definitions (matching ToolkitApp.tsx)
const THEMES = [
  { name: "Claudient Brand", id: "claudient-brand", colors: ["#f5b800", "#f54e00", "#1d4aff"] },
  { name: "Catppuccin", id: "catppuccin", colors: ["#cba6f7", "#89b4fa", "#a6e3a1"] },
  { name: "Dracula", id: "dracula", colors: ["#bd93f9", "#ff79c6", "#50fa7b"] },
  { name: "Gruvbox", id: "gruvbox", colors: ["#fabd2f", "#fb4934", "#b8bb26"] },
  { name: "Monokai", id: "monokai", colors: ["#f92672", "#a6e22e", "#66d9ef"] },
  { name: "Nord", id: "nord", colors: ["#88c0d0", "#81a1c1", "#5e81ac"] },
  { name: "Rose Pine", id: "rose-pine", colors: ["#c4a7e7", "#eb6f92", "#f6c177"] },
  { name: "Solarized Dark", id: "solarized-dark", colors: ["#268bd2", "#b58900", "#dc322f"] },
  { name: "Solarized Light", id: "solarized-light", colors: ["#268bd2", "#b58900", "#2aa198"] },
  { name: "Tokyo Night", id: "tokyo-night", colors: ["#7aa2f7", "#bb9af7", "#9ece6a"] },
  { name: "Ghost Shell", id: "ghost-shell", colors: ["#c0c0c0", "#4a4a4a", "#00ff41"] },
  { name: "Claudient Neon", id: "claudient-neon", colors: ["#00ff41", "#ff00ff", "#00ffff"] },
];

// Simulated theme state store
class ThemeStore {
  constructor() {
    this.currentTheme = THEMES[0];
    this.listeners = new Set();
    this.applyHistory = [];
    this.memorySnapshot = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  applyTheme(themeId) {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) throw new Error(`Theme not found: ${themeId}`);

    this.currentTheme = theme;
    this.applyHistory.push({
      themeId,
      timestamp: performance.now(),
      memoryUsage: process.memoryUsage(),
    });

    // Notify listeners (simulating DOM updates)
    this.listeners.forEach(listener => {
      try {
        listener(theme);
      } catch (e) {
        console.error('Listener error:', e);
      }
    });
  }

  captureMemory() {
    this.memorySnapshot = process.memoryUsage();
    return this.memorySnapshot;
  }

  getHistory() {
    return this.applyHistory;
  }
}

// Listener simulation (DOM update, CSS application, etc.)
function createThemeListener(id) {
  let renderCount = 0;
  let lastTheme = null;

  return (theme) => {
    renderCount++;
    lastTheme = theme;

    // Simulate DOM mutation observer overhead
    simulateStyleUpdate(theme);
  };
}

// Simulate CSS variable updates in DOM
function simulateStyleUpdate(theme) {
  const cssVars = new Map();
  theme.colors.forEach((color, idx) => {
    cssVars.set(`--color-${idx}`, color);
  });
  cssVars.set(`--theme-id`, theme.id);
  cssVars.set(`--theme-name`, theme.name);

  // Simulate layout recalculation
  const computedStyle = {
    vars: cssVars,
    computed: Math.random() * 1000, // Simulated recalc time
  };

  return computedStyle;
}

// Performance metrics collector
class PerformanceMetrics {
  constructor() {
    this.timings = [];
    this.memoryReadings = [];
    this.errors = [];
  }

  recordTiming(name, duration, metadata = {}) {
    this.timings.push({
      name,
      duration,
      timestamp: performance.now(),
      ...metadata,
    });
  }

  recordMemory(label, usage) {
    this.memoryReadings.push({
      label,
      rss: usage.rss,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers,
      timestamp: performance.now(),
    });
  }

  recordError(error) {
    this.errors.push({
      message: error.message,
      timestamp: performance.now(),
    });
  }

  summarize() {
    const validTimings = this.timings.filter(t => t.duration > 0);
    if (validTimings.length === 0) return null;

    const durations = validTimings.map(t => t.duration);
    const sorted = durations.sort((a, b) => a - b);

    return {
      count: validTimings.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      mean: durations.reduce((a, b) => a + b, 0) / durations.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  summarizeMemory() {
    if (this.memoryReadings.length === 0) return null;

    const heapUsed = this.memoryReadings.map(r => r.heapUsed);
    return {
      readings: this.memoryReadings.length,
      heapMin: Math.min(...heapUsed),
      heapMax: Math.max(...heapUsed),
      heapAvg: heapUsed.reduce((a, b) => a + b, 0) / heapUsed.length,
      peakHeap: Math.max(...heapUsed),
      initialHeap: this.memoryReadings[0]?.heapUsed || 0,
      finalHeap: this.memoryReadings[this.memoryReadings.length - 1]?.heapUsed || 0,
      heapGrowth: (this.memoryReadings[this.memoryReadings.length - 1]?.heapUsed || 0) -
                   (this.memoryReadings[0]?.heapUsed || 0),
    };
  }

  getResults() {
    return {
      timings: this.summarize(),
      memory: this.summarizeMemory(),
      errorCount: this.errors.length,
      errors: this.errors.slice(0, 10), // First 10 errors
      totalTimings: this.timings.length,
    };
  }
}

// Sequential load test
async function testSequentialSwitches(iterations, metrics, verbose = false) {
  const store = new ThemeStore();
  const listener = createThemeListener('sequential');
  store.subscribe(listener);

  metrics.recordMemory('before-sequential', process.memoryUsage());

  for (let i = 0; i < iterations; i++) {
    const theme = THEMES[i % THEMES.length];

    const startTime = performance.now();
    try {
      store.applyTheme(theme.id);
      const duration = performance.now() - startTime;
      metrics.recordTiming('sequential-switch', duration, { iteration: i, themeId: theme.id });

      if (verbose && i % 100 === 0) {
        console.log(`  [Sequential] Iteration ${i}/${iterations}`);
      }
    } catch (e) {
      metrics.recordError(e);
    }
  }

  metrics.recordMemory('after-sequential', process.memoryUsage());
}

// Concurrent load test (simulated via interleaving)
async function testConcurrentApplications(concurrency, iterations, metrics, verbose = false) {
  const stores = Array.from({ length: concurrency }, () => new ThemeStore());
  const listeners = stores.map((_, idx) => createThemeListener(`concurrent-${idx}`));
  stores.forEach((store, idx) => store.subscribe(listeners[idx]));

  metrics.recordMemory('before-concurrent', process.memoryUsage());

  // Apply themes in round-robin across stores
  for (let i = 0; i < iterations; i++) {
    const storeIdx = i % concurrency;
    const store = stores[storeIdx];
    const theme = THEMES[i % THEMES.length];

    const startTime = performance.now();
    try {
      store.applyTheme(theme.id);
      const duration = performance.now() - startTime;
      metrics.recordTiming('concurrent-apply', duration, {
        iteration: i,
        storeId: storeIdx,
        themeId: theme.id
      });

      if (verbose && i % 100 === 0) {
        console.log(`  [Concurrent] Iteration ${i}/${iterations}, Active stores: ${concurrency}`);
      }
    } catch (e) {
      metrics.recordError(e);
    }
  }

  metrics.recordMemory('after-concurrent', process.memoryUsage());
}

// Stress test: rapid theme cycling
async function testRapidCycling(cycles, metrics, verbose = false) {
  const store = new ThemeStore();
  const listener = createThemeListener('rapid');
  store.subscribe(listener);

  metrics.recordMemory('before-rapid', process.memoryUsage());

  const startTime = performance.now();

  for (let i = 0; i < cycles; i++) {
    const theme = THEMES[i % THEMES.length];

    try {
      const switchStart = performance.now();
      store.applyTheme(theme.id);
      const duration = performance.now() - switchStart;
      metrics.recordTiming('rapid-cycle', duration, { cycle: i, themeId: theme.id });

      if (verbose && i % 200 === 0) {
        console.log(`  [Rapid] Cycle ${i}/${cycles}`);
      }
    } catch (e) {
      metrics.recordError(e);
    }
  }

  const totalDuration = performance.now() - startTime;
  metrics.recordMemory('after-rapid', process.memoryUsage());

  return totalDuration;
}

// Memory spike detection
function analyzeMemorySpikes(metrics) {
  const readings = metrics.memoryReadings;
  if (readings.length < 2) return [];

  const spikes = [];
  for (let i = 1; i < readings.length; i++) {
    const current = readings[i].heapUsed;
    const previous = readings[i - 1].heapUsed;
    const change = current - previous;

    if (Math.abs(change) > 1_000_000) { // 1MB spike
      spikes.push({
        timestamp: readings[i].timestamp,
        heapUsed: current,
        change,
        percentChange: (change / previous) * 100,
      });
    }
  }

  return spikes;
}

// Main test runner
async function runLoadTests() {
  const args = process.argv.slice(2);
  const concurrency = parseInt(args.find(a => a.startsWith('--concurrency='))?.split('=')[1] || '100', 10);
  const iterations = parseInt(args.find(a => a.startsWith('--iterations='))?.split('=')[1] || '1000', 10);
  const verbose = args.includes('--verbose');

  console.log('='.repeat(70));
  console.log('THEME MATRIX LOAD TEST');
  console.log('='.repeat(70));
  console.log(`Configuration:`);
  console.log(`  Sequential iterations: ${iterations}`);
  console.log(`  Concurrent stores: ${concurrency}`);
  console.log(`  Total themes: ${THEMES.length}`);
  console.log(`  Verbose: ${verbose}`);
  console.log('='.repeat(70));
  console.log();

  const metrics = new PerformanceMetrics();
  const testResults = {};

  // Test 1: Sequential theme switches (1K)
  console.log('TEST 1: Sequential Theme Switches (1K rapid switches)');
  console.log('-'.repeat(70));
  const seqStart = performance.now();
  await testSequentialSwitches(iterations, metrics, verbose);
  const seqDuration = performance.now() - seqStart;
  testResults.sequential = {
    duration: seqDuration,
    throughput: iterations / (seqDuration / 1000),
  };
  console.log(`Completed in ${seqDuration.toFixed(2)}ms (${(iterations / (seqDuration / 1000)).toFixed(2)} switches/sec)`);
  console.log();

  // Test 2: Concurrent theme applications (100 stores)
  console.log('TEST 2: Concurrent Theme Applications (100 stores)');
  console.log('-'.repeat(70));
  const concStart = performance.now();
  await testConcurrentApplications(concurrency, iterations, metrics, verbose);
  const concDuration = performance.now() - concStart;
  testResults.concurrent = {
    duration: concDuration,
    throughput: (iterations * concurrency) / (concDuration / 1000),
    storeCount: concurrency,
  };
  console.log(`Completed in ${concDuration.toFixed(2)}ms (${((iterations * concurrency) / (concDuration / 1000)).toFixed(2)} total applies/sec)`);
  console.log();

  // Test 3: Rapid cycling stress test
  console.log('TEST 3: Rapid Cycling Stress (500 cycles)');
  console.log('-'.repeat(70));
  const stressStart = performance.now();
  const stressDuration = await testRapidCycling(500, metrics, verbose);
  testResults.rapid = {
    duration: stressDuration,
    throughput: 500 / (stressDuration / 1000),
  };
  console.log(`Completed in ${stressDuration.toFixed(2)}ms (${(500 / (stressDuration / 1000)).toFixed(2)} cycles/sec)`);
  console.log();

  // Analysis
  console.log('='.repeat(70));
  console.log('PERFORMANCE ANALYSIS');
  console.log('='.repeat(70));

  const results = metrics.getResults();

  console.log('\nSequential Switch Timings:');
  if (results.timings) {
    console.log(`  Count: ${results.timings.count}`);
    console.log(`  Min: ${results.timings.min.toFixed(3)}ms`);
    console.log(`  Max: ${results.timings.max.toFixed(3)}ms`);
    console.log(`  Mean: ${results.timings.mean.toFixed(3)}ms`);
    console.log(`  Median: ${results.timings.median.toFixed(3)}ms`);
    console.log(`  P95: ${results.timings.p95.toFixed(3)}ms`);
    console.log(`  P99: ${results.timings.p99.toFixed(3)}ms`);
  }

  console.log('\nMemory Profile:');
  if (results.memory) {
    const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);
    console.log(`  Initial Heap: ${mb(results.memory.initialHeap)}MB`);
    console.log(`  Final Heap: ${mb(results.memory.finalHeap)}MB`);
    console.log(`  Peak Heap: ${mb(results.memory.peakHeap)}MB`);
    console.log(`  Heap Growth: ${mb(results.memory.heapGrowth)}MB`);
    console.log(`  Average Heap: ${mb(results.memory.heapAvg)}MB`);
  }

  console.log('\nThroughput:');
  console.log(`  Sequential: ${testResults.sequential.throughput.toFixed(2)} switches/sec`);
  console.log(`  Concurrent: ${testResults.concurrent.throughput.toFixed(2)} applies/sec (${concurrency} stores)`);
  console.log(`  Rapid Cycling: ${testResults.rapid.throughput.toFixed(2)} cycles/sec`);

  if (results.errorCount > 0) {
    console.log(`\nErrors: ${results.errorCount}`);
    results.errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err.message}`);
    });
  }

  // Memory spike analysis
  console.log('\n' + '='.repeat(70));
  console.log('MEMORY SPIKE ANALYSIS');
  console.log('='.repeat(70));
  const spikes = analyzeMemorySpikes(metrics);
  if (spikes.length > 0) {
    console.log(`Detected ${spikes.length} memory spikes (>1MB change):`);
    spikes.slice(0, 5).forEach((spike, idx) => {
      console.log(`  ${idx + 1}. ${(spike.change / 1024 / 1024).toFixed(2)}MB (${spike.percentChange.toFixed(1)}%)`);
    });
  } else {
    console.log('No significant memory spikes detected');
  }

  // Write detailed results to file
  console.log('\n' + '='.repeat(70));
  console.log('DETAILED REPORT');
  console.log('='.repeat(70));

  const reportPath = path.join(__dirname, 'theme-load-results.json');
  const report = {
    timestamp: new Date().toISOString(),
    configuration: {
      sequentialIterations: iterations,
      concurrentStores: concurrency,
      totalThemes: THEMES.length,
      rapidCycles: 500,
    },
    testResults,
    performance: results,
    memorySpikes: spikes,
    metadata: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
    },
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nDetailed results written to: ${reportPath}`);
  console.log();
}

runLoadTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
