# DEPLOYMENT_PLAN.md — Claudient v1.10.1 Deployment Guide

**Deployment Target:** NPM Registry + GitHub Releases + Claude Code Marketplace  
**Expected Duration:** 30 minutes  
**Date Prepared:** 2026-06-22  
**Version:** 1.10.1

---

## Deployment Overview

This document provides a step-by-step deployment procedure for Claudient v1.10.1, including pre-checks, deployment phases, rollback procedures, success criteria, and communication checkpoints.

### Deployment Strategy

- **Pattern:** Blue-Green (Zero-downtime) with Feature Flags  
- **Scope:** NPM package + .claude-plugin marketplace + GitHub Release  
- **Audience:** Claude Code users, developers, enterprise customers  
- **Risk Level:** Low (backwards-compatible release, feature enrichment only)  

---

## Pre-Deployment Checklist (T-60 minutes)

### 1. Code & Quality Validation (T-60min)

```bash
# From: /Users/tushar/Desktop/Claudient

# 1.1 Verify git status is clean
git status
# Expected: working tree clean (except .kimchi/, untracked test scripts)

# 1.2 Confirm current branch is main
git branch --show-current
# Expected: main

# 1.3 Run all validation checks
npm run validate              # frontmatter + manifest validation
npm run validate:catalog      # catalog structure
npm run validate:stacks       # workspace stacks
npm run validate:freshness    # check if dates are current
npm run test                  # CLI smoke tests
npm run test:regression       # backward-compatibility tests

# 1.4 Build all artifacts
npm run build-index           # index.json
npm run build-plugins         # .claude-plugin/marketplace.json + plugins/
npm run build-catalog         # catalog structure
npm run validate:catalog      # re-validate post-build
```

**Success Criteria:**
- All validation commands exit with code 0
- No errors in CI logs
- build-plugins completes without warnings
- No duplicate plugin IDs in marketplace.json

**Duration:** 8-10 minutes

---

## Phase 1: Pre-Deployment Verification (T-30 to T-25 minutes)

### Checkpoint 1A: Artifact Verification

```bash
# 1A.1 Verify index.json is valid and current
ls -lh index.json
node -e "console.log(JSON.parse(require('fs').readFileSync('index.json')).timestamp)"
# Expected: timestamp within last 1 hour

# 1A.2 Verify .claude-plugin/marketplace.json
ls -lh .claude-plugin/marketplace.json
node -e "const m = JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json')); console.log('Plugins:', m.plugins?.length, 'Version:', m.version)"
# Expected: ~400+ plugins, version matches package.json

# 1A.3 Verify no broken symlinks or invalid paths in plugins/
find plugins/ -type l -xtype l 2>/dev/null | wc -l
# Expected: 0 broken links

# 1A.4 Verify package.json version
grep '"version"' package.json
# Expected: "version": "1.10.1"

# 1A.5 Verify README.md is updated with current feature counts
grep -E "400\+|182\+|61|42|41" README.md | head -5
# Expected: All feature counts present and correct
```

**Duration:** 3 minutes  
**Owner:** Release Lead  
**Escalation:** If any check fails, roll back to T-60 and re-run build-*.

---

### Checkpoint 1B: Git History & Tags

```bash
# 1B.1 Verify latest commit
git log -1 --oneline
# Expected: (should be recent feature/fix, not older than 2 days)

# 1B.2 Check if v1.10.1 tag exists
git tag -l | grep v1.10.1
# Expected: (if exists, verify it's on current HEAD; if not, proceed to Phase 2)

# 1B.3 Verify main branch is up to date with origin
git fetch origin main
git log --oneline -1 origin/main
git log --oneline -1 HEAD
# Expected: same commit hash

# 1B.4 Ensure no uncommitted changes
git status --porcelain
# Expected: only .kimchi/, audit scripts, and feature-inventory.txt (all untracked)
```

**Duration:** 2 minutes  
**Owner:** Git Lead  
**Escalation:** If HEAD != origin/main, rebase and re-run CI.

---

## Phase 2: Tag & Release (T-25 to T-15 minutes)

### Step 2.1: Create Git Tag

```bash
# 2.1.1 Create annotated tag
git tag -a v1.10.1 \
  -m "Claudient v1.10.1 Release

- Complete implementation of 3 missing features with full ecosystem
- Enriched 61 showcase features with install commands, steps, related CLI
- Enterprise features, observability, community support
- Full translations to FR, DE, NL, ES
- See CHANGELOG.md for full details"

# 2.1.2 Verify tag was created
git tag -l v1.10.1
git show v1.10.1 | head -20

# 2.1.3 Push tag to origin
git push origin v1.10.1

# 2.1.4 Verify tag exists on GitHub
# (Manual: check https://github.com/UitbreidenOS/Claudient/releases)
```

**Duration:** 3 minutes  
**Owner:** Release Lead  
**Communication:** Announce tag creation in Slack #releases channel.

---

### Step 2.2: Generate CHANGELOG & Release Notes

```bash
# 2.2.1 Generate changelog (if not already done)
npm run changelog

# 2.2.2 Verify CHANGELOG.md is updated
head -30 CHANGELOG.md
# Expected: v1.10.1 entry at top with date and all features

# 2.2.3 Stage changelog if updated
git add CHANGELOG.md
git commit -m "chore: update changelog for v1.10.1" || echo "Already committed"

# 2.2.4 Push changelog commit
git push origin main
```

**Duration:** 2 minutes  
**Owner:** Docs Lead

---

### Step 2.3: Create GitHub Release

```bash
# 2.3.1 Create GitHub release using gh CLI
gh release create v1.10.1 \
  --title "Claudient v1.10.1 — Feature Enrichment & Enterprise Ready" \
  --target main \
  --notes-file CHANGELOG.md

# 2.3.2 Verify release was created
gh release view v1.10.1

# 2.3.3 Mark as stable (not pre-release)
# (Already set by default; if needed: gh release edit v1.10.1 --draft=false)

# 2.3.4 Verify release on GitHub
# (Manual: https://github.com/UitbreidenOS/Claudient/releases/tag/v1.10.1)
```

**Duration:** 2 minutes  
**Owner:** Release Lead  
**Communication:** Post release link in Slack #releases and social channels (X, LinkedIn).

---

## Phase 3: NPM Package Deployment (T-15 to T-8 minutes)

### Step 3.1: Pre-Publish Audit

```bash
# 3.1.1 Verify npm login is active
npm whoami
# Expected: (your npm username)

# 3.1.2 Verify .npmignore does not exclude essential files
cat .npmignore || echo "No .npmignore; using files field in package.json"

# 3.1.3 Verify files field in package.json contains all needed dirs
node -e "console.log(JSON.parse(require('fs').readFileSync('package.json')).files.join('\n'))"
# Expected: skills/, agents/, hooks/, rules/, workflows/, plugins/, etc.

# 3.1.4 Dry-run publish to verify package contents
npm pack --dry-run
# Expected: see all files that would be included (no errors)

# 3.1.5 Create a local tarball and inspect
npm pack
ls -lh claudient-1.10.1.tgz
tar -tzf claudient-1.10.1.tgz | head -20
# Expected: proper structure (package/skills/, package/agents/, etc.)
```

**Duration:** 3 minutes  
**Owner:** NPM Lead  
**Escalation:** If files are missing, update package.json "files" field and re-run checks.

---

### Step 3.2: Publish to NPM

```bash
# 3.2.1 Publish to npm (production)
npm publish

# Expected output:
# npm notice publishing claudient@1.10.1
# npm notice 
# npm notice + contributions (N files)
# npm notice = XXXkB
# npm notice + claudient@1.10.1

# 3.2.2 Verify publication on npm registry
npm view claudient@1.10.1

# 3.2.3 Verify tarball is available
curl -s https://registry.npmjs.org/claudient/1.10.1 | jq '.dist | keys'
# Expected: ["tarball", "shasum", "integrity", ...]

# 3.2.4 Test installation in a temp directory
cd /tmp
mkdir claudient-test-install
cd claudient-test-install
npm install claudient@1.10.1
ls -la node_modules/claudient/
# Expected: skills/, agents/, plugins/, etc. are present

# 3.2.5 Verify CLI works
npx claudient@1.10.1 list | head -20
# Expected: CLI output with skill list

# 3.2.6 Clean up test directory
cd /
rm -rf /tmp/claudient-test-install
```

**Duration:** 5 minutes  
**Owner:** NPM Lead  
**Communication:** Update #deployments channel: "NPM v1.10.1 published ✓"

---

## Phase 4: Claude Code Marketplace Deployment (T-8 to T-3 minutes)

### Step 4.1: Plugin Marketplace Sync

```bash
# 4.1.1 Verify .claude-plugin/marketplace.json is production-ready
cat .claude-plugin/marketplace.json | jq '.version'
# Expected: "1.10.1"

# 4.1.2 Verify manifest schemas
npm run validate:catalog
# Expected: all checks pass

# 4.1.3 Generate marketplace archive (if needed by your deployment)
# This is typically handled by Claude Code itself on marketplace.json updates
# Verify the marketplace.json is in the repo root:
ls -la .claude-plugin/marketplace.json
# Expected: file exists and is < 5MB
```

**Duration:** 2 minutes  
**Owner:** Marketplace Lead

---

### Step 4.2: Marketplace Availability Check

```bash
# 4.2.1 (Manual) Verify marketplace is accessible
# In Claude Code: /marketplace install claudient@1.10.1
# (This will be visible once repo is public/marketplace synced)

# 4.2.2 Verify no marketplace indexing errors
# (Check Claude Code logs for marketplace sync events)

# 4.2.3 Allow 5-10 minutes for CDN cache invalidation if using one
# Typical delay: 1-5 minutes for GitHub raw content
```

**Duration:** 3 minutes  
**Owner:** DevOps Lead  
**Communication:** Announce in #marketplace-updates: "Claudient v1.10.1 available in marketplace"

---

## Phase 5: Post-Deployment Verification (T-3 to T-0 minutes)

### Checkpoint 5A: Package Availability

```bash
# 5A.1 Verify npm package is installable and latest
npm view claudient versions --json | jq '.[-1]'
# Expected: "1.10.1"

npm info claudient@latest
# Expected: shows v1.10.1

# 5A.2 Verify GitHub release is live
gh release view v1.10.1

# 5A.3 Verify tag is pushed
git ls-remote origin v1.10.1

# 5A.4 Monitor marketplace sync logs (if available)
# Expected: marketplace.json was processed without errors

# 5A.5 Spot-check one plugin installation via Claude Code
# (Manual step in Claude Code CLI or UI)
# /marketplace search "skill-name-from-1.10.1"
# /marketplace install "result"
# Expected: installs successfully
```

**Duration:** 3 minutes  
**Owner:** QA Lead

---

### Checkpoint 5B: Documentation & Communication

```bash
# 5B.1 Verify README is updated and consistent
grep -E "1.10.1|61 showcase" README.md
# Expected: version string and feature count present

# 5B.2 Verify CHANGELOG.md has v1.10.1 entry
head -20 CHANGELOG.md | grep -i "1.10.1"
# Expected: version header with date and features

# 5B.3 Verify CONTEXT.md or integration docs mention v1.10.1
grep -r "1.10.1" guides/ || echo "Version not in guides (OK if not required)"

# 5B.4 Post deployment summary to team
cat > /tmp/deployment-summary.txt << 'EOF'
✓ Claudient v1.10.1 Deployment Complete
  - NPM Package: https://www.npmjs.com/package/claudient
  - GitHub Release: https://github.com/UitbreidenOS/Claudient/releases/tag/v1.10.1
  - Marketplace: Available in Claude Code
  - Features: 61 showcase features, 400+ skills, 182+ agents, full translations
  - Status: Production ✓
EOF
cat /tmp/deployment-summary.txt
```

**Duration:** 2 minutes  
**Owner:** Release Lead  
**Communication:** Post summary to #releases, @announce, and social media.

---

## Rollback Procedures

### Trigger Conditions for Rollback

Initiate rollback if:
1. **Critical bug** affects core CLI functionality (e.g., `npx claudient list` crashes)
2. **Package integrity** issue (e.g., missing files in tarball, broken symlinks)
3. **Marketplace sync failure** (plugins not loading in Claude Code after 15 min)
4. **Breaking change** discovered that breaks >5% of user scripts
5. **Security vulnerability** found in dependencies (pre-release only)

### Rollback Steps (Execute within 10 minutes of detection)

#### Option A: Unpublish from NPM (if < 24 hours, no critical dependents)

```bash
# A.1 Unpublish the version (requires npm owner permissions)
npm unpublish claudient@1.10.1 --force

# A.2 Verify unpublish succeeded
npm info claudient@latest
# Expected: shows v1.10.0 (or previous stable version)

# A.3 Notify team
# Message: "v1.10.1 unpublished from NPM due to [reason]. Latest stable: v1.10.0"

# A.4 Create incident report (see Communication section)
```

#### Option B: Yanked Release (if already in production, dependents exist)

```bash
# B.1 Yank the version (keeps it in registry but not default)
npm dist-tag rm claudient@1.10.1

# B.2 Mark as deprecated
npm deprecate claudient@1.10.1 "This version has [issue]. Please upgrade to v1.10.2."

# B.3 Publish hotfix v1.10.2 immediately
# (Go back to Phase 3, increment patch version)

# B.4 Update release notes
gh release delete v1.10.1
# or mark as pre-release: gh release edit v1.10.1 --prerelease
```

#### Option C: GitHub-Only Rollback (marketplace/tag, keep NPM)

```bash
# C.1 Delete GitHub release tag
git push origin --delete v1.10.1
gh release delete v1.10.1

# C.2 Revert marketplace.json on main branch
git revert HEAD~1  # (if latest commit was marketplace sync)
git push origin main

# C.3 Keep NPM version (users who installed get notice to downgrade)
npm deprecate claudient@1.10.1 "Marketplace rollback in progress. Use v1.10.0."
```

---

## Success Criteria

### Must-Have (Deployment passes only if ALL are met)

- [ ] `npm info claudient@latest` returns v1.10.1
- [ ] `npm install claudient@1.10.1` completes without errors in a clean directory
- [ ] `npx claudient@1.10.1 list` executes without crashing
- [ ] GitHub Release v1.10.1 is visible and public
- [ ] Git tag v1.10.1 is pushed to origin
- [ ] Marketplace.json version field = "1.10.1"
- [ ] No **critical** test failures in CI validation phase
- [ ] All 5 checkpoints (1A, 1B, 5A, 5B, and Phase 3) pass validation

### Nice-to-Have (Monitor post-deployment)

- [ ] At least 50 npm package downloads in first hour
- [ ] No GitHub Issues opened reporting v1.10.1 bugs within 24 hours
- [ ] Team feedback: "works as expected" from 3+ internal testers
- [ ] Marketplace search/install flow works for ≥5 sample plugins
- [ ] README/docs updated to reference v1.10.1

---

## Communication Plan

### Pre-Deployment (T-60 minutes)

**Channel:** #deployments  
**Audience:** Engineering team  
**Message:**
```
🚀 Deployment Starting: Claudient v1.10.1
ETA: 30 minutes (T-30min to T+0)
Release notes: [CHANGELOG.md link]
Owner: [Release Lead name]

If issues arise, escalate immediately to #deployment-incidents.
```

---

### Go/No-Go Decision (T-30 minutes)

**Channel:** #deployments  
**Audience:** Tech leads, Release lead  
**Message (if GO):**
```
✓ Pre-deployment checks PASSED.
Proceeding with v1.10.1 deployment.
Checkpoints:
  ✓ All validations passed
  ✓ Artifacts are valid
  ✓ Git status clean
```

**Message (if NO-GO):**
```
⏸ Deployment PAUSED - Issue detected:
[Brief issue description]
Action: [Mitigation steps]
ETA for retry: [Time]
```

---

### Phase Completion Updates (T-25, T-15, T-8, T-0)

**Channel:** #deployments  
**Format:**
```
[Phase Name] ✓ Complete
Duration: X minutes
Status: On track | At risk | Blocked
Next checkpoint: [Name]
```

---

### Incident Communication (If rollback triggered)

**Channel:** #deployment-incidents (create if needed)  
**Audience:** All engineers, @on-call  
**Severity:** SEV1 (critical functionality) | SEV2 (non-critical feature)  
**Message template:**
```
INCIDENT: v1.10.1 Deployment Rollback
Severity: [SEV1/SEV2]
Issue: [Clear description]
Impact: [Number of users affected, what's broken]
Status: Rollback initiated | Rollback complete | Mitigation in progress
ETA: [Time to resolution]
Owner: [On-call engineer]

Jira ticket: [Link]
```

---

### Success Announcement (T+15 minutes)

**Channels:** #releases, #engineering, @announce  
**Audience:** All company, customers  
**Message:**
```
✅ Claudient v1.10.1 Deployed Successfully

Now available:
📦 NPM: npm install -g claudient@latest
📚 Marketplace: /marketplace install claudient
📖 Release notes: [GitHub release link]

What's new:
  • 61 showcase features with full ecosystem
  • Complete enterprise feature parity
  • Full translations (FR, DE, NL, ES)
  • 400+ skills, 182+ agents

Thank you to [team names] for making this release happen!
```

---

## Monitoring & Observability (Post-Deployment)

### Metrics to Monitor (T+0 to T+24 hours)

1. **NPM Download Rate**
   ```bash
   # Check via npm API
   curl -s "https://api.npmjs.org/downloads/point/last-day/claudient" | jq '.downloads'
   # Expected: >100 downloads in first 24h
   ```

2. **GitHub Activity**
   - Release views: expected ≥50 in first hour
   - Issue reports mentioning v1.10.1: expected 0
   - Fork/star activity: may see +5-10 stars

3. **Marketplace Sync Status** (internal)
   - Marketplace reindex time: should complete within 5 min
   - Plugin load tests: verify ≥10 plugins install without error
   - Search results: v1.10.1 should appear in marketplace search

4. **User Feedback Channels**
   - Slack #support: watch for v1.10.1 complaints
   - GitHub Issues: monitor for incoming issues
   - Analytics (if available): track adoption curve

### Health Check Script (Can run T+1, T+6, T+24 hours)

```bash
#!/bin/bash
echo "=== Claudient v1.10.1 Health Check ==="

# 1. NPM availability
echo "[1/5] NPM Registry..."
npm info claudient@1.10.1 > /dev/null && echo "✓" || echo "✗"

# 2. Install test
echo "[2/5] Installation test..."
cd /tmp && mkdir -p health-check-$RANDOM && cd $_ && npm install claudient@1.10.1 --silent && echo "✓" && cd / && rm -rf /tmp/health-check-* || echo "✗"

# 3. CLI execution
echo "[3/5] CLI execution..."
npx claudient@1.10.1 list > /dev/null && echo "✓" || echo "✗"

# 4. GitHub release visibility
echo "[4/5] GitHub release..."
curl -s https://api.github.com/repos/UitbreidenOS/Claudient/releases/tags/v1.10.1 | jq '.tag_name' | grep -q v1.10.1 && echo "✓" || echo "✗"

# 5. Git tag existence
echo "[5/5] Git tag..."
git ls-remote --tags https://github.com/UitbreidenOS/Claudient.git v1.10.1 | grep -q v1.10.1 && echo "✓" || echo "✗"

echo "=== Health check complete ==="
```

---

## Rollback Decision Tree

```
ISSUE DETECTED?
├─ YES
│  ├─ Affects > 50% of users?
│  │  ├─ YES → Execute rollback immediately (Option A or B)
│  │  └─ NO → Prepare hotfix, decide: deploy v1.10.2 OR hold
│  └─ Affects < 10 users?
│     ├─ YES → Document issue, monitor, deploy fix in v1.10.2
│     └─ NO → Escalate to Severity Committee
└─ NO
   └─ Continue monitoring (T+24 hours)
```

---

## Post-Deployment Checklist (T+24 hours)

- [ ] NPM package has ≥50 downloads
- [ ] 0 critical security reports
- [ ] GitHub Issues opened: 0-2 (all non-blocking)
- [ ] Marketplace sync completed successfully
- [ ] Internal QA: ≥3 testers confirm stable
- [ ] Release notes shared on social media
- [ ] Team retro scheduled (if any issues)
- [ ] Close any deployment-specific tasks/tickets

---

## Contacts & Escalation

| Role | Name | Slack | On-Call |
|---|---|---|---|
| Release Lead | @tushar2704 | @tushar | Yes |
| NPM Lead | @[npm-owner] | @[handle] | As-needed |
| Marketplace Lead | @[marketplace-owner] | @[handle] | As-needed |
| QA Lead | @[qa-owner] | @[handle] | As-needed |
| DevOps Lead | @[devops-owner] | @[handle] | Yes |
| On-Call Engineer | *Rotating* | #on-call | Yes |

**Escalation Path:** Release Lead → Tech Lead on Duty → VP Engineering

---

## Appendix: Environment & Dependencies

### Build Environment
```bash
Node: >=18 (current: v20)
npm: >=8.0
Git: >=2.30
```

### Key Dependencies (no semver surprises expected)
```json
{
  "husky": "^9.0.11",        // Pre-commit hooks
  "lint-staged": "^15.2.2",  // Staged file linting
  "sharp": "^0.35.1"         // Image processing (optional)
}
```

### Deployment Environment
- **NPM Registry:** registry.npmjs.org (always available)
- **GitHub API:** api.github.com (monitor for downtime)
- **Marketplace:** Depends on Claude Code infrastructure (check status)

---

## Revision History

| Date | Version | Author | Change |
|---|---|---|---|
| 2026-06-22 | 1.0 | @tushar2704 | Initial deployment plan for v1.10.1 |

---

**Next Review Date:** After v1.10.1 deployment completes (2026-06-22 evening)  
**Plan Validity:** Valid for 30 days; refresh before v1.11.0 release cycle
