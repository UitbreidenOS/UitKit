/**
 * SVG Inspector Stress Test
 * Extreme-scale rendering: 1M nodes, concurrent map renders, network latency simulation
 * Tests: memory limits, GC pressure, render queue saturation, cascading failures
 */

const assert = require('assert');
const { performance } = require('perf_hooks');
const { EventEmitter } = require('events');

// Configuration - can be overridden via CLI
let STRESS_CONFIG = {
  nodeCount: 100_000, // Start at 100K, scale to 1M with --mega
  edgeCount: 500_000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  concurrentMapInstances: 5,
  operationsPerInstance: 200,
  networkLatencyMs: [0, 50, 100, 250], // Simulate various latencies
  gcPressure: 'normal', // 'normal', 'high', 'extreme'
  enableNetworkSimulation: true,
  enableMemoryPressure: true,
  timeoutMs: 60_000,
};

// Stress test phases
const STRESS_PHASES = [
  { name: 'startup', duration: 3000, intensity: 0.3 },
  { name: 'ramp-up', duration: 10000, intensity: 0.6 },
  { name: 'peak-load', duration: 15000, intensity: 1.0 },
  { name: 'sustained', duration: 20000, intensity: 0.8 },
  { name: 'burst', duration: 5000, intensity: 1.5 },
  { name: 'cooldown', duration: 10000, intensity: 0.2 },
];

// Ultra-large dataset generator
class MassiveDatasetGenerator {
  constructor(nodeCount, edgeCount) {
    this.nodeCount = nodeCount;
    this.edgeCount = edgeCount;
    this.nodes = [];
    this.edges = [];
    this.generationStats = {
      nodesGenerated: 0,
      edgesGenerated: 0,
      duplicateEdgesSkipped: 0,
      generationTimeMs: 0,
    };
  }

  generate() {
    const startTime = performance.now();
    console.log(`Generating dataset: ${this.nodeCount.toLocaleString()} nodes, ${this.edgeCount.toLocaleString()} edges`);

    this.generateNodesChunked();
    this.generateEdgesChunked();

    this.generationStats.generationTimeMs = performance.now() - startTime;
    return {
      nodes: this.nodes,
      edges: this.edges,
      stats: this.generationStats,
    };
  }

  generateNodesChunked(chunkSize = 10_000) {
    const mapWidth = 50_000;
    const mapHeight = 50_000;
    const chunksCount = Math.ceil(this.nodeCount / chunkSize);

    for (let chunk = 0; chunk < chunksCount; chunk++) {
      const start = chunk * chunkSize;
      const end = Math.min(start + chunkSize, this.nodeCount);

      for (let i = start; i < end; i++) {
        this.nodes.push({
          id: `node-${i}`,
          x: Math.random() * mapWidth,
          y: Math.random() * mapHeight,
          radius: 1 + Math.random() * 5,
          color: this.getRandomColor(),
          cluster: Math.floor(Math.random() * 1000),
          metadata: {
            label: `N${i}`,
            importance: Math.random(),
          },
        });
      }

      this.generationStats.nodesGenerated = end;
      if ((chunk + 1) % Math.max(1, Math.floor(chunksCount / 10)) === 0) {
        console.log(`  ✓ Generated ${end.toLocaleString()} nodes...`);
      }
    }
  }

  generateEdgesChunked(chunkSize = 50_000) {
    const edgeSet = new Set();
    let created = 0;
    const totalChunks = Math.ceil(this.edgeCount / chunkSize);
    let attemptLimit = this.edgeCount * 3; // Prevent infinite loops on large datasets
    let attempts = 0;

    while (created < this.edgeCount && attempts < attemptLimit) {
      const sourceIdx = Math.floor(Math.random() * this.nodeCount);
      const targetIdx = Math.floor(Math.random() * this.nodeCount);
      attempts++;

      if (sourceIdx !== targetIdx) {
        const edgeKey = `${Math.min(sourceIdx, targetIdx)}-${Math.max(sourceIdx, targetIdx)}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          this.edges.push({
            id: `edge-${created}`,
            source: `node-${sourceIdx}`,
            target: `node-${targetIdx}`,
            weight: Math.random() * 100,
            stroke: this.getRandomColor(),
            opacity: 0.1 + Math.random() * 0.2,
          });
          created++;

          if (created % chunkSize === 0) {
            this.generationStats.edgesGenerated = created;
            const chunkNum = Math.floor(created / chunkSize);
            if (chunkNum % Math.max(1, Math.floor(totalChunks / 10)) === 0) {
              console.log(`  ✓ Generated ${created.toLocaleString()} edges...`);
            }
          }
        } else {
          this.generationStats.duplicateEdgesSkipped++;
        }
      }
    }

    this.generationStats.edgesGenerated = created;
    console.log(`  ✓ Final: ${created.toLocaleString()} edges (skipped ${this.generationStats.duplicateEdgesSkipped} duplicates)`);
  }

  getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#52C41A', '#13C2C2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// Network latency simulator
class NetworkLatencySimulator {
  constructor(baseLatencyMs = 0) {
    this.baseLatencyMs = baseLatencyMs;
    this.inFlightRequests = 0;
    this.totalRequests = 0;
    this.failedRequests = 0;
    this.latencies = [];
  }

  async simulateRequest(operation) {
    this.totalRequests++;
    this.inFlightRequests++;

    const latency = this.baseLatencyMs + (Math.random() * this.baseLatencyMs * 0.5);
    const startTime = performance.now();

    return new Promise((resolve) => {
      setTimeout(() => {
        const actualLatency = performance.now() - startTime;
        this.latencies.push(actualLatency);
        this.inFlightRequests--;

        // Simulate occasional network failures
        if (Math.random() < 0.01) { // 1% failure rate
          this.failedRequests++;
          resolve({ success: false, error: 'Network timeout' });
        } else {
          resolve({ success: true, result: operation(), latency: actualLatency });
        }
      }, latency);
    });
  }

  getStats() {
    const sorted = this.latencies.sort((a, b) => a - b);
    return {
      totalRequests: this.totalRequests,
      failedRequests: this.failedRequests,
      successRate: ((this.totalRequests - this.failedRequests) / this.totalRequests * 100).toFixed(2),
      inFlightRequests: this.inFlightRequests,
      p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
      p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
      p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
      max: sorted[sorted.length - 1] || 0,
    };
  }
}

// High-performance SVG renderer with streaming
class StreamingSVGRenderer extends EventEmitter {
  constructor(data, viewportWidth, viewportHeight, instanceId = 0) {
    super();
    this.data = data;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.instanceId = instanceId;
    this.transformMatrix = { translateX: 0, translateY: 0, scale: 1 };
    this.nodeMap = new Map(data.nodes.map(n => [n.id, n]));
    this.renderQueue = [];
    this.renderStats = {
      totalRenders: 0,
      averageRenderTime: 0,
      maxRenderTime: 0,
      queueDepth: 0,
    };
    this.isRendering = false;
  }

  async queueRender(priority = 0) {
    this.renderQueue.push({ priority, timestamp: Date.now() });
    this.renderStats.queueDepth = Math.max(this.renderStats.queueDepth, this.renderQueue.length);

    if (!this.isRendering) {
      await this.processRenderQueue();
    }
  }

  async processRenderQueue() {
    if (this.isRendering || this.renderQueue.length === 0) {
      return;
    }

    this.isRendering = true;

    while (this.renderQueue.length > 0) {
      const task = this.renderQueue.shift();
      const renderStart = performance.now();

      try {
        this.renderBatched();
        const renderTime = performance.now() - renderStart;
        this.renderStats.totalRenders++;
        this.renderStats.averageRenderTime =
          (this.renderStats.averageRenderTime * (this.renderStats.totalRenders - 1) + renderTime) /
          this.renderStats.totalRenders;
        this.renderStats.maxRenderTime = Math.max(this.renderStats.maxRenderTime, renderTime);

        this.emit('render-complete', { renderTime, queueDepth: this.renderQueue.length });
      } catch (error) {
        this.emit('render-error', error);
      }

      // Yield to event loop
      await new Promise(resolve => setImmediate(resolve));
    }

    this.isRendering = false;
  }

  renderBatched(batchSize = 1000) {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.viewportWidth}" height="${this.viewportHeight}">`;
    svg += `<g transform="translate(${this.transformMatrix.translateX},${this.transformMatrix.translateY}) scale(${this.transformMatrix.scale})">`;

    // Render edges in batches
    for (let i = 0; i < this.data.edges.length; i++) {
      const edge = this.data.edges[i];
      const source = this.nodeMap.get(edge.source);
      const target = this.nodeMap.get(edge.target);

      if (source && target) {
        svg += `<line x1="${source.x|0}" y1="${source.y|0}" x2="${target.x|0}" y2="${target.y|0}" stroke="${edge.stroke}" stroke-width="0.3" opacity="${edge.opacity}"/>`;
      }

      // Batch flush for memory efficiency
      if (i % batchSize === 0 && i > 0) {
        svg += '</g></svg>';
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.viewportWidth}" height="${this.viewportHeight}"><g transform="translate(${this.transformMatrix.translateX},${this.transformMatrix.translateY}) scale(${this.transformMatrix.scale})">`;
      }
    }

    // Render nodes
    for (let i = 0; i < this.data.nodes.length; i++) {
      const node = this.data.nodes[i];
      svg += `<circle cx="${node.x|0}" cy="${node.y|0}" r="${node.radius|0}" fill="${node.color}" opacity="0.7"/>`;

      if (i % batchSize === 0 && i > 0) {
        svg += '</g></svg>';
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.viewportWidth}" height="${this.viewportHeight}"><g transform="translate(${this.transformMatrix.translateX},${this.transformMatrix.translateY}) scale(${this.transformMatrix.scale})">`;
      }
    }

    svg += '</g></svg>';
    return svg;
  }

  pan(deltaX, deltaY) {
    this.transformMatrix.translateX += deltaX;
    this.transformMatrix.translateY += deltaY;
  }

  zoom(factor) {
    this.transformMatrix.scale = Math.max(0.1, Math.min(10, this.transformMatrix.scale * factor));
  }

  getMetrics() {
    return {
      scale: this.transformMatrix.scale,
      translateX: this.transformMatrix.translateX,
      translateY: this.transformMatrix.translateY,
      renderStats: { ...this.renderStats },
    };
  }
}

// Stress test orchestrator
class StressTestOrchestrator {
  constructor(data, config) {
    this.data = data;
    this.config = config;
    this.renderers = [];
    this.latencySimulators = [];
    this.metrics = {
      phase: null,
      startTime: 0,
      endTime: 0,
      renderMetrics: [],
      memorySnapshots: [],
      errors: [],
      phaseStats: {},
    };
    this.isRunning = false;
  }

  async initialize() {
    console.log(`\n🚀 Initializing stress test with ${this.config.concurrentMapInstances} concurrent instances...\n`);

    // Create renderer instances
    for (let i = 0; i < this.config.concurrentMapInstances; i++) {
      const renderer = new StreamingSVGRenderer(
        this.data,
        this.config.viewportWidth,
        this.config.viewportHeight,
        i
      );
      this.renderers.push(renderer);

      // Setup network simulators for each instance
      const latency = this.config.networkLatencyMs[i % this.config.networkLatencyMs.length];
      const simulator = new NetworkLatencySimulator(latency);
      this.latencySimulators.push(simulator);
    }

    console.log(`✓ Created ${this.renderers.length} renderer instances`);
    console.log(`✓ Network latencies: ${this.config.networkLatencyMs.map(l => `${l}ms`).join(', ')}\n`);
  }

  async run() {
    console.log(`\n📊 SVG Inspector Stress Test (${this.config.nodeCount.toLocaleString()} nodes)\n`);
    console.log('Phase Breakdown:');
    STRESS_PHASES.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name.padEnd(12)} ${p.duration}ms (intensity: ${p.intensity})`);
    });
    console.log();

    this.metrics.startTime = performance.now();
    this.isRunning = true;

    for (const phase of STRESS_PHASES) {
      if (!this.isRunning) break;

      this.metrics.phase = phase.name;
      this.metrics.phaseStats[phase.name] = {
        operationsAttempted: 0,
        operationsSuccessful: 0,
        operationsFailed: 0,
        startTime: performance.now(),
      };

      await this.runPhase(phase);

      const phaseTime = performance.now() - this.metrics.phaseStats[phase.name].startTime;
      console.log(`  ✓ Phase '${phase.name}' completed in ${phaseTime.toFixed(0)}ms\n`);
    }

    this.metrics.endTime = performance.now();
    this.isRunning = false;
  }

  async runPhase(phase) {
    const phaseStart = performance.now();
    const phaseDeadline = phaseStart + phase.duration;
    let operationCount = 0;

    while (performance.now() < phaseDeadline && this.isRunning) {
      const promises = [];

      // Determine operation count based on phase intensity
      const opsThisBatch = Math.ceil(this.config.concurrentMapInstances * phase.intensity * 2);

      for (let i = 0; i < opsThisBatch; i++) {
        const rendererIdx = i % this.config.concurrentMapInstances;
        promises.push(this.executeStressOperation(rendererIdx, phase));
      }

      await Promise.allSettled(promises);
      operationCount += opsThisBatch;

      // Memory pressure simulation
      if (this.config.enableMemoryPressure && phase.intensity > 0.7) {
        await this.applyMemoryPressure();
      }

      // Yield to event loop
      await new Promise(resolve => setImmediate(resolve));
    }

    this.metrics.phaseStats[phase.name].operationsAttempted = operationCount;

    // Capture memory snapshot
    const memUsage = process.memoryUsage();
    this.metrics.memorySnapshots.push({
      phase: phase.name,
      heapUsed: memUsage.heapUsed / 1024 / 1024,
      external: memUsage.external / 1024 / 1024,
      rss: memUsage.rss / 1024 / 1024,
      timestamp: Date.now(),
    });
  }

  async executeStressOperation(rendererIdx, phase) {
    const renderer = this.renderers[rendererIdx];
    const simulator = this.latencySimulators[rendererIdx];

    if (this.config.enableNetworkSimulation) {
      return simulator.simulateRequest(() => {
        const opType = ['pan', 'zoom', 'panZoom'][Math.floor(Math.random() * 3)];

        switch (opType) {
          case 'pan':
            renderer.pan(Math.random() * 100 - 50, Math.random() * 100 - 50);
            break;
          case 'zoom':
            renderer.zoom(0.9 + Math.random() * 0.2);
            break;
          case 'panZoom':
            renderer.pan(Math.random() * 50 - 25, Math.random() * 50 - 25);
            renderer.zoom(0.95 + Math.random() * 0.1);
            break;
        }

        return renderer.queueRender(Math.random() * 10);
      });
    } else {
      return renderer.queueRender(Math.random() * 10);
    }
  }

  async applyMemoryPressure() {
    // Simulate memory allocation pressure
    const pressureSize = Math.floor(Math.random() * 10_000_000); // 10MB chunks
    const temp = Buffer.alloc(pressureSize);
    await new Promise(resolve => setImmediate(() => {
      temp = null; // Release
      resolve();
    }));
  }

  reportMetrics() {
    const totalTime = this.metrics.endTime - this.metrics.startTime;

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 STRESS TEST RESULTS`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    console.log(`\n⏱️  Duration: ${(totalTime / 1000).toFixed(2)}s`);

    console.log(`\n📈 Per-Phase Statistics:`);
    Object.entries(this.metrics.phaseStats).forEach(([phaseName, stats]) => {
      const successRate = stats.operationsAttempted > 0
        ? (stats.operationsSuccessful / stats.operationsAttempted * 100).toFixed(2)
        : 0;
      console.log(`  ${phaseName.padEnd(12)} Ops: ${stats.operationsAttempted} | Success: ${successRate}%`);
    });

    console.log(`\n💾 Memory Pressure Analysis:`);
    this.metrics.memorySnapshots.forEach(snap => {
      console.log(`  ${snap.phase.padEnd(12)} Heap: ${snap.heapUsed.toFixed(1)}MB | RSS: ${snap.rss.toFixed(1)}MB`);
    });

    if (this.config.enableNetworkSimulation) {
      console.log(`\n🌐 Network Latency Simulation:`);
      this.latencySimulators.forEach((sim, idx) => {
        const stats = sim.getStats();
        console.log(`  Instance ${idx}: ${stats.successRate}% success | P95: ${stats.p95.toFixed(1)}ms | P99: ${stats.p99.toFixed(1)}ms`);
      });
    }

    console.log(`\n🎨 Rendering Performance:`);
    let totalRenders = 0;
    let maxQueueDepth = 0;
    let maxRenderTime = 0;

    this.renderers.forEach((renderer, idx) => {
      const stats = renderer.getMetrics().renderStats;
      totalRenders += stats.totalRenders;
      maxQueueDepth = Math.max(maxQueueDepth, stats.queueDepth);
      maxRenderTime = Math.max(maxRenderTime, stats.maxRenderTime);
      console.log(`  Instance ${idx}: ${stats.totalRenders} renders | Avg: ${stats.averageRenderTime.toFixed(2)}ms | Max: ${stats.maxRenderTime.toFixed(2)}ms`);
    });

    console.log(`\n⚠️  Errors: ${this.metrics.errors.length}`);
    if (this.metrics.errors.length > 0) {
      this.metrics.errors.slice(0, 5).forEach(err => {
        console.log(`  - ${err.message}`);
      });
    }

    console.log(`\n✅ Test completed\n`);
  }
}

// CLI argument parser
function parseArgs() {
  const args = process.argv.slice(2);

  args.forEach(arg => {
    if (arg === '--mega') {
      STRESS_CONFIG.nodeCount = 1_000_000;
      STRESS_CONFIG.edgeCount = 5_000_000;
      STRESS_CONFIG.concurrentMapInstances = 10;
      STRESS_CONFIG.operationsPerInstance = 500;
    } else if (arg === '--max-nodes') {
      STRESS_CONFIG.nodeCount = 1_000_000;
      STRESS_CONFIG.edgeCount = 5_000_000;
    } else if (arg.startsWith('--nodes=')) {
      STRESS_CONFIG.nodeCount = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--edges=')) {
      STRESS_CONFIG.edgeCount = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--instances=')) {
      STRESS_CONFIG.concurrentMapInstances = parseInt(arg.split('=')[1]);
    } else if (arg === '--no-network') {
      STRESS_CONFIG.enableNetworkSimulation = false;
    } else if (arg === '--no-memory-pressure') {
      STRESS_CONFIG.enableMemoryPressure = false;
    } else if (arg === '--high-pressure') {
      STRESS_CONFIG.gcPressure = 'high';
    } else if (arg === '--extreme-pressure') {
      STRESS_CONFIG.gcPressure = 'extreme';
    }
  });
}

// Main execution
async function main() {
  try {
    parseArgs();

    console.log('🎯 SVG Inspector Stress Test Suite\n');
    console.log(`Configuration:`);
    console.log(`  Nodes: ${STRESS_CONFIG.nodeCount.toLocaleString()}`);
    console.log(`  Edges: ${STRESS_CONFIG.edgeCount.toLocaleString()}`);
    console.log(`  Concurrent Instances: ${STRESS_CONFIG.concurrentMapInstances}`);
    console.log(`  Network Simulation: ${STRESS_CONFIG.enableNetworkSimulation}`);
    console.log(`  Memory Pressure: ${STRESS_CONFIG.enableMemoryPressure}\n`);

    // Generate massive dataset
    console.log('📦 Generating massive dataset...\n');
    const generator = new MassiveDatasetGenerator(STRESS_CONFIG.nodeCount, STRESS_CONFIG.edgeCount);
    const { nodes, edges, stats } = generator.generate();
    console.log(`\n✓ Dataset ready: ${nodes.length.toLocaleString()} nodes, ${edges.length.toLocaleString()} edges`);
    console.log(`  Generation time: ${stats.generationTimeMs.toFixed(0)}ms\n`);

    // Run stress test
    const orchestrator = new StressTestOrchestrator({ nodes, edges }, STRESS_CONFIG);
    await orchestrator.initialize();
    await orchestrator.run();

    // Report results
    orchestrator.reportMetrics();

    process.exit(0);
  } catch (error) {
    console.error('❌ Stress test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  MassiveDatasetGenerator,
  StreamingSVGRenderer,
  NetworkLatencySimulator,
  StressTestOrchestrator,
};

// Run if executed directly
if (require.main === module) {
  main();
}
