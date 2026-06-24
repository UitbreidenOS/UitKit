---
name: "changelog-writer"
description: "User-facing changelog from git history or PRs: group by impact, plain language, links to docs"
---

# Changelog Writer Skill

## When to activate
- Preparing a release and need to turn a git log or list of PRs into a user-facing changelog
- Your team ships continuously and you need to write a weekly or monthly digest of changes
- The engineering CHANGELOG.md is too technical to share with customers
- You need to produce release notes for a product announcement, email, or in-app notification
- You want to classify changes by user impact (new feature / improvement / fix / breaking change)

## When NOT to use
- You're writing internal technical release notes for engineers — those can stay closer to the commit log
- You need a full blog post announcing a major feature — that's marketing copy, not a changelog entry
- You want a migration guide for breaking changes — use `/api-doc-writer` for the migration guide; the changelog entry should link to it, not replace it
- You haven't shipped anything yet — write the changelog after the code lands, not before

## Instructions

### Git log → user-facing changelog

```
Convert this git history / PR list into a user-facing changelog entry.

## Release context
Product: [name]
Version: [v2.4.0 / "June 2026 release" / weekly digest]
Release date: [date]
Audience: [end users / developers / admins / mixed]

## Raw input
[Paste one of: git log output / list of merged PRs / Jira release / Linear milestone / free-form list of changes]

Example git log format:
abc1234 feat: add bulk invite flow for workspace admins (#1203)
def5678 fix: pagination breaks when filter is active (#1188)
ghi9012 chore: upgrade React to 18.3 (#1201)  ← skip this
jkl3456 feat(api): add cursor-based pagination to /v1/events (#1195)
mno7890 fix: email notifications sent twice on plan upgrade (#1179)
pqr2345 perf: reduce dashboard initial load time by 40% (#1197)
stu6789 BREAKING: remove deprecated /v1/users/bulk endpoint (#1200)

## Instructions

1. FILTER: Skip internal-only changes:
   - Dependency upgrades without user-visible impact (`chore: upgrade X`)
   - Refactors with no user-visible change (`refactor:`)
   - Test-only changes (`test:`)
   - CI/CD changes (`ci:`, `build:`)
   - Internal tooling

2. CLASSIFY each remaining change:
   - New feature: new capability the user didn't have before
   - Improvement: existing feature now works better (faster, simpler, extended)
   - Fix: something that was broken now works
   - Breaking change: something that requires user action to continue working
   - Security: security-relevant fix

3. REWRITE in plain language:
   - Write for [audience] — not for engineers reading the code
   - No commit hashes, branch names, or internal ticket numbers in the output
   - Active voice: "You can now..." / "We fixed..." / "We improved..."
   - One sentence per entry for fixes and improvements; 2-3 sentences for new features
   - Link to docs where relevant: "(See [documentation link])"

4. SORT by impact:
   - Breaking changes first (so users see them immediately)
   - New features
   - Improvements
   - Fixes

## Output format

---

## [Version / Release name] — [Date]

### Breaking changes
> Action required before upgrading

- **[Change title]:** [Plain-language description of what changed and what the user must do.] [Migration guide →](#)

### New features
- **[Feature name]:** [What it does and who it's for. What problem it solves.]
- **[Feature name]:** [...]

### Improvements
- [Plain-language description of the improvement and its benefit to the user]
- [...]

### Fixes
- Fixed [description of what was broken and what the correct behaviour now is]
- [...]

---
```

### Continuous release digest (weekly/monthly)

```
Write a [weekly / monthly] product update from this list of shipped changes.

Period: [date range]
Audience: [customers in a product newsletter / developers / enterprise admins]
Tone: [conversational / formal / technical]

Changes shipped this period:
[list or paste git log / PRs]

Format:
- Lead with the most impactful change (1-2 sentences — the hook)
- Group by product area or theme, not by date shipped
- Use "we" language for changes ("We've made X faster..."), "you" for benefits ("You can now...")
- End with a "coming up" section if you have committed roadmap items to tease

Output: a changelog digest ready to paste into an email, in-app notification, or blog post.
Length: [brief (under 200 words) / standard (200-400 words) / detailed (400+ words for major releases)]
```

### Breaking change entry (detailed)

```
Write a breaking change entry for the changelog.

Change: [describe the breaking change in technical terms]
What used to work: [the old behaviour]
What happens now: [the new behaviour]
Why we changed it: [the reason — be honest if it's for technical debt, not just "improvements"]
Affected users: [who is impacted — everyone / only users of X feature / only on X plan]
What they must do: [specific action steps numbered 1, 2, 3]
Deadline: [date the old behaviour is removed / when they must migrate by]
Migration guide: [link to docs]
Support: [where to get help]

Output: a changelog entry that is alarming enough for users to read, but not panic-inducing.
Include: a clearly marked "Action required" header.
Do not: bury the required action in paragraph text.
```

### Changelog quality review

```
Review this changelog for quality and completeness.

[Paste existing changelog entry]

Check against these quality criteria:

COMPLETENESS:
- [ ] All breaking changes listed and marked clearly?
- [ ] Every entry has a plain-language description (no jargon, no commit hashes)?
- [ ] Links to documentation for major new features?
- [ ] Fixes explain what was broken, not just "fixed a bug"?

LANGUAGE:
- [ ] Written for [end users / developers] — not for the internal team?
- [ ] Active voice throughout?
- [ ] Entries sorted by user impact (breaking → new → improvement → fix)?
- [ ] No internal ticket numbers (JIRA-1234) visible to external readers?

BREAKING CHANGES:
- [ ] Clearly separated from other changes?
- [ ] Include specific action the user must take?
- [ ] Include deadline and migration docs link?

For each gap: rewrite the entry correctly.
```

### Semantic versioning guidance

```
Given these changes, recommend the correct semantic version bump.

Current version: [vX.Y.Z]
Changes in this release:
[list the changes]

Semantic versioning rules:
- MAJOR (X): breaking changes — incompatible API change, removed feature, changed behaviour that breaks existing usage
- MINOR (Y): new features — backwards-compatible additions
- PATCH (Z): bug fixes — backwards-compatible fixes only

Recommendation: bump to v[X.Y.Z]
Reason: [which change triggered the bump level]

If MAJOR bump: reminder to update the migration guide and communicate the timeline clearly.
```

## Example

**User:** Here's our git log for the past sprint. Write the changelog for v3.2.0.

```
a1b2c3d feat: workspace members can now export their own data (#445)
d4e5f6a feat(api): add filtering by date range to GET /v1/reports (#441)
g7h8i9j fix: CSV export includes duplicate rows when >1000 records (#438)
k1l2m3n fix: notifications not sent when user is on legacy plan (#436)
o4p5q6r perf: report generation 3x faster for large datasets (#440)
s7t8u9v chore: upgrade lodash to 4.17.21 (#443)
w1x2y3z docs: update API authentication guide (#444)
a4b5c6d BREAKING: /v1/exports now returns 202 Accepted instead of 200 OK for async exports (#439)
```

**Output:**

```markdown
## v3.2.0 — June 2, 2026

### Breaking changes
> Action required: update your integration if you use the Exports API

- **Exports API now returns 202 for async exports:** `POST /v1/exports` previously returned `200 OK` with the export URL. It now returns `202 Accepted` immediately, and you poll `GET /v1/exports/{id}` for status. This allows exports to run asynchronously without blocking your request. Update any code that checks for a `200` status code on export creation. [Migration guide →](https://docs.example.com/guides/exports-migration)

### New features
- **Self-serve data export:** Workspace members can now export their own data from their account settings, without needing an admin to do it on their behalf.
- **Date range filtering in Reports API:** `GET /v1/reports` now accepts `start_date` and `end_date` query parameters to filter results by a custom date range. [See reference →](https://docs.example.com/api/reports)

### Improvements
- Report generation is now 3x faster for large datasets. Reports that previously took 30+ seconds now complete in under 10.

### Fixes
- Fixed a bug where CSV exports included duplicate rows when the export contained more than 1,000 records.
- Fixed an issue where email notifications were not sent to users on legacy plans.
```

---
