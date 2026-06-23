#!/usr/bin/env node

/**
 * Matrix Theme Profiler
 * Analyzes CPU usage, I/O patterns, memory allocation
 * Generates flamegraph-compatible output (Brendan Gregg format)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { performance, PerformanceObserver } = require('perf_hooks');
const { Worker } = require('worker_threads');

const MATRIX_THEME_PATH = path.resolve(__dirname, '../themes/matrix.json');
const PROFILER_OUTPUT_DIR = path.resolve(__dirname, '../profilers/output');
const PROFILE_DURATION_MS = 5000;
const SAMPLE_INTERVAL_MS = 1;

class MatrixThemeProfiler {
  constructor() {
    this.samples = [];
    this.ioMetrics = [];
    this.memorySnapshots = [];
    this.startTime = null;
    this.endTime = null;
    this.callStack = [];
    this.stackTrace = new Map();
    this.functionTiming = new Map();
    this.functionCallCount = new Map();
    this.ioStats = {
      reads: 0,
      writes: 0,
      totalBytesRead: 0,
      totalBytesWritten: 0
    };
  }

  /**
   * Start CPU profiling with performance hooks
   */
  startCpuProfiling() {
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.samples.push({
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime,
          kind: entry.entryType
        });
      }
    });

    obs.observe({ entryTypes: ['measure', 'function'] });
    return obs;
  }

  /**
   * Profile memory allocation and heap usage
   */
  captureMemorySnapshot(label) {
    if (global.gc) global.gc();
    const mem = process.memoryUsage();
    this.memorySnapshots.push({
      timestamp: performance.now(),
      label,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
      rss: mem.rss,
      arrayBuffers: mem.arrayBuffers || 0
    });
  }

  /**
   * Track I/O operations with wrapper functions
   */
  instrumentIO() {
    const originalReadFileSync = fs.readFileSync;
    const originalReadFile = fs.readFile;
    const originalWriteFileSync = fs.writeFileSync;
    const originalWriteFile = fs.writeFile;

    fs.readFileSync = (...args) => {
      const start = performance.now();
      this.ioMetrics.push({ op: 'readFileSync', start });
      try {
        const result = originalReadFileSync.apply(fs, args);
        const duration = performance.now() - start;
        this.ioStats.reads++;
        this.ioStats.totalBytesRead += result?.length || 0;
        this.ioMetrics[this.ioMetrics.length - 1].duration = duration;
        this.ioMetrics[this.ioMetrics.length - 1].bytes = result?.length || 0;
        return result;
      } catch (e) {
        this.ioMetrics[this.ioMetrics.length - 1].error = e.message;
        throw e;
      }
    };

    fs.readFile = (file, ...args) => {
      const start = performance.now();
      const callback = args[args.length - 1];
      this.ioMetrics.push({ op: 'readFile', start, file });

      return originalReadFile.call(fs, file, ...args.slice(0, -1), (err, data) => {
        const duration = performance.now() - start;
        this.ioStats.reads++;
        this.ioStats.totalBytesRead += data?.length || 0;
        this.ioMetrics[this.ioMetrics.length - 1].duration = duration;
        this.ioMetrics[this.ioMetrics.length - 1].bytes = data?.length || 0;
        if (err) this.ioMetrics[this.ioMetrics.length - 1].error = err.message;
        callback(err, data);
      });
    };

    fs.writeFileSync = (file, data, ...args) => {
      const start = performance.now();
      this.ioMetrics.push({ op: 'writeFileSync', start, file });
      try {
        const result = originalWriteFileSync.apply(fs, [file, data, ...args]);
        const duration = performance.now() - start;
        this.ioStats.writes++;
        this.ioStats.totalBytesWritten += Buffer.byteLength(data);
        this.ioMetrics[this.ioMetrics.length - 1].duration = duration;
        this.ioMetrics[this.ioMetrics.length - 1].bytes = Buffer.byteLength(data);
        return result;
      } catch (e) {
        this.ioMetrics[this.ioMetrics.length - 1].error = e.message;
        throw e;
      }
    };

    fs.writeFile = (file, data, ...args) => {
      const start = performance.now();
      const callback = args[args.length - 1];
      this.ioMetrics.push({ op: 'writeFile', start, file });

      return originalWriteFile.call(fs, file, data, ...args.slice(0, -1), (err) => {
        const duration = performance.now() - start;
        this.ioStats.writes++;
        this.ioStats.totalBytesWritten += Buffer.byteLength(data);
        this.ioMetrics[this.ioMetrics.length - 1].duration = duration;
        this.ioMetrics[this.ioMetrics.length - 1].bytes = Buffer.byteLength(data);
        if (err) this.ioMetrics[this.ioMetrics.length - 1].error = err.message;
        callback(err);
      });
    };
  }

  /**
   * Measure function execution with detailed timing
   */
  measureFunction(name, fn) {
    const start = performance.now();
    this.callStack.push(name);

    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const duration = performance.now() - start;
    this.callStack.pop();

    if (!this.functionTiming.has(name)) {
      this.functionTiming.set(name, []);
      this.functionCallCount.set(name, 0);
    }
    this.functionTiming.get(name).push(duration);
    this.functionCallCount.set(name, (this.functionCallCount.get(name) || 0) + 1);

    return result;
  }

  /**
   * Parse theme and measure each operation
   */
  profileThemeParsing() {
    console.log('▶ Profiling theme parsing...');

    return this.measureFunction('parseTheme', () => {
      this.captureMemorySnapshot('before-parse');
      const content = this.measureFunction('readThemeFile', () =>
        fs.readFileSync(MATRIX_THEME_PATH, 'utf-8')
      );
      const theme = this.measureFunction('jsonParse', () => JSON.parse(content));
      this.captureMemorySnapshot('after-parse');
      return theme;
    });
  }

  /**
   * Profile color operations
   */
  profileColorOperations(theme) {
    console.log('▶ Profiling color operations...');
    this.captureMemorySnapshot('before-colors');

    return this.measureFunction('processColors', () => {
      const colors = theme.colors || {};
      const results = {};

      Object.entries(colors).forEach(([name, hex]) => {
        results[name] = this.measureFunction(`hexToRgb-${name}`, () =>
          this.hexToRgb(hex)
        );
      });

      this.captureMemorySnapshot('after-colors');
      return results;
    });
  }

  /**
   * Profile CSS generation
   */
  profileCssGeneration(theme) {
    console.log('▶ Profiling CSS generation...');
    this.captureMemorySnapshot('before-css');

    return this.measureFunction('generateCss', () => {
      let css = ':root {\n';

      if (theme.colors) {
        css += this.measureFunction('generateColorVariables', () => {
          let colorCss = '';
          Object.entries(theme.colors).forEach(([key, value]) => {
            colorCss += `  --color-${key}: ${value};\n`;
          });
          return colorCss;
        });
      }

      if (theme.typography?.fontSize) {
        css += this.measureFunction('generateFontVariables', () => {
          let fontCss = '';
          Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
            fontCss += `  --font-size-${key}: ${value};\n`;
          });
          return fontCss;
        });
      }

      if (theme.spacing) {
        css += this.measureFunction('generateSpacingVariables', () => {
          let spacingCss = '';
          Object.entries(theme.spacing).forEach(([key, value]) => {
            spacingCss += `  --spacing-${key}: ${value};\n`;
          });
          return spacingCss;
        });
      }

      if (theme.components) {
        css += this.measureFunction('generateComponentStyles', () => {
          let componentCss = '';
          Object.entries(theme.components).forEach(([name, comp]) => {
            if (comp.base) {
              componentCss += `\n.${name} {\n`;
              Object.entries(comp.base).forEach(([key, value]) => {
                componentCss += `  ${this.camelToKebab(key)}: ${value};\n`;
              });
              componentCss += '}\n';
            }
          });
          return componentCss;
        });
      }

      css += '}\n';
      this.captureMemorySnapshot('after-css');
      return css;
    });
  }

  /**
   * Profile animation processing
   */
  profileAnimations(theme) {
    console.log('▶ Profiling animation processing...');
    this.captureMemorySnapshot('before-animations');

    return this.measureFunction('processAnimations', () => {
      const animations = theme.animations || {};
      const results = {};

      Object.entries(animations).forEach(([name, anim]) => {
        results[name] = this.measureFunction(`processAnimation-${name}`, () => {
          return {
            name: anim.name,
            keyframeCount: Object.keys(anim.keyframes || {}).length,
            duration: anim.duration
          };
        });
      });

      this.captureMemorySnapshot('after-animations');
      return results;
    });
  }

  /**
   * Profile component complexity analysis
   */
  profileComponentAnalysis(theme) {
    console.log('▶ Profiling component analysis...');
    this.captureMemorySnapshot('before-component-analysis');

    return this.measureFunction('analyzeComponents', () => {
      const components = theme.components || {};
      const analysis = {};

      Object.entries(components).forEach(([name, comp]) => {
        analysis[name] = this.measureFunction(`analyzeComponent-${name}`, () => {
          let propertyCount = 0;
          let variantCount = 0;

          if (comp.base) propertyCount += Object.keys(comp.base).length;
          if (comp.variants) {
            variantCount = Object.keys(comp.variants).length;
            Object.values(comp.variants).forEach(v => {
              propertyCount += Object.keys(v).length;
            });
          }
          if (comp.hover) propertyCount += Object.keys(comp.hover).length;
          if (comp.disabled) propertyCount += Object.keys(comp.disabled).length;

          return { propertyCount, variantCount, complexity: propertyCount * (1 + variantCount) };
        });
      });

      this.captureMemorySnapshot('after-component-analysis');
      return analysis;
    });
  }

  /**
   * Generate flamegraph-compatible output (Brendan Gregg format)
   */
  generateFlamegraph() {
    const flamegraph = [];

    // CPU flamegraph from function timing
    this.functionTiming.forEach((timings, funcName) => {
      const totalTime = timings.reduce((a, b) => a + b, 0);
      const callCount = this.functionCallCount.get(funcName);
      const avgTime = totalTime / timings.length;

      flamegraph.push({
        stack: this.buildStackTrace(funcName),
        samples: Math.round(totalTime),
        avgDuration: avgTime,
        callCount
      });
    });

    return flamegraph.sort((a, b) => b.samples - a.samples);
  }

  buildStackTrace(funcName) {
    return `main;${funcName}`;
  }

  /**
   * Generate profiler report
   */
  generateReport() {
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        duration: this.endTime - this.startTime,
        environment: {
          nodeVersion: process.version,
          platform: os.platform(),
          arch: os.arch(),
          cpus: os.cpus().length,
          totalMemory: os.totalmem(),
          freeMemory: os.freemem()
        }
      },
      cpu: this.generateCpuReport(),
      memory: this.generateMemoryReport(),
      io: this.generateIoReport(),
      functions: this.generateFunctionReport(),
      flamegraph: this.generateFlamegraph(),
      bottlenecks: this.identifyBottlenecks()
    };

    return report;
  }

  generateCpuReport() {
    const totalTime = this.functionTiming.size > 0
      ? Array.from(this.functionTiming.values()).reduce((sum, timings) =>
          sum + timings.reduce((a, b) => a + b, 0), 0)
      : 0;

    const topFunctions = Array.from(this.functionTiming.entries())
      .map(([name, timings]) => ({
        name,
        totalTime: timings.reduce((a, b) => a + b, 0),
        avgTime: timings.reduce((a, b) => a + b, 0) / timings.length,
        callCount: this.functionCallCount.get(name),
        minTime: Math.min(...timings),
        maxTime: Math.max(...timings)
      }))
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, 20);

    return {
      totalTime,
      functionCount: this.functionTiming.size,
      topFunctions
    };
  }

  generateMemoryReport() {
    if (this.memorySnapshots.length === 0) return null;

    const snapshots = this.memorySnapshots.map(s => ({
      label: s.label,
      heapUsed: s.heapUsed,
      heapTotal: s.heapTotal,
      rss: s.rss,
      heapUsedMB: (s.heapUsed / 1024 / 1024).toFixed(2),
      rssMB: (s.rss / 1024 / 1024).toFixed(2)
    }));

    const maxHeap = Math.max(...this.memorySnapshots.map(s => s.heapUsed));
    const minHeap = Math.min(...this.memorySnapshots.map(s => s.heapUsed));
    const avgHeap = this.memorySnapshots.reduce((sum, s) => sum + s.heapUsed, 0) / this.memorySnapshots.length;

    return {
      snapshots,
      stats: {
        maxHeapMB: (maxHeap / 1024 / 1024).toFixed(2),
        minHeapMB: (minHeap / 1024 / 1024).toFixed(2),
        avgHeapMB: (avgHeap / 1024 / 1024).toFixed(2),
        heapGrowth: ((maxHeap - minHeap) / 1024 / 1024).toFixed(2)
      }
    };
  }

  generateIoReport() {
    const sortedIo = this.ioMetrics.sort((a, b) => b.duration - a.duration).slice(0, 50);

    return {
      stats: this.ioStats,
      bytesReadMB: (this.ioStats.totalBytesRead / 1024 / 1024).toFixed(2),
      bytesWrittenMB: (this.ioStats.totalBytesWritten / 1024 / 1024).toFixed(2),
      topOperations: sortedIo.map(io => ({
        operation: io.op,
        durationMs: io.duration,
        bytes: io.bytes,
        error: io.error || null
      }))
    };
  }

  generateFunctionReport() {
    return Array.from(this.functionTiming.entries()).map(([name, timings]) => ({
      name,
      callCount: this.functionCallCount.get(name),
      totalTime: timings.reduce((a, b) => a + b, 0),
      avgTime: timings.reduce((a, b) => a + b, 0) / timings.length,
      minTime: Math.min(...timings),
      maxTime: Math.max(...timings),
      stdDev: this.calculateStdDev(timings)
    })).sort((a, b) => b.totalTime - a.totalTime);
  }

  identifyBottlenecks() {
    const bottlenecks = [];
    const threshold = 100; // ms

    Array.from(this.functionTiming.entries()).forEach(([name, timings]) => {
      const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
      const maxTime = Math.max(...timings);

      if (avgTime > threshold) {
        bottlenecks.push({
          type: 'cpu',
          function: name,
          severity: avgTime > 500 ? 'high' : avgTime > 200 ? 'medium' : 'low',
          avgTime,
          maxTime
        });
      }
    });

    this.ioMetrics.forEach(io => {
      if (io.duration > 50) {
        bottlenecks.push({
          type: 'io',
          operation: io.op,
          severity: io.duration > 200 ? 'high' : 'medium',
          duration: io.duration,
          bytes: io.bytes
        });
      }
    });

    return bottlenecks.sort((a, b) => b.severity === a.severity ?
      (b.avgTime || b.duration) - (a.avgTime || a.duration) :
      (a.severity === 'high' ? -1 : 1));
  }

  calculateStdDev(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Run complete profiling suite
   */
  async run() {
    if (!fs.existsSync(PROFILER_OUTPUT_DIR)) {
      fs.mkdirSync(PROFILER_OUTPUT_DIR, { recursive: true });
    }

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   Matrix Theme Profiler (CPU/IO/Memory)       ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    this.startTime = performance.now();
    this.instrumentIO();

    try {
      // Profile parsing
      const theme = this.profileThemeParsing();

      // Profile operations
      this.profileColorOperations(theme);
      this.profileCssGeneration(theme);
      this.profileAnimations(theme);
      this.profileComponentAnalysis(theme);

      // Generate reports
      this.endTime = performance.now();
      const report = this.generateReport();

      // Save reports
      this.saveReports(report);

      // Display summary
      this.displaySummary(report);

      return report;
    } catch (error) {
      console.error('Profiling error:', error);
      process.exit(1);
    }
  }

  saveReports(report) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    // Save full report
    const reportPath = path.join(PROFILER_OUTPUT_DIR, `matrix-profile-${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n✓ Profile saved: ${reportPath}`);

    // Save flamegraph data
    const flamegraphPath = path.join(PROFILER_OUTPUT_DIR, `matrix-flamegraph-${timestamp}.txt`);
    const flamegraphData = this.formatFlamegraphData();
    fs.writeFileSync(flamegraphPath, flamegraphData);
    console.log(`✓ Flamegraph data saved: ${flamegraphPath}`);

    // Save bottlenecks report
    const bottlenecksPath = path.join(PROFILER_OUTPUT_DIR, `matrix-bottlenecks-${timestamp}.json`);
    fs.writeFileSync(bottlenecksPath, JSON.stringify(report.bottlenecks, null, 2));
    console.log(`✓ Bottlenecks report saved: ${bottlenecksPath}`);
  }

  formatFlamegraphData() {
    const lines = [];

    // CPU flamegraph (Brendan Gregg format)
    lines.push('; CPU Flamegraph Data');
    lines.push('; Generated for Matrix Theme profiling');
    lines.push(';');

    this.functionTiming.forEach((timings, funcName) => {
      const totalSamples = Math.round(timings.reduce((a, b) => a + b, 0));
      lines.push(`main;${funcName} ${totalSamples}`);
    });

    lines.push(';');
    lines.push('; I/O Operations');
    lines.push(';');

    this.ioMetrics.forEach(io => {
      const samples = Math.round(io.duration || 0);
      if (samples > 0) {
        lines.push(`main;io;${io.op} ${samples}`);
      }
    });

    return lines.join('\n');
  }

  displaySummary(report) {
    console.log('\n▶ CPU Report');
    console.log('─'.repeat(50));
    console.log(`Total Time:        ${report.cpu.totalTime.toFixed(2)} ms`);
    console.log(`Functions Tracked: ${report.cpu.functionCount}`);
    console.log('\nTop 5 Functions by CPU Time:');
    report.cpu.topFunctions.slice(0, 5).forEach((fn, i) => {
      console.log(`  ${i + 1}. ${fn.name}`);
      console.log(`     Total: ${fn.totalTime.toFixed(2)}ms | Avg: ${fn.avgTime.toFixed(2)}ms | Calls: ${fn.callCount}`);
    });

    if (report.memory) {
      console.log('\n▶ Memory Report');
      console.log('─'.repeat(50));
      console.log(`Max Heap:   ${report.memory.stats.maxHeapMB} MB`);
      console.log(`Min Heap:   ${report.memory.stats.minHeapMB} MB`);
      console.log(`Avg Heap:   ${report.memory.stats.avgHeapMB} MB`);
      console.log(`Growth:     ${report.memory.stats.heapGrowth} MB`);
    }

    console.log('\n▶ I/O Report');
    console.log('─'.repeat(50));
    console.log(`Total Reads:   ${report.io.stats.reads}`);
    console.log(`Total Writes:  ${report.io.stats.writes}`);
    console.log(`Bytes Read:    ${report.io.bytesReadMB} MB`);
    console.log(`Bytes Written: ${report.io.bytesWrittenMB} MB`);

    if (report.bottlenecks.length > 0) {
      console.log('\n▶ Bottlenecks Detected');
      console.log('─'.repeat(50));
      report.bottlenecks.slice(0, 10).forEach((bn, i) => {
        console.log(`  ${i + 1}. [${bn.severity.toUpperCase()}] ${bn.type}: ${bn.function || bn.operation}`);
        if (bn.avgTime) console.log(`     Avg Time: ${bn.avgTime.toFixed(2)}ms`);
        if (bn.duration) console.log(`     Duration: ${bn.duration.toFixed(2)}ms`);
      });
    }
  }
}

// Main execution
async function main() {
  const profiler = new MatrixThemeProfiler();
  await profiler.run();
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = MatrixThemeProfiler;
