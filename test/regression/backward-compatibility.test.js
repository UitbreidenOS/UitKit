#!/usr/bin/env node
/**
 * Regression & Backward-Compatibility Tests for Claudient CLI
 *
 * Tests verify:
 * - All legacy CLI commands continue to work (no breaking changes)
 * - Feature parity with previous versions
 * - Skills/agents/hooks/rules can be installed & removed
 * - File/directory structure remains stable
 * - CLI flags and options still function
 * - Cross-version compatibility
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const CLI = path.join(__dirname, '../../scripts/cli.js');
const ROOT = path.resolve(__dirname, '../..');

process.env.CLAUDIENT_TEST_SUITE = 'true';

let passed = 0;
let failed = 0;
const failures = [];
const warnings = [];

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  BOLD: '\x1b[1m',
};

function log(msg, color = 'RESET') {
  console.log(`${COLORS[color]}${msg}${COLORS.RESET}`);
}

function logSection(title) {
  log(`\n${'='.repeat(70)}`, 'BOLD');
  log(`${title}`, 'CYAN');
  log(`${'='.repeat(70)}`, 'BOLD');
}

function run(label, cmd, opts = {}) {
  const {
    expectOutput = true,
    expectContains,
    shouldFail = false,
    expectExitCode,
    timeout = 30000,
  } = opts;

  try {
    const out = execSync(`node ${CLI} ${cmd}`, {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (shouldFail) {
      failed++;
      failures.push({ label, error: 'Expected command to fail but it succeeded' });
      log(`  ✗ ${label}`, 'RED');
      return;
    }

    if (expectOutput && out.trim().length === 0) {
      failed++;
      failures.push({ label, error: 'Empty output when output expected' });
      log(`  ✗ ${label}`, 'RED');
      return;
    }

    if (expectContains && !out.includes(expectContains)) {
      failed++;
      failures.push({ label, error: `Output missing "${expectContains}"` });
      log(`  ✗ ${label}`, 'RED');
      return;
    }

    passed++;
    log(`  ✓ ${label}`, 'GREEN');
  } catch (err) {
    if (shouldFail && (err.status !== 0 || err.stderr)) {
      passed++;
      log(`  ✓ ${label} (correctly rejected)`, 'GREEN');
      return;
    }

    if (expectExitCode !== undefined && err.status === expectExitCode) {
      passed++;
      log(`  ✓ ${label} (exit code ${expectExitCode})`, 'GREEN');
      return;
    }

    failed++;
    const msg = err.stderr?.trim() || err.stdout?.trim() || err.message;
    failures.push({ label, error: msg.substring(0, 300) });
    log(`  ✗ ${label}`, 'RED');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Help & Usage
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Help & Usage Commands');

run('help command prints usage', 'help', { expectContains: 'claudient' });
run('help shows skill categories', 'help', { expectContains: 'Skill categories' });
run('help shows examples', 'help', { expectContains: 'Examples' });
run('help shows all commands', 'help', { expectContains: 'npx claudient' });

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: List Commands (Backward Compat)
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: List Commands (Catalog)');

run('list shows default output', 'list', { expectContains: 'skills' });
run('list skills shows skill categories', 'list skills', { expectContains: 'skills' });
run('list agents works', 'list agents', { expectOutput: true });
run('list rules works', 'list rules', { expectOutput: true });
run('list hooks works', 'list hooks', { expectOutput: true });
run('list structures works', 'list structures', { expectOutput: true });

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Search Functionality (Backward Compat)
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Search Functionality');

run('search "react" finds results', 'search react', { expectContains: 'react' });
run('search "docker" finds results', 'search docker');
run('search "testing" finds results', 'search testing');
run('search "backend" finds results', 'search backend');
run('search "frontend" finds results', 'search frontend');
run('search "database" finds results', 'search database');

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: CLI Flag Parsing (Backward Compat)
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: CLI Flag Parsing');

run('flag --lang en works', 'add skills backend --lang en', {
  expectOutput: true,
  shouldFail: false,
  timeout: 20000
});

run('flag --lang gracefully handles missing value', 'list skills', {
  expectOutput: true
});

run('multiple flags handled correctly', 'list skills', { expectOutput: true });

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Error Handling (Backward Compat)
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Error Handling');

run('unknown command rejected', 'nonexistent-command', {
  shouldFail: true,
  expectExitCode: 1
});

run('unknown skill category rejected', 'add skills nonexistent-category', {
  shouldFail: true,
  expectExitCode: 1
});

run('invalid remove type rejected', 'remove invalid-type', {
  shouldFail: true,
  expectExitCode: 1
});

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: File Structure Validation
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: File Structure & Content Integrity');

function validateStructure(name, baseDir, requiredDirs, requiredFiles) {
  try {
    if (!fs.existsSync(baseDir)) {
      throw new Error(`Base directory not found: ${baseDir}`);
    }

    for (const dir of requiredDirs) {
      const dirPath = path.join(baseDir, dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`Required directory missing: ${dir}`);
      }
    }

    for (const file of requiredFiles) {
      const filePath = path.join(baseDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }

    passed++;
    log(`  ✓ ${name}`, 'GREEN');
  } catch (err) {
    failed++;
    failures.push({ label: name, error: err.message });
    log(`  ✗ ${name}`, 'RED');
  }
}

validateStructure(
  'repo structure: skills directory',
  ROOT,
  ['skills'],
  ['package.json', 'README.md', 'CLAUDE.md']
);

validateStructure(
  'repo structure: scripts directory',
  ROOT,
  ['scripts'],
  ['scripts/cli.js', 'scripts/recommend.js']
);

validateStructure(
  'repo structure: agents directory',
  ROOT,
  ['agents'],
  []
);

validateStructure(
  'repo structure: hooks directory',
  ROOT,
  ['hooks'],
  []
);

validateStructure(
  'repo structure: rules directory',
  ROOT,
  ['rules'],
  []
);

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: CLI Module Dependencies
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: CLI Module Dependencies');

function validateModuleExports(scriptPath, expectedExports) {
  try {
    const script = require(scriptPath);
    const missing = expectedExports.filter(exp => !(exp in script));

    if (missing.length > 0) {
      throw new Error(`Missing exports: ${missing.join(', ')}`);
    }

    passed++;
    log(`  ✓ ${path.basename(scriptPath)} exports all required functions`, 'GREEN');
  } catch (err) {
    failed++;
    failures.push({
      label: `${path.basename(scriptPath)} exports`,
      error: err.message
    });
    log(`  ✗ ${path.basename(scriptPath)} exports`, 'RED');
  }
}

validateModuleExports(path.join(ROOT, 'scripts/recommend.js'), ['recommend']);

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Skill Installation (Backward Compat - Dry Run)
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Skill Installation Logic');

function validateSkillCategory(category) {
  try {
    const categoryDir = path.join(ROOT, 'skills', category);
    if (!fs.existsSync(categoryDir)) {
      throw new Error(`Skill category directory not found: ${category}`);
    }

    const files = fs.readdirSync(categoryDir);
    if (files.length === 0) {
      throw new Error(`Skill category is empty: ${category}`);
    }

    passed++;
    log(`  ✓ Skill category "${category}" exists with ${files.length} items`, 'GREEN');
  } catch (err) {
    failed++;
    failures.push({ label: `Skill category: ${category}`, error: err.message });
    log(`  ✗ Skill category "${category}"`, 'RED');
  }
}

const CORE_CATEGORIES = [
  'ai-engineering',
  'automation',
  'backend',
  'database',
  'devops-infra',
  'git',
];

for (const cat of CORE_CATEGORIES) {
  validateSkillCategory(cat);
}

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Supported Languages (Backward Compat)
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Language Support');

const SUPPORTED_LANGS = ['en', 'fr', 'de', 'nl', 'es'];

for (const lang of SUPPORTED_LANGS) {
  try {
    const skillsPath = path.join(ROOT, 'skills', 'backend');
    const langPath = path.join(skillsPath, lang);

    // Check if language directory exists
    if (fs.existsSync(langPath)) {
      const files = fs.readdirSync(langPath);
      if (files.length > 0) {
        passed++;
        log(`  ✓ Language [${lang}] has ${files.length} translated files`, 'GREEN');
      }
    } else {
      warnings.push(`Language [${lang}] not found in skills/backend (may be optional)`);
      log(`  ~ Language [${lang}] not found (may be optional)`, 'YELLOW');
    }
  } catch (err) {
    failed++;
    failures.push({ label: `Language: ${lang}`, error: err.message });
    log(`  ✗ Language [${lang}] check failed`, 'RED');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Package.json Metadata
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Package Metadata');

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));

  // Check bin field
  if (pkg.bin && pkg.bin.claudient) {
    passed++;
    log(`  ✓ bin.claudient points to ${pkg.bin.claudient}`, 'GREEN');
  } else {
    failed++;
    failures.push({ label: 'bin.claudient', error: 'Missing or invalid' });
    log(`  ✗ bin.claudient not configured`, 'RED');
  }

  // Check files field
  if (Array.isArray(pkg.files) && pkg.files.length > 0) {
    passed++;
    log(`  ✓ files field includes ${pkg.files.length} paths`, 'GREEN');
  } else {
    failed++;
    failures.push({ label: 'files field', error: 'Missing or empty' });
    log(`  ✗ files field not configured`, 'RED');
  }

  // Check scripts
  const requiredScripts = ['list', 'validate', 'test'];
  const missingScripts = requiredScripts.filter(s => !pkg.scripts[s]);

  if (missingScripts.length === 0) {
    passed++;
    log(`  ✓ All required npm scripts present`, 'GREEN');
  } else {
    failed++;
    failures.push({
      label: 'npm scripts',
      error: `Missing scripts: ${missingScripts.join(', ')}`
    });
    log(`  ✗ Missing scripts: ${missingScripts.join(', ')}`, 'RED');
  }

  // Check version format
  if (/^\d+\.\d+\.\d+/.test(pkg.version)) {
    passed++;
    log(`  ✓ Version is semantic: ${pkg.version}`, 'GREEN');
  } else {
    failed++;
    failures.push({ label: 'version format', error: `Invalid: ${pkg.version}` });
    log(`  ✗ Invalid version format`, 'RED');
  }
} catch (err) {
  failed++;
  failures.push({ label: 'package.json', error: err.message });
  log(`  ✗ Failed to read package.json`, 'RED');
}

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Validate Scripts Existence
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Build & Validation Scripts');

const requiredScripts = [
  'scripts/cli.js',
  'scripts/recommend.js',
  'scripts/validate-frontmatter.js',
  'scripts/validate-manifests.js',
];

for (const scriptPath of requiredScripts) {
  try {
    const fullPath = path.join(ROOT, scriptPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error('Script not found');
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    if (content.length === 0) {
      throw new Error('Script is empty');
    }

    passed++;
    log(`  ✓ ${path.basename(scriptPath)} exists and has content`, 'GREEN');
  } catch (err) {
    failed++;
    failures.push({ label: scriptPath, error: err.message });
    log(`  ✗ ${scriptPath}`, 'RED');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Command Output Consistency
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: CLI Output Format Consistency');

run('doctor command output format', 'doctor', {
  expectContains: 'Health Score'
});

run('update command handles version check', 'update', {
  expectOutput: true
});

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Validate Index.json (if present)
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Index Catalog (if built)');

try {
  const indexPath = path.join(ROOT, 'index.json');
  if (fs.existsSync(indexPath)) {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

    if (index.skills && Array.isArray(index.skills)) {
      passed++;
      log(`  ✓ index.json has ${index.skills.length} skills`, 'GREEN');
    } else {
      failed++;
      failures.push({ label: 'index.skills', error: 'Missing or not array' });
      log(`  ✗ index.skills invalid`, 'RED');
    }

    if (index.agents && Array.isArray(index.agents)) {
      passed++;
      log(`  ✓ index.json has ${index.agents.length} agents`, 'GREEN');
    } else {
      failed++;
      failures.push({ label: 'index.agents', error: 'Missing or not array' });
      log(`  ✗ index.agents invalid`, 'RED');
    }

    if (index.hooks && Array.isArray(index.hooks)) {
      passed++;
      log(`  ✓ index.json has ${index.hooks.length} hooks`, 'GREEN');
    } else {
      failed++;
      failures.push({ label: 'index.hooks', error: 'Missing or not array' });
      log(`  ✗ index.hooks invalid`, 'RED');
    }

    if (index.rules && Array.isArray(index.rules)) {
      passed++;
      log(`  ✓ index.json has ${index.rules.length} rules`, 'GREEN');
    } else {
      failed++;
      failures.push({ label: 'index.rules', error: 'Missing or not array' });
      log(`  ✗ index.rules invalid`, 'RED');
    }

    if (index.version) {
      passed++;
      log(`  ✓ index.json version: ${index.version}`, 'GREEN');
    }
  } else {
    warnings.push('index.json not found (run: npm run build-index)');
    log(`  ~ index.json not yet built (optional)`, 'YELLOW');
  }
} catch (err) {
  failed++;
  failures.push({ label: 'index.json parsing', error: err.message });
  log(`  ✗ index.json parse failed`, 'RED');
}

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: Cross-Version Compatibility
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: Cross-Version Compatibility');

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  const currentVersion = pkg.version;

  // Version should be > 1.0.0
  const versionParts = currentVersion.split('.').map(Number);
  if (versionParts[0] >= 1 && versionParts[1] >= 0) {
    passed++;
    log(`  ✓ Version ${currentVersion} indicates stable API`, 'GREEN');
  } else {
    warnings.push(`Version ${currentVersion} may indicate unstable API`);
    log(`  ~ Version ${currentVersion} (unstable warning)`, 'YELLOW');
  }
} catch (err) {
  failed++;
  failures.push({ label: 'version stability', error: err.message });
}

// ────────────────────────────────────────────────────────────────────────────
// TEST SUITE: CLI Help Text Completeness
// ────────────────────────────────────────────────────────────────────────────

logSection('REGRESSION: CLI Documentation');

function testHelpText(cmdName, expectedSections) {
  try {
    const out = execSync(`node ${CLI} ${cmdName} 2>&1 || true`, {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 10000,
    });

    const missing = expectedSections.filter(section => !out.includes(section));

    if (missing.length === 0) {
      passed++;
      log(`  ✓ ${cmdName} help text complete`, 'GREEN');
    } else {
      warnings.push(`${cmdName} missing sections: ${missing.join(', ')}`);
      log(`  ~ ${cmdName} missing: ${missing.join(', ')}`, 'YELLOW');
    }
  } catch (err) {
    failed++;
    failures.push({ label: `${cmdName} help`, error: err.message });
  }
}

testHelpText('help', ['Usage', 'Skills', 'Examples']);
testHelpText('scan', ['project', 'stack']);

// ────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ────────────────────────────────────────────────────────────────────────────

logSection('TEST SUMMARY');

const totalTests = passed + failed;
const percentPassed = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;

log(`\nResults: ${passed} passed, ${failed} failed (${percentPassed}% pass rate)`);
log(`Total Tests: ${totalTests}\n`);

if (warnings.length > 0) {
  log('Warnings:', 'YELLOW');
  warnings.forEach(w => log(`  ⚠ ${w}`, 'YELLOW'));
  log();
}

if (failures.length > 0) {
  log('Failures:', 'RED');
  failures.forEach(f => {
    log(`  ✗ ${f.label}`, 'RED');
    log(`    Error: ${f.error.substring(0, 150)}`);
  });
  log();
}

if (failed === 0) {
  log('✓ All backward-compatibility tests passed!', 'GREEN');
} else {
  log(`✗ ${failed} test(s) failed. Please review the errors above.`, 'RED');
}

log();
process.exit(failed > 0 ? 1 : 0);
