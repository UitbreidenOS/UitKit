---
name: technical-debt-assessment
description: Audits a codebase or architecture for technical debt. Identifies code smells, architectural anti-patterns, scalability risks, and maintenance burden. Outputs a prioritized debt registry with refactoring recommendations and effort estimates.
allowed-tools: Read
effort: medium
---

# Technical Debt Assessment

## When to activate

When taking over a system that's been in production for 6+ months, or when performance/reliability concerns emerge. Triggered by: postmortem after incident, customer complaint about speed/crashes, developer request for refactoring time, migration planning, or periodic health check (quarterly). Can be run on entire codebase or specific modules.

## When NOT to use

Not for greenfield projects (there's no debt yet). Not as code review (that's line-level analysis). Not for performance optimization alone (use performance-tuning instead). Not if no access to code or architecture (request access first). Not if the system is already being decommissioned.

## Audit Checklist

**Code Quality**
- [ ] Code duplication (DRY violations)
- [ ] Long methods/functions (>50 lines)
- [ ] God classes (>500 lines, >10 responsibilities)
- [ ] Tight coupling (high fan-in/fan-out)
- [ ] Missing abstractions (repeated patterns)
- [ ] Test coverage <80%?
- [ ] No logging/instrumentation?
- [ ] Deprecated language features still in use?

**Architecture & Design**
- [ ] Circular dependencies between modules?
- [ ] Monolithic components that should be split?
- [ ] Missing API versioning/contracts?
- [ ] Tech stack drift (multiple languages, frameworks)?
- [ ] No clear separation of concerns?
- [ ] Hard-coded configuration (no external config)?

**Data & Databases**
- [ ] Unindexed queries causing slowness?
- [ ] N+1 query patterns?
- [ ] Missing database constraints?
- [ ] Inadequate schema documentation?
- [ ] No data migration strategy?
- [ ] Backup/restore untested?

**Operations & Monitoring**
- [ ] No centralized logging?
- [ ] No alerting on critical errors?
- [ ] Manual deployment (no CI/CD)?
- [ ] No staging environment?
- [ ] Runbooks missing or outdated?
- [ ] No load testing or capacity planning?

**Security & Compliance**
- [ ] Hardcoded secrets in code?
- [ ] No input validation?
- [ ] Missing auth/authz checks?
- [ ] Outdated dependencies (vulnerable)?
- [ ] No encryption in transit or at rest?
- [ ] Compliance requirements unmet?

**Dependencies**
- [ ] Outdated libraries (security patches missing)?
- [ ] Unused dependencies (bloat)?
- [ ] Breaking changes in minor versions?
- [ ] Missing dependency lock files?

## Output Format

### Technical Debt Registry

**Executive Summary**
- Overall health: HEALTHY / AT RISK / CRITICAL
- Debt-to-value ratio: [estimate: how much effort to refactor vs. feature work]
- Top 3 risks: [What will bite us hardest]
- Recommended action: [MAINTAIN / REFACTOR INCREMENTALLY / REWRITE]

**Debt by Category**

| Category | Severity | Count | Impact | Est. Effort |
|---|---|---|---|---|
| Code Quality | HIGH | 12 | Bugs, slow development | 8 weeks |
| Architecture | CRITICAL | 3 | Scaling blocked | 16 weeks |
| Data | MEDIUM | 5 | Performance issues | 3 weeks |
| Operations | HIGH | 8 | Reliability risk | 4 weeks |
| Security | CRITICAL | 2 | Breach risk, compliance | 2 weeks |
| Dependencies | MEDIUM | 23 | Supply chain risk | 1 week |

**Detailed Findings**

By severity (CRITICAL first, then HIGH, MEDIUM):

1. **[Finding Title]**
   - **Severity:** CRITICAL
   - **Location:** [File, class, module]
   - **Description:** [What's wrong]
   - **Impact:** [Why it matters — reliability, security, performance, dev velocity]
   - **Recommendation:** [How to fix — refactor, rewrite, replace]
   - **Effort:** [S/M/L/XL]
   - **Blocker for:** [What feature/goal is blocked by this]

Example:
```
1. No Authentication in Legacy Admin API
   Severity: CRITICAL
   Location: /api/admin/*
   Description: Admin endpoints have no auth — anyone can access with correct URL
   Impact: Security breach risk. Customer data exposed.
   Recommendation: Add OAuth2 + role-based access control. Audit all endpoints.
   Effort: L (2 weeks)
   Blocker for: Production deployment, SOC2 certification
```

**Refactoring Roadmap**

Phase 1 (Now–4 weeks): CRITICAL security and reliability fixes
- [Fix 1]
- [Fix 2]

Phase 2 (Weeks 4–12): HIGH priority, high-impact refactoring
- [Fix 3]
- [Fix 4]

Phase 3+ (Months 3+): MEDIUM priority, incremental improvements
- [Fix 5]
- [Fix 6]

**Prevention Plan** (so debt doesn't accumulate again)

- [ ] Code review checklist updated
- [ ] Automated linting/testing in CI/CD
- [ ] Dependency scanning (Dependabot, Snyk)
- [ ] Quarterly architecture review
- [ ] Tech lead review before major changes
- [ ] Developer training on best practices

---
