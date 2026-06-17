---
description: Comprehensive PR review covering code correctness, test coverage, security vulnerabilities, performance regression detection, and architectural decision record (ADR) compliance. Returns a merge/request-changes decision.
---

# /review-pr

## What This Does
Runs a complete review of a pull request across code quality, testing, security, and performance. Checks full-stack architectural alignment and enforces merge-blocking quality gates.

## When to Use
- Before merging any PR to main or release branches
- When seeking structured feedback on architectural changes
- To enforce team standards consistently across full-stack changes
- When PRs touch both frontend and backend components

## Steps Claude Follows

1. **Gather context**: PR URL, diff, test output, CI results, performance benchmarks (if applicable)
2. **Check test coverage**: Verify coverage meets minimum (80%) for change type; critical paths require 95%
3. **Review code quality**: Correctness, maintainability, adherence to team conventions
4. **Scan security**: Hardcoded secrets, input validation, SQL injection/XSS prevention, CVEs in dependencies
5. **Analyze performance**: Check for N+1 queries, bundle impact, unnecessary re-renders, regression vs. baseline
6. **Validate architecture**: If structural changes, verify ADR exists and code aligns with team decisions
7. **Check integration**: For full-stack PRs, verify frontend-backend contracts, error handling alignment, state management
8. **Return decision**: APPROVE, REQUEST_CHANGES, or COMMENT with specific blockers or suggestions

## Review Checklist

### Code Quality (all levels)
- [ ] Code is readable and follows team conventions
- [ ] Variable/function names are descriptive
- [ ] No unnecessary duplication or dead code
- [ ] Complexity is appropriate for the task
- [ ] No console.log or debug statements left in

### Testing & Coverage (required)
- [ ] New logic has tests (unit for backend, integration for frontend)
- [ ] Tests pass locally and in CI (all green)
- [ ] Coverage at or above minimum (80%, 95% for critical paths)
- [ ] Edge cases covered (null checks, error states, async failures)
- [ ] No flaky tests or platform-specific issues

### API & Contracts (full-stack PRs)
- [ ] API signatures stable; breaking changes documented
- [ ] Request/response types clear and validated
- [ ] Error responses have proper status codes and messages
- [ ] Type definitions match between frontend and backend
- [ ] Documentation updated for public APIs

### Security (blocks merge if failed)
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Input validation on all user-facing endpoints
- [ ] SQL injection, XSS, and CSRF mitigations in place
- [ ] New dependencies audited for CVEs (no high/critical)
- [ ] Sensitive data not logged or exposed

### Performance (blocks merge if >10% regression)
- [ ] No N+1 queries or waterfall requests
- [ ] Bundle size impact acceptable
- [ ] Database indexes considered for new queries
- [ ] Client-side rendering performance acceptable
- [ ] Compared to baseline; regression < 10%

### Architectural Changes (requires ADR)
- [ ] ADR exists at `docs/adr/YYYY-MM-DD-decision-title.md`
- [ ] ADR status is Accepted (not Proposed)
- [ ] Decision rationale includes alternatives considered
- [ ] Consequences section addresses risks
- [ ] Code implementation matches ADR decision

### Documentation (high-level reviews)
- [ ] README or setup guide updated if needed
- [ ] Complex functions have JSDoc/docstring comments
- [ ] Breaking changes documented in CHANGELOG or PR
- [ ] Examples provided for new public APIs

## Output Format

```
# PR Review — [Title]

## Summary
[1-2 sentence overview]

## Test Coverage: [PASS/FAIL]
- Backend: X% (requirement: 80%)
- Frontend: Y% (requirement: 80%)
- Critical paths: Z% (requirement: 95%)

## Code Quality: [PASS/WARNINGS/FAIL]
[Findings: duplications, naming, complexity]

## Security Scan: [PASS/WARNINGS/FAIL]
[CVE check, secrets scan, input validation]

## Performance: [PASS/WARNING/FAIL]
[Baseline comparison, N+1 checks, bundle impact]

## Architectural Review: [PASS/N/A]
[ADR validation if applicable]

## Integration Check: [PASS/WARNINGS/FAIL]
[Frontend-backend contract alignment, error handling, state sync]

## Blockers
[List any merge-blocking issues]

## Suggestions
[Non-blocking improvements or alternatives]

## Decision: APPROVE / REQUEST_CHANGES / COMMENT

[Merge conditions (if any) or specific blockers]
```

## Merge Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Coverage ≥80% for change type
- [ ] Security scan clear (no critical/high CVEs, no secrets)
- [ ] ADR written and accepted (if architectural)
- [ ] No performance regression >10%
- [ ] Code review approval (human)
- [ ] No blockers from /review-pr

## Notes

- **Test coverage is non-negotiable** — refactoring does not reduce coverage requirements
- **Security scan failures block merge** unless critical CVE is explicitly accepted with justification
- **Performance regressions >10%** must be addressed before merge (measure against perf-baseline.json)
- **Architectural changes require ADR** before code review begins
- **Full-stack PRs need integration validation** — frontend calls must match backend contracts exactly
- No merge without green CI and review decision of APPROVE
