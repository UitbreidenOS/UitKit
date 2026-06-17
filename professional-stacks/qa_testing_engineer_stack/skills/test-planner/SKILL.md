---
name: test-planner
description: Analyzes feature requirements and generates a comprehensive test plan with test case outlines, coverage goals, acceptance criteria, and risk assessment. Identifies critical paths and edge cases.
allowed-tools: Read, Write
effort: medium
---

# Test Planner

## When to activate

Before any test cycle begins for a new feature or major bug fix. Trigger when you have access to feature requirements, acceptance criteria, and design documentation. Essential for complex features spanning multiple modules or user workflows.

## When NOT to use

Not for quick smoke tests or manual exploratory testing. Not when testing is already in progress and test cases already exist. Not for documentation-only features with no code changes. Not without access to requirements or acceptance criteria.

## Test Plan Components

### 1. Feature Overview
Summarize what is being tested. Include feature name, epic/story ID, acceptance criteria, and any dependencies or integrations.

### 2. Test Scope
Define what is in scope and explicitly what is out of scope. List which modules, integrations, and workflows will be tested.

### 3. Coverage Goals
Set numeric coverage targets for:
- **Unit test coverage:** Target percentage (e.g., >80%)
- **Integration test coverage:** Target percentage (e.g., >60%)
- **Critical user paths:** Target percentage (e.g., >95%)

### 4. Risk Assessment
Identify high-risk areas:
- Database schema changes
- API contract changes
- Security-sensitive code
- Performance-critical paths
- Third-party integrations
- Legacy code modifications

### 5. Critical Test Paths
List 3-5 most critical user workflows that must pass. These are regression tests post-release.

### 6. Test Categories
Break down tests by category:
- **Positive tests:** Happy path, valid inputs, expected flows
- **Negative tests:** Invalid inputs, error handling, boundary conditions
- **Edge cases:** Unusual but valid scenarios, limits, race conditions
- **Integration tests:** Cross-module interactions, API contracts
- **Performance tests:** Load testing, response time baselines
- **Security tests:** Input validation, authorization, data protection

### 7. Acceptance Criteria
Define when testing is complete:
- Minimum coverage thresholds met
- All P1/P2 bugs resolved
- Critical paths pass
- Performance baselines met
- No regressions detected

## Test Plan Output Format

```
# Test Plan: [Feature Name]

## Feature Overview
[Brief description of feature]
- Feature ID: [ID]
- Status: [In Development / Ready for Test]
- Owner: [Engineer]

## Test Scope
**In Scope:**
- [Module/workflow 1]
- [Module/workflow 2]

**Out of Scope:**
- [What is excluded and why]

## Risk Assessment
**High Risk:**
- [Area 1] — [reason and mitigation]
- [Area 2] — [reason and mitigation]

**Medium Risk:**
- [Area]

## Coverage Goals
- Unit Test Coverage: >80%
- Integration Test Coverage: >60%
- Critical User Paths: 100%
- API Endpoints: 100%

## Critical Test Paths
1. [Workflow 1] — [why critical]
2. [Workflow 2] — [why critical]
3. [Workflow 3] — [why critical]

## Test Categories

### Positive Tests (Happy Path)
- [Test case 1]
- [Test case 2]

### Negative Tests (Error Handling)
- [Test case 1]
- [Test case 2]

### Edge Cases
- [Test case 1]
- [Test case 2]

### Integration Tests
- [Test case 1]
- [Test case 2]

### Performance Tests
- [Test case 1]
- [Test case 2]

### Security Tests
- [Test case 1]
- [Test case 2]

## Acceptance Criteria
- [ ] Unit test coverage ≥80%
- [ ] Integration test coverage ≥60%
- [ ] All critical paths pass
- [ ] All P1/P2 bugs resolved
- [ ] No new regressions detected
- [ ] Performance baselines met
- [ ] Security tests pass

## Estimated Effort
- Test case generation: [X hours]
- Test automation: [X hours]
- Manual testing: [X hours]
- Total: [X hours]
```

## Example

```
# Test Plan: User Authentication Module

## Feature Overview
Implement OAuth 2.0 authentication with JWT tokens and refresh token rotation.
- Feature ID: AUTH-42
- Status: Ready for Test
- Owner: John Smith

## Test Scope
**In Scope:**
- OAuth 2.0 flow (login, logout, token refresh)
- JWT token validation and expiration
- Refresh token rotation
- Error handling (invalid credentials, expired tokens)
- Database persistence of tokens
- API endpoints: /auth/login, /auth/logout, /auth/refresh

**Out of Scope:**
- Third-party OAuth provider UI (only API mocking)
- Two-factor authentication (separate feature)
- Account recovery (separate feature)

## Risk Assessment
**High Risk:**
- Token expiration logic — security-critical, easy to get wrong, potential data exposure
- Token refresh rotation — prevents token replay attacks, complex state management
- Session invalidation — must clear all existing tokens on logout

**Medium Risk:**
- Error messages — must not leak information about valid/invalid users
- Database transactions — concurrent token updates could cause race conditions

## Coverage Goals
- Unit Test Coverage: >90% (security-critical code)
- Integration Test Coverage: >75% (database + API interactions)
- Critical User Paths: 100%
- API Endpoints: 100%

## Critical Test Paths
1. Login → Receive JWT token → Make authenticated request — verify token is valid and request succeeds
2. Token expires → Call /auth/refresh → Receive new JWT + new refresh token — verify rotation works
3. Logout → Token invalidated → Attempt request with old token — verify 401 Unauthorized returned
4. Invalid credentials → Login attempt fails — verify error message does not leak user existence
5. Refresh token expired → Call /auth/refresh → Receive 401 — verify cannot refresh expired tokens

## Test Categories

### Positive Tests (Happy Path)
- User logs in with valid credentials → receives JWT + refresh token
- User calls /auth/refresh with valid refresh token → receives new JWT + new refresh token
- User makes API request with valid JWT → request succeeds
- User logs out → token is invalidated
- Multiple sequential logins → each creates new JWT + refresh token

### Negative Tests (Error Handling)
- User logs in with invalid email → 401 Unauthorized
- User logs in with wrong password → 401 Unauthorized
- User makes request with expired JWT → 401 Unauthorized
- User makes request with malformed JWT → 400 Bad Request
- User attempts to refresh with expired refresh token → 401 Unauthorized
- User attempts to refresh with invalid refresh token → 401 Unauthorized
- User makes request with no Authorization header → 401 Unauthorized

### Edge Cases
- User logs in from 2 devices simultaneously → each device gets separate JWT
- User logs in, device 1 does /auth/refresh → device 2's old refresh token becomes invalid (rotation)
- User's JWT expires while request is in flight → graceful error handling
- Concurrent token refresh requests → prevent race condition (only one refresh succeeds)
- System clock skew — JWT validation with clock tolerance

### Integration Tests
- Login API persists refresh token to database
- Logout API removes all tokens from database for user
- /auth/refresh API rotates tokens in database atomically
- Multiple API endpoints validate JWT correctly

### Performance Tests
- JWT validation completes in <10ms (not a bottleneck)
- /auth/refresh endpoint responds in <200ms
- Token refresh rotation does not block other API requests

### Security Tests
- JWT is signed correctly (cannot be tampered with)
- Refresh token is random and unguessable (>128 bits entropy)
- Password not stored in JWT or logs
- Error messages do not reveal whether email exists in system
- Tokens cannot be used cross-tenant (multi-tenancy check)

## Acceptance Criteria
- [ ] Unit test coverage ≥90%
- [ ] Integration test coverage ≥75%
- [ ] All 5 critical paths pass
- [ ] All negative test cases pass (no crashes on invalid input)
- [ ] All P1/P2 bugs (security, data loss) resolved
- [ ] No regressions in adjacent auth features
- [ ] Performance baselines met (<10ms token validation)
- [ ] Security tests pass (JWT signing, token entropy)

## Estimated Effort
- Test case generation: 4 hours
- Test automation: 8 hours
- Manual testing: 2 hours
- Total: 14 hours
```

---
