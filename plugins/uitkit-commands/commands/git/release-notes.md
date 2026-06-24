---
description: Draft release notes from commits between two refs or since the last tag
argument-hint: "[from-ref] [to-ref]"
---
Parse $ARGUMENTS as up to two git refs separated by a space: `from-ref` and `to-ref`. If two refs are given, use them directly. If one ref is given, treat it as `from-ref` and use `HEAD` as `to-ref`. If no args are given, detect the previous tag with `git describe --tags --abbrev=0` as `from-ref` and `HEAD` as `to-ref`.

Run:
```
git log <from-ref>..<to-ref> --pretty=format:"%H %s" --no-merges
```

Also collect PR/issue references by scanning subjects for `#\d+` and footer lines (`Closes`, `Fixes`, `Refs`).

Classify each commit by its Conventional Commits prefix:
- `feat` → Features
- `fix` → Bug Fixes
- `perf` → Performance
- `refactor` → Internal Changes (omit from external release notes unless significant)
- `docs` → Documentation
- `build` / `ci` → Infrastructure (omit from external release notes)
- `BREAKING CHANGE` footer or `!` suffix → Breaking Changes (always first, always prominent)
- Unclassified → Other Changes

Draft release notes in this structure:

```markdown
## [version] — YYYY-MM-DD

### Breaking Changes
- ...

### Features
- ...

### Bug Fixes
- ...

### Performance
- ...

### Documentation
- ...
```

Rules:
- Rewrite commit subjects into user-facing language: imperative, present tense, no internal jargon
- Group related commits into a single bullet when they address the same feature or fix
- Append `(#N)` PR/issue references at the end of each bullet where available
- Omit `build`, `ci`, and pure `chore` commits unless they affect the public interface
- If `to-ref` is HEAD and not yet tagged, use `[Unreleased]` as the version placeholder

Output the draft only. Do not write to any file or create a tag.
