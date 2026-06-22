#!/usr/bin/env node

/**
 * swarm-sandbox-init.js
 *
 * Scaffolds isolated sandbox environment for multi-agent swarm testing
 * - Creates temporary directory with namespaced structure
 * - Generates mock .env files for agent isolation
 * - Establishes isolation flags for council.js integration
 * - Sets up execution context and validation gates
 *
 * Usage:
 *   node scripts/swarm-sandbox-init.js [options]
 *
 * Options:
 *   --name <name>              Sandbox name (default: sandbox-<timestamp>)
 *   --temp-dir <path>          Custom temp directory (default: system temp)
 *   --agents <N>               Number of agents (default: 3, max: 20)
 *   --isolation <level>        strict | moderate | loose (default: strict)
 *   --council                  Create council.js isolation flags
 *   --env-vars <json>          Extra env vars as JSON string
 *   --verbose, -v              Enable verbose logging
 *   --dry-run                  Preview without creating files
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Colors
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[0m';

// ============================================================================
// UTILITIES
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    flags: {}
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, val] = arg.substring(2).split('=');
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        parsed.flags[key] = args[++i];
      } else {
        parsed.flags[key] = val === undefined ? true : val;
      }
    } else if (arg.startsWith('-')) {
      parsed.flags[arg.substring(1)] = true;
    }
  }

  return parsed;
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

function generateId(prefix = '') {
  const random = crypto.randomBytes(6).toString('hex');
  return prefix ? `${prefix}-${random}` : random;
}

function validateSandboxName(name) {
  if (!name || !/^[a-z0-9_-]+$/.test(name)) {
    throw new Error('Sandbox name must be lowercase alphanumeric with hyphens/underscores');
  }
  return true;
}

// ============================================================================
// SANDBOX STRUCTURE
// ============================================================================

function createSandboxStructure(rootPath) {
  const dirs = [
    rootPath,
    path.join(rootPath, 'agents'),
    path.join(rootPath, 'env'),
    path.join(rootPath, 'context'),
    path.join(rootPath, 'logs'),
    path.join(rootPath, 'cache'),
    path.join(rootPath, 'artifacts'),
    path.join(rootPath, 'isolation')
  ];

  return dirs;
}

// ============================================================================
// .ENV GENERATION
// ============================================================================

function generateMockEnv(sandboxId, agentId, isolationLevel, extraVars = {}) {
  const env = {
    // Sandbox identity
    SANDBOX_ID: sandboxId,
    SANDBOX_AGENT_ID: agentId,
    SANDBOX_ISOLATION_LEVEL: isolationLevel,
    SANDBOX_CREATED_AT: new Date().toISOString(),

    // Agent execution context
    AGENT_NAME: agentId,
    AGENT_MODEL: 'claude-haiku-4-5-20251001',
    AGENT_MAX_TOKENS: '8000',
    AGENT_TEMPERATURE: '0.7',

    // Isolation flags
    SANDBOX_ISOLATED: 'true',
    SANDBOX_NAMESPACE: `sandbox-${sandboxId}`,
    SANDBOX_FS_ROOT: path.join(os.tmpdir(), `sandbox-${sandboxId}`),

    // Feature flags
    ENABLE_COUNCIL_HOOKS: 'true',
    ENABLE_VALIDATION_GATES: 'true',
    ENABLE_AUDIT_LOGGING: 'true',
    ENABLE_RESOURCE_LIMITS: isolationLevel === 'strict' ? 'true' : 'false',

    // Resource constraints
    MAX_MEMORY_MB: '512',
    MAX_EXECUTION_MS: '30000',
    MAX_FILE_SIZE_MB: '10',
    MAX_RETRIES: '3',

    // Logging
    LOG_LEVEL: 'debug',
    LOG_FILE: path.join(os.tmpdir(), `sandbox-${sandboxId}`, 'logs', `${agentId}.log`),
    ENABLE_TRACE_LOGS: 'false',

    // Integration
    COUNCIL_ENABLED: 'true',
    COUNCIL_NAMESPACE: `council-${sandboxId}`,
    SWARM_MODE: 'multi-agent',

    // Extra custom vars
    ...extraVars
  };

  return env;
}

function envToString(envObj) {
  return Object.entries(envObj)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

// ============================================================================
// ISOLATION FLAGS FOR council.js
// ============================================================================

function generateCouncilIsolationFlags(sandboxId, agentCount, isolationLevel) {
  return {
    // Sandbox metadata
    sandboxId,
    sandboxCreatedAt: new Date().toISOString(),
    agentCount,
    isolationLevel,

    // Execution mode
    executionMode: 'sandboxed',
    councilEnabled: true,
    multiAgentMode: true,

    // Resource isolation
    fileSystemIsolation: isolationLevel === 'strict' ? true : false,
    networkIsolation: isolationLevel === 'strict' ? true : false,
    processIsolation: isolationLevel === 'strict' ? true : false,
    environmentIsolation: isolationLevel === 'strict' ? true : false,

    // Feature gates
    features: {
      agentCoordination: true,
      taskQueue: true,
      resultAggregation: true,
      errorRecovery: true,
      timeoutEnforcement: true,
      resourceMonitoring: true,
      auditLogging: true
    },

    // Validation gates
    validationGates: {
      preExecution: true,
      postExecution: true,
      perAgentValidation: true,
      aggregatedValidation: true
    },

    // Constraints
    constraints: {
      maxExecutionTimeMs: 30000,
      maxMemoryMb: 512,
      maxRetries: 3,
      maxConcurrentAgents: agentCount
    },

    // Paths (sandbox-namespaced)
    paths: {
      root: path.join(os.tmpdir(), `sandbox-${sandboxId}`),
      agents: path.join(os.tmpdir(), `sandbox-${sandboxId}`, 'agents'),
      logs: path.join(os.tmpdir(), `sandbox-${sandboxId}`, 'logs'),
      cache: path.join(os.tmpdir(), `sandbox-${sandboxId}`, 'cache'),
      artifacts: path.join(os.tmpdir(), `sandbox-${sandboxId}`, 'artifacts'),
      isolation: path.join(os.tmpdir(), `sandbox-${sandboxId}`, 'isolation')
    },

    // Flags that council.js can check
    __SANDBOX_MODE__: true,
    __ISOLATION_ENABLED__: isolationLevel !== 'loose',
    __COUNCIL_NAMESPACE__: `council-${sandboxId}`,
    __ENFORCE_CONSTRAINTS__: true
  };
}

// ============================================================================
// SANDBOX MANIFEST
// ============================================================================

function createSandboxManifest(sandboxId, name, agentCount, isolationLevel, sandboxPath) {
  return {
    version: '1.0.0',
    sandboxId,
    name,
    createdAt: new Date().toISOString(),
    path: sandboxPath,
    config: {
      agentCount,
      isolationLevel,
      councilEnabled: true,
      multiAgent: true
    },
    agents: Array.from({ length: agentCount }, (_, i) => ({
      id: `agent-${i + 1}`,
      name: `specialist-${i + 1}`,
      envFile: `agent-${i + 1}.env`,
      configFile: `agent-${i + 1}.json`,
      isolationFlags: generateCouncilIsolationFlags(sandboxId, agentCount, isolationLevel)
    })),
    isolationFlags: generateCouncilIsolationFlags(sandboxId, agentCount, isolationLevel),
    status: 'initialized'
  };
}

// ============================================================================
// MAIN SCAFFOLDING
// ============================================================================

function scaffoldSandbox(verbose, dryRun, name, tempDir, agentCount, isolationLevel, extraEnvVars, councilMode) {
  // Validate inputs
  if (agentCount < 1 || agentCount > 20) {
    throw new Error('Agent count must be between 1 and 20');
  }

  if (!['strict', 'moderate', 'loose'].includes(isolationLevel)) {
    throw new Error('Isolation level must be: strict, moderate, or loose');
  }

  // Generate sandbox ID and name
  const sandboxId = generateId('sandbox');
  const sandboxName = name || `sandbox-${Date.now()}`;
  validateSandboxName(sandboxName);

  // Determine root path
  const baseTemp = tempDir || os.tmpdir();
  const sandboxPath = path.join(baseTemp, `sandbox-${sandboxId}`);

  if (verbose) {
    log(`Sandbox ID: ${BOLD}${sandboxId}${RESET}`, 'DEBUG');
    log(`Sandbox Name: ${BOLD}${sandboxName}${RESET}`, 'DEBUG');
    log(`Root Path: ${BOLD}${sandboxPath}${RESET}`, 'DEBUG');
    log(`Agents: ${BOLD}${agentCount}${RESET}`, 'DEBUG');
    log(`Isolation: ${BOLD}${isolationLevel}${RESET}`, 'DEBUG');
  }

  // Parse extra env vars
  let parsedExtraVars = {};
  if (extraEnvVars) {
    try {
      parsedExtraVars = JSON.parse(extraEnvVars);
    } catch (e) {
      throw new Error(`Invalid JSON for --env-vars: ${e.message}`);
    }
  }

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}SWARM SANDBOX INITIALIZATION${RESET}`);
  console.log(`  ${YELLOW}Scaffolding isolated execution environment${RESET}`);
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

  log(`Name: ${BOLD}${sandboxName}${RESET}`, 'INFO');
  log(`Agents: ${BOLD}${agentCount}${RESET}`, 'INFO');
  log(`Isolation: ${BOLD}${isolationLevel}${RESET}`, 'INFO');
  log(`Council Mode: ${councilMode ? BOLD + 'ENABLED' + RESET : 'disabled'}`, 'INFO');
  log(`Dry-run: ${dryRun ? 'YES' : 'NO'}`, 'INFO');

  if (dryRun) {
    log(`${YELLOW}[DRY-RUN] No files will be created${RESET}`, 'WARN');
    console.log(`\n${BOLD}Directory Structure:${RESET}`);
    createSandboxStructure(sandboxPath).forEach(dir => {
      console.log(`  ${dir}`);
    });
    console.log(`\n${BOLD}Generated Files:${RESET}`);
    console.log(`  sandbox-manifest.json`);
    for (let i = 0; i < agentCount; i++) {
      console.log(`  env/agent-${i + 1}.env`);
      console.log(`  agents/agent-${i + 1}.json`);
      console.log(`  isolation/agent-${i + 1}.flags.json`);
    }
    console.log(`  isolation/council-flags.json`);
    return;
  }

  // Create directory structure
  const dirs = createSandboxStructure(sandboxPath);
  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
    if (verbose) log(`Created directory: ${dir}`, 'DEBUG');
  });
  log(`Directory structure created`, 'SUCCESS');

  // Create manifest
  const manifest = createSandboxManifest(sandboxId, sandboxName, agentCount, isolationLevel, sandboxPath);
  const manifestPath = path.join(sandboxPath, 'sandbox-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  log(`Manifest created: ${path.relative(process.cwd(), manifestPath)}`, 'SUCCESS');

  // Generate agent configs and .env files
  manifest.agents.forEach((agent, idx) => {
    // Generate .env file
    const envVars = generateMockEnv(sandboxId, agent.id, isolationLevel, parsedExtraVars);
    const envPath = path.join(sandboxPath, 'env', agent.envFile);
    fs.writeFileSync(envPath, envToString(envVars), 'utf-8');
    if (verbose) log(`Generated env: ${agent.id}`, 'DEBUG');

    // Generate agent config
    const agentConfig = {
      id: agent.id,
      name: agent.name,
      role: agent.name,
      model: envVars.AGENT_MODEL,
      maxTokens: parseInt(envVars.AGENT_MAX_TOKENS),
      temperature: parseFloat(envVars.AGENT_TEMPERATURE),
      sandbox: {
        id: sandboxId,
        isolationLevel,
        enabled: true
      },
      capabilities: ['analysis', 'validation', 'coordination', 'logging'],
      constraints: {
        maxMemoryMb: parseInt(envVars.MAX_MEMORY_MB),
        maxExecutionMs: parseInt(envVars.MAX_EXECUTION_MS),
        maxRetries: parseInt(envVars.MAX_RETRIES)
      },
      createdAt: new Date().toISOString()
    };
    const agentConfigPath = path.join(sandboxPath, 'agents', agent.envFile.replace('.env', '.json'));
    fs.writeFileSync(agentConfigPath, JSON.stringify(agentConfig, null, 2), 'utf-8');
    if (verbose) log(`Generated config: ${agent.id}`, 'DEBUG');

    // Generate isolation flags for council.js
    if (councilMode) {
      const isolationFlagsPath = path.join(sandboxPath, 'isolation', `${agent.id}.flags.json`);
      fs.writeFileSync(isolationFlagsPath, JSON.stringify(agent.isolationFlags, null, 2), 'utf-8');
      if (verbose) log(`Generated isolation flags: ${agent.id}`, 'DEBUG');
    }
  });

  log(`Agent configurations created (${agentCount})`, 'SUCCESS');

  // Create council-wide isolation flags if council mode enabled
  if (councilMode) {
    const councilFlags = generateCouncilIsolationFlags(sandboxId, agentCount, isolationLevel);
    const councilFlagsPath = path.join(sandboxPath, 'isolation', 'council-flags.json');
    fs.writeFileSync(councilFlagsPath, JSON.stringify(councilFlags, null, 2), 'utf-8');
    log(`Council isolation flags created`, 'SUCCESS');
  }

  // Create initialization marker file
  const initMarker = {
    timestamp: new Date().toISOString(),
    sandboxId,
    name: sandboxName,
    initialized: true,
    path: sandboxPath,
    councilMode
  };
  const markerPath = path.join(sandboxPath, '.sandbox-init');
  fs.writeFileSync(markerPath, JSON.stringify(initMarker, null, 2), 'utf-8');

  // Summary output
  console.log(`\n${BOLD}${GREEN}✔ Sandbox initialized successfully${RESET}\n`);
  console.log(`${BOLD}Sandbox Details:${RESET}`);
  console.log(`  Name: ${YELLOW}${sandboxName}${RESET}`);
  console.log(`  ID: ${YELLOW}${sandboxId}${RESET}`);
  console.log(`  Path: ${YELLOW}${sandboxPath}${RESET}`);
  console.log(`  Agents: ${YELLOW}${agentCount}${RESET}`);
  console.log(`  Isolation: ${YELLOW}${isolationLevel}${RESET}`);
  console.log(`  Council Mode: ${councilMode ? GREEN + 'enabled' + RESET : 'disabled'}\n`);

  console.log(`${BOLD}Key Files:${RESET}`);
  console.log(`  Manifest: ${path.join('env', 'sandbox-manifest.json')}`);
  console.log(`  Env Vars: ${path.join('env', 'agent-*.env')}`);
  console.log(`  Configs: ${path.join('agents', 'agent-*.json')}`);
  if (councilMode) {
    console.log(`  Isolation: ${path.join('isolation', '*.flags.json')}`);
  }
  console.log();

  console.log(`${BOLD}To use in council.js:${RESET}`);
  console.log(`  const flags = require('${path.relative(process.cwd(), path.join(sandboxPath, 'isolation', 'council-flags.json'))}');`);
  console.log(`  if (flags.__SANDBOX_MODE__) { /* handle sandbox context */ }`);
  console.log();

  // Export path for shell integration
  console.log(`${BOLD}Export:${RESET}`);
  console.log(`  export SANDBOX_PATH="${sandboxPath}"`);
  console.log(`  export SANDBOX_ID="${sandboxId}"`);
  console.log();
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  try {
    const { flags } = parseArgs();

    const name = flags.name;
    const tempDir = flags['temp-dir'];
    const agentCount = parseInt(flags.agents || '3', 10);
    const isolationLevel = flags.isolation || 'strict';
    const extraEnvVars = flags['env-vars'];
    const councilMode = flags.council || false;
    const verbose = flags.verbose || flags.v || false;
    const dryRun = flags['dry-run'] || false;

    scaffoldSandbox(verbose, dryRun, name, tempDir, agentCount, isolationLevel, extraEnvVars, councilMode);
  } catch (error) {
    console.error(`\n${RED}${BOLD}Error:${RESET} ${error.message}\n`);
    process.exit(1);
  }
}

main();
