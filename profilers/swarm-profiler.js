#!/usr/bin/env node

/**
 * swarm-profiler.js
 *
 * Profile multi-agent performance to identify bottlenecks and optimize agent swarm coordination.
 * Measures:
 * - Agent startup time (initialization overhead)
 * - Message latency (inter-agent communication delay)
 * - Message throughput (messages per second)
 * - Resource consumption per agent (memory, CPU, file descriptors)
 * - Communication overhead (serialization, network stack)
 * - Agent lifecycle overhead (spawn, message routing, cleanup)
 * - Concurrency limits and degradation patterns
 * - Message queue depth and processing lag
 * - System-wide bottleneck identification
 *
 * Usage:
 *   node profilers/swarm-profiler.js [--agents=N] [--messages=N] [--duration=ms]
 *   node profilers/swarm-profiler.js --scenario=stress --output=json
 *   node profilers/swarm-profiler.js --analyze=path/to/results.json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker } = require('worker_threads');
const { performance, PerformanceObserver } = require('perf_hooks');
const v8 = require('v8');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROFILERS_DIR = path.join(__dirname);
const RESULTS_DIR = path.join(PROFILERS_DIR, 'results');
const DEFAULT_AGENTS = 5;
const DEFAULT_MESSAGES = 1000;
const DEFAULT_DURATION_MS = 30000;

// ANSI color codes
const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m',
  MAGENTA: '\x1b[35m',
  BLUE: '\x1b[34m'
};

// ============================================================================
// AGENT WORKER CODE
// ============================================================================

const AGENT_WORKER_CODE = `
const { parentPort } = require('worker_threads');
const { performance } = require('perf_hooks');

class Agent {
  constructor(id) {
    this.id = id;
    this.messageCount = 0;
    this.totalProcessingTime = 0;
    this.createdAt = performance.now();
    this.state = {};
  }

  processMessage(msg) {
    const startTime = performance.now();

    // Simulate work based on message type
    switch (msg.type) {
      case 'compute':
        this.state.lastCompute = msg.payload;
        this.doCompute(msg.payload.iterations || 100);
        break;
      case 'io':
        this.state.lastIO = msg.payload;
        this.doIO(msg.payload.delay || 10);
        break;
      case 'query':
        this.state.query = msg.payload;
        break;
      default:
        this.state.lastMessage = msg.payload;
    }

    const duration = performance.now() - startTime;
    this.messageCount++;
    this.totalProcessingTime += duration;

    return {
      agentId: this.id,
      messageId: msg.id,
      processed: true,
      processingTime: duration,
      messageCount: this.messageCount
    };
  }

  doCompute(iterations) {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
    return result;
  }

  doIO(delayMs) {
    const start = Date.now();
    while (Date.now() - start < delayMs) {
      // Busy wait
    }
  }

  getStats() {
    return {
      id: this.id,
      messageCount: this.messageCount,
      avgProcessingTime: this.messageCount > 0
        ? this.totalProcessingTime / this.messageCount
        : 0,
      totalTime: performance.now() - this.createdAt,
      uptime: performance.now() - this.createdAt
    };
  }
}

const agent = new Agent(require('worker_threads').threadId);

parentPort.on('message', (msg) => {
  try {
    const result = agent.processMessage(msg);
    parentPort.postMessage({
      type: 'result',
      data: result,
      timestamp: performance.now()
    });
  } catch (err) {
    parentPort.postMessage({
      type: 'error',
      error: err.message,
      timestamp: performance.now()
    });
  }
});

parentPort.on('exit', () => {
  process.exit(0);
});
`;

// ============================================================================
// UTILITY FUNCTIONS
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
    case 'AGENT':
      prefix += `${COLORS.BLUE}[AGENT]${COLORS.RESET}`;
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
    agents: DEFAULT_AGENTS,
    messages: DEFAULT_MESSAGES,
    duration: DEFAULT_DURATION_MS,
    scenario: 'standard',
    output: 'text',
    analyze: null,
    verbose: false
  };

  for (const arg of args) {
    if (arg.startsWith('--agents=')) {
      parsed.agents = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--messages=')) {
      parsed.messages = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--duration=')) {
      parsed.duration = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--scenario=')) {
      parsed.scenario = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      parsed.output = arg.split('=')[1];
    } else if (arg.startsWith('--analyze=')) {
      parsed.analyze = arg.split('=')[1];
    } else if (arg === '--verbose') {
      parsed.verbose = true;
    }
  }

  return parsed;
}

function calculateStats(values) {
  if (values.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0, p95: 0, p99: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const len = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);

  return {
    min: sorted[0],
    max: sorted[len - 1],
    mean: sum / len,
    median: sorted[Math.floor(len / 2)],
    p95: sorted[Math.floor(len * 0.95)],
    p99: sorted[Math.floor(len * 0.99)],
    stdDev: calculateStdDev(sorted, sum / len)
  };
}

function calculateStdDev(values, mean) {
  if (values.length < 2) return 0;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function getMemoryStats() {
  if (global.gc) {
    global.gc();
  }
  const mem = process.memoryUsage();
  return {
    rss: mem.rss,
    heapTotal: mem.heapTotal,
    heapUsed: mem.heapUsed,
    external: mem.external
  };
}

// ============================================================================
// SWARM PROFILER CLASS
// ============================================================================

class SwarmProfiler {
  constructor(options = {}) {
    this.options = {
      agents: DEFAULT_AGENTS,
      messages: DEFAULT_MESSAGES,
      duration: DEFAULT_DURATION_MS,
      scenario: 'standard',
      verbose: false,
      ...options
    };

    this.workers = [];
    this.metrics = {
      startupTimes: [],
      messageTimes: [],
      messageLatencies: [],
      queueDepths: [],
      resourceUsage: [],
      errors: [],
      messages: []
    };
    this.running = false;
    this.startTime = null;
    this.memoryBefore = null;
  }

  async initialize() {
    log(`Initializing swarm with ${this.options.agents} agents...`);
    this.memoryBefore = getMemoryStats();
    this.startTime = performance.now();

    for (let i = 0; i < this.options.agents; i++) {
      const workerStartTime = performance.now();

      try {
        const worker = new Worker(AGENT_WORKER_CODE, { eval: true });
        const startupTime = performance.now() - workerStartTime;

        this.metrics.startupTimes.push(startupTime);
        this.workers.push({
          id: i,
          worker,
          messageCount: 0,
          lastMessageTime: 0,
          processingTimes: []
        });

        if (this.options.verbose) {
          log(`Agent ${i} started in ${startupTime.toFixed(2)}ms`, 'AGENT');
        }
      } catch (err) {
        log(`Failed to create agent ${i}: ${err.message}`, 'ERROR');
        this.metrics.errors.push({
          type: 'startup',
          agentId: i,
          error: err.message
        });
      }
    }

    log(`Initialized ${this.workers.length}/${this.options.agents} agents`, 'SUCCESS');
  }

  async sendMessage(workerIndex, message) {
    const worker = this.workers[workerIndex];
    if (!worker) return null;

    const sendTime = performance.now();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message timeout'));
      }, 5000);

      const handler = (msg) => {
        clearTimeout(timeout);
        worker.worker.off('message', handler);

        const receiveTime = performance.now();
        const latency = receiveTime - sendTime;

        this.metrics.messageLatencies.push(latency);
        worker.lastMessageTime = receiveTime;
        worker.messageCount++;

        if (msg.type === 'result') {
          worker.processingTimes.push(msg.data.processingTime);
        }

        resolve({
          ...msg,
          latency,
          queueDepth: this.metrics.messages.length
        });
      };

      worker.worker.on('message', handler);
      worker.worker.postMessage(message);

      this.metrics.messages.push({
        agentId: workerIndex,
        messageId: message.id,
        type: message.type,
        sentAt: sendTime
      });
    });
  }

  async runBenchmark() {
    log(`Running ${this.options.scenario} scenario...`);
    this.running = true;

    const scenarios = {
      standard: () => this.runStandardScenario(),
      stress: () => this.runStressScenario(),
      latency: () => this.runLatencyScenario(),
      throughput: () => this.runThroughputScenario(),
      degradation: () => this.runDegradationScenario()
    };

    const scenario = scenarios[this.options.scenario] || scenarios.standard;
    await scenario.call(this);
  }

  async runStandardScenario() {
    // Steady load: distribute messages evenly across agents
    const messagesPerAgent = Math.floor(this.options.messages / this.options.agents);
    const promises = [];

    for (let i = 0; i < this.options.agents; i++) {
      for (let j = 0; j < messagesPerAgent; j++) {
        const promise = this.sendMessage(i, {
          id: generateId(),
          type: ['compute', 'io', 'query'][Math.floor(Math.random() * 3)],
          payload: {
            iterations: Math.floor(Math.random() * 1000),
            delay: Math.floor(Math.random() * 50)
          }
        }).catch(err => {
          this.metrics.errors.push({
            type: 'message',
            agentId: i,
            error: err.message
          });
        });

        promises.push(promise);

        // Stagger messages slightly
        if ((i * messagesPerAgent + j) % 100 === 0) {
          await new Promise(r => setImmediate(r));
        }
      }
    }

    await Promise.all(promises);
  }

  async runStressScenario() {
    // Burst: send many messages rapidly
    const messagesPerAgent = Math.floor(this.options.messages / this.options.agents);
    const promises = [];

    for (let i = 0; i < this.options.agents; i++) {
      for (let j = 0; j < messagesPerAgent; j++) {
        const promise = this.sendMessage(i, {
          id: generateId(),
          type: 'compute',
          payload: { iterations: 10000 }
        }).catch(err => {
          this.metrics.errors.push({
            type: 'message',
            agentId: i,
            error: err.message
          });
        });

        promises.push(promise);
      }
    }

    await Promise.all(promises);
  }

  async runLatencyScenario() {
    // Latency-sensitive: measure response times with minimal load
    const iterations = Math.min(this.options.messages, 500);
    const results = [];

    for (let i = 0; i < iterations; i++) {
      const agentIdx = i % this.options.agents;
      const result = await this.sendMessage(agentIdx, {
        id: generateId(),
        type: 'query',
        payload: { delay: 1 }
      }).catch(err => {
        this.metrics.errors.push({
          type: 'message',
          agentId: agentIdx,
          error: err.message
        });
      });

      results.push(result);

      if ((i + 1) % 50 === 0) {
        log(`Latency test: ${i + 1}/${iterations} messages`, 'DEBUG');
      }
    }

    return results;
  }

  async runThroughputScenario() {
    // Throughput-optimized: maximum messages per second
    const startTime = performance.now();
    const promises = [];
    let messagesSent = 0;

    while (messagesSent < this.options.messages) {
      for (let i = 0; i < this.options.agents && messagesSent < this.options.messages; i++) {
        const promise = this.sendMessage(i, {
          id: generateId(),
          type: 'compute',
          payload: { iterations: 100 }
        }).catch(err => {
          this.metrics.errors.push({
            type: 'message',
            agentId: i,
            error: err.message
          });
        });

        promises.push(promise);
        messagesSent++;
      }

      // Don't wait, let them queue
      if (messagesSent % 1000 === 0) {
        await Promise.race(promises.slice(-this.options.agents));
      }
    }

    await Promise.all(promises);
    const throughputTime = performance.now() - startTime;
    return { messagesSent, throughputTime };
  }

  async runDegradationScenario() {
    // Degradation analysis: gradually increase load
    const phases = [100, 200, 500, 1000];
    const results = [];

    for (const phaseSize of phases) {
      log(`Degradation phase: ${phaseSize} messages`, 'DEBUG');
      const phaseStart = performance.now();
      const promises = [];

      for (let i = 0; i < phaseSize; i++) {
        const agentIdx = i % this.options.agents;
        const promise = this.sendMessage(agentIdx, {
          id: generateId(),
          type: 'compute',
          payload: { iterations: 1000 }
        }).catch(err => {
          this.metrics.errors.push({
            type: 'message',
            agentId: agentIdx,
            error: err.message
          });
        });

        promises.push(promise);
      }

      await Promise.all(promises);
      const phaseDuration = performance.now() - phaseStart;

      results.push({
        phase: phaseSize,
        duration: phaseDuration,
        messagesPerSecond: (phaseSize / phaseDuration) * 1000
      });
    }

    return results;
  }

  async collectMetrics() {
    // Collect per-agent metrics
    const agentMetrics = this.workers.map((worker, idx) => ({
      id: idx,
      messageCount: worker.messageCount,
      avgProcessingTime: worker.processingTimes.length > 0
        ? worker.processingTimes.reduce((a, b) => a + b, 0) / worker.processingTimes.length
        : 0,
      processingTimeStats: calculateStats(worker.processingTimes)
    }));

    const messageLatencyStats = calculateStats(this.metrics.messageLatencies);
    const startupStats = calculateStats(this.metrics.startupTimes);

    const memoryAfter = getMemoryStats();
    const memoryDelta = {
      heapUsed: memoryAfter.heapUsed - this.memoryBefore.heapUsed,
      heapTotal: memoryAfter.heapTotal - this.memoryBefore.heapTotal,
      rss: memoryAfter.rss - this.memoryBefore.rss
    };

    const totalDuration = performance.now() - this.startTime;
    const messagesPerSecond = (this.metrics.messages.length / totalDuration) * 1000;

    return {
      duration: totalDuration,
      agentCount: this.options.agents,
      messageCount: this.metrics.messages.length,
      messagesPerSecond,
      successRate: ((this.metrics.messages.length - this.metrics.errors.length) /
                    this.metrics.messages.length * 100).toFixed(2),

      startupMetrics: {
        count: this.metrics.startupTimes.length,
        ...startupStats
      },

      messageLatency: {
        count: this.metrics.messageLatencies.length,
        ...messageLatencyStats
      },

      agentMetrics,

      memory: {
        before: this.memoryBefore,
        after: memoryAfter,
        delta: memoryDelta
      },

      errors: {
        count: this.metrics.errors.length,
        byType: this.metrics.errors.reduce((acc, err) => {
          acc[err.type] = (acc[err.type] || 0) + 1;
          return acc;
        }, {})
      }
    };
  }

  async cleanup() {
    log('Cleaning up agents...');
    const cleanupStart = performance.now();

    for (const worker of this.workers) {
      try {
        await worker.worker.terminate();
      } catch (err) {
        log(`Error terminating worker ${worker.id}: ${err.message}`, 'WARN');
      }
    }

    const cleanupTime = performance.now() - cleanupStart;
    log(`Cleanup completed in ${cleanupTime.toFixed(2)}ms`, 'SUCCESS');

    return cleanupTime;
  }

  async run() {
    try {
      await this.initialize();
      await this.runBenchmark();
      const metrics = await this.collectMetrics();
      await this.cleanup();
      return metrics;
    } catch (err) {
      log(`Profiler error: ${err.message}`, 'ERROR');
      await this.cleanup();
      throw err;
    }
  }
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateReport(metrics, scenario) {
  const report = {
    timestamp: new Date().toISOString(),
    scenario,
    summary: {
      totalDuration: `${metrics.duration.toFixed(2)}ms`,
      agentCount: metrics.agentCount,
      messageCount: metrics.messageCount,
      messagesPerSecond: metrics.messagesPerSecond.toFixed(2),
      successRate: `${metrics.successRate}%`,
      errorCount: metrics.errors.count
    },

    performance: {
      startup: {
        count: metrics.startupMetrics.count,
        mean: `${metrics.startupMetrics.mean.toFixed(2)}ms`,
        min: `${metrics.startupMetrics.min.toFixed(2)}ms`,
        max: `${metrics.startupMetrics.max.toFixed(2)}ms`,
        p95: `${metrics.startupMetrics.p95.toFixed(2)}ms`,
        p99: `${metrics.startupMetrics.p99.toFixed(2)}ms`
      },

      messageLatency: {
        count: metrics.messageLatency.count,
        mean: `${metrics.messageLatency.mean.toFixed(2)}ms`,
        min: `${metrics.messageLatency.min.toFixed(2)}ms`,
        max: `${metrics.messageLatency.max.toFixed(2)}ms`,
        p95: `${metrics.messageLatency.p95.toFixed(2)}ms`,
        p99: `${metrics.messageLatency.p99.toFixed(2)}ms`,
        stdDev: `${metrics.messageLatency.stdDev.toFixed(2)}ms`
      }
    },

    memory: {
      heapUsedDelta: `${(metrics.memory.delta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      rssDelta: `${(metrics.memory.delta.rss / 1024 / 1024).toFixed(2)}MB`,
      before: {
        heapUsed: `${(metrics.memory.before.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        rss: `${(metrics.memory.before.rss / 1024 / 1024).toFixed(2)}MB`
      },
      after: {
        heapUsed: `${(metrics.memory.after.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        rss: `${(metrics.memory.after.rss / 1024 / 1024).toFixed(2)}MB`
      }
    },

    agentPerformance: metrics.agentMetrics.map(agent => ({
      agentId: agent.id,
      messageCount: agent.messageCount,
      avgProcessingTime: `${agent.avgProcessingTime.toFixed(2)}ms`,
      processingTime: {
        min: `${agent.processingTimeStats.min.toFixed(2)}ms`,
        max: `${agent.processingTimeStats.max.toFixed(2)}ms`,
        mean: `${agent.processingTimeStats.mean.toFixed(2)}ms`,
        p95: `${agent.processingTimeStats.p95.toFixed(2)}ms`
      }
    })),

    errors: {
      count: metrics.errors.count,
      byType: metrics.errors.byType
    },

    bottlenecks: identifyBottlenecks(metrics)
  };

  return report;
}

function identifyBottlenecks(metrics) {
  const bottlenecks = [];

  // High startup overhead
  if (metrics.startupMetrics.mean > 10) {
    bottlenecks.push({
      severity: 'high',
      category: 'Agent Startup',
      issue: `High average startup time: ${metrics.startupMetrics.mean.toFixed(2)}ms`,
      recommendation: 'Optimize agent initialization or reduce agent count'
    });
  }

  // High message latency
  if (metrics.messageLatency.mean > 50) {
    bottlenecks.push({
      severity: 'high',
      category: 'Message Latency',
      issue: `High average message latency: ${metrics.messageLatency.mean.toFixed(2)}ms`,
      recommendation: 'Check inter-agent communication, reduce payload size, or optimize serialization'
    });
  }

  // High latency variance
  if (metrics.messageLatency.stdDev > metrics.messageLatency.mean * 0.5) {
    bottlenecks.push({
      severity: 'medium',
      category: 'Latency Variance',
      issue: `High latency variance: ${metrics.messageLatency.stdDev.toFixed(2)}ms stdDev`,
      recommendation: 'Investigate inconsistent message processing or scheduling issues'
    });
  }

  // Memory growth
  if (metrics.memory.delta.heapUsed > 50000000) {
    bottlenecks.push({
      severity: 'medium',
      category: 'Memory Growth',
      issue: `Significant heap growth: ${(metrics.memory.delta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      recommendation: 'Check for memory leaks in agent lifecycle or message queues'
    });
  }

  // Error rate
  if (metrics.errors.count > metrics.messageCount * 0.01) {
    bottlenecks.push({
      severity: 'high',
      category: 'Error Rate',
      issue: `Error rate: ${(metrics.errors.count / metrics.messageCount * 100).toFixed(2)}%`,
      recommendation: 'Investigate timeout issues or resource exhaustion'
    });
  }

  // Agent imbalance
  const messageCountStats = calculateStats(metrics.agentMetrics.map(a => a.messageCount));
  if (messageCountStats.stdDev > messageCountStats.mean * 0.3) {
    bottlenecks.push({
      severity: 'medium',
      category: 'Load Imbalance',
      issue: `Uneven load distribution: ${messageCountStats.stdDev.toFixed(0)} stdDev`,
      recommendation: 'Implement better load balancing across agents'
    });
  }

  return bottlenecks;
}

function formatTextReport(report) {
  let output = '';
  output += `\n${COLORS.BOLD}=== SWARM PROFILER REPORT ===${COLORS.RESET}\n`;
  output += `${COLORS.CYAN}Timestamp: ${report.timestamp}${COLORS.RESET}\n`;
  output += `${COLORS.CYAN}Scenario: ${report.scenario}${COLORS.RESET}\n\n`;

  // Summary
  output += `${COLORS.BOLD}SUMMARY${COLORS.RESET}\n`;
  output += `${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}\n`;
  for (const [key, value] of Object.entries(report.summary)) {
    output += `${key}: ${COLORS.GREEN}${value}${COLORS.RESET}\n`;
  }

  // Performance
  output += `\n${COLORS.BOLD}PERFORMANCE${COLORS.RESET}\n`;
  output += `${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}\n`;

  output += `${COLORS.CYAN}Agent Startup:${COLORS.RESET}\n`;
  for (const [key, value] of Object.entries(report.performance.startup)) {
    output += `  ${key}: ${value}\n`;
  }

  output += `\n${COLORS.CYAN}Message Latency:${COLORS.RESET}\n`;
  for (const [key, value] of Object.entries(report.performance.messageLatency)) {
    output += `  ${key}: ${value}\n`;
  }

  // Memory
  output += `\n${COLORS.BOLD}MEMORY${COLORS.RESET}\n`;
  output += `${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}\n`;
  output += `Before:  ${report.memory.before.heapUsed} heap / ${report.memory.before.rss} RSS\n`;
  output += `After:   ${report.memory.after.heapUsed} heap / ${report.memory.after.rss} RSS\n`;
  output += `Delta:   ${report.memory.heapUsedDelta} heap / ${report.memory.rssDelta} RSS\n`;

  // Bottlenecks
  if (report.bottlenecks.length > 0) {
    output += `\n${COLORS.BOLD}BOTTLENECKS & RECOMMENDATIONS${COLORS.RESET}\n`;
    output += `${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}\n`;

    for (const bottleneck of report.bottlenecks) {
      const severityColor = bottleneck.severity === 'high' ? COLORS.RED : COLORS.YELLOW;
      output += `${severityColor}[${bottleneck.severity.toUpperCase()}]${COLORS.RESET} ${bottleneck.category}\n`;
      output += `  Issue: ${bottleneck.issue}\n`;
      output += `  Recommendation: ${bottleneck.recommendation}\n\n`;
    }
  }

  // Errors
  if (report.errors.count > 0) {
    output += `\n${COLORS.BOLD}ERRORS${COLORS.RESET}\n`;
    output += `${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}\n`;
    output += `Total Errors: ${COLORS.RED}${report.errors.count}${COLORS.RESET}\n`;
    for (const [type, count] of Object.entries(report.errors.byType)) {
      output += `  ${type}: ${count}\n`;
    }
  }

  output += `\n${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}\n`;
  return output;
}

// ============================================================================
// ANALYSIS MODE
// ============================================================================

function analyzeResults(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Results file not found: ${filePath}`);
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`\n${COLORS.BOLD}=== RESULTS ANALYSIS ===${COLORS.RESET}\n`);
  console.log(JSON.stringify(results, null, 2));
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

async function main() {
  const args = parseArgs();

  if (args.analyze) {
    analyzeResults(args.analyze);
    return;
  }

  ensureResultsDir();

  log('Starting Swarm Profiler');
  log(`Configuration: agents=${args.agents}, messages=${args.messages}, scenario=${args.scenario}`, 'DEBUG');

  const profiler = new SwarmProfiler({
    agents: args.agents,
    messages: args.messages,
    duration: args.duration,
    scenario: args.scenario,
    verbose: args.verbose
  });

  const metrics = await profiler.run();
  const report = generateReport(metrics, args.scenario);

  // Output based on format
  if (args.output === 'json') {
    const outputPath = path.join(RESULTS_DIR, `swarm-profile-${args.scenario}-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    log(`Report saved to ${outputPath}`, 'SUCCESS');
    console.log(JSON.stringify(report, null, 2));
  } else {
    const textReport = formatTextReport(report);
    console.log(textReport);

    const outputPath = path.join(RESULTS_DIR, `swarm-profile-${args.scenario}-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    log(`Full report saved to ${outputPath}`, 'SUCCESS');
  }

  log('Profiling complete', 'SUCCESS');
}

if (require.main === module) {
  main().catch(err => {
    log(err.message, 'ERROR');
    process.exit(1);
  });
}

module.exports = SwarmProfiler;
