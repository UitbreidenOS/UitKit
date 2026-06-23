#!/usr/bin/env node

/**
 * Agent Cloning System - Test Suite
 *
 * Comprehensive tests for agent cloning, templating, sharing, and versioning
 */

const { AgentCloneManager, DEFAULT_AGENT_CONFIG } = require('./agent-cloning');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const TEST_DIR = path.join(process.cwd(), '.claude', 'test-agent-clones');

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('\n=== Agent Cloning System Test Suite ===\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✓ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.error(`✗ ${test.name}`);
        console.error(`  ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n=== Results ===`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Total:  ${this.passed + this.failed}\n`);

    return this.failed === 0;
  }
}

const runner = new TestRunner();

// Test 1: Template Creation
runner.test('Create agent template', () => {
  const manager = new AgentCloneManager();
  const config = {
    name: 'TestAgent',
    model: 'claude-opus-4-1',
    maxTokens: 100000,
    temperature: 0.7,
    tools: ['browser', 'search'],
    systemPrompt: 'You are a test agent',
  };

  const template = manager.createTemplate(config, 'TestTemplate', {
    author: 'test-runner',
    description: 'A test template',
  });

  assert(template.id, 'Template should have ID');
  assert(template.name === 'TestTemplate', 'Template name should match');
  assert(template.metadata.author === 'test-runner', 'Author should match');
});

// Test 2: Clone from Template
runner.test('Clone agent from template', () => {
  const manager = new AgentCloneManager();
  const config = {
    name: 'SourceAgent',
    model: 'claude-opus-4-1',
    maxTokens: 100000,
  };

  const template = manager.createTemplate(config, 'SourceTemplate', {
    author: 'test-runner',
  });

  const clone = manager.cloneAgent(template.id, 'MyClone', { temperature: 0.9 }, {
    author: 'test-runner',
  });

  assert(clone.id, 'Clone should have ID');
  assert(clone.name === 'MyClone', 'Clone name should match');
  assert(clone.config.temperature === 0.9, 'Temperature override should apply');
  assert(clone.metadata.parentTemplate === template.id, 'Parent template should be tracked');
});

// Test 3: Create Variant
runner.test('Create variant from clone', () => {
  const manager = new AgentCloneManager();
  const config = {
    name: 'BaseAgent',
    model: 'claude-opus-4-1',
    temperature: 0.5,
  };

  const template = manager.createTemplate(config, 'BaseTemplate', {
    author: 'test-runner',
  });

  const clone = manager.cloneAgent(template.id, 'BaseClone', {}, {
    author: 'test-runner',
  });

  const variant = manager.createVariant(clone.id, 'HighCreative', {
    temperature: 1.5,
  }, {
    author: 'test-runner',
  });

  assert(variant.id, 'Variant should have ID');
  assert(variant.name === 'HighCreative', 'Variant name should match');
  assert(variant.config.temperature === 1.5, 'Customization should apply');
  assert(variant.metadata.sourceClone === clone.id, 'Source clone should be tracked');
});

// Test 4: Share Agent
runner.test('Share agent with team', () => {
  const manager = new AgentCloneManager();
  const config = {
    name: 'SharedAgent',
    model: 'claude-opus-4-1',
  };

  const template = manager.createTemplate(config, 'SharedTemplate', {
    author: 'test-runner',
  });

  const clone = manager.cloneAgent(template.id, 'SharedClone', {}, {
    author: 'test-runner',
  });

  const sharing = manager.shareAgent(clone.id, {
    recipients: ['alice@example.com', 'bob@example.com'],
    author: 'test-runner',
    accessLevel: 'edit',
  });

  assert(sharing.id, 'Sharing should have ID');
  assert(sharing.shared.with.length === 2, 'Should have 2 recipients');
  assert(sharing.shared.accessLevel === 'edit', 'Access level should match');
});

// Test 5: List Templates
runner.test('List all templates', () => {
  const manager = new AgentCloneManager();

  for (let i = 0; i < 3; i++) {
    manager.createTemplate(
      {
        name: `Agent${i}`,
        model: 'claude-opus-4-1',
      },
      `Template${i}`,
      { author: 'test-runner' }
    );
  }

  const templates = manager.listTemplates();
  assert(templates.length >= 3, 'Should list at least 3 templates');
});

// Test 6: List Instances
runner.test('List all instances', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'TestAgent', model: 'claude-opus-4-1' },
    'TestTemplate',
    { author: 'test-runner' }
  );

  for (let i = 0; i < 2; i++) {
    manager.cloneAgent(template.id, `Clone${i}`, {}, {
      author: 'test-runner',
    });
  }

  const instances = manager.listInstances();
  assert(instances.length >= 2, 'Should list at least 2 instances');
});

// Test 7: Lineage Tracking
runner.test('Track lineage correctly', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  const clone1 = manager.cloneAgent(template.id, 'Clone1', {}, {
    author: 'test-runner',
  });

  const variant = manager.createVariant(clone1.id, 'Variant', {}, {
    author: 'test-runner',
  });

  const lineage = manager.getLineageTree(variant.id);
  assert(lineage.history.length > 0, 'Should have lineage history');
  assert(lineage.history[0].operation === 'variant', 'Should record variant operation');
});

// Test 8: Version Clone
runner.test('Version clone independently', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', {}, {
    author: 'test-runner',
  });

  const v1 = manager.versionClone(clone.id, 'v1.0-beta', 'First release candidate');
  assert(v1.id, 'Version should have ID');
  assert(v1.label === 'v1.0-beta', 'Version label should match');

  const v2 = manager.versionClone(clone.id, 'v1.0-release', 'Production ready');
  assert(v2.id !== v1.id, 'Each version should have unique ID');
});

// Test 9: Export Clone
runner.test('Export clone in JSON format', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', {}, {
    author: 'test-runner',
  });

  const exported = manager.exportClone(clone.id, 'json');
  const parsed = JSON.parse(exported);

  assert(parsed.clone.id === clone.id, 'Exported clone should match');
  assert(parsed.metadata.format === 'json', 'Format should be JSON');
});

// Test 10: Import Clone
runner.test('Import clone from export', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', {}, {
    author: 'test-runner',
  });

  const exported = manager.exportClone(clone.id, 'json');
  const imported = manager.importClone(exported, {
    author: 'test-runner',
  });

  assert(imported.id, 'Imported clone should have ID');
  assert(imported.name === clone.name, 'Imported name should match original');
  assert(imported.metadata.imported === true, 'Import flag should be set');
});

// Test 11: Save Clone as Template
runner.test('Save clone as new template', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1', temperature: 0.5 },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', { temperature: 0.7 }, {
    author: 'test-runner',
  });

  const newTemplate = manager.saveAsTemplate(clone.id, 'NewTemplate', {
    author: 'test-runner',
  });

  assert(newTemplate.id, 'New template should have ID');
  assert(newTemplate.name === 'NewTemplate', 'Template name should match');
  assert(newTemplate.config.temperature === 0.7, 'Config should preserve clone settings');
});

// Test 12: Update Clone
runner.test('Update clone configuration', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1', temperature: 0.5 },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', {}, {
    author: 'test-runner',
  });

  const updated = manager.updateClone(
    clone.id,
    { temperature: 0.9, maxTokens: 150000 },
    { author: 'test-runner', reason: 'Tuning parameters' }
  );

  assert(updated.config.temperature === 0.9, 'Temperature should be updated');
  assert(updated.config.maxTokens === 150000, 'Max tokens should be updated');
});

// Test 13: Get Statistics
runner.test('Get system statistics', () => {
  const manager = new AgentCloneManager();

  // Create some test data
  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  manager.cloneAgent(template.id, 'Clone1', {}, { author: 'test-runner' });
  manager.cloneAgent(template.id, 'Clone2', {}, { author: 'test-runner' });

  const stats = manager.getStats();

  assert(typeof stats.templates === 'number', 'Should have template count');
  assert(typeof stats.instances === 'number', 'Should have instance count');
  assert(typeof stats.versions === 'number', 'Should have version count');
});

// Test 14: Deep Merge
runner.test('Deep merge configurations', () => {
  const manager = new AgentCloneManager();

  const original = {
    name: 'Agent',
    config: { nested: { value: 1 } },
    tools: ['a', 'b'],
  };

  const override = {
    config: { nested: { value: 2, extra: 3 } },
    tools: ['c'],
  };

  const merged = manager.deepMerge(original, override);

  assert(merged.config.nested.value === 2, 'Should override nested values');
  assert(merged.config.nested.extra === 3, 'Should preserve new nested values');
  assert(merged.tools[0] === 'c', 'Should override arrays');
});

// Test 15: Configuration Validation
runner.test('Validate configuration schema', () => {
  const manager = new AgentCloneManager();

  const validConfig = {
    name: 'Agent',
    model: 'claude-opus-4-1',
    maxTokens: 100000,
    temperature: 0.7,
    tools: [],
  };

  assert.doesNotThrow(() => {
    manager.validateConfig(validConfig);
  }, 'Valid config should pass');

  const invalidConfig = {
    name: 'Agent',
    model: 'claude-opus-4-1',
    maxTokens: -1,
    temperature: 5.0,
    tools: 'not-an-array',
  };

  assert.throws(() => {
    manager.validateConfig(invalidConfig);
  }, 'Invalid config should throw');
});

// Test 16: Deletion Protection
runner.test('Protect clone deletion when it has descendants', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', {}, {
    author: 'test-runner',
  });

  manager.createVariant(clone.id, 'Variant', {}, {
    author: 'test-runner',
  });

  assert.throws(() => {
    manager.deleteClone(clone.id, false);
  }, 'Should prevent deletion when descendants exist');
});

// Test 17: Get Clone Details
runner.test('Retrieve clone details', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', { temperature: 0.8 }, {
    author: 'test-runner',
  });

  const retrieved = manager.getClone(clone.id);

  assert(retrieved.id === clone.id, 'Retrieved clone should match');
  assert(retrieved.config.temperature === 0.8, 'Configuration should match');
});

// Test 18: Get Template Details
runner.test('Retrieve template details', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1', temperature: 0.6 },
    'Template',
    { author: 'test-runner', description: 'Test template' }
  );

  const retrieved = manager.getTemplate(template.id);

  assert(retrieved.id === template.id, 'Retrieved template should match');
  assert(retrieved.metadata.description === 'Test template', 'Metadata should match');
});

// Test 19: Sharing Information
runner.test('Get sharing information for clone', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1' },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', {}, {
    author: 'test-runner',
  });

  manager.shareAgent(clone.id, {
    recipients: ['alice@example.com'],
    author: 'test-runner',
  });

  const sharing = manager.getSharingInfo(clone.id);

  assert(sharing.length > 0, 'Should retrieve sharing information');
  assert(sharing[0].shared.with[0] === 'alice@example.com', 'Recipients should match');
});

// Test 20: Restore Version
runner.test('Restore clone to previous version', () => {
  const manager = new AgentCloneManager();

  const template = manager.createTemplate(
    { name: 'Agent', model: 'claude-opus-4-1', temperature: 0.5 },
    'Template',
    { author: 'test-runner' }
  );

  const clone = manager.cloneAgent(template.id, 'Clone', {}, {
    author: 'test-runner',
  });

  const v1 = manager.versionClone(clone.id, 'v1.0');

  manager.updateClone(clone.id, { temperature: 0.9 }, {
    author: 'test-runner',
  });

  const restored = manager.restoreVersion(v1.id);

  assert(restored.config.temperature === 0.5, 'Should restore to v1 temperature');
  assert(restored.metadata.restoredFrom === v1.id, 'Should record restoration');
});

// Run all tests
async function main() {
  const success = await runner.run();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { TestRunner, runner };
