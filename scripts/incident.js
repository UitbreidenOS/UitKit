#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const POST_MORTEM_PATH = path.join(CLAUDE_DIR, 'post-mortem.md');

// Colors
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

function getGitCommitLogs() {
  try {
    return execSync('git log --pretty=format:"%h - %an: %s" -n 5', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split('\n');
  } catch (e) {
    return [];
  }
}

function main() {
  console.log(`\n${BOLD}${CYAN}══════════════════════════════════════════════════════════════════════════════════${RESET}`);
  console.log(`  ${BOLD}${MAGENTA}THE INCIDENT COMMANDER: ALERTS TRIAGE${RESET}`);
  console.log(`  ${YELLOW}Responding to PagerDuty alerts, auditing commits, and drafting post-mortems...${RESET}`);
  console.log(`${BOLD}${CYAN}══════════════════════════════════════════════════════════════════════════════════${RESET}\n`);

  const args = process.argv.slice(2);
  let alert = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--alert' || args[i] === '-a') {
      alert = args[i + 1] || '';
      break;
    }
  }

  if (!alert) {
    alert = args.filter(a => !a.startsWith('-')).join(' ');
  }

  if (!alert) {
    alert = 'Database connection timeout (504 Gateway Error)';
  }

  console.log(`${BOLD}${RED}🚨 PRODUCTION INCIDENT DETECTED:${RESET} "${alert}"\n`);

  // 1. Audit recent commits
  console.log(`[Step 1] ${CYAN}Auditing recent commits for regression potential...${RESET}`);
  const commits = getGitCommitLogs();
  const auditedCommits = [];

  commits.forEach((commit, idx) => {
    const sha = commit.split(' ')[0];
    let riskRating = 'LOW';
    let riskColor = GREEN;

    // Simulate heuristics: changes modifying config, cli, or index are higher risk
    if (commit.includes('cli') || commit.includes('config') || commit.includes('workflow')) {
      riskRating = 'HIGH';
      riskColor = RED;
    } else if (idx === 0) {
      riskRating = 'MEDIUM';
      riskColor = YELLOW;
    }

    auditedCommits.push({
      commit,
      sha,
      risk: riskRating,
      color: riskColor
    });
  });

  auditedCommits.forEach(c => {
    console.log(`  - [${c.color}${c.risk}${RESET}] ${c.commit}`);
  });
  console.log();

  // 2. Propose remediation
  console.log(`[Step 2] ${CYAN}Synthesizing remediation path...${RESET}`);
  let primaryCulprit = auditedCommits.find(c => c.risk === 'HIGH') || auditedCommits[0];
  
  if (primaryCulprit) {
    console.log(`  👉 ${BOLD}Recommended Rollback Commit:${RESET} ${primaryCulprit.commit}`);
    console.log(`  👉 ${BOLD}Suggested command:${RESET} ${YELLOW}git revert ${primaryCulprit.sha}${RESET}\n`);
  } else {
    console.log(`  ${GREEN}✓ No obvious high-risk commit detected. Perform log audit.${RESET}\n`);
  }

  // 3. Draft Post-Mortem
  console.log(`[Step 3] ${CYAN}Drafting post-mortem report...${RESET}`);
  
  let pmContent = `# Production Incident Post-Mortem Report\n\n`;
  pmContent += `Date: ${new Date().toISOString()} | Target Workspace: \`${CWD}\`\n`;
  pmContent += `Trigger Alert: **${alert}**\n`;
  pmContent += `Triage Status: **REMEDIATED (Simulated)**\n\n`;
  
  pmContent += `## 🔍 Incident Timeline & Diagnostics\n`;
  pmContent += `- **00:00**: Alert triggered on monitoring logs.\n`;
  pmContent += `- **00:02**: Incident Commander spawned, auditing Git modifications.\n`;
  if (primaryCulprit) {
    pmContent += `- **00:05**: Isolated suspect commit \`${primaryCulprit.sha}\` (Risk Rating: ${primaryCulprit.risk}).\n`;
    pmContent += `- **00:06**: Proposed remediation path: \`git revert ${primaryCulprit.sha}\`.\n`;
  }
  
  pmContent += `\n## 📝 Audited Git Commits\n`;
  auditedCommits.forEach(c => {
    pmContent += `- **[${c.risk}]** \`${c.commit}\`\n`;
  });

  if (!fs.existsSync(CLAUDE_DIR)) {
    fs.mkdirSync(CLAUDE_DIR, { recursive: true });
  }

  fs.writeFileSync(POST_MORTEM_PATH, pmContent, 'utf-8');

  console.log(`${GREEN}✔ Post-mortem report drafted successfully.${RESET}`);
  console.log(`${BOLD}══════════════════════════════════════════════════════════════════════════════════${RESET}`);
  console.log(`📄 Saved post-mortem report to: ${YELLOW}${POST_MORTEM_PATH}${RESET}\n`);
}

main();
