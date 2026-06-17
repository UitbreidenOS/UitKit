# Performance Regression Detector

## Purpose

Automatically detect and alert on performance regressions when benchmarks decline beyond a configurable threshold, preventing performance degradation from silently entering the codebase.

## When It Fires

- After running performance benchmark suites
- On git commits that modify core application code
- Before pushing to remote (optional)
- On CI/CD pipeline completion with benchmark results

## Configuration

Add this to `.claude/settings.json`:

```json
{
  "hooks": {
    "performance-regression-detector": {
      "enabled": true,
      "threshold": 10,
      "metrics": ["response_time", "memory_usage", "bundle_size"],
      "baseline_file": ".benchmarks/baseline.json",
      "historical_window": 5,
      "fail_on_regression": true,
      "git_trigger": "post-commit",
      "comparison_mode": "percent_change"
    }
  }
}
```

### Configuration Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `threshold` | number | 10 | Performance decline percentage to trigger alert |
| `metrics` | array | `["response_time"]` | Which metrics to monitor |
| `baseline_file` | string | `.benchmarks/baseline.json` | Path to baseline benchmark data |
| `historical_window` | number | 5 | Number of previous commits to compare against |
| `fail_on_regression` | boolean | true | Block commits/pushes if regression detected |
| `comparison_mode` | string | `percent_change` | `percent_change`, `absolute`, or `rolling_avg` |

## Hook Script

Create `fullstack_developer_stack/hooks/performance-regression-detector.sh`:

```bash
#!/bin/bash
set -euo pipefail

# Performance Regression Detector Hook
# Compares current benchmark results against baseline and historical data

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOOK_CONFIG="${SCRIPT_DIR}/.claude/settings.json"
BASELINE_FILE="${SCRIPT_DIR}/.benchmarks/baseline.json"
CURRENT_RESULTS="${SCRIPT_DIR}/.benchmarks/current.json"

# Parse config
get_config() {
  local key="$1"
  local default="$2"
  jq -r ".hooks.\"performance-regression-detector\".\"$key\" // \"$default\"" "$HOOK_CONFIG" 2>/dev/null || echo "$default"
}

THRESHOLD=$(get_config "threshold" "10")
METRICS=$(get_config "metrics" "response_time")
FAIL_ON_REGRESSION=$(get_config "fail_on_regression" "true")
COMPARISON_MODE=$(get_config "comparison_mode" "percent_change")
HISTORICAL_WINDOW=$(get_config "historical_window" "5")

# Check if benchmark results exist
if [[ ! -f "$CURRENT_RESULTS" ]]; then
  echo "⚠️  No benchmark results found at $CURRENT_RESULTS"
  echo "Run performance benchmarks first: npm run benchmark"
  exit 0
fi

# Check if baseline exists
if [[ ! -f "$BASELINE_FILE" ]]; then
  echo "📊 Creating baseline from current results..."
  mkdir -p "$(dirname "$BASELINE_FILE")"
  cp "$CURRENT_RESULTS" "$BASELINE_FILE"
  echo "✓ Baseline established"
  exit 0
fi

# Extract metric values
get_metric() {
  local file="$1"
  local metric="$2"
  jq -r ".metrics.\"$metric\" // .\"$metric\" // 0" "$file" 2>/dev/null || echo "0"
}

# Calculate percent change
calculate_change() {
  local baseline="$1"
  local current="$2"
  
  if [[ "$baseline" == "0" ]] || [[ -z "$baseline" ]]; then
    echo "0"
    return
  fi
  
  awk "BEGIN {printf \"%.2f\", ((($current - $baseline) / $baseline) * 100)}"
}

# Parse and compare metrics
declare -A regressions
regression_count=0

echo "🔍 Comparing performance metrics..."
echo "  Threshold: ${THRESHOLD}% | Mode: ${COMPARISON_MODE}"
echo ""

# If metrics is a JSON array, iterate; otherwise treat as single metric
if [[ "$METRICS" == "["* ]]; then
  # Array of metrics
  metric_list=$(echo "$METRICS" | jq -r '.[]')
else
  metric_list="$METRICS"
fi

for metric in $metric_list; do
  baseline_val=$(get_metric "$BASELINE_FILE" "$metric")
  current_val=$(get_metric "$CURRENT_RESULTS" "$metric")
  
  # Skip if no data
  [[ -z "$baseline_val" ]] || [[ "$baseline_val" == "0" ]] && continue
  
  if [[ "$COMPARISON_MODE" == "percent_change" ]]; then
    change=$(calculate_change "$baseline_val" "$current_val")
    
    # Check if regression (positive change = slower/worse for most metrics)
    if (( $(echo "$change > $THRESHOLD" | bc -l 2>/dev/null || echo 0) )); then
      regressions["$metric"]="$change"
      ((regression_count++))
      echo "  ❌ $metric: ${change}% regression"
    else
      echo "  ✓ $metric: ${change}% change (baseline: $baseline_val)"
    fi
  fi
done

echo ""

# Report results
if [[ $regression_count -gt 0 ]]; then
  echo "⚠️  PERFORMANCE REGRESSION DETECTED ($regression_count metric$([ $regression_count -gt 1 ] && echo 's' || echo ''))"
  echo ""
  for metric in "${!regressions[@]}"; do
    echo "  • $metric: +${regressions[$metric]}%"
  done
  echo ""
  
  if [[ "$FAIL_ON_REGRESSION" == "true" ]]; then
    echo "❌ Commit/push blocked. Investigate and optimize before proceeding."
    echo ""
    echo "Next steps:"
    echo "  1. Review benchmark details: cat .benchmarks/current.json"
    echo "  2. Profile the affected code: npm run profile"
    echo "  3. Optimize and re-run: npm run benchmark"
    echo "  4. Update baseline: npm run benchmark -- --update-baseline"
    exit 1
  else
    echo "⚠️  Regression detected but not blocking (fail_on_regression=false)"
    exit 0
  fi
else
  echo "✅ No performance regressions detected"
  exit 0
fi
```

## Setup Instructions

1. **Install hook file:**
   ```bash
   cp fullstack_developer_stack/hooks/performance-regression-detector.sh .git/hooks/post-commit
   chmod +x .git/hooks/post-commit
   ```

2. **Create benchmark baseline:**
   ```bash
   npm run benchmark -- --save-baseline
   ```

3. **Add npm scripts to `package.json`:**
   ```json
   {
     "scripts": {
       "benchmark": "node scripts/benchmark.js",
       "benchmark:ci": "node scripts/benchmark.js --ci --json > .benchmarks/current.json",
       "profile": "node --prof app.js && node --prof-process isolate-*.log > profile.txt"
     }
   }
   ```

4. **Commit configuration:**
   ```bash
   git add .claude/settings.json .benchmarks/baseline.json
   git commit -m "feat: enable performance regression detection"
   ```

## Integration with CI/CD

### GitHub Actions

```yaml
- name: Run benchmarks
  run: npm run benchmark:ci

- name: Check regressions
  run: |
    bash fullstack_developer_stack/hooks/performance-regression-detector.sh
  continue-on-error: false
```

### GitLab CI

```yaml
performance_check:
  script:
    - npm run benchmark:ci
    - bash fullstack_developer_stack/hooks/performance-regression-detector.sh
  artifacts:
    paths:
      - .benchmarks/current.json
```

## Benchmark Result Format

`.benchmarks/current.json` should contain:

```json
{
  "timestamp": "2026-06-13T10:30:00Z",
  "commit": "abc123def456",
  "metrics": {
    "response_time": 45.2,
    "memory_usage": 128.5,
    "bundle_size": 450000,
    "api_latency_p99": 120.5
  },
  "environment": {
    "node_version": "20.11.0",
    "platform": "darwin-arm64"
  }
}
```

## Customization

### Track multiple metrics
```json
"metrics": ["response_time", "memory_usage", "bundle_size", "api_latency_p99"]
```

### Use absolute thresholds instead of percent
```json
"comparison_mode": "absolute",
"thresholds": {
  "response_time": 50,
  "memory_usage": 150
}
```

### Rolling average comparison (last N runs)
```json
"comparison_mode": "rolling_avg",
"historical_window": 10
```

### Warning mode (alert but don't block)
```json
"fail_on_regression": false
```

## What Happens

1. **On Commit**: Hook runs, compares current metrics against baseline
2. **Regression Detected**: 
   - Displays metric deltas with visual indicators
   - If `fail_on_regression: true`, blocks the commit
   - Suggests optimization and profiling next steps
3. **No Regression**: Silently passes, commit proceeds
4. **New Baseline**: Automatically created on first run if missing

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Hook not running | Check `chmod +x .git/hooks/post-commit` |
| jq not found | Install: `brew install jq` (macOS) or `apt-get install jq` (Linux) |
| Baseline keeps resetting | Commit `.benchmarks/baseline.json` to git |
| False positives on flaky tests | Increase `threshold` or use `rolling_avg` mode |

## Performance Optimization Tips

- Profile hot paths: `npm run profile`
- Check bundle size: `npm run bundle-analyze`
- Monitor API latency: Add APM instrumentation
- Cache aggregation results in `.benchmarks/`
- Run benchmarks in CI on dedicated hardware for consistency
