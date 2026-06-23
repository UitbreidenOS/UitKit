#!/usr/bin/env node

/**
 * Agent Pool Integration Examples
 *
 * Demonstrates practical usage patterns for concurrent goal execution:
 * - Multi-stage deployment pipeline
 * - Batch processing with priority
 * - Adaptive resource allocation
 * - Error recovery and retry
 * - Real-time metrics reporting
 */

const { AgentPool, PRIORITIES } = require('./dont-stop-agent-pool.js');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  RESET: '\x1b[0m',
};

/**
 * Example 1: Multi-stage Build Pipeline
 *
 * Run build stages in dependency order with parallel independent tasks
 */
async function exampleBuildPipeline() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 1: Multi-Stage Build Pipeline ═══${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 300000,
  });

  // Stage 1: Validate (high priority, must run first)
  const validateId = pool.submitGoal('validate project structure and dependencies', {
    priority: PRIORITIES.CRITICAL,
    maxTokens: 30000,
    maxDuration: 60000,
    maxRetries: 2,
  });

  console.log(`${COLORS.GREEN}[+]${COLORS.RESET} Validation task submitted: ${validateId}`);

  // Stage 2: Tests (high priority, run in parallel after validation)
  setTimeout(() => {
    const testIds = [
      pool.submitGoal('run unit tests for core modules', {
        priority: PRIORITIES.HIGH,
        maxTokens: 50000,
        maxDuration: 120000,
        maxRetries: 3,
      }),
      pool.submitGoal('run integration tests', {
        priority: PRIORITIES.HIGH,
        maxTokens: 60000,
        maxDuration: 150000,
        maxRetries: 2,
      }),
      pool.submitGoal('run end-to-end tests', {
        priority: PRIORITIES.HIGH,
        maxTokens: 70000,
        maxDuration: 180000,
        maxRetries: 2,
      }),
    ];
    console.log(`${COLORS.GREEN}[+]${COLORS.RESET} Test tasks submitted: ${testIds.length} tests`);
  }, 1000);

  // Stage 3: Build (normal priority, run after tests pass)
  setTimeout(() => {
    const buildIds = [
      pool.submitGoal('build production artifacts', {
        priority: PRIORITIES.NORMAL,
        maxTokens: 40000,
        maxDuration: 120000,
        maxRetries: 2,
      }),
      pool.submitGoal('generate API documentation', {
        priority: PRIORITIES.LOW,
        maxTokens: 20000,
        maxDuration: 60000,
        maxRetries: 1,
      }),
    ];
    console.log(`${COLORS.GREEN}[+]${COLORS.RESET} Build tasks submitted: ${buildIds.length} tasks`);
  }, 2000);

  // Set up event monitoring
  let completedCount = 0;
  pool.on('goal-completed', () => {
    completedCount++;
    console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} Goal completed (${completedCount} total)`);
  });

  pool.on('goal-failed', (event) => {
    console.log(`${COLORS.RED}[✗]${COLORS.RESET} Goal failed: ${event.error}`);
  });

  // Run pool
  await pool.start();

  // Print results
  const metrics = pool.getMetrics();
  console.log(`\n${COLORS.CYAN}Build Pipeline Results:${COLORS.RESET}`);
  console.log(`  Successful: ${metrics.stats.goalsSuccessful}`);
  console.log(`  Failed: ${metrics.stats.goalsFailed}`);
  console.log(`  Total time: ${(metrics.stats.totalDuration / 1000).toFixed(2)}s`);
  console.log(`  Tokens used: ${metrics.cost.spent} / ${metrics.cost.budget}`);
}

/**
 * Example 2: Adaptive Priority Scheduling
 *
 * Submit mixed-priority tasks and observe queue reordering
 */
async function examplePriorityScheduling() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 2: Adaptive Priority Scheduling ═══${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 2,
    globalBudget: 150000,
  });

  const tasks = [
    { goal: 'background log rotation', priority: PRIORITIES.BACKGROUND },
    { goal: 'cache cleanup', priority: PRIORITIES.BACKGROUND },
    { goal: 'routine health check', priority: PRIORITIES.LOW },
    { goal: 'update dependencies', priority: PRIORITIES.NORMAL },
    { goal: 'fix critical security issue', priority: PRIORITIES.CRITICAL },
    { goal: 'optimize database queries', priority: PRIORITIES.NORMAL },
    { goal: 'deploy hotfix to production', priority: PRIORITIES.HIGH },
  ];

  // Submit in arbitrary order
  console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Submitting tasks in random order...\n`);

  tasks.forEach((task) => {
    pool.submitGoal(task.goal, {
      priority: task.priority,
      maxTokens: 25000,
      maxDuration: 60000,
      maxRetries: 1,
    });
  });

  // Monitor queue state
  setTimeout(() => {
    const metrics = pool.getMetrics();
    console.log(`${COLORS.CYAN}Queue order (by priority):${COLORS.RESET}`);
    metrics.queue.jobs.forEach((job, idx) => {
      const priorityName = Object.entries(PRIORITIES).find(
        ([_, v]) => v === job.priority
      )?.[0] || 'UNKNOWN';
      console.log(`  ${idx + 1}. [${priorityName}] ${job.goal.substring(0, 40)}...`);
    });
    console.log();
  }, 100);

  // Run pool
  await pool.start();

  // Show execution order
  const metrics = pool.getMetrics();
  console.log(`\n${COLORS.CYAN}Execution Order (by completion):${COLORS.RESET}`);
  metrics.allGoals.slice(0, 7).forEach((goal, idx) => {
    const duration = goal.duration ? `${(goal.duration / 1000).toFixed(2)}s` : 'pending';
    console.log(`  ${idx + 1}. ${goal.state.padEnd(10)} | ${goal.goal.substring(0, 35)}... (${duration})`);
  });
}

/**
 * Example 3: Token Budget Enforcement
 *
 * Demonstrate per-goal and global budget limits
 */
async function exampleBudgetEnforcement() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 3: Token Budget Enforcement ═══${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 3,
    globalBudget: 50000, // Tight budget to show enforcement
  });

  const expensiveTasks = [
    { goal: 'comprehensive system audit (3000 tokens)', weight: 3 },
    { goal: 'detailed performance profiling (2500 tokens)', weight: 2.5 },
    { goal: 'full code review (2000 tokens)', weight: 2 },
    { goal: 'generate analytics report (1500 tokens)', weight: 1.5 },
    { goal: 'create documentation (1000 tokens)', weight: 1 },
    { goal: 'run basic checks (500 tokens)', weight: 0.5 },
  ];

  console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Global budget: 50,000 tokens\n`);

  // Submit with estimated budgets
  expensiveTasks.forEach((task) => {
    const estimatedTokens = Math.ceil(task.weight * 1000);
    pool.submitGoal(task.goal, {
      priority: PRIORITIES.NORMAL,
      maxTokens: estimatedTokens,
      maxDuration: 120000,
      maxRetries: 1,
    });
  });

  // Monitor budget
  let budgetWarning = false;
  pool.on('goal-started', () => {
    const utilization = pool.costTracker.getGlobalUtilization();
    if (utilization.percent >= 80 && !budgetWarning) {
      console.log(
        `${COLORS.YELLOW}[!]${COLORS.RESET} Approaching budget limit: ${utilization.percent}% used`
      );
      budgetWarning = true;
    }
  });

  pool.on('goal-completed', () => {
    const utilization = pool.costTracker.getGlobalUtilization();
    console.log(
      `${COLORS.CYAN}Budget:${COLORS.RESET} ${utilization.spent}/${utilization.budget} (${utilization.percent}%)`
    );
  });

  // Run pool
  await pool.start();

  // Show final budget usage
  const metrics = pool.getMetrics();
  console.log(`\n${COLORS.CYAN}Final Budget Report:${COLORS.RESET}`);
  console.log(`  Total spent: ${metrics.cost.spent} tokens`);
  console.log(`  Budget limit: ${metrics.cost.budget} tokens`);
  console.log(`  Remaining: ${metrics.cost.remaining} tokens`);
  console.log(`  Utilization: ${metrics.cost.percent}%`);

  if (metrics.topCosts.length > 0) {
    console.log(`\n${COLORS.CYAN}Most Expensive Goals:${COLORS.RESET}`);
    metrics.topCosts.forEach((cost) => {
      console.log(`  ${cost.goalId}: ${cost.cost} tokens`);
    });
  }
}

/**
 * Example 4: Error Recovery with Retries
 *
 * Demonstrate retry logic and exponential backoff
 */
async function exampleErrorRecovery() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 4: Error Recovery with Retries ═══${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 2,
    globalBudget: 100000,
  });

  const tasks = [
    { goal: 'deploy to staging', retries: 3 },
    { goal: 'run smoke tests', retries: 2 },
    { goal: 'verify health endpoints', retries: 1 },
  ];

  console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Submitting tasks with retry budgets...\n`);

  tasks.forEach((task) => {
    pool.submitGoal(task.goal, {
      priority: PRIORITIES.HIGH,
      maxTokens: 30000,
      maxDuration: 120000,
      maxRetries: task.retries,
    });
  });

  // Track retry attempts
  let retryCount = 0;
  pool.on('goal-retry', (event) => {
    retryCount++;
    console.log(
      `${COLORS.YELLOW}[⟳]${COLORS.RESET} Retry attempt ${event.attempt} of goal ${event.goalId.substring(0, 12)}`
    );
    console.log(`    Error: ${event.error}`);
    console.log(`    Backoff: ${event.backoffMs}ms\n`);
  });

  // Run pool
  await pool.start();

  console.log(`${COLORS.CYAN}Retry Statistics:${COLORS.RESET}`);
  console.log(`  Total retry attempts: ${retryCount}`);

  const metrics = pool.getMetrics();
  console.log(`  Goals successful: ${metrics.stats.goalsSuccessful}`);
  console.log(`  Goals failed: ${metrics.stats.goalsFailed}`);
}

/**
 * Example 5: Real-time Metrics and Monitoring
 *
 * Track pool health and performance during execution
 */
async function exampleMetricsMonitoring() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 5: Real-time Metrics Monitoring ═══${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 3,
    globalBudget: 200000,
  });

  // Submit diverse workload
  const workloads = [
    'analyze code quality across 10 modules',
    'benchmark performance with various configurations',
    'validate API contracts with 50+ endpoints',
    'scan for security vulnerabilities in dependencies',
    'migrate database schema to new version',
  ];

  workloads.forEach((goal) => {
    pool.submitGoal(goal, {
      priority: PRIORITIES.NORMAL,
      maxTokens: 40000,
      maxDuration: 120000,
      maxRetries: 2,
    });
  });

  // Print metrics every 500ms during execution
  const metricsInterval = setInterval(() => {
    if (!pool.isRunning) {
      clearInterval(metricsInterval);
      return;
    }

    const metrics = pool.getMetrics();
    const active = metrics.active;

    console.log(
      `${COLORS.CYAN}[${new Date().toLocaleTimeString()}]${COLORS.RESET} ` +
        `Active: ${active.count}/${metrics.queue.size + active.count} | ` +
        `Tokens: ${metrics.cost.spent}/${metrics.cost.budget} | ` +
        `Load balance variance: ${metrics.loadBalance.variance.toFixed(2)}`
    );
  }, 500);

  // Run pool
  await pool.start();
  clearInterval(metricsInterval);

  // Final comprehensive report
  const metrics = pool.getMetrics();
  console.log(`\n${COLORS.BOLD}${COLORS.GREEN}═══ COMPREHENSIVE METRICS REPORT ═══${COLORS.RESET}\n`);

  console.log(`${COLORS.CYAN}Execution Summary:${COLORS.RESET}`);
  console.log(`  Pool ID: ${metrics.poolId}`);
  console.log(`  Total goals: ${metrics.stats.goalsProcessed}`);
  console.log(`  Successful: ${metrics.stats.goalsSuccessful}`);
  console.log(`  Failed: ${metrics.stats.goalsFailed}`);
  console.log(`  Total duration: ${(metrics.stats.totalDuration / 1000).toFixed(2)}s`);

  console.log(`\n${COLORS.CYAN}Resource Utilization:${COLORS.RESET}`);
  console.log(`  Tokens: ${metrics.cost.spent} / ${metrics.cost.budget}`);
  console.log(`  Budget utilization: ${metrics.cost.percent}%`);
  console.log(`  Load balance variance: ${metrics.loadBalance.variance.toFixed(3)}`);

  if (metrics.topCosts.length > 0) {
    console.log(`\n${COLORS.CYAN}Top 3 Expensive Goals:${COLORS.RESET}`);
    metrics.topCosts.slice(0, 3).forEach((cost, idx) => {
      console.log(`  ${idx + 1}. ${cost.goalId}: ${cost.cost} tokens`);
    });
  }
}

/**
 * Run all examples
 */
async function main() {
  const example = process.argv[2];

  try {
    switch (example) {
      case '1':
      case 'pipeline':
        await exampleBuildPipeline();
        break;
      case '2':
      case 'priority':
        await examplePriorityScheduling();
        break;
      case '3':
      case 'budget':
        await exampleBudgetEnforcement();
        break;
      case '4':
      case 'recovery':
        await exampleErrorRecovery();
        break;
      case '5':
      case 'metrics':
        await exampleMetricsMonitoring();
        break;
      default:
        console.log(`
${COLORS.BOLD}Agent Pool Integration Examples${COLORS.RESET}

${COLORS.BOLD}Usage:${COLORS.RESET}
  node agent-pool-example.js <example> [options]

${COLORS.BOLD}Examples:${COLORS.RESET}
  1, pipeline     Multi-stage build pipeline with dependencies
  2, priority     Adaptive priority scheduling
  3, budget       Token budget enforcement
  4, recovery     Error recovery with retries
  5, metrics      Real-time metrics monitoring

${COLORS.BOLD}Run all:${COLORS.RESET}
  for i in 1 2 3 4 5; do node agent-pool-example.js $i; done
        `);
        break;
    }
  } catch (error) {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  exampleBuildPipeline,
  examplePriorityScheduling,
  exampleBudgetEnforcement,
  exampleErrorRecovery,
  exampleMetricsMonitoring,
};
