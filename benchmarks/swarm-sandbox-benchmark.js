#!/usr/bin/env node

/**
 * swarm-sandbox-benchmark.js
 *
 * Comprehensive benchmark suite for Swarm Sandbox performance.
 * Measures:
 * - Sandbox creation time
 * - Agent startup time
 * - Isolation overhead
 * - Cleanup time
 * - Various agent topologies (1, 5, 20 agents)
 *
 * Usage:
 *   node benchmarks/swarm-sandbox-benchmark.js [--format=json|text] [--iterations=N] [--topologies=1,5,20]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { performance } = require('perf_hooks');

// ============================================================================
// CONFIGURATION
// ============================================================================

const BENCHMARKS_DIR = path.join(__dirname);
const SANDBOXES_ROOT = path.join(os.homedir(), '.claude', 'swarm-sandboxes-bench');
const RESULTS_FILE = path.join(BENCHMARKS_DIR, 'swarm-sandbox-results.json');

const TOPOLOGIES = [1, 5, 20];
const DEFAULT_ITERATIONS = 3;
const TIMEOUT_MS = 60000;

// Color codes
const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m'
};

// ============================================================================
// UTILITIES
// ============================================================================

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
  const parsed = { flags: {} };

  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, val] = arg.substring(2).split('=');
      parsed.flags[key] = val === undefined ? true : val;
    }
  });

  return parsed;
}

// ============================================================================
// SANDBOX OPERATIONS
// ============================================================================

class SandboxBench {
  constructor(name, agentCount) {
    this.name = name;
    this.agentCount = agentCount;
    this.sandboxPath = path.join(SANDBOXES_ROOT, name);
    this.timings = {};
  }

  createManifest() {
    return {
      id: generateId(),
      name: this.name,
      createdAt: new Date().toISOString(),
      status: 'initialized',
      config: {
        agentCount: this.agentCount,
        timeoutMs: TIMEOUT_MS,
        maxRetries: 3,
        isolationLevel: 'strict'
      },
      agents: Array.from({ length: this.agentCount }, (_, i) => ({
        id: `agent-${i + 1}`,
        role: `specialist-${i + 1}`,
        status: 'idle',
        createdAt: new Date().toISOString()
      })),
      executions: [],
      logs: []
    };
  }

  async benchmarkCreation() {
    const startTime = performance.now();

    // Create directory structure
    const dirs = [
      this.sandboxPath,
      path.join(this.sandboxPath, 'agents'),
      path.join(this.sandboxPath, 'executions'),
      path.join(this.sandboxPath, 'logs'),
      path.join(this.sandboxPath, 'artifacts')
    ];

    dirs.forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
    });

    // Create manifest
    const manifest = this.createManifest();
    fs.writeFileSync(
      path.join(this.sandboxPath, 'sandbox-manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    // Generate agent configs
    manifest.agents.forEach(agent => {
      const agentConfig = {
        id: agent.id,
        role: agent.role,
        model: 'claude-haiku-4-5-20251001',
        capabilities: ['analysis', 'validation', 'coordination'],
        maxTokens: 8000,
        temperature: 0.7
      };

      fs.writeFileSync(
        path.join(this.sandboxPath, 'agents', `${agent.id}.json`),
        JSON.stringify(agentConfig, null, 2),
        'utf-8'
      );
    });

    // Create config file
    const sandboxConfig = {
      version: '1.0.0',
      name: this.name,
      rootPath: this.sandboxPath,
      createdAt: new Date().toISOString(),
      metadata: {
        agentCount: this.agentCount,
        isolation: 'fs-backed',
        persistence: 'json'
      }
    };

    fs.writeFileSync(
      path.join(this.sandboxPath, '.sandboxrc'),
      JSON.stringify(sandboxConfig, null, 2),
      'utf-8'
    );

    const creationTime = performance.now() - startTime;
    this.timings.creation = creationTime;

    return {
      metric: 'sandbox_creation',
      agents: this.agentCount,
      time_ms: creationTime,
      per_agent_ms: creationTime / this.agentCount
    };
  }

  async benchmarkAgentStartup() {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(this.sandboxPath, 'sandbox-manifest.json'), 'utf-8')
    );

    const startupTimes = [];

    for (const agent of manifest.agents) {
      const agentStartTime = performance.now();

      // Simulate agent startup: read config + initialize
      const configPath = path.join(this.sandboxPath, 'agents', `${agent.id}.json`);
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      // Simulate initialization overhead
      await new Promise(resolve => setImmediate(resolve));

      const agentTime = performance.now() - agentStartTime;
      startupTimes.push(agentTime);
    }

    const avgStartupTime = startupTimes.reduce((a, b) => a + b, 0) / startupTimes.length;
    const maxStartupTime = Math.max(...startupTimes);
    const minStartupTime = Math.min(...startupTimes);

    this.timings.agentStartup = {
      avg: avgStartupTime,
      max: maxStartupTime,
      min: minStartupTime
    };

    return {
      metric: 'agent_startup',
      agents: this.agentCount,
      avg_time_ms: avgStartupTime,
      max_time_ms: maxStartupTime,
      min_time_ms: minStartupTime,
      total_startup_ms: startupTimes.reduce((a, b) => a + b, 0)
    };
  }

  async benchmarkIsolationOverhead() {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(this.sandboxPath, 'sandbox-manifest.json'), 'utf-8')
    );

    const overheadMeasurements = [];

    // Measure overhead for each agent execution isolation
    for (const agent of manifest.agents) {
      const executionDir = path.join(this.sandboxPath, 'executions', generateId());
      fs.mkdirSync(executionDir, { recursive: true });

      const overheadStart = performance.now();

      // Create isolated execution context
      const executionContext = {
        executionId: generateId(),
        agentId: agent.id,
        isolationLevel: 'strict',
        startTime: new Date().toISOString(),
        state: {}
      };

      fs.writeFileSync(
        path.join(executionDir, 'context.json'),
        JSON.stringify(executionContext, null, 2),
        'utf-8'
      );

      // Simulate task execution with isolation
      const taskResult = {
        status: 'completed',
        result: { data: 'test output' },
        executionTime: 10
      };

      fs.writeFileSync(
        path.join(executionDir, 'result.json'),
        JSON.stringify(taskResult, null, 2),
        'utf-8'
      );

      const overheadTime = performance.now() - overheadStart;
      overheadMeasurements.push(overheadTime);

      // Cleanup
      fs.unlinkSync(path.join(executionDir, 'context.json'));
      fs.unlinkSync(path.join(executionDir, 'result.json'));
      fs.rmdirSync(executionDir);
    }

    const avgOverhead = overheadMeasurements.reduce((a, b) => a + b, 0) / overheadMeasurements.length;
    const totalOverhead = overheadMeasurements.reduce((a, b) => a + b, 0);

    this.timings.isolationOverhead = {
      avg: avgOverhead,
      total: totalOverhead
    };

    return {
      metric: 'isolation_overhead',
      agents: this.agentCount,
      avg_overhead_ms: avgOverhead,
      total_overhead_ms: totalOverhead,
      overhead_per_agent_ms: avgOverhead
    };
  }

  async benchmarkCleanup() {
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

    removeDir(this.sandboxPath);

    const cleanupTime = performance.now() - startTime;
    this.timings.cleanup = cleanupTime;

    return {
      metric: 'cleanup',
      agents: this.agentCount,
      time_ms: cleanupTime,
      per_agent_ms: cleanupTime / this.agentCount
    };
  }

  async runFullBenchmark() {
    const results = {
      sandbox: this.name,
      agents: this.agentCount,
      timestamp: new Date().toISOString(),
      measurements: []
    };

    try {
      log(`Benchmarking sandbox with ${this.agentCount} agent(s): ${this.name}`, 'INFO');

      // Creation
      const creationResult = await this.benchmarkCreation();
      results.measurements.push(creationResult);
      log(`Creation: ${creationResult.time_ms.toFixed(2)}ms`, 'DEBUG');

      // Agent startup
      const startupResult = await this.benchmarkAgentStartup();
      results.measurements.push(startupResult);
      log(`Agent startup (avg): ${startupResult.avg_time_ms.toFixed(2)}ms`, 'DEBUG');

      // Isolation overhead
      const overheadResult = await this.benchmarkIsolationOverhead();
      results.measurements.push(overheadResult);
      log(`Isolation overhead (avg): ${overheadResult.avg_overhead_ms.toFixed(2)}ms`, 'DEBUG');

      // Cleanup
      const cleanupResult = await this.benchmarkCleanup();
      results.measurements.push(cleanupResult);
      log(`Cleanup: ${cleanupResult.time_ms.toFixed(2)}ms`, 'DEBUG');

      results.status = 'completed';
    } catch (error) {
      log(`Benchmark failed: ${error.message}`, 'ERROR');
      results.status = 'failed';
      results.error = error.message;
    }

    return results;
  }
}

// ============================================================================
// BENCHMARK SUITE
// ============================================================================

async function runBenchmarkSuite(topologies, iterations) {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.RESET}`);
  console.log(`  ${COLORS.BOLD}SWARM SANDBOX BENCHMARK SUITE${COLORS.RESET}`);
  console.log(`  ${COLORS.YELLOW}Measuring performance across multiple topologies...${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}${COLORS.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.RESET}\n`);

  // Create benchmarks root
  if (!fs.existsSync(SANDBOXES_ROOT)) {
    fs.mkdirSync(SANDBOXES_ROOT, { recursive: true });
  }

  const allResults = {
    timestamp: new Date().toISOString(),
    configuration: {
      topologies,
      iterations,
      timeout_ms: TIMEOUT_MS
    },
    suites: []
  };

  // Run benchmarks for each topology
  for (const topology of topologies) {
    console.log(`${COLORS.BOLD}Topology: ${topology} agent(s)${COLORS.RESET}`);
    console.log(`${'─'.repeat(60)}\n`);

    const topologyResults = {
      topology,
      iterations: [],
      summary: {}
    };

    // Run multiple iterations
    for (let iter = 0; iter < iterations; iter++) {
      const sandboxName = `bench-${topology}-agents-iter${iter + 1}-${generateId().slice(0, 8)}`;
      const bench = new SandboxBench(sandboxName, topology);

      const result = await bench.runFullBenchmark();
      topologyResults.iterations.push(result);

      log(`Iteration ${iter + 1}/${iterations} completed`, 'SUCCESS');
    }

    // Calculate summary statistics
    topologyResults.summary = calculateSummaryStats(topologyResults.iterations, topology);
    allResults.suites.push(topologyResults);

    console.log();
  }

  // Cleanup benchmarks root
  if (fs.existsSync(SANDBOXES_ROOT)) {
    const removeDir = (dirPath) => {
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
    };
    removeDir(SANDBOXES_ROOT);
  }

  return allResults;
}

function calculateSummaryStats(iterations, topology) {
  const summary = {
    topology,
    iterations: iterations.length,
    completed: iterations.filter(i => i.status === 'completed').length,
    failed: iterations.filter(i => i.status === 'failed').length,
    metrics: {}
  };

  const metricNames = ['sandbox_creation', 'agent_startup', 'isolation_overhead', 'cleanup'];

  metricNames.forEach(metricName => {
    const values = [];

    iterations.forEach(iter => {
      const measurement = iter.measurements.find(m => m.metric === metricName);
      if (measurement) {
        if (metricName === 'agent_startup') {
          values.push(measurement.avg_time_ms);
        } else if (metricName === 'isolation_overhead') {
          values.push(measurement.avg_overhead_ms);
        } else {
          values.push(measurement.time_ms);
        }
      }
    });

    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const stdDev = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
      );

      summary.metrics[metricName] = {
        avg_ms: avg,
        min_ms: min,
        max_ms: max,
        stddev_ms: stdDev
      };
    }
  });

  return summary;
}

// ============================================================================
// OUTPUT & REPORTING
// ============================================================================

function formatResults(results, format) {
  if (format === 'json') {
    return JSON.stringify(results, null, 2);
  }

  // Text format
  let output = `\n${COLORS.BOLD}BENCHMARK RESULTS${COLORS.RESET}\n`;
  output += `Generated: ${results.timestamp}\n\n`;

  results.suites.forEach(suite => {
    output += `${COLORS.BOLD}Topology: ${suite.topology} agent(s)${COLORS.RESET}\n`;
    output += `Iterations: ${suite.summary.iterations} (${suite.summary.completed} completed, ${suite.summary.failed} failed)\n\n`;

    if (suite.summary.metrics) {
      output += `${COLORS.BOLD}Metrics:${COLORS.RESET}\n`;
      output += `┌─────────────────────────────────────────────────────────┐\n`;

      Object.entries(suite.summary.metrics).forEach(([metricName, values]) => {
        const formatName = metricName.replace(/_/g, ' ').toUpperCase();
        output += `│ ${COLORS.CYAN}${formatName}${COLORS.RESET}\n`;
        output += `│   Average:     ${values.avg_ms.toFixed(3)}ms\n`;
        output += `│   Min:         ${values.min_ms.toFixed(3)}ms\n`;
        output += `│   Max:         ${values.max_ms.toFixed(3)}ms\n`;
        output += `│   Std Dev:     ${values.stddev_ms.toFixed(3)}ms\n`;
        output += `│\n`;
      });

      output += `└─────────────────────────────────────────────────────────┘\n\n`;
    }
  });

  return output;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  try {
    const { flags } = parseArgs();
    const format = flags.format || 'text';
    const iterations = parseInt(flags.iterations || String(DEFAULT_ITERATIONS), 10);
    const topologiesStr = flags.topologies || TOPOLOGIES.join(',');
    const topologies = topologiesStr.split(',').map(t => parseInt(t, 10));

    log(`Format: ${format}`, 'INFO');
    log(`Iterations: ${iterations}`, 'INFO');
    log(`Topologies: ${topologies.join(', ')} agent(s)`, 'INFO');

    const results = await runBenchmarkSuite(topologies, iterations);

    // Save results
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), 'utf-8');
    log(`Results saved: ${RESULTS_FILE}`, 'SUCCESS');

    // Output results
    const formatted = formatResults(results, format);
    console.log(formatted);

    if (format === 'json') {
      console.log(JSON.stringify(results, null, 2));
    }
  } catch (error) {
    log(`Benchmark suite failed: ${error.message}`, 'ERROR');
    console.error(error);
    process.exit(1);
  }
}

main();
