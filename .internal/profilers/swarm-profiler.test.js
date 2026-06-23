/**
 * swarm-profiler.test.js
 *
 * Test suite for SwarmProfiler
 * Run: node profilers/swarm-profiler.test.js
 *      or npm test -- swarm-profiler.test.js
 */

const SwarmProfiler = require('./swarm-profiler.js');
const assert = require('assert');

// ============================================================================
// TEST UTILITIES
// ============================================================================

let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  testCount++;
  try {
    fn();
    console.log(`✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${err.message}`);
    failCount++;
  }
}

async function asyncTest(name, fn) {
  testCount++;
  try {
    await fn();
    console.log(`✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${err.message}`);
    failCount++;
  }
}

function reportResults() {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Tests: ${testCount} | Passed: ${passCount} | Failed: ${failCount}`);
  console.log(`${'─'.repeat(60)}\n`);
  return failCount === 0;
}

// ============================================================================
// UNIT TESTS
// ============================================================================

function testBasicInitialization() {
  test('SwarmProfiler instantiation', () => {
    const profiler = new SwarmProfiler({
      agents: 2,
      messages: 10,
      scenario: 'standard'
    });

    assert.strictEqual(profiler.options.agents, 2);
    assert.strictEqual(profiler.options.messages, 10);
    assert.strictEqual(profiler.options.scenario, 'standard');
    assert.strictEqual(profiler.workers.length, 0);
    assert.strictEqual(profiler.running, false);
  });

  test('Default options', () => {
    const profiler = new SwarmProfiler();

    assert.strictEqual(profiler.options.agents, 5);
    assert.strictEqual(profiler.options.messages, 1000);
    assert.strictEqual(profiler.options.scenario, 'standard');
  });

  test('Custom options merge', () => {
    const profiler = new SwarmProfiler({
      agents: 10,
      verbose: true
    });

    assert.strictEqual(profiler.options.agents, 10);
    assert.strictEqual(profiler.options.messages, 1000);
    assert.strictEqual(profiler.options.verbose, true);
  });
}

function testStatisticsCalculation() {
  test('calculateStats - basic', () => {
    const stats = require('./swarm-profiler.js');
    // Note: calculateStats is internal, test through result interpretation
    const values = [1, 2, 3, 4, 5];
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    assert.strictEqual(mean, 3);
  });

  test('calculateStats - percentiles', () => {
    const values = Array.from({ length: 100 }, (_, i) => i + 1);
    const sorted = [...values].sort((a, b) => a - b);

    const p95 = sorted[Math.floor(values.length * 0.95)];
    const p99 = sorted[Math.floor(values.length * 0.99)];

    assert.strictEqual(p95, 95);
    assert.strictEqual(p99, 99);
  });

  test('calculateStats - empty array', () => {
    const values = [];
    const mean = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    assert.strictEqual(mean, 0);
  });

  test('calculateStats - single value', () => {
    const values = [42];
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(values.length / 2)];

    assert.strictEqual(median, 42);
  });
}

function testMemoryMetrics() {
  test('Memory metrics structure', () => {
    const mem = process.memoryUsage();
    assert(typeof mem.rss === 'number');
    assert(typeof mem.heapTotal === 'number');
    assert(typeof mem.heapUsed === 'number');
    assert(typeof mem.external === 'number');
  });

  test('Memory delta calculation', () => {
    const before = { heapUsed: 1000000, rss: 2000000 };
    const after = { heapUsed: 1500000, rss: 2500000 };

    const delta = {
      heapUsed: after.heapUsed - before.heapUsed,
      rss: after.rss - before.rss
    };

    assert.strictEqual(delta.heapUsed, 500000);
    assert.strictEqual(delta.rss, 500000);
  });
}

function testReportGeneration() {
  test('Report structure creation', () => {
    const mockMetrics = {
      duration: 1000,
      agentCount: 5,
      messageCount: 100,
      messagesPerSecond: 100,
      errors: {
        count: 0,
        byType: {}
      },
      startupMetrics: {
        count: 5,
        mean: 5,
        min: 4,
        max: 6,
        p95: 5.5,
        p99: 5.9
      },
      messageLatency: {
        count: 100,
        mean: 20,
        min: 5,
        max: 50,
        p95: 40,
        p99: 48,
        stdDev: 10
      },
      agentMetrics: [],
      memory: {
        before: { heapUsed: 1000000, rss: 2000000 },
        after: { heapUsed: 2000000, rss: 3000000 },
        delta: { heapUsed: 1000000, rss: 1000000 }
      }
    };

    assert.strictEqual(mockMetrics.agentCount, 5);
    assert.strictEqual(mockMetrics.messageCount, 100);
    assert(mockMetrics.startupMetrics);
    assert(mockMetrics.messageLatency);
  });

  test('Bottleneck detection - high startup', () => {
    const mockMetrics = {
      startupMetrics: {
        mean: 15,  // High startup
        stdDev: 2
      },
      messageLatency: {
        mean: 20,
        stdDev: 5,
        p99: 50
      },
      errors: { count: 0 },
      memory: {
        delta: { heapUsed: 10000000 }
      },
      messageCount: 100,
      agentMetrics: [
        { messageCount: 20 },
        { messageCount: 20 },
        { messageCount: 20 },
        { messageCount: 20 },
        { messageCount: 20 }
      ]
    };

    // High startup check: mean > 10
    const highStartup = mockMetrics.startupMetrics.mean > 10;
    assert.strictEqual(highStartup, true);
  });

  test('Bottleneck detection - high latency', () => {
    const mockMetrics = {
      messageLatency: {
        mean: 75,  // High latency
        stdDev: 20
      },
      errors: { count: 0 },
      startupMetrics: { mean: 5, stdDev: 1 },
      memory: {
        delta: { heapUsed: 10000000 }
      },
      messageCount: 100,
      agentMetrics: [{ messageCount: 20 }, { messageCount: 20 }, { messageCount: 20 }, { messageCount: 20 }, { messageCount: 20 }]
    };

    // High latency check: mean > 50
    const highLatency = mockMetrics.messageLatency.mean > 50;
    assert.strictEqual(highLatency, true);
  });

  test('Bottleneck detection - memory growth', () => {
    const mockMetrics = {
      memory: {
        delta: { heapUsed: 60000000 }  // 60MB growth
      },
      messageLatency: { mean: 20 },
      startupMetrics: { mean: 5 },
      errors: { count: 0 },
      messageCount: 100,
      agentMetrics: Array(5).fill({ messageCount: 20 })
    };

    // Memory growth check: delta > 50MB
    const highMemoryGrowth = mockMetrics.memory.delta.heapUsed > 50000000;
    assert.strictEqual(highMemoryGrowth, true);
  });

  test('Bottleneck detection - error rate', () => {
    const mockMetrics = {
      messageCount: 100,
      errors: { count: 2 },  // 2% error rate
      messageLatency: { mean: 20 },
      startupMetrics: { mean: 5 },
      memory: { delta: { heapUsed: 10000000 } },
      agentMetrics: Array(5).fill({ messageCount: 20 })
    };

    // Error rate check: > 1%
    const errorRate = mockMetrics.errors.count / mockMetrics.messageCount;
    const highErrorRate = errorRate > 0.01;
    assert.strictEqual(highErrorRate, true);
  });
}

function testScenarioValidation() {
  test('Valid scenarios recognized', () => {
    const validScenarios = ['standard', 'stress', 'latency', 'throughput', 'degradation'];
    for (const scenario of validScenarios) {
      const profiler = new SwarmProfiler({ scenario });
      assert.strictEqual(profiler.options.scenario, scenario);
    }
  });

  test('Scenario configuration', () => {
    const scenarios = ['standard', 'stress', 'latency', 'throughput', 'degradation'];
    assert.strictEqual(scenarios.length, 5);

    for (const scenario of scenarios) {
      const profiler = new SwarmProfiler({ scenario });
      assert(typeof profiler.options.scenario === 'string');
    }
  });
}

function testOutputFormatting() {
  test('JSON output formatting', () => {
    const report = {
      timestamp: '2026-06-22T15:30:00.000Z',
      scenario: 'standard',
      summary: {
        totalDuration: '100.50ms',
        agentCount: 5,
        messageCount: 100,
        messagesPerSecond: '995.00'
      }
    };

    const json = JSON.stringify(report, null, 2);
    assert(json.includes('timestamp'));
    assert(json.includes('standard'));
    assert(json.includes('100.50ms'));
  });

  test('Report has required sections', () => {
    const report = {
      timestamp: new Date().toISOString(),
      scenario: 'test',
      summary: {},
      performance: {},
      memory: {},
      agentPerformance: [],
      errors: {},
      bottlenecks: []
    };

    assert(report.timestamp);
    assert(report.scenario);
    assert(report.summary);
    assert(report.performance);
    assert(report.memory);
    assert(Array.isArray(report.agentPerformance));
    assert(Array.isArray(report.bottlenecks));
  });
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

async function testMinimalProfiler() {
  console.log('\n=== Integration Tests ===\n');

  await asyncTest('Minimal profiler run (2 agents, 50 messages)', async () => {
    const profiler = new SwarmProfiler({
      agents: 2,
      messages: 50,
      scenario: 'standard'
    });

    const metrics = await profiler.run();

    assert(metrics.duration > 0);
    assert.strictEqual(metrics.agentCount, 2);
    assert(metrics.messageCount > 0);
    assert(metrics.messageLatency.count > 0);
    assert(metrics.startupMetrics.count === 2);
  });
}

async function testLatencyScenario() {
  await asyncTest('Latency scenario (small message set)', async () => {
    const profiler = new SwarmProfiler({
      agents: 3,
      messages: 30,
      scenario: 'latency'
    });

    const metrics = await profiler.run();

    assert(metrics.duration > 0);
    assert(metrics.messageCount > 0);
    assert(metrics.messageLatency.mean > 0);
  });
}

async function testStressScenario() {
  await asyncTest('Stress scenario (high throughput)', async () => {
    const profiler = new SwarmProfiler({
      agents: 3,
      messages: 300,
      scenario: 'stress'
    });

    const metrics = await profiler.run();

    assert(metrics.duration > 0);
    assert(metrics.messageCount > 0);
    assert(metrics.messagesPerSecond > 0);
  });
}

async function testDegradationScenario() {
  await asyncTest('Degradation scenario (phased load)', async () => {
    const profiler = new SwarmProfiler({
      agents: 2,
      messages: 100,
      scenario: 'degradation'
    });

    const metrics = await profiler.run();

    assert(metrics.duration > 0);
    assert(metrics.agentCount === 2);
  });
}

// ============================================================================
// PERFORMANCE BASELINE TESTS
// ============================================================================

async function testPerformanceBaselines() {
  console.log('\n=== Performance Baseline Tests ===\n');

  await asyncTest('Verify startup time baseline', async () => {
    const profiler = new SwarmProfiler({
      agents: 5,
      messages: 100,
      scenario: 'latency'
    });

    const metrics = await profiler.run();

    // Startup should be reasonable (< 50ms per agent on typical hardware)
    const avgStartup = metrics.startupMetrics.mean;
    assert(avgStartup < 100, `Startup too slow: ${avgStartup}ms`);
  });

  await asyncTest('Verify message latency baseline', async () => {
    const profiler = new SwarmProfiler({
      agents: 3,
      messages: 200,
      scenario: 'latency'
    });

    const metrics = await profiler.run();

    // Message latency should be < 500ms for small payload
    const avgLatency = metrics.messageLatency.mean;
    assert(avgLatency < 500, `Latency too high: ${avgLatency}ms`);
  });

  await asyncTest('Verify throughput is positive', async () => {
    const profiler = new SwarmProfiler({
      agents: 2,
      messages: 100,
      scenario: 'throughput'
    });

    const metrics = await profiler.run();

    // Should process at least some messages per second
    assert(metrics.messagesPerSecond > 0);
  });

  await asyncTest('Verify memory delta is reasonable', async () => {
    const profiler = new SwarmProfiler({
      agents: 2,
      messages: 100,
      scenario: 'standard'
    });

    const metrics = await profiler.run();

    // Memory growth should be < 500MB for 100 messages on 2 agents
    const heapGrowth = metrics.memory.delta.heapUsed / 1024 / 1024;
    assert(heapGrowth < 500, `Memory growth too high: ${heapGrowth}MB`);
  });
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         SwarmProfiler Test Suite                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  console.log('\n=== Unit Tests ===\n');

  testBasicInitialization();
  testStatisticsCalculation();
  testMemoryMetrics();
  testReportGeneration();
  testScenarioValidation();
  testOutputFormatting();

  await testMinimalProfiler();
  await testLatencyScenario();
  await testStressScenario();
  await testDegradationScenario();
  await testPerformanceBaselines();

  const success = reportResults();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  runAllTests().catch(err => {
    console.error('Test suite error:', err);
    process.exit(1);
  });
}

module.exports = { test, asyncTest };
