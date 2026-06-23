#!/usr/bin/env node

/**
 * Edge Computing Performance Benchmark
 * Measures latency, throughput, and sync performance
 */

const {
  EdgeNode,
  EdgeCoordinator,
  NODE_ROLES,
  TASK_STATES,
} = require('./edge-computing.js');

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

class EdgeBenchmark {
  constructor(options = {}) {
    this.results = {
      latency: [],
      throughput: 0,
      syncPerformance: [],
      scalability: [],
    };
    this.options = options;
  }

  /**
   * Benchmark 1: Single-Node Latency
   */
  async benchmarkSingleNodeLatency() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Benchmark 1: Single-Node Latency${COLORS.RESET}`);
    console.log('━'.repeat(60));

    const node = new EdgeNode('latency-node', NODE_ROLES.WORKER);
    const iterations = 100;
    const latencies = [];

    console.log(`Running ${iterations} tasks...\n`);

    for (let i = 0; i < iterations; i++) {
      node.submitTask({ goal: `Task ${i}` });

      const start = Date.now();
      await node.processNextTask();
      const latency = Date.now() - start;

      latencies.push(latency);

      if ((i + 1) % 20 === 0) {
        process.stdout.write(`${COLORS.GREEN}${i + 1}${COLORS.RESET} `);
      }
    }
    console.log('\n');

    const sorted = latencies.sort((a, b) => a - b);
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const p50 = sorted[Math.floor(latencies.length * 0.5)];
    const p95 = sorted[Math.floor(latencies.length * 0.95)];
    const p99 = sorted[Math.floor(latencies.length * 0.99)];

    console.log(`${COLORS.CYAN}Results:${COLORS.RESET}`);
    console.log(`  Min: ${sorted[0].toFixed(2)}ms`);
    console.log(`  P50: ${p50.toFixed(2)}ms`);
    console.log(`  P95: ${p95.toFixed(2)}ms (target: <100ms)`);
    console.log(`  P99: ${p99.toFixed(2)}ms`);
    console.log(`  Max: ${sorted[sorted.length - 1].toFixed(2)}ms`);
    console.log(`  Avg: ${avg.toFixed(2)}ms`);

    this.results.latency.push({
      benchmark: 'single-node',
      p50,
      p95,
      p99,
      avg,
      min: sorted[0],
      max: sorted[sorted.length - 1],
    });

    return p95 < 100; // Pass if p95 < 100ms
  }

  /**
   * Benchmark 2: Multi-Node Latency
   */
  async benchmarkMultiNodeLatency() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Benchmark 2: Multi-Node Latency${COLORS.RESET}`);
    console.log('━'.repeat(60));

    const coordinator = new EdgeCoordinator();
    const regions = ['us-west', 'eu-west', 'ap-southeast'];
    const nodes = regions.map((region, idx) =>
      new EdgeNode(`node-${idx}`, NODE_ROLES.WORKER, { region })
    );

    nodes.forEach(node => coordinator.registerNode(node));
    await coordinator.start();

    const iterations = 60; // 20 tasks per node
    const latencies = [];

    console.log(`Distributing ${iterations} tasks across 3 regions...\n`);

    for (let i = 0; i < iterations; i++) {
      const region = regions[i % regions.length];
      const start = Date.now();

      await coordinator.submitTask({ goal: `Task ${i}` }, region);

      // Process on appropriate node
      const node = nodes[regions.indexOf(region)];
      await node.processNextTask();

      const latency = Date.now() - start;
      latencies.push(latency);

      if ((i + 1) % 20 === 0) {
        process.stdout.write(`${COLORS.GREEN}${i + 1}${COLORS.RESET} `);
      }
    }
    console.log('\n');

    const sorted = latencies.sort((a, b) => a - b);
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const p95 = sorted[Math.floor(latencies.length * 0.95)];

    console.log(`${COLORS.CYAN}Results (Multi-Region):${COLORS.RESET}`);
    console.log(`  P95: ${p95.toFixed(2)}ms (target: <100ms global)`);
    console.log(`  Avg: ${avg.toFixed(2)}ms`);

    // Show per-region stats
    const metrics = coordinator.getGlobalMetrics();
    console.log(`\n${COLORS.CYAN}Per-Region Stats:${COLORS.RESET}`);
    metrics.nodes.forEach(nodeMetrics => {
      console.log(`  ${nodeMetrics.nodeId}: p95=${nodeMetrics.latency.p95}ms`);
    });

    this.results.latency.push({
      benchmark: 'multi-node',
      p95,
      avg,
    });

    await coordinator.stop();

    return p95 < 100;
  }

  /**
   * Benchmark 3: Throughput (Tasks/sec)
   */
  async benchmarkThroughput() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Benchmark 3: Throughput (Tasks/sec)${COLORS.RESET}`);
    console.log('━'.repeat(60));

    const coordinator = new EdgeCoordinator();
    const nodes = [];

    // Create 5 nodes
    for (let i = 0; i < 5; i++) {
      const node = new EdgeNode(`throughput-${i}`, NODE_ROLES.WORKER);
      nodes.push(node);
      coordinator.registerNode(node);
    }

    await coordinator.start();

    const taskCount = 500;
    console.log(`Submitting and processing ${taskCount} tasks...\n`);

    const startTime = Date.now();

    // Submit all tasks
    for (let i = 0; i < taskCount; i++) {
      await coordinator.submitTask({ goal: `Task ${i}` });
    }

    // Process tasks
    let processed = 0;
    const processingInterval = setInterval(async () => {
      for (const node of nodes) {
        const task = await node.processNextTask();
        if (task && task.state === TASK_STATES.COMPLETED) {
          processed++;
        }
      }
    }, 10);

    while (processed < taskCount) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const progress = Math.round((processed / taskCount) * 100);
      process.stdout.write(`\r${COLORS.GREEN}${progress}%${COLORS.RESET}`);
    }

    clearInterval(processingInterval);
    const totalTime = Date.now() - startTime;
    const throughput = (taskCount / (totalTime / 1000)).toFixed(2);

    console.log(`\n\n${COLORS.CYAN}Results:${COLORS.RESET}`);
    console.log(`  Total Time: ${totalTime}ms`);
    console.log(`  Throughput: ${throughput} tasks/sec`);
    console.log(`  Time per Task: ${(totalTime / taskCount).toFixed(2)}ms`);

    this.results.throughput = {
      taskCount,
      totalTime,
      tasksPerSec: parseFloat(throughput),
    };

    await coordinator.stop();

    return parseFloat(throughput) > 10; // Pass if > 10 tasks/sec
  }

  /**
   * Benchmark 4: Cloud Sync Performance
   */
  async benchmarkCloudSync() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Benchmark 4: Cloud Sync Performance${COLORS.RESET}`);
    console.log('━'.repeat(60));

    const node = new EdgeNode('sync-node', NODE_ROLES.WORKER);
    const syncCount = 10;
    const syncTimes = [];

    console.log(`Running ${syncCount} sync operations...\n`);

    // Generate completed tasks
    for (let i = 0; i < 50; i++) {
      node.submitTask({ goal: `Task ${i}` });
      await node.processNextTask();
    }

    // Sync multiple times
    for (let i = 0; i < syncCount; i++) {
      const start = Date.now();
      await node.syncWithCloud('https://api.claudient.local/sync');
      const syncTime = Date.now() - start;
      syncTimes.push(syncTime);

      console.log(`Sync ${i + 1}: ${syncTime}ms`);
    }

    const avg = syncTimes.reduce((a, b) => a + b, 0) / syncTimes.length;
    const sorted = syncTimes.sort((a, b) => a - b);
    const p95 = sorted[Math.floor(syncTimes.length * 0.95)];

    console.log(`\n${COLORS.CYAN}Results:${COLORS.RESET}`);
    console.log(`  Avg Sync Time: ${avg.toFixed(2)}ms`);
    console.log(`  P95 Sync Time: ${p95.toFixed(2)}ms`);
    console.log(`  Total Tasks Synced: ${node.completedTasks.filter(t => t.synced).length}`);

    this.results.syncPerformance = {
      avgSyncTime: avg,
      p95SyncTime: p95,
      tasksSynced: node.completedTasks.filter(t => t.synced).length,
    };

    return p95 < 200; // Pass if p95 < 200ms
  }

  /**
   * Benchmark 5: Scalability (1, 3, 5, 10 nodes)
   */
  async benchmarkScalability() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Benchmark 5: Scalability Analysis${COLORS.RESET}`);
    console.log('━'.repeat(60));

    const nodeCounts = [1, 3, 5, 10];
    const taskCount = 100;

    for (const nodeCount of nodeCounts) {
      const coordinator = new EdgeCoordinator();
      const nodes = [];

      for (let i = 0; i < nodeCount; i++) {
        const node = new EdgeNode(`scale-${i}`, NODE_ROLES.WORKER);
        nodes.push(node);
        coordinator.registerNode(node);
      }

      await coordinator.start();

      // Submit and process tasks
      const startTime = Date.now();

      for (let i = 0; i < taskCount; i++) {
        await coordinator.submitTask({ goal: `Task ${i}` });
      }

      let processed = 0;
      const interval = setInterval(async () => {
        for (const node of nodes) {
          const task = await node.processNextTask();
          if (task) processed++;
        }
      }, 10);

      while (processed < taskCount) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      clearInterval(interval);
      const totalTime = Date.now() - startTime;
      const throughput = (taskCount / (totalTime / 1000)).toFixed(2);

      console.log(`${COLORS.YELLOW}${nodeCount} node(s):${COLORS.RESET} ${throughput} tasks/sec (${totalTime}ms)`);

      this.results.scalability.push({
        nodeCount,
        totalTime,
        throughput: parseFloat(throughput),
      });

      await coordinator.stop();
    }

    console.log(`\n${COLORS.CYAN}Scalability Summary:${COLORS.RESET}`);
    this.results.scalability.forEach(result => {
      const efficiency = ((result.throughput / result.nodeCount) * 100).toFixed(1);
      console.log(`  ${result.nodeCount} nodes: ${efficiency}% efficiency per node`);
    });
  }

  /**
   * Run all benchmarks
   */
  async runAll() {
    console.log(`\n${COLORS.BOLD}${COLORS.MAGENTA}╔════════════════════════════════════════════════════════════════╗${COLORS.RESET}`);
    console.log(`${COLORS.BOLD}${COLORS.MAGENTA}║${COLORS.RESET}  ${COLORS.BOLD}${COLORS.CYAN}Edge Computing Performance Benchmark${COLORS.RESET}${COLORS.BOLD}${COLORS.MAGENTA}                    ║${COLORS.RESET}`);
    console.log(`${COLORS.BOLD}${COLORS.MAGENTA}║${COLORS.RESET}  Measures latency, throughput, and scalability${COLORS.BOLD}${COLORS.MAGENTA}             ║${COLORS.RESET}`);
    console.log(`${COLORS.BOLD}${COLORS.MAGENTA}╚════════════════════════════════════════════════════════════════╝${COLORS.RESET}`);

    const results = [];

    results.push(await this.benchmarkSingleNodeLatency());
    results.push(await this.benchmarkMultiNodeLatency());
    results.push(await this.benchmarkThroughput());
    results.push(await this.benchmarkCloudSync());
    await this.benchmarkScalability();

    // Summary
    console.log(`\n${COLORS.BOLD}${COLORS.GREEN}═══ BENCHMARK SUMMARY ═══${COLORS.RESET}\n`);

    const passed = results.filter(r => r).length;
    const total = results.length;

    console.log(`${COLORS.BOLD}Test Results:${COLORS.RESET}`);
    console.log(`  Single-Node Latency: ${results[0] ? '✓' : '✗'}`);
    console.log(`  Multi-Node Latency: ${results[1] ? '✓' : '✗'}`);
    console.log(`  Throughput: ${results[2] ? '✓' : '✗'}`);
    console.log(`  Cloud Sync: ${results[3] ? '✓' : '✗'}`);

    console.log(`\n${COLORS.BOLD}Key Metrics:${COLORS.RESET}`);
    if (this.results.latency.length > 0) {
      const multiNode = this.results.latency.find(l => l.benchmark === 'multi-node');
      if (multiNode) {
        console.log(`  Global P95 Latency: ${multiNode.p95.toFixed(2)}ms`);
      }
    }
    if (this.results.throughput.tasksPerSec) {
      console.log(`  Throughput: ${this.results.throughput.tasksPerSec} tasks/sec`);
    }

    console.log(`\n${COLORS.GREEN}✓${COLORS.RESET} Passed ${passed}/${total} benchmarks\n`);

    return passed === total;
  }
}

// Run benchmarks
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${COLORS.BOLD}edge-benchmark${COLORS.RESET} — Edge computing performance benchmark

${COLORS.BOLD}Usage:${COLORS.RESET}
  node scripts/edge-benchmark.js [command]

${COLORS.BOLD}Commands:${COLORS.RESET}
  latency       Benchmark single-node latency
  multi-latency Benchmark multi-node latency
  throughput    Benchmark task throughput
  sync          Benchmark cloud sync performance
  scale         Benchmark scalability
  all           Run all benchmarks (default)
  help          Show this help message

${COLORS.BOLD}Examples:${COLORS.RESET}
  node scripts/edge-benchmark.js all
  node scripts/edge-benchmark.js latency
  node scripts/edge-benchmark.js throughput
    `);
    return;
  }

  const benchmark = new EdgeBenchmark();

  if (args[0] === 'latency') {
    await benchmark.benchmarkSingleNodeLatency();
  } else if (args[0] === 'multi-latency') {
    await benchmark.benchmarkMultiNodeLatency();
  } else if (args[0] === 'throughput') {
    await benchmark.benchmarkThroughput();
  } else if (args[0] === 'sync') {
    await benchmark.benchmarkCloudSync();
  } else if (args[0] === 'scale') {
    await benchmark.benchmarkScalability();
  } else {
    await benchmark.runAll();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  });
}

module.exports = EdgeBenchmark;
