# Stress Test Quick Start

## Run Your First Stress Test (2 minutes)

```bash
cd /path/to/Claudient
node stress-tests/swarm-sandbox-stress.js --stress-level=low
```

Expected output:
```
╔════════════════════════════════════════════════════════════╗
║  SWARM SANDBOX STRESS TEST SUITE                             ║
║  Resource Exhaustion & Failure Mode Analysis                 ║
╚════════════════════════════════════════════════════════════╝

[Stress Level: LOW]
[INFO] Initialization Storm (50 sandboxes)
[METRIC] Batch 1 complete. Memory: 125 MB
[SUCCESS] ✓ Initialization storm complete
...
[Report saved to] ~/.claude/stress-test-sandboxes/stress-test-results/stress-test-report-2026-06-22-abc123.json
```

## Choose Your Stress Level

### Quick Verification (3 min)
```bash
node stress-tests/swarm-sandbox-stress.js --stress-level=low
```
For: Smoke testing, quick validation

### Standard Testing (8 min)
```bash
node stress-tests/swarm-sandbox-stress.js --stress-level=medium
```
For: Regular capacity validation, CI/CD pipelines

### Aggressive Testing (12 min)
```bash
node stress-tests/swarm-sandbox-stress.js --stress-level=high
```
For: Pre-release testing, finding edge cases

### Breaking Point Testing (15 min)
```bash
node stress-tests/swarm-sandbox-stress.js --stress-level=extreme
```
For: Identifying hard limits, stress boundaries

## Report Output

Reports are auto-saved to:
```
~/.claude/stress-test-sandboxes/stress-test-results/stress-test-report-YYYY-MM-DD-XXXXX.json
```

### View Report as Markdown

```bash
node stress-tests/swarm-sandbox-stress.js --stress-level=medium --report=md
```

Output file: `stress-test-report-2026-06-22-abc123.md`

## Interpret Results

### Good Results
- **Init p99 < 300ms** ✓
- **Exec p99 < 3000ms** ✓
- **Cleanup p99 < 1000ms** ✓
- **Failure rate < 5%** ✓
- **Timeout rate < 2%** ✓

Example:
```json
{
  "stressTests": [
    {
      "name": "Initialization Storm",
      "metrics": {
        "initializationTimes": [45, 67, 89, ...],
        "failureCount": 2,
        "successCount": 98,
        "memoryPeak": 512
      }
    }
  ]
}
```

### Problem Indicators
- ❌ Cleanup timeouts increasing
- ❌ Memory not recovering (end > 80% of peak)
- ❌ Cascading failures > 5
- ❌ Failure rate > 15%

## Common Commands

```bash
# Run with verbose output
node stress-tests/swarm-sandbox-stress.js --stress-level=high --verbose

# Run with markdown report
node stress-tests/swarm-sandbox-stress.js --stress-level=medium --report=md

# Check latest report
ls -lrt ~/.claude/stress-test-sandboxes/stress-test-results/ | tail -5

# View latest JSON report (pretty-print)
cat ~/.claude/stress-test-sandboxes/stress-test-results/$(ls -t ~/.claude/stress-test-sandboxes/stress-test-results/*.json | head -1) | jq '.summary'

# Compare multiple runs
diff <(jq '.summary' report1.json) <(jq '.summary' report2.json)
```

## Continuous Integration

Add to your CI pipeline:

```yaml
- name: Run stress tests
  run: |
    node stress-tests/swarm-sandbox-stress.js --stress-level=medium --report=json
    
- name: Validate results
  run: |
    node scripts/validate-stress-metrics.js \
      ~/.claude/stress-test-sandboxes/stress-test-results/stress-test-report-*.json
```

## Troubleshooting

### Test Takes Too Long
Run low or medium stress instead:
```bash
node stress-tests/swarm-sandbox-stress.js --stress-level=low
```

### Out of Disk Space
Clean up old results:
```bash
rm -rf ~/.claude/stress-test-sandboxes/stress-test-results/*
```

### High Memory Usage
This is expected—the test is stress testing! If memory stays high after completion, check for resource leaks.

### Process Hangs
Kill with `Ctrl+C`. If cleanup timeouts are the issue, check:
```bash
ps aux | grep stress
rm -rf ~/.claude/stress-test-sandboxes/
```

## Next Steps

1. **Baseline Measurement**: Run low stress to establish healthy baseline
2. **Capacity Analysis**: Run medium stress to measure normal operation
3. **Edge Cases**: Run high/extreme to find breaking points
4. **Trend Tracking**: Run same level regularly to track performance over time
5. **Bottleneck Analysis**: Review JSON report for slowest operations

## File Locations

```
stress-tests/
├── swarm-sandbox-stress.js          Main test harness
├── README.md                        Full documentation
├── QUICK-START.md                   This file
├── SPECIFICATION.md                 Technical specification
└── matrix-theme-stress.js           Theme stress test (separate)

~/.claude/stress-test-sandboxes/
├── stress-test-results/             Saved reports
│   ├── stress-test-report-2026-06-22-abc123.json
│   └── stress-test-report-2026-06-22-def456.json
└── [temporary test directories]
```

## Performance Baseline

Expected metrics for healthy system (High Stress):

| Metric | Target | Your Result |
|--------|--------|------------|
| Init p99 (ms) | < 1000 | _____ |
| Exec p99 (ms) | < 8000 | _____ |
| Cleanup p99 (ms) | < 3000 | _____ |
| Memory Peak (MB) | < 1500 | _____ |
| Failure Rate (%) | < 15 | _____ |
| Timeout Rate (%) | < 5 | _____ |

Record your results and track over time for trend analysis.
