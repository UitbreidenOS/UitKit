---
name: "dependency-auditor"
description: "Dependency auditing: identify outdated packages, CVE vulnerabilities, licence conflicts, and unused dependencies — npm, pip, cargo, and Go modules"
---

# Dependency Auditor Skill

## When to activate
- Running a security audit before a production release
- Identifying CVE vulnerabilities in direct and transitive dependencies
- Checking licence compliance across all packages
- Cleaning up unused or duplicate dependencies
- Evaluating whether to upgrade a major version of a core dependency
- Setting up automated dependency management (Renovate, Dependabot)

## When NOT to use
- Code-level security review — use the security-reviewer agent
- Infrastructure dependency review (Terraform modules, container base images) — different tooling
- Runtime performance analysis — use the performance-profiler skill

## Instructions

### Security vulnerability audit

```
Audit dependencies for security vulnerabilities.

Project: [Node.js / Python / Rust / Go / Java / Ruby]
Environment: [production / staging / development]
Risk tolerance: [high — fix all CVEs / medium — fix critical + high only]

Node.js / npm:
  npm audit                              # Shows CVEs with severity
  npm audit --audit-level=high           # Exit non-zero only on high/critical
  npm audit fix                          # Auto-fix non-breaking upgrades
  npm audit fix --force                  # Fix breaking upgrades (test thoroughly)

Python / pip:
  pip install pip-audit
  pip-audit                              # Checks against PyPI advisory database
  pip-audit --fix                        # Auto-upgrade vulnerable packages
  pip-audit -r requirements.txt          # Audit a specific requirements file

Rust / cargo:
  cargo install cargo-audit
  cargo audit                            # Checks RustSec advisory database

Go modules:
  govulncheck ./...                      # Official Go vulnerability checker

Output interpretation:
- CRITICAL: fix immediately, block deployment
- HIGH: fix within 24-48 hours, do not ship to new customers with this
- MEDIUM: fix in current sprint
- LOW: fix in next maintenance window

Generate: prioritised CVE fix list with exact upgrade commands.
```

### Licence compliance check

```
Check dependency licences for compliance.

Project: [Node.js / Python / other]
Licence policy: [cannot use: GPL, AGPL / allowed: MIT, Apache 2.0, BSD, ISC / unknown: flag for review]
Use case: [SaaS (copyleft risk) / internal tool / open source]

Node.js:
  npx license-checker --summary          # List all licences by package
  npx license-checker --onlyAllow 'MIT;ISC;Apache-2.0;BSD-2-Clause;BSD-3-Clause'
  npx license-checker --excludePackages '[package-name]'  # Whitelist exceptions

Python:
  pip install pip-licenses
  pip-licenses                           # Table of all licences
  pip-licenses --format=json > licences.json
  pip-licenses --allow-only 'MIT;Apache Software License;BSD'

Licence risk categories:
- Permissive (safe for SaaS): MIT, ISC, Apache 2.0, BSD variants, CC0
- Weak copyleft (review required): LGPL, MPL — safe if not modifying the lib
- Strong copyleft (legal review required): GPL, AGPL — may require open-sourcing your code
- Unknown: flag for legal review before shipping

Output: list of non-compliant or unknown licences with package name, current licence, and recommended action (replace / get exception / is OK).
```

### Outdated dependency report

```
Identify outdated dependencies and plan upgrades.

Project type: [specify]
Strategy: [upgrade all / upgrade security-critical only / upgrade major versions with planning]

Node.js:
  npm outdated                           # Shows current vs wanted vs latest
  npx npm-check-updates                  # Shows all available upgrades
  npx npm-check-updates -u               # Updates package.json (run npm install after)
  npx npm-check-updates --target minor   # Only minor upgrades (safer)

Python:
  pip list --outdated                    # Shows all outdated packages
  pip install pip-review
  pip-review --local --interactive       # Interactive upgrade chooser

Go:
  go list -m -u all                      # Show available updates
  go get -u ./...                        # Update all dependencies

Upgrade strategy (safe order):
1. Patch upgrades (X.Y.Z → X.Y.Z+1): auto-upgrade, low risk
2. Minor upgrades (X.Y → X.Y+1): upgrade, run tests
3. Major upgrades (X → X+1): plan individually, check breaking changes, update code

For each major upgrade:
- Read the CHANGELOG or migration guide
- Check for breaking API changes in code you use
- Update in a feature branch, run full test suite

Generate: grouped upgrade plan (patch auto / minor safe / major requires planning).
```

### Unused dependency cleanup

```
Find and remove unused dependencies.

Language: [Node.js / Python / Go / Rust]

Node.js:
  npx depcheck                           # Finds unused + missing deps
  npx unimported                         # Finds unused imports (more thorough)

  Common false positives to verify manually:
  - CLI tools referenced in scripts (not code)
  - Type packages (@types/*) — check if base package is used
  - Peer dependencies — required by other packages, not your code
  - Build tools (webpack, esbuild) — used in config, not imports

Python:
  pip install deptry
  deptry .                               # Finds unused, missing, transitive deps

Go:
  go mod tidy                            # Removes unused modules automatically
  go mod why [module]                    # Explains why a module is in go.sum

After removing:
□ Run full test suite
□ Run build
□ Check runtime behaviour (some deps are loaded dynamically)

Output: list of safe-to-remove packages with confidence level (high / verify manually).
```

### Automated dependency management

```
Set up automated dependency updates for [project].

Current: [manual / Dependabot / Renovate / none]
Goal: [security patches auto-merged / all upgrades reviewed / schedule-based]
CI/CD: [GitHub Actions / GitLab CI / CircleCI]

Option 1 — Dependabot (GitHub-native, simpler):
.github/dependabot.yml:
  version: 2
  updates:
    - package-ecosystem: "npm"      # or pip, cargo, gomod
      directory: "/"
      schedule:
        interval: "weekly"          # daily | weekly | monthly
      open-pull-requests-limit: 5
      groups:
        devDependencies:
          patterns: ["*"]
          dependency-type: "development"
      ignore:
        - dependency-name: "[package]"  # Pin packages you manage manually

Option 2 — Renovate (more configurable, runs in CI):
renovate.json:
  {
    "$schema": "https://docs.renovatebot.com/renovate-schema.json",
    "extends": ["config:base"],
    "packageRules": [
      {
        "matchUpdateTypes": ["patch"],
        "automerge": true              # Auto-merge patch upgrades
      },
      {
        "matchDepTypes": ["devDependencies"],
        "automerge": true
      }
    ],
    "schedule": ["before 9am on Monday"],
    "prConcurrentLimit": 3
  }

Auto-merge safety gates:
□ CI must pass before merge
□ Patch-only auto-merge (never major)
□ Dev dependencies: auto-merge if CI passes
□ Production dependencies: require human review

Set up the config for my project and CI system.
```

## Example

**User:** Our Node.js API hasn't had a dependency audit in 8 months. What's the fastest way to assess risk and fix critical issues?

**Claude's triage plan:**

**Step 1 — Run in 5 minutes:**
```bash
npm audit --json > audit.json
cat audit.json | jq '.vulnerabilities | to_entries[] | select(.value.severity == "critical" or .value.severity == "high") | {name: .key, severity: .value.severity, fixAvailable: .value.fixAvailable}'
```

**Step 2 — Auto-fix what's safe:**
```bash
npm audit fix       # Fixes vulnerabilities with compatible upgrades
```

**Step 3 — Check what's left:**
Critical/high CVEs that `npm audit fix` didn't resolve typically require major version upgrades. Check each:
- Is there a patched version? → Upgrade + test
- Is it in a dev dependency? → Lower risk, fix next sprint
- Is there no fix? → Check if the vulnerable code path is reachable in your app

**Step 4 — Prevent recurrence:**
Add to CI (`package.json` scripts):
```json
"scripts": {
  "audit:ci": "npm audit --audit-level=high"
}
```
Add `npm run audit:ci` to your CI pipeline — blocks deploy on new critical/high CVEs.

**Timeline:** 8 months without audit → expect 3-8 medium/high CVEs, 0-2 critical. Most fixable in a single PR.

---
