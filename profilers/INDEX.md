# Profiler Suite Index

Complete profiling toolkit for sandbox performance analysis and multi-agent system optimization.

## Files

### Core Profilers

#### Swarm Profiler (Multi-Agent Systems)
- **swarm-profiler.js** — Multi-agent performance profiling
  - Measures agent startup time, message latency, throughput
  - Profiles 5 load scenarios: standard, stress, latency, throughput, degradation
  - Detects bottlenecks and performance anomalies
  - Comprehensive memory and CPU analysis
  - Exports JSON/text reports with recommendations

#### Sandbox Profiler (Process Operations)
- **swarm-sandbox-profiler.js** — Main profiler executable
  - Measures fork/spawn time, IPC overhead, cleanup time
  - Detects memory and file descriptor leaks
  - Profiles concurrent operations
  - Exports JSON/text reports

### Configuration
- **profiles.config.js** — Pre-configured scenarios and thresholds
  - 8 standard profiling scenarios (quick/comprehensive/leak-detection/etc.)
  - Threshold definitions (good/warning/critical ranges)
  - Regression detection configuration
  - Reporting formats and export options

### Documentation
- **README.md** — Profiler overview and reference
- **USAGE.md** — Practical examples and troubleshooting
- **SWARM-PROFILER.md** — Complete multi-agent profiler documentation
- **SWARM-PROFILER-EXAMPLES.md** — Multi-agent profiler usage examples
- **INDEX.md** — This file

### Runtime
- **results/** — Output directory for JSON/text reports (generated)
- **worker-stub.js** — Temporary child process for testing (generated)
- **.gitignore** — Ignore generated files

## Quick Reference

### Run Swarm Profiler (Multi-Agent)
```bash
# Default (5 agents, 1000 messages, standard scenario)
node profilers/swarm-profiler.js

# Stress test (high throughput)
node profilers/swarm-profiler.js --agents=10 --messages=5000 --scenario=stress

# Latency analysis (measure individual message times)
node profilers/swarm-profiler.js --scenario=latency --agents=5 --messages=500

# JSON output
node profilers/swarm-profiler.js --output=json

# Analyze saved results
node profilers/swarm-profiler.js --analyze=profilers/results/swarm-profile-standard-*.json
```

### Run Sandbox Profiler (Process Operations)
```bash
# Default (fork + spawn, 5 iterations)
node profilers/swarm-sandbox-profiler.js

# With leak detection
node --expose-gc profilers/swarm-sandbox-profiler.js --leak-detection

# All tests, JSON output
node profilers/swarm-sandbox-profiler.js --all-tests --output=json
```

### Access Configurations
```javascript
const config = require('./profilers/profiles.config.js');

// Get scenario
const scenario = config.getScenario('leakDetection');
// { name, duration, iterations, sampleInterval, ... }

// Evaluate metric
const result = config.evaluateMetric('forkTime', 2.5);
// 'good' | 'warning' | 'critical'

// Get regression alert
const alert = config.getAlert('memoryGrowth', 150000, 100000);
// { metric, change, severity, ... } or null
```

## Swarm Profiler API

### SwarmProfiler Class
- `constructor(options)` — Initialize with agent/message configuration
- `async run()` — Execute full profiling workflow
- `async initialize()` — Spawn agent workers
- `async sendMessage(agentIndex, message)` — Send message to agent
- `async runBenchmark()` — Execute configured scenario
- `async collectMetrics()` — Gather performance data
- `async cleanup()` — Terminate workers and release resources

### Configuration Options
```javascript
{
  agents: 5,                // Number of worker agents
  messages: 1000,           // Total messages to send
  duration: 30000,          // Profiling duration (ms)
  scenario: 'standard',     // 'standard'|'stress'|'latency'|'throughput'|'degradation'
  verbose: false            // Enable detailed logging
}
```

### Scenarios
1. **standard** — Balanced load, mixed message types
2. **stress** — Rapid bursts, maximum throughput
3. **latency** — Few messages, measure individual times
4. **throughput** — Continuous stream, async processing
5. **degradation** — Graduated phases (100→200→500→1000)

### Report Structure
```javascript
{
  timestamp,                // ISO timestamp
  scenario,                 // Profiling scenario name
  summary: {
    totalDuration,          // Total execution time (ms)
    agentCount,             // Number of agents
    messageCount,           // Messages processed
    messagesPerSecond,      // Throughput metric
    successRate,            // % successful messages
    errorCount              // Failed messages
  },
  performance: {
    startup: { ... },       // Agent startup metrics
    messageLatency: { ... } // End-to-end latency stats
  },
  memory: {
    before, after, delta    // Heap and RSS measurements
  },
  agentPerformance: [ ... ],// Per-agent breakdown
  errors: { ... },          // Error analysis
  bottlenecks: [ ... ]      // Auto-detected issues
}
```

## Sandbox Profiler Classes

### MemoryProfiler
- `start()` — Begin heap tracking
- `sample()` — Capture point-in-time snapshot
- `end()` — Return final metrics
- Tracks: heap usage, peak memory, GC behavior

### FDProfiler
- `start()` — Begin FD counting
- `sample()` — Capture FD count
- `end()` — Return FD metrics
- Detects: leaks, peaks, allocation patterns

### ForkSpawnProfiler
- `profileFork(modulePath, iterations)` — Profile fork() operations
- `profileSpawn(command, args, iterations)` — Profile spawn() operations
- Returns: fork time, IPC latency, cleanup time, memory/FD metrics

### LeakDetectionProfiler
- `profileLeaks(duration, sampleInterval)` — Long-running leak detection
- Simulates sandbox operations over extended period
- Returns: leak analysis with severity classification

### ConcurrencyProfiler
- `profileConcurrentForks(count, iterations)` — Test concurrent spawning
- Measures peak resource usage under load
- Returns: concurrency metrics with statistical summaries

### Reporter
- `reportForkSpawn(label, results)` — Format fork/spawn results
- `reportLeaks(label, results)` — Format leak detection results
- `reportConcurrency(label, results)` — Format concurrency results
- `save(filename)` — Export JSON to results directory
- Output: text (console) or JSON (file)

## Key Metrics

| Metric | Unit | Good | Warning | Critical |
|--------|------|------|---------|----------|
| Fork time | ms | <1.5 | <5 | >5 |
| IPC latency | ms | <20 | <50 | >50 |
| Cleanup time | ms | <5 | <10 | >10 |
| Memory growth | KB/s | <50 | <100 | >100 |
| FD leaks | per-op | 0 | 1-5 | >5 |
| CPU usage | ms/op | <10 | <25 | >25 |

## Profiling Scenarios

### 1. Quick Sanity (CI/CD Gate)
```bash
node profilers/swarm-sandbox-profiler.js
```
Duration: 1 min | Tests: fork, spawn | Output: text console

### 2. Comprehensive (Regression Test)
```bash
node profilers/swarm-sandbox-profiler.js --all-tests --output=json
```
Duration: 10 min | Tests: all | Output: JSON to results/

### 3. Leak Detection (Stability)
```bash
node --expose-gc profilers/swarm-sandbox-profiler.js --leak-detection --duration=1800000
```
Duration: 30 min | Tests: memory/FD leaks | Output: severity classification

### 4. Concurrency (Load Testing)
```bash
node profilers/swarm-sandbox-profiler.js --all-tests
```
Profile includes concurrent fork stress test

## Integration Points

### Pre-Commit Hook
```bash
# Fail if fork time > 2ms or memory leaks detected
node profilers/swarm-sandbox-profiler.js --output=json
```

### CI/CD Pipeline
```bash
# Gate: baseline comparison
node profilers/swarm-sandbox-profiler.js --iterations=20 --output=json
# Compare results against baseline threshold

# Nightly: full regression suite
node --expose-gc profilers/swarm-sandbox-profiler.js --all-tests --leak-detection
```

### Monitoring/Alerting
```javascript
// Export to Prometheus/Grafana
const config = require('./profilers/profiles.config.js');
if (config.reporting.export.prometheus) {
  // Set up Prometheus scraper
}
```

## Troubleshooting

**"Cannot fork: too many open files"**
- Increase ulimit: `ulimit -n 4096`
- Reduce concurrent fork count

**"Memory leaks detected but seems false-positive"**
- Run with `--expose-gc`: more accurate GC behavior
- Reduce sample interval for finer granularity
- Check background processes (may consume resources)

**"FD counting returns -1 (unavailable)"**
- Platform limitation (Windows/macOS without lsof)
- Use Linux/WSL for FD profiling
- Or integrate external FD counter

**"Profiler hangs or crashes"**
- Check system resources (memory, FDs)
- Reduce iterations or duration
- Check for zombie processes: `ps aux | grep defunct`

## Performance Tips

1. Run in isolation (close other apps)
2. Use `--expose-gc` for accurate memory profiling
3. Profile on target platform (Linux prod, etc.)
4. Use at least 5 iterations for statistical validity
5. Combine with system monitoring (top, Activity Monitor)
6. Run leak detection with extended duration (30+ min)
7. Compare results across multiple runs (noise filtering)

## Platform Support

| Feature | Linux | macOS | Windows |
|---------|-------|-------|---------|
| Fork profiling | ✓ | ✓ | ✗ |
| Spawn profiling | ✓ | ✓ | ✓ |
| FD counting | ✓ | ~ | ✗ |
| Memory profiling | ✓ | ✓ | ✓ |
| GC tracking | ✓ | ✓ | ✓ |

_✓ = fully supported, ~ = partial/manual, ✗ = not available_

## Next Steps

1. Run quick sanity check: `node profilers/swarm-sandbox-profiler.js`
2. Review output metrics against thresholds
3. If baseline OK, configure in CI/CD
4. Schedule nightly leak detection
5. Set up regression comparison with baseline.json
6. Monitor trends over time for capacity planning
