#!/usr/bin/env node

/**
 * State Management - Real-World Integration Examples
 *
 * Demonstrates practical usage patterns for dont-stop workflows
 * with concurrent agents, conflict resolution, and recovery.
 */

const {
  GlobalStateManager,
  SharedContextStore,
  ConflictResolver,
  CONFLICT_STRATEGIES
} = require('./state-management');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  RESET: '\x1b[0m'
};

// ============================================================================
// EXAMPLE 1: Multi-Agent Task Queue with Conflict Resolution
// ============================================================================

console.log(`\n${COLORS.CYAN}${COLORS.BOLD}Example 1: Multi-Agent Task Queue${COLORS.RESET}\n`);

class TaskQueueExample {
  constructor() {
    this.manager = new GlobalStateManager();
    this.contextStore = new SharedContextStore(this.manager);

    // Initialize task queue
    this.manager.setState({
      tasks: [],
      completedCount: 0,
      failedCount: 0
    });
  }

  // Producer agent - adds tasks
  async produceTask(taskName, priority = 3) {
    console.log(`${COLORS.YELLOW}[Producer]${COLORS.RESET} Creating task: ${taskName}`);

    const tasks = this.manager.getState('tasks') || [];
    const newTask = {
      id: `task-${Date.now()}`,
      name: taskName,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = this.manager.setState({
      tasks: [...tasks, newTask]
    }, {
      description: `Added task: ${taskName}`,
      tags: ['task-added', 'producer']
    });

    console.log(`  ✓ Task added (v${updated.versionNumber})`);
    return newTask;
  }

  // Consumer agent - processes tasks
  async consumeTask(agentId) {
    const tasks = this.manager.getState('tasks') || [];
    const pending = tasks.filter(t => t.status === 'pending');

    if (pending.length === 0) {
      console.log(`${COLORS.YELLOW}[Consumer ${agentId}]${COLORS.RESET} No pending tasks`);
      return null;
    }

    // Pick highest priority task
    const task = pending.sort((a, b) => b.priority - a.priority)[0];
    console.log(`${COLORS.GREEN}[Consumer ${agentId}]${COLORS.RESET} Processing: ${task.name}`);

    // Simulate processing
    await new Promise(r => setTimeout(r, 100 + Math.random() * 200));

    // Mark complete
    const updated = tasks.map(t =>
      t.id === task.id
        ? { ...t, status: 'completed', completedAt: new Date().toISOString() }
        : t
    );

    const result = this.manager.setState({
      tasks: updated,
      completedCount: this.manager.getState('completedCount') + 1
    }, {
      description: `Completed task: ${task.name}`,
      tags: ['task-completed', `agent-${agentId}`]
    });

    console.log(`  ✓ Completed (v${result.versionNumber})\n`);
    return task;
  }

  // Monitor - logs state changes
  enableMonitoring() {
    this.manager.on('state-changed', (event) => {
      const diag = this.manager.getDiagnostics();
      console.log(`${COLORS.MAGENTA}[Monitor]${COLORS.RESET} v${event.version} | ` +
        `Tasks: ${this.manager.getState('tasks').length} | ` +
        `Completed: ${this.manager.getState('completedCount')}\n`);
    });
  }

  async run() {
    this.enableMonitoring();

    // Simulate workflow
    await this.produceTask('Parse config', 5);
    await this.produceTask('Run tests', 4);
    await this.produceTask('Build', 3);

    await this.consumeTask('agent-1');
    await this.consumeTask('agent-2');
    await this.consumeTask('agent-1');
  }
}

// Run Example 1
(async () => {
  const example1 = new TaskQueueExample();
  await example1.run();
})();

// ============================================================================
// EXAMPLE 2: Agent Context Isolation with Shared State
// ============================================================================

setTimeout(() => {
  console.log(`\n${COLORS.CYAN}${COLORS.BOLD}Example 2: Agent Context Isolation${COLORS.RESET}\n`);

  class ContextIsolationExample {
    constructor() {
      this.manager = new GlobalStateManager();
      this.contextStore = new SharedContextStore(this.manager);
    }

    // Each agent has isolated context
    async agent(agentName, work) {
      const context = this.contextStore.getContext(agentName);

      console.log(`${COLORS.YELLOW}[${agentName}]${COLORS.RESET} Starting work...`);

      // Set agent-specific data
      this.contextStore.setContextValue(agentName, 'status', 'busy', {
        startTime: Date.now(),
        currentTask: work.name
      });

      // Simulate work
      await new Promise(r => setTimeout(r, 100 + Math.random() * 100));

      // Update results
      this.contextStore.setContextValue(agentName, 'result', {
        task: work.name,
        duration: Date.now() - context.createdAt,
        success: true
      });

      console.log(`${COLORS.GREEN}[${agentName}]${COLORS.RESET} Complete\n`);
    }

    // Coordinator - checks all agents
    async coordinator() {
      await new Promise(r => setTimeout(r, 300));

      console.log(`${COLORS.MAGENTA}[Coordinator]${COLORS.RESET} Checking agent contexts...\n`);

      const allContexts = this.contextStore.getAllContexts();
      for (const [namespace, context] of Object.entries(allContexts)) {
        console.log(`  ${namespace}:`);
        console.log(`    Status: ${context.data.status || 'idle'}`);
        if (context.data.result) {
          console.log(`    Result: ${JSON.stringify(context.data.result)}`);
        }
      }
      console.log();
    }

    async run() {
      const agents = [
        this.agent('agent-1', { name: 'analyze' }),
        this.agent('agent-2', { name: 'process' }),
        this.agent('agent-3', { name: 'validate' })
      ];

      await Promise.all(agents);
      await this.coordinator();
    }
  }

  const example2 = new ContextIsolationExample();
  example2.run();
}, 1000);

// ============================================================================
// EXAMPLE 3: Checkpoint & Recovery
// ============================================================================

setTimeout(() => {
  console.log(`${COLORS.CYAN}${COLORS.BOLD}Example 3: Checkpoint & Recovery${COLORS.RESET}\n`);

  class CheckpointRecoveryExample {
    constructor() {
      this.manager = new GlobalStateManager();
    }

    async checkpoint(name) {
      const current = this.manager.currentState.versionNumber;
      console.log(`${COLORS.YELLOW}[Checkpoint]${COLORS.RESET} Saving '${name}' at v${current}`);

      return current;
    }

    async riskyOperation() {
      console.log(`${COLORS.YELLOW}[Workflow]${COLORS.RESET} Starting risky operation...`);

      const checkpointV = await this.checkpoint('before-risky');

      try {
        this.manager.setState({ phase: 1 });
        console.log('  ✓ Phase 1 complete');

        this.manager.setState({ phase: 2 });
        console.log('  ✓ Phase 2 complete');

        // Simulate failure
        if (Math.random() > 0.3) {
          throw new Error('Workflow failed at phase 3');
        }

        this.manager.setState({ phase: 3 });
        console.log('  ✓ Phase 3 complete\n');
      } catch (error) {
        console.log(`  ${COLORS.RED}✗ ${error.message}${COLORS.RESET}`);
        console.log(`${COLORS.YELLOW}[Recovery]${COLORS.RESET} Rolling back to v${checkpointV}\n`);

        const rolled = this.manager.rollbackToVersion(checkpointV);
        console.log(`${COLORS.GREEN}✓ Recovered to v${checkpointV}${COLORS.RESET}\n`);
      }
    }

    run() {
      return this.riskyOperation();
    }
  }

  const example3 = new CheckpointRecoveryExample();
  example3.run();
}, 2000);

// ============================================================================
// EXAMPLE 4: Conflict Resolution Strategies
// ============================================================================

setTimeout(() => {
  console.log(`${COLORS.CYAN}${COLORS.BOLD}Example 4: Conflict Resolution${COLORS.RESET}\n`);

  class ConflictResolutionExample {
    constructor() {
      this.manager = new GlobalStateManager();
    }

    demonstrateStrategy(name, strategy) {
      const { StateVersion } = require('./state-management');

      console.log(`${COLORS.MAGENTA}${name}${COLORS.RESET}`);

      const resolver = new ConflictResolver(strategy);

      const local = new StateVersion(1, new Date(Date.now() - 1000).toISOString());
      local.data = { count: 5, name: 'Alice' };

      const incoming = new StateVersion(2, new Date().toISOString());
      incoming.data = { count: 10, role: 'admin' };

      const conflict = resolver.resolve(local, incoming);

      console.log('  Local:    ', JSON.stringify(local.data));
      console.log('  Incoming: ', JSON.stringify(incoming.data));
      console.log('  Result:   ', JSON.stringify(conflict.result?.data || 'null'));
      console.log();
    }

    run() {
      this.demonstrateStrategy('LAST_WRITE_WINS', CONFLICT_STRATEGIES.LAST_WRITE_WINS);
      this.demonstrateStrategy('FIRST_WRITE_WINS', CONFLICT_STRATEGIES.FIRST_WRITE_WINS);
      this.demonstrateStrategy('MERGE', CONFLICT_STRATEGIES.MERGE);
      this.demonstrateStrategy('LATEST_VERSION', CONFLICT_STRATEGIES.LATEST_VERSION);
    }
  }

  const example4 = new ConflictResolutionExample();
  example4.run();
}, 3000);

// ============================================================================
// EXAMPLE 5: State Audit & Comparison
// ============================================================================

setTimeout(() => {
  console.log(`${COLORS.CYAN}${COLORS.BOLD}Example 5: State Audit & Version Comparison${COLORS.RESET}\n`);

  class StateAuditExample {
    constructor() {
      this.manager = new GlobalStateManager();
    }

    async run() {
      // Make several changes
      console.log(`${COLORS.YELLOW}[Audit]${COLORS.RESET} Recording state changes...\n`);

      this.manager.setState({ env: 'development', debug: true }, {
        description: 'Initialize environment'
      });

      this.manager.setState({ env: 'staging', debug: false }, {
        description: 'Deploy to staging'
      });

      this.manager.setState({ env: 'production', debug: false }, {
        description: 'Deploy to production'
      });

      // Show history
      const history = this.manager.getVersionHistory({ limit: 10 });
      console.log(`${COLORS.MAGENTA}Version History:${COLORS.RESET}`);
      history.forEach(v => {
        const time = new Date(v.timestamp).toLocaleTimeString();
        console.log(`  v${v.versionNumber} | ${time} | ${v.metadata.description}`);
      });
      console.log();

      // Compare versions
      console.log(`${COLORS.MAGENTA}Diff v1 → v3:${COLORS.RESET}`);
      const comparison = this.manager.compareVersions(1, 3);
      comparison.differences.forEach(diff => {
        console.log(`  ${diff.path}: ${diff.from} → ${diff.to}`);
      });
      console.log();

      // Export snapshot
      console.log(`${COLORS.MAGENTA}Current State:${COLORS.RESET}`);
      const snapshot = this.manager.exportSnapshot('json');
      console.log(JSON.stringify(JSON.parse(snapshot), null, 2));
      console.log();
    }
  }

  const example5 = new StateAuditExample();
  example5.run();
}, 4000);

// ============================================================================
// EXAMPLE 6: Diagnostics & Monitoring
// ============================================================================

setTimeout(() => {
  console.log(`${COLORS.CYAN}${COLORS.BOLD}Example 6: Diagnostics & Monitoring${COLORS.RESET}\n`);

  class DiagnosticsExample {
    constructor() {
      this.manager = new GlobalStateManager();
    }

    run() {
      // Generate activity
      for (let i = 0; i < 5; i++) {
        this.manager.setState({ iteration: i });
      }

      // Get diagnostics
      const diag = this.manager.getDiagnostics();

      console.log(`${COLORS.MAGENTA}Manager Diagnostics:${COLORS.RESET}`);
      console.log(`├─ Current Version: v${diag.currentVersion}`);
      console.log(`├─ Total Versions: ${diag.totalVersions}`);
      console.log(`├─ Total Changes: ${diag.totalChanges}`);
      console.log(`├─ Active Locks: ${diag.activeLocks}`);
      console.log(`├─ Subscriptions: ${diag.subscriptions}`);
      console.log(`├─ Storage Size: ${diag.storageSize} bytes`);
      console.log(`└─ Last Modified: ${diag.lastModified}`);
      console.log();
    }
  }

  const example6 = new DiagnosticsExample();
  example6.run();
}, 5000);

console.log(`\n${COLORS.CYAN}Examples will complete in ${COLORS.BOLD}~6 seconds${COLORS.RESET}\n`);
