---
description: Analyze test coverage gaps and generate tests to close them
argument-hint: "[file-or-directory]"
---
Analyze and improve test coverage for: $ARGUMENTS

Step 1 — Measure current coverage.
Run the project's coverage tool (Jest --coverage, pytest --cov, go test -cover, etc.) scoped to $ARGUMENTS. Parse the output and identify:
- Lines/branches with zero coverage
- Functions that are entirely untested
- Branches (if/else, switch, ternary) where only one path is exercised

Step 2 — Prioritize gaps by risk.
Rank uncovered code by:
1. Business-critical paths (payment, auth, data mutation)
2. Error handling and fallback branches
3. Complex conditional logic (cyclomatic complexity > 3)
4. Public API surface vs. internal helpers

Step 3 — For each high-priority gap, write a targeted test.
- Name the test after the exact scenario it covers ("throws AuthError when token is expired")
- Keep setup minimal — only what is needed to reach the uncovered branch
- Assert the specific behavior, not just that no exception was thrown

Step 4 — Re-run coverage after adding tests and confirm the gap is closed. Report:
- Coverage before: X%
- Coverage after: Y%
- Remaining gaps and why they are acceptable to leave (e.g., dead code, platform-specific branches)

Do not generate tests that pad coverage metrics without asserting real behavior (e.g., calling a function and asserting `toBeTruthy()`). Quality over quantity.
