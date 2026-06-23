#!/usr/bin/env node

/**
 * Agent Orchestration System
 *
 * Orchestrates multiple agents with:
 * - Parallel execution with concurrency control
 * - Sequential pipelines with dependencies
 * - Fan-out/fan-in patterns for scatter-gather workloads
 * - Agent communication protocol (message passing, shared state)
 * - Deadlock detection and prevention
 * - Timeout management with graceful degradation
 * - Load balancing and resource allocation
 * - Comprehensive metrics and observability
 */

const EventEmitter = require('events');
const { v4: uuidv4 } = require('crypto').randomUUID || (() => Math.random().toString(36).slice(2, 11));

// ============================================================================
// Types & Enums
// ============================================================================

const EXECUTION_MODE = {
  PARALLEL: 'parallel',
  SEQUENTIAL: 'sequential',
  PIPELINE: 'pipeline',
  FANOUT: 'fanout',
  FANIN: 'fanin',
  DAGSHED: 'dagshed', // DAG (Directed Acyclic Graph) with deadlock detection
};

const AGENT_STATE = {
  IDLE: 'idle',
  READY: 'ready',
  RUNNING: 'running',
  BLOCKED: 'blocked',
  WAITING: 'waiting',
  COMPLETED: 'completed',
  FAILED: 'failed',
  TIMEOUT: 'timeout',
  DEADLOCK: 'deadlock',
};

const MESSAGE_TYPE = {
  TASK: 'task',
  RESULT: 'result',
  ERROR: 'error',
  ACK: 'ack',
  HEARTBEAT: 'heartbeat',
  STATE_QUERY: 'state_query',
  STATE_UPDATE: 'state_update',
};

const PRIORITY = {
  CRITICAL: 4,
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
  BACKGROUND: 0,
};

// ============================================================================
// Communication Protocol
// ============================================================================

class Message {
  constructor(type, sender, receiver, payload, opts = {}) {
    this.id = opts.id || generateId();
    this.type = type;
    this.sender = sender;
    this.receiver = receiver;
    this.payload = payload;
    this.timestamp = Date.now();
    this.ttl = opts.ttl || 30000; // 30 seconds default
    this.requiresAck = opts.requiresAck !== false;
    this.priority = opts.priority || PRIORITY.NORMAL;
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      sender: this.sender,
      receiver: this.receiver,
      payload: this.payload,
      timestamp: this.timestamp,
      ttl: this.ttl,
      requiresAck: this.requiresAck,
      priority: this.priority,
    };
  }
}

class MessageBroker extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.inbox = new Map(); // agent -> messages[]
    this.outbox = new Map(); // sender -> receiver -> messages[]
    this.acks = new Map(); // message.id -> ack_received
    this.deadLetters = [];
    this.maxRetries = opts.maxRetries || 3;
    this.retryDelay = opts.retryDelay || 1000;
  }

  send(message) {
    if (message.isExpired()) {
      this.deadLetters.push({ message, reason: 'expired' });
      return false;
    }

    if (!this.inbox.has(message.receiver)) {
      this.inbox.set(message.receiver, []);
    }

    this.inbox.get(message.receiver).push(message);
    this.emit('message-sent', { message });

    if (message.requiresAck) {
      this.acks.set(message.id, false);
    }

    return true;
  }

  broadcast(sender, receivers, type, payload, opts = {}) {
    const results = receivers.map((receiver) => {
      const message = new Message(type, sender, receiver, payload, opts);
      return this.send(message);
    });
    return results;
  }

  receive(agentId) {
    return this.inbox.get(agentId) || [];
  }

  clearInbox(agentId) {
    this.inbox.delete(agentId);
  }

  acknowledgeMessage(messageId) {
    if (this.acks.has(messageId)) {
      this.acks.set(messageId, true);
      this.emit('message-acked', { messageId });
    }
  }

  getPendingAcks() {
    const pending = Array.from(this.acks.entries())
      .filter(([_, acked]) => !acked)
      .map(([id]) => id);
    return pending;
  }

  getMetrics() {
    return {
      totalInbox: Array.from(this.inbox.values()).reduce((sum, msgs) => sum + msgs.length, 0),
      totalDeadLetters: this.deadLetters.length,
      pendingAcks: this.getPendingAcks().length,
      inboxByAgent: Object.fromEntries(
        Array.from(this.inbox.entries()).map(([agent, msgs]) => [agent, msgs.length])
      ),
    };
  }
}

// ============================================================================
// Agent & Task Definitions
// ============================================================================

class Agent {
  constructor(id, executor, opts = {}) {
    this.id = id;
    this.executor = executor; // async function(task, context) => result
    this.state = AGENT_STATE.IDLE;
    this.currentTask = null;
    this.completedTasks = [];
    this.failedTasks = [];
    this.timeout = opts.timeout || 30000;
    this.maxRetries = opts.maxRetries || 2;
    this.retryDelay = opts.retryDelay || 1000;
    this.priority = opts.priority || PRIORITY.NORMAL;
    this.capacity = opts.capacity || 1; // max concurrent tasks
    this.activeTasks = 0;
    this.dependencies = opts.dependencies || []; // agent IDs to wait for
    this.sharedState = new Map(); // for sharing data with other agents
    this.metrics = {
      tasksProcessed: 0,
      tasksSuccessful: 0,
      tasksFailed: 0,
      totalDuration: 0,
      totalRetries: 0,
      deadlockDetections: 0,
    };
  }

  async execute(task, context = {}) {
    if (this.activeTasks >= this.capacity) {
      this.state = AGENT_STATE.BLOCKED;
      return { error: 'capacity exceeded' };
    }

    this.activeTasks++;
    this.state = AGENT_STATE.RUNNING;
    this.currentTask = task;

    const startTime = Date.now();
    let attempt = 0;

    while (attempt <= this.maxRetries) {
      try {
        const result = await Promise.race([
          this.executor(task, context),
          this.createTimeout(this.timeout),
        ]);

        this.metrics.tasksProcessed++;
        this.metrics.tasksSuccessful++;
        this.metrics.totalDuration += Date.now() - startTime;
        this.completedTasks.push(task);
        this.state = AGENT_STATE.COMPLETED;
        this.activeTasks--;
        return result;
      } catch (error) {
        attempt++;

        if (attempt <= this.maxRetries) {
          await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
          this.metrics.totalRetries++;
        } else {
          this.metrics.tasksFailed++;
          this.failedTasks.push({ task, error: error.message });
          this.state = AGENT_STATE.FAILED;
          this.activeTasks--;
          return { error: error.message, attempts: attempt };
        }
      }
    }
  }

  createTimeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Agent ${this.id} timeout after ${ms}ms`)), ms)
    );
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  isAvailable() {
    return this.state === AGENT_STATE.IDLE && this.activeTasks < this.capacity;
  }

  getMetrics() {
    return {
      ...this.metrics,
      state: this.state,
      activeTasks: this.activeTasks,
      completedCount: this.completedTasks.length,
      failedCount: this.failedTasks.length,
    };
  }
}

class Task {
  constructor(id, executor, opts = {}) {
    this.id = id;
    this.executor = executor; // agent ID or async function
    this.input = opts.input || null;
    this.output = null;
    this.error = null;
    this.state = AGENT_STATE.IDLE;
    this.priority = opts.priority || PRIORITY.NORMAL;
    this.timeout = opts.timeout || 30000;
    this.maxRetries = opts.maxRetries || 1;
    this.dependencies = opts.dependencies || []; // task IDs
    this.createdAt = Date.now();
    this.startedAt = null;
    this.completedAt = null;
    this.attempts = 0;
  }

  getDuration() {
    if (this.startedAt && this.completedAt) {
      return this.completedAt - this.startedAt;
    }
    if (this.startedAt) {
      return Date.now() - this.startedAt;
    }
    return 0;
  }

  isReady(completedTasks) {
    return this.dependencies.every((depId) =>
      completedTasks.some((t) => t.id === depId && t.state === AGENT_STATE.COMPLETED)
    );
  }

  toJSON() {
    return {
      id: this.id,
      executor: typeof this.executor === 'function' ? 'function' : this.executor,
      state: this.state,
      priority: this.priority,
      timeout: this.timeout,
      dependencies: this.dependencies,
      duration: this.getDuration(),
      attempts: this.attempts,
      input: this.input,
      output: this.output,
      error: this.error,
    };
  }
}

// ============================================================================
// DAG & Deadlock Detection
// ============================================================================

class DependencyGraph {
  constructor() {
    this.nodes = new Map(); // id -> Task
    this.edges = new Map(); // id -> [dependent ids]
  }

  addTask(task) {
    this.nodes.set(task.id, task);
    this.edges.set(task.id, new Set());
  }

  addDependency(taskId, dependencyId) {
    if (!this.edges.has(dependencyId)) {
      this.edges.set(dependencyId, new Set());
    }
    this.edges.get(dependencyId).add(taskId);
  }

  detectCycles() {
    const visited = new Set();
    const recursionStack = new Set();

    const hasCycle = (nodeId) => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const task = this.nodes.get(nodeId);
      if (task) {
        for (const dep of task.dependencies) {
          if (!visited.has(dep)) {
            if (hasCycle(dep)) return true;
          } else if (recursionStack.has(dep)) {
            return true;
          }
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId) && hasCycle(nodeId)) {
        return true;
      }
    }
    return false;
  }

  detectDeadlock(taskStates) {
    // Check for circular wait patterns
    const blocked = new Map();

    for (const [taskId, state] of Object.entries(taskStates)) {
      if (state === AGENT_STATE.BLOCKED || state === AGENT_STATE.WAITING) {
        blocked.set(taskId, new Set());
      }
    }

    for (const taskId of blocked.keys()) {
      const task = this.nodes.get(taskId);
      if (task) {
        for (const dep of task.dependencies) {
          if (blocked.has(dep)) {
            blocked.get(taskId).add(dep);
          }
        }
      }
    }

    // Tarjan's algorithm for SCC (Strongly Connected Components)
    return this.findStronglyConnectedComponents(blocked).some((scc) => scc.size > 1);
  }

  findStronglyConnectedComponents(graph) {
    const sccs = [];
    const visited = new Set();
    const stack = [];

    const dfs1 = (v) => {
      visited.add(v);
      for (const u of graph.get(v) || []) {
        if (!visited.has(u)) dfs1(u);
      }
      stack.push(v);
    };

    for (const v of graph.keys()) {
      if (!visited.has(v)) dfs1(v);
    }

    visited.clear();
    const graphT = this.transposeGraph(graph);

    const dfs2 = (v, component) => {
      visited.add(v);
      component.add(v);
      for (const u of graphT.get(v) || []) {
        if (!visited.has(u)) dfs2(u, component);
      }
    };

    while (stack.length > 0) {
      const v = stack.pop();
      if (!visited.has(v)) {
        const scc = new Set();
        dfs2(v, scc);
        sccs.push(scc);
      }
    }

    return sccs;
  }

  transposeGraph(graph) {
    const transposed = new Map();
    for (const [v] of graph) {
      transposed.set(v, new Set());
    }
    for (const [v, edges] of graph) {
      for (const u of edges) {
        if (!transposed.has(u)) transposed.set(u, new Set());
        transposed.get(u).add(v);
      }
    }
    return transposed;
  }

  topologicalSort() {
    const visited = new Set();
    const stack = [];

    const visit = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const task = this.nodes.get(nodeId);
      if (task) {
        for (const dep of task.dependencies) {
          visit(dep);
        }
      }

      stack.push(nodeId);
    };

    for (const nodeId of this.nodes.keys()) {
      visit(nodeId);
    }

    return stack;
  }
}

// ============================================================================
// Orchestrator
// ============================================================================

class Orchestrator extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.id = generateId();
    this.agents = new Map();
    this.tasks = new Map();
    this.workflows = new Map();
    this.mode = opts.mode || EXECUTION_MODE.PARALLEL;
    this.maxConcurrent = opts.maxConcurrent || 4;
    this.globalTimeout = opts.globalTimeout || 300000; // 5 minutes
    this.deadlockDetectionInterval = opts.deadlockDetectionInterval || 5000;
    this.messageBroker = new MessageBroker();
    this.dependencyGraph = new DependencyGraph();
    this.isRunning = false;
    this.metrics = {
      tasksProcessed: 0,
      tasksSuccessful: 0,
      tasksFailed: 0,
      totalDuration: 0,
      deadlocksDetected: 0,
      timedOutTasks: 0,
    };
    this.taskQueue = [];
    this.activeAgents = new Set();
    this.deadlockCheckInterval = null;
  }

  registerAgent(id, executor, opts = {}) {
    const agent = new Agent(id, executor, opts);
    this.agents.set(id, agent);
    return agent;
  }

  submitTask(id, executor, opts = {}) {
    const task = new Task(id, executor, opts);
    this.tasks.set(id, task);
    this.dependencyGraph.addTask(task);

    for (const dep of task.dependencies) {
      this.dependencyGraph.addDependency(id, dep);
    }

    this.taskQueue.push(task);
    this.emit('task-submitted', { taskId: id });
    return task;
  }

  // ========================================================================
  // Execution Modes
  // ========================================================================

  async runParallel(taskIds = null) {
    const tasksToRun = taskIds
      ? taskIds.map((id) => this.tasks.get(id)).filter(Boolean)
      : Array.from(this.tasks.values());

    const promises = tasksToRun.map((task) => this.executeTask(task));
    await Promise.allSettled(promises);
  }

  async runSequential(taskIds = null) {
    const tasksToRun = taskIds
      ? taskIds.map((id) => this.tasks.get(id)).filter(Boolean)
      : Array.from(this.tasks.values());

    for (const task of tasksToRun) {
      await this.executeTask(task);
    }
  }

  async runPipeline(stages) {
    // stages: [{ tasks: [...], parallel: bool }, ...]
    for (const stage of stages) {
      const stageTasks = stage.tasks.map((id) => this.tasks.get(id)).filter(Boolean);

      if (stage.parallel) {
        await Promise.allSettled(stageTasks.map((t) => this.executeTask(t)));
      } else {
        for (const task of stageTasks) {
          await this.executeTask(task);
        }
      }

      this.emit('stage-completed', { stage: stage.name, taskCount: stageTasks.length });
    }
  }

  async runFanOut(sourceTaskId, dispersalFn) {
    // Fan-out: one task creates multiple subtasks
    const sourceTask = this.tasks.get(sourceTaskId);
    if (!sourceTask) throw new Error(`Task ${sourceTaskId} not found`);

    const result = await this.executeTask(sourceTask);
    const subtaskIds = dispersalFn(result);

    const subtasks = subtaskIds.map((id) => this.tasks.get(id)).filter(Boolean);
    await Promise.allSettled(subtasks.map((t) => this.executeTask(t)));

    return subtasks;
  }

  async runFanIn(taskIds, aggregationFn) {
    // Fan-in: multiple tasks aggregate into one
    const tasks = taskIds.map((id) => this.tasks.get(id)).filter(Boolean);
    const results = await Promise.allSettled(tasks.map((t) => this.executeTask(t)));

    const successResults = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    return aggregationFn(successResults);
  }

  async runDAG() {
    // DAG execution with cycle detection and topological sort
    if (this.dependencyGraph.detectCycles()) {
      throw new Error('Circular dependency detected');
    }

    const sorted = this.dependencyGraph.topologicalSort();
    const executed = new Map();

    for (const taskId of sorted) {
      const task = this.tasks.get(taskId);
      if (!task) continue;

      // Wait for dependencies
      for (const dep of task.dependencies) {
        while (!executed.has(dep)) {
          await this.delay(100);
        }
      }

      await this.executeTask(task);
      executed.set(taskId, true);
    }
  }

  // ========================================================================
  // Task Execution
  // ========================================================================

  async executeTask(task) {
    if (task.state === AGENT_STATE.COMPLETED) {
      return task.output;
    }

    task.state = AGENT_STATE.RUNNING;
    task.startedAt = Date.now();
    task.attempts++;

    this.emit('task-started', { taskId: task.id });

    try {
      // Wait for dependencies
      for (const depId of task.dependencies) {
        const dep = this.tasks.get(depId);
        if (dep && dep.state !== AGENT_STATE.COMPLETED) {
          while (dep.state !== AGENT_STATE.COMPLETED) {
            if (dep.state === AGENT_STATE.FAILED) {
              throw new Error(`Dependency ${depId} failed`);
            }
            await this.delay(100);
          }
        }
      }

      // Execute on agent or inline
      let result;
      if (typeof task.executor === 'string') {
        const agent = this.agents.get(task.executor);
        if (!agent) throw new Error(`Agent ${task.executor} not found`);
        result = await agent.execute(task, { broker: this.messageBroker });
      } else {
        result = await Promise.race([
          task.executor(task.input),
          this.createTimeout(task.timeout),
        ]);
      }

      task.output = result;
      task.state = AGENT_STATE.COMPLETED;
      task.completedAt = Date.now();

      this.metrics.tasksSuccessful++;
      this.emit('task-completed', { taskId: task.id, result });

      return result;
    } catch (error) {
      task.error = error.message;

      if (error.message.includes('timeout')) {
        task.state = AGENT_STATE.TIMEOUT;
        this.metrics.timedOutTasks++;
      } else {
        task.state = AGENT_STATE.FAILED;
      }

      this.metrics.tasksFailed++;
      this.emit('task-failed', { taskId: task.id, error: error.message });

      throw error;
    } finally {
      this.metrics.tasksProcessed++;
    }
  }

  async executeWithConcurrency() {
    while (this.taskQueue.length > 0 || this.activeAgents.size > 0) {
      // Schedule ready tasks
      while (this.activeAgents.size < this.maxConcurrent && this.taskQueue.length > 0) {
        const task = this.taskQueue.shift();
        if (task.isReady(Array.from(this.tasks.values()))) {
          const agentId = typeof task.executor === 'string' ? task.executor : null;
          if (!agentId) {
            this.executeTask(task).catch((e) => this.emit('error', e));
          } else {
            const agent = this.agents.get(agentId);
            if (agent && agent.isAvailable()) {
              this.activeAgents.add(task.id);
              this.executeTask(task)
                .then(() => this.activeAgents.delete(task.id))
                .catch(() => this.activeAgents.delete(task.id));
            } else {
              this.taskQueue.push(task); // re-queue
            }
          }
        } else {
          this.taskQueue.push(task); // re-queue
        }
      }

      await this.delay(100);
    }
  }

  createTimeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timeout after ${ms}ms`)), ms)
    );
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ========================================================================
  // Deadlock Detection & Prevention
  // ========================================================================

  startDeadlockDetection() {
    this.deadlockCheckInterval = setInterval(() => {
      const taskStates = Object.fromEntries(
        Array.from(this.tasks.entries()).map(([id, task]) => [id, task.state])
      );

      if (this.dependencyGraph.detectDeadlock(taskStates)) {
        this.metrics.deadlocksDetected++;
        this.emit('deadlock-detected', { timestamp: Date.now() });

        // Attempt recovery: timeout oldest blocked task
        const oldestBlocked = Array.from(this.tasks.values())
          .filter((t) => t.state === AGENT_STATE.BLOCKED)
          .sort((a, b) => a.startedAt - b.startedAt)[0];

        if (oldestBlocked) {
          oldestBlocked.state = AGENT_STATE.TIMEOUT;
          this.emit('deadlock-recovery', { taskId: oldestBlocked.id });
        }
      }
    }, this.deadlockDetectionInterval);
  }

  stopDeadlockDetection() {
    if (this.deadlockCheckInterval) {
      clearInterval(this.deadlockCheckInterval);
      this.deadlockCheckInterval = null;
    }
  }

  // ========================================================================
  // Run Methods
  // ========================================================================

  async run(mode = this.mode) {
    this.isRunning = true;
    this.startDeadlockDetection();
    const startTime = Date.now();

    try {
      switch (mode) {
        case EXECUTION_MODE.PARALLEL:
          await this.runParallel();
          break;
        case EXECUTION_MODE.SEQUENTIAL:
          await this.runSequential();
          break;
        case EXECUTION_MODE.DAGSHED:
          await this.runDAG();
          break;
        default:
          await this.executeWithConcurrency();
      }
    } finally {
      this.stopDeadlockDetection();
      this.metrics.totalDuration = Date.now() - startTime;
      this.isRunning = false;
      this.emit('orchestration-complete', this.getMetrics());
    }
  }

  // ========================================================================
  // Metrics & Monitoring
  // ========================================================================

  getMetrics() {
    const taskMetrics = Array.from(this.tasks.values()).map((t) => t.toJSON());
    const agentMetrics = Array.from(this.agents.values()).map((a) => ({
      id: a.id,
      ...a.getMetrics(),
    }));

    return {
      orchestratorId: this.id,
      mode: this.mode,
      isRunning: this.isRunning,
      metrics: this.metrics,
      tasks: taskMetrics,
      agents: agentMetrics,
      messageBroker: this.messageBroker.getMetrics(),
      totalTasks: this.tasks.size,
      totalAgents: this.agents.size,
      queueSize: this.taskQueue.length,
      activeAgents: this.activeAgents.size,
    };
  }

  getTaskMetrics(taskId) {
    const task = this.tasks.get(taskId);
    return task ? task.toJSON() : null;
  }

  getAgentMetrics(agentId) {
    const agent = this.agents.get(agentId);
    return agent ? agent.getMetrics() : null;
  }
}

// ============================================================================
// Workflow Definitions
// ============================================================================

class Workflow {
  constructor(name, opts = {}) {
    this.name = name;
    this.description = opts.description || '';
    this.stages = [];
    this.orchestrator = null;
  }

  addStage(name, mode = 'parallel', opts = {}) {
    this.stages.push({
      name,
      mode,
      tasks: [],
      parallel: mode === 'parallel',
      ...opts,
    });
    return this;
  }

  addTask(stageName, taskId, opts = {}) {
    const stage = this.stages.find((s) => s.name === stageName);
    if (!stage) throw new Error(`Stage ${stageName} not found`);
    stage.tasks.push({ id: taskId, ...opts });
    return this;
  }

  async execute(orchestrator) {
    this.orchestrator = orchestrator;

    for (const stage of this.stages) {
      const stageTasks = stage.tasks.map((t) => orchestrator.tasks.get(t.id)).filter(Boolean);

      if (stage.parallel) {
        await Promise.allSettled(stageTasks.map((t) => orchestrator.executeTask(t)));
      } else {
        for (const task of stageTasks) {
          await orchestrator.executeTask(task);
        }
      }
    }

    return orchestrator.getMetrics();
  }
}

// ============================================================================
// Utilities
// ============================================================================

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  Orchestrator,
  Agent,
  Task,
  Message,
  MessageBroker,
  Workflow,
  DependencyGraph,
  EXECUTION_MODE,
  AGENT_STATE,
  MESSAGE_TYPE,
  PRIORITY,
};
