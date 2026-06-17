# PR Reviewer

## When to activate

- Before merging any PR — conduct a comprehensive review covering correctness, tests, security, performance, and architectural alignment
- A PR requires architectural or security sign-off before merge
- You need to identify logic bugs, edge cases, or design issues that tests may not catch
- Reviewing cross-cutting changes (shared utilities, base classes, middleware) that affect multiple systems
- PR introduces new patterns or significantly refactors existing code
- An author requests a detailed code review with specific focus areas

## When NOT to use

- For draft or WIP PRs — wait until the author marks it ready for review
- For automated dependency updates (Dependabot) — those follow a different review path and are typically auto-approved with security scans
- For linting or style enforcement violations — these should be caught by pre-commit hooks and CI, not manual review
- When the PR is too large to review meaningfully in one pass (>500 lines without clear separation) — ask author for breakdown
- For subjective code style preferences that don't affect correctness — defer to team conventions and linters
- When you lack domain knowledge of the system being modified — ask the author for context or escalate rather than guessing
- For reviewing generated code or large auto-migrations without human intent signaling

## Instructions

### 1. Establish Context & Scope

- **Read the PR metadata**: title, description, linked issues/tickets, and author notes
- **Understand the intent**: What problem does this solve? What feature does it add? What refactoring does it accomplish?
- **Assess scope**: Which files changed? How many lines? Are changes concentrated or scattered?
- **Categorize the change type**:
  - New feature (requires 80%+ test coverage)
  - Bug fix (requires regression test)
  - Refactoring (requires 100% before/after parity, no new coverage needed)
  - Performance optimization (requires benchmarks)
  - Documentation or chores (minimal testing required)
  - Architectural change (requires ADR before review)
- **Flag red flags early**: Large PRs, unrelated changes bundled, commits with unclear messages, or lack of description

### 2. Review Commit History

- **Atomic commits**: Each commit should represent one logical change. If a single feature spans multiple commits, they should build cleanly without breaking intermediate states
- **Commit messages**: Should explain _why_, not just _what_. Example: "Fix N+1 query in user profile endpoint by adding join" is better than "Fix profile query"
- **Commit order**: Changes should flow logically (dependencies first, then implementation, then tests)
- **Red flags**: 
  - Commits that undo previous commits in the same PR (indicates indecision or incomplete testing)
  - Merge commits between PR creation and final review (rebase instead)
  - Very long commit messages with multiple issues (should be split)

### 3. Examine Changed Code — Logic & Correctness

- **Trace the happy path**: Does the code do what it claims? Run through the logic step-by-step
- **Test edge cases**:
  - Boundary conditions (empty collections, null values, zero/negative numbers)
  - Off-by-one errors in loops or array access
  - State mutations in wrong order
  - Resource cleanup (file handles, database connections, event listeners)
- **Error handling**:
  - Are all error paths captured? (no silent failures)
  - Do error messages provide enough context for debugging?
  - Is error recovery graceful (fallback, retry, rollback)?
  - Are exceptions caught at the right level (not too broad)?
- **Concurrency & async**:
  - Race conditions in parallel operations?
  - Promise/callback chains properly ordered?
  - Are timeouts or deadlocks possible?
  - Is shared state protected (locks, immutability)?
- **Input validation**:
  - Are all external inputs (API params, file content, user input) validated?
  - Are assumptions about data shape documented and enforced?
  - Do type systems (TypeScript, Python type hints) catch invalid inputs?

### 4. Examine Changed Code — Design & Architecture

- **Responsibility separation**: Does each function/class do one thing? Or is there hidden coupling?
- **Architecture alignment**: Does this change follow the existing patterns, or introduce new patterns without justification?
- **ADR compliance**: If this is an architectural decision, is there an ADR in `docs/adr/` (or PR description)?
- **Testability**: Is the code testable in isolation, or does it depend on external state/infrastructure in ways that make mocking hard?
- **Abstraction levels**: 
  - Is the abstraction right? (Too high = loses detail; too low = duplicates logic)
  - Are implementation details hidden behind clean interfaces?
- **Code reuse**:
  - Is there duplication with existing code? Suggest consolidation
  - Are utilities placed in appropriate, discoverable locations?
- **Complexity**:
  - Is there nested logic (deep callbacks, multiple conditionals) that could be flattened?
  - Are helper functions extracted for clarity?
  - Could this be solved more simply?

### 5. Security Review

**Input & Data Handling:**
- User input sanitized before use (no injection attacks)?
- SQL: parameterized queries or ORM (not string concatenation)?
- API: input validation on all endpoints?
- File uploads: size limits, type validation, sandboxing?

**Authentication & Authorization:**
- Are permission checks in place before sensitive operations?
- Does the code check `user.role` or similar correctly?
- Are session/token expiries handled?
- Is there token/credential leakage in logs or error messages?

**Secrets & Credentials:**
- Hardcoded secrets (API keys, passwords, database URLs)?
- Credentials logged or exposed in error messages?
- `.env` files committed (check git history)?
- Environment variables properly injected at runtime?

**Dependencies & Supply Chain:**
- New dependencies added? Check:
  - CVE databases (npm audit, Snyk, pip audit)
  - License compatibility (GPL conflicts with proprietary code?)
  - Maintenance status (is the maintainer active?)
  - Size & footprint (is this dependency pulling in unnecessary sub-dependencies?)
- Breaking changes in updated dependencies handled?

**Web-Specific (if applicable):**
- CORS headers correctly restricted (not `*` in production)?
- CSRF tokens on state-changing operations?
- XSS protection (escaping user content, CSP headers)?
- HTTPS only (no hardcoded `http://` URLs)?
- Sensitive data in local storage or cookies marked `HttpOnly`, `Secure`, `SameSite`?

### 6. Testing & Coverage

**Coverage Thresholds:**
- New code: minimum 80% line coverage (unit + integration)
- Critical paths (auth, payments, data mutations): 95%+
- Refactoring: 100% before/after parity (no new coverage debt)
- Bug fixes: at least one test case that fails without the fix

**Test Quality:**
- Tests actually exercise the new code, not just pass trivially (check for `assert` statements)
- Are happy path, error path, and edge cases tested?
- Are mocks used appropriately (mocking external services, not internal logic)?
- Are fixtures realistic or do they hide issues?
- Is the test code maintainable and readable?
- Are integration tests used for API endpoints, database operations?

**CI/CD:**
- Do tests pass on CI (not just locally)?
- Are there any flaky tests (intermittent failures)?
- Is coverage report generated and uploaded?

### 7. Performance

**Analysis Triggers:**
- Changes to hot paths (request handlers, loops, sorting algorithms)
- New database queries or bulk operations
- Memory-intensive operations (JSON parsing, large data structures)
- Client-side rendering logic (if React, Vue, etc.)

**Review Steps:**
- Are there obvious inefficiencies (N+1 queries, nested loops, unnecessary copies)?
- Are algorithms efficient (O(n²) sorting on large collections)?
- Are database queries optimized (indexes, joins, pagination)?
- Are there benchmarks in `tests/perf/` showing before/after?

**Red Flags:**
- >10% latency regression compared to main branch baseline
- Memory leaks (listener cleanup, event emitter cleanup)
- Unbounded growth (caches without eviction, queues without limits)

### 8. Architectural Decision Records (ADRs)

**When ADR is Required:**
- API contract changes (new endpoints, breaking changes)
- Authentication or authorization redesign
- Data model or schema changes
- Integration with new external services
- Switching databases or major libraries (React → Vue, SQL → NoSQL)
- Performance optimizations that trade off simplicity or maintainability

**ADR Checklist:**
- [ ] ADR file exists in `docs/adr/YYYY-MM-DD-decision-title.md`
- [ ] Status is "Proposed" or "Accepted" (not "Deprecated")
- [ ] Decision and rationale clearly explain the choice
- [ ] Alternatives considered and rejected (with reasoning)
- [ ] Consequences (positive and negative) listed
- [ ] ADR is linked in PR description or committed

**If ADR is Missing:**
- Request it before approval (architectural changes cannot merge without ADR)
- Offer to draft a template if the author is unsure

### 9. Code Quality & Style

**Consistency:**
- Does code follow the team's existing style (naming, formatting, patterns)?
- Are linting rules (ESLint, Prettier, Black) applied?
- Language idioms used correctly (e.g., Pythonic code, JavaScript conventions)?

**Documentation:**
- Complex logic explained in comments (the _why_, not the _what_)?
- Public APIs documented (function signatures, parameters, return values)?
- Non-obvious behavior documented?
- Examples provided for non-trivial behavior?
- Changelog or migration guide updated (if breaking changes)?

**Naming:**
- Function/variable names clear and descriptive (avoid single letters except `i` in loops)?
- Abbreviations used sparingly (prefer `userCount` over `uc`)?
- Boolean variables named to read naturally (`isActive`, not `active`)?

**Structure:**
- Functions reasonably sized (max 30 lines is a heuristic)?
- No deeply nested blocks (refactor into helper functions)?
- Related code grouped together?

### 10. Provide Feedback

**Categorize comments:**

- **Blocking** (REQUEST_CHANGES):
  - Logic bugs that will cause failures
  - Security vulnerabilities
  - Missing tests for critical paths
  - Architectural changes without ADR
  - Performance regressions >10%

- **Important but not blocking** (COMMENT):
  - Code quality improvements
  - Edge cases to handle
  - Simpler alternatives to consider
  - Missing documentation

- **Praise** (inline or summary):
  - Good error handling, thoughtful design, clear code
  - Builds trust and morale

**Format for Comments:**
- Be specific: quote the line or function name, explain the issue
- Suggest a fix when possible (even if you don't write it)
- Use collaborative language: "Consider...", "What about...?" (not "This is wrong")
- For blocking issues: "This needs..." or "Before merge..."
- Keep tone collegial — assume good intent and technical growth

**Example Comments:**

```
// BLOCKING
Line 45: `users.map(u => db.query(...))` will create N+1 queries. 
Move the query outside the loop or batch with `.batch()`.

// SUGGESTION
The error message on line 78 doesn't include the input that failed.
Consider: throw new Error(`Invalid user ID: ${userId}`);

// PRAISE
Good error handling in the retry loop. The exponential backoff 
is well-tuned and won't overwhelm the server.
```

### 11. Re-Review After Changes

- If the author makes significant changes, re-review those sections
- Verify that blocking feedback was actually addressed (not just acknowledged)
- Approve only when you're confident in the change
- Request a new review round if changes are substantial (don't just rubber-stamp)

### 12. Final Decision

Return one of three decisions:

- **APPROVE**: All checks pass. Ready to merge.
- **REQUEST_CHANGES**: Blocking issues found. Author must address before merge.
- **COMMENT**: Suggestions or non-blocking findings. Author can merge after addressing or acknowledging.

## Output Format

```markdown
# PR Review — [PR Title]

## Summary
[1–2 paragraph overview of what changed and assessment]

## Test Coverage
- [ ] Tests added: [description]
- [ ] Coverage target: [X%] (change type: new feature | refactor | bug fix)
- [ ] Coverage met: YES / NO
- **Status:** PASS / FAIL [reason if failed]

## Security Scan
- [ ] New dependencies: [if any, list with versions]
- [ ] Audit results: [npm audit / pip audit output or "clear"]
- [ ] Secrets check: PASS / FAIL [if credentials found, list files]
- **Status:** PASS / FAIL [reason if failed]

## Architecture & ADR
- [ ] Architectural change? YES / NO
- [ ] ADR required? YES / NO
- [ ] ADR present? YES / NO / Not needed
- **Status:** PASS / FAIL [reason if failed]

## Performance
- [ ] Performance-sensitive code changed? YES / NO
- [ ] Benchmarks included? YES / NO / Not applicable
- [ ] Regression vs. baseline: [+X% or "none detected"]
- **Status:** PASS / FAIL [reason if failed]

## Code Quality
- [ ] Logical correctness: PASS / FAIL
- [ ] Error handling complete: PASS / FAIL
- [ ] Backward compatible: PASS / FAIL
- [ ] Readable and documented: PASS / FAIL
- **Status:** PASS / FAIL [reason if failed]

## Line-Level Findings

### Blocking Issues
[Each blocking finding: file:line, code snippet, explanation, suggested fix]

### Suggestions
[Each improvement: file:line, code snippet, explanation, suggested fix]

### Praise
[What was done well]

## Decision
**APPROVE** | **REQUEST_CHANGES** | **COMMENT**

[Summary of reasons and next steps]
```

## Example: Real PR Review

**PR**: "Add rate limiting middleware to API"

**Review Output:**

```markdown
# PR Review — Add rate limiting middleware to API

## Summary
This PR adds a middleware that limits requests per IP to 100/minute,
implementing a security hardening feature for the REST API. Two commits
(middleware logic + tests) are clean and atomic. Implementation is solid,
but missing one production consideration.

## Test Coverage
- Tests added: Happy path (under limit), hitting limit, Redis failure
- Coverage target: 80% (new feature)
- Coverage met: YES (92%)
- **Status:** PASS

## Security Scan
- New dependencies: redis@4.6.0 (already in package.json)
- Audit results: clear (npm audit passed)
- Secrets check: PASS
- **Status:** PASS

## Architecture & ADR
- Architectural change? NO
- ADR required? NO
- **Status:** PASS

## Performance
- Performance-sensitive code changed? YES
- Benchmarks included? NO
- Regression vs. baseline: ~2ms added per request (acceptable)
- **Status:** PASS

## Code Quality
- Logical correctness: PASS
- Error handling complete: PASS (Redis failure handled gracefully)
- Backward compatible: PASS
- Readable and documented: PASS
- **Status:** PASS

## Line-Level Findings

### Blocking Issues
**File: middleware/rate-limit.ts, Line 34**
```javascript
const clientIp = request.ip;
```
The middleware reads `request.ip` directly. If deployed behind a load 
balancer or CDN (likely), all proxied requests will be counted as coming 
from the load balancer's IP. Need to parse `X-Forwarded-For` header 
or use Cloud Run's `X-Cloudrun-User-IP` header.

Suggested fix:
```javascript
const clientIp = request.headers['x-forwarded-for']?.split(',')[0] 
              || request.headers['x-cloudrun-user-ip'] 
              || request.ip;
```

### Suggestions
**File: middleware/rate-limit.ts, Line 15**
Consider adding a config option to disable rate limiting for internal 
traffic (e.g., health checks, other services in the cluster). This 
prevents your own monitoring from hitting the limit unnecessarily.

Example:
```javascript
const internalIps = process.env.INTERNAL_IPS?.split(',') || [];
if (internalIps.includes(clientIp)) return next();
```

### Praise
Good error handling in the Redis failure case (lines 50–56). Failing 
open is the right call here — a missing rate limiter is better than 
blocking all traffic.

## Decision
**REQUEST_CHANGES**

The Redis client IP parsing needs updating to work correctly behind 
proxies. After that fix, this is ready to merge. Excellent work on 
the security posture.
```

## Integration with Claude Code

Use this skill via the CLI:

```bash
/code-review --effort high --comment
```

**Flags:**
- `--effort high`: Full review covering all aspects (logic, security, tests, performance, architecture)
- `--comment`: Automatically post findings as inline GitHub PR comments
- `--fix`: Apply non-breaking suggestions directly to the working tree (conflicts excluded)

**Example Workflow:**

```bash
# Review and post comments
/code-review --effort high --comment

# Review and optionally apply fixes
/code-review --effort high --fix

# Review-only (no posting)
/code-review --effort high
```

**In Workflows:**

If using this skill in an automated workflow (e.g., PR gate), configure as:

```yaml
- name: Review PR Before Merge
  agent: pr-reviewer
  on:
    event: pull_request.ready_for_review
  config:
    effort: high
    blocks_merge: true
  task: |
    Conduct a comprehensive review of the PR.
    Flag BLOCKING issues (logic bugs, security, missing tests, ADR).
    Return APPROVE, REQUEST_CHANGES, or COMMENT decision.
```

## Common Patterns & Checklists

### Full-Stack Feature (Frontend + Backend)

- [ ] Tests in both frontend and backend (>80% each)
- [ ] API contract documented (OpenAPI or similar)
- [ ] ADR written for data model changes
- [ ] Database migration tested (if applicable)
- [ ] E2E tests added (user journey)
- [ ] Performance profiled (API response time, client-side render)
- [ ] Documentation updated (API docs, user guide)

### Bug Fix

- [ ] Root cause identified and explained
- [ ] Regression test added (would fail without the fix)
- [ ] No breaking changes introduced
- [ ] Edge cases considered

### Refactoring

- [ ] All original tests passing (100% before/after parity)
- [ ] No new features mixed in
- [ ] Behavior unchanged (black-box tests validate)
- [ ] Performance not degraded
- [ ] Code is simpler or more maintainable (justify refactor goal)

### Dependency Update

- [ ] Breaking changes handled (migration guide if needed)
- [ ] All tests passing
- [ ] Performance regression checked
- [ ] Changelog or release notes updated
