#!/usr/bin/env node

/**
 * Agent Orchestration System — Test Suite
 *
 * Tests covering:
 * - Parallel & sequential execution
 * - Fan-out/fan-in patterns
 * - DAG execution with dependency resolution
 * - Deadlock detection & prevention
 * - Timeout management
 * - Message passing protocol
 * - Load balancing
 */

const {
  Orchestrator,
  Agent,
  Task,
  Message,
  MessageBroker,
  DependencyGraph,
  Workflow,
  EXECUTION_MODE,
  AGENT_STATE,
  MESSAGE_TYPE,
  PRIORITY,
} = require('./agent-orchestration.js');

// ============================================================================
// Test Helpers
// ============================================================================

const assert = (condition, message) => {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
};

const assertEquals = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Test Suite
// ============================================================================

class TestSuite {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     Agent Orchestration System — Test Suite            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✓ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`✗ ${test.name}`);
        console.log(`  Error: ${error.message}`);
      }
    }

    console.log(`\n${this.passed} passed, ${this.failed} failed\n`);
    return this.failed === 0;
  }
}

const suite = new TestSuite();

// ============================================================================
// Message Broker Tests
// ============================================================================

suite.test('MessageBroker: Send and receive messages', async () => {
  const broker = new MessageBroker();
  const message = new Message(MESSAGE_TYPE.TASK, 'agent1', 'agent2', { data: 'test' });

  broker.send(message);

  const inbox = broker.receive('agent2');
  assert(inbox.length === 1, 'Message should be in inbox');
  assertEquals(inbox[0].sender, 'agent1', 'Sender should match');
  assertEquals(inbox[0].payload.data, 'test', 'Payload should match');
});

suite.test('MessageBroker: Message expiration', async () => {
  const broker = new MessageBroker();
  const message = new Message(MESSAGE_TYPE.TASK, 'agent1', 'agent2', { data: 'test' }, {
    ttl: 1,
  });

  await sleep(10);

  const result = broker.send(message);
  assert(!result, 'Expired message should not be sent');
  assert(broker.deadLetters.length === 1, 'Expired message should go to dead letters');
});

suite.test('MessageBroker: Broadcast messages', async () => {
  const broker = new MessageBroker();
  const receivers = ['agent2', 'agent3', 'agent4'];

  broker.broadcast('agent1', receivers, MESSAGE_TYPE.STATE_UPDATE, { state: 'ready' });

  for (const receiver of receivers) {
    const inbox = broker.receive(receiver);
    assert(inbox.length === 1, `${receiver} should have message`);
  }
});

suite.test('MessageBroker: Acknowledgments', async () => {
  const broker = new MessageBroker();
  const message = new Message(MESSAGE_TYPE.TASK, 'agent1', 'agent2', { data: 'test' }, {
    requiresAck: true,
  });

  broker.send(message);
  let pending = broker.getPendingAcks();
  assert(pending.length === 1, 'Should have pending ack');

  broker.acknowledgeMessage(message.id);
  pending = broker.getPendingAcks();
  assert(pending.length === 0, 'Should have no pending acks');
});

// ============================================================================
// Agent Tests
// ============================================================================

suite.test('Agent: Execute task successfully', async () => {
  const agent = new Agent('agent1', async (task) => {
    await sleep(10);
    return { result: 'success' };
  });

  const task = new Task('task1', 'agent1', { input: { x: 1 } });
  const result = await agent.execute(task);

  assertEquals(agent.state, AGENT_STATE.COMPLETED, 'Agent state should be completed');
  assertEquals(agent.metrics.tasksSuccessful, 1, 'Metrics should count success');
  assertEquals(result.result, 'success', 'Result should match');
});

suite.test('Agent: Handle timeout', async () => {
  const agent = new Agent('agent1', async (task) => {
    await sleep(100);
    return { result: 'success' };
  }, { timeout: 50 });

  const task = new Task('task1', 'agent1');
  const result = await agent.execute(task);

  assert(result.error, 'Should have error');
  assert(result.error.includes('timeout'), 'Error should mention timeout');
});

suite.test('Agent: Retry on failure', async () => {
  let attempts = 0;
  const agent = new Agent('agent1', async (task) => {
    attempts++;
    if (attempts < 2) throw new Error('Simulated failure');
    return { result: 'success' };
  }, { maxRetries: 2, retryDelay: 10 });

  const task = new Task('task1', 'agent1');
  const result = await agent.execute(task);

  assertEquals(attempts, 2, 'Should retry once');
  assertEquals(agent.metrics.totalRetries, 1, 'Metrics should count retry');
});

suite.test('Agent: Capacity management', async () => {
  const agent = new Agent('agent1', async (task) => {
    await sleep(50);
    return { result: 'success' };
  }, { capacity: 1 });

  const task1 = new Task('task1', 'agent1');
  const task2 = new Task('task2', 'agent1');

  // Execute both without awaiting
  agent.execute(task1);
  const result = await agent.execute(task2);

  assert(result.error, 'Second task should be rejected');
  assert(result.error.includes('capacity'), 'Error should mention capacity');
});

// ============================================================================
// Orchestrator: Execution Mode Tests
// ============================================================================

suite.test('Orchestrator: Parallel execution', async () => {
  const orchestrator = new Orchestrator({ mode: EXECUTION_MODE.PARALLEL });
  const timestamps = [];

  orchestrator.registerAgent('agent1', async () => {
    timestamps.push({ task: 'task1', time: Date.now() });
    await sleep(50);
  });

  orchestrator.submitTask('task1', 'agent1');
  orchestrator.submitTask('task2', 'agent1');
  orchestrator.submitTask('task3', 'agent1');

  await orchestrator.run(EXECUTION_MODE.PARALLEL);

  const metrics = orchestrator.getMetrics();
  assertEquals(metrics.metrics.tasksSuccessful, 3, 'All tasks should complete');
});

suite.test('Orchestrator: Sequential execution', async () => {
  const orchestrator = new Orchestrator({ mode: EXECUTION_MODE.SEQUENTIAL });
  const execOrder = [];

  orchestrator.registerAgent('agent1', async (task) => {
    execOrder.push(task.id);
    await sleep(20);
  });

  orchestrator.submitTask('task1', 'agent1');
  orchestrator.submitTask('task2', 'agent1');
  orchestrator.submitTask('task3', 'agent1');

  await orchestrator.run(EXECUTION_MODE.SEQUENTIAL);

  assertEquals(execOrder[0], 'task1', 'Tasks should execute in order');
  assertEquals(execOrder[1], 'task2', 'Tasks should execute in order');
  assertEquals(execOrder[2], 'task3', 'Tasks should execute in order');
});

// ============================================================================
// Orchestrator: Dependency Tests
// ============================================================================

suite.test('Orchestrator: DAG execution with dependencies', async () => {
  const orchestrator = new Orchestrator();
  const execOrder = [];

  orchestrator.registerAgent('agent1', async (task) => {
    execOrder.push(task.id);
    return { result: `${task.id}-complete` };
  });

  orchestrator.submitTask('task1', 'agent1');
  orchestrator.submitTask('task2', 'agent1', { dependencies: ['task1'] });
  orchestrator.submitTask('task3', 'agent1', { dependencies: ['task1', 'task2'] });

  await orchestrator.run(EXECUTION_MODE.DAGSHED);

  // task1 should run first
  assertEquals(execOrder[0], 'task1', 'task1 should run first');
  // task2 and task3 should run after their dependencies
  assert(execOrder.indexOf('task2') > execOrder.indexOf('task1'), 'task2 after task1');
  assert(execOrder.indexOf('task3') > execOrder.indexOf('task2'), 'task3 after task2');
});

suite.test('Orchestrator: Cycle detection in DAG', async () => {
  const orchestrator = new Orchestrator();

  orchestrator.registerAgent('agent1', async () => {});

  orchestrator.submitTask('task1', 'agent1', { dependencies: ['task3'] });
  orchestrator.submitTask('task2', 'agent1', { dependencies: ['task1'] });
  orchestrator.submitTask('task3', 'agent1', { dependencies: ['task2'] });

  let cycleDetected = false;
  try {
    await orchestrator.run(EXECUTION_MODE.DAGSHED);
  } catch (error) {
    if (error.message.includes('Circular dependency')) {
      cycleDetected = true;
    }
  }

  assert(cycleDetected, 'Circular dependency should be detected');
});

// ============================================================================
// Fan-Out/Fan-In Tests
// ============================================================================

suite.test('Orchestrator: Fan-out pattern', async () => {
  const orchestrator = new Orchestrator();
  const results = [];

  orchestrator.registerAgent('agent1', async (task) => {
    results.push(task.id);
    return { processed: task.id };
  });

  // Source task
  orchestrator.submitTask('source', 'agent1');

  // Subtasks
  for (let i = 1; i <= 3; i++) {
    orchestrator.submitTask(`subtask-${i}`, 'agent1');
  }

  const subtasks = await orchestrator.runFanOut('source', () => [
    'subtask-1',
    'subtask-2',
    'subtask-3',
  ]);

  assertEquals(subtasks.length, 3, 'Should have 3 subtasks');
  assertEquals(results[0], 'source', 'Source should execute first');
});

suite.test('Orchestrator: Fan-in pattern', async () => {
  const orchestrator = new Orchestrator();

  orchestrator.registerAgent('agent1', async (task) => {
    return { value: parseInt(task.id.split('-')[1]) * 2 };
  });

  orchestrator.submitTask('task-1', 'agent1');
  orchestrator.submitTask('task-2', 'agent1');
  orchestrator.submitTask('task-3', 'agent1');

  const aggregated = await orchestrator.runFanIn(['task-1', 'task-2', 'task-3'], (results) => {
    return results.reduce((sum, r) => sum + r.value, 0);
  });

  assertEquals(aggregated, 12, 'Aggregation should sum values (2+4+6)');
});

// ============================================================================
// Deadlock Detection Tests
// ============================================================================

suite.test('DependencyGraph: Detect deadlock in cycle', async () => {
  const graph = new DependencyGraph();

  const task1 = new Task('task1', 'agent1', { dependencies: ['task3'] });
  const task2 = new Task('task2', 'agent1', { dependencies: ['task1'] });
  const task3 = new Task('task3', 'agent1', { dependencies: ['task2'] });

  graph.addTask(task1);
  graph.addTask(task2);
  graph.addTask(task3);

  const hasCycle = graph.detectCycles();
  assert(hasCycle, 'Should detect cycle');
});

suite.test('DependencyGraph: No deadlock in linear chain', async () => {
  const graph = new DependencyGraph();

  const task1 = new Task('task1', 'agent1', { dependencies: [] });
  const task2 = new Task('task2', 'agent1', { dependencies: ['task1'] });
  const task3 = new Task('task3', 'agent1', { dependencies: ['task2'] });

  graph.addTask(task1);
  graph.addTask(task2);
  graph.addTask(task3);

  const hasCycle = graph.detectCycles();
  assert(!hasCycle, 'Should not detect cycle in linear chain');
});

suite.test('DependencyGraph: Topological sort', async () => {
  const graph = new DependencyGraph();

  const task1 = new Task('task1', 'agent1', { dependencies: [] });
  const task2 = new Task('task2', 'agent1', { dependencies: ['task1'] });
  const task3 = new Task('task3', 'agent1', { dependencies: ['task2'] });

  graph.addTask(task1);
  graph.addTask(task2);
  graph.addTask(task3);

  const sorted = graph.topologicalSort();

  assertEquals(sorted[0], 'task1', 'task1 should be first');
  assert(sorted.indexOf('task2') > sorted.indexOf('task1'), 'task2 after task1');
  assert(sorted.indexOf('task3') > sorted.indexOf('task2'), 'task3 after task2');
});

// ============================================================================
// Workflow Tests
// ============================================================================

suite.test('Workflow: Multi-stage execution', async () => {
  const orchestrator = new Orchestrator();
  const stageOrder = [];

  orchestrator.registerAgent('agent1', async (task) => {
    const stage = task.id.split('-')[0];
    stageOrder.push(stage);
    await sleep(10);
  });

  // Setup workflow
  orchestrator.submitTask('stage1-task1', 'agent1');
  orchestrator.submitTask('stage1-task2', 'agent1');
  orchestrator.submitTask('stage2-task1', 'agent1');
  orchestrator.submitTask('stage2-task2', 'agent1');
  orchestrator.submitTask('stage3-task1', 'agent1');

  const workflow = new Workflow('test-flow');
  workflow.addStage('Build', 'parallel');
  workflow.addTask('Build', 'stage1-task1');
  workflow.addTask('Build', 'stage1-task2');
  workflow.addStage('Test', 'parallel');
  workflow.addTask('Test', 'stage2-task1');
  workflow.addTask('Test', 'stage2-task2');
  workflow.addStage('Deploy', 'sequential');
  workflow.addTask('Deploy', 'stage3-task1');

  const result = await workflow.execute(orchestrator);

  assert(result.metrics.tasksSuccessful >= 5, 'All tasks should execute');
});

// ============================================================================
// Load Balancing Tests
// ============================================================================

suite.test('Orchestrator: Load balancing across agents', async () => {
  const orchestrator = new Orchestrator({ maxConcurrent: 2 });
  const agentLoad = { 'agent1': 0, 'agent2': 0 };

  orchestrator.registerAgent('agent1', async () => {
    agentLoad['agent1']++;
    await sleep(30);
  }, { capacity: 2 });

  orchestrator.registerAgent('agent2', async () => {
    agentLoad['agent2']++;
    await sleep(30);
  }, { capacity: 2 });

  for (let i = 0; i < 4; i++) {
    orchestrator.submitTask(`task-${i}`, i % 2 === 0 ? 'agent1' : 'agent2');
  }

  await orchestrator.run();

  assertEquals(agentLoad['agent1'], 2, 'agent1 should handle 2 tasks');
  assertEquals(agentLoad['agent2'], 2, 'agent2 should handle 2 tasks');
});

// ============================================================================
// Metrics Tests
// ============================================================================

suite.test('Orchestrator: Metrics collection', async () => {
  const orchestrator = new Orchestrator();

  orchestrator.registerAgent('agent1', async () => {
    await sleep(20);
    return { result: 'ok' };
  });

  orchestrator.submitTask('task1', 'agent1');
  orchestrator.submitTask('task2', 'agent1');

  await orchestrator.run();

  const metrics = orchestrator.getMetrics();

  assertEquals(metrics.metrics.tasksProcessed, 2, 'Should process 2 tasks');
  assertEquals(metrics.metrics.tasksSuccessful, 2, 'Should complete 2 tasks');
  assertEquals(metrics.totalTasks, 2, 'Should have 2 tasks');
  assert(metrics.metrics.totalDuration > 0, 'Should have duration');
});

suite.test('Agent: Metrics tracking', async () => {
  const agent = new Agent('agent1', async () => {
    await sleep(10);
    return { result: 'ok' };
  });

  const task1 = new Task('task1', 'agent1');
  await agent.execute(task1);

  const metrics = agent.getMetrics();

  assertEquals(metrics.tasksProcessed, 1, 'Should process 1 task');
  assertEquals(metrics.tasksSuccessful, 1, 'Should complete 1 task');
  assert(metrics.totalDuration > 0, 'Should have duration');
});

// ============================================================================
// Run Tests
// ============================================================================

(async () => {
  const success = await suite.run();
  process.exit(success ? 0 : 1);
})();
