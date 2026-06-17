# Test Coverage Enforcer Hook

## Description
Automatically checks test coverage against a minimum threshold before allowing commits. Runs on `pre-commit` hook and reports coverage metrics with pass/fail status.

## When It Fires
- **Event**: `pre-commit` (before `git commit` completes)
- **Scope**: All commits to any branch
- **Behavior**: Blocks commit if coverage falls below 70% threshold

---

## settings.json Configuration

Add this entry to your `.claude/settings.json`:

```json
{
  "hooks": {
    "pre-commit": [
      {
        "name": "test-coverage-enforcer",
        "command": "bash",
        "args": [".claude/hooks/test-coverage-enforcer.sh"],
        "enabled": true
      }
    ]
  }
}
```

---

## Hook Script

Create `.claude/hooks/test-coverage-enforcer.sh`:

```bash
#!/bin/bash
set -e

# Minimum coverage threshold (percentage)
MIN_COVERAGE=70

# Check if coverage tools are available
if ! command -v pytest &> /dev/null && ! command -v npm &> /dev/null; then
  echo "warn: No test runner detected (pytest/npm)"
  exit 0
fi

# Detect test framework and run coverage
if [ -f "pytest.ini" ] || [ -f "pyproject.toml" ]; then
  # Python project
  if ! pytest --cov --cov-report=term-only 2>/dev/null | grep -q "FAILED"; then
    coverage=$(pytest --cov --cov-report=term-only 2>/dev/null | grep "TOTAL" | awk '{print $NF}' | sed 's/%//')
  else
    echo "error: Tests failed"
    exit 1
  fi
elif [ -f "package.json" ]; then
  # JavaScript/Node project
  if npm test -- --coverage 2>/dev/null; then
    coverage=$(npm test -- --coverage 2>/dev/null | grep "Statements" | awk '{print $NF}' | sed 's/%//')
  else
    echo "error: Tests failed"
    exit 1
  fi
else
  echo "warn: No test configuration detected"
  exit 0
fi

# Validate coverage threshold
if (( $(echo "$coverage < $MIN_COVERAGE" | bc -l) )); then
  echo "error: Test coverage $coverage% is below minimum $MIN_COVERAGE%"
  exit 1
else
  echo "pass: Test coverage $coverage% meets minimum threshold"
  exit 0
fi
```

Make script executable:
```bash
chmod +x .claude/hooks/test-coverage-enforcer.sh
```

---

## What It Does

1. **Detects project type** — identifies Python (pytest) or JavaScript (npm test) projects
2. **Runs test suite** — executes tests with coverage reporting
3. **Extracts coverage metric** — parses percentage from coverage output
4. **Enforces threshold** — blocks commit if coverage < 70%
5. **Reports status** — displays pass/fail message with coverage percentage

---

## Behavior Notes

- **No commit blocking on missing config** — exits gracefully if no test setup detected
- **Fails fast on test errors** — blocks commit immediately if tests fail
- **Simple threshold check** — uses bash arithmetic, no external coverage tools required
- **Works with standard runners** — pytest and npm test (Jest, Mocha, etc.)

---

## Customization

Change `MIN_COVERAGE=70` to your desired threshold (e.g., `MIN_COVERAGE=80`)

To skip this hook for a single commit:
```bash
git commit --no-verify
```
