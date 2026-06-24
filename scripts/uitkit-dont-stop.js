#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const DONT_STOP_DIR = path.join(CLAUDE_DIR, 'dont-stop');
const SESSION_PATH = path.join(DONT_STOP_DIR, 'session.json');
const LOG_PATH = path.join(DONT_STOP_DIR, 'execution.log');
const CHECKPOINT_PATH = path.join(DONT_STOP_DIR, 'checkpoint.json');

// ANSI Colors
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

// Task states
const STATES = {
  PENDING: 'pending',
  RUNNING: 'running',
  DONE: 'done',
  FAILED: 'failed',
};

/**
 * Progress bar renderer
 */
class ProgressBar {
  constructor(total, width = 30) {
    this.total = total;
    this.current = 0;
    this.width = width;
  }

  update(current) {
    this.current = Math.min(current, this.total);
  }

  render() {
    const percentage = Math.round((this.current / this.total) * 100);
    const filledWidth = Math.floor((this.current / this.total) * this.width);
    const emptyWidth = this.width - filledWidth;

    const bar = '█'.repeat(filledWidth) + '░'.repeat(emptyWidth);
    return `[${bar}] ${percentage}%`;
  }
}

/**
 * Token usage tracker
 */
class TokenTracker {
  constructor(budgetLimit = 100000) {
    this.budgetLimit = budgetLimit;
    this.spent = 0;
    this.tasks = [];
  }

  recordTask(taskId, tokenCount) {
    this.spent += tokenCount;
    this.tasks.push({ taskId, tokens: tokenCount, timestamp: Date.now() });
  }

  getRemainingBudget() {
    return this.budgetLimit - this.spent;
  }

  isWithinBudget() {
    return this.spent < this.budgetLimit;
  }

  getPercentage() {
    return Math.round((this.spent / this.budgetLimit) * 100);
  }

  formatStatus() {
    const remaining = this.getRemainingBudget();
    const percentage = this.getPercentage();
    return `${this.spent}/${this.budgetLimit} tokens (${percentage}%)`;
  }
}

/**
 * Task manager - handles task parsing, execution, and state
 */
class TaskManager {
  constructor(goalString, maxTasks = 50) {
    this.goalString = goalString;
    this.maxTasks = maxTasks;
    this.tasks = [];
    this.taskMap = new Map();
    this.parse();
  }

  parse() {
    // Extract tasks from goal string
    // Patterns: "do X, then Y, then Z" or "X (depends on Y)" or "X -> Y -> Z"
    const delimiters = /[,;]|->|\|\||then\s+/gi;
    const parts = this.goalString
      .split(delimiters)
      .map(p => p.trim())
      .filter(p => p.length > 0 && p.toLowerCase() !== 'then');

    if (parts.length === 0) {
      parts.push(this.goalString);
    }

    // Limit tasks to maxTasks
    const limited = parts.slice(0, this.maxTasks);

    limited.forEach((title, idx) => {
      const taskId = `task_${idx}`;
      const task = {
        id: taskId,
        title: title.trim(),
        index: idx,
        status: STATES.PENDING,
        priority: limited.length - idx,
        dependencies: idx === 0 ? [] : [`task_${idx - 1}`],
        startTime: null,
        endTime: null,
        duration: null,
        result: null,
        error: null,
        tokensCost: 0,
      };
      this.tasks.push(task);
      this.taskMap.set(taskId, task);
    });
  }

  getTask(taskId) {
    return this.taskMap.get(taskId);
  }

  getNextPendingTask() {
    return this.tasks.find(t => t.status === STATES.PENDING);
  }

  updateTaskStatus(taskId, status, data = {}) {
    const task = this.getTask(taskId);
    if (task) {
      task.status = status;
      if (status === STATES.RUNNING) {
        task.startTime = Date.now();
      } else if (status === STATES.DONE || status === STATES.FAILED) {
        task.endTime = Date.now();
        task.duration = task.endTime - task.startTime;
      }
      Object.assign(task, data);
    }
  }

  getStats() {
    const pending = this.tasks.filter(t => t.status === STATES.PENDING).length;
    const running = this.tasks.filter(t => t.status === STATES.RUNNING).length;
    const done = this.tasks.filter(t => t.status === STATES.DONE).length;
    const failed = this.tasks.filter(t => t.status === STATES.FAILED).length;
    const totalTokens = this.tasks.reduce((sum, t) => sum + t.tokensCost, 0);
    return { pending, running, done, failed, totalTokens };
  }

  toJSON() {
    return {
      goal: this.goalString,
      createdAt: new Date().toISOString(),
      tasks: this.tasks,
      stats: this.getStats(),
    };
  }
}

/**
 * Session manager - persists and resumes state
 */
class SessionManager {
  constructor(sessionPath, checkpointPath) {
    this.sessionPath = sessionPath;
    this.checkpointPath = checkpointPath;
    this.session = null;
  }

  save(taskManager, tokenTracker, options = {}) {
    const session = {
      id: this.session?.id || crypto.randomBytes(8).toString('hex'),
      createdAt: this.session?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      goalString: taskManager.goalString,
      tasks: taskManager.tasks,
      tokenSpent: tokenTracker.spent,
      tokenBudget: tokenTracker.budgetLimit,
      options,
    };
    this.session = session;
    fs.writeFileSync(this.sessionPath, JSON.stringify(session, null, 2));
  }

  load() {
    if (!fs.existsSync(this.sessionPath)) return null;
    this.session = JSON.parse(fs.readFileSync(this.sessionPath, 'utf-8'));
    return this.session;
  }

  createCheckpoint(taskManager) {
    const checkpoint = {
      timestamp: new Date().toISOString(),
      tasks: taskManager.tasks,
      stats: taskManager.getStats(),
    };
    fs.writeFileSync(this.checkpointPath, JSON.stringify(checkpoint, null, 2));
    return checkpoint;
  }

  loadCheckpoint() {
    if (!fs.existsSync(this.checkpointPath)) return null;
    return JSON.parse(fs.readFileSync(this.checkpointPath, 'utf-8'));
  }

  clear() {
    if (fs.existsSync(this.sessionPath)) fs.unlinkSync(this.sessionPath);
    if (fs.existsSync(this.checkpointPath)) fs.unlinkSync(this.checkpointPath);
  }
}

/**
 * Logger - writes execution log
 */
class Logger {
  constructor(logPath) {
    this.logPath = logPath;
    this.lines = [];
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level}] ${message}`;
    this.lines.push(entry);
    if (process.env.VERBOSE) {
      console.error(entry);
    }
  }

  flush() {
    if (this.lines.length > 0) {
      fs.appendFileSync(this.logPath, this.lines.join('\n') + '\n');
      this.lines = [];
    }
  }
}

/**
 * Real-time status renderer
 */
class StatusRenderer {
  constructor(taskManager, tokenTracker, verbose = false) {
    this.taskManager = taskManager;
    this.tokenTracker = tokenTracker;
    this.verbose = verbose;
    this.progressBar = new ProgressBar(taskManager.tasks.length);
  }

  render() {
    const stats = this.taskManager.getStats();
    const tasksDone = stats.done + stats.failed;
    this.progressBar.update(tasksDone);

    const lines = [
      `\n${COLORS.BOLD}${COLORS.CYAN}╔════ DONT-STOP ENGINE ════╗${COLORS.RESET}`,
      `${COLORS.CYAN}║${COLORS.RESET} Goal: ${this.taskManager.goalString.substring(0, 35)}...`,
      `${COLORS.CYAN}║${COLORS.RESET} ${this.progressBar.render()}`,
      `${COLORS.CYAN}║${COLORS.RESET} ${COLORS.GREEN}✓ ${stats.done}${COLORS.RESET} | ${COLORS.YELLOW}◐ ${stats.running}${COLORS.RESET} | ${COLORS.BLUE}○ ${stats.pending}${COLORS.RESET} | ${COLORS.RED}✗ ${stats.failed}${COLORS.RESET}`,
      `${COLORS.CYAN}║${COLORS.RESET} Tokens: ${this.tokenTracker.formatStatus()}`,
    ];

    if (this.verbose && stats.running === 1) {
      const running = this.taskManager.tasks.find(t => t.status === STATES.RUNNING);
      if (running) {
        lines.push(`${COLORS.CYAN}║${COLORS.RESET} Current: ${running.title.substring(0, 32)}...`);
      }
    }

    lines.push(`${COLORS.BOLD}${COLORS.CYAN}╚═════════════════════════╝${COLORS.RESET}`);

    return lines.join('\n');
  }
}

/**
 * Main engine
 */
class DontStopEngine {
  constructor(goalString, options = {}) {
    this.goalString = goalString;
    this.options = {
      budget: options.budget || 100000,
      maxTasks: options.maxTasks || 50,
      verbose: options.verbose || false,
      dryRun: options.dryRun || false,
      autoCommit: options.autoCommit || false,
      resume: options.resume || false,
    };

    this.taskManager = new TaskManager(goalString, this.options.maxTasks);
    this.tokenTracker = new TokenTracker(this.options.budget);
    this.sessionManager = new SessionManager(SESSION_PATH, CHECKPOINT_PATH);
    this.logger = new Logger(LOG_PATH);
    this.statusRenderer = new StatusRenderer(
      this.taskManager,
      this.tokenTracker,
      this.options.verbose
    );

    this.initDirs();
  }

  initDirs() {
    if (!fs.existsSync(DONT_STOP_DIR)) {
      fs.mkdirSync(DONT_STOP_DIR, { recursive: true });
    }
  }

  async run() {
    console.log(`${COLORS.BOLD}${COLORS.CYAN}Starting Dont-Stop Engine...${COLORS.RESET}\n`);
    this.logger.log(`Engine started with goal: ${this.goalString}`);

    if (this.options.resume) {
      const session = this.sessionManager.load();
      if (session) {
        console.log(`${COLORS.YELLOW}Resuming previous session (${session.id})${COLORS.RESET}`);
        this.logger.log(`Resumed session: ${session.id}`);
        // Restore task states from previous session
        this.taskManager.tasks = session.tasks;
        this.tokenTracker.spent = session.tokenSpent;
      }
    }

    // Main execution loop
    try {
      while (this.tokenTracker.isWithinBudget()) {
        const nextTask = this.taskManager.getNextPendingTask();
        if (!nextTask) {
          // All tasks done
          break;
        }

        console.clear();
        console.log(this.statusRenderer.render());

        this.taskManager.updateTaskStatus(nextTask.id, STATES.RUNNING);
        this.logger.log(`Starting task: ${nextTask.title}`);

        if (!this.options.dryRun) {
          try {
            const result = await this.executeTask(nextTask);
            const estimatedTokens = Math.ceil(nextTask.title.split(' ').length * 150);

            this.taskManager.updateTaskStatus(nextTask.id, STATES.DONE, {
              result: result.substring(0, 500),
              tokensCost: estimatedTokens,
            });
            this.tokenTracker.recordTask(nextTask.id, estimatedTokens);

            this.logger.log(
              `Task completed: ${nextTask.title} (${estimatedTokens} tokens)`
            );

            if (this.options.autoCommit) {
              await this.autoCommit(nextTask);
            }
          } catch (error) {
            this.taskManager.updateTaskStatus(nextTask.id, STATES.FAILED, {
              error: error.message,
            });
            this.logger.log(`Task failed: ${nextTask.title} - ${error.message}`, 'ERROR');
          }
        } else {
          // Dry run - mark as done without executing
          this.taskManager.updateTaskStatus(nextTask.id, STATES.DONE, {
            result: '[DRY RUN]',
            tokensCost: 0,
          });
          this.logger.log(`Task (dry-run): ${nextTask.title}`);
        }

        // Checkpoint every 5 tasks
        const stats = this.taskManager.getStats();
        if ((stats.done + stats.failed) % 5 === 0) {
          this.sessionManager.createCheckpoint(this.taskManager);
          this.logger.log(`Checkpoint created after ${stats.done} tasks`);
        }

        // Save session state
        this.sessionManager.save(this.taskManager, this.tokenTracker, this.options);
        this.logger.flush();
      }

      console.clear();
      console.log(this.statusRenderer.render());
      this.printSummary();
    } catch (error) {
      this.logger.log(`Engine error: ${error.message}`, 'ERROR');
      this.logger.flush();
      console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
      process.exit(1);
    }
  }

  async executeTask(task) {
    // Simulate task execution - in real usage, this would invoke Claude API
    // For now, return a mock result
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Completed: ${task.title}`);
      }, 100);
    });
  }

  async autoCommit(task) {
    try {
      execSync(`git add -A && git commit -m "dont-stop: ${task.title.substring(0, 50)}"`, {
        cwd: CWD,
        stdio: 'pipe',
      });
      this.logger.log(`Auto-commit: ${task.title}`);
    } catch (error) {
      this.logger.log(`Auto-commit failed: ${error.message}`, 'WARN');
    }
  }

  printSummary() {
    const stats = this.taskManager.getStats();
    const totalDuration =
      this.taskManager.tasks.length > 0
        ? this.taskManager.tasks[this.taskManager.tasks.length - 1].endTime -
          this.taskManager.tasks[0].startTime
        : 0;

    console.log(`
${COLORS.BOLD}${COLORS.GREEN}═══ EXECUTION SUMMARY ═══${COLORS.RESET}

${COLORS.GREEN}✓ Completed:${COLORS.RESET} ${stats.done}
${COLORS.RED}✗ Failed:${COLORS.RESET} ${stats.failed}
${COLORS.BLUE}○ Pending:${COLORS.RESET} ${stats.pending}

${COLORS.CYAN}Total Tasks:${COLORS.RESET} ${this.taskManager.tasks.length}
${COLORS.CYAN}Total Tokens:${COLORS.RESET} ${stats.totalTokens}
${COLORS.CYAN}Budget Used:${COLORS.RESET} ${this.tokenTracker.formatStatus()}
${COLORS.CYAN}Duration:${COLORS.RESET} ${this.formatDuration(totalDuration)}

${COLORS.BOLD}Log saved to:${COLORS.RESET} ${LOG_PATH}
${COLORS.BOLD}Session saved to:${COLORS.RESET} ${SESSION_PATH}
    `);
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}

/**
 * CLI argument parser
 */
function parseArgs(args) {
  const opts = {
    goal: '',
    budget: 100000,
    maxTasks: 50,
    verbose: false,
    dryRun: false,
    autoCommit: false,
    resume: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--budget' && args[i + 1]) {
      opts.budget = parseInt(args[++i], 10);
    } else if (args[i] === '--max-tasks' && args[i + 1]) {
      opts.maxTasks = parseInt(args[++i], 10);
    } else if (args[i] === '--verbose') {
      opts.verbose = true;
    } else if (args[i] === '--dry-run') {
      opts.dryRun = true;
    } else if (args[i] === '--auto-commit') {
      opts.autoCommit = true;
    } else if (args[i] === '--resume') {
      opts.resume = true;
    } else if (!args[i].startsWith('--')) {
      if (!opts.goal) {
        opts.goal = args[i];
      }
    }
  }

  return opts;
}

/**
 * Main CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
${COLORS.BOLD}claudient dont-stop${COLORS.RESET} — Autonomous task execution engine

${COLORS.BOLD}Usage:${COLORS.RESET}
  claudient dont-stop "<goal string>" [options]

${COLORS.BOLD}Options:${COLORS.RESET}
  --budget=NUM          Token budget limit (default: 100000)
  --max-tasks=NUM       Maximum tasks to execute (default: 50)
  --verbose             Log all decisions and state changes
  --dry-run             Parse tasks and show plan without executing
  --auto-commit         Git commit after each completed task
  --resume              Resume from previous session if available

${COLORS.BOLD}Examples:${COLORS.RESET}
  claudient dont-stop "add feature X, then add feature Y, then run tests"
  claudient dont-stop "refactor module A, then refactor B" --budget 50000 --verbose
  claudient dont-stop "deploy to staging, then run smoke tests" --auto-commit
  claudient dont-stop "continue work" --resume

${COLORS.BOLD}Output:${COLORS.RESET}
  Real-time progress bar showing task status (pending/running/done/failed)
  Token spend tracking against budget
  Session and checkpoint files in .claude/dont-stop/
    `);
    process.exit(0);
  }

  const opts = parseArgs(args);

  if (!opts.goal) {
    console.error(`${COLORS.RED}Error: Goal string required${COLORS.RESET}`);
    process.exit(1);
  }

  try {
    const engine = new DontStopEngine(opts.goal, {
      budget: opts.budget,
      maxTasks: opts.maxTasks,
      verbose: opts.verbose,
      dryRun: opts.dryRun,
      autoCommit: opts.autoCommit,
      resume: opts.resume,
    });

    await engine.run();
  } catch (error) {
    console.error(`${COLORS.RED}Fatal error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`${COLORS.RED}Uncaught error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  });
}

module.exports = { DontStopEngine, TaskManager, TokenTracker, SessionManager };
