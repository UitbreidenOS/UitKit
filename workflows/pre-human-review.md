# Pre-Human Review Pipeline

A three-agent sequential pipeline that prepares a pull request for human review. Runs code simplification, security scanning, and final quality review in order — each agent must pass before the next runs. The result is a PR that arrives at human review already clean, audited, and annotated.

---

## When to use

- Before requesting a code review from a teammate or submitting to main
- After a fast AI-assisted build session where speed was prioritized over polish
- Any PR touching auth, payments, or data access — where a security pass is non-negotiable
- Teams with limited human review bandwidth who want AI to filter the noise first

---

## Phases

### Phase 0 — Prerequisite check

Before spawning agents, verify:

```
Read the PR diff (git diff main...HEAD or the file list).

Tell me:
1. How many files changed?
2. Are any of these present: auth, payments, migrations, secrets, environment config?
3. Is the diff under 500 lines? (If over 2000 lines, recommend splitting the PR first)

Do not proceed to Phase 1 until I confirm.
```

Gate: if the diff exceeds 2000 lines, halt and prompt the user to split the PR. Large diffs defeat the purpose of a structured review.

---

### Phase 1 — Code Simplifier

**Agent:** `agents/code-simplifier.md`
**Goal:** Remove over-engineering, dead code, and unnecessary complexity before the other agents spend tokens on it.

```
Spawn code-simplifier agent.

Scope: [list the changed files]
Task: Review this diff for over-engineering. Identify:
  - Functions that can be replaced by standard library calls
  - Abstractions that add complexity without reuse (YAGNI violations)
  - Dead code or commented-out blocks introduced in this PR
  - Repeated logic that should be extracted once

For each finding: show the before, the suggested after, and the reason.
Do NOT make changes — produce a findings report only.
```

**Gate:** Review the simplifier's findings. For each finding, accept or reject it. Only accepted findings get applied before moving to Phase 2. If the simplifier reports nothing to simplify — green light, proceed immediately.

Apply accepted simplifications:
```
Apply the following accepted simplifications from the code-simplifier report:
[paste accepted findings]

Make the minimal changes required. Do not introduce new patterns or refactor beyond what was listed.
```

---

### Phase 2 — Security Auditor

**Agent:** `agents/security-reviewer.md`
**Goal:** Flag vulnerabilities introduced in the PR diff — not pre-existing issues in the codebase.

```
Spawn security-reviewer agent.

Scope: only the files changed in this PR — do not audit pre-existing code.
Diff: [attach diff or list files]

Check for:
  - Injection vulnerabilities (SQL, command, template)
  - Authentication and authorization gaps
  - Secrets or credentials in code or comments
  - Insecure deserialization or eval-equivalent patterns
  - Missing input validation on user-controlled data
  - Broken access control (horizontal or vertical privilege escalation)

For each finding: severity (CRITICAL / HIGH / MEDIUM / LOW), file + line, description, remediation.
CRITICAL and HIGH findings block merge. MEDIUM and LOW are advisory.
```

**Gate:** Any CRITICAL or HIGH finding blocks Phase 3. The user must either fix the issue or explicitly accept the risk in writing before proceeding. LOW and MEDIUM findings are appended to the PR description as advisory notes.

---

### Phase 3 — Code Reviewer

**Agent:** `agents/code-reviewer.md`
**Goal:** Final quality pass — logic correctness, test coverage, documentation, and overall readiness.

```
Spawn code-reviewer agent.

Context: This diff has already passed simplification and security review.
Focus your review on:
  - Logic correctness: does the code do what the PR description claims?
  - Edge cases: what inputs or states could break this?
  - Test coverage: are the tests meaningful, or are they testing implementation details?
  - Error handling: are failures handled at the right level?
  - Documentation: do new public APIs have docstrings or JSDoc?

Do not re-raise issues already surfaced by the security or simplification passes.
Produce: a LGTM / NEEDS WORK verdict with a numbered list of issues (if any).
```

**Gate:** LGTM → PR is ready for human review. NEEDS WORK → address issues and re-run Phase 3 only (no need to re-run Phases 1 or 2 unless new code was added).

---

### Phase 4 — Output packaging

Once all three agents have passed:

```
Summarize this PR for the human reviewer.

Include:
- One-paragraph description of what this PR does
- Files changed (grouped by concern: feature code, tests, config)
- Issues raised and resolved during the pipeline
- Any advisory (LOW/MEDIUM) security notes
- Suggested review focus areas for the human

Format as a PR description update — I will paste it into the GitHub PR body.
```

---

## Example

PR: "Add OAuth2 login with Google"

- Phase 0: 8 files changed, auth logic present → proceed with security pass mandatory
- Phase 1 (Simplifier): found 2 issues — inline token validation that duplicates an existing `validateToken()` utility, and a dead import. Both accepted and applied.
- Phase 2 (Security): found 1 HIGH — state parameter not validated in OAuth callback (CSRF risk). User fixes it before Phase 3.
- Phase 3 (Reviewer): LGTM with 1 advisory — missing test for expired token case. Advisory appended to PR.
- Phase 4: PR description updated with summary and advisory note.

Human reviewer receives a diff that is already simplified, security-checked, and annotated.

---
