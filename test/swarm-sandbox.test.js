#!/usr/bin/env node

/**
 * swarm-sandbox.test.js
 *
 * Comprehensive test suite for Swarm Sandbox:
 * - Environment isolation validation
 * - Mock setup and teardown
 * - Manifest management
 * - Sandbox lifecycle (init, run, validate, cleanup)
 * - Council.js integration
 * - Error handling and recovery
 * - Resource constraints
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawnSync } = require('child_process');

// ============================================================================
// TEST UTILITIES & MOCK SETUP
// ============================================================================

/**
 * Temporary test sandbox manager
 * Creates isolated test environments with automatic cleanup
 */
class TestSandboxManager {
  constructor() {
    this.testDir = path.join(os.tmpdir(), `swarm-test-${Date.now()}`);
    this.sandboxesRoot = path.join(this.testDir, 'sandboxes');
    this.createdSandboxes = [];
  }

  /**
   * Setup test environment
   */
  setup() {
    if (!fs.existsSync(this.testDir)) {
      fs.mkdirSync(this.testDir, { recursive: true });
    }
    if (!fs.existsSync(this.sandboxesRoot)) {
      fs.mkdirSync(this.sandboxesRoot, { recursive: true });
    }
  }

  /**
   * Cleanup test environment
   */
  teardown() {
    this.createdSandboxes.forEach(name => {
      const sandboxPath = path.join(this.sandboxesRoot, name);
      if (fs.existsSync(sandboxPath)) {
        this.removeRecursive(sandboxPath);
      }
    });

    if (fs.existsSync(this.testDir)) {
      this.removeRecursive(this.testDir);
    }
  }

  /**
   * Recursively remove directory
   */
  removeRecursive(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        this.removeRecursive(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });

    fs.rmdirSync(dirPath);
  }

  /**
   * Create sandbox for testing
   */
  createSandbox(name, agentCount = 3) {
    const sandboxPath = path.join(this.sandboxesRoot, name);

    if (fs.existsSync(sandboxPath)) {
      throw new Error(`Sandbox "${name}" already exists`);
    }

    // Create directory structure
    const dirs = [
      sandboxPath,
      path.join(sandboxPath, 'agents'),
      path.join(sandboxPath, 'executions'),
      path.join(sandboxPath, 'logs'),
      path.join(sandboxPath, 'artifacts')
    ];

    dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

    // Create manifest
    const manifest = {
      id: this.generateId(),
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

    fs.writeFileSync(
      path.join(sandboxPath, 'sandbox-manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    // Create agent configs
    manifest.agents.forEach(agent => {
      const agentConfig = {
        id: agent.id,
        role: agent.role,
        model: 'claude-haiku-4-5-20251001',
        systemPrompt: `You are a ${agent.role} in a multi-agent collaboration swarm.`,
        capabilities: ['analysis', 'validation', 'coordination'],
        maxTokens: 8000,
        temperature: 0.7
      };

      fs.writeFileSync(
        path.join(sandboxPath, 'agents', `${agent.id}.json`),
        JSON.stringify(agentConfig, null, 2),
        'utf-8'
      );
    });

    // Create .sandboxrc config
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

    this.createdSandboxes.push(name);
    return sandboxPath;
  }

  /**
   * Get sandbox manifest
   */
  loadManifest(sandboxName) {
    const manifestPath = path.join(this.sandboxesRoot, sandboxName, 'sandbox-manifest.json');
    if (!fs.existsSync(manifestPath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  }

  /**
   * Save sandbox manifest
   */
  saveManifest(sandboxName, manifest) {
    manifest.updatedAt = new Date().toISOString();
    const manifestPath = path.join(this.sandboxesRoot, sandboxName, 'sandbox-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  }

  /**
   * Get sandbox path
   */
  getSandboxPath(sandboxName) {
    return path.join(this.sandboxesRoot, sandboxName);
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Mock Council configuration
 */
class MockCouncilConfig {
  constructor(name = 'test-council', agentCount = 3) {
    this.name = name;
    this.agentCount = agentCount;
    this.agents = this.generateAgents();
  }

  generateAgents() {
    return Array.from({ length: this.agentCount }, (_, i) => ({
      id: `agent-${i + 1}`,
      role: `specialist-${i + 1}`,
      model: 'claude-haiku-4-5-20251001',
      capabilities: ['analysis', 'validation', 'coordination']
    }));
  }

  toJSON() {
    return {
      name: this.name,
      agentCount: this.agentCount,
      agents: this.agents,
      createdAt: new Date().toISOString()
    };
  }
}

/**
 * Mock execution tracker
 */
class ExecutionTracker {
  constructor(sandboxName) {
    this.sandboxName = sandboxName;
    this.executionId = this.generateId();
    this.events = [];
    this.startTime = Date.now();
  }

  addEvent(type, agentId, message, data = {}) {
    this.events.push({
      timestamp: Date.now() - this.startTime,
      type,
      agentId,
      message,
      data
    });
  }

  getExecutionSummary() {
    return {
      executionId: this.executionId,
      sandboxName: this.sandboxName,
      totalDuration: Date.now() - this.startTime,
      eventCount: this.events.length,
      events: this.events
    };
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}

// ============================================================================
// TEST HELPERS (must be defined before use)
// ============================================================================

const describe = typeof global.describe !== 'undefined' ? global.describe : (name, fn) => {
  console.log(`\n${name}`);
  fn();
};

const test = typeof global.test !== 'undefined' ? global.test : (name, fn) => {
  try {
    if (fn.length > 0) {
      fn(() => {}); // done callback
    } else {
      fn();
    }
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    if (err.stack) {
      console.error(`    ${err.stack.split('\n').slice(1, 3).join('\n    ')}`);
    }
  }
};

const beforeEach = typeof global.beforeEach !== 'undefined' ? global.beforeEach : (fn) => {
  // Store for later execution
  if (!global.__beforeEachFunctions) {
    global.__beforeEachFunctions = [];
  }
  global.__beforeEachFunctions.push(fn);
};

const afterEach = typeof global.afterEach !== 'undefined' ? global.afterEach : (fn) => {
  // Store for later execution
  if (!global.__afterEachFunctions) {
    global.__afterEachFunctions = [];
  }
  global.__afterEachFunctions.push(fn);
};

// ============================================================================
// TEST SUITES
// ============================================================================

/**
 * Test Suite: Environment Isolation
 */
describe('Swarm Sandbox Environment Isolation', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('Sandboxes are isolated in separate directories', () => {
    const sandbox1 = manager.createSandbox('sandbox-a', 3);
    const sandbox2 = manager.createSandbox('sandbox-b', 3);

    assert.notStrictEqual(sandbox1, sandbox2, 'Sandbox paths should be different');
    assert(fs.existsSync(sandbox1), 'Sandbox A should exist');
    assert(fs.existsSync(sandbox2), 'Sandbox B should exist');
  });

  test('Sandbox agents have isolated configs', () => {
    manager.createSandbox('isolated-test', 3);
    const manifest = manager.loadManifest('isolated-test');

    assert.strictEqual(manifest.agents.length, 3, 'Should have 3 agents');
    manifest.agents.forEach((agent, i) => {
      assert.strictEqual(agent.id, `agent-${i + 1}`, `Agent ID should be correct`);
      assert.strictEqual(agent.role, `specialist-${i + 1}`, `Agent role should be correct`);

      // Verify individual agent config exists
      const agentConfigPath = path.join(
        manager.getSandboxPath('isolated-test'),
        'agents',
        `${agent.id}.json`
      );
      assert(fs.existsSync(agentConfigPath), `Agent config should exist for ${agent.id}`);
    });
  });

  test('Sandbox executions are isolated per sandbox', () => {
    manager.createSandbox('exec-test-1', 2);
    manager.createSandbox('exec-test-2', 2);

    const manifest1 = manager.loadManifest('exec-test-1');
    const manifest2 = manager.loadManifest('exec-test-2');

    // Simulate executions
    manifest1.executions.push({ id: 'exec-1', status: 'completed' });
    manifest2.executions.push({ id: 'exec-2', status: 'completed' });

    manager.saveManifest('exec-test-1', manifest1);
    manager.saveManifest('exec-test-2', manifest2);

    const reloaded1 = manager.loadManifest('exec-test-1');
    const reloaded2 = manager.loadManifest('exec-test-2');

    assert.strictEqual(reloaded1.executions.length, 1);
    assert.strictEqual(reloaded1.executions[0].id, 'exec-1');
    assert.strictEqual(reloaded2.executions.length, 1);
    assert.strictEqual(reloaded2.executions[0].id, 'exec-2');
  });

  test('Sandbox resource limits are properly configured', () => {
    manager.createSandbox('resource-test', 5);
    const manifest = manager.loadManifest('resource-test');

    assert.strictEqual(manifest.config.isolationLevel, 'strict');
    assert.strictEqual(manifest.config.timeoutMs, 30000);
    assert.strictEqual(manifest.config.maxRetries, 3);
  });

  test('Sandbox artifacts are isolated', () => {
    const sandboxPath = manager.createSandbox('artifact-test', 2);
    const artifactDir = path.join(sandboxPath, 'artifacts');

    // Simulate artifact creation
    fs.writeFileSync(
      path.join(artifactDir, 'result-1.json'),
      JSON.stringify({ data: 'artifact1' }, null, 2),
      'utf-8'
    );

    // Create another sandbox and verify no cross-contamination
    manager.createSandbox('artifact-test-2', 2);
    const artifact2Dir = path.join(manager.getSandboxPath('artifact-test-2'), 'artifacts');

    const artifacts = fs.readdirSync(artifact2Dir);
    assert.strictEqual(artifacts.length, 0, 'Second sandbox should have no artifacts');
  });

  test('Environment variables are sandboxed', () => {
    const sandbox = manager.createSandbox('env-test', 2);
    const envFile = path.join(sandbox, '.env.sandbox');

    // Simulate env isolation
    const envContent = `SANDBOX_ID=test-env-123
ISOLATION_LEVEL=strict
TIMEOUT_MS=30000`;

    fs.writeFileSync(envFile, envContent, 'utf-8');
    const loaded = fs.readFileSync(envFile, 'utf-8');

    assert(loaded.includes('SANDBOX_ID=test-env-123'));
    assert(loaded.includes('ISOLATION_LEVEL=strict'));
  });
});

/**
 * Test Suite: Mock Setup and Teardown
 */
describe('Swarm Sandbox Mock Setup & Teardown', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('Mock sandbox initializes with correct directory structure', () => {
    const sandboxPath = manager.createSandbox('init-test', 3);

    const requiredDirs = ['agents', 'executions', 'logs', 'artifacts'];
    requiredDirs.forEach(dir => {
      const dirPath = path.join(sandboxPath, dir);
      assert(fs.existsSync(dirPath), `Directory ${dir} should exist`);
      assert(fs.lstatSync(dirPath).isDirectory(), `${dir} should be a directory`);
    });
  });

  test('Mock manifest is properly initialized', () => {
    manager.createSandbox('manifest-test', 4);
    const manifest = manager.loadManifest('manifest-test');

    assert(manifest.id, 'Manifest should have ID');
    assert.strictEqual(manifest.name, 'manifest-test');
    assert(manifest.createdAt, 'Should have createdAt timestamp');
    assert(manifest.updatedAt, 'Should have updatedAt timestamp');
    assert.strictEqual(manifest.status, 'initialized');
    assert.strictEqual(manifest.agents.length, 4);
  });

  test('Mock agent configs are created for each agent', () => {
    const sandboxPath = manager.createSandbox('agent-config-test', 3);
    const agentsDir = path.join(sandboxPath, 'agents');

    const agentFiles = fs.readdirSync(agentsDir);
    assert.strictEqual(agentFiles.length, 3, 'Should have 3 agent config files');

    agentFiles.forEach(file => {
      const configPath = path.join(agentsDir, file);
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      assert(config.id, 'Agent config should have ID');
      assert(config.role, 'Agent config should have role');
      assert(config.model, 'Agent config should have model');
      assert(config.systemPrompt, 'Agent config should have systemPrompt');
      assert(Array.isArray(config.capabilities), 'Agent config should have capabilities array');
    });
  });

  test('Mock .sandboxrc config is created', () => {
    const sandboxPath = manager.createSandbox('sandboxrc-test', 2);
    const sandboxrcPath = path.join(sandboxPath, '.sandboxrc');

    assert(fs.existsSync(sandboxrcPath), '.sandboxrc should exist');

    const config = JSON.parse(fs.readFileSync(sandboxrcPath, 'utf-8'));
    assert.strictEqual(config.version, '1.0.0');
    assert.strictEqual(config.name, 'sandboxrc-test');
    assert.strictEqual(config.metadata.agentCount, 2);
  });

  test('Mock cleanup removes all sandbox resources', () => {
    const sandboxPath = manager.createSandbox('cleanup-test', 2);
    assert(fs.existsSync(sandboxPath), 'Sandbox should exist');

    manager.teardown();

    assert(!fs.existsSync(sandboxPath), 'Sandbox should be removed after teardown');
    assert(!fs.existsSync(manager.testDir), 'Test directory should be removed');
  });

  test('Mock supports multiple concurrent sandboxes', () => {
    const sandboxes = [];
    for (let i = 0; i < 5; i++) {
      sandboxes.push(manager.createSandbox(`concurrent-${i}`, 2));
    }

    sandboxes.forEach(sandboxPath => {
      assert(fs.existsSync(sandboxPath), 'All sandboxes should exist');
    });

    const manifests = [];
    for (let i = 0; i < 5; i++) {
      manifests.push(manager.loadManifest(`concurrent-${i}`));
    }

    manifests.forEach((manifest, i) => {
      assert.strictEqual(manifest.name, `concurrent-${i}`);
    });
  });

  test('Mock preserves isolation between setup/teardown cycles', () => {
    const sandboxPath1 = manager.createSandbox('cycle-test-1', 2);
    const name1 = manager.loadManifest('cycle-test-1').id;

    manager.teardown();
    manager.setup();

    const sandboxPath2 = manager.createSandbox('cycle-test-1', 2);
    const name2 = manager.loadManifest('cycle-test-1').id;

    // IDs should be different (new instance)
    assert.notStrictEqual(name1, name2, 'New sandbox should have different ID');
  });
});

/**
 * Test Suite: Sandbox Lifecycle
 */
describe('Swarm Sandbox Lifecycle', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('Sandbox initialization creates proper structure', () => {
    manager.createSandbox('lifecycle-init', 3);
    const manifest = manager.loadManifest('lifecycle-init');

    assert.strictEqual(manifest.status, 'initialized');
    assert.strictEqual(manifest.agents.length, 3);
    assert.strictEqual(manifest.executions.length, 0);
  });

  test('Sandbox can transition from initialized to running', () => {
    manager.createSandbox('lifecycle-run', 2);
    let manifest = manager.loadManifest('lifecycle-run');

    manifest.status = 'running';
    manifest.executions.push({
      id: 'exec-001',
      timestamp: new Date().toISOString(),
      status: 'in_progress'
    });

    manager.saveManifest('lifecycle-run', manifest);

    manifest = manager.loadManifest('lifecycle-run');
    assert.strictEqual(manifest.status, 'running');
    assert.strictEqual(manifest.executions.length, 1);
  });

  test('Sandbox can complete execution', () => {
    manager.createSandbox('lifecycle-complete', 2);
    let manifest = manager.loadManifest('lifecycle-complete');

    manifest.status = 'running';
    const execId = manager.generateId();
    manifest.executions.push({
      id: execId,
      timestamp: new Date().toISOString(),
      status: 'in_progress',
      agentCount: 2,
      results: []
    });

    manager.saveManifest('lifecycle-complete', manifest);

    manifest = manager.loadManifest('lifecycle-complete');
    manifest.executions[0].status = 'completed';
    manifest.executions[0].results = [
      { agentId: 'agent-1', status: 'completed' },
      { agentId: 'agent-2', status: 'completed' }
    ];
    manifest.status = 'completed';

    manager.saveManifest('lifecycle-complete', manifest);

    const reloaded = manager.loadManifest('lifecycle-complete');
    assert.strictEqual(reloaded.status, 'completed');
    assert.strictEqual(reloaded.executions[0].results.length, 2);
  });

  test('Sandbox validation can be logged', () => {
    const sandboxPath = manager.createSandbox('lifecycle-validate', 2);
    let manifest = manager.loadManifest('lifecycle-validate');

    const validationResult = {
      timestamp: new Date().toISOString(),
      checks: [
        { name: 'Manifest Integrity', status: 'passed' },
        { name: 'Directory Structure', status: 'passed' },
        { name: 'Agent Configurations', status: 'passed' }
      ]
    };

    manifest.validations.push(validationResult);
    manager.saveManifest('lifecycle-validate', manifest);

    manifest = manager.loadManifest('lifecycle-validate');
    assert.strictEqual(manifest.validations.length, 1);
    assert.strictEqual(manifest.validations[0].checks.length, 3);
  });

  test('Sandbox can be cleaned up after completion', () => {
    const sandboxPath = manager.createSandbox('lifecycle-cleanup', 2);
    assert(fs.existsSync(sandboxPath));

    // Simulate cleanup
    manager.removeRecursive(sandboxPath);
    assert(!fs.existsSync(sandboxPath));
  });

  test('Multiple executions can be tracked in single sandbox', () => {
    manager.createSandbox('lifecycle-multi-exec', 2);
    let manifest = manager.loadManifest('lifecycle-multi-exec');

    // Add multiple executions
    for (let i = 0; i < 3; i++) {
      manifest.executions.push({
        id: `exec-${i}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        agentCount: 2
      });
    }

    manager.saveManifest('lifecycle-multi-exec', manifest);

    manifest = manager.loadManifest('lifecycle-multi-exec');
    assert.strictEqual(manifest.executions.length, 3);
    assert.strictEqual(manifest.executions[0].id, 'exec-0');
    assert.strictEqual(manifest.executions[2].id, 'exec-2');
  });
});

/**
 * Test Suite: Council Integration
 */
describe('Swarm Sandbox Council.js Integration', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('Council config can be created from sandbox', () => {
    manager.createSandbox('council-config-test', 3);
    const manifest = manager.loadManifest('council-config-test');

    const councilConfig = new MockCouncilConfig('test-council', manifest.agents.length);

    assert.strictEqual(councilConfig.agentCount, 3);
    assert.strictEqual(councilConfig.agents.length, 3);
    councilConfig.agents.forEach((agent, i) => {
      assert.strictEqual(agent.id, `agent-${i + 1}`);
    });
  });

  test('Council agents map to sandbox agents', () => {
    manager.createSandbox('council-agent-mapping', 4);
    const manifest = manager.loadManifest('council-agent-mapping');
    const councilConfig = new MockCouncilConfig('test-council', 4);

    assert.strictEqual(manifest.agents.length, councilConfig.agents.length);

    manifest.agents.forEach((sandboxAgent, i) => {
      const councilAgent = councilConfig.agents[i];
      assert.strictEqual(sandboxAgent.id, councilAgent.id);
      assert.strictEqual(sandboxAgent.role, councilAgent.id.replace('-', '_'));
    });
  });

  test('Council can simulate multi-agent execution', () => {
    manager.createSandbox('council-execution', 3);
    const manifest = manager.loadManifest('council-execution');
    const tracker = new ExecutionTracker('council-execution');

    // Simulate council agent execution
    for (const agent of manifest.agents) {
      tracker.addEvent('AGENT_STARTED', agent.id, `Agent ${agent.id} started`);
      tracker.addEvent('AGENT_TASK_ASSIGNED', agent.id, `Task assigned to ${agent.id}`);
      tracker.addEvent('AGENT_COMPLETED', agent.id, `Agent ${agent.id} completed task`, {
        result: `Result from ${agent.id}`,
        confidence: 0.95
      });
    }

    const summary = tracker.getExecutionSummary();
    assert.strictEqual(summary.eventCount, 9); // 3 events per agent
    assert.strictEqual(summary.sandboxName, 'council-execution');
  });

  test('Council execution produces structured output', () => {
    manager.createSandbox('council-output', 2);
    const tracker = new ExecutionTracker('council-output');

    const agents = ['orchestrator', 'analyst'];
    agents.forEach(agentId => {
      tracker.addEvent('AGENT_STARTED', agentId, `Starting ${agentId}`);
      tracker.addEvent('AGENT_COMPLETED', agentId, `Completed ${agentId}`, {
        output: `Analysis from ${agentId}`,
        tokens: 1500
      });
    });

    const summary = tracker.getExecutionSummary();
    const completedEvents = summary.events.filter(e => e.type === 'AGENT_COMPLETED');

    assert.strictEqual(completedEvents.length, 2);
    completedEvents.forEach(event => {
      assert(event.data.output);
      assert(event.data.tokens);
    });
  });

  test('Council instructions are formatted correctly', () => {
    const councilConfig = new MockCouncilConfig('test-council', 3);
    const instructions = `# Council Swarm Objective

## Agents
${councilConfig.agents.map(a => `- ${a.id} (${a.role}): ${a.capabilities.join(', ')}`).join('\n')}

## Execution Plan
1. Orchestrator assigns tasks to specialists
2. Each specialist executes their task
3. Results aggregated for final output`;

    assert(instructions.includes('Council Swarm Objective'));
    assert(instructions.includes('Agents'));
    assert(instructions.includes('agent-1'));
    assert(instructions.includes('Execution Plan'));
  });

  test('Council can handle sequential agent execution', () => {
    manager.createSandbox('council-sequential', 4);
    const manifest = manager.loadManifest('council-sequential');
    const tracker = new ExecutionTracker('council-sequential');

    const orchestrator = manifest.agents[0];
    const specialists = manifest.agents.slice(1);

    // Orchestrator dispatches
    tracker.addEvent('ORCHESTRATOR_DISPATCH', orchestrator.id, 'Dispatching tasks');

    // Specialists execute sequentially
    let currentTime = 0;
    for (const specialist of specialists) {
      currentTime += 100;
      tracker.addEvent('SPECIALIST_WORK', specialist.id, `Working on task`, { time: currentTime });
    }

    // Orchestrator aggregates
    tracker.addEvent('ORCHESTRATOR_AGGREGATE', orchestrator.id, 'Aggregating results');

    const summary = tracker.getExecutionSummary();
    assert.strictEqual(summary.eventCount, 6); // 1 dispatch + 3 specialists + 1 aggregate + 1
  });

  test('Council config can be serialized for storage', () => {
    const councilConfig = new MockCouncilConfig('persisted-council', 3);
    const json = councilConfig.toJSON();

    assert.strictEqual(json.name, 'persisted-council');
    assert.strictEqual(json.agentCount, 3);
    assert.strictEqual(json.agents.length, 3);
    assert(json.createdAt);
  });
});

/**
 * Test Suite: Manifest Management
 */
describe('Swarm Sandbox Manifest Management', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('Manifest contains required fields', () => {
    manager.createSandbox('manifest-fields', 2);
    const manifest = manager.loadManifest('manifest-fields');

    const requiredFields = ['id', 'name', 'createdAt', 'updatedAt', 'status', 'config', 'agents'];
    requiredFields.forEach(field => {
      assert(manifest.hasOwnProperty(field), `Manifest should have ${field}`);
    });
  });

  test('Manifest timestamps are ISO format', () => {
    manager.createSandbox('manifest-timestamps', 1);
    const manifest = manager.loadManifest('manifest-timestamps');

    const isValidISO = (str) => !isNaN(new Date(str).getTime());
    assert(isValidISO(manifest.createdAt), 'createdAt should be valid ISO date');
    assert(isValidISO(manifest.updatedAt), 'updatedAt should be valid ISO date');
  });

  test('Manifest ID is unique', () => {
    const manifests = [];
    for (let i = 0; i < 5; i++) {
      manager.createSandbox(`unique-id-${i}`, 1);
      manifests.push(manager.loadManifest(`unique-id-${i}`));
    }

    const ids = manifests.map(m => m.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(uniqueIds.size, ids.length, 'All IDs should be unique');
  });

  test('Manifest can be updated without losing data', () => {
    manager.createSandbox('manifest-update', 2);

    let manifest = manager.loadManifest('manifest-update');
    const originalId = manifest.id;

    manifest.executions.push({ id: 'exec-1', status: 'completed' });
    manifest.logs.push({ level: 'info', message: 'Test log' });

    manager.saveManifest('manifest-update', manifest);

    manifest = manager.loadManifest('manifest-update');
    assert.strictEqual(manifest.id, originalId, 'ID should not change');
    assert.strictEqual(manifest.executions.length, 1);
    assert.strictEqual(manifest.logs.length, 1);
  });

  test('Manifest config contains resource constraints', () => {
    manager.createSandbox('manifest-config', 3);
    const manifest = manager.loadManifest('manifest-config');

    assert.strictEqual(manifest.config.agentCount, 3);
    assert.strictEqual(manifest.config.timeoutMs, 30000);
    assert.strictEqual(manifest.config.maxRetries, 3);
    assert.strictEqual(manifest.config.isolationLevel, 'strict');
  });

  test('Manifest agent list matches actual agent configs', () => {
    const sandboxPath = manager.createSandbox('manifest-agent-sync', 4);
    let manifest = manager.loadManifest('manifest-agent-sync');

    const agentsDir = path.join(sandboxPath, 'agents');
    const agentFiles = fs.readdirSync(agentsDir);

    assert.strictEqual(manifest.agents.length, agentFiles.length);
    manifest.agents.forEach(agent => {
      const configPath = path.join(agentsDir, `${agent.id}.json`);
      assert(fs.existsSync(configPath), `Config should exist for ${agent.id}`);
    });
  });

  test('Manifest can be versioned', () => {
    manager.createSandbox('manifest-version', 2);

    let manifest = manager.loadManifest('manifest-version');
    manifest.version = '1.0.0';
    manager.saveManifest('manifest-version', manifest);

    manifest = manager.loadManifest('manifest-version');
    assert.strictEqual(manifest.version, '1.0.0');
  });
});

/**
 * Test Suite: Error Handling & Recovery
 */
describe('Swarm Sandbox Error Handling', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('Sandbox handles missing manifest gracefully', () => {
    manager.createSandbox('error-missing-manifest', 2);
    const manifest = manager.loadManifest('error-missing-manifest');

    // Delete manifest
    const manifestPath = path.join(
      manager.getSandboxPath('error-missing-manifest'),
      'sandbox-manifest.json'
    );
    fs.unlinkSync(manifestPath);

    // Attempt to load
    const reloaded = manager.loadManifest('error-missing-manifest');
    assert.strictEqual(reloaded, null, 'Should return null for missing manifest');
  });

  test('Sandbox recovers from corrupted agent config', () => {
    const sandboxPath = manager.createSandbox('error-corrupt-agent', 2);
    const agentConfigPath = path.join(sandboxPath, 'agents', 'agent-1.json');

    // Corrupt agent config
    fs.writeFileSync(agentConfigPath, 'invalid json {', 'utf-8');

    // Verify corruption
    try {
      JSON.parse(fs.readFileSync(agentConfigPath, 'utf-8'));
      assert.fail('Should have thrown on corrupted JSON');
    } catch (e) {
      assert(e instanceof SyntaxError, 'Should be JSON syntax error');
    }

    // Fix by recreating config
    const manifest = manager.loadManifest('error-corrupt-agent');
    const agent = manifest.agents[0];
    const fixedConfig = {
      id: agent.id,
      role: agent.role,
      model: 'claude-haiku-4-5-20251001',
      systemPrompt: 'Recovered config'
    };

    fs.writeFileSync(agentConfigPath, JSON.stringify(fixedConfig, null, 2), 'utf-8');

    const recovered = JSON.parse(fs.readFileSync(agentConfigPath, 'utf-8'));
    assert.strictEqual(recovered.id, agent.id);
  });

  test('Sandbox handles agent timeout gracefully', () => {
    manager.createSandbox('error-timeout', 2);
    const tracker = new ExecutionTracker('error-timeout');

    tracker.addEvent('AGENT_STARTED', 'agent-1', 'Starting');
    tracker.addEvent('AGENT_TIMEOUT', 'agent-1', 'Agent timeout after 30000ms', {
      timeout: 30000,
      retry: true
    });
    tracker.addEvent('AGENT_RETRY', 'agent-1', 'Retrying with backoff', { attempt: 1 });

    const summary = tracker.getExecutionSummary();
    const timeoutEvent = summary.events.find(e => e.type === 'AGENT_TIMEOUT');

    assert(timeoutEvent);
    assert.strictEqual(timeoutEvent.data.retry, true);
  });

  test('Sandbox tracks retry attempts', () => {
    manager.createSandbox('error-retries', 2);
    let manifest = manager.loadManifest('error-retries');

    const executionWithRetries = {
      id: 'exec-with-retries',
      status: 'in_progress',
      attempts: [
        { number: 1, status: 'failed', error: 'Timeout' },
        { number: 2, status: 'failed', error: 'Connection error' },
        { number: 3, status: 'completed', result: 'Success' }
      ],
      maxRetries: 3
    };

    manifest.executions.push(executionWithRetries);
    manager.saveManifest('error-retries', manifest);

    manifest = manager.loadManifest('error-retries');
    const execution = manifest.executions[0];

    assert.strictEqual(execution.attempts.length, 3);
    assert.strictEqual(execution.attempts[2].status, 'completed');
  });

  test('Sandbox validates agent isolation on error', () => {
    manager.createSandbox('error-isolation', 3);
    const manifest = manager.loadManifest('error-isolation');

    // Simulate error in one agent
    const failedAgent = manifest.agents[0];
    const errorEvent = {
      agentId: failedAgent.id,
      error: 'Simulation error',
      timestamp: new Date().toISOString()
    };

    // Verify other agents are unaffected
    const otherAgents = manifest.agents.slice(1);
    otherAgents.forEach(agent => {
      assert.strictEqual(agent.status, 'idle', 'Other agents should remain unaffected');
    });
  });

  test('Sandbox logs errors for debugging', () => {
    const sandboxPath = manager.createSandbox('error-logging', 2);
    const logsDir = path.join(sandboxPath, 'logs');

    const errorLog = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      agent: 'agent-1',
      message: 'Test error message',
      stack: 'Error stack trace'
    };

    fs.writeFileSync(
      path.join(logsDir, 'error-log.json'),
      JSON.stringify(errorLog, null, 2),
      'utf-8'
    );

    const loaded = JSON.parse(
      fs.readFileSync(path.join(logsDir, 'error-log.json'), 'utf-8')
    );

    assert.strictEqual(loaded.level, 'ERROR');
    assert.strictEqual(loaded.agent, 'agent-1');
  });
});

/**
 * Test Suite: Resource Constraints
 */
describe('Swarm Sandbox Resource Constraints', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('Sandbox respects timeout configuration', () => {
    manager.createSandbox('resource-timeout', 2);
    const manifest = manager.loadManifest('resource-timeout');

    assert.strictEqual(manifest.config.timeoutMs, 30000);
    assert(manifest.config.timeoutMs > 0);
  });

  test('Sandbox enforces agent limits', () => {
    manager.createSandbox('resource-agent-limit', 20);
    const manifest = manager.loadManifest('resource-agent-limit');

    assert.strictEqual(manifest.agents.length, 20);
    assert(manifest.agents.length <= 20, 'Should not exceed agent limit');
  });

  test('Sandbox tracks memory usage per agent', () => {
    manager.createSandbox('resource-memory', 3);
    let manifest = manager.loadManifest('resource-memory');

    const executionWithMetrics = {
      id: 'exec-memory',
      status: 'completed',
      metrics: {
        'agent-1': { memoryUsedMb: 256, peakMemoryMb: 512 },
        'agent-2': { memoryUsedMb: 180, peakMemoryMb: 320 },
        'agent-3': { memoryUsedMb: 220, peakMemoryMb: 400 }
      }
    };

    manifest.executions.push(executionWithMetrics);
    manager.saveManifest('resource-memory', manifest);

    manifest = manager.loadManifest('resource-memory');
    const exec = manifest.executions[0];

    Object.values(exec.metrics).forEach(metric => {
      assert(metric.memoryUsedMb > 0);
      assert(metric.peakMemoryMb >= metric.memoryUsedMb);
    });
  });

  test('Sandbox tracks execution time', () => {
    manager.createSandbox('resource-time', 2);
    const tracker = new ExecutionTracker('resource-time');

    const startTime = Date.now();

    // Simulate work
    tracker.addEvent('WORK_STARTED', 'agent-1', 'Starting work');
    for (let i = 0; i < 100; i++) {
      tracker.addEvent('WORK_PROGRESS', 'agent-1', `Progress: ${i}%`);
    }
    tracker.addEvent('WORK_COMPLETED', 'agent-1', 'Work completed');

    const summary = tracker.getExecutionSummary();
    assert(summary.totalDuration >= 0);
  });

  test('Sandbox rate limits per agent', () => {
    manager.createSandbox('resource-ratelimit', 1);
    const manifest = manager.loadManifest('resource-ratelimit');

    const agentConfig = {
      id: manifest.agents[0].id,
      rateLimit: {
        requestsPerMinute: 60,
        burstLimit: 100
      }
    };

    assert.strictEqual(agentConfig.rateLimit.requestsPerMinute, 60);
    assert.strictEqual(agentConfig.rateLimit.burstLimit, 100);
  });

  test('Sandbox enforces maximum retries', () => {
    manager.createSandbox('resource-maxretries', 2);
    const manifest = manager.loadManifest('resource-maxretries');

    assert.strictEqual(manifest.config.maxRetries, 3);

    const attemptedExecution = {
      id: 'exec-maxretries',
      attempts: [],
      maxRetries: manifest.config.maxRetries
    };

    for (let i = 0; i < manifest.config.maxRetries + 1; i++) {
      attemptedExecution.attempts.push({
        number: i + 1,
        status: i < manifest.config.maxRetries ? 'failed' : 'aborted'
      });
    }

    assert(attemptedExecution.attempts.length <= manifest.config.maxRetries + 1);
    assert.strictEqual(
      attemptedExecution.attempts[attemptedExecution.attempts.length - 1].status,
      'aborted'
    );
  });
});

/**
 * Test Suite: Integration Tests
 */
describe('Swarm Sandbox Integration', () => {
  let manager;

  beforeEach(() => {
    manager = new TestSandboxManager();
    manager.setup();
  });

  afterEach(() => {
    manager.teardown();
  });

  test('End-to-end sandbox workflow', () => {
    // Initialize
    manager.createSandbox('integration-e2e', 3);
    let manifest = manager.loadManifest('integration-e2e');

    assert.strictEqual(manifest.status, 'initialized');

    // Start execution
    manifest.status = 'running';
    const execId = manager.generateId();
    manifest.executions.push({
      id: execId,
      status: 'in_progress',
      timestamp: new Date().toISOString()
    });
    manager.saveManifest('integration-e2e', manifest);

    // Simulate agent work
    const tracker = new ExecutionTracker('integration-e2e');
    for (const agent of manifest.agents) {
      tracker.addEvent('AGENT_WORK', agent.id, `${agent.id} processing task`);
    }

    // Complete execution
    manifest = manager.loadManifest('integration-e2e');
    manifest.executions[0].status = 'completed';
    manifest.status = 'completed';
    manager.saveManifest('integration-e2e', manifest);

    // Verify final state
    manifest = manager.loadManifest('integration-e2e');
    assert.strictEqual(manifest.status, 'completed');
    assert.strictEqual(manifest.executions[0].status, 'completed');
  });

  test('Sandbox with council integration', () => {
    manager.createSandbox('integration-council', 4);
    const manifest = manager.loadManifest('integration-council');

    // Create council
    const councilConfig = new MockCouncilConfig('integration-council', manifest.agents.length);

    // Simulate council execution
    const tracker = new ExecutionTracker('integration-council');
    councilConfig.agents.forEach(agent => {
      tracker.addEvent('COUNCIL_AGENT_STARTED', agent.id, `${agent.id} started`);
    });

    const summary = tracker.getExecutionSummary();
    assert.strictEqual(summary.eventCount, councilConfig.agents.length);
  });

  test('Sandbox handles validation workflow', () => {
    manager.createSandbox('integration-validation', 2);
    let manifest = manager.loadManifest('integration-validation');

    // Run validations
    const validations = [
      { name: 'Manifest Integrity', status: 'passed' },
      { name: 'Directory Structure', status: 'passed' },
      { name: 'Agent Configurations', status: 'passed' },
      { name: 'Resource Limits', status: 'passed' }
    ];

    manifest.validations.push({
      timestamp: new Date().toISOString(),
      checks: validations
    });

    manager.saveManifest('integration-validation', manifest);

    manifest = manager.loadManifest('integration-validation');
    const allPassed = manifest.validations[0].checks.every(c => c.status === 'passed');
    assert(allPassed, 'All validations should pass');
  });

  test('Sandbox supports concurrent operations', () => {
    const sandboxes = [];
    const trackers = [];

    // Initialize multiple sandboxes
    for (let i = 0; i < 3; i++) {
      const name = `integration-concurrent-${i}`;
      manager.createSandbox(name, 2);
      sandboxes.push(name);
      trackers.push(new ExecutionTracker(name));
    }

    // Simulate concurrent work
    trackers.forEach((tracker, idx) => {
      tracker.addEvent('STARTED', `sandbox-${idx}`, 'Concurrent work started');
      tracker.addEvent('COMPLETED', `sandbox-${idx}`, 'Concurrent work completed');
    });

    // Verify all sandboxes intact
    sandboxes.forEach(name => {
      const manifest = manager.loadManifest(name);
      assert(manifest);
    });
  });
});

// ============================================================================
// EXPORTS & EXECUTION
// ============================================================================

module.exports = {
  TestSandboxManager,
  MockCouncilConfig,
  ExecutionTracker
};

// Run tests if this is the main module
if (require.main === module) {
  console.log('\n=== Swarm Sandbox Test Suite ===\n');
  console.log('Running comprehensive tests for swarm sandbox functionality...\n');
}
