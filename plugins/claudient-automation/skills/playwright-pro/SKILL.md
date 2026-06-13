---
name: "playwright-pro"
description: "Playwright E2E testing: page object model, fixture setup, network interception, visual regression, CI integration, and debugging flaky tests — production-grade browser automation"
---

# Playwright Pro Skill

## When to activate
- Writing E2E tests for web applications with Playwright
- Setting up the Page Object Model (POM) pattern for maintainable tests
- Debugging flaky or intermittently failing tests
- Setting up network interception to mock API responses in tests
- Adding visual regression testing to your test suite
- Integrating Playwright into CI/CD pipelines

## When NOT to use
- Unit tests or component tests — use Vitest or Jest
- API-only testing without UI — use supertest or httpx
- Load testing — Playwright is for correctness, not performance
- Simple smoke tests that change often — too much maintenance cost for shallow tests

## Instructions

### Project setup and configuration

```
Set up Playwright for [project].

Framework: [Next.js / React / Vue / Svelte / plain HTML]
Test scope: [critical user journeys / full regression / smoke tests]
Browsers: [Chromium / Firefox / WebKit / all three]
CI: [GitHub Actions / GitLab CI / CircleCI]

Setup:
npm init playwright@latest
# Choose: TypeScript, tests/ directory, GitHub Actions workflow

playwright.config.ts:
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,        // Retry in CI only
  workers: process.env.CI ? 1 : undefined, // Serial in CI, parallel locally
  
  reporter: [
    ['html'],                               // Local HTML report
    ['github'],                             // GitHub Actions annotations
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',               // Trace on failure for debugging
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile',   use: { ...devices['Pixel 5'] } },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

Generate the full config for my project type.
```

### Page Object Model

```
Write Page Object Model classes for [feature/page].

Page to model: [login page / dashboard / checkout / form / etc.]
Key elements: [list inputs, buttons, labels, links on the page]

Page Object pattern:
// tests/pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput    = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton  = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage  = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

// Usage in test:
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('invalid credentials shows error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('bad@email.com', 'wrongpassword');
  await loginPage.expectError('Invalid email or password');
});

Selector priority order (most to least resilient):
1. getByRole() — semantic, accessibility-first
2. getByLabel() — for form inputs
3. getByText() — for visible text
4. getByTestId() — for elements with data-testid=""
5. locator('css') — last resort, brittle

Write Page Object classes for my [page/feature].
```

### Fixtures and test data

```
Set up Playwright fixtures for [test suite].

Shared state needed: [authenticated user / database state / API mocks]
Test isolation requirement: [each test independent / share session / shared DB]

Custom fixture for authenticated user:
// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type TestFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Authenticate once, reuse the session
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!
    );
    await page.waitForURL('/dashboard');
    await use(page);
  },
});

export { expect } from '@playwright/test';

// Use in tests:
import { test, expect } from './fixtures';

test('dashboard loads correctly', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

Session storage for faster auth (when API supports it):
// storageState.ts — run once to save session
await page.context().storageState({ path: 'tests/.auth/user.json' });

// playwright.config.ts — reuse saved session
use: { storageState: 'tests/.auth/user.json' }

Generate fixtures for my specific authentication and data setup.
```

### Network interception and mocking

```
Set up API mocking for [tests].

API endpoints to mock: [list — e.g. /api/users, /api/payments]
Mock scenarios: [happy path / error states / slow responses / empty states]

Route interception:
// Mock a successful API response
await page.route('/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob',   email: 'bob@example.com' },
    ]),
  });
});

// Mock an error state
await page.route('/api/payments', async (route) => {
  await route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Payment service unavailable' }),
  });
});

// Mock slow response (test loading states)
await page.route('/api/data', async (route) => {
  await new Promise(r => setTimeout(r, 3000));  // 3-second delay
  await route.continue();
});

// Abort a request (test offline behaviour)
await page.route('**/*.png', (route) => route.abort());

// Intercept and modify (proxy with changes)
await page.route('/api/config', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  json.featureFlag = true;  // Enable feature flag for test
  await route.fulfill({ json });
});

Write the mock setup for my specific API endpoints and test scenarios.
```

### Debugging flaky tests

```
Debug and fix flaky tests in [test suite].

Failing test: [describe — what it tests, what it does intermittently]
Failure pattern: [always fails / 1-in-5 / only in CI / only on slow machine]
Error message: [paste the error]

Flaky test diagnosis checklist:

1. TIMING ISSUES (most common):
   Bad: await page.click('#submit');  // Clicks before element is ready
   Fix: await page.getByRole('button').click();  // Playwright waits automatically
   
   Bad: await page.waitForTimeout(2000);  // Arbitrary sleep — always wrong
   Fix: await expect(page.getByRole('status')).toBeVisible();  // Wait for state

2. SELECTOR ISSUES:
   Bad: page.locator('.btn-primary:nth-child(2)')  // Position-based, fragile
   Fix: page.getByRole('button', { name: 'Submit order' })  // Semantic
   
   Bad: page.locator('[class*="button"]')  // Class-based, changes with refactor
   Fix: page.getByTestId('submit-order')  // Stable test ID

3. ORDERING / ISOLATION:
   Problem: tests share state — one test's actions affect another
   Fix: Each test must set up its own state. Use beforeEach to reset.
   
4. CI-SPECIFIC FAILURES:
   Cause: CI is slower — elements render later than locally
   Fix: Increase timeout for CI: { timeout: 60000 } in CI config
   Cause: Different screen size in CI
   Fix: Set explicit viewport in config: use: { viewport: { width: 1280, height: 720 } }

5. NETWORK RACE CONDITIONS:
   Problem: test asserts before API response returns
   Fix: await page.waitForResponse('/api/data');  // Wait for specific response
   Or: mock the API response entirely (removes timing dependency)

Debug tools:
PWDEBUG=1 npx playwright test  # Launches inspector — step through test
npx playwright test --trace on  # Record trace for offline analysis
npx playwright show-report      # View HTML report with screenshots

Diagnose and fix my specific flaky test.
```

### CI integration

```
Set up Playwright in [CI system].

CI: [GitHub Actions / GitLab CI / CircleCI]
Test command: [npm run test:e2e]
Browsers: [Chromium only / all three]
Parallelism: [shard across X machines]

GitHub Actions workflow:
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]  # Run in 4 parallel shards
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium  # Chromium only saves ~2min
      
      - name: Run tests (shard ${{ matrix.shard }}/4)
        run: npx playwright test --shard=${{ matrix.shard }}/4
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
          retention-days: 30

Generate the CI config for my system with appropriate caching and parallelism.
```

## Example

**User:** My Playwright test for checkout flow fails 1 in 5 times in CI. It clicks "Place Order" but sometimes the button isn't there yet. How do I fix it?

**Claude's diagnosis and fix:**

Classic timing issue — the checkout page is rendering asynchronously and the button appears after some data loads (shipping rates, payment validation, etc.).

**Current broken pattern:**
```typescript
await page.click('#place-order');  // Fails if button hasn't rendered yet
```

**Fix — use semantic selector + let Playwright auto-wait:**
```typescript
// Playwright's getByRole automatically waits up to 30s for the element
await page.getByRole('button', { name: 'Place Order' }).click();
```

**If the button exists but is disabled while loading:**
```typescript
// Wait for it to be enabled, then click
await page.getByRole('button', { name: 'Place Order' }).waitFor({ state: 'visible' });
await expect(page.getByRole('button', { name: 'Place Order' })).toBeEnabled();
await page.getByRole('button', { name: 'Place Order' }).click();
```

**If the real issue is an API call that must complete first:**
```typescript
// Wait for the shipping rates API before clicking
await page.waitForResponse(resp =>
  resp.url().includes('/api/shipping-rates') && resp.status() === 200
);
await page.getByRole('button', { name: 'Place Order' }).click();
```

**Best fix — mock the API to remove timing entirely:**
```typescript
await page.route('/api/shipping-rates', route => route.fulfill({
  status: 200,
  body: JSON.stringify([{ id: 'standard', price: 5.99, label: 'Standard Shipping' }])
}));
// Now the button appears immediately and the test is deterministic
```

Mock the API for your checkout tests — removes the timing dependency completely and makes tests 3x faster.

---
