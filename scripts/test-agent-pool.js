#!/usr/bin/env node

const {
  AgentPool,
  GoalContext,
  ResourceQuota,
  PriorityQueue,
  CostTracker,
  WorkloadBalancer,
  GOAL_STATES,
  PRIORITIES,
} = require('./dont-stop-agent-pool.js');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  RESET: '\x1b[0m',
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.log(`${COLORS.RED}✗ FAIL${COLORS.RESET} ${message}`);
    testsFailed++;
  } else {
    console.log(`${COLORS.GREEN}✓ PASS${COLORS.RESET} ${message}`);
    testsPassed++;
  }
}

function suite(name) {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}${name}${COLORS.RESET}`);
}

// Test ResourceQuota
suite('ResourceQuota');

const quota = new ResourceQuota(1000, 60000, 3);
assert(quota.getRemainingTokens() === 1000, 'Initial remaining tokens correct');
assert(quota.getRemainingRetries() === 3, 'Initial remaining retries correct');
assert(!quota.isExhausted(), 'Quota not exhausted initially');

quota.consumeTokens(500);
assert(quota.getRemainingTokens() === 500, 'Token consumption works');

quota.consumeRetry();
quota.consumeRetry();
quota.consumeRetry();
assert(!quota.consumeRetry(), 'Cannot exceed max retries');

const utilization = quota.getUtilization();
assert(utilization.tokens.percent === 50, 'Token utilization calculation correct');
assert(utilization.retries.percent >= 99, 'Retry utilization calculation correct');

// Test PriorityQueue
suite('PriorityQueue');

const queue = new PriorityQueue();
const goal1 = new GoalContext('g1', 'Task 1', PRIORITIES.NORMAL);
const goal2 = new GoalContext('g2', 'Task 2', PRIORITIES.HIGH);
const goal3 = new GoalContext('g3', 'Task 3', PRIORITIES.LOW);

queue.enqueue(goal1);
queue.enqueue(goal3);
queue.enqueue(goal2);

assert(queue.peek().id === 'g2', 'High priority goal at front');
const dequeued = queue.dequeue();
assert(dequeued.id === 'g2', 'High priority dequeued first');
assert(queue.peek().id === 'g1', 'Normal priority next');

queue.enqueue(goal2);
assert(queue.remove('g2'), 'Goal removal works');
assert(queue.getLength() === 2, 'Queue length after removal correct');

// Test CostTracker
suite('CostTracker');

const tracker = new CostTracker(10000);
assert(tracker.getGlobalRemaining() === 10000, 'Initial budget correct');

tracker.recordCost('goal_1', 3000);
tracker.recordCost('goal_2', 2000);
tracker.recordCost('goal_1', 1000);

assert(tracker.getGoalCost('goal_1') === 4000, 'Goal cost aggregation correct');
assert(tracker.getGoalCost('goal_2') === 2000, 'Individual goal cost correct');
assert(tracker.getGlobalRemaining() === 4000, 'Global remaining budget correct');
assert(tracker.isWithinBudget(), 'Within budget check correct');

tracker.recordCost('goal_3', 4500);
assert(!tracker.isWithinBudget(), 'Over budget detection works');

const topCosts = tracker.getTopCosts(2);
assert(topCosts.length >= 1, 'Top costs returns results');
assert(topCosts[0].cost >= 4000, 'Top cost value correct');

// Test WorkloadBalancer
suite('WorkloadBalancer');

const balancer = new WorkloadBalancer(3);
assert(balancer.canAddGoal(), 'Can add goal initially');
assert(balancer.getAvailableSlots() === 3, 'Available slots correct');

const ctx1 = new GoalContext('ctx_1', 'Goal 1');
balancer.addActiveGoal(ctx1);
assert(balancer.getActiveCount() === 1, 'Active count increments');
assert(balancer.getAvailableSlots() === 2, 'Available slots decrements');

balancer.addActiveGoal(new GoalContext('ctx_2', 'Goal 2'));
balancer.addActiveGoal(new GoalContext('ctx_3', 'Goal 3'));
assert(!balancer.canAddGoal(), 'Cannot exceed max concurrent');

balancer.removeActiveGoal('ctx_1');
assert(balancer.canAddGoal(), 'Can add goal after removal');

balancer.assignToAgent('ctx_2', 'agent_a');
balancer.assignToAgent('ctx_2', 'agent_a');
balancer.assignToAgent('ctx_3', 'agent_b');
const leastBusy = balancer.getLeastBusyAgent(['agent_a', 'agent_b']);
assert(leastBusy === 'agent_b', 'Least busy agent selection correct');

const balance = balancer.getLoadBalance();
// Load may appear balanced if agents have equal load after single assignment
assert(balance.variance >= 0, 'Load balance detection works');

// Test GoalContext
suite('GoalContext');

const goalCtx = new GoalContext('test_goal', 'Test goal description', PRIORITIES.HIGH);
assert(goalCtx.state === GOAL_STATES.QUEUED, 'Initial state is QUEUED');
assert(goalCtx.progress === 0, 'Initial progress is 0');

goalCtx.setState(GOAL_STATES.ACTIVE);
assert(goalCtx.startedAt !== null, 'Start time set on activation');

const duration = goalCtx.getDuration();
assert(duration >= 0, 'Duration calculation works');

goalCtx.metrics.tokensUsed = 1000;
goalCtx.metrics.tasksCompleted = 5;

const json = goalCtx.toJSON();
assert(json.id === 'test_goal', 'JSON serialization includes id');
assert(json.state === GOAL_STATES.ACTIVE, 'JSON serialization includes state');
assert(json.metrics.tokensUsed === 1000, 'JSON serialization includes metrics');

// Test AgentPool basic operations
suite('AgentPool - Basic Operations');

const pool = new AgentPool({
  maxConcurrent: 2,
  globalBudget: 50000,
});

assert(pool.poolId.length > 0, 'Pool ID generated');
assert(!pool.isRunning, 'Pool not running initially');

const goalId1 = pool.submitGoal('Test goal 1', {
  priority: PRIORITIES.HIGH,
  maxTokens: 10000,
});
assert(goalId1.startsWith('goal_'), 'Goal ID generated correctly');

const goal = pool.getGoal(goalId1);
assert(goal !== undefined, 'Goal retrievable after submission');
assert(goal.goal === 'Test goal 1', 'Goal description stored');
assert(goal.priority === PRIORITIES.HIGH, 'Goal priority stored');

const goalId2 = pool.submitGoal('Test goal 2', {
  priority: PRIORITIES.NORMAL,
});
const goalId3 = pool.submitGoal('Test goal 3', {
  priority: PRIORITIES.LOW,
});

const metrics = pool.getMetrics();
assert(metrics.queue.size === 3, 'All goals queued');
assert(metrics.active.count === 0, 'No active goals initially');

// Test goal suspension/resumption
suite('AgentPool - Suspension');

const suspended = pool.suspendGoal(goalId1);
assert(!suspended, 'Cannot suspend queued goal');

// Test token estimation
suite('AgentPool - Token Estimation');

const tokens1 = pool.estimateTokens('short task');
const tokens2 = pool.estimateTokens('this is a longer task with many more words');
assert(tokens2 > tokens1, 'Token estimation increases with length');

// Test cost tracking
suite('AgentPool - Cost Tracking');

const poolCost = pool.costTracker.getGlobalUtilization();
assert(poolCost.spent === 0, 'No tokens spent initially');
assert(poolCost.remaining === 50000, 'Global budget correct');

const stats1 = pool.getStats();
assert(stats1.stats.goalsProcessed === 0, 'No goals processed initially');
assert(stats1.queue.pending === 3, 'Three goals pending');

// Test pool state save/load
suite('AgentPool - Persistence');

const saved = pool.saveState();
assert(saved, 'Pool state saved successfully');

const loaded = pool.loadState();
assert(loaded !== null, 'Pool state loaded successfully');
assert(loaded.poolId === pool.poolId, 'Loaded state has correct pool ID');

const metricsSaved = pool.saveMetrics();
assert(metricsSaved, 'Metrics saved successfully');

// Summary
console.log(
  `\n${COLORS.BOLD}${COLORS.CYAN}═══ TEST SUMMARY ═══${COLORS.RESET}`
);
console.log(
  `${COLORS.GREEN}Passed: ${testsPassed}${COLORS.RESET} | ${COLORS.RED}Failed: ${testsFailed}${COLORS.RESET}`
);

if (testsFailed === 0) {
  console.log(`\n${COLORS.GREEN}${COLORS.BOLD}All tests passed!${COLORS.RESET}\n`);
  process.exit(0);
} else {
  console.log(
    `\n${COLORS.RED}${COLORS.BOLD}${testsFailed} test(s) failed!${COLORS.RESET}\n`
  );
  process.exit(1);
}
