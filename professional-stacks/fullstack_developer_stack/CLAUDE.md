# Full-Stack Developer Stack — Workspace Configuration

Workspace instructions for full-stack development projects requiring test coverage >80%, architectural decision records, security scanning, and performance regression detection.

---

## Quality Gates

### Test Coverage
- **Minimum: 80%** across all layers (backend, frontend, API)
- Critical paths (auth, payments, mutations) require 95%+
- Enforce via CI: `npm test -- --coverage`
- Block merge if coverage drops

### Architectural Decision Records (ADRs)
- **Every architectural change** requires an ADR before code review
- Location: `docs/adr/YYYY-MM-DD-decision-title.md`
- Include: decision, rationale, alternatives, consequences, status
- Changes affecting API contract, auth, or data flow mandate ADR

### Security Scanning
- Pre-commit: `npm audit` blocks on high/critical
- CI: SAST (CodeQL/Snyk), dependency audit, secrets check
- Credentials detected → block merge
- New dependencies → CVE audit required

### Performance Regression Detection
- Benchmarks in `tests/perf/` for critical paths (load, render, API response)
- CI: Compare PR branch to main baseline
- Threshold: Reject PRs increasing latency >10%
- Baseline: `perf-baseline.json` committed to repo

---

## File Structure

```
.
├── backend/                  # Service (Node/Python/Go)
│   ├── src/
│   ├── tests/                # Unit + integration tests
│   └── Dockerfile
├── frontend/                 # React/Vue/Svelte
│   ├── src/
│   ├── tests/                # Component + E2E tests
│   └── vitest.config.ts
├── docs/
│   ├── adr/                  # Architecture Decision Records
│   ├── api.md                # OpenAPI docs
│   └── setup.md
├── tests/
│   ├── integration/          # Cross-layer tests
│   ├── perf/                 # Performance benchmarks
│   └── e2e/                  # Playwright/Cypress
├── .github/workflows/        # CI pipeline
├── perf-baseline.json        # Performance baseline
└── CLAUDE.md                 # (this file)
```

---

## ADR Template

Create `docs/adr/YYYY-MM-DD-decision-title.md`:

```markdown
# YYYY-MM-DD: Decision Title

## Status
Proposed / Accepted / Deprecated

## Context
Why is this decision needed?

## Decision
What was chosen and why?

## Rationale
Trade-offs, alternatives rejected, measurable outcomes.

## Consequences
Positive: [consequences]
Negative: [risks]

## Related ADRs
Links to related decisions.
```

---

## Pre-Commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/bash
npm audit --audit-level=high || exit 1
git-secrets --scan || exit 1
npm test -- --testPathPattern='unit' || exit 1
```

---

## CI Pipeline

`.github/workflows/test.yml` must include:

1. Lint & type check (ESLint, TypeScript)
2. Unit tests with coverage report (>80% threshold)
3. Integration tests
4. SAST (CodeQL or Snyk)
5. Dependency audit
6. Performance benchmarks vs. baseline
7. ADR validation (architectural PRs only)

---

## Merge Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Coverage ≥80% for change type
- [ ] Security scan clear (no critical/high CVEs)
- [ ] ADR written (if architectural)
- [ ] No secrets in code
- [ ] Performance regression check passed
- [ ] Code review approval (human)

---

## Local Development

```bash
npm install && npm run setup:db

# Development
npm run dev

# Pre-commit checks
npm run check          # Lint + type + audit

# Test & coverage
npm test -- --coverage

# Performance benchmark
npm run perf

# View ADRs
ls docs/adr/
```

---

## When to Delegate

- **Architectural decisions** → Escalate to tech lead with ADR draft
- **Performance regression** → Profile with DevTools; compare baseline
- **Security findings** → OWASP Top 10 remediation checklist

---

## Constraints

- No unreviewed architecture changes
- No merge without green CI
- No new dependencies without audit pass
- No secrets in code or logs
