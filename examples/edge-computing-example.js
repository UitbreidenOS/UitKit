#!/usr/bin/env node

/**
 * Edge Computing Integration Examples
 * Demonstrates real-world usage patterns with dont-stop and edge nodes
 */

const {
  EdgeNode,
  EdgeCoordinator,
  CloudflareWorkerProxy,
  LocalEdgeServer,
  NODE_ROLES,
  TASK_STATES,
} = require('../scripts/edge-computing.js');

// Example 1: Basic Task Routing
async function example1_basicTaskRouting() {
  console.log('\n=== Example 1: Basic Task Routing ===\n');

  const coordinator = new EdgeCoordinator({
    cloudUrl: 'https://api.claudient.local/sync',
  });

  // Create edge nodes in different regions
  const nodes = ['us-west', 'eu-west', 'ap-southeast'].map((region, idx) =>
    new EdgeNode(`edge-${idx}`, NODE_ROLES.WORKER, { region })
  );

  nodes.forEach(node => coordinator.registerNode(node));
  await coordinator.start();

  // Submit tasks to specific regions
  const tasks = [
    { goal: 'Process video', region: 'us-west' },
    { goal: 'Analyze data', region: 'eu-west' },
    { goal: 'Sync state', region: 'ap-southeast' },
  ];

  for (const task of tasks) {
    const taskId = await coordinator.submitTask(task, task.region);
    console.log(`Submitted task ${taskId} to ${task.region}`);
  }

  // Process tasks locally
  const processingInterval = setInterval(async () => {
    for (const node of nodes) {
      const task = await node.processNextTask();
      if (task && task.state === TASK_STATES.COMPLETED) {
        console.log(`Node ${node.nodeId}: ${task.result.output}`);
      }
    }
  }, 100);

  await new Promise(resolve => setTimeout(resolve, 3000));
  clearInterval(processingInterval);
  await coordinator.stop();

  const metrics = coordinator.getGlobalMetrics();
  console.log(`\nCompleted: ${metrics.globalMetrics.totalTasksCompleted} tasks`);
}

// Example 2: High Frequency Task Submission
async function example2_highFrequencyTasks() {
  console.log('\n=== Example 2: High Frequency Task Submission ===\n');

  const coordinator = new EdgeCoordinator({
    syncInterval: 1000, // Fast sync for high frequency
  });

  // Single node for this example
  const node = new EdgeNode('edge-fast', NODE_ROLES.WORKER, { region: 'us-west' });
  coordinator.registerNode(node);
  await coordinator.start();

  // Submit 100 rapid tasks
  console.log('Submitting 100 rapid tasks...');
  const submitStart = Date.now();

  for (let i = 0; i < 100; i++) {
    await coordinator.submitTask({
      goal: `Task ${i}`,
      data: { index: i },
    });
  }

  const submitTime = Date.now() - submitStart;
  console.log(`Submitted 100 tasks in ${submitTime}ms`);

  // Process tasks
  const processStart = Date.now();
  let completed = 0;

  const processingInterval = setInterval(async () => {
    const task = await node.processNextTask();
    if (task && task.state === TASK_STATES.COMPLETED) {
      completed++;
    }
  }, 10);

  while (completed < 100) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  clearInterval(processingInterval);
  const processTime = Date.now() - processStart;

  console.log(`Processed 100 tasks in ${processTime}ms`);
  console.log(`Average: ${(processTime / 100).toFixed(2)}ms per task`);

  const metrics = coordinator.getGlobalMetrics();
  console.log(`Throughput: ${(100000 / processTime).toFixed(2)} tasks/sec`);

  await coordinator.stop();
}

// Example 3: Latency Sensitive Application
async function example3_latencySensitiveApp() {
  console.log('\n=== Example 3: Latency Sensitive Application ===\n');

  const coordinator = new EdgeCoordinator();

  // Create regional edge nodes
  const regions = ['us-west', 'us-east', 'eu-west', 'ap-northeast', 'ap-southeast'];
  const nodes = regions.map((region, idx) =>
    new EdgeNode(`edge-${idx}`, NODE_ROLES.WORKER, { region })
  );

  nodes.forEach(node => coordinator.registerNode(node));
  await coordinator.start();

  // Simulate user requests from different regions
  const userRequests = [
    { userId: 'user-sf', region: 'us-west', goal: 'Render page' },
    { userId: 'user-ny', region: 'us-east', goal: 'Fetch data' },
    { userId: 'user-london', region: 'eu-west', goal: 'Process request' },
    { userId: 'user-tokyo', region: 'ap-northeast', goal: 'Cache content' },
  ];

  console.log('Routing user requests to nearest edge node...\n');

  for (const request of userRequests) {
    const taskId = await coordinator.submitTask(request, request.region);
    console.log(`User ${request.userId}: routed to nearest edge (${request.region})`);
  }

  // Process with latency tracking
  const startTime = Date.now();
  let completed = 0;

  const processingInterval = setInterval(async () => {
    for (const node of nodes) {
      const task = await node.processNextTask();
      if (task && task.state === TASK_STATES.COMPLETED) {
        completed++;
        const taskLatency = task.executionTime;
        console.log(`${task.goal}: ${taskLatency.toFixed(2)}ms`);
      }
    }
  }, 50);

  while (completed < userRequests.length) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  clearInterval(processingInterval);
  const totalTime = Date.now() - startTime;

  console.log(`\nTotal time: ${totalTime}ms`);

  // Show latency stats per node
  const metrics = coordinator.getGlobalMetrics();
  console.log('\nLatency Statistics:');
  metrics.nodes.forEach(nodeMetrics => {
    const lat = nodeMetrics.latency;
    console.log(`${nodeMetrics.nodeId} (${nodeMetrics.region}): p95=${lat.p95}ms`);
  });

  await coordinator.stop();
}

// Example 4: Cloud Sync Pattern
async function example4_cloudSync() {
  console.log('\n=== Example 4: Cloud Sync Pattern ===\n');

  const coordinator = new EdgeCoordinator({
    cloudUrl: 'https://api.claudient.local/sync',
    syncInterval: 2000,
  });

  const node = new EdgeNode('edge-sync', NODE_ROLES.WORKER, { region: 'us-west' });

  node.on('cloud-sync', (event) => {
    console.log(`Cloud sync: ${event.tasksSynced} tasks, ${event.duration}ms, compressed: ${event.compressedSize}B`);
  });

  coordinator.registerNode(node);
  await coordinator.start();

  // Submit tasks
  console.log('Submitting tasks...');
  for (let i = 0; i < 10; i++) {
    await coordinator.submitTask({
      goal: `Sync task ${i}`,
      data: { value: Math.random() },
    });
  }

  // Process and sync
  const interval = setInterval(async () => {
    const task = await node.processNextTask();
    if (task && task.state === TASK_STATES.COMPLETED) {
      console.log(`Processed: ${task.goal}`);
    }

    // Sync periodically
    if (node.completedTasks.some(t => !t.synced)) {
      await node.syncWithCloud(coordinator.cloudUrl);
    }
  }, 100);

  await new Promise(resolve => setTimeout(resolve, 5000));
  clearInterval(interval);

  // Final sync
  await node.syncWithCloud(coordinator.cloudUrl);

  console.log(`\nTotal tasks synced: ${node.completedTasks.filter(t => t.synced).length}`);

  await coordinator.stop();
}

// Example 5: Multi-Region Failover
async function example5_multiRegionFailover() {
  console.log('\n=== Example 5: Multi-Region Failover ===\n');

  const coordinator = new EdgeCoordinator();

  // Create nodes
  const node1 = new EdgeNode('edge-primary', NODE_ROLES.WORKER, { region: 'us-west' });
  const node2 = new EdgeNode('edge-secondary', NODE_ROLES.WORKER, { region: 'us-east' });

  coordinator.registerNode(node1);
  coordinator.registerNode(node2);
  await coordinator.start();

  console.log('Initial setup: 2 healthy nodes\n');

  // Submit tasks
  for (let i = 0; i < 5; i++) {
    await coordinator.submitTask({ goal: `Task ${i}` });
  }

  // Process initially
  const interval1 = setInterval(async () => {
    await node1.processNextTask();
    await node2.processNextTask();
    node1.updateHeartbeat();
    node2.updateHeartbeat();
  }, 100);

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate primary failure
  console.log('\nSimulating primary node failure...');
  node1.isHealthy = false;

  // New tasks should route to secondary
  console.log('Submitting new tasks (should route to secondary)...\n');
  for (let i = 5; i < 10; i++) {
    await coordinator.submitTask({ goal: `Task ${i}` });
  }

  clearInterval(interval1);

  // Process with only secondary
  const interval2 = setInterval(async () => {
    await node2.processNextTask();
    node2.updateHeartbeat();
  }, 100);

  await new Promise(resolve => setTimeout(resolve, 1000));
  clearInterval(interval2);

  // Show metrics
  const metrics = coordinator.getGlobalMetrics();
  console.log('\nFinal Metrics:');
  metrics.nodes.forEach(nodeMetrics => {
    console.log(`${nodeMetrics.nodeId}: healthy=${nodeMetrics.isHealthy}, tasks=${nodeMetrics.metrics.tasksExecuted}`);
  });

  await coordinator.stop();
}

// Example 6: Cloudflare Worker Deployment
async function example6_cloudflareWorker() {
  console.log('\n=== Example 6: Cloudflare Worker Deployment ===\n');

  const proxy = new CloudflareWorkerProxy({
    accountId: 'your-account-id',
    zoneId: 'your-zone-id',
  });

  // Generate and show snippet of worker script
  const workerScript = proxy.generateWorkerScript();
  console.log('Generated Cloudflare Worker Script (first 500 chars):\n');
  console.log(workerScript.substring(0, 500) + '...\n');

  // Generate wrangler config
  const wranglerConfig = proxy.generateWranglerConfig();
  console.log('Generated wrangler.toml (first 300 chars):\n');
  console.log(wranglerConfig.substring(0, 300) + '...\n');

  console.log('To deploy:');
  console.log('  1. Save worker script: node scripts/edge-computing.js worker > src/worker.js');
  console.log('  2. Save config: node scripts/edge-computing.js wrangler > wrangler.toml');
  console.log('  3. Deploy: wrangler publish');
}

// Example 7: HTTP API Integration
async function example7_httpApiIntegration() {
  console.log('\n=== Example 7: HTTP API Integration ===\n');

  const coordinator = new EdgeCoordinator();

  const node = new EdgeNode('edge-api', NODE_ROLES.WORKER, { region: 'us-west' });
  coordinator.registerNode(node);
  await coordinator.start();

  const server = new LocalEdgeServer(8765, coordinator);
  await server.start();

  console.log('Edge server running on http://localhost:8765\n');

  // Simulate API requests
  console.log('Example API requests:');
  console.log('  POST /submit: { goal: "Process data", region: "us-west" }');
  console.log('  GET /metrics: Get global metrics');
  console.log('  GET /nodes: List all nodes');
  console.log('  GET /health: Check health\n');

  // Clean up
  await new Promise(resolve => setTimeout(resolve, 2000));
  await server.stop();
  await coordinator.stop();

  console.log('Server stopped');
}

// Run examples
async function runAllExamples() {
  try {
    await example1_basicTaskRouting();
    await example2_highFrequencyTasks();
    await example3_latencySensitiveApp();
    await example4_cloudSync();
    await example5_multiRegionFailover();
    await example6_cloudflareWorker();
    await example7_httpApiIntegration();

    console.log('\n✓ All examples completed successfully\n');
  } catch (error) {
    console.error('Error running examples:', error);
    process.exit(1);
  }
}

// Allow running specific examples
const args = process.argv.slice(2);
if (args.length > 0) {
  const exampleNum = parseInt(args[0], 10);
  const examples = [
    example1_basicTaskRouting,
    example2_highFrequencyTasks,
    example3_latencySensitiveApp,
    example4_cloudSync,
    example5_multiRegionFailover,
    example6_cloudflareWorker,
    example7_httpApiIntegration,
  ];

  if (examples[exampleNum - 1]) {
    examples[exampleNum - 1]().catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
  } else {
    console.log(`Example ${exampleNum} not found`);
    console.log('Usage: node examples/edge-computing-example.js [1-7]');
  }
} else {
  runAllExamples();
}

module.exports = {
  example1_basicTaskRouting,
  example2_highFrequencyTasks,
  example3_latencySensitiveApp,
  example4_cloudSync,
  example5_multiRegionFailover,
  example6_cloudflareWorker,
  example7_httpApiIntegration,
};
