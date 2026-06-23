# Don't Stop Agent Pool

Concurrent goal execution engine with resource isolation, workload balancing, priority queuing, and cost tracking. Run multiple don't-stop goals in parallel with fine-grained resource quotas and real-time metrics.

## Features

### Concurrent Execution
- Run up to N goals in parallel (configurable, default 4)
- Non-blocking event-based architecture
- Graceful shutdown with active goal completion

### Resource Management
- Per-goal token quotas (configurable limit)
- Per-goal duration limits (timeout protection)
- Per-goal retry budgets (configurable max retries)
- Resource utilization tracking (tokens, time, retries)

### Priority Scheduling
- 5-level priority system (CRITICAL, HIGH, NORMAL, LOW, BACKGROUND)
- Priority-aware queue with auto-reordering
- Higher priority goals execute before lower priority ones

### Workload Balancing
- Automatic load distribution across agents
- Least-busy agent assignment
- Load variance tracking
- Balanced scheduling decisions

### Cost Tracking
- Global token budget enforcement
- Per-goal cost tracking
- Cost history and analytics
- Top-cost aggregation by goal

### Isolation Levels
- **standard**: Process-level isolation
- **strict**: Full resource isolation with ulimits
- **relaxed**: Best-effort isolation

### State Persistence
- Pool state save/load for recovery
- Metrics snapshots (JSON)
- Session checkpoints

## Installation

```bash
# Agent pool is already bundled in scripts/
node scripts/dont-stop-agent-pool.js --help
```

## Usage

### CLI Demo

```bash
# Run demo with 4 concurrent goals (default)
node scripts/dont-stop-agent-pool.js demo

# Run with custom concurrency
node scripts/dont-stop-agent-pool.js demo --max-concurrent=8

# Show help
node scripts/dont-stop-agent-pool.js --help
```

### Programmatic API

```javascript
const { AgentPool, PRIORITIES } = require('./dont-stop-agent-pool.js');

// Create pool
const pool = new AgentPool({
  maxConcurrent: 4,
  globalBudget: 1000000, // tokens
});

// Listen to events
pool.on('goal-submitted', (e) => console.log('Goal queued:', e.goalId));
pool.on('goal-started', (e) => console.log('Goal running:', e.goal));
pool.on('goal-completed', (e) => console.log('Goal done:', e.goalId));
pool.on('goal-failed', (e) => console.log('Goal failed:', e.error));
pool.on('goal-retry', (e) => console.log(`Retry ${e.attempt}:`, e.error));

// Submit goals
const goalId1 = pool.submitGoal('validate project structure', {
  priority: PRIORITIES.HIGH,
  maxTokens: 50000,
  maxDuration: 120000, // 2 minutes
  maxRetries: 3,
});

const goalId2 = pool.submitGoal('run unit tests', {
  priority: PRIORITIES.NORMAL,
  maxTokens: 75000,
  maxDuration: 300000, // 5 minutes
  maxRetries: 2,
});

// Run pool
await pool.start();

// Get results
const metrics = pool.getMetrics();
console.log('Successful:', metrics.stats.goalsSuccessful);
console.log('Failed:', metrics.stats.goalsFailed);
console.log('Tokens used:', metrics.cost.spent);

// Save metrics
pool.saveMetrics();
pool.saveState();
```

## API Reference

### AgentPool

Main orchestrator for concurrent goal execution.

#### Constructor

```javascript
new AgentPool(options)
```

**Options:**
- `maxConcurrent` (number, default 4): Maximum concurrent goals
- `globalBudget` (number, default 1000000): Global token budget
- `defaultQuota` (ResourceQuota): Default quota per goal

#### Methods

##### submitGoal(goal, options)

Submit a goal to the pool.

```javascript
const goalId = pool.submitGoal('Build project', {
  priority: PRIORITIES.HIGH,
  maxTokens: 50000,
  maxDuration: 600000,
  maxRetries: 3,
  isolationLevel: 'standard',
  resourceLimits: {
    cpu: 1.0,
    memory: 512,
    fileHandles: 100,
  }
});
```

**Returns:** `goalId` (string)

##### getGoal(goalId)

Retrieve goal context.

```javascript
const goal = pool.getGoal(goalId);
console.log(goal.state); // 'queued', 'active', 'completed', 'failed'
console.log(goal.progress); // 0-100
console.log(goal.metrics); // tokens, tasks, retries
```

##### start()

Start the pool execution loop (async).

```javascript
await pool.start();
// Pool runs until all goals complete or queue empties
```

##### stop()

Stop the pool gracefully.

```javascript
await pool.stop();
// Waits for active goals (30s timeout)
```

##### suspendGoal(goalId)

Suspend an active goal.

```javascript
pool.suspendGoal(goalId);
```

##### resumeGoal(goalId)

Resume a suspended goal.

```javascript
pool.resumeGoal(goalId);
```

##### getMetrics()

Get comprehensive pool metrics.

```javascript
const metrics = pool.getMetrics();
// Returns: {
//   poolId, isRunning, stats, queue, active,
//   cost, topCosts, loadBalance, allGoals
// }
```

##### getStats()

Get high-level statistics.

```javascript
const stats = pool.getStats();
// Returns: { poolId, uptime, isRunning, stats, cost, queue }
```

##### saveState()

Persist pool state to disk.

```javascript
pool.saveState(); // Saves to .claude/agent-pool/pool-state.json
```

##### loadState()

Load previously saved pool state.

```javascript
const state = pool.loadState();
```

##### saveMetrics()

Persist metrics to disk.

```javascript
pool.saveMetrics(); // Saves to .claude/agent-pool/metrics.json
```

### GoalContext

Encapsulates a single goal's execution state.

#### Properties

- `id`: Unique goal identifier
- `goal`: Goal description string
- `priority`: Priority level (1-5)
- `state`: Current state (queued, active, completed, failed, suspended)
- `progress`: Progress percentage (0-100)
- `quota`: ResourceQuota instance
- `metrics`: Execution metrics (tokensUsed, tasksCompleted, tasksFailed, retries)
- `result`: Execution result (after completion)
- `error`: Execution error (if failed)
- `duration`: Elapsed time in milliseconds

### ResourceQuota

Manages per-goal resource limits.

#### Constructor

```javascript
new ResourceQuota(maxTokens, maxDuration, maxRetries)
```

**Parameters:**
- `maxTokens` (number): Maximum token budget
- `maxDuration` (number): Maximum duration in ms
- `maxRetries` (number): Maximum retry attempts

#### Methods

```javascript
quota.consumeTokens(count)      // Returns true if within budget
quota.consumeRetry()            // Returns true if retries available
quota.getRemainingTokens()      // Remaining token budget
quota.getRemainingDuration()    // Remaining time in ms
quota.getRemainingRetries()     // Remaining retry attempts
quota.isExhausted()             // True if any quota exhausted
quota.getUtilization()          // Returns { tokens, duration, retries }
```

### PriorityQueue

Priority-aware FIFO queue for goal scheduling.

#### Methods

```javascript
queue.enqueue(goalContext)      // Add goal (auto-sorted by priority)
queue.dequeue()                 // Remove and return highest priority
queue.peek()                    // View highest priority without removing
queue.remove(goalId)            // Remove specific goal
queue.isEmpty()                 // Check if empty
queue.getLength()               // Queue size
queue.toJSON()                  // Serialize to array
```

### CostTracker

Tracks token spending and budgets.

#### Constructor

```javascript
new CostTracker(globalBudget)
```

#### Methods

```javascript
tracker.recordCost(goalId, tokens, metadata)     // Log cost
tracker.getGoalCost(goalId)                      // Total spent by goal
tracker.getGlobalRemaining()                     // Remaining global budget
tracker.getGlobalUtilization()                   // Budget stats
tracker.isWithinBudget()                         // Check remaining
tracker.getTopCosts(limit)                       // Top N expensive goals
```

### WorkloadBalancer

Distributes concurrent load across agents.

#### Constructor

```javascript
new WorkloadBalancer(maxConcurrent)
```

#### Methods

```javascript
balancer.canAddGoal()                           // Can add another goal
balancer.addActiveGoal(goalContext)             // Activate goal
balancer.removeActiveGoal(goalId)               // Deactivate goal
balancer.getActiveGoals()                       // List active goals
balancer.getActiveCount()                       // Number active
balancer.getAvailableSlots()                    // Remaining slots
balancer.assignToAgent(goalId, agentId)         // Assign to agent
balancer.releaseFromAgent(agentId)              // Release from agent
balancer.getLeastBusyAgent(agentIds)            // Find least loaded
balancer.getLoadBalance()                       // Load balance metrics
```

## Events

The pool emits EventEmitter events for monitoring.

```javascript
pool.on('pool-started', ({ poolId, maxConcurrent }) => {});
pool.on('goal-submitted', ({ goalId, goal, priority, queueSize }) => {});
pool.on('goal-started', ({ goalId, goal, priority }) => {});
pool.on('goal-completed', ({ goalId, result, duration, metrics }) => {});
pool.on('goal-failed', ({ goalId, error, duration }) => {});
pool.on('goal-retry', ({ goalId, attempt, error, backoffMs }) => {});
pool.on('goal-suspended', ({ goalId }) => {});
pool.on('goal-resumed', ({ goalId }) => {});
pool.on('pool-completed', ({ stats }) => {});
pool.on('pool-force-stopped', ({ activeGoals }) => {});
pool.on('error', ({ message }) => {});
```

## Output Files

Pool state and metrics are saved to `.claude/agent-pool/`:

```
.claude/agent-pool/
├── pool-state.json      # Full pool state snapshot
├── metrics.json         # Metrics and analytics
└── execution.log        # Execution log (if enabled)
```

### Sample metrics.json

```json
{
  "poolId": "abc123def456",
  "isRunning": false,
  "stats": {
    "goalsProcessed": 8,
    "goalsSuccessful": 8,
    "goalsFailed": 0,
    "totalDuration": 3224
  },
  "queue": {
    "size": 0,
    "jobs": []
  },
  "active": {
    "count": 0,
    "availableSlots": 4,
    "goals": []
  },
  "cost": {
    "spent": 4800,
    "budget": 500000,
    "remaining": 495200,
    "percent": 1
  },
  "topCosts": [
    { "goalId": "goal_123", "cost": 900 },
    { "goalId": "goal_456", "cost": 750 }
  ]
}
```

## Priority Levels

```javascript
PRIORITIES.CRITICAL = 5   // System-critical tasks
PRIORITIES.HIGH = 4       // Important tasks
PRIORITIES.NORMAL = 3     // Standard tasks (default)
PRIORITIES.LOW = 2        // Background tasks
PRIORITIES.BACKGROUND = 1 // Very low priority
```

## Goal States

```javascript
GOAL_STATES.QUEUED = 'queued'           // Waiting to run
GOAL_STATES.ACTIVE = 'active'           // Currently executing
GOAL_STATES.COMPLETED = 'completed'     // Finished successfully
GOAL_STATES.FAILED = 'failed'           // Execution failed
GOAL_STATES.SUSPENDED = 'suspended'     // Paused by user
```

## Testing

Run the test suite:

```bash
node scripts/test-agent-pool.js
```

Tests cover:
- ResourceQuota token/retry/duration management
- PriorityQueue ordering and removal
- CostTracker budget enforcement
- WorkloadBalancer load distribution
- GoalContext state transitions
- AgentPool submission and persistence

## Architecture

### Concurrency Model

```
┌─────────────────────────────┐
│      AgentPool (main)       │
├─────────────────────────────┤
│  PriorityQueue (goals)      │
│  WorkloadBalancer (slots)   │
│  CostTracker (budget)       │
│  EventEmitter (monitoring)  │
└─────────────────────────────┘
        │       │       │
        ▼       ▼       ▼
    Goal#1   Goal#2   Goal#3  (up to maxConcurrent)
   ┌──────┐ ┌──────┐ ┌──────┐
   │State │ │State │ │State │
   │Quota │ │Quota │ │Quota │
   │Metric│ │Metric│ │Metric│
   └──────┘ └──────┘ └──────┘
```

### Execution Flow

1. **Submission**: Goal queued with priority
2. **Scheduling**: Queue polled for next executable goal
3. **Activation**: Goal moved to active set if slots available
4. **Execution**: Goal runs with resource quota enforcement
5. **Retry Loop**: Failed goals retry within budget
6. **Completion**: Goal marked complete/failed, slot released
7. **Metrics**: Cost tracked, state persisted

### Resource Isolation

Goals are isolated by:
- Token budgets (prevent runaway spend)
- Duration limits (timeout protection)
- Retry quotas (prevent infinite loops)
- Memory/CPU/file handle limits (configurable per goal)
- Separate execution contexts (no cross-contamination)

## Performance Characteristics

- **Memory**: O(N) where N = active goals + queue size
- **CPU**: Event-based polling at 100ms intervals
- **Latency**: <100ms for goal submission/retrieval
- **Throughput**: Limited by Claude API (typically 4-10 concurrent)
- **Cost**: Tracks to token level, auditable per goal

## Best Practices

1. **Set realistic quotas**: Token budgets should match goal complexity
2. **Use appropriate priorities**: Reserve CRITICAL for system tasks
3. **Monitor metrics**: Check pool metrics periodically
4. **Handle errors**: Implement error handlers for failed goals
5. **Save state**: Persist state for recovery on restart
6. **Tune concurrency**: Start at 4, increase if stable
7. **Review costs**: Use topCosts() to identify expensive goals

## Troubleshooting

### Goal stuck in ACTIVE state
- Check `goal.quota.getRemainingDuration()` for timeout
- Check `goal.quota.getRemainingTokens()` for budget exhaustion
- Review error logs in `.claude/agent-pool/execution.log`

### Over budget
- Reduce per-goal `maxTokens`
- Reduce `maxConcurrent` to fewer parallel goals
- Review topCosts() for expensive goals

### Unbalanced load
- Check `balancer.getLoadBalance()` variance
- Adjust `maxConcurrent` to better distribute
- Use priorities to reorder queue

### Retries not working
- Verify `goal.quota.getRemainingRetries() > 0`
- Check backoff timing in event logs
- Ensure underlying task logic supports retries

## Integration

### With dont-stop-engine.js

```javascript
const { AutonomousExecutor } = require('./dont-stop-engine.js');
const { AgentPool } = require('./dont-stop-agent-pool.js');

// Run single goal with engine
const executor = new AutonomousExecutor(goalString);
await executor.run();

// Run multiple goals with pool
const pool = new AgentPool({ maxConcurrent: 4 });
goals.forEach(g => pool.submitGoal(g));
await pool.start();
```

### With claudient-dont-stop.js

```javascript
const { DontStopEngine } = require('./claudient-dont-stop.js');
const { AgentPool } = require('./dont-stop-agent-pool.js');

// Sequential execution with engine
const engine = new DontStopEngine(goalString);
await engine.run();

// Parallel execution with pool
const pool = new AgentPool({ maxConcurrent: 8 });
goals.forEach(g => pool.submitGoal(g, { priority: PRIORITIES.NORMAL }));
await pool.start();
```

## License

Part of Claudient workflow orchestration system.
