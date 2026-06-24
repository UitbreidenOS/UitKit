---
description: Identify and fix sources of flakiness in existing tests
argument-hint: "[test file or directory]"
---
Analyze tests for flakiness in: $ARGUMENTS

Steps:

1. Read the target file or all test files under the target directory.

2. Scan for each of the following flakiness patterns and note every occurrence with file path and line number:

   **Timing issues**
   - Fixed `sleep`/`wait` calls instead of condition-based waits
   - Assertions immediately after async operations without awaiting
   - Hard-coded timeouts that may differ across CI and local environments

   **Order dependence**
   - Tests that mutate shared module-level or global state without cleanup
   - `beforeAll` setup that later tests depend on but don't declare
   - Test files that assume execution order within a suite

   **Non-determinism**
   - Use of `Math.random()`, `Date.now()`, or `new Date()` in assertions without mocking
   - Network calls to real endpoints (no interceptors/mocks)
   - File system reads without fixtures — paths that differ by environment

   **Resource contention**
   - Parallel tests writing to the same database rows or files
   - Port conflicts in server-start tests
   - Missing transaction rollbacks or teardown

   **Selector fragility (UI/E2E)**
   - CSS class selectors that encode visual style, not semantics
   - XPath expressions dependent on DOM depth
   - Text content matches that fail on i18n or copy changes

3. For each finding, provide:
   - Pattern category (from above)
   - Exact location (file:line)
   - Root cause in one sentence
   - A concrete fix — show the before/after code snippet

4. After cataloguing, apply fixes to any issues that are unambiguously safe to change (e.g., swap `sleep(500)` for a proper wait, add missing `afterEach` cleanup).

5. For fixes requiring design decisions (e.g., introducing a test database, adding a mock server), describe the approach but do not implement without confirmation.

6. End with a count: X findings, Y auto-fixed, Z require manual action.
