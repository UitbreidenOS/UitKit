---
description: Generate a changelog entry for commits since the last tag or a given ref
argument-hint: "[from-ref]"
---
Determine the range:
- If $ARGUMENTS is provided, use `git log $ARGUMENTS...HEAD`
- Otherwise run `git describe --tags --abbrev=0` to find the last tag, then use `git log <last-tag>...HEAD`
- If no tags exist, use the full history: `git log HEAD`

Also run `git log <range> --oneline` and `git diff <range> --stat` for structure.

Produce a changelog entry in Keep a Changelog format (https://keepachangelog.com):

```markdown
## [Unreleased] — <today's date YYYY-MM-DD>

### Added
- <new features and capabilities>

### Changed
- <modifications to existing behavior>

### Deprecated
- <features flagged for future removal>

### Removed
- <deleted features or APIs>

### Fixed
- <bug fixes>

### Security
- <vulnerability patches>
```

Rules:
- Omit sections that have no entries
- Each entry is one line, written for an end-user or API consumer — not for internal dev
- Group related commits into a single entry; do not list every commit individually
- Reference PRs or issues in parentheses when commit messages mention them: `(#123)`
- Entries start with a capital letter, no trailing period
- Ignore chore/style/refactor commits unless they affect public-facing behavior

Output only the markdown block.
