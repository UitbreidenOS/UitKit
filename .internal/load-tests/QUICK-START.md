# Quick Start: Sandbox Load Testing

## One-Command Test Run

```bash
cd /Users/tushar/Desktop/Claudient
node load-tests/swarm-sandbox-load.js --scenarios=all --report=json
```

## What It Tests

| Test | Sandboxes | Agents | Duration | Purpose |
|------|-----------|--------|----------|---------|
| Initialization | 100 | 500 | ~30s | Setup latency |
| Execution | 100 | 500 | ~45s | Task throughput |
| Cleanup | 100 | 500 | ~25s | Resource cleanup |
| Exhaustion | 200+ | 1000+ | ~60s | Capacity limits |

## Example Output

```
[10:30:15] [INFO] Starting initialization load test (100 sandboxes)...
[10:30:25] [METRIC] Batch 1 complete. Memory: 512 MB
[10:30:45] [SUCCESS] Initialization test complete

Results:
  Init Time (avg/p95/p99): 92ms / 110ms / 125ms
  Total Agents: 500
  Memory Start: 128 MB, Peak: 512 MB, End: 180 MB
  Success Rate: 100.00%
  Total Duration: 30.15s
```

## Output Location

```
~/.claude/load-test-sandboxes/load-test-results/load-test-report-[timestamp].json
```

## Common Scenarios

### Test Only Initialization

```bash
node load-tests/swarm-sandbox-load.js --scenarios=init
```

### Test Only Cleanup

```bash
node load-tests/swarm-sandbox-load.js --scenarios=cleanup
```

### Test Resource Exhaustion

```bash
node load-tests/swarm-sandbox-load.js --scenarios=exhaustion --verbose
```

### Generate Markdown Report

```bash
node load-tests/swarm-sandbox-load.js --scenarios=all --report=md
```

### Verbose Debug Output

```bash
node load-tests/swarm-sandbox-load.js --scenarios=all --verbose
```

## Key Metrics

| Metric | Ideal | Warning | Failure |
|--------|-------|---------|---------|
| Init latency (avg) | <100ms | <150ms | >200ms |
| Exec latency (p99) | <2s | <5s | >10s |
| Cleanup latency (avg) | <50ms | <100ms | >200ms |
| Memory peak | <1.5GB | <2GB | >3GB |
| Success rate | 100% | >99% | <95% |

## Cleanup After Tests

```bash
rm -rf ~/.claude/load-test-sandboxes
```

## Architecture

**SandboxSimulator**: Simulates lifecycle (init → execute → cleanup)
- Creates directory structure
- Generates agent configs
- Simulates task execution
- Measures resource cleanup

**LoadTestScenario**: Collects metrics
- Tracks initialization time
- Measures execution latency
- Records cleanup duration
- Monitors memory usage

**Metrics**: Per-scenario reporting
- Min/Max/Avg latencies
- P95/P99 percentiles
- Memory peaks
- Error tracking
