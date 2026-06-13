---
name: release-manager
description: "Release management: semantic versioning, changelog generation from conventional commits, release readiness checklists, hotfix procedures, rollback plans, and release branch strategy"
updated: 2026-06-13
---

# Release Manager Skill

## When to activate
- Planning and coordinating a software release
- Generating a changelog from commit history
- Determining the correct semantic version bump for a release
- Running release readiness checks before deploying
- Managing a hotfix or emergency release process
- Setting up a release branch strategy (Git Flow, trunk-based, etc.)

## When NOT to use
- CI/CD pipeline configuration — use the cicd skill
- Deployment infrastructure setup — use the docker or kubernetes skills
- Post-release incident management — use the incident-commander agent
- npm publish specifically — use the npm publish workflow

## Instructions

### Semantic versioning

```
Determine the version bump for [release].

Current version: [X.Y.Z]
Changes in this release: [describe or paste commit list]

Semantic versioning rules (semver.org):
MAJOR (X): breaking change — existing integrations will break
  Examples: removed API endpoint, changed function signature, dropped Node version support
  When: any commit with "BREAKING CHANGE:" in body, or "!" after type (feat!: ...)

MINOR (Y): new functionality, backwards-compatible
  Examples: new API endpoint, new optional parameter, new feature behind a flag
  When: commits with type "feat:"

PATCH (Z): backwards-compatible bug fix
  Examples: fix a bug, update dependency (non-breaking), improve error message
  When: commits with type "fix:", "perf:", "refactor:", "docs:" (without new features)

Conventional commit types:
- feat: → MINOR bump
- fix: → PATCH bump
- feat!: or BREAKING CHANGE: → MAJOR bump
- chore:, docs:, style:, test:, refactor: → PATCH (or no bump, your choice)
- perf: → PATCH bump

Given your changes: [input]
Recommended version: [X.Y.Z → A.B.C]
Reasoning: [which commits triggered which bump]
```

### Changelog generation

```
Generate a changelog for [version release].

Version: [X.Y.Z]
Date: [YYYY-MM-DD]
Commits since last release: [paste git log --oneline output or describe changes]

Conventional commit format: type(scope): description
Example: feat(auth): add OAuth2 login support

Changelog format (Keep a Changelog standard):

## [X.Y.Z] — YYYY-MM-DD

### Breaking Changes
- [description of breaking change + migration path]

### Added
- [feat: commits → user-facing description]
- [feat(scope): commits grouped by area]

### Changed
- [changes to existing functionality]

### Fixed
- [fix: commits → what was broken and now works]

### Security
- [security-relevant changes — vulnerabilities patched, permissions tightened]

### Deprecated
- [features that will be removed in a future major version]

### Removed
- [removed features — breaking, goes in Breaking Changes if removal is the break]

Rules for good changelog entries:
- Write for users, not for developers
- "Add OAuth2 login" not "feat(auth): implement oauth2 handler"
- Include migration steps for breaking changes
- Group by impact, not by file or system

Generate the changelog for my release from the commits I provide.
```

### Release readiness checklist

```
Run release readiness checks for [version].

Release type: [major / minor / patch / hotfix]
Target environment: [staging → prod / direct to prod / canary]
Deployment time: [scheduled / on-call standing by / business hours only]

Pre-release checklist:

CODE QUALITY:
□ All CI checks passing (tests, lint, type check, security scan)
□ Code review completed for all changes in this release
□ No open P1/P2 bugs targeting this release that aren't fixed
□ No unresolved merge conflicts

TESTING:
□ Unit tests passing (coverage ≥ threshold)
□ Integration tests passing
□ E2E tests passing on staging environment
□ Manual smoke test of critical user journeys on staging
□ Performance: no regression vs. baseline (check p99 latency)
□ Database migrations tested on a staging DB of prod-like size

COMMUNICATIONS:
□ Release notes drafted and approved
□ Customer-facing changelog ready (if changes affect users)
□ Support team briefed on what's changing
□ Sales/CS briefed if release includes new features they need to demo
□ Status page: any planned maintenance window posted

DEPLOYMENT:
□ Deployment runbook reviewed and up to date
□ Rollback plan defined and tested
□ Database migration rollback confirmed (or migration is forward-only with documented reason)
□ Feature flags configured for gradual rollout (if applicable)
□ On-call engineer aware of deployment timing
□ Monitoring dashboards open: error rate, p99 latency, key business metrics

POST-DEPLOY VALIDATION (first 30 min):
□ Health endpoint returning 200
□ Error rate within normal range
□ Key user flows working (smoke test)
□ Database migration completed cleanly
□ No unusual alerts firing

SIGN-OFF:
□ Engineering lead sign-off
□ Product owner sign-off (for minor/major releases)
□ [Optional] Security review for security-sensitive changes

Generate the checklist for my release type and deployment model.
```

### Hotfix procedure

```
Execute a hotfix for [incident/bug].

Issue severity: [P1 — production down / P2 — major degradation]
Issue: [describe the bug and its impact]
Current production version: [X.Y.Z]
Hotfix branch from: [main / release/X.Y.Z]

Hotfix procedure:

STEP 1 — Create hotfix branch:
git checkout -b hotfix/X.Y.Z+1 main  # Branch from main (or the current prod tag)
# If using Git Flow: git flow hotfix start X.Y.Z+1

STEP 2 — Apply the fix:
[Make the minimal change to fix the issue — no opportunistic cleanup]
[Write a test that reproduces the bug, then verify the fix passes it]

STEP 3 — Version bump:
Bump version to X.Y.Z+1 (PATCH)
Update CHANGELOG.md with the fix

STEP 4 — PR and review:
PR from hotfix/X.Y.Z+1 → main
Expedited review: minimum 1 senior reviewer
CI must pass: no exceptions for P1 hotfixes — if CI is broken, fix CI first

STEP 5 — Merge and tag:
git tag -a vX.Y.Z+1 -m "Hotfix: [description]"
git push origin vX.Y.Z+1

STEP 6 — Deploy:
Follow deployment runbook with expedited timeline
Keep monitoring dashboards open for 30 minutes post-deploy
Confirm the fix resolves the incident before declaring resolved

STEP 7 — Backport to develop:
git checkout develop
git cherry-pick [hotfix commit SHA]
# Ensures the fix is in the next regular release

STEP 8 — Post-incident:
Update CHANGELOG.md on main and develop
Schedule PIR for P1 hotfixes (within 48 hours)

Hotfix rules:
- Fix ONLY the reported bug — no other changes in the hotfix branch
- Hotfix bypasses normal release process but NOT code review
- Hotfix automatically increments PATCH version

Write the hotfix plan for my specific bug.
```

### Release strategy

```
Design a release branching strategy for [team].

Team size: [X engineers]
Release frequency: [daily / weekly / monthly]
Deployment model: [continuous / gated releases / scheduled windows]
Current problem: [too slow / too risky / no process / merge conflicts]

Strategy comparison:

TRUNK-BASED DEVELOPMENT (recommended for most teams):
- Everyone commits to main daily
- Releases tagged from main at any time
- Feature flags hide incomplete features
- Best for: CI/CD, small teams, frequent releases
- Pros: simple, fast, no long-lived branches
- Cons: requires discipline + feature flags infrastructure

GIT FLOW (for scheduled releases):
- main: production
- develop: integration branch
- feature/X: individual features → merge to develop
- release/X.Y: release preparation → merge to main + develop
- hotfix/X: emergency fixes → merge to main + develop
- Best for: mobile apps, on-prem software with release cycles
- Cons: complex, merge conflicts, slow

GITHUB FLOW (lightweight):
- main: always deployable
- feature/X: any work → PR → merge to main → deploy
- Best for: web services deploying continuously
- Pros: simple, fast, no release branches

For your team profile:
[Recommend one strategy with rationale and setup instructions]

Set up the recommended strategy for my team with git commands and CI/CD integration points.
```

## Example

**User:** We're about to release v2.0.0 of our SaaS API. It has breaking changes (removed 3 deprecated endpoints). How do I communicate this and execute the release?

**Claude's release plan:**

**Version:** 2.0.0 (MAJOR bump — breaking change = removed endpoints)

**Changelog entry:**
```markdown
## [2.0.0] — 2026-05-20

### Breaking Changes
- Removed deprecated endpoints: `GET /api/v1/users/legacy`, `POST /api/v1/auth/old`, `DELETE /api/v1/items/purge`
  → **Migration:** Use `GET /api/v2/users`, `POST /api/v2/auth/login`, `DELETE /api/v2/items` respectively.
  → Full migration guide: docs.yourapi.com/migration/v1-to-v2

### Added
- [other additions]

### Fixed
- [bug fixes]
```

**Communication sequence:**
1. **4 weeks before:** Email to all API key holders — "Breaking changes coming in v2.0.0 on [date]. Action required."
2. **2 weeks before:** Second reminder + migration guide link
3. **1 week before:** Final warning + offer of 2-week extension for customers who request it
4. **Release day:** Release notes posted, status page note, support team briefed
5. **Post-release:** Monitor for 400 errors on the removed endpoints — expect spike from slow migrators

**Release readiness gates for a breaking major:**
- [ ] All customers using deprecated endpoints notified ≥4 weeks ago
- [ ] Migration guide published and verified accurate
- [ ] v1 endpoints kept as 410 Gone (not 404) for 30 days — helps customers debug faster
- [ ] Rollback plan: can you re-enable the old endpoints if migration uptake is too low?

---
