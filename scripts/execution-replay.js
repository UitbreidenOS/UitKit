#!/usr/bin/env node

/**
 * Execution Replay System
 *
 * Replay dont-stop-agent-pool executions with forensic debugging:
 * - Step through individual decisions and state changes
 * - Inspect state at each point in execution
 * - Debug failed executions with full context
 * - Learn from successes via decision tree analysis
 * - Compare multiple runs for optimization insights
 * - Generate detailed replay reports and timelines
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const readline = require('readline');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const POOL_DIR = path.join(CLAUDE_DIR, 'agent-pool');
const REPLAY_DIR = path.join(POOL_DIR, 'replays');
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
  BRIGHT_GREEN: '\x1b[92m',
  BRIGHT_RED: '\x1b[91m',
};

/**
 * Execution event - immutable snapshot of a decision/state change
 */
class ExecutionEvent {
  constructor(timestamp, eventType, data, state = null) {
    this.timestamp = timestamp;
    this.eventType = eventType;
    this.data = data;
    this.state = state; // Snapshot of pool state at this moment
    this.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      eventType: this.eventType,
      data: this.data,
      state: this.state,
    };
  }
}

/**
 * Decision point - a critical branching moment in execution
 */
class DecisionPoint {
  constructor(id, timestamp, context, options, chosenOption, outcome) {
    this.id = id;
    this.timestamp = timestamp;
    this.context = context; // What led to this decision
    this.options = options; // Available choices
    this.chosenOption = chosenOption; // What was actually chosen
    this.outcome = outcome; // Result of the decision
    this.analysis = null; // User-provided analysis
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      context: this.context,
      options: this.options,
      chosenOption: this.chosenOption,
      outcome: this.outcome,
      analysis: this.analysis,
    };
  }
}

/**
 * Execution trace - collects all events and state changes
 */
class ExecutionTrace {
  constructor(poolId, metadata = {}) {
    this.poolId = poolId;
    this.metadata = metadata;
    this.events = [];
    this.decisions = [];
    this.startTime = Date.now();
    this.endTime = null;
    this.status = 'recording'; // recording, paused, completed
  }

  recordEvent(eventType, data, state = null) {
    const event = new ExecutionEvent(Date.now(), eventType, data, state);
    this.events.push(event);
    return event.id;
  }

  recordDecision(context, options, chosenOption, outcome) {
    const decision = new DecisionPoint(
      `decision_${this.decisions.length}`,
      Date.now(),
      context,
      options,
      chosenOption,
      outcome
    );
    this.decisions.push(decision);
    return decision.id;
  }

  complete() {
    this.endTime = Date.now();
    this.status = 'completed';
  }

  getDuration() {
    return (this.endTime || Date.now()) - this.startTime;
  }

  getEventCount() {
    return this.events.length;
  }

  getEventsByType(eventType) {
    return this.events.filter((e) => e.eventType === eventType);
  }

  getEventTimeline() {
    return this.events.map((e) => ({
      time: e.timestamp,
      type: e.eventType,
      summary: this.summarizeEvent(e),
    }));
  }

  summarizeEvent(event) {
    const data = event.data || {};
    switch (event.eventType) {
      case 'goal-submitted':
        return `Goal submitted: ${data.goalId} (priority: ${data.priority})`;
      case 'goal-started':
        return `Goal started: ${data.goal?.substring(0, 40)}...`;
      case 'goal-completed':
        return `Goal completed in ${data.duration}ms`;
      case 'goal-failed':
        return `Goal failed: ${data.error}`;
      case 'goal-retry':
        return `Retry attempt ${data.attempt}: ${data.error}`;
      case 'pool-started':
        return `Pool started (maxConcurrent: ${data.maxConcurrent})`;
      case 'pool-completed':
        return `Pool completed (stats: ${data.stats?.goalsProcessed} goals)`;
      default:
        return JSON.stringify(data).substring(0, 60);
    }
  }

  toJSON() {
    return {
      poolId: this.poolId,
      metadata: this.metadata,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.getDuration(),
      status: this.status,
      eventCount: this.events.length,
      decisionCount: this.decisions.length,
      events: this.events,
      decisions: this.decisions,
    };
  }
}

/**
 * Execution recorder - captures pool events into a trace
 */
class ExecutionRecorder extends EventEmitter {
  constructor(poolInstance) {
    super();
    this.pool = poolInstance;
    this.trace = new ExecutionTrace(poolInstance.poolId, {
      maxConcurrent: poolInstance.maxConcurrent,
      globalBudget: poolInstance.globalBudget,
      timestamp: new Date().toISOString(),
    });

    this.recordingActive = false;
    this.attachListeners();
  }

  attachListeners() {
    const eventTypes = [
      'goal-submitted',
      'goal-started',
      'goal-completed',
      'goal-failed',
      'goal-retry',
      'goal-suspended',
      'goal-resumed',
      'pool-started',
      'pool-completed',
      'pool-force-stopped',
    ];

    eventTypes.forEach((eventType) => {
      this.pool.on(eventType, (data) => {
        if (this.recordingActive) {
          const state = this.capturePoolState();
          this.trace.recordEvent(eventType, data, state);
          this.emit('event-recorded', { eventType, data });
        }
      });
    });
  }

  capturePoolState() {
    if (!this.pool) return null;
    return {
      activeGoals: this.pool.balancer.getActiveCount(),
      queuedGoals: this.pool.queue.getLength(),
      completedGoals: this.pool.stats.goalsProcessed,
      failedGoals: this.pool.stats.goalsFailed,
      tokensSpent: this.pool.costTracker.globalSpent,
      timestamp: Date.now(),
    };
  }

  startRecording() {
    this.recordingActive = true;
    this.trace.recordEvent('recorder-started', { timestamp: Date.now() });
    this.emit('recording-started');
  }

  stopRecording() {
    this.recordingActive = false;
    this.trace.recordEvent('recorder-stopped', { timestamp: Date.now() });
    this.trace.complete();
    this.emit('recording-stopped');
  }

  getTrace() {
    return this.trace;
  }

  saveTrace(filename = null) {
    if (!fs.existsSync(REPLAY_DIR)) {
      fs.mkdirSync(REPLAY_DIR, { recursive: true });
    }

    const fname =
      filename || `trace_${this.trace.poolId}_${Date.now()}.json`;
    const filepath = path.join(REPLAY_DIR, fname);

    fs.writeFileSync(filepath, JSON.stringify(this.trace, null, 2));
    return filepath;
  }
}

/**
 * Execution replay engine - step through and inspect execution
 */
class ExecutionReplayer extends EventEmitter {
  constructor(traceData) {
    super();
    this.trace = traceData;
    this.currentStep = 0;
    this.isPaused = false;
    this.speedFactor = 1.0; // 1.0 = real-time, 0.5 = half speed, 2.0 = double speed
    this.bookmarks = new Map();
    this.breakpoints = new Set();
    this.watchedVariables = new Map();
  }

  /**
   * Load trace from file
   */
  static fromFile(filepath) {
    const data = fs.readFileSync(filepath, 'utf-8');
    const traceData = JSON.parse(data);
    return new ExecutionReplayer(traceData);
  }

  /**
   * Get current event
   */
  getCurrentEvent() {
    if (this.currentStep < 0 || this.currentStep >= this.trace.events.length) {
      return null;
    }
    return this.trace.events[this.currentStep];
  }

  /**
   * Get state at current step
   */
  getCurrentState() {
    const event = this.getCurrentEvent();
    return event ? event.state : null;
  }

  /**
   * Step forward
   */
  stepForward() {
    if (this.currentStep < this.trace.events.length - 1) {
      this.currentStep++;
      this.emit('step-forward', { step: this.currentStep });
      this.checkBreakpoints();
      return true;
    }
    return false;
  }

  /**
   * Step backward
   */
  stepBackward() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.emit('step-backward', { step: this.currentStep });
      return true;
    }
    return false;
  }

  /**
   * Jump to step
   */
  jumpToStep(stepNumber) {
    if (stepNumber >= 0 && stepNumber < this.trace.events.length) {
      this.currentStep = stepNumber;
      this.emit('jumped', { step: this.currentStep });
      this.checkBreakpoints();
      return true;
    }
    return false;
  }

  /**
   * Find events by type
   */
  findEventsByType(eventType, startStep = 0) {
    return this.trace.events
      .slice(startStep)
      .map((e, idx) => ({ ...e, index: startStep + idx }))
      .filter((e) => e.eventType === eventType);
  }

  /**
   * Find events matching condition
   */
  findEvents(predicate, startStep = 0) {
    return this.trace.events
      .slice(startStep)
      .map((e, idx) => ({ ...e, index: startStep + idx }))
      .filter(predicate);
  }

  /**
   * Set breakpoint at event type
   */
  setBreakpoint(eventType) {
    this.breakpoints.add(eventType);
  }

  /**
   * Remove breakpoint
   */
  removeBreakpoint(eventType) {
    this.breakpoints.delete(eventType);
  }

  /**
   * Check if we should break
   */
  checkBreakpoints() {
    const event = this.getCurrentEvent();
    if (event && this.breakpoints.has(event.eventType)) {
      this.isPaused = true;
      this.emit('breakpoint-hit', { event, step: this.currentStep });
    }
  }

  /**
   * Set bookmark at current step
   */
  setBookmark(name) {
    this.bookmarks.set(name, this.currentStep);
    this.emit('bookmark-set', { name, step: this.currentStep });
  }

  /**
   * Jump to bookmark
   */
  jumpToBookmark(name) {
    if (this.bookmarks.has(name)) {
      const step = this.bookmarks.get(name);
      this.jumpToStep(step);
      return true;
    }
    return false;
  }

  /**
   * List bookmarks
   */
  listBookmarks() {
    return Array.from(this.bookmarks.entries()).map(([name, step]) => ({
      name,
      step,
      event: this.trace.events[step],
    }));
  }

  /**
   * Watch a variable across execution
   */
  watchVariable(varName, extractor) {
    this.watchedVariables.set(varName, {
      extractor,
      values: [],
    });
  }

  /**
   * Get watch values at current step
   */
  getWatchedValues() {
    const result = {};
    const event = this.getCurrentEvent();

    this.watchedVariables.forEach((watch, varName) => {
      try {
        result[varName] = watch.extractor(event);
      } catch (error) {
        result[varName] = `ERROR: ${error.message}`;
      }
    });

    return result;
  }

  /**
   * Generate timeline view
   */
  getTimeline(limit = 20) {
    const start = Math.max(0, this.currentStep - Math.floor(limit / 2));
    const end = Math.min(this.trace.events.length, start + limit);

    return this.trace.events.slice(start, end).map((event, idx) => ({
      index: start + idx,
      isCurrentStep: start + idx === this.currentStep,
      type: event.eventType,
      summary: this.summarizeEvent(event),
      timestamp: event.timestamp,
    }));
  }

  /**
   * Summarize event
   */
  summarizeEvent(event) {
    const data = event.data || {};
    switch (event.eventType) {
      case 'goal-submitted':
        return `Submitted: ${data.goalId?.substring(0, 12)}`;
      case 'goal-started':
        return `Started: ${data.goal?.substring(0, 35)}...`;
      case 'goal-completed':
        return `Completed (${data.duration}ms)`;
      case 'goal-failed':
        return `Failed: ${data.error}`;
      case 'goal-retry':
        return `Retry #${data.attempt}`;
      default:
        return event.eventType;
    }
  }

  /**
   * Get event range with context
   */
  getEventRange(startStep, endStep) {
    const events = this.trace.events.slice(startStep, endStep + 1);
    return events.map((event, idx) => ({
      index: startStep + idx,
      ...event,
      summary: this.summarizeEvent(event),
    }));
  }

  /**
   * Analyze failure chain
   */
  analyzeFailures() {
    const failures = this.findEventsByType('goal-failed');
    const analysis = [];

    failures.forEach((failure) => {
      // Look back to find related goal-started
      const startIdx = failure.index;
      let startEvent = null;

      for (let i = startIdx - 1; i >= Math.max(0, startIdx - 50); i--) {
        if (
          this.trace.events[i].eventType === 'goal-started' &&
          this.trace.events[i].data?.goalId === failure.data?.goalId
        ) {
          startEvent = this.trace.events[i];
          break;
        }
      }

      // Look for retries
      const retries = this.trace.events
        .slice(startIdx, Math.min(this.trace.events.length, startIdx + 20))
        .filter(
          (e) =>
            e.eventType === 'goal-retry' &&
            e.data?.goalId === failure.data?.goalId
        );

      analysis.push({
        failureIndex: failure.index,
        goalId: failure.data?.goalId,
        error: failure.data?.error,
        duration: failure.data?.duration,
        startedAt: startEvent?.timestamp,
        retryCount: retries.length,
        retries: retries.map((r) => ({
          attempt: r.data?.attempt,
          error: r.data?.error,
          timestamp: r.timestamp,
        })),
      });
    });

    return analysis;
  }

  /**
   * Analyze decision tree
   */
  analyzeDecisions() {
    const timeline = this.getTimeline(this.trace.events.length);
    const decisions = {
      priorityChanges: [],
      stateTransitions: [],
      resourceEvents: [],
    };

    // Track state changes
    let lastState = null;
    timeline.forEach((item) => {
      const event = this.trace.events[item.index];
      const currentState = event.state;

      if (lastState && currentState) {
        if (lastState.activeGoals !== currentState.activeGoals) {
          decisions.stateTransitions.push({
            step: item.index,
            change: `activeGoals: ${lastState.activeGoals} → ${currentState.activeGoals}`,
            timestamp: event.timestamp,
          });
        }

        if (lastState.tokensSpent !== currentState.tokensSpent) {
          decisions.resourceEvents.push({
            step: item.index,
            change: `tokens: ${lastState.tokensSpent} → ${currentState.tokensSpent}`,
            delta: currentState.tokensSpent - lastState.tokensSpent,
          });
        }
      }

      lastState = currentState;
    });

    return decisions;
  }

  /**
   * Export detailed report
   */
  generateReport() {
    const failures = this.analyzeFailures();
    const decisions = this.analyzeDecisions();

    return {
      summary: {
        poolId: this.trace.poolId,
        totalEvents: this.trace.events.length,
        duration: this.trace.getDuration(),
        status: this.trace.status,
      },
      metadata: this.trace.metadata,
      failures: failures,
      decisions: decisions,
      timeline: this.trace.getEventTimeline(),
    };
  }
}

/**
 * Interactive replay CLI
 */
class ReplayInteractive extends EventEmitter {
  constructor(replayer) {
    super();
    this.replayer = replayer;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${COLORS.CYAN}replay>${COLORS.RESET} `,
    });

    this.setupCommands();
  }

  setupCommands() {
    this.commands = {
      next: () => this.cmdNext(),
      prev: () => this.cmdPrev(),
      jump: (args) => this.cmdJump(args),
      show: () => this.cmdShow(),
      state: () => this.cmdState(),
      watch: (args) => this.cmdWatch(args),
      find: (args) => this.cmdFind(args),
      bookmark: (args) => this.cmdBookmark(args),
      breakpoint: (args) => this.cmdBreakpoint(args),
      failures: () => this.cmdFailures(),
      timeline: () => this.cmdTimeline(),
      report: () => this.cmdReport(),
      help: () => this.cmdHelp(),
      exit: () => this.cmdExit(),
    };
  }

  cmdNext() {
    const hasNext = this.replayer.stepForward();
    if (hasNext) {
      this.printCurrentEvent();
    } else {
      console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} End of trace reached`);
    }
  }

  cmdPrev() {
    const hasPrev = this.replayer.stepBackward();
    if (hasPrev) {
      this.printCurrentEvent();
    } else {
      console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Beginning of trace reached`);
    }
  }

  cmdJump(args) {
    const step = parseInt(args?.[0], 10);
    if (isNaN(step)) {
      console.log(`${COLORS.RED}Error: Invalid step number${COLORS.RESET}`);
      return;
    }
    if (this.replayer.jumpToStep(step)) {
      this.printCurrentEvent();
    } else {
      console.log(
        `${COLORS.RED}Error: Step ${step} out of range${COLORS.RESET}`
      );
    }
  }

  cmdShow() {
    this.printCurrentEvent();
  }

  cmdState() {
    const state = this.replayer.getCurrentState();
    if (state) {
      console.log(`${COLORS.CYAN}State at step ${this.replayer.currentStep}:${COLORS.RESET}`);
      console.log(JSON.stringify(state, null, 2));
    } else {
      console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} No state available`);
    }
  }

  cmdWatch(args) {
    if (!args || args.length === 0) {
      console.log(`${COLORS.CYAN}Watched variables:${COLORS.RESET}`);
      const watched = this.replayer.getWatchedValues();
      Object.entries(watched).forEach(([name, value]) => {
        console.log(`  ${name}: ${JSON.stringify(value)}`);
      });
      return;
    }

    const varName = args[0];
    console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} Watching: ${varName}`);
  }

  cmdFind(args) {
    if (!args || args.length === 0) {
      console.log(
        `${COLORS.RED}Usage: find <event-type>${COLORS.RESET}`
      );
      return;
    }

    const eventType = args.join(' ');
    const found = this.replayer.findEventsByType(eventType, this.replayer.currentStep);

    if (found.length === 0) {
      console.log(
        `${COLORS.YELLOW}[*]${COLORS.RESET} No events of type "${eventType}" found`
      );
      return;
    }

    console.log(
      `${COLORS.CYAN}Found ${found.length} events of type "${eventType}":${COLORS.RESET}`
    );
    found.slice(0, 5).forEach((event, idx) => {
      console.log(
        `  ${idx + 1}. Step ${event.index}: ${this.replayer.summarizeEvent(event)}`
      );
    });
  }

  cmdBookmark(args) {
    if (!args || args.length === 0) {
      const bookmarks = this.replayer.listBookmarks();
      if (bookmarks.length === 0) {
        console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} No bookmarks set`);
        return;
      }
      console.log(`${COLORS.CYAN}Bookmarks:${COLORS.RESET}`);
      bookmarks.forEach((bm) => {
        console.log(
          `  ${bm.name}: Step ${bm.step} (${this.replayer.summarizeEvent(bm.event)})`
        );
      });
      return;
    }

    const name = args[0];
    if (args[0] === 'set') {
      const bmName = args[1];
      this.replayer.setBookmark(bmName);
      console.log(
        `${COLORS.GREEN}[✓]${COLORS.RESET} Bookmark "${bmName}" set at step ${this.replayer.currentStep}`
      );
    } else if (args[0] === 'go') {
      const bmName = args[1];
      if (this.replayer.jumpToBookmark(bmName)) {
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Jumped to bookmark "${bmName}"`
        );
        this.printCurrentEvent();
      } else {
        console.log(`${COLORS.RED}Error: Bookmark "${bmName}" not found${COLORS.RESET}`);
      }
    }
  }

  cmdBreakpoint(args) {
    if (!args || args.length === 0) {
      if (this.replayer.breakpoints.size === 0) {
        console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} No breakpoints set`);
        return;
      }
      console.log(`${COLORS.CYAN}Breakpoints:${COLORS.RESET}`);
      this.replayer.breakpoints.forEach((bp) => {
        console.log(`  ${bp}`);
      });
      return;
    }

    const eventType = args.join(' ');
    this.replayer.setBreakpoint(eventType);
    console.log(
      `${COLORS.GREEN}[✓]${COLORS.RESET} Breakpoint set for "${eventType}"`
    );
  }

  cmdFailures() {
    const failures = this.replayer.analyzeFailures();
    if (failures.length === 0) {
      console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} No failures found`);
      return;
    }

    console.log(`${COLORS.RED}Failures (${failures.length}):${COLORS.RESET}`);
    failures.forEach((f, idx) => {
      console.log(`\n  ${idx + 1}. Goal: ${f.goalId}`);
      console.log(`     Error: ${f.error}`);
      console.log(`     Duration: ${f.duration}ms`);
      if (f.retryCount > 0) {
        console.log(`     Retries: ${f.retryCount}`);
      }
    });
  }

  cmdTimeline() {
    const timeline = this.replayer.getTimeline(30);
    console.log(`${COLORS.CYAN}Event Timeline (around step ${this.replayer.currentStep}):${COLORS.RESET}\n`);

    timeline.forEach((item) => {
      const marker =
        item.isCurrentStep ? `${COLORS.BRIGHT_GREEN}>>>${COLORS.RESET}` : '   ';
      console.log(`${marker} [${item.index}] ${item.summary}`);
    });
  }

  cmdReport() {
    const report = this.replayer.generateReport();
    const reportPath = path.join(
      REPLAY_DIR,
      `report_${this.replayer.trace.poolId}_${Date.now()}.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} Report saved to ${COLORS.DIM}${reportPath}${COLORS.RESET}`);
  }

  cmdHelp() {
    console.log(`
${COLORS.BOLD}Execution Replay Commands${COLORS.RESET}

${COLORS.BOLD}Navigation:${COLORS.RESET}
  next, n          Step to next event
  prev, p          Step to previous event
  jump <N>         Jump to step N
  show             Show current event

${COLORS.BOLD}Inspection:${COLORS.RESET}
  state            Show execution state at current step
  watch [VAR]      Watch/list watched variables
  find <TYPE>      Find events by type
  timeline         Show event timeline around current step

${COLORS.BOLD}Bookmarks:${COLORS.RESET}
  bookmark         List all bookmarks
  bookmark set <NAME>  Set bookmark at current step
  bookmark go <NAME>   Jump to bookmark

${COLORS.BOLD}Breakpoints:${COLORS.RESET}
  breakpoint       List all breakpoints
  breakpoint <TYPE>    Set breakpoint for event type

${COLORS.BOLD}Analysis:${COLORS.RESET}
  failures         Analyze all failures
  report           Generate detailed report

${COLORS.BOLD}Control:${COLORS.RESET}
  help             Show this help
  exit             Exit replay
    `);
  }

  cmdExit() {
    console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} Exiting replay...`);
    this.rl.close();
    process.exit(0);
  }

  printCurrentEvent() {
    const event = this.replayer.getCurrentEvent();
    if (!event) {
      console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} No event at current step`);
      return;
    }

    console.log(`\n${COLORS.CYAN}Step ${this.replayer.currentStep}:${COLORS.RESET}`);
    console.log(`  Type: ${COLORS.BOLD}${event.eventType}${COLORS.RESET}`);
    console.log(`  Time: ${new Date(event.timestamp).toISOString()}`);
    if (Object.keys(event.data || {}).length > 0) {
      console.log(`  Data: ${JSON.stringify(event.data, null, 2).split('\n').join('\n       ')}`);
    }
    if (event.state) {
      console.log(`  State: Active=${event.state.activeGoals} Queued=${event.state.queuedGoals} Tokens=${event.state.tokensSpent}`);
    }
    console.log();
  }

  start() {
    console.log(
      `${COLORS.BOLD}${COLORS.MAGENTA}╔════════════════════════════════════════╗${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.MAGENTA}║${COLORS.RESET}  ${COLORS.BOLD}EXECUTION REPLAY${COLORS.RESET}${COLORS.BOLD}${COLORS.MAGENTA}                  ║${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.MAGENTA}║${COLORS.RESET}  Step through dont-stop executions${COLORS.BOLD}${COLORS.MAGENTA}          ║${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.MAGENTA}╚════════════════════════════════════════╝${COLORS.RESET}\n`
    );

    console.log(
      `${COLORS.CYAN}Pool ID:${COLORS.RESET} ${this.replayer.trace.poolId}`
    );
    console.log(
      `${COLORS.CYAN}Events:${COLORS.RESET} ${this.replayer.trace.events.length}`
    );
    console.log(
      `${COLORS.CYAN}Duration:${COLORS.RESET} ${(this.replayer.trace.getDuration() / 1000).toFixed(2)}s\n`
    );

    this.rl.prompt();
    this.rl.on('line', (input) => {
      const [cmd, ...args] = input.trim().split(/\s+/);

      if (cmd === 'n' || cmd === 'next') {
        this.cmdNext();
      } else if (cmd === 'p' || cmd === 'prev') {
        this.cmdPrev();
      } else if (cmd === 'show') {
        this.cmdShow();
      } else if (cmd === 'jump') {
        this.cmdJump(args);
      } else if (cmd === 'state') {
        this.cmdState();
      } else if (cmd === 'watch') {
        this.cmdWatch(args);
      } else if (cmd === 'find') {
        this.cmdFind(args);
      } else if (cmd === 'bookmark') {
        this.cmdBookmark(args);
      } else if (cmd === 'breakpoint') {
        this.cmdBreakpoint(args);
      } else if (cmd === 'failures') {
        this.cmdFailures();
      } else if (cmd === 'timeline') {
        this.cmdTimeline();
      } else if (cmd === 'report') {
        this.cmdReport();
      } else if (cmd === 'help' || cmd === '?') {
        this.cmdHelp();
      } else if (cmd === 'exit' || cmd === 'quit') {
        this.cmdExit();
      } else if (cmd) {
        console.log(
          `${COLORS.RED}Unknown command: ${cmd}. Type 'help' for available commands.${COLORS.RESET}`
        );
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      process.exit(0);
    });
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
${COLORS.BOLD}execution-replay${COLORS.RESET} — Forensic debugging for dont-stop-agent-pool

${COLORS.BOLD}Usage:${COLORS.RESET}
  node execution-replay.js <command> [options]

${COLORS.BOLD}Commands:${COLORS.RESET}
  replay <file>        Interactive replay of a saved trace
  analyze <file>       Analyze trace and generate report
  list                 List saved traces
  compare <f1> <f2>    Compare two traces
  help                 Show this help

${COLORS.BOLD}Options:${COLORS.RESET}
  --summary            Show summary only (for analyze/compare)
  --failures           Focus on failure analysis
  --decisions          Analyze decision tree
  --export <path>      Export report to file

${COLORS.BOLD}Examples:${COLORS.RESET}
  node execution-replay.js replay .claude/agent-pool/replays/trace_abc123.json
  node execution-replay.js analyze .claude/agent-pool/replays/trace_abc123.json --failures
  node execution-replay.js list
    `);
    return;
  }

  const cmd = args[0];

  if (cmd === 'replay') {
    const filepath = args[1];
    if (!filepath) {
      console.error(`${COLORS.RED}Error: filepath required${COLORS.RESET}`);
      process.exit(1);
    }

    if (!fs.existsSync(filepath)) {
      console.error(`${COLORS.RED}Error: file not found: ${filepath}${COLORS.RESET}`);
      process.exit(1);
    }

    const replayer = ExecutionReplayer.fromFile(filepath);
    const interactive = new ReplayInteractive(replayer);
    interactive.start();
  } else if (cmd === 'analyze') {
    const filepath = args[1];
    if (!filepath) {
      console.error(`${COLORS.RED}Error: filepath required${COLORS.RESET}`);
      process.exit(1);
    }

    if (!fs.existsSync(filepath)) {
      console.error(`${COLORS.RED}Error: file not found: ${filepath}${COLORS.RESET}`);
      process.exit(1);
    }

    const replayer = ExecutionReplayer.fromFile(filepath);

    if (args.includes('--failures')) {
      const failures = replayer.analyzeFailures();
      console.log(`${COLORS.RED}Failures:${COLORS.RESET}`);
      console.log(JSON.stringify(failures, null, 2));
    } else if (args.includes('--decisions')) {
      const decisions = replayer.analyzeDecisions();
      console.log(`${COLORS.CYAN}Decision Analysis:${COLORS.RESET}`);
      console.log(JSON.stringify(decisions, null, 2));
    } else {
      const report = replayer.generateReport();
      const exportPath = args[args.indexOf('--export') + 1];

      if (exportPath) {
        fs.writeFileSync(exportPath, JSON.stringify(report, null, 2));
        console.log(
          `${COLORS.GREEN}[✓]${COLORS.RESET} Report exported to ${exportPath}`
        );
      } else {
        console.log(JSON.stringify(report, null, 2));
      }
    }
  } else if (cmd === 'list') {
    if (!fs.existsSync(REPLAY_DIR)) {
      console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} No replays directory found`);
      return;
    }

    const files = fs.readdirSync(REPLAY_DIR).filter((f) => f.endsWith('.json'));
    if (files.length === 0) {
      console.log(`${COLORS.YELLOW}[*]${COLORS.RESET} No trace files found`);
      return;
    }

    console.log(`${COLORS.CYAN}Saved Traces:${COLORS.RESET}`);
    files.forEach((file, idx) => {
      const filepath = path.join(REPLAY_DIR, file);
      const stat = fs.statSync(filepath);
      console.log(
        `  ${idx + 1}. ${file} (${(stat.size / 1024).toFixed(2)}KB)`
      );
    });
  } else if (cmd === 'compare') {
    const file1 = args[1];
    const file2 = args[2];

    if (!file1 || !file2) {
      console.error(
        `${COLORS.RED}Error: two filepaths required${COLORS.RESET}`
      );
      process.exit(1);
    }

    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
      console.error(`${COLORS.RED}Error: file not found${COLORS.RESET}`);
      process.exit(1);
    }

    const trace1 = JSON.parse(fs.readFileSync(file1, 'utf-8'));
    const trace2 = JSON.parse(fs.readFileSync(file2, 'utf-8'));

    console.log(`${COLORS.CYAN}Trace Comparison:${COLORS.RESET}\n`);
    console.log(
      `File 1: ${trace1.events.length} events, ${(trace1.getDuration() / 1000).toFixed(2)}s`
    );
    console.log(
      `File 2: ${trace2.events.length} events, ${(trace2.getDuration() / 1000).toFixed(2)}s`
    );

    const failureCount1 = trace1.events.filter(
      (e) => e.eventType === 'goal-failed'
    ).length;
    const failureCount2 = trace2.events.filter(
      (e) => e.eventType === 'goal-failed'
    ).length;

    console.log(`\nFailures: ${failureCount1} vs ${failureCount2}`);
  }
}

// Export for programmatic use
module.exports = {
  ExecutionTrace,
  ExecutionRecorder,
  ExecutionReplayer,
  ReplayInteractive,
  ExecutionEvent,
  DecisionPoint,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  });
}
