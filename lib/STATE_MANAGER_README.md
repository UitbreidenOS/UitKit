# State Manager — Checkpoint/Resume for Long-Running Operations

A robust state persistence system for managing and resuming long-running operations in Claude Code workflows. Automatically saves progress to `.claude/dont-stop-state.json` with full recovery, migration, and error logging support.

## Features

- **Persistent Checkpoints**: Save state to `.claude/dont-stop-state.json` with automatic directory creation
- **Resume from Checkpoint**: Load previous session state with schema verification and automatic migration
- **Task Tracking**: Track completed tasks, current task, and total items processed
- **Token Accounting**: Monitor tokens spent across sessions
- **Error Logging**: Capture and preserve error context for debugging interrupted workflows
- **Schema Migration**: Handle goal/task schema changes between sessions automatically
- **State Verification**: Validate state consistency and integrity before resuming

## Installation

The module is included in the Claudient repository under `lib/state-manager.js`.

```javascript
const stateManager = require('./lib/state-manager');
```

## Quick Start

### Initialize a New Session

```javascript
const stateManager = require('./lib/state-manager');

// Create initial state for a goal
let state = stateManager.initializeState('Process 1000 items from queue');

// Update state as you work
state = stateManager.setCurrentTask(state, {
  id: 'batch-1',
  name: 'Process batch 1-100'
});

state = stateManager.addTokens(state, 5000);

// Save checkpoint
stateManager.saveState(state);
```

### Resume from a Previous Session

```javascript
const stateManager = require('./lib/state-manager');

// Attempt to resume from checkpoint
const state = stateManager.resume();

if (!state) {
  console.log('Starting fresh - no previous checkpoint');
  // Initialize new session
}

// Continue work from where you left off
console.log(`Goal: ${state.goal}`);
console.log(`Completed tasks: ${state.completedTasks.length}`);
console.log(`Tokens used: ${state.tokenSpent}`);
```

## Core API

### State Management

#### `initializeState(goal: string): Object`
Create initial state for a new session with a specific goal.

```javascript
const state = stateManager.initializeState('Migrate 10000 records');
```

#### `createDefaultState(): Object`
Create a default state object (used internally by `initializeState`).

#### `saveState(state: Object): void`
Persist state to `.claude/dont-stop-state.json`.

```javascript
stateManager.saveState(state);
```

#### `loadState(): Object|null`
Load raw state from checkpoint file. Returns `null` if file doesn't exist.
Throws if file is corrupted.

```javascript
try {
  const rawState = stateManager.loadState();
} catch (error) {
  console.error('Failed to load:', error.message);
}
```

#### `resume(): Object|null`
Load and verify state from checkpoint, with automatic migration.
Returns `null` if no checkpoint exists. Throws if verification fails.

```javascript
try {
  const state = stateManager.resume();
  if (state) {
    // Resume work
  }
} catch (error) {
  console.error('Resume failed:', error.message);
}
```

### Task Tracking

#### `setCurrentTask(state: Object, task: Object|null): Object`
Set the currently-active task. Adds `startedAt` timestamp.
Pass `null` to clear the current task.

```javascript
state = stateManager.setCurrentTask(state, {
  id: 'task-42',
  name: 'Process batch 42',
  batchSize: 100
});
```

#### `addCompletedTask(state: Object, task: Object): Object`
Mark a task as completed and add to history. Adds `completedAt` timestamp.

```javascript
state = stateManager.addCompletedTask(state, {
  id: 'task-42',
  name: 'Process batch 42',
  itemsProcessed: 98,
  status: 'completed'
});
```

### Token Accounting

#### `addTokens(state: Object, tokens: number): Object`
Add tokens spent during work. Validates input (non-negative number).

```javascript
state = stateManager.addTokens(state, 5243);
```

### Error Logging

#### `logError(state: Object, error: Error|string, context: string): Object`
Log an error with timestamp and context. Captures stack trace for Error objects.

```javascript
try {
  // Some operation
} catch (error) {
  state = stateManager.logError(state, error, 'batch-processing');
  stateManager.saveState(state);
}
```

### Utilities

#### `verifyState(state: Object): {valid: boolean, errors: string[]}`
Validate state structure and types. Returns validation result.

```javascript
const { valid, errors } = stateManager.verifyState(state);
if (!valid) {
  console.error('State corruption:', errors);
}
```

#### `migrateState(state: Object): Object`
Migrate state from older schema versions to current version.
Automatically adds missing fields for legacy states.

```javascript
const migratedState = stateManager.migrateState(oldState);
```

#### `getProgress(state: Object): Object`
Get a human-readable progress summary.

```javascript
const progress = stateManager.getProgress(state);
console.log(`
  Goal: ${progress.goal}
  Completed: ${progress.totalCompleted} tasks
  Tokens spent: ${progress.tokensSpent}
  Current: ${progress.currentTask}
  Errors: ${progress.errors}
`);
```

#### `exportState(state: Object): string`
Export state as formatted JSON string (useful for manual inspection/backup).

```javascript
const json = stateManager.exportState(state);
fs.writeFileSync('state-backup.json', json);
```

#### `clearCheckpoint(): void`
Delete the checkpoint file completely.

```javascript
stateManager.clearCheckpoint();
```

#### `checkpointExists(): boolean`
Check if a checkpoint file exists.

```javascript
if (stateManager.checkpointExists()) {
  console.log('Previous checkpoint found');
}
```

#### `getCheckpointPath(): string`
Get full path to checkpoint file.

```javascript
const path = stateManager.getCheckpointPath();
console.log('Checkpoint at:', path);
```

## State Schema

```javascript
{
  schemaVersion: 1,           // For handling future migrations
  goal: string|null,          // The objective for this session
  completedTasks: [           // Array of finished tasks
    {
      id: string,
      name: string,
      // ... custom task fields
      completedAt: ISO8601string
    }
  ],
  currentTask: object|null,   // Currently-active task (with startedAt)
  tokenSpent: number,         // Total tokens used in session
  timestamp: ISO8601string,   // Last update time
  errorLog: [                 // Captured errors
    {
      timestamp: ISO8601string,
      context: string,
      message: string,
      stack: string|undefined
    }
  ],
  metadata: object            // Application-specific data
}
```

## Workflow Patterns

### Pattern 1: Batch Processing with Checkpoint

```javascript
const stateManager = require('./lib/state-manager');

async function processBatches() {
  // Try to resume from checkpoint
  let state = stateManager.resume();

  if (!state) {
    // First run - initialize
    state = stateManager.initializeState('Process all user records');
  }

  const batches = generateBatches(1000, 100); // 1000 items, 100 per batch
  const startFrom = state.completedTasks.length;

  for (let i = startFrom; i < batches.length; i++) {
    const batch = batches[i];

    try {
      state = stateManager.setCurrentTask(state, {
        id: `batch-${i}`,
        name: `Process items ${i * 100}-${(i + 1) * 100}`,
        batchIndex: i
      });

      const result = await processBatch(batch);
      const tokensUsed = estimateTokens(result);

      state = stateManager.addTokens(state, tokensUsed);
      state = stateManager.addCompletedTask(state, {
        id: `batch-${i}`,
        status: 'completed',
        itemsProcessed: batch.length
      });

      // Save after each batch
      stateManager.saveState(state);
      console.log(`Batch ${i} done. Progress: ${stateManager.getProgress(state)}`);

    } catch (error) {
      state = stateManager.logError(state, error, `batch-${i}`);
      stateManager.saveState(state);
      throw error; // Will resume from this batch on restart
    }
  }

  console.log('All batches completed:', stateManager.getProgress(state));
}
```

### Pattern 2: Long-Running Workflow with Checkpoints

```javascript
async function migrationWorkflow() {
  let state = stateManager.resume() || 
    stateManager.initializeState('Migrate legacy data to v2 schema');

  const stages = [
    { name: 'validation', fn: validateSchema },
    { name: 'transform', fn: transformData },
    { name: 'enrich', fn: enrichRecords },
    { name: 'export', fn: exportResults }
  ];

  const completedStages = new Set(
    state.completedTasks.map(t => t.stageId)
  );

  for (const stage of stages) {
    if (completedStages.has(stage.name)) {
      console.log(`✓ ${stage.name} already done`);
      continue;
    }

    state = stateManager.setCurrentTask(state, {
      id: `stage-${stage.name}`,
      stageId: stage.name,
      name: `Run ${stage.name} stage`
    });

    try {
      const result = await stage.fn();
      state = stateManager.addTokens(state, result.tokensUsed);
      state = stateManager.addCompletedTask(state, {
        id: `stage-${stage.name}`,
        stageId: stage.name,
        status: 'completed'
      });
      stateManager.saveState(state);
    } catch (error) {
      state = stateManager.logError(state, error, stage.name);
      stateManager.saveState(state);
      throw error;
    }
  }
}
```

### Pattern 3: Recovery and Retry Logic

```javascript
async function robustProcessor() {
  let state = stateManager.resume() ||
    stateManager.initializeState('Process with retry logic');

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Do work
      const result = await performWork();
      state = stateManager.addTokens(state, result.tokens);
      state = stateManager.addCompletedTask(state, result.task);
      stateManager.saveState(state);
      return state;

    } catch (error) {
      retryCount++;
      state = stateManager.logError(
        state,
        error,
        `attempt-${retryCount}`
      );

      if (retryCount >= maxRetries) {
        stateManager.saveState(state);
        throw new Error(`Failed after ${maxRetries} attempts`);
      }

      // Wait before retry
      console.log(`Retry ${retryCount}/${maxRetries} in 5s...`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}
```

## Testing

Run the test suite:

```bash
node lib/state-manager.test.js
```

All 51 tests should pass.

## Examples

Run example workflows:

```bash
# View available examples
node lib/state-manager.example.js

# Initialize new session
node lib/state-manager.example.js 1

# Resume from checkpoint
node lib/state-manager.example.js 2

# Error handling
node lib/state-manager.example.js 3

# Multi-task workflow
node lib/state-manager.example.js 4

# Verification & migration
node lib/state-manager.example.js 5

# Export & recovery
node lib/state-manager.example.js 6

# Checkpoint lifecycle
node lib/state-manager.example.js 7
```

## Migration Support

The state manager automatically handles schema version changes:

- **Version 0 → 1**: Adds missing `errorLog` and `metadata` fields
- Future versions: Will continue backward-compatible migrations

When loading old state:

```javascript
const state = stateManager.resume();
// Automatically migrated to current schema
console.log(state.schemaVersion); // 1
```

## Error Handling

### Corrupted Checkpoint

```javascript
try {
  const state = stateManager.resume();
} catch (error) {
  console.error('State verification failed:', error.message);
  // Decide: clear checkpoint or manual recovery
  stateManager.clearCheckpoint();
}
```

### Invalid State Operations

```javascript
try {
  state = stateManager.addTokens(state, -100); // Invalid
} catch (error) {
  console.error('Invalid tokens:', error.message);
}
```

### Manual State Recovery

```javascript
const path = stateManager.getCheckpointPath();
const backup = fs.readFileSync(path, 'utf8');
fs.writeFileSync(`backup-${Date.now()}.json`, backup);
```

## Performance Considerations

- State is saved to disk with each checkpoint (after tasks complete)
- File I/O is synchronous but should be fast for typical state sizes
- State files are typically < 10KB for thousands of tasks
- No in-memory limits; suitable for arbitrarily long workflows

## Backward Compatibility

- New fields added in migrations are optional
- Old state files are automatically upgraded on load
- Schema version tracks breaking changes
- Custom metadata preserved across migrations

## Constants

```javascript
stateManager.SCHEMA_VERSION  // Current schema version (1)
stateManager.STATE_FILE      // Full path to checkpoint file
```

## License

Same as Claudient repository (AGPL-3.0-or-later AND CC-BY-SA-4.0)
