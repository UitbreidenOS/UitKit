---
description: Executes test suites and generates detailed pass/fail reports with failure analysis. Parses coverage metrics, identifies regressions, and logs results to session-log.md.
---

# /run-tests

## What This Does

Runs the test-executor skill to execute test suites and generate comprehensive reports. Executes unit tests, integration tests, and end-to-end tests. Parses output, calculates coverage metrics, identifies failures and regressions, and logs to session-log.md.

## Steps Claude Follows

1. Ask for: test suite name or scope (unit/integration/all), environment (dev/staging/prod)
2. Run test-executor skill — full test suite execution with coverage
3. Parse output for pass/fail counts, coverage metrics, failure details
4. Run coverage-analyzer skill — identify coverage gaps and trends
5. Run regression-risk-assessor on any new failures — determine if regressions
6. Run bug-triage-classifier on failures — categorize by severity/priority
7. Log results to session-log.md with summary line: pass rate + coverage delta + critical bugs found
8. Display full report with failure analysis and next steps

## Next Action Logic

- **All tests pass + coverage >80%:** "Release ready. Run /triage-bugs if any P1/P2 found."
- **Some tests fail + P1 bugs:** "Critical bugs found. Escalate and block release."
- **Flaky tests detected:** "Investigate test isolation; mark for re-run."
- **Coverage dropped:** "Generate additional test cases for gaps."
- **Performance regression:** "Investigate and optimize slow tests."

## Output Format

### Test Execution Summary
```
# Test Execution Report: [Suite Name]

**Date:** [YYYY-MM-DD HH:MM UTC]
**Environment:** [dev / staging / prod]
**Build:** [commit hash or version]

**Summary:**
- Total Tests: [N]
- Passed: [N] ([X%])
- Failed: [N] ([X%])
- Blocked: [N] ([X%])

**Coverage:**
- Line: [X%] (target: >80%)
- Branch: [X%] (target: >60%)
- Function: [X%] (target: >80%)

**Duration:** [X min Y sec]

[Detailed failures, regressions, coverage gaps below...]
```

### Detailed Report
[Complete test execution report from test-executor skill]

### Log Entry to session-log.md
```
## [2026-06-13 14:35]

**Feature:** [Feature/Build]
**Action:** Executed [Suite Name] test suite
**Status:** [PASSED / FAILED / PARTIAL]

**Summary:**
- Tests Run: [N]
- Pass Rate: [X%]
- Coverage: [X%] ([+X% or -X%] delta)
- Critical Bugs: [N]

**Failures:**
[List of failed tests with brief root cause]

**Regressions Detected:**
[Any new failures in previously-passing tests]

**Next Steps:**
[Recommended actions]
```

---
