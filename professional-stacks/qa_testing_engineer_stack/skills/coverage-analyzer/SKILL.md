---
name: coverage-analyzer
description: Analyzes code and test coverage metrics. Identifies coverage gaps and recommends additional test cases. Generates coverage reports by module and tracks coverage trends over time.
allowed-tools: Read, Write
effort: medium
---

# Coverage Analyzer

## When to activate

After test execution to understand coverage distribution. Identify untested code, dead code, and areas requiring more test cases. Use to ensure coverage targets are met before release.

## When NOT to use

Not for code quality assessment (coverage ≠ quality). Not as replacement for manual testing. Not without test framework coverage data. Not for enforcing 100% coverage (80% is practical target).

## Coverage Metrics Explained

### Line Coverage
Percentage of source code lines executed by tests. Measures: did the test run this line?

- **High line coverage (>80%):** Most code paths are tested
- **Medium coverage (60-80%):** Main paths tested, some edge cases missing
- **Low coverage (<60%):** Significant untested code

### Branch Coverage
Percentage of conditional branches (if/else, switch cases) executed. More precise than line coverage.

- **Branch coverage >60%:** Most decision points tested
- **Important for:** Complex conditionals, error handling paths

### Function Coverage
Percentage of functions called by at least one test. Quick metric for what code is exercised.

- **Target >80%:** Most functions should have at least one test

### Statement Coverage
Similar to line coverage; percentage of code statements executed.

## Coverage Report Format

```
# Code Coverage Report

**Date:** [YYYY-MM-DD HH:MM:SS UTC]
**Build:** [commit hash]
**Test Framework:** [Pytest / Jest]
**Total Coverage:** [X%]

---

## Overall Coverage Summary

| Metric | Coverage | Target | Status |
|---|---|---|---|
| **Line Coverage** | X% | >80% | PASS/FAIL |
| **Branch Coverage** | X% | >60% | PASS/FAIL |
| **Function Coverage** | X% | >80% | PASS/FAIL |
| **Statement Coverage** | X% | >80% | PASS/FAIL |

---

## Coverage by Module

| Module | File | Lines | Branch | Function | Status |
|---|---|---|---|---|---|
| Authentication | auth/services.py | 92% | 78% | 95% | GOOD |
| Payment | payment/processor.py | 45% | 38% | 52% | LOW |
| User Management | user/models.py | 88% | 71% | 91% | GOOD |
| Database | db/models.py | 76% | 68% | 82% | ADEQUATE |

---

## Coverage Gaps

### High Priority (>50 lines untested)
- `payment/processor.py:refund_payment()` — 0% coverage (15 lines)
  - **Impact:** Payment refunds are untested
  - **Recommendation:** Add 3 test cases (success, invalid transaction, API error)
  
- `auth/middleware.py:rate_limiter()` — 20% coverage (8 lines)
  - **Impact:** Rate limiting not fully tested
  - **Recommendation:** Add tests for burst scenarios, concurrent calls

### Medium Priority (20-50 lines)
- `user/models.py:validate_email()` — 60% coverage
  - **Impact:** Email validation edge cases missing
  - **Recommendation:** Add tests for international domains, subdomains

### Low Priority (<20 lines)
- `utils/logging.py:format_trace()` — 30% coverage
  - **Impact:** Edge case logging scenarios
  - **Recommendation:** Add tests for malformed input

---

## Coverage Trends

| Period | Line Coverage | Branch Coverage | Function Coverage |
|---|---|---|---|
| 2 weeks ago | 72% | 55% | 78% |
| 1 week ago | 75% | 58% | 81% |
| Today | 78% | 62% | 86% |
| Target | 80% | 60% | 80% |

**Trend:** Improving. Current trajectory reaches 80% line coverage in 3 days.

---

## Untested Code Analysis

### Dead Code (Never Executed)
- `auth/legacy_oauth1.py` — 0% coverage (100+ lines)
  - **Decision:** Can this be removed? If not, add deprecation warning.

### Conditional Dead Code
- `user/models.py:get_user():` — Line 45 has unreachable else branch
  - **Analysis:** The preceding condition is always true; else branch never executes
  - **Recommendation:** Review logic; remove if truly unreachable

### Error Handlers (Hard to Test)
- `payment/processor.py:handle_stripe_error()` — 15% coverage
  - **Challenge:** Requires mocking Stripe error responses
  - **Recommendation:** Add mock tests for each error type

---

## Recommendations

### Immediate (Before Release)
1. Add 3 test cases for `payment/processor.py:refund_payment()`
   - Success case: valid transaction refunded
   - Failure case: invalid transaction ID
   - Error case: API timeout

2. Improve `auth/middleware.py:rate_limiter()` coverage
   - Test normal requests (under limit)
   - Test burst scenario (exceed limit, get 429 Too Many Requests)
   - Test concurrent requests

### This Sprint
3. Add tests for email validation edge cases
4. Review and remove or deprecate `auth/legacy_oauth1.py`
5. Increase function coverage to >90%

### Future (Technical Debt)
6. Improve error handler test coverage
7. Add integration tests for cross-module interactions

---

## How to Improve Coverage

### 1. Identify Untested Lines
```bash
# Generate HTML coverage report
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser — red lines are untested
```

### 2. Write Tests for Gaps
- Focus on high-risk code first (security, payments, data)
- Don't chase 100% coverage (diminishing returns after 85%)
- Prioritize critical paths and error handling

### 3. Use Coverage-Driven Testing
- Start with failing test (TDD)
- Write code to make test pass
- Verify coverage increases
- Refactor for clarity

---

## Coverage Goals by Module

| Module | Target | Reason |
|---|---|---|
| auth/ | >90% | Security-critical code |
| payment/ | >85% | Financial impact |
| user/ | >80% | User data at risk |
| api/ | >80% | Contract enforcement |
| db/ | >75% | Complex edge cases |
| utils/ | >70% | Less critical |
| ui/ | >60% | Often covered by E2E tests |

---
