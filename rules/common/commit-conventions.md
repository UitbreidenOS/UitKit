# Commit Conventions Rules

## Apply to
All git commits across every repository.

## Rules

1. **Follow Conventional Commits format** — `<type>(<scope>): <subject>`. Type is required; scope is optional but recommended. Subject is imperative, present tense, lowercase, no trailing period.

2. **Valid types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`** — `feat` is a user-facing feature, `fix` is a user-facing bug fix. Tooling, dependency, and config changes are `chore`. Don't invent types.

3. **Subject line under 72 characters** — git log, GitHub, and most tools truncate at 72. If you can't describe the change in 72 characters, the commit is probably too large.

4. **Use the body to explain why, not what** — the diff shows what changed. The body explains the motivation, the constraint, or the tradeoff. Omit the body when the subject is self-explanatory.

5. **Scope should name the module, package, or domain** — `feat(auth): add refresh token rotation` not `feat(code): add thing`. Scopes make changelogs and `git log --grep` useful.

6. **Breaking changes use `!` and a `BREAKING CHANGE:` footer** — `feat(api)!: remove v1 endpoints` in the subject, and a `BREAKING CHANGE: v1 endpoints removed, migrate to v2` footer in the body. This triggers a major version bump in semantic-release.

7. **One logical change per commit** — don't bundle a feature, two bug fixes, and a dependency bump. If the commit message requires "and", it should be split.

8. **Never commit with `--no-verify`** — pre-commit hooks exist to catch issues. Bypassing them means pushing code that fails linting, tests, or formatting checks. Fix the issue instead.

9. **`fix:` commits reference the issue or ticket** — `fix(payments): prevent double-charge on retry (#1234)`. The reference links the commit to context in the issue tracker.

10. **`revert:` commits reference the original commit SHA** — `revert: feat(auth): add refresh token rotation` with body `Reverts commit abc1234`. Allows bisect to work correctly.

11. **Don't use past tense in the subject** — `feat: add user export` not `feat: added user export`. The subject completes the sentence "If applied, this commit will... add user export."

12. **Squash fixup commits before merging** — `fix typo`, `wip`, `address review comments` are noise in the permanent history. Squash them into the commit they belong to before the PR merges.

13. **Merge commits should not contain code changes** — a merge commit that also fixes a conflict in logic is a hidden change. Resolve conflicts in a separate commit before merging.

14. **Tag releases using semantic versioning** — `v1.2.3`, not `1.2.3`, not `release-jan-24`. Tooling (GitHub releases, semantic-release, Helm charts) expects the `v` prefix.

15. **Enforce conventions via tooling** — use `commitlint` with `@commitlint/config-conventional` in CI. Human review of commit messages doesn't scale; automated enforcement does.


---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
