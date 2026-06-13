# QA Testing Engineer Stack

> The complete Claude Code workspace for test planning, test case generation, automated test execution, bug triage, and quality validation. Shift-left testing with comprehensive coverage, regression detection, and continuous quality assurance for high-velocity product development.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Set up test framework** — Configure Pytest, Jest, or Playwright in your project.
3. **Run `/plan-tests [feature-name]`** — Get a comprehensive test plan with coverage goals and acceptance criteria.
4. **Run `/generate-tests`** — Create executable test code (unit, integration, E2E).
5. **Run `/run-tests`** — Execute test suites and generate detailed pass/fail reports with coverage analysis.
6. **Run `/triage-bugs`** — Classify failures by severity and priority.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | QA persona, tone guidelines, severity/priority matrix, test formats, SLAs. Start here. |
| `session-log.md` | Log | Auto-updated with every test cycle: features tested, coverage delta, bugs found, regressions. |
| `skills/` | Directory | 8 reusable skills for test planning, generation, execution, and analysis. |
| `commands/` | Directory | 3 slash commands for running test workflows. |
| `hooks/` | Directory | 4 automation hooks for coverage enforcement, regression detection, performance monitoring. |
| `mcp/` | Directory | MCP configs for Pytest, code coverage tools, and CI/CD integration. |

---

## Skills (8)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `test-planner` | `/plan-tests` | Read, Write | Analyze requirements; generate comprehensive test plan with coverage goals, risk assessment |
| `test-case-generator` | `/generate-tests` | Read, Write | Create detailed test cases (positive, negative, edge cases); save to test registry |
| `automated-test-writer` | `/generate-tests` | Read, Write | Generate executable test code (Pytest, Jest, Playwright) with mocking, assertions, setup/teardown |
| `test-executor` | `/run-tests` | Read, Write | Execute test suites; parse output; generate pass/fail reports with failure analysis |
| `bug-triage-classifier` | `/triage-bugs` | Read, Write | Categorize bugs by severity/priority; analyze root causes; log to bug registry; escalate P1/P2 |
| `coverage-analyzer` | `/run-tests` | Read, Write | Analyze code/test coverage; identify gaps; track coverage trends; recommend additional tests |
| `regression-risk-assessor` | Before release | Read, Write | Assess risk based on code changes; recommend critical test paths to re-run |
| `test-suite-optimizer` | Maintenance cycle | Read, Write | Review test redundancy; consolidate duplicate tests; optimize execution time |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/plan-tests [feature]` | Analyze requirements and generate comprehensive test plan with test cases, coverage goals, and acceptance criteria. |
| `/generate-tests` | Create executable test code (Pytest/Jest/Playwright) from test cases. Ready for CI/CD integration. |
| `/run-tests` | Execute test suites and generate detailed pass/fail reports with failure analysis, coverage metrics, and regression detection. |

---

## Hooks (4)

| Hook | Event | What It Protects Against |
|---|---|---|
| `coverage-enforcement` | PostToolUse | Blocks test changes that decrease coverage below 80% threshold unless explicitly overridden |
| `regression-detector` | PostToolUse | Scans test output for new failures; flags regressions; posts alert to session log |
| `performance-watcher` | PostToolUse | Monitors test execution time; alerts if any test takes >3x baseline (perf regression indicator) |
| `session-summary` | Stop | Auto-logs to `session-log.md` at end of session: tests run, coverage delta, bugs found, regressions |

---

## MCP Setup

### Pytest Runner

For Python unit and integration testing.

```json
{
  "mcpServers": {
    "pytest_runner": {
      "command": "python",
      "args": ["-m", "pytest"]
    }
  }
}
```

### Code Coverage Tools

For analyzing test coverage distribution.

```json
{
  "mcpServers": {
    "coverage_analyzer": {
      "command": "python",
      "args": ["-m", "coverage"]
    }
  }
}
```

### CI/CD Integrations

Configure your preferred CI/CD platform (GitHub Actions, GitLab CI, Jenkins, CircleCI). See `mcp/ci-integrations.md` for templates.

---

## How It Works

### 1. Test Planning
Start with `/plan-tests [feature]`. Analyze requirements, define coverage goals, identify risk areas, and create test case outlines. Plan is saved and requires human approval before proceeding.

### 2. Test Case Generation
Run `/generate-tests` to convert test case outlines into detailed test cases with preconditions, steps, expected results, and acceptance criteria. Auto-save to test-registry.md.

### 3. Test Code Generation
Generate executable test code in Pytest, Jest, or Playwright. Includes setup/teardown, mocking, assertions, and error handling. Code is ready for immediate execution.

### 4. Test Execution
Run `/run-tests` to execute test suites. Parse output for pass/fail counts, coverage metrics, failures, and regressions. Generate detailed report with root cause analysis.

### 5. Bug Triage
All test failures are automatically triaged by severity (Critical/High/Medium/Low) and priority (P1-P4). P1/P2 bugs are escalated for immediate attention.

### 6. Coverage Analysis
After each test run, analyze coverage gaps and recommend additional test cases. Track coverage trends over time.

### 7. Regression Detection
Before any release, assess regression risk based on code changes. Identify which critical test paths must be re-run.

### 8. Session Logging
All activities are logged to session-log.md for audit trail: tests run, coverage changes, bugs found, regressions detected, approvals.

---

## Severity & Priority Matrix

Triage all bugs by severity and priority before logging.

| Severity | Definition | Priority | Response |
|---|---|---|---|
| **Critical** | Production outage; data loss; security breach; payment failure | P1 | Immediate (<30 min) |
| **High** | Feature broken; major workflow blocked; perf impact | P2 | 4 hours |
| **Medium** | Feature partially broken; workaround exists; minor perf impact | P3 | 24 hours |
| **Low** | Edge case; cosmetic issue; documentation gap | P4 | Next sprint |

---

## Test Case Format

Every test case includes:

```
## Test Case: [TC-MODULE-###]

**Title:** [Clear one-liner about what is being tested]

**Test Type:** [Positive / Negative / Edge Case / Integration / Performance / Security]

**Preconditions:**
- [Environment setup, test data, login state, etc.]

**Steps:**
1. [User action] → [Verify result]
2. [User action] → [Verify result]

**Expected Result:**
- [Specific behavior]
- [Data state]
- [Error message or redirect, if applicable]

**Actual Result:**
- [Filled in during execution]

**Status:** [PASS / FAIL / BLOCKED / SKIP]

**Bug Reference:** [If failed, link to bug ID]

**Coverage:** [Which requirement/module/function this covers]

**Effort:** [Time to execute]

**Notes:** [Special considerations, flakiness concerns]
```

---

## Test Execution Report Format

```
# Test Execution Report

**Date:** [YYYY-MM-DD HH:MM UTC]
**Environment:** [dev / staging / prod]
**Build:** [version or commit hash]

**Summary:**
- Total Tests: [N]
- Passed: [N] ([X%])
- Failed: [N] ([X%])
- Blocked: [N] ([X%])

**Coverage:**
- Line: [X%] (target >80%)
- Branch: [X%] (target >60%)
- Function: [X%] (target >80%)

**Failures:**
[For each: Test Name | Root Cause | Bug ID | Severity]

**Regressions:** [New failures in previously-passing tests]

**Next Steps:** [Recommended actions]
```

---

## Human Approval Gate

**All critical test plans and releases require human review.**

- Claude generates test plans, test cases, test code, and bug reports.
- Human reviews and approves or requests changes.
- Only after approval are test plans finalized, code is deployed to CI/CD, or releases proceed.
- Approval log entry example: `[APPROVED] Test plan for Auth Module — 2026-06-13 14:35`

---

## Success Metrics

Track and report on:
- **Test coverage:** Target >80% line coverage, >60% integration coverage
- **Defect escape rate:** Percentage of bugs found in production vs. QA (target <5%)
- **Mean time to triage:** Average time from test failure to bug assignment (target <30 min)
- **Regression prevention:** Percentage of regressions caught by automated tests (target >95%)
- **Test execution speed:** Total test suite runtime (target <15 min for unit + integration)
- **False positive rate:** Percentage of test failures that are environment issues, not real bugs (target <2%)

---

## Key Constraints

- **Test isolation:** Every test must be independent. No shared state between tests.
- **Flaky tests:** Any intermittent failure must be investigated and fixed immediately. Mark as SKIP until resolved.
- **Performance:** Tests should complete quickly (<5 seconds each, ideally <1 second).
- **Data safety:** Never run destructive tests on production. Staging environment only for integration tests.
- **Secret handling:** Never log credentials, API keys, or PII in test output or bug reports.

---

## Stats

**8 skills** · **3 commands** · **4 hooks** · **3 MCP configs** · **Full audit trail** via session logging · **Comprehensive test coverage** · **Automated regression detection**

---

Built by [tushar2704](https://github.com/tushar2704) · [Claudient](https://github.com/Claudient/Claudient) · [Claude Code](https://claude.com/claude-code)
