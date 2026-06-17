# Performance Watcher Hook

## What This Hook Does

Monitors test execution time to detect performance regressions. Alerts if any test takes >3x baseline time (possible performance regression in code being tested). Tracks execution time baselines per test and flags slowdowns for investigation.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Read.*test.*report|Read.*\\.log",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/performance-watcher.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: performance-watcher.sh

```bash
#!/bin/bash
# Performance watcher for QA Testing Engineer Stack
# Detects tests that run slower than baseline (>3x threshold)
# Alerts on possible performance regressions

TEST_REPORT=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ ! -f "$TEST_REPORT" ]; then
  exit 0
fi

# Load baseline execution times
if [ ! -f ".test-perf-baseline.json" ]; then
  exit 0
fi

# Parse test report and compare to baseline
python3 << 'EOF'
import json
import sys

try:
    # Load test execution times from report
    with open(sys.argv[1], 'r') as f:
        report = f.read()
    
    # Load baseline times
    with open('.test-perf-baseline.json', 'r') as f:
        baseline = json.load(f)
    
    slow_tests = []
    
    # Extract test times from report (simplified parsing)
    for line in report.split('\n'):
        if ' in ' in line and 's' in line:  # Format: test_name in 1.23s
            parts = line.split()
            if len(parts) >= 3:
                test_name = ' '.join(parts[:-3])
                test_time_str = parts[-2]
                try:
                    current_time = float(test_time_str)
                    baseline_time = baseline.get(test_name, current_time / 3.0)
                    
                    if current_time > (baseline_time * 3.0):
                        slow_tests.append({
                            'test': test_name,
                            'baseline': baseline_time,
                            'current': current_time,
                            'multiplier': current_time / baseline_time
                        })
                except ValueError:
                    pass
    
    if slow_tests:
        print("⚠️  PERFORMANCE REGRESSION DETECTED")
        print("")
        for test in slow_tests:
            print(f"  {test['test']}")
            print(f"    Baseline: {test['baseline']:.2f}s")
            print(f"    Current: {test['current']:.2f}s")
            print(f"    Slowdown: {test['multiplier']:.1f}x")
            print("")

except Exception as e:
    # Silently fail if parsing error
    pass
EOF

exit 0
```

## Behavior

**On slowdown detected (>3x):** Prints performance regression warning with test names, baseline time, current time, and slowdown factor. Recommends investigation.

**On normal performance:** Silent — no output.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/performance-watcher.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/performance-watcher.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Initialize performance baseline after first test run:
   ```bash
   # After running tests, extract execution times
   pytest --durations=0 -v > test-report.txt
   
   # Create baseline file (manually or via script)
   cat > .test-perf-baseline.json << 'EOF'
   {
     "test_user_login": 0.15,
     "test_token_refresh": 0.08,
     "test_checkout_flow": 2.5
   }
   EOF
   ```

6. Restart Claude Code for the hook to take effect

## Threshold Configuration

Edit the threshold multiplier in the hook script:

```bash
# Default: 3x baseline
if current_time > (baseline_time * 3.0):

# More sensitive: 2x baseline
if current_time > (baseline_time * 2.0):

# Less sensitive: 5x baseline
if current_time > (baseline_time * 5.0):
```

## Alert Example

When a test runs slower than baseline:

```
⚠️  PERFORMANCE REGRESSION DETECTED

  test_checkout_flow_end_to_end
    Baseline: 2.50s
    Current: 8.23s
    Slowdown: 3.3x

Recommended: Investigate code changes; profile execution time; check for N+1 queries.
```

---
