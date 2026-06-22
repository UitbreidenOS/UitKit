/**
 * failure-learner-integration-example.js
 *
 * Real-world integration patterns showing how FailureLearner
 * integrates with task execution, agents, and observability.
 */

const FailureLearner = require('./failure-learner');

/**
 * Example 1: Task Executor with Integrated Failure Learning
 */
class TaskExecutorWithLearning {
  constructor() {
    this.learner = new FailureLearner();
  }

  async executeWithRecovery(task) {
    console.log(`\n[TaskExecutor] Executing task: ${task.id}`);

    try {
      // Attempt task
      const result = await this.runTask(task);
      console.log(`✓ Task ${task.id} succeeded`);
      return result;
    } catch (error) {
      // Failure caught — learn and recover
      return await this.recoverFromFailure(task, error);
    }
  }

  async recoverFromFailure(task, error) {
    const failureType = this.categorizeError(error);

    // Record the failure
    const result = this.learner.recordFailure({
      type: failureType,
      message: error.message,
      context: {
        taskId: task.id,
        model: task.model,
        tokens: task.estimatedTokens
      }
    });

    // Surface insight to user
    console.log(`\n[TaskExecutor] ${this.learner.getSurfacedInsight(result.patternId)}`);

    // Attempt recovery strategies in order
    let recovery;
    while ((recovery = this.learner.getNextRecovery(result.patternId))) {
      console.log(
        `\n[TaskExecutor] Recovery attempt ${recovery.attemptNumber}/${recovery.totalStrategies}: ${recovery.strategy}`
      );
      console.log(`[TaskExecutor] Rationale: ${recovery.rationale}`);

      try {
        const modifiedTask = this.applyRecoveryStrategy(task, recovery.strategy, recovery.params);
        const result = await this.runTask(modifiedTask);

        // Mark pattern as resolved
        this.learner.resolvePattern(result.patternId, {
          strategy: recovery.strategy,
          success: true,
          attemptNumber: recovery.attemptNumber,
          notes: 'Task recovered successfully'
        });

        console.log(
          `✓ Task ${task.id} recovered with strategy: ${recovery.strategy}`
        );
        return result;
      } catch (e) {
        console.log(
          `✗ Strategy ${recovery.strategy} failed: ${e.message}`
        );
        // Continue to next strategy
      }
    }

    // All recovery strategies exhausted
    throw new Error(
      `Task ${task.id} failed with ${failureType}. All recovery strategies exhausted.`
    );
  }

  async runTask(task) {
    // Simulate task execution
    if (Math.random() < 0.3) {
      throw new Error('Simulated task failure');
    }
    return { taskId: task.id, result: 'success' };
  }

  categorizeError(error) {
    const message = error.message.toLowerCase();

    if (message.includes('timeout')) return 'timeout';
    if (message.includes('token') || message.includes('limit')) return 'resource_limit';
    if (message.includes('auth') || message.includes('oauth')) return 'auth_failed';
    if (message.includes('validation') || message.includes('schema')) return 'validation_failed';
    if (message.includes('refused')) return 'agent_refusal';
    if (message.includes('format') || message.includes('json')) return 'format_error';
    if (message.includes('tool')) return 'tool_unavailable';

    return 'unknown';
  }

  applyRecoveryStrategy(task, strategy, params) {
    const modified = { ...task };

    switch (strategy) {
      case 'retry_with_increased_timeout':
        modified.timeout = (modified.timeout || 30000) * params.multiplier;
        break;

      case 'break_into_subtasks':
        modified.splitFactor = params.split_factor;
        modified.isSubtask = true;
        break;

      case 'escalate_to_larger_model':
        modified.model = params.model; // Switch to Sonnet
        break;

      case 'switch_to_smaller_model':
        modified.model = 'haiku'; // Use smaller model
        break;

      case 'try_simpler_approach':
        modified.skipAuth = params.skip_auth;
        modified.usePublicEndpoint = true;
        break;

      case 'prune_context':
        modified.contextReduction = params.target_reduction;
        modified.stripSystemPrompt = true;
        break;

      // ... other strategies
    }

    return modified;
  }

  getStats() {
    return this.learner.getStats();
  }
}

/**
 * Example 2: Agent Integration — Failure Recovery Agent
 */
class FailureRecoveryAgent {
  constructor() {
    this.learner = new FailureLearner();
  }

  async handleFailedTask(failedTask, error) {
    console.log(`\n[FailureRecoveryAgent] Analyzing failure for task ${failedTask.id}`);

    const result = this.learner.recordFailure({
      type: this.identifyFailureType(error),
      message: error.message,
      context: {
        taskId: failedTask.id,
        originalAgent: failedTask.delegatedAgent
      }
    });

    const insight = this.learner.getSurfacedInsight(result.patternId);
    console.log(`[FailureRecoveryAgent] Insight: ${insight}`);

    // Check if we've seen this before
    const similar = this.learner.getSimilarFailures(result.failureType);
    if (similar.length > 2) {
      console.log(
        `[FailureRecoveryAgent] Pattern recognized (seen ${similar.length} times). High confidence in recovery.`
      );
    }

    // Get recovery suggestion
    const recovery = this.learner.getNextRecovery(result.patternId);
    if (!recovery) {
      return null; // No recovery available
    }

    return {
      strategy: recovery.strategy,
      params: recovery.params,
      rationale: recovery.rationale,
      confidence: similar.length > 2 ? 'high' : 'low'
    };
  }

  identifyFailureType(error) {
    if (error.code === 'ECONNREFUSED') return 'tool_unavailable';
    if (error.code === 'EACCES') return 'auth_failed';
    if (error.message.includes('validation')) return 'validation_failed';
    return 'unknown';
  }
}

/**
 * Example 3: Observability Integration — Logging Failure Patterns
 */
class FailureAnalytics {
  constructor(learner) {
    this.learner = learner;
  }

  logFailureMetrics() {
    const stats = this.learner.getStats();

    console.log('\n[FailureAnalytics] Failure Report');
    console.log(`  Total failures: ${stats.totalFailures}`);
    console.log(`  Resolved: ${stats.resolved}`);
    console.log(`  Resolution rate: ${((stats.resolved / stats.totalFailures) * 100).toFixed(1)}%`);

    console.log('\n  By type:');
    for (const [type, data] of Object.entries(stats.byType)) {
      if (data.total > 0) {
        const rate = ((data.resolved / data.total) * 100).toFixed(1);
        console.log(
          `    ${type}: ${data.total} failures, ${data.resolved} resolved (${rate}%), ` +
          `avg attempts: ${data.avgRecoveryAttempts.toFixed(2)}`
        );
      }
    }
  }

  identifyBottlenecks() {
    const stats = this.learner.getStats();
    const bottlenecks = [];

    for (const [type, data] of Object.entries(stats.byType)) {
      if (data.total === 0) continue;

      const resolutionRate = data.resolved / data.total;
      const avgAttempts = data.avgRecoveryAttempts;

      if (resolutionRate < 0.5) {
        bottlenecks.push({
          type,
          issue: 'low resolution rate',
          value: `${(resolutionRate * 100).toFixed(1)}%`,
          recommendation: 'Add more recovery strategies or escalate to manual review'
        });
      }

      if (avgAttempts > 2.5) {
        bottlenecks.push({
          type,
          issue: 'many retry attempts needed',
          value: avgAttempts.toFixed(2),
          recommendation: 'Improve first recovery strategy for this type'
        });
      }
    }

    return bottlenecks;
  }
}

/**
 * Example 4: Decision Tree — Use Learner to Make Smarter Decisions
 */
class SmartTaskRouter {
  constructor() {
    this.learner = new FailureLearner();
  }

  async routeTask(task, error) {
    const result = this.learner.recordFailure({
      type: 'auth_failed',
      message: error.message
    });

    const similar = this.learner.getSimilarFailures('auth_failed');

    // If we've successfully recovered from this before, route to simpler approach
    if (similar.length > 1 && similar[0].recoveryAttempts === 1) {
      console.log('[SmartRouter] Using learned path: skip auth and try public endpoint');
      return { skipAuth: true, usePublic: true };
    }

    // Otherwise, escalate to more sophisticated approach
    console.log('[SmartRouter] Using standard recovery: refresh credentials');
    return { refreshCredentials: true };
  }
}

/**
 * Example 5: Demonstration Run
 */
async function runDemonstration() {
  console.log('='.repeat(60));
  console.log('FailureLearner Integration Examples');
  console.log('='.repeat(60));

  // Example 1: Task Executor
  console.log('\n--- Example 1: Task Executor with Learning ---');
  const executor = new TaskExecutorWithLearning();

  const task1 = { id: 'task-001', model: 'haiku', timeout: 5000, estimatedTokens: 2000 };
  try {
    await executor.executeWithRecovery(task1);
  } catch (e) {
    console.log(`\n[TaskExecutor] Final failure: ${e.message}`);
  }

  // Example 2: Failure Recovery Agent
  console.log('\n--- Example 2: Failure Recovery Agent ---');
  const agent = new FailureRecoveryAgent();

  const failedTask = { id: 'api-call', delegatedAgent: 'api-agent' };
  const failureError = new Error('Authentication failed: token expired');
  failureError.code = null;

  const recovery = await agent.handleFailedTask(failedTask, failureError);
  if (recovery) {
    console.log(`[FailureRecoveryAgent] Recommended recovery:`);
    console.log(`  Strategy: ${recovery.strategy}`);
    console.log(`  Confidence: ${recovery.confidence}`);
    console.log(`  Rationale: ${recovery.rationale}`);
  }

  // Example 3: Observability
  console.log('\n--- Example 3: Observability Analytics ---');
  const analytics = new FailureAnalytics(executor.learner);
  analytics.logFailureMetrics();

  const bottlenecks = analytics.identifyBottlenecks();
  if (bottlenecks.length > 0) {
    console.log('\n  Identified bottlenecks:');
    bottlenecks.forEach(b => {
      console.log(`    ${b.type}: ${b.issue} (${b.value})`);
      console.log(`      → ${b.recommendation}`);
    });
  }

  // Example 4: Smart Routing
  console.log('\n--- Example 4: Smart Task Routing ---');
  const router = new SmartTaskRouter();
  const authError = new Error('OAuth token expired');
  const routingDecision = await router.routeTask(task1, authError);
  console.log('Routing decision:', routingDecision);

  console.log('\n' + '='.repeat(60));
}

// Run if called directly
if (require.main === module) {
  runDemonstration().catch(console.error);
}

module.exports = {
  TaskExecutorWithLearning,
  FailureRecoveryAgent,
  FailureAnalytics,
  SmartTaskRouter
};
