/**
 * State Manager - Usage Examples
 *
 * Demonstrates checkpoint/resume patterns for long-running operations
 */

const stateManager = require('./state-manager');

// ============================================================================
// Example 1: Initialize and save state for a new session
// ============================================================================
function example_initializeSession() {
  console.log('\n=== Example 1: Initialize Session ===\n');

  // Create initial state
  const state = stateManager.initializeState('Process 100 items from queue');

  console.log('Initial state:', JSON.stringify(state, null, 2));

  // Simulate some work
  let updatedState = stateManager.setCurrentTask(state, {
    id: 'task-1',
    name: 'Process batch 1',
    itemCount: 10
  });

  updatedState = stateManager.addTokens(updatedState, 5000);

  // Save checkpoint
  stateManager.saveState(updatedState);
  console.log('\nState saved to:', stateManager.getCheckpointPath());
}

// ============================================================================
// Example 2: Resume from checkpoint in a new session
// ============================================================================
function example_resumeSession() {
  console.log('\n=== Example 2: Resume from Checkpoint ===\n');

  // Check if checkpoint exists
  if (!stateManager.checkpointExists()) {
    console.log('No checkpoint found, starting fresh');
    return;
  }

  // Resume from checkpoint
  try {
    const state = stateManager.resume();

    if (!state) {
      console.log('No previous state found');
      return;
    }

    console.log('Resumed state:');
    console.log('Goal:', state.goal);
    console.log('Tasks completed:', state.completedTasks.length);
    console.log('Tokens used:', state.tokenSpent);
    console.log('Current task:', state.currentTask?.name);

    // Continue work
    let updatedState = stateManager.addCompletedTask(state, {
      id: 'task-1',
      name: 'Process batch 1',
      itemCount: 10,
      status: 'completed'
    });

    updatedState = stateManager.setCurrentTask(updatedState, {
      id: 'task-2',
      name: 'Process batch 2',
      itemCount: 10
    });

    updatedState = stateManager.addTokens(updatedState, 5200);

    // Update checkpoint
    stateManager.saveState(updatedState);
    console.log('\nCheckpoint updated');
  } catch (error) {
    console.error('Resume failed:', error.message);
  }
}

// ============================================================================
// Example 3: Handle errors and log them
// ============================================================================
function example_errorHandling() {
  console.log('\n=== Example 3: Error Handling ===\n');

  let state = stateManager.initializeState('Process with error handling');

  // Simulate work
  state = stateManager.setCurrentTask(state, { id: 'task-1', name: 'Task 1' });
  state = stateManager.addTokens(state, 1000);

  // Simulate an error
  try {
    throw new Error('Network timeout while fetching data');
  } catch (error) {
    state = stateManager.logError(state, error, 'fetch-operation');
    console.log('Error logged');
  }

  // Continue with next task
  state = stateManager.addCompletedTask(state, { id: 'task-1', name: 'Task 1', status: 'retrying' });
  state = stateManager.setCurrentTask(state, { id: 'task-1-retry', name: 'Task 1 (retry)' });

  stateManager.saveState(state);

  // Check progress
  const progress = stateManager.getProgress(state);
  console.log('Progress:', JSON.stringify(progress, null, 2));
}

// ============================================================================
// Example 4: Workflow with multiple tasks
// ============================================================================
function example_multiTaskWorkflow() {
  console.log('\n=== Example 4: Multi-Task Workflow ===\n');

  let state = stateManager.initializeState('Multi-task data processing pipeline');

  const tasks = [
    { id: 'validate', name: 'Validate input', tokens: 2000 },
    { id: 'transform', name: 'Transform data', tokens: 8000 },
    { id: 'enrich', name: 'Enrich records', tokens: 5000 },
    { id: 'export', name: 'Export results', tokens: 3000 }
  ];

  // Simulate completing tasks
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    // Set as current
    state = stateManager.setCurrentTask(state, { ...task, status: 'running' });
    state = stateManager.addTokens(state, task.tokens);

    // Complete task
    state = stateManager.addCompletedTask(state, { ...task, status: 'completed' });

    // Save after each task
    stateManager.saveState(state);
    console.log(`✓ Completed: ${task.name} (+${task.tokens} tokens)`);
  }

  // Clear current task
  state = stateManager.setCurrentTask(state, null);
  stateManager.saveState(state);

  console.log('\nFinal progress:', JSON.stringify(stateManager.getProgress(state), null, 2));
}

// ============================================================================
// Example 5: State verification and migration
// ============================================================================
function example_verificationAndMigration() {
  console.log('\n=== Example 5: Verification & Migration ===\n');

  // Create state with potential old schema
  const oldState = {
    goal: 'Legacy goal',
    completedTasks: [],
    currentTask: null,
    tokenSpent: 0,
    timestamp: new Date().toISOString()
    // Missing: errorLog, metadata, schemaVersion
  };

  console.log('Old state (missing fields):', JSON.stringify(oldState, null, 2));

  // Migrate to current schema
  const migratedState = stateManager.migrateState(oldState);
  console.log('\nAfter migration:', JSON.stringify(migratedState, null, 2));

  // Verify migrated state
  const verification = stateManager.verifyState(migratedState);
  console.log('\nVerification result:', verification);
}

// ============================================================================
// Example 6: Export state and recovery
// ============================================================================
function example_exportAndRecovery() {
  console.log('\n=== Example 6: Export & Recovery ===\n');

  let state = stateManager.initializeState('Export and recovery test');
  state = stateManager.addTokens(state, 5000);
  state = stateManager.addCompletedTask(state, { id: 'task-1', name: 'Sample task' });

  // Export state
  const exported = stateManager.exportState(state);
  console.log('Exported state (JSON):');
  console.log(exported);

  // Could save this for manual recovery/audit
  console.log('\nCheckpoint path:', stateManager.getCheckpointPath());
}

// ============================================================================
// Example 7: Checkpoint lifecycle
// ============================================================================
function example_checkpointLifecycle() {
  console.log('\n=== Example 7: Checkpoint Lifecycle ===\n');

  // Check initial state
  console.log('Checkpoint exists:', stateManager.checkpointExists());

  // Create state
  let state = stateManager.initializeState('Lifecycle test');
  stateManager.saveState(state);

  console.log('Checkpoint exists after save:', stateManager.checkpointExists());

  // Load state
  const loaded = stateManager.loadState();
  console.log('Loaded state goal:', loaded.goal);

  // Clear checkpoint
  stateManager.clearCheckpoint();
  console.log('Checkpoint exists after clear:', stateManager.checkpointExists());
}

// ============================================================================
// Main runner
// ============================================================================
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('State Manager Examples');
    console.log('======================\n');
    console.log('Usage: node state-manager.example.js [example-number]');
    console.log('\nAvailable examples:');
    console.log('  1 - Initialize new session');
    console.log('  2 - Resume from checkpoint');
    console.log('  3 - Error handling');
    console.log('  4 - Multi-task workflow');
    console.log('  5 - Verification and migration');
    console.log('  6 - Export and recovery');
    console.log('  7 - Checkpoint lifecycle');
    process.exit(0);
  }

  const examples = {
    '1': example_initializeSession,
    '2': example_resumeSession,
    '3': example_errorHandling,
    '4': example_multiTaskWorkflow,
    '5': example_verificationAndMigration,
    '6': example_exportAndRecovery,
    '7': example_checkpointLifecycle
  };

  const exampleNum = args[0];
  const exampleFn = examples[exampleNum];

  if (!exampleFn) {
    console.error(`Unknown example: ${exampleNum}`);
    process.exit(1);
  }

  try {
    exampleFn();
  } catch (error) {
    console.error('Example failed:', error);
    process.exit(1);
  }
}

module.exports = {
  example_initializeSession,
  example_resumeSession,
  example_errorHandling,
  example_multiTaskWorkflow,
  example_verificationAndMigration,
  example_exportAndRecovery,
  example_checkpointLifecycle
};
