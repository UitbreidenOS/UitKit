# State Management Integration Guide

Quick reference for integrating state management into dont-stop workflows.

## Quick Start

### 1. Initialize State Manager

```javascript
const { GlobalStateManager, SharedContextStore } = require('./state-management');

// Create manager (auto-loads from disk)
const stateManager = new GlobalStateManager();
const contextStore = new SharedContextStore(stateManager);

// Initialize workflow state
stateManager.setState({
  goal: 'Build and deploy application',
  tasks: [],
  status: 'starting',
  metrics: {
    startTime: Date.now(),
    tasksCompleted: 0,
    tasksFailed: 0
  }
});
```

### 2. Update State from Agents

```javascript
// In dont-stop-engine.js
class AutonomousExecutor {
  constructor(goalString, config = {}) {
    // ... existing code ...
    this.stateManager = new GlobalStateManager();
  }

  async run() {
    // Before workflow
    this.stateManager.setState({ status: 'running' });

    for (const task of this.dag.tasks) {
      const taskResult = await this.engine.executeTask(task);
      
      // Update state after each task
      this.stateManager.setState({
        lastCompletedTask: task.id,
        metrics: {
          ...this.stateManager.getState('metrics'),
          tasksCompleted: this.stateManager.getState('metrics.tasksCompleted') + 1
        }
      }, {
        description: `Completed ${task.title}`,
        tags: ['task-complete']
      });

      // Checkpoint periodically
      if (this.checkpointCounter % 5 === 0) {
        this.stateManager.setState({
          checkpointVersion: this.stateManager.currentState.versionNumber
        });
      }
    }

    // After workflow
    this.stateManager.setState({
      status: 'completed',
      endTime: Date.now()
    });
  }
}
```

### 3. Agent Pool Integration

```javascript
// In dont-stop-agent-pool.js
class AgentPool {
  constructor() {
    this.stateManager = new GlobalStateManager();
    this.contextStore = new SharedContextStore(this.stateManager);
  }

  async spawnAgent(agentId, goal) {
    // Create isolated context
    const context = this.contextStore.getContext(agentId);

    // Initialize agent state
    this.contextStore.setContextValue(agentId, 'status', 'spawned', {
      spawnTime: Date.now(),
      goal: goal
    });

    // Execute agent
    const result = await this._executeAgentLogic(agentId, goal);

    // Update result in context
    this.contextStore.setContextValue(agentId, 'result', result, {
      completionTime: Date.now(),
      success: !result.error
    });

    // Sync to global state
    this.stateManager.setState({
      agents: Object.fromEntries(this.contextStore.contexts)
    });

    return result;
  }
}
```

### 4. Subscribe to Changes

```javascript
// Monitor state changes
stateManager.on('state-changed', (event) => {
  console.log(`State updated to v${event.version}`);
  console.log('Changed keys:', event.changes.updates);
});

// Subscribe to specific key
const unsubscribe = stateManager.subscribe('status', (value) => {
  if (value === 'completed') {
    console.log('Workflow complete!');
  }
});

// Cleanup
// unsubscribe();
```

## Integration Patterns

### Pattern 1: Task DAG Progress Tracking

```javascript
// In TaskDAGBuilder or AutonomousExecutor
class TaskDAGBuilder {
  parse() {
    const dag = this._buildDependencies(taskStrings);

    // Initialize progress in state
    this.stateManager.setState({
      dag: {
        totalTasks: dag.tasks.length,
        taskStatus: dag.tasks.reduce((acc, t) => {
          acc[t.id] = { status: 'pending', progress: 0 };
          return acc;
        }, {})
      }
    });

    return dag;
  }

  updateTaskProgress(taskId, progress, status) {
    const current = this.stateManager.getState('dag.taskStatus');
    current[taskId] = { status, progress };
    
    this.stateManager.setState({
      dag: { ...this.stateManager.getState('dag'), taskStatus: current }
    });
  }
}
```

### Pattern 2: Conflict Resolution on Concurrent Updates

```javascript
// In agent pool with multiple agents writing state
const { ConflictResolver, CONFLICT_STRATEGIES } = require('./state-management');

class MultiAgentCoordinator {
  constructor() {
    this.stateManager = new GlobalStateManager();
    this.resolver = new ConflictResolver(CONFLICT_STRATEGIES.MERGE);
  }

  async handleConcurrentUpdate(agentId, updates) {
    try {
      // Try to update
      this.stateManager.setState(updates, {
        author: agentId
      });
    } catch (error) {
      // If conflict, resolve and retry
      const conflict = this.resolver.resolve(
        this.stateManager.currentState,
        { data: updates }
      );

      if (conflict.result) {
        this.stateManager.setState(conflict.result.data);
      }
    }
  }
}
```

### Pattern 3: Checkpoint & Recovery

```javascript
// Wrap risky operations
async function executeWithCheckpoint(operation, stateManager) {
  // Save checkpoint
  const checkpointVersion = stateManager.currentState.versionNumber;
  
  try {
    await operation();
    console.log('✓ Operation succeeded');
  } catch (error) {
    console.log(`✗ Operation failed: ${error.message}`);
    console.log(`↻ Rolling back to v${checkpointVersion}`);
    
    // Rollback on failure
    stateManager.rollbackToVersion(checkpointVersion);
  }
}

// Usage
await executeWithCheckpoint(async () => {
  // Risky workflow steps
  stateManager.setState({ phase: 1 });
  stateManager.setState({ phase: 2 });
  stateManager.setState({ phase: 3 });
}, stateManager);
```

### Pattern 4: Context Isolation

```javascript
// Each agent gets isolated context
class Agent {
  constructor(agentId, stateManager) {
    this.id = agentId;
    this.stateManager = stateManager;
    this.contextStore = new SharedContextStore(stateManager);
  }

  async work(goal) {
    const context = this.contextStore.getContext(this.id);

    // Agent-local state
    this.contextStore.setContextValue(this.id, 'status', 'working');
    this.contextStore.setContextValue(this.id, 'goal', goal);

    try {
      const result = await this.execute(goal);
      this.contextStore.setContextValue(this.id, 'result', result);
      this.contextStore.setContextValue(this.id, 'status', 'idle');
      return result;
    } catch (error) {
      this.contextStore.setContextValue(this.id, 'error', error.message);
      this.contextStore.setContextValue(this.id, 'status', 'error');
      throw error;
    }
  }
}
```

## CLI Usage Examples

### Get Current State

```bash
# Entire state
node state-management.js get

# Specific key
node state-management.js get tasks.0.status

# Nested path
node state-management.js get metrics.tasksCompleted
```

### Update State

```bash
# Set simple value
node state-management.js set goal "rebuild"

# Set JSON object
node state-management.js set config '{"debug":true,"timeout":5000}'

# Deep merge
node state-management.js merge '{"metrics":{"newKey":"value"}}'
```

### Version Management

```bash
# Show history (last 10)
node state-management.js history 10

# Compare versions
node state-management.js compare 5 10

# Rollback
node state-management.js rollback 5
```

### Export & Diagnostics

```bash
# Export as JSON
node state-management.js export json > state.json

# Export as YAML
node state-management.js export yaml > state.yml

# Show status
node state-management.js status
```

## Monitoring & Debugging

### Enable Detailed Logging

```javascript
stateManager.on('state-changed', (event) => {
  console.log(`[v${event.version}] ${event.changes.updates.join(', ')}`);
});

stateManager.on('state-rolled-back', (event) => {
  console.log(`[ROLLBACK] v${event.from} → v${event.to}`);
});

// Watch conflict log
setInterval(() => {
  const conflicts = resolver.getConflictLog();
  if (conflicts.length > 0) {
    console.log(`${conflicts.length} conflicts recorded`);
  }
}, 5000);
```

### Check Manager Health

```javascript
function getHealthStatus(stateManager) {
  const diag = stateManager.getDiagnostics();
  
  return {
    healthy: diag.activeLocks === 0,
    version: diag.currentVersion,
    changes: diag.totalChanges,
    lockWaitTime: diag.activeLocks > 0 ? 'HIGH' : 'LOW',
    storageSize: `${Math.round(diag.storageSize / 1024)}KB`
  };
}
```

## Testing Strategies

### Unit Tests

```javascript
const { GlobalStateManager } = require('./state-management');

function testStateUpdate() {
  const manager = new GlobalStateManager();
  const v1 = manager.setState({ count: 0 });
  const v2 = manager.setState({ count: 1 });

  assert.equal(v2.versionNumber, 2);
  assert.equal(manager.getState('count'), 1);
  assert.equal(manager.versionHistory.length, 1);
}

testStateUpdate();
```

### Integration Tests

```javascript
async function testMultiAgentWorkflow() {
  const manager = new GlobalStateManager();
  const contextStore = new SharedContextStore(manager);

  // Simulate concurrent agents
  const results = await Promise.all([
    agent1Work(manager, contextStore),
    agent2Work(manager, contextStore),
    agent3Work(manager, contextStore)
  ]);

  // Verify final state
  const finalState = manager.getState();
  assert(finalState.allAgentsComplete);
}
```

### Stress Tests

```javascript
async function stressTestConcurrency() {
  const manager = new GlobalStateManager();

  const updates = Array(1000).fill(0).map((_, i) => 
    manager.setState({ iteration: i })
  );

  await Promise.allSettled(updates);

  const diag = manager.getDiagnostics();
  console.log(`Completed ${diag.totalChanges} changes`);
  console.log(`Final version: v${diag.currentVersion}`);
}
```

## Performance Tips

### 1. Batch Updates

```javascript
// ❌ Slow - creates version per update
stateManager.setState({ a: 1 });
stateManager.setState({ b: 2 });
stateManager.setState({ c: 3 });

// ✅ Fast - single version
stateManager.setState({ a: 1, b: 2, c: 3 });
```

### 2. Use Selective Subscriptions

```javascript
// ❌ Every change fires callback
stateManager.on('state-changed', callback);

// ✅ Only when needed key changes
stateManager.subscribe('tasks', callback);
```

### 3. Minimize Deep Merges

```javascript
// ❌ Deep traversal
stateManager.mergeState({ deeply: { nested: { value: 1 } } });

// ✅ Direct setState
stateManager.setState({ myData: { nested: { value: 1 } } });
```

### 4. Archive Old Versions

```javascript
// Keep only recent versions
function cleanupHistory(manager, keepVersions = 100) {
  const history = manager.getVersionHistory();
  if (history.length > keepVersions) {
    // Implement archival logic
    console.log(`Archive old versions, keeping ${keepVersions}`);
  }
}
```

## Troubleshooting

### Issue: Lock Timeout

```
Error: Could not acquire write lock
```

**Solution:** Reduce lock timeout or check for deadlock

```javascript
try {
  const lock = manager._acquireLock('write', 1000); // 1s timeout
  if (!lock) {
    console.log('Timeout - state is busy');
    // Retry or skip
  }
} catch (error) {
  console.log('Lock error:', error.message);
}
```

### Issue: Corrupted State File

```
Failed to load state: Unexpected token
```

**Solution:** Clear state and restart

```bash
rm -f .claude/state/*.json
# Application will reinitialize with fresh state
```

### Issue: Version Explosion

```
Storage size growing too large
```

**Solution:** Implement cleanup

```javascript
// Keep only last N versions
function pruneHistory(manager, maxVersions = 1000) {
  const history = manager.getVersionHistory();
  if (history.length > maxVersions) {
    // Implement removal logic
  }
}
```

## Migration & Upgrades

### From Previous State System

```javascript
// Load old state
const oldState = require('./old-state.json');

// Create new manager
const manager = new GlobalStateManager();

// Initialize with old data
manager.setState(oldState, {
  description: 'Migration from previous state system',
  tags: ['migration']
});

// Verify
console.log(`Migrated to v${manager.currentState.versionNumber}`);
```

### Backward Compatibility

The state format is backward compatible:
- Old states load without modification
- Version number maintained across loads
- Hash recalculated on first change

## References

- **Full Architecture**: See STATE-MANAGEMENT-ARCHITECTURE.md
- **API Reference**: See STATE-MANAGEMENT-README.md
- **Examples**: See state-management-examples.js
- **Tests**: See state-management-tests.js
