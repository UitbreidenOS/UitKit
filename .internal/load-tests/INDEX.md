# Load Tests Directory

Comprehensive load testing suite for Claudient multi-agent sandbox system.

## Files Overview

### Core Load Test

**swarm-sandbox-load.js** (843 lines)
- Main load testing harness
- Simulates 100 concurrent sandboxes with 500 total agents
- Measures initialization, execution, cleanup latency
- Resource exhaustion scenarios
- JSON/Markdown report generation

**Key Components**:
- `SandboxSimulator` class: Simulates sandbox lifecycle
- `LoadTestScenario` class: Metrics aggregation
- 4 scenario functions: init, run, cleanup, exhaustion
- Report generation and file I/O

**Execution**:
```bash
node swarm-sandbox-load.js [--scenarios=all|init|run|cleanup|exhaustion] [--report=json|md] [--verbose]
```

### Related Load Tests

**svg-inspector-load.js** (397 lines)
- Load testing for SVG visualization
- Separate from sandbox tests

**matrix-theme-load.js** (461 lines)
- Load testing for theme/matrix rendering
- Separate from sandbox tests

### Documentation

**README.md** (323 lines) - User Guide
- Usage instructions
- Test scenario descriptions
- Configuration options
- Performance benchmarks
- Troubleshooting guide

**QUICK-START.md** (106 lines) - Quick Reference
- One-command test execution
- Common scenarios
- Example output
- Key metrics summary

**SPECIFICATION.md** (447 lines) - Technical Specification
- Design requirements
- Load profile parameters
- Test scenario details
- Metrics definitions
- Performance thresholds
- Error handling strategy
- File artifacts structure

**INDEX.md** (this file)
- Directory organization
- File relationships
- Getting started guide

## Quick Start

### Run All Tests

```bash
cd /Users/tushar/Desktop/Claudient
node load-tests/swarm-sandbox-load.js --scenarios=all --report=json
```

### Expected Output

```
[HH:MM:SS] [INFO] SWARM SANDBOX LOAD TEST SUITE
[HH:MM:SS] [INFO] Starting initialization load test (100 sandboxes)...
[HH:MM:SS] [METRIC] Batch 1 complete. Memory: 512 MB
[HH:MM:SS] [SUCCESS] Initialization test complete

Results:
  Init Time (avg/p95/p99): 92ms / 110ms / 125ms
  Total Agents: 500
  Memory Start: 128 MB, Peak: 512 MB, End: 180 MB
  Success Rate: 100.00%
  Total Duration: 30.15s
```

### Report Location

```
~/.claude/load-test-sandboxes/load-test-results/load-test-report-[timestamp].json
```

## Architecture

### Test Scenarios (Sequential)

1. **Initialization Load** (~30s)
   - Create 100 sandboxes in 5 batches
   - Measure setup latency per sandbox
   - Track memory growth

2. **Execution Load** (~45s)
   - Initialize 100 sandboxes
   - Execute 5 agents per sandbox
   - Measure throughput and latency

3. **Cleanup Latency** (~25s)
   - Create and execute 100 sandboxes
   - Cleanup all resources
   - Measure recovery and memory reclamation

4. **Resource Exhaustion** (~60s)
   - Attempt 200 sandboxes (2x target)
   - Monitor for memory limits
   - Test graceful degradation

**Total duration**: ~160 seconds for all scenarios

### Batch Processing

Sandboxes processed in batches:
- Batch size: 20 sandboxes
- Total batches: 5 per scenario
- Purpose: Control memory, track progress, enable metrics

### Metrics Collection

Per-scenario metrics:

```
Latency (ms):
  - Min, Max, Avg
  - P95, P99 percentiles

Memory (MB):
  - Start (initial heap)
  - Peak (maximum heap)
  - End (final heap)
  - Reclaimed (peak - end)

Success:
  - successCount
  - failureCount
  - Success rate (%)
```

## Performance Targets

| Scenario | Metric | Target | Warning | Failure |
|----------|--------|--------|---------|---------|
| Init | Avg latency | <100ms | <150ms | >200ms |
| Init | P99 latency | <150ms | <250ms | >300ms |
| Exec | Avg latency | <500ms | <1000ms | >2000ms |
| Exec | P99 latency | <2000ms | <5000ms | >10000ms |
| Cleanup | Avg latency | <50ms | <100ms | >200ms |
| Cleanup | P99 latency | <100ms | <200ms | >500ms |
| All | Memory peak | <1.5GB | <2.0GB | >3.0GB |
| All | Success rate | 100% | >99% | <95% |

## File Structure Created

```
~/.claude/load-test-sandboxes/
├── load-test-[scenario]-[N]/           # Sandbox directories
│   ├── sandbox-manifest.json            # Sandbox config
│   ├── agents/                          # Agent configurations
│   │   ├── agent-[id]-0.json
│   │   ├── agent-[id]-1.json
│   │   └── ...
│   ├── executions/                      # Execution logs
│   │   ├── [exec-id]/
│   │   │   └── execution.json
│   │   └── ...
│   ├── logs/                            # Validation reports
│   └── artifacts/                       # Output artifacts
│
└── load-test-results/                   # Final reports
    └── load-test-report-[timestamp].[json|md]
```

## Command Reference

### All Scenarios

```bash
node load-tests/swarm-sandbox-load.js --scenarios=all --report=json --verbose
```

### Individual Scenarios

```bash
# Initialization only
node load-tests/swarm-sandbox-load.js --scenarios=init

# Execution only
node load-tests/swarm-sandbox-load.js --scenarios=run

# Cleanup only
node load-tests/swarm-sandbox-load.js --scenarios=cleanup

# Resource exhaustion
node load-tests/swarm-sandbox-load.js --scenarios=exhaustion
```

### Multiple Scenarios

```bash
node load-tests/swarm-sandbox-load.js --scenarios=init,run,cleanup
```

### Output Formats

```bash
# JSON (default)
node load-tests/swarm-sandbox-load.js --report=json

# Markdown
node load-tests/swarm-sandbox-load.js --report=md

# Both (specify multiple)
node load-tests/swarm-sandbox-load.js --scenarios=all --report=json
```

### Verbose Output

```bash
node load-tests/swarm-sandbox-load.js --verbose
```

Shows debug messages for:
- Per-sandbox initialization
- Batch completion
- Memory tracking
- Metric sampling

## Configuration Parameters

Edit `LOAD_CONFIG` in swarm-sandbox-load.js:

```javascript
const LOAD_CONFIG = {
  maxConcurrentSandboxes: 100,      // Number of sandboxes
  totalAgents: 500,                 // Total agent count
  agentsPerSandbox: 5,              // Agents per sandbox
  executionTimeoutMs: 30000,        // Task timeout (ms)
  cleanupTimeoutMs: 10000,          // Cleanup timeout (ms)
  memoryCheckIntervalMs: 1000,      // Memory sample interval
  metricsInterval: 2000             // Metrics report interval
};
```

## Cleanup

Remove all test artifacts:

```bash
rm -rf ~/.claude/load-test-sandboxes
```

Or manually:
- Remove directories: `~/.claude/load-test-sandboxes/`
- Remove results: `~/.claude/load-test-sandboxes/load-test-results/`

## Integration

### Package.json Script

```json
{
  "scripts": {
    "load-test:all": "node load-tests/swarm-sandbox-load.js --scenarios=all --report=json",
    "load-test:init": "node load-tests/swarm-sandbox-load.js --scenarios=init",
    "load-test:run": "node load-tests/swarm-sandbox-load.js --scenarios=run",
    "load-test:cleanup": "node load-tests/swarm-sandbox-load.js --scenarios=cleanup",
    "load-test:exhaust": "node load-tests/swarm-sandbox-load.js --scenarios=exhaustion"
  }
}
```

Usage:
```bash
npm run load-test:all
npm run load-test:init
```

### CI/CD Integration

GitHub Actions example:

```yaml
name: Load Tests

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  load-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node load-tests/swarm-sandbox-load.js --scenarios=all --report=json
      - uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: ~/.claude/load-test-sandboxes/load-test-results/
```

## Troubleshooting

### Out of Memory

Problem: Tests fail with "ENOMEM"

Solution:
1. Reduce `maxConcurrentSandboxes` to 50
2. Reduce `agentsPerSandbox` to 3
3. Close other applications
4. Run on system with >4GB RAM

### Slow Execution

Problem: Tests take >5 minutes

Solution:
1. Check disk I/O: `iostat` or Activity Monitor
2. Check system load: `top` or System Monitor
3. Run in isolation
4. Check CPU: Most cores utilized?

### Test Failures

Problem: >10% failure rate

Solution:
1. Run with `--verbose` for details
2. Check error log in JSON report
3. Verify file permissions: `chmod 755 ~/.claude`
4. Clear directory: `rm -rf ~/.claude/load-test-sandboxes`

### High Latency Variance

Problem: p99 >> avg (e.g., avg=100ms, p99=5000ms)

Solution:
1. Check system load
2. Reduce batch size from 20 to 10
3. Run in separate tmux session
4. Disable CPU throttling

## Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| QUICK-START.md | Quick reference | All users |
| README.md | Complete user guide | Operators |
| SPECIFICATION.md | Technical details | Developers |
| INDEX.md | Directory overview | All |

## Related Resources

- `scripts/claudient-swarm-sandbox.js` — Sandbox CLI
- `FAQ_SWARM_SANDBOX.md` — Architecture FAQ
- `COMPLIANCE_CHECKLIST.md` — System requirements
- `COMPARE.md` — Feature comparison

## Support

For issues or questions:

1. Check QUICK-START.md for common scenarios
2. Review README.md troubleshooting section
3. Consult SPECIFICATION.md for technical details
4. Run with `--verbose` for debug output
5. Review JSON report errors array

---

**Last Updated**: 2026-06-22
**Version**: 1.0.0
**Maintainer**: Claudient Development Team
