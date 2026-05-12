# Testing Rules

Copy the relevant sections into your project's `CLAUDE.md`.

---

## What to test

- Test behavior through public APIs — not internal implementation details
- Tests must survive refactoring: if renaming a private function breaks tests, the tests are wrong
- Test edge cases: null/empty inputs, boundary values, error paths
- Do not test framework code or language builtins

## Test structure

- One logical assertion per test — if a test checks multiple unrelated things, split it
- Test names describe WHAT the system does, not HOW: `"returns 404 when user not found"` not `"test findUser"`
- Arrange → Act → Assert — one block each, no interleaving
- No conditional logic in tests — if you need an `if`, write two tests

## Mocking

- Do not mock internal modules — mock only at system boundaries (external APIs, databases, file system)
- Never mock the class/module under test
- Integration tests must hit the real database — use a test database, not mocks
- If a unit test requires 5+ mocks, the code is probably not well-structured

## Coverage

- Coverage is a floor, not a target — 80% coverage with bad tests is worse than 60% with good tests
- Every new feature needs at least one happy-path test and one error-path test
- Every bug fix needs a regression test that would have caught the bug

## Test data

- Use factories or fixtures — never hardcode user IDs, emails, or UUIDs in tests
- Tests must be isolated — no shared mutable state between tests
- Tests must be deterministic — no random data, no time-dependent assertions without mocking the clock
- Clean up after each test — truncate tables, reset mocks, delete created files

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. [uitbreiden.com](https://uitbreiden.com/)
