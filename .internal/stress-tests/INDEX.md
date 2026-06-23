# Stress Test Suite Index

## Overview

The stress test suite provides comprehensive evaluation of sandbox swarm infrastructure under extreme load and failure conditions. It complements the load tests by focusing on failure modes, resource exhaustion, and recovery.

## Files

### Core Test Files

#### `swarm-sandbox-stress.js` (32 KB, executable)
**Purpose**: Main stress test harness with 4 distinct scenarios

**Key Classes**:
- `StressSandbox`: Simulated sandbox with lifecycle management (init/execute/cleanup)
- `StressTestScenario`: Test harness for metrics collection and reporting
- Utility functions: `getMemoryUsage()`, `shouldInjectFailure()`, `allocateMemory()`

**Test Scenarios**:
1. Initialization Storm: 50-200 concurrent sandbox creation
2. Execution Pressure: Sustained workload with memory stress
3. Cleanup Under Pressure: Aggressive cleanup with timeouts
4. Cascading Failure: Sequential creation with failure injection

**Features**:
- Configurable stress levels (low/medium/high/extreme)
- Failure injection at 5-25% rates
- Memory spike simulation (50-500 MB per sandbox)
- Timeout protection on cleanup operations
- JSON and Markdown report generation

**Usage**:
```bash
node swarm-sandbox-stress.js [--stress-level=low|medium|high|extreme] [--report=json|md] [--verbose]
```

**Output**: JSON/Markdown report saved to `~/.claude/stress-test-sandboxes/stress-test-results/`

---

### Documentation Files

#### `README.md`
Complete guide to stress testing infrastructure.

**Sections**:
- Overview and use cases
- Stress levels and configuration matrix
- Usage examples and command reference
- Output format and metric definitions
- Test scenario descriptions
- Integration with load tests comparison table
- Interpreting results and performance tuning
- Development notes

**Audience**: Developers, DevOps, test engineers

---

#### `SPECIFICATION.md`
Technical specification for stress test design and metrics.

**Sections**:
- Executive summary and objectives
- Functional requirements (FR-1 through FR-5)
- Non-functional requirements (NFR-1 through NFR-4)
- Architecture and data flow diagrams
- Detailed scenario specifications
- Metrics definitions and formulas
- Configuration matrix with all 4 stress levels
- JSON report schema
- Testing approach and phases
- Success criteria by stress level
- Troubleshooting guide
- CI/CD integration
- Performance targets table

**Use Cases**:
- Understanding design decisions
- Validating implementation
- Setting performance baselines
- Troubleshooting failures
- CI/CD pipeline design

**Audience**: Architects, performance engineers, tech leads

---

#### `QUICK-START.md`
Fast-track guide for running stress tests.

**Sections**:
- 2-minute quick start
- Stress level selection guide (3-15 min tests)
- Report output and viewing
- Result interpretation (good/bad indicators)
- Common commands and CI/CD examples
- Troubleshooting section
- File locations
- Performance baseline table

**Use Cases**:
- New developers onboarding
- Quick validation before commits
- CI/CD pipeline integration
- First-time setup

**Audience**: All team members

---

#### `INDEX.md` (this file)
Navigation and structure documentation for stress test suite.

**Purpose**: Understand organization, find relevant files, understand dependencies

---

## Stress Levels Configuration

All levels configurable via `STRESS_LEVELS` object in `swarm-sandbox-stress.js`:

### Low Stress (3 min)
```javascript
{
  concurrentSandboxes: 50,
  agentsPerSandbox: 3,
  executionDurationMs: 2000,
  memorySpikeSizeKb: 50 * 1024,        // 50 MB
  fileCreationMultiplier: 1,
  failureInjectionRate: 0.05,          // 5%
  cleanupBatchSize: 10,
  cleanupTimeoutMs: 5000
}
```
**Use Case**: Smoke testing, quick validation, CI/CD gates

### Medium Stress (8 min) - Default
```javascript
{
  concurrentSandboxes: 100,
  agentsPerSandbox: 5,
  executionDurationMs: 5000,
  memorySpikeSizeKb: 150 * 1024,       // 150 MB
  fileCreationMultiplier: 5,
  failureInjectionRate: 0.10,          // 10%
  cleanupBatchSize: 20,
  cleanupTimeoutMs: 3000
}
```
**Use Case**: Standard capacity validation, regular testing

### High Stress (12 min)
```javascript
{
  concurrentSandboxes: 150,
  agentsPerSandbox: 8,
  executionDurationMs: 8000,
  memorySpikeSizeKb: 300 * 1024,       // 300 MB
  fileCreationMultiplier: 10,
  failureInjectionRate: 0.15,          // 15%
  cleanupBatchSize: 30,
  cleanupTimeoutMs: 2000
}
```
**Use Case**: Pre-release testing, edge case discovery

### Extreme Stress (15 min)
```javascript
{
  concurrentSandboxes: 200,
  agentsPerSandbox: 10,
  executionDurationMs: 10000,
  memorySpikeSizeKb: 500 * 1024,       // 500 MB
  fileCreationMultiplier: 20,
  failureInjectionRate: 0.25,          // 25%
  cleanupBatchSize: 50,
  cleanupTimeoutMs: 1000
}
```
**Use Case**: Breaking point identification, hard limit discovery

## Test Scenarios at a Glance

| Scenario | Purpose | Load Pattern | Failure Focus |
|----------|---------|--------------|----------------|
| **Initialization Storm** | Rapid bootstrap capacity | Parallel creation | Init failures |
| **Execution Pressure** | Sustained workload stability | Concurrent execution + memory | Mem allocation failures |
| **Cleanup Under Pressure** | Resource recovery | Aggressive cleanup batches | Timeout failures |
| **Cascading Failure** | Failure propagation | Sequential + failure chain | Cascade detection |

## Metrics Tracked

### Timing (Milliseconds)
- `initializationTimes[]`: Per-sandbox init duration
- `executionTimes[]`: Per-sandbox exec duration
- `cleanupTimes[]`: Per-sandbox cleanup duration

**Computed**: min, max, avg, p95, p99

### Memory (Megabytes)
- `memoryStart`: Heap used at scenario start
- `memoryPeak`: Max heap during scenario
- `memoryEnd`: Heap used at completion

### Counts
- `successCount`: Successful completions
- `failureCount`: Failed sandboxes
- `timeoutCount`: Cleanup timeouts
- `cascadingFailures[]`: Failed due to upstream

### Rates (Percentage)
- `failureRate`: (failures / total) × 100
- `successRate`: (success / total) × 100

## Report Structure

### JSON Report
```
stress-test-results/
└── stress-test-report-2026-06-22-abc123.json
    ├── timestamp
    ├── stressTests[]
    │   ├── name
    │   ├── stressLevel
    │   ├── duration
    │   └── metrics
    └── summary
        ├── totalDuration
        ├── totalErrors
        ├── totalFailures
        └── memoryPeak
```

### Markdown Report
Human-readable summary with per-scenario breakdown.

**Generated via**: `--report=md` flag

## Integration Points

### With Load Tests
Complementary testing:
- **Load Tests** (`../load-tests/`): Capacity, throughput, normal operation
- **Stress Tests**: Failure modes, exhaustion, recovery

### With Observability
Report metrics useful for:
- Performance dashboards
- Trend analysis (track over time)
- Regression detection (compare versions)
- Capacity planning

### With CI/CD
```bash
# Example CI integration
npm run test:stress -- --stress-level=medium --report=json
node scripts/validate-stress-report.js stress-test-results/latest.json
```

## Performance Targets

### By Stress Level

#### Low
- Init p99 < 200ms ✓
- Exec p99 < 2000ms ✓
- Cleanup p99 < 500ms ✓
- Failure rate < 5% ✓

#### Medium
- Init p99 < 300ms ✓
- Exec p99 < 3000ms ✓
- Cleanup p99 < 1000ms ✓
- Failure rate < 10% ✓

#### High
- Init p99 < 1000ms ✓
- Exec p99 < 8000ms ✓
- Cleanup p99 < 3000ms ✓
- Failure rate < 15% ✓
- Timeout rate < 5% ✓

#### Extreme
- System stable ✓
- No infinite failures ✓
- Graceful degradation ✓
- Failure rate < 30% ✓

## Common Workflows

### Smoke Test (3 min)
```bash
node swarm-sandbox-stress.js --stress-level=low
```

### Pre-commit Validation
```bash
node swarm-sandbox-stress.js --stress-level=low && npm test
```

### Full Capacity Analysis
```bash
for level in low medium high; do
  node swarm-sandbox-stress.js --stress-level=$level --report=md
done
```

### CI/CD Gate
```bash
node swarm-sandbox-stress.js --stress-level=medium --report=json
# Validate JSON metrics against thresholds
node scripts/validate-stress.js
```

### Trend Analysis
```bash
# Run same level weekly
node swarm-sandbox-stress.js --stress-level=medium > results/week-$(date +%V).json
# Compare: jq '.summary' results/week-*.json
```

## Troubleshooting Reference

| Issue | Symptom | Check |
|-------|---------|-------|
| Cleanup timeouts | `timeoutCount > 0` | Increase `cleanupTimeoutMs` or reduce `cleanupBatchSize` |
| Memory leak | `memoryEnd > 0.8 × memoryPeak` | Verify buffer cleanup in `StressSandbox.cleanup()` |
| Cascading failures | `cascadingFailures[] populated` | Check failure propagation logic |
| Slow init | `initTime.p99 > 1000ms` | Profile filesystem I/O |
| High failure rate | `failureRate > 15%` | Reduce `failureInjectionRate` or check resources |

## Extension Points

### Adding New Stress Level
Edit `STRESS_LEVELS` object in `swarm-sandbox-stress.js`:
```javascript
STRESS_LEVELS.custom = {
  concurrentSandboxes: 250,
  agentsPerSandbox: 12,
  // ... other config
};
```

### Adding New Scenario
Add new async function `testNewScenario(stressLevel, stressConfig)`:
```javascript
async function testNewScenario(stressLevel, stressConfig) {
  const scenario = new StressTestScenario('New Scenario', stressLevel, stressConfig);
  // ... test logic
  return scenario;
}
```

Call in main():
```javascript
if (scenarios.has('newscenario')) {
  const results = await testNewScenario(stressLevelArg, stressConfig);
  results.push(results);
}
```

### Custom Metrics
Extend `StressTestScenario` class:
```javascript
recordCustomMetric(name, value) {
  if (!this.results.metrics.custom) {
    this.results.metrics.custom = {};
  }
  this.results.metrics.custom[name] = value;
}
```

## Related Files

### In This Directory
- `matrix-theme-stress.js`: Separate stress test for theme matrix rendering

### In Parent Directory
- `../load-tests/swarm-sandbox-load.js`: Capacity/throughput testing
- `../load-tests/SPECIFICATION.md`: Load test design
- `../load-tests/README.md`: Load test usage guide

### Shared Infrastructure
- `~/.claude/`: User home directory for test artifacts
- `~/.claude/stress-test-sandboxes/`: Temporary test files
- `~/.claude/stress-test-sandboxes/stress-test-results/`: Report output

## Quick Command Reference

```bash
# Run all scenarios with default (medium) stress
node swarm-sandbox-stress.js

# Run with specific stress level
node swarm-sandbox-stress.js --stress-level=high

# Generate markdown report
node swarm-sandbox-stress.js --report=md

# Enable verbose logging
node swarm-sandbox-stress.js --verbose

# Combine options
node swarm-sandbox-stress.js --stress-level=extreme --report=md --verbose

# View latest report
cat ~/.claude/stress-test-sandboxes/stress-test-results/stress-test-report-*.json | jq '.summary'

# Clean up test artifacts
rm -rf ~/.claude/stress-test-sandboxes/
```

## Version & Maintenance

- **Version**: 1.0
- **Last Updated**: 2026-06-22
- **Maintained By**: Claudient Team
- **Status**: Production

## Next Steps

1. Read `QUICK-START.md` for immediate usage
2. Review `README.md` for comprehensive guide
3. Check `SPECIFICATION.md` for technical details
4. Run: `node swarm-sandbox-stress.js --stress-level=low`
