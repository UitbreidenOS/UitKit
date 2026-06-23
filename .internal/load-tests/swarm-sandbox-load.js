#!/usr/bin/env node

/**
 * swarm-sandbox-load.js
 *
 * Comprehensive sandbox capacity load testing
 * - 100 concurrent sandboxes
 * - 500 total agents
 * - Resource exhaustion scenarios
 * - Cleanup latency measurement
 *
 * Usage:
 *   node swarm-sandbox-load.js [--scenarios=all|init|run|cleanup] [--verbose] [--report=json]
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

// Configuration
const LOAD_CONFIG = {
  maxConcurrentSandboxes: 100,
  totalAgents: 500,
  agentsPerSandbox: 5,
  executionTimeoutMs: 30000,
  cleanupTimeoutMs: 10000,
  memoryCheckIntervalMs: 1000,
  metricsInterval: 2000
};

const SANDBOXES_ROOT = path.join(os.homedir(), '.claude', 'load-test-sandboxes');
const RESULTS_DIR = path.join(SANDBOXES_ROOT, 'load-test-results');

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
    rss: Math.round(mem.rss / 1024 / 1024)
  };
}

function formatBytes(bytes) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

// ==============================================================================
// SANDBOX SIMULATION
// ==============================================================================

class SandboxSimulator {
  constructor(name, agentCount) {
    this.name = name;
    this.id = generateId();
    this.agentCount = agentCount;
    this.agents = [];
    this.executions = [];
    this.status = 'created';
    this.createdAt = performance.now();
    this.path = path.join(SANDBOXES_ROOT, name);
    this.initialized = false;
    this.running = false;
    this.cleaned = false;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      try {
        // Create directory structure
        const dirs = [
          this.path,
          path.join(this.path, 'agents'),
          path.join(this.path, 'executions'),
          path.join(this.path, 'logs'),
          path.join(this.path, 'artifacts')
        ];

        dirs.forEach(dir => {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
        });

        // Create manifest
        const manifest = {
          id: this.id,
          name: this.name,
          createdAt: new Date().toISOString(),
          agentCount: this.agentCount,
          status: 'initialized',
          agents: [],
          executions: []
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

        // Save manifest
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

  async execute(duration = 5000) {
    return new Promise((resolve, reject) => {
      try {
        this.running = true;
        this.status = 'executing';
        const startTime = performance.now();

        const executionId = generateId();
        const executionLog = {
          id: executionId,
          sandboxId: this.id,
          startedAt: new Date().toISOString(),
          agentCount: this.agentCount,
          agents: [],
          results: []
        };

        // Simulate agent execution with varying workloads
        this.agents.forEach((agent, idx) => {
          const taskDuration = Math.random() * 2000 + 1000;
          const agentLog = {
            agentId: agent.id,
            status: 'running',
            startedAt: new Date().toISOString(),
            taskDuration,
            output: {
              agentId: agent.id,
              taskId: `task-${idx}`,
              result: {
                analysis: `Analysis from ${agent.id}`,
                confidence: Math.random() * 0.3 + 0.7,
                processingTime: taskDuration
              }
            }
          };

          agentLog.completedAt = new Date().toISOString();
          agentLog.status = 'completed';
          executionLog.agents.push(agentLog);
          executionLog.results.push(agentLog.output);
        });

        executionLog.completedAt = new Date().toISOString();
        executionLog.status = 'completed';
        executionLog.duration = performance.now() - startTime;

        // Save execution log
        const execDir = path.join(this.path, 'executions', executionId);
        fs.mkdirSync(execDir, { recursive: true });
        fs.writeFileSync(
          path.join(execDir, 'execution.json'),
          JSON.stringify(executionLog, null, 2),
          'utf-8'
        );

        this.executions.push(executionLog);
        this.running = false;
        this.status = 'idle';
        resolve(executionLog);
      } catch (error) {
        this.running = false;
        reject(error);
      }
    });
  }

  async cleanup() {
    return new Promise((resolve, reject) => {
      try {
        const startTime = performance.now();

        function removeDir(dirPath) {
          if (!fs.existsSync(dirPath)) return;

          fs.readdirSync(dirPath).forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
              removeDir(filePath);
            } else {
              fs.unlinkSync(filePath);
            }
          });

          fs.rmdirSync(dirPath);
        }

        removeDir(this.path);
        const cleanupDuration = performance.now() - startTime;

        this.cleaned = true;
        this.status = 'cleaned';
        resolve(cleanupDuration);
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
      running: this.running,
      cleaned: this.cleaned,
      executionCount: this.executions.length,
      lifetime: performance.now() - this.createdAt
    };
  }
}

// ==============================================================================
// LOAD TEST SCENARIOS
// ==============================================================================

class LoadTestScenario {
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.sandboxes = [];
    this.results = {
      name,
      startTime: null,
      endTime: null,
      duration: 0,
      metrics: {
        initializationTime: [],
        executionTime: [],
        cleanupTime: [],
        memoryPeak: 0,
        memoryStart: 0,
        memoryEnd: 0,
        successCount: 0,
        failureCount: 0,
        totalAgents: 0,
        concurrentSandboxes: 0
      },
      errors: []
    };
  }

  recordMetric(metricName, value) {
    if (this.results.metrics[metricName] instanceof Array) {
      this.results.metrics[metricName].push(value);
    }
  }

  recordError(error) {
    this.results.errors.push({
      timestamp: new Date().toISOString(),
      message: error.message,
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
        p95: arr[p95Idx],
        p99: arr[p99Idx]
      };
    };

    return {
      initTime: calc(metrics.initializationTime),
      execTime: calc(metrics.executionTime),
      cleanupTime: calc(metrics.cleanupTime),
      memoryPeak: metrics.memoryPeak,
      successRate: ((metrics.successCount / (metrics.successCount + metrics.failureCount)) * 100).toFixed(2) + '%'
    };
  }
}

// ==============================================================================
// INITIALIZATION LOAD TEST
// ==============================================================================

async function testInitialization(config) {
  const scenario = new LoadTestScenario('Initialization', config);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting initialization load test (${config.maxConcurrentSandboxes} sandboxes)...`, 'INFO');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  // Create sandboxes in batches to simulate concurrent initialization
  const batchSize = 20;
  for (let batch = 0; batch < config.maxConcurrentSandboxes; batch += batchSize) {
    const batchEnd = Math.min(batch + batchSize, config.maxConcurrentSandboxes);
    const promises = [];

    for (let i = batch; i < batchEnd; i++) {
      const sandbox = new SandboxSimulator(
        `load-test-init-${i}`,
        config.agentsPerSandbox
      );
      scenario.sandboxes.push(sandbox);

      const initStart = performance.now();
      promises.push(
        sandbox.initialize()
          .then(() => {
            const initDuration = performance.now() - initStart;
            scenario.recordMetric('initializationTime', initDuration);
            scenario.results.metrics.successCount++;
            log(`Sandbox ${i + 1}/${config.maxConcurrentSandboxes} initialized (${Math.round(initDuration)}ms)`, 'DEBUG');
          })
          .catch((error) => {
            scenario.recordError(error);
            scenario.results.metrics.failureCount++;
            log(`Sandbox ${i + 1} initialization failed: ${error.message}`, 'ERROR');
          })
      );
    }

    await Promise.all(promises);
    const currentMem = getMemoryUsage();
    scenario.results.metrics.memoryPeak = Math.max(
      scenario.results.metrics.memoryPeak,
      currentMem.heapUsed
    );

    log(`Batch ${Math.ceil((batchEnd / batchSize))} complete. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}`, 'METRIC');
  }

  scenario.results.metrics.totalAgents = config.maxConcurrentSandboxes * config.agentsPerSandbox;
  scenario.results.metrics.concurrentSandboxes = config.maxConcurrentSandboxes;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Initialization test complete${RESET}`, 'SUCCESS');
  console.log(`${BOLD}Results:${RESET}`);
  const stats = scenario.getStats();
  console.log(`  Init Time (avg/p95/p99): ${stats.initTime.avg}ms / ${stats.initTime.p95}ms / ${stats.initTime.p99}ms`);
  console.log(`  Total Agents: ${scenario.results.metrics.totalAgents}`);
  console.log(`  Memory Start: ${scenario.results.metrics.memoryStart} MB, Peak: ${stats.memoryPeak} MB, End: ${scenario.results.metrics.memoryEnd} MB`);
  console.log(`  Success Rate: ${stats.successRate}`);
  console.log(`  Total Duration: ${(scenario.results.duration / 1000).toFixed(2)}s\n`);

  return scenario;
}

// ==============================================================================
// EXECUTION LOAD TEST
// ==============================================================================

async function testExecution(config) {
  const scenario = new LoadTestScenario('Execution', config);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting execution load test (${config.maxConcurrentSandboxes} sandboxes)...`, 'INFO');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  // Initialize sandboxes first
  for (let i = 0; i < config.maxConcurrentSandboxes; i++) {
    const sandbox = new SandboxSimulator(
      `load-test-exec-${i}`,
      config.agentsPerSandbox
    );
    scenario.sandboxes.push(sandbox);
    await sandbox.initialize();
  }

  log(`All sandboxes initialized. Starting execution phase...`, 'INFO');

  // Execute sandboxes in concurrent batches
  const batchSize = 20;
  for (let batch = 0; batch < config.maxConcurrentSandboxes; batch += batchSize) {
    const batchEnd = Math.min(batch + batchSize, config.maxConcurrentSandboxes);
    const promises = [];

    for (let i = batch; i < batchEnd; i++) {
      const sandbox = scenario.sandboxes[i];
      const execStart = performance.now();

      promises.push(
        sandbox.execute(config.executionTimeoutMs)
          .then(() => {
            const execDuration = performance.now() - execStart;
            scenario.recordMetric('executionTime', execDuration);
            scenario.results.metrics.successCount++;
            log(`Sandbox ${i + 1} execution complete (${Math.round(execDuration)}ms)`, 'DEBUG');
          })
          .catch((error) => {
            scenario.recordError(error);
            scenario.results.metrics.failureCount++;
            log(`Sandbox ${i + 1} execution failed: ${error.message}`, 'ERROR');
          })
      );
    }

    await Promise.all(promises);
    const currentMem = getMemoryUsage();
    scenario.results.metrics.memoryPeak = Math.max(
      scenario.results.metrics.memoryPeak,
      currentMem.heapUsed
    );

    log(`Execution Batch ${Math.ceil((batchEnd / batchSize))} complete. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}`, 'METRIC');
  }

  scenario.results.metrics.totalAgents = config.maxConcurrentSandboxes * config.agentsPerSandbox;
  scenario.results.metrics.concurrentSandboxes = config.maxConcurrentSandboxes;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Execution test complete${RESET}`, 'SUCCESS');
  console.log(`${BOLD}Results:${RESET}`);
  const stats = scenario.getStats();
  console.log(`  Exec Time (avg/p95/p99): ${stats.execTime.avg}ms / ${stats.execTime.p95}ms / ${stats.execTime.p99}ms`);
  console.log(`  Total Agents: ${scenario.results.metrics.totalAgents}`);
  console.log(`  Memory Start: ${scenario.results.metrics.memoryStart} MB, Peak: ${stats.memoryPeak} MB, End: ${scenario.results.metrics.memoryEnd} MB`);
  console.log(`  Success Rate: ${stats.successRate}`);
  console.log(`  Total Duration: ${(scenario.results.duration / 1000).toFixed(2)}s\n`);

  return scenario;
}

// ==============================================================================
// CLEANUP LATENCY TEST
// ==============================================================================

async function testCleanupLatency(config) {
  const scenario = new LoadTestScenario('Cleanup Latency', config);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting cleanup latency test (${config.maxConcurrentSandboxes} sandboxes)...`, 'INFO');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  // Initialize and execute sandboxes
  for (let i = 0; i < config.maxConcurrentSandboxes; i++) {
    const sandbox = new SandboxSimulator(
      `load-test-cleanup-${i}`,
      config.agentsPerSandbox
    );
    scenario.sandboxes.push(sandbox);
    await sandbox.initialize();
    await sandbox.execute();
  }

  log(`All sandboxes created and executed. Starting cleanup phase...`, 'INFO');

  // Cleanup in concurrent batches
  const batchSize = 20;
  for (let batch = 0; batch < config.maxConcurrentSandboxes; batch += batchSize) {
    const batchEnd = Math.min(batch + batchSize, config.maxConcurrentSandboxes);
    const promises = [];

    for (let i = batch; i < batchEnd; i++) {
      const sandbox = scenario.sandboxes[i];
      const cleanupStart = performance.now();

      promises.push(
        sandbox.cleanup()
          .then((cleanupDuration) => {
            scenario.recordMetric('cleanupTime', cleanupDuration);
            scenario.results.metrics.successCount++;
            log(`Sandbox ${i + 1} cleanup complete (${Math.round(cleanupDuration)}ms)`, 'DEBUG');
          })
          .catch((error) => {
            scenario.recordError(error);
            scenario.results.metrics.failureCount++;
            log(`Sandbox ${i + 1} cleanup failed: ${error.message}`, 'ERROR');
          })
      );
    }

    await Promise.all(promises);
    const currentMem = getMemoryUsage();
    scenario.results.metrics.memoryPeak = Math.max(
      scenario.results.metrics.memoryPeak,
      currentMem.heapUsed
    );

    log(`Cleanup Batch ${Math.ceil((batchEnd / batchSize))} complete. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}`, 'METRIC');
  }

  scenario.results.metrics.totalAgents = config.maxConcurrentSandboxes * config.agentsPerSandbox;
  scenario.results.metrics.concurrentSandboxes = config.maxConcurrentSandboxes;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Cleanup test complete${RESET}`, 'SUCCESS');
  console.log(`${BOLD}Results:${RESET}`);
  const stats = scenario.getStats();
  console.log(`  Cleanup Time (avg/p95/p99): ${stats.cleanupTime.avg}ms / ${stats.cleanupTime.p95}ms / ${stats.cleanupTime.p99}ms`);
  console.log(`  Total Agents: ${scenario.results.metrics.totalAgents}`);
  console.log(`  Memory Start: ${scenario.results.metrics.memoryStart} MB, Peak: ${stats.memoryPeak} MB, End: ${scenario.results.metrics.memoryEnd} MB`);
  console.log(`  Success Rate: ${stats.successRate}`);
  console.log(`  Total Duration: ${(scenario.results.duration / 1000).toFixed(2)}s\n`);

  return scenario;
}

// ==============================================================================
// RESOURCE EXHAUSTION TEST
// ==============================================================================

async function testResourceExhaustion(config) {
  const scenario = new LoadTestScenario('Resource Exhaustion', config);
  const initialMem = getMemoryUsage();
  scenario.results.metrics.memoryStart = initialMem.heapUsed;

  log(`Starting resource exhaustion test...`, 'INFO');
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  scenario.results.startTime = new Date().toISOString();
  const testStartTime = performance.now();

  let successCount = 0;
  let failureCount = 0;
  const maxAttempts = config.maxConcurrentSandboxes * 2;

  // Try to create more sandboxes than configured to trigger exhaustion
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const sandbox = new SandboxSimulator(
        `load-test-exhaust-${i}`,
        config.agentsPerSandbox
      );

      const initStart = performance.now();
      await sandbox.initialize();
      const initDuration = performance.now() - initStart;

      scenario.recordMetric('initializationTime', initDuration);
      successCount++;

      // Monitor memory
      const currentMem = getMemoryUsage();
      scenario.results.metrics.memoryPeak = Math.max(
        scenario.results.metrics.memoryPeak,
        currentMem.heapUsed
      );

      if (i % 20 === 0) {
        log(`Created ${i + 1} sandboxes. Memory: ${formatBytes(currentMem.heapUsed * 1024 * 1024)}`, 'METRIC');
      }

      scenario.sandboxes.push(sandbox);

      // Simulate resource limits
      if (currentMem.heapUsed > 2000) {
        log(`Memory threshold exceeded (${currentMem.heapUsed} MB), stopping exhaustion test`, 'WARN');
        break;
      }
    } catch (error) {
      failureCount++;
      scenario.recordError(error);
      log(`Sandbox ${i + 1} creation failed: ${error.message}`, 'WARN');
    }
  }

  scenario.results.metrics.successCount = successCount;
  scenario.results.metrics.failureCount = failureCount;
  scenario.results.metrics.totalAgents = scenario.sandboxes.length * config.agentsPerSandbox;
  scenario.results.metrics.concurrentSandboxes = scenario.sandboxes.length;
  scenario.results.endTime = new Date().toISOString();
  scenario.results.duration = performance.now() - testStartTime;

  const finalMem = getMemoryUsage();
  scenario.results.metrics.memoryEnd = finalMem.heapUsed;

  log(`${GREEN}✓ Exhaustion test complete${RESET}`, 'SUCCESS');
  console.log(`${BOLD}Results:${RESET}`);
  const stats = scenario.getStats();
  console.log(`  Sandboxes Created: ${successCount}`);
  console.log(`  Sandboxes Failed: ${failureCount}`);
  console.log(`  Total Agents: ${scenario.results.metrics.totalAgents}`);
  console.log(`  Memory Start: ${scenario.results.metrics.memoryStart} MB, Peak: ${stats.memoryPeak} MB, End: ${scenario.results.metrics.memoryEnd} MB`);
  console.log(`  Success Rate: ${stats.successRate}`);
  console.log(`  Total Duration: ${(scenario.results.duration / 1000).toFixed(2)}s\n`);

  return scenario;
}

// ==============================================================================
// REPORT GENERATION
// ==============================================================================

function generateReport(scenarios, verbose) {
  const report = {
    timestamp: new Date().toISOString(),
    config: LOAD_CONFIG,
    scenarios: scenarios.map(s => s.results),
    summary: {
      totalDuration: scenarios.reduce((sum, s) => sum + s.results.duration, 0),
      totalAgents: scenarios.reduce((sum, s) => sum + s.results.metrics.totalAgents, 0),
      totalErrors: scenarios.reduce((sum, s) => sum + s.results.errors.length, 0),
      memoryPeak: Math.max(...scenarios.map(s => s.results.metrics.memoryPeak)),
      successRate: (
        (scenarios.reduce((sum, s) => sum + s.results.metrics.successCount, 0) /
        (scenarios.reduce((sum, s) => sum + s.results.metrics.successCount + s.results.metrics.failureCount, 0))) * 100
      ).toFixed(2)
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

  const filename = `load-test-report-${timestamp}.${format}`;
  const filepath = path.join(RESULTS_DIR, filename);

  if (format === 'json') {
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2), 'utf-8');
  } else {
    let content = `# Load Test Report\n\n`;
    content += `Generated: ${report.timestamp}\n\n`;
    content += `## Summary\n`;
    content += `- Total Duration: ${(report.summary.totalDuration / 1000).toFixed(2)}s\n`;
    content += `- Total Agents Tested: ${report.summary.totalAgents}\n`;
    content += `- Total Errors: ${report.summary.totalErrors}\n`;
    content += `- Memory Peak: ${report.summary.memoryPeak} MB\n`;
    content += `- Success Rate: ${report.summary.successRate}%\n\n`;

    content += `## Configuration\n`;
    content += `- Max Concurrent Sandboxes: ${report.config.maxConcurrentSandboxes}\n`;
    content += `- Agents Per Sandbox: ${report.config.agentsPerSandbox}\n`;
    content += `- Total Agents (config): ${report.config.totalAgents}\n\n`;

    content += `## Scenario Results\n`;
    report.scenarios.forEach(scenario => {
      content += `\n### ${scenario.name}\n`;
      content += `- Duration: ${(scenario.duration / 1000).toFixed(2)}s\n`;
      content += `- Success Count: ${scenario.metrics.successCount}\n`;
      content += `- Failure Count: ${scenario.metrics.failureCount}\n`;
      content += `- Memory Peak: ${scenario.metrics.memoryPeak} MB\n`;
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
  const scenarios = new Set(['init', 'run', 'cleanup']);
  const verbose = args.includes('--verbose');
  const reportFormat = args.find(a => a.startsWith('--report='))?.split('=')[1] || 'json';

  // Parse scenario flags
  const scenariosArg = args.find(a => a.startsWith('--scenarios='));
  if (scenariosArg) {
    const value = scenariosArg.split('=')[1];
    if (value === 'all') {
      scenarios.clear();
      scenarios.add('init');
      scenarios.add('run');
      scenarios.add('cleanup');
      scenarios.add('exhaustion');
    } else {
      scenarios.clear();
      value.split(',').forEach(s => scenarios.add(s.trim()));
    }
  }

  console.log(`\n${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║  SWARM SANDBOX LOAD TEST SUITE                              ║${RESET}`);
  console.log(`${BOLD}${CYAN}║  Concurrent Sandbox & Agent Capacity Analysis               ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${RESET}\n`);

  log(`Configuration:`, 'INFO');
  log(`  Max Concurrent Sandboxes: ${LOAD_CONFIG.maxConcurrentSandboxes}`, 'INFO');
  log(`  Total Agents: ${LOAD_CONFIG.totalAgents}`, 'INFO');
  log(`  Agents Per Sandbox: ${LOAD_CONFIG.agentsPerSandbox}`, 'INFO');
  log(`  Scenarios: ${Array.from(scenarios).join(', ')}`, 'INFO');
  log(`  Report Format: ${reportFormat}`, 'INFO');
  log(`  Verbose: ${verbose ? 'YES' : 'NO'}\n`, 'INFO');

  const results = [];

  try {
    if (scenarios.has('init')) {
      const initResults = await testInitialization(LOAD_CONFIG);
      results.push(initResults);
    }

    if (scenarios.has('run')) {
      const runResults = await testExecution(LOAD_CONFIG);
      results.push(runResults);
    }

    if (scenarios.has('cleanup')) {
      const cleanupResults = await testCleanupLatency(LOAD_CONFIG);
      results.push(cleanupResults);
    }

    if (scenarios.has('exhaustion')) {
      const exhaustionResults = await testResourceExhaustion(LOAD_CONFIG);
      results.push(exhaustionResults);
    }

    // Generate and save report
    const report = generateReport(results, verbose);
    const reportPath = saveReport(report, reportFormat);

    console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
    console.log(`${BOLD}${GREEN}✓ Load Testing Complete${RESET}`);
    console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

    console.log(`${BOLD}Overall Summary:${RESET}`);
    console.log(`  Total Test Duration: ${(report.summary.totalDuration / 1000).toFixed(2)}s`);
    console.log(`  Total Agents Tested: ${report.summary.totalAgents}`);
    console.log(`  Total Errors: ${report.summary.totalErrors}`);
    console.log(`  Memory Peak: ${report.summary.memoryPeak} MB`);
    console.log(`  Overall Success Rate: ${report.summary.successRate}%`);
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
