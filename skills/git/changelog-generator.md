---
name: changelog-generator
description: "Generate Keep a Changelog entries from git log, commit history, or PR list — grouped by type with semver guidance"
updated: 2026-06-13
---

# Changelog Generator Skill

## When to activate
- Preparing a release and need to update CHANGELOG.md
- Turning a list of commits or PRs into human-readable release notes
- Auditing what changed between two versions
- Deciding the next semver bump based on the types of changes

## When NOT to use
- Fully automated CI changelogs — use `conventional-changelog-cli` or `release-please` instead
- Single-commit patches where the commit message is sufficient
- Internal development notes that don't need public changelog entries

## Instructions

### Keep a Changelog format
```markdown
## [Unreleased]

## [1.2.0] - 2026-05-15
### Added
- New feature descriptions (for `feat` commits)

### Changed
- Behaviour changes that aren't breaking (for `refactor`, `perf`)

### Deprecated
- Features that will be removed in a future version

### Removed
- Features removed in this version

### Fixed
- Bug fix descriptions (for `fix` commits)

### Security
- Security fix descriptions
```

### Semver guidance from commit types

| Commit type | Semver bump |
|------------|------------|
| `fix`, `perf`, `docs`, `style`, `test`, `chore` | Patch (`1.0.X`) |
| `feat`, `refactor` | Minor (`1.X.0`) |
| Any commit with `BREAKING CHANGE` or `!` (e.g. `feat!:`) | Major (`X.0.0`) |

### Workflow

**From git log:**
```bash
git log v1.1.0..HEAD --oneline --no-merges
```
Paste the output and ask Claude to generate changelog entries.

**From a range:**
```
Generate CHANGELOG.md entries for version 1.3.0 from these commits:

feat(auth): add OAuth2 Google login
feat(api): add bulk export endpoint
fix(billing): correct proration calculation for mid-cycle upgrades
fix(ui): fix date picker z-index on Safari
perf(db): add index on orders.user_id
chore(deps): upgrade SQLAlchemy to 2.0.36
docs: update API reference for export endpoint

Suggest the semver bump from 1.2.0.
```

**Claude will:**
1. Categorise each commit into Added / Changed / Fixed / Security
2. Rewrite each entry in user-facing language (not developer jargon)
3. Group related entries
4. Strip internal-only entries (`chore`, `style`, `test`) from the public changelog
5. Recommend the semver bump and explain why

### Writing style for entries
- **User-facing:** "Add Google login" not "feat(auth): add OAuth2 Google login provider via passport.js"
- **Past tense** for the changelog body: "Fixed date picker on Safari"
- **Imperative** is acceptable: "Fix date picker z-index on Safari"
- **No implementation details** — "Improve database query performance" not "Add btree index on orders.user_id"
- **Include the user impact** for breaking changes: "**Breaking:** API responses now paginate by default. Pass `?per_page=1000` to restore previous behaviour."

## Example

**Input commits:**
```
feat(export): add CSV bulk export for orders
feat!: remove deprecated /v1/users endpoint (use /v2/users)
fix(checkout): prevent double-charge on payment retry
fix(ui): sidebar collapse animation on mobile
perf: cache user permissions in Redis
chore: upgrade Node.js to 22.x
test: add e2e tests for checkout flow
```

**Expected output:**
```markdown
## [2.0.0] - 2026-05-15

### Added
- Bulk CSV export for orders via the new `/orders/export` endpoint

### Changed
- User permissions are now cached, reducing API response times by ~40ms on average

### Removed
- **Breaking:** The deprecated `/v1/users` endpoint has been removed. Use `/v2/users` instead.

### Fixed
- Double-charge prevented when a payment retry occurs at checkout
- Sidebar collapse animation now works correctly on mobile devices

---
**Semver bump:** 1.x.x → 2.0.0 (MAJOR — breaking removal of /v1/users endpoint)
```

---
