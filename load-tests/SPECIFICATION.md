# Swarm Sandbox Load Test Specification

## Purpose

Measure and validate sandbox capacity, concurrency limits, and resource cleanup efficiency under high-load conditions simulating 100 concurrent sandboxes with 500 total agents.

## Design Requirements

### Load Profile

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Concurrent Sandboxes | 100 | Realistic multi-tenant scenario |
| Total Agents | 500 | 5 agents per sandbox (5 × 100) |
| Execution Timeout | 30s | Standard task timeout |
| Cleanup Timeout | 10s | Resource cleanup budget |
| Batch Size | 20 | Balance concurrency vs memory |

### Resource Metrics

**Memory Tracking**:
- Heap used at start
- Heap used at peak (per batch)
- Heap used at completion
- External memory usage
- RSS (resident set size)

**Latency Tracking** (all in milliseconds):
- Min, Max, Avg for each operation
- P95, P99 percentiles for variance
- Total operation duration

**Throughput Metrics**:
- Sandboxes initialized per second
- Agents processed per second
- Total system throughput

### Test Scenarios

#### Scenario 1: Initialization Load

**Objective**: Measure sandbox creation overhead

**Steps**:
1. Create 100 sandboxes sequentially in 5 batches of 20
2. For each sandbox, measure initialization time
3. Track memory usage per batch
4. Record any failures or timeouts

**Metrics Collected**:
- `initializationTime[]` — Array of init times (ms)
- `memoryPeak` — Maximum heap usage
- `successCount` — Successful initializations
- `failureCount` — Failed initializations

**Success Criteria**:
- 100% success rate
- Average latency < 100ms
- P99 latency < 250ms
- Linear memory growth

**Output**: Manifest files, agent configs, sandbox directory structure

#### Scenario 2: Execution Load

**Objective**: Measure concurrent task execution throughput

**Steps**:
1. Initialize 100 sandboxes
2. Execute all sandboxes concurrently in 5 batches of 20
3. For each sandbox, simulate 5 agents running tasks
4. Track execution time per sandbox
5. Measure memory stability under concurrent load

**Metrics Collected**:
- `executionTime[]` — Array of execution times (ms)
- `concurrencyLevel` — Number of simultaneous sandboxes
- `agentThroughput` — Agents per second
- `memoryPeak` — Maximum heap during execution

**Success Criteria**:
- 100% task completion
- Average latency < 1s
- P99 latency < 5s
- Memory plateau (no exponential growth)

**Output**: Execution logs, task results, timing telemetry

#### Scenario 3: Cleanup Latency

**Objective**: Measure resource cleanup and memory reclamation

**Steps**:
1. Create 100 fully populated sandboxes (init + exec)
2. Cleanup all sandboxes concurrently in 5 batches of 20
3. Measure cleanup time per sandbox
4. Verify directory removal
5. Measure memory reclaimed post-cleanup

**Metrics Collected**:
- `cleanupTime[]` — Array of cleanup times (ms)
- `memoryReclaimed` — Percentage of peak reclaimed
- `fileSystemLatency` — Directory removal time

**Success Criteria**:
- Average cleanup < 50ms
- P99 cleanup < 200ms
- Memory reclaimed > 80%
- All directories removed

**Output**: Cleanup logs, resource audit

#### Scenario 4: Resource Exhaustion

**Objective**: Test graceful degradation at capacity limits

**Steps**:
1. Attempt to create 200 sandboxes (2x target)
2. Monitor system until memory threshold
3. Track failure modes
4. Measure partial completion

**Metrics Collected**:
- `sandboxesCreated` — Successful creations before limit
- `sandboxesFailed` — Failed creations
- `memoryThreshold` — MB at which exhaustion occurs
- `errorModes` — Categories of failures

**Success Criteria**:
- Graceful failure (no crashes)
- Clear error messages
- Partial success possible
- Memory bounded < 3GB

**Output**: Exhaustion report, error analysis

## Implementation Details

### SandboxSimulator Class

```javascript
class SandboxSimulator {
  // Lifecycle methods
  async initialize()  // Create dirs, manifests, agent configs
  async execute()     // Simulate task execution
  async cleanup()     // Remove all resources
  
  // Properties
  name              // Sandbox name
  id                // Unique identifier
  agentCount        // Number of agents
  status            // created|initialized|running|idle|cleaned
  path              // Filesystem location
  executions        // Array of execution logs
  
  // Metrics
  getStats()        // Return timing and status
}
```

### LoadTestScenario Class

```javascript
class LoadTestScenario {
  // Core methods
  recordMetric(name, value)   // Add metric sample
  recordError(error)          // Track errors
  getStats()                  // Calculate percentiles
  
  // Properties
  name                        // Scenario name
  sandboxes[]                 // Array of SandboxSimulator
  results {}                  // Aggregated metrics
  
  // Result structure
  results.metrics {
    initializationTime[]      // Latency samples
    executionTime[]           // Latency samples
    cleanupTime[]             // Latency samples
    memoryPeak                // Max heap usage
    successCount              // Successful operations
    failureCount              // Failed operations
  }
}
```

### Batch Processing

Sandboxes processed in batches to:
- Control memory usage (prevent OOM)
- Allow metrics collection between batches
- Enable real-time progress reporting
- Simulate realistic concurrent load

**Batch size**: 20 sandboxes per batch
- Allows 5 batches for 100 sandboxes
- Manageable memory footprint (~200-500MB)
- Realistic concurrency level

## Metrics Definition

### Latency Metrics

All latency measurements in milliseconds (ms):

```javascript
percentiles = {
  min: Math.min(...samples),
  max: Math.max(...samples),
  avg: Math.mean(...samples),
  p95: samples[Math.ceil(samples.length * 0.95) - 1],
  p99: samples[Math.ceil(samples.length * 0.99) - 1]
}
```

### Memory Metrics

All memory measurements in MB:

- `heapUsed` — V8 heap allocation
- `heapTotal` — V8 heap size
- `external` — External memory (buffers, etc)
- `rss` — Resident set size (OS view)

**Peak detection**: Maximum `heapUsed` across all samples

**Reclamation**: `(peak - end) / peak * 100`

### Throughput Metrics

- **Initialization throughput**: sandboxes/sec
- **Execution throughput**: agents/sec
- **Cleanup throughput**: sandboxes/sec

Calculated as: `count / (duration in seconds)`

## Report Structure

### JSON Report

```json
{
  "timestamp": "ISO8601",
  "config": {
    "maxConcurrentSandboxes": 100,
    "totalAgents": 500,
    "agentsPerSandbox": 5
  },
  "scenarios": [
    {
      "name": "Initialization",
      "startTime": "ISO8601",
      "endTime": "ISO8601",
      "duration": 12345,
      "metrics": {
        "initializationTime": [95, 88, 102, ...],
        "executionTime": [],
        "cleanupTime": [],
        "memoryStart": 128,
        "memoryPeak": 512,
        "memoryEnd": 180,
        "successCount": 100,
        "failureCount": 0,
        "errors": []
      }
    }
  ],
  "summary": {
    "totalDuration": 45000,
    "totalAgents": 500,
    "totalErrors": 0,
    "memoryPeak": 512,
    "successRate": "100.00"
  }
}
```

### Markdown Report

Tabular format with:
- Scenario results
- Latency distributions
- Memory usage
- Success rates
- Error summary

## Performance Thresholds

### Target Performance

| Metric | Value | Notes |
|--------|-------|-------|
| Init latency (avg) | <100ms | Per sandbox |
| Init latency (p99) | <150ms | 99th percentile |
| Exec latency (avg) | <500ms | Per sandbox |
| Exec latency (p99) | <2s | 99th percentile |
| Cleanup latency (avg) | <50ms | Per sandbox |
| Cleanup latency (p99) | <100ms | 99th percentile |
| Memory peak | <1.5GB | During peak load |
| Memory reclaim | >80% | After cleanup |
| Success rate | 100% | No failures |

### Warning Thresholds

Values indicating potential issues:

| Metric | Threshold | Action |
|--------|-----------|--------|
| Latency variance | p99/avg > 5 | Investigate jitter |
| Memory growth | Non-linear | Check for leaks |
| Memory peak | >2GB | Reduce batch size |
| Failure rate | >1% | Investigate errors |
| Reclamation | <70% | Check cleanup logic |

### Failure Thresholds

Values indicating test failure:

| Metric | Threshold | Failure |
|--------|-----------|---------|
| Latency (p99) | >10s | Timeout |
| Memory peak | >3GB | OOM risk |
| Failure rate | >10% | Reliability issue |
| Memory reclaim | <50% | Memory leak |
| Success rate | <90% | System unstable |

## Test Execution Flow

```
Main Test Run
├── Configuration Validation
├── Directory Setup
├── Scenario Selection
├── For each scenario:
│   ├── Initialize SandboxSimulator objects
│   ├── Record start metrics (memory, time)
│   ├── For each batch:
│   │   ├── Execute operation (init/run/cleanup)
│   │   ├── Record latency metrics
│   │   ├── Sample memory usage
│   │   ├── Report batch completion
│   ├── Record end metrics
│   ├── Calculate percentiles
│   ├── Print scenario summary
├── Aggregate all scenarios
├── Generate report
├── Save to disk
└── Print final summary
```

## Error Handling

### Error Categories

| Category | Example | Handling |
|----------|---------|----------|
| FS Errors | EACCES, ENOENT | Logged, failure recorded |
| OOM | Heap limit | Graceful failure, continue |
| Timeout | Exceeds deadline | Mark failed, continue |
| Validation | Bad config | Pre-flight check, stop |

### Error Recording

Each error includes:
- Timestamp
- Error message
- Stack trace (optional)
- Context (scenario, sandbox ID)

### Recovery Strategy

- Per-sandbox errors don't stop test
- Batch processing allows partial success
- Final report includes error summary
- Operator can rerun failed scenarios

## File Artifacts

Created during test execution:

```
~/.claude/load-test-sandboxes/
├── load-test-init-0/
│   ├── sandbox-manifest.json
│   ├── agents/
│   │   ├── agent-*.json
│   ├── executions/
│   │   ├── exec-id/
│   │   │   └── execution.json
│   ├── logs/
│   └── artifacts/
├── load-test-init-1/
│   └── [same structure]
...
└── load-test-results/
    └── load-test-report-[timestamp].json
```

## Cleanup Strategy

Post-test cleanup:

```bash
rm -rf ~/.claude/load-test-sandboxes
```

**Or programmatic**: `SandboxSimulator.cleanup()` removes all artifacts

## Integration Points

### CI/CD Integration

- Exit code 0: All tests passed
- Exit code 1: Test failure
- JSON report: Machine-readable results
- Markdown report: Human-readable summary

### Monitoring/Alerting

- Track metrics over time
- Alert on regression (latency increase)
- Alert on resource leak (memory increase)
- Dashboard visualization

### Performance Baseline

Establish baseline metrics:
- Record initial results
- Compare subsequent runs
- Trend analysis for degradation

## Future Enhancements

1. **Custom workloads**: Variable agent task complexity
2. **Network simulation**: Latency/packet loss injection
3. **Error injection**: Sandbox failure scenarios
4. **Long-running tests**: 24hr+ capacity tests
5. **Distributed testing**: Multi-machine load
6. **Real agent execution**: Claude API integration
7. **Profiling**: Detailed CPU/memory profiling

## Related Documentation

- `README.md` — User guide
- `QUICK-START.md` — Quick reference
- `FAQ_SWARM_SANDBOX.md` — Architecture FAQ
- `COMPLIANCE_CHECKLIST.md` — System requirements
