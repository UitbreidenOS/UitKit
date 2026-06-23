# SVG Inspector Load Tests

Performance and stress tests for SVG map rendering with massive graph datasets.

## svg-inspector-load.js

Comprehensive load test for rendering SVG maps with 5K-10K nodes and 25K-50K edges under concurrent pan/zoom operations.

### Quick Start

Default configuration (5K nodes, 25K edges, 500 operations):
```bash
node load-tests/svg-inspector-load.js
```

Full-scale test (10K nodes, 50K edges, 1000 operations):
```bash
bash load-tests/svg-inspector-full-scale.sh
# OR
node load-tests/svg-inspector-load.js --full-scale
```

Custom configuration:
```bash
node load-tests/svg-inspector-load.js --nodes=8000 --edges=40000 --ops=750 --concurrent=100
```

### CLI Arguments

- `--nodes=N` — Set node count (default: 5000)
- `--edges=N` — Set edge count (default: 25000)
- `--ops=N` — Set total operations (default: 500)
- `--concurrent=N` — Set concurrent operations per batch (default: 100)
- `--full-scale` — Run at maximum scale (10K nodes, 50K edges, 1K ops)

### Dataset Specifications

**Default (Fast)**:
- 5,000 nodes
- 25,000 edges
- 500 operations
- Expected duration: 15-30 seconds

**Full-scale (Comprehensive)**:
- 10,000 nodes
- 50,000 edges
- 1,000 operations
- Expected duration: 45-60 seconds

### Output Metrics

The test reports five categories of metrics:

#### 1. Performance Overview
- Total duration (ms)
- Operations per second throughput
- Dataset configuration

#### 2. Latency Percentiles (Operation Latency)
Reports latency for the entire operation (pan, zoom, or pan+zoom):
- P50, P75, P90, P95, P99, P99.9
- Min, Max, Average latency
- All times in milliseconds

#### 3. Render Time Percentiles
SVG generation latency (subset of operation latency):
- Shows rendering bottleneck severity
- Critical for UI responsiveness

#### 4. Operation Distribution
Breakdown of operations executed:
- Pan operations (translate)
- Zoom operations (scale)
- Pan+Zoom combo (translate + scale)

#### 5. Memory Usage
- Initial and final RSS (resident set size)
- Heap usage before/after
- Heap growth (indicator of memory leaks)

### Success Criteria

All assertions must pass:

| Metric | Threshold | Notes |
|--------|-----------|-------|
| P95 Latency | < 100ms | User-perceptible threshold |
| P99 Latency | < 200ms | Worst-case responsiveness |
| Operations | = Total | All ops must complete |
| Errors | = 0 | Zero rendering failures |

### Performance Benchmarks

Expected results on modern hardware (2025+ Mac/Linux):

**Default scale (5K nodes, 25K edges)**:
- P50: 40ms
- P95: 100ms
- P99: 200ms
- Memory peak: 130-150MB
- Duration: 20-30s

**Full-scale (10K nodes, 50K edges)**:
- P50: 45ms
- P95: 110ms
- P99: 220ms
- Memory peak: 250-300MB
- Duration: 45-60s

### Architecture

**SVGMapDataGenerator**
- Generates random graph with clustered distribution
- Creates unique edges avoiding duplicates
- Assigns colors and weights
- Returns structured node/edge data

**SVGRenderer**
- Maintains transform matrix (translate, scale)
- Optimized O(1) node lookup via Map
- Builds SVG markup efficiently
- Supports pan, zoom, and combined operations

**SVGLoadTestExecutor**
- Runs operations in concurrent batches
- Measures latency per operation
- Tracks memory snapshots
- Collects comprehensive metrics

**LoadTestValidator**
- Asserts P95/P99 latencies
- Validates operation counts
- Checks for errors
- Confirms all assertions pass

### Interpreting Results

**Good Results**:
- Consistent latencies (P99 not >> P95)
- Linear memory growth with dataset size
- 100% success rate
- Render time < 50ms for typical ops

**Warning Signs**:
- High latency variance (P99 >> P95)
- Unexpected memory spikes
- Any failed operations
- Render time > 100ms

**Failure Scenarios**:
- P95 latency > 100ms indicates rendering bottleneck
- P99 latency > 200ms indicates severe jank
- Error count > 0 suggests rendering bugs
- Heap growth > 300MB indicates memory leak

### Optimization Tips

1. **Reduce dataset size** for faster iteration:
   ```bash
   node load-tests/svg-inspector-load.js --nodes=2000 --edges=10000 --ops=200
   ```

2. **Profile render time** to identify bottlenecks:
   - If render time ≈ operation latency, rendering is the bottleneck
   - If operation latency >> render time, concurrency is the bottleneck

3. **Compare scales** to verify O(n) complexity:
   ```bash
   node load-tests/svg-inspector-load.js --nodes=1000
   node load-tests/svg-inspector-load.js --nodes=5000  # Should be ~5x slower
   node load-tests/svg-inspector-load.js --nodes=10000 # Should be ~10x slower
   ```

### Use Cases

**Before deployment**:
```bash
bash load-tests/svg-inspector-full-scale.sh
```
Ensures system can handle maximum expected load.

**During development**:
```bash
node load-tests/svg-inspector-load.js
```
Quick regression test after rendering changes.

**Performance tuning**:
```bash
# Baseline
node load-tests/svg-inspector-load.js --nodes=5000 --ops=500

# After optimization
node load-tests/svg-inspector-load.js --nodes=5000 --ops=500
```
Compare P95/P99 latencies before/after.
0 0 * * 0 node /path/to/swarm-sandbox-load.js --report=json
```

## Related Files

- `scripts/claudient-swarm-sandbox.js` — Sandbox orchestration CLI
- `scripts/swarm-sandbox-init.js` — Sandbox initialization
- `FAQ_SWARM_SANDBOX.md` — Sandbox FAQ
- `COMPLIANCE_CHECKLIST.md` — System compliance requirements

## License

See LICENSE file in repository root.
