# State Manager Integration Guide

Integration patterns for adding checkpoint/resume capability to Claude Code workflows.

## Quick Integration

### 1. Import the Module

```javascript
const stateManager = require('./lib/state-manager');
```

### 2. Initialize or Resume

```javascript
// At start of workflow
let state = stateManager.resume();
if (!state) {
  state = stateManager.initializeState('Your workflow goal');
}
```

### 3. Track Work

```javascript
// Set current task
state = stateManager.setCurrentTask(state, { id: 'task-1', name: 'Step 1' });

// Do work...
const tokensUsed = 5000;
state = stateManager.addTokens(state, tokensUsed);

// Mark completed
state = stateManager.addCompletedTask(state, { id: 'task-1', status: 'done' });

// Save checkpoint
stateManager.saveState(state);
```

### 4. Handle Errors

```javascript
try {
  // Some operation
} catch (error) {
  state = stateManager.logError(state, error, 'operation-context');
  stateManager.saveState(state);
  throw error; // Will resume from here
}
```

## Integration Points

### In Long-Running CLI Scripts

```javascript
#!/usr/bin/env node

const stateManager = require('./lib/state-manager');

async function main() {
  // Resume from checkpoint
  let state = stateManager.resume();
  if (!state) {
    state = stateManager.initializeState('Process all files');
  }

  const files = getFilesNeeding(getLastProcessed(state));

  for (const file of files) {
    state = stateManager.setCurrentTask(state, {
      id: file.path,
      name: `Process ${file.name}`,
      path: file.path
    });

    try {
      const result = await processFile(file);
      state = stateManager.addTokens(state, result.tokens);
      state = stateManager.addCompletedTask(state, {
        id: file.path,
        status: 'completed',
        size: file.size
      });
      stateManager.saveState(state);
      console.log(`✓ ${file.name}`);
    } catch (error) {
      state = stateManager.logError(state, error, file.path);
      stateManager.saveState(state);
      console.error(`✗ ${file.name}: ${error.message}`);
    }
  }

  console.log('\nComplete!', stateManager.getProgress(state));
}

function getLastProcessed(state) {
  if (state.completedTasks.length === 0) return null;
  return state.completedTasks[state.completedTasks.length - 1].id;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

## Best Practices

1. **Save After Each Checkpoint**: Save state after completing meaningful units of work
2. **Use Descriptive IDs**: Task IDs should be unique and identify the item processed
3. **Preserve Context**: Include relevant context in error logs for debugging
4. **Validate on Resume**: Check that resumed state makes sense for current environment
5. **Handle Schema Changes**: Plan for future state schema changes with version handling
6. **Backup State**: Archive state files before processing large workloads
7. **Monitor Progress**: Check `getProgress()` periodically for visibility
8. **Log Frequently**: Use `logError()` liberally for troubleshooting

## Debugging

### View Current Checkpoint

```bash
cat .claude/dont-stop-state.json | jq .
```

### Check Progress

```javascript
const stateManager = require('./lib/state-manager');
const state = stateManager.loadState();
console.log(stateManager.getProgress(state));
```

### Clear and Restart

```bash
rm .claude/dont-stop-state.json
```

## See Also

- `STATE_MANAGER_README.md` — Complete API documentation
- `state-manager.example.js` — Working examples
- `state-manager.test.js` — Test suite
