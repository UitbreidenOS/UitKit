# Agent Orchestration System

Enterprise-grade orchestration for multi-agent systems with parallel execution, dependency management, and deadlock detection.

## Features

### Execution Modes

- **Parallel**: Execute all tasks concurrently with concurrency limits
- **Sequential**: Tasks execute one after another
- **Pipeline**: Multi-stage workflows with dependencies
- **DAG**: Directed Acyclic Graph with topological sorting and cycle detection
- **Fan-Out**: Scatter tasks from a single source
- **Fan-In**: Gather results from multiple tasks

### Core Capabilities

- **Agent Management**: Register agents with capacity, timeout, retry policies
- **Task Scheduling**: Submit tasks with priorities and dependencies
- **Dependency Resolution**: Automatic topological sorting and cycle detection
- **Message Passing**: Agent-to-agent communication with acknowledgments
- **Deadlock Detection**: Real-time detection using strongly connected components
- **Timeout Management**: Per-task and per-agent timeout enforcement
- **Load Balancing**: Distribute work across available capacity
- **Comprehensive Metrics**: Track task performance, resource usage, and errors

## Quick Start

### Basic Parallel Execution

```javascript
const { Orchestrator, EXECUTION_MODE } = require('./agent-orchestration.js');

const orchestrator = new Orchestrator({
  mode: EXECUTION_MODE.PARALLEL,
  maxConcurrent: 3,
});

// Register agents with executors
orchestrator.registerAgent('processor', async (task) => {
  console.log(`Processing ${task.id}`);
  return { result: 'success' };
});

// Submit tasks
orchestrator.submitTask('task-1', 'processor');
orchestrator.submitTask('task-2', 'processor');
orchestrator.submitTask('task-3', 'processor');

// Execute
await orchestrator.run();
```

### Sequential with Dependencies

```javascript
// Tasks with dependencies
orchestrator.submitTask('task-1', 'processor');
orchestrator.submitTask('task-2', 'processor', {
  dependencies: ['task-1'],
});
orchestrator.submitTask('task-3', 'processor', {
  dependencies: ['task-2'],
});

await orchestrator.run(EXECUTION_MODE.DAGSHED);
```

### Fan-Out Pattern

```javascript
// Single source creates multiple subtasks
const subtasks = await orchestrator.runFanOut('source-task', (result) => {
  // Dispersal function creates subtask IDs based on result
  return ['subtask-1', 'subtask-2', 'subtask-3'];
});
```

### Fan-In Pattern

```javascript
// Multiple tasks aggregate into one result
const aggregated = await orchestrator.runFanIn(
  ['task-1', 'task-2', 'task-3'],
  (results) => {
    // Aggregation function
    return results.reduce((sum, r) => sum + r.value, 0);
  }
);
```

## API Reference

### Orchestrator

#### Constructor

```javascript
new Orchestrator(opts = {})
```

Options:
- `mode`: EXECUTION_MODE enum (default: PARALLEL)
- `maxConcurrent`: Max concurrent tasks (default: 4)
- `globalTimeout`: Global timeout in ms (default: 300000)
- `deadlockDetectionInterval`: Check interval in ms (default: 5000)

#### Methods

**registerAgent(id, executor, opts)**
- Register an agent with an async executor function
- Options: capacity, timeout, maxRetries, retryDelay, priority

**submitTask(id, executor, opts)**
- Submit a task for execution
- Options: input, dependencies, timeout, maxRetries, priority

**run(mode)**
- Execute all tasks using specified mode
- Returns: Promise resolving to completion

**runParallel(taskIds)**
- Execute tasks in parallel

**runSequential(taskIds)**
- Execute tasks sequentially

**runDAG()**
- Execute tasks with full dependency resolution

**runFanOut(sourceTaskId, dispersalFn)**
- Fan-out execution pattern

**runFanIn(taskIds, aggregationFn)**
- Fan-in execution pattern

**getMetrics()**
- Get comprehensive metrics

**getTaskMetrics(taskId)**
- Get metrics for specific task

**getAgentMetrics(agentId)**
- Get metrics for specific agent

#### Events

- `task-submitted`: Task added to queue
- `task-started`: Task execution began
- `task-completed`: Task completed successfully
- `task-failed`: Task failed with error
- `stage-completed`: Pipeline stage completed
- `deadlock-detected`: Deadlock detected in dependency graph
- `deadlock-recovery`: Recovery action taken

### Agent

#### Constructor

```javascript
new Agent(id, executor, opts = {})
```

Options:
- `capacity`: Max concurrent tasks (default: 1)
- `timeout`: Per-task timeout in ms (default: 30000)
- `maxRetries`: Retry limit (default: 2)
- `retryDelay`: Initial retry delay in ms (default: 1000)
- `priority`: Agent priority level (default: PRIORITY.NORMAL)
- `dependencies`: Agent IDs this agent depends on

#### Methods

**execute(task, context)**
- Execute single task with retry logic
- Returns: Promise<result>

**getMetrics()**
- Get agent metrics

### Task

#### Constructor

```javascript
new Task(id, executor, opts = {})
```

Options:
- `input`: Task input data
- `dependencies`: Task IDs this task depends on
- `timeout`: Task timeout in ms (default: 30000)
- `maxRetries`: Retry limit (default: 1)
- `priority`: Task priority level

#### Methods

**getDuration()**
- Get execution duration in ms

**isReady(completedTasks)**
- Check if dependencies are satisfied

### MessageBroker

Inter-agent communication system.

#### Methods

**send(message)**
- Send message to agent inbox

**broadcast(sender, receivers, type, payload, opts)**
- Send message to multiple agents

**receive(agentId)**
- Get messages for agent

**acknowledgeMessage(messageId)**
- Mark message as acknowledged

**getPendingAcks()**
- Get unacknowledged message IDs

### DependencyGraph

Manages task dependencies and deadlock detection.

#### Methods

**addTask(task)**
- Add task to graph

**addDependency(taskId, dependencyId)**
- Add dependency relationship

**detectCycles()**
- Check for circular dependencies

**detectDeadlock(taskStates)**
- Check for deadlock patterns

**topologicalSort()**
- Get execution order

## Enums

### EXECUTION_MODE

```javascript
{
  PARALLEL: 'parallel',       // All tasks concurrently
  SEQUENTIAL: 'sequential',   // One after another
  PIPELINE: 'pipeline',       // Multi-stage with barriers
  FANOUT: 'fanout',          // Scatter pattern
  FANIN: 'fanin',            // Gather pattern
  DAGSHED: 'dagshed',        // Full DAG with dependencies
}
```

### AGENT_STATE

```javascript
{
  IDLE: 'idle',              // Ready to execute
  READY: 'ready',            // Prepared to start
  RUNNING: 'running',        // Currently executing
  BLOCKED: 'blocked',        // Waiting for capacity
  WAITING: 'waiting',        // Waiting for dependencies
  COMPLETED: 'completed',    // Finished successfully
  FAILED: 'failed',          // Failed with error
  TIMEOUT: 'timeout',        // Exceeded timeout
  DEADLOCK: 'deadlock',      // Detected deadlock
}
```

### MESSAGE_TYPE

```javascript
{
  TASK: 'task',              // Task assignment
  RESULT: 'result',          // Task result
  ERROR: 'error',            // Error message
  ACK: 'ack',                // Acknowledgment
  HEARTBEAT: 'heartbeat',    // Keep-alive
  STATE_QUERY: 'state_query',      // Request state
  STATE_UPDATE: 'state_update',    // Notify state change
}
```

### PRIORITY

```javascript
{
  CRITICAL: 4,               // Highest priority
  HIGH: 3,
  NORMAL: 2,                 // Default
  LOW: 1,
  BACKGROUND: 0,             // Lowest priority
}
```

## Patterns & Examples

### Pattern: Multi-Stage Pipeline

```javascript
const workflow = new Workflow('build-deploy');

workflow.addStage('Build', 'parallel')
  .addStage('Test', 'parallel')
  .addStage('Deploy', 'sequential')
  .addStage('Verify', 'sequential');

// Add tasks to stages
workflow.addTask('Build', 'build-task-1');
workflow.addTask('Build', 'build-task-2');
workflow.addTask('Test', 'test-task-1');
// ...

await workflow.execute(orchestrator);
```

### Pattern: Map-Reduce

```javascript
// Map phase: fan-out
const chunks = await orchestrator.runFanOut('split-data', (data) => {
  return data.chunks.map((_, i) => `map-${i}`);
});

// Reduce phase: fan-in
const result = await orchestrator.runFanIn(
  chunks.map((c) => c.id),
  (results) => {
    return results.reduce((acc, r) => ({ ...acc, ...r }), {});
  }
);
```

### Pattern: Error Recovery

```javascript
orchestrator.registerAgent('retry-handler', async (task) => {
  let attempt = 0;
  while (attempt < 3) {
    try {
      return await riskyOperation();
    } catch (error) {
      attempt++;
      if (attempt >= 3) throw error;
      await sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
    }
  }
});
```

### Pattern: Load Balancing

```javascript
// Register multiple agents with same executor
orchestrator.registerAgent('worker-1', executor, { capacity: 2 });
orchestrator.registerAgent('worker-2', executor, { capacity: 2 });
orchestrator.registerAgent('worker-3', executor, { capacity: 2 });

// Submit tasks (will be distributed)
for (let i = 0; i < 100; i++) {
  const workerId = `worker-${(i % 3) + 1}`;
  orchestrator.submitTask(`task-${i}`, workerId);
}
```

## Metrics

### Global Metrics

```javascript
const metrics = orchestrator.getMetrics();

{
  orchestratorId: string,
  mode: EXECUTION_MODE,
  isRunning: boolean,
  metrics: {
    tasksProcessed: number,
    tasksSuccessful: number,
    tasksFailed: number,
    totalDuration: ms,
    deadlocksDetected: number,
    timedOutTasks: number,
  },
  tasks: Task[],              // All task details
  agents: Agent[],            // All agent details
  messageBroker: {
    totalInbox: number,
    totalDeadLetters: number,
    pendingAcks: number,
    inboxByAgent: { [agentId]: count },
  },
  totalTasks: number,
  totalAgents: number,
  queueSize: number,
  activeAgents: number,
}
```

### Agent Metrics

```javascript
{
  state: AGENT_STATE,
  activeTasks: number,
  completedCount: number,
  failedCount: number,
  tasksProcessed: number,
  tasksSuccessful: number,
  tasksFailed: number,
  totalDuration: ms,
  totalRetries: number,
  deadlockDetections: number,
}
```

### Task Metrics

```javascript
{
  id: string,
  state: AGENT_STATE,
  priority: PRIORITY,
  timeout: ms,
  dependencies: string[],
  duration: ms,
  attempts: number,
  input: any,
  output: any,
  error: string | null,
}
```

## Deadlock Detection

The orchestrator uses **Tarjan's Strongly Connected Components algorithm** to detect deadlocks:

1. **Cycle Detection**: Identifies circular dependencies in task graph
2. **SCC Analysis**: Finds strongly connected components that indicate deadlock
3. **Auto-Recovery**: Times out oldest blocked task to break deadlock

Example:

```javascript
const orchestrator = new Orchestrator();

orchestrator.on('deadlock-detected', (event) => {
  console.log('Deadlock detected, attempting recovery...');
});

orchestrator.on('deadlock-recovery', (event) => {
  console.log(`Recovered by timing out task ${event.taskId}`);
});
```

## Performance Considerations

### Concurrency Limits

Set based on available resources:
- CPU-bound: `maxConcurrent = CPU_CORES`
- I/O-bound: `maxConcurrent = 2-4 * CPU_CORES`
- Memory-bound: `maxConcurrent = Available_RAM / Task_Memory`

### Timeout Tuning

```javascript
// Conservative (safe, but slower)
maxConcurrent: 4,
globalTimeout: 300000,  // 5 minutes

// Aggressive (fast, but may timeout)
maxConcurrent: 16,
globalTimeout: 60000,   // 1 minute
```

### Memory Usage

- Task queue: O(n) where n = total tasks
- Message broker: O(m) where m = total messages
- Metrics storage: O(n + m)

## Testing

Run comprehensive test suite:

```bash
node lib/agent-orchestration.test.js
```

Run integration examples:

```bash
# Data pipeline
node lib/agent-orchestration-integration-example.js 1

# Fan-out pattern
node lib/agent-orchestration-integration-example.js 2

# Fan-in pattern
node lib/agent-orchestration-integration-example.js 3

# Complex workflow
node lib/agent-orchestration-integration-example.js 4

# Error handling
node lib/agent-orchestration-integration-example.js 5

# Metrics monitoring
node lib/agent-orchestration-integration-example.js 6
```

## Architecture

```
┌─────────────────────────────────────────────┐
│         Orchestrator (Main)                 │
├─────────────────────────────────────────────┤
│  Task Queue │ Agents │ Metrics │ Scheduler │
└─────────────────────────────────────────────┘
         ↓              ↓              ↓
┌──────────────┐  ┌──────────┐  ┌──────────────┐
│ Dependency   │  │ Message  │  │ Deadlock     │
│ Graph (DAG)  │  │ Broker   │  │ Detector     │
│              │  │          │  │              │
│ • Cycles     │  │ • Send   │  │ • SCC        │
│ • Topo Sort  │  │ • Recv   │  │ • Auto-fix   │
│              │  │ • Acks   │  │              │
└──────────────┘  └──────────┘  └──────────────┘
```

## Changelog

### v1.0.0

- Initial release
- Core orchestration with 6 execution modes
- DAG with cycle detection
- Message broker with acknowledgments
- Deadlock detection using SCC
- Comprehensive metrics and monitoring
- Full test coverage
- Integration examples

## License

MIT
