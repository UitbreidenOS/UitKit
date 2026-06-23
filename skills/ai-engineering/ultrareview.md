---
name: ultrareview
description: Deep code review using Claude Code's thorough analysis mode — security, performance, correctness, and maintainability
allowed-tools: [Read, Grep, Glob]
effort: high
updated: 2026-06-13
---

# Ultrareview Skill

## When to activate

- Reviewing PRs with security-sensitive changes (auth, payments, data access)
- Evaluating performance-critical code paths (hot loops, database queries, network calls)
- Assessing architectural decisions in large PRs (new abstractions, pattern changes)
- Pre-merge review for release branches
- Auditing code before compliance reviews (SOC2, HIPAA, PCI)

## When NOT to use

- Trivial PRs (typo fixes, config changes, documentation only)
- WIP/draft PRs that aren't ready for review
- PRs that only add tests

## Instructions

1. **Understand context.** Read the PR description, linked issues, and related code before diving into the diff.

2. **Review in layers.** Go through the changes 3 times, each with a different lens:

   **Pass 1 — Correctness:**
   - Does the logic handle all edge cases?
   - Are error conditions handled properly?
   - Do types/interfaces match between producer and consumer?
   - Are there race conditions or timing issues?

   **Pass 2 — Security:**
   - Input validation (SQL injection, XSS, path traversal)?
   - Authentication and authorization checks present?
   - Sensitive data exposure (logs, error messages, API responses)?
   - Dependency vulnerabilities introduced?

   **Pass 3 — Maintainability:**
   - Is the code readable without comments explaining the obvious?
   - Are abstractions at the right level (not too much, not too little)?
   - Would a new team member understand this in 5 minutes?
   - Are there hidden assumptions that should be documented?

3. **Categorize findings:**
   - **BLOCKER:** Must fix before merge (security vulnerability, data loss risk, correctness bug)
   - **IMPORTANT:** Should fix before merge (performance issue, poor error handling, missing validation)
   - **SUGGESTION:** Nice to have (better naming, simpler approach, additional test)
   - **NIT:** Optional polish (style preference, minor readability)

4. **Provide actionable feedback.** For each finding:
   - What's wrong and why it matters
   - Specific suggestion for how to fix it
   - Code example if helpful

5. **Acknowledge good patterns.** Call out well-written code, clever solutions, or good test coverage.

## Example

```
PR: "Add user search endpoint"

## Ultrareview Results

### BLOCKER
- **SQL Injection in search query** (api/users/search.js:42)
  The search term is interpolated directly into the SQL string.
  Fix: Use parameterized queries.
  ```js
  // Before (vulnerable)
  db.query(`SELECT * FROM users WHERE name LIKE '%${query}%'`)
  // After (safe)
  db.query('SELECT * FROM users WHERE name LIKE $1', [`%${query}%`])
  ```

### IMPORTANT
- **Missing rate limiting** — Search endpoints are expensive and abuse-prone.
  Add rate limiting: 10 req/min per user.
- **No pagination** — Large result sets will OOM. Add LIMIT/OFFSET with max 100 per page.

### SUGGESTION
- **Extract search logic** — The handler mixes HTTP concerns with business logic.
  Consider a `UserSearchService` class for testability.

### NIT
- Variable `q` on line 15 → rename to `searchQuery` for clarity.

### 👍 Good stuff
- Solid test coverage including empty query, special chars, and unicode.
- Good use of indexes on the search columns.
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
