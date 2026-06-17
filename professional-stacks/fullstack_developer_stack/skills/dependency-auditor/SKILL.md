# Dependency Auditor

## When to activate

Invoke this skill when you need to:
- Scan project dependencies for known security vulnerabilities (CVEs)
- Identify outdated or stale packages in the dependency tree
- Detect license incompatibilities or problematic licenses
- Reduce dependency bloat and redundant transitive dependencies
- Verify dependency versions are locked and reproducible
- Check for supply-chain risks (unmaintained packages, deprecated modules)
- Analyze the health of critical dependencies (activity, maintainer count, issue backlog)
- Generate quarterly dependency audit reports with upgrade recommendations

## When NOT to use

Do not use this skill for:
- General package management or routine updates (use native package managers: npm, pip, cargo)
- Debugging broken imports or runtime errors (use code-review or debugging workflow)
- Performance optimization unrelated to dependency size (use profiler)
- Choosing between similar packages without security or maintenance concerns (use architecture review)
- Daily/weekly checks (run annually or when drift becomes concerning; use CI/pre-commit for continuous scanning)

## Instructions

### Core Audit Steps

1. **Identify the package manager and lock file**
   - Detect ecosystem: npm/yarn (JavaScript), pip/poetry (Python), cargo (Rust), bundler (Ruby), composer (PHP)
   - Locate lock file: `package-lock.json`, `yarn.lock`, `poetry.lock`, `Cargo.lock`, `Gemfile.lock`, `composer.lock`
   - Verify lock file exists and is reasonably recent (not stale >6 months)

2. **Run security vulnerability scan**
   - npm: `npm audit --audit-level=moderate` for all vulnerabilities; optionally `npm audit fix` with caution
   - Python: `pip-audit` (recommended), `safety check`, or `bandit` for code-level risks
   - Cargo: `cargo audit`
   - Ruby: `bundle audit`
   - Report CVEs by severity (critical, high, moderate, low), include CVE ID and remediation path

3. **Check for outdated dependencies**
   - npm: `npm outdated` to show major/minor/patch version gaps
   - Python: `pip list --outdated`
   - Cargo: `cargo outdated`
   - Categorize by risk: patch-safe (low risk) vs. minor (medium) vs. major (breaking changes)

4. **Analyze transitive dependencies**
   - Identify which direct dependencies pull in problematic transitive dependencies
   - Use `npm ls <package>` or equivalents to trace dependency paths
   - Flag duplicate versions of the same package (e.g., two versions of lodash in tree)
   - Recommend consolidation where possible

5. **License compliance check**
   - npm: `npm ls --depth=0` with manual review; use `npx license-checker` for full tree
   - Python: `pip-licenses`
   - Identify restrictive licenses: GPL, AGPL, SSPL that may infect your codebase
   - Check for incompatibilities with your project's license
   - Flag copyleft licenses or unusual restrictions

6. **Supply-chain risk assessment**
   - Check package registry metadata: unmaintained status, maintainer count, last publish date
   - npm: `npm view <package>` to inspect time, dist-tags, repository
   - Look for unusual patterns: recent ownership transfer, sudden spike in releases, abandoned projects
   - Check GitHub/GitLab repo: last commit date, issue backlog, maintainer activity
   - Flag packages with fewer than 2 active maintainers for critical dependencies

7. **Dependency size and bloat analysis**
   - npm: `npm ls --all` (full tree) vs. `npm ls --depth=0` (direct only)
   - Check bundle impact: `npm run bundle-size` or equivalent
   - Identify unnecessarily large packages (e.g., moment.js vs. date-fns)
   - Find unused dependencies with tools like `depcheck` or `npm ls --all` unused analysis
   - Recommend lighter alternatives where applicable

8. **Lock file integrity**
   - Ensure lock file is committed and up-to-date with package.json
   - Warn if lock file is stale (> 30 days behind package.json changes)
   - Check for conflicts or manual edits in lock file

### Tool Commands by Ecosystem

**Node.js / npm:**
```bash
npm audit --audit-level=moderate
npm audit fix  # Apply safe fixes (use with caution)
npm outdated
npm ls --depth=0  # Direct dependencies only
npm ls <package>  # Trace specific package path
npm view <package>  # Check metadata, maintainers, last publish
npx depcheck  # Find unused dependencies
npx license-checker  # List all licenses in tree
npm ls --all | grep "deduped"  # Find duplication
```

**Python / pip:**
```bash
pip-audit  # Security audit
pip list --outdated
pip show <package>  # Check version, dependencies, maintainer
pipdeptree  # Visualize full dependency tree
pip-licenses  # Check all licenses
```

**Rust / Cargo:**
```bash
cargo audit
cargo outdated
cargo tree  # Visualize dependency tree
cargo metadata --format-version 1  # Full dependency graph
```

**Ruby / Bundler:**
```bash
bundle audit
bundle outdated
bundle viz  # Visualize dependency graph (requires graphviz)
```

### Reporting Structure

Present audit results in this prioritized order:

1. **Critical Issues** (must fix immediately)
   - CVEs with CVSS >= 7.0 or exploitable vulnerabilities
   - Unmaintained packages in critical paths (auth, payments, data handling)
   - Breaking version mismatches that prevent installation
   
2. **Actionable Upgrades** (schedule for next sprint)
   - Security patches and minor updates that fix known issues
   - Deprecated packages with recommended replacements
   - License incompatibilities
   
3. **Transitive Bloat** (nice to have, improves tree health)
   - Unused dependencies
   - Redundant versions that should consolidate
   - Oversized packages with lighter alternatives
   
4. **Supply-Chain Health** (informational)
   - Packages with few maintainers
   - Deprecated modules still in use
   - Unusual activity patterns
   
5. **Recommendations & Next Steps**
   - Timeline for critical fixes
   - Breaking changes to plan for
   - Long-term dependency health strategy

### Output Format

```
# Dependency Audit Report — [Project Name] — [Date]

## Summary
- Total dependencies (direct): [X]
- Total dependencies (with transitive): [X]
- Outdated packages: [X] (>1 version behind)
- Security vulnerabilities: [X] (critical: Y, high: Z)
- Deprecated packages: [X]
- License conflicts: [X]

## Critical — MUST FIX NOW

### Security Vulnerabilities
- **[Package] [current-version] → [safe-version]**
  - CVE-2024-XXXXX: [Description]
  - CVSS Score: [X.X]
  - Path: [dependency chain]
  - Action: npm update [package] or npm install [package]@[version]

### Unmaintained or Abandoned
- **[Package] [current-version]**
  - Last update: [date]
  - Recommended alternative: [package]
  - Action: Plan migration in next sprint

## High — Schedule for Next Sprint

### Major Version Upgrades
- **[Package] [current] → [next-major]**
  - Breaking changes: [summary]
  - Migration effort: [estimated hours]
  - Benefit: [security/features/performance]

### Deprecated Packages
- **[Package]** is deprecated and no longer maintained
  - Recommended replacement: [package]
  - Migration notes: [key changes]

## Medium — Optimize for Stability

### Transitive Dependencies
- **Duplicate [Package]**: Versions [v1, v2] in tree
  - Consolidate to: [recommended version]
  - Effort: [low/medium/high]

### Unused Dependencies
- **[Package]**: Found in node_modules but not imported
  - Action: Remove from package.json and run npm prune

### Bloat Reduction
- **[Package]**: [Size] KB, consider lightweight alternative [package]
  - Size savings: [estimate]

## License Audit

- **Copyleft licenses detected**:
  - [Package]: GPL-3.0 (incompatible with [your-license])
  - [Package]: AGPL-3.0 (requires disclosure)
- **Recommended action**: [Replace or relicense]

## Supply-Chain Health

- **Maintainer Status**:
  - [Package]: 1 active maintainer (consider [alternative])
  - [Package]: 0 commits in 2+ years (consider [alternative])

## Effort Estimate

- Critical security fixes: [X hours] — Schedule for [date]
- Major version upgrades: [X hours] — Schedule for next sprint
- Optional optimizations: [X hours] — Backlog
- **Total recommended effort**: [X hours over next quarter]

## Upgrade Strategy

### Phase 1: Critical (This week)
1. npm audit fix --force (if safe)
2. Manual patching of high-severity CVEs
3. Verify tests pass

### Phase 2: High Priority (Next 2 weeks)
1. Plan breaking changes for [Package]
2. Create feature branch for major upgrades
3. Update tests for new API versions

### Phase 3: Medium Priority (Next quarter)
1. Remove unused dependencies
2. Consolidate duplicate versions
3. Consider lightweight alternatives for bloat

## Next Steps
- [ ] Apply critical security patches (deadline: [date])
- [ ] Schedule major version upgrade work
- [ ] Investigate [Package] alternative before next release
- [ ] Reduce bundle size by removing [Package]
- [ ] Review and approve license compatibility
```

## Example

**Scenario**: A Node.js fullstack app with 42 npm dependencies. Developer asks to audit for security and outdated packages.

**Steps Executed**:

1. Run `npm audit` — Reports 3 critical CVEs in transitive dependency chain
2. Run `npm outdated` — Shows 8 packages are 2+ major versions behind
3. Run `npm ls lodash` — Discovers two versions of lodash (3.10.1 and 4.17.21) due to conflicting peer dependencies
4. Run `npx license-checker` — Flags GPL-licensed package (incompatible with MIT project)
5. Run `npx depcheck` — Identifies `leftpad` in node_modules but not in package.json
6. Check npm registry for `express` — Last update 2 months ago, 8 active maintainers

**Report Output** (abbreviated):

```
# Dependency Audit Report — MyApp — 2026-06-13

## Summary
- Total dependencies (direct): 15
- Total dependencies (with transitive): 42
- Outdated packages: 8
- Security vulnerabilities: 3 critical
- Deprecated packages: 1
- License conflicts: 1

## Critical — MUST FIX NOW

### Security Vulnerabilities
- **lodash 3.10.1 → 4.17.21**
  - CVE-2021-23337: ReDoS vulnerability in template syntax
  - CVSS Score: 7.5
  - Path: app-utils → lodash@3.10.1
  - Action: npm install lodash@4.17.21

- **express 4.16.4 → 4.18.2**
  - CVE-2022-24999: Prototype pollution via query string
  - CVSS Score: 8.2
  - Path: direct dependency
  - Action: npm install express@latest

## High — Schedule for Next Sprint

### Major Version Upgrades
- **mongoose 5.x → 7.x**
  - Breaking changes: Changed query helpers API, model.findByIdAndUpdate() signature
  - Migration effort: 4-6 hours
  - Benefit: Security fixes, MongoDB 5.0+ support

## Medium — Optimize for Stability

### Transitive Dependencies
- **Duplicate lodash**: Versions 3.10.1 and 4.17.21 in tree
  - Consolidate to: 4.17.21
  - Effort: low (update peer dependencies)

### Unused Dependencies
- **leftpad**: 2.5 KB, not imported anywhere
  - Action: Remove from package.json

## License Audit
- **gpl-package 1.0.0**: GPL-3.0 (incompatible with MIT)
  - Recommended action: Replace with [mit-licensed-alternative]

## Effort Estimate
- Critical security fixes: 2 hours
- Major version upgrades: 6 hours
- Total recommended: 8 hours over next 2 weeks

## Next Steps
- [x] Apply critical security patches (deadline: 2026-06-17)
- [ ] Plan mongoose 5 → 7 migration
- [ ] Replace GPL package before next release
- [ ] Remove unused leftpad dependency
```

**Follow-up**:
- Create GitHub issue to track major version upgrades
- Pin critical security patches in next release
- Schedule GPL license replacement in next sprint
