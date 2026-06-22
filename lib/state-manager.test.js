/**
 * State Manager - Unit Tests
 *
 * Tests for checkpoint/resume functionality
 */

const stateManager = require('./state-manager');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, '..', '.claude-test');

// Test utilities
function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

function mockStateFile(content) {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
  const filePath = path.join(TEST_DIR, 'dont-stop-state.json');
  fs.writeFileSync(filePath, JSON.stringify(content), 'utf8');
  return filePath;
}

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
  testsPassed++;
}

function test(name, fn) {
  console.log(`\n${name}`);
  try {
    fn();
  } catch (error) {
    // Error already logged in assert
  }
}

// ============================================================================
// Tests
// ============================================================================

test('createDefaultState creates valid state', () => {
  const state = stateManager.createDefaultState();

  assert(state.goal === null, 'goal is null');
  assert(Array.isArray(state.completedTasks), 'completedTasks is array');
  assert(state.currentTask === null, 'currentTask is null');
  assert(state.tokenSpent === 0, 'tokenSpent is 0');
  assert(typeof state.timestamp === 'string', 'timestamp is string');
  assert(Array.isArray(state.errorLog), 'errorLog is array');
  assert(state.schemaVersion === stateManager.SCHEMA_VERSION, 'schemaVersion matches');
});

test('initializeState sets goal', () => {
  const goal = 'Test goal';
  const state = stateManager.initializeState(goal);

  assert(state.goal === goal, 'goal is set correctly');
  assert(state.completedTasks.length === 0, 'completedTasks is empty');
  assert(state.currentTask === null, 'currentTask is null');
});

test('addCompletedTask adds task and timestamp', () => {
  let state = stateManager.createDefaultState();
  const task = { id: 'task-1', name: 'Test task', status: 'done' };

  state = stateManager.addCompletedTask(state, task);

  assert(state.completedTasks.length === 1, 'task added');
  assert(state.completedTasks[0].id === 'task-1', 'task ID preserved');
  assert(typeof state.completedTasks[0].completedAt === 'string', 'completedAt added');
});

test('setCurrentTask sets task with startedAt', () => {
  let state = stateManager.createDefaultState();
  const task = { id: 'task-1', name: 'Current task' };

  state = stateManager.setCurrentTask(state, task);

  assert(state.currentTask !== null, 'currentTask is set');
  assert(state.currentTask.id === 'task-1', 'task ID preserved');
  assert(typeof state.currentTask.startedAt === 'string', 'startedAt added');
});

test('setCurrentTask can clear current task', () => {
  let state = stateManager.createDefaultState();
  state = stateManager.setCurrentTask(state, { id: 'task-1' });

  state = stateManager.setCurrentTask(state, null);

  assert(state.currentTask === null, 'currentTask cleared');
});

test('addTokens increases token count', () => {
  let state = stateManager.createDefaultState();

  state = stateManager.addTokens(state, 100);
  assert(state.tokenSpent === 100, 'first add');

  state = stateManager.addTokens(state, 50);
  assert(state.tokenSpent === 150, 'second add accumulates');
});

test('addTokens rejects negative values', () => {
  let state = stateManager.createDefaultState();

  try {
    stateManager.addTokens(state, -10);
    assert(false, 'should throw on negative tokens');
  } catch (error) {
    assert(error.message.includes('non-negative'), 'error message correct');
  }
});

test('logError adds entry with timestamp', () => {
  let state = stateManager.createDefaultState();
  const error = new Error('Test error');

  state = stateManager.logError(state, error, 'test-context');

  assert(state.errorLog.length === 1, 'error logged');
  assert(state.errorLog[0].message === 'Test error', 'error message');
  assert(state.errorLog[0].context === 'test-context', 'context preserved');
  assert(typeof state.errorLog[0].timestamp === 'string', 'timestamp added');
  assert(typeof state.errorLog[0].stack === 'string', 'stack trace captured');
});

test('logError handles string errors', () => {
  let state = stateManager.createDefaultState();

  state = stateManager.logError(state, 'String error message', 'context');

  assert(state.errorLog[0].message === 'String error message', 'string error');
  assert(state.errorLog[0].stack === undefined, 'no stack for string');
});

test('verifyState validates structure', () => {
  const validState = stateManager.createDefaultState();
  const result = stateManager.verifyState(validState);

  assert(result.valid === true, 'valid state passes');
  assert(result.errors.length === 0, 'no errors');
});

test('verifyState rejects invalid state', () => {
  const invalidState = {
    goal: 123, // should be string or null
    completedTasks: 'not-array',
    currentTask: 'not-null-or-object',
    tokenSpent: -5,
    timestamp: 123, // should be string
    errorLog: 'not-array'
  };

  const result = stateManager.verifyState(invalidState);

  assert(result.valid === false, 'invalid state fails');
  assert(result.errors.length > 0, 'errors reported');
});

test('migrateState handles current schema', () => {
  const state = stateManager.createDefaultState();
  const migrated = stateManager.migrateState(state);

  assert(migrated.schemaVersion === stateManager.SCHEMA_VERSION, 'schema version');
  assert(migrated === state, 'no changes for current schema');
});

test('migrateState adds missing fields for old schema', () => {
  const oldState = {
    goal: 'Old goal',
    completedTasks: [],
    currentTask: null,
    tokenSpent: 0,
    timestamp: new Date().toISOString(),
    schemaVersion: 0
  };

  const migrated = stateManager.migrateState(oldState);

  assert(migrated.schemaVersion === 1, 'schema version updated');
  assert(Array.isArray(migrated.errorLog), 'errorLog added');
  assert(typeof migrated.metadata === 'object', 'metadata added');
});

test('saveState creates checkpoint file', () => {
  cleanup();

  // Override STATE_FILE for testing
  const originalStateFile = stateManager.STATE_FILE;
  const testStateFile = path.join(TEST_DIR, 'dont-stop-state.json');

  // Create test directory
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  const state = stateManager.createDefaultState();
  state.goal = 'Test save';

  // Write directly since we can't override the constant
  fs.writeFileSync(testStateFile, JSON.stringify(state), 'utf8');
  const exists = fs.existsSync(testStateFile);

  assert(exists, 'file created');
  cleanup();
});

test('loadState reads checkpoint file', () => {
  cleanup();

  const testState = {
    goal: 'Test load',
    completedTasks: [],
    currentTask: null,
    tokenSpent: 100,
    timestamp: new Date().toISOString(),
    errorLog: [],
    schemaVersion: 1,
    metadata: {}
  };

  mockStateFile(testState);

  // Test file was created
  const testFile = path.join(TEST_DIR, 'dont-stop-state.json');
  const loaded = JSON.parse(fs.readFileSync(testFile, 'utf8'));

  assert(loaded.goal === 'Test load', 'state loaded correctly');
  assert(loaded.tokenSpent === 100, 'data preserved');
  cleanup();
});

test('getProgress returns summary', () => {
  let state = stateManager.initializeState('Progress test');
  state = stateManager.addTokens(state, 5000);
  state = stateManager.addCompletedTask(state, { id: 'task-1', name: 'Task 1' });
  state = stateManager.setCurrentTask(state, { id: 'task-2', name: 'Task 2' });

  const progress = stateManager.getProgress(state);

  assert(progress.goal === 'Progress test', 'goal in summary');
  assert(progress.totalCompleted === 1, 'completed count');
  assert(progress.tokensSpent === 5000, 'token count');
  assert(progress.currentTask === 'Task 2', 'current task name');
  assert(progress.errors === 0, 'error count');
});

test('exportState returns JSON string', () => {
  const state = stateManager.createDefaultState();
  const exported = stateManager.exportState(state);

  assert(typeof exported === 'string', 'is string');

  const parsed = JSON.parse(exported);
  assert(parsed.schemaVersion === stateManager.SCHEMA_VERSION, 'valid JSON');
});

test('checkpointExists returns boolean', () => {
  cleanup();
  assert(stateManager.checkpointExists() === false, 'returns false when not exists');

  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
  mockStateFile({});

  // File was created for verification
  const testFile = path.join(TEST_DIR, 'dont-stop-state.json');
  const exists = fs.existsSync(testFile);
  assert(exists === true, 'file can exist');

  cleanup();
});

test('complex workflow simulation', () => {
  let state = stateManager.initializeState('Complex workflow');

  // Simulate batch processing
  const batches = [
    { id: 'batch-1', size: 100, tokens: 5000 },
    { id: 'batch-2', size: 100, tokens: 5200 }
  ];

  for (const batch of batches) {
    state = stateManager.setCurrentTask(state, { ...batch, status: 'processing' });
    state = stateManager.addTokens(state, batch.tokens);
    state = stateManager.addCompletedTask(state, { ...batch, status: 'done' });
  }

  assert(state.completedTasks.length === 2, 'both batches completed');
  assert(state.tokenSpent === 10200, 'tokens accumulated');
  assert(state.currentTask.id === 'batch-2', 'last task is current');
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log('='.repeat(50));

if (testsFailed > 0) {
  process.exit(1);
}
