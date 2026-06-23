# Swarm Sandbox Stress Tests

Comprehensive stress testing suite for sandbox swarm infrastructure. Tests resource exhaustion, failure modes, cascading degradation, and cleanup under extreme conditions.

## Overview

This directory contains stress tests that push sandbox infrastructure to its limits:

- **100+ concurrent sandboxes** with configurable agent loads
- **Resource exhaustion scenarios** with controlled memory spikes
- **Failure injection** at configurable rates
- **Aggressive cleanup** with timeout enforcement
- **Cascading failure detection** across sandbox pools

## Files

### `swarm-sandbox-stress.js`

Main stress test harness with four distinct test scenarios:

1. **Initialization Storm**: Rapid concurrent sandbox creation
2. **Execution Pressure**: Concurrent execution with memory-intensive workloads
3. **Cleanup Under Pressure**: Aggressive cleanup with tight batch windows
4. **Cascading Failure**: Chain-reaction failure detection

## Usage

```bash
# Run with default (medium) stress level
node swarm-sandbox-stress.js

# Run with specific stress level
node swarm-sandbox-stress.js --stress-level=high
node swarm-sandbox-stress.js --stress-level=extreme

# Generate markdown report instead of JSON
node swarm-sandbox-stress.js --stress-level=high --report=md

# Enable verbose logging
node swarm-sandbox-stress.js --stress-level=high --verbose
```

## Stress Levels

### Low
- 50 concurrent sandboxes
- 3 agents per sandbox
- 5% failure injection rate
- Moderate memory spikes (50 MB)

### Medium (Default)
- 100 concurrent sandboxes
- 5 agents per sandbox
- 10% failure injection rate
- 150 MB memory spikes
- 3s cleanup timeout

### High
- 150 concurrent sandboxes
- 8 agents per sandbox
- 15% failure injection rate
- 300 MB memory spikes
- 2s cleanup timeout

### Extreme
- 200 concurrent sandboxes
- 10 agents per sandbox
- 25% failure injection rate
- 500 MB memory spikes
- 1s cleanup timeout

## Output

Reports are saved to `~/.claude/stress-test-sandboxes/stress-test-results/`

### JSON Report Format

```json
{
  "timestamp": "2026-06-22T...",
  "stressTests": [
    {
      "name": "Initialization Storm",
      "stressLevel": "high",
      "duration": 45230,
      "metrics": {
        "initializationTimes": [...],
        "failureCount": 12,
        "memoryPeak": 1024,
        "cascadingFailures": [...]
      }
    }
  ],
  "summary": {
    "totalDuration": 180000,
    "totalErrors": 24,
    "totalFailures": 45,
    "totalTimeouts": 8,
    "memoryPeak": 2048
  }
}
```

### Markdown Report Format

Human-readable summary with statistics per test scenario.

## Metrics

Each stress test reports:

- **Init Time**: Min/max/avg/p95/p99 initialization duration
- **Exec Time**: Execution performance under stress
- **Cleanup Time**: Cleanup latency including timeouts
- **Memory Peak**: Peak heap usage during test
- **Failure Rate**: Percentage of failed sandboxes
- **Timeouts**: Count of cleanup timeouts
- **Cascading Failures**: Failed sandboxes triggered by upstream failures

## Test Scenarios Explained

### Initialization Storm
Measures how quickly the system can bootstrap large numbers of sandboxes in parallel. Useful for understanding cold-start capacity and detecting initialization bottlenecks.

### Execution Pressure
Stresses the system during active sandbox execution. Simulates sustained workload with memory allocation and file creation. Detects resource leaks and degradation under continuous load.

### Cleanup Under Pressure
Tests aggressive cleanup with tight timeout windows. Measures ability to recover resources quickly. High failure rates indicate cleanup bottlenecks.

### Cascading Failure
Sequential sandbox creation with failure injection. Stops when failure rate exceeds 30%. Detects cascading failure patterns and recovery mechanisms.

## Integration with Load Tests

This suite complements `../load-tests/swarm-sandbox-load.js`:

| Aspect | Load Tests | Stress Tests |
|--------|-----------|--------------|
| Focus | Capacity measurement | Failure modes |
| Failure Rate | 0-5% natural failures | 5-25% injected failures |
| Cleanup | Standard batching | Aggressive timeouts |
| Memory Spikes | Baseline workload | Intentional exhaustion |
| Duration | Steady state | Peak conditions |

## Interpreting Results

### Healthy Results (High Stress)
- Init p99 < 500ms
- Exec p99 < 5000ms
- Cleanup p99 < 2000ms
- Failure rate < 10%
- Timeout count < 5%

### Warning Signs
- Cleanup timeouts increasing with stress level
- Cascading failures detected
- Memory not recovering after cleanup
- Failure rate > 20%

### Critical Issues
- Timeout rate > 30%
- Memory leaks (end > peak)
- Cascading failures > 50%
- Init/exec failures > 25%

## Performance Tuning

To improve stress test results:

1. **Increase cleanup batches** if timeouts are occurring
2. **Reduce memory spikes** if exhaustion tests fail early
3. **Add garbage collection hooks** for better memory recovery
4. **Implement timeout recovery** for long-running cleanups
5. **Add circuit breakers** to prevent cascading failures

## Development Notes

- Tests use simulated sandboxes (file-based, not real subprocesses)
- Memory allocation is actual heap usage (not faked)
- Failure injection uses seeded randomness for reproducibility
- All file I/O uses synchronous operations for determinism
