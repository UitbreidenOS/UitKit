# State Management System

Global state management for dont-stop workflows with versioning, conflict resolution, and rollback capability.

## Overview

The State Management system provides:

- **Global State**: Centralized shared context across agents and skills
- **Versioning**: Full version history with checksums and metadata
- **Conflict Resolution**: Multiple strategies for handling concurrent updates
- **Rollback**: Revert to any previous state version
- **Locking**: Concurrency control for safe multi-agent access
- **Subscriptions**: Publish-subscribe pattern for state changes
- **Shared Contexts**: Namespace-based context storage for different agents
- **Persistence**: Automatic disk persistence with recovery

## Core Classes

### GlobalStateManager

Central state management with versioning and rollback.

```javascript
const { GlobalStateManager } = require('./state-management');

const manager = new GlobalStateManager();

// Get current state
const state = manager.getState();
const value = manager.getState('nested.key');

// Set state (creates new version)
const version = manager.setState({ key: 'value' }, { description: 'update reason' });

// Merge with deep merge strategy
manager.mergeState({ nested: { key: 'value' } });

// Rollback to previous version
manager.rollbackToVersion(5);

// Subscribe to changes
const unsubscribe = manager.on('state-changed', (event) => {
  console.log('Version', event.version, 'changed');
});
```

### StateVersion

Represents a single state version with metadata and checksums.

```javascript
const version = new StateVersion(1, timestamp);
version.data = { /* state data */ };
version.metadata = { author: 'user', description: 'change reason' };
version.computeHash(version.data); // Generate SHA256 hash
```

### ConflictResolver

Handles concurrent update conflicts with multiple strategies.

```javascript
const { ConflictResolver, CONFLICT_STRATEGIES } = require('./state-management');

// Last write wins (default)
const resolver = new ConflictResolver(CONFLICT_STRATEGIES.LAST_WRITE_WINS);

// Or set custom resolver
resolver.setCustomResolver((local, incoming, base) => {
  // Custom merge logic
  return mergedVersion;
});

const conflict = resolver.resolve(local, incoming, base);
if (conflict.result) {
  console.log('Resolved:', conflict.result);
}
```

### SharedContextStore

Multi-namespace context storage for agents and skills.

```javascript
const { SharedContextStore } = require('./state-management');

const contextStore = new SharedContextStore(manager);

// Get context for agent
const agentContext = contextStore.getContext('agent-1');

// Set values in context
contextStore.setContextValue('agent-1', 'taskQueue', [/* tasks */]);

// Get values
const queue = contextStore.getContextValue('agent-1', 'taskQueue');

// Merge context data
contextStore.mergeContextData('agent-1', { status: 'active' });

// Clear context
contextStore.clearContext('agent-1');
```

## Conflict Resolution Strategies

### LAST_WRITE_WINS
Latest timestamp wins (default). Good for simple updates without complex merging.

```javascript
const resolver = new ConflictResolver(CONFLICT_STRATEGIES.LAST_WRITE_WINS);
```

### FIRST_WRITE_WINS
Earliest timestamp wins. Useful for initialization or baseline protection.

```javascript
const resolver = new ConflictResolver(CONFLICT_STRATEGIES.FIRST_WRITE_WINS);
```

### MERGE
Deep merge of both states. Combines nested objects intelligently.

```javascript
const resolver = new ConflictResolver(CONFLICT_STRATEGIES.MERGE);
```

### CUSTOM
Use a function for custom resolution logic.

```javascript
const resolver = new ConflictResolver();
resolver.setCustomResolver((local, incoming, base) => {
  // Complex merge logic with business rules
  return customMergedVersion;
});
```

### LATEST_VERSION
Use state with highest version number.

```javascript
const resolver = new ConflictResolver(CONFLICT_STRATEGIES.LATEST_VERSION);
```

### MANUAL
Require manual intervention; returns null result.

```javascript
const resolver = new ConflictResolver(CONFLICT_STRATEGIES.MANUAL);
```

## Version History & Rollback

### Get Version History

```javascript
// Get last 20 versions
const history = manager.getVersionHistory({ limit: 20 });

// Get versions since timestamp
const recent = manager.getVersionHistory({ 
  since: '2024-01-15T10:00:00Z' 
});

// Get versions with specific tags
const tagged = manager.getVersionHistory({ 
  tags: ['release', 'checkpoint'] 
});
```

### Compare Versions

```javascript
const comparison = manager.compareVersions(5, 8);
console.log(comparison.differences);
// [
//   { path: 'tasks.0.status', from: 'pending', to: 'completed' },
//   { path: 'metrics.duration', from: 100, to: 105 }
// ]
```

### Rollback

```javascript
// Rollback to specific version
const rolled = manager.rollbackToVersion(5);

// Current version is now newer than target
console.log(rolled.versionNumber); // e.g., 23 (new version after rollback)
```

## Concurrency Control

The system uses pessimistic locking with read-write distinctions.

```javascript
// Multiple read locks can be held simultaneously
const readLock1 = manager._acquireLock('read');
const readLock2 = manager._acquireLock('read');

// Write lock blocks all other locks
const writeLock = manager._acquireLock('write'); // May timeout

// Release locks
manager._releaseLock(readLock1);
manager._releaseLock(writeLock);
```

Lock acquisition timeout: 5000ms (configurable)

## Subscriptions & Events

### Subscribe to State Changes

```javascript
// Listen to specific key changes
const unsubscribe = manager.subscribe('tasks', (newValue) => {
  console.log('Tasks updated:', newValue);
});

// Global state change events
manager.on('state-changed', (event) => {
  console.log('Version', event.version, 'changed');
  console.log('Changes:', event.changes);
});

manager.on('state-merged', (event) => {
  console.log('State merged to version', event.version);
});

manager.on('state-rolled-back', (event) => {
  console.log(`Rolled back from v${event.from} to v${event.to}, now v${event.newVersion}`);
});

// Cleanup
unsubscribe();
```

## CLI Interface

```bash
# Get entire state
node state-management.js get

# Get nested value
node state-management.js get tasks.queue

# Set value
node state-management.js set key '{"nested":"value"}'

# Merge JSON
node state-management.js merge '{"key":"value"}'

# Show version history
node state-management.js history 20

# Rollback to version
node state-management.js rollback 5

# Compare versions
node state-management.js compare 5 8

# Export snapshot
node state-management.js export json
node state-management.js export yaml

# Show status/diagnostics
node state-management.js status

# Show help
node state-management.js help
```

## Integration with Dont-Stop Workflows

### Example: Multi-Agent Coordination

```javascript
const { GlobalStateManager, SharedContextStore } = require('./state-management');

const stateManager = new GlobalStateManager();
const contextStore = new SharedContextStore(stateManager);

// Agent 1: Task producer
function agentProducer() {
  const context = contextStore.getContext('producer');
  const tasks = generateTasks();
  
  contextStore.setContextValue('producer', 'queue', tasks, {
    count: tasks.length,
    source: 'generator'
  });
}

// Agent 2: Task consumer
function agentConsumer() {
  const queue = contextStore.getContextValue('producer', 'queue') || [];
  
  if (queue.length > 0) {
    const task = queue.shift();
    const result = executeTask(task);
    
    contextStore.setContextValue('consumer', 'lastResult', result);
  }
}

// Monitor state changes
stateManager.on('state-changed', (event) => {
  console.log(`State updated to v${event.version}`);
});

// Subscribe to producer queue changes
const unsubscribe = stateManager.subscribe('producer', (context) => {
  console.log('Producer context updated');
});
```

### Example: Checkpoint & Recovery

```javascript
// Save state before risky operation
const beforeVersion = stateManager.currentState.versionNumber;

try {
  // Execute risky workflow
  executeComplexWorkflow();
  
  // Success - state persisted automatically
} catch (error) {
  // Rollback on failure
  stateManager.rollbackToVersion(beforeVersion);
  console.log('Workflow failed, rolled back');
}
```

### Example: Conflict Resolution

```javascript
// Simulate concurrent updates from two agents
const agent1State = new StateVersion(5);
agent1State.data = { tasks: [1, 2, 3], status: 'processing' };

const agent2State = new StateVersion(5);
agent2State.data = { tasks: [1, 2, 3, 4], status: 'completed' };

// Resolve conflict
const resolver = new ConflictResolver(CONFLICT_STRATEGIES.MERGE);
const resolved = resolver.resolve(agent1State, agent2State);

// Result merges both states intelligently
console.log(resolved.result.data);
// { tasks: [1, 2, 3, 4], status: 'completed' }
```

## Storage & Persistence

### File Structure

```
.claude/state/
├── global-state.json          # Current state
├── version-history.json       # All versions
└── changelog.md              # Human-readable changelog
```

### State File Format

```json
{
  "currentVersion": 42,
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "tasks": [...],
    "metrics": {...},
    "contexts": {...}
  },
  "metadata": {
    "author": "system",
    "description": "workflow state",
    "tags": ["checkpoint"],
    "previousVersion": 41
  },
  "hash": "abc123..."
}
```

### Automatic Recovery

On startup, state manager automatically:
1. Loads last persisted state
2. Validates checksums
3. Rebuilds version history
4. Initializes from disk if available

## Diagnostics

```javascript
const diag = stateManager.getDiagnostics();
console.log(diag);
// {
//   currentVersion: 42,
//   totalVersions: 42,
//   totalChanges: 127,
//   activeLocks: 0,
//   subscriptions: 5,
//   storageSize: 8192,
//   lastModified: "2024-01-15T10:30:00Z"
// }
```

## Performance Considerations

- **Lock timeout**: 5000ms (configurable)
- **State hash**: SHA256, computed on every change
- **Version history**: Unbounded (consider periodic cleanup)
- **Subscriptions**: O(n) callback invocation per change
- **Deep merge**: O(n) object traversal

For high-volume workflows, consider:
- Batching state updates
- Using selective subscriptions
- Periodically archiving old versions
- Setting explicit metadata tags for filtering

## Error Handling

### Lock Acquisition Timeout

```javascript
try {
  const lock = manager._acquireLock('write');
  if (!lock) {
    throw new Error('Could not acquire write lock after timeout');
  }
  // Perform write
} finally {
  manager._releaseLock(lock);
}
```

### Rollback Errors

```javascript
try {
  manager.rollbackToVersion(999);
} catch (error) {
  if (error.message.includes('not found')) {
    console.log('Version does not exist');
  }
}
```

### Conflict Resolution Errors

```javascript
try {
  const conflict = resolver.resolve(local, incoming);
  if (conflict.error) {
    console.log('Resolution failed:', conflict.error);
  }
  if (conflict.needsManualResolution) {
    // Handle manual intervention
  }
} catch (error) {
  console.log('Resolver error:', error.message);
}
```

## Testing

```javascript
const assert = require('assert');
const { GlobalStateManager } = require('./state-management');

function testVersioning() {
  const manager = new GlobalStateManager();
  
  // Set initial state
  const v1 = manager.setState({ count: 0 });
  assert.equal(v1.versionNumber, 1);
  
  // Update state
  const v2 = manager.setState({ count: 1 });
  assert.equal(v2.versionNumber, 2);
  
  // Verify history
  const history = manager.getVersionHistory();
  assert.equal(history.length, 1); // v1 in history
  
  // Rollback
  const v3 = manager.rollbackToVersion(1);
  assert.equal(v3.versionNumber, 3);
  assert.deepEqual(v3.data, { count: 0 });
}

testVersioning();
console.log('✓ All tests passed');
```

## Architecture

```
GlobalStateManager (extends EventEmitter)
├── CurrentState (StateVersion)
├── VersionHistory (StateVersion[])
├── ConflictResolver
├── SharedContextStore
├── Locks (Map)
├── Subscribers (Map)
└── Storage (disk persistence)
```

State changes flow:
1. Client calls setState/mergeState/rollbackToVersion
2. Acquire write lock
3. Create new StateVersion
4. Record to history
5. Compute hash
6. Notify subscribers
7. Persist to disk
8. Emit event
9. Release lock

## Best Practices

1. **Always release locks** - Use try/finally
2. **Use meaningful metadata** - Help with debugging
3. **Tag important versions** - For filtering and recovery
4. **Subscribe selectively** - Only to keys you need
5. **Handle errors** - Check conflict results
6. **Monitor diagnostics** - Watch for lock contention
7. **Batch updates** - Reduce version spam
8. **Archive old versions** - Prevent unbounded growth
9. **Use namespaced contexts** - Isolate agent data
10. **Validate state** - Check checksums on load

## Changelog

See `.claude/state/changelog.md` for full change history with version details, timestamps, and affected keys.
