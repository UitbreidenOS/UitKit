> 🇫🇷 This is the French translation. [English version](../changelog.md).

# Prompt : Générer un Changelog

Utilisez ce prompt pour générer un changelog orienté utilisateur depuis l'historique git ou une liste de changements.

---

## Depuis git log

```
Generate a user-facing changelog for version [X.Y.Z].

Git log since last release:
[paste: git log v[prev-version]..HEAD --oneline]

Rules:
- Write for users, not developers — explain impact, not implementation
- Group by: New Features / Improvements / Bug Fixes / Breaking Changes
- Omit: chore commits, dependency bumps, internal refactors with no user impact
- Breaking changes section must be first if it exists
- Each entry: one sentence, active voice, present tense ("Adds X", "Fixes Y", "Removes Z")
- If a commit is unclear, ask me rather than guess

Format:
## [X.Y.Z] — [YYYY-MM-DD]

### Breaking Changes
- ...

### New Features
- ...

### Improvements
- ...

### Bug Fixes
- ...
```

---

## Depuis une liste de changements

```
Generate a user-facing changelog entry for these changes:

[paste bullet list of what changed]

Target audience: [developers using our API / end users of the web app / etc.]

Rules:
- User impact first — "You can now X" not "We added Y"
- Group related changes under one entry
- One sentence per entry
- No technical jargon unless the audience is technical
```

---

## Format Keep a Changelog

```
Generate a changelog entry following the Keep a Changelog format (keepachangelog.com).

Changes:
[describe or paste git log]

Version: [X.Y.Z]
Date: [YYYY-MM-DD]

Use these exact section headers where applicable:
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
```

---
