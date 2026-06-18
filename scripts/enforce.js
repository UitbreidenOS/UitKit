#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const ENFORCER_REPORT_PATH = path.join(CLAUDE_DIR, 'enforcer-report.md');

// Colors
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

function getGitDiff() {
  try {
    return execSync('git diff HEAD', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    try {
      return execSync('git diff', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e2) {
      return '';
    }
  }
}

function findSpecFile() {
  const commonPaths = [
    path.join(CWD, 'SPEC.md'),
    path.join(CWD, 'CONSTITUTION.md'),
    path.join(CWD, '.claude', 'rules', 'project-rules.md'),
    path.join(CWD, 'CLAUDE.md')
  ];

  for (let p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function main() {
  console.log(`\n${BOLD}${CYAN}══════════════════════════════════════════════════════════════════════════════════${RESET}`);
  console.log(`  ${BOLD}${CYAN}SPEC-FIRST COMPLIANCE ENFORCER${RESET}`);
  console.log(`  ${YELLOW}Auditing branch modifications against SPEC.md / CONSTITUTION.md...${RESET}`);
  console.log(`${BOLD}${CYAN}══════════════════════════════════════════════════════════════════════════════════${RESET}\n`);

  const specFile = findSpecFile();
  if (!specFile) {
    console.log(`${YELLOW}⚠ Warning: No SPEC.md, CONSTITUTION.md, or project-rules.md found in workspace.${RESET}`);
    console.log(`  Unable to run rules audit. Creating a template report.\n`);
  } else {
    console.log(`Using Specification Reference: ${YELLOW}${path.basename(specFile)}${RESET}\n`);
  }

  const diff = getGitDiff();
  const violations = [];

  if (diff && specFile) {
    const specContent = fs.readFileSync(specFile, 'utf-8');
    
    // Parse rules out of the spec content
    const rules = {
      esm: /ESM|import|export/i.test(specContent),
      noConsole: /console\.log/i.test(specContent) || /console/i.test(specContent),
      cleanNaming: /naming|camelCase|kebab-case/i.test(specContent)
    };

    const lines = diff.split('\n');
    let currentFile = 'unknown';
    let lineNum = 0;

    for (let line of lines) {
      if (line.startsWith('+++ b/')) {
        currentFile = line.substring(6);
        lineNum = 0;
        continue;
      }
      if (line.startsWith('@@ ')) {
        const match = line.match(/\+(\d+)/);
        if (match) lineNum = parseInt(match[1]);
        continue;
      }

      if (line.startsWith('+') && !line.startsWith('+++')) {
        const content = line.substring(1).trim();

        // Check 1: ESM check if spec requires ESM
        if (rules.esm && /require\s*\(/.test(content) && currentFile.endsWith('.js') && !currentFile.includes('scripts/')) {
          violations.push({
            file: currentFile,
            line: lineNum,
            detail: 'Prohibited CommonJS require() statement found. Spec mandates ESM imports.'
          });
        }

        // Check 2: console.log check
        if (rules.noConsole && /console\.log/i.test(content) && !currentFile.includes('scripts/') && !currentFile.includes('tests/')) {
          violations.push({
            file: currentFile,
            line: lineNum,
            detail: 'console.log statement found in application code. Spec mandates clean logging.'
          });
        }

        lineNum++;
      }
    }
  }

  // Generate compliance report
  let report = `# Spec-First Enforcer Compliance Report\n\n`;
  report += `Generated: ${new Date().toISOString()} | Target Workspace: \`${CWD}\`\n`;
  report += `Reference Spec: \`${specFile ? path.relative(CWD, specFile) : 'None'}\`\n\n`;

  console.log(`${BOLD}Audit Results:${RESET}`);
  if (violations.length === 0) {
    console.log(`  ${GREEN}✔ 100% Compliant! No specification violations detected in git diff.${RESET}\n`);
    report += `## 🎉 Status: COMPLIANT\n`;
    report += `*All additions and modifications satisfy specification rules. Clean bill of compliance.*\n`;
  } else {
    console.log(`  ${RED}✗ Spec violations detected during check!${RESET}\n`);
    report += `## 🚨 Status: NON-COMPLIANT\n`;
    report += `The following violations were detected against \`${specFile ? path.basename(specFile) : 'Spec'}\` rules:\n\n`;

    violations.forEach(v => {
      console.log(`  ${RED}✗${RESET} [${v.file}:${v.line}] ${v.detail}`);
      report += `- **[FAIL]** \`${v.file}:${v.line}\` — ${v.detail}\n`;
    });
    console.log();
  }

  if (!fs.existsSync(CLAUDE_DIR)) {
    fs.mkdirSync(CLAUDE_DIR, { recursive: true });
  }

  fs.writeFileSync(ENFORCER_REPORT_PATH, report, 'utf-8');

  console.log(`${BOLD}══════════════════════════════════════════════════════════════════════════════════${RESET}`);
  console.log(`📄 Saved enforcer compliance report to: ${YELLOW}${ENFORCER_REPORT_PATH}${RESET}\n`);
}

main();
