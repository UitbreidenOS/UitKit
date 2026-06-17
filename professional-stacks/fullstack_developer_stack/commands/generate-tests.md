---
description: Generate comprehensive test suites for frontend, backend, and integration layers. Covers unit tests, component tests, API tests, and E2E scenarios with appropriate frameworks and patterns.
---

# /generate-tests

## What This Does
Automatically generates test suites covering unit, component, API, and end-to-end testing. Adapts frameworks and patterns to your codebase (Jest, Vitest, pytest, Playwright, Cypress). Returns runnable test files with mocking, fixtures, and coverage targets.

## When to Activate
- Adding new features or endpoints requiring test coverage
- Refactoring existing code lacking sufficient tests
- Preparing code for production deployment
- Improving test coverage metrics on critical paths
- Writing tests before implementing bug fixes

## When NOT to Use
- For exploratory prototypes or spike code (test after validation)
- When test requirements are unclear (clarify spec first)
- For trivial utilities with single-line implementations
- When existing tests already cover the feature adequately

## Steps Claude Follows

1. **Identify test scope**: Ask for the file, component, or feature to test
2. **Determine test type**: Unit, component, API, E2E, or integration
3. **Select framework**: Detect from project (or suggest Jest, Vitest, pytest, Playwright)
4. **Analyze code**: Extract functions, components, API endpoints, user workflows
5. **Generate test cases**:
   - Happy path (normal execution)
   - Error cases (invalid input, timeouts, failures)
   - Edge cases (boundary values, empty data, nulls)
   - Security cases (auth, permissions, injection)
6. **Build test stubs**: Descriptive names, arrange-act-assert pattern, mocking setup
7. **Add coverage targets**: Aim for 80%+ with critical paths at 95%+
8. **Return ready-to-run tests**: No modifications needed to execute

## Test Patterns by Layer

### Frontend (React/Vue/Angular)
- Component rendering with props
- User interactions (clicks, input, focus)
- State changes and side effects
- API mocking (MSW or jest.mock)
- Accessibility (ARIA, keyboard navigation)
- Error boundaries and fallbacks

### Backend (Node.js/Python/Go)
- Business logic unit tests (pure functions)
- Integration tests with mocked dependencies
- API endpoint tests (status, headers, body)
- Database transaction tests (rollback on failure)
- Authentication and authorization
- Rate limiting, validation, error handling

### Integration & E2E
- Complete user workflows (login → action → logout)
- Cross-service interactions
- Database state verification
- File system and external service mocking
- Concurrent request handling
- Session and state persistence

## Output Format

```
# Test File: {name}.test.ts / test_{module}.py

[Complete runnable test suite with imports, setup, teardown]

## Test Coverage
- Happy path: ✓
- Error cases: ✓
- Edge cases: ✓
- Estimated coverage: [X]%

## To Run
npm test {name}.test.ts
pytest test_{module}.py
```

## Best Practices Enforced
- Single behavior per test case
- Descriptive test names: `should_return_error_when_email_invalid()`
- Mock external services; use fixtures for test data
- Assert outcomes, not implementation details
- Arrange-act-assert structure with setup/teardown
- Table-driven tests for multiple scenarios
- Negative test cases (invalid input, missing data, timeouts)
- No test interdependencies or shared state

## Supported Test Frameworks
| Layer | Framework | Language |
|---|---|---|
| Frontend (Unit) | Jest, Vitest | TypeScript, JavaScript |
| Frontend (Component) | React Testing Library, Vue Test Utils | TypeScript, JavaScript |
| Frontend (E2E) | Playwright, Cypress | TypeScript, JavaScript |
| Backend (Unit) | Jest (Node), pytest (Python) | TypeScript, Python |
| Backend (API) | Supertest, pytest-asyncio | TypeScript, Python |
| Integration | pytest, Jest | TypeScript, Python |

## Example: Node.js Authentication

**Input:**
```
Feature: User authentication login
File: src/auth/login.ts
Framework: Jest
Coverage Target: 85%
```

**Generated Output:**
```typescript
// src/auth/__tests__/login.test.ts
import { login, LoginError } from '../login';
import * as userDb from '../../db/users';
import * as crypto from '../crypto';

jest.mock('../../db/users');
jest.mock('../crypto');

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('successful authentication', () => {
    it('should return user token when credentials are valid', async () => {
      const user = { id: 1, email: 'user@example.com', passwordHash: 'hash' };
      (userDb.findByEmail as jest.Mock).mockResolvedValue(user);
      (crypto.verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await login('user@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result.userId).toBe(1);
      expect(crypto.verifyPassword).toHaveBeenCalledWith('password123', 'hash');
    });
  });

  describe('authentication failures', () => {
    it('should return error when password is incorrect', async () => {
      const user = { id: 1, email: 'user@example.com', passwordHash: 'hash' };
      (userDb.findByEmail as jest.Mock).mockResolvedValue(user);
      (crypto.verifyPassword as jest.Mock).mockResolvedValue(false);

      const result = await login('user@example.com', 'wrongpass');

      expect(result).toEqual({ error: 'Invalid credentials' });
    });

    it('should return error when user not found', async () => {
      (userDb.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await login('nonexistent@example.com', 'password123');

      expect(result).toEqual({ error: 'User not found' });
    });
  });

  describe('edge cases', () => {
    it.each([
      ['', 'password123', 'Email is required'],
      ['user@example.com', '', 'Password is required'],
      ['invalid-email', 'password123', 'Invalid email format'],
    ])('should reject %s / %s with %s', async (email, password, expectedError) => {
      const result = await login(email, password);
      expect(result).toEqual({ error: expectedError });
    });
  });
});
```

## Integration with Other Commands
- `/test-runner` — Execute generated tests and report coverage
- `/code-review` — Verify test quality and completeness
- `/ci-pipeline` — Integrate tests into CI/CD workflow
- `/write-adr` — Document test strategy decisions

## Notes
- Generated tests are production-ready; no stubs or TODO comments
- Mocking and fixtures are fully configured
- Coverage targets align with quality gates (80% minimum, 95% critical paths)
- Tests follow the workspace's established patterns and naming conventions
