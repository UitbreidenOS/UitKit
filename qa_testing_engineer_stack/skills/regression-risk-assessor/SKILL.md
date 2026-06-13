---
name: regression-risk-assessor
description: Analyzes code changes and assesses regression risk. Identifies which test paths must be re-run before release. Recommends critical test suites based on file modifications and dependency impact.
allowed-tools: Read, Write
effort: medium
---

# Regression Risk Assessor

## When to activate

Before any release or when code changes are submitted. Analyze what code changed, assess risk of introducing regressions, and recommend which test paths must be re-run for validation.

## When NOT to use

Not for ongoing test execution (use test-executor for that). Not without a clear set of code changes. Not for exploratory testing. Not as replacement for full test suite (use with coverage-analyzer for comprehensive testing).

## Regression Risk Framework

### Risk Assessment Levels

| Risk Level | Definition | Re-test Depth | Action |
|---|---|---|---|
| **CRITICAL** | Core infrastructure, security, payments, data access | Full regression suite + stress tests | Block release until passing; full QA sign-off |
| **HIGH** | Major features, APIs, database schema | Full regression suite for feature + adjacent modules | Release requires QA approval |
| **MEDIUM** | Feature enhancements, UI updates, internal APIs | Targeted regression suite for feature + unit tests | Release may proceed with testing |
| **LOW** | Documentation, comments, non-functional changes, logging | Unit tests only; optional regression | Release permitted after unit tests |

### Risk Factors

For each code change, evaluate:

1. **Scope of change:** Single function vs. entire module
2. **Type of change:** Bug fix vs. feature vs. refactor vs. infrastructure
3. **Module criticality:** Core vs. peripheral
4. **Dependency impact:** Does this affect other modules?
5. **API changes:** Breaking changes or additions?
6. **Data model changes:** Schema, field types, constraints?
7. **Third-party integrations:** External service interactions?
8. **Performance impact:** Could this affect benchmarks?

## Regression Risk Assessment Template

```
# Regression Risk Assessment

**Build/PR:** [commit hash or PR number]
**Branch:** [feature branch name]
**Date:** [YYYY-MM-DD HH:MM UTC]

---

## Code Changes Summary

Files Modified: [N]
- [file 1 — brief description of change]
- [file 2 — brief description of change]

Lines Changed: +[N] -[N]

---

## Risk Analysis

| Factor | Assessment | Impact |
|---|---|---|
| **Scope** | [Single function / module / cross-module] | [HIGH / MEDIUM / LOW] |
| **Type** | [Bug fix / Feature / Refactor / Infrastructure] | [HIGH / MEDIUM / LOW] |
| **Module Criticality** | [Critical / Important / Peripheral] | [HIGH / MEDIUM / LOW] |
| **Dependency Impact** | [Wide / Moderate / Isolated] | [HIGH / MEDIUM / LOW] |
| **API Changes** | [Breaking / Non-breaking / None] | [HIGH / MEDIUM / LOW] |
| **Data Model** | [Schema change / Field change / None] | [HIGH / MEDIUM / LOW] |
| **Integrations** | [Multiple / Single / None] | [HIGH / MEDIUM / LOW] |
| **Performance** | [Potential impact / Minimal / None] | [HIGH / MEDIUM / LOW] |

---

## Overall Risk Level

**Risk:** [CRITICAL / HIGH / MEDIUM / LOW]

**Rationale:**
[Summary of why this risk level]

---

## Recommended Test Paths

### Must-Run (All changes)
- [ ] Full unit test suite — verify no broken tests
- [ ] Build passes — verify no compilation errors

### Run if High+ Risk
- [ ] Full regression test suite — comprehensive validation
- [ ] API contract tests — verify endpoints still work
- [ ] Database migration tests — verify schema changes don't break data
- [ ] Integration tests — verify cross-module interactions

### Run if Critical Risk
- [ ] End-to-end test suite — full user workflows
- [ ] Performance baseline tests — verify no degradation
- [ ] Security tests — verify no new vulnerabilities
- [ ] Load tests — verify system handles expected load
- [ ] Manual regression testing — exploratory QA

### Optional (Lower risk)
- [ ] UI visual regression tests — verify layout unchanged
- [ ] Mobile compatibility tests — responsive design validation

---

## Critical Test Paths to Re-run

Based on code changes, these test paths are highest priority:

1. **Test Path 1:** [Why this is critical given the change]
2. **Test Path 2:** [Why this is critical given the change]
3. **Test Path 3:** [Why this is critical given the change]

---

## Dependency Impact Map

```
Changed Module: [module]
Depends On: [modules that depend on this module]
Used By: [modules using this module]

Regression Risk: Affects [N] dependent modules
```

---

## Release Readiness

- [ ] Code changes reviewed and approved
- [ ] All must-run tests passing
- [ ] All recommended tests passing (if risk is HIGH+)
- [ ] Coverage maintained or improved
- [ ] No new regressions detected
- [ ] Performance baselines met
- [ ] QA sign-off obtained (if risk is HIGH+)

---

## Sign-off

**Assessed By:** [Name]  
**Date:** [YYYY-MM-DD HH:MM UTC]  
**Risk Level:** [CRITICAL / HIGH / MEDIUM / LOW]  
**Recommendation:** [Approve for release / Hold for additional testing / Escalate to lead]
```

## Example Risk Assessments

### Example 1: High-Risk Code Change

```
# Regression Risk Assessment

**Build/PR:** PR-3421
**Branch:** feature/payment-refunds
**Date:** 2026-06-13 10:00 UTC

---

## Code Changes Summary

Files Modified: 4
- payment/processor.py — Add refund_payment() function (120 lines added)
- payment/models.py — Add Refund model and fields (45 lines added)
- db/migrations/001_add_refunds.py — Schema migration (30 lines)
- payment/tests/test_refunds.py — New test cases (100 lines)

Lines Changed: +295 -8

---

## Risk Analysis

| Factor | Assessment | Impact |
|---|---|---|
| **Scope** | Multiple modules (payment, database) | HIGH |
| **Type** | Feature addition (refunds) | HIGH |
| **Module Criticality** | Critical (payment processing) | HIGH |
| **Dependency Impact** | Moderate (affects checkout flow) | MEDIUM |
| **API Changes** | New endpoint: POST /api/refund | HIGH |
| **Data Model** | New Refund table + payment.refund_status field | HIGH |
| **Integrations** | Stripe refund API | MEDIUM |
| **Performance** | Potential database query impact | MEDIUM |

---

## Overall Risk Level

**Risk:** CRITICAL

**Rationale:**
This change modifies the payment processing module, which is business-critical.
It adds a new data model and integrates with Stripe refunds. Any bugs could
result in lost refunds or double-charges. High-impact feature requires
comprehensive regression testing.

---

## Recommended Test Paths

### Must-Run (All changes)
- [x] Full unit test suite — 45/45 tests passing
- [x] Build passes — 0 compilation errors

### Run if High+ Risk
- [ ] Full regression test suite — **IN PROGRESS** (23/25 passing, 2 flaky)
- [ ] API contract tests — **TODO**
- [ ] Database migration tests — **TODO**
- [ ] Integration tests (payment flow) — **TODO**

### Run if Critical Risk
- [ ] End-to-end test suite — **TODO**
- [ ] Performance baseline tests — **TODO**
- [ ] Security tests (payment validation) — **TODO**
- [ ] Load tests (concurrent refunds) — **TODO**
- [ ] Manual regression testing — **TODO**

---

## Critical Test Paths to Re-run

1. **Happy path: User initiates refund**
   - Purchase → View order → Click refund → Refund submitted → Stripe processes → DB updates
   - **Why critical:** Core user workflow for new feature

2. **Refund status persistence**
   - Multiple refund requests on same order → statuses tracked → no duplicates
   - **Why critical:** Data integrity is critical for payments

3. **Stripe integration error handling**
   - Stripe API returns error (timeout, invalid transaction ID, etc.)
   - System gracefully handles error → refund marked as FAILED
   - **Why critical:** External service failures must not crash system

4. **Concurrent refunds on same order**
   - 2 users simultaneously request refund → only 1 succeeds
   - **Why critical:** Race condition could cause double-refunds

---

## Dependency Impact Map

```
Changed Module: payment/processor.py
  - Depends On: stripe (external), db, models
  - Used By: checkout flow, admin refund dashboard, payment webhooks

Regression Risk: Affects 3 dependent modules (checkout, admin, webhooks)

Related Critical Path: checkout-to-refund-to-stripe (end-to-end)
```

---

## Release Readiness

- [ ] Code changes reviewed and approved
- [ ] All must-run tests passing
- [ ] All recommended tests passing (HIGH+ risk)
- [ ] Coverage maintained or improved
- [ ] No new regressions detected
- [ ] Performance baselines met
- [ ] QA sign-off obtained

**Current Status:** 40% ready. Blocking issues: 2 flaky tests in regression suite.

---

## Sign-off

**Assessed By:** qa-engineer  
**Date:** 2026-06-13 10:00 UTC  
**Risk Level:** CRITICAL  
**Recommendation:** **HOLD for additional testing**

**Next Steps:**
1. Fix 2 flaky tests in regression suite (token rotation, concurrent payment)
2. Run full end-to-end test suite (payment workflow)
3. Stress test: 50 concurrent refund requests
4. Stripe integration validation in staging
5. Security review: prevent user from refunding other user's orders
```

### Example 2: Low-Risk Code Change

```
# Regression Risk Assessment

**Build/PR:** PR-3422
**Branch:** docs/update-readme
**Date:** 2026-06-13 11:00 UTC

---

## Code Changes Summary

Files Modified: 2
- README.md — Update installation instructions (50 lines)
- docs/CONTRIBUTING.md — Add test case format (30 lines)

Lines Changed: +80 -0

---

## Risk Analysis

| Factor | Assessment | Impact |
|---|---|---|
| **Scope** | Documentation only | LOW |
| **Type** | Documentation update | LOW |
| **Module Criticality** | Non-critical (docs) | LOW |
| **Dependency Impact** | None | NONE |
| **API Changes** | None | NONE |
| **Data Model** | None | NONE |
| **Integrations** | None | NONE |
| **Performance** | None | NONE |

---

## Overall Risk Level

**Risk:** LOW

**Rationale:**
Documentation changes only. No code modifications. No impact on system behavior,
performance, or data. Lowest risk category.

---

## Recommended Test Paths

### Must-Run (All changes)
- [x] Full unit test suite — 45/45 passing
- [x] Build passes — 0 errors

### Optional (Lower risk)
- [ ] Manual review of documentation — **TODO** (but not required for release)

---

## Release Readiness

- [x] Code changes reviewed and approved
- [x] All must-run tests passing
- [x] Coverage maintained
- [x] No regression impact

**Current Status:** 100% ready. No blockers.

---

## Sign-off

**Assessed By:** qa-engineer  
**Date:** 2026-06-13 11:00 UTC  
**Risk Level:** LOW  
**Recommendation:** **APPROVE for release**

**Rationale:** Documentation-only changes. No testing required.
```

---
