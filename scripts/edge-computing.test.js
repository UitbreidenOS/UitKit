#!/usr/bin/env node

/**
 * Edge Computing Tests
 * Comprehensive test suite for edge-computing.js
 */

const assert = require('assert');
const {
  EdgeNode,
  EdgeCoordinator,
  CloudflareWorkerProxy,
  LocalEdgeServer,
  LatencyTracker,
  NODE_ROLES,
  TASK_STATES,
} = require('./edge-computing.js');

const tests = [];
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Edge Computing Test Suite                                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`✗ ${name}: ${error.message}`);
      failedTests++;
    }
  }

  console.log(`\n${passedTests} passed, ${failedTests} failed\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

// ===== LatencyTracker Tests =====

test('LatencyTracker: records samples', () => {
  const tracker = new LatencyTracker();
  tracker.record(10);
  tracker.record(20);
  tracker.record(30);

  const stats = tracker.getStats();
  assert.strictEqual(stats.samples, 3);
  assert.strictEqual(stats.min, 10);
  assert.strictEqual(stats.max, 30);
});

test('LatencyTracker: calculates percentiles', () => {
  const tracker = new LatencyTracker();
  for (let i = 0; i <= 100; i++) {
    tracker.record(i);
  }

  const stats = tracker.getStats();
  assert(stats.p50 >= 45 && stats.p50 <= 55);
  assert(stats.p95 >= 90 && stats.p95 <= 100);
  assert(stats.p99 >= 98 && stats.p99 <= 101);
});

test('LatencyTracker: respects max samples', () => {
  const tracker = new LatencyTracker(10);
  for (let i = 0; i < 20; i++) {
    tracker.record(i);
  }

  const stats = tracker.getStats();
  assert.strictEqual(stats.samples, 10);
  assert.strictEqual(stats.min, 10); // First 10 discarded
});

// ===== EdgeNode Tests =====

test('EdgeNode: creates with correct defaults', () => {
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);
  assert.strictEqual(node.nodeId, 'test-node');
  assert.strictEqual(node.role, NODE_ROLES.WORKER);
  assert.strictEqual(node.taskQueue.length, 0);
  assert.strictEqual(node.isHealthy, true);
});

test('EdgeNode: submits tasks', () => {
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);
  const taskId = node.submitTask({ goal: 'Test goal' });

  assert(taskId);
  assert.strictEqual(node.taskQueue.length, 1);
  assert.strictEqual(node.taskQueue[0].state, TASK_STATES.PENDING);
});

test('EdgeNode: processes tasks successfully', async () => {
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);
  node.submitTask({ goal: 'Test goal' });

  const task = await node.processNextTask();

  assert.strictEqual(task.state, TASK_STATES.COMPLETED);
  assert(task.result);
  assert.strictEqual(node.metrics.tasksSuccessful, 1);
  assert.strictEqual(node.metrics.tasksExecuted, 1);
});

test('EdgeNode: tracks execution time', async () => {
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);
  node.submitTask({ goal: 'Test goal' });

  const task = await node.processNextTask();

  assert(task.executionTime > 0);
  assert.strictEqual(node.metrics.totalExecutionTime, task.executionTime);
});

test('EdgeNode: returns metrics', () => {
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER, {
    region: 'us-west'
  });

  const metrics = node.getMetrics();

  assert.strictEqual(metrics.nodeId, 'test-node');
  assert.strictEqual(metrics.region, 'us-west');
  assert.strictEqual(metrics.role, NODE_ROLES.WORKER);
  assert.strictEqual(metrics.isHealthy, true);
  assert(metrics.metrics);
  assert(metrics.latency);
  assert(metrics.queue);
});

test('EdgeNode: marks tasks as synced', async () => {
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);
  node.submitTask({ goal: 'Test' });
  const task = await node.processNextTask();

  assert.strictEqual(task.synced, false);

  await node.syncWithCloud('http://localhost:9999');

  assert.strictEqual(task.synced, true);
  assert.strictEqual(task.state, TASK_STATES.SYNCED);
});

test('EdgeNode: updates heartbeat', () => {
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);
  const before = node.lastHeartbeat;

  node.updateHeartbeat();
  const after = node.lastHeartbeat;

  assert(after >= before);
});

// ===== EdgeCoordinator Tests =====

test('EdgeCoordinator: creates with correct defaults', () => {
  const coordinator = new EdgeCoordinator();

  assert(coordinator.coordinatorId);
  assert.strictEqual(coordinator.nodes.size, 0);
  assert.strictEqual(coordinator.isRunning, false);
});

test('EdgeCoordinator: registers nodes', () => {
  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);

  coordinator.registerNode(node);

  assert.strictEqual(coordinator.nodes.size, 1);
  assert.strictEqual(coordinator.getNode('test-node'), node);
});

test('EdgeCoordinator: unregisters nodes', () => {
  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('test-node', NODE_ROLES.WORKER);

  coordinator.registerNode(node);
  assert.strictEqual(coordinator.nodes.size, 1);

  coordinator.unregisterNode('test-node');
  assert.strictEqual(coordinator.nodes.size, 0);
});

test('EdgeCoordinator: finds nearest node', () => {
  const coordinator = new EdgeCoordinator();
  const node1 = new EdgeNode('node1', NODE_ROLES.WORKER, { region: 'us-west' });
  const node2 = new EdgeNode('node2', NODE_ROLES.WORKER, { region: 'eu-west' });

  coordinator.registerNode(node1);
  coordinator.registerNode(node2);

  const nearest = coordinator.getNearestNode('us-west');
  assert.strictEqual(nearest.nodeId, 'node1');
});

test('EdgeCoordinator: routes to unhealthy node exclusion', () => {
  const coordinator = new EdgeCoordinator();
  const node1 = new EdgeNode('node1', NODE_ROLES.WORKER, { region: 'us-west' });
  const node2 = new EdgeNode('node2', NODE_ROLES.WORKER, { region: 'us-west' });

  coordinator.registerNode(node1);
  coordinator.registerNode(node2);

  node1.isHealthy = false;

  const nearest = coordinator.getNearestNode('us-west');
  assert.strictEqual(nearest.nodeId, 'node2');
});

test('EdgeCoordinator: returns no node when none healthy', () => {
  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('node1', NODE_ROLES.WORKER, { region: 'us-west' });

  coordinator.registerNode(node);
  node.isHealthy = false;

  const nearest = coordinator.getNearestNode('us-west');
  assert.strictEqual(nearest, null);
});

test('EdgeCoordinator: submits tasks', async () => {
  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('node1', NODE_ROLES.WORKER, { region: 'us-west' });

  coordinator.registerNode(node);

  const taskId = await coordinator.submitTask({ goal: 'Test' }, 'us-west');

  assert(taskId);
  assert.strictEqual(coordinator.globalMetrics.totalTasksSubmitted, 1);
  assert.strictEqual(node.taskQueue.length, 1);
});

test('EdgeCoordinator: throws error when no nodes available', async () => {
  const coordinator = new EdgeCoordinator();

  try {
    await coordinator.submitTask({ goal: 'Test' });
    assert.fail('Should have thrown error');
  } catch (error) {
    assert(error.message.includes('No healthy edge nodes available'));
  }
});

test('EdgeCoordinator: starts and stops', async () => {
  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('node1', NODE_ROLES.WORKER);

  coordinator.registerNode(node);

  assert.strictEqual(coordinator.isRunning, false);

  await coordinator.start();
  assert.strictEqual(coordinator.isRunning, true);

  await coordinator.stop();
  assert.strictEqual(coordinator.isRunning, false);
});

test('EdgeCoordinator: returns global metrics', async () => {
  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('node1', NODE_ROLES.WORKER);

  coordinator.registerNode(node);

  const metrics = coordinator.getGlobalMetrics();

  assert(metrics.coordinatorId);
  assert.strictEqual(metrics.nodes.length, 1);
  assert(metrics.globalMetrics);
  assert.strictEqual(metrics.globalMetrics.totalTasksSubmitted, 0);
});

test('EdgeCoordinator: saves metrics to disk', async () => {
  const fs = require('fs');
  const path = require('path');

  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('node1', NODE_ROLES.WORKER);

  coordinator.registerNode(node);

  const saved = coordinator.saveMetrics();
  assert.strictEqual(saved, true);

  // File should exist
  const metricsPath = path.join(process.cwd(), '.claude', 'edge-computing', 'metrics.json');
  assert(fs.existsSync(metricsPath));
});

test('EdgeCoordinator: saves state to disk', async () => {
  const fs = require('fs');
  const path = require('path');

  const coordinator = new EdgeCoordinator();
  const node = new EdgeNode('node1', NODE_ROLES.WORKER);

  coordinator.registerNode(node);

  const saved = coordinator.saveState();
  assert.strictEqual(saved, true);

  // File should exist
  const statePath = path.join(process.cwd(), '.claude', 'edge-computing', 'state.json');
  assert(fs.existsSync(statePath));
});

// ===== CloudflareWorkerProxy Tests =====

test('CloudflareWorkerProxy: generates worker script', () => {
  const proxy = new CloudflareWorkerProxy();
  const script = proxy.generateWorkerScript();

  assert(script);
  assert(script.includes('addEventListener'));
  assert(script.includes('handleRequest'));
  assert(script.includes('EDGE_NODES'));
  assert(script.includes('X-Edge-Latency'));
});

test('CloudflareWorkerProxy: generates wrangler config', () => {
  const proxy = new CloudflareWorkerProxy({
    accountId: 'test-account',
    zoneId: 'test-zone'
  });
  const config = proxy.generateWranglerConfig();

  assert(config);
  assert(config.includes('claudient-edge'));
  assert(config.includes('test-account'));
  assert(config.includes('test-zone'));
  assert(config.includes('[env.production]'));
});

// ===== Integration Tests =====

test('Integration: end-to-end task execution', async () => {
  const coordinator = new EdgeCoordinator();

  // Create 2 nodes
  const node1 = new EdgeNode('node1', NODE_ROLES.WORKER, { region: 'us-west' });
  const node2 = new EdgeNode('node2', NODE_ROLES.WORKER, { region: 'eu-west' });

  coordinator.registerNode(node1);
  coordinator.registerNode(node2);

  await coordinator.start();

  // Submit tasks
  const taskId1 = await coordinator.submitTask({ goal: 'Task 1' }, 'us-west');
  const taskId2 = await coordinator.submitTask({ goal: 'Task 2' }, 'eu-west');

  assert.strictEqual(coordinator.globalMetrics.totalTasksSubmitted, 2);

  // Process tasks
  let completed = 0;
  const interval = setInterval(async () => {
    let task1 = await node1.processNextTask();
    let task2 = await node2.processNextTask();

    if (task1 && task1.state === TASK_STATES.COMPLETED) completed++;
    if (task2 && task2.state === TASK_STATES.COMPLETED) completed++;
  }, 50);

  while (completed < 2) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  clearInterval(interval);

  // Verify execution
  assert.strictEqual(node1.metrics.tasksExecuted + node2.metrics.tasksExecuted, 2);

  await coordinator.stop();
});

test('Integration: multi-region latency tracking', async () => {
  const coordinator = new EdgeCoordinator();

  // Create nodes in different regions
  const regions = ['us-west', 'eu-west', 'ap-southeast'];
  const nodes = regions.map((region, idx) =>
    new EdgeNode(`node-${idx}`, NODE_ROLES.WORKER, { region })
  );

  nodes.forEach(node => coordinator.registerNode(node));
  await coordinator.start();

  // Process multiple tasks to build latency statistics
  for (let i = 0; i < 5; i++) {
    for (const node of nodes) {
      node.submitTask({ goal: `Task ${i}` });
      await node.processNextTask();
    }
  }

  // Verify latency tracking
  const metrics = coordinator.getGlobalMetrics();
  const avgLatency = metrics.globalMetrics.averageLatency;

  assert(avgLatency >= 0);
  assert(avgLatency < 1000); // Reasonable latency range

  metrics.nodes.forEach(nodeMetrics => {
    assert(nodeMetrics.latency.p50 >= 0);
    assert(nodeMetrics.latency.p95 >= nodeMetrics.latency.p50);
    assert(nodeMetrics.latency.p99 >= nodeMetrics.latency.p95);
  });

  await coordinator.stop();
});

test('Integration: cloud sync flow', async () => {
  const coordinator = new EdgeCoordinator({
    cloudUrl: 'http://localhost:9999/sync',
    syncInterval: 1000,
  });

  const node = new EdgeNode('node1', NODE_ROLES.WORKER);
  coordinator.registerNode(node);
  await coordinator.start();

  // Submit and process tasks
  node.submitTask({ goal: 'Task 1' });
  node.submitTask({ goal: 'Task 2' });

  await node.processNextTask();
  await node.processNextTask();

  // Verify tasks not synced initially
  let unsyncedTasks = node.completedTasks.filter(t => !t.synced);
  assert.strictEqual(unsyncedTasks.length, 2);

  // Sync
  await node.syncWithCloud(coordinator.cloudUrl);

  // Verify tasks now synced
  unsyncedTasks = node.completedTasks.filter(t => !t.synced);
  assert.strictEqual(unsyncedTasks.length, 0);

  // All should be SYNCED
  node.completedTasks.forEach(t => {
    assert.strictEqual(t.state, TASK_STATES.SYNCED);
  });

  await coordinator.stop();
});

// Run all tests
runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
