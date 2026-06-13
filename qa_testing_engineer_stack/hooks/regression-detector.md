# Regression Detector Hook

## What This Hook Does

Scans test output for new failures in previously passing tests. Flags them as possible regressions and posts alert to session log with failure details, root cause analysis, and severity.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Read.*\\.txt|Read.*test.*report",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/regression-detector.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: regression-detector.sh

```bash
#!/bin/bash
# Regression detector for QA Testing Engineer Stack
# Identifies tests that previously passed but now fail
# Posts alerts to session log

TEST_REPORT=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ ! -f "$TEST_REPORT" ]; then
  exit 0
fi

# Extract failures from test report
FAILURES=$(grep -i "FAILED\|FAIL" "$TEST_REPORT" | grep -v "PASSED\|SKIP" | head -20)

if [ -n "$FAILURES" ]; then
  # Check which failures are regressions (were passing before)
  REGRESSIONS=""
  while IFS= read -r line; do
    TEST_NAME=$(echo "$line" | awk '{print $1}')
    if grep -q "PASSED.*$TEST_NAME" .test-history.txt 2>/dev/null; then
      REGRESSIONS="$REGRESSIONS\n$line"
    fi
  done <<< "$FAILURES"
  
  if [ -n "$REGRESSIONS" ]; then
    echo "⚠️  REGRESSION DETECTED"
    echo ""
    echo "The following tests previously passed but now fail:"
    echo -e "$REGRESSIONS"
    echo ""
    echo "Action: Investigate root cause immediately."
    
    # Append to session log
    {
      echo "## REGRESSION ALERT — $(date +%Y-%m-%d\ %H:%M)"
      echo ""
      echo "**Status:** CRITICAL"
      echo ""
      echo "**Regressions Detected:**"
      echo -e "$REGRESSIONS"
      echo ""
    } >> session-log.md
  fi
fi

exit 0
```

## Behavior

**On regression detected:** Prints regression header with test names. Appends alert entry to session-log.md with timestamp and severity marking.

**On no regression:** Silent — no output.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/regression-detector.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/regression-detector.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Maintain test history file (auto-updated after test runs):
   ```bash
   # Run after each test execution
   grep "PASSED" test-report.txt > .test-history.txt
   ```

6. Restart Claude Code for the hook to take effect

## Alert Example

Session log entry when regressions are detected:

```
## REGRESSION ALERT — 2026-06-13 14:35

**Status:** CRITICAL

**Regressions Detected:**
- test_authentication.py::test_user_login_happy_path — Expected PASSED, got FAILED
- test_authentication.py::test_token_refresh_rotation — Expected PASSED, got FAILED

**Action:** Investigate root cause immediately. Block release until fixed.
```

---
