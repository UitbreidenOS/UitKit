# Swarm Profiler

Comprehensive performance profiling tool for multi-agent systems. Measures agent startup overhead, inter-agent message latency, resource consumption, and identifies bottlenecks in agent swarms.

## Overview

Swarm Profiler profiles how well agent systems perform under various load patterns. It simulates realistic agent-to-agent communication, measures end-to-end latencies, tracks resource usage, and generates bottleneck reports to guide optimization.

**Key Metrics:**
- Agent startup time (milliseconds)
- Message latency (min/mean/max/p95/p99)
- Message throughput (messages/second)
- Per-agent resource consumption (memory, CPU)
- System-wide memory footprint
- Error rates and timeout detection
- Load distribution balance
- Communication overhead

## Installation

No additional dependencies required. Uses Node.js built-in modules:
- `worker_threads` - Agent simulation
- `perf_hooks` - High-precision timing
- `v8` - Memory snapshots

```bash
# Make executable
chmod +x profilers/swarm-profiler.js

# Run with default settings
node profilers/swarm-profiler.js

# Or use as module
const SwarmProfiler = require('./profilers/swarm-profiler.js');
```

## Usage

### Command Line

**Basic Profile**
```bash
node profilers/swarm-profiler.js
```
Profiles 5 agents sending 1000 messages in standard scenario.

**Custom Agent Count**
```bash
node profilers/swarm-profiler.js --agents=20 --messages=5000
```
Profile 20 agents with 5000 total messages.

**Load Scenarios**
```bash
# Stress test (high-frequency messages)
node profilers/swarm-profiler.js --scenario=stress --agents=10

# Latency-sensitive profile (low load, measure individual message times)
node profilers/swarm-profiler.js --scenario=latency --agents=5 --messages=500

# Throughput optimization (maximum messages/sec)
node profilers/swarm-profiler.js --scenario=throughput --agents=8 --messages=10000

# Degradation analysis (increasing load phases)
node profilers/swarm-profiler.js --scenario=degradation --agents=5

# Standard mixed load (default)
node profilers/swarm-profiler.js --scenario=standard
```

**Output Formats**
```bash
# Text report (default)
node profilers/swarm-profiler.js --output=text

# JSON output (for parsing/integration)
node profilers/swarm-profiler.js --output=json

# Both (console + JSON file)
node profilers/swarm-profiler.js --output=json --output=text
```

**Verbose Logging**
```bash
node profilers/swarm-profiler.js --verbose
```
Logs each agent startup and key events.

**Analyze Saved Results**
```bash
node profilers/swarm-profiler.js --analyze=profilers/results/swarm-profile-standard-1234567890.json
```

## Scenarios

### 1. Standard (Default)
- **Purpose:** Balanced baseline
- **Pattern:** Steady load, mixed message types
- **Message Distribution:** Even across agents, sequential dispatch
- **Use Case:** Establish baseline performance characteristics

### 2. Stress Test
- **Purpose:** Find breaking points
- **Pattern:** Rapid message bursts to all agents
- **Message Distribution:** All agents receive maximum load immediately
- **Use Case:** Identify CPU/memory limits, timeout thresholds

### 3. Latency Sensitive
- **Purpose:** Low-latency response optimization
- **Pattern:** Few messages, measure individual round-trip time
- **Message Distribution:** One message at a time, sequential
- **Use Case:** Measure minimum achievable latency, optimize critical paths

### 4. Throughput
- **Purpose:** Maximum messages per second
- **Pattern:** Continuous stream, no waiting
- **Message Distribution:** Rapid fire, asynchronous
- **Use Case:** Identify message queue performance, saturation point

### 5. Degradation
- **Purpose:** Performance under increasing load
- **Pattern:** Graduated phases (100 → 200 → 500 → 1000 messages)
- **Message Distribution:** Increasing phase load
- **Use Case:** Find where system starts degrading, knee of the curve

## Report Structure

### Summary Section
- `totalDuration`: Total profiling time
- `agentCount`: Number of agents spawned
- `messageCount`: Total messages processed
- `messagesPerSecond`: Throughput metric
- `successRate`: Percentage of successful messages
- `errorCount`: Total failed messages

### Performance Metrics

#### Startup
Time to initialize agents:
- `mean`: Average startup time across agents
- `min/max`: Fastest/slowest startup
- `p95/p99`: 95th/99th percentile startup times

#### Message Latency
End-to-end message round-trip time:
- `mean`: Average latency
- `min/max`: Best/worst case
- `p95/p99`: Percentile latencies
- `stdDev`: Variance in latency (consistency metric)

### Agent Performance
Per-agent breakdown:
- `messageCount`: Messages processed by this agent
- `avgProcessingTime`: Average time to handle a message
- `processingTime` stats: Min/max/mean/p95 for message handling

### Memory
- `before`: Heap and RSS at start
- `after`: Heap and RSS at end
- `delta`: Memory change (growth indicates leak potential)

### Bottlenecks
Automatically detected issues with recommendations:

| Bottleneck | Trigger | Recommendation |
|-----------|---------|-----------------|
| High Startup | Mean > 10ms | Reduce initialization overhead |
| High Latency | Mean > 50ms | Optimize serialization, reduce payload |
| Latency Variance | StdDev > 50% of mean | Fix scheduling/priority issues |
| Memory Growth | Delta > 50MB | Investigate message queue leaks |
| Error Rate | > 1% | Check resource limits, timeouts |
| Load Imbalance | StdDev > 30% of mean | Implement better load distribution |

## Example Output

```
=== SWARM PROFILER REPORT ===
Timestamp: 2026-06-22T15:30:45.123Z
Scenario: standard

SUMMARY
────────────────────────────────────────────────────────────────
totalDuration: 2345.67ms
agentCount: 5
messageCount: 1000
messagesPerSecond: 426.25
successRate: 99.90%
errorCount: 1

PERFORMANCE
────────────────────────────────────────────────────────────────
Agent Startup:
  count: 5
  mean: 5.23ms
  min: 4.15ms
  max: 7.89ms
  p95: 7.45ms
  p99: 7.89ms

Message Latency:
  count: 1000
  mean: 18.45ms
  min: 2.10ms
  max: 156.23ms
  p95: 45.67ms
  p99: 89.23ms
  stdDev: 22.34ms

MEMORY
────────────────────────────────────────────────────────────────
Before:  45.23MB heap / 98.45MB RSS
After:   52.10MB heap / 105.30MB RSS
Delta:   6.87MB heap / 6.85MB RSS

BOTTLENECKS & RECOMMENDATIONS
────────────────────────────────────────────────────────────────
[HIGH] Message Latency
  Issue: High average message latency: 18.45ms
  Recommendation: Check inter-agent communication...
```

## Performance Baselines

Typical values on modern hardware (Node.js 18+):

| Metric | Good | Acceptable | Concerning |
|--------|------|-----------|------------|
| Agent Startup | < 2ms | 2-5ms | > 5ms |
| Message Latency (mean) | < 10ms | 10-50ms | > 50ms |
| Message Latency (p99) | < 30ms | 30-100ms | > 100ms |
| Latency StdDev | < mean * 0.2 | mean * 0.2-0.5 | > mean * 0.5 |
| Messages/second | > 1000 | 500-1000 | < 500 |
| Memory/agent | < 5MB | 5-20MB | > 20MB |

## API Usage

### Basic Example

```javascript
const SwarmProfiler = require('./profilers/swarm-profiler.js');

const profiler = new SwarmProfiler({
  agents: 10,
  messages: 5000,
  scenario: 'standard'
});

const metrics = await profiler.run();

console.log(`Average latency: ${metrics.messageLatency.mean.toFixed(2)}ms`);
console.log(`Throughput: ${metrics.messagesPerSecond.toFixed(0)} msg/s`);
```

### Advanced Configuration

```javascript
const profiler = new SwarmProfiler({
  agents: 20,
  messages: 10000,
  duration: 60000,        // 60 seconds
  scenario: 'degradation',
  verbose: true           // Log each event
});

const metrics = await profiler.run();
```

### Programmatic Report Generation

```javascript
const SwarmProfiler = require('./profilers/swarm-profiler.js');
const fs = require('fs');

async function benchmarkAgentSystem() {
  const results = {};

  for (const scenario of ['standard', 'stress', 'latency']) {
    const profiler = new SwarmProfiler({
      agents: 5,
      messages: 1000,
      scenario
    });

    const metrics = await profiler.run();
    results[scenario] = metrics;
  }

  // Comparative analysis
  for (const scenario in results) {
    const m = results[scenario];
    console.log(`${scenario}: ${m.messagesPerSecond.toFixed(0)} msg/s, ` +
                `latency ${m.messageLatency.mean.toFixed(2)}ms`);
  }

  fs.writeFileSync('benchmark-results.json', JSON.stringify(results, null, 2));
}

benchmarkAgentSystem();
```

## Interpreting Results

### High Startup Times
**Symptom:** Agent startup > 5ms per agent

**Causes:**
- Slow worker thread spawning
- Expensive module initialization
- I/O on startup path

**Solutions:**
- Lazy-load modules
- Use worker pools with pre-spawned workers
- Cache initialization state

### High Message Latency
**Symptom:** Message latency > 50ms

**Causes:**
- Serialization overhead (large payloads)
- Long agent processing (heavy compute)
- Queue backlogs
- Scheduling delays

**Solutions:**
- Compress/optimize message payloads
- Profile and optimize agent message handlers
- Increase agent count for better parallelism
- Implement priority queues

### High Latency Variance
**Symptom:** StdDev > 50% of mean latency

**Causes:**
- GC pauses
- Uneven load distribution
- CPU contention
- Priority/scheduling issues

**Solutions:**
- Run with `--expose-gc` and trigger GC before critical operations
- Implement load balancing
- Pin workers to CPU cores
- Use consistent message sizes

### Memory Growth
**Symptom:** Heap grows > 50MB during profiling

**Causes:**
- Message queue buildup
- Agent state accumulation
- Lack of cleanup/garbage collection
- Message object leaks

**Solutions:**
- Batch process messages to prevent queue growth
- Implement message object pooling
- Call `global.gc()` periodically
- Profile heap snapshots to find leak sources

### Load Imbalance
**Symptom:** Some agents get many more messages than others

**Causes:**
- Round-robin not properly distributed
- Uneven incoming message pattern
- Agent processing speed differences

**Solutions:**
- Use least-loaded agent selection
- Implement queue-aware routing
- Adjust load distribution algorithm

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Run Swarm Profiler
  run: |
    node profilers/swarm-profiler.js \
      --agents=10 \
      --messages=5000 \
      --scenario=stress \
      --output=json > swarm-profile.json

- name: Check Performance Baseline
  run: |
    node scripts/check-swarm-baseline.js swarm-profile.json
```

### Check Script Template

```javascript
// scripts/check-swarm-baseline.js
const fs = require('fs');

const baseline = {
  maxLatency: 100,        // 100ms p99 max
  minThroughput: 500,     // 500 msg/s minimum
  maxErrorRate: 0.01,     // 1% max errors
  maxMemoryGrowth: 100000000  // 100MB max
};

const report = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const metrics = report.metrics;

let passed = true;

if (metrics.messageLatency.p99 > baseline.maxLatency) {
  console.error(`FAIL: p99 latency ${metrics.messageLatency.p99}ms > ${baseline.maxLatency}ms`);
  passed = false;
}

if (metrics.messagesPerSecond < baseline.minThroughput) {
  console.error(`FAIL: throughput below minimum`);
  passed = false;
}

process.exit(passed ? 0 : 1);
```

## Troubleshooting

### "Cannot find module 'worker_threads'"
Requires Node.js 10.5+. Update Node.js version.

### High memory usage during profiling
- Reduce `--messages` count
- Use `--scenario=latency` for smaller message sets
- Ensure system has adequate free RAM

### Timeout errors
- Increase agent count (distribute load)
- Reduce message payload size
- Check system CPU availability

### Inconsistent results
- Close other applications to reduce system noise
- Run multiple times and average results
- Use `--verbose` to identify anomalies

## Files

| File | Purpose |
|------|---------|
| `swarm-profiler.js` | Main profiler implementation |
| `SWARM-PROFILER.md` | This documentation |
| `profilers/results/` | Output directory for reports |

## Performance Tips

1. **Baseline First:** Run with default settings to establish baseline
2. **Isolate Variables:** Change one parameter at a time
3. **Warm Up:** Discard first run (JIT compilation ramp-up)
4. **Multiple Runs:** Average 3-5 runs for reliable data
5. **System State:** Profile on quiet system, close unnecessary apps
6. **GC Control:** Run with `node --expose-gc` for consistent GC behavior

## See Also

- `swarm-sandbox-profiler.js` - Process fork/spawn profiling
- `svg-inspector-profiler.js` - Frontend rendering profiling
- `matrix-theme-profiler.js` - Theme performance profiling
- `profiles.config.js` - Reusable profiling scenarios

## License

MIT
