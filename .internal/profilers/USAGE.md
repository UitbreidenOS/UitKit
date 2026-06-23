# Profiler Usage Guide

Practical examples for profiling sandbox operations.

## Quick Start

```bash
# Basic profiling (fork + spawn, 5 iterations each)
node profilers/swarm-sandbox-profiler.js

# Extended profiling with leak detection
node profilers/swarm-sandbox-profiler.js --leak-detection --duration=60000

# High-iterations profiling (20 runs, detect subtle leaks)
node profilers/swarm-sandbox-profiler.js --iterations=20 --leak-detection
```

## Scenario: Detect Memory Leaks

**Problem**: Sandbox operations are consuming memory over time.

**Solution**:

```bash
# Profile with aggressive GC (Node.js 12+)
node --expose-gc profilers/swarm-sandbox-profiler.js \
  --leak-detection \
  --duration=60000

# Check JSON output for leakAnalysis.severity
```

**Interpretation**:
- `memoryGrowthPerSec > 100`: Likely leak
- `memoryLeakDetected: true`: Confirmed leak
- `severity: CRITICAL`: Urgent remediation needed

## Scenario: Optimize Fork Performance

**Problem**: Child process creation is slow.

**Solution**:

```bash
# Measure baseline fork time
node profilers/swarm-sandbox-profiler.js --iterations=20 --output=json

# Review "Fork Performance Profile" section
# Look for high P95/P99 latencies (indicate contention)

# Test under concurrent load
node profilers/swarm-sandbox-profiler.js --all-tests
```

**Optimization Targets**:
- Fork time > 5 ms: Check system load (ulimit -n for FDs)
- IPC latency > 50 ms: Use binary protocols or batch messages
- Cleanup time > 10 ms: Implement graceful termination strategies

## Scenario: Find File Descriptor Leaks

**Problem**: System runs out of file descriptors (ulimit hit).

**Solution** (Linux only):

```bash
# Profile FD usage
node profilers/swarm-sandbox-profiler.js --iterations=50

# Check "Cleanup Performance" section for fdLeak values
# If fdLeak > 0, descriptors are not being closed

# Detailed FD tracking (JSON output for scripting)
node profilers/swarm-sandbox-profiler.js --output=json --iterations=50
```

**Debugging**:
```bash
# Monitor system FDs during profile
watch -n 0.5 'lsof -p $$ | wc -l'

# List actual open FDs
lsof -p $$
```

## Scenario: Baseline Profiling for CI/CD

**Setup**: Add profiler to regression tests.

```bash
# Generate baseline (run on clean system)
node profilers/swarm-sandbox-profiler.js \
  --all-tests \
  --iterations=10 \
  --leak-detection \
  --duration=30000 \
  --output=json > baseline.json

# Store baseline.json in version control or S3
# On each PR, compare new profile to baseline
```

**Comparison Script** (example):
```javascript
const baseline = require('./baseline.json');
const current = require('./current.json');

const baselineForkTime = baseline['Fork Performance Profile'].fork
  .reduce((sum, r) => sum + r.time, 0) / baseline['Fork Performance Profile'].fork.length;

const currentForkTime = current['Fork Performance Profile'].fork
  .reduce((sum, r) => sum + r.time, 0) / current['Fork Performance Profile'].fork.length;

const regression = ((currentForkTime - baselineForkTime) / baselineForkTime) * 100;

if (regression > 10) {
  console.error(`REGRESSION: Fork time increased by ${regression.toFixed(1)}%`);
  process.exit(1);
}
```

## Scenario: Validate Sandbox Cleanup

**Problem**: Zombie processes or lingering resources after sandbox termination.

**Solution**:

```bash
# Monitor process count during profiling
# (in separate terminal)
watch -n 1 'ps aux | grep node | wc -l'

# Run profiler
node profilers/swarm-sandbox-profiler.js --iterations=30

# Check cleanup metrics
# Expected: cleanup time < 5ms, no FD leaks
```

## Scenario: Concurrency Testing (Load Spike)

**Problem**: System fails when many sandboxes spawn concurrently.

**Solution**:

```bash
# Modify profiler to test 50 concurrent forks
# Edit ConcurrencyProfiler call or extend the profiler

node profilers/swarm-sandbox-profiler.js --all-tests

# Review "Concurrent Fork Profile" section
# Peak memory, peak FDs should not exceed system limits
```

## JSON Output Schema

```json
{
  "Fork Performance Profile": {
    "fork": [
      {
        "iteration": 1,
        "time": 1.45,
        "memory": {
          "startHeapUsed": 2097152,
          "finalHeapUsed": 3145728,
          "peakHeapUsed": 4194304,
          "heapGrowth": 1048576,
          "peakGrowth": 2097152,
          "samples": [
            {
              "timestamp": 1719070166000,
              "heapUsed": 2097152,
              "heapTotal": 8388608,
              "external": 0,
              "rss": 51314688
            }
          ]
        },
        "fds": {
          "startFDs": 15,
          "finalFDs": 15,
          "peakFDs": 18,
          "fdLeak": 0,
          "samples": [
            { "timestamp": 1719070166000, "count": 15 }
          ]
        }
      }
    ],
    "ipc": [
      {
        "iteration": 1,
        "latency": 26.93
      }
    ],
    "cleanup": [
      {
        "iteration": 1,
        "time": 2.46,
        "fdLeak": 0
      }
    ]
  },
  "Memory & FD Leak Detection": {
    "duration": 30000,
    "sampleCount": 300,
    "memory": {
      "startHeapUsed": 2097152,
      "finalHeapUsed": 2621440,
      "peakHeapUsed": 5242880,
      "heapGrowth": 524288,
      "peakGrowth": 3145728,
      "samples": [...]
    },
    "fileDescriptors": {
      "startFDs": 15,
      "finalFDs": 15,
      "peakFDs": 25,
      "fdLeak": 0,
      "samples": [...]
    },
    "leakAnalysis": {
      "memoryLeakDetected": false,
      "memoryGrowthRate": 0.017,
      "memoryGrowthPerSec": 17.5,
      "fdLeakDetected": false,
      "fdLeakCount": 0,
      "severity": "LOW"
    }
  }
}
```

## Thresholds & Actions

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Fork time (ms) | < 2 | 2–5 | > 5 |
| IPC latency (ms) | < 20 | 20–50 | > 50 |
| Cleanup time (ms) | < 5 | 5–10 | > 10 |
| Memory growth (bytes/sec) | < 50K | 50K–100K | > 100K |
| FD leaks per op | 0 | 1–5 | > 5 |
| Cleanup FD leak | 0 | 0–2 | > 2 |

## Performance Tuning Checklist

- [ ] Run baseline profiler on clean system
- [ ] Verify no background processes consume resources
- [ ] Test with and without `--expose-gc`
- [ ] Compare across Node.js versions (12, 14, 16, 18+)
- [ ] Run on target platform (Linux prod, macOS dev, Windows)
- [ ] Profile at different system load levels
- [ ] Document baseline numbers in runbook
- [ ] Set up CI/CD regression detection
- [ ] Use profiler output for capacity planning
