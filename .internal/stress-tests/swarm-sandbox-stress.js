#!/usr/bin/env node

/**
 * swarm-sandbox-stress.js
 *
 * Stress testing for sandbox swarm infrastructure
 * - 100 concurrent sandboxes under peak load
 * - Resource exhaustion and recovery scenarios
 * - Aggressive cleanup under memory pressure
 * - Failure modes and cascading degradation
 *
 * Usage:
 *   node swarm-sandbox-stress.js [--stress-level=low|medium|high|extreme] [--verbose] [--report=json|md]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { performance } = require('perf_hooks');

// Colors
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[0m';

// Stress Levels Configuration
const STRESS_LEVELS = {
  low: {
    concurrentSandboxes: 50,
    agentsPerSandbox: 3,
    executionDurationMs: 2000,
    memorySpikeSizeKb: 50 * 1024,
    fileCreationMultiplier: 1,
    failureInjectionRate: 0.05,
    cleanupBatchSize: 10,
    cleanupTimeoutMs: 5000
  },
  medium: {
    concurrentSandboxes: 100,
    agentsPerSandbox: 5,
    executionDurationMs: 5000,
    memorySpikeSizeKb: 150 * 1024,
    fileCreationMultiplier: 5,
    failureInjectionRate: 0.1,
    cleanupBatchSize: 20,
    cleanupTimeoutMs: 3000
  },
  high: {
    concurrentSandboxes: 150,
    agentsPerSandbox: 8,
    executionDurationMs: 8000,
    memorySpikeSizeKb: 300 * 1024,
    fileCreationMultiplier: 10,
    failureInjectionRate: 0.15,
    cleanupBatchSize: 30,
    cleanupTimeoutMs: 2000
  },
  extreme: {
    concurrentSandboxes: 200,
    agentsPerSandbox: 10,
    executionDurationMs: 10000,
    memorySpikeSizeKb: 500 * 1024,
    fileCreationMultiplier: 20,
    failureInjectionRate: 0.25,
    cleanupBatchSize: 50,
    cleanupTimeoutMs: 1000
  }
};

const STRESS_ROOT = path.join(os.homedir(), '.claude', 'stress-test-sandboxes');
const RESULTS_DIR = path.join(STRESS_ROOT, 'stress-test-results');

// ==============================================================================
// UTILITIES
// ==============================================================================

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function log(msg, level = 'INFO') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  let prefix = `[${timestamp}] `;

  switch (level) {
    case 'ERROR':
      prefix += `${RED}[ERROR]${RESET}`;
      break;
    case 'SUCCESS':
      prefix += `${GREEN}[✓]${RESET}`;
      break;
    case 'WARN':
      prefix += `${YELLOW}[!]${RESET}`;
      break;
    case 'DEBUG':
      prefix += `${GRAY}[DEBUG]${RESET}`;
      break;
    case 'METRIC':
      prefix += `${MAGENTA}[METRIC]${RESET}`;
      break;
    case 'STRESS':
      prefix += `${RED}[STRESS]${RESET}`;
      break;
    default:
      prefix += `${CYAN}[INFO]${RESET}`;
  }

  console.log(`${prefix} ${msg}`);
}

function getMemoryUsage() {
  const mem = process.memoryUsage();
  return {
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
    external: Math.round(mem.external / 1024 / 1024),
    rss: Math.round(mem.rss / 1024 / 1024),
    timestamp: Date.now()
  };
}

function formatBytes(bytes) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

function shouldInjectFailure(rate) {
  return Math.random() < rate;
}

function allocateMemory(sizeKb) {
  const buffer = Buffer.alloc(sizeKb * 1024, Math.random() * 256);
  return buffer;
}

// ==============================================================================
// STRESS SANDBOX SIMULATOR
// ==============================================================================

class StressSandbox {
  constructor(name, agentCount, stressConfig) {
    this.name = name;
    this.id = generateId();
    this.agentCount = agentCount;
    this.agents = [];
    this.executions = [];
    this.fileHandles = [];
    this.memoryBuffers = [];
    this.status = 'created';
    this.createdAt = performance.now();
    this.path = path.join(STRESS_ROOT, name);
    this.initialized = false;
    this.failed = false;
    this.failureReason = null;
    this.stressConfig = stressConfig;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      try {
        if (shouldInjectFailure(this.stressConfig.failureInjectionRate)) {
          this.failed = true;
          this.failureReason = 'Injected initialization failure';
          throw new Error(this.failureReason);
        }

        const dirs = [
          this.path,
          path.join(this.path, 'agents'),
          path.join(this.path, 'executions'),
          path.join(this.path, 'logs'),
          path.join(this.path, 'artifacts'),
          path.join(this.path, 'temp')
        ];

        dirs.forEach(dir => {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
        });

        const manifest = {
          id: this.id,
          name: this.name,
          createdAt: new Date().toISOString(),
          agentCount: this.agentCount,
          status: 'initialized',
          agents: []
        };

        // Create agent configs
        for (let i = 0; i < this.agentCount; i++) {
          const agentId = `agent-${this.id}-${i}`;
          const agentConfig = {
            id: agentId,
            role: `specialist-${i}`,
            model: 'claude-haiku-4-5-20251001',
            status: 'idle',
            createdAt: new Date().toISOString()
          };

          fs.writeFileSync(
            path.join(this.path, 'agents', `${agentId}.json`),
            JSON.stringify(agentConfig, null, 2),
            'utf-8'
          );

          this.agents.push(agentConfig);
          manifest.agents.push({ id: agentId, status: 'idle' });
        }

        // Create large temp files to simulate artifact storage
        for (let i = 0; i < this.stressConfig.fileCreationMultiplier; i++) {
          const tempFile = path.join(this.path, 'temp', `artifact-${i}.dat`);
          const largeData = Buffer.alloc(100 * 1024, i % 256);
          fs.writeFileSync(tempFile, largeData);
        }

        fs.writeFileSync(
          path.join(this.path, 'sandbox-manifest.json'),
          JSON.stringify(manifest, null, 2),
          'utf-8'
        );

        this.initialized = true;
        this.status = 'initialized';
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async execute() {
    return new Promise((resolve, reject) => {
      try {
        if (this.failed) {
          throw new Error(`Sandbox ${this.name} already failed during initialization`);
        }

        if (shouldInjectFailure(this.stressConfig.failureInjectionRate)) {
          this.failed = true;
          this.failureReason = 'Injected execution failure';
          throw new Error(this.failureReason);
        }

        this.status = 'executing';
        const startTime = performance.now();
        const executionId = generateId();

        // Allocate memory buffers to simulate workload
        try {
          this.memoryBuffers.push(
            allocateMemory(this.stressConfig.memorySpikeSizeKb)
          );
        } catch (e) {
          this.failed = true;
          this.failureReason = `Memory allocation failed: ${e.message}`;
          throw new Error(this.failureReason);
        }

        const executionLog = {
          id: executionId,
          sandboxId: this.id,
          startedAt: new Date().toISOString(),
          agentCount: this.agentCount,
          agents: [],
          results: [],
          memoryUsed: this.memoryBuffers.length * this.stressConfig.memorySpikeSizeKb
        };

        // Simulate agent execution
        this.agents.forEach((agent, idx) => {
          const taskDuration = Math.random() * this.stressConfig.executionDurationMs + 500;
          const agentLog = {
            agentId: agent.id,
            status: 'running',
            taskDuration,
            output: {
              result: `Analysis from ${agent.id}`,
              confidence: Math.random() * 0.3 + 0.7
            }
          };

          agentLog.status = 'completed';
          executionLog.agents.push(agentLog);
          executionLog.results.push(agentLog.output);
        });

        executionLog.completedAt = new Date().toISOString();
        executionLog.status = 'completed';
        executionLog.duration = performance.now() - startTime;

        // Write execution log
        const execDir = path.join(this.path, 'executions', executionId);
        fs.mkdirSync(execDir, { recursive: true });
        fs.writeFileSync(
          path.join(execDir, 'execution.json'),
          JSON.stringify(executionLog, null, 2),
          'utf-8'
        );

        this.executions.push(executionLog);
        this.status = 'idle';
        resolve(executionLog);
      } catch (error) {
        this.failed = true;
        this.failureReason = error.message;
        reject(error);
      }
    });
  }

  async cleanup() {
    return new Promise((resolve, reject) => {
      try {
        const startTime = performance.now();

        // Clear memory buffers
        this.memoryBuffers = [];

        // Force garbage collection simulation
        if (global.gc) {
          global.gc();
        }

        // Recursive directory deletion with timeout protection
        const timeoutId = setTimeout(() => {
          log(`Cleanup timeout for ${this.name}`, 'WARN');
          reject(new Error(`Cleanup timeout exceeded for ${this.name}`));
        }, this.stressConfig.cleanupTimeoutMs);

        try {
          function removeDir(dirPath) {
            if (!fs.existsSync(dirPath)) return;

            fs.readdirSync(dirPath).forEach(file => {
              const filePath = path.join(dirPath, file);
              try {
                if (fs.lstatSync(filePath).isDirectory()) {
                  removeDir(filePath);
                } else {
                  fs.unlinkSync(filePath);
                }
              } catch (e) {
                log(`Failed to remove ${filePath}: ${e.message}`, 'WARN');
              }
            });

            try {
              fs.rmdirSync(dirPath);
            } catch (e) {
              log(`Failed to remove directory ${dirPath}: ${e.message}`, 'WARN');
            }
          }

          removeDir(this.path);
          clearTimeout(timeoutId);

          const cleanupDuration = performance.now() - startTime;
          this.status = 'cleaned';
          resolve(cleanupDuration);
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getStats() {
    return {
      name: this.name,
      id: this.id,
      agentCount: this.agentCount,
      status: this.status,
      initialized: this.initialized,
      failed: this.failed,
      failureReason: this.failureReason,
      executionCount: this.executions.length,
      memoryBuffers: this.memoryBuffers.length,
      lifetime: performance.now() - this.createdAt
    };
  }
}

// ==============================================================================
// STRESS TEST SCENARIOS
// ==============================================================================

class StressTestScenario {
  constructor(name, stressLevel, stressConfig) {
    this.name = name;
    this.stressLevel = stressLevel;
    this.stressConfig = stressConfig;
    this.sandboxes = [];
    this.results = {
      name,
      stressLevel,
      startTime: null,
      endTime: null,
      duration: 0,
      metrics: {
        initializationTimes: [],
        executionTimes: [],
        cleanupTimes: [],
        failureCount: 0,
        successCount: 0,
        timeoutCount: 0,
        memoryPeak: 0,
        memoryStart: 0,
        memoryEnd: 0,
        totalSandboxes: 0,
        cascadingFailures: []
      },
      errors: []
    };
  }

  recordMetric(metricName, value) {
    if (this.results.metrics[metricName] instanceof Array) {
      this.results.metrics[metricName].push(value);
    }
  }

  recordError(error, context = {}) {
    this.results.errors.push({
      timestamp: new Date().toISOString(),
      message: error.message,
      context,
      stack: error.stack
    });
  }

  getStats() {
    const metrics = this.results.metrics;
    const calc = (arr) => {
      if (arr.length === 0) return { min: 0, max: 0, avg: 0, p95: 0, p99: 0 };
      arr.sort((a, b) => a - b);
      const sum = arr.reduce((a, b) => a + b, 0);
      const p95Idx = Math.ceil(arr.length * 0.95) - 1;
      const p99Idx = Math.ceil(arr.length * 0.99) - 1;
      return {
        min: arr[0],
        max: arr[arr.length - 1],
        avg: Math.round(sum / arr.length),
        p95: arr[Math.max(0, p95Idx)],
        p99: arr[Math.max(0, p99Idx)]
      };
    };

    return {
      initTime: calc(metrics.initializationTimes),
      execTime: calc(metrics.executionTimes),
      cleanupTime: calc(metrics.cleanupTimes),
      memoryPeak: metrics.memoryPeak,
      failureRate: (
        (metrics.failureCount / (metrics.failureCount + metrics.successCount)) * 100
      ).toFixed(2) + '%',
      totalFailures: metrics.failureCount,
      totalTimeouts: metrics.timeoutCount
    };
  }
}

// ==============================================================================
// STRESS TEST: INITIALIZATION STORM
// ==============================================================================

async function testInitializationStorm(stressLevel, stressConfig) {
  const scenario = new StressTestScenario('Initialization Storm', stressLevel, stressConfig);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting initialization storm (${stressConfig.concurrentSandboxes} sandboxes, ${stressLevel} stress)...`, 'STRESS');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  const promises = [];
  for (let i = 0; i < stressConfig.concurrentSandboxes; i++) {
    const sandbox = new StressSandbox(
      `stress-init-${i}`,
      stressConfig.agentsPerSandbox,
      stressConfig
    );
    scenario.sandboxes.push(sandbox);

    const initStart = performance.now();
    promises.push(
      sandbox.initialize()
        .then(() => {
          const initDuration = performance.now() - initStart;
          scenario.recordMetric('initializationTimes', initDuration);
          scenario.results.metrics.successCount++;
        })
        .catch((error) => {
          const initDuration = performance.now() - initStart;
          scenario.recordError(error, { sandboxName: sandbox.name });
          scenario.results.metrics.failureCount++;
          if (initDuration > stressConfig.cleanupTimeoutMs * 2) {
            scenario.results.metrics.timeoutCount++;
          }
        })
    );

    if (promises.length % stressConfig.cleanupBatchSize === 0) {
      await Promise.all(promises);
      promises.length = 0;

      const currentMem = getMemoryUsage();
      scenario.results.metrics.memoryPeak = Math.max(
        scenario.results.metrics.memoryPeak,
        currentMem.heapUsed
      );

      log(
        `Batch ${Math.ceil(i / stressConfig.cleanupBatchSize)} complete. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}, Failed: ${scenario.results.metrics.failureCount}`,
        'METRIC'
      );
    }
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  scenario.results.metrics.totalSandboxes = stressConfig.concurrentSandboxes;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Initialization storm complete${RESET}`, 'SUCCESS');
  const stats = scenario.getStats();
  console.log(`  Sandboxes: ${stressConfig.concurrentSandboxes} (${stats.totalFailures} failed)`);
  console.log(`  Init Time: ${stats.initTime.avg}ms avg, ${stats.initTime.p99}ms p99`);
  console.log(`  Memory: Start ${scenario.results.metrics.memoryStart} MB → Peak ${stats.memoryPeak} MB → End ${scenario.results.metrics.memoryEnd} MB`);
  console.log(`  Failure Rate: ${stats.failureRate}\n`);

  return scenario;
}

// ==============================================================================
// STRESS TEST: EXECUTION PRESSURE
// ==============================================================================

async function testExecutionPressure(stressLevel, stressConfig) {
  const scenario = new StressTestScenario('Execution Pressure', stressLevel, stressConfig);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting execution pressure test (${stressConfig.concurrentSandboxes} sandboxes)...`, 'STRESS');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  // Initialize all sandboxes
  for (let i = 0; i < stressConfig.concurrentSandboxes; i++) {
    const sandbox = new StressSandbox(
      `stress-exec-${i}`,
      stressConfig.agentsPerSandbox,
      stressConfig
    );
    scenario.sandboxes.push(sandbox);
    try {
      await sandbox.initialize();
    } catch (e) {
      scenario.recordError(e, { phase: 'initialization', sandbox: i });
    }
  }

  log(`All sandboxes initialized. Starting execution under pressure...`, 'INFO');

  // Execute all sandboxes concurrently
  const promises = [];
  for (let i = 0; i < scenario.sandboxes.length; i++) {
    const sandbox = scenario.sandboxes[i];
    if (sandbox.failed) continue;

    const execStart = performance.now();
    promises.push(
      sandbox.execute()
        .then(() => {
          const execDuration = performance.now() - execStart;
          scenario.recordMetric('executionTimes', execDuration);
          scenario.results.metrics.successCount++;
        })
        .catch((error) => {
          const execDuration = performance.now() - execStart;
          scenario.recordError(error, { sandboxName: sandbox.name });
          scenario.results.metrics.failureCount++;
          scenario.results.metrics.cascadingFailures.push({
            sandbox: sandbox.name,
            reason: error.message
          });
        })
    );

    if (promises.length % (stressConfig.cleanupBatchSize * 2) === 0) {
      await Promise.all(promises);
      promises.length = 0;

      const currentMem = getMemoryUsage();
      scenario.results.metrics.memoryPeak = Math.max(
        scenario.results.metrics.memoryPeak,
        currentMem.heapUsed
      );

      log(
        `Execution batch complete. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}, Failed: ${scenario.results.metrics.failureCount}`,
        'METRIC'
      );
    }
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  scenario.results.metrics.totalSandboxes = stressConfig.concurrentSandboxes;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Execution pressure test complete${RESET}`, 'SUCCESS');
  const stats = scenario.getStats();
  console.log(`  Execution Time: ${stats.execTime.avg}ms avg, ${stats.execTime.p99}ms p99`);
  console.log(`  Memory Peak: ${stats.memoryPeak} MB`);
  console.log(`  Cascading Failures: ${scenario.results.metrics.cascadingFailures.length}`);
  console.log(`  Failure Rate: ${stats.failureRate}\n`);

  return scenario;
}

// ==============================================================================
// STRESS TEST: CLEANUP UNDER PRESSURE
// ==============================================================================

async function testCleanupUnderPressure(stressLevel, stressConfig) {
  const scenario = new StressTestScenario('Cleanup Under Pressure', stressLevel, stressConfig);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting cleanup under pressure (${stressConfig.concurrentSandboxes} sandboxes)...`, 'STRESS');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  // Initialize and execute all sandboxes
  for (let i = 0; i < stressConfig.concurrentSandboxes; i++) {
    const sandbox = new StressSandbox(
      `stress-cleanup-${i}`,
      stressConfig.agentsPerSandbox,
      stressConfig
    );
    scenario.sandboxes.push(sandbox);

    try {
      await sandbox.initialize();
      await sandbox.execute();
    } catch (e) {
      scenario.recordError(e, { phase: 'preparation', sandbox: i });
    }
  }

  log(`Sandboxes prepared. Starting aggressive cleanup...`, 'INFO');

  // Cleanup with tight batches to simulate resource pressure
  const cleanupPromises = [];
  for (let i = 0; i < scenario.sandboxes.length; i++) {
    const sandbox = scenario.sandboxes[i];
    const cleanupStart = performance.now();

    cleanupPromises.push(
      sandbox.cleanup()
        .then((cleanupDuration) => {
          scenario.recordMetric('cleanupTimes', cleanupDuration);
          scenario.results.metrics.successCount++;
        })
        .catch((error) => {
          scenario.recordError(error, { sandboxName: sandbox.name, phase: 'cleanup' });
          scenario.results.metrics.failureCount++;
          scenario.results.metrics.timeoutCount++;
        })
    );

    if (cleanupPromises.length >= stressConfig.cleanupBatchSize) {
      await Promise.all(cleanupPromises);
      cleanupPromises.length = 0;

      const currentMem = getMemoryUsage();
      scenario.results.metrics.memoryPeak = Math.max(
        scenario.results.metrics.memoryPeak,
        currentMem.heapUsed
      );

      log(
        `Cleanup batch complete. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}, Cleaned: ${scenario.results.metrics.successCount}`,
        'METRIC'
      );
    }
  }

  if (cleanupPromises.length > 0) {
    await Promise.all(cleanupPromises);
  }

  scenario.results.metrics.totalSandboxes = stressConfig.concurrentSandboxes;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Cleanup under pressure test complete${RESET}`, 'SUCCESS');
  const stats = scenario.getStats();
  console.log(`  Cleanup Time: ${stats.cleanupTime.avg}ms avg, ${stats.cleanupTime.p99}ms p99`);
  console.log(`  Timeouts: ${stats.totalTimeouts}`);
  console.log(`  Memory Recovery: ${scenario.results.metrics.memoryStart} MB → ${scenario.results.metrics.memoryEnd} MB`);
  console.log(`  Failure Rate: ${stats.failureRate}\n`);

  return scenario;
}

// ==============================================================================
// STRESS TEST: CASCADING FAILURE
// ==============================================================================

async function testCascadingFailure(stressLevel, stressConfig) {
  const scenario = new StressTestScenario('Cascading Failure', stressLevel, stressConfig);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting cascading failure scenario...`, 'STRESS');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  // Create a chain of dependent sandboxes
  let createdSandboxes = 0;
  for (let i = 0; i < stressConfig.concurrentSandboxes; i++) {
    const sandbox = new StressSandbox(
      `stress-cascade-${i}`,
      stressConfig.agentsPerSandbox,
      stressConfig
    );
    scenario.sandboxes.push(sandbox);

    try {
      const initStart = performance.now();
      await sandbox.initialize();
      const initDuration = performance.now() - initStart;
      scenario.recordMetric('initializationTimes', initDuration);

      // Try to execute
      const execStart = performance.now();
      await sandbox.execute();
      const execDuration = performance.now() - execStart;
      scenario.recordMetric('executionTimes', execDuration);

      scenario.results.metrics.successCount++;
      createdSandboxes++;
    } catch (error) {
      scenario.recordError(error, { sandboxId: i, created: createdSandboxes });
      scenario.results.metrics.failureCount++;

      // If failure rate exceeds threshold, stop creating more
      const failureRate = scenario.results.metrics.failureCount /
        (scenario.results.metrics.failureCount + scenario.results.metrics.successCount);

      if (failureRate > 0.3) {
        log(
          `Failure rate exceeded 30% (${(failureRate * 100).toFixed(1)}%). Stopping cascade test at ${createdSandboxes} sandboxes.`,
          'WARN'
        );
        break;
      }
    }

    if ((i + 1) % 20 === 0) {
      const currentMem = getMemoryUsage();
      scenario.results.metrics.memoryPeak = Math.max(
        scenario.results.metrics.memoryPeak,
        currentMem.heapUsed
      );

      log(
        `Created ${createdSandboxes}/${i + 1}. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}, Failures: ${scenario.results.metrics.failureCount}`,
        'METRIC'
      );
    }
  }

  scenario.results.metrics.totalSandboxes = createdSandboxes;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Cascading failure scenario complete${RESET}`, 'SUCCESS');
  const stats = scenario.getStats();
  console.log(`  Sandboxes Created: ${createdSandboxes}`);
  console.log(`  Total Failures: ${stats.totalFailures}`);
  console.log(`  Failure Rate: ${stats.failureRate}`);
  console.log(`  Memory Peak: ${stats.memoryPeak} MB\n`);

  return scenario;
}

// ==============================================================================
// REPORT GENERATION
// ==============================================================================

function generateReport(scenarios) {
  const report = {
    timestamp: new Date().toISOString(),
    stressTests: scenarios.map(s => ({
      name: s.results.name,
      stressLevel: s.stressLevel,
      duration: s.results.duration,
      metrics: s.results.metrics,
      errorCount: s.results.errors.length
    })),
    summary: {
      totalDuration: scenarios.reduce((sum, s) => sum + s.results.duration, 0),
      totalErrors: scenarios.reduce((sum, s) => sum + s.results.errors.length, 0),
      memoryPeak: Math.max(...scenarios.map(s => s.results.metrics.memoryPeak)),
      totalFailures: scenarios.reduce((sum, s) => sum + s.results.metrics.failureCount, 0),
      totalTimeouts: scenarios.reduce((sum, s) => sum + s.results.metrics.timeoutCount, 0)
    }
  };

  return report;
}

function saveReport(report, format = 'json') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '-' +
    Math.random().toString(36).substring(2, 8);

  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const filename = `stress-test-report-${timestamp}.${format}`;
  const filepath = path.join(RESULTS_DIR, filename);

  if (format === 'json') {
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2), 'utf-8');
  } else {
    let content = `# Stress Test Report\n\n`;
    content += `Generated: ${report.timestamp}\n\n`;
    content += `## Summary\n`;
    content += `- Total Duration: ${(report.summary.totalDuration / 1000).toFixed(2)}s\n`;
    content += `- Total Errors: ${report.summary.totalErrors}\n`;
    content += `- Memory Peak: ${report.summary.memoryPeak} MB\n`;
    content += `- Total Failures: ${report.summary.totalFailures}\n`;
    content += `- Total Timeouts: ${report.summary.totalTimeouts}\n\n`;

    content += `## Stress Test Results\n`;
    report.stressTests.forEach(test => {
      content += `\n### ${test.name} (${test.stressLevel})\n`;
      content += `- Duration: ${(test.duration / 1000).toFixed(2)}s\n`;
      content += `- Failures: ${test.metrics.failureCount}\n`;
      content += `- Timeouts: ${test.metrics.timeoutCount}\n`;
      content += `- Memory Peak: ${test.metrics.memoryPeak} MB\n`;
    });

    fs.writeFileSync(filepath, content, 'utf-8');
  }

  return filepath;
}

// ==============================================================================
// MAIN
// ==============================================================================

async function main() {
  const args = process.argv.slice(2);
  const stressLevelArg = args.find(a => a.startsWith('--stress-level='))?.split('=')[1] || 'medium';
  const verbose = args.includes('--verbose');
  const reportFormat = args.find(a => a.startsWith('--report='))?.split('=')[1] || 'json';

  const stressConfig = STRESS_LEVELS[stressLevelArg];
  if (!stressConfig) {
    log(`Invalid stress level: ${stressLevelArg}. Valid options: ${Object.keys(STRESS_LEVELS).join(', ')}`, 'ERROR');
    process.exit(1);
  }

  console.log(`\n${BOLD}${RED}╔════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${RED}║  SWARM SANDBOX STRESS TEST SUITE                             ║${RESET}`);
  console.log(`${BOLD}${RED}║  Resource Exhaustion & Failure Mode Analysis                 ║${RESET}`);
  console.log(`${BOLD}${RED}╚════════════════════════════════════════════════════════════╝${RESET}\n`);

  log(`Stress Level: ${stressLevelArg.toUpperCase()}`, 'INFO');
  log(`  Concurrent Sandboxes: ${stressConfig.concurrentSandboxes}`, 'INFO');
  log(`  Agents Per Sandbox: ${stressConfig.agentsPerSandbox}`, 'INFO');
  log(`  Memory Spike Size: ${stressConfig.memorySpikeSizeKb / 1024}MB`, 'INFO');
  log(`  Failure Injection Rate: ${(stressConfig.failureInjectionRate * 100).toFixed(1)}%`, 'INFO');
  log(`  Cleanup Timeout: ${stressConfig.cleanupTimeoutMs}ms`, 'INFO');
  log(`  Report Format: ${reportFormat}\n`, 'INFO');

  const results = [];

  try {
    const initStorm = await testInitializationStorm(stressLevelArg, stressConfig);
    results.push(initStorm);

    const execPressure = await testExecutionPressure(stressLevelArg, stressConfig);
    results.push(execPressure);

    const cleanupPressure = await testCleanupUnderPressure(stressLevelArg, stressConfig);
    results.push(cleanupPressure);

    const cascade = await testCascadingFailure(stressLevelArg, stressConfig);
    results.push(cascade);

    // Generate and save report
    const report = generateReport(results);
    const reportPath = saveReport(report, reportFormat);

    console.log(`\n${BOLD}${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
    console.log(`${BOLD}${GREEN}✓ Stress Testing Complete${RESET}`);
    console.log(`${BOLD}${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

    console.log(`${BOLD}Overall Summary:${RESET}`);
    console.log(`  Total Duration: ${(report.summary.totalDuration / 1000).toFixed(2)}s`);
    console.log(`  Total Errors: ${report.summary.totalErrors}`);
    console.log(`  Total Failures: ${report.summary.totalFailures}`);
    console.log(`  Total Timeouts: ${report.summary.totalTimeouts}`);
    console.log(`  Memory Peak: ${report.summary.memoryPeak} MB`);
    console.log(`\n${BOLD}Report saved to:${RESET} ${reportPath}\n`);

    if (reportFormat === 'json') {
      console.log(JSON.stringify(report, null, 2));
    }
  } catch (error) {
    console.error(`\n${RED}${BOLD}Fatal Error:${RESET} ${error.message}\n`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`\n${RED}${BOLD}Unhandled Error:${RESET} ${error.message}\n`);
  process.exit(1);
});
