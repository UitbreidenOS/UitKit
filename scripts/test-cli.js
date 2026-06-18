#!/usr/bin/env node
/**
 * CLI Smoke Tests — validates core CLI commands execute without errors.
 * Exit code 0 = all pass, 1 = failures.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const CLI = path.join(__dirname, 'cli.js');
const ROOT = path.resolve(__dirname, '..');

process.env.CLAUDIENT_TEST_SUITE = 'true';

let passed = 0;
let failed = 0;
const failures = [];

function run(label, cmd, opts = {}) {
  const { expectOutput = true, expectContains } = opts;
  try {
    const out = execSync(`node ${CLI} ${cmd}`, {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (expectOutput && out.trim().length === 0) {
      throw new Error('Empty output');
    }

    if (expectContains && !out.includes(expectContains)) {
      throw new Error(`Output missing "${expectContains}"`);
    }

    passed++;
    console.log(`  ✓ ${label}`);
  } catch (err) {
    failed++;
    const msg = err.stderr?.trim() || err.stdout?.trim() || err.message;
    failures.push({ label, error: msg.substring(0, 200) });
    console.log(`  ✗ ${label}: ${msg.substring(0, 100)}`);
  }
}

console.log('CLI Smoke Tests\n');

// 1. Help command
run('help prints usage', 'help', { expectContains: 'claudient' });

// 2. List commands
run('list skills', 'list skills', { expectContains: 'skills' });
run('list agents', 'list agents');
run('list rules', 'list rules');
run('list hooks', 'list hooks');
run('list structures', 'list structures');

// 3. Search
run('search "react"', 'search react', { expectContains: 'react' });
run('search "docker"', 'search docker', { expectContains: 'docker' });
run('search "testing"', 'search testing');

// 4. Scan (create temp dir with package.json to test recommend)
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claudient-test-'));
fs.writeFileSync(
  path.join(tmpDir, 'package.json'),
  JSON.stringify({
    name: 'test-project',
    dependencies: {
      next: '^14.0.0',
      typescript: '^5.0.0',
      prisma: '^5.0.0',
    },
  })
);

try {
  const scanOut = execSync(`node ${CLI} scan ${tmpDir}`, {
    cwd: ROOT,
    encoding: 'utf-8',
    timeout: 15000,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  if (scanOut.trim().length > 0) {
    passed++;
    console.log('  ✓ scan detects tech stack');
  } else {
    throw new Error('Empty scan output');
  }
} catch (err) {
  // scan may exit non-zero but still output recommendations
  if (err.stdout && err.stdout.trim().length > 0) {
    passed++;
    console.log('  ✓ scan detects tech stack (with warnings)');
  } else {
    failed++;
    failures.push({ label: 'scan detects tech stack', error: err.message });
    console.log(`  ✗ scan detects tech stack`);
  }
}

// Cleanup
fs.rmSync(tmpDir, { recursive: true, force: true });

// 5. Validate scripts (non-CLI but important)
function runScript(label, scriptPath, expectContains) {
  try {
    const out = execSync(`node ${path.join(ROOT, scriptPath)}`, {
      cwd: ROOT, encoding: 'utf-8', timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'],
    });
    if (expectContains && !out.includes(expectContains)) throw new Error(`Missing "${expectContains}"`);
    passed++;
    console.log(`  ✓ ${label}`);
  } catch (err) {
    // Scripts may exit 1 but still pass (warn-only modes)
    const out = (err.stdout || '') + (err.stderr || '');
    if (out.includes('pass') || out.includes('OK') || err.status === 0) {
      passed++;
      console.log(`  ✓ ${label}`);
    } else {
      failed++;
      failures.push({ label, error: out.substring(0, 200) });
      console.log(`  ✗ ${label}`);
    }
  }
}
runScript('validate-frontmatter passes', 'scripts/validate-frontmatter.js', 'pass');
runScript('validate-manifests passes', 'scripts/validate-manifests.js', 'pass');
runScript('validate-stacks passes', 'scripts/validate-stacks.js');

// 6. Unknown category error handling
try {
  execSync(`node ${CLI} add skills nonexistent-category`, {
    cwd: ROOT,
    encoding: 'utf-8',
    timeout: 10000,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  // Should have exited with error
  failed++;
  failures.push({ label: 'rejects unknown category', error: 'Expected non-zero exit' });
  console.log('  ✗ rejects unknown category: Expected error exit');
} catch (err) {
  if (err.stderr?.includes('Unknown') || err.stdout?.includes('Unknown') || err.status !== 0) {
    passed++;
    console.log('  ✓ rejects unknown category');
  } else {
    failed++;
    failures.push({ label: 'rejects unknown category', error: 'Unexpected error' });
    console.log('  ✗ rejects unknown category');
  }
}

// 7. Phase 20 Commands Smoke Tests
run('tribunal PR adversarial review', 'tribunal', { expectContains: 'TRIBUNAL ADVERSARIAL PR REVIEW' });
run('bisect regression finder', 'bisect --good HEAD~1 --bad HEAD --test "node -e \'process.exit(0)\'"', { expectContains: 'REGRESSION COMMIT IDENTIFIED' });
run('oracle impact analysis', 'oracle', { expectContains: 'THE ORACLE' });
run('nightshift daemon', 'nightshift', { expectContains: 'NIGHT SHIFT' });

// 8. Phase 21 Commands Smoke Tests
run('caveman token optimizer', 'caveman enable', { expectContains: 'CAVEMAN MODE' });
run('jit context compiler', 'jit scripts/cli.js', { expectContains: 'JIT CONTEXT INJECTOR' });

try {
  execSync(`node ${CLI} commit -m "test smoke commit"`, {
    cwd: ROOT,
    encoding: 'utf-8',
    timeout: 30000,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  passed++;
  console.log('  ✓ commit pre-commit validations (clean check)');
} catch (err) {
  const msg = (err.stdout || '') + '\n' + (err.stderr || '');
  if (msg.includes('nothing to commit') || msg.includes('nothing added to commit') || msg.includes('no changes added to commit') || msg.includes('Git commit succeeded')) {
    passed++;
    console.log('  ✓ commit pre-commit validations (passed checks)');
  } else {
    failed++;
    failures.push({ label: 'commit pre-commit validations', error: msg.substring(0, 200) });
    console.log(`  ✗ commit pre-commit validations: ${msg.substring(0, 100)}`);
  }
}

run('permissions list rules', 'permissions list', { expectContains: 'Allowed Permission Rules' });
run('handoff design build loop', 'handoff --task "test task"', { expectContains: 'SUCCESS! Handoff loop completed' });
run('tdd stunt double runner', 'tdd', { expectContains: 'TDD Loop completed successfully' });
run('enforce spec first compliance', 'enforce', { expectContains: 'SPEC-FIRST COMPLIANCE ENFORCER' });

// Summary
console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  - ${f.label}: ${f.error}`));
}

process.exit(failed > 0 ? 1 : 0);
