---
description: Strengthen weak or shallow assertions in existing tests
argument-hint: "[test file or directory]"
---
Review and improve assertions in: $ARGUMENTS

Steps:

1. Read the target file or all test files under the target directory.

2. Identify weak assertion patterns — note each with file path and line number:

   **Too-broad matchers**
   - `toBeTruthy` / `toBeFalsy` when a specific value is checkable
   - `toBeDefined` when the shape or type can be asserted
   - `toContain` on full objects when an exact match is appropriate

   **Incomplete coverage**
   - Tests that assert the return value but not the side effect (or vice versa)
   - Error paths that only check `throw` without verifying the error message or type
   - Async functions whose rejection case is not tested

   **Snapshot overuse**
   - Snapshots covering entire large component trees where targeted property assertions would be more stable and readable
   - Snapshots that encode irrelevant implementation detail (e.g., internal CSS class names)

   **Missing boundary checks**
   - Functions accepting arrays/strings but no test for empty input
   - Numeric functions with no test at zero, negative, or maximum boundary
   - Nullable parameters with no null/undefined test

   **Assertion count**
   - Tests with zero assertions (false pass)
   - Tests with a single `expect` that cannot distinguish between two similar failure modes

3. For each finding, show:
   - The current assertion
   - Why it is weak
   - A replacement that is more specific, meaningful, or complete

4. Apply all changes that are unambiguously improvements — do not change passing tests to failing ones.

5. Do not add new test cases; only improve assertions within existing tests.

6. Summarize: X assertions reviewed, Y replaced, Z flagged but not changed (with reason).
