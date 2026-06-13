# Dependency Management Rules

## Apply to
All projects — any language, any package manager (`npm`, `pip`, `cargo`, `go mod`, `maven`, `gem`).

## Rules

1. **Pin direct dependencies to exact or range-locked versions** — `"express": "4.18.2"` not `"express": "*"`. For libraries, `"~4.18.0"` (patch-only) is acceptable. Unpinned transitive dependencies are handled by lockfiles.

2. **Commit lockfiles for applications, not for libraries** — `package-lock.json`, `Cargo.lock`, `poetry.lock`, `go.sum` belong in source control for deployed applications. Library lockfiles constrain consumers unnecessarily.

3. **Run `npm audit` / `pip-audit` / `cargo audit` in CI** — fail the build on high or critical severity CVEs. Treat a vulnerable dependency like a failing test.

4. **Separate runtime dependencies from dev dependencies** — `devDependencies` in npm, `dev = true` in Poetry, `[dev-dependencies]` in Cargo. Dev tools must not ship in production images.

5. **Review every new dependency before adding it** — check: last commit date, weekly downloads, open CVEs, license compatibility. A dependency is a maintenance commitment. Reject abandoned or under-maintained packages for production use.

6. **Prefer the standard library** — before adding a dependency, check if the language's stdlib covers the need. A 5-line stdlib solution beats a 500 KB transitive dependency graph for date formatting.

7. **Update dependencies on a schedule, not only when broken** — weekly or fortnightly automated PRs (Dependabot, Renovate) with passing CI are routine. Emergency updates under pressure with no test coverage are dangerous.

8. **License check in CI** — use `license-checker`, `pip-licenses`, or `cargo-deny` to enforce license allowlists. Shipping GPL code in a proprietary product is a legal risk, not a technical one.

9. **Remove unused dependencies** — `depcheck` (Node), `pip-autoremove`, `cargo machete`. Unused packages inflate image size, increase attack surface, and complicate audits.

10. **Isolate major version upgrades as their own PR** — a major version bump is a breaking change. Bundling it with feature work makes root-cause analysis impossible when something breaks.

11. **Vendor dependencies for air-gapped or highly regulated environments** — `go mod vendor`, npm `--prefer-offline` with a local registry, or a private Artifactory/Nexus proxy. Relying on public registries at runtime is a supply chain risk.

12. **Verify package integrity** — use `npm ci` over `npm install` in CI (lockfile-strict). In Python, verify hashes with `pip install --require-hashes`. In Go, `go.sum` provides this automatically.

13. **Never install packages with `sudo` in application environments** — use user-space virtual environments (Python `venv`, Node project-local `node_modules`). Global installs pollute the system and conflict across projects.

14. **Watch for dependency confusion attacks** — internal package names must not collide with public registry names. Use scoped packages (`@myorg/internal-lib`) or private registry scoping to prevent namespace squatting attacks.

15. **Document why a non-obvious dependency exists** — a `# needed for X because stdlib doesn't support Y` comment in `requirements.txt` or a PR description note prevents future developers from removing a dependency that looks unused.


---
