# Swarm Sandbox Load Testing

Comprehensive load testing suite for sandbox capacity analysis and resource exhaustion scenarios.

## Overview

`swarm-sandbox-load.js` simulates multi-agent sandbox environments under high-concurrency conditions:

- **100 concurrent sandboxes** with 5 agents each (500 total agents)
- **Initialization phase**: Measure setup latency for sandbox creation
- **Execution phase**: Measure task execution latency across all agents
- **Cleanup phase**: Measure resource cleanup latency and memory reclamation
- **Resource exhaustion scenarios**: Test system behavior at capacity limits

## Installation

```bash
node load-tests/swarm-sandbox-load.js [OPTIONS]
```

## Usage

### Run All Scenarios

```bash
node load-tests/swarm-sandbox-load.js --scenarios=all --report=json
```

### Run Specific Scenarios

```bash
# Initialization only
node load-tests/swarm-sandbox-load.js --scenarios=init

# Execution only
node load-tests/swarm-sandbox-load.js --scenarios=run

# Cleanup only
node load-tests/swarm-sandbox-load.js --scenarios=cleanup

# Multiple scenarios
node load-tests/swarm-sandbox-load.js --scenarios=init,run,cleanup

# Resource exhaustion
node load-tests/swarm-sandbox-load.js --scenarios=exhaustion
```

### Output Formats

```bash
# JSON report (default)
node load-tests/swarm-sandbox-load.js --report=json

# Markdown report
node load-tests/swarm-sandbox-load.js --report=md
```

### Verbose Output

```bash
node load-tests/swarm-sandbox-load.js --verbose
```

## Test Scenarios

### 1. Initialization Load Test

Tests the sandbox creation and configuration overhead.

**Metrics**:
- Sandbox initialization time (ms)
- Memory usage growth
- Agent configuration generation
- Manifest creation

**Success Criteria**:
- All 100 sandboxes initialize successfully
- Average init time < 100ms per sandbox
- Memory growth linear with sandbox count

### 2. Execution Load Test

Tests concurrent agent task execution across all sandboxes.

**Metrics**:
- Agent execution time (ms)
- Concurrency throughput
- Task completion latency (p50, p95, p99)
- Memory stability under load

**Success Criteria**:
- All 500 agents complete tasks successfully
- p99 execution latency < 5000ms
- Memory peak within acceptable bounds

### 3. Cleanup Latency Test

Tests resource cleanup and memory reclamation.

**Metrics**:
- Sandbox cleanup time (ms)
- File system removal latency
- Memory reclamation efficiency
- Cleanup parallelism impact

**Success Criteria**:
- Average cleanup time < 50ms per sandbox
- Memory released > 80% of peak
- No resource leaks detected

### 4. Resource Exhaustion Test

Tests system behavior when resources become constrained.

**Scenarios**:
- Attempt to create 2x expected sandboxes
- Monitor memory ceiling
- Track failure modes
- Measure graceful degradation

**Success Criteria**:
- System handles exhaustion gracefully
- Clear error messages on limit
- Partial success possible
- Consistent memory bounds

## Configuration

```javascript
const LOAD_CONFIG = {
  maxConcurrentSandboxes: 100,      // Number of simultaneous sandboxes
  totalAgents: 500,                 // Target agent count
  agentsPerSandbox: 5,              // Agents created per sandbox
  executionTimeoutMs: 30000,        // Task execution timeout
  cleanupTimeoutMs: 10000,          // Resource cleanup timeout
  memoryCheckIntervalMs: 1000,      // Memory sampling interval
  metricsInterval: 2000             // Metrics reporting interval
};
```

## Output

### Results Directory

Reports are saved to:
```
~/.claude/load-test-sandboxes/load-test-results/load-test-report-[timestamp].[json|md]
```

### JSON Report Structure

```json
{
  "timestamp": "2026-06-22T10:30:00Z",
  "config": { ... },
  "scenarios": [
    {
      "name": "Initialization",
      "duration": 12345,
      "metrics": {
        "initializationTime": [90, 95, 88, ...],
        "memoryPeak": 2048,
        "successCount": 100,
        "failureCount": 0
      }
    },
    ...
  ],
  "summary": {
    "totalDuration": 45000,
    "totalAgents": 500,
    "totalErrors": 0,
    "memoryPeak": 2048,
    "successRate": "100.00"
  }
}
```

### Console Output

```
[HH:MM:SS] [INFO] Starting initialization load test (100 sandboxes)...
[HH:MM:SS] [METRIC] Batch 1 complete. Memory: 512 MB
[HH:MM:SS] [SUCCESS] Initialization test complete

Results:
  Init Time (avg/p95/p99): 92ms / 110ms / 125ms
  Total Agents: 500
  Memory Start: 128 MB, Peak: 512 MB, End: 180 MB
  Success Rate: 100.00%
  Total Duration: 12.34s
```

## Performance Benchmarks

Expected results on modern hardware (Mac/Linux):

| Metric | Target | Acceptable | Failing |
|--------|--------|-----------|---------|
| Init Latency (avg) | <100ms | <150ms | >200ms |
| Init Latency (p99) | <150ms | <250ms | >300ms |
| Exec Latency (avg) | <500ms | <1000ms | >2000ms |
| Cleanup Latency (avg) | <50ms | <100ms | >200ms |
| Memory Peak | <1.5GB | <2.0GB | >3.0GB |
| Success Rate | 100% | 99% | <95% |

## Interpreting Results

### Good Results
- Consistent latency across all percentiles
- Linear memory growth with sandbox count
- Memory reclaimed after cleanup
- 100% success rate

### Warning Signs
- High variance in latencies (p99 >> avg)
- Non-linear memory growth
- Memory not reclaimed after cleanup
- Failures in execution or cleanup phases

### Failure Scenarios
- >10% failure rate
- Memory leaks (memory not reclaimed)
- p99 latencies > 5s
- System unresponsive

## Troubleshooting

### Out of Memory

If tests fail with memory errors:

1. Reduce `maxConcurrentSandboxes` to 50
2. Check system memory before running
3. Close other applications

### Slow Execution

If tests take unexpectedly long:

1. Check disk I/O performance
2. Verify system load
3. Run in isolation (no other processes)

### Test Failures

If tests report failures:

1. Check error messages in JSON report
2. Review `errors` array for details
3. Run with `--verbose` for debug output
4. Check file system permissions in `~/.claude/`

## Advanced Usage

### Custom Configuration

Edit `LOAD_CONFIG` in the script:

```javascript
const LOAD_CONFIG = {
  maxConcurrentSandboxes: 50,    // Reduce for resource-constrained systems
  agentsPerSandbox: 10,           // Increase for more complex scenarios
  ...
};
```

### Batch Sizes

Adjust batch sizes in test functions to control concurrency:

```javascript
const batchSize = 20;  // Process 20 sandboxes at a time
```

### Custom Scenarios

Add new test scenarios by extending `LoadTestScenario`:

```javascript
class LoadTestScenario {
  // ... base implementation
}

async function testCustom(config) {
  const scenario = new LoadTestScenario('Custom', config);
  // ... test implementation
  return scenario;
}
```

## Integration

### CI/CD Pipeline

```yaml
test-load:
  script:
    - node load-tests/swarm-sandbox-load.js --scenarios=all --report=json
  artifacts:
    paths:
      - ~/.claude/load-test-sandboxes/load-test-results/
```

### Monitoring

Track results over time:

```bash
# Run tests weekly
0 0 * * 0 node /path/to/swarm-sandbox-load.js --report=json
```

## Related Files

- `scripts/claudient-swarm-sandbox.js` — Sandbox orchestration CLI
- `scripts/swarm-sandbox-init.js` — Sandbox initialization
- `FAQ_SWARM_SANDBOX.md` — Sandbox FAQ
- `COMPLIANCE_CHECKLIST.md` — System compliance requirements

## License

See LICENSE file in repository root.
