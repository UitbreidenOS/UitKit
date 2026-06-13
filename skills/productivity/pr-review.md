---
name: pr-review
description: "Structured pull request review: blast radius analysis, security scan, breaking change detection, test coverage delta, and prioritised findings — for GitHub PRs and GitLab MRs"
updated: 2026-06-13
---

# PR Review Skill

## When to activate
- Reviewing a pull request that touches shared APIs, database schema, or auth
- Large PR (> 200 lines) that needs structured review, not just a read-through
- Security-sensitive changes (auth, payments, PII handling, permissions)
- Reviewing code from a new contributor or unfamiliar codebase area
- Post-incident review of similar PRs to prevent recurrence

## When NOT to use
- Trivial changes (typos, dependency version bumps) — just approve
- Style and formatting — use linters, not human review time
- Architecture decisions — use an ADR, not a PR
- First-pass review during active development — save deep review for near-merge PRs

## Instructions

### Fetch and analyse the PR

```
Fetch and analyse PR [#NUMBER] from [repo].

Repo: [owner/repo]
PR number: [X]
Review focus: [security / performance / correctness / all]

Step 1 — Fetch the PR:
# GitHub CLI
gh pr diff [NUMBER] > /tmp/pr.diff
gh pr view [NUMBER] --json title,body,labels,assignees
gh pr checks [NUMBER]           # CI status
gh pr diff [NUMBER] --name-only # Files changed

# GitLab CLI
glab mr diff [NUMBER] > /tmp/mr.diff

Step 2 — Blast radius analysis:
Which files are changed?
- Shared utilities or libraries → HIGH blast radius (everything that imports this breaks)
- API route handlers → check: does the response schema change? Are callers updated?
- Database migrations → HIGH risk — irreversible after deploy
- Auth/middleware → CRITICAL — affects every authenticated request
- Config files → check for environment-specific assumptions
- Test files only → LOW risk (unless tests are being removed)

Step 3 — Review the diff:

Read the PR description first: does the code do what it claims?
Read the tests first (if any): do they test what matters?
Read the implementation: does it match the test expectations?

Key questions for every file changed:
□ What does this change break if wrong?
□ Is there a test that would catch that failure?
□ Is there an error handling path for every external call?
□ Are there any hardcoded values that should be config?
```

### Security review checklist

```
Review PR [#NUMBER] for security issues.

Focus areas: [auth / injection / exposure / dependencies / permissions]

INJECTION:
□ SQL: are all queries parameterised? No string interpolation into SQL.
  🔴 FAIL: `db.query(`SELECT * FROM users WHERE id = ${userId}`)`
  ✅ PASS: `db.query('SELECT * FROM users WHERE id = $1', [userId])`
□ NoSQL: MongoDB queries using user input in operators? ($where, $lookup)
□ Command injection: shell commands built from user input?
□ Path traversal: file paths constructed from user input without sanitisation?
□ XSS: user data rendered in HTML without escaping?

AUTHENTICATION AND AUTHORISATION:
□ Is auth checked on every new endpoint?
□ Is resource-level ownership validated? (not just "is the user logged in" but "does the user own this resource")
□ Are privileged operations (admin actions) separately protected?
□ JWT: is the signature verified? Is expiry checked? Is the algorithm pinned (not "none")?
□ Are session tokens rotated after privilege escalation (login, sudo, role switch)?

DATA EXPOSURE:
□ Is any PII logged? (emails, phone numbers, partial card numbers in log output)
□ Are secrets in the code? (API keys, passwords, tokens hardcoded)
□ Is the error message leaking internal details? (stack traces, DB structure, internal paths)
□ Are internal fields filtered from API responses? (internal IDs, admin flags, soft-deleted records)

INPUT VALIDATION:
□ Is all user input validated before use? (type, format, length, range)
□ Are files validated? (type, size, content — not just extension)
□ Is rate limiting applied to expensive or sensitive endpoints?

DEPENDENCIES:
□ Are new dependencies added? Run: npm audit / pip-audit
□ Is the dependency from a reputable source? (check npm package age and download count)
□ Is the version pinned or using a floating range?

Output: list of findings with severity (Critical / High / Medium / Low) and specific line references.
```

### Breaking change detection

```
Detect breaking changes in PR [#NUMBER].

Breaking change types to check:

API CONTRACT:
□ Removed endpoint → breaking for all callers
□ Removed required field from request body → callers still sending it (OK)
□ Added required field to request body → callers not sending it (BREAKING)
□ Changed field name → callers using old name break
□ Changed field type → callers may break (string → number usually safe; number → string may not be)
□ Changed HTTP method → callers using old method break
□ Changed response status code → callers checking specific codes may break

DATABASE:
□ Removed column → any code selecting that column will fail
□ Renamed column → same as above
□ Changed column type → data loss possible (TEXT → VARCHAR(50) truncates long values)
□ Added NOT NULL constraint without default/backfill → migration will fail if NULL rows exist
□ Removed index → queries relying on it will slow dramatically

ENVIRONMENT / CONFIG:
□ New required environment variable → deployment will fail if not set
□ Removed environment variable → deployments using it will break
□ Changed config key name → existing deployments using old key break

LIBRARY / EXPORT:
□ Removed exported function or class → importers break
□ Changed function signature (new required parameter) → callers break
□ Changed return type → callers relying on old type break

For each breaking change found:
→ Is this intentional? Is there a migration path in the PR description?
→ Are all callers updated in this PR, or is there a separate migration plan?
→ Is this behind a feature flag or versioned (v2 endpoint)?
```

### Test coverage review

```
Review test coverage for PR [#NUMBER].

Coverage tool: [Jest / Vitest / pytest / Go test]
Minimum coverage threshold: [X%]
Focus: [new code coverage / regression tests / edge cases]

Coverage analysis:

Lines added vs lines tested:
- New code with 0 tests → flag
- Bug fixes without regression test → flag ("add a test that would have caught this bug")
- Edge cases tested? (empty input, null, max values, concurrent calls)

Test quality signals:
□ Tests test behaviour, not implementation (test what it does, not how)
□ Tests use realistic data (not just happy path with trivially simple values)
□ Error paths tested (what happens when external service fails? when DB is down?)
□ Async behaviour tested correctly (await used, no floating promises)
□ Mocks are realistic (not mocking away the logic being tested)

Anti-patterns to flag:
🔴 Test with no assertion (test that never fails)
🔴 Test that only tests mocks (not the real code)
🔴 Snapshot tests for dynamic content (will always pass after first update)
🟡 Magic numbers in assertions (where did 42 come from? use a named constant)
🟡 Tests that depend on test order (shared state between tests)

Request: add a test for [specific scenario] that this PR doesn't cover.
```

### PR review report

```
Generate a structured PR review report.

PR: #[NUMBER] — [title]
Author: [name]
Files changed: [X files, +Y lines, -Z lines]
Review completed: [date]

SUMMARY: [1-2 sentences — what this PR does and overall quality assessment]

VERDICT: ✅ Approve / 🔄 Approve with suggestions / 🔴 Changes required

REQUIRED CHANGES (block merge until resolved):
1. [Finding name] — [file:line]
   Issue: [describe the problem]
   Fix: [specific suggestion]
   Severity: Critical / High

SUGGESTIONS (non-blocking, recommended):
1. [Finding name] — [file:line]
   Suggestion: [describe]

QUESTIONS (clarification needed):
1. [Question] — [context]

POSITIVE NOTES:
- [What was done well — acknowledge good work]

TESTING:
□ Tests cover the happy path
□ Tests cover the main error path
□ Missing test for: [specific scenario]

BLAST RADIUS: Low / Medium / High
Reasoning: [which systems are affected if this is wrong]

Generate the report for the PR I provide.
```

## Example

**User:** Our intern opened a PR that adds a search endpoint. It queries the users table with ILIKE. 500K users in production. Review it.

**Claude's structured review:**

**VERDICT: 🔴 Changes required — 2 blocking issues**

**REQUIRED CHANGES:**

1. **SQL injection risk** — `src/routes/users.ts:34`
   ```typescript
   // CURRENT (vulnerable):
   const users = await db.query(`SELECT * FROM users WHERE name ILIKE '%${q}%'`);
   
   // FIX: parameterised query
   const users = await db.query('SELECT * FROM users WHERE name ILIKE $1', [`%${q}%`]);
   ```
   User-controlled input interpolated directly into SQL — even ILIKE. Severity: **Critical**.

2. **Full table scan on 500K rows** — `src/routes/users.ts:34`
   `ILIKE '%term%'` with leading `%` cannot use a B-tree index. At 500K rows this query will run for 2-5 seconds per request and will spike DB CPU under any concurrent load.
   
   **Fix:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   CREATE INDEX CONCURRENTLY idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
   ```
   After this index, the query runs in ~15ms instead of 2-5 seconds. Severity: **High** (production performance risk).

**SUGGESTIONS:**
3. **Return only needed fields** — line 35
   `SELECT * FROM users` returns password_hash, internal flags, admin status. Filter to `SELECT id, name, email`.

4. **Missing pagination** — search can return all 500K users
   Add `LIMIT 20 OFFSET $2` and return a cursor.

5. **No auth check** — is this endpoint public? If not, add authentication middleware.

**POSITIVE:**
Good instinct to use a dedicated search endpoint instead of extending the existing `/users` list endpoint. The structure is correct — just needs the two blocking fixes.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
