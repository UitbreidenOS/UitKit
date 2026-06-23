# SVG Inspector Load Test — Complete Guide

## Overview

The SVG Inspector Load Test is a production-ready performance testing suite for rendering massive SVG network maps under concurrent user interactions (pan/zoom). It measures latency percentiles, throughput, and memory efficiency across realistic workloads.

### Key Metrics

- **5,000 nodes + 25,000 edges** baseline
- **10,000 nodes + 50,000 edges** full-scale
- **100 concurrent operations** per batch
- **Latency percentiles**: P50, P75, P90, P95, P99, P99.9
- **Throughput**: Operations/sec
- **Memory tracking**: RSS, heap used, growth rate

---

## Installation & Setup

No additional dependencies required. Uses Node.js built-in `perf_hooks` for timing.

```bash
cd /Users/tushar/Desktop/Claudient
node load-tests/svg-inspector-load.js
```

---

## Usage Scenarios

### 1. Local Development (Quick Regression)

Run the default fast test after making rendering changes:

```bash
node load-tests/svg-inspector-load.js
```

**Expected output**:
- Duration: 20-30 seconds
- P95 latency: ~100ms
- Errors: 0

### 2. Pre-deployment Verification

Run full-scale test before release:

```bash
bash load-tests/svg-inspector-full-scale.sh
```

Or equivalently:

```bash
node load-tests/svg-inspector-load.js --full-scale
```

**Expected output**:
- Duration: 45-60 seconds
- P95 latency: ~110ms
- P99 latency: ~220ms
- Memory peak: 250-300MB
- Errors: 0

### 3. Performance Tuning

Compare baseline vs. optimized code:

```bash
# Baseline measurement
node load-tests/svg-inspector-load.js --ops=500 > baseline.txt

# Make optimization

# Optimized measurement
node load-tests/svg-inspector-load.js --ops=500 > optimized.txt

# Compare P95/P99 metrics
diff baseline.txt optimized.txt
```

### 4. Capacity Planning

Test varying dataset sizes to understand scaling characteristics:

```bash
# Small dataset
node load-tests/svg-inspector-load.js --nodes=1000 --edges=5000

# Medium dataset
node load-tests/svg-inspector-load.js --nodes=5000 --edges=25000

# Large dataset
node load-tests/svg-inspector-load.js --nodes=10000 --edges=50000
```

Verify that latency scales O(n log n) or better, not O(n²).

---

## CLI Arguments Reference

### Dataset Configuration

| Argument | Default | Range | Purpose |
|----------|---------|-------|---------|
| `--nodes=N` | 5000 | 100-100K | Number of graph nodes |
| `--edges=N` | 25000 | 100-1M | Number of graph edges |

### Load Configuration

| Argument | Default | Range | Purpose |
|----------|---------|-------|---------|
| `--ops=N` | 500 | 10-10K | Total operations to execute |
| `--concurrent=N` | 100 | 1-1000 | Operations per concurrent batch |

### Presets

| Argument | Effect |
|----------|--------|
| `--full-scale` | Sets nodes=10K, edges=50K, ops=1K, concurrent=100 |

### Examples

```bash
# Minimum viable test (30 operations on small graph)
node load-tests/svg-inspector-load.js --nodes=1000 --edges=5000 --ops=30

# Medium load for quick testing
node load-tests/svg-inspector-load.js --nodes=3000 --edges=15000 --ops=200

# Production validation
node load-tests/svg-inspector-load.js --full-scale

# Extreme stress test (requires 4GB+ memory)
node load-tests/svg-inspector-load.js --nodes=20000 --edges=100000 --ops=2000
```

---

## Output Interpretation

### Report Sections

#### 1. Configuration Header

```
📊 SVG Inspector Load Test
Dataset: 5,000 nodes, 25,000 edges
Load: 100 concurrent ops, 500 total operations
```

Shows the exact configuration used.

#### 2. Performance Metrics

```
⏱️  Performance Metrics
Total Duration: 24722.72ms
Operations/sec: 20.22
```

- **Duration**: Total test execution time (includes data generation, render, and measurements)
- **Throughput**: Operations per second (higher is better)

#### 3. Latency Percentiles

```
📈 Latency Percentiles (Operation Latency)
  P50.0ms: 40.119ms
  P75.0ms: 54.099ms
  P90.0ms: 81.487ms
  P95.0ms: 100.091ms     ← SLA threshold
  P99.0ms: 200.248ms     ← Worst-case threshold
  P99.9ms: 313.299ms
  Min: 15.272ms
  Max: 313.299ms
  Avg: 49.341ms
```

**Critical thresholds**:
- **P50/P75**: Typical user experience
- **P95 < 100ms**: Acceptable latency (feels responsive)
- **P99 < 200ms**: Worst-case acceptable latency
- **P99.9 > 300ms**: Outlier operations (investigate)

#### 4. Render Time Percentiles

```
🎨 Render Time Percentiles
  P50.0ms: 40.115ms
  ...
```

Subset of Operation Latency — shows just SVG string generation. If Render ≈ Operation, rendering is the bottleneck. If Render << Operation, concurrency overhead dominates.

#### 5. Operation Distribution

```
📊 Operation Distribution
Pan operations: 192
Zoom operations: 147
Pan+Zoom combo: 161
```

Confirms that operations are distributed across all three types.

#### 6. Memory Usage

```
💾 Memory Usage
Initial RSS: 66.20MB
Final RSS: 136.73MB
Heap Used (Initial): 12.94MB
Heap Used (Final): 34.74MB
Heap Growth: 21.80MB
```

**What to watch**:
- **Heap Growth > 100MB**: Potential memory leak
- **Final RSS >> Initial RSS**: SVG strings not being garbage collected
- **Linear growth with dataset size**: Expected and acceptable

---

## Success Criteria

A test passes if **all** of the following hold:

✅ **P95 latency < 100ms** (user-perceptible responsiveness)
✅ **P99 latency < 200ms** (acceptable worst-case)
✅ **Operation count = Total operations** (no dropped ops)
✅ **Error count = 0** (no rendering failures)

Example passing output:
```
✓ All assertions passed
✅ Test completed with 500 successful operations
```

### Failure Examples

❌ **P95 > 100ms**: Rendering bottleneck or excessive concurrent load
```
AssertionError: P95 latency should be < 100ms (got 125.45ms)
```

❌ **P99 > 200ms**: Severe jank or memory churn
```
AssertionError: P99 latency should be < 200ms (got 250.88ms)
```

❌ **Incomplete operations**: Silent failures during rendering
```
AssertionError: Should complete all 500 operations (got 487)
```

❌ **Rendering errors**: SVG generation or transformation failures
```
Error: circle cx undefined (NaN detected in transform)
```

---

## Troubleshooting

### High Latencies (P99 > 200ms)

**Likely causes**:
1. Dataset too large for system memory → GC pauses
2. Rendering algorithm has O(n²) complexity → optimize node lookup
3. System under resource contention → close other apps

**Solutions**:
```bash
# Reduce dataset
node load-tests/svg-inspector-load.js --nodes=2000 --edges=10000

# Verify it's a memory issue
# If latencies improve significantly, memory churn is the problem

# Profile the render function
# Add performance marks to identify the bottleneck
```

### Memory Spike (Heap Growth > 200MB)

**Likely causes**:
1. SVG strings not being garbage collected
2. Node lookup Map persists across renders
3. Edge array references nodes unnecessarily

**Solutions**:
```bash
# Check if growth is linear with dataset size
# If yes, that's expected
# If heap growth >> data size, there's a leak

# Monitor with:
node --expose-gc load-tests/svg-inspector-load.js
# GC will run between operations, showing memory baseline
```

### Test Hangs or Crashes

**Likely causes**:
1. Dataset generation timeout (edge deduplication slow)
2. Out of memory on render
3. Infinite loop in pan/zoom calculation

**Solutions**:
```bash
# Reduce scale
node load-tests/svg-inspector-load.js --nodes=1000 --ops=50

# Check Node.js version
node --version
# Requires Node.js 14+ (perf_hooks)

# Increase available memory
NODE_OPTIONS=--max-old-space-size=4096 node load-tests/svg-inspector-load.js
```

---

## Performance Baselines

Test on your target hardware and record baseline metrics:

### Baseline Template

Record after each code change:

```
Test Date: 2026-06-22
Hardware: MacBook Pro M1, 16GB RAM
Dataset: 5000 nodes, 25000 edges, 500 ops

P50 latency: 40.1ms
P95 latency: 100.1ms
P99 latency: 200.2ms
Throughput: 20.2 ops/sec
Memory peak: 136.7MB
Errors: 0
Duration: 24.7s

Performance change: BASELINE
Notes: Initial measurement for comparison
```

### Regression Detection

If after optimization:
- P95 increases by > 5% → regression detected
- P99 increases by > 10% → significant regression
- Memory peak increases by > 50% → memory leak introduced

---

## Integration with CI/CD

### GitHub Actions

```yaml
name: SVG Rendering Load Test

on: [push, pull_request]

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: node load-tests/svg-inspector-load.js --nodes=5000 --ops=300
      - name: Archive results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: load-test-results
          path: load-tests/
```

### Local Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

if git diff --cached --name-only | grep -q 'SVGRenderer\|render'; then
  echo "Running SVG rendering load test..."
  node load-tests/svg-inspector-load.js --ops=100 || exit 1
fi
```

---

## Architecture Deep Dive

### Component Overview

```
SVGMapDataGenerator
├── Creates realistic graph topology
├── Nodes: random coordinates, colors, clusters
└── Edges: unique connections, weighted, transparent

SVGRenderer
├── Maintains transform state (translate, scale)
├── Optimized node lookup (Map for O(1))
├── Builds SVG markup efficiently
└── Pan/zoom/combo operations

SVGLoadTestExecutor
├── Runs operations in concurrent batches
├── Measures per-operation latency
├── Tracks memory snapshots
└── Generates metrics report

LoadTestValidator
├── P95/P99 latency assertions
├── Operation count validation
├── Error rate verification
└── Memory leak detection
```

### Rendering Optimization Techniques

The test demonstrates several optimization patterns:

1. **Node Lookup Map**: `O(1)` instead of `O(n)` search
   ```javascript
   this.nodeMap = new Map(this.nodes.map(n => [n.id, n]));
   ```

2. **Unique Edge Generation**: Avoids duplicate edges via Set
   ```javascript
   if (!edgeSet.has(edgeKey)) { ... }
   ```

3. **Precision Formatting**: Reduces SVG string size
   ```javascript
   x1="${source.x.toFixed(1)}"  // Saves ~30% string size
   ```

4. **Efficient Loop**: `for` over `forEach` for performance
   ```javascript
   for (let i = 0; i < this.edges.length; i++) { ... }
   ```

These patterns are production-applicable to real SVG rendering systems.

---

## Advanced: Custom Test Scenarios

Extend the test for specific use cases:

```javascript
// Add to svg-inspector-load.js

class CustomSVGLoadTest extends SVGLoadTestExecutor {
  async executeOperation() {
    // Custom operation: animated zoom sequence
    for (let i = 0; i < 5; i++) {
      this.renderer.zoom(1.05);
      this.renderer.render();
      await new Promise(resolve => setTimeout(resolve, 16)); // 60fps
    }
    // ... rest of test
  }
}
```

---

## References

- **SVG Rendering Performance**: [MDN: SVG Optimization](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag)
- **Latency Percentiles**: [Google SRE Book: Latency](https://sre.google/sre-book/monitoring-distributed-systems/#xref_monitoring_golden_signals)
- **Node.js Performance Hooks**: [Node.js perf_hooks API](https://nodejs.org/api/perf_hooks.html)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-22 | Initial release: SVG Inspector Load Test v1.0 |
|  | Default: 5K nodes, 25K edges, 500 ops |
|  | Full-scale: 10K nodes, 50K edges, 1K ops |
|  | Metrics: Latency percentiles, memory, throughput |

