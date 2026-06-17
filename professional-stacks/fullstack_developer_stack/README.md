# Full-Stack Developer Stack

> Test coverage >80%, architectural decision records, security scanning, and performance regression detection for production-grade full-stack applications.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Configure CI/CD gates** — Set up quality checks in your `.github/workflows/` (test coverage, security, performance, ADRs).
3. **Run `/write-adr`** — Document architectural decisions before code review.
4. **Run `/generate-tests`** — Auto-generate test suites for new functions, components, and endpoints.
5. **Run `/review-pr`** — Conduct comprehensive reviews covering correctness, security, tests, and performance.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Quality gates, file structure, merge checklist, ADR template, and CI/CD requirements. Start here. |
| `session-log.md` | Log | Auto-updated: test runs, code reviews, ADRs written, performance benchmarks, security scans. |
| `skills/` | Directory | 8 developer-focused skills — test generation, PR review, security scanning, performance analysis. |
| `commands/` | Directory | 3 slash commands for the core development workflow. |
| `hooks/` | Directory | 3 hooks enforcing test coverage, security scanning, and performance regression detection. |
| `mcp/` | Directory | Code analysis and GitHub MCP server configs. |

---

## Skills (8)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `test-generator` | After writing new code | Read, Write, Bash | Generate unit, component, and API endpoint tests; target 80%+ coverage |
| `pr-reviewer` | Before merging | Read, WebSearch, Bash | Comprehensive review: logic, security, tests, performance, ADR, architecture |
| `security-scanner` | Pre-commit / CI | Bash, Read, Write | Audit dependencies, scan for secrets, check SAST findings, validate input handling |
| `performance-analyzer` | On hot-path changes | Read, Bash, WebFetch | Profile code, compare vs. baseline, identify N+1 queries, memory leaks, inefficiencies |
| `dependency-auditor` | When adding/updating deps | Bash, Read | Check CVE databases, license compatibility, maintenance status, size/footprint |
| `adr-writer` | Before architectural changes | Read, Write | Draft ADRs documenting decisions, rationale, alternatives, consequences |
| `debugging-assistant` | When tests fail | Bash, Read, Write | Isolate failures, trace stack traces, suggest fixes, add debug logging |
| `refactoring-recommender` | During code review | Read, Write | Identify duplication, simplify complex logic, improve testability, suggest patterns |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/write-adr` | Draft an ADR documenting architectural decision, rationale, alternatives, and consequences |
| `/generate-tests` | Auto-generate test suite (unit, component, integration, or API endpoint) with 80%+ target coverage |
| `/review-pr` | Conduct comprehensive PR review covering logic, security, tests, performance, architecture, and ADR compliance |

---

## Hooks (3)

| Hook | Event | What It Enforces |
|---|---|---|
| `test-coverage-enforcer` | PreCommit / CI | Blocks commits if coverage drops below 80%; critical paths require 95%+ |
| `security-scanner` | PreCommit / CI | Runs npm/pip audit, dependency CVE check, secrets detection; blocks on high/critical |
| `performance-regression-detector` | CI | Compares hot-path benchmarks vs. main baseline; blocks PRs with >10% latency increase |

---

## MCP Setup

### Code Analysis (GitHub Copilot–compatible)

Enable code search, symbol resolution, and cross-repo analysis via the built-in code analysis MCP. No setup required — installed with Claude Code.

### GitHub

Get your token at [github.com/settings/tokens](https://github.com/settings/tokens). Add to `settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "gh",
      "args": ["api", "graphql", "--input", "-"],
      "env": { "GH_TOKEN": "your-token-here" }
    }
  }
}
```

---

## How It Works

### 1. Test-First Development

Before writing code, determine the test strategy:
- **New feature:** Unit tests + integration tests + E2E if touching user workflows. Target 80%+.
- **Bug fix:** Add a regression test that fails without the fix.
- **Refactoring:** 100% before/after parity — no new coverage debt.

Use `/generate-tests` to scaffold the test suite.

### 2. Write Architectural Decisions

Before major changes (API redesign, database migration, new framework), write an ADR:
- Run `/write-adr` to draft the decision document.
- Include context, decision, rationale, alternatives considered, and consequences.
- ADRs are required for approval and merged alongside code.

### 3. Code Review & QA

When PRs are ready:
- Run `/review-pr` for a comprehensive review covering all quality dimensions.
- The review checks logic, security, tests, performance, and architectural alignment.
- Blocking issues (logic bugs, security gaps, missing tests, missing ADRs) must be fixed before merge.

### 4. Continuous Quality Gates

CI/CD runs automatically:
- **Pre-commit hooks** validate tests and security locally.
- **CI pipeline** runs full suite: lint, type check, unit tests, integration tests, SAST, dependency audit, performance benchmarks, ADR validation.
- **Merge checklist** ensures all gates are green: tests passing, coverage ≥80%, security clear, ADR present (if architectural), no secrets, performance OK.

### 5. Session Log & Metrics

Every key action is logged to `session-log.md`:
- ADRs written
- Test suites generated
- PR reviews completed
- Security findings and fixes
- Performance benchmarks
- Coverage trends

---

## Quality Standards by Change Type

### New Feature
- **Test coverage:** 80%+ (unit + integration + E2E if customer-facing)
- **ADR:** Required if architectural (new API endpoint, data model, auth scheme)
- **Security:** Input validation, output escaping, permission checks
- **Performance:** Benchmarks if touching hot paths
- **Documentation:** API docs, user guide, examples

### Bug Fix
- **Test coverage:** At least 1 regression test (fails without fix)
- **Backward compatible:** No breaking changes
- **Security:** Check if bug was a security issue (document findings)
- **Root cause:** Explain why bug occurred

### Refactoring
- **Test coverage:** 100% before/after parity (black-box tests validate behavior)
- **No feature changes:** Refactoring must not introduce new features
- **Simplicity:** Justify why refactoring improves code (readability, maintainability, performance)
- **Performance:** No regression vs. baseline

### Dependency Update
- **Breaking changes:** Handle migrations (update imports, API calls)
- **Security:** Check CVE databases (npm audit, Snyk)
- **Tests:** All tests pass with new version
- **License:** Ensure license compatibility (GPL conflicts with proprietary?)

---

## Merge Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Coverage ≥80% for change type (95%+ for critical paths)
- [ ] Security scan clear (no unaddressed high/critical CVEs)
- [ ] ADR written (if architectural change)
- [ ] No secrets or credentials in code
- [ ] Performance regression check passed (<10% increase)
- [ ] Code review approval (human)
- [ ] CI green (all workflows passing)

---

## Success Metrics

Track and report on:
- **Test coverage:** Target ≥80% overall; 95%+ for critical paths (auth, payments, mutations)
- **PR review velocity:** Target review time <4 hours; feedback within 24 hours
- **Security incidents:** Target 0 unaddressed high/critical CVEs in main branch
- **Performance:** Zero regressions >10% latency vs. baseline; document optimizations
- **ADR adoption:** All architectural changes have corresponding ADRs before merge
- **Merge confidence:** Green CI on every merge; zero production incidents from merged code

---

## Key Constraints

- **Test coverage ≥80%.** Merge blockers if coverage drops.
- **Architecture first.** ADR required before code review on major changes.
- **Security scanning required.** Secrets detected → block merge; high/critical CVEs → address before merge.
- **Performance regression <10%.** Benchmarks run on every change to hot paths; block >10% increases.
- **Code review required.** All PRs reviewed for logic, security, tests, architecture, and performance.

---

## Workspace Structure

```
fullstack_developer_stack/
├── CLAUDE.md                           (this file: workspace rules, CI/CD, merge checklist)
├── session-log.md                      (auto-updated activity log)
├── README.md
├── skills/
│   ├── test-generator/SKILL.md
│   ├── pr-reviewer/SKILL.md
│   ├── security-scanner/SKILL.md
│   ├── performance-analyzer/SKILL.md
│   ├── dependency-auditor/SKILL.md
│   ├── adr-writer/SKILL.md
│   ├── debugging-assistant/SKILL.md
│   └── refactoring-recommender/SKILL.md
├── commands/
│   ├── write-adr.md
│   ├── generate-tests.md
│   └── review-pr.md
├── hooks/
│   ├── test-coverage-enforcer.md
│   ├── security-scanner.md
│   └── performance-regression-detector.md
└── mcp/
    ├── code-analysis.md
    ├── connections.md
    └── github.md
```

---

## Common Patterns & Workflows

### Full-Stack Feature Workflow

1. Write an ADR documenting API contract, data model, auth changes
2. Generate tests for all layers (backend unit tests, API integration tests, React component tests, E2E user journey)
3. Implement feature with tests driving design
4. Run `/review-pr` for comprehensive review
5. Merge only when tests green, coverage ≥80%, ADR approved, security clear

### Performance-Critical Optimization

1. Profile the hot path (flame graphs, browser DevTools, database EXPLAIN)
2. Implement optimization with benchmarks before/after
3. Run performance-regression-detector to validate <10% improvement baseline
4. Document trade-offs in ADR (speed vs. memory, simplicity vs. optimization)
5. Merge with benchmark results in PR description

### Debugging Test Failures

1. Run failing test locally with `--watch`
2. Use `/debugging-assistant` to isolate the issue
3. Add debug logging to understand state at failure point
4. Fix the bug and add regression test to prevent recurrence
5. Verify all related tests pass before merge

---

**8 skills · 3 commands · 3 hooks · 2 MCP servers · Full audit trail**

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudients/Claudient) · [Claude Code](https://claude.com/claude-code)
