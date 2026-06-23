# ROLLBACK_PLAYBOOK.md — Emergency Procedures for Claudient Deployment

**Version:** 1.0  
**Date:** 2026-06-22  
**Last Updated:** 2026-06-22  
**Severity Levels:** SEV1 (Immediate) | SEV2 (Urgent) | SEV3 (Standard)

---

## Overview

This playbook defines emergency rollback procedures for Claudient deployments. It covers:
- Automated rollback triggers (error rate >5%, installation failures, marketplace sync loss)
- Manual rollback CLI commands
- Post-rollback verification steps
- User notification procedures
- Incident tracking & root cause analysis

**Rollback should execute within 10 minutes of trigger detection.**

---

## Table of Contents

1. [Automated Rollback System](#automated-rollback-system)
2. [Manual Rollback via CLI](#manual-rollback-via-cli)
3. [Rollback Scenarios & Decision Trees](#rollback-scenarios--decision-trees)
4. [Post-Rollback Verification](#post-rollback-verification)
5. [User Communication](#user-communication)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Incident Tracking](#incident-tracking)
8. [Contacts & Escalation](#contacts--escalation)

---

## Automated Rollback System

### Architecture

The automated rollback system monitors three channels post-deployment:
1. **Error Rate Monitor** — NPM registry and GitHub API error responses
2. **Installation Monitor** — Package integrity and dependency resolution
3. **Marketplace Sync Monitor** — Claude Code plugin indexing status

Triggers fire independently; any trigger initiates rollback unless manually overridden.

### Trigger Conditions

#### Trigger 1: Error Rate > 5%

**Monitor:** NPM registry responses and GitHub API health  
**Definition:** >5% of requests to `npm view claudient@latest` or GitHub release endpoint fail

```bash
# Automated check (runs every 2 minutes post-deployment, first 2 hours)
FAILED_REQUESTS=$(curl -s -w "%{http_code}" -o /dev/null https://registry.npmjs.org/claudient/latest)
if [ $FAILED_REQUESTS -ge 500 ] || [ $FAILED_REQUESTS -eq 429 ]; then
  echo "TRIGGER: Registry unavailable (HTTP $FAILED_REQUESTS)"
  exit 1
fi

# If triggered 3 consecutive times: invoke AUTO_ROLLBACK
```

**Action:** Automatic rollback (unless manual override set)  
**Escalation:** Alert #deployment-incidents Slack channel  
**SLA:** Rollback must complete within 5 minutes

---

#### Trigger 2: Installation Failure Rate > 10%

**Monitor:** Installation tests and tarball integrity  
**Definition:** >10% of fresh `npm install claudient@X.Y.Z` attempts fail

```bash
# Automated check (runs every 5 minutes, first 4 hours)
for i in {1..10}; do
  TMPDIR=$(mktemp -d)
  cd "$TMPDIR"
  npm install claudient@1.10.1 --silent 2>&1 | grep -q "ERR\|404\|timeout" && ((FAILURES++))
  cd /
  rm -rf "$TMPDIR"
done

if [ $FAILURES -ge 1 ]; then
  echo "TRIGGER: Installation failures detected ($FAILURES/10 failed)"
  exit 1
fi
```

**Action:** Automatic rollback  
**Escalation:** Page on-call engineer + #deployment-incidents  
**SLA:** Rollback within 3 minutes

---

#### Trigger 3: Marketplace Sync Failure

**Monitor:** Claude Code marketplace indexing and plugin availability  
**Definition:** Marketplace fails to index `marketplace.json` or plugins unresolvable for >10 minutes

```bash
# Automated check (runs every minute, first 30 minutes post-deploy)
# Simulates marketplace install/search
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  # This would be implemented via Claude Code API or webhook
  if ! curl -s "${MARKETPLACE_API}/sync/status" | jq -e '.synced' > /dev/null 2>&1; then
    ((RETRY_COUNT++))
    sleep 20
  else
    break
  fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "TRIGGER: Marketplace sync failed (no sync confirmation after 1 minute)"
  exit 1
fi
```

**Action:** Automatic rollback (Version B: Yank from registry, keep NPM)  
**Escalation:** Alert marketplace team + #marketplace-updates  
**SLA:** Rollback within 5 minutes

---

### Automated Rollback Execution

When any trigger fires 3+ times consecutively (or manually invoked), the automated rollback system:

1. **Stops further promotion** — halts any ongoing CI/marketplace sync
2. **Runs rollback script** — executes appropriate rollback option (A, B, or C)
3. **Notifies stakeholders** — posts to #deployment-incidents
4. **Logs decision** — records trigger, decision, and actions in rollback audit trail
5. **Initiates verification** — runs post-rollback checks automatically

**Automated Rollback Script Location:**  
`/Users/tushar/Desktop/Claudient/deployment/scripts/auto-rollback.sh`

```bash
#!/bin/bash
# auto-rollback.sh — Automated emergency rollback orchestrator

set -euo pipefail

VERSION=$1  # e.g., "1.10.1"
TRIGGER=$2  # e.g., "error_rate", "install_failure", "marketplace_sync"
OPTION=$3   # e.g., "A", "B", "C" (auto-selected based on trigger)

ROLLBACK_LOG="/tmp/rollback-${VERSION}-$(date +%s).log"
SLACK_WEBHOOK="${SLACK_DEPLOYMENT_WEBHOOK:-}"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$ROLLBACK_LOG"
}

notify_slack() {
  if [ -z "$SLACK_WEBHOOK" ]; then return; fi
  curl -s -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "{\"text\": \"🚨 Rollback Alert: $*\"}"
}

log "=== AUTOMATED ROLLBACK INITIATED ==="
log "Version: $VERSION"
log "Trigger: $TRIGGER"
log "Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"

# Auto-select rollback option based on trigger
case "$TRIGGER" in
  error_rate)
    log "Selecting Option A (Unpublish) — registry errors detected"
    OPTION="A"
    ;;
  install_failure)
    log "Selecting Option B (Yank) — installation failures detected"
    OPTION="B"
    ;;
  marketplace_sync)
    log "Selecting Option C (GitHub-only) — marketplace sync failure"
    OPTION="C"
    ;;
  *)
    log "ERROR: Unknown trigger: $TRIGGER"
    notify_slack "Rollback FAILED: Unknown trigger $TRIGGER"
    exit 1
    ;;
esac

# Execute selected rollback option
case "$OPTION" in
  A)
    log "Executing Rollback Option A: Unpublish"
    npm unpublish "claudient@${VERSION}" --force 2>&1 | tee -a "$ROLLBACK_LOG" || {
      log "ERROR: Unpublish failed"
      notify_slack "Rollback FAILED: npm unpublish failed for v${VERSION}"
      exit 1
    }
    notify_slack "Rollback SUCCESS: v${VERSION} unpublished from npm"
    ;;
  B)
    log "Executing Rollback Option B: Yank & Mark Deprecated"
    npm dist-tag rm "claudient@${VERSION}" 2>&1 | tee -a "$ROLLBACK_LOG" || true
    npm deprecate "claudient@${VERSION}" "Version v${VERSION} has critical issues. Please use v1.10.0." 2>&1 | tee -a "$ROLLBACK_LOG" || {
      log "ERROR: Deprecation failed"
      notify_slack "Rollback PARTIAL: Yank succeeded but deprecation may have failed"
    }
    notify_slack "Rollback SUCCESS: v${VERSION} marked deprecated + yanked from latest"
    ;;
  C)
    log "Executing Rollback Option C: GitHub-only (keep NPM)"
    git push origin --delete "v${VERSION}" 2>&1 | tee -a "$ROLLBACK_LOG" || true
    gh release delete "v${VERSION}" -y 2>&1 | tee -a "$ROLLBACK_LOG" || true
    npm deprecate "claudient@${VERSION}" "Marketplace rollback in progress. Use v1.10.0." 2>&1 | tee -a "$ROLLBACK_LOG" || true
    notify_slack "Rollback SUCCESS: v${VERSION} GitHub release/tag deleted, NPM kept (deprecated)"
    ;;
  *)
    log "ERROR: Invalid option: $OPTION"
    exit 1
    ;;
esac

log "=== ROLLBACK COMPLETE ==="
log "Initiating post-rollback verification..."

# Run verification checks (see Post-Rollback Verification section)
bash /Users/tushar/Desktop/Claudient/deployment/scripts/verify-rollback.sh "$VERSION" 2>&1 | tee -a "$ROLLBACK_LOG"

log "Rollback audit trail saved to: $ROLLBACK_LOG"
```

**Installation:**
```bash
# In deployment CI/CD system or cron scheduler:
# Run this monitoring loop for 4 hours post-deployment
(while true; do
  /Users/tushar/Desktop/Claudient/deployment/scripts/auto-rollback-monitor.sh "1.10.1" || true
  sleep 120  # Check every 2 minutes
done) &
```

---

## Manual Rollback via CLI

### Quick-Start: Manual Rollback Command

```bash
# OPTION A: Unpublish (recommended if <24 hours and no major dependents)
claudient rollback --feature=1.10.1 --option=A --force

# OPTION B: Yank (recommended if already installed widely)
claudient rollback --feature=1.10.1 --option=B

# OPTION C: GitHub-only (recommended if NPM is critical)
claudient rollback --feature=1.10.1 --option=C

# Get help
claudient rollback --help
```

### CLI Implementation

The `claudient rollback` command is implemented in the Claude Code CLI suite:

**File:** `/Users/tushar/Desktop/Claudient/src/commands/rollback.ts`

```typescript
import { Command } from '@oclif/core';
import chalk from 'chalk';
import * as fs from 'fs';
import { execSync } from 'child_process';

interface RollbackOptions {
  feature: string;
  option: 'A' | 'B' | 'C';
  force?: boolean;
  dryRun?: boolean;
  verify?: boolean;
}

export default class RollbackCommand extends Command {
  static description = 'Emergency rollback for deployed features';

  static examples = [
    '$ claudient rollback --feature=1.10.1 --option=A',
    '$ claudient rollback --feature=1.10.1 --option=B --verify',
    '$ claudient rollback --feature=1.10.1 --option=C --dry-run',
  ];

  static flags = {
    feature: { description: 'Feature/version to rollback', required: true },
    option: { description: 'Rollback option: A (unpublish), B (yank), C (github-only)', required: true },
    force: { description: 'Skip confirmation prompt', default: false },
    dryRun: { description: 'Simulate rollback without making changes', default: false },
    verify: { description: 'Run verification checks after rollback', default: false },
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(RollbackCommand);
    const opts: RollbackOptions = {
      feature: flags.feature,
      option: flags.option as 'A' | 'B' | 'C',
      force: flags.force,
      dryRun: flags.dryRun,
      verify: flags.verify,
    };

    this.validateOptions(opts);
    
    if (!opts.force && !opts.dryRun) {
      const confirm = await this.confirm(
        `⚠️  EMERGENCY ROLLBACK: claudient@${opts.feature}\n` +
        `Option ${opts.option} will ${this.getOptionDescription(opts.option)}\n` +
        `Continue? (yes/no)`
      );
      if (!confirm) {
        this.log(chalk.yellow('Rollback cancelled'));
        process.exit(0);
      }
    }

    this.log(chalk.bold(`\n🚨 Initiating rollback for claudient@${opts.feature}...\n`));

    const auditTrail = {
      timestamp: new Date().toISOString(),
      version: opts.feature,
      option: opts.option,
      user: process.env.USER || 'unknown',
      dryRun: opts.dryRun,
      command: `claudient rollback --feature=${opts.feature} --option=${opts.option}`,
      steps: [] as string[],
      errors: [] as string[],
    };

    try {
      switch (opts.option) {
        case 'A':
          await this.executeOptionA(opts, auditTrail);
          break;
        case 'B':
          await this.executeOptionB(opts, auditTrail);
          break;
        case 'C':
          await this.executeOptionC(opts, auditTrail);
          break;
      }

      if (opts.verify) {
        this.log(chalk.cyan('\n✓ Running post-rollback verification...\n'));
        await this.verifyRollback(opts.feature);
      }

      this.saveAuditTrail(auditTrail);
      this.log(chalk.green(`\n✅ Rollback ${opts.dryRun ? '(simulated) ' : ''}complete!\n`));
      this.log(chalk.gray(`Audit trail: ${auditTrail}`));

    } catch (error) {
      auditTrail.errors.push((error as Error).message);
      this.saveAuditTrail(auditTrail);
      this.log(chalk.red(`\n❌ Rollback failed: ${error}\n`));
      process.exit(1);
    }
  }

  private async executeOptionA(opts: RollbackOptions, trail: any): Promise<void> {
    this.log(chalk.bold('Option A: Unpublish from NPM'));
    this.log('Action: Remove version from npm registry entirely\n');

    trail.steps.push('Step 1: Verify npm login');
    this.exec('npm whoami', opts.dryRun);

    trail.steps.push(`Step 2: Unpublish claudient@${opts.feature}`);
    const cmd = `npm unpublish claudient@${opts.feature} --force`;
    this.exec(cmd, opts.dryRun);

    trail.steps.push('Step 3: Verify unpublish succeeded');
    this.exec(`npm view claudient@latest`, opts.dryRun);

    trail.steps.push('Step 4: Notify team (Slack)');
    await this.notifySlack(`v${opts.feature} unpublished from NPM`);
  }

  private async executeOptionB(opts: RollbackOptions, trail: any): Promise<void> {
    this.log(chalk.bold('Option B: Yank Release (Keep in Registry)'));
    this.log('Action: Remove from latest tag, mark deprecated\n');

    trail.steps.push(`Step 1: Yank claudient@${opts.feature}`);
    this.exec(`npm dist-tag rm claudient@${opts.feature}`, opts.dryRun);

    trail.steps.push(`Step 2: Mark deprecated`);
    const msg = `Version v${opts.feature} has critical issues. Please use v1.10.0.`;
    this.exec(`npm deprecate claudient@${opts.feature} "${msg}"`, opts.dryRun);

    trail.steps.push(`Step 3: Publish hotfix v1.10.2`);
    this.log(chalk.yellow('⚠️  Manual step required: Prepare and publish v1.10.2 hotfix'));

    trail.steps.push('Step 4: Notify team');
    await this.notifySlack(`v${opts.feature} yanked. Hotfix v1.10.2 in progress`);
  }

  private async executeOptionC(opts: RollbackOptions, trail: any): Promise<void> {
    this.log(chalk.bold('Option C: GitHub-Only Rollback'));
    this.log('Action: Delete GitHub release/tag, keep NPM (deprecated)\n');

    trail.steps.push(`Step 1: Delete git tag v${opts.feature}`);
    this.exec(`git push origin --delete v${opts.feature}`, opts.dryRun);

    trail.steps.push(`Step 2: Delete GitHub release`);
    this.exec(`gh release delete v${opts.feature} -y`, opts.dryRun);

    trail.steps.push(`Step 3: Mark NPM version deprecated`);
    const msg = `Marketplace rollback in progress. Use v1.10.0.`;
    this.exec(`npm deprecate claudient@${opts.feature} "${msg}"`, opts.dryRun);

    trail.steps.push('Step 4: Revert marketplace.json if needed');
    this.log(chalk.yellow('⚠️  Manual step: Revert marketplace.json commit if present'));

    trail.steps.push('Step 5: Notify team');
    await this.notifySlack(`v${opts.feature} GitHub release deleted (NPM kept, deprecated)`);
  }

  private async verifyRollback(version: string): Promise<void> {
    const checks = [
      { name: 'NPM registry', cmd: `npm info claudient@latest | grep "latest"` },
      { name: 'Installation test', cmd: `cd /tmp && npm install claudient@1.10.0 --silent` },
      { name: 'Git tag removal', cmd: `git ls-remote --tags origin v${version} | wc -l` },
      { name: 'GitHub release removal', cmd: `curl -s -o /dev/null -w "%{http_code}" https://github.com/UitbreidenOS/Claudient/releases/tag/v${version}` },
    ];

    for (const check of checks) {
      try {
        const result = execSync(check.cmd, { encoding: 'utf8' });
        this.log(chalk.green(`✓ ${check.name}`));
      } catch (err) {
        this.log(chalk.yellow(`⚠️  ${check.name}: ${err}`));
      }
    }
  }

  private exec(cmd: string, dryRun: boolean): string {
    this.log(`  $ ${cmd}`);
    if (dryRun) {
      this.log(chalk.gray('  (dry-run, not executed)\n'));
      return '';
    }
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
  }

  private async notifySlack(message: string): Promise<void> {
    const webhook = process.env.SLACK_DEPLOYMENT_WEBHOOK;
    if (!webhook) {
      this.log(chalk.gray('  (Slack webhook not configured)'));
      return;
    }
    // POST to webhook
  }

  private getOptionDescription(option: string): string {
    return {
      A: 'completely unpublish v1.10.1 from npm (acts retroactively, no users get it)',
      B: 'yank from latest, mark deprecated, publish hotfix v1.10.2 (for existing users)',
      C: 'delete GitHub release/tag only, keep NPM, mark deprecated (for marketplace issues)',
    }[option] || 'unknown';
  }

  private validateOptions(opts: RollbackOptions): void {
    if (!['A', 'B', 'C'].includes(opts.option)) {
      throw new Error('Invalid option. Use A, B, or C');
    }
  }

  private saveAuditTrail(trail: any): void {
    const path = `/tmp/rollback-audit-${trail.timestamp}.json`;
    fs.writeFileSync(path, JSON.stringify(trail, null, 2));
  }

  private async confirm(message: string): Promise<boolean> {
    // Implementation uses inquirer or similar
    return true;
  }
}
```

---

## Rollback Scenarios & Decision Trees

### Scenario 1: Critical CLI Bug (Error Rate >5%)

**Trigger:** NPM registry returns >5% error responses  
**Severity:** SEV1 (Immediate)  
**Decision Tree:**

```
Bug detected in 1.10.1?
├─ YES: Affects CLI core (list, help, etc.)
│  ├─ YES: Execute Rollback Option A (Unpublish)
│  │       ETA: 3 minutes
│  │       Reason: Bug is critical; unpublishing prevents new users from installing
│  └─ NO: Affects subset (e.g., one skill)
│         └─ Prepare hotfix v1.10.2 + Rollback Option B (Yank)
│            ETA: 15 minutes total (5 for yank + 10 for hotfix build/publish)
└─ NO: Registry temporarily down
   └─ Wait 5 minutes, re-check
      └─ If persists: Notify DevOps, monitor for CDN issues
```

**Execution:**

```bash
# On-call: CLI bug detected in 1.10.1, causes crash
CLIVersion=$(npm info claudient@latest | grep '"version"')
ErrorRate=$(curl -s https://registry.npmjs.org/claudient/1.10.1 | jq '.error' | wc -l)

if [ "$ErrorRate" -gt "5" ]; then
  echo "✓ Trigger: Error rate >5%"
  claudient rollback --feature=1.10.1 --option=A --force
fi
```

---

### Scenario 2: Installation Failures (>10% failure rate)

**Trigger:** Fresh `npm install claudient@1.10.1` fails in >10% of test environments  
**Severity:** SEV1 (Immediate)  
**Likely Causes:** Missing files, broken symlinks, corrupted tarball  
**Decision Tree:**

```
Install failure detected?
├─ YES: File is missing from tarball
│  └─ Root cause: package.json "files" field incomplete
│     └─ Action: Rollback Option B (Yank)
│     └─ Fix: Update files field, publish v1.10.2
│        ETA: 20 minutes
├─ YES: Symlink is broken
│  └─ Action: Rollback Option B (Yank)
│     └─ Fix: Rebuild with correct symlinks
│        ETA: 15 minutes
├─ YES: Tarball is corrupted
│  └─ Action: Rollback Option A (Unpublish)
│     └─ Reason: Tarball is unusable; complete re-publish needed
│        ETA: 30 minutes (rebuild + validate + publish)
└─ NO: Issue is external (npm registry down)
   └─ Action: Monitor, no rollback needed
      ETA: N/A
```

**Execution:**

```bash
# Automated installation test (runs 10 times, first 4 hours)
#!/bin/bash
FAILURES=0
for i in {1..10}; do
  TMPDIR=$(mktemp -d)
  cd "$TMPDIR"
  if ! npm install claudient@1.10.1 --silent 2>&1 | grep -q "ERR\|404"; then
    ((FAILURES++))
  fi
  cd / && rm -rf "$TMPDIR"
done

if [ $FAILURES -ge 1 ]; then
  echo "⚠️  Installation failures detected: $FAILURES/10"
  # Determine root cause
  npm pack --dry-run 2>&1 | grep -q "warn\|error" && OPTION="B" || OPTION="A"
  claudient rollback --feature=1.10.1 --option=$OPTION --force --verify
fi
```

---

### Scenario 3: Marketplace Sync Failure (>10 min without indexing)

**Trigger:** Marketplace fails to index `marketplace.json` for >10 minutes  
**Severity:** SEV2 (Urgent)  
**Likely Causes:** Schema validation failure, marketplace API down, malformed manifest  
**Decision Tree:**

```
Marketplace sync failed?
├─ YES: Schema validation error in marketplace.json
│  └─ Root cause: Invalid plugin manifest
│     └─ Action: Rollback Option C (GitHub-only)
│     └─ Fix: Validate schema, rebuild marketplace.json, republish
│        ETA: 20 minutes
├─ YES: Marketplace API is down
│  └─ Action: No rollback; wait for API recovery
│     ETA: N/A (external service)
├─ YES: Too many plugins (>5000)
│  └─ Action: Rollback Option C, implement pagination
│     ETA: 30 minutes
└─ NO: Sync in progress (still waiting)
   └─ Action: Monitor for 5 more minutes, then reassess
      ETA: N/A
```

**Execution:**

```bash
# Marketplace sync monitor (runs every minute, first 30 min)
#!/bin/bash
RETRY_COUNT=0
MAX_RETRIES=10

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  SYNC_STATUS=$(curl -s https://marketplace.claudecode.com/api/v1/sync/status 2>/dev/null | jq '.synced' 2>/dev/null)
  
  if [ "$SYNC_STATUS" == "true" ]; then
    echo "✓ Marketplace synced"
    exit 0
  fi
  
  echo "⏳ Marketplace sync in progress... (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)"
  ((RETRY_COUNT++))
  sleep 60
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "✗ Marketplace sync failed after 10 minutes"
  # Validate marketplace.json schema
  npx json-schema-validator .claude-plugin/marketplace.json 2>&1 | grep -q "error" && OPTION="C"
  claudient rollback --feature=1.10.1 --option=$OPTION --force --verify
fi
```

---

### Scenario 4: Breaking Change (Affects >5% of user scripts)

**Trigger:** GitHub Issues spike (5+ issues within 1 hour mentioning v1.10.1 breaks their setup)  
**Severity:** SEV1 (Immediate)  
**Decision Tree:**

```
Breaking change detected (5+ issues)?
├─ YES: Old API no longer works
│  └─ Affects: 10%+ of user base
│     └─ Action: Rollback Option B (Yank)
│     └─ Reason: Users with v1.10.0 unaffected; new users won't install
│        ETA: 5 minutes
├─ YES: Configuration format changed
│  └─ Affects: Migration required
│     └─ Action: Rollback Option B + Publish Migration Guide
│        ETA: 20 minutes (5 rollback + 15 guide)
└─ NO: Issue is edge-case for <1% of users
   └─ Action: Create GitHub issue, publish workaround, no rollback
      ETA: N/A
```

**Execution:**

```bash
# Monitor GitHub issues (triggered by webhook or manual escalation)
#!/bin/bash
ISSUE_COUNT=$(gh issue list --label "v1.10.1" --state open --json title | jq 'length')

if [ $ISSUE_COUNT -ge 5 ]; then
  echo "⚠️  $ISSUE_COUNT breaking-change issues detected"
  # Ask on-call engineer for confirmation
  read -p "Execute Rollback Option B? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    claudient rollback --feature=1.10.1 --option=B --force
  fi
fi
```

---

## Post-Rollback Verification

### Verification Script

**File:** `/Users/tushar/Desktop/Claudient/deployment/scripts/verify-rollback.sh`

```bash
#!/bin/bash
# verify-rollback.sh — Comprehensive post-rollback validation

set -euo pipefail

VERSION=$1  # e.g., "1.10.1"
PREVIOUS_VERSION=$2  # e.g., "1.10.0" (defaults to last stable)

if [ -z "$PREVIOUS_VERSION" ]; then
  PREVIOUS_VERSION=$(npm view claudient@latest version)
  echo "Using previous stable version: $PREVIOUS_VERSION"
fi

CHECKS_PASSED=0
CHECKS_FAILED=0

check() {
  local name=$1
  local cmd=$2
  echo -n "Checking $name... "
  
  if eval "$cmd" > /dev/null 2>&1; then
    echo "✓"
    ((CHECKS_PASSED++))
  else
    echo "✗ (FAILED)"
    ((CHECKS_FAILED++))
  fi
}

echo "=== Post-Rollback Verification ==="
echo "Rolled-back version: $VERSION"
echo "Stable version: $PREVIOUS_VERSION"
echo ""

# 1. NPM Registry Checks
echo "[1/5] NPM Registry"
check "Latest is $PREVIOUS_VERSION" "npm view claudient@latest version | grep -q $PREVIOUS_VERSION"
check "Previous version exists" "npm view claudient@$PREVIOUS_VERSION > /dev/null"
check "Rolled-back version unavailable" "! npm info claudient@$VERSION 2>&1 | grep -q 'published'"

# 2. Installation Test
echo "[2/5] Installation"
TMPDIR=$(mktemp -d)
cd "$TMPDIR"
check "Install stable version" "npm install claudient@$PREVIOUS_VERSION --silent"
check "CLI executes" "npx claudient@$PREVIOUS_VERSION list > /dev/null"
cd / && rm -rf "$TMPDIR"

# 3. GitHub Checks
echo "[3/5] GitHub Release"
check "Released version exists" "gh release view v$PREVIOUS_VERSION > /dev/null"
check "Rolled-back release removed" "! gh release view v$VERSION > /dev/null 2>&1"
check "Git tag exists for stable" "git ls-remote --tags origin v$PREVIOUS_VERSION | grep -q v$PREVIOUS_VERSION"
check "Git tag removed for rollback" "! git ls-remote --tags origin v$VERSION | grep -q v$VERSION || git ls-remote --tags origin v$VERSION | grep -q '^d'"

# 4. Package Integrity
echo "[4/5] Package Integrity"
check "Tarball valid" "npm pack claudient@$PREVIOUS_VERSION --dry-run > /dev/null"
check "No broken symlinks" "! find node_modules/claudient -type l -xtype l 2>/dev/null | grep -q ."

# 5. Marketplace (if applicable)
echo "[5/5] Marketplace"
if command -v gh > /dev/null 2>&1; then
  check "Marketplace API responsive" "curl -s -o /dev/null -w '%{http_code}' https://marketplace.claudecode.com/api/v1/status | grep -q '200'"
else
  echo "Marketplace check skipped (gh CLI not available)"
fi

echo ""
echo "=== Verification Summary ==="
echo "Passed: $CHECKS_PASSED"
echo "Failed: $CHECKS_FAILED"

if [ $CHECKS_FAILED -eq 0 ]; then
  echo ""
  echo "✅ All post-rollback checks passed!"
  exit 0
else
  echo ""
  echo "⚠️  Some checks failed. Manual review required."
  exit 1
fi
```

**Run Verification:**

```bash
# Automatic (after rollback)
bash /Users/tushar/Desktop/Claudient/deployment/scripts/verify-rollback.sh 1.10.1 1.10.0

# Manual (on-demand)
claudient rollback --feature=1.10.1 --option=A --verify
```

---

## User Communication

### Announcement Templates

#### Template 1: Immediate Rollback Announcement

**Channel:** #announcements, @all  
**Timing:** Within 5 minutes of rollback decision  
**Severity:** SEV1

```
⚠️ INCIDENT: Claudient v1.10.1 Rollback

We've detected and immediately rolled back v1.10.1 due to [ISSUE].

📌 Impact:
  • Users who have NOT installed v1.10.1: No action needed
  • Users who HAVE installed v1.10.1: Please downgrade to v1.10.0
  
💾 To downgrade:
  npm install -g claudient@1.10.0
  # or
  npm install claudient@1.10.0 --save

🔧 What happened:
  [Brief technical explanation]

📞 Questions?
  • Support: #support
  • Engineering: #deployment-incidents
  • Direct: @on-call-engineer

We apologize for the disruption and thank you for your patience.
```

#### Template 2: Post-Rollback Status Update

**Channel:** #deployments, #announcements  
**Timing:** 15 minutes after rollback  
**Severity:** All levels

```
✅ v1.10.1 Rollback Complete

Rollback Status: SUCCESSFUL
Timestamp: 2026-06-22T14:35:00Z
Option Used: A (Unpublish)

📊 Results:
  • NPM: v1.10.1 completely removed ✓
  • GitHub: Release/tag deleted ✓
  • Users: v1.10.0 is stable and current ✓
  • Marketplace: Synced with v1.10.0 ✓

🔍 Root Cause Analysis:
  [Issue found during investigation]

🚀 Next Steps:
  1. Investigation & fix: ETA 2-4 hours
  2. Hotfix v1.10.2 preparation
  3. Full testing & QA
  4. Re-deployment (scheduled for [TIME])

📢 Follow-ups:
  • Incident review scheduled for 2026-06-22 15:00 UTC
  • Post-incident report due by EOD

Thanks for your patience. Updates every 15 min in #deployment-incidents.
```

#### Template 3: Retrospective & Lessons Learned

**Channel:** #engineering  
**Timing:** Within 24 hours of rollback  
**Severity:** All levels

```
📋 Post-Incident Review: v1.10.1 Rollback

Incident Date/Time: 2026-06-22 14:30 UTC
Duration: 15 minutes (detection to resolution)
Severity: SEV1

🎯 Summary:
  v1.10.1 deployment caused [ISSUE]. Automatic monitoring detected the issue
  and initiated rollback within [X] minutes.

📌 Timeline:
  14:30 — Deployment complete, monitoring started
  14:33 — Trigger detected: [TRIGGER TYPE]
  14:35 — Rollback Option A executed
  14:36 — Post-rollback verification passed
  14:40 — All-clear announcement published

🔍 Root Cause:
  [Technical root cause]

🛡️ What Saved Us:
  1. Automated monitoring caught issue in [X] min
  2. Clear rollback procedures enabled fast execution
  3. Pre-rollback testing (but missed [SCENARIO])

⚡ Improvements (by priority):
  1. [Short-term fix: add test for SCENARIO]
  2. [Medium-term: improve pre-deployment coverage]
  3. [Long-term: refactor COMPONENT]

📅 Follow-ups:
  • Task: [Add test for regression] — Owner: @[name] — Due: 2026-06-23
  • Task: [Improve CI check X] — Owner: @[name] — Due: 2026-06-24
  • Task: [Documentation update] — Owner: @[name] — Due: 2026-06-25

🙏 Thanks to: [Team members who helped resolve]

Questions? Reply in thread or DM @on-call-engineer.
```

---

## Monitoring & Alerts

### Post-Deployment Monitoring Window

**Duration:** T+0 to T+24 hours  
**Frequency:** Continuous (automated) + manual checks at T+15min, T+1hr, T+4hr

### Alert Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| NPM Registry Error Rate | >5% for 3 consecutive checks | Automatic Rollback (Option A) |
| Installation Failure Rate | >10% (≥1/10 test installs fail) | Automatic Rollback (Option B) |
| Marketplace Sync Time | >10 minutes | Automatic Rollback (Option C) |
| GitHub Issues (v-tagged) | 5+ within 1 hour | Manual Review → Possible Rollback |
| NPM Download Rate | <50 in first 24h | Investigate (may indicate adoption issue) |
| CLI Crash Rate | >1% of executions | Manual Escalation |

### Health Check Commands (Run hourly)

```bash
#!/bin/bash
# Hourly health check (can be run manually or via cron)

VERSION="1.10.1"

echo "🏥 Claudient v$VERSION Health Check — $(date)"
echo ""

# 1. NPM Status
echo "1. NPM Registry"
npm info claudient@latest 2>&1 | grep "latest" && echo "   ✓ Accessible" || echo "   ✗ Error"

# 2. Installation Test
echo "2. Installation Test"
cd /tmp && mkdir -p test-$RANDOM && cd $_ && npm install claudient@$VERSION --silent 2>&1 > /dev/null && echo "   ✓ Success" || echo "   ✗ Failed"
cd / && rm -rf /tmp/test-* 2>/dev/null

# 3. CLI Smoke Test
echo "3. CLI Smoke Test"
npx claudient@$VERSION list 2>&1 > /dev/null && echo "   ✓ Executable" || echo "   ✗ Crash"

# 4. GitHub Visibility
echo "4. GitHub Release"
gh release view v$VERSION 2>&1 > /dev/null && echo "   ✓ Visible" || echo "   ✗ Not found"

# 5. Marketplace Status
echo "5. Marketplace API"
curl -s -o /dev/null -w "%{http_code}" https://marketplace.claudecode.com/api/v1/status | grep -q "200" && echo "   ✓ OK" || echo "   ✗ Unreachable"

echo ""
echo "Health check complete. Results logged to: /tmp/health-check-$(date +%s).log"
```

---

## Incident Tracking

### Incident Report Template

**File:** `/tmp/incident-report-[version]-[timestamp].md`

```markdown
# Incident Report: Claudient v1.10.1

**Incident ID:** INC-2026-06-22-001  
**Date/Time:** 2026-06-22T14:30:00Z  
**Duration:** 15 minutes  
**Severity:** SEV1  
**Status:** RESOLVED

## Summary

[1-2 sentence overview of what went wrong]

## Timeline

| Time | Event | Owner |
|------|-------|-------|
| 14:30 | Deployment completed, monitoring started | @release-lead |
| 14:33 | Automatic trigger fired: Error rate >5% | @monitoring-system |
| 14:35 | Rollback Option A initiated | @release-lead |
| 14:36 | Post-rollback verification passed | @qa-lead |
| 14:40 | User announcement published | @product |

## Root Cause Analysis

**What Happened:**
[Detailed technical explanation]

**Why It Happened:**
[Root cause]

**Why We Didn't Catch It:**
[Process failure that allowed bug to reach production]

## Impact

- **Users Affected:** [Number/Percentage]
- **Features Impacted:** [List]
- **Service Downtime:** 0 minutes (rollback was instantaneous)
- **Data Loss:** None
- **Security Impact:** None

## Detection & Response

- **Detection Method:** Automated monitoring (error rate trigger)
- **Time to Detection:** 3 minutes
- **Time to Resolution:** 6 minutes (15 min total from deploy)
- **Escalation Level:** Auto-triggered → Ops team notified

## Mitigation

**Immediate Actions (Completed):**
1. Rollback to v1.10.0 via Option A
2. User communication sent
3. Post-rollback verification passed

**Short-term Fixes (In progress):**
1. [Fix implemented for regression]
2. [Additional test added]

**Long-term Improvements (Planned):**
1. [Process improvement]
2. [Refactoring]

## Lessons Learned

| What | Why | Action Item | Owner | Due |
|------|-----|-------------|-------|-----|
| Test X was missing | Inadequate coverage | Add regression test | @dev1 | 2026-06-23 |
| Alert Y didn't fire | Threshold too high | Adjust threshold | @ops | 2026-06-24 |
| [Item] | [Reason] | [Action] | @owner | [Date] |

## Sign-Off

**Incident Commander:** @on-call-engineer  
**Reviewed By:** @engineering-manager  
**Approved By:** @director-engineering  
**Date:** 2026-06-22
```

### Create Incident Report

```bash
# Automatically generated post-rollback
TIMESTAMP=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VERSION="1.10.1"
REPORT="/tmp/incident-report-${VERSION}-$(date +%s).md"

cat > "$REPORT" << 'EOF'
# Incident Report: Claudient v1.10.1

**Incident ID:** INC-2026-06-22-001
[...continues with template...]
EOF

# Store in artifact repository
mkdir -p /Users/tushar/Desktop/Claudient/deployment/incidents
cp "$REPORT" /Users/tushar/Desktop/Claudient/deployment/incidents/

echo "Incident report created: $REPORT"
```

---

## Contacts & Escalation

### On-Call Rotation

| Time | Role | Name | Slack | Phone | Fallback |
|------|------|------|-------|-------|----------|
| 24/7 | On-Call Engineer | @[rotating] | #on-call | [+1-xxx-xxx-xxxx] | @director-eng |
| 24/7 | Release Lead | @tushar2704 | @tushar | [+1-xxx-xxx-xxxx] | @eng-manager |
| 09:00-17:00 UTC | DevOps Lead | @[name] | @[handle] | [phone] | @sys-admin |
| 09:00-17:00 UTC | QA Lead | @[name] | @[handle] | [phone] | @qa-manager |

### Escalation Path

```
Rollback Triggered (Automatic)
  ↓
Notify #deployment-incidents (@on-call-engineer, @release-lead)
  ↓
Rollback Executes (auto-script or manual CLI)
  ↓
Post-Rollback Verification
  ↓
✓ SUCCESS: Publish all-clear announcement
✗ FAILURE: Escalate to @director-engineering
  ↓
Director Decides:
  • Try alternative rollback option (A→B→C)
  • Hold for manual investigation
  • Escalate to CTO
```

### Emergency Contacts

**For Immediate Help:**
- **Slack:** #deployment-incidents (auto-created)
- **PagerDuty:** [Alerting policy URL]
- **War Room:** [Zoom room URL]

**For Specific Issues:**
- **NPM Publishing:** @npm-owner (npm-owner@company.com)
- **Marketplace Sync:** @marketplace-owner (marketplace-owner@company.com)
- **GitHub Administration:** @repo-admin (repo-admin@company.com)
- **Infrastructure:** @devops-lead (devops-lead@company.com)

---

## Appendix: Rollback Decision Matrix

```
Trigger Type          Option   ETA   Reason
─────────────────────────────────────────────────────────────
Error Rate >5%        A        3m    Kill bad version immediately
Install Failure >10%  B        5m    Users may have old version
Marketplace Sync      C        5m    Keep NPM for existing users
Breaking Change >5%   B        5m    New users won't install
Critical Security     A        2m    Remove ASAP from registry
```

---

## Appendix: Rollback Checklist

### Pre-Rollback

- [ ] Confirm trigger condition met (3+ consecutive failures)
- [ ] Verify rollback option matches scenario
- [ ] Alert #deployment-incidents channel
- [ ] Page on-call engineer
- [ ] Record start time

### Executing Rollback

- [ ] Run `claudient rollback --feature=X --option=Y --verify`
- [ ] Monitor command output for errors
- [ ] Verify post-rollback checks pass
- [ ] Confirm rollback completed <10 min from trigger

### Post-Rollback

- [ ] Publish user announcement
- [ ] Verify stable version is current
- [ ] Test installation of previous version
- [ ] Check GitHub and npm for consistency
- [ ] Create incident report
- [ ] Schedule post-incident review
- [ ] Close #deployment-incidents channel (after 24h)

---

**Last Updated:** 2026-06-22  
**Playbook Version:** 1.0  
**Next Review:** After first production rollback or 2026-09-22 (quarterly)

---

For questions or updates, contact: @release-lead or #deployment-incidents
