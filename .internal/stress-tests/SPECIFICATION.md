# Swarm Sandbox Stress Test Specification

## Executive Summary

The stress test suite evaluates sandbox infrastructure resilience under extreme conditions. It measures system behavior when:
- Resource limits are approached/exceeded
- Concurrent load far exceeds normal operation
- Failures are injected systematically
- Cleanup must happen under time pressure

## Requirements

### Functional Requirements

1. **Concurrent Sandbox Management** (FR-1)
   - Support 200+ concurrent sandbox instances
   - Track sandbox lifecycle: creation → initialization → execution → cleanup
   - Inject controlled failures at each lifecycle stage

2. **Resource Monitoring** (FR-2)
   - Track heap memory usage throughout test
   - Record peak memory consumption
   - Detect memory exhaustion scenarios

3. **Failure Injection** (FR-3)
   - Configurable failure rates (5-25%)
   - Random failure injection at init/exec/cleanup stages
   - Track failure reasons and cascading effects

4. **Cleanup Pressure Testing** (FR-4)
   - Enforce configurable cleanup timeouts (1-5s)
   - Test cleanup under active memory pressure
   - Measure cleanup latency percentiles

5. **Reporting** (FR-5)
   - Generate JSON and markdown reports
   - Include detailed metrics (min/max/avg/p95/p99)
   - Record error traces for failed operations

### Non-Functional Requirements

1. **Performance** (NFR-1)
   - Complete full test suite in < 10 minutes
   - Support per-scenario execution for targeted testing
   - Batch operations to minimize total runtime

2. **Observability** (NFR-2)
   - Real-time progress logging during execution
   - Memory checkpoint logging every 20 sandboxes
   - Colored output for terminal readability

3. **Portability** (NFR-3)
   - Run on macOS (Darwin) and Linux
   - Use Node.js 18+ standard library only
   - No external dependencies required

4. **Reliability** (NFR-4)
   - Handle all I/O errors gracefully
   - Timeout protection on all async operations
   - Cleanup even if individual operations fail

## Architecture

### Components

```
StressSandbox
├─ initialize(): Create directory structure + agent configs
├─ execute(): Simulate workload + memory allocation
├─ cleanup(): Recursive deletion + timeout protection
└─ getStats(): Return lifecycle metrics

StressTestScenario
├─ recordMetric(): Accumulate measurement data
├─ recordError(): Track failure details
└─ getStats(): Calculate percentiles + rates

Main Test Harness
├─ testInitializationStorm(): Rapid concurrent creation
├─ testExecutionPressure(): Sustained workload stress
├─ testCleanupUnderPressure(): Aggressive cleanup cycles
├─ testCascadingFailure(): Chain reaction detection
└─ generateReport(): Metrics aggregation + export
```

### Data Flow

```
STRESS CONFIG
    ↓
CREATE SANDBOXES (inject failures randomly)
    ↓
EXECUTE WORKLOADS (memory allocation)
    ↓
MONITOR METRICS (batch reporting)
    ↓
CLEANUP WITH TIMEOUT (parallel batches)
    ↓
AGGREGATE RESULTS
    ↓
GENERATE REPORT (JSON/Markdown)
```

## Test Scenarios

### Scenario 1: Initialization Storm

**Objective**: Measure creation throughput and initialization bottlenecks

**Workload Profile**:
- Create N sandboxes in parallel batches (batch size = config.cleanupBatchSize)
- Each sandbox: 5-10 agent config files + directory structure
- Failure injection at initialization stage

**Metrics**:
- Initialization time per sandbox (ms)
- Peak memory during creation phase
- Failure count and reasons
- Success rate

**Success Criteria** (High Stress):
- p99 initialization < 500ms
- Memory growth linear with concurrent load
- Failure rate < 10%

### Scenario 2: Execution Pressure

**Objective**: Test system stability under sustained workload

**Workload Profile**:
- Initialize all sandboxes
- Execute all sandboxes concurrently with:
  - Simulated agent work (1-10s per agent)
  - Memory buffer allocation (per config)
  - File creation per execution
- Track execution completion and failures

**Metrics**:
- Execution time per sandbox
- Memory peak during execution
- Cascading failure detection
- Failure reasons

**Success Criteria** (High Stress):
- p99 execution < 5000ms
- Memory doesn't exceed 2GB threshold
- Cascading failures < 5

### Scenario 3: Cleanup Under Pressure

**Objective**: Test resource recovery and cleanup efficiency

**Workload Profile**:
- Prepare N sandboxes with artifacts (files + memory)
- Cleanup with tight timeout windows (per config)
- Batch cleanup to maximize concurrent operations
- Track cleanup completion and timeouts

**Metrics**:
- Cleanup time per sandbox
- Timeout count and rate
- Memory recovery (end vs peak)
- Cleanup success rate

**Success Criteria** (High Stress):
- p99 cleanup < 2000ms
- Timeout rate < 5%
- Memory end ≈ memory start (recovery)
- Success rate > 95%

### Scenario 4: Cascading Failure

**Objective**: Detect failure propagation and recovery limits

**Workload Profile**:
- Sequential sandbox creation with failure injection
- Stop when failure rate exceeds 30%
- Track failure reasons and dependencies
- Measure system resilience

**Metrics**:
- Sandboxes created before cascade
- Failure rate trajectory
- Cascading failure count
- System stability assessment

**Success Criteria**:
- Creates > 60% of target sandboxes
- Failure rate increase is gradual (not sudden)
- No infinite failure loops

## Metrics Definition

### Timing Metrics (Milliseconds)

- **Initialization Time**: From sandbox creation start to initialization completion
- **Execution Time**: From execute() call to completion
- **Cleanup Time**: From cleanup() start to directory removal completion

### Memory Metrics (Megabytes)

- **Memory Start**: Heap used at test scenario start
- **Memory Peak**: Maximum heap usage during scenario
- **Memory End**: Heap used at scenario completion

### Count Metrics

- **Success Count**: Sandboxes that completed lifecycle successfully
- **Failure Count**: Sandboxes that failed at any stage
- **Timeout Count**: Sandboxes that exceeded cleanup timeout
- **Cascading Failures**: Failed sandboxes triggered by upstream failures

### Rate Metrics (Percentage)

- **Failure Rate** = (failureCount / totalSandboxes) × 100
- **Success Rate** = (successCount / totalSandboxes) × 100

### Percentile Metrics

For timing data, compute:
- **p95**: 95th percentile (upper quartile of observations)
- **p99**: 99th percentile (tail behavior)

Formula for p95 on sorted array [0..N]:
```
index = ceil(N × 0.95) - 1
p95 = array[index]
```

## Configuration Matrix

| Level | Sandboxes | Agents | Memory/Spike | Failure Rate | Cleanup Timeout |
|-------|-----------|--------|-------------|--------------|-----------------|
| Low | 50 | 3 | 50 MB | 5% | 5s |
| Medium | 100 | 5 | 150 MB | 10% | 3s |
| High | 150 | 8 | 300 MB | 15% | 2s |
| Extreme | 200 | 10 | 500 MB | 25% | 1s |

## Report Format

### JSON Schema

```json
{
  "timestamp": "ISO8601",
  "stressTests": [
    {
      "name": "Test Name",
      "stressLevel": "high",
      "duration": 12345,
      "metrics": {
        "initializationTimes": [float],
        "executionTimes": [float],
        "cleanupTimes": [float],
        "failureCount": int,
        "successCount": int,
        "timeoutCount": int,
        "memoryPeak": int,
        "memoryStart": int,
        "memoryEnd": int,
        "cascadingFailures": [{sandbox, reason}]
      },
      "errorCount": int
    }
  ],
  "summary": {
    "totalDuration": int,
    "totalErrors": int,
    "totalFailures": int,
    "totalTimeouts": int,
    "memoryPeak": int
  }
}
```

## Testing Approach

### Phase 1: Baseline (Low Stress)
Run low-stress scenario to establish healthy baseline metrics.

### Phase 2: Progressive Load (Medium → High)
Gradually increase stress to find inflection points and degradation patterns.

### Phase 3: Breaking Point (Extreme)
Push to extreme conditions to identify hard limits and failure modes.

### Phase 4: Diagnosis
For any failure, review:
1. Error stack traces in report
2. Memory trajectory graph
3. Failure rate growth timeline
4. Cascading failure dependencies

## Success Criteria by Stress Level

### Low Stress
- All metrics: p99 well within nominal ranges
- Failure rate < 5%
- Memory recovery > 80%

### Medium Stress
- Init p99 < 500ms
- Exec p99 < 5000ms
- Cleanup p99 < 2000ms
- Failure rate < 10%
- Memory recovery > 75%

### High Stress
- Init p99 < 1000ms
- Exec p99 < 8000ms
- Cleanup p99 < 3000ms
- Failure rate < 15%
- Cascading failures < 10
- Memory recovery > 70%

### Extreme Stress
- System remains stable
- No infinite failure loops
- Timeouts managed gracefully
- Failure rate < 30% (controlled)

## Troubleshooting Guide

### High Cleanup Timeouts
**Symptom**: `timeoutCount > 5%` in high stress

**Diagnosis**:
- Cleanup batch size too large
- Filesystem I/O bottleneck
- Memory pressure causing slowness

**Remediation**:
- Reduce `cleanupBatchSize` config
- Increase `cleanupTimeoutMs`
- Monitor disk I/O during test

### Cascading Failures
**Symptom**: `cascadingFailures[]` populated

**Diagnosis**:
- Initialization failure rate too high
- Shared resource contention
- File descriptor limits

**Remediation**:
- Reduce `failureInjectionRate`
- Implement file descriptor recycling
- Check OS limits: `ulimit -n`

### Memory Not Recovering
**Symptom**: `memoryEnd > memoryPeak × 0.8`

**Diagnosis**:
- Buffers not being freed
- Garbage collection not triggered
- File handles held open

**Remediation**:
- Ensure cleanup clears `memoryBuffers[]`
- Call `global.gc()` if available
- Verify file handle cleanup in filesystem

## Integration with CI/CD

```bash
# Run before deployment
npm run test:stress -- --stress-level=high --report=json

# Fail if timeouts exceed threshold
node scripts/validate-stress-report.js stress-test-results/latest.json

# Archive results for trend analysis
cp stress-test-results/latest.json ci-artifacts/stress-$(date +%s).json
```

## Performance Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Init p99 | < 300ms | > 500ms | > 1000ms |
| Exec p99 | < 3000ms | > 5000ms | > 8000ms |
| Cleanup p99 | < 1000ms | > 2000ms | > 3000ms |
| Memory Peak | < 1024 MB | > 1500 MB | > 2000 MB |
| Failure Rate | < 5% | > 10% | > 20% |
| Timeout Rate | < 2% | > 5% | > 10% |

## Revision History

- v1.0 (2026-06-22): Initial specification
  - 4 stress test scenarios
  - 4 configurable stress levels
  - JSON + Markdown reporting
  - Memory exhaustion + failure injection
