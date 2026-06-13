---
name: test-suite-optimizer
description: Reviews test suite for redundancy, duplication, and inefficiency. Consolidates duplicate tests, identifies slow tests, and recommends test removal. Improves overall test execution time and maintainability.
allowed-tools: Read, Write
effort: medium
---

# Test Suite Optimizer

## When to activate

During maintenance cycles or when test suite execution time becomes excessive (>20 minutes). Analyze test redundancy, identify slow tests, and optimize for speed and maintainability without losing coverage.

## When NOT to use

Not for ongoing test execution (use test-executor for that). Not immediately after writing tests (let tests stabilize first). Not without comprehensive test coverage data. Not when time-critical (optimization is longer-term work).

## Test Suite Analysis Framework

### Types of Test Redundancy

#### 1. Identical Tests
Two or more tests that exercise the exact same code path and assertions.

```python
# BAD: Duplicate tests
def test_user_login_happy_path():
    response = client.post("/auth/login", data={"email": "test@example.com", "password": "correct"})
    assert response.status_code == 200
    assert "token" in response.json()

def test_user_login_success():  # <-- Identical to above!
    response = client.post("/auth/login", data={"email": "test@example.com", "password": "correct"})
    assert response.status_code == 200
    assert "token" in response.json()
```

**Solution:** Keep one test, remove duplicate.

#### 2. Overlapping Tests
Tests that cover the same code path with minor variations (different test data).

```python
# BAD: Overlapping tests
def test_login_with_email():
    response = client.post("/auth/login", data={"email": "john@example.com", "password": "correct"})
    assert response.status_code == 200

def test_login_with_other_email():  # <-- Same code path, different email
    response = client.post("/auth/login", data={"jane@example.com", "password": "correct"})
    assert response.status_code == 200
```

**Solution:** Consolidate into parametrized test.

#### 3. Redundant Assertions
Tests with unnecessary assertions that verify the same thing multiple ways.

```python
# BAD: Redundant assertions
def test_token_generation():
    token = generate_token()
    assert token is not None
    assert token != ""  # <-- Redundant, already checked above
    assert len(token) > 0  # <-- Redundant
    assert type(token) == str  # <-- Redundant
```

**Solution:** Keep only essential assertions (token is not None).

#### 4. Over-Testing Internal Implementation
Tests that verify internal implementation details rather than behavior.

```python
# BAD: Over-testing implementation
def test_password_hash_using_bcrypt():  # Tests implementation detail
    hashed = hash_password("password")
    assert hashed.startswith("$2b$")  # Tests bcrypt format specifically

# GOOD: Test behavior
def test_password_hash_produces_different_output():  # Tests behavior
    hash1 = hash_password("password")
    hash2 = hash_password("password")
    assert hash1 != hash2  # Hashes are different (salted)
```

**Solution:** Test behavior, not implementation.

#### 5. Unit Tests Redundant with Integration Tests
Unit tests that are fully covered by integration tests (duplicate coverage).

```python
# BAD: Unit test redundant with integration test
def test_parse_jwt_token():  # Unit test
    token = "eyJhbGci..."
    payload = parse_jwt(token)
    assert payload["sub"] == "user@example.com"

# This is already tested by integration test:
def test_api_request_with_jwt_token():  # Integration test
    # ... login, get token, use token ...
    # ... parse_jwt is called internally ...
```

**Solution:** Remove unit test if coverage is >95% from integration tests.

## Test Suite Optimization Report Template

```
# Test Suite Optimization Report

**Date:** [YYYY-MM-DD HH:MM UTC]
**Test Framework:** [Pytest / Jest]
**Total Tests:** [N]
**Current Execution Time:** [X min Y sec]

---

## Redundancy Analysis

### Identical Tests Found: [N]

| Test Name | Duplicate Of | Action | Savings |
|---|---|---|---|
| test_user_login_success | test_user_login_happy_path | Remove | 2 sec |

Total Tests to Remove: [N]  
Execution Time Savings: [X sec]

### Overlapping Tests Found: [N]

| Tests | Code Path | Recommendation | Consolidation |
|---|---|---|---|
| test_login_valid_email, test_login_other_email | POST /auth/login | Consolidate | Parametrized test |

Consolidation Savings: [X sec]

### Redundant Assertions Found: [N]

| Test | Issue | Fix |
|---|---|---|
| test_token_generation | 3 redundant assertions | Keep only "token is not None" |

---

## Slow Tests Analysis

### Top 10 Slowest Tests

| Rank | Test Name | Time | Category | Why Slow? |
|---|---|---|---|---|
| 1 | test_end_to_end_checkout_flow | 8.2s | Integration | 3 API calls + 2 database queries |
| 2 | test_load_1000_users_simultaneously | 5.1s | Performance | Stress test — expected |
| 3 | test_email_sending_workflow | 3.2s | Integration | External email service timeout |
| 4 | test_image_upload_processing | 2.8s | Integration | Image processing library |
| 5 | test_database_migration_full_dataset | 2.5s | Infrastructure | 50K records migration |

**Average Test Time:** [X ms]  
**Median Test Time:** [X ms]

### Tests Exceeding 1 Second Threshold

- test_end_to_end_checkout_flow — 8.2s (8x slower than target)
  - **Root Cause:** 3 sequential API calls; no parallelization
  - **Recommendation:** Mock 2 API calls; only test 1 real endpoint
  - **Estimated Savings:** 5-6 seconds

- test_email_sending_workflow — 3.2s (32x slower than target)
  - **Root Cause:** Real email service integration; 3-second timeout
  - **Recommendation:** Mock email service; test email construction separately
  - **Estimated Savings:** 2-3 seconds

---

## Dead Tests (Can Be Removed)

| Test Name | Reason | Coverage Impact |
|---|---|---|
| test_legacy_oauth1_flow | OAuth 1.0 deprecated 6 months ago | None (legacy module has 0% coverage) |
| test_internet_explorer_compat | IE support dropped in v2.0 | None (IE tests not in coverage metrics) |

**Recommendation:** Remove after verifying legacy modules are also removed.

---

## Coverage-Preserving Optimizations

### Parametrized Tests

Convert multiple similar tests into one parametrized test:

```python
# BEFORE: 5 separate tests
def test_login_with_email():
def test_login_with_username():
def test_login_with_phone():
def test_login_case_insensitive():
def test_login_whitespace_trimmed():

# AFTER: 1 parametrized test
@pytest.mark.parametrize("identifier,value", [
    ("email", "john@example.com"),
    ("username", "john_doe"),
    ("phone", "+1-555-0123"),
    ("email_mixed_case", "John@Example.COM"),
    ("email_with_spaces", "  john@example.com  "),
])
def test_login_with_various_identifiers(identifier, value):
    response = client.post("/auth/login", data={identifier: value})
    assert response.status_code == 200
```

**Benefit:** 5 tests → 1 parametrized test (5x cleaner, same coverage)

### Shared Fixtures

Consolidate test setup across multiple tests:

```python
# Use pytest fixtures for common setup
@pytest.fixture
def authenticated_user(client):
    """Returns authenticated session for testing."""
    client.post("/auth/login", data={"email": "test@example.com", "password": "correct"})
    return client

# Use in multiple tests
def test_user_profile_view(authenticated_user):
    response = authenticated_user.get("/api/profile")
    assert response.status_code == 200

def test_user_logout(authenticated_user):
    response = authenticated_user.post("/auth/logout")
    assert response.status_code == 200
```

**Benefit:** Reduces duplicate setup code; improves maintainability

### Test Categorization

Mark tests by type and run categories selectively:

```python
# Mark tests
@pytest.mark.unit
def test_password_validation():
    ...

@pytest.mark.integration
def test_login_flow():
    ...

@pytest.mark.slow
def test_load_10000_requests():
    ...

# Run selectively
pytest -m "not slow"  # Fast tests only
pytest -m "unit or integration"  # Exclude slow tests
```

---

## Optimization Recommendations

### High Impact (1-2 hours effort, 30+ second savings)

1. **Remove 3 duplicate tests** — test_login_success and variants
   - Savings: 6 seconds
   - Effort: 30 min
   
2. **Consolidate email validation tests into parametrized test** — 8 tests → 1
   - Savings: 8 seconds
   - Effort: 45 min
   
3. **Mock external email service in test_email_sending_workflow**
   - Savings: 3 seconds per test run
   - Effort: 1 hour

### Medium Impact (2-4 hours effort, 10-20 second savings)

4. **Consolidate user creation tests** — 12 similar tests → 3 parametrized
   - Savings: 15 seconds
   - Effort: 2 hours

### Low Impact (1-2 hours effort, <5 second savings)

5. **Remove redundant assertions** — Clean up 5 tests
   - Savings: 2 seconds
   - Effort: 1 hour

---

## Estimated Impact After Optimization

| Metric | Before | After | Improvement |
|---|---|---|---|
| Total Tests | 142 | 118 | -17% tests, same coverage |
| Execution Time | 14 min 32 sec | 8 min 45 sec | -40% time |
| Redundancy | 24 redundant tests | 0 | 100% reduction |
| Maintenance Cost | 3 hours/quarter | 1.5 hours/quarter | -50% effort |

---

## Test Suite Optimization Checklist

- [ ] Remove 3 duplicate tests (login variants)
- [ ] Consolidate email validation tests (8 → 1 parametrized)
- [ ] Mock external email service
- [ ] Consolidate user creation tests (12 → 3 parametrized)
- [ ] Remove redundant assertions
- [ ] Run full test suite after optimization
- [ ] Verify coverage maintained (>80%)
- [ ] Verify performance improvement achieved
- [ ] Update test documentation

---

## Maintenance Strategy

Going forward:
- Before adding new test, check if similar test exists
- Use parametrized tests for multiple similar scenarios
- Run `pytest --dupes` monthly to detect new duplicates
- Target: Keep execution time <10 minutes
- Target: Keep tests <150 total (good coverage-to-count ratio)

---
