# Swarm Profiler Examples

Practical examples for using SwarmProfiler in different contexts.

## Quick Start Examples

### Example 1: Basic Profiling

```javascript
const SwarmProfiler = require('./swarm-profiler.js');

async function basicProfile() {
  const profiler = new SwarmProfiler({
    agents: 5,
    messages: 1000,
    scenario: 'standard'
  });

  const metrics = await profiler.run();

  console.log(`Duration: ${metrics.duration.toFixed(2)}ms`);
  console.log(`Throughput: ${metrics.messagesPerSecond.toFixed(0)} msg/s`);
  console.log(`Avg Latency: ${metrics.messageLatency.mean.toFixed(2)}ms`);
  console.log(`Memory Delta: ${(metrics.memory.delta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
}

basicProfile();
```

### Example 2: Comparative Analysis

```javascript
const SwarmProfiler = require('./swarm-profiler.js');
const fs = require('fs');

async function compareScenarios() {
  const results = {};
  const scenarios = ['standard', 'stress', 'latency'];

  for (const scenario of scenarios) {
    console.log(`\nProfiling ${scenario}...`);

    const profiler = new SwarmProfiler({
      agents: 5,
      messages: 1000,
      scenario
    });

    const metrics = await profiler.run();
    results[scenario] = {
      duration: metrics.duration,
      throughput: metrics.messagesPerSecond,
      latency: {
        mean: metrics.messageLatency.mean,
        p99: metrics.messageLatency.p99
      },
      successRate: ((metrics.messageCount - metrics.errors.count) / metrics.messageCount * 100).toFixed(2)
    };

    console.log(`  Throughput: ${results[scenario].throughput.toFixed(0)} msg/s`);
    console.log(`  Latency (p99): ${results[scenario].latency.p99.toFixed(2)}ms`);
    console.log(`  Success Rate: ${results[scenario].successRate}%`);
  }

  // Print comparison table
  console.log('\n\n=== COMPARISON ===\n');
  console.log('Scenario    | Throughput | Latency (p99) | Success Rate');
  console.log('------------|------------|---------------|-------------');

  for (const scenario in results) {
    const r = results[scenario];
    console.log(
      `${scenario.padEnd(11)}| ${r.throughput.toFixed(0).padStart(10)} | ${r.latency.p99.toFixed(2).padStart(13)}ms | ${r.successRate.padStart(8)}%`
    );
  }

  // Save to file
  fs.writeFileSync('comparison.json', JSON.stringify(results, null, 2));
}

compareScenarios();
```

### Example 3: Stress Test with Threshold Validation

```javascript
const SwarmProfiler = require('./swarm-profiler.js');

async function stressTestWithThresholds() {
  const thresholds = {
    maxLatency: 100,           // p99 latency must be < 100ms
    minThroughput: 500,        // Must handle > 500 msg/s
    maxErrorRate: 0.05,        // Allow up to 5% error rate
    maxMemoryGrowth: 200000000 // 200MB max growth
  };

  const profiler = new SwarmProfiler({
    agents: 10,
    messages: 5000,
    scenario: 'stress'
  });

  console.log('Running stress test...\n');
  const metrics = await profiler.run();

  console.log('=== THRESHOLD VALIDATION ===\n');

  let passed = true;

  // Check p99 latency
  if (metrics.messageLatency.p99 > thresholds.maxLatency) {
    console.log(`❌ FAIL: p99 latency ${metrics.messageLatency.p99.toFixed(2)}ms > ${thresholds.maxLatency}ms`);
    passed = false;
  } else {
    console.log(`✓ PASS: p99 latency ${metrics.messageLatency.p99.toFixed(2)}ms < ${thresholds.maxLatency}ms`);
  }

  // Check throughput
  if (metrics.messagesPerSecond < thresholds.minThroughput) {
    console.log(`❌ FAIL: throughput ${metrics.messagesPerSecond.toFixed(0)} msg/s < ${thresholds.minThroughput} msg/s`);
    passed = false;
  } else {
    console.log(`✓ PASS: throughput ${metrics.messagesPerSecond.toFixed(0)} msg/s > ${thresholds.minThroughput} msg/s`);
  }

  // Check error rate
  const errorRate = metrics.errors.count / metrics.messageCount;
  if (errorRate > thresholds.maxErrorRate) {
    console.log(`❌ FAIL: error rate ${(errorRate * 100).toFixed(2)}% > ${(thresholds.maxErrorRate * 100).toFixed(2)}%`);
    passed = false;
  } else {
    console.log(`✓ PASS: error rate ${(errorRate * 100).toFixed(2)}% < ${(thresholds.maxErrorRate * 100).toFixed(2)}%`);
  }

  // Check memory
  if (metrics.memory.delta.heapUsed > thresholds.maxMemoryGrowth) {
    console.log(`❌ FAIL: memory growth ${(metrics.memory.delta.heapUsed / 1024 / 1024).toFixed(2)}MB > ${(thresholds.maxMemoryGrowth / 1024 / 1024).toFixed(2)}MB`);
    passed = false;
  } else {
    console.log(`✓ PASS: memory growth ${(metrics.memory.delta.heapUsed / 1024 / 1024).toFixed(2)}MB < ${(thresholds.maxMemoryGrowth / 1024 / 1024).toFixed(2)}MB`);
  }

  console.log(`\n${passed ? '✓ All thresholds passed!' : '❌ Some thresholds failed!'}`);
  process.exit(passed ? 0 : 1);
}

stressTestWithThresholds();
```

### Example 4: Degradation Analysis

```javascript
const SwarmProfiler = require('./swarm-profiler.js');

async function degradationAnalysis() {
  const agentCounts = [2, 5, 10, 20];
  const results = [];

  for (const agentCount of agentCounts) {
    console.log(`\nTesting with ${agentCount} agents...`);

    const profiler = new SwarmProfiler({
      agents: agentCount,
      messages: 2000,
      scenario: 'degradation'
    });

    const metrics = await profiler.run();

    results.push({
      agents: agentCount,
      duration: metrics.duration,
      throughput: metrics.messagesPerSecond,
      avgLatency: metrics.messageLatency.mean,
      p99Latency: metrics.messageLatency.p99,
      errorRate: (metrics.errors.count / metrics.messageCount * 100).toFixed(2)
    });

    console.log(`  Throughput: ${metrics.messagesPerSecond.toFixed(0)} msg/s`);
    console.log(`  Avg Latency: ${metrics.messageLatency.mean.toFixed(2)}ms`);
    console.log(`  P99 Latency: ${metrics.messageLatency.p99.toFixed(2)}ms`);
  }

  // Print degradation curve
  console.log('\n\n=== DEGRADATION CURVE ===\n');
  console.log('Agents | Throughput | Avg Latency | P99 Latency | Error Rate');
  console.log('-------|------------|-------------|-------------|----------');

  for (const r of results) {
    console.log(
      `${String(r.agents).padStart(6)} | ${r.throughput.toFixed(0).padStart(10)} | ${r.avgLatency.toFixed(2).padStart(11)}ms | ${r.p99Latency.toFixed(2).padStart(11)}ms | ${r.errorRate.padStart(8)}%`
    );
  }

  // Analyze knee of the curve
  const maxThroughput = Math.max(...results.map(r => r.throughput));
  const kneePoint = results.find(r => r.throughput < maxThroughput * 0.9);

  if (kneePoint) {
    console.log(`\nPerformance starts degrading at ${kneePoint.agents} agents`);
  }
}

degradationAnalysis();
```

### Example 5: Continuous Monitoring

```javascript
const SwarmProfiler = require('./swarm-profiler.js');
const fs = require('fs');
const path = require('path');

async function continuousMonitoring() {
  const resultsDir = 'swarm-monitoring';
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const interval = 5 * 60 * 1000; // Run every 5 minutes
  const iterations = 12; // Run 12 times (1 hour total)

  console.log(`Starting continuous monitoring for ${iterations} iterations\n`);

  const history = [];

  for (let i = 0; i < iterations; i++) {
    console.log(`[${i + 1}/${iterations}] Running profiler...`);

    const profiler = new SwarmProfiler({
      agents: 5,
      messages: 1000,
      scenario: 'standard'
    });

    const metrics = await profiler.run();

    const dataPoint = {
      timestamp: new Date().toISOString(),
      iteration: i + 1,
      throughput: metrics.messagesPerSecond,
      avgLatency: metrics.messageLatency.mean,
      p99Latency: metrics.messageLatency.p99,
      memory: metrics.memory.delta.heapUsed / 1024 / 1024
    };

    history.push(dataPoint);

    // Save after each iteration
    fs.writeFileSync(
      path.join(resultsDir, 'history.json'),
      JSON.stringify(history, null, 2)
    );

    console.log(`  Throughput: ${dataPoint.throughput.toFixed(0)} msg/s`);
    console.log(`  Latency (p99): ${dataPoint.p99Latency.toFixed(2)}ms`);
    console.log(`  Memory: ${dataPoint.memory.toFixed(2)}MB\n`);

    // Wait before next iteration (except last)
    if (i < iterations - 1) {
      console.log(`Waiting ${interval / 1000 / 60} minutes until next run...\n`);
      await new Promise(r => setTimeout(r, interval));
    }
  }

  // Analyze trends
  console.log('\n=== TREND ANALYSIS ===\n');

  const throughputs = history.map(h => h.throughput);
  const latencies = history.map(h => h.p99Latency);
  const memories = history.map(h => h.memory);

  console.log(`Throughput:`);
  console.log(`  Min: ${Math.min(...throughputs).toFixed(0)} msg/s`);
  console.log(`  Max: ${Math.max(...throughputs).toFixed(0)} msg/s`);
  console.log(`  Avg: ${(throughputs.reduce((a, b) => a + b, 0) / throughputs.length).toFixed(0)} msg/s`);

  console.log(`\nLatency (p99):`);
  console.log(`  Min: ${Math.min(...latencies).toFixed(2)}ms`);
  console.log(`  Max: ${Math.max(...latencies).toFixed(2)}ms`);
  console.log(`  Avg: ${(latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)}ms`);

  console.log(`\nMemory Growth:`);
  console.log(`  First: ${memories[0].toFixed(2)}MB`);
  console.log(`  Last: ${memories[memories.length - 1].toFixed(2)}MB`);
  console.log(`  Growth: ${(memories[memories.length - 1] - memories[0]).toFixed(2)}MB`);

  // Check for memory leak
  const memoryTrend = memories[memories.length - 1] - memories[0];
  if (memoryTrend > 100) {
    console.log('\n⚠️  WARNING: Possible memory leak detected!');
    console.log(`Memory grew by ${memoryTrend.toFixed(2)}MB over ${iterations} iterations`);
  }
}

continuousMonitoring();
```

### Example 6: A/B Testing Agent Configuration

```javascript
const SwarmProfiler = require('./swarm-profiler.js');

async function abTestConfiguration() {
  const configurations = {
    'Small Pool': { agents: 3, messages: 1000 },
    'Medium Pool': { agents: 5, messages: 1000 },
    'Large Pool': { agents: 10, messages: 1000 },
  };

  const results = {};

  for (const [name, config] of Object.entries(configurations)) {
    console.log(`\nTesting ${name}: ${config.agents} agents, ${config.messages} messages`);

    const profiler = new SwarmProfiler({
      agents: config.agents,
      messages: config.messages,
      scenario: 'standard'
    });

    const metrics = await profiler.run();

    results[name] = {
      agents: config.agents,
      duration: metrics.duration,
      throughput: metrics.messagesPerSecond,
      latency: metrics.messageLatency.mean,
      p99: metrics.messageLatency.p99,
      memory: metrics.memory.delta.heapUsed / 1024 / 1024,
      efficiency: metrics.messagesPerSecond / config.agents // msgs/sec per agent
    };
  }

  // Print comparison
  console.log('\n\n=== A/B TEST RESULTS ===\n');
  console.log('Configuration  | Agents | Throughput | Latency | P99   | Memory | Efficiency');
  console.log('---------------|--------|------------|---------|-------|--------|------------');

  for (const [name, result] of Object.entries(results)) {
    console.log(
      `${name.padEnd(14)} | ${String(result.agents).padStart(6)} | ${result.throughput.toFixed(0).padStart(10)} | ${result.latency.toFixed(1).padStart(7)}ms | ${result.p99.toFixed(0).padStart(5)}ms | ${result.memory.toFixed(0).padStart(6)}MB | ${result.efficiency.toFixed(0).padStart(11)}`
    );
  }

  // Recommendation
  console.log('\n=== RECOMMENDATION ===\n');

  const bestEfficiency = Object.entries(results).reduce((best, [name, result]) =>
    result.efficiency > best[1].efficiency ? [name, result] : best
  );

  console.log(`Best efficiency: ${bestEfficiency[0]}`);
  console.log(`  ${bestEfficiency[1].efficiency.toFixed(0)} messages/sec per agent`);
}

abTestConfiguration();
```

## CLI Examples

### Run All Scenarios
```bash
for scenario in standard stress latency throughput degradation; do
  echo "=== $scenario ==="
  node profilers/swarm-profiler.js --scenario=$scenario --agents=5 --messages=1000
done
```

### Generate Baseline
```bash
node profilers/swarm-profiler.js \
  --agents=5 \
  --messages=5000 \
  --scenario=standard \
  --output=json > baseline.json
```

### Load Testing
```bash
node profilers/swarm-profiler.js \
  --agents=20 \
  --messages=10000 \
  --scenario=stress \
  --output=json
```

## Integration with Test Frameworks

### Jest Integration

```javascript
// test/swarm.test.js

const SwarmProfiler = require('../profilers/swarm-profiler.js');

describe('Multi-Agent Performance', () => {
  jest.setTimeout(60000); // 60 second timeout

  test('should maintain latency under standard load', async () => {
    const profiler = new SwarmProfiler({
      agents: 5,
      messages: 1000,
      scenario: 'standard'
    });

    const metrics = await profiler.run();

    expect(metrics.messageLatency.p99).toBeLessThan(100);
    expect(metrics.messagesPerSecond).toBeGreaterThan(500);
  });

  test('should handle stress without excessive errors', async () => {
    const profiler = new SwarmProfiler({
      agents: 10,
      messages: 5000,
      scenario: 'stress'
    });

    const metrics = await profiler.run();

    const errorRate = metrics.errors.count / metrics.messageCount;
    expect(errorRate).toBeLessThan(0.05);
  });

  test('memory should not grow unbounded', async () => {
    const profiler = new SwarmProfiler({
      agents: 5,
      messages: 2000,
      scenario: 'standard'
    });

    const metrics = await profiler.run();

    const growthMB = metrics.memory.delta.heapUsed / 1024 / 1024;
    expect(growthMB).toBeLessThan(500);
  });
});
```

## See Also

- `SWARM-PROFILER.md` - Complete documentation
- `swarm-profiler.js` - Source code
- `swarm-profiler.test.js` - Test suite
