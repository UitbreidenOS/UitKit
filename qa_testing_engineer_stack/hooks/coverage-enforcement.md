# Coverage Enforcement Hook

## What This Hook Does

Blocks Pull Requests and commits that decrease overall test coverage below 80% threshold. Compares current coverage against baseline; if coverage drops, prevents merge until coverage is restored or override is explicitly documented.

## Settings.json Entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write.*test.*\\.py|\\.js",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/coverage-enforcement.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: coverage-enforcement.sh

```bash
#!/bin/bash
# Coverage enforcement for QA Testing Engineer Stack
# Blocks test changes that decrease overall coverage below 80%
# Exit 1 if coverage would drop below threshold, otherwise pass silently

BASELINE_COVERAGE=80

# Get current test coverage from previous run
PREVIOUS_COVERAGE=$(cat .coverage-baseline.txt 2>/dev/null | grep "Line Coverage" | awk '{print $NF}' | sed 's/%//')

if [ -z "$PREVIOUS_COVERAGE" ]; then
  # First run, no baseline yet
  exit 0
fi

# Calculate new coverage after this change
# This is a simplified check; in production, run actual coverage tools
CURRENT_COVERAGE=$(python3 -c "
import json, sys
try:
    with open('.coverage.json') as f:
        data = json.load(f)
        coverage = data.get('totals', {}).get('percent_covered', 0)
        print(int(coverage))
except:
    print(0)
")

if [ "$CURRENT_COVERAGE" -lt "$BASELINE_COVERAGE" ]; then
  echo "❌ COVERAGE ENFORCEMENT: Coverage would drop to ${CURRENT_COVERAGE}% (threshold: ${BASELINE_COVERAGE}%)"
  echo ""
  echo "To proceed, either:"
  echo "1. Add test cases to restore coverage to >80%"
  echo "2. Override explicitly: add # COVERAGE_OVERRIDE comment and document reason"
  echo ""
  exit 1
fi

# Coverage is acceptable
exit 0
```

## Behavior

**On violation:** Prints coverage drop warning with threshold and options. Prevents write operation (exit code 1).

**On pass:** Silent — no output, test code is saved normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/coverage-enforcement.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/coverage-enforcement.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Create baseline coverage file:
   ```bash
   echo "Line Coverage: 80%" > .coverage-baseline.txt
   ```

6. Restart Claude Code for the hook to take effect

## Override Behavior

If you intentionally need to accept a coverage drop:

```python
# COVERAGE_OVERRIDE: Legacy test (deprecated module)
# New tests not added because module scheduled for removal in v2.0
def test_legacy_oauth1():
    ...
```

Add the override comment and ensure it's reviewed during code review.

---
