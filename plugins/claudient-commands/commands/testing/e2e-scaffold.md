---
description: Scaffold end-to-end tests for a page, route, or user flow
argument-hint: "[page or flow description]"
---
You are scaffolding end-to-end tests for: $ARGUMENTS

Follow these steps:

1. Detect the E2E framework in use by checking for config files and dependencies:
   - Playwright: `playwright.config.ts`, `@playwright/test`
   - Cypress: `cypress.config.ts`, `cypress/`
   - Puppeteer: `puppeteer` in package.json
   - If none found, default to Playwright and note this assumption.

2. Identify the target — a page, route, or named user flow — from the argument. If ambiguous, infer from directory structure and existing test files.

3. Read existing E2E tests in the project to match:
   - File location conventions (e.g., `e2e/`, `tests/`, `cypress/e2e/`)
   - Helper/fixture patterns already in use
   - Base URL config and auth setup if present

4. Scaffold a test file containing:
   - At least one `describe` block named after the target
   - A happy-path test covering the primary action (load, submit, navigate)
   - An error/edge-case test (invalid input, 404, empty state)
   - A test for any critical interactive element visible in the target
   - Appropriate `beforeEach` setup (navigate to page, mock auth if needed)

5. Use the framework's idiomatic selectors:
   - Playwright/Cypress: prefer `getByRole`, `getByLabel`, `getByTestId` over CSS selectors
   - Puppeteer: use `waitForSelector` with semantic attributes

6. Do not mock network requests unless the argument explicitly includes "mock" or the project already uses interceptors pervasively.

7. Add a `// TODO:` comment for any assertion that requires a value only known at runtime (e.g., dynamic IDs, timestamps).

8. Place the file in the correct directory. Do not create new directories unless no E2E directory exists.

9. Output:
   - The file path created
   - A brief list of what each test covers
   - Any assumptions made (framework choice, base URL, auth)
