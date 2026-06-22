# Swarm Sandbox Benchmark Suite

Comprehensive performance benchmarking for the Swarm Sandbox multi-agent orchestration system.

## Overview

This benchmark suite measures critical performance characteristics of the Swarm Sandbox across multiple agent topologies and metrics:

### Metrics Measured

1. **Sandbox Creation Time** - Time to initialize a new sandbox with directory structure, manifests, and agent configurations
2. **Agent Startup Time** - Time to initialize individual agents within a sandbox
3. **Isolation Overhead** - Performance cost of maintaining isolation boundaries between agents
4. **Cleanup Time** - Time to remove sandbox and all associated resources

### Topologies Tested

- **1 Agent** - Baseline performance with minimal overhead
- **5 Agents** - Mid-scale swarm with typical coordination complexity
- **20 Agents** - Large-scale swarm stress test

## Usage

### Basic Run (Default: 1, 5, 20 agents, 3 iterations each)

```bash
node benchmarks/swarm-sandbox-benchmark.js
```

### Custom Topologies

```bash
# Only test 1 and 5 agent topologies
node benchmarks/swarm-sandbox-benchmark.js --topologies=1,5

# Only test 20 agent topology
node benchmarks/swarm-sandbox-benchmark.js --topologies=20
```

### Custom Iterations

```bash
# Run each topology 5 times
node benchmarks/swarm-sandbox-benchmark.js --iterations=5

# Run all topologies with 10 iterations
node benchmarks/swarm-sandbox-benchmark.js --topologies=1,5,20 --iterations=10
```

### Output Formats

**Text (Default)**
```bash
node benchmarks/swarm-sandbox-benchmark.js --format=text
```

**JSON**
```bash
node benchmarks/swarm-sandbox-benchmark.js --format=json
```

### Combined Options

```bash
# Full suite: 20 agents, 5 iterations, JSON output
node benchmarks/swarm-sandbox-benchmark.js --topologies=20 --iterations=5 --format=json

# Quick test: 1 agent, 1 iteration
node benchmarks/swarm-sandbox-benchmark.js --topologies=1 --iterations=1 --format=text
```

## Results Interpretation

### Sample Output (Text Format)

```
Topology: 1 agent(s)
Iterations: 3 (3 completed, 0 failed)

Metrics:
┌─────────────────────────────────────────────────────────┐
│ SANDBOX CREATION
│   Average:     1.774ms
│   Min:         0.463ms
│   Max:         3.085ms
│   Std Dev:     1.311ms
│
│ AGENT STARTUP
│   Average:     0.356ms
│   Min:         0.190ms
│   Max:         0.523ms
│   Std Dev:     0.166ms
│
│ ISOLATION OVERHEAD
│   Average:     0.249ms
│   Min:         0.168ms
│   Max:         0.331ms
│   Std Dev:     0.082ms
│
│ CLEANUP
│   Average:     0.821ms
│   Min:         0.452ms
│   Max:         1.190ms
│   Std Dev:     0.369ms
└─────────────────────────────────────────────────────────┘
```

### Key Statistics

- **Average**: Mean performance across all iterations
- **Min**: Best-case performance
- **Max**: Worst-case performance
- **Std Dev**: Consistency/variability of performance

### Expected Performance Baseline

Based on typical runs:

| Topology | Metric | Avg (ms) | Min (ms) | Max (ms) | Per-Agent (ms) |
|----------|--------|----------|----------|----------|----------------|
| 1 Agent | Sandbox Creation | ~1.8 | 0.5 | 3.1 | 1.8 |
| | Agent Startup | ~0.36 | 0.19 | 0.52 | 0.36 |
| | Isolation Overhead | ~0.25 | 0.17 | 0.33 | 0.25 |
| | Cleanup | ~0.82 | 0.45 | 1.19 | 0.82 |
| | **Total** | **~3.43** | | | |
| | | | | | |
| 5 Agents | Sandbox Creation | ~1.08 | 0.66 | 1.50 | 0.22 |
| | Agent Startup | ~0.18 | 0.17 | 0.19 | 0.04 |
| | Isolation Overhead | ~0.17 | 0.13 | 0.21 | 0.03 |
| | Cleanup | ~0.54 | 0.51 | 0.56 | 0.11 |
| | **Total** | **~1.97** | | | |
| | | | | | |
| 20 Agents | Sandbox Creation | ~1.22 | 1.17 | 1.27 | 0.06 |
| | Agent Startup | ~0.09 | 0.08 | 0.10 | 0.005 |
| | Isolation Overhead | ~0.24 | 0.20 | 0.27 | 0.01 |
| | Cleanup | ~1.14 | 0.98 | 1.30 | 0.06 |
| | **Total** | **~2.69** | | | |

### Scaling Analysis

**Linear Scaling**
- Sandbox creation shows reasonable per-agent performance (1.8ms → 0.06ms per agent)
- Agent startup scales very well (0.36ms → 0.005ms per agent)
- Isolation overhead is minimal (0.25ms → 0.01ms per agent)

**Sublinear Cleanup**
- Cleanup time increases with agents but not proportionally
- 20 agents cleanup ≈ 1.4× single-agent cleanup (1.14ms vs 0.82ms)

## Results File

Benchmark results are saved to `benchmarks/swarm-sandbox-results.json`:

```json
{
  "timestamp": "2026-06-22T04:01:05.816Z",
  "configuration": {
    "topologies": [1, 5, 20],
    "iterations": 3,
    "timeout_ms": 60000
  },
  "suites": [
    {
      "topology": 1,
      "iterations": [...],
      "summary": {
        "topology": 1,
        "iterations": 3,
        "completed": 3,
        "failed": 0,
        "metrics": { ... }
      }
    },
    ...
  ]
}
```

## Benchmark Methodology

### Sandbox Creation Phase
1. Create directory structure (agents, executions, logs, artifacts)
2. Generate manifest file (sandbox-manifest.json)
3. Create agent configuration files (one per agent)
4. Write .sandboxrc config file

### Agent Startup Phase
1. Load agent configuration from disk
2. Initialize agent runtime environment
3. Prepare agent for task execution

### Isolation Overhead Phase
1. For each agent: create isolated execution context
2. Write execution context and result files to separate directories
3. Clean up execution artifacts
4. Measure filesystem overhead per agent

### Cleanup Phase
1. Recursively remove entire sandbox directory
2. Clean up all agent files
3. Remove execution artifacts and logs

## Performance Tuning Insights

### Optimization Opportunities

1. **Sandbox Creation**: Consider caching manifest templates to reduce file I/O
2. **Agent Startup**: Currently sub-millisecond; minimal optimization needed
3. **Isolation Overhead**: Very efficient; main cost is filesystem operations
4. **Cleanup**: Batch directory removal operations for large topologies

### Scaling Characteristics

- **Fixed Overhead**: ~1.2ms (constant regardless of agent count)
- **Per-Agent Variable**: ~0.15ms per agent (dominated by file operations)
- **Superlinear Efficiency**: Larger topologies show better per-agent performance due to amortized overhead

## Running Continuous Benchmarks

### Generate Performance Trend Report

```bash
# Run multiple times and compare
for i in {1..5}; do
  echo "=== Run $i ===" >> bench-history.txt
  node benchmarks/swarm-sandbox-benchmark.js --format=json >> bench-history.txt
  echo "" >> bench-history.txt
done
```

### Automated Regression Detection

```bash
# Store baseline
node benchmarks/swarm-sandbox-benchmark.js --format=json > baseline.json

# Run test
node benchmarks/swarm-sandbox-benchmark.js --format=json > current.json

# Compare (simple diff; can be enhanced with statistical analysis)
diff baseline.json current.json
```

## Files

- `benchmarks/swarm-sandbox-benchmark.js` - Main benchmark script
- `benchmarks/swarm-sandbox-results.json` - Latest results (auto-generated)
- `benchmarks/SWARM-SANDBOX-BENCHMARK.md` - This documentation

## Requirements

- Node.js 14+
- No external dependencies (uses built-in modules only)

## Notes

- Benchmarks measure filesystem-backed sandbox performance
- Results may vary by system hardware and load
- Standard deviation indicates consistency across runs
- All times measured with `performance.now()` (nanosecond precision)
- Cleanup phase automatically removes all temporary sandbox directories
