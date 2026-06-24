---
description: Diagnose and fix a failing test, identifying root cause before patching
argument-hint: "[test-name-or-file]"
---
Fix the failing test: $ARGUMENTS

Do not touch the test or the implementation until you have diagnosed the root cause.

Step 1 — Run the failing test in isolation and capture the full error output including stack trace.

Step 2 — Classify the failure:
- Assertion failure: the code behavior changed or the assertion was wrong from the start
- Setup/teardown problem: shared state leaking between tests, missing mock reset, wrong order
- Environment issue: missing env var, wrong working directory, uninitialized DB/service
- Type or import error: signature changed, module path wrong, dependency missing
- Timing/async issue: unresolved promise, missing await, race condition

Step 3 — Trace the failure to its source. Read the implementation being tested. Read any mocks or fixtures involved. Understand what the test originally intended to verify.

Step 4 — Determine whose fault it is:
- If the implementation has a real bug introduced by a recent change, fix the implementation and keep the test.
- If the test was asserting incorrect behavior all along, fix the test.
- If the test is asserting something that is now intentionally different (spec changed), update the test and note the spec change.

Step 5 — Apply the minimal fix. Do not refactor surrounding code. Do not change unrelated assertions.

Step 6 — Run the full test suite for the affected module to confirm no regressions were introduced.

Report: root cause classification, what you changed, and why.
