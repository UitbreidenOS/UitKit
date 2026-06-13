---
name: test-case-generator
description: Creates detailed test cases in standard format covering positive, negative, and edge cases. Generates test case IDs, preconditions, steps, expected results, and acceptance criteria. Auto-saves to test-registry.md.
allowed-tools: Read, Write
effort: medium
---

# Test Case Generator

## When to activate

After test plan is approved. Generate test cases for each identified test category (positive, negative, edge cases, integration). Essential for creating a traceable, executable test registry.

## When NOT to use

Not when test cases already exist in the registry. Not as a replacement for exploratory testing. Not without a test plan defining coverage goals. Not for undocumented features or acceptance criteria.

## Test Case Structure

Every test case must include:

1. **Test Case ID:** Unique identifier (e.g., TC-AUTH-001, TC-PAYMENT-EDGE-003)
2. **Title:** Clear, descriptive one-liner
3. **Preconditions:** Environment, data, or state required before test runs
4. **Steps:** Sequential numbered steps (user actions and verifications)
5. **Expected Result:** Specific expected behavior (what should happen)
6. **Actual Result:** Filled in during execution (what actually happened)
7. **Status:** PASS, FAIL, BLOCKED, SKIP
8. **Test Type:** Positive, Negative, Edge Case, Integration, Performance, Security
9. **Coverage:** Which requirement/acceptance criterion this covers
10. **Notes:** Any special considerations, blockers, or retry logic

## Test Case Template

```
## Test Case: [TC-MODULE-###]

**Title:** [Clear, descriptive one-liner about what is being tested]

**Test Type:** [Positive / Negative / Edge Case / Integration / Performance / Security]

**Preconditions:**
- [Setup required: user logged in, data in database, environment config, etc.]
- [Any test data that must exist before starting]

**Steps:**
1. [User action] → [Verify result]
2. [User action] → [Verify result]
3. [Assertion/verification of final state]

**Expected Result:**
- [Specific expected behavior]
- [Expected data state]
- [Expected error message or redirect, if applicable]

**Actual Result:**
- [Filled in during execution]

**Status:** [PASS / FAIL / BLOCKED / SKIP]

**Bug Reference:** [If failed, link to bug ID]

**Coverage:**
- Requirement: [Which acceptance criterion this covers]
- Module: [Which code module is tested]
- Function: [Which function/API endpoint]

**Effort:** [1 hour / 30 min / 15 min — time to execute]

**Notes:**
- [Any special considerations: data cleanup, environment setup, or flakiness concerns]
```

## Test Case Naming Convention

**Pattern:** `TC-[MODULE]-[NUMBER]-[VARIANT]`

Examples:
- `TC-AUTH-001-HAPPY` — Happy path for login
- `TC-AUTH-002-INVALID-EMAIL` — Negative case: invalid email format
- `TC-AUTH-003-EXPIRED-TOKEN` — Edge case: expired JWT
- `TC-PAYMENT-004-RACE-CONDITION` — Integration test: concurrent charges
- `TC-API-005-PERF` — Performance baseline

## Test Case Categories

### Positive Tests (Happy Path)
- User performs valid action → expected result occurs
- Data flows correctly through system
- No errors are raised
- Example: User logs in with valid credentials → JWT received

### Negative Tests (Error Handling)
- User provides invalid input → error is handled gracefully
- System rejects bad requests
- Error messages are clear and actionable
- Example: User logs in with wrong password → 401 Unauthorized

### Edge Cases
- Boundary conditions (min, max values)
- Unusual but valid scenarios
- Race conditions and concurrency
- Cascading operations
- Example: User's JWT expires mid-request → graceful error

### Integration Tests
- Cross-module interactions
- API contracts between services
- Database consistency
- Example: OAuth login persists token to database correctly

### Performance Tests
- Response time baselines
- Load capacity
- Resource usage
- Example: API endpoint responds in <200ms under normal load

### Security Tests
- Input validation
- Authorization enforcement
- Data protection
- Example: User cannot access another user's data via API

## Output Format

All generated test cases are appended to `test-registry.md` in the following format:

```
# Test Cases: [Module/Feature Name]

[Test Case 1]
[Test Case 2]
...

**Total Test Cases:** [N]
**Coverage:** [X% of acceptance criteria]
**Effort to Execute:** [X hours for full suite]
```

## Example

```
## Test Case: TC-AUTH-001-HAPPY

**Title:** User logs in successfully with valid email and password

**Test Type:** Positive

**Preconditions:**
- User account exists in database: email=john@example.com, password_hash=bcrypt(correct_password)
- Authentication service is running and healthy
- Environment: staging (no production data)

**Steps:**
1. Navigate to /login
2. Enter email: john@example.com
3. Enter password: correct_password
4. Click "Sign In" button
5. Verify page redirects to /dashboard
6. Verify JWT token is present in Authorization header
7. Verify refresh token is set as secure HTTP-only cookie
8. Verify user profile is displayed correctly

**Expected Result:**
- User is redirected to /dashboard
- HTTP response contains Authorization header with valid JWT token
- HTTP response contains Set-Cookie header with refresh token (secure, HTTP-only, SameSite=Strict)
- /dashboard displays user's name and email correctly
- API requests to /api/profile return 200 OK with user data

**Actual Result:**
- [To be filled during execution]

**Status:** [PASS / FAIL / BLOCKED / SKIP]

**Bug Reference:** [If failed]

**Coverage:**
- Requirement: User can log in with valid credentials
- Requirement: JWT token is generated and returned
- Requirement: Refresh token is stored securely
- Module: Authentication Service
- Function: POST /auth/login

**Effort:** 5 minutes

**Notes:**
- No data cleanup needed — test database is fresh each run
- Ensure clock skew is <10 seconds (JWT validation tolerance)

---

## Test Case: TC-AUTH-002-INVALID-EMAIL

**Title:** Login fails with invalid email format

**Test Type:** Negative

**Preconditions:**
- Authentication service is running

**Steps:**
1. Navigate to /login
2. Enter email: not-an-email
3. Enter password: any_password
4. Click "Sign In" button
5. Verify error message is displayed
6. Verify page does NOT redirect to /dashboard
7. Verify no JWT token is returned

**Expected Result:**
- Page remains on /login
- Error message displays: "Invalid email format"
- HTTP response is 400 Bad Request
- No Authorization header in response
- No Set-Cookie header in response

**Actual Result:**
- [To be filled during execution]

**Status:** [PASS / FAIL / BLOCKED / SKIP]

**Bug Reference:** [If failed]

**Coverage:**
- Requirement: Email validation is enforced
- Requirement: Error messages are user-friendly
- Module: Authentication Service
- Function: POST /auth/login — validation

**Effort:** 3 minutes

**Notes:**
- Test multiple invalid formats: "test@", "@example.com", "test..@example.com", "test @example.com"
- Ensure error message does NOT reveal whether user exists (security)

---

## Test Case: TC-AUTH-003-EXPIRED-TOKEN

**Title:** User cannot make API request with expired JWT token

**Test Type:** Edge Case

**Preconditions:**
- User is logged in and has valid JWT token
- JWT token is set to expire in 1 second
- User waits for token to expire

**Steps:**
1. Login and obtain valid JWT token
2. Wait 1 second for token to expire
3. Make API request to /api/profile with expired JWT in Authorization header
4. Verify API returns 401 Unauthorized
5. Verify error message: "Token expired"

**Expected Result:**
- API returns 401 Unauthorized
- Response body contains: {"error": "Token expired"}
- No user data is returned
- User must refresh token to proceed

**Actual Result:**
- [To be filled during execution]

**Status:** [PASS / FAIL / BLOCKED / SKIP]

**Bug Reference:** [If failed]

**Coverage:**
- Requirement: Expired tokens are rejected
- Requirement: Token expiration is enforced
- Module: JWT Validation Middleware
- Function: verifyToken()

**Effort:** 10 minutes

**Notes:**
- This test requires manipulating token expiration time
- May need to mock current time or use test tokens with short TTL
- Verify response headers do not leak token info

---

**Total Test Cases:** 3
**Coverage:** 60% of acceptance criteria (more edge cases and integration tests needed)
**Effort to Execute:** 18 minutes for full auth test suite
```

---
