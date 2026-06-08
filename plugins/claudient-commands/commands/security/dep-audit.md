---
description: Audit project dependencies for known CVEs and supply-chain risks
argument-hint: "[package-file or ecosystem]"
---
Audit the dependencies in this project for known vulnerabilities and supply-chain risks.

Target: $ARGUMENTS (auto-detect if blank — scan repo root and subdirectories for manifest files).

1. **Detect ecosystem(s)**: Identify all present lockfiles and manifests:
   - Node: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - Python: `requirements*.txt`, `Pipfile.lock`, `pyproject.toml`, `poetry.lock`
   - Go: `go.mod`, `go.sum`
   - Rust: `Cargo.toml`, `Cargo.lock`
   - Java/Kotlin: `pom.xml`, `build.gradle`
   - Ruby: `Gemfile.lock`

2. **Run native audit tooling** where available:
   - `npm audit --json` / `yarn audit` / `pnpm audit`
   - `pip-audit` or `safety check`
   - `cargo audit`
   - `govulncheck ./...`
   - `bundle audit`
   Capture output and parse results.

3. **Identify CVEs**: For each vulnerable package report:
   - Package name and current version
   - CVE ID(s) and CVSS score
   - Vulnerability description (one sentence)
   - Fixed version (if available)
   - Whether this is a direct or transitive dependency
   - Whether the vulnerable code path is reachable from the application

4. **Supply-chain signals**: Flag any package that shows:
   - Unpublished or yanked versions pinned in lockfile
   - Packages with zero downloads, single maintainer, or very recent owner transfers
   - Dependency confusion risk (internal package names that exist on public registries)
   - Packages with install scripts (`preinstall`, `postinstall`) that execute arbitrary code
   - Wildcard version pins (`*`, `>=0.0.0`) accepting any future version

5. **Prioritize**: Rank by reachability > CVSS score > direct vs transitive.

6. **Output**:
   ```
   ## Dependency Audit

   ### Critical / High CVEs
   [package@version] CVE-XXXX-XXXXX (CVSS N.N) — description
   Fix: upgrade to X.Y.Z
   Reachable: yes/no/unknown

   ### Supply-Chain Flags
   - [package]: reason

   ### Upgrade Commands
   Paste-ready commands to fix all critical/high issues.
   ```

If audit tooling is unavailable, cross-reference versions against known CVE databases from training data and note the limitation. Do not modify files or run install commands.
