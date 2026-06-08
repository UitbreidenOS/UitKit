---
description: Generate a structured test plan for a feature, module, or PR
argument-hint: "[feature, file, or PR description]"
---
Generate a structured test plan for: $ARGUMENTS

Steps:

1. Parse the argument to determine scope:
   - If a file path: read the file and extract public functions, classes, routes, or components
   - If a feature description: identify the domain and infer affected surfaces
   - If a PR or diff is in context: use changed files as the scope

2. For the identified scope, enumerate test categories in this order:
   a. Unit tests — individual functions, methods, or pure logic
   b. Integration tests — module boundaries, service interactions, DB queries
   c. Component/UI tests — if the scope includes frontend code
   d. E2E tests — if user-facing flows are affected
   e. Contract tests — if the scope includes API endpoints consumed by external clients

3. For each category, list specific test cases. Each test case entry must include:
   - A one-line description in the format: `[subject] [action/state] → [expected outcome]`
   - Priority: P0 (must ship), P1 (should ship), P2 (nice to have)
   - Type: happy path | edge case | error path | regression

4. Identify:
   - Any existing tests that cover overlapping ground (check test directories)
   - Gaps where no tests currently exist
   - External dependencies that require mocking (APIs, databases, time, randomness)

5. Flag cases that are high-effort or low-value — do not silently include them; note the tradeoff.

6. Output the plan as a Markdown table or nested list. Do not write any test code.

7. End with a summary line: total test cases by priority (e.g., "P0: 4, P1: 7, P2: 3").
