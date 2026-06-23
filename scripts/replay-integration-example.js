#!/usr/bin/env node

/**
 * Integration Example: Replay with dont-stop-agent-pool
 *
 * Shows how to use ExecutionRecorder to capture execution traces
 * from agent pool execution and then replay them for debugging.
 */

const { AgentPool, PRIORITIES } = require('./dont-stop-agent-pool');
const {
  ExecutionRecorder,
  ExecutionReplayer,
} = require('./execution-replay');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  DIM: '\x1b[2m',
};

class ReplayableAgentPool extends AgentPool {
  constructor(options = {}) {
    super(options);
    this.recorder = new ExecutionRecorder();
    this.currentGoalRecording = null;
  }

  /**
   * Override executeGoal to capture execution
   */
  async executeGoal(goalContext) {
    // Start recording this goal's execution
    const trace = this.recorder.startTrace(goalContext.id, this.poolId);
    this.currentGoalRecording = trace;

    // Record initial state
    this.recorder.recordStateChange(null, goalContext.state, {
      priority: goalContext.priority,
      isolationLevel: goalContext.isolationLevel,
    });

    try {
      goalContext.setState('active');
      this.balancer.addActiveGoal(goalContext);

      this.emit('goal-started', {
        goalId: goalContext.id,
        goal: goalContext.goal,
        priority: goalContext.priority,
      });

      // Record decision: attempting execution
      this.recorder.recordDecision('execute_goal', {
        goal: goalContext.goal,
        quota: goalContext.quota.getUtilization(),
      });

      const result = await this.runGoalWithResourceTrackingReplaying(goalContext);

      goalContext.result = result;
      goalContext.setState('completed');

      // Record successful completion
      this.recorder.recordDecision('execution_success', {}, 'completed');
      this.recorder.recordMetric('tokens_used', goalContext.metrics.tokensUsed);

      this.stats.goalsSuccessful++;
      this.stats.totalDuration += goalContext.getDuration();

      this.emit('goal-completed', {
        goalId: goalContext.id,
        result: result,
        duration: goalContext.getDuration(),
        metrics: goalContext.metrics,
      });

      // End and save trace
      this.recorder.endTrace('completed', result);
      this.recorder.saveTrace(trace.traceId);

      console.log(
        `${COLORS.GREEN}[Replay]${COLORS.RESET} Trace saved: ${COLORS.DIM}${trace.traceId}${COLORS.RESET}`
      );
    } catch (error) {
      goalContext.error = error;
      goalContext.setState('failed');

      // Record error in trace
      this.recorder.recordError(error, {
        goalId: goalContext.id,
        task: goalContext.goal,
      });

      this.stats.goalsFailed++;

      this.emit('goal-failed', {
        goalId: goalContext.id,
        error: error.message,
        duration: goalContext.getDuration(),
      });

      // Save failed trace
      this.recorder.endTrace('failed', null, error);
      this.recorder.saveTrace(trace.traceId);
    } finally {
      this.stats.goalsProcessed++;
      this.balancer.removeActiveGoal(goalContext.id);
      this.currentGoalRecording = null;
    }
  }

  /**
   * Execution with detailed replay recording
   */
  async runGoalWithResourceTrackingReplaying(goalContext) {
    const quota = goalContext.quota;
    let retryCount = 0;
    let lastError = null;

    while (retryCount <= quota.maxRetries) {
      // Record resource check
      const utilization = quota.getUtilization();
      this.recorder.recordResourceCheck(
        'tokens',
        utilization.tokens.used,
        utilization.tokens.max
      );

      if (quota.isExhausted()) {
        const err = new Error(
          `Goal resource quota exhausted: tokens=${quota.usedTokens}, retries=${quota.usedRetries}`
        );
        this.recorder.recordError(err, { stage: 'quota_check' });
        throw err;
      }

      try {
        // Simulate token consumption
        const estimatedTokens = this.estimateTokens(goalContext.goal);

        this.recorder.recordDecision('check_token_budget', {
          required: estimatedTokens,
          available: quota.getRemainingTokens(),
        });

        if (!quota.consumeTokens(estimatedTokens)) {
          throw new Error(`Insufficient token budget (need ${estimatedTokens})`);
        }

        this.recorder.recordMetric('tokens_consumed', estimatedTokens);
        this.costTracker.recordCost(goalContext.id, estimatedTokens, {
          goal: goalContext.goal,
          attempt: retryCount + 1,
        });

        goalContext.metrics.tokensUsed += estimatedTokens;
        goalContext.metrics.tasksCompleted++;
        goalContext.progress = Math.min(100, goalContext.progress + 25);

        this.recorder.recordMetric('progress', goalContext.progress);

        // Simulate execution delay
        await this.sleep(Math.random() * 500 + 100);

        // Simulate potential failure for retry testing
        if (Math.random() < 0.08) {
          throw new Error('Simulated execution failure');
        }

        this.recorder.recordDecision('execution_complete', {}, 'success');

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

        this.recorder.recordError(error, {
          attempt: retryCount + 1,
          stage: 'execution',
        });

        if (quota.consumeRetry()) {
          goalContext.metrics.retries++;
          retryCount++;

          const backoffMs = Math.min(
            1000 * Math.pow(2, retryCount - 1),
            10000
          );

          this.recorder.recordDecision('retry_scheduled', {
            attempt: retryCount,
            backoffMs,
            error: error.message,
          });

          this.emit('goal-retry', {
            goalId: goalContext.id,
            attempt: retryCount,
            error: error.message,
            backoffMs,
          });

          await this.sleep(backoffMs);
        } else {
          const finalErr = new Error(
            `Goal failed after ${quota.maxRetries} retries: ${error.message}`
          );
          this.recorder.recordError(finalErr, { exhausted: true });
          throw finalErr;
        }
      }
    }

    throw lastError || new Error('Goal execution failed');
  }
}

/**
 * Demo: Execute pool with replay capture
 */
async function demo() {
  console.log(
    `${COLORS.BOLD}${COLORS.CYAN}╔════════════════════════════════════════════════╗${COLORS.RESET}`
  );
  console.log(
    `${COLORS.BOLD}${COLORS.CYAN}║${COLORS.RESET}  ${COLORS.BOLD}Agent Pool with Execution Replay${COLORS.RESET}${COLORS.BOLD}${COLORS.CYAN}         ║${COLORS.RESET}`
  );
  console.log(
    `${COLORS.BOLD}${COLORS.CYAN}╚════════════════════════════════════════════════╝${COLORS.RESET}\n`
  );

  const pool = new ReplayableAgentPool({
    maxConcurrent: 2,
    globalBudget: 200000,
  });

  // Listen to pool events
  pool.on('goal-completed', (event) => {
    console.log(
      `${COLORS.GREEN}[✓]${COLORS.RESET} ${event.goalId} completed in ${event.duration}ms`
    );
  });

  pool.on('goal-failed', (event) => {
    console.log(
      `${COLORS.RED}[✗]${COLORS.RESET} ${event.goalId} failed: ${event.error}`
    );
  });

  // Submit test goals
  const goals = [
    'validate project structure',
    'run unit tests',
    'build production artifacts',
    'generate documentation',
  ];

  console.log(`${COLORS.CYAN}[*] Submitting ${goals.length} goals...${COLORS.RESET}\n`);

  goals.forEach((goal, idx) => {
    setTimeout(() => {
      pool.submitGoal(goal, {
        priority: PRIORITIES.NORMAL,
        maxTokens: 50000,
        maxDuration: 120000,
        maxRetries: 2,
      });
    }, idx * 50);
  });

  // Start pool execution
  await pool.start();

  console.log(`\n${COLORS.BOLD}${COLORS.GREEN}Pool execution complete${COLORS.RESET}\n`);

  // Show recorded traces
  const traces = pool.recorder.listTraces();
  console.log(`${COLORS.CYAN}Recorded traces: ${traces.length}${COLORS.RESET}`);

  if (traces.length > 0) {
    const firstTrace = traces[0];
    const data = pool.recorder.loadTrace(firstTrace);

    console.log(`\n${COLORS.YELLOW}Inspecting first trace: ${firstTrace}${COLORS.RESET}`);
    console.log(`  ${COLORS.DIM}Goal:${COLORS.RESET} ${data.goalId}`);
    console.log(`  ${COLORS.DIM}Status:${COLORS.RESET} ${data.status}`);
    console.log(`  ${COLORS.DIM}Duration:${COLORS.RESET} ${data.duration}ms`);
    console.log(`  ${COLORS.DIM}Frames:${COLORS.RESET} ${data.frameCount}`);
    console.log(`  ${COLORS.DIM}Decisions:${COLORS.RESET} ${data.decisionCount}`);

    // Create replayer for first trace
    const { ExecutionTrace } = require('./execution-replay');
    const trace = new ExecutionTrace(data.goalId, data.poolId);
    trace.traceId = firstTrace;
    trace.startTime = data.startTime;
    trace.endTime = data.endTime;
    trace.status = data.status;
    trace.frames = data.frames || [];

    const replayer = new ExecutionReplayer(trace);

    console.log(`\n${COLORS.YELLOW}Execution Flow:${COLORS.RESET}`);
    const decisions = replayer.getDecisionPath();
    decisions.forEach((d, idx) => {
      const result = d.result ? ` ${COLORS.GREEN}→${COLORS.RESET} ${d.result}` : '';
      console.log(`  ${idx + 1}. ${COLORS.BLUE}${d.decision}${COLORS.RESET}${result}`);
    });

    const errors = replayer.getErrorTrace();
    if (errors.length > 0) {
      console.log(`\n${COLORS.RED}Errors Encountered:${COLORS.RESET}`);
      errors.forEach((e, idx) => {
        console.log(`  ${idx + 1}. ${e.error}`);
      });
    }
  }

  console.log(
    `\n${COLORS.DIM}To replay a trace interactively:${COLORS.RESET}`
  );
  if (traces.length > 0) {
    console.log(`  ${COLORS.CYAN}node execution-replay.js replay ${traces[0]}${COLORS.RESET}`);
  }
}

// Run demo
if (require.main === module) {
  demo().catch((error) => {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  });
}

module.exports = { ReplayableAgentPool };
