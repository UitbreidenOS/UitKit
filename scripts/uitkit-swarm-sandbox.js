#!/usr/bin/env node

/**
 * claudient-swarm-sandbox.js
 *
 * Multi-agent sandbox orchestration CLI
 * Commands: init, run, validate, cleanup
 *
 * Usage:
 *   claudient swarm-sandbox init <name> [--agents=N] [--dry-run] [--verbose]
 *   claudient swarm-sandbox run <name> [--timeout=ms] [--dry-run] [--verbose] [--report=json]
 *   claudient swarm-sandbox validate <name> [--dry-run] [--verbose] [--report=json]
 *   claudient swarm-sandbox cleanup <name> [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawnSync } = require('child_process');

// Colors
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[0m';

// Sandbox paths
const SANDBOXES_ROOT = path.join(os.homedir(), '.claude', 'swarm-sandboxes');
const MANIFEST_NAME = 'sandbox-manifest.json';

// ==============================================================================
// UTILITIES
// ==============================================================================

function generateId() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

function log(msg, level = 'INFO') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  let prefix = `[${timestamp}] `;

  switch (level) {
    case 'ERROR':
      prefix += `${RED}[ERROR]${RESET}`;
      break;
    case 'SUCCESS':
      prefix += `${GREEN}[✓]${RESET}`;
      break;
    case 'WARN':
      prefix += `${YELLOW}[!]${RESET}`;
      break;
    case 'DEBUG':
      prefix += `${GRAY}[DEBUG]${RESET}`;
      break;
    default:
      prefix += `${CYAN}[INFO]${RESET}`;
  }

  console.log(`${prefix} ${msg}`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    command: args[0],
    name: args[1],
    flags: {}
  };

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, val] = arg.substring(2).split('=');
      parsed.flags[key] = val === undefined ? true : val;
    } else if (arg.startsWith('-')) {
      parsed.flags[arg.substring(1)] = true;
    }
  }

  return parsed;
}

function validateSandboxName(name) {
  if (!name || !/^[a-z0-9_-]+$/.test(name)) {
    throw new Error('Sandbox name must be lowercase alphanumeric with hyphens/underscores');
  }
  return true;
}

// ==============================================================================
// MANIFEST MANAGEMENT
// ==============================================================================

function createManifest(name, agentCount = 3) {
  return {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'initialized',
    config: {
      agentCount,
      timeoutMs: 30000,
      maxRetries: 3,
      isolationLevel: 'strict'
    },
    agents: Array.from({ length: agentCount }, (_, i) => ({
      id: `agent-${i + 1}`,
      role: `specialist-${i + 1}`,
      status: 'idle',
      createdAt: new Date().toISOString()
    })),
    executions: [],
    validations: [],
    logs: []
  };
}

function loadManifest(sandboxPath) {
  const manifestPath = path.join(sandboxPath, MANIFEST_NAME);
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

function saveManifest(sandboxPath, manifest) {
  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(
    path.join(sandboxPath, MANIFEST_NAME),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
}

// ==============================================================================
// INIT: Scaffold new sandbox environment
// ==============================================================================

function cmdInit() {
  const { name, flags } = parseArgs();
  const verbose = flags.verbose || flags.v;
  const dryRun = flags['dry-run'];
  const agentCount = parseInt(flags.agents || '3', 10);

  if (!name) {
    throw new Error('Sandbox name required. Usage: claudient swarm-sandbox init <name>');
  }

  validateSandboxName(name);

  if (agentCount < 1 || agentCount > 20) {
    throw new Error('--agents must be between 1 and 20');
  }

  const sandboxPath = path.join(SANDBOXES_ROOT, name);

  if (fs.existsSync(sandboxPath)) {
    throw new Error(`Sandbox "${name}" already exists at ${sandboxPath}`);
  }

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}SWARM SANDBOX INITIALIZER${RESET}`);
  console.log(`  ${YELLOW}Scaffolding multi-agent execution environment...${RESET}`);
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

  log(`Sandbox: ${BOLD}${name}${RESET}`, 'INFO');
  log(`Agents: ${BOLD}${agentCount}${RESET}`, 'INFO');
  log(`Dry-run: ${dryRun ? 'YES' : 'NO'}`, 'INFO');

  if (!dryRun) {
    // Create directory structure
    const dirs = [
      sandboxPath,
      path.join(sandboxPath, 'agents'),
      path.join(sandboxPath, 'executions'),
      path.join(sandboxPath, 'logs'),
      path.join(sandboxPath, 'artifacts')
    ];

    dirs.forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
      if (verbose) log(`Created: ${dir}`, 'DEBUG');
    });

    // Create manifest
    const manifest = createManifest(name, agentCount);
    saveManifest(sandboxPath, manifest);
    log(`Manifest created: ${MANIFEST_NAME}`, 'SUCCESS');

    // Generate agent configs
    manifest.agents.forEach(agent => {
      const agentConfig = {
        id: agent.id,
        role: agent.role,
        model: 'claude-haiku-4-5-20251001',
        systemPrompt: `You are a ${agent.role} in a multi-agent collaboration swarm.
Your responsibilities:
- Execute domain-specific tasks with precision
- Provide structured output for downstream validation
- Report errors transparently and propose recovery steps
- Respect timeout and resource constraints
- Coordinate with other agents via shared context`,
        capabilities: ['analysis', 'validation', 'coordination'],
        maxTokens: 8000,
        temperature: 0.7
      };

      const agentPath = path.join(sandboxPath, 'agents', `${agent.id}.json`);
      fs.writeFileSync(agentPath, JSON.stringify(agentConfig, null, 2), 'utf-8');
      if (verbose) log(`Agent config: ${agent.id}`, 'DEBUG');
    });

    // Create .sandbox config file
    const sandboxConfig = {
      version: '1.0.0',
      name,
      rootPath: sandboxPath,
      createdAt: new Date().toISOString(),
      metadata: {
        agentCount,
        isolation: 'fs-backed',
        persistence: 'json'
      }
    };

    fs.writeFileSync(
      path.join(sandboxPath, '.sandboxrc'),
      JSON.stringify(sandboxConfig, null, 2),
      'utf-8'
    );

    log(`${GREEN}✔ Sandbox initialized successfully${RESET}`, 'SUCCESS');
    console.log(`\n${BOLD}Sandbox path:${RESET} ${sandboxPath}`);
    console.log(`${BOLD}Manifest:${RESET} ${path.join(sandboxPath, MANIFEST_NAME)}`);
    console.log(`${BOLD}Agent count:${RESET} ${agentCount}\n`);
  } else {
    log(`${YELLOW}[DRY-RUN] Would create sandbox at: ${sandboxPath}${RESET}`, 'WARN');
  }
}

// ==============================================================================
// RUN: Execute sandbox with agents
// ==============================================================================

function cmdRun() {
  const { name, flags } = parseArgs();
  const verbose = flags.verbose || flags.v;
  const dryRun = flags['dry-run'];
  const timeoutMs = parseInt(flags.timeout || '30000', 10);
  const reportFormat = flags.report || 'text';

  if (!name) {
    throw new Error('Sandbox name required. Usage: claudient swarm-sandbox run <name>');
  }

  validateSandboxName(name);

  const sandboxPath = path.join(SANDBOXES_ROOT, name);
  if (!fs.existsSync(sandboxPath)) {
    throw new Error(`Sandbox "${name}" not found at ${sandboxPath}`);
  }

  const manifest = loadManifest(sandboxPath);
  if (!manifest) {
    throw new Error(`Invalid sandbox: missing ${MANIFEST_NAME}`);
  }

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}SWARM SANDBOX EXECUTOR${RESET}`);
  console.log(`  ${YELLOW}Orchestrating multi-agent task execution...${RESET}`);
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

  log(`Sandbox: ${BOLD}${name}${RESET}`, 'INFO');
  log(`Agents: ${BOLD}${manifest.agents.length}${RESET}`, 'INFO');
  log(`Timeout: ${BOLD}${timeoutMs}ms${RESET}`, 'INFO');
  log(`Report: ${BOLD}${reportFormat}${RESET}`, 'INFO');

  const executionId = generateId();
  const executionDir = path.join(sandboxPath, 'executions', executionId);
  const executionLog = {
    id: executionId,
    startedAt: new Date().toISOString(),
    agents: [],
    results: []
  };

  if (!dryRun) {
    fs.mkdirSync(executionDir, { recursive: true });

    // Simulate agent execution
    manifest.agents.forEach((agent, idx) => {
      if (verbose) log(`Spawning ${agent.id}...`, 'DEBUG');

      const agentLog = {
        agentId: agent.id,
        status: 'running',
        startedAt: new Date().toISOString(),
        output: null,
        error: null
      };

      // Simulate work (in real scenario, spawn Claude API calls)
      const taskResult = {
        agentId: agent.id,
        taskId: `task-${idx + 1}`,
        status: 'completed',
        result: {
          analysis: `Analysis from ${agent.id}`,
          confidence: 0.95,
          timestamp: new Date().toISOString()
        }
      };

      agentLog.status = 'completed';
      agentLog.completedAt = new Date().toISOString();
      agentLog.output = taskResult;

      executionLog.agents.push(agentLog);
      executionLog.results.push(taskResult);

      if (verbose) log(`${agent.id} completed`, 'DEBUG');
    });

    executionLog.completedAt = new Date().toISOString();
    executionLog.status = 'completed';

    // Save execution log
    fs.writeFileSync(
      path.join(executionDir, 'execution.json'),
      JSON.stringify(executionLog, null, 2),
      'utf-8'
    );

    // Update manifest
    manifest.executions.push({
      id: executionId,
      timestamp: new Date().toISOString(),
      agentCount: manifest.agents.length,
      status: 'completed'
    });
    manifest.status = 'running';
    saveManifest(sandboxPath, manifest);

    log(`${GREEN}✔ Execution completed${RESET}`, 'SUCCESS');

    // Output results
    if (reportFormat === 'json') {
      console.log(JSON.stringify(executionLog, null, 2));
    } else {
      console.log(`\n${BOLD}Execution Summary:${RESET}`);
      console.log(`  ID: ${executionId}`);
      console.log(`  Status: ${GREEN}completed${RESET}`);
      console.log(`  Agents: ${executionLog.agents.length}`);
      console.log(`  Results: ${executionLog.results.length}\n`);
    }
  } else {
    log(`${YELLOW}[DRY-RUN] Would execute ${manifest.agents.length} agents${RESET}`, 'WARN');
  }
}

// ==============================================================================
// VALIDATE: Verify sandbox integrity and execution results
// ==============================================================================

function cmdValidate() {
  const { name, flags } = parseArgs();
  const verbose = flags.verbose || flags.v;
  const dryRun = flags['dry-run'];
  const reportFormat = flags.report || 'text';

  if (!name) {
    throw new Error('Sandbox name required. Usage: claudient swarm-sandbox validate <name>');
  }

  validateSandboxName(name);

  const sandboxPath = path.join(SANDBOXES_ROOT, name);
  if (!fs.existsSync(sandboxPath)) {
    throw new Error(`Sandbox "${name}" not found at ${sandboxPath}`);
  }

  const manifest = loadManifest(sandboxPath);
  if (!manifest) {
    throw new Error(`Invalid sandbox: missing ${MANIFEST_NAME}`);
  }

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}SWARM SANDBOX VALIDATOR${RESET}`);
  console.log(`  ${YELLOW}Verifying sandbox integrity and execution results...${RESET}`);
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

  const validationReport = {
    sandboxId: manifest.id,
    sandboxName: name,
    timestamp: new Date().toISOString(),
    checks: []
  };

  // Check 1: Manifest validity
  const manifestCheck = {
    name: 'Manifest Integrity',
    status: 'passed',
    details: []
  };

  if (!manifest.id || !manifest.name || !manifest.createdAt) {
    manifestCheck.status = 'failed';
    manifestCheck.details.push('Missing required manifest fields');
  } else {
    manifestCheck.details.push(`ID: ${manifest.id}`);
    manifestCheck.details.push(`Agents: ${manifest.agents.length}`);
  }

  validationReport.checks.push(manifestCheck);
  log(`Manifest: ${manifestCheck.status.toUpperCase()}`, manifestCheck.status === 'passed' ? 'SUCCESS' : 'ERROR');

  // Check 2: Directory structure
  const structureCheck = {
    name: 'Directory Structure',
    status: 'passed',
    details: []
  };

  const requiredDirs = ['agents', 'executions', 'logs', 'artifacts'];
  requiredDirs.forEach(dir => {
    const dirPath = path.join(sandboxPath, dir);
    if (fs.existsSync(dirPath)) {
      structureCheck.details.push(`${BOLD}${dir}:${RESET} ${GREEN}exists${RESET}`);
    } else {
      structureCheck.status = 'failed';
      structureCheck.details.push(`${BOLD}${dir}:${RESET} ${RED}missing${RESET}`);
    }
  });

  validationReport.checks.push(structureCheck);
  log(`Structure: ${structureCheck.status.toUpperCase()}`, structureCheck.status === 'passed' ? 'SUCCESS' : 'ERROR');

  // Check 3: Agent configs
  const agentCheck = {
    name: 'Agent Configurations',
    status: 'passed',
    details: []
  };

  manifest.agents.forEach(agent => {
    const configPath = path.join(sandboxPath, 'agents', `${agent.id}.json`);
    if (fs.existsSync(configPath)) {
      agentCheck.details.push(`${BOLD}${agent.id}:${RESET} ${GREEN}ok${RESET}`);
    } else {
      agentCheck.status = 'failed';
      agentCheck.details.push(`${BOLD}${agent.id}:${RESET} ${RED}missing${RESET}`);
    }
  });

  validationReport.checks.push(agentCheck);
  log(`Agents: ${agentCheck.status.toUpperCase()}`, agentCheck.status === 'passed' ? 'SUCCESS' : 'ERROR');

  // Check 4: Execution history
  const execCheck = {
    name: 'Execution History',
    status: 'passed',
    details: [
      `Total executions: ${manifest.executions.length}`,
      `Last execution: ${manifest.executions.length > 0 ? manifest.executions[manifest.executions.length - 1].id : 'none'}`
    ]
  };

  validationReport.checks.push(execCheck);
  log(`Executions: ${execCheck.status.toUpperCase()}`, 'INFO');

  if (!dryRun) {
    // Save validation report
    const reportPath = path.join(sandboxPath, 'logs', `validation-${Date.now()}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(validationReport, null, 2), 'utf-8');

    log(`Report saved: ${reportPath}`, 'INFO');
  }

  // Output results
  if (reportFormat === 'json') {
    console.log(JSON.stringify(validationReport, null, 2));
  } else {
    console.log(`\n${BOLD}Validation Results:${RESET}`);
    validationReport.checks.forEach(check => {
      const statusColor = check.status === 'passed' ? GREEN : RED;
      console.log(`  ${BOLD}${check.name}:${RESET} ${statusColor}${check.status.toUpperCase()}${RESET}`);
      check.details.forEach(detail => console.log(`    - ${detail}`));
    });
    console.log();
  }
}

// ==============================================================================
// CLEANUP: Remove sandbox and associated resources
// ==============================================================================

function cmdCleanup() {
  const { name, flags } = parseArgs();
  const verbose = flags.verbose || flags.v;
  const dryRun = flags['dry-run'];

  if (!name) {
    throw new Error('Sandbox name required. Usage: claudient swarm-sandbox cleanup <name>');
  }

  validateSandboxName(name);

  const sandboxPath = path.join(SANDBOXES_ROOT, name);
  if (!fs.existsSync(sandboxPath)) {
    throw new Error(`Sandbox "${name}" not found at ${sandboxPath}`);
  }

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}SWARM SANDBOX CLEANUP${RESET}`);
  console.log(`  ${YELLOW}Removing sandbox and associated resources...${RESET}`);
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

  log(`Target: ${BOLD}${name}${RESET}`, 'INFO');
  log(`Path: ${sandboxPath}`, 'WARN');

  if (!dryRun) {
    // Recursive directory removal
    function removeDir(dirPath) {
      if (!fs.existsSync(dirPath)) return;

      fs.readdirSync(dirPath).forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          removeDir(filePath);
        } else {
          fs.unlinkSync(filePath);
          if (verbose) log(`Removed: ${filePath}`, 'DEBUG');
        }
      });

      fs.rmdirSync(dirPath);
      if (verbose) log(`Removed directory: ${dirPath}`, 'DEBUG');
    }

    removeDir(sandboxPath);
    log(`${GREEN}✔ Sandbox removed${RESET}`, 'SUCCESS');
  } else {
    log(`${YELLOW}[DRY-RUN] Would remove: ${sandboxPath}${RESET}`, 'WARN');
  }
}

// ==============================================================================
// MAIN
// ==============================================================================

function main() {
  try {
    const { command } = parseArgs();

    // Create sandboxes root if needed
    if (!fs.existsSync(SANDBOXES_ROOT)) {
      fs.mkdirSync(SANDBOXES_ROOT, { recursive: true });
    }

    switch (command) {
      case 'init':
        cmdInit();
        break;
      case 'run':
        cmdRun();
        break;
      case 'validate':
        cmdValidate();
        break;
      case 'cleanup':
        cmdCleanup();
        break;
      default:
        console.log(`\n${BOLD}${CYAN}claudient swarm-sandbox${RESET} - Multi-agent execution sandbox\n`);
        console.log(`${BOLD}Commands:${RESET}`);
        console.log(`  init <name>        Scaffold new sandbox environment`);
        console.log(`  run <name>         Execute agents in sandbox`);
        console.log(`  validate <name>    Verify sandbox integrity and results`);
        console.log(`  cleanup <name>     Remove sandbox and resources\n`);
        console.log(`${BOLD}Options:${RESET}`);
        console.log(`  --agents=N         Number of agents (1-20, default: 3)`);
        console.log(`  --timeout=ms       Execution timeout in milliseconds (default: 30000)`);
        console.log(`  --dry-run          Preview changes without executing`);
        console.log(`  --verbose, -v      Enable verbose output`);
        console.log(`  --report=json      Output results as JSON\n`);
        console.log(`${BOLD}Examples:${RESET}`);
        console.log(`  npx claudient swarm-sandbox init my-sandbox --agents=5`);
        console.log(`  npx claudient swarm-sandbox run my-sandbox --timeout=60000`);
        console.log(`  npx claudient swarm-sandbox validate my-sandbox --report=json`);
        console.log(`  npx claudient swarm-sandbox cleanup my-sandbox --dry-run\n`);
        break;
    }
  } catch (error) {
    console.error(`\n${RED}${BOLD}Error:${RESET} ${error.message}\n`);
    process.exit(1);
  }
}

main();
