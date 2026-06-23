# Swarm Sandbox Benchmark Suite

## Overview

The Swarm Sandbox Benchmark Suite is a comprehensive performance measurement tool for the Claudient multi-agent orchestration system. It measures critical performance characteristics across multiple agent topologies and identifies performance bottlenecks.

## What It Measures

### Core Metrics

1. **Sandbox Creation Time** - Time to initialize a new sandbox environment
   - Directory structure setup
   - Manifest and configuration file generation
   - Per-agent configuration creation

2. **Agent Startup Time** - Time to initialize individual agents
   - Agent runtime initialization
   - Configuration loading and parsing
   - Environmental setup

3. **Isolation Overhead** - Performance cost of maintaining sandbox isolation
   - Execution context creation per agent
   - Isolated filesystem operations
   - Resource isolation enforcement

4. **Cleanup Time** - Time to completely remove sandbox and resources
   - Recursive directory removal
   - File cleanup and artifact removal
   - Persistence cleanup

### Topologies Tested

- **1 Agent** - Baseline for fixed overhead measurement
- **5 Agents** - Mid-scale scenario with typical coordination
- **20 Agents** - Large-scale stress test for scaling efficiency

## Key Features

### Flexible Configuration

```bash
# Test specific topologies
--topologies=1,5,20    # default: 1, 5, 20
--topologies=1         # single baseline
--topologies=5         # mid-scale only

# Control iterations for statistical validity
--iterations=1         # quick test
--iterations=3         # default (good balance)
--iterations=5         # higher accuracy
--iterations=10        # regression detection

# Output formats
--format=text          # human-readable (default)
--format=json          # machine-parseable
```

### Statistical Analysis

Each benchmark run produces:
- **Average** - Mean performance across iterations
- **Min** - Best-case performance
- **Max** - Worst-case performance
- **Std Dev** - Consistency measurement (low is better)

### Automatic Results Persistence

- Results automatically saved to `benchmarks/swarm-sandbox-results.json`
- Includes configuration, all iterations, and summary statistics
- Ready for trend analysis and regression detection

## Usage Examples

### Basic Run

```bash
node benchmarks/swarm-sandbox-benchmark.js
```

Output:
- Tests topologies: 1, 5, 20 agents
- Runs: 3 iterations each
- Format: Human-readable text
- Results saved to JSON file

### Quick Validation

```bash
node benchmarks/swarm-sandbox-benchmark.js --topologies=1 --iterations=1
```

Perfect for:
- Pre-commit validation
- CI/CD quick checks
- Development feedback loop

### Comprehensive Regression Test

```bash
node benchmarks/swarm-sandbox-benchmark.js --topologies=1,5,20 --iterations=5
```

Perfect for:
- Performance regression detection
- Architecture changes validation
- Release verification

### JSON Output for Scripting

```bash
node benchmarks/swarm-sandbox-benchmark.js --format=json | jq '.suites[0].summary.metrics'
```

Perfect for:
- CI/CD integration
- Automated reporting
- Performance dashboards

## Performance Baseline

Based on typical system performance (3 iterations each):

| Metric | 1 Agent | 5 Agents | 20 Agents |
|--------|---------|----------|-----------|
| Sandbox Creation | 1.0ms | 1.6ms | 2.6ms |
| Agent Startup | 0.5ms | 0.15ms | 0.07ms |
| Isolation Overhead | 0.18ms | 0.26ms | 0.17ms |
| Cleanup | 0.6ms | 1.1ms | 1.8ms |
| **Total** | **2.3ms** | **3.1ms** | **4.6ms** |

### Per-Agent Breakdown

| Metric | 1 Agent | 5 Agents | 20 Agents |
|--------|---------|----------|-----------|
| Sandbox Creation | 1.0ms | 0.32ms | 0.13ms |
| Agent Startup | 0.5ms | 0.03ms | 0.004ms |
| Isolation Overhead | 0.18ms | 0.05ms | 0.009ms |
| Cleanup | 0.6ms | 0.22ms | 0.09ms |
| **Total** | **2.3ms** | **0.62ms** | **0.23ms** |

**Key Insight**: Per-agent cost decreases dramatically with topology size due to amortized fixed overhead.

## Performance Characteristics

### Scaling Analysis

1. **Fixed Overhead**: ~1-3ms (constant regardless of agent count)
2. **Variable Overhead**: ~0.15ms per agent (dominated by file operations)
3. **Efficiency**: 60% reduction in per-agent startup from 1→20 agents
4. **Cleanup**: Sublinear scaling; excellent cache utilization

### Bottleneck Analysis

**High Impact (>1ms)**
- Sandbox creation (~1.6ms for 5 agents)
- Cleanup (~1.1ms for 5 agents)

**Medium Impact (0.1-1ms)**
- Agent startup (~0.15-0.5ms per agent)

**Low Impact (<0.1ms)**
- Isolation overhead (~0.18ms, constant)

## File Structure

```
benchmarks/
├── swarm-sandbox-benchmark.js          # Main benchmark script
├── swarm-sandbox-results.json           # Latest results (auto-generated)
├── SWARM-SANDBOX-BENCHMARK.md          # Detailed documentation
├── SWARM-QUICK-REFERENCE.txt           # Quick command reference
└── SWARM-SANDBOX-README.md             # This file
```

## Benchmark Methodology

### Sandbox Creation Phase
1. Create directory structure (agents/, executions/, logs/, artifacts/)
2. Generate manifest (sandbox-manifest.json)
3. Create agent configs (N × agent-${i}.json)
4. Write .sandboxrc configuration

### Agent Startup Phase
Per each agent:
1. Load configuration from disk
2. Initialize agent runtime
3. Prepare for task execution

### Isolation Overhead Phase
Per each agent:
1. Create isolated execution context
2. Write context and result files
3. Cleanup execution artifacts
4. Measure filesystem cost

### Cleanup Phase
1. Recursively remove entire sandbox directory
2. Clean all agent configurations
3. Remove execution logs and artifacts

## Integration Patterns

### CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Benchmark Performance
  run: |
    node benchmarks/swarm-sandbox-benchmark.js \
      --topologies=1,5,20 \
      --iterations=3 \
      --format=json > bench-results.json
    
    # Fail if creation time exceeds threshold
    CREATION_TIME=$(jq '.suites[0].summary.metrics.sandbox_creation.avg_ms' bench-results.json)
    if (( $(echo "$CREATION_TIME > 5" | bc -l) )); then
      echo "Performance regression: Creation time $CREATION_TIME ms > 5ms"
      exit 1
    fi
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running performance baseline..."
node benchmarks/swarm-sandbox-benchmark.js \
  --topologies=1 \
  --iterations=1 \
  --format=text

if [ $? -ne 0 ]; then
  echo "Benchmark failed - commit aborted"
  exit 1
fi
```

### Performance Trending

```bash
#!/bin/bash
# Track performance over time

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
node benchmarks/swarm-sandbox-benchmark.js \
  --format=json > "bench-${TIMESTAMP}.json"

# Compare to previous run
if [ -f "bench-previous.json" ]; then
  PREV_AVG=$(jq '.suites[0].summary.metrics.sandbox_creation.avg_ms' bench-previous.json)
  CURR_AVG=$(jq '.suites[0].summary.metrics.sandbox_creation.avg_ms' bench-${TIMESTAMP}.json)
  
  DELTA=$(echo "$CURR_AVG - $PREV_AVG" | bc)
  PERCENT=$(echo "scale=2; ($DELTA / $PREV_AVG) * 100" | bc)
  
  echo "Creation time change: $DELTA ms ($PERCENT%)"
fi
```

## Interpreting Results

### Reading Statistics

```
│ SANDBOX CREATION
│   Average:     1.774ms      <- Mean of all iterations
│   Min:         0.463ms      <- Best-case result
│   Max:         3.085ms      <- Worst-case result
│   Std Dev:     1.311ms      <- Variability (lower is more consistent)
```

### Quality Indicators

| Metric | Good | Warning | Bad |
|--------|------|---------|-----|
| Std Dev / Avg Ratio | < 20% | 20-50% | > 50% |
| Max / Avg Ratio | < 2× | 2-3× | > 3× |
| Trend (vs baseline) | < +5% | +5-10% | > +10% |

### Performance Assessment

- **Excellent**: All metrics within 5% of baseline
- **Good**: Metrics within 10% of baseline
- **Fair**: Metrics within 20% of baseline
- **Poor**: Any metric >20% above baseline (investigate)

## Troubleshooting

### Issue: Slow Benchmark Execution

**Solution**: 
- Use `--iterations=1` for quick feedback
- Close background applications
- Run on dedicated hardware

### Issue: High Standard Deviation

**Solution**:
- Increase iterations: `--iterations=5` or `--iterations=10`
- Run in stable environment (low system load)
- Reboot system before baseline measurement

### Issue: Results Not Saved

**Solution**:
- Verify write permissions: `ls -l benchmarks/`
- Check disk space: `df -h`
- Results saved to: `benchmarks/swarm-sandbox-results.json`

### Issue: Inconsistent Results Between Runs

**Possible Causes**:
- Variable system load
- Thermal throttling
- Filesystem cache effects

**Mitigation**:
- Clear filesystem cache (if safe): `sync && echo 3 > /proc/sys/vm/drop_caches`
- Disable power management
- Use consistent test environment

## Advanced Topics

### Custom Topology Testing

Modify `TOPOLOGIES` constant in `swarm-sandbox-benchmark.js`:

```javascript
const TOPOLOGIES = [1, 2, 3, 5, 10, 15, 20];  // Custom range
```

Then run: `node benchmarks/swarm-sandbox-benchmark.js --iterations=3`

### Correlation Analysis

Compare performance across different metrics:

```bash
# Extract metrics for analysis
jq '.suites[] | {topology: .topology, metrics: .summary.metrics}' \
  benchmarks/swarm-sandbox-results.json | python3 analyze.py
```

### Regression Detection Automation

```python
#!/usr/bin/env python3
import json
import sys

with open(sys.argv[1]) as f:
    baseline = json.load(f)

with open(sys.argv[2]) as f:
    current = json.load(f)

for baseline_suite, current_suite in zip(baseline['suites'], current['suites']):
    for metric_name, baseline_metric in baseline_suite['summary']['metrics'].items():
        current_metric = current_suite['summary']['metrics'][metric_name]
        
        delta_pct = ((current_metric['avg_ms'] - baseline_metric['avg_ms']) 
                     / baseline_metric['avg_ms'] * 100)
        
        if abs(delta_pct) > 10:
            print(f"⚠️  {metric_name} (topology {baseline_suite['topology']}): {delta_pct:+.1f}%")
```

## Contributing

To add new metrics to the benchmark:

1. Add metric measurement in `SandboxBench.runFullBenchmark()`
2. Update `calculateSummaryStats()` to include new metric
3. Update documentation with expected baseline
4. Run regression tests across all topologies

## Files

- **swarm-sandbox-benchmark.js** - Main benchmark script (executable)
- **swarm-sandbox-results.json** - Latest results (auto-generated)
- **SWARM-SANDBOX-BENCHMARK.md** - Detailed reference documentation
- **SWARM-QUICK-REFERENCE.txt** - Command cheatsheet
- **SWARM-SANDBOX-README.md** - This overview document

## See Also

- [Swarm Sandbox Skill](../skills/ai-engineering/swarm-sandbox.md)
- [Sandbox Playbook](../guides/swarm-sandbox-playbook.md)
- [Edge Cases Guide](../guides/swarm-sandbox-edge-cases.md)

## Version

- **Created**: 2026-06-22
- **Current Version**: 1.0.0
- **Node.js**: 14+
- **Dependencies**: None (built-in modules only)
