---
description: Generate thorough unit tests for the specified file or function
argument-hint: "[file-or-function]"
---
You are writing unit tests for: $ARGUMENTS

Follow these steps:

1. Read the target file or locate the named function in the codebase. Understand its public interface, side effects, and dependencies.

2. Identify all test cases needed:
   - Happy path (typical valid inputs)
   - Boundary conditions (empty, zero, max, min, single-element)
   - Error paths (invalid input, missing deps, thrown exceptions)
   - Edge cases specific to the domain logic

3. Detect the existing test framework and conventions in this project (Jest, Pytest, Go testing, Vitest, RSpec, etc.). Match the style exactly — same describe/it nesting depth, same assertion style, same mock/stub patterns already in use.

4. Write tests that:
   - Are isolated: no shared mutable state between tests
   - Have descriptive names that read as specifications ("returns null when user is not found", not "test case 1")
   - Assert one logical concept per test
   - Use arrange-act-assert structure
   - Mock only what crosses a real boundary (network, filesystem, DB, time, randomness)

5. Do NOT mock the unit under test itself. Do NOT write tests that only test the mock.

6. Place the test file adjacent to the source file following project conventions (e.g., `__tests__/`, `.test.ts`, `_test.go`).

7. After writing, run the tests and confirm they pass. If any fail, fix either the test (if the expectation was wrong) or surface the bug in the implementation clearly.

Do not write placeholder tests. Do not leave `TODO` comments. Every test must be complete and meaningful.
