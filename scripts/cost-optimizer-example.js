#!/usr/bin/env node

/**
 * Cost Optimizer Example & Integration Guide
 * Demonstrates real-world cost reduction strategies for agent pools
 */

const { AgentPool, PRIORITIES, ResourceQuota } = require('./dont-stop-agent-pool.js');
const { CostOptimizer, CostAnalysis } = require('./cost-optimizer.js');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  RESET: '\x1b[0m',
  DIM: '\x1b[2m',
};

/**
 * Example 1: Basic cost analysis
 */
async function exampleBasicAnalysis() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 1: Basic Cost Analysis${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 1000000,
  });

  // Submit diverse goals
  const goals = [
    { goal: 'review pull request for auth module', priority: PRIORITIES.HIGH },
    { goal: 'run unit tests', priority: PRIORITIES.NORMAL },
    { goal: 'generate API docs', priority: PRIORITIES.LOW },
    { goal: 'check code style', priority: PRIORITIES.LOW },
  ];

  goals.forEach(({ goal, priority }) => {
    const goalId = pool.submitGoal(goal, {
      priority,
      maxTokens: 50000,
      maxDuration: 120000,
    });
    const g = pool.getGoal(goalId);
    g.metrics.tokensUsed = Math.floor(Math.random() * 25000) + 10000;
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const summary = optimizer.analysis.getSummary();
  console.log(`Baseline cost:       $${(summary.baseline / 1000).toFixed(2)}`);
  console.log(`Projected savings:   $${(summary.projectedSavings / 1000).toFixed(2)} (${summary.savingsPercent}%)`);
  console.log(`Recommendations:     ${summary.recommendationCount}`);
}

/**
 * Example 2: Task classification and model selection
 */
async function exampleTaskClassification() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 2: Task Classification & Model Selection${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 500000,
  });

  const testCases = [
    'validate JSON schema against input',
    'perform comprehensive code review of authentication system',
    'generate technical documentation for REST API',
    'debug memory leak in production service',
    'refactor legacy database schema',
  ];

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  console.log(`${COLORS.YELLOW}Task Classifications:${COLORS.RESET}\n`);

  testCases.forEach((goalText) => {
    const analysis = optimizer.analysis;
    const taskType = analysis.classifyGoal(goalText);
    const complexity = analysis.estimateComplexity(goalText);
    const modelRec = analysis.recommendModel(goalText);

    console.log(`${COLORS.CYAN}Goal:${COLORS.RESET} "${goalText}"`);
    console.log(`  Type:        ${taskType}`);
    console.log(`  Complexity:  ${complexity}`);
    console.log(`  Model:       ${COLORS.GREEN}${modelRec.recommended}${COLORS.RESET}`);
    console.log(`  Reason:      ${modelRec.reasoning}`);
    console.log();
  });
}

/**
 * Example 3: Auto-apply optimizations
 */
async function exampleAutoOptimize() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 3: Auto-Apply Safe Optimizations${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 300000, // Low budget to trigger optimizations
  });

  const goals = [
    { goal: 'monitor uptime', priority: PRIORITIES.LOW },
    { goal: 'lint code files', priority: PRIORITIES.LOW },
    { goal: 'validate inputs', priority: PRIORITIES.LOW },
  ];

  goals.forEach(({ goal, priority }) => {
    pool.submitGoal(goal, {
      priority,
      maxTokens: 50000,
      maxDuration: 120000,
    });
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  console.log(`${COLORS.YELLOW}Before auto-optimization:${COLORS.RESET}`);
  console.log(`  Global budget: ${pool.globalBudget}`);
  console.log(`  Safe optimizations available: ${
    optimizer.analysis.optimizations.filter(o => o.autoApply && o.difficulty === 'trivial').length
  }\n`);

  const result = await optimizer.autoOptimize();

  console.log(`\n${COLORS.YELLOW}After auto-optimization:${COLORS.RESET}`);
  console.log(`  Global budget: ${pool.globalBudget}`);
  console.log(`  Applied: ${result.applied.length}`);
  console.log(`  Failed: ${result.failed.length}`);
}

/**
 * Example 4: Caching and deduplication
 */
async function exampleCachingStrategy() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 4: Caching Strategy Analysis${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 1000000,
  });

  // Submit many similar goals (cache opportunity)
  const similarGoals = [
    'run unit tests for core modules',
    'run unit tests for util modules',
    'run unit tests for api modules',
    'run unit tests for auth modules',
    'run unit tests for database modules',
  ];

  similarGoals.forEach((goal) => {
    pool.submitGoal(goal, { priority: PRIORITIES.NORMAL });
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const cachingRecs = optimizer.analysis.recommendations.filter(r => r.type === 'caching');

  console.log(`${COLORS.YELLOW}Caching Opportunities Found: ${cachingRecs.length}${COLORS.RESET}\n`);

  cachingRecs.forEach((rec) => {
    console.log(`Pattern:      ${rec.pattern}`);
    console.log(`Count:        ${rec.count} occurrences`);
    console.log(`Strategy:     ${rec.strategy}`);
    console.log(`Savings:      ~$${(rec.estimatedSavings / 1000).toFixed(2)}`);
    console.log();
  });
}

/**
 * Example 5: Batching strategy
 */
async function exampleBatchingStrategy() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 5: Batch Processing Strategy${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 1000000,
  });

  // Mix priorities
  const goals = [
    { goal: 'generate API docs', priority: PRIORITIES.LOW },
    { goal: 'format code', priority: PRIORITIES.LOW },
    { goal: 'validate schema', priority: PRIORITIES.LOW },
    { goal: 'critical bug fix', priority: PRIORITIES.CRITICAL },
    { goal: 'feature development', priority: PRIORITIES.HIGH },
  ];

  goals.forEach(({ goal, priority }) => {
    pool.submitGoal(goal, { priority });
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const batchingRecs = optimizer.analysis.recommendations.filter(r => r.type === 'batching');

  console.log(`${COLORS.YELLOW}Batching Opportunities Found: ${batchingRecs.length}${COLORS.RESET}\n`);

  batchingRecs.forEach((rec) => {
    console.log(`Scope:        ${rec.scope}`);
    console.log(`Goals:        ${rec.count}`);
    console.log(`Strategy:     ${rec.strategy}`);
    console.log(`Savings:      ~$${(rec.estimatedSavings / 1000).toFixed(2)}`);
    console.log();
  });
}

/**
 * Example 6: Resource quota optimization
 */
async function exampleQuotaOptimization() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 6: Resource Quota Optimization${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 1000000,
  });

  // Submit goal with overallocated quota
  const goalId = pool.submitGoal('simple validation task', {
    priority: PRIORITIES.LOW,
    maxTokens: 100000, // Oversized for simple task
  });

  const goal = pool.getGoal(goalId);
  goal.metrics.tokensUsed = 15000; // Actually used much less

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const quotaRecs = optimizer.analysis.recommendations.filter(r => r.type === 'quota-adjustment');

  console.log(`${COLORS.YELLOW}Quota Adjustment Opportunities: ${quotaRecs.length}${COLORS.RESET}\n`);

  quotaRecs.forEach((rec) => {
    console.log(`Goal:           ${rec.goalId}`);
    console.log(`Current quota:  ${rec.current} tokens`);
    console.log(`Suggested:      ${rec.suggested} tokens`);
    console.log(`Reduction:      ${rec.current - rec.suggested} tokens (${
      Math.round(((rec.current - rec.suggested) / rec.current) * 100)
    }%)`);
    console.log();
  });
}

/**
 * Example 7: Token reduction techniques
 */
async function exampleTokenReduction() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 7: Token Reduction Techniques${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 1000000,
  });

  const verboseGoal = `
    Please could you kindly review the following code snippet?
    It would be very helpful if you could check for any bugs,
    performance issues, or security vulnerabilities.
    Thank you very much. Please provide a detailed report.
  `;

  pool.submitGoal(verboseGoal, { priority: PRIORITIES.NORMAL });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const tokenRecs = optimizer.analysis.recommendations.filter(r => r.type === 'token-reduction');

  console.log(`${COLORS.YELLOW}Token Reduction Opportunities: ${tokenRecs.length}${COLORS.RESET}\n`);

  tokenRecs.forEach((rec) => {
    console.log(`Techniques:`);
    rec.technique.forEach((t) => {
      console.log(`  • ${t}`);
    });
    console.log(`Estimated savings: ~$${(rec.estimatedSavings / 1000).toFixed(2)}`);
    console.log();
  });
}

/**
 * Example 8: Model downgrade analysis
 */
async function exampleModelDowngrade() {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}EXAMPLE 8: Model Downgrade Recommendations${COLORS.RESET}\n`);

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 1000000,
  });

  const simpleGoals = [
    'validate email format',
    'check if string is JSON',
    'format code with prettier',
    'lint JavaScript file',
    'verify function signature',
  ];

  simpleGoals.forEach((goal) => {
    const goalId = pool.submitGoal(goal, { priority: PRIORITIES.NORMAL });
    const g = pool.getGoal(goalId);
    g.metrics.tokensUsed = Math.floor(Math.random() * 10000) + 2000;
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const downgradeRecs = optimizer.analysis.recommendations.filter(r => r.type === 'model-downgrade');

  console.log(`${COLORS.YELLOW}Model Downgrade Opportunities: ${downgradeRecs.length}${COLORS.RESET}\n`);

  downgradeRecs.forEach((rec) => {
    console.log(`Goal type:     ${rec.goalType}`);
    console.log(`Downgrade:     ${rec.from} → ${COLORS.GREEN}${rec.to}${COLORS.RESET}`);
    console.log(`Reasoning:     ${rec.reasoning}`);
    console.log(`Savings:       ~$${(rec.estimatedSavings / 1000).toFixed(2)}`);
    console.log();
  });
}

/**
 * Main menu
 */
async function main() {
  const examples = [
    { name: 'Basic Cost Analysis', fn: exampleBasicAnalysis },
    { name: 'Task Classification', fn: exampleTaskClassification },
    { name: 'Auto-Apply Optimizations', fn: exampleAutoOptimize },
    { name: 'Caching Strategy', fn: exampleCachingStrategy },
    { name: 'Batching Strategy', fn: exampleBatchingStrategy },
    { name: 'Quota Optimization', fn: exampleQuotaOptimization },
    { name: 'Token Reduction', fn: exampleTokenReduction },
    { name: 'Model Downgrade', fn: exampleModelDowngrade },
  ];

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
${COLORS.BOLD}cost-optimizer-example${COLORS.RESET} — Interactive examples for cost optimization

${COLORS.BOLD}Usage:${COLORS.RESET}
  node cost-optimizer-example.js [example-number | all]

${COLORS.BOLD}Available Examples:${COLORS.RESET}`);
    examples.forEach((ex, idx) => {
      console.log(`  ${idx + 1}. ${ex.name}`);
    });
    console.log(`  all  Run all examples\n`);
    console.log(`${COLORS.BOLD}Examples:${COLORS.RESET}
  node cost-optimizer-example.js 1
  node cost-optimizer-example.js all
    `);
    return;
  }

  if (args[0] === 'all') {
    for (const example of examples) {
      await example.fn();
    }
  } else {
    const idx = parseInt(args[0], 10) - 1;
    if (idx >= 0 && idx < examples.length) {
      await examples[idx].fn();
    } else {
      console.error(`Invalid example number: ${args[0]}`);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  exampleBasicAnalysis,
  exampleTaskClassification,
  exampleAutoOptimize,
  exampleCachingStrategy,
  exampleBatchingStrategy,
  exampleQuotaOptimization,
  exampleTokenReduction,
  exampleModelDowngrade,
};

/**
 * Cost Optimizer Integration Examples
 *
 * Demonstrates practical workflows for optimizing agent pool costs:
 * - Pre-execution analysis and reporting
 * - Progressive optimization levels
 * - Post-execution comparison
 * - Recommendation implementation
 */

const { AgentPool, PRIORITIES } = require('./dont-stop-agent-pool.js');
const { CostOptimizer } = require('./cost-optimizer.js');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  RESET: '\x1b[0m',
  DIM: '\x1b[2m',
};

/**
 * Example 1: Pre-Execution Cost Analysis
 *
 * Analyze goals before submitting to pool, optimize before they run
 */
async function examplePreExecutionAnalysis() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 1: Pre-Execution Cost Analysis ═══${COLORS.RESET}\n`
  );

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 500000,
  });

  // Define goals before execution
  const goals = [
    { goal: 'run unit tests for core modules', priority: PRIORITIES.HIGH },
    { goal: 'run integration tests for API', priority: PRIORITIES.HIGH },
    { goal: 'run end-to-end tests', priority: PRIORITIES.HIGH },
    { goal: 'code review authentication module', priority: PRIORITIES.NORMAL },
    { goal: 'generate API documentation', priority: PRIORITIES.LOW },
    { goal: 'validate project structure', priority: PRIORITIES.NORMAL },
    { goal: 'format and lint source code', priority: PRIORITIES.LOW },
    { goal: 'check health endpoints', priority: PRIORITIES.LOW },
    { goal: 'deploy to staging', priority: PRIORITIES.HIGH },
    { goal: 'run smoke tests', priority: PRIORITIES.NORMAL },
  ];

  console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Submitting ${goals.length} goals to pool...\n`);

  // Submit all goals
  goals.forEach((item) => {
    pool.submitGoal(item.goal, {
      priority: item.priority,
      maxTokens: 50000,
      maxDuration: 120000,
      maxRetries: 2,
    });
  });

  // Simulate token usage for analysis
  pool.allGoals.forEach((goal) => {
    goal.metrics.tokensUsed = Math.floor(Math.random() * 30000) + 5000;
  });

  // Analyze before execution
  console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Running cost analysis...\n`);
  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const summary = optimizer.analysis.getSummary();

  console.log(`${COLORS.CYAN}Pre-Execution Analysis:${COLORS.RESET}`);
  console.log(`  Estimated cost: $${(summary.baseline / 1000).toFixed(2)}`);
  console.log(
    `  Projected savings: ${COLORS.GREEN}$${(summary.projectedSavings / 1000).toFixed(2)}${COLORS.RESET}`
  );
  console.log(`  Optimizable: ${summary.recommendationCount} recommendations`);

  console.log(`\n${COLORS.CYAN}Top 3 Opportunities:${COLORS.RESET}`);
  optimizer.analysis.getTopOpportunities(3).forEach((opp, idx) => {
    if (opp.type === 'caching') {
      console.log(
        `  ${idx + 1}. Cache ${opp.pattern} (${opp.count} matches) → $${(opp.estimatedSavings / 1000).toFixed(2)} savings`
      );
    } else if (opp.type === 'batching') {
      console.log(
        `  ${idx + 1}. Batch ${opp.scope} (${opp.count} goals) → $${(opp.estimatedSavings / 1000).toFixed(2)} savings`
      );
    } else if (opp.type === 'model-downgrade') {
      console.log(
        `  ${idx + 1}. Downgrade ${opp.from} → ${opp.to} → $${(opp.estimatedSavings / 1000).toFixed(2)} savings`
      );
    }
  });

  console.log(`\n${COLORS.GREEN}[✓]${COLORS.RESET} Ready to execute with optimizations applied`);
}

/**
 * Example 2: Progressive Optimization Levels
 *
 * Apply increasing levels of optimization (safe → aggressive)
 */
async function exampleProgressiveOptimization() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 2: Progressive Optimization Levels ═══${COLORS.RESET}\n`
  );

  const createPoolWithGoals = () => {
    const pool = new AgentPool({
      maxConcurrent: 4,
      globalBudget: 500000,
    });

    const goals = [
      { goal: 'run unit tests for core modules', priority: PRIORITIES.HIGH },
      { goal: 'run integration tests', priority: PRIORITIES.NORMAL },
      { goal: 'generate API documentation', priority: PRIORITIES.LOW },
      { goal: 'validate project structure', priority: PRIORITIES.NORMAL },
      { goal: 'format source code', priority: PRIORITIES.LOW },
      { goal: 'monitor health', priority: PRIORITIES.LOW },
    ];

    goals.forEach((item) => {
      pool.submitGoal(item.goal, {
        priority: item.priority,
        maxTokens: 50000,
      });
    });

    pool.allGoals.forEach((goal) => {
      goal.metrics.tokensUsed = Math.floor(Math.random() * 25000) + 5000;
    });

    return pool;
  };

  // Level 1: Conservative (Safe, high confidence)
  console.log(`${COLORS.CYAN}LEVEL 1: Conservative Optimizations${COLORS.RESET}`);
  console.log(`  ${COLORS.DIM}Focus: Safety & certainty${COLORS.RESET}`);

  const pool1 = createPoolWithGoals();
  const opt1 = new CostOptimizer(pool1);
  opt1.analyze();

  const safe = opt1.analysis.optimizations.filter((o) =>
    ['trivial', 'easy'].includes(o.difficulty)
  );
  console.log(`  Found: ${safe.length} safe optimizations`);
  safe.slice(0, 3).forEach((o) => {
    console.log(`    • ${o.name} (${o.impact}% impact)`);
  });
  console.log(`  Est. savings: ${COLORS.GREEN}~15-20%${COLORS.RESET}\n`);

  // Level 2: Moderate (Balanced risk/reward)
  console.log(`${COLORS.CYAN}LEVEL 2: Moderate Optimizations${COLORS.RESET}`);
  console.log(`  ${COLORS.DIM}Focus: Balance & efficiency${COLORS.RESET}`);

  const pool2 = createPoolWithGoals();
  const opt2 = new CostOptimizer(pool2);
  opt2.analyze();

  const moderate = opt2.analysis.optimizations.filter((o) =>
    ['easy', 'moderate'].includes(o.difficulty)
  );
  console.log(`  Found: ${moderate.length} moderate optimizations`);
  moderate.slice(0, 3).forEach((o) => {
    console.log(`    • ${o.name} (${o.impact}% impact)`);
  });
  console.log(`  Est. savings: ${COLORS.GREEN}~30-50%${COLORS.RESET}\n`);

  // Level 3: Aggressive (Maximum savings)
  console.log(`${COLORS.CYAN}LEVEL 3: Aggressive Optimizations${COLORS.RESET}`);
  console.log(`  ${COLORS.DIM}Focus: Maximum cost reduction${COLORS.RESET}`);

  const pool3 = createPoolWithGoals();
  const opt3 = new CostOptimizer(pool3);
  opt3.analyze();

  console.log(`  Found: ${opt3.analysis.optimizations.length} optimizations (all levels)`);
  opt3.analysis.optimizations.slice(0, 3).forEach((o) => {
    console.log(`    • ${o.name} (${o.impact}% impact, ${o.difficulty})`);
  });
  console.log(`  Est. savings: ${COLORS.GREEN}~60-80%${COLORS.RESET}\n`);

  console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Recommendation: Start with Level 1, progress as needed`);
}

/**
 * Example 3: Post-Execution Comparison
 *
 * Compare projected savings vs actual execution results
 */
async function examplePostExecutionComparison() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 3: Post-Execution Comparison ═══${COLORS.RESET}\n`
  );

  const pool = new AgentPool({
    maxConcurrent: 2,
    globalBudget: 300000,
  });

  // Submit and simulate goals
  const goals = [
    'run unit tests for core modules',
    'run integration tests',
    'generate documentation',
    'validate structure',
    'format code',
  ];

  goals.forEach((goal) => {
    pool.submitGoal(goal, { priority: PRIORITIES.NORMAL });
  });

  // Simulate execution
  const projectedTokens = {};
  pool.allGoals.forEach((goal) => {
    goal.metrics.tokensUsed = Math.floor(Math.random() * 20000) + 5000;
    projectedTokens[goal.id] = goal.metrics.tokensUsed;
  });

  console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Analyzing pool with ${pool.allGoals.size} goals...\n`);

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const summary = optimizer.analysis.getSummary();

  // Simulate actual execution (lower tokens if optimizations applied)
  console.log(`${COLORS.CYAN}Projected vs Actual (with optimizations):${COLORS.RESET}`);
  console.log(`  Baseline cost: $${(summary.baseline / 1000).toFixed(2)}`);
  console.log(
    `  Projected savings: ${COLORS.YELLOW}$${(summary.projectedSavings / 1000).toFixed(2)}${COLORS.RESET}`
  );

  // Simulate actual with 70% of projected savings
  const actualSavings = Math.ceil(summary.projectedSavings * 0.7);
  const actualCost = summary.baseline - actualSavings;

  console.log(`  Actual savings: ${COLORS.GREEN}$${(actualSavings / 1000).toFixed(2)}${COLORS.RESET}`);
  console.log(`  Achievement rate: ${COLORS.GREEN}${Math.round((actualSavings / summary.projectedSavings) * 100)}%${COLORS.RESET}`);
  console.log(`  Actual cost: $${(actualCost / 1000).toFixed(2)}`);

  console.log(
    `\n${COLORS.CYAN}Variance Analysis:${COLORS.RESET}`
  );
  console.log(
    `  Projection accuracy: ${COLORS.GREEN}70%${COLORS.RESET} (conservative estimate)`
  );
  console.log(
    `  Recommendation: Use 70% factor for future projections`
  );
}

/**
 * Example 4: Model Selection Optimization
 *
 * Demonstrate model downgrade recommendations
 */
async function exampleModelSelection() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 4: Model Selection Optimization ═══${COLORS.RESET}\n`
  );

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 500000,
  });

  const tasksByType = {
    testing: [
      'run unit tests for core modules',
      'run integration tests for API',
      'run end-to-end tests',
    ],
    trivial: [
      'format and lint source code',
      'check health endpoints',
      'monitor system status',
    ],
    complex: [
      'code review authentication module',
      'design database schema',
      'architect microservices',
    ],
  };

  console.log(`${COLORS.CYAN}Task Classification:${COLORS.RESET}\n`);

  Object.entries(tasksByType).forEach(([category, tasks]) => {
    tasks.forEach((task) => {
      const goalId = pool.submitGoal(task);
      pool.getGoal(goalId).metrics.tokensUsed = Math.floor(Math.random() * 25000) + 5000;
    });

    console.log(`${COLORS.YELLOW}${category.toUpperCase()}:${COLORS.RESET} ${tasks.length} tasks`);
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  console.log(`\n${COLORS.CYAN}Model Recommendations:${COLORS.RESET}\n`);

  const downgrades = optimizer.analysis.recommendations.filter(
    (r) => r.type === 'model-downgrade'
  );

  const byModel = {};
  downgrades.forEach((d) => {
    const key = `${d.from} → ${d.to}`;
    byModel[key] = (byModel[key] || 0) + 1;
  });

  Object.entries(byModel).forEach(([transition, count]) => {
    console.log(`  ${transition}: ${COLORS.YELLOW}${count}${COLORS.RESET} goals`);
  });

  const totalSavings = downgrades.reduce((sum, d) => sum + (d.estimatedSavings || 0), 0);
  console.log(
    `\n  ${COLORS.GREEN}Total model optimization savings: $${(totalSavings / 1000).toFixed(2)}${COLORS.RESET}`
  );
}

/**
 * Example 5: Batching Strategy
 *
 * Show how batching reduces API call overhead
 */
async function exampleBatchingStrategy() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 5: Batching Strategy ═══${COLORS.RESET}\n`
  );

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 500000,
  });

  // Mix of priorities
  const goals = [
    { goal: 'critical security update', priority: PRIORITIES.CRITICAL },
    { goal: 'high-priority deployment', priority: PRIORITIES.HIGH },
    { goal: 'standard testing', priority: PRIORITIES.NORMAL },
    { goal: 'background cleanup', priority: PRIORITIES.LOW },
    { goal: 'log rotation', priority: PRIORITIES.BACKGROUND },
    { goal: 'cache validation', priority: PRIORITIES.LOW },
    { goal: 'diagnostic check', priority: PRIORITIES.BACKGROUND },
  ];

  goals.forEach((item) => {
    const goalId = pool.submitGoal(item.goal, {
      priority: item.priority,
    });
    pool.getGoal(goalId).metrics.tokensUsed = Math.floor(Math.random() * 15000) + 3000;
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const batching = optimizer.analysis.recommendations.filter((r) => r.type === 'batching');

  console.log(`${COLORS.CYAN}Batching Opportunities:${COLORS.RESET}\n`);

  batching.forEach((batch) => {
    console.log(`  Pattern: ${COLORS.YELLOW}${batch.scope}${COLORS.RESET}`);
    console.log(`    Goals: ${batch.count}`);
    console.log(`    Savings: ${COLORS.GREEN}$${(batch.estimatedSavings / 1000).toFixed(2)}${COLORS.RESET}`);
    console.log(`    Strategy: ${batch.strategy}\n`);
  });

  console.log(
    `${COLORS.CYAN}Batching Benefits:${COLORS.RESET}`
  );
  console.log(
    `  • Reduces API call overhead (~25% savings)`
  );
  console.log(
    `  • Parallelizes independent low-priority tasks`
  );
  console.log(
    `  • Decreases latency from multiple round-trips`
  );
}

/**
 * Example 6: Caching Recommendations
 *
 * Identify cache-able patterns
 */
async function exampleCachingRecommendations() {
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN}═══ Example 6: Caching Recommendations ═══${COLORS.RESET}\n`
  );

  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 500000,
  });

  // Similar goals repeated (cache candidates)
  const goals = [
    // Testing cluster
    'run unit tests for core modules',
    'run unit tests for util modules',
    'run unit tests for api modules',
    'run unit tests for db modules',
    // Validation cluster
    'validate project structure',
    'validate dependencies',
    'validate configuration',
    // Monitoring cluster
    'monitor health',
    'monitor performance',
    'monitor security',
  ];

  goals.forEach((goal) => {
    const goalId = pool.submitGoal(goal);
    pool.getGoal(goalId).metrics.tokensUsed = Math.floor(Math.random() * 20000) + 5000;
  });

  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();

  const caching = optimizer.analysis.recommendations.filter((r) => r.type === 'caching');

  console.log(`${COLORS.CYAN}Caching Opportunities:${COLORS.RESET}\n`);

  caching.forEach((cache) => {
    console.log(`  Pattern: ${COLORS.YELLOW}${cache.pattern}${COLORS.RESET}`);
    console.log(`    Occurrences: ${cache.count}`);
    console.log(`    Savings: ${COLORS.GREEN}$${(cache.estimatedSavings / 1000).toFixed(2)}${COLORS.RESET}`);
    console.log(`    Implementation: ${cache.strategy}\n`);
  });

  console.log(`${COLORS.CYAN}Caching Strategy:${COLORS.RESET}`);
  console.log(`  1. Hash goal text → cache key`);
  console.log(`  2. On execution, check cache first`);
  console.log(`  3. Return cached result if match (80% token savings)`);
  console.log(`  4. Execute & cache if miss`);
}

/**
 * Run all examples
 */
async function main() {
  const example = process.argv[2];

  try {
    switch (example) {
      case '1':
      case 'pre-analysis':
        await examplePreExecutionAnalysis();
        break;
      case '2':
      case 'progressive':
        await exampleProgressiveOptimization();
        break;
      case '3':
      case 'comparison':
        await examplePostExecutionComparison();
        break;
      case '4':
      case 'models':
        await exampleModelSelection();
        break;
      case '5':
      case 'batching':
        await exampleBatchingStrategy();
        break;
      case '6':
      case 'caching':
        await exampleCachingRecommendations();
        break;
      default:
        console.log(`
${COLORS.BOLD}Cost Optimizer Integration Examples${COLORS.RESET}

${COLORS.BOLD}Usage:${COLORS.RESET}
  node cost-optimizer-example.js <example>

${COLORS.BOLD}Examples:${COLORS.RESET}
  1, pre-analysis       Pre-execution cost analysis
  2, progressive        Progressive optimization levels
  3, comparison         Post-execution cost comparison
  4, models             Model selection optimization
  5, batching           Batching strategy analysis
  6, caching            Caching opportunities

${COLORS.BOLD}Run all:${COLORS.RESET}
  for i in 1 2 3 4 5 6; do node cost-optimizer-example.js $i; done
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
  examplePreExecutionAnalysis,
  exampleProgressiveOptimization,
  examplePostExecutionComparison,
  exampleModelSelection,
  exampleBatchingStrategy,
  exampleCachingRecommendations,
};
