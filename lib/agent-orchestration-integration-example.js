#!/usr/bin/env node

/**
 * Agent Orchestration System — Integration Examples
 *
 * Practical examples demonstrating:
 * - Multi-agent data pipeline
 * - Parallel data processing with fan-out
 * - Aggregation with fan-in
 * - Complex workflow with dependencies
 * - Real-time monitoring & metrics
 * - Error handling & recovery
 */

const {
  Orchestrator,
  Workflow,
  EXECUTION_MODE,
  AGENT_STATE,
  PRIORITY,
} = require('./agent-orchestration.js');

const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
};

// ============================================================================
// Example 1: Data Processing Pipeline
// ============================================================================

async function exampleDataPipeline() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 1: Data Processing Pipeline ═══${COLORS.RESET}\n`);

  const orchestrator = new Orchestrator({
    mode: EXECUTION_MODE.PIPELINE,
    maxConcurrent: 3,
  });

  // Define processing stages
  let stageName = '';
  orchestrator.registerAgent('ingest', async (task) => {
    console.log(`${COLORS.GREEN}[INGEST]${COLORS.RESET} Loading ${task.input.source}`);
    await sleep(100);
    return {
      datasetId: 'ds-001',
      records: 1000,
      source: task.input.source,
    };
  });

  orchestrator.registerAgent('validate', async (task) => {
    console.log(`${COLORS.BLUE}[VALIDATE]${COLORS.RESET} Validating dataset ${task.input.datasetId}`);
    await sleep(150);
    return {
      datasetId: task.input.datasetId,
      valid: 950,
      invalid: 50,
    };
  });

  orchestrator.registerAgent('transform', async (task) => {
    console.log(`${COLORS.MAGENTA}[TRANSFORM]${COLORS.RESET} Transforming data`);
    await sleep(200);
    return {
      datasetId: task.input.datasetId,
      transformed: 950,
      format: 'normalized',
    };
  });

  orchestrator.registerAgent('aggregate', async (task) => {
    console.log(`${COLORS.YELLOW}[AGGREGATE]${COLORS.RESET} Computing aggregations`);
    await sleep(120);
    return {
      datasetId: task.input.datasetId,
      stats: { mean: 42.5, median: 40, stddev: 15.2 },
    };
  });

  // Submit tasks in pipeline stages
  orchestrator.submitTask('ingest-1', 'ingest', { input: { source: 'database' } });

  orchestrator.submitTask('validate-1', 'validate', {
    dependencies: ['ingest-1'],
    input: { datasetId: 'ds-001' },
  });

  orchestrator.submitTask('transform-1', 'transform', {
    dependencies: ['validate-1'],
    input: { datasetId: 'ds-001' },
  });

  orchestrator.submitTask('aggregate-1', 'aggregate', {
    dependencies: ['transform-1'],
    input: { datasetId: 'ds-001' },
  });

  // Monitor execution
  orchestrator.on('task-completed', (event) => {
    const task = orchestrator.tasks.get(event.taskId);
    console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} ${task.id} completed in ${task.getDuration()}ms`);
  });

  orchestrator.on('task-failed', (event) => {
    console.log(`${COLORS.RED}[✗]${COLORS.RESET} ${event.taskId}: ${event.error}`);
  });

  await orchestrator.run(EXECUTION_MODE.DAGSHED);

  const metrics = orchestrator.getMetrics();
  console.log(
    `\n${COLORS.CYAN}Pipeline complete:${COLORS.RESET} ${metrics.metrics.tasksSuccessful} tasks, ${(metrics.metrics.totalDuration / 1000).toFixed(2)}s`
  );
}

// ============================================================================
// Example 2: Parallel Processing with Fan-Out
// ============================================================================

async function exampleFanOutPattern() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 2: Parallel Processing (Fan-Out) ═══${COLORS.RESET}\n`
  );

  const orchestrator = new Orchestrator({ maxConcurrent: 4 });
  const regions = ['us-east', 'us-west', 'eu-west', 'ap-south'];
  const processedRegions = [];

  orchestrator.registerAgent('dispatcher', async () => {
    console.log(`${COLORS.YELLOW}[DISPATCH]${COLORS.RESET} Fanning out to ${regions.length} regions`);
    await sleep(50);
    return { regions };
  });

  orchestrator.registerAgent('processor', async (task) => {
    const region = task.input.region;
    processedRegions.push(region);
    console.log(`${COLORS.GREEN}[PROCESS]${COLORS.RESET} Processing region: ${region}`);
    await sleep(100 + Math.random() * 100); // Variable latency
    return { region, processed: true, timestamp: Date.now() };
  });

  // Source task
  orchestrator.submitTask('dispatch', 'dispatcher');

  // Fan-out: create one task per region
  for (const region of regions) {
    orchestrator.submitTask(`process-${region}`, 'processor', {
      input: { region },
      priority: PRIORITY.NORMAL,
    });
  }

  // Monitor fan-out
  orchestrator.on('task-completed', (event) => {
    const task = orchestrator.tasks.get(event.taskId);
    if (task.id.startsWith('process-')) {
      const region = task.id.replace('process-', '');
      console.log(`  └─ Region ${region} ✓ (${task.getDuration()}ms)`);
    }
  });

  await orchestrator.run();

  console.log(
    `\n${COLORS.GREEN}Fan-out complete:${COLORS.RESET} Processed ${processedRegions.length} regions in parallel`
  );
  console.log(`  Total time: ${(orchestrator.getMetrics().metrics.totalDuration / 1000).toFixed(2)}s`);
}

// ============================================================================
// Example 3: Aggregation with Fan-In
// ============================================================================

async function exampleFanInPattern() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 3: Aggregation (Fan-In) ═══${COLORS.RESET}\n`
  );

  const orchestrator = new Orchestrator({ maxConcurrent: 3 });
  const shards = ['shard-1', 'shard-2', 'shard-3'];
  const results = {};

  orchestrator.registerAgent('query', async (task) => {
    const shard = task.input.shard;
    console.log(`${COLORS.BLUE}[QUERY]${COLORS.RESET} Querying ${shard}`);
    await sleep(80 + Math.random() * 50);

    const data = {
      shard,
      count: Math.floor(Math.random() * 1000),
      sum: Math.floor(Math.random() * 100000),
    };
    results[shard] = data;
    return data;
  });

  orchestrator.registerAgent('aggregator', async (task) => {
    console.log(`${COLORS.MAGENTA}[AGGREGATE]${COLORS.RESET} Merging shard results`);
    await sleep(50);

    const allResults = Object.values(results);
    const totalCount = allResults.reduce((sum, r) => sum + r.count, 0);
    const totalSum = allResults.reduce((sum, r) => sum + r.sum, 0);

    return {
      totalShards: allResults.length,
      totalCount,
      totalSum,
      average: totalSum / totalCount,
    };
  });

  // Query tasks for each shard
  for (const shard of shards) {
    orchestrator.submitTask(`query-${shard}`, 'query', {
      input: { shard },
      priority: PRIORITY.NORMAL,
    });
  }

  // Aggregation task (depends on all queries)
  orchestrator.submitTask('aggregate-results', 'aggregator', {
    dependencies: shards.map((s) => `query-${s}`),
  });

  // Monitor
  orchestrator.on('task-completed', (event) => {
    const task = orchestrator.tasks.get(event.taskId);
    if (task.id === 'aggregate-results') {
      console.log(`\n${COLORS.GREEN}[RESULT]${COLORS.RESET}`);
      console.log(`  Total records: ${event.result.totalCount}`);
      console.log(`  Total sum: ${event.result.totalSum}`);
      console.log(`  Average: ${event.result.average.toFixed(2)}`);
    }
  });

  await orchestrator.run();

  const metrics = orchestrator.getMetrics();
  console.log(
    `\n${COLORS.GREEN}Fan-in complete:${COLORS.RESET} ${shards.length} shards aggregated in ${(metrics.metrics.totalDuration / 1000).toFixed(2)}s`
  );
}

// ============================================================================
// Example 4: Complex Workflow with Dependencies
// ============================================================================

async function exampleComplexWorkflow() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 4: Complex Multi-Agent Workflow ═══${COLORS.RESET}\n`
  );

  const orchestrator = new Orchestrator();

  // Define specialized agents
  orchestrator.registerAgent('code-analyzer', async (task) => {
    console.log(`${COLORS.BLUE}[CODE]${COLORS.RESET} Analyzing code quality`);
    await sleep(120);
    return { quality: 85, issues: 3, score: 'B+' };
  });

  orchestrator.registerAgent('security-scanner', async (task) => {
    console.log(`${COLORS.RED}[SECURITY]${COLORS.RESET} Scanning for vulnerabilities`);
    await sleep(150);
    return { vulnerabilities: 1, severity: 'medium', safe: false };
  });

  orchestrator.registerAgent('performance-profiler', async (task) => {
    console.log(`${COLORS.MAGENTA}[PERF]${COLORS.RESET} Profiling performance`);
    await sleep(100);
    return { avgLatency: 45, throughput: 1000, bottleneck: 'database' };
  });

  orchestrator.registerAgent('report-generator', async (task) => {
    console.log(`${COLORS.YELLOW}[REPORT]${COLORS.RESET} Generating comprehensive report`);
    await sleep(80);
    return {
      report: 'comprehensive-report.pdf',
      timestamp: Date.now(),
      status: 'generated',
    };
  });

  orchestrator.registerAgent('notifier', async (task) => {
    console.log(`${COLORS.GREEN}[NOTIFY]${COLORS.RESET} Sending notifications`);
    await sleep(50);
    return { sent: true, channels: ['email', 'slack'] };
  });

  // Build workflow DAG
  const workflow = new Workflow('code-review-pipeline');

  // Parallel analysis phase
  workflow.addStage('Analysis', 'parallel');
  orchestrator.submitTask('analyze-code', 'code-analyzer');
  orchestrator.submitTask('scan-security', 'security-scanner');
  orchestrator.submitTask('profile-perf', 'performance-profiler');

  workflow.addTask('Analysis', 'analyze-code');
  workflow.addTask('Analysis', 'scan-security');
  workflow.addTask('Analysis', 'profile-perf');

  // Report generation phase (depends on all analyses)
  workflow.addStage('Reporting', 'sequential');
  orchestrator.submitTask('generate-report', 'report-generator', {
    dependencies: ['analyze-code', 'scan-security', 'profile-perf'],
  });
  workflow.addTask('Reporting', 'generate-report');

  // Notification phase
  workflow.addStage('Notification', 'sequential');
  orchestrator.submitTask('notify-team', 'notifier', {
    dependencies: ['generate-report'],
  });
  workflow.addTask('Notification', 'notify-team');

  // Monitor workflow
  let completedCount = 0;
  orchestrator.on('task-completed', () => {
    completedCount++;
  });

  console.log(`${COLORS.DIM}Running workflow...${COLORS.RESET}`);
  const result = await workflow.execute(orchestrator);

  console.log(
    `\n${COLORS.GREEN}Workflow complete:${COLORS.RESET} ${completedCount} tasks executed`
  );
  console.log(`  Duration: ${(result.metrics.totalDuration / 1000).toFixed(2)}s`);
}

// ============================================================================
// Example 5: Error Handling & Recovery
// ============================================================================

async function exampleErrorHandling() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 5: Error Handling & Recovery ═══${COLORS.RESET}\n`
  );

  const orchestrator = new Orchestrator();
  let retryCount = 0;

  orchestrator.registerAgent('unstable-service', async (task) => {
    const attempt = retryCount + 1;
    console.log(`${COLORS.YELLOW}[ATTEMPT ${attempt}]${COLORS.RESET} Processing ${task.id}`);

    if (attempt === 1) {
      throw new Error('Service temporarily unavailable');
    }

    await sleep(50);
    return { success: true, attempts: attempt };
  }, { maxRetries: 3, retryDelay: 500 });

  orchestrator.registerAgent('fallback-handler', async (task) => {
    console.log(`${COLORS.MAGENTA}[FALLBACK]${COLORS.RESET} Using fallback mechanism`);
    await sleep(30);
    return { result: 'cached-data', source: 'fallback' };
  });

  // Primary task with retry
  orchestrator.submitTask('primary-task', 'unstable-service', {
    timeout: 2000,
    maxRetries: 2,
  });

  // Fallback task (only if primary fails)
  orchestrator.submitTask('fallback-task', 'fallback-handler', {
    dependencies: ['primary-task'],
  });

  // Monitor retries
  orchestrator.on('task-started', (event) => {
    const task = orchestrator.tasks.get(event.taskId);
    if (task.id === 'primary-task') {
      retryCount = task.attempts;
    }
  });

  orchestrator.on('task-failed', (event) => {
    console.log(`${COLORS.RED}[ERROR]${COLORS.RESET} ${event.taskId}: ${event.error}`);
  });

  await orchestrator.run();

  const metrics = orchestrator.getMetrics();
  console.log(`\n${COLORS.GREEN}Error recovery complete:${COLORS.RESET}`);
  console.log(`  Tasks processed: ${metrics.metrics.tasksProcessed}`);
  console.log(`  Tasks successful: ${metrics.metrics.tasksSuccessful}`);
  console.log(`  Tasks failed: ${metrics.metrics.tasksFailed}`);
}

// ============================================================================
// Example 6: Real-Time Metrics & Monitoring
// ============================================================================

async function exampleMetricsMonitoring() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 6: Real-Time Metrics Monitoring ═══${COLORS.RESET}\n`
  );

  const orchestrator = new Orchestrator({ maxConcurrent: 3 });
  const workloads = [
    { id: 'light-task', duration: 30 },
    { id: 'medium-task', duration: 100 },
    { id: 'heavy-task', duration: 200 },
    { id: 'light-task-2', duration: 40 },
    { id: 'medium-task-2', duration: 120 },
  ];

  orchestrator.registerAgent('worker', async (task) => {
    const workload = workloads.find((w) => w.id === task.id);
    await sleep(workload.duration);
    return { processed: true, duration: workload.duration };
  });

  // Submit tasks
  for (const workload of workloads) {
    orchestrator.submitTask(workload.id, 'worker');
  }

  // Print metrics every 200ms
  const metricsInterval = setInterval(() => {
    const metrics = orchestrator.getMetrics();
    const m = metrics.metrics;

    const progress = Math.round((m.tasksProcessed / 5) * 100);
    const bar =
      '█'.repeat(Math.floor(progress / 5)) +
      '░'.repeat(20 - Math.floor(progress / 5));

    console.log(
      `${COLORS.CYAN}[${new Date().toLocaleTimeString()}]${COLORS.RESET} ` +
        `${bar} ${progress}% | ` +
        `Processed: ${m.tasksProcessed}/5 | ` +
        `Duration: ${(m.totalDuration / 1000).toFixed(2)}s`
    );
  }, 200);

  await orchestrator.run();
  clearInterval(metricsInterval);

  // Final report
  const metrics = orchestrator.getMetrics();
  console.log(`\n${COLORS.BOLD}${COLORS.GREEN}═══ METRICS REPORT ═══${COLORS.RESET}`);
  console.log(`  Total tasks: ${metrics.totalTasks}`);
  console.log(`  Successful: ${metrics.metrics.tasksSuccessful}`);
  console.log(`  Failed: ${metrics.metrics.tasksFailed}`);
  console.log(`  Total duration: ${(metrics.metrics.totalDuration / 1000).toFixed(2)}s`);

  if (metrics.tasks.length > 0) {
    console.log(`\n${COLORS.CYAN}Top Tasks by Duration:${COLORS.RESET}`);
    metrics.tasks
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3)
      .forEach((task, idx) => {
        console.log(`  ${idx + 1}. ${task.id}: ${task.duration}ms`);
      });
  }
}

// ============================================================================
// Utilities
// ============================================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const example = process.argv[2];

  try {
    switch (example) {
      case '1':
      case 'pipeline':
        await exampleDataPipeline();
        break;
      case '2':
      case 'fanout':
        await exampleFanOutPattern();
        break;
      case '3':
      case 'fanin':
        await exampleFanInPattern();
        break;
      case '4':
      case 'workflow':
        await exampleComplexWorkflow();
        break;
      case '5':
      case 'errors':
        await exampleErrorHandling();
        break;
      case '6':
      case 'metrics':
        await exampleMetricsMonitoring();
        break;
      default:
        console.log(`
${COLORS.BOLD}Agent Orchestration — Integration Examples${COLORS.RESET}

${COLORS.BOLD}Usage:${COLORS.RESET}
  node agent-orchestration-integration-example.js <example>

${COLORS.BOLD}Examples:${COLORS.RESET}
  1, pipeline   Data processing pipeline with dependencies
  2, fanout     Parallel processing with fan-out pattern
  3, fanin      Aggregation with fan-in pattern
  4, workflow   Complex multi-agent workflow
  5, errors     Error handling & recovery mechanisms
  6, metrics    Real-time metrics monitoring

${COLORS.BOLD}Run all:${COLORS.RESET}
  for i in 1 2 3 4 5 6; do node agent-orchestration-integration-example.js $i; done
        `);
        break;
    }
  } catch (error) {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  exampleDataPipeline,
  exampleFanOutPattern,
  exampleFanInPattern,
  exampleComplexWorkflow,
  exampleErrorHandling,
  exampleMetricsMonitoring,
};
