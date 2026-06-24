---
description: Bootstrap a TDD cycle — write failing tests first, then implement
argument-hint: "[function, class, or feature to build]"
---
Start a TDD cycle for: $ARGUMENTS

Steps:

1. Clarify the target from the argument:
   - If a function signature or description: derive input/output contracts
   - If a class or module name: infer responsibilities from the name and any existing code context
   - If a feature description: identify the smallest unit of behavior to start with

2. Check for any existing implementation or partial code. If found, read it but do not modify it yet.

3. Write failing tests first — no implementation code yet.

   For each test:
   - Name it in the format: `[unit] [scenario] [expected result]`
   - Cover in this order: happy path → edge cases → error paths
   - Write the minimum number of tests that fully specify the contract (avoid redundancy)
   - Use the project's existing test framework and assertion style

   Minimum test cases to write before stopping:
   - At least 1 happy-path test
   - At least 1 boundary or edge-case test
   - At least 1 error/invalid-input test (if the target can fail)

4. Run the tests. Confirm they fail for the right reason (not a syntax error or import failure — a genuine assertion failure against missing logic).

5. Write the minimal implementation that makes the tests pass:
   - No logic beyond what the tests require
   - No speculative handling of cases not yet tested
   - Follow the project's existing code style

6. Run the tests again. If all pass, report success.

7. If any test still fails after implementation, show the failure output and diagnose the gap before attempting a fix.

8. End with:
   - Files created or modified
   - Test count and pass/fail status
   - Next suggested test to write (one step further in the TDD cycle)
