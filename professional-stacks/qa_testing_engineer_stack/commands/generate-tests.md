---
description: Generates executable test code from test cases. Creates Pytest/Jest/Playwright code with setup/teardown, mocking, and assertions. Outputs test files ready for CI/CD integration.
---

# /generate-tests

## What This Does

Runs the automated-test-writer and test-case-generator skills to convert test cases into executable test code. Generates code for unit tests, integration tests, or end-to-end tests. Code is ready for immediate execution in CI/CD pipeline.

## Steps Claude Follows

1. Ask for: feature/module name, test framework (Pytest/Jest/Playwright), test type (unit/integration/E2E)
2. Run test-case-generator skill — create detailed test cases (positive, negative, edge cases)
3. Run automated-test-writer skill — convert cases to executable code
4. Generate setup/teardown code, fixtures, mocks, and assertions
5. Save test code to tests/{module}.test.{py,js,ts} or tests/{module}.spec.{py,js}
6. Display generated test code with summary: test count + coverage estimate + execution time estimate

## Next Action Logic

- **All tests generated successfully:** "Ready for /run-tests"
- **Mocking incomplete:** "Review mock definitions before running"
- **Complex integration tests:** "Verify fixtures and database setup before running"
- **External services:** "Update MCP configs in settings.json for external service mocking"

## Output Format

### Test Generation Summary
```
# Generated Tests: [Module/Feature Name]

**Framework:** [Pytest / Jest / Playwright]
**Total Test Cases:** [N]
**Estimated Execution Time:** [X min Y sec]
**Code Files:** [list of files created]

**Test Breakdown:**
- Positive Tests: [N]
- Negative Tests: [N]
- Edge Cases: [N]
- Integration Tests: [N]

**Mocking Strategy:**
- [External service 1]: Mocked with responses library
- [Database]: In-memory SQLite
- [File system]: Temporary directory fixture

[Sample test code snippets...]
```

### Generated Test Files
```
File: tests/authentication.py

[Full generated test code from automated-test-writer skill]
```

---
