---
name: test-executor
description: Executes test suites and parses output. Generates detailed pass/fail reports with failure analysis, coverage metrics, and performance baselines. Identifies root causes and flaky tests.
allowed-tools: Read, Write
effort: medium
---

# Test Executor

## When to activate

When test suites are ready to run. Execute unit tests, integration tests, and end-to-end tests. Parse output and generate comprehensive reports. Identify failures, coverage gaps, and performance regressions.

## When NOT to use

Not for test development or debugging (use test framework directly). Not without executable test code. Not for exploratory/manual testing. Not without CI environment setup.

## Test Execution Workflow

1. **Pre-flight checks:** Verify test environment is ready (dependencies, database, services)
2. **Run tests:** Execute test suite with appropriate framework
3. **Parse output:** Extract pass/fail counts, failure messages, coverage metrics
4. **Generate report:** Create detailed report with summaries and next steps
5. **Identify patterns:** Detect flaky tests, new regressions, performance issues

## Test Execution Commands

### Pytest (Python)

```bash
# Run all tests with coverage
pytest --cov=app --cov-report=html --cov-report=term-missing -v

# Run tests with failure details
pytest -v --tb=long --failed-first

# Run specific test category
pytest -m "positive" -v
pytest -m "negative" -v
pytest -m "edge_case" -v

# Run single test file
pytest test_authentication.py -v
```

### Jest (JavaScript)

```bash
# Run all tests with coverage
jest --coverage --verbose

# Run tests with failure details
jest --verbose --no-coverage

# Run specific test file
jest test/authentication.test.js --verbose

# Watch mode (during development)
jest --watch
```

### Playwright (Browser Automation)

```bash
# Run all tests
playwright test --reporter=html --reporter=list

# Run specific test file
playwright test tests/auth.spec.ts

# Run with headed browser (watch)
playwright test --headed

# Run with debug mode
playwright test --debug
```

## Test Report Format

```
# Test Execution Report

**Date:** [YYYY-MM-DD HH:MM:SS UTC]
**Environment:** [dev / staging / prod]
**Build/Version:** [commit hash or version]
**Test Framework:** [Pytest / Jest / Playwright]
**Branch:** [git branch]

---

## Summary

| Metric | Count | Percentage |
|---|---|---|
| **Total Tests** | N | 100% |
| **Passed** | N | X% |
| **Failed** | N | X% |
| **Blocked** | N | X% |
| **Skipped** | N | X% |

---

## Coverage Metrics

| Coverage Type | Value | Target | Status |
|---|---|---|---|
| **Line Coverage** | X% | >80% | PASS/FAIL |
| **Branch Coverage** | X% | >60% | PASS/FAIL |
| **Function Coverage** | X% | >80% | PASS/FAIL |
| **Statement Coverage** | X% | >80% | PASS/FAIL |

---

## Failures (if any)

### [Test Name 1]
**Status:** FAILED  
**Test Case:** [TC-MODULE-001]  
**Error:**
```
AssertionError: Expected 200, got 400
File: test_authentication.py:45
```
**Root Cause:** [Analysis of why it failed]  
**Severity:** [Critical / High / Medium / Low]  
**Bug ID:** [BUG-XXX or "TBD"]  
**Recommendation:** [Fix needed or investigation required]

---

## Performance Metrics

| Test / Endpoint | Baseline (ms) | Current (ms) | Delta | Status |
|---|---|---|---|---|
| TC-AUTH-001 | 150 | 155 | +3% | PASS |
| /api/profile | 100 | 95 | -5% | PASS |

---

## Flaky Tests

Tests with intermittent failures (marked for investigation):
- [Test Name] — Failed 1/5 runs (20% failure rate)

---

## Regressions (if any)

Tests that previously passed but now fail:
- [Test Name] — Previously PASS, now FAIL

---

## Coverage Gaps

Areas with insufficient test coverage:
- [Module/Function] — [Current Coverage]% (target X%)

---

## Next Steps

- [ ] Investigate and fix [Failed Test 1]
- [ ] Investigate flaky test: [Test Name]
- [ ] Add test cases for: [Coverage Gap 1]
- [ ] Performance investigation: [Slow Test Name]

---

**Report Generated:** [2026-06-13 14:35 UTC]
```

## Example Test Execution Report

```
# Test Execution Report

**Date:** 2026-06-13 14:35:00 UTC
**Environment:** staging
**Build/Version:** a1b2c3d (commit hash)
**Test Framework:** Pytest
**Branch:** feature/auth-jwt-tokens

---

## Summary

| Metric | Count | Percentage |
|---|---|---|
| **Total Tests** | 24 | 100% |
| **Passed** | 23 | 95.8% |
| **Failed** | 1 | 4.2% |
| **Blocked** | 0 | 0% |
| **Skipped** | 0 | 0% |

---

## Coverage Metrics

| Coverage Type | Value | Target | Status |
|---|---|---|---|
| **Line Coverage** | 87% | >80% | PASS |
| **Branch Coverage** | 72% | >60% | PASS |
| **Function Coverage** | 91% | >80% | PASS |
| **Statement Coverage** | 85% | >80% | PASS |

---

## Failures

### test_token_refresh_rotation_invalidates_old_tokens
**Status:** FAILED  
**Test Case:** TC-AUTH-008  
**Error:**
```
AssertionError: Old refresh token should be invalid after rotation
File: test_authentication.py:156

Expected: 401 Unauthorized
Got: 200 OK

Old token was still accepted instead of being revoked.
```

**Root Cause:** Token rotation logic has a race condition — old token is not immediately invalidated in database when new token is issued. Concurrent refresh requests can both succeed.

**Severity:** CRITICAL (security vulnerability)  

**Bug ID:** BUG-AUTH-042  

**Recommendation:** Implement atomic transaction for token rotation. Add database unique constraint on (user_id, refresh_token_type). Audit for concurrent token generation.

---

## Performance Metrics

| Test / Endpoint | Baseline (ms) | Current (ms) | Delta | Status |
|---|---|---|---|---|
| TC-AUTH-001 (login) | 120 | 125 | +4% | PASS |
| TC-AUTH-003 (token validation) | 8 | 9 | +12% | PASS |
| /api/profile | 95 | 102 | +7% | PASS |
| /auth/refresh | 45 | 48 | +7% | PASS |

All endpoints within acceptable range (no >20% regression).

---

## Flaky Tests

None detected. All tests consistently pass/fail. (23 test runs, 0 intermittent failures)

---

## Regressions

None detected. No tests that previously passed now fail.

---

## Coverage Gaps

Areas with insufficient test coverage:
- `auth/utils.py:hash_password()` — 0% coverage (only used internally, may be low-priority)
- `auth/models.py:Token.rotate()` — 60% coverage (add edge case tests for concurrent calls)
- Error logging — 45% coverage (add tests for error messages)

---

## Next Steps

- [ ] **CRITICAL:** Investigate and fix BUG-AUTH-042 (token rotation race condition)
- [ ] Re-run full auth test suite after fix (verify no regressions)
- [ ] Add test cases for concurrent token refresh (stress test)
- [ ] Improve coverage in `Token.rotate()` — target >90%
- [ ] Verify performance baselines on real infrastructure (staging CPU profiling)

---

**Report Generated:** 2026-06-13 14:35 UTC  
**Next Test Run:** 2026-06-13 16:00 UTC (after auth fix)
```

---
