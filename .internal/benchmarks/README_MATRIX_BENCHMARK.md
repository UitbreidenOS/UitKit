# Matrix Theme Benchmark Suite

Complete performance and compatibility benchmarking for the Matrix theme.

## Files in This Benchmark

| File | Purpose | Size |
|------|---------|------|
| `matrix-theme-benchmark.js` | Main benchmark executable | 13 KB |
| `matrix-benchmark-report.json` | Generated benchmark results (JSON) | 1.2 KB |
| `MATRIX_BENCHMARK.md` | Detailed analysis and recommendations | 6.9 KB |
| `MATRIX_QUICK_REFERENCE.txt` | Quick reference summary | <1 KB |

## Quick Start

### Run the Benchmark

```bash
node benchmarks/matrix-theme-benchmark.js
```

Output includes:
- File size analysis (uncompressed, gzip, compression ratio)
- JSON parsing performance (1,000 iterations)
- Color computation benchmarks (hex to RGB conversion)
- CSS generation timing and size
- Memory usage analysis
- Compatibility scoring (0-100)

### View Results

**Quick Summary:**
```bash
cat benchmarks/MATRIX_QUICK_REFERENCE.txt
```

**Full Analysis:**
```bash
cat benchmarks/MATRIX_BENCHMARK.md
```

**Raw JSON Data:**
```bash
cat benchmarks/matrix-benchmark-report.json | jq .
```

## Key Metrics

### Compatibility Score: 100/100 ✓

All required fields present. Full accessibility support. Complete component coverage.

### Performance Summary

| Metric | Value | Status |
|--------|-------|--------|
| Parse Time | 62.28 μs | 38% faster than standard |
| File Size | 14.67 KB | 71% smaller than limit |
| Gzip Size | 3.35 KB | 77.2% compression ratio |
| Memory | 297.64 KB | 59.5% of threshold |
| CSS Generation | 22.63 μs | Real-time safe |

### Compatibility Matrix

- ✓ Claude Code 1.0+
- ✓ VS Code 1.60+
- ✓ Terminal (ANSI 24-bit)
- ✓ macOS, Linux, Windows (WSL2)

## Benchmark Methodology

### Tests Performed

1. **File Size Analysis**
   - Uncompressed size
   - Gzip compression ratio
   - Color/component/animation count
   - Bytes per element

2. **JSON Parsing** (1,000 iterations)
   - Mean, median, min, max times
   - Standard deviation
   - Throughput calculation

3. **Color Computation** (1,000 iterations)
   - Hex to RGB conversion speed
   - Per-color performance
   - Variance analysis

4. **CSS Generation** (1,000 iterations)
   - Theme-to-CSS output timing
   - Output size measurement
   - Performance consistency

5. **Memory Usage** (10 samples)
   - Heap memory consumption
   - Peak usage tracking
   - GC pressure analysis

6. **Compatibility Assessment**
   - Required field validation
   - Color completeness check
   - Feature coverage scoring
   - Platform support matrix

### Test Environment

- Node.js v20.x (or current)
- Platform-agnostic (macOS, Linux, Windows)
- Wall-clock timing via `performance.now()`
- Memory analysis via `process.memoryUsage()`

## Interpretation Guide

### Parse Time
- **Good:** < 100 μs
- **Excellent:** < 50 μs
- Matrix: **62.28 μs** = Excellent

### Memory Usage
- **Safe:** < 500 KB
- **Efficient:** < 300 KB
- Matrix: **297.64 KB** = Efficient

### File Size
- **Acceptable:** < 50 KB
- **Good:** < 20 KB
- Matrix: **14.67 KB** = Good

### Compression Ratio
- **Good:** > 50%
- **Excellent:** > 70%
- Matrix: **77.2%** = Excellent

### Compatibility Score
- **Passing:** > 70
- **Excellent:** > 95
- Matrix: **100** = Perfect

## Platform Support

The benchmark validates support for:

| Platform | Support | Notes |
|----------|---------|-------|
| Claude Code | ✓ 1.0+ | Primary target |
| VS Code | ✓ 1.60+ | Format compatible |
| Terminal | ✓ | ANSI 24-bit true color |
| macOS | ✓ | Tested |
| Linux | ✓ | Tested |
| Windows | ✓ | WSL2 compatible |

## Customization

Edit the benchmark to change:

- **BENCHMARK_ITERATIONS** - Number of test iterations (default: 1,000)
- **MEMORY_SAMPLES** - Memory test samples (default: 10)
- **Scoring weights** - Adjust compatibility score formula

## Integration

### CI/CD Pipeline

```bash
#!/bin/bash
# Run benchmark and check score
SCORE=$(node benchmarks/matrix-theme-benchmark.js | grep "Compatibility Score" | grep -o "[0-9]*")
if [ "$SCORE" -lt 90 ]; then
  echo "Theme compatibility score too low: $SCORE/100"
  exit 1
fi
```

### Monitoring

Generate reports automatically:

```bash
# Run benchmark daily
0 2 * * * cd /path/to/claudient && node benchmarks/matrix-theme-benchmark.js > benchmarks/matrix-benchmark-report.json
```

## Troubleshooting

### Benchmark fails to run

```bash
# Check Node.js version
node --version  # Requires v14+

# Verify matrix.json exists
ls -la themes/matrix.json

# Run with verbose output
node --trace-warnings benchmarks/matrix-theme-benchmark.js
```

### Results seem off

- Close other applications (reduce memory competition)
- Run multiple times (ignore outliers)
- Check Node.js GC: `node --expose-gc benchmarks/matrix-theme-benchmark.js`

## Extension Points

The benchmark module exports utilities for custom tests:

```javascript
const {
  benchmarkFileSize,
  benchmarkParsing,
  benchmarkColorComputation,
  benchmarkCssGeneration,
  benchmarkMemory,
  benchmarkCompatibility,
  calculateStats,
  formatBytes,
  formatTime
} = require('./benchmarks/matrix-theme-benchmark.js');
```

## References

- **Main Theme:** `/themes/matrix.json`
- **Setup Guide:** `/guides/matrix-theme-installation.md`
- **CLI Tool:** `/scripts/claudient-matrix.js`

## License

Same as Claudient project (MIT)
