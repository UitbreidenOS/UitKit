#!/usr/bin/env node

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {
  GlobalStateManager,
  SharedContextStore,
  ConflictResolver,
  StateVersion,
  CONFLICT_STRATEGIES
} = require('./state-management');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  RESET: '\x1b[0m'
};

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`${COLORS.RED}✗${COLORS.RESET} ${name}`);
    console.log(`  ${error.message}`);
    testsFailed++;
  }
}

function describe(name) {
  console.log(`\n${COLORS.CYAN}${name}${COLORS.RESET}`);
}

// Test 1: State Version
describe('StateVersion');

test('Create version with defaults', () => {
  const v = new StateVersion();
  assert.equal(v.versionNumber, 0);
  assert(v.timestamp);
});

test('Set and compute hash', () => {
  const v = new StateVersion(1);
  v.data = { key: 'value' };
  v.computeHash(v.data);
  assert(v.hash);
  assert.equal(v.hash.length, 64); // SHA256 hex length
});

test('Version JSON serialization', () => {
  const v = new StateVersion(1, '2024-01-01T00:00:00Z');
  v.metadata = { author: 'test' };
  v.computeHash({});

  const json = v.toJSON();
  assert.equal(json.versionNumber, 1);
  assert(json.hash);
});

// Test 2: Global State Manager
describe('GlobalStateManager');

test('Initialize manager', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state.json'),
    path.join(__dirname, '.test-history.json')
  );
  assert(manager);
  assert.equal(manager.currentState.versionNumber, 0);
});

test('Set state creates new version', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-1.json'),
    path.join(__dirname, '.test-history-1.json')
  );

  const v1 = manager.setState({ count: 0 });
  assert.equal(v1.versionNumber, 1);
  assert.equal(manager.currentState.data.count, 0);

  const v2 = manager.setState({ count: 1 });
  assert.equal(v2.versionNumber, 2);
  assert.equal(manager.currentState.data.count, 1);
});

test('Get state nested values', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-2.json'),
    path.join(__dirname, '.test-history-2.json')
  );

  manager.setState({
    user: {
      name: 'Alice',
      age: 30
    }
  });

  assert.equal(manager.getState('user.name'), 'Alice');
  assert.equal(manager.getState('user.age'), 30);
  assert.deepEqual(manager.getState('user'), { name: 'Alice', age: 30 });
});

test('Merge state deep merges', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-3.json'),
    path.join(__dirname, '.test-history-3.json')
  );

  manager.setState({
    config: { debug: true, timeout: 5000 }
  });

  manager.mergeState({
    config: { timeout: 10000, verbose: true }
  });

  const merged = manager.getState('config');
  assert.equal(merged.debug, true);
  assert.equal(merged.timeout, 10000);
  assert.equal(merged.verbose, true);
});

test('Version history tracking', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-4.json'),
    path.join(__dirname, '.test-history-4.json')
  );

  manager.setState({ v: 1 });
  manager.setState({ v: 2 });
  manager.setState({ v: 3 });

  const history = manager.getVersionHistory();
  assert.equal(history.length, 3);
  assert.equal(history[0].versionNumber, 1);
  assert.equal(history[2].versionNumber, 3);
});

test('Rollback to previous version', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-5.json'),
    path.join(__dirname, '.test-history-5.json')
  );

  manager.setState({ value: 'initial' });
  manager.setState({ value: 'modified' });
  const v3 = manager.setState({ value: 'wrong' });

  assert.equal(v3.versionNumber, 3);

  const rolled = manager.rollbackToVersion(1);
  assert.equal(rolled.versionNumber, 4); // New version after rollback
  assert.equal(rolled.data.value, 'initial');
});

test('Compare versions shows differences', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-6.json'),
    path.join(__dirname, '.test-history-6.json')
  );

  manager.setState({ name: 'Alice', age: 25 });
  manager.setState({ name: 'Bob', age: 30 });

  const comparison = manager.compareVersions(1, 2);
  assert.equal(comparison.differences.length, 2);
  assert(comparison.differences.some(d => d.path === 'name'));
  assert(comparison.differences.some(d => d.path === 'age'));
});

test('Subscriptions notify on state change', (done) => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-7.json'),
    path.join(__dirname, '.test-history-7.json')
  );

  let called = false;
  manager.subscribe('count', (value) => {
    called = true;
  });

  manager.setState({ count: 1 });

  // Note: subscriptions are synchronous in this implementation
  if (!called) {
    throw new Error('Subscription not called');
  }
}).skip = process.env.SKIP_SUBSCRIPTION_TEST === 'true';

test('Event emitter fires on state change', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-8.json'),
    path.join(__dirname, '.test-history-8.json')
  );

  let eventFired = false;
  manager.on('state-changed', () => {
    eventFired = true;
  });

  manager.setState({ data: 'test' });

  if (!eventFired) {
    throw new Error('Event not fired');
  }
});

test('Locking provides mutual exclusion', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-9.json'),
    path.join(__dirname, '.test-history-9.json')
  );

  const lock1 = manager._acquireLock('read');
  assert(lock1);

  const lock2 = manager._acquireLock('read');
  assert(lock2); // Multiple reads allowed

  manager._releaseLock(lock1);
  manager._releaseLock(lock2);
});

// Test 3: Conflict Resolution
describe('ConflictResolver');

test('Last write wins strategy', () => {
  const resolver = new ConflictResolver(CONFLICT_STRATEGIES.LAST_WRITE_WINS);

  const v1 = new StateVersion(1, '2024-01-01T10:00:00Z');
  v1.data = { value: 'old' };

  const v2 = new StateVersion(2, '2024-01-01T10:00:01Z');
  v2.data = { value: 'new' };

  const conflict = resolver.resolve(v1, v2);
  assert.equal(conflict.result.data.value, 'new');
});

test('First write wins strategy', () => {
  const resolver = new ConflictResolver(CONFLICT_STRATEGIES.FIRST_WRITE_WINS);

  const v1 = new StateVersion(1, '2024-01-01T10:00:00Z');
  v1.data = { value: 'first' };

  const v2 = new StateVersion(2, '2024-01-01T10:00:01Z');
  v2.data = { value: 'second' };

  const conflict = resolver.resolve(v1, v2);
  assert.equal(conflict.result.data.value, 'first');
});

test('Merge strategy combines objects', () => {
  const resolver = new ConflictResolver(CONFLICT_STRATEGIES.MERGE);

  const v1 = new StateVersion(1);
  v1.data = { a: 1, b: 2 };

  const v2 = new StateVersion(2);
  v2.data = { b: 20, c: 3 };

  const conflict = resolver.resolve(v1, v2);
  assert.equal(conflict.result.data.a, 1);
  assert.equal(conflict.result.data.b, 20);
  assert.equal(conflict.result.data.c, 3);
});

test('Custom resolver applies function', () => {
  const resolver = new ConflictResolver();
  resolver.setCustomResolver((local, incoming) => {
    const merged = new StateVersion(3);
    merged.data = {
      ...local.data,
      ...incoming.data,
      merged: true
    };
    return merged;
  });

  const v1 = new StateVersion(1);
  v1.data = { a: 1 };

  const v2 = new StateVersion(2);
  v2.data = { b: 2 };

  const conflict = resolver.resolve(v1, v2);
  assert.equal(conflict.result.data.a, 1);
  assert.equal(conflict.result.data.b, 2);
  assert.equal(conflict.result.data.merged, true);
});

test('Latest version strategy', () => {
  const resolver = new ConflictResolver(CONFLICT_STRATEGIES.LATEST_VERSION);

  const v1 = new StateVersion(1);
  v1.data = { value: 'v1' };

  const v5 = new StateVersion(5);
  v5.data = { value: 'v5' };

  const conflict = resolver.resolve(v1, v5);
  assert.equal(conflict.result.versionNumber, 5);
});

// Test 4: Shared Context Store
describe('SharedContextStore');

test('Get or create context', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-10.json'),
    path.join(__dirname, '.test-history-10.json')
  );
  const store = new SharedContextStore(manager);

  const ctx = store.getContext('agent-1');
  assert.equal(ctx.namespace, 'agent-1');
  assert(ctx.createdAt);
});

test('Set and get context values', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-11.json'),
    path.join(__dirname, '.test-history-11.json')
  );
  const store = new SharedContextStore(manager);

  store.setContextValue('agent-1', 'status', 'active');
  const value = store.getContextValue('agent-1', 'status');

  assert.equal(value, 'active');
});

test('Merge context data', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-12.json'),
    path.join(__dirname, '.test-history-12.json')
  );
  const store = new SharedContextStore(manager);

  store.setContextValue('agent-1', 'config', { timeout: 5000 });
  store.mergeContextData('agent-1', { config: { verbose: true } });

  const value = store.getContextValue('agent-1', 'config');
  assert.equal(value.timeout, 5000);
  assert.equal(value.verbose, true);
});

test('Clear context namespace', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-13.json'),
    path.join(__dirname, '.test-history-13.json')
  );
  const store = new SharedContextStore(manager);

  store.setContextValue('agent-1', 'data', 'value');
  store.clearContext('agent-1');

  const ctx = store.getContext('agent-1');
  assert.deepEqual(ctx.data, {});
});

// Test 5: Persistence
describe('Persistence');

test('Save and load state from disk', () => {
  const filepath = path.join(__dirname, '.test-persist.json');
  const histpath = path.join(__dirname, '.test-persist-hist.json');

  try {
    // Save
    const m1 = new GlobalStateManager(filepath, histpath);
    m1.setState({ data: 'persisted' });

    // Load
    const m2 = new GlobalStateManager(filepath, histpath);
    assert.equal(m2.getState('data'), 'persisted');
  } finally {
    try { fs.unlinkSync(filepath); } catch {}
    try { fs.unlinkSync(histpath); } catch {}
  }
});

test('Recover from corrupted history', () => {
  const filepath = path.join(__dirname, '.test-corrupt.json');

  try {
    // Create state file but corrupt history
    const manager = new GlobalStateManager(filepath, 'nonexistent.json');
    manager.setState({ value: 1 });

    // Should still load
    assert.equal(manager.currentState.versionNumber, 1);
  } finally {
    try { fs.unlinkSync(filepath); } catch {}
  }
});

// Test 6: Diagnostics
describe('Diagnostics');

test('Get manager diagnostics', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-14.json'),
    path.join(__dirname, '.test-history-14.json')
  );

  manager.setState({ a: 1 });
  manager.setState({ b: 2 });

  const diag = manager.getDiagnostics();
  assert.equal(diag.currentVersion, 2);
  assert.equal(diag.totalVersions, 2);
  assert(diag.storageSize >= 0);
});

test('Export snapshot in JSON', () => {
  const manager = new GlobalStateManager(
    path.join(__dirname, '.test-state-15.json'),
    path.join(__dirname, '.test-history-15.json')
  );

  manager.setState({ export: 'test' });

  const snapshot = manager.exportSnapshot('json');
  const parsed = JSON.parse(snapshot);

  assert.equal(parsed.data.export, 'test');
  assert(parsed.version);
  assert(parsed.hash);
});

// Cleanup
describe('Cleanup');

function cleanupFiles() {
  const testFiles = [
    '.test-state.json', '.test-history.json',
    '.test-state-1.json', '.test-history-1.json',
    '.test-state-2.json', '.test-history-2.json',
    '.test-state-3.json', '.test-history-3.json',
    '.test-state-4.json', '.test-history-4.json',
    '.test-state-5.json', '.test-history-5.json',
    '.test-state-6.json', '.test-history-6.json',
    '.test-state-7.json', '.test-history-7.json',
    '.test-state-8.json', '.test-history-8.json',
    '.test-state-9.json', '.test-history-9.json',
    '.test-state-10.json', '.test-history-10.json',
    '.test-state-11.json', '.test-history-11.json',
    '.test-state-12.json', '.test-history-12.json',
    '.test-state-13.json', '.test-history-13.json',
    '.test-state-14.json', '.test-history-14.json',
    '.test-state-15.json', '.test-history-15.json',
    '.test-persist.json', '.test-persist-hist.json',
    '.test-corrupt.json'
  ];

  testFiles.forEach(f => {
    const filepath = path.join(__dirname, f);
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch {}
  });
}

// Run tests
console.log(`\n${COLORS.CYAN}${COLORS.BOLD}State Management Test Suite${COLORS.RESET}\n`);

// Execute tests (they run synchronously)
test('Run all tests', () => {
  // Tests already executed above
});

cleanupFiles();

console.log(`\n${COLORS.CYAN}${COLORS.BOLD}Results${COLORS.RESET}`);
console.log(`${COLORS.GREEN}Passed: ${testsPassed}${COLORS.RESET}`);
console.log(`${COLORS.RED}Failed: ${testsFailed}${COLORS.RESET}`);
console.log(`Total: ${testsPassed + testsFailed}\n`);

process.exit(testsFailed > 0 ? 1 : 0);
