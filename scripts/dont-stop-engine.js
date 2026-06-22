#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const ENGINE_LOG_PATH = path.join(CLAUDE_DIR, 'engine-execution.md');
const CHECKPOINT_PATH = path.join(CLAUDE_DIR, 'engine-checkpoint.json');

// ANSI Colors
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

// Circuit breaker states
const CIRCUIT_STATES = {
  CLOSED: 'closed',
  OPEN: 'open',
  HALF_OPEN: 'half_open'
};

// Engine configuration
const CONFIG = {
  maxRetries: 3,
  initialBackoffMs: 500,
  maxBackoffMs: 30000,
  circuitBreakerThreshold: 5,
  circuitBreakerResetMs: 60000,
  taskTimeoutMs: 300000,
  validateInterval: 2000,
  checkpointFrequency: 5
};

/**
 * Task DAG Builder - Parses goal string into dependency graph
 */
class TaskDAGBuilder {
  constructor(goalString) {
    this.goal = goalString;
    this.tasks = [];
    this.taskMap = new Map();
  }

  parse() {
    // Extract tasks from goal string using pattern matching
    // Patterns: "do X, then Y, then Z" or "X (depends on Y)" or "X -> Y -> Z"

    const taskStrings = this._extractTasks();
    const dag = this._buildDependencies(taskStrings);
    return dag;
  }

  _extractTasks() {
    // Match: "Task1, then Task2" or "Task1 -> Task2" or semicolon-separated
    let parts = this.goal
      .split(/[,;]|->|\|\||then\s+/gi)
      .map(p => p.trim())
      .filter(p => p.length > 0 && p !== 'then');

    // Handle empty result - parse goal as single task
    if (parts.length === 0) {
      parts = [this.goal];
    }

    return parts.map((part, idx) => ({
      id: `task_${idx}`,
      title: part.trim(),
      index: idx
    }));
  }

  _buildDependencies(taskStrings) {
    const tasks = taskStrings.map((t, idx) => {
      const taskObj = {
        id: t.id,
        title: t.title,
        priority: taskStrings.length - idx,
        dependencies: idx === 0 ? [] : [taskStrings[idx - 1].id],
        retries: 0,
        status: 'pending',
        result: null,
        error: null,
        startTime: null,
        endTime: null
      };
      this.taskMap.set(t.id, taskObj);
      return taskObj;
    });

    return { tasks, goal: this.goal };
  }

  getTaskDAG() {
    return {
      goal: this.goal,
      tasks: Array.from(this.taskMap.values()),
      taskMap: this.taskMap
    };
  }
}

/**
 * Execution engine with retry & circuit breaker logic
 */
class ExecutionEngine {
  constructor(config = {}) {
    this.config = { ...CONFIG, ...config };
    this.circuitBreaker = {
      state: CIRCUIT_STATES.CLOSED,
      failureCount: 0,
      lastFailureTime: null,
      successCount: 0
    };
    this.executionLog = [];
    this.results = new Map();
  }

  async executeTask(task) {
    const taskExecution = {
      taskId: task.id,
      title: task.title,
      attempts: [],
      status: 'pending'
    };

    task.startTime = Date.now();

    // Circuit breaker check
    if (!this._isCircuitAllowingExecution()) {
      const error = `Circuit breaker OPEN: Too many failures. Backing off.`;
      console.log(`${RED}✗${RESET} [${task.id}] ${error}`);
      return this._buildTaskResult(task, null, new Error(error), taskExecution);
    }

    // Retry loop with exponential backoff
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      const attemptLog = {
        attempt: attempt + 1,
        startTime: Date.now(),
        error: null,
        result: null
      };

      try {
        // Timeout wrapper
        const result = await Promise.race([
          this._executeTaskLogic(task),
          this._createTimeout(this.config.taskTimeoutMs)
        ]);

        attemptLog.result = result;
        attemptLog.endTime = Date.now();
        taskExecution.attempts.push(attemptLog);
        taskExecution.status = 'success';

        // Reset circuit breaker on success
        this.circuitBreaker.failureCount = 0;
        this.circuitBreaker.successCount++;
        this.circuitBreaker.state = CIRCUIT_STATES.CLOSED;

        console.log(`${GREEN}✓${RESET} [${task.id}] Completed on attempt ${attempt + 1}`);
        return this._buildTaskResult(task, result, null, taskExecution);

      } catch (error) {
        attemptLog.error = error.message;
        attemptLog.endTime = Date.now();
        taskExecution.attempts.push(attemptLog);

        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = Date.now();

        // Exponential backoff
        if (attempt < this.config.maxRetries - 1) {
          const backoffMs = Math.min(
            this.config.initialBackoffMs * Math.pow(2, attempt),
            this.config.maxBackoffMs
          );
          const jitter = Math.random() * backoffMs * 0.1; // 10% jitter

          console.log(`${YELLOW}⟳${RESET} [${task.id}] Attempt ${attempt + 1} failed. Retrying in ${backoffMs}ms...`);
          await this._sleep(backoffMs + jitter);
        } else {
          console.log(`${RED}✗${RESET} [${task.id}] All ${this.config.maxRetries} attempts exhausted.`);
          taskExecution.status = 'failed';
        }
      }
    }

    const finalError = new Error(`Task exhausted all retry attempts: ${task.title}`);
    return this._buildTaskResult(task, null, finalError, taskExecution);
  }

  async _executeTaskLogic(task) {
    // Simulate task execution (override in subclass or via plugin)
    // In production, this would execute actual goal-oriented logic

    // Heuristic: success likelihood based on task complexity
    const complexity = task.title.split(' ').length;
    const successRate = Math.max(0.3, 1 - (complexity * 0.05));

    if (Math.random() > successRate) {
      throw new Error(`Task failed: ${task.title}`);
    }

    return {
      taskId: task.id,
      output: `Successfully executed: ${task.title}`,
      timestamp: new Date().toISOString()
    };
  }

  async _createTimeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Task timeout after ${ms}ms`)), ms)
    );
  }

  async _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _isCircuitAllowingExecution() {
    const now = Date.now();

    if (this.circuitBreaker.state === CIRCUIT_STATES.CLOSED) {
      return this.circuitBreaker.failureCount < this.config.circuitBreakerThreshold;
    }

    if (this.circuitBreaker.state === CIRCUIT_STATES.OPEN) {
      // Try to half-open after reset interval
      if (now - this.circuitBreaker.lastFailureTime > this.config.circuitBreakerResetMs) {
        this.circuitBreaker.state = CIRCUIT_STATES.HALF_OPEN;
        return true;
      }
      return false;
    }

    if (this.circuitBreaker.state === CIRCUIT_STATES.HALF_OPEN) {
      return true; // Allow one attempt to test
    }

    return false;
  }

  _buildTaskResult(task, result, error, execution) {
    task.endTime = Date.now();
    task.status = error ? 'failed' : 'completed';
    task.result = result;
    task.error = error;

    this.results.set(task.id, {
      task,
      execution,
      duration: task.endTime - task.startTime
    });

    this.executionLog.push(execution);
    return { task, result, error, execution };
  }

  getCircuitState() {
    return { ...this.circuitBreaker };
  }

  getExecutionLog() {
    return this.executionLog;
  }
}

/**
 * Completion validator - Checks if goal is satisfied
 */
class CompletionValidator {
  validateCompletion(goal, results) {
    const validation = {
      goal,
      timestamp: new Date().toISOString(),
      passed: false,
      checks: [],
      failureReasons: []
    };

    // Check 1: All tasks completed
    const allTasksCompleted = Array.from(results.values()).every(
      r => r.task.status === 'completed'
    );
    validation.checks.push({
      name: 'All tasks completed',
      passed: allTasksCompleted,
      details: `${Array.from(results.values()).filter(r => r.task.status === 'completed').length}/${results.size} tasks completed`
    });
    if (!allTasksCompleted) {
      validation.failureReasons.push('Not all tasks completed');
    }

    // Check 2: No critical errors
    const noCriticalErrors = Array.from(results.values()).every(
      r => !r.task.error || r.task.error.message.includes('timeout')
    );
    validation.checks.push({
      name: 'No critical errors',
      passed: noCriticalErrors,
      details: `${Array.from(results.values()).filter(r => !r.task.error).length}/${results.size} tasks error-free`
    });
    if (!noCriticalErrors) {
      validation.failureReasons.push('Critical errors encountered');
    }

    // Check 3: Reasonable execution time
    const totalDuration = Array.from(results.values()).reduce((sum, r) => sum + r.duration, 0);
    const timeAcceptable = totalDuration < 600000; // 10 minutes
    validation.checks.push({
      name: 'Reasonable execution time',
      passed: timeAcceptable,
      details: `Total duration: ${(totalDuration / 1000).toFixed(2)}s`
    });
    if (!timeAcceptable) {
      validation.failureReasons.push('Execution took too long');
    }

    validation.passed = validation.checks.every(c => c.passed);
    return validation;
  }
}

/**
 * Autonomous execution loop controller
 */
class AutonomousExecutor {
  constructor(goalString, config = {}) {
    this.goal = goalString;
    this.config = { ...CONFIG, ...config };
    this.dag = null;
    this.engine = new ExecutionEngine(config);
    this.validator = new CompletionValidator();
    this.executedTasks = new Set();
    this.checkpointCounter = 0;
  }

  async run() {
    console.log(`\n${BOLD}${CYAN}╔════════════════════════════════════════════════════════════════════════════════╗${RESET}`);
    console.log(`${BOLD}${CYAN}║${RESET}  ${BOLD}${MAGENTA}DON'T STOP ENGINE: AUTONOMOUS GOAL EXECUTOR${RESET}${BOLD}${CYAN}                            ║${RESET}`);
    console.log(`${BOLD}${CYAN}╚════════════════════════════════════════════════════════════════════════════════╝${RESET}\n`);

    // Step 1: Parse goal into task DAG
    console.log(`${CYAN}[Step 1]${RESET} Parsing goal into task dependency graph...`);
    const builder = new TaskDAGBuilder(this.goal);
    builder.parse();
    this.dag = builder.getTaskDAG();
    console.log(`${GREEN}✓${RESET} Parsed ${this.dag.tasks.length} tasks\n`);

    // Restore checkpoint if available
    const checkpoint = this._loadCheckpoint();
    if (checkpoint) {
      console.log(`${YELLOW}⟲${RESET} Resuming from checkpoint: ${checkpoint.timestamp}`);
      this._restoreFromCheckpoint(checkpoint);
    }

    // Step 2: Main execution loop
    console.log(`${CYAN}[Step 2]${RESET} Executing task DAG with retry & circuit breaker logic...\n`);

    let complete = false;
    let iterations = 0;
    const maxIterations = 1000; // Safety limit

    while (!complete && iterations < maxIterations) {
      iterations++;

      // Pick next executable task
      const nextTask = this._getNextExecutableTask();
      if (!nextTask) {
        break;
      }

      console.log(`${BOLD}[Task ${this.executedTasks.size + 1}/${this.dag.tasks.length}]${RESET} Executing: ${nextTask.title}`);

      // Execute task
      const taskResult = await this.engine.executeTask(nextTask);
      this.executedTasks.add(nextTask.id);

      // Validate intermediate state
      const validation = this.validator.validateCompletion(this.goal, this.engine.results);

      // Checkpoint every N tasks
      this.checkpointCounter++;
      if (this.checkpointCounter % this.config.checkpointFrequency === 0) {
        this._saveCheckpoint();
      }

      // Check completion - only if all tasks executed
      if (this.executedTasks.size === this.dag.tasks.length) {
        complete = true;
        if (validation.passed) {
          console.log(`\n${GREEN}${BOLD}✓ GOAL ACHIEVED!${RESET}`);
        } else {
          console.log(`\n${YELLOW}${BOLD}⊘ EXECUTION COMPLETE (with issues)${RESET}`);
        }
      }

      // Circuit breaker status
      const circuitState = this.engine.getCircuitState();
      if (circuitState.state !== CIRCUIT_STATES.CLOSED) {
        console.log(`${RED}Circuit breaker: ${circuitState.state.toUpperCase()}${RESET}\n`);
      }
    }

    // Step 3: Validate completion
    console.log(`\n${CYAN}[Step 3]${RESET} Validating goal completion...`);
    const validation = this.validator.validateCompletion(this.goal, this.engine.results);

    validation.checks.forEach(check => {
      const icon = check.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
      console.log(`  ${icon} ${check.name}: ${check.details}`);
    });

    // Step 4: Generate report
    console.log(`\n${CYAN}[Step 4]${RESET} Generating execution report...`);
    this._generateReport(validation);

    // Clean up checkpoint on success
    if (validation.passed) {
      this._cleanupCheckpoint();
    }

    return {
      success: validation.passed,
      validation,
      executionLog: this.engine.getExecutionLog(),
      circuitState: this.engine.getCircuitState()
    };
  }

  _getNextExecutableTask() {
    for (const task of this.dag.tasks) {
      if (this.executedTasks.has(task.id)) continue;

      // Check if all dependencies are satisfied
      const dependenciesSatisfied = task.dependencies.every(
        depId => this.executedTasks.has(depId)
      );

      if (dependenciesSatisfied) {
        return task;
      }
    }

    return null;
  }

  _saveCheckpoint() {
    const checkpoint = {
      timestamp: new Date().toISOString(),
      goal: this.goal,
      executedTasks: Array.from(this.executedTasks),
      taskStates: this.dag.tasks.map(t => ({
        id: t.id,
        status: t.status,
        result: t.result,
        error: t.error ? t.error.message : null
      })),
      circuitState: this.engine.getCircuitState()
    };

    try {
      fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(checkpoint, null, 2), 'utf-8');
      console.log(`${DIM}[Checkpoint saved]${RESET}`);
    } catch (e) {
      console.error(`${RED}Checkpoint save failed: ${e.message}${RESET}`);
    }
  }

  _loadCheckpoint() {
    try {
      if (fs.existsSync(CHECKPOINT_PATH)) {
        const data = fs.readFileSync(CHECKPOINT_PATH, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(`${RED}Checkpoint load failed: ${e.message}${RESET}`);
    }
    return null;
  }

  _restoreFromCheckpoint(checkpoint) {
    checkpoint.executedTasks.forEach(taskId => {
      this.executedTasks.add(taskId);
    });
  }

  _cleanupCheckpoint() {
    try {
      if (fs.existsSync(CHECKPOINT_PATH)) {
        fs.unlinkSync(CHECKPOINT_PATH);
      }
    } catch (e) {
      // Silently ignore
    }
  }

  _generateReport(validation) {
    if (!fs.existsSync(CLAUDE_DIR)) {
      fs.mkdirSync(CLAUDE_DIR, { recursive: true });
    }

    let report = `# Don't Stop Engine - Execution Report\n\n`;
    report += `**Generated**: ${new Date().toISOString()}\n`;
    report += `**Status**: ${validation.passed ? '✓ SUCCESS' : '⊘ INCOMPLETE'}\n`;
    report += `**Goal**: \`${this.goal}\`\n\n`;

    report += `## Validation Results\n`;
    validation.checks.forEach(check => {
      const status = check.passed ? '✓' : '✗';
      report += `- [${status}] **${check.name}**: ${check.details}\n`;
    });

    if (validation.failureReasons.length > 0) {
      report += `\n## Failure Reasons\n`;
      validation.failureReasons.forEach(reason => {
        report += `- ${reason}\n`;
      });
    }

    report += `\n## Task Execution Summary\n`;
    report += `| Task | Status | Duration | Error |\n`;
    report += `|------|--------|----------|-------|\n`;

    Array.from(this.engine.results.values()).forEach(result => {
      const status = result.task.status === 'completed' ? '✓' : '✗';
      const duration = `${(result.duration / 1000).toFixed(2)}s`;
      const error = result.task.error ? result.task.error.message.substring(0, 50) : '-';
      report += `| ${result.task.id} | ${status} | ${duration} | ${error} |\n`;
    });

    report += `\n## Circuit Breaker State\n`;
    const cbState = this.engine.getCircuitState();
    report += `- **State**: ${cbState.state.toUpperCase()}\n`;
    report += `- **Failure Count**: ${cbState.failureCount}\n`;
    report += `- **Success Count**: ${cbState.successCount}\n`;

    report += `\n## Execution Log\n\`\`\`json\n`;
    report += JSON.stringify(this.engine.getExecutionLog(), null, 2).substring(0, 2000);
    report += `\n\`\`\`\n`;

    fs.writeFileSync(ENGINE_LOG_PATH, report, 'utf-8');
    console.log(`${GREEN}✓${RESET} Report saved to: ${YELLOW}${ENGINE_LOG_PATH}${RESET}\n`);
  }
}

/**
 * CLI Entry Point
 */
async function main() {
  const args = process.argv.slice(2);
  let goal = args.join(' ');

  if (!goal) {
    goal = 'validate project structure, then run tests, then build artifacts';
  }

  const executor = new AutonomousExecutor(goal, {
    maxRetries: 3,
    taskTimeoutMs: 120000,
    checkpointFrequency: 2
  });

  try {
    const result = await executor.run();
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error(`${RED}${BOLD}Fatal error:${RESET} ${error.message}`);
    process.exit(1);
  }
}

// Export for testing/integration
module.exports = {
  TaskDAGBuilder,
  ExecutionEngine,
  CompletionValidator,
  AutonomousExecutor,
  CIRCUIT_STATES,
  CONFIG
};

if (require.main === module) {
  main();
}
