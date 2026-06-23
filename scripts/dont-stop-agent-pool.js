#!/usr/bin/env node

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const POOL_DIR = path.join(CLAUDE_DIR, 'agent-pool');
const METRICS_PATH = path.join(POOL_DIR, 'metrics.json');
const POOL_STATE_PATH = path.join(POOL_DIR, 'pool-state.json');

// ANSI Colors
const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  BLUE: '\x1b[34m',
  WHITE: '\x1b[37m',
  RESET: '\x1b[0m',
  DIM: '\x1b[2m',
};

// Goal states
const GOAL_STATES = {
  QUEUED: 'queued',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SUSPENDED: 'suspended',
};

// Priority levels
const PRIORITIES = {
  CRITICAL: 5,
  HIGH: 4,
  NORMAL: 3,
  LOW: 2,
  BACKGROUND: 1,
};

/**
 * Resource quota - tracks per-goal resource limits
 */
class ResourceQuota {
  constructor(maxTokens = 50000, maxDuration = 600000, maxRetries = 3) {
    this.maxTokens = maxTokens;
    this.maxDuration = maxDuration;
    this.maxRetries = maxRetries;
    this.usedTokens = 0;
    this.usedRetries = 0;
    this.startTime = Date.now();
  }

  getRemainingTokens() {
    return Math.max(0, this.maxTokens - this.usedTokens);
  }

  getRemainingDuration() {
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.maxDuration - elapsed);
  }

  getRemainingRetries() {
    return Math.max(0, this.maxRetries - this.usedRetries);
  }

  consumeTokens(count) {
    this.usedTokens += count;
    return this.usedTokens <= this.maxTokens;
  }

  consumeRetry() {
    this.usedRetries++;
    return this.usedRetries <= this.maxRetries;
  }

  isExhausted() {
    return (
      this.usedTokens >= this.maxTokens ||
      this.getRemainingDuration() <= 0 ||
      this.usedRetries >= this.maxRetries
    );
  }

  getUtilization() {
    return {
      tokens: {
        used: this.usedTokens,
        max: this.maxTokens,
        percent: Math.round((this.usedTokens / this.maxTokens) * 100),
      },
      duration: {
        elapsed: Date.now() - this.startTime,
        max: this.maxDuration,
        percent: Math.round(((Date.now() - this.startTime) / this.maxDuration) * 100),
      },
      retries: {
        used: this.usedRetries,
        max: this.maxRetries,
        percent: Math.round((this.usedRetries / this.maxRetries) * 100),
      },
    };
  }
}

/**
 * Goal execution context - encapsulates a single goal's execution
 */
class GoalContext {
  constructor(id, goal, priority = PRIORITIES.NORMAL, quota = null) {
    this.id = id;
    this.goal = goal;
    this.priority = priority;
    this.quota = quota || new ResourceQuota();
    this.state = GOAL_STATES.QUEUED;
    this.createdAt = Date.now();
    this.startedAt = null;
    this.completedAt = null;
    this.result = null;
    this.error = null;
    this.progress = 0;
    this.taskStack = [];
    this.metrics = {
      tokensUsed: 0,
      tasksCompleted: 0,
      tasksFailed: 0,
      retries: 0,
    };
    this.isolationLevel = 'standard'; // standard, strict, relaxed
    this.resourceLimits = {
      cpu: 1.0, // CPU share (0-1)
      memory: 512, // MB
      fileHandles: 100,
    };
  }

  setState(newState) {
    const oldState = this.state;
    this.state = newState;

    if (newState === GOAL_STATES.ACTIVE && !this.startedAt) {
      this.startedAt = Date.now();
    } else if (
      (newState === GOAL_STATES.COMPLETED || newState === GOAL_STATES.FAILED) &&
      !this.completedAt
    ) {
      this.completedAt = Date.now();
    }

    return { oldState, newState };
  }

  getDuration() {
    if (!this.startedAt) return 0;
    const end = this.completedAt || Date.now();
    return end - this.startedAt;
  }

  toJSON() {
    return {
      id: this.id,
      goal: this.goal,
      priority: this.priority,
      state: this.state,
      progress: this.progress,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      duration: this.getDuration(),
      metrics: this.metrics,
      quota: this.quota.getUtilization(),
      result: this.result,
      error: this.error ? this.error.message : null,
    };
  }
}

/**
 * Priority queue for goal scheduling
 */
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(goalContext) {
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (goalContext.priority > this.items[i].priority) {
        this.items.splice(i, 0, goalContext);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(goalContext);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  remove(goalId) {
    const index = this.items.findIndex((g) => g.id === goalId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  getLength() {
    return this.items.length;
  }

  toJSON() {
    return this.items.map((g) => ({
      id: g.id,
      goal: g.goal,
      priority: g.priority,
      state: g.state,
    }));
  }
}

/**
 * Cost tracker - monitors token spend and budgets
 */
class CostTracker {
  constructor(globalBudget = 1000000) {
    this.globalBudget = globalBudget;
    this.globalSpent = 0;
    this.goalCosts = new Map();
    this.history = [];
  }

  recordCost(goalId, tokens, metadata = {}) {
    const entry = {
      timestamp: Date.now(),
      goalId,
      tokens,
      metadata,
      cumulativeGlobal: this.globalSpent + tokens,
    };

    this.globalSpent += tokens;
    this.history.push(entry);

    if (!this.goalCosts.has(goalId)) {
      this.goalCosts.set(goalId, 0);
    }
    this.goalCosts.set(goalId, this.goalCosts.get(goalId) + tokens);
  }

  getGoalCost(goalId) {
    return this.goalCosts.get(goalId) || 0;
  }

  getGlobalRemaining() {
    return Math.max(0, this.globalBudget - this.globalSpent);
  }

  getGlobalUtilization() {
    return {
      spent: this.globalSpent,
      budget: this.globalBudget,
      remaining: this.getGlobalRemaining(),
      percent: Math.round((this.globalSpent / this.globalBudget) * 100),
    };
  }

  isWithinBudget() {
    return this.globalSpent < this.globalBudget;
  }

  getTopCosts(limit = 10) {
    return Array.from(this.goalCosts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([goalId, cost]) => ({ goalId, cost }));
  }
}

/**
 * Workload balancer - distributes load across agents
 */
class WorkloadBalancer {
  constructor(maxConcurrent = 4) {
    this.maxConcurrent = maxConcurrent;
    this.activeGoals = new Map(); // goalId -> GoalContext
    this.agentLoad = new Map(); // agentId -> currentLoad
  }

  canAddGoal() {
    return this.activeGoals.size < this.maxConcurrent;
  }

  addActiveGoal(goalContext) {
    if (!this.canAddGoal()) {
      return false;
    }
    this.activeGoals.set(goalContext.id, goalContext);
    return true;
  }

  removeActiveGoal(goalId) {
    return this.activeGoals.delete(goalId);
  }

  getActiveGoals() {
    return Array.from(this.activeGoals.values());
  }

  getActiveCount() {
    return this.activeGoals.size;
  }

  getAvailableSlots() {
    return Math.max(0, this.maxConcurrent - this.activeGoals.size);
  }

  assignToAgent(goalId, agentId) {
    const current = this.agentLoad.get(agentId) || 0;
    this.agentLoad.set(agentId, current + 1);
  }

  releaseFromAgent(agentId) {
    const current = this.agentLoad.get(agentId) || 0;
    if (current > 0) {
      this.agentLoad.set(agentId, current - 1);
    }
  }

  getLeastBusyAgent(availableAgents) {
    if (availableAgents.length === 0) return null;
    return availableAgents.reduce((min, agentId) => {
      const minLoad = this.agentLoad.get(min) || 0;
      const agentLoadVal = this.agentLoad.get(agentId) || 0;
      return agentLoadVal < minLoad ? agentId : min;
    });
  }

  getLoadBalance() {
    const loads = Array.from(this.agentLoad.entries());
    const avg = loads.reduce((sum, [_, load]) => sum + load, 0) / Math.max(1, loads.length);
    const variance =
      loads.reduce((sum, [_, load]) => sum + Math.pow(load - avg, 2), 0) /
      Math.max(1, loads.length);
    return {
      agents: Object.fromEntries(loads),
      average: avg,
      variance: variance,
      balanced: variance < 1.0,
    };
  }
}

/**
 * Agent pool manager - orchestrates concurrent goal execution
 */
class AgentPool extends EventEmitter {
  constructor(options = {}) {
    super();
    this.poolId = crypto.randomBytes(8).toString('hex');
    this.maxConcurrent = options.maxConcurrent || 4;
    this.globalBudget = options.globalBudget || 1000000;
    this.defaultQuota = options.defaultQuota || new ResourceQuota(50000, 600000, 3);
    this.options = options;

    this.queue = new PriorityQueue();
    this.balancer = new WorkloadBalancer(this.maxConcurrent);
    this.costTracker = new CostTracker(this.globalBudget);
    this.allGoals = new Map(); // goalId -> GoalContext
    this.agents = new Map(); // agentId -> agent metadata

    this.isRunning = false;
    this.createdAt = Date.now();
    this.stats = {
      goalsProcessed: 0,
      goalsSuccessful: 0,
      goalsFailed: 0,
      totalDuration: 0,
      totalTokensSpent: 0,
    };

    this.initDirs();
  }

  initDirs() {
    if (!fs.existsSync(POOL_DIR)) {
      fs.mkdirSync(POOL_DIR, { recursive: true });
    }
  }

  /**
   * Submit a goal to the pool
   */
  submitGoal(goal, options = {}) {
    const goalId = `goal_${crypto.randomBytes(6).toString('hex')}`;
    const priority = options.priority || PRIORITIES.NORMAL;
    const quota =
      options.quota ||
      new ResourceQuota(
        options.maxTokens || 50000,
        options.maxDuration || 600000,
        options.maxRetries || 3
      );

    const goalContext = new GoalContext(goalId, goal, priority, quota);

    if (options.isolationLevel) {
      goalContext.isolationLevel = options.isolationLevel;
    }

    if (options.resourceLimits) {
      goalContext.resourceLimits = { ...goalContext.resourceLimits, ...options.resourceLimits };
    }

    this.allGoals.set(goalId, goalContext);
    this.queue.enqueue(goalContext);

    this.emit('goal-submitted', {
      goalId,
      goal,
      priority,
      queueSize: this.queue.getLength(),
    });

    return goalId;
  }

  /**
   * Get goal context
   */
  getGoal(goalId) {
    return this.allGoals.get(goalId);
  }

  /**
   * Start the pool - main execution loop
   */
  async start() {
    if (this.isRunning) {
      throw new Error('Pool is already running');
    }

    this.isRunning = true;
    this.emit('pool-started', { poolId: this.poolId, maxConcurrent: this.maxConcurrent });

    try {
      while (this.isRunning) {
        // Check if we can accept more goals
        if (
          this.balancer.canAddGoal() &&
          !this.queue.isEmpty() &&
          this.costTracker.isWithinBudget()
        ) {
          const nextGoal = this.queue.dequeue();
          await this.executeGoal(nextGoal);
        }

        // Check if all goals are done
        if (this.queue.isEmpty() && this.balancer.getActiveCount() === 0) {
          break;
        }

        // Brief pause to allow async operations
        await this.sleep(100);
      }
    } finally {
      this.isRunning = false;
      this.emit('pool-completed', {
        stats: this.getStats(),
      });
    }
  }

  /**
   * Execute a single goal
   */
  async executeGoal(goalContext) {
    goalContext.setState(GOAL_STATES.ACTIVE);
    this.balancer.addActiveGoal(goalContext);

    this.emit('goal-started', {
      goalId: goalContext.id,
      goal: goalContext.goal,
      priority: goalContext.priority,
    });

    try {
      // Simulate goal execution with resource tracking
      const result = await this.runGoalWithResourceTracking(goalContext);

      goalContext.result = result;
      goalContext.setState(GOAL_STATES.COMPLETED);

      this.stats.goalsSuccessful++;
      this.stats.totalDuration += goalContext.getDuration();

      this.emit('goal-completed', {
        goalId: goalContext.id,
        result: result,
        duration: goalContext.getDuration(),
        metrics: goalContext.metrics,
      });
    } catch (error) {
      goalContext.error = error;
      goalContext.setState(GOAL_STATES.FAILED);

      this.stats.goalsFailed++;

      this.emit('goal-failed', {
        goalId: goalContext.id,
        error: error.message,
        duration: goalContext.getDuration(),
      });
    } finally {
      this.stats.goalsProcessed++;
      this.balancer.removeActiveGoal(goalContext.id);
    }
  }

  /**
   * Run goal with resource quota enforcement
   */
  async runGoalWithResourceTracking(goalContext) {
    const quota = goalContext.quota;
    let retryCount = 0;
    let lastError = null;

    while (retryCount <= quota.maxRetries) {
      if (quota.isExhausted()) {
        throw new Error(
          `Goal resource quota exhausted: tokens=${quota.usedTokens}, retries=${quota.usedRetries}`
        );
      }

      try {
        // Simulate token consumption based on goal complexity
        const estimatedTokens = this.estimateTokens(goalContext.goal);

        if (!quota.consumeTokens(estimatedTokens)) {
          throw new Error(`Insufficient token budget (need ${estimatedTokens})`);
        }

        this.costTracker.recordCost(goalContext.id, estimatedTokens, {
          goal: goalContext.goal,
          attempt: retryCount + 1,
        });

        goalContext.metrics.tokensUsed += estimatedTokens;
        goalContext.metrics.tasksCompleted++;
        goalContext.progress = Math.min(100, goalContext.progress + 25);

        // Simulate execution delay
        await this.sleep(Math.random() * 500 + 100);

        // Random failure for testing retry logic
        if (Math.random() < 0.1) {
          throw new Error('Simulated execution failure');
        }

        return {
          goalId: goalContext.id,
          status: 'completed',
          output: `Successfully executed: ${goalContext.goal}`,
          tokensUsed: estimatedTokens,
          duration: goalContext.getDuration(),
        };
      } catch (error) {
        lastError = error;
        goalContext.metrics.tasksFailed++;

        if (quota.consumeRetry()) {
          goalContext.metrics.retries++;
          retryCount++;

          const backoffMs = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
          this.emit('goal-retry', {
            goalId: goalContext.id,
            attempt: retryCount,
            error: error.message,
            backoffMs,
          });

          await this.sleep(backoffMs);
        } else {
          throw new Error(`Goal failed after ${quota.maxRetries} retries: ${error.message}`);
        }
      }
    }

    throw lastError || new Error('Goal execution failed');
  }

  /**
   * Estimate tokens for a goal
   */
  estimateTokens(goal) {
    // Simple heuristic: ~150 tokens per word
    const words = goal.split(/\s+/).length;
    return Math.ceil(words * 150);
  }

  /**
   * Stop the pool gracefully
   */
  async stop() {
    this.isRunning = false;

    // Wait for active goals to complete (with timeout)
    const timeout = 30000;
    const startTime = Date.now();

    while (this.balancer.getActiveCount() > 0) {
      if (Date.now() - startTime > timeout) {
        this.emit('pool-force-stopped', {
          activeGoals: this.balancer.getActiveCount(),
        });
        break;
      }
      await this.sleep(100);
    }
  }

  /**
   * Suspend a goal
   */
  suspendGoal(goalId) {
    const goal = this.getGoal(goalId);
    if (goal && goal.state === GOAL_STATES.ACTIVE) {
      goal.setState(GOAL_STATES.SUSPENDED);
      this.emit('goal-suspended', { goalId });
      return true;
    }
    return false;
  }

  /**
   * Resume a suspended goal
   */
  resumeGoal(goalId) {
    const goal = this.getGoal(goalId);
    if (goal && goal.state === GOAL_STATES.SUSPENDED) {
      goal.setState(GOAL_STATES.QUEUED);
      this.queue.enqueue(goal);
      this.emit('goal-resumed', { goalId });
      return true;
    }
    return false;
  }

  /**
   * Get pool metrics
   */
  getMetrics() {
    return {
      poolId: this.poolId,
      isRunning: this.isRunning,
      createdAt: this.createdAt,
      stats: this.stats,
      queue: {
        size: this.queue.getLength(),
        jobs: this.queue.toJSON(),
      },
      active: {
        count: this.balancer.getActiveCount(),
        availableSlots: this.balancer.getAvailableSlots(),
        goals: this.balancer.getActiveGoals().map((g) => g.toJSON()),
      },
      cost: this.costTracker.getGlobalUtilization(),
      topCosts: this.costTracker.getTopCosts(5),
      loadBalance: this.balancer.getLoadBalance(),
      allGoals: Array.from(this.allGoals.values()).map((g) => g.toJSON()),
    };
  }

  /**
   * Get statistics
   */
  getStats() {
    const uptime = Date.now() - this.createdAt;
    return {
      poolId: this.poolId,
      uptime,
      isRunning: this.isRunning,
      stats: this.stats,
      cost: this.costTracker.getGlobalUtilization(),
      queue: {
        pending: this.queue.getLength(),
        active: this.balancer.getActiveCount(),
      },
    };
  }

  /**
   * Save pool state to disk
   */
  saveState() {
    const state = {
      timestamp: new Date().toISOString(),
      poolId: this.poolId,
      metrics: this.getMetrics(),
    };

    try {
      fs.writeFileSync(POOL_STATE_PATH, JSON.stringify(state, null, 2));
      return true;
    } catch (error) {
      this.emit('error', { message: `Failed to save pool state: ${error.message}` });
      return false;
    }
  }

  /**
   * Load pool state from disk
   */
  loadState() {
    try {
      if (fs.existsSync(POOL_STATE_PATH)) {
        const data = fs.readFileSync(POOL_STATE_PATH, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      this.emit('error', { message: `Failed to load pool state: ${error.message}` });
    }
    return null;
  }

  /**
   * Save metrics to disk
   */
  saveMetrics() {
    const metrics = this.getMetrics();
    try {
      fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2));
      return true;
    } catch (error) {
      this.emit('error', { message: `Failed to save metrics: ${error.message}` });
      return false;
    }
  }

  /**
   * Utility: sleep
   */
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * CLI interface and demo
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${COLORS.BOLD}dont-stop-agent-pool${COLORS.RESET} — Concurrent goal execution with resource isolation

${COLORS.BOLD}Usage:${COLORS.RESET}
  node dont-stop-agent-pool.js [command] [options]

${COLORS.BOLD}Commands:${COLORS.RESET}
  demo              Run interactive demo with sample goals
  metrics           Show current pool metrics
  help              Show this help message

${COLORS.BOLD}Options:${COLORS.RESET}
  --max-concurrent=N    Maximum concurrent goals (default: 4)
  --global-budget=N     Global token budget (default: 1000000)
  --verbose             Enable verbose logging

${COLORS.BOLD}Examples:${COLORS.RESET}
  node dont-stop-agent-pool.js demo
  node dont-stop-agent-pool.js demo --max-concurrent=8
    `);
    return;
  }

  if (args[0] === 'demo') {
    const maxConcurrent = args.includes('--max-concurrent')
      ? parseInt(args[args.indexOf('--max-concurrent') + 1], 10)
      : 4;

    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}╔════════════════════════════════════════════════════════════════╗${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}║${COLORS.RESET}  ${COLORS.BOLD}${COLORS.MAGENTA}DON'T STOP AGENT POOL${COLORS.RESET}${COLORS.BOLD}${COLORS.CYAN}                               ║${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}║${COLORS.RESET}  Concurrent Goal Execution with Resource Isolation${COLORS.BOLD}${COLORS.CYAN}             ║${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}╚════════════════════════════════════════════════════════════════╝${COLORS.RESET}\n`
    );

    const pool = new AgentPool({
      maxConcurrent,
      globalBudget: 500000,
    });

    // Set up event listeners
    pool.on('goal-submitted', (event) => {
      console.log(
        `${COLORS.GREEN}[+]${COLORS.RESET} Goal submitted: ${COLORS.CYAN}${event.goalId}${COLORS.RESET} | Queue: ${event.queueSize}`
      );
    });

    pool.on('goal-started', (event) => {
      console.log(
        `${COLORS.BLUE}[→]${COLORS.RESET} Goal started: ${COLORS.YELLOW}${event.goal.substring(0, 50)}...${COLORS.RESET}`
      );
    });

    pool.on('goal-completed', (event) => {
      console.log(
        `${COLORS.GREEN}[✓]${COLORS.RESET} Goal completed in ${event.duration}ms | Tokens: ${event.metrics.tokensUsed}`
      );
    });

    pool.on('goal-failed', (event) => {
      console.log(`${COLORS.RED}[✗]${COLORS.RESET} Goal failed: ${event.error}`);
    });

    pool.on('goal-retry', (event) => {
      console.log(
        `${COLORS.YELLOW}[⟳]${COLORS.RESET} Goal retry attempt ${event.attempt}: ${event.error}`
      );
    });

    // Submit sample goals
    const sampleGoals = [
      { goal: 'validate project structure and dependencies', priority: PRIORITIES.HIGH },
      { goal: 'run unit tests for core modules', priority: PRIORITIES.NORMAL },
      { goal: 'build production artifacts', priority: PRIORITIES.NORMAL },
      { goal: 'generate API documentation', priority: PRIORITIES.LOW },
      { goal: 'run integration tests', priority: PRIORITIES.NORMAL },
      { goal: 'deploy to staging environment', priority: PRIORITIES.HIGH },
      { goal: 'run smoke tests on staging', priority: PRIORITIES.NORMAL },
      { goal: 'generate performance report', priority: PRIORITIES.LOW },
    ];

    console.log(`${COLORS.CYAN}[*] Submitting ${sampleGoals.length} goals to the pool...${COLORS.RESET}\n`);

    sampleGoals.forEach((item, idx) => {
      setTimeout(() => {
        pool.submitGoal(item.goal, {
          priority: item.priority,
          maxTokens: 50000,
          maxDuration: 120000,
          maxRetries: 2,
        });
      }, idx * 100); // Stagger submissions
    });

    // Start the pool
    setTimeout(async () => {
      await pool.start();

      console.log(`\n${COLORS.BOLD}${COLORS.GREEN}═══ POOL EXECUTION COMPLETE ═══${COLORS.RESET}\n`);

      const metrics = pool.getMetrics();
      console.log(`${COLORS.CYAN}Pool ID:${COLORS.RESET} ${metrics.poolId}`);
      console.log(`${COLORS.CYAN}Total Goals:${COLORS.RESET} ${metrics.stats.goalsProcessed}`);
      console.log(`${COLORS.GREEN}Successful:${COLORS.RESET} ${metrics.stats.goalsSuccessful}`);
      console.log(`${COLORS.RED}Failed:${COLORS.RESET} ${metrics.stats.goalsFailed}`);
      console.log(
        `${COLORS.CYAN}Total Duration:${COLORS.RESET} ${(metrics.stats.totalDuration / 1000).toFixed(2)}s`
      );
      console.log(
        `${COLORS.CYAN}Tokens Used:${COLORS.RESET} ${metrics.cost.spent} / ${metrics.cost.budget} (${metrics.cost.percent}%)`
      );
      console.log(`${COLORS.CYAN}Load Balance:${COLORS.RESET} Variance = ${metrics.loadBalance.variance.toFixed(2)}`);

      console.log(`\n${COLORS.CYAN}Top Costs (by goal):${COLORS.RESET}`);
      metrics.topCosts.forEach((cost, idx) => {
        console.log(`  ${idx + 1}. ${cost.goalId}: ${cost.cost} tokens`);
      });

      pool.saveMetrics();
      pool.saveState();
      console.log(
        `\n${COLORS.GREEN}✓${COLORS.RESET} Metrics saved to ${COLORS.DIM}${METRICS_PATH}${COLORS.RESET}`
      );
    }, 500);
  } else {
    // Default to demo
    process.argv.push('demo');
    main();
  }
}

// Export classes for programmatic use
module.exports = {
  AgentPool,
  GoalContext,
  ResourceQuota,
  PriorityQueue,
  CostTracker,
  WorkloadBalancer,
  GOAL_STATES,
  PRIORITIES,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  });
}
