# Changelog Generator Routine

Auto-generates changelogs from git history — categorized by type with breaking change detection.

---

## Schedule

On every release tag or manually before releases.

---

## Steps

1. **Get commits.** Collect all commits since last tag/release.
2. **Categorize.** Group by conventional commit type: feat, fix, chore, docs, refactor, perf, test.
3. **Detect breaking changes.** Flag commits with `BREAKING CHANGE` footer or `!` suffix.
4. **Generate changelog.** Format as markdown with sections: Features, Fixes, Performance, Breaking Changes.
5. **Version bump.** Suggest semver bump based on changes (breaking=major, feat=minor, fix=patch).
6. **Update CHANGELOG.md.** Prepend new section to existing changelog file.

---

## Configuration

```yaml
schedule: "on release tag"
inputs:
  - git log since last tag
  - conventional commit messages
output:
  - CHANGELOG.md (updated)
  - Release notes (GitHub release body)
  - Suggested version bump
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
