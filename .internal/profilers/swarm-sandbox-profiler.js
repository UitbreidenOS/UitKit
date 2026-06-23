#!/usr/bin/env node

/**
 * swarm-sandbox-profiler.js
 *
 * Profile sandbox operations to identify resource leaks and performance bottlenecks.
 * Measures:
 * - Fork/spawn time (process creation overhead)
 * - IPC overhead (message passing latency)
 * - Cleanup time (process termination & resource release)
 * - Memory usage (heap growth, GC behavior)
 * - File descriptor leaks
 * - CPU usage during operations
 * - Long-running resource stability
 *
 * Usage:
 *   node profilers/swarm-sandbox-profiler.js [--output=json|text] [--iterations=N] [--duration=ms]
 *   node profilers/swarm-sandbox-profiler.js --leak-detection --duration=30000
 *   node profilers/swarm-sandbox-profiler.js --heap-snapshot
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { fork, spawn } = require('child_process');
const { performance, PerformanceObserver } = require('perf_hooks');
const v8 = require('v8');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROFILERS_DIR = path.join(__dirname);
const RESULTS_DIR = path.join(PROFILERS_DIR, 'results');
const DEFAULT_ITERATIONS = 5;
const DEFAULT_DURATION_MS = 10000;
const SAMPLES_INTERVAL_MS = 100;

// Color codes
const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m',
  MAGENTA: '\x1b[35m'
};

// ============================================================================
// UTILITIES
// ============================================================================

function ensureResultsDir() {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
}

function log(msg, level = 'INFO') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  let prefix = `[${timestamp}] `;

  switch (level) {
    case 'ERROR':
      prefix += `${COLORS.RED}[ERROR]${COLORS.RESET}`;
      break;
    case 'SUCCESS':
      prefix += `${COLORS.GREEN}[✓]${COLORS.RESET}`;
      break;
    case 'WARN':
      prefix += `${COLORS.YELLOW}[!]${COLORS.RESET}`;
      break;
    case 'DEBUG':
      prefix += `${COLORS.GRAY}[DEBUG]${COLORS.RESET}`;
      break;
    case 'METRIC':
      prefix += `${COLORS.MAGENTA}[METRIC]${COLORS.RESET}`;
      break;
    default:
      prefix += `${COLORS.CYAN}[INFO]${COLORS.RESET}`;
  }

  console.log(`${prefix} ${msg}`);
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    output: 'text',
    iterations: DEFAULT_ITERATIONS,
    duration: DEFAULT_DURATION_MS,
    leakDetection: false,
    heapSnapshot: false,
    memoryProfile: false,
    cpuProfile: false,
    allTests: false
  };

  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, val] = arg.substring(2).split('=');
      const camelKey = key.replace(/-./g, x => x[1].toUpperCase());
      parsed[camelKey] = val === undefined ? true : val;
    }
  });

  return parsed;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function formatDuration(ms) {
  if (ms < 1) return (ms * 1000).toFixed(2) + ' µs';
  if (ms < 1000) return ms.toFixed(2) + ' ms';
  return (ms / 1000).toFixed(2) + ' s';
}

function stats(values) {
  const sorted = values.sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
  );
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];

  return { min, max, avg, median, stdDev, p95, p99, count: values.length };
}

// ============================================================================
// MEMORY PROFILING
// ============================================================================

class MemoryProfiler {
  constructor() {
    this.samples = [];
    this.startHeapUsed = 0;
    this.peakHeapUsed = 0;
  }

  start() {
    if (global.gc) {
      global.gc();
    }
    this.startHeapUsed = process.memoryUsage().heapUsed;
    this.peakHeapUsed = this.startHeapUsed;
    this.samples = [];
  }

  sample() {
    const usage = process.memoryUsage();
    this.samples.push({
      timestamp: Date.now(),
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss
    });
    this.peakHeapUsed = Math.max(this.peakHeapUsed, usage.heapUsed);
  }

  end() {
    if (global.gc) {
      global.gc();
    }
    const finalHeapUsed = process.memoryUsage().heapUsed;
    return {
      startHeapUsed: this.startHeapUsed,
      finalHeapUsed: finalHeapUsed,
      peakHeapUsed: this.peakHeapUsed,
      heapGrowth: finalHeapUsed - this.startHeapUsed,
      peakGrowth: this.peakHeapUsed - this.startHeapUsed,
      samples: this.samples
    };
  }

  getAveragePeakGrowthRate() {
    if (this.samples.length < 2) return 0;
    const firstSample = this.samples[0];
    const lastSample = this.samples[this.samples.length - 1];
    const timeDiff = lastSample.timestamp - firstSample.timestamp;
    const memDiff = lastSample.heapUsed - firstSample.heapUsed;
    return timeDiff > 0 ? memDiff / timeDiff : 0;
  }
}

// ============================================================================
// FILE DESCRIPTOR PROFILER
// ============================================================================

class FDProfiler {
  constructor() {
    this.startFDs = 0;
    this.peakFDs = 0;
    this.samples = [];
  }

  start() {
    this.startFDs = this.countOpenFDs();
    this.peakFDs = this.startFDs;
    this.samples = [];
  }

  sample() {
    const count = this.countOpenFDs();
    this.samples.push({ timestamp: Date.now(), count });
    this.peakFDs = Math.max(this.peakFDs, count);
  }

  end() {
    const finalFDs = this.countOpenFDs();
    return {
      startFDs: this.startFDs,
      finalFDs: finalFDs,
      peakFDs: this.peakFDs,
      fdLeak: finalFDs - this.startFDs,
      samples: this.samples
    };
  }

  countOpenFDs() {
    try {
      const procPath = `/proc/${process.pid}/fd`;
      if (fs.existsSync(procPath)) {
        return fs.readdirSync(procPath).length;
      }
    } catch (e) {
      // /proc not available on all systems (e.g., macOS)
    }
    return -1; // unavailable
  }
}

// ============================================================================
// FORK/SPAWN PROFILER
// ============================================================================

class ForkSpawnProfiler {
  async profileFork(modulePath, iterations = 5) {
    const results = {
      fork: [],
      ipc: [],
      cleanup: []
    };

    log(`Profiling fork() operations with ${iterations} iterations`, 'DEBUG');

    for (let i = 0; i < iterations; i++) {
      const memProfiler = new MemoryProfiler();
      const fdProfiler = new FDProfiler();

      memProfiler.start();
      fdProfiler.start();

      const forkStart = performance.now();
      const child = fork(modulePath, [], { silent: true });
      const forkEnd = performance.now();

      memProfiler.sample();
      fdProfiler.sample();

      // Profile IPC
      const ipcStart = performance.now();
      let ipcLatency = 0;

      await new Promise((resolve) => {
        child.on('message', () => {
          ipcLatency = performance.now() - ipcStart;
          resolve();
        });
        child.on('error', () => resolve());
        child.on('exit', () => resolve());

        setTimeout(() => resolve(), 1000);

        try {
          child.send({ type: 'ping' });
        } catch (e) {
          resolve();
        }
      });

      memProfiler.sample();

      // Cleanup
      const cleanupStart = performance.now();
      await new Promise((resolve) => {
        child.on('exit', () => resolve());
        child.on('error', () => resolve());
        setTimeout(() => {
          try {
            child.kill();
          } catch (e) {}
          resolve();
        }, 100);
        try {
          child.kill();
        } catch (e) {}
      });
      const cleanupEnd = performance.now();

      memProfiler.sample();
      fdProfiler.sample();

      const memMetrics = memProfiler.end();
      const fdMetrics = fdProfiler.end();

      results.fork.push({
        iteration: i + 1,
        time: forkEnd - forkStart,
        memory: memMetrics,
        fds: fdMetrics
      });

      if (ipcLatency > 0) {
        results.ipc.push({
          iteration: i + 1,
          latency: ipcLatency
        });
      }

      results.cleanup.push({
        iteration: i + 1,
        time: cleanupEnd - cleanupStart,
        fdLeak: fdMetrics.fdLeak
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  async profileSpawn(command, args = [], iterations = 5) {
    const results = {
      spawn: [],
      ipc: [],
      cleanup: []
    };

    log(`Profiling spawn() operations with ${iterations} iterations`, 'DEBUG');

    for (let i = 0; i < iterations; i++) {
      const memProfiler = new MemoryProfiler();
      const fdProfiler = new FDProfiler();

      memProfiler.start();
      fdProfiler.start();

      const spawnStart = performance.now();
      const child = spawn(command, args, { stdio: 'pipe' });
      const spawnEnd = performance.now();

      memProfiler.sample();
      fdProfiler.sample();

      // Cleanup
      const cleanupStart = performance.now();
      await new Promise((resolve) => {
        child.on('exit', () => resolve());
        child.on('error', () => resolve());
        setTimeout(() => {
          try {
            child.kill();
          } catch (e) {}
          resolve();
        }, 100);
        try {
          child.kill();
        } catch (e) {}
      });
      const cleanupEnd = performance.now();

      memProfiler.sample();
      fdProfiler.sample();

      const memMetrics = memProfiler.end();
      const fdMetrics = fdProfiler.end();

      results.spawn.push({
        iteration: i + 1,
        time: spawnEnd - spawnStart,
        memory: memMetrics,
        fds: fdMetrics
      });

      results.cleanup.push({
        iteration: i + 1,
        time: cleanupEnd - cleanupStart,
        fdLeak: fdMetrics.fdLeak
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }
}

// ============================================================================
// LEAK DETECTION PROFILER
// ============================================================================

class LeakDetectionProfiler {
  async profileLeaks(duration = 30000, sampleInterval = 100) {
    log(`Starting leak detection for ${formatDuration(duration)}`, 'DEBUG');

    const memProfiler = new MemoryProfiler();
    const fdProfiler = new FDProfiler();
    const startTime = Date.now();

    memProfiler.start();
    fdProfiler.start();

    const iterations = Math.floor(duration / sampleInterval);
    for (let i = 0; i < iterations; i++) {
      // Simulate sandbox operations
      await this.simulateSandboxOperation();

      if (i % Math.floor(iterations / 10) === 0) {
        memProfiler.sample();
        fdProfiler.sample();
        const elapsed = Date.now() - startTime;
        log(`Leak detection progress: ${(elapsed / duration * 100).toFixed(1)}%`, 'DEBUG');
      }

      await new Promise(resolve => setTimeout(resolve, sampleInterval));
    }

    memProfiler.sample();
    fdProfiler.sample();

    const memMetrics = memProfiler.end();
    const fdMetrics = fdProfiler.end();

    // Analyze for leaks
    const memGrowthRate = memProfiler.getAveragePeakGrowthRate();
    const hasMemoryLeak = memGrowthRate > 100; // 100 bytes/ms = 100KB/s
    const hasFDLeak = fdMetrics.fdLeak > 5; // More than 5 unclosed FDs

    return {
      duration,
      sampleCount: memMetrics.samples.length,
      memory: memMetrics,
      fileDescriptors: fdMetrics,
      leakAnalysis: {
        memoryLeakDetected: hasMemoryLeak,
        memoryGrowthRate: memGrowthRate,
        memoryGrowthPerSec: memGrowthRate * 1000,
        fdLeakDetected: hasFDLeak,
        fdLeakCount: fdMetrics.fdLeak,
        severity: this.calculateLeakSeverity(hasMemoryLeak, hasFDLeak, memGrowthRate, fdMetrics.fdLeak)
      }
    };
  }

  async simulateSandboxOperation() {
    // Simulate a lightweight sandbox operation
    const buf = Buffer.alloc(1024 * 100); // 100KB temporary allocation
    const handled = buf.toString();
    // Allow GC to collect if aggressive
    return handled.length > 0;
  }

  calculateLeakSeverity(memLeak, fdLeak, memGrowthRate, fdCount) {
    let score = 0;
    if (memLeak && memGrowthRate > 1000) score += 3;
    else if (memLeak) score += 1;
    if (fdLeak && fdCount > 20) score += 3;
    else if (fdLeak) score += 1;

    if (score >= 5) return 'CRITICAL';
    if (score >= 3) return 'HIGH';
    if (score >= 1) return 'MEDIUM';
    return 'LOW';
  }
}

// ============================================================================
// CONCURRENCY PROFILER
// ============================================================================

class ConcurrencyProfiler {
  async profileConcurrentForks(count = 10, iterations = 3) {
    log(`Profiling ${count} concurrent fork operations (${iterations} iterations)`, 'DEBUG');

    const results = {
      concurrent: [],
      peaks: {
        memory: [],
        fds: []
      }
    };

    for (let iter = 0; iter < iterations; iter++) {
      const memProfiler = new MemoryProfiler();
      const fdProfiler = new FDProfiler();

      memProfiler.start();
      fdProfiler.start();

      const startTime = performance.now();
      const children = [];

      // Fork all children
      for (let i = 0; i < count; i++) {
        try {
          const child = fork(path.join(__dirname, 'worker-stub.js'), [], { silent: true });
          children.push(child);
        } catch (e) {
          log(`Failed to fork child ${i}: ${e.message}`, 'WARN');
        }
      }

      memProfiler.sample();
      fdProfiler.sample();

      const forkTime = performance.now() - startTime;

      // Wait for all to exit
      await Promise.all(children.map(child => new Promise(resolve => {
        child.on('exit', resolve);
        child.on('error', resolve);
        setTimeout(() => {
          try { child.kill(); } catch (e) {}
          resolve();
        }, 1000);
      })));

      const cleanupStart = performance.now();
      memProfiler.sample();
      fdProfiler.sample();
      const cleanupTime = performance.now() - cleanupStart;

      const memMetrics = memProfiler.end();
      const fdMetrics = fdProfiler.end();

      results.concurrent.push({
        iteration: iter + 1,
        forkCount: count,
        forkTime,
        cleanupTime,
        totalTime: forkTime + cleanupTime,
        memory: memMetrics,
        fds: fdMetrics
      });

      results.peaks.memory.push(memMetrics.peakGrowth);
      results.peaks.fds.push(fdMetrics.peakFDs);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    results.statistics = {
      memory: stats(results.peaks.memory),
      fds: stats(results.peaks.fds)
    };

    return results;
  }
}

// ============================================================================
// TEST UTILITIES
// ============================================================================

async function createWorkerStub() {
  const stubPath = path.join(__dirname, 'worker-stub.js');
  if (!fs.existsSync(stubPath)) {
    fs.writeFileSync(stubPath, `
process.on('message', (msg) => {
  if (msg.type === 'ping') {
    process.send({ type: 'pong' });
  }
});
setTimeout(() => process.exit(0), 5000);
`);
  }
}

// ============================================================================
// REPORTER
// ============================================================================

class Reporter {
  constructor(format = 'text') {
    this.format = format;
    this.results = {};
  }

  reportForkSpawn(label, results) {
    if (this.format === 'text') {
      this.printForkSpawnText(label, results);
    } else {
      this.results[label] = results;
    }
  }

  reportLeaks(label, results) {
    if (this.format === 'text') {
      this.printLeaksText(label, results);
    } else {
      this.results[label] = results;
    }
  }

  reportConcurrency(label, results) {
    if (this.format === 'text') {
      this.printConcurrencyText(label, results);
    } else {
      this.results[label] = results;
    }
  }

  printForkSpawnText(label, results) {
    console.log(`\n${COLORS.BOLD}${label}${COLORS.RESET}`);
    console.log('='.repeat(80));

    if (results.fork && results.fork.length > 0) {
      console.log(`\n${COLORS.BOLD}Fork Performance:${COLORS.RESET}`);
      const forkTimes = results.fork.map(r => r.time);
      const forkStats = stats(forkTimes);
      console.log(`  Time: ${formatDuration(forkStats.avg)} avg, ` +
        `${formatDuration(forkStats.min)}-${formatDuration(forkStats.max)} range`);
      console.log(`  Stddev: ${formatDuration(forkStats.stdDev)}, ` +
        `P95: ${formatDuration(forkStats.p95)}, P99: ${formatDuration(forkStats.p99)}`);
    }

    if (results.ipc && results.ipc.length > 0) {
      console.log(`\n${COLORS.BOLD}IPC Latency:${COLORS.RESET}`);
      const ipcLatencies = results.ipc.map(r => r.latency);
      const ipcStats = stats(ipcLatencies);
      console.log(`  Latency: ${formatDuration(ipcStats.avg)} avg, ` +
        `${formatDuration(ipcStats.min)}-${formatDuration(ipcStats.max)} range`);
    }

    if (results.cleanup && results.cleanup.length > 0) {
      console.log(`\n${COLORS.BOLD}Cleanup Performance:${COLORS.RESET}`);
      const cleanupTimes = results.cleanup.map(r => r.time);
      const cleanupStats = stats(cleanupTimes);
      console.log(`  Time: ${formatDuration(cleanupStats.avg)} avg, ` +
        `${formatDuration(cleanupStats.min)}-${formatDuration(cleanupStats.max)} range`);

      const fdLeaks = results.cleanup.map(r => r.fdLeak).filter(x => x > 0);
      if (fdLeaks.length > 0) {
        console.log(`  ${COLORS.RED}FD Leaks: ${fdLeaks.length}/${results.cleanup.length} iterations${COLORS.RESET}`);
      }
    }
  }

  printLeaksText(label, results) {
    console.log(`\n${COLORS.BOLD}${label}${COLORS.RESET}`);
    console.log('='.repeat(80));

    const leak = results.leakAnalysis;
    console.log(`\n${COLORS.BOLD}Leak Analysis:${COLORS.RESET}`);
    console.log(`  Duration: ${formatDuration(results.duration)}`);
    console.log(`  Samples: ${results.sampleCount}`);
    console.log(`  Severity: ${this.colorize(leak.severity)}`);

    console.log(`\n${COLORS.BOLD}Memory Growth:${COLORS.RESET}`);
    console.log(`  Start: ${formatBytes(results.memory.startHeapUsed)}`);
    console.log(`  Peak: ${formatBytes(results.memory.peakHeapUsed)}`);
    console.log(`  Final: ${formatBytes(results.memory.finalHeapUsed)}`);
    console.log(`  Growth Rate: ${leak.memoryGrowthPerSec.toFixed(2)} bytes/sec`);
    if (leak.memoryLeakDetected) {
      console.log(`  ${COLORS.RED}LEAK DETECTED${COLORS.RESET}`);
    }

    if (results.fileDescriptors.startFDs >= 0) {
      console.log(`\n${COLORS.BOLD}File Descriptors:${COLORS.RESET}`);
      console.log(`  Start: ${results.fileDescriptors.startFDs}`);
      console.log(`  Peak: ${results.fileDescriptors.peakFDs}`);
      console.log(`  Final: ${results.fileDescriptors.finalFDs}`);
      console.log(`  Leak: ${results.fileDescriptors.fdLeak}`);
      if (leak.fdLeakDetected) {
        console.log(`  ${COLORS.RED}LEAK DETECTED${COLORS.RESET}`);
      }
    }
  }

  printConcurrencyText(label, results) {
    console.log(`\n${COLORS.BOLD}${label}${COLORS.RESET}`);
    console.log('='.repeat(80));

    if (results.concurrent && results.concurrent.length > 0) {
      const first = results.concurrent[0];
      console.log(`\nConcurrent fork: ${first.forkCount} children`);
      console.log(`  Fork time: ${formatDuration(stats(results.concurrent.map(r => r.forkTime)).avg)} avg`);
      console.log(`  Cleanup time: ${formatDuration(stats(results.concurrent.map(r => r.cleanupTime)).avg)} avg`);

      console.log(`\n${COLORS.BOLD}Peak Memory Growth:${COLORS.RESET}`);
      const memStats = results.statistics.memory;
      console.log(`  Avg: ${formatBytes(memStats.avg)}, Max: ${formatBytes(memStats.max)}`);

      console.log(`\n${COLORS.BOLD}Peak FDs:${COLORS.RESET}`);
      const fdStats = results.statistics.fds;
      console.log(`  Avg: ${fdStats.avg.toFixed(0)}, Max: ${fdStats.max.toFixed(0)}`);
    }
  }

  colorize(severity) {
    switch (severity) {
      case 'CRITICAL':
        return `${COLORS.RED}${severity}${COLORS.RESET}`;
      case 'HIGH':
        return `${COLORS.YELLOW}${severity}${COLORS.RESET}`;
      case 'MEDIUM':
        return `${COLORS.YELLOW}${severity}${COLORS.RESET}`;
      default:
        return `${COLORS.GREEN}${severity}${COLORS.RESET}`;
    }
  }

  save(filename = 'profile-results.json') {
    ensureResultsDir();
    const filepath = path.join(RESULTS_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(this.results, null, 2));
    log(`Results saved to ${filepath}`, 'SUCCESS');
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = parseArgs();
  ensureResultsDir();

  log(`Swarm Sandbox Profiler v1.0`, 'INFO');
  log(`Format: ${args.output}, Iterations: ${args.iterations}, Duration: ${args.duration}ms`, 'DEBUG');

  await createWorkerStub();

  const reporter = new Reporter(args.output);
  const forkSpawnProfiler = new ForkSpawnProfiler();
  const leakDetectionProfiler = new LeakDetectionProfiler();
  const concurrencyProfiler = new ConcurrencyProfiler();

  try {
    // Fork profiling
    if (args.allTests || args.output === 'text') {
      log(`Starting fork profiling...`, 'INFO');
      const forkResults = await forkSpawnProfiler.profileFork(
        path.join(__dirname, 'worker-stub.js'),
        args.iterations
      );
      reporter.reportForkSpawn('Fork Performance Profile', forkResults);
    }

    // Spawn profiling
    if (args.allTests || args.output === 'text') {
      log(`Starting spawn profiling...`, 'INFO');
      const spawnResults = await forkSpawnProfiler.profileSpawn(
        'node',
        [path.join(__dirname, 'worker-stub.js')],
        args.iterations
      );
      reporter.reportForkSpawn('Spawn Performance Profile', spawnResults);
    }

    // Leak detection
    if (args.leakDetection || args.allTests) {
      log(`Starting leak detection...`, 'INFO');
      const leakResults = await leakDetectionProfiler.profileLeaks(args.duration);
      reporter.reportLeaks('Memory & FD Leak Detection', leakResults);
    }

    // Concurrency profiling
    if (args.allTests) {
      log(`Starting concurrency profiling...`, 'INFO');
      const concurrentResults = await concurrencyProfiler.profileConcurrentForks(10, 3);
      reporter.reportConcurrency('Concurrent Fork Profile', concurrentResults);
    }

    if (args.output === 'json') {
      reporter.save(`profiler-results-${Date.now()}.json`);
    }

    log(`Profiling complete`, 'SUCCESS');
  } catch (error) {
    log(`Profiling failed: ${error.message}`, 'ERROR');
    if (error.stack) {
      log(error.stack, 'DEBUG');
    }
    process.exit(1);
  } finally {
    // Cleanup
    const stubPath = path.join(__dirname, 'worker-stub.js');
    if (fs.existsSync(stubPath)) {
      try {
        fs.unlinkSync(stubPath);
      } catch (e) {}
    }
  }
}

main();
