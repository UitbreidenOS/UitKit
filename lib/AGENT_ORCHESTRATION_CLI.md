# Agent Orchestration System — CLI Usage Guide

## Overview

The Agent Orchestration System includes comprehensive test suites and integration examples that can be run from the command line.

## Running Tests

### Full Test Suite

```bash
node lib/agent-orchestration.test.js
```

**Output:**
```
╔════════════════════════════════════════════════════════╗
║     Agent Orchestration System — Test Suite            ║
╚════════════════════════════════════════════════════════╝

✓ MessageBroker: Send and receive messages
✓ MessageBroker: Message expiration
✓ MessageBroker: Broadcast messages
✓ MessageBroker: Acknowledgments
✓ Agent: Execute task successfully
✓ Agent: Handle timeout
✓ Agent: Retry on failure
✓ Agent: Capacity management
✓ Orchestrator: Parallel execution
✓ Orchestrator: Sequential execution
✓ Orchestrator: DAG execution with dependencies
✓ Orchestrator: Cycle detection in DAG
✓ Orchestrator: Fan-out pattern
✓ Orchestrator: Fan-in pattern
✓ DependencyGraph: Detect deadlock in cycle
✓ DependencyGraph: No deadlock in linear chain
✓ DependencyGraph: Topological sort
✓ Workflow: Multi-stage execution
✓ Orchestrator: Load balancing across agents
✓ Orchestrator: Metrics collection
✓ Agent: Metrics tracking

21 passed, 0 failed
```

### Test Categories

The test suite covers:
- **Message Broker Tests**: Send, receive, expiration, broadcast, acks
- **Agent Tests**: Execution, timeout, retry, capacity
- **Orchestrator Tests**: Parallel, sequential, DAG execution
- **Dependency Tests**: DAG, cycles, deadlock detection
- **Pattern Tests**: Fan-out, fan-in workflows
- **Metrics Tests**: Collection and tracking

## Running Integration Examples

### Example 1: Data Processing Pipeline

```bash
node lib/agent-orchestration-integration-example.js 1
```

**Description:** Multi-stage data pipeline with dependencies.

**Stages:**
1. Ingest (load data)
2. Validate (check data quality)
3. Transform (normalize)
4. Aggregate (compute statistics)

**Output:**
```
═══ Example 1: Data Processing Pipeline ═══

[INGEST] Loading database
[VALIDATE] Validating dataset ds-001
[TRANSFORM] Transforming data
[AGGREGATE] Computing aggregations

[✓] ingest-1 completed in 105ms
[✓] validate-1 completed in 156ms
[✓] transform-1 completed in 198ms
[✓] aggregate-1 completed in 125ms

Pipeline complete: 4 tasks, 0.58s
```

### Example 2: Parallel Processing (Fan-Out)

```bash
node lib/agent-orchestration-integration-example.js 2
```

**Description:** Scatter work across multiple regions (fan-out pattern).

**Process:**
1. Dispatch to 4 regions
2. Process each region in parallel
3. Collect results

**Output:**
```
═══ Example 2: Parallel Processing (Fan-Out) ═══

[DISPATCH] Fanning out to 4 regions
[PROCESS] Processing region: us-east
[PROCESS] Processing region: us-west
[PROCESS] Processing region: eu-west
[PROCESS] Processing region: ap-south
  └─ Region us-east ✓ (145ms)
  └─ Region us-west ✓ (162ms)
  └─ Region eu-west ✓ (138ms)
  └─ Region ap-south ✓ (171ms)

Fan-out complete: Processed 4 regions in parallel
  Total time: 0.18s
```

### Example 3: Aggregation (Fan-In)

```bash
node lib/agent-orchestration-integration-example.js 3
```

**Description:** Query multiple shards and aggregate results (fan-in pattern).

**Process:**
1. Query 3 shards in parallel
2. Aggregate results
3. Report statistics

**Output:**
```
═══ Example 3: Aggregation (Fan-In) ═══

[QUERY] Querying shard-1
[QUERY] Querying shard-2
[QUERY] Querying shard-3
[AGGREGATE] Merging shard results

[RESULT]
  Total records: 2547
  Total sum: 145230
  Average: 57.02

Fan-in complete: 3 shards aggregated in 0.25s
```

### Example 4: Complex Multi-Agent Workflow

```bash
node lib/agent-orchestration-integration-example.js 4
```

**Description:** Comprehensive workflow with parallel analysis → reporting → notification.

**Stages:**
1. Analysis (parallel):
   - Code quality analysis
   - Security scanning
   - Performance profiling
2. Reporting: Generate comprehensive report
3. Notification: Send to team

**Output:**
```
═══ Example 4: Complex Multi-Agent Workflow ═══

[CODE] Analyzing code quality
[SECURITY] Scanning for vulnerabilities
[PERF] Profiling performance
[REPORT] Generating comprehensive report
[NOTIFY] Sending notifications

Running workflow...

Workflow complete: 5 tasks executed
  Duration: 0.51s
```

### Example 5: Error Handling & Recovery

```bash
node lib/agent-orchestration-integration-example.js 5
```

**Description:** Demonstrates retry logic and error recovery.

**Behavior:**
1. First attempt fails
2. Automatic retry
3. Success on second attempt

**Output:**
```
═══ Example 5: Error Handling & Recovery ═══

[ATTEMPT 1] Processing primary-task
[ERROR] primary-task: Service temporarily unavailable
[ATTEMPT 2] Processing primary-task
[FALLBACK] Using fallback mechanism

Error recovery complete:
  Tasks processed: 2
  Tasks successful: 2
  Tasks failed: 0
```

### Example 6: Real-Time Metrics Monitoring

```bash
node lib/agent-orchestration-integration-example.js 6
```

**Description:** Live metrics dashboard during execution.

**Shows:**
- Progress bar
- Task completion percentage
- Execution time
- Top tasks by duration

**Output:**
```
═══ Example 6: Real-Time Metrics Monitoring ═══

[14:32:15] ████░░░░░░░░░░░░░░░░ 20% | Processed: 1/5 | Duration: 0.14s
[14:32:15] ██████░░░░░░░░░░░░░░░ 30% | Processed: 2/5 | Duration: 0.24s
[14:32:16] ████████████░░░░░░░░░░ 60% | Processed: 3/5 | Duration: 0.35s
[14:32:16] ████████████████████░░ 100% | Processed: 5/5 | Duration: 0.52s

═══ METRICS REPORT ═══
  Total tasks: 5
  Successful: 5
  Failed: 0
  Total duration: 0.52s

Top Tasks by Duration:
  1. heavy-task: 202ms
  2. medium-task-2: 121ms
  3. medium-task: 104ms
```

## Running All Examples

### Sequential Execution

```bash
for i in 1 2 3 4 5 6; do
  node lib/agent-orchestration-integration-example.js $i
done
```

### Parallel Execution (background jobs)

```bash
for i in 1 2 3 4 5 6; do
  node lib/agent-orchestration-integration-example.js $i &
done
wait
```

## Performance Benchmarks

### Sample Benchmark Script

```bash
#!/bin/bash

echo "Agent Orchestration Performance Benchmarks"
echo "=========================================="

# Benchmark 1: Parallel scaling
echo ""
echo "Benchmark 1: Parallel Execution Scaling"
time node -e "
const { Orchestrator } = require('./lib/agent-orchestration.js');
const orch = new Orchestrator({ maxConcurrent: 4 });

orch.registerAgent('worker', async () => new Promise(r => setTimeout(r, 50)));

for(let i=0; i<100; i++) {
  orch.submitTask(\`task-\${i}\`, 'worker');
}

orch.run().then(() => {
  const metrics = orch.getMetrics();
  console.log(\`Tasks: \${metrics.metrics.tasksSuccessful}\`);
  console.log(\`Duration: \${(metrics.metrics.totalDuration/1000).toFixed(2)}s\`);
});
"

# Benchmark 2: DAG with dependencies
echo ""
echo "Benchmark 2: DAG Execution"
time node -e "
const { Orchestrator, EXECUTION_MODE } = require('./lib/agent-orchestration.js');
const orch = new Orchestrator({ mode: EXECUTION_MODE.DAGSHED });

orch.registerAgent('worker', async () => new Promise(r => setTimeout(r, 30)));

let prev = 'task-0';
orch.submitTask(prev, 'worker');
for(let i=1; i<50; i++) {
  orch.submitTask(\`task-\${i}\`, 'worker', { dependencies: [prev] });
  prev = \`task-\${i}\`;
}

orch.run().then(() => {
  const metrics = orch.getMetrics();
  console.log(\`Tasks: \${metrics.metrics.tasksSuccessful}\`);
  console.log(\`Duration: \${(metrics.metrics.totalDuration/1000).toFixed(2)}s\`);
});
"
```

## Debugging

### Enable Verbose Logging

```javascript
const { Orchestrator } = require('./lib/agent-orchestration.js');

const orchestrator = new Orchestrator();

// Detailed event logging
orchestrator.on('task-submitted', (event) => {
  console.log(`[SUBMITTED] ${event.taskId}`);
});

orchestrator.on('task-started', (event) => {
  console.log(`[STARTED] ${event.taskId}`);
});

orchestrator.on('task-completed', (event) => {
  console.log(`[COMPLETED] ${event.taskId}`);
});

orchestrator.on('task-failed', (event) => {
  console.log(`[FAILED] ${event.taskId}: ${event.error}`);
});

orchestrator.on('deadlock-detected', (event) => {
  console.log(`[DEADLOCK DETECTED] at ${new Date(event.timestamp).toISOString()}`);
});
```

### Inspect Metrics

```javascript
const metrics = orchestrator.getMetrics();

// Summary
console.log('Total tasks:', metrics.totalTasks);
console.log('Success:', metrics.metrics.tasksSuccessful);
console.log('Failed:', metrics.metrics.tasksFailed);
console.log('Duration:', metrics.metrics.totalDuration + 'ms');

// Per-task details
metrics.tasks.forEach((task) => {
  console.log(`${task.id}: ${task.state} (${task.duration}ms)`);
});

// Per-agent details
metrics.agents.forEach((agent) => {
  console.log(`${agent.id}: ${agent.state} (${agent.completedCount} completed)`);
});

// Message broker
console.log('Inbox messages:', metrics.messageBroker.totalInbox);
console.log('Dead letters:', metrics.messageBroker.totalDeadLetters);
console.log('Pending acks:', metrics.messageBroker.pendingAcks);
```

### Trace Execution

```javascript
const tasks = orchestrator.getMetrics().tasks
  .sort((a, b) => a.createdAt - b.createdAt);

console.log('Execution Timeline:');
tasks.forEach((task) => {
  const indent = '  '.repeat(task.dependencies.length);
  console.log(`${indent}├─ ${task.id} (${task.duration}ms)`);
});
```

## Troubleshooting

### Issue: Deadlock Detected

**Symptoms:**
- Tasks stuck in "BLOCKED" or "WAITING" state
- "Deadlock detected" messages

**Solution:**
1. Check task dependencies for cycles
2. Verify no circular dependencies
3. Review agent capacity limits
4. Increase global timeout

```bash
# Check for cycles
node -e "
const { Orchestrator } = require('./lib/agent-orchestration.js');
const orch = new Orchestrator();

// Add tasks...

try {
  orch.run();
} catch (error) {
  if (error.message.includes('Circular')) {
    console.log('Circular dependency found!');
  }
}
"
```

### Issue: Tasks Timing Out

**Symptoms:**
- Tasks in "TIMEOUT" state
- "timeout after Xms" errors

**Solution:**
1. Increase per-task timeout
2. Check executor performance
3. Reduce concurrency to allow more time per task
4. Monitor system resources

```javascript
orchestrator.registerAgent('slow-worker', executor, {
  timeout: 60000,  // 60 seconds
  capacity: 1,     // Reduce concurrency
});
```

### Issue: High Memory Usage

**Symptoms:**
- Memory increasing over time
- Process heap errors

**Solution:**
1. Clear completed tasks periodically
2. Reduce metrics history
3. Enable message expiration
4. Batch process large task sets

```javascript
// Cleanup metrics
const metrics = orchestrator.getMetrics();
if (metrics.tasks.length > 1000) {
  // Archive or discard old metrics
}
```

## Performance Tuning

### For CPU-Bound Workloads

```javascript
const orchestrator = new Orchestrator({
  maxConcurrent: require('os').cpus().length,
  globalTimeout: 60000,
});
```

### For I/O-Bound Workloads

```javascript
const orchestrator = new Orchestrator({
  maxConcurrent: 16,  // 2-4x CPU count
  globalTimeout: 300000,
});
```

### For Memory-Constrained Environments

```javascript
const orchestrator = new Orchestrator({
  maxConcurrent: 2,
  globalTimeout: 60000,
});

// Periodically cleanup
setInterval(() => {
  const metrics = orchestrator.getMetrics();
  // Implement cleanup logic
}, 60000);
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Run orchestration tests
  run: |
    node lib/agent-orchestration.test.js
    echo "Tests passed!"

- name: Run integration examples
  run: |
    for i in 1 2 3 4 5 6; do
      node lib/agent-orchestration-integration-example.js $i
    done
```

### Jenkins Pipeline Example

```groovy
pipeline {
  stages {
    stage('Test') {
      steps {
        sh 'node lib/agent-orchestration.test.js'
      }
    }
    stage('Integration') {
      steps {
        sh 'node lib/agent-orchestration-integration-example.js 1'
        sh 'node lib/agent-orchestration-integration-example.js 2'
      }
    }
  }
}
```

## Next Steps

1. Review the [README](./AGENT_ORCHESTRATION_README.md) for API reference
2. Check the [Design Document](./AGENT_ORCHESTRATION_DESIGN.md) for architecture
3. Run tests and examples to understand the system
4. Integrate into your project using the API

## Getting Help

- Review error messages in the output
- Check the troubleshooting section above
- Inspect metrics for detailed diagnostics
- Add verbose event logging
- Run integration examples as reference implementations
