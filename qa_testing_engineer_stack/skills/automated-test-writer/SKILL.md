---
name: automated-test-writer
description: Generates executable test code in Pytest, Jest, Playwright, or Cypress from test cases. Includes setup/teardown, mocking, assertions, and error handling. Code is ready for CI/CD integration.
allowed-tools: Read, Write
effort: high
---

# Automated Test Writer

## When to activate

After test cases are finalized and accepted. Convert test cases into executable test code for unit, integration, and end-to-end testing. Essential for regression suites and continuous integration.

## When NOT to use

Not for one-off exploratory tests. Not without test cases as input. Not for manual testing workflows. Not without understanding of the target test framework (Pytest, Jest, Playwright, Cypress).

## Supported Test Frameworks

- **Pytest** (Python unit/integration tests)
- **Jest** (JavaScript/Node.js unit tests)
- **Playwright** (Browser automation, end-to-end tests)
- **Cypress** (Browser automation, end-to-end tests)

## Test Code Structure

Every test function must include:

1. **Test Setup (Arrange):** Preconditions, test data, mocking
2. **Test Execution (Act):** User actions, API calls, state changes
3. **Assertions (Assert):** Verify expected results
4. **Cleanup (Teardown):** Reset state, cleanup test data

## Test Code Template

### Pytest (Python)

```python
import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timedelta

class TestAuthenticationModule:
    """Test suite for OAuth 2.0 authentication."""

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        """Setup and cleanup for each test."""
        # Setup
        self.test_user_email = "test@example.com"
        self.test_password = "SecurePassword123!"
        self.valid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        
        yield
        
        # Teardown
        # Clean up test data from database
        pass

    def test_user_login_with_valid_credentials(self):
        """TC-AUTH-001: User logs in successfully with valid email and password."""
        # Arrange
        user_data = {
            "email": self.test_user_email,
            "password": self.test_password
        }
        
        # Act
        response = self.client.post("/auth/login", json=user_data)
        
        # Assert
        assert response.status_code == 200
        assert "token" in response.json()
        assert response.json()["token_type"] == "Bearer"

    @pytest.mark.negative
    def test_login_fails_with_invalid_email(self):
        """TC-AUTH-002: Login fails with invalid email format."""
        # Arrange
        invalid_user_data = {
            "email": "not-an-email",
            "password": self.test_password
        }
        
        # Act
        response = self.client.post("/auth/login", json=invalid_user_data)
        
        # Assert
        assert response.status_code == 400
        assert "Invalid email format" in response.json()["error"]
        assert "token" not in response.json()

    @pytest.mark.edge_case
    def test_request_with_expired_token(self):
        """TC-AUTH-003: User cannot make API request with expired JWT token."""
        # Arrange
        expired_token = self._generate_jwt_token(expires_in=timedelta(seconds=-1))
        headers = {"Authorization": f"Bearer {expired_token}"}
        
        # Act
        response = self.client.get("/api/profile", headers=headers)
        
        # Assert
        assert response.status_code == 401
        assert "Token expired" in response.json()["error"]

    def _generate_jwt_token(self, expires_in=None):
        """Helper: Generate a test JWT token."""
        if expires_in is None:
            expires_in = timedelta(hours=1)
        
        payload = {
            "sub": self.test_user_email,
            "exp": datetime.utcnow() + expires_in,
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")
```

### Jest (JavaScript)

```javascript
describe('Authentication Module', () => {
  let client;
  const testUserEmail = 'test@example.com';
  const testPassword = 'SecurePassword123!';
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  beforeEach(() => {
    // Setup: Initialize test client and mock external services
    client = createTestClient(app);
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup: Reset database state, clear mocks
    jest.restoreAllMocks();
  });

  test('TC-AUTH-001: User logs in successfully with valid email and password', async () => {
    // Arrange
    const userData = {
      email: testUserEmail,
      password: testPassword
    };

    // Act
    const response = await client.post('/auth/login').send(userData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token_type).toBe('Bearer');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  test('TC-AUTH-002: Login fails with invalid email format', async () => {
    // Arrange
    const invalidUserData = {
      email: 'not-an-email',
      password: testPassword
    };

    // Act
    const response = await client.post('/auth/login').send(invalidUserData);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid email format');
    expect(response.body).not.toHaveProperty('token');
  });

  test('TC-AUTH-003: User cannot make API request with expired JWT token', async () => {
    // Arrange
    const expiredToken = generateTestJWT({ expiresIn: -1 });
    
    // Act
    const response = await client
      .get('/api/profile')
      .set('Authorization', `Bearer ${expiredToken}`);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body.error).toContain('Token expired');
  });
});
```

### Playwright (Browser Automation)

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Authentication UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
  });

  test('TC-AUTH-001: User logs in successfully', async ({ page }) => {
    // Arrange & Act
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Sign In")');
    
    // Assert
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.locator('text=Welcome, test@example.com')).toBeVisible();
  });

  test('TC-AUTH-002: Login fails with invalid email', async ({ page }) => {
    // Arrange & Act
    await page.fill('input[name="email"]', 'not-an-email');
    await page.fill('input[name="password"]', 'any_password');
    await page.click('button:has-text("Sign In")');
    
    // Assert
    await expect(page.locator('text=Invalid email format')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('TC-AUTH-003: Expired token error message displayed', async ({ page, context }) => {
    // Arrange: Set expired token in storage
    await context.addCookies([{
      name: 'auth_token',
      value: 'expired_token_value',
      url: 'http://localhost:3000',
      expires: Math.floor(Date.now() / 1000) - 3600
    }]);
    
    // Act
    await page.goto('http://localhost:3000/api/profile');
    
    // Assert
    await expect(page.locator('text=Token expired')).toBeVisible();
  });
});
```

## Test Code Best Practices

1. **Test Independence:** Each test must be independent. No shared state between tests.
2. **Clear Naming:** Test names should describe the scenario (what, given, when, then).
3. **Single Assertion Per Test (ideally):** Multiple assertions are OK if they test one behavior.
4. **Mocking:** Mock external services (API calls, database, third-party services).
5. **Fixtures/Factories:** Use reusable setup code for test data and preconditions.
6. **Explicit Assertions:** Use specific assertions (not vague checks).
7. **Error Messages:** Assertions should include helpful error messages if they fail.
8. **Performance:** Tests should complete quickly (<5 seconds each, ideally <1 second).

## Test Execution Output Format

All generated test code includes:

1. **Test file naming:** `test_<module>.py`, `<module>.test.js`, `<module>.spec.ts`
2. **Test class/describe:** Group related tests
3. **Docstrings:** Include test case ID and description
4. **Comments:** Explain complex setup or assertions
5. **Logging:** Print meaningful debug info on failures

## Example Test Suite Output

File: `test_authentication.py`

```python
# Automatically generated from test cases
# Module: Authentication
# Generated: 2026-06-13 14:32 UTC
# Test Framework: Pytest
# Coverage: 8 test cases covering positive, negative, edge cases

import pytest
from app.auth import authenticate, refresh_token
from app.models import User

class TestAuthenticationModule:
    """Test suite for OAuth 2.0 authentication."""
    
    # [8 test methods as shown above]
    
    @staticmethod
    def generate_fixture_user(email="test@example.com"):
        """Factory: Create a test user in database."""
        return User.create(
            email=email,
            password_hash=hash_password("SecurePassword123!")
        )
```

---
